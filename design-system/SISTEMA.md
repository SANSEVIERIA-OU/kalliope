# SISTEMA · il design system di Kalliope

Ricavato dalla home nella direzione scelta (D2 «Alla pari, in riunione») **senza cambiarne l'aspetto**: ogni valore del foglio di stile della home è qui con lo stesso valore, un nome e un posto. Nessuno ha deciso un colore, un carattere, una curva o una durata nel ricavarlo.

Sta in questa cartella, fuori dal sito, perché dovrà servire anche all'applicazione. Oggi lo usa una sola superficie: la home del sito (`website/index.html`). Le altre pagine del sito (ascolta, stato, installa, in riunione, aiuto, non ancora) hanno ancora l'aspetto di prima, con i loro fogli in `website/stile/`; l'applicazione non lo usa ancora.

## Che cosa c'è e dove

- `token.css`: la fonte unica dei valori, **799 token** in quattro blocchi `:root` (717 di base: 705 alla nascita e 12 con lo specchio; 36 delle pagine interne; 12 delle scritture; 34 delle lingue) e i `@font-face`. I file dei caratteri stanno in `caratteri/` (Lexend e DejaVu Sans, ciascuno con la sua licenza accanto).
- `marchio/`: il marchio (disegno, forme, script e icone, dal 19/11/2026, incarico L-3: «Il marchio» più sotto); i suoi 10 token `--segno-*` sono l'ultimo blocco di `token.css`.
- `base.css` e 14 componenti in `componenti/` (barra, pulsanti, apertura, bolla, riunione, finestra, riunione-app, ascolto, errori, filo, strada, tratti, piede, arrivo) più i quattro delle pagine interne (pagina, riunione-ferma, strada-ferma, versioni: «Le pagine interne» più sotto); più `lingue.css` (incarico 2: l'elenco e la scelta della lingua).
- `TOKEN.md`: per ogni token valore, ruolo, dove è usato; le 23 soglie delle larghezze; «Da decidere»; ciò che non è stato portato.
- `catalogo/` (`index.html`, `catalogo.js`, `catalogo.css`): la tabella dei token è letta da `token.css` all'apertura, da tutti i suoi blocchi `:root` (con il blocco, la sezione e come ogni token cambia per larghezza, lingua e verso); colori, caratteri e scala, spazi/forme/raggi/ombre; ogni componente (copiato dalla home vera) con varianti e stati; inventario del movimento con «Riproduci» e «Ferma»; la home viva a tre larghezze; «Non ancora».
- `metodo.config.mjs`: la configurazione di `controlla-sorgenti.mjs` (i valori stanno solo nei token), da lanciare da questa cartella.

**Come arriva nel sito.** `tools/site.py` copia questa cartella dentro il sito costruito come `design-system/` (senza i documenti `.md` e la configurazione). La home collega `design-system/token.css`, `design-system/base.css` e i componenti: è completa solo nel sito costruito, non aprendo `website/index.html` dalla cartella. Dal 16/11/2026 il sito costruito ha **una cartella per lingua**: la home in italiano sta in `it/` (e le altre lingue in `en/`, `ar/`…), l'indirizzo principale `/` è la pagina di scelta della lingua, e `design-system/` resta in cima al sito, condiviso: le pagine lo collegano con un percorso relativo che la costruzione scrive per la loro cartella (`../design-system/token.css`). Il catalogo si apre nel sito costruito, a `design-system/catalogo/`, perché legge la home vera in italiano (`../../it/index.html`). Per vederli: `docs/releasing.md`, «Website».

**Specchio e lingue (16/11/2026).** Il sistema può ricevere le traduzioni in 30 lingue, comprese due scritture da destra a sinistra (arabo e urdu): le proprietà fisiche sinistra/destra dei fogli sono logiche (`margin-inline-start`, `inset-inline-end`, `padding-block`, `text-align: start`…), le scorciatoie con lati diversi sono due token (`-blocco` e `-inline`), i token non nominano più un lato (`-inizio`, `-fine`) e `--verso` dice se la scrittura va da sinistra a destra (`1`) o da destra a sinistra (`-1`, sotto `:root:dir(rtl)`). Non c'è testo scritto nei fogli (il testo vive nella pagina: `docs/translating.md`). `tools/css_logico.py` controlla tutto questo e fallisce se rientra un difetto; ciò che lo specchio non fa da solo (spostamenti orizzontali, origini di crescita, luci, disegni) è elencato in `design/lavoro/1-lingue-sito/versi.md`. Come appare una pagina da destra a sinistra e quali caratteri usa ogni scrittura lo ha deciso l'incarico 2 (paragrafo seguente).

**Perché 705 token:** è una trascrizione fedele, non una riprogettazione: ogni valore diverso della pagina (128 colori, 55 grandezze e interlinee di testo, 266 misure e spazi, 78 durate e 36 ritardi, 24 ombre, 22 raggi, 24 livelli, 20 fondi e gradienti, 11 opacità e filtri, 6 curve, 4 pesi, 4 filetti, 25 pose, 2 caratteri) è un token, perché unire valori quasi uguali cambierebbe l'aspetto. Un valore uguale in più componenti nella stessa famiglia (testo, raggi, spazi, misure) è un gradino di scala numerato (`--corpo-7`, `--spazio-10`: il numero è il posto, non il valore); il resto ha il nome del componente (`--bolla-corpo-spazio-interno`) o del ruolo (`--bordo-cornice`, `--durata-pillola`). Le 36 dichiarazioni sovrascritte e le 45 regole senza elemento (sezioni vecchie) non sono portate: elenco in `TOKEN.md`.

**Le scritture e la scelta della lingua (17/11/2026, incarico 2).** Ogni scrittura ha il suo carattere dopo Lexend, legato alla lingua con `:lang()` (blocco «Le scritture» in fondo a `token.css`): Lexend anche per il latino esteso (un file a parte: il file «latino» non aveva č š ł ő ų ș), Geologica per greco e bulgaro (con le forme bulgare), Readex Pro (l'arabo di Lexend) per l'arabo, Noto Nastaliq Urdu per l'urdu, Noto Sans Devanagari e Noto Sans Bengali per hindi e bengali, il carattere di sistema per il cinese. Ogni file ha un `unicode-range`: una pagina italiana non scarica un byte in più. Fattori per scrittura moltiplicano la grandezza dei titoli e le interlinee di titoli e testo (1 in italiano: nessun pixel cambia); le scritture legate e il cinese non si spaziano. Fonti, licenze e byte: `caratteri/LEGGIMI.md`. Lo specchio: ciò che ha un verso moltiplica `--verso` (barra, freccia, coda della bolla, sguardi verso «Tu», barre di avanzamento, strada, luci, origini delle crescite, volo della bolla e testo che scorre in `scena.js`); il triangolo ▶, i numeri e il marchio non si specchiano. Un componente nuovo, `componenti/lingue.css`: l'elenco delle lingue a pulsanti-voce, la scelta nella barra (un `<details>` con un pannello di vetro scuro) e la pagina della scelta (`website/lingue.html`: la bolla con le lingue nasce dal tuo riquadro e i nomi si accendono, la lingua del browser per prima). Nel catalogo: «Le scritture», «La scelta della lingua», «Lo specchio» (`catalogo/catalogo-lingue.js`). Le decisioni punto per punto, le prove e le foto: `design/lavoro/2-lingue-aspetto/progresso.md`. **Dopo il giudizio** (incarico 2-c): ciò che i componenti devono misurare con il testo lungo sta in `website/componenti.js`, caricato dalla home e dalle pagine interne: la barra «raccolta» (la forma del tablet quando le voci, con o senza l'azione, non ci stanno), l'etichetta di «Tu» che resta «Tu» se non sta in una riga, la freccia dei collegamenti che segue l'ultima parola; le pillole vanno a capo dentro il loro fondo; in una pagina da destra a sinistra la costruzione isola le parti latine (versioni, nomi di programmi) perché non si leggano al contrario; l'elenco delle lingue nel piede si impagina solo vicino allo schermo (la pagina italiana, a riposo, scarica soltanto Lexend e DejaVu).

## Le pagine interne: la cornice e i quattro pezzi di «non ancora» (17/11/2026, incarico 3a)

La prima pagina interna rifatta nella direzione 2 è `website/non-ancora/`. Ha portato quattro componenti e una cornice che stato, installa, in riunione e 404 riprendono.

- **`pagina.css` + `website/cornice.js`: la cornice.** Primo schermo con l'impianto della home (`.scena.scena-pagina`: titolo, frase, comandi in `#comandi-apertura`, stato «Oggi:», didascalia; la riunione o la scena della pagina accanto), tratti come scene a tono alterno (`.tratto.scena-notte/-chiara/-stanza`, che salgono l'una sull'altra), `.tratto.coppia` per un testo con un oggetto della scena accanto (`.coppia-oggetto`) e una nota sotto (`.coppia-nota`), la chiusura con un comando che si prova. **Quando l'altezza manca, vince il comando**: telefono alto (da 760 px d'altezza) l'ordine della home; telefono basso (sotto 760 px: 390×667, 360×640) titolo, frase, comandi, poi la scena; telefono girato e finestre basse (oltre 760 px di larghezza, fino a 500 d'altezza) titolo e frase alla misura del telefono, comandi e stato nel primo schermo, la scena dopo. **Quando un gesto apre qualcosa, vince ciò che il gesto ha aperto, e a quelle altezze la riunione si abbassa perché il comando resti** (rifinitura del 17/11/2026): nella chiusura la riunione `.tavolo-pagina` va da 172 px (78 al telefono) giù fino a 60 px (token `--tavolo-pagina-altezza*`), così la bolla dove le parole si accendono e «Pausa» (al computer anche il messaggio d'errore) stanno insieme nello schermo; la regola per intero è in `design/lavoro/3a-non-ancora/PIANO.md`, «La cornice». `cornice.js` (barra piena appena si scorre, menu del telefono, i tratti che entrano, `Cornice.rivela` per chi preme prima che il tratto sia entrato) tiene l'ordine del fuoco uguale a ciò che si vede e porta i comandi dopo la scena solo sul telefono alto; senza di lui la pagina è intera.
- **`riunione-ferma.css`**: la riunione della home dove «Kalliope» non c'è (il tuo posto tratteggiato e senza voce, la frase muta nella bolla, il posto vuoto nella barra del microfono, il segno della scelta che va e torna).
- **`strada-ferma.css`**: la strada della voce che si ferma al microfono (tappa vuota, tappe dopo spente e tratteggiate, «C'è già» e «Manca» sotto).
- **`versioni.css`**: l'elenco delle versioni con in cima il posto tratteggiato di ciò che non c'è ancora, il comando «Copia l'indirizzo di questa pagina» con le sue due risposte (copiato, il posto si accende), e il momento (l'ultima versione arriva in cima e scende, con il fondo pieno: il tratteggio che si apre le passa sotto). La nota accanto al numero segue i dati della versione: `data-release="prova"` / `"stabile"` (`tools/site.py`, `docs/translating.md`).
- **L'ascolto della chiusura** (stati in `pagina.css`): il comando «Ascolta Giulia» con le etichette nella stessa cella (larghezza ferma in ogni lingua), il messaggio d'errore sotto il comando (`errori.css`), la bolla che torna muta se il suono non parte.
- **Il testo e le lingue**: ogni testo della pagina è segnato `data-t`; i testi dello script stanno in `<template id="testi-pagina">` (`testi.js`). Si costruisce in ogni lingua con un `.po` completo come la home.
- **Il catalogo**: `catalogo/catalogo-pagine.js` (+ `.css`) aggiunge la sezione «Pagine interne» con una scheda per ciascuno dei cinque, con stati, varianti e la pagina viva a misure vere; chi aggiunge un'altra area scrive un altro file così e non tocca il nucleo (`catalogo.js`).
- **Gli stati nella configurazione degli strumenti** (`metodo.config.mjs`): riposo, menu aperto, ascolto in corso, errore dell'audio, copia fatta e non riuscita, per `esame-impaginazione.mjs` e `dispositivi-qa.mjs`; i limiti dichiarati (le sole misure con il messaggio d'errore dove nemmeno la riunione più bassa basta: vince il messaggio) con il rimando alla decisione.

## La pagina «stato»: cinque pezzi nuovi (17/11/2026, incarico 3b, resa della direzione: da completare)

La seconda pagina interna, `website/stato/` (con `stato.js`), sulla cornice di «non ancora». Idea: **ogni fatto sta dove accade**: provato
fino al microfono, in riunione non ancora. Piano dei tratti e fonti: `design/lavoro/3b-stato/PIANO.md`; che cosa dice la pagina:
`design/lavoro/3b-stato/CONTENUTI.md`.

- **`riunione-provata.css`**: la riunione di «non ancora» con la voce. «Tu» parla, nella barra dell'app «Kalliope · provato fin qui» si
  accende, un'onda tratteggiata parte da «Tu» e i riquadri che tocca restano tratteggiati (il segno di «non ancora» della home).
- **`catena.css`**: la strada della voce vista da vicino, verticale: sei tappe (si installa, scrivi, la voce nasce, il microfono, l'app,
  gli altri), ognuna con i fatti e il file da cui vengono (`.fonte`), una cifra grande dove c'è (`.cifra`, con la quota di un secondo o la
  riga delle parole), la cornice del computer intorno alle tappe provate, la linea tratteggiata dopo il microfono, una parentesi «non
  misurato» sul lato. Una tappa si accende quando arriva sullo schermo, in fila.
- **`domande.css`**: le domande in fila come pulsanti-voce e la risposta nella bolla; al computer la bolla resta in vista, al telefono si
  apre sotto la domanda premuta; senza script ogni domanda ha la sua risposta sotto.
- **`varco.css`**: il computer come oggetto (finestra di Kalliope, disco, microfono) che mostra il fatto del passo a metà schermo; dal
  varco entrano i tre file della voce, una volta. Sotto, le licenze e le impronte (`.licenze`).
- **`inoltra.css`**: il messaggio da inoltrare nella bolla, con «Copia il messaggio» e le due risposte.
- In `pagina.css` una regola aggiunta: un titolo di quattro righe sugli schermi bassi del computer prende la misura del tablet (quelli di tre
  righe non cambiano). I token: blocco «La pagina «stato»» in fondo a `token.css`, documentati in fondo a `TOKEN.md`.
- Nel catalogo dall'incarico 3b-b (sezione «Pagina «stato»», `catalogo/catalogo-stato.js` e `.css`): le cinque schede con varianti e stati, i dettagli a richiesta, la parentesi «non misurato», le fonti; gli stati della pagina sono in `metodo.config.mjs`.
- **Dopo il giudizio** (incarico 3b-c): la tappa della catena si legge subito e si accende quando arriva (niente coda); la risposta delle domande
  entra una volta sola; al telefono i dettagli delle tappe, le licenze e le impronte si aprono a richiesta (`<details>`, aperti al computer e
  senza script) e dopo le domande un collegamento porta al messaggio da inoltrare. **La barra segna la pagina in cui sei**: regola in fondo
  a `barra.css` (`.menu a[aria-current="page"]`), per ogni pagina che ha la sua voce nel menu.

- **Completata dalla costruzione** (incarico 3b-b, 17/11/2026; prove in `design/lavoro/3b-stato/costruzione/`): le **fonti si aprono** (`.fonte a`, in `catena.css`): ogni nome di file è un
  collegamento al file del repository alla versione che la pagina mostra, scritto dalla costruzione da `{{kalliope.source.url}}` e `{{kalliope.tree.url}}` (`tools/site.py` verifica che il file
  ci sia a quella versione; se non c'è la fonte resta il suo nome); **l'indirizzo** che la bolla del messaggio mostra e copia è `{{kalliope.page.url}}`, lo stesso del `canonical`, e si legge
  da sinistra a destra anche da destra a sinistra; **i moltiplicatori** della discesa delle impronte, le fasce del passo che conta, la curva delle dissolvenze e l'aria di ciò che un gesto apre
  sono token (`--pacco-corsa-*`, `--varco-fascia-*`, `--curva-domanda`, `--gesto-aria`); **ciò che un gesto apre resta in vista** (regola della cornice): la bolla della risposta, i dettagli
  aperti e la conferma della copia (`inVista` in `stato.js`); **la scelta dei dettagli** al telefono si ricorda passando al computer e tornando; l'etichetta di «Tu» conta le righe vere
  (`componenti.js`) e resta su una riga anche senza i caratteri del sito; una tappa che comincia già sopra il bordo alto si accende ferma.
- **Rifinitura dopo il secondo sguardo** (incarico 3b-r, 17/11/2026; prove in `design/lavoro/3b-stato/rifinitura/`): **la bolla della risposta non resta appiccicata quando non ci sta**: se la risposta è più alta dello spazio
  sotto la barra (844×390: tre risposte) sta accanto alla sua domanda, dov'era, e scorre con la pagina (`.domande-bolla.scorre`, `adatta()` in `stato.js`; la scritta non cambia); **l'anello del fuoco delle fonti** è l'anello di
  sistema attorno alla pillola intera (tondo), il nome che ha il fuoco prende la linea piena (`catena.css`, `.fonte:has(a:focus-visible)`); **le etichette dei file** del riquadro «Sul disco» vanno a capo dentro la pillola dove non
  ci stanno (`varco.css`, `--varco-disco-aria-lato`); **le cifre con la virgola decimale** in arabo e urdu («0,07 s») restano dentro la parte latina isolata (`tools/site.py`, `PARTE_LATINA`); **il catalogo** mostra gli
  esemplari della tappa uno per riga, larghi come nella pagina (`catalogo-stato.css`).

## La pagina «installa»: quattro pezzi nuovi (20/11/2026, incarico 3c, resa della direzione: da completare)

La terza pagina interna, `website/installa/` (con `installa.js`), sulla cornice di «non ancora» e «stato». Idea: **ogni passo si vede
riuscire**: accanto a ciò che si copia, ciò che il computer di chi installa risponde, fino a «Pronta» e al microfono «Kalliope» nella
riunione. Piano dei tratti e fonti: `design/lavoro/3c-installa/PIANO.md`; che cosa dice la pagina: `design/lavoro/3c-installa/CONTENUTI.md`.

- **`scelta-sistema.css`**: quattro bottoni d'opzione disegnati come i pulsanti-voce (Debian e Ubuntu, Fedora, Arch, Altre); ogni elemento con
  `data-sistema="…"` si vede solo se fra i suoi valori c'è il sistema scelto. Lo fanno i fogli di stile con `:has` (funziona senza
  JavaScript; senza `:has` si vede tutto). La pagina che lo usa mette la classe `sistemi-pagina` sul contenitore.
- **`comando.css`**: il comando da copiare, nel carattere del terminale, da sinistra a destra anche da destra a sinistra; «Copia» alla fine
  della riga (lo mette lo script) con «Copiato» nella stessa cella e la frase per copiare a mano se il browser non lascia; senza script un
  clic seleziona il comando intero. Variante `comando-numero` per un'impronta; i comandi dentro una frase come pillola sottile.
- **`terminale.css`**: il terminale ricostruito nel mondo della pagina. Testo vero dove lo sappiamo, una riga sbiadita dove la risposta dipende
  dal computer di chi installa; il comando che si scrive senza cambiare l'altezza della riga; le risposte una riga alla volta; l'impronta
  confrontata a gruppi di otto cifre.
- **`installazione.css`**: la pagina. Il primo schermo con il terminale al posto della bolla e la riunione di «non ancora» (il posto
  tratteggiato di «Kalliope» che si riempie, il tuo riquadro che si accende); «Riuscito se… / Se no…» di ogni passo (`.esito-passo`); il file
  con la cartella e il terminale fermi accanto; la cartella `/usr` o `~/.local` che riceve i file; la finestra di Kalliope con le frasi che
  si provano; la chiusura con il microfono, la strada della ripresa e l'indirizzo per chi installa al posto tuo.
- I token: blocco «La pagina «installa»» in fondo a `token.css`, documentati in fondo a `TOKEN.md`. Gli stati della pagina sono in
  `metodo.config.mjs` (riposo, menu, archivio scelto, frase premuta, copia fatta e non riuscita, indirizzo copiato). Il catalogo non li
  mostra ancora: lo completa il ruolo di costruzione, con un file per area come `catalogo-stato.js`.

## Il marchio (19/11/2026, incarico L-3)

Il marchio è la direzione 3 della ricerca L-1, **«La frase che si accende»**, scelta dal proprietario il 19/11/2026: la bolla della frase detta a metà, piena e con le parole dove è detta, solo contorno tratteggiato (il segno di «non ancora» del sito) dove non lo è ancora. Nella barra vive con la voce della home: il confine fra le due parti, il **fronte della voce**, avanza con le parole della bolla vera. Il verde del logo di prima, l'unica eccezione ai colori del sito, non c'è più.

**Un disegno solo.** La geometria è in `marchio/disegno.json`; i colori e i tempi sono i token `--segno-*` di `token.css` (colore, parola, piastra, simbolo, fronte pieno, inseguimento, sosta, ritorno, due fondi di prova per il catalogo). `tools/marchio.py` scrive da lì tutti i file, e `python3 -I tools/marchio.py --check` fallisce se qualcosa non corrisponde più (in CI, in `build-packages.sh` e a ogni costruzione del sito: `tools/site.py` si ferma). Niente è copiato a mano.

| File | Che cos'è | Dove serve |
| --- | --- | --- |
| `marchio/barra.svg` | il segno con i nomi delle sue parti (`.m-segno`, `.m-detto`, `.m-bordo`, `.m-dette`, `.m-fronte`) | in linea nella barra di ogni pagina nuova (la costruzione lo mette al posto di `<svg data-marchio="barra">`); i colori da `componenti/marchio.css` |
| `marchio/libero.svg` | la forma libera, fondo trasparente, tela 128 | le pagine di prima (`<svg data-marchio="libero">` → immagine), Linux (`hicolor/scalable`), Windows |
| `marchio/piena.svg` | il quadrato rosa chiaro con il disegno al centro (0,84) | macOS |
| `marchio/piccola.svg` | la forma sulla griglia di 16 pixel, un solo pixel di contorno | 16 e 24 px, la scheda del browser |
| `marchio/simbolica.svg` | 16×16, un colore (il grigio dei simboli di Adwaita) | GNOME (`hicolor/symbolic`) |
| `marchio/favicon.ico` | tre immagini a 32 bit con trasparenza: 16 e 32 da `piccola`, 48 da `libero` | Safari prima della 26, Google; `<link rel="icon" sizes="any">` |
| `packaging/linux/<id>.svg`, `-symbolic.svg`, `-48.png`, `-256.png` | = `libero`, = `simbolica`, i PNG che freedesktop chiede | i pacchetti `.deb`, `.rpm`, tarball e AUR |
| `marchio/marchio.js` | il movimento: fronte, gesto, ripiego fermo | le pagine nuove (collegato nella testa) |

**Le forme isolate non hanno ritagli né fogli di stile.** Un motore SVG piccolo come quello di Qt (KDE) non segue i ritagli: la parte detta è un'area più un contorno pieno, la parte non ancora detta un contorno tratteggiato, tagliati dove il fronte incrocia la sagoma, con il tratteggio che parte alla stessa distanza della barra (`stroke-dashoffset`). La barra ha invece i ritagli, perché lì il fronte si muove. Le due costruzioni sono lo stesso disegno: `test_marchio.py` le disegna entrambe e conta i pixel che differiscono (solo i due punti dove il fronte taglia il contorno, entro 2 unità a 256 px). `tools/marchio_raster.py` disegna il PNG e l'ICO senza dipendenze, con la stessa geometria e lo stesso conto ovunque; la prova guarda i pixel, non i byte (zlib non è uguale su ogni macchina).

**Come si mette in una pagina.** Una pagina nuova scrive `<svg data-marchio="barra"></svg>` dentro `<a class="marchio">`, collega `componenti/marchio.css` dopo `barra.css` e `marchio/marchio.js` (`defer`): la costruzione fa il resto, compresa l'icona della scheda (due `<link rel="icon">`, `favicon.ico` e `piccola.svg`). Una pagina che scrive il proprio `<link rel="icon">` o il disegno a mano ferma la costruzione o la prova (`test_marchio.py`). Una pagina di prima scrive `<svg data-marchio="libero" width="40" height="40"></svg>` dove aveva l'immagine.

**Il movimento (`marchio/marchio.js`).** La voce di una pagina lo comanda con un evento sul documento, senza sapere che il segno esiste: `document.dispatchEvent(new CustomEvent('kalliope:voce', {detail: {stato, frazione}}))`, con `stato` `parla` (e `frazione`, da 0 a 1, le parole dette sul totale, come la bolla vera), `finita` o `interrotta`. Oggi la emette solo la home (`scena.js`: `voceDice`, in `passoDiscorso` e in `ferma`: sono le due righe che il sito di prima non aveva); «non ancora» e «stato» non muovono il segno con la loro voce, e a ognuna basterebbe emettere lo stesso evento. Regole:
- **A riposo è sempre «detto a metà»**, la forma dei menu e della scheda: il fronte non va mai sotto il riposo, quindi **all'arrivo non è mai una bolla vuota tutta tratteggiata** (dall'istante zero la barra e il segno sono già dipinti così, anche senza JavaScript) e nemmeno quando una frase comincia: parte dal riposo e arriva al pieno (`--segno-fronte-pieno`).
- **A fine frase torna a riposo, a tempo fisso.** Con l'ultima parola (frazione 1) la bolla è tutta piena per `--segno-sosta` (600 ms) e poi torna in `--segno-ritorno` (800 ms, curva `--curva-dolce-doppia`): non resta una bolla piena qualunque per secondi, e anche il respiro finale della voce la trova già a riposo. Una voce interrotta torna a riposo subito; una frase nuova riparte da dove il segno si trova.
- **Il gesto**: al passaggio del puntatore e al fuoco il fronte fa lo stesso movimento di una frase detta in un attimo (non se la voce sta parlando).
- **Ripiego**: con «riduci movimento» e senza JavaScript il segno sta fermo, a riposo. Sparisce il movimento, non il segno.
- **Non si specchia** da destra a sinistra (regola di Apple e del sistema): a destra sta il nome, a sinistra non cambia niente nel disegno, e il fronte va sempre da sinistra a destra, come la bolla.

**Che cosa è cambiato dalla direzione scelta (differenze volute).** `confronta-scelta.mjs` sulla prima schermata della home dà uguale su 53 cose a 1440 e 46 a 390, e la barra a riposo è identica pixel per pixel; il segno in ogni posizione del fronte differisce da quello della scelta di al più 14 pixel su 17 424, di al più 8 su 255 sul bordo del fronte (rumore, non un cambio). Le differenze volute, ognuna con il suo motivo:
1. all'arrivo non è mai vuota (nella scelta il fronte andava a −60 mentre la home scriveva e per 1,2 s di voce: giudizio, «Secondo sguardo», importante 3.2);
2. a fine frase torna a riposo a tempo fisso (nella scelta restava piena fino a 2,7 s di fila e tornava come un avvicinarsi senza fine: 2,3 s per arrivare a riposo; stesso giudizio);
3. nella forma piccola il fondo della bolla sta al centro di una riga di pixel (da 88 a 92 su 128, e il fondo del corpo della bolla e la coda scendono di mezzo pixel a 16 px), così il contorno tratteggiato non si spalma su due righe e a 16 px sullo scuro non sparisce (era un difetto minore del giudizio: «a 16 px sullo scuro la metà tratteggiata quasi sparisce»). Il disegno resta quello: la parola, il fronte e il tratteggio sono gli stessi;
4. le forme isolate non hanno ritagli (vedi sopra): fra la direzione e queste cambia al più il taglio del contorno sul fronte, che nella barra è curvo e nelle icone è perpendicolare al contorno;
5. l'ICO ha 16 e 32 dalla forma piccola (nella nota della direzione, 32 dalla libera): le grandezze della scheda mostrano lo stesso disegno dell'SVG;
6. `marchio.js` sta in tutte le pagine nuove, non solo nella home: il gesto del puntatore c'è dappertutto;
7. i token si chiamano per ruolo (`--segno-*`): `--d3-detto` e `--d3-bordo` sono lo stesso colore (`--segno-colore`); il fronte a riposo è il disegno com'è (non un valore) e non c'è più il fronte vuoto (−60); `--d3-passaggio` non serve (il gesto è una frase detta in un attimo: `--segno-sosta` e `--segno-ritorno`); in più i due fondi di prova del catalogo.

**Nel catalogo**: la sezione «Il marchio» (`catalogo/catalogo-marchio.js` e `.css`, dopo «Componenti»): la scheda, tutte le forme e le grandezze da 16 a 256 px su chiaro, su scuro e sul bordeaux, la barra con e senza il nome (la home vera a tre larghezze), il movimento con «Riproduci», «Ferma», il gesto e la variante con «riduci movimento», le fasi del fronte, la pagina da destra a sinistra (dove il segno non si specchia, letto dalla pagina), l'icona della scheda (l'SVG disegnato dal browser a 16 e 32 px e le tre immagini dell'ICO decodificate dal file), i token e la geometria letti dalle fonti. Provato in Chromium: `design/lavoro/L-logo/costruzione/prove/catalogo.mjs`.

**Che cosa resta.** L'icona della finestra del programma (Slint) legge oggi `packaging/linux/io.github.sansevieria_ou.kalliope.svg` (`crates/app/ui/app.slint`): con questa costruzione il file è il marchio nuovo, quindi alla prossima compilazione la finestra lo mostra, senza che il codice sia stato toccato; il resto dell'aspetto della finestra e i valori del sistema per Slint arrivano con la proposta di `CLAUDE.md`, «Il design system vale anche per l'applicazione». Il disegno libero è un colore solo, piatto: GNOME e KDE chiedono un po' di profondità e Flathub sconsiglia il simbolo di un solo colore (difetto minore del giudizio, non cambiato). Windows (ICO a 256 px, 24, 32 e le varianti dell'elenco delle app) e macOS (ICNS, che serve macOS) non hanno ancora pacchetti. «non ancora» e «stato» non muovono il segno con la loro voce.

## Come si usa per un'altra pagina

1. Collega `design-system/token.css`, `design-system/base.css` e solo i componenti che servono, nell'ordine in cui li collega la home: è l'ordine del foglio da cui vengono. Nella prova è stato verificato sulla home che nessuna coppia di regole di file diversi, a pari specificità, riguardi lo stesso elemento con l'ordine invertito; su una pagina nuova va riguardato.
2. Ogni valore passa dai token (`var(--voce)`, `var(--durata-pillola)`, `var(--entra)`); se manca si aggiunge a `token.css` con il suo ruolo, non alla regola. `controlla-sorgenti.mjs`, da questa cartella, dice se è rimasto un valore a mano.
3. Varianti e stati dei componenti: il catalogo, «Componenti». Una variante nuova entra nel file del componente.
4. `token.css` e `TOKEN.md` da qui in poi si modificano a mano: gli strumenti con cui sono stati ricavati dalla home non sono in questo repository, e rilanciati riscriverebbero tutto dal foglio di partenza.
5. La rete di sicurezza di ogni pagina (lo script in linea nel `<head>` che mette la classe `js` e la toglie dopo 4 s se qualcosa non è partito) controlla **tutti** gli script da cui la pagina dipende: lo script della pagina (`window.__pagina`, `window.__scena`) e, nelle pagine interne, la cornice (`window.Cornice`, che `website/cornice.js` imposta alla fine). Prima controllava solo il primo: se `cornice.js` non si caricava (rete, 404, un blocco, un errore) la classe `js` restava e i titoli dei tratti, la bolla della risposta e il messaggio da inoltrare restavano invisibili, perché nessuno aggiungeva `visto`. Una pagina nuova che usa la cornice scrive `if(!window.__pagina||!window.Cornice)…`; la prova è `design/lavoro/2-3a-correzioni/prove/senza-cornice.mjs` (incarico 2-f, 17/11/2026).

## Che cosa è provato

**Prima dello spostamento, nella prova (15/11/2026).** Il sistema è stato confrontato con la home scelta dal proprietario, in Chromium senza finestra, con l'orologio della scena fermato e avanzato a mano: foto confrontate punto per punto, poi stili calcolati di ogni elemento e animazioni. 88 foto, a 1440×900, 390×844, 820×1180 e 1366×640, ciascuna a riposo, dopo aver scorso la pagina, con l'ascolto aperto, con una frase che suona, con l'errore dell'audio, con il menu aperto (390 e 820) e con «riduci movimento».
- **74 su 88 a 0 pixel diversi.**
- **14 foto con pixel diversi, non conclusive**: dove la voce suona le barre e la luce differiscono al terzo decimale (la pagina confrontata con sé stessa dà lo stesso rumore); errore a 390 e 820 (9–16 px, scarto 2 su 255); le ultime schermate dello scorrimento a 1440 e 1366 (92–97 px); e 820×1180 a riposo e nelle prime due schermate dello scorrimento (fino a 128992 px), con differenze solo in valori guidati dall'orologio della scena. Su quest'ultimo caso un controllo a parte ha dato 0 pixel con «riduci movimento», e con il movimento differenze dello stesso ordine della pagina confrontata con sé stessa.
- Le foto e gli esiti di quelle prove sono rimasti nella cartella della prova, fuori da questo repository.

**Dopo lo spostamento in questo repository (16/11/2026).** Il sito costruito da `tools/site.py` è stato confrontato con la home della prova, con lo stesso strumento:
- con «riduci movimento», a riposo e a ogni schermata dello scorrimento: **0 pixel diversi** a 390×844 e 820×1180; a 1440×900 e 1366×640 0 pixel ovunque tranne una schermata ciascuna con 8 pixel (scarto 2–3 su 255) e 0 proprietà calcolate diverse;
- stati aperti a 390×844: menu 0 pixel; errore dell'audio 16 pixel (scarto 2); ascolto e frase che suona con il solo rumore delle barre della voce. A 1440×900 ascolto ed errore a 0 pixel;
- le sei pagine interne e la pagina 404 costruite sono identiche, byte per byte, a quelle di prima;
- home, catalogo e una pagina interna aperti nel sito costruito: 0 errori in console, 0 richieste fallite, i collegamenti della home rispondono, la voce parte; il catalogo legge 705 token;
- `controlla-sorgenti.mjs`: **verde**, «16 fogli di stile, valori solo nei token».

**Dopo lo specchio e le lingue (16/11/2026, incarico 1).** La home costruita in italiano (`/it/`, senza il selettore della lingua, che aggiunge una voce alla barra e un elenco nel piede) è stata confrontata con quella di prima (sorgenti di HEAD), con «riduci movimento», a riposo e a ogni schermata dello scorrimento, 3 foto per parte e per schermata (per ogni schermata conta la coppia più vicina: una pagina non è mai uguale a sé stessa in tutte le foto, per un'animazione a metà o una sezione che si rivela un momento prima):
- Chromium, 1440×900, 390×844, 820×1180, 1366×640, più menu, ascolto ed errore dell'audio a 390×844: **30 schermate su 30 a 0 pixel diversi** (3 schermate sono rumorose già fra le foto della pagina di prima); Firefox e WebKit, 1440×900 e 390×844: **13 su 13**; senza JavaScript, 1440×900 e 390×844: **13 su 13**;
- Chromium, prima dello specchio e a parità di tutto il resto (solo i fogli e i token): 27 su 30 a 0 e le altre 3 con il solo rumore (12, 42 e 83 pixel, scarto 3, 3 e 22: due schermate dello scorrimento e il cerchio che gira nell'ascolto);
- con il selettore (la costruzione di tutti i giorni) le differenze sono soltanto due: la voce «Italiano» in barra (una fascia di 3776 pixel alta 14 px, a 1440 e 1366: le altre voci scorrono di 97 px) e l'elenco delle lingue nel piede, che alza il piede (ultime schermate) e aggiunge una voce al menu aperto (390); a 820 e 390 la barra non cambia;
- le frasi che lo script legge dalla pagina sono quelle che stavano scritte dentro lo script (testo, parti, parole, gruppi, unità, lunghezze, chi annuisce): uguali;
- l'ordine di Tab: uguale (26 soste a 1440, 22 a 390), lento e veloce; con il selettore una sosta in più nella barra (a 1440) e una nel piede;
- le sette pagine di prima e la «non ancora» di HEAD, spostate in `it/`: 0 pixel diversi a 1440×900 e 390×844 (il loro HTML cambia solo negli indirizzi: una cartella in più, `./` per il collegamento a sé stesse, `dir="ltr"`); i vecchi indirizzi portano a `it/` anche con ricerca e frammento, con e senza JavaScript, e `404.html` (sotto il prefisso `/kalliope/`) porta in `it/`;
- `controlla-sorgenti.mjs`: **verde**, «20 fogli di stile, valori solo nei token» (con i quattro fogli delle pagine interne dell'incarico 3a); il catalogo legge 799 token (tutti i blocchi) e 0 errori in tre motori; `tools/css_logico.py` verde, 49 prove degli strumenti di traduzione e del sito (con copie guastate apposta).
Prove: `design/lavoro/1-lingue-sito/progresso.md`; foto e programmi: `design/lavoro/1-lingue-sito/prove/`.

## Da decidere

1. **Valori quasi uguali che potrebbero essere lo stesso ruolo** (elenco in `TOKEN.md`): colori con lo stesso rgb e opacità a 0,06 o meno (33 coppie; bordi in rosa chiaro a 0,10 / 0,12 / 0,14 / 0,20 / 0,22 / 0,30 / 0,34 / 0,35 / 0,40; testi a 0,60 … 0,90), gradini a 1 px (corpo 8 coppie, interlinea 7, raggi 5, spazi 13, misure 1), durate a 40 ms (17 coppie). Unendoli si risparmierebbero **al più circa 84 token** (33 colori, 34 gradini, 17 durate; ogni catena conta uno in meno del numero dei suoi elementi), a costo di cambiare l'aspetto di poco.
2. **`<meta name="text-scale" content="scale">`**: `controlla-sorgenti.mjs` la pretende in ogni pagina costruita; la home non l'ha e non è stata aggiunta (può cambiare la pagina su Android con il testo ingrandito, e non è stato provato). Nella configurazione il controllo copre solo il catalogo, che ce l'ha.
3. Nomi a numero delle scale; testo in px (non segue la grandezza del testo di sistema); `scena.js` e HTML con valori non tokenizzati (`ENTRA`, durate delle animazioni dello script, colori delle onde, `theme-color`; i colori del marchio sono ora token); `.f-stato.allarme` definito e mai usato; le sezioni di `TOKEN.md` «Spazi» e «Misure» mescolano gradini e misure di componente (le scale di spazi stanno sotto «Misure»).
4. **Per l'applicazione**: i token sono scritti come variabili CSS. Come portarli nell'applicazione (che non usa CSS) non è deciso né fatto.

## Non verificato

- Solo Chromium, solo quattro misure; niente Firefox e WebKit per il sistema. Nessuna matrice dei dispositivi.
- Hover, fuoco e premuto reali non confrontati foto per foto (le regole `:hover`/`:active`/`:focus-visible` sono identiche per costruzione); nel catalogo si vedono forzati.
- La voce vera nel confronto: lì l'audio è finto, con orologio virtuale. Nel sito costruito la voce vera è stata fatta partire una volta, senza ascoltarla.
- Il confronto di geometria con la scelta del proprietario (`confronta-scelta.mjs`) sui file finali; le foto dell'arrivo a 820 e 1366; il catalogo ad altre larghezze e in altri motori; le prestazioni (16 fogli di stile invece di uno).
- La pubblicazione su GitHub Pages con questa disposizione: provata solo costruendo il sito in locale.

## Che cosa il catalogo non copre

Persone e percorsi di tutto il sito; anteprime dei compiti oltre la home; icone e immagini (il marchio è in «Il marchio»; le figure sono inline); interazioni (tastiera, tocco: provate sulla home, non qui; gli stati qui sono forzati); dati e media (nessun audio); accessibilità e testo grande; prestazioni e canali; provenienza e decisioni (la direzione è in `design/direzione-2/`); i quindici dispositivi nei tre motori (qui tre larghezze vive); gli esiti letti dai log; lingue. Il catalogo non si dichiara completo: l'elenco con i motivi è in fondo alla sua pagina («Non ancora»).
