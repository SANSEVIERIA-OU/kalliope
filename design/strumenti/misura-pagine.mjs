/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Peso e dipendenze di ogni pagina in Chromium senza finestra: richieste, byte trasferiti (corpo non compresso dei file HTML, CSS, script, immagini; audio escluso),
// domini diversi da quello del sito, elementi video e canvas, animazioni infinite. Scrive JSON su stdout e, con un argomento, su file.
// Uso: node design/strumenti/con-server.mjs DIR node design/strumenti/misura-pagine.mjs [file.json]
import {writeFileSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const base = process.env.ANTEPRIMA, sito = new URL(base).host;
const PAGINE = [['home', ''], ['ascolta', 'ascolta/'], ['stato', 'stato/'], ['installa', 'installa/'], ['riunione', 'riunione/'], ['aiuto', 'aiuto/'], ['non-ancora', 'non-ancora/'], ['404', 'questa-pagina-non-esiste/'], ['sistema', 'sistema/'], ['sistema-ricerca', 'sistema/ricerca/']];
const browser = await chromium.launch({headless: true});
const risultati = [];
for (const [nome, url] of PAGINE) {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
  const p = await ctx.newPage();
  let richieste = 0, byte = 0; const esterni = new Set(); const tipi = {};
  p.on('response', async r => {
    richieste++;
    const u = new URL(r.url());
    if (u.host !== sito) esterni.add(u.host);
    const t = r.headers()['content-type'] || '';
    if (/audio/.test(t)) return;
    try { const b = await r.body(); byte += b.length; tipi[t.split(';')[0]] = (tipi[t.split(';')[0]] || 0) + b.length; } catch {}
  });
  await p.goto(new URL(url, base).href, {waitUntil: 'networkidle'}).catch(() => {});
  await p.waitForTimeout(500);
  const dom = await p.evaluate(() => ({video: document.querySelectorAll('video').length, canvas: document.querySelectorAll('canvas').length,
    infinite: document.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().iterations === Infinity).length,
    audioInRiproduzione: [...document.querySelectorAll('audio')].filter(a => !a.paused).length,
    iframe: document.querySelectorAll('iframe').length, cookie: document.cookie, storage: localStorage.length + sessionStorage.length}));
  risultati.push({pagina: nome, richieste, byte, esterni: esterni.size, domini_esterni: [...esterni], tipi, ...dom});
  await ctx.close();
}
await browser.close();
const json = JSON.stringify(risultati, null, 1);
if (process.argv[2]) writeFileSync(process.argv[2], json);
for (const r of risultati) console.log(`${r.pagina.padEnd(16)} ${String(r.richieste).padStart(3)} richieste  ${String(r.byte).padStart(7)} byte  esterni ${r.esterni}  video ${r.video} canvas ${r.canvas} iframe ${r.iframe} animazioni infinite ${r.infinite}  audio attivo ${r.audioInRiproduzione}  cookie «${r.cookie}»  storage ${r.storage}`);
