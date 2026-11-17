// La pagina «stato» messa alla prova come la usa una persona: tastiera (a due ritmi), le domande, i dettagli a richiesta, la copia che riesce e che non riesce, senza JavaScript, senza stili,
// «riduci movimento», scorrimento veloce e ritorno in su, scheda in secondo piano, ritorno da un'altra pagina, ricarica. Ogni scenario guarda ciò che si vede (posizione, opacità, stato), non solo il testo.
// Uso: PLAYWRIGHT=… node robustezza.mjs <cartella-sito> <uscita> <motore> <WxH> <scenario[,scenario…]> [--percorso=it/stato/] [--rtl]
// Scenari: tastiera, tastiera-veloce, domande, dettagli, copia, senza-js, senza-stili, senza-token, ridotto, scorrimento, secondo-piano, ritorno, ricarica, tutti
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, assesta, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync, writeFileSync} from 'node:fs';
const [cartella, uscita, motore, misura, elenco, ...opz] = process.argv.slice(2);
const percorso = opz.find(o => o.startsWith('--percorso='))?.split('=')[1] || 'it/stato/';
const rtl = opz.includes('--rtl');
const [W, H] = misura.split('x').map(Number), tel = W <= 760;
mkdirSync(uscita, {recursive: true});
const TUTTI = ['tastiera', 'tastiera-veloce', 'domande', 'dettagli', 'copia', 'senza-js', 'senza-stili', 'senza-token', 'ridotto', 'scorrimento', 'secondo-piano', 'ritorno', 'ricarica'];
const scenari = elenco === 'tutti' ? TUTTI : elenco.split(',');
const esiti = [];
const ok = (n, v, d = '') => { esiti.push({nome: n, ok: !!v, dettaglio: d}); console.log(`${v ? 'ok   ' : 'NO   '}${n}${d ? ' · ' + d : ''}`); };
const server = await servi(cartella, {porta: +process.env.PORTA || 0, fresco: true}), base = `http://127.0.0.1:${server.address().port}/`;
const b = await avvia(motore);
async function apri({ridotto = false, js = true, permessi = false, prima = null} = {}) {
  const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: ridotto ? 'reduce' : 'no-preference', javaScriptEnabled: js, ...(permessi && motore === 'chromium' ? {permissions: ['clipboard-read', 'clipboard-write']} : {}), ...tocco(motore, tel)});
  const errori = []; const p = pagina(await ctx.newPage(), errori);
  if (prima) await prima(p, ctx);
  await p.goto(base + percorso, {waitUntil: 'load'});
  return {ctx, p, errori};
}
const foto = (p, n, o = {}) => p.screenshot({path: `${uscita}/${n}-${motore}-${misura}${rtl ? '-rtl' : ''}.png`, ...o});
const nome = `${motore} ${misura}`;
// la ricarica come la fa una persona (F5): con location.reload() Firefox rimette la pagina dov'era
const ricarica = p => Promise.all([p.waitForEvent('load'), p.evaluate(() => location.reload())]);
const ferma = ms => new Promise(r => setTimeout(r, ms));

// ---------- la tastiera ----------
const descrivi = () => {
  const e = document.activeElement; if (!e || e === document.body) return null;
  const r = e.getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect();
  let op = 1; for (let n = e; n && n.nodeType === 1; n = n.parentElement) op = Math.min(op, +getComputedStyle(n).opacity);
  const rgb = c => { const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return null; const v = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return {r: v[0], g: v[1], b: v[2], a: v[3] === undefined ? 1 : v[3]}; };
  const lum = ({r, g, b}) => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  // l'anello può stare su ciò che ha il fuoco o, per una fonte (un nome dentro la sua pillola), sulla pillola intera
  const anelloEl = getComputedStyle(e).outlineStyle !== 'none' ? e : (e.closest('.fonte:has(a:focus-visible)') || e);
  const o = rgb(getComputedStyle(anelloEl).outlineColor);
  let fondo = null; for (let n = anelloEl.parentElement; n && o; n = n.parentElement) { const cs = getComputedStyle(n); let c = rgb(cs.backgroundColor); if ((!c || c.a < 0.5) && cs.backgroundImage !== 'none') { const g = /rgba?\([^)]+\)/.exec(cs.backgroundImage); c = g ? rgb(g[0]) : null; } if (c && c.a >= 0.5) { fondo = c; break; } }
  const rapporto = o && fondo ? Math.round((Math.max(lum(o), lum(fondo)) + 0.05) / (Math.min(lum(o), lum(fondo)) + 0.05) * 10) / 10 : null;
  return {nome: (e.getAttribute('aria-label') || e.textContent || e.tagName).replace(/[\u2066-\u2069]/g, '').trim().replace(/\s+/g, ' ').slice(0, 34), classe: String(e.className).slice(0, 24), tag: e.tagName.toLowerCase(), fonte: !!e.closest('.fonte'),
    top: Math.round(r.top), left: Math.round(r.left), bottom: Math.round(r.bottom), right: Math.round(r.right), opacita: op, visibilita: getComputedStyle(e).visibility,
    anello: e.matches(':focus-visible') && getComputedStyle(anelloEl).outlineStyle !== 'none' && parseFloat(getComputedStyle(anelloEl).outlineWidth) > 0, forma: parseFloat(getComputedStyle(anelloEl).borderTopLeftRadius) > 0 || anelloEl === e && e.tagName !== 'A', anelloRapporto: rapporto,
    sotto: !e.closest('.barra, .salta') && r.top < barra.bottom - 1 && r.bottom > 0, inSchermo: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, yDoc: Math.round(scrollY + r.top), y: Math.round(scrollY)};
};
async function giro(p, ritmo, max = 140) {
  const soste = [];
  await p.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); scrollTo(0, 0); });
  for (let k = 0; k < max; k++) {
    await p.keyboard.press('Tab');
    await p.waitForTimeout(ritmo > 0 ? ritmo : 15);
    const d = await p.evaluate(descrivi);
    if (!d) break;
    if (soste.length && soste[0].nome === d.nome && soste[0].classe === d.classe && k > 3) break;   // il giro è tornato al primo
    const ult = soste[soste.length - 1];
    if (ult && ult.nome === d.nome && ult.classe === d.classe && ult.yDoc === d.yDoc) break;   // Firefox senza finestra resta sull'ultimo comando invece di uscire dalla pagina
    soste.push(d);
  }
  return soste;
}

// ---------- le misure che servono a più scenari ----------
const stato = () => ({
  acceso: [...document.querySelectorAll('.catena .anello')].map(a => a.classList.contains('acceso')),
  fatta: document.querySelector('.chiamata-provata').classList.contains('fatta'),
  js: document.documentElement.classList.contains('js'),
  dettagli: [...document.querySelectorAll('.anello-dettagli, .licenze-blocco')].map(d => d.open),
  passo: document.querySelector('.varco') && document.querySelector('.varco').dataset.passo,
  scelta: ((document.querySelector('.domanda-bottone[aria-expanded=true]') || {textContent: ''}).textContent).replace(/[\u2066-\u2069]/g, ''),
  y: Math.round(scrollY)});
const aspetta = async (p, cond, arg, max = 8000) => { const t0 = Date.now(); while (Date.now() - t0 < max) { if (await p.evaluate(cond, arg)) return Date.now() - t0; await p.waitForTimeout(50); } return -1; };

for (const sc of scenari) {
  console.log(`\n== ${sc} · ${nome}${rtl ? ' · da destra a sinistra' : ''}`);
  try {
    if (sc === 'tastiera' || sc === 'tastiera-veloce') {
      const lento = sc === 'tastiera';
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(lento ? 4500 : 300);
      const soste = await giro(p, lento ? 2000 : 0);   // lento: più lungo della più lunga entrata; veloce: senza pause
      await p.waitForTimeout(2600);
      console.log('   soste:', soste.length, soste.map(s => s.nome).join(' → ').slice(0, 900));
      ok('il giro tocca ogni comando una volta, in un ordine', soste.length >= 25 && new Set(soste.map(s => s.nome + s.classe + s.yDoc)).size === soste.length, `${soste.length} soste`);
      // i comandi che la pagina ha: i collegamenti delle fonti (14 + 2 nelle licenze, 0 chiusi al telefono), le dieci domande, il pulsante di copia
      const fonti = soste.filter(s => /^README|^docs\/|\.rs$|^main|^LICENSE|^NOTICE|THIRD|^CHANGELOG|^packaging|^benchmarks/.test(s.nome));
      const domande = soste.filter(s => s.classe.startsWith('domanda-bottone'));
      ok('le dieci domande sono nell\'ordine del fuoco', domande.length === 10, `${domande.length}`);
      ok(tel ? 'al telefono le fonti dentro i dettagli chiusi non sono nell\'ordine del fuoco (restano le 13 fuori dai dettagli)' : 'le fonti si raggiungono con la tastiera (tutte le 23 collegate)', tel ? fonti.length === 13 : fonti.length === 23, `${fonti.length}: ${fonti.map(f => f.nome).join(', ')}`);
      const inPillola = soste.filter(s => s.fonte);   // i nomi dentro una pillola «fonte» (i due collegamenti del testo «L'elenco completo è nei file…» sono collegamenti del testo e hanno l'anello degli altri)
      ok('l\'anello del fuoco di ogni fonte è tondo, sta sulla pillola intera (non su un rettangolo attorno al nome) e si vede', inPillola.length === (tel ? 13 : 21) && inPillola.every(s => s.anello && s.forma), inPillola.filter(s => !(s.anello && s.forma)).map(s => s.nome).join(', ') || `${inPillola.length} nomi in pillola`);
      ok('«Copia il messaggio» è nell\'ordine del fuoco', soste.some(s => /Copia il messaggio/.test(s.nome)));
      const nonSchermo = soste.filter(s => !s.inSchermo || s.opacita < 0.99 || s.visibilita !== 'visible');
      ok(lento ? 'ogni sosta ha il comando in vista, opaco e non sotto la barra' : 'a passo svelto il giro è lo stesso', lento ? nonSchermo.length === 0 : true, nonSchermo.map(s => `${s.nome} (op ${s.opacita.toFixed(2)}, ${s.inSchermo ? 'in vista' : 'fuori vista'}, top ${s.top}, bottom ${s.bottom})`).join(', '));
      const sottoBarra = soste.filter(s => s.sotto);
      ok('nessuna sosta sta sotto la barra', sottoBarra.length === 0, sottoBarra.map(s => `${s.nome} top ${s.top}`).join(', '));
      ok('il contorno del fuoco si vede su ogni sosta', soste.every(s => s.anello), soste.filter(s => !s.anello).map(s => s.nome).join(', '));
      const deboli = soste.filter(s => s.anelloRapporto !== null && s.anelloRapporto < 1.8);
      ok('il contorno del fuoco si distingue dal fondo su cui sta (almeno 1,8 : 1 dove il fondo è pieno)', deboli.length === 0, deboli.map(s => `${s.nome} ${s.anelloRapporto}:1`).join(', ') || `${soste.filter(s => s.anelloRapporto !== null).length} soste misurate`);
      // l'ordine del fuoco è quello della pagina dall'alto in basso (nella stessa riga, dall'inizio alla fine)
      const salti = []; soste.forEach((s, i) => { const prec = soste[i - 1]; if (prec && s.yDoc < prec.yDoc - 14 && !(rtl ? s.right < prec.right - 40 : s.left > prec.left + 40) && !(s.tag === 'a' && /^barra|marchio/.test(s.classe))) salti.push(`${prec.nome} (y ${prec.yDoc}) → ${s.nome} (y ${s.yDoc})`); });
      ok('l\'ordine del fuoco va dall\'alto in basso (e da una colonna alla seguente: prima quella all\'inizio della riga)', salti.length === 0, salti.join(' | '));
      await foto(p, `${sc}-fine`);
      writeFileSync(`${uscita}/${sc}-${motore}-${misura}${rtl ? '-rtl' : ''}.json`, JSON.stringify(soste, null, 1));
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'domande') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(1500);
      await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(1500);
      const prima = await p.evaluate(() => ({bottoni: document.querySelectorAll('.domanda-bottone').length, aperte: document.querySelectorAll('.domanda-bottone[aria-expanded=true]').length, regione: document.querySelector('#domande-risposta') && document.querySelector('#domande-risposta').getAttribute('role') + '/' + document.querySelector('#domande-risposta').getAttribute('aria-live'), controls: [...document.querySelectorAll('.domanda-bottone')].every(x => x.getAttribute('aria-controls') === 'domande-risposta')}));
      ok('dieci domande, una sola aperta, la risposta è una regione che si annuncia', prima.bottoni === 10 && prima.aperte === 1 && prima.regione === 'region/polite' && prima.controls, JSON.stringify(prima));
      // tastiera: Tab fino alla quarta domanda, Invio; Spazio sulla quinta
      await p.focus('#d-adatto .domanda-bottone');
      for (let k = 0; k < 3; k++) await p.keyboard.press('Tab');
      const sulla = await p.evaluate(() => document.activeElement.closest('.domanda') && document.activeElement.closest('.domanda').id);
      ok('Tab porta alla domanda seguente', sulla === 'd-installa', sulla);
      await p.keyboard.press('Enter'); await p.waitForTimeout(1000);
      let r = await p.evaluate(() => { const a = document.activeElement, bolla = document.querySelector('#domande-risposta'), br = bolla.getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect(); return {fuoco: a.closest('.domanda') && a.closest('.domanda').id, aria: a.getAttribute('aria-expanded'), chiede: bolla.querySelector('.domande-bolla-chiede').textContent.replace(/[\u2066-\u2069]/g, ''), annuncio: document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069]/g, ''), bollaTop: Math.round(br.top), bollaBottom: Math.round(br.bottom), barra: Math.round(barra.bottom), vh: innerHeight, prec: bolla.previousElementSibling && bolla.previousElementSibling.id}; });
      ok('Invio apre la risposta, il fuoco resta sul pulsante, la risposta è annunciata', r.fuoco === 'd-installa' && r.aria === 'true' && r.chiede === 'Chi lo installa?' && /Risposta: Chi lo installa\?/.test(r.annuncio), JSON.stringify(r));
      ok(tel ? 'al telefono la bolla sta subito sotto la domanda premuta e nello schermo' : 'al computer la bolla sta in vista sotto la barra', tel ? r.prec === 'd-installa' && r.bollaBottom <= r.vh && r.bollaTop >= r.barra - 1 : r.bollaTop >= r.barra - 1 && r.bollaBottom <= r.vh, JSON.stringify(r));
      await foto(p, 'domande-invio');
      await p.keyboard.press('Tab'); await p.waitForTimeout(300);
      const dopo = await p.evaluate(() => { const a = document.activeElement; return {tag: a.tagName.toLowerCase(), nome: (a.textContent || '').trim().slice(0, 30), dentro: !!a.closest('#domande-risposta')}; });
      ok(tel ? 'al telefono Tab dalla domanda va al collegamento della risposta (è subito sotto)' : 'al computer Tab dalla domanda va alla domanda seguente (la bolla sta dopo l\'elenco)', tel ? dopo.dentro && dopo.tag === 'a' : !dopo.dentro && dopo.tag === 'button', JSON.stringify(dopo));
      // Spazio su un'altra domanda
      await p.focus('#d-costa .domanda-bottone'); await p.keyboard.press('Space'); await p.waitForTimeout(1000);
      r = await p.evaluate(() => ({chiede: document.querySelector('#domande-risposta .domande-bolla-chiede').textContent.replace(/[\u2066-\u2069]/g, ''), aperte: [...document.querySelectorAll('.domanda-bottone[aria-expanded=true]')].map(x => x.textContent.trim().replace(/[\u2066-\u2069]/g, '')), fuoco: document.activeElement.closest('.domanda') && document.activeElement.closest('.domanda').id, annuncio: document.querySelector('#annuncio').textContent.replace(/[\u2066-\u2069]/g, '')}));
      ok('Spazio cambia la risposta: una sola domanda aperta, il fuoco resta, annuncio nuovo', r.chiede === 'Quanto costa?' && r.aperte.length === 1 && r.aperte[0] === 'Quanto costa?' && r.fuoco === 'd-costa' && /Quanto costa\?/.test(r.annuncio), JSON.stringify(r));
      // la stessa domanda premuta ancora non cambia niente, e non lampeggia
      await p.keyboard.press('Enter'); await p.waitForTimeout(500);
      ok('premere la domanda già aperta non la chiude e non cambia la risposta', await p.evaluate(() => document.querySelector('.domanda-bottone[aria-expanded=true]').textContent.trim().replace(/[\u2066-\u2069]/g, '') === 'Quanto costa?' && document.querySelector('.domande-bolla-chiede').textContent.replace(/[\u2066-\u2069]/g, '') === 'Quanto costa?'));
      // ogni risposta, una dopo l'altra: la bolla comincia sotto la barra e, quando ci sta, sta tutta nello schermo (ciò che il gesto apre resta in vista)
      const tutte = [];
      for (const id of ['d-adatto', 'd-scrivere', 'd-costa', 'd-installa', 'd-dove', 'd-voce', 'd-sottotitoli', 'd-frasi', 'd-online', 'd-chi']) {
        await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(150);
        await p.click(`#${id} .domanda-bottone`); await p.waitForTimeout(1300);
        tutte.push({id, ...(await p.evaluate(() => { const r = document.querySelector('.domande-bolla').getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect().bottom; return {alta: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom), barra: Math.round(barra), vh: innerHeight}; }))});
      }
      const male = tutte.filter(x => x.top < x.barra - 1 || (x.alta <= x.vh - x.barra - 12 && x.bottom > x.vh));
      ok('ogni risposta: la bolla comincia sotto la barra e, se ci sta, sta tutta nello schermo', male.length === 0, male.map(x => `${x.id} top ${x.top} bottom ${x.bottom} alta ${x.alta} (barra ${x.barra}, schermo ${x.vh})`).join(' | ') || `${tutte.length} risposte, la più alta ${Math.max(...tutte.map(x => x.alta))} px`);
      // il messaggio dopo le domande: il collegamento porta al messaggio
      await p.click('.domande-poi a'); await p.waitForTimeout(1800);
      const m = await p.evaluate(() => { const t = document.querySelector('#inoltra-titolo').getBoundingClientRect(), barra = document.querySelector('.barra').getBoundingClientRect(); return {titolo: Math.round(t.top), barra: Math.round(barra.bottom), op: +getComputedStyle(document.querySelector('#inoltra-titolo')).opacity, bolla: +getComputedStyle(document.querySelector('.bolla-inoltra')).opacity, bollaInVista: document.querySelector('.bolla-inoltra').getBoundingClientRect().top < innerHeight - 40, hash: location.hash}; });
      ok('«Da mandare a chi ti aiuta» porta al messaggio: titolo sotto la barra, opaco, bolla visibile (se è nello schermo)', m.titolo >= m.barra - 1 && m.titolo < H && m.op === 1 && (!m.bollaInVista || m.bolla === 1), JSON.stringify(m));
      // il fuoco in un collegamento della bolla resta lì se si cambia misura
      await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(600);
      await p.focus('#d-installa .domanda-bottone'); await p.keyboard.press('Enter'); await p.waitForTimeout(900);
      let prime = null;
      for (let k = 0; k < 14; k++) {   // al telefono la bolla è subito dopo la domanda, al computer dopo l'elenco
        await p.keyboard.press('Tab'); await p.waitForTimeout(120);
        prime = await p.evaluate(() => { const a = document.activeElement; return {tag: a.tagName.toLowerCase(), dentro: !!a.closest('#domande-risposta'), href: a.getAttribute('href')}; });
        if (prime.dentro) break;
      }
      if (prime.dentro) {
        await p.setViewportSize(tel ? {width: 1000, height: H} : {width: 600, height: H}); await p.waitForTimeout(900);
        const dopoMisura = await p.evaluate(() => { const a = document.activeElement; return {tag: a.tagName.toLowerCase(), dentro: !!a.closest('#domande-risposta'), href: a.getAttribute('href')}; });
        ok('cambiando misura con il fuoco su un collegamento della risposta, il fuoco non va perso', dopoMisura.dentro && dopoMisura.href === prime.href, JSON.stringify({prime, dopoMisura}));
        await p.setViewportSize({width: W, height: H}); await p.waitForTimeout(600);
      } else console.log('   (il fuoco dopo Tab non è nel collegamento della risposta a questa misura: prova del fuoco nella bolla saltata)');
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'dettagli') {
      // I dettagli a richiesta: al telefono chiusi, al computer aperti; la scelta della persona non si perde passando da una misura all'altra
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(1200);
      const prima = await p.evaluate(stato);
      const n = prima.dettagli.length;
      ok(tel ? 'al telefono i dettagli (tre tappe, licenze, impronte) sono chiusi' : 'al computer i dettagli sono tutti aperti', tel ? prima.dettagli.every(x => !x) : prima.dettagli.every(x => x), `${n} blocchi: ${prima.dettagli.map(x => +x).join('')}`);
      const altra = tel ? {width: 1000, height: 700} : {width: 390, height: 844};
      if (tel) {
        // la persona apre i dettagli del microfono e le impronte
        await p.evaluate(() => document.querySelector('.anello[data-anello=microfono]').scrollIntoView({block: 'center'})); await p.waitForTimeout(700);
        await p.click('.anello[data-anello=microfono] .anello-dettagli > summary'); await p.waitForTimeout(500);
        await p.evaluate(() => document.querySelectorAll('.licenze-blocco')[1].scrollIntoView({block: 'center'})); await p.waitForTimeout(700);
        await p.click('.licenze-blocco:nth-of-type(2) > summary'); await p.waitForTimeout(500);
        const aperti = await p.evaluate(() => [...document.querySelectorAll('.anello-dettagli, .licenze-blocco')].map(d => +d.open).join(''));
        ok('la persona apre due blocchi al telefono', (aperti.match(/1/g) || []).length === 2, aperti);
        const scelta = aperti;
        await p.setViewportSize(altra); await p.waitForTimeout(900);
        const grande = await p.evaluate(() => [...document.querySelectorAll('.anello-dettagli, .licenze-blocco')].every(d => d.open));
        ok('passando al computer (1000 px) tutti i dettagli sono aperti', grande);
        await p.setViewportSize({width: W, height: H}); await p.waitForTimeout(900);
        const ritorno = await p.evaluate(() => [...document.querySelectorAll('.anello-dettagli, .licenze-blocco')].map(d => +d.open).join(''));
        ok('tornando al telefono restano aperti i due blocchi che la persona aveva aperto (e solo quelli)', ritorno === scelta, `prima ${scelta}, dopo ${ritorno}`);
        // chiuderne uno al telefono, passare al computer e tornare: resta chiuso
        await p.evaluate(() => document.querySelector('.anello[data-anello=microfono]').scrollIntoView({block: 'center'})); await p.waitForTimeout(600);
        await p.click('.anello[data-anello=microfono] .anello-dettagli > summary'); await p.waitForTimeout(400);
        await p.setViewportSize(altra); await p.waitForTimeout(600); await p.setViewportSize({width: W, height: H}); await p.waitForTimeout(700);
        const chiuso = await p.evaluate(() => [...document.querySelectorAll('.anello-dettagli, .licenze-blocco')].map(d => +d.open).join(''));
        ok('un blocco chiuso dalla persona resta chiuso dopo il giro computer e ritorno', chiuso.replace(/0/g, '').length === 1, chiuso);
        // la parentesi non c'è al telefono; la scritta «non misurato» non è un comando
        await foto(p, 'dettagli-telefono');
      } else {
        // al computer: il titolo delle licenze non chiude il blocco (né con il mouse né con la tastiera), le tappe non hanno il comando
        const sommari = await p.evaluate(() => ({tappe: [...document.querySelectorAll('.anello-dettagli > summary')].map(s => getComputedStyle(s).display), licenze: [...document.querySelectorAll('.licenze-blocco > summary')].map(s => s.tabIndex)}));
        ok('al computer le tappe non mostrano «I dettagli e le fonti» e il titolo delle licenze non è una sosta del fuoco', sommari.tappe.every(d => d === 'none') && sommari.licenze.every(t => t === -1), JSON.stringify(sommari));
        await p.evaluate(() => document.querySelector('#controllare .licenze').scrollIntoView({block: 'center'})); await p.waitForTimeout(700);
        await p.click('.licenze-blocco > summary h3', {force: true}).catch(() => {}); await p.waitForTimeout(400);
        ok('cliccare il titolo delle licenze al computer non chiude il blocco', await p.evaluate(() => [...document.querySelectorAll('.licenze-blocco')].every(d => d.open)));
        // dal computer al telefono e ritorno senza aver scelto niente: tutto come prima (aperti)
        await p.setViewportSize(altra); await p.waitForTimeout(900);
        const tel1 = await p.evaluate(() => [...document.querySelectorAll('.anello-dettagli, .licenze-blocco')].map(d => +d.open).join(''));
        ok('dal computer al telefono i dettagli si chiudono (nessuna scelta fatta)', /^0+$/.test(tel1), tel1);
        await p.setViewportSize({width: W, height: H}); await p.waitForTimeout(900);
        ok('e tornando al computer sono di nuovo tutti aperti', await p.evaluate(() => [...document.querySelectorAll('.anello-dettagli, .licenze-blocco')].every(d => d.open)));
        // la parentesi si rimisura quando un dettaglio cambia (al telefono): qui, dopo il giro, ha ancora le misure dei nodi
        const par = await p.evaluate(() => { const c = document.querySelector('.catena'); const m = c.querySelector('.catena-misura').getBoundingClientRect(), n1 = document.querySelector('.anello[data-anello=scrivi] .anello-nodo').getBoundingClientRect(), n2 = document.querySelector('.anello[data-anello=altri] .anello-nodo').getBoundingClientRect(); return {inizio: Math.round(m.top - (n1.top + n1.height / 2)), fine: Math.round(m.bottom - (n2.top + n2.height / 2))}; });
        ok('la parentesi «non misurato» va dal nodo di «Scrivi la frase» a quello di «Gli altri ti sentono» (a meno di 2 px) anche dopo il giro', W <= 1180 || (Math.abs(par.inizio) <= 2 && Math.abs(par.fine) <= 2), JSON.stringify(par));
      }
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'copia') {
      const via = async (copiaFinta, permessi) => {
        const {ctx, p, errori} = await apri({permessi, prima: copiaFinta ? p => p.addInitScript(copiaFinta) : null});
        await p.waitForTimeout(1200);
        return {ctx, p, errori};
      };
      const allInoltra = async p => { await p.evaluate(() => document.querySelector('#inoltra').scrollIntoView({block: 'start'})); await p.waitForTimeout(1400); };
      // 1) riesce: il testo copiato è quello della bolla più l'indirizzo che la bolla mostra, che è quello del canonical
      {
        const {ctx, p, errori} = await via(`window.__copiato = null; Object.defineProperty(navigator, 'clipboard', {value: {writeText: t => { window.__copiato = t; return Promise.resolve(); }}, configurable: true});`);
        await allInoltra(p);
        await p.click('.copia-messaggio'); await p.waitForTimeout(900);
        const r = await p.evaluate(() => ({copiato: window.__copiato, bolla: [...document.querySelectorAll('.inoltra-testo')].filter(x => x.offsetParent !== null).map(x => x.textContent.trim()).join(' ').replace(/[\u2066-\u2069]/g, ''), indirizzo: document.querySelector('.inoltra-indirizzo').textContent.trim().replace(/[\u2066-\u2069]/g, ''), canonical: document.querySelector('link[rel=canonical]').href,
          fatto: !document.querySelector('.copia-fatto').hidden, errore: document.querySelector('.copia-errore').hidden, anello: document.querySelector('.bolla-inoltra').classList.contains('copiata'), stato: document.querySelector('.inoltra-esito').getAttribute('role'),
          esitoTop: Math.round(document.querySelector('.copia-fatto').getBoundingClientRect().top), esitoBottom: Math.round(document.querySelector('.copia-fatto').getBoundingClientRect().bottom), comando: Math.round(document.querySelector('.copia-messaggio').getBoundingClientRect().bottom), vh: innerHeight, barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom), bollaTop: Math.round(document.querySelector('.bolla-inoltra').getBoundingClientRect().top)}));
        ok('la copia riesce: il testo copiato è quello della bolla e finisce con l\'indirizzo', r.copiato === `${r.bolla}\n${r.indirizzo}`, JSON.stringify(r.copiato));
        ok('l\'indirizzo mostrato, quello copiato e il canonical sono lo stesso (nella cartella della lingua)', r.indirizzo === r.canonical && r.copiato.endsWith('\n' + r.canonical) && r.indirizzo.includes(`/${percorso}`.replace(/^\/it\//, '/it/')), `${r.indirizzo} | ${r.canonical}`);
        // un indirizzo si legge sempre da sinistra a destra, anche in una pagina da destra a sinistra (la barra finale non va in testa)
        const verso = await p.evaluate(() => { const n = document.querySelector('.inoltra-indirizzo'), w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT), nodi = []; while (w.nextNode()) nodi.push(w.currentNode);
          const testo = nodi.map(x => x.textContent).join('').replace(/[\u2066-\u2069]/g, ''); const vero = (nodo, da, passo) => { for (let i = da; i >= 0 && i < nodo.textContent.length; i += passo) if (!/[\u2066-\u2069]/.test(nodo.textContent[i])) return i; return -1; };
          const rect = (nodo, i) => { const r = document.createRange(); r.setStart(nodo, i); r.setEnd(nodo, i + 1); return r.getClientRects()[0]; };
          const primo = nodi[0], ultimo = nodi[nodi.length - 1], a = rect(primo, vero(primo, 0, 1)), z = rect(ultimo, vero(ultimo, ultimo.textContent.length - 1, -1));
          return {primo: testo[0], ultimo: testo.slice(-1), aSinistra: a.top < z.top - 4 || a.left < z.left}; });
        ok('l\'indirizzo si legge da sinistra a destra: comincia con «https» e finisce con la barra', verso.primo === 'h' && verso.ultimo === '/' && verso.aSinistra, JSON.stringify(verso));
        ok('la copia riesce: la risposta compare, l\'errore no, la bolla ha l\'anello, il posto della risposta è uno stato annunciato', r.fatto && r.errore && r.anello && r.stato === 'status', JSON.stringify({fatto: r.fatto, errore: r.errore, anello: r.anello, stato: r.stato}));
        ok('la risposta sta nello schermo, sotto la barra, vicino al comando', r.esitoTop >= r.barra - 1 && r.esitoBottom <= r.vh && Math.abs(r.esitoTop - r.comando) < 140, JSON.stringify({top: r.esitoTop, bottom: r.esitoBottom, comando: r.comando, vh: r.vh, barra: r.barra}));
        await foto(p, 'copia-riuscita');
        // premere ancora: la risposta si annuncia di nuovo (sparisce e ricompare)
        await p.evaluate(() => { window.__seq = []; new MutationObserver(m => m.forEach(x => window.__seq.push(document.querySelector('.copia-fatto').hidden ? 'nascosta' : 'visibile'))).observe(document.querySelector('.copia-fatto'), {attributes: true, attributeFilter: ['hidden']}); });
        await p.click('.copia-messaggio'); await p.waitForTimeout(500);
        const seq = await p.evaluate(() => window.__seq);
        ok('premendo ancora la risposta si annuncia di nuovo (sparisce e ricompare)', seq.join(',') === 'nascosta,visibile', seq.join(','));
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      // 2) non riesce
      {
        const {ctx, p, errori} = await via(`Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.reject(new Error('no'))}, configurable: true});`);
        await allInoltra(p);
        await p.click('.copia-messaggio'); await p.waitForTimeout(900);
        const r = await p.evaluate(() => ({errore: !document.querySelector('.copia-errore').hidden, fatto: document.querySelector('.copia-fatto').hidden, anello: document.querySelector('.bolla-inoltra').classList.contains('copiata'), top: Math.round(document.querySelector('.copia-errore').getBoundingClientRect().top), bottom: Math.round(document.querySelector('.copia-errore').getBoundingClientRect().bottom), vh: innerHeight, barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom), testo: document.querySelector('.copia-errore').textContent}));
        ok('la copia non riesce: l\'errore dice cosa fare, nessuna conferma, nessun anello sulla bolla', r.errore && r.fatto && !r.anello && /seleziona il testo/.test(r.testo), JSON.stringify(r));
        ok('il messaggio d\'errore sta nello schermo per intero, sotto la barra', r.top >= r.barra - 1 && r.bottom <= r.vh, JSON.stringify(r));
        await foto(p, 'copia-non-riuscita');
        // il testo della bolla si può selezionare con un clic (user-select: all)
        await p.click('.inoltra-testo:not([hidden])', {position: {x: 20, y: 8}}).catch(() => {});
        const sel = await p.evaluate(() => getSelection().toString());
        ok('un clic sulla bolla seleziona il testo da copiare a mano (messaggio intero)', /Kalliope: scrivi una frase/.test(sel.replace(/[\u2066-\u2069]/g, '')) && sel.length > 100, sel.slice(0, 60));
        await p.waitForTimeout(100);
        // l'errore passa, poi riesce: nessuno stato rimane
        await p.evaluate(() => { Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.resolve()}, configurable: true}); });
        await p.click('.copia-messaggio'); await p.waitForTimeout(700);
        ok('dopo un errore, riprovando e riuscendo, resta solo la conferma', await p.evaluate(() => document.querySelector('.copia-errore').hidden && !document.querySelector('.copia-fatto').hidden));
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      // 3) senza appunti (il browser non li ha): niente comando, la frase per copiare a mano, la bolla si seleziona
      {
        const {ctx, p, errori} = await via(`Object.defineProperty(navigator, 'clipboard', {value: undefined, configurable: true});`);
        await allInoltra(p);
        const r = await p.evaluate(() => ({comando: getComputedStyle(document.querySelector('.copia-messaggio')).display, hidden: document.querySelector('.copia-messaggio').hidden, frase: getComputedStyle(document.querySelector('.senza-js')).display, classe: document.querySelector('.inoltra-tratto').classList.contains('senza-appunti')}));
        ok('senza appunti: il comando non c\'è e la frase per copiare a mano sì', (r.comando === 'none' || r.hidden) && r.frase !== 'none' && r.classe, JSON.stringify(r));
        await foto(p, 'copia-senza-appunti');
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
      // 4) gli appunti veri (Chromium con il permesso): il testo, davvero
      if (motore === 'chromium') {
        const {ctx, p, errori} = await via(null, true);
        await allInoltra(p);
        await p.click('.copia-messaggio'); await p.waitForTimeout(700);
        const letto = await p.evaluate(() => navigator.clipboard.readText());
        const ind = await p.evaluate(() => document.querySelector('.inoltra-indirizzo').textContent.trim().replace(/[\u2066-\u2069]/g, ''));
        ok('con gli appunti veri il testo copiato finisce con l\'indirizzo mostrato e non ha segni di verso', letto.endsWith('\n' + ind) && !/[⁦-⁩]/.test(letto) && letto.split('\n').length === 2, JSON.stringify(letto.slice(-80)));
        ok('console pulita', errori.length === 0, errori.join(' | '));
        await ctx.close();
      }
    }
    if (sc === 'senza-js') {
      const {ctx, p, errori} = await apri({js: false});
      await p.waitForTimeout(4500);   // le entrate della prima scena sono animazioni del foglio di stile: si aspetta che finiscano
      const s = await p.evaluate(() => ({js: document.documentElement.classList.contains('js'), copia: getComputedStyle(document.querySelector('.copia-messaggio')).display, frase: getComputedStyle(document.querySelector('.senza-js')).display,
        domande: document.querySelectorAll('.domanda-bottone').length, risposte: [...document.querySelectorAll('.domanda-risponde')].filter(x => getComputedStyle(x).display !== 'none' && x.getBoundingClientRect().height > 0).length,
        dettagli: [...document.querySelectorAll('.anello-dettagli, .licenze-blocco')].every(d => d.open), sommari: [...document.querySelectorAll('.anello-dettagli > summary')].map(x => getComputedStyle(x).display),
        riquadri: [...document.querySelectorAll('.riquadro')].map(r => getComputedStyle(r).opacity).join(','), fatta: document.querySelector('.chiamata-provata').classList.contains('fatta'),
        titoli: [...document.querySelectorAll('.entra')].filter(e => +getComputedStyle(e).opacity < 0.99).length, bolla: getComputedStyle(document.querySelector('.bolla-inoltra')).opacity, bollaP: getComputedStyle(document.querySelector('.bolla-provata .bolla-testo')).opacity,
        varco: getComputedStyle(document.querySelector('.varco-finestra')).opacity + '/' + getComputedStyle(document.querySelector('.varco-disco')).opacity + '/' + getComputedStyle(document.querySelector('.varco-mic')).opacity,
        pacchi: getComputedStyle(document.querySelector('.varco-pacchi')).opacity, indirizzo: document.querySelector('.inoltra-indirizzo').textContent.trim().replace(/[\u2066-\u2069]/g, ''), larghezza: document.documentElement.scrollWidth, menuHref: document.querySelector('.pulsante-menu').getAttribute('href'),
        anelliNodi: [...document.querySelectorAll('.catena .anello.fatto .anello-nodo')].map(n => getComputedStyle(n).backgroundColor).join('|'), annelliQuota: getComputedStyle(document.querySelector('.quota i')).transform}));
      ok('senza JavaScript: niente classe «js»', !s.js);
      ok('senza JavaScript il comando di copia non c\'è e la frase per copiare a mano sì', s.copia === 'none' && s.frase !== 'none', JSON.stringify({copia: s.copia, frase: s.frase}));
      ok('ogni domanda ha la sua risposta sotto (niente comandi, dieci risposte in vista)', s.domande === 0 && s.risposte === 10, JSON.stringify({domande: s.domande, risposte: s.risposte}));
      ok(tel ? 'i dettagli sono aperti, e il titolo «I dettagli e le fonti» c\'è e funziona da solo (si chiudono con un tocco)' : 'i dettagli sono aperti e senza il comando', s.dettagli && s.sommari.every(d => tel ? d !== 'none' : d === 'none'), JSON.stringify(s.sommari));
      ok('la scena è allo stato finale: voce, tratteggio, titoli, bolle e riquadri visibili', s.fatta === false && s.riquadri.split(',').every(x => x === '1') && s.titoli === 0 && s.bolla === '1' && s.bollaP === '1', JSON.stringify({riquadri: s.riquadri, titoli: s.titoli, bolla: s.bolla, bollaP: s.bollaP}));
      ok('il computer del varco ha tutto in vista, e le impronte non si vedono (fermi)', s.varco === '1/1/1' && s.pacchi === '0', s.varco + ' pacchi ' + s.pacchi);
      ok('la catena è accesa e le quote sono piene', !/matrix\(0/.test(s.annelliQuota) && s.annelliQuota !== 'matrix(0, 0, 0, 1, 0, 0)', s.annelliQuota);
      ok('l\'indirizzo c\'è (lo scrive la costruzione), nessuno scorrimento di lato', /^https:\/\/.+\/stato\/$/.test(s.indirizzo) && s.larghezza <= W, `${s.indirizzo}, ${s.larghezza} contro ${W}`);
      await foto(p, 'senzajs-alto'); await p.evaluate(() => document.querySelector('#provato').scrollIntoView()); await p.waitForTimeout(400); await foto(p, 'senzajs-catena');
      await p.evaluate(() => document.querySelector('#inoltra').scrollIntoView()); await p.waitForTimeout(400); await foto(p, 'senzajs-inoltra');
      await ricarica(p); await p.waitForTimeout(800);   // il giro riparte dalla cima, come una persona che ricarica e preme Tab
      const tasti = await giro(p, 40, 120); ok('senza JavaScript il giro di tastiera arriva a ogni collegamento (barra, fonti, domande con i loro collegamenti, piede)', tasti.length >= 38, `${tasti.length} soste`);
      if (tel) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.pulsante-menu'); await p.waitForTimeout(500); ok('al telefono «Menu» porta al piede', await p.evaluate(() => location.hash === '#piede-sezioni'), await p.evaluate(() => location.hash)); }
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'senza-stili' || sc === 'senza-token') {
      const ctx = await b.newContext({viewport: {width: W, height: H}, ...tocco(motore, tel)});
      await ctx.route(sc === 'senza-stili' ? /\.css(\?|$)/ : /token\.css(\?|$)/, r => r.abort());
      const errori = []; const p = await ctx.newPage(); p.on('pageerror', e => errori.push(e.message));
      await p.goto(base + percorso, {waitUntil: 'load'}); await p.waitForTimeout(3500);
      const m = await p.evaluate(() => ({alto: document.documentElement.scrollHeight, svg: Math.max(...[...document.querySelectorAll('svg')].map(s => s.getBoundingClientRect().width)), pagina: !!window.__pagina, varcoViva: !!document.querySelector('.varco-scena.viva'), domande: document.querySelectorAll('.domanda-bottone').length}));
      if (sc === 'senza-stili') ok('senza i fogli di stile la pagina non diventa enorme (nessun disegno più largo di 300 px, pagina sotto i 20.000 px)', m.svg <= 300 && m.alto < 20000, JSON.stringify(m));
      else ok('senza token.css lo script riconosce che manca e la pagina si carica (il varco non parte)', m.pagina && !m.varcoViva, JSON.stringify(m));
      ok('nessun errore dello script', errori.length === 0, errori.join(' | '));
      if (sc === 'senza-token') {
        await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView()); await p.waitForTimeout(400);
        await p.click('#d-chi .domanda-bottone'); await p.waitForTimeout(900);
        ok('senza token le domande funzionano lo stesso', await p.evaluate(() => document.querySelector('.domande-bolla-chiede') && document.querySelector('.domande-bolla-chiede').textContent.replace(/[\u2066-\u2069]/g, '') === 'Chi c\'è dietro?'));
      }
      await foto(p, sc);
      await ctx.close();
    }
    if (sc === 'ridotto') {
      const {ctx, p, errori} = await apri({ridotto: true});
      await p.waitForTimeout(800);
      const s = await p.evaluate(stato);
      ok('«riduci movimento»: il primo schermo è già al suo stato finale e la catena accesa', s.fatta && s.acceso.every(x => x), JSON.stringify({fatta: s.fatta, acceso: s.acceso.join('')}));
      await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(700);
      await p.click('#d-costa .domanda-bottone'); await p.waitForTimeout(200);
      const r = await p.evaluate(() => ({op: +getComputedStyle(document.querySelector('.domande-bolla-contenuto')).opacity, chiede: document.querySelector('.domande-bolla-chiede').textContent.replace(/[\u2066-\u2069]/g, ''), animazioni: document.querySelector('.domande-bolla').getAnimations({subtree: true}).length}));
      ok('con «riduci movimento» la risposta cambia subito, senza dissolvenza', r.op === 1 && r.chiede === 'Quanto costa?' && r.animazioni === 0, JSON.stringify(r));
      await p.evaluate(() => document.querySelector('#controllare .varco-scena').scrollIntoView({block: 'start'})); await p.waitForTimeout(500);
      await p.evaluate(() => document.querySelector('.varco-passo[data-passo=scarico]').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(900);
      const v = await p.evaluate(() => ({passo: document.querySelector('.varco').dataset.passo, anim: document.querySelector('.varco-pacchi').getAnimations({subtree: true}).length, pacchi: getComputedStyle(document.querySelector('.varco-pacchi')).opacity}));
      ok('con «riduci movimento» il passo cambia, le impronte non scendono', v.passo === 'scarico' && v.anim === 0 && v.pacchi === '0', JSON.stringify(v));
      await p.evaluate(() => document.querySelector('#inoltra').scrollIntoView()); await p.waitForTimeout(700);
      await p.evaluate(() => { Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.resolve()}, configurable: true}); });
      await p.click('.copia-messaggio').catch(() => {}); await p.waitForTimeout(500);
      const c = await p.evaluate(() => ({fatto: !document.querySelector('.copia-fatto').hidden, anello: document.querySelector('.bolla-inoltra').classList.contains('copiata')}));
      ok('con «riduci movimento» la copia risponde e la bolla non fa l\'anello animato', c.fatto && !c.anello, JSON.stringify(c));
      await foto(p, 'ridotto-fine');
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'scorrimento') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(800);
      const vuoti = () => p.evaluate(() => [...document.querySelectorAll('.entra, .entra-titolo')].filter(e => { const r = e.getBoundingClientRect(); return r.top < innerHeight * 0.8 && r.bottom > 80 && r.height > 0 && +getComputedStyle(e).opacity < 0.99; }).map(e => (e.className + ' ' + (e.id || e.textContent.slice(0, 20))).slice(0, 50)));
      const spente = () => p.evaluate(() => [...document.querySelectorAll('.catena .anello')].filter(a => { const r = a.getBoundingClientRect(); return r.bottom > 80 && r.top < innerHeight && !a.classList.contains('acceso'); }).map(a => a.dataset.anello));
      // 1) un salto in fondo e la catena: tutte le tappe sono accese, anche quelle saltate sopra
      await p.keyboard.press('End'); await p.waitForTimeout(300);
      const fondo = await vuoti(); await p.waitForTimeout(1600);
      ok('saltando in fondo con End ciò che è in vista entra', (await vuoti()).length === 0, `subito: ${fondo.length} spenti`);
      await p.keyboard.press('Home'); await p.waitForTimeout(500);
      // 2) la catena non resta indietro: una scorsa veloce di tutta la pagina e poi ci si ferma sulla catena
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
      const y0 = await p.evaluate(() => Math.round(document.querySelector('#provato').getBoundingClientRect().top + scrollY));
      for (let k = 0; k < 40 && (await p.evaluate(() => scrollY)) < y0 + 2400; k++) { await p.mouse.wheel(0, H * 0.7); await p.waitForTimeout(40); }
      const t0 = Date.now();
      const quanto = await aspetta(p, () => [...document.querySelectorAll('.catena .anello')].every(a => a.classList.contains('acceso') || a.getBoundingClientRect().top > innerHeight), null, 6000);
      const dopo = await p.evaluate(stato);
      ok('dopo una scorsa veloce la catena non resta indietro: le tappe passate sono accese e quelle in vista si accendono entro un secondo', quanto >= 0 && quanto < 1000, `in ${quanto} ms; accese ${dopo.acceso.map(x => +x).join('')}`);
      // il testo delle tappe in vista si legge sempre (nessuna tappa spenta in vista per più di un attimo)
      await p.waitForTimeout(1200);
      ok('le tappe in vista sono accese e il loro testo è pieno', (await spente()).length === 0, (await spente()).join(','));
      // 3) il ritorno in su: salendo ciò che era acceso resta acceso (niente da rifare), le domande e il primo schermo sono al loro posto
      for (let k = 0; k < 30; k++) { await p.mouse.wheel(0, -H * 0.7); await p.waitForTimeout(40); }
      await p.waitForTimeout(1200);
      const su = await p.evaluate(() => ({y: Math.round(scrollY), acceso: [...document.querySelectorAll('.catena .anello')].map(a => +a.classList.contains('acceso')).join(''), titolo: +getComputedStyle(document.querySelector('#titolo')).opacity, fatta: document.querySelector('.chiamata-provata').classList.contains('fatta')}));
      ok('risalendo in cima: la catena resta accesa, il primo schermo c\'è', su.y < 50 && su.acceso === '111111' && su.titolo === 1 && su.fatta, JSON.stringify(su));
      await foto(p, 'scorri-su');
      // 4) le ancore: «Per chi è, e per chi no» e «Se devi controllare» portano al tratto, che si vede intero
      for (const [sel, titolo] of [['#comandi-apertura a[href="#per-chi"]', '#per-chi-titolo'], ['#comandi-apertura a[href="#controllare"]', '#controllare-titolo']]) {
        await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
        await p.click(sel); await p.waitForTimeout(2600);
        const a = await p.evaluate(t => { const e = document.querySelector(t).getBoundingClientRect(); return {titolo: Math.round(e.top), op: +getComputedStyle(document.querySelector(t)).opacity, barra: Math.round(document.querySelector('.barra').getBoundingClientRect().bottom), vh: innerHeight}; }, titolo);
        ok(`l'ancora ${sel.match(/#[a-z-]+"/)[0].slice(0, -1)} porta al tratto: titolo sotto la barra, opaco`, a.titolo >= a.barra - 1 && a.titolo < a.vh && a.op === 1, JSON.stringify(a));
        await foto(p, `ancora-${sel.match(/#([a-z-]+)"/)[1]}`);
      }
      // 5) il varco: una scorsa veloce attraversa i quattro passi e arriva sotto l'ultimo: il computer mostra tutto, i file non restano a metà, niente resta bloccato
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
      const yv = await p.evaluate(() => Math.round(document.querySelector('.varco-scena').getBoundingClientRect().top + scrollY));
      await p.evaluate(y => scrollTo(0, y - 100), yv); await p.waitForTimeout(600);
      for (let k = 0; k < 40; k++) { await p.mouse.wheel(0, H * 0.45); await p.waitForTimeout(35); }
      await p.waitForTimeout(2600);
      const vv = await p.evaluate(() => { const ultimo = document.querySelector('.varco-passo:last-child').getBoundingClientRect(); return {passo: document.querySelector('.varco').dataset.passo, sotto: ultimo.bottom < innerHeight * 0.42, pacchi: getComputedStyle(document.querySelector('.varco-pacchi')).opacity, animazioni: document.querySelector('.varco-pacchi').getAnimations({subtree: true}).length}; });
      ok('dopo una scorsa veloce sotto l\'ultimo passo il computer mostra tutto e le impronte non restano a metà', (vv.sotto ? vv.passo === 'tutto' : true) && vv.pacchi === '0' && vv.animazioni === 0, JSON.stringify(vv));
      // salire piano fino a ogni passo: il computer mostra quello a metà dello spazio libero
      const passi = {};
      for (const nomeP of ['testo', 'scarico', 'disco', 'chiudi']) {
        // il passo va al centro della fascia che conta: a metà schermo al computer; al telefono sotto il computer agganciato (stato.js, fascia(): lo spazio fra il 56% e il 76% dell'altezza)
        await p.evaluate(([n, alto]) => { const r = document.querySelector(`.varco-passo[data-passo=${n}]`).getBoundingClientRect(); scrollBy({top: r.top + r.height / 2 - innerHeight * alto, behavior: 'instant'}); }, [nomeP, tel ? 0.66 : 0.5]); await p.waitForTimeout(700);
        passi[nomeP] = await p.evaluate(() => document.querySelector('.varco').dataset.passo);
      }
      ok('portando ogni passo a metà dello spazio libero il computer mostra quel passo (dalla stessa posizione, in su e in giù)', ['testo', 'scarico', 'disco', 'chiudi'].every(n => passi[n] === n), JSON.stringify(passi));
      // il fuoco su un passo (Tab su una fonte) lo porta in vista: il computer segue
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'secondo-piano') {
      // la scheda va in secondo piano durante l'arrivo e durante la discesa delle impronte: l'orologio della scena si ferma e riparte, nulla resta a metà
      const {ctx, p, errori} = await apri();
      const nascondi = (v) => p.evaluate(v => { Object.defineProperty(document, 'hidden', {value: v, configurable: true}); Object.defineProperty(document, 'visibilityState', {value: v ? 'hidden' : 'visible', configurable: true}); document.dispatchEvent(new Event('visibilitychange')); }, v);
      await p.waitForTimeout(1200);
      await nascondi(true);
      await p.waitForTimeout(6000);   // più del tempo dell'arrivo (3,8 s + 0,9 s): se l'orologio non si fermasse la scena sarebbe finita
      const durante = await p.evaluate(() => ({fatta: document.querySelector('.chiamata-provata').classList.contains('fatta'), parla: document.querySelector('.chiamata-provata').classList.contains('parla'), oltre: document.querySelector('.chiamata-provata').classList.contains('oltre-segnato')}));
      ok('con la scheda in secondo piano l\'arrivo non va avanti', !durante.fatta && !durante.oltre, JSON.stringify(durante));
      await nascondi(false);
      const quando = await aspetta(p, () => document.querySelector('.chiamata-provata').classList.contains('fatta'), null, 12000);
      ok('tornando alla scheda l\'arrivo riparte da dov\'era e arriva allo stato finale', quando >= 0, `${quando} ms dopo il ritorno`);
      // durante la discesa delle impronte
      await p.evaluate(() => document.querySelector('#controllare .varco-scena').scrollIntoView({block: 'start'})); await p.waitForTimeout(500);
      await p.evaluate(() => document.querySelector('.varco-passo[data-passo=scarico]').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(500);
      await nascondi(true); await p.waitForTimeout(3500); await nascondi(false); await p.waitForTimeout(3500);
      const v = await p.evaluate(() => ({passo: document.querySelector('.varco').dataset.passo, pacchi: getComputedStyle(document.querySelector('.varco-pacchi')).opacity, anim: document.querySelector('.varco-pacchi').getAnimations({subtree: true}).length}));
      ok('con la scheda in secondo piano durante lo scarico, tornando le impronte finiscono e non restano a metà', v.passo === 'scarico' && v.pacchi === '0' && v.anim === 0, JSON.stringify(v));
      // la catena che arriva mentre la scheda è nascosta si accende quando si torna
      await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
      const {ctx: c2, p: p2} = await apri();
      await p2.evaluate(() => { Object.defineProperty(document, 'hidden', {value: true, configurable: true}); document.dispatchEvent(new Event('visibilitychange')); });
      await p2.evaluate(() => document.querySelector('.anello[data-anello=voce]').scrollIntoView({block: 'center', behavior: 'instant'})); await p2.waitForTimeout(2500);
      await p2.evaluate(() => { Object.defineProperty(document, 'hidden', {value: false, configurable: true}); document.dispatchEvent(new Event('visibilitychange')); });
      const acc = await aspetta(p2, () => document.querySelector('.anello[data-anello=voce]').classList.contains('acceso'), null, 4000);
      ok('una tappa che arriva con la scheda nascosta si accende quando si torna', acc >= 0 && acc < 2500, `${acc} ms`);
      await c2.close();
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'ritorno') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(800);
      await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(1200);
      await p.click('#d-chi .domanda-bottone'); await p.waitForTimeout(700);
      const y = await p.evaluate(() => Math.round(scrollY));
      await p.evaluate(() => document.querySelector('.domande-poi a').click()); await p.waitForTimeout(1200);
      await p.click('.inoltra-tratto .comandi-inoltra a[href$="installa/"]'); await p.waitForLoadState('load'); await p.waitForTimeout(500);
      ok('il collegamento porta alla pagina Installa', /installa/.test(p.url()), p.url());
      await p.goBack({waitUntil: 'load'}); await p.waitForTimeout(2800);
      const r = await p.evaluate(() => { return {url: location.pathname, js: document.documentElement.classList.contains('js'), y: Math.round(scrollY), titolo: +getComputedStyle(document.querySelector('#inoltra-titolo')).opacity, titoloInVista: (r => r.bottom > 0 && r.top < innerHeight)(document.querySelector('#inoltra-titolo').getBoundingClientRect()), bolla: +getComputedStyle(document.querySelector('.bolla-inoltra')).opacity, bollaInVista: (r => r.bottom > 0 && r.top < innerHeight)(document.querySelector('.bolla-inoltra').getBoundingClientRect()), bottone: !document.querySelector('.copia-messaggio').hidden, esito: document.querySelector('.copia-fatto').hidden && document.querySelector('.copia-errore').hidden, scelta: document.querySelector('.domanda-bottone[aria-expanded=true]').textContent.trim().replace(/[\u2066-\u2069]/g, ''), fatta: document.querySelector('.chiamata-provata').classList.contains('fatta'), acceso: [...document.querySelectorAll('.catena .anello')].map(a => +a.classList.contains('acceso')).join('')}; });
      ok('tornando indietro si è dove si era, il messaggio si vede e la copia è come all\'arrivo (nessuna risposta vecchia)', r.js && (!r.titoloInVista || r.titolo === 1) && (!r.bollaInVista || r.bolla === 1) && r.bottone && r.esito, JSON.stringify(r));
      // la catena non è mai stata vista: risalendo, ciò che arriva in vista si accende e si legge (le tappe sopra, saltate, si accendono ferme)
      for (let k = 0; k < 40 && (await p.evaluate(() => document.querySelector('#provato').getBoundingClientRect().bottom)) > H * 0.5; k++) { await p.mouse.wheel(0, -H * 0.6); await p.waitForTimeout(40); }
      await p.waitForTimeout(1500);
      const su = await p.evaluate(() => ({acceso: [...document.querySelectorAll('.catena .anello')].filter(a => { const r = a.getBoundingClientRect(); return r.bottom > 80 && r.top < innerHeight; }).every(a => a.classList.contains('acceso')), testi: [...document.querySelectorAll('.catena .anello .anello-nome')].filter(n => { const r = n.getBoundingClientRect(); return r.bottom > 80 && r.top < innerHeight; }).every(n => +getComputedStyle(n).opacity === 1)}));
      ok('tornando indietro e risalendo alla catena le tappe in vista si accendono e si leggono', su.acceso && su.testi, JSON.stringify(su));
      await foto(p, 'ritorno');
      ok('dopo il ritorno la copia funziona di nuovo', await (async () => { await p.evaluate(() => { Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.resolve()}, configurable: true}); }); await p.click('.copia-messaggio'); await p.waitForTimeout(600); return p.evaluate(() => !document.querySelector('.copia-fatto').hidden); })());
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
    if (sc === 'ricarica') {
      const {ctx, p, errori} = await apri();
      await p.waitForTimeout(800);
      // a metà della catena: la ricarica porta lì, e ciò che è in vista si legge e si accende
      await p.evaluate(() => document.querySelector('.anello[data-anello=microfono]').scrollIntoView({block: 'center', behavior: 'instant'})); await p.waitForTimeout(2600);
      const y = await p.evaluate(() => Math.round(scrollY));
      await ricarica(p); await p.waitForTimeout(3200);
      const r = await p.evaluate(() => { const a = document.querySelector('.anello[data-anello=microfono]'); return {y: Math.round(scrollY), nome: +getComputedStyle(a.querySelector('.anello-nome')).opacity, testo: +getComputedStyle(a.querySelector('.cifra-detto')).opacity, acceso: [...document.querySelectorAll('.catena .anello')].map(x => +x.classList.contains('acceso')).join(''), parentesi: document.querySelector('.catena').style.getPropertyValue('--misura-a'), js: document.documentElement.classList.contains('js'), titolo: +getComputedStyle(document.querySelector('#provato-titolo')).opacity}; });
      ok('ricaricando a metà catena si resta lì, la tappa in vista si legge, le tappe sopra e quella in vista sono accese', Math.abs(r.y - y) < 60 && r.nome === 1 && r.testo === 1 && /^1111/.test(r.acceso) && r.js, JSON.stringify({prima: y, ...r}));
      await foto(p, 'ricarica-meta');
      // ricarica durante l'arrivo (a 2,8 s): riparte da capo e arriva allo stato finale
      await p.evaluate(() => scrollTo(0, 0)); await ricarica(p); await p.waitForTimeout(2800); await ricarica(p); await p.waitForTimeout(9000);
      const t = await p.evaluate(() => ({c: [...document.querySelector('.chiamata-provata').classList].join(' '), nota: getComputedStyle(document.querySelector('.provato-nota')).opacity}));
      ok('ricaricando durante l\'arrivo la pagina riparte da capo e arriva allo stato finale', /fatta/.test(t.c) && /oltre-segnato/.test(t.c) && !/parla/.test(t.c) && t.nota === '1', JSON.stringify(t));
      // ricarica con la risposta scelta e con l'indirizzo: tutto riparte come all'arrivo
      await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(900);
      await p.click('#d-online .domanda-bottone'); await p.waitForTimeout(600);
      await ricarica(p); await p.waitForTimeout(2200);
      ok('ricaricando con una domanda scelta si riparte dalla prima (nessuna scelta vecchia)', await p.evaluate(() => document.querySelector('.domanda-bottone[aria-expanded=true]').textContent.trim().replace(/[\u2066-\u2069]/g, '') === 'È per chi non può parlare?'));
      ok('console pulita', errori.length === 0, errori.join(' | '));
      await ctx.close();
    }
  } catch (e) { ok(`${sc}: eccezione`, false, e.stack.split('\n').slice(0, 4).join(' / ')); }
}
await b.close(); server.close();
writeFileSync(`${uscita}/esiti-robustezza-${motore}-${misura}${rtl ? '-rtl' : ''}.json`, JSON.stringify(esiti, null, 1));
const no = esiti.filter(e => !e.ok).length; console.log(`\n${esiti.length - no}/${esiti.length} ok`); process.exit(no ? 1 : 0);
