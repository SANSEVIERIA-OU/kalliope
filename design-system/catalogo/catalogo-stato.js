/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Il catalogo della pagina «stato» (incarico 3b-b, 17/11/2026): i cinque componenti che ha portato nel sistema, con le loro varianti e i loro stati:
// la riunione con il confine del provato, la strada vista da vicino (la catena, le sue tappe, la cifra e la quota, le parole, le fonti che si aprono,
// i dettagli a richiesta, la parentesi «non misurato» che segue i nodi), le domande con la risposta nella bolla, il varco con i suoi cinque passi, il
// messaggio da inoltrare. Come catalogo-pagine.js non ha stili né markup suoi per i componenti: copia i pezzi dalla pagina vera (nel sito costruito, in
// italiano, ../../it/stato/index.html) e li mostra con le classi e gli stati del sistema. Ciò che è fatto da uno script (le domande che cambiano, i file
// che scendono, il passo che conta) si guarda nella pagina viva, in un riquadro, e i comandi del catalogo premono i comandi veri del riquadro (stessa
// origine); ciò che il catalogo ricostruisce per mostrarlo (l'arrivo della riunione, l'accendersi delle tappe) usa gli stessi token della pagina.
// Sta in un file suo e aggiunge la sua sezione dopo quella delle pagine interne (catalogo-pagine.js): non tocca quel file né il nucleo.
(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, att = {}, ...figli) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(att)) { if (typeof v === 'function') e.addEventListener(k.replace(/^on/, ''), v); else if (k === 'html') e.innerHTML = v; else if (k === 'testo') e.textContent = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); } e.append(...figli.flat().filter(x => x != null)); return e; };
  const errori = [];
  const prova = (nome, f) => { try { return f(); } catch (e) { errori.push(`${nome}: ${e.message}`); return null; } };
  // aspetta il catalogo principale e la sezione delle pagine interne, dopo cui sta questa
  const aspetta = (cond, max = 20000) => new Promise(fine => { const t0 = performance.now(); (function chiedi() { if (cond() || performance.now() - t0 > max) fine(); else setTimeout(chiedi, 40); })(); });
  await aspetta(() => window.__catalogo);
  await aspetta(() => window.__catalogoPagine || $('#pagine-interne'));
  const PAGINA = '../../it/stato/index.html';
  const doc = new DOMParser().parseFromString(await (await fetch(PAGINA)).text(), 'text/html');
  const da = (sel, n = 0) => { const e = doc.querySelectorAll(sel)[n]; if (!e) throw new Error('nella pagina «stato» manca ' + sel); const c = e.cloneNode(true); c.removeAttribute('id'); c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); return c; };
  const sblocca = n => { n.querySelectorAll('[hidden]').forEach(x => x.removeAttribute('hidden')); return n; };
  const prova1 = (et, nodo, classe = '') => el('div', {class: 'cat-prova' + (classe.includes('largo') ? ' intero' : '')}, el('span', {class: 'cat-et', html: et}), el('div', {class: 'cat-quadro ' + classe}, nodo));
  const scheda = ({nome, id, regola, confine, persona, provenienza, prove}) => el('article', {class: 'cat-scheda'}, el('h3', {testo: nome}),
    el('dl', {}, el('dt', {testo: 'Identificatore'}), el('dd', {html: id}), el('dt', {testo: 'Regola d\'uso'}), el('dd', {html: regola}), el('dt', {testo: 'Non si usa'}), el('dd', {html: confine}),
      el('dt', {testo: 'Persona e compito'}), el('dd', {html: persona}), el('dt', {testo: 'Provenienza'}), el('dd', {html: provenienza})),
    el('div', {class: 'cat-prove'}, prove));
  // un pezzo dentro un contenitore «js», perché valgano le regole che il sito dà solo con lo script (.js …)
  const conScript = n => el('div', {class: 'js'}, n);
  const senzaSovrapposizione = x => { x.style.setProperty('--sovrap', '0px'); return x; };
  const controlli = (...bottoni) => el('div', {class: 'cat-controlli'}, bottoni.map(([t, f]) => el('button', {type: 'button', testo: t, onclick: f})));
  const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const ms = n => { const v = tok(n); return v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000; };
  const num = n => parseFloat(tok(n));

  // ---------- una pagina viva a una misura: nel suo schermo vero, rimpicciolita per starci; i comandi del catalogo premono quelli veri ----------
  const schermi = [];
  function schermo(w, h, src, titolo) {
    const quadro = el('div', {class: 'cap-schermo'}), f = el('iframe', {title: titolo, width: w, height: h, loading: 'lazy', src});
    quadro.append(f);
    const adatta = () => { const sezione = $('#pagina-stato'), k = Math.min(1, ((sezione ? sezione.clientWidth : innerWidth) - 48) / w) || 1; quadro.style.width = `${Math.round(w * k)}px`; quadro.style.height = `${Math.round(h * k)}px`; f.style.transform = `scale(${k})`; };
    schermi.push({adatta, quadro}); quadro.adatta = adatta;
    quadro.ricarica = () => { try { f.contentWindow.location.reload(); } catch (e) { f.src = src; } };
    quadro.dentro = fn => { try { return fn(f.contentWindow, f.contentDocument); } catch (e) { errori.push('riquadro: ' + e.message); } };
    return quadro;
  }
  const viva = (w, h, src, titolo, etichetta, anche = []) => {
    const q = schermo(w, h, src, titolo);
    return el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', html: etichetta}), controlli(['Riproduci', () => q.ricarica()], ...anche.map(([t, f]) => [t, () => f(q)])), q);
  };
  // porta il riquadro a un punto della pagina e preme un comando vero
  const vai = (sel, blocco = 'start') => q => q.dentro((w, d) => { const e = d.querySelector(sel); if (e) e.scrollIntoView({block: blocco, behavior: 'instant'}); });
  const premi = sel => q => q.dentro((w, d) => { const e = d.querySelector(sel); if (e) { e.scrollIntoView({block: 'center', behavior: 'instant'}); e.click(); } });

  // ---------- la sezione ----------
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

  prova('pagina-stato', () => {
    const s = apri('pagina-stato', 'Pagina «stato»: la riunione provata, la strada, le domande, il varco e il messaggio',
      'Cinque componenti nuovi (<code>riunione-provata.css</code>, <code>catena.css</code>, <code>domande.css</code>, <code>varco.css</code>, <code>inoltra.css</code>), sopra la cornice delle pagine interne. Sono copiati dalla pagina vera (<code>website/stato/index.html</code>, costruita in italiano) e coperti dagli stessi fogli; gli stati si forzano con le classi che il sistema già ha (<code>.js</code> dove valgono le regole che il sito dà solo con lo script, <code>.acceso</code>, <code>data-passo</code>). Ciò che fa lo script della pagina (le domande che cambiano, i file che scendono nel varco, il passo che conta) si guarda nella pagina viva, in un riquadro: i comandi del catalogo premono i comandi veri. Le prove (larghezze, motori, stati, lingue) sono in <code>design/lavoro/3b-stato/costruzione/</code>; il piano dei tratti in <code>design/lavoro/3b-stato/PIANO.md</code>.', 'pagine-interne');

    // =============================================================================================================
    // 1. la riunione provata
    // =============================================================================================================
    const palco = (f = x => x) => { const x = da('.palco-provato'); x.style.position = 'relative'; return f(x); };
    const chiamata = x => $('.chiamata-provata', x);
    // l'arrivo della pagina, con gli stessi token (stato.js): «Tu» parla, il microfono risponde, l'onda tratteggiata segna ciò che sta oltre, poi la frase detta e ferma
    const arrivo = x => {
      const c = chiamata(x); c.classList.remove('parla', 'microfono-acceso', 'oltre-segnato', 'fatta'); x.classList.remove('detta'); void x.offsetWidth;
      c.classList.add('parla'); x.classList.add('detta');
      setTimeout(() => { c.classList.add('microfono-acceso'); setTimeout(() => { c.classList.add('oltre-segnato'); setTimeout(() => { c.classList.add('fatta'); c.classList.remove('parla'); }, ms('--durata-provato-barre') * num('--ripetizioni-provato-barre')); }, ms('--ritardo-oltre-segnato')); }, ms('--ritardo-microfono-provato'));
    };
    const fasi = (...classi) => conScript(palco(x => { const c = chiamata(x); c.classList.add(...classi); if (classi.includes('parla') || classi.includes('fatta')) x.classList.add('detta'); return x; }));
    const lungoPalco = () => palco(x => { $$('.nome-lungo', x).forEach(n => { n.textContent += ' e in attesa dell\'app della riunione'; }); const p = $('.provato-nota', x); if (p) p.textContent += ', e ancora per un po\''; return x; });
    s.append(scheda({nome: 'La riunione con il confine del provato', id: '<code>.palco-provato</code> <code>.chiamata-provata</code> <code>.riquadro.tu.provato</code> <code>.riquadro.oltre</code> <code>.onde-oltre</code> <code>.kalliope-provato</code> <code>.provato-nota</code> <code>.bolla-provata</code> (riunione-provata.css; sopra: riunione-ferma.css, riunione.css, riunione-app.css, bolla.css)',
      regola: 'La riunione di «non ancora», questa volta con la voce: il tuo riquadro parla («Tu · microfono «Kalliope»», le barre accese, il bordo di chi parla) e nella barra dell\'app è scelto «Kalliope · provato fin qui». Ciò che sta oltre il microfono (Paola, Luca, Anna) è <b>tratteggiato e un poco velato</b>: il segno di «non ancora» della home, qui per ciò che nessuno ha provato. <b>L\'arrivo</b> (con lo script): la frase nella bolla è grigia; a 2,5 s «Tu» parla (il bordo si accende, le barre si muovono per circa 1,5 s) e la frase si accende; a 3,1 s il microfono «Kalliope» risponde con l\'anello della voce e compare «provato fin qui»; a 3,8 s un\'onda tratteggiata parte da «Tu» (900 ms lineari) e i riquadri che tocca, Luca, Paola, Anna, prendono il tratteggio. Poi fermo. Senza JavaScript e con «riduci movimento» la scena è già allo stato finale; da destra a sinistra «Tu» sta in alto all\'inizio e l\'onda parte da lì. Al telefono l\'etichetta di «Tu» resta «Tu» dove la parte lunga non sta in una riga (<code>componenti.js</code> conta le righe vere, anche con un carattere di riserva).',
      confine: 'Solo dove c\'è un confine del provato da dire (ciò che è provato fino a un punto e non oltre); non per una riunione che funziona né per un errore momentaneo. Non promette una data.',
      persona: 'Chi valuta Kalliope per un\'altra persona o deve controllare: vede in un colpo d\'occhio fino a dove è provato, prima di leggere.',
      provenienza: 'Progettuale, dalla riunione di «non ancora» e dal tratteggio della home («non ancora provata»): <code>design/lavoro/3b-stato/PIANO.md</code>, «I tratti», e «Scelte senza una fonte» (l\'onda tratteggiata che lascia il segno e «provato fin qui»: senza una fonte, dichiarate).',
      prove: [
        prova1('a riposo: senza JavaScript e con «riduci movimento» (tutto è già al suo posto)', palco(), 'largo'),
        prova1('prima dell\'arrivo, con lo script: la frase grigia, le barre spente, gli altri senza tratteggio', fasi(), 'largo'),
        prova1('«Tu» parla: bordo acceso e barre che si muovono (<code>.parla</code>), la frase detta', fasi('parla'), 'largo'),
        prova1('il microfono risponde: «provato fin qui» e l\'anello (<code>.microfono-acceso</code>)', fasi('parla', 'microfono-acceso'), 'largo'),
        prova1('l\'onda tratteggiata e gli altri tratteggiati (<code>.oltre-segnato</code>, <code>.fatta</code>)', fasi('microfono-acceso', 'oltre-segnato', 'fatta'), 'largo'),
        prova1('l\'arrivo, dal vivo: premi Riproduci (le stesse fasi e gli stessi tempi della pagina)', (() => { const x = conScript(palco()); const p = $('.palco-provato', x); return el('div', {}, controlli(['Riproduci', () => arrivo(p)]), x); })(), 'largo'),
        prova1('testo più lungo (un\'altra lingua): l\'etichetta e la nota restano nel loro riquadro, nulla esce', lungoPalco(), 'largo'),
        viva(1440, 900, PAGINA, 'La pagina «stato»: il primo schermo', 'il primo schermo dal vivo, con l\'arrivo: premi Riproduci (la pagina si ricarica e la voce parte a 2,5 s)'),
        viva(390, 844, PAGINA, 'La pagina «stato» al telefono: il primo schermo', 'al telefono: titolo, frase, comandi, la riunione con «Tu» e la bolla'),
        viva(844, 390, PAGINA, 'La pagina «stato» a 844×390 (telefono girato)', 'telefono girato: titolo e comandi nello schermo, la riunione sotto'),
      ]}));

    // =============================================================================================================
    // 2. la catena
    // =============================================================================================================
    const catena = (f = x => x) => { const x = da('.catena'); return f(x); };
    // la parentesi «non misurato» va dal nodo di «Scrivi la frase» a quello di «Gli altri ti sentono» (stato.js, parentesi()): le misure dalla copia
    const misuraParentesi = x => {
      const da1 = $('.anello[data-anello=scrivi] .anello-nodo', x), a1 = $('.anello[data-anello=altri] .anello-nodo', x);
      const rc = x.getBoundingClientRect(), r1 = da1.getBoundingClientRect(), r2 = a1.getBoundingClientRect();
      x.style.setProperty('--misura-da', `${(r1.top + r1.height / 2 - rc.top).toFixed(1)}px`); x.style.setProperty('--misura-a', `${(r2.top + r2.height / 2 - rc.top).toFixed(1)}px`);
    };
    const unaTappa = (nome, f = () => {}) => { const c = el('div', {class: 'catena'}, el('ol', {class: 'catena-tappe'}, da(`.anello[data-anello=${nome}]`))); f($('.anello', c)); return c; };
    const accendi = x => $$('.anello', x).forEach((a, i) => setTimeout(() => a.classList.add('acceso'), i * ms('--passo-cascata-anelli')));
    const conAccese = (x, ...nomi) => { $$('.anello', x).forEach(a => { if (!nomi.length || nomi.includes(a.dataset.anello)) a.classList.add('acceso'); }); return x; };
    const fonte = (f = () => {}) => { const x = da('.fonte', 1); f(x); return x; };
    s.append(scheda({nome: 'La strada vista da vicino: la catena e le sue tappe', id: '<code>.catena</code> <code>.catena-tappe</code> <code>.anello</code> (<code>.fatto</code> <code>.forse</code> <code>.acceso</code> <code>.ultimo-provato</code>) <code>.anello-nodo</code> <code>.cifra</code> <code>.quota</code> <code>.parole-segni</code> <code>.riscrive</code> <code>.pacchetti</code> <code>.app-nomi</code> <code>.fonte</code> <code>.anello-forse</code> <code>.anello-dettagli</code> <code>.catena-misura</code> <code>.catena-computer</code> (catena.css; sopra: strada.css)',
      regola: 'La strada della voce della home, in verticale, dal tasto al microfono e oltre: sei tappe, ognuna con il suo nodo e <b>la sua cifra nel punto in cui è stata misurata</b>, con il file da cui viene (la <b>fonte</b>, un collegamento al file del repository alla versione che la pagina mostra). Le tappe provate hanno il nodo pieno e la linea; dopo il microfono la linea è tratteggiata e le tappe sono «forse»: nessuno le ha provate. Il testo di una tappa si legge sempre; quando la tappa arriva sullo schermo la linea scende al suo nodo (260 ms), il nodo si accende e il suo fatto accade: i quattro pacchetti provati si accendono uno dopo l\'altro, nel campo «cmq ci vediamo dmn alle 10:30» nasce la bolla «comunque ci vediamo domani alle dieci e trenta», la quota di un secondo di voce si riempie fino a 0,07, la riga di 43 parole si scrive e una, la sbagliata (2,3%), lampeggia due volte. Più tappe arrivate insieme si accendono a cascata breve (140 ms); quelle sopra, saltate, si accendono ferme. <b>La parentesi «non misurato»</b> (al computer, oltre 1180 px) va dal nodo di «Scrivi la frase» a quello di «Gli altri ti sentono» e la sua scritta resta in vista finché c\'è: <code>stato.js</code> misura i due nodi (<code>--misura-da</code>, <code>--misura-a</code>). <b>I dettagli a richiesta</b>: come è misurato, le fonti e le differenze che restano stanno in un <code>&lt;details class="anello-dettagli"&gt;</code>: al computer sempre aperti e senza il comando, al telefono chiusi dietro «I dettagli e le fonti» (la scelta della persona resta mentre si cambia misura); senza JavaScript aperti. <b>La scelta della persona non si perde</b>: ciò che ha aperto o chiuso al telefono si ricorda e si ritrova tornando da una misura più larga (al computer tutto è aperto). Aprendo un dettaglio la pagina lo porta in vista (<code>--gesto-aria</code>).',
      confine: 'Non per una tabella di prestazioni né per un confronto con altri programmi: ogni cifra è misurata in un solo punto, su un solo computer, e la pagina lo dice («Le cifre: su un solo computer»). Non per tappe senza una misura né un fatto.',
      persona: 'Chi controlla (P7): per ogni cifra vuole il file da cui viene, e che cosa non è stato misurato; chi valuta per un altro (P3) legge la tappa e salta i dettagli.',
      provenienza: 'Strada della home (<code>strada.css</code>); la cifra grande con la barra che cresce: R04 Waymo Safety Hub (<code>design/ricerca/schede/R04.md</code>), un tratto; i dettagli «lunghi a richiesta»: <code>progetto.md</code> §4.2 e R04; la cifra nel punto della catena, la parentesi, la riga delle parole e la riscrittura nel campo: progettuali (<code>design/lavoro/3b-stato/PIANO.md</code>); le fonti che si aprono: decisione di chi coordina sul giudizio M7 (collegate ai file del repository pubblico alla versione mostrata, dai dati della versione).',
      prove: [
        prova1('la catena intera, accesa (senza JavaScript: tutto in vista; dal 1181 px la parentesi «non misurato» segue i nodi)', (() => { const x = catena(); setTimeout(() => misuraParentesi(x), 300); return el('div', {class: 'scena-notte provato cat-notte'}, x); })(), 'largo'),
        prova1('prima di arrivare, con lo script: i nodi spenti, le linee non scese, le cifre da fare. Premi Riproduci (la cascata breve, 140 ms)', (() => { const x = conScript(catena()); return el('div', {class: 'scena-notte provato cat-notte'}, controlli(['Riproduci', () => { $$('.anello', x).forEach(a => a.classList.remove('acceso')); void x.offsetWidth; accendi(x); }]), x); })(), 'largo'),
        prova1('una tappa provata, spenta e accesa (<code>.anello.fatto</code>, <code>.acceso</code>): la cifra, la quota e la fonte', el('div', {class: 'scena-notte provato cat-notte cat-coppia'}, conScript(unaTappa('voce')), conScript(unaTappa('voce', a => a.classList.add('acceso')))), 'largo'),
        prova1('la riga delle parole e la riscrittura nel campo, accese (<code>.parole-segni</code>, <code>.riscrive</code>)', el('div', {class: 'scena-notte provato cat-notte cat-coppia'}, conScript(unaTappa('microfono', a => a.classList.add('acceso'))), conScript(unaTappa('scrivi', a => a.classList.add('acceso')))), 'largo'),
        prova1('i pacchetti provati accesi e le app non provate (<code>.pacchetti</code>, <code>.app-nomi</code>, <code>.anello.forse</code>)', el('div', {class: 'scena-notte provato cat-notte cat-coppia'}, conScript(unaTappa('installa', a => a.classList.add('acceso'))), conScript(unaTappa('app')), conScript(unaTappa('altri'))), 'largo'),
        prova1('testo più lungo (un\'altra lingua): titoli, cifre e fonti vanno a capo dentro la tappa', (() => { const x = catena(); $$('.anello-nome', x).forEach(n => { n.textContent += ' con un titolo molto più lungo'; }); $$('.fonte', x).forEach(f => { f.append(' e un\'altra fonte con un nome lungo'); }); $$('.cifra-detto', x).forEach(n => { n.textContent += ' e un testo più lungo, come in una lingua che ha bisogno di più parole per dirlo.'; }); return el('div', {class: 'scena-notte provato cat-notte'}, conAccese(conScript(x))); })(), 'largo'),
        prova1('la fonte, sulla scena scura: a riposo, al passaggio (<code>.sim-sopra</code>), al fuoco (<code>.sim-fuoco</code>: l\'anello tondo attorno alla pillola, il nome ha la linea piena), senza collegamento (il file non c\'è alla versione mostrata)', el('div', {class: 'scena-notte provato cat-notte cat-fonti'}, fonte(), fonte(x => $('a', x).classList.add('sim-sopra')), fonte(x => $('a', x).classList.add('sim-fuoco')), fonte(x => { $('a', x).replaceWith(document.createTextNode('.github/workflows/pages.yml')); })), 'largo'),
        prova1('la fonte, sulla scena chiara (le licenze e i passi del varco)', el('div', {class: 'scena-chiara cat-chiara cat-fonti'}, fonte(), fonte(x => $('a', x).classList.add('sim-sopra')), fonte(x => $('a', x).classList.add('sim-fuoco'))), 'largo'),
        viva(1440, 900, PAGINA + '#provato', 'La pagina «stato»: la catena', 'la catena dal vivo, con la parentesi che segue i nodi: premi Riproduci, poi scorri nel riquadro', [['Porta al microfono', vai('.anello[data-anello=microfono]', 'center')]]),
        viva(390, 844, PAGINA + '#provato', 'La pagina «stato» al telefono: la catena e i dettagli a richiesta', 'al telefono i dettagli di una tappa stanno dietro «I dettagli e le fonti»: aprili e passa al computer (la scelta resta)', [['Apri i dettagli della cifra', premi('.anello[data-anello=voce] .anello-dettagli > summary')], ['Apri i dettagli del microfono', premi('.anello[data-anello=microfono] .anello-dettagli > summary')]]),
      ]}));

    // =============================================================================================================
    // 3. le domande
    // =============================================================================================================
    const domande = (f = x => x) => { const x = da('.domande'); return f(x); };
    // con lo script la domanda è un comando (stato.js lo crea dal titolo); qui lo stesso comando, con le stesse classi e lo stesso nome
    const bottone = (testo, aperto, extra = '') => el('button', {type: 'button', class: 'domanda-bottone ' + extra, 'aria-expanded': aperto ? 'true' : 'false', testo});
    const bollaRisposta = (domanda, risposta) => el('div', {class: 'bolla domande-bolla'}, el('div', {class: 'bolla-corpo'}, el('div', {class: 'domande-bolla-contenuto'}, el('p', {class: 'domande-bolla-chiede', testo: domanda}), el('div', {class: 'domande-bolla-risponde'}, el('p', {class: 'bolla-testo', testo: risposta})))));
    const elencoVivo = () => {
      const q = $$('.domanda-chiede', doc.querySelector('.domande')).slice(0, 4).map(h => h.textContent.trim()), a = $$('.domanda-risponde p', doc.querySelector('.domande')).slice(0, 4).map(p => p.textContent.trim());
      const x = el('div', {class: 'domande viva visto'}, el('ol', {class: 'domande-elenco'}, q.map((t, i) => el('li', {class: 'domanda'}, bottone(t, i === 2)))), bollaRisposta(q[2], a[2]));
      return conScript(x);
    };
    s.append(scheda({nome: 'Le domande, e la risposta nella bolla', id: '<code>.domande</code> <code>.domande.viva</code> <code>.domande-elenco</code> <code>.domanda</code> <code>.domanda-chiede</code> <code>.domanda-risponde</code> <code>.domanda-bottone</code> (<code>aria-expanded</code>) <code>.domande-bolla</code> <code>.domande-poi</code> (domande.css; sopra: bolla.css)',
      regola: 'Le domande di chi valuta Kalliope per un\'altra persona, in fila come i pulsanti-voce; si preme una domanda e la risposta arriva nella bolla, la stessa della riunione: <b>una risposta alla volta, breve</b>. Premuta una domanda, le parole di prima si spengono (140 ms), la bolla prende la misura nuova (FLIP, 420 ms) e le parole nuove entrano una volta sola dalla trasparenza. Al computer la bolla, senza coda, sta accanto all\'elenco e resta in vista sotto la barra; al telefono si apre sotto la domanda premuta, con la coda in alto verso di lei, e viene in vista. <b>Tastiera</b>: ogni domanda è un pulsante (Tab, Invio o Spazio), <code>aria-expanded</code> dice quale è aperta, la bolla è una regione con <code>aria-live="polite"</code> e la risposta è annunciata («Risposta: …»); il fuoco resta sul pulsante premuto. <b>Senza JavaScript</b> ogni domanda ha la sua risposta sotto, in due colonne (una al telefono). <b>Ciò che il gesto apre resta in vista</b>: la bolla comincia sotto la barra e, se ci sta, sta tutta nello schermo (al telefono con la domanda premuta sopra, se ci stanno insieme); sugli schermi bassi del computer la bolla appiccicosa sta a ridosso della barra (<code>--domande-bolla-sopra-basso</code>), e <b>una risposta più alta dello spazio sotto la barra non si appiccica</b> (<code>.domande-bolla.scorre</code>, <code>adatta()</code> in <code>stato.js</code>): sta accanto alla sua domanda, dov\'era, e scorre con la pagina, così si legge intera (a 844×390: «E se scrivere è difficile?», «Ha frasi pronte o simboli?», «Chi c\'è dietro?»); la scritta è la stessa. Dopo le domande, «Da mandare a chi ti aiuta» porta al messaggio senza attraversare il tratto per chi controlla.',
      confine: 'Non per le istruzioni né per un elenco di domande frequenti impilate: ogni risposta è breve e quello che non sappiamo è detto. Non per i moduli né per una conversazione.',
      persona: 'Chi valuta Kalliope per un\'altra persona (P3: «È adatto? Cosa serve? Costa? Limiti?»), spesso dal telefono.',
      provenienza: 'Frase delle cifre della home (dissolvenza incrociata e FLIP nella stessa bolla); pulsanti-voce con lo stato: R51 attraverso la home (<code>filo.css</code>); «il lungo solo a richiesta»: <code>progetto.md</code> §4.2 e R04 (<code>K/R04/044-clic.jpg</code>); le dieci domande e la bolla che resta in vista: progettuali (<code>design/lavoro/3b-stato/PIANO.md</code>); la bolla senza lampeggio e la coda verso la domanda: correzione dopo il giudizio (I2, M2).',
      prove: [
        prova1('senza JavaScript: ogni domanda con la sua risposta, in due colonne', domande(), 'largo'),
        prova1('con lo script, al computer: la domanda scelta (<code>aria-expanded="true"</code>) e la risposta nella bolla accanto', elencoVivo(), 'largo'),
        prova1('il comando della domanda: a riposo, al passaggio (<code>.sim-sopra</code>), al fuoco (<code>.sim-fuoco</code>), premuto (<code>.sim-premuto</code>), scelto', el('div', {class: 'cat-domande-stati'}, [['', false], ['sim-sopra', false], ['sim-fuoco', false], ['sim-premuto', false], ['', true]].map(([k, a]) => el('div', {class: 'domande viva'}, bottone('Quanto costa?', a, k)))), 'largo'),
        prova1('testo più lungo: la domanda e la risposta vanno a capo, la bolla cresce', (() => { const x = elencoVivo(); $$('.domanda-bottone', x)[0].textContent += ' E se mi serve per un\'altra persona che non sa usare il terminale di Linux?'; $('.bolla-testo', x).textContent += ' Una risposta più lunga di quella di prima, come in una lingua che ha bisogno di più parole: la bolla prende la misura nuova e nulla esce dal suo bordo.'; return x; })(), 'largo'),
        prova1('una risposta più alta dello spazio sotto la barra: non si appiccica, scorre con la pagina accanto alla sua domanda (<code>.scorre</code>, <code>--scorre-sposta</code>)', (() => { const x = elencoVivo(); const b = $('.domande-bolla', x); b.classList.add('scorre'); b.style.setProperty('--scorre-sposta', '5em'); return x; })(), 'largo'),
        viva(844, 390, PAGINA + '#per-chi', 'La pagina «stato» a 844×390 (telefono girato): le risposte più alte dello spazio', 'a 844×390 tre risposte non stanno sotto la barra: premile e scorri nel riquadro, la bolla scorre con la pagina e si legge intera', [['«E se scrivere è difficile?»', premi('#d-scrivere .domanda-bottone')], ['«Ha frasi pronte o simboli?»', premi('#d-frasi .domanda-bottone')], ['«Chi c\'è dietro?»', premi('#d-chi .domanda-bottone')]]),
        viva(1440, 900, PAGINA + '#per-chi', 'La pagina «stato»: le domande', 'le domande dal vivo, al computer: premi una domanda nel riquadro, o usa i comandi', [['«Quanto costa?»', premi('#d-costa .domanda-bottone')], ['«Chi c\'è dietro?»', premi('#d-chi .domanda-bottone')]]),
        viva(390, 844, PAGINA + '#per-chi', 'La pagina «stato» al telefono: le domande', 'al telefono la bolla si apre sotto la domanda premuta, con la coda in alto verso di lei', [['«Quanto costa?»', premi('#d-costa .domanda-bottone')], ['«Chi c\'è dietro?»', premi('#d-chi .domanda-bottone')]]),
      ]}));

    // =============================================================================================================
    // 4. il varco
    // =============================================================================================================
    const scenaVarco = (passo, tutti = true) => {
      const x = da('.varco-scena'); const v = $('.varco', x);
      v.dataset.passo = passo; x.classList.add('viva');
      $$('.varco-passo', x).forEach(p => p.classList.toggle('qui', p.dataset.passo === passo));
      if (!tutti) $('.varco-passi', x).remove();
      return conScript(x);
    };
    const soloVarco = passo => { const x = scenaVarco(passo, false); x.firstElementChild.classList.add('cat-varco-solo'); return x; };
    const passiNomi = [['tutto', 'tutto in vista (sopra il primo passo e sotto l\'ultimo, e senza script)'], ['testo', 'il testo che scrivi: il campo si accende, il bordo è chiuso'], ['scarico', 'una sola connessione: il filo e i tre file che scendono al disco (la discesa è dello script: si vede dal vivo)'], ['disco', 'che cosa scrive sul disco: il programma, la voce, le preferenze'], ['chiudi', 'quando chiudi: la finestra si chiude, il microfono sparisce, il disco resta']];
    s.append(scheda({nome: 'Il varco: che cosa entra nel computer, che cosa resta', id: '<code>.varco-scena</code> <code>.varco[data-passo]</code> (<code>tutto</code> <code>testo</code> <code>scarico</code> <code>disco</code> <code>chiudi</code>) <code>.varco-passi</code> <code>.varco-passo.qui</code> <code>.varco-fuori</code> <code>.varco-filo</code> <code>.varco-bordo</code> <code>.varco-finestra</code> <code>.varco-disco</code> <code>.varco-file</code> <code>.varco-pacchi</code> <code>.varco-mic</code> (varco.css; sopra: finestra.css)',
      regola: 'Il computer della strada visto da vicino, come oggetto: dentro la finestra di Kalliope con la frase scritta e le frasi già dette, il disco, il microfono «Kalliope». Il bordo ha <b>un solo varco</b>: da lì entra la voce, una volta, da «huggingface.co», in tre file controllati con la loro impronta. Accanto, quattro passi: a ogni passo che arriva a metà dello spazio che resta libero il computer mostra quel fatto: <i>il testo</i> (resta qui: il campo si accende e il bordo è chiuso), <i>lo scarico</i> (un filo lungo dal varco e tre impronte che scendono in fila al bordo del disco; «la voce · 53 MB» si accende), <i>il disco</i> (il programma, la voce e le preferenze; il campo e l\'elenco sono tratteggiati: «solo finché la finestra è aperta»), <i>la chiusura</i> (la finestra si chiude rimpicciolendo, il microfono sparisce, il disco resta). Al computer l\'oggetto resta in vista mentre si scorre; al telefono resta agganciato sotto la barra, e la fascia che conta sta sotto di lui. Sopra il primo passo e sotto l\'ultimo il computer mostra tutto. Senza JavaScript e con «riduci movimento» si vede tutto insieme, fermo (le impronte non scendono).',
      confine: 'Non per un diagramma di rete né per prestazioni: dice dove va il testo e che cosa si scrive sul disco, con il file del codice che lo dice. Le impronte che scendono sono frammenti d\'esempio, non le impronte vere.',
      persona: 'Chi deve controllare (P7): «dove va il mio testo, che cosa si scarica, che cosa resta sul disco, che cosa sparisce chiudendo».',
      provenienza: 'Il computer della strada della home («Sul tuo computer»); la schermata del prodotto con le didascalie sulle parti: R51 (<code>R/sequenze/R51/fotogrammi/scorri-istantaneo-1440x900-f03.jpg</code>), un tratto; l\'impronta detta in pagina: R50; la riunione ferma a lato mentre si scorre: home («Le tue frasi»); il filo, i file che scendono e «solo finché la finestra è aperta»: progettuali (<code>design/lavoro/3b-stato/PIANO.md</code>); i moltiplicatori della discesa sono token (<code>--pacco-corsa-*</code>).',
      prove: [
        el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', testo: 'i cinque passi: scegli quale mostra il computer (il passo accanto prende il bordo magenta)'}),
          (() => { const cont = el('div', {class: 'cat-quadro scena-chiara largo'}), mostra = p => { cont.replaceChildren(scenaVarco(p)); }; const barra = el('div', {class: 'cat-misure cat-passi'}); passiNomi.forEach(([p, et], i) => barra.append(el('button', {type: 'button', 'aria-pressed': String(i === 0), testo: p, title: et, onclick: ev => { $$('button', barra).forEach(b => b.setAttribute('aria-pressed', 'false')); ev.target.setAttribute('aria-pressed', 'true'); mostra(p); }}))); mostra('tutto'); return el('div', {}, barra, cont); })()),
        ...passiNomi.map(([p, et]) => prova1(`<code>data-passo="${p}"</code>: ${et}`, soloVarco(p), 'scena-chiara')),
        prova1('senza JavaScript: tutto in vista, i passi accanto', (() => { const x = da('.varco-scena'); return x; })(), 'scena-chiara largo'),
        prova1('testo più lungo: i passi e le etichette vanno a capo, nulla esce dalla cornice', (() => { const x = scenaVarco('disco'); $$('.varco-passo p', x).forEach(p => { p.append(' E un\'altra frase, più lunga, come in una lingua che ha bisogno di più parole per dire lo stesso.'); }); $$('.varco-file', x).forEach(f => { f.textContent += ' e un nome più lungo'; }); return x; })(), 'scena-chiara largo'),
        viva(1440, 900, PAGINA + '#controllare', 'La pagina «stato»: il tratto per chi controlla', 'il varco dal vivo: scorri nel riquadro e il computer cambia con il passo a metà schermo', [['Porta allo scarico', vai('.varco-passo[data-passo=scarico]', 'center')], ['Porta alla chiusura', vai('.varco-passo[data-passo=chiudi]', 'center')]]),
        viva(390, 844, PAGINA + '#controllare', 'La pagina «stato» al telefono: il tratto per chi controlla', 'al telefono il computer sta agganciato sotto la barra e i passi scorrono sotto di lui', [['Porta allo scarico', vai('.varco-passo[data-passo=scarico]', 'center')], ['Porta alla chiusura', vai('.varco-passo[data-passo=chiudi]', 'center')]]),
      ]}));

    // =============================================================================================================
    // 5. il messaggio da inoltrare
    // =============================================================================================================
    const inoltra = (f = () => {}) => { const x = sblocca(senzaSovrapposizione(da('.inoltra-tratto'))); $$('.senza-js', x).forEach(n => { n.hidden = true; n.style.display = 'none'; }); $$('.copia-fatto, .copia-errore', x).forEach(n => { n.hidden = true; }); f(x); return x; };
    const mostraEsito = (x, quale) => { const e = $(`.${quale}`, x); e.hidden = false; };
    s.append(scheda({nome: 'Il messaggio da inoltrare', id: '<code>.inoltra</code> <code>.bolla-inoltra</code> (<code>.copiata</code>) <code>.inoltra-testo</code> <code>.inoltra-indirizzo</code> <code>.copia-messaggio</code> <code>.inoltra-esito</code> (<code>.copia-fatto</code> <code>.copia-errore</code>) <code>.senza-js</code> <code>.inoltra-tratto.senza-appunti</code> <code>.comandi-inoltra</code> (inoltra.css; sopra: bolla.css, pulsanti.css)',
      regola: 'La fine del percorso di chi valuta Kalliope per un\'altra persona: <b>una pagina o un testo da inoltrare</b>. Lo stato di oggi in poche righe, nella bolla, scritto come una frase di Kalliope, con l\'indirizzo di questa pagina. <b>L\'indirizzo mostrato è quello copiato</b>: lo scrive la costruzione dai dati del sito (<code>{{kalliope.page.url}}</code>, lo stesso del <code>canonical</code>, nella cartella della lingua), non lo decide la pagina in cui si è aperto; chi lo copia ha ciò che la bolla mostra, senza i segni di verso che la costruzione mette attorno alle parti latine da destra a sinistra. La frase segue la versione (di prova o no: <code>data-release</code>). «Copia il messaggio» mette negli appunti il testo e l\'indirizzo; la bolla risponde con l\'anello della voce, come una frase appena detta, e sotto compare «Copiato: incollalo in un messaggio o in una e‑mail» (annunciato da <code>role="status"</code>; al computer sotto la fila dei comandi, al telefono subito sotto il pulsante). Se gli appunti non rispondono: «Non riesco a copiarlo: seleziona il testo della bolla e copialo, o manda l\'indirizzo di questa pagina». Senza JavaScript o dove gli appunti non si possono usare il comando non c\'è e resta la frase per copiare a mano (la bolla si seleziona con un clic). La risposta resta finché non si ripreme e, se è sotto il bordo, la pagina la porta in vista con il comando. Un indirizzo si legge sempre da sinistra a destra (<code>dir="ltr"</code> sul suo testo), anche in una pagina da destra a sinistra.',
      confine: 'Non è un modulo né raccoglie indirizzi: non manda niente, mette negli appunti. Non per messaggi lunghi: poche righe.',
      persona: 'Chi valuta Kalliope per un\'altra persona (P3) e deve portare via lo stato di oggi: «ha una pagina o un testo da inoltrare».',
      provenienza: 'Chiamata finale prima del piede: tratto comune (R03, R05, R52, R53); il comando «copia» con le sue due risposte: «non ancora» (<code>versioni.css</code>); il messaggio nella bolla: progettuale (<code>design/lavoro/3b-stato/PIANO.md</code>); l\'indirizzo dai dati del sito: giudizio M5.',
      prove: [
        prova1('a riposo, con lo script: il comando c\'è, nessuna risposta', inoltra(), 'largo'),
        prova1('copiato: la risposta e l\'anello della voce sulla bolla (<code>.copia-fatto</code>, <code>.copiata</code>): premi Riproduci per rivedere l\'anello', (() => { const x = inoltra(y => { mostraEsito(y, 'copia-fatto'); $('.bolla-inoltra', y).classList.add('copiata'); }); const b = $('.bolla-inoltra', x); return el('div', {}, controlli(['Riproduci', () => { b.classList.remove('copiata'); void b.offsetWidth; b.classList.add('copiata'); }]), x); })(), 'largo'),
        prova1('non riuscito (<code>.copia-errore</code>)', inoltra(x => mostraEsito(x, 'copia-errore')), 'largo'),
        prova1('senza appunti (<code>.senza-appunti</code>): niente comando, la frase per copiare a mano', (() => { const x = sblocca(senzaSovrapposizione(da('.inoltra-tratto'))); $$('.copia-messaggio', x).forEach(n => { n.hidden = true; }); $$('.copia-fatto, .copia-errore', x).forEach(n => { n.hidden = true; }); x.classList.add('senza-appunti'); return conScript(x); })(), 'largo'),
        prova1('senza JavaScript: niente comando, la frase per copiare a mano (la bolla si seleziona con un clic)', (() => { const x = senzaSovrapposizione(da('.inoltra-tratto')); return x; })(), 'largo'),
        prova1('testo più lungo: il messaggio e l\'indirizzo vanno a capo dentro la bolla', inoltra(x => { $$('.inoltra-testo', x).forEach(p => { p.append(' E altre parole, come in una lingua che ha bisogno di più spazio per dire lo stesso, perché la bolla prenda la misura nuova.'); }); mostraEsito(x, 'copia-fatto'); }), 'largo'),
        viva(1440, 900, PAGINA + '#inoltra', 'La pagina «stato»: il messaggio da inoltrare', 'il messaggio dal vivo: premi «Copia il messaggio» nel riquadro (gli appunti dipendono dal permesso del browser)', [['«Copia il messaggio»', premi('.copia-messaggio')]]),
        viva(390, 844, PAGINA + '#inoltra', 'La pagina «stato» al telefono: il messaggio da inoltrare', 'al telefono «Copiato…» sta subito sotto il pulsante', [['«Copia il messaggio»', premi('.copia-messaggio')]]),
      ]}));
    schermi.forEach(x => x.adatta());
  });

  // il rimpicciolimento si calcola quando il riquadro è nella pagina
  requestAnimationFrame(() => schermi.forEach(x => x.adatta()));
  const osserva = new ResizeObserver(() => schermi.forEach(x => x.adatta())); osserva.observe(document.body);
  window.__catalogoStato = {errori, schermi: schermi.length};
  const stato = $('#stato-catalogo'); if (stato && errori.length) stato.textContent += ` · pagina «stato»: ${errori.join(' · ')}`;
})();
