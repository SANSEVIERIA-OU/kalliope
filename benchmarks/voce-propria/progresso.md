# V-m · progresso

Incarico: `design/lavoro/incarichi/V-misure-voce.md`. Dati pesanti: `/workspace/nomedadefinire/bench/voce-propria/`.

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
