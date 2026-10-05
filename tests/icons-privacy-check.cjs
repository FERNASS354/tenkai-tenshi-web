const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.TENKAI_PLAYWRIGHT_PATH||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=path.resolve(__dirname,'..');const base=process.env.TENKAI_SITE_URL||'http://127.0.0.1:4173/';
const out=process.env.TENKAI_QA_OUTPUT||path.resolve(root,'../../audit-artifacts/web-icons-policy-20261005/qa-icons-privacy');
const baseline='a6d4067ecbe44433c829f722b6b03e8df2db019f';
const previous=file=>execFileSync('git',['show',baseline+':'+file],{cwd:root,maxBuffer:8*1024*1024});
const ids=['distribution','distribution-host','distribution-client','distribution-admin','routes','inventory-management','browser','calculator','forge-suite','music','race-engineer','rom-studio'];
const pages=['apps/distribution.html','apps/distribution-host.html','apps/distribution-client.html','apps/distribution-admin.html','apps/routes.html','apps/inventory-management.html','apps/tenkai-browser.html','apps/calculator3d.html','apps/forge-suite.html','apps/music.html','apps/race-engineer.html','dev/tenkai-rom-studio-universal-allwinner.html'];
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 for(const id of ['inventory','multipos','resguard','boss','sync']){
  const file='assets/icons/pos-suite/'+id+'.svg';assert(fs.readFileSync(path.join(root,file)).equals(previous(file)),id+' approved icon changed');
 }
 assert(fs.readFileSync(path.join(root,'assets/icons/pos-windows.png')).equals(previous('assets/icons/pos-windows.png')));
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  for(let n=0;n<ids.length;n++){
   await page.goto(base+pages[n],{waitUntil:'networkidle'});
   const icon=page.locator(`main img[src$="/app-suite/${ids[n]}.svg"]`).first();assert.equal(await icon.count(),1,pages[n]);
   await icon.scrollIntoViewIfNeeded();await icon.evaluate(i=>i.decode());assert(await icon.evaluate(i=>i.naturalWidth>0),ids[n]);
  }
  for(const route of ['aplicaciones.html','proyectos-dev.html','tenkai-rom-studio-allwinner.html','ecosistemas/tenkai-distribution.html','ecosistemas/tenkai-makers.html']){
   await page.goto(base+route);assert.equal(await page.locator('main img[src*="icons/professional"]').count(),0,route+' old icons');
  }
  await page.goto(base+'tenkai-pos-landing.html');
  assert.match(await page.locator('[data-price="care"]').innerText(),/actualizaciones por un año más/);
  assert.match(await page.locator('[data-price="care"]').innerText(),/dos cambios de PC/);
  assert(!/Soporte por WhatsApp/.test(await page.locator('[data-price="care"]').innerText()));
  assert.match(await page.locator('#precios .section-heading').last().innerText(),/Un módulo habilita/);
  await page.goto(base+'terminos-licencia-eula.html');
  assert.match(await page.locator('#actualizaciones').innerText(),/actualizaciones por un año más/);
  assert.match(await page.locator('#actualizaciones').innerText(),/dos cambios de PC/);
  await page.goto(base+'politica-privacidad.html');
  const previousIds=[...previous('politica-privacidad.html').toString('utf8').matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]).filter(id=>!['site-nav','preview-caption','preview-image','contenido'].includes(id));
  for(const id of previousIds)assert.equal(await page.locator(`[id="${id}"]`).count(),1,'privacy bookmark '+id);
  assert.match(await page.locator('#datos').innerText(),/teléfonos/);
  assert.match(await page.locator('#play-title').innerText(),/Tenkai Music/);
  assert.match(await page.locator('#music').innerText(),/aunque desinstales/);
  assert.match(await page.locator('#music').innerText(),/alarmas y recordatorios/);
  assert.match(await page.locator('#respaldos').innerText(),/Android/);
  assert.match(await page.locator('#licencias').innerText(),/comprador del software/);
  assert.match(await page.locator('#nube').innerText(),/cancelaciones de apartados/);
  assert.match(await page.locator('#derechos').innerText(),/no borra automáticamente/);
  assert(!/Borrador|texto original|Privacidad garantizada/.test(await page.locator('main').innerText()));
  await page.getByRole('link',{name:'Pedir acceso, corrección o eliminación →'}).click();
  assert.equal(new URL(page.url()).hash,'#solicitar-eliminacion');
  assert(await page.getByRole('link',{name:'Solicitar por correo',exact:true}).isVisible());
  for(const width of [360,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo(0,0));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'privacy overflow '+width);
   await page.screenshot({path:path.join(out,'privacy-'+width+'.png'),fullPage:true});
   if(width===1440||width===390)await page.screenshot({path:path.join(out,'privacy-hero-'+width+'.png')});
  }
  await page.goto(base+'politica-privacidad.html#programas-directos');
  assert(await page.locator('#direct-title').isVisible());
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await noJS.newPage();
  await plain.goto(base+'politica-privacidad.html');await plain.locator('.privacy-scope[href="#programas-directos"]').click();
  assert(new URL(plain.url()).hash==='#programas-directos');assert(await plain.locator('#direct-title').isVisible());await noJS.close();
  const result={status:'PASS',new_icons:12,approved_icons_unchanged:5,pos_original_unchanged:true,privacy_bookmarks:previousIds.length,care:'Annual updates and 2 assisted PC migrations',widths:[360,390,768,1024,1440],base};
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
