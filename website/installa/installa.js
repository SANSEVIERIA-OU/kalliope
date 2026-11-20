/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// «Installa» nella direzione 2: ogni passo si vede riuscire. Qui: l'arrivo del primo schermo (il comando si scrive nel terminale, il
// computer lavora, «Kalliope» compare fra i microfoni dell'app e il tuo riquadro si accende); la scelta della distribuzione, che
// riscrive il comando; il file che arriva nella cartella e l'impronta confrontata a gruppi di otto cifre; i file che il pacchetto
// mette nella sua cartella; il primo avvio della finestra con le sue frasi vere, e le frasi che possono comparire al posto di
// «Pronta», da provare; la riga «kalliope» e il microfono scelto; «Copia» accanto a ogni comando e all'indirizzo della pagina.
// Nessun testo e nessun valore qui: i testi stanno nella pagina (anche in <template id="testi-pagina">, che dà testi.js), i valori in
// design-system/token.css. Con «riduci movimento» (o senza i fogli di stile) ogni scena è al suo stato finale; i gesti restano.
// Senza questo script la pagina è intera: ogni comando scritto e selezionabile, la scelta della distribuzione funziona (CSS), le
// scene al loro stato finale, ogni frase della finestra con il suo rimedio.
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const {testo: T, formato: fmt} = window.Testi;
  const radice = getComputedStyle(document.documentElement);
  const tok = n => radice.getPropertyValue(n).trim();
  const senzaStili = !tok('--entra');
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches || senzaStili;
  const tempo = n => { const v = tok(n), t = v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000; return isFinite(t) ? t : 0; };

  // ---------- l'orologio della scena: cammina solo con la scheda in vista (come «non ancora» e «stato») ----------
  let fermoTot = 0, nascostoDa = document.hidden ? performance.now() : null;
  const tScena = () => (nascostoDa === null ? performance.now() : nascostoDa) - fermoTot;
  const agenda = [];
  let giraAgenda = 0;
  function dopo(ms, f) { const e = {t: tScena() + ms, f}; agenda.push(e); if (!giraAgenda) giraAgenda = requestAnimationFrame(passoAgenda); return e; }
  function annulla(voci) { voci.forEach(e => { const i = agenda.indexOf(e); if (i >= 0) agenda.splice(i, 1); }); voci.length = 0; }
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
  const visibile = el => el && el.getClientRects().length > 0;

  // ---------- il terminale: righe che compaiono, un comando che si scrive ----------
  // Una riga del terminale «t-mostra» si vede; le altre, finché il terminale è «in-attesa», no. Il comando visibile (quello della
  // distribuzione scelta) si scrive lettera per lettera nel suo elemento; il testo intero resta in data-intero.
  function mostra(riga, entra = true) { if (!riga) return; riga.classList.add('t-mostra'); if (entra && !ridotto) riga.classList.add('t-entra'); }
  // il comando si scrive dentro lo spazio che avrà: la parte ancora da scrivere c'è già, invisibile, così la riga non cambia altezza mentre cresce
  function preparaScrittura(el) {
    const intero = el.dataset.intero ?? (el.dataset.intero = el.textContent);
    const fatto = document.createElement('span'), cursore = document.createElement('span'), resto = document.createElement('span');
    fatto.className = 't-fatto'; cursore.className = 't-cursore'; resto.className = 't-resto'; resto.textContent = intero;
    el.textContent = ''; el.append(fatto, cursore, resto);
    return {intero, fatto, resto};
  }
  function scrivi(el, passo, corsa, poi) {
    const {intero, fatto, resto} = preparaScrittura(el);
    let i = 0;
    const una = () => {
      if (corsa.ferma) return;
      i = Math.min(intero.length, i + 1); fatto.textContent = intero.slice(0, i); resto.textContent = intero.slice(i);
      if (i < intero.length) corsa.voci.push(dopo(passo, una)); else { el.textContent = intero; if (poi) poi(); }
    };
    corsa.voci.push(dopo(passo, una));
  }
  // le righe di un terminale, nell'ordine, con i tempi dei token; «prima» è la riga del comando (si scrive), «poi» a fine corsa
  function racconta(term, {comando, righe, passo, poi, corsa}) {
    term.classList.add('in-attesa');
    $$('.t-riga', term).forEach(r => r.classList.remove('t-mostra', 't-entra'));
    const vai = () => {
      let t = 0;
      righe.forEach(r => { corsa.voci.push(dopo(t += tempo('--passo-riga-terminale'), () => mostra(r))); });
      corsa.voci.push(dopo(t + tempo('--passo-riga-terminale'), () => { if (poi) poi(); }));
    };
    if (comando) {
      mostra(comando, false);
      const scrive = $('.t-scrive', comando);
      if (scrive) scrivi(scrive, passo, corsa, () => corsa.voci.push(dopo(tempo('--pausa-invio'), vai))); else vai();
    } else vai();
  }
  const visibili = (term, sel) => $$(sel, term).filter(visibile);
  function nuovaCorsa(vecchia) { if (vecchia) { vecchia.ferma = true; annulla(vecchia.voci); } return {ferma: false, voci: []}; }
  function tuttoScritto(term) {
    term.classList.remove('in-attesa');
    $$('.t-scrive', term).forEach(s => { if (s.dataset.intero) s.textContent = s.dataset.intero; });
  }

  // =================================================================================================================
  // IL PRIMO SCHERMO: il comando, il computer che lavora, «Kalliope» fra i microfoni e il tuo riquadro che si accende
  // =================================================================================================================
  const tPalco = $('.terminale-palco'), chiamata = $('.chiamata-installa');
  let corsaPalco = null, palcoFatto = false;
  function arrivoPalco(rapido) {
    if (!tPalco || !chiamata) return;
    corsaPalco = nuovaCorsa(corsaPalco);
    const corsa = corsaPalco;
    tPalco.dataset.partito = '1';
    const comando = visibili(tPalco, '.t-comando')[0];
    const righe = [...visibili(tPalco, '.t-tuo'), $('.t-pronto', tPalco)];
    racconta(tPalco, {
      comando, righe, corsa,
      passo: tempo(rapido ? '--passo-lettera-rapido' : '--passo-lettera'),
      poi: () => {
        tuttoScritto(tPalco);
        if (!palcoFatto) corsa.voci.push(dopo(tempo('--ritardo-installata'), () => { chiamata.classList.add('installata'); palcoFatto = true; }));
      },
    });
  }
  if (tPalco && chiamata) {
    if (ridotto) { chiamata.classList.add('installata'); palcoFatto = true; }
    else {
      tPalco.classList.add('in-attesa');
      $$('.t-comando', tPalco).forEach(r => { r.classList.add('t-mostra'); const s = $('.t-scrive', r); if (s) { const {fatto, resto} = preparaScrittura(s); fatto.textContent = ''; resto.textContent = s.dataset.intero; } });
      corsaPalco = nuovaCorsa(null);
      corsaPalco.voci.push(dopo(tempo('--ritardo-terminale-scrive'), () => arrivoPalco(false)));
    }
  }

  // =================================================================================================================
  // LA DISTRIBUZIONE: la scelta è dei fogli di stile (funziona senza script); qui si annuncia e il comando del primo schermo si riscrive
  // =================================================================================================================
  $$('.sistema-voce').forEach(r => r.addEventListener('change', () => {
    if (!r.checked) return;
    // il pulsante della distribuzione nuova c'è subito: non ripete l'entrata del primo schermo (pagina.css, «senza-arrivo»)
    $$('#comandi-apertura > *').forEach(e => e.classList.add('senza-arrivo'));
    const nome = $(`label[for="${r.id}"]`);
    annuncia(fmt(T('in.annuncio.sistema'), {sistema: nome ? nome.textContent.trim() : r.value}));
    if (!ridotto && tPalco && (palcoFatto || tPalco.dataset.partito)) arrivoPalco(palcoFatto);   // durante l'arrivo il comando nuovo riparte da capo
    // le scene già raccontate mostrano subito la loro fine anche per la distribuzione nuova (le impronte confrontate, le righe scritte)
    $$('.terminale').forEach(t => { if (t !== tPalco && !t.classList.contains('in-attesa')) $$('.t-riga', t).forEach(x => x.classList.add('t-mostra')); });
  }));

  // =================================================================================================================
  // IL FILE: arriva nella cartella dei download; l'impronta del terminale si confronta con quella pubblicata, otto cifre alla volta
  // =================================================================================================================
  // le impronte a gruppi di otto cifre: lo stesso testo, in span (con lo script; senza, l'impronta intera e «Uguale» già scritto)
  $$('.t-impronta').forEach(el => {
    const s = el.textContent.trim();
    if (!/^[0-9a-f]{16,}$/i.test(s)) return;
    el.textContent = '';
    for (let i = 0; i < s.length; i += 8) { const g = document.createElement('span'); g.className = 't-gruppo'; g.textContent = s.slice(i, i + 8); el.append(g); }
  });
  const scenaControllo = $('.controllo-scena'), tControllo = $('.terminale-controllo');
  function confronta(corsa) {
    const sopra = visibili(tControllo, '.t-corpo .t-impronta')[0], sotto = visibili(tControllo, '.t-pubblicato')[0];
    if (!sopra || !sotto) { tControllo.classList.remove('in-attesa'); return; }
    const a = $$('.t-gruppo', sopra), b = $$('.t-gruppo', sotto);
    a.forEach((g, i) => corsa.voci.push(dopo(i * tempo('--passo-gruppo-impronta'), () => { g.classList.add('uguale'); if (b[i]) b[i].classList.add('uguale'); })));
    corsa.voci.push(dopo(a.length * tempo('--passo-gruppo-impronta'), () => {
      tControllo.classList.remove('in-attesa');
      $$('.t-gruppo', tControllo).forEach(g => g.classList.add('uguale'));   // anche le altre distribuzioni: se si cambia scelta, il confronto è già fatto
    }));
  }
  if (scenaControllo && tControllo) {
    if (ridotto) $$('.t-gruppo', tControllo).forEach(g => g.classList.add('uguale'));
    else {
      tControllo.classList.add('in-attesa');
      scenaControllo.addEventListener('rivelato', () => {
        const corsa = nuovaCorsa(null);
        const righe = [...visibili(tControllo, '.t-corpo .t-comando'), ...visibili(tControllo, '.t-corpo .t-risposta'), ...visibili(tControllo, '.t-corpo .t-tuo'), ...visibili(tControllo, '.t-pubblicato')];
        // il file arriva prima (CSS, --ritardo-cartella-file); poi il comando e la risposta, poi il confronto
        corsa.voci.push(dopo(tempo('--durata-pacco'), () => racconta(tControllo, {righe, corsa, poi: () => confronta(corsa)})));
      });
    }
  }

  // =================================================================================================================
  // INSTALLA: il comando, il computer che lavora, i file che arrivano nella cartella, e «kalliope --version»
  // =================================================================================================================
  const disco = $('.disco'), tInstalla = $('.terminale-installa');
  if (disco && tInstalla) {
    const pacchi = $$('.pacco', disco);
    const base = 3 * tempo('--passo-riga-terminale');
    pacchi.forEach((p, i) => p.style.setProperty('--ritardo-pacco', `${base + i * tempo('--passo-pacchi')}ms`));
    if (!ridotto) {
      tInstalla.classList.add('in-attesa');
      disco.addEventListener('rivelato', () => {
        const corsa = nuovaCorsa(null), passo = tempo('--passo-riga-terminale');
        const prima = [...visibili(tInstalla, '.t-comando:not(.t-dopo)'), ...visibili(tInstalla, '.t-tuo'), ...visibili(tInstalla, '.t-risposta:not(.t-dopo)')];
        const poi = visibili(tInstalla, '.t-dopo');
        // il comando e il computer che lavora; intanto i file arrivano nella cartella (CSS, --ritardo-pacco); quando sono arrivati, «kalliope --version»
        let t = 0;
        prima.forEach(r => corsa.voci.push(dopo(t += passo, () => mostra(r))));
        t = Math.max(t, base + pacchi.length * tempo('--passo-pacchi') + tempo('--durata-pacco'));
        poi.forEach(r => corsa.voci.push(dopo(t += passo, () => mostra(r))));
        corsa.voci.push(dopo(t + passo, () => tInstalla.classList.remove('in-attesa')));
      });
    }
  }

  // =================================================================================================================
  // APRI: il primo avvio vero (le frasi di main.rs della 0.1-rc.1), poi le frasi che possono comparire al posto di «Pronta»
  // =================================================================================================================
  const avvio = $('.passo-apri .avvio');
  if (avvio) {
    const aStato = $('.f-stato', avvio), aBarra = $('.f-barra i', avvio), aBottone = $('.f-primario', avvio);
    const PRONTA = aStato.textContent, SCARICA = aBottone ? aBottone.textContent : '';
    let corsaAvvio = null;
    const prontaOra = () => { avvio.classList.remove('scarica', 'prepara', 'errore'); avvio.classList.add('pronta'); aStato.textContent = PRONTA; aStato.classList.remove('allarme'); };
    function animaAvvio() {
      corsaAvvio = nuovaCorsa(corsaAvvio);
      const corsa = corsaAvvio;
      avvio.classList.remove('scarica', 'prepara', 'pronta', 'errore');
      aStato.classList.remove('allarme');
      aStato.textContent = T('avvio.primo');
      if (aBottone) { aBottone.textContent = SCARICA; aBottone.classList.remove('f-annulla', 'premuto'); }
      if (aBarra) aBarra.style.transform = 'scaleX(0)';
      const quando = (ms, f) => corsa.voci.push(dopo(ms, f));
      quando(tempo('--avvio-premi'), () => aBottone && aBottone.classList.add('premuto'));
      quando(tempo('--avvio-scarica'), () => {
        if (aBottone) { aBottone.classList.remove('premuto'); aBottone.textContent = T('avvio.annulla'); aBottone.classList.add('f-annulla'); }
        avvio.classList.add('scarica');
        const t0 = tScena(), D = tempo('--avvio-scarico-durata');
        const passo = () => {
          if (corsa.ferma) return;
          const q = Math.min(1, (tScena() - t0) / D), mb = Math.round(53 * q);
          aStato.textContent = fmt(T('avvio.scarico'), {mb: window.Testi.numero(mb)}); if (aBarra) aBarra.style.transform = `scaleX(${q.toFixed(3)})`;
          if (q < 1 && avvio.classList.contains('scarica')) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
      });
      quando(tempo('--avvio-prepara'), () => { avvio.classList.remove('scarica'); avvio.classList.add('prepara'); aStato.textContent = T('avvio.preparo'); });
      quando(tempo('--avvio-pronta'), prontaOra);
    }
    if (ridotto) prontaOra();
    else {
      aStato.textContent = T('avvio.primo');
      avvio.addEventListener('rivelato', () => dopo(tempo('--ritardo-avvio'), () => { if (!avvio.classList.contains('provata')) animaAvvio(); }));
    }

    // le frasi: con lo script diventano pulsanti; premuta una, la finestra la mostra (e, se è un errore dello scarico, torna «Scarica la voce»)
    const bottoni = $$('.frase-detta').map(p => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'frase-bottone'; b.dataset.stato = p.dataset.stato; b.setAttribute('aria-pressed', 'false');
      b.append(...p.childNodes); p.replaceWith(b); return b;
    });
    bottoni.forEach(b => b.addEventListener('click', () => {
      const su = b.getAttribute('aria-pressed') !== 'true';
      bottoni.forEach(x => x.setAttribute('aria-pressed', String(x === b && su)));
      corsaAvvio = nuovaCorsa(corsaAvvio);
      avvio.classList.add('provata');
      if (!su) { prontaOra(); return; }
      const st = b.dataset.stato, scarico = st !== 'microfono';
      avvio.classList.remove('scarica', 'prepara', 'pronta');
      avvio.classList.toggle('errore', scarico); if (!scarico) avvio.classList.add('pronta');
      if (aBottone) { aBottone.textContent = SCARICA; aBottone.classList.remove('f-annulla', 'premuto'); }
      aStato.textContent = T(`in.stato.${st}`); aStato.classList.add('allarme');
    }));
  }

  // =================================================================================================================
  // IL MICROFONO: «pactl list short sources», la riga «kalliope», e nella barra dell'app «Kalliope» scelto
  // =================================================================================================================
  const scenaMic = $('.microfono-scena'), tMic = $('.terminale-microfono');
  if (scenaMic && tMic && !ridotto) {
    scenaMic.classList.add('in-attesa'); tMic.classList.add('in-attesa');
    scenaMic.addEventListener('rivelato', () => {
      const corsa = nuovaCorsa(null);
      const righe = $$('.t-riga', tMic);
      racconta(tMic, {righe, corsa, poi: () => {
        tMic.classList.remove('in-attesa');
        corsa.voci.push(dopo(tempo('--ritardo-installata'), () => { scenaMic.classList.remove('in-attesa'); scenaMic.classList.add('trovato'); }));
      }});
    });
  }

  // =================================================================================================================
  // COPIA: accanto a ogni comando, e l'indirizzo della pagina per chi installa al posto tuo
  // =================================================================================================================
  const appunti = navigator.clipboard && window.isSecureContext;
  function seleziona(el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  if (appunti) {
    $$('.comando').forEach(c => {
      const code = $('code', c); if (!code) return;
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'copia';
      const et = document.createElement('span'); et.className = 'etichette';
      const fermo = document.createElement('span'); fermo.className = 'se-fermo'; fermo.textContent = T('in.copia');
      const fatto = document.createElement('span'); fatto.className = 'se-fatto'; fatto.textContent = T('in.copia.fatto'); fatto.setAttribute('aria-hidden', 'true');
      et.append(fermo, fatto); b.append(et);
      b.setAttribute('aria-label', fmt(T('in.copia.etichetta'), {comando: code.textContent.trim()}));
      c.append(b);
      let via = 0;
      b.addEventListener('click', () => {
        navigator.clipboard.writeText(code.textContent.trim()).then(() => {
          c.classList.add('copiato'); annuncia(T('in.annuncio.copiato'));
          const err = c.nextElementSibling; if (err && err.classList.contains('comando-errore')) err.remove();
          clearTimeout(via); via = setTimeout(() => c.classList.remove('copiato'), tempo('--durata-comando-copiato'));
        }, () => {
          let err = c.nextElementSibling;
          if (!err || !err.classList.contains('comando-errore')) { err = document.createElement('p'); err.className = 'comando-errore'; err.setAttribute('role', 'status'); c.after(err); }
          err.textContent = T('in.copia.errore'); seleziona(code);
        });
      });
    });
  }
  const copiaIndirizzo = $('.copia-indirizzo'), fatto = $('.copia-fatto'), errore = $('.copia-errore'), bolla = $('.bolla-indirizzo'), indirizzo = $('.inoltra-indirizzo');
  if (copiaIndirizzo && appunti) {
    copiaIndirizzo.hidden = false;
    copiaIndirizzo.addEventListener('click', () => {
      const testo = indirizzo ? indirizzo.textContent.trim() : location.href.split('#')[0];
      navigator.clipboard.writeText(testo).then(() => {
        fatto.hidden = false; errore.hidden = true;
        if (bolla) { bolla.classList.remove('copiata'); void bolla.offsetWidth; bolla.classList.add('copiata'); }
      }, () => { errore.hidden = false; fatto.hidden = true; if (indirizzo) seleziona(indirizzo); });
    });
  }

  window.__pagina = true;
})();
