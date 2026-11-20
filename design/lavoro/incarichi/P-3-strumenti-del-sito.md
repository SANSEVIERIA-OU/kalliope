# Incarico P-3 · Gli strumenti del sito all'ultima versione

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Perché**: la regola di `CLAUDE.md` è «sempre l'ultimissima versione di ogni dipendenza». P-1 ha aggiornato il programma
  e ha solo elencato gli strumenti del sito (`design/lavoro/P-1-dipendenze/progresso.md`, «Sito e strumenti»). Il
  proprietario ha detto di continuare lo sviluppo (20/11/2026): questi si aggiornano prima della prossima pagina, «installa».
- **Le ultime versioni**, verificate da chi coordina il 20/11: Playwright 1.65.1 (npm), fontTools 4.68.0 e brotli 1.2.1
  (PyPI). Ricontrolla tu prima di installare.

## Che cosa fare

1. **Playwright.**
   - Oggi le prove del sito usano `PLAYWRIGHT=/workspace/test-playwright/node_modules/playwright/index.mjs`, cioè 1.60.0.
     È una cartella condivisa con altri lavori: **non toccarla**.
   - Installa l'ultima versione in una cartella nuova, solo per Kalliope, `/workspace/kalliope-playwright/`, con la versione
     esatta fissata nel suo `package.json`.
   - Installa i tre motori, Chromium, Firefox e WebKit. Su questa macchina Firefox chiedeva librerie in più
     (`LD_LIBRARY_PATH=/tmp/metodo-motori/ff/radice/…`, che è in `/tmp` e sparisce a un riavvio). Usa lo script della skill
     `scripts/prepara-motori.sh` (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.49.0/skills/design-system-generator/`)
     o un modo equivalente che resti dopo un riavvio, e scrivi come.
   - Prova che i tre motori partono e che le prove di sempre girano con la versione nuova:
     - `controlla-sorgenti.mjs` da `design-system/`;
     - le foto della home, di «stato» e di «non ancora» a 1440 e 390 nei tre motori, con la vecchia e con la nuova versione,
       confrontate pixel per pixel. Una differenza si spiega.
2. **fontTools e brotli.**
   - In un ambiente Python proprio (`/workspace/kalliope-playwright/` va bene anche per il venv, o una cartella accanto),
     con l'ultima versione di tutte e due.
   - Rifai i sottoinsiemi dei caratteri come dice `design-system/caratteri/LEGGIMI.md` («Come si rifanno i sottoinsiemi»),
     partendo dagli stessi file sorgente, con le impronte scritte lì. Se mancano, riscaricali dalle stesse revisioni.
   - Confronta i file nuovi con quelli di `design-system/caratteri/`:
     - se sono identici byte per byte, non cambia niente e lo scrivi;
     - se sono diversi, guarda le pagine nelle scritture che cambiano, con il sito in dieci lingue e le foto prima e dopo.
       Tieni i nuovi solo se le pagine non cambiano o migliorano, e scrivi perché.
3. **La documentazione**:
   - dove si dice quale Playwright usare: `docs/releasing.md`, «Website», se lo dice, e
     `design/lavoro/L-logo/strumenti/env.sh` come esempio;
   - in `design-system/caratteri/LEGGIMI.md`, le versioni di fontTools e brotli usate.

## Regole

- **Area tua**:
  - `/workspace/kalliope-playwright/`, nuova;
  - `design-system/caratteri/`, solo se i file nuovi sono da tenere, e il suo `LEGGIMI.md`;
  - `docs/releasing.md`;
  - `design/lavoro/P-3-strumenti/` per `progresso.md`, esiti e foto.
- **Non toccare** `/workspace/test-playwright/`, `website/`, il resto di `design-system/` e il resto di `design/`.
- **Nessun commit e nessun push.** Nessun altro agente.
- **La memoria è stretta**:
  - un browser alla volta;
  - controlla `free -m`: sotto 1,5 GB disponibili, aspetta.
- **Lo schermo**: mai finestre su `DISPLAY :0` o `wayland-1`. Solo browser senza finestra.
- **Porte**: 8975–8979. Non toccare 8765–8767, né la 8770, che serve la pagina della scelta del logo.

## Consegna

Nella risposta finale e in `progresso.md`:
- le versioni prima e dopo, con la fonte di oggi;
- dove sta il Playwright nuovo e la riga `PLAYWRIGHT=…` da usare;
- come partono i tre motori dopo un riavvio;
- gli esiti dei confronti delle foto e dei caratteri;
- ciò che non hai verificato.
