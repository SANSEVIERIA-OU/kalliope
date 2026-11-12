#!/usr/bin/env node
// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
// Script del worker visita-4: telefono 390x844, senza JavaScript, rete lenta, stampa, richieste/peso e media bloccato.
// Un solo browser Chromium senza finestra (nessun posto di passo.mjs aperto mentre gira). Uso:
//   env -u DISPLAY -u WAYLAND_DISPLAY PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs \
//     node visita4-misure.mjs <ID> <url> [--solo=telefono,nojs,lenta,stampa,rete,media] [--cartella=nome]
// Scrive in design/ricerca/prove/<ID>/script/ (foto NNN-etichetta.png e misure-script.json).
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const [id, url] = process.argv.slice(2, 4);
const opz = Object.fromEntries(process.argv.slice(4).filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
const solo = (opz.solo || 'telefono,nojs,lenta,stampa,rete,media').split(',');
if (!id || !url) { console.error('uso: visita4-misure.mjs <ID> <url> [--solo=…]'); process.exit(2); }
const BASE = '/workspace/kalliope/design/ricerca/prove';
const out = path.join(BASE, id, opz.cartella || 'script');
fs.mkdirSync(out, {recursive: true});
const lettura = fs.readFileSync('/workspace/kalliope/design/ricerca/strumenti/visita4-lettura.js', 'utf8');
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const risultati = {id, url, data: new Date().toISOString(), viewportTelefono: '390x844', note: []};
let n = fs.readdirSync(out).filter(f => f.endsWith('.png')).length;
const foto = async (page, etichetta, opzioni = {}) => { n++; const f = path.join(out, `${String(n).padStart(3, '0')}-${etichetta}.png`); await page.screenshot({path: f, ...opzioni}).catch(e => risultati.note.push(`foto ${etichetta}: ${String(e).slice(0, 120)}`)); return path.relative(BASE, f); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const dominio = u => { try { return new URL(u).hostname; } catch { return ''; } };
const base = h => h.split('.').slice(-2).join('.');

const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href);
const chromium = (pw.chromium || pw.default?.chromium);
const browser = await chromium.launch({headless: true, channel: 'chromium', args: ['--hide-scrollbars', '--force-device-scale-factor=1', '--disable-search-engine-choice-screen']});
const nuovo = (extra = {}) => browser.newContext({locale: 'it-IT', deviceScaleFactor: 1, ...extra});
const t0 = Date.now();
const lim = (nome, ms, fn) => Promise.race([fn(), sleep(ms).then(() => { risultati.note.push(`${nome}: oltre ${ms / 1000} s, interrotto`); })]);

try {
  if (solo.includes('telefono')) await lim('telefono', 90000, async () => {
    const ctx = await nuovo({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, userAgent: UA});
    const page = await ctx.newPage();
    await page.goto(url, {waitUntil: 'load', timeout: 60000}).catch(e => risultati.note.push('telefono goto: ' + String(e).slice(0, 100)));
    await sleep(3500);
    const r = {viewport: await page.evaluate('innerWidth+"x"+innerHeight'), foto: []};
    r.foto.push(await foto(page, 'telefono-arrivo'));
    r.lettura = JSON.parse(await page.evaluate(lettura).catch(() => '{}'));
    const alt = await page.evaluate('document.documentElement.scrollHeight');
    for (const y of [1688, Math.round(alt / 2), alt - 844]) { if (y < 100) continue; await page.evaluate(`window.scrollTo(0,${y})`); await sleep(1200); r.foto.push(await foto(page, `telefono-scroll-${y}`)); }
    r.scrollHeight = alt;
    risultati.telefono = r; await ctx.close();
  });

  if (solo.includes('nojs')) await lim('nojs', 60000, async () => {
    const ctx = await nuovo({viewport: {width: 1440, height: 900}, javaScriptEnabled: false});
    const page = await ctx.newPage();
    await page.goto(url, {waitUntil: 'load', timeout: 45000}).catch(e => risultati.note.push('nojs goto: ' + String(e).slice(0, 100)));
    await sleep(2500);
    const r = {foto: [await foto(page, 'senza-js-arrivo')]};
    try { r.testo = (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 600); r.caratteri = (await page.innerText('body')).length; } catch (e) { r.testo_errore = String(e).slice(0, 100); }
    const html = await page.content();
    r.html = {byte: html.length, link: (html.match(/<a\s/gi) || []).length, pulsanti: (html.match(/<button/gi) || []).length, titoli: (html.match(/<h[1-3][\s>]/gi) || []).length, immagini: (html.match(/<img\s/gi) || []).length, noscript: (html.match(/<noscript/gi) || []).length, video: (html.match(/<video/gi) || []).length};
    await page.mouse.wheel(0, 1800).catch(() => {}); await sleep(800);
    r.foto.push(await foto(page, 'senza-js-scroll'));
    risultati.senzaJS = r; await ctx.close();
  });

  if (solo.includes('lenta')) await lim('lenta', 80000, async () => {
    const ctx = await nuovo({viewport: {width: 1440, height: 900}});
    const page = await ctx.newPage();
    await ctx.addInitScript(() => { window.__t = []; try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__t.push([e.name, Math.round(e.startTime)]); }).observe({type: 'paint', buffered: true}); } catch (e) {} });
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
    await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: 400, downloadThroughput: 51200, uploadThroughput: 51200}); // ~400 kbit/s, 400 ms: come «3G lento»
    const r = {condizioni: 'latenza 400 ms, 51200 B/s (400 kbit/s) giù e su, cache disattivata, solo Chromium', foto: [], campioni: []};
    const inizio = Date.now();
    page.goto(url, {waitUntil: 'commit', timeout: 60000}).catch(() => {});
    for (const s of [1.5, 4, 8, 14, 22]) {
      while (Date.now() - inizio < s * 1000) await sleep(100);
      const stato = await page.evaluate('({rs:document.readyState,testo:(document.body&&document.body.innerText||"").length,paint:window.__t||[],img:document.images.length})').catch(() => null);
      r.campioni.push({s, ...stato});
      r.foto.push(await foto(page, `rete-lenta-${String(s).replace('.', '_')}s`));
    }
    risultati.reteLenta = r; await ctx.close();
  });

  if (solo.includes('stampa')) await lim('stampa', 60000, async () => {
    const ctx = await nuovo({viewport: {width: 794, height: 1123}});
    const page = await ctx.newPage();
    await page.goto(url, {waitUntil: 'load', timeout: 45000}).catch(e => risultati.note.push('stampa goto: ' + String(e).slice(0, 100)));
    await sleep(2500);
    await page.emulateMedia({media: 'print'}); await sleep(600);
    const r = {foto: [await foto(page, 'stampa-1', {clip: {x: 0, y: 0, width: 794, height: 1123}})]};
    r.misure = await page.evaluate(`(() => { const v = e => { const c = getComputedStyle(e), b = e.getBoundingClientRect(); return c.display !== 'none' && c.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
      const fissi = [...document.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'fixed' && v(e)).map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + '.' + String(e.className).slice(0, 30));
      return {scrollW: document.documentElement.scrollWidth, scrollH: document.documentElement.scrollHeight, fissiVisibili: fissi.slice(0, 8), nFissi: fissi.length, navVisibili: [...document.querySelectorAll('nav,header')].filter(v).length, linkVisibili: [...document.querySelectorAll('a')].filter(v).length}; })()`).catch(() => null);
    try { const pdf = await page.pdf({format: 'A4', printBackground: false}); fs.writeFileSync(path.join(out, 'stampa.pdf'), pdf); r.pdf = {byte: pdf.length, pagine: (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length}; } catch (e) { r.pdf_errore = String(e).slice(0, 100); }
    risultati.stampa = r; await ctx.close();
  });

  if (solo.includes('rete')) await lim('rete', 60000, async () => {
    const ctx = await nuovo({viewport: {width: 1440, height: 900}});
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
    const req = new Map(), fin = new Map();
    cdp.on('Network.requestWillBeSent', e => req.set(e.requestId, e.request.url));
    cdp.on('Network.loadingFinished', e => fin.set(e.requestId, e.encodedDataLength));
    await page.goto(url, {waitUntil: 'load', timeout: 60000}).catch(e => risultati.note.push('rete goto: ' + String(e).slice(0, 100)));
    await sleep(4000);
    const host = dominio(url), b = base(host);
    const per = {}; let kb = 0, terzi = new Set();
    for (const [i, u] of req) { const h = dominio(u); if (!h) continue; per[h] = (per[h] || 0) + 1; kb += (fin.get(i) || 0); if (base(h) !== b) terzi.add(h); }
    const car = await page.evaluate('[...document.fonts].filter(f=>f.status==="loaded").length').catch(() => null);
    risultati.rete = {richieste: req.size, kb_trasferiti: Math.round(kb / 1024), domini: Object.entries(per).sort((x, y) => y[1] - x[1]).slice(0, 14), domini_di_terzi: [...terzi].sort(), caratteri_caricati: car, nota: 'cache disattivata; conteggio CDP Network (richieste e byte codificati); i video in streaming non sono contati fino in fondo'};
    risultati.metaCollegamento = JSON.parse(await page.evaluate(`JSON.stringify((() => { const m = {}; for (const e of document.querySelectorAll('meta[property],meta[name]')) { const k = e.getAttribute('property') || e.getAttribute('name'); if (/^(og:|twitter:|description)/.test(k)) m[k] = e.content.slice(0, 90); } return {title: document.title, canonical: document.querySelector('link[rel=canonical]')?.href || null, meta: m, lang: document.documentElement.lang}; })())`).catch(() => '{}'));
    await ctx.close();
  });

  if (solo.includes('media')) await lim('media', 60000, async () => {
    const ctx = await nuovo({viewport: {width: 1440, height: 900}});
    const page = await ctx.newPage();
    let bloccate = 0;
    await page.route(/\.(mp4|webm|mp3|m4a|ogg)(\?|$)|youtube\.com|youtube-nocookie\.com|embedly\.com|download\.assistiveware\.com\/assistiveware\/media\/audio/i, r => { bloccate++; r.abort(); });
    await page.goto(url, {waitUntil: 'load', timeout: 60000}).catch(e => risultati.note.push('media goto: ' + String(e).slice(0, 100)));
    await sleep(3000);
    const r = {richieste_media_bloccate: bloccate, foto: [await foto(page, 'media-bloccato-arrivo')]};
    r.stato = await page.evaluate('({testo:(document.body.innerText||"").length,video:[...document.querySelectorAll("video")].map(v=>({err:!!v.error,rs:v.readyState,poster:!!v.poster})),h:document.documentElement.scrollHeight})').catch(() => null);
    risultati.mediaBloccato = r; await ctx.close();
  });
} finally {
  risultati.durata_s = Math.round((Date.now() - t0) / 1000);
  fs.writeFileSync(path.join(out, 'misure-script.json'), JSON.stringify(risultati, null, 1));
  await browser.close();
}
console.log(JSON.stringify({id, durata_s: risultati.durata_s, note: risultati.note, cartella: path.relative(BASE, out)}));
