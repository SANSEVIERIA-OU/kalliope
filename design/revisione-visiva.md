# Revisione visiva del primo percorso (cancello di `references/direzione.md` §5)

Data: 12/11/2026, 21:42-22:10. Ruolo: vibe-next:design-visual, attività `visual-qa`. Revisione **indipendente** dell'autovalutazione
`design/prove-percorso/revisione-qualita.md`: la conferma o la smentisce punto per punto più sotto. Non ho modificato `site/`.
Anteprima giudicata: `python3 -I tools/site.py --out /tmp/kalliope-rev --release-json /tmp/sitetest/releases.json` (costruita 21:42;
`site/` non è cambiato fino alle 22:08; md5 `index.html` 544a7abb…, `componenti.css` 9cab47f7…, `kalliope.js` faa59415…).
Foto, sequenze e misure: `design/prove-percorso/revisione/` (percorsi sotto). Gli script che le hanno prodotte: `revisione/_lavoro/`.

## 1. Copertura e limiti della prova

| Motore | Misura / stato | Che cosa ho fatto | Strumento |
|---|---|---|---|
| Chromium | 1440×900 | arrivo → Ascolta (avvia, cambia voce, ferma, dettagli) → Stato → Installa (scelta distribuzione, copia, «Se ti sei fermato qui») → In riunione → Aiuto (filtro, nessun risultato) → Non ancora → 404; tutte le schermate di ogni pagina | `passo.mjs` posto leggero, senza finestra |
| Chromium | 1440×900 | tastiera da sola (Tab sulla home, Invio sul comando, Invio/Spazio sull'ascolto); movimento ridotto; testo 200%; colori forzati; tema scuro | `passo.mjs avvia --ridotto/--carattere=200/--colori-forzati/--scuro` |
| Chromium | 430×932 (telefono di `passo.mjs`) | home, ascolto con tocco | `passo.mjs avvia mobile` |
| Chromium | **390×844** | tutte le pagine, tutti i segmenti, ascolto, copia, filtro, misure | script Playwright (dopo `libera`) |
| Chromium | 1440 e 390 | senza JavaScript: Ascolta, Installa, Aiuto; banner Windows/macOS | script Playwright |
| Firefox 150 | 1440×900 e 390×844 | primo schermo di ogni pagina, ascolto, scelta, copia, filtro, misure | script Playwright (`PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`) |
| WebKit | 1440×900 e 390×844 | come Firefox, con il limite qui sotto | script Playwright |

Limiti che valgono per ogni giudizio (⚠ riportati come limiti della prova):

- **Il suono non è stato ascoltato né cronometrato.** In Chromium senza finestra l'audio scorre a velocità enorme (`play` da 0 a 9,29 s in pochi
  millisecondi: `_lavoro/u04.sh`). Gli stati dell'ascolto (barre, frase evidenziata, posizione, «Ferma», un solo suono per volta) li ho visti con
  un orologio simulato (`_lavoro/orologio.js`, la stessa tecnica di `design/strumenti/prova-ascolto.mjs`): provano l'interfaccia, non la voce,
  né il ritardo, né la fluidità delle barre a velocità vera. Il movimento delle barre è quindi **non verificato a tempo reale**.
- **WebKit preparato non regge nessun elemento audio con una sorgente**: anche `new Audio()` con `src` su una pagina senza audio la fa smettere di
  rispondere («Target crashed», prove in `_lavoro/wk-prova4.log` e `wk-prova5.log`; senza JavaScript la home si blocca allo stesso modo). Non è un
  difetto del sito. Home e Ascolta in WebKit sono viste togliendo `src` dagli `<audio>` (`giro-motore.mjs`) e con l'orologio simulato: **l'audio nativo
  di WebKit e il ripiego senza JavaScript in WebKit non sono visti.**
- `passo.mjs` offre solo il telefono 430×932: il 390×844 chiesto è fatto con Playwright, non con i gesti uno alla volta (le foto e le misure ci sono; i
  gesti sul 390×844 sono quelli dello script, con `tap()`).
- Firefox e WebKit: solo il primo schermo di ogni pagina e i gesti; il resto è confrontato con le misure (altezze di pagina entro il 4% da Chromium sul computer e fino al 7% su WebKit a 390 px per il carattere diverso, nessuna
  sporgenza orizzontale, nessun errore di console tranne il 404 voluto).
- Il banner «Stai usando un telefono» in Firefox/WebKit non compare perché Playwright non cambia `navigator.platform` (resta Linux): artefatto della prova.
- Nessuna prova su telefono, tablet, lettore di schermo o hardware veri. Non ho aperto la stampa (D10) né le pagine `sistema/`.

## 2. Giudizio d'insieme

**Riconoscibilità: media, e concentrata nei contenuti più che nella forma.** Coprendo nome e logo, la pagina iniziale a 1440×900
(`chromium-1440/001-vai.jpg`) non si scambia con R50/R51/R52 né con una vetrina generica **per tre cose**: il cartellino «Provato / Non ancora
provato / Non esiste» con tre bordi diversi (pieno, tratteggiato, punteggiato) e ✓ ? × nello stesso schermo della proposta; la coppia «Tu scrivi»
(spaziatura fissa) contro «Kalliope dice» con le cifre sottolineate (`chromium-1440/002-scorri.jpg`); la pagina Aiuto fatta con le frasi della finestra
(`chromium-1440/048-vai.jpg`). Sono cose che solo questo prodotto fa. **Quasi tutto il resto è una documentazione ben fatta**: carattere di sistema
(`system-ui`: su questa macchina DejaVu Sans, su altre Segoe UI o Roboto: la forma cambia da un computer all'altro), titoli neri in grassetto, riquadri
con angoli tondi, carta quasi bianca (`--carta` #f8f6f0) e un verde scuro. La «carta» del nome non si vede (nessuna texture, filetto o ritmo che non siano un fondo
appena caldo); la «voce» sono cinque barre piccole nel cartellino e accanto ai pulsanti. Senza il cartellino e la coppia scritto/detto, Stato, Riunione,
Aiuto e Non ancora sono intercambiabili con la guida di qualunque programma Linux. È ordinato e sobrio (qualità alta), poco espressivo (voluto, ma al
limite: vedi I3).

**Il momento che una persona ricorderebbe** (A1, scritto contro detto, e l'evidenziazione della frase che segue la voce, `chromium-1440/009-clic-testo-seq-04.jpg`)
**non è nel primo schermo né in quello dopo**: sta a y≈1100 sul computer e a y≈2170 sul telefono, mentre l'immagine più grande della prima schermata è
la foto della finestra, per due terzi vuota e con testo di 9 px (`chromium-1440/001-vai.jpg`, `chromium-390x844/m-home-01.jpg`).

**Verdetto sul cancello**: il percorso è completo, onesto e quasi sempre chiaro; **non lo mostrerei al proprietario prima di correggere i due
punti bloccanti (§3)**, entrambi di basso costo. Gli importanti (§4) sono da correggere prima di estendere le regole alle altre superfici.

## 3. Cosa blocca la presentazione al proprietario

### B1. Aiuto, ricerca senza risultato: il messaggio rimanda a un elenco vuoto
- **Dove / come**: `/aiuto/`, scrivere «zzzxyz» nel campo. Chromium 1440×900 (`chromium-1440/062-scrivi.jpg`), Chromium 390×844
  (`chromium-390x844/m-gesti-01.jpg`, secondo riquadro); stesso esito in Firefox e WebKit a 1440 e 390 (`firefox-*/misure.json`, `webkit-*/misure.json`, `gesti.aiutoNessuno.articoliVisibili = 0`) e nel DOM di Chromium 1440 letto con `valuta`.
- **Che cosa si vede**: «Nessuna frase trovata. **Leggi l'elenco qui sotto**, scrivi meno parole, oppure segnala il problema.» Sotto: il titolo «Le frasi della
  finestra» senza nulla, il titolo «La mia frase non c'è» senza nulla, poi «Segnala un problema…». Nel DOM le tre carte di ripiego sotto «La mia frase non c'è»
  hanno `hidden` (il filtro le nasconde come le altre).
- **Perché è un problema, per chi**: è la decisione D09 («nessun risultato con tre passi») e l'ambizione A3. Succede nel momento di bisogno (F1 in una
  riunione, F2 che aiuta): la sola via d'uscita rimasta è un pulsante GitHub che richiede un account. Il testo contraddice lo schermo.
- **Proposta**: la sezione «La mia frase non c'è» non fa parte del filtro (resta sempre visibile e, a zero risultati, sale subito sotto il messaggio); con
  zero risultati si nascondono anche i titoli senza contenuto e il messaggio dice dove andare («Prova una parola sola, per esempio «pronta» o «scarico». Oppure
  guarda i tre casi qui sotto»). Lo stato «4 frasi» con 3 voci nell'indice (`misure.json` `aiutoPronta`) va allineato: conta lo stesso insieme che mostra.

### B2. Telefono: il primo schermo non mostra lo stato prima della promessa
- **Dove / come**: home, Chromium 390×844 (`chromium-390x844/m-home-01.jpg`, `home-s01.png`), 430×932 (`chromium-390/001-vai.jpg`). Misure in `misure-extra.json`.
- **Che cosa si vede** (misure, 390×844): l'avviso «Stai usando un telefono o un tablet…» occupa y 186-435 (249 px); il titolo è a 475-542; «Ascolta la voce»
  a 824-874, **tagliato dal bordo a 844**; «Scarica e installa» a 882-933, **fuori dal primo schermo**; il cartellino comincia a 1421 e «Non ancora provato»
  a 1740. A 360×740 le stesse quote sono 858 (comando), 1431 e 1774. Il primo schermo non ha nessun comando intero e nessuna riga di stato oltre all'avviso.
- **Perché è un problema, per chi**: RG4 e A2 («lo stato prima della promessa, nella stessa schermata, senza ritardo») valgono per F2, che legge **dal telefono**
  e inoltra il collegamento: sul telefono «Scarica e installa» precede «Non ancora provato» di 860 px, il contrario di ciò che la direzione dichiara. L'autovalutazione
  dice «a 390×844 compare sotto i comandi»: vero, ma non nella stessa schermata. Sul computer la promessa regge (cartellino a 575-882 su 900).
- **Proposta**: avviso del telefono su una riga («Questo sito si legge dal telefono, ma Kalliope serve un computer Linux. Perché: Non ancora») con «Chiudi» al lato e margini
  uguali al contenuto; subito sotto il titolo una riga di stato breve («Versione di prova. Non ancora provata in una riunione vera.»); il cartellino prima della foto
  della finestra (la foto occupa 340 px sul telefono) o, meglio, la foto sostituita dalla coppia scritto/detto (vedi I3). Su un computer 1280×720 il cartellino è tagliato
  a metà colonna (`misure-extra.json`, `pc1280`: 575-882 su 720): accettabile solo se resta la riga di stato sopra la piega.

## 4. Difetti importanti (correggere prima di estendere le regole)

### I1. Ascolta: fascia vuota di 74 px sopra il titolo di ogni riquadro
- Pagina `/ascolta/`, ogni motore e misura: `chromium-1440/011-scorri.jpg`, `016-clic.jpg`, `chromium-390x844/m-ascolta-01.jpg` (terzo riquadro), `chromium-1440-forzati/004-ascolta-forzati.jpg`,
  `firefox-1440x900/m-quattro.jpg`, `webkit-1440x900/m-quattro.jpg`.
- Si vede un vuoto fra il bordo del riquadro e «Frase N di 3». Misura (`misure-extra.json`, `cardAscolta`): `h2` con `margin-top: 48px` più 24 px di spaziatura interna = 74 px dal bordo.
  Sulla home lo stesso riquadro ha il titolo a circa 24 px dal bordo, cioè la sola spaziatura interna (`chromium-1440/002-scorri.jpg`): il componente non è identico fra le due pagine.
- Si legge come un elemento mancante, sulla pagina che porta l'ambizione A1; sul telefono costa 74 px × 3 riquadri. **Proposta**: `margin-top: 0` sul primo figlio del riquadro (un solo titolo per riquadro, stesso aspetto sulla home e su Ascolta).

### I2. Ascolta: nessun comando di ascolto nel primo schermo
- Misure (`misure-primo-schermo.json`): il primo «Ascolta Giulia» è a y 920 a 1440×900, 918 a 1280×720, **1325 a 390×844** (1,6 schermi). Foto: `chromium-1440/010-vai.jpg`, `chromium-390x844/m-ascolta-01.jpg`.
- Il primo schermo della pagina «Ascolta la voce» contiene due paragrafi, un riquadro «Se non puoi ascoltare» (utile) e il titolo del primo riquadro; il pulsante sta alla piega. Sul telefono, 318 px sono navigazione (vedi I4).
- **Proposta**: accorciare l'introduzione a una frase, mettere «Se non puoi ascoltare» dopo il primo riquadro (o ridurlo a una riga con «testo qui sotto»), così che il primo pulsante stia entro 700 px.

### I3. Home: l'ambizione A1 sta sotto il cartellino e l'immagine più grande non la mostra
- Foto: `chromium-1440/001-vai.jpg` (primo schermo), `002-scorri.jpg` (ascolto a y≈1095-1620); `chromium-390x844/m-home-01.jpg` (coppia scritto/detto a y≈2170).
- La foto della finestra (640×500, area vuota per due terzi, testo a 9-11 px) è l'elemento più grande e meno informativo del primo schermo, sul computer e sul telefono; è anche l'unico «prodotto» mostrato. A1 («chi ha ascoltato ricorda che le cifre erano parole») compare solo dopo uno schermo di scorrimento e senza che nessuno dica che esiste.
- **Proposta**: nel primo schermo mettere la coppia «Tu scrivi: 14/3 → Kalliope dice: quattordici marzo» con il pulsante «Ascolta» (una frase, una voce), come hanno già l'ascolto e il cartellino; la foto della finestra più piccola, sotto, o nella pagina In riunione dove spiega il comando. È ciò che renderebbe il sito riconoscibile a colpo d'occhio.

### I4. Doppia navigazione in cima a ogni pagina del cammino
- Pagine Ascolta, Stato, Installa, In riunione, Aiuto: la barra con cinque voci **e** il percorso a cinque tappe con le stesse parole (`chromium-1440/010-vai.jpg`, `048-vai.jpg`). Misura: 114 px a 1440×900; **318 px su 844 (38%)** a 390×844 (`misure-primo-schermo.json`, `chromium-390x844/m-ascolta-01.jpg`); a testo 200% la prima schermata di 900 px è quasi tutta navigazione (`chromium-1440-testo200/002-vai.jpg`: titolo a y≈550). In fondo c'è una terza serie (Indietro / Avanti).
- Titoli, testi e comandi dovrebbero dire cose diverse (§5.4): due barre con gli stessi cinque nomi no. **Proposta**: il percorso numerato sostituisce la barra principale sulle pagine del cammino (o la barra principale si riduce a marca + «Aiuto» e menu), oppure il percorso diventa una sola riga «Passo 2 di 5: Stato e limiti» sul telefono.

### I5. Installa: lunga, e «scegli la distribuzione» non scegli nulla
- `/installa/` è alta 9348 px (1440) e 12439 px (390). Le quattro voci «Debian e Ubuntu / Fedora / Arch / Altre» sono àncore: il clic porta alla carta e le dà un bordo più spesso (`chromium-1440/039-clic.jpg`), ma i passi 2 (controllo) e 3 (installa) ripetono comunque tutti i blocchi (`chromium-1440/031`-`033-scorri.jpg`): chi ha Fedora attraversa circa 2000 px di altre distribuzioni.
- Il primo gesto (scaricare) sta a y 1335 sul computer e **2207 sul telefono** (`misure-primo-schermo.json`), dopo cinque requisiti.
- **Proposta**: scelta reale con miglioramento progressivo: con JavaScript la scelta mostra solo il blocco della distribuzione nei passi 1-3 e ricorda la scelta; senza JavaScript restano tutti, come ora (`stati-extra/m-senzajs-1440.jpg`: il ripiego funziona). Portare «Scarica» prima di «Cosa serve» con i requisiti in una riga (la verifica glibc è un controllo, non un prerequisito per il download).

### I6. Frasi lunghe e comandi dentro il testo, per chi legge con fatica
- `/riunione/` passo 3 «La finestra ti avvisa»: un paragrafo di sei righe, circa 65 parole, con una frase tra virgolette dentro e due negazioni (`chromium-1440/044-scorri.jpg`). RG8 chiede 15-20 parole e un'idea per frase.
- `/installa/` passo 2: «**Deve** scrivere questo numero:» (terza persona e «numero» per un'impronta di 64 caratteri, senza «Copia») dentro un testo in «tu» (`chromium-1440/031-scorri.jpg`).
- `/aiuto/` carta «Per scaricare… curl» e «Per togliere Kalliope» (`chromium-1440/050-scorri.jpg`, `dettagli-installa.png`): tre comandi dentro una frase, senza blocco né «Copia» come in Installa, e il comando va a capo a metà.
- **Proposta**: spezzare il passo 3 di Riunione in tre sottopassi con la stessa forma «cosa fare / come sai che è andata»; «Scrivi il numero che vedi: deve essere uguale a questo» con «Copia»; i comandi di Aiuto nello stesso componente di Installa.

### I7. Collegamenti da solo su una riga alti 19 px
- «Leggi tutto lo stato e i limiti» (221×19), «Scarica il file (MP3, 9,3 secondi)» (255×19): `misure-extra.json` `collegamentiSingoli`; Tab in `chromium-1440-tastiera/` (h=19). RG9 (bersaglio 44×44 con 8 px di distanza) è la regola del progetto per SLA, puntamento oculare e tremore. Gli altri comandi misurano 44 o più (`misure.json` `piccoli`: 0 su ogni pagina in Chromium 390×844, tolti i collegamenti dentro una frase o una cella di tabella). **Proposta**: stessa altezza minima di `.collegamento-forte` (44 px).

### I8. Home: l'ultimo invito ripete quello già fatto, e nessuno porta a Installa
- `chromium-1440/004-scorri.jpg`: dopo «Cosa serve», «Avanti: Ascolta la voce», cioè la sezione appena letta nella stessa pagina. Per chi ha letto tutto il successivo logico è Stato o Installa. **Proposta**: «Avanti: Installa» (o un secondo comando «Scarica e installa» a fine pagina).

### I9. Avviso del sistema più largo della colonna
- Home a 1440 con avviso Windows (`stati-extra/m-banner.jpg`): il riquadro va da x=100 a x=867, il contenuto da 116 a 852; sul telefono il riquadro tocca i bordi dello schermo (0-390, `misure-extra.json`) mentre il testo ha 16 px di margine (`chromium-390x844/m-home-01.jpg`). Causa probabile: la classe `pagina` (con la sua spaziatura) è sullo stesso elemento del riquadro. **Proposta**: riquadro dentro `.pagina`, non `.pagina` sul riquadro.

## 5. Difetti minori (possono aspettare)

- **M1.** `/ascolta/` frase 3: «Giulia · 6,0 secondi» ma la posizione dice «0:00 / 0:05» (Marco 6,4 e 0:06): due numeri per la stessa durata (`chromium-1440/012-scorri.jpg`, `misure-extra.json` `statoMeta`). In frase 3 la posizione sta accanto alle barre, nelle frasi 1-2 sotto. Proposta: arrotondare allo stesso modo; stessa riga per tutti i riquadri.
- **M2.** Piede, terza colonna: le voci a capo hanno distanze diverse (44 px poi 35 px: `chromium-1440/026-scorri.jpg`).
- **M3.** `/stato/` (5937 px): «Non ancora provato» nel cartellino e «Non provato» nella tabella per lo stesso stato; sul telefono sei schede identiche («In una riunione vera: Non provato») occupano circa 1300 px (`chromium-390x844/m-stato-02.jpg`). Proposta: una frase «Nessuna app è stata provata in una riunione vera» con la riga del menu di Zoom.
- **M4.** `/installa/`: il campo «Indirizzo di questa pagina» taglia l'indirizzo a «…/kalliope/insta» (`chromium-1440/036-scorri.jpg`); la ricetta Arch si scarica due volte (pulsante al passo 1, `curl -L -o PKGBUILD` al passo 3).
- **M5.** `/riunione/` finisce con la foto della finestra, 500 px alti per due terzi vuoti (`chromium-1440/046-scorri.jpg`).
- **M6.** `/404.html`: il nome «Kalliope» in intestazione è verde invece che nero (`chromium-1440/066-vai.jpg`) e il collegamento ha `href=""`; il colore sembra quello di `a:visited` (`base.css` riga 38, più specifico di `.marca`): non verificato. 404 e «Non ancora» sono corrette ma senza un segno di marca oltre all'icona (conferma l'autovalutazione); «Non ancora» è la pagina che molte persone leggeranno per prima (P6) e non ha il «Non esiste» del cartellino.
- **M7.** Colori forzati: «Ascolta la voce» e «Scarica e installa» si distinguono solo per lo spessore del bordo (`chromium-1440-forzati/001-vai.jpg`). Tema scuro: la foto della finestra resta un blocco bianco (`chromium-1440-scuro/002-stato-scuro.jpg`).
- **M8.** Il messaggio di copia non riuscita dice «premi Ctrl+C» anche sul telefono (`chromium-390x844/m-gesti-01.jpg`, primo riquadro); sul computer, con permesso di scrittura negli appunti, dice «Copiato.» (`chromium-1440/041-clic-seq-02.jpg`).
- **M9.** Sul telefono le parole sono sillabate a fine riga («in-vece», «pos-siamo») nei riquadri «Tu scrivi» e «Kalliope dice» (`chromium-390x844/m-ascolta-01.jpg`): per chi legge con fatica una parola spezzata costa più di una riga corta.
- **M10.** L'ascolto: il pulsante cambia larghezza fra «Ascolta Giulia» (223 px) e «Ferma Giulia» (210 px) e sposta le barre di 13 px (`chromium-1440/009-clic-testo-seq-02.jpg` contro `006-clic-testo-seq-02.jpg`); dopo «Ferma» la posizione resta all'ultimo valore («0:02 / 0:09») senza dire se il prossimo «Ascolta» riprende o riparte (non verificato con l'audio vero).
- **M11.** Il rilevamento del sistema usa `navigator.platform` e lo user agent: un iPad con iPadOS recente si presenta come Mac e riceverebbe l'avviso «Stai usando macOS» invece di quello del tablet (non verificabile qui).

## 6. Le otto domande (le risposte del §5), contro l'autovalutazione

1. **L'ambizione si vede?** A2: sì sul computer (cartellino a 575-882 su 900), **no sul telefono** (B2): l'autovalutazione scrive «sì» per entrambi. A1: sì ma a y≈1100, e l'immagine del primo schermo non la mostra (I3): confermato e peggiore di come è scritto. A4: confermato (nel primo schermo nulla dice che la voce si vede); le barre cambiano forma fra i fotogrammi con l'orologio simulato (`chromium-1440/009-clic-testo-seq-02.jpg` e `-04.jpg`) ma la fluidità a tempo reale non è verificata. A3 e A5: si vedono nelle loro pagine; A3 si rompe quando la ricerca non trova nulla (B1).
2. **Di questo prodotto, meglio o solo diverso?** Meglio dove la forma serve il compito (cartellino, scritto/detto, frasi della finestra, «Come sai che è andata bene / Se non è andata»); solo diverso, e poco, nell'aspetto (verde e carta calda). Coprendo il logo: riconoscibile dal contenuto, non dalla forma. Conferma l'autovalutazione e la rende più severa.
3. **Ordine ed espressione.** Ordine alto (gerarchia, convenzioni, focus). Espressione concentrata in due punti e assente altrove. Le convenzioni restano (navigazione in cima, Avanti in fondo), ma sono doppie (I4).
4. **Gerarchia e compito.** Confermo Installa (primo gesto a 1335 e 2207 px) e aggiungo: Ascolta ha il primo pulsante alla piega o oltre (I2); la fine della home ripete il comando (I8). Le tre azioni principali (Ascolta, Installa, Aiuto) sono chiare nel titolo di ogni pagina.
5. **Composizione a ogni misura.** Computer: confermo il terzo vuoto nelle pagine di testo (colonna 790 su 1152). Telefono: conserva l'essenziale, ma 318 px di navigazione, un avviso da 249 px e una foto da 340 px prima del cartellino; nessuna sporgenza orizzontale in nessun motore (`misure.json`). Testo 200%: nessun taglio (scrollWidth 1440), ma la navigazione occupa metà schermo (I4).
6. **Movimento e reazioni.** Ripiego per il movimento ridotto confermato: barre ferme, frase evidenziata e «frase 2 di 2 · 0:03 / 0:09» (`chromium-1440-ridotto/002-clic.jpg`; `anim: 0`). Un solo suono per volta confermato nei tre motori con l'orologio simulato (`giuliaFerma: true`). «Copiato.» e il messaggio di errore sono reazioni chiare. L'unico momento che una persona noterebbe è dopo il gesto (conferma).
7. **Peculiarità e confronto.** Il testo accanto al suono e un solo suono per volta (R03, R05) sono interi. La barra di stato come cartellino perde il carattere dell'isola di R20 (già dichiarato). Rispetto ai riferimenti, contenuto e struttura reggono (onestà dello stato superiore a tutti); aspetto, innovazione e movimento sono sotto i Webby osservati: voluto, ma l'ambizione A4 («fa vedere la voce») ha oggi cinque barre da 36 px.
8. **Contenuti.** Nessuno spazio lasciato da dati finti; i due vuoti sono la fascia sopra i riquadri (I1) e la foto della finestra (I3, M5). Testi onesti sui limiti («non l'abbiamo provato») in ogni pagina.

**Ciò che l'autovalutazione non vedeva**: B1, B2, I1, I2, I4, I7, I9, M1, M6, M8, M9. **Ciò che conferma**: terzo vuoto, primo gesto di Installa sotto la piega, A4 non visibile nel primo schermo, 404 e Non ancora senza marca. **Ciò che smentisce**: «A2 sì» sul telefono; «Nessuno spazio vuoto» (I1).

## 7. Ciò che funziona e non va toccato

Focus: anello doppio di 3 px su ogni comando, «Vai al contenuto» che compare in cima (`chromium-1440-tastiera/003-tab1.jpg`), ordine di Tab sensato (17 Tab sulla home: marca, cinque voci, comandi, cartellino, ascolto, porte; tutti con anello). Senza JavaScript: controlli nativi dell'audio, comandi leggibili e selezionabili, elenco di frasi senza filtro, indirizzo da copiare (`stati-extra/m-senzajs-1440.jpg`, `m-senzajs-390.jpg`). Tema scuro coerente (`chromium-1440-scuro/`). Un solo suono per volta e «Ferma» in tutti i motori. Nessuna sporgenza, nessun errore di console (tranne il 404). Ancore tutte presenti. Parità fra Chromium, Firefox e WebKit: stesse strutture, stesse altezze entro il 4% sul computer (WebKit fino al 7% sul telefono), stessi esiti dei gesti (`firefox-*/misure.json`, `webkit-*/misure.json`); unica differenza visiva il corpo del carattere di sistema (`webkit-1440x900/m-quattro.jpg`).

## 8. Mappa delle prove (`design/prove-percorso/revisione/`)

`chromium-1440/` (001-066, più `dettagli-*.png`) · `chromium-1440-tastiera/` · `chromium-1440-ridotto/` · `chromium-1440-testo200/` · `chromium-1440-forzati/` · `chromium-1440-scuro/` ·
`chromium-390/` (telefono 430×932 di `passo.mjs`) · `chromium-390x844/` (segmenti `*-sNN.png`, mosaici `m-*.jpg`, `misure.json`) · `firefox-1440x900/`, `firefox-390x844/`, `webkit-1440x900/`, `webkit-390x844/` (`misure.json`, `m-quattro.jpg`) ·
`stati-extra/` (banner Windows/macOS, senza JavaScript, `misure.json`) · `misure-extra.json`, `misure-primo-schermo.json` · `_lavoro/` (script e registri, compresi i quattro tentativi su WebKit).
