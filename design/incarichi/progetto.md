# Incarico: scheda del progetto e piano della ricerca (attività `project` + `research-plan`)

Leggi prima `design/incarichi/comune.md`. Ruolo: vibe-next:design-build.

## Scopo
1. Scrivere `design/progetto.md` secondo `<skill>/references/progetto.md`: cosa fa Kalliope, come, perché;
   persone e contesti; superfici; piattaforme e motori; regole e conseguenze; esito utile; vincoli e confini;
   i percorsi principali del **sito** (persona → bisogno → ingresso → azioni → regole → esito → errore/recupero →
   perché serve). La scheda descrive il prodotto e il sito da fare, senza colori, font o forme.
2. Scrivere `design/ricerca/piano.md` secondo `<skill>/references/metodo.md` §2 e `references/riferimenti.md`:
   quali compiti e competenze di design studiare, quali categorie Webby cercare e perché (nomi da verificare
   nel catalogo ufficiale dai ricercatori, non inventati), quanti riferimenti servono per coprire i compiti,
   le domande precise a cui ogni visita deve rispondere. Indica 2 gruppi di ricerca indipendenti (query
   diverse) da dare a due ricercatori.

## Fonti (leggile, non fidarti solo di questo riassunto)
- `README.md`, `CHANGELOG.md`, `docs/virtual-microphone.md`, `docs/releasing.md`, `NOTICE`,
  `THIRD_PARTY_NOTICES.md`, `crates/app/ui/app.slint` (la finestra), `crates/app/src/main.rs`,
  `packaging/linux/*.metainfo.xml`, `packaging/linux/io.github.sansevieria_ou.kalliope.svg` (icona dell'app).
- Release di prova pubblicata: https://github.com/SANSEVIERIA-OU/kalliope/releases/tag/v0.1-rc.1
  (.deb, .rpm, .tar.gz, PKGBUILD AUR, SHA256SUMS).
- Materiale già pronto per il sito: `site/voce/{giulia,marco}-{1,2,3}.mp3` (voce vera di Kalliope, 24 kHz) con i
  testi scritti esattamente così:
  1. «Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo.»
  2. «Sono d'accordo con Paola. Però la consegna del 14/3 mi sembra stretta: possiamo sentirci venerdì alle 15:30?»
  3. «Il preventivo è di 1.250 € + IVA, valido fino al 31 dicembre.»
  (Whisper le trascrive con circa 1 errore su 45 parole.) `site/immagini/kalliope-finestra.png`: foto vera della
  finestra pronta (640×500).

## Fatti decisi dal proprietario (vincoli, con fonte: conversazione con l'utente, 2026)
- Kalliope fa parlare nelle videochiamate chi è muto o ha difficoltà a parlare: scrive, e un microfono virtuale
  locale («Kalliope») pronuncia il testo con voce naturale; gli altri partecipanti sentono la voce come se
  parlasse la persona. Tutto sul computer della persona: niente server, niente account, il testo non esce.
- Prodotto di SANSEVIERIA OÜ, licenza SANSEVIERIA 1.0 (codice sorgente disponibile). Italiano prima.
- Stato reale da dire con onestà: 0.1-rc.1, solo Linux x86_64 con PipeWire. Provato end-to-end con PipeWire
  privato (Whisper: 2,3% di parole sbagliate), **non ancora** provato con Zoom/Teams/Meet su un desktop reale.
  Windows e macOS: compilano, ma il microfono virtuale richiede un driver firmato / account Apple, non ancora.
- Voce scaricata al primo avvio: 53 MB, una volta, con verifica delle impronte; poi offline. Due voci: Giulia e Marco.
- Misure (Ryzen 5 PRO 6650U): finestra 10,6 MB di RAM, 0% CPU a riposo; con voce ~117 MB; ~0,07 s di CPU per
  secondo di voce. Clonazione della propria voce: non c'è (forse in futuro, solo con consenso).
- Sito su GitHub Pages: https://sansevieria-ou.github.io/kalliope/ , cartella `site/`, statico, senza passi di
  build né dipendenze npm (principio del progetto: zero dipendenze). Nessuna richiesta a terzi (niente font
  remoti, CDN, statistiche, cookie): coerente con la promessa di privacy. I dati della release (versione, nomi e
  link dei pacchetti, dimensioni) li inserisce al deploy uno script del coordinatore (`tools/site.py`) al posto di
  segnaposto: il sito non deve scriverli a mano.
- Accessibilità massima: il pubblico comprende persone con SLA/malattie neuromuscolari (tastiera, sensori,
  puntamento oculare), afasia dopo ictus (testi semplici), laringectomia, disartria, balbuzie, mutismo
  selettivo/autismo, sordità; familiari e logopedisti che spesso leggono dal telefono. Lettori di schermo
  (Orca, NVDA, VoiceOver). Nessun obbligo di JavaScript.

## Risultati
- `design/progetto.md`, `design/ricerca/piano.md`, `design/incarichi/progetto/progresso.md`.
- Nella risposta finale: 10 righe al massimo con le scelte del piano e i dubbi che cambiano lo scopo.

## Completezza
La scheda è pronta quando un'altra persona sa spiegare cosa succede nel prodotto e nel sito, e perché, senza
citare aspetto. Il piano è pronto quando due ricercatori possono partire senza altre domande.
