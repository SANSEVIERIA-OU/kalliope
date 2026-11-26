/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Ricerca e copia sono facoltative: contenuti e ancore funzionano anche senza JavaScript.
(() => {
  'use strict';

  const filtro = document.querySelector('[data-filtro]');
  const campo = filtro.querySelector('input');
  const stato = filtro.querySelector('[role=status]');
  const gruppo = document.querySelector('[data-gruppo-frasi]');
  const schede = [...gruppo.querySelectorAll('.scheda-frase')];
  const voci = [...gruppo.querySelectorAll('.indice-frasi li')];
  const indice = gruppo.querySelector('.aiuto-indice');

  function normalizza(testo) {
    return testo.toLocaleLowerCase(document.documentElement.lang)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[«»"'’.…:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const testi = schede.map(scheda => normalizza(scheda.textContent + ' ' + (scheda.dataset.parole || '')));

  function applicaFiltro() {
    const parole = normalizza(campo.value).split(' ').filter(Boolean);
    let trovate = 0;

    schede.forEach((scheda, posizione) => {
      const corrisponde = parole.every(parola => testi[posizione].includes(parola));
      scheda.hidden = !corrisponde;
      voci[posizione].hidden = !corrisponde;
      if (corrisponde) trovate++;
    });

    // La ricerca resta visibile anche senza risultati; scompare soltanto il loro indice.
    indice.hidden = parole.length > 0 && trovate === 0;
    if (parole.length === 0) {
      stato.textContent = Testi.testo('ai.filtro.tutte');
    } else if (trovate === 0) {
      stato.textContent = Testi.testo('ai.filtro.nessuna');
    } else if (trovate === 1) {
      stato.textContent = Testi.testo('ai.filtro.una');
    } else {
      stato.textContent = Testi.plurale('ai.filtro.numero', trovate);
    }
  }

  campo.addEventListener('input', applicaFiltro);
  campo.addEventListener('search', applicaFiltro);
  filtro.hidden = false;
  applicaFiltro();

  // Un collegamento rivela la risposta anche se una ricerca precedente l'aveva nascosta.
  function daAncora() {
    let identificatore;
    try {
      identificatore = decodeURIComponent(location.hash.slice(1));
    } catch {
      // Un frammento copiato male non impedisce di usare il resto della pagina.
      return;
    }
    const destinazione = document.getElementById(identificatore);
    if (!destinazione?.matches('.scheda-frase') || !destinazione.hidden) return;
    campo.value = '';
    applicaFiltro();
    destinazione.scrollIntoView({block: 'start'});
  }

  addEventListener('hashchange', daAncora);

  document.querySelectorAll('[data-copia]').forEach(pulsante => {
    pulsante.hidden = false;
    pulsante.addEventListener('click', async () => {
      const comando = pulsante.closest('.comando');
      const esito = comando.querySelector('[role=status]');
      try {
        await navigator.clipboard.writeText(comando.querySelector('code').textContent.trim());
        esito.textContent = Testi.testo('ai.copia.ok');
      } catch {
        esito.textContent = Testi.testo('ai.copia.no');
      }
    });
  });
})();
