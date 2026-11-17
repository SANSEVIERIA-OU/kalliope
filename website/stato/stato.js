/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// «Stato» nella direzione 2: provato fino al microfono, in riunione non ancora. Ogni fatto sta dove accade.
// Qui: l'arrivo del primo schermo (la voce parte da «Tu», il microfono «Kalliope» si accende, gli altri prendono il tratteggio); la
// catena che si accende una tappa alla volta quando arriva sullo schermo; le domande con la risposta nella bolla; il computer del
// varco che mostra il fatto del passo a metà schermo; la copia del messaggio da inoltrare. Nessun testo e nessun colore qui: i testi
// stanno nella pagina (anche quelli di <template id="testi-pagina">, che dà testi.js), i valori in design-system/token.css.
// Con «riduci movimento» (o senza i fogli di stile) ogni scena è al suo stato finale; i gesti restano. Senza questo script la pagina
// è intera: tutto acceso, ogni domanda con la sua risposta, il computer con tutto in vista.
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const {testo: T, formato: fmt} = window.Testi;
  const radice = getComputedStyle(document.documentElement);
  const tok = n => radice.getPropertyValue(n).trim();
  const senzaStili = !tok('--entra');
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches || senzaStili;
  const telefono = matchMedia('(max-width: 760px)');
  const tempo = n => { const v = tok(n), t = v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000; return isFinite(t) ? t : 0; };
  const num = n => parseFloat(tok(n));
  const ENTRA = tok('--entra'), CURVA_DOMANDA = tok('--curva-domanda');

  // ---------- l'orologio della scena: cammina solo con la scheda in vista (come «non ancora») ----------
  let fermoTot = 0, nascostoDa = document.hidden ? performance.now() : null;
  const tScena = () => (nascostoDa === null ? performance.now() : nascostoDa) - fermoTot;
  const agenda = [];
  let giraAgenda = 0;
  function dopo(ms, f) { agenda.push({t: tScena() + ms, f}); if (!giraAgenda) giraAgenda = requestAnimationFrame(passoAgenda); }
  function passoAgenda() {
    giraAgenda = 0;
    const t = tScena();
    for (let i = 0; i < agenda.length;) { const e = agenda[i]; if (e.t <= t) { agenda.splice(i, 1); e.f(); } else i++; }
    if (agenda.length) giraAgenda = requestAnimationFrame(passoAgenda);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (nascostoDa === null) nascostoDa = performance.now(); }
    else { if (nascostoDa !== null) { fermoTot += performance.now() - nascostoDa; nascostoDa = null; } if (agenda.length && !giraAgenda) giraAgenda = requestAnimationFrame(passoAgenda); }
  });
  const annuncio = $('#annuncio');
  function annuncia(t) { if (!annuncio) return; annuncio.textContent = ''; setTimeout(() => { annuncio.textContent = t; }, 60); }

  // ciò che un gesto apre resta in vista (regola della cornice, pagina.css): la bolla della risposta, i dettagli aperti, la conferma della copia. Scorre quanto serve
  // perché «cosa» si veda tutta sotto la barra; se è più alta dello spazio che c'è, ne comincia la parte alta (il gesto non la lascia a metà sopra la barra). «inizio»
  // è ciò che deve restare con lei (il comando, se ci sta). La misura si prende dopo che ha la sua altezza (la bolla la cambia mentre prende la misura nuova)
  function inVista(cosa, inizio = cosa) {
    requestAnimationFrame(() => {
      if (!cosa.isConnected) return;
      const aria = num('--gesto-aria'), barra = $('.barra'), alto = (barra ? barra.getBoundingClientRect().bottom : 0) + aria;
      const r = cosa.getBoundingClientRect(), giu = r.bottom - (innerHeight - aria);
      // con il suo comando, se ci stanno insieme; se no da sola (la bolla ripete la domanda in testa: il pulsante premuto può restare sopra)
      let su = Math.min(r.top, inizio.getBoundingClientRect().top) - alto;
      if (giu > su) su = r.top - alto;
      const dy = giu <= su ? Math.min(Math.max(0, giu), su) : su;   // se ci sta tutta: quanto basta; se no: la sua parte alta sotto la barra
      if (Math.abs(dy) > 1) scrollBy({top: dy, behavior: ridotto ? 'instant' : 'smooth'});
    });
  }

  // =================================================================================================================
  // IL PRIMO SCHERMO: «Tu» parla, la voce arriva al microfono «Kalliope» (provato fin qui), oltre è tratteggiato
  // =================================================================================================================
  const chiamata = $('.chiamata-provata'), palco = $('.palco-provato');
  if (chiamata) {
    if (ridotto) { chiamata.classList.add('fatta'); if (palco) palco.classList.add('detta'); }
    else {
      dopo(Math.max(0, tempo('--ritardo-voce-provata') - tScena()), () => {
        chiamata.classList.add('parla'); if (palco) palco.classList.add('detta');
        dopo(tempo('--ritardo-microfono-provato'), () => {
          chiamata.classList.add('microfono-acceso');
          dopo(tempo('--ritardo-oltre-segnato'), () => {
            chiamata.classList.add('oltre-segnato');
            dopo(tempo('--durata-provato-barre') * parseFloat(tok('--ripetizioni-provato-barre')), () => { chiamata.classList.add('fatta'); chiamata.classList.remove('parla'); });
          });
        });
      });
    }
  }

  // =================================================================================================================
  // LA CATENA: ogni tappa si legge subito (titolo, cifra, testo e fonte sono pieni da prima che arrivi); quando arriva sullo schermo
  // la linea scende al suo nodo, il nodo si accende e il suo fatto accade (la quota si riempie, la riga delle parole si scrive, la
  // bolla della riscrittura nasce). Le tappe che arrivano insieme dal basso si accendono a cascata breve; quelle sopra, che chi è
  // saltato a metà non ha visto, si accendono subito, ferme (correzione dopo il giudizio, I1: prima era una coda dalla prima tappa)
  // =================================================================================================================
  const anelli = $$('.catena .anello');
  let ultimoAvvio = -Infinity, inCascata = 0;
  function subito(a) {
    if (a.classList.contains('acceso')) return;
    a.classList.add('subito', 'acceso');
    requestAnimationFrame(() => requestAnimationFrame(() => a.classList.remove('subito')));
  }
  function accendi(a) {
    if (a.classList.contains('acceso') || a.dataset.inCoda) return;
    // le tappe sopra, non ancora accese, il cui inizio è già oltre il bordo alto dello schermo (anche se ne resta in vista la parte bassa, sotto la barra: la
    // linea fra il suo nodo e il successivo mancherebbe) sono saltate: si accendono ferme, nessuno le aspetta. Una tappa intera nello schermo arriva da sé
    anelli.slice(0, anelli.indexOf(a)).forEach(x => { if (!x.dataset.inCoda && x.getBoundingClientRect().top < 0) subito(x); });
    const ora = tScena();
    inCascata = ora - ultimoAvvio < tempo('--passo-cascata-anelli') ? inCascata + 1 : 0;
    ultimoAvvio = ora;
    a.dataset.inCoda = '1';
    dopo(inCascata * tempo('--passo-cascata-anelli'), () => { a.classList.add('acceso'); delete a.dataset.inCoda; });
  }
  if (ridotto) anelli.forEach(a => a.classList.add('acceso'));

  // al telefono i dettagli di una tappa (come è misurato, le fonti), le licenze e le impronte si aprono a richiesta: il lungo dopo
  // (correzione dopo il giudizio, I4; progetto.md §4.2). Al computer e senza script restano aperti. La scelta della persona non si perde: ciò che ha
  // aperto o chiuso al telefono si ricorda, e passando al computer (la finestra che si allarga, il telefono che gira) e tornando si ritrova com'era
  const dettagli = $$('.anello-dettagli, .licenze-blocco');   // anche licenze e impronte, nel tratto per chi controlla
  const sceltaDettagli = new Map();   // dettaglio → aperto (true) o chiuso (false), come l'ha lasciato la persona al telefono
  function dettagliPerMisura() {
    dettagli.forEach(d => {
      d.open = telefono.matches ? sceltaDettagli.get(d) === true : true;
      // al computer il titolo di licenze e impronte è soltanto un titolo: non una fermata del fuoco che chiude il blocco
      const t = d.querySelector(':scope > summary'); if (t && d.classList.contains('licenze-blocco')) t.tabIndex = telefono.matches ? 0 : -1;
    });
  }
  dettagliPerMisura(); telefono.addEventListener('change', dettagliPerMisura);
  // la scelta è quella di un gesto della persona (clic, Invio o Spazio sul titolo), letta dopo che il browser ha aperto o chiuso: non quella di una misura che cambia
  dettagli.forEach(d => { const t = d.querySelector(':scope > summary'); if (t) t.addEventListener('click', () => setTimeout(() => { if (telefono.matches) { sceltaDettagli.set(d, d.open); if (d.open) inVista(d); } })); });

  // la parentesi «non misurato» va dal nodo di «Scrivi la frase» a quello di «Gli altri ti sentono» (M3): le misure dalla pagina vera
  const catena = $('.catena'), da = $('.anello[data-anello=scrivi] .anello-nodo'), a = $('.anello[data-anello=altri] .anello-nodo');
  function parentesi() {
    if (!catena || !da || !a) return;
    const rc = catena.getBoundingClientRect(), r1 = da.getBoundingClientRect(), r2 = a.getBoundingClientRect();
    catena.style.setProperty('--misura-da', `${(r1.top + r1.height / 2 - rc.top).toFixed(1)}px`);
    catena.style.setProperty('--misura-a', `${(r2.top + r2.height / 2 - rc.top).toFixed(1)}px`);
  }
  parentesi(); addEventListener('resize', parentesi); addEventListener('load', parentesi);
  if (document.fonts) document.fonts.ready.then(parentesi);
  dettagli.forEach(d => d.addEventListener('toggle', parentesi));

  // =================================================================================================================
  // LE DOMANDE: una risposta alla volta, nella bolla. Cambiando domanda le parole di prima si spengono, la bolla prende la misura
  // nuova (FLIP) e le parole nuove compaiono. Al telefono la bolla si apre sotto la domanda premuta.
  // =================================================================================================================
  const domande = $('.domande');
  if (domande) {
    const voci = $$('.domanda', domande);
    const bolla = document.createElement('div');
    bolla.className = 'bolla domande-bolla';
    bolla.innerHTML = '<div class="bolla-corpo"><div class="domande-bolla-contenuto"></div></div><svg class="coda" width="32" height="24" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 0h31L7.6 21.6A3.5 3.5 0 0 1 2 18.8V0z"/></svg>';
    bolla.id = 'domande-risposta';
    bolla.setAttribute('role', 'region');
    bolla.setAttribute('aria-live', 'polite');
    const corpo = $('.bolla-corpo', bolla), contenuto = $('.domande-bolla-contenuto', bolla);
    let scelta = null;
    // il contenuto della bolla: la domanda (piccola, nel colore della voce) e la risposta, presa dalla pagina
    function riempi(v) {
      contenuto.textContent = '';
      const q = document.createElement('p'); q.className = 'domande-bolla-chiede'; q.textContent = $('.domanda-chiede', v).textContent.trim();
      const r = $('.domanda-risponde', v).cloneNode(true); r.className = 'domande-bolla-risponde';
      $$('p', r).forEach(p => p.classList.add('bolla-testo'));
      contenuto.append(q, r);
    }
    function posto(v) {
      // al telefono la bolla sta subito sotto la domanda premuta; al computer accanto all'elenco. Spostare un elemento che ha il fuoco (un collegamento
      // della risposta, mentre la finestra cambia misura) lo fa perdere: si rimette dov'era
      const attivo = bolla.contains(document.activeElement) ? document.activeElement : null;
      if (telefono.matches) v.after(bolla); else domande.append(bolla);
      if (attivo) attivo.focus({preventScroll: true});
    }
    // al telefono la bolla sta sotto la domanda premuta e restano in vista insieme (se ci stanno); al computer la bolla sta accanto all'elenco e segue lo scorrimento
    const inizioBolla = v => (telefono.matches ? $('.domanda-bottone', v) : bolla);
    function scegli(v, gesto) {
      if (v === scelta) return;
      const prima = scelta;
      scelta = v;
      voci.forEach(x => $('.domanda-bottone', x).setAttribute('aria-expanded', String(x === v)));
      const spostata = telefono.matches && bolla.previousElementSibling !== v;
      if (!gesto || ridotto || !prima || spostata) {
        posto(v); riempi(v);
        // (si guarda quando la bolla ha la sua misura: mentre nasce è rimpicciolita e il suo rettangolo non è quello che resta)
        if (gesto && !ridotto && spostata) bolla.animate([{opacity: 0, transform: `scale(${tok('--bolla-nasce-scala')})`}, {opacity: 1, transform: 'none'}], {duration: tempo('--durata-bolla-nasce'), easing: ENTRA}).finished.then(() => inVista(bolla, inizioBolla(v)), () => {});
        else if (gesto) inVista(bolla, inizioBolla(v));
      } else {
        // la bolla resta al suo posto: le parole cambiano dentro, e la bolla prende la misura nuova. Le parole nuove entrano una volta sola,
        // dalla trasparenza: l'animazione d'entrata parte nello stesso istante in cui si tolgono quella d'uscita e il testo vecchio, così
        // nessun fotogramma mostra il testo nuovo pieno prima della sua entrata (correzione dopo il giudizio, I2). Premendo di nuovo a metà,
        // si riparte dall'opacità di quel momento
        const op = parseFloat(getComputedStyle(contenuto).opacity) || 0;
        contenuto.getAnimations().forEach(x => x.cancel()); corpo.getAnimations().forEach(x => x.cancel());
        const h0 = corpo.getBoundingClientRect().height;
        const via = contenuto.animate([{opacity: op}, {opacity: 0}], {duration: tempo('--durata-domanda-via') * op, easing: CURVA_DOMANDA, fill: 'forwards'});
        via.finished.then(() => {
          if (scelta !== v) return;
          riempi(v);
          contenuto.animate([{opacity: 0}, {opacity: 1}], {duration: tempo('--durata-domanda-arriva'), easing: CURVA_DOMANDA, fill: 'backwards'});
          via.cancel();
          const h1 = corpo.getBoundingClientRect().height;
          // a misura nuova la bolla può essere diventata più alta (la sua parte alta resta sotto la barra) o più bassa: si guarda quando l'ha presa, non a metà
          corpo.animate([{height: `${h0}px`}, {height: `${h1}px`}], {duration: tempo('--durata-domanda-misura'), easing: ENTRA}).finished.then(() => inVista(bolla, inizioBolla(v)), () => {});
        }, () => {});
      }
      if (gesto) annuncia(fmt(T('st.annuncio.risposta'), {domanda: $('.domanda-chiede', v).textContent.trim()}));
    }
    voci.forEach(v => {
      const h = $('.domanda-chiede', v), b = document.createElement('button');
      b.type = 'button'; b.className = 'domanda-bottone';
      b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', bolla.id);
      while (h.firstChild) b.append(h.firstChild);
      h.append(b);
      b.addEventListener('click', () => scegli(v, true));
    });
    domande.classList.add('viva');
    scegli(voci[0], false);
    telefono.addEventListener('change', () => { if (scelta) posto(scelta); });
  }

  // =================================================================================================================
  // IL VARCO: il passo a metà schermo dice al computer che cosa mostrare. Nel passo dello scarico i tre file scendono dal varco al disco.
  // =================================================================================================================
  const scenaVarco = $('.varco-scena'), varco = scenaVarco && $('.varco', scenaVarco);
  if (varco && !senzaStili && 'IntersectionObserver' in window) {   // senza token.css le fasce mancano: la pagina resta com'è senza script, il computer mostra tutto
    const passi = $$('.varco-passo', scenaVarco);
    const pacchi = $('.varco-pacchi', varco), voceFile = $('.varco-voce', varco);
    let attuale = null, discesa = null;
    function scendono() {
      if (ridotto || !pacchi || !voceFile) return;
      if (discesa) discesa.forEach(a => a.cancel());
      const rp = pacchi.getBoundingClientRect(), rv = voceFile.getBoundingClientRect(), rd = $('.varco-disco', varco).getBoundingClientRect();
      const dx = rv.left + rv.width / 2 - (rp.left + rp.width / 2);
      const d = tempo('--durata-pacco'), passo = tempo('--passo-pacchi');
      const corsa = {durata: num('--pacco-corsa-durata'), ritardo: num('--pacco-corsa-ritardo'), da: num('--pacco-corsa-pieno-da'), a: num('--pacco-corsa-pieno-a'), strada: num('--pacco-corsa-strada'), scala: tok('--pacco-corsa-scala-fine')};
      // in fila lungo il filo: ogni file scende e si spegne entrando nel disco
      const dyBordo = rd.top - (rp.top + rp.height);   // fino al bordo alto del disco: entrano lì, senza passare sopra le sue scritte
      discesa = [...pacchi.children].map((p, i) => p.animate([
        {opacity: 0, transform: 'translate(0, 0)'},
        {opacity: 1, transform: 'translate(0, 0)', offset: corsa.da},
        {opacity: 1, transform: `translate(${dx.toFixed(1)}px, ${(dyBordo * corsa.strada).toFixed(1)}px)`, offset: corsa.a},
        {opacity: 0, transform: `translate(${dx.toFixed(1)}px, ${dyBordo.toFixed(1)}px) scale(${corsa.scala})`}],
      {duration: d * corsa.durata, delay: d * corsa.ritardo + i * passo, easing: tok('--curva-pacco'), fill: 'both'}));
      pacchi.style.opacity = 1;
      const queste = discesa;
      Promise.all(queste.map(a => a.finished)).then(() => { queste.forEach(a => a.cancel()); pacchi.style.opacity = ''; }, () => {});
    }
    function vai(nome) {
      if (nome === attuale) return;
      attuale = nome;
      varco.dataset.passo = nome;
      passi.forEach(p => p.classList.toggle('qui', p.dataset.passo === nome));
      if (nome === 'scarico') scendono();
    }
    scenaVarco.classList.add('viva');
    // il passo che conta è quello a metà dello spazio che resta libero: al computer a metà schermo, al telefono sotto il computer agganciato
    const fascia = () => (telefono.matches ? [num('--varco-fascia-sopra-telefono'), num('--varco-fascia-sotto-telefono')] : [num('--varco-fascia-sopra'), num('--varco-fascia-sotto')]);
    let occhio = null;
    function osserva() {
      if (occhio) occhio.disconnect();
      const [su, giu] = fascia();
      occhio = new IntersectionObserver(voci => { voci.forEach(v => { if (v.isIntersecting) vai(v.target.dataset.passo); }); },
        {rootMargin: `-${su * 100}% 0px -${giu * 100}% 0px`});
      passi.forEach(p => occhio.observe(p));
    }
    osserva(); telefono.addEventListener('change', osserva);
    // sopra il primo passo o sotto l'ultimo il computer mostra tutto
    addEventListener('scroll', () => {
      const [su, giu] = fascia(), r1 = passi[0].getBoundingClientRect(), r2 = passi[passi.length - 1].getBoundingClientRect();
      if (r1.top > innerHeight * (1 - giu) || r2.bottom < innerHeight * su) { attuale = null; varco.dataset.passo = 'tutto'; passi.forEach(p => p.classList.remove('qui')); }
    }, {passive: true});
  }

  // =================================================================================================================
  // IL MESSAGGIO DA INOLTRARE: «Copia il messaggio» mette negli appunti il testo della bolla e l'indirizzo di questa pagina
  // =================================================================================================================
  const tratto = $('.inoltra-tratto'), copia = tratto && $('.copia-messaggio', tratto);
  if (copia && navigator.clipboard && window.isSecureContext) {
    const fatto = $('.copia-fatto', tratto), errore = $('.copia-errore', tratto), bollaIn = $('.bolla-inoltra', tratto);
    copia.hidden = false;
    const rispondi = si => {
      const [mostra, nascondi] = si ? [fatto, errore] : [errore, fatto];
      nascondi.hidden = true; mostra.hidden = true;
      setTimeout(() => { mostra.hidden = false; inVista(mostra.parentElement, copia); }, 60);   // la risposta e il comando, se ci stanno, restano nello schermo
    };
    copia.addEventListener('click', () => {
      // il messaggio è ciò che la bolla mostra, indirizzo compreso: lo scrive la costruzione dai dati del sito (lo stesso del canonical), non lo
      // decide la pagina in cui si è aperto (location). Gli isolamenti di verso che la costruzione mette attorno alle parti latine, da destra a sinistra, non si copiano
      const testo = $$('.inoltra-testo', tratto).filter(p => p.offsetParent !== null).map(p => p.textContent.trim()).join(' ');
      const indirizzo = $('.inoltra-indirizzo', tratto).textContent.trim();
      navigator.clipboard.writeText(`${testo}\n${indirizzo}`.replace(/[\u2066-\u2069]/g, '')).then(() => {
        rispondi(true);
        if (bollaIn && !ridotto) { bollaIn.classList.remove('copiata'); void bollaIn.offsetWidth; bollaIn.classList.add('copiata'); }
      }, () => rispondi(false));
    });
  } else if (tratto) tratto.classList.add('senza-appunti');

  // =================================================================================================================
  // CIÒ CHE ACCADE QUANDO UN TRATTO ARRIVA SULLO SCHERMO (cornice.js manda «rivelato»)
  // =================================================================================================================
  document.addEventListener('rivelato', e => {
    const el = e.target;
    if (el.classList.contains('anello') && !ridotto) accendi(el);
  });
  $$('.entra.visto').forEach(el => el.dispatchEvent(new CustomEvent('rivelato', {bubbles: true})));

  window.__pagina = true;
})();
