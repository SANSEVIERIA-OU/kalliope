/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
JSON.stringify((() => {
  // Lettura strutturale della pagina corrente per le voci V02, V13, V15-V21 del vocabolario (worker visita-4).
  const vis = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const inVista = e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const nome = e => (e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') && [...e.getAttribute('aria-labelledby').split(' ')].map(i => (document.getElementById(i) || {}).innerText || '').join(' ') || e.innerText || e.value || e.getAttribute('title') || e.alt || e.querySelector('img[alt]')?.alt || '').trim().replace(/\s+/g, ' ');
  const sel = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab],[role=menuitem],[tabindex]:not([tabindex="-1"])';
  const tutti = [...document.querySelectorAll(sel)].filter(vis);
  const primoSchermo = tutti.filter(inVista);
  const conta = l => ({link: l.filter(e => e.tagName === 'A' || e.getAttribute('role') === 'link').length, pulsanti: l.filter(e => e.tagName === 'BUTTON' || e.getAttribute('role') === 'button' || e.tagName === 'SUMMARY' || (e.tagName === 'INPUT' && /button|submit/.test(e.type))).length, campi: l.filter(e => /INPUT|SELECT|TEXTAREA/.test(e.tagName) && !/button|submit/.test(e.type || '')).length});
  const dims = l => { const r = l.map(e => e.getBoundingClientRect()); return {n: r.length, larghezza_min_px: Math.round(Math.min(...r.map(x => x.width))), altezza_min_px: Math.round(Math.min(...r.map(x => x.height)))}; };
  const senzaNome = tutti.filter(e => !nome(e)).map(e => e.tagName.toLowerCase() + (e.getAttribute('href') ? '[' + e.getAttribute('href').slice(0, 40) + ']' : ''));
  const imgs = [...document.images];
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis);
  const meta = {};
  for (const m of document.querySelectorAll('meta[property],meta[name]')) { const k = m.getAttribute('property') || m.getAttribute('name'); if (/^(og:|twitter:|description|viewport|theme-color|color-scheme)/.test(k)) meta[k] = m.content.slice(0, 110); }
  const regole = {scuro: 0, ridotto: 0, forzati: 0, stampa: 0, nonLeggibili: 0};
  const visita = rs => { for (const r of rs) { try { if (r.media) { const t = r.media.mediaText; if (/prefers-color-scheme/.test(t)) regole.scuro++; if (/prefers-reduced-motion/.test(t)) regole.ridotto++; if (/forced-colors/.test(t)) regole.forzati++; if (/print/.test(t)) regole.stampa++; } if (r.cssRules) visita(r.cssRules); } catch (e) {} } };
  for (const s of document.styleSheets) { try { visita(s.cssRules); } catch (e) { regole.nonLeggibili++; } }
  const paragrafi = [...document.querySelectorAll('p,li')].filter(e => vis(e) && e.innerText.trim().length > 60).sort((a, b) => b.innerText.length - a.innerText.length);
  const p0 = paragrafi[0], cs0 = p0 && getComputedStyle(p0);
  const lh = cs0 && (parseFloat(cs0.lineHeight) || parseFloat(cs0.fontSize) * 1.2);
  const righe = p0 && Math.max(1, Math.round(p0.getBoundingClientRect().height / lh));
  const bodyP = [...document.querySelectorAll('p')].filter(e => vis(e) && e.innerText.trim().length > 40)[0];
  const cb = bodyP && getComputedStyle(bodyP);
  const med = [...document.querySelectorAll('video,audio')].map(v => ({tag: v.tagName.toLowerCase(), autoplay: v.autoplay, controls: v.controls, muted: v.muted, loop: v.loop, tracce: v.textTracks.length, src: (v.currentSrc || v.src || '').slice(0, 90)}));
  const ris = performance.getEntriesByType('resource');
  const dom = {}; let kb = 0;
  for (const r of ris) { let h = ''; try { h = new URL(r.name).hostname; } catch (e) {} dom[h] = (dom[h] || 0) + 1; kb += (r.transferSize || 0); }
  const nav = performance.getEntriesByType('navigation')[0];
  return {
    url: location.href, lang: document.documentElement.lang, title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href, meta,
    scroll: [document.documentElement.scrollWidth, document.documentElement.scrollHeight, innerWidth, innerHeight],
    primoSchermo: conta(primoSchermo), primoSchermoDim: primoSchermo.length ? dims(primoSchermo) : null,
    comandiTotali: conta(tutti), comandiDim: tutti.length ? dims(tutti) : null, senzaNome: senzaNome.slice(0, 12), nSenzaNome: senzaNome.length,
    titoli: heads.map(h => h.tagName + ' ' + h.innerText.trim().replace(/\s+/g, ' ').slice(0, 48)).slice(0, 30), nTitoli: heads.length, nH1: document.querySelectorAll('h1').length,
    punti: ['header,[role=banner]', 'nav,[role=navigation]', 'main,[role=main]', 'footer,[role=contentinfo]', 'aside,[role=complementary]', '[role=search],search'].map(s => document.querySelectorAll(s).length),
    immagini: {tot: imgs.length, senzaAlt: imgs.filter(i => !i.hasAttribute('alt')).length, altVuoto: imgs.filter(i => i.getAttribute('alt') === '').length, svg: document.querySelectorAll('svg').length},
    skip: [...document.querySelectorAll('a')].find(a => /skip|salta|vai al contenuto|jump to/i.test(a.innerText + a.getAttribute('aria-label')))?.innerText || null,
    testoCorrente: p0 ? {corpo_px: parseFloat(cb ? cb.fontSize : cs0.fontSize), interlinea: +(parseFloat(cb ? cb.lineHeight : cs0.lineHeight) / parseFloat(cb ? cb.fontSize : cs0.fontSize)).toFixed(2), caratteri_per_riga_max_stima: Math.round(p0.innerText.length / righe), larghezza_p: Math.round(p0.getBoundingClientRect().width), carattere: (cb || cs0).fontFamily.split(',')[0], colore: (cb || cs0).color, sfondoBody: getComputedStyle(document.body).backgroundColor} : null,
    mediaCss: regole, media: med, canvas: document.querySelectorAll('canvas').length, iframe: [...document.querySelectorAll('iframe')].map(f => f.src.slice(0, 80)),
    fontCaricati: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight).slice(0, 10),
    rete: {richieste: ris.length + 1, domini: Object.entries(dom).sort((a, b) => b[1] - a[1]).slice(0, 10), kb_trasferiti: Math.round(kb / 1024), dcl_ms: nav && Math.round(nav.domContentLoadedEventEnd), load_ms: nav && Math.round(nav.loadEventEnd)},
    jsKb: Math.round(ris.filter(r => r.initiatorType === 'script').reduce((a, r) => a + (r.encodedBodySize || 0), 0) / 1024),
  };
})())
