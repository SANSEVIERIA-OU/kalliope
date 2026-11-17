// Il catalogo vivo, sezione «Pagina «stato»»: si apre senza errori, si contano le schede e le prove, si provano i comandi (anche quelli che premono i comandi veri dei
// riquadri), si fotografano le schede. Uso: PLAYWRIGHT=… node catalogo.mjs <cartella-sito> <uscita> <motore> <WxH>
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore = 'chromium', misura = '1440x900'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, W <= 760)});
const errori = []; const p = pagina(await ctx.newPage(), errori);
const esiti = []; const ok = (n, v, d = '') => { esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`); };
await p.goto(base + 'design-system/catalogo/', {waitUntil: 'load'});
await p.waitForFunction(() => window.__catalogoStato, null, {timeout: 40000});
await p.waitForTimeout(1500);
const stato = await p.evaluate(() => ({cat: window.__catalogo && {errori: window.__catalogo.errori}, pagine: window.__catalogoPagine, stato: window.__catalogoStato, testo: document.querySelector('#stato-catalogo').textContent}));
ok('il catalogo principale si costruisce senza errori', stato.cat && stato.cat.errori.length === 0, JSON.stringify(stato.cat));
ok('le pagine interne si costruiscono senza errori', stato.pagine && stato.pagine.errori.length === 0, JSON.stringify(stato.pagine));
ok('la sezione «stato» si costruisce senza errori', stato.stato && stato.stato.errori.length === 0, JSON.stringify(stato.stato));
const n = await p.evaluate(() => ({schede: document.querySelectorAll('#pagina-stato .cat-scheda').length, prove: document.querySelectorAll('#pagina-stato .cat-prova').length, viva: document.querySelectorAll('#pagina-stato iframe').length, indice: [...document.querySelectorAll('#indice a')].map(a => a.textContent).join(' | '),
  titoli: [...document.querySelectorAll('#pagina-stato .cat-scheda > h3')].map(h => h.textContent), dopo: document.querySelector('#pagine-interne').nextElementSibling && document.querySelector('#pagine-interne').nextElementSibling.id}));
ok('cinque schede: riunione provata, catena, domande, varco, messaggio', n.schede === 5, `${n.schede} schede, ${n.prove} prove, ${n.viva} pagine vive: ${n.titoli.join(' | ')}`);
ok('la sezione sta nell\'indice e dopo quella delle pagine interne', /Pagina «stato»/.test(n.indice) && n.dopo === 'pagina-stato', n.dopo);
// ogni scheda ha tutte le voci della scheda del catalogo (identificatore, regola, confine, persona, provenienza) e almeno tre prove
const completa = await p.evaluate(() => [...document.querySelectorAll('#pagina-stato .cat-scheda')].map(s => ({dt: [...s.querySelectorAll('dt')].map(x => x.textContent).join(','), prove: s.querySelectorAll('.cat-prova').length})));
ok('ogni scheda ha le cinque voci e almeno cinque prove', completa.every(c => c.dt === 'Identificatore,Regola d\'uso,Non si usa,Persona e compito,Provenienza' && c.prove >= 5), JSON.stringify(completa.map(c => c.prove)));
// nessun testo o riquadro esce dalla pagina del catalogo
await p.locator('#pagina-stato').scrollIntoViewIfNeeded();
const largo = await p.evaluate(() => ({pagina: document.documentElement.scrollWidth, finestra: innerWidth}));
ok('il catalogo non scorre di lato', largo.pagina <= largo.finestra, JSON.stringify(largo));
// foto di ogni scheda (si aspetta che i riquadri vivi carichino)
const schede = p.locator('#pagina-stato .cat-scheda');
for (let i = 0; i < await schede.count(); i++) {
  await schede.nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(3500); await assesta(p);
  await schede.nth(i).screenshot({path: `${uscita}/scheda-${i + 1}-${motore}-${misura}.png`});
}
// i comandi: Riproduci (tutti), i passi del varco, i comandi che premono quelli veri dei riquadri
const bottoni = await p.evaluate(() => [...document.querySelectorAll('#pagina-stato .cat-controlli button')].map(x => x.textContent));
ok('i comandi «Riproduci» ci sono', bottoni.filter(x => x === 'Riproduci').length >= 10, `${bottoni.length} comandi`);
// il varco: scegliere un passo cambia il computer
const passi = p.locator('#pagina-stato .cat-passi button');
const nomi = await passi.allTextContents();
ok('i cinque passi del varco si scelgono', nomi.join(',') === 'tutto,testo,scarico,disco,chiudi', nomi.join(','));
for (const nome of nomi) {
  await passi.filter({hasText: new RegExp(`^${nome}$`)}).click(); await p.waitForTimeout(200);
  const r = await p.evaluate(() => { const v = document.querySelector('#pagina-stato .cat-passi + .cat-quadro .varco'); const q = document.querySelector('#pagina-stato .cat-passi + .cat-quadro .varco-passo.qui'); return {passo: v.dataset.passo, qui: q ? q.dataset.passo : null, js: !!v.closest('.js')}; });
  ok(`varco, passo «${nome}»: il computer e il passo accanto`, r.passo === nome && (nome === 'tutto' ? r.qui === null : r.qui === nome), JSON.stringify(r));
}
// i comandi del catalogo premono i comandi veri: la domanda nel riquadro a 1440 cambia la risposta
const riq = p.locator('#pagina-stato .cat-prova.intero').filter({hasText: 'le domande dal vivo, al computer'});
await riq.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500);
await riq.getByRole('button', {name: '«Chi c\'è dietro?»'}).click();
// la risposta cambia dopo la dissolvenza delle parole di prima (140 ms) in un riquadro che disegna: si aspetta che arrivi, fino a 8 s (una macchina carica, o un riquadro che il motore non disegna ancora, la fanno tardare)
const frame = await riq.locator('iframe').elementHandle().then(h => h.contentFrame());
let dentro = null;
for (let k = 0; k < 40; k++) { dentro = await frame.evaluate(() => ({chiede: document.querySelector('.domande-bolla-chiede') && document.querySelector('.domande-bolla-chiede').textContent, aperta: document.querySelector('.domanda-bottone[aria-expanded=true]') && document.querySelector('.domanda-bottone[aria-expanded=true]').textContent.trim()})); if (dentro.chiede === 'Chi c\'è dietro?') break; await p.waitForTimeout(200); }

ok('il comando del catalogo preme la domanda vera nel riquadro', dentro.chiede === 'Chi c\'è dietro?' && dentro.aperta === 'Chi c\'è dietro?', JSON.stringify(dentro));
// l'arrivo ricostruito dal catalogo finisce nello stesso stato finale della pagina
const arr = p.locator('#pagina-stato .cat-prova').filter({hasText: 'l\'arrivo, dal vivo'});
await arr.scrollIntoViewIfNeeded(); await arr.getByRole('button', {name: 'Riproduci'}).click(); await p.waitForTimeout(2000);
const durante = await p.evaluate(() => document.querySelector('#pagina-stato .cat-prova .chiamata-provata.parla') !== null);
await p.waitForTimeout(9000);
const fine = await p.evaluate(() => [...document.querySelectorAll('#pagina-stato .chiamata-provata')].some(c => c.classList.contains('fatta') && c.classList.contains('microfono-acceso') && c.classList.contains('oltre-segnato') && !c.classList.contains('parla')));
ok('«Riproduci» dell\'arrivo: la voce parla poi la scena si ferma allo stato finale', durante && fine, `durante: ${durante}, fine: ${fine}`);
// la tappa accesa dal catalogo: la cascata accende tutte le tappe
const cas = p.locator('#pagina-stato .cat-prova').filter({hasText: 'prima di arrivare, con lo script'});
await cas.scrollIntoViewIfNeeded(); await cas.getByRole('button', {name: 'Riproduci'}).click(); await p.waitForTimeout(1500);
const acc = await cas.evaluate(e => ({acceso: e.querySelectorAll('.anello.acceso').length, tutte: e.querySelectorAll('.anello').length}));
ok('«Riproduci» della catena accende tutte le tappe, a cascata', acc.acceso === acc.tutte && acc.tutte === 6, JSON.stringify(acc));
// la parentesi «non misurato» della catena intera segue i nodi (dal 1181 px)
if (W >= 1181) {
  const par = await p.evaluate(() => { const c = document.querySelector('#pagina-stato .catena'); const m = c.querySelector('.catena-misura'); return {da: c.style.getPropertyValue('--misura-da'), a: c.style.getPropertyValue('--misura-a'), h: Math.round(m.getBoundingClientRect().height), alta: Math.round(c.getBoundingClientRect().height)}; });
  ok('la parentesi «non misurato» va da un nodo all\'altro (misurata) e non è alta quanto tutta la catena', par.da && par.a && par.h > 0 && par.h < par.alta, JSON.stringify(par));
}
const veri = errori.filter(e => !/Failed to load resource.*(favicon|\.opus|\.mp3)/.test(e));
ok('console pulita', veri.length === 0, veri.join(' | '));
await b.close(); server.close();
writeFileSync(`${uscita}/esiti-catalogo-${motore}-${misura}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
