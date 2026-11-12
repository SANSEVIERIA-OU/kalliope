/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
/* Kalliope: script facoltativo. Tutto il sito funziona senza; questo file aggiunge soltanto:
   1. l'ascolto con barre e frase evidenziata (al posto dei controlli nativi dell'audio);
   2. il filtro delle frasi nella pagina Aiuto;
   3. il pulsante «Copia» per i comandi e per l'indirizzo della pagina;
   4. un avviso per chi apre il sito da Windows, macOS o un telefono.
   Nessuna richiesta a terzi, nessuna memoria locale. I testi visibili stanno nell'HTML (data-*), non qui. */
(function () {
  'use strict';
  var radice = document.documentElement;
  radice.classList.add('js');
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function ridotto() { return (mq && mq.matches) || radice.hasAttribute('data-ridotto'); }
  var qs = function (el, s) { return el.querySelector(s); };
  var qsa = function (el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); };
  var script = document.currentScript;
  var base = script ? new URL('.', script.src) : new URL('./script/', location.href);

  /* ---------- 1. Ascolto ---------- */
  function formato(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

  function fermaAltri(audio) {
    qsa(document, 'audio').forEach(function (a) { if (a !== audio && !a.paused) a.pause(); });
  }

  function potenziaVoce(el, tempi) {
    var audio = qs(el, 'audio');
    var controlli = qs(el, '.voce__controlli');
    if (!audio || !controlli) return;
    var nome = el.getAttribute('data-nome') || 'la voce';
    var testoAvvia = el.getAttribute('data-testo-avvia') || 'Ascolta';
    var testoFerma = el.getAttribute('data-testo-ferma') || 'Ferma';
    var testoFrase = el.getAttribute('data-testo-frase') || 'frase';
    var testoDi = el.getAttribute('data-testo-di') || 'di';
    var testoErrore = el.getAttribute('data-testo-errore') || 'Questo browser non riproduce il file. Usa il collegamento per scaricarlo.';
    var dati = tempi && tempi.file ? tempi.file[el.getAttribute('data-file')] : null;
    var scheda = el.closest('.ascolto');
    var frasiTesto = scheda ? qsa(scheda, '.frase') : [];
    var durata = dati ? dati.durata_s : 0;

    controlli.textContent = '';
    var bottone = document.createElement('button');
    bottone.type = 'button';
    bottone.className = 'btn btn--primario';
    bottone.setAttribute('aria-pressed', 'false');
    bottone.textContent = testoAvvia + ' ' + nome;
    var barre = document.createElement('span');
    barre.className = 'barre';
    barre.setAttribute('aria-hidden', 'true');
    var iBarre = [];
    for (var k = 0; k < 5; k++) { var b = document.createElement('i'); barre.appendChild(b); iBarre.push(b); }
    var posizione = document.createElement('span');
    posizione.className = 'voce__posizione';
    posizione.setAttribute('aria-hidden', 'true');
    controlli.appendChild(bottone); controlli.appendChild(barre); controlli.appendChild(posizione);
    var messaggio = qs(el, '.voce__messaggio');
    if (!messaggio) { messaggio = document.createElement('p'); messaggio.className = 'voce__messaggio'; messaggio.setAttribute('role', 'status'); el.appendChild(messaggio); }
    el.classList.add('potenziata');

    function indiceFrase(t) {
      if (!dati || !dati.frasi) return 0;
      var i = 0;
      for (var n = 0; n < dati.frasi.length; n++) if (t >= dati.frasi[n].da - 0.05) i = n;
      return i;
    }
    function aggiornaTesto(t, attiva) {
      var n = dati && dati.frasi ? dati.frasi.length : 1;
      var i = indiceFrase(t);
      posizione.textContent = (n > 1 ? testoFrase + ' ' + (i + 1) + ' ' + testoDi + ' ' + n + ' · ' : '') + formato(t) + ' / ' + formato(Math.round(durata || audio.duration || 0));
      frasiTesto.forEach(function (f) {
        var s = parseInt(f.getAttribute('data-frase'), 10);
        f.classList.toggle('in-corso', attiva && s === i + 1);
      });
    }
    function barreRiposo() { iBarre.forEach(function (b) { b.style.removeProperty('--h'); }); }
    function barreA(t) {
      if (!dati || !dati.env) return;
      var passo = (tempi.passo_ms || 60) / 1000, idx = Math.floor(t / passo);
      for (var k = 0; k < 5; k++) {
        var v = dati.env[idx - (4 - k)] || 0;
        iBarre[k].style.setProperty('--h', (0.14 + 0.86 * Math.min(1, v * 1.25)).toFixed(3));
      }
    }
    var raf = 0, ultimoSecondo = -1;
    function ciclo() {
      var t = audio.currentTime;
      barreA(t);
      var s = Math.floor(t * 4);
      if (s !== ultimoSecondo) { ultimoSecondo = s; aggiornaTesto(t, true); }
      raf = requestAnimationFrame(ciclo);
    }
    function inizio() {
      messaggio.textContent = '';
      bottone.textContent = testoFerma + ' ' + nome;
      bottone.setAttribute('aria-pressed', 'true');
      aggiornaTesto(audio.currentTime, true);
      if (!ridotto()) { cancelAnimationFrame(raf); raf = requestAnimationFrame(ciclo); }
    }
    function fine(azzera) {
      cancelAnimationFrame(raf);
      bottone.textContent = testoAvvia + ' ' + nome;
      bottone.setAttribute('aria-pressed', 'false');
      barreRiposo();
      if (azzera) { audio.currentTime = 0; }
      aggiornaTesto(audio.currentTime, false);
    }
    audio.addEventListener('play', inizio);
    audio.addEventListener('pause', function () { fine(false); });
    audio.addEventListener('ended', function () { fine(true); });
    audio.addEventListener('timeupdate', function () { if (!audio.paused && ridotto()) aggiornaTesto(audio.currentTime, true); });
    audio.addEventListener('error', function () { fine(false); messaggio.textContent = testoErrore; });
    bottone.addEventListener('click', function () {
      if (audio.paused) {
        fermaAltri(audio);
        var p = audio.play();
        if (p && p.catch) p.catch(function () { messaggio.textContent = testoErrore; });
      } else { audio.pause(); }
    });
    aggiornaTesto(0, false);
  }

  function iniziaAscolto() {
    var voci = qsa(document, '.voce[data-file]');
    if (!voci.length) return;
    var avvia = function (tempi) { voci.forEach(function (v) { potenziaVoce(v, tempi); }); };
    if (!window.fetch) { avvia(null); return; }
    fetch(new URL('../voce/tempi.json', base)).then(function (r) { return r.ok ? r.json() : null; }).then(avvia, function () { avvia(null); });
  }

  /* ---------- 2. Filtro delle frasi (Aiuto) ---------- */
  function normalizza(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[«»"'’.…:]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function iniziaFiltro() {
    var filtro = qs(document, '[data-filtro]');
    if (!filtro) return;
    var input = qs(filtro, 'input');
    var stato = qs(filtro, '.filtro__stato');
    var gruppo = qs(document, '[data-gruppo-frasi]');
    if (!gruppo) return;
    // il filtro riguarda solo le frasi della finestra; «La mia frase non c'è» sta fuori dal gruppo e resta sempre in vista
    var schede = qsa(gruppo, '.scheda-frase');
    var voci = qsa(gruppo, '.indice-frasi li');
    var testi = schede.map(function (s) { return normalizza(s.textContent + ' ' + (s.getAttribute('data-parole') || '')); });
    var tUna = filtro.getAttribute('data-testo-una') || '1 frase';
    var tPiu = filtro.getAttribute('data-testo-piu') || 'frasi';
    var tNessuna = filtro.getAttribute('data-testo-nessuna') || 'Nessuna frase trovata.';
    var tTutte = filtro.getAttribute('data-testo-tutte') || 'Tutte le frasi.';
    function applica() {
      var q = normalizza(input.value);
      var parole = q ? q.split(' ') : [];
      var trovate = 0;
      schede.forEach(function (s, i) {
        var ok = parole.every(function (p) { return testi[i].indexOf(p) !== -1; });
        s.hidden = !ok;
        if (voci[i]) voci[i].hidden = !ok;
        if (ok) trovate++;
      });
      gruppo.hidden = parole.length > 0 && trovate === 0;
      stato.textContent = !parole.length ? tTutte : trovate === 0 ? tNessuna : trovate === 1 ? tUna : trovate + ' ' + tPiu;
    }
    input.addEventListener('input', applica);
    input.addEventListener('search', applica);
    applica();
  }

  /* ---------- 2b. Scelta della distribuzione (Installa): con script si tiene in vista una sola ---------- */
  function iniziaScelta() {
    var indice = qs(document, '.scelta-sistema__indice');
    if (!indice) return;
    var blocchi = qsa(document, '[data-sistema]');
    var tutte = qs(indice, '[data-sistema-tutte]');
    var link = qsa(indice, 'a[href^="#"]');
    var chiavi = blocchi.map(function (b) { return b.getAttribute('data-sistema'); });
    function scegli(chiave) {
      blocchi.forEach(function (b) { b.hidden = !!chiave && b.getAttribute('data-sistema') !== chiave; });
      link.forEach(function (a) { if (chiave && a.getAttribute('href') === '#' + chiave) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      if (tutte) tutte.hidden = !chiave;
    }
    link.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var chiave = a.getAttribute('href').slice(1);
        if (chiavi.indexOf(chiave) === -1) return;
        ev.preventDefault();
        scegli(chiave);
        if (history.replaceState) history.replaceState(null, '', '#' + chiave);
        var primo = qs(document, '#' + chiave);
        if (primo && primo.scrollIntoView) primo.scrollIntoView({block: 'start'});
      });
    });
    if (tutte) tutte.addEventListener('click', function () { scegli(''); if (history.replaceState) history.replaceState(null, '', location.pathname); });
    var h = location.hash.slice(1);
    if (chiavi.indexOf(h) !== -1) scegli(h);
  }

  /* ---------- 3. Copia ---------- */
  function iniziaCopia() {
    qsa(document, '[data-copia]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var contenitore = btn.closest('.comando, .condividi');
        var sorgente = contenitore && (qs(contenitore, 'code') || qs(contenitore, 'input'));
        var stato = contenitore && qs(contenitore, '.comando__stato');
        if (!sorgente) return;
        var testo = sorgente.value !== undefined && sorgente.tagName === 'INPUT' ? sorgente.value : sorgente.textContent.trim();
        var ok = btn.getAttribute('data-testo-ok') || 'Copiato.';
        var no = btn.getAttribute('data-testo-no') || 'Non riesco a copiare da solo: seleziona il testo e copialo.';
        function esito(buono) { if (stato) stato.textContent = buono ? ok : no; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(testo).then(function () { esito(true); }, function () { esito(false); });
        } else { esito(false); }
      });
    });
    qsa(document, '.condividi input').forEach(function (i) { i.addEventListener('focus', function () { i.select(); }); });
  }

  /* ---------- 4. Avviso sul sistema ---------- */
  function iniziaSistema() {
    var avviso = qs(document, '[data-banner-sistema]');
    if (!avviso) return;
    var ua = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    var agente = navigator.userAgent || '';
    var tipo = /android|iphone|ipad|ipod/i.test(agente) ? 'telefono' : /win/i.test(ua + agente) ? 'windows' : /mac/i.test(ua) ? (navigator.maxTouchPoints > 1 ? 'telefono' : 'macos') : '';
    if (/linux|x11/i.test(ua + agente) && !/android/i.test(agente)) tipo = '';
    var testo = tipo && avviso.getAttribute('data-testo-' + tipo);
    if (!testo) return;
    qs(avviso, '[data-banner-testo]').textContent = testo;
    avviso.hidden = false;
    var chiudi = qs(avviso, '[data-banner-chiudi]');
    if (chiudi) chiudi.addEventListener('click', function () { avviso.hidden = true; });
  }

  function avvia() { iniziaAscolto(); iniziaFiltro(); iniziaScelta(); iniziaCopia(); iniziaSistema(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
}());
