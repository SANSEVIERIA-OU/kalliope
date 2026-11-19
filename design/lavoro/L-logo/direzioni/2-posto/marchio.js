/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il marchio della barra · direzione 2 «Il tuo posto, alla pari». scena.js lo chiama quando la voce della home parla: il tuo
// riquadro tiene il bordo di chi parla, che segue l'inviluppo, e a ogni picco i riquadri degli altri si accendono uno dopo
// l'altro, come i bordi dei riquadri della home quando l'anello di «Tu» li raggiunge. Con «riduci movimento» resta fermo. Tempi dai token.
(() => {
  'use strict';
  const m = document.querySelector('.barra .marchio');
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!m || ridotto) return;
  const css = getComputedStyle(document.documentElement), tok = n => css.getPropertyValue(n).trim();
  const ms = n => { const v = tok(n); return parseFloat(v) * (v.endsWith('ms') ? 1 : 1000); };
  const luci = [1, 2, 3].map(k => m.querySelector(`.m-luce-${k}`));
  window.Marchio = {
    scrive() {},
    inizia() { m.classList.add('m-parla'); },
    env(e) { m.style.setProperty('--m-env', Math.min(1, e * 1.2).toFixed(3)); },
    onda() {
      luci.forEach((l, k) => l.animate([{opacity: 0}, {opacity: tok('--d2-luce-forte'), offset: 0.3}, {opacity: 0}],
        {duration: ms('--d2-passo-durata'), delay: k * ms('--d2-passo-sfasamento'), easing: tok('--d2-curva-luce')}));
    },
    parole() {},
    finisce() { m.classList.remove('m-parla'); m.style.removeProperty('--m-env'); },
  };
})();
