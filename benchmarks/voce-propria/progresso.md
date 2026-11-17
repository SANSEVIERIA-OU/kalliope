# V-m e V-1 · progresso

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
