# Incarico 2-f · cornice, lingue e «non ancora»: i difetti del secondo sguardo · progresso

Ruolo design-build. Incarico: `design/lavoro/incarichi/2-3a-correzioni-cornice.md`. Partenza `b456308` (più `6bad455`, solo i `.po` di prova rigenerati da chi coordina: i miei alberi li copiano da
`2-lingue-aspetto/prova-lingue/`). Nessun commit, nessun push, nessuna finestra, nessun altro agente. Cartelle `/tmp/lavoro-2f-*`, porte 8890–8899 (i programmi di prova che avviano da sé il server
usano `PORTA_2F`, 8891–8894; le prove fatte prima di aggiungere quella variabile, e `confronta-scelta.mjs` della skill, hanno usato porte scelte dal sistema, mai quelle degli altri).
Ambiente: `source prove/env.sh`. Alberi di prova: `prove/costruisci.sh <nome> <it|10> <mio|vivo|commit> [--pseudo]` (cartelle nuove a ogni corsa: `/tmp/lavoro-2f-radice-<nome>`,
`/tmp/lavoro-2f-sito-<nome>`). **La copia di prima** è `prima-it` / `prima-10` (git archive di `b456308`); **la copia di dopo** è `fin2-it` / `fin2-10` = `b456308` + i soli file di questo incarico
(`mio`): il ruolo di direzione di «stato» (3b-c) lavora negli stessi alberi (`website/stato/`, `catena.css`, le sue voci nuove che mettono fuori data i `.po` di prova), e i suoi cambi in corso non
devono entrare nelle mie prove né le mie nelle sue. In `barra.css` la copia di dopo si ferma alla fine della mia sezione (la regola «la pagina in cui sei» di 3b-c, che sta dopo, non c'è nelle prove).

## Stato

**Finito**, salvo «Non verificato» e «Difetti trovati e non miei» in fondo. Ultimo comando: `bash prove/tutto.sh <motore>` (e `python3 prove/riepilogo.py` per le righe di sintesi di `esiti/`).

## File toccati

Design system: `design-system/token.css` (in fondo: `--altezza-schermo`, `--pannello-menu-pieno`, tre token delle barre di «Tu»; otto token che cambiano solo l'unità dell'altezza), `componenti/barra.css`
(in fondo, mia sezione: le due regole spostate da `lingue.css`, il fuoco nella barra, il menu pieno in Firefox), `componenti/lingue.css` (le due regole tolte; il titolo e la barra della pagina della scelta),
`componenti/riunione.css` (la scala e lo spostamento delle barre di «Tu»), `componenti/versioni.css` (il posto per la risposta di «Copia»), `catalogo/catalogo-pagine.js` (le versioni con il posto già
lì), `TOKEN.md` e `SISTEMA.md` (solo aggiunte in fondo / un punto in più). Sito: `website/componenti.js` (la misura delle barre di «Tu»), `website/non-ancora/non-ancora.js` (la risposta di «Copia» con
`.vuoto`; `mostraInsieme` che cede a gradi), `website/lingue.html` (una riga in linea per la barra della pagina della scelta, L3), `website/non-ancora/index.html` e
`website/stato/index.html` (**una riga ciascuno: la rete di sicurezza del `<head>`, solo per il punto 9**).
Documenti: `design/lavoro/3a-non-ancora/PIANO.md` (la regola della cornice: il gradino in più e `svh`). Prove e esiti: tutto in questa cartella (`prove/`, `esiti/`, `foto/`).
Non toccati: `website/stato/stato.js`, `riunione-provata.css`, `catena.css`, `domande.css`, `varco.css`, `inoltra.css`, `metodo.config.mjs`, `cornice.js`, `pagina.css`.

## Per ogni punto: causa, che cosa è cambiato, foto prima e dopo

(Le foto sono in `foto/`; «prima» è `b456308`. I numeri delle prove sono nella sezione «Prove, con i numeri».)

### 1 · Il menu al telefono fa saltare la pagina (importante)

- **Causa** (trovata riproducendo con input veri, non con i click di Playwright, che scorrono da sé l'elemento in vista prima di premere): `base.css` ha `html { scroll-padding-top: 88px }`, il
  bordo di sicurezza che tiene i collegamenti interni e il fuoco sotto la barra; la barra però è già in cima allo schermo (`position: sticky`), e per Chromium ogni suo comando (il pulsante «Menu»,
  una voce, il marchio) sta «sotto il bordo»: il fuoco che ci arriva centra la pagina. Aprire il menu (il fuoco va alla prima voce, che sta in parte sopra gli 88 px) la faceva salire di 23 px;
  chiuderlo con Esc (il fuoco torna su «Menu») di altri 438 (a 844 px d'altezza; 179 a 326 px); con Maiusc+Tab dalla pagina scorsa ogni passo verso la barra di altri 438. **Succede anche in
  WebKit** (23 px aprendo, 82 chiudendo): il giudice non l'aveva potuto provare. Firefox centra solo ciò che non si vede affatto: non si muove. Era così in tutte le pagine che usano la barra.
- **Perché le prove non lo vedevano**: `menu-fuoco.mjs` (3a-r) apriva il menu da `scrollY = 0` (la pagina non può salire) e muoveva il fuoco solo dentro il menu già aperto.
- **Che cosa ho cambiato** (una regola, `barra.css`): `html:has(.barra:focus-within) { scroll-padding-top: 0 }`: finché il fuoco è nella barra il bordo non serve. Provate e scartate: `scroll-margin-top`
  negativo sui comandi della barra (funziona a 390×844, ma con il menu alto e lo schermo basso porterebbe i rettangoli fuori dal bordo basso), `scroll-padding` spostato sul contenuto (cambia ogni
  scorrimento della pagina), `preventScroll` nelle chiamate (non copre Maiusc+Tab né le voci). Vale per tutte le pagine che caricano `barra.css`: home, «non ancora», «stato», la pagina della scelta.
- **Foto**: `foto/1-salto-prima-e-dopo.png` (390×844, scorsa a 1500: prima di aprire, menu aperto, dopo Esc; prima: 1500 → 1477 → 1039; dopo: 1500, 1500, 1500).

### 2 · Il pannello del menu in Firefox lascia leggere la pagina dietro

- **Verificato**: è un difetto vero **in questo Firefox** (150, senza finestra, disegno in software): `CSS.supports('backdrop-filter', 'blur(18px)')` è vero e lo stile calcolato è lo stesso di Chromium, ma
  la sfocatura non viene disegnata (prova minima: un pannello al 94% su un testo grande, testo nitido sotto in Firefox, macchia in Chromium); il 6% che passa basta a leggere il titolo. Con una scheda
  grafica **non l'ho potuto vedere**: ho provato a forzare WebRender e Mesa (`gfx.webrender.all`, `LIBGL_ALWAYS_SOFTWARE`) e il Firefox senza finestra disegna uguale. Le fonti ufficiali non le ho lette:
  WebSearch e WebFetch sono bloccati ai worker («delegare a vibe-next:research») e non posso creare agenti (da dire al coordinatore).
- **Che cosa ho cambiato**: solo per Firefox (`@supports (-moz-appearance: none)`, che solo lui conosce), in `barra.css`, il menu aperto prende `--pannello-menu-pieno` (99,5%, token nuovo). Con il 98,5%
  il titolo si leggeva ancora, appena. Chromium e WebKit sono identici a prima (stesso colore calcolato e stessi pixel). Se un Firefox con la scheda grafica sfoca, perde il vetro (la sfocatura al 94% si vede
  poco): da guardare su una macchina vera, per tornare indietro basta togliere la regola. Il pannello delle lingue sul computer non cambia (lì Firefox senza sfocatura e Chromium differiscono poco: 11 e 10 su 255). **Il WebKit di Playwright (Linux, senza scheda grafica) lascia
  passare la pagina allo stesso modo (14 su 255) e non l'ho cambiato**: nessun `@supports` riconosce quel WebKit senza riconoscere anche Chromium e il Safari vero, dove la sfocatura c'è; da dire a chi coordina.
- **Foto**: `foto/2-vetro-firefox-prima-dopo-chromium.png`.

### 3 · L1 — in urdu a 326×326, mentre la voce suona, «Pausa» finisce 23 px sotto il bordo

- **Causa**: a 326×326 la riunione è già al suo minimo (60 px) e la bolla urdu ha tre righe alte (128 px, in italiano 88): bolla, riunione e pulsante non stanno insieme (richiesti 285,6 px, disponibili 254) e
  `mostraInsieme(bolla, comandi, 'inizio')` faceva vincere sempre la bolla, a costo del pulsante premuto. In en-XA (quattro righe) mancavano 14 px.
- **Che cosa ho cambiato** (`non-ancora.js`, `mostraInsieme`): quando bolla e pulsante non ci stanno insieme il pulsante («essenziale»: il bottone, non il suo contenitore, che ha anche il collegamento
  «Tutte le frasi») resta sempre nello schermo, e la bolla cede a gradi: prima sale sotto la barra il suo margine; se non basta, il pulsante sta a 4 px dal bordo invece di 8 e le parole salgono sotto la
  barra del poco che manca. Dove ci stanno insieme (italiano, in ogni misura provata) non cambia niente. La regola è scritta in `PIANO.md` («La cornice», punto 3).
- **Resta** (non mio da decidere, con la foto): in urdu a 326×326 la bolla sale sotto la barra di 19,8 px e la prima parola (la sua riga) di 2,8; l'inchiostro del nastaliq sporge sopra la riga, quindi in
  foto si vede il bordo alto delle lettere della prima riga tagliato dalla barra; in en-XA la bolla sale di 10 px e le parole stanno tutte sotto la barra. La riunione non può scendere sotto 60 px (`PIANO.md`: sotto non reggono i nomi), e togliere 18 px dallo spazio fra la riunione e «Pausa» (34 px) a
  quelle altezze toglierebbe il difetto, ma cambia la composizione (e l'italiano a 326×326): lo lascio alla direzione.
- **Foto**: `foto/3-L1-prima-e-dopo.png` (it, ur, en-XA a 326×326 mentre suona).

### 4 · L2 — in urdu a 844×390 l'etichetta del riquadro di «Tu» tocca le barre della voce

- **Causa**: l'etichetta sta in alto, le barre al centro; nel riquadro basso (a 844×390 la riunione della chiusura è alta 51–88 px) un'etichetta alta (nastaliq: 37 px di pillola) o larga (bengali:
  59 px) arriva sulle barre. Non solo in urdu né solo a 844×390: a 844×390 l'etichetta toccava le barre anche in arabo (−1,8 px), bengali (−2,7) e hindi (−0,4); a 326×326 in urdu (−7,6), bengali (−6,6), arabo (−3,6), hindi, cinese,
  greco, finlandese e altri (17 casi su 72 in Chromium); in italiano restavano 5,2 px a 844×390 e nessun contatto altrove.
- **Che cosa ho cambiato**: `componenti.js` (`misuraBarreTu`) misura sulle posizioni del layout (non sui rettangoli disegnati, che cambiano con l'entrata e con la voce) e, dove le barre, anche alla massima
  altezza che la voce dà loro, starebbero a meno di 3 px dall'etichetta, **prima le fa scendere** (`--barre-sposta`, restando nel riquadro con lo stesso margine dell'etichetta in alto) e, se non basta
  (il riquadro è troppo basso: urdu), **le rimpicciolisce** attorno al loro centro (`--barre-scala`, minimo 0,4). Dove non si toccano non c'è né spostamento né scala: l'italiano, il tedesco, il finlandese, il
  greco, il bulgaro, il cinese, en-XA restano com'erano (stesso numero, stessa distanza). `riunione.css`: `transform: translate(-50%, calc(-50% + var(--barre-sposta, 0px))) scale(var(--barre-scala, 1))`.
- **Foto**: `foto/4-L2-prima-e-dopo.png` (ar, ur, hi, bn a 844×390: prima e dopo, a coppie).

### 5 · L3 — pagina della scelta: il nome «Kalliope» spento, la barra che cambia fondo

- **Causa del nome**: la luce della stanza (`.luce`, posizionata, livello 0) si dipinge sopra il titolo, che non era posizionato: il bianco `#ffedef` diventava `220 156 176` (pixel misurati). Nella home il
  titolo sta dentro `.scena` (livello 2).
- **Causa della barra**: la pagina non ha lo script che aggiunge `js` e riempie la barra; il foglio «senza script» (`barra.css`) la faceva piena sempre, e il riempimento legato allo scorrimento
  (`animation-timeline`), che esiste solo quando la pagina scorre, la faceva trasparente in cima: due barre diverse per la stessa pagina a due altezze vicine.
- **Che cosa ho cambiato**: (`lingue.css`) `.scelta-lingua .scelta-titolo { position: relative; z-index: var(--livello-scena) }`. Per la barra: la pagina non può avere la classe `js` (con `js` i riquadri della
  riunione restano spenti), quindi **una riga in linea in `lingue.html`** mette `barra-viva` su `<html>` e, scorrendo oltre 12 px, `compatta` sulla barra (la classe e la soglia di `cornice.js`), e `lingue.css` rende la
  barra trasparente finché non è `compatta` (la barra piena di `barra.css` fa il resto, con la stessa dissolvenza delle altre pagine). Il primo tentativo (solo CSS, `animation-timeline`) correggeva Chromium ma non
  Firefox né WebKit (che non conoscono la proprietà e restavano con la fascia sempre piena): lo tengo solo per chi ha lo script spento (dove il browser lega l'animazione allo scorrimento: trasparente a riposo,
  piena nei primi 24 px; altrove piena, come prima).
- **Foto**: `foto/5-scelta-prima-e-dopo.png` (1440×900).

### 6 · P1 — in «non ancora», dopo «Copia», il pannello delle versioni sale di circa 14 px

- **Causa**: il pannello sta al centro accanto al testo e la riga «Copiato: …», che compare sotto il comando, lo allungava di 27 px (13,5 di salita).
- **Che cosa ho cambiato**: il posto per la risposta c'è già prima di premere. Le due risposte (fatta, non riuscita) stanno nella stessa cella e quella che non c'è è solo invisibile (`.vuoto`): il posto ha
  l'altezza della più lunga, in ogni lingua e larghezza (come le etichette di «Ascolta»). `versioni.css` (4 regole), `non-ancora.js` (lo script mette `.vuoto` quando il comando compare e lo toglie alla
  risposta: l'attributo `hidden` non basta, `base.css` lo fa vincere su ogni `display`), il catalogo (le versioni come la pagina). **Differenza voluta a riposo**: il pannello è più alto di 27 px al
  computer (289 → 316) e di 38 al telefono (293 → 331: la risposta fa due righe), dove il comando c'è (con JavaScript e appunti); senza, nulla.
- **Foto**: `foto/6-copia-prima-e-dopo.png` (stesso ritaglio: prima, a riposo e dopo «Copia»; dopo, a riposo e dopo «Copia»).

### 7 · L'altezza della riunione bassa (e degli altri token della riunione legati all'altezza)

- **Che cosa ho cambiato**: un token, `--altezza-schermo` (`100vh`; `100svh` dentro `@supports (height: 100svh)`), e gli otto token che calcolavano su `100vh` (`--chiamata-altezza-basso-699`,
  `--chiamata-altezza-computer`, `--chiamata-ferma-altezza`, `--tavolo-pagina-altezza`, `-telefono`, `-errore`, `--scelta-tavolo-altezza`, `--scelta-altezza-minima`) lo usano. Il ripiego sta in un
  `@supports` e non in una seconda dichiarazione perché un'unità sconosciuta dentro un token non ripiega da sola (la misura cadrebbe su `auto`): la prova lo mostra con una copia rotta apposta. Restano
  `vh`: `--mondo-altezza-minima` (il mondo deve riempire anche lo schermo con la barra nascosta), `--menu-aperto-altezza-massima` (ha già la sua `dvh`), `--lingue-pannello-altezza-massima`, `--sovrap`,
  `--varco-passi-distanza*` (spazi di scorrimento, non misure da far stare nello schermo).
- **Che cosa ho visto e che cosa no**: ho visto che il token vale `100svh` dove il browser lo conosce e `100vh` con il ripiego, che le altezze della riunione (di «non ancora», della home, della fila della
  scelta, la scelta intera) sono identiche con l'una e con l'altra unità e che la copia rotta si vede; in ogni simulazione `svh` = `vh` = `innerHeight` (nessuna barra del browser che si ritrae), quindi
  l'italiano a riposo è identico a prima. **Non ho visto** la differenza su un telefono vero con la barra del browser visibile: in una simulazione senza finestra non c'è.

### 8 · Pulizia: le due regole della barra in `lingue.css`

Spostate in `barra.css` (`.barra:has(.menu.aperto) { clip-path: none }` e `@media (max-width: 959px) { .barra.con-azione .menu.aperto { transform: none } }`). In `lingue.css` resta
`.barra:has(.lingua-scelta[open]) { clip-path: none }` (riguarda l'elenco delle lingue). Specificità e ordine: nessuna regola con la stessa specificità sta in mezzo; la barra e il menu a vista sono uguali
(italiano a riposo 0% di pixel diversi; il menu aperto in Chromium a 0 pixel).

### 9 · (punto in più di chi coordina, dal giudizio di «stato», I3) Se `cornice.js` non si carica, spariscono pezzi interi

- **Causa**: la rete di sicurezza del `<head>` di ogni pagina (`if(!window.__pagina) …remove('js')` dopo 4 s) controllava solo lo script della pagina; `cornice.js` (che aggiunge `visto` ai tratti) no: senza di
  lui la classe `js` restava e i titoli dei tratti, la bolla della risposta e il messaggio da inoltrare restavano invisibili.
- **Che cosa ho cambiato**: la rete controlla anche `window.Cornice` (che `cornice.js` imposta alla fine): `if(!window.__pagina||!window.Cornice)`. **Ho toccato `website/stato/index.html`, una riga, solo per
  questo meccanismo** (e la stessa in `non-ancora/index.html`); `SISTEMA.md` («Come si usa per un'altra pagina», punto 5) lo dice a chi scrive la prossima pagina. La pagina aspetta i 4 s e poi si legge
  come senza JavaScript; non l'ho resa immediata (un `onerror` sul tag toglierebbe l'attesa quando il file non arriva).
- **Foto**: `foto/9-cornice-prima-e-dopo.png` (con `cornice.js` bloccato: prima il titolo e i testi non ci sono, dopo sì).

## Prove, con i numeri

Ogni prova nuova è rossa sulla copia di prima (`prima-*` = `b456308`) e verde su quella di dopo. I programmi sono in `prove/`, gli esiti grezzi in `esiti/<prova>-<motore>-<prima|dopo>.txt`, le righe di sintesi con
`python3 prove/riepilogo.py [filtro]`. Le prove sono simulazioni (nessun telefono vero, nessuna finestra, nessun audio in Firefox).

| Punto | Prova | Chromium prima → dopo | Firefox prima → dopo | WebKit prima → dopo |
|---|---|---|---|---|
| 1 menu che salta | `salto-menu.mjs`: apri con mouse e con tocco, Esc, Invio, Maiusc+Tab fino alla barra; `it/`, `it/non-ancora/`, `it/stato/` × 390×844, 844×390, 326×326, 750×832 | **148 su 175** controlli muovono la pagina (fino a 438 px) → **0 su 176** | 0 su 127 → 0 su 127 (non si muoveva) | **152 su 176** (fino a 82 px) → **0 su 176** |
| 1 (lingue e scelta) | stessa prova: `ar/non-ancora/`, `de/`, `ur/`, scelta × 390×844, 326×326 | **78 su 102** → **0 su 102** | 0 su 79 → 0 su 79 | **82 su 102** → **0 su 101** |
| 1 (copia finale) | `salto-scelta-fin3` (ar, scelta × 390×844, 326×326, 844×390) e `salto-rapido-fin3` (RITMO=0, Maiusc+Tab senza pause) | 0 su 52 e 0 su 70 | 0 su 42 e 0 su 56 | 0 su 52 e 0 su 72 |
| 2 pannello | `vetro-menu.mjs`: quanto «bordo» netto della pagina dietro passa dentro il pannello (soglia 6 su 255, quello che lascia Chromium) | 6 → 6 (uguale) | **14 → 1** | 14 → 14 (**non cambia**: vedi «Difetti non miei») |
| 3 L1 | `suona-basso.mjs` (la voce suona: «Pausa» nello schermo, parole in vista), 12 lingue × 326×326, 844×390, 915×412, 360×640, 1366×640 | it, ar ok; **ur: «Pausa» 24 px oltre il bordo, en-XA 14** → 12 lingue × 5 misure ok (ur: «Pausa» a 4,2 px dal bordo, bolla sotto la barra 19,8 px, prima parola 2,8 px sotto la barra; en-XA 10 px, parole in vista) | (nessuna uscita audio: non si può) | it, ar ok; ur, en-XA come Chromium → 12 lingue ok (ur 19,2 px, en-XA 10) |
| 3 L1 (errore) | stessa prova, stato `errore` (4 lingue × 5 misure): il messaggio sta nello schermo | uguale prima e dopo (ok) | uguale prima e dopo (ok) | uguale prima e dopo (ok) |
| 4 L2 | `tu-misure.mjs`: etichetta di «Tu» e barre, 12 lingue × 6 misure (844×390, 915×412, 761×500, 1440×900, 326×326, 390×844), margine 2 px | **17 su 72** si toccano (ur −7,6 px a 326×326; a 844×390 ar −1,8, ur −2,7, hi −0,4, bn −2,7) → **0 su 72** | 16 su 72 → **0 su 72** | 15 su 72 → **0 su 72** |
| 5 L3 | `scelta-barra.mjs`: titolo (pixel più chiaro 255 237 239) e barra a riposo / scorrendo, 5 misure | **0 su 5** (titolo 220 156 176; fascia piena a 1440, 844, 1280, 390) → **5 su 5** | 0 su 5 (la fascia piena sempre: il browser non conosce `animation-timeline`) → **5 su 5** | 0 su 5 → **5 su 5** |
| 5 L3 (senza JavaScript) | `scelta-barra.mjs --senzajs`, 3 misure | 0 su 3 → **3 su 3** | non verificato (la prova si blocca con JavaScript spento) | non verificato |
| 6 P1 | `copia-posto.mjs`: posizione e altezza del pannello e della nota sotto prima e dopo «Copia»; it, en-XA, ar-XB × 1440×900, 1024×768, 844×390, 390×844 | **12 su 12** si muovono o cambiano altezza (it 1440: pannello 289 → 316 px, sale di 13,5) → **0 su 12** | 12 su 12 → 0 su 12 | 12 su 12 → 0 su 12 |
| 7 svh | `altezza-schermo.mjs`: il token vale `100svh` (ripiego `100vh` senza il `@supports`), le quattro altezze della riunione sono uguali con i due, la copia rotta apposta si vede; 5 misure | (senza prima: token nuovo) ok 5 su 5 | ok 5 su 5 | ok 5 su 5 |
| 9 cornice | `senza-cornice.mjs`: con `cornice.js` bloccato, `it/non-ancora/` e `it/stato/` × 1440×900 e 390×844: elementi invisibili in più rispetto a senza JavaScript | «non ancora» **+23**, «stato» **+11** (classe `js` resta) → **0 e 0** (classe tolta dopo 4 s) | +23 / +11 → 0 / 0 | +23 / +11 → 0 / 0 |

Statici sulla copia di dopo (`esiti/statici-fin2.txt`): `controlla-sorgenti.mjs` verde (28 fogli, valori solo nei token), `tools/css_logico.py` verde (29 fogli), `translations.py extract --check` verde (254
messaggi, cataloghi aggiornati), `check --complete` verde (it 254/254; con le nove lingue di prova 254/254 ciascuna), `test_translations.py` 72 prove OK, `prove/graffe.py` verde (le graffe di ogni foglio tornano).

Esame dell'impaginazione (Chromium, `esame-impaginazione.mjs`, sulla copia di dopo):
- «non ancora», a 900 d'altezza, le 42 larghezze di `soglie.mjs` (`esame-na-1/2/3`): tutto pulito. Altezze 500–841 a 390 e a 844, e a 1366 e 1440 (`esame-na-4/5`): tutto pulito, 2 limiti dichiarati (gli stessi di prima).
  Le 22 misure (i 15 dispositivi e sette telefoni e finestre basse; `esame-na-6`): tutto pulito, 5 limiti dichiarati (gli stessi di 3a-r). Nessun «limite non usato».
- Pagina della scelta (22 misure + 42 larghezze: `esame-scelta`; sulla copia finale: `esame-scelta-fin3`, 22 misure): tutto pulito. Home (22 misure): tutto pulito.
- «stato» (22 misure, 6 stati): **40 cose da guardare, identiche a quelle della copia di prima** (0 righe diverse fra `esame-stato.txt` e `esame-stato-prima.txt`): non sono di questo giro.
- «non ancora» in ogni lingua (`esame-lingue-na.config.mjs`: pagina a riposo, ascolto, copia × 326×326, 844×390, 915×412, 390×844, 1440×900; 11 lingue e le due pseudo): pulito in ar, ur, hi, bn, el, de, fi, it, ar-XB;
  en-XA: STRETTO 3 («Menu» su due righe a 326×326, uguale a prima); zh: SPEZZATA 12 («开源», uguale a prima). Il limite dichiarato di L1 (`p.bolla-testo` coperto a 326×326) serve in urdu.
- Catalogo (`catalogo.mjs`, Chromium 1440×900): 9/9 prima e dopo.

L'italiano a riposo contro `b456308` (`confronta-scelta.mjs`, con «riduci movimento», copia finale; `esiti/confronta-scelta-fin3.txt`): home, «non ancora» e «stato» a 1440×900, 390×844, 844×390, 360×640, 1366×640 in cima:
**uguale, 0% di pixel diversi**. «non ancora» a 1440×900 scorsa a 1850 e 2150 px: solo la differenza voluta di P1 (`prove/ammesse-P1.json`: il pannello +27 px, 5,14% e 2,86% di pixel, tutti da quello); a 2800 uguale.
La pagina approvata `079120d` (home e «non ancora» a 1440×900, 390×844, 844×390, 390×667): le sole differenze sono quelle già note di prima (le righe del titolo che a 390 cambiano misura di scatola, invisibili; M3 al telefono). La pagina della
scelta contro `b456308` a 1440×900, 390×844, 844×390, 1280×720, 326×326: solo la fascia della barra (`prove/ammesse-L3.json`) e il colore reso del titolo (1,05%, 0,43%, 18,56%, 5,11%, 0,93% di pixel).

## Impronte (primi 16 caratteri di sha256; `esiti/impronte-*.txt`)

| File | prima (`b456308`) | dopo, batterie (fin2) | dopo, pagina della scelta (fin3) |
|---|---|---|---|
| `design-system/token.css` | b9758057eb6afd5c | e1c5ae0ca563e621 | e1c5ae0ca563e621 |
| `componenti/barra.css` (fino alla mia sezione) | 14095e4a3a29a9d9 | 7a8caf3cbc91f38b | 7a8caf3cbc91f38b |
| `componenti/lingue.css` | cc6193a7ef2fea99 | 875b6f19ee4630d0 | 913ee7c2a5c4764e |
| `componenti/riunione.css` | 2e04b835ed60eed0 | 33d3f589262441d6 | 33d3f589262441d6 |
| `componenti/versioni.css` | c5a07548a38d96ef | e22e4584d39ba8a4 | e22e4584d39ba8a4 |
| `catalogo/catalogo-pagine.js` | 8340d830fe267cef | 54c7b7515f7992e6 | 54c7b7515f7992e6 |
| `website/componenti.js` | 9bf3a7346e147880 | 622839843e12a560 | 622839843e12a560 |
| `website/lingue.html` | 73f3a2a7f28ea156 | 73f3a2a7f28ea156 | e38485f6738fa652 |
| `website/non-ancora/non-ancora.js` | ef87898d130e8d92 | 3c0daea087a42fc1 | 3c0daea087a42fc1 |
| `website/non-ancora/index.html` (b456308 + la riga della rete) | bd85d88b93667f28 | 06b5e8cdd7e8a682 | 06b5e8cdd7e8a682 |
| `website/stato/index.html` (b456308 + la riga della rete) | dddd828d09a785e3 | 18e9f66eb5dad2b7 | 18e9f66eb5dad2b7 |
| albero (website, design-system, tools), `-it` | 95c6da86c5748f1b4ab6f8287642df99 | cfe90ea6f0637e3f2accf4709bcffabb | 9a7f96d6285b4f73f02ff617394c387f |
| sito costruito, dieci lingue | `esiti/impronte-prima-10.txt` | 98d9ad6805a2ef4967689c324d567011 | 0b15bba31b6ca1ffb4dc0bb9f1ac1029 |

**Quali prove sono girate su quale copia.** Tutto ciò che riguarda il menu, la cornice, «Copia», le barre di «Tu», «Pausa» (`salto`, `cornice`, `copia`, `tu`, `suona`, `errore`, `altezza`, `vetro`) e gli esami di «non ancora», home e
lingue sono girati su **fin2** (o su copie precedenti, `mio2`/`fin1`, che differiscono solo da `lingue.css`, `lingue.html` e dalla regola per Firefox: nessuna delle quali tocca quelle pagine in Chromium). Dopo fin2 sono cambiati
**soltanto** `lingue.html` (una riga in linea) e `lingue.css` (il blocco della barra della pagina della scelta, il cui selettore vale solo per `.scelta-lingua`): le prove della scelta (`scelta-barra`, `salto-scelta-fin3`,
`salto-rapido-fin3`, `esame-scelta-fin3`, `confronta-scelta` della scelta) e il confronto dell'italiano girano su **fin3**. I file miei nell'albero vivo sono uguali a quelli di fin3 (impronte verificate: `token.css`,
`lingue.css`, `riunione.css`, `versioni.css`, `catalogo-pagine.js`, `componenti.js`, `lingue.html`, `non-ancora.js`; `barra.css` fino alla fine della mia sezione). Le impronte prima del giro: `esiti/impronte-prima.txt`.

## Difetti trovati e non miei

1. **«stato»: 40 segnalazioni dell'esame dell'impaginazione, identiche prima e dopo il mio giro** (`esiti/esame-stato.txt`, `esame-stato-prima.txt`): 23 FUORI VISTA (le risposte di «Copia» `span.copia-fatto` e `span.copia-errore` a 360×740, 466×678,
   951×669, 326×326…; `div#domande-risposta` e `button.domanda-bottone` a 844×390 e 326×326…), 10 A CAPO NEL MEZZO, 5 ESCE, 2 COPERTO DOPO IL GESTO. Sono della pagina «stato» al commit `b456308` (guardata dal giudice 3b-g,
   corretta da 3b-c): non le ho toccate.
2. **WebKit: il menu saltava come in Chromium** (23 px aprendo, fino a 82 chiudendo e con Maiusc+Tab; 152 controlli su 176 sulla copia di prima). Chiuso dalla stessa regola; il giudice non aveva potuto provarlo (WebKit non partiva sulla sua macchina).
3. **Il WebKit di Playwright lascia leggere la pagina dietro il menu** come Firefox senza sfocatura (14 su 255), prima e dopo: non l'ho cambiato (vedi punto 2). Il Safari vero con la scheda grafica non l'ho potuto provare.
4. **La scheda dell'ascolto della home** (`.ascolto`, `--pannello-ascolto` al 72%) è fatta per mostrare la scena attraverso, con la sfocatura: dove la sfocatura non c'è (Firefox e WebKit senza scheda grafica) si legge anche ciò che c'è dietro. È un
   effetto voluto della direzione, non un errore: lo scrivo perché è lo stesso motivo del punto 2.
5. **en-XA a 326×326: «Menu» va su due righe** nel pulsante della barra (`STRETTO a.pulsante-menu «[Ḿéñû Ĺ]» largo 63px`), e **zh: «开源» si spezza** (SPEZZATA 12 segnalazioni): uguali prima e dopo, pseudo-lingua e traduzione di prova.
6. **Le prove di prima non vedevano il salto del menu**: `menu-fuoco.mjs` (3a-r) apre il menu da `scrollY = 0` (la pagina non può salire) e muove il fuoco solo dentro il menu già aperto; i click di Playwright (`click`, `tap`) scorrono da sé
   l'elemento in vista prima di premere (il «461 px» del giudice è in parte questo). `prove/salto-menu.mjs` usa input veri e parte da pagine scorse.
7. **In urdu a 326×326, mentre la voce suona, l'inchiostro del bordo alto della prima riga della bolla sta sotto la barra** (foto `foto/3-L1-prima-e-dopo.png`): lo spazio (326 px) non basta per la bolla (128 px), la riunione al suo minimo (60), «Pausa» e i margini. Lo
   risolverebbe togliere 18 px dai 34 che stanno fra la riunione e «Pausa» a quelle altezze, ma cambia la composizione (e l'italiano a 326×326): **da decidere alla direzione** (e se si vuole, con la riunione più alta di 18 px in italiano).
8. **I `.po` di prova rigenerati da chi coordina (`6bad455`) sono già fuori data rispetto all'albero vivo** (3b-c ha cambiato `st.passo.disco.testo`, e altre voci di «stato»): con l'albero vivo `check` dice `OUT OF DATE zh.po: st.passo.disco.testo (the Italian text changed)` e `translations.py
   extract --check` conta 260 messaggi (254 in `b456308`): una lingua incompleta non si pubblica, e il sito a dieci lingue perde pezzi. Per questo le mie prove girano su `b456308` + i miei file.
9. **La rete di sicurezza aspetta 4 s** prima di far leggere la pagina come senza JavaScript (punto 9): chi apre una pagina con `cornice.js` che non si carica vede la pagina senza titoli per 4 s. Un `onerror` sul tag dello script la renderebbe immediata
   (non l'ho fatto: un meccanismo solo, da decidere).
10. **`tu-misure.mjs` e le altre prove con la voce in Firefox**: nessuna uscita audio su questa macchina (come per 3a-r): lo stato «suona» di L1 in Firefox non si può provare.

## Non verificato

- **Un telefono vero.** `svh` nella riunione bassa (punto 7): ho visto il token, il ripiego e che le altezze sono identiche in simulazione, non la differenza con la barra del browser visibile; il salto del menu in Chrome per Android e in Safari su iPhone
  (le simulazioni di Chromium e WebKit senza finestra lo mostravano e non lo mostrano più; l'input vero a dito no).
- **Firefox con la scheda grafica** (il vetro del menu): non so se lì sfoca; il pannello in Firefox è ora quasi pieno in ogni caso (da riguardare su una macchina vera: perderebbe il vetro). Le fonti ufficiali su `backdrop-filter` non le ho lette (WebSearch e
  WebFetch bloccati ai worker).
- **La pagina della scelta senza JavaScript in Firefox e in WebKit**: la prova si blocca con JavaScript spento (limite dello strumento: provata solo in Chromium, dove prima 0 su 3 e dopo 3 su 3); per il foglio, lì la barra resta piena (il ripiego).
- **Lettori di schermo**: la risposta di «Copia» (`role="status"`) ora sta già nella pagina con `visibility: hidden` e diventa visibile: non l'ho provata con Orca e NVDA (come per 3a-r).
- Il testo grande e lo zoom, la matrice dei 15 dispositivi in Firefox e WebKit (solo le misure elencate), le prove di «stato» oltre l'esame dell'impaginazione (è della direzione 3b-c).
- **Modello e consumi**: Sonnet 5.5 (`claude-sonnet-5-5`) come dice l'host nel contesto; tempi e token non misurati con `modello-effettivo.mjs` (non lanciato): non verificabile da qui.

## Ultimo comando e come riprendere

`bash prove/costruisci.sh <nome> <it|10> mio [--pseudo]` costruisce la copia di dopo; `PORTA_2F=<8890-8899> bash prove/tutto.sh <motore> [parti]` (salto cornice scelta vetro copia altezza errore tu suona), poi `bash prove/ultimo.sh <motore>`;
`python3 prove/riepilogo.py` per le sintesi. Alberi di prova e foto grezze: `/tmp/lavoro-2f-*` (sito, radice, lavoro, qa). Nessun commit, nessun push.
