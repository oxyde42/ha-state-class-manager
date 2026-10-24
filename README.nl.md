![State Class Manager](https://raw.githubusercontent.com/YOUR-GITHUB-NAME/ha-state-class-manager/main/images/icon_128.png)

# State Class Manager

[English](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.md) | [Deutsch](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.de.md) | [Français](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.fr.md) | [Español](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.es.md) | [Italiano](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.it.md) | **Nederlands**

[![Open je Home Assistant-installatie en toon de repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=YOUR-GITHUB-NAME&repository=ha-state-class-manager&category=integration)

Verwijder met een paar klikken de `state_class` van sensoren, zodat Home Assistant er geen statistieken meer voor in de database opslaat. Zonder YAML met de hand te bewerken.

## Waar is het goed voor?

Home Assistant maakt *statistieken* aan voor elke sensor met een `state_class` (kortetermijnwaarden elke 5 minuten, langetermijnwaarden elk uur). Langetermijnstatistieken worden nooit verwijderd, waardoor de database blijft groeien. Veel sensoren (batterijniveau, signaalsterkte, diagnostiek …) hebben dat nooit nodig.

Met State Class Manager kies je de sensoren waarvoor je geen statistieken nodig hebt en vink je **Remove** (Verwijderen) aan. Voor die sensoren worden geen nieuwe statistieken meer opgeslagen. De gewone geschiedenis (geschiedenisgrafiek, logboek) blijft ongewijzigd.

## Functies

- Overzichtelijke lijst van alle sensoren met een `state_class`, met zoeken en filteren
- Eén vinkje per sensor, of “Filtered: remove” voor de hele gefilterde lijst
- Wijzigingen gelden direct, opnieuw opstarten is niet nodig
- Richt zichzelf in: maakt het eigen YAML-bestand aan en voegt de regel toe aan je `configuration.yaml` (met back-up)
- Paneel beschikbaar in het Engels, Duits, Frans en Spaans (andere talen tonen Engels)

## Vereisten

- Home Assistant 2024.12 of nieuwer (pictogram en logo worden getoond vanaf 2026.3)
- [HACS](https://hacs.xyz) is geïnstalleerd

## Installatie via HACS

1. Klik op de knop hierboven, of open HACS → ⋮ → **Aangepaste repositories**, plak `https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager` en kies de categorie **Integratie**.
2. Zoek in HACS naar “State Class Manager” en klik op **Downloaden**.
3. Start Home Assistant opnieuw op.
4. Voeg de integratie toe: klik op de knop hieronder, of ga naar *Instellingen → Apparaten & diensten → Integratie toevoegen → State Class Manager*.
5. Lees de informatietekst en klik op **Verzenden**. De integratie richt zichzelf in en toont het resultaat. Klik nog een keer op **Verzenden** om af te ronden.

[![Voeg de integratie toe aan je Home Assistant.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=state_class_manager)

**De integratie kan maar één keer worden toegevoegd.**

### Wat de installatie automatisch doet

- Ze maakt het bestand `state_class_manager.yaml` aan in je configuratiemap.
- Ze voegt de regel `state_class_manager: !include state_class_manager.yaml` toe aan je `configuration.yaml`, onder `homeassistant:` → `packages:`.
- Eerst slaat ze een back-up op (`configuration.yaml.state_class_manager-<datum>.bak`). Daarna wordt het bestand gecontroleerd en bij een probleem automatisch teruggezet. Opmerkingen en opmaak blijven behouden.
- Heeft je `configuration.yaml` een opbouw die niet veilig automatisch kan worden aangepast (bijvoorbeeld `packages: !include_dir_named packages`), dan meldt het dialoogvenster dat. Het paneel toont dan een korte handmatige handleiding en een knop “Set up automatically” om het opnieuw te proberen.

## Gebruik

1. Open **State Class Manager** in de zijbalk.
2. Zoek of filter de lijst.
3. Vink **Remove** aan bij sensoren die geen statistieken nodig hebben. Voor veel sensoren tegelijk filter je de lijst en klik je op **Filtered: remove**.
4. Klik op **Save**. Klaar. Om ongedaan te maken vink je het vakje weer uit en sla je opnieuw op.

## Goed om te weten

- Alleen de statistieken worden beïnvloed. De gewone geschiedenis blijft zoals ze is.
- Al opgeslagen statistieken blijven bestaan. Verwijder ze onder *Ontwikkelaarsgereedschappen → Statistieken* als je ruimte wilt vrijmaken.
- Verwijder geen sensoren die je gebruikt in het **Energiedashboard** of in statistiekgrafiekkaarten. Ze hebben hun `state_class` nodig.
- Technisch schrijft de manager `state_class: none` voor de gekozen entiteiten naar het bestand `state_class_manager.yaml` (sectie `homeassistant: customize_glob:`).

## Werkt het met mijn eigen `customize:`-regels?

Ja. Je bestaande regels `customize`, `customize_domain` en `customize_glob` in de `configuration.yaml` (of in een ingevoegde `customize.yaml`) worden **niet aangeraakt**. De manager voegt alleen zijn eigen kleine bestand toe als “package”, en Home Assistant combineert beide.

- Sensoren die je zelf aanpast (naam, pictogram, …) behouden hun instellingen. De manager voegt alleen `state_class: none` toe voor de sensoren die je aanvinkt.
- Stelt je eigen `customize:`-regel voor een sensor zelf een `state_class` in, dan **heeft jouw regel voorrang** en heeft het vinkje “Remove” voor die sensor geen effect. Verwijder die regel eerst uit je eigen invoer.
- Je kunt patronen in je eigen `customize_glob` blijven gebruiken (bijvoorbeeld `sensor.*_battery`). De manager toont zulke patronen niet, maar laat ze ongemoeid.

## Openen zonder vermelding in de zijbalk

Gebruik je dit paneel zelden? Ga naar *Instellingen → Apparaten & diensten → State Class Manager → Configureren* en haal het vinkje bij “Show entry in the sidebar” weg. Je kunt het nog steeds openen via

- het adres `http://<jouw-home-assistant>:8123/state-class-manager` (sla het op als bladwijzer),
- een knop op een dashboard met het navigatiepad `/state-class-manager`,
- de link in het configuratiedialoogvenster van de integratie.

## Problemen oplossen

- **In het paneel verschijnt “Setup not finished yet”:** klik op **Set up automatically**. Lukt dat niet, volg dan de getoonde handmatige stappen.
- **Bij Ontwikkelaarsgereedschappen → Statussen staat nog de oude `state_class`:** na het opslaan worden de sensoren automatisch bijgewerkt. Blijft de waarde staan, start Home Assistant dan één keer opnieuw op. In zeldzame gevallen stelt de integratie die de sensor levert de waarde opnieuw in; open dan een issue.
- **Er wordt geen pictogram getoond:** Home Assistant toont pictogrammen van aangepaste integraties vanaf versie 2026.3. Start opnieuw op en vernieuw de browserpagina (Ctrl+F5).
- **Back-upbestanden:** de `.bak`-bestanden naast je `configuration.yaml` kun je altijd verwijderen.

## Verwijderen

De instellingen blijven actief zolang `state_class_manager.yaml` in je `configuration.yaml` is opgenomen, ook zonder de integratie. Om alle sensoren hun `state_class` terug te geven, haal je **voordat** je de integratie verwijdert alle vinkjes weg en sla je op. Verwijder daarna de integratie onder *Instellingen → Apparaten & diensten* en verwijder ze in HACS. Daarna kun je `state_class_manager.yaml` en de regel onder `packages:` in de `configuration.yaml` verwijderen.
