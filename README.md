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

```powershell
node tests/premium-check.cjs
node tests/navigation-check.cjs
node tests/icons-privacy-check.cjs
```

Requiere Chrome y Playwright. `TENKAI_PLAYWRIGHT_PATH` permite indicar el paquete Playwright; por defecto usa el runtime local de Codex. `TENKAI_SITE_URL` permite comprobar el sitio publicado. `TENKAI_QA_OUTPUT` permite elegir la carpeta de evidencias.

La comprobación recorre páginas y recursos, resuelve anclas, prueba cinco anchos de pantalla, menú y teclado, visor de capturas, búsqueda del manual, idioma persistente y estimador de recaptura. Comprueba la separación de privacidad y conserva las cláusulas de licencia ajenas al cambio autorizado de Care. La prueba de iconos compara los cinco aprobados y el original de POS contra la versión anterior, carga los doce nuevos y verifica los enlaces antiguos de privacidad y la solicitud de eliminación.

La prueba de navegación comprueba el contenido del inicio contra su versión original, el apartado independiente de POS, la conservación de capítulos anteriores, lectura sin JavaScript, los nuevos ejemplos y siete anchos de navegación. Las capturas de MED se obtuvieron de los componentes de producción con datos de demostración: esa evidencia visual no sustituye una prueba de operación en una tienda real.

Los manuales se pueden imprimir o guardar en PDF desde el navegador. La PWA de Calculator 3D y los instaladores existentes se conservan.

## Publicación y reversión

Repositorio público: `FERNASS354/tenkai-tenshi-web`, rama `main`. Publica mediante un commit normal y un push. Comprueba el dominio, manuales, recursos y descarga después del despliegue de GitHub Pages.

Para revertir, revierte el commit de la actualización y publica esa reversión. La versión anterior a los doce iconos y la nueva política es `a6d4067ecbe44433c829f722b6b03e8df2db019f`; el sitio original antes de los rediseños está en `eb848531deb34a405b32f30923748bf9496aa865` y en el respaldo local de la auditoría. Esta actualización no modifica los paquetes de las aplicaciones ni las reglas del servidor. Se actualiza la política pública y la explicación de Care; las demás condiciones de licencia se conservan.
