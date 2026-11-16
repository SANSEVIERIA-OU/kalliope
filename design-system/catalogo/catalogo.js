/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Il catalogo vivo. Non ha stili né markup suoi per i componenti: legge token.css (la tabella dei token è generata dal file), copia i componenti
// dalla home vera (website/index.html, che nel sito costruito, in italiano, è ../../it/index.html) e li mostra con le classi e gli stati del sistema. Gli stati «al passaggio», «fuoco» e «premuto» si
// forzano riscrivendo le regole del sistema stesso (.voce:hover → .voce.sim-sopra): nessuna regola in più, solo le stesse con una classe.
(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, att = {}, ...figli) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(att)) { if (typeof v === 'function') e.addEventListener(k.replace(/^on/, ''), v); else if (k === 'html') e.innerHTML = v; else if (k === 'testo') e.textContent = v; else if (v !== false && v !== undefined) e.setAttribute(k, v === true ? '' : v); } for (const f of figli.flat()) if (f) e.append(f); return e; };
  const stato = $('#stato-catalogo');
  const errori = [];
  const prova = (nome, f) => { try { return f(); } catch (e) { errori.push(`${nome}: ${e.message}`); return null; } };

  // ---------- i token, letti dal file ----------
  const css = await (await fetch('../token.css')).text();
  const radice = css.match(/:root\s*\{([\s\S]*?)\n\}/)[1];
  const sezioni = []; let cur = null, gruppo = '';
  for (const riga of radice.split('\n')) {
    const t = riga.match(/^\s*\/\*\s*(.*?)\s*\*\/\s*$/);
    if (t) { if (t[1].startsWith('·')) gruppo = t[1].slice(1).trim(); else { cur = {titolo: t[1], token: []}; sezioni.push(cur); gruppo = ''; } continue; }
    const k = riga.match(/^\s*(--[\w-]+):\s*(.*?);\s*(?:\/\*\s*(.*?)\s*\*\/)?\s*$/);
    if (k && cur) cur.token.push({nome: k[1], valore: k[2], ruolo: k[3] || '', gruppo});
  }
  const cambia = [...css.matchAll(/(@media[^{]*|@container[^{]*)\{\s*:root\s*\{([^}]*)\}/g)].map(m => ({cond: m[1].trim(), dich: m[2].trim()}));
  const tutti = sezioni.flatMap(s => s.token.map(t => ({...t, sezione: s.titolo})));
  const risolto = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const sez = nome => sezioni.find(s => s.titolo.startsWith(nome))?.token || [];

  // ---------- gli stati forzati, dalle regole del sistema ----------
  const forzati = [];
  for (const foglio of document.styleSheets) {
    let regole; try { regole = foglio.cssRules; } catch (e) { continue; }
    for (const r of regole) {
      if (r.type !== CSSRule.STYLE_RULE || !/:(hover|active|focus-visible)/.test(r.selectorText)) continue;
      forzati.push(r.cssText.replace(/:hover/g, '.sim-sopra').replace(/:active/g, '.sim-premuto').replace(/:focus-visible/g, '.sim-fuoco'));
    }
  }
  const fSim = new CSSStyleSheet(); fSim.replaceSync(forzati.join('\n')); document.adoptedStyleSheets = [...document.adoptedStyleSheets, fSim];

  // ---------- la home vera, da cui si copiano i componenti ----------
  const home = new DOMParser().parseFromString(await (await fetch('../../it/index.html')).text(), 'text/html');
  const da = (sel, n = 0) => { const e = home.querySelectorAll(sel)[n]; if (!e) throw new Error('nella home manca ' + sel); const c = e.cloneNode(true); c.removeAttribute('id'); c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); return c; };
  const sblocca = n => { n.querySelectorAll('[hidden]').forEach(x => x.removeAttribute('hidden')); return n; };
  const html = s => { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; };
  const prova1 = (et, nodo, classe = '') => el('div', {class: 'cat-prova' + (classe.includes('largo') ? ' intero' : '')}, el('span', {class: 'cat-et', testo: et}), el('div', {class: 'cat-quadro ' + classe}, nodo));
  const scheda = ({nome, id, regola, confine, persona, provenienza, prove}) => el('article', {class: 'cat-scheda'}, el('h3', {testo: nome}),
    el('dl', {}, el('dt', {testo: 'Identificatore'}), el('dd', {html: id}), el('dt', {testo: 'Regola d\'uso'}), el('dd', {html: regola}), el('dt', {testo: 'Non si usa'}), el('dd', {html: confine}),
      el('dt', {testo: 'Persona e compito'}), el('dd', {html: persona}), el('dt', {testo: 'Provenienza'}), el('dd', {html: provenienza})),
    el('div', {class: 'cat-prove'}, prove));
  const stati = (fabbrica, nomi = ['riposo', 'passaggio', 'fuoco', 'premuto', 'disattivato']) => nomi.map(n => {
    const x = fabbrica(); const t = x.matches('button, a') || x.querySelector('button') ? x : x;
    const bersaglio = x.matches('button, a, .voce, .frase') ? x : x.querySelector('button, a') || x;
    if (n === 'passaggio') bersaglio.classList.add('sim-sopra'); if (n === 'fuoco') bersaglio.classList.add('sim-fuoco'); if (n === 'premuto') bersaglio.classList.add('sim-premuto');
    if (n === 'disattivato') { if (bersaglio.matches('button')) bersaglio.disabled = true; else bersaglio.style.opacity = ''; }
    return prova1(n, x);
  });
  const pulsante = (cl, testo, extra = '') => () => html(`<button type="button" class="${cl}">${extra}${testo}</button>`);

  // ---------- sezioni ----------
  const indice = [];
  const apri = (id, titolo, nota) => { const s = $('#' + id); s.append(el('h2', {testo: titolo})); if (nota) s.append(el('p', {class: 'cat-nota', html: nota})); indice.push([id, titolo]); return s; };

  prova('identita', () => {
    const s = apri('identita', 'Identità e stato', 'Che cosa è questo sistema, da dove viene e quanto è adottato.');
    s.append(el('table', {class: 'cat-tabella'}, el('tbody', {}, ...[
      ['Scopo', 'Dare un nome e un posto a ogni valore della home di Kalliope («In riunione, alla pari») e ai suoi componenti, perché il sito intero ripartì da qui senza ricopiare valori.'],
      ['Direzione scelta', 'D2 «Alla pari, in riunione»: una stanza di un solo colore (bordeaux), una riunione di quattro riquadri uguali; tu scrivi, la frase sale in una bolla, la voce accende la stanza e gli altri si girano verso di te. Fonte: <code>design/direzione-2/D2.md</code>, <code>design/direzione-2/COSTRUZIONE.md</code>.'],
      ['Vincolo che comanda', 'L\'aspetto non cambia di un pixel rispetto alla home scelta dal proprietario e costruita nella prova (il termine di confronto): ogni valore del foglio originale è qui con lo stesso valore; i nomi sono nuovi.'],
      ['Superfici', 'Una: la home (<code>website/index.html</code>). Le altre pagine del sito (ascolta, stato, installa, in riunione, aiuto, non ancora) hanno ancora l\'aspetto di prima, con i loro fogli in <code>website/stile/</code>: non usano questo sistema.'],
      ['Stato di adozione', `La home usa il sistema per intero: <b>${tutti.length}</b> token in <code>token.css</code>, base e 14 componenti. Nessun valore scritto a mano nei fogli di stile (<code>controlla-sorgenti.mjs</code>); restano nello script <code>scena.js</code> e nell'HTML i valori elencati in <code>TOKEN.md</code> («Altro da decidere»).`],
      ['Fonti', '<code>token.css</code> (valori), <code>TOKEN.md</code> (ruolo e usi di ogni token, valori quasi uguali da decidere), <code>SISTEMA.md</code> (come si usa e che cosa è provato).'],
    ].map(([a, b]) => el('tr', {}, el('th', {testo: a, style: 'white-space: nowrap'}), el('td', {html: b}))))));
  });

  prova('colori', () => {
    const s = apri('colori', 'Colori e materiali', 'Letti da <code>token.css</code>. Un campione per token, con il ruolo che ha nella pagina. I valori quasi uguali sono distinti di proposito: l\'elenco sta in <code>TOKEN.md</code>, «Da decidere».');
    const gruppi = [['Tavolozza', n => /^--(fondo|scuro|bordeaux|magenta|rosa|testo|voce|azione)$/.test(n)], ['Bordi', n => /^--bordo-/.test(n)], ['Veli', n => /^--velo-/.test(n)], ['Testi', n => /^--testo-/.test(n)],
      ['Pannelli e vetri', n => /^--(pannello|vetro|riquadro-scuro|barra-piena|notte|nodo)/.test(n)], ['Luci', n => /^--luce-/.test(n)], ['Ombre', n => /^--(ombra|finestra-)/.test(n)],
      ['Persone della riunione', n => /^--(paola|luca|anna)-/.test(n)], ['La finestra di Kalliope', n => /^--app-/.test(n)]];
    const usati = new Set();
    const colori = sez('Colori');
    const una = (titolo, lista) => { if (!lista.length) return; s.append(el('h3', {testo: `${titolo} (${lista.length})`}), el('div', {class: 'cat-griglia-colori'}, lista.map(t => el('div', {class: 'cat-colore'}, el('span', {class: 'cat-campione'}, el('i', {style: `background: var(${t.nome})`})), el('div', {}, el('b', {testo: t.nome}), el('span', {testo: t.valore}), el('br'), el('span', {testo: t.ruolo})))))); };
    for (const [t, f] of gruppi) { const l = colori.filter(c => !usati.has(c.nome) && f(c.nome)); l.forEach(c => usati.add(c.nome)); una(t, l); }
    una('Altri materiali', colori.filter(c => !usati.has(c.nome)));
  });

  prova('caratteri', () => {
    const s = apri('caratteri', 'Caratteri e scala del testo', 'Due caratteri: Lexend per tutto il sito, DejaVu Sans solo dentro la finestra di Kalliope ricostruita. Le grandezze sono in px, come nella pagina.');
    s.append(el('div', {class: 'cat-prove'}, prova1('--font-testo · Lexend', el('p', {style: 'margin: 0; font-family: var(--font-testo); font-size: x-large', testo: 'Tu scrivi, gli altri ti sentono.'})),
      prova1('--font-app · DejaVu Sans Kalliope', el('p', {style: 'margin: 0; font-family: var(--font-app); font-size: larger', testo: 'Scrivi qui e premi Invio per parlare'}), 'chiaro')));
    s.append(el('h3', {testo: 'Pesi'}), el('div', {class: 'cat-prove'}, sez('Pesi').map(t => prova1(`${t.nome} · ${t.valore}`, el('span', {style: `font-weight: var(${t.nome}); font-size: x-large`, testo: 'Kalliope'})))));
    const corpi = tutti.filter(t => /^--corpo-\d+$/.test(t.nome)), inter = tutti.filter(t => /^--interlinea-\d+$/.test(t.nome));
    s.append(el('h3', {testo: `Grandezze del testo condivise (${corpi.length})`}), el('div', {class: 'cat-scala'}, corpi.map(t => el('div', {class: 'cat-riga-scala'}, el('code', {testo: t.nome}), el('span', {testo: t.valore}), el('span', {style: `font-size: var(${t.nome}); line-height: 1.2`, testo: 'Una frase detta nella riunione'})))));
    s.append(el('h3', {testo: `Interlinee condivise (${inter.length})`}), el('div', {class: 'cat-scala'}, inter.map(t => el('div', {class: 'cat-riga-scala'}, el('code', {testo: t.nome}), el('span', {testo: t.valore}), el('span', {style: `display: block; line-height: var(${t.nome}); max-width: 22em; border-left: var(--filetto-comando) solid var(--bordo-comando)`, testo: 'Le parole si accendono mentre le dici e gli altri ti sentono.'})))));
    s.append(el('p', {class: 'cat-nota', html: 'Le grandezze di un solo componente (il titolo, la bolla, il marchio…) hanno il nome del componente: sono nella tabella in fondo. Alfabeti: il sito è in italiano; il carattere è il sottoinsieme latino.'}));
  });

  prova('forme', () => {
    const s = apri('forme', 'Spazi, forme e raggi', 'Spazi a gradini, raggi, filetti, ombre e livelli, dalla tabella dei token.');
    const sp = tutti.filter(t => /^--spazio-\d+$/.test(t.nome));
    s.append(el('h3', {testo: `Spazi (${sp.length} gradini)`}), el('div', {class: 'cat-scala'}, sp.map(t => el('div', {class: 'cat-riga-scala'}, el('code', {testo: t.nome}), el('span', {testo: t.valore}), el('div', {class: 'cat-barra', style: `width: min(var(${t.nome}), 100%)`})))));
    const ra = tutti.filter(t => /^--raggio-(\d+|pillola)$/.test(t.nome));
    s.append(el('h3', {testo: `Raggi (${ra.length})`}), el('div', {class: 'cat-prove'}, ra.map(t => prova1(`${t.nome} · ${t.valore}`, el('span', {class: 'cat-forma', style: `border-radius: var(${t.nome})`})))));
    s.append(el('h3', {testo: 'Filetti'}), el('div', {class: 'cat-prove'}, sez('Filetti').filter(t => /^--filetto-/.test(t.nome)).map(t => prova1(`${t.nome} · ${t.valore}`, el('span', {class: 'cat-forma', style: `background: transparent; border: var(${t.nome}) solid var(--voce)`})))));
    const omTutte = sez('Ombre'), om = omTutte.filter(t => !/vmax/.test(t.valore)); s.append(el('h3', {testo: `Ombre (${omTutte.length})`}), el('p', {class: 'cat-nota', html: 'Le ombre che coprono tutta la pagina (<code>' + omTutte.filter(t => /vmax/.test(t.valore)).map(t => t.nome).join('</code>, <code>') + '</code>) riempiono la barra compatta oltre i suoi lati: non hanno un campione.'}), el('div', {class: 'cat-prove'}, om.map(t => prova1(t.nome, el('span', {class: 'cat-ombra', style: `box-shadow: var(${t.nome})`}), 'largo'))));
    const lv = sez('Livelli'); s.append(el('h3', {testo: `Livelli (${lv.length})`}), el('p', {class: 'cat-nota', html: lv.map(t => `<code>${t.nome}</code> ${t.valore}`).join(' · ')}));
    s.append(el('h3', {testo: 'Che cosa cambia con la larghezza'}), el('p', {class: 'cat-nota', html: 'Token che il sistema ridefinisce per larghezza: ' + (cambia.map(c => `<code>${c.cond.replace(/^@/, '')}</code> → ${c.dich}`).join(' · ') || 'nessuno') + '. Le soglie delle larghezze sono in <code>TOKEN.md</code>.'}));
  });

  prova('componenti', () => {
    const s = apri('componenti', 'Componenti', 'I componenti veri della home, copiati da <code>website/index.html</code> e coperti dagli stessi fogli. Gli stati si forzano con le stesse regole del sistema (la classe <code>sim-sopra</code> vale <code>:hover</code>, <code>sim-fuoco</code> vale <code>:focus-visible</code>, <code>sim-premuto</code> vale <code>:active</code>). «Disattivato» è l\'attributo <code>disabled</code>; «in corso» e «errore» stanno dove il componente li ha.');
    const comuni = {verifica: ''};
    // --- barra e menu
    s.append(scheda({nome: 'Barra e menu', id: '<code>.barra</code> <code>.marchio</code> <code>.menu</code> <code>.barra-azione</code> <code>.pulsante-menu</code> (stile/componenti/barra.css)',
      regola: 'La barra resta in alto; a riposo è trasparente sulla stanza, scorrendo diventa piena (<code>.compatta</code>) e l\'azione «Scarica e installa» le entra accanto (<code>.con-azione</code>), il menu le fa posto. Sotto 960 px le cinque voci stanno dietro «Menu».',
      confine: 'Non per navigazioni interne a un tratto; l\'azione in barra è una sola.', persona: 'Chi arriva e vuole sapere dove andare o scaricare, a ogni larghezza.', provenienza: 'Direzione D2 (primo schermo scelto) e correzioni 6a/8b della home: barra compatta piena, menu a una riga da 960 px.',
      prove: [['a riposo, in cima (la home viva)', 0], ['scorrendo: barra piena con l\'azione in barra', 700]].map(([n, y]) => prova1(n, el('iframe', {class: 'cat-anteprima', src: '../../it/index.html', title: n, style: 'height: 6em', onload: ev => { try { ev.target.contentWindow.scrollTo(0, y); } catch (e) { /* stessa origine: non succede */ } }}), 'largo'))}));
    // --- pulsanti e pillole
    const cp = [['Pillola d\'azione', 'pillola azione', 'Scarica e installa', ''], ['Pillola chiara con tondo', 'pillola voce-chiara', 'Ascolta Giulia', '<span class="tondo" aria-hidden="true"></span>'], ['Pulsante con contorno', 'chiudi', 'Chiudi', ''], ['Pulsante «Rivedi»', 'rivedi', 'Rivedi il primo avvio', '']];
    s.append(scheda({nome: 'Pulsanti e pillole', id: '<code>.pillola</code> <code>.pillola.azione</code> <code>.pillola.voce-chiara</code> <code>.chiudi</code> <code>.rivedi</code> <code>.collegamento</code> <code>.tondo</code> (pulsanti.css)',
      regola: 'Una sola azione piena per schermo (<code>.azione</code>, il colore di ciò che si preme per scegliere); il chiaro è il colore della voce (<code>.voce-chiara</code>); i comandi secondari hanno solo il contorno; i collegamenti nel testo sono sottolineati e hanno la freccia.',
      confine: 'Mai due azioni piene vicine; non usare la pillola chiara per un comando che non fa sentire una voce.', persona: 'Chi scrive e chi ascolta: scegliere, avviare, chiudere.', provenienza: 'Direzione D2; stati di 4b (premuto, fuoco, non disponibile su ogni comando).',
      prove: cp.map(([n, cl, t, ex]) => el('div', {class: 'cat-prova'}, el('b', {testo: n}), el('div', {class: 'cat-prove'}, stati(pulsante(cl, t, ex), cl.includes('azione') || cl.includes('chiara') ? ['riposo', 'passaggio', 'fuoco', 'premuto', 'disattivato'] : ['riposo', 'passaggio', 'fuoco', 'premuto', 'disattivato']))))
        .concat(el('div', {class: 'cat-prova'}, el('b', {testo: 'Collegamento con freccia'}), el('div', {class: 'cat-prove'}, ['riposo', 'passaggio', 'fuoco', 'premuto'].map(n => { const a = html('<a class="collegamento" href="#pulsanti">Non uso Linux: cosa posso fare<span class="freccia" aria-hidden="true"></span></a>'); if (n === 'passaggio') a.classList.add('sim-sopra'); if (n === 'fuoco') a.classList.add('sim-fuoco'); if (n === 'premuto') a.classList.add('sim-premuto'); return prova1(n, a); }))))}));
    // --- la bolla
    s.append(scheda({nome: 'Bolla', id: '<code>.posto-bolla</code> <code>.bolla</code> <code>.bolla-corpo</code> <code>.bolla-testo</code> <code>.coda</code> (bolla.css)',
      regola: 'Ciò che scrivi sale in una bolla chiara con la coda verso di te; la parte già detta passa al magenta (<code>.detto</code>), la bolla già detta è più tenue (<code>.detta</code>).',
      confine: 'Solo per le frasi dell\'utente; non per messaggi del sistema (quelli sono «messaggi d\'errore»).', persona: 'Chi scrive: vede la frase prima che suoni.', provenienza: 'Direzione D2, idea centrale (la frase sale in una bolla).',
      prove: [['riposo', ''], ['già detta', 'detta']].map(([n, c]) => { const p = da('.posto-bolla'); p.removeAttribute('aria-hidden'); if (c) p.querySelector('.bolla').classList.add(c); return prova1(n, p, 'largo'); })}));
    // --- i riquadri della riunione
    const ch = da('.chiamata'); const cg = el('div', {class: 'cat-controlli'}, [['Tu parli', n => n.querySelector('.riquadro.tu').classList.toggle('parla')], ['Gli altri guardano', n => n.querySelectorAll('.persona').forEach(x => x.classList.toggle('guarda'))], ['Annuisce', n => n.querySelectorAll('.persona').forEach(x => { x.classList.remove('annuisce'); void x.offsetWidth; x.classList.add('annuisce'); })]].map(([t, f]) => el('button', {type: 'button', testo: t, onclick: () => f(ch)})));
    ch.style.maxWidth = '40em';
    s.append(scheda({nome: 'Riquadri della riunione', id: '<code>.chiamata</code> <code>.griglia</code> <code>.riquadro</code> <code>.persona</code> <code>.figura</code> <code>.barre</code> <code>.nome</code> <code>.alone</code> <code>.bordo</code> (riunione.css)',
      regola: 'Quattro riquadri uguali: il tuo («Tu») con le barre della voce e l\'alone, gli altri con una figura che si gira verso di te (<code>.guarda</code>) e annuisce (<code>.annuisce</code>). Stesse forme nella riunione del filo (<code>.riunione-filo</code>) e nella chiusura (<code>.tavolo</code>).',
      confine: 'Sono persone d\'esempio, dichiarate tali nella didascalia; non per mostrare partecipanti reali.', persona: 'Chi ascolta: capisce che gli altri sentono.', provenienza: 'Direzione D2: «alla pari». Figure e palette di Paola, Luca e Anna: decisione progettuale dichiarata.',
      prove: [prova1('prova viva: premi i bottoni', el('div', {}, ch, el('div', {style: 'height: 0.8em'}), cg), 'largo')]}));
    // --- la scheda dell'ascolto
        const ascolto = (cls) => { const n = sblocca(da('.fila-ascolto')); n.querySelectorAll('.fila-ascolto > .pillola').forEach(b => b.setAttribute('hidden', '')); n.classList.add('aperta'); return n; };
    const stAsc = [['aperta', n => {}], ['voce in riproduzione', n => n.querySelector('.voce').classList.add('suona')], ['voce in caricamento', n => n.querySelector('.voce').classList.add('carica')], ['voce in pausa', n => n.querySelector('.voce').classList.add('pausa')],
      ['frase che suona', n => n.querySelector('.frase').classList.add('suona')], ['frase attiva', n => n.querySelector('.frase').setAttribute('aria-current', 'true')], ['voce al passaggio', n => n.querySelector('.voce:not([aria-pressed="true"])').classList.add('sim-sopra')]];
    s.append(scheda({nome: 'Scheda dell\'ascolto', id: '<code>.fila-ascolto</code> <code>.ascolto</code> <code>.voce</code> <code>.frase</code> <code>.chiudi</code> (ascolto.css)',
      regola: 'La pillola chiara «Ascolta Giulia» si apre in una scheda con le due voci, «Chiudi» e le tre frasi; la voce scelta è piena, la frase che suona ha il punto che pulsa, quella in caricamento il cerchio tratteggiato.',
      confine: 'Una sola scheda aperta; sugli schermi bassi diventa compatta (<code>.palco.compatta</code>) e la finestra di Kalliope le cede il posto.', persona: 'Chi vuole sentire la voce vera prima di scaricare.', provenienza: 'Direzione D2, correzioni P5 (la voce scelta si vede) e 8c/8d (scheda compatta sugli schermi bassi).',
      prove: stAsc.map(([n, f]) => { const x = ascolto(); f(x); return prova1(n, x, 'largo alto'); })}));
    // --- la finestra ricostruita
    const fin = (f) => { const x = da('.sotto'); f(x); return x; };
    const stFin = [['riposo', x => {}], ['campo con il testo e il cursore', x => { const c = x.querySelector('.f-campo'); c.classList.add('fuoco', 'pieno'); x.querySelector('.f-scritto').textContent = 'Buongiorno a tutti!'; }], ['mentre parla', x => { x.querySelector('.f-stato').classList.add('parla'); x.querySelector('.f-stato').textContent = 'Sto parlando…'; x.querySelector('.f-parla').classList.add('attivo'); const fe = x.querySelector('.f-ferma'); fe.disabled = false; fe.classList.add('attivo'); }], ['in allarme (variante definita, la pagina non la usa)', x => x.querySelector('.f-stato').classList.add('allarme')]];
    s.append(scheda({nome: 'Finestra di Kalliope ricostruita', id: '<code>.sotto</code> <code>.finestra</code> <code>.f-stato</code> <code>.f-campo</code> <code>.f-pulsante</code> <code>.f-parla</code> <code>.f-ferma</code> · primo avvio: <code>.primo-avvio</code> <code>.finestra.avvio</code> (finestra.css)',
      regola: 'È una ricostruzione dell\'app vera (testi e colori di <code>app.slint</code>, DejaVu Sans su bianco): resta nel suo mondo chiaro anche sulla stanza scura e dice di essere una ricostruzione (<code>.nota-ricostruzione</code>).',
      confine: 'Non è una finestra del sito: non ha comandi che funzionino; «Parla» e «Ferma» non si premono.', persona: 'Chi deve capire che cosa troverà installando.', provenienza: 'Osservazione dell\'app Kalliope 0.1 (vincolo del progetto); ricostruzione dichiarata.',
      prove: stFin.map(([n, f]) => prova1(n, fin(f), 'chiaro')).concat(prova1('primo avvio (finestra, riunione con microfono, nota)', sblocca(da('.primo-avvio')), 'largo'))}));
    // --- le frasi del filo
    const msg = (f) => { const x = da('.messaggio'); x.querySelectorAll('audio, .altra-voce, .senza-js').forEach(h => h.remove()); sblocca(x); f(x); return x; };
    const stMsg = [['riposo', x => {}], ['in voce', x => x.classList.add('in-voce')], ['in pausa', x => x.classList.add('in-pausa')], ['comando che suona', x => x.querySelector('.suona-frase').classList.add('suona')], ['comando in caricamento', x => x.querySelector('.suona-frase').classList.add('carica')], ['comando in pausa', x => x.querySelector('.suona-frase').classList.add('pausa')], ['comando al passaggio', x => x.querySelector('.suona-frase').classList.add('sim-sopra')]];
    s.append(scheda({nome: 'Frase del filo con i suoi comandi', id: '<code>.messaggio</code> <code>.filo-bolla</code> <code>.messaggio-sotto</code> <code>.suona-frase</code> <code>.durata</code> <code>.detto-riga</code> (filo.css)',
      regola: 'Ogni frase è una bolla con il comando che la fa sentire; mentre suona la bolla ha il contorno acceso, il comando mostra lo stato (suona, carica, pausa) e sotto compare la forma detta («1.250 € +» diventa «milleduecentocinquanta euro più»).',
      confine: 'Una frase alla volta; senza JavaScript il comando è un lettore nativo.', persona: 'Chi prova le frasi vere con il testo accanto.', provenienza: 'Direzione D2 e correzioni P3/P4 (il filo con la riunione accanto); contenuti in <code>design/direzione-2/CONTENUTI.md</code>.',
      prove: stMsg.map(([n, f]) => { return prova1(n, msg(f), 'largo'); })}));
    // --- i messaggi d'errore
    const err = (testo, mod) => { const x = html(`<div class="errore-ascolto" role="alert"><p>${testo}</p><div class="errore-azioni"><button class="riprova" type="button">Riprova</button><a class="scarica-file" href="#errori">Scarica il file e ascoltalo</a></div></div>`); mod?.(x); return x; };
    s.append(scheda({nome: 'Messaggi d\'errore', id: '<code>.errore-ascolto</code> <code>.errore-azioni</code> <code>.riprova</code> <code>.scarica-file</code> (errori.css)',
      regola: 'Il messaggio sta vicino al comando che l\'ha causato, dice che cosa fare, offre «Riprova» e l\'alternativa; il testo resta sempre leggibile. Nella scheda in alto sta al posto delle frasi, senza riquadro dentro il riquadro.',
      confine: 'Solo per l\'audio che non parte o si interrompe; non per conferme.', persona: 'Chi non sente la voce: la rete, il file o il browser.', provenienza: 'Costruzione 4b (errori e recupero) e correzioni 6b/8d.',
      prove: [prova1('nel filo', err('La voce non parte: il file non si carica. Controlla la connessione e riprova.'), 'largo'), prova1('riprova al passaggio', err('Il suono si è interrotto.', x => x.querySelector('.riprova').classList.add('sim-sopra')), 'largo'),
        prova1('nella scheda in alto', (() => { const n = ascolto(); n.querySelector('.ascolto').classList.add('con-errore'); n.querySelector('.ascolto-dentro').append(err('La voce non parte: il file non si carica.')); return n; })(), 'largo alto')]}));
    // --- tratti e scene
    s.append(scheda({nome: 'Tratti e scene (la strada della voce, i toni)', id: '<code>.tratto</code> <code>.scena-notte</code> <code>.scena-stanza</code> <code>.scena-chiara</code> · strada: <code>.strada</code> <code>.tappa</code> <code>.nodo</code> <code>.linea</code> <code>.impulso</code> (tratti.css, strada.css)',
      regola: 'Ogni tratto è una scena a tutta larghezza con gli angoli alti di un riquadro e un tono suo: il filo è la notte, la strada e la chiusura sono la stanza, «Che cosa serve» è chiaro. La strada mostra dove passa la voce: tappe accese (<code>.fatta.acceso</code>), «forse» tratteggiate.',
      confine: 'Un tono per tratto; il chiaro è il colore della bolla (ciò che dici), non uno sfondo neutro.', persona: 'Chi scorre la pagina per capire stato e riservatezza.', provenienza: 'Correzioni 6a (P2, P13, P14). Qui senza JavaScript: la strada è già disegnata e accesa.',
      prove: [['notte', 'scena-notte'], ['stanza', 'scena-stanza'], ['chiara', 'scena-chiara']].map(([n, c]) => prova1(n, el('div', {class: c, style: 'padding: 1.2em 2em; border-radius: var(--raggio-scena) var(--raggio-scena) 0 0'}, el('h2', {style: 'margin: 0 0 0.3em; font-size: x-large', testo: 'Tratto ' + n}), el('p', {style: 'margin: 0', testo: 'Il tono del tratto cambia fondo e colore del testo.'}))))
        .concat(prova1('la strada', (() => { const st = da('.strada'); return st; })(), 'largo'))}));
    // --- il piede
    s.append(scheda({nome: 'Piede', id: '<code>.piede</code> (piede.css)', regola: 'Torna la notte: i collegamenti alle cinque sezioni e le due righe sulla versione, la licenza e l\'assenza di cookie.', confine: 'Non contiene azioni nuove.', persona: 'Chi finisce la pagina.', provenienza: 'Correzioni 6a (P2).', prove: [prova1('piede', da('.piede'), 'largo')]}));
  });

  prova('movimento', () => {
    const s = apri('movimento', 'Movimento ed effetti', 'L\'inventario degli effetti della home: per ognuno dove sta, i token del tempo e della curva (letti dal file) e un comando per riprodurlo e fermarlo. I valori viaggiano con i token: cambiarli in <code>token.css</code> cambia l\'effetto qui e nella pagina. Con «riduci movimento» la pagina porta tutto a 1 ms (regola <code>movimento-ridotto</code> in <code>base.css</code>); il catalogo ha i comandi per provare l\'effetto normale.');
    const lista = el('div', {class: 'cat-movimento'}); s.append(lista);
    const tok = n => `<code>${n}</code> ${risolto(n) || '—'}`;
    const subj = () => html('<a class="pillola azione" href="#movimento">Scarica e installa</a>');
    const entrata = (nome, d, curva = '--entra', ritardo) => ({nome: `Entrata «${nome}»`, dove: `arrivo.css · ${nome === 'sale' ? 'righe del titolo' : nome === 'sale12' ? 'presentazione, comandi, stato' : nome === 'entra' ? 'riquadri della riunione' : nome === 'appare' ? 'didascalia, cornice' : 'luce della stanza'}`, tokens: [d, curva, ...(ritardo ? [ritardo] : [])], crea: subj,
      avvia: n => { n.style.animation = 'none'; void n.offsetWidth; n.style.animation = `${nome} var(${d}) var(${curva}) both`; }, ferma: n => { n.style.animation = 'none'; }});
    const effetti = [entrata('sale', '--durata-riga', '--entra', '--ritardo-riga-1'), entrata('sale12', '--durata-presentazione', '--entra'), entrata('entra', '--durata-riquadro', '--entra'), entrata('appare', '--durata-didascalia', '--curva-dolce'), entrata('accende', '--durata-luce', '--curva-dolce'),
      {nome: 'Battito delle palpebre «batte»', dove: 'riunione.css · .persona .occhi ellipse (ritardi 2,7 / 3,3 / 4,1 s)', tokens: ['--durata-paola-occhi', '--ritardo-paola-occhi'], crea: () => { const f = da('.persona'); f.style.width = '9em'; f.style.height = '6em'; return f; }, avvia: n => n.querySelectorAll('.occhi ellipse').forEach(e => { e.style.animation = 'none'; void e.getBoundingClientRect(); e.style.animation = 'batte var(--durata-paola-occhi) var(--curva-dolce) 0s 3'; }), ferma: n => n.querySelectorAll('.occhi ellipse').forEach(e => { e.style.animation = 'none'; })},
      {nome: 'Cenno del capo «annuisce»', dove: 'riunione.css · .annuisce .cenno', tokens: ['--durata-annuisce-cenno', '--curva-dolce-doppia'], crea: () => { const f = da('.persona'); f.style.width = '9em'; f.style.height = '6em'; return f; }, avvia: n => { n.classList.remove('annuisce'); void n.offsetWidth; n.classList.add('annuisce'); }, ferma: n => n.classList.remove('annuisce')},
      {nome: 'Anello della voce che suona «anello»', dove: 'ascolto.css · .voce.suona (continua)', tokens: ['--durata-voce-tondo-dopo', '--curva-uscita'], crea: () => html('<button type="button" class="voce"><span class="voce-tondo" aria-hidden="true"></span>Giulia</button>'), avvia: n => n.classList.add('suona'), ferma: n => n.classList.remove('suona')},
      {nome: 'Cerchio che gira «gira» (caricamento)', dove: 'ascolto.css · .voce.carica (continua)', tokens: ['--durata-voce-tondo-dopo-2', '--curva-lineare'], crea: () => html('<button type="button" class="voce"><span class="voce-tondo" aria-hidden="true"></span>Marco</button>'), avvia: n => n.classList.add('carica'), ferma: n => n.classList.remove('carica')},
      {nome: 'Punto che pulsa «pulsa»', dove: 'ascolto.css · .frase.suona (continua)', tokens: ['--durata-frase-prima-2', '--curva-dolce-doppia'], crea: () => html('<button type="button" class="frase">«Il preventivo…»</button>'), avvia: n => n.classList.add('suona'), ferma: n => n.classList.remove('suona')},
      {nome: 'Cursore che lampeggia «lampeggia»', dove: 'finestra.css · .f-campo.fuoco .f-cursore (continua)', tokens: ['--durata-f-campo-f-cursore', '--curva-a-scatti'], crea: () => { const x = da('.sotto'); x.querySelector('.f-campo').classList.remove('fuoco'); return x; }, avvia: n => n.querySelector('.f-campo').classList.add('fuoco'), ferma: n => n.querySelector('.f-campo').classList.remove('fuoco')},
      {nome: 'Lampo del bordo «lampo»', dove: 'riunione-app.css · .riunione-app.vivo .tu .bordo', tokens: ['--durata-riunione-app-bordo', '--curva-uscita'], crea: () => { const x = da('.riunione-app'); x.style.maxWidth = '30em'; return x; }, avvia: n => { n.classList.remove('vivo'); void n.offsetWidth; n.classList.add('vivo'); }, ferma: n => n.classList.remove('vivo')},
      {nome: 'Transizioni dei comandi', dove: 'pulsanti.css · tutti i comandi (al passaggio, premuto, fuoco)', tokens: ['--durata-pillola', '--entra'], crea: subj, avvia: n => { n.classList.add('sim-sopra'); setTimeout(() => n.classList.remove('sim-sopra'), 900); }, ferma: n => n.classList.remove('sim-sopra')}];
    for (const e of effetti) {
      const campo = el('div', {class: 'cat-campo'}); const n = e.crea(); campo.append(n);
      lista.append(el('div', {class: 'cat-effetto'}, el('div', {}, el('h4', {testo: e.nome}), el('p', {html: e.dove}), el('p', {html: e.tokens.map(tok).join(' · ')})), campo, el('div', {class: 'cat-controlli'}, el('button', {type: 'button', testo: 'Riproduci', onclick: () => e.avvia(n)}), el('button', {type: 'button', testo: 'Ferma', onclick: () => e.ferma(n)}))));
    }
    s.append(el('h3', {testo: 'Effetti legati allo scorrimento o a un\'ora della scena (senza comando qui)'}), el('ul', {class: 'cat-non-ancora', html: '<li><b>Ingresso dei tratti</b> (<code>scena-entra</code>, tratti.css): il ritaglio ai lati si allarga mentre il tratto entra, legato allo scorrimento (<code>animation-timeline: view()</code>).</li><li><b>Barra piena</b> (<code>barra-piena</code>, barra.css): senza JavaScript la barra diventa piena dopo 24 px di scorrimento.</li><li><b>Velo del menu</b> (<code>menu-ancora</code>, barra.css): sfuma il bordo basso del menu che scorre.</li><li><b>Voce, onde, luce e strada</b>: guidate da <code>scena.js</code> sull\'orologio della scena (tempi di <code>voce/tempi.json</code>); i loro valori in script non passano ancora dai token.</li>'}));
  });

  prova('anteprime', () => {
    const s = apri('anteprime', 'Anteprime e dispositivi', 'La home vera, viva, a tre larghezze (iframe della stessa pagina). Non sono i quindici dispositivi del sistema: le simulazioni complete non sono ancora in questo catalogo (vedi «Non ancora»).');
    const misure = [[390, 760, 'Telefono 390'], [820, 700, 'Tavoletta 820'], [1366, 640, 'Computer 1366×640']];
    const barra = el('div', {class: 'cat-misure'}); const cont = el('div', {}); s.append(barra, cont);
    for (const [w, h, n] of misure) barra.append(el('button', {type: 'button', 'aria-pressed': 'false', testo: n, onclick: ev => { barra.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false')); ev.target.setAttribute('aria-pressed', 'true'); cont.replaceChildren(el('iframe', {class: 'cat-anteprima', src: '../../it/index.html', title: n, width: w, height: h, style: 'max-width: 100%'})); }}));
  });

  prova('tabella', () => {
    const s = apri('tabella', `Tutti i token (${tutti.length})`, 'Tabella generata da <code>token.css</code> mentre la pagina si apre: nome, valore scritto, valore calcolato dal browser e un campione. Il ruolo e gli usi di ogni token sono in <code>TOKEN.md</code>.');
    const cerca = el('input', {class: 'cat-cerca', type: 'search', placeholder: 'Cerca un token o un valore', 'aria-label': 'Cerca un token'}); s.append(cerca);
    const tb = el('tbody'); const tab = el('table', {class: 'cat-tabella'}, el('thead', {}, el('tr', {}, ['Sezione', 'Token', 'Valore', 'Calcolato', 'Campione'].map(t => el('th', {testo: t})))), tb); s.append(tab);
    const campione = t => {
      if (/^(#|rgba?\()|^var\(--[\w-]+\)$/.test(t.valore) && t.sezione.startsWith('Colori')) return el('span', {class: 'cat-campione', style: `background: var(${t.nome})`});
      if (t.sezione.startsWith('Ombre') && !/vmax/.test(t.valore)) return el('span', {class: 'cat-ombra', style: `box-shadow: var(${t.nome}); width: 4em; height: 2em`});
      if (t.sezione.startsWith('Raggi')) return el('span', {class: 'cat-forma', style: `border-radius: var(${t.nome}); width: 3em; height: 2em`});
      if (/^-?[\d.]+px$/.test(t.valore) && /^(Spazi|Misure)/.test(t.sezione) && parseFloat(t.valore) > 0) return el('span', {class: 'cat-barra', style: `display: block; width: min(var(${t.nome}), 100%)`});
      if (t.sezione.startsWith('Scala del testo') && /^--(corpo|[\w-]+-grandezza)/.test(t.nome)) return el('span', {style: `font-size: var(${t.nome})`, testo: 'Aa'});
      if (t.sezione.startsWith('Movimento') && /ms$|s$/.test(t.valore)) return el('span', {class: 'cat-barra', style: `display: block; width: calc(${parseFloat(t.valore) * (/ms$/.test(t.valore) ? 1 : 1000)} * 0.06em); max-width: 100%`});
      return '';
    };
    for (const t of tutti) tb.append(el('tr', {'data-q': (t.nome + ' ' + t.valore + ' ' + t.sezione + ' ' + t.ruolo).toLowerCase()}, el('td', {testo: t.sezione}), el('td', {class: 'n', testo: t.nome}), el('td', {class: 'v', testo: t.valore.length > 120 ? t.valore.slice(0, 117) + '…' : t.valore}), el('td', {class: 'v', testo: (risolto(t.nome) || '').slice(0, 80)}), el('td', {}, campione(t))));
    cerca.addEventListener('input', () => { const q = cerca.value.toLowerCase().trim(); tb.querySelectorAll('tr').forEach(r => { r.hidden = q && !r.dataset.q.includes(q); }); });
  });

  prova('non-ancora', () => {
    const s = apri('non-ancora', 'Non ancora', 'Gli ambiti di un catalogo completo che questo non copre, con il motivo. Il catalogo non si dichiara completo.');
    s.append(el('ul', {class: 'cat-non-ancora', html: [
      ['Persone e percorsi', 'il sistema è ricavato da una sola superficie (la home); persone, compiti e livelli di tutto il sito stanno in <code>design/direzione-2/PIANO.md</code>, non qui.'],
      ['Anteprime delle schermate dei compiti reali', 'in questo sistema esiste una sola schermata (la home); le altre pagine non sono ancora state ridisegnate.'],
      ['Icone e immagini', 'solo il marchio e le figure della riunione (inline); non c\'è un inventario completo né regole di disegno delle icone.'],
      ['Interazioni', 'tastiera, tocco e recupero sono provati sulla home (<code>design/direzione-2/COSTRUZIONE.md</code>), non ripetuti qui; gli stati forzati qui sono una simulazione delle regole, non un test del gesto.'],
      ['Dati e media', 'l\'audio vero (voci Giulia e Marco) suona solo nella home; il catalogo non lo riproduce.'],
      ['Accessibilità e testo grande', 'questo incarico non ripete le prove di testo grande, zoom e tastiera; valgono quelle della home consegnata.'],
      ['Prestazioni e canali', 'la fase delle prestazioni non è ancora stata fatta; nessun budget qui.'],
      ['Provenienza e decisioni', 'la direzione scelta è in <code>design/direzione-2/D2.md</code>; le schede dei riferimenti e la matrice del confronto non sono in questo repository.'],
      ['Tutti i dispositivi (15 voci) nei tre motori', 'per decisione dell\'incarico: solo un confronto pixel per pixel su quattro misure in Chromium; niente matrici. Qui tre larghezze vive come anteprima.'],
      ['Prove con i log', 'gli esiti dei confronti stanno in <code>sistema/prove/</code> e in <code>SISTEMA.md</code>, non letti dal catalogo.'],
      ['Lingue e alfabeti', 'il sito è solo in italiano; nessuna traduzione da mostrare.'],
      ['Valori in <code>scena.js</code>', 'curve, durate e colori delle onde scritti nello script non sono ancora token (<code>TOKEN.md</code>, «Altro da decidere»).'],
    ].map(([a, b]) => `<li><b>${a}</b>: ${b}</li>`).join('')}));
  });

  // l'indice e lo stato
  const ind = $('#indice'); for (const [id, t] of indice) ind.append(el('li', {}, el('a', {href: '#' + id, testo: t})));
  stato.textContent = errori.length ? `Qualche sezione non si è costruita: ${errori.join(' · ')}` : `${tutti.length} token letti da token.css, ${forzati.length} regole di stato forzabili, componenti copiati dalla home.`;
  window.__catalogo = {token: tutti.length, errori, stati: forzati.length};
})();
