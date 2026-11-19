# Incarico V-4 · Il motore che imita la voce, con la versione attuale ufficiale, dentro il programma

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Le decisioni del proprietario**:
  - 17/11/2026: metterlo nel programma senza prove d'ascolto («ti dico già di inserire il trucco senza farmi sentire i test»);
  - 19/11/2026, dopo che il trucco non ha retto (V-3): ha creato l'account Hugging Face («account huggingface creato»).

  Si usa quindi la versione attuale ufficiale con la clonazione, `kyutai/pocket-tts` (gated, approvazione automatica).
- **Chi lo fa**: lo stesso incaricato di V-m, V-1, V-2 e V-3.
- **Regola**: sempre l'ultimissima versione di ogni dipendenza, verificata oggi nelle fonti ufficiali (`CLAUDE.md`). Questo vale
  per il modello, per il codice di Kyutai, per onnxruntime e per le altre librerie.

## L'account e la chiave: solo del proprietario

- Le condizioni del modello, la chiave di lettura e `hf auth login` li fa il proprietario. Tu non crei account, non accetti
  condizioni e non cambi impostazioni dell'account.
- Prima di scaricare dal repository gated, controlla con `hf auth whoami` che l'accesso ci sia. Se manca, oppure se il
  repository risponde 401/403, fermati e dillo a chi coordina, senza aggirarlo.
- La chiave serve **solo** a scaricare i file di `kyutai/pocket-tts` che servono a questo incarico. Non stamparla, non copiarla in
  file, log, script o nel repository, e non usarla per altro. Niente `hf upload`, niente repository nuovi.
- Mentre l'accesso non c'è, puoi già lavorare su tutto ciò che è uguale nella versione aperta attuale
  (`kyutai/pocket-tts-without-voice-cloning`, stessa data del 21/10/2026): tokenizer, esportazione, motore in Rust con le voci
  pronte. Quando l'accesso arriva, verifica tensore per tensore che le due versioni differiscano solo nella parte che codifica la
  voce.

## Le voci per le prove e il consenso

Le condizioni di Kyutai vietano di imitare una voce senza un consenso esplicito e lecito. Per le prove:
- preferisci registrazioni la cui licenza permette di usarle come voce di riferimento: per esempio le voci di
  `kyutai/tts-voices`, che hanno la licenza indicata voce per voce;
- se ti servono le persone di V-m, scrivi da dove vengono e con quale licenza, e usale solo per le misure interne;
- nessun audio generato con la voce di una persona reale esce da questa macchina.

Nella documentazione per chi usa Kalliope (`docs/`, `README.md`) scrivi che la voce da imitare è la propria, o quella di chi ha
dato il consenso esplicito, come chiedono le condizioni del modello.

## Parte A · Il modello pronto per il programma

1. **La versione.**
   - Trova l'ultima revisione di `kyutai/pocket-tts` e l'ultimo commit che ha toccato `languages/italian/` e
     `languages/italian_24l/`. Al 19/11 la revisione del repository è `db04f0e6` del 21/10/2026.
   - Trova l'ultima versione del codice ufficiale (`pocket-tts` su PyPI e `kyutai-labs/pocket-tts` su GitHub).
   - Scrivi revisioni e versioni nella tabella «Versioni».
2. **La catena di riferimento in Python**, con il codice ufficiale e le impostazioni ufficiali, per l'italiano a 6 e a 24 strati:
   - una voce clonata da una registrazione;
   - la stessa voce pronta di Kyutai, ricodificata dalla sua registrazione: deve assomigliare.
3. **L'esportazione ONNX** che il programma userà:
   - prima cerca se oggi c'è un'esportazione ufficiale, o di terzi, della versione attuale;
   - altrimenti esporta tu dal codice ufficiale, con le lezioni di V-1: cache libera, int8, encoder della voce a pezzi;
   - 6 strati, e 24 se tengono il passo a 2 thread su questa macchina;
   - onnxruntime all'ultima versione (verifica oggi se 1.32.0 lo è ancora).
4. **Un controllo automatico breve**, senza pagina d'ascolto e senza campagna:
   - 2 voci, le frasi brevi e una decina di frasi;
   - per ciascuna: prima parola, parole sbagliate, somiglianza;
   - il confronto con i numeri di maggio già misurati in V-1 (non rifarli).

   Se la versione attuale perde ancora la prima parola, o non assomiglia, fermati e scrivilo con i numeri.
5. Nel `README.md`, una sezione breve:
   - versioni;
   - esportazione;
   - numeri del controllo;
   - provenienza e licenza di ogni parte, come servirà in `THIRD_PARTY_NOTICES.md`;
   - che cosa implicano le condizioni d'accesso per chi distribuisce i file del modello (è una lettura, non un parere legale).

## Parte B · Il motore nel programma

Come la parte B di `V-3-pocket-nel-programma.md`, punti 1–7, con il modello della parte A al posto del trucco. In breve:
1. Un secondo motore in Rust, con lo stesso binding a ONNX Runtime.
2. Il tokenizer provato token per token contro quello ufficiale.
3. Il normalizzatore di Kalliope.
4. Il ciclo di generazione ufficiale, con le correzioni di V-1 che servono ancora alla versione attuale. Misura quali.
5. La voce della persona: preparata a pezzi (sotto 1 GB), salvata, ricaricata.
6. Dove si usa:
   - `kalliope-cli`;
   - `engine.rs`: accanto a Giulia e Marco, con lo streaming nel microfono virtuale.
7. Non si tocca `crates/app/ui/`.
8. I file del modello in una cartella locale, niente pubblicato. Prepara `catalog.rs` solo senza indirizzi inventati.
9. ONNX Runtime all'ultima versione, con gli indici di `OrtApi` verificati.
10. L'elenco delle altre dipendenze non all'ultima, senza aggiornarle.
11. L'attribuzione in `THIRD_PARTY_NOTICES.md` e la documentazione.

Le prove sono quelle di V-3, «Prove (fino al verde)», da rifare tutte.

## Regole

Le regole sono quelle di V-3, più queste:
- **La memoria è stretta.** Al 19/11 ne restano libere circa 4 GB, e lo swap è quasi pieno, per programmi che non sono di
  Kalliope.
  - Un lavoro pesante alla volta.
  - Misura il picco di memoria di ogni passo pesante.
  - Se la memoria disponibile scende sotto 1,5 GB, aspetta prima di lanciare il passo successivo.
- **Niente cicli di attesa in background** (in V-3 il tuo ultimo è fallito con «claude native binary not installed» ed è stato
  fermato dal sistema): lancia, aspetta in primo piano, o controlla a mano.
- Le porte 8765, 8766 e 8767 sono del proprietario, anche se ora sono spente: non accenderle.
- **Nessun commit e nessun push**: li fa chi coordina.

## Consegna

Come in V-3, più:
- che cosa hai scaricato con l'account (file e revisioni);
- la conferma che la chiave non compare in nessun file.
