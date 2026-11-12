/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Primo schermo, computer 1440x900 e telefono 390x844: comandi visibili, bersagli (dimensione e distanza), testo corrente
// (corpo, interlinea, caratteri per riga misurati sulle righe reali). Un solo browser, nessun posto passo.
// Uso: PLAYWRIGHT=... node visita1-primo-schermo.mjs <ID> <url> <attesa-ms> <file-uscita.json>
import fs from 'node:fs';
const [ID, url, att, out] = process.argv.slice(2);
const {chromium} = await import(process.env.PLAYWRIGHT);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const b = await chromium.launch({channel: 'chromium', headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader']});
const ris = {id: ID, url, data: new Date().toISOString(), viste: {}};
for (const [nome, opz] of [['computer', {viewport: {width: 1440, height: 900}}], ['telefono', {viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, userAgent: UA, deviceScaleFactor: 1}]]) {
  const c = await b.newContext({...opz, locale: 'it-IT'});
  const p = await c.newPage();
  await p.goto(url, {waitUntil: 'load', timeout: 60000}).catch(() => {});
  await sleep(Number(att));
  ris.viste[nome] = await p.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && parseFloat(s.opacity) > 0.05 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
    const tutti = [...document.querySelectorAll('a[href],button,[role=button],[role=tab],input,select,textarea,summary')].filter(vis);
    // gli elementi con cursor:pointer senza ruolo (div cliccabili) si contano a parte
    const ptr = [...document.querySelectorAll('*')].filter(e => vis(e) && getComputedStyle(e).cursor === 'pointer' && !e.matches('a[href],button,[role=button],[role=tab],input,select,textarea,summary') && !(e.parentElement && getComputedStyle(e.parentElement).cursor === 'pointer'));
    const lista = [...tutti, ...ptr.filter(e => !tutti.some(t => t.contains(e) || e.contains(t)))].filter(e => { const r = e.getBoundingClientRect(); return r.width >= 8 && r.height >= 8; });
    const rect = lista.map(e => { const r = e.getBoundingClientRect(); return {x: r.x, y: r.y, w: r.width, h: r.height}; });
    let dmin = null;
    for (let i = 0; i < rect.length; i++) for (let j = i + 1; j < rect.length; j++) { const a = rect[i], q = rect[j]; const dx = Math.max(0, Math.max(a.x, q.x) - Math.min(a.x + a.w, q.x + q.w)), dy = Math.max(0, Math.max(a.y, q.y) - Math.min(a.y + a.h, q.y + q.h)); const d = Math.hypot(dx, dy); if (dmin === null || d < dmin) dmin = d; }
    const conta = {link: tutti.filter(e => e.matches('a[href]')).length, pulsanti: tutti.filter(e => e.matches('button,[role=button],[role=tab],summary')).length + ptr.length, campi: tutti.filter(e => e.matches('input,select,textarea')).length};
    // testo corrente: il paragrafo piu' lungo fra gli elementi foglia con testo
    const inBanner = e => !!e.closest('[id*=ookie],[class*=ookie],[id*=Cybot],[role=dialog],[class*=consent]');
    const foglie = [...document.querySelectorAll('p,div,span,li,h2')].filter(e => e.children.length === 0 && vis(e) && !inBanner(e) && parseFloat(getComputedStyle(e).fontSize) <= 24 && (e.innerText || '').trim().split(/\s+/).length >= 8);
    foglie.sort((a, b) => b.innerText.length - a.innerText.length);
    let testo = null;
    const e = foglie[0] || [...document.querySelectorAll('p')].find(x => x.getBoundingClientRect().width > 0 && x.innerText.length > 30);
    if (e) {
      const s = getComputedStyle(e), tn = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n, righe = new Map();
      while ((n = tn.nextNode())) { const t = n.textContent; let i = 0; for (const m of t.matchAll(/\S+/g)) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const r = rg.getClientRects()[0]; if (!r) continue; const k = Math.round(r.top / 4); righe.set(k, (righe.get(k) || 0) + m[0].length + 1); } }
      const lh = parseFloat(s.lineHeight), fs = parseFloat(s.fontSize);
      testo = {esempio: e.innerText.trim().slice(0, 40), corpo_px: fs, interlinea: isNaN(lh) ? 'normal' : +(lh / fs).toFixed(2), caratteri_per_riga_max: Math.max(...righe.values()) - 1, colore: s.color, famiglia: s.fontFamily.split(',')[0]};
    }
    return {comandi_primo_schermo: conta, bersagli: {n: rect.length, larghezza_min_px: Math.round(Math.min(...rect.map(r => r.w))), altezza_min_px: Math.round(Math.min(...rect.map(r => r.h))), distanza_min_px: dmin === null ? null : Math.round(dmin), nomi_piu_piccoli: lista.map((e, i) => ({t: (e.innerText || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 24), w: Math.round(rect[i].w), h: Math.round(rect[i].h)})).sort((a, b) => a.h - b.h).slice(0, 4)}, testo_corrente: testo, inner: [innerWidth, innerHeight], sw: document.documentElement.scrollWidth};
  });
  await c.close();
}
await b.close();
fs.writeFileSync(out, JSON.stringify(ris, null, 1));
console.log(ID, JSON.stringify(ris.viste.computer.comandi_primo_schermo), JSON.stringify(ris.viste.computer.bersagli), JSON.stringify(ris.viste.computer.testo_corrente), '|', JSON.stringify(ris.viste.telefono.comandi_primo_schermo), JSON.stringify(ris.viste.telefono.bersagli), JSON.stringify(ris.viste.telefono.testo_corrente));
