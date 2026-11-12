/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Misure mirate (worker visita-3), a posto libero: testo corrente di R22, bersaglio Share di R21. Chromium, 1440×900 e 390×844.
import fs from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT); const chromium = pw.chromium || pw.default.chromium;
const browser = await chromium.launch({headless: true, channel: 'chromium', args: ['--hide-scrollbars', '--force-device-scale-factor=1']});
const risultati = {};
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
async function testo(id, url, sel, w, h, mobile) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, locale: 'it-IT', ...(mobile ? {userAgent: UA, isMobile: true, hasTouch: true} : {})});
  const page = await ctx.newPage(); await page.goto(url, {waitUntil: 'load', timeout: 60000}).catch(() => {}); await new Promise(r => setTimeout(r, 3500));
  const r = await page.evaluate(sel => {
    const ps = [...document.querySelectorAll(sel)].filter(p => { const r = p.getBoundingClientRect(); return r.width > 100 && p.textContent.trim().length > 150; });
    const out = ps.slice(0, 40).map(p => {
      const c = getComputedStyle(p), r = p.getBoundingClientRect(), lh = parseFloat(c.lineHeight);
      const righe = Math.max(1, Math.round(r.height / lh)); const t = p.textContent.trim();
      // caratteri nella riga più lunga: misura vera con un Range per riga
      const range = document.createRange(); range.selectNodeContents(p);
      const rects = [...range.getClientRects()].filter(x => x.width > 2);
      return {corpo_px: parseFloat(c.fontSize), interlinea_px: lh, famiglia: c.fontFamily.slice(0, 40), larghezza_px: Math.round(r.width), righe, caratteri: t.length, caratteri_per_riga_media: Math.round(t.length / righe)};
    });
    const med = out.map(o => o.caratteri_per_riga_media).sort((a, b) => a - b);
    return {n: out.length, mediana_caratteri_per_riga: med[Math.floor(med.length / 2)], max_caratteri_per_riga: med[med.length - 1], esempio: out[0], larghezze: [...new Set(out.map(o => o.larghezza_px))].slice(0, 5)};
  }, sel).catch(e => ({errore: String(e)}));
  risultati[`${id} ${w}x${h}`] = r; await ctx.close();
}
await testo('R22', 'https://searchingforbirds.visualcinnamon.com/', 'article p, main p', 1440, 900, false);
await testo('R22', 'https://searchingforbirds.visualcinnamon.com/', 'article p, main p', 390, 844, true);
await testo('R21', 'https://www.lonelyplanet.com/articles/venice-overtourism', 'main p', 1440, 900, false);
await testo('R21', 'https://www.lonelyplanet.com/articles/venice-overtourism', 'main p', 390, 844, true);
// R21: bersaglio Share
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'}); const page = await ctx.newPage();
  await page.goto('https://www.lonelyplanet.com/articles/venice-overtourism', {waitUntil: 'load'}).catch(() => {}); await new Promise(r => setTimeout(r, 2500));
  risultati['R21 share'] = await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => /share/i.test(b.getAttribute('aria-label') || b.textContent)); if (!b) return null; const r = b.getBoundingClientRect(); const p = b.parentElement.getBoundingClientRect(); const c = getComputedStyle(b); return {pulsante: [Math.round(r.width), Math.round(r.height)], contenitore: [Math.round(p.width), Math.round(p.height)], padding: c.padding, aria: b.getAttribute('aria-label'), expanded: b.getAttribute('aria-expanded')}; }).catch(e => String(e));
  await ctx.close();
}
await browser.close();
fs.writeFileSync(process.argv[2], JSON.stringify(risultati, null, 1)); console.log(JSON.stringify(risultati, null, 1));
