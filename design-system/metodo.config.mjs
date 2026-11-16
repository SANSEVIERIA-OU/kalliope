/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Configurazione del controllo «i valori stanno solo nei token» per il design system di Kalliope.
// Si lancia da questa cartella:  node <skill>/scripts/controlla-sorgenti.mjs
// Riguarda solo ciò che usa questo sistema: la home (../website/index.html) e il catalogo. Le altre pagine del sito
// hanno ancora i fogli di prima (website/stile/) e il loro controllo (design/metodo.config.mjs).
export default {
  // il sito costruito e servito in locale (docs/releasing.md, «Website»)
  base: process.env.ANTEPRIMA || 'http://127.0.0.1:8765/kalliope/',
  pagine: [{nome: 'home', url: ''}, {nome: 'catalogo', url: 'design-system/catalogo/'}],
  sorgenti: {
    token: 'token.css',
    css: ['base.css', 'componenti/*.css', 'catalogo/*.css'],
    // le pagine che devono avere la riga text-scale: la home non l'ha (SISTEMA.md, «Da decidere»), il catalogo sì
    html: ['catalogo/index.html'],
    // gli stili dentro le pagine (<style>)
    pagine: ['../website/index.html', 'catalogo/index.html'],
    // gli script che mettono variabili sugli elementi (setProperty('--x', …)): la scena e il catalogo
    script: ['../website/scena.js', 'catalogo/*.js'],
    perElemento: [],
    // le larghezze a cui la pagina cambia impaginazione (@media, @container): non si leggono da una variabile
    soglie: ['349px', '350px', '360px', '374px', '420px', '440px', '699px', '759px', '760px', '761px', '790px', '791px', '799px', '802px', '819px', '840px', '959px', '999px', '1000px', '1010px', '1180px', '1181px', '1209px'],
    vincoli: {},
  },
  lingua: 'it-IT',
  attesa: 1500,
  cartella: '/tmp/metodo-qa-kalliope-sistema',
};
