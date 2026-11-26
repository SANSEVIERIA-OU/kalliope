# V-m, V-1, V-2/V-3, V-4 · progresso

## V-4 · Pocket TTS ufficiale attuale (gated) dentro il programma (dal 19/11, incarico `design/lavoro/incarichi/V-4-pocket-ufficiale-nel-programma.md`)

### Dove ero alle 08:10 (prima del via all'accesso; superato dal diario qui sotto)

- Letti per intero V-4 e V-3 (parte B, prove, regole). Letti il programma (`crates/voice` lib.rs e ort.rs, `crates/app`
  engine.rs, catalog.rs, settings.rs, main.rs, audio.rs, download.rs, `crates/cli`) e il codice ufficiale attuale di Kyutai
  (tts_model.py, flow_lm.py, attention.py, transformer.py, rope.py, mimi.py, conv.py, seanet.py, resample.py, mlp.py,
  text_chunking.py, text_conditioner.py, config.py, audio_utils.py, model_state.py).
- **Nessun file del programma toccato finora** (`crates/`, `tools/fetch_assets.py`, `packaging/`, `docs/`, `README.md`,
  `THIRD_PARTY_NOTICES.md` intatti). Nessun processo lanciato in background, nessuno in corso.
- **Accesso al repository gated**: verso le 08:09 la riga `HF_TOKEN=` di `/workspace/kalliope/.env` era vuota (controllato solo con
  `[ -n "$HF_TOKEN" ]`); poi chi coordina ha scritto che la chiave c'è e che il repository risponde 206 con la chiave. **Dal
  repository gated non ho ancora scaricato nulla.** `hf` non è nel PATH: si usa `/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/.venv/bin/hf`
  (versione 2.4.0); `hf auth login` non va usato, la chiave si carica solo dentro il comando che scarica.

### Versioni verificate oggi (19/11) sulle fonti ufficiali

- Codice ufficiale `kyutai-labs/pocket-tts`: main `a4a6054d` del 18/11/2026 (dopo `8ef5cbc7` usato in V-1, cambia solo
  `text_chunking.py`: maiuscola dopo virgolette e parentesi d'apertura, PR #437); PyPI `pocket-tts` 4.0.1 del 21/10/2026.
  Nel repository c'è anche un porting ufficiale in Rust (`rust/`, su `xn-ptts`, MIT): alternativa da valutare, non usata.
- Hugging Face: `kyutai/pocket-tts` rev `db04f0e6` (21/10/2026, gated auto, CC-BY-4.0); `kyutai/pocket-tts-without-voice-cloning`
  rev `a7056f50` (21/10/2026); `kyutai/tts-voices` rev `323332d3`. La configurazione ufficiale italiana punta ancora a
  `languages/italian/model.safetensors@3e82814a` (gated), `…without-voice-cloning…@1e08e6a2`, tokenizer `@4e1e0a3e`.
- onnxruntime 1.32.0 (13/11/2026) è ancora l'ultima; onnx 1.23.2, torch 2.15.0, tokenizers 0.23.3, safetensors 0.8.0,
  huggingface_hub 2.4.0, sentencepiece 0.2.3.

### Scaricato in V-4 (prima parte; i file del gated sono nel diario qui sotto)

- `/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/codice/dl-pocket-tts-a4a6054d/`: il codice ufficiale a `a4a6054d`
  (archivio di GitHub, scaricato per intero ed estratto; nessuno scaricamento a metà).

### Piano deciso alle 08:10, poi seguito (diario)

1. Scaricare dal gated, con la chiave caricata solo nel comando, in
   `/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/modelli/pocket-tts-gated/` i soli file
   `languages/italian/model.safetensors` e `languages/italian_24l/model.safetensors` alla revisione `3e82814a`
   (comando: `bash -c 'set -a; . /workspace/kalliope/.env; set +a; H=…/.venv/bin/hf; $H auth whoami >/dev/null && $H download kyutai/pocket-tts languages/italian/model.safetensors --revision 3e82814a68665eec246ff649b14c71331f955c06 --local-dir …'`),
   La chiave resta solo nella variabile d'ambiente di quel comando: niente login, niente copia nella cache. Poi confronto tensore per tensore con i pesi aperti
   `@1e08e6a2` (devono differire solo in `mimi.encoder.*`, `mimi.encoder_transformer.*`, `mimi.downsample.*`).
2. Catena di riferimento in Python (codice ufficiale `a4a6054d`, impostazioni ufficiali): voce clonata da una registrazione
   aperta di `kyutai/tts-voices` (anna, marius, alba: già in `modelli/pocket-tts-senza-clonazione/registrazioni-kyutai/`)
   contro la voce pronta di Kyutai (`voci-attuali/`).
3. Esportazione ONNX propria (nessuna esportazione della versione attuale con clonazione trovata il 17/11; ricontrollare):
   - `flow_lm` con cache libera passato/presente (niente cache fissa, posizione RoPE dalla lunghezza del passato), tabella del
     testo e rete di flusso (1 passo LSD, s=0, t=1) nello stesso grafo: un solo `Run` per fotogramma; int8 dinamico sulle MatMul;
   - decoder Mimi in streaming (stati delle convoluzioni, cache a finestra di 250 posizioni);
   - encoder Mimi in streaming a pezzi di 80 ms × k (esatto, al posto dei pezzi sovrapposti di V-1: l'attenzione piena a 200 Hz su
     25 s era la causa dei 3,9 GB), con proiezione del parlante e `bos_before_voice` nel grafo;
   - onnxruntime 1.32.0 nel `.venv` per le prove.
4. Controllo automatico breve (2 voci, frasi brevi e una decina di frasi; prima parola, WER, somiglianza; contro i numeri di
   maggio di V-1).
5. Parte B: motore in Rust in `crates/voice` (tokenizer Unigram con byte fallback come `tokenizer.json`, preparazione del testo e
   divisione ufficiali, safetensors dello stato voce compatibile con Kyutai, ricampionamento come `resample_poly`, fine su pausa),
   CLI, `engine.rs`, ONNX Runtime 1.32.0, attribuzione, prove.

- 19/11 08:11: chiave presente, `hf auth whoami` risponde con l'account del proprietario. **Avviato lo scaricamento** di
  `languages/italian/model.safetensors@3e82814a` in `modelli/pocket-tts-gated/` (in primo piano). Se la sessione si ferma a metà,
  lo stesso comando `hf download` riprende dai file `.incomplete` in `modelli/pocket-tts-gated/.cache/`.
- 19/11 08:12 **Scaricati dal gated, completi** (con la chiave caricata solo nel comando), in
  `/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/modelli/pocket-tts-gated/` (revisione in `REVISION`):
  - `languages/italian/model.safetensors@3e82814a` (219 029 196 byte, sha256 `11c226c1…`);
  - `languages/italian_24l/model.safetensors@3e82814a` (672 178 676 byte, sha256 `b318edee…`).
  Controllato con `grep -rlF` senza stamparla: la chiave non compare in quella cartella, in `~/.cache/huggingface` né in
  `benchmarks/`. Nessun altro file scaricato dal gated.

- 19/11 08:14 **Compatibilità gated/aperti** (`scripts/v4_compat.py`, `esiti/v4/compatibilita.json`, picco 1,6 GB, 6 s): a 6 e
  a 24 strati i due file hanno gli stessi tensori con le stesse forme e sono **identici bit per bit ovunque tranne
  `mimi.encoder.*` (22 tensori) e `mimi.encoder_transformer.*` (20)**, azzerati nei file aperti. Il downsample, la proiezione
  del parlante, `bos_before_voice`, il decoder Mimi e tutto il flow LM sono uguali. Quindi tutto ciò che non codifica la voce si
  può costruire e provare dai pesi aperti, e l'encoder viene dal gated.

- 19/11 08:14 Scaricato dal gated anche `common_voice_it_36520747-enhanced-v2.mp3@64ab7d24` (la registrazione della voce
  italiana giovanni, Common Voice CC0, sha256 `c1a6cc4e…`) in `modelli/pocket-tts-gated/registrazioni-64ab7d24/`; dal repository
  aperto gli stati pronti a 24 strati di giovanni, anna, marius, alba `@a7056f50` in
  `modelli/pocket-tts-senza-clonazione/voci-attuali-24l/`. Licenze delle registrazioni (README di `kyutai/tts-voices@323332d3`):
  vctk CC BY 4.0, voice-donations CC0, alba-mackenna CC BY 4.0.
- 19/11 08:18 **Catena di riferimento, 6 strati** (`scripts/v4_riferimento.py`, `esiti/v4/riferimento_6.json`, picco 2,0 GB con
  ECAPA e Whisper): la voce clonata dalla registrazione dal codice ufficiale con i pesi gated **coincide con la voce pronta di
  Kyutai** per tutte e quattro le voci: stessa lunghezza (84, 155, 127, 127 posizioni), coseno delle cache 1,0000 in ogni strato,
  stesso audio (ECAPA 1,00, stessa durata, stesse parole). Quindi Kyutai calcola le voci pronte proprio con questa catena.
- 19/11 08:22 **Catena di riferimento, 24 strati** (`esiti/v4/riferimento_24.json`, picco 2,9 GB): come a 6 strati, la voce
  clonata coincide con quella pronta (coseno delle cache 1,0000 in tutti i 24 strati, ECAPA 1,00).
- 19/11 08:23 Esportazioni ONNX della versione attuale, ricontrollate oggi: nessuna. Le due italiane aggiornate di recente
  (`rxdtech/pocket-tts-onnx` del 19/11, `Phoonnx/pockettts-it-kyutai-unicode` del 18/11) hanno il tokenizer di maggio
  (`tokenizer.model` sha `6583b974`) e gli stessi file di `xennonf4`. Quindi l'esportazione la faccio io dal codice ufficiale.

### Consegna (19/11 09:50)

- Parte A e B fatte; prove verdi (`cargo fmt`, `clippy -D warnings`, `cargo test --workspace` con Klein, Pocket e ONNX Runtime
  1.32.0, `tools/version.py check`). Chiave: non compare in nessun file (controllato con `grep -rlF` sulle cartelle del repository,
  dei dati, di `/tmp/voce-m-*` e della cache di Hugging Face). `scripts/comune.py` ora punta alla libreria 1.32.0 del `.venv`.
- Nessun processo lasciato in esecuzione. Nessun commit, nessun push.
- Resta a chi coordina e al proprietario: dove ospitare i file del modello (oggi in `modelli/pocket-kalliope/italian`), la finestra
  per aggiungere la propria voce (punto 3, con la proposta dei valori del design system per Slint), la sorgente di ONNX Runtime
  (NuGet al posto delle pagine di GitHub che qui rispondevano 404), e le dipendenze non all'ultima (Rust 1.100.0, Slint 1.19.0).

## V-3 (sostituisce V-2) · Il motore nel programma, parte A: il trucco regge? (dal 17/11 20:20)

- 20:30 Scaricati (repository aperti, nessun account): pesi italiani attuali 6 e 24 strati `@1e08e6a2` (uguali alla testa del
  repository), quattro stati di voci pronte `@a7056f50`, tre registrazioni di `kyutai/tts-voices@323332d3`.
- 20:40 **Compatibilità dei pesi** (`scripts/v2_compat.py`, `esiti/v2/compatibilita.json`): il codec Mimi è stato riaddestrato.
  Fra maggio e oggi nessun tensore del codec è uguale: decoder 0/22 uguali (il più grande, 1,8 milioni di numeri, coseno -0,001),
  decoder transformer 0/20, downsample (l'ultimo strato dell'encoder, quello che fa i 32 numeri letti dalla proiezione) coseno
  0,006, quantizer 0,099, upsample 0,358; proiezione del parlante coseno 0,138. L'encoder è azzerato in entrambi i file aperti.
  L'esportazione di maggio ha downsample e proiezione identici a maggio. Fra 6 e 24 strati attuali il codec è identico.
  Conclusione dai pesi: l'encoder di maggio parla un altro spazio latente; il trucco non può funzionare.
- 21:20 **Conferma con tre voci pubblicate da Kyutai** (`scripts/v2_unione.py`, `esiti/v2/unione.json`): con il trucco la
  versione attuale non dice le parole (Whisper: «Eh...», niente, «Sottotitoli…»; frasi fino alla lunghezza massima) e non
  assomiglia alla voce: ECAPA contro la voce pronta 0,01 / 0,23 / 0,10, contro 0,64–0,75 della stessa voce pronta con un altro
  seme. La catena è giusta (stessa lunghezza del riferimento di Kyutai, latenti recuperati con scarto 2·10⁻⁷).
- **Fermato prima della parte B**, come chiede l'incarico: `crates/`, `tools/fetch_assets.py`, `packaging/`, `docs/`,
  `README.md` del repository e `THIRD_PARTY_NOTICES.md` non sono stati toccati. Sezione nel README di `benchmarks/voce-propria/`.
- Prossimo passo: la decisione del proprietario (account per l'encoder attuale, oppure la versione di maggio, oppure un altro
  modello).


## V-1 · Rendere affidabile Pocket TTS (incarico `design/lavoro/incarichi/V-1-pocket-affidabile.md`, dal 17/11 15:30)

- 15:35 Codice ufficiale `kyutai-labs/pocket-tts` (MIT, rev 8ef5cbc7) scaricato e confrontato con il wrapper dell'esportazione
  ONNX. Differenze: il riferimento non finisce su 80 ms di silenzio (`end_on_pause`, PR #334: «a voice prompt that stops on
  speech ... a wrong or missing word»), temperatura 0,7 invece di 0,3 (default ufficiale), niente minimo di 6 passi prima
  della fine, niente dissolvenza di 5 ms. `scripts/pocket.py` le rende attivabili una per una.
- 15:45 Profilo di ONNX Runtime: il 63% del tempo del modello va a copiare la cache fissa di 1000 posizioni (ScatterND,
  Gather), i prodotti di matrici l'11%. `scripts/onnx_cache.py` rende libera la lunghezza della cache (solo la dichiarazione
  delle dimensioni): in fp32 latenti identici bit per bit, 1,02 → 0,83 CPU-s per s; in int8 0,89 → 0,65.
- 16:20 Memoria della codifica: tutta la voce di 25 s in un colpo 3,9 GB (attenzione piena dell'encoder Mimi esportato),
  a pezzi di 5 s con 2 s di sovrapposizione 0,88 GB e latenti uguali (coseno minimo 0,9999); 10 s interi 0,9 GB, 15 s 1,6 GB.
  Voce salvata: stato 15 MB (6 strati, ricarica 50-160 ms) o embedding 0,6 MB (ricarica 0,5-1,1 s). `scripts/v1_memoria.py`.
- 17:20 Prima parola, 6 strati, 4 persone × 2 semi: vecchia 22/40, fine su pausa 22/40, temperatura 0,3 17/40, tutte le
  impostazioni ufficiali 15/40 (WER 14,6% → 11,3%); frasi brevi quasi sempre perse (0,88 s, spesso silenzio).
- 17:50 La causa: l'esportazione ONNX è fatta dalla versione italiana di maggio 2026 (stesso tokenizer, sha 6583b974; latenti
  fp32 uguali al codice ufficiale su quella versione, coseno medio 0,996). Quella versione, anche nel codice ufficiale e con una
  voce di Kyutai (giovanni), comincia a parlare senza silenzio iniziale (0,03-0,05 s) e perde le parole brevi; la versione
  italiana attuale (PR #326 del 24/9 e #344 dell'1/10: nuovo tokenizer, «single words correct 65-87% against 28-47%», «the
  previous students ended early when given prompts longer than about 12 s») parte con 0,33 s di silenzio come Klein. Il
  modello attuale con la clonazione è «gated»: serve un account che accetti le condizioni (decisione del proprietario).
- 18:40 Conferma con Whisper sulla voce giovanni (2 semi, 5 frasi e 16 brevi): esportazione ONNX (versione vecchia) prima
  parola persa 4/10 e brevi 16/32; versione vecchia nel codice ufficiale 3/10 e 14/32; **versione attuale nel codice ufficiale
  0/10 e 0/32**, WER 1,6% come Klein. Sulle nostre persone, con la versione vecchia: impostazioni ufficiali 15/40, con
  riferimento di 10 s 12/40 (WER 8,0%, ma somiglianza 0,53 invece di 0,57); 24 strati 21/40 (WER 7,4%). Provati e scartati:
  spazi davanti alle frasi brevi (`pad_with_spaces_for_short_inputs`), silenzio forzato all'inizio (peggio).
- 19:30 Combinazioni di velocità misurate una alla volta, ma con la macchina carica (load 19-34): cache libera 1,05 → 0,78
  CPU-s per s (6 strati int8, 2 thread); pezzi di 4 fotogrammi: nessun vuoto in 10 frasi, primo suono 243 ms; 24 strati più lenti
  del tempo reale anche a 4 thread.
- 19:40 Piano cambiato da chi coordina: niente più prove sulla versione di maggio; scrivere che cosa è «gated», la licenza, le
  condizioni, la ridistribuzione e che cosa c'è senza account; poi la regola nuova (ultime versioni): versione attuale senza account
  = pesi aperti senza clonazione (encoder azzerato) e 27 voci pronte; nessuna esportazione ONNX di terzi della versione attuale con
  clonazione; dipendenze tutte all'ultima versione tranne onnxruntime (1.31.1 contro 1.32.0 del 13/11; controllato: il guadagno
  della cache resta).
- 20:10 Pagina d'ascolto aggiornata sul posto (sezione «Pocket TTS prima e dopo: la prima parola», 320 `<audio>` su 320 caricano
  in Chromium, nessun errore); README con la sezione V-1; consegnato a chi coordina.

## Ultimo comando (V-1)

- `python -I scripts/pagina.py`; `python -I scripts/v1_resoconto.py`

## Problemi aperti (V-1)

- La clonazione con la versione italiana attuale richiede l'account (decisione del proprietario).
- Le combinazioni di velocità andrebbero rifatte a macchina scarica; la velocità della versione attuale non è misurata.
- Alcune righe delle frasi brevi (pausa, temperatura, 10 s, 24 strati) sono valutate senza il silenzio attorno.

## Fatto

- 17/11 11:10 Letture (CLAUDE.md, STATO.md, memoria, SINTESI e rapporti 1-2-3-4, banco del 12/11, crates cli/voice).
- `kalliope-cli` ricostruito senza toccare `crates/` in `/tmp/voce-m-target` (stesso sorgente di `main`).
- Ambiente Python proprio `voce-propria/.venv` (torch 2.15 CPU, SpeechBrain 1.1.2, ORT 1.31.1, faster-whisper 1.2.1,
  Resemblyzer 0.1.4).
- Persone: quattro lettori LibriVox (pubblico dominio), riferimento 25-27 s dal capitolo 1, quattro brani tenuti da parte e
  cinque brani di controllo dal capitolo 2; riferimento rovinato per F1 e M2 (`scripts/prepara_persone.py`,
  `esiti/persone.json`).
- Frasi normalizzate da Kalliope (`esiti/frasi.json`); voce di oggi fatta da `kalliope-cli` (`scripts/oggi.py`).
- Modelli scaricati: MeanVC2-ONNX (kiarina, rev 2db97430), OpenVoice V2 converter (rev f36e7edf), ECAPA (rev 0f99f2d0).
- Punti di riferimento ECAPA (contro il centroide dei brani tenuti): persona contro sé 0,80-0,85; altre persone 0,05-0,22;
  Giulia/Marco 0,16-0,22; riferimento rovinato 0,66 (F1) e 0,58 (M2).

- 11:40 Strada 1 generata: Pocket `italian_24l` (circa 3,3 CPU-s per s, preparazione 27-47 CPU-s, RSS fino a 3,8 GB) e
  `italian` (circa 1,1 CPU-s per s), tutti e sei i riferimenti (`scripts/genera.py`).
- 11:58 MeanVC2 provato su F1 (uscita a 16 kHz, allineata a Klein; 0,37 CPU-s per s il solo convertitore).

- 12:06 Strada 2 generata: MeanVC2 fp32 (0,4 CPU-s per s il solo convertitore, preparazione 30-38 CPU-s) e OpenVoice V2
  (1,7 CPU-s per s, preparazione 0,3 CPU-s).
- 12:26 `valuta.py` su oggi, Pocket 24/6, MeanVC2, OpenVoice (`esiti/qualita.json`).
- 12:44 `costo.py` (2 thread, F1 e M1, ricerche ferme con SIGSTOP) → `esiti/costo.jsonl`.

- 13:00 MeanVC2 int8 (export predefinito: ASR, DiT e Vocos int8): un tono fisso a circa 4 kHz e parole storpiate
  (WER 13-45%); isolato: è il DiT int8 (con solo l'ASR int8 la frase di prova è perfetta).
- 13:03 Ricerche F1 e M1 finite (2563 e 2653 passi in 3600 CPU-s, 83 min d'orologio, 700 MB). Resemblyzer sale a 0,85/0,83,
  ECAPA sui brani tenuti no (F1 0,29 → 0,27; M1 0,27 → 0,37): la ricerca impara il giudice più che la voce.
- 13:15 Esperimento in più: la stessa ricerca giudicata da ECAPA (F1, M1, 1800 CPU-s ciascuna) e WeSpeaker ResNet34
  (Apache-2.0) come terzo giudice indipendente in `valuta.py` e `curva.py`.

- 13:58 F1d finita e valutata (ECAPA 0,35). 14:18 F1 giudicata da ECAPA (30 min): ECAPA 0,42, WeSpeaker 0,44 sui brani
  tenuti (con Resemblyzer: 0,28 e 0,41).
- 14:20 Costo della voce trovata contro la voce di oggi, nella stessa finestra (carico ~30): 0,175 e 0,168 CPU-s per s.
- README: metodo, limiti, «che cosa si vede al posto dell'ascolto» scritti; tabelle e fatti in breve da completare.

- 15:09 Tutte le ricerche finite e valutate (F2 0,30; M2 0,24; M2d 0,18; M1 giudicata da ECAPA 0,40 ECAPA ma 0,25
  WeSpeaker, voce a 210 Hz).
- 15:20 README completo (fatti in breve, tabelle da `resoconto.py`, che cosa si vede al posto dell'ascolto, metodo, limiti);
  pagina d'ascolto rifatta e provata in Chromium (194 `<audio>` su 194 caricano, nessun errore), 56 MB.

## In corso

- Niente: incarico consegnato a chi coordina.

## Prossimo passo

- Chi coordina serve la pagina d'ascolto al proprietario (cartella `voce-propria/ascolto/`, si serve da sola).

## Ultimo comando

- `python -I scripts/resoconto.py`; `python -I scripts/pagina.py`

## Problemi aperti

- GSM non ha il codificatore in PyAV: il riferimento rovinato usa MP3 a 16 kbit/s dopo la banda del telefono.
- Il riferimento di M2 finisce con «Fine del capitolo 2», detto dallo stesso lettore: lasciato.
- Pocket: la preparazione (codifica Mimi del riferimento di 25-27 s) arriva a 4,6-5 GB di memoria; `italian_24l` parla con
  2,2 GB e va più lento del tempo reale a 2 thread su questa macchina carica.
- Un `pgrep -f` troppo largo ha fermato per qualche minuto anche la shell della misura dei costi: ripresa a mano, nessun
  effetto sui numeri (le ricerche contano il tempo di CPU).
- Il controllo con Whisper base durante la ricerca è severo: conta come errore «e» al posto di «è» e le parole fuse
  («esereno»); 7 controlli falliti su 17 (F1) e 22 (M1) per questo motivo, non per voci incomprensibili.
