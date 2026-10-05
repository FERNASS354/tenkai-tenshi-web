const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const {chromium}=require(process.env.TENKAI_PLAYWRIGHT_PATH||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=path.resolve(__dirname,'..');
const base=process.env.TENKAI_SITE_URL||'http://127.0.0.1:4173/';
const out=process.env.TENKAI_QA_OUTPUT||path.resolve(root,'../../audit-artifacts/web-structure-20261005/qa-navigation');
const links=['index.html','ecosistemas.html','aplicaciones.html','proyectos-dev.html','tenkai-pos-landing.html','tenkai-founders.html','comunidad-beta.html','politica-privacidad.html','soporte-contacto.html'];
const before=file=>execFileSync('git',['show',`a319fc94ed4ec90d9d6e3dab48f8e51c2e4d164c:${file}`],{cwd:root,maxBuffer:4*1024*1024}).toString('utf8');
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  for(const route of ['index.html','ecosistemas.html','aplicaciones.html','tenkai-pos-landing.html','apps/resguard.html','manuales/pos.html']){
   await page.goto(base+route,{waitUntil:'networkidle'});
   const actual=await page.locator('.site-nav>a').evaluateAll(nodes=>nodes.map(a=>new URL(a.href).pathname.slice(1)));
   assert.deepEqual(actual,links,route+' global navigation');
  }
  await page.goto(base+'index.html');
  assert.equal(await page.locator('.pos-suite-nav').count(),0);
  assert.match(await page.locator('h1').innerText(),/Visualiza el futuro/);
  assert.match(await page.locator('main').innerText(),/software, la música, el diseño, los videojuegos/);
  assert.equal(await page.locator('[data-price]').count(),0);
  const normalizedMain=s=>s.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)[1].replace(/\r\n/g,'\n').trim();
  const original=execFileSync('git',['show','eb848531deb34a405b32f30923748bf9496aa865:index.html'],{cwd:root}).toString('utf8');
  assert.equal(normalizedMain(fs.readFileSync(path.join(root,'index.html'),'utf8')),normalizedMain(original),'Original homepage content retained');
  await page.goto(base+'tenkai-pos-landing.html');
  assert.deepEqual(await page.locator('.pos-suite-nav a').allTextContents(),['Tenkai POS','Conexiones','Manuales']);
  assert.equal(await page.locator('.pos-suite-nav a[href*="descargas"]').count(),0);
  assert(await page.getByRole('link',{name:'Descargar para Windows',exact:true}).isVisible());
  assert.equal(await page.locator('#manuales .manual-card').count(),6);
  assert.equal(await page.locator('#ecosistema .suite-app-card').count(),5);
  assert.equal(await page.locator('.feature-topic').count(),10);
  await page.locator('#tema-perdidas>summary').focus();
  await page.keyboard.press('Enter');
  assert(await page.locator('#tema-perdidas').evaluate(e=>e.open));
  assert.match(await page.locator('#tema-perdidas').innerText(),/no agrega ni descuenta mercancía/);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#tema-perdidas').evaluate(e=>e.open),false);
  await page.locator('.gallery-more>summary').focus();
  await page.keyboard.press('Enter');
  assert(await page.locator('.gallery-more').evaluate(e=>e.open));
  assert.equal(await page.locator('.gallery-more img').count(),6);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.gallery-more').evaluate(e=>e.open),false);
  let preserved=0;
  for(const app of ['pos','inventory','multipos','resguardo','boss','sync']){
   const route=`manuales/${app}.html`;
   const ids=[...before(route).matchAll(/<section class="manual-chapter" id="([^"]+)"/g)].map(m=>m[1]);
   await page.goto(base+route);
   for(const id of ids){assert.equal(await page.locator(`.manual-chapter[id="${id}"]`).count(),1,route+' '+id);preserved++;}
   assert.equal(await page.locator('.pos-suite-nav').count(),1);
   if(app==='resguardo')assert.equal(await page.locator('h1').innerText(),'Tenkai Resguard');
   assert(!/\bResguardo\b/.test(await page.locator('main').innerText()),route+' old brand');
  }
  await page.goto(base+'manuales/pos.html#diferencias');
  assert.match(await page.locator('#diferencias').innerText(),/17/);
  assert.match(await page.locator('#diferencias').innerText(),/no lo uses como una entrada de 17/);
  assert.match(await page.locator('#ponderado').innerText(),/\$25/);
  assert.match(await page.locator('#mermas').innerText(),/Solo la merma autorizada descuenta/);
  await page.goto(base+'manuales/inventory.html#auditoria');
  assert.match(await page.locator('#auditoria').innerText(),/precio de compra/);
  const existingScreens=[...before('tenkai-pos-landing.html').matchAll(/assets\/screenshots\/([^"'<>]+)/g)].map(m=>m[1]);
  for(const file of new Set(existingScreens))assert(fs.existsSync(path.join(root,'assets/screenshots',file)),file+' retained');
  await page.goto(base+'tenkai-pos-landing.html');
  for(const width of [360,390,768,1024,1280,1281,1440]){
   await page.setViewportSize({width,height:1000});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'overflow '+width);
   const nav=page.locator('.suite-links');
   assert(await nav.isVisible());
   await nav.locator('a').last().scrollIntoViewIfNeeded();
   assert(await nav.locator('a').last().isVisible());
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(out,'pos-mobile-hero.png')});
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const plain=await noJS.newPage();
  await plain.goto(base+'tenkai-pos-landing.html');
  await plain.locator('#tema-mercancia>summary').click();
  assert(await plain.locator('#tema-mercancia').evaluate(e=>e.open));
  await plain.locator('.gallery-more>summary').click();
  assert(await plain.locator('.gallery-more').evaluate(e=>e.open));
  assert(await plain.locator('.site-nav').isVisible());
  await noJS.close();
  const result={status:'PASS',original_global_routes:links.length,previous_manual_chapters_retained:preserved,pos_topics:10,manuals:6,auxiliary_apps:5,checks:['Original homepage content','Independent POS navigation','Existing manual anchors retained','MED and count explanations','Keyboard and no-JS reading','Resguard naming','Mobile and desktop navigation']};
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
