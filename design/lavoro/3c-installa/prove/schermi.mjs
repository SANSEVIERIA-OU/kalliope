// Foto della finestra a più altezze di scorrimento, dopo aver lasciato entrare ogni tratto; e la pagina intera.
// Uso: node schermi.mjs <indirizzo> <cartella-uscita> [1440x900,390x844] [--ridotto] [--senza-js] [--passo=0.85] [--intera]
const {chromium} = await import(process.env.PLAYWRIGHT);
import fs from 'node:fs';
const [url, out, misure = '1440x900,390x844', ...resto] = process.argv.slice(2);
const ridotto = resto.includes('--ridotto'), senzaJs = resto.includes('--senza-js'), intera = resto.includes('--intera');
const passo = +(resto.find(a => a.startsWith('--passo='))?.split('=')[1] ?? 0.85);
fs.mkdirSync(out, {recursive: true});
const b = await chromium.launch();
for (const m of misure.split(',')) {
  const [w, h] = m.split('x').map(Number);
  const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: ridotto ? 'reduce' : 'no-preference', javaScriptEnabled: !senzaJs});
  const errori = []; p.on('pageerror', e => errori.push(String(e))); p.on('console', c => { if (c.type() === 'error') errori.push(c.text()); });
  await p.goto(url, {waitUntil: 'networkidle'});
  await p.waitForTimeout(ridotto || senzaJs ? 600 : 6500);
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; ; y += Math.round(h * passo)) {
    const yy = Math.min(y, alto - h);
    await p.evaluate(y => scrollTo(0, y), yy); await p.waitForTimeout(ridotto || senzaJs ? 400 : 3200);
    await p.screenshot({path: `${out}/${w}x${h}-${String(i++).padStart(2, '0')}-y${yy}.png`});
    if (yy >= alto - h) break;
  }
  if (intera) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800); await p.screenshot({path: `${out}/${w}x${h}-intera.png`, fullPage: true}); }
  const largo = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(`${w}x${h}`, 'alta', alto, 'larga', largo, errori.length ? 'ERRORI: ' + errori.join(' | ') : 'nessun errore');
  await p.close();
}
await b.close();
