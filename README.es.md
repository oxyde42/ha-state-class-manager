![State Class Manager](https://raw.githubusercontent.com/YOUR-GITHUB-NAME/ha-state-class-manager/main/images/icon_128.png)

# State Class Manager

[English](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.md) | [Deutsch](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.de.md) | [Français](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.fr.md) | **Español** | [Italiano](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.it.md) | [Nederlands](https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager/blob/main/README.nl.md)

[![Abre tu instancia de Home Assistant y muestra el repositorio en HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=YOUR-GITHUB-NAME&repository=ha-state-class-manager&category=integration)

Quita la `state_class` de tus sensores con unos pocos clics para que Home Assistant deje de guardar sus estadísticas en la base de datos. Sin editar YAML a mano.

## ¿Para qué sirve?

Home Assistant crea *estadísticas* para cada sensor que tiene una `state_class` (valores a corto plazo cada 5 minutos, valores a largo plazo cada hora). Las estadísticas a largo plazo no se borran nunca, así que la base de datos no deja de crecer. Muchos sensores (nivel de batería, intensidad de señal, diagnósticos …) nunca las necesitan.

Con State Class Manager eliges los sensores para los que no necesitas estadísticas y marcas **Quitar**. Para ellos ya no se guardan nuevas estadísticas. El historial normal (gráfico de historial, registro) no se ve afectado.

## Funciones

- Lista clara de todos los sensores con `state_class`, con búsqueda y filtro
- Una casilla por sensor, o «Filtrados: quitar» para toda la lista filtrada
- Los cambios se aplican al instante, sin reiniciar
- Se configura solo: crea su archivo YAML y la entrada en tu `configuration.yaml` (con copia de seguridad)
- Panel disponible en español, inglés, alemán y francés (los demás idiomas muestran inglés)

## Requisitos

- Home Assistant 2024.12 o más reciente (el icono y el logotipo se muestran a partir de 2026.3)
- [HACS](https://hacs.xyz) instalado

## Instalación mediante HACS

1. Pulsa el botón de arriba, o abre HACS → ⋮ → **Repositorios personalizados**, pega `https://github.com/YOUR-GITHUB-NAME/ha-state-class-manager` y elige la categoría **Integración**.
2. Busca «State Class Manager» en HACS y pulsa **Descargar**.
3. Reinicia Home Assistant.
4. Añade la integración: pulsa el botón de abajo, o ve a *Ajustes → Dispositivos y servicios → Añadir integración → State Class Manager*.
5. Lee el texto informativo y pulsa **Enviar**. La integración se configura sola y muestra el resultado. Pulsa **Enviar** una vez más para terminar.

[![Añadir la integración a tu Home Assistant.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=state_class_manager)

**La integración solo se puede añadir una vez.**

### Qué hace automáticamente la configuración

- Crea el archivo `state_class_manager.yaml` en tu carpeta de configuración.
- Añade la línea `state_class_manager: !include state_class_manager.yaml` en tu `configuration.yaml`, bajo `homeassistant:` → `packages:`.
- Antes guarda una copia de seguridad (`configuration.yaml.state_class_manager-<fecha>.bak`). Después se comprueba el archivo y, si algo falla, se restaura automáticamente. Los comentarios y el formato se conservan.
- Si tu `configuration.yaml` tiene una estructura que no se puede modificar con seguridad (por ejemplo `packages: !include_dir_named packages`), el diálogo te lo indica. El panel muestra entonces breves instrucciones manuales y un botón «Configurar automáticamente» para volver a intentarlo.

## Uso

1. Abre **State Class Manager** en la barra lateral.
2. Busca o filtra la lista.
3. Marca **Quitar** en los sensores que no necesitan estadísticas. Para muchos sensores a la vez, filtra la lista y pulsa **Filtrados: quitar**.
4. Pulsa **Guardar**. Listo. Para deshacerlo, desmarca la casilla y guarda de nuevo.

## Conviene saber

- Solo se ven afectadas las estadísticas. El historial normal no cambia.
- Las estadísticas ya guardadas permanecen. Bórralas en *Herramientas para desarrolladores → Estadísticas* si quieres liberar espacio.
- No quites los sensores que uses en el **panel de Energía** o en tarjetas de gráficos de estadísticas. Necesitan su `state_class`.
- Técnicamente, el gestor escribe `state_class: none` para las entidades elegidas en el archivo `state_class_manager.yaml` (sección `homeassistant: customize_glob:`).

## ¿Funciona con mis propias entradas `customize:`?

Sí. Tus entradas existentes `customize`, `customize_domain` y `customize_glob` en `configuration.yaml` (o en un `customize.yaml` incluido) **no se tocan**. El gestor solo añade su propio archivo pequeño como «paquete» y Home Assistant combina ambos.

- Los sensores que personalizas tú mismo (nombre, icono, …) conservan sus ajustes. El gestor solo añade `state_class: none` para los sensores que marcas.
- Si tu propia entrada `customize:` define ella misma una `state_class` para un sensor, **tu entrada tiene prioridad** y la casilla «Quitar» no tiene efecto para ese sensor. Borra primero esa línea de tu propia entrada.
- Puedes seguir usando patrones en tu propio `customize_glob` (por ejemplo `sensor.*_battery`). El gestor no muestra esos patrones, pero los deja intactos.

## Abrirlo sin entrada en la barra lateral

¿Usas poco este panel? Ve a *Ajustes → Dispositivos y servicios → State Class Manager → Configurar* y desmarca «Mostrar la entrada en la barra lateral». Seguirás pudiendo abrirlo mediante

- la dirección `http://<tu-home-assistant>:8123/state-class-manager` (guárdala como marcador),
- un botón en un panel (dashboard) con la ruta de navegación `/state-class-manager`,
- el enlace en el diálogo de configuración de la integración.

## Solución de problemas

- **En el panel aparece «Configuración sin terminar»:** pulsa **Configurar automáticamente**. Si no funciona, sigue los pasos manuales que se muestran allí.
- **En Herramientas para desarrolladores → Estados sigue la `state_class` anterior:** tras guardar, los sensores se actualizan automáticamente. Si el valor permanece, reinicia Home Assistant una vez. En casos raros, la integración que proporciona el sensor vuelve a establecer el valor; abre entonces un issue.
- **No se muestra ningún icono:** Home Assistant muestra los iconos de las integraciones personalizadas a partir de la versión 2026.3. Reinicia y recarga la página del navegador (Ctrl+F5).
- **Copias de seguridad:** puedes borrar en cualquier momento los archivos `.bak` junto a tu `configuration.yaml`.

## Desinstalación

Los ajustes siguen activos mientras `state_class_manager.yaml` esté incluido en tu `configuration.yaml`, incluso sin la integración. Para devolver su `state_class` a todos los sensores, desmarca todo y guarda **antes** de eliminar la integración. Después elimina la integración en *Ajustes → Dispositivos y servicios* y quítala en HACS. Por último, puedes borrar `state_class_manager.yaml` y su entrada bajo `packages:` en `configuration.yaml`.
