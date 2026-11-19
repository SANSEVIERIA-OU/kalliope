/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// «Non ancora» nella direzione 2: la riunione è pronta, la tua voce non ancora.
// Il primo schermo si muove da sé con il solo CSS (componenti/riunione-ferma.css). Qui: il tentativo su «Kalliope»; la strada che si
// ferma al microfono quando arriva sullo schermo; la bolla della chiusura che nasce; e il solo suono della pagina, la frase della
// chiusura detta con la registrazione vera, che parte soltanto se la persona preme. Le parole si accendono sui tempi di
// voce/tempi.json, le onde partono da «Tu» e chi ascolta si gira. Nessun testo e nessun colore qui: i testi stanno nella pagina
// (anche quelli di <template id="testi-pagina">, che dà testi.js), i valori in design-system/token.css.
// Con «riduci movimento» ogni scena è al suo stato finale; il suono c'è comunque, a richiesta. Se i fogli di stile non sono arrivati
// (i token mancano) la pagina resta com'è, ferma, e il suono funziona lo stesso.
// Con la scheda in secondo piano si ferma tutto insieme (l'orologio della scena, le animazioni in corso, l'ascolto) e al ritorno si
// riparte da dove si era, come nella home (scena.js, «La scheda in secondo piano»).
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const {testo: T, formato: fmt} = window.Testi;
  // la voce sta in cima al sito (voce/…), accanto agli altri file condivisi: questo script sta in non-ancora/
  const RADICE = new URL('../', document.currentScript.src);
  const radice = getComputedStyle(document.documentElement);
  const tok = n => radice.getPropertyValue(n).trim();
  // i token non ci sono se un foglio di stile non è arrivato: la pagina resta ferma, come con «riduci movimento»
  const senzaStili = !tok('--entra');
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches || senzaStili;
  const verticale = () => matchMedia('(max-width: 760px)').matches;
  const tempo = n => { const v = tok(n), t = v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000; return isFinite(t) ? t : 0; };
  const ENTRA = tok('--entra');

  // =================================================================================================================
  // L'OROLOGIO DELLA SCENA: cammina solo con la scheda in vista; ciò che si fa «dopo tanti ms» aspetta con lui
  // =================================================================================================================
  let fermoTot = 0, nascostoDa = document.hidden ? performance.now() : null;
  const tScena = () => (nascostoDa === null ? performance.now() : nascostoDa) - fermoTot;
  const agenda = [];
  let giraAgenda = 0;
  function dopo(ms, f) {
    const e = {t: tScena() + ms, f};
    agenda.push(e);
    if (!giraAgenda) giraAgenda = requestAnimationFrame(passoAgenda);
    return e;
  }
  function passoAgenda() {
    giraAgenda = 0;
    const t = tScena();
    for (let i = 0; i < agenda.length;) {
      const e = agenda[i];
      if (e.annullato) agenda.splice(i, 1);
      else if (e.t <= t) { agenda.splice(i, 1); e.f(); } else i++;
    }
    if (agenda.length) giraAgenda = requestAnimationFrame(passoAgenda);
  }
  // un annuncio per i lettori di schermo, solo per ciò che non si vede da sé (l'ascolto)
  const annuncio = $('#annuncio');
  function annuncia(testoAnnuncio) { if (!annuncio) return; annuncio.textContent = ''; setTimeout(() => { annuncio.textContent = testoAnnuncio; }, 60); }

  // =================================================================================================================
  // IL PRIMO SCHERMO: il tentativo su «Kalliope». Il segno della scelta lascia «Microfono del computer», va sul posto di
  // «Kalliope», lo trova vuoto (si svuota, il posto manda un'onda tratteggiata, il tuo bordo si accende, compare «non c'è»)
  // e torna. Senza script o con «riduci movimento» la barra è ferma, con «non c'è» già scritto.
  // =================================================================================================================
  const chiamata = $('.chiamata-ferma'), segno = chiamata && $('.segno-scelta', chiamata);
  const microfono = chiamata && $('.microfono', chiamata), sceltaPc = chiamata && $('.scelta.scelto', chiamata);
  const sceltaK = chiamata && $('.scelta.mancante', chiamata), tuFermo = chiamata && $('.riquadro.tu.assente', chiamata);
  // la forma del segno sopra una scelta, misurata (vale in tutte e due le direzioni di scrittura: l'ancora del segno è
  // l'inizio della riga della barra, a sinistra o a destra)
  function forma(el) {
    const m = microfono.getBoundingClientRect(), r = el.getBoundingClientRect();
    const ancora = getComputedStyle(microfono).direction === 'rtl' ? m.right - microfono.clientLeft - r.width : m.left + microfono.clientLeft;
    return {transform: `translate(${(r.left - ancora).toFixed(1)}px, ${(r.top - m.top - microfono.clientTop).toFixed(1)}px)`, width: `${r.width.toFixed(1)}px`, height: `${r.height.toFixed(1)}px`};
  }
  function provaKalliope() {
    if (!chiamata || !segno || ridotto) return;
    chiamata.classList.add('prova');
    let finita = false;
    // il tentativo interrotto (le misure della barra cambiano) va al suo stato finale: «non c'è» scritto, il segno non c'è più
    const ferma = () => {
      finita = true; segno.getAnimations().forEach(a => a.cancel());
      chiamata.classList.remove('con-segno', 'segno-via', 'segno-va'); sceltaK.classList.remove('urtata');
      chiamata.classList.add('non-c-e');
    };
    // conta la larghezza: l'altezza cambia anche quando la barra del browser si nasconde scorrendo, e non sposta niente qui
    const larghezza = innerWidth;
    const alRidimensionamento = () => { if (innerWidth === larghezza) return; removeEventListener('resize', alRidimensionamento); ferma(); };
    addEventListener('resize', alRidimensionamento);
    dopo(Math.max(0, tempo('--ritardo-segno') - tScena()), () => {
      if (finita) return;
      const da = forma(sceltaPc), a = forma(sceltaK);
      Object.assign(segno.style, da); chiamata.classList.add('con-segno');
      requestAnimationFrame(() => {
        if (finita) return;
        chiamata.classList.add('segno-via', 'segno-va');
        segno.animate([da, a], {duration: tempo('--durata-segno-va'), easing: ENTRA, fill: 'forwards'}).finished.then(() => {
          if (finita) return;
          const vuoto = parseFloat(tok('--opacita-segno-vuoto'));
          segno.animate([{...a, opacity: 1}, {...a, opacity: vuoto}], {duration: tempo('--durata-scelta-sfondo'), easing: 'ease', fill: 'forwards'});
          chiamata.classList.remove('segno-va');
          sceltaK.classList.add('urtata'); tuFermo.classList.add('urtato'); chiamata.classList.add('non-c-e');
          dopo(tempo('--attesa-segno'), () => {
            if (finita) return;
            sceltaK.classList.remove('urtata');
            const torna = tempo('--durata-segno-torna');
            segno.animate([{...a, opacity: vuoto}, {...da, opacity: 1}], {duration: torna, easing: ENTRA, fill: 'forwards'});
            dopo(torna * 0.2, () => { if (!finita) chiamata.classList.remove('segno-via'); });   // il testo torna scuro quando il segno gli è già sotto (la curva d'entrata arriva presto)
          });
        }, () => {});
      });
    });
  }
  provaKalliope();

  // =================================================================================================================
  // QUANDO ARRIVA: tenere l'indirizzo di questa pagina, che si aggiorna da sola a ogni versione
  // =================================================================================================================
  const copia = $('.copia-indirizzo'), copiato = $('.copia-fatto'), noCopia = $('.copia-errore');
  // la risposta si dice a ogni pressione, anche la seconda con le stesse parole: per i lettori di schermo il testo cambia
  function rispondi(si) {
    const [mostra, nascondi] = si ? [copiato, noCopia] : [noCopia, copiato];
    nascondi.classList.add('vuoto'); mostra.classList.add('vuoto');
    setTimeout(() => { mostra.classList.remove('vuoto'); mostraInsieme(copia, copiato.parentElement); }, 60);
  }
  if (copia && navigator.clipboard && window.isSecureContext) {
    copia.hidden = false;
    // le due risposte restano nella pagina, invisibili, e il posto per la più lunga c'è già (versioni.css, P1: il pannello non si muove quando compare la risposta)
    [copiato, noCopia].forEach(r => { r.hidden = false; r.classList.add('vuoto'); });
    copia.addEventListener('click', () => {
      navigator.clipboard.writeText(location.href.split('#')[0])
        .then(() => {
          rispondi(true);
          const posto = $('.versione.prossima');   // il posto da tenere d'occhio si accende una volta
          if (posto && !ridotto) { posto.classList.remove('ricordata'); void posto.offsetWidth; posto.classList.add('ricordata'); }
        }, () => rispondi(false));
    });
  } else {
    // gli appunti non si possono usare (indirizzo non sicuro, browser vecchio): resta la frase di chi non ha lo script, senza un comando che non c'è
    const frase = $('.versioni-piede .senza-js');
    if (frase) frase.classList.remove('senza-js');
  }

  // =================================================================================================================
  // LA STRADA CHE SI FERMA: la voce nasce, arriva dove dovrebbe esserci il microfono, lo trova vuoto
  // =================================================================================================================
  function animaStrada(strada) {
    if (strada.dataset.animata) return;
    strada.dataset.animata = '1';
    const tappe = $$('.tappa', strada);
    const finale = () => { strada.classList.add('fatto', 'provato', 'fermata'); tappe.slice(0, 2).forEach(t => t.classList.add('acceso')); };
    if (ridotto) { finale(); return; }
    const asse = verticale() ? 'scaleY' : 'scaleX';
    const linea = $('.linea-fatta', strada), imp = $('.impulso', strada);
    const rs = strada.getBoundingClientRect(), ri = imp.getBoundingClientRect();
    const c0 = {x: ri.left + ri.width / 2 - rs.left, y: ri.top + ri.height / 2 - rs.top};
    const centri = tappe.map(t => { const r = $('.nodo', t).getBoundingClientRect(); return {x: r.left + r.width / 2 - rs.left, y: r.top + r.height / 2 - rs.top}; });
    const tr = (c, s = 1) => `translate(${(c.x - c0.x).toFixed(1)}px, ${(c.y - c0.y).toFixed(1)}px) scale(${s})`;
    tappe[0].classList.add('acceso');
    linea.animate([{transform: `${asse}(0)`}, {transform: `${asse}(1)`}], {duration: 1100, delay: 200, easing: 'cubic-bezier(0.45,0,0.2,1)', fill: 'forwards'});
    imp.animate([
      {opacity: 0, transform: tr(centri[0])}, {opacity: 1, transform: tr(centri[0]), offset: 0.1},
      {opacity: 1, transform: tr(centri[2]), offset: 0.8}, {opacity: 0, transform: tr(centri[2], 0.3)}],
    {duration: 1620, easing: 'linear', fill: 'forwards'});
    dopo(760, () => { tappe[1].classList.add('acceso'); strada.classList.add('provato'); });   // «C'è già» quando la voce nasce
    dopo(1300, () => {   // la voce arriva al posto del microfono e non trova niente: un'onda tratteggiata che non va oltre
      tappe[2].classList.add('urtata');
      const u = document.createElement('span'); u.className = 'urto'; u.setAttribute('aria-hidden', 'true'); tappe[2].append(u);
      u.animate([{transform: 'scale(1)', opacity: 0.9}, {transform: `scale(${tok('--urto-scala')})`, opacity: 0}],
        {duration: tempo('--durata-urto'), easing: 'ease-out', fill: 'both'}).finished.then(() => u.remove(), () => u.remove());
      strada.classList.add('fermata');
    });
    dopo(2300, finale);
  }

  // =================================================================================================================
  // LA CHIUSURA: la frase che in alto restava senza voce, qui detta con la registrazione vera
  // =================================================================================================================
  const tavolo = $('.chiusura .tavolo'), bolla = tavolo && $('.bolla-chiusa', tavolo);
  const testo = bolla && $('.bolla-testo', bolla);
  const tu = tavolo && $('.riquadro.tu', tavolo), bordo = tu && $('.bordo', tu), alone = tu && $('.alone', tu), barre = tu ? $$('.barre i', tu) : [];
  const persone = tavolo ? $$('.riquadro.persona', tavolo) : [];
  const tela = tavolo && $('canvas.onde', tavolo);
  const bottone = $('.ascolta-ferma'), comandi = $('.comandi-ascolto');
  const BASE = [1, 2, 3, 4, 5].map(k => (k === 3 ? 1 : parseFloat(tok(`--barre-${k}-scala-y`)) || 1)), RITARDO = [0.08, 0.04, 0, 0.04, 0.08];
  const FILE = 'giulia-1';
  const nomeVoce = () => { const n = bottone && $('.nome-voce', bottone); return n ? n.textContent.trim() : ''; };

  // la frase della pagina, in parti (dove finisce una frase) e parole (agli spazi; dove non ce ne sono, con Intl.Segmenter)
  let parti = null;
  function dividi() {
    if (parti) return parti;
    const scritta = testo.textContent.trim().replace(/\s+/g, ' ');
    const lingua = document.documentElement.lang || 'it';
    const frasi = 'Segmenter' in Intl ? [...new Intl.Segmenter(lingua, {granularity: 'sentence'}).segment(scritta)].map(s => s.segment.trim()).filter(Boolean) : scritta.split(/(?<=[.!?…])\s+/);
    testo.textContent = '';
    parti = frasi.map((f, k) => {
      const parole = / /.test(f) ? f.split(' ') : ('Segmenter' in Intl ? [...new Intl.Segmenter(lingua, {granularity: 'word'}).segment(f)].map(s => s.segment) : [f]);
      return parole.map((p, j) => {
        if (k || j) testo.append(' ');
        const s = document.createElement('span'); s.className = 'p attesa'; s.textContent = p; testo.append(s);
        return s;
      });
    });
    bolla.classList.add('divisa');
    return parti;
  }

  // i tempi: voce/tempi.json (parti della frase e intensità ogni passo_ms); se mancano, in proporzione alla durata
  let TEMPI = null;
  const tempiPronti = fetch(new URL('voce/tempi.json', RADICE)).then(r => (r.ok ? r.json() : Promise.reject())).then(j => { TEMPI = j; }).catch(() => {});
  function datiFile(durata) {
    if (TEMPI && TEMPI.file && TEMPI.file[FILE]) return {passo: TEMPI.passo_ms / 1000, ...TEMPI.file[FILE]};
    const d = durata || 5;
    return {passo: 0.06, durata_s: d, frasi: [{da: 0.2, a: d * 0.25}, {da: d * 0.3, a: Math.max(0.5, d - 0.2)}], env: []};
  }
  function envA(f, t) {
    const i = t / f.passo, a = Math.floor(i);
    if (!f.env.length || a < 0 || a >= f.env.length - 1) return 0;
    return f.env[a] + (f.env[a + 1] - f.env[a]) * (i - a);
  }
  function tempiParole(f) {
    const out = [];
    parti.forEach((parole, k) => {
      const {da, a} = f.frasi[k] || f.frasi[f.frasi.length - 1];
      const lun = parole.map(p => p.textContent.length + 1), tot = lun.reduce((x, y) => x + y, 0);
      let prima = 0;
      parole.forEach((p, j) => { out.push(da + (a - da) * (prima / tot)); prima += lun[j]; });
    });
    return out;
  }
  function picchi(f) {
    const out = [];
    for (let i = 1; i < f.env.length - 1; i++) {
      const t = i * f.passo;
      if (f.env[i] > 0.6 && f.env[i] >= f.env[i - 1] && f.env[i] >= f.env[i + 1] && (!out.length || t - out[out.length - 1] >= 0.24)) out.push(t);
    }
    return out;
  }

  // ---------- le onde: da «Tu» fino all'ultimo che ascolta, 900 ms lineari; chi viene toccato si gira ----------
  let geo = null, onde = [];
  function misura() {
    const rc = tela.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    tela.width = Math.round(rc.width * dpr); tela.height = Math.round(rc.height * dpr);
    const ctx = tela.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rel = el => { const r = el.getBoundingClientRect(); return {x0: r.left - rc.left, y0: r.top - rc.top, x1: r.right - rc.left, y1: r.bottom - rc.top, el}; };
    const t = rel(tu), o = {x: (t.x0 + t.x1) / 2, y: (t.y0 + t.y1) / 2};
    const bersagli = persone.map(rel);
    bersagli.forEach(b => { b.d = Math.hypot(Math.max(b.x0 - o.x, 0, o.x - b.x1), Math.max(b.y0 - o.y, 0, o.y - b.y1)); });
    const r1 = Math.max(...bersagli.map(b => Math.hypot(Math.max(Math.abs(b.x0 - o.x), Math.abs(b.x1 - o.x)), Math.max(Math.abs(b.y0 - o.y), Math.abs(b.y1 - o.y)))));
    geo = {ctx, w: rc.width, h: rc.height, o, escludi: t, r0: Math.min(t.x1 - t.x0, t.y1 - t.y0) / 2, r1, bersagli};
  }
  addEventListener('resize', () => { geo = null; });
  function lampo(el) {
    const l = $('.lume', el); if (!l) return;
    l.getAnimations().forEach(a => a.cancel());
    l.animate([{opacity: 1}, {opacity: 1, offset: 0.57}, {opacity: 0}], {duration: 350, easing: 'linear'});
  }
  function disegnaOnde(t) {
    if (!onde.length && !geo) return;
    if (!geo) misura();
    const {ctx, w, h, o, escludi: e} = geo;
    ctx.clearRect(0, 0, w, h);
    onde = onde.filter(x => t - x.t < 1);
    if (!onde.length) return;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.rect(e.x0 - 1, e.y0 - 1, e.x1 - e.x0 + 2, e.y1 - e.y0 + 2); ctx.clip('evenodd');
    ctx.shadowColor = tok('--alone-tu'); ctx.shadowBlur = 12; ctx.lineWidth = 3.5; ctx.strokeStyle = tok('--voce');
    for (const x of onde) {
      const q = Math.min(1, Math.max(0, (t - x.t) / 0.9)), r = geo.r0 + (geo.r1 - geo.r0) * q;
      ctx.globalAlpha = 0.62 * (q < 0.8 ? 1 : (1 - q) / 0.2);
      ctx.beginPath(); ctx.arc(o.x, o.y, r, 0, Math.PI * 2); ctx.stroke();
      geo.bersagli.forEach((b, i) => { if (!x.toccati.has(i) && r >= b.d) { x.toccati.add(i); lampo(b.el); b.el.classList.add('guarda'); } });
    }
    ctx.restore();
  }

  // ---------- un ascolto alla volta: carica, suona, pausa; premere ferma o riprende ----------
  let discorso = null, ritorno = 0;
  const opus = document.createElement('audio').canPlayType('audio/ogg; codecs=opus') ? 'opus' : 'mp3';
  // lo stato è nelle classi del comando (le etichette si cambiano con il CSS, a larghezza ferma) e nel nome che dice ai lettori che cosa fa premerlo
  function stato(s) {
    ['carica', 'suona', 'pausa'].forEach(k => bottone.classList.toggle(k, s === k));
    if (s === 'fermo') bottone.removeAttribute('aria-label'); else bottone.setAttribute('aria-label', T(`ascolto.azione.${s}`));
    if (discorso) discorso.stato = s;
  }
  // quando il suono si ferma o aspetta, la voce di «Tu» si spegne (barre e alone) finché non riparte
  function quieto() { if (alone) alone.style.opacity = 0; barre.forEach(b => { b.style.transform = ''; }); }
  // premere mentre suona mette in pausa (come le frasi della home); premere in pausa riprende da dove era
  function pausa() {
    const d = discorso; if (!d || d.stato !== 'suona') return;
    d.audio._nostra = true; d.audio.pause(); d.ultimo = null;
    quieto(); stato('pausa'); annuncia(T('annuncio.pausa'));
  }
  function riprendi() {
    const d = discorso; if (!d || d.stato !== 'pausa') return;
    d.audio._nostra = false;
    const g = d.audio.play();
    if (g && g.catch) g.catch(e => { if (discorso === d && !(e && e.name === 'AbortError')) fallisci('permesso'); });
    d.ultimo = performance.now(); stato('suona'); giro();
  }
  // ferma: finita = la frase è stata detta fino in fondo (la bolla resta come detta); altrimenti la voce non ha parlato (errore,
  // annullato, scheda in secondo piano) e la bolla torna com'era, la frase scritta e non detta
  function ferma(finita) {
    const d = discorso; if (!d) return;
    discorso = null;
    d.audio._nostra = true; d.audio.pause();
    clearTimeout(lentoT); clearTimeout(attesaT);
    dividi().flat().forEach(p => p.classList.toggle('attesa', !finita));
    if (bordo) bordo.style.opacity = ''; if (alone) alone.style.opacity = '';
    tu.classList.remove('parla'); barre.forEach(b => { b.style.transform = ''; });
    bolla.classList.toggle('detta', !!finita);
    clearTimeout(ritorno);
    ritorno = setTimeout(() => persone.forEach(p => p.classList.remove('guarda')), finita ? 1700 : 0);
    stato('fermo');
  }

  // ---------- quando va storto: un messaggio vicino al comando, con «Riprova» e il file da scaricare ----------
  let nota = null, lentoT = 0, attesaT = 0;
  function togliNota() {
    clearTimeout(lentoT);
    if (!nota) return;
    // «Riprova» sparisce premendolo: il fuoco torna al comando invece di cadere sulla pagina
    const ritornoFuoco = nota.contains(document.activeElement);
    nota.remove(); nota = null; geo = null;   // senza il messaggio la riunione torna alla sua altezza (pagina.css): le onde si rimisurano
    if (ritornoFuoco) bottone.focus({preventScroll: true});
  }
  function mostraNota(causa) {
    togliNota();
    const el = document.createElement('div'), p = document.createElement('p'), az = document.createElement('div');
    el.className = 'errore-ascolto'; el.setAttribute('role', causa === 'lento' ? 'status' : 'alert');
    p.textContent = T(`errore.${causa}`);
    az.className = 'errore-azioni';
    const riprova = document.createElement('button'); riprova.type = 'button'; riprova.className = 'riprova'; riprova.textContent = T('errore.riprova');
    riprova.addEventListener('click', () => suona());
    const scarica = document.createElement('a'); scarica.className = 'scarica-file'; scarica.href = new URL(`voce/${FILE}.mp3`, RADICE).href; scarica.setAttribute('download', '');
    scarica.textContent = fmt(T('errore.scarica'), {voce: nomeVoce()});
    az.append(riprova, scarica); el.append(p, az);
    comandi.after(el); nota = el; geo = null;   // con il messaggio, al computer, la riunione si abbassa (pagina.css): le onde si rimisurano
    mostraInsieme(bolla, el);
  }
  // Ciò che un gesto apre sta nello schermo, sotto la barra: dall'inizio (la bolla dove si accendono le parole, o il comando) al fondo (il comando, il
  // messaggio d'errore, la risposta di «Copia»). Nel primo schermo vince il comando; quando un gesto apre qualcosa vince ciò che il gesto ha aperto
  // (PIANO.md, «La cornice»), e dove l'altezza non basta la riunione si abbassa perché stia tutto (pagina.css, .tavolo-pagina). Se non ci stanno insieme
  // nemmeno così (il messaggio d'errore sugli schermi più bassi, al telefono) vince uno dei due: il fondo (il messaggio d'errore sta per intero nello
  // schermo, vicino al comando che l'ha causato, e la riunione scorre sotto la barra) o l'inizio (mentre suona, la bolla con le parole che si accendono). Ma l'inizio non vince
  // a costo del pulsante premuto (l'«essenziale»: non tutto il suo contenitore, che ha anche il collegamento a «Tutte le frasi»): mentre suona vinceva senza condizioni, e in
  // urdu a 326×326, dove la riunione è già al suo minimo e la bolla ha tre righe alte, «Pausa» finiva 23 px sotto il bordo (en-XA 14). Ora si cede a gradi: prima la bolla sale
  // sotto la barra per il suo margine (le parole restano appena sotto la barra: «testo»); se non basta, il pulsante resta a 4 px dal bordo invece di 8 e le parole salgono
  // sotto la barra per il poco che manca (di norma l'interlinea della prima riga), mai il pulsante fuori (incarico 2-f, L1).
  // Se uno scorrimento è già in corso (il primo, premendo «Ascolta», e il messaggio d'errore arriva a metà) si misura dove sarà arrivato: misurando a metà
  // strada il messaggio sembrava già in vista, non si chiedeva niente, e lo scorrimento in corso lo portava sotto il bordo (rifinitura 3a-r, N1).
  let meta = null, metaQuando = 0;   // dove va a finire lo scorrimento in corso (posizione assoluta) e quando è stato chiesto
  function mostraInsieme(inizio, fondo, vince = 'fondo', {essenziale = fondo, testo = inizio} = {}) {
    requestAnimationFrame(() => {
      if (!inizio.isConnected || !fondo.isConnected) return;
      if (meta !== null && (Math.abs(scrollY - meta) <= 1 || performance.now() - metaQuando > 1500)) meta = null;   // arrivato (o non arriva: la pagina finisce prima)
      const resto = meta === null ? 0 : meta - scrollY;   // quanto lo scorrimento in corso deve ancora fare
      // un messaggio che sta entrando (sale12) è più in basso, per un attimo, di dove resterà: si misura dove resterà
      const spostato = fondo.getAnimations().length ? new DOMMatrix(getComputedStyle(fondo).transform === 'none' ? undefined : getComputedStyle(fondo).transform).m42 : 0;
      const barraEl = $('.barra'), alto = (barraEl ? barraEl.getBoundingClientRect().bottom : 0) + 8;
      const giu = Math.max(0, fondo.getBoundingClientRect().bottom - spostato - resto - (innerHeight - 8));   // quanto scorrere perché il fondo si veda
      const su = inizio.getBoundingClientRect().top - resto - alto;                                            // quanto scorrere perché l'inizio stia sotto la barra (negativo: verso l'alto)
      const giuEssenziale = essenziale.getBoundingClientRect().bottom - resto - (innerHeight - 8);                                 // quanto scorrere perché l'essenziale (il pulsante premuto) si veda (negativo: quanto può scendere sullo schermo)
      const suTesto = testo.getBoundingClientRect().top - resto - (alto - 8);                                                      // quanto scorrere perché il testo stia appena sotto la barra (senza il margine di 8 px)
      const cedi = 4;                                                                                                              // l'ultimo margine che si cede: il pulsante a 4 px dal bordo invece di 8
      const dy = giu <= su ? Math.min(Math.max(0, giu), su)
        : vince !== 'inizio' ? giu
        : giuEssenziale <= su ? su                                   // la bolla intera e il pulsante ci stanno
        : giuEssenziale <= suTesto ? giuEssenziale                   // sale sotto la barra solo il margine della bolla
        : Math.max(suTesto, giuEssenziale - cedi);                   // non basta: il pulsante a 4 px dal bordo, e il testo sale sotto la barra del poco che manca
      if (Math.abs(dy) > 1) {
        const nuova = scrollY + resto + dy;
        scrollTo({top: nuova, behavior: ridotto ? 'instant' : 'smooth'});
        meta = ridotto ? null : nuova; metaQuando = performance.now();
      }
    });
  }
  function fallisci(causa) {
    ferma(false);
    mostraNota(causa);
  }

  // premendo prima che la riunione sia entrata, arriva subito intera: il suono non parte mentre i riquadri entrano ancora
  function scenaSubito() {
    if (!tavolo.classList.contains('visto') && window.Cornice) window.Cornice.rivela(tavolo);
    nasceBolla(0);
    tavolo.getAnimations({subtree: true}).forEach(x => { const t = x.effect && x.effect.getComputedTiming(); if (t && isFinite(t.endTime)) x.finish(); });
  }
  function suona() {
    if (discorso) { if (discorso.stato === 'suona') pausa(); else if (discorso.stato === 'pausa') riprendi(); else ferma(false); return; }
    clearTimeout(ritorno); togliNota();
    scenaSubito(); mostraInsieme(bolla, comandi, 'inizio', {essenziale: bottone, testo});   // dove lo schermo è basso o la pagina è in fondo, premendo la riunione viene in vista da sé (come nella home, 8c); se col comando non ci sta, vince la bolla, dove le parole si accendono, ma mai a costo del pulsante: «Pausa» resta in vista, e della bolla sale sotto la barra soltanto ciò che manca (incarico 2-f, L1)
    const parole = dividi().flat();
    parole.forEach(p => p.classList.add('attesa'));
    bolla.classList.remove('detta');
    const fonti = (opus === 'opus' ? [`voce/${FILE}.opus`, `voce/${FILE}.mp3`] : [`voce/${FILE}.mp3`]).map(f => new URL(f, RADICE).href);
    const a = new Audio(); let i = 0;
    const d = discorso = {audio: a, parole, f: null, tp: null, pk: [], prossimo: 0, m: 0, ultimo: null, avviato: false};
    const vivo = () => discorso === d;
    const gestite = new Set();
    // una fonte che non va (formato, file mancante, rete) fa passare alla successiva; l'ultima dà il messaggio.
    // k è il tentativo a cui il segnale appartiene: l'evento «error» e il rifiuto del play() arrivano entrambi, uno solo conta
    const sbagliata = (k = i) => {
      if (!vivo() || k !== i || gestite.has(k)) return;
      gestite.add(k);
      if (d.avviato || a.currentTime > 0.2) fallisci('interrotta');
      else if (i + 1 < fonti.length) { i++; prova(); } else fallisci('caricamento');
    };
    const prova = () => {
      a.src = fonti[i];
      const k = i, g = a.play();
      if (g && g.catch) g.catch(e => {
        if (!vivo() || k !== i || (e && e.name === 'AbortError')) return;
        if (e && e.name === 'NotAllowedError') fallisci('permesso'); else sbagliata(k);
      });
    };
    const lento = () => { clearTimeout(lentoT); lentoT = setTimeout(() => { if (vivo() && d.stato === 'carica') mostraNota('lento'); }, 6000); };
    // il suono è partito (la prima volta) o è ripartito dopo aver aspettato dati
    const parte = () => {
      if (!vivo()) return;
      clearTimeout(lentoT); clearTimeout(attesaT); if (nota && nota.getAttribute('role') === 'status') togliNota();
      if (d.avviato) { if (d.stato === 'carica') { d.ultimo = performance.now(); stato('suona'); giro(); } return; }
      d.avviato = true; d.ultimo = performance.now();
      tempiPronti.then(() => {
        if (!vivo()) return;
        d.f = datiFile(a.duration); d.tp = tempiParole(d.f); d.pk = picchi(d.f);
        if (bordo) bordo.style.opacity = 1; tu.classList.add('parla');
        d.ultimo = performance.now(); stato('suona'); giro();
        annuncia(fmt(T('na.annuncio.parte'), {voce: nomeVoce()}));   // per i lettori di schermo: la voce è partita (se non parte, parla l'avviso dell'errore)
      });
    };
    a.addEventListener('playing', parte);
    a.addEventListener('timeupdate', () => { if (!d.avviato && a.currentTime > 0) parte(); });
    // l'audio aspetta dati: il movimento aspetta con lui (l'orologio non supera l'audio); se l'attesa dura più di un attimo il comando
    // torna a «Carico…» (un'attesa di pochi millisecondi, che i browser segnalano anche suonando bene, non cambia niente), e se tarda la pagina lo dice
    a.addEventListener('waiting', () => {
      if (!vivo() || !d.avviato || d.stato !== 'suona') return;
      clearTimeout(attesaT);
      attesaT = setTimeout(() => { if (vivo() && d.stato === 'suona' && !a.paused && a.readyState < 3) { d.ultimo = null; quieto(); stato('carica'); lento(); } }, 250);
    });
    a.addEventListener('pause', () => { if (vivo() && !a._nostra && !a.ended) pausa(); });
    a.addEventListener('error', () => sbagliata());
    stato('carica'); lento();
    prova();
  }
  // l'orologio del movimento cammina al tempo vero mentre suona e non supera mai l'audio (se aspetta dati, aspetta anche lui)
  function orologio(d) {
    const adesso = performance.now();
    if (d.ultimo !== null && d.stato === 'suona') { d.m += (adesso - d.ultimo) / 1000; if (!d.audio.ended && d.audio.currentTime < d.m) d.m = d.audio.currentTime; }
    d.ultimo = adesso;
    return d.m;
  }
  function giro() {
    const d = discorso;
    const t = performance.now() / 1000;
    if (d && d.f && d.stato === 'suona') {
      const s = orologio(d);
      d.parole.forEach((p, k) => { if (p.classList.contains('attesa') && s >= d.tp[k]) p.classList.remove('attesa'); });
      const e = envA(d.f, s);
      if (alone) alone.style.opacity = Math.min(1, e * 1.1).toFixed(3);
      barre.forEach((b, k) => { b.style.transform = `scaleY(${(BASE[k] * (0.3 + 0.8 * envA(d.f, s - RITARDO[k]))).toFixed(3)})`; });
      while (d.prossimo < d.pk.length && s >= d.pk[d.prossimo]) {
        if (!ridotto && s - d.pk[d.prossimo] < 0.3) onde.push({t, toccati: new Set()});
        d.prossimo++;
      }
      const fine = d.audio.ended && isFinite(d.audio.duration) ? Math.min(d.f.durata_s, d.audio.duration) : d.f.durata_s;
      if (s >= fine - 0.03) ferma(true);
    }
    disegnaOnde(t);
    if ((discorso && discorso.stato === 'suona') || onde.length) requestAnimationFrame(giro);
    else if (geo) geo.ctx.clearRect(0, 0, geo.w, geo.h);
  }
  if (bottone && tavolo) {
    bottone.hidden = false;
    bottone.addEventListener('click', suona);
  }

  // =================================================================================================================
  // CIÒ CHE ACCADE QUANDO UN TRATTO ARRIVA SULLO SCHERMO (cornice.js manda «rivelato»)
  // =================================================================================================================
  // la bolla nasce dalla coda quando i riquadri sono entrati; se si preme prima, subito
  function nasceBolla(ritardo = 520) {
    if (!bolla || bolla.classList.contains('nata')) return;
    bolla.classList.add('nata');
    if (!ridotto) bolla.animate([{transform: `scale(${tok('--bolla-nasce-scala')})`, opacity: 0}, {transform: 'none', opacity: 1}],
      {duration: tempo('--durata-bolla-nasce'), delay: ritardo, easing: ENTRA, fill: 'backwards'});
  }
  document.addEventListener('rivelato', e => {
    const el = e.target;
    if (el.classList.contains('strada-ferma')) dopo(ridotto ? 0 : 250, () => animaStrada(el));
    if (el === tavolo) nasceBolla();
  });
  // senza osservatore o se il tratto è già stato rivelato prima di questo script
  $$('.entra.visto').forEach(el => el.dispatchEvent(new CustomEvent('rivelato', {bubbles: true})));

  // =================================================================================================================
  // LA SCHEDA IN SECONDO PIANO
  // =================================================================================================================
  // Si ferma tutto insieme: l'orologio della scena (ciò che aspetta il suo tempo), le animazioni in corso e l'ascolto (se suona va in
  // pausa e si può riprendere; se carica si annulla). Al ritorno si riparte da dove si era, senza salti e senza ripetizioni.
  let sospese = [];
  function nascondi() {
    if (nascostoDa === null) nascostoDa = performance.now();
    sospese = document.getAnimations().filter(a => a.timeline === document.timeline && a.playState === 'running'); sospese.forEach(a => a.pause());
    if (discorso) { if (discorso.stato === 'suona') pausa(); else if (discorso.stato === 'carica') ferma(false); }
  }
  function mostra() {
    if (nascostoDa !== null) { fermoTot += performance.now() - nascostoDa; nascostoDa = null; }
    sospese.forEach(a => { if (a.playState === 'paused') a.play(); }); sospese = [];
    if (agenda.length && !giraAgenda) giraAgenda = requestAnimationFrame(passoAgenda);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) nascondi(); else mostra(); });
  // lasciando la pagina (un collegamento, «indietro») il suono si ferma: tornando, la frase è com'era
  addEventListener('pagehide', () => { if (discorso) ferma(false); });
  if (document.hidden) nascondi();

  window.__pagina = true;
})();
