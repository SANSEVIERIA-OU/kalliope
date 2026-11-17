// Foto del primo schermo e della pagina intera, con errori e scorrimento di lato.
// Uso: node foto.mjs <base> <uscita> <pagine: nome=percorso;...> <misure 1440x900,390x844> [motore] [attesa ms]
import {mkdirSync, writeFileSync} from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT);
const [base, uscita, pagineArg, misureArg, motore = 'chromium', attesaArg = '4500'] = process.argv.slice(2);
mkdirSync(uscita, {recursive: true});
const pagine = pagineArg.split(';').map(x => x.split('='));
const misure = misureArg.split(',').map(x => x.split('x').map(Number));
const b = await pw[motore].launch({headless: true});
const esiti = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
for (const [nome, percorso] of pagine) for (const [w, h] of misure) {
  const tel = w < 900;
  const ctx = await b.newContext({viewport: {width: w, height: h}, deviceScaleFactor: 1, locale: 'it-IT',
    ...(tel && motore === 'chromium' ? {isMobile: true, hasTouch: true} : tel && motore === 'webkit' ? {hasTouch: true} : {})});
  const p = await ctx.newPage(); const errori = [];
  p.on('pageerror', e => errori.push('pageerror ' + String(e).split('\n')[0]));
  p.on('console', m => { if (m.type() === 'error') errori.push('console ' + m.text().slice(0, 200)); });
  p.on('requestfailed', r => errori.push('richiesta fallita ' + r.url()));
  p.on('response', r => { if (r.status() >= 400) errori.push(`${r.status()} ${r.url()}`); });
  await p.goto(base + percorso, {waitUntil: 'load'});
  await sleep(+attesaArg);
  const f = `${uscita}/${nome}-${w}x${h}`;
  await p.screenshot({path: `${f}-primo.png`});
  // scorre tutta la pagina a passi, poi torna in cima e fotografa intera
  await p.evaluate(async () => { const s = ms => new Promise(r => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await s(250); }
    scrollTo(0, document.documentElement.scrollHeight); await s(600); });
  const misura = await p.evaluate(() => ({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
    bw: document.body.scrollWidth, alt: document.documentElement.scrollHeight, lang: document.documentElement.lang, dir: document.documentElement.dir,
    fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight).filter((x, i, a) => a.indexOf(x) === i)}));
  await p.screenshot({path: `${f}-intera.png`, fullPage: true});
  esiti.push({nome, w, h, ...misura, lato: misura.sw > misura.cw, errori});
  await ctx.close();
}
await b.close();
writeFileSync(`${uscita}/esiti.json`, JSON.stringify(esiti, null, 1));
for (const e of esiti) console.log(`${e.nome} ${e.w}x${e.h} lang=${e.lang} dir=${e.dir} alt=${e.alt} ${e.lato ? 'SCORRE DI LATO ' + e.sw + '>' + e.cw : 'ok'} errori=${e.errori.length} ${e.errori.slice(0,3).join(' | ')} caratteri=${e.fonts.join(', ')}`);
