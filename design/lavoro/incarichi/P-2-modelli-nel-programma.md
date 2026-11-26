# Incarico P-2 · ONNX Runtime e i modelli dentro il programma, aggiornati da noi

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Le decisioni del proprietario** (19/11/2026, `design/lavoro/STATO.md`):
  - «ridistribuiamo con citazione»: il modello di Kyutai;
  - «anche onx lo mettiamo nel programma e a noi l'onere di tenerlo aggiornato così come il modello kyutai»: ONNX Runtime;
  - «ok per tutto» alla proposta:
    - una release di GitHub di Kalliope fa da magazzino dei file;
    - i pacchetti contengono tutto, Giulia e Marco (Klein) compresi, quindi dopo l'installazione non si scarica niente;
    - un controllo automatico ogni settimana segnala le versioni nuove;
    - lo strumento che esporta il modello di Kyutai entra in `tools/`;
    - la citazione come chiede CC BY 4.0.
- **I fatti con le fonti**: `design/lavoro/ricerca/p2-modelli-nel-programma.md`. Leggilo prima.
- **Punto di partenza**: commit `7369a80`, dopo l'aggiornamento di tutte le dipendenze (P-1).

## Che cosa costruire

### 1. Il magazzino: una release di GitHub per i file

- **Una release dedicata**, distinta da quelle del programma. Proponi tu il tag, per esempio `assets`, e come si
  aggiungono le versioni nuove: file con la versione nel nome, e i vecchi restano finché una versione del programma li usa.
  - La release è una prerelease e non è mai «latest», così non si confonde con una versione del programma.
  - Il tag non deve far partire `release.yml` (oggi parte su `v*`).
- **I file**:
  - ONNX Runtime 1.32.0, una per sistema (Linux x86_64, macOS arm64, Windows x64), presa dal pacchetto NuGet ufficiale come
    fa oggi `tools/fetch_assets.py`, con il MIT e `ThirdPartyNotices.txt` dentro;
  - Klein alla revisione di oggi, `25e0e73`, con la sua licenza;
  - Pocket TTS italiano a 6 strati: i file ONNX, `tokenizer.json` e `pocket.json` che il programma usa, con dentro la
    citazione e la licenza CC BY 4.0 e la frase che dice che li abbiamo convertiti.
  - Archivi o file singoli: scegli tu e motiva. Ogni file sta sotto 2 GiB.
- **Ogni file è fissato con il suo SHA-256** nel repository, in un posto solo, letto da tutti quelli che lo usano.

### 2. Lo strumento di chi mantiene: `tools/`

Uno strumento che, quando esce una versione nuova:
- prende ONNX Runtime da NuGet, Klein da Hugging Face, il modello di Kyutai da `kyutai/pocket-tts` con la chiave del
  proprietario;
- esporta il modello in ONNX. Lo script viene da `benchmarks/voce-propria/scripts/v4_esporta.py`, che si sposta in
  `tools/`. Le sue dipendenze Python stanno fissate all'ultima versione di oggi, verificata nelle fonti ufficiali;
- prepara i file della release, calcola gli SHA-256 e aggiorna i valori fissati;
- **non carica niente**. Stampa il comando con cui si caricano i file. Lo esegue solo chi coordina, dopo il permesso del
  proprietario.

Prova che lo strumento rifà gli stessi file di V-4. Il modello di Kyutai l'ha già scaricato l'incaricato di V-4 su
questa macchina (`/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/`): usa quello. Se manca qualcosa, valgono le regole della
chiave qui sotto. Confronta l'uscita con quella di V-4: identica, o con differenze spiegate e misurate. Se differisce, rifai
le prove della voce di V-4.

### 3. Chi usa i file

- `tools/fetch_assets.py` scarica dalla nostra release, non più da NuGet né da Hugging Face. Aggiungi Pocket. Serve alla CI,
  ai rilasci e a chi compila. Per le prove locali, l'indirizzo della release si può cambiare con una variabile.
- **La CI** (`ci.yml`) fa girare anche le prove di Pocket, ora che può avere i file.
- **I pacchetti** (`packaging/linux/`, `release.yml`, PKGBUILD) contengono ONNX Runtime, Klein e Pocket, con le licenze e le
  citazioni in `share/doc/kalliope/`.
  - I modelli vanno in `share/kalliope/`. L'applicazione e `kalliope-cli` li cercano accanto a sé, come già fanno con
    ONNX Runtime (`../lib/kalliope`, poi `../lib`).
  - Le variabili di oggi (`KALLIOPE_MODEL_DIR`, `KALLIOPE_POCKET_DIR`, `KALLIOPE_ORT_LIB`) vincono ancora, per chi sviluppa.
  - `test-packages.sh` prova che il pacchetto installato parla senza nessuna variabile.
- **L'applicazione non scarica più la voce al primo avvio.** Il modello arriva con il programma, e non si scarica niente
  da terzi.
  - Togli lo scaricamento: `download.rs`, gli URL di Hugging Face in `catalog.rs`, `--download-voice`.
  - Nella finestra togli solo ciò che serve allo scaricamento. Nessun colore, carattere o misura nuovi, nessun elemento
    nuovo. Se i file mancano (installazione rotta, compilato senza modelli), resta lo stato d'errore che c'è già, con un
    messaggio che dice che cosa manca.
  - Se togliere lo scaricamento chiedesse di cambiare l'aspetto della finestra, fermati e scrivilo.
    `CLAUDE.md`: «Ogni volta che si tocca l'aspetto dell'applicazione, il primo passo è proporre al proprietario…».
- **`tools/site.py` sceglie la release da offrire fra quelle con un tag di versione** (`vX.Y`, `vX.Y-…`), così la release dei
  file non viene mai offerta come versione del programma. È l'unica modifica permessa a `site.py`: minima, con una prova in
  `tools/test_translations.py` che fallisce sul codice di prima.

### 4. Il controllo di ogni settimana

- Un workflow di GitHub programmato una volta alla settimana, e avviabile a mano. Confronta i valori fissati con le ultime
  versioni:
  - ONNX Runtime su NuGet;
  - Klein su Hugging Face;
  - `kyutai/pocket-tts`, il modello e il tokenizer, e il codice `kyutai-labs/pocket-tts`. Le informazioni di un
    repository gated si leggono senza chiave: verifica che sia così;
  - Rust stabile, già fissata in `rust-toolchain.toml`.
- Quando trova qualcosa di nuovo apre una segnalazione (issue), una sola per versione, senza doppioni. Non aggiorna da sé.
- Permessi minimi e nessun segreto.
- Scrivi in `docs/releasing.md` che GitHub spegne i workflow programmati dopo 60 giorni senza attività nel repository, se
  è ancora vero oggi (verificalo).

### 5. La documentazione

- `docs/releasing.md`: come si aggiorna ogni file, passo per passo, e dove serve il permesso del proprietario. È caricare
  i file nella release e pubblicare.
- `README.md`, `CONTRIBUTING.md`, `THIRD_PARTY_NOTICES.md`: dove stanno i file, la citazione di Kyutai e la conversione,
  e la regola del consenso detta a chi usa Kalliope. La regola non diventa una condizione aggiunta alla licenza dei pesi:
  è una lettura, non un parere legale.
- `benchmarks/voce-propria/README.md`: una riga che dice dove è andato lo script dell'esportazione.
- **Il sito, solo l'elenco**: le pagine che dicono che la voce si scarica al primo avvio (53 MB). Oggi sono giuste, perché
  descrivono v0.1-rc.1. Non toccarle.

## Prove (fino al verde)

- Una copia locale della release, servita su `127.0.0.1` da una porta fra 8930 e 8939. `fetch_assets.py` scarica da lì,
  con gli SHA-256 controllati. Un file guastato apposta deve far fallire lo scaricamento.
- I controlli di `CONTRIBUTING.md`: `cargo fmt`, `clippy -D warnings`, `cargo test --workspace` con i modelli presi dalla copia
  locale, `tools/version.py check`, le prove degli strumenti.
- **I pacchetti**:
  - tarball e `.deb` costruiti, installati, provati e rimossi con `test-packages.sh`, senza variabili;
  - `kalliope-cli say` con Giulia;
  - `kalliope-cli voice` più `say` con la registrazione CC0 di V-4;
  - Whisper sente le parole giuste e nessuna prima parola persa.

  Scrivi le dimensioni dei pacchetti.
- **L'applicazione installata, come un utente**, sul display di prova di P-1 (`design/lavoro/P-1-dipendenze/strumenti/`):
  - il primo avvio va subito a «Pronta», senza scaricare;
  - foto degli stati prima e dopo, con il confronto: devono mancare solo gli stati dello scaricamento;
  - l'applicazione parla nel microfono virtuale del PipeWire privato di prova, con Giulia e con la voce preparata, e Whisper
    sente le parole.
- Il workflow settimanale: la sua logica provata qui, contro le fonti vere di oggi (deve dire «niente di nuovo») e contro
  valori fissati vecchi apposta (deve dire che cosa è nuovo). La segnalazione vera su GitHub non si può provare senza push:
  dillo.
- `site.py`: il sito costruito con un `--release-json` che contiene anche la release dei file offre ancora v0.1-rc.1.
- Ogni difetto trovato diventa una prova che fallisce sul codice di prima.

## Regole

- **Area tua**:
  - `crates/`, `Cargo.toml`, `Cargo.lock`. Per `crates/app/ui/`, solo togliere ciò che serve allo scaricamento;
  - `tools/fetch_assets.py`, lo strumento nuovo e lo script dell'esportazione in `tools/`, `tools/version.py` se serve;
    `tools/site.py` e `tools/test_translations.py`, solo per la scelta della release;
  - `.github/workflows/` tranne `pages.yml`; `packaging/`;
  - `README.md`, `CONTRIBUTING.md`, `docs/`, `THIRD_PARTY_NOTICES.md`, `benchmarks/voce-propria/README.md`;
  - `design/lavoro/P-2-modelli/` per `progresso.md` (aggiornato a ogni unità finita), esiti e foto.
- **Non toccare** `website/`, `design-system/`, `pages.yml`, né il resto di `design/`.
- **Nessun commit e nessun push. Nessuna release creata e nessun file caricato.** Niente `gh release`, niente
  `hf upload`, nessun repository nuovo. Nessun altro agente. Niente account.
- **La chiave di Hugging Face** è in `/workspace/kalliope/.env`, alla riga `HF_TOKEN`. Ti serve solo se manca un file di
  `kyutai/pocket-tts`.
  - Non mostrare mai quel file: niente `cat`, `grep` o lettura.
  - Per sapere se la chiave c'è: `[ -n "$HF_TOKEN" ]`.
  - Caricala solo dentro il comando che la usa: `bash -c 'set -a; . /workspace/kalliope/.env; set +a; …'`.
  - Niente `hf auth login`.
  - La chiave non si scrive mai in file, log o nel repository.
  - Serve solo a scaricare i file necessari di `kyutai/pocket-tts`.

  Lo strumento in `tools/` legge `HF_TOKEN` dall'ambiente e non lo stampa mai.
- **Le voci delle prove**: solo registrazioni CC0 o di chi ha dato il consenso, come in V-4.
- **La memoria è stretta** (circa 7 GB disponibili al 19/11, per programmi che non sono di Kalliope):
  - una compilazione, un'esportazione o una prova pesante alla volta;
  - se la memoria disponibile scende sotto 1,5 GB, aspetta;
  - niente cicli di attesa in background.
- **Cartelle**:
  - build in `/tmp/voce-m-target`;
  - cartelle temporanee `/tmp/p2-*`;
  - file scaricati in cartelle proprie; Python con `-I` quando li legge.
- **Porte**: 8765, 8766 e 8767 sono del proprietario; le tue sono 8930–8939.
- **Lo schermo**: mai finestre su `DISPLAY :0` o `wayland-1`, lo schermo vero del proprietario. Solo il display di prova.

## Consegna

Nella risposta finale e in `progresso.md`:
- che cosa è cambiato e perché, con le scelte fatte e le alternative scartate;
- l'elenco dei file della release, con dimensioni e SHA-256, e dove stanno qui pronti da caricare;
- il comando esatto per caricarli, che chi coordina eseguirà dopo il permesso;
- gli esiti delle prove con i numeri, compresi pacchetti, microfono e Whisper;
- le foto della finestra prima e dopo;
- le pagine del sito da cambiare quando si offrirà la prossima versione;
- ciò che non hai verificato.
