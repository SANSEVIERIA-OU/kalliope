#!/usr/bin/env node
// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
// Strumento del worker visita-2 (incarico visita-2.md): le prove che passo.mjs non fa, lanciate SENZA un posto aperto.
// Per un riferimento (R04, R05, R06): senza JavaScript, rete lenta (CDP, solo Chromium), stampa, albero di accessibilita'
// (ariaSnapshot di Playwright, proxy: NON sostituisce Orca/NVDA/VoiceOver) e telefono 390x844 (la misura «Telefono» di
// scripts/dispositivi.mjs; passo.mjs mobile usa 430x932).
// Uso: env -u DISPLAY -u WAYLAND_DISPLAY PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs \
//        node visita2-senza-posto.mjs R04|R05|R06 [prova...]     (prove: senzajs lenta stampa aria telefono; default tutte)
// Scrive in design/ricerca/prove/<ID>/<cartella-prova>/ e un riepilogo JSON accanto. Nessun modulo inviato, nessun dato vero.
import fs from 'node:fs';
import path from 'node:path';
const PW = process.env.PLAYWRIGHT || '/workspace/test-playwright/node_modules/playwright/index.mjs';
const {chromium} = await import(PW);
const ID = process.argv[2];
const SITI = {
  R04: {url: 'https://waymo.com/safety/', rifiuta: /^Reject All$/i, attesaMs: 2500},
  R05: {url: 'https://www.lalal.ai/', rifiuta: /^Rifiuta$/i, attesaMs: 3500},
  R06: {url: 'https://through-sliding-doors.rosiesplace.org.au/', rifiuta: /^No sound thanks$/i, attesaMs: 6000},
};
const sito = SITI[ID]; if (!sito) { console.error('ID: R04|R05|R06'); process.exit(2); }
const prove = process.argv.slice(3).length ? process.argv.slice(3) : ['senzajs', 'lenta', 'stampa', 'aria', 'telefono'];
const BASE = '/workspace/kalliope/design/ricerca/prove/' + ID;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const cartella = n => { const d = path.join(BASE, n); fs.mkdirSync(d, {recursive: true}); return d; };
const riepilogoFile = path.join(BASE, 'riepilogo-senza-posto.json');
const riepilogo = fs.existsSync(riepilogoFile) ? JSON.parse(fs.readFileSync(riepilogoFile, 'utf8')) : {};
const salva = () => fs.writeFileSync(riepilogoFile, JSON.stringify(riepilogo, null, 1));
riepilogo.strumento = 'visita2-senza-posto.mjs (Playwright Chromium, headless, senza finestra)';
riepilogo.url = sito.url; riepilogo.data = new Date().toISOString();

const browser = await chromium.launch({headless: true});
const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
try {
  if (prove.includes('senzajs')) {
    const d = cartella('senza-js'); const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, javaScriptEnabled: false});
    const page = await ctx.newPage(); const t0 = Date.now(); let esito = 'ok';
    try { await page.goto(sito.url, {waitUntil: 'load', timeout: 60000}); } catch (e) { esito = 'errore: ' + String(e.message).slice(0, 160); }
    await sleep(1500);
    const html = await page.content(); const testo = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
    await page.screenshot({path: path.join(d, '001-arrivo.jpg'), type: 'jpeg', quality: 80});
    await page.screenshot({path: path.join(d, '002-pagina-intera.jpg'), type: 'jpeg', quality: 60, fullPage: true}).catch(() => {});
    const conta = re => (html.match(re) || []).length;
    riepilogo.senza_js = {esito, ms: Date.now() - t0, html_byte: html.length, testo_caratteri: testo.length, anteprima_testo: testo.slice(0, 600), link: conta(/<a\s[^>]*href=/gi), pulsanti: conta(/<button\b/gi), campi: conta(/<input\b|<textarea\b|<select\b/gi), titoli: conta(/<h[1-6]\b/gi), img: conta(/<img\b/gi), noscript: conta(/<noscript\b/gi), canvas: conta(/<canvas\b/gi), audio_video: conta(/<(audio|video)\b/gi), foto: ['senza-js/001-arrivo.jpg', 'senza-js/002-pagina-intera.jpg']};
    salva(); await ctx.close(); console.log('senza JS:', JSON.stringify(riepilogo.senza_js).slice(0, 400));
  }
  if (prove.includes('lenta')) {
    // seconda versione (cartella rete-lenta-2): la prima lettura bloccava page.evaluate mentre il documento arrivava piano
    // e produceva campioni radi; qui ogni lettura ha un tetto di tempo e si contano anche richieste e byte via CDP.
    const d = cartella('rete-lenta-2'); const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    const profilo = {latenza_ms: 400, giu_kbps: 400, su_kbps: 400}; // «Slow 3G» di DevTools
    await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: profilo.latenza_ms, downloadThroughput: profilo.giu_kbps * 1024 / 8, uploadThroughput: profilo.su_kbps * 1024 / 8});
    let byte = 0, richieste = 0, finite = 0, dcl = null, caricata = null; const t0 = Date.now();
    cdp.on('Network.requestWillBeSent', () => { richieste++; });
    cdp.on('Network.loadingFinished', e => { finite++; byte += e.encodedDataLength || 0; });
    page.on('domcontentloaded', () => { dcl = Date.now() - t0; }); page.on('load', () => { caricata = Date.now() - t0; });
    page.goto(sito.url, {waitUntil: 'commit', timeout: 60000}).catch(() => {});
    const tetto = (p, ms) => Promise.race([p, sleep(ms).then(() => 'nd')]);
    const foto = [1, 2, 4, 8, 15, 25]; let k = 0; let primoTesto = null; const campioni = [];
    while (Date.now() - t0 < 30000) {
      await sleep(400);
      const t = Date.now() - t0;
      const info = await tetto(page.evaluate(() => { const b = document.body; const tx = (b && b.innerText || '').trim(); return {len: tx.length, inizio: tx.split('\n').slice(0, 2).join(' | ').slice(0, 100), scheletri: document.querySelectorAll('[class*=skeleton],[class*=spinner],[class*=loading]').length, stato: document.readyState}; }).catch(() => 'nd'), 1200);
      if (info && info !== 'nd' && info.len > 40 && primoTesto === null) primoTesto = t;
      if (k < foto.length && t >= foto[k] * 1000) {
        const f = `00${k + 1}-${foto[k]}s.jpg`;
        const ok = await tetto(page.screenshot({path: path.join(d, f), type: 'jpeg', quality: 70, timeout: 4000}).then(() => 'ok').catch(() => 'nd'), 4500);
        campioni.push({t_ms: t, richieste, finite, kb_ricevuti: Math.round(byte / 1024), dcl_ms: dcl, load_ms: caricata, foto: ok === 'ok' ? f : 'non riuscita', ...(info === 'nd' ? {lettura: 'nd (pagina non risponde alla lettura)'} : info)}); k++;
      }
    }
    riepilogo.rete_lenta_2 = {profilo, nota: 'Chromium con CDP Network.emulateNetworkConditions; non eseguibile in Firefox/WebKit con questo strumento; seconda versione della prova (la prima e in rete-lenta/ ed e rada)', ms_al_primo_testo_letto: primoTesto, dcl_ms: dcl, load_ms: caricata, campioni, cartella: 'rete-lenta-2'};
    salva(); await ctx.close(); console.log('rete lenta 2: primo testo a', primoTesto, 'ms, dcl', dcl, 'load', caricata, 'richieste', richieste);
  }
  if (prove.includes('stampa')) {
    const d = cartella('stampa'); const ctx = await browser.newContext({viewport: {width: 794, height: 1123}});
    const page = await ctx.newPage();
    await page.goto(sito.url, {waitUntil: 'load', timeout: 60000}).catch(() => {}); await sleep(sito.attesaMs);
    await page.emulateMedia({media: 'print'}); await sleep(800);
    await page.screenshot({path: path.join(d, '001-stampa-prima-pagina.jpg'), type: 'jpeg', quality: 80});
    await page.screenshot({path: path.join(d, '002-stampa-intera.jpg'), type: 'jpeg', quality: 55, fullPage: true}).catch(() => {});
    let pagine = null; try { const pdf = await page.pdf({path: path.join(d, 'stampa.pdf'), format: 'A4', printBackground: false}); pagine = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length; } catch (e) { pagine = 'errore: ' + String(e.message).slice(0, 100); }
    const m = await page.evaluate(() => ({h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, nascosti: [...document.querySelectorAll('header,nav,footer,button,[role=dialog],video,canvas')].filter(e => getComputedStyle(e).display === 'none').length, visibili: [...document.querySelectorAll('header,nav,footer,button,[role=dialog],video,canvas')].filter(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0).length, testo: (document.body.innerText || '').length})).catch(() => null);
    riepilogo.stampa = {media: 'print (emulateMedia)', viewport: '794x1123 (A4 a 96 dpi)', pagine_pdf_stima: pagine, misure: m, foto: ['stampa/001-stampa-prima-pagina.jpg', 'stampa/002-stampa-intera.jpg', 'stampa/stampa.pdf']};
    salva(); await ctx.close(); console.log('stampa:', JSON.stringify(riepilogo.stampa).slice(0, 300));
  }
  if (prove.includes('aria')) {
    const d = cartella('albero-accessibilita'); const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
    const page = await ctx.newPage();
    await page.goto(sito.url, {waitUntil: 'load', timeout: 60000}).catch(() => {}); await sleep(sito.attesaMs);
    let snap = ''; try { snap = await page.locator('body').ariaSnapshot({timeout: 20000}); } catch (e) { snap = 'ERRORE: ' + String(e.message).slice(0, 200); }
    fs.writeFileSync(path.join(d, 'aria-snapshot-computer.yml'), snap);
    const righe = snap.split('\n'); const c = re => righe.filter(l => re.test(l)).length;
    riepilogo.albero_accessibilita = {strumento: 'ariaSnapshot di Playwright (proxy, non e un lettore di schermo)', righe: righe.length, landmark: {banner: c(/- banner/), navigation: c(/- navigation/), main: c(/- main/), contentinfo: c(/- contentinfo/), dialog: c(/- dialog/), region: c(/- region/)}, titoli: c(/- heading/), link: c(/- link/), pulsanti: c(/- button/), immagini: c(/- img/), pulsanti_senza_nome: righe.filter(l => /- button\s*(\[|:|$)/.test(l) && !/"/.test(l)).length, link_senza_nome: righe.filter(l => /- link\s*(\[|:|$)/.test(l) && !/"/.test(l)).length, file: 'albero-accessibilita/aria-snapshot-computer.yml'};
    salva(); await ctx.close(); console.log('aria:', JSON.stringify(riepilogo.albero_accessibilita).slice(0, 300));
  }
  if (prove.includes('telefono')) {
    const d = cartella('telefono-390'); const ctx = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: UA_MOBILE});
    const page = await ctx.newPage();
    await page.goto(sito.url, {waitUntil: 'load', timeout: 60000}).catch(() => {}); await sleep(sito.attesaMs);
    const vp = await page.evaluate(() => innerWidth + 'x' + innerHeight);
    await page.screenshot({path: path.join(d, '001-arrivo.jpg'), type: 'jpeg', quality: 80});
    try { await page.getByRole('button', {name: sito.rifiuta}).first().click({timeout: 4000}); } catch { try { await page.getByText(sito.rifiuta).first().click({timeout: 3000}); } catch {} }
    await sleep(sito.attesaMs);
    await page.screenshot({path: path.join(d, '002-dopo-consenso.jpg'), type: 'jpeg', quality: 80});
    const passi = [];
    for (let k = 1; k <= 4; k++) { await page.mouse.wheel(0, 780); await sleep(1500); await page.screenshot({path: path.join(d, `00${k + 2}-scorri-${k}.jpg`), type: 'jpeg', quality: 70}); }
    const m = await page.evaluate(() => { const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0'; }; const tg = [...document.querySelectorAll('a[href],button,input,select')].filter(vis).map(e => { const r = e.getBoundingClientRect(); return {w: Math.round(r.width), h: Math.round(r.height)}; }); const p = [...document.querySelectorAll('p,li')].filter(vis).filter(e => (e.innerText || '').length > 50)[0]; const cs = p && getComputedStyle(p); return {innerWidth, scrollWidth: document.documentElement.scrollWidth, altezza: document.documentElement.scrollHeight, bersagli: tg.length, min_w: Math.min(...tg.map(x => x.w)), min_h: Math.min(...tg.map(x => x.h)), sotto_44: tg.filter(x => x.w < 44 || x.h < 44).length, corpo_px: cs && cs.fontSize, interlinea: cs && cs.lineHeight, larghezza_paragrafo: p && Math.round(p.getBoundingClientRect().width)}; }).catch(() => null);
    riepilogo.telefono_390 = {viewport_effettivo: vp, ua: 'iPhone 18.5 (emulato; stesso UA di passo.mjs)', misure: m, foto: fs.readdirSync(d).map(f => 'telefono-390/' + f)};
    salva(); await ctx.close(); console.log('telefono 390:', JSON.stringify(riepilogo.telefono_390).slice(0, 400));
  }
} finally { await browser.close(); }
console.log('riepilogo:', riepilogoFile);
