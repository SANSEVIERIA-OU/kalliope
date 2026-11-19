/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il marchio della barra · direzione 3 «La frase che si accende» (corretto dopo il giudizio del 19/11/2026). scena.js lo chiama
// quando la home scrive e quando la sua voce parla: mentre si scrive la bolla si svuota e resta il contorno tratteggiato (niente è ancora detto), mentre la voce
// parla il fronte della voce avanza nella stessa proporzione delle parole già dette della bolla vera; finita la frase la bolla
// resta piena un momento e torna a metà frase, com'è il disegno. Al passaggio del puntatore il fronte va in fondo e torna.
// Con «riduci movimento» resta fermo. Tempi e posizioni dai token (--d3-…).
(() => {
  'use strict';
  const m = document.querySelector('.barra .marchio');
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!m || ridotto) return;
  const fronti = [...m.querySelectorAll('.m-fronte')];
  if (!fronti.length) return;
  const css = getComputedStyle(document.documentElement), tok = n => css.getPropertyValue(n).trim();
  const ms = n => { const v = tok(n); return parseFloat(v) * (v.endsWith('ms') ? 1 : 1000); };
  const inizio = +tok('--d3-fronte-inizio'), fine = +tok('--d3-fronte-fine');
  let ora = 0, meta = 0, raf = 0, ritorno = 0, parla = false;
  const metti = x => { ora = x; fronti.forEach(f => f.setAttribute('transform', `translate(${x.toFixed(2)} 0)`)); };
  // il fronte insegue la sua meta con una costante di tempo: segue le parole senza scatti
  const vai = (x, durata = ms('--d3-fronte-inseguimento')) => {
    meta = x; cancelAnimationFrame(raf);
    let prima = performance.now();
    const passo = t => { const k = 1 - Math.exp(-(t - prima) / durata); prima = t; metti(ora + (meta - ora) * k); if (Math.abs(meta - ora) > 0.2) raf = requestAnimationFrame(passo); else metti(meta); };
    raf = requestAnimationFrame(passo);
  };
  const frazione = f => inizio + (fine - inizio) * Math.max(0, Math.min(1, f));
  window.Marchio = {
    scrive(si) { if (si && meta !== inizio) { clearTimeout(ritorno); vai(inizio); } },
    inizia() { parla = true; clearTimeout(ritorno); vai(inizio); },
    env() {},
    onda() {},
    parole(f) { if (parla) vai(frazione(f)); },
    finisce() { parla = false; vai(fine); clearTimeout(ritorno); ritorno = setTimeout(() => vai(0, ms('--d3-ritorno') / 3), ms('--d3-ritorno')); },
  };
  const sopra = () => { if (parla) return; vai(fine, ms('--d3-passaggio') / 4); clearTimeout(ritorno); ritorno = setTimeout(() => vai(0, ms('--d3-passaggio') / 3), ms('--d3-passaggio')); };
  m.addEventListener('pointerenter', sopra);
  m.addEventListener('focus', sopra);
})();
