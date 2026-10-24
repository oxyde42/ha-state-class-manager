![State Class Manager](https://raw.githubusercontent.com/oxyde42/ha-state-class-manager/main/images/icon_128.png)

# State Class Manager

[English](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.md) | **Deutsch** | [Français](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.fr.md) | [Español](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.es.md) | [Italiano](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.it.md) | [Nederlands](https://github.com/oxyde42/ha-state-class-manager/blob/main/README.nl.md)

[![Öffne deine Home-Assistant-Instanz und zeige das Repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=oxyde42&repository=ha-state-class-manager&category=integration)

Entferne mit wenigen Klicks die `state_class` von Sensoren, damit Home Assistant für sie keine Statistiken mehr in der Datenbank speichert. Ohne YAML-Handarbeit.

## Wozu ist das gut?

Home Assistant legt für jeden Sensor mit einer `state_class` *Statistiken* an (Kurzzeitwerte alle 5 Minuten, Langzeitwerte stündlich). Die Langzeitstatistiken werden nie gelöscht, die Datenbank wächst deshalb immer weiter. Viele Sensoren (Batteriestand, Signalstärke, Diagnosewerte …) brauchen das nie.

Mit dem State Class Manager wählst du die Sensoren aus, für die du keine Statistik brauchst, und setzt den Haken **Entfernen**. Für diese Sensoren werden keine neuen Statistiken mehr gespeichert. Der normale Verlauf (Verlaufsgrafik, Logbuch) bleibt unberührt.

## Funktionen

- Übersichtliche Liste aller Sensoren mit `state_class`, mit Suche und Filter
- Ein Haken pro Sensor oder „Gefilterte: entfernen“ für die ganze gefilterte Liste
- Änderungen gelten sofort, ein Neustart ist nicht nötig
- Richtet sich selbst ein: legt die YAML-Datei an und trägt sie in die `configuration.yaml` ein (mit Sicherungskopie)
- Oberfläche auf Deutsch, Englisch, Französisch und Spanisch (andere Sprachen zeigen Englisch)

## Voraussetzungen

- Home Assistant 2024.12 oder neuer (Icon und Logo werden ab 2026.3 angezeigt)
- [HACS](https://hacs.xyz) ist installiert

## Installation über HACS

1. Klicke auf den Button oben oder öffne HACS → ⋮ → **Benutzerdefinierte Repositories**, füge `https://github.com/oxyde42/ha-state-class-manager` ein und wähle die Kategorie **Integration**.
2. Suche in HACS nach „State Class Manager“ und klicke auf **Herunterladen**.
3. Starte Home Assistant neu.
4. Füge die Integration hinzu: Klicke auf den Button unten oder gehe zu *Einstellungen → Geräte & Dienste → Integration hinzufügen → State Class Manager*.
5. Lies den Infotext und klicke auf **Absenden**. Die Integration richtet sich selbst ein und zeigt das Ergebnis an. Mit einem weiteren Klick auf **Absenden** schließt du den Vorgang ab.

[![Integration zu deinem Home Assistant hinzufügen.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=state_class_manager)

**Die Integration kann nur ein einziges Mal hinzugefügt werden.**

### Was die Einrichtung automatisch erledigt

- Sie legt die Datei `state_class_manager.yaml` in deinem Konfigurationsordner an.
- Sie ergänzt in der `configuration.yaml` unter `homeassistant:` → `packages:` die Zeile `state_class_manager: !include state_class_manager.yaml`.
- Vorher speichert sie eine Sicherungskopie (`configuration.yaml.state_class_manager-<Datum>.bak`). Danach wird die Datei geprüft und bei einem Problem automatisch zurückgesetzt. Kommentare und Formatierung bleiben erhalten.
- Hat deine `configuration.yaml` einen Aufbau, der sich nicht sicher ändern lässt (zum Beispiel `packages: !include_dir_named packages`), sagt dir das der Dialog. Das Panel zeigt dann eine kurze Anleitung für die manuelle Einrichtung und einen Button „Automatisch einrichten“ für einen neuen Versuch.

## Benutzung

1. Öffne **State Class Manager** in der Seitenleiste.
2. Suche oder filtere die Liste.
3. Setze den Haken **Entfernen** bei Sensoren, die keine Statistik brauchen. Für viele Sensoren auf einmal filterst du die Liste und klickst auf **Gefilterte: entfernen**.
4. Klicke auf **Speichern**. Fertig. Zum Rückgängigmachen den Haken wieder entfernen und erneut speichern.

## Gut zu wissen

- Betroffen sind nur die Statistiken. Der normale Verlauf bleibt unverändert.
- Bereits gespeicherte Statistiken bleiben bestehen. Lösche sie unter *Entwicklerwerkzeuge → Statistiken*, wenn du den Platz freigeben möchtest.
- Entferne keine Sensoren, die du im **Energie-Dashboard** oder in Statistik-Diagrammen nutzt. Sie brauchen ihre `state_class`.
- Technisch schreibt der Manager für die gewählten Entitäten `state_class: none` in die Datei `state_class_manager.yaml` (Abschnitt `homeassistant: customize_glob:`).

## Funktioniert das mit meinen eigenen `customize:`-Einträgen?

Ja. Deine vorhandenen Einträge `customize`, `customize_domain` und `customize_glob` in der `configuration.yaml` (oder in einer eingebundenen `customize.yaml`) bleiben **unangetastet**. Der Manager bindet nur seine eigene kleine Datei als „Package“ ein, und Home Assistant führt beides zusammen.

- Sensoren, die du selbst anpasst (Name, Icon, …), behalten ihre Einstellungen. Der Manager ergänzt nur `state_class: none` für die Sensoren, die du ankreuzt.
- Setzt dein eigener `customize:`-Eintrag für einen Sensor selbst eine `state_class`, **hat dein Eintrag Vorrang**, und der Haken „Entfernen“ bleibt für diesen Sensor wirkungslos. Lösche diese Zeile dann zuerst aus deinem eigenen Eintrag.
- Eigene Muster in `customize_glob` (zum Beispiel `sensor.*_battery`) kannst du weiter nutzen. Der Manager listet solche Muster nicht auf, lässt sie aber unverändert.

## Aufrufen ohne Eintrag in der Seitenleiste

Du brauchst das Panel nur selten? Gehe zu *Einstellungen → Geräte & Dienste → State Class Manager → Konfigurieren* und entferne den Haken bei „Eintrag in der Seitenleiste anzeigen“. Aufrufen kannst du es weiterhin über

- die Adresse `http://<dein-home-assistant>:8123/state-class-manager` (als Lesezeichen speichern),
- einen Button auf einem Dashboard mit dem Navigationspfad `/state-class-manager`,
- den Link im Konfigurationsdialog der Integration.

## Fehlerbehebung

- **Im Panel erscheint „Einrichtung noch nicht abgeschlossen“:** Klicke auf **Automatisch einrichten**. Klappt das nicht, folge der dort angezeigten manuellen Anleitung.
- **In den Entwicklerwerkzeugen → Zustände steht noch die alte `state_class`:** Nach dem Speichern werden die Sensoren automatisch aktualisiert. Bleibt der Wert bestehen, starte Home Assistant einmal neu. In seltenen Fällen setzt die Integration, die den Sensor liefert, den Wert erneut. Eröffne dann bitte ein Issue.
- **Es wird kein Icon angezeigt:** Icons von Custom Integrations zeigt Home Assistant ab Version 2026.3 an. Starte neu und lade die Browserseite neu (Strg+F5).
- **Sicherungsdateien:** Die `.bak`-Dateien neben deiner `configuration.yaml` kannst du jederzeit löschen.

## Deinstallation

Die Einstellungen bleiben wirksam, solange `state_class_manager.yaml` in deiner `configuration.yaml` eingebunden ist, auch ohne die Integration. Damit alle Sensoren ihre `state_class` zurückbekommen, entfernst du **vor** dem Löschen der Integration alle Haken und speicherst. Lösche danach die Integration unter *Einstellungen → Geräte & Dienste* und entferne sie in HACS. Anschließend kannst du `state_class_manager.yaml` und den Eintrag unter `packages:` in der `configuration.yaml` löschen.
