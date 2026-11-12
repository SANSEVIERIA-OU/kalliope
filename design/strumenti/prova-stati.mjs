/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Prove degli stati e dei ripieghi in Chromium senza finestra: tastiera, focus, movimento ridotto, stampa, colori forzati, filtro, 404, tema.
// Uso: node design/strumenti/con-server.mjs DIR node design/strumenti/prova-stati.mjs CARTELLA
import {mkdirSync, writeFileSync} from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT);
const {avvia: avviaMotore} = await import('/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator/scripts/lib/comune.mjs');
const motore = process.env.MOTORE || 'chromium';
// WebKit di questo ambiente si blocca con qualsiasi <audio> che abbia una sorgente (anche fuori dal sito): in WebKit si toglie src dagli <audio> prima di caricare la pagina
async function senzaSorgentiAudio(ctx) {
  await ctx.route(/^http:\/\/127\.0\.0\.1/, async r => { const res = await r.fetch(); const t = res.headers()['content-type'] || ''; if (/text\/html/.test(t)) await r.fulfill({response: res, body: (await res.text()).replace(/(<audio[^>]*?)\ssrc="[^"]*"/g, '$1')}); else await r.fulfill({response: res}); });
}
async function avvia(opzioni = {}) {
  const b = motore === 'chromium' ? await pw.chromium.launch({headless: true, args: ['--autoplay-policy=no-user-gesture-required']}) : await avviaMotore(motore);
  if (motore === 'webkit') { const nc = b.newContext.bind(b); b.newContext = async o => { const c = await nc(o); await senzaSorgentiAudio(c); return c; }; }
  return b;
}
const out = process.argv[2]; mkdirSync(out, {recursive: true});
const base = process.env.ANTEPRIMA; const esiti = [];
const ok = (nome, c, d = '') => { esiti.push({nome, ok: !!c, dettaglio: d}); console.log((c ? 'OK   ' : 'FALLITO ') + nome + (d ? ' · ' + d : '')); };
const browser = await avvia();
const U = u => new URL(u, base).href;

// 1. Tastiera sulla home: salta-al-contenuto, anello di focus, Tab fino al comando principale
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}}); const p = await ctx.newPage();
  await p.goto(U(''), {waitUntil: 'networkidle'});
  await p.keyboard.press('Tab');
  const salta = await p.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return {testo: a.textContent, visibile: r.top >= 0 && r.height > 0, classe: a.className}; });
  ok('tastiera: il primo Tab va a «Vai al contenuto» e lo rende visibile', /Vai al contenuto/.test(salta.testo) && salta.visibile, JSON.stringify(salta));
  await p.screenshot({path: `${out}/tastiera-1-salta.png`, clip: {x: 0, y: 0, width: 1440, height: 160}});
  let n = 1, testo = '';
  for (; n < 20; n++) { await p.keyboard.press('Tab'); testo = await p.evaluate(() => document.activeElement.textContent.trim()); if (/Ascolta Giulia/.test(testo)) { n++; break; } }
  ok('tastiera: «Ascolta Giulia» (primo schermo) si raggiunge con 8 Tab senza il salto (salta, logo, 5 voci, comando)', n === 8, `${n} Tab`);
  const anello = await p.evaluate(() => { const s = getComputedStyle(document.activeElement); return {w: s.outlineWidth, st: s.outlineStyle, off: s.outlineOffset}; });
  ok('tastiera: il focus ha un anello pieno di 3 px', anello.st === 'solid' && anello.w === '3px', JSON.stringify(anello));
  await p.screenshot({path: `${out}/tastiera-2-comando.png`, clip: {x: 700, y: 360, width: 600, height: 130}});
  // con il salto: salta, Invio, Tab → il comando principale
  await p.reload({waitUntil: 'networkidle'});
  await p.keyboard.press('Tab'); await p.keyboard.press('Enter'); await p.keyboard.press('Tab');
  const dopo = await p.evaluate(() => document.activeElement.textContent.trim());
  ok('tastiera: con il salto bastano Tab, Invio, Tab per arrivare a «Ascolta Giulia»', /Ascolta Giulia/.test(dopo), dopo);
  await ctx.close();
}
// 2. Movimento ridotto: durate a zero, nessuna animazione infinita
for (const ridotto of [false, true]) {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, reducedMotion: ridotto ? 'reduce' : 'no-preference'}); const p = await ctx.newPage();
  await p.goto(U('stato/'), {waitUntil: 'networkidle'});
  const d = await p.evaluate(() => { const b = document.querySelector('.nav a'); const f = document.querySelector('.frase') || document.querySelector('.percorso a');
    const det = document.createElement('details'); det.className = 'dettagli'; det.innerHTML = '<summary>x</summary><div class="dettagli__corpo">y</div>'; document.body.appendChild(det);
    const c = det.querySelector('.dettagli__corpo'); return {transizione: getComputedStyle(document.querySelector('a')).transitionDuration, apertura: getComputedStyle(c).animationDuration,
      infinite: document.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().iterations === Infinity).length}; });
  if (ridotto) ok('movimento ridotto: transizioni e apertura a 0 ms', /^0s/.test(d.transizione) && d.apertura === '0s', JSON.stringify(d));
  else ok('movimento normale: transizione 0,1 s e apertura 0,12 s', /^0\.1s/.test(d.transizione) && d.apertura === '0.12s', JSON.stringify(d));
  ok(`${ridotto ? 'movimento ridotto' : 'movimento normale'}: nessuna animazione infinita`, d.infinite === 0, `${d.infinite}`);
  await ctx.close();
}
// 3. Stampa: navigazione e comandi nascosti, colori a nero
{
  const ctx = await browser.newContext({viewport: {width: 1100, height: 900}}); const p = await ctx.newPage();
  await p.goto(U('installa/'), {waitUntil: 'networkidle'});
  await p.emulateMedia({media: 'print'});
  const d = await p.evaluate(() => ({nav: getComputedStyle(document.querySelector('.nav')).display, percorso: getComputedStyle(document.querySelector('.percorso')).display, copia: getComputedStyle(document.querySelector('.comando .btn')).display,
    sfondo: getComputedStyle(document.body).backgroundColor, testo: getComputedStyle(document.body).color, indice: getComputedStyle(document.querySelector('.indice-pagina')).display}));
  ok('stampa: navigazione, tappe, indice e pulsante «Copia» nascosti', d.nav === 'none' && d.percorso === 'none' && d.copia === 'none' && d.indice === 'none', JSON.stringify(d));
  ok('stampa: sfondo bianco e testo nero', d.sfondo === 'rgb(255, 255, 255)' && d.testo === 'rgb(0, 0, 0)', `${d.sfondo} ${d.testo}`);
  if (motore === 'chromium') await p.pdf({path: `${out}/installa-stampa.pdf`, format: 'A4'});
  await ctx.close();
}
// 4. Colori forzati: bordi presenti su bottoni e cartellini
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, forcedColors: 'active'}); const p = await ctx.newPage();
  await p.goto(U(''), {waitUntil: 'networkidle'});
  const d = await p.evaluate(() => ({btn: getComputedStyle(document.querySelector('.btn--primario')).borderTopWidth, col: getComputedStyle(document.querySelector('.stato__col')).borderTopStyle,
    colNP: getComputedStyle(document.querySelector('.stato__col[data-tipo="non-provato"]')).borderTopStyle, colNE: getComputedStyle(document.querySelector('.stato__col[data-tipo="non-esiste"]')).borderTopStyle}));
  ok('colori forzati: bottone primario con bordo di 3 px e tre stili di bordo per le tre colonne', d.btn === '3px' && d.col === 'solid' && d.colNP === 'dashed' && d.colNE === 'dotted', JSON.stringify(d));
  await ctx.close();
}
// 5. Filtro dell'Aiuto: solo le frasi della finestra si filtrano; i tre casi restano; a zero risultati il messaggio rimanda a loro
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}}); const p = await ctx.newPage();
  await p.goto(U('aiuto/'), {waitUntil: 'networkidle'});
  const stato = () => p.locator('.filtro__stato').textContent();
  const vis = sel => p.locator(sel + ':visible').count();
  ok('filtro: all\'inizio dice «Tutte le frasi.» e mostra le 12 frasi', /Tutte le frasi/.test(await stato()) && await vis('[data-gruppo-frasi] .scheda-frase') === 12, await stato());
  await p.fill('#cerca-frase', 'curl'); await p.waitForTimeout(100);
  const nc = await vis('[data-gruppo-frasi] .scheda-frase');
  ok('filtro: «curl» restringe l\'elenco alle frasi che ne parlano', nc >= 1 && nc <= 2 && await vis('#f-curl') === 1, `${nc}: ${await stato()}`);
  ok('filtro: il numero detto è quello delle voci dell\'indice', Number((await stato()).match(/\d+/)?.[0] || 1) === await vis('.indice-frasi li'), `${await stato()} / ${await vis('.indice-frasi li')}`);
  await p.fill('#cerca-frase', 'pipewire'); await p.waitForTimeout(100);
  ok('filtro: «pipewire» trova la frase che ne parla', await vis('[data-gruppo-frasi] .scheda-frase') === 1 && await vis('#f-senza-microfono') === 1, await stato());
  await p.fill('#cerca-frase', 'microfono'); await p.waitForTimeout(100);
  const nm = await vis('[data-gruppo-frasi] .scheda-frase');
  ok('filtro: «microfono» cerca anche dentro le spiegazioni e trova più frasi', nm >= 3 && String(nm) === (await stato()).match(/\d+/)[0], `${nm}: ${await stato()}`);
  ok('filtro: i tre casi «La mia frase non c\'è» restano sempre visibili', await vis('#non-compare') + await vis('#non-mi-sentono') + await vis('#a-scatti') === 3);
  await p.fill('#cerca-frase', 'zzzxyz'); await p.waitForTimeout(100);
  ok('filtro: senza risultati il messaggio rimanda ai tre casi, che sono visibili', /tre casi qui sotto/.test(await stato()) && await vis('#non-compare') === 1 && await vis('#non-mi-sentono') === 1 && await vis('#a-scatti') === 1, await stato());
  ok('filtro: senza risultati non restano titoli senza contenuto (nessun titolo «Le frasi della finestra» visibile)', await vis('#frasi-titolo') === 0 && await vis('.indice-frasi') === 0 && await vis('#mia-frase') === 1);
  await p.screenshot({path: `${out}/filtro-nessun-risultato.png`, clip: {x: 140, y: 150, width: 1000, height: 700}});
  await p.fill('#cerca-frase', 'senti anche'); await p.waitForTimeout(100);
  ok('filtro: «senti anche» (parole chiave) trova «Nessuna chiamata…»', await vis('#f-nessuna-chiamata') === 1, await stato());
  await p.fill('#cerca-frase', ''); await p.waitForTimeout(100);
  ok('filtro: svuotato torna a tutte le 12 frasi', /Tutte le frasi/.test(await stato()) && await vis('[data-gruppo-frasi] .scheda-frase') === 12 && await vis('#frasi-titolo') === 1, `${await vis('[data-gruppo-frasi] .scheda-frase')}`);
  await ctx.close();
}
// 5b. Scelta della distribuzione (Installa): con script una sola, senza script tutte
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}}); const p = await ctx.newPage();
  await p.goto(U('installa/'), {waitUntil: 'networkidle'});
  const vis = sel => p.locator(sel + ':visible').count();
  ok('scelta distribuzione: all\'inizio sono visibili tutte e quattro le sezioni', await vis('section.sistema') === 4);
  await p.locator('.scelta-sistema__indice a[href="#fedora"]').click(); await p.waitForTimeout(150);
  const chiavi = await p.evaluate(() => [...document.querySelectorAll('[data-sistema]')].filter(e => e.offsetParent !== null).map(e => e.getAttribute('data-sistema')));
  ok('scelta distribuzione: scegliendo Fedora restano in vista solo i suoi blocchi nei passi 1-3', chiavi.length >= 3 && chiavi.every(c => c === 'fedora'), chiavi.join(','));
  ok('scelta distribuzione: il comando di Fedora è visibile e quello di apt no', await vis('code:has-text("sudo dnf install")') === 1 && await vis('code:has-text("sudo apt install ./")') === 0);
  await p.screenshot({path: `${out}/scelta-fedora.png`, clip: {x: 140, y: 0, width: 1160, height: 900}});
  await p.locator('[data-sistema-tutte]').click(); await p.waitForTimeout(100);
  ok('scelta distribuzione: «Mostra tutte» le rimette in vista', await vis('section.sistema') === 4 && await vis('code:has-text("sudo apt install ./")') === 1);
  const ctx2 = await browser.newContext({viewport: {width: 1440, height: 900}, javaScriptEnabled: false}); const q = await ctx2.newPage();
  await q.goto(U('installa/'), {waitUntil: 'networkidle'});
  ok('scelta distribuzione: senza JavaScript restano visibili tutte le sezioni e nessun pulsante «Mostra tutte»', await q.locator('section.sistema:visible').count() === 4 && await q.locator('[data-sistema-tutte]:visible').count() === 0);
  await ctx2.close(); await ctx.close();
}
// 6. 404 con stato 404 e contenuto del sito; tema scuro
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}}); const p = await ctx.newPage();
  const r = await p.goto(U('non-c-e/niente'), {waitUntil: 'networkidle'});
  ok('404: stato HTTP 404 e pagina del sito con stile', r.status() === 404 && /Questa pagina non c'è/.test(await p.locator('h1').textContent()) && (await p.evaluate(() => getComputedStyle(document.body).backgroundColor)) === 'rgb(248, 246, 240)', `${r.status()}`);
  const link = await p.locator('main a').first().getAttribute('href');
  await p.locator('main a').first().click(); await p.waitForLoadState('networkidle');
  ok('404: il primo collegamento porta alla pagina iniziale', new URL(p.url()).pathname === '/kalliope/', p.url());
  await ctx.close();
}
// 7. Banner del sistema con Windows, macOS, telefono
for (const [nome, ua, plat] of [['windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150.0 Safari/537.36', 'Win32'], ['macos', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18 Safari/605.1.15', 'MacIntel'], ['telefono', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148', 'iPhone'], ['linux', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/150.0 Safari/537.36', 'Linux x86_64']]) {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, userAgent: ua}); const p = await ctx.newPage();
  await p.addInitScript(pl => Object.defineProperty(navigator, 'platform', {get: () => pl}), plat);
  await p.goto(U(''), {waitUntil: 'networkidle'});
  const visibile = await p.locator('[data-banner-sistema]').isVisible();
  if (visibile) { const r = await p.locator('[data-banner-sistema]').boundingBox(); const c = await p.locator('.apertura').boundingBox(); ok(`avviso sul sistema: ${nome} sta dentro la colonna del contenuto`, r.x >= c.x - 1 && r.x + r.width <= c.x + c.width + 1, `${Math.round(r.x)}-${Math.round(r.x + r.width)} su ${Math.round(c.x)}-${Math.round(c.x + c.width)}`); }
  ok(`avviso sul sistema: ${nome} ${nome === 'linux' ? 'non compare' : 'compare'}`, visibile === (nome !== 'linux'), `${visibile}`);
  if (nome === 'windows') { await p.screenshot({path: `${out}/avviso-windows.png`, clip: {x: 0, y: 0, width: 1440, height: 260}}); await p.locator('[data-banner-chiudi]').click(); ok('avviso sul sistema: «Chiudi» lo nasconde', !(await p.locator('[data-banner-sistema]').isVisible())); }
  await ctx.close();
}
// 8. Copia del comando (permessi degli appunti solo in Chromium)
if (motore === 'chromium') {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, permissions: ['clipboard-read', 'clipboard-write']}); const p = await ctx.newPage();
  await p.goto(U('installa/'), {waitUntil: 'networkidle'});
  await p.locator('.comando .btn').first().click(); await p.waitForTimeout(200);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  ok('copia: il comando copiato è quello scritto nel blocco', /^sha256sum kalliope-/.test(clip), clip);
  ok('copia: «Copiato.» compare a parole', /Copiato/.test(await p.locator('.comando__stato').first().textContent()));
  await ctx.close();
}
// 9. Nessuna richiesta a terzi, nessun cookie su tutte le pagine
{
  const ctx = await browser.newContext(); const p = await ctx.newPage(); const esterni = new Set();
  p.on('request', r => { const u = new URL(r.url()); if (/^https?:$/.test(u.protocol) && u.host !== new URL(base).host) esterni.add(u.host); });
  for (const u of ['', 'ascolta/', 'stato/', 'installa/', 'riunione/', 'aiuto/', 'non-ancora/', 'sistema/', 'sistema/ricerca/']) await p.goto(U(u), {waitUntil: 'networkidle'});
  const cookie = await ctx.cookies();
  ok('rete: nessuna richiesta fuori dal dominio del sito e nessun cookie', esterni.size === 0 && cookie.length === 0, [...esterni].join(',') + ' ' + cookie.length);
  await ctx.close();
}
// 10. Collegamenti isolati su una riga: bersaglio di almeno 44 px di altezza (RG9)
{
  const ctx = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: motore !== 'firefox'}); const p = await ctx.newPage();
  for (const [u, sel] of [['', '.stato__piede a, .apertura__altre a, .voce__file a, .collegamento-forte'], ['ascolta/', '.voce__file a'], ['stato/', '.avanti a']]) {
    await p.goto(U(u), {waitUntil: 'networkidle'});
    const alt = await p.evaluate(s => [...document.querySelectorAll(s)].filter(e => e.getClientRects().length).map(e => Math.round(e.getBoundingClientRect().height)), sel);
    ok(`bersagli: i collegamenti isolati di «${u || 'home'}» sono alti almeno 44 px`, alt.length > 0 && alt.every(h => h >= 44), alt.join(','));
  }
  await ctx.close();
}
writeFileSync(`${out}/esiti-stati-${motore}.json`, JSON.stringify(esiti, null, 1));
await browser.close();
process.exit(esiti.every(e => e.ok) ? 0 : 1);
