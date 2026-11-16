/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Configurazione del controllo «i valori stanno solo nei token» per il design system di Kalliope.
// Si lancia da questa cartella:  node <skill>/scripts/controlla-sorgenti.mjs
// Riguarda solo ciò che usa questo sistema: la home (../website/index.html), la pagina di scelta della lingua (../website/lingue.html), il catalogo
// e le pagine interne già rifatte nella direzione 2 (../website/non-ancora/, con ../website/cornice.js). Le altre pagine del sito
// hanno ancora i fogli di prima (website/stile/) e il loro controllo (design/metodo.config.mjs).
export default {
  // il sito costruito e servito in locale (docs/releasing.md, «Website»)
  base: process.env.ANTEPRIMA || 'http://127.0.0.1:8765/kalliope/',
  // il sito costruito ha una cartella per lingua: la home in italiano sta in it/, l'indirizzo principale è la scelta della lingua
  pagine: [{nome: 'home', url: 'it/'}, {nome: 'scelta-lingua', url: ''}, {nome: 'catalogo', url: 'design-system/catalogo/'}, {nome: 'non-ancora', url: 'it/non-ancora/'}],
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
    soglie: ['349px', '350px', '360px', '374px', '420px', '440px', '699px', '759px', '760px', '761px', '790px', '791px', '799px', '802px', '819px', '840px', '959px', '999px', '1000px', '1010px', '1180px', '1181px', '1209px'],
    vincoli: {},
  },
  lingua: 'it-IT',
  attesa: 1500,
  cartella: '/tmp/metodo-qa-kalliope-sistema',
};
