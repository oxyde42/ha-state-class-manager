![State Class Manager](https://raw.githubusercontent.com/oxyde42/ha-state-class-manager/main/images/icon_128.png)

# State Class Manager

**English** | [Deutsch](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.de.md) | [Français](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.fr.md) | [Español](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.es.md) | [Italiano](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.it.md) | [Nederlands](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.nl.md)

[![Open your Home Assistant instance and show the repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=oxyde42&repository=ha-state-class-manager&category=integration)

Remove the `state_class` from sensors with a few clicks, so Home Assistant stops storing statistics for them in the database. No YAML editing needed.

## What is it good for?

Home Assistant creates *statistics* for every sensor that has a `state_class` (short-term values every 5 minutes, long-term values every hour). Long-term statistics are kept forever, so the database keeps growing. Many sensors (battery levels, signal strength, diagnostics …) never need this.

With State Class Manager you pick the sensors you do not need statistics for and tick **Remove**. For these sensors no new statistics are stored. The normal history (history graph, logbook) is not affected.

## Features

- Clear list of all sensors with a `state_class`, with search and filter
- One tick per sensor, or “Filtered: remove” for the whole filtered list
- Changes apply immediately, no restart needed
- Sets itself up: creates its YAML file and the entry in your `configuration.yaml` (with a backup)
- Panel available in English, German, French and Spanish (other languages show English)

## Requirements

- Home Assistant 2024.12 or newer (the icon and logo are shown from 2026.3 on)
- [HACS](https://hacs.xyz) installed

## Installation via HACS

1. Click the button above, or open HACS → ⋮ → **Custom repositories**, paste `https://github.com/oxyde42/ha-state-class-manager` and choose the category **Integration**.
2. Search for “State Class Manager” in HACS and click **Download**.
3. Restart Home Assistant.
4. Add the integration: click the button below, or go to *Settings → Devices & services → Add integration → State Class Manager*.
5. Read the info text and click **Submit**. The integration sets itself up and shows the result. Click **Submit** once more to finish.

[![Add the integration to your Home Assistant.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=state_class_manager)

**The integration can only be added once.**

### What the setup does automatically

- It creates the file `state_class_manager.yaml` in your configuration folder.
- It adds the line `state_class_manager: !include state_class_manager.yaml` to your `configuration.yaml` under `homeassistant:` → `packages:`.
- Before that it saves a backup copy (`configuration.yaml.state_class_manager-<date>.bak`). The file is checked afterwards and restored automatically if anything looks wrong. Comments and formatting are kept.
- If your `configuration.yaml` has a layout that cannot be changed safely (for example `packages: !include_dir_named packages`), the dialog tells you. The panel then shows short manual instructions and a “Set up automatically” button for another try.

## How to use it

1. Open **State Class Manager** in the sidebar.
2. Search or filter the list.
3. Tick **Remove** for sensors that do not need statistics. For many sensors at once, filter the list and click **Filtered: remove**.
4. Click **Save**. Done. To undo, untick the box and save again.

## Good to know

- Only statistics are affected. The normal history stays as it is.
- Statistics that were already stored remain. Delete them under *Developer tools → Statistics* if you want to free the space.
- Do not remove sensors you use in the **Energy dashboard** or in statistics graph cards. They need their `state_class`.
- Technically, the manager writes `state_class: none` for the chosen entities into `state_class_manager.yaml` (section `homeassistant: customize_glob:`).

## Does it work with my own `customize:` entries?

Yes. Your existing `customize`, `customize_domain` and `customize_glob` entries in the `configuration.yaml` (or in an included `customize.yaml`) are **not touched**. The manager only adds its own small file as a “package”, and Home Assistant combines both.

- Sensors you customize yourself (name, icon, …) keep their settings. The manager only adds `state_class: none` for the sensors you tick.
- If your own `customize:` entry for a sensor sets a `state_class` itself, **your entry takes precedence** and ticking “Remove” has no effect for that sensor. Delete that line from your own entry first.
- You can keep using patterns in your own `customize_glob` (for example `sensor.*_battery`). The manager does not list such patterns, but it leaves them alone.

## Open it without the sidebar entry

You do not use this panel often? Go to *Settings → Devices & services → State Class Manager → Configure* and untick “Show entry in the sidebar”. You can still open it via

- the address `http://<your-home-assistant>:8123/state-class-manager` (save it as a bookmark),
- a button on a dashboard with the navigation path `/state-class-manager`,
- the link in the configuration dialog of the integration.

## Troubleshooting

- **“Setup not finished yet” appears in the panel:** click **Set up automatically**. If that does not work, follow the manual steps shown there.
- **The value still shows the old `state_class` in Developer tools → States:** after saving, the sensors are updated automatically. If it stays, restart Home Assistant once. In rare cases the integration that provides the sensor sets the value again; please open an issue then.
- **No icon is shown:** icons of custom integrations are displayed from Home Assistant 2026.3. Restart and reload the browser page (Ctrl+F5).
- **Backup files:** the `.bak` files next to your `configuration.yaml` can be deleted whenever you like.

## Uninstall

The settings stay active as long as `state_class_manager.yaml` is included in your `configuration.yaml`, even without the integration. To give all sensors their `state_class` back, untick everything and save **before** you remove the integration. Then delete the integration under *Settings → Devices & services* and remove it in HACS. Afterwards you may delete `state_class_manager.yaml` and its entry under `packages:` in the `configuration.yaml`.
