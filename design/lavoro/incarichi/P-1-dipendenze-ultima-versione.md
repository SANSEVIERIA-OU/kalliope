# Incarico P-1 · Tutte le dipendenze del programma all'ultima versione

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **La decisione del proprietario** (19/11/2026). Gli è stato chiesto di aggiornare gli altri componenti del programma
  all'ultima versione. Ha risposto: «si, aggiorniamo tutto». La regola di `CLAUDE.md` è sempre l'ultimissima versione di ogni
  dipendenza, verificata oggi nelle fonti ufficiali.
- **Il passo dopo, non tuo**: ONNX Runtime e i modelli entreranno nel programma (P-2, con una proposta al proprietario prima).
  Non cambiare oggi come si scaricano ONNX Runtime e i modelli.

## Punto di partenza

- Commit `5015aeb`. Lì il motore Pocket TTS è entrato nel programma e ONNX Runtime è passato a 1.32.0.
- L'incaricato di V-4 ha trovato, al 19/11:
  - Rust 1.99.1 contro 1.100.0;
  - Slint 1.18.1 contro 1.19.0;
  - 187 crate su 551 non all'ultima: 44 si muovono con `cargo update`, 143 chiedono un salto di versione maggiore, per lo più
    dentro Slint e winit.

  L'elenco è in `benchmarks/voce-propria/esiti/v4/dipendenze_cargo.txt`. Ricontrolla tutto oggi.

## Che cosa aggiornare

1. **Rust**:
   - la toolchain all'ultima stabile;
   - `rust-version` in `Cargo.toml`, allineato a ciò che la CI prova davvero. Scrivi la scelta e il perché.
2. **I crate**:
   - le dipendenze dirette, Slint e `slint-build` compresi, all'ultima versione, anche maggiore;
   - poi `cargo update`;
   - per ogni crate che resta indietro: chi lo trattiene e perché. Una dipendenza transitiva che il crate a monte non permette
     di muovere si elenca, non si forza.
3. **La CI e i pacchetti**:
   - le azioni di GitHub nei workflow, all'ultima versione, con lo stesso modo di fissarle che c'è oggi (tag o SHA);
   - i sistemi su cui girano (`runs-on`);
   - le immagini e i sistemi delle prove dei pacchetti (`packaging/`);
   - le dipendenze dichiarate nel PKGBUILD e negli altri pacchetti.
4. **Gli strumenti in Python** di `tools/` e le loro eventuali dipendenze.
5. **I modelli**:
   - verifica se Klein (oggi revisione `25e0e73`) ha una versione più recente;
   - se c'è, aggiornala, con i controlli automatici di parole e tempi di `bench/` e di V-4 contro la versione di oggi. Se una
     voce peggiora, fermati e scrivilo con i numeri;
   - Pocket TTS e ONNX Runtime: verifica soltanto che revisione `3e82814a` e 1.32.0 siano ancora le ultime.
6. **Il sito, solo l'elenco**: Playwright, i caratteri di `design-system/caratteri/` e ogni altra dipendenza di sito e strumenti,
   con la versione di oggi e l'ultima. Non aggiornarli: toccano l'aspetto delle pagine e hanno le loro prove.

## L'aspetto della finestra non cambia

- L'aggiornamento di Slint non deve cambiare niente di ciò che si vede.
- Se Slint chiede di cambiare i file `.slint`, fai il minimo indispensabile, senza nuovi colori, caratteri o misure. Nessun
  valore nuovo scritto a mano (`CLAUDE.md`, «Il design system vale anche per l'applicazione»).
- Prima e dopo l'aggiornamento:
  - foto della finestra nei suoi stati principali, sul display senza schermo di prova: Weston headless in
    `/workspace/kalliope/materiali-locali/prove-voce/data/xvfb`, con `WESTON_MODULE_MAP`; `weston-screenshooter` vuole `--debug`;
  - un confronto pixel per pixel.
- **Non aprire mai finestre su `DISPLAY :0` o `wayland-1`**: sono lo schermo vero del proprietario.

## Prove (fino al verde)

- I controlli di `CONTRIBUTING.md`:
  - `cargo fmt`, `clippy -D warnings`;
  - `cargo test --workspace` con i modelli veri: `KALLIOPE_MODEL_DIR=/workspace/kalliope/materiali-locali/prove-voce/bench/models/klein/onnx`,
    `KALLIOPE_POCKET_DIR=/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/modelli/pocket-kalliope/italian`,
    `KALLIOPE_ORT_LIB=/tmp/voce-m-fetch/onnxruntime-linux-x64-1.32.0/lib/libonnxruntime.so.1.32.0`;
  - `tools/version.py check`.
- **Da capo a fondo, come un utente**:
  - `kalliope-cli` con Giulia e con una voce preparata da una registrazione CC0 (quella di V-4);
  - l'applicazione che parla nel **microfono virtuale**, con Klein e con la voce preparata, attraverso il PipeWire privato di
    prova: `source /workspace/kalliope/materiali-locali/prove-voce/data/pw-tools/env.sh`, script in quella cartella (`mic.sh`, `final.sh`).
    L'incaricato di V-4 ha scritto che qui non c'è PipeWire: invece c'è questo, usato il 12/11 per le prove del microfono.
  - Whisper sull'audio registrato dal microfono: le parole giuste e nessuna prima parola persa.
- Le prove dei pacchetti di `packaging/linux/`, se si possono far girare qui. Se no, dillo.
- Ogni difetto trovato diventa una prova che fallisce sul codice di prima.

## Regole

- **Area tua**:
  - `Cargo.toml`, `Cargo.lock`, `crates/`; per `crates/app/ui/`, solo ciò che chiede Slint, senza cambiare l'aspetto;
  - `.github/workflows/`, `packaging/`, `tools/fetch_assets.py` (solo le versioni), `tools/version.py`;
  - `CONTRIBUTING.md`, `docs/`, `README.md`, `THIRD_PARTY_NOTICES.md`;
  - `design/lavoro/P-1-dipendenze/` per `progresso.md` (aggiornato a ogni unità finita), esiti e foto.
- **Non toccare** `website/`, `design-system/`, `tools/site.py`, né il resto di `design/`.
- **Nessun commit e nessun push**. Nessun altro agente. Niente account e niente pubblicazioni.
- **La memoria è stretta** (circa 5 GB liberi al 19/11, per programmi che non sono di Kalliope):
  - una compilazione o una prova pesante alla volta;
  - se la memoria disponibile scende sotto 1,5 GB, aspetta;
  - niente cicli di attesa in background.
- **Cartelle**:
  - build in `/tmp/voce-m-target` (ha già la cache);
  - cartelle temporanee `/tmp/p1-*`;
  - file scaricati in cartelle proprie; Python con `-I` quando li legge.
- **Porte**: 8765, 8766 e 8767 sono del proprietario; se ti servono porte, 8930–8939.
- La chiave di Hugging Face in `/workspace/kalliope/.env` non ti serve: non leggere quel file.

## Consegna

Nella risposta finale e in `progresso.md`:
- una tabella con dipendenza, versione prima, versione dopo e fonte verificata oggi;
- che cosa è cambiato nel codice e perché;
- le foto della finestra prima e dopo, e il confronto;
- gli esiti delle prove con i numeri, compreso il microfono virtuale;
- ciò che resta indietro e chi lo trattiene;
- l'elenco delle dipendenze del sito;
- ciò che non hai verificato.
