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
  const ENTRA = tok('--entra');

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
  // LA CATENA: una tappa alla volta, nell'ordine della strada. La linea arriva al nodo, il nodo si accende, compaiono i fatti, la
  // linea riparte verso la tappa dopo. Se più tappe arrivano sullo schermo insieme, si accendono in fila.
  // =================================================================================================================
  const anelli = $$('.catena .anello');
  const passoAnello = () => tempo('--ritardo-anello-dopo') + tempo('--durata-anello-linea');
  let prossimoLibero = 0;
  function accendi(a) {
    if (a.classList.contains('acceso') || a.dataset.inCoda) return;
    // le tappe prima di questa si accendono prima (chi scorre in fretta o salta con un'ancora non lascia buchi)
    anelli.slice(0, anelli.indexOf(a)).forEach(accendi);
    a.dataset.inCoda = '1';
    const ora = tScena(), quando = Math.max(ora, prossimoLibero);
    prossimoLibero = quando + passoAnello();
    dopo(quando - ora, () => { a.classList.add('acceso'); delete a.dataset.inCoda; });
  }
  if (ridotto) anelli.forEach(a => a.classList.add('acceso'));

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
      // al telefono la bolla sta subito sotto la domanda premuta; al computer accanto all'elenco
      if (telefono.matches) v.after(bolla); else domande.append(bolla);
    }
    function scegli(v, gesto) {
      if (v === scelta) return;
      const prima = scelta;
      scelta = v;
      voci.forEach(x => $('.domanda-bottone', x).setAttribute('aria-expanded', String(x === v)));
      const spostata = telefono.matches && bolla.previousElementSibling !== v;
      if (!gesto || ridotto || !prima || spostata) {
        posto(v); riempi(v);
        if (gesto && !ridotto && spostata) bolla.animate([{opacity: 0, transform: `scale(${tok('--bolla-nasce-scala')})`}, {opacity: 1, transform: 'none'}], {duration: tempo('--durata-bolla-nasce'), easing: ENTRA});
      } else {
        // la bolla resta al suo posto: le parole cambiano dentro, e la bolla prende la misura nuova
        const h0 = corpo.getBoundingClientRect().height;
        const via = contenuto.animate([{opacity: 1}, {opacity: 0}], {duration: tempo('--durata-domanda-via'), easing: 'linear', fill: 'forwards'});
        via.finished.then(() => {
          if (scelta !== v) return;
          riempi(v); via.cancel();
          const h1 = corpo.getBoundingClientRect().height;
          corpo.animate([{height: `${h0}px`}, {height: `${h1}px`}], {duration: tempo('--durata-domanda-misura'), easing: ENTRA});
          contenuto.animate([{opacity: 0}, {opacity: 1}], {duration: tempo('--durata-domanda-arriva'), easing: 'linear', delay: tempo('--durata-domanda-via')});
        }, () => {});
      }
      if (gesto) {
        annuncia(fmt(T('st.annuncio.risposta'), {domanda: $('.domanda-chiede', v).textContent.trim()}));
        // ciò che il gesto apre resta in vista (regola della cornice): al telefono la bolla sotto la domanda
        if (telefono.matches) requestAnimationFrame(() => {
          const r = bolla.getBoundingClientRect(), giu = r.bottom - (innerHeight - 12);
          if (giu > 0) scrollBy({top: giu, behavior: ridotto ? 'instant' : 'smooth'});
        });
      }
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
  if (varco && 'IntersectionObserver' in window) {
    const passi = $$('.varco-passo', scenaVarco);
    const pacchi = $('.varco-pacchi', varco), voceFile = $('.varco-voce', varco);
    let attuale = null, discesa = null;
    function scendono() {
      if (ridotto || !pacchi || !voceFile) return;
      if (discesa) discesa.forEach(a => a.cancel());
      const rp = pacchi.getBoundingClientRect(), rv = voceFile.getBoundingClientRect();
      const dx = rv.left + rv.width / 2 - (rp.left + rp.width / 2);
      const d = tempo('--durata-pacco'), passo = tempo('--passo-pacchi');
      // in fila lungo il filo: ogni file scende fino al bordo alto di «la voce» e lì si spegne, entrando
      const dyBordo = rv.top - (rp.top + rp.height / 2);
      discesa = [...pacchi.children].map((p, i) => p.animate([
        {opacity: 0, transform: 'translate(0, 0)'},
        {opacity: 1, transform: 'translate(0, 0)', offset: 0.2},
        {opacity: 1, transform: `translate(${dx.toFixed(1)}px, ${(dyBordo * 0.85).toFixed(1)}px)`, offset: 0.8},
        {opacity: 0, transform: `translate(${dx.toFixed(1)}px, ${dyBordo.toFixed(1)}px) scale(0.7)`}],
      {duration: d * 1.6, delay: d * 0.6 + i * passo, easing: tok('--curva-pacco'), fill: 'both'}));
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
    const fascia = () => (telefono.matches ? [0.56, 0.24] : [0.42, 0.42]);
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
      setTimeout(() => { mostra.hidden = false; }, 60);
    };
    copia.addEventListener('click', () => {
      const testo = $$('.inoltra-testo', tratto).filter(p => p.offsetParent !== null).map(p => p.textContent.trim()).join(' ');
      navigator.clipboard.writeText(`${testo}\n${location.href.split('#')[0]}`).then(() => {
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
