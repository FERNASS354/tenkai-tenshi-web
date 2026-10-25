const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const {chromium}=require(process.env.TENKAI_PLAYWRIGHT_PATH||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base=(process.env.TENKAI_SITE_URL||'http://127.0.0.1:4173/').replace(/\/?$/,'/');
const out=process.env.TENKAI_QA_OUTPUT||path.resolve(__dirname,'../../../audit-artifacts/shaker-web-20261025/qa');
const expected=['cuerpo','tapa','vidrio','area_pantalla','cara_lector','aro_optico','lente','tapa_usb','cassette_lector','junta_bisel','junta_optica','seguro_pared'];
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({channel:'chrome',headless:true});
 const evidence={anchos:[],vistas:[],exterior:true,video:{},errores:[]};
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base+'tenkai-checker.html',{waitUntil:'networkidle'});
  const root=page.locator('[data-checker-viewer]');await root.locator('canvas').waitFor();await page.waitForFunction(()=>document.querySelector('[data-checker-viewer]')?.dataset.ready==='true');
  assert.equal(await root.getAttribute('data-parts'),'12');
  const model=await (await page.request.get(base+'assets/checker/checker-v2-exterior.json')).json();
  assert.equal(model.version,'2.0');assert.deepEqual(model.parts.map(p=>p.name).sort(),expected.sort());
  assert(!model.parts.some(p=>/pcb|bateria|ups|hub|bandeja|retenedor/i.test(p.name)));
  assert.equal(await root.locator('select,input,[data-control]').count(),0);
  assert.equal(await page.locator('h1').count(),1);
  assert((await page.locator('#prototipo').innerText()).includes('prototipo 1.0'));
  assert.match(await page.locator('.checker-hero .eyebrow').innerText(),/Tenkai Checker/i);
  assert.equal(await page.locator('.site-nav a[href="tenkai-checker.html"][aria-current="page"]').count(),1);
  assert.equal(await page.locator('nav[aria-label="Tenkai Checker"]').count(),1);
  assert.equal(await page.locator('nav[aria-label="Tenkai POS"]').count(),0);
  assert((await page.locator('.checker-integration-native').innerText()).includes('no necesita un programa puente'));
  assert.equal(await page.locator('.checker-integration').count(),4);
  const options=page.locator('[data-shaker-option]');assert.equal(await options.count(),2);
  assert.equal(await options.nth(0).getAttribute('data-price-mxn'),'5800');assert.match(await options.nth(0).innerText(),/\$5,800/);
  assert.equal(await options.nth(1).getAttribute('data-price-mxn'),'6500');assert.match(await options.nth(1).innerText(),/\$6,500/);
  assert.match(await options.nth(1).innerText(),/10,000 mAh/);assert.match(await options.nth(1).innerText(),/estimada de 4–5 horas/);assert.match(await options.nth(1).innerText(),/Apagador propio/);
  for(let i=0;i<2;i++){assert.match(await options.nth(i).innerText(),/base/);assert.match(await options.nth(i).innerText(),/Garantía limitada de un año/);assert(new URL(await options.nth(i).locator('a').getAttribute('href')).searchParams.get('text').includes('Tenkai Checker'));}
  assert.match(await page.locator('#garantia').innerText(),/25 días/);assert.match(await page.locator('#garantia').innerText(),/a partir del pago/);assert.match(await page.locator('#garantia').innerText(),/manipulación ni daños externos/);
  assert.match(await page.locator('.shaker-battery-note').innerText(),/red y Tenkai POS o el programa puente/);
  const lastFrame=()=>root.getAttribute('data-frames');
  const afterFrame=async old=>page.waitForFunction(old=>Number(document.querySelector('[data-checker-viewer]').dataset.frames)>Number(old),old);
  for(const view of ['frente','perfil','detras','oblicua']){
   const before=await lastFrame();await root.locator(`[data-view="${view}"]`).click();await afterFrame(before);
   assert.equal(await root.locator(`[data-view="${view}"]`).getAttribute('aria-pressed'),'true');
   await root.screenshot({path:path.join(out,'modelo-'+view+'.png')});evidence.vistas.push(view);
  }
  let before=await lastFrame();await root.locator('[data-zoom="in"]').click();await afterFrame(before);
  before=await lastFrame();await root.locator('[data-zoom="out"]').click();await afterFrame(before);
  before=await lastFrame();await root.locator('[data-reset]').click();await afterFrame(before);
  const canvas=root.locator('canvas');await canvas.focus();before=await lastFrame();await page.keyboard.press('ArrowLeft');await afterFrame(before);
  before=await lastFrame();await page.keyboard.press('Home');await afterFrame(before);assert.equal(await root.locator('[data-view="frente"]').getAttribute('aria-pressed'),'true');
  const rect=await canvas.boundingBox();before=await lastFrame();await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.mouse.down();await page.mouse.move(rect.x+rect.width/2+90,rect.y+rect.height/2+20,{steps:8});await page.mouse.up();await afterFrame(before);
  assert.equal(await root.locator('[aria-pressed="true"]').count(),0);
  await root.locator('[data-reset]').click();
  for(const width of [320,360,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await page.waitForTimeout(100);
   const layout=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));assert(layout.scroll<=layout.viewport+1,JSON.stringify(layout));
   const box=await canvas.boundingBox();assert(box.width>240&&box.height>300);
   const sizes=await root.locator('button').evaluateAll(nodes=>nodes.map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})));
   assert(sizes.every(b=>b.w>=44&&b.h>=44));
   if(width===320){const old=await canvas.evaluate(c=>c.toDataURL());const f=await lastFrame();await root.locator('[data-zoom="in"]').click();await afterFrame(f);assert.notEqual(await canvas.evaluate(c=>c.toDataURL()),old,'El zoom debe cambiar el render tambien en movil');await root.locator('[data-reset]').click();}
   await page.screenshot({path:path.join(out,'pagina-'+width+'.png'),fullPage:true});evidence.anchos.push(width);
  }
  const v=page.locator('video');assert.equal(await v.getAttribute('preload'),'none');assert.equal(await v.getAttribute('autoplay'),null);assert.notEqual(await v.getAttribute('playsinline'),null);
  const response=await page.request.get(base+'assets/checker/checker-v1-demo.mp4');assert.equal(response.status(),200);assert(response.headers()['content-type'].includes('video/mp4'));
  evidence.video=await v.evaluate(v=>new Promise((resolve,reject)=>{v.onloadedmetadata=()=>resolve({duration:v.duration,width:v.videoWidth,height:v.videoHeight});v.onerror=()=>reject(new Error('No carga video'));v.load();}));
  assert(evidence.video.duration>8&&evidence.video.width===480&&evidence.video.height===864);
  await v.evaluate(async v=>{v.muted=true;await v.play();});await page.waitForFunction(()=>document.querySelector('video').currentTime>.5);
  evidence.video.reproduccion=true;await v.evaluate(v=>v.pause());
  await page.locator('[data-preview]').click();assert(await page.locator('dialog.lightbox').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('dialog.lightbox').isVisible()));
  for(const a of await page.locator('main a').evaluateAll(nodes=>nodes.map(a=>a.href))){
   const url=new URL(a);if(url.origin!==new URL(base).origin)continue;
   const r=await page.request.get(url.href);assert(r.ok(),a);
  }
  await page.goto(base+'tenkai-pos-landing.html#checador');assert.equal(await page.locator('#checador a[href="tenkai-checker.html"]').count(),2);assert.equal(await page.locator('script[src*="checker-viewer"]').count(),0);
  assert.equal(await page.locator('.pos-suite-nav a').count(),3);await page.locator('#checador .button').click();assert(page.url().endsWith('/tenkai-checker.html'));
  await page.goto(base+'tenkai-shaker.html');await page.waitForURL('**/tenkai-checker.html');assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://tenkaitenshi.xyz/tenkai-checker.html');
  assert.deepEqual(errors,[]);evidence.errores=errors;
  const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const nojs=await plain.newPage();await nojs.goto(base+'tenkai-checker.html');assert(await nojs.locator('.checker-poster').isVisible());assert.equal(await nojs.locator('.checker-poster').evaluate(i=>i.complete&&i.naturalWidth>0),true);assert(await nojs.locator('#especificaciones').isVisible());await plain.close();evidence.sinJS=true;
  const fallback=await browser.newPage();await fallback.addInitScript(()=>HTMLCanvasElement.prototype.getContext=function(){return null;});await fallback.goto(base+'tenkai-checker.html');await fallback.waitForFunction(()=>document.querySelector('[data-checker-viewer]')?.dataset.ready==='fallback');assert(await fallback.locator('.checker-poster').isVisible());assert.equal(await fallback.locator('[data-checker-viewer] button:disabled').count(),7);await fallback.close();evidence.sinWebGL=true;
  evidence.estado='PASS';fs.writeFileSync(path.join(out,'checker-result.json'),JSON.stringify(evidence,null,2));console.log('CHECKER_WEB_PASS',JSON.stringify(evidence));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
