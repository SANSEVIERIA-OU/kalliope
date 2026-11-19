/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Il marchio della barra · direzione 3 «La frase che si accende». scena.js lo chiama quando la home scrive e quando la sua voce
// parla: mentre si scrive le parole del disegno si spengono (non sono ancora dette), mentre la voce parla si accendono nella
// stessa proporzione delle parole della bolla, e il bordo segue l'inviluppo. Finita la frase il disegno torna com'è.
// Con «riduci movimento» resta fermo.
(() => {
  'use strict';
  const m = document.querySelector('.barra .marchio');
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!m || ridotto) return;
  const parole = [...m.querySelectorAll('.m-parola')];
  const riposo = parole.map(p => p.classList.contains('m-attesa'));
  const accese = k => parole.forEach((p, i) => p.classList.toggle('m-attesa', i >= k));
  window.Marchio = {
    scrive(si) { if (si) accese(0); },
    inizia() { m.classList.add('m-parla'); accese(0); },
    env(e) { m.style.setProperty('--m-env', Math.min(1, e * 0.9).toFixed(3)); },
    onda() {},
    parole(f) { accese(Math.round(f * parole.length)); },
    finisce() {
      m.classList.remove('m-parla'); m.style.removeProperty('--m-env'); accese(parole.length);
      setTimeout(() => parole.forEach((p, i) => p.classList.toggle('m-attesa', riposo[i])), 1400);
    },
  };
})();
