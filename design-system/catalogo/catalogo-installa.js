/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il catalogo della pagina «installa» (incarico 3c-b, 20/11/2026): i quattro componenti che ha portato nel sistema, con le loro varianti e i loro stati:
// la scelta del sistema (quattro scelte, fuoco, senza :has), il comando da copiare (a riposo, copiato, non riuscito, senza script, il numero da confrontare,
// il comando in una frase, sulla scena chiara), il terminale (in attesa, mentre scrive, righe sbiadite, impronta confrontata, riga trovata, da destra a
// sinistra) e l'installazione (il primo schermo prima e dopo, la cartella e i file, la finestra con ogni frase, il passo «Riuscito se… / Se no…», la ripresa,
// l'indirizzo copiato e non copiato). Come catalogo-stato.js non ha markup suo per i componenti: copia i pezzi dalla pagina vera (nel sito costruito, in
// italiano, ../../it/installa/index.html) e li mostra con le classi e gli stati del sistema. Ciò che è fatto da uno script (il comando che si scrive, le
// impronte che si confrontano, i file che scendono, la finestra che racconta il primo avvio) si guarda nella pagina viva, in un riquadro, e i comandi del
// catalogo premono i comandi veri del riquadro (stessa origine); ciò che il catalogo ricostruisce per mostrarlo usa gli stessi token della pagina.
// Sta in un file suo e aggiunge la sua sezione dopo quella di «stato»: non tocca gli altri file né il nucleo.
(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, att = {}, ...figli) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(att)) { if (typeof v === 'function') e.addEventListener(k.replace(/^on/, ''), v); else if (k === 'html') e.innerHTML = v; else if (k === 'testo') e.textContent = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); } e.append(...figli.flat().filter(x => x != null)); return e; };
  const errori = [];
  const prova = (nome, f) => { try { return f(); } catch (e) { errori.push(`${nome}: ${e.message}`); return null; } };
  const aspetta = (cond, max = 20000) => new Promise(fine => { const t0 = performance.now(); (function chiedi() { if (cond() || performance.now() - t0 > max) fine(); else setTimeout(chiedi, 40); })(); });
  await aspetta(() => window.__catalogo);
  await aspetta(() => window.__catalogoStato || $('#pagina-stato'));
  const PAGINA = '../../it/installa/index.html';
  const doc = new DOMParser().parseFromString(await (await fetch(PAGINA)).text(), 'text/html');
  const tutti = (sel, n = 0) => { const e = doc.querySelectorAll(sel)[n]; if (!e) throw new Error('nella pagina «installa» manca ' + sel); return e; };
  // una copia di un pezzo della pagina; gli id si tolgono (nel catalogo ce ne sono più copie), salvo dove una regola li nomina
  const da = (sel, n = 0, tieniId = false) => { const c = tutti(sel, n).cloneNode(true); if (!tieniId) { c.removeAttribute('id'); c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); } return c; };
  const testoPagina = k => { const m = doc.querySelector('template#testi-pagina'), n = m && m.content.querySelector(`[data-t="${k}"]`); return n ? n.textContent.trim() : k; };
  const sblocca = n => { n.querySelectorAll('[hidden]').forEach(x => x.removeAttribute('hidden')); return n; };
  // ciò che dipende dalla distribuzione: resta soltanto quello di una (nella pagina lo fanno i fogli di stile con :has)
  const soloSistema = (n, s) => { $$('[data-sistema]', n).forEach(x => { if (!x.dataset.sistema.split(' ').includes(s)) x.remove(); else x.removeAttribute('data-sistema'); }); return n; };
  const prova1 = (et, nodo, classe = '') => el('div', {class: 'cat-prova' + (classe.includes('largo') ? ' intero' : '')}, el('span', {class: 'cat-et', html: et}), el('div', {class: 'cat-quadro ' + classe}, nodo));
  const scheda = ({nome, id, regola, confine, persona, provenienza, movimento, verifica, prove}) => el('article', {class: 'cat-scheda'}, el('h3', {testo: nome}),
    el('dl', {}, el('dt', {testo: 'Identificatore'}), el('dd', {html: id}), el('dt', {testo: 'Regola d\'uso'}), el('dd', {html: regola}), el('dt', {testo: 'Non si usa'}), el('dd', {html: confine}),
      el('dt', {testo: 'Persona e compito'}), el('dd', {html: persona}), el('dt', {testo: 'Provenienza'}), el('dd', {html: provenienza}),
      el('dt', {testo: 'Movimento'}), el('dd', {html: movimento}), el('dt', {testo: 'Verifica'}), el('dd', {html: verifica})),
    el('div', {class: 'cat-prove'}, prove));
  const conScript = n => el('div', {class: 'js'}, n);
  const controlli = (...bottoni) => el('div', {class: 'cat-controlli'}, bottoni.map(([t, f]) => el('button', {type: 'button', testo: t, onclick: f})));
  const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const ms = n => { const v = tok(n); return v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000; };

  // ---------- una pagina viva a una misura: nel suo schermo vero, rimpicciolita per starci; i comandi del catalogo premono quelli veri ----------
  const schermi = [];
  function schermo(w, h, src, titolo) {
    const quadro = el('div', {class: 'cap-schermo'}), f = el('iframe', {title: titolo, width: w, height: h, loading: 'lazy', src});
    quadro.append(f);
    const adatta = () => { const sezione = $('#pagina-installa'), k = Math.min(1, ((sezione ? sezione.clientWidth : innerWidth) - 48) / w) || 1; quadro.style.width = `${Math.round(w * k)}px`; quadro.style.height = `${Math.round(h * k)}px`; f.style.transform = `scale(${k})`; };
    schermi.push({adatta, quadro}); quadro.adatta = adatta;
    quadro.ricarica = () => { try { f.contentWindow.location.reload(); } catch (e) { f.src = src; } };
    quadro.dentro = fn => { try { return fn(f.contentWindow, f.contentDocument); } catch (e) { errori.push('riquadro: ' + e.message); } };
    return quadro;
  }
  const viva = (w, h, src, titolo, etichetta, anche = []) => {
    const q = schermo(w, h, src, titolo);
    return el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', html: etichetta}), controlli(['Riproduci', () => q.ricarica()], ...anche.map(([t, f]) => [t, () => f(q)])), q);
  };
  const vai = (sel, blocco = 'start') => q => q.dentro((w, d) => { const e = d.querySelector(sel); if (e) e.scrollIntoView({block: blocco, behavior: 'instant'}); });
  const premi = sel => q => q.dentro((w, d) => { const e = d.querySelector(sel); if (e) { e.scrollIntoView({block: 'center', behavior: 'instant'}); e.click(); } });
  const appuntiFinti = riesce => q => q.dentro(w => { Object.defineProperty(w.navigator, 'clipboard', {value: {writeText: () => riesce ? Promise.resolve() : Promise.reject(new Error('no'))}, configurable: true}); });

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

  prova('pagina-installa', () => {
    const s = apri('pagina-installa', 'Pagina «installa»: la scelta del sistema, il comando, il terminale e l\'installazione',
      'Quattro componenti nuovi (<code>scelta-sistema.css</code>, <code>comando.css</code>, <code>terminale.css</code>, <code>installazione.css</code>), sopra la cornice delle pagine interne. Sono copiati dalla pagina vera (<code>website/installa/index.html</code>, nel sito costruito in italiano) e coperti dagli stessi fogli: ciò che fa lo script (il comando che si scrive, le impronte che si confrontano, i file che scendono, la finestra che racconta il primo avvio, la scelta che riscrive i comandi) si prova nella pagina viva, in un riquadro. Le prove (larghezze, motori, stati, lingue, tastiera, copia, senza JavaScript) e i loro numeri sono in <code>design/lavoro/3c-installa/costruzione/</code>; il piano dei tratti in <code>design/lavoro/3c-installa/PIANO.md</code>.',
      'pagina-stato');

    // =============================================================================================================
    // 1. la scelta del sistema
    // =============================================================================================================
    let gruppi = 0;
    // le quattro scelte, inerti (le vere stanno nei riquadri vivi): un nome di gruppo per esemplare, perché in una pagina i bottoni d'opzione dello stesso nome sono un gruppo solo
    const scelta = (valore, f = () => {}) => {
      const x = da('.sistemi', 0, true); x.removeAttribute('id'); gruppi++;
      $$('label', x).forEach(l => l.removeAttribute('for'));
      $$('.sistema-voce', x).forEach(r => { r.name = 'cat-sistema-' + gruppi; r.checked = r.value === valore; });
      x.style.animation = 'none'; f(x); x.inert = true; return x;
    };
    // dentro la pagina (.sistemi-pagina): così i fogli di stile mostrano della riga sotto le scelte soltanto quella della voce scelta
    const inPagina = x => el('div', {class: 'sistemi-pagina'}, x);
    // la scelta con ciò che ne dipende: i comandi della pagina, come li mostra il foglio di stile (con :has) per la distribuzione scelta
    const conComandi = (valore, f = () => {}) => {
      const x = scelta(valore, f), comandi = $$('.installa-comandi > [data-sistema]', doc).map(c => c.cloneNode(true));
      const pagina = el('div', {class: 'sistemi-pagina cat-sistemi-pagina'}, x, el('div', {class: 'cat-comandi-sistema'}, comandi));
      pagina.inert = true; return pagina;
    };
    s.append(scheda({nome: 'La scelta del sistema', id: '<code>.sistemi</code> (<code>fieldset</code>) <code>.sistemi-scelte</code> <code>.sistema-voce</code> (<code>input[type=radio]</code> + <code>label</code>) <code>.sistemi-dice</code> <code>.non-linux</code> <code>.sistemi-pagina</code> <code>[data-sistema]</code> (scelta-sistema.css; sulla cornice: <code>#comandi-apertura .scarica[data-sistema]</code>)',
      regola: 'Quattro bottoni d\'opzione disegnati come i pulsanti-voce della home (R51 attraverso <code>filo.css</code>): la distribuzione scelta è piena, le altre hanno il bordo. <b>Da quella scelta dipende ciò che la pagina mostra</b>: ogni elemento con <code>data-sistema="…"</code> si vede soltanto se fra i suoi valori c\'è il sistema scelto («deb rpm» vale per due). Lo fanno i fogli di stile, con <code>:has</code>: <b>senza JavaScript la scelta funziona</b>; dove <code>:has</code> non c\'è si vede tutto, ogni comando con il suo sistema. Sotto, una riga dice che cosa vuol dire la scelta (le versioni, il tipo di file) e la risposta di chi non ha Linux. Il bottone vero resta (tastiera, lettori di schermo) e non si vede: si vede la sua etichetta; il fuoco ha l\'anello della voce.',
      confine: 'Non per scegliere fra due cose uguali né per le impostazioni: è la scelta di quale <b>comando</b> mostrare. Non si salva da nessuna parte (niente cookie, niente deposito del sito): la scelta resta con la cronologia della scheda (<code>history.state</code>), tornando indietro e ricaricando, e sparisce con la scheda. Non per più di cinque voci.',
      persona: 'Chi installa (P4, F1) o chi installa per un\'altra persona (F4): un browser non sa dire Debian da Fedora, quindi sceglie lui, una volta, e la pagina gli dà un comando solo.',
      provenienza: 'Pulsanti-voce di R51 attraverso la home (<code>filo.css</code>); il pulsante del proprio sistema con le alternative accanto: R05 LALAL.AI (<code>K/R05/014-vai.jpg</code>); «un comando solo per volta» contro le schede di scarico in fila (R50, R05): <code>design/lavoro/3c-installa/PIANO.md</code>; la scelta senza script con <code>:has</code>: progettuale.',
      movimento: 'Il bottone pieno cambia con una transizione di sfondo e bordo (<code>--durata-voce-sfondo</code>, <code>--durata-voce-bordo</code>, curva <code>--curva-dolce</code>, 240 ms); premuto, scala a <code>--voce-premuto-scala</code> (0,97). Il gruppo entra con il primo schermo (<code>sale12</code>, <code>--ritardo-sistemi</code> 580 ms). I pulsanti del file non scelti restano fermi e invisibili: nessuna entrata si ripete a ogni scelta, nemmeno senza JavaScript. Con «riduci movimento» le durate sono di 1 ms.',
      verifica: 'Scenari <code>primo</code>, <code>sistema</code> (mouse, tocco, frecce), <code>ancore</code>, <code>a-meta</code> (scelta cambiata a metà dell\'arrivo, del confronto, della discesa, a raffica), <code>ritorno</code> e <code>ricarica</code> (la scelta resta con la cronologia della scheda), <code>senza-js</code> di <code>prove/robustezza.mjs</code>; esame dell\'impaginazione e dispositivi con gli stati «archivio» e «menu»: numeri e data in <code>design/lavoro/3c-installa/costruzione/esiti/</code>.',
      prove: [
        prova1('le quattro scelte: Debian e Ubuntu scelta (a riposo), con la riga che dice che cosa vuol dire', inPagina(scelta('deb')), 'largo'),
        ...['rpm', 'arch', 'tar'].map(v => prova1(`<code>${v}</code> scelta: il bottone pieno cambia, la riga sotto dice le sue versioni`, inPagina(scelta(v)), 'largo')),
        prova1('al passaggio (<code>.sim-sopra</code>), al fuoco (<code>.sim-fuoco</code>: l\'anello della voce), premuto (<code>.sim-premuto</code>) sulla voce «Fedora»', el('div', {class: 'cat-scelte-stati'}, ['sim-sopra', 'sim-fuoco', 'sim-premuto'].map(k => inPagina(scelta('deb', x => { if (k === 'sim-fuoco') $$('.sistema-voce', x)[1].classList.add(k); else $$('label', x)[1].classList.add(k); $('.sistemi-dice', x).style.display = 'none'; })))), 'largo'),
        prova1('ciò che dipende dalla scelta: <b>Debian e Ubuntu</b>, un comando', conComandi('deb'), 'largo'),
        prova1('ciò che dipende dalla scelta: <b>Fedora</b>, un comando e la sua nota (il pacchetto non è firmato, dnf avvisa)', conComandi('rpm'), 'largo'),
        prova1('ciò che dipende dalla scelta: <b>Arch</b>, tre comandi (la ricetta scarica l\'archivio da sé)', conComandi('arch'), 'largo'),
        prova1('ciò che dipende dalla scelta: <b>Altre</b> (l\'archivio), tre comandi, senza password', conComandi('tar'), 'largo'),
        prova1('senza <code>:has</code> (un browser vecchio): nessuna regola si applica, si vede tutto, ogni comando con il suo sistema', (() => { const x = conComandi('deb'); x.classList.remove('sistemi-pagina'); return x; })(), 'largo'),
        prova1('testo più lungo (un\'altra lingua): le quattro voci e la riga vanno a capo, nulla esce', inPagina(scelta('arch', x => { $$('label', x)[0].textContent += ' e tutte le sue parenti'; $$('.sistemi-dice span', x).forEach(sp => { sp.textContent += ', e una frase più lunga come in una lingua che ha bisogno di più spazio per dirlo'; }); })), 'largo'),
        prova1('da destra a sinistra: l\'ordine delle voci si specchia, i nomi dei file restano da sinistra a destra', el('div', {dir: 'rtl'}, inPagina(scelta('rpm'))), 'largo'),
        viva(1440, 900, '../../it/installa/', 'La pagina «installa»: il primo schermo', 'il primo schermo dal vivo: premi una distribuzione nel riquadro, o usa i comandi: il pulsante del file, la riga e il comando del terminale diventano i suoi', [['«Fedora»', premi('label[for=sistema-rpm]')], ['«Arch»', premi('label[for=sistema-arch]')], ['«Altre»', premi('label[for=sistema-tar]')], ['«Debian e Ubuntu»', premi('label[for=sistema-deb]')]]),
        viva(390, 844, '../../it/installa/', 'La pagina «installa» al telefono: il primo schermo', 'al telefono la scelta sta subito prima del pulsante, a due colonne', [['«Fedora»', premi('label[for=sistema-rpm]')], ['«Arch»', premi('label[for=sistema-arch]')]]),
        viva(844, 390, '../../it/installa/', 'La pagina «installa» a 844×390 (telefono girato)', 'telefono girato: titolo e frase alla misura del telefono, la scelta e il pulsante del file nello schermo', [['«Altre»', premi('label[for=sistema-tar]')]]),
      ]}));

    // =============================================================================================================
    // 2. il comando da copiare
    // =============================================================================================================
    const comandi = () => $$('.passo .comando, .installa-comandi .comando', doc);
    const esempio = (cercato, sistema) => { const c = comandi().find(x => $('code', x).textContent.includes(cercato) && (!sistema || x.dataset.sistema === sistema)); if (!c) throw new Error('manca il comando ' + cercato); return c; };
    // il comando con il suo «Copia» (lo mette lo script, installa.js: la stessa struttura e le stesse classi)
    const comando = (cerca, sistema, f = () => {}, conCopia = true) => {
      const c = esempio(cerca, sistema).cloneNode(true); c.removeAttribute('data-sistema');
      if (conCopia) {
        const b = el('button', {type: 'button', class: 'copia', 'aria-label': 'Copia: ' + $('code', c).textContent.trim()}, el('span', {class: 'etichette'}, el('span', {class: 'se-fermo', testo: 'Copia'}), el('span', {class: 'se-fatto', 'aria-hidden': 'true', testo: 'Copiato'})));
        c.append(b);
      }
      f(c); return c;
    };
    const comandoVivo = (cerca, sistema) => {
      const c = comando(cerca, sistema), b = $('.copia', c);
      b.addEventListener('click', () => { c.classList.add('copiato'); const err = c.nextElementSibling; if (err && err.classList.contains('comando-errore')) err.remove(); setTimeout(() => c.classList.remove('copiato'), ms('--durata-comando-copiato')); });
      return c;
    };
    const conErrore = c => el('div', {}, c, el('p', {class: 'comando-errore', role: 'status', testo: testoPagina('in.copia.errore')}));
    const frase = () => el('div', {class: 'esito-passo'}, da('.passo-installa .esito-passo p.riuscito'));
    s.append(scheda({nome: 'Il comando da copiare', id: '<code>.comando</code> (<code>.copiato</code>, <code>.comando-numero</code>, <code>.comando-centro</code>) <code>pre code</code> <code>.copia</code> (<code>.etichette</code> <code>.se-fermo</code> <code>.se-fatto</code>) <code>.comando-errore</code>; il comando in una frase: <code>.esito-passo code</code>, <code>.nota-passo code</code> (comando.css)',
      regola: 'Un comando del terminale <b>com\'è</b>, nel carattere del terminale, con il suo «Copia» alla fine della riga. <b>Si legge sempre da sinistra a destra</b>, anche in una pagina da destra a sinistra (un comando non si traduce né si specchia). Premuto «Copia» l\'etichetta dice «Copiato» per 1,6 s <b>nella stessa cella</b> (il pulsante non cambia larghezza) e il bordo prende la luce della voce; se il browser non lascia copiare, <b>sotto il comando</b> compare la frase per farlo a mano e il comando resta selezionato, finché non si preme di nuovo. Senza JavaScript non c\'è «Copia»: un clic seleziona il comando intero (<code>user-select: all</code>) e si copia con la tastiera. Un numero da confrontare (un\'impronta) è un <code>.comando-numero</code>: le cifre più distanziate e nel colore della voce. Un comando dentro una frase è una pillola sottile.',
      confine: 'Non per testo che non si scrive in un terminale (una frase, un indirizzo da inoltrare: quello è la bolla); non si modifica prima di copiarlo (la pagina lo dice: «copiali come sono»). Non lancia niente: mette negli appunti.',
      persona: 'Chi installa (F1): copia dalla pagina e incolla nel terminale, senza sbagliare un carattere; chi installa per un\'altra persona (F4) le dice di fare lo stesso.',
      provenienza: 'Il comando che si copia e il suo esito: «non ancora» e «stato» (<code>versioni.css</code>, <code>inoltra.css</code>: «Copiato» e la frase per copiare a mano); le scorciatoie nel carattere a spaziatura fissa: R50 (<code>K/R50/desktop/004-scorri.jpg</code>, concorrente diretto, non un vincitore: dichiarato); il comando-numero e la riga nel carattere del terminale: progettuali.',
      movimento: '«Copiato» nella stessa cella per <code>--durata-comando-copiato</code> (1,6 s), con il bordo e l\'alone della voce (<code>--comando-copiato-ombra</code>) che vanno con <code>--durata-voce-bordo</code>; la frase per copiare a mano non si muove e resta finché non si ripreme. Interruzione: premere di nuovo riparte da capo il conto. Con «riduci movimento» lo stato cambia di colpo, senza alone animato.',
      verifica: 'Scenario <code>copia</code> nei tre motori: ogni «Copia» copia il suo comando com\'è (per ogni distribuzione), «Copiato» e ritorno, la frase se gli appunti non lasciano (e resta, e poi riesce), senza appunti, appunti veri (Chromium), annuncio; <code>senza-js</code>; stati «copia fatta» e «copia non riuscita» dell\'esame; numeri e data in <code>design/lavoro/3c-installa/costruzione/esiti/</code>.',
      prove: [
        prova1('a riposo: il comando e «Copia»', conScript(comando('sudo apt install', 'deb')), 'largo'),
        prova1('al passaggio (<code>.sim-sopra</code>), al fuoco (<code>.sim-fuoco</code>), premuto (<code>.sim-premuto</code>) sul pulsante «Copia»', conScript(el('div', {class: 'cat-comandi-stati'}, ['sim-sopra', 'sim-fuoco', 'sim-premuto'].map(k => comando('sudo dnf install', 'rpm', c => $('.copia', c).classList.add(k))))), 'largo'),
        prova1('copiato (<code>.copiato</code>): «Copiato» nella stessa cella, il bordo e l\'alone della voce', conScript(comando('sudo apt install', 'deb', c => c.classList.add('copiato'))), 'largo'),
        prova1('non riuscito: sotto il comando la frase per copiarlo a mano (<code>.comando-errore</code>, stato annunciato)', conScript(conErrore(comando('sudo apt install', 'deb'))), 'largo'),
        prova1('dal vivo: premi «Copia» (la risposta è la stessa della pagina: «Copiato» per 1,6 s; gli appunti non si toccano)', conScript(comandoVivo('makepkg -si', 'arch')), 'largo'),
        prova1('senza JavaScript: niente «Copia», un clic seleziona il comando intero', comando('./install', 'tar', () => {}, false), 'largo'),
        prova1('il numero da confrontare (<code>.comando-numero</code>): le cifre distanziate, nel colore della voce, a capo dove capita', conScript((() => { const c = $$('.comando-numero', doc)[0].cloneNode(true); c.removeAttribute('data-sistema'); c.append(el('button', {type: 'button', class: 'copia', 'aria-label': 'Copia', }, el('span', {class: 'etichette'}, el('span', {class: 'se-fermo', testo: 'Copia'}), el('span', {class: 'se-fatto', 'aria-hidden': 'true', testo: 'Copiato'})))); return c; })()), 'largo'),
        prova1('un comando dentro una frase: la pillola sottile (<code>.esito-passo code</code>), selezionabile con un clic', frase(), 'largo'),
        prova1('sulla scena chiara: il comando scuro, come la finestra della riunione sulla stessa scena', conScript(comando('sudo apt install', 'deb')), 'scena-chiara cat-quadro-chiaro largo'),
        prova1('testo più lungo: il comando va a capo dove capita (<code>overflow-wrap: anywhere</code>), «Copia» resta alla fine della prima riga', conScript(comando('curl -L -o PKGBUILD', 'arch', c => { $('code', c).textContent += ' && cd un-altro-posto/molto/lungo/che/non/sta/su/una/riga/sola && ./install --remove'; })), 'largo'),
        prova1('da destra a sinistra: il comando si legge da sinistra a destra, «Copia» sta alla fine della riga (a sinistra)', el('div', {dir: 'rtl'}, conScript(comando('sudo apt install', 'deb'))), 'largo'),
        viva(1440, 900, '../../it/installa/#passo-controlla', 'La pagina «installa»: il controllo dell\'impronta', 'il comando dal vivo: premi «Copia» nel riquadro (gli appunti si simulano: copiato o non riuscito)', [['Appunti che funzionano', appuntiFinti(true)], ['Appunti che non funzionano', appuntiFinti(false)], ['«Copia» del primo comando', premi('#passo-controlla .copia')]]),
        viva(390, 844, '../../it/installa/#passo-controlla', 'La pagina «installa» al telefono: il controllo dell\'impronta', 'al telefono il comando sta sotto la cartella e il terminale, e va a capo', [['Appunti che funzionano', appuntiFinti(true)], ['«Copia» del primo comando', premi('#passo-controlla .copia')]]),
      ]}));

    // =============================================================================================================
    // 3. il terminale
    // =============================================================================================================
    // le impronte a gruppi di otto cifre (come installa.js, che lo fa con lo script; senza, l'impronta intera)
    const aGruppi = x => { $$('.t-impronta', x).forEach(e => { const t = e.textContent.trim(); if (!/^[0-9a-f]{16,}$/i.test(t)) return; e.textContent = ''; for (let i = 0; i < t.length; i += 8) e.append(el('span', {class: 't-gruppo', testo: t.slice(i, i + 8)})); }); return x; };
    const terminale = (cerca, sistema, f = x => x) => { const t = da(cerca); soloSistema(t, sistema); return f(t); };
    const mostraTutto = t => { $$('.t-riga', t).forEach(r => r.classList.add('t-mostra')); return t; };
    // un comando che si scrive: la parte fatta, il cursore, la parte che manca (c'è già, ma non si vede: la riga non cambia altezza)
    const scrive = (t, n) => { const e = $('.t-comando .t-scrive, .t-comando > span:last-child', t); const intero = e.textContent; e.textContent = ''; e.append(el('span', {class: 't-fatto', testo: intero.slice(0, n)}), el('span', {class: 't-cursore'}), el('span', {class: 't-resto', testo: intero.slice(n)})); return t; };
    const soloComando = t => { t.classList.add('in-attesa'); $$('.t-riga', t).forEach(r => r.classList.remove('t-mostra')); const c = $('.t-comando', t); if (c) c.classList.add('t-mostra'); return t; };
    // il confronto dell'impronta dal vivo: gli stessi tempi dello script (installa.js, confronta())
    const confrontoVivo = x => { const t = $('.terminale-controllo', x); $$('.t-gruppo', t).forEach(g => g.classList.remove('uguale')); t.classList.add('in-attesa'); mostraTutto(t); const a = $$('.t-corpo .t-impronta .t-gruppo', t), b = $$('.t-pubblicato .t-gruppo', t); a.forEach((g, i) => setTimeout(() => { g.classList.add('uguale'); if (b[i]) b[i].classList.add('uguale'); }, i * ms('--passo-gruppo-impronta'))); setTimeout(() => t.classList.remove('in-attesa'), a.length * ms('--passo-gruppo-impronta')); };
    const scriveVivo = x => { const t = $('.terminale', x); const e = $('.t-comando > span:last-child', t); const intero = e.dataset.intero || (e.dataset.intero = e.textContent); soloComando(t); let i = 0; const una = () => { i++; scrive(t, i); if (i < intero.length) setTimeout(una, ms('--passo-lettera')); else { e.textContent = intero; t.classList.remove('in-attesa'); mostraTutto(t); } }; e.textContent = intero; scrive(t, 0); setTimeout(una, ms('--passo-lettera')); };
    s.append(scheda({nome: 'Il terminale ricostruito', id: '<code>.terminale</code> <code>.t-barra</code> <code>.t-titolo</code> <code>.t-corpo</code> <code>.t-riga</code> (<code>.t-comando</code> <code>.t-risposta</code> <code>.t-tuo</code> <code>.t-trovato</code> <code>.t-mostra</code> <code>.t-entra</code>) <code>.t-prompt</code> <code>.t-cursore</code> <code>.t-scrive</code> (<code>.t-fatto</code> <code>.t-resto</code>) <code>.t-gruppo</code> (<code>.uguale</code>) <code>.t-confronto</code> <code>.t-esito</code> <code>.in-attesa</code> (terminale.css)',
      regola: 'La finestra del terminale di chi installa, disegnata nel mondo della pagina (il fondo della notte, il bordo dei pannelli): <b>nessun terminale di un sistema copiato</b>. Dentro, il testo vero dove lo conosciamo (il comando, ciò che scrive <code>./install</code>, l\'impronta, la parola «kalliope», la versione) e <b>una riga sbiadita</b> dove la risposta dipende dal computer di chi installa (ciò che stampa apt, le altre sorgenti audio, la cartella di casa): la pagina non inventa ciò che non sa. Il comando si scrive lettera per lettera (33 ms) <b>dentro lo spazio che avrà</b>, le risposte compaiono una riga alla volta (300 ms), un\'impronta si confronta a gruppi di otto cifre che si accendono insieme, da sinistra a destra, e alla fine nasce «Uguale, cifra per cifra». Il contenuto <b>si legge da sinistra a destra</b> anche da destra a sinistra. Senza JavaScript (e con «riduci movimento») ha già tutte le righe, le impronte intere e l\'esito scritto.',
      confine: 'Non per ciò che si scrive davvero (quello è un «comando da copiare»); non finge l\'uscita di un programma che non conosciamo: la riga sbiadita lo dice. Non è interattivo e non è nell\'ordine del fuoco: ciò che mostra sta anche scritto nella pagina, come comando che si copia.',
      persona: 'Chi installa (F1): vede, accanto al passo, ciò che il suo computer risponderà se va tutto bene (la riga che si accende, l\'impronta uguale), e sa se deve preoccuparsi.',
      provenienza: 'Al posto della bolla del primo schermo: progettuale (nella bolla di «non ancora» e di «stato» c\'è ciò che dici nella riunione; qui ciò che scrivi); il riquadro fermo accanto ai passi: R50 (<code>K/R50/desktop/003-scorri.jpg</code>); la riga di <code>./install</code> e di makepkg: i testi veri (<code>packaging/linux/install</code> a <code>v0.1-rc.1</code>); la riga sbiadita, il confronto a gruppi e «Uguale»: progettuali, dichiarati.',
      movimento: 'Lettera per lettera a <code>--passo-lettera</code> (33 ms; 14 ms se la distribuzione cambia mentre scrive), una pausa all\'invio (<code>--pausa-invio</code> 260 ms), le righe a <code>--passo-riga-terminale</code> (300 ms) con l\'entrata di <code>--durata-t-riga</code>; i gruppi dell\'impronta a <code>--passo-gruppo-impronta</code> (130 ms, <code>--durata-t-gruppo</code> 180 ms); il cursore lampeggia (<code>lampeggia</code>, <code>--durata-f-campo-f-cursore</code>). Una scelta nuova annulla il racconto in corso e lo rifà dall\'inizio; con la scheda in secondo piano l\'orologio si ferma. Con «riduci movimento» e senza JavaScript: tutte le righe, impronte intere, «Uguale» scritto.',
      verifica: 'Scenari <code>a-meta</code>, <code>secondo-piano</code>, <code>scorrimento</code>, <code>ridotto</code>, <code>senza-js</code>, <code>ricarica</code> di <code>prove/robustezza.mjs</code> (tutte le scene arrivano allo stato finale dopo una scorsa veloce, un ritorno, una scheda nascosta); numeri e data in <code>design/lavoro/3c-installa/costruzione/esiti/</code>.',
      prove: [
        prova1('a riposo, senza JavaScript e con «riduci movimento»: tutte le righe, l\'impronta intera e «Uguale» scritto', (() => { const x = el('div', {class: 'cat-terminale'}, terminale('.terminale-controllo', 'deb')); return x; })(), 'largo'),
        prova1('in attesa, con lo script: solo il comando, le righe che verranno non si vedono ma tengono il posto (<code>.in-attesa</code>)', conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-controllo', 'deb', t => soloComando(aGruppi(t))))), 'largo'),
        prova1('mentre scrive: la parte fatta, il cursore, la parte che manca già nello spazio (<code>.t-scrive</code>, <code>.t-fatto</code>, <code>.t-resto</code>)', conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-palco', 'rpm', t => scrive(soloComando(t), 12)))), 'largo'),
        prova1('le righe sbiadite (<code>.t-tuo</code>, lunga e corta): ciò che dipende dal computer di chi installa', conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-palco', 'deb', mostraTutto))), 'largo'),
        prova1('la risposta vera di <code>./install</code> (in inglese, com\'è) e la cartella di casa sbiadita, poi <code>kalliope --version</code> con la versione dai dati', conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-installa', 'tar', mostraTutto))), 'largo'),
        prova1('l\'impronta a gruppi di otto cifre, confrontata a metà (<code>.t-gruppo.uguale</code>): i gruppi uguali prendono la luce della voce', conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-controllo', 'deb', t => { aGruppi(t); mostraTutto(t); t.classList.add('in-attesa'); $$('.t-gruppo', t).forEach((g, i) => { if (i % 8 < 4) g.classList.add('uguale'); }); return t; }))), 'largo'),
        prova1('l\'impronta confrontata fino in fondo: «Uguale, cifra per cifra»', conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-controllo', 'deb', t => { aGruppi(t); mostraTutto(t); $$('.t-gruppo', t).forEach(g => g.classList.add('uguale')); return t; }))), 'largo'),
        prova1('dal vivo: premi Riproduci (le stesse fasi e gli stessi tempi della pagina: il comando e la risposta, poi i gruppi che si accendono uno a uno)', (() => { const x = conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-controllo', 'deb', t => aGruppi(mostraTutto(t))))); return el('div', {}, controlli(['Riproduci', () => confrontoVivo(x)]), x); })(), 'largo'),
        prova1('dal vivo: il comando che si scrive, lettera per lettera (premi Riproduci)', (() => { const x = conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-palco', 'arch', mostraTutto))); return el('div', {}, controlli(['Riproduci', () => scriveVivo(x)]), x); })(), 'largo'),
        prova1('la riga trovata: «kalliope» fra le sorgenti audio (<code>.t-trovato</code>), la parte che il computer sceglie è sbiadita', conScript(el('div', {class: 'cat-terminale'}, da('.terminale-microfono'))), 'largo'),
        prova1('testo più lungo: l\'impronta e il comando vanno a capo dentro la finestra, nulla esce', conScript(el('div', {class: 'cat-terminale cat-stretto'}, terminale('.terminale-controllo', 'tar', t => aGruppi(mostraTutto(t))))), 'largo'),
        prova1('da destra a sinistra: la finestra sta dove la mette la scena, ciò che c\'è dentro si legge da sinistra a destra', el('div', {dir: 'rtl'}, conScript(el('div', {class: 'cat-terminale'}, terminale('.terminale-controllo', 'deb', t => aGruppi(mostraTutto(t)))))), 'largo'),
        viva(1440, 900, '../../it/installa/#scarica', 'La pagina «installa»: il file e l\'impronta', 'il terminale dal vivo: scorri nel riquadro e l\'impronta si confronta, otto cifre alla volta; cambia distribuzione in alto e i comandi diventano i suoi', [['Porta al controllo', vai('#passo-controlla', 'center')], ['«Arch»', premi('label[for=sistema-arch]')]]),
        viva(390, 844, '../../it/installa/#scarica', 'La pagina «installa» al telefono: il file e l\'impronta', 'al telefono la cartella e il terminale vengono prima dei due passi', [['Porta al controllo', vai('#passo-controlla', 'center')]]),
      ]}));

    // =============================================================================================================
    // 4. l'installazione
    // =============================================================================================================
    const palco = (f = x => x) => { const x = da('.palco-installa'); soloSistema(x, 'deb'); x.style.position = 'relative'; return f(x); };
    const cartella = (sistema) => { const x = da('.cartella'); soloSistema(x, sistema); return x; };
    const disco = (sistema, f = x => x) => { const x = da('.disco'); x.classList.remove('entra'); soloSistema(x, sistema); return f(x); };
    const avvio = (classi, riga, errore = false) => { const x = da('.finestra.avvio'); x.classList.remove('pronta', 'entra', 'entra-finestra'); x.classList.add(...classi); const st = $('.f-stato', x); if (riga) st.textContent = riga; if (errore) st.classList.add('allarme'); return x; };
    const bottoniFrasi = (premuto = -1) => { const x = da('.frasi-finestra'); $$('.frase-detta', x).forEach((p, i) => { const b = el('button', {type: 'button', class: 'frase-bottone', 'data-stato': p.dataset.stato, 'aria-pressed': String(i === premuto)}); b.append(...p.childNodes); p.replaceWith(b); }); return x; };
    const ripresa = () => da('.riprendi');
    const inoltra = f => { const x = sblocca(da('.inoltra-installa')); $$('.copia-fatto, .copia-errore', x).forEach(n => { n.hidden = true; }); f(x); return x; };
    s.append(scheda({nome: 'L\'installazione che si vede riuscire', id: '<code>.palco-installa</code> <code>.chiamata-installa</code> (<code>.installata</code> <code>.nome-prima</code> <code>.nome-dopo</code>) <code>.terminale-palco</code> · <code>.cartella</code> <code>.cartella-file</code> · <code>.disco</code> <code>.cartelle</code> <code>.pacco</code> (<code>.pacco-menu</code>) · <code>.passo</code> <code>.passo-nome</code> <code>.esito-passo</code> (<code>.riuscito</code> <code>.se-no</code>) <code>.nota-passo</code> <code>.togli</code> · <code>.passo-apri</code> <code>.apri-finestra</code> <code>.finestra.avvio</code> <code>.frasi-finestra</code> <code>.frase-detta</code> <code>.frase-bottone</code> (<code>aria-pressed</code>) · <code>.riprendi</code> <code>.ripresa-tappe</code> <code>.inoltra-installa</code> <code>.bolla-indirizzo</code> (installazione.css)',
      regola: 'La pagina «installa» sulla cornice delle pagine interne: <b>ogni passo ha accanto ciò che il computer di chi installa risponde</b>, fino a «Pronta» e al microfono «Kalliope» nella riunione. Il primo schermo: al posto della bolla, il terminale; il comando si scrive, il computer lavora, e nella barra del microfono il <b>posto tratteggiato di «Kalliope»</b> (lo stesso di «non ancora») si riempie con l\'anello della voce mentre il tuo riquadro smette di essere tratteggiato e prende il nome «Tu · microfono «Kalliope»». Il file arriva nella cartella dei download; il pacchetto mette i suoi file nella sua cartella (<code>/usr</code> con la password, <code>~/.local</code> senza); la finestra racconta il primo avvio con le sue frasi vere, e le frasi che possono comparire al posto di «Pronta» si <b>provano</b>: premuta una, la finestra la mostra (in allarme) e sotto c\'è che cosa fare. Ogni passo dice <b>come sai che è riuscito</b> (la riga piena, «Riuscito se…») e <b>che cosa fare se no</b> (la riga tratteggiata, «Se no…»). In fondo, da dove riprendere e l\'indirizzo per chi installa al posto tuo (la bolla, «Copia l\'indirizzo»).',
      confine: 'Non per un\'installazione che non si può verificare con un comando o una riga della finestra; non finge un\'uscita che non conosce (la riga sbiadita); non dice «installato» prima che il passo sia fatto. I punti che cambiano con la prossima versione (la voce dentro il pacchetto) sono segnati con <code>data-cambia</code>.',
      persona: 'Chi installa (F1), spesso aiutato da un familiare tecnico (F4, F2): «sono arrivato fin qui, è andata bene?» a ogni passo, e che cosa fare se no; chi non è tecnico e si perde al primo messaggio d\'errore.',
      provenienza: 'Le frasi della finestra e il primo avvio: <code>main.rs</code> e <code>download.rs</code> a <code>v0.1-rc.1</code> (<code>progetto.md</code> §2.4); i file e le cartelle: <code>packaging/linux/build-packages.sh</code> e <code>install</code> a <code>v0.1-rc.1</code>; la discesa dei file: il varco di «stato» (<code>varco.css</code>); la frase premuta: le domande di «stato»; «Riuscito se… / Se no…», il posto che si riempie e i lati alterni: progettuali (<code>design/lavoro/3c-installa/PIANO.md</code>, «Scelte senza una fonte»); la ripresa: la pagina di prima («Se ti sei fermato qui»).',
      movimento: 'Il comando si scrive a 2 s (<code>--ritardo-terminale-scrive</code>) e il posto di «Kalliope» si riempie a ~5,5 s (<code>--ritardo-installata</code> 380 ms, <code>--durata-installata</code> 420 ms, l\'anello <code>provato-acceso</code> <code>--durata-urto</code> 900 ms); i file scendono nella cartella a <code>--passo-pacchi</code> (220 ms, <code>--durata-pacco</code> 620 ms, curva <code>--curva-pacco</code>); la finestra racconta il primo avvio (<code>--avvio-*</code>, scarico <code>--avvio-scarico-durata</code> 2,4 s); una frase premuta ferma il racconto e la finestra torna in vista (scorrimento morbido, di colpo con «riduci movimento»); l\'anello della bolla dell\'indirizzo copiato. Con «riduci movimento» ogni scena è al suo stato finale e i file arrivano senza attesa.',
      verifica: 'Scenari <code>frasi</code> (tastiera, annuncio, finestra in vista a ogni misura, passaggio fra computer e telefono, premere durante il racconto), <code>scorrimento</code>, <code>secondo-piano</code>, <code>ritorno</code>, <code>ricarica</code>, <code>ridotto</code>, <code>senza-js</code>, <code>tastiera</code> (a due ritmi); esame dell\'impaginazione sulle soglie, i dispositivi, le lingue e il testo grande, con gli stati della pagina; numeri, limiti e data in <code>design/lavoro/3c-installa/costruzione/esiti/</code>.',
      prove: [
        prova1('il primo schermo prima del comando, con lo script: il tuo posto tratteggiato, «Tu · senza voce», «Kalliope» un posto vuoto nella barra', conScript(palco()), 'largo'),
        prova1('il primo schermo dopo il comando (<code>.installata</code>): il posto si è riempito, il tuo riquadro si accende (anche senza script e con «riduci movimento»)', palco(x => { $('.chiamata-installa', x).classList.add('installata'); return x; }), 'largo'),
        prova1('la cartella dei download con il file (Debian, Fedora, Altre: nome e dimensione; Arch: la ricetta)', el('div', {class: 'cat-cartelle'}, ['deb', 'arch', 'tar'].map(cartella)), 'largo'),
        prova1('la cartella che riceve i file con la password (<code>/usr</code>) e quella senza (<code>~/.local</code>): i file e «nel menu»', el('div', {class: 'cat-cartelle'}, disco('deb'), disco('tar')), 'largo'),
        prova1('la cartella prima che i file scendano (con lo script, <code>.disco</code> senza <code>.visto</code>): i file non si vedono ma tengono il posto', conScript(disco('rpm')), 'largo'),
        prova1('la finestra prima: «Pronta» (a riposo, anche senza script)', el('div', {class: 'scena-chiara cat-in-chiara passo-apri'}, avvio(['pronta'])), 'largo'),
        prova1('la finestra racconta il primo avvio: «Per parlare, Kalliope deve scaricare la voce…» con «Scarica la voce» (<code>.avvio</code>)', el('div', {class: 'scena-chiara cat-in-chiara passo-apri'}, avvio([], 'Per parlare, Kalliope deve scaricare la voce: 53 MB, una volta sola. Poi funziona senza internet.')), 'largo'),
        prova1('lo scarico: «Scarico la voce… 20 di 53 MB», la barra e «Annulla» (<code>.scarica</code>)', el('div', {class: 'scena-chiara cat-in-chiara passo-apri'}, avvio(['scarica'], 'Scarico la voce… 20 di 53 MB')), 'largo'),
        prova1('«Preparo la voce…» (<code>.prepara</code>): a ogni avvio, il campo si accende quando ha finito', el('div', {class: 'scena-chiara cat-in-chiara passo-apri'}, avvio(['prepara'], 'Preparo la voce…')), 'largo'),
        prova1('la finestra con una frase in allarme (<code>.errore</code>, <code>.allarme</code>): e torna «Scarica la voce»', el('div', {class: 'scena-chiara cat-in-chiara passo-apri'}, avvio(['errore'], 'Download non riuscito: …', true)), 'largo'),
        prova1('le frasi che possono comparire al posto di «Pronta»: senza JavaScript (la frase e che cosa fare) e con lo script (pulsanti, <code>aria-pressed</code>)', el('div', {class: 'scena-chiara cat-in-chiara passo-apri cat-frasi'}, da('.frasi-finestra'), bottoniFrasi(1)), 'largo'),
        prova1('la frase premuta: al passaggio (<code>.sim-sopra</code>), al fuoco (<code>.sim-fuoco</code>), premuta (<code>aria-pressed</code>)', el('div', {class: 'scena-chiara cat-in-chiara passo-apri cat-frasi-stati'}, ['sim-sopra', 'sim-fuoco', ''].map((k, i) => { const x = bottoniFrasi(i === 2 ? 0 : -1); const b = $('.frase-bottone', x); if (k) b.classList.add(k); $$('.frase-rimedio, .frasi-nome, .frasi-elenco > li:nth-child(n+2), .nota-passo', x).forEach(n => { n.style.display = 'none'; }); return x; })), 'largo'),
        prova1('«Riuscito se… / Se no…»: la riga piena e la riga tratteggiata, sulla scena della stanza e sulla chiara', el('div', {class: 'cat-coppia-scene'}, el('div', {class: 'cat-in-notte'}, da('.passo-installa .esito-passo')), el('div', {class: 'scena-chiara cat-in-chiara passo-apri'}, da('.passo-apri .esito-passo'))), 'largo'),
        prova1('«Per togliere Kalliope», a richiesta (<code>.togli</code>): i comandi di una distribuzione e ciò che resta', conScript((() => { const x = da('.togli'); x.open = true; soloSistema(x, 'tar'); return el('div', {class: 'passo-installa cat-togli'}, x); })()), 'largo'),
        prova1('da dove riprendere: i cinque passi, ognuno con ciò che vedi se ti sei fermato lì (<code>.ripresa-tappe</code>), al riposo e al fuoco (<code>.sim-fuoco</code>)', el('div', {class: 'cat-ripresa'}, ripresa(), (() => { const x = ripresa(); $('.ripresa-tappe li:nth-child(3) a', x).classList.add('sim-fuoco'); $('.inoltra-installa', x).remove(); return x; })()), 'largo'),
        prova1('l\'indirizzo per chi installa al posto tuo: a riposo (con lo script: «Copia l\'indirizzo»)', conScript(inoltra(x => { $('.copia-indirizzo', x).hidden = false; })), 'largo'),
        prova1('indirizzo copiato (<code>.bolla-indirizzo.copiata</code>, <code>.copia-fatto</code>): l\'anello della voce sulla bolla', conScript(inoltra(x => { $('.copia-indirizzo', x).hidden = false; $('.copia-fatto', x).hidden = false; $('.bolla-indirizzo', x).classList.add('copiata'); })), 'largo'),
        prova1('indirizzo non copiato (<code>.copia-errore</code>): la frase per farlo a mano, l\'indirizzo si seleziona', conScript(inoltra(x => { $('.copia-indirizzo', x).hidden = false; $('.copia-errore', x).hidden = false; })), 'largo'),
        prova1('senza JavaScript: niente comando, l\'indirizzo c\'è e si seleziona con un clic', inoltra(() => {}), 'largo'),
        prova1('testo più lungo (un\'altra lingua): la frase della finestra e i passi vanno a capo, nulla esce', el('div', {class: 'scena-chiara cat-in-chiara passo-apri cat-frasi'}, avvio(['errore'], 'Download non riuscito: …, e una frase più lunga come in una lingua che ha bisogno di più parole per dire lo stesso', true), (() => { const x = bottoniFrasi(0); $$('.frase-bottone', x).forEach(b => { b.append(' · e altre parole, perché la frase vada a capo dentro il suo riquadro'); }); return x; })()), 'largo'),
        viva(1440, 900, '../../it/installa/', 'La pagina «installa»: il primo schermo', 'il primo schermo dal vivo, con l\'arrivo: premi Riproduci (il comando si scrive a 2 s, il posto di «Kalliope» si riempie a 5,5 s)', [['«Arch»', premi('label[for=sistema-arch]')]]),
        viva(1440, 900, '../../it/installa/#installa', 'La pagina «installa»: i comandi e la cartella', 'i comandi del passo «Installa» dal vivo: i file scendono nella cartella e poi il comando <code>kalliope --version</code>', [['«Altre»', premi('label[for=sistema-tar]')], ['Porta ai comandi', vai('#installa')]]),
        viva(1440, 900, '../../it/installa/#apri', 'La pagina «installa»: la finestra e le sue frasi', 'la finestra dal vivo: premi una frase nel riquadro e la finestra la mostra; premila di nuovo e torna «Pronta»', [['«curl»', premi('.frase-bottone[data-stato=curl]')], ['«impronta»', premi('.frase-bottone[data-stato=impronta]')], ['«microfono»', premi('.frase-bottone[data-stato=microfono]')]]),
        viva(390, 844, '../../it/installa/#apri', 'La pagina «installa» al telefono: la finestra e le sue frasi', 'al telefono la finestra sta dopo «Riuscito se…» e prima delle frasi: chi preme una frase la trova sopra di sé', [['«curl»', premi('.frase-bottone[data-stato=curl]')], ['«microfono»', premi('.frase-bottone[data-stato=microfono]')]]),
        viva(1440, 900, '../../it/installa/#inoltra', 'La pagina «installa»: da dove riprendere e l\'indirizzo', 'la chiusura dal vivo: premi «Copia l\'indirizzo» nel riquadro (copiato o non riuscito)', [['Appunti che funzionano', appuntiFinti(true)], ['Appunti che non funzionano', appuntiFinti(false)], ['«Copia l\'indirizzo»', premi('.copia-indirizzo')]]),
        viva(844, 390, '../../it/installa/', 'La pagina «installa» a 844×390 (telefono girato)', 'telefono girato: titolo e frase alla misura del telefono, la scelta e il pulsante del file nello schermo, la riunione sotto'),
      ]}));
    schermi.forEach(x => x.adatta());
  });

  // il rimpicciolimento si calcola quando il riquadro è nella pagina
  requestAnimationFrame(() => schermi.forEach(x => x.adatta()));
  const osserva = new ResizeObserver(() => schermi.forEach(x => x.adatta())); osserva.observe(document.body);
  window.__catalogoInstalla = {errori, schermi: schermi.length};
  const stato = $('#stato-catalogo'); if (stato && errori.length) stato.textContent += ` · pagina «installa»: ${errori.join(' · ')}`;
})();
