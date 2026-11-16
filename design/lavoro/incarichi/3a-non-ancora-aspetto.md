# Incarico 3a · La pagina «non ancora» nella direzione 2: aspetto e movimento

- **Attività**: `path-look` (skill `design-system-generator`, `routing.json`), ruolo **design-direction**.
- **Chi coordina**: la sessione principale. Il proprietario non legge questo file; le domande vanno a chi coordina,
  nella risposta finale.
- **Area tua**: `design/lavoro/3a-non-ancora/` (tieni lì `progresso.md` aggiornato a ogni unità finita: fatto, in
  corso, prossimo passo, ultimo comando, problemi aperti; lì vanno anche piano, elenco dei contenuti, foto e sequenze).

## Leggi prima

1. `CLAUDE.md` (tutto) e `design/lavoro/STATO.md` (decisioni del 16/11/2026).
2. La direzione scelta dal proprietario, che è il termine di confronto: `design/direzione-2/LEGGIMI.md`, `D2.md`,
   `PIANO.md` (la home intera, tratto per tratto), `COSTRUZIONE.md` (come è stata costruita e provata).
3. Il sistema su cui si costruisce: `design-system/SISTEMA.md`, `design-system/TOKEN.md`, `design-system/token.css`,
   `design-system/componenti/`, il catalogo (`design-system/catalogo/`). La home viva: `website/index.html`,
   `website/scena.js`.
4. La skill: `/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/` —
   `SKILL.md`, `references/direzione.md` (§6, il percorso nella direzione scelta), `references/giudizio.md` (parte D e
   «La pagina intera»: è ciò su cui ti giudicheranno), `references/movimento.md`, `references/scrittura.md`,
   `references/esecuzione.md` (regole dei worker).
5. `design/lavoro/ricerca/lingue.md`, sezione «CSS: da destra a sinistra e scritture».

## Lo scopo

Il proprietario ha chiesto di rifare le altre pagine del sito nella direzione 2, sopra il design system. Questa è la
prima: **«non ancora»** (Windows, macOS, telefono, altre lingue: oggi no, e perché). È anche la **prima pagina
interna**: la cornice che decidi qui (barra, apertura della pagina, come si passa da un tratto all'altro, piede) la
riprenderanno stato, installa, in riunione e 404. Decidila perché regga anche loro.

Il tuo lavoro è decidere e rendere **l'aspetto e il movimento della pagina intera** (direzione.md §6, punto 1). Il
completamento (stati, errori, tutte le larghezze, le prove complete, la segnatura per le traduzioni) lo farà dopo il
ruolo di costruzione, senza ridisegnare; poi un giudice che non sei tu; poi il proprietario.

## Che cosa dice la pagina

- Fonti: `design/progetto.md` §10 **P6** (e §1.4, §9 per ciò che è escluso e va spiegato, non nascosto) e la pagina di
  oggi `website/non-ancora/index.html`. La pagina nuova porta i fatti della vecchia, riordinati per la persona di P6.
- Il proprietario ha deciso che **i testi verranno riscritti da capo**: non rifinirli, non chiedere contenuti. Ma non
  inventare: nessuna funzione che il programma non ha, nessuna data promessa, nessuna alternativa di terzi (P6,
  «Regole»; dubbio E). Il feed delle release come modo di essere avvisati è segnato `[I]` nel documento: se lo usi,
  verifica che esista (`https://github.com/SANSEVIERIA-OU/kalliope/releases.atom`) e scrivi l'esito.
- Prima di rendere, scrivi in `design/lavoro/3a-non-ancora/CONTENUTI.md` (direzione.md §6, punto 0) una riga per voce:
  dove sta nella pagina, oppure «lasciata fuori» con il motivo.

## I vincoli

- **Lo stesso mondo della home**: un solo colore, la riunione, la bolla, i riquadri, le onde, la stessa curva d'entrata
  e lo stesso linguaggio di movimento (`D2.md`, `PIANO.md`). In ogni tratto qualcosa che accade perché serve a capire,
  a provare o a decidere; fra un tratto e l'altro un cambio di scena, non una fascia vuota; nessuna scheda uguale alle
  altre messa in fila (giudizio.md, parte D). Prima guarda che cosa fanno i riferimenti sotto il primo schermo e nelle
  pagine interne: `/workspace/prova-design-abc/prova-2/riferimenti/` (`primi-schermi/`, `sequenze/`, `schede/`,
  `classifica.md`) e `design/ricerca/schede/R*.md`.
- **Sopra il design system**: la pagina collega `design-system/token.css`, `base.css` e solo i componenti che usa,
  nell'ordine della home (`SISTEMA.md`, «Come si usa per un'altra pagina»). Ogni valore viene da `token.css`; un valore
  nuovo entra lì con il suo ruolo; un pezzo nuovo che le altre pagine riuseranno diventa un componente nuovo in
  `design-system/componenti/`. Nessun valore scritto a mano nella pagina, nessun secondo sistema.
- **Pronta per le lingue**: solo proprietà logiche (inizio/fine riga, mai sinistra/destra: la pagina verrà specchiata
  per arabo e urdu); ciò che ha un verso usa il meccanismo della direzione che l'incarico 1 sta preparando (guarda
  `design/lavoro/1-lingue-sito/progresso.md`); il testo resta leggibile in italiano nell'HTML; se la convenzione per
  segnare i testi da tradurre è già scritta in quel `progresso.md`, usala, altrimenti lascia il testo semplice (lo
  segnerà il ruolo di costruzione). Il testo deve poter crescere del 40% senza rompere la composizione.
- **Movimento ridotto e senza JavaScript**: un ripiego che mostra tutto, non un'esclusione.

## Lavoro in parallelo: attenzione

L'**incarico 1** (ruolo di costruzione) sta lavorando adesso su: `design-system/base.css`, `componenti/*.css` e
`catalogo/*.css` (converte sinistra/destra in inizio/fine), `token.css` (rinomina 6 token), `website/index.html`,
`website/scena.js`, `tools/site.py`. Quindi:
- non toccare la home, `scena.js`, `tools/site.py`, il catalogo;
- nei componenti esistenti e in `token.css` aggiungi soltanto, rileggi il file subito prima di ogni modifica e non
  annullare mai le modifiche altrui; preferisci file nuovi per i componenti nuovi;
- se `tools/site.py` non funziona perché l'incarico 1 lo sta cambiando, costruisci con la versione del commit:
  `mkdir -p /tmp/lavoro-3a-radice/tools && git -C /workspace/kalliope show HEAD:tools/site.py > /tmp/lavoro-3a-radice/tools/site.py && ln -sfn /workspace/kalliope/website /tmp/lavoro-3a-radice/website && ln -sfn /workspace/kalliope/design-system /tmp/lavoro-3a-radice/design-system`,
  poi `python3 -I /tmp/lavoro-3a-radice/tools/site.py --out /tmp/lavoro-3a-sito`.

## Le prove che fai tu

- Registra arrivo, scorrimento e i gesti alle due misure 390×844 e 1440×900 (`scripts/sequenza.mjs`); metti la pagina
  accanto agli scorrimenti dei tre riferimenti più forti e accanto alla home (`scripts/affianca.mjs`).
- `controlla-sorgenti.mjs` verde (da `design-system/`; aggiungi la pagina alla configurazione
  `design-system/metodo.config.mjs`, rileggendolo prima: lo tocca anche l'incarico 1).
- Scrivi il piano dei tratti (come `PIANO.md`: per ogni tratto che cosa è dentro l'idea, che cosa si muove e a che
  scopo, la fonte o la motivazione) e l'elenco di ciò che lasci da completare al ruolo di costruzione.

## Ambiente

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-3a-*`, porte tue dalla **8780** in su. La porta 8765 e `/tmp/kalliope-site` sono del
  proprietario; le porte 8770–8779 dell'incarico 1.
- Nessuna finestra sullo schermo (browser senza `DISPLAY` né `WAYLAND_DISPLAY`: sono lo schermo vero del proprietario).
  Niente `mostra.mjs`, niente `cancello.mjs --apri`.
- Niente comandi che chiedono conferma, niente lavori in background da aspettare, niente cancellazioni fuori dalle tue
  cartelle in `/tmp`. **Non fare commit e non fare push.** Non creare altri agenti.

## Consegna

Nella risposta finale e in `progresso.md`: i file creati e toccati (pagina, componenti, token nuovi con il ruolo), il
piano dei tratti, i percorsi delle sequenze e dei confronti, `CONTENUTI.md`, l'elenco di ciò che resta al ruolo di
costruzione, ciò che non hai verificato e le scelte che hai fatto senza una fonte (dichiarate come progettuali).
