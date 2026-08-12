# Tenkai Tenshi Web V3 Remaster

Sitio estático multipágina listo para GitHub Pages. Conserva las rutas públicas vigentes, añade fichas detalladas para cada aplicación y mantiene íntegra la PWA de Tenkai Calculator 3D.

## Estructura

- Páginas institucionales en la raíz.
- Ecosistemas en `ecosistemas/`.
- Fichas individuales en `apps/`.
- PWA instalable en `apps/calculator3d-web/`.
- Recursos compartidos en `assets/`.
- Instalador vigente en `downloads/`.

## Vista local

```powershell
node server.mjs
```

Abre `http://127.0.0.1:4173/`.

## Regeneración y verificación

```powershell
node tools/build-site.mjs
node tests/site-check.mjs
```

La verificación recorre las 35 páginas, resuelve sus enlaces y recursos, comprueba las rutas heredadas y valida los archivos esenciales de la PWA.

## Publicación

Copia el contenido de esta carpeta a la raíz del repositorio de GitHub Pages cuando apruebes el resultado. El repositorio publicado original se conserva sin cambios en `E:\Tenkai Apps\tenkai-tenshi-web`.

Instalador: `downloads/TenkaiPOS-Setup-V1.1.0+98.exe`  
SHA-256: `844D768F87B2DE649C6DE6268378C775A73DD2C27564D3FE18D3AF72551096D0`
