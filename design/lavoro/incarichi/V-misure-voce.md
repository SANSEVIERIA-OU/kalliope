# Incarico V-m · La voce di chi usa Kalliope: misurare le tre strade

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file; le domande vanno a chi coordina, nella
  risposta finale.
- **Il via del proprietario** (17/11/2026): alla proposta «prima di scegliere, provo le tre strade su questo computer… poi
  ti porto i campioni da ascoltare» ha risposto «ok». È un via per **misurare**, non per costruire: il programma
  (`crates/`) non si tocca.
- In `benchmarks/voce-propria/` conserva i programmi di prova, il resoconto e gli esiti JSON.
  Salva registrazioni, modelli scaricati e audio generato in `materiali-locali/prove-voce/bench/voce-propria/`,
  la cartella del progetto esclusa da Git. Tieni `benchmarks/voce-propria/progresso.md`
  aggiornato a ogni unità finita (fatto, in corso, prossimo passo, ultimo comando, problemi aperti).

## Leggi prima

1. `CLAUDE.md`, `design/lavoro/STATO.md` (decisioni del 17/11/2026), la memoria del progetto se ti serve il contesto
   tecnico (`/home/dev/.claude/projects/-workspace-kalliope/memory/progetto-voce-locale.md`).
2. La ricerca: `design/lavoro/ricerca/voce/SINTESI.md` e, per ogni strada, il rapporto che la riguarda (`1-…` Pocket
   TTS, `2-…` conversione del timbro, `4-…` Klein e la ricerca nello spazio delle voci, `3-…` chi perde la parola).
3. Il banco di prova già esistente: `benchmarks/engines/README.md` e i suoi programmi (`scripts/`: `engines.py`,
   `worker.py`, `asr_check.py`, `run_bench.py`), l'ambiente Python in `/workspace/kalliope/materiali-locali/prove-voce/bench/.venv`, i modelli in
   `/workspace/kalliope/materiali-locali/prove-voce/bench/models/` (c'è già `pocket-onnx`, esportazione ONNX di terzi di Pocket TTS con i pacchetti
   `italian` e `italian_24l` e la clonazione da una registrazione). Le impostazioni obbligatorie di ONNX Runtime (niente
   spinning, niente arena) valgono anche qui.
4. Come Kalliope dice una frase oggi: `crates/cli` (`kalliope-cli`, opzioni `--model-dir`, `--speaker`, `--threads`),
   `crates/text` (normalizzatore), `crates/phonemes`, `crates/voice` (Klein: una voce è una riga di 256 numeri in
   `onnx/model.json`, passata come `style` a codificatore e decodificatore).

## Le tre strade da misurare

1. **Un secondo motore che imita la voce**: Pocket TTS, pacchetto `italian_24l` (e `italian` per confronto), con la
   registrazione della persona come riferimento. Se un modello ufficiale serve un accesso con account (Hugging Face
   «gated»), non creare account: usa ciò che è accessibile e dillo.
2. **La voce di oggi più un trasformatore del timbro**: Klein (Giulia per le voci femminili, Marco per le maschili, come
   oggi nel programma) seguito da un convertitore che porta il timbro su quello della registrazione. Almeno due
   convertitori fra quelli della ricerca `2-…`, scelti per licenza permissiva e peso su CPU (per esempio MeanVC2 e il
   convertitore di OpenVoice V2); se uno non gira su CPU in tempi ragionevoli, dillo con i numeri. Niente codice GPL o
   non commerciale dentro ciò che potrebbe finire nel programma: per la sola misura si può usare, ma va segnato.
3. **Cercare la voce dentro quella di oggi**: modificare la riga di 256 numeri di Klein (partendo dalle 17 voci e dalle
   loro miscele) finché un misuratore di somiglianza del parlante dice che assomiglia alla registrazione, sul modello di
   KVoiceWalk (ricerca `4-…`, §2), con un controllo che la voce non diventi incomprensibile. Un tetto di tempo per persona
   che dichiari (dell'ordine di un'ora di CPU), e la curva della somiglianza nel tempo.

## Le persone (voci di prova)

- Voci italiane vere, a licenza libera, che facciano la parte di chi usa Kalliope: per esempio lettori di audiolibri
  LibriVox in italiano (pubblico dominio, archive.org), o Multilingual LibriSpeech italiano (CC BY 4.0). Quattro persone:
  due voci femminili e due maschili, ciascuna con almeno qualche minuto di parlato pulito. Scrivi da dove viene ogni
  registrazione, con la licenza.
- Per ogni persona: un **riferimento** di circa 20–30 secondi; altri brani della stessa persona, **mai usati come
  riferimento**, per misurare la somiglianza. In più, per una voce femminile e una maschile, lo stesso riferimento
  **rovinato come una vecchia registrazione** (banda del telefono, rumore, compressione) per vedere che cosa resta.
- I campioni servono solo alla misura e all'ascolto del proprietario su questo computer: non si pubblicano e non entrano
  nel repository.

## Che cosa misurare

- **Le frasi**: le tre frasi dei campioni del sito (`design/progetto.md`, «Testi dei campioni») più due frasi con una
  domanda e un'esclamazione; tutte passano dal normalizzatore di Kalliope, così che le strade ricevano lo stesso testo
  (Klein anche dal fonetizzatore, come nel programma).
- **Somiglianza alla persona**: un misuratore del parlante a licenza chiara che giri su CPU (per esempio ECAPA-TDNN di
  SpeechBrain, Apache-2.0), fra l'audio generato e i brani tenuti da parte. Con i due punti di riferimento: la voce di
  oggi senza clonazione (Giulia o Marco contro la persona) e la persona contro sé stessa (due brani veri diversi).
- **Parole sbagliate**: Whisper come in `asr_check.py`, sulla stessa scala delle misure del 12/11.
- **Costo**: secondi di CPU per secondo di parlato, memoria massima, tempo al primo suono; a parità di thread, una prova
  alla volta. La macchina è condivisa con altri lavori (browser delle prove del sito): misura il tempo di CPU, non solo
  quello d'orologio, e scrivi il carico.
- **Il costo una volta sola**: quanto tempo e memoria servono per preparare la voce della persona (codifica del
  riferimento, ricerca della strada 3).
- **Ascolto**: ascolta tu stesso alcuni risultati per strada (con Whisper e la somiglianza non si sente tutto: voci
  metalliche, respiri, accento straniero, frasi tagliate) e scrivi che cosa senti.

## Che cosa consegni

- `benchmarks/voce-propria/README.md`: il metodo (macchina, versioni, licenze dei modelli usati, da dove vengono le voci),
  una tabella per strada e per persona (somiglianza, parole sbagliate, costo, costo una volta sola), i punti di riferimento,
  ciò che hai sentito, i limiti della prova. Nessuna raccomandazione finale: i fatti, poi le differenze che contano.
- **Una pagina d'ascolto** per il proprietario, in `/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/ascolto/index.html`
  (statica, solo HTML e `<audio>`, nessuna libreria): per ogni persona il riferimento e, frase per frase, la voce di oggi e
  le tre strade una accanto all'altra, con i numeri sotto ciascuna. Chi coordina la servirà al proprietario.
- Nella risposta finale: le tabelle principali, ciò che hai sentito, i problemi trovati, ciò che non hai potuto misurare.

## Regole

- Il programma (`crates/`) non si tocca. Nessun commit, nessun push. Non creare altri agenti.
- File scaricati: ognuno nella sua cartella nuova e vuota, i programmi tuoi altrove, Python con `-I` quando legge file
  scaricati, i percorsi come argomenti. Solo da fonti ufficiali dei modelli e degli archivi.
- Niente account, niente comandi che chiedono conferma, niente finestre sullo schermo, niente audio dagli altoparlanti
  (qui non c'è uscita audio). Cartelle temporanee sotto `/tmp/voce-m-*`; se serve servire la pagina d'ascolto per provarla,
  porte dalla **8900** alla 8909 (8765 e 8766 sono del proprietario, 8880–8899 di altri lavori).
- La memoria della macchina è 14 GB condivisi con altri lavori: un modello pesante alla volta, e scrivi i picchi.
