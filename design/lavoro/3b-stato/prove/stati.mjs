// Foto di ciò che si vede a un punto della pagina: porta in vista un elemento (al centro o in cima), aspetta, fotografa lo schermo.
// Uso: node stati.mjs <indirizzo> <cartella> <misura> <nome>=<selettore>[@centro|@cima|@clic][+ms] …
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, out, misura, ...voci] = process.argv.slice(2);
const [w, h] = misura.split('x').map(Number);
const ridotto = process.env.RIDOTTO === '1', senzaJs = process.env.SENZAJS === '1';
const b = await chromium.launch();
const p = await b.newPage({viewport: {width: w, height: h}, reducedMotion: ridotto ? 'reduce' : 'no-preference', javaScriptEnabled: !senzaJs});
const errori = []; p.on('pageerror', e => errori.push(String(e)));
await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(1200);
for (const v of voci) {
  const i = v.indexOf('='), nome = v.slice(0, i), resto = v.slice(i + 1);
  const m = resto.match(/^(.*?)(?:@(centro|cima|clic|fine))?(?:\+(\d+))?$/);
  const [, sel, modo = 'centro', ms = '1500'] = m;
  if (sel === 'alto') await p.evaluate(() => scrollTo(0, 0));
  else if (modo === 'clic') { await p.click(sel); }
  else await p.evaluate(([s, modo]) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const y = modo === 'cima' ? scrollY + r.top - 90 : modo === 'fine' ? scrollY + r.bottom - innerHeight + 20 : scrollY + r.top + r.height / 2 - innerHeight / 2; scrollTo({top: y, behavior: 'instant'}); }, [sel, modo]);
  await p.waitForTimeout(+ms);
  await p.screenshot({path: `${out}/${nome}-${w}x${h}.png`});
  console.log(`${out}/${nome}-${w}x${h}.png`);
}
if (errori.length) console.log('ERRORI', errori.join(' | '));
await b.close();
