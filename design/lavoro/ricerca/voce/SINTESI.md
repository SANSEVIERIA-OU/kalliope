# La voce di chi usa Kalliope: sintesi della ricerca (17/11/2026)

Decisione del proprietario del 17/11/2026: «voglio che lo faccia già adesso (non "la mia voce" ma la voce dell'utente)».
Cinque ricerche (ruolo research, haiku), con le fonti, in questa cartella:

1. `1-modelli-che-clonano.md`: modelli che dicono un testo con una voce presa da una registrazione breve.
2. `2-conversione-voce.md`: modelli che trasformano una voce sintetica nel timbro di un'altra.
3. `3-voice-banking.md`: come si costruisce oggi una voce personale per chi perde la parola.
4. `4-adattare-voce-piccola.md`: Klein, Kokoro, Piper e i modi di dare loro una voce nuova.
5. `5-regole-ue.md`: AI Act art. 50, GDPR, Garante, consenso, filigrane.

## I fatti che decidono

- **Klein** (la voce di oggi) rappresenta una voce come una riga di 256 numeri (`onnx/model.json`, 17 voci); non ha un
  codificatore che ricavi la riga da una registrazione, né codice di addestramento pubblicato; è stato addestrato su 17
  voci sole, «not trained on blends» (scheda del modello, 3/11/2026) → `4`, §1.
- **Pocket TTS** (Kyutai, gennaio 2026; codice MIT, pesi CC-BY-4.0, accesso con consenso alle condizioni) è l'unico
  modello leggero che ha **insieme** l'italiano nella lista ufficiale (`italian_24l`, «higher quality but slower») e la
  clonazione da un file wav; circa 6 volte il tempo reale su 2 core di un MacBook Air M4; la voce clonata si salva e si
  ricarica subito (`export-voice`) → `1`, §2; `4`, §4. Nella nostra prova del 12/11 (versione italiana di terzi, voce di
  riferimento sintetica) costava circa 7 volte la CPU di Klein, circa 600 MB, e sbagliava il 16% delle parole
  (`benchmarks/engines/README.md`).
- **Conversione del timbro**: il più leggero con misure ufficiali su CPU è MeanVC2 (circa 18M parametri, RTF < 0,633 su un
  core, pesi Apache-2.0 su HF, ma pagine «non commerciali» e codificatore del parlante CC BY-SA 3.0); nessun convertitore è
  stato provato in italiano, MeanVC su solo mandarino; ONNX solo di terzi → `2`, §1–3.
- **Cercare la voce dentro Klein** (come KVoiceWalk per Kokoro: si spostano i 256 numeri finché un misuratore di
  somiglianza dice che la voce assomiglia alla registrazione): nessun costo in più quando parla; su Kokoro 0,78–0,92 di
  somiglianza dichiarata, 26 ore di CPU per 10.000 passi; Klein, con 17 voci, ha uno spazio più povero → `4`, §2.
- **Addestrare una voce su misura** (Piper, StyleTTS 2, Kokoro): da 30 minuti a ore di registrazioni pulite e una scheda
  grafica per ore → non adatto a chi non può più registrare → `4`, §2–3.
- **Chi perde la parola**: le associazioni consigliano di registrare presto; molti hanno solo vecchie registrazioni o
  parlano già con fatica; la clonazione da pochi secondi conserva il timbro ma perde intelligibilità se il riferimento è
  già alterato (Interspeech 2025) → `3`, §2–4.
- **Regole**: dal 2/8/2026 l'art. 50(2) AI Act chiede di marcare l'audio sintetico; le linee guida della Commissione
  (C(2026) 7702, 5/11/2026) escludono il contenuto che «only transforms authentic human input through assistive
  technologies allowing persons with disabilities to communicate (… AAC or customized neural voices (CNV))», mentre la
  sintesi realistica nella voce di **un'altra** persona va marcata. In Italia l'art. 612-quater c.p. (L. 132/2025) punisce
  chi diffonde senza consenso voci falsificate con l'IA. Le filigrane aperte (AudioSeal, WavMark, Timbre) non reggono bene
  la compressione Opus delle riunioni (AudioMarkBench, NeurIPS 2024) → `5`, §1–4.

## Le strade (proposte al proprietario il 17/11/2026)

1. Un secondo motore che imita la voce (Pocket TTS, italiano ufficiale).
2. La voce di oggi più un trasformatore del timbro (MeanVC2 o simili).
3. Cercare dentro la voce di oggi quella più vicina alla persona.
(Esclusa: addestrare una voce su misura, per i dati e la scheda grafica che chiede.)

Nessuna si sceglie sulla carta: il dubbio decisivo è la qualità in italiano contro il costo. Proposta: misurarle tutte e
tre su questo computer con voci italiane vere a licenza libera, con campioni da ascoltare, prima di scegliere.
