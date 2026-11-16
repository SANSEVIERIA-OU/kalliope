/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
/* Catalogo (sistema/): controlli facoltativi per provare il movimento. Senza script il catalogo mostra tutto, solo senza i pulsanti. */
(function () {
  'use strict';
  var radice = document.documentElement;
  var qs = function (s, el) { return (el || document).querySelector(s); };
  var qsa = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* Movimento ridotto simulato: l'attributo data-ridotto sull'elemento radice azzera le durate dei token (token.css) */
  qsa('[data-attiva-ridotto]').forEach(function (b) {
    b.hidden = false;
    b.setAttribute('aria-pressed', radice.hasAttribute('data-ridotto') ? 'true' : 'false');
    b.addEventListener('click', function () {
      var acceso = radice.toggleAttribute('data-ridotto');
      qsa('[data-attiva-ridotto]').forEach(function (x) { x.setAttribute('aria-pressed', acceso ? 'true' : 'false'); });
      qsa('[data-stato-ridotto]').forEach(function (x) { x.textContent = acceso ? 'Movimento ridotto simulato: acceso' : 'Movimento ridotto simulato: spento'; });
    });
  });
  qsa('[data-stato-ridotto]').forEach(function (x) { x.textContent = 'Movimento ridotto simulato: spento'; });

  /* Simulazione delle barre e della frase evidenziata, senza audio: riproduce l'inviluppo misurato di un MP3 */
  var sim = qs('[data-sim-barre]');
  if (sim) {
    fetch(new URL('../voce/tempi.json', document.currentScript ? document.currentScript.src : location.href)).then(function (r) { return r.json(); }).then(function (t) {
      var dati = t.file['giulia-2'], barre = qsa('.barre i', sim), frasi = qsa('.frase', sim), pos = qs('[data-sim-posizione]', sim);
      var avvia = qs('[data-sim-avvia]', sim), ferma = qs('[data-sim-ferma]', sim), inverti = qs('[data-sim-inverti]', sim);
      avvia.hidden = ferma.hidden = false;
      var inizio = 0, raf = 0, durata = dati.durata_s, verso = 1, fermato = 0;
      function ridotto() { return radice.hasAttribute('data-ridotto'); }
      function disegna(tt) {
        var passo = t.passo_ms / 1000, idx = Math.floor(tt / passo);
        if (!ridotto()) barre.forEach(function (b, k) { b.style.setProperty('--h', (0.14 + 0.86 * Math.min(1, (dati.env[idx - (4 - k)] || 0) * 1.25)).toFixed(3)); });
        else barre.forEach(function (b) { b.style.removeProperty('--h'); });
        var i = 0; dati.frasi.forEach(function (f, n) { if (tt >= f.da - 0.05) i = n; });
        frasi.forEach(function (f) { f.classList.toggle('in-corso', parseInt(f.getAttribute('data-frase'), 10) === i + 1); });
        pos.textContent = 'frase ' + (i + 1) + ' di ' + dati.frasi.length + ' · ' + tt.toFixed(1).replace('.', ',') + ' s / ' + durata.toFixed(1).replace('.', ',') + ' s';
      }
      function ciclo(ora) {
        var tt = fermato + verso * (ora - inizio) / 1000;
        if (tt < 0 || tt > durata) { alt(); return; }
        disegna(tt); raf = requestAnimationFrame(ciclo);
      }
      function alt() { cancelAnimationFrame(raf); barre.forEach(function (b) { b.style.removeProperty('--h'); }); frasi.forEach(function (f) { f.classList.remove('in-corso'); }); pos.textContent = 'fermo'; fermato = 0; verso = 1; }
      avvia.addEventListener('click', function () { cancelAnimationFrame(raf); fermato = 0; verso = 1; inizio = performance.now(); raf = requestAnimationFrame(ciclo); });
      ferma.addEventListener('click', alt);
      if (inverti) { inverti.hidden = false; inverti.addEventListener('click', function () { var tt = fermato + verso * (performance.now() - inizio) / 1000; fermato = Math.max(0, Math.min(durata, tt)); verso = -verso; inizio = performance.now(); }); }
      pos.textContent = 'fermo';
    });
  }

  /* Apertura di un dettaglio dal pulsante: mostra la dissolvenza di 120 ms, o il cambio istantaneo con il movimento ridotto */
  qsa('[data-sim-dettagli]').forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () { var d = qs('#' + b.getAttribute('data-sim-dettagli')); if (d) d.open = !d.open; });
  });
}());
