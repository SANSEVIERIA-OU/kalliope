# Costruzione della home intera · direzione 2 «Alla pari, in riunione»

Questo documento ha cinque parti, una per incarico (la quinta, «Dopo la correzione del tablet», 8f, è in fondo e vale per i file di adesso, `prove/sito-sha256.txt`). **Prima parte, «Costruzione» (4b)**, **seconda parte, «Dopo le correzioni» (6b)** e
**terza parte, «Dopo il secondo giro» (8b)** riguardano la pagina com'era allora (`scartate/prima-delle-correzioni/`, `scartate/prima-di-6b/`,
`scartate/prima-di-8b/`): le prove che citano furono lanciate su quei file e **non valgono per la pagina di adesso**; le foto e i fogli di allora
sono in `scartate/prove-4b/`, `scartate/prove-6b/`, `scartate/confronti-4b/`, `scartate/confronti-6b/`. **Quarta parte, «Dopo il terzo giro» (8d,
in fondo):** la pagina di adesso, `percorso/sito/` (`index.html`, `scena.js`, `stile.css`; impronte in `prove/sito-sha256.txt`), con tutte le prove
rilanciate sugli stessi tre file, quelle della skill comprese. Per i file consegnati valgono quelle.

Gli strumenti stanno in `prove/strumenti/` (`strumenti/esegui.sh strumenti/<nome>.mjs <cartella degli esiti>` da `prove/`:
Chromium senza finestra, mai il desktop).

# Prima parte · Costruzione (incarico 4b, sulla pagina di prima delle correzioni)

L'aspetto e il movimento erano quelli dell'autore (`PIANO.md`, `NOTE.md`); la costruzione li rese completi e solidi senza cambiare
colori, caratteri, composizione, curve o durate, e senza togliere né attenuare movimento.

## Che cosa è stato completato, e la prova di ciascun punto

| Punto | Che cosa c'è | Prova (esiti) |
|---|---|---|
| Stati dei comandi | fermo, sopra, fuoco da tastiera, premuto, in corso, in pausa, fatto, non disponibile, su tutti i comandi; contorno del fuoco di 3 px ovunque | `stati-comandi.mjs`: 14 comandi, fuoco ottenuto e contorno visibile in tutti (`prove/stati-comandi/`, foglio `comandi-fermo-sopra-fuoco-premuto.png`, `non-disponibile-foglio.png`) |
| Ascolto | caricamento (cerchio tratteggiato), riproduzione, pausa vera con «Riprendi», fine (vale «sentita» solo con il suono vero), cambio di voce a metà, frase su frase, 40 pressioni rapide | `stati-ascolto.mjs` **57/57** (`prove/stati/`; audio finto al tempo vero, perché senza finestra l'audio vero finisce in mezzo secondo) |
| Errori e recupero | file mp3 o opus mancante, interrotto, play rifiutato, rete lenta: messaggio vicino al comando, che cosa fare, «Riprova», testo sempre leggibile, scheda più alta per il messaggio | stessa prova (parti 7 e 8), foto `prove/stati/scheda-errore-*.png`, `errore-*.png` |
| Senza JavaScript | contenuto completo, frase alternativa al posto dei comandi, lettori nativi, collegamenti a Marco, strada accesa, primo avvio fermo, niente di invisibile | `robustezza.mjs` **35/35** (`prove/robustezza/`: senza JS a 1440 e 390, copione bloccato o rotto, movimento ridotto, carattere mancante, `tempi.json` assente e anche la riserva assente) |
| Tastiera | arrivo, ascolto, cambio voce, frasi, scarica, «Non uso Linux», «Rivedi», piede solo con Tab, Invio, Spazio, Esc; il fuoco non finisce su ciò che è nascosto o coperto; al telefono «Ascolta Giulia» viene prima di «Scarica e installa»; menu del telefono con Invio, Esc, tocco fuori, Tab fuori | `tastiera.mjs` a ritmo di persona (900 ms fra due Tab) **31/31**, e a 60 ms **28/28** (`prove/tastiera/`, `prove/tastiera-veloce/`; 1440, 390, 768); `tastiera-avvio.mjs` **41/41** |
| Larghezze | 320, 360, 390, 430, 600, 768, 1024, 1280, 1440, 1920, 2560; schermo basso 1366×640; telefono in orizzontale 844×390 e 667×375 | `taglio.mjs`: 14 misure, nessun elemento fuori, tagliato o accavallato (`prove/dopo/taglio.txt`); `larghezze.mjs`: 12 foto della pagina intera dopo averla scorsa, nessuno sbordo orizzontale, 0 errori (`prove/dopo/`, pezzi guardati in `prove/finali/`) |
| Scorrimento, ritorno, ricarica, scheda in secondo piano | niente resta a metà, riparte a sproposito o invisibile; l'orologio della scena si ferma con la scheda nascosta e riparte da dove era | `scorrimento.mjs` **35/35** (`prove/scorrimento/`) |
| Movimento ridotto | arrivo, strada e primo avvio saltano al loro stato finale | sequenze `ridotto-*` a 1440 e 390 (`prove/sequenze/`), guardate |
| Effetto dell'autore | stesso o migliore | 11 sequenze registrate di nuovo (`prove/sequenze/`, 0 errori, nessuna richiesta fallita o a terzi) e 7 affiancamenti a coppie con le posizioni scambiate (`prove/confronti/`): arrivo, scorrimento e ascolto nel filo alle due misure, ascolto in alto; stessi fotogrammi, stessi tempi |

Console senza errori, nessuna richiesta fallita, nessuna richiesta a terzi in tutte le prove (`riassunto` di ogni esito).

Correzioni fatte durante la costruzione, tutte trovate guardando o misurando (dettaglio in `progresso-costruzione.md`): barra al
telefono con l'azione che spingeva fuori «Menu»; azione della barra che restava accesa tornando in cima di colpo; menu a cinque
voci a 761-1010 px; scheda del microfono nel primo avvio fuori pagina a 768 e sopra il testo a 1280; titolo con parola orfana a
320 e 768-999; riquadri della chiusura tagliati a 320; «logopedista.» attaccato al piede; etichetta «Tu» sopra «Paola» a 320;
il menu restava aperto uscendo con Tab; l'evento di errore di una fonte vecchia contava per la nuova.

## La prova di tastiera fallita: causa e correzione (ripresa dopo il riavvio)

Dopo il riavvio `tastiera.mjs` dava 25/28: nel giro di Tab mancava «Rivedi il primo avvio».

- **Causa: la pagina, non lo strumento.** Il pulsante era `hidden` (fuori dall'ordine di Tab) finché la scena del primo avvio
  gira, e la scena parte proprio quando la sezione arriva sullo schermo, cioè quando il fuoco è su «Non uso Linux», il tratto
  subito prima. Chi scende con Tab non lo incontrava. Prova (`prove/strumenti/diagnosi-rivedi.mjs`): a 60 ms fra due Tab lo
  salta, a 500 ms (ritmo di una persona) lo salta ancora, con 6,5 s di attesa su «Non uso Linux» lo trova. Lo strumento non era
  cambiato dalle 16:58. Non sono riuscito a ricostruire perché alle 17:01 passasse: i file di quella corsa sono stati
  sovrascritti alle 17:41; la dipendenza dal tempo è però dimostrata oggi. Per chi usa interruttori o lo sguardo, che avanzano
  piano, era un limite di tempo nascosto, contro la regola «nessun limite di tempo».
- **Correzione alla causa** (`scena.js`, `stile.css`): «Rivedi» resta sempre nell'ordine di Tab, anche prima che la scena parta
  e mentre gira; in quei momenti non si vede (come prima: compare a fine scena, a 5,9 s) ma, se il fuoco ci arriva, si mostra da
  sé con il suo contorno (classe `.in-scena`, `:not(:focus)`). Senza JavaScript resta nascosto (non farebbe nulla). Premuto
  durante la scena, la fa ripartire e il fuoco passa alla finestra, come già prima. In più, il fuoco che entra in un tratto non
  ancora rivelato lo rivela subito (`focusin`): non si resta su ciò che è ancora invisibile.
- **Effetto collaterale, in meglio:** prima la sezione cresceva di 48 px a scena finita (altezza pagina 3900 → 3929 px a 1440);
  ora il posto di «Rivedi» c'è fin dall'inizio e non c'è più lo scatto (misurato con `layout-rivedi.mjs`). A scena finita la
  composizione è identica a prima.
- **Strumenti aggiornati, senza allentarli:** `tastiera.mjs` ora cammina al ritmo di una persona (900 ms, più della più lunga
  entrata) e controlla anche l'opacità effettiva con gli antenati (prima guardava solo quella del pulsante); il giro a 60 ms
  resta come seconda prova. `tastiera-avvio.mjs` ha la parte nuova «a scena in corso un solo Tab da «Non uso Linux» porta a
  «Rivedi», che col fuoco si vede dentro lo schermo; Invio la riavvia; a fine scena il fuoco torna lì»
  (foto `prove/tastiera/rivedi-0-durante-la-scena-1440.png`: visto, «Scarico la voce… 7 di 53 MB» con il pulsante col fuoco).
  `scorrimento.mjs` e `tastiera-avvio.mjs` leggono lo stato nuovo di «Rivedi» invece dell'attributo `hidden`.

## Trovato e non toccato (non è mio da decidere)

- Il primo schermo a 1440 lascia una fascia vuota di circa 170 px prima di «Senti come suona»: scelta di composizione
  dell'autore (`prove/finali/intera-1440x900-p00.png`).
- Il contorno del fuoco sui collegamenti di testo («Non uso Linux…») è un rettangolo, quello dei pulsanti un'ovale
  (`prove/stati-comandi/comandi-fermo-sopra-fuoco-premuto.png`): coerente per tipo, ma diverso fra loro.
- Restano i punti deboli già scritti da chi l'ha resa (`NOTE.md`): tutta la pagina sullo stesso bordeaux, il primo avvio un po'
  sbilanciato a sinistra, la scelta del microfono come interfaccia generica, il primo schermo ancora pieno al telefono.
- I collegamenti a `installa/`, `non-ancora/`, `ascolta/`, `stato/`, `riunione/`, `aiuto/` portano a pagine che non esistono
  ancora (fuori da questa fase); versione e data nel piede sono scritte a mano, non collegate ai dati di release.
- Nelle sequenze, il fotogramma a 0 s del «filo» è più visibile che nella copia dell'autore: è l'effetto del `focusin`
  (premere un comando dentro un tratto lo rivela subito), non un cambio di movimento.

## Non verificato

- Firefox e WebKit: non partono su questa macchina (servono le librerie di `prepara-motori.sh`, che il riavvio ha cancellato da
  `/tmp`). Tutto è provato su Chromium.
- Il suono vero: mai ascoltato (browser senza finestra); i tempi delle parole delle frasi 1 e 2 sono stimati, come già nelle
  note dell'autore. L'ascolto è provato con un audio finto che corre al tempo vero.
- Lettori di schermo veri (Orca, NVDA, VoiceOver), interruttori, puntamento con lo sguardo e telefoni veri: non provati;
  la tastiera e il tocco sono provati con Chromium (telefono emulato).
- Testo ingrandito al 200% e zoom del browser: non provati.
- Prestazioni su dispositivi lenti: non toccate di proposito (vengono dopo l'approvazione dell'aspetto).

---

# Seconda parte · Dopo le correzioni (incarico 6b)

**Pagina:** `percorso/sito/`. Partenza di questo incarico (com'era dopo le correzioni della direzione, prima di toccarla): copia in
`scartate/prima-di-6b/` (index 5f0a7d9a…, scena.js 5acab21e…, stile.css 56184653…). **File consegnati** (`prove/sito-sha256.txt`):
`index.html` 5f0a7d9a… (non toccato), `scena.js` 52dd59b9…, `stile.css` 01bc0add…. Tutto ciò che segue è stato lanciato sugli
stessi tre file, dopo l'ultima modifica (confronto delle impronte prima e dopo il giro: uguali). Le prove nuove sono rosse sulla pagina
di prima, e le rosse stanno in `prove/prima-6b/`.

## Che cosa ho completato, e la prova di ciascun punto

| Punto | Che cosa c'è ora | Prova (esiti in `prove/`) |
|---|---|---|
| **P6, l'audio che non si carica** | La scena non finge che la voce abbia parlato: la bolla torna alla frase scritta, piena, senza parole accese né forma detta, in alto e nel filo (`scena.js`, `palco.scritta` chiamata da `fallisci`). In alto il messaggio, «Riprova» e il collegamento al file prendono il posto delle frasi nella scheda (tornano con «Riprova», con una voce o con «Chiudi») e stanno interi nello schermo senza scorrere a 1440×900 (fondo del messaggio a 880 px, scheda intera a 889) e a 390×844 (799 e 808). Dove lo schermo è più basso la pagina porta il messaggio in vista da sé. | `errore-visibile.mjs` (nuova): **133/133** a 7 misure (1440×900, 390×844, 1280×720, 1024×768, 768×1024, 1366×640, 844×390), con audio vero bloccato: messaggio, «Riprova» e collegamento dentro lo schermo e non coperti, scheda intera nello schermo, testo della bolla uguale alla frase scritta, nessuna forma detta visibile né parola spenta, bolla piena, finestra senza «Sto parlando…», «Tu» che non parla, comando che torna «Ascolta», «Riprova» che fa parlare davvero. Sulla pagina di prima: 12 rosse su 36 a 1440 e 390 (`prima-6b/errore-prima-6b/`); foto `errore/alto-*.png`, `errore/filo-*.png` |
| **P15, senza JavaScript** | Confermato guardando: la finestra del primo avvio («Per parlare… Scarica la voce») e la riunione accanto («Microfono del computer») mostrano entrambe l'inizio, un momento solo; requisiti leggibili; «Rivedi» assente. | `robustezza.mjs` **39/39** (le due verifiche nuove sul primo avvio a 1440 e 390); foto `robustezza/senza-js-primo-avvio-1440.png` e `-390.png` |
| **Le 6 verifiche di `stati-ascolto.mjs`** | Aggiornate al comportamento voluto da P5 senza allentarle: lo stato «sta suonando» si legge sul comando della frase (non sul selettore, che dice solo quale voce è scelta); ripremere la voce scelta fa sentire di nuovo la frase da capo (non la ferma, come prima). Per ognuna è stata aggiunta la verifica su ciò che prima la copriva (comando della frase, voce scelta, traccia, tempo). | `stati-ascolto.mjs` **100/100**; sulla pagina di prima le stesse prove nuove danno 82/95 (13 rosse, `prima-6b/stati-nuove-su-prima-6b/`) |
| **Scelta della voce (P5), completata** | Annuncio per i lettori di schermo («Voce scelta: Marco.», nel filo «…Sto leggendo la frase 2.»), una volta per discorso, quando il suono parte davvero (se non parte parla l'avviso dell'errore). A riposo, premere una voce la fa sentire. Il fuoco resta sul pulsante della voce. | stesse prove (parti 1, 2, 3, 9): a riposo si sente (filo e in alto), annuncio dice voce e frase, Invio e Spazio da tastiera, fuoco che resta sul pulsante, cambio a metà frase (da capo, una sola traccia, una sola voce scelta), 40 pressioni rapide in alto e nel filo (al massimo una traccia, una voce scelta, comando e finestra concordi), errore della voce (in alto a 1440 e 390 e nel filo: il messaggio dice «Marco, mp3», Marco resta scelta, la bolla è scritta, «Riprova» fa sentire Marco), tastiera sull'errore in alto (fuoco a «Riprova» e ritorno alla frase, Esc chiude). **Non verificato con un lettore vero**: vedi sotto |
| **Verifica nuova: il primo schermo accanto a quello scelto** | Ogni elemento del primo schermo (barra, titolo, presentazione, azioni, «Oggi», bolla, riunione, finestra, «Ascolta Giulia»), carattere, grandezza e colore, messo accanto a `direzione-2/sito/` (non alla copia del passo prima): uguali a ±1 px a 1440×900 e 390×844, salvo le due correzioni voluta e dichiarate (didascalia sotto la colonna sinistra, finestra 12 px più in basso); al telefono identico; «Aiuto» finisce a 1360. | `primo-schermo.mjs` (nuova) **7/7**; sulla pagina di prima delle correzioni è rossa (menu −235 px, telefono +14 px; `prima-6b/primo-schermo-su-prima-delle-correzioni/`). Anche: `attacco-titolo.mjs` (il titolo comincia 19 ms dopo la scelta a 1440, 17 a 390: un fotogramma); `confronti/scelta-arrivo-*`, `scelta-ascolto-1440x900` (fogli a coppie con le posizioni scambiate) e `pixel-*.txt` (scarto per fotogramma: la parte alta a 1440 è uguale a riposo, scarta solo dove si muove; il resto sta nella finestra e nella scheda, cioè le correzioni volute e P5) |
| **Verifica nuova: l'errore guarda ciò che vede la persona** | Vedi P6: misura dove sta il messaggio rispetto allo schermo e che cosa mostra la scena, non solo il testo. | `errore-visibile.mjs` e le parti nuove di `stati-ascolto.mjs` (sezione 7: bolla scritta, messaggio nello schermo senza scorrere) |
| **Tratti nuovi a tutte le larghezze** | 320, 360, 390, 430, 600, 761, 768, 780, 800, 860, 900, 1000, 1010, 1011, 1024, 1100, 1180, 1181, 1250, 1280, 1366×640, 1383, 1384, 1440, 1920, 2560, 844×390, 667×375: niente fuori, tagliato, accavallato, coperto, più largo della sua scatola; nessuno sbordo orizzontale; colonna delle bolle del filo a 19 larghezze. Il difetto trovato a 761-1010 e gli altri sono sotto. | `taglio.mjs` (esteso: ora vede anche il testo più largo della sua scatola e il testo coperto da una finestra) a 14 misure e a 14 di mezzo: **niente da segnalare**; `larghezze.mjs` 19 foto della pagina intera (`dopo/`, scorsa prima; i pannelli fotografati a fine entrata); `filo-larghezze.mjs` **57/57**; `scene-larghezze.mjs` foto del filo, della scena «Che cosa serve» e della chiusura a 12 larghezze ciascuna, dopo averle scorse (`scene-serve/`); composizioni guardate in `finali/` |
| **Movimento ridotto in sequenza** | Ogni scena al suo stato finale, nessuna entrata legata allo scorrimento; guardato. | sequenze `ridotto-arrivo`, `ridotto-scorri` (1440 e 390), `ridotto-ascolto` (1440) in `sequenze/`; `robustezza.mjs` (movimento ridotto) |
| **Sequenze registrate di nuovo e affiancate** | 17 sequenze (arrivo, ascolto con attesa 1,5 s e 7 s, scorri, frase 3, Marco, filo, ridotto), tutte 0 errori. Accanto al primo schermo scelto (`direzione-2/sequenze/`) e a ciò che la direzione aveva registrato (`correzioni/sequenze/`): stesso effetto, frame per frame nello scorrimento. | `sequenze/` (17), `confronti/` (9 coppie con le posizioni scambiate, 5 tabelle di pixel); fogli guardati |
| **Tastiera** | Tutto il percorso con Tab, Invio, Spazio, Esc, ai due ritmi (900 ms, e 60 ms che scopre ciò che compare dopo un po'); il fuoco su ogni tappa si vede (opacità effettiva piena, contorno ≥ 2 px), non è coperto né nascosto. | `tastiera.mjs` **31/31** e **28/28** (60 ms), `tastiera-avvio.mjs` **41/41** |
| **Scorrimento veloce, ritorno, ricarica, scheda in secondo piano** | Come prima, più le scene nuove: la chiusura che saluta (finisce, tutte le parole accese, «Tu» non parla più; con un ascolto in corso nel filo non lo interrompe e parte da sé quando finisce), i pannelli a tutta larghezza dove la persona li guarda dopo salti avanti e indietro, e l'entrata che non taglia il testo. | `scorrimento.mjs` **67/67** (A–D come prima, E scene nuove 18, F entrata dei pannelli 14; eseguito in tre pezzi AB, CD, EF) |
| **Stati dei comandi** | fermo, sopra, fuoco da tastiera, premuto, non disponibile; voce scelta piena e l'altra a contorno nel filo e in alto. | `stati-comandi.mjs`: 14 comandi con fuoco ottenuto e contorno visibile; foglio `stati-comandi/comandi-fermo-sopra-fuoco-premuto.png` e `non-disponibile-foglio.png`, guardati |
| **Console, richieste** | Nessun errore della pagina, nessuna richiesta fallita (salvo i file che le prove bloccano apposta), nessuna richiesta a terzi. | riassunto di ogni esito |

## Difetti trovati guardando e corretti (nati dalle correzioni: le prove di prima non potevano vederli)

Ognuno ha una prova nuova che è rossa sulla pagina di prima e verde ora.

1. **Senza JavaScript la barra era illeggibile sulla scena chiara.** La classe `compatta` (barra piena) la mette lo script; senza,
   la barra restava trasparente con il testo chiaro sopra il fondo rosa della scena «Che cosa serve». Ora è piena da sé
   (`html:not(.js) .barra`; in cima trasparente come nel primo schermo scelto, dove il browser sa legare l'animazione allo scorrimento).
   Prova: `senzajs-barra.mjs` **15/15**; foto `senzajs-barra/senzajs-barra-chiara-1440.png` (prima: `prima-6b/senzajs-barra-prima/`).
2. **Nel filo la colonna delle bolle si stringeva fino a spezzare e tagliare le parole a 761-900 px** (145 px a 761): una riga delle
   correzioni annullava la tavoletta già prevista. Sotto 1011 px il filo va in una colonna, con la riunione (440 px) sopra le bolle;
   da 1011 px in su è com'era. Prova: `filo-larghezze.mjs` 57/57 (prima 47/57) e `taglio.mjs`, che ora vede il testo più largo della sua
   scatola (rosso a 761 e 800 sulla pagina di prima, `prima-6b/…`).
3. **A 761-880 px e a 1181-1400 px la finestra della riunione, tirata su di 22 px, copriva la fine della nota «Le frasi che dici
   restano qui, per ripeterle.»** del primo avvio. Quando la colonna è stretta (container query a 790 px, misurata sulla colonna) sta
   sotto la finestra di Kalliope, senza sovrapporsi; a 1440 l'aspetto è quello di prima. Prova: `taglio.mjs` (testo coperto), rosso a 761,
   800, 1181, 1366 e 844×390, nessuna segnalazione dopo; foto `scene-serve/serve-*.png`.
4. **L'entrata dei pannelli tagliava le prime lettere di ogni riga** a 445-760 px (ritaglio di 27 px contro un margine di 20) e a
   1068-1180 px (50 contro 48): il ritaglio ai lati non supera ora il margine della pagina meno 2 px (a 1440 è identico a prima).
   Prova: `scorrimento.mjs` parte F **14/14**; sulla pagina di prima è rossa (600: 25,9 > 20; 1180: 50,5 > 48).
5. **Portare in vista il messaggio d'errore dove lo schermo è basso** non funzionava: si misurava mentre la scheda si apriva
   rimpicciolita, e il messaggio sembrava già in vista (a 1024×768 restava fuori). Ora si misura a scheda aperta. Prova:
   `errore-visibile.mjs` a 1024×768 (era l'unica misura rossa).
6. **Il fuoco cadeva sulla pagina quando «Riprova» spariva premendolo, e quando le frasi lasciavano il posto al messaggio** (frase
   premuta da tastiera). Ora va a «Riprova», e a «Riprova» premuto torna al comando della frase. Prova: `stati-ascolto.mjs` 9d e 9e.

## Scelte mie dentro il perimetro, da sapere

- **In alto l'errore prende il posto delle frasi** nella scheda, finché c'è. È la sola scelta possibile perché a 1440×900 e a
  390×844 stia tutto nello schermo senza spostare il primo schermo (sotto la scheda restano 168 px a 900 e 242 px a 844): con le frasi
  e l'errore insieme il fondo sarebbe a 978 e a 943 px. Si perde per un momento la scelta di un'altra frase: ritorna con «Riprova»,
  con una voce o con «Chiudi». Se il proprietario la vuole sempre visibile, serve più spazio nel primo schermo (non l'ho toccato).
- **Le foto della pagina intera** (`larghezze.mjs`) mostrano i pannelli a fine entrata: la foto non scorre e senza questo
  risulterebbero tutti ristretti ai lati. L'entrata si guarda nelle sequenze (`scorri-*`).

## Trovato e non toccato

- **Primo schermo a 761-1010 px:** la barra mostra «Menu» al posto delle cinque voci che nella direzione scelta stanno in barra
  (a 768: 15 scarti, `primo-schermo/esiti-primo-schermo.json`; la didascalia sta anche in un altro posto). È una decisione presa in
  4b, quando l'azione della barra (allora fissa) tagliava il menu; con l'azione che ora non occupa posto a riposo le cinque voci
  starebbero, ma cambierebbe tra riposo e scorrimento. Da decidere. A 1440, 1280, 1024 e 1920 il primo schermo è identico alla scelta.
- **A 1181-1230 px l'etichetta «Tu · microfono «Kalliope»» esce di 7 px dal riquadro «Tu»** del primo schermo: è così anche nella
  direzione scelta (`direzione-2/sito/`), identico misurato a 1181, 1250 e 1440.
- Il contorno del fuoco sui collegamenti di testo è un rettangolo, quello dei pulsanti un'ovale (già scritto in 4b).
- Le pagine collegate (`installa/`, `non-ancora/`, …) non esistono; versione e data nel piede sono scritte a mano.
- Le foto di scena (`scene-serve/`) mostrano a volte la barra fissa in un angolo: è la barra vera al momento della scorsa, non un difetto.

## Non verificato

- **Firefox e WebKit:** non partono su questa macchina (servono le librerie di `prepara-motori.sh`, che il riavvio ha cancellato da
  `/tmp`). Tutto è provato su Chromium. In particolare l'entrata dei pannelli (animazione legata allo scorrimento) e la barra piena
  senza JavaScript usano `animation-timeline`, che in altri browser può mancare: lì i pannelli entrano senza allargarsi e la barra
  senza script è sempre piena (ripiego previsto), ma non l'ho visto.
- **Il suono vero**: mai ascoltato; l'ascolto è provato con un audio finto che corre al tempo vero e con l'audio vero (finisce in mezzo
  secondo in un browser senza finestra).
- **Lettori di schermo veri** (Orca, NVDA, VoiceOver): ho provato che il testo dell'annuncio e l'avviso (`role="alert"`) cambiano
  come devono, non come li pronuncia un lettore. **Telefoni, interruttori e puntamento con lo sguardo veri**: non provati.
- Testo ingrandito al 200% e zoom del browser: non provati.
- Prestazioni su dispositivi lenti: non toccate di proposito (vengono dopo l'approvazione dell'aspetto).

---

# Terza parte · Dopo il secondo giro (incarico 8b)

**Pagina:** `percorso/sito/`. Partenza di questo incarico (la pagina com'era dopo il secondo giro della direzione, prima di toccarla): copia in
`scartate/prima-di-8b/` (index d9c2631a…, scena.js 9dfb4136…, stile.css 7c1fc0c1…). **File consegnati** (`prove/sito-sha256.txt`): `index.html`
cfbe6481…, `scena.js` 033d6405…, `stile.css` bec993ee…. Tutto ciò che segue è stato lanciato sugli stessi tre file, dopo l'ultima modifica (le
impronte prima e dopo il giro sono uguali). Le prove nuove e quelle della skill sono rosse sulla copia di prima: i risultati rossi stanno in
`prove/prima-8b/`. La configurazione degli strumenti della skill è `prove/metodo.config.mjs` (base `http://127.0.0.1:8781`, la pagina scorsa tutta
perché ogni tratto si riveli, esiti in `prove/metodo-qa/`); `prove/soglie.txt` ha le soglie lette dai fogli di stile.

## I due punti che il giudice lasciava

| Punto | Che cosa ho deciso e fatto | Prova (esiti in `prove/`) |
|---|---|---|
| **N6, «Menu» al posto delle cinque voci fra 761 e 1010 px** | Le cinque voci tornano in barra da **960 px**; sotto, «Menu» (a 768 le voci andavano su due righe). La larghezza l'ho misurata e guardata, anche con «Scarica e installa» entrato: marchio 139 + voci 518 + azione 171 + 16 di posto + due margini da 48 = 940 px; a 960 restano 20 px d'aria fra le scatole di marchio e voci (circa 36 fra le parole) e 16 fra voci e azione; a 1000 sono 60 e 16. Foto `barra-voci/barra-959-con-azione.png`, `barra-960-riposo.png`, `barra-960-con-azione.png`, `barra-980-con-azione.png`. | `barra-voci.mjs` (nuova) **120/120** a 16 larghezze, a riposo e con l'azione entrata: ogni voce su una riga, marchio-voci-azione ad almeno 16 px, tutto dentro lo schermo sul margine; sotto 960 «Menu» apre le cinque voci e Esc le chiude; `tastiera.mjs` a 960 e 1010 (le voci stanno nell'ordine di Tab); `tastiera-avvio.mjs` ora prova il menu a 959 (non più a 1010) |
| **N3, barra trasparente dopo un salto di pagina** | Dopo un salto (un'àncora, il fuoco da tastiera, «Fine») la barra si riempie subito, senza la dissolvenza di una scorsa; scorrendo piano la dissolvenza resta (`scena.js`, `sullaBarra`: un salto è più di 48 px fra due fotogrammi). | `barra-salto.mjs` (nuova) **33/33**: quattro salti a quattro larghezze, il fondo della barra a ogni fotogramma dopo il salto è pieno; e scorrendo piano non si riempie di colpo. Sulla copia di prima: 16 verifiche rosse su 33, con 13 fotogrammi su 35 con la barra non piena (circa 320 ms), a ogni larghezza (`prima-8b/barra-salto/`) |

## I quattro difetti trovati dagli strumenti della skill (mai visti dalle mie prove né dal giudice), corretti alla causa

| Difetto | Causa e correzione | Prova |
|---|---|---|
| **«31 dicembre» e «alle 15:30» a capo nel mezzo** (A CAPO NEL MEZZO: 25 segnalazioni a 22 misure su 44, anche nel primo schermo: 22 volte «31 dicembre», 3 volte «alle 15:30» a 1366×640, 1366×759 e 1366×802) | Ogni parola della frase è un elemento a sé separato da uno spazio, e la riga si può spezzare dove c'è uno spazio. Le unità («31 dicembre.», «alle 15:30?», e per prudenza «1.250 € +») stanno ora in un contenitore che non va a capo (`.unita`, `white-space: nowrap`), nella frase resa dallo script (`rendiFrase`, `montaPezzi`), nel testo scritto che torna dopo un errore (`testoScritto`) e nell'HTML delle tre bolle. Le parole e gli spazi sono quelli di prima: il testo reso è uguale carattere per carattere (verificato) e `FRASI[n].testo`, che corrisponde all'audio, non è toccato; cambia solo dove la riga può spezzarsi. | `esame-impaginazione` **44 misure pulite** (sulla copia di prima 25 segnalazioni a 22 misure, `prima-8b/esame-*.txt`), `dispositivi-qa` **15/15** (7 su 15 rossi prima); `bolla-testi.mjs` (nuova) **124/124**: il testo reso di ogni bolla (filo, primo schermo, dopo l'errore) è la frase carattere per carattere, e ogni unità sta su una riga, a 14 larghezze; sulla copia di prima 15 verifiche rosse (`prima-8b/bolla-testi/`) |
| **Sotto 335 px la bolla del primo schermo copre la didascalia** (COPERTO a 320 e 334, anche Pura X chiuso 326×326) | La bolla cresce verso l'alto dal fondo del suo posto, alto 108 px al telefono: a 320-334 px la frase 2 va su quattro righe e sale di 14 px sopra la didascalia che sta subito sopra. Il posto prende ora l'altezza della bolla più alta fra le tre frasi a quella larghezza (`riserva`, variabile `--bolla-max`, `min-height`), misurata a pagina caricata e a caratteri arrivati. Una sporgenza fino a 4 px non conta: a 1440 la frase 2 sporge di 2 px anche nella direzione scelta, e senza questa tolleranza tutto il primo schermo scendeva di 2 px (lo ha visto `confronta-scelta`). Vale anche col testo più grande: il posto cresce con la bolla. | `esame-impaginazione` a 320 e 334 pulito (era COPERTO); `dispositivi-qa` Pura X chiuso pulito; `bolla-testi.mjs`: «la bolla non copre la didascalia» a 320, 334, 349, 360, 390, 600; `confronta-scelta` «solo differenze ammesse» a 1440 e 390 |
| **«Microfono del computer» sembra un pulsante** (`pulsanti-finti-qa`: `li.scelta.scelto`, a 1440 e a 390) | **Resta così, e lo scrivo.** È la barra di un'altra app di riunione, ricostruita nel nostro mondo (nessuna app copiata): la scelta è un segmento con lo stesso linguaggio dei comandi della pagina, ma non si preme. Alla persona lo dice la nota che le sta accanto («Ricostruzione del primo avvio di Kalliope 0.1 e della scelta del microfono in un'app di riunione · tempi accelerati»), il puntatore non diventa una mano, e la scelta cambia da sola nel racconto. A chi usa un lettore di schermo è un'immagine con la sua descrizione (`role="img"`, «Ricostruzione: nell'app della riunione si sceglie «Kalliope» come microfono»); ciò che c'è dentro è nascosto ai lettori e nessun elemento è raggiungibile con Tab. Non l'ho trasformata in un comando finto che non fa niente, né l'ho disegnata diversa: cambierebbe ciò che la direzione ha deciso. | `robustezza.mjs` (parte nuova) **45/45**: dentro `.riunione-app` nessun elemento focalizzabile, contenitore `role="img"` con la descrizione, nota accanto, cursore non «mano»; `pulsanti-finti-qa` la segnala ancora (stesso elemento, a 1440 e a 390), spiegata qui |
| **Colore della didascalia `0.7` invece di `0.78`** | Rimesso com'era nella scelta (`.didascalia`, `color: rgba(255, 237, 239, 0.78)`). La differenza di posizione e larghezza della didascalia resta dichiarata (sta sotto la colonna sinistra: giudizio/D2.md, PIANO.md). | `primo-schermo.mjs` **9/9**, con la verifica nuova «il colore della didascalia e dei testi del primo schermo è quello della scelta» (a parte, perché in `ammesse.json` la dichiarazione vale per l'elemento intero e coprirebbe anche il colore); `confronta-scelta` «solo differenze ammesse» a 1440 e 390 (era un COLORE non dichiarato) |

## Il punto debole dichiarato dalla direzione: la scheda dell'ascolto sugli schermi bassi

| Che cosa | Prova |
|---|---|
| Aprendo l'ascolto in alto a 1366×640, 1024×600 e 1280×720 la scheda finiva in parte sotto il bordo (a 1366×640 le frasi a 631-673 su 640). Ora, a scheda aperta, la pagina la porta in vista da sola (`inVista`, la stessa regola del messaggio d'errore, estesa: misura a scheda aperta e tiene conto della riunione agganciata al telefono). Dove ci sta già (1440×900, 390×844) la pagina non si muove. **Trovato aprendola a 320-349 px:** «Chiudi» e le frasi uscivano a destra dallo schermo (`Chiudi` finiva a 360 px con lo schermo a 320), perché le due voci e «Chiudi» non stavano su una riga (343 px contro 304) e allargavano la scheda; ora «Chiudi» va sotto le voci, a destra, e le frasi vanno a capo. Succede identico nella direzione scelta (misurato a 320, 340, 349, 360): corretto soltanto nella scheda aperta, che è un gesto; il primo schermo a riposo non cambia. | `scheda-visibile.mjs` (nuova) **137/137** a 15 misure (1366×640, 1024×600, 1280×720, 1024×768, 1280×699, 1366×759/802, 1440×900, 844×390, 667×375, 390×844, 360×740, 349, 340, 320): la scheda, le due voci, «Chiudi» e le tre frasi sono dentro lo schermo e non sotto la barra; dove ci sta la pagina non si muove; «Chiudi» richiude e il fuoco torna a «Ascolta Giulia». Sulla copia di prima 41 verifiche rosse su 111, a 1366×640, 1024×600, 1280×720 e agli schermi stretti (`prima-8b/scheda-visibile/`); foto `scheda-visibile/scheda-1366x640.png`, `scheda-1024x600.png`, `scheda-320x640.png` |

## Ciò che il secondo giro ha cambiato, completato

| Punto | Prova (esiti in `prove/`) |
|---|---|
| Stati e ascolto: la frase cambia dentro la stessa bolla (le parole vecchie sfumano, la bolla cambia misura), voce scelta, pausa, riprendi, fatto, cambio a metà, frase su frase, pressioni rapide, tutte le prove di annuncio | `stati-ascolto.mjs` **100/100** |
| Errori e recupero (audio mancante, interrotto, play rifiutato, lento; in alto e nel filo; al telefono con la riunione agganciata sotto la barra; con la frase al centro, appena sotto la riunione e in fondo allo schermo): messaggio e «Riprova» interi nello schermo, scena che non finge, fuoco che non si perde | `errore-visibile.mjs` **231/231** a 7 misure (la parte nuova: tre posizioni della frase nel filo). Sulla copia di prima il filo al telefono passa già: non ho trovato un difetto con la riunione agganciata; il controllo in più in `inVista` è una precauzione, non una correzione provata |
| Tastiera a due ritmi (900 ms, più lento della più lunga entrata; 60 ms), giro intero con Tab, Invio, Spazio, Esc; il fuoco su ogni tappa si vede e non è coperto; «Rivedi il primo avvio» raggiungibile | `tastiera.mjs` **51/51** e **46/46** (1440, 390, 768, 1010, 960); `tastiera-avvio.mjs` **41/41** |
| Senza JavaScript, carattere o tempi mancanti, movimento ridotto | `robustezza.mjs` **45/45**; `senzajs-barra.mjs` **15/15** |
| Scorrimento veloce, ritorno, ricarica, scheda in secondo piano, la chiusura che saluta, i pannelli | `scorrimento.mjs` **67/67** (A–B 15, C–D 20, E 18, F 14). **La prova di ricarica ha trovato una regressione mia:** con la prima versione di `riserva()` la posizione dopo una ricarica a metà pagina passava da 2269 a 2479 px a 390 (e da 2037 a 2111 a 1440), perché la prima misura forzava il layout mentre la pagina si leggeva. Provato con tre copie di prova (senza la misura: verde; senza il css nuovo o senza le unità: rosso); ora si misura a pagina caricata e a caratteri arrivati (2269 → 2269) |
| Stati dei comandi visti da fuori | `stati-comandi.mjs`: 14 comandi con fuoco ottenuto e contorno visibile; fogli `stati-comandi/comandi-fermo-sopra-fuoco-premuto.png`, `non-disponibile-foglio.png` |
| Tutte le larghezze | `taglio.mjs` a 14 misure e a 17 di mezzo (761, 780, 800, 860, 900, 940, 959, 960, 1000, 1010, 1011, 1100, 1180, 1181, 1250, 1383, 1384) senza segnalazioni; `larghezze.mjs`: 21 foto della pagina intera (`dopo/`), nessuno sbordo; `filo-larghezze.mjs` **57/57**; foto di scena «Che cosa serve», filo e chiusura a 8-12 larghezze ciascuna (`scene-serve/`, composizioni in `finali/`) |
| Il primo schermo accanto a quello scelto | `primo-schermo.mjs` **9/9** (uguale a ±1 px a 1440×900 e 390×844, salvo la didascalia e la finestra 12 px più in basso, dichiarate); `confronta-scelta.mjs` con `ammesse.json` (14 voci, ognuna col suo motivo): **«solo differenze ammesse»** a 1440×900 (2,91% di pixel diversi) e 390×844 (0%); `confronti/scelta-*` fogli a coppie con le posizioni scambiate e `pixel-*.txt` |
| Sequenze registrate di nuovo e guardate | 18 sequenze alle due misure (arrivo, scorrimento, ascolto in alto con attesa di 1,5 e di 7 s, una frase nel filo, Marco, movimento ridotto di arrivo, scorrimento e ascolto), tutte senza errori; 9 coppie accanto alla direzione scelta e a ciò che la direzione aveva registrato nel secondo giro (`confronti/`): stessi fotogrammi; l'unica differenza visibile è «31 dicembre» che non si spezza |

## Gli strumenti della skill: che cosa hanno trovato e dove sbagliano

- **Trovato davvero, e corretto:** le due righe spezzate nel mezzo, la bolla che copre la didascalia, il colore non dichiarato, il 2% di spostamento del primo schermo (`confronta-scelta`, per effetto di un mio correttivo), il pulsante finto (spiegato).
- **`confronta-scelta.mjs`, due limiti.** (1) Una differenza dichiarata in `ammesse.json` vale per l'**elemento intero**: dichiarare la sola posizione della didascalia copre anche il suo colore (il difetto che si voleva trovare). Serve poter dichiarare per tipo (`{"chi": …, "che": "SPOSTATO"}`). Io l'ho aggirato con una verifica a parte nel mio `primo-schermo.mjs`, ma va corretto nella skill. (2) Riconosce gli elementi dal testo: l'etichetta «Tu · microfono «Kalliope»», che nella home è divisa in due elementi (sotto 350 px la seconda parte si nasconde) con lo stesso aspetto, stessa posizione e stessa misura, viene segnalata come una cosa mancante e due in più. Va dichiarata ammessa; l'abbinamento per posizione e misura la riconoscerebbe.
- **`esame-impaginazione.mjs`, `dispositivi-qa.mjs`: non aprono gli stati** (una scheda che si apre, un messaggio d'errore). La scheda dell'ascolto che a 320-349 px usciva a destra, e quella che a 1366×640 finiva sotto il bordo, non le ha viste nessuno dei due: le ha trovate le mie prove `scheda-visibile.mjs` e `errore-visibile.mjs`. Un'azione `dopo` per ogni stato nella configurazione (come fa già con le pagine) coprirebbe il caso, ma le pagine sono una per nome: servirebbe elencare gli stati.
- **Nessuno strumento della skill copre la ricarica a metà pagina:** la regressione dello scorrimento ripristinato (sopra) l'ha vista solo `scorrimento.mjs`.
- **`contrasto-qa.mjs`** (il progetto non dichiara un minimo): i valori più bassi sono il «Ferma» disattivato della finestra ricostruita di Kalliope, 2,48:1 (grigio chiaro su bianco: ricostruisce il comando disattivato dell'app vera, e il testo «Ferma» si legge ma è tenue, come in un comando spento), la nota di ricostruzione 5:1 al telefono e 5,89:1 al computer, «Scarica e installa» 6,15:1; tutti gli altri 306 testi misurati stanno sopra. Non vedo un testo che si legga male: il solo debole è un comando disattivato.
- **`link-spenti-qa.mjs` e `transizioni-qa.mjs`:** puliti, nessun errore dello strumento.

## Trovato e non toccato (non è mio da decidere)

- Sotto i 335 px, quando la bolla mostra una frase più corta (la frase 1: due righe invece di quattro), fra la didascalia e la bolla resta uno spazio di circa 48 px: è il posto riservato alla frase più lunga, perché non si sposti la riunione al cambio di frase (`prove/dopo/intera-320x640.png`). Si può ridurre a un mestiere diverso (per esempio ancorare la bolla in alto), ma è una scelta di composizione.
- Sotto i 803 px di altezza il primo schermo differisce dalla scelta per le regole degli schermi bassi della direzione (riunione accorciata, `CORREZIONI-2.md` punti 4 e 7): è dichiarato da lei e non tocca le due misure del cancello; `primo-schermo.mjs` lo riporta come «INFO» (1280×800: la riunione 359 invece di 362 px; 1024×768: la colonna sinistra sale di 24 px).
- Il «Ferma» disattivato della finestra ricostruita a 2,48:1 (sopra).
- Restano quelli dei giri prima: a 1181-1230 px l'etichetta «Tu · microfono «Kalliope»» esce di 7 px dal riquadro (così anche nella scelta), il contorno del fuoco dei collegamenti di testo è rettangolare, le pagine collegate non esistono, versione e data del piede sono scritte a mano.

## Non verificato

- **Firefox e WebKit:** non partono su questa macchina (servono le librerie di `prepara-motori.sh`, che il riavvio ha cancellato da `/tmp`; non le ho rifatte). Tutto è su Chromium. L'entrata dei pannelli e la barra piena senza JavaScript usano `animation-timeline`; la riunione agganciata al telefono usa `position: sticky` dentro un contenitore con `display: contents`; la riserva della bolla e la scheda portata in vista dipendono da `scrollIntoView` e dai container query: non li ho visti in altri motori.
- **Lo zoom del browser e il testo ingrandito al 200%** (il direttore lo cita fra i punti da provare): non provati. La riserva dell'altezza della bolla è pensata per seguirli, ma non l'ho misurata; `esame-impaginazione.mjs` si è lanciato nel modo «normale» come chiesto dall'incarico.
- **Il suono vero:** mai ascoltato (browser senza finestra); l'ascolto è provato con un audio finto che corre al tempo vero e con l'audio vero (che in un browser senza finestra finisce in mezzo secondo).
- **Lettori di schermo veri, telefoni veri, interruttori e puntamento con lo sguardo:** non provati; ho provato il testo degli annunci e degli avvisi, non come li pronuncia un lettore.
- Le prestazioni sui dispositivi lenti: non toccate di proposito (vengono dopo l'approvazione dell'aspetto).

# Quarta parte · Dopo il terzo giro (incarico 8d)

**Pagina:** `percorso/sito/`. Partenza di questo incarico (la pagina com'era dopo il terzo giro della direzione, prima di toccarla): copia in
`scartate/prima-di-8d/` (index cfbe6481…, scena.js a9b39418…, stile.css a3cec190…; sono le impronte di `correzioni-3/sito-sha256.txt`). La partenza
della direzione, prima di M1 e M2, è in `scartate/prima-del-terzo-giro/`: è la copia «rossa» delle prove sugli schermi bassi. **File consegnati**
(`prove/sito-sha256.txt`): `index.html` cfbe6481… (non toccato), `scena.js` 49d54cad…, `stile.css` e04e0b64…. Tutto ciò che segue è stato lanciato
sugli stessi tre file, dopo l'ultima modifica: le impronte prima e dopo il giro sono uguali (`prove/sito-sha256-8d-prima.txt`). Gli esiti rossi sulle
copie di prima stanno in `prove/prima-8d/`. La configurazione della skill, `prove/metodo.config.mjs`, ha ora gli stati (`riposo`, `ascolto-aperto`,
`menu-aperto`, `errore-alto`, `errore-filo`, `frase-filo-suona`, ognuno con `dopo` e `inVista`; la scena accanto al gesto è nell'elenco di `inVista`:
`'#ascolto, .palco .bolla-corpo'`) e `ricostruzioni: '.riunione-app'`; le prove nuove sono `ascolto-bassi.mjs`, `etichetta-tu.mjs`, `menu-basso.mjs`.

## M1 e M2 (i due punti del giudice, corretti dalla direzione): completati e provati

| Punto | Che cosa ho verificato e completato | Prova (esiti in `prove/finale/`) |
|---|---|---|
| **M1 a 1024×600, 1280×720, 1366×640, 1024×768, 1280×600** | Con la scheda aperta si vedono insieme la bolla (sotto la barra), la riunione e i comandi; la finestra di Kalliope se ne va e torna. Ognuna delle tre frasi con Giulia e con Marco, pausa, riprendi, cambio di voce a metà, errore e «Riprova», «Chiudi» e ritorno del fuoco a «Ascolta», Maiusc+Tab, apri e chiudi in fretta; scena misurata (bolla sotto la barra, riunione nello schermo, scheda intera). | `ascolto-bassi.mjs` **522/522** a 14 misure; con «riduci movimento» **264/264** (`RIDOTTO=1`, 7 misure); `scheda-visibile.mjs` **231/231** (la bolla sotto la barra e la riunione nello schermo, non solo il comando); `errore-visibile.mjs` **578/578**. Rosso sulla copia della direzione: `ascolto-bassi` 140/190, `scheda-visibile` 160/165, e l'esame della skill dà COPERTO DOPO IL GESTO (bolla sotto la barra) a 1024×600, 1280×720, 1366×640, 1024×768, 1280×600. |
| **M1 a 844×390 e 667×375 (telefono girato)** | Vincono i comandi, come ha deciso la direzione (`CORREZIONI-3.md`, «Telefono girato»): la bolla non sta nello schermo insieme alla riunione e alla scheda. Misurato: bolla 32 px sopra lo schermo a 844×390 (era 143) e 35 a 667×375 (era 85); la riunione e la scheda stanno nello schermo. | `ascolto-bassi`, `scheda-visibile` (le due misure sono dichiarate nelle prove, con la tolleranza); l'esame della skill le segnala ancora (FUORI VISTA, spiegato sotto). |
| **M2: l'etichetta «Tu» e il titolo** | A 350-374 px «Tu» corto, titolo in tre righe, collegamento su una riga; a 1181-1209 px l'etichetta intera a 12 px sta nel riquadro; non tocca le altre. | `etichetta-tu.mjs` **133/133** (20 larghezze strette e 11 di mezzo); rosso sulla copia della direzione 121/133 (350-370 e 1181-1190). L'esame della skill è pulito a tutte le larghezze strette (G1: 118 voci pulite). |
| **Il resto delle prove chieste** | Movimento ridotto, senza JavaScript, ricarica a metà pagina, ritorno, tastiera ai due ritmi, anche agli schermi bassi e a 350-374 px. | `robustezza.mjs` **82/82** (senza JS e movimento ridotto anche a 1366×640, 1024×600, 844×390); `scorrimento.mjs` **75/75** (A-B 15, C-D 28 con la ricarica anche a 1366×640 e 1024×600, E 18, F 14); `tastiera.mjs` a 900 ms **143/143** e a 60 ms **129/129** (14 misure, bassi e 350/374 px compresi); `tastiera-avvio` **41/41**; `stati-ascolto` **100/100**. |

## Che cosa hanno trovato gli stati della skill (mai visto dalle prove di prima), corretto alla causa

Gli stati dell'incarico (il gesto fatto, poi l'esame) hanno trovato sette difetti che le prove sul comando non vedevano. Ognuno è provato rosso su
una copia di prima e verde ora.

1. **M1 non vale solo sotto 803 px di altezza.** A 1280×860 (e fra 803 e circa 880 px a 1024-1366 px di larghezza) la finestra di Kalliope restava al
   suo posto, la pagina scorreva per mostrare la scheda e la bolla finiva sotto la barra (57 px contro 72); lo stesso con l'errore a 1440×803-831 e
   a 1181×830. Causa: la modalità compatta era decisa solo dall'altezza dello schermo.
   Correzione (`scena.js`, `apri`; `stile.css`, classe `compatta` sul palco): si misura con la finestra al suo posto e, dove la scheda dentro lo
   schermo e la bolla sotto la barra non ci stanno insieme, si sceglie la modalità compatta, con le stesse regole di 8c; sotto 803 px resta come
   prima. Le tre frasi della scheda compatta vanno a capo se serve: con `nowrap`, a 1181-1250 px, «Chiudi» e la prima frase uscivano dalla scheda stretta (lo ha visto l'esame sulla prima versione di questa correzione). Prova: `ascolto-bassi` a 1280×860,
   1181×830, 1366×803, 761×900, 1440×819; esame a 1280×(699…841) e 1366×(802…841), pulito (G4: 81 voci, 16 stati assenti).
2. **A 761-1011 px la bolla restava fuori dallo schermo con la scheda aperta** (131 px sopra a 761 e a 823, su 900 di altezza): la regola «la
   scheda dentro lo schermo e la bolla sotto la barra» valeva solo sotto 803 px d'altezza. Ora vale a ogni misura (`quantoScorrere`, anche per il
   messaggio d'errore della scheda in alto).
3. **«Ferma» nascosto restava nell'ordine di Tab.** Con la finestra chiusa dalla modalità compatta, Maiusc+Tab dalla prima voce portava il fuoco su un
   comando invisibile mentre la voce parlava (`ascolto-bassi`). Ora la finestra ha `visibility: hidden` con il ritardo dell'apertura.
4. **Con «riduci movimento» la scheda finiva 6 px sotto il bordo a 844×390**: le transizioni durano 1 ms ma partono da dove stava la cosa (la
   finestra aveva −14 px di margine) e la misura presa subito era sfasata di 14 px. La geometria si misura ora senza transizione (`apri`).
5. **L'errore dell'audio, più alto delle frasi che sostituisce, faceva scorrere la pagina e mandava la bolla sotto la barra** a 1366×640 (63 su 72)
   e a 1440×803-831. Ora il messaggio è compatto fino a 840 px di altezza e la modalità compatta lo prende anche più in alto (`stile.css`).
6. **Una volta su venti la riserva di altezza della bolla mancava** e la didascalia restava coperta (esame, stato `errore-filo`, 320×900, quattro
   lavoratori insieme: COPERTO `p.didascalia` sotto `div.bolla-corpo`; riprodotto, 2 mancanti su 40 caricamenti con la copia strumentata). Causa:
   con «riduci movimento» togliere `--bolla-max` e leggere subito l'altezza dava ancora il valore vecchio, e `riserva()` concludeva «non serve». Ora
   la misura si fa senza transizione, una volta sola per fotogramma, e anche quando arrivano i caratteri. Dopo: **0 mancanti su 80**.
7. **Il menu aperto su uno schermo più basso del menu** (`dispositivi-qa`, stato `menu-aperto`, Huawei Pura X chiuso 326×326): «Aiuto» restava 7 px
   sotto il bordo e non si poteva raggiungere, perché il menu sta dentro la barra ferma in alto. Ora il menu ha altezza massima e scorre dentro di sé
   (`stile.css`, a ≤959 px; dove c'è posto nessun effetto). Prova nuova `menu-basso.mjs` **55/55** (tocco e Tab, 11 misure); rossa sulla copia di
   prima 40/55; foto `foto-8d/menu-326x326-alto-e-fondo.png`.
   **E con l'errore di una frase del filo** (stessa macchina, 326×326): «Riprova» e il collegamento restavano sotto il bordo, perché il messaggio
   (190 px) non sta intero fra la riunione agganciata e il bordo e `scrollIntoView('nearest')` ne allineava l'inizio. Ora, se il messaggio non
   sta intero, vince la fila dei comandi (`inVista`); `errore-visibile` con 326×326, 320×568, 360×640: rossa 96/102, ora 102/102. Resta dichiarato che
   a 326×326 le prime due righe del messaggio stanno sotto la riunione (`prove/metodo-qa/dispositivi/chromium/errore-filo-326x326.png`).

## Le prove della skill sugli stessi file, e che cosa dicono ancora

| Strumento | Esito |
|---|---|
| `soglie.mjs ../sito` | 13 soglie di larghezza e 6 di altezza (700, 760, 800, 803, 820, 841); ogni soglia è provata sui due lati (349/350 … 1430/1431; altezze 699/700, 759/760, 799/800, 802/803, 819/820, 840/841 a 1280 px). |
| `esame-impaginazione.mjs`, 72 misure (le 42 di `soglie.txt` a 900 di altezza, più 1440×900, 390×844, 1024×768, 1280×720, 1366×640, 1024×600, 1280×600, 844×390, 667×375, 360×740, 1280×699, 1366×759, 1366×802, 1440×819 e le altezze di soglia a 1280 e 1366), tutte le voci | **370 voci pulite**, 44 stati che a quella misura non ci sono (il menu dove la barra ha le voci). 19 segnalazioni, tutte spiegate sotto: 13 «riunione fuori vista» a 761-1010 px e 844×390; 6 del telefono girato. Nessun'altra. |
| `dispositivi-qa.mjs chromium` (15 dispositivi × 6 pagine = 90 casi; a gruppi di dispositivi, perché in un colpo solo supera i 9 minuti) | **77 puliti**, 2 stati assenti, **11 con segnalazioni, tutte spiegate sotto**. |
| `confronta-scelta.mjs … --ammesse ammesse.json` | 1440×900: **solo differenze ammesse** su 60 cose, pixel diversi 2,91%; 390×844: **uguale** su 53 cose, 0%. Nessuna «DICHIARAZIONE NON USATA». |
| `pulsanti-finti-qa`, `link-spenti-qa`, `transizioni-qa` | Nessun conflitto; il «Microfono del computer» sta fra le ricostruzioni dichiarate (`.riunione-app`), elencato a parte; transizioni 12 casi puliti. |
| `contrasto-qa` | 1758 testi misurati; riporta i valori, non giudica (il progetto non dichiara un minimo). |
| Mie: `barra-voci` 120/120, `barra-salto` 33/33, `bolla-testi` 124/124, `filo-larghezze` 57/57, `senzajs-barra` 15/15, `primo-schermo` 9/9, `stati-comandi` 14 comandi con fuoco e contorno visibile; `taglio.mjs` a 18 e a 19 misure (anche 326×326, bassi e di mezzo) senza segnalazioni; `larghezze.mjs` 27 foto, console senza errori, nessuna richiesta fallita né a terzi. | Console, richieste fallite e richieste a terzi sono controllate da ogni prova: nessuna. |

**Le 19 + 11 segnalazioni rimaste, spiegate:**
- **Telefono girato (844×390, 667×375):** la bolla sta fuori dallo schermo (32, 28, 4 px a 844×390; 35 e 60 a 667×375) o sotto la barra (l'errore di una
  frase del filo a 667×375). È il limite che la direzione ha dichiarato («Debole», `CORREZIONI-3.md`): vincono i comandi. Non l'ho toccato.
- **Huawei Pura X chiuso 326×326** (schermo quadrato di 326 px): la bolla sta sopra lo schermo (253, 276, 207 px) o la riunione agganciata copre
  la bolla della frase mentre suona; la scheda, «Riprova» e il collegamento stanno nello schermo. Stesso limite: a quell'altezza non c'è posto per
  tutto, vincono i comandi. Foto: `prove/metodo-qa/dispositivi/chromium/*-326x326.png`.
- **Fra 761 e 1010 px (e a 844×390, 861×609, 951×669, 820×1180) la riunione non si vede mentre una frase del filo suona** (`frase-filo-suona`:
  `riunione-filo` 289-579 px sopra lo schermo). **Trovato, non toccato (vedi sotto).**

## Trovato e non toccato (non è mio da decidere)

- **La riunione che ascolta non si vede mentre una frase del filo suona, a 761-1010 px.** A 1011 px e oltre la riunione sta accanto alle frasi e
  resta ferma; al telefono (sotto 761 px) la tiene in vista la banda agganciata. Fra 761 e 1010 px il filo è in una colonna sola (correzione mia di
  6b: nella colonna stretta le parole si spezzavano) con la riunione sopra le bolle e senza banda: mentre la frase 3 suona, la riunione sta 307 px
  sopra lo schermo a 900 px d'altezza. È un difetto nato da una mia correzione, non dal terzo giro; non l'ho ridisegnato. Fotografie:
  `foto-8d/tablet-riunione-fuori-vista-823x900.png` e `…-761x900.png`. Rimedio che propongo, se lo si vuole: la banda agganciata del telefono anche
  da 761 a 1010 px (esiste già, è l'unica cosa da estendere), con la riunione compatta; cambia l'aspetto del tablet e va guardato.
- Restano quelli dei giri prima (la riserva di 48 px sotto i 335 px con la frase corta; il «Ferma» disattivato della finestra ricostruita a 2,48:1;
  l'etichetta della scelta, ora corretta). Il testo della riga dell'errore a 326×326: le prime due righe stanno sotto la riunione (sopra).
- Il menu su schermi molto bassi scorre dentro di sé senza una scrollbar visibile: sul tocco è naturale, ma a 326 px non c'è un segno che ci siano
  altre voci sotto le prime quattro. Non l'ho aggiunto (sarebbe un disegno nuovo).

## Gli strumenti della skill: che cosa hanno trovato e dove sbagliano

- **Trovato davvero e corretto:** i sette difetti sopra. In particolare gli stati hanno visto ciò che `scheda-visibile` non vedeva (la bolla sotto
  la barra) e due cose che nessuna mia prova copriva: il menu su schermi bassi e il messaggio d'errore del filo a 326 px.
- **`contrasto-qa.mjs` misura come testo basso un testo invisibile.** Caso preciso: `span.f-pulsante.f-primario «Scarica la voce»` (la finestra
  ricostruita, 390×844, `ascolto-aperto`) risulta **1,01:1**, ma ha `opacity: 0` (tappa della ricostruzione non ancora arrivata): non si vede.
  Lo strumento non moltiplica l'opacità degli antenati. Non l'ho aggirato; il valore va letto così. Gli altri valori bassi sono il «Ferma»
  disattivato della finestra ricostruita (2,48:1) e le parole che non si sono ancora accese nella bolla mentre la voce parla (`span.p.attesa`,
  2,2-2,5:1), voluti dal disegno.
- **`esame-impaginazione.mjs` e `dispositivi-qa.mjs` non hanno un modo di dichiarare un limite già deciso.** Il telefono girato (844×390,
  667×375) e lo schermo 326×326 danno ogni volta FUORI VISTA o COPERTO, anche se la direzione ha deciso che lì vincono i comandi: le segnalazioni
  restano e si spiegano a parte (sopra). Una voce `limiti` nella configurazione (misura, stato, che cosa) le terrebbe separate dai difetti nuovi.
- **L'esame gira con «riduci movimento»**: ha esposto la misura sfasata di 14 px (difetto 4, vero), ma non prova il movimento normale; l'ho coperto
  con `ascolto-bassi` e `scheda-visibile` in movimento normale, e con `RIDOTTO=1` per l'altro.
- **`dispositivi-qa.mjs` in un colpo solo supera i 9 minuti** su questa macchina (90 casi) e, se il tempo scade, muore con un'eccezione non
  gestita lasciando `risultati.json` con «completo: false». Con il filtro per dispositivo (terzo argomento) ogni gruppo scrive di nuovo
  `risultati.json` con solo la sua parte: i risultati del giro stanno nei file `prove/dispositivi-*.txt`, non in quel JSON.
- **`confronta-scelta.mjs`:** ora con `che` per ogni differenza; l'etichetta «Tu» in due elementi è riconosciuta come una cosa sola
  («stessa cosa …»), come deve. Nessun errore nuovo.
- **Una segnalazione che compare e scompare** (COPERTO `p.didascalia`, difetto 6) era nella pagina, non nello strumento; da lì il consiglio: un
  rosso che non si ripete va riprodotto in serie e non scartato.

## Non verificato

- **Firefox e WebKit:** non provati (qui solo Chromium). La finestra che lascia il posto alla scheda usa `:has()`: dove manca, la finestra resta e la scheda
  compatta si vede ugualmente (le sue regole usano la classe `compatta` o l'altezza, non `:has()`); non provato in un altro motore.
- **Lo zoom del browser e il testo ingrandito al 200%**, **il suono vero**, **lettori di schermo veri, telefoni veri** (le misure sono simulazioni,
  anche 326×326), **la fluidità su dispositivi lenti**: non provati.
- La fase delle prestazioni non è toccata.

# Quinta parte · Dopo la correzione del tablet (incarico 8f)

**Impronte finali** (`prove/sito-sha256.txt`): `index.html` cfbe6481… (mai toccato), `scena.js` caf0e3df…, `stile.css` **8eb82797…**. Partenza (la pagina della direzione dopo 8e,
`scartate/prima-di-8e/`): scena.js 49d54cad…, stile.css e04e0b64…; la direzione ha consegnato f897b708…. **Il giro finale in Chromium** è stato lanciato su `caf0e3df…` /
`c9e16707…` (`prove/sito-sha256-8f-prima.txt`). **Dopo, alle 13:29, ho cambiato `stile.css`** (una regola, vedi sotto) e ho verificato solo quella modifica, per dipendenza. Il
resto della consegna è provato sui file di prima di quella regola. Incarico chiuso su richiesta del coordinatore: non ho rilanciato altri giri.

## Che cosa ho completato, con la prova (Chromium, sui file `c9e16707…`, esiti in `prove/finale/`)
- **La forma del tablet (761-1010 px, 844×390):** `filo-tablet.mjs` (nuova): per ognuna delle tre frasi la riunione, la bolla, «Pausa», il tempo e «Detto» stanno insieme nello schermo e
  non coperti; pausa e riprendi; cambio a metà; errore e «Riprova»; la riunione non copre nulla e non resta appesa a ogni passo di scorrimento; ordine e fuoco da tastiera; ricarica e ritorno;
  senza JS. **A 13 misure** (761×900, 768×1024, 800×700, 820×1180, 834×1194, 861×609, 900×800, 951×669, 1000×600, 1010×900, 844×390, 760×900, 667×375): 266/266 + 204/204; tastiera a 60 ms 180/180;
  movimento ridotto 165/165 (5 misure). Sulla copia di prima di 8e: 53/76 (768×1024 e 861×609).
- **`filo-larghezze.mjs` aggiornata** (misurava la forma di prima: leggeva `.tratto-testo`, ora `display: contents`): ora misura titolo, riunione e frasi e verifica la forma del tablet; 87/87; sulla copia di prima 23/33.
- **Il menu che sfuma:** `menu-sfuma.mjs` (nuova) 65/65 (dove scorre il velo c'è in cima e a metà, sparisce in fondo; dove sta intero nessun effetto; con la tastiera l'ultima voce si vede). **Trovato e corretto:** con la
  versione della direzione, a 326×326, 390×320 e 768×340 «Aiuto» col fuoco restava sotto il velo (opacità 1): il velo si spegneva al 94% dello scorrimento (2-3 px dal fondo) e il fuoco porta la voce a 8 px dal bordo.
  Ora si spegne a 12 px dal fondo (`stile.css`, `animation-range`): 67/70 prima, 65/65 dopo (sulla copia di prima di 8e, senza velo, 45/65).
- **Prove della skill sullo stesso giro:** esame a 78 misure e tutti gli stati: 420 voci pulite, 44 stati assenti; segnalazioni: solo quelle dichiarate (limiti) e quelle della sezione «Lasciato al giudice». `dispositivi-qa.mjs chromium` intero, 90 casi: 83 puliti,
  2 assenti, 5 con segnalazioni (844×390 errore in alto; 326×326 quattro). `confronta-scelta` con `ammesse.json`: «solo differenze ammesse» a 1440×900, «uguale» a 390×844, nessuna dichiarazione non usata. `pulsanti-finti-qa`,
  `link-spenti-qa`, `transizioni-qa` puliti; `contrasto-qa` 1916 testi.
- **Le mie, sugli stessi file:** ascolto-bassi 522/522 (264/264 ridotto), scheda-visibile 231/231, errore-visibile 578/578, stati-ascolto 100/100, tastiera 183/183 e 165/165 (a 60 ms; 18 misure, tablet compresi), tastiera-avvio 41/41,
  robustezza 82/82, senzajs-barra 15/15, primo-schermo 9/9, stati-comandi 14 con contorno, barra-voci 120/120, barra-salto 33/33, bolla-testi 124/124, etichetta-tu 133/133, menu-basso 55/55, scorrimento 93/93
  (la ricarica anche al tablet), taglio a 42 misure e larghezze (30 foto) senza segnalazioni; console, richieste fallite e a terzi: nessuno.
- **Sequenze** registrate di nuovo e guardate: frase del filo a 820×1180 e 768×1024, ascolto in alto a 1366×640 e 390×844 (`prove/sequenze/`).

## Che cosa hanno trovato gli strumenti (corretto alla causa)
1. **Il menu e il velo** (sopra), da `menu-sfuma.mjs`.
2. **Firefox: il fuoco su «Aiuto» a 768×340** lo lasciava per 31 px su 52 (Firefox non scorre una voce già in parte in vista). Corretto in `scena.js` (`focusin` del menu: si scorre il menu, non la pagina); Firefox 50/50.
3. **Il salto durante la voce (modifica delle 13:29, `stile.css` 8eb82797…).** Registrando la frase del filo ho misurato che a 1,5 s dal gesto la **pagina scorreva da sola di 31 px a 820×1180, 15 a 768×1024 e 28 a 390×844**, con la riunione
   ferma: quando la voce arriva alla forma detta di frase 3 («1.250 € +» diventa «milleduecentocinquanta euro più») la bolla cresce di una o due righe (94 → 156 px a 820; 78 → 134 a 390) e Chromium, per tenere fermo ciò che sta
   sotto, scorre la pagina di metà della crescita. È un secondo movimento non voluto, già presente al telefono; sul tablet con la forma nuova si vede insieme alla riunione ferma. Cambiata la causa, non la bolla: `html { overflow-anchor: none; }`
   (provato `html`: 0 px; `#campioni` e `.filo` non bastano, l'àncora diventa un altro elemento e scorre di più, 62 e 56 px). Ora la bolla cresce in basso e la pagina sta ferma. Prova: `filo-tablet.mjs`, sezione 0 («la prima volta che suona la frase 3 la
   pagina non scorre»): rossa senza la regola (31, 15, 28 px a 820×1180, 768×1024, 390×844), verde con (0 px); stessa regola a 1440×900: la bolla non cresce, nessun effetto.
   **Verificato dopo quella modifica** (file `8eb82797…`): `filo-tablet` 160/160 (768×1024, 820×1180, 861×609, 390×844), `errore-visibile` 136/136 (768×1024, 390×844, 844×390, 820×1180), `scorrimento` C 24/24 (ricarica a metà a 6 misure),
   `confronta-scelta` «solo differenze ammesse» a 1440×900 e «uguale» a 390×844, esame in Chromium a 10 misure (390×844, 360×740, 768×1024, 820×1180, 861×609, 951×669, 844×390, 667×375, 1024×768, 1440×900), con tutti gli stati: 56 voci pulite, 2 assenti,
   solo le segnalazioni già note. **Solo prima di quella modifica** (sui file `c9e16707…`) sono provati tutti gli altri numeri di questa parte, il resto di `dispositivi-qa`, `contrasto-qa` e le altre prove mie: la regola può toccare solo che cosa scorre quando
   cambia l'altezza di qualcosa sopra l'area vista, ma non le ho rilanciate. **Il commento nella regola dice che WebKit non scorre e Firefox sì: non l'ho misurato, l'ho dedotto** (misurato solo in Chromium).
4. **Gli strumenti della skill:** `contrasto-qa` non riporta più «Scarica la voce» a 1,01:1 (ora elenca fra i «cambiati» ciò che sparisce mentre misura): corretto come dichiarato, riga della parte 4 superata. `limiti` funziona (4 voci usate, nessun «LIMITE NON USATO»);
   `dispositivi-qa` intero in 3 minuti. Mie correzioni agli strumenti di prova: `scorrimento` e `filo-tablet` ricaricano con `location.reload()` (come F5): `page.reload()` in Firefox riparte da 0 anche su una pagina statica (`scartate/_ipotesi/alta.html`).

## Firefox e WebKit: che cosa ho visto, che cosa no
- **Voce.** Una pagina vuota (`strumenti/webkit-audio.mjs`) distingue il limite dell'ambiente dalla pagina. **WebKit** non suonava per mancanza dei plugin GStreamer nello script della skill (corretto dal coordinatore il 15/11): **da allora suona** (mp3 e opus,
  `playing@0.00`, nessun errore). **Firefox** dà `error` codice 3, `OnMediaSinkAudioError` (nessuna uscita audio) con mp3 e opus: lì gli stati con la voce che parla girano con l'audio finto delle mie prove (stesso oggetto, tempo vero); la voce vera in Firefox **non è verificata**.
- **WebKit con la voce vera** (solo `esame-impaginazione`, 16 misure, `esame-webkit-K.txt`, file `8eb82797…`): pulito quanto Chromium, con le stesse segnalazioni dei telefoni girati e di 326×326, più due solo di WebKit: errore di una frase del filo a 667×375 (`div.errore-ascolto` 13 px sotto lo schermo:
  si taglia il bordo basso del riquadro, «Riprova» e il collegamento sono in vista; foto `foto-8f/webkit-errore-filo-667x375-e-frase-844x390.png`) e a 326×326 (9 px). Con la voce vera: frase 3 (parole accese, «Tu», le tre persone, «Pausa», «Detto») a 820×1180 e a 844×390, ascolto in alto a 1366×640
  (`foto-8f/webkit-voce-vera-…png`). **Non ho guardato con la voce vera in WebKit** pausa, cambio a metà, errore e «Riprova» di una frase, né le due voci dell'ascolto in alto.
- **Prima** (WebKit con audio finto, Firefox con audio finto): `esame` a 16 e 12 misure (350-1024 px e bassi), puliti, con la sola segnalazione «404» della console, voluta, nei due stati d'errore di WebKit (404 per far fallire l'audio finto); `filo-tablet` a 6 misure di tablet:
  Firefox 222/228 e WebKit 222/228 (i soli rossi: la ricarica in Firefox con `page.reload()` e il punto di partenza di Tab in WebKit, ambedue difetti dello strumento, corretti; WebKit a 768×1024 poi 38/38); `menu-sfuma`: WebKit 65/65 (il velo c'è), Firefox 50/50 senza velo (non ha `animation-timeline`: il menu resta com'era).
- **Visto nelle foto** (`foto-8f/`): la finestra che lascia il posto alla scheda compatta a 1366×640 (`:has()`) è uguale in Chromium, Firefox e WebKit; la forma del tablet a 820×1180 con la frase 3 che suona è uguale nei tre; l'etichetta «Tu» a 350 e 374 px sta nel riquadro in tutti e tre (in WebKit il paragrafo
  sotto il titolo va a capo in modo diverso, una riga in più a 350 px); il menu a 326×326 in Firefox e WebKit lascia intravedere il testo della pagina dietro le voci (nessuna sfocatura: in Firefox è così anche sulla copia di prima di 8d; non so se il motore o l'ambiente senza scheda grafica),
  in Chromium è pieno. Il velo sul bordo del menu manca in Firefox e c'è in WebKit (misurato, non guardato in foto).
- **Non lanciato:** `dispositivi-qa` in Firefox e in WebKit, `contrasto-qa webkit`, l'`esame` su tutte le misure in Firefox e in WebKit, le mie prove (salvo le citate) in Firefox e in WebKit, `sequenza.mjs` (solo Chromium: **il movimento negli altri motori non è verificato**, compreso il salto di 31 px, misurato solo in Chromium).

## Trovato e non toccato, limiti, lasciato al giudice
- **Limiti dichiarati** (`metodo.config.mjs`, `limiti`, trascritti da `CORREZIONI-3.md` e `CORREZIONI-4.md`): ascolto in alto a 844×390 e 667×375 (bolla fuori dallo schermo); errore di una frase del filo a 844×390 (20 px) e 667×375 (bolla sotto la barra).
- **Lasciato al giudice (non deciso per iscritto, resta segnalato):** l'errore nella scheda in alto al telefono girato (bolla 28 px sopra a 844×390, 60 a 667×375); a 326×326 l'ascolto in alto, l'errore in alto e nel filo, la frase che suona (bolla sopra o sotto la riunione agganciata).
- **Dal computer (da 1011 px) la riunione non si vede quando la frase 1 suona e sta al centro dello schermo:** nella colonna di sinistra sta sotto il titolo, il testo e le voci; a 1440×900 sta a 820-1068 px su 900, a 1280×800 a 770, a 1920×1080 a 910 (`filo-tablet.mjs 1440x900,1280x800,1920x1080`:
  103/114, i rossi sono questi). Con le frasi 2 e 3 sì. È la forma del computer di sempre, non toccata da 8e né da me; non ho una foto. Il tablet non ha questo difetto (la riunione parte all'altezza della prima frase).
- **Il menu a 326×326, sul tocco, scorre senza barra visibile** (resta com'era; il velo lo dice dove c'è). **Il menu in Firefox e WebKit lascia intravedere la pagina** (sopra).
- **Nei tool:** `esame` e `dispositivi-qa` ora dichiarano i limiti; restano i valori bassi del contrasto del disegno (il «Ferma» disattivato 2,48:1, le parole non ancora accese).
- **Un errore mio da dichiarare:** durante la ricerca ho lanciato per sbaglio `rm -rf /dev/null` (nessun file mio: il comando è stato respinto, nessun effetto). Nessun'altra cancellazione.

