/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// La cornice delle pagine interne nella direzione 2 (design-system/componenti/pagina.css): ciò che la home fa con scena.js
// e ogni pagina interna ripete. La barra resta in alto e diventa piena appena si scorre; al telefono «Menu» apre le sezioni;
// un tratto «entra» quando arriva sullo schermo (classe «visto», e l'evento «rivelato» per lo script della pagina); il fuoco
// che arriva in un tratto lo mostra subito, tutto; al telefono l'ordine del fuoco segue quello che si vede.
// Nessun testo qui: i testi stanno nella pagina. Senza questo script la pagina è intera (barra piena, menu che porta al piede).
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const telefono = matchMedia('(max-width: 760px)');

  // ---------- la barra: piena appena si scorre; dopo un salto (un'ancora, il fuoco) subito, senza dissolvenza ----------
  const barra = $('.barra');
  let chiesta = false, y0 = scrollY;
  function sullaBarra() {
    chiesta = false;
    const salto = Math.abs(scrollY - y0) > 48, compatta = scrollY > 12; y0 = scrollY;
    if (salto && compatta !== barra.classList.contains('compatta')) {
      barra.style.transition = 'none'; barra.classList.toggle('compatta', compatta); void barra.offsetWidth; barra.style.transition = '';
    } else barra.classList.toggle('compatta', compatta);
  }
  if (barra) {
    addEventListener('scroll', () => { if (!chiesta) { chiesta = true; requestAnimationFrame(sullaBarra); } }, {passive: true});
    sullaBarra();
  }

  // ---------- il menu al telefono e sulle finestre strette (come nella home) ----------
  const pm = $('.pulsante-menu'), menu = $('#menu'), stretto = matchMedia('(max-width: 959px)');
  if (pm && menu) {
    pm.setAttribute('role', 'button'); pm.setAttribute('aria-expanded', 'false');
    const chiudiMenu = fuoco => { menu.classList.remove('aperto'); pm.setAttribute('aria-expanded', 'false'); if (fuoco) pm.focus(); };
    pm.addEventListener('click', e => {
      if (getComputedStyle(pm).display === 'none') return;
      e.preventDefault();
      const su = !menu.classList.contains('aperto');
      menu.classList.toggle('aperto', su); pm.setAttribute('aria-expanded', String(su));
      if (su) $('a', menu).focus();
    });
    addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('aperto')) chiudiMenu(true); });
    document.addEventListener('click', e => { if (menu.classList.contains('aperto') && !menu.contains(e.target) && !pm.contains(e.target)) chiudiMenu(false); });
    document.addEventListener('focusin', e => { if (menu.classList.contains('aperto') && !menu.contains(e.target) && e.target !== pm) chiudiMenu(false); });
    stretto.addEventListener('change', () => chiudiMenu(false));
  }

  // ---------- al telefono il fuoco va nell'ordine in cui si vede: prima la riunione, poi i comandi e lo stato ----------
  // Nelle pagine interne (.scena-pagina) vale la regola della cornice: sui telefoni bassi (sotto i 760 px) vince il comando,
  // che resta subito dopo la frase (pagina.css); lo script sposta i comandi dopo la riunione solo sui telefoni alti.
  const palco = $('.scena .palco'), comandi = $('#comandi-apertura'), stato = $('.apertura .stato'), presentazione = $('.apertura .presentazione');
  const pagina = !!$('.scena-pagina'), dopoLaScena = matchMedia(pagina ? '(max-width: 760px) and (min-height: 760px)' : '(max-width: 760px)');
  let sotto = false;
  function ordine() {
    // Installa: la distribuzione e il file precedono sempre la dimostrazione, anche sul telefono alto.
    // Il DOM sorgente contiene già scelta, comandi e stato in questo ordine; resta invariato anche al resize.
    if (palco && palco.closest("[data-comandi-prima]")) return;
    if (!palco || !comandi || dopoLaScena.matches === sotto) return;
    sotto = dopoLaScena.matches;
    if (document.readyState === 'complete') [comandi, ...comandi.children, stato].forEach(e => e && e.classList.add('senza-arrivo'));
    if (sotto) palco.after(comandi, ...(stato ? [stato] : [])); else presentazione.after(comandi, ...(stato ? [stato] : []));
  }
  ordine(); dopoLaScena.addEventListener('change', ordine);

  // ---------- un tratto entra quando ne è visibile il 15% (o quanto lo schermo può mostrarne) ----------
  const fatti = new WeakSet();
  function rivela(el) {
    el.classList.add('visto');
    if (fatti.has(el)) return; fatti.add(el);
    el.dispatchEvent(new CustomEvent('rivelato', {bubbles: true}));
  }
  const tratti = $$('.tratto');
  tratti.forEach(t => $$('.entra', t).forEach((el, i) => el.style.setProperty('--ritardo', `${i * 90}ms`)));
  document.addEventListener('focusin', e => {
    if (!e.target.closest) return;
    const tratto = e.target.closest('.tratto');
    if (!tratto) return;
    $$('.entra:not(.visto)', tratto).forEach(el => { el.classList.add('subito'); rivela(el); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('subito'))); });
  });
  if ('IntersectionObserver' in window) {
    const vedi = new IntersectionObserver(voci => voci.forEach(v => {
      if (!v.isIntersecting) return;
      const alto = Math.max(1, v.boundingClientRect.height), spazio = v.rootBounds ? v.rootBounds.height : innerHeight;
      if (v.intersectionRatio < Math.min(0.15, 0.85 * spazio / alto)) return;
      vedi.unobserve(v.target); rivela(v.target);
    }), {threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3], rootMargin: '0px 0px -6% 0px'});
    $$('.entra').forEach(el => vedi.observe(el));
  } else $$('.entra').forEach(rivela);

  // lo script di una pagina può rivelare un tratto quando serve (chi preme prima che sia entrato)
  window.Cornice = {telefono, rivela};
})();
