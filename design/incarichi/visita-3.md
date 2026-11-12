# Incarico: visita e scheda di R20 Ottografie, R21 Lonely Planet (Venezia), R22 Searching for Birds (attività `visit` + `site-analysis` + `motion`)

Leggi prima `design/incarichi/comune.md`. Ruolo: vibe-next:design-visual. Altri due worker visitano altri
riferimenti in parallelo: usa solo il tuo posto browser e i file dei tuoi ID.

## Scopo
Visitare ciascun riferimento e compilarne la scheda, come chiedono `<skill>/references/riferimenti.md`,
`<skill>/references/movimento.md` e `<skill>/references/browser.md`, con le domande e le varianti di
`design/ricerca/piano.md` §7 (comuni, per compito, varianti e misure di §7.3) e il vocabolario di §8.
URL, categoria e compiti attesi: `design/ricerca/selezione.md`. Contesto del prodotto: `design/progetto.md`.

## Come
- Non c'è Chrome MCP in questo host: usa `passo.mjs` (posto `leggero`, senza finestra), un gesto alla volta,
  guardando ogni foto; dichiaralo nella scheda. Mai la modalità `finestra` (comune.md).
- Prima il computer (1440×900) e il telefono (390×844), poi le varianti di §7.3; poi l'inventario del movimento.
  Senza JavaScript, rete lenta e stampa con uno script tuo in `design/ricerca/strumenti/` (nome con il tuo numero
  di worker), lanciato quando non hai un posto aperto.
- Un blocco (anti-bot, 4xx/5xx persistente): schermata, limite, una riprova, poi segnalalo nel progresso e passa al
  successivo. Nessun modulo, account o acquisto.

## Risultati per ogni ID
`design/ricerca/schede/<ID>.md`, `design/ricerca/osservazioni/<ID>.json` (controllato con
`node <skill>/scripts/confronta-riferimenti.mjs --controlla …`, uscita 0 o solo avvisi motivati),
`design/ricerca/prove/<ID>/`, `design/ricerca/movimento/<ID>.md`; le lacune in fondo alla scheda.
Progresso: `design/incarichi/visita-3/progresso.md`, aggiornato a ogni riferimento finito.
Risposta finale: al massimo 12 righe (cosa hai visto di utile per Kalliope, peculiarità, lacune, blocchi).

## Completezza
Ogni riferimento ha la scheda completa (15 punti di riferimenti.md §3), osservazioni valide, foto per ogni variante
eseguita, l'inventario del movimento e la lista di ciò che non si è potuto osservare, con il motivo.
