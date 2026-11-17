// Il selettore della lingua nella barra: chiuso, sopra, aperto con il mouse, chiuso con un clic fuori; con la tastiera
// (Tab fino al selettore, Invio, Tab nell'elenco, Esc); al telefono dentro il menu. Foto del primo schermo a ogni passo.
// Uso: node selettore.mjs <base> <uscita> <pagine nome=percorso;...> <misure> [motore]
import {mkdirSync, writeFileSync} from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT);
const [base, uscita, pagineArg, misureArg, motore = 'chromium'] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await pw[motore].launch({headless: true, ...(motore === 'webkit' && process.env.WK_EXE ? {executablePath: process.env.WK_EXE} : {})});
const log = [];
const stato = p => p.evaluate(() => {
  const d = [...document.querySelectorAll('details.lingua-scelta')].find(x => x.offsetParent !== null || x.getClientRects().length);
  const a = document.activeElement; const r = a?.getBoundingClientRect();
  const ul = d?.querySelector('.lingue-elenco'); const ru = ul?.getBoundingClientRect();
  const menu = document.getElementById('menu');
  return {aperto: d?.open ?? null, fuoco: a ? (a.tagName + (a.className ? '.' + String(a.className).split(' ')[0] : '') + ' «' + (a.textContent || '').trim().slice(0, 30) + '»') : null,
    fuocoVisibile: r ? (r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth) : null,
    elenco: ru && d?.open ? {x: Math.round(ru.x), y: Math.round(ru.y), w: Math.round(ru.width), h: Math.round(ru.height), fuori: ru.bottom > innerHeight || ru.right > innerWidth || ru.left < 0} : null,
    menuAperto: menu?.classList.contains('aperto') ?? null, barra: document.querySelector('.barra')?.className, lato: document.documentElement.scrollWidth > document.documentElement.clientWidth};
});
for (const [nome, percorso] of pagineArg.split(';').map(x => x.split('='))) for (const [w, h] of misureArg.split(',').map(x => x.split('x').map(Number))) {
  const tel = w < 760 && motore !== 'firefox';
  const ctx = await b.newContext({viewport: {width: w, height: h}, deviceScaleFactor: 1, ...(tel ? (motore === "chromium" ? {isMobile: true, hasTouch: true} : motore === "webkit" ? {hasTouch: true} : {}) : {})});
  const p = await ctx.newPage(); const errori = [];
  p.on('pageerror', e => errori.push(String(e).split('\n')[0]));
  p.on('console', m => { if (m.type() === 'error') errori.push(m.text().slice(0, 160)); });
  const f = n => `${uscita}/${nome}-${w}x${h}-${n}.png`;
  const passo = async (n, fn) => { try { await fn(); } catch (e) { errori.push(`${n}: ${e.message.split('\n')[0]}`); } await sleep(450); await p.screenshot({path: f(n)}); log.push({nome, w, h, passo: n, ...(await stato(p))}); };
  await p.goto(base + percorso, {waitUntil: 'load'}); await sleep(3500);
  const pm = await p.$('.pulsante-menu'); const pmVis = pm && await pm.isVisible();
  await passo('01-chiuso', async () => {});
  if (pmVis) {
    await passo('02-menu-aperto', async () => { tel ? await p.tap('.pulsante-menu') : await p.click('.pulsante-menu'); });
    await passo('03-selettore-aperto', async () => { const s = p.locator('details.lingua-scelta summary').first(); tel ? await s.tap() : await s.click(); });
    await passo('04-selettore-chiuso', async () => { const s = p.locator('details.lingua-scelta summary').first(); tel ? await s.tap() : await s.click(); });
    await passo('05-menu-chiuso-esc', async () => { await p.keyboard.press('Escape'); });
  } else {
    await passo('02-sopra', async () => { await p.hover('details.lingua-scelta summary'); });
    await passo('03-aperto-clic', async () => { await p.click('details.lingua-scelta summary'); });
    await passo('04-sopra-voce', async () => { await p.hover('details.lingua-scelta .lingue-elenco li:nth-child(4) a'); });
    await passo('05-chiuso-clic-fuori', async () => { await p.mouse.click(Math.round(w / 2), Math.round(h * 0.6)); });
  }
  // tastiera, da capo
  await p.goto(base + percorso, {waitUntil: 'load'}); await sleep(3500);
  let trovato = false;
  for (let i = 0; i < 25 && !trovato; i++) { await p.keyboard.press('Tab'); trovato = await p.evaluate(() => document.activeElement?.tagName === 'SUMMARY' || document.activeElement?.classList.contains('pulsante-menu')); }
  await passo('11-tastiera-fuoco', async () => {});
  const suMenu = await p.evaluate(() => document.activeElement?.classList.contains('pulsante-menu'));
  if (suMenu) {
    await passo('12-tastiera-menu-aperto', async () => { await p.keyboard.press('Enter'); });
    for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); if (await p.evaluate(() => document.activeElement?.tagName === 'SUMMARY')) break; }
    await passo('13-tastiera-fuoco-selettore', async () => {});
  }
  await passo('14-tastiera-aperto', async () => { await p.keyboard.press('Enter'); });
  await passo('15-tastiera-tab-voce', async () => { await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); });
  await passo('16-tastiera-esc', async () => { await p.keyboard.press('Escape'); });
  await passo('17-tastiera-esc2', async () => { await p.keyboard.press('Escape'); });
  log.push({nome, w, h, errori});
  await ctx.close();
}
await b.close();
writeFileSync(`${uscita}/selettore.json`, JSON.stringify(log, null, 1));
for (const r of log) console.log(r.passo ? `${r.nome} ${r.w}x${r.h} ${r.passo}: aperto=${r.aperto} menu=${r.menuAperto} fuoco=${r.fuoco} vis=${r.fuocoVisibile} elenco=${JSON.stringify(r.elenco)} lato=${r.lato}` : `${r.nome} ${r.w}x${r.h} ERRORI ${r.errori.length}: ${r.errori.join(' | ')}`);
