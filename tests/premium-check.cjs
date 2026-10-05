const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.TENKAI_PLAYWRIGHT_PATH||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=path.resolve(__dirname,'..');
const output=process.env.TENKAI_QA_OUTPUT||path.resolve(root,'../../audit-artifacts/web-premium-20261005/qa');
const base=process.env.TENKAI_SITE_URL||'http://127.0.0.1:4173/';
const routes=[];
for(const dir of ['','apps','ecosistemas','dev','manuales','casos'])for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true}))if(e.isFile()&&e.name.endsWith('.html'))routes.push(dir?dir+'/'+e.name:e.name);
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const errors=[];const issues=[];const checked=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   if(['apps/tenkai-pos.html','ecosistemas/tenkai-pos.html'].includes(route))continue;
   await page.goto(base+route,{waitUntil:'networkidle'});
   const result=await page.evaluate(()=>{
    const refs=[...document.querySelectorAll('[href],[src]')].flatMap(e=>[e.getAttribute('href'),e.getAttribute('src')]).filter(Boolean);
    const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
    return {refs,ids,h1:[...document.querySelectorAll('h1')].filter(e=>e.checkVisibility()).length,main:!!document.querySelector('main'),text:document.querySelector('main')?.innerText||''};
   });
   if(result.h1!==1)issues.push(`${route}: ${result.h1} h1`);
   if(result.ids.length!==new Set(result.ids).size)issues.push(`${route}: IDs duplicados`);
   for(const ref of result.refs){
    if(/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref))continue;
    const url=new URL(ref,page.url());let local=decodeURIComponent(url.pathname).replace(/^\//,'');
    if(!local)local='index.html';
    if(!fs.existsSync(path.join(root,local)))issues.push(`${route}: recurso ausente ${ref}`);
    if(url.hash){
     const target=fs.existsSync(path.join(root,local))&&fs.readFileSync(path.join(root,local),'utf8');
     const id=decodeURIComponent(url.hash.slice(1));
     if(target&&!new RegExp(`id=["']${id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`).test(target))issues.push(`${route}: ancla ausente ${ref}`);
    }
   }
   if(route.startsWith('manuales/')||['index.html','tenkai-pos-landing.html','conexiones.html','casos/recibir-mercancia.html','apps/inventory.html','apps/multipos.html','apps/resguard.html','apps/boss.html','apps/sync.html'].includes(route)){
    if(/\b(SQLite|Flutter|Dart|SHA-256|Cloudflare|UUID|ACK|API|AES|HTTP|D1)\b/.test(result.text))issues.push(`${route}: jerga técnica en contenido editorial`);
   }
   for(const width of [360,390,768,1024,1440]){
    await page.setViewportSize({width,height:1000});
    await page.evaluate(()=>scrollTo(0,0));
    const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return r.width&&r.right>innerWidth+2&&cs.position!=='fixed'&&!e.closest('.table-scroll,.pos-table-scroll');}).slice(0,6).map(e=>e.className)}));
    if(layout.scroll>width+1)issues.push(`${route}: overflow ${width} ${JSON.stringify(layout)}`);
   }
   checked.push(route);
   console.log('CHECK',route);
  }
  await page.goto(base);
  await page.setViewportSize({width:390,height:844});
  await page.locator('.menu-button').click();assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'),'false');
  await page.locator('[data-preview]').first().focus();await page.keyboard.press('Enter');assert(await page.locator('dialog').evaluate(e=>e.open));
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(e=>e.open),false);assert(await page.locator('[data-preview]').first().evaluate(e=>e===document.activeElement));
  await page.screenshot({path:path.join(output,'home-mobile.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(output,'home-desktop.png'),fullPage:true});
  await page.screenshot({path:path.join(output,'hero-desktop.png')});
  for(const route of ['tenkai-pos-landing.html','apps/inventory.html','apps/boss.html','conexiones.html','manuales/inventory.html','casos/recibir-mercancia.html']){
   await page.goto(base+route);await page.screenshot({path:path.join(output,route.replaceAll('/','-').replace('.html','')+'.png'),fullPage:true});
  }
  await page.goto(base+'manuales/inventory.html');await page.locator('#topic-filter').fill('catálogo');assert(await page.locator('.manual-sidebar nav a:visible').count()>0);
  await page.locator('#topic-filter').fill('zzzzz');assert.equal(await page.locator('.manual-sidebar nav a:visible').count(),0);
  await page.goto(base+'casos/recibir-mercancia.html');await page.locator('#items').fill('360');assert((await page.locator('#time-result').innerText()).includes('180 min'));
  await page.locator('#seconds').fill('-1');assert((await page.locator('#time-result').innerText()).includes('válidas'));
  await page.goto(base+'proyectos-dev.html');await page.locator('[data-lang-target="en"]').click();await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'en');
  await page.locator('[data-lang-target="es"]').click();await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'es-MX');
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await noJS.newPage();
  await plain.goto(base);assert(await plain.locator('.site-nav').isVisible());await plain.locator('[data-preview]').first().click();assert(plain.url().endsWith('.png'));await noJS.close();
  const previous=path.resolve(root,'../../audit-artifacts/web-premium-20261005/published');
  const originalFile=file=>fs.existsSync(path.join(previous,file))?fs.readFileSync(path.join(previous,file)):execFileSync('git',['show',`eb848531deb34a405b32f30923748bf9496aa865:${file}`],{cwd:root,maxBuffer:4*1024*1024});
  for(const legal of ['politica-privacidad.html','terminos-licencia-eula.html']){
   const extract=s=>s.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]?.replace(/\r\n/g,'\n');
   assert.equal(extract(fs.readFileSync(path.join(root,legal),'utf8'))===extract(originalFile(legal).toString('utf8')),true,`${legal}: se modificó el contenido legal`);
  }
  const current=fs.readFileSync(path.join(root,'assets/icons/pos-windows.png'));assert(current.equals(originalFile('assets/icons/pos-windows.png')),'Icono POS modificado');
  const summary={status:issues.length||errors.length?'FAIL':'PASS',routes:checked.length,viewports:[360,390,768,1024,1440],issues,errors,checks:['Recursos y anclas','Diseño adaptable','Menú móvil y Escape','Capturas y retorno de foco','Filtro de temas','Estimación con validación','Acceso sin JavaScript','Textos legales intactos','Icono POS intacto']};
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary,null,2));assert.deepEqual(issues,[]);assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
