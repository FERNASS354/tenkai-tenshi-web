const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(require('node:os').homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root = path.resolve(__dirname, '..');
const output = process.env.POS_CHECK_OUTPUT || path.resolve(root, '../audit-artifacts/web-pos-20260914');

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.join(root, 'tenkai-pos-landing.html')).href);
    await page.locator('img[loading]').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
    await page.waitForFunction(() => [...document.images].filter(i => i.getAttribute('src')).every(i => i.complete && i.naturalWidth > 0));
    const refs = await page.locator('[href], [src]').evaluateAll(elements => elements.flatMap(e => [e.getAttribute('href'), e.getAttribute('src')]).filter(Boolean));
    const ids = await page.locator('[id]').evaluateAll(elements => elements.map(e => e.id));
    assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs');
    assert.equal(await page.locator('h1').count(), 1);
    for (const ref of refs) {
      if (/^(https?:|data:|mailto:|tel:)/.test(ref)) continue;
      if (ref.startsWith('#')) { assert(ids.includes(ref.slice(1)), `Missing anchor ${ref}`); continue; }
      const file = decodeURIComponent(ref.split(/[?#]/)[0]);
      assert(fs.existsSync(path.resolve(root, file)), `Missing local file ${file}`);
    }
    const desktopText = await page.locator('main').innerText();
    assert(!/\+98|\+157|Cero fatiga|en 3 segundos|no se traba|sin corromperse/.test(desktopText));
    for (const word of ['Costo ponderado', 'sin movimiento', '.tkc', 'respaldos', 'Piloto', '1.1.0+165']) assert(desktopText.toLowerCase().includes(word.toLowerCase()), `Missing copy: ${word}`);
    for (const width of [360, 390, 768, 900, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => scrollTo(0, 0));
      const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, overflow: [...document.querySelectorAll('body *')].filter(e => { const r=e.getBoundingClientRect(); return r.width && r.right>innerWidth+1 && getComputedStyle(e).position!=='fixed'; }).slice(0,6).map(e=>e.className) }));
      assert(layout.scroll <= width + 1, `Overflow at ${width}: ${JSON.stringify(layout)}`);
      if (width === 390) {
        await page.locator('.menu-button').click();
        assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.menu-button').getAttribute('aria-expanded'), 'false');
        await page.screenshot({ path: path.join(output, 'mobile.png'), fullPage: true });
      }
    }
    await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
    await page.screenshot({ path: path.join(output, 'hero.png') });
    await page.locator('#precios').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, 'pricing.png') });
    const firstPreview = page.locator('[data-preview]').first();
    await firstPreview.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('dialog').evaluate(e => e.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').evaluate(e => e.open), false);
    assert.equal(await firstPreview.evaluate(e => e === document.activeElement), true, 'Focus should return to screenshot link');
    await firstPreview.click();
    await page.getByRole('button', { name: 'Cerrar captura' }).click();
    assert.equal(await page.locator('dialog').evaluate(e => e.open), false);
    const faq = page.locator('#preguntas details').first();
    await faq.locator('summary').click();
    assert.equal(await faq.evaluate(e => e.open), true);
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const fallback = await noJS.newPage();
    await fallback.goto(pathToFileURL(path.join(root, 'tenkai-pos-landing.html')).href);
    await fallback.locator('[data-preview]').first().click();
    assert(fallback.url().endsWith('pos-ventas-dark.png'), 'Image fallback without JS');
    await noJS.close();
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ status: 'PASS', widths: [360,390,768,900,1024,1440], localReferences: refs.filter(r => !r.startsWith('http')).length, checks: ['local links and images','single h1 and unique IDs','restored copy and current version','no horizontal overflow','mobile navigation and Escape','dialog Enter/Escape/close/focus return','native FAQ','image fallback without JavaScript','no page errors'] }, null, 2));
    console.log('PASS: responsive layout, local links, images, keyboard, menu, FAQ, no-JS fallback and copy.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
