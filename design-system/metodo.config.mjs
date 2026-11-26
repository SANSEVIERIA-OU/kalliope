/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Configurazione del controllo «i valori stanno solo nei token» per il design system di Kalliope.
// Si lancia da questa cartella:  node <skill>/scripts/controlla-sorgenti.mjs
// Riguarda solo ciò che usa questo sistema: la home (../website/index.html), la pagina di scelta della lingua (../website/lingue.html), il catalogo
// e le pagine interne già rifatte nella direzione 2 (../website/non-ancora/, con ../website/cornice.js). Le altre pagine del sito
// hanno ancora i fogli di prima (website/stile/) e il loro controllo (design/metodo.config.mjs).
// «non ancora»: la pagina a riposo e ogni stato che ne cambia l'impaginazione (esame-impaginazione.mjs, dispositivi-qa.mjs). «dopo» fa il gesto
// e aspetta che sia finito; «inVista» è ciò che il gesto ha aperto e la scena in cui se ne vede l'effetto: devono stare nello schermo, sotto la barra.
const NA = 'it/non-ancora/';
const allaChiusura = async p => { await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView({block: 'start'})); await p.waitForTimeout(900); };
const alQuando = async p => { await p.evaluate(() => document.querySelector('#quando').scrollIntoView({block: 'start'})); await p.waitForTimeout(900); };
const statiNonAncora = [
  {nome: 'non-ancora', url: NA},
  // il menu aperto: dove la barra mostra le voci non c'è
  {nome: 'non-ancora-menu', url: NA, dopo: async p => { if (!await p.isVisible('.pulsante-menu')) return false; await p.click('.pulsante-menu'); await p.waitForTimeout(500); }, inVista: '#menu.aperto'},
  // l'ascolto in corso: il comando e la riunione con la bolla che si accende
  {nome: 'non-ancora-ascolto', url: NA, dopo: async p => { await allaChiusura(p); await p.click('.ascolta-ferma'); await p.waitForTimeout(1600); }, inVista: '.ascolta-ferma, .chiusura .bolla-chiusa'},
  // il suono che non parte: il messaggio vicino al comando, con la bolla com'era
  {nome: 'non-ancora-errore-audio', url: NA, dopo: async p => { await p.route(/\/voce\/giulia-1\.(mp3|opus)$/, r => r.fulfill({status: 200, contentType: 'audio/mpeg', body: 'questo non è un suono'})); await allaChiusura(p); await p.click('.ascolta-ferma'); await p.waitForTimeout(1500); }, inVista: '.errore-ascolto, .ascolta-ferma, .chiusura .bolla-chiusa'},
  // la copia dell'indirizzo, riuscita e non riuscita (gli appunti si simulano: in ogni motore la risposta è quella provata)
  {nome: 'non-ancora-copia-fatta', url: NA, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); }); await alQuando(p); if (!await p.isVisible('.copia-indirizzo')) return false; await p.click('.copia-indirizzo'); await p.waitForTimeout(700); }, inVista: '.copia-indirizzo, .copia-fatto'},
  {nome: 'non-ancora-copia-non-riuscita', url: NA, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('no')); }); await alQuando(p); if (!await p.isVisible('.copia-indirizzo')) return false; await p.click('.copia-indirizzo'); await p.waitForTimeout(700); }, inVista: '.copia-indirizzo, .copia-errore'},
];

// «stato» (incarico 3b): la pagina a riposo e gli stati che ne cambiano l'impaginazione. La risposta nella bolla (al telefono si apre sotto la
// domanda premuta), i dettagli a richiesta (al telefono), il menu aperto e la copia del messaggio da inoltrare (gli appunti si simulano, come per «non ancora»).
const ST = 'it/stato/';
const alleDomande = async p => { await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(900); };
const allInoltra = async p => { await p.evaluate(() => document.querySelector('#inoltra').scrollIntoView({block: 'start'})); await p.waitForTimeout(900); };
const allaCatena = async p => { await p.evaluate(() => document.querySelector('.anello[data-anello=microfono]').scrollIntoView({block: 'center'})); await p.waitForTimeout(900); };
const statiStato = [
  {nome: 'stato', url: ST},
  {nome: 'stato-menu', url: ST, dopo: async p => { if (!await p.isVisible('.pulsante-menu')) return false; await p.click('.pulsante-menu'); await p.waitForTimeout(500); }, inVista: '#menu.aperto'},
  {nome: 'stato-domanda', url: ST, dopo: async p => { await alleDomande(p); await p.click('#d-chi .domanda-bottone'); await p.waitForTimeout(900); }, inVista: '#d-chi .domanda-bottone, .domande-bolla'},
  // i dettagli a richiesta (al telefono: «I dettagli e le fonti» della tappa del microfono); dove non c'è il comando (al computer sono sempre aperti) lo stato è saltato
  {nome: 'stato-dettagli', url: ST, dopo: async p => { await allaCatena(p); const s = await p.$('.anello[data-anello=microfono] .anello-dettagli > summary'); if (!s || !await s.isVisible()) return false; await s.click(); await p.waitForTimeout(700); }, inVista: '.anello[data-anello=microfono] .anello-dettagli[open] > summary, .anello[data-anello=microfono] .anello-dettagli[open] > p:first-of-type'},
  {nome: 'stato-copia-fatta', url: ST, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); }); await allInoltra(p); if (!await p.isVisible('.copia-messaggio')) return false; await p.click('.copia-messaggio'); await p.waitForTimeout(700); }, inVista: '.copia-messaggio, .inoltra-esito .copia-fatto'},
  {nome: 'stato-copia-non-riuscita', url: ST, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('no')); }); await allInoltra(p); if (!await p.isVisible('.copia-messaggio')) return false; await p.click('.copia-messaggio'); await p.waitForTimeout(700); }, inVista: '.copia-messaggio, .inoltra-esito .copia-errore'},
];

// «installa» (incarico 3c): la pagina a riposo e gli stati che ne cambiano l'impaginazione. La distribuzione scelta (cambia i comandi di ogni tratto:
// l'archivio ne ha di più), la frase della finestra premuta (la finestra cambia riga di stato e torna «Scarica la voce»), il menu aperto, la copia di un
// comando e dell'indirizzo (gli appunti si simulano, come per «non ancora» e «stato»).
const IN = 'it/installa/';
const aTratto = sel => async p => { await p.evaluate(s => document.querySelector(s).scrollIntoView({block: 'start'}), sel); await p.waitForTimeout(900); };
const statiInstalla = [
  {nome: 'installa', url: IN},
  {nome: 'installa-menu', url: IN, dopo: async p => { if (!await p.isVisible('.pulsante-menu')) return false; await p.click('.pulsante-menu'); await p.waitForTimeout(500); }, inVista: '#menu.aperto'},
  {nome: 'installa-archivio', url: IN, dopo: async p => { await p.click('label[for=sistema-tar]'); await p.waitForTimeout(600); }, inVista: 'label[for=sistema-tar]'},
  // la frase premuta: la finestra (la riga di stato che cambia) e la frase premuta stanno nello schermo sotto la barra; dove insieme non ci stanno vince la finestra (limiti, sotto)
  {nome: 'installa-frase', url: IN, dopo: async p => { await aTratto('#apri')(p); await p.locator('.frase-bottone[data-stato=curl]').scrollIntoViewIfNeeded(); await p.click('.frase-bottone[data-stato=curl]'); await p.waitForTimeout(1200); }, inVista: '.finestra.avvio .f-stato, .frase-bottone[data-stato=curl]'},
  {nome: 'installa-frase-microfono', url: IN, dopo: async p => { await aTratto('#apri')(p); await p.locator('.frase-bottone[data-stato=microfono]').scrollIntoViewIfNeeded(); await p.click('.frase-bottone[data-stato=microfono]'); await p.waitForTimeout(1200); }, inVista: '.finestra.avvio .f-stato, .frase-bottone[data-stato=microfono]'},
  {nome: 'installa-frase-tolta', url: IN, dopo: async p => { await aTratto('#apri')(p); await p.locator('.frase-bottone[data-stato=rete]').scrollIntoViewIfNeeded(); await p.click('.frase-bottone[data-stato=rete]'); await p.waitForTimeout(900); await p.click('.frase-bottone[data-stato=rete]'); await p.waitForTimeout(1200); }, inVista: '.finestra.avvio .f-stato, .frase-bottone[data-stato=rete]'},
  {nome: 'installa-copia-fatta', url: IN, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); }); await aTratto('#passo-controlla')(p); if (!await p.isVisible('#passo-controlla .copia')) return false; await p.click('#passo-controlla .copia'); await p.waitForTimeout(400); }, inVista: '#passo-controlla .comando.copiato'},
  {nome: 'installa-copia-non-riuscita', url: IN, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('no')); }); await aTratto('#passo-controlla')(p); if (!await p.isVisible('#passo-controlla .copia')) return false; await p.click('#passo-controlla .copia'); await p.waitForTimeout(400); }, inVista: '#passo-controlla .comando-errore'},
  {nome: 'installa-indirizzo-copiato', url: IN, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); }); await aTratto('#inoltra')(p); if (!await p.isVisible('.copia-indirizzo')) return false; await p.click('.copia-indirizzo'); await p.waitForTimeout(700); }, inVista: '.copia-indirizzo, .copia-fatto'},
  {nome: 'installa-indirizzo-non-copiato', url: IN, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('no')); }); await aTratto('#inoltra')(p); if (!await p.isVisible('.copia-indirizzo')) return false; await p.click('.copia-indirizzo'); await p.waitForTimeout(700); }, inVista: '.copia-indirizzo, .copia-errore'},
];

export default {
  // il sito costruito e servito in locale (docs/releasing.md, «Website»)
  base: process.env.ANTEPRIMA || 'http://127.0.0.1:8765/kalliope/',
  // il sito costruito ha una cartella per lingua: la home in italiano sta in it/, l'indirizzo principale è la scelta della lingua
  pagine: [{nome: 'home', url: 'it/'}, {nome: 'scelta-lingua', url: ''}, {nome: 'catalogo', url: 'design-system/catalogo/'}, ...statiNonAncora, ...statiStato, ...statiInstalla],
  sorgenti: {
    token: 'token.css',
    css: ['base.css', 'componenti/*.css', 'catalogo/*.css'],
    // le pagine che devono avere la riga text-scale: la home non l'ha (SISTEMA.md, «Da decidere»), il catalogo sì
    html: ['catalogo/index.html'],
    // gli stili dentro le pagine (<style>)
    pagine: ['../website/index.html', '../website/lingue.html', 'catalogo/index.html', '../website/non-ancora/index.html', '../website/stato/index.html', '../website/installa/index.html', '../website/riunione/index.html', '../website/404.html'],
    // gli script che mettono variabili sugli elementi (setProperty('--x', …)): la scena e il catalogo
    script: ['marchio/*.js', '../website/scena.js', '../website/testi.js', '../website/lingua.js', '../website/componenti.js', 'catalogo/*.js', '../website/cornice.js', '../website/non-ancora/non-ancora.js', '../website/stato/stato.js', '../website/installa/installa.js', '../website/riunione/aiuto.js'],
    perElemento: [],
    // le larghezze a cui la pagina cambia impaginazione (@media, @container): non si leggono da una variabile
    soglie: ['280px', '349px', '350px', '360px', '374px', '420px', '440px', '500px', '501px', '699px', '759px', '760px', '761px', '790px', '791px', '799px', '802px', '819px', '840px', '959px', '999px', '1000px', '1010px', '1180px', '1181px', '1209px'],
    vincoli: {},
  },
  // ciò che a una misura non può stare insieme (esame-impaginazione.mjs, dispositivi-qa.mjs): una voce per decisione
  limiti: [
    // Regola della cornice (design/lavoro/3a-non-ancora/PIANO.md, «La cornice»): nel primo schermo vince il comando; quando un gesto apre qualcosa vince
    // ciò che il gesto ha aperto, e a quelle altezze la riunione si abbassa perché il comando resti (pagina.css, .tavolo-pagina: rifinitura 3a-r, N1).
    // Mentre suona, la bolla dove le parole si accendono e «Pausa» stanno insieme a ogni misura provata (844×390, 915×412, 326×326 compresi): nessun limite.
    // Con il messaggio d'errore la riunione si abbassa fino a 60 px e al computer da 500 px d'altezza la bolla e il messaggio stanno insieme. Restano
    // le misure dove nemmeno così basta: il messaggio d'errore sta per intero nello schermo, vicino al comando che l'ha causato, e vince sulla bolla.
    {pagina: 'non-ancora-errore-audio', misure: '844x390, 326x326', che: 'FUORI VISTA', cosa: 'div.bolla.bolla-chiusa',
      perche: 'schermo basso con il messaggio d\'errore: la riunione è già alla sua altezza minima (60 px), o al telefono il messaggio è alto 182-226 px (a capo secondo la larghezza): non stanno insieme; vince il messaggio (PIANO.md, «La cornice»)'},
    {pagina: 'non-ancora-errore-audio', misure: '915x412, 390x500, 390x501, 320x568', che: 'COPERTO DOPO IL GESTO', cosa: 'div.bolla.bolla-chiusa',
      perche: 'come sopra: la bolla scorre sotto la barra (la si vede in parte) perché il messaggio d\'errore stia per intero nello schermo (PIANO.md, «La cornice»)'},
    {pagina: 'non-ancora-errore-audio', misure: '326x326', che: 'FUORI VISTA', cosa: 'button.pillola.voce-chiara',
      perche: 'schermo quadrato da 326 px: il messaggio d\'errore (con «Riprova» e il file) vince sul comando «Ascolta», che resta sopra il bordo (PIANO.md, «La cornice»)'},
    // «stato», la risposta nella bolla. A 326×326 la bolla sta tutta nello schermo (234 px) ma con la domanda premuta sopra non c'è spazio (246 px sotto la barra): vince la bolla, che ripete la
    // domanda in testa (confermato dal giudice, secondo sguardo, questione 2).
    // A 844×390 tre risposte («E se scrivere è difficile?», «Ha frasi pronte o simboli?», «Chi c'è dietro?»: 328, 362 e 362 px) sono più alte dello spazio sotto la barra (306 px). Il limite di
    // prima (bolla appiccicata che ne mostrava sempre la stessa parte, e la domanda premuta fuori vista) non c'è più (rifinitura 3b-r, stato.js `adatta()`): la bolla non si appiccica, sta accanto
    // alla sua domanda e scorre con la pagina, e si legge intera (`prove/domande-lettura.mjs`). Lo strumento segnala ancora il fondo, perché chiede che una cosa non più alta dello schermo
    // (390 px) ci stia tutta e questa, con la barra, non può: la parte alta sta in vista. Una voce sola, per la sola bolla.
    {pagina: 'stato-domanda', misure: '844x390', che: 'FUORI VISTA', cosa: 'div#domande-risposta',
      perche: 'telefono girato: la bolla più alta dello spazio sotto la barra (362 contro 306 px) non è appiccicata: scorre con la pagina accanto alla sua domanda, comincia in vista e il fondo si legge scorrendo (3b-r)'},
    {pagina: 'stato-domanda', misure: '326x326', che: 'FUORI VISTA', cosa: 'button.domanda-bottone',
      perche: 'schermo quadrato: la bolla sta tutta nello schermo (234 px) ma con la domanda premuta sopra non ci sta (246 px di spazio sotto la barra): vince la bolla, che ripete la domanda in testa (3b-b, da confermare)'},
    // limiti di installa (3c-b): la frase premuta sotto il bordo dove con la finestra non ci sta (misure lette dall'esame, una voce per stato)
    {pagina: 'installa-frase', misure: '326x326, 844x390', che: 'FUORI VISTA', cosa: 'button.frase-bottone',
      perche: 'la frase premuta cambia la finestra: la finestra sta nello schermo, sotto la barra, e la frase premuta con lei dove ci stanno insieme; dove insieme non ci stanno vince ciò che il gesto ha aperto, cioè la finestra (regola della cornice, 3a-non-ancora/PIANO.md «La cornice», punto 2). Scritto dalla costruzione 3c-b, da confermare alla direzione, con le foto in 3c-installa/costruzione/foto/difetti/'},
    {pagina: 'installa-frase-microfono', misure: '320x568, 326x326, 360x640, 360x740, 390x500, 390x501, 390x667, 390x699, 390x700, 421x616, 466x678, 844x390, 844x500, 844x501, 844x699, 844x700, 861x609, 951x669', che: 'FUORI VISTA', cosa: 'button.frase-bottone',
      perche: 'la frase premuta cambia la finestra: la finestra sta nello schermo, sotto la barra, e la frase premuta con lei dove ci stanno insieme; dove insieme non ci stanno vince ciò che il gesto ha aperto, cioè la finestra (regola della cornice, 3a-non-ancora/PIANO.md «La cornice», punto 2). Scritto dalla costruzione 3c-b, da confermare alla direzione, con le foto in 3c-installa/costruzione/foto/difetti/'},
    {pagina: 'installa-frase-tolta', misure: '326x326, 390x500, 390x501, 844x390', che: 'FUORI VISTA', cosa: 'button.frase-bottone',
      perche: 'la frase premuta cambia la finestra: la finestra sta nello schermo, sotto la barra, e la frase premuta con lei dove ci stanno insieme; dove insieme non ci stanno vince ciò che il gesto ha aperto, cioè la finestra (regola della cornice, 3a-non-ancora/PIANO.md «La cornice», punto 2). Scritto dalla costruzione 3c-b, da confermare alla direzione, con le foto in 3c-installa/costruzione/foto/difetti/'},
    // fine dei limiti di installa
  ],
  // il testo che si legge e non si vede (.solo-lettori) è ritagliato apposta
  escludi: '.solo-lettori',
  lingua: 'it-IT',
  attesa: 1500,
  cartella: '/tmp/metodo-qa-kalliope-sistema',
};
