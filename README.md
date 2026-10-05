# Tenkai Tenshi

Sitio público estático publicado con GitHub Pages en `https://tenkaitenshi.xyz`.

El inicio presenta el desarrollo, las aplicaciones y la visión de Tenkai Tenshi, con las nueve entradas de navegación del sitio original. Tenkai POS reúne su información en un apartado propio, con menú de resumen, funciones, aplicaciones, conexiones, manuales, descargas y precios.

Los seis manuales cubren Tenkai POS, Inventory, MultiPos, Resguard, Boss y Sync. Sus 90 temas conservan los 82 anteriores y amplían MED, devoluciones, conteos y diferencias, inventarios por familia y costos promedio. La documentación distingue funciones compatibles del instalador público y conserva el estado piloto de Boss y Sync. Las capturas usan pantallas reales con datos de demostración.

## Editar y generar

El contenido vive en `tools/content.mjs`, las ampliaciones del manual en `tools/manual-expansion.mjs` y el recorrido de funciones en `tools/pos-guide.mjs`. Los precios regulares y promocionales están en `tools/pricing.mjs`. Las páginas se generan con `tools/build-site.mjs`; las plantillas de inicio y contacto conservan el contenido original.

Los cinco iconos de Inventory, MultiPos, Resguard, Boss y Sync son dibujos vectoriales en `assets/icons/pos-suite/`, generados con `tools/build-icons.mjs`. El icono original de POS Windows conserva sus bytes. Las demás aplicaciones mantienen sus iconos de `assets/icons/professional/`. Los estilos e interacciones están en `assets/premium.css`, `assets/structure.css` y `assets/premium.js`.

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
```

Requiere Chrome y Playwright. `TENKAI_PLAYWRIGHT_PATH` permite indicar el paquete Playwright; por defecto usa el runtime local de Codex. `TENKAI_SITE_URL` permite comprobar el sitio publicado. `TENKAI_QA_OUTPUT` permite elegir la carpeta de evidencias.

La comprobación recorre páginas y recursos, resuelve anclas, prueba cinco anchos de pantalla, menú y teclado, visor de capturas, búsqueda del manual, idioma persistente y estimador de recaptura. Comprueba que privacidad y el icono de POS coincidan con el sitio anterior; en la licencia solo admite la aclaración del precio regular de Care y su promoción.

La prueba de navegación comprueba el contenido del inicio contra su versión original, el apartado independiente de POS, la conservación de capítulos anteriores, lectura sin JavaScript, los nuevos ejemplos y siete anchos de navegación. Las capturas de MED se obtuvieron de los componentes de producción con datos de demostración: esa evidencia visual no sustituye una prueba de operación en una tienda real.

Los manuales se pueden imprimir o guardar en PDF desde el navegador. La PWA de Calculator 3D y los instaladores existentes se conservan.

## Publicación y reversión

Repositorio público: `FERNASS354/tenkai-tenshi-web`, rama `main`. Publica mediante un commit normal y un push. Comprueba el dominio, manuales, recursos y descarga después del despliegue de GitHub Pages.

Para revertir, revierte el commit de la actualización y publica esa reversión. La versión previa a esta reorganización es `a319fc94ed4ec90d9d6e3dab48f8e51c2e4d164c`; el sitio original antes de los rediseños está en `eb848531deb34a405b32f30923748bf9496aa865` y en el respaldo local de la auditoría. El rediseño no cambia los paquetes de las aplicaciones ni la política. La mención de Care en la licencia distingue su precio regular de la promoción; las demás condiciones se conservan.
