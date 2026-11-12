/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Foto delle pagine del sito a più misure e in più stati (solo Chromium senza finestra), per la revisione a occhio.
// Uso: node design/strumenti/con-server.mjs /tmp/kalliope-anteprima/NOME node design/strumenti/foto-pagine.mjs CARTELLA [filtro-pagina] [misure 1440x900,390x844] [stato]
// stati: normale · ridotto · scuro · forzati · senzajs · testo200 · stampa
import {mkdirSync} from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT);
const [cartella, filtro = '', misureArg = '1440x900,390x844', stato = 'normale'] = process.argv.slice(2);
const base = process.env.ANTEPRIMA;
const PAGINE = [['home', ''], ['ascolta', 'ascolta/'], ['stato', 'stato/'], ['installa', 'installa/'], ['riunione', 'riunione/'], ['aiuto', 'aiuto/'], ['non-ancora', 'non-ancora/'], ['404', 'questa-pagina-non-esiste/'], ['sistema', 'sistema/'], ['sistema-ricerca', 'sistema/ricerca/']];
mkdirSync(cartella, {recursive: true});
const browser = await chromium.launch({headless: true});
for (const m of misureArg.split(',')) {
  const [w, h] = m.split('x').map(Number);
  const opz = {viewport: {width: w, height: h}, locale: 'it-IT', hasTouch: w < 900};
  if (stato === 'ridotto') opz.reducedMotion = 'reduce';
  if (stato === 'scuro') opz.colorScheme = 'dark';
  if (stato === 'forzati') opz.forcedColors = 'active';
  if (stato === 'senzajs') opz.javaScriptEnabled = false;
  const ctx = await browser.newContext(opz);
  for (const [nome, url] of PAGINE) {
    if (filtro && !nome.includes(filtro)) continue;
    const p = await ctx.newPage();
    await p.goto(new URL(url, base).href, {waitUntil: 'networkidle'}).catch(() => {});
    await p.waitForTimeout(400);
    if (stato === 'testo200') { await p.addStyleTag({content: 'html{font-size:200% !important}'}); await p.waitForTimeout(200); }
    if (stato === 'stampa') await p.emulateMedia({media: 'print'});
    const f = `${cartella}/${nome}-${stato}-${w}x${h}.png`;
    const segmenti = Number(process.env.SEGMENTI || 0);
    if (segmenti) {
      // schermata per schermata, a grandezza utile: le prime N (SEGMENTI) dall'alto, ciascuna alta quanto la finestra
      const alto = await p.evaluate(() => document.documentElement.scrollHeight);
      const da = Number(process.env.DA_SEGMENTO || 0);
      for (let i = da; i < Math.min(da + segmenti, Math.ceil(alto / h)); i++) {
        const g = f.replace('.png', `-s${String(i + 1).padStart(2, '0')}.png`);
        await p.screenshot({path: g, fullPage: true, clip: {x: 0, y: i * h, width: w, height: Math.min(h, alto - i * h)}});
        console.log(g);
      }
    } else { await p.screenshot({path: f, fullPage: true}); console.log(f); }
    await p.close();
  }
  await ctx.close();
}
await browser.close();
