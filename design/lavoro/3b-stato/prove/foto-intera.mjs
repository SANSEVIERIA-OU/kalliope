// Foto della pagina intera dopo averla scorsa tutta (così ogni tratto è entrato), alle misure date.
// Uso: node foto-intera.mjs <indirizzo> <uscita-senza-estensione> [1440x900,390x844] [--ridotto]
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, out, misure = '1440x900,390x844', ...resto] = process.argv.slice(2);
const ridotto = resto.includes('--ridotto'), senzaJs = resto.includes('--senza-js');
const b = await chromium.launch();
for (const m of misure.split(',')) {
  const [w, h] = m.split('x').map(Number);
  const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: ridotto ? 'reduce' : 'no-preference', javaScriptEnabled: !senzaJs});
  const errori = []; p.on('pageerror', e => errori.push(String(e))); p.on('console', c => { if (c.type() === 'error') errori.push(c.text()); });
  await p.goto(url, {waitUntil: 'networkidle'});
  await p.waitForTimeout(1500);
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < alto; y += Math.round(h * 0.6)) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(450); }
  await p.waitForTimeout(2500);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
  await p.screenshot({path: `${out}-${w}x${h}.png`, fullPage: true});
  console.log(`${out}-${w}x${h}.png`, alto, errori.length ? 'ERRORI: ' + errori.join(' | ') : 'nessun errore');
  await p.close();
}
await b.close();
