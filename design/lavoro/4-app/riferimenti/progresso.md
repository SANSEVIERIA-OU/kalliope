# Progresso: riferimenti per la finestra dell'applicazione (issue #13)

Avvio 26/11/2026 16:58 UTC, chiusura 17:50 circa (budget 75 minuti, usati circa 52).
Posto Chrome: l'incarico non scriveva un nome di posto; ho usato `isolatedContext` = `riferimenti-app` sul Chrome della skill (porta 29804, Chrome 158.0.8127.88, schermo virtuale, grafica in software, audio virtuale). Pagine tutte chiuse a fine lavoro (`list_pages`: resta solo `about:blank` non mio).

## Stato (tutto fatto)
- [x] 1 Proloquo4Text: pagina, video, 14 schermate dello store (iPad, iPhone, Mac), pagine di supporto → `proloquo4text.md`
- [x] 2 Predictable: pagina, 20 schermate, video alternativo di 4:09 (quello della ricerca è stato rimosso) → `predictable.md`
- [x] 3 Apple Live Speech e Personal Voice: supporto 105018 e 104993, 3 immagini ufficiali → `apple-live-speech-personal-voice.md`
- [x] 4 Vocable: pagina, 4 immagini, 2 video → `vocable.md`
- [x] 5 Cboard: usata dal vivo (mouse e tastiera) → `cboard.md`
- [x] 6 Grid 3: 2 pagine, 4 immagini → `grid3.md`
- [x] 7 Flussi di voce: ElevenLabs IVC → `elevenlabs-ivc.md`; Acapela My Own Voice → `acapela-my-own-voice.md`
- [x] 8 Speechify → `speechify.md`
- [x] Sito di Kalliope (valori.js, demo misurata) → `sito-kalliope.md`
- [x] Finestra di Kalipso (foto locali) → `finestra-kalipso.md`
- [x] `confronto.md` (+ `osservazioni.json`, `confronto.json`, `strumenti/osservazioni.py`)
- [x] `giudizio-riferimenti.md` (schede A-D di `giudizio.md`)
- [x] Base estetica: `base-misurata.json` (Cboard + sito di Kalliope, dal DOM) e `base-con-stime.json` (7 riferimenti; palette stimate dai pixel di schermate, cartella `valori-da-schermate/`, strumento `strumenti/palette.py`)

## Controlli
- `node confronta-riferimenti.mjs --controlla osservazioni.json` → «Formato pulito» (24 caratteristiche × 11 riferimenti).
- `base-estetica.mjs`: `base-misurata.json` 2 riferimenti, 5 misure; `base-con-stime.json` 7 riferimenti, 15 misure.

## Limiti e problemi aperti (anche in `confronto.md`, sezione 6)
- ⚠ Nessun avviso `⚠` di `passo.mjs`: non l'ho usato (solo Chrome MCP, come da incarico). Grafica in software e macchina condivisa: i tempi dei video sono anche della macchina.
- Nove riferimenti su undici non sono l'app in uso (otto da schermate e filmati ufficiali di marketing, uno da foto di prova). Il movimento è misurato solo su Cboard e sul sito di Kalliope.
- Predictable: video della ricerca rimosso; video alternativo a tagli, non misurato. Il primo tentativo di riproduzione con salto a 0 s ha dato «Something went wrong».
- Apple: nessuna immagine ufficiale della finestra Live Speech del Mac. **Da chiedere al coordinatore al ruolo di ricerca:** `WebSearch` è stato bloccato da un hook («Delegate this research to vibe-next:research»); io non spawno agenti. Fonte mancante: schermata ufficiale della finestra «Live Speech» su macOS (guida utente Apple o newsroom).
- ElevenLabs: schermate di registrazione e caricamento non pubbliche (serve un account: non creato). Acapela: registratore in uso non provato (serve un accesso concesso).
- Cboard: sblocco a tre clic non riuscito con i clic dello strumento; tema scuro dopo «SAVE» non applicato (esito non chiaro); letture del fuoco da tastiera incoerenti.
- Nessun suono registrato in nessun riferimento; nessun test con movimento ridotto, telefono o zoom del testo (salvo le foto di Kalipso).
- Le palette degli otto riferimenti non misurati sono stime dai pixel: da non trattare come misure. I ritagli di Grid 3 e Apple non sono affidabili e non sono nella base.
- Lo strumento di base dà `#f2f5f4` e `#222222` «in tutti» (2 riferimenti) o «in 6» (con le stime): effetto della soglia OKLab sui grigi, non identità.

## Ultimo comando
`node base-estetica.mjs base-con-stime --uscita base-con-stime.json` (17:49).
- `video/pred-video.mp4` e `foto/pred-02-video.png` sono la prova negativa del video rimosso (pagina «Video unavailable»), da non usare come materiale.
