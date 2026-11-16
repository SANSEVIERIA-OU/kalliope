/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// La scelta della lingua del sito (docs/translating.md). Senza script i collegamenti alle lingue bastano; con lo script:
//  · nella pagina di scelta (`<html data-lingue="it en …">`, l'indirizzo principale) la lingua del browser sta per prima, nell'ordine
//    di navigator.languages; nessuno spostamento a indovinare la lingua;
//  · scegliere una lingua, nella pagina di scelta o con l'elenco delle lingue di una pagina, la ricorda in questo browser
//    (localStorage, nessun cookie; non lascia il computer);
//  · alla visita dopo la pagina di scelta porta alla lingua scelta, subito, prima di disegnarsi. `?lingue` sull'indirizzo la
//    mostra comunque, per cambiare.
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
    }
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('[data-lingue="elenco"] a[hreflang]');
      if (a && a.getAttribute('data-lingua-codice')) scrivi(a.getAttribute('data-lingua-codice'));
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pronta); else pronta();
})();
