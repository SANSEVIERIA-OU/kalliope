/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Salva meta (anteprima del collegamento), lingua, punti di riferimento, titoli e immagini senza alt dei tre siti (worker visita-3, a posto libero).
import fs from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT); const chromium = pw.chromium || pw.default.chromium;
const browser = await chromium.launch({headless: true, channel: 'chromium', args: ['--hide-scrollbars']});
const siti = [['R20', 'https://www.ottografie.nl/', 14000], ['R21', 'https://www.lonelyplanet.com/articles/venice-overtourism', 4000], ['R22', 'https://searchingforbirds.visualcinnamon.com/', 4000]];
for (const [id, url, att] of siti) {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'}); const page = await ctx.newPage();
  await page.goto(url, {waitUntil: 'load', timeout: 60000}).catch(() => {}); await new Promise(r => setTimeout(r, att));
  const d = await page.evaluate(() => {
    const q = s => [...document.querySelectorAll(s)];
    const meta = q('meta').map(m => [m.getAttribute('name') || m.getAttribute('property'), m.getAttribute('content')]).filter(x => x[0] && /^(og:|twitter:|description|viewport|author|robots|theme-color)/.test(x[0]));
    const lm = {}; q('header,nav,main,footer,aside,article,section,[role=banner],[role=navigation],[role=main],[role=contentinfo]').forEach(e => { const k = e.tagName.toLowerCase() + (e.getAttribute('role') ? `[${e.getAttribute('role')}]` : ''); lm[k] = (lm[k] || 0) + 1; });
    return {titolo: document.title, lang: document.documentElement.lang, meta, punti_di_riferimento: lm, titoli: q('h1,h2,h3').map(h => h.tagName + ':' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 50)).slice(0, 40), immagini: q('img').length, immagini_senza_attributo_alt: q('img').filter(i => !i.hasAttribute('alt')).length, immagini_alt_vuoto: q('img').filter(i => i.getAttribute('alt') === '').length, svg: q('svg').length, svg_con_titolo_o_aria: q('svg').filter(s => s.querySelector('title') || s.getAttribute('aria-label') || s.getAttribute('role')).length, canvas: q('canvas').length, video: q('video').length, audio: q('audio').length, link_salta: q('a').filter(a => /skip|salta/i.test(a.textContent)).map(a => [a.textContent.trim(), a.getAttribute('href')]), campi: q('input,textarea,select').map(i => [i.type, i.getAttribute('aria-label'), i.getAttribute('placeholder')]), pulsanti: q('button').length, prefers_reduced_nei_fogli: (() => { let n = 0; for (const ss of document.styleSheets) { try { for (const r of ss.cssRules) if (r.media && /reduced-motion/.test(r.media.mediaText)) n++; } catch {} } return n; })()};
  }).catch(e => ({errore: String(e)}));
  fs.mkdirSync(`/workspace/kalliope/design/ricerca/prove/${id}/misure`, {recursive: true});
  fs.writeFileSync(`/workspace/kalliope/design/ricerca/prove/${id}/misure/meta-e-albero.json`, JSON.stringify({url, rilevato: new Date().toISOString(), ...d}, null, 1));
  console.log(id, d.titolo, JSON.stringify(d.punti_di_riferimento), 'img', d.immagini, 'senza alt', d.immagini_senza_attributo_alt, 'alt vuoto', d.immagini_alt_vuoto, 'ridotto@media', d.prefers_reduced_nei_fogli);
  await ctx.close();
}
await browser.close();
