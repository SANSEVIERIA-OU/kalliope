/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il catalogo della finestra disegnata sulle pagine e del distintivo Slint (sito 0.3, 26/11/2026). Due schede e una tabella:
//  · «La finestra di Kalliope disegnata» (componenti/finestra.css): la finestra del programma ridotta a un disegno, nei suoi stati veri (Pronta, Preparo la voce,
//    Sto parlando, Nessuno ti sente, Manca il microfono, La voce non parte), con la barra, la riga di stato, la bolla tratteggiata e «Ferma» e «Di'». I colori, il
//    carattere, i raggi, il tratteggio e i tempi sono i ruoli --app-* della finestra del programma; le sole misure del disegno sono i token --finestra-*.
//  · «Il distintivo Slint» (componenti/distintivo.css): l'immagine ufficiale «Made with Slint», non modificata, sulla scena scura e sulla chiara, con la sua fonte e la sua licenza.
//  · i token --finestra-* e --distintivo-slint-*, letti da token.css all'apertura (non ricopiati).
// Come gli altri moduli non ha markup suo: copia i pezzi dalla pagina vera «installa» (nel sito costruito, in italiano, ../../it/installa/index.html) e li mostra con le classi
// e gli stati del sistema; gli stati caldi li compone come fa installa.js (window.Finestra non c'è nel catalogo: stessa scrittura, stesso risultato). Aggiunge le sue sezioni
// dopo «Componenti»: non tocca gli altri file né il nucleo.
(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, att = {}, ...figli) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(att)) { if (typeof v === 'function') e.addEventListener(k.replace(/^on/, ''), v); else if (k === 'html') e.innerHTML = v; else if (k === 'testo') e.textContent = v; else e.setAttribute(k, v); } for (const f of figli.flat()) if (f != null) e.append(f); return e; };
  const errori = [];
  const prova = async (nome, f) => { try { return await f(); } catch (e) { errori.push(`${nome}: ${e.message}`); return null; } };
  await new Promise(fine => { const t0 = performance.now(); (function chiedi() { if (window.__catalogo || performance.now() - t0 > 20000) fine(); else setTimeout(chiedi, 40); })(); });
  const PAGINA = '../../it/installa/index.html';
  const doc = await window.CatalogoDocumenti.leggi(PAGINA);
  const tokenCss = await fetch('../token.css').then(r => r.text());
  const prova1 = (et, nodo, classe = '') => el('div', {class: 'cat-prova' + (classe.includes('largo') ? ' intero' : '')}, el('span', {class: 'cat-et', html: et}), el('div', {class: 'cat-quadro ' + classe}, nodo));
  const scheda = ({nome, id, regola, confine, persona, provenienza, movimento, verifica, prove}) => el('article', {class: 'cat-scheda'}, el('h3', {testo: nome}),
    el('dl', {}, el('dt', {testo: 'Identificatore'}), el('dd', {html: id}), el('dt', {testo: 'Regola d\'uso'}), el('dd', {html: regola}), el('dt', {testo: 'Non si usa'}), el('dd', {html: confine}),
      el('dt', {testo: 'Persona e compito'}), el('dd', {html: persona}), el('dt', {testo: 'Provenienza'}), el('dd', {html: provenienza}),
      el('dt', {testo: 'Movimento'}), el('dd', {html: movimento}), el('dt', {testo: 'Verifica'}), el('dd', {html: verifica})),
    el('div', {class: 'cat-prove'}, prove));
  const radice = $('#cat'), indice = $('#indice');
  const apri = (id, titolo, nota, dopoDi) => {
    const s = el('section', {class: 'cat-sezione', id}); s.append(el('h2', {testo: titolo}));
    if (nota) s.append(el('p', {class: 'cat-nota', html: nota}));
    const ref = dopoDi && $('#' + dopoDi); if (ref) ref.after(s); else radice.append(s);
    const li = el('li', {}, el('a', {href: '#' + id, testo: titolo})); const rl = dopoDi && indice && $(`a[href="#${dopoDi}"]`, indice);
    if (rl) rl.parentElement.after(li); else if (indice) indice.append(li);
    return s;
  };
  // una copia della finestra del primo avvio della pagina «installa», con gli indirizzi che il catalogo risolve (le immagini stanno in ../)
  const copiaFinestra = () => {
    const c = doc.querySelector('.passo-apri .finestra.avvio').cloneNode(true);
    c.removeAttribute('id'); c.removeAttribute('tabindex'); c.classList.remove('entra', 'entra-finestra', 'prepara', 'errore', 'pronta');
    c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
    c.querySelectorAll('img').forEach(i => { const m = /marchio\/[a-z]+\.svg$/.exec(i.getAttribute('src') || ''); if (m) i.setAttribute('src', '../' + m[0]); });
    return c;
  };
  const NOMI = {
    pronta: ['Pronta', 'Nella riunione scegli «Kalliope» come microfono.'],
    prepara: ['Preparo la voce', 'Fra poco puoi scrivere e farti sentire.'],
    parla: ['Sto parlando', 'Esc la ferma.'],
    nessuno: ['Nessuno ti sente', 'Nessuno nella chiamata ha sentito la frase: nessuna app sta usando il microfono «Kalliope». Sceglilo come microfono nell\'app della riunione.'],
    microfono: ['Manca il microfono', 'La voce è pronta, ma …: per ora nessuno ti sentirà nelle chiamate.'],
    voce: ['La voce non parte', 'Manca la voce: in … non trovo …. Reinstalla Kalliope.'],
  };
  const stato = (nome, scrittura) => {
    const f = copiaFinestra(), riga = $('.f-stato', f), [titolo, detto] = NOMI[nome];
    $('.f-titolo', riga).textContent = titolo; $('.f-detto', riga).textContent = detto;
    f.classList.add(nome === 'prepara' ? 'prepara' : nome === 'voce' ? 'errore' : 'pronta');
    if (nome === 'parla') riga.classList.add('parla');
    if (['nessuno', 'microfono', 'voce'].includes(nome)) riga.classList.add('allarme');
    if (nome === 'pronta' || nome === 'parla' || nome === 'nessuno' || nome === 'microfono') $('.f-campo', f).classList.remove('spento');
    if (nome === 'parla') { const di = $('.f-di', f); if (di) di.classList.add('attivo'); }
    if (scrittura) { $('.f-campo', f).classList.add('pieno', 'fuoco'); const di1 = $('.f-di', f); if (di1) di1.classList.add('attivo'); const t = $('.f-testo-campo', f); t.append(el('span', {class: 'f-linea'}, el('span', {class: 'f-scritto', testo: scrittura}), el('span', {class: 'f-cursore'}))); }
    return f;
  };

  // ---------- la finestra disegnata ----------
  await prova('finestra', async () => {
    const s = apri('finestra-disegnata', 'La finestra di Kalliope, disegnata', 'La finestra del programma ridotta a un disegno per la home («Ascolta»), per il primo avvio e per le frasi della pagina «Installa». È sempre nel tema scuro, anche sulla scena chiara. Non è una finestra vera: è una ricostruzione, e le pagine lo dicono.', 'componenti');
    const stati = ['pronta', 'prepara', 'parla', 'nessuno', 'microfono', 'voce'];
    s.append(scheda({
      nome: 'La finestra di Kalliope disegnata', id: '<code>.finestra</code> con <code>.f-barra</code>, <code>.f-stato</code>, <code>.f-campo</code> (<code>componenti/finestra.css</code>)',
      regola: 'Mostra la finestra del programma nei suoi stati veri: la barra (logo vero, nome, voce), la riga di stato (nome e ciò che spiega; calda quando la voce non arriva), la bolla tratteggiata dove si scrive, con «Ferma» (Esc) e «Di\'» (Invio). Il nome e la spiegazione dello stato si scrivono con <code>window.Finestra.stato</code> (<code>componenti.js</code>).',
      confine: 'Non si usa per un\'altra finestra né per il menu del sistema; non si ridisegna con altri colori: i ruoli sono quelli del programma (<code>--app-*</code>). Non si mostra senza «Ricostruzione» accanto.',
      persona: 'Chi decide se installare Kalliope e chi lo installa per un\'altra persona: vedono com\'è la finestra e che cosa dice quando qualcosa non va.',
      provenienza: 'Direzione «La frase che si accende» approvata dal proprietario il 26/11/2026 (<code>design/lavoro/4-app/direzione/</code>); i colori sono i <code>--app-*</code> di <code>token.css</code> così come sono, le misure del disegno i <code>--finestra-*</code> (scelta: per stare in 470 px).',
      movimento: 'Il tratteggio cammina e il punto respira mentre la voce si prepara (1,4 s, <code>--app-durata-cammino</code>); le tre barre respirano mentre parla (460 ms); con «riduci movimento» stanno ferme. Nella home le parole si scuriscono nella bolla sopra la riunione (movimento già approvato, non cambiato).',
      verifica: 'Prove nella pagina vera a 1440, 1366 × 768, 390 e 320 px, in scuro, in <code>en-XA</code> e <code>ar-XB</code>; misure in <code>sito-03-prove/</code>.',
      prove: stati.map(n => prova1(NOMI[n][0] + (n === 'pronta' ? ' (con una frase che si scrive)' : ''), stato(n, n === 'pronta' ? 'Scusate, posso aggiungere' : ''), 'largo')),
    }));
    s.append(el('h3', {testo: 'Sulla scena chiara'}), prova1('lo stesso disegno, scuro, sulla scena chiara', el('div', {class: 'scena-chiara', style: 'padding: 1.5em'}, stato('nessuno')), 'largo'));
  });

  // ---------- il distintivo Slint ----------
  await prova('distintivo', async () => {
    const d = doc.querySelector('.distintivo-slint');
    if (!d) throw new Error('nella pagina «installa» manca il distintivo');
    const copia = () => { const c = d.cloneNode(true); c.querySelectorAll('img').forEach(i => i.setAttribute('src', '../terze-parti/slint/MadeWithSlint-logo-dark.svg')); return c; };
    const s = apri('distintivo-slint', 'Il distintivo Slint', 'L\'attribuzione che la licenza Slint Royalty-free 2.0 (§2) chiede su una pagina pubblica; l\'altra forma, <code>AboutSlint</code>, è in «Informazioni» nella finestra del programma (issue #21).', 'finestra-disegnata');
    s.append(scheda({
      nome: 'Il distintivo «Made with Slint»', id: '<code>.distintivo-slint</code> (<code>componenti/distintivo.css</code>); asset in <code>design-system/terze-parti/slint/</code>',
      regola: 'Sta nella pagina «Installa», nel passo «Scarica», vicino ai file che si scaricano, in un collegamento a <code>https://slint.dev/</code>, con la frase «La finestra di Kalliope è fatta con Slint». L\'immagine è <code>MadeWithSlint-logo-dark.svg</code> di Slint, <b>non modificata</b>: si ridimensiona solo in proporzione (<code>width</code>, <code>height: auto</code>).',
      confine: 'Non si cambiano i colori, le proporzioni o il ritaglio (CC-BY-ND-4.0); non si disegna un distintivo proprio; non si nasconde né si mette lontano dai file da scaricare.',
      persona: 'Chi scarica il programma e vuole sapere con che cosa è fatto; Slint, che ne chiede l\'attribuzione.',
      provenienza: 'Licenza Slint Royalty-free 2.0, §2(b): «Display the Slint attribution badge on a public webpage, preferably where the binaries of your Application can be downloaded from». File e licenza dell\'immagine: <code>terze-parti/slint/LEGGIMI.md</code> (fonte: slint-ui/slint, tag v1.19.1, <code>logo/MadeWithSlint-logo-dark.svg</code>; CC-BY-ND-4.0). Decisione del proprietario del 26/11/2026.',
      movimento: 'Nessuno. Il collegamento ha il fuoco visibile (anello della voce, 3 px).',
      verifica: 'Una prova automatica controlla che il distintivo ci sia nella pagina costruita (<code>tools/test_site_slint.py</code>); foto in scuro, a 390 px e in <code>ar-XB</code>.',
      prove: [prova1('sulla scena scura (come nella pagina)', el('div', {class: 'scena-notte', style: 'padding: 1em'}, copia()), 'largo'), prova1('sulla scena chiara', el('div', {class: 'scena-chiara', style: 'padding: 1em'}, copia()), 'largo')],
    }));
  });

  // ---------- i token: dalla fonte, non ricopiati ----------
  await prova('token', async () => {
    const s = $('#finestra-disegnata'); if (!s) return;
    const righe = [...tokenCss.matchAll(/^\s*(--(?:finestra|distintivo-slint)-[a-z0-9-]+):\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/gm)].map(m => ({nome: m[1], valore: m[2].trim(), ruolo: m[3] || ''}));
    s.append(el('h3', {testo: 'Le misure del disegno'}),
      el('p', {class: 'cat-nota', html: 'Lette da <code>token.css</code> all\'apertura (non ricopiate). Tutto il resto del disegno sono i ruoli <code>--app-*</code> della finestra: colori, carattere, pesi, raggi, spessore e passo del tratteggio, tempi e curve.'}),
      el('div', {class: 'cm-scorre'}, el('table', {class: 'cat-tabella'}, el('thead', {}, el('tr', {}, ...['Nome', 'Valore', 'Ruolo e fonte'].map(t => el('th', {testo: t})))),
        el('tbody', {}, ...righe.map(t => el('tr', {}, el('td', {class: 'n', testo: t.nome}), el('td', {class: 'v', testo: t.valore}), el('td', {testo: t.ruolo})))))));
    window.__catalogoFinestra = {token: righe.length};
  });

  const st = $('#stato-catalogo');
  window.__catalogoFinestra = {...(window.__catalogoFinestra || {}), errori};
  if (errori.length && st) st.textContent += ` · La finestra e il distintivo: ${errori.join(' · ')}`;
  if (window.__catalogo) window.__catalogo.errori.push(...errori.map(e => `finestra: ${e}`));
})().catch(e => { const st = document.querySelector('#stato-catalogo'); if (st) st.textContent += ` · La finestra e il distintivo: ${e.message}`; window.__catalogoFinestra = {errori: [e.message]}; if (window.__catalogo) window.__catalogo.errori.push(`finestra: ${e.message}`); });
