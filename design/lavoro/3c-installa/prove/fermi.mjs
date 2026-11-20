// Foto del primo schermo a più misure (dopo l'arrivo), anche con movimento ridotto e senza JavaScript.
// Uso: node fermi.mjs <url> <cartella> <misure,…> [--ridotto] [--senza-js] [--attesa=7000] [--prefisso=primo]
const {chromium} = await import(process.env.PLAYWRIGHT);
import fs from 'node:fs';
const [url, out, misure, ...resto] = process.argv.slice(2);
const ridotto = resto.includes('--ridotto'), senzaJs = resto.includes('--senza-js');
const attesa = +(resto.find(a => a.startsWith('--attesa='))?.split('=')[1] ?? 7000);
const pre = resto.find(a => a.startsWith('--prefisso='))?.split('=')[1] ?? 'primo';
fs.mkdirSync(out, {recursive: true});
const b = await chromium.launch();
for (const m of misure.split(',')) {
  const [w, h] = m.split('x').map(Number);
  const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: ridotto ? 'reduce' : 'no-preference', javaScriptEnabled: !senzaJs});
  const errori = []; p.on('pageerror', e => errori.push(String(e)));
  await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(ridotto ? 800 : senzaJs ? 3500 : attesa);
  const f = `${out}/${pre}${ridotto ? '-ridotto' : ''}${senzaJs ? '-senzajs' : ''}-${w}x${h}.png`;
  await p.screenshot({path: f});
  const sotto = await p.evaluate(() => { const q = s => { const e = [...document.querySelectorAll(s)].find(x => x.getClientRects().length); return e ? Math.round(e.getBoundingClientRect().bottom) : null; }; return {comandi: q('#comandi-apertura .scarica'), stato: q('.apertura .stato'), didascalia: q('.didascalia'), largo: document.documentElement.scrollWidth}; });
  console.log(f, JSON.stringify(sotto), errori.length ? 'ERRORI ' + errori.join('|') : '');
  await p.close();
}
await b.close();
