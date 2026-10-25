"""Exporta vista previa sin servidor y archivos publicos para el sitio existente."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import base64,hashlib,json,mimetypes,re,sys
ROOT=Path(__file__).resolve().parent.parent
OUT=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT.parents[1]/'Bundles/Tenkai_Checker_Web_20261025'
OUT.mkdir(parents=True,exist_ok=True)
public=sorted(p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*.html') if '<nav id="site-nav"' in p.read_text(encoding='utf-8'))
public += ['tenkai-shaker.html','sitemap.xml','assets/structure.css','assets/checker.css','assets/checker-viewer.js']
public += [p.relative_to(ROOT).as_posix() for p in sorted((ROOT/'assets/checker').iterdir()) if p.is_file()]
def sha(b):return hashlib.sha256(b).hexdigest()
def data_uri(name):
    path=ROOT/name
    assert path.is_file() and path.is_relative_to(ROOT)
    mime={'.webp':'image/webp','.json':'application/json','.mp4':'video/mp4'}.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0]
    assert mime,path.name
    return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()
html=(ROOT/'tenkai-checker.html').read_text(encoding='utf-8')
scripts=[]
def embed_script(m):
    scripts.append((ROOT/m[1]).read_text(encoding='utf-8').replace('</script','<\\/script'))
    return ''
html=re.sub(r'<script src="(assets/[^"<>]+)" defer></script>',embed_script,html)
html=re.sub(r'<link rel="stylesheet" href="(assets/[^"<>]+)">',lambda m:'<style>'+ (ROOT/m[1]).read_text(encoding='utf-8')+'</style>',html)
html=re.sub(r'\b(src|poster|data-model)="(assets/[^"<>]+)"',lambda m:m[1]+'="'+data_uri(m[2])+'"',html)
html=re.sub(r'href="(assets/[^"<>]+)"',lambda m:'href="'+data_uri(m[1])+'"',html)
html=html.replace('href="tenkai-checker.html"','href="#diseno"')
html=re.sub(r'href="((?!https?:|data:|#|mailto:|tel:)[^"<>]+)"',lambda m:'href="https://tenkaitenshi.xyz/'+m[1]+'"',html)
html=html.replace('</body>','<script>'+('\n;\n'.join(scripts))+'</script></body>')
assert 'src="assets/' not in html and 'data-model="assets/' not in html
preview=OUT/'Tenkai_Checker_Vista_Previa_20261025.html';preview.write_text(html,encoding='utf-8')
guide='''# Tenkai Checker — sección independiente, diseño 2.0 y medios reales 1.0

Abre `Tenkai_Checker_Vista_Previa_20261025.html` en Chrome o Edge para revisar el 3D, la fotografía y el video sin servidor. Sus recursos están incrustados; los enlaces de la propia sección permanecen en la vista previa. Los demás enlaces de navegación y contacto apuntan al sitio real.

`web/` contiene únicamente archivos nuevos o actualizados para añadir a la web estática existente. Conserva el resto del sitio. La nueva ruta es `tenkai-checker.html`, con pestaña global y navegación propia. Tenkai POS la enlaza desde `tenkai-pos-landing.html#checador`. La ruta anterior `tenkai-shaker.html` redirige a Checker. El sitemap incluye la ruta nueva y excluye el alias. El paquete incorpora las páginas con el menú global actualizado; conserva el resto de recursos del sitio.

En el repositorio real `MASTER TENKAI/tenkai-tenshi-web` también se actualizaron los generadores, prueba y README. La publicación habitual en GitHub Pages se realiza mediante commit y push a main. Este exportador solo prepara archivos locales: no ejecuta commits, pushes ni despliegues.

La vista exterior procede del diseño AE/AF. El visor público incluye doce piezas exteriores opacas y carece de despiece o transparencia. La fotografía y el video están identificados como prototipo 1.0; el video original conserva sus bytes. El 3D y sus posters son representación del diseño 2.0 en desarrollo.

Condiciones indicadas por el propietario: equipo completo con base sin batería $5,800 MXN; con batería $6,500 MXN, batería 10,000 mAh, apagador propio y autonomía estimada 4–5 horas. Ambas versiones incluyen garantía limitada de un año en componentes; excluye daños por manipulación y daños externos. Fabricación bajo pedido con entrega aproximada de 25 días tras el pago. La autonomía es estimada, no una medición nueva de esta tarea. El respaldo alimenta el checador; para actualizar precios deben seguir disponibles la red y Tenkai POS o el puente, según la integración.

Tenkai POS usa conexión rápida nativa sin programa puente. Se proporciona puente para Eleventa y SICAR. El propietario confirmó Eleventa MultiCaja y SICAR 4.0 en vivo, con cambios de productos, precios y códigos en pocos segundos. Eleventa MonoCaja usa el último respaldo y requiere cerrar el POS, actualizar el catálogo en el puente, enviarlo al checador y reabrir el POS. El equipo consulta sin internet el último catálogo descargado; sin conexión no recibe cambios. Esta entrega verifica la presentación web; las pruebas del hardware e integraciones fueron confirmadas por el propietario.

Verificación de Checker: visor, video, teclado, seis anchos de 320 a 1440 px y alternativas sin JS/WebGL PASS; precios, batería, garantía, entrega y separación nativo/puente PASS; navegación con 10 rutas globales y 82 capítulos previos PASS; revisión general de 53 rutas a cinco anchos PASS. Las pruebas se registran en audit-artifacts/shaker-web-20261025. `tests/pos-check.cjs` conserva un fallo anterior de texto no visible en acordeones cerrados; se reprodujo también con el HTML de HEAD anterior al cambio. No se modificó esa prueba ni contenido ajeno para ocultarlo.

El paquete lleva MANIFEST_SHA256.json e integridad ZIP comprobada. El despliegue y su comprobación en el dominio se registran por separado de esta exportación.
'''
manifest={n:{'bytes':(ROOT/n).stat().st_size,'sha256':sha((ROOT/n).read_bytes())} for n in public}
manifest['vista_previa']={'bytes':preview.stat().st_size,'sha256':sha(preview.read_bytes())}
(OUT/'PUBLICACION.md').write_text(guide,encoding='utf-8')
(OUT/'MANIFEST_SHA256.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
dest=OUT/'Tenkai_Checker_Web_20261025.zip'
with ZipFile(dest,'w',ZIP_DEFLATED,compresslevel=8) as z:
    for n in public:z.write(ROOT/n,'web/'+n)
    for p in [preview,OUT/'PUBLICACION.md',OUT/'MANIFEST_SHA256.json']:z.write(p,p.name)
with ZipFile(dest) as z:
    assert z.testzip() is None
    for n in public:assert sha(z.read('web/'+n))==manifest[n]['sha256']
report={'estado':'PASS_PAQUETE','publicacion_ejecutada_por_exportador':False,'ZIP':str(dest),'bytes':dest.stat().st_size,'SHA256':sha(dest.read_bytes()),'vista_previa':str(preview),'archivos_web':len(public),'CRC_y_hashes':'PASS'}
(OUT/'entrega.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
