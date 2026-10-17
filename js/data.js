// 试玩案例静态数据（页面唯一数据源，替代原参考站的 api/getPages）
// 字段：
//   name      显示名（取自各 HTML 的 <title>）
//   path      仓库内游戏 HTML 文件名（相对仓库根，已统一放在 games/ 下）
//   partner   厂商/系列标签（仅展示用）
//   editDate  最后修改日期（用于排序，5月30日的3个在前）
//   cover     封面 PNG（imgs/screenshots/<key>.png，由 tools/screenshot_games.cjs 真实截图生成）
//   c1, c2    封面渐变主色（仅作占位/兜底背景色，顶部色 + 底部色）
const PAGES = [
  { name: "切金条",           path: "games/SSD_QieJinTiao.html",            partner: "SSD",   editDate: "2026-05-30", cover: "imgs/screenshots/SSD_QieJinTiao.png",          c1: "#fbbf24", c2: "#b45309" },
  { name: "处理木材前贴版",     path: "games/SSD_ChuLiMuCaiQianTie.html",      partner: "SSD",   editDate: "2026-05-30", cover: "imgs/screenshots/SSD_ChuLiMuCaiQianTie.png",    c1: "#b45309", c2: "#78350f" },
  { name: "对应装卸",           path: "games/duiyingzhuangxie.html",          partner: "SSD",   editDate: "2026-05-30", cover: "imgs/screenshots/duiyingzhuangxie.png",          c1: "#0ea5e9", c2: "#1e3a8a" },
  { name: "处理木材",           path: "games/SSD_ChuLiMuCai.html",            partner: "SSD",   editDate: "2026-04-03", cover: "imgs/screenshots/SSD_ChuLiMuCai.png",            c1: "#a16207", c2: "#713f12" },
  { name: "环状种地",           path: "games/SSD_HuanXingZhongDi.html",       partner: "SSD",   editDate: "2026-04-03", cover: "imgs/screenshots/SSD_HuanXingZhongDi.png",       c1: "#22c55e", c2: "#14532d" },
  { name: "通电围困僵尸",       path: "games/SSD_TongDianWeiKunJiangshi.html", partner: "SSD",   editDate: "2026-04-03", cover: "imgs/screenshots/SSD_TongDianWeiKunJiangshi.png", c1: "#8b5cf6", c2: "#3b82f6" },
  { name: "画围墙",             path: "games/ssd-drawing-a-wall.html",        partner: "SSD",   editDate: "2026-04-03", cover: "imgs/screenshots/ssd-drawing-a-wall.png",        c1: "#06b6d4", c2: "#155e75" },
  { name: "农场模拟",           path: "games/ssd-farm-simulation.html",       partner: "SSD",   editDate: "2026-04-03", cover: "imgs/screenshots/ssd-farm-simulation.png",       c1: "#16a34a", c2: "#064e3b" },
  { name: "砍树打熊",           path: "games/ssd-log-and-bear.html",          partner: "SSD",   editDate: "2026-04-03", cover: "imgs/screenshots/ssd-log-and-bear.png",          c1: "#15803d", c2: "#3f2d1b" },
  { name: "背包格塔防",         path: "games/ssd-bag-tower-defence.html",     partner: "SSD",   editDate: "2026-04-03", cover: "imgs/screenshots/ssd-bag-tower-defence.png",     c1: "#7c3aed", c2: "#4c1d95" },
  { name: "打怪卖枪",           path: "games/FunPlus_SellGun.html",           partner: "FunPlus", editDate: "2026-04-03", cover: "imgs/screenshots/FunPlus_SellGun.png",           c1: "#f97316", c2: "#b91c1c" },
  { name: "营地武器塔防",       path: "games/funplus-tower-defense.html",     partner: "FunPlus", editDate: "2026-04-03", cover: "imgs/screenshots/funplus-tower-defense.png",     c1: "#ef4444", c2: "#b45309" },
  { name: "建造出兵",           path: "games/funplus_BuildingAndWar.html",    partner: "FunPlus", editDate: "2026-04-03", cover: "imgs/screenshots/funplus_BuildingAndWar.png",    c1: "#f59e0b", c2: "#475569" },
  { name: "爆金币啦",           path: "games/LS_BaoJinBiLa.html",             partner: "LS",    editDate: "2026-04-03", cover: "imgs/screenshots/LS_BaoJinBiLa.png",             c1: "#facc15", c2: "#a16207" },
  { name: "士兵出击",           path: "games/LS_ShiBingTuJi.html",            partner: "LS",    editDate: "2026-04-03", cover: "imgs/screenshots/LS_ShiBingTuJi.png",            c1: "#65a30d", c2: "#1d4ed8" },
  { name: "猛鬼宿舍",           path: "games/TY_MengGuiSuShe.html",           partner: "TY",    editDate: "2026-04-03", cover: "imgs/screenshots/TY_MengGuiSuShe.png",           c1: "#7c3aed", c2: "#1e1b4b" },
  { name: "是男人就升100级",    path: "games/TH100G.html",                    partner: "TH",    editDate: "2026-04-03", cover: "imgs/screenshots/TH100G.png",                    c1: "#ec4899", c2: "#7c3aed" },
  { name: "三冰爬塔成长",       path: "games/climbingandgrowing.html",        partner: "三冰",   editDate: "2026-04-03", cover: "imgs/screenshots/climbingandgrowing.png",        c1: "#38bdf8", c2: "#0e7490" },
  { name: "伐木加工",           path: "games/GOG_famujiagong.html",           partner: "GOG",   editDate: "2026-10-17", cover: "imgs/screenshots/GOG_famujiagong.png",           c1: "#16a34a", c2: "#3f2d1b" },
  { name: "对应装卸人",         path: "games/SSd_duiyinzhuangxieren.html",     partner: "SSD",   editDate: "2026-10-17", cover: "imgs/screenshots/SSd_duiyinzhuangxieren.png",     c1: "#0ea5e9", c2: "#1e3a8a" },
  { name: "火车拉石油",         path: "games/SSD_huochelashiyou.html",        partner: "SSD",   editDate: "2026-10-17", cover: "imgs/screenshots/SSD_huochelashiyou.png",        c1: "#f59e0b", c2: "#b45309" },
  { name: "PA火车",             path: "games/SSD_pahuoche.html",              partner: "SSD",   editDate: "2026-10-17", cover: "imgs/screenshots/SSD_pahuoche.png",              c1: "#f97316", c2: "#7c3aed" }
];

// 浏览器端：挂到 window，供 main.js 使用
if (typeof window !== "undefined") window.PAGES = PAGES;
// Node 端：供 tools/gen_covers.mjs 读取
if (typeof module !== "undefined" && module.exports) module.exports = PAGES;
