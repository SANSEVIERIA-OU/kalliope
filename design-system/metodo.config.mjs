/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
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

export default {
  // il sito costruito e servito in locale (docs/releasing.md, «Website»)
  base: process.env.ANTEPRIMA || 'http://127.0.0.1:8765/kalliope/',
  // il sito costruito ha una cartella per lingua: la home in italiano sta in it/, l'indirizzo principale è la scelta della lingua
  pagine: [{nome: 'home', url: 'it/'}, {nome: 'scelta-lingua', url: ''}, {nome: 'catalogo', url: 'design-system/catalogo/'}, ...statiNonAncora],
  sorgenti: {
    token: 'token.css',
    css: ['base.css', 'componenti/*.css', 'catalogo/*.css'],
    // le pagine che devono avere la riga text-scale: la home non l'ha (SISTEMA.md, «Da decidere»), il catalogo sì
    html: ['catalogo/index.html'],
    // gli stili dentro le pagine (<style>)
    pagine: ['../website/index.html', '../website/lingue.html', 'catalogo/index.html', '../website/non-ancora/index.html'],
    // gli script che mettono variabili sugli elementi (setProperty('--x', …)): la scena e il catalogo
    script: ['../website/scena.js', '../website/testi.js', '../website/lingua.js', 'catalogo/*.js', '../website/cornice.js', '../website/non-ancora/non-ancora.js'],
    perElemento: [],
    // le larghezze a cui la pagina cambia impaginazione (@media, @container): non si leggono da una variabile
    soglie: ['349px', '350px', '360px', '374px', '420px', '440px', '500px', '699px', '759px', '760px', '761px', '790px', '791px', '799px', '802px', '819px', '840px', '959px', '999px', '1000px', '1010px', '1180px', '1181px', '1209px'],
    vincoli: {},
  },
  // ciò che a una misura non può stare insieme (esame-impaginazione.mjs, dispositivi-qa.mjs): una voce per decisione
  limiti: [
    // Dove l'altezza manca la riunione, il comando e il messaggio non stanno insieme: vincono il comando e il messaggio, la riunione scorre sotto la barra
    // (design/lavoro/3a-non-ancora/PIANO.md, «La cornice»: «quando l'altezza manca, vince il comando; la scena cede il posto»; come nella home, scena.js 8c:
    // «dove le due cose non stanno insieme (telefono girato) vince la scheda: i comandi»). Decisione della costruzione sul modello di quella della direzione: da confermare.
    {pagina: 'non-ancora-errore-audio', misure: '*x500, *x501, 844x390, 915x412, 326x326, 320x568', che: 'FUORI VISTA', cosa: 'div.bolla.bolla-chiusa',
      perche: 'schermo basso: la bolla, i riquadri, il comando e il messaggio d\'errore non stanno insieme; vincono il comando e il messaggio (PIANO.md, «La cornice»; scena.js 8c)'},
    {pagina: 'non-ancora-ascolto', misure: '844x390, 915x412, 326x326', che: 'FUORI VISTA', cosa: 'button.pillola.voce-chiara',
      perche: 'telefono girato e schermo quadrato: la bolla dove le parole si accendono e il comando non stanno insieme (la riunione sola è alta quasi come lo schermo); vince la bolla, il comando «Pausa» resta sotto il bordo (a 326 px per 2 px). Scelta della costruzione, diversa da scena.js 8c (lì vince il comando): da decidere alla direzione (foto in costruzione/foto-difetti/)'},
    {pagina: 'non-ancora-errore-audio', misure: '326x326', che: 'FUORI VISTA', cosa: 'button.pillola.voce-chiara',
      perche: 'schermo quadrato da 326 px: il messaggio d\'errore (con «Riprova» e il file) vince sul comando «Ascolta», che resta sopra il bordo (PIANO.md, «La cornice»; scena.js 8c)'},
  ],
  // il testo che si legge e non si vede (.solo-lettori) è ritagliato apposta
  escludi: '.solo-lettori',
  lingua: 'it-IT',
  attesa: 1500,
  cartella: '/tmp/metodo-qa-kalliope-sistema',
};
