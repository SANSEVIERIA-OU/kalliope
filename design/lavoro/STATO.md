# Stato del lavoro: sito e applicazione nella direzione 2, pronti per le traduzioni

Da dove si riparte: `CLAUDE.md`. Qui: fasi, decisioni prese a lavoro avviato, incarichi, tempi e ciò che resta.
Metodo: skill vibe-next `design-system-generator` 0.46.1, ruoli nativi di Claude Code.

## Decisioni del proprietario (16/11/2026)

- «chissenefrega dei testi tanto anno rifatti da capo: preoccupati solo di rendere predisposto sito e applicazione per
  essere tradotta nelle lingue dell'UE + prime dieci lingueparlate al mondo.» → `CLAUDE.md`, «Pronti per le
  traduzioni». Le 30 lingue: `ricerca/lingue.md`.
- Sul piano proposto (`.po` unico, una cartella per lingua, design system specchiabile, applicazione con `@tr` e
  traduzioni nel programma): «ok, ma il sito lo posso vedere? no perché partirei da lì», poi «ok, fai anche il resto
  delle pagine secondo il design systeme e poi fai il programma». Ordine: prima il sito, poi il programma.
- Domande 9–11 («come preferisci»), decise dal coordinatore:
  - `ascolta/` diventa una parte della home con un indirizzo diretto, dopo aver controllato che la home dica tutto ciò
    che dice la pagina vecchia; il vecchio indirizzo rimanda lì.
  - `riunione/` e `aiuto/` diventano una pagina sola: prima la scelta del microfono, poi «se non ti sentono» con la
    ricerca della frase vista nella finestra; il vecchio indirizzo di `aiuto/` rimanda alla sua parte.
  - La finestra dell'applicazione nella direzione 2: due varianti da confrontare (la sala scura della home e una
    chiara, nel colore della bolla).
- Rinviati finché il proprietario non ne riparla: clonazione della voce, Windows e macOS, il cursore nel campo con
  testo arabo (limite di Slint), la piattaforma dei traduttori, i messaggi da terminale.

## Fasi

| Fase | Stato | Ruolo e modello | Tempi | Esito / prossimo passo |
|---|---|---|---|---|
| R. Ricerca lingue, Slint, sito, CSS, caratteri | fatta | research ×6 (haiku) | 16/11 | `ricerca/lingue.md` |
| 1. Lingue nel sito: struttura e specchio senza cambiare l'aspetto | in corso | design-build (sonnet) | 16/11 → | incarico `incarichi/1-lingue-sito.md` |
| 2. Lingue nel design system: aspetto da destra a sinistra, caratteri per scrittura, scelta della lingua | da fare | design-direction (opus) → design-build → design-judge | | dopo la 1 |
| 3. Pagine nella direzione 2: non ancora, stato, installa, in riunione (con aiuto), 404 | in corso | per pagina: direzione → giudice → correzione → costruzione → proprietario | | una alla volta, ciascuna mostrata al proprietario |
| 3a. «non ancora»: aspetto e movimento | fatta | design-direction (opus) | 16/11, 42 min, 544k token | `3a-non-ancora/` (PIANO, CONTENUTI, sequenze, confronti); 4 componenti nuovi, 24 token; controlla-sorgenti verde; solo Chromium |
| 3a-g. «non ancora»: giudizio | in corso | design-judge (opus) | 16/11 → | `incarichi/3a-non-ancora-giudizio.md` |
| 4. Applicazione: token per Slint, prova delle scritture, `@tr`, finestra nella direzione 2 (due varianti) | da fare | design-build, design-direction, design-judge | | dopo il sito |
| 5. Matrice completa (15 dispositivi × 3 motori) e pulizia di `website/stile/`, `script/`, `sistema/` | da fare | design-build | | alla fine |

## Ambiente delle prove (16/11/2026)

- Playwright 1.60: `PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`.
- Firefox e WebKit preparati con `prepara-motori.sh` in `/tmp/metodo-motori`; Firefox parte solo con
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` e
  `LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/usr/lib/x86_64-linux-gnu`. `motori-test.mjs`: tutti e tre ok (niente
  uscita audio su questa macchina). Dopo un riavvio si rifà.
- Il proprietario guarda il sito su `http://127.0.0.1:8765/` (servito dal coordinatore da `/tmp/kalliope-site`): i
  worker usano altre porte.
- Macchina: 12 CPU, 14 GB; `passo.mjs stato` 5 posti liberi alle 16/11 sera.
