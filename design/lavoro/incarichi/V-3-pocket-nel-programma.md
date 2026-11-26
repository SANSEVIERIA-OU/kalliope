# Incarico V-3 · Il motore che imita la voce, dentro il programma

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Le decisioni del proprietario** (17/11/2026):
  - ha scelto «il trucco» (V-2): i pesi aperti attuali di Pocket TTS più l'encoder della voce dell'esportazione di maggio;
  - subito dopo: «stai facendo un lavoro inutile: ti dico già di inserire il trucco senza farmi sentire i test».

  È il via al **punto 2**: metterlo nel programma. Niente pagina d'ascolto e niente campagna di misure: restano solo le prove
  che servono a costruire bene, automatiche (dice le parole giuste, assomiglia, non perde la prima parola, non fa aspettare).
- **Chi lo fa**: lo stesso incaricato di V-m, V-1 e V-2.
- **Regola**: sempre l'ultimissima versione di ogni dipendenza, verificata oggi nelle fonti ufficiali (`CLAUDE.md`).

## Parte A · V-2 ridotto: il modello pronto per il programma

1. **La compatibilità dei pesi**, tensore per tensore, fra maggio e la versione attuale nelle parti in comune (codec, encoder,
   proiezione del parlante). Se il codec o la parte che codifica la voce sono cambiati, il trucco non può funzionare: fermati
   e scrivilo con i numeri.
2. **L'unione** nel modo più pulito, verificata con una voce pronta di Kyutai codificata dalla sua registrazione.
3. **L'esportazione ONNX** che il programma userà:
   - cache libera, int8, 6 strati (24 se la versione attuale li ha e tengono il passo a 2 thread);
   - onnxruntime all'ultima versione (1.32.0).
4. **Un controllo automatico breve**, senza pagina d'ascolto e senza la campagna intera:
   - 2 persone, le frasi brevi e una decina di frasi;
   - prima parola, parole sbagliate, somiglianza, contro la versione di maggio con le impostazioni ufficiali.

   Basta per sapere che la combinazione è migliore di maggio. Se non lo è, fermati e scrivilo.
5. Nel `README.md`, una sezione breve:
   - compatibilità, modo dell'unione, numeri del controllo;
   - da quali repository e revisioni viene ogni parte, con la licenza, come servirà in `THIRD_PARTY_NOTICES.md`.

Interrompi le parti di V-2 che questa parte non chiede: pagina d'ascolto, misura completa, riferimenti rovinati.

## Parte B · Il motore nel programma

Leggi prima `CONTRIBUTING.md`, `docs/` (architettura, rilascio), `crates/voice` (Klein: binding proprio a ONNX Runtime caricato
a runtime, impostazioni obbligatorie niente spinning e niente arena), `crates/app/src/engine.rs`, `catalog.rs`, `download.rs`,
`settings.rs`, `crates/cli`.

1. **Un secondo motore, nello stesso stile del programma**:
   - Rust, lo stesso binding a ONNX Runtime, nessuna dipendenza nuova se non indispensabile;
   - il tokenizer della versione attuale scritto in Rust e provato token per token contro quello ufficiale su un insieme
     largo di frasi italiane (numeri, sigle, accenti, punteggiatura);
   - il testo passa dal normalizzatore di Kalliope come per Klein;
   - il ciclo di generazione come nel codice ufficiale di Kyutai, con le correzioni trovate in V-1: fine del riferimento su
     pausa, minimo di passi prima della fine, dissolvenza, cache libera, pezzi dello streaming che non lasciano vuoti.
2. **La voce della persona**:
   - si prepara una volta da una registrazione: codifica a pezzi, memoria sotto 1 GB;
   - si salva in un file, scegliendo con i numeri fra stato pronto e latenti;
   - si ricarica.
3. **Dove si usa**:
   - in `kalliope-cli`: preparare la voce da un file audio, salvarla, parlare con una voce salvata;
   - nel motore dell'applicazione (`engine.rs`): la voce salvata come scelta accanto a Giulia e Marco, con lo streaming nel
     microfono virtuale;
   - la voce di oggi resta per chi non ha una registrazione.
4. **Non si tocca la finestra** (`crates/app/ui/`). La finestra per aggiungere la propria voce è il punto 3 e ha il suo
   passo prima (la proposta dei valori del design system per Slint). Se serve una scelta senza finestra, passa dalle
   impostazioni o dalla riga di comando.
5. **I file del modello**:
   - il programma li cerca in una cartella locale (come `--model-dir` per Klein);
   - **non pubblicare nulla e non caricare file da nessuna parte**: dove ospitarli lo decide il proprietario;
   - prepara la voce di catalogo e scaricamento (`catalog.rs`) solo se non richiede un indirizzo che non esiste: altrimenti
     scrivi che cosa serve.
6. **Le dipendenze del programma all'ultima versione**:
   - porta ONNX Runtime a 1.32.0 (`ort.rs`, `tools/fetch_assets.py`, i pacchetti), verificando che gli indici della tabella
     `OrtApi` reggano;
   - elenca per chi coordina le altre dipendenze del programma che non sono all'ultima (Slint, toolchain Rust, le altre),
     senza aggiornarle in questo incarico.
7. **L'attribuzione** in `THIRD_PARTY_NOTICES.md` (Kyutai, CC-BY-4.0; l'esportazione di terzi da cui viene l'encoder, con la
   sua licenza), e la documentazione in `docs/` e `README.md` dove descrivono le voci.

## Prove (fino al verde)

- I controlli di `CONTRIBUTING.md`: `cargo fmt`, `clippy`, `cargo test` e quelli che lì sono obbligatori.
- La parità numerica: con lo stesso seme e la stessa voce, gli stessi latenti e lo stesso audio della catena Python/ONNX di
  riferimento, entro una tolleranza che dichiari.
- **Da capo a fondo, come un utente, con il programma vero**:
  - `kalliope-cli` prepara la voce di una persona di prova da una registrazione, la salva e dice le frasi;
  - Whisper e la somiglianza sull'uscita, con nessuna prima parola persa sulle frasi brevi;
  - tempo al primo suono, nessun vuoto nello streaming a 2 thread, memoria massima;
  - l'applicazione avviata con la voce salvata che parla nel microfono virtuale, se il microfono virtuale si può creare su
    questa macchina. Se non si può, dillo.
- Ogni difetto trovato diventa una prova che fallisce sul codice di prima.

## Regole

- Area tua: `crates/` (senza `crates/app/ui/`), `tools/fetch_assets.py`, `packaging/`, `docs/`, `README.md`,
  `THIRD_PARTY_NOTICES.md`, `benchmarks/voce-propria/`, e `/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/` per i dati pesanti.
- Non toccare `website/`, `design-system/`, `design/` (salvo `progresso.md` tuoi), `tools/site.py`: c'è una costruzione del
  sito in corso.
- **Nessun commit, nessun push**, nessun altro agente, niente account, nessun accesso al repository gated, neppure con
  credenziali trovate sulla macchina, nessun file pubblicato o caricato da nessuna parte.
- File scaricati in cartelle proprie, Python con `-I` quando li legge; cartelle temporanee `/tmp/voce-m-*`; build Rust in
  `/tmp/voce-m-target`.
- La macchina è condivisa con la costruzione del sito: un lavoro pesante alla volta.
- Aggiorna `benchmarks/voce-propria/progresso.md` a ogni unità finita.

## Consegna

Nella risposta finale:
- la parte A con i numeri;
- i file toccati;
- come si usa, con i comandi;
- gli esiti delle prove;
- le dipendenze non all'ultima;
- ciò che serve dal proprietario: dove ospitare i file del modello, e la finestra del punto 3;
- ciò che non hai verificato.
