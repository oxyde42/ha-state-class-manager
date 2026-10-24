"""Automatic setup: create state_class_manager.yaml and include it in configuration.yaml.

Pure Python (no Home Assistant imports) so it can be tested on its own.
The configuration.yaml is edited as text, so comments and formatting survive.
Before any change a backup is written; after the change the file is validated
and rolled back if the result is not as expected.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
import os
import re
import shutil
import tempfile
import time

YAML_FILENAME = "state_class_manager.yaml"
PACKAGE_NAME = "state_class_manager"
INCLUDE_LINE = f"{PACKAGE_NAME}: !include {YAML_FILENAME}"
INITIAL_CONTENT = (
    "# Managed by the State Class Manager integration.\n"
    "homeassistant:\n"
    "  customize_glob: {}\n"
)

_RE_HA_BLOCK = re.compile(r"^homeassistant\s*:\s*(#.*)?$")
_RE_HA_INLINE = re.compile(r"^homeassistant\s*:\s*[^\s#]")
_RE_TOPLEVEL = re.compile(r"^[^\s#]")


# --------------------------------------------------------------------------
# Managed entities inside state_class_manager.yaml (pure data helpers)
# --------------------------------------------------------------------------
REMOVED_VALUE = "none"
_ENTITY_ID_RE = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")


def _is_ours(attrs: object) -> bool:
    return (
        isinstance(attrs, dict)
        and str(attrs.get("state_class", "")).lower() == REMOVED_VALUE
    )


def managed_from_data(data: dict) -> set[str]:
    """Entity IDs whose state_class is removed by this file.

    Reads customize_glob (current format) and customize (older versions).
    Wildcard patterns that a user added by hand are ignored.
    """
    ha = (data or {}).get("homeassistant") or {}
    found: set[str] = set()
    for section in ("customize_glob", "customize"):
        for key, attrs in (ha.get(section) or {}).items():
            if _ENTITY_ID_RE.match(str(key)) and _is_ours(attrs):
                found.add(str(key))
    return found


def has_legacy_entries(data: dict) -> bool:
    """True if the file still uses the older `customize:` format."""
    ha = (data or {}).get("homeassistant") or {}
    return any(
        _ENTITY_ID_RE.match(str(k)) and _is_ours(v)
        for k, v in (ha.get("customize") or {}).items()
    )


def apply_managed(data: dict, managed: set[str]) -> dict:
    """Return data with exactly `managed` removed, everything else preserved.

    Entries are written to customize_glob with the exact entity ID as the
    pattern. In Home Assistant, glob entries are merged attribute by attribute
    with the user's own exact `customize:` entries (own entries win on
    conflicts), so the user's other customizations of the same entity survive.
    """
    data = dict(data or {})
    ha = dict(data.get("homeassistant") or {})
    glob = dict(ha.get("customize_glob") or {})
    legacy = dict(ha.get("customize") or {})

    for section in (glob, legacy):
        for key in list(section):
            if _ENTITY_ID_RE.match(str(key)) and _is_ours(section[key]):
                rest = {k: v for k, v in section[key].items() if k != "state_class"}
                if rest:
                    section[key] = rest
                else:
                    del section[key]

    for eid in sorted(managed):
        attrs = dict(glob.get(eid) or {})
        attrs["state_class"] = REMOVED_VALUE
        glob[eid] = attrs

    ha["customize_glob"] = glob
    if legacy:
        ha["customize"] = legacy
    else:
        ha.pop("customize", None)
    data["homeassistant"] = ha
    return data


@dataclass
class SetupResult:
    """Outcome of ensure_setup()."""

    status: str  # created | already | unsupported | error
    detail: str = ""


def already_included(text: str) -> bool:
    """True if an uncommented packages entry including our file exists."""
    code = [line.split("#", 1)[0] for line in text.splitlines()]
    has_packages = any(line.strip().startswith("packages:") for line in code)
    has_include = any(YAML_FILENAME in line and "!include" in line for line in code)
    return has_packages and has_include


def _content(line: str) -> bool:
    stripped = line.strip()
    return bool(stripped) and not stripped.startswith("#")


def _indent(line: str) -> int:
    return len(line) - len(line.lstrip(" "))


def insert_entry(text: str) -> tuple[str | None, str]:
    """Return (new_text, info). new_text is None if the layout is unsupported."""
    nl = "\r\n" if "\r\n" in text else "\n"
    body_text = text[: -len(nl)] if text.endswith(nl) else text
    lines = body_text.split(nl) if body_text else []

    if any(line.startswith("\t") for line in lines):
        return None, "tabs"
    if any(_RE_HA_INLINE.match(line) for line in lines):
        return None, "homeassistant_inline"
    ha_idx = [i for i, line in enumerate(lines) if _RE_HA_BLOCK.match(line)]
    if len(ha_idx) > 1:
        return None, "homeassistant_multiple"

    # No homeassistant: section at all -> append a new one
    if not ha_idx:
        new = list(lines)
        if new and new[-1].strip():
            new.append("")
        new += ["homeassistant:", "  packages:", f"    {INCLUDE_LINE}"]
        return nl.join(new) + nl, "appended"

    start = ha_idx[0]
    end = len(lines)
    for j in range(start + 1, len(lines)):
        if _RE_TOPLEVEL.match(lines[j]):
            end = j
            break
    body = range(start + 1, end)

    child_indent = next((_indent(lines[j]) for j in body if _content(lines[j])), None)

    # Empty homeassistant: section
    if child_indent is None:
        new = lines[: start + 1] + ["  packages:", f"    {INCLUDE_LINE}"] + lines[start + 1 :]
        return nl.join(new) + nl, "empty_section"

    pad = " " * child_indent
    pk_inline = [
        j for j in body if re.match(rf"^{pad}packages\s*:\s*[^\s#]", lines[j])
    ]
    if pk_inline:
        if "!include_dir" in lines[pk_inline[0]]:
            return None, "packages_dir"
        return None, "packages_inline"
    pk_block = [
        j for j in body if re.match(rf"^{pad}packages\s*:\s*(#.*)?$", lines[j])
    ]
    if len(pk_block) > 1:
        return None, "packages_multiple"

    if pk_block:
        j = pk_block[0]
        grand = child_indent + 2
        for k in range(j + 1, end):
            if _content(lines[k]):
                if _indent(lines[k]) > child_indent:
                    grand = _indent(lines[k])
                break
        new = lines[: j + 1] + [" " * grand + INCLUDE_LINE] + lines[j + 1 :]
        return nl.join(new) + nl, "added_to_packages"

    new = (
        lines[: start + 1]
        + [f"{pad}packages:", f"{pad}  {INCLUDE_LINE}"]
        + lines[start + 1 :]
    )
    return nl.join(new) + nl, "added_packages_section"


def _write_atomic(path: str, content: str) -> None:
    directory = os.path.dirname(path) or "."
    fd, tmp = tempfile.mkstemp(dir=directory, prefix=".scm-", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="") as fh:
            fh.write(content)
        if os.path.exists(path):
            shutil.copymode(path, tmp)
        try:
            os.replace(tmp, path)
        except OSError:
            # e.g. single-file bind mounts: fall back to a direct write
            with open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(content)
            os.unlink(tmp)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def ensure_setup(config_dir: str, validate: Callable[[str], object]) -> SetupResult:
    """Create the YAML file and the packages entry. Safe to call repeatedly."""
    yaml_path = os.path.join(config_dir, YAML_FILENAME)
    cfg_path = os.path.join(config_dir, "configuration.yaml")
    try:
        if not os.path.isfile(yaml_path):
            _write_atomic(yaml_path, INITIAL_CONTENT)
        if not os.path.isfile(cfg_path):
            return SetupResult("error", "configuration.yaml not found")

        with open(cfg_path, encoding="utf-8", newline="") as fh:
            original = fh.read()

        if already_included(original):
            return SetupResult("already")

        new_text, info = insert_entry(original)
        if new_text is None:
            return SetupResult("unsupported", info)

        backup = f"{cfg_path}.{PACKAGE_NAME}-{time.strftime('%Y%m%d-%H%M%S')}.bak"
        shutil.copy2(cfg_path, backup)
        _write_atomic(cfg_path, new_text)

        problem = ""
        try:
            data = validate(cfg_path)
            packages = ((data or {}).get("homeassistant") or {}).get("packages") or {}
            if PACKAGE_NAME not in packages:
                problem = "entry not found after writing"
        except Exception as err:  # noqa: BLE001 - any parse problem means rollback
            problem = str(err)

        if problem:
            _write_atomic(cfg_path, original)
            return SetupResult("error", f"validation failed, changes reverted: {problem}")
        return SetupResult("created", os.path.basename(backup))
    except OSError as err:
        return SetupResult("error", str(err))


_REASONS = {
    "fr": {
        "tabs": "le fichier contient des tabulations",
        "homeassistant_inline": "la section homeassistant: est externalisée ou écrite sur une seule ligne",
        "homeassistant_multiple": "la section homeassistant: apparaît plusieurs fois",
        "packages_dir": "packages: pointe vers un répertoire (!include_dir_...)",
        "packages_inline": "packages: est écrit sur une seule ligne",
        "packages_multiple": "packages: apparaît plusieurs fois",
    },
    "es": {
        "tabs": "el archivo contiene tabulaciones",
        "homeassistant_inline": "la sección homeassistant: está externalizada o escrita en una sola línea",
        "homeassistant_multiple": "la sección homeassistant: aparece más de una vez",
        "packages_dir": "packages: apunta a un directorio (!include_dir_...)",
        "packages_inline": "packages: está escrito en una sola línea",
        "packages_multiple": "packages: aparece más de una vez",
    },
    "de": {
        "tabs": "die Datei enthält Tabulatoren",
        "homeassistant_inline": "der Abschnitt homeassistant: ist ausgelagert oder in einer Zeile geschrieben",
        "homeassistant_multiple": "der Abschnitt homeassistant: kommt mehrfach vor",
        "packages_dir": "packages: verweist auf ein Verzeichnis (!include_dir_...)",
        "packages_inline": "packages: ist in einer Zeile geschrieben",
        "packages_multiple": "packages: kommt mehrfach vor",
    },
    "en": {
        "tabs": "the file contains tab characters",
        "homeassistant_inline": "the homeassistant: section is included from elsewhere or written inline",
        "homeassistant_multiple": "the homeassistant: section appears more than once",
        "packages_dir": "packages: points to a directory (!include_dir_...)",
        "packages_inline": "packages: is written inline",
        "packages_multiple": "packages: appears more than once",
    },
}

_TEXT = {
    "fr": {
        "created": "Le fichier `state_class_manager.yaml` a été créé et l'entrée a été ajoutée à `configuration.yaml`. Une copie de sauvegarde de l'ancien fichier se trouve sous `{detail}`. La configuration a été rechargée. Si une modification ne prend pas effet plus tard, redémarrez Home Assistant une fois.",
        "already": "L'entrée dans `configuration.yaml` existait déjà. Rien n'a été modifié.",
        "unsupported": "Votre `configuration.yaml` a une structure qui ne peut pas être modifiée automatiquement ({detail}). Ajoutez la ligne `state_class_manager: !include state_class_manager.yaml` sous `homeassistant:` → `packages:`. Le panneau affiche également les instructions.",
        "error": "La configuration automatique a échoué ({detail}). `configuration.yaml` est resté inchangé. Le panneau affiche les instructions pour la configuration manuelle.",
    },
    "es": {
        "created": "Se ha creado el archivo `state_class_manager.yaml` y se ha añadido la entrada a `configuration.yaml`. Hay una copia de seguridad del archivo anterior en `{detail}`. La configuración se ha recargado. Si más adelante un cambio no surte efecto, reinicia Home Assistant una vez.",
        "already": "La entrada en `configuration.yaml` ya existía. No se ha cambiado nada.",
        "unsupported": "Tu `configuration.yaml` tiene una estructura que no se puede modificar automáticamente ({detail}). Añade la línea `state_class_manager: !include state_class_manager.yaml` bajo `homeassistant:` → `packages:`. El panel también muestra las instrucciones.",
        "error": "La configuración automática ha fallado ({detail}). `configuration.yaml` no se ha modificado. El panel muestra las instrucciones para la configuración manual.",
    },
    "de": {
        "created": "Die Datei `state_class_manager.yaml` wurde angelegt und der Eintrag in der `configuration.yaml` ergänzt. Eine Sicherungskopie der alten Datei liegt unter `{detail}`. Die Konfiguration wurde neu geladen. Sollte eine Änderung später nicht greifen, hilft einmal ein Neustart von Home Assistant.",
        "already": "Die Einbindung in der `configuration.yaml` war bereits vorhanden. Es wurde nichts geändert.",
        "unsupported": "Deine `configuration.yaml` hat eine Struktur, die nicht automatisch geändert werden kann ({detail}). Bitte ergänze unter `homeassistant:` → `packages:` die Zeile `state_class_manager: !include state_class_manager.yaml`. Die Anleitung findest du auch im Panel.",
        "error": "Die automatische Einrichtung ist fehlgeschlagen ({detail}). Die `configuration.yaml` blieb unverändert. Die Anleitung für die manuelle Einrichtung findest du im Panel.",
    },
    "en": {
        "created": "The file `state_class_manager.yaml` was created and the entry was added to `configuration.yaml`. A backup of the old file is stored as `{detail}`. The configuration was reloaded. If a change does not take effect later, restart Home Assistant once.",
        "already": "The entry in `configuration.yaml` already existed. Nothing was changed.",
        "unsupported": "Your `configuration.yaml` has a structure that cannot be changed automatically ({detail}). Please add the line `state_class_manager: !include state_class_manager.yaml` under `homeassistant:` → `packages:`. The panel also shows instructions.",
        "error": "Automatic setup failed ({detail}). `configuration.yaml` was left unchanged. The panel shows the manual instructions.",
    },
}


def describe(result: SetupResult, language: str) -> str:
    """Human readable result text (German or English)."""
    prefix = language.lower()[:2]
    lang = prefix if prefix in ("de", "fr", "es") else "en"
    detail = result.detail
    if result.status == "unsupported":
        detail = _REASONS[lang].get(detail, detail)
    return _TEXT[lang][result.status].format(detail=detail)
