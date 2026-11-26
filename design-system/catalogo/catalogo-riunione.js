/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il catalogo legge la pagina vera: nessuna copia concorrente dei suoi componenti.
(async () => {
  'use strict';

  const indirizzoPagina = new URL('../../it/riunione/', location.href);
  const sezione = document.querySelector('#pagina-riunione');
  sezione.innerHTML = `
    <h2>I colori di «In riunione»</h2>
    <p class="cat-nota">Stanza grafite, voce e comandi menta. Paola, Luca e Anna hanno colori propri.
      Il logo scelto conserva i suoi colori. La geometria e i tempi della home restano quelli della
      direzione 2.</p>
    <p><a href="../../it/">Apri la home</a> ·
      <a href="../../it/riunione/">Apri la guida intera</a></p>`;

  const risposta = await fetch(indirizzoPagina);
  const pagina = new DOMParser().parseFromString(await risposta.text(), 'text/html');

  function aggiungiEsempio(titolo, selettore, prepara) {
    const scheda = document.createElement('article');
    scheda.className = 'cat-scheda';
    const intestazione = document.createElement('h3');
    intestazione.textContent = titolo;
    scheda.append(intestazione);

    const esemplare = pagina.querySelector(selettore).cloneNode(true);
    esemplare.querySelectorAll('[id]').forEach(elemento => elemento.removeAttribute('id'));
    esemplare.querySelectorAll('[src]').forEach(elemento => {
      elemento.src = new URL(elemento.getAttribute('src'), indirizzoPagina).href;
    });
    esemplare.querySelectorAll('a[href]').forEach(collegamento => {
      collegamento.href = new URL(collegamento.getAttribute('href'), indirizzoPagina).href;
    });
    if (prepara) prepara(esemplare);
    scheda.append(esemplare);
    sezione.append(scheda);
  }

  aggiungiEsempio('Scelta del microfono · controllo nativo', '.prova-microfono', esemplare => {
    esemplare.querySelector('select').id = 'catalogo-microfono';
    esemplare.querySelector('label').htmlFor = 'catalogo-microfono';
  });
  aggiungiEsempio(
    'Registrazione · riposo, ascolto, pausa e ricerca con i comandi del browser',
    '.campione-riunione'
  );
  aggiungiEsempio('Dettagli da terminale · chiusi e aperti', 'details.dettagli');
  aggiungiEsempio('Se un passo non riesce · risultato e recupero', '#passo-2 .se-non-va');

  const anteprima = document.createElement('iframe');
  anteprima.title = 'Guida completa «In riunione»';
  anteprima.src = indirizzoPagina;
  anteprima.loading = 'lazy';
  anteprima.className = 'catalogo-riunione-viva';
  sezione.append(anteprima);

})();
