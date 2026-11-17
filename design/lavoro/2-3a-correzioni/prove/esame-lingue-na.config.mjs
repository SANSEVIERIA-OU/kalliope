// L'esame dell'impaginazione per «non ancora» in ogni lingua di prova (incarico 2-f): la pagina a riposo, l'ascolto della chiusura (mentre suona) e la copia dell'indirizzo; le stesse
// tre cose dell'esame di «non ancora» in italiano, con le lingue (e le pseudo-lingue) di prova. Uso:
//   METODO_CONFIG=<questo file> node <skill>/scripts/esame-impaginazione.mjs chromium normale <filtro: «ar_na», «ur_», …> <misure>
// Il limite dichiarato è la decisione di L1: a 326×326, dove la riunione è già al suo minimo e la bolla ha una riga in più o righe più alte (urdu, en-XA), il pulsante «Pausa» resta in vista
// e la bolla sale sotto la barra del poco che manca (non-ancora.js, mostraInsieme). Nell'esame italiano non serve (la bolla ci sta): per questo sta qui e non in metodo.config.mjs.
const LINGUE = {ar: 'ar/', ur: 'ur/', hi: 'hi/', bn: 'bn/', zh: 'zh/', el: 'el/', de: 'de/', fi: 'fi/', enXA: 'en-XA/', arXB: 'ar-XB/', it: 'it/'};
const allaChiusura = async p => { await p.evaluate(() => document.querySelector('.chiusura .tavolo').scrollIntoView({block: 'start'})); await p.waitForTimeout(900); };
const alQuando = async p => { await p.evaluate(() => document.querySelector('#quando').scrollIntoView({block: 'start'})); await p.waitForTimeout(900); };
const stati = (L, url) => [
  {nome: `${L}_na`, url: `${url}non-ancora/`},
  {nome: `${L}_na_ascolto`, url: `${url}non-ancora/`, dopo: async p => { await allaChiusura(p); await p.click('.ascolta-ferma'); await p.waitForTimeout(1900); }, inVista: '.ascolta-ferma, .chiusura .bolla-chiusa .bolla-testo'},
  {nome: `${L}_na_copia`, url: `${url}non-ancora/`, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); }); await alQuando(p); if (!await p.isVisible('.copia-indirizzo')) return false; await p.click('.copia-indirizzo'); await p.waitForTimeout(700); }, inVista: '.copia-indirizzo, .copia-fatto'},
];
export default {
  base: process.env.ANTEPRIMA || 'http://127.0.0.1:8890/',
  pagine: Object.entries(LINGUE).flatMap(([L, url]) => stati(L, url)),
  sorgenti: {token: 'token.css', css: [], html: [], pagine: [], script: [], perElemento: [], soglie: [], vincoli: {}},
  limiti: [
    {pagina: ['ur_na_ascolto', 'enXA_na_ascolto', 'arXB_na_ascolto', 'bn_na_ascolto', 'hi_na_ascolto', 'ar_na_ascolto'], misure: '326x326', che: 'COPERTO DOPO IL GESTO', cosa: 'p.bolla-testo',
     perche: 'L1 (2-f): a 326×326 con righe alte o più righe la riunione è già al minimo e bolla e «Pausa» non ci stanno insieme: vince il pulsante, e la bolla sale sotto la barra del poco che manca; delle parole resta sotto la barra al più l\'interlinea della prima riga (urdu: 2,6 px; `suona-basso.mjs` lo misura)'},
  ],
  escludi: '.solo-lettori',
  lingua: 'it-IT',
  attesa: 1500,
  lavoratori: 4,
  cartella: process.env.ESAME_CARTELLA || '/tmp/lavoro-2f-qa-lingue',
};
