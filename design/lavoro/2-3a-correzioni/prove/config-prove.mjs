// La configurazione con cui girano le prove di questo incarico: quella del progetto (design-system/metodo.config.mjs, con gli stati di «non ancora» e di «stato») dell'albero di prova
// (RADICE), con l'indirizzo e la cartella dei risultati della corsa. Uso: METODO_CONFIG=…/config-prove.mjs RADICE=/tmp/lavoro-2f-radice-<nome>
const RADICE = process.env.RADICE || '/tmp/lavoro-2f-radice-mio2-it';
const base = (await import(`${RADICE}/design-system/metodo.config.mjs`)).default;
export default {...base, base: process.env.ANTEPRIMA, cartella: process.env.QA_CARTELLA || '/tmp/lavoro-2f-qa'};
