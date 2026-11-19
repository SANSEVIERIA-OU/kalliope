# Incarico L-3 · Il logo scelto nel design system, nel sito e nei pacchetti

- **Chi coordina**: la sessione principale. Il proprietario non legge questo file.
- **Il ruolo**: costruzione (`vibe-next:design-build`) della skill `design-system-generator`, versione 0.49.0
  (`/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.49.0/skills/design-system-generator/`).
  - Leggi `SKILL.md`, `references/presidi.md`, `references/catalogo.md` e `references/direzione.md` §6: ciò che è stato
    scelto resta fermo, e il sistema cresce con il lavoro.
  - Si completa e si integra, non si ridisegna.
- **La decisione del proprietario** (19/11/2026): fra tre direzioni rese e giudicate ha scelto la **3, «La frase che si
  accende»**, com'è dopo la correzione: una bolla metà piena, la parte detta, e metà tratteggiata, quella non ancora detta.
  Poi ha detto di continuare lo sviluppo e di pubblicare il sito nuovo: quando questo lavoro è verde, il sito va in linea
  con il logo nuovo.

## Da leggere prima

1. `CLAUDE.md`.
2. `design-system/SISTEMA.md`, `design-system/TOKEN.md`, `design-system/token.css`, `design-system/componenti/barra.css`.
3. La direzione scelta, che resta il termine di confronto: `design/lavoro/L-logo/direzioni/3-frase/`.
   - `idea.md`;
   - i disegni `disegno.svg`, `piena.svg`, `simbolica.svg`, `piccola.svg` e `modelli/`;
   - `token.css`, `marchio.css`, `marchio.js`;
   - le foto e le sequenze in `sequenze-2/`.

   Il generatore è `design/lavoro/L-logo/strumenti/genera.py`; `strumenti/prepara-sito.py` mostra come la prova ha messo il
   logo in una copia del sito, comprese le chiamate aggiunte a `scena.js`.
4. Il giudizio: `design/lavoro/L-logo/giudizio/giudizio.md`, sezione «Secondo sguardo», e `riassunto.md`.
5. Le regole delle icone: `design/lavoro/ricerca/logo.md`.

## Che cosa costruire

1. **Un disegno solo, nel design system.**
   - Il logo entra in `design-system/`, per esempio in `design-system/marchio/`:
     - le sue forme, cioè quella libera, la piena, la simbolica e la piccola per 16 e 24 px;
     - il componente della barra, con il suo CSS e il suo script;
     - i suoi token, con nomi per ruolo, in `token.css` e in `TOKEN.md`.
   - Le forme si ricavano dai token con un generatore che sta nel repository, in `tools/` o in `design-system/`, non in
     `design/lavoro/`. Una prova deve fallire se i file generati non corrispondono più ai token, come fa
     `translations.py extract --check`.
   - Nessuna copia a mano.
   - Il verde del logo di prima, unica eccezione ai colori del sito (`design/direzione-2/D2.md`), se ne va.
2. **Il sito.**
   - **Nessuna pagina scrive il disegno a mano.** Oggi l'SVG è copiato dentro ogni pagina. La costruzione
     (`tools/site.py`) lo mette nella barra di tutte le pagine dalla fonte unica:
     - la home e le pagine nuove;
     - la scelta della lingua;
     - le pagine vecchie ancora da rifare: ascolta, installa, in riunione, aiuto, 404 e `sistema/`.

     Il nome «Kalliope» accanto resta un testo da tradurre.
   - **L'icona della scheda**:
     - l'SVG dalla forma piccola, più un `favicon.ico` 16, 32 e 48 ricavato dalla stessa fonte, perché Google e Safari prima
       della 26 non leggono l'SVG (`ricerca/logo.md`);
     - i `<link rel="icon">` in tutte le pagine, scritti dalla costruzione;
     - via `website/immagini/icona.svg`, la bolla verde.
   - **Il logo nella barra vive con la voce della home**, come nella prova. Le chiamate da `scena.js` si integrano bene, non
     come una toppa. Movimento ridotto e pagina senza JavaScript hanno il loro ripiego: il logo fermo.
   - **I difetti noti del giudizio, da correggere** (`direzione.md` §6: nella scelta si correggono soltanto quelli):
     - all'arrivo il logo non è mai una bolla vuota tutta tratteggiata. Dall'istante zero è la sua forma a riposo, la stessa
       dei menu, metà detta e metà no. D2: «0,00 s: fondo, barra e logo sono già dipinti»;
     - a fine frase torna alla forma a riposo, non resta una bolla piena qualunque per secondi;
     - se senza cambiare il disegno si può, la metà tratteggiata a 16 px sullo scuro non deve sparire: altrimenti scrivilo.
3. **Il catalogo vivo**, una sezione «Il marchio» in un suo file, come gli altri `catalogo-*.js`. Contiene:
   - tutte le forme e le grandezze da 16 a 256, su chiaro, su scuro e sul bordeaux;
   - la barra con e senza il nome;
   - il movimento con «Riproduci» e «Ferma», e il movimento ridotto;
   - la pagina da destra a sinistra, dove il logo non si specchia;
   - l'icona della scheda.

   `SISTEMA.md` dice dove sta e come si usa.
4. **I pacchetti Linux.**
   - `packaging/linux/io.github.sansevieria_ou.kalliope.svg` diventa la forma libera generata dalla fonte unica.
   - Si aggiunge la simbolica, `…-symbolic.svg` in `hicolor/symbolic/apps`.
   - Se si possono ricavare dalla stessa fonte in modo ripetibile, anche i PNG 48 e 256 in `hicolor/<n>x<n>/apps`: la
     specifica freedesktop chiede almeno un 48×48.
   - `build-packages.sh`, il PKGBUILD e lo spec li installano.
   - **La finestra del programma non si tocca**: l'icona della finestra in Slint arriva con la proposta dei valori per Slint
     (`CLAUDE.md`, «Il design system vale anche per l'applicazione»). Scrivilo fra ciò che resta.

## Prove (fino al verde)

- **Gli strumenti**:
  - `translations.py extract --check` e `check`;
  - `css_logico.py`;
  - `test_translations.py`, più le prove nuove del generatore, comprese una che fallisce su una copia guastata e una che
    fallisce sul codice di prima;
  - `controlla-sorgenti.mjs` verde: valori solo nei token;
  - `version.py check`.
- **Il sito vero e il sito in dieci lingue**: il secondo da una copia, con i `.po` di prova di
  `design/lavoro/2-lingue-aspetto/prova-lingue/`, più `--pseudo`. Il catalogo si apre senza errori.
- **Ogni pagina costruita**, a 1440, 768 e 390, anche `ar-XB`:
  - la barra con il logo nuovo, foto guardate;
  - 0 errori in console, 0 richieste fallite;
  - l'icona della scheda presente in SVG e in ICO.
- **Il movimento**, con `sequenza.mjs`:
  - l'arrivo della home a 1440 e 390, e la barra ingrandita, con le correzioni dei difetti noti;
  - il movimento ridotto.
- **Il confronto con la scelta**: `confronta-scelta.mjs` o un confronto di foto. Barra e logo come nella direzione 3
  corretta, salvo le differenze volute, dichiarate con il motivo.
- **I pacchetti**: `build-packages.sh` e `test-packages.sh` qui. Gli artefatti di ONNX Runtime e dei modelli si prendono
  con `tools/fetch_assets.py`, dalla release vera `assets` che ora esiste. Le icone devono essere installate nei posti giusti
  e tolte alla rimozione.

## Regole

- **Area tua**:
  - `design-system/` e `website/`, solo per il logo, l'icona della scheda e le chiamate del movimento;
  - `tools/site.py` e il generatore nuovo, con le loro prove;
  - `packaging/linux/` e `packaging/aur/`, solo per le icone;
  - `design/lavoro/L-logo/costruzione/` per `progresso.md` (aggiornato a ogni unità finita), esiti e foto.
- **Non toccare**:
  - la direzione scelta, `design/lavoro/L-logo/direzioni/3-frase/`, che è il termine di confronto;
  - `crates/` e il resto di `design/`.
- **Nessun commit e nessun push.** Nessun altro agente. Niente account, niente pubblicazioni.
- **La memoria è stretta**:
  - un browser o una compilazione alla volta;
  - prima controlla `free -m`: sotto 1,5 GB disponibili, aspetta;
  - niente cicli di attesa in background.
- **Lo schermo**: mai finestre su `DISPLAY :0` o `wayland-1`. Solo browser senza finestra.
- **Porte**:
  - 8765–8767 sono del proprietario, e 8770 è la pagina della scelta del logo: non toccarla;
  - le tue sono 8960–8969.
- **Le dipendenze**: sempre l'ultima versione, verificata oggi. Playwright è quello indicato in
  `design/lavoro/L-logo/strumenti/env.sh`.
- WCAG non è un obiettivo né una soglia (`CLAUDE.md`).

## Consegna

Nella risposta finale e in `progresso.md`:
- dove sta il logo nel sistema e come si genera;
- che cosa è cambiato nel sito, nel catalogo e nei pacchetti;
- i difetti noti corretti, con le foto e le sequenze;
- gli esiti delle prove con i numeri;
- le differenze dalla scelta, dichiarate;
- ciò che resta, per esempio l'icona della finestra in Slint, e ciò che non hai verificato.
