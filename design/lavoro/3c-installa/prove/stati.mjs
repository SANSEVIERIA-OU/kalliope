// Foto degli stati della pagina (gli appunti si simulano): copia fatta, copia non riuscita, archivio scelto, frase premuta, indirizzo copiato.
// Uso: node stati.mjs <url> <cartella> <misure>
const {chromium} = await import(process.env.PLAYWRIGHT);
import fs from 'node:fs';
const [url, out, misure = '1440x900,390x844'] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const b = await chromium.launch();
const vai = async (p, sel, blocco = 'start') => { await p.evaluate(([s, bl]) => document.querySelector(s).scrollIntoView({block: bl}), [sel, blocco]); await p.waitForTimeout(3500); };
const stati = {
  'copia-fatta': async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); }); await vai(p, '#passo-controlla', 'center'); await p.click('#passo-controlla .copia'); await p.waitForTimeout(300); },
  'copia-non-riuscita': async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('no')); }); await vai(p, '#passo-controlla', 'center'); await p.click('#passo-controlla .copia'); await p.waitForTimeout(300); },
  'archivio': async p => { await p.click('label[for=sistema-tar]'); await p.waitForTimeout(1800); },
  'archivio-installa': async p => { await p.click('label[for=sistema-tar]'); await vai(p, '#installa'); await p.waitForTimeout(3000); },
  'frase-microfono': async p => { await vai(p, '#apri'); await p.waitForTimeout(4000); await p.click('.frase-bottone[data-stato=microfono]'); await p.waitForTimeout(500); },
  'indirizzo-copiato': async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); }); await vai(p, '#inoltra', 'center'); await p.click('.copia-indirizzo'); await p.waitForTimeout(400); },
};
for (const m of misure.split(',')) {
  const [w, h] = m.split('x').map(Number);
  for (const [nome, fa] of Object.entries(stati)) {
    const p = await b.newPage({viewport: {width: w, height: h}});
    const errori = []; p.on('pageerror', e => errori.push(String(e)));
    await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(6500);
    await fa(p);
    await p.screenshot({path: `${out}/${nome}-${w}x${h}.png`});
    console.log(nome, m, errori.length ? 'ERRORI ' + errori.join('|') : 'ok');
    await p.close();
  }
}
await b.close();
