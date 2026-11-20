// L'esame dell'impaginazione per «installa» in ogni lingua di prova (incarico 3c-b): la pagina a riposo, il menu, l'archivio scelto, la frase della finestra premuta, la copia di un comando riuscita e non riuscita
// e l'indirizzo copiato, con le nove lingue di prova (i testi di «installa» restano in italiano nei loro cataloghi: la prova guarda lo specchio, i caratteri e la barra) e le due pseudo-lingue
// (tutti i testi: en-XA più lunga del 40%, ar-XB da destra a sinistra). Uso: RADICE=<albero> METODO_CONFIG=<questo file> node <skill>/scripts/esame-impaginazione.mjs chromium normale <filtro: «_enXA_», «_ar_», …> <misure>
// I limiti sono quelli della pagina in italiano (design-system/metodo.config.mjs), per lingua.
const LINGUE = {ar: 'ar/', ur: 'ur/', hi: 'hi/', bn: 'bn/', zh: 'zh/', el: 'el/', de: 'de/', fi: 'fi/', bg: 'bg/', enXA: 'en-XA/', arXB: 'ar-XB/'};
const aTratto = sel => async p => { await p.evaluate(s => document.querySelector(s).scrollIntoView({block: 'start'}), sel); await p.waitForTimeout(900); };
const finta = riesce => p => p.evaluate(r => { navigator.clipboard.writeText = () => r ? Promise.resolve() : Promise.reject(new Error('no')); }, riesce);
const stati = (L, u) => [
  {nome: `${L}_in`, url: `${u}installa/`},
  {nome: `${L}_in_menu`, url: `${u}installa/`, dopo: async p => { if (!await p.isVisible('.pulsante-menu')) return false; await p.click('.pulsante-menu'); await p.waitForTimeout(500); }, inVista: '#menu.aperto'},
  {nome: `${L}_in_archivio`, url: `${u}installa/`, dopo: async p => { await p.click('label[for=sistema-tar]'); await p.waitForTimeout(700); }, inVista: 'label[for=sistema-tar]'},
  {nome: `${L}_in_frase`, url: `${u}installa/`, dopo: async p => { await aTratto('#apri')(p); await p.locator('.frase-bottone[data-stato=curl]').scrollIntoViewIfNeeded(); await p.click('.frase-bottone[data-stato=curl]'); await p.waitForTimeout(1300); }, inVista: '.finestra.avvio .f-stato, .frase-bottone[data-stato=curl]'},
  {nome: `${L}_in_copia`, url: `${u}installa/`, dopo: async p => { await finta(true)(p); await aTratto('#passo-controlla')(p); if (!await p.isVisible('#passo-controlla .copia')) return false; await p.click('#passo-controlla .copia'); await p.waitForTimeout(700); }, inVista: '#passo-controlla .comando.copiato'},
  {nome: `${L}_in_copia_no`, url: `${u}installa/`, dopo: async p => { await finta(false)(p); await aTratto('#passo-controlla')(p); if (!await p.isVisible('#passo-controlla .copia')) return false; await p.click('#passo-controlla .copia'); await p.waitForTimeout(700); }, inVista: '#passo-controlla .comando-errore'},
  {nome: `${L}_in_indirizzo`, url: `${u}installa/`, dopo: async p => { await finta(true)(p); await aTratto('#inoltra')(p); if (!await p.isVisible('.copia-indirizzo')) return false; await p.click('.copia-indirizzo'); await p.waitForTimeout(900); }, inVista: '.copia-indirizzo, .copia-fatto'},
];
const base = (await import(`${process.env.RADICE}/design-system/metodo.config.mjs`)).default;
// i limiti della pagina in italiano valgono per gli stati che questa configurazione ha: la frase premuta (installa-frase → <lingua>_in_frase); gli stati della frase del microfono e della frase tolta
// non sono qui (le lingue provano la frase che porta a «curl»), e il loro limite resta alla pagina in italiano. Il nome dei limiti doveva coincidere con quello degli stati: prima no (20/11/2026).
const STATO = {'installa-frase': '_in_frase'};
const per = L => base.limiti.filter(l => typeof l.pagina === 'string' && STATO[l.pagina]).map(l => ({...l, pagina: L + STATO[l.pagina]}));
export default {
  base: process.env.ANTEPRIMA,
  pagine: Object.entries(LINGUE).flatMap(([L, u]) => stati(L, u)),
  sorgenti: {token: 'token.css', css: [], html: [], pagine: [], script: [], perElemento: [], soglie: [], vincoli: {}},
  limiti: Object.keys(LINGUE).flatMap(per),
  escludi: '.solo-lettori',
  lingua: 'it-IT',
  attesa: 1500,
  lavoratori: 3,
  cartella: process.env.ESAME_CARTELLA || '/tmp/lavoro-3cb-qa-lingue',
};
