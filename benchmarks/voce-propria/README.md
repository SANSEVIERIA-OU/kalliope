# La voce di chi usa Kalliope: misura delle tre strade (17/11/2026)

Incarico V-m (`design/lavoro/incarichi/V-misure-voce.md`), con il via del proprietario del 17/11/2026 per **misurare**,
non per costruire: in V-m, V-1, V-2 e V-3 il programma (`crates/`) non è stato toccato; in V-4 (prima sezione qui sotto) il
motore che imita la voce è entrato nel programma. Qui i fatti; nessuna raccomandazione.

Le tre strade per far parlare Kalliope con la voce della persona:

1. **Un secondo motore che imita la voce**: Pocket TTS, che clona dalla registrazione (pacchetti `italian_24l` e `italian`).
2. **La voce di oggi più un convertitore del timbro**: Klein (Giulia per le donne, Marco per gli uomini, come oggi nel
   programma) seguito da MeanVC2 o da OpenVoice V2.
3. **Cercare la voce dentro quella di oggi**: modificare i 256 numeri di una voce di Klein finché un misuratore del parlante
   dice che assomiglia alla registrazione, sul modello di KVoiceWalk, con un tetto di un'ora di CPU per persona.

La pagina d'ascolto per il proprietario è in `/workspace/nomedadefinire/bench/voce-propria/ascolto/index.html`
(statica, solo HTML e `<audio>`; si può servire da sola, per esempio `python3 -m http.server 8900` in quella cartella).

## La versione ufficiale attuale, dentro il programma (V-4, 19/11/2026)

Incarico `design/lavoro/incarichi/V-4-pocket-ufficiale-nel-programma.md`: il proprietario ha creato l'account Hugging Face e
messo la chiave di lettura in `/workspace/kalliope/.env`; la chiave è stata caricata solo dentro i comandi che scaricavano e non
compare in nessun file (controllato con `grep -rlF`, senza stamparla). Diario: `progresso.md`.

### In breve

- **Gated e aperti**: a 6 e a 24 strati i pesi con la clonazione (`kyutai/pocket-tts@3e82814a`) e quelli aperti
  (`kyutai/pocket-tts-without-voice-cloning@1e08e6a2`) sono identici bit per bit, tranne i 42 tensori dell'encoder Mimi e del suo
  transformer, azzerati negli aperti (`scripts/v4_compat.py`).
- **La catena ufficiale**: la voce clonata dal codice ufficiale dalla registrazione di giovanni, anna, marius e alba coincide con
  la voce pronta di Kyutai (coseno delle cache 1,0000 in ogni strato, stesso audio), a 6 e a 24 strati (`scripts/v4_riferimento.py`).
- **Esportazione propria** (non esiste un'esportazione ONNX della versione attuale: le ultime italiane, del 18 e 19/11, hanno il
  tokenizer di maggio), dal codice ufficiale `a4a6054d` (`scripts/v4_grafi.py`, `scripts/v4_esporta.py`):
  - `flow_lm.onnx`: un passo del flow LM con la tabella del testo e la rete di flusso nello stesso grafo (un solo `Run` per
    fotogramma) e la cache passato/presente senza lunghezza fissa (in V-1 la cache fissa di 1000 posizioni costava il 63%);
  - `mimi_decoder.onnx` e `mimi_encoder.onnx` in streaming, con lo stato esplicito: l'encoder a pezzi da 0,8 s dà lo stesso
    risultato dell'encoder ufficiale sull'intera registrazione (differenza 4·10⁻⁶) senza l'attenzione piena che in V-1 costava
    3,9 GB;
  - in fp32 contro il codice ufficiale: latenti di 40 passi a temperatura 0 differenza massima 9·10⁻⁴ su 5,5 (24 strati
    6·10⁻⁵), stato della voce 7·10⁻⁶, audio 1,2·10⁻⁶;
  - flow LM con i pesi a 8 bit a blocchi di 32 e calcolo int8 per blocco (`MatMulNBits`, accuracy level 4): 141 MB invece di
    358, 8,6 ms per passo invece di 13,2 (2 thread), latenti dei primi passi coseno 0,9999. L'int8 dinamico (103 MB, 5,9 ms) si
    allontana di più (coseno 0,97), i 4 bit troppo (0,88).
- **Il controllo breve** (`scripts/v4_onnx.py`, `scripts/v4_controllo.py`; giovanni e F1, 5 frasi e 16 brevi, 2 semi): la prima
  parola non si perde più (grafi: frasi 1/10 e 0/10, brevi 2/32 e 0/32; codice ufficiale 0/10, 1/32, 0/32), contro maggio
  (V-1) 4/10 e 16/32 su giovanni e 15/40 sulle persone.
- **La lunghezza della registrazione** (`scripts/v4_lunghezza.py`; 4 lettori, 5 frasi): con 6, 10, 12 e 15 s parole sbagliate
  0–3,1%; con 20 s 6–17%; con 25 s 30–33%, nel codice ufficiale come nei grafi: con un riferimento lungo il modello finisce le
  frasi prima del tempo. La somiglianza non cresce in modo stabile oltre i 10 s. **Il programma usa i primi 12 s.**
- **Nel programma** (`crates/voice/src/pocket/`, con `kalliope-cli voice` e `say --voice`, e il motore dell'app): vedi sotto.

### Il programma, misurato da capo a fondo

`scripts/v4_e2e.py` e `scripts/v4_memoria.py` sul programma vero (`kalliope-cli` compilato in release, ONNX Runtime 1.32.0 di
NuGet, 2 thread), con la macchina caricata da altri lavori (carico 6–10).

| | 6 strati |
|---|---|
| Preparare la voce | 1,0 s per 7,4 s di registrazione; 1,2 s per 24,6 s (ne usa 12); memoria massima 352–360 MB (V-1: 0,88 GB) |
| File della voce | 4,1–7,4 MB (stato nel formato di Kyutai), letto in circa 7 ms |
| Prima parola persa, frasi | giovanni 0/10, F1 0/10 |
| Prima parola persa o storpiata, frasi brevi | giovanni 2/32 («Certo» → «C'è», «Mi sentite» → «Vi sentite»), F1 0/32 |
| Parole sbagliate (Whisper) | frasi giovanni 1,6%, F1 0,0%; brevi 12,5% e 7,1% (in parte «A dopo» → «Adopo» di Whisper) |
| Somiglianza ECAPA, frasi | giovanni 0,525 (contro la registrazione), F1 0,563 (contro i suoi brani tenuti da parte) |
| Primo suono | mediano 42–49 ms, peggiore 146–147 ms (dal testo già normalizzato) |
| Vuoti nello streaming | nessuno in 42 testi, decodificando 2 fotogrammi per volta (con 4: 9 testi su 21 con un vuoto) |
| CPU | 0,42–0,43 CPU-s per secondo di voce (Klein 0,07; maggio in V-1 0,78) |
| Memoria parlando | 294 MB (Klein 187 MB nello stesso comando) |

Parità: la voce preparata da Rust dalle registrazioni di marius (24 kHz) e di alba (48 kHz, quindi anche il ricampionamento)
coincide con lo stato pronto di Kyutai (differenza 1,3·10⁻⁵ e 2,5·10⁻⁵ con il flow LM fp32); l'audio di Rust coincide con quello
del ciclo Python sugli stessi grafi a temperatura 0 (stessi 113 280 campioni, differenza 2·10⁻⁵, quella del WAV a 16 bit). Il
tokenizer e la preparazione del testo di Rust danno gli stessi token, lo stesso testo decodificato e gli stessi pezzi del codice
ufficiale su 1873 righe e 51 323 token (`scripts/v4_tokenizer.py`).

**24 strati** (stessa esportazione, verificata come i 6: latenti 6·10⁻⁵; flow LM a 8 bit 397 MB, 29 ms per passo contro 45 in
fp32; `esiti/v4/e2e_24l.json`, carico 3–6): giovanni frasi 0/10 e WER 0,0%, F1 1/10 e 1,6%; brevi 0/32 e 7,1% per entrambi;
somiglianza ECAPA più alta (giovanni 0,560 contro 0,525, F1 0,612 contro 0,563). Ma costa il doppio di CPU (0,81–0,99 CPU-s per
secondo di voce a 2 thread), il primo suono arriva in 95–139 ms (peggiore 300–508 ms), la memoria parlando è di 740–790 MB, il file
della voce di 16–28 MB, e tiene il passo solo decodificando un fotogramma per volta: con 2, F1 ha avuto 3 testi su 21 con un vuoto
(36 ms in tutto), con 4 tutti. **Il programma usa i 6 strati**; i 24 restano una cartella del modello alternativa
(`modelli/pocket-kalliope/italian_24l`), che il programma legge uguale, per una macchina più veloce o meno carica.

### Versioni (controllate il 19/11/2026 sulle fonti ufficiali)

| Dipendenza | Usata | Ultima | Fonte |
|---|---|---|---|
| Pesi italiani con clonazione | `kyutai/pocket-tts` `languages/italian` e `italian_24l` `@3e82814a` (1/10/2026, PR #344), quelli della configurazione ufficiale | stessi; testa del repository `db04f0e6` del 21/10/2026 | `pocket_tts/config/italian.yaml`, API Hugging Face |
| Tokenizer | `kyutai/pocket-tts-without-voice-cloning` `languages/italian/tokenizer.json@4e1e0a3e` | stesso | configurazione ufficiale |
| Voci pronte e registrazioni per le prove | `kyutai/pocket-tts-without-voice-cloning@a7056f50`; `kyutai/tts-voices@323332d3`; `kyutai/pocket-tts` `common_voice_it_36520747-enhanced-v2.mp3@64ab7d24` | stesse | API Hugging Face |
| Codice di Kyutai | `kyutai-labs/pocket-tts` main `a4a6054d` (18/11/2026) | stesso; PyPI `pocket-tts` 4.0.1 (21/10/2026) | GitHub, PyPI |
| ONNX Runtime | 1.32.0 (programma: NuGet `Microsoft.ML.OnnxRuntime`; prove Python: PyPI) | 1.32.0 (13/11/2026) | NuGet, PyPI; le pagine di `github.com/microsoft/onnxruntime` rispondevano 404 |
| onnx / onnxscript / torch | 1.23.2 / 0.7.2 / 2.15.0 | stesse | PyPI |
| tokenizers / safetensors / huggingface_hub | 0.23.3 / 0.8.0 / 2.4.0 | stesse | PyPI |

### Provenienza e licenza di ogni parte (per `THIRD_PARTY_NOTICES.md`)

- Pesi del modello italiano, con la clonazione: Kyutai, `kyutai/pocket-tts` `@3e82814a`, **CC BY 4.0** (scheda del modello).
  Kalliope li converte in ONNX e quantizza il flow LM: è materiale adattato, che la licenza chiede di attribuire indicando le
  modifiche («Pocket TTS by Kyutai, CC BY 4.0; converted to ONNX and quantized by Kalliope»).
- Tokenizer: Kyutai, `kyutai/pocket-tts-without-voice-cloning`, CC BY 4.0.
- Codice di Kyutai (`kyutai-labs/pocket-tts`): MIT. Non è compilato nel programma: lo usa l'esportazione, e il codice Rust di
  Kalliope ne segue il ciclo di generazione e la preparazione del testo.
- ONNX Runtime: Microsoft, MIT, con le sue `ThirdPartyNotices.txt`.
- Registrazioni usate per le prove (mai fuori da questa macchina): giovanni (Common Voice, CC0, copia ripulita da Kyutai), anna
  (VCTK, CC BY 4.0), marius (Unmute voice donation, CC0), alba (Alba MacKenna, CC BY 4.0), i quattro lettori LibriVox di V-m
  (pubblico dominio, solo misure interne).

### Le condizioni d'accesso e chi distribuisce i file del modello (una lettura, non un parere legale)

- Il repository con la clonazione è «gated» con approvazione automatica: per scaricare bisogna avere un account, accettare il
  modulo (azienda o università se c'è, uso «Work», «Studies» o «Fun») e le condizioni. Il testo delle condizioni, riletto oggi
  dall'API: «Prohibited uses include, without limitation, voice impersonation or cloning without explicit and lawful consent;
  misinformation, disinformation, or deception (…); and the generation of unlawful, harmful, libelous, abusive, harassing,
  discriminatory, hateful, or privacy-invasive content. We disclaim all liability for any non-compliant use.»
- La licenza dei pesi resta CC BY 4.0, che permette a chiunque di riprodurre e condividere il materiale e quello adattato, con
  l'attribuzione, e vieta di aggiungere condizioni o misure tecniche che restringano gli stessi diritti a chi lo riceve («No
  downstream restrictions»; testo letto il 17/11). Le condizioni del modulo non parlano di ridistribuzione.
- Quindi, a mia lettura: chi ha accettato le condizioni può distribuire i file convertiti con l'attribuzione e l'indicazione delle
  modifiche, e chi li riceve da Kalliope non avrebbe bisogno di un account. Il divieto di imitare una voce senza consenso resta
  una condizione d'uso di Kyutai che conviene riportare a chi usa Kalliope: la documentazione del programma dice che la voce da
  imitare è la propria, o quella di chi ha dato il consenso esplicito. Dove ospitare i file lo decide il proprietario; un parere
  legale non c'è.

### File di V-4

- Script: `v4_comune.py`, `v4_compat.py`, `v4_riferimento.py`, `v4_grafi.py`, `v4_esporta.py`, `v4_quant.py`, `v4_onnx.py`,
  `v4_controllo.py`, `v4_lunghezza.py`, `v4_tokenizer.py`, `v4_e2e.py`, `v4_memoria.py`.
- **`v4_esporta.py` e `v4_grafi.py` sono andati in `tools/pocket_export/`** (`export.py`, `graphs.py`, 19/11/2026, P-2): li usa
  `tools/release_assets.py` per preparare i file che vanno nel programma. `v4_quant.py` e `v4_onnx.py` importavano funzioni da
  `v4_esporta`: per rifarli, prenderle da `tools/pocket_export/export.py` (`session`, `step`, `compare`).
- Esiti: `esiti/v4/` (compatibilità, riferimento, esportazione, quantizzazione, controllo, lunghezza, tokenizer, e2e, memoria,
  `dipendenze_cargo.txt`).
- Dati (fuori dal repository): `modelli/pocket-tts-gated/` (scaricato con la chiave), `modelli/pocket-onnx-v4/` (esportazione),
  `modelli/pocket-kalliope/italian` e `italian_24l` (le cartelle del modello come le legge il programma), `audio/v4/`.

## Il trucco: la versione attuale con l'encoder di maggio (V-2 e V-3, parte A, 17/11/2026)

Il proprietario aveva scelto «il trucco» e poi dato il via a metterlo nel programma (incarichi
`design/lavoro/incarichi/V-2-pocket-versione-attuale.md` e `V-3-pocket-nel-programma.md`). L'idea era unire due cose:
- i pesi aperti attuali (`kyutai/pocket-tts-without-voice-cloning`, italiano `@1e08e6a2`, uguale alla testa del repository), che
  hanno l'encoder della voce azzerato;
- l'encoder della voce dell'esportazione di maggio (`xennonf4/pocket-tts-onnx@e3f58ae5`).

**Il trucco non regge, e mi sono fermato prima della parte B.** `crates/` non è stato toccato.

**Compatibilità dei pesi** (`scripts/v2_compat.py`, `esiti/v2/compatibilita.json`). Fra la versione di maggio aperta
(`@e7205b6e`) e quella attuale il codec Mimi è stato riaddestrato da capo, non ritoccato:

| Parte del codec | Tensori uguali | Coseno fra maggio e oggi |
|---|---|---|
| decoder | 0 su 22 | -0,001 sul tensore più grande (1,8 milioni di numeri), 0,20 in media |
| decoder transformer | 0 su 20 | 0,0 sui pesi lineari, 0,38 in media |
| downsample (l'ultimo strato dell'encoder: fa i 32 numeri letti dalla proiezione del parlante) | 0 su 1 | 0,006 |
| quantizer | 0 su 1 | 0,099 |
| upsample | 0 su 1 | 0,358 |
| proiezione del parlante (`flow_lm.speaker_proj_weight`, 1024 × 32) | 0 su 1 | 0,138 |

Altri dettagli:
- L'encoder (SEANet e transformer) è azzerato in entrambi i file aperti, quindi non si confronta direttamente.
- Downsample e proiezione dell'esportazione di maggio sono identici a quelli di maggio: l'esportazione è fedele alla sua versione.
- Il decoder dell'esportazione è identico a quello di maggio.
- Fra 6 e 24 strati attuali il codec è identico.

L'encoder di maggio dà quindi numeri in un altro spazio, che la versione attuale non sa leggere.

**Prova con tre voci pubblicate da Kyutai** (`scripts/v2_unione.py`, `esiti/v2/unione.json`). Ho preso tre registrazioni aperte
di `kyutai/tts-voices@323332d3`: anna (VCTK, CC-BY-4.0), marius (donazioni, CC0) e alba. Per ciascuna, la catena del trucco è
questa:
- la registrazione finisce su una pausa, come nel codice ufficiale;
- passa per l'encoder di maggio;
- si recuperano esattamente i 32 numeri con la pseudo-inversa della proiezione di maggio (scarto 2·10⁻⁷);
- si proiettano con la proiezione attuale e si mette davanti il `bos_before_voice` attuale;
- la versione attuale nel codice ufficiale in PyTorch si condiziona su questo.

Il confronto è con lo stato che Kyutai stesso ha calcolato per la stessa voce dalla stessa registrazione con l'encoder attuale
(`@a7056f50`). La lunghezza coincide (155, 127 e 127 posizioni): la catena è giusta, cambia solo l'encoder.

| Voce | Somiglianza ECAPA: trucco contro voce pronta | voce pronta con un altro seme | un'altra voce pronta | Che cosa dice il trucco (Whisper) |
|---|---|---|---|---|
| anna | 0,01 | 0,75 | 0,23 | «Eh...», niente, «Sottotitoli e revisione a cura di…» |
| marius | 0,23 | 0,68 | 0,23 | «Eh...», niente, «Ok» |
| alba | 0,10 | 0,64 | 0,30 | «Ma... Ma... Ma...», niente, «Sì.» |

Medie su quattro frasi: due normali e due brevi («Grazie.», «Va bene.»).
- La voce del trucco non assomiglia alla voce pronta più di quanto le assomigli un'altra persona.
- Il trucco non dice le parole: le frasi arrivano alla lunghezza massima (6 s per frasi di 2–3 s) senza mai finire.
- La cache di attenzione dopo il riferimento somiglia a quella di Kyutai meno di quanto le somigli un'altra voce: coseno per strato
  0,16–0,78 contro 0,52–0,91.

**Che cosa servirebbe** (decide il proprietario):
- l'encoder della voce attuale, che è solo nel repository gated `kyutai/pocket-tts`: account e accettazione delle condizioni
  (sezione V-1, «La versione attuale e l'account");
- oppure la versione di maggio così com'è, con le correzioni di V-1: prima parola persa in 12–15 frasi su 40 e frasi brevi spesso
  perse;
- oppure un altro modello che cloni senza account.

## Rendere affidabile Pocket TTS (V-1, 17/11/2026)

Il proprietario ha scelto la strada 1 dopo l'ascolto e ha dato il via a renderla affidabile, con prove e senza toccare il
programma (incarico `design/lavoro/incarichi/V-1-pocket-affidabile.md`). Programmi: `scripts/pocket.py` (il motore con le
correzioni attivabili una per una), `scripts/onnx_cache.py`, `scripts/v1_genera.py`, `scripts/v1_valuta.py`,
`scripts/v1_ufficiale.py`, `scripts/v1_memoria.py`, `scripts/v1_passo.py`; esiti in `esiti/v1/`.

### In breve

- **La prima parola persa viene dalla versione del modello, non dal nostro codice e non dall'esportazione.** L'esportazione
  ONNX che usiamo (`xennonf4/pocket-tts-onnx`, rev `e3f58ae5`, 24/8/2026) è fatta dalla versione italiana di Pocket TTS di
  maggio 2026. Ha lo stesso tokenizer (sha256 `6583b974…`, quello delle revisioni ufficiali fino al 17/9/2026). Dà anche gli
  stessi latenti del codice ufficiale su quella versione (fp32, temperatura 0, voce giovanni: coseno medio 0,996 su 40 passi).
  Quella versione, anche nel codice di Kyutai e con una voce di Kyutai, comincia a parlare senza silenzio iniziale e perde o
  storpia la prima parola. Kyutai l'ha rifatta due volte:
  - PR #326 del 24/9/2026: nuovo tokenizer; «Single words … are now correct 65-87% of the time, against 28-47% for the previous
    models»;
  - PR #344 dell'1/10/2026: «the previous students ended early when given prompts longer than about 12 s»; per l'italiano a 6
    strati con riferimenti lunghi il WER passa da 15,21% a 6,69%.

  Con la versione attuale, nel codice ufficiale, la stessa prova dà **0 prime parole perse su 10 frasi; nelle 32 frasi brevi nessuna parola persa e 2 cambiate** («Avevo subito», «Vi sentite»).
  La versione di maggio nel codice ufficiale ne perde o storpia 3 su 10 e 13 su 32; la nostra esportazione 4 su 10 e 14 su 32.
- **Con la versione di maggio il traguardo non si raggiunge.** Il wrapper dell'esportazione non applicava alcune impostazioni
  del codice ufficiale: temperatura 0,3 invece di 0,7, riferimento che finisce su 80 ms di pausa, niente fine nei primi 6 passi,
  dissolvenza di 5 ms. Con queste:
  - la prima parola persa scende da 22 a 15 frasi su 40 e le parole sbagliate dal 14,6% all'11,3%;
  - con un riferimento di 10 s scende a 12 su 40, con l'8,0% di parole sbagliate;
  - le frasi brevi restano perse in più di un caso su tre.

  Provati e scartati, perché peggiorano: gli spazi davanti alle frasi brevi (opzione ufficiale
  `pad_with_spaces_for_short_inputs`) e il silenzio forzato all'inizio.
- **La versione attuale con la clonazione si scarica solo dal repository «gated»** (dettagli sotto, «La versione attuale e
  l'account»). Senza account si ha la versione attuale con le 27 voci già pronte di Kyutai, **senza clonazione da una
  registrazione**: nei pesi aperti l'encoder della voce è azzerato. Nessuna esportazione ONNX di terzi della versione attuale con
  la clonazione è stata trovata. Non ho creato account.
- **Il peso**: il 63% del tempo del modello andava a copiare a ogni passo una cache di attenzione fissa a 1000 posizioni
  (profilo di ONNX Runtime). `scripts/onnx_cache.py` dichiara libera quella dimensione nell'esportazione, senza cambiare nessun
  peso: in fp32 i latenti sono identici bit per bit. Il nostro ciclo poi dà a ogni pezzo solo le posizioni che gli servono. A 6
  strati int8 e 2 thread, nella stessa finestra, il costo passa da **1,05 a 0,78 secondi di CPU per secondo di parlato**, e a
  0,58 con il riferimento di 10 s. Vale anche per la versione attuale, che ha la stessa architettura (dedotto, non misurato).
- **La memoria**: codificare 25 s di riferimento in un colpo arrivava a 3,9 GB, perché l'encoder esportato fa l'attenzione su
  tutto il riferimento insieme. A pezzi di 5 s con 2 s di sovrapposizione scende a **0,88 GB**, con gli stessi latenti (coseno
  minimo 0,9999). Parlare costa **537 MB** a 6 strati (prima 844 MB) e 1,3 GB a 24 strati (prima 2,2 GB), processo Python
  compreso. La voce si salva in 15 MB (stato pronto, ricarica in 50–160 ms) oppure in 0,6 MB (latenti fp16, ricarica in
  0,5–1,1 s).
- **Le combinazioni di velocità** sono state misurate una alla volta, ma con la macchina carica dagli altri lavori (load
  average 19–34 su 12 thread). I confronti nella stessa finestra reggono; i tempi d'orologio assoluti non valgono per un
  computer scarico.
  - A 6 strati int8, 2 thread, con primo pezzo e pezzi di 4 fotogrammi (320 ms), non c'è nessun vuoto in 10 frasi su 10, con il
    primo suono a 243 ms (massimo 343).
  - A 24 strati non tiene il passo né a 2 né a 4 thread: 2,0 e 1,9 secondi d'orologio per secondo di parlato.
  - Il thread in più rende poco: 0,71 secondi di CPU per secondo a 1 thread, 0,78 a 2, 0,85 a 4.
- **La pronuncia**, prima parola esclusa: 9,1% di parole sbagliate a 6 strati con 25 s di riferimento, 5,9% con 10 s, 3,0% a 24
  strati (Klein 1,7%). Restano soprattutto:
  - la fine della prima frase che sparisce: «ma vi seguo benissimo» non viene detto, è il «fermarsi presto» dei vecchi modelli;
  - la sigla «iva» letta «eva» o «i va»;
  - «Paola» detto «Paula»;
  - qualche vocale cambiata («consenia»).

  I numeri, scritti in lettere dal normalizzatore di Kalliope, passano.

### La versione attuale e l'account (fonti lette il 17/11/2026)

- **Che cosa è «gated»**: il repository Hugging Face `kyutai/pocket-tts`, con approvazione automatica (`gated: auto`, API di
  Hugging Face; ultima revisione `db04f0e6` del 21/10/2026). Contiene i pesi con la clonazione. La configurazione ufficiale
  italiana (`pocket_tts/config/italian.yaml`, codice `kyutai-labs/pocket-tts` rev `8ef5cbc7`) punta a
  `languages/italian/model.safetensors@3e82814a` (1/10/2026, PR #344), e lo stesso per `italian_24l`.
- **Licenza dei pesi**: CC-BY-4.0 (metadati della scheda di `kyutai/pocket-tts`). Il codice è MIT (`LICENSE` del repository
  GitHub). Le voci pronte hanno ciascuna la sua licenza, elencata da Kyutai in `kyutai/tts-voices`: quella pagina non l'ho letta.
- **Condizioni da accettare** (campo `extra_gated_prompt` della scheda, letto dall'API; la scheda stessa risponde 401 senza
  account): «Prohibited uses include, without limitation, voice impersonation or cloning without explicit and lawful consent;
  misinformation, disinformation, or deception (…); and the generation of unlawful, harmful, libelous, abusive, harassing,
  discriminatory, hateful, or privacy-invasive content. We disclaim all liability for any non-compliant use.» Il modulo chiede
  anche «Company or university if applicable» e «I want to use this model for» (Work, Studies o Fun). Poi bisogna accedere con
  `hf auth login`: lo dicono il README e il messaggio d'errore `VOICE_CLONING_UNSUPPORTED` del codice ufficiale.
- **Ridistribuzione**: il testo legale CC BY 4.0 (creativecommons.org, sezione 2) permette a chiunque di «reproduce and Share
  the Licensed Material» e il materiale adattato, con l'attribuzione. Vieta anche di aggiungere condizioni o misure tecniche che
  restringano questi diritti a chi lo riceve («No downstream restrictions»). Le condizioni del modulo di Kyutai non parlano di
  ridistribuzione. Le copie di terzi esistono già: `xennonf4`, `KevinAHM`, `jkatzwinkel/pocket-tts-mirror`, tutte della versione
  di maggio. Che una copia della versione attuale messa a disposizione da noi permetta a chi usa Kalliope di non avere un
  account è una lettura della licenza, non un parere legale.
- **Che cosa c'è senza account**: il repository `kyutai/pocket-tts-without-voice-cloning` (non gated, CC-BY-4.0, rev `a7056f50`;
  italiano a `1e08e6a2`, «the same, with voice cloning removed», PR #344). Contiene il modello che parla (flow LM e decoder Mimi),
  il tokenizer e 27 voci pronte per l'italiano. L'encoder Mimi è azzerato: valore assoluto massimo 0, verificato qui. Quindi le
  voci pronte funzionano, ma non si clona da una registrazione. Il codice ufficiale lo dice: «Without voice cloning, you can use
  our catalog of voices». La proiezione del parlante invece c'è, con valori veri. Combinarla con l'encoder dell'esportazione di
  maggio potrebbe forse ridare la clonazione con la versione attuale, ma non l'ho provato: aggirerebbe il controllo d'accesso di
  Kyutai (è una decisione del proprietario) e non si può verificare che l'encoder sia lo stesso fra le due versioni.
- **Esportazioni di terzi della versione attuale**:
  - `MacEpic/pocket-tts-it-coreml` (8/11/2026) è fatta dai pesi senza clonazione, solo per Apple Core ML, con voci pronte;
  - `Arm/pocket-tts-it-24l-mix-precision` (22/9, TFLite), `jiangzhuo9357/pocket-tts-it-onnx` (16/7), `KevinAHM`, `xennonf4`,
    `rxdtech` e `Phoonnx/pockettts-it-kyutai-unicode` (16/11, riconfezione di KevinAHM) sono tutte della versione di maggio o
    precedenti: tokenizer `6583b974` o data anteriore al 24/9;
  - `storyteller-platform/pocket-tts-italian` (GGUF) e `TheStageAI/pocket-tts-100m-it` non dicono da quale revisione vengono.
- **Un'esportazione fatta da noi** dai pesi aperti attuali si può fare senza account, ma dà la versione attuale solo con le voci
  pronte, senza clonazione. Non l'ho fatta in questa chiusura: la versione attuale con la voce di Kyutai l'ho fatta parlare con il
  codice ufficiale in PyTorch, ed è quella nella pagina d'ascolto.

### Le misure

#### La prima parola: le impostazioni una per una (versione di maggio, 4 persone)

| Configurazione | prima parola persa: frasi | WER frasi | prima parola persa: frasi brevi | durata media frasi brevi | ECAPA | WeSpeaker | silenzio iniziale |
|---|---|---|---|---|---|---|---|
| V-m, 6 strati (com'era, 1 seme) | 9/20 | 11,3% | — | — | 0,56 | 0,59 | 0,02 s |
| V-m, 24 strati (com'era, 1 seme) | 10/20 | 8,2% | — | — | 0,58 | 0,59 | 0,02 s |
| 6 strati, impostazioni dell'esportazione (temp. 0,7) | 22/40 | 14,6% | 54/128 | 0,60 s | 0,57 | 0,57 | 0,07 s |
| + fine del riferimento su 80 ms di pausa | 22/40 | 14,5% | 65/128 ¹ | 0,61 s | 0,57 | 0,57 | 0,07 s |
| temperatura 0,3 al posto di 0,7 | 17/40 | 13,5% | 66/128 ¹ | 0,61 s | 0,59 | 0,59 | 0,16 s |
| 6 strati, tutte le impostazioni ufficiali | 15/40 | 11,3% | 47/128 | 0,98 s | 0,57 | 0,57 | 0,16 s |
| … con riferimento di 10 s | 12/40 | 8,0% | 52/128 ¹ | 1,00 s | 0,53 | 0,53 | 0,14 s |
| … con riferimento di 5 s | 13/40 | 7,6% | 42/128 | 0,98 s | 0,47 | 0,46 | 0,03 s |
| 24 strati, impostazioni dell'esportazione | 22/40 | 9,0% | 62/128 ¹ | 0,83 s | 0,58 | 0,60 | 0,26 s |
| 24 strati, impostazioni ufficiali | 21/40 | 7,4% | 48/128 ¹ | 1,12 s | 0,61 | 0,62 | 0,15 s |
| … con riferimento di 10 s | 17/40 | 9,2% | 43/128 | 1,06 s | 0,58 | 0,58 | 0,08 s |
| Klein, voce di oggi (Giulia e Marco) | 0/10 | 1,6% | 0/32 | 1,32 s | 0,17 | 0,24 | 0,25 s |

Frasi: le cinque di prova, 4 persone × 2 semi (40); frasi brevi: 16 × 4 × 2 (128), trascritte con 0,5 s di silenzio attorno (¹ senza: valutate prima di questa correzione della prova, Whisper vi inventa più spesso). Silenzio iniziale: tempo al primo frame entro 30 dB dal più forte.

#### La stessa prova su una voce di Kyutai (giovanni), senza clonazione

| Implementazione | prima parola persa: frasi | WER frasi | prima parola persa: frasi brevi | durata media frasi brevi | silenzio iniziale |
|---|---|---|---|---|---|
| esportazione ONNX (versione di maggio), il nostro ciclo | 4/10 | 13,3% | 14/32 | 1,08 s | 0,08 s |
| codice ufficiale, versione di maggio | 3/10 | 5,5% | 13/32 | 0,94 s | 0,05 s |
| codice ufficiale, versione attuale (1/10/2026) | 0/10 | 1,6% | 2/32 | 1,44 s | 0,34 s |

Parità (temperatura 0, 40 passi, stessa voce, versione di maggio): fp32 coseno medio 0,996 (minimo 0,981); int8 coseno medio 0,834 (minimo 0,394).

#### Il peso mentre parla (F1 e M1, cinque frasi ciascuno, una prova alla volta, processi separati)

| Combinazione | thread | primo pezzo / pezzi (×80 ms) | CPU s per s | orologio s per s | primo suono (mediana / max) | frasi con un vuoto | attesa per non avere vuoti (max) | memoria massima | carico |
|---|---|---|---|---|---|---|---|---|---|
| 6-int8-t2 | 2 | 2 / 6 | 0,780 | 0,685 | 197 / 266 ms | 10/10 | 523 ms | 537 MB | 22 |
| 6-int8-t2-p1 | 2 | 1 / 3 | 0,765 | 0,639 | 135 / 184 ms | 10/10 | 285 ms | 520 MB | 34 |
| 6-int8-t2-p4 | 2 | 4 / 4 | 0,786 | 0,655 | 243 / 343 ms | 0/10 | 343 ms | 574 MB | 23 |
| 6-int8-t2-p6 | 2 | 6 / 12 | 0,835 | 0,754 | 442 / 557 ms | 10/10 | 819 ms | 499 MB | 25 |
| 6-int8-t4 | 4 | 2 / 6 | 0,848 | 0,672 | 189 / 287 ms | 10/10 | 654 ms | 488 MB | 32 |
| 6-int8-t1 | 1 | 2 / 6 | 0,714 | 0,741 | 215 / 260 ms | 10/10 | 463 ms | 552 MB | 31 |
| 6-main32-t2 | 2 | 2 / 6 | 1,022 | 0,831 | 234 / 349 ms | 10/10 | 676 ms | 703 MB | 28 |
| 6-fp32-t2 | 2 | 2 / 6 | 1,090 | 0,865 | 238 / 500 ms | 10/10 | 820 ms | 798 MB | 23 |
| 6-int8-t2-nokv | 2 | 2 / 6 | 1,049 | 0,954 | 248 / 330 ms | 10/10 | 1187 ms | 565 MB | 22 |
| 6-int8-t2-r10 | 2 | 2 / 6 | 0,575 | 0,468 | 128 / 235 ms | 10/10 | 319 ms | 516 MB | 20 |
| 24-int8-t2 | 2 | 2 / 6 | 2,257 | 2,030 | 572 / 971 ms | 10/10 | 14442 ms | 1303 MB | 19 |
| 24-int8-t4 | 4 | 2 / 6 | 2,461 | 1,869 | 562 / 858 ms | 10/10 | 9467 ms | 1326 MB | 24 |

- 6-int8-t2: prima parola persa 4/10, WER 11,7%, ECAPA 0,64, WeSpeaker 0,64
- 6-main32-t2: prima parola persa 4/10, WER 10,2%, ECAPA 0,63, WeSpeaker 0,63
- 6-fp32-t2: prima parola persa 5/10, WER 8,6%, ECAPA 0,65, WeSpeaker 0,64
- 6-int8-t2-r10: prima parola persa 5/10, WER 10,2%, ECAPA 0,60, WeSpeaker 0,55
- 24-int8-t2: prima parola persa 5/10, WER 7,0%, ECAPA 0,66, WeSpeaker 0,66

#### La memoria per preparare la voce (F1, 6 strati, processi separati)

| Riferimento | codifica | encoder | arena ONNX Runtime | memoria massima | CPU s | voce salvata |
|---|---|---|---|---|---|---|
| 10 s | intera | fp32 | no | 909 MB | 3,4 | stato 5,7 MB (ricarica 35 ms) · embedding 234 kB (ricarica 0,50 s) |
| 15 s | intera | fp32 | no | 1615 MB | 14,3 | stato 9,0 MB (ricarica 30 ms) · embedding 375 kB (ricarica 0,58 s) |
| 25 s | a pezzi di 5 s (coseno min 0,9999) | fp32 | no | 883 MB | 21,4 | stato 15,2 MB (ricarica 163 ms) · embedding 631 kB (ricarica 1,15 s) |
| 25 s | a pezzi di 10 s (coseno min 1,0000) | fp32 | no | 1517 MB | 22,2 |  |
| 25 s | a pezzi di 5 s (coseno min 0,9985) | int8 | no | 898 MB | 16,2 |  |
| 25 s | a pezzi di 5 s (coseno min 0,9999) | fp32 | sì | 1356 MB | 10,4 |  |
| 25 s | intera | fp32 | no | 3891 MB | 29,6 | stato 15,2 MB (ricarica 49 ms) · embedding 631 kB (ricarica 0,51 s) |
| 25 s | intera (coseno min 0,9983) | int8 | no | 3538 MB | 26,4 |  |
| 25 s | intera | fp32 | sì | 4279 MB | 20,3 |  |

### Limiti e ciò che non ho misurato

- La clonazione con la versione italiana attuale: serve il repository «gated» (sopra). Tutto ciò che riguarda le nostre quattro
  persone è sulla versione di maggio; la versione attuale l'ho provata solo con una voce pronta di Kyutai (giovanni), nel codice
  ufficiale in PyTorch, non in ONNX e non in streaming.
- La velocità della versione attuale non l'ho misurata: ha la stessa architettura, quindi ci si aspetta lo stesso costo, ma è
  una deduzione.
- Le combinazioni di velocità sono state misurate con un carico medio da 19 a 34 su 12 thread (altri lavori sulla macchina):
  i confronti nella stessa finestra reggono, i tempi d'orologio assoluti no. Il «vuoto» è calcolato, non ascoltato:
  l'audio di un pezzo pronto dopo il suo turno, con la riproduzione che parte al primo pezzo. Il decodificatore gira nello
  stesso thread del generatore (il codice ufficiale lo mette in un secondo thread).
- Whisper sulle frasi di una o due parole sbaglia da solo (scrive «Sottotitoli a cura di…» sul quasi silenzio, «Adopo» per «A
  dopo»). Per questo le frasi brevi sono trascritte con 0,5 s di silenzio attorno; alcune righe valutate prima di questa
  correzione sono segnate. Le durate e il silenzio iniziale non dipendono da Whisper.
- Due semi per configurazione: 40 frasi e 128 frasi brevi per riga; differenze di 2–3 casi sono rumore.
- Il riferimento rovinato (F1d, M2d) non è stato rifatto in V-1.
- Non ascoltato: qui non c'è uscita audio. La pagina d'ascolto ha la sezione «prima e dopo».

### File di V-1

`scripts/pocket.py` (il motore: correzioni del codice ufficiale attivabili, cache libera, codifica a pezzi, streaming con il
controllo dei vuoti, voce salvata), `scripts/onnx_cache.py` (la cache libera nell'esportazione), `scripts/v1_genera.py`,
`scripts/v1_valuta.py`, `scripts/v1_ufficiale.py` (parità e prova sulla voce di Kyutai, con i pesi aperti), `scripts/v1_memoria.py`,
`scripts/v1_passo.py`, `scripts/v1_pronuncia.py`, `scripts/v1_resoconto.py`; esiti in `esiti/v1/` (`valuta_*.json`,
`genera_*.json`, `passo.jsonl`, `memoria.jsonl`, `memoria_coseni_italian_F1.json`, `parita.json`, `pronuncia.json`,
`brevi.json`, `scelta.json`). I file ONNX con la cache libera sono in `voce-propria/modelli/pocket-onnx-kv/` (fuori dal repository).

### Versioni (controllate il 17/11/2026 sulle fonti ufficiali)

| Dipendenza | Usata | Ultima ufficiale | Data dell'ultima | Fonte |
|---|---|---|---|---|
| Pocket TTS, pesi italiani con clonazione | versione di maggio 2026, dall'esportazione di terzi `xennonf4/pocket-tts-onnx` rev `e3f58ae5` (24/8/2026) | `kyutai/pocket-tts` `languages/italian@3e82814a` (gated) | 1/10/2026 (PR #344) | `pocket_tts/config/italian.yaml`, API Hugging Face |
| Pocket TTS, pesi italiani senza clonazione | `kyutai/pocket-tts-without-voice-cloning@1e08e6a2` e la voce giovanni `@a7056f50` (solo per il confronto) | gli stessi | 1/10 e 21/10/2026 | configurazione ufficiale, API Hugging Face |
| Pocket TTS, codice | `kyutai-labs/pocket-tts` main `8ef5cbc7` (per leggere e per il confronto); pacchetto PyPI non installato | `8ef5cbc7`; PyPI `pocket-tts` 4.0.1 | 17/11/2026; 21/10/2026 | GitHub, PyPI |
| onnxruntime | 1.31.1 | **1.32.0** | 13/11/2026 | PyPI |
| faster-whisper | 1.2.1 | 1.2.1 | 31/10/2025 | PyPI |
| ctranslate2 | 4.9.0 | 4.9.0 | 10/11/2026 | PyPI |
| Modello Whisper | `Systran/faster-whisper-small` rev `536b0662` (scelto in V-m per restare sulla scala del 12/11) | stessa revisione; OpenAI ha modelli più grandi (large-v3 e large-v3-turbo) che qui non uso | 23/11/2023 | API Hugging Face |
| Whisper base (controllo della ricerca, V-m) | `Systran/faster-whisper-base` rev `ebe41f70` | stessa | 23/11/2023 | API Hugging Face |
| torch / torchaudio | 2.15.0+cpu / 2.11.1+cpu | 2.15.0 / 2.11.1 | 28/10/2026 | PyPI |
| SpeechBrain | 1.1.2 | 1.1.2 | 14/10/2026 | PyPI |
| ECAPA (`speechbrain/spkrec-ecapa-voxceleb`) | rev `0f99f2d0` | stessa | 18/2/2025 | API Hugging Face |
| WeSpeaker ResNet34 | rev `ff1ac5bc` | stessa | 6/5/2024 | API Hugging Face |
| Resemblyzer | 0.1.4 | 0.1.4 | 12/10/2023 | PyPI |
| librosa / numpy / scipy / soundfile / onnx | 1.0.1 / 2.5.5 / 1.18.1 / 0.14.0 / 1.23.2 | le stesse | 12/11, 15/11, 21/8, 6/6, 6/10/2026 | PyPI |
| tokenizers / sentencepiece | 0.23.3 / 0.2.3 | le stesse | 9/10 e 5/11/2026 | PyPI |
| MeanVC2 ONNX (V-m) | `kiarina/MeanVC2-ONNX` rev `2db97430` | stessa | 20/10/2026 | API Hugging Face |
| OpenVoice V2 (V-m) | `myshell-ai/OpenVoiceV2` rev `f36e7edf` | stessa | 24/12/2024 | API Hugging Face |
| Klein-TTS X1.5 Pro | rev `25e0e73b` | stessa | 3/11/2026 | API Hugging Face |

onnxruntime 1.32.0 è uscito il 13/11/2026; le misure sono con 1.31.1, la versione del banco del 12/11 e del programma. Controllo con 1.32.0 sul guadagno della cache libera (6 strati int8, 2 thread, F1, carico 30, una corsa per versione): 1.31.1 1,29 → 0,71 CPU-s per s, 1.32.0 1,14 → 0,83. Il guadagno resta; la differenza fra le due versioni non si distingue dal rumore con questo carico, quindi non ho rifatto le misure.


## V-m · I fatti in breve

Scala della somiglianza (ECAPA, contro i brani veri tenuti da parte): un brano vero della stessa persona fa 0,80–0,85,
un'altra persona dello stesso sesso 0,12–0,22, la voce di oggi (Giulia o Marco) 0,16–0,21. Medie sulle quattro persone
F1, F2, M1, M2; parole sbagliate su 256 parole (Klein oggi: 1,6%).

| Strada | Somiglianza ECAPA | WeSpeaker (terzo giudice) | Parole sbagliate | Riferimento rovinato (F1, M2): ECAPA · parole | CPU s per s di parlato (2 thread) | Memoria parlando | Primo suono | Preparare la voce, una volta |
|---|---|---|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,18 | 0,26 | 1,6% | — | 0,12 | 293 MB¹ | 0,15–0,19 s | — |
| 1 · Pocket TTS `italian_24l` | **0,58** | 0,59 | 8,2% | 0,47 · 8,6% | 2,85 | 2,2 GB | 0,83–0,86 s | 22 CPU-s, **5 GB** |
| 1 · Pocket TTS `italian` | 0,56 | 0,60 | 11,3% | 0,38 · 18,8% | 0,98 | 844 MB | 0,24–0,33 s | 23 CPU-s, 4,6 GB |
| 2 · Klein + MeanVC2 | 0,51 | **0,60** | 5,5% | 0,42 · 5,5% | 0,45 | 526 MB | 0,14–0,21 s | 25 CPU-s, 1,9 GB |
| 2 · Klein + OpenVoice V2 | 0,43 | 0,46 | **0,8%** | 0,20 · 3,9% | 1,31 | 1,3 GB | 1,4–1,8 s | 0,3 CPU-s, 0,8 GB |
| 3 · ricerca dentro Klein (Resemblyzer, 1 h) | 0,30 | 0,41 | 1,6% | 0,27 · 0,8% | come oggi | come oggi | come oggi | 1 h di CPU (83–94 min), 0,7 GB |

¹ Klein in Python con l'interprete; il programma in Rust sta a 95–117 MB.

- **Somiglianza**: Pocket TTS (24 strati) e Klein + MeanVC2 sono le strade che si avvicinano di più alla persona
  (0,51–0,58 con ECAPA, 0,59–0,60 con WeSpeaker), a metà strada fra la voce di oggi (0,18) e la persona vera (0,80–0,85).
  OpenVoice sta sotto (0,43). La ricerca dentro Klein porta la voce da 0,18 a 0,30 (da 0,24 a 0,36 secondo la persona).
- **Parole**: OpenVoice e la ricerca restano al livello di Klein (0,8% e 1,6%), perché parla sempre Klein. MeanVC2 cambia
  qualche vocale (5,5%). **Pocket TTS perde o storpia la prima parola in metà delle frasi** (14 su 30 con 24 strati, 15 su
  30 con 6; Klein 0) e arriva all'8–11% di parole sbagliate; il pacchetto a 6 strati salta anche pezzi di frase.
- **Riferimento rovinato** (telefono, rumore, MP3 a 16 kbit/s): tutte le strade perdono somiglianza. Pocket copia anche il
  canale: la voce generata è a sua volta «al telefono» e rumorosa. Klein + MeanVC2 tiene meglio le parole (5,5%) e una parte
  della somiglianza (0,42); OpenVoice crolla (0,20).
- **Costo mentre parla** (a 2 thread su questa macchina carica): MeanVC2 aggiunge circa 0,33 CPU-s per secondo a Klein
  (×4 il costo di oggi), Pocket `italian` ×8, OpenVoice in PyTorch ×11, Pocket `italian_24l` ×24 e **più lento del tempo
  reale** (2,3 s d'orologio per secondo di parlato) con 2,2 GB di memoria. La voce trovata dalla ricerca costa come la voce
  di oggi (0,175 contro 0,168 CPU-s per s, misurate insieme).
- **Costo una volta sola**: OpenVoice 0,3 s; Pocket e MeanVC2 20–25 s di CPU, ma Pocket arriva a 4,6–5 GB di memoria per
  codificare 25 s di riferimento e MeanVC2 a 1,9 GB (il codificatore del parlante WavLM-Large, 387 MB in int8, CC BY-SA 3.0);
  la ricerca un'ora di CPU.
- **La ricerca impara il giudice più che la voce**: il punteggio di Resemblyzer sale fino a 0,76–0,86 (la persona contro sé
  stessa fa 0,91–0,93), mentre ECAPA sui brani tenuti da parte resta a 0,24–0,36 (0,18 per M2 con il riferimento rovinato,
  sotto la voce di oggi) e spesso tocca il massimo nei primi 2–10 minuti per poi scendere. Giudicata da ECAPA (esperimento
  di 30 minuti), F1 sale a 0,42 sia con ECAPA sia con WeSpeaker; M1 a 0,40 con ECAPA ma solo 0,25 con WeSpeaker, con una
  voce a 210 Hz contro i 155 della persona: ogni giudice si lascia ingannare a modo suo.
- **MeanVC2 int8** (la variante leggera predefinita dell'esportazione) è rotta con ONNX Runtime 1.31.1: tono fisso a circa
  4 kHz, 25% di parole sbagliate; la causa è il DiT int8.

## Risultati

### Somiglianza (ECAPA) e parole sbagliate (Whisper), per strada e per persona

| Strada | F1 | F1d | F2 | M1 | M2 | M2d | media F1–M2 |
|---|---|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,16 · 1,6% | 0,16 · 1,6% | 0,16 · 1,6% | 0,18 · 1,6% | 0,21 · 1,6% | 0,21 · 1,6% | 0,18 · 1,6% |
| 3 · la voce o miscela di Klein più vicina (partenza) | 0,29 · 1,6% | 0,21 · 1,6% | 0,34 · 1,6% | 0,27 · 0,0% | 0,17 · 1,6% | 0,15 · 1,6% | 0,27 · 1,2% |
| 3 · ricerca dentro Klein, 1 h di CPU | 0,28 · 1,6% | 0,35 · 1,6% | 0,30 · 1,6% | 0,36 · 1,6% | 0,24 · 1,6% | 0,18 · 0,0% | 0,30 · 1,6% |
| 3 · ricerca giudicata da ECAPA, 30 min (esperimento) | 0,42 · 3,1% | — | — | 0,40 · 3,1% | — | — | 0,41 · 3,1% |
| 1 · Pocket TTS `italian_24l` | 0,64 · 3,1% | 0,47 · 6,2% | 0,53 · 9,4% | 0,57 · 10,9% | 0,57 · 9,4% | 0,46 · 10,9% | 0,58 · 8,2% |
| 1 · Pocket TTS `italian` | 0,64 · 6,2% | 0,37 · 20,3% | 0,48 · 15,6% | 0,59 · 10,9% | 0,54 · 12,5% | 0,38 · 17,2% | 0,56 · 11,3% |
| 2 · Klein + MeanVC2 | 0,66 · 4,7% | 0,52 · 6,2% | 0,50 · 4,7% | 0,43 · 7,8% | 0,44 · 4,7% | 0,32 · 4,7% | 0,51 · 5,5% |
| 2 · Klein + OpenVoice V2 | 0,32 · 0,0% | 0,25 · 1,6% | 0,51 · 1,6% | 0,46 · 1,6% | 0,44 · 0,0% | 0,15 · 6,2% | 0,43 · 0,8% |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 0,57 · 14,1% | 0,50 · 14,1% | 0,39 · 12,5% | 0,27 · 29,7% | 0,25 · 45,3% | 0,20 · 43,8% | 0,37 · 25,4% |

Ogni cella: somiglianza media sulle cinque frasi · parole sbagliate sul totale delle cinque frasi.

### Punti di riferimento (ECAPA contro gli stessi brani tenuti da parte)

| Persona | sé stessa (5 brani veri) | altre persone dello stesso sesso | voce di oggi | il suo riferimento | riferimento rovinato |
|---|---|---|---|---|---|
| F1 | 0,80 (da 0,77 a 0,84) | 0,13 | 0,16 | 0,86 | 0,66 |
| F2 | 0,84 (da 0,81 a 0,88) | 0,12 | 0,16 | 0,91 | — |
| M1 | 0,85 (da 0,74 a 0,90) | 0,22 | 0,18 | 0,88 | — |
| M2 | 0,85 (da 0,79 a 0,90) | 0,18 | 0,21 | 0,81 | 0,58 |

### WeSpeaker ResNet34 (terzo giudice: non lo usa nessuna strada)

| Strada | F1 | F1d | F2 | M1 | M2 | M2d |
|---|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,28 | 0,28 | 0,24 | 0,21 | 0,32 | 0,32 |
| 3 · la voce o miscela di Klein più vicina (partenza) | 0,33 | 0,34 | 0,37 | 0,35 | 0,30 | 0,27 |
| 3 · ricerca dentro Klein, 1 h di CPU | 0,40 | 0,39 | 0,43 | 0,44 | 0,38 | 0,24 |
| 3 · ricerca giudicata da ECAPA, 30 min (esperimento) | 0,44 | — | — | 0,25 | — | — |
| 1 · Pocket TTS `italian_24l` | 0,69 | 0,38 | 0,50 | 0,59 | 0,60 | 0,42 |
| 1 · Pocket TTS `italian` | 0,69 | 0,31 | 0,50 | 0,57 | 0,62 | 0,43 |
| 2 · Klein + MeanVC2 | 0,67 | 0,45 | 0,58 | 0,56 | 0,57 | 0,42 |
| 2 · Klein + OpenVoice V2 | 0,46 | 0,16 | 0,46 | 0,49 | 0,42 | 0,21 |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 0,43 | 0,37 | 0,26 | 0,27 | 0,18 | 0,14 |
| persona contro sé stessa | 0,86 | 0,86 | 0,85 | 0,89 | 0,88 | 0,88 |
| altre persone dello stesso sesso | 0,20 | 0,20 | 0,10 | 0,32 | 0,30 | 0,30 |

### Resemblyzer (il giudice della ricerca: favorisce la strada 3)

| Strada | F1 | F1d | F2 | M1 | M2 | M2d |
|---|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,67 | 0,67 | 0,64 | 0,60 | 0,54 | 0,54 |
| 3 · la voce o miscela di Klein più vicina (partenza) | 0,71 | 0,68 | 0,71 | 0,67 | 0,58 | 0,59 |
| 3 · ricerca dentro Klein, 1 h di CPU | 0,75 | 0,73 | 0,79 | 0,75 | 0,65 | 0,63 |
| 3 · ricerca giudicata da ECAPA, 30 min (esperimento) | 0,66 | — | — | 0,65 | — | — |
| 1 · Pocket TTS `italian_24l` | 0,85 | 0,65 | 0,82 | 0,82 | 0,80 | 0,67 |
| 1 · Pocket TTS `italian` | 0,84 | 0,62 | 0,81 | 0,81 | 0,79 | 0,68 |
| 2 · Klein + MeanVC2 | 0,84 | 0,76 | 0,81 | 0,76 | 0,64 | 0,63 |
| 2 · Klein + OpenVoice V2 | 0,79 | 0,62 | 0,79 | 0,82 | 0,73 | 0,63 |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 0,72 | 0,71 | 0,71 | 0,60 | 0,44 | 0,45 |
| persona contro sé stessa | 0,91 | 0,91 | 0,91 | 0,93 | 0,93 | 0,93 |
| altre persone dello stesso sesso | 0,62 | 0,62 | 0,60 | 0,57 | 0,56 | 0,56 |

### Altezza della voce (mediana F0, Hz) e variazione (deviazione standard in semitoni)

| Strada | F1 | F1d | F2 | M1 | M2 | M2d |
|---|---|---|---|---|---|---|
| persona (brani veri) | 166 · 3,1 | 166 · 3,1 | 175 · 3,3 | 155 · 2,2 | 104 · 3,4 | 104 · 3,4 |
| Voce di oggi (Klein) | 230 · 2,5 | 230 · 2,5 | 230 · 2,5 | 100 · 4,0 | 100 · 4,0 | 100 · 4,0 |
| 3 · la voce o miscela di Klein più vicina (partenza) | 207 · 2,6 | 203 · 3,2 | 196 · 2,3 | 136 · 4,2 | 140 · 3,4 | 133 · 3,5 |
| 3 · ricerca dentro Klein, 1 h di CPU | 197 · 2,5 | 188 · 2,5 | 153 · 2,1 | 155 · 3,5 | 137 · 3,6 | 104 · 1,7 |
| 3 · ricerca giudicata da ECAPA, 30 min (esperimento) | 196 · 2,5 | — | — | 210 · 3,8 | — | — |
| 1 · Pocket TTS `italian_24l` | 186 · 2,1 | 188 · 5,1 | 179 · 3,3 | 162 · 3,5 | 103 · 3,0 | 110 · 3,5 |
| 1 · Pocket TTS `italian` | 198 · 2,7 | 215 · 4,3 | 175 · 4,0 | 140 · 4,3 | 109 · 3,4 | 115 · 4,0 |
| 2 · Klein + MeanVC2 | 194 · 2,9 | 193 · 2,6 | 182 · 2,6 | 110 · 3,7 | 105 · 2,5 | 117 · 2,4 |
| 2 · Klein + OpenVoice V2 | 185 · 1,8 | 197 · 2,9 | 175 · 2,1 | 163 · 3,2 | 117 · 1,8 | 129 · 1,3 |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 220 · 1,9 | 242 · 2,2 | 256 · 1,6 | 248 · 1,9 | 259 · 1,4 | 260 · 2,1 |

### Costo (2 thread, una prova alla volta, processi separati)

| Strada | CPU s per s di parlato | orologio s per s | memoria massima parlando | primo suono, frase 1 / frase 4 | carico medio (1 min) |
|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,117 | 0,065 | 293 MB | 151 / 191 ms | 8,0 |
| 1 · Pocket TTS `italian_24l` | 2,852 | 2,299 | 2189 MB | 855 / 828 ms | 10,4 |
| 1 · Pocket TTS `italian` | 0,981 | 0,681 | 844 MB | 237 / 331 ms | 12,6 |
| 2 · Klein + MeanVC2 | 0,453 | 0,281 | 526 MB | 140 / 210 ms | 10,9 |
| 2 · Klein + OpenVoice V2 | 1,309 | 0,681 | 1264 MB | 1357 / 1819 ms | 9,4 |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 0,347 | 0,228 | 378 MB | 190 / 239 ms | 9,9 |

La voce trovata dalla ricerca contro la voce di oggi, misurate più tardi nella stessa finestra (carico più alto):

| Strada | CPU s per s di parlato | orologio s per s | memoria massima | primo suono, frase 1 / frase 4 | carico medio (1 min) |
|---|---|---|---|---|---|
| Voce di oggi (Klein) | 0,168 | 0,116 | 291 MB | 222 / 374 ms | 28,2 |
| 3 · voce trovata dalla ricerca | 0,175 | 0,124 | 295 MB | 209 / 327 ms | 28,6 |

### Costo una volta sola (preparare la voce della persona)

| Strada | CPU s | orologio s | memoria massima | che cosa |
|---|---|---|---|---|
| 1 · Pocket TTS `italian_24l` | 21,5 | 18,4 | 4995 MB | codifica Mimi del riferimento |
| 1 · Pocket TTS `italian` | 23,1 | 18,6 | 4634 MB | codifica Mimi del riferimento |
| 2 · Klein + MeanVC2 | 24,9 | 16,5 | 1910 MB | codificatore del parlante WavLM-Large + ECAPA (int8, 387 MB) |
| 2 · Klein + OpenVoice V2 | 0,3 | 0,2 | 839 MB | codificatore del timbro sul riferimento |
| 2 · Klein + MeanVC2 int8 (difettosa, vedi sopra) | 25,6 | 15,1 | 1743 MB | come sopra |
| 3 · ricerca dentro Klein (Resemblyzer) | 3600–3602 | 4896–5651 | 724 MB | 6 ricerche, 1831–2801 passi ciascuna |
| 3 · ricerca giudicata da ECAPA (esperimento) | 1800–1808 | 2649–2824 | 1027 MB | 2 ricerche, 643–727 passi ciascuna |

### Strada 3: le ricerche

| Ricerca | giudice | CPU s | orologio | passi | controlli (respinti) | memoria massima | carico all'inizio → alla fine | partenza |
|---|---|---|---|---|---|---|---|---|
| F1 | ecapa | 1800 | 47 min | 727 | 14 (3) | 978 MB | 43 → 41 | ½ Giulia + ½ Mateo |
| M1 | ecapa | 1808 | 44 min | 643 | 12 (4) | 1027 MB | 41 → 36 | ½ Maya + ½ Giulia |
| F1 | resemblyzer | 3601 | 83 min | 2563 | 17 (7) | 702 MB | 9 → 27 | ½ Lyra + ½ Giulia |
| F1d | resemblyzer | 3602 | 94 min | 2489 | 22 (0) | 702 MB | 16 → 50 | ¾ Giulia + ¼ Mateo |
| F2 | resemblyzer | 3600 | 91 min | 1831 | 35 (25) | 699 MB | 25 → 42 | ¾ Camille + ¼ Ivy |
| M1 | resemblyzer | 3600 | 83 min | 2653 | 22 (7) | 698 MB | 9 → 27 | ¾ Mateo + ¼ Edmund |
| M2 | resemblyzer | 3600 | 91 min | 2410 | 20 (12) | 699 MB | 25 → 42 | ½ Diego + ½ Owen |
| M2d | resemblyzer | 3601 | 82 min | 2801 | 23 (9) | 724 MB | 42 → 36 | ½ Mateo + ½ Diego |

### Strada 3: somiglianza nel tempo

| Ricerca | giudice | partenza | 0 min | 2 min | 5 min | 10 min | 20 min | 40 min | fine |
|---|---|---|---|---|---|---|---|---|---|
| F1 | resemblyzer | ½ Lyra + ½ Giulia | 0,29 / 0,32 (0,67) | 0,37 / 0,43 (0,75) | 0,35 / 0,45 (0,79) | 0,26 / 0,36 (0,83) | 0,25 / 0,38 (0,84) | 0,27 / 0,39 (0,85) | 0,27 / 0,39 (0,85) |
| M1 | resemblyzer | ¾ Mateo + ¼ Edmund | 0,27 / 0,35 (0,73) | 0,31 / 0,39 (0,78) | 0,32 / 0,45 (0,79) | 0,37 / 0,43 (0,80) | 0,36 / 0,42 (0,83) | 0,38 / 0,44 (0,83) | 0,37 / 0,43 (0,83) |
| F1d | resemblyzer | ¾ Giulia + ¼ Mateo | 0,21 / 0,34 (0,66) | 0,26 / 0,35 (0,75) | 0,22 / 0,29 (0,76) | 0,32 / 0,38 (0,78) | 0,34 / 0,36 (0,79) | 0,37 / 0,39 (0,80) | 0,35 / 0,38 (0,81) |
| F1_ecapa | ecapa | ½ Giulia + ½ Mateo | 0,19 / 0,35 (0,29) | 0,28 / 0,35 (0,44) | 0,40 / 0,41 (0,50) | 0,42 / 0,42 (0,54) | 0,48 / 0,47 (0,59) | — | 0,41 / 0,43 (0,62) |
| F2 | resemblyzer | ¾ Camille + ¼ Ivy | 0,34 / 0,37 (0,75) | 0,30 / 0,43 (0,77) | 0,33 / 0,46 (0,81) | 0,34 / 0,49 (0,82) | 0,31 / 0,45 (0,85) | 0,30 / 0,44 (0,86) | 0,30 / 0,44 (0,86) |
| M2 | resemblyzer | ½ Diego + ½ Owen | 0,17 / 0,30 (0,67) | 0,17 / 0,30 (0,67) | 0,23 / 0,35 (0,74) | 0,23 / 0,35 (0,74) | 0,24 / 0,39 (0,75) | 0,25 / 0,36 (0,76) | 0,24 / 0,37 (0,76) |
| M1_ecapa | ecapa | ½ Maya + ½ Giulia | 0,29 / 0,19 (0,30) | 0,31 / 0,16 (0,35) | 0,34 / 0,19 (0,38) | 0,38 / 0,22 (0,45) | 0,39 / 0,23 (0,45) | — | 0,40 / 0,25 (0,46) |
| M2d | resemblyzer | ½ Mateo + ½ Diego | 0,15 / 0,28 (0,64) | 0,21 / 0,36 (0,69) | 0,21 / 0,36 (0,69) | 0,17 / 0,26 (0,72) | 0,16 / 0,26 (0,73) | 0,15 / 0,24 (0,75) | 0,18 / 0,23 (0,75) |

Ogni cella: ECAPA / WeSpeaker sulle cinque frasi di prova contro i brani tenuti da parte (tra parentesi il punteggio del giudice della ricerca sulle due frasi di ricerca contro il riferimento). Minuti di CPU del cammino dopo la partenza (la scelta fra le 17 voci e le miscele costa 1,5–2,5 minuti); «fine»: la voce finale.

## Che cosa si vede al posto dell'ascolto

Qui non c'è uscita audio: quanto segue viene da spettrogrammi messi a confronto (`scripts/spettri.py`), dalle
trascrizioni di Whisper frase per frase, dalle durate e dall'altezza della voce. È ciò che un orecchio dovrebbe
controllare per primo sulla pagina d'ascolto, non un giudizio d'orecchio.

- **Voce di oggi** (Giulia 230 Hz, Marco 100 Hz di mediana): pulita, silenzio vero fra le frasi, ritmo regolare. Le
  persone stanno a 166 e 175 Hz (F1, F2) e a 155 e 104 Hz (M1, M2): Giulia è molto più acuta delle due donne, Marco è
  lontano da M1.
- **Pocket TTS** ha un ritmo e pause suoi, presi in parte dal riferimento: con M1, che legge svelto, le frasi durano il
  20–25% meno di Klein; l'altezza segue la persona (F1 186 Hz, M2 103 Hz). Copia anche il **canale** della registrazione:
  il fondo di rumore del riferimento si vede in tutte le frasi, e con il riferimento rovinato la voce generata è essa
  stessa al telefono (niente sopra 4 kHz, rumore): suona come la vecchia registrazione. **Perde o storpia la prima parola
  in metà delle frasi** (14 su 30 con 24 strati, 15 su 30 con 6; Klein 0 su 30): «Sono d'accordo» diventa «d'accordo»,
  «ad accordo», «un accordo», «carta»; «Che bella notizia» diventa «bella notizia» o «È bella notizia»; «Scusate»
  diventa «Cos'attemi» o «Posate»; «Il preventivo» diventa «Preventivo». Altre parole storpiate qua e là («consenia»,
  «dicendo», «venervi»). Il pacchetto a 6 strati salta anche pezzi di frase: «Buongiorno a tutti. Scrivo benissimo,
  benissimo» (F2), «scrivo un verissimo benissimo» (F1 rovinato).
- **Klein + MeanVC2** tiene esattamente tempi e pause di Klein (stesse durate, ±0,1 s): la melodia della frase resta
  quella di Klein, cambia il timbro. Esce a 16 kHz: niente sopra 8 kHz, quindi più ovattata delle altre. L'altezza si
  avvicina alla persona per le donne (F1 194, F2 182 Hz) ma non per M1 (110 Hz contro 155). Qualche vocale cambiata
  («stritta», «estreta» per «stretta»; «Il preventivo di» senza «è»; «comprimente»). La variante int8 dell'esportazione
  (ASR, DiT e Vocos int8, quella predefinita) ha un **tono fisso a circa 4 kHz** per tutta la frase, l'altezza salta a
  circa 250 Hz per tutti e le parole si storpiano (13–45% sbagliate); la causa è il DiT int8 (con il solo ASR int8 la frase
  di prova esce perfetta).
- **Klein + OpenVoice V2** tiene anch'esso tempi e pause di Klein; il timbro si sposta verso la persona, ma l'intonazione
  si **appiattisce**: 1,3–2,1 semitoni di variazione contro 2,2–3,4 delle persone e 2,5–4,0 di Klein. Quasi nessuna parola
  sbagliata. Con il riferimento rovinato è la strada che perde più somiglianza (0,25 e 0,15).
- **Ricerca dentro Klein**: è sempre Klein, con la sua pulizia e il suo ritmo; cambiano timbro, altezza e un poco la
  velocità (M1 a 155 Hz come la persona). La partenza è spesso una miscela con voci straniere (M1: ¾ Mateo, spagnolo, e ¼
  Edmund, inglese; F1 rovinato: ¾ Giulia e ¼ Mateo): l'eventuale accento straniero va ascoltato, Whisper non lo segna (0–1
  parole sbagliate su 64).

## Metodo

### Macchina e versioni

- AMD Ryzen 5 PRO 6650U (6 core, 12 thread), 14 GB, Linux 7.2.15 (Arch), **condivisa** con altri lavori (prove del sito nel
  browser): carico medio fra 15 e 19 durante tutta la misura, memoria disponibile fra 1,7 e 4 GB. Per questo il costo è dato
  in **secondi di CPU**, non solo d'orologio, e il carico è scritto accanto a ogni misura.
- Python 3.13.5, ONNX Runtime 1.31.1 (le impostazioni di Kalliope: niente spinning, niente arena, niente memory pattern),
  PyTorch 2.15.0 CPU (solo OpenVoice e i misuratori), SpeechBrain 1.1.2, faster-whisper 1.2.1, librosa 1.0.1.
- La voce di oggi è fatta dal programma vero: `kalliope-cli say` ricostruito dallo stesso sorgente di `main` in una cartella
  temporanea (`/tmp/voce-m-target`), con `--threads 1` come il programma. La strada 3 parla anch'essa con `kalliope-cli`,
  su una cartella del modello che ha una voce in più in `model.json` (encoder e decoder sono collegamenti agli originali).

### Le persone

Voci italiane vere a licenza libera, lettori volontari di LibriVox (tutte le registrazioni LibriVox sono nel pubblico
dominio; su archive.org le quattro hanno il Public Domain Mark 1.0). File originali MP3 dei capitoli 1 e 2.

| | Lettore | Opera (archive.org) | Note |
|---|---|---|---|
| F1 | Enrica Giampieretti | Grazia Deledda, *Canne al vento* (`canne_al_vento_1609_librivox`) | registrazione molto pulita, F0 ~160 Hz |
| F2 | Claudia Caldi | Scipio Sighele, *La crisi dell'infanzia e la delinquenza dei minorenni* (`lacrisidellinfanzi_2405_librivox`) | fondo a −63 dB, F0 ~160 Hz |
| M1 | Riccardo Fasol | Luigi Pirandello, *Il fu Mattia Pascal* (`mattia_pascal_1012_librivox`) | voce maschile chiara, F0 ~150 Hz |
| M2 | Renzo Clerico | Niccolò Machiavelli, *Il Principe* (`il_principe_1711_librivox`) | voce maschile profonda, F0 ~90 Hz |

Per ogni persona (`scripts/prepara_persone.py`, tagli nelle pause, `esiti/persone.json`):

- **riferimento**: 25–27 s consecutivi dal capitolo 1, dal terzo minuto in poi (dopo il preambolo di LibriVox). È l'unico
  audio che le strade sentono.
- **brani tenuti da parte**: quattro brani di 6–11 s dal capitolo 2 (un'altra sessione), mai dati alle strade: sono il
  bersaglio di tutte le somiglianze.
- **brani di controllo**: cinque brani di 3–6,5 s (lunghi come le frasi di prova) dal capitolo 2, diversi dai precedenti,
  per il punto di riferimento «la persona contro sé stessa».
- **riferimento rovinato** (F1 e M2): lo stesso riferimento con rumore rosa a 20 dB di SNR, banda del telefono 300–3400 Hz
  a 8 kHz e MP3 a 16 kbit/s, riportato a 24 kHz («F1d», «M2d»). Per i due casi rovinati le strade vedono solo il
  riferimento rovinato; la somiglianza si misura sempre contro i brani veri e puliti.

I campioni restano su questo computer (`/workspace/nomedadefinire/bench/voce-propria/`), fuori dal repository.

### Le frasi

Le tre frasi dei campioni del sito (`design/progetto.md`, «Testi dei campioni») più una domanda e un'esclamazione:

1. Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo.
2. Sono d'accordo con Paola. Però la consegna del 14/3 mi sembra stretta: possiamo sentirci venerdì alle 15:30?
3. Il preventivo è di 1.250 € + IVA, valido fino al 31 dicembre.
4. Scusate, mi sentite bene adesso? Posso condividere lo schermo?
5. Che bella notizia, complimenti a tutta la squadra!

Tutte passano dal normalizzatore di Kalliope (`kalliope-cli phonemes`, `esiti/frasi.json`): Klein riceve i fonemi del
fonetizzatore di Kalliope, come nel programma; Pocket TTS il testo normalizzato con la maiuscola a inizio frase; i
convertitori ricevono l'audio di Klein.

### Le strade, i modelli e le licenze

| Strada | Che cosa gira | Licenza | Da dove |
|---|---|---|---|
| oggi | Klein-TTS X1.5 Pro, 13 M parametri, 24 kHz | Apache-2.0 | `klein-ml/Klein-TTS-X1.5-Pro` (già sul disco dal 12/11) |
| 1 | Pocket TTS, pacchetti `italian_24l` (24 strati, solo int8) e `italian` (6 strati, int8), clonazione dal file del riferimento, temperatura 0,7, 1 passo LSD | pesi CC-BY-4.0, codice MIT; il modello ufficiale `kyutai/pocket-tts` è «gated» (serve un account che accetti le condizioni): **non usato**; usata l'esportazione ONNX di terzi `xennonf4/pocket-tts-onnx` (CC-BY-4.0, già sul disco dal 12/11) | |
| 2 | Klein + **MeanVC2** (120 ms + 40 ms, fp32, 2 passi mean-flow come `runtime/run_rt.py`), 16 kHz | grafi di conversione Apache-2.0 (pesi `ASLP-lab/MeanVC2` Apache-2.0); **codificatore del parlante CC BY-SA 3.0** (WavLM-Large + ECAPA di microsoft/UniSpeech); le pagine del progetto parlano di uso di ricerca non commerciale; scheda: lingue en, zh | esportazione ONNX di terzi `kiarina/MeanVC2-ONNX` rev `2db97430` (somme SHA-256 verificate), ciclo di streaming `tool/onnx_stream.py` di `kiarina/meanvc2_onnx` (Apache-2.0) |
| 2 | Klein + **OpenVoice V2** (convertitore del timbro, `tau` 0,3, 22,05 kHz), timbro di partenza ricavato da 25 s di Giulia o Marco | codice e pesi MIT (l'articolo è CC BY-NC-SA); filigrana WavMark del codice ufficiale **spenta** | `myshell-ai/OpenVoiceV2` rev `f36e7edf`, codice `myshell-ai/OpenVoice` (solo i moduli del convertitore) |
| 3 | Klein con una riga di 256 numeri trovata dalla ricerca | Apache-2.0 (Klein); il metodo è di KVoiceWalk (Apache-2.0), codice nostro | |

Nessun codice GPL o non commerciale gira nelle strade. Fanno eccezione, da segnare: il codificatore del parlante di MeanVC2
(CC BY-SA 3.0, condivisione allo stesso modo) e le pagine «non commerciali» di MeanVC2, che contrastano con la licenza
Apache-2.0 dei pesi (già nella ricerca `2-…`, §4).

### La ricerca della strada 3 (`scripts/strada3_ricerca.py`)

- Klein dice due frasi di ricerca (mai le frasi di prova): «Oggi il cielo è sereno e il treno parte alle nove.» e
  «Vorrei sapere se domani la sala delle riunioni è libera.».
- **Punteggio**: somiglianza Resemblyzer (Apache-2.0, il misuratore di KVoiceWalk) delle due frasi con il riferimento, meno
  ciò che manca alla somiglianza fra le due frasi per arrivare a 0,80 (una voce che cambia da frase a frase non è una voce).
  La ricerca non vede mai ECAPA né i brani tenuti da parte: ECAPA sui brani tenuti è un controllo indipendente.
- **Partenza**: le 17 voci di `model.json` (anche le straniere, che dicono fonemi italiani), poi le miscele delle cinque più
  vicine (pesi ¼, ½, ¾); si parte dalla migliore che supera il controllo.
- **Cammino**: la migliore più un passo casuale (σ volte la deviazione standard delle 17 voci, numero per numero; σ da 0,30,
  cresce del 5% a ogni miglioramento e cala del 30% dopo 150 passi senza); ogni numero resta nell'intervallo delle 17 voci
  allargato del 25%. Il rumore del decodificatore è fisso, così il punteggio cambia solo con la voce.
- **Controllo che la voce resti comprensibile**: Whisper base (int8) deve capire le due frasi con al più il 15% di parole
  sbagliate e la loro durata deve restare fra 0,6 e 1,6 volte quella della voce di oggi. Si controlla la partenza; durante il
  cammino la migliore al più una volta per minuto di CPU (Whisper small costa 6 s di CPU per frase su un thread); se non
  passa, il cammino torna all'ultima migliore che passava. Si controlla anche la voce finale.
- **Tetto**: 3600 s di CPU del processo per persona, un thread per tutto; la curva della somiglianza nel tempo è in
  `esiti/curva.json` (ECAPA e WeSpeaker sulle cinque frasi di prova, a 0, 1, 2, 5, 10, 15, 20, 30, 40, 50, 60 minuti di CPU).
- **Esperimento in più**, deciso a lavoro avviato quando si è visto che ECAPA non seguiva Resemblyzer: lo stesso cammino
  giudicato da ECAPA sul riferimento (soglia di coerenza 0,75: due frasi della stessa voce di Klein fanno 0,82–0,86), 1800 s
  di CPU per F1 e M1. Lì ECAPA non è più un controllo indipendente; conta WeSpeaker.
- La voce finale parla con il programma vero (`kalliope-cli`); la curva usa la copia in Python di Klein (stesso modello,
  rumore del decodificatore diverso).

### Che cosa si misura

- **Somiglianza alla persona** (`scripts/misure.py`, `scripts/valuta.py`): ECAPA-TDNN di SpeechBrain
  (`speechbrain/spkrec-ecapa-voxceleb`, Apache-2.0, rev `0f99f2d0`), coseno fra l'audio e il centroide dei quattro brani
  tenuti da parte, media sulle cinque frasi. Accanto, un terzo giudice che nessuna strada usa, WeSpeaker ResNet34
  (`Wespeaker/wespeaker-voxceleb-resnet34`, Apache-2.0, ONNX), e Resemblyzer, che è il giudice della ricerca e quindi la
  favorisce.
- **Parole sbagliate**: Whisper small int8, beam 5, italiano, come `benchmarks/engines/scripts/asr_check.py`; la frase e la
  trascrizione passano entrambe dal normalizzatore di Kalliope prima del conteggio («14 marzo» e «quattordici marzo»
  sono le stesse parole). Totale degli errori sul totale delle parole delle cinque frasi.
- **Costo** (`scripts/costo.py`): 2 thread per tutti, una prova alla volta, ogni misura in un processo nuovo, con le ricerche
  della strada 3 ferme (SIGSTOP) durante la misura. Secondi di CPU per secondo di parlato (le cinque frasi due volte, dopo un
  riscaldamento), secondi d'orologio per secondo, memoria massima del processo (`ru_maxrss`) mentre parla, tempo al primo
  suono (mediana di tre) per la frase 1 e la frase 4. Per Klein + convertitore il costo comprende Klein.
- **Costo una volta sola**: preparare la voce della persona in un processo a sé (modelli caricati più codifica del
  riferimento), e per la strada 3 la ricerca.
- **Ascolto**: qui non c'è uscita audio, quindi non ho potuto ascoltare. Al posto dell'orecchio: spettrogrammi messi a
  confronto (`scripts/spettri.py`), le trascrizioni di Whisper frase per frase, durata, altezza (mediana di F0 con pYIN) e
  variazione dell'intonazione in semitoni. Che cosa se ne ricava è più sotto; il giudizio d'orecchio resta al proprietario,
  sulla pagina d'ascolto.

## Limiti della prova

- **Non ho potuto ascoltare**: su questa macchina non c'è uscita audio. Ciò che «si sente» è ricavato da spettrogrammi,
  trascrizioni, altezza e durate; il giudizio d'orecchio resta al proprietario.
- **Pochi dati per cella**: quattro persone, cinque frasi, 64 parole per cella; una parola sbagliata vale 1,6 punti di WER.
  Differenze di una o due parole sono rumore.
- **Le persone sono lettori allenati** che leggono un libro con un microfono discreto. Chi perde la parola può avere solo
  vecchie registrazioni o una voce già alterata: il riferimento rovinato copre il canale (telefono, rumore, compressione),
  non la voce alterata (disartria), che qui non è stata provata.
- **Un solo riferimento di 25–27 s per persona**: nessuna prova con riferimenti più corti (5–10 s).
- **Il canale conta**: i brani tenuti da parte vengono dallo stesso audiolibro (stesso microfono e stanza) del riferimento.
  Pocket TTS copia anche il canale della registrazione (con il riferimento rovinato parla con la banda del telefono e il
  rumore, vedi sotto), i convertitori no: una parte della somiglianza di Pocket con i brani veri può essere somiglianza di
  canale, non di voce.
- **I misuratori del parlante** (ECAPA, WeSpeaker, Resemblyzer) dicono se il timbro è della stessa persona; non giudicano
  naturalezza, accento o intonazione. Whisper è robusto all'accento: le parole sbagliate colgono parole perse o storpiate,
  non un accento straniero.
- **Macchina condivisa**, carico medio da 8 a 39 durante la misura. Il tempo di CPU è la misura, ma con la contesa anche il
  tempo di CPU cresce (cache, SMT): i costi sono confrontabili fra loro (misurati nella stessa finestra, una prova alla volta)
  ma più alti che a macchina scarica (Klein in Python: 0,117 CPU-s per s qui, circa 0,1 il 12/11). Per la stessa ragione le
  ricerche della strada 3 partite con il carico più alto hanno fatto meno passi nella stessa ora di CPU (vedi la tabella).
- **Costi misurati in Python** (ONNX Runtime 1.31.1; OpenVoice in PyTorch): la memoria comprende l'interprete (circa
  50–100 MB) e, per OpenVoice, PyTorch; il programma in Rust con Klein sta a 95–117 MB (12/11). OpenVoice in ONNX potrebbe
  costare meno; la memoria di Pocket dipende dall'esportazione di terzi (stato di 1000 passi per 24 strati) e dall'arena spenta.
- **Esportazioni di terzi**: Pocket TTS e MeanVC2 sono girati da esportazioni ONNX non ufficiali (MeanVC2 verificata dal suo
  autore contro il codice originale, Pocket no); il modello ufficiale di Pocket (con account) e il PyTorch originale di
  MeanVC2 non sono stati provati. Le impostazioni non sono state ritoccate (Pocket temperatura 0,7 e 1 passo; MeanVC2 2 passi;
  OpenVoice `tau` 0,3).
- **Strada 3**: un solo cammino per persona (seme 0) e un solo giudice, come KVoiceWalk; il controllo con Whisper base ha
  respinto miglioramenti anche per errori minimi («e» al posto di «è», parole fuse), 7 controlli su 17–22 per F1 e M1; il
  passo σ è arrivato al minimo (0,03) dopo circa 20 minuti, e il resto dell'ora è andato in passi piccoli. La variante
  giudicata da ECAPA è un esperimento di 30 minuti su F1 e M1 soltanto.
- Nessuna misura di energia (i contatori RAPL non si leggono qui): il tempo di CPU fa da indicatore.
- Una somiglianza di 0,6 non vuol dire «simile al 60%»: la scala si legge con i punti di riferimento (sé stessa 0,80–0,85,
  un'altra persona 0,12–0,22).

## Come rifare

```sh
B=/workspace/nomedadefinire/bench/voce-propria      # dati pesanti, fuori dal repository
S=benchmarks/voce-propria/scripts
cargo build --release -p kalliope-cli --target-dir /tmp/voce-m-target
python3 -m venv $B/.venv
$B/.venv/bin/pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
$B/.venv/bin/pip install onnxruntime==1.31.1 numpy scipy soundfile faster-whisper sentencepiece safetensors \
    huggingface_hub speechbrain av psutil librosa matplotlib webrtcvad-wheels
$B/.venv/bin/pip install --no-deps resemblyzer==0.1.4
# scaricare in cartelle proprie: i capitoli LibriVox (tabella sopra) in $B/scaricati/librivox-<item>/,
# kiarina/MeanVC2-ONNX in $B/modelli/meanvc2-onnx, myshell-ai/OpenVoiceV2 in $B/modelli/openvoice-v2,
# speechbrain/spkrec-ecapa-voxceleb, Wespeaker/wespeaker-voxceleb-resnet34 e Systran/faster-whisper-base in $B/modelli/,
# il codice di kiarina/meanvc2_onnx e myshell-ai/OpenVoice in $B/codice/dl-*/
P="$B/.venv/bin/python -I"
$P $S/prepara_persone.py && $P $S/oggi.py
for s in pocket24 pocket6 meanvc2 meanvc2-int8 openvoice; do $P $S/genera.py $s; done
for r in F1 F2 M1 M2 F1d M2d; do $P $S/strada3_ricerca.py $r --budget 3600; done
for r in F1 M1; do $P $S/strada3_ricerca.py $r --budget 1800 --giudice ecapa; done
$P $S/curva.py && $P $S/curva.py F1 M1 --giudice ecapa
$P $S/genera.py ricerca && $P $S/genera.py ricerca-ecapa F1 M1
$P $S/valuta.py                       # ECAPA, WeSpeaker, Resemblyzer, Whisper; risultati in esiti/qualita.json
# costo: con le ricerche ferme, una prova alla volta
$P $S/costo.py --strade oggi,pocket24,pocket6,meanvc2,meanvc2-int8,openvoice --rif F1,M1
$P $S/costo.py --strade oggi,ricerca --modi parla --rif F1,M1
$P $S/pagina.py && $P $S/resoconto.py
```

## File

| Percorso | Contenuto |
|---|---|
| `scripts/comune.py` | percorsi, frasi, impostazioni di ONNX Runtime |
| `scripts/prepara_persone.py` | tagli delle persone, riferimento rovinato |
| `scripts/oggi.py` | la voce di oggi con `kalliope-cli` |
| `scripts/klein.py` | Klein in Python con una riga di stile qualsiasi (per la ricerca), cartella del modello con voci in più |
| `scripts/strade.py` | le strade dietro un'interfaccia sola |
| `scripts/genera.py` | l'audio di una strada per tutti i riferimenti |
| `scripts/strada3_ricerca.py`, `scripts/curva.py` | la ricerca e la sua curva |
| `scripts/misure.py`, `scripts/valuta.py` | ECAPA, WeSpeaker, Resemblyzer, Whisper |
| `scripts/costo.py` | il costo, una prova alla volta |
| `scripts/spettri.py` | spettrogrammi a confronto |
| `scripts/pagina.py` | la pagina d'ascolto |
| `scripts/resoconto.py` | le tabelle di questo file |
| `esiti/` | `persone.json`, `frasi.json`, `qualita.json` (con `qualita_cache.json`, per file), `costo.jsonl`, `curva.json`, `ricerca/*.json`, `genera_*.json` |
| `progresso.md` | il diario del lavoro |
