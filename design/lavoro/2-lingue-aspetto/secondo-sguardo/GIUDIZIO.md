# Secondo sguardo 2-s · le lingue e la rifinitura di «non ancora» (commit `22c56ab`)

Giudice: design-judge (Claude Opus), 17/11/2026. Non ho reso né costruito nulla di ciò che guardo. Ho registrato e guardato
prima di rileggere i giudizi precedenti, e ho letto le note di chi ha costruito solo alla fine (ultima sezione).

**Su che cosa.** Copia del commit (`git archive 22c56ab`) in `/tmp/lavoro-2s-radice`. Costruiti da quella copia: il sito vero
(solo italiano) in `/tmp/lavoro-2s-sito`; il sito a dieci lingue con le pseudo-lingue (i nove cataloghi di prova del commit)
in `/tmp/lavoro-2s-sito10`; il sito a trenta lingue (le nove di prova più venti pseudo, come `costruisci30.sh`, ma dalla copia
del commit) in `/tmp/lavoro-2s-sito30`; la pagina già approvata (`079120d`, costruita con `--no-selector`) in
`/tmp/lavoro-2s-sito-prima`; il sito con un rilascio non di prova in `/tmp/lavoro-2s-sito-stabile`. Server solo dentro i comandi,
porte 8860–8869. Chromium senza finestra (Playwright 1.60) salvo dove dico Firefox; WebKit non è partito sulla mia macchina
(manca una libreria, sotto «Non verificato»).

**Prove.** Le foto e le misure che cito stanno in `foto/` (in questa cartella; immagini fuori da git per `.gitignore`), le serie
complete in `/tmp/lavoro-2s-foto/`, i programmi in `prove/`.

---

# Parte 1 · Le lingue

## Lo stato dei problemi del primo giudizio

| | Problema | Stato | Come lo vedo |
|---|---|---|---|
| **B1** | La barra si rompe nelle lingue lunghe con l'azione in barra | **chiuso** | Dopo la rotella vera, da 761 a 1441 px ogni 20 px, home in de, el, bg, fi, en-XA, ar, ur, ar-XB e «non ancora» in de ed en-XA: **0 rotte su 350** (nessuna voce fuori, sul marchio, sotto l'azione, su due righe; `foto/barra-rotella-a.txt`, `-b.txt`). Dove le voci non ci stanno la barra passa a «Menu» e il pannello contiene voci e scelta (`foto/de-1100.png`); in arabo a 1100 le voci stanno tutte (`foto/ar-1100.png`). |
| **I1** | La versione al contrario in arabo e urdu | **chiuso** | «0.1-rc.1» si legge giusto nello stato del primo schermo (`foto/ar-stato.png`, `foto/ur-stato.png`) e nel piede (`foto/ff-piedi.png`, Firefox). |
| **I2** | «Tu · microfono "Kalliope"» sopra le barre al telefono | **chiuso** | Dove non ci sta l'etichetta si accorcia a «أنت», «Εσύ», «আপনি», «Du»… e resta su una riga, sopra le barre e non su di esse (390, 360 e 320 px in ar, el, bn, de, hi, ur, zh, en-XA: `foto/tel-home-5.png`; serie `/tmp/lavoro-2s-foto/ritagli/tu-*`). Un caso rimasto, in urdu sugli schermi bassi: L2. |
| **I3** | La pagina della scelta è un frammento su un palco vuoto | **chiuso** | Ora è una pagina: il nome del prodotto, la bolla con i nomi che nasce dal tuo riquadro, la fila della riunione, tutto al centro, a 1440×900, 390×844 e 844×390 (`foto/scelta10-1440x900-fermo.jpg`, `foto/scelta-390.png`, `foto/scelta-844.png`). Accanto alla chiusura della home, nei due versi, è la stessa famiglia (`foto/scelta-chiusura-ab.jpg`, `-ba.jpg`): la risposta non cambia scambiando i lati. Senza JavaScript i nomi compaiono (in ordine di codice) e portano alla lingua (`foto/scelta-jsno-390.png`). |
| **I4** | La pagina italiana scarica cinque caratteri in più | **chiuso** | A riposo `/it/` chiede due file, 59 480 byte (Lexend e DejaVu), sia nel sito vero sia in quello a dieci lingue; «non ancora» uno solo. I nomi delle lingue arrivano solo quando servono. |
| **M1** | Titolo a cinque righe in de e el | **aperto, rinviato ai testi** | A 1440 il tedesco è ancora su cinque righe (`foto/de-home-1440x900-primo.png`). In più il bengali: cinque righe con «আপনি» da sola, e lo stato esce dal primo schermo (`foto/bn-home-1440x900-primo.png`). Dipende dal testo, che sarà riscritto: resta una scelta del proprietario. |
| **M2** | La freccia del collegamento staccata | **chiuso in parte** | In greco la freccia ora segue l'ultima parola; in bengali a 390 la freccia va da sola sulla riga sotto (`foto/bn-link.png`). |
| **M3** | «العربية» in nastaliq nella pagina urdu | **chiuso** | Nel selettore della pagina urdu «العربية» è nel disegno arabo, «اردو» in nastaliq (`foto/ur-sel-1440.png`). |
| **M4** | Il titolo urdu pesa meno | **aperto, per scelta** | Invariato (`foto/ur-1440-titolo.png`): il nastaliq non ha pesi oltre 700. Al proprietario. |
| **M5** | La sottolineatura a scalino in arabo | **chiuso** | Una linea sola sotto la parte araba e «Linux» (`foto/ar-link.png`). |
| **M6** | Il buco della punteggiatura nel titolo cinese | **chiuso** | Il titolo usa le forme strette (`halt`): la virgola sta attaccata al carattere prima, senza il buco (prova a parte con lo stesso carattere, con e senza: `foto/prova-bg-zh.png`). |
| **M7** | Il ripiego dell'urdu rompe le lettere | **chiuso nel foglio, non provato** | La pila dell'urdu nomina ora i nastaliq e gli urdu di sistema prima del ripiego generico; su questa macchina non ce ne sono, quindi non l'ho visto funzionare. |
| **M8** | L'esempio dello specchio nel catalogo in italiano | **chiuso** | Ora in arabo con «Linux» e «Kalliope 0.1» isolati; freccia e coda specchiate, ▶ no (`foto/catalogo-specchio.png`); catalogo senza errori. |

**Ciò che era giusto è rimasto giusto.** Lo specchio anche in movimento (arrivo in arabo a 1440 e 390:
`foto/ar-arrivo-1440x900-foglio.jpg`, `foto/ar-arrivo-390x844-foglio.jpg`); un carattere per scrittura; l'italiano uguale:
`confronta-scelta.mjs` sulla home contro la pagina approvata, in cima e a 1800 px, a 1440×900 e 390×844, **0% di pixel diversi**
(a 390 in cima quattro misure di scatola diverse sulle righe del titolo, invisibili: `foto/scelta-confronto/`). Nessuno scorrimento di
lato e nessun errore nella console in nessuna lingua e misura provata.

## Problemi nuovi (lingue)

Nessun bloccante, nessun importante.

### Minori

**L1 · In urdu, a 326×326, mentre la voce suona «Pausa» esce dallo schermo.**
- Dove: «non ancora», chiusura, dopo «Ascolta» a 326×326. La bolla urdu in nastaliq va su tre righe (63–191 px) e il comando finisce
  a 301–349 su 326: se ne vede la metà di sopra (`foto/asc-326-lingue.png`, secondo riquadro; misure `foto/ascolta-ur.json`). In en-XA
  manca 14 px (terzo riquadro). In arabo, con la traduzione di prova, sta (quarto riquadro); in italiano sta (`foto/asc-326.png`).
- Perché: è il difetto N1 chiuso in italiano e rimasto nella scrittura con le righe più alte; il comando appena premuto scivola sotto il
  dito. La frase dura pochi secondi e finisce da sola, e 326×326 è la misura più estrema dell'elenco: per questo è minore.
- Correzione (che cosa): dove la bolla ha una riga in più, la riunione scende ancora (fino al suo minimo) o la bolla accetta di stare
  sotto la barra, purché «Pausa» resti nello schermo. È la risposta 5 del punto 5, sotto.

**L2 · In urdu, sugli schermi bassi, l'etichetta «آپ» tocca le barre della voce.**
- Dove: «non ancora», chiusura, 844×390, a riposo e mentre suona: il riquadro di «Tu» è basso (68 px), l'etichetta in nastaliq è alta
  e sta a metà altezza, accanto alle barre, coprendo l'ultima (`foto/ur-844-tu-prima.png`, `foto/ur-844-tu.png`). In italiano e in
  arabo l'etichetta sta in alto e le barre sotto (`foto/asc-844-lingue.png`).
- Perché: è il segno principale del riquadro di «Tu» (chi parla), lo stesso punto dell'I2.
- Correzione: nel riquadro basso etichetta e barre non si toccano in nessuna scrittura (l'etichetta in alto anche con righe alte, o
  le barre più piccole).

**L3 · La pagina della scelta: il nome «Kalliope» a riposo è spento, e la barra cambia fondo.**
- Dove: dopo l'arrivo il titolo «Kalliope» passa dal bianco a un rosa smorto, più debole dei nomi che dovrebbe introdurre
  (`foto/scelta10-1440x900-fermo.jpg`); la barra ha una fascia scura quando la pagina sta nello schermo e diventa trasparente quando
  scorre (con 30 lingue, a 844×390 e 1280×720), quindi la stessa pagina a due misure vicine ha due barre diverse (`foto/scelta-844.png`,
  sopra e sotto).
- Perché: gusto. Il titolo spento sembra disabilitato; la fascia che va e viene non ha un motivo che si veda.
- Correzione: il nome resta leggibile come titolo; la barra ha lo stesso fondo che la pagina scorra o no. Scelta del proprietario.

**Già presenti prima di questo lavoro, trovati ora** (non nascono da queste correzioni; li scrivo perché un problema trovato conta):
- **Il menu del telefono fa saltare la pagina, in Chromium.** Aperto dopo aver scorso, la pagina sotto sale di 461 px (dal tocco) o di
  23 (dal clic); chiuso con Esc sale di altri 438–461. Uguale nella home e in «non ancora», uguale nella pagina approvata (`079120d`);
  Firefox non si muove (`prove/fuoco3.mjs`, `fuoco4.mjs`). Chiudendo il menu la persona non è più dove era. Probabile intreccio fra
  la barra appiccicata e il margine di scorrimento della pagina quando il fuoco entra o torna nella barra. **Importante per il sito, ma
  di prima**: da un incarico a parte, non da questo giro. Non l'ho provato su un telefono vero.
- **Firefox: il pannello del menu aperto lascia leggere la pagina dietro** (titolo e testo sotto le voci), mentre in Chromium è scuro
  (`foto/vetro.png`); uguale nella pagina approvata (`foto/vetro-prima-firefox.png`). Il colore calcolato è lo stesso (94%), quindi
  può essere il disegno di Firefox senza scheda grafica: **da guardare in un Firefox vero** prima di dirlo un difetto.
- Il catalogo scorre di lato a 1024 e a 390 per la tabella dei token (lo dice chi ha costruito; non l'ho misurato io).

## Le risposte al punto 5

1. **Con 30 lingue la scelta scorre sugli schermi bassi.** Misurato: a 360×640 l'ultima fila di nomi (Svenska, اردو, 中文) e la
   riunione stanno sotto il bordo; a 844×390 3 px, a 1280×720 34 px, a 326×326 623 px (`foto/scelta-basse.png`). La lingua del
   browser è la prima e accesa, la fila tagliata dice che l'elenco continua, scorrere un elenco di trenta nomi su un telefono è
   normale. **Va bene così; niente adesso.** Da riguardare solo se il proprietario vuole i nomi tutti in vista anche a 360×640
   (pillole più basse o due colonne strette).
2. **«OSI-এর» va a capo dopo il trattino.** A 390 e a 1440 non succede (`foto/bn-piede-390x844.png`, `-1440x900.png`); succede fra
   320 e 360 px. È il testo di prova: chi traduce lega sigla e suffisso (trattino che non si spezza, U+2011, o la marca che la guida per
   i traduttori già prevede). **Non è del sistema; con le traduzioni vere**, e una riga nella guida con questo esempio.
3. **Il nastaliq pesa 234 KB.** Arriva solo nelle pagine urdu (le altre: 0 byte); la pagina urdu chiede in tutto 294 KB di caratteri.
   È il disegno giusto per l'urdu e senza il file la pila cade su un urdu di sistema che molte macchine non hanno. **Tenerlo; dopo**, con le
   traduzioni vere, un sottoinsieme sulle lettere usate davvero (o fette per `unicode-range`). Non è un difetto d'aspetto.
4. **Due regole della barra nel foglio delle lingue.** Sono `.barra:has(.menu.aperto) { clip-path: none }` e `.barra.con-azione
   .menu.aperto { transform: none }`: riguardano il menu, non le lingue. Oggi ogni pagina carica anche `lingue.css`, quindi non si
   rompe niente; ma la prossima superficie che usa la barra senza quel foglio (una pagina interna, l'applicazione) avrebbe il menu
   storto. **Spostarle in `barra.css` all'inizio della prossima pagina** (stato e limiti), con la prova della barra rifatta: non
   cambia nulla a vista.
5. **A 326×326 la bolla non sta mentre suona.** Confermato, e tocca anche una scrittura vera, non solo la pseudo-lingua: «Pausa»
   finisce 14 px sotto il bordo in en-XA e **23 px in urdu**; in arabo, con la traduzione di prova, sta. **Dopo, con le traduzioni vere**, ma da tenere
   (L1): minore, misura estrema.
6. **«български» con lettere diverse dalle russe.** Sono le **forme bulgare** del carattere, giuste per il bulgaro: lo stesso carattere con
   `lang="ru"` disegna le forme russe, con `lang="bg"` le bulgare, e spegnendo la localizzazione tornano le russe
   (`foto/prova-bg-zh.png`, righe 1–6). La pagina bulgara usa le stesse forme nel titolo. **Non è un errore; niente da fare.**
7. **La riunione bassa calcolata sull'altezza della finestra (`100vh`).** Su un telefono vero `vh` è l'altezza con la barra del browser
   nascosta: quando la barra è visibile lo schermo è più basso di 50–100 px e la riunione può venire più alta di quanto serve, con «Pausa»
   di nuovo sotto il bordo. L'unità per «lo schermo con la barra del browser visibile» esiste (`svh`). **Adesso, se si tocca ancora
   la pagina; altrimenti con la prossima**: è un cambio di unità nei token (con `vh` come ripiego), da provare su un telefono vero o
   almeno con una finestra che cambia altezza. Non si vede in una simulazione senza finestra: non l'ho visto io.

## Il confronto

- **Le coppie dove il confronto non reggeva.** Nel primo giudizio non reggeva solo la pagina della scelta (I3): ora regge accanto alla
  chiusura della home, nei due versi (`foto/scelta-chiusura-ab.jpg`, `-ba.jpg`). Le coppie con i riferimenti (Tabby, Apple, WhatsApp)
  reggevano e la home non è cambiata d'aspetto: non le ho rifatte.
- **La home in arabo accanto all'italiano** (`foto/ar-it-ab.jpg`, `-ba.jpg`): la stessa pagina girata; nessuna risposta cambia
  scambiando i lati.
- **Il selettore nella barra** sta nella direzione (vetro scuro, nomi a pillola, la lingua di adesso piena) e si comporta come una
  persona si aspetta: con il mouse si apre e si chiude con un clic fuori; con la tastiera il fuoco si vede, Invio apre, Tab entra nei nomi
  nel verso della lettura, Esc chiude e il fuoco torna sul comando; al telefono sta nel menu in due colonne, anche in Firefox
  (`foto/k-tastiera.png`, `foto/tel-ar.png`, `foto/tel-de.png`, `foto/ff-piede-it10-390.png`). Senza JavaScript si apre e porta alla lingua.
- **Il sito vero**: `/` porta a `/it/` con e senza JavaScript (anche `/installa/` → `/it/installa/`), nessun selettore nella barra né
  elenco nel piede.

## La parte 1 è pronta per il proprietario?

**Sì.** Nessun problema bloccante o importante nato da questo lavoro; L1–L3 e M1, M4 arrivano come scelte. I due problemi di prima
(il salto del menu in Chromium, il vetro in Firefox) vanno detti a chi coordina, non fermano questa consegna.

---

# Parte 2 · La rifinitura di «non ancora»

## Lo stato dei problemi del secondo sguardo

| | Problema | Stato | Come lo vedo |
|---|---|---|---|
| **N1** | «Pausa» esce dallo schermo mentre suona sugli schermi bassi | **chiuso in italiano** | Mentre suona: 844×390 bolla 80–168, «Pausa» 326–382 su 390; 915×412 «Pausa» fino a 404 su 412; 326×326 fino a 318 su 326; bolla intera sotto la barra in tutte (`foto/asc-844.png`, `foto/asc-326.png`, `foto/ascolta-it.json`). In urdu a 326×326 no: L1. |
| **N2** | L'etichetta del pulsante sbilanciata al telefono | **chiuso** | Al telefono tondo e parola restano al centro in ogni stato (a 390: 84/99 px a riposo, 117/132 con «Pausa», 107/122 con «Riprendi»; la stessa differenza di 15 px in tutti, quindi nessuno scarto fra gli stati); larghezza ferma 350 e 286 (`prove/n2.mjs`). Al computer resta l'aria a destra di «Pausa», com'era. |
| **N3** | Il tratteggio attraversa la riga della versione | **chiuso** | Fotogrammi fitti dell'entrata: la riga della versione scende sopra il posto tratteggiato, il tratteggio non passa mai sul nome né sulla data (`foto/n3-zoom.png`, `foto/n3-foglio.png`). |
| **N4** | La nota scritta a mano accanto al numero che si aggiorna | **chiuso** | Costruito con un rilascio non di prova: «Kalliope 0.1 · Solo Linux», e lo stato del primo schermo senza «di prova». |
| **N5** | Il posto tratteggiato non si accende dopo «Copia» | **chiuso** | Dopo la copia il tratteggio si schiarisce (opacità 0,6 → 0,92 a 100 ms, di nuovo 0,6 a 1 s) e torna: si vede, appena (`foto/n5-seq.png`). La copia funziona con gli appunti veri e l'errore dice che cosa fare (`foto/copia-1440.png`, `foto/copia-390.png`). |
| **M3** | Al telefono la didascalia si riduce a «Ricostruzione» | **chiuso** | Ora dice per intero che cos'è la scena, su due righe, sotto la scena (`foto/na-390-prima-dopo.png`). |
| | Il selettore nuovo nella barra | **fatto** | Come nella home, con il mouse, con la tastiera e al telefono, in Chromium e Firefox (`foto/tel-de.png`, terzo riquadro). |
| | Il piede in Firefox | **chiuso** | In Firefox il piede sta al suo posto a 1440 e 390 in italiano e in arabo (`foto/ff-piedi.png`, `foto/ff-piede-it10-390.png`); con Tab ogni sosta del piede è nello schermo (`prove/fuoco.mjs`). Con il fuoco che si muove dentro il menu la pagina sotto resta ferma (0 px); il salto all'apertura del menu è di prima (Parte 1). |

**Il primo schermo scelto non è peggiorato.** `confronta-scelta.mjs` contro la pagina approvata (`079120d`): 1440×900, 844×390 e
390×667 uguali, 0% di pixel diversi; 390×844 cambia solo per M3 (la didascalia su due righe, ciò che sta sotto scende di 17 px;
8,56% di pixel, tutti da quello spostamento; il comando principale e lo stato restano nello schermo). L'arrivo è quello di prima
(`foto/na-arrivo-1440x900-foglio.jpg`, `-390x844-foglio.jpg`). Larghezze di mezzo in arabo e tedesco (1024×768, 840×1000): nessun
difetto (`foto/mezzo-na-1024.png`, `foto/mezzo-840.png`).

## Problemi nuovi («non ancora»)

Nessun bloccante, nessun importante.

### Minori
- **L1 e L2** (Parte 1) stanno in questa pagina: «Pausa» fuori a 326×326 in urdu, l'etichetta sulle barre a 844×390 in urdu.
- **P1 · Dopo «Copia» il pannello sale di circa 14 px** al computer: la riga «Copiato: …» allunga il pannello, che sta centrato
  accanto al testo, e il pannello si sposta proprio mentre il posto si accende (`foto/n5-seq.png`, primo e secondo riquadro, stesso
  ritaglio). Piccolo; probabilmente c'era già. Correzione: il posto per il messaggio c'è già prima, o il pannello resta fermo in alto.

## La parte 2 è pronta per il proprietario?

**Sì.** La rifinitura migliora la pagina (N1–N5 e M3 chiusi, il selettore nuovo funziona) e non rompe ciò che era pronto: primo schermo
uguale, arrivo uguale, nessun errore.

---

# Le note di chi ha costruito, lette dopo

**Dove dicono più di quanto ho visto.**
- Rifinitura, N1: «bolla e "Pausa" stanno insieme a ogni misura». Vero in italiano; in urdu a 326×326 «Pausa» è 23 px sotto il bordo,
  e le note parlano solo di en-XA e di un 1,9 px in arabo (L1).
- Rifinitura, il fuoco nel menu: «la pagina resta ferma con il fuoco nel menu (0 px)». Vero per il fuoco che si muove nel menu; ma è
  l'apertura stessa del menu, in Chromium, che fa saltare la pagina (di prima, in tutte e due le pagine). Nessuna nota ne parla.
- Costruzione delle lingue, «ar, ur, hi, el, de, fi, ar-XB: 0 segnalazioni» nell'esame dell'impaginazione: vero per ciò che l'esame
  conta; non vede l'etichetta urdu sulle barre (L2), la freccia sola in bengali né il titolo bengali a cinque righe.

**Dove corrispondono.** B1 (0 rotte; le mie 350 prove con la rotella vera danno lo stesso), I4 (solo Lexend e DejaVu a riposo),
il precarico solo per ar, el, bg (lo vedo nelle pagine costruite), l'italiano identico, la scelta che scorre con 30 lingue sugli schermi
bassi, i due fogli fuori posto, N2–N5, M3, il rilascio stabile. La nota 8 della rifinitura («български» con lettere di un altro
carattere): sono le forme bulgare, risposta 6.

**Che cosa non ho rifatto delle loro prove.** WebKit (non parte qui), i lettori di schermo, la matrice dei 15 dispositivi, il testo grande.

# L'ordine, dal più forte al più debole

1. **«non ancora» rifinita**: pulita, ogni minore chiuso, nulla di rotto; resta solo l'urdu agli estremi.
2. **L'arabo**: stessa pagina, specchio giusto anche in movimento, versione giusta, barra e selettore a posto.
3. **Hindi, cinese, greco, bulgaro**: stessa pagina con il loro carattere; la punteggiatura cinese ora stretta; le forme bulgare giuste.
4. **Tedesco e finlandese**: la barra regge a ogni larghezza; resta il titolo a cinque righe (testo).
5. **Il selettore nella barra**: dentro la direzione, completo con tastiera, telefono e senza JavaScript.
6. **Il bengali**: corretto nelle lettere; titolo a cinque righe con una parola sola e freccia sola al telefono.
7. **L'urdu**: la scrittura giusta, ma il titolo più leggero (per scelta), «Pausa» fuori a 326×326 ed etichetta sulle barre a 844×390.
8. **La pagina della scelta**: ora una pagina vera; il nome spento a riposo, la barra che cambia fondo, l'elenco lungo che scorre sui telefoni bassi.

**Che cosa deve correggere ciascun autore prima di mostrare: niente di bloccante.** Le correzioni proposte (L1, L2, L3, P1, le
risposte 4 e 7) possono andare nel prossimo giro di costruzione; il salto del menu in Chromium in un incarico a parte.

# Non verificato

- WebKit: non parte su questa macchina dal mio comando (manca `libgstreamer`); le note dicono provato.
- Telefoni veri (in particolare `100vh` con la barra del browser, e il salto del menu in Chrome per Android); Firefox con scheda grafica
  (il vetro del menu); lettori di schermo; testo grande e zoom; l'audio (nessuna uscita: ho visto gli stati, non sentito la voce).
- I caratteri di sistema per l'urdu (M7) e il cinese di Windows e macOS.
- Le traduzioni sono di prova: non giudicate nella scrittura; nelle pagine diverse dalla home il testo resta in italiano, e in arabo e urdu
  quella punteggiatura italiana «girata» è un effetto della prova, non della pagina.

---

# Riassunto per il proprietario

### Problemi
- **Nessun problema grave** in nessuna delle due parti.
- **Minore, urdu sui telefoni piccolissimi**: mentre la voce suona, il tasto «Pausa» esce per metà dallo schermo (in italiano no).
- **Minore, urdu sugli schermi bassi**: nel riquadro «Tu» la scritta tocca le barre della voce.
- **Minore, pagina della scelta della lingua**: il nome «Kalliope» resta di un rosa spento, e la barra in alto cambia fondo a seconda
  dello schermo.
- **Minori che dipendono dai testi** (che verranno riscritti): titoli su cinque righe in tedesco e bengali, una freccia che va a capo da
  sola in bengali, il titolo urdu più leggero.
- **Da sistemare a parte, c'era già prima**: sul telefono, in Chrome, aprire e chiudere il menu fa saltare la pagina più in su.

### Che cosa funziona
- **La barra in alto non si rompe più** in nessuna lingua lunga, a nessuna larghezza provata.
- **Arabo e urdu**: la versione si legge giusta, tutto è girato nel verso giusto, anche il movimento.
- **La pagina per scegliere la lingua è diventata una pagina vera**: il nome, i nomi delle lingue in una bolla, la riunione.
- **Il cambio lingua nella barra** funziona con il mouse, con la tastiera, sul telefono e senza JavaScript.
- **Con il solo italiano** il sito non mostra il cambio lingua e l'indirizzo principale porta alla pagina italiana; la pagina italiana non
  scarica niente in più.
- **«Non ancora»**: «Pausa» resta nello schermo anche sui telefoni girati, il pulsante resta centrato, l'elenco delle versioni si apre
  pulito, la frase sotto la scena si legge intera al telefono; la parte alta è uguale a quella che hai visto.

### Confronto e limiti
- Accanto alla home italiana, la home in arabo è la stessa pagina; la pagina della scelta sta nella stessa famiglia della chiusura della home.
- Provato in Chromium e in parte in Firefox, senza telefoni veri, senza audio e senza lettori di schermo.
