# «Installa» nella direzione 2 · piano dei tratti (incarico 3c, 20/11/2026)

**L'idea, in una frase.** Ogni passo si vede riuscire: accanto a ciò che si copia, la pagina mostra ciò che il computer di chi installa
risponde (il file nella cartella, l'impronta uguale cifra per cifra, i file in `/usr`, la finestra che dice «Pronta», la riga `kalliope`),
fino al posto tratteggiato di «Kalliope» che si riempie nella barra del microfono della riunione.

Lo stesso mondo della home, di «non ancora» e di «stato» (`design/direzione-2/D2.md`, `PIANO.md`; `3a-non-ancora/PIANO.md`; `3b-stato/PIANO.md`):
un solo colore, la stanza con la luce, la riunione con Paola, Luca e Anna, la barra del microfono dell'app, il **tratteggio** come segno di
«non ancora» (qui: il posto di «Kalliope» prima dell'installazione, il «Se no…» di ogni passo), le scene a tutta larghezza con gli angoli alti
di un riquadro che si allargano dai lati, nella stessa successione (notte, stanza, chiara, stanza con la luce grande, notte), la curva
d'entrata `cubic-bezier(0.19,1,0.22,1)`, i titoli che salgono, la scrittura a 33 ms a carattere della home. Il pezzo nuovo è il
**terminale**, disegnato nel mondo della pagina: dove nelle altre pagine c'è la bolla con la frase che scrivi, qui c'è il comando che scrivi.

Percorsi: `R/` = `/workspace/prova-design-abc/prova-2/riferimenti/`, `K/` = `/workspace/kalliope/design/ricerca/prove/`. Prove di questa resa
(fuori dal repository, `.gitignore`): `sequenze/` (arrivo, scorri, sistema, frase, copia), `foto/` (schermi bassi e medi, ridotto, senza
JavaScript, `stati/`, `pagina/`, `lingue/` en-XA e ar-XB), `confronti/` (fogli a coppie nei due versi), `esiti/` (`confronta-scelta`).

## Prima di rendere: che cosa fanno i riferimenti, sotto il primo schermo e nelle pagine di installazione

Guardati negli scorrimenti (`R/sequenze/R03/scorri-1440x900-foglio.jpg`, `R/sequenze/R05/scorri-senza-avviso-1440x900-foglio.jpg`) e, per il
genere di questa pagina (guidare un'installazione a passi, compito C4 di `design/ricerca/piano.md`), nelle foto delle due pagine visitate che
lo fanno: **R05 LALAL.AI** (Webby 2026, People's Voice; `K/R05/014-vai.jpg`, `015-clic.jpg`, pagina `/desktop-app/`) e **R50 Text-to-Mic**
(concorrente diretto, non Webby; `K/R50/desktop/003-scorri.jpg`, `004-scorri.jpg`, `007-scorri.jpg`).
- Tratti comuni del genere: sotto il primo schermo sezioni con un titolo e un oggetto; una chiamata finale prima del piede (R03, R05, R52, R53);
  il comando principale con un verbo («Download for Ubuntu», «Download for Windows»).
- Peculiarità candidate, provate una alla volta:
  - **R05**: il pulsante di scarico del proprio sistema con le alternative accanto e la data dell'ultima versione (`K/R05/014-vai.jpg`,
    `015-clic.jpg`) → **presa, adattata**: un browser non sa dire Debian da Fedora, quindi la persona sceglie fra quattro voci e il pulsante
    diventa quello del suo file, con la dimensione; la data è nel piede e nel numero della versione.
  - **R50**: i passi con il risultato vero nell'app che si usa, compresa la scelta del microfono dentro Meet con la freccia
    (`K/R50/desktop/004-scorri.jpg`) → **presa, un tratto solo** (R50 è un concorrente diretto): la verifica è nella barra del microfono
    della riunione ricostruita, nel nostro mondo, senza copiare un'app.
  - **R50**: il riquadro fisso accanto ai passi (`K/R50/desktop/003-scorri.jpg`) → **preso come meccanismo, non come contenuto**: qui ciò che
    resta fermo accanto al testo è la scena (la cartella e il terminale; la cartella `/usr`; la finestra), non i requisiti.
  - **R50**: l'onestà in pagina (impronta, avviso) (`K/R50/desktop/007-scorri.jpg`, `008-scorri.jpg`) → già nel sito («stato»); qui il
    pacchetto non firmato, l'avviso di dnf, l'attestazione che la 0.1-rc.1 non ha.
  - **R51**: la schermata del prodotto con le didascalie sulle parti → **non presa**: provata a parole, la finestra con le frasi che si
    provano dice di più (le frasi sono il compito, non le parti).
- Il difetto da non prendere: le schede di scarico uguali per sistema in fila (R50 `007-scorri.jpg`, R05 le tre schede sotto il primo
  schermo). Qui un solo comando per volta, quello della distribuzione scelta.

## Le alternative, prima di scegliere

1. **Ogni passo si vede riuscire** (scelta): la pagina come computer di chi installa, passo per passo, ognuno con la sua risposta vera.
   Rischio smontato: «una pagina di istruzioni impilate» → i passi stanno in quattro scene diverse (notte, stanza, chiara, chiusura), ognuna
   con il suo oggetto (cartella e impronta, cartella dei file, finestra, microfono), e i comandi delle quattro distribuzioni non si
   ripetono in fila: se ne vede uno, quello scelto.
2. **La strada fino al microfono** (la strada di «stato» e della home come indice fisso dei cinque passi, che si riempie scorrendo):
   scartata come idea della pagina: ripete la catena di «stato», e una barra di avanzamento non mostra niente accadere. Resta, ridotta,
   nella ripresa della chiusura («Se ti sei fermato»).
3. **Il terminale come conversazione** (i comandi come bolle tue, le risposte come bolle del computer): scartata: la bolla nel sito è ciò che
   si dice nella riunione; un comando in una bolla confonderebbe chi installa per un altro.

## I tratti, dall'arrivo al piede

| Tratto | Dentro l'idea | Che cosa si muove, e a che scopo | Fonte o motivazione |
|---|---|---|---|
| Barra | La stessa sala | Come in «non ancora» e «stato»: trasparente in cima, piena appena si scorre; al telefono «Menu». «Installa» ha `aria-current` (la regola di M1 di «stato» la segna). Nessuna azione in barra. **Orientare** | Cornice (`barra.css`, `cornice.js`); barra fissa: R03 |
| Primo schermo | Il titolo dice l'idea: «Installa Kalliope. Ogni passo si vede riuscire.» Sotto, la scelta della distribuzione (quattro pulsanti-voce e «Non uso Linux»), il pulsante del file con la sua dimensione, «Lo installa un'altra persona», lo stato «Oggi:», la didascalia. Accanto, **al posto della bolla il terminale**, sopra la riunione di «non ancora» (il tuo riquadro tratteggiato «Tu · senza voce», nella barra del microfono il posto tratteggiato di «Kalliope») | **Arrivo** (`sequenze/arrivo/`): righe del titolo, testo, scelta e comandi come nelle altre pagine; i riquadri entrano, «Tu» per ultimo; il terminale entra (1,5 s) con il cursore; a 2 s il comando della distribuzione scelta si scrive (33 ms a carattere, dentro lo spazio che avrà: la riga non cresce), Invio, due righe sbiadite del computer che lavora, il cursore di nuovo; a ~5,5 s **il posto tratteggiato di «Kalliope» si riempie** con l'anello della voce, il segno della scelta passa a lui, il tuo riquadro perde il tratteggio, si accende e diventa «Tu · microfono «Kalliope»». Poi fermo. **Gesto: un'altra distribuzione** (`sequenze/sistema/`): il pulsante, la riga sotto e il comando del terminale diventano i suoi (riscritto in fretta, 14 ms a carattere). **Raccontare** in cinque secondi dove porta la pagina: dal comando al microfono. Prova della rimozione: senza il passaggio dal tratteggio al pieno il terminale e la riunione sono due figure accostate | Impianto, riunione e barra del microfono della home e di «non ancora» (`riunione-ferma.css`: il posto tratteggiato); pulsanti-voce: R51 attraverso la home; pulsante del proprio sistema con le alternative: R05 (`K/R05/014-vai.jpg`); il terminale al posto della bolla: progettuale |
| Passaggi | Ogni tratto è una scena della stessa riunione | Scene in tono: notte (il file), stanza (installa), chiara (apri), stanza con la luce grande (il microfono), notte (piede): la successione della home e di «stato». Entrando si allargano dai lati, legate allo scorrimento. **Collegare** | `tratti.css` |
| Il file giusto, e uguale (notte) | Che cosa serve (64 bit, Wayland o X11, PipeWire con pipewire-pulse; la voce di 53 MB con curl), poi due passi: **Scarica** (il nome e la dimensione del file) e **Controlla che sia uguale** (`sha256sum`, il numero atteso, tutti i file con SHA256SUMS, l'attestazione che manca). Accanto, ferme sotto la barra mentre si legge: la cartella «Scaricati» e il terminale | **Arrivo** (`sequenze/scorri/`, 1,5-6 s): il file scende nella cartella con il suo nome e la sua dimensione; nel terminale il comando, la risposta (l'impronta), il numero pubblicato sotto; poi **le due impronte si confrontano a gruppi di otto cifre** che si accendono insieme, da sinistra a destra, e alla fine nasce «Uguale, cifra per cifra». Per Arch: la riga vera di makepkg («Validating source files with sha256sums...»). **Mostrare** come si confronta un'impronta, mentre lo si legge. Al telefono la cartella e il terminale vengono prima dei due passi | Tratto comune: titolo e oggetto; riquadro fermo accanto ai passi: R50 (`K/R50/desktop/003-scorri.jpg`, il meccanismo); onestà sull'impronta: R50 (`007-scorri.jpg`); il confronto a gruppi: progettuale |
| Installa (stanza) | Il comando della distribuzione (tre per Arch e per l'archivio), dove va (`/usr` con la password di amministratore, `~/.local` senza) e che fuori dalle sue cartelle non tocca niente; il pacchetto non firmato e l'avviso di dnf; «Riuscito se» `kalliope --version`; «Se no» con il controllo di glibc; la prova dello script; «Per togliere Kalliope» a richiesta. Dalla parte dove comincia la riga, il terminale e **la cartella che riceve i file** | **Arrivo** (7,5-10 s): il comando, le righe del computer che lavora (per l'archivio la riga vera di `./install`, in inglese); intanto **i file scendono nella cartella** uno dopo l'altro (`bin/kalliope`, `bin/kalliope-cli`, `lib/kalliope · ONNX Runtime`, `share/applications · nel menu`, quest'ultimo pieno); poi `kalliope --version` e la risposta («kalliope» e il numero, come riga del tuo computer). La scena cambia lato rispetto al file. **Mostrare** «senza rompere nulla»: che cosa arriva e dove | I file e le cartelle di `packaging/linux/build-packages.sh` e `install` a `v0.1-rc.1`; la discesa dei file: il varco di «stato» (`varco.css`, la curva `--curva-pacco`) |
| Apri Kalliope (chiara) | Dal menu; la prima volta «Scarica la voce» (53 MB) [cambia con la prossima versione]; «Preparo la voce…» a ogni avvio; «Riuscito se» la riga dice «Pronta…». Poi **«Se la riga dice altro»**: le quattro frasi della finestra che possono comparire al posto di «Pronta» (curl, scarico non riuscito o annullato, impronta, «La voce è pronta, ma …»), ognuna con che cosa fare; il resto alla pagina Aiuto. Accanto, ferma, la finestra di Kalliope ricostruita | **Arrivo** (10,5-13,5 s): il primo avvio vero, con le frasi di `main.rs` della 0.1-rc.1: «Per parlare, Kalliope deve scaricare la voce…», «Scarica la voce» premuto, «Scarico la voce… N di 53 MB» con la barra e «Annulla», «Preparo la voce…», «Pronta». **Gesto** (`sequenze/frase/`): premuta una frase, la finestra la mostra nella sua riga (in allarme) e, se è un errore dello scarico, torna «Scarica la voce»; premuta di nuovo, torna «Pronta». **Provare** prima di trovarsela davanti: che cosa vuol dire quella frase e che cosa fare | Le frasi vere (`progetto.md` §2.4, `main.rs`, `download.rs` a `v0.1-rc.1`); la finestra ricostruita e il primo avvio della home (`finestra.css`); la frase premuta come le domande di «stato»: progettuale |
| «Kalliope» è fra i microfoni (chiusura) | `pactl list short sources` con la sua risposta; «Riuscito se» c'è la riga con kalliope, «Se no» la frase della finestra; nella barra del microfono dell'app «Kalliope» scelto; **«Usalo in una riunione»** (la pagina dopo), la segnalazione su GitHub con che cosa scrivere. Sotto, due cose diverse una accanto all'altra: **«Se ti sei fermato, riprendi da qui»** (la strada dei cinque passi, ognuno con ciò che vedi se ti sei fermato lì, collegato al suo passo) e **«Lo installa un'altra persona?»** (l'indirizzo della pagina nella bolla, «Copia l'indirizzo») | **Arrivo** (15-16,5 s): il comando, due righe sbiadite, poi **la riga con «kalliope»** che si accende; poco dopo nella barra del microfono il posto tratteggiato di «Kalliope» si riempie con l'anello della voce (lo stesso momento del primo schermo, ora per davvero sul tuo computer). **Gesti**: «Copia l'indirizzo» (la bolla risponde con l'anello, sotto «Copiato…»; se gli appunti non ci sono, la frase per copiarlo a mano). **Chiudere il cerchio** e **decidere** che cosa fare dopo | Chiamata finale prima del piede: tratto comune (R03, R05, R52, R53); la ripresa: la pagina di prima («Se ti sei fermato qui») con la strada della home; il messaggio nella bolla e la copia: «stato» (`inoltra.css`), «non ancora» (`versioni.css`) |
| Piede | — | Fermo, su notte, come nelle altre pagine | `piede.css` |

**«Copia» accanto a ogni comando** (`sequenze/copia/`, `foto/stati/copia-*`): «Copiato» nella stessa cella per 1,6 s e la luce della voce intorno
al comando; se il browser non lascia, sotto il comando la frase per copiarlo a mano e il comando selezionato. Senza script un clic seleziona il
comando intero.

**Senza JavaScript** (`foto/primo-senzajs-*.png`, `foto/senzajs/`): tutto il testo; la scelta della distribuzione funziona (CSS, `:has`); ogni
comando scritto e selezionabile con un clic; il primo schermo al suo stato finale (installato); i terminali con tutte le righe, le impronte
intere e «Uguale» scritto; la finestra su «Pronta»; ogni frase con il suo rimedio sotto. Dove `:has` non c'è si vedono tutte le distribuzioni.
**Movimento ridotto** (`foto/primo-ridotto-*.png`): ogni scena al suo stato finale; i gesti restano.
**Da destra a sinistra** (`foto/lingue/ar-XB-*`): proprietà logiche in tutti i fogli nuovi (`css_logico.py` verde); i comandi, i nomi dei file,
le impronte e il contenuto dei terminali restano da sinistra a destra (`direction: ltr` sul codice e sul corpo del terminale); «Tu» all'inizio.
**Testo più lungo del 40%** (`foto/lingue/en-XA-*`): il titolo va su cinque righe e spinge giù i comandi (a 1440×900 il pulsante sta ancora
nello schermo, a 1366×640 no); nulla esce dai bordi nelle foto fatte.

## La cornice: che cosa ho aggiunto, senza cambiare le altre pagine

- Nessun file della cornice toccato (`pagina.css`, `cornice.js`, `barra.css`, `componenti.js` uguali). Home, «non ancora» e «stato» identiche alla
  costruzione di partenza (`1c6ba5a`): `confronta-scelta` 0% a 1440×900, 390×844 e 1366×640 (`esiti/confronta-scelta-*.txt`).
- Il contenitore `.mondo` della pagina ha anche la classe `sistemi-pagina` (la scelta della distribuzione vale per tutta la pagina).
- Sugli schermi bassi del computer (sotto i 700 px d'altezza) il titolo di questa pagina prende la misura del tablet, come quello di quattro
  righe di «stato»: con la scelta della distribuzione in più, a 1366×640 sotto il comando resta lo stato «Oggi:» (`foto/primo-1366x640.png`).
  La regola sta in `installazione.css` (`.scena-pagina:has(.palco-installa)`), non in `pagina.css`.
- Il telefono girato (844×390): il comando sta nel primo schermo, lo stato no (la scelta della distribuzione prende il suo posto): da guardare
  con la regola della cornice, che vuole comandi e stato.

## Stile di default (`giudizio.md`, parte E)

- **Pillole**: sì, come nella home e nelle altre pagine (R01 «Let's begin», R03 «Talk to sales», `R/primi-schermi/R01-1440x900.jpg`,
  `R03-1440x900.jpg`): i comandi, le distribuzioni (pulsanti-voce di R51), le etichette dei file.
- **Etichette in monospazio**: i comandi, i nomi dei file e i percorsi sono nel carattere del terminale perché sono codice da copiare (R50 scrive
  le scorciatoie in un carattere a spaziatura fissa, `K/R50/desktop/004-scorri.jpg`; R50 è un concorrente diretto, non un vincitore: dichiarato).
  Nessuna etichetta in monospazio maiuscolo, nessuna etichetta numerata (i passi non hanno numeri: hanno un nome).
- **Gradiente**: le luci della stanza della home (monocromo come R01).
- Niente crema e grazie, corsivo, griglia di schede uguali (un comando per volta), elenchi con le spunte («Riuscito se…» è una riga, piena;
  «Se no…» tratteggiata), fasce vuote fra sezioni dello stesso fondo. Le entrate non sono una dissolvenza uguale per tutti: il comando che si
  scrive, le righe del computer, le cifre che si confrontano, i file che scendono, la finestra che racconta il primo avvio, il posto che si
  riempie.

## Scelte senza una fonte (progettuali, dichiarate)

- Il titolo come idea («Ogni passo si vede riuscire»); il terminale al posto della bolla nel primo schermo; il posto tratteggiato di «Kalliope»
  che si riempie come momento dell'installazione; i tempi dell'arrivo (2 s, 33 ms a carattere, 300 ms fra le righe, 380 ms).
- Il terminale disegnato nel mondo della pagina; la **riga sbiadita** per ciò che dipende dal computer di chi installa (la pagina non inventa
  l'uscita di apt, le altre sorgenti audio, il numero della versione); il carattere del terminale del sistema (`--font-terminale`).
- Il confronto dell'impronta a gruppi di otto cifre e «Uguale, cifra per cifra»; i file che scendono nella cartella; «Riuscito se… / Se no…»
  con la riga piena e quella tratteggiata; le frasi della finestra da provare; la strada della ripresa; i lati alterni dei tratti.
- La scelta della distribuzione con `:has` e senza ricordarla (il sito non salva niente, come diceva la pagina di prima).

## Da completare a chi costruisce

**Sistema**
- Catalogo (`design-system/catalogo/`, un file per area come `catalogo-stato.js`): i quattro componenti con stati e varianti: la scelta del
  sistema (quattro scelte, fuoco, senza `:has`); il comando (riposo, copiato, non riuscito, senza script; il comando-numero; il comando in una
  frase; sulla scena chiara); il terminale (in attesa, mentre scrive, righe sbiadite, impronta confrontata, riga trovata; da destra a sinistra);
  l'installazione (primo schermo prima e dopo; cartella e file; finestra con ogni frase; la ripresa; l'indirizzo copiato e non copiato).
- `installa.js` mette `--ritardo-pacco` sui file (dai token `--passo-riga-terminale` e `--passo-pacchi`): controllato da `controlla-sorgenti`, ma
  da riguardare con la regola di «stato» sui moltiplicatori.

**Stati, errori e recupero**
- Gli indirizzi vecchi con l'ancora (`/installa/#fedora`, `#debian-ubuntu`, `#arch`, `#altre`, `#passo-1`…`#passo-5`, `#ripresa`): oggi
  portano alla pagina senza scegliere niente. Proposta: l'ancora di una distribuzione la sceglie, quelle dei passi portano ai passi nuovi.
- La distribuzione cambiata a metà dell'arrivo, a metà del confronto dell'impronta, a metà della discesa dei file: provato a mano solo nel
  primo schermo.
- Le frasi della finestra: tastiera (oggi Tab e Invio, `aria-pressed`), annuncio per i lettori di schermo della riga di stato che cambia,
  il passaggio telefono ↔ computer con una frase premuta; al telefono la finestra sta sopra le frasi (si vede premendo).
- «Copia»: Firefox e WebKit; annuncio (`#annuncio`); la frase di errore che resta finché non si ripreme; i comandi lunghi a 320 px.
- Senza JavaScript la pillola del file ripete l'entrata (640 ms) a ogni cambio di distribuzione: da decidere se togliere l'animazione da CSS.
- Scheda in secondo piano durante l'arrivo, ricarica a metà pagina, salto con il fuoco a un passo (la cornice rivela il tratto; i terminali
  partono da lì).

**Larghezze, lingue e motori**
- Guardate: 1440×900, 1366×640, 1280×720, 1024×768, 390×844, 390×667, 844×390. Da guardare: le altre misure, i 15 dispositivi, testo grande e zoom
  (i comandi lunghi vanno a capo dove capita: `overflow-wrap: anywhere`).
- Pseudo-lingue: en-XA allunga il titolo a cinque righe (a 1366×640 il pulsante del file scende sotto il bordo); le quattro distribuzioni vanno
  su due righe; ar-XB guardato a 1440 (primo schermo e pagina intera), non al telefono.
- Firefox e WebKit (qui solo Chromium senza finestra). Il carattere del terminale dipende dal sistema: su un computer senza DejaVu Sans Mono né
  Liberation Mono cambia la larghezza dei comandi.
- `<meta name="text-scale">`: come la home e «stato», non messa.

## Non verificato

- Firefox, WebKit, telefoni veri, lettori di schermo, testo grande e zoom; le larghezze di mezzo oltre 1024.
- Le uscite dei programmi: la riga di `./install` e quella di makepkg sono testo vero (lo script della 0.1-rc.1; il formato noto di makepkg), il
  resto è disegnato come riga sbiadita apposta. Nessuna installazione è stata fatta per questa pagina.
- La 0.1-rc.1 risponde a `kalliope --version` con «kalliope 0.1» (la versione di Cargo, 0.1.0): la pagina non lo scrive (`CONTENUTI.md`, voce 43).
- Che i gestori dei pacchetti non tocchino le preferenze e la voce scaricata: lo dice lo script dell'archivio; per i pacchetti è il modo in cui
  lavorano, non una prova (`CONTENUTI.md`, voce 46: in contrasto con «stato»).
- I tempi delle sequenze sono di una macchina condivisa; il ritmo va guardato nei video.
