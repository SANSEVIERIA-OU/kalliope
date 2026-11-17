/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// La scelta della lingua del sito (docs/translating.md). Senza script i collegamenti alle lingue bastano; con lo script:
//  · nella pagina di scelta (`<html data-lingue="it en …">`, l'indirizzo principale) la lingua del browser sta per prima, nell'ordine
//    di navigator.languages; nessuno spostamento a indovinare la lingua;
//  · scegliere una lingua, nella pagina di scelta o con l'elenco delle lingue di una pagina, la ricorda in questo browser
//    (localStorage, nessun cookie; non lascia il computer);
//  · alla visita dopo la pagina di scelta porta alla lingua scelta, subito, prima di disegnarsi. `?lingue` sull'indirizzo la
//    mostra comunque, per cambiare;
//  · la scelta nella barra delle pagine (un <details>) si chiude anche con Esc, con un clic fuori e quando il fuoco esce.
(() => {
  'use strict';
  const CHIAVE = 'kalliope.lingua';
  const leggi = () => { try { return localStorage.getItem(CHIAVE); } catch { return null; } };
  const scrivi = v => { try { localStorage.setItem(CHIAVE, v); } catch { /* il browser non lascia ricordare: resta il collegamento */ } };
  const elenco = (document.documentElement.getAttribute('data-lingue') || '').split(/\s+/).filter(Boolean);
  if (elenco.length) {   // la pagina di scelta
    const scelta = leggi();
    if (scelta && elenco.includes(scelta) && !/[?&]lingue(?:[&=]|$)/.test(location.search)) { location.replace(`${scelta}/`); return; }
  }
  const pronta = () => {
    const ul = document.querySelector('[data-lingue="elenco"]');
    if (ul && elenco.length) {
      const preferite = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean)
        .map(l => l.toLowerCase().split('-')[0]);
      const voci = [...ul.children], per = l => voci.find(li => (li.querySelector('a[hreflang]').getAttribute('hreflang') || '').toLowerCase().split('-')[0] === l);
      [...new Set(preferite)].reverse().forEach(l => { const li = per(l); if (li) ul.prepend(li); });
      // la prima lingua del browser che il sito ha è accesa; i nomi si accendono in quest'ordine (design-system/componenti/lingue.css)
      const prima = [...new Set(preferite)].map(per).find(Boolean);
      if (prima) prima.classList.add('preferita');
      [...ul.children].forEach((li, i) => li.style.setProperty('--i', String(i)));
      // nella riunione della pagina della scelta, quando i nomi cominciano ad accendersi, Paola, Luca e Anna si girano verso «Tu»
      // (lo stesso sguardo della home: riunione.css, .guarda); il momento è quello dei nomi (--ritardo-scelta-nomi, token.css)
      const persone = document.querySelectorAll('.scelta-tavolo .persona');
      if (persone.length) {
        const fermo = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ritardo = fermo ? 0 : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ritardo-scelta-nomi')) || 0;
        setTimeout(() => persone.forEach(x => x.classList.add('guarda')), ritardo);
      }
    }
    // la scelta nella barra (<details class="lingua-scelta">): senza script si apre e si chiude dal suo nome; con lo script si chiude
    // anche con Esc (il fuoco torna sul nome), con un clic fuori e quando il fuoco esce
    const scelte = [...document.querySelectorAll('details.lingua-scelta')];
    const chiudi = (d, fuoco) => { if (d.open) { d.open = false; if (fuoco) d.querySelector('summary').focus(); } };
    document.addEventListener('keydown', e => { if (e.key === 'Escape') scelte.forEach(d => { if (d.open && d.contains(document.activeElement)) chiudi(d, true); else chiudi(d, false); }); });
    document.addEventListener('click', e => scelte.forEach(d => { if (!d.contains(e.target)) chiudi(d, false); }));
    document.addEventListener('focusin', e => scelte.forEach(d => { if (!d.contains(e.target)) chiudi(d, false); }));
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('[data-lingue="elenco"] a[hreflang]');
      if (a && a.getAttribute('data-lingua-codice')) scrivi(a.getAttribute('data-lingua-codice'));
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pronta); else pronta();
})();
