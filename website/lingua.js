/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// La scelta della lingua del sito (docs/translating.md). Senza script i collegamenti alle lingue bastano; con lo script:
//  · nella pagina di scelta (`<html data-lingue="it en …">`, l'indirizzo principale) la lingua del browser sta per prima, nell'ordine
//    di navigator.languages; nessuno spostamento a indovinare la lingua;
//  · scegliere una lingua, nella pagina di scelta o con l'elenco delle lingue di una pagina, la ricorda in questo browser
//    (localStorage, nessun cookie; non lascia il computer);
//  · alla visita dopo la pagina di scelta porta alla lingua scelta, subito, prima di disegnarsi. `?lingue` sull'indirizzo la
//    mostra comunque, per cambiare; tornando indietro dalla pagina di una lingua, o ricaricando, la scelta resta;
//  · la scelta nella barra delle pagine (un <details>) si chiude anche con Esc (soltanto lei, non il menu che la contiene), con un clic fuori e quando
//    il fuoco esce.
(() => {
  'use strict';
  const CHIAVE = 'kalliope.lingua';
  const leggi = () => { try { return localStorage.getItem(CHIAVE); } catch { return null; } };
  const scrivi = v => { try { localStorage.setItem(CHIAVE, v); } catch { /* il browser non lascia ricordare: resta il collegamento */ } };
  const elenco = (document.documentElement.getAttribute('data-lingue') || '').split(/\s+/).filter(Boolean);
  if (elenco.length) {   // la pagina di scelta
    const scelta = leggi();
    // «Indietro» dalla pagina di una lingua torna alla scelta, e una ricarica la lascia: chi è qui lo ha voluto (altrimenti, con la scelta ricordata, «/»
    // lo rimanderebbe avanti ogni volta e «Indietro» non porterebbe mai fuori dalla lingua)
    const tipo = ((performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {}).type;
    if (scelta && elenco.includes(scelta) && tipo !== 'back_forward' && tipo !== 'reload' && !/[?&]lingue(?:[&=]|$)/.test(location.search)) { location.replace(`${scelta}/`); return; }
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
    // Esc chiude lo strato che sta sopra: l'elenco. Dentro il menu del telefono il menu resta (un secondo Esc lo chiude), come un pannello dentro
    // un altro; prima chiudeva insieme l'elenco e il menu, e il fuoco saltava su «Menu» (il gestore del menu sta su window, questo su document)
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const aperte = scelte.filter(d => d.open);
      if (!aperte.length) return;
      aperte.forEach(d => chiudi(d, d.contains(document.activeElement)));
      e.stopPropagation();
    });
    // dentro il menu che scorre (telefono, schermi bassi, barra «raccolta») l'elenco si apre sotto il comando, spesso sotto il bordo del menu: a 844×390 non se ne
    // vedeva una riga, e chi toccava il comando non vedeva succedere niente. Il menu scorre il minimo perché le prime due righe (quattro nomi) stiano in vista;
    // dove si vedono già (390×844) non si muove niente. «toggle» non risale: lo si ascolta in cattura.
    document.addEventListener('toggle', e => {
      const d = e.target;
      if (!d.matches || !d.matches('details.lingua-scelta') || !d.open) return;
      const menu = d.closest('.menu');
      if (!menu || menu.scrollHeight <= menu.clientHeight + 1) return;   // il menu non scorre: l'elenco è un pannello (computer)
      const voci = d.querySelectorAll('.lingue-elenco a');
      if (!voci.length) return;
      const voce = voci[Math.min(3, voci.length - 1)];
      // il posto della quarta voce dal layout (offsetTop), non da getBoundingClientRect: l'elenco nasce con una trasformazione (scala e spostamento) e a quel punto
      // la misura è di 9 px più in alto di dove starà
      let y = 0, n = voce;
      while (n && n !== menu) { y += n.offsetTop; n = n.offsetParent; }
      if (n !== menu) { voce.scrollIntoView({block: 'nearest'}); return; }
      const fondo = y + voce.offsetHeight + 8;
      if (fondo > menu.scrollTop + menu.clientHeight) menu.scrollTop = fondo - menu.clientHeight;
    }, true);
    document.addEventListener('click', e => scelte.forEach(d => { if (!d.contains(e.target)) chiudi(d, false); }));
    document.addEventListener('focusin', e => scelte.forEach(d => { if (!d.contains(e.target)) chiudi(d, false); }));
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('[data-lingue="elenco"] a[hreflang]');
      if (a && a.getAttribute('data-lingua-codice')) scrivi(a.getAttribute('data-lingua-codice'));
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pronta); else pronta();
})();
