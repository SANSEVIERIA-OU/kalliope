/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Ciò che i componenti del design system devono misurare, in ogni pagina che li usa (la home e le pagine interne): il testo di
// una traduzione può essere molto più lungo dell'italiano, e un foglio di stile non sa quanto spazio prende. Tre misure:
//  · la barra (design-system/componenti/barra.css): se le voci del menu non ci stanno, o non ci stanno insieme all'azione nemmeno
//    senza la parola del marchio, la barra è «raccolta» (la forma del tablet: «Menu» al posto delle voci), a ogni punto della pagina;
//    se ci stanno solo senza la parola, la barra è «stretta» (la parola sparisce quando l'azione entra). Al telefono e sul tablet
//    l'azione ha lo spazio fra il marchio e «Menu», e se non ci sta va su due righe («azione-a-capo»);
//  · l'etichetta di «Tu» nei riquadri (riunione.css): se la parte lunga non sta in una riga, resta «Tu» («nome-corto»);
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
        const fineMarchio = parolaVisibile ? marchioPieno : largoIcona;
        const spazio = barra.clientWidth - px(getComputedStyle(azione).insetInlineEnd) - px(cs.paddingInlineStart) - fineMarchio - distanza;
        barra.style.setProperty('--azione-largo-massimo', `${Math.max(0, Math.floor(spazio))}px`);
        barra.classList.toggle('azione-a-capo', azione.offsetWidth > spazio);   // va a capo soltanto se non ci sta
      }
    }
  }

  // ---------- l'etichetta di «Tu» ----------
  const etichette = $$('.riquadro.tu .nome');
  function misuraEtichette() {
    for (const n of etichette) {
      const r = n.closest('.riquadro'), prima = n.style.whiteSpace;
      r.classList.remove('nome-corto'); n.style.whiteSpace = 'nowrap';
      const testo = document.createRange(); testo.selectNodeContents(n);   // la larghezza del testo in una riga (scrollWidth non vede ciò che esce a sinistra, da destra a sinistra)
      const pad = px(getComputedStyle(n).paddingInlineStart) + px(getComputedStyle(n).paddingInlineEnd);
      const troppo = testo.getBoundingClientRect().width > n.clientWidth - pad + 1;
      n.style.whiteSpace = prima; r.classList.toggle('nome-corto', troppo);
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

  function misura() { misuraBarra(); misuraEtichette(); misuraCollegamenti(); misuraPillole(); }
  misura();
  if (document.fonts) document.fonts.ready.then(misura);
  addEventListener('resize', misura);
  // un'etichetta che cambia (la parte lunga che compare in una scena) si rimisura
  if (window.ResizeObserver) { const ro = new ResizeObserver(() => misuraEtichette()); etichette.forEach(n => { ro.observe(n.closest('.riquadro')); ro.observe(n); }); }
  window.Componenti = {misura};
})();
