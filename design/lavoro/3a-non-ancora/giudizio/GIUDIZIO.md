# Giudizio · la pagina «non ancora» (incarico 3a-g)

Giudice: ruolo design-judge, che non ha reso né costruito la pagina. Data: 16/11/2026. Scritto mentre guardavo, prima
di leggere le note di chi l'ha resa (la sezione «Le note di chi l'ha resa» è stata aggiunta dopo, in fondo).

**Che cosa ho guardato.** Il sito costruito dal lavoro di adesso (`python3 -I tools/site.py --out /tmp/lavoro-3ag-sito`,
pagina `/it/non-ancora/`) e, come termine di confronto, la home del commit HEAD (quella che il proprietario ha
scelto, costruita a parte in `/tmp/lavoro-3ag-head/`). Tutte le prove sono mie; le copie stanno in `prove/` accanto a
questo file (i nomi sotto sono relativi a `prove/`).

- Sequenze (`sequenza.mjs`, Chromium): arrivo, scorrimento intero (12 s), gesto «Ascolta Giulia», a 1440×900 e
  390×844, con video: `sequenze/`. Strada e versioni fotogramma per fotogramma: `strada/`.
- Percorso P6 (tastiera, telefono, menu): `percorso/`. Senza JavaScript, con script, audio, `tempi.json`, caratteri o
  CSS che non arrivano, movimento ridotto, Firefox, una vista con `dir=rtl`: `robustezza/`.
- Larghezze dalle soglie (`soglie.mjs`: 350, 361, 375, 421, 441, 761, 960, 1000, 1011, 1181, 1210) e schermi bassi:
  `larghezze/`.
- Coppie con R01, R03, R05 e con la home, nei due versi, primo schermo e sotto: `coppie/`.
- `confronta-scelta.mjs` sulla home (HEAD contro adesso): `scelta/`. `controlla-sorgenti.mjs`: verde.

---

## Problemi, in ordine di gravità

Nessun problema bloccante. Sei importanti, otto minori.

### Importanti

**I1 · Manca lo stato «non ancora provata in una riunione vera con Zoom, Teams o Meet».**
- Dove: la riga «Oggi:» del primo schermo (`sequenze/arrivo-1440x900-f09.jpg`, `arrivo-390x844-f09.jpg`) e tutta la
  pagina. La home la dice nello stesso posto (`coppie/na-home-1440-ab.jpg`, destra: «Non ancora provata in una
  riunione vera con Zoom, Teams o Meet»).
- Perché: `progetto.md` §7 («Promesse che il sito non può fare»: «Funziona con Zoom, Teams o Meet» come fatto) e §9
  («Stato onesto»). Qui pesa di più che altrove: la strada mostra «Zoom, Teams, Meet → Gli altri ti sentono» come ciò
  che su Linux c'è (`sequenze/scorri-1440x900-f04.jpg`) e la chiusura invita a installarlo sul Linux di una persona
  vicina (`sequenze/scorri-1440x900-f13.jpg`). La persona di P6 ne ricava che su Linux funziona in riunione.
- Correzione: la riga dello stato dice anche che la prova in una riunione vera non c'è ancora, come nella home; la
  strada non presenta come fatto il tratto dopo il microfono.

**I2 · Una promessa implicita: «Non esiste ancora … né come servizio online o estensione del browser».**
- Dove: fondo del tratto «Si ferma al microfono» (`sequenze/scorri-1440x900-f06.jpg`; al telefono
  `sequenze/scorri-390x844-f08.jpg`, in alto).
- Perché: «ancora» annuncia un servizio online e un'estensione che il progetto esclude per natura (`progetto.md` §1.4
  «Non è un servizio online, né un'estensione del browser, né un'app per telefono»; §9 «Nessun server»). Contraddice
  anche il primo schermo della stessa pagina, che dice «Per telefono e tablet Kalliope non esiste» senza «ancora». I
  testi saranno riscritti, ma la riscrittura deve sapere che qui c'è una promessa da non portare.
- Correzione: ciò che il prodotto non è si dice come confine («non è»), non come attesa; «non ancora» solo per Windows e
  macOS, che il progetto prevede.

**I3 · La decisione finisce in un file XML.**
- Dove: «Come saperlo quando arriva» (primo schermo) porta a «Segui le versioni (feed)», la pillola principale del
  tratto chiaro (`sequenze/scorri-1440x900-f09.jpg`, `percorso/tab-11.png`), che apre
  `…/kalliope/releases.atom`.
- Perché: P6 è «la maggior parte dei computer» (`progetto.md` §10); per chi non usa un lettore di feed il comando
  principale apre un file grezzo o lo scarica, senza una parola su che cosa sia. Il feed, poi, segnala ogni versione,
  anche quelle solo per Linux, mentre la pagina promette che «un lettore di feed te lo segnala» quando arriva Windows o
  macOS. Il feed esiste (verificato da chi ha reso il 16/11: 200, una voce; io non l'ho riaperto) e le sue note sono
  in inglese, cosa che la pagina non dice. È l'unico gesto di decisione della pagina e oggi funziona solo per chi sa
  già che cos'è un feed.
- Correzione: il comando principale porta a qualcosa che una persona qualunque sa usare (per esempio la pagina delle
  versioni), il feed resta accanto per chi lo sa usare, con una riga che dice che cos'è e che segnala ogni versione.
  Se serve un altro modo di essere avvisati (con o senza account), lo decide il proprietario: va chiesto, non
  inventato.

**I4 · Il catalogo non mostra niente di ciò che la pagina ha aggiunto.**
- Dove: `design-system/catalogo/` aperto nel sito costruito: zero occorrenze di `.strada-ferma`, `.palco-fermo`,
  `.versioni`, `.scena-pagina`, `.ascolta-ferma`; nessuna voce «versioni», «senza voce», «La prossima».
- Perché: `CLAUDE.md` («il catalogo cresce con la pagina») e `direzione.md` §6 («il catalogo vivo cresce tratto per
  tratto e mostra ciò che la pagina usa, con stati e varianti»); al proprietario la pagina arriva con il suo sistema.
  Non è una colpa della direzione: il suo incarico le vietava di toccare il catalogo mentre lo cambiava l'incarico 1.
  Va chiuso prima di mostrare la pagina. `controlla-sorgenti.mjs` è verde: i valori stanno nei token.
- Correzione (ruolo di costruzione): il catalogo mostra la riunione ferma, la strada ferma con la sua animazione, il
  pannello delle versioni con il posto vuoto, l'apertura delle pagine interne e l'ascolto della chiusura con i suoi
  stati (fermo, carica, suona, pausa, riprendi, ripiego).

**I5 · Sugli schermi bassi il primo schermo non ha nessun comando.**
- Dove: 390×667 e 360×640 (telefoni piccoli), 844×390 (telefono girato): «Come saperlo quando arriva» comincia a 697,
  689 e 388 px, sotto il bordo; a 360×640 è tagliato anche «Kalliope · non c'è», il segno che spiega la scena
  (`larghezze/bassi.png`, `larghezze/na-390x667.png`).
- Perché: `giudizio.md`, «La pagina intera»: su uno schermo basso il comando principale deve stare intero. La home ha
  lo stesso limite per «Scarica e installa», ma a 390×667 le resta almeno «Ascolta Giulia» in vista
  (`larghezze/home-390x667.png`); qui non resta niente da premere. E questa pagina fissa la cornice di stato, installa
  e in riunione, dove il comando conterà di più.
- Correzione: decidere a livello di cornice che cosa vince quando l'altezza manca (i comandi prima della scena, o una
  scena più bassa), e provarlo a queste tre misure.

**I6 · Il tratto della decisione è il più debole e il più generico.**
- Dove: «Non promettiamo date.» (`sequenze/scorri-1440x900-f09.jpg`; coppia con R05 `coppie/sotto-R05-1440-ab.jpg`).
- Perché: è una colonna di testo con un pannello scuro a destra che entra con una dissolvenza e poi resta fermo
  (`sequenze/scorri-1440x900-foglio.jpg`, 7–9 s; fotogramma per fotogramma: `strada/versioni-1440.jpg`). Nessuna cosa accade per
  far capire o decidere (`direzione.md` §6, punto 1); la prova della rimozione (D4) dice che l'entrata del pannello si
  può togliere senza perdere niente. Il posto vuoto «La prossima» col tratteggio è l'idea giusta, coerente con il segno
  dell'assenza del resto della pagina, ma non vive. Gli altri tratti hanno ciascuno un momento; questo no.
- Correzione (ruolo di direzione): dare al posto vuoto un comportamento che dica «qui arriverà, senza data» e che
  colleghi il pannello al comando, senza inventare date né versioni.

### Minori

**M1 · Quando l'audio non si carica la scena non lo dice, e la bolla sembra detta.** Bloccando `.mp3` e `.opus`, e in
Firefox su questa macchina senza uscita audio: il pulsante torna «Ascolta Giulia», sotto compare il lettore del
browser (grigio, fuori dal mondo della pagina) con lo stesso file, e il testo della bolla passa dal grigio «non detto»
al nero «detto» (`robustezza/senzaaudio-1440-premuto.png`, `robustezza/firefox-1440-ascolta.png`). Correzione: una
riga che dice che il suono non è partito; la bolla resta nello stato di prima.

**M2 · Il pulsante dell'ascolto cambia larghezza e sposta il collegamento accanto.** «Ascolta Giulia» → «Pausa» →
«Riprendi»: «Tutte le frasi, anche con Marco» salta a x 695 → 660 → 671 (`percorso/fuoco-ascolta.png`,
`percorso/spazio-ascolta.png`, `percorso/spazio-pausa.png`). Correzione: larghezza ferma fra gli stati.

**M3 · Al telefono la didascalia diventa una parola sola.** Sopra la scena resta «Ricostruzione», isolata, e si perde
la frase che spiega la scena («su Windows e macOS «Kalliope» non compare fra i microfoni…»), che al computer c'è
(`sequenze/arrivo-390x844-f09.jpg` contro `arrivo-1440x900-f09.jpg`). Al computer, al contrario, la didascalia sta
in basso a sinistra, lontana dalla scena che descrive (come nella home).

**M4 · La frase della bolla, nel primo schermo, è la cosa meno leggibile della scena.** Grigio su rosa pallido, voluto
(la frase non detta), ma è il primo testo che l'occhio cerca nella riunione, e la pagina è per persone con difficoltà
di lettura (`sequenze/arrivo-1440x900-f09.jpg`). Scelta da lasciare al proprietario.

**M5 · Premere subito dopo l'arrivo nel tratto parte il suono mentre la scena entra ancora.** A 0 s dal clic si vede
solo Paola, il pulsante dice già «Pausa» (`sequenze/ascolta-1440x900-foglio.jpg`, `ascolta-390x844-foglio.jpg`, primi
fotogrammi).

**M6 · Senza i fogli di stile le figure diventano enormi.** I disegni SVG non hanno misure proprie: la pagina diventa
alta 19.555 px con forme nere a tutta larghezza (`robustezza/sc1440-00.png`); in quello stato lo script dà due errori
(`animate`: durata negativa, perché legge i tempi dai token che non ci sono). La home ha lo stesso difetto (28.998 px):
è della cornice, non solo di questa pagina.

**M7 · Con `dir=rtl` la freccia di «Intanto, senti la voce» non si gira** (`robustezza/chromium-rtl-1440.png`): per la
fase 2 delle lingue. Il resto si specchia bene.

**M8 · Una scelta che il proprietario non ha ancora fatto.** «Se una persona vicina a te ha un computer Linux, Kalliope
si può installare lì» e «Non consigliamo altri prodotti» rispondono al dubbio E (`progetto.md` §12), ancora aperto in
`design/direzione-2/CONTENUTI.md` («chiedere»). Non è un'invenzione di questa pagina: sta già nella pagina pubblicata.
Va chiesto al proprietario, non corretto.

---

## Che cosa funziona e va tenuto

- **L'idea, in una scena sola.** La stessa riunione della home, ferma: «Tu · senza voce» tratteggiato, la frase non
  detta, e nel menu del microfono «Kalliope · non c'è» (`sequenze/arrivo-1440x900-f09.jpg`). Si capisce perché
  senza leggere. Nessun riferimento dice «non ancora» così; LALAL.AI (R05) mette i pulsanti per Windows e macOS, gli
  altri tacciono.
- **Il tratteggio come segno dell'assenza**, tenuto in tutta la pagina: il riquadro di chi parla, il microfono che
  manca, il microfono della strada, il posto della prossima versione. Forma, movimento e testo dicono la stessa cosa.
- **Il momento che resta: la voce che si ferma al microfono.** Il punto di luce parte da «Scrivi la frase», accende
  «La voce nasce qui» e urta il microfono tratteggiato, che lampeggia; poi si ferma (`strada/foglio-1440b.jpg`,
  `strada/foglio-390.jpg`, circa 1,5 s, una volta sola). È la spiegazione tecnica fatta movimento.
- **L'arco della frase.** «Buongiorno a tutti!» è grigia e muta in apertura, e in chiusura si sente con la
  registrazione vera, parola per parola, con le onde che arrivano a Paola, Luca e Anna (`sequenze/ascolta-1440x900-f08.jpg`).
  La pagina comincia con ciò che manca e finisce con ciò che c'è.
- **La cornice**: barra e piede uguali alla home, fogli tondi che si allargano dai bordi mentre si scorre, cambi di
  scena notte → chiara → stanza (`sequenze/scorri-1440x900-foglio.jpg`). Niente sezioni impilate sullo stesso fondo.
- **Funziona**: nessun errore nella pagina, nessuno scorrimento di lato da 320 a 1920 px, nessun testo tagliato o
  sovrapposto alle soglie; tastiera in ordine con il contorno visibile su scuro e su chiaro (`percorso/tab-10.png`,
  `tab-11.png`); Invio sulle ancore porta il fuoco al punto giusto; menu del telefono che si apre e si chiude con Esc
  (`percorso/tel-menu.png`); senza JavaScript tutto visibile, con il lettore del browser al posto del pulsante
  (`robustezza/sj1440-03.png`); movimento ridotto: tutto al suo posto, l'ascolto funziona.
- **La home scelta non è peggiorata**: `confronta-scelta.mjs` (HEAD contro adesso, primo schermo e a 1800 e 3600 px)
  trova solo la voce «Italiano» e il piede delle lingue, dell'incarico 1 (`scelta/`).

---

## La scheda

### A. L'idea
- **A1** «Su Windows e macOS la riunione c'è, ma tu sei senza voce: manca soltanto il microfono». Prova:
  `sequenze/arrivo-1440x900-f09.jpg`.
- **A2** La voce che si ferma al microfono tratteggiato, circa 1,5 s dopo che il tratto «Si ferma al microfono» entra
  (`strada/foglio-1440b.jpg`); prima, a 3 s dall'arrivo, «Kalliope · non c'è» che si accende
  (`sequenze/arrivo-1440x900-foglio.jpg`).
- **A3** Che cos'è: sì, nella frase sotto il titolo. Per chi: in parte, solo implicito («Tu · senza voce», «la frase
  che scrivi»); «chi non può parlare o fa fatica» non è detto. Che cosa fare: sì, due comandi chiari.
- **A4** Sì: la riunione con la bolla e i riquadri e la tinta vinaccia sono quelle della home.
- **A5** In apertura no, apposta (è l'assenza). In chiusura sì: la registrazione vera con la bolla che si accende e le
  onde (`sequenze/ascolta-1440x900-foglio.jpg`).

### B. Estetica
- **B1** Sì: titolo a sinistra, scena a destra, una sola pillola rosa (`sequenze/arrivo-1440x900-f09.jpg`).
- **B2** Sì: nessuna parte viene da un altro sito; stona solo il lettore grigio del browser quando compare (M1).
- **B3** In parte: la colonna di sinistra finisce con due note piccole («Oggi», didascalia) che si fanno concorrenza.
- **B4** Sì: apertura, perché, quando, ascolta, piede, ciascuno su una scena sua.
- **B5** In parte: la svolta (la riunione ferma) è inventiva; strada e chiusura sono quelle della home riprese quasi
  identiche (`coppie/sotto-home-strada-1440-ab.jpg`, `sotto-home-chiusura-1440-ba.jpg`).
- **B6** Sì: notte → chiara → stanza, fogli tondi che si allargano.
- **B7** In parte: piatto il tratto «Non promettiamo date» (I6).
- **B8** In parte: l'arrivo si compone e poi si ferma, apposta; la pagina è la più quieta del sito, coerente con ciò
  che dice.
- **B9–B10** Sì: vinaccia, rosa pieno, rosa pallido; il foglio chiaro dà respiro.
- **B11** Sì: rosa pieno = ciò che si preme; rosa pallido = bolla e scena chiara; tratteggio = ciò che manca.
- **B12** Sì, in gran parte. Le figure della riunione sono semplici e un po' generiche (vengono dalla home).
- **B13** Sì.
- **B14** In parte: M2, M3; per il resto allineamenti, spazi e righe sono curati alle soglie (`larghezze/f-*.png`).
- **B15** Sì.

### C. Esperienza d'uso
- **C1** Sì: a 0,5 s il titolo risponde («Su Windows e macOS: non ancora.»).
- **C2** Sì a 1440×900 e 390×844; no a 390×667, 360×640, 844×390 (I5).
- **C3** In parte: sopra, fuoco, premuto, carica, suona, pausa, riprendi, fine si vedono
  (`percorso/sopra-pillola.png`, `percorso/spazio-ascolta.png`, `spazio-pausa.png`); l'errore no (M1).
- **C4** In parte: la strada invita a continuare; la decisione finisce nel feed (I3).
- **C5** Sì: una pagina «non per te» che mostra il pezzo mancante dentro la scena del prodotto.
- **C6** Sì: barra, menu, salto al contenuto, pulsanti e collegamenti riconoscibili.
- **C7** Contenuto: in parte (I1, I2). Struttura e navigazione: sì. Aspetto: sì. Funzionamento: sì. Interattività: in
  parte (un gesto vero, l'ascolto; il resto ancore). Innovazione: in parte. Esperienza complessiva: buona.

### D. Movimento
- **D1** 0,25 s il titolo entra a righe; 0,5–1 s testo e comandi; 1–1,5 s i riquadri; 2 s la bolla nasce dalla coda;
  2,8 s la voce «Kalliope» del menu si illumina come se la si scegliesse, 3,2 s compare «non c'è» col tratteggio; poi
  fermo, salvo gli occhi di Paola, Luca e Anna che ogni tanto battono (`sequenze/arrivo-*-foglio.jpg`,
  `sequenze/arrivo-fitto-scena-1440.jpg`).
- **D2** Scorrere: i fogli si allargano, i titoli si accendono, la strada anima la voce. Puntare: pillola e
  collegamento rispondono. Premere: l'ascolto (bolla parola per parola, barre, onde, Pausa/Riprendi).
- **D3** Arrivo: orientare e raccontare. «Non c'è»: indicare la causa. Strada: spiegare. Fogli: collegare le scene.
  Ascolto: mostrare il prodotto.
- **D4** «Non c'è», strada e ascolto: si perde significato. Fogli: soltanto bellezza, danno carattere e sono quelli
  della home: restano. Entrata del pannello delle versioni: niente (I6).
- **D5** Entrate brevi e in ordine, arresti morbidi; la strada accelera e urta, naturale; nessun ciclo continuo.
- **D6** Sì: la voce che si ferma al microfono.
- **D7** Sì: il tratteggio nelle forme, l'arresto nel movimento, lo stesso Lexend e le stesse curve della home.

### E. Stile di default
- **E1** Pulsanti a pillola: sì. Ogni blocco con la stessa dissolvenza: in parte (titoli e pannello delle versioni; la
  strada e la chiusura hanno un movimento loro). Sezioni impilate sullo stesso fondo, spunte, etichette numerate o in
  monospazio, viola, crema con grazie: no. Lexend è una scelta della home, non il carattere di sistema.
- **E2** Le pillole: R01 («Let's begin»), R03 («Talk to sales»), in
  `/workspace/prova-design-abc/prova-2/riferimenti/primi-schermi/R01-1440x900.jpg` e `R03-1440x900.jpg`, e la home
  scelta. Giustificate.

---

## Il giudizio a coppie

Fogli in `coppie/`, ognuno nei due versi (`-ab` e `-ba`).

| Contro | Estetica | Esperienza | Movimento | Cambia scambiando i lati? |
|---|---|---|---|---|
| **R01 Signs** (`na-R01-1440-*`, `na-R01-390-*`) | Non regge in impatto: R01 è un'immagine sola, una parola gigante, più memorabile. Regge in mestiere e ruoli del colore | Meglio: risposta e passi successivi in un colpo d'occhio; R01 ha 12–15 s d'attesa e nessuno scorrimento | Non regge in spettacolo (l'avatar che firma è il prodotto in moto); regge in significato | No |
| **R03 ElevenAgents** (`na-R03-*`, `sotto-R03-1440-*`) | Regge: R03 ha un asse più rigoroso e foto vere, ma è la vetrina generica dell'IA; questa è riconoscibile | Regge: R03 mostra il prodotto al lavoro, questa mostra la sua assenza e poi la voce vera | Meglio: R03 sotto è statico, qui ogni tratto ha un perché | Sul mestiere la differenza è piccola: la lascio al proprietario |
| **R05 LALAL.AI** (`na-R05-*`, `sotto-R05-1440-*`) | Meglio: R05 è piatto; sotto, griglie di schede uguali e FAQ | Regge: R05 ha lo strumento nel primo schermo, che qui non esiste | Meglio | No |
| **La home scelta** (`na-home-*`, `sotto-home-*`) | Lo stesso mondo; più quieta e più leggera nel primo schermo; strada e chiusura quasi identiche | Più semplice (una domanda, una risposta); la decisione è più debole (I3) | Arrivo più breve e poi fermo, apposta; la strada ferma è la variante più forte | No |

**In assoluto.** Fra i vincitori della sua categoria starebbe al suo posto come pagina interna di un prodotto curato:
non stona. Goffo: la decisione che finisce in un XML, la parola «Ricostruzione» isolata al telefono, il pulsante che
cambia larghezza. Generico: il pannello delle versioni, le figure della riunione. Datato o rumoroso: niente.
Sbilanciato: appena, la coda di note piccole nella colonna di sinistra. Che cosa ha che gli altri non hanno: dice «non
ancora» con onestà dentro la scena del prodotto, e lo fa vedere invece di scriverlo. Non è la versione ricolorata di
un riferimento: impianto, colori e forme sono quelli della home scelta.

**Dal più forte al più debole, i tratti della pagina.** 1. «Si ferma al microfono» (la strada ferma: idea, movimento e
testo coincidono). 2. L'apertura (la riunione ferma, chiara in un secondo). 3. «Intanto, senti come suona» (forte, ma
quasi uguale alla chiusura della home). 4. «Non promettiamo date» (fermo, generico, e finisce nel feed).

---

## La pagina intera

- **L'idea tiene fino al piede?** Sì: riunione ferma → la voce che si ferma → il posto vuoto della prossima versione →
  la stessa frase, detta. Nessuna vetrina di sezioni impilate.
- **Ogni tratto è vivo per un motivo?** Sì, tranne l'entrata del pannello delle versioni (I6). Niente si muove senza
  motivo; niente stanca.
- **Il primo schermo scelto è rimasto uguale?** Sì (vedi sopra, `scelta/`).
- **Schermo basso?** No (I5).
- **Il percorso di una persona (P6)?** Arrivo: risposta in 0,5 s. Gesto principale: «Come saperlo quando arriva» porta
  al tratto giusto, e Tab porta poi a «Segui le versioni» (`percorso/invio-quando.png`, `invio-quando-tab.png`).
  Decisione: il feed (I3). Tastiera: sì. Telefono: sì (a 390×844). Senza JavaScript: sì. Quando qualcosa non si
  carica: script → come senza JavaScript; audio → lettore del browser, senza una parola (M1); `tempi.json` → l'ascolto
  va lo stesso; caratteri → ripiego leggibile (`robustezza/senzacaratteri-1440-primo.png`); fogli di stile → figure
  enormi (M6).
- **Ciò che un simbolo promette accade?** Frecce e play/pausa sì; «Segui» no, finché porta a un XML (I3).
- **Il sistema c'è?** Token e componenti sì (`controlla-sorgenti.mjs` verde, quattro componenti nuovi in
  `design-system/componenti/`); catalogo no (I4).
- **La pagina dice ciò che il progetto vuole?** Letto `progetto.md` P6, §1.4, §7, §9. C'è: oggi no, perché (driver
  firmato per Windows, componente approvato da Apple per macOS), che cosa c'è (si costruisce e supera i test), che
  cosa manca (microfono, pacchetti, firma), nessuna data, nessun elenco d'attesa, telefono e tablet, solo italiano,
  nessuna clonazione («forse in futuro, solo con il tuo consenso»). Manca: lo stato della prova in riunione (I1).
  In più: una promessa implicita (I2). Da chiedere: il dubbio E (M8). Nessuna funzione inventata, nessuna data.
- **Stile di default sotto il primo schermo?** Solo le dissolvenze d'entrata di titoli e pannello; nessun altro tratto.

---

## Che cosa non ho verificato

- Il feed `releases.atom`: non l'ho riaperto (nessuna richiesta esterna da questa macchina); chi ha reso scrive di
  averlo verificato il 16/11.
- Il suono vero: su questa macchina non c'è uscita audio; in Chromium l'ascolto parte e la scena segue l'audio, in
  Firefox cade nel ripiego per questo motivo. WebKit non parte qui.
- Il testo più lungo del 40% (lo dichiara chi ha reso, non l'ho rifatto).
- Lettori di schermo, testo ingrandito e zoom, colori forzati, la matrice dei 15 dispositivi: sono del ruolo di
  costruzione.
- Dopo la mia costruzione (23:04) l'incarico 1 ha cambiato `tools/site.py`, `scena.js` e `SISTEMA.md`; la pagina non
  carica `scena.js`, i suoi file non sono cambiati dopo.

---

## Le note di chi l'ha resa

Lette dopo aver scritto tutto quanto sopra: `PIANO.md`, `CONTENUTI.md`, `progresso.md`, `sequenze/`, `confronti/`,
`foto/`.

**Dove corrispondono.** L'idea in una frase, il tratteggio come segno di «non ancora», l'ordine dei tratti, la strada
che si ferma, l'arco della frase muta e poi detta, la cornice delle pagine interne: è ciò che ho visto. Le sue
sequenze d'arrivo coincidono con le mie fotogramma per fotogramma. Riconosce da sé tre dei miei problemi e li passa
alla costruzione: il catalogo (I4), il messaggio quando il suono non parte (M1), la freccia da destra a sinistra
(M7). Le sue quattro domande al proprietario sono giuste e le riprendo.

**Dove dicono più di quanto ho visto.**
- «A 2,5 s il puntatore va sul posto di «Kalliope» … un'onda tratteggiata che non arriva a nessuno, il tuo bordo si
  accende e si spegne»: nei miei fotogrammi fitti (da 1,8 a 4 s, ogni 0,2–0,3 s) si vede la voce «Kalliope» che si
  illumina e poi «non c'è»; nessun puntatore e nessuna onda si leggono a grandezza vera. Il tentativo arriva come un
  lampo del menu, non come un gesto.
- «Il posto tratteggiato della prossima respira una volta»: a scala 1,015 non si vede (fotogrammi ogni 170 ms,
  `strada/versioni-1440.jpg`). Dire che in quel tratto «si decide vedendo dove arriverà la notizia» è vero da fermo,
  non per il movimento (I6).
- `CONTENUTI.md` scrive «Non è un servizio online né un'estensione del browser: c'è». Sulla pagina c'è come «non esiste
  ancora», che è un'altra cosa (I2).
- `CONTENUTI.md` non ha una riga per «non provata in una riunione vera» (`progetto.md` §7, §9): la voce è sfuggita già
  nell'elenco, non solo nella pagina (I1).
- Le larghezze guardate sono 1440×900, 1366×640, 1180×820, 820×1180, 390×844, come dichiarato: i telefoni bassi e il
  telefono girato, dove manca il comando (I5), non erano fra queste.

**Sulle scelte lasciate al proprietario.** «Account Apple» o «componente approvato da Apple»: è un fatto, va chiesto.
La propria voce qui, con le parole del documento: ha senso, è un «non ancora» vero, ma la decisione è sua. Dubbio E
(M8): va chiesto. Il feed in inglese: va detto, se il feed resta (I3).

---

## L'ordine e che cosa va corretto prima di mostrarla

**Dal più forte al più debole** (fra ciò che ho confrontato, per questo tipo di pagina): R01 per impatto e momento,
poi questa pagina e R03 alla pari (lei più riconoscibile e con un perché in ogni tratto, R03 più rifinito: la
differenza è piccola e la decide il proprietario), poi R05. Rispetto alla home scelta: stesso mondo, primo schermo
all'altezza, tratto della decisione più debole.

**Bloccanti:** nessuno.

**Da correggere prima di mostrarla (importanti), a chi tocca:**
- Ruolo di direzione: I3 (la decisione che finisce nel feed, nella composizione del tratto e del comando), I5 (che
  cosa vince sugli schermi bassi, deciso per la cornice), I6 (il posto vuoto che vive).
- Contenuti, con chi coordina e il proprietario: I1 (lo stato della prova in riunione), I2 (niente «ancora» per ciò che
  il prodotto non è); le quattro domande dell'autore e il dubbio E.
- Ruolo di costruzione: I4 (il catalogo), poi M1, M2, M5, M6, M7 e il resto del suo elenco.

---

## Riassunto per il proprietario

### Problemi
- **Nessun problema bloccante.**
- **Importante: manca «non ancora provata in una riunione vera».** La home lo dice; qui no, mentre la pagina mostra la
  strada fino a «Gli altri ti sentono» e invita a installarlo sul Linux di qualcun altro.
- **Importante: una promessa sbagliata.** «Non esiste ancora come servizio online o estensione del browser» fa
  pensare che arriveranno; il progetto li esclude.
- **Importante: la decisione finisce in un file.** «Come saperlo quando arriva» porta al feed: chi non ha un lettore di
  feed apre un file grezzo, in inglese, che segnala anche le versioni per Linux.
- **Importante: nel catalogo non c'è niente di nuovo.** I quattro componenti della pagina non sono ancora mostrati.
- **Importante: sui telefoni piccoli e girati il primo schermo non ha comandi.** Succede anche nella home; qui non
  resta niente da premere.
- **Importante: il tratto «Non promettiamo date» è fermo e generico**, l'unico senza un momento suo.
- **Minori:** nessun messaggio quando il suono non parte; il pulsante dell'ascolto cambia larghezza; al telefono la
  didascalia della scena si riduce a «Ricostruzione»; la frase della bolla in alto è poco leggibile (voluto).

### Che cosa funziona
- **L'idea si capisce senza leggere:** la riunione della home, ferma, con il tuo posto tratteggiato e «Kalliope · non
  c'è» nel menu del microfono.
- **Un momento che resta:** la voce che corre lungo la strada e si ferma contro il microfono che manca.
- **La pagina comincia con la frase muta e finisce facendola sentire**, con la registrazione vera.
- **Funziona:** nessun errore, nessuno scorrimento di lato da 320 a 1920 px, tastiera, menu del telefono, senza
  JavaScript, movimento ridotto. La home che hai scelto non è cambiata.

### Accanto ai riferimenti
- **Meno spettacolare di Signs (R01)**, più chiara e utile; **alla pari con ElevenAgents (R03)**, differenza piccola,
  la decidi tu; **meglio di LALAL.AI (R05)**.

### Da chiederti
- macOS: «account Apple» o «componente approvato da Apple»? La propria voce qui? Si può dire «installalo sul Linux di
  una persona vicina»? Il feed in inglese va detto?

### Non verificato
- **Il suono ascoltato davvero** (qui non c'è uscita audio), **Safari/WebKit**, **lettori di schermo**, i 15
  dispositivi.
