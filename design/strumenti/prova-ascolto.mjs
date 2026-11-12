/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Prova dell'ascolto in Chromium senza finestra: pulsante, barre, frase evidenziata, un solo suono per volta, movimento ridotto, errore del file.
// Uso: node design/strumenti/con-server.mjs DIR node design/strumenti/prova-ascolto.mjs CARTELLA_FOTO
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
const ok = (nome, condizione, dettaglio = '') => { esiti.push({nome, ok: !!condizione, dettaglio}); console.log((condizione ? 'OK   ' : 'FALLITO ') + nome + (dettaglio ? ' · ' + dettaglio : '')); };
const browser = await avvia();

// Il suono di Chromium senza finestra scorre più veloce del tempo reale (la presa audio è finta): si riproduce davvero il file solo in prova a parte
// (inizio, fine e eventi), e il tempo dell'interfaccia si prova con un orologio simulato che sostituisce play(), pause() e currentTime degli elementi scelti.
async function orologio(p, file) {
  await p.evaluate(f => {
    const a = document.querySelector(`.voce[data-file="${f}"] audio`); const st = {paused: true, t: 0, t0: 0, id: 0};
    Object.defineProperty(a, 'paused', {get: () => st.paused});
    Object.defineProperty(a, 'currentTime', {get: () => st.t, set: v => { st.t = v; }});
    Object.defineProperty(a, 'duration', {get: () => 9.3});
    a.play = () => { st.paused = false; st.t0 = performance.now() - st.t * 1000; st.id = setInterval(() => { st.t = (performance.now() - st.t0) / 1000; a.dispatchEvent(new Event('timeupdate')); if (st.t >= 9.3) { clearInterval(st.id); st.paused = true; a.dispatchEvent(new Event('ended')); } }, 100); a.dispatchEvent(new Event('play')); return Promise.resolve(); };
    a.pause = () => { if (st.paused) return; clearInterval(st.id); st.paused = true; a.dispatchEvent(new Event('pause')); };
  }, file);
}
async function giro(ridotto, nomeFoto) {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT', reducedMotion: ridotto ? 'reduce' : 'no-preference'});
  const p = await ctx.newPage();
  const errori = []; p.on('pageerror', e => errori.push(e.message)); p.on('console', m => { if (m.type() === 'error') errori.push(m.text()); });
  await p.goto(new URL('ascolta/', base).href, {waitUntil: 'networkidle'});
  const voci = await p.$$('.voce.potenziata');
  ok(`${nomeFoto}: tutte le sei voci potenziate`, voci.length === 6, `${voci.length}`);
  ok(`${nomeFoto}: nessun audio in riproduzione al caricamento`, await p.evaluate(() => [...document.querySelectorAll('audio')].every(a => a.paused)));
  ok(`${nomeFoto}: controlli nativi nascosti con JS`, await p.evaluate(() => [...document.querySelectorAll('.voce.potenziata audio')].every(a => getComputedStyle(a).display === 'none')));
  await orologio(p, 'giulia-2'); await orologio(p, 'marco-2');
  const g2 = p.locator('.voce[data-file="giulia-2"]');
  const bottone = g2.locator('button.btn');
  await bottone.scrollIntoViewIfNeeded();
  await p.screenshot({path: `${out}/ascolto-${nomeFoto}-0-riposo.png`, fullPage: true, clip: await clipDi(p, 'article.ascolto:nth-of-type(2)')});
  await bottone.click();
  await p.waitForTimeout(900);
  const stato1 = await leggi(p);
  await p.screenshot({path: `${out}/ascolto-${nomeFoto}-1-frase1.png`, fullPage: true, clip: await clipDi(p, 'article.ascolto:nth-of-type(2)')});
  await p.waitForTimeout(2300);
  const stato2 = await leggi(p);
  await p.screenshot({path: `${out}/ascolto-${nomeFoto}-2-frase2.png`, fullPage: true, clip: await clipDi(p, 'article.ascolto:nth-of-type(2)')});
  ok(`${nomeFoto}: dopo il clic il pulsante dice «Ferma Giulia»`, /Ferma Giulia/.test(stato1.testo), stato1.testo);
  ok(`${nomeFoto}: la prima frase è evidenziata a 0,9 s`, stato1.frase === '1', `frase ${stato1.frase}`);
  ok(`${nomeFoto}: la seconda frase è evidenziata a 3,2 s`, stato2.frase === '2', `frase ${stato2.frase}; t=${stato2.t.toFixed(1)}`);
  if (!ridotto) {
    ok(`${nomeFoto}: le barre si muovono (altezze diverse nei due istanti)`, stato1.barre !== stato2.barre && stato1.barre.replace(/,/g, '') !== '' , `${stato1.barre} → ${stato2.barre}`);
  } else {
    ok(`${nomeFoto}: con movimento ridotto le barre restano ferme`, stato1.barre.replace(/,/g, '') === '' && stato2.barre.replace(/,/g, '') === '', `${stato1.barre}|${stato2.barre}`);
    ok(`${nomeFoto}: con movimento ridotto la posizione è scritta`, /frase \d di 2 · 0:0\d \/ 0:09/.test(stato2.posizione), stato2.posizione);
  }
  // un solo suono per volta
  await p.locator('.voce[data-file="marco-2"] button.btn').click();
  await p.waitForTimeout(400);
  const attivi = await p.evaluate(() => [...document.querySelectorAll('audio')].filter(a => !a.paused).map(a => a.closest('.voce').getAttribute('data-file')));
  ok(`${nomeFoto}: un solo suono per volta`, attivi.length === 1 && /marco-2/.test(attivi[0]), attivi.join(','));
  await p.locator('.voce[data-file="marco-2"] button.btn').click();
  await p.waitForTimeout(300);
  const dopo = await leggi(p, 'marco-2');
  ok(`${nomeFoto}: «Ferma» riporta le barre alla forma dell'icona`, dopo.barre.replace(/,/g, '') === '' && /Ascolta Marco/.test(dopo.testo), `${dopo.barre}|${dopo.testo}`);
  ok(`${nomeFoto}: nessun errore di script`, errori.length === 0, errori.join(' | '));
  await ctx.close();
}
async function leggi(p, file = 'giulia-2') {
  return p.evaluate(f => {
    const v = document.querySelector(`.voce[data-file="${f}"]`);
    const a = v.querySelector('audio');
    const att = document.querySelector('.ascolto .frase.in-corso');
    return {testo: v.querySelector('button.btn').textContent, t: a.currentTime, posizione: v.querySelector('.voce__posizione').textContent,
      barre: [...v.querySelectorAll('.barre i')].map(i => i.style.getPropertyValue('--h')).join(','), frase: att ? att.getAttribute('data-frase') : ''};
  }, file);
}
async function clipDi(p, sel) { const b = await p.locator(sel).first().boundingBox(); const y = await p.evaluate(() => window.scrollY); return {x: Math.max(0, b.x - 8), y: Math.max(0, b.y + y - 8), width: Math.min(1424, b.width + 16), height: b.height + 16}; }

await giro(false, 'normale');
await giro(true, 'ridotto');

// riproduzione vera del file: inizia, arriva in fondo, finisce (il tempo reale non si misura: vedi sopra). Non in WebKit (limite dell'ambiente)
if (motore !== 'webkit') {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
  const p = await ctx.newPage(); await p.goto(new URL('ascolta/', base).href, {waitUntil: 'networkidle'});
  const r = await p.evaluate(async () => {
    const a = document.querySelector('audio[src*="marco-1"]'); const ev = [];
    ['play', 'playing', 'ended', 'error'].forEach(n => a.addEventListener(n, () => ev.push(n)));
    await a.play().catch(e => ev.push('rifiutato ' + e.name));
    await new Promise(r => { a.addEventListener('ended', r); setTimeout(r, 8000); });
    return {ev, durata: a.duration, finito: a.ended || a.currentTime === 0};
  });
  ok('riproduzione vera dell\'MP3: parte e arriva alla fine, senza errori', r.ev.includes('playing') && r.ev.includes('ended') && !r.ev.includes('error'), JSON.stringify(r));
  await ctx.close();
}
// senza JavaScript: i controlli nativi restano
{
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, javaScriptEnabled: false});
  const p = await ctx.newPage(); await p.goto(new URL('ascolta/', base).href, {waitUntil: 'networkidle'});
  const n = await p.evaluate(() => [...document.querySelectorAll('audio')].filter(a => getComputedStyle(a).display !== 'none').length);
  ok('senza JavaScript: i sei controlli nativi dell\'audio sono visibili', n === 6, `${n}`);
  await p.screenshot({path: `${out}/ascolto-senzajs.png`, fullPage: true, clip: await clipDi(p, 'article.ascolto:nth-of-type(2)')});
  await ctx.close();
}
// file non caricato: messaggio e collegamento al file (non in WebKit: senza sorgente non c'è nulla da rifiutare)
if (motore !== 'webkit') {
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
  const p = await ctx.newPage();
  await p.route('**/voce/giulia-3.mp3', r => r.abort());
  await p.goto(new URL('ascolta/', base).href, {waitUntil: 'networkidle'});
  await p.locator('.voce[data-file="giulia-3"] button.btn').click();
  await p.waitForTimeout(600);
  const msg = await p.locator('.voce[data-file="giulia-3"] .voce__messaggio').textContent();
  ok('file non caricato: compare il messaggio e il testo resta', /non riproduce/.test(msg), msg);
  await p.screenshot({path: `${out}/ascolto-file-assente.png`, fullPage: true, clip: await clipDi(p, 'article.ascolto:nth-of-type(3)')});
  await ctx.close();
}
writeFileSync(`${out}/esiti-ascolto-${motore}.json`, JSON.stringify(esiti, null, 1));
await browser.close();
process.exit(esiti.every(e => e.ok) ? 0 : 1);
