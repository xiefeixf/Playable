// 提取 HTML 中的内联 <script> 并逐段做语法检查，定位 SyntaxError
// 用法：node tools/check_scripts.cjs games/xxx.html
const fs = require('fs');
const vm = require('vm');
const file = process.argv[2];
if (!file) { console.log('用法: node tools/check_scripts.cjs games/xxx.html'); process.exit(1); }
const html = fs.readFileSync(file, 'utf8');
const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m, i = 0, bad = 0;
while ((m = re.exec(html)) !== null) {
  i++;
  const code = m[1];
  const startLine = html.slice(0, m.index).split('\n').length;
  if (!code.trim()) { console.log(`#${i} (line ${startLine}) 空脚本，跳过`); continue; }
  try {
    new vm.Script(code, { filename: `${file}#script${i}` });
    console.log(`#${i} (line ${startLine}, ${(code.length / 1024).toFixed(0)}KB) OK`);
  } catch (e) {
    bad++;
    console.log(`#${i} (line ${startLine}, ${(code.length / 1024).toFixed(0)}KB) 语法错误: ${e.message}`);
    // 打印出错位置附近内容
    const stack = e.stack || '';
    const lm = stack.match(/<anonymous>:(\d+):(\d+)/) || stack.match(/script\d+\.js:(\d+):(\d+)/);
    if (lm) {
      const errLine = parseInt(lm[1], 10) - 2; // vm.Script 包了 2 行头
      const lines = code.split('\n');
      const ctx = lines.slice(Math.max(0, errLine - 3), errLine + 2);
      console.log('  出错附近内容:');
      ctx.forEach((l, k) => console.log('   |', l.slice(0, 200)));
    }
  }
}
console.log(`共 ${i} 段脚本，${bad} 段语法错误`);
