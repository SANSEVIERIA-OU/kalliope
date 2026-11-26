# Incarico V-2 · La versione attuale di Pocket TTS con l'encoder della voce di maggio

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **La decisione del proprietario** (17/11/2026). Le strade proposte:
  1. un account Hugging Face per la versione attuale con la clonazione (`kyutai/pocket-tts`, gated);
  2. un altro modello senza account;
  3. «il trucco», non proposto da chi coordina perché aggira il controllo d'accesso di Kyutai e la compatibilità non è
     verificabile in anticipo: i pesi aperti attuali (`kyutai/pocket-tts-without-voice-cloning`, encoder della voce azzerato)
     più l'encoder dell'esportazione di maggio.

  Il proprietario ha risposto: «scelgo il trucco». Regola del proprietario dello stesso giorno, in `CLAUDE.md`: sempre
  l'ultimissima versione di ogni dipendenza.
- **Chi lo fa**: lo stesso incaricato di V-m e V-1.
- **Area tua**: `benchmarks/voce-propria/` (una sezione nuova del `README.md`, «La versione attuale con l'encoder di
  maggio», esiti in `esiti/v2/`, `progresso.md` aggiornato a ogni unità) e `/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/`
  per i dati pesanti.

## Che cosa fare

1. **Prima la compatibilità, con i pesi**:
   - confronta, tensore per tensore, i pesi che maggio e la versione attuale hanno in comune: codec Mimi (encoder e
     decoder), proiezione del parlante, ciò che serve per condizionare sulla voce;
   - dì quali sono identici, quali diversi e di quanto, e se le forme coincidono.

   Se il codec e la parte che codifica la voce sono cambiati, il trucco non può funzionare: fermati e scrivilo con i numeri.
2. **Poi l'unione**:
   - la versione attuale aperta (italiano `@1e08e6a2` o la più recente che trovi oggi, all'ultima revisione) con
     l'encoder della voce di maggio, nel codice ufficiale all'ultima versione;
   - scegli tu il modo più pulito: riempire i tensori azzerati, oppure far codificare la voce all'encoder di maggio e
     passare il risultato alla versione attuale. Scrivi quale e perché;
   - verifica che la catena sia quella giusta, con una voce pronta di Kyutai codificata dalla sua registrazione: la voce
     clonata deve assomigliare a quella pronta.
3. **La misura**, come in V-m e V-1:
   - le quattro persone, le 40 frasi con 2 semi e le frasi brevi;
   - prima parola persa, parole sbagliate, somiglianza ECAPA e WeSpeaker, anche con i riferimenti rovinati;
   - accanto: la versione di maggio con le impostazioni ufficiali e Klein;
   - riferimento di 10 s e di 25 s.
4. **L'esportazione ONNX** della combinazione: cache libera, int8, 6 strati (e 24 se la versione attuale li ha); tempo al
   primo suono, secondi di CPU per secondo, vuoti nello streaming, memoria. Una misura alla volta, con il carico scritto.
5. **Le versioni**: all'ultima versione ufficiale verificata oggi, compresa onnxruntime 1.32.0. Ripeti la tabella «Versioni».
6. **L'attribuzione**: da quali repository e revisioni viene ogni parte della combinazione, con la licenza di ciascuna (CC-BY-4.0
   da verificare per entrambe), come servirà in `THIRD_PARTY_NOTICES.md` se entra nel programma.
7. **L'ascolto**: una sezione nuova nella pagina d'ascolto (sul posto in `ascolto/`) con, per le quattro persone e le stesse
   frasi, la versione di maggio, la combinazione e il riferimento, così che il proprietario senta se la voce assomiglia e se la
   prima parola c'è.

## Che cosa consegni

Nella sezione nuova del `README.md` e nella risposta finale:
- la compatibilità con i numeri;
- il modo dell'unione;
- la tabella prima e dopo (versione di maggio, combinazione, Klein);
- la combinazione per lo streaming e i suoi costi;
- le versioni e l'attribuzione;
- ciò che non hai potuto misurare.

Se il trucco non funziona, dillo con i numeri e con che cosa servirebbe.

## Regole

Le stesse di V-m e V-1: il programma (`crates/`) non si tocca; nessun commit, nessun push, nessun altro agente; niente
account e niente accesso al repository gated, neppure con credenziali trovate sulla macchina; file scaricati in cartelle
proprie e Python con `-I` quando li legge; cartelle temporanee `/tmp/voce-m-*`; porte 8900–8909 solo per provare la pagina
(la 8767 la serve chi coordina). La macchina è condivisa con un ruolo di costruzione del sito che usa il browser: un modello
pesante alla volta, e misura il tempo di CPU.
