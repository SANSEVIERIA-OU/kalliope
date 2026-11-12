#!/usr/bin/env node
// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
// Worker visita-3. Prove che passo.mjs non ha: senza JavaScript, rete lenta, stampa, richieste e peso, telefono 390×844.
// Si lancia SOLO quando il worker non tiene un posto di passo.mjs (un browser per worker: browser.md).
//   PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs \
//   env -u DISPLAY -u WAYLAND_DISPLAY node visita-3-script.mjs <ID> <url> <cartella-uscita> <attesa-arrivo-ms> <fasi,separate,da,virgola>
// fasi: nojs · lenta · stampa · richieste · telefono · bersagli
// Solo Chromium (rete lenta via CDP: non si può in Firefox e WebKit). Ogni fase scrive file con il nome della fase.
import fs from 'node:fs';
import path from 'node:path';

const [ID, URL_, OUT, ATT = '4000', FASI = 'nojs,lenta,stampa,richieste,telefono,bersagli'] = process.argv.slice(2);
if (!ID || !URL_ || !OUT) { console.error('uso: <ID> <url> <cartella> [attesa-ms] [fasi]'); process.exit(2); }
const attesa = Number(ATT);
fs.mkdirSync(OUT, {recursive: true});
const pw = await import(process.env.PLAYWRIGHT);
const chromium = pw.chromium || pw.default.chromium;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const salva = (nome, dati) => fs.writeFileSync(path.join(OUT, nome), typeof dati === 'string' ? dati : JSON.stringify(dati, null, 1));
const host = u => { try { return new URL(u).hostname; } catch { return ''; } };
const radice = h => h.split('.').slice(-2).join('.');
const sito = radice(host(URL_));
const ARGS = ['--hide-scrollbars', '--force-device-scale-factor=1', '--disable-search-engine-choice-screen', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const fasi = FASI.split(',');
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ID, ...a);

const browser = await chromium.launch({headless: true, channel: 'chromium', args: ARGS});
const versione = browser.version();
log('Chromium', versione);

const iniettaOsservatore = () => {
  window.__v3 = {firstText: null, fcp: null, lcp: null};
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__v3.fcp = e.startTime; }).observe({type: 'paint', buffered: true}); } catch {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__v3.lcp = e.startTime; }).observe({type: 'largest-contentful-paint', buffered: true}); } catch {}
  const t = setInterval(() => { if (document.body && document.body.innerText.trim().length > 40 && window.__v3.firstText == null) { window.__v3.firstText = performance.now(); clearInterval(t); } }, 50);
};

// ---------- misure dei bersagli e del testo (V16, V17) ----------
const misuraBersagli = () => {
  const vis = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && parseFloat(c.opacity) > 0.05; };
  const els = [...document.querySelectorAll('a[href],button,input,select,textarea,[role=button],summary')].filter(vis);
  const rs = els.map(e => { const r = e.getBoundingClientRect(); return {n: (e.getAttribute('aria-label') || e.textContent || e.placeholder || e.tagName).trim().slice(0, 24), t: e.tagName.toLowerCase(), w: Math.round(r.width), h: Math.round(r.height), x: r.x, y: r.y, tab: e.tabIndex}; });
  let gap = Infinity;
  for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
    const a = rs[i], b = rs[j];
    const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w)), dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h));
    if (dx === 0 && dy === 0) continue; // sovrapposti o annidati: non è una distanza
    gap = Math.min(gap, Math.hypot(dx, dy));
  }
  const minW = rs.length ? Math.min(...rs.map(r => r.w)) : null, minH = rs.length ? Math.min(...rs.map(r => r.h)) : null;
  const piccoli = rs.filter(r => r.w < 44 || r.h < 44).map(r => `${r.t}:${r.n}:${r.w}x${r.h}${r.tab < 0 ? ':tabindex-1' : ''}`).slice(0, 25);
  // testo corrente: il paragrafo più lungo in vista o il più lungo della pagina
  const ps = [...document.querySelectorAll('p,li,div,span,a')].filter(e => e.children.length === 0 && e.textContent.trim().length > 60);
  ps.sort((a, b) => b.textContent.length - a.textContent.length);
  const p = ps[0]; let testo = null;
  if (p) {
    const c = getComputedStyle(p), r = p.getBoundingClientRect(), lh = parseFloat(c.lineHeight) || parseFloat(c.fontSize) * 1.2;
    const righe = Math.max(1, Math.round(r.height / lh));
    testo = {tag: p.tagName.toLowerCase(), corpo_px: parseFloat(c.fontSize), interlinea: c.lineHeight, interlinea_rapporto: +(lh / parseFloat(c.fontSize)).toFixed(2), caratteri: p.textContent.trim().length, righe, caratteri_per_riga_stima: Math.round(p.textContent.trim().length / righe), larghezza_px: Math.round(r.width), famiglia: c.fontFamily.slice(0, 50)};
  }
  return {viewport: [innerWidth, innerHeight], scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, bersagli_in_vista: rs.length, larghezza_min_px: minW, altezza_min_px: minH, distanza_min_px: Number.isFinite(gap) ? Math.round(gap) : null, sotto_44px: piccoli, testo_corrente: testo};
};

// ---------- fase: senza JavaScript ----------
async function nojs() {
  for (const [w, h, nome] of [[1440, 900, '1440'], [390, 844, '390']]) {
    const ctx = await browser.newContext({javaScriptEnabled: false, viewport: {width: w, height: h}, locale: 'it-IT', ...(w === 390 ? {userAgent: UA_MOBILE, isMobile: true, hasTouch: true} : {})});
    const page = await ctx.newPage();
    const t0 = Date.now(); let stato = null, errore = null;
    try { const r = await page.goto(URL_, {waitUntil: 'load', timeout: 45000}); stato = r?.status(); } catch (e) { errore = String(e).split('\n')[0]; }
    await sleep(2500);
    await page.screenshot({path: path.join(OUT, `nojs-${nome}.png`)}).catch(() => {});
    await page.screenshot({path: path.join(OUT, `nojs-${nome}-pagina.png`), fullPage: true, timeout: 20000}).catch(() => {});
    const dati = await page.evaluate(() => {
      const q = s => [...document.querySelectorAll(s)];
      return {titolo: document.title, testo_caratteri: document.body ? document.body.innerText.trim().length : 0, testo_inizio: document.body ? document.body.innerText.trim().replace(/\s+/g, ' ').slice(0, 400) : '', link: q('a[href]').length, titoli: q('h1,h2,h3').map(h => h.tagName + ':' + h.textContent.trim().slice(0, 40)).slice(0, 14), immagini: q('img').length, noscript: q('noscript').map(n => n.textContent.trim().replace(/\s+/g, ' ').slice(0, 160)), altezza: document.documentElement.scrollHeight};
    }).catch(e => ({errore: String(e)}));
    salva(`nojs-${nome}.json`, {url: URL_, stato_http: stato, errore, durata_ms: Date.now() - t0, javaScript: false, viewport: [w, h], ...dati});
    log('nojs', nome, stato, dati.testo_caratteri, 'caratteri', dati.link, 'link');
    await ctx.close();
  }
}

// ---------- fase: rete lenta (CDP, solo Chromium) ----------
async function lenta() {
  const RETE = {latenza_ms: 150, giu_kbit: 1600, su_kbit: 750, descrizione: 'come «Slow 4G» dei DevTools: 1,6 Mbit/s in giù, 750 kbit/s in su, 150 ms di latenza'};
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'});
  await ctx.addInitScript(iniettaOsservatore);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
  await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: RETE.latenza_ms, downloadThroughput: RETE.giu_kbit * 1024 / 8, uploadThroughput: RETE.su_kbit * 1024 / 8});
  let byte = 0, richieste = 0; cdp.on('Network.loadingFinished', e => { byte += e.encodedDataLength || 0; }); cdp.on('Network.requestWillBeSent', () => { richieste++; });
  const t0 = Date.now(); const foto = [];
  const nav = page.goto(URL_, {waitUntil: 'commit', timeout: 60000}).catch(e => String(e));
  for (const t of [800, 2000, 4000, 8000, 15000, 30000]) {
    const resto = t - (Date.now() - t0); if (resto > 0) await sleep(resto);
    const ms = Date.now() - t0;
    const nome = `lenta-${String(Math.round(t / 100)).padStart(3, '0')}-${Math.round(ms)}ms.png`;
    await page.screenshot({path: path.join(OUT, nome), timeout: 15000}).catch(() => {});
    const s = await page.evaluate(() => ({testo: document.body ? document.body.innerText.trim().length : 0, immagini_complete: [...document.images].filter(i => i.complete && i.naturalWidth > 0).length, immagini: document.images.length, stato: document.readyState})).catch(() => ({}));
    foto.push({richiesto_ms: t, effettivo_ms: ms, file: nome, byte_ricevuti: byte, richieste, ...s});
  }
  await nav;
  const v3 = await page.evaluate(() => window.__v3).catch(() => null);
  const navT = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return n ? {dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd)} : null; }).catch(() => null);
  salva('lenta.json', {url: URL_, rete: RETE, cache: 'disattivata', viewport: [1440, 900], primo_testo_ms: v3?.firstText != null ? Math.round(v3.firstText) : null, fcp_ms: v3?.fcp != null ? Math.round(v3.fcp) : null, lcp_ms: v3?.lcp != null ? Math.round(v3.lcp) : null, navigazione: navT, istanti: foto, nota: 'tempi della pagina con la macchina condivisa da altri worker: sono indicativi'});
  log('lenta primo testo', v3?.firstText && Math.round(v3.firstText), 'ms; fcp', v3?.fcp && Math.round(v3.fcp));
  await ctx.close();
}

// ---------- fase: stampa ----------
async function stampa() {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'});
  const page = await ctx.newPage();
  await page.goto(URL_, {waitUntil: 'load', timeout: 45000}).catch(() => {});
  await sleep(attesa);
  await page.emulateMedia({media: 'print'});
  await sleep(800);
  await page.screenshot({path: path.join(OUT, 'stampa-schermo.png')}).catch(() => {});
  let pagine = null, pdfByte = null;
  try {
    const pdf = await page.pdf({format: 'A4', printBackground: true, timeout: 60000});
    fs.writeFileSync(path.join(OUT, 'stampa.pdf'), pdf); pdfByte = pdf.length;
    const m = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g); pagine = m ? m.length : null;
  } catch (e) { salva('stampa-errore.txt', String(e)); }
  const dati = await page.evaluate(() => {
    const nascosti = [...document.querySelectorAll('nav,header,footer,button,[role=navigation],aside')].filter(e => getComputedStyle(e).display === 'none').length;
    const totaliNav = document.querySelectorAll('nav,header,footer,button,[role=navigation],aside').length;
    const c = getComputedStyle(document.body);
    return {testo_caratteri: document.body.innerText.trim().length, elementi_di_navigazione: totaliNav, nascosti_in_stampa: nascosti, sfondo_corpo: c.backgroundColor, colore_corpo: c.color, altezza: document.documentElement.scrollHeight};
  }).catch(() => ({}));
  // pagine intere in una foto lunga limitata (la stampa a schermo non impagina)
  await page.screenshot({path: path.join(OUT, 'stampa-pagina-intera.png'), fullPage: true, clip: undefined, timeout: 20000}).catch(() => {});
  salva('stampa.json', {url: URL_, media: 'print', formato: 'A4', pagine_pdf: pagine, pdf_byte: pdfByte, ...dati});
  log('stampa pagine', pagine, JSON.stringify(dati));
  await ctx.close();
}

// ---------- fase: richieste e peso al primo arrivo (V18) ----------
async function richieste() {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'});
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
  const reqs = new Map();
  cdp.on('Network.requestWillBeSent', e => reqs.set(e.requestId, {url: e.request.url, tipo: e.type, t: Date.now()}));
  cdp.on('Network.responseReceived', e => { const r = reqs.get(e.requestId); if (r) { r.stato = e.response.status; r.mime = e.response.mimeType; } });
  cdp.on('Network.loadingFinished', e => { const r = reqs.get(e.requestId); if (r) r.byte = e.encodedDataLength; });
  const t0 = Date.now();
  await page.goto(URL_, {waitUntil: 'load', timeout: 60000}).catch(() => {});
  await sleep(attesa);
  const fotoArrivo = path.join(OUT, 'richieste-arrivo.png'); await page.screenshot({path: fotoArrivo}).catch(() => {});
  const arrivo = [...reqs.values()];
  const riep = lista => {
    const doms = {}, tipi = {}; let byte = 0;
    for (const r of lista) { const h = host(r.url); doms[h] = (doms[h] || 0) + 1; tipi[r.tipo] = (tipi[r.tipo] || 0) + 1; byte += r.byte || 0; }
    const terzi = Object.keys(doms).filter(h => h && radice(h) !== sito);
    const font = lista.filter(r => r.tipo === 'Font' || /font|woff/i.test(r.mime || '') || /\.woff2?($|\?)/.test(r.url));
    const js = lista.filter(r => r.tipo === 'Script' || /javascript/.test(r.mime || ''));
    const img = lista.filter(r => r.tipo === 'Image');
    return {richieste: lista.length, kb: Math.round(byte / 1024), domini: doms, domini_di_terzi: terzi, richieste_a_terzi: terzi.reduce((n, h) => n + doms[h], 0), tipi, font_file: font.length, font_kb: Math.round(font.reduce((n, r) => n + (r.byte || 0), 0) / 1024), script_kb: Math.round(js.reduce((n, r) => n + (r.byte || 0), 0) / 1024), immagini: img.length, immagini_kb: Math.round(img.reduce((n, r) => n + (r.byte || 0), 0) / 1024), caratteri_famiglie: null};
  };
  const famiglie = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.style)).catch(() => []);
  const r1 = riep(arrivo); r1.caratteri_famiglie = famiglie;
  // poi scorrimento fino in fondo a passi, per il peso della lettura completa
  let y = 0; const alt = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => 0);
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 1600); await sleep(350); y += 1600; if (y > (alt || 30000) + 4000) break; }
  await sleep(2500);
  const r2 = riep([...reqs.values()]);
  const dettaglio = [...reqs.values()].filter(r => r.byte > 150 * 1024).map(r => ({url: r.url.slice(0, 160), tipo: r.tipo, kb: Math.round(r.byte / 1024)})).sort((a, b) => b.kb - a.kb).slice(0, 12);
  salva('richieste.json', {url: URL_, condizioni: 'Chromium senza cache, 1440×900, rete della macchina (nessuna emulazione), nessun gesto prima del campione «arrivo»', attesa_dopo_load_ms: attesa, arrivo: r1, dopo_scorrimento_completo: r2, piu_pesanti: dettaglio, durata_ms: Date.now() - t0});
  salva('richieste-elenco.json', [...reqs.values()].map(r => ({url: r.url.slice(0, 200), tipo: r.tipo, stato: r.stato, mime: r.mime, byte: r.byte})));
  log('richieste arrivo', r1.richieste, r1.kb, 'kB; terzi', r1.domini_di_terzi.join(','), '| dopo scorrimento', r2.richieste, r2.kb, 'kB');
  await ctx.close();
}

// ---------- fase: telefono 390×844 ----------
async function telefono() {
  const ctx = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: UA_MOBILE, locale: 'it-IT'});
  const page = await ctx.newPage();
  await page.goto(URL_, {waitUntil: 'load', timeout: 60000}).catch(() => {});
  await sleep(attesa);
  await page.screenshot({path: path.join(OUT, 'telefono-390-arrivo.png')}).catch(() => {});
  const vp = await page.evaluate(() => innerWidth + 'x' + innerHeight).catch(() => null);
  const arrivo = await page.evaluate(misuraBersagli).catch(e => ({errore: String(e)}));
  const alt = arrivo.scrollHeight || 4000; const passi = [];
  const posizioni = [0.12, 0.3, 0.5, 0.7, 0.9];
  for (let i = 0; i < posizioni.length; i++) {
    const dy = Math.round(alt * posizioni[i]);
    // R20 ha scorrimento virtuale (la pagina non scorre): la rotella arriva comunque
    await page.evaluate(y => window.scrollTo(0, y), dy).catch(() => {});
    await page.mouse.wheel(0, Math.round(alt * (i === 0 ? 0.12 : 0.18))).catch(() => {});
    await sleep(1400);
    const nome = `telefono-390-scorri-${i + 1}.png`;
    await page.screenshot({path: path.join(OUT, nome)}).catch(() => {});
    passi.push({file: nome, scrollY: await page.evaluate(() => Math.round(scrollY)).catch(() => null)});
  }
  salva('telefono-390.json', {url: URL_, viewport_effettivo: vp, voce: 'Telefono di scripts/dispositivi.mjs (390×844), Chromium con emulazione mobile e tocco', arrivo, passi});
  log('telefono', vp, 'scrollWidth', arrivo.scrollWidth, 'bersagli', arrivo.bersagli_in_vista, 'min', arrivo.larghezza_min_px, 'x', arrivo.altezza_min_px);
  await ctx.close();
}

// ---------- fase: bersagli e testo al computer (V16, V17) ----------
async function bersagli() {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'});
  const page = await ctx.newPage();
  await page.goto(URL_, {waitUntil: 'load', timeout: 60000}).catch(() => {});
  await sleep(attesa);
  const m = await page.evaluate(misuraBersagli).catch(e => ({errore: String(e)}));
  salva('bersagli-computer.json', {url: URL_, ...m});
  log('bersagli computer', m.bersagli_in_vista, 'min', m.larghezza_min_px, 'x', m.altezza_min_px, 'corpo', m.testo_corrente?.corpo_px);
  await ctx.close();
}

const tabella = {nojs, lenta, stampa, richieste, telefono, bersagli};
for (const f of fasi) {
  if (!tabella[f]) { log('fase sconosciuta', f); continue; }
  const t = Date.now();
  try { await tabella[f](); log('fase', f, 'finita in', Math.round((Date.now() - t) / 1000), 's'); }
  catch (e) { log('fase', f, 'FALLITA:', String(e).split('\n')[0]); salva(`errore-${f}.txt`, String(e)); }
}
await browser.close();
salva('versione-chromium.txt', versione + '\n' + new Date().toISOString() + '\n');
log('fine');
