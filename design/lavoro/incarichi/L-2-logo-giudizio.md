# Incarico L-2 · Il logo: il giudizio delle tre direzioni

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Il ruolo**: giudice (`vibe-next:design-judge`) della skill `design-system-generator`, versione 0.49.0
  (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.49.0/skills/design-system-generator/`).
  - Leggi `references/giudizio.md` per intero, e `references/direzione.md` §5.
  - Non hai disegnato tu queste direzioni.
  - **Guarda prima di leggere qualunque nota di chi le ha rese** (`idea.md`, `progresso.md`, i commenti nelle pagine).

## Che cosa giudicare

Tre direzioni per il logo nuovo di Kalliope, rese dal ruolo di direzione in `design/lavoro/L-logo/direzioni/`:
- `1-cursore`, `2-posto`, `3-frase`, ciascuna con:
  - i disegni: `disegno.svg`, `piena.svg`, `simbolica.svg`, `piccola.svg`;
  - i token;
  - la pagina di prova `prova.html`;
  - le foto in `foto/` e le sequenze in `sequenze/`;
- la pagina che le affianca: `direzioni/index.html`. Per aprirla bisogna servire la radice del repository: lo script è
  `design/lavoro/L-logo/strumenti/con-server.mjs`;
- le copie del sito costruite con ciascun logo: `/tmp/l1-sito-1-4`, `/tmp/l1-sito-2-2`, `/tmp/l1-sito-3-2`, anche
  `-pseudo`.

**Il contesto, da sapere prima di guardare.** Kalliope è un programma per il computer per chi non può parlare o fa fatica:
scrive una frase e una voce la dice in un microfono virtuale, nelle riunioni (`design/progetto.md`). Il sito nuovo è nella
direzione 2, «Alla pari, in riunione» (`design/direzione-2/D2.md`). Il proprietario ha chiesto di rifare il logo perché
quello di oggi, la bolla verde con le barre del suono, «con il nuovo sito c'entra poco».

**I requisiti delle piattaforme** sono in `design/lavoro/ricerca/logo.md`:
- niente lettere;
- leggibile da 16 px;
- regge su chiaro e su scuro senza varianti;
- una forma piena per macOS e una libera altrove;
- una versione simbolica;
- non si specchia.

Un requisito mancato è un problema, con la sua gravità.

## Come

Il metodo è quello di `giudizio.md`: la scheda (A–E), prima i problemi e poi i punti forti, ciascuno con gravità e prova.

**Il giudizio a coppie.** Ogni direzione accanto ai tre riferimenti più forti dello stesso tipo di superficie. Qui le
superfici sono due:
1. **Il marchio nella barra di un sito**: i marchi nelle barre di R01, R03 e R51, le fonti della direzione 2.
   - Primi schermi in `/workspace/prova-design-abc/prova-2/riferimenti/primi-schermi/`, schede in
     `design/ricerca/schede/`.
   - Confronti già preparati in `design/lavoro/L-logo/confronti/`: usali, ma rifai da te almeno le coppie su cui decidi.
2. **L'icona di un programma** nei menu e nella barra delle applicazioni: icone di programmi dello stesso genere (voce, sintesi
   vocale, comunicazione aumentativa), scelte da te fra quelle che chi ha reso ha messo accanto (`confronti/`,
   `direzioni/contesti/vicini/`), più quelle che ritieni più forti.

**Fogli affiancati alla stessa misura, nei due versi** (`affianca.mjs`). Se una risposta cambia scambiando le posizioni,
la differenza è troppo piccola per deciderla: dillo.

**Domande da guardare con cura:**
- **Si distingue da un simbolo che esiste già?** Il simbolo del volume, il tasto «registra», l'icona di una chat o dei
  messaggi, le icone generiche di voce e sintesi vocale. Messo fra le icone di sistema e fra le app di messaggi, si riconosce
  come Kalliope o si confonde? Prova a 32 e a 48 px.
- **Le tre direzioni sono davvero diverse** (`giudizio.md`, coppie, punto 7)? Usano tutte lo stesso mondo di colore. Dì
  se sono tre direzioni o una direzione in tre forme, e se questo è un limite che il proprietario deve conoscere.
- **Il movimento nella barra** (D4, prova della rimozione): aggiunge significato o è solo bello? Disturba la lettura della
  home?
- **Il momento che resta in mente** (A2, D6): c'è, per ciascuna?
- **Starebbe al suo posto** fra i marchi dei vincitori del suo genere, o stonerebbe? Che cosa è goffo, generico o datato?
- **Lo stile di default** (parte E).

## Che cosa consegnare

In `design/lavoro/L-logo/giudizio/`:
- **`giudizio.md`**, scritto mentre guardi:
  - per ogni direzione la scheda, le coppie con le prove (file e che cosa vi si vede) e i problemi con gravità;
  - le tre direzioni affiancate fra loro;
  - per ognuna, che cosa deve correggere chi l'ha resa: solo i problemi bloccanti e importanti, una correzione per autore,
    senza farle convergere;
- **`riassunto.md`**, per il proprietario: al massimo trenta righe, parole semplici, solo titoli, elenchi e grassetti. Prima i
  problemi con la gravità, poi che cosa funziona, il confronto con i riferimenti e che cosa non è stato verificato. Niente
  gergo: il proprietario non è un designer;
- **i fogli affiancati** che hai fatto.

Una valutazione in assoluto è ammessa, ma la scelta è del proprietario. Se pensi che nessuna delle tre sia all'altezza,
dillo chiaramente e spiega perché, con le prove.

## Regole

- **Non modificare** le direzioni né nient'altro fuori da `design/lavoro/L-logo/giudizio/`. Nessun commit, nessun push.
  Nessun altro agente.
- **La memoria è stretta**:
  - un browser alla volta;
  - prima di aprirlo controlla `free -m`: sotto 1,5 GB disponibili, aspetta;
  - niente cicli di attesa in background.
- **Lo schermo**: mai finestre su `DISPLAY :0` o `wayland-1`. Solo browser senza finestra.
- **Porte**: le tue sono 8950–8959.
- WCAG non è un obiettivo né una soglia (`CLAUDE.md`). Il contrasto si guarda reso.
