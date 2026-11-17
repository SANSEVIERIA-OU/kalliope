// Indagine sul salto del menu in Chromium: dove sta la causa. Uso: node indaga-salto.mjs <base> <pagina> [css da iniettare]
const pw = await import(process.env.PLAYWRIGHT);
const [base, pagina, css = ''] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await pw.chromium.launch({headless: true});
const nuova = async () => {
  const ctx = await b.newContext({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});
  if (css) await ctx.addInitScript(c => addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = c; document.head.append(s); }), css);
  const p = await ctx.newPage(); await p.goto(base + pagina, {waitUntil: 'load'}); await sleep(1500); return [ctx, p];
};
const out = [];
for (const y of [600, 1500]) {
  const [ctx, p] = await nuova();
  await p.evaluate(y => scrollTo(0, y), y); await sleep(700);
  const y0 = await p.evaluate(() => scrollY);
  const r = await p.locator('.pulsante-menu').boundingBox();
  await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await sleep(600);
  const y1 = await p.evaluate(() => scrollY);
  const fuoco = await p.evaluate(() => { const a = document.activeElement.getBoundingClientRect(); return `${document.activeElement.tagName} ${Math.round(a.top)}-${Math.round(a.bottom)}`; });
  await p.keyboard.press('Escape'); await sleep(500);
  const y2 = await p.evaluate(() => scrollY);
  out.push(`tocco da ${y0}: aperto ${y1} (${y1 - y0}), fuoco ${fuoco}; Esc ${y2} (${y2 - y1})`);
  await ctx.close();
}
// il fuoco da tastiera che torna nella barra (Maiusc+Tab dalla pagina, scorsa)
{
  const [ctx, p] = await nuova();
  await p.evaluate(() => scrollTo(0, 1500)); await sleep(600);
  await p.evaluate(() => { const l = [...document.querySelectorAll('main a, main button')].find(e => e.getBoundingClientRect().top > 300 && e.getBoundingClientRect().bottom < 800); (l || document.querySelector('main a, main button')).focus({preventScroll: true}); });
  const y0 = await p.evaluate(() => scrollY); const passi = [];
  for (let i = 0; i < 8; i++) { await p.keyboard.press('Shift+Tab'); await sleep(250); passi.push(await p.evaluate(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); return `${scrollY}:${e.className.toString().slice(0, 14) || e.tagName}@${Math.round(r.top)}`; })); }
  out.push(`Maiusc+Tab da ${y0}: ${passi.join(' | ')}`);
  await ctx.close();
}
console.log(pagina + (css ? ' [css]' : ' [prima]') + '\n  ' + out.join('\n  '));
await b.close();
