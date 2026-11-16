/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// «Non ancora» nella direzione 2: la riunione è pronta, la tua voce non ancora.
// Il primo schermo si muove da sé con il solo CSS (componenti/riunione-ferma.css). Qui: la strada che si ferma al microfono
// quando arriva sullo schermo; la bolla della chiusura che nasce; e il solo suono della pagina, la frase della chiusura detta
// con la registrazione vera, che parte soltanto se la persona preme. Le parole si accendono sui tempi di voce/tempi.json,
// le onde partono da «Tu» e chi ascolta si gira. Nessun testo e nessun colore qui: i testi stanno nella pagina, i valori
// in design-system/token.css. Con «riduci movimento» ogni scena è al suo stato finale; il suono c'è comunque, a richiesta.
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const verticale = () => matchMedia('(max-width: 760px)').matches;
  // la voce sta in cima al sito (voce/…), accanto agli altri file condivisi: questo script sta in non-ancora/
  const RADICE = new URL('../', document.currentScript.src);
  const radice = getComputedStyle(document.documentElement);
  const tok = n => radice.getPropertyValue(n).trim();
  const tempo = n => { const v = tok(n); return v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000; };
  const ENTRA = tok('--entra');

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
    setTimeout(() => { tappe[1].classList.add('acceso'); strada.classList.add('provato'); }, 760);   // «C'è già» quando la voce nasce
    setTimeout(() => {   // la voce arriva al posto del microfono e non trova niente: un'onda tratteggiata che non va oltre
      tappe[2].classList.add('urtata');
      const u = document.createElement('span'); u.className = 'urto'; u.setAttribute('aria-hidden', 'true'); tappe[2].append(u);
      u.animate([{transform: 'scale(1)', opacity: 0.9}, {transform: `scale(${tok('--urto-scala')})`, opacity: 0}],
        {duration: tempo('--durata-urto'), easing: 'ease-out', fill: 'both'}).finished.then(() => u.remove(), () => u.remove());
      strada.classList.add('fermata');
    }, 1300);
    setTimeout(finale, 2300);
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

  // ---------- un ascolto alla volta: carica, suona; premere ancora ferma ----------
  let discorso = null, ritorno = 0;
  const opus = document.createElement('audio').canPlayType('audio/ogg; codecs=opus') ? 'opus' : 'mp3';
  function stato(s) {
    ['carica', 'suona', 'pausa'].forEach(k => bottone.classList.toggle(k, s === k));
    bottone.setAttribute('aria-pressed', String(s === 'carica' || s === 'suona'));
    if (discorso) discorso.stato = s;
  }
  // premere mentre suona mette in pausa (come le frasi della home); premere in pausa riprende da dove era
  function pausa() {
    const d = discorso; if (!d || d.stato !== 'suona') return;
    d.audio._nostra = true; d.audio.pause(); d.ultimo = null;
    if (alone) alone.style.opacity = 0; barre.forEach(b => { b.style.transform = ''; });
    stato('pausa');
  }
  function riprendi() {
    const d = discorso; if (!d || d.stato !== 'pausa') return;
    d.audio._nostra = false;
    const g = d.audio.play();
    if (g && g.catch) g.catch(() => { if (discorso === d) { ferma(false); comandi.classList.add('ripiego'); } });
    d.ultimo = performance.now(); stato('suona'); giro();
  }
  function ferma(finita) {
    const d = discorso; if (!d) return;
    discorso = null;
    d.audio._nostra = true; d.audio.pause();
    dividi().flat().forEach(p => p.classList.remove('attesa'));
    if (bordo) bordo.style.opacity = ''; if (alone) alone.style.opacity = '';
    tu.classList.remove('parla'); barre.forEach(b => { b.style.transform = ''; });
    bolla.classList.toggle('detta', !!finita);
    clearTimeout(ritorno);
    ritorno = setTimeout(() => persone.forEach(p => p.classList.remove('guarda')), finita ? 1700 : 0);
    stato('fermo');
  }
  // dove lo schermo è basso o la pagina è in fondo, premendo la riunione viene in vista da sé (come nella home, 8c)
  function inVista() {
    const r = tavolo.getBoundingClientRect(), barra = document.querySelector('.barra'), alto = (barra ? barra.offsetHeight : 0) + 12;
    if (r.top >= alto && r.bottom <= innerHeight) return;
    scrollBy({top: r.top - alto, behavior: ridotto ? 'instant' : 'smooth'});
  }
  function suona() {
    if (discorso) { if (discorso.stato === 'suona') pausa(); else if (discorso.stato === 'pausa') riprendi(); else ferma(false); return; }
    clearTimeout(ritorno);
    inVista(); nasceBolla(0);
    const parole = dividi().flat();
    parole.forEach(p => p.classList.add('attesa'));
    bolla.classList.remove('detta');
    const fonti = (opus === 'opus' ? [`voce/${FILE}.opus`, `voce/${FILE}.mp3`] : [`voce/${FILE}.mp3`]).map(f => new URL(f, RADICE).href);
    const a = new Audio(); let i = 0;
    const d = discorso = {audio: a, parole, f: null, tp: null, pk: [], prossimo: 0, m: 0, ultimo: null, avviato: false};
    const vivo = () => discorso === d;
    const sbagliata = () => {
      if (!vivo()) return;
      if (!d.avviato && i + 1 < fonti.length) { i++; prova(); return; }
      ferma(false); comandi.classList.add('ripiego');   // il suono non va: resta il lettore del browser, con il file
    };
    const prova = () => {
      a.src = fonti[i];
      const g = a.play();
      if (g && g.catch) g.catch(e => { if (vivo() && !(e && e.name === 'AbortError')) sbagliata(); });
    };
    a.addEventListener('playing', () => {
      if (!vivo() || d.avviato) return;
      d.avviato = true; d.ultimo = performance.now();
      tempiPronti.then(() => {
        if (!vivo()) return;
        d.f = datiFile(a.duration); d.tp = tempiParole(d.f); d.pk = picchi(d.f);
        if (bordo) bordo.style.opacity = 1; tu.classList.add('parla');
        stato('suona'); giro();
      });
    });
    a.addEventListener('pause', () => { if (vivo() && !a._nostra && !a.ended) pausa(); });
    a.addEventListener('error', sbagliata);
    stato('carica');
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
    document.addEventListener('visibilitychange', () => { if (document.hidden && discorso) ferma(false); });
    addEventListener('pagehide', () => { if (discorso) ferma(false); });
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
    if (el.classList.contains('strada-ferma')) setTimeout(() => animaStrada(el), ridotto ? 0 : 250);
    if (el === tavolo) nasceBolla();
  });
  // senza osservatore o se il tratto è già stato rivelato prima di questo script
  $$('.entra.visto').forEach(el => el.dispatchEvent(new CustomEvent('rivelato', {bubbles: true})));

  window.__pagina = true;
})();
