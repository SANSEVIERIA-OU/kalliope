// Come config-prove.mjs, ma sulle pagine di una pseudo-lingua (en-XA, ar-XB): gli stessi stati di «non ancora», con l'indirizzo della lingua.
// Uso: PSEUDO=en-XA METODO_CONFIG=…/config-pseudo.mjs
const RADICE = process.env.RADICE || '/tmp/lavoro-3ar-lavoro/radice-F';
const base = (await import(`${RADICE}/design-system/metodo.config.mjs`)).default;
const lingua = process.env.PSEUDO || 'en-XA';
export default {...base, base: process.env.ANTEPRIMA, cartella: process.env.QA_CARTELLA || '/tmp/lavoro-3ar-qa-pseudo',
  pagine: base.pagine.filter(p => /^non-ancora/.test(p.nome)).map(p => ({...p, url: p.url.replace('it/', `${lingua}/`)})),
  // i limiti di «non ancora» valgono anche qui: stessa pagina, stesse misure
};
