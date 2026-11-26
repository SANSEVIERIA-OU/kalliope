/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Un frammento copiato conserva gli indirizzi del documento da cui viene, anche dopo cloneNode.
(() => {
  'use strict';
  const daTesto = (testo, indirizzo) => {
    const doc = new DOMParser().parseFromString(testo, 'text/html');
    const fonte = new URL(indirizzo, location.href);
    const base = new URL(doc.querySelector('base[href]')?.getAttribute('href') || '.', fonte);
    doc.querySelectorAll('a[href]').forEach(link => {
      link.setAttribute('href', new URL(link.getAttribute('href'), base).href);
    });
    return doc;
  };
  const leggi = async indirizzo => {
    const risposta = await fetch(indirizzo);
    if (!risposta.ok) throw new Error(`${indirizzo}: ${risposta.status}`);
    return daTesto(await risposta.text(), risposta.url);
  };
  window.CatalogoDocumenti = {daTesto, leggi};
})();
