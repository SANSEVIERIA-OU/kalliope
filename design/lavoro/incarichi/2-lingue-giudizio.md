# Incarico 2-g · Giudizio dell'aspetto nelle altre lingue

- **Attività**: `direction-judgment` (skill `design-system-generator`), ruolo **design-judge**. Non hai reso né
  costruito questo lavoro: giudichi il lavoro di un altro.
- **Area tua**: `design/lavoro/2-lingue-aspetto/giudizio/` (scrivi lì `GIUDIZIO.md` mentre procedi, non solo alla fine,
  e `progresso.md`).
- **Che cosa giudichi**: il commit `8c7fae1` («Give every script its look…»), reso dal ruolo di direzione.

## Il contesto

Il proprietario ha scelto la home nella direzione 2 «Alla pari, in riunione» (`design/direzione-2/D2.md`, `PIANO.md`;
la home viva è `website/index.html` con `scena.js`): è il termine di confronto. Il 16/11/2026 ha deciso che sito e
applicazione devono essere pronti per 30 lingue (`CLAUDE.md`, «Pronti per le traduzioni»; `design/lavoro/ricerca/lingue.md`),
comprese scritture non latine e da destra a sinistra. L'incarico che è stato eseguito:
`design/lavoro/incarichi/2-lingue-aspetto.md` (leggilo per sapere che cosa era chiesto, non come la cosa è stata fatta).
La struttura (una cartella per lingua, `data-t`, `--verso`) viene dall'incarico 1 (`design/lavoro/1-lingue-sito/versi.md`).

Il criterio dell'incarico: la home deve restare **la stessa idea («una riunione in un mondo di un solo colore») in ogni
scrittura**, e sembrare la stessa pagina, non una pagina di ripiego.

I testi verranno riscritti da capo e le traduzioni di prova non le ha rivedute chi parla quelle lingue: non giudicare la
traduzione, ma sì se una scrittura è resa male (carattere sbagliato o di ripiego, lettere tagliate o sovrapposte, righe
troppo strette o larghe, spaziatura fra lettere unite, cose che puntano o si muovono nel verso sbagliato).

## Come

1. Leggi `CLAUDE.md`, `design/lavoro/STATO.md`, poi la skill
   (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/`):
   `references/giudizio.md` per intero (soprattutto la parte D e «La pagina intera»), `references/direzione.md` §6,
   `references/presidi.md` («Testo, lingue e dispositivi»).
2. **Guarda prima di leggere le note di chi l'ha reso.** Un altro worker sta cambiando adesso la cartella di lavoro:
   non costruire da `/workspace/kalliope`, ma da una copia del commit:
   `git -C /workspace/kalliope archive 8c7fae1 | tar -x -C /tmp/lavoro-2g-radice` (crea prima la cartella). Aggiungi alla
   copia di `website/lingue/` i cataloghi di prova di `design/lavoro/2-lingue-aspetto/prova-lingue/` (ar ur hi bn zh el bg
   de fi) e costruisci con `python3 -I /tmp/lavoro-2g-radice/tools/site.py --out /tmp/lavoro-2g-sito`; per le
   pseudo-lingue una seconda costruzione con `--pseudo`. Servi su una porta tua (**8820**–8829).
3. Guarda da te, a grandezza utile, almeno: la home in **ar, ur, hi, zh, el, de** e in italiano, a 390×844 e 1440×900,
   a riposo, scorsa fino in fondo, con l'ascolto aperto e con il menu aperto al telefono; la pagina della scelta della
   lingua (`/`) e il selettore nella barra, al telefono e al computer. Registra da te arrivo e scorrimento in **arabo**
   e in **urdu** alle due misure (`scripts/sequenza.mjs`): il movimento deve andare nel verso giusto. Prova
   `scripts/alfabeti-qa.mjs` su almeno una pagina per scrittura.
4. Metti ogni scrittura accanto all'italiano (`scripts/affianca.mjs`, nei due versi): stessa pagina o ripiego? Mettila
   anche accanto a siti forti che sono davvero in quella scrittura: cerca e visita tu almeno due siti di prodotto di
   qualità in arabo e uno in hindi (con il browser, non con un fetch), per sapere come appare una pagina curata in
   quelle scritture; dichiara quali hai visitato.
5. Fai da te un percorso: chi parla arabo arriva all'indirizzo principale, sceglie la sua lingua, legge la home, torna
   a cambiare lingua; poi lo stesso in hindi al telefono.
6. Solo dopo, leggi le note di chi l'ha reso: `design/lavoro/2-lingue-aspetto/progresso.md`, le foto in `foto/` e le
   sequenze in `sequenze/`; dì se le note corrispondono a ciò che hai visto.

## Che cosa consegni

`GIUDIZIO.md` con: la scheda di giudizio compilata; i problemi in ordine di gravità (**bloccante**, **importante**,
**minore**), ciascuno con la foto o il fotogramma, dove sta, perché è un problema rispetto alla scelta del proprietario,
alle scritture vere o ai riferimenti, e la correzione che proponi (che cosa, non come scriverla); ciò che funziona e va
tenuto; il riassunto per il proprietario (breve, in chiaro, in italiano semplice). Il giudizio è sul risultato, non
sull'impegno.

## Ambiente e regole

- `export PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`; per Firefox anche
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`.
- Cartelle tue sotto `/tmp/lavoro-2g-*`; porte dalla **8820** alla 8829. Non toccare la porta 8765 né `/tmp/kalliope-site`
  (del proprietario), né le porte 8800–8819 (altri worker).
- **Non modificare nessun file fuori dalla tua area**: non correggi, giudichi. Nessuna finestra sullo schermo (browser
  senza `DISPLAY` né `WAYLAND_DISPLAY`). Niente commit, niente push, niente comandi che chiedono conferma, nessun altro
  agente.
