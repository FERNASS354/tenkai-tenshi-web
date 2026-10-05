# Tenkai Tenshi

Sitio público estático publicado con GitHub Pages en `https://tenkaitenshi.xyz`.

La presentación y los manuales cubren Tenkai POS, Inventory, MultiPos, Resguardo, Boss y Sync. La documentación distingue funciones compatibles del instalador público y conserva el estado piloto de Boss y Sync. Las capturas usan pantallas reales con datos de demostración.

## Editar y generar

El contenido vive en `tools/content.mjs`. Las páginas e iconos vectoriales se generan con `tools/build-site.mjs`. Los estilos e interacciones están en `assets/premium.css` y `assets/premium.js`.

```powershell
node tools/build-site.mjs
node tools/serve.mjs
```

Vista local: `http://127.0.0.1:4173`. Las páginas existentes conservan su contenido y reciben navegación y presentación comunes. Las rutas antiguas de POS y del catálogo redirigen a sus páginas principales.

## Verificación

```powershell
node tests/premium-check.cjs
```

Requiere Chrome y Playwright. `TENKAI_PLAYWRIGHT_PATH` permite indicar el paquete Playwright; por defecto usa el runtime local de Codex. `TENKAI_SITE_URL` permite comprobar el sitio publicado. `TENKAI_QA_OUTPUT` permite elegir la carpeta de evidencias.

La comprobación recorre páginas y recursos, resuelve anclas, prueba cinco anchos de pantalla, menú y teclado, visor de capturas, búsqueda del manual, idioma persistente y estimador de recaptura. Comprueba que el contenido legal y el icono de POS coincidan con el sitio anterior.

Los manuales se pueden imprimir o guardar en PDF desde el navegador. La PWA de Calculator 3D y los instaladores existentes se conservan.

## Publicación y reversión

Repositorio público: `FERNASS354/tenkai-tenshi-web`, rama `main`. Publica mediante un commit normal y un push. Comprueba el dominio, manuales, recursos y descarga después del despliegue de GitHub Pages.

Para revertir, revierte el commit de la presentación y publica esa reversión. El estado anterior está en `eb848531deb34a405b32f30923748bf9496aa865` y en el respaldo local de la auditoría. El rediseño no cambia los paquetes de las aplicaciones, la política ni las condiciones de licencia.
