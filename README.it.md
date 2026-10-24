![State Class Manager](https://raw.githubusercontent.com/YOUR-GITHUB-NAME/ha-state-class-manager/main/images/icon_128.png)

# State Class Manager

[English](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.md) | [Deutsch](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.de.md) | [Français](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.fr.md) | [Español](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.es.md) | **Italiano** | [Nederlands](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.nl.md)

[![Apri la tua istanza di Home Assistant e mostra il repository in HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=YOUR-GITHUB-NAME&repository=ha-state-class-manager&category=integration)

Rimuovi la `state_class` dai sensori con pochi clic, così Home Assistant smette di salvare le loro statistiche nel database. Senza modificare il YAML a mano.

## A cosa serve?

Home Assistant crea *statistiche* per ogni sensore con una `state_class` (valori a breve termine ogni 5 minuti, valori a lungo termine ogni ora). Le statistiche a lungo termine non vengono mai eliminate, quindi il database continua a crescere. Molti sensori (livello batteria, intensità del segnale, diagnostica …) non ne hanno mai bisogno.

Con State Class Manager scegli i sensori per cui non servono statistiche e spunti **Remove** (Rimuovi). Per questi sensori non vengono più salvate nuove statistiche. La cronologia normale (grafico cronologia, registro) non viene toccata.

## Funzioni

- Elenco chiaro di tutti i sensori con `state_class`, con ricerca e filtro
- Una casella per sensore, oppure «Filtered: remove» per l'intero elenco filtrato
- Le modifiche valgono subito, senza riavvio
- Si configura da solo: crea il proprio file YAML e la voce nel tuo `configuration.yaml` (con backup)
- Pannello disponibile in inglese, tedesco, francese e spagnolo (le altre lingue mostrano l'inglese)

## Requisiti

- Home Assistant 2024.12 o più recente (icona e logo vengono mostrati dalla 2026.3)
- [HACS](https://hacs.xyz) installato

## Installazione tramite HACS

1. Clicca sul pulsante qui sopra, oppure apri HACS → ⋮ → **Repository personalizzati**, incolla `https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager` e scegli la categoria **Integrazione**.
2. Cerca «State Class Manager» in HACS e clicca su **Scarica**.
3. Riavvia Home Assistant.
4. Aggiungi l'integrazione: clicca sul pulsante qui sotto, oppure vai su *Impostazioni → Dispositivi e servizi → Aggiungi integrazione → State Class Manager*.
5. Leggi il testo informativo e clicca su **Invia**. L'integrazione si configura da sola e mostra il risultato. Clicca ancora una volta su **Invia** per terminare.

[![Aggiungi l'integrazione al tuo Home Assistant.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=state_class_manager)

**L'integrazione può essere aggiunta una sola volta.**

### Cosa fa automaticamente la configurazione

- Crea il file `state_class_manager.yaml` nella tua cartella di configurazione.
- Aggiunge la riga `state_class_manager: !include state_class_manager.yaml` nel tuo `configuration.yaml`, sotto `homeassistant:` → `packages:`.
- Prima salva una copia di backup (`configuration.yaml.state_class_manager-<data>.bak`). Poi il file viene controllato e, in caso di problemi, ripristinato automaticamente. Commenti e formattazione vengono mantenuti.
- Se il tuo `configuration.yaml` ha una struttura che non può essere modificata in sicurezza (ad esempio `packages: !include_dir_named packages`), la finestra di dialogo te lo segnala. Il pannello mostra allora brevi istruzioni manuali e un pulsante «Set up automatically» per riprovare.

## Utilizzo

1. Apri **State Class Manager** nella barra laterale.
2. Cerca o filtra l'elenco.
3. Spunta **Remove** per i sensori che non richiedono statistiche. Per molti sensori insieme, filtra l'elenco e clicca su **Filtered: remove**.
4. Clicca su **Save**. Fatto. Per annullare, deseleziona la casella e salva di nuovo.

## Da sapere

- Sono interessate solo le statistiche. La cronologia normale resta invariata.
- Le statistiche già salvate restano. Eliminale in *Strumenti per sviluppatori → Statistiche* se vuoi liberare spazio.
- Non rimuovere i sensori usati nella **dashboard Energia** o nelle card con grafici statistici. Hanno bisogno della loro `state_class`.
- Tecnicamente, il gestore scrive `state_class: none` per le entità scelte nel file `state_class_manager.yaml` (sezione `homeassistant: customize_glob:`).

## Funziona con le mie voci `customize:`?

Sì. Le tue voci esistenti `customize`, `customize_domain` e `customize_glob` in `configuration.yaml` (o in un `customize.yaml` incluso) **non vengono toccate**. Il gestore aggiunge solo il proprio piccolo file come «package» e Home Assistant unisce entrambi.

- I sensori che personalizzi tu stesso (nome, icona, …) mantengono le loro impostazioni. Il gestore aggiunge solo `state_class: none` per i sensori che spunti.
- Se la tua voce `customize:` imposta essa stessa una `state_class` per un sensore, **la tua voce ha la precedenza** e la casella «Remove» non ha effetto per quel sensore. Elimina prima quella riga dalla tua voce.
- Puoi continuare a usare pattern nel tuo `customize_glob` (ad esempio `sensor.*_battery`). Il gestore non elenca questi pattern, ma li lascia invariati.

## Aprirlo senza voce nella barra laterale

Usi raramente questo pannello? Vai su *Impostazioni → Dispositivi e servizi → State Class Manager → Configura* e deseleziona «Show entry in the sidebar». Potrai comunque aprirlo tramite

- l'indirizzo `http://<tuo-home-assistant>:8123/state-class-manager` (salvalo tra i preferiti),
- un pulsante in una dashboard con il percorso di navigazione `/state-class-manager`,
- il link nella finestra di configurazione dell'integrazione.

## Risoluzione dei problemi

- **Nel pannello compare «Setup not finished yet»:** clicca su **Set up automatically**. Se non funziona, segui i passaggi manuali mostrati.
- **In Strumenti per sviluppatori → Stati compare ancora la vecchia `state_class`:** dopo il salvataggio i sensori vengono aggiornati automaticamente. Se il valore resta, riavvia Home Assistant una volta. In rari casi l'integrazione che fornisce il sensore reimposta il valore; in tal caso apri una issue.
- **Non viene mostrata nessuna icona:** Home Assistant mostra le icone delle integrazioni personalizzate dalla versione 2026.3. Riavvia e ricarica la pagina del browser (Ctrl+F5).
- **File di backup:** puoi eliminare in qualsiasi momento i file `.bak` accanto al tuo `configuration.yaml`.

## Disinstallazione

Le impostazioni restano attive finché `state_class_manager.yaml` è incluso nel tuo `configuration.yaml`, anche senza l'integrazione. Per restituire la `state_class` a tutti i sensori, deseleziona tutto e salva **prima** di rimuovere l'integrazione. Poi elimina l'integrazione in *Impostazioni → Dispositivi e servizi* e rimuovila in HACS. Infine puoi eliminare `state_class_manager.yaml` e la sua voce sotto `packages:` nel `configuration.yaml`.
