/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Ciò che i componenti del design system devono misurare, in ogni pagina che li usa (la home e le pagine interne): il testo di
// una traduzione può essere molto più lungo dell'italiano, e un foglio di stile non sa quanto spazio prende. Cinque misure:
//  · la barra (design-system/componenti/barra.css): se le voci del menu non ci stanno, o non ci stanno insieme all'azione nemmeno
//    senza la parola del marchio, la barra è «raccolta» (la forma del tablet: «Menu» al posto delle voci), a ogni punto della pagina;
//    se ci stanno solo senza la parola, la barra è «stretta» (la parola sparisce quando l'azione entra). Al telefono e sul tablet
//    l'azione ha lo spazio fra il marchio e «Menu», e se non ci sta va su due righe («azione-a-capo»);
//  · l'etichetta di «Tu» nei riquadri (riunione.css): se la parte lunga non sta in una riga, resta «Tu» («nome-corto»);
//  · le barre della voce di «Tu» (riunione.css): se l'etichetta le toccherebbe, si rimpiccioliscono attorno al loro centro (--barre-scala);
//  · i collegamenti con la freccia (pulsanti.css): se il testo va a capo, la freccia segue l'ultima parola («a-capo»);
//  · le pillole (pulsanti.css): se il testo non ci sta nella larghezza che hanno, va a capo dentro il loro fondo («a-capo»).
// In italiano niente cambia: sono stati misurati, e ci stanno. Senza script la pagina resta com'è (barra intera, etichette intere).
// Correzione dopo il giudizio dell'incarico 2 (B1, I2, M2), 17/11/2026: prima stava in scena.js e non arrivava alle pagine interne.
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const px = v => parseFloat(v) || 0;

  // ---------- la barra ----------
  const barra = $('.barra'), menu = barra && $('.menu', barra), marchio = barra && $('.marchio', barra);
  const parola = marchio && $('span', marchio), icona = marchio && $('svg', marchio);
  const azione = barra && $('.barra-azione', barra), bottone = barra && $('.pulsante-menu', barra);
  let marchioPieno = 0;
  // le righe di testo di un elemento (i nodi di testo: un'icona o un tondo accanto non sono righe)
  function righeDi(el) {
    const corpo = parseFloat(getComputedStyle(el).fontSize) || 16, linee = new Set();
    for (const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); w.nextNode();) {
      if (!w.currentNode.textContent.trim()) continue;
      const r = document.createRange(); r.selectNodeContents(w.currentNode);
      for (const q of r.getClientRects()) if (q.width > 1) linee.add(Math.round(q.top / (corpo * 0.6)));
    }
    return linee.size;
  }
  function misuraBarra() {
    if (!barra || !menu || !marchio) return;
    barra.classList.remove('raccolta', 'azione-a-capo');
    const cs = getComputedStyle(barra), distanza = px(cs.columnGap);
    const posto = azione ? azione.offsetWidth + 16 : 0;
    if (azione) barra.style.setProperty('--posto-azione', `${posto}px`);
    // il marchio intero (anche quando la parola è già nascosta, con l'azione in barra)
    if (!barra.classList.contains('con-azione') || !marchioPieno) marchioPieno = Math.max(marchioPieno, marchio.offsetWidth - (parola ? parola.offsetWidth - parola.scrollWidth : 0));
    const largoIcona = icona ? icona.getBoundingClientRect().width : 0;   // un svg non ha offsetWidth
    const voci = $('ul', menu), conMenu = menu.offsetWidth > 0 && voci;
    if (conMenu) {
      // lo spazio che avanza nella barra con il menu intero, dalle larghezze (non dalle posizioni: un menu troppo largo si stringerebbe)
      const interno = barra.clientWidth - px(cs.paddingInlineStart) - px(cs.paddingInlineEnd);
      const avanza = interno - marchioPieno - distanza - voci.scrollWidth;
      const senzaParola = avanza + marchioPieno - largoIcona;
      const raccolta = avanza < 0 || (azione && senzaParola < posto);
      barra.classList.toggle('raccolta', !!raccolta);
      barra.classList.toggle('stretta', !raccolta && !!azione && avanza < posto);
    } else barra.classList.remove('stretta');
    if (bottone && bottone.offsetWidth) {
      // «Menu» intero: in cima, con la parola del marchio lunga, la barra può stringerlo; con l'azione in barra la parola sparisce e lui
      // torna largo, e l'azione gli finiva sopra
      const restringe = bottone.style.flexShrink; bottone.style.flexShrink = '0';
      barra.style.setProperty('--largo-menu', `${bottone.offsetWidth}px`);
      bottone.style.flexShrink = restringe;
      if (azione) {
        // l'azione sta fra il marchio e «Menu»: non copre il disegno del marchio, né la parola dove resta
        // la parola resta quando l'azione è in barra, tranne al telefono stretto e nella barra «stretta» (barra.css). Dagli stati, non
        // dall'opacità di adesso: girando il telefono con la pagina scorsa la parola sta ancora riapparendo, e l'azione le finiva sopra
        const parolaVisibile = parola && !matchMedia('(max-width: 440px)').matches && !barra.classList.contains('stretta');
        const poni = conParola => {
          // il marchio com'è adesso (la parola c'è e non si muove: soltanto sotto 441 px e con «stretta» sparisce), non il più largo visto in passato: tra 441 e 959 px
          // è più piccolo che sul computer, e dalla misura del computer l'azione andava a capo di troppo (in urdu, a 450 px, su due righe più alte della barra)
          const spazio = barra.clientWidth - px(getComputedStyle(azione).insetInlineEnd) - px(cs.paddingInlineStart) - (conParola ? marchio.getBoundingClientRect().width : largoIcona) - distanza;
          barra.style.setProperty('--azione-largo-massimo', `${Math.max(0, Math.floor(spazio))}px`);
          barra.classList.toggle('azione-a-capo', azione.offsetWidth > spazio);   // va a capo soltanto se non ci sta
        };
        poni(parolaVisibile);
        // se a capo l'azione ha più di due righe (una lingua lunga, e un marchio lungo accanto: in en-XA a 441 px erano quattro, e uscivano dalla barra) la parola
        // del marchio sparisce intera, come sotto 441 px e sul computer, e l'azione prende il suo posto
        if (parolaVisibile && righeDi(azione) > 2) { barra.classList.add('stretta'); poni(false); }
      }
    }
  }

  // ---------- l'etichetta di «Tu» ----------
  const etichette = $$('.riquadro.tu .nome');
  function misuraEtichette() {
    for (const n of etichette) {
      const r = n.closest('.riquadro');
      r.classList.remove('nome-corto');
      // sta in una riga? Si contano le righe vere dell'etichetta, a capo compreso (come per l'azione della barra): la larghezza del testo contro quella del riquadro
      // si confrontava a meno di un pixel, e con un carattere di riserva più largo di quello del sito (se non arriva) l'etichetta andava su due righe sopra le
      // barre della voce senza che la misura lo vedesse (giudizio di «stato», M11). Righe e non larghezze: non dipendono da come si arrotonda né da una scala d'entrata
      r.classList.toggle('nome-corto', righeDi(n) > 1);
    }
  }

  // ---------- le barre di «Tu» e la sua etichetta ----------
  // L'etichetta sta in alto, dove comincia la riga; le barre della voce al centro del riquadro. Quando il riquadro è basso (844×390: la riunione della chiusura è alta
  // 51-88 px) o l'etichetta è larga o alta, si toccano. Prima le barre scendono (--barre-sposta, riunione.css) quanto basta per passare sotto l'etichetta, restando nel
  // riquadro con lo stesso margine che l'etichetta ha in alto; se non basta (il riquadro è troppo basso) si rimpiccioliscono attorno al loro centro (--barre-scala), fino a
  // --barre-scala-minima. Restano --barre-etichetta-distanza px, anche alla massima altezza che la voce dà a ciascuna barra. Si misura sulle posizioni del layout (offset*),
  // non sui rettangoli disegnati: mentre il riquadro entra, o una barra si muove con la voce, i rettangoli disegnati cambiano. Dove non si toccano non cambia nulla
  // (incarico 2-f, L2).
  const tavoliTu = $$('.tavolo .riquadro.tu');
  function misuraBarreTu() {
    const tok = n => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(n));
    const distanza = tok('--barre-etichetta-distanza'), minima = tok('--barre-scala-minima'), voce = tok('--barre-voce-scala-massima');
    const base = [1, 2, 3, 4, 5].map(k => (k === 3 ? 1 : tok(`--barre-${k}-scala-y`)) * voce);
    for (const r of tavoliTu) {
      const nome = $('.nome', r), barre = $('.barre', r);
      if (!nome || !barre || !nome.offsetWidth || !barre.offsetWidth) continue;
      barre.style.removeProperty('--barre-scala'); barre.style.removeProperty('--barre-sposta');
      const barra = $$('i', barre), cx = barre.offsetLeft, cy = barre.offsetTop, w0 = barre.offsetWidth, h0 = barre.offsetHeight, alto = Math.max(...base);
      const n = {l: nome.offsetLeft, r: nome.offsetLeft + nome.offsetWidth, t: nome.offsetTop, b: nome.offsetTop + nome.offsetHeight};
      const tocca = (s, giu) => barra.some((i, k) => {
        const dx = i.offsetLeft + i.offsetWidth / 2 - w0 / 2, mx = s * i.offsetWidth / 2, my = s * h0 * (base[k] || 1) / 2, y = cy + giu;
        return cx + s * dx + mx > n.l - distanza && cx + s * dx - mx < n.r + distanza && y + my > n.t - distanza && y - my < n.b + distanza;
      });
      if (!tocca(1, 0)) continue;
      for (let s = 1; s >= minima - 1e-9; s = Math.round((s - 0.02) * 100) / 100) {
        const piu = Math.floor(r.offsetHeight - nome.offsetTop - (cy + s * h0 * alto / 2));   // quanto possono scendere restando nel riquadro, con il margine dell'etichetta in alto
        for (let giu = 0; giu <= piu; giu++) if (!tocca(s, giu)) {
          if (s < 1) barre.style.setProperty('--barre-scala', String(s));
          if (giu) barre.style.setProperty('--barre-sposta', `${giu}px`);
          return void 0;
        }
      }
      barre.style.setProperty('--barre-scala', String(minima));   // nemmeno così: le più piccole possibili (resta un contatto che nessuna misura può togliere)
    }
  }

  // ---------- i collegamenti con la freccia ----------
  const collegamenti = $$('.collegamento');
  function misuraCollegamenti() {
    for (const a of collegamenti) {
      a.classList.remove('a-capo');
      const testo = document.createRange(); testo.selectNodeContents(a);
      const cime = [...testo.getClientRects()].filter(q => q.width > 1 && q.height > 1).map(q => q.top).sort((x, y) => x - y);
      a.classList.toggle('a-capo', cime.length > 1 && cime.at(-1) - cime[0] > px(getComputedStyle(a).fontSize) * 0.8);   // più di una riga
    }
  }

  // ---------- le pillole (pulsanti.css): se il testo non ci sta in una riga, va a capo dentro la pillola ----------
  const pillole = $$('.pillola:not(.barra-azione)');   // l'azione della barra ha la sua misura («azione-a-capo», qui sopra)
  function misuraPillole() {
    for (const q of pillole) {
      if (!q.offsetWidth) continue;
      q.classList.remove('a-capo');
      const testo = document.createRange(); testo.selectNodeContents(q);
      const cs = getComputedStyle(q), dentro = q.clientWidth - px(cs.paddingInlineStart) - px(cs.paddingInlineEnd);
      q.classList.toggle('a-capo', testo.getBoundingClientRect().width > dentro + 1);
    }
  }

  function misura() { misuraBarra(); misuraEtichette(); misuraBarreTu(); misuraCollegamenti(); misuraPillole(); }
  misura();
  if (document.fonts) document.fonts.ready.then(misura);
  addEventListener('resize', misura);
  // l'azione in barra entra scorrendo: la misura fatta mentre la pagina era in cima (o allo schermo di prima) può non valere più per com'è la barra quando l'azione
  // c'è. Con la pagina scorsa dopo aver cambiato la larghezza (la finestra che si stringe, il telefono che gira) in urdu l'azione restava su due righe, più alta della
  // barra, finché non si rimisurava a mano. Quando l'azione entra o esce si misura di nuovo (le classi che la misura scrive non rimettono in moto l'osservatore)
  if (barra && window.MutationObserver) {
    let c = barra.classList.contains('con-azione');
    new MutationObserver(() => { const ora = barra.classList.contains('con-azione'); if (ora !== c) { c = ora; requestAnimationFrame(misuraBarra); } }).observe(barra, {attributes: true, attributeFilter: ['class']});
  }
  // un'etichetta che cambia (la parte lunga che compare in una scena) si rimisura
  if (window.ResizeObserver) { const ro = new ResizeObserver(() => { misuraEtichette(); misuraBarreTu(); }); etichette.forEach(n => { ro.observe(n.closest('.riquadro')); ro.observe(n); }); }
  window.Componenti = {misura};
})();
