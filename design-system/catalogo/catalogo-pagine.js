/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Il catalogo delle pagine interne: ciò che è nato con la pagina «non ancora» (website/non-ancora/): la cornice, la riunione ferma, la
// strada ferma, l'elenco delle versioni, e l'ascolto della chiusura con i suoi stati. Come catalogo.js non ha stili né markup suoi per i
// componenti: copia i pezzi dalla pagina vera (nel sito costruito, in italiano, ../../it/non-ancora/index.html) e li mostra con le classi e
// gli stati del sistema. Il movimento si guarda nella pagina viva, in un riquadro che si ricarica: è il suo script a muoverla, non una copia.
// Sta in un file suo e aggiunge le proprie sezioni dopo quelle di catalogo.js (che segnala di aver finito con window.__catalogo): chi
// aggiunge un'altra area scrive un altro file così e non tocca questo né il nucleo.
(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, att = {}, ...figli) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(att)) { if (typeof v === 'function') e.addEventListener(k.replace(/^on/, ''), v); else if (k === 'html') e.innerHTML = v; else if (k === 'testo') e.textContent = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); } e.append(...figli.flat().filter(x => x != null)); return e; };
  const errori = [];
  const prova = (nome, f) => { try { return f(); } catch (e) { errori.push(`${nome}: ${e.message}`); return null; } };
  // aspetta il catalogo principale (ha finito quando espone window.__catalogo)
  await new Promise(fine => { const t0 = performance.now(); (function chiedi() { if (window.__catalogo || performance.now() - t0 > 20000) fine(); else setTimeout(chiedi, 40); })(); });
  const PAGINA = '../../it/non-ancora/index.html';
  const doc = new DOMParser().parseFromString(await (await fetch(PAGINA)).text(), 'text/html');
  const da = (sel, n = 0) => { const e = doc.querySelectorAll(sel)[n]; if (!e) throw new Error('nella pagina «non ancora» manca ' + sel); const c = e.cloneNode(true); c.removeAttribute('id'); c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); return c; };
  const sblocca = n => { n.querySelectorAll('[hidden]').forEach(x => x.removeAttribute('hidden')); return n; };
  const html = s => { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; };
  const prova1 = (et, nodo, classe = '') => el('div', {class: 'cat-prova' + (classe.includes('largo') ? ' intero' : '')}, el('span', {class: 'cat-et', html: et}), el('div', {class: 'cat-quadro ' + classe}, nodo));
  const scheda = ({nome, id, regola, confine, persona, provenienza, prove}) => el('article', {class: 'cat-scheda'}, el('h3', {testo: nome}),
    el('dl', {}, el('dt', {testo: 'Identificatore'}), el('dd', {html: id}), el('dt', {testo: 'Regola d\'uso'}), el('dd', {html: regola}), el('dt', {testo: 'Non si usa'}), el('dd', {html: confine}),
      el('dt', {testo: 'Persona e compito'}), el('dd', {html: persona}), el('dt', {testo: 'Provenienza'}), el('dd', {html: provenienza})),
    el('div', {class: 'cat-prove'}, prove));
  // un pezzo dentro un contenitore «js», perché valgano le regole che il sito dà solo con lo script (.js …): lo stato prima dell'arrivo e il momento
  const conScript = n => el('div', {class: 'js'}, n);
  // un tratto sale sul successivo di --sovrap (40vh): qui, da solo, non ha niente sopra cui salire
  const senzaSovrapposizione = x => { x.style.setProperty('--sovrap', '0px'); return x; };
  const controlli = (...bottoni) => el('div', {class: 'cat-controlli'}, bottoni.map(([t, f]) => el('button', {type: 'button', testo: t, onclick: f})));

  // ---------- una pagina viva a una misura: nel suo schermo vero, rimpicciolita per starci ----------
  const schermi = [];
  // lo spazio per rimpicciolire è quello della sezione: il contenitore di un riquadro con l'iframe in assoluto non ne ha
  function schermo(w, h, src, titolo) {
    const quadro = el('div', {class: 'cap-schermo'}), f = el('iframe', {title: titolo, width: w, height: h, loading: 'lazy', src});
    quadro.append(f);
    const adatta = () => { const sezione = document.querySelector('#pagine-interne'), k = Math.min(1, ((sezione ? sezione.clientWidth : innerWidth) - 48) / w) || 1; quadro.style.width = `${Math.round(w * k)}px`; quadro.style.height = `${Math.round(h * k)}px`; f.style.transform = `scale(${k})`; };
    schermi.push({adatta, quadro}); quadro.adatta = adatta;
    quadro.ricarica = () => { try { f.contentWindow.location.reload(); } catch (e) { f.src = src; } };
    return quadro;
  }
  // una cosa pesante (caricare la pagina viva a sei misure) parte quando la sua tabella arriva sullo schermo
  const quandoVisibile = (nodo, f) => new Promise((ok, no) => { const o = new IntersectionObserver(v => { if (v.some(x => x.isIntersecting)) { o.disconnect(); f().then(ok, no); } }, {rootMargin: '200px'}); o.observe(nodo); });
  const viva = (w, h, src, titolo, etichetta, anche = []) => {
    const q = schermo(w, h, src, titolo);
    return el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', html: etichetta}), controlli(['Riproduci', () => q.ricarica()], ...anche), q);
  };

  // ---------- le sezioni ----------
  const radice = $('#cat'), indice = $('#indice');
  const apri = (id, titolo, nota, dopoDi) => {
    const s = el('section', {class: 'cat-sezione', id}); s.append(el('h2', {testo: titolo}));
    if (nota) s.append(el('p', {class: 'cat-nota', html: nota}));
    const ref = dopoDi && $('#' + dopoDi);
    if (ref) ref.after(s); else radice.append(s);
    const li = el('li', {}, el('a', {href: '#' + id, testo: titolo}));
    const rl = dopoDi && indice && $(`a[href="#${dopoDi}"]`, indice);
    if (rl) rl.parentElement.after(li); else if (indice) indice.append(li);
    return s;
  };

  prova('pagine-interne', () => {
    const s = apri('pagine-interne', 'Pagine interne: la cornice e i pezzi della pagina «non ancora»',
      'Quattro componenti nuovi (<code>pagina.css</code>, <code>riunione-ferma.css</code>, <code>strada-ferma.css</code>, <code>versioni.css</code>), lo script della cornice (<code>website/cornice.js</code>) e l\'ascolto della chiusura con i suoi stati. Sono copiati dalla pagina vera (<code>website/non-ancora/index.html</code>, costruita in italiano) e coperti dagli stessi fogli; gli stati si forzano con le classi che il sistema già ha. Ciò che si muove da solo si guarda nella pagina viva, in un riquadro che si ricarica: è il suo script a muoverla. Le prove (larghezze, motori, stati) sono in <code>design/lavoro/3a-non-ancora/costruzione/</code>.', 'componenti');

    // =============================================================================================================
    // 1. la cornice
    // =============================================================================================================
    const misure = [[390, 844, 'Telefono alto 390×844'], [390, 667, 'Telefono basso 390×667'], [360, 640, 'Telefono piccolo 360×640'], [844, 390, 'Telefono girato 844×390'], [1366, 640, 'Computer basso 1366×640'], [1440, 900, 'Computer 1440×900']];
    const barra = el('div', {class: 'cat-misure'}), cont = el('div', {});
    const mostra = (w, h, n) => { const q = schermo(w, h, PAGINA, n); cont.replaceChildren(el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', testo: n}), controlli(['Riproduci', () => q.ricarica()]), q)); q.adatta(); };
    for (const [w, h, n] of misure) barra.append(el('button', {type: 'button', 'aria-pressed': 'false', testo: n, onclick: ev => { barra.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false')); ev.target.setAttribute('aria-pressed', 'true'); mostra(w, h, n); }}));
    // dove stanno il comando e lo stato nel primo schermo, misurato adesso nella pagina viva a ogni misura
    const tab = el('tbody');
    const misura = el('table', {class: 'cat-tabella'}, el('thead', {}, el('tr', {}, ['Misura', 'Titolo e frase', 'Comando principale', 'Stato «Oggi:»', 'Ordine del fuoco'].map(t => el('th', {testo: t})))), tab);
    for (const [w, h, n] of misure) tab.append(el('tr', {'data-misura': `${w}x${h}`}, el('td', {testo: n}), el('td', {testo: '…'}), el('td', {testo: '…'}), el('td', {testo: '…'}), el('td', {testo: '…'})));
    quandoVisibile(misura, async () => {
      const f = el('iframe', {title: 'misura', style: 'position: fixed; inset-inline-start: -9999px; top: 0; border: 0'});
      for (const [w, h] of misure) {
        f.width = w; f.height = h;
        // (l'indirizzo si dà prima di mettere il riquadro nella pagina: così il primo «load» è quello della pagina, non quello di un riquadro vuoto)
        await new Promise(r => { f.addEventListener('load', r, {once: true}); f.src = PAGINA + `?misura=${w}x${h}`; if (!f.isConnected) document.body.append(f); });
        await new Promise(r => setTimeout(r, 1800));
        const d = f.contentDocument, b = x => { const e = d.querySelector(x); return e ? e.getBoundingClientRect() : null; };
        const pres = b('.scena-pagina .presentazione'), com = b('#comandi-apertura'), stato = b('.scena-pagina .stato'), palco = b('.scena-pagina .palco');
        const tr = [...tab.rows].find(r => r.dataset.misura === `${w}x${h}`); if (!tr || !com) continue;
        const accanto = palco.left >= com.right - 1 || com.left >= palco.right - 1, prima = accanto ? 'accanto alla scena' : com.top < palco.top ? 'prima della scena' : 'dopo la scena';
        const fuoco = []; { const ord = [...d.querySelectorAll('.scena-pagina a, .scena-pagina button')].filter(x => x.getClientRects().length); const pos = ord.map(x => Math.round(x.getBoundingClientRect().top)); fuoco.push(`${ord.length} comandi nel primo schermo, fuoco in ordine di posizione: ${pos.every((v, i) => !i || v >= pos[i - 1] - 2) ? 'sì' : 'no'}`); }
        tr.cells[1].textContent = `fino a ${Math.round(pres.bottom)} px`;
        tr.cells[2].textContent = `${Math.round(com.top)}–${Math.round(com.bottom)} px, ${prima}${com.bottom <= h ? ', nello schermo' : ', sotto il bordo'}`;
        tr.cells[3].textContent = `fino a ${Math.round(stato.bottom)} px${stato.bottom <= h ? ', nello schermo' : ', sotto il bordo'}`;
        tr.cells[4].textContent = fuoco[0];
      }
      f.remove();
    }).catch(e => errori.push('misure della cornice: ' + e.message));

    queueMicrotask(() => $('button', barra) && $('button', barra).click());
    s.append(scheda({nome: 'Cornice di una pagina interna', id: '<code>.scena-pagina</code> · <code>.tratto.coppia</code> <code>.coppia-oggetto</code> <code>.coppia-nota</code> · <code>.nota</code> · <code>.chiusura .sotto-titolo</code> · <code>#comandi-apertura</code> · <code>.comandi.senza-arrivo</code> (pagina.css, cornice.js)',
      regola: 'Ogni pagina interna ha il primo schermo della home (titolo, frase, comandi, stato, didascalia; la scena a destra), poi tratti come scene a tono alterno che salgono l\'una sull\'altra, e una chiusura con la riunione grande e un comando da provare. <b>Quando l\'altezza manca, vince il comando</b>: la risposta (titolo e frase) e il comando principale stanno sempre nel primo schermo, e la scena cede il posto. Telefono alto (da 760 px di altezza): titolo, frase, scena con la sua didascalia, comandi, stato. Telefono basso (sotto 760 px: 390×667, 360×640): titolo, frase, <i>comandi</i>, poi la scena e lo stato. Telefono girato e finestre basse (oltre 760 px di larghezza, fino a 500 di altezza: 844×390): titolo e frase alla misura del telefono, comandi e stato nel primo schermo, la scena dopo. Computer basso (1366×640): tutto nel primo schermo con la scena accanto. <code>cornice.js</code> tiene l\'ordine del fuoco uguale a ciò che si vede (sul telefono alto sposta i comandi dopo la scena) e rivela un tratto quando il fuoco vi entra.',
      confine: 'Non per la home (ha la sua scena e <code>scena.js</code>); non per una pagina senza un comando principale nel primo schermo. Le altre pagine interne (stato, installa, in riunione, 404) mettono il loro comando principale in <code>#comandi-apertura</code>.',
      persona: 'Chi arriva da una ricerca o da un collegamento, a qualunque misura, e vuole la risposta e il passo successivo senza scorrere.',
      provenienza: 'Progettuale, dal primo schermo scelto della home (<code>design/direzione-2/</code>); la regola degli schermi bassi viene dal giudizio I5 (<code>design/lavoro/3a-non-ancora/giudizio/GIUDIZIO.md</code>) e da <code>PIANO.md</code>, «La cornice»; barra fissa e tratti come scene: tratto comune R03 (<code>PIANO.md</code>).',
      prove: [
        el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', testo: 'dove stanno comando e stato, misurato adesso nella pagina viva'}), misura),
        el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', testo: 'il primo schermo vivo, a sei misure: scegli una misura'}), barra, cont),
        prova1('un tratto con il testo e un oggetto affiancati (<code>.tratto.coppia</code>, «Quando arriva»)', senzaSovrapposizione(da('.tratto.coppia')), 'largo'),
        prova1('la chiusura: titolo, riunione, comando e rimandi (<code>.chiusura</code>)', (() => { const c = sblocca(senzaSovrapposizione(da('.tratto.chiusura'))); c.querySelectorAll('.lettore-ferma').forEach(x => x.remove()); return c; })(), 'largo'),
      ]}));

    // =============================================================================================================
    // 2. la riunione ferma
    // =============================================================================================================
    const palco = () => { const p = da('.palco-fermo'); p.style.position = 'relative'; return p; };
    const lungo = x => { $$('.nome-lungo', x).forEach(n => { n.textContent += ' e in attesa del microfono che ancora non c\'è'; }); const k = $('.mancante-nota', x); if (k) k.textContent += ', e ancora per un po\''; $$('.nome', x).forEach(n => { if (!n.querySelector('.nome-lungo')) n.textContent = n.textContent + ' Maria Grazia'; }); };
    s.append(scheda({nome: 'La riunione in cui la tua voce non arriva', id: '<code>.palco-fermo</code> <code>.chiamata-ferma</code> <code>.riquadro.tu.assente</code> <code>.scelta.mancante</code> <code>.segno-scelta</code> <code>.posto-bolla-ferma</code> <code>.bolla-ferma</code> (riunione-ferma.css; sopra: riunione.css, riunione-app.css, bolla.css)',
      regola: 'La riunione della home vista dove «Kalliope» non c\'è: il tuo posto è tratteggiato e senza fondo, con la voce piatta («Tu · senza voce»); la tua frase resta nella bolla, in grigio, senza voce; nella barra del microfono il posto di «Kalliope» è tratteggiato e spento. Il tentativo (con lo script, da 2,4 s): il segno chiaro della scelta lascia «Microfono del computer», va sul posto di «Kalliope», lo trova vuoto (si svuota, il posto manda un\'onda tratteggiata, il tuo bordo si accende, compare «non c\'è») e torna. Senza script e con «riduci movimento» la barra è ferma con «non c\'è» già scritto. Interrotto da un ridimensionamento va allo stesso stato finale; con la scheda in secondo piano si ferma e riparte da dov\'era.',
      confine: 'Solo dove il microfono «Kalliope» manca davvero (Windows, macOS: «non ancora»); non per un errore momentaneo né per un permesso negato. Non promette una data.',
      persona: 'Chi non ha Linux e vuole capire in un colpo d\'occhio perché non può ancora (e, in «Se non ti sentono», chi ha un microfono non scelto).',
      provenienza: 'Progettuale: dal significato del tratteggio nella home («non ancora provata»); la scelta del microfono che si sposta: home, «Che cosa serve» (<code>riunione-app.css</code>, <code>.scelta</code>); il tentativo fallito e il posto tratteggiato: <code>design/lavoro/3a-non-ancora/PIANO.md</code>, «Scelte senza una fonte».',
      prove: [
        prova1('a riposo (senza JavaScript, «riduci movimento»)', palco(), 'largo'),
        prova1('il posto di «Kalliope» colpito (<code>.urtata</code>, <code>.urtato</code>)', (() => { const x = palco(); $('.scelta.mancante', x).classList.add('urtata'); $('.riquadro.tu.assente', x).classList.add('urtato'); return x; })(), 'largo'),
        prova1('testo più lungo (un\'altra lingua): le voci della barra e i nomi vanno a capo, nulla esce dalla cornice', (() => { const x = palco(); lungo(x); return x; })(), 'largo'),
        viva(1440, 900, PAGINA, 'La pagina «non ancora»: il primo schermo', 'il tentativo, dal vivo: premi Riproduci (la pagina si ricarica e il tentativo parte a 2,4 s)'),
      ]}));

    // =============================================================================================================
    // 3. la strada ferma
    // =============================================================================================================
    const strada = (...classi) => { const x = da('.strada-ferma'); x.classList.add(...classi); return x; };
    const tuttaFinale = x => { x.classList.add('fatto', 'provato', 'fermata'); $$('.tappa', x).slice(0, 2).forEach(t => t.classList.add('acceso')); return x; };
    s.append(scheda({nome: 'La strada che si ferma', id: '<code>.strada-ferma</code> <code>.tappa.ferma</code> <code>.tappa.spenta</code> <code>.esiti</code> <code>.esito-manca</code> <code>.urto</code> (strada-ferma.css; sopra: strada.css)',
      regola: 'La strada della voce della home dove manca una tappa: la voce nasce («Scrivi la frase», «La voce nasce qui», «C\'è già»), arriva al microfono, lo trova vuoto (tappa tratteggiata, bordo che si accende, onda tratteggiata che si spegne lì) e si ferma; le tappe dopo restano spente e tratteggiate (non provate in una riunione vera). Sotto, ciò che c\'è già (2 colonne su 5) e ciò che manca con la sua causa (3 su 5; a una colonna al telefono). Senza script e con «riduci movimento» la strada è già disegnata. Per i lettori di schermo la tappa vuota dice «non c\'è ancora» (<code>.solo-lettori</code>).',
      confine: 'Solo per un limite che si dice con la sua causa; non per un errore. Non per mostrare ciò che funziona (quella è la strada della home).',
      persona: 'Chi deve capire dove si ferma Kalliope sul suo computer e perché, prima di decidere se aspettare.',
      provenienza: 'Strada della home (<code>strada.css</code>, «Fin dove arriva la voce»: catena dal README; tappe «forse» tratteggiate); onestà in pagina, un limite detto con la sua causa: R50 (<code>R/sequenze/R50/fotogrammi/scorri-1440x900-f05.jpg</code>); la variante che si ferma è progettuale (<code>PIANO.md</code>).',
      prove: [
        prova1('disegnata, a riposo (senza JavaScript, «riduci movimento»)', tuttaFinale(strada()), 'largo'),
        prova1('la tappa vuota colpita (<code>.urtata</code>, onda che si spegne)', (() => { const x = tuttaFinale(strada()); $('.tappa.ferma', x).classList.add('urtata'); const u = el('span', {class: 'urto', 'aria-hidden': 'true'}); $('.tappa.ferma', x).append(u); u.animate([{transform: 'scale(1)', opacity: 0.9}, {transform: `scale(${getComputedStyle(document.documentElement).getPropertyValue('--urto-scala').trim()})`, opacity: 0}], {duration: 900, easing: 'ease-out', fill: 'both', iterations: Infinity}); return x; })(), 'largo'),
        prova1('prima che arrivi sullo schermo (con lo script: linee e «Manca» ancora spenti)', conScript(strada()), 'largo'),
        viva(1440, 900, PAGINA + '#perche', 'La pagina «non ancora»: il tratto «Si ferma al microfono»', 'come si disegna, dal vivo: premi Riproduci (la pagina si ricarica sul tratto e la strada si disegna quando arriva)'),
        viva(390, 844, PAGINA + '#perche', 'La pagina «non ancora» al telefono: il tratto «Si ferma al microfono»', 'al telefono la strada va in verticale, con la stessa voce che si ferma'),
      ]}));

    // =============================================================================================================
    // 4. l'elenco delle versioni
    // =============================================================================================================
    // il comando c'è (con lo script), le due risposte e la frase di chi non ha lo script no: si mostra ciò che serve a ogni stato
    const versioni = () => { const x = sblocca(da('.versioni')); $$('.senza-js, .copia-fatto, .copia-errore', x).forEach(n => { n.hidden = true; }); return x; };
    const momento = () => {
      const v = versioni(); const quadro = el('div', {class: 'js'}, v); v.classList.add('visto');
      const rip = () => { v.classList.remove('visto', 'ricordata'); void v.offsetWidth; v.classList.add('visto'); };
      return el('div', {}, controlli(['Riproduci', rip]), quadro);
    };
    const piede = (x, mostra) => { $$('.copia-fatto, .copia-errore', x).forEach(n => { n.hidden = !n.matches(mostra); }); return x; };
    const piuVersioni = (x, nomi) => { const l = $('.versioni-elenco', x), u = $('.versione.ultima', x); nomi.forEach(([n, d, t]) => { const c = u.cloneNode(true); $('.versione-nome', c).textContent = n; $('.versione-data', c).textContent = d; $('.versione-nota', c).textContent = t; l.append(c); }); return x; };
    s.append(scheda({nome: 'L\'elenco delle versioni', id: '<code>.versioni</code> <code>.versioni-titolo</code> <code>.versioni-elenco</code> <code>.versione.ultima</code> <code>.versione.prossima</code> <code>.versioni-piede</code> <code>.copia-indirizzo</code> <code>.copia-esito</code> <code>.ricordata</code> (versioni.css)',
      regola: 'Le versioni di Kalliope come le mostra la pagina delle versioni, nel nostro mondo: in cima il posto di ciò che non c\'è ancora (tratteggiato, vuoto: «compariranno qui, in cima · nessuna data»), sotto l\'ultima versione con i dati della release (segnaposto di <code>tools/site.py</code>, mai scritti a mano: il sito si ricostruisce a ogni release e l\'elenco si aggiorna da solo). Sotto, il comando per tenere l\'indirizzo della pagina: copiato, risponde «Copiato…» e il posto tratteggiato si accende una volta (resta fino alla prossima pressione); se non riesce, dice di usare i preferiti; senza script o dove gli appunti non si possono usare resta la frase dei preferiti. <b>Il momento</b> (arrivando sullo schermo): l\'ultima versione compare in cima, dove arriva ogni novità, con il bordo della voce acceso; resta un attimo e scende al suo posto; in cima si apre il posto tratteggiato di Windows e macOS, che si accende e resta ad aspettare.',
      confine: 'Non è un elenco di date promesse né una lista d\'attesa: non raccoglie indirizzi. Il posto tratteggiato dice «compariranno qui», mai una data né una versione inventata.',
      persona: 'Chi aspetta Windows o macOS e vuole sapere come ritrovare la notizia senza account e senza lasciare dati.',
      provenienza: 'Elenco delle versioni con data e stato: R50 (linea del tempo, <code>R/sequenze/R50/scorri-1440x900-foglio.jpg</code>); il bordo della voce acceso sul nuovo: le frasi della home in voce; la novità che arriva in cima, il posto che si apre e il comando «copia l\'indirizzo»: progettuali (<code>PIANO.md</code>, «Quando arriva»; giudizio I3 e I6).',
      prove: [
        prova1('a riposo, con il comando di copia (senza script manca: resta la frase dei preferiti)', piede(versioni(), '.nessuno'), 'largo'),
        prova1('il momento: premi Riproduci (con lo script: l\'ultima versione in cima, resta, scende; il posto tratteggiato si apre)', momento(), 'largo'),
        prova1('risposta: copiato (<code>.copia-fatto</code>)', piede(versioni(), '.copia-fatto'), 'largo'),
        prova1('risposta: non riuscita (<code>.copia-errore</code>)', piede(versioni(), '.copia-errore'), 'largo'),
        prova1('senza JavaScript: niente comando, la frase dei preferiti', (() => { const x = da('.versioni'); $$('.copia-indirizzo', x).forEach(n => { n.hidden = true; }); return x; })(), 'largo'),
        prova1('il posto che si accende quando si copia (<code>.ricordata</code>): premi Riproduci', (() => { const v = versioni(); const p = $('.versione.prossima', v); return el('div', {}, controlli(['Riproduci', () => { p.classList.remove('ricordata'); void p.offsetWidth; p.classList.add('ricordata'); }]), v); })(), 'largo'),
        prova1('più versioni (esempio: quando ce ne saranno), nomi e note lunghe vanno a capo', piuVersioni(versioni(), [['Kalliope 0.1 con un nome molto lungo per vedere dove va a capo', '3 dicembre 2026', 'Versione di prova · solo Linux, con una nota abbastanza lunga da occupare più righe nell\'elenco'], ['Kalliope 0.0', '1 novembre 2026', 'Esempio']]), 'largo'),
        viva(1440, 900, PAGINA + '#quando', 'La pagina «non ancora»: il tratto «Quando arriva»', 'il tratto dal vivo, con il comando di copia vero: premi Riproduci'),
      ]}));

    // =============================================================================================================
    // 5. l'ascolto della chiusura
    // =============================================================================================================
    const comando = stato => { const x = sblocca(da('.comandi-ascolto')); $$('.lettore-ferma', x).forEach(n => n.remove()); const b = $('.ascolta-ferma', x); if (stato !== 'fermo') b.classList.add(stato); return x; };
    const tavolo = (f = () => {}) => { const x = da('.chiusura .tavolo'); f(x); return x; };
    const scritta = x => { const t = $('.bolla-testo', x); if (!t.querySelector('.p')) { const parole = t.textContent.trim().split(/\s+/); t.textContent = ''; parole.forEach((p, i) => { if (i) t.append(' '); t.append(el('span', {class: 'p', testo: p})); }); $('.bolla-chiusa', x).classList.add('divisa'); } return $$('.bolla-testo .p', x); };
    const nota = (testo, ruolo = 'alert') => el('div', {class: 'errore-ascolto', role: ruolo}, el('p', {testo}), el('div', {class: 'errore-azioni'}, el('button', {class: 'riprova', type: 'button', testo: 'Riprova'}), el('a', {class: 'scarica-file', href: '#ascolto-chiusura', testo: 'Scarica la registrazione (Giulia, mp3)'})));
    const larghezze = el('span', {class: 'cat-et', testo: 'larghezza del comando negli stati: …'});
    queueMicrotask(() => setTimeout(() => { const w = [...new Set($$('.cap-stati .ascolta-ferma').map(b => Math.round(b.getBoundingClientRect().width * 10) / 10))]; larghezze.textContent = `larghezza del comando misurata in tutti gli stati mostrati: ${w.join(' · ')} px${w.length === 1 ? ' (la stessa: le etichette stanno nella stessa cella, vale la più lunga)' : ' (DIVERSA)'}`; }, 600));
    s.append(scheda({nome: 'L\'ascolto della chiusura: «Ascolta Giulia» e i suoi stati', id: '<code>.ascolta-ferma</code> (<code>.suona-frase</code>, <code>.pillola.voce-chiara</code>) <code>.etichette</code> <code>.se-fermo</code> <code>.se-carica</code> <code>.se-suona</code> <code>.se-pausa</code> · <code>.errore-ascolto</code> · <code>.lettore-ferma</code> · <code>.bolla-chiusa</code> (pagina.css; sopra: pulsanti.css, filo.css, errori.css, bolla.css)',
      regola: 'Il suono parte solo se la persona preme. Il comando ha quattro stati: <i>ascolta</i> (il tondo con il triangolo), <i>carica</i> («Carico…», il cerchio tratteggiato che gira), <i>suona</i> («Pausa», il tondo con le due barre) e <i>pausa</i> («Riprendi»). Le quattro etichette stanno nella stessa cella: il pulsante ha la larghezza della più lunga, in qualunque lingua, e non sposta ciò che gli sta accanto. Per i lettori di schermo il nome dice che cosa fa premerlo in quello stato; quando la voce parte la pagina lo annuncia. Premere ancora mette in pausa, poi riprende; premere mentre carica annulla. Se l\'audio aspetta dati torna «Carico…» e se tarda (6 s) la pagina lo dice; se non parte, il messaggio d\'errore sta sotto il comando con «Riprova» e il file da scaricare, e la bolla resta com\'era (la frase scritta e non detta: nessuna parola accesa, nessuna voce in riunione). Con la scheda in secondo piano il suono va in pausa. Senza JavaScript c\'è il lettore del browser con il file.',
      confine: 'Un solo suono per pagina, mai da solo. Non per una conferma o un avviso (quelli non hanno il tondo del suono).',
      persona: 'Chi non ha Linux e può comunque sentire subito come suona la frase che in alto restava muta.',
      provenienza: 'Chiusura e onde della home (<code>tratti.css</code>, <code>riunione.css</code>); pulsante della voce con lo stato: R51 (<code>R/sequenze/R51/da-visite-gesti.jpg</code>), già nella home (<code>filo.css</code>); messaggi d\'errore: <code>errori.css</code> (4b) e il giudizio M1; larghezza ferma: giudizio M2; scena intera prima del suono: giudizio M5.',
      prove: [
        el('div', {class: 'cat-prova intero cap-stati'}, larghezze,
          el('div', {class: 'cat-prove'}, [['ascolta (riposo)', 'fermo'], ['carica', 'carica'], ['suona', 'suona'], ['pausa', 'pausa']].map(([n, k]) => prova1(n, comando(k)))),
          el('div', {class: 'cat-prove'}, [['al passaggio', 'sim-sopra'], ['fuoco', 'sim-fuoco'], ['premuto', 'sim-premuto']].map(([n, k]) => { const x = comando('fermo'); $('.ascolta-ferma', x).classList.add(k); return prova1(n, x); }))),
        prova1('messaggio: il suono non si carica (<code>role="alert"</code>), con la bolla com\'era', (() => { const x = el('div', {}, tavolo(t => { scritta(t).forEach(p => p.classList.add('attesa')); $('.bolla-chiusa', t).classList.add('nata'); }), comando('fermo'), nota('Non riesco a caricare la registrazione. Controlla la connessione e riprova, oppure scaricala.')); return x; })(), 'largo'),
        prova1('messaggio: il caricamento è lento (<code>role="status"</code>), mentre il comando dice «Carico…»', el('div', {}, comando('carica'), nota('Il caricamento è lento. Puoi aspettare, riprovare o scaricare la registrazione.', 'status')), 'largo'),
        prova1('messaggio: il browser non ha fatto partire il suono (<code>permesso</code>)', el('div', {}, comando('fermo'), nota('Il browser non ha fatto partire il suono. Premi «Riprova»: il suono parte solo con un tuo gesto.')), 'largo'),
        ...[['la frase non detta: grigia, nessuna parola accesa (com\'è a riposo e dopo un errore)', 0], ['la frase a metà: le parole si accendono sul tempo della voce, «Tu» parla', 4], ['la frase detta: tenue, tutte le parole accese', 11]].map(([n, k]) => prova1(n, tavolo(t => { const p = scritta(t); p.forEach((w, i) => w.classList.toggle('attesa', i >= k)); $('.bolla-chiusa', t).classList.add('nata'); if (k === 11) $('.bolla-chiusa', t).classList.add('detta'); if (k) $('.riquadro.tu', t).classList.add('parla'); }), 'largo')),
        prova1('senza JavaScript: il lettore del browser con il file e il collegamento per scaricarlo', da('.comandi-ascolto'), 'largo'),
        viva(1440, 900, PAGINA + '#ascolta', 'La pagina «non ancora»: la chiusura', 'l\'ascolto dal vivo: premi «Ascolta Giulia» nel riquadro (il suono parte solo se premi; Riproduci ricarica la pagina)'),
      ]}));
    schermi.forEach(x => x.adatta());
  });

  // il rimpicciolimento si calcola quando il riquadro è nella pagina
  requestAnimationFrame(() => schermi.forEach(x => x.adatta()));
  const osserva = new ResizeObserver(() => schermi.forEach(x => x.adatta())); osserva.observe(document.body);
  window.__catalogoPagine = {errori, schermi: schermi.length};
  const stato = $('#stato-catalogo'); if (stato && errori.length) stato.textContent += ` · pagine interne: ${errori.join(' · ')}`;
})();
