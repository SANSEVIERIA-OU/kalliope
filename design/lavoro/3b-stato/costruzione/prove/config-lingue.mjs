// L'esame dell'impaginazione per «stato» in ogni lingua di prova (incarico 3b-b): la pagina a riposo, il menu, la risposta nella bolla, i dettagli (al telefono) e la copia del messaggio,
// con le nove lingue di prova (i testi di «stato» restano in italiano nei loro cataloghi: la prova guarda lo specchio, i caratteri e la barra) e le due pseudo-lingue (tutti i testi: en-XA più lunga
// del 40%, ar-XB da destra a sinistra). Uso: METODO_CONFIG=<questo file> node <skill>/scripts/esame-impaginazione.mjs chromium normale <filtro: «_enXA», «_ar_», …> <misure>
// I limiti sono quelli della pagina in italiano (design-system/metodo.config.mjs), per lingua: la bolla più alta dello spazio (844×390) e la domanda premuta sopra la bolla (326×326).
const LINGUE = {ar: 'ar/', ur: 'ur/', hi: 'hi/', bn: 'bn/', zh: 'zh/', el: 'el/', de: 'de/', fi: 'fi/', bg: 'bg/', enXA: 'en-XA/', arXB: 'ar-XB/'};
const alleDomande = async p => { await p.evaluate(() => document.querySelector('#per-chi').scrollIntoView({block: 'start'})); await p.waitForTimeout(900); };
const allInoltra = async p => { await p.evaluate(() => document.querySelector('#inoltra').scrollIntoView({block: 'start'})); await p.waitForTimeout(900); };
const allaCatena = async p => { await p.evaluate(() => document.querySelector('.anello[data-anello=microfono]').scrollIntoView({block: 'center'})); await p.waitForTimeout(900); };
const stati = (L, url) => [
  {nome: `${L}_st`, url: `${url}stato/`},
  {nome: `${L}_st_menu`, url: `${url}stato/`, dopo: async p => { if (!await p.isVisible('.pulsante-menu')) return false; await p.click('.pulsante-menu'); await p.waitForTimeout(500); }, inVista: '#menu.aperto'},
  {nome: `${L}_st_domanda`, url: `${url}stato/`, dopo: async p => { await alleDomande(p); await p.click('#d-chi .domanda-bottone'); await p.waitForTimeout(1300); }, inVista: '#d-chi .domanda-bottone, .domande-bolla'},
  {nome: `${L}_st_dettagli`, url: `${url}stato/`, dopo: async p => { await allaCatena(p); const s = await p.$('.anello[data-anello=microfono] .anello-dettagli > summary'); if (!s || !await s.isVisible()) return false; await s.click(); await p.waitForTimeout(900); }, inVista: '.anello[data-anello=microfono] .anello-dettagli[open] > summary, .anello[data-anello=microfono] .anello-dettagli[open] > p:first-of-type'},
  {nome: `${L}_st_copia`, url: `${url}stato/`, dopo: async p => { await p.evaluate(() => { navigator.clipboard.writeText = () => Promise.resolve(); }); await allInoltra(p); if (!await p.isVisible('.copia-messaggio')) return false; await p.click('.copia-messaggio'); await p.waitForTimeout(900); }, inVista: '.copia-messaggio, .inoltra-esito .copia-fatto'},
];
const base = (await import(`${process.env.RADICE}/design-system/metodo.config.mjs`)).default;
const lim = base.limiti.filter(l => l.pagina === 'stato-domanda');
export default {
  base: process.env.ANTEPRIMA,
  pagine: Object.entries(LINGUE).flatMap(([L, url]) => stati(L, url)),
  sorgenti: {token: 'token.css', css: [], html: [], pagine: [], script: [], perElemento: [], soglie: [], vincoli: {}},
  limiti: Object.keys(LINGUE).flatMap(L => lim.filter(l => !(['enXA', 'arXB'].includes(L) && l.cosa === 'div#domande-risposta' && l.misure === '844x390')).map(l => ({...l, pagina: `${L}_st_domanda`}))),   // le pseudo-lingue hanno risposte più corte a 844×390
  escludi: '.solo-lettori',
  lingua: 'it-IT',
  attesa: 1500,
  lavoratori: 4,
  cartella: process.env.ESAME_CARTELLA || '/tmp/lavoro-3bb-qa-lingue',
};
