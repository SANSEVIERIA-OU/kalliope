/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il segno del marchio che vive con la voce (incarico L-3, 19/11/2026): «La frase che si accende».
//
// Il segno è la bolla della frase detta a metà: piena dove è detta, solo contorno tratteggiato dove non lo è ancora. Il confine fra le due parti è
// il fronte della voce (le due forme `.m-fronte`, che ritagliano la parte piena e quella tratteggiata). Questo script lo sposta.
//
// Chi ha una voce (oggi la home, scena.js) lo dice con un evento sul documento, senza sapere che il segno esiste:
//
//     document.dispatchEvent(new CustomEvent('kalliope:voce', {detail: {stato, frazione}}))
//
//   stato 'parla'      la voce sta dicendo la frase: `frazione` (da 0 a 1) è quanta ne ha detta, in parole, come la bolla vera; il fronte la segue.
//                      Con l'ultima parola (frazione 1) la frase è detta: la bolla resta tutta piena un momento, poi torna a riposo, anche se la voce
//                      ha ancora un respiro prima di finire
//   stato 'finita'     la voce ha finito: come l'ultima parola, se la frase non era già detta del tutto
//   stato 'interrotta' la voce si è fermata prima della fine: il segno torna a riposo
//
// A riposo il fronte sta dove lo disegna il segno (detto a metà, la forma dei menu e della scheda): non è mai una bolla vuota, nemmeno quando la
// frase comincia (parte dal riposo e arriva al pieno), e dopo la fine torna a riposo in un tempo fisso. Al passaggio del puntatore e al fuoco il
// fronte fa lo stesso gesto di una frase detta in un attimo. Con «riduci movimento» e senza script il segno sta fermo, a riposo.
// I tempi e le posizioni sono i token --segno-* (token.css); la curva del ritorno è --curva-dolce-doppia.
//
// Altre superfici: `Marchio.crea(svg, zona, {ridotto})` dà lo stesso comando a qualunque segno (`ridotto`: una funzione che dice se muoversi o no; senza, vale la preferenza del sistema) (il catalogo ne mostra più d'uno); `Marchio.clona(svg)` ne copia uno
// con identificatori nuovi (i ritagli si chiamano per identificatore: due copie nella stessa pagina si muoverebbero insieme).
(() => {
  'use strict';
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)');
  let T = null;   // i token, letti alla prima volta che servono (quando i fogli di stile ci sono)
  const curva = nome => {
    const parole = {ease: [0.25, 0.1, 0.25, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1]};
    const m = /cubic-bezier\(([^)]+)\)/.exec(nome);
    const p = parole[nome] || (m ? m[1].split(',').map(Number) : null);
    if (!p) return u => u;
    const [x1, y1, x2, y2] = p;
    const b = (t, a, c) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * c + t * t * t;
    return x => { let lo = 0, hi = 1, t = x; for (let i = 0; i < 24; i++) { if (b(t, x1, x2) < x) lo = t; else hi = t; t = (lo + hi) / 2; } return b(t, y1, y2); };
  };
  const token = () => {
    if (T) return T;
    const css = getComputedStyle(document.documentElement);
    const ms = n => { const v = css.getPropertyValue(n).trim(); return parseFloat(v) * (v.endsWith('ms') ? 1 : 1000); };
    return (T = {pieno: parseFloat(css.getPropertyValue('--segno-fronte-pieno')), inseguimento: ms('--segno-inseguimento'), sosta: ms('--segno-sosta'),
      ritorno: ms('--segno-ritorno'), curva: curva(css.getPropertyValue('--curva-dolce-doppia').trim())});
  };

  function crea(svg, zona, opzioni = {}) {
    const fronti = [...svg.querySelectorAll('.m-fronte')];
    if (!fronti.length) return null;
    const riduci = () => (opzioni.ridotto ? opzioni.ridotto() : ridotto.matches);   // il catalogo ne mostra la variante senza cambiare le preferenze del sistema
    let x = 0, mira = 0, raf = 0, ultimo = 0, timer = 0, inParla = false, tween = false, detta = false;
    const metti = v => { x = v; fronti.forEach(f => f.setAttribute('transform', `translate(${v.toFixed(2)} 0)`)); };
    const ferma = () => { cancelAnimationFrame(raf); raf = 0; tween = false; };
    // il fronte insegue la sua meta con una costante di tempo: segue le parole senza scatti (e una meta che si muove a ogni fotogramma non ricomincia nulla)
    const passo = ora => {
      const k = 1 - Math.exp(-(ora - ultimo) / token().inseguimento);
      ultimo = ora; metti(x + (mira - x) * k);
      if (Math.abs(mira - x) > 0.2) raf = requestAnimationFrame(passo); else { metti(mira); raf = 0; }
    };
    const verso = v => { mira = v; if (tween) ferma(); if (!raf) { ultimo = performance.now(); raf = requestAnimationFrame(passo); } };
    // il ritorno a riposo: un tempo fisso e una curva, non un avvicinarsi senza fine (a riposo ci arriva davvero)
    const ritorna = () => {
      ferma(); if (Math.abs(x) < 0.01) { metti(0); return; }
      const da = x, t0 = performance.now(), {ritorno, curva: c} = token();
      tween = true;
      const vai = ora => { const u = Math.min(1, (ora - t0) / ritorno); metti(da * (1 - c(u))); if (u < 1) raf = requestAnimationFrame(vai); else { raf = 0; tween = false; metti(0); } };
      raf = requestAnimationFrame(vai);
    };
    // una frase detta fino in fondo (o il gesto del puntatore): tutta piena, ferma un momento, poi a riposo
    const compie = () => { inParla = false; detta = true; clearTimeout(timer); verso(token().pieno); timer = setTimeout(ritorna, token().sosta); };
    const comando = {
      voce({stato, frazione}) {
        if (riduci()) return;
        const f = Math.max(0, Math.min(1, frazione || 0));
        if (stato === 'parla') {
          if (detta) { if (f < 1) detta = false; else return; }   // la frase è già detta (e il segno torna a riposo): la voce che dice ancora «1» fino alla fine non lo ricomincia; una frase nuova sì
          inParla = true; clearTimeout(timer); verso(token().pieno * f);
          if (f >= 1) compie();
        } else if (stato === 'finita') { if (!detta) compie(); detta = false; }
        else { inParla = false; detta = false; clearTimeout(timer); ritorna(); }
      },
      gesto() { if (!inParla && !riduci()) compie(); },
      riposo() { clearTimeout(timer); ferma(); inParla = false; detta = false; metti(0); },
      posizione: () => x,
    };
    ridotto.addEventListener('change', () => { if (riduci()) comando.riposo(); });
    if (zona) { zona.addEventListener('pointerenter', comando.gesto); zona.addEventListener('focus', comando.gesto); }
    return comando;
  }

  let n = 0;
  function clona(svg) {
    const copia = svg.cloneNode(true), k = ++n;
    const nomi = new Map([...copia.querySelectorAll('[id]')].map(e => [e.id, `${e.id}-${k}`]));
    copia.querySelectorAll('[id]').forEach(e => { e.id = nomi.get(e.id); });
    copia.querySelectorAll('[clip-path]').forEach(e => e.setAttribute('clip-path', e.getAttribute('clip-path').replace(/#([\w-]+)/, (_, id) => `#${nomi.get(id) || id}`)));
    return copia;
  }

  window.Marchio = {crea, clona};
  const segno = document.querySelector('.barra .m-segno');
  if (segno) {
    const m = crea(segno, segno.closest('.marchio'));
    if (m) { window.Marchio.barra = m; document.addEventListener('kalliope:voce', e => m.voce(e.detail || {})); }
  }
})();
