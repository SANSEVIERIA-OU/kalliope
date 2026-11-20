// Gli stati del segno nella barra (incarico L-3), guardati come li vede la persona: senza JavaScript, con «riduci movimento», con la tastiera
// (a ritmo di persona e in fretta), con il puntatore, con un fotogramma che tarda (scheda in secondo piano), dopo la ricarica e il ritorno indietro.
// Uso: node stati.mjs <indirizzo della home> <indirizzo di una pagina senza voce propria (non ancora)> <cartella delle foto>   (esce 1 se un controllo non torna)
// Le prove che mandano gli eventi della voce a mano o durano più dell'arrivo (3–5 e 7) stanno sulla seconda pagina: la home parla da sola, all'arrivo, e confonderebbe la misura.
import {mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const pw = await import(pathToFileURL(process.env.PLAYWRIGHT).href); const chromium = pw.chromium || pw.default.chromium;
const [url, urlMuta, cart] = process.argv.slice(2);
mkdirSync(cart, {recursive: true});
const b = await chromium.launch({headless: true});
const errori = [], note = [];
const ok = (cond, msg) => { if (!cond) errori.push(msg); };
const x = p => p.evaluate(() => { const f = document.querySelector('.barra .m-fronte'); const m = f && /translate\(([-\d.]+)/.exec(f.getAttribute('transform') || ''); return f ? (m ? +m[1] : 0) : null; });
const barra = (p, nome) => p.screenshot({path: `${cart}/${nome}.png`, clip: {x: 0, y: 0, width: 520, height: 80}});
const nuova = async (opz = {}) => { const ctx = await b.newContext({viewport: {width: 1440, height: 900}, ...opz}); const p = await ctx.newPage(); const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => { if (m.type() === 'error') err.push(m.text()); }); return {ctx, p, err}; };

// 1. senza JavaScript: il segno c'è, a riposo, e la barra non ha niente di rotto
{ const {ctx, p, err} = await nuova({javaScriptEnabled: false}); await p.goto(url); await p.waitForTimeout(800);
  const v = await p.evaluate(() => { const s = document.querySelector('.barra .m-segno'); const r = s.getBoundingClientRect(); return {w: r.width, h: r.height, fronti: [...s.querySelectorAll('.m-fronte')].map(f => f.getAttribute('transform'))}; });
  ok(v.w === 36 && v.h === 36 && v.fronti.every(t => t === null), `senza JavaScript il segno non è a riposo o non è 36×36: ${JSON.stringify(v)}`);
  await barra(p, 'senza-javascript'); await ctx.close(); }

// 2. con «riduci movimento»: fermo, a riposo, anche dopo il gesto del puntatore
{ const {ctx, p, err} = await nuova({reducedMotion: 'reduce'}); await p.goto(url); await p.waitForTimeout(800);
  await p.hover('.barra .marchio'); await p.waitForTimeout(900);
  ok(await x(p) === 0, 'con «riduci movimento» il segno si muove al passaggio del puntatore');
  await p.evaluate(() => document.dispatchEvent(new CustomEvent('kalliope:voce', {detail: {stato: 'parla', frazione: 0.6}}))); await p.waitForTimeout(700);
  ok(await x(p) === 0, 'con «riduci movimento» il segno segue la voce');
  await barra(p, 'ridotto'); await ctx.close(); }

// 3. la tastiera: Tab porta il fuoco sul segno (anello visibile), il gesto parte e torna a riposo; a ritmo di persona e in fretta
for (const [nome, pausa] of [['lento', 700], ['veloce', 0]]) {
  const {ctx, p, err} = await nuova(); await p.goto(urlMuta); await p.waitForTimeout(800);
  await p.keyboard.press('Tab'); await p.waitForTimeout(pausa);   // il collegamento «Vai al contenuto»
  await p.keyboard.press('Tab'); await p.waitForTimeout(pausa ? pausa : 60);
  const f = await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return {classe: a.className, outline: cs.outlineStyle + ' ' + cs.outlineWidth, segnoDentro: !!a.querySelector('.m-segno')}; });
  ok(f.classe.includes('marchio') && f.segnoDentro, `Tab ${nome}: il secondo fuoco non è il marchio (${f.classe})`);
  ok(!f.outline.startsWith('none'), `Tab ${nome}: il marchio col fuoco non ha l'anello (${f.outline})`);
  let durante = 0;   // il gesto si guarda mentre accade: il massimo del fronte nel primo secondo e mezzo
  for (let i = 0; i < 30; i++) { durante = Math.max(durante, await x(p)); if (i === 8 && nome === 'lento') await barra(p, 'tastiera-gesto'); await p.waitForTimeout(50); }
  ok(durante > 50, `Tab ${nome}: il gesto non parte (fronte al massimo ${durante})`);
  await p.waitForTimeout(2500);
  ok(Math.abs(await x(p)) < 0.5, `Tab ${nome}: dopo il gesto il segno non è a riposo (${await x(p)})`);
  ok(err.length === 0, `Tab ${nome}: errori ${err.join(' | ')}`);
  await ctx.close();
}

// 4. il puntatore ripetuto in fretta: non si accumulano gesti, torna a riposo
{ const {ctx, p, err} = await nuova(); await p.goto(urlMuta); await p.waitForTimeout(800);
  for (let i = 0; i < 6; i++) { await p.mouse.move(700, 400); await p.mouse.move(100, 36); await p.waitForTimeout(90); }
  await p.mouse.move(700, 400); await p.waitForTimeout(2600);
  ok(Math.abs(await x(p)) < 0.5, `il puntatore ripetuto lascia il segno a ${await x(p)}`); ok(err.length === 0, 'errori nel puntatore ripetuto'); await ctx.close(); }

// 5. un fotogramma che tarda (la scheda in secondo piano): la voce dice «finita» mentre i fotogrammi non arrivano; al ritorno il segno è a riposo, non a metà
{ const {ctx, p, err} = await nuova(); await p.goto(urlMuta); await p.waitForTimeout(800);
  await p.evaluate(() => { window.__raf = window.requestAnimationFrame; window.__caf = window.cancelAnimationFrame; window.requestAnimationFrame = f => setTimeout(() => f(performance.now()), 2500); window.cancelAnimationFrame = id => clearTimeout(id); });
  await p.evaluate(() => { for (const f of [0.2, 0.6, 1]) document.dispatchEvent(new CustomEvent('kalliope:voce', {detail: {stato: 'parla', frazione: f}})); document.dispatchEvent(new CustomEvent('kalliope:voce', {detail: {stato: 'finita'}})); });
  await p.waitForTimeout(9000);
  await p.evaluate(() => { window.requestAnimationFrame = window.__raf; window.cancelAnimationFrame = window.__caf; });
  await p.waitForTimeout(3500);
  ok(Math.abs(await x(p)) < 0.5, `dopo un fotogramma in ritardo il segno è a ${await x(p)}`); ok(err.length === 0, 'errori con i fotogrammi in ritardo'); await ctx.close(); }

// 6. ricarica e ritorno: all'arrivo il segno è sempre a riposo, qualunque cosa stesse facendo
{ const {ctx, p, err} = await nuova(); await p.goto(url); await p.waitForTimeout(800);
  await p.evaluate(() => document.dispatchEvent(new CustomEvent('kalliope:voce', {detail: {stato: 'parla', frazione: 0.9}}))); await p.waitForTimeout(1000);
  ok(await x(p) > 40, 'la voce non muove il segno prima della ricarica');
  await p.reload({waitUntil: 'load'});
  ok(await x(p) === 0, 'dopo la ricarica il segno non è a riposo');
  await p.waitForTimeout(300);
  await p.goBack().catch(() => {}); await p.goForward().catch(() => {}); await p.waitForTimeout(500);
  ok(await x(p) === 0 || await x(p) === null || Math.abs(await x(p)) < 0.5, 'dopo indietro e avanti il segno non è a riposo');
  ok(err.length === 0, 'errori dopo la ricarica'); await ctx.close(); }

// 7. una frase nuova mentre la bolla torna a riposo, e la voce interrotta
{ const {ctx, p, err} = await nuova(); await p.goto(urlMuta); await p.waitForTimeout(800);
  const d = (stato, frazione) => p.evaluate(([s, f]) => document.dispatchEvent(new CustomEvent('kalliope:voce', {detail: {stato: s, frazione: f}})), [stato, frazione]);
  await d('parla', 1); await p.waitForTimeout(1000);   // detta del tutto: sosta e ritorno
  await d('parla', 0.3); await p.waitForTimeout(900);   // una frase nuova prima che sia tornata
  const metà = await x(p); ok(metà > 5 && metà < 40, `una frase nuova: il fronte non la segue (${metà})`);
  await d('interrotta'); await p.waitForTimeout(1600);
  ok(Math.abs(await x(p)) < 0.5, `dopo «interrotta» il segno non è a riposo (${await x(p)})`);
  await d('finita'); await p.waitForTimeout(2000);
  ok(Math.abs(await x(p)) < 0.5, 'dopo «finita» senza voce il segno non è tornato a riposo'); ok(err.length === 0, 'errori nelle frasi'); await ctx.close(); }

await b.close();
if (errori.length) { console.log('NON TORNA:\n  ' + errori.join('\n  ')); process.exit(1); }
console.log('torna: senza JavaScript e con «riduci movimento» fermo a riposo; tastiera (lenta e veloce) e puntatore fanno il gesto e tornano; fotogrammi in ritardo, ricarica, ritorno, frase nuova e interruzione lasciano il segno a riposo');
