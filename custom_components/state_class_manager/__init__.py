"""State Class Manager: remove state_class from sensors via a GUI panel.

Selected entities are written to <config>/state_class_manager.yaml as
`homeassistant: customize: <entity>: state_class: none`. The file is loaded
through a package entry in configuration.yaml (see README).
"""

from __future__ import annotations

import asyncio
import logging
import os
from pathlib import Path
from typing import Any

import voluptuous as vol

from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.util.yaml import load_yaml, save_yaml

from .setup_helper import (
    SetupResult,
    already_included,
    apply_managed,
    describe,
    ensure_setup,
    has_legacy_entries,
    managed_from_data,
)
from .const import (
    CONF_SHOW_IN_SIDEBAR,
    DOMAIN,
    PACKAGE_NAME,
    PANEL_URL_PATH,
    REMOVED_VALUE,
    STATIC_URL,
    VERSION,
    YAML_FILENAME,
)

_LOGGER = logging.getLogger(__name__)
_KEY_STATIC = f"{DOMAIN}_static_registered"
_KEY_WS = f"{DOMAIN}_ws_registered"


# --------------------------------------------------------------------------
# YAML handling (runs in executor)
# --------------------------------------------------------------------------
def _load(path: str) -> dict[str, Any]:
    if not os.path.isfile(path):
        return {}
    data = load_yaml(path)
    return dict(data) if isinstance(data, dict) else {}


def _read_managed(path: str) -> set[str]:
    return managed_from_data(_load(path))


def _write_managed(path: str, managed: set[str]) -> None:
    """Write the managed set, keeping unrelated keys in the file untouched."""
    save_yaml(path, apply_managed(_load(path), managed))


def _migrate_legacy(path: str) -> None:
    """Move entries of older versions (customize:) to customize_glob:."""
    data = _load(path)
    if has_legacy_entries(data):
        save_yaml(path, apply_managed(data, managed_from_data(data)))


def _yaml_path(hass: HomeAssistant) -> str:
    return hass.config.path(YAML_FILENAME)


def _config_includes_file(config_path: str) -> bool:
    """Check configuration.yaml for an uncommented !include of our YAML file."""
    try:
        with open(config_path, encoding="utf-8") as fh:
            return already_included(fh.read())
    except OSError:
        return False


async def _package_active(hass: HomeAssistant) -> bool:
    """True if the package entry exists in configuration.yaml or is loaded by HA."""
    if PACKAGE_NAME in (getattr(hass.config, "packages", None) or {}):
        return True
    return await hass.async_add_executor_job(
        _config_includes_file, hass.config.path("configuration.yaml")
    )


async def _reload_and_refresh(hass: HomeAssistant, entity_ids: set[str]) -> None:
    """Reload customize and force the affected entities to rewrite their state.

    Customize values are only applied when an entity writes its state, so
    existing state objects keep the old state_class until that happens.
    """
    await hass.services.async_call(
        "homeassistant", "reload_core_config", blocking=True
    )
    existing = sorted(e for e in entity_ids if hass.states.get(e) is not None)
    if not existing:
        return
    try:
        async with asyncio.timeout(10):
            await hass.services.async_call(
                "homeassistant",
                "update_entity",
                {"entity_id": existing},
                blocking=True,
            )
    except (TimeoutError, HomeAssistantError) as err:
        _LOGGER.debug("update_entity did not finish cleanly: %s", err)


# --------------------------------------------------------------------------
# WebSocket API
# --------------------------------------------------------------------------
@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/list"})
@websocket_api.async_response
async def ws_list(hass: HomeAssistant, connection, msg: dict) -> None:
    managed = await hass.async_add_executor_job(_read_managed, _yaml_path(hass))
    registry = er.async_get(hass)
    items: list[dict[str, Any]] = []
    seen: set[str] = set()

    for state in hass.states.async_all("sensor"):
        sc = state.attributes.get("state_class")
        eid = state.entity_id
        is_managed = eid in managed
        if sc in (None, REMOVED_VALUE) and not is_managed:
            continue
        entry = registry.async_get(eid)
        items.append(
            {
                "entity_id": eid,
                "name": state.attributes.get("friendly_name") or eid,
                "state_class": None if sc == REMOVED_VALUE else sc,
                "device_class": state.attributes.get("device_class"),
                "unit": state.attributes.get("unit_of_measurement"),
                "platform": entry.platform if entry else None,
                "managed": is_managed,
            }
        )
        seen.add(eid)

    for eid in managed - seen:
        entry = registry.async_get(eid)
        items.append(
            {
                "entity_id": eid,
                "name": (entry.name or entry.original_name) if entry else eid,
                "state_class": None,
                "device_class": None,
                "unit": None,
                "platform": entry.platform if entry else None,
                "managed": True,
            }
        )

    items.sort(key=lambda i: i["entity_id"])
    connection.send_result(
        msg["id"],
        {
            "items": items,
            "package_active": await _package_active(hass),
            "yaml_file": YAML_FILENAME,
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/set",
        vol.Required("remove"): [str],
        vol.Required("restore"): [str],
    }
)
@websocket_api.async_response
async def ws_set(hass: HomeAssistant, connection, msg: dict) -> None:
    path = _yaml_path(hass)
    try:
        managed = await hass.async_add_executor_job(_read_managed, path)
        managed = (managed - set(msg["restore"])) | set(msg["remove"])
        await hass.async_add_executor_job(_write_managed, path, managed)
        await _reload_and_refresh(hass, managed | set(msg["restore"]))
    except (HomeAssistantError, OSError) as err:
        _LOGGER.error("Could not update %s: %s", YAML_FILENAME, err)
        connection.send_error(msg["id"], "write_failed", str(err))
        return
    connection.send_result(
        msg["id"],
        {"managed": len(managed), "package_active": await _package_active(hass)},
    )


async def async_run_setup(hass: HomeAssistant) -> tuple[SetupResult, str]:
    """Create the YAML file and the packages entry, then reload the config."""
    result = await hass.async_add_executor_job(
        ensure_setup, hass.config.config_dir, load_yaml
    )
    if result.status == "created":
        try:
            await hass.services.async_call(
                "homeassistant", "reload_core_config", blocking=True
            )
        except HomeAssistantError as err:
            _LOGGER.warning("Reload after setup failed: %s", err)
    if result.status in ("unsupported", "error"):
        _LOGGER.warning("Automatic setup: %s (%s)", result.status, result.detail)
    return result, describe(result, hass.config.language)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/setup"})
@websocket_api.async_response
async def ws_setup(hass: HomeAssistant, connection, msg: dict) -> None:
    result, text = await async_run_setup(hass)
    connection.send_result(
        msg["id"],
        {
            "status": result.status,
            "message": text,
            "package_active": await _package_active(hass),
        },
    )


# --------------------------------------------------------------------------
# Setup
# --------------------------------------------------------------------------
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    domain_data = hass.data.setdefault(DOMAIN, {})

    if not domain_data.get(_KEY_STATIC):
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    STATIC_URL,
                    str(Path(__file__).parent / "frontend"),
                    cache_headers=False,
                )
            ]
        )
        domain_data[_KEY_STATIC] = True

    if not domain_data.get(_KEY_WS):
        websocket_api.async_register_command(hass, ws_list)
        websocket_api.async_register_command(hass, ws_set)
        websocket_api.async_register_command(hass, ws_setup)
        domain_data[_KEY_WS] = True

    show_sidebar = entry.options.get(CONF_SHOW_IN_SIDEBAR, True)
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="state-class-manager-panel",
        frontend_url_path=PANEL_URL_PATH,
        module_url=f"{STATIC_URL}/state-class-manager-panel.js?v={VERSION}",
        sidebar_title="State Class Manager" if show_sidebar else None,
        sidebar_icon="mdi:chart-line-variant" if show_sidebar else None,
        require_admin=True,
    )

    # Make sure the YAML file exists so the !include in configuration.yaml works.
    path = _yaml_path(hass)
    if not await hass.async_add_executor_job(os.path.isfile, path):
        await hass.async_add_executor_job(_write_managed, path, set())
    else:
        await hass.async_add_executor_job(_migrate_legacy, path)

    entry.async_on_unload(entry.add_update_listener(_options_updated))
    return True


async def _options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Re-register the panel when the sidebar option changes."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return True
