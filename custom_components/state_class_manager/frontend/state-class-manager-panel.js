const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

const TR = {
  en: {
    sort_by: "Sort by {col}",
    menu: "Menu",
    help_summary: "ℹ️ Help: What is this for?",
    help_p1: "For sensors with a so-called <b>state_class</b>, Home Assistant additionally creates statistics (short-term values every 5 minutes, long-term values hourly). Long-term statistics are kept permanently and make the database grow over time.",
    help_p2: "If you tick <b>Remove</b> for a sensor, no statistics are stored for it any more. This <b>saves storage space</b>. The normal history (history graph, logbook) is kept and cleaned up after a few days as usual.",
    help_li1: "Do not remove sensors you use in the <b>Energy dashboard</b> or in <b>statistics graphs</b>.",
    help_li2: "Statistics that were already stored remain. You can delete them under <i>Developer tools → Statistics</i>.",
    help_li3: "To undo: untick the box again and save.",
    help_p3: "<b>Save</b> applies the changes immediately; no restart is needed.",
    search_ph: "Search (name, entity ID, integration, device class) …",
    mode_all: "All",
    mode_active: "With state_class",
    mode_removed: "state_class removed",
    btn_rm_all: "Filtered: remove",
    btn_rs_all: "Filtered: restore",
    btn_discard: "Discard",
    btn_save: "Save",
    btn_save_n: "Save ({n})",
    th_remove: "Remove",
    th_sensor: "Sensor",
    th_integration: "Integration",
    count: "{shown} of {total} sensors shown",
    loading: "Loading sensors …",
    load_error: "Error while loading: ",
    saving: "Saving …",
    saved: "Saved and applied.",
    save_error: "Error while saving: ",
    warn_title: "Setup not finished yet",
    warn_text: "For the entries to take effect, the file <code>{file}</code> must be included in your <code>configuration.yaml</code>. The manager can do this automatically (a backup copy is created first).",
    btn_autosetup: "Set up automatically",
    setup_running: "Setting up …",
    setup_error: "Error: ",
    manual_summary: "Set up manually",
    manual_1: "1. Create the file <code>{file}</code> in your configuration folder (content: <code>homeassistant:</code> and, indented below it, <code>customize_glob: {}</code>).",
    manual_2: "2. Add this to your <code>configuration.yaml</code>:",
    pill_removed: "removed",
    pill_waiting: "still active, waiting for sensor update",
  },
  de: {
    sort_by: "Nach {col} sortieren",
    menu: "Menü",
    help_summary: "ℹ️ Hilfe: Wozu ist das gut?",
    help_p1: "Für Sensoren mit einer sogenannten <b>state_class</b> legt Home Assistant zusätzlich Statistiken an (Kurzzeitwerte alle 5 Minuten, Langzeitwerte stündlich). Die Langzeitstatistik wird dauerhaft aufbewahrt und lässt die Datenbank mit der Zeit immer weiter wachsen.",
    help_p2: "Setzt du bei einem Sensor den Haken <b>Entfernen</b>, werden für ihn keine Statistiken mehr gespeichert. Das <b>spart Speicherplatz</b>. Der normale Verlauf (Verlaufsgrafik, Logbuch) bleibt erhalten und wird wie gewohnt nach einigen Tagen aufgeräumt.",
    help_li1: "Sensoren, die du im <b>Energie-Dashboard</b> oder in <b>Statistik-Diagrammen</b> nutzt, solltest du nicht entfernen.",
    help_li2: "Bereits gespeicherte Statistiken bleiben bestehen. Du kannst sie unter <i>Entwicklerwerkzeuge → Statistiken</i> löschen.",
    help_li3: "Rückgängig machen: Haken wieder entfernen und speichern.",
    help_p3: "Mit <b>Speichern</b> werden die Änderungen sofort angewendet, ein Neustart ist nicht nötig.",
    search_ph: "Suchen (Name, Entity-ID, Integration, Geräteklasse) …",
    mode_all: "Alle",
    mode_active: "Mit state_class",
    mode_removed: "state_class entfernt",
    btn_rm_all: "Gefilterte: entfernen",
    btn_rs_all: "Gefilterte: wiederherstellen",
    btn_discard: "Verwerfen",
    btn_save: "Speichern",
    btn_save_n: "Speichern ({n})",
    th_remove: "Entfernen",
    th_sensor: "Sensor",
    th_integration: "Integration",
    count: "{shown} von {total} Sensoren angezeigt",
    loading: "Lade Sensoren …",
    load_error: "Fehler beim Laden: ",
    saving: "Speichere …",
    saved: "Gespeichert und angewendet.",
    save_error: "Fehler beim Speichern: ",
    warn_title: "Einrichtung noch nicht abgeschlossen",
    warn_text: "Damit die Einträge wirksam werden, muss die Datei <code>{file}</code> in der <code>configuration.yaml</code> eingebunden sein. Das kann der Manager automatisch erledigen (vorher wird eine Sicherungskopie angelegt).",
    btn_autosetup: "Automatisch einrichten",
    setup_running: "Richte ein …",
    setup_error: "Fehler: ",
    manual_summary: "Manuell einrichten",
    manual_1: "1. Datei <code>{file}</code> im Konfigurationsordner anlegen (Inhalt: <code>homeassistant:</code> und darunter eingerückt <code>customize_glob: {}</code>).",
    manual_2: "2. In der <code>configuration.yaml</code> eintragen:",
    pill_removed: "entfernt",
    pill_waiting: "noch aktiv, wartet auf Sensor-Update",
  },
  fr: {
    sort_by: "Trier par {col}",
    menu: "Menu",
    help_summary: "ℹ️ Aide : à quoi ça sert ?",
    help_p1: "Pour les capteurs ayant une <b>state_class</b>, Home Assistant crée en plus des statistiques (valeurs à court terme toutes les 5 minutes, valeurs à long terme toutes les heures). Les statistiques à long terme sont conservées indéfiniment et font grossir la base de données au fil du temps.",
    help_p2: "Si vous cochez <b>Supprimer</b> pour un capteur, plus aucune statistique n'est enregistrée pour lui. Cela <b>économise de l'espace de stockage</b>. L'historique normal (graphique d'historique, journal) est conservé et nettoyé comme d'habitude après quelques jours.",
    help_li1: "Ne supprimez pas les capteurs que vous utilisez dans le <b>tableau de bord Énergie</b> ou dans des <b>graphiques de statistiques</b>.",
    help_li2: "Les statistiques déjà enregistrées sont conservées. Vous pouvez les supprimer dans <i>Outils de développement → Statistiques</i>.",
    help_li3: "Pour annuler : décochez la case et enregistrez.",
    help_p3: "<b>Enregistrer</b> applique les modifications immédiatement, aucun redémarrage n'est nécessaire.",
    search_ph: "Rechercher (nom, ID d'entité, intégration, classe d'appareil) …",
    mode_all: "Tous",
    mode_active: "Avec state_class",
    mode_removed: "state_class supprimée",
    btn_rm_all: "Filtrés : supprimer",
    btn_rs_all: "Filtrés : rétablir",
    btn_discard: "Annuler",
    btn_save: "Enregistrer",
    btn_save_n: "Enregistrer ({n})",
    th_remove: "Supprimer",
    th_sensor: "Capteur",
    th_integration: "Intégration",
    count: "{shown} capteurs affichés sur {total}",
    loading: "Chargement des capteurs …",
    load_error: "Erreur lors du chargement : ",
    saving: "Enregistrement …",
    saved: "Enregistré et appliqué.",
    save_error: "Erreur lors de l'enregistrement : ",
    warn_title: "Configuration non terminée",
    warn_text: "Pour que les entrées soient prises en compte, le fichier <code>{file}</code> doit être inclus dans votre <code>configuration.yaml</code>. Le gestionnaire peut le faire automatiquement (une copie de sauvegarde est créée au préalable).",
    btn_autosetup: "Configurer automatiquement",
    setup_running: "Configuration en cours …",
    setup_error: "Erreur : ",
    manual_summary: "Configurer manuellement",
    manual_1: "1. Créez le fichier <code>{file}</code> dans votre dossier de configuration (contenu : <code>homeassistant:</code> puis, indenté en dessous, <code>customize_glob: {}</code>).",
    manual_2: "2. Ajoutez ceci à votre <code>configuration.yaml</code> :",
    pill_removed: "supprimée",
    pill_waiting: "encore active, en attente de la mise à jour du capteur",
  },
  es: {
    sort_by: "Ordenar por {col}",
    menu: "Menú",
    help_summary: "ℹ️ Ayuda: ¿para qué sirve?",
    help_p1: "Para los sensores con una <b>state_class</b>, Home Assistant crea además estadísticas (valores a corto plazo cada 5 minutos, valores a largo plazo cada hora). Las estadísticas a largo plazo se conservan para siempre y hacen que la base de datos crezca con el tiempo.",
    help_p2: "Si marcas <b>Quitar</b> en un sensor, ya no se guardan estadísticas para él. Esto <b>ahorra espacio de almacenamiento</b>. El historial normal (gráfico de historial, registro) se conserva y se limpia como siempre tras unos días.",
    help_li1: "No quites los sensores que uses en el <b>panel de Energía</b> o en <b>gráficos de estadísticas</b>.",
    help_li2: "Las estadísticas ya guardadas permanecen. Puedes borrarlas en <i>Herramientas para desarrolladores → Estadísticas</i>.",
    help_li3: "Para deshacerlo: desmarca la casilla y guarda.",
    help_p3: "<b>Guardar</b> aplica los cambios al instante; no hace falta reiniciar.",
    search_ph: "Buscar (nombre, ID de entidad, integración, clase de dispositivo) …",
    mode_all: "Todos",
    mode_active: "Con state_class",
    mode_removed: "state_class quitada",
    btn_rm_all: "Filtrados: quitar",
    btn_rs_all: "Filtrados: restaurar",
    btn_discard: "Descartar",
    btn_save: "Guardar",
    btn_save_n: "Guardar ({n})",
    th_remove: "Quitar",
    th_sensor: "Sensor",
    th_integration: "Integración",
    count: "{shown} de {total} sensores mostrados",
    loading: "Cargando sensores …",
    load_error: "Error al cargar: ",
    saving: "Guardando …",
    saved: "Guardado y aplicado.",
    save_error: "Error al guardar: ",
    warn_title: "Configuración sin terminar",
    warn_text: "Para que las entradas surtan efecto, el archivo <code>{file}</code> debe estar incluido en tu <code>configuration.yaml</code>. El gestor puede hacerlo automáticamente (antes se crea una copia de seguridad).",
    btn_autosetup: "Configurar automáticamente",
    setup_running: "Configurando …",
    setup_error: "Error: ",
    manual_summary: "Configurar manualmente",
    manual_1: "1. Crea el archivo <code>{file}</code> en tu carpeta de configuración (contenido: <code>homeassistant:</code> y, con sangría debajo, <code>customize_glob: {}</code>).",
    manual_2: "2. Añade esto a tu <code>configuration.yaml</code>:",
    pill_removed: "quitada",
    pill_waiting: "aún activa, esperando la actualización del sensor",
  },
};

class StateClassManagerPanel extends HTMLElement {
  constructor() {
    super();
    this._items = [];
    this._pending = new Map(); // entity_id -> true (remove) / false (restore)
    this._search = "";
    this._mode = "all";
    this._sortKey = "integration";
    this._sortDir = "asc";
    this._sortSnap = null;
    this._coll = null;
    this._pkgActive = true;
    this._yamlFile = "state_class_manager.yaml";
    this._busy = false;
    this._msg = "";
    this._setupMsg = "";
    this.attachShadow({ mode: "open" });
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) {
      this._renderShell();
      this._load();
    }
  }

  set narrow(v) {
    this._narrow = v;
    const btn = this.shadowRoot.querySelector("#menu");
    if (btn) btn.style.display = v ? "" : "none";
  }

  _t(key, vars = {}) {
    const code = String(this._hass?.language || "en").toLowerCase().slice(0, 2);
    const lang = TR[code] ? code : "en";
    let text = TR[lang][key] ?? TR.en[key] ?? key;
    for (const [k, v] of Object.entries(vars)) text = text.split("{" + k + "}").join(String(v));
    return text;
  }

  set panel(_) {}
  set route(_) {}

  async _load() {
    this._setMsg(this._t("loading"));
    try {
      const res = await this._hass.callWS({ type: "state_class_manager/list" });
      this._items = res.items;
      this._pkgActive = res.package_active;
      this._yamlFile = res.yaml_file;
      this._pending.clear();
      this._snap();
      this._setMsg("");
    } catch (e) {
      this._setMsg(this._t("load_error") + (e.message || e));
    }
    this._update();
  }

  _isRemoved(item) {
    return this._pending.has(item.entity_id)
      ? this._pending.get(item.entity_id)
      : item.managed;
  }

  _filtered() {
    const q = this._search.trim().toLowerCase();
    return this._items.filter((i) => {
      if (this._mode === "active" && this._isRemoved(i)) return false;
      if (this._mode === "removed" && !this._isRemoved(i)) return false;
      if (!q) return true;
      return (
        i.entity_id.toLowerCase().includes(q) ||
        String(i.name).toLowerCase().includes(q) ||
        String(i.platform || "").toLowerCase().includes(q) ||
        String(i.device_class || "").toLowerCase().includes(q)
      );
    });
  }

  _collator() {
    if (!this._coll) {
      try {
        this._coll = new Intl.Collator(this._hass?.language || undefined, { numeric: true, sensitivity: "base" });
      } catch (e) {
        this._coll = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
      }
    }
    return this._coll;
  }

  // Remember which rows are marked, so rows do not jump while ticking boxes.
  _snap() {
    this._sortSnap = new Map(this._items.map((i) => [i.entity_id, this._isRemoved(i)]));
  }

  _removedForSort(item) {
    return this._sortSnap && this._sortSnap.has(item.entity_id)
      ? this._sortSnap.get(item.entity_id)
      : this._isRemoved(item);
  }

  _sorted(rows) {
    const coll = this._collator();
    const dir = this._sortDir === "asc" ? 1 : -1;
    // Empty values always go last, independent of the direction.
    const str = (a, b, d) => {
      const ea = !a;
      const eb = !b;
      if (ea || eb) return ea && eb ? 0 : ea ? 1 : -1;
      return d * coll.compare(String(a), String(b));
    };
    const crit = {
      integration: (x, y, d) => str(x.platform, y.platform, d),
      sensor: (x, y, d) => str(x.name, y.name, d),
      remove: (x, y, d) => d * ((this._removedForSort(x) ? 0 : 1) - (this._removedForSort(y) ? 0 : 1)),
    };
    const chains = {
      integration: ["integration", "sensor"],
      sensor: ["sensor", "integration"],
      remove: ["remove", "integration", "sensor"],
    };
    const chain = chains[this._sortKey] || chains.integration;
    return rows.slice().sort((x, y) => {
      for (let k = 0; k < chain.length; k++) {
        // The direction applies to the main criterion only.
        const r = crit[chain[k]](x, y, k === 0 ? dir : 1);
        if (r) return r;
      }
      return str(x.entity_id, y.entity_id, 1);
    });
  }

  _setSort(key) {
    if (this._sortKey === key) this._sortDir = this._sortDir === "asc" ? "desc" : "asc";
    else {
      this._sortKey = key;
      this._sortDir = "asc";
    }
    this._snap();
    this._renderRows();
  }

  _renderHeader() {
    this.shadowRoot.querySelectorAll("th[data-sort]").forEach((th) => {
      const active = th.dataset.sort === this._sortKey;
      th.classList.toggle("active", active);
      th.setAttribute("aria-sort", active ? (this._sortDir === "asc" ? "ascending" : "descending") : "none");
      const arrow = th.querySelector(".arrow");
      if (arrow) arrow.textContent = active ? (this._sortDir === "asc" ? "▲" : "▼") : "";
    });
  }

  _setPending(item, removed) {
    if (removed === item.managed) this._pending.delete(item.entity_id);
    else this._pending.set(item.entity_id, removed);
  }

  async _save() {
    const remove = [];
    const restore = [];
    for (const [eid, removed] of this._pending) (removed ? remove : restore).push(eid);
    if (!remove.length && !restore.length) return;
    this._busy = true;
    this._setMsg(this._t("saving"));
    this._update();
    try {
      await this._hass.callWS({ type: "state_class_manager/set", remove, restore });
      this._busy = false;
      await this._load();
      this._setMsg(this._t("saved"));
    } catch (e) {
      this._busy = false;
      this._setMsg(this._t("save_error") + (e.message || e));
      this._update();
    }
  }

  _setMsg(t) {
    this._msg = t;
    const el = this.shadowRoot.querySelector("#msg");
    if (el) el.textContent = t;
  }

  _renderShell() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; height:100%; background:var(--primary-background-color); color:var(--primary-text-color); font-family:var(--paper-font-body1_-_font-family, Roboto, sans-serif); }
        .bar { display:flex; align-items:center; gap:8px; height:56px; padding:0 16px; background:var(--app-header-background-color, var(--primary-color)); color:var(--app-header-text-color, #fff); box-sizing:border-box; }
        .bar h1 { font-size:20px; font-weight:400; margin:0; }
        #menu { display:none; background:none; border:none; color:inherit; cursor:pointer; font-size:24px; padding:4px 8px; }
        .wrap { padding:16px; max-width:1100px; margin:0 auto; }
        .card { background:var(--card-background-color); border-radius:var(--ha-card-border-radius,12px); box-shadow:var(--ha-card-box-shadow,none); border:1px solid var(--divider-color); padding:16px; margin-bottom:16px; }
        .tools { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
        input[type=search], select { padding:8px 10px; border-radius:8px; border:1px solid var(--divider-color); background:var(--secondary-background-color); color:var(--primary-text-color); font-size:14px; }
        input[type=search] { flex:1; min-width:180px; }
        button.b { padding:8px 14px; border-radius:8px; border:1px solid var(--divider-color); background:var(--secondary-background-color); color:var(--primary-text-color); cursor:pointer; font-size:14px; }
        button.b.primary { background:var(--primary-color); color:var(--text-primary-color,#fff); border-color:transparent; }
        button.b:disabled { opacity:.5; cursor:default; }
        table { width:100%; border-collapse:collapse; margin-top:12px; font-size:14px; }
        th { text-align:left; color:var(--secondary-text-color); font-weight:500; padding:6px 8px; border-bottom:1px solid var(--divider-color); }
        td { padding:8px; border-bottom:1px solid var(--divider-color); vertical-align:middle; }
        th.sortable { cursor:pointer; user-select:none; white-space:nowrap; }
        th.sortable:hover, th.sortable:focus-visible { color:var(--primary-text-color); outline:none; }
        th.sortable.active { color:var(--primary-color); }
        .arrow { display:inline-block; min-width:14px; margin-left:4px; font-size:10px; }
        tr.changed td { background:color-mix(in srgb, var(--primary-color) 10%, transparent); }
        .id { color:var(--secondary-text-color); font-size:12px; }
        .pill { display:inline-block; padding:2px 8px; border-radius:10px; background:var(--secondary-background-color); font-size:12px; }
        .pill.off { background:color-mix(in srgb, var(--error-color,#db4437) 20%, transparent); }
        input[type=checkbox] { width:20px; height:20px; accent-color:var(--primary-color); cursor:pointer; }
        .warn { border-color:var(--warning-color,#ffa600); }
        pre { background:var(--secondary-background-color); padding:10px; border-radius:8px; overflow:auto; font-size:13px; }
        #msg { color:var(--secondary-text-color); margin:8px 0 0; min-height:1.2em; font-size:13px; }
        .small { color:var(--secondary-text-color); font-size:13px; }
        details.help summary { cursor:pointer; font-weight:500; }
        details.help p, details.help ul { font-size:14px; line-height:1.5; margin:8px 0 0; }
        details.help ul { padding-left:20px; }
      </style>
      <div class="bar"><button id="menu" title="${this._t("menu")}">☰</button><h1>State Class Manager</h1></div>
      <div class="wrap">
        <div id="warn"></div>
        <details class="card help">
          <summary>${this._t("help_summary")}</summary>
          <p>${this._t("help_p1")}</p>
          <p>${this._t("help_p2")}</p>
          <ul>
            <li>${this._t("help_li1")}</li>
            <li>${this._t("help_li2")}</li>
            <li>${this._t("help_li3")}</li>
          </ul>
          <p class="small">${this._t("help_p3")}</p>
        </details>
        <div class="card">
          <div class="tools">
            <input type="search" id="search" placeholder="${this._t("search_ph")}">
            <select id="mode">
              <option value="all">${this._t("mode_all")}</option>
              <option value="active">${this._t("mode_active")}</option>
              <option value="removed">${this._t("mode_removed")}</option>
            </select>
          </div>
          <div class="tools" style="margin-top:8px">
            <button class="b" id="rmAll">${this._t("btn_rm_all")}</button>
            <button class="b" id="rsAll">${this._t("btn_rs_all")}</button>
            <span style="flex:1"></span>
            <button class="b" id="discard">${this._t("btn_discard")}</button>
            <button class="b primary" id="save">${this._t("btn_save")}</button>
          </div>
          <p id="msg"></p>
          <div style="overflow-x:auto">
            <table>
              <thead id="head"><tr>
                <th class="sortable" data-sort="remove" tabindex="0" title="${this._t("sort_by", { col: this._t("th_remove") })}">${this._t("th_remove")}<span class="arrow"></span></th>
                <th class="sortable" data-sort="sensor" tabindex="0" title="${this._t("sort_by", { col: this._t("th_sensor") })}">${this._t("th_sensor")}<span class="arrow"></span></th>
                <th class="sortable" data-sort="integration" tabindex="0" title="${this._t("sort_by", { col: this._t("th_integration") })}">${this._t("th_integration")}<span class="arrow"></span></th>
                <th>state_class</th>
              </tr></thead>
              <tbody id="rows"></tbody>
            </table>
          </div>
          <p class="small" id="count"></p>
        </div>
      </div>`;
    const $ = (s) => this.shadowRoot.querySelector(s);
    $("#menu").addEventListener("click", () =>
      this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }))
    );
    $("#menu").style.display = this._narrow ? "" : "none";
    $("#search").addEventListener("input", (e) => {
      this._search = e.target.value;
      this._renderRows();
    });
    $("#mode").addEventListener("change", (e) => {
      this._mode = e.target.value;
      this._renderRows();
    });
    $("#rmAll").addEventListener("click", () => {
      this._filtered().forEach((i) => this._setPending(i, true));
      this._snap();
      this._update();
    });
    $("#rsAll").addEventListener("click", () => {
      this._filtered().forEach((i) => this._setPending(i, false));
      this._snap();
      this._update();
    });
    $("#discard").addEventListener("click", () => {
      this._pending.clear();
      this._snap();
      this._update();
    });
    $("#save").addEventListener("click", () => this._save());
    $("#head").addEventListener("click", (e) => {
      const th = e.target.closest("th[data-sort]");
      if (th) this._setSort(th.dataset.sort);
    });
    $("#head").addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const th = e.target.closest("th[data-sort]");
      if (!th) return;
      e.preventDefault();
      this._setSort(th.dataset.sort);
    });
    $("#warn").addEventListener("click", (e) => {
      if (e.target.closest("#autosetup")) this._autoSetup();
    });
    $("#rows").addEventListener("change", (e) => {
      const cb = e.target.closest("input[type=checkbox]");
      if (!cb) return;
      const item = this._items.find((i) => i.entity_id === cb.dataset.id);
      if (item) this._setPending(item, cb.checked);
      this._update();
    });
  }

  _update() {
    this._renderWarn();
    this._renderRows();
    const $ = (s) => this.shadowRoot.querySelector(s);
    const n = this._pending.size;
    $("#save").textContent = n ? this._t("btn_save_n", { n }) : this._t("btn_save");
    $("#save").disabled = !n || this._busy;
    $("#discard").disabled = !n || this._busy;
    $("#msg").textContent = this._msg;
  }

  _renderWarn() {
    const el = this.shadowRoot.querySelector("#warn");
    if (this._pkgActive) {
      el.innerHTML = "";
      return;
    }
    el.innerHTML = `
      <div class="card warn">
        <b>${this._t("warn_title")}</b>
        <p class="small">${this._t("warn_text", { file: esc(this._yamlFile) })}</p>
        <button class="b primary" id="autosetup" ${this._busy ? "disabled" : ""}>${this._t("btn_autosetup")}</button>
        ${this._setupMsg ? `<p class="small">${esc(this._setupMsg)}</p>` : ""}
        <details style="margin-top:10px">
          <summary class="small" style="cursor:pointer">${this._t("manual_summary")}</summary>
          <p class="small">${this._t("manual_1", { file: esc(this._yamlFile) })}<br>
          ${this._t("manual_2")}</p>
          <pre>homeassistant:
  packages:
    state_class_manager: !include ${esc(this._yamlFile)}</pre>
        </details>
      </div>`;
  }

  async _autoSetup() {
    this._busy = true;
    this._setupMsg = this._t("setup_running");
    this._update();
    try {
      const res = await this._hass.callWS({ type: "state_class_manager/setup" });
      this._setupMsg = res.message.replace(/`/g, "");
      this._pkgActive = res.package_active;
    } catch (e) {
      this._setupMsg = this._t("setup_error") + (e.message || e);
    }
    this._busy = false;
    this._update();
  }

  _renderRows() {
    this._renderHeader();
    const rows = this._sorted(this._filtered());
    const tbody = this.shadowRoot.querySelector("#rows");
    tbody.innerHTML = rows
      .map((i) => {
        const removed = this._isRemoved(i);
        const changed = this._pending.has(i.entity_id);
        let sc;
        if (!i.state_class) sc = `<span class="pill off">${this._t("pill_removed")}</span>`;
        else if (i.managed)
          sc = `<span class="pill">${esc(i.state_class)}</span> <span class="small">${this._t("pill_waiting")}</span>`;
        else sc = `<span class="pill">${esc(i.state_class)}</span>`;
        return `<tr class="${changed ? "changed" : ""}">
          <td><input type="checkbox" data-id="${esc(i.entity_id)}" ${removed ? "checked" : ""}></td>
          <td><div>${esc(i.name)}</div><div class="id">${esc(i.entity_id)}${i.unit ? " · " + esc(i.unit) : ""}</div></td>
          <td>${esc(i.platform || "–")}</td>
          <td>${sc}</td>
        </tr>`;
      })
      .join("");
    this.shadowRoot.querySelector("#count").textContent =
      this._t("count", { shown: rows.length, total: this._items.length });
  }
}

customElements.define("state-class-manager-panel", StateClassManagerPanel);
