// «non ancora»: il gesto «Ascolta» nel tratto finale. Scorre fino al pulsante come farebbe una persona (il pulsante in vista),
// preme, fotografa mentre suona; misura se bolla, riunione e pulsante stanno nello schermo.
// Uso: node ascolta.mjs <url> <uscita> <misure> [motore]
import {mkdirSync, writeFileSync} from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT);
const [url, uscita, misureArg, motore = 'chromium'] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const opz = motore === 'chromium' ? {headless: true, args: ['--autoplay-policy=no-user-gesture-required']} : {headless: true};
const b = await pw[motore].launch(opz);
const righe = [];
const misura = p => p.evaluate(() => {
  const r = s => { const e = document.querySelector(s); if (!e) return null; const q = e.getBoundingClientRect(); return [Math.round(q.top * 10) / 10, Math.round(q.bottom * 10) / 10]; };
  const btn = document.querySelector('.suona-frase'), a = document.querySelector('.lettore-ferma');
  const bar = document.querySelector('.barra')?.getBoundingClientRect();
  return {ih: innerHeight, y: Math.round(scrollY), barraFondo: bar && Math.round(bar.bottom), bolla: r('.bolla-chiusa'), riunione: r('.tavolo-cornice'), pulsante: r('.suona-frase'), titolo: r('#ascolta-titolo'),
    etichetta: btn ? [...btn.querySelectorAll('.etichette > span')].filter(s => getComputedStyle(s).display !== 'none' && getComputedStyle(s).visibility !== 'hidden' && +getComputedStyle(s).opacity > 0.1).map(s => s.textContent.trim()).join('|') : null,
    stato: btn?.className, audio: a ? {t: +a.currentTime.toFixed(2), fermo: a.paused, src: a.currentSrc.split('/').pop()} : null, lato: document.documentElement.scrollWidth > innerWidth};
});
for (const [w, h] of misureArg.split(',').map(x => x.split('x').map(Number))) {
  const tel = w < 900 || h < 500;
  const ctx = await b.newContext({viewport: {width: w, height: h}, deviceScaleFactor: 1, ...(tel && motore === 'chromium' ? {isMobile: true, hasTouch: true} : {})});
  const p = await ctx.newPage(); const err = [];
  p.on('pageerror', e => err.push(String(e).split('\n')[0]));
  p.on('console', m => { if (m.type() === 'error') err.push(m.text().slice(0, 160)); });
  await p.goto(url, {waitUntil: 'load'}); await sleep(1500);
  // scorre a passi fino al pulsante, come la rotella
  await p.evaluate(async () => { const s = ms => new Promise(r => setTimeout(r, ms)); const btn = document.querySelector('.suona-frase');
    while (btn.getBoundingClientRect().bottom > innerHeight - 8 && scrollY + innerHeight < document.documentElement.scrollHeight) { scrollBy(0, Math.min(120, btn.getBoundingClientRect().bottom - innerHeight + 24)); await s(60); } });
  await sleep(1800);
  const f = n => `${uscita}/${w}x${h}-${n}.png`;
  await p.screenshot({path: f('0-prima')}); righe.push({w, h, passo: 'prima', ...(await misura(p))});
  const t0 = Date.now();
  try { tel && motore === 'chromium' ? await p.tap('.suona-frase') : await p.click('.suona-frase'); } catch (e) { err.push('premi: ' + e.message.split('\n')[0]); }
  for (const s of [0.3, 1, 2.5, 4.5]) { const m = t0 + s * 1000 - Date.now(); if (m > 0) await sleep(m); await p.screenshot({path: f(`${s}s`)}); righe.push({w, h, passo: `${s}s`, ...(await misura(p))}); }
  // pausa e ripresa
  try { tel && motore === 'chromium' ? await p.tap('.suona-frase') : await p.click('.suona-frase'); } catch (e) { err.push('pausa: ' + e.message.split('\n')[0]); }
  await sleep(500); await p.screenshot({path: f('pausa')}); righe.push({w, h, passo: 'pausa', ...(await misura(p))});
  righe.push({w, h, errori: err});
  await ctx.close();
}
await b.close();
writeFileSync(`${uscita}/ascolta.json`, JSON.stringify(righe, null, 1));
for (const r of righe) console.log(r.passo ? `${r.w}x${r.h} ${r.passo}: y=${r.y} barra≤${r.barraFondo} bolla=${r.bolla} riunione=${r.riunione} pulsante=${r.pulsante} ih=${r.ih} «${r.etichetta}» audio=${JSON.stringify(r.audio)} lato=${r.lato}` : `${r.w}x${r.h} errori ${r.errori.length} ${r.errori.join(' | ')}`);
