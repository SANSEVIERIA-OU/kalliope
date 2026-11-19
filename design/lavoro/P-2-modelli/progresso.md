# P-2 · ONNX Runtime e i modelli dentro il programma · progresso

Incarico: `design/lavoro/incarichi/P-2-modelli-nel-programma.md`. Partenza: commit `7369a80` (sopra c'è `45adb3b`, solo
`CLAUDE.md`, `design/lavoro/STATO.md` e l'incarico). Data: 19/11/2026.

## Unità

| # | Unità | Stato |
|---|---|---|
| 0 | Lettura, versioni di oggi, scelte | fatta |
| 1 | Esportazione in `tools/` e prova che rifà i file di V-4 | fatta: identici a V-4 tolti i metadati con i percorsi; audio identico |
| 2 | Strumento di chi mantiene (`tools/release_assets.py build`), valori fissati in un posto solo | fatto: `tools/assets.json`, archivi riproducibili |
| 3 | `fetch_assets.py` dalla release, copia locale su 127.0.0.1, file guastato | fatto: porta 8930, guastato su 8931 rifiutato |
| 4 | Programma: niente scaricamento, modelli accanto al programma | fatto: clippy e 51 test verdi con i modelli della copia locale |
| 5 | Pacchetti con ONNX Runtime, Klein e Pocket; CI con Pocket | fatto: tarball e `.deb` installati, parlano senza variabili, rimossi |
| 6 | `site.py`: solo le release con un tag di versione | fatto, con 2 prove che falliscono sul codice di prima |
| 7 | Controllo settimanale | fatto: «niente di nuovo» contro le fonti di oggi, 6 novità su 6 contro valori vecchi |
| 8 | Documentazione | fatta |
| 9 | Prove: controlli, pacchetti, microfono, Whisper, finestra prima e dopo | fatte; una prova degli strumenti rossa per un conflitto con la pagina «stato» (sotto) |

## Diario

### 19/11, 12:40–13:20 · unità 0–4

- **Versioni di oggi** (fonti ufficiali): NuGet `Microsoft.ML.OnnxRuntime` 1.32.0 l'ultima; Klein `25e0e73` testa di `main`;
  `kyutai/pocket-tts` testa `db04f0e6` (21/10), `languages/italian/model.safetensors` invariato da `3e82814a` (stesso id git
  `4d66c1d8…`); tokenizer invariato (id `9f131c42…`); codice di Kyutai: testa `a4a6054d`, ultima commit che tocca `pocket_tts/`
  `1773f648` (inclusa); Rust stabile 1.100.0. PyPI: torch 2.15.0, onnx 1.23.2, onnxscript 0.7.2, onnx-ir 1.1.0, onnxruntime 1.32.0,
  numpy 2.5.5 … tutte le 41 dell'ambiente dell'esportazione all'ultima, tranne mpmath 1.3.0 (sympy 1.14.0 chiede < 1.4).
  Python: qui 3.13.5; pocket-tts chiede < 3.15, quindi 3.15.2 (l'ultima) non si può usare; 3.14 non provata qui.
- **Repository gated senza chiave**: `api/models/kyutai/pocket-tts` e `…/tree/main/languages/italian` rispondono senza chiave
  (sha, elenco dei file, id git di ogni file; lo SHA-256 LFS è mascherato). `paths-info` no (401). L'id git del puntatore LFS
  basta: cambia se e solo se cambia il file (verificato: dal file di V-4 si ricalcola `4d66c1d8…`).
- **Esportazione** spostata in `tools/pocket_export/` (`export.py` da `v4_esporta.py`, `graphs.py` da `v4_grafi.py`,
  `requirements.txt` con tutte le 41 dipendenze fissate). Prima prova: grafi diversi da V-4 nei byte. Causa: torch.onnx scrive in
  ogni nodo lo stack trace con i percorsi dei file della macchina (`/workspace/kalliope/benchmarks/…/v4_grafi.py`,
  `/workspace/nomedadefinire/…`) e il nome del modulo Python. Tolti (`strip_metadata`, con `ClearField`): con la stessa pulizia
  applicata ai file di V-4, **i quattro grafi sono identici byte per byte** (flow fp32, flow 8 bit, decoder, encoder);
  `pocket.json` e `tokenizer.json` identici. I file pubblicati non portano più i percorsi della macchina di chi esporta.
- **Il controllo dell'esportazione** usa ora una registrazione CC0 (Selfie.wav di `kyutai/tts-voices`): con un segnale sintetico
  i latenti a temperatura 0 divergono già in fp32 (coseno 0,99987), con una voce vera fp32 è a 0,9999999997. Limiti in `BOUNDS`;
  il flow a 8 bit: primi 5 passi coseno 0,998 (limite 0,995).
- **Strumento** `tools/release_assets.py build`: scarica (NuGet con lo SHA-512 del catalogo; Hugging Face con l'id git della
  tree; codice di Kyutai da codeload con il digest dell'albero), esporta, impacchetta in `.tar.xz` riproducibili, scrive
  `tools/assets.json`, stampa il comando di caricamento. Prima esecuzione: 6 file. `--rebuild all`: **gli stessi byte** per tutti.
  Seconda esecuzione senza cambi: niente da costruire. Codice di Kyutai da GitHub identico alla copia di V-4 (`diff -r`).
- **`fetch_assets.py`** dalla release (o da `KALLIOPE_ASSETS_URL`): copia locale su `127.0.0.1:8930`, quattro parti scaricate e
  controllate; seconda volta nessuno scaricamento (cartelle ricontrollate); archivio guastato di un bit su 8931 → «sha256 …,
  expected …», uscita 1, niente lasciato.
- **Stessa voce, stesso audio**: `kalliope-cli` (release) con la cartella di V-4 e con la nuova: voci preparate da giovanni e da
  Selfie e 6 frasi (seme 1) **identiche byte per byte**; la voce di giovanni è identica anche a quella di P-1. Le prove della voce
  di V-4 restano valide.
- **Un difetto trovato** fuori dal mio codice: `tools/test_translations.py`
  (`test_le_fonti_della_pagina_stato_esistono_nel_repository`) fallisce perché la pagina «stato» collega
  `crates/app/src/download.rs`, che l'incarico chiede di togliere. Non posso toccare né la pagina né quella prova: vedi consegna.

### 19/11, 13:20–13:50 · unità 5–9

- Pacchetti costruiti (`build-packages.sh 0.1`, binari in release, modelli dalla copia locale; `.rpm` con lo stand-in di P-1):
  `.deb` 187 108 388 B (prima 15,9 MB), tarball 204 945 239 B (prima 21,6 MB), installato 320 MB. `Depends` senza `curl`.
- `test-packages.sh` con `KALLIOPE_MODEL_DIR`, `KALLIOPE_POCKET_DIR` e `KALLIOPE_ORT_LIB` messi apposta a `/nonexistent` nel chiamante
  (lo script li toglie: se li passasse, i programmi fallirebbero): tarball e `.deb` installati, `--version`, `phonemes`, `say` con
  Giulia 2 225 ms, `voice` + `say --voice` dalla registrazione CC0 1 920 ms, rimossi senza resti. 32 s.
- Foto: 13 stati prima (programma di `7369a80`, release di P-1) e 12 dopo (programma installato dal `.deb`, nessuna variabile), banco
  di P-1 su Xvfb `:138`. **Identici pixel per pixel** in 04–13; 01 «primo avvio» diverso (prima «Scarica la voce», dopo «Pronta»,
  identico pixel per pixel al vecchio 06 «Pronta»); 02 e 03 (scaricamento) non esistono più; nuovo 14 «manca la voce» (installazione
  senza `share/kalliope`): lo stato d'errore di sempre, con il messaggio che dice che cosa manca e dove.
- Microfono virtuale (PipeWire privato, l'app installata, testo scritto con XTEST, `pw-record --target kalliope`): Giulia 2/29 parole
  sbagliate, 0/8 prime parole perse; giovanni (voce preparata, nella cartella dei dati) 5/29, 0/8. Gli stessi numeri e le stesse
  durate di P-1 in release.
- `kalliope-cli` installato, nessuna variabile, 21 testi: **43 file su 43 identici byte per byte a P-1** (voce preparata e WAV). Whisper:
  Giulia 3/72, 0/21; giovanni 5/72, 1/21 («Certo» → «Tret»; in P-1 sullo stesso audio «chat», più «Mi sentite» → «Vi sentite»:
  Whisper non dà lo stesso testo due volte su un audio identico). È il caso già noto di V-4.
- Controllo settimanale contro le fonti vere: «Nothing new». Con valori vecchi apposta (ONNX Runtime 1.31.1, un id dell'encoder di
  Klein, i pesi e il tokenizer di Pocket, il codice `8ef5cbc7` di V-1, Rust 1.99.1): sei novità, una per fonte.
- `site.py` con un `--release-json` che contiene anche la release `assets` (più recente, prerelease): sito costruito per v0.1-rc.1,
  nessun collegamento ad `assets`. Il `site.py` di prima, con lo stesso file, si ferma: «release assets has 0 files ending in
  -amd64.deb».
- Controlli: `cargo fmt --check`, `clippy -D warnings`, `cargo test --workspace` (51 superati, 1 ignorato di proposito) con i modelli
  scaricati dalla copia locale, `version.py check`, `translations.py extract --check` e `check`, `css_logico.py`: verdi. Prove degli
  strumenti: 97, una rossa (vedi «Il conflitto»). Ricostruzione di Pocket con lo strumento finale: stessi byte, pin invariati.
- Pulizia: `.deb` rimosso, server, Xvfb, Weston e PipeWire privati fermati.

## Consegna

### Che cosa è cambiato e perché

- **Il magazzino** è una release dedicata, tag `assets`, prerelease e mai «latest»: non comincia con `v`, quindi `release.yml`
  non parte, e `site.py` ora offre solo i tag `vX.Y`/`vX.Y-…`. Un file per parte, `.tar.xz` riproducibile (stessi contenuti, stessi
  byte: provato con `--rebuild all`), con dentro la cartella, la licenza e le note; il nome porta la versione (versione di ONNX
  Runtime, 7 caratteri della revisione), mai riusato (`-2`, `-3` se cambia il contenuto); i vecchi restano finché una versione li
  usa. Scartati: file singoli (licenze separate dai file, più pin, niente atomicità di una revisione); `.tar.gz` (ONNX Runtime +35%,
  Pocket +14%); una release per versione (tante prerelease nell'elenco e nel sito); Git LFS (traffico a carico del proprietario).
- **Un posto solo per i pin**: `tools/assets.json` (fonti: versioni, revisioni, SHA-256 e id git; file: nome, dimensione, SHA-256,
  cartella, SHA-256 di ogni file dentro). Lo scrive solo `release_assets.py build`; lo leggono `fetch_assets.py`, `check` e le prove.
- **`tools/release_assets.py`** (solo libreria standard): `build` scarica e controlla (SHA-512 di NuGet; id git di Hugging Face, che
  valgono anche per il repository gated senza chiave; digest dell'albero del codice di Kyutai), esporta Pocket nell'ambiente di
  `tools/pocket_export/requirements.txt`, impacchetta, aggiorna i pin, stampa il comando di caricamento e **non carica niente**;
  costruisce solo le parti con fonti nuove (`--rebuild` per le altre). `check` è il controllo settimanale. La chiave: letta solo da
  `HF_TOKEN` nell'ambiente, solo per scaricare i pesi se mancano, mai stampata; i reindirizzamenti verso altri host la tolgono.
- **L'esportazione** (`tools/pocket_export/export.py` e `graphs.py`, da `v4_esporta.py` e `v4_grafi.py`): la stessa di V-4; in più
  toglie dai grafi i metadati di torch.onnx (percorsi dei file della macchina, nomi dei moduli) e controlla i grafi contro il codice
  di Kyutai con una registrazione CC0 e limiti che la fermano. Python: tutte le dipendenze fissate all'ultima di oggi.
- **Il programma**: tolti `download.rs`, `sha256.rs`, gli URL di Hugging Face, `--download-voice`, nella finestra le fasi
  `needs-model` e `downloading`, la barra, il pulsante e le tre callback. L'app e `kalliope-cli` cercano i modelli in
  `../share/kalliope/` accanto al programma (`kalliope_voice::models_next_to_program`, `KLEIN_FOLDER`, `POCKET_FOLDER`), dopo le
  variabili. Modelli mancanti: lo stato d'errore che c'era già, con «Manca la voce: in … non trovo …. Reinstalla Kalliope.».
- **Pacchetti**: ONNX Runtime, Klein e Pocket dentro; licenze e note in `share/doc/kalliope/{onnxruntime,klein-tts,pocket-tts}/`;
  `curl` tolto dalle dipendenze di `.deb`, `.rpm` e PKGBUILD; descrizioni e note di rilascio corrette; `test-packages.sh` parla senza
  variabili, con Giulia e con una voce preparata dalla registrazione CC0.
- **CI**: `fetch_assets.py` per ONNX Runtime, Klein e Pocket su Linux, Windows e macOS, cache sulla chiave di `assets.json`: le prove
  di Pocket girano davvero. **Rilascio**: modelli e registrazione dalla release, `build-packages.sh` con i modelli.
- **`versions.yml`**: lunedì 06:17 UTC e a mano, permessi `contents: read` e `issues: write`, nessun segreto; una segnalazione per
  versione, nessun doppione (titolo già presente, aperta o chiusa).
- **Documentazione**: `docs/releasing.md` (la release `assets`, come si aggiorna ogni file e dove serve il permesso, il controllo
  settimanale e i 60 giorni, verificati oggi nella documentazione di GitHub), `README.md`, `CONTRIBUTING.md`,
  `THIRD_PARTY_NOTICES.md` (citazione, modifiche, regola del consenso come lettura), riga in `benchmarks/voce-propria/README.md`.

### I file della release, pronti in `/tmp/p2-release/`

| File | Byte | SHA-256 |
|---|---|---|
| `onnxruntime-linux-x64-1.32.0.tar.xz` | 9 720 264 | `0c52245d6470b6b84678bc5b2c475c9c6c2667f2931a2ac06c921cfee876756a` |
| `onnxruntime-osx-arm64-1.32.0.tar.xz` | 8 661 284 | `58af6a9bb6732b52137d049ceb6cbfb0430077c223afc74cf3a8634a28c03938` |
| `onnxruntime-win-x64-1.32.0.tar.xz` | 5 103 068 | `3b415c7d133ecad75791863597f5d9b2ca397ee5a0e0af1e7688e2f031f6cb50` |
| `klein-tts-x1.5-pro-25e0e73.tar.xz` | 48 496 720 | `57f7de5a0403505978aaf45e150f69103dc4b61ea2dc93a113b6c6560b026e6f` |
| `pocket-tts-italian-3e82814.tar.xz` | 122 699 524 | `9723a60bb393e4872d5dbf5b1dd7ef4229653265ae5394e8db8b59a3a6a85f02` |
| `test-recording-selfie-323332d.tar.xz` | 304 608 | `a70f06347b1c13d33a29d35ff166a581d51c03a5953446f58ef3d686413d2331` |

`/tmp` non sopravvive a un riavvio: si rifanno uguali byte per byte con
`python3 -I tools/release_assets.py build /tmp/p2-release --rebuild all --cache /tmp/p2-cache --venv /tmp/p2-venv` (la cache ha la
copia dei pesi di V-4; se manca, copiarla da `/workspace/nomedadefinire/bench/voce-propria/modelli/pocket-tts-gated/` in
`CACHE/huggingface/kyutai/pocket-tts/3e82814a68665eec246ff649b14c71331f955c06/languages/italian/`).

### Il comando per caricarli (dopo il permesso del proprietario)

```sh
gh release create assets --repo SANSEVIERIA-OU/kalliope --target main --prerelease --latest=false \
  --title 'Files that go inside Kalliope' --notes-file /tmp/p2-release/assets-release-notes.md \
  /tmp/p2-release/onnxruntime-linux-x64-1.32.0.tar.xz /tmp/p2-release/onnxruntime-osx-arm64-1.32.0.tar.xz \
  /tmp/p2-release/onnxruntime-win-x64-1.32.0.tar.xz /tmp/p2-release/klein-tts-x1.5-pro-25e0e73.tar.xz \
  /tmp/p2-release/pocket-tts-italian-3e82814.tar.xz /tmp/p2-release/test-recording-selfie-323332d.tar.xz
```

Ordine: **prima la release, poi il push** (la CI scarica dalla release; senza, fallisce). Creare la release fa partire `pages.yml`
(`release: published`): sul commit del tag (oggi `origin/main`, il sito di prima) il `site.py` vecchio si ferma con un errore
(«release assets has 0 files ending in -amd64.deb») e il sito in linea resta com'è; con il `site.py` nuovo offrirebbe ancora
v0.1-rc.1. Il push di `main` ripubblica comunque il sito (contiene `website/`): decisione del proprietario, come sempre. Volendo,
`pages.yml` (non area mia) può ignorare le release che non sono `v…`.

### Il conflitto da risolvere (una prova rossa)

`tools/test_translations.py`, `test_le_fonti_della_pagina_stato_esistono_nel_repository`, fallisce: la pagina «stato» collega
`crates/app/src/download.rs`, che l'incarico chiede di togliere. Il collegamento in linea è giusto (porta al file a `v0.1-rc.1`);
è la prova che guarda l'albero di oggi. Non posso toccare né la pagina né quella prova. Proposta pronta, non applicata:
`design/lavoro/P-2-modelli/proposta-prova-fonti.patch` (5 righe; con la patch le 97 prove passano). Senza, la CI è rossa al push.

### Le pagine del sito da cambiare quando si offrirà la prossima versione (solo l'elenco)

- `website/index.html`: la ricostruzione del primo avvio (righe 338–397: «Per parlare, Kalliope deve scaricare la voce: 53 MB…»,
  «Scarica la voce», «Rivedi il primo avvio») e «53 MB per la voce» (riga 404); `website/scena.js` (riga 892, l'animazione).
- `website/installa/index.html`: curl e «internet una volta per la voce (53 MB)» (righe 42, 70), il passo 4 «apri e scarica la voce»
  (59, 239–240).
- `website/aiuto/index.html`: le frasi dello scaricamento (righe 52–82 e seguenti).
- `website/stato/index.html`: righe 301, 340 (`huggingface.co`), 354 («la voce · 53 MB»), 368 (il passo con `download.rs` e
  `catalog.rs`).
- Vecchio catalogo, da togliere comunque nella fase 5: `website/sistema/index.html` (righe 72, 499–501), `website/sistema/ricerca/`.
- Fuori dal sito e fuori dalla mia area: `CHANGELOG.md` riga 22 («Kalliope downloads it (about 53 MB) the first time it starts»);
  `design/progetto.md` (§5 e §7, «Scarica la voce», lo scarico al primo avvio). Le dimensioni dei pacchetti sulle pagine le scrive
  `site.py` dai dati della release.

### Ciò che non ho verificato

- Il `.rpm` (manca `rpmbuild`) e le prove in `fedora:latest` e `archlinux:base-devel` (mancano docker e podman).
- `desktop-file-validate` e `appstreamcli validate` (non installati): la descrizione AppStream è cambiata; l'XML è ben formato.
- Windows e macOS: gli archivi di ONNX Runtime per quei sistemi e le prove di Pocket lì; li proverà la CI su `main`.
- La segnalazione vera su GitHub e il workflow programmato (servono il push e la release); la logica è provata qui, contro le fonti
  vere e con risposte finte per l'apertura senza doppioni.
- `gh release create` e `upload`, e se caricare un file in una release esistente fa partire `pages.yml` (`edited`).
- Lo scaricamento dei pesi con la chiave: la chiave non è mai stata caricata (ogni esecuzione con `env -u HF_TOKEN`), perché il file
  c'era già (copia di V-4, controllata contro l'id git pubblico di Hugging Face, senza chiave).
- L'esportazione con Python 3.14 (qui c'è solo 3.13.5; pocket-tts esclude 3.15).
- `kalliope --say` nel microfono (limite della prova, come in P-1).
- La finestra delle informazioni non nomina Pocket TTS: la citazione è nei pacchetti (`share/doc/kalliope/pocket-tts/NOTICE.txt`,
  `THIRD_PARTY_NOTICES.md`); cambiare quel testo non era permesso.
- Chi aveva installato v0.1-rc.1 ha la voce scaricata in `~/.local/share/kalliope/models/` (53 MB): la versione nuova non la usa e
  non la cancella.
- `benchmarks/voce-propria/scripts/v4_quant.py` e `v4_onnx.py` importavano da `v4_esporta.py`, che si è spostato: non li ho toccati
  (non area mia); la riga nel README dice dove prendere quelle funzioni.
