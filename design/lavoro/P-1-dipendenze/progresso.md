# P-1 · Dipendenze all'ultima versione · progresso

Incarico: `design/lavoro/incarichi/P-1-dipendenze-ultima-versione.md`. Partenza: commit `5015aeb`. Data: 19/11/2026.

## Unità

| # | Unità | Stato |
|---|---|---|
| 0 | Lettura e verifica delle versioni di oggi | fatta (vedi «fatti verificati oggi») |
| 1 | Foto della finestra prima (Slint 1.18.1, Rust 1.99.1) | fatta: `foto/prima/` (13 stati), binario in `/tmp/p1-prima/` |
| 2 | Rust 1.100.0 e `rust-version` | fatto: `rust-toolchain.toml` 1.100.0, `rust-version = "1.100"` |
| 3 | Slint 1.19.0 e `cargo update` | fatto: compila senza toccare i `.slint`; 127 crate restano indietro, tutti trattenuti a monte (`esiti/crate_trattenute.md`) |
| 4 | Foto della finestra dopo e confronto | fatto: `foto/dopo/`, `foto/confronto/` (solo angoli arrotondati, ombra della lista, versione di Slint) |
| 5 | CI, `runs-on`, pacchetti | fatto: azioni già all'ultima; CI Linux e pubblicazione su `ubuntu-26.04`; pacchetti e `pages.yml` restano (motivi sotto) |
| 6 | Strumenti Python | fatto: solo libreria standard nella CI; quelli di sviluppo senza versioni fissate, venv di prova già all'ultima |
| 7 | Modelli (Klein, Pocket TTS, ONNX Runtime) | fatto: tutti già all'ultima, nulla da cambiare |
| 8 | Prove: fmt, clippy, test, version, cli, microfono virtuale, Whisper, pacchetti | fatto: tutto verde; `.rpm` e Arch non provabili qui |
| 9 | Elenco delle dipendenze del sito | fatto (sotto) |

## Note di lavoro

### Il banco di prova delle foto (per riprendere)

- Script in `strumenti/` (copie di `/tmp/p1-rig/`). Ordine: `xvfb-start.sh` (Xvfb `:137` in un proprio spazio di mount,
  perché `/tmp/.X11-unix` è di sola lettura; `:93`–`:95` sono occupati da altri), `weston-start.sh x11 560 460` (Weston 14 con
  kiosk-shell e pixman, finestra di Weston dentro Xvfb, socket `/tmp/p1-run/p1-wayland`), `pw-start.sh` (PipeWire privato di
  `pw-tools`), `python3 -I hold.py &` (porta 8931: un download che resta a 0 MB), poi `stati.sh BIN CARTELLA`.
- Perché Weston su Xvfb e non Weston headless: headless non riceve input, e servono clic e testo per la cronologia, la lista
  delle voci e «Informazioni». L'input arriva con XTEST (`xinput.py`, libXtst del root di Xvfb) alla finestra di Weston, che lo
  passa a Kalliope come client Wayland. Weston headless funziona (provato per il primo avvio) ed è uguale nel disegno.
- Lo schermo vero (`DISPLAY :0`, `wayland-1`) non si tocca: gli script tolgono `DISPLAY` e `WAYLAND_DISPLAY` e usano
  percorsi propri.
- 13 stati, 3 foto ciascuno (il cursore del testo lampeggia): primo avvio, download fermo, download annullato, errore (manca
  ONNX Runtime), pronta senza microfono, pronta, testo scritto, sta parlando (con un registratore sul microfono), nessuno
  ascolta (monitor spento), cronologia, lista delle voci aperta, informazioni, voce preparata (giovanni, CC0).
- `confronta.py PRIMA DOPO OUT` (con il Python di `bench/voce-propria/.venv`, che ha PIL e numpy): per ogni stato la coppia
  di foto con meno pixel diversi, e un'immagine delle differenze.

### Unità 2–4 (19/11)

- Rust: `rustup self update` 1.29.2 → 1.29.3; toolchain 1.100.0 (12/11/2026, `channel-rust-stable.toml`). Nuovo
  `rust-toolchain.toml` con `channel = "1.100.0"`, `clippy`, `rustfmt`, profilo minimal: la CI su Linux, Windows e macOS, i
  rilasci e le build locali usano tutti la stessa versione. `rust-version = "1.100"`: è l'unica versione che la CI prova
  davvero. (Prima era 1.85, ma già Slint 1.18.1 chiedeva 1.92; Slint 1.19.0 chiede 1.95.)
- Slint 1.18.1 → 1.19.0 (16/11/2026) in `crates/app/Cargo.toml`, `slint` e `slint-build`. Compila senza modifiche ai `.slint`
  e senza avvisi. Nessuna «edition» di Slint scelta: l'edizione 1.19 cambia il calcolo dei layout con `if`, quindi resta il
  comportamento di prima.
- `cargo update`: 159 righe del lock cambiate; prima 551 crate dal registro, 188 non all'ultima (44 muovibili); dopo 546,
  127 non all'ultima, 0 muovibili. Dei 127, 55 sono compilati nella build Linux; gli altri solo per Windows, macOS, iOS,
  Android, Redox, WASM o per renderer che Kalliope non usa. Tutti trattenuti da crate a monte (Slint 1.19.0, winit 0.30.13
  che è l'ultima, accesskit, zbus 5, wgpu 30…): `esiti/crate_trattenute.md`.
- Foto dopo (Slint 1.19.0, Rust 1.100.0, binario `/tmp/p1-dopo/`): in ogni stato cambiano 220–350 pixel su 257 600
  (0,09–0,13%), tutti sugli angoli arrotondati (nuovo antialiasing del renderer software di Slint 1.19), differenza massima 93
  su 255 in un pixel d'angolo. In più: la lista delle voci aperta ha ora una leggera ombra (il renderer software di 1.19
  disegna le ombre che lo stile Fluent già chiedeva; 5 700 pixel, differenza mediana 3, al 95% 15), e «Informazioni» dice
  «Version 1.19.0». Niente da cambiare nei `.slint`.

### Controlli dopo l'aggiornamento (19/11)

- `cargo fmt --all --check`: verde.
- `cargo clippy --workspace --all-targets --locked -- -D warnings` (con `RUSTFLAGS=-D warnings`, come la CI): con Rust 1.100
  falliva su due regole. `chunks_exact_to_as_chunks` è nuova in clippy 1.100 (4 punti: `pocket/safetensors.rs` ×2,
  `app/src/sha256.rs`, `mic/examples/virtual_mic.rs` ×2); `manual_is_multiple_of` scatta perché `rust-version` è salito oltre
  1.87 (4 punti: `text/src/verbalize.rs`, `pocket/safetensors.rs`, `pocket/mod.rs`, `mic/src/pipewire.rs`). Corretti con
  `as_chunks::<N>()` e `is_multiple_of()`, stesso comportamento (le lunghezze sono già multipli esatti). Ora verde.
- `cargo test --workspace --locked` con Klein, Pocket e ONNX Runtime 1.32.0 veri: 52 superati, 1 ignorato di proposito
  (`noise::tests::speed`, misura di tempi), 0 falliti.
- `tools/version.py check`, `translations.py extract --check` e `check`, `css_logico.py`, unittest degli strumenti: verdi
  (Python 3.13.5 di Debian 13).
- `tools/third_party_licenses.py` con il nuovo lock: 396 crate (prima 399), nessun tipo di licenza nuovo.

### Unità 5–7 e 9: fatti verificati oggi (19/11), prima di scrivere la tabella finale

- Azioni di GitHub: tutte già all'ultima, con lo stesso modo di fissarle (tag della versione maggiore; `Swatinem/rust-cache`
  per SHA). Ogni tag maggiore punta oggi alla stessa commit dell'ultima versione: checkout v7 = v7.0.1, cache v6 = v6.1.0,
  upload-artifact v7 = v7.0.2, download-artifact v8 = v8.0.2, attest-build-provenance v4 = v4.2.2, deploy-pages v5 = v5.0.1,
  configure-pages v6 = v6.0.0, upload-pages-artifact v5 = v5.0.0; rust-cache `d1527c8f` = v2.9.3, l'ultima (20/10/2026).
- `runs-on` (README di `actions/runner-images`, immagini del 11/11/2026): `ubuntu-26.04` è disponibile e non in prova;
  `ubuntu-latest` è ancora 24.04; `windows-latest` = Windows Server 2025 e `macos-latest` = macOS 26 arm64, già le ultime. Le
  immagini Ubuntu hanno ancora Rust 1.99.1: senza `rust-toolchain.toml` la CI proverebbe 1.99.1.
  - CI Linux → `ubuntu-26.04`; job di pubblicazione del rilascio → `ubuntu-26.04`.
  - Build dei pacchetti: resta `ubuntu-24.04` di proposito. Il sistema che compila fissa la glibc minima (oggi 2.39, per i
    simboli `pidfd_spawnp`/`pidfd_getpid` di std; ONNX Runtime chiede 2.28); Ubuntu 26.04 ha glibc 2.43 (Launchpad), Debian 13
    2.41 (sources.debian.org): compilare su 26.04 rischia di escludere Debian 13 e Ubuntu 24.04, promessi in README e docs.
  - `pages.yml` resta `ubuntu-24.04`: il suo stesso percorso è fra quelli che fanno ripartire la pubblicazione del sito, e il
    proprietario non ha detto di pubblicare il sito nuovo. Lo decide chi coordina.
- Pacchetti: le dipendenze dichiarate non hanno versioni; i nomi esistono oggi in Arch (archlinux.org), Fedora 43, 44 e
  rawhide (mdapi), Debian 13 (packages.debian.org), Ubuntu 24.04 e 26.04 (Launchpad). `fedora:latest` e `archlinux:base-devel`
  sono già etichette mobili.
- Strumenti Python: quelli della CI e dei pacchetti usano solo la libreria standard. Quelli di sviluppo (`asr_wer.py`,
  `espeak_phonemes.py`, `g2p/`) non fissano versioni (`pip install` senza numeri in `benchmarks/engines/README.md`). Python:
  qui 3.13.5 (Debian 13), Ubuntu 26.04 ha 3.14.4, l'ultima è 3.15.2 (python.org).
- Modelli: Klein-TTS-X1.5-Pro `25e0e73` è la testa di `main` (3/11/2026), nessuna versione più nuova della Pro; in klein-ml c'è
  `Klein-TTS-X1.6-Flash-Checkpoints` (2/11), ma è un repository di checkpoint d'addestramento `.pt`, ad accesso approvato a mano,
  senza ONNX, di un'altra taglia (Flash): non è un rilascio. Pocket TTS: i pesi italiani e `italian_24l` hanno ancora come
  ultima commit `3e82814a` (1/10/2026), testa del repository `db04f0e6` (21/10); il tokenizer non cambia dal 24/9 (`4e1e0a3e`
  è la commit subito dopo l'ultima modifica); codice di Kyutai `a4a6054d` (18/11) è ancora la testa; PyPI `pocket-tts` 4.0.1.
  ONNX Runtime: NuGet e PyPI 1.32.0 (GitHub risponde ancora 404 da qui).
- Sito, solo l'elenco: Playwright 1.60.0 (in `/workspace/test-playwright`) contro 1.65.1 (npm, 13/11/2026); Node 24.22.3 contro
  26.13.1; caratteri: Lexend 1.007, DejaVu Sans 2.37, Geologica 1.010, Readex Pro 1.205, Noto Sans Bengali 3.011, Noto Sans
  Devanagari 2.007 sono le ultime (cartelle di `google/fonts` ferme alle commit registrate, rilasci a monte uguali); Noto
  Nastaliq Urdu 3.009 (google/fonts) contro **v4.000** a monte (`notofonts/nastaliq`, 17/7/2024, non ancora in google/fonts).

### Da capo a fondo: `kalliope-cli` prima e dopo (19/11)

`strumenti/e2e_cli.py` (esito in `esiti/e2e_cli.json`), binari di debug di prima (`/tmp/p1-prima`) e di dopo (`/tmp/p1-dopo`),
ONNX Runtime 1.32.0: ciascun programma prepara la voce dalla registrazione CC0 di giovanni, poi dice 5 frasi e le 16 frasi brevi
di V-1/V-4 con Giulia e con quella voce (seme 1).
- **43 file su 43 identici byte per byte** fra prima e dopo (la voce preparata e i 42 WAV): l'aggiornamento non cambia nulla di
  ciò che si sente.
- Whisper (small, int8, beam 5, italiano, come V-4) sui file di dopo: Giulia 3 parole sbagliate su 72, 0 prime parole perse su
  21; giovanni 6 su 72, 2 prime parole perse su 21 («Certo» → «chat», «Mi sentite?» → «Vi sentite?»). Sono gli stessi casi già
  scritti da V-4 («Certo» → «C'è», «Mi sentite» → «Vi sentite», «A dopo» → «Adopo» di Whisper), e l'audio è identico a prima:
  non vengono dall'aggiornamento.
- Tempi (debug, macchina carica): preparare la voce 3,6 s prima e 2,6 s dopo; 21 testi con Giulia 24,1 e 25,5 s; con giovanni
  43,7 e 44,5 s.

### Da capo a fondo: l'applicazione nel microfono virtuale (19/11)

`strumenti/e2e_mic.sh` + `e2e_mic_whisper.py` (esiti in `esiti/e2e_microfono_*.json`, foto in `foto/microfono/`). Sul banco
delle foto (Weston su Xvfb, PipeWire privato di `pw-tools`): l'app si apre nella sua finestra, si scrive la frase con XTEST, si
preme Invio, e `pw-record --target kalliope` registra la sorgente «Kalliope» come farebbe un'app di riunione (48 kHz, mono).
8 testi (3 frasi e 5 brevi, in ASCII perché scritti da tastiera simulata), con Giulia e con giovanni (la voce preparata),
monitor spento. Tre programmi: prima (debug), dopo (debug), dopo in release (`cargo build --release --workspace --locked`, come
il rilascio).

| Programma | Giulia: parole sbagliate | Giulia: prime parole perse | giovanni: parole sbagliate | giovanni: prime parole perse |
|---|---|---|---|---|
| prima, debug | 3/29 | 0/8 | 5/29 | 0/8 |
| dopo, debug | 3/29 | 0/8 | 5/29 | 0/8 |
| dopo, release | 2/29 | 0/8 | 5/29 | 0/8 |

Gli errori sono di Whisper e uguali prima e dopo («A dopo» → «Adopo», «Ho cambiato microfono» → «Ho cambiato il microfono»,
«scusate il ritardo» → «scusate, è ritardo», «Arrivo» → «Arrivò»). La durata della voce registrata è la stessa nei tre
programmi (es. Giulia 2,22 / 3,03 / 3,81 / 0,71 / 0,97 / 0,68 / 1,09 / 0,87 s).

`kalliope --say` (senza finestra) nel microfono: **non verificato**. Il registratore non riesce ad agganciarsi alla sorgente
«Kalliope» prima che esista, e `--say` la crea e parla subito: il registratore partito prima resta sulla sorgente predefinita e
registra silenzio, con il programma di prima come con quello di dopo. È un limite della prova, non un cambiamento.

### Pacchetti (19/11)

- `packaging/linux/build-packages.sh 0.1` con i binari in release e ONNX Runtime 1.32.0: tarball (21,6 MB), `.deb` (15,9 MB) e
  `kalliope-bin.PKGBUILD` fatti. Qui manca `rpmbuild`: uno stand-in (`/tmp/p1-stub/rpmbuild`) ha lasciato un segnaposto al posto
  del `.rpm`, poi cancellato; **il `.rpm` non è stato costruito**.
- `.deb`: `Depends: libc6 (>= 2.39), libfontconfig1, libgcc-s1, libstdc++6, libxkbcommon0, libwayland-client0 | libx11-6, curl`,
  come prima; `apt-get install -s` non chiede altri pacchetti.
- `packaging/linux/test-packages.sh`: tarball installato, `kalliope --version` 0.1, `phonemes ciao` → `ʧˈao`, `say` 2 225 ms di
  voce con l'ONNX Runtime portato dal pacchetto, rimosso senza resti; `.deb` installato con apt, stesse tre prove (2 225 ms),
  rimosso. **`.rpm` in `fedora:latest` e PKGBUILD in `archlinux:base-devel` saltati**: qui non ci sono docker né podman.
- Librerie: `NEEDED` del programma uguali a prima (fontconfig, libgcc_s, libm, libc), stessi 19 nomi di librerie caricate a
  run time (X11, xcb, Xcursor, Xi, xkbcommon, wayland, pipewire, onnxruntime): gli elenchi dei pacchetti restano giusti. glibc
  richiesta: 2.39, come prima. Programma in release: 16,4 MB.
- Foto del programma in release: identiche, pixel per pixel, a quelle del debug di dopo in tutti i 13 stati
  (`foto/confronto/confronto_debug_release_dopo.json`); le due serie, fatte in due giri diversi, dicono anche che il banco è
  ripetibile.

### Un difetto, una prova

`rust-version` diceva 1.85 mentre Slint 1.18.1 chiedeva già 1.92 e la CI provava 1.99.1: una promessa non vera e non provata.
Ora `tools/version.py check` (passo «Versions agree» della CI) fallisce se `rust-version` non è la Rust di `rust-toolchain.toml`.
Provato: sull'albero di `5015aeb` fallisce («rust-toolchain.toml is missing»), con versioni diverse fallisce, sull'albero nuovo
passa. Le regole nuove di clippy hanno già la loro prova: il passo clippy della CI, che con Rust 1.100 fallisce sul codice di
prima.

## Consegna

### Dipendenze: prima, dopo, fonte (verificata il 19/11/2026)

| Dipendenza | Prima | Dopo | Fonte verificata oggi |
|---|---|---|---|
| Rust (toolchain) | 1.99.1 qui; nella CI quella dell'immagine (1.99.1) | **1.100.0**, fissata in `rust-toolchain.toml` | `static.rust-lang.org/dist/channel-rust-stable.toml` (12/11/2026) |
| `rust-version` | 1.85 | **1.100** | — (vedi scelta sotto) |
| rustup (qui) | 1.29.2 | 1.29.3 | `static.rust-lang.org/rustup/release-stable.toml` |
| slint, slint-build | 1.18.1 | **1.19.0** | index.crates.io; CHANGELOG di Slint (16/11/2026) |
| Crate nel lock | 551 dal registro, 188 non all'ultima (44 muovibili) | 546, 127 non all'ultima, 0 muovibili | index.crates.io (`esiti/crate_prima.tsv`, `crate_dopo.tsv`) |
| actions/checkout | v7 | v7 (= v7.0.1, l'ultima) | API di GitHub |
| actions/cache | v6 | v6 (= v6.1.0) | API di GitHub |
| Swatinem/rust-cache | `d1527c8f` (v2.9.3) | uguale, l'ultima | API di GitHub |
| actions/upload-artifact, download-artifact | v7, v8 | uguali (= v7.0.2, v8.0.2) | API di GitHub |
| actions/attest-build-provenance | v4 | v4 (= v4.2.2) | API di GitHub |
| actions/configure-pages, upload-pages-artifact, deploy-pages | v6, v5, v5 | uguali (ultime) | API di GitHub |
| `runs-on` CI Linux | ubuntu-24.04 | **ubuntu-26.04** | README di `actions/runner-images` |
| `runs-on` pubblicazione del rilascio | ubuntu-24.04 | **ubuntu-26.04** | idem |
| `runs-on` pacchetti del rilascio | ubuntu-24.04 | ubuntu-24.04, di proposito | idem; glibc da Launchpad e sources.debian.org |
| `runs-on` sito (`pages.yml`) | ubuntu-24.04 | ubuntu-24.04: toccarlo ripubblica il sito | — |
| windows-latest, macos-latest | Windows Server 2025, macOS 26 | uguali (le ultime) | README di `actions/runner-images` |
| Immagini delle prove dei pacchetti | `fedora:latest`, `archlinux:base-devel`, Ubuntu 24.04 | uguali (etichette mobili; Ubuntu come i pacchetti) | — |
| Dipendenze nel PKGBUILD, nel `.deb`, nello spec | nomi senza versione | uguali; nomi presenti oggi | archlinux.org, mdapi Fedora 43/44/rawhide, packages.debian.org, Launchpad 24.04/26.04 |
| Strumenti Python della CI e dei pacchetti | solo libreria standard | uguale | — |
| Python (interprete) | 3.13.5 qui, 3.12.3 su ubuntu-24.04 | 3.14.4 su ubuntu-26.04; l'ultima è 3.15.2 | python.org, README delle immagini |
| Strumenti di sviluppo (`asr_wer.py` ecc.) | versioni non fissate | uguale; venv di `voce-propria` già all'ultima (faster-whisper 1.2.1, ctranslate2 4.9.0, numpy 2.5.5, scipy 1.18.1, soundfile 0.14.0, onnxruntime 1.32.0); venv di `bench/` indietro (numpy 2.5.4, onnxruntime 1.31.1), non toccato | PyPI |
| Klein-TTS-X1.5-Pro | `25e0e73` | uguale: è la testa | API di Hugging Face |
| Pocket TTS italiano | `3e82814a` | uguale: ultima commit dei pesi | API di Hugging Face (albero dei file) |
| Tokenizer di Pocket TTS | `4e1e0a3e` | uguale (file invariato dal 24/9) | API di Hugging Face |
| Codice di Kyutai | `a4a6054d` | uguale: è la testa | GitHub |
| ONNX Runtime | 1.32.0 | uguale: l'ultima | NuGet, PyPI (GitHub risponde 404) |

**La scelta di `rust-version`.** Tre strade: (a) 1.95, il minimo vero chiesto da Slint 1.19, ma nessuno lo prova; (b) 1.100
con la Rust fissata in `rust-toolchain.toml`; (c) 1.100 con la CI che prende ogni volta l'ultima stabile. Scelta (b): la CI su
tre sistemi, i rilasci e le build locali usano la stessa Rust, che è anche l'unica provata, e i rilasci sono ripetibili. Le
immagini di GitHub hanno ancora 1.99.1, quindi senza il file la CI proverebbe una Rust vecchia. Il costo: ogni sei settimane si
cambiano due righe, e `tools/version.py check` fallisce se non sono d'accordo.

### Che cosa è cambiato nel codice e perché

- `Cargo.toml`: `rust-version = "1.100"`. Nuovo `rust-toolchain.toml` (1.100.0, clippy, rustfmt, profilo minimal).
- `crates/app/Cargo.toml`: `slint` e `slint-build` 1.19.0. `Cargo.lock` con `cargo update`. Nessun file `.slint` toccato.
- 8 righe di Rust, per le regole di clippy 1.100: `as_chunks::<N>()` al posto di `chunks_exact(N)` con N costante
  (`pocket/safetensors.rs`, `app/src/sha256.rs`, `mic/examples/virtual_mic.rs`) e `is_multiple_of()` al posto di `% n == 0`
  (`text/src/verbalize.rs`, `pocket/safetensors.rs`, `pocket/mod.rs`, `mic/src/pipewire.rs`). Stesso comportamento: lo dicono i
  52 test e i 43 file audio identici byte per byte.
- `tools/version.py`: il controllo di `rust-version` contro `rust-toolchain.toml`.
- `.github/workflows/ci.yml` e `release.yml`: `runs-on` come in tabella, con il perché scritto accanto.
- `CONTRIBUTING.md`, `docs/releasing.md`, `THIRD_PARTY_NOTICES.md` (Slint 1.19).

### La finestra prima e dopo

`foto/prima/`, `foto/dopo/` (13 stati), `foto/confronto/` (fogli, differenze in rosso, `confronto.json`). In ogni stato
cambiano 220–350 pixel su 257 600 (0,09–0,13%), tutti sugli angoli arrotondati, perché il renderer software di Slint 1.19
li sfuma meglio. La lista delle voci aperta ha una leggera ombra (5 700 pixel, differenza mediana 3 su 255), perché Slint 1.19
disegna l'ombra che lo stile Fluent chiedeva già. «Informazioni» dice «Version 1.19.0». Nessun colore, carattere, misura o
posizione cambiati dai nostri file; per togliere queste differenze bisognerebbe restare a Slint 1.18.1.

### Che cosa resta indietro, e chi lo trattiene

- 127 crate (55 compilati su Linux), tutti trattenuti da crate a monte, nessuno da Kalliope. Elenco con chi li chiede in
  `esiti/crate_trattenute.md`. I principali sono Slint 1.19.0, winit 0.30.13 (l'ultima di winit), accesskit 0.25, zbus 5 e
  wgpu 30 (solo nel lock).
- Build dei pacchetti su ubuntu-24.04: la trattiene la promessa «Debian 13, Ubuntu 24.04 o più recenti» (glibc 2.39). Passare a
  26.04 è una decisione del proprietario.
- `pages.yml` su ubuntu-24.04: cambiarlo fa ripartire la pubblicazione del sito, non autorizzata. Lo decide chi coordina.
- La Rust predefinita di questa macchina resta 1.99.1 (`stable`): il repository usa 1.100.0 dal file.

### Sito e strumenti, solo l'elenco (non aggiornati)

| Dipendenza | Oggi | Ultima |
|---|---|---|
| Playwright (`/workspace/test-playwright`) | 1.60.0 | 1.65.1 (npm, 13/11/2026) |
| Node | 24.22.3 | 26.13.1 (LTS, 10/11/2026) |
| Lexend | 1.007 | 1.007 |
| DejaVu Sans | 2.37 | 2.37 |
| Geologica | 1.010 | 1.010 (google/fonts e `googlefonts/geologica` fermi) |
| Readex Pro | 1.205 | 1.205 |
| Noto Sans Bengali | 3.011 | 3.011 |
| Noto Sans Devanagari | 2.007 | 2.007 |
| Noto Nastaliq Urdu | 3.009 (google/fonts) | **4.000** a monte (`notofonts/nastaliq`, 17/7/2024), non in google/fonts |
| Unicode CLDR (`tools/data/cldr.json`) | 49.0.0 | 49.0.0 |
| fontTools (sottoinsiemi; `~/.local`) | 4.63.0 | 4.68.0 |
| brotli (idem) | 1.2.0 | 1.2.1 |
| Python per `tools/site.py` | quello del sistema | 3.15.2 |

Il sito vecchio («stato») dice ancora «Slint 1.18» (`website/stato/index.html`, riga 387): non è area mia.

### Che cosa non ho verificato

- Il `.rpm` (manca `rpmbuild`) e le prove in `fedora:latest` e `archlinux:base-devel` (mancano docker e podman).
- `desktop-file-validate` e `appstreamcli validate` (non installati; i file non sono cambiati).
- Windows e macOS: nessuna prova qui; la CI li proverà su `main` (con 1.100.0 dal file).
- La CI vera su ubuntu-26.04 (nessun push).
- `kalliope --say` nel microfono (limite della prova, vedi sopra).
- Gli strumenti Python con Python 3.14 o 3.15 (qui c'è solo 3.13.5).
- La finestra in X11 nativo, con scala diversa da 1 o con il tema scuro: le foto sono su Wayland (Weston), scala 1, tema chiaro.
