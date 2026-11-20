/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il catalogo del marchio (incarico L-3, 19/11/2026): «La frase che si accende», la bolla detta a metà. Mostra il disegno unico (marchio/disegno.json) nelle sue
// forme e in tutte le grandezze da 16 a 256 su chiaro, su scuro e sul bordeaux; la barra con e senza il nome (la home vera, a tre larghezze); il movimento con
// «Riproduci» e «Ferma», il gesto del puntatore e la variante con «riduci movimento»; la pagina da destra a sinistra, dove il segno non si specchia; l'icona della
// scheda, letta dai file veri (l'SVG disegnato a 16 e 32 px, le tre immagini dell'ICO decodificate dal file). Come gli altri non ha stili né markup suoi per il
// marchio: copia i file che la costruzione e il generatore hanno scritto (marchio/*.svg, esempio-home.html) e usa lo stesso marchio.js della barra. I valori
// (token e geometria) si leggono da token.css e da disegno.json all'apertura, non si ricopiano. Sta in un file suo e aggiunge la sua sezione dopo «Componenti».
(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, att = {}, ...figli) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(att)) { if (typeof v === 'function') e.addEventListener(k.replace(/^on/, ''), v); else if (k === 'html') e.innerHTML = v; else if (k === 'testo') e.textContent = v; else if (v !== false && v !== undefined) e.setAttribute(k, v === true ? '' : v); } for (const f of figli.flat()) if (f) e.append(f); return e; };
  const errori = [];
  const prova = async (nome, f) => { try { return await f(); } catch (e) { errori.push(`${nome}: ${e.message}`); return null; } };
  await new Promise(fine => { const t0 = performance.now(); (function chiedi() { if (window.__catalogo || performance.now() - t0 > 20000) fine(); else setTimeout(chiedi, 40); })(); });
  const testo = async u => { const r = await fetch(u); if (!r.ok) throw new Error(`${u}: ${r.status}`); return r.text(); };
  const [barraTesto, disegno, tokenCss, icoBuf, homeTesto] = await Promise.all([testo('../marchio/barra.svg'), testo('../marchio/disegno.json').then(JSON.parse), testo('../token.css'),
    fetch('../marchio/favicon.ico').then(r => r.arrayBuffer()), testo('esempio-home.html')]);
  const home = new DOMParser().parseFromString(homeTesto, 'text/html');
  const M = window.Marchio;
  if (!M) throw new Error('marchio.js non è caricato');
  const prova1 = (et, nodo, classe = '') => el('div', {class: 'cat-prova' + (classe.includes('largo') ? ' intero' : '')}, el('span', {class: 'cat-et', html: et}), el('div', {class: 'cat-quadro ' + classe}, nodo));
  const scheda = ({nome, id, regola, confine, persona, provenienza, prove}) => el('article', {class: 'cat-scheda'}, el('h3', {testo: nome}),
    el('dl', {}, el('dt', {testo: 'Identificatore'}), el('dd', {html: id}), el('dt', {testo: 'Regola d\'uso'}), el('dd', {html: regola}), el('dt', {testo: 'Non si usa'}), el('dd', {html: confine}),
      el('dt', {testo: 'Persona e compito'}), el('dd', {html: persona}), el('dt', {testo: 'Provenienza'}), el('dd', {html: provenienza})),
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
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const segno = grandezza => { const d = el('div', {html: barraTesto.replace(/<!--[\s\S]*?-->/g, '')}); const s = M.clona(d.firstElementChild); s.setAttribute('width', grandezza); s.setAttribute('height', grandezza); return s; };
  const immagine = (forma, n) => el('img', {src: `../marchio/${forma}.svg`, width: n, height: n, alt: '', class: forma === 'simbolica' ? 'cm-ricolorata' : ''});
  // i token del segno, letti dal foglio (nome, valore, il commento che ne dice il ruolo)
  const tokenSegno = [...tokenCss.matchAll(/^\s*(--segno-[a-z-]+):\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/gm)].map(m => ({nome: m[1], valore: m[2].trim(), ruolo: m[3] || ''}));
  const css = getComputedStyle(document.documentElement);
  const ms = n => { const v = css.getPropertyValue(n).trim(); return parseFloat(v) * (v.endsWith('ms') ? 1 : 1000); };

  const s = apri('marchio', 'Il marchio',
    'La bolla della frase detta a metà: piena e con le parole dove è detta, solo contorno tratteggiato (il segno di «non ancora» del sito) dove non lo è ancora. Un disegno solo: la geometria è in <code>marchio/disegno.json</code>, i colori e i tempi sono i token <code>--segno-*</code>, e <code>tools/marchio.py</code> scrive da lì ogni file (<code>python3 -I tools/marchio.py</code>; con <code>--check</code> fallisce se qualcosa non torna, in CI e a ogni costruzione del sito). Niente è copiato a mano, né nelle pagine né nelle icone del programma. Scelto dal proprietario il 19/11/2026 fra tre direzioni.',
    'componenti');

  // ---------- la scheda ----------
  await prova('scheda', async () => {
    s.append(scheda({nome: 'Il marchio', id: '<code>.m-segno</code> <code>.m-detto</code> <code>.m-bordo</code> <code>.m-dette</code> <code>.m-fronte</code> (componenti/marchio.css, marchio/marchio.js)',
      regola: 'Nella barra, a sinistra del nome, alto come la riga del titolo (36 px; 30 al telefono), in linea nel collegamento alla pagina iniziale con il nome scritto accanto (traducibile). Fuori dalla barra: la forma libera dove il fondo è trasparente, la piena dove l\'icona ha un quadrato (macOS), la piccola sotto i 32 px e nella scheda del browser, la simbolica per GNOME. A riposo è sempre «detto a metà». Non si specchia da destra a sinistra e non cambia colore sul chiaro e sullo scuro.',
      confine: 'Non per i comandi (non è un pulsante, anche se è un collegamento); non al posto dell\'icona di una funzione; non con ombre o bagliori disegnati; mai una bolla vuota tutta tratteggiata (nemmeno all\'arrivo) né tutta piena per secondi.',
      persona: 'Chi parla con Kalliope e lo cerca fra le applicazioni o fra le schede del browser (16–96 px), e chi gli sta intorno e riceve l\'indirizzo della pagina.',
      provenienza: 'Direzione 3 «La frase che si accende» della ricerca L-1 (<code>design/lavoro/L-logo/direzioni/3-frase/</code>), scelta dal proprietario il 19/11/2026 dopo la correzione del giudizio. Difetti noti corretti in L-3: all\'arrivo non è mai vuoto; a fine frase torna a riposo; a 16 px sullo scuro il contorno non si spalma più su due righe di pixel (il fondo della bolla piccola sta al centro di una riga: da 88 a 92 su 128).',
      prove: [prova1('riposo, nella barra: 36 px (computer) e 30 (telefono)', el('div', {class: 'cm-fila'}, segno(36), segno(30)), 'bordeaux')]}));
  });

  // ---------- tutte le forme, tutte le grandezze, tre fondi ----------
  await prova('forme', async () => {
    s.append(el('h3', {testo: 'Le forme e le grandezze, da 16 a 256 px'}),
      el('p', {class: 'cat-nota', html: 'Cinque forme dello stesso disegno, ognuna su chiaro (<code>--segno-prova-chiaro</code>), su scuro (<code>--segno-prova-scuro</code>) e sul bordeaux del sito (<code>--fondo</code>). <b>Libera</b>: fondo trasparente, per Linux (<code>hicolor/scalable</code>), Windows e le pagine di prima. <b>Piena</b>: il quadrato rosa chiaro di macOS. <b>Piccola</b>: sulla griglia di 16 pixel, per 16 e 24 px e per la scheda del browser. <b>Simbolica</b>: 16×16, un colore, per GNOME (qui ricolorata come la ricolora GTK sul fondo scuro). <b>Della barra</b>: in linea nella pagina, con le sue parti (quella che si muove).'}));
    const FORME = [['libero', 'Libera'], ['piena', 'Piena (macOS)'], ['piccola', 'Piccola (16 e 24 px, scheda)'], ['simbolica', 'Simbolica (GNOME)'], ['barra', 'Della barra (in linea)']];
    const GRANDEZZE = [16, 24, 32, 48, 64, 96, 128, 256];
    const FONDI = [['chiaro', 'su chiaro'], ['scuro', 'su scuro'], ['bordeaux', 'sul bordeaux']];
    const blocco = el('div', {class: 'cm-forme'});
    for (const [forma, nome] of FORME) {
      const riga = el('div', {class: 'cm-forma'}, el('h4', {testo: nome}));
      for (const [fondo, etichetta] of FONDI) {
        const fila = el('div', {class: `cm-fila cm-fondo-${fondo}`, 'data-forma': forma}, el('span', {class: 'cm-et', testo: etichetta}));
        for (const n of GRANDEZZE) fila.append(el('figure', {class: 'cm-fig'}, forma === 'barra' ? segno(n) : immagine(forma, n), el('figcaption', {testo: n})));
        riga.append(fila);
      }
      blocco.append(riga);
    }
    s.append(blocco);
  });

  // ---------- la barra: la home vera, con e senza il nome ----------
  await prova('barra', async () => {
    const n = e => el('iframe', {class: 'cat-anteprima', src: '../../it/index.html', title: e[0], style: `width: ${e[1]}; height: ${e[2]}`, loading: 'lazy',
      onload: ev => { try { const w = ev.target.contentWindow; if (e[3] !== 'azione') { w.scrollTo(0, e[3]); return; }
        // scorre finché la barra prende l'azione (la pagina lo decide dal punto in cui i comandi escono dallo schermo)
        let y = 0; const passo = () => { y += 150; w.scrollTo(0, y); if (!w.document.querySelector('.barra.con-azione') && y < 3000) setTimeout(passo, 80); }; passo(); } catch (x) { /* stessa origine */ } }});
    s.append(el('h3', {testo: 'La barra, con e senza il nome'}),
      el('p', {class: 'cat-nota', html: 'La home vera, in tre momenti. Con il nome: in cima, al computer (36 px) e al telefono (30 px). Senza il nome: scorrendo, al telefono la barra prende l\'azione «Scarica e installa» e del marchio resta il disegno (<code>barra.css</code>, <code>.con-azione</code>); il segno è lo stesso e non cambia posto.'}),
      el('div', {class: 'cat-prove'},
        prova1('computer, in cima: segno e nome', n(['barra al computer', '100%', '5em', 0]), 'largo'),
        prova1('telefono (390 px), in cima: segno e nome', n(['barra al telefono', '390px', '5em', 0])),
        prova1('telefono, scorrendo: solo il segno, con l\'azione', n(['barra al telefono con l\'azione', '390px', '5em', 'azione']))));
  });

  // ---------- il movimento ----------
  await prova('movimento', async () => {
    const PAROLE = 17, PASSO = 420;   // la frase della bolla della home: «Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo.» (17 parole), una ogni 0,42 s
    let ridotto = false;
    const grande = segno(96), piccolo = segno(36);
    const dati = el('output', {class: 'cm-dati', testo: 'a riposo'});
    const zonaPiccola = el('a', {class: 'marchio', href: '#marchio', 'aria-label': 'Kalliope: prova del gesto'}, piccolo, el('span', {testo: 'Kalliope'}));
    zonaPiccola.addEventListener('click', e => e.preventDefault());
    // il segno piccolo risponde al puntatore e al fuoco come nella barra; i due seguono la stessa voce
    const comandi = [M.crea(grande, null, {ridotto: () => ridotto}), M.crea(piccolo, zonaPiccola, {ridotto: () => ridotto})];
    let giro = 0, parlando = 0;
    const tutti = f => comandi.forEach(c => c.voce(f));
    const leggi = () => { dati.textContent = `fronte ${comandi[0].posizione().toFixed(1).replace('.', ',')} su ${parseFloat(css.getPropertyValue('--segno-fronte-pieno'))}${ridotto ? ' · movimento ridotto: fermo' : ''}`; giro = requestAnimationFrame(leggi); };
    const parla = () => {
      clearInterval(parlando); let k = 0; tutti({stato: 'parla', frazione: 0});
      parlando = setInterval(() => { k++; tutti({stato: 'parla', frazione: k / PAROLE}); if (k >= PAROLE) clearInterval(parlando); }, PASSO);
    };
    const ferma = () => { clearInterval(parlando); tutti({stato: 'interrotta'}); };
    const riduci = el('input', {type: 'checkbox', id: 'cm-ridotto'});
    riduci.addEventListener('change', () => { ridotto = riduci.checked; if (ridotto) { clearInterval(parlando); comandi.forEach(c => c.riposo()); } });
    giro = requestAnimationFrame(leggi);
    s.append(el('h3', {testo: 'Il movimento'}),
      el('p', {class: 'cat-nota', html: `Il segno vive con la voce della pagina. La home dice, a ogni fotogramma, quanta frase la voce ha detto (<code>kalliope:voce</code>, <code>scena.js</code>), e il fronte, il confine fra la parte piena e quella tratteggiata, la segue (<code>marchio.js</code>). Qui lo stesso comando, con una frase di ${PAROLE} parole detta una ogni ${PASSO / 1000} s (non la voce vera). <b>Riproduci</b> la dice, <b>Ferma</b> la interrompe (torna a riposo); passando con il puntatore sul segno piccolo o dandogli il fuoco fa il gesto di una frase detta in un attimo.`}),
      el('div', {class: 'cat-effetto cm-effetto'},
        el('div', {}, el('h4', {testo: 'La frase che si accende'}),
          el('p', {html: 'Dove: la barra di ogni pagina nuova (<code>componenti/marchio.css</code>, <code>marchio/marchio.js</code>). Trigger: la voce della pagina (<code>kalliope:voce</code>: <code>parla</code> con la frazione di parole dette, <code>finita</code>, <code>interrotta</code>), il puntatore e il fuoco sul marchio.'}),
          el('p', {html: 'Bersagli: i due ritagli <code>.m-fronte</code> (attributo <code>transform</code>, <code>translate(x 0)</code>, x da 0 a <code>--segno-fronte-pieno</code>); il fronte insegue le parole con la costante di tempo <code>--segno-inseguimento</code> (' + ms('--segno-inseguimento') + ' ms); con l\'ultima parola la bolla resta piena <code>--segno-sosta</code> (' + ms('--segno-sosta') + ' ms) e torna a riposo in <code>--segno-ritorno</code> (' + ms('--segno-ritorno') + ' ms, curva <code>--curva-dolce-doppia</code>), a tempo fisso. Interruzione: la voce che si ferma, o una frase nuova, ferma ciò che c\'è e riparte da dove il segno si trova. Ripiego: con «riduci movimento» e senza script il segno sta fermo, a riposo (detto a metà); a riposo non è mai una bolla vuota.'}),
          dati),
        el('div', {class: 'cat-campo cm-campo'}, el('div', {class: 'cat-quadro bordeaux cm-quadro'}, grande), el('div', {class: 'cat-quadro bordeaux cm-quadro'}, zonaPiccola)),
        el('div', {class: 'cat-controlli'}, el('button', {type: 'button', testo: 'Riproduci', onclick: parla}), el('button', {type: 'button', testo: 'Ferma', onclick: ferma}),
          el('label', {class: 'cm-ridotto'}, riduci, ' Come con «riduci movimento»'))));
    // le fasi, ferme: il fronte a 0, a un quarto, a metà, a tre quarti e al pieno
    const pieno = parseFloat(css.getPropertyValue('--segno-fronte-pieno'));
    const fasi = el('div', {class: 'cm-fasi'});
    for (const [nome, f] of [['a riposo', 0], ['un quarto', 0.25], ['metà', 0.5], ['tre quarti', 0.75], ['tutta piena', 1]]) {
      const g = segno(96); g.querySelectorAll('.m-fronte').forEach(x => x.setAttribute('transform', `translate(${(pieno * f).toFixed(2)} 0)`));
      fasi.append(el('figure', {class: 'cm-fig cm-fondo-bordeaux cm-fase'}, g, el('figcaption', {html: `${nome}<br><code>translate(${(pieno * f).toFixed(1).replace('.', ',')} 0)</code>`})));
    }
    s.append(el('h3', {testo: 'Le fasi del fronte'}), el('p', {class: 'cat-nota', html: 'Le posizioni del fronte che il movimento attraversa, ferme. A riposo (la prima) è il disegno dei menu e della scheda; la frase detta fino in fondo è l\'ultima, che dura un momento.'}), fasi);
    s.append(el('p', {class: 'cat-nota', html: 'Il ripiego «riduci movimento» provato qui senza cambiare le preferenze del sistema (la casella sopra); nel sito è la preferenza vera, e l\'arrivo della home con il movimento ridotto è in <code>design/lavoro/L-logo/costruzione/sequenze/ridotto-1440/</code>.'}));
  });

  // ---------- da destra a sinistra ----------
  await prova('specchio', async () => {
    const marchioHome = home.querySelector('.barra .marchio');
    if (!marchioHome) throw new Error('la home di esempio non ha il marchio nella barra');
    const FOGLI = ['token.css', 'base.css', 'componenti/barra.css', 'componenti/marchio.css'];
    const base = new URL('../', location.href).href;
    const pagina = (lang, dir, nome) => {
      const f = el('iframe', {class: 'cap-paginetta cm-paginetta', title: `la barra, ${dir}`, loading: 'lazy'});
      const link = marchioHome.cloneNode(true); link.removeAttribute('href'); link.querySelectorAll('span').forEach(x => { x.textContent = nome; x.removeAttribute('data-t'); });
      f.srcdoc = `<!doctype html><html lang="${lang}" dir="${dir}"><head><meta charset="utf-8"><base href="${base}">${FOGLI.map(x => `<link rel="stylesheet" href="${x}">`).join('')}</head>`
        + `<body class="cap-dentro"><header class="barra" style="position: static">${link.outerHTML}</header><p id="verifica" style="margin:0"></p></body></html>`;
      f.addEventListener('load', () => {
        const d = f.contentDocument, g = d.querySelector('.m-segno'), r = g.getBoundingClientRect(), v = d.querySelector('#verifica');
        const m = f.contentWindow.getComputedStyle(g).transform;
        v.textContent = `${dir === 'rtl' ? 'Da destra a sinistra' : 'Da sinistra a destra'}: il segno sta a ${r.left > d.documentElement.clientWidth / 2 ? 'destra' : 'sinistra'}, trasformazione: ${m}${m === 'none' ? ' (non è specchiato)' : ''}`;
        v.style.cssText = 'margin:0.6em 0 0; font-size: smaller; color: var(--testo-secondario)';
        f.dataset.specchio = JSON.stringify({dir, inizio: r.left > d.documentElement.clientWidth / 2 ? 'destra' : 'sinistra', matrice: m});
        f.style.height = d.documentElement.scrollHeight + 'px';
      });
      return f;
    };
    s.append(el('h3', {testo: 'Da destra a sinistra: il segno non si specchia'}),
      el('p', {class: 'cat-nota', html: 'Nella pagina araba o urdu la barra si specchia (il segno passa a destra, accanto al nome), ma il disegno no: la regola di Apple, «don\'t flip logos or universal signs», e del sistema (<code>SISTEMA.md</code>, «Lo specchio»). Il fronte della voce va sempre da sinistra a destra, come la bolla. Qui le due barre vere nei due versi, con la verifica letta dalla pagina.'}),
      el('div', {class: 'cat-prove'}, prova1('da sinistra a destra', pagina('it', 'ltr', 'Kalliope'), 'largo'), prova1('da destra a sinistra (l\'arabo)', pagina('ar', 'rtl', 'Kalliope'), 'largo')));
  });

  // ---------- l'icona della scheda ----------
  await prova('scheda-browser', async () => {
    const pixel = (rgba, n, scala = 8, nome = '') => { const c = el('canvas', {width: n, height: n, class: 'cm-pixel', 'aria-label': nome, role: 'img'}); c.style.width = `${n * scala / 16}em`; c.style.height = c.style.width; c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(rgba), n, n), 0, 0); return c; };
    // l'ICO, letto dal file: le sue immagini BMP a 32 bit
    const v = new DataView(icoBuf), quante = v.getUint16(4, true), immagini = [];
    for (let k = 0; k < quante; k++) {
      const w = v.getUint8(6 + 16 * k) || 256, dim = v.getUint32(6 + 16 * k + 8, true), off = v.getUint32(6 + 16 * k + 12, true);
      const testa = v.getUint32(off, true), bit = v.getUint16(off + 14, true);
      if (bit !== 32 || v.getInt32(off + 4, true) !== w || v.getInt32(off + 8, true) !== w * 2) throw new Error('una voce dell\'ICO non è a 32 bit');
      const rgba = new Uint8ClampedArray(w * w * 4);
      for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) { const da = off + testa + ((w - 1 - y) * w + x) * 4, a = (y * w + x) * 4; rgba[a] = v.getUint8(da + 2); rgba[a + 1] = v.getUint8(da + 1); rgba[a + 2] = v.getUint8(da); rgba[a + 3] = v.getUint8(da + 3); }
      immagini.push({w, rgba, dim});
    }
    // l'SVG piccolo, disegnato dal browser a 16 e 32 px
    const svgPiccolo = new Image(); svgPiccolo.src = '../marchio/piccola.svg'; await svgPiccolo.decode();
    const dalSvg = n => { const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'); x.drawImage(svgPiccolo, 0, 0, n, n); return x.getImageData(0, 0, n, n).data; };
    const scheda1 = tema => el('div', {class: `cm-scheda cm-fondo-${tema}`}, el('img', {src: '../marchio/piccola.svg', width: 16, height: 16, alt: ''}), el('span', {testo: 'Kalliope · In riunione, alla pari'}));
    const gruppo = (titolo, figure) => el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', html: titolo}), el('div', {class: 'cm-fila cm-ico'}, figure));
    s.append(el('h3', {testo: 'L\'icona della scheda'}),
      el('p', {class: 'cat-nota', html: 'Scritta dalla costruzione in <code>&lt;head&gt;</code> di ogni pagina (<code>tools/site.py</code>, nessuna pagina la scrive): <code>favicon.ico</code> con <code>sizes="any"</code> e <code>piccola.svg</code> con <code>type="image/svg+xml"</code>. L\'SVG lo leggono Chrome, Edge e Firefox; l\'ICO serve a Safari prima della 26 e a Google (la ricerca non accetta l\'SVG). L\'ICO ha tre immagini a 32 bit con trasparenza: 16 e 32 dalla forma piccola (le grandezze della scheda: lo stesso disegno dell\'SVG), 48 dalla libera (<code>tools/marchio.py</code>). Qui sono lette dal file e ingrandite pixel per pixel; l\'SVG è quello che il browser disegna a 16 e a 32 px.'}),
      el('div', {class: 'cat-prove'}, prova1('nella scheda, su chiaro', scheda1('chiaro')), prova1('nella scheda, su scuro', scheda1('scuro'))),
      ...[['chiaro', 'su chiaro'], ['scuro', 'su scuro']].map(([tema, et]) => el('div', {class: `cm-ico-blocco cm-fondo-${tema}`},
        gruppo(`l'SVG disegnato dal browser, ${et}`, [16, 32].map(n => el('figure', {class: 'cm-fig'}, pixel(dalSvg(n), n, n === 16 ? 12 : 6, `piccola.svg a ${n} px`), el('figcaption', {html: `piccola.svg · ${n}`})))),
        gruppo(`favicon.ico, le sue immagini, ${et}`, immagini.map(i => el('figure', {class: 'cm-fig'}, pixel(i.rgba, i.w, i.w === 16 ? 12 : i.w === 32 ? 6 : 4, `favicon.ico, ${i.w} px`), el('figcaption', {html: `favicon.ico · ${i.w} px<br>${i.dim} byte`})))))));
    window.__catalogoMarchio = {ico: immagini.map(i => i.w)};
  });

  // ---------- i valori: dalla fonte, non ricopiati ----------
  await prova('valori', async () => {
    s.append(el('h3', {testo: 'I token del segno'}),
      el('p', {class: 'cat-nota', html: 'Letti da <code>token.css</code> all\'apertura (non ricopiati). I colori e i tempi sono qui; il disegno è in <code>disegno.json</code>. Per i colori <code>tools/marchio.py</code> risolve anche <code>var()</code>: <code>--segno-parola</code> è il chiaro della bolla della home.'}),
      el('div', {class: 'cm-scorre'}, el('table', {class: 'cat-tabella'}, el('thead', {}, el('tr', {}, ...['Nome', 'Valore', 'Ruolo'].map(t => el('th', {testo: t})))),
        el('tbody', {}, ...tokenSegno.map(t => el('tr', {}, el('td', {class: 'n', testo: t.nome}), el('td', {class: 'v', testo: t.valore}), el('td', {testo: t.ruolo})))))));
    const forme = Object.entries(disegno.forme);
    s.append(el('h3', {testo: 'La geometria'}),
      el('p', {class: 'cat-nota', html: 'Da <code>marchio/disegno.json</code>, la sola fonte della forma. Le forme isolate (libera, piena, piccola, simbolica) non hanno ritagli né fogli di stile: la parte detta è un\'area più un contorno pieno, quella non ancora detta un contorno tratteggiato, tagliati dove il fronte incrocia la sagoma, e il tratteggio comincia alla stessa distanza che nella barra; un motore SVG piccolo come quello di Qt (KDE) le disegna giuste. La barra ha i ritagli, perché lì il fronte si muove.'}),
      el('div', {class: 'cm-scorre'}, el('table', {class: 'cat-tabella'}, el('thead', {}, el('tr', {}, ...['Forma', 'Tela', 'Fronte', 'Contorno', 'Tratteggio', 'Parole'].map(t => el('th', {testo: t})))),
        el('tbody', {}, ...forme.map(([nome, f]) => el('tr', {}, el('td', {class: 'n', testo: nome}), el('td', {class: 'v', testo: f.tela}),
          el('td', {class: 'v', testo: f.fronte.retta !== undefined ? `retta, x = ${f.fronte.retta}` : `curva, ${f.fronte.curva.map(p => p.join(' ')).join(' · ')}`}), el('td', {class: 'v', testo: f.contorno.spessore + (f.contorno.solo_tratteggiato ? ' (solo il tratteggiato)' : '')}),
          el('td', {class: 'v', testo: f.contorno.tratteggio.join(' / ')}), el('td', {class: 'v', testo: f.parole.length ? f.parole.map(p => p.join(' ')).join(' · ') : 'nessuna'})))))));
    s.append(el('h3', {testo: 'Dove stanno i file'}),
      el('ul', {class: 'cat-non-ancora', html: '<li><b>Sorgenti</b>: <code>design-system/marchio/disegno.json</code> (geometria) e i token <code>--segno-*</code> di <code>design-system/token.css</code>.</li>'
        + '<li><b>Generatore e prova</b>: <code>tools/marchio.py</code> (<code>--check</code> in CI e a ogni costruzione del sito), <code>tools/marchio_raster.py</code> (PNG e ICO senza dipendenze), <code>tools/test_marchio.py</code>.</li>'
        + '<li><b>Scritti</b>: <code>marchio/barra.svg</code>, <code>libero.svg</code>, <code>piena.svg</code>, <code>piccola.svg</code>, <code>simbolica.svg</code>, <code>favicon.ico</code>; per i pacchetti Linux <code>packaging/linux/io.github.sansevieria_ou.kalliope.svg</code>, <code>…-symbolic.svg</code>, <code>…-48.png</code>, <code>…-256.png</code>.</li>'
        + '<li><b>Nelle pagine</b>: la costruzione sostituisce <code>&lt;svg data-marchio="barra"&gt;</code> (la barra) e <code>&lt;svg data-marchio="libero"&gt;</code> (le pagine di prima) e scrive l\'icona della scheda.</li>'
        + '<li><b>Non ancora</b>: l\'icona della finestra del programma (Slint) arriva con la proposta dei valori del sistema per Slint; la pagina «non ancora» e «stato» non muovono il segno con la loro voce (solo la home).</li>'}));
  });

  const stato = $('#stato-catalogo');
  window.__catalogoMarchio = {...(window.__catalogoMarchio || {}), errori, token: tokenSegno.length};
  if (errori.length && stato) stato.textContent += ` · Il marchio: ${errori.join(' · ')}`;
  if (window.__catalogo) window.__catalogo.errori.push(...errori.map(e => `marchio: ${e}`));
})().catch(e => { const st = document.querySelector('#stato-catalogo'); if (st) st.textContent += ` · Il marchio: ${e.message}`; window.__catalogoMarchio = {errori: [e.message]}; if (window.__catalogo) window.__catalogo.errori.push(`marchio: ${e.message}`); });
