// La configurazione con cui girano le prove di questo incarico: quella del progetto (design-system/metodo.config.mjs, con gli stati di «non ancora», «stato» e «installa») dell'albero di prova
// (RADICE), con l'indirizzo e la cartella dei risultati della corsa. Uso: METODO_CONFIG=…/config-prove.mjs RADICE=/tmp/lavoro-3cb-radice-<nome>
const RADICE = process.env.RADICE;
if (!RADICE) throw new Error('manca RADICE (l\'albero di prova)');
const base = (await import(`${RADICE}/design-system/metodo.config.mjs`)).default;
// due pagine alla volta: la memoria della macchina è stretta (un browser per volta)
// PAGINE=nome,nome: solo quelle (per le prove del testo grande, a riposo e con due stati)
const solo = process.env.PAGINE ? new Set(process.env.PAGINE.split(',')) : null;
export default {...base, base: process.env.ANTEPRIMA, cartella: process.env.QA_CARTELLA || '/tmp/lavoro-3cb-qa', lavoratori: 2, pagine: solo ? base.pagine.filter(p => solo.has(p.nome)) : base.pagine,
  // i limiti delle pagine lasciate fuori non servono (e lo strumento rifiuta un limite che nomina una pagina che non c'è)
  limiti: solo ? base.limiti.map(l => ({...l, pagina: [].concat(l.pagina).filter(n => solo.has(n))})).filter(l => l.pagina.length) : base.limiti};
