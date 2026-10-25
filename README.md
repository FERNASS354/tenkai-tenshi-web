# Tenkai Tenshi

Sitio público estático publicado con GitHub Pages en `https://tenkaitenshi.xyz`.

El inicio presenta el desarrollo, las aplicaciones y la visión de Tenkai Tenshi, con las nueve entradas de navegación del sitio original. Tenkai POS reúne su información en un apartado propio. Su menú tiene tres entradas: Tenkai POS, Conexiones y Manuales; la descarga de Windows está disponible desde el inicio de POS.

Los seis manuales cubren Tenkai POS, Inventory, MultiPos, Resguard, Boss y Sync. Sus 90 temas conservan los 82 anteriores y amplían MED, devoluciones, conteos y diferencias, inventarios por familia y costos promedio. La documentación distingue funciones compatibles del instalador público y conserva el estado piloto de Boss y Sync. Las capturas usan pantallas reales con datos de demostración.

## Editar y generar

El contenido vive en `tools/content.mjs`, las ampliaciones del manual en `tools/manual-expansion.mjs` y el recorrido de funciones en `tools/pos-guide.mjs`. Los precios regulares y promocionales están en `tools/pricing.mjs`. Las páginas se generan con `tools/build-site.mjs`; las plantillas de inicio y contacto conservan el contenido original.

Los cinco iconos aprobados de Inventory, MultiPos, Resguard, Boss y Sync son dibujos vectoriales en `assets/icons/pos-suite/` y conservan sus bytes. Doce iconos adicionales de la misma familia viven en `assets/icons/app-suite/`, incluido ROM Studio Universal. Se generan con `tools/build-icons.mjs`. El icono original de POS Windows también conserva sus bytes. Los estilos e interacciones están en `assets/premium.css`, `assets/structure.css` y `assets/premium.js`.

Care renueva el acceso a actualizaciones por un año más e incluye hasta dos cambios de PC asistidos al año. Los importes regulares y promocionales se conservan. La política se genera desde `tools/privacy-content.mjs`, con estilos en `assets/privacy.css`. Su apartado de Google Play cubre todas las apps actuales y futuras de TENKAITENSHI que enlazan el aviso y siguen el modelo offline first; Calculator 3D, Forge Suite y Music son ejemplos, no una lista cerrada. Explica almacenamiento local sin nube de Tenkai, conservación y copias, permisos según función, conexiones locales, compras y comprobaciones de actualizaciones de Google Play. POS, licencias, Boss y Sync conservan un apartado separado. Cambiar la web no actualiza el formulario Seguridad de los datos de Play Console ni los avisos incluidos en los paquetes de las apps.

```powershell
node tools/build-icons.mjs
node tools/build-site.mjs
node tools/serve.mjs
```

Vista local: `http://127.0.0.1:4173`. Las páginas existentes conservan su contenido y reciben navegación y presentación comunes. Las rutas antiguas de POS y del catálogo redirigen a sus páginas principales.

## Verificación

### Tenkai Checker

`tenkai-checker.html` presenta el exterior 3D de la versión 2.0 y distingue la fotografía y el video reales del prototipo 1.0. El contenido se genera desde `tools/checker-page.mjs`; `assets/checker-viewer.js` usa WebGL nativo y carga solo las doce piezas exteriores de `assets/checker/checker-v2-exterior.json`. No incluye electrónica, bandeja interior, despiece ni controles de transparencia. Se enlaza desde la sección `#checador` de Tenkai POS y tiene su propia pestaña global y navegación independiente. Las tres entradas del submenú de POS se conservan; la ruta provisional `tenkai-shaker.html` redirige a Checker.

Los medios viven en `assets/checker/`. El MP4 original conserva sus bytes; el poster del video procede de un fotograma real. El poster 2.0 y la imagen para compartir proceden del render 3D. Las fotografías y videos de 1.0 no se presentan como equipo físico 2.0. Las especificaciones presentan el hardware y las opciones comerciales indicadas por el propietario; la fabricación es bajo pedido. El propietario confirmó pruebas del prototipo 1.0 con Eleventa MultiCaja y SICAR 4.0: un programa puente consulta la base de datos y envía cambios de productos, precios y códigos en pocos segundos. Eleventa MonoCaja usa el último respaldo disponible, con actualización manual: cerrar MonoCaja, actualizar el catálogo en el puente, enviarlo al checador y reabrir MonoCaja. El checador consulta sin internet el último catálogo descargado; requiere el puente activo y conexión con él para recibir cambios. Al desconectarse conserva la información, que puede quedar desactualizada. No se afirma certificación de otras versiones o ediciones.

Tenkai Checker conecta de forma nativa con Tenkai POS mediante conexión rápida, sin puente. El programa puente se proporciona para las integraciones con Eleventa y SICAR; la consulta offline conserva el último catálogo en cualquiera de las modalidades.

Las versiones comerciales indicadas por el propietario son $5,800 MXN sin batería y $6,500 MXN con batería de 10,000 mAh, apagador y autonomía estimada de 4–5 horas. Ambas incluyen base y un año de garantía limitada en componentes, excluyendo daños por manipulación o externos. Entrega aproximada de 25 días después del pago, bajo pedido. El respaldo mantiene encendido el checador; las actualizaciones dependen de la red y del POS/puente activos. Los botones de pedido abren una consulta y no procesan pagos.

Prueba enfocada: `node tests/checker-check.cjs`. Comprueba seis anchos de 320 a 1440 px, las cuatro vistas, zoom, giro por arrastre y teclado, visor fotográfico, reproducción real del video, alternativa sin JavaScript/WebGL y ausencia de piezas interiores. No valida de nuevo el hardware ni las integraciones de punto de venta. El servidor de desarrollo sirve MP4 con su tipo correcto.

```powershell
node tests/premium-check.cjs
node tests/navigation-check.cjs
node tests/icons-privacy-check.cjs
node tests/checker-check.cjs
```

Requiere Chrome y Playwright. `TENKAI_PLAYWRIGHT_PATH` permite indicar el paquete Playwright; por defecto usa el runtime local de Codex. `TENKAI_SITE_URL` permite comprobar el sitio publicado. `TENKAI_QA_OUTPUT` permite elegir la carpeta de evidencias.

La comprobación recorre páginas y recursos, resuelve anclas, prueba cinco anchos de pantalla, menú y teclado, visor de capturas, búsqueda del manual, idioma persistente y estimador de recaptura. Comprueba la separación de privacidad y conserva las cláusulas de licencia ajenas al cambio autorizado de Care. La prueba de iconos compara los cinco aprobados y el original de POS contra la versión anterior, carga los doce nuevos y verifica los enlaces antiguos de privacidad y la solicitud de eliminación.

La prueba de navegación comprueba el contenido del inicio contra su versión original, el apartado independiente de POS, la conservación de capítulos anteriores, lectura sin JavaScript, los nuevos ejemplos y siete anchos de navegación. Las capturas de MED se obtuvieron de los componentes de producción con datos de demostración: esa evidencia visual no sustituye una prueba de operación en una tienda real.

Los manuales se pueden imprimir o guardar en PDF desde el navegador. La PWA de Calculator 3D y los instaladores existentes se conservan.

## Publicación y reversión

Repositorio público: `FERNASS354/tenkai-tenshi-web`, rama `main`. Publica mediante un commit normal y un push. Comprueba el dominio, manuales, recursos y descarga después del despliegue de GitHub Pages.

Para revertir, revierte el commit de la actualización y publica esa reversión. La versión anterior a los doce iconos y la nueva política es `a6d4067ecbe44433c829f722b6b03e8df2db019f`; el sitio original antes de los rediseños está en `eb848531deb34a405b32f30923748bf9496aa865` y en el respaldo local de la auditoría. La base anterior a Tenkai Checker es `74cc85cc07660b421b00c6c7d338af3b035bb05b`. La integración del checador modifica únicamente la web; conserva el contenido previo de POS y los textos legales, y no modifica firmware, paquetes de aplicaciones ni las reglas del servidor.
