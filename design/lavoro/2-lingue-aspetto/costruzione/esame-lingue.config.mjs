// La configurazione dell'esame dell'impaginazione per le lingue (incarico 2-b): la home in ogni lingua di prova e ogni stato che cambia l'impaginazione:
// il menu aperto, la scelta della lingua aperta (nel menu dove il menu è chiuso), l'ascolto. Uso:
//   ANTEPRIMA=http://127.0.0.1:PORTA/ METODO_CONFIG=<questo file> node <skill>/scripts/esame-impaginazione.mjs chromium normale ar_ <misure>
// o, con il server di prova, design/lavoro/1-lingue-sito/prove/con-server.mjs <sito> <porta> node …
const LINGUE = {ar: 'ar/', ur: 'ur/', hi: 'hi/', bn: 'bn/', zh: 'zh/', el: 'el/', de: 'de/', fi: 'fi/', enXA: 'en-XA/', arXB: 'ar-XB/', it: 'it/'};
const apriMenu = async p => {   // dove la barra mostra «Menu» lo apre; dove le voci sono in riga non c'è niente da aprire
  if (!await p.isVisible('.pulsante-menu')) return null;
  await p.click('.pulsante-menu'); await p.waitForTimeout(500); return true;
};
const stati = (L, url) => [
  {nome: `${L}_home`, url},
  {nome: `${L}_menu`, url, dopo: async p => { if (!await apriMenu(p)) return false; }, inVista: '#menu.aperto'},
  {nome: `${L}_selettore`, url, dopo: async p => {
      await apriMenu(p);
      if (!await p.isVisible('details.lingua-scelta > summary')) return false;
      await p.click('details.lingua-scelta > summary'); await p.waitForTimeout(500);
    }, inVista: 'details.lingua-scelta[open] > summary, details.lingua-scelta[open] .lingue-elenco li:nth-child(-n+4)'},   // il comando e le prime due righe dell'elenco (con 30 lingue l'elenco è più alto del menu, che scorre: lingua.js porta in vista le prime righe)
  {nome: `${L}_ascolto`, url, dopo: async p => { await p.route(/\/voce\/(giulia|marco)-\d\.(opus|mp3)/, () => {}); if (!await p.isVisible('#ascolta')) return false; await p.click('#ascolta'); await p.waitForTimeout(1000); }, inVista: '#ascolto:not([hidden]), #ascolta'},
];
export default {
  base: process.env.ANTEPRIMA || 'http://127.0.0.1:8840/',
  pagine: Object.entries(LINGUE).flatMap(([L, url]) => stati(L, url)),
  sorgenti: {token: 'token.css', css: [], html: [], pagine: [], script: [], perElemento: [], soglie: [], vincoli: {}},
  limiti: [],
  escludi: '.solo-lettori',
  lingua: 'it-IT',
  attesa: 1500,
  lavoratori: 4,
  cartella: process.env.ESAME_CARTELLA || '/tmp/lavoro-2b-esame',
};
