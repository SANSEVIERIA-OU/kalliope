// N5 e N3: il posto tratteggiato prima e dopo «Copia» (stessa posizione), e l'entrata del pannello a fotogrammi fitti.
import {mkdirSync} from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT);
const [url, out, w = '1440', h = '900'] = process.argv.slice(2);
mkdirSync(out, {recursive: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await pw.chromium.launch({headless: true});
const tel = +w < 900;
const ctx = await b.newContext({viewport: {width: +w, height: +h}, ...(tel ? {isMobile: true, hasTouch: true} : {})});
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], {origin: new URL(url).origin});
const p = await ctx.newPage();
await p.goto(url, {waitUntil: 'load'}); await sleep(1000);
const top = await p.evaluate(() => document.querySelector('.versioni').getBoundingClientRect().top + scrollY);
// entrata: salto vicino e poi passi piccoli, fotogrammi ogni 100 ms del pannello
await p.evaluate(y => scrollTo(0, y), Math.max(0, top - +h * 1.05));
await sleep(300);
await p.evaluate(y => scrollTo({top: y, behavior: 'instant'}), Math.max(0, top - +h * 0.3));
const box = await p.evaluate(() => { const r = document.querySelector('.versioni').getBoundingClientRect(); return {x: Math.max(0, r.x - 10), y: Math.max(0, r.y - 10), width: r.width + 20, height: r.height + 20}; });
for (let i = 0; i < 30; i++) { await p.screenshot({path: `${out}/entra-${String(i).padStart(2, '0')}.png`, clip: box}); await sleep(70); }
await sleep(1500);
const stato = () => p.evaluate(() => { const e = document.querySelector('.versione.prossima'); const s = getComputedStyle(e), s2 = getComputedStyle(e, '::before'), s3 = getComputedStyle(e, '::after');
  return {classi: e.className, bordo: s.borderTopColor + ' ' + s.borderTopStyle, ombra: s.boxShadow.slice(0, 60), fondo: s.backgroundColor, anim: s.animationName, prima: s2.content !== 'none' ? (s2.borderTopColor + ' ' + s2.animationName + ' ' + s2.opacity + ' ' + s2.boxShadow.slice(0, 40)) : '-', dopo: s3.content !== 'none' ? (s3.borderTopColor + ' ' + s3.animationName + ' ' + s3.opacity) : '-'}; });
await p.screenshot({path: `${out}/copia-prima.png`, clip: box}); console.log('prima', JSON.stringify(await stato()));
if (tel) await p.tap('.copia-indirizzo'); else await p.click('.copia-indirizzo');
for (const t of [100, 300, 600, 1000, 1600, 2500]) { await sleep(t === 100 ? 100 : t - [100, 300, 600, 1000, 1600, 2500][[100, 300, 600, 1000, 1600, 2500].indexOf(t) - 1]); await p.screenshot({path: `${out}/copia-${t}.png`, clip: box}); console.log(t, JSON.stringify(await stato())); }
await b.close();
