// 用系统 Chrome（无头）给每个试玩截图 720×1280，输出到 imgs/screenshots/<key>.png
// 前置：仓库根先起静态服务：python -m http.server 8140
// 运行：NODE_PATH="C:/Users/15980/.workbuddy/binaries/node/workspace/node_modules" node tools/screenshot_games.cjs
const { chromium } = require('playwright-core');
const PAGES = require('../js/data.js');
const fs = require('fs');
const path = require('path');

const PORT = 8140;
const BASE = `http://127.0.0.1:${PORT}/`;
const CHROME = 'C:\\Users\\15980\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';
const OUT = path.join(__dirname, '..', 'imgs', 'screenshots');
const WAIT_MS = 12000; // 引擎启动 + 资源加载的兜底等待

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: [
      '--enable-unsafe-swiftshader',
      '--use-angle=swiftshader',
      '--mute-audio',
      '--hide-scrollbars',
      '--no-first-run',
      '--disable-background-timer-throttling',
      '--disable-dev-shm-usage'
    ]
  });
  const ctx = await browser.newContext({
    viewport: { width: 720, height: 1280 },
    deviceScaleFactor: 1
  });
  const page = await ctx.newPage();
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  let ok = 0;
  const fail = [];
  for (const p of PAGES) {
    const key = p.cover.replace(/^.*\//, '').replace(/\.svg$/, '');
    const out = path.join(OUT, key + '.png');
    try {
      await page.goto(BASE + p.path, { waitUntil: 'load', timeout: 60000 });
      await page.waitForSelector('#GameCanvas', { timeout: 20000 });
      await wait(WAIT_MS);
      await page.screenshot({ path: out });
      console.log('OK  ', p.name, '->', 'imgs/screenshots/' + key + '.png');
      ok++;
    } catch (e) {
      console.log('FAIL', p.name, '-', String(e.message).split('\n')[0]);
      fail.push(p.name);
    }
  }
  await browser.close();
  console.log(`\n完成 ${ok}/${PAGES.length}${fail.length ? '；失败: ' + fail.join(', ') : ''}`);
})();
