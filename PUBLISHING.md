# Publishing this repository / Repository veröffentlichen

Repository name / Repository-Name: **`ha-state-class-manager`**

## English

1. Create a **public** repository on GitHub named `ha-state-class-manager` (branch `main`).
2. Replace the placeholder in all files: `python3 scripts/set_github_name.py <your-github-name>`
3. Upload the content of this folder (including `custom_components/`, `images/`, `hacs.json`, all `README*.md` files and `.github/`).
4. Set the repository **description** (HACS requires one). Suggestion:
   `HACS integration for Home Assistant: remove the state_class from sensors with a GUI to save database space.`
5. Add these **topics** (HACS requires topics, and they make the repository findable as a HACS integration):
   `hacs`, `hacs-integration`, `home-assistant`, `homeassistant-integration`, `custom-component`, `home-assistant-component`
6. Create a **release** with the tag `v0.2.0` (the same number as `version` in `manifest.json`). HACS only shows versions for releases, not for plain tags.
7. Check the *Actions* tab: the workflow runs hassfest and the HACS validation.

Notes:
- HACS shows only `README.md` (English). The other languages are separate files that are linked at the top of each README.
- All images and links in the READMEs are absolute on purpose, because HACS cannot resolve relative paths.
- For every new version, raise `version` in `manifest.json` and `VERSION` in `const.py`, then create a new release.
- **Naming:** the GitHub repository is `ha-state-class-manager`. The integration itself keeps the domain and folder name `state_class_manager` (`custom_components/state_class_manager/`), because Home Assistant requires the folder name to match the `domain` in `manifest.json`. HACS does not look at the repository name; it recognises an integration by its structure and topics.

## Deutsch

1. Lege auf GitHub ein **öffentliches** Repository `ha-state-class-manager` an (Branch `main`).
2. Platzhalter in allen Dateien ersetzen: `python3 scripts/set_github_name.py <dein-github-name>`
3. Den Inhalt dieses Ordners hochladen (mit `custom_components/`, `images/`, `hacs.json`, allen `README*.md` und `.github/`).
4. **Beschreibung** des Repositories setzen (HACS verlangt eine). Vorschlag:
   `HACS integration for Home Assistant: remove the state_class from sensors with a GUI to save database space.`
5. Diese **Topics** hinzufügen (HACS verlangt Topics, und sie machen das Repository als HACS-Integration auffindbar):
   `hacs`, `hacs-integration`, `home-assistant`, `homeassistant-integration`, `custom-component`, `home-assistant-component`
6. Ein **Release** mit dem Tag `v0.2.0` erstellen (gleiche Nummer wie `version` in der `manifest.json`). HACS zeigt Versionen nur für Releases an, nicht für reine Tags.
7. Im Reiter *Actions* prüfen, ob die Workflows (hassfest und HACS-Prüfung) durchlaufen.

Hinweise:
- HACS zeigt nur die `README.md` (Englisch) an. Die anderen Sprachen sind eigene Dateien, die oben in jeder README verlinkt sind.
- Alle Bilder und Links in den READMEs sind absichtlich absolut, weil HACS relative Pfade nicht auflösen kann.
- Für jede neue Version `version` in der `manifest.json` und `VERSION` in `const.py` erhöhen und ein neues Release erstellen.
- **Benennung:** Das GitHub-Repository heißt `ha-state-class-manager`. Die Integration selbst behält Domain und Ordnernamen `state_class_manager` (`custom_components/state_class_manager/`), weil Home Assistant verlangt, dass der Ordnername zur `domain` in der `manifest.json` passt. HACS wertet den Repository-Namen nicht aus, es erkennt eine Integration an der Struktur und an den Topics.
