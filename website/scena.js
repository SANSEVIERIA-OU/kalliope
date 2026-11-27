/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Kalliope · la home intera nella direzione 2 «Alla pari, in riunione».
// La pagina è una riunione che continua fino al piede. La voce vera può suonare in due «palchi» (la riunione del primo
// schermo e il filo delle tue frasi più sotto), uno alla volta, con lo stesso motore: le parole si accendono sui tempi
// di voce/tempi.json, le onde partono da chi parla, chi ascolta si gira, la luce della stanza segue env.
// All'arrivo gira un orologio virtuale (performance.now) senza suono; il suono parte solo con un gesto.
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const telefono = matchMedia('(max-width: 760px)');
  const ENTRA = 'cubic-bezier(0.19,1,0.22,1)';
  // I file della voce (voce/…) stanno accanto allo script, non accanto alla pagina: la stessa pagina esiste in più cartelle, una per lingua.
  const RADICE = new URL('./', document.currentScript && document.currentScript.src ? document.currentScript.src : location.href);
  // I testi che lo script mostra o fa leggere non stanno qui: stanno nella pagina, tradotti con lei (testi.js, docs/translating.md).
  const {testo: T, formato: fmt} = window.Testi;
  // Il verso della scrittura: 1 da sinistra a destra, −1 da destra a sinistra (design-system/token.css, --verso). Ciò che la scena fa
  // in orizzontale e ha un verso (elenco in design/lavoro/1-lingue-sito/versi.md) lo moltiplica: il volo della bolla, che parte
  // dall'angolo d'inizio del campo, e il testo che scorre nel campo mentre si scrive.
  const verso = window.Testi.verso;
  // il nome di una voce è quello scritto nei suoi pulsanti; il testo «Pronta…» della finestra, quello che la pagina mostra all'arrivo
  const nomeVoce = v => $(`.voce[data-voce="${v}"]`).textContent.trim();
  // lo stato «Pronta» che la pagina mostra all'arrivo: il nome e ciò che spiega (la riga di stato della finestra disegnata, window.Finestra)
  const TESTO_PRONTA = {nome: $('.sotto .f-titolo').textContent, detto: $('.sotto .f-detto').textContent};

  // ---------- il tempo della scena ----------
  // Tutto ciò che la pagina fa da sola (arrivo, strada, primo avvio, onde) segue questo orologio, che si ferma quando la
  // scheda va in secondo piano e riparte da dove era: nessuna animazione resta a metà o salta in avanti al ritorno.
  let fermoTot = 0, nascostoDa = document.hidden ? performance.now() : null;
  const tScena = () => (nascostoDa === null ? performance.now() : nascostoDa) - fermoTot;
  let T0 = tScena();
  // le azioni a tempo (al posto di setTimeout) camminano sullo stesso orologio, nel ciclo dei fotogrammi
  const agenda = [];
  function dopo(ms, f) { const e = {t: tScena() + ms, f}; agenda.push(e); avvia(); return e; }
  const annulla = lista => { lista.forEach(e => { e.annullato = true; }); lista.length = 0; };
  function giraAgenda() {
    const t = tScena();
    for (let i = 0; i < agenda.length;) {
      const e = agenda[i];
      if (e.annullato) agenda.splice(i, 1);
      else if (e.t <= t) { agenda.splice(i, 1); e.f(); } else i++;
    }
  }
  // un annuncio per i lettori di schermo, solo per ciò che non si vede da sé (l'ascolto nel filo)
  const annuncio = $('#annuncio');
  function annuncia(testo) { annuncio.textContent = ''; setTimeout(() => { annuncio.textContent = testo; }, 60); }

  // ---------- le tre frasi, carattere per carattere come l'audio ----------
  // Il testo di ogni frase è quello della pagina, il suo messaggio tradotto: la bolla del filo, `.messaggio[data-frase] .bolla-testo`.
  // Ciò che le parole da sole non dicono lo dicono i testi dello script (<template id="testi-scena">), scritti nella lingua della pagina:
  //   · class «unita» nel testo = un'unità che non va a capo nel mezzo («alle 15:30», «31 dicembre»): stesse parole e stessi spazi,
  //     cambia solo dove la riga può spezzarsi;
  //   · frase.N.gruppo.G e frase.N.detto.G = un gruppo di parole che cambiano in un colpo quando la voce lo raggiunge («1.250 € +»
  //     diventa «milleduecentocinquanta euro più»): le parole scritte e le parole dette, una per una;
  //   · frase.N.chi.NOME = la parola che è il nome di una persona: quando la voce la dice, quella persona si gira;
  //   · data-lunghezze sul <li> = quanto dura a voce una parola scritta (per i tempi della registrazione italiana, dove la forma detta
  //     non è verificata: «14/3=17 15:30?=18»).
  // Le parole si dividono agli spazi (dove non ce ne sono, come in cinese, con Intl.Segmenter); le parti finiscono dove finisce una frase.
  const w = (s, x = {}) => ({s, ...x});
  const FINE_FRASE = /[.!?…。！？؟۔।][»”’)\]"']*$/;
  const SENZA_SPAZI = /^(zh|ja|ko|th|lo|km|my)(-|$)/i;
  // Ogni parola sa se nel testo era preceduta da uno spazio (sp): rimontando la frase, fra due parole va uno spazio solo se c'era
  // (in cinese le parole si toccano; in italiano c'è sempre). finale: il testo finisce con uno spazio.
  function pezziDi(testo) {
    if (SENZA_SPAZI.test(document.documentElement.lang) && window.Intl && Intl.Segmenter) {
      const out = [];
      let spazio = false;
      for (const {segment, isWordLike} of new Intl.Segmenter(document.documentElement.lang, {granularity: 'word'}).segment(testo)) {
        if (!segment.trim()) { spazio = true; continue; }
        if (isWordLike || !out.length) out.push({s: segment, sp: spazio}); else out[out.length - 1].s += (spazio ? ' ' : '') + segment;   // «1,250 € +» resta con i suoi spazi
        spazio = false;
      }
      return {pezzi: out, finale: /\s$/.test(testo)};
    }
    return {pezzi: testo.split(/\s+/).filter(Boolean).map((s, i) => ({s, sp: i > 0 || /^\s/.test(testo)})), finale: /\s$/.test(testo)};
  }
  const paroleDi = testo => pezziDi(testo).pezzi.map(p => p.s);
  function leggiFrase(n) {
    const li = $(`.messaggio[data-frase="${n}"]`), radice = $('.bolla-testo', li), tok = [];
    const lunghezze = Object.fromEntries((li.dataset.lunghezze || '').split(/\s+/).filter(Boolean).map(x => x.split('=')).map(([parola, len]) => [parola, +len]));
    let unita = 0, spazio = false;
    const visita = (nodo, u) => {
      for (const c of nodo.childNodes) {
        if (c.nodeType === 3) {
          const {pezzi, finale} = pezziDi(c.textContent);
          pezzi.forEach(({s, sp}, k) => tok.push(w(s, {sp: k ? sp : sp || spazio, ...(u ? {u} : {}), ...(lunghezze[s] ? {len: lunghezze[s]} : {})})));
          spazio = pezzi.length ? finale : spazio || /\s/.test(c.textContent);
        } else if (c.nodeType === 1) visita(c, c.classList.contains('unita') ? `u${++unita}` : u);
      }
    };
    visita(radice, null);
    const trova = scritte => { for (let i = 0; i + scritte.length <= tok.length; i++) if (scritte.every((s, k) => tok[i + k].s === s)) return i; return -1; };
    for (const chiave of window.Testi.chiavi(`frase.${n}.gruppo.`)) {
      const g = +chiave.split('.').pop(), scritte = paroleDi(T(chiave)), dette = pezziDi(T(`frase.${n}.detto.${g}`)).pezzi, i = trova(scritte);
      // se le parole scritte non ci sono, o non tornano con quelle dette, il gruppo resta com'è scritto
      if (i >= 0 && scritte.length === dette.length) dette.forEach((d, k) => Object.assign(tok[i + k], {g, d: d.s, dsp: d.sp}));
    }
    for (const chiave of window.Testi.chiavi(`frase.${n}.chi.`)) { const i = trova([T(chiave)]); if (i >= 0) tok[i].chi = chiave.split('.').pop(); }
    const parti = [[]];
    tok.forEach((t, i) => { parti.at(-1).push(t); if (FINE_FRASE.test(t.s) && i < tok.length - 1) parti.push([]); });
    return {testo: radice.textContent.replace(/\s+/g, ' ').trim(), annuisce: li.dataset.annuisce, parti};
  }
  const FRASI = {1: leggiFrase(1), 2: leggiFrase(2), 3: leggiFrase(3)};

  // ---------- i tempi ----------
  let TEMPI = window.TEMPI_RISERVA || null;
  const pronti = fetch(new URL('voce/tempi.json', RADICE)).then(r => r.ok ? r.json() : Promise.reject()).then(j => { TEMPI = j; }).catch(() => {});
  // se non c'è nessun file dei tempi (né tempi.json né la riserva) si ricavano dalla durata dell'audio: le parole si
  // accendono in proporzione, senza onde e senza intensità (vale per la frase che sta suonando)
  function assicuraTempi(file, durata) {
    TEMPI = TEMPI || {passo_ms: 60, file: {}};
    if (TEMPI.file[file]) return;
    const n = FRASI[+file.split('-')[1]].parti.length;
    const frasi = n === 1 ? [{da: 0.25, a: Math.max(0.5, durata - 0.2)}] : [{da: 0.2, a: durata * 0.25}, {da: durata * 0.3, a: Math.max(0.5, durata - 0.2)}];
    TEMPI.file[file] = {durata_s: durata, frasi, env: new Array(Math.ceil(durata / 0.06) + 2).fill(0.35)};
  }
  function envA(file, t) {
    const f = TEMPI.file[file], passo = TEMPI.passo_ms / 1000, i = t / passo, a = Math.floor(i);
    if (a < 0 || a >= f.env.length - 1) return 0;
    return f.env[a] + (f.env[a + 1] - f.env[a]) * (i - a);
  }
  function tempiParole(n, file) {
    const f = TEMPI.file[file], passo = TEMPI.passo_ms / 1000, out = [];
    FRASI[n].parti.forEach((parole, k) => {
      const {da, a} = f.frasi[k] || f.frasi.at(-1);
      const lun = parole.map(p => (p.len || (p.d || p.s).length) + 1), tot = lun.reduce((x, y) => x + y, 0);
      let prima = 0;
      parole.forEach((p, j) => {
        let t = da + (a - da) * (prima / tot);
        if (j > 0) {
          let meglio = null;
          for (let i = Math.max(1, Math.floor((t - 0.12) / passo)); i <= Math.min(f.env.length - 2, Math.ceil((t + 0.12) / passo)); i++) {
            const v = f.env[i];
            if (v < 0.06 && v <= f.env[i - 1] && v <= f.env[i + 1] && Math.abs(i * passo - t) <= 0.12 &&
              (meglio === null || Math.abs(i * passo - t) < Math.abs(meglio - t))) meglio = i * passo;
          }
          if (meglio !== null) t = meglio;
        }
        out.push(t); prima += lun[j];
      });
    });
    return out;
  }
  function picchi(file) {
    const f = TEMPI.file[file], passo = TEMPI.passo_ms / 1000, out = [];
    for (let i = 1; i < f.env.length - 1; i++) {
      const t = i * passo;
      if (f.env[i] > 0.6 && f.env[i] >= f.env[i - 1] && f.env[i] >= f.env[i + 1] && (!out.length || t - out.at(-1) >= 0.24)) out.push(t);
    }
    return out;
  }
  const mmss = window.Testi.minuti;

  // ---------- una frase dentro una bolla ----------
  // i pezzi di una frase, uno dopo l'altro; quelli della stessa unità (u) stanno insieme in un contenitore che non va a capo
  function montaPezzi(el, pezzi) {
    const spazio = p => (p.sp === false ? '' : ' ');
    for (let k = 0, primo = true; k < pezzi.length;) {
      if (!primo) el.append(spazio(pezzi[k]));
      primo = false;
      const u = pezzi[k].u;
      if (u && k + 1 < pezzi.length && pezzi[k + 1].u === u) {
        const unita = document.createElement('span'); unita.className = 'unita';
        unita.append(pezzi[k++].nodo);
        while (k < pezzi.length && pezzi[k].u === u) { unita.append(spazio(pezzi[k]), pezzi[k].nodo); k++; }
        el.append(unita);
      } else el.append(pezzi[k++].nodo);
    }
  }
  // la frase com'è scritta, intera e piena (senza parole accese né forma detta), con le sue unità
  function testoScritto(el, n) {
    el.textContent = '';
    montaPezzi(el, FRASI[n].parti.flat().map(p => ({nodo: document.createTextNode(p.s), u: p.u, sp: p.sp})));
  }
  function rendiFrase(testoEl, n, accesa) {
    testoEl.textContent = '';
    const parole = [], gruppi = [], tok = FRASI[n].parti.flat(), pezzi = [];
    let i = 0;
    while (i < tok.length) {
      const p = tok[i];
      if (p.g) {
        const g = document.createElement('span'), a = document.createElement('span'), b = document.createElement('span');
        g.className = 'gruppo'; a.className = 'scritto p' + (accesa ? '' : ' attesa'); b.className = 'detto';
        const membri = [];
        while (i < tok.length && tok[i].g === p.g) membri.push(tok[i++]);
        a.textContent = membri.map((m, k) => (k && m.sp !== false ? ' ' : '') + m.s).join('');
        membri.forEach((m, k) => {
          if (k && m.dsp !== false) b.append(' ');
          const s = document.createElement('span'); s.className = 'p' + (accesa ? '' : ' attesa'); s.textContent = m.d;
          b.append(s); parole.push(s); gruppi.push(g);
        });
        g.append(a, b); pezzi.push({nodo: g, u: p.u, sp: p.sp});
        if (accesa) g.classList.add('fatto');
      } else {
        const s = document.createElement('span'); s.className = 'p' + (accesa ? '' : ' attesa'); s.textContent = p.s;
        if (p.chi) s.dataset.chi = p.chi;
        pezzi.push({nodo: s, u: p.u, sp: p.sp}); parole.push(s); gruppi.push(null); i++;
      }
    }
    montaPezzi(testoEl, pezzi);
    return {parole, gruppi};
  }
  // il gruppo cambia in un colpo; la bolla cresce (420 ms) con il testo già al suo posto
  function cambiaGruppo(g, corpo) {
    const h0 = corpo.offsetHeight;
    g.classList.add('fatto');
    const h1 = corpo.offsetHeight;
    if (h0 !== h1 && !ridotto) corpo.animate([{height: h0 + 'px'}, {height: h1 + 'px'}], {duration: 420, easing: ENTRA});
  }
  function annuisci(el) {
    if (!el || ridotto) return;
    el.classList.remove('annuisce'); void el.offsetWidth; el.classList.add('annuisce');
    setTimeout(() => el.classList.remove('annuisce'), 900);
  }
  function accendi(el) {
    const l = $('.lume', el); if (!l) return;
    l.getAnimations().forEach(a => a.cancel());
    l.animate([{opacity: 1}, {opacity: 1, offset: 0.57}, {opacity: 0}], {duration: 350, easing: 'linear'});
  }

  // =================================================================================================================
  // I PALCHI
  // =================================================================================================================
  // ---------- il primo schermo: la riunione ----------
  const eroe = (() => {
    const chiamata = $('.chiamata'), tu = $('.riquadro.tu'), alone = $('.alone', tu), bordo = $('.bordo', tu);
    const barre = $$('.barre i', tu), BASE = [0.34, 0.7, 1, 0.63, 0.41], RITARDO = [0.08, 0.04, 0, 0.04, 0.08];
    const persone = {paola: $('.chiamata .paola'), luca: $('.chiamata .luca'), anna: $('.chiamata .anna')};
    const posto = $('.posto-bolla'), bolla = $('.palco .bolla'), corpo = $('.bolla-corpo', bolla), testo = $('.bolla-testo', bolla);
    const finestra = $('.sotto .finestra'), fStato = $('.f-stato', finestra), campo = $('.f-campo', finestra), ferma = $('.f-ferma', finestra);
    const luceVoce = $('.luce-voce');
    const PRONTA = TESTO_PRONTA;
    function statoFinestra(parlando) {
      if (parlando) window.Finestra.stato(fStato, T('finestra.parla.nome'), T('finestra.parla.detto')); else window.Finestra.stato(fStato, PRONTA.nome, PRONTA.detto);
      fStato.classList.toggle('parla', parlando);
      ferma.disabled = !parlando;
    }
    return {
      nome: 'eroe', persone, tela: $('.palco .onde'), onde: [], geo: null, ritorno: 0, finestra, campo, fStato, ferma, bolla, testo,
      misura() {
        const rc = chiamata.getBoundingClientRect();
        const rel = el => { const r = el.getBoundingClientRect(); return {x0: r.left - rc.left, y0: r.top - rc.top, x1: r.right - rc.left, y1: r.bottom - rc.top, el}; };
        const t = rel(tu), o = {x: (t.x0 + t.x1) / 2, y: (t.y0 + t.y1) / 2};
        return {rc, o, escludi: t, r0: Math.min(t.x1 - t.x0, t.y1 - t.y0) / 2, bersagli: Object.values(persone).map(rel)};
      },
      corpo: () => corpo,
      // la voce non ha parlato (errore): la bolla torna alla frase scritta, piena, senza parole accese né forma detta
      scritta(n) { testoScritto(testo, n); bolla.classList.remove('detta'); },
      // la bolla cresce verso l'alto dal suo posto: a misure strette la frase più lunga andrebbe sopra la didascalia che sta sopra
      // (a 320 e 334 px la bolla della frase 2 copriva «Ricostruzione · la voce è la registrazione vera»). Il posto prende l'altezza
      // della bolla più alta fra le tre frasi a questa larghezza, così non cambia quando cambia la frase
      // Una sporgenza fino a 4 px non conta (a 1440 px la frase 2 sporge di 2 px nella direzione scelta, e il primo schermo scelto non si
      // tocca): si riserva solo ciò che oltre quella sporgenza finirebbe sopra la didascalia o il bordo
      riserva() {
        // 8d: con «riduci movimento» ogni transizione dura 1 ms ma parte dal valore di prima: togliere la variabile e leggere subito l'altezza
        // dava ancora il valore vecchio, e in una ricarica su venti la riserva spariva (la bolla tornava sopra la didascalia a 320 px).
        // Senza transizione la lettura è quella vera.
        posto.style.transition = 'none';
        posto.style.removeProperty('--bolla-max');
        const base = posto.offsetHeight;
        const prova = bolla.cloneNode(true); prova.className = 'bolla';
        prova.style.cssText = 'visibility: hidden; pointer-events: none; animation: none; transition: none; transform: none;';
        posto.append(prova);
        const t = $('.bolla-testo', prova); let max = 0;
        for (const n of [1, 2, 3]) { testoScritto(t, n); max = Math.max(max, prova.offsetHeight); }
        prova.remove();
        const serve = Math.ceil(max + (parseFloat(getComputedStyle(bolla).bottom) || 0));
        if (serve - base > 4) posto.style.setProperty('--bolla-max', `${serve}px`);
        void posto.offsetHeight; posto.style.transition = '';
      },
      // all'arrivo (Invio nel campo, senza suono) la frase vecchia se ne va in alto e la nuova sale dal campo di Kalliope fino
      // alla bolla: è il primo schermo scelto e non cambia. All'ascolto (secondo giro, punto 1) la frase cambia dentro la stessa
      // bolla, al suo posto sopra la riunione: le parole vecchie sfumano, la bolla prende la misura nuova, le nuove compaiono.
      // Così nulla vola sopra un volto o un'etichetta e in scena c'è sempre una bolla sola.
      prepara(n, conVoce = false) {
        if (conVoce) {
          const prima = testo.textContent && !ridotto, w0 = corpo.offsetWidth, h0 = corpo.offsetHeight;
          let vecchio = null;
          if (prima) {
            vecchio = testo.cloneNode(true); vecchio.classList.add('bolla-vecchia');
            vecchio.style.width = `${testo.offsetWidth}px`; corpo.append(vecchio);
          }
          bolla.classList.remove('detta');
          const r = rendiFrase(testo, n, false);
          if (prima) {
            const w1 = corpo.offsetWidth, h1 = corpo.offsetHeight;
            // prima sfumano le parole vecchie, poi la bolla cambia misura: nessuna riga vecchia resta tagliata dal bordo che si stringe
            vecchio.animate([{opacity: 1}, {opacity: 0}], {duration: 110, easing: 'ease-in', fill: 'forwards'}).finished.then(() => vecchio.remove());
            corpo.animate([{width: `${w0}px`, height: `${h0}px`}, {width: `${w1}px`, height: `${h1}px`}], {duration: 420, delay: 70, easing: ENTRA, fill: 'backwards'});
            testo.animate([{opacity: 0}, {opacity: 0, offset: 0.4}, {opacity: 1}], {duration: 480, easing: 'ease-out'});
          }
          return r;
        }
        if (testo.textContent && !ridotto) {
          const fantasma = bolla.cloneNode(true);
          fantasma.style.transition = 'none'; posto.append(fantasma);
          fantasma.animate([{opacity: getComputedStyle(bolla).opacity, transform: 'none'}, {opacity: 0, transform: 'translateY(-22px) scale(0.97)'}],
            {duration: 200, easing: 'ease-in', fill: 'forwards'}).finished.then(() => fantasma.remove());
        }
        bolla.classList.remove('detta');
        const r = rendiFrase(testo, n, false);
        if (!ridotto) {
          const rcm = campo.getBoundingClientRect(), rb = bolla.getBoundingClientRect();
          const s = Math.min(1, Math.max(0.45, rcm.width / rb.width));
          // la bolla cresce dal suo angolo d'inizio (in alto a sinistra, o a destra da destra a sinistra), dove nel campo comincia la frase
          const dx = verso() < 0 ? rcm.right - rb.right : rcm.left - rb.left, dy = rcm.top + rcm.height / 2 - (rb.top + rb.height * s / 2);
          bolla.animate([
            {transform: `translate(${dx}px, ${dy}px) scale(${s * 0.85})`, opacity: 0},
            {transform: `translate(${dx}px, ${dy}px) scale(${s * 0.85})`, opacity: 0, offset: 0.2},
            {transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 1, offset: 0.3},
            {transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${s + (1 - s) * 0.6})`, opacity: 1, offset: 0.58},
            {transform: 'none', opacity: 1}], {duration: 820, easing: 'cubic-bezier(0.3,0.7,0.2,1)'});
        }
        return r;
      },
      inizia() { statoFinestra(true); bordo.style.opacity = 1; tu.classList.add('parla'); luceVoce.getAnimations().forEach(a => a.cancel()); },
      env(e, t, file) {
        alone.style.opacity = Math.min(1, e * 1.1).toFixed(3);
        luceVoce.style.opacity = (0.25 + 0.75 * e).toFixed(3);
        barre.forEach((b, k) => { b.style.transform = `scaleY(${(BASE[k] * (0.3 + 0.8 * envA(file, t - RITARDO[k]))).toFixed(3)})`; });
      },
      finisce(n, posa) {
        statoFinestra(false); bordo.style.opacity = 0; alone.style.opacity = 0; tu.classList.remove('parla');
        barre.forEach(b => { b.style.transform = ''; });
        spegni(luceVoce);
        if (posa) bolla.classList.add('detta');
      },
    };
  })();

  // ---------- una riunione (riquadro «Tu» e chi ascolta): le onde partono da «Tu» e restano dentro la sua cornice ----------
  // Serve al filo e alla chiusura (correzioni P3, P4, P12): la stessa riunione del primo schermo, in un'altra scala.
  function riunione(box, luce) {
    const tu = $('.riquadro.tu', box), alone = $('.alone', tu), bordo = $('.bordo', tu);
    const barre = $$('.barre i', tu), BASE = [0.34, 0.7, 1, 0.63, 0.41], RITARDO = [0.08, 0.04, 0, 0.04, 0.08];
    const persone = {paola: $('.paola', box), luca: $('.luca', box), anna: $('.anna', box)};
    const tela = $('canvas.onde', box);
    return {
      persone, tela,
      misura() {
        const rc = tela.getBoundingClientRect();
        const rel = el => { const r = el.getBoundingClientRect(); return {x0: r.left - rc.left, y0: r.top - rc.top, x1: r.right - rc.left, y1: r.bottom - rc.top, el}; };
        const t = rel(tu), o = {x: (t.x0 + t.x1) / 2, y: (t.y0 + t.y1) / 2};
        return {rc, o, escludi: t, r0: Math.min(t.x1 - t.x0, t.y1 - t.y0) / 2, bersagli: Object.values(persone).map(rel)};
      },
      accendi() { if (bordo) bordo.style.opacity = 1; tu.classList.add('parla'); if (luce) luce.getAnimations().forEach(a => a.cancel()); },
      env(e, t, file) {
        if (alone) alone.style.opacity = Math.min(1, e * 1.1).toFixed(3);
        if (luce) luce.style.opacity = (0.3 + 0.7 * e).toFixed(3);
        barre.forEach((b, k) => { b.style.transform = `scaleY(${(BASE[k] * (0.3 + 0.8 * envA(file, t - RITARDO[k]))).toFixed(3)})`; });
      },
      spegni() {
        if (bordo) bordo.style.opacity = 0; if (alone) alone.style.opacity = 0; tu.classList.remove('parla');
        barre.forEach(b => { b.style.transform = ''; });
        if (luce) spegni(luce);
      },
    };
  }

  // ---------- più sotto: il filo delle tue frasi; la riunione che le sente sta accanto ----------
  const filo = (() => {
    const r = riunione($('.riunione-filo'), $('.luce-filo'));
    const li = n => $(`.messaggio[data-frase="${n}"]`);
    return {
      nome: 'filo', persone: r.persone, tela: r.tela, onde: [], geo: null, ritorno: 0,
      misura: r.misura,
      corpo: n => $('.bolla-corpo', li(n)),
      scritta(n) { testoScritto($('.bolla-testo', li(n)), n); },
      prepara(n) {
        this.geo = null;
        $$('.messaggio').forEach(m => m.classList.toggle('in-voce', m === li(n)));
        return rendiFrase($('.bolla-testo', li(n)), n, false);
      },
      inizia() { r.accendi(); },
      env: r.env,
      finisce(n, posa) {
        li(n).classList.remove('in-voce');
        r.spegni();
        if (!posa) rendiFrase($('.bolla-testo', li(n)), n, true);
      },
    };
  })();

  // ---------- la chiusura: la riunione grande; arrivando, «Tu» saluta (senza suono) e gli altri si girano ----------
  const chiusa = (() => {
    const box = $('.tavolo'), r = riunione($('.tavolo-cornice'), $('.luce-chiusa'));
    const bolla = $('.bolla-chiusa', box), corpo = $('.bolla-corpo', bolla), testo = $('.bolla-testo', bolla);
    return {
      nome: 'chiusa', persone: r.persone, tela: r.tela, onde: [], geo: null, ritorno: 0,
      misura: r.misura,
      corpo: () => corpo,
      scritta(n) { testoScritto(testo, n); },
      prepara(n) {
        this.geo = null;
        const out = rendiFrase(testo, n, false);
        bolla.classList.add('nata');
        if (!ridotto) bolla.animate([{transform: 'scale(0.6)', opacity: 0}, {transform: 'none', opacity: 1}],
          {duration: 520, easing: ENTRA, fill: 'backwards'});
        return out;
      },
      inizia() { r.accendi(); },
      env: r.env,
      finisce() { r.spegni(); },
    };
  })();
  function spegni(el) {
    const v = parseFloat(el.style.opacity) || 0;
    el.style.opacity = 0;
    if (v && !ridotto) el.animate([{opacity: v}, {opacity: 0}], {duration: 700, easing: 'ease-out'});
  }

  // ---------- le onde: da chi parla fino all'ultimo che ascolta, 900 ms lineari ----------
  // I colori si leggono una volta: il canvas segue il sistema senza interrogare gli stili a ogni fotogramma.
  const stileOnde = getComputedStyle(document.documentElement);
  const coloreOnde = stileOnde.getPropertyValue('--voce').trim();
  const aloneOnde = stileOnde.getPropertyValue('--alone-tu').trim();
  function preparaTela(p) {
    const g = p.misura(), dpr = Math.min(2, devicePixelRatio || 1), w = g.rc.width, h = g.rc.height;
    p.tela.width = Math.round(w * dpr); p.tela.height = Math.round(h * dpr);
    const ctx = p.tela.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.bersagli.forEach(b => { b.d = Math.hypot(Math.max(b.x0 - g.o.x, 0, g.o.x - b.x1), Math.max(b.y0 - g.o.y, 0, g.o.y - b.y1)); });
    g.r1 = Math.max(...g.bersagli.map(b => Math.hypot(Math.max(Math.abs(b.x0 - g.o.x), Math.abs(b.x1 - g.o.x)), Math.max(Math.abs(b.y0 - g.o.y), Math.abs(b.y1 - g.o.y)))));
    p.geo = {...g, w, h, ctx};
  }
  addEventListener('resize', () => { eroe.geo = null; filo.geo = null; chiusa.geo = null; if (typeof misuraBolla === 'function') misuraBolla(); });
  // la prima misura a pagina caricata e a caratteri arrivati: forzare il layout mentre la pagina si legge faceva ritrovare il punto
  // sbagliato dopo una ricarica a metà pagina (il browser rimette lo scorrimento al primo layout possibile)
  // le occasioni (caricamento, caratteri arrivati, ogni «loadingdone», ridimensionamento) arrivano a pochi millisecondi una dall'altra: una misura sola per fotogramma
  let idMisura = 0; const misuraBolla = () => { cancelAnimationFrame(idMisura); idMisura = requestAnimationFrame(() => eroe.riserva()); };
  if (document.readyState === 'complete') misuraBolla(); else addEventListener('load', misuraBolla, {once: true});
  // ogni volta che finiscono di caricarsi dei caratteri (anche dopo il primo «ready»: un peso chiesto più tardi allarga le righe): a 320 px,
  // con la macchina sotto carico, una misura presa prima dell'ultimo carattere lasciava la bolla sopra la didascalia
  if (document.fonts) { document.fonts.ready.then(() => { if (document.readyState === 'complete') misuraBolla(); }); document.fonts.addEventListener('loadingdone', () => { if (document.readyState === 'complete') misuraBolla(); }); }
  function disegnaOnde(p, t) {
    if (!p.onde.length && !p.sporca) return;
    if (!p.geo) preparaTela(p);
    const {ctx, w, h, o} = p.geo;
    ctx.clearRect(0, 0, w, h);
    p.onde = p.onde.filter(x => t - x.t < 1.0);
    p.sporca = p.onde.length > 0;
    if (!p.onde.length) return;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, w, h);
    if (p.geo.escludi) { const e = p.geo.escludi; ctx.rect(e.x0 - 1, e.y0 - 1, e.x1 - e.x0 + 2, e.y1 - e.y0 + 2); ctx.clip('evenodd'); }
    else if (p.geo.destra) { ctx.beginPath(); ctx.rect(o.x + 2, 0, w, h); ctx.clip(); }
    ctx.shadowColor = aloneOnde; ctx.shadowBlur = 12; ctx.lineWidth = 3.5;
    ctx.strokeStyle = coloreOnde;
    for (const x of p.onde) {
      const q = Math.min(1, Math.max(0, (t - x.t) / 0.9)), r = p.geo.r0 + (p.geo.r1 - p.geo.r0) * q;
      ctx.globalAlpha = Number((0.62 * (q < 0.8 ? 1 : (1 - q) / 0.2)).toFixed(3));
      ctx.beginPath(); ctx.arc(o.x, o.y, r, 0, Math.PI * 2); ctx.stroke();
      p.geo.bersagli.forEach((b, i) => { if (!x.toccati.has(i) && r >= b.d) { x.toccati.add(i); accendi(b.el); b.el.classList.add('guarda'); } });
    }
    ctx.restore();
  }

  // =================================================================================================================
  // LA VOCE: un discorso alla volta, con il suo orologio (secondi dentro il file audio)
  // =================================================================================================================
  // Il discorso ha uno stato: carica (aspetta i dati), suona, pausa. Ogni cosa che può andare storta ha un messaggio
  // visibile vicino al comando; il testo della frase resta leggibile; si può riprovare o scaricare il file.
  let discorso = null, voce = 'giulia';
  const finite = new Set();   // frasi sentite fino in fondo (qualunque voce): il comando dice «Riascolta»
  function calcola(d) {
    d.tParole = tempiParole(d.n, d.file); d.picchi = picchi(d.file); d.fine = TEMPI.file[d.file].durata_s;
  }
  // La voce della pagina si dice a chi la segue (il segno della barra, design-system/marchio/marchio.js) con un evento sul documento: quanta frase è detta, come finisce.
  const voceDice = (stato, frazione) => document.dispatchEvent(new CustomEvent('kalliope:voce', {detail: {stato, frazione}}));
  function parla({palco, n, file, orologio, audio = null}) {
    ferma(false);
    clearTimeout(palco.ritorno);
    const {parole, gruppi} = palco.prepara(n, !!audio);
    discorso = {palco, n, file, orologio, audio, parole, gruppi, corpo: palco.corpo(n), tParole: null, picchi: [], prossimo: 0, fine: Infinity,
      stato: audio ? 'carica' : 'suona'};
    if (TEMPI && TEMPI.file[file]) calcola(discorso);
    if (!audio) palco.inizia(n);   // con l'audio, la finestra dice «Sto parlando…» solo quando il suono parte davvero
    aggiornaBottoni();
    avvia();
  }
  // fermare l'audio senza che il suo evento «pause» sembri una pausa chiesta da fuori (tasti multimediali, cuffie)
  function fermaAudio(a) { a._nostra = true; a.pause(); }
  function ferma(posa = true, fine = false) {
    if (!discorso) return;
    const d = discorso; discorso = null;
    if (d.audio) fermaAudio(d.audio);
    if (fine && d.audio) finite.add(d.n);   // «sentita fino in fondo» vale solo per il suono vero, non per l'arrivo muto
    clearTimeout(lentoT);
    d.gruppi.forEach(g => g && g.classList.add('fatto'));
    d.parole.forEach(p => p.classList.remove('attesa'));
    $$('.scritto', d.corpo).forEach(p => p.classList.remove('attesa'));
    d.palco.finisce(d.n, posa);
    voceDice(fine ? 'finita' : 'interrotta');
    if (posa) {
      annuisci(d.palco.persone[FRASI[d.n].annuisce]);
      d.palco.ritorno = setTimeout(() => Object.values(d.palco.persone).forEach(p => p.classList.remove('guarda')), 1700);
    } else Object.values(d.palco.persone).forEach(p => p.classList.remove('guarda'));
    aggiornaBottoni();
  }
  function passoDiscorso() {
    const d = discorso; if (!d || d.stato === 'pausa') return;
    if (!d.tParole) {   // i tempi mancavano: arrivano dalla durata dell'audio, appena si conosce
      if (d.audio && isFinite(d.audio.duration)) { assicuraTempi(d.file, d.audio.duration); calcola(d); } else return;
    }
    const t = d.orologio();
    let dette = 0;
    d.parole.forEach((p, i) => {
      if (p.classList.contains('attesa') && t >= d.tParole[i]) {
        const g = d.gruppi[i];
        if (g && !g.classList.contains('fatto')) cambiaGruppo(g, d.corpo);
        p.classList.remove('attesa');
        if (p.dataset.chi) annuisci(d.palco.persone[p.dataset.chi]);
      }
      if (!p.classList.contains('attesa')) dette++;
    });
    voceDice('parla', dette / Math.max(1, d.parole.length));
    d.palco.env(envA(d.file, t), t, d.file);
    while (d.prossimo < d.picchi.length && t >= d.picchi[d.prossimo]) {
      if (!ridotto && t - d.picchi[d.prossimo] < 0.3) { d.palco.onde.push({t: ora(), toccati: new Set()}); d.palco.sporca = true; }
      d.prossimo++;
    }
    // la fine è quella dei tempi; se l'audio è finito prima, la durata vera dell'audio
    const fine = d.audio && d.audio.ended && isFinite(d.audio.duration) ? Math.min(d.fine, d.audio.duration) : d.fine;
    if (t >= fine - 0.03) ferma(true, true);
  }
  function pausa() {
    const d = discorso; if (!d || !d.audio || d.stato === 'pausa') return;
    d.stato = 'pausa'; d.audio._nostra = true; d.audio.pause();
    if (TEMPI && TEMPI.file[d.file]) d.palco.env(0, d.orologio(), d.file);
    aggiornaBottoni(); annuncia(T('annuncio.pausa'));
  }
  function riprendi() {
    const d = discorso; if (!d || d.stato !== 'pausa') return;
    d.stato = 'carica'; d.audio._nostra = false;
    const g = d.audio.play();
    if (g && g.catch) g.catch(e => { if (discorso === d && !(e && e.name === 'AbortError')) fallisci(d.palco, d.n, 'permesso'); });
    aggiornaBottoni(); avvia();
  }

  // ---------- quando va storto: un messaggio vicino al comando, con «Riprova» e il file da scaricare ----------
  const MESSAGGI = causa => T(`errore.${causa}`);   // caricamento, interrotta, permesso, lento
  let nota = null, lentoT = 0;
  function togliNota() {
    clearTimeout(lentoT);
    if (!nota) return;
    // «Riprova» sparisce premendolo: il fuoco torna al comando della frase invece di cadere sulla pagina
    const ritorno = nota.contains(document.activeElement) ? nota._ritorno : null;
    nota.remove(); nota = null; fila.style.minHeight = ''; scheda.classList.remove('con-errore');
    if (ritorno && ritorno.isConnected && ritorno.offsetParent !== null) ritorno.focus({preventScroll: true});
  }
  function mostraNota(palco, n, causa) {
    togliNota();
    const file = `${voce}-${n}`, el = document.createElement('div'), p = document.createElement('p'), az = document.createElement('div');
    el.className = 'errore-ascolto'; el.setAttribute('role', causa === 'lento' ? 'status' : 'alert');
    p.textContent = MESSAGGI(causa);
    az.className = 'errore-azioni';
    const riprova = document.createElement('button'); riprova.type = 'button'; riprova.className = 'riprova'; riprova.textContent = T('errore.riprova');
    riprova.addEventListener('click', () => suona(palco, n));
    const scarica = document.createElement('a'); scarica.className = 'scarica-file'; scarica.href = new URL(`voce/${file}.mp3`, RADICE).href; scarica.setAttribute('download', '');
    scarica.textContent = fmt(T('errore.scarica'), {voce: nomeVoce(voce)});
    az.append(riprova, scarica); el.append(p, az);
    (palco === eroe ? $('.ascolto-dentro') : $(`.messaggio[data-frase="${n}"]`)).append(el);
    nota = el;
    const eraNelleFrasi = palco === eroe && $('.frasi', scheda).contains(document.activeElement);
    // in alto il messaggio prende il posto delle frasi finché c'è (stile.css, `.con-errore`): a 1440×900 e a 390×844 sta tutto
    // dentro lo schermo, accanto alla bolla che torna scritta, senza che la persona scorra
    if (palco === eroe) { scheda.classList.add('con-errore'); if (!aperta) apri(); }
    el._ritorno = palco === eroe ? $(`#ascolto .frase[data-frase="${n}"]`) : $(`.suona-frase[data-frase="${n}"]`);
    if (eraNelleFrasi) riprova.focus({preventScroll: true});   // il comando premuto è sparito con le frasi: il fuoco va a «Riprova»
    // la scheda in alto è sovrapposta al resto: con il messaggio diventa più alta, e il tratto sotto deve scendere (non coprirla)
    if (palco === eroe) fila.style.minHeight = `${scheda.offsetHeight}px`;
    // dove lo schermo è troppo basso perché ci stia (1366×640, telefono in orizzontale) la pagina lo porta in vista da sé
    if (palco === eroe) inVista(el); else inVista(el, false);
  }
  // dove lo schermo è troppo basso perché ci stia (1366×640, 1024×600, il telefono girato) la pagina porta in vista da sé ciò che si è
  // aperto o è comparso. Si misura a scheda aperta: mentre si apre è rimpicciolita e sembrerebbe già in vista
  function inVista(el, dopoApertura = true) {
    const aperta = dopoApertura ? Promise.allSettled(scheda.getAnimations({subtree: true}).map(x => x.finished)) : Promise.resolve();
    aperta.then(() => requestAnimationFrame(() => {
      if (!el.isConnected || el.hidden) return;
      // 8d: il messaggio d'errore della scheda in alto si porta in vista con la stessa regola dell'apertura (la scheda intera dentro lo
      // schermo e, se ci stanno insieme, la bolla sotto la barra): con la sola regola «il messaggio dentro lo schermo» la pagina scorreva di
      // più e la bolla finiva sotto la barra
      if (scheda.contains(el) && scorriInsieme) { scorriInsieme(quantoScorrere(scheda.getBoundingClientRect())); return; }
      const r = el.getBoundingClientRect();
      // al telefono, nel filo, sotto la barra sta agganciata la riunione (`.banda-riunione`): ciò che si porta in vista non deve finirci sotto
      const banda = document.querySelector('.banda-riunione'), alto = Math.max(80, banda && telefono.matches ? banda.getBoundingClientRect().bottom + 8 : 0);
      if (r.bottom > innerHeight - 8 || r.top < alto) {
        // 8d: se il messaggio non sta intero fra la riunione e il bordo (326×326: 190 px contro 140), «nearest» ne allineava l'inizio e «Riprova»
        // restava sotto il bordo. Vincono i comandi: si porta in vista la loro fila, e il messaggio scorre sotto la riunione
        if (r.height > innerHeight - 8 - alto) {
          const ra = (el.querySelector('.errore-azioni') || el).getBoundingClientRect();
          scrollBy({top: ra.bottom - (innerHeight - 8), behavior: ridotto ? 'auto' : 'smooth'});
        } else el.scrollIntoView({block: 'nearest', behavior: ridotto ? 'auto' : 'smooth'});
      }
    }));
  }
  function fallisci(palco, n, causa) {
    if (discorso && discorso.palco === palco) ferma(false);
    if (audio) fermaAudio(audio);
    // correzioni 6b (P6): la voce non ha parlato, e la scena non lo finge: la bolla torna alla frase scritta, senza parole accese
    palco.scritta(n);
    mostraNota(palco, n, causa);
  }

  // il suono parte solo da qui, con un gesto. L'orologio è audio.currentTime, ma non corre più del tempo vero dall'inizio
  // del suono: in un browser normale coincide con l'audio; in un browser senza finestra, dove l'audio può correre più
  // veloce, il movimento resta al tempo vero; se l'audio si ferma o aspetta dati, si ferma anche il movimento.
  const opus = document.createElement('audio').canPlayType('audio/ogg; codecs=opus') ? 'opus' : 'mp3';
  let audio = null, gettone = 0;
  function suona(palco, n, dallaVoce = false) {
    fermaArrivo();
    if (discorso) ferma(false);
    togliNota();
    if (audio) fermaAudio(audio);
    const id = ++gettone, file = `${voce}-${n}`, fonti = (opus === 'opus' ? [`voce/${file}.opus`, `voce/${file}.mp3`] : [`voce/${file}.mp3`]).map(f => new URL(f, RADICE).href);
    const a = audio = new Audio(), gestite = new Set();
    let i = 0, avviato = false, m = 0, ultimo = null;
    const vivo = () => id === gettone && discorso && discorso.audio === a;
    // una fonte che non va (formato, file mancante, rete) fa passare alla successiva; l'ultima dà il messaggio
    // k è il tentativo a cui il segnale appartiene: l'evento «error» e il rifiuto del play() arrivano entrambi, uno solo conta
    const sbagliata = (k = i) => {
      if (!vivo() || k !== i || gestite.has(k)) return;
      gestite.add(k);
      if (avviato || a.currentTime > 0.2) fallisci(palco, n, 'interrotta');
      else if (i + 1 < fonti.length) { i++; prova(); } else fallisci(palco, n, 'caricamento');
    };
    const prova = () => {
      a.src = fonti[i];
      const k = i, g = a.play();
      if (g && g.catch) g.catch(e => {
        if (!vivo() || k !== i || (e && e.name === 'AbortError')) return;
        if (e && e.name === 'NotAllowedError') fallisci(palco, n, 'permesso'); else sbagliata(k);
      });
    };
    // L'orologio del movimento (secondi di voce già andati) cammina al tempo vero mentre suona, e non supera mai l'audio se
    // questo è indietro (attesa di dati); si ferma in pausa e in attesa. Se l'audio corre più del tempo vero o è già finito
    // (browser senza finestra), il movimento resta comunque al tempo vero.
    const orologio = () => {
      const adesso = performance.now();
      if (ultimo !== null && vivo() && discorso.stato === 'suona') {
        m += (adesso - ultimo) / 1000;
        if (!a.ended && a.currentTime < m) m = a.currentTime;
      }
      ultimo = adesso;
      return m;
    };
    const parte = () => {
      if (!vivo()) return;
      avviato = true; ultimo = performance.now();
      const prima = discorso.stato;
      discorso.stato = 'suona'; clearTimeout(lentoT);
      if (!discorso.iniziato) { discorso.iniziato = true; palco.inizia(n); }
      if (nota && nota.getAttribute('role') === 'status') togliNota();
      aggiornaBottoni(); avvia();
      // per i lettori di schermo: la voce scelta e che cosa sta succedendo, una volta sola per ogni discorso, quando il suono parte
      // davvero (se non parte, parla l'avviso dell'errore). Nel filo anche la frase; in alto lo dice già la finestra («Sto parlando…»)
      if (prima === 'carica' && !discorso.annunciato) {
        discorso.annunciato = true;
        const nome = nomeVoce(voce), num = window.Testi.numero(n);
        if (palco === filo) annuncia(fmt(T(dallaVoce ? 'annuncio.voce-frase' : 'annuncio.frase'), {voce: nome, n: num}));
        else if (dallaVoce) annuncia(fmt(T('annuncio.voce'), {voce: nome}));
      }
    };
    a.addEventListener('playing', parte);
    a.addEventListener('timeupdate', () => { if (!avviato && a.currentTime > 0) parte(); });
    a.addEventListener('waiting', () => { if (vivo() && discorso.stato === 'suona') { discorso.stato = 'carica'; aggiornaBottoni(); } });
    a.addEventListener('pause', () => { if (vivo() && !a._nostra && !a.ended) pausa(); });
    a.addEventListener('error', () => sbagliata());
    parla({palco, n, file, orologio, audio: a});
    lentoT = setTimeout(() => { if (vivo() && discorso.stato === 'carica') mostraNota(palco, n, 'lento'); }, 6000);
    prova();
  }

  // ---------- il ciclo dei fotogrammi: gira solo quando c'è qualcosa da muovere ----------
  const ora = () => tScena() / 1000;
  let giro = 0;
  function avvia() { if (!giro) giro = requestAnimationFrame(fotogramma); }
  function fotogramma() {
    giro = 0;
    giraAgenda();
    if (arrivo) passoArrivo((tScena() - T0) / 1000);
    passoDiscorso();
    const t = ora();
    disegnaOnde(eroe, t); disegnaOnde(filo, t); disegnaOnde(chiusa, t);
    if (arrivo || (discorso && discorso.stato === 'suona') || [eroe, filo, chiusa].some(p => p.onde.length || p.sporca) || agenda.length) avvia();
  }

  // =================================================================================================================
  // L'ARRIVO, senza suono
  // =================================================================================================================
  const SCRIVE = 2.2, PASSO = 0.026, INVIO = 5.3, F2 = FRASI[2].testo;
  const scritto = $('.f-scritto', eroe.finestra), linea = $('.f-linea', eroe.finestra), zona = $('.f-testo-campo', eroe.finestra), parlaBtn = $('.f-di', eroe.finestra);
  let arrivo = !ridotto, scritti = -1;
  function scrivi(k) {
    if (k === scritti) return;
    scritti = k;
    scritto.textContent = F2.slice(0, k);
    eroe.campo.classList.toggle('pieno', k > 0);
    parlaBtn.classList.toggle('attivo', k > 0);
    const spazio = zona.clientWidth - 2, sposta = Math.max(0, linea.offsetWidth - spazio);
    linea.style.transform = sposta ? `translateX(${-sposta * verso()}px)` : '';   // il testo scorre verso l'inizio della riga
  }
  function passoArrivo(t) {
    if (!TEMPI) return;
    if (t >= SCRIVE && t < INVIO) {
      eroe.campo.classList.add('fuoco');
      scrivi(Math.min(F2.length, Math.floor((t - SCRIVE) / PASSO) + 1));
    } else if (t >= INVIO && arrivo === true) {
      scrivi(0);
      arrivo = 'parla';
      const inizio = tScena() / 1000;
      parla({palco: eroe, n: 2, file: 'giulia-2', orologio: () => tScena() / 1000 - inizio});
    } else if (arrivo === 'parla' && !discorso) { arrivo = false; eroe.campo.classList.remove('fuoco'); }
  }
  function fermaArrivo() { if (arrivo) { arrivo = false; scrivi(0); eroe.campo.classList.remove('fuoco'); } }
  rendiFrase(eroe.testo, ridotto ? 2 : 1, true); eroe.bolla.classList.add('detta');
  let arrivoAvviato = false;
  function tempiPronti() {
    $$('.durata').forEach(d => { const f = TEMPI && TEMPI.file[`giulia-${d.dataset.frase}`]; if (f) d.textContent = mmss(f.durata_s); });
    // La riserva è già disponibile: una richiesta lenta non tiene ferma la scena.
    // I tempi arrivati dopo un gesto aggiornano solo le durate, mai la frase in ascolto.
    if (arrivo && TEMPI && !arrivoAvviato) { arrivoAvviato = true; T0 = tScena(); avvia(); }
  }
  tempiPronti();
  pronti.then(tempiPronti);

  // =================================================================================================================
  // I COMANDI DELL'ASCOLTO
  // =================================================================================================================
  const link = $('#ascolta-link'), pillola = $('#ascolta'), scheda = $('#ascolto'), dentro = $('.ascolto-dentro');
  const vociEroe = $$('#ascolto .voce'), frasiEroe = $$('#ascolto .frase'), chiudi = $('#chiudi'), fila = $('.fila-ascolto');
  const vociFilo = $$('.voci-filo .voce'), suonaFilo = $$('.suona-frase');
  link.hidden = true; pillola.hidden = false; $('.voci-filo').hidden = false; suonaFilo.forEach(b => { b.hidden = false; });
  let ultima = 3;
  // stati del comando di una frase nel filo: fermo, in caricamento, in riproduzione, in pausa, fatto (sentita fino in fondo)
  const STATI = ['fermo', 'carica', 'suona', 'pausa', 'fatto'];
  const VERBO = Object.fromEntries(STATI.map(k => [k, T(`ascolto.verbo.${k}`)]));
  const AZIONE = Object.fromEntries(STATI.map(k => [k, T(`ascolto.azione.${k}`)]));
  const etichetta = (stato, n) => fmt(T('ascolto.azione.formato'), {azione: AZIONE[stato], frase: FRASI[n].testo});
  function aggiornaBottoni() {
    const d = discorso, conAudio = d && d.audio, st = conAudio ? d.stato : null;
    [...vociEroe, ...vociFilo].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.voce === voce)));
    // correzioni (P5): il selettore dice solo quale voce è scelta; «sta suonando» sta sul comando della frase
    frasiEroe.forEach(b => {
      const mia = !!(conAudio && d.palco === eroe && d.n === +b.dataset.frase);
      b.setAttribute('aria-current', String(+b.dataset.frase === ultima));
      b.setAttribute('aria-label', etichetta('fermo', +b.dataset.frase));
      b.classList.toggle('suona', mia && st === 'suona');
      b.classList.toggle('carica', mia && st === 'carica');
    });
    suonaFilo.forEach(b => {
      const n = +b.dataset.frase, mia = !!(conAudio && d.palco === filo && d.n === n);
      const stato = mia ? st : finite.has(n) ? 'fatto' : 'fermo';
      ['suona', 'carica', 'pausa', 'fatto'].forEach(k => b.classList.toggle(k === 'fatto' ? 'fatta' : k, stato === k));
      $('.etichetta-suona', b).textContent = VERBO[stato];
      b.setAttribute('aria-label', etichetta(stato, n));
    });
    $$('.messaggio').forEach(m => m.classList.toggle('in-pausa', !!(conAudio && d.palco === filo && d.stato === 'pausa' && +m.dataset.frase === d.n)));
  }
  aggiornaBottoni();   // le etichette dei pulsanti delle frasi (aria-label) le scrive lo script: nella pagina non ci sono
  // la scheda nasce dalla pillola chiara, sotto la finestra di Kalliope
  let aperta = false;
  const morph = (da, a) => `translate(${da.left - a.left}px, ${da.top - a.top}px) scale(${da.width / a.width}, ${da.height / a.height})`;
  // 8c (M1): sugli schermi bassi del computer la finestra di Kalliope lascia il posto alla scheda mentre è aperta (stile.css) e la
  // pagina si sistema con un solo movimento, insieme all'apertura e con la sua curva: si ferma con la bolla sotto la barra e la
  // scheda dentro lo schermo. Dove le due cose non stanno insieme (telefono girato) vince la scheda: i comandi.
  const basso = matchMedia('(min-width: 761px) and (max-height: 802px)'), largo = matchMedia('(min-width: 761px)'), sottoEl = $('.sotto'), postoEl = $('.posto-bolla'), palcoQ = $('.palco');
  const curva = (() => {   // cubic-bezier(0.19,1,0.22,1), la curva d'entrata
    const X = t => 3 * 0.19 * (1 - t) ** 2 * t + 3 * 0.22 * (1 - t) * t * t + t ** 3, Y = t => 3 * (1 - t) ** 2 * t + 3 * (1 - t) * t * t + t ** 3;
    return x => { let lo = 0, hi = 1; for (let i = 0; i < 26; i++) { const m = (lo + hi) / 2; if (X(m) < x) lo = m; else hi = m; } return Y((lo + hi) / 2); };
  })();
  let corsaScorri = 0;
  function scorriInsieme(dy, durata = 460) {
    if (!dy) return;
    const y0 = scrollY, t0 = performance.now(), id = ++corsaScorri;
    if (ridotto) { scrollTo({top: y0 + dy, behavior: 'instant'}); return; }
    const passo = adesso => { if (id !== corsaScorri) return; const q = Math.min(1, (adesso - t0) / durata); scrollTo({top: y0 + dy * curva(q), behavior: 'instant'}); if (q < 1) requestAnimationFrame(passo); };
    requestAnimationFrame(passo);
  }
  function quantoScorrere(rs) {
    const alto = $('.barra').offsetHeight + 8, basso_ = innerHeight - 8, rb = postoEl.getBoundingClientRect();
    const minimo = rs.bottom - basso_, massimo = rb.top - alto;   // la scheda entra dal basso; la bolla non sale sotto la barra
    if (minimo <= 0 && massimo >= -4) return 0;
    return minimo <= massimo ? Math.max(minimo, Math.min(0, massimo)) : minimo;
  }
  function apri() {
    if (aperta) return;
    aperta = true;
    pillola.style.animation = 'none';
    const rp = pillola.getBoundingClientRect(), h0 = sottoEl.offsetHeight;
    // 8d: con «riduci movimento» ogni transizione dura 1 ms ma parte da dove stava la cosa (la finestra aveva −14 px di margine): la
    // misura presa subito era sfasata di 14 px e la scheda finiva 6 px sotto il bordo (844×390). Si misura la geometria finale.
    if (largo.matches) sottoEl.style.transition = 'none';
    scheda.hidden = false; fila.classList.remove('chiudendo'); fila.classList.add('aperta');
    pillola.setAttribute('aria-expanded', 'true');
    // 8d: la modalità compatta (la finestra di Kalliope lascia il posto alla scheda) vale sotto 803 px d'altezza (8c) e dovunque, con la
    // finestra al suo posto, la scheda dentro lo schermo e la bolla sotto la barra non ci stanno insieme (a 1280 px di larghezza fino a
    // circa 880 px d'altezza; a 761-886 px anche a 900): lo si misura, non lo si indovina dall'altezza
    let compattaOra = largo.matches && basso.matches;
    if (largo.matches && !compattaOra) {
      const r0 = scheda.getBoundingClientRect(), rb0 = postoEl.getBoundingClientRect(), minimo0 = r0.bottom - (innerHeight - 8), massimo0 = rb0.top - ($('.barra').offsetHeight + 8);
      compattaOra = minimo0 > 0 && minimo0 > massimo0;
    }
    if (compattaOra) palcoQ.classList.add('compatta');
    const rs = scheda.getBoundingClientRect();
    const dy = quantoScorrere(rs);   // a ogni misura: la scheda dentro lo schermo e, se ci stanno insieme, la bolla sotto la barra
    if (largo.matches) sottoEl.style.transition = '';
    if (!ridotto) {
      scheda.animate([{transform: morph(rp, rs), borderRadius: '999px'}, {transform: 'none', borderRadius: '22px'}], {duration: 460, easing: ENTRA});
      dentro.animate([{opacity: 0}, {opacity: 0, offset: 0.45}, {opacity: 1}], {duration: 500, easing: 'ease-out'});
      pillola.animate([{opacity: 1}, {opacity: 0}], {duration: 90});
      if (compattaOra) sottoEl.animate([{height: `${h0}px`, marginTop: '-14px', opacity: 1}, {height: '0px', marginTop: '0px', opacity: 0}], {duration: 460, easing: ENTRA});
    }
    pillola.style.opacity = '0'; pillola.style.visibility = 'hidden';
    $('.voce[aria-pressed="true"]', scheda).focus({preventScroll: true});
    scorriInsieme(dy);   // 8b/8d: dove serve la scheda aperta non finisce sotto il bordo, e la bolla non finisce sotto la barra
  }
  function chiudiScheda() {
    if (!aperta) return;
    aperta = false;
    if (discorso && discorso.palco === eroe) ferma(true);
    if (nota && scheda.contains(nota)) togliNota();
    pillola.style.visibility = '';
    // 8c: sugli schermi bassi la finestra di Kalliope torna al suo posto mentre la scheda si richiude nella pillola
    const compattaPrima = palcoQ.classList.contains('compatta'), bassoOra = compattaPrima && !ridotto;
    if (compattaPrima) fila.classList.add('chiudendo');
    if (bassoOra) { const h1 = sottoEl.offsetHeight; sottoEl.animate([{height: '0px', marginTop: '0px', opacity: 0}, {height: `${h1}px`, marginTop: '-14px', opacity: 1}], {duration: 360, easing: 'cubic-bezier(0.6,0,0.2,1)'}); }
    const rp = pillola.getBoundingClientRect(), rs = scheda.getBoundingClientRect();
    // se nel frattempo la scheda si è riaperta, la chiusura in corso non deve nasconderla
    const fatto = () => { if (aperta) return; scheda.hidden = true; fila.classList.remove('aperta', 'chiudendo'); palcoQ.classList.remove('compatta'); pillola.style.opacity = '1'; pillola.setAttribute('aria-expanded', 'false'); pillola.focus({preventScroll: true}); };
    const senzaErrori = () => {};
    if (ridotto) { fatto(); return; }
    if (telefono.matches) { scheda.animate([{opacity: 1}, {opacity: 0}], {duration: 200}).finished.then(() => { fatto(); if (!aperta) pillola.animate([{opacity: 0}, {opacity: 1}], {duration: 200}); }, senzaErrori); return; }
    dentro.animate([{opacity: 1}, {opacity: 0}], {duration: 140, fill: 'forwards'}).finished.then(a => a.cancel && a.cancel(), senzaErrori);
    scheda.animate([{transform: 'none', borderRadius: '22px'}, {transform: morph(rp, rs), borderRadius: '999px'}], {duration: 360, easing: 'cubic-bezier(0.6,0,0.2,1)'}).finished.then(fatto, senzaErrori);
    pillola.animate([{opacity: 0}, {opacity: 0, offset: 0.65}, {opacity: 1}], {duration: 360});
  }
  parlaBtn.disabled = false;
  parlaBtn.addEventListener('click', () => { ultima = 2; suona(eroe, 2); });
  pillola.addEventListener('click', () => { ultima = 3; voce = 'giulia'; suona(eroe, 3); apri(); });
  chiudi.addEventListener('click', chiudiScheda);
  eroe.ferma.addEventListener('click', () => ferma(true));
  frasiEroe.forEach(b => b.addEventListener('click', () => { ultima = +b.dataset.frase; suona(eroe, ultima); }));
  // premere una voce la fa sentire (ciò che promette il ▶): la frase scelta, con quella voce
  vociEroe.forEach(b => b.addEventListener('click', () => { voce = b.dataset.voce; suona(eroe, ultima, true); }));
  // il filo: ogni frase si ascolta dove sta; la voce scelta vale per tutte. Il comando fa ascolta, pausa, riprendi;
  // mentre carica, premerlo annulla
  suonaFilo.forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.frase, d = discorso, mia = d && d.audio && d.palco === filo && d.n === n;
    if (mia && d.stato === 'suona') { pausa(); return; }
    if (mia && d.stato === 'pausa') { riprendi(); return; }
    if (mia && d.stato === 'carica') { ferma(false); return; }
    ultimaFilo = n; suona(filo, n);
  }));
  // nel filo premere una voce fa sentire con quella voce la frase che stai ascoltando, o l'ultima ascoltata, o quella
  // più in vista sullo schermo; la frase si accende dov'è e il suo comando mostra lo stato
  let ultimaFilo = 0;
  function fraseInVista() {
    let meglio = 1, dist = Infinity;
    $$('.messaggio').forEach(m => { const r = m.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - innerHeight / 2); if (d < dist) { dist = d; meglio = +m.dataset.frase; } });
    return meglio;
  }
  vociFilo.forEach(b => b.addEventListener('click', () => {
    voce = b.dataset.voce; togliNota();
    const n = discorso && discorso.audio && discorso.palco === filo ? discorso.n : ultimaFilo || fraseInVista();
    ultimaFilo = n; suona(filo, n, true);
  }));
  // Esc: chiude la scheda dell'ascolto; altrimenti ferma la voce della finestra in alto, come dice la sua riga di stato («Esc la ferma»)
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (aperta) chiudiScheda();
    else if (discorso && discorso.audio && discorso.palco === eroe) ferma(true);
  });
  if (typeof Audio === 'undefined') {   // un browser senza audio: i comandi non ci sono, restano i lettori nativi e i file
    [...vociEroe, ...vociFilo, ...frasiEroe, ...suonaFilo, pillola, parlaBtn].forEach(b => { b.disabled = true; });
  }

  // =================================================================================================================
  // SOTTO LA PIEGA: ciò che accade quando arriva sullo schermo
  // =================================================================================================================
  // ---------- la strada della voce: l'impulso parte dalla frase, accende ciò che è provato e prosegue tratteggiato ----------
  function animaStrada(strada) {
    const tappe = $$('.tappa', strada);
    const finale = () => { strada.classList.add('fatto'); tappe.slice(0, 3).forEach(t => t.classList.add('acceso')); tappe.slice(3).forEach(t => t.classList.add('raggiunta')); };
    if (ridotto) { finale(); return; }
    const verticale = telefono.matches, asse = verticale ? 'scaleY' : 'scaleX';
    const lf = $('.linea-fatta', strada), lp = $('.linea-forse', strada), imp = $('.impulso', strada);
    const rs = strada.getBoundingClientRect(), ri = imp.getBoundingClientRect();
    const c0 = {x: ri.left + ri.width / 2 - rs.left, y: ri.top + ri.height / 2 - rs.top};
    const centri = tappe.map(t => { const r = $('.nodo', t).getBoundingClientRect(); return {x: r.left + r.width / 2 - rs.left, y: r.top + r.height / 2 - rs.top}; });
    const tr = c => `translate(${(c.x - c0.x).toFixed(1)}px, ${(c.y - c0.y).toFixed(1)}px)`;
    tappe[0].classList.add('acceso');
    lf.animate([{transform: `${asse}(0)`}, {transform: `${asse}(1)`}], {duration: 1100, delay: 200, easing: 'cubic-bezier(0.45,0,0.2,1)', fill: 'forwards'});
    imp.animate([
      {opacity: 0, transform: tr(centri[0])}, {opacity: 1, transform: tr(centri[0]), offset: 0.08},
      {opacity: 1, transform: tr(centri[2]), offset: 0.5}, {opacity: 1, transform: tr(centri[2]), offset: 0.58},
      {opacity: 0.4, transform: tr(centri[4]), offset: 0.96}, {opacity: 0, transform: tr(centri[4])}],
    {duration: 2500, easing: 'linear', fill: 'forwards'});
    dopo(760, () => tappe[1].classList.add('acceso'));
    dopo(1300, () => { tappe[2].classList.add('acceso'); scoppio(tappe[2]); strada.classList.add('provato'); });   // «Provato» compare quando la voce arriva al microfono
    lp.animate([{transform: `${asse}(0)`}, {transform: `${asse}(1)`}], {duration: 1000, delay: 1450, easing: 'linear', fill: 'forwards'});
    dopo(1950, () => tappe[3].classList.add('raggiunta'));
    dopo(2450, () => tappe[4].classList.add('raggiunta'));
    dopo(2550, finale);
  }
  function scoppio(tappa) {
    for (let k = 0; k < 2; k++) {
      const s = document.createElement('span'); s.className = 'scoppio'; tappa.append(s);
      s.animate([{transform: 'scale(1)', opacity: 0.8}, {transform: 'scale(2.1)', opacity: 0}], {duration: 900, delay: k * 240, easing: 'ease-out', fill: 'both'}).finished.then(() => s.remove(), () => s.remove());
    }
  }

  // ---------- il primo avvio della 0.1: le voci sono nel pacchetto, niente da scaricare: «Preparo la voce…», «Pronta»; poi nella
  // riunione si sceglie «Kalliope» come microfono e il tuo riquadro si accende. I tre requisiti seguono il racconto (correzioni P9).
  // Senza lo scarico di prima (2,54 s), il racconto è lo stesso, solo più corto ----------
  const avvioBox = $('.primo-avvio'), avvio = $('.avvio', avvioBox), aStato = $('.f-stato', avvio);
  const scelte = $$('.scelta', avvioBox), rivedi = $('.rivedi', avvioBox);
  const app = $('.riunione-app', avvioBox);
  const requisiti = $('.requisiti'), req = $$('li', requisiti);
  const PRIMO = {nome: $('.f-titolo', aStato).textContent, detto: $('.f-detto', aStato).textContent}, PRONTA = TESTO_PRONTA;   // i testi che la pagina mostra all'arrivo
  let agendaAvvio = [];
  function requisito(k, ms) {   // k = requisito del momento; quelli prima sono fatti; ms = quanto dura il suo momento
    req.forEach((li, i) => { li.classList.toggle('fatto', i < k || k >= req.length); li.classList.toggle('attivo', i === k); });
    if (req[k]) req[k].style.setProperty('--durata', `${ms}ms`);
  }
  function microfonoScelto(si) {
    scelte.forEach((s, i) => { s.classList.toggle('scelto', si ? i === 1 : i === 0); s.classList.remove('puntata', 'premuta'); });
    app.classList.toggle('vivo', si);
  }
  function animaAvvio() {
    annulla(agendaAvvio);
    avvio.classList.remove('pronta'); avvio.classList.add('prepara');
    window.Finestra.stato(aStato, PRIMO.nome, PRIMO.detto);
    microfonoScelto(false);
    rivedi.classList.add('in-scena');
    if (ridotto) { avvio.classList.remove('prepara'); avvio.classList.add('pronta'); window.Finestra.stato(aStato, PRONTA.nome, PRONTA.detto); microfonoScelto(true); requisito(req.length); rivedi.classList.remove('in-scena'); return; }
    requisiti.classList.add('in-scena'); requisito(0, 860);
    const quando = (ms, f) => agendaAvvio.push(dopo(ms, f));
    quando(860, () => requisito(1, 900));
    quando(1760, () => { avvio.classList.remove('prepara'); avvio.classList.add('pronta'); window.Finestra.stato(aStato, PRONTA.nome, PRONTA.detto); requisito(2, 1400); });
    quando(2160, () => { scelte[1].classList.add('puntata'); });
    quando(2510, () => { scelte[1].classList.add('premuta'); });
    quando(2710, () => { scelte[0].classList.remove('scelto'); scelte[1].classList.remove('puntata', 'premuta'); scelte[1].classList.add('scelto'); });
    quando(3060, () => { microfonoScelto(true); requisito(req.length); });
    quando(3360, () => { rivedi.classList.remove('in-scena'); if (document.activeElement === avvio) rivedi.focus({preventScroll: true}); });
  }
  // «Rivedi» sta sempre nell'ordine di Tab, anche prima che la scena parta e mentre gira: allora non si vede (come prima: compare
  // a fine scena), ma se il fuoco ci arriva si mostra da sé (stile.css, `.in-scena`). Così chi scende con Tab non lo scavalca perché
  // la scena è partita proprio all'arrivo della sezione. Premuto, il fuoco passa alla finestra (non si perde) e torna al pulsante
  // quando riappare.
  rivedi.hidden = false;
  if (!ridotto) rivedi.classList.add('in-scena');
  rivedi.addEventListener('click', () => { animaAvvio(); avvio.focus({preventScroll: true}); });

  // ---------- quando un tratto arriva sullo schermo ----------
  $$('.messaggio.entra').forEach((m, i) => m.style.setProperty('--ritardo', `${i * 150}ms`));
  $$('.chiusura .entra').forEach((m, i) => m.style.setProperty('--ritardo', `${i * 90}ms`));
  const fatti = new WeakSet();
  function rivela(el) {
    el.classList.add('visto');
    if (fatti.has(el)) return; fatti.add(el);
    if (el.classList.contains('strada')) dopo(250, () => animaStrada(el));
    if (el.classList.contains('avvio')) {   // il racconto parte dopo che la finestra si è aperta; i requisiti si preparano subito
      if (!ridotto) { requisiti.classList.add('in-scena'); requisito(0, 1280); }
      dopo(420, animaAvvio);
    }
    if (el.classList.contains('tavolo')) dopo(760, salutaChiusa);
  }
  // la chiusura: quando la riunione è entrata, «Tu» dice la prima frase (senza suono, con i tempi veri di giulia-1).
  // Non interrompe mai un ascolto con il suono: se qualcuno sta ascoltando, aspetta che finisca
  let chiusaFatta = false;
  const bollaChiusa = $('.bolla-chiusa');
  function salutaChiusa(prove = 30) {
    if (chiusaFatta) return;
    // senza tempi, con il movimento ridotto o dopo un'attesa troppo lunga, la frase c'è già detta, ferma
    if (ridotto || prove <= 0 || (!TEMPI && prove < 28)) { chiusaFatta = true; bollaChiusa.classList.add('nata'); return; }
    if (!TEMPI || !TEMPI.file['giulia-1'] || (discorso && discorso.audio)) { dopo(800, () => salutaChiusa(prove - 1)); return; }
    // l'arrivo muto in alto è lontano dallo schermo (la chiusura è a più di tre schermi): si chiude al suo stato finale
    if (arrivo || discorso) { fermaArrivo(); if (discorso) ferma(false); }
    chiusaFatta = true;
    const inizio = tScena() / 1000;
    parla({palco: chiusa, n: 1, file: 'giulia-1', orologio: () => tScena() / 1000 - inizio});
  }
  // il fuoco che entra in un tratto lo mostra subito, tutto, senza aspettare le entrate (correzioni P16): non si resta
  // con il fuoco accanto a qualcosa di ancora sbiadito
  function mostraSubito(el) {
    el.classList.add('subito', 'mostrato'); rivela(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('subito')));
  }
  document.addEventListener('focusin', e => {
    if (!e.target.closest) return;
    const tratto = e.target.closest('.tratto'), qui = e.target.closest('.entra:not(.visto)');
    const da = tratto ? $$('.entra:not(.visto)', tratto) : [];
    if (qui && !da.includes(qui)) da.push(qui);
    da.forEach(mostraSubito);
  });
  if ('IntersectionObserver' in window) {
    // un tratto si rivela quando ne è visibile il 15%; se è così alto che non potrà mai arrivarci (telefono in orizzontale,
    // schermo basso), basta la parte che lo schermo può mostrare. Soglie fitte: nessun tratto resta invisibile.
    const vedi = new IntersectionObserver(voci => voci.forEach(v => {
      if (!v.isIntersecting) return;
      const alto = Math.max(1, v.boundingClientRect.height), spazio = v.rootBounds ? v.rootBounds.height : innerHeight;
      if (v.intersectionRatio < Math.min(0.15, 0.85 * spazio / alto)) return;
      vedi.unobserve(v.target); rivela(v.target);
    }), {threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3], rootMargin: '0px 0px -6% 0px'});
    $$('.entra').forEach(el => vedi.observe(el));
  } else {
    $$('.entra').forEach(rivela);
  }

  // ---------- la barra resta in alto; l'azione vi compare quando quella del primo schermo esce di vista ----------
  // Si calcola dalla posizione, a ogni scorrimento: un osservatore non scatta se si torna in cima di colpo (Home, ricarica),
  // perché l'azione passa da «sopra lo schermo» a «sotto lo schermo» senza mai entrarvi.
  const barra = $('.barra'), comandiTop = $('#comandi-apertura'), comandiFondo = $('.chiusura .comandi'), banda = $('.banda-riunione');
  let barraChiesta = false, barraY = scrollY;
  function sullaBarra() {
    barraChiesta = false;
    // 8b (N3): dopo un salto di pagina (un'ancora, il fuoco da tastiera) la barra si riempie subito: con la dissolvenza di una
    // scorsa restava trasparente per un attimo e il marchio stava sopra il titolo del tratto. Scorrendo piano la dissolvenza resta.
    const salto = Math.abs(scrollY - barraY) > 48, compatta = scrollY > 12; barraY = scrollY;
    if (salto && compatta !== barra.classList.contains('compatta')) {
      barra.style.transition = 'none'; barra.classList.toggle('compatta', compatta); void barra.offsetWidth; barra.style.transition = '';
    } else barra.classList.toggle('compatta', compatta);
    const a = comandiTop.getBoundingClientRect(), z = comandiFondo.getBoundingClientRect();
    // compare quando l'azione del primo schermo è uscita in alto, e sparisce quando arriva quella della chiusura
    barra.classList.toggle('con-azione', a.bottom <= 0 && !(z.top < innerHeight && z.bottom > 0));
    // al telefono la riunione del filo agganciata sotto la barra prende il fondo della barra (stile.css, secondo giro punto 2)
    if (banda) banda.classList.toggle('agganciata', telefono.matches && banda.getBoundingClientRect().top <= barra.offsetHeight + 1);
  }
  const chiediBarra = () => { if (!barraChiesta) { barraChiesta = true; requestAnimationFrame(sullaBarra); } };
  // le misure della barra (il posto dell'azione, la barra «stretta» o «raccolta» con il testo lungo), dell'etichetta di «Tu» e dei
  // collegamenti con la freccia stanno in componenti.js, che serve anche le pagine interne
  addEventListener('scroll', chiediBarra, {passive: true}); addEventListener('resize', chiediBarra); sullaBarra();

  // ---------- al telefono l'ordine del fuoco è quello che si vede: prima «Ascolta Giulia», poi «Scarica e installa» ----------
  const palcoEl = $('.palco'), presentazione = $('.presentazione'), statoOggi = $('.apertura .stato');
  let sulTelefono = false;
  function ordineDom() {
    if (telefono.matches === sulTelefono) return;
    sulTelefono = telefono.matches;
    if (document.readyState === 'complete') [comandiTop, ...comandiTop.children, statoOggi].forEach(e => { e.style.animation = 'none'; });   // non ripetere l'arrivo di ciò che si sposta
    if (sulTelefono) palcoEl.after(comandiTop, statoOggi); else presentazione.after(comandiTop, statoOggi);
  }
  ordineDom(); telefono.addEventListener('change', ordineDom);

  // ---------- il menu al telefono e sulle finestre strette ----------
  const pm = $('.pulsante-menu'), menu = $('#menu'), stretto = matchMedia('(max-width: 959px)');
  pm.setAttribute('role', 'button'); pm.setAttribute('aria-expanded', 'false');
  function chiudiMenu(fuoco) { menu.classList.remove('aperto'); pm.setAttribute('aria-expanded', 'false'); if (fuoco) pm.focus(); }
  pm.addEventListener('click', e => {
    if (getComputedStyle(pm).display === 'none') return;
    e.preventDefault();
    const su = !menu.classList.contains('aperto');
    menu.classList.toggle('aperto', su); pm.setAttribute('aria-expanded', String(su));
    if (su) $('a', menu).focus();
  });
  // 8f: dove il menu scorre dentro di sé (schermo più basso del menu) il fuoco da tastiera porta la voce per intero nel menu: Chromium e WebKit lo fanno da
  // soli, Firefox no se la voce è già in parte in vista (a 768×340 «Aiuto» restava per 31 px su 52, con il contorno tagliato). Si scorre il menu, non la pagina.
  menu.addEventListener('focusin', e => {
    if (menu.scrollHeight <= menu.clientHeight + 1 || !menu.contains(e.target)) return;
    const r = e.target.getBoundingClientRect(), c = menu.getBoundingClientRect(), margine = 8;
    if (r.bottom > c.bottom - margine) menu.scrollTop += r.bottom - (c.bottom - margine);
    else if (r.top < c.top + margine) menu.scrollTop -= (c.top + margine) - r.top;
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('aperto')) chiudiMenu(true); });
  // un collegamento dentro la pagina (la lingua, che sta in fondo) chiude il menu: si apre per andare altrove, e resterebbe aperto sopra il piede
  menu.addEventListener('click', e => { if (e.target.closest && e.target.closest('a[href^="#"]') && menu.classList.contains('aperto')) chiudiMenu(false); });
  document.addEventListener('click', e => { if (menu.classList.contains('aperto') && !menu.contains(e.target) && !pm.contains(e.target)) chiudiMenu(false); });
  document.addEventListener('focusin', e => { if (menu.classList.contains('aperto') && !menu.contains(e.target) && e.target !== pm) chiudiMenu(false); });
  stretto.addEventListener('change', () => chiudiMenu(false));

  // =================================================================================================================
  // LA SCHEDA IN SECONDO PIANO
  // =================================================================================================================
  // Si ferma tutto insieme: l'orologio della scena, le animazioni in corso e l'ascolto (il filo va in pausa e si può
  // riprendere; la finestra in alto si ferma). Al ritorno si riparte da dove si era, senza salti e senza ripetizioni.
  let sospese = [];
  function nascondi() {
    if (nascostoDa === null) nascostoDa = performance.now();
    sospese = document.getAnimations().filter(a => a.playState === 'running'); sospese.forEach(a => a.pause());
    if (discorso && discorso.audio) { if (discorso.palco === filo) pausa(); else ferma(false); }
  }
  function mostra() {
    if (nascostoDa !== null) { fermoTot += performance.now() - nascostoDa; nascostoDa = null; }
    sospese.forEach(a => { if (a.playState === 'paused') a.play(); }); sospese = [];
    avvia(); chiediBarra();
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) nascondi(); else mostra(); });
  addEventListener('pagehide', () => { if (discorso && discorso.audio) ferma(false); });
  if (document.hidden) nascondi();
  window.__scena = true;
})();
