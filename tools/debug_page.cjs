// 调试：加载指定游戏页，收集 console 报错与失败请求
// 用法：node tools/debug_page.cjs games/xxx.html
const { chromium } = require('playwright-core');
const CHROME = 'C:\\Users\\15980\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 8140;
const target = process.argv[2];
if (!target) { console.log('用法: node tools/debug_page.cjs games/xxx.html'); process.exit(1); }

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--mute-audio', '--no-first-run', '--disable-dev-shm-usage']
  });
  const ctx = await browser.newContext({ viewport: { width: 720, height: 1280 } });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) {
      const loc = m.location() || {};
      console.log('[console.' + m.type() + ']', (loc.url || '').slice(0, 100) + ':' + (loc.lineNumber || '?'), '-', m.text().slice(0, 260));
    }
  });
  page.on('pageerror', (e) => console.log('[pageerror]', String(e.message || e).slice(0, 200), '\n   stack:', String(e.stack || '').split('\n').slice(0, 4).join('\n   ')));
  page.on('requestfailed', (r) => console.log('[reqfail]', r.url().slice(0, 120), '-', r.failure() && r.failure().errorText));
  page.on('response', (r) => { if (r.status() >= 400 || r.request().resourceType() === 'other') console.log('[resp ' + r.status() + ']', r.url().slice(0, 160)); });

  try {
    await page.goto(`http://127.0.0.1:${PORT}/${target}`, { waitUntil: 'load', timeout: 60000 });
    console.log('--- loaded, waiting 20s ---');
    await new Promise((r) => setTimeout(r, 20000));
    const info = await page.evaluate(() => ({
      hasCanvas: !!document.querySelector('#GameCanvas'),
      canvasW: (document.querySelector('#GameCanvas') || {}).width,
      canvasH: (document.querySelector('#GameCanvas') || {}).height,
      splashVisible: (() => { const s = document.querySelector('#splash'); return s ? getComputedStyle(s).display !== 'none' : false; })(),
      title: document.title
    }));
    console.log('[page info]', JSON.stringify(info));
  } catch (e) {
    console.log('[goto error]', String(e).split('\n')[0]);
  }
  await browser.close();
})();
