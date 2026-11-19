/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il marchio della barra · direzione 1 «Il cursore che parla». scena.js lo chiama quando la home scrive e quando la sua voce
// parla: il cursore lampeggia mentre si scrive, le onde seguono la voce e a ogni picco ripartono dal cursore (crescono da più vicine al cursore), come gli anelli
// che partono da «Tu». Con «riduci movimento» il marchio resta fermo. I tempi vengono dai token (--d1-…).
(() => {
  'use strict';
  const m = document.querySelector('.barra .marchio');
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!m || ridotto) return;
  const css = getComputedStyle(document.documentElement), tok = n => css.getPropertyValue(n).trim();
  const ms = n => { const v = tok(n); return parseFloat(v) * (v.endsWith('ms') ? 1 : 1000); };
  const onde = [...m.querySelectorAll('.m-onda')];
  const stato = (...c) => { m.classList.remove('m-scrive', 'm-attende', 'm-parla'); m.classList.add(...c); };
  window.Marchio = {
    scrive(si) { if (si && !m.classList.contains('m-scrive')) stato('m-scrive', 'm-attende'); else if (!si) m.classList.remove('m-scrive'); },
    inizia() { stato('m-parla'); },
    env(e) { m.style.setProperty('--m-env', Math.min(1, e * 1.15).toFixed(3)); },
    onda() {
      onde.forEach((o, k) => o.animate([{transform: `scale(${tok('--d1-onda-partenza')})`}, {transform: 'scale(1)'}],
        {duration: ms('--d1-onda-durata'), delay: k * ms('--d1-onda-sfasamento'), easing: tok('--d1-curva-onda'), fill: 'backwards'}));
    },
    parole() {},
    finisce() { m.classList.remove('m-scrive', 'm-attende', 'm-parla'); m.style.removeProperty('--m-env'); },
  };
})();
