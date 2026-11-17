// «non ancora»: il tratto «Non promettiamo date»: l'elenco delle versioni che entra scorrendo, «Copia» con gli appunti
// permessi e negati, con il mouse e con la tastiera. Uso: node copia.mjs <url> <uscita> <misure>
import {mkdirSync, writeFileSync} from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT);
const [url, uscita, misureArg] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await pw.chromium.launch({headless: true});
const log = [];
for (const [w, h] of misureArg.split(',').map(x => x.split('x').map(Number))) for (const permesso of [true, false]) {
  const tel = w < 900;
  const ctx = await b.newContext({viewport: {width: w, height: h}, deviceScaleFactor: 1, ...(tel ? {isMobile: true, hasTouch: true} : {})});
  if (permesso) await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], {origin: new URL(url).origin});
  const p = await ctx.newPage(); const err = [];
  p.on('pageerror', e => err.push(String(e).split('\n')[0]));
  if (!permesso) await p.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.reject(new Error('negato'))}}); document.execCommand = () => false; });
  await p.goto(url, {waitUntil: 'load'}); await sleep(1200);
  const f = n => `${uscita}/${w}x${h}-${permesso ? 'si' : 'no'}-${n}.png`;
  // scorre a passi fino all'elenco, fotografando l'entrata
  const yv = await p.evaluate(() => document.querySelector('.versioni').getBoundingClientRect().top + scrollY);
  const meta = Math.max(0, yv - h * 0.35);
  for (let y = Math.max(0, meta - h); y <= meta; y += 60) { await p.evaluate(y => scrollTo(0, y), y); await sleep(40); }
  if (permesso) { for (const t of [0, 300, 800, 1600]) { await sleep(t ? t - (t === 300 ? 0 : t === 800 ? 300 : 800) : 0); await p.screenshot({path: f(`entra-${t}`)}); } }
  else await sleep(1600);
  const prima = await p.evaluate(() => ({btn: !document.querySelector('.copia-indirizzo').hidden}));
  if (tel) await p.tap('.copia-indirizzo'); else await p.click('.copia-indirizzo');
  await sleep(500);
  await p.screenshot({path: f('dopo-copia')});
  const dopo = await p.evaluate(async () => ({fatto: !document.querySelector('.copia-fatto').hidden, errore: !document.querySelector('.copia-errore').hidden,
    fuoco: document.activeElement?.className, testo: document.querySelector('.copia-esito').textContent.trim().slice(0, 90)}));
  let appunti = null; if (permesso) { try { appunti = await p.evaluate(() => navigator.clipboard.readText()); } catch (e) { appunti = 'ERR ' + e.message; } }
  await sleep(2500); await p.screenshot({path: f('dopo-3s')});
  const dopo3 = await p.evaluate(() => ({fatto: !document.querySelector('.copia-fatto').hidden, errore: !document.querySelector('.copia-errore').hidden}));
  log.push({w, h, permesso, prima, dopo, appunti, dopo3, err});
  await ctx.close();
}
await b.close();
writeFileSync(`${uscita}/copia.json`, JSON.stringify(log, null, 1));
for (const r of log) console.log(JSON.stringify(r));
