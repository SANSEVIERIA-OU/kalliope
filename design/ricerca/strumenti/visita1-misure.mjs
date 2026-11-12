/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Misure del worker visita-1 (nessun posto passo.mjs tenuto: un solo browser, lanciato dopo `libera`).
// Per un ID: telefono 390x844, richieste e terze parti all'arrivo (computer), senza JavaScript, rete lenta (CDP,
// solo Chromium), stampa, albero di accessibilita' (ariaSnapshot) e meta di condivisione.
// Uso: PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs node visita1-misure.mjs <ID> <url> <attesa-ms> <cartella-uscita>
import fs from 'node:fs';
import path from 'node:path';
const [ID, URL_, ATT = '6000', OUT] = process.argv.slice(2);
if (!ID || !URL_ || !OUT) { console.error('uso: <ID> <url> <attesa-ms> <cartella-uscita>'); process.exit(2); }
const att = Number(ATT);
const {chromium} = await import(process.env.PLAYWRIGHT);
fs.mkdirSync(OUT, {recursive: true});
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';
const risultato = {id: ID, url: URL_, data: new Date().toISOString(), strumento: 'Playwright chromium (channel chromium) senza finestra, un solo browser', note: []};
const salva = () => fs.writeFileSync(path.join(OUT, `misure-${ID}.json`), JSON.stringify(risultato, null, 1));
const args = ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--force-device-scale-factor=1'];
const browser = await chromium.launch({channel: 'chromium', headless: true, args, timeout: 60000});
const host = u => { try { return new URL(u).host; } catch { return ''; } };
const prima = host(URL_).replace(/^www\./, '');
const stessoSito = h => h === host(URL_) || h.endsWith('.' + prima.split('.').slice(-2).join('.'));

try {
  // 1. computer: richieste, terze parti, byte, meta, albero di accessibilita'
  {
    const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'});
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    const rich = new Map();
    cdp.on('Network.requestWillBeSent', e => rich.set(e.requestId, {url: e.request.url, tipo: e.type, byte: 0}));
    cdp.on('Network.loadingFinished', e => { const r = rich.get(e.requestId); if (r) r.byte = e.encodedDataLength; });
    await page.goto(URL_, {waitUntil: 'load', timeout: 60000}).catch(e => risultato.note.push('goto: ' + String(e).slice(0, 120)));
    await sleep(att);
    const lista = [...rich.values()];
    const domini = {};
    for (const r of lista) { const h = host(r.url); if (h) domini[h] = (domini[h] || 0) + 1; }
    const terzi = Object.keys(domini).filter(h => !stessoSito(h));
    const fontReq = lista.filter(r => r.tipo === 'Font');
    risultato.arrivo_computer = {richieste: lista.length, kb_trasferiti: Math.round(lista.reduce((a, r) => a + r.byte, 0) / 1024), domini, domini_di_terzi: terzi, per_tipo: lista.reduce((a, r) => { a[r.tipo] = (a[r.tipo] || 0) + 1; return a; }, {}), font_richiesti: fontReq.map(r => r.url.slice(-60)), maggiori: lista.sort((a, b) => b.byte - a.byte).slice(0, 6).map(r => `${r.url.slice(-70)} ${Math.round(r.byte / 1024)}KB`), attesa_ms_dopo_load: att};
    risultato.meta = await page.evaluate(() => { const m = {}; for (const e of document.querySelectorAll('meta[property],meta[name]')) { const k = e.getAttribute('property') || e.getAttribute('name'); if (/^(og:|twitter:|description|theme-color)/.test(k)) m[k] = e.content.slice(0, 140); } return {title: document.title, lang: document.documentElement.lang, ...m, icone: [...document.querySelectorAll('link[rel*=icon]')].map(l => l.getAttribute('href')).slice(0, 3)}; });
    risultato.testo_arrivo = await page.evaluate(() => ({lunghezza: document.body.innerText.length, parole: document.body.innerText.split(/\s+/).filter(Boolean).length}));
    try {
      const snap = await page.locator('body').ariaSnapshot();
      fs.writeFileSync(path.join(OUT, `albero-accessibilita-${ID}.txt`), snap);
      const righe = snap.split('\n');
      const conta = re => righe.filter(l => re.test(l)).length;
      risultato.albero_accessibilita = {righe: righe.length, heading: conta(/- heading/), h1: conta(/heading .*\[level=1\]/), link: conta(/- link/), button: conta(/- button/), img: conta(/- img/), landmark_banner: conta(/- banner/), landmark_navigation: conta(/- navigation/), landmark_main: conta(/- main/), landmark_contentinfo: conta(/- contentinfo/), link_senza_nome: conta(/- link( \[[^\]]*\])*:?$/), button_senza_nome: conta(/- button( \[[^\]]*\])*:?$/), img_senza_nome: conta(/- img( \[[^\]]*\])*:?$/), proxy: 'ariaSnapshot di Playwright, non e\' un lettore di schermo'};
    } catch (e) { risultato.note.push('ariaSnapshot: ' + String(e).slice(0, 120)); }
    await page.screenshot({path: path.join(OUT, 'arrivo-computer-misura.jpg'), type: 'jpeg', quality: 70});
    // 5. stampa (stessa pagina, stessa sessione)
    await page.emulateMedia({media: 'print'});
    await sleep(800);
    await page.screenshot({path: path.join(OUT, 'stampa-schermo.jpg'), type: 'jpeg', quality: 70, fullPage: false});
    try {
      await page.pdf({path: path.join(OUT, `stampa-${ID}.pdf`), format: 'A4', printBackground: false, timeout: 60000});
      const pdf = fs.readFileSync(path.join(OUT, `stampa-${ID}.pdf`), 'latin1');
      risultato.stampa = {pdf_byte: pdf.length, pagine_pdf: (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length, nota: 'PDF A4 senza sfondi; pagine contate dal file'};
    } catch (e) { risultato.note.push('pdf: ' + String(e).slice(0, 120)); }
    risultato.stampa = {...(risultato.stampa || {}), nascosti_in_stampa: await page.evaluate(() => { const sel = ['nav', 'header', 'footer', 'button', 'video', 'canvas', 'iframe']; const o = {}; for (const s of sel) { const e = [...document.querySelectorAll(s)]; o[s] = `${e.filter(x => getComputedStyle(x).display === 'none').length}/${e.length} nascosti`; } return o; }), overflow_x_stampa: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)};
    salva();
    await ctx.close();
  }
  // 2. telefono 390x844
  {
    const ctx = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: UA_MOBILE, locale: 'it-IT'});
    const page = await ctx.newPage();
    await page.goto(URL_, {waitUntil: 'load', timeout: 60000}).catch(e => risultato.note.push('goto mobile: ' + String(e).slice(0, 120)));
    await sleep(att);
    const dim = await page.evaluate(() => ({inner: [innerWidth, innerHeight], sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight, h1: (document.querySelector('h1') ? getComputedStyle(document.querySelector('h1')).fontSize : null), corpo: (() => { const p = [...document.querySelectorAll('p')].find(e => e.getBoundingClientRect().width > 0 && e.innerText.length > 30); return p ? getComputedStyle(p).fontSize + '/' + getComputedStyle(p).lineHeight : null; })()}));
    risultato.telefono_390x844 = dim;
    await page.screenshot({path: path.join(OUT, 'telefono-390x844-arrivo.png')});
    if (ID === 'R01') await page.touchscreen.tap(195, 600).catch(() => {}); // solo R01: il comando principale sta circa a quell'altezza
    else await page.evaluate(() => window.scrollBy(0, 800)).catch(() => {});
    await sleep(2500);
    await page.screenshot({path: path.join(OUT, 'telefono-390x844-dopo-tocco.png')});
    risultato.telefono_390x844.dopo_tocco = await page.evaluate(() => ({url: location.href, sw: document.documentElement.scrollWidth}));
    salva();
    await ctx.close();
  }
  // 3. senza JavaScript
  {
    const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, javaScriptEnabled: false, locale: 'it-IT'});
    const page = await ctx.newPage();
    await page.goto(URL_, {waitUntil: 'load', timeout: 60000}).catch(e => risultato.note.push('goto senza JS: ' + String(e).slice(0, 120)));
    await sleep(2500);
    // senza JS page.evaluate funziona comunque nel contesto di utilita' di Playwright
    const info = await page.evaluate(() => { const t = document.body ? document.body.innerText : ''; return {titolo: document.title, caratteri_testo: t.length, parole: t.split(/\s+/).filter(Boolean).length, primi_100: t.trim().replace(/\s+/g, ' ').slice(0, 160), link: document.querySelectorAll('a[href]').length, pulsanti: document.querySelectorAll('button,[role=button]').length, img: document.images.length, h1: document.querySelectorAll('h1').length, nav: document.querySelectorAll('nav').length, noscript: [...document.querySelectorAll('noscript')].map(n => n.textContent.trim().slice(0, 100)).filter(Boolean), canvas: document.querySelectorAll('canvas').length, sw: document.documentElement.scrollWidth}; }).catch(e => ({errore: String(e).slice(0, 100)}));
    risultato.senza_javascript = info;
    await page.screenshot({path: path.join(OUT, 'senza-javascript.jpg'), type: 'jpeg', quality: 70});
    salva();
    await ctx.close();
  }
  // 4. rete lenta (CDP, solo Chromium): 1,6 Mbit/s in discesa, 750 kbit/s in salita, 562 ms di latenza (profilo «Fast 3G» di DevTools)
  {
    const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'});
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: 562, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8});
    await page.addInitScript(() => { window.__p = []; try { new PerformanceObserver(l => { for (const e of l.getEntries()) window.__p.push([e.name, Math.round(e.startTime)]); }).observe({type: 'paint', buffered: true}); } catch {} });
    const t0 = Date.now();
    page.goto(URL_, {waitUntil: 'commit', timeout: 90000}).catch(() => {});
    const quando = [2, 5, 10, 20];
    risultato.rete_lenta = {profilo: 'discesa 1,6 Mbit/s, salita 750 kbit/s, latenza 562 ms (CDP Network.emulateNetworkConditions; solo Chromium)', foto: []};
    for (const s of quando) {
      const attesa = s * 1000 - (Date.now() - t0); if (attesa > 0) await sleep(attesa);
      const f = `rete-lenta-${String(s).padStart(2, '0')}s.jpg`;
      await page.screenshot({path: path.join(OUT, f), type: 'jpeg', quality: 60}).catch(() => {});
      const st = await page.evaluate(() => ({testo: document.body ? document.body.innerText.trim().length : 0, paint: window.__p || [], pronto: document.readyState})).catch(() => ({}));
      risultato.rete_lenta.foto.push({s, file: f, ...st});
    }
    salva();
    await ctx.close();
  }
} catch (e) {
  risultato.note.push('errore: ' + String(e).slice(0, 300));
}
await browser.close();
salva();
console.log(JSON.stringify({ID, note: risultato.note, arrivo_computer: risultato.arrivo_computer && {richieste: risultato.arrivo_computer.richieste, kb: risultato.arrivo_computer.kb_trasferiti, terzi: risultato.arrivo_computer.domini_di_terzi}, telefono: risultato.telefono_390x844, senza_js: risultato.senza_javascript, rete_lenta: risultato.rete_lenta && risultato.rete_lenta.foto.map(f => [f.s, f.testo, f.paint]), stampa: risultato.stampa, albero: risultato.albero_accessibilita}, null, 1));
