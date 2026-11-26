# Incarico V-1 · Il motore che imita la voce: renderlo affidabile prima di costruirlo

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Le decisioni del proprietario** (17/11/2026): dopo l'ascolto dei campioni ha scelto «Strada 1», il motore che imita la
  voce dalla registrazione (Pocket TTS). Alla proposta di lavoro ha dato il via al **punto 1**: «Prima lo rendo affidabile
  (prove, senza toccare il programma): la prima parola persa, il peso, la memoria». Il programma (`crates/`) **non si tocca**:
  il punto 2 (metterlo nel programma) avrà il suo via.
- **Chi lo fa**: lo stesso incaricato della misura V-m, che conosce già il banco di prova.
- **Area tua**: `benchmarks/voce-propria/` (programmi, `README.md`: una sezione nuova «Rendere affidabile Pocket TTS»,
  esiti in JSON, `progresso.md` aggiornato a ogni unità finita) e `/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/` per i dati
  pesanti.

## Che cosa fare

1. **La prima parola persa o storpiata** (14 frasi su 30 con 24 strati, 15 su 30 con 6; Klein 0). Trova la causa, non un
   rimedio a valle: confronta il ciclo di generazione dell'esportazione ONNX che usiamo con il codice ufficiale di Kyutai
   (repository `kyutai-labs/pocket-tts`, MIT: preparazione del testo, condizionamento sulla voce, primi passi, scarto dei
   primi fotogrammi, divisione in pezzi dello streaming, fine frase). Se la causa sta nell'esportazione o nel modo in cui la
   usiamo, correggila lì; se sta nel modello, cerca nel codice e nella documentazione ufficiali come lo gestisce Kyutai.
   Traguardo: nessuna parola persa all'inizio sulle 30 frasi delle quattro persone, e su un insieme più largo di frasi brevi
   (una o due parole, che in riunione sono frequenti: «Sì.», «Grazie.», «Un attimo.»), con Whisper e controllando le
   durate.
2. **Il peso mentre parla.** Scegli, misurando, la combinazione che parla meglio **senza far aspettare** su un computer
   modesto: pacchetto a 6 o a 24 strati, int8 o fp32 per ogni parte, numero di thread (2 e 4), dimensione dei pezzi dello
   streaming. Per ciascuna: tempo al primo suono, se lo streaming tiene il passo (mai un vuoto mentre parla), secondi di
   CPU per secondo di parlato, parole sbagliate, somiglianza (ECAPA e WeSpeaker, come in V-m). Scrivi quale tiene il passo a
   2 thread su questa macchina con il carico che c'è, e con quale margine.
3. **La memoria.** Oggi codificare 25 s di riferimento arriva a 4,6–5 GB, e parlare a 2,2 GB (24 strati) o 844 MB (6 strati).
   Trova da dove viene (codifica di tutto il riferimento in un colpo, arene di ONNX Runtime, precisione) e portala a un
   livello che un portatile con 8 GB regge insieme al resto: codifica a pezzi, riferimento più corto se la somiglianza
   regge (prova 10, 15, 25 s), impostazioni di ONNX Runtime. La voce della persona si prepara una volta e si salva: misura
   anche quanto pesa il file salvato e quanto ci mette a ricaricarsi.
4. **La pronuncia italiana dopo le correzioni**: le parole sbagliate senza le perdite iniziali, e che cosa resta (numeri,
   sigle, accenti), con il testo che esce dal normalizzatore di Kalliope.
5. **L'ascolto**: aggiorna la pagina d'ascolto con una sezione «prima e dopo» per le quattro persone (le stesse frasi, la
   combinazione scelta), così che il proprietario senta la differenza.

## Che cosa consegni

Nella sezione nuova del `README.md` e nella risposta finale: la causa della prima parola persa e la correzione, con i numeri
prima e dopo; la tabella delle combinazioni del punto 2 e quella scelta, con il motivo; la memoria prima e dopo; ciò che resta
nella pronuncia; ciò che non hai potuto misurare. Se un traguardo non si raggiunge, dillo con i numeri e con che cosa servirebbe.

## Regole

Le stesse di V-m (`design/lavoro/incarichi/V-misure-voce.md`, «Regole»): il programma non si tocca; nessun commit, nessun
push, nessun altro agente; niente account; file scaricati in cartelle proprie e Python con `-I` quando li legge; cartelle
temporanee `/tmp/voce-m-*`; porte 8900–8909 solo per provare la pagina (la 8767 la serve chi coordina al proprietario, dalla
cartella `ascolto/`: aggiornala sul posto). La macchina è condivisa con un ruolo di costruzione del sito (browser): un
modello pesante alla volta, misura il tempo di CPU e scrivi il carico.
