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
- Fatti per «non ancora», decisi da chi coordina sulle risposte del proprietario (16/11): lo stato «non ancora
  provata in una riunione vera» si dice; Kalliope non è un servizio online né un'estensione (non «non ancora»); per
  macOS vale `progetto.md` [P] (account sviluppatore Apple); la propria voce non va in questa pagina (la risposta «la
  mettiamo subito» è da chiarire con il proprietario); dubbio E: «non ancora», nessun consiglio né alternativa.
- Decisi da chi coordina sulle domande dell'incarico 2 (17/11): finché la lingua pubblicata è una sola, il selettore nella
  barra non si mostra e `/` manda a `/it/` come i vecchi indirizzi; tornano da soli con la seconda lingua (lo fa la
  costruzione, in `tools/site.py`). La barra di «non ancora» e delle pagine dopo prende il selettore nuovo. Foto e sequenze
  di `design/lavoro/` restano sul disco, fuori dal repository (`.gitignore`).
- Rinviati finché il proprietario non ne riparla: clonazione della voce, Windows e macOS, il cursore nel campo con
  testo arabo (limite di Slint), la piattaforma dei traduttori, i messaggi da terminale.

## Fasi

| Fase | Stato | Ruolo e modello | Tempi | Esito / prossimo passo |
|---|---|---|---|---|
| R. Ricerca lingue, Slint, sito, CSS, caratteri | fatta | research ×6 (haiku) | 16/11 | `ricerca/lingue.md` |
| 1. Lingue nel sito: struttura e specchio senza cambiare l'aspetto | fatta, commit `341a841` | design-build (sonnet) | 16/11, 102 min, 741k token | `1-lingue-sito/progresso.md`, `versi.md`; italiano identico in tre motori; verificato da chi coordina (costruzione, controlli, foto) |
| 2. Lingue nel design system: aspetto da destra a sinistra, caratteri per scrittura, scelta della lingua | resa, commit `8c7fae1` | design-direction (opus) | 16/11 → 17/11, 117 min, 772k token | `2-lingue-aspetto/progresso.md`; italiano identico a `341a841` nei tre motori (salvo il selettore); verificato da chi coordina sul solo commit (costruzione, controlli, foto, 0 errori) |
| 2-g. Lingue: giudizio | fatto | design-judge (opus) | 17/11, 59 min, 333k token | `2-lingue-aspetto/giudizio/GIUDIZIO.md`: 1 bloccante (B1 la barra con l'azione nelle lingue lunghe fra 960 e 1440 px, foto rivista da chi coordina), 4 importanti (I1 versione al contrario in ar e ur, I2 etichetta di «Tu» al telefono, I3 pagina della scelta vuota, I4 20 KB di caratteri in più nella pagina italiana), 8 minori |
| 2-c. Lingue: correzione | in corso | design-direction (opus), lo stesso worker | 17/11 → | `incarichi/2-lingue-correzione.md`; poi costruzione (lingua sola, precarico, tastiera, stati, larghezze di mezzo, altri motori, selettore in «non ancora») e secondo sguardo |
| 3. Pagine nella direzione 2: non ancora, stato, installa, in riunione (con aiuto), 404 | in corso | per pagina: direzione → giudice → correzione → costruzione → proprietario | | una alla volta, ciascuna mostrata al proprietario |
| 3a. «non ancora»: aspetto e movimento | fatta | design-direction (opus) | 16/11, 42 min, 544k token | `3a-non-ancora/` (PIANO, CONTENUTI, sequenze, confronti); 4 componenti nuovi, 24 token; controlla-sorgenti verde; solo Chromium |
| 3a-g. «non ancora»: giudizio | fatto | design-judge (opus) | 16/11, 35 min, 351k token | `3a-non-ancora/giudizio/GIUDIZIO.md`: 0 bloccanti, 6 importanti (I1 stato della prova, I2 «non ancora» per ciò che non è, I3 feed come unica decisione, I4 catalogo, I5 schermi bassi senza comandi, I6 tratto fermo), 8 minori |
| 3a-c. «non ancora»: correzioni d'aspetto e contenuti | fatta, commit `0cf5c64` | design-direction (opus), lo stesso worker | 16/11 | I1, I2, I3, I5, I6 e i fatti decisi da chi coordina |
| 3a-b. «non ancora»: costruzione (traducibile, catalogo, M1 M2 M5 M6 M7, stati ed errori, larghezze, tre motori, pseudo-lingue) | fatta, commit `b9ba336` | design-build (sonnet) | 17/11, 181 min, 733k token | `3a-non-ancora/costruzione/progresso.md`; italiano identico alla direzione; verificato da chi coordina sul solo commit (costruzione, controlli, foto dell'ascolto, 0 errori); a en-XA le pillole e la barra delle pagine interne passate a 2-c |
| 3a-s. «non ancora»: secondo sguardo del giudice | fatto: pronta per il proprietario | design-judge (opus) | 17/11, 46 min, 345k token | `3a-non-ancora/secondo-sguardo/GIUDIZIO.md`: I1–I6 e i minori chiusi (M3 in parte, M4 al proprietario); 5 minori nuovi (N5 il posto che non si accende dopo «Copia», N1 «Pausa» sotto il bordo sugli schermi bassi, N2 etichetta sbilanciata al telefono, N3 tratteggio sulla versione, N4 nota scritta a mano) |
| 3a-p. «non ancora»: al proprietario | mostrata 17/11 | chi coordina | | domande: telefono «non ancora» o confine; la frase grigia della bolla. Decisi da chi coordina: sugli schermi bassi una riunione più bassa perché bolla e «Pausa» stiano insieme; N1–N5 e M3 nella prossima costruzione |
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
