/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
(() => {
  'use strict';

  const sezione = document.querySelector('#pagina-aiuto');
  sezione.innerHTML = `
    <h2>Aiuto · la frase porta al prossimo passo</h2>
    <p class="cat-nota">Ricerca nativa, messaggio con significato e azione, copia con esito,
      indice e dettagli a richiesta. La pagina conserva i casi senza una frase e la segnalazione
      anche quando la ricerca non trova nulla. Senza JavaScript tutte le risposte sono visibili;
      ricerca e copia non si presentano come comandi funzionanti.</p>
    <p><a href="../../it/riunione/#aiuto">Apri Aiuto</a> ·
      <a href="../../404.html">Apri la pagina non trovata</a></p>`;

  const controlli = document.createElement('div');
  controlli.className = 'cat-controlli';
  const anteprima = document.createElement('iframe');
  anteprima.title = 'Aiuto di Kalliope: ricerca e risposte';
  anteprima.src = '../../it/riunione/';
  anteprima.className = 'catalogo-riunione-viva';
  anteprima.loading = 'lazy';

  // scrollIntoView attraversa anche gli iframe e può spostare il catalogo.
  // Qui si muove soltanto la finestra interna, con coordinate del suo documento.
  function mostraDentro(selettore) {
    const finestra = anteprima.contentWindow;
    const elemento = anteprima.contentDocument.querySelector(selettore);
    if (!elemento) return;
    const barra = anteprima.contentDocument.querySelector('.barra');
    const margine = barra ? barra.getBoundingClientRect().height : 0;
    const posizione = elemento.getBoundingClientRect().top + finestra.scrollY - margine;
    finestra.scrollTo({top: posizione, behavior: 'instant'});
  }

  anteprima.addEventListener('load', async () => {
    await anteprima.contentDocument.fonts.ready;
    mostraDentro('#aiuto');
  });

  const esempi = [
    ['Tutte le frasi', ''],
    ['Una frase', 'caricamento'],
    ['Nessun risultato', 'qwertyxyz'],
  ];
  for (const [etichetta, ricerca] of esempi) {
    const pulsante = document.createElement('button');
    pulsante.type = 'button';
    pulsante.textContent = etichetta;
    pulsante.addEventListener('click', () => {
      const campo = anteprima.contentDocument.querySelector('#cerca-frase');
      if (!campo) return;
      campo.value = ricerca;
      campo.dispatchEvent(new anteprima.contentWindow.Event('input', {bubbles: true}));
      mostraDentro('#cerca-frase');
    });
    controlli.append(pulsante);
  }

  sezione.append(controlli, anteprima);

})();
