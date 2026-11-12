/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// Configurazione degli strumenti del metodo per il sito di Kalliope (modello: config.esempio.mjs della skill).
// Il sito è servito sotto /kalliope/ come su GitHub Pages: gli indirizzi delle pagine sono relativi a quella base.
// Uso: node design/strumenti/con-server.mjs /tmp/kalliope-anteprima/NOME node <skill>/scripts/esame-impaginazione.mjs chromium tutti
export default {
  base: process.env.ANTEPRIMA || 'http://127.0.0.1:8765/kalliope/',
  lingue: ['it'],
  pagine: [
    {nome: 'home', url: ''},
    {nome: 'ascolta', url: 'ascolta/'},
    {nome: 'stato', url: 'stato/'},
    {nome: 'installa', url: 'installa/'},
    {nome: 'riunione', url: 'riunione/'},
    {nome: 'aiuto', url: 'aiuto/'},
    {nome: 'non-ancora', url: 'non-ancora/'},
    {nome: '404', url: 'questa-pagina-non-esiste/'},
    {nome: 'sistema', url: 'sistema/'},
    {nome: 'sistema-ricerca', url: 'sistema/ricerca/'},
  ],
  // I badge di movimento, il campo nascosto e l'audio nativo nascosto non sono testo da misurare
  escludi: '[data-qa-salta]',
  zone: '',
  pezzi: 'body > :not(dialog, script, style) > :not(dialog, script, style)',
  attesa: 600,
  lingua: 'it-IT',
  temi: ['light', 'dark'],
  cartella: '/tmp/metodo-qa-kalliope',
  sorgenti: {
    token: 'site/stile/token.css',
    css: ['site/stile/*.css'],
    html: ['site/**/*.html'],
    script: ['site/script/*.js'],
    perElemento: ['--h'],
    vincoli: {},   // due famiglie per scelta (T03): una per il corpo, una a spaziatura fissa per il testo digitato e i comandi
    soglie: ['30rem', '40rem', '48rem', '56rem'],
  },
};
