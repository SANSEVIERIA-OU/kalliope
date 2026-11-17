// Gli stati della pagina «non ancora», uno per uno, con ciò che la persona vede: foto e misure.
// Uso: PLAYWRIGHT=… node stati.mjs <cartella-sito> <uscita> <motore> <WxH> <scenario[,scenario…]> [--percorso=it/non-ancora/]
// Scenari: ascolto, errore, lento, attesa, nascosto, copia, copia-no, tentativo, tentativo-ridimensiona, tentativo-nascosto, tutti
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco, uscitaAudio} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync, readFileSync, statSync} from 'node:fs';
import http from 'node:http';
import {join, extname, resolve, dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const [cartella, uscita, motore, misura, elenco, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/non-ancora/';
const [W, H] = misura.split('x').map(Number), tel = W <= 760;
mkdirSync(uscita, {recursive: true});
const scenari = elenco === 'tutti' ? ['ascolto', 'errore', 'lento', 'attesa', 'nascosto', 'copia', 'copia-no', 'tentativo', 'tentativo-ridimensiona', 'tentativo-altezza', 'tentativo-nascosto', 'tentativo-nascosto-da-subito'] : elenco.split(',');
const esiti = [];
let scenarioCorrente = '';
// Firefox senza uscita audio (un contenitore, una macchina senza scheda: prove.md §1) dà errore a ogni suono: ciò che dipende dal suono vero non si
// può provare lì e si scrive «non verificato», non come un difetto della pagina (che mostra, giusto, il suo stato d'errore)
const senzaSuono = motore === 'firefox' && !uscitaAudio();
const dipendeDalSuono = (nome) => ['ascolto', 'lento', 'attesa', 'nascosto'].includes(scenarioCorrente) || /Riprova/.test(nome);
const ok = (nome, vero, dettaglio = '') => {
  if (!vero && senzaSuono && dipendeDalSuono(nome)) { esiti.push({nome, ok: true, nonVerificato: true, dettaglio: `Firefox senza uscita audio: ${dettaglio}`}); console.log(`NV   ${nome} · Firefox senza uscita audio, il suono non può partire`); return; }
  esiti.push({nome, ok: !!vero, dettaglio}); console.log(`${vero ? 'ok   ' : 'NO   '}${nome}${dettaglio ? ' · ' + dettaglio : ''}`);
};
const nv = (n, d = '') => { esiti.push({nome: n, ok: true, nonVerificato: true, dettaglio: d}); console.log(`NV   ${n}${d ? ' · ' + d : ''}`); };
const pausa = ms => new Promise(r => setTimeout(r, ms));

// un server proprio: serve la cartella e, per l'audio, può rallentare (attesa, lento)
const modo = {audio: 'normale', ritardo: 0, tronca: 0.4, pausaDopo: 4000};
const TIPI = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.opus': 'audio/ogg', '.woff2': 'font/woff2', '.atom': 'application/atom+xml'};
const server = http.createServer(async (req, res) => {
  let f = resolve(join(cartella, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  try { if (statSync(f).isDirectory()) f = join(f, 'index.html'); } catch { res.writeHead(404).end(); return; }
  const dati = readFileSync(f), tipo = TIPI[extname(f)] || 'application/octet-stream';
  const audio = /\/voce\/giulia-1\.(mp3|opus)$/.test(req.url);
  const r = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  const da = r && r[1] ? +r[1] : 0, a = r && r[2] ? Math.min(+r[2], dati.length - 1) : dati.length - 1;
  const intest = r ? {'content-type': tipo, 'content-range': `bytes ${da}-${a}/${dati.length}`, 'accept-ranges': 'bytes', 'content-length': a - da + 1, 'cache-control': 'no-store'} : {'content-type': tipo, 'accept-ranges': 'bytes', 'content-length': dati.length, 'cache-control': 'no-store'};
  if (audio && (modo.audio === 'errore' || (modo.audio === 'tronca' && /opus$/.test(req.url)))) { res.writeHead(404).end(); return; }   // con «tronca» l'opus manca: va sull'mp3, che si può troncare
  if (audio && modo.audio === 'ritardo') { await pausa(modo.ritardo); }
  res.writeHead(r ? 206 : 200, intest);
  if (audio && modo.audio === 'tronca') {   // un pezzo subito, il resto dopo un po': l'audio aspetta dati
    // a goccia: un primo pezzo, poi 500 byte ogni 100 ms (meno di quanto l'audio ne consuma): a metà della frase i dati finiscono
    const corpo = dati.subarray(da, a + 1);
    res.write(corpo.subarray(0, 12000));
    for (let k = 12000; k < corpo.length; k += 500) { await pausa(100); res.write(corpo.subarray(k, k + 500)); }
    res.end(); return;
  }
  res.end(dati.subarray(da, a + 1));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);

async function apri({ridotto = false, permessi = [], iniz} = {}) {
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: ridotto ? 'reduce' : 'no-preference', ...tocco(motore, tel)});
  if (permessi.length && motore === 'chromium') await ctx.grantPermissions(permessi, {origin: base});
  const errori = [];
  const p = pagina(await ctx.newPage(), errori);
  if (iniz) await p.addInitScript(iniz);
  await p.goto(base + percorso, {waitUntil: 'load'});
  await p.waitForTimeout(500); await assesta(p);
  return {ctx, p, errori};
}
const foto = (p, nome) => p.screenshot({path: `${uscita}/${nome}-${motore}-${misura}.png`});
async function allaChiusura(p) {
  await p.locator('#ascolta').scrollIntoViewIfNeeded();
  await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView({block: 'start'}));
  await p.waitForTimeout(1800); await assesta(p);
}
// ciò che si vede del comando e della riunione
const leggi = p => p.evaluate(() => {
  const bt = document.querySelector('.ascolta-ferma'), r = bt.getBoundingClientRect();
  const et = [...bt.querySelectorAll('.etichette > span')].find(s => getComputedStyle(s).visibility === 'visible');
  const link = document.querySelector('.comandi-ascolto .collegamento').getBoundingClientRect();
  const parole = [...document.querySelectorAll('.bolla-chiusa .p')];
  const bolla = document.querySelector('.bolla-chiusa');
  const nota = document.querySelector('.errore-ascolto');
  const rn = nota && nota.getBoundingClientRect();
  const tav = document.querySelector('.chiusura .tavolo').getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect();
  return {
    classi: [...bt.classList].filter(c => ['carica', 'suona', 'pausa'].includes(c)).join('') || 'fermo',
    etichetta: et ? et.textContent.trim() : null, nome: bt.getAttribute('aria-label'), largh: Math.round(r.width * 10) / 10, xLink: Math.round(link.left * 10) / 10,
    parole: parole.length, attesa: parole.filter(x => x.classList.contains('attesa')).length, detta: bolla.classList.contains('detta'),
    opacitaTesto: +getComputedStyle(parole[0] || document.querySelector('.bolla-chiusa .bolla-testo')).opacity,
    nota: nota ? {testo: nota.querySelector('p').textContent, ruolo: nota.getAttribute('role'), top: Math.round(rn.top), bottom: Math.round(rn.bottom), azioni: [...nota.querySelectorAll('button, a')].map(x => x.textContent.trim())} : null,
    fuoco: document.activeElement ? (document.activeElement.className || document.activeElement.tagName) : null,
    vista: {altezza: innerHeight, tavoloTop: Math.round(tav.top), tavoloBottom: Math.round(tav.bottom), barraBottom: Math.round(barra.bottom), bottoneBottom: Math.round(r.bottom)},
  };
});

for (const sc of scenari) {
  scenarioCorrente = sc; console.log(`\n== ${sc} · ${motore} ${misura}`);
  const {ctx, p, errori} = await apri({ridotto: sc === 'ascolto-ridotto', permessi: ['clipboard-read', 'clipboard-write']});
  try {
    if (sc === 'ascolto' || sc === 'ascolto-ridotto') {
      await allaChiusura(p);
      const prima = await leggi(p);
      ok('a riposo: «Ascolta Giulia», nessun nome speciale', prima.classi === 'fermo' && /Ascolta/.test(prima.etichetta) && prima.nome === null, JSON.stringify({et: prima.etichetta, largh: prima.largh}));
      await foto(p, `${sc}-0-riposo`);
      const albero = async () => (await p.locator('.comandi-ascolto').ariaSnapshot()).split('\n')[0];
      ok('nome accessibile del comando a riposo: «Ascolta Giulia» (le altre etichette, invisibili, non ci sono)', /button "Ascolta Giulia"$/.test(await albero()), await albero());
      await p.click('.ascolta-ferma');
      const nomiAcc = [await albero()];
      const serie = [await leggi(p)];
      await foto(p, `${sc}-1-appena-premuto`);
      for (const ms of [500, 1000, 1500, 2000, 3000, 4500]) { await p.waitForTimeout(ms === 500 ? 500 : 500); serie.push(await leggi(p)); if (ms === 1500) await foto(p, `${sc}-2-suona`); }
      // pausa e ripresa
      await p.click('.ascolta-ferma'); await p.waitForTimeout(250); const inPausa = await leggi(p); await foto(p, `${sc}-3-pausa`);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(250); const ripreso = await leggi(p);
      let fine = null;
      for (let k = 0; k < 40; k++) { await p.waitForTimeout(400); fine = await leggi(p); if (fine.classi === 'fermo') break; }
      await foto(p, `${sc}-4-fine`);
      const tutti = [prima, ...serie, inPausa, ripreso, fine];
      const larghezze = [...new Set(tutti.map(s => s.largh))], xl = [...new Set(tutti.map(s => s.xLink))];
      ok('larghezza del comando ferma fra gli stati', larghezze.length === 1, `larghezze ${larghezze} · stati ${[...new Set(tutti.map(s => s.classi + ':' + s.etichetta))].join(' | ')}`);
      ok('«Tutte le frasi» non si sposta', xl.length === 1, `x ${xl}`);
      ok('nome accessibile da premuto: carica/pausa, mai la somma delle etichette', nomiAcc.every(x => !/GiuliaCarico|PausaRiprendi/.test(x)), nomiAcc.join(' | '));
      ok('pausa: etichetta «Riprendi», nome «Riprendi»', inPausa.classi === 'pausa' && /Riprendi/.test(inPausa.etichetta) && /Riprendi/.test(inPausa.nome), JSON.stringify({e: inPausa.etichetta, n: inPausa.nome}));
      ok('ripreso: «Pausa»', ripreso.classi === 'suona' && /Pausa/.test(ripreso.etichetta), JSON.stringify({e: ripreso.etichetta, n: ripreso.nome}));
      ok('premuto: «Carico…» o già «Pausa», mai la scena a metà', ['carica', 'suona'].includes(serie[0].classi), serie[0].classi + ' ' + serie[0].etichetta);
      ok('a fine: frase detta (bolla tenue, parole nere), comando di nuovo «Ascolta Giulia»', fine.classi === 'fermo' && fine.detta && fine.attesa === 0, JSON.stringify({classi: fine.classi, detta: fine.detta, attesa: fine.attesa}));
    }
    if (sc === 'errore') {
      modo.audio = 'errore';
      await allaChiusura(p);
      const prima = await leggi(p);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(900);
      const s = await leggi(p); await foto(p, 'errore-1-messaggio');
      ok('compare il messaggio vicino al comando', !!s.nota, JSON.stringify(s.nota));
      ok('il messaggio dice «caricamento» e offre Riprova e il file', s.nota && /Non riesco a caricare/.test(s.nota.testo) && s.nota.azioni.some(x => /Riprova/.test(x)) && s.nota.azioni.some(x => /Scarica la registrazione \(Giulia, mp3\)/.test(x)), JSON.stringify(s.nota && s.nota.azioni));
      ok('ruolo alert', s.nota && s.nota.ruolo === 'alert');
      ok('il messaggio sta intero nello schermo, sotto la barra', s.nota && s.nota.top >= s.vista.barraBottom && s.nota.bottom <= s.vista.altezza, JSON.stringify({top: s.nota && s.nota.top, bottom: s.nota && s.nota.bottom, vista: s.vista}));
      ok('la frase è com\'era: tutta grigia (non detta), non detta', s.attesa === s.parole && !s.detta, JSON.stringify({parole: s.parole, attesa: s.attesa, detta: s.detta, opacita: s.opacitaTesto}));
      ok('il comando è di nuovo «Ascolta Giulia»', s.classi === 'fermo' && /Ascolta/.test(s.etichetta));
      ok('la riunione non mostra un esito che non c\'è stato (nessuna voce accesa)', await p.evaluate(() => !document.querySelector('.chiusura .riquadro.tu.parla') && !document.querySelector('.chiusura .riquadro.guarda')));
      ok('la riunione resta in vista accanto al messaggio', s.vista.tavoloBottom > s.vista.barraBottom + 40, JSON.stringify(s.vista));
      // riprova: con l'audio che torna
      modo.audio = 'normale';
      await p.click('.errore-ascolto .riprova'); await p.waitForTimeout(700);
      const r = await leggi(p); await foto(p, 'errore-2-riprova');
      ok('Riprova: il messaggio sparisce e il suono parte', !r.nota && ['carica', 'suona'].includes(r.classi), JSON.stringify({nota: !!r.nota, classi: r.classi, fuoco: r.fuoco}));
      ok('il fuoco non cade nel vuoto dopo Riprova', /ascolta-ferma|pillola/.test(String(r.fuoco)), String(r.fuoco));
    }
    if (sc === 'lento') {
      modo.audio = 'ritardo'; modo.ritardo = 7500;
      await allaChiusura(p);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(1200);
      const a = await leggi(p); await foto(p, 'lento-0-carica');
      ok('in attesa: «Carico…» e nessun messaggio prima dei 6 s', a.classi === 'carica' && /Carico/.test(a.etichetta) && !a.nota, JSON.stringify({c: a.classi, e: a.etichetta, nota: !!a.nota}));
      await p.waitForTimeout(5600);
      const b6 = await leggi(p); await foto(p, 'lento-1-messaggio');
      ok('dopo 6 s: messaggio «lento» (status) con Riprova e il file', b6.nota && b6.nota.ruolo === 'status' && /lento/.test(b6.nota.testo), JSON.stringify(b6.nota));
      ok('il messaggio «lento» sta intero nello schermo', b6.nota && b6.nota.top >= b6.vista.barraBottom && b6.nota.bottom <= b6.vista.altezza, JSON.stringify(b6.vista));
      await p.waitForTimeout(3500);
      const c = await leggi(p); await foto(p, 'lento-2-parte');
      ok('arrivato il file: il messaggio sparisce e il suono suona', !c.nota && c.classi === 'suona', JSON.stringify({nota: !!c.nota, c: c.classi}));
    }
    if (sc === 'attesa') {
      modo.audio = 'tronca'; modo.tronca = 0.5; modo.pausaDopo = 4500;
      await allaChiusura(p);
      await p.click('.ascolta-ferma');
      const visti = [];
      let fotografato = false;
      for (let k = 0; k < 130; k++) {
        await p.waitForTimeout(100); const s = await leggi(p); visti.push(s.classi + (s.nota ? '+nota' : ''));
        if (!fotografato && visti.includes('suona') && s.classi === 'carica') { fotografato = true; await foto(p, 'attesa-1-aspetta-dati'); }
        if (s.classi === 'fermo' && visti.includes('suona')) break;
      }
      const compatto = visti.filter((x, i) => i === 0 || x !== visti[i - 1]);
      console.log('stati nel tempo:', compatto.join(' → '));
      const ia = compatto.indexOf('suona');
      if (motore !== 'chromium' && !compatto.slice(Math.max(0, ia)).includes('carica')) { nv('l\'audio aspetta dati a metà: «Carico…» e poi riparte', `in ${motore} il file a goccia non lo fa mai aspettare (${compatto.join(' → ')}): provato solo in Chromium`); } else
      ok('l\'audio aspetta dati a metà: il comando torna a «Carico…» e poi il suono riparte e finisce', ia >= 0 && compatto.slice(ia).includes('carica') && compatto.slice(compatto.indexOf('carica', ia)).includes('suona'), compatto.join(' → '));
    }
    if (sc === 'nascosto') {
      await allaChiusura(p);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(2200);
      const prima = await leggi(p);
      await p.evaluate(() => { Object.defineProperty(document, 'hidden', {value: true, configurable: true}); Object.defineProperty(document, 'visibilityState', {value: 'hidden', configurable: true}); document.dispatchEvent(new Event('visibilitychange')); });
      await p.waitForTimeout(1500);
      const dopo = await leggi(p); await foto(p, 'nascosto-1-in-pausa');
      ok('con la scheda in secondo piano il suono va in pausa', prima.classi === 'suona' && dopo.classi === 'pausa', `${prima.classi} → ${dopo.classi}`);
      await p.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
      await p.waitForTimeout(300);
      await p.click('.ascolta-ferma'); await p.waitForTimeout(600);
      const ritorno = await leggi(p);
      ok('al ritorno si riprende da dove si era', ritorno.classi === 'suona' && ritorno.attesa <= dopo.attesa, JSON.stringify({attesaPrima: dopo.attesa, attesaDopo: ritorno.attesa}));
    }
    if (sc === 'copia' || sc === 'copia-no') {
      if (sc === 'copia-no') await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new DOMException('no', 'NotAllowedError')); });
      await p.locator('#quando').scrollIntoViewIfNeeded(); await p.waitForTimeout(2500); await assesta(p);
      const bt = p.locator('.copia-indirizzo');
      const visibile = await bt.isVisible();
      ok('il comando di copia c\'è', visibile);
      if (visibile) {
        await bt.click(); await p.waitForTimeout(500);
        const t = await p.evaluate(() => ({fatto: !document.querySelector('.copia-fatto').hidden, errore: !document.querySelector('.copia-errore').hidden, esito: document.querySelector('.copia-esito').getBoundingClientRect().toJSON(), vh: innerHeight}));
        await foto(p, `${sc}-1`);
        if (sc === 'copia') {
          ok('copiato: risposta «Copiato…» visibile, nessun errore', t.fatto && !t.errore, JSON.stringify(t));
          if (motore === 'chromium') ok('negli appunti c\'è l\'indirizzo della pagina senza frammento', (await p.evaluate(() => navigator.clipboard.readText())) === await p.evaluate(() => location.href.split('#')[0]));
          await bt.click(); await p.waitForTimeout(400);
          ok('premuto di nuovo: la risposta c\'è ancora (si dice a ogni pressione)', await p.evaluate(() => !document.querySelector('.copia-fatto').hidden));
        } else ok('non riuscita: risposta d\'errore con il rimedio, nessun «Copiato»', t.errore && !t.fatto, JSON.stringify(t));
        ok('la risposta sta nello schermo', t.esito.bottom <= t.vh && t.esito.top >= 0, JSON.stringify(t.esito));
      }
    }
    if (sc.startsWith('tentativo')) {
      // il tentativo si guarda sul primo schermo: la barra del microfono, «Kalliope», il tuo posto
      const stato = () => p.evaluate(() => {
        const c = document.querySelector('.chiamata-ferma'), sg = c.querySelector('.segno-scelta'), k = c.querySelector('.scelta.mancante');
        const nota = c.querySelector('.mancante-nota'), tu = c.querySelector('.riquadro.tu.assente');
        return {t: Math.round(performance.now()), classi: ['prova', 'con-segno', 'segno-via', 'segno-va', 'non-c-e'].filter(x => c.classList.contains(x)).join(' '),
          segnoOp: +getComputedStyle(sg).opacity, segnoX: Math.round(sg.getBoundingClientRect().left), urtata: k.classList.contains('urtata'), notaOp: +getComputedStyle(nota).opacity,
          scelteX: Math.round(c.querySelector('.scelta.scelto').getBoundingClientRect().left), kBordo: getComputedStyle(k).borderColor, kColore: getComputedStyle(k).color, tuUrtato: tu.classList.contains('urtato'), animazioni: sg.getAnimations().length, nascosto: document.hidden};
      });
      // lo stato finale è uno: «non c'è» scritto, il posto di «Kalliope» spento, il segno sotto «Microfono del computer» (con il tentativo finito) o
      // la scelta con il suo fondo (tentativo interrotto): sono la stessa cosa, e il confronto dei pixel lo prova
      const finale = s => (s.classi === 'prova non-c-e' || (s.classi === 'prova con-segno non-c-e' && Math.abs(s.segnoX - s.scelteX) <= 1)) && !s.urtata && s.notaOp === 1;
      const descrivi = s => `${s.classi || '—'} segno op ${s.segnoOp} x ${s.segnoX} · «non c'è» op ${s.notaOp} · urtata ${s.urtata}`;
      if (sc === 'tentativo') {
        const serie = []; const t0 = Date.now();
        // il tentativo parte a 2,4 s dall'arrivo sulla pagina: lo si segue dal caricamento (la pagina è già aperta da mezzo secondo)
        for (let k = 0; k < 70; k++) { serie.push(await stato()); await p.waitForTimeout(100); if (k === 25) await foto(p, 'tentativo-1-va'); if (k === 33) await foto(p, 'tentativo-2-sul-posto'); }
        const vista = serie.map(s => s.classi || '—').filter((x, i, a) => i === 0 || x !== a[i - 1]);
        ok('il tentativo passa per: prova → segno che va → «non c\'è» → segno che torna', vista.some(x => x.includes('segno-va')) && vista.some(x => x.includes('non-c-e')) && vista.some(x => x.includes('con-segno')), vista.join(' → '));
        const f = serie[serie.length - 1]; await foto(p, 'tentativo-3-fine');
        ok('a fine tentativo lo stato è quello finale (il segno non c\'è, «non c\'è» scritto, il posto non resta acceso)', finale(f), descrivi(f));
        ok('durante il tentativo nessun salto: il segno non resta mai senza animazione mentre è visibile', serie.every(s => s.segnoOp === 0 || s.animazioni > 0 || s.classi.includes('con-segno')), '');
      }
      if (sc === 'tentativo-ridimensiona') {
        await p.waitForTimeout(1900);   // siamo verso 2,4 s: il segno sta andando o sta per andare
        let s;
        for (let k = 0; k < 30; k++) { s = await stato(); if (s.classi.includes('segno-va')) break; await p.waitForTimeout(40); }
        const durante = s;
        // la pagina è aperta a W; ridimensionata a metà tentativo e riportata a W: ha di nuovo la sua misura, e il suo stato è quello dell'interruzione
        await p.setViewportSize({width: W + 37, height: H}); await p.waitForTimeout(150);
        await foto(p, 'tentativo-ridimensiona-1-interrotto');
        await p.setViewportSize({width: W, height: H}); await p.waitForTimeout(400);
        const dopo = await stato(); await foto(p, 'tentativo-ridimensiona-2-dopo');
        ok('il ridimensionamento a metà tentativo porta allo stato finale', finale(dopo), `durante: ${descrivi(durante)} · dopo: ${descrivi(dopo)}`);
        await p.waitForTimeout(2500); const molto = await stato();
        ok('e ci resta (nessun segno che riparte)', finale(molto), descrivi(molto));
        // lo stato finale dell'interruzione e quello del tentativo finito sono la stessa immagine (nessun pixel con scarto sopra 24 su 255: sotto, è il bordo
        // del testo e della pillola, disegnati sul segno o sul fondo della scelta)
        // (solo ciò che il tentativo tocca: la barra del microfono e il tuo posto; gli occhi di Paola, Luca e Anna battono da soli)
        const q = await ctx.newPage(); await q.setViewportSize({width: W, height: H});
        await q.goto(base + percorso, {waitUntil: 'load'}); await q.waitForTimeout(7500);
        let diversi = 0, totale = 0, righe = [];
        for (const [nome, sel] of [['barra', '.app-comandi'], ['tuo-posto', '.riquadro.tu.assente']]) {
          const fa = `${uscita}/tentativo-interrotto-${nome}-${motore}-${misura}.png`, fb = `${uscita}/tentativo-finito-${nome}-${motore}-${misura}.png`;
          await p.locator(sel).screenshot({path: fa}); await q.locator(sel).screenshot({path: fb});
          const r = spawnSync('python3', [join(dirname(fileURLToPath(import.meta.url)), 'diff-png.py'), fa, fb, '--soglia=24'], {encoding: 'utf8'});
          const m = /\((\d+) con scarto > 24\) su (\d+)/.exec(r.stdout); totale += m ? +m[2] : 1; diversi += m ? +m[1] : (r.status === 0 ? 0 : 1e9); righe.push(`${nome}: ${r.stdout.trim()}`);
        }
        await q.close();
        ok('lo stato dopo l\'interruzione è identico a quello del tentativo finito (meno di un pixel su mille con scarto > 24 su 255: solo il bordo curvo della pillola e del testo cambia)', diversi <= totale / 1000, righe.join(' · '));
      }
      if (sc === 'tentativo-altezza') {
        await p.waitForTimeout(1800);
        await p.setViewportSize({width: W, height: H - 60}); await p.waitForTimeout(200);
        const serie = []; for (let k = 0; k < 50; k++) { serie.push(await stato()); await p.waitForTimeout(100); }
        const f = serie[serie.length - 1];
        ok('cambiare solo l\'altezza (barra del browser) non interrompe il tentativo: arriva in fondo', serie.some(x => x.classi.includes('segno-va')) && finale(f), descrivi(f));
      }
      if (sc === 'tentativo-nascosto') {
        await p.waitForTimeout(1800);
        let s;
        for (let k = 0; k < 40; k++) { s = await stato(); if (s.classi.includes('segno-va') || s.classi.includes('non-c-e')) break; await p.waitForTimeout(40); }
        const prima = s;
        await p.evaluate(() => { Object.defineProperty(document, 'hidden', {value: true, configurable: true}); Object.defineProperty(document, 'visibilityState', {value: 'hidden', configurable: true}); document.dispatchEvent(new Event('visibilitychange')); });
        await p.waitForTimeout(150); const a1 = await stato();
        await p.waitForTimeout(3500); const a2 = await stato();
        ok('con la scheda in secondo piano il tentativo si ferma (stesso punto dopo 3,5 s)', a1.classi === a2.classi && a1.segnoX === a2.segnoX && a1.notaOp === a2.notaOp, `${descrivi(a1)}  |  ${descrivi(a2)}`);
        await p.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
        let fine = null;
        for (let k = 0; k < 60; k++) { await p.waitForTimeout(100); fine = await stato(); if (finale(fine)) break; }
        ok('al ritorno il tentativo riparte da dove era e arriva allo stato finale', finale(fine), descrivi(fine));
      }
      if (sc === 'tentativo-nascosto-da-subito') {
        // la pagina si apre in una scheda in secondo piano e ci si arriva dopo 5 s: il tentativo comincia da lì, non è già finito
        await p.close();
        const q = await ctx.newPage();
        await q.addInitScript(() => { Object.defineProperty(document, 'hidden', {value: true, configurable: true}); Object.defineProperty(document, 'visibilityState', {value: 'hidden', configurable: true}); });
        await q.goto(base + percorso, {waitUntil: 'load'}); await q.waitForTimeout(5000);
        const st = () => q.evaluate(() => { const c = document.querySelector('.chiamata-ferma'); return ['prova', 'con-segno', 'segno-via', 'non-c-e'].filter(x => c.classList.contains(x)).join(' '); });
        const nascosta = await st();
        ok('aperta in secondo piano, dopo 5 s il tentativo non è partito', nascosta === 'prova', nascosta);
        await q.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
        const visti = [];
        for (let k = 0; k < 60; k++) { await q.waitForTimeout(100); visti.push(await st()); }
        const comp = visti.filter((x, i) => i === 0 || x !== visti[i - 1]);
        ok('tornati in primo piano il tentativo si svolge per intero', comp.some(x => x.includes('con-segno')) && ['prova non-c-e', 'prova con-segno non-c-e'].includes(comp[comp.length - 1]), comp.join(' → '));
      }
    }
    // l'errore del file che manca è proprio quello che lo scenario «errore» provoca
    const veri = errori.filter(e => !((sc === 'errore' || sc === 'attesa') && /Failed to load resource|404|net::ERR/.test(e)));
    if (veri.length) ok('console pulita', false, veri.join(' | ')); else ok('console pulita', true);
  } catch (e) { ok(`${sc}: eccezione`, false, e.stack.split('\n').slice(0, 3).join(' / ')); }
  await ctx.close().catch(() => {});
  modo.audio = 'normale';
}
await b.close(); server.close();
writeFileSync(`${uscita}/esiti-${motore}-${misura}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length;
console.log(`\n${esiti.length - no}/${esiti.length} ok`);
process.exit(no ? 1 : 0);
