// 生成 18 个渐变封面 SVG（720×1280 竖屏，与参考站封面比例一致）
// 用法：node tools/gen_covers.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, basename } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataSrc = readFileSync(join(__dirname, "../js/data.js"), "utf8");
// 在沙箱内求值 data.js，取出 PAGES 数组
const PAGES = new Function(dataSrc + "\nreturn (typeof PAGES !== 'undefined') ? PAGES : null;")();
if (!Array.isArray(PAGES)) {
  console.error("未能从 js/data.js 读取到 PAGES 数组");
  process.exit(1);
}

const outDir = join(__dirname, "../imgs/covers");
mkdirSync(outDir, { recursive: true });

// 简单可复现的伪随机（按字符串散列），保证每次生成图案一致
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function fontSize(name) {
  const n = [...name].length;
  if (n <= 4) return 92;
  if (n <= 6) return 74;
  if (n <= 8) return 60;
  return 50;
}

function buildSVG(page, idx) {
  const { name, partner, c1, c2, cover } = page;
  const key = basename(cover).replace(/\.svg$/, "");
  const rnd = hash(key);

  // 散落星点
  let dots = "";
  for (let i = 0; i < 46; i++) {
    const x = Math.round(rnd() * 720);
    const y = Math.round(rnd() * 1280);
    const r = (rnd() * 2.4 + 0.6).toFixed(2);
    const o = (rnd() * 0.5 + 0.15).toFixed(2);
    dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${o}"/>`;
  }
  // 柔光大圆
  const big = (cx, cy, r, o) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="${o}"/>`;
  const glow =
    big(Math.round(rnd() * 720), Math.round(rnd() * 500) + 60, Math.round(rnd() * 130 + 90), ".10") +
    big(Math.round(rnd() * 720), Math.round(rnd() * 500) + 480, Math.round(rnd() * 110 + 70), ".08");

  const fs = fontSize(name);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="vign" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.45"/>
    </radialGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0e1a" stop-opacity="0"/>
      <stop offset="0.62" stop-color="#0a0e1a" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#0a0e1a" stop-opacity="0.85"/>
    </linearGradient>
  </defs>

  <rect width="720" height="1280" fill="url(#bg)"/>
  ${glow}
  ${dots}
  <rect width="720" height="1280" fill="url(#vign)"/>

  <!-- 顶部厂商标签 -->
  <g transform="translate(360,232)" text-anchor="middle">
    <rect x="-92" y="-30" width="184" height="56" rx="28" fill="#ffffff" opacity="0.14"/>
    <text x="0" y="8" font-family="'Microsoft YaHei','PingFang SC','Noto Sans SC','Source Han Sans SC',sans-serif" font-size="30" font-weight="700" letter-spacing="3" fill="#ffffff" opacity="0.92">${esc(partner)}</text>
  </g>

  <!-- 中央图标徽标（播放三角 + 圆环） -->
  <g transform="translate(360,470)" fill="none" stroke="#ffffff">
    <circle r="74" stroke-opacity="0.18" stroke-width="3"/>
    <circle r="52" fill="#ffffff" fill-opacity="0.16" stroke="none"/>
    <path d="M-18 -28 L34 0 L-18 28 Z" fill="#ffffff" fill-opacity="0.95" stroke="none"/>
  </g>

  <!-- 标题 -->
  <g transform="translate(360,840)" text-anchor="middle">
    <text y="0" font-family="'Microsoft YaHei','PingFang SC','Noto Sans SC','Source Han Sans SC',sans-serif" font-size="${fs}" font-weight="900" fill="#ffffff" style="text-shadow:0 2px 18px rgba(0,0,0,.55)">${esc(name)}</text>
    <rect x="-46" y="34" width="92" height="5" rx="2.5" fill="url(#sheen)"/>
  </g>

  <rect width="720" height="1280" fill="url(#bottom)"/>
</svg>
`;
}

let count = 0;
for (const p of PAGES) {
  const key = basename(p.cover);
  writeFileSync(join(outDir, key), buildSVG(p, count++), "utf8");
}
console.log(`已生成 ${count} 个封面到 ${outDir}`);
