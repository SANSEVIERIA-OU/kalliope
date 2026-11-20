// Il primo schermo a più misure: dove stanno il comando (il pulsante del file), lo stato «Oggi:» e la didascalia, e una foto.
// Uso: node primo.mjs <url-base> <cartella-uscita> <percorso> <misure,…> [--ridotto] [--prefisso=nome]
const {chromium} = await import(process.env.PLAYWRIGHT);
import fs from 'node:fs';
const [base, out, percorso, misure, ...resto] = process.argv.slice(2);
const ridotto = resto.includes('--ridotto'); const pre = resto.find(a => a.startsWith('--prefisso='))?.split('=')[1] ?? 'primo';
fs.mkdirSync(out, {recursive: true});
const b = await chromium.launch();
for (const m of misure.split(',')) {
  const [w, h] = m.split('x').map(Number);
  const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: ridotto ? 'reduce' : 'no-preference'});
  const errori = []; p.on('pageerror', e => errori.push(String(e)));
  await p.goto(base + percorso, {waitUntil: 'networkidle'}); await p.waitForTimeout(ridotto ? 700 : 6500);
  const f = `${out}/${pre}-${w}x${h}.png`; await p.screenshot({path: f});
  const r = await p.evaluate(() => { const q = s => { const e = [...document.querySelectorAll(s)].find(x => x.getClientRects().length && getComputedStyle(x).visibility !== 'hidden'); if (!e) return null; const r = e.getBoundingClientRect(); return {top: Math.round(r.top), bottom: Math.round(r.bottom)}; };
    return {vh: innerHeight, scarica: q('#comandi-apertura .scarica'), inoltra: q('#comandi-apertura .collegamento'), stato: q('.apertura .stato'), didascalia: q('.didascalia'), sistemi: q('.sistemi'), largo: document.documentElement.scrollWidth}; });
  console.log(`${w}x${h}`, JSON.stringify(r), errori.length ? 'ERRORI ' + errori.join('|') : '');
  await p.close();
}
await b.close();
