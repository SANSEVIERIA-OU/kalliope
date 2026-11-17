# Secondo sguardo sulla pagina «stato» (incarico 3b-s)

Giudice: design-judge (opus); non ho reso né costruito la pagina. Pagina al commit `61b6cec`, costruita da una copia del commit
(`/tmp/lavoro-3bs-radice`): sito vero in `/tmp/lavoro-3bs-sito`, a dieci lingue in `/tmp/lavoro-3bs-sito-lingue`, con le
pseudo-lingue in `/tmp/lavoro-3bs-sito-pseudo`, serviti sulle porte 8920–8925 solo durante le prove. Tutte le prove sono mie,
rifatte da capo; nessuna foto di chi ha corretto o costruito. Foto e misure in `/tmp/lavoro-3bs-*` (fuori dal repository, come
le altre foto di `design/lavoro/`), con il percorso accanto a ogni prova.

*Scritto mentre guardavo. Ordine seguito: prima ho guardato la pagina (arrivo, scorrimento, gesti, misure, lingue, catalogo),
poi ho riletto il giudizio di prima e ho rifatto le sue prove, e solo alla fine ho letto le note di chi ha corretto e costruito
(ultima parte).*

La macchina era molto carica (carico medio 38 su 12 CPU, 2 GB liberi, la misura della voce in parallelo): una foto costa
300–400 ms, quindi le sequenze riportano l'istante chiesto e quello scattato davvero. Per i movimenti brevi (risposte,
impronte) ho misurato dentro la pagina, fotogramma per fotogramma, o ho fermato le animazioni a istanti dati.

## Problemi nuovi, per gravità

Nessun **bloccante**. La pagina non inventa funzioni, date o promesse: alla domanda sulla propria voce risponde «Oggi no: con la
voce di Giulia o di Marco» (nessuna promessa); per il telefono dice «Per ora Kalliope è solo per il computer, non per il
telefono» (non «non ancora»); cercati nel testo «presto», «prossim», «futur», «arriver», anni: zero. Il primo schermo della
home è identico allo stato che il proprietario ha visto (`e429a28`): `confronta-scelta.mjs` 0% di pixel diversi con movimento
ridotto, in cima e a 1600 px, a 1440 e 390 (`/tmp/lavoro-3bs-scelta/it-ridotto/`, `it-sotto/`); senza movimento ridotto le
sole differenze sono la scena della home che va avanti da sé (la bolla a un altro punto della frase); «non ancora» 0%
(`/tmp/lavoro-3bs-scelta/it-non-ancora-/`). Nessuno scorrimento di lato e nessun errore nella console a nessuna misura
provata, in Chromium, Firefox e WebKit.

### Importante

**N1. Nel catalogo tre esemplari della tappa sono illeggibili.** Nella sezione «Pagina «stato»» del catalogo, a 1440×900, gli
esemplari messi due a due in una riga («una tappa provata, spenta e accesa», «la riga delle parole e la riscrittura nel campo,
accese», «i pacchetti provati accesi e le app non provate») mostrano la tappa con la sua impaginazione da computer dentro mezza
colonna: la colonna dei fatti resta larga 67 px e il testo va a una parola per riga per circa 1 000 px ciascuno («La voce /
parte / dopo la / prima / frase;…»), e la fonte «docs/releasing.md» si spezza dentro la sua pillola su tre righe. Foto:
`/tmp/lavoro-3bs-catalogo/1440x900-chromium/stato-16.png`, `stato-21.png` (fogli `foglio-2.png`, `foglio-3.png`);
esame-impaginazione sul catalogo: «UNA PAROLA PER RIGA» ×5 e «STRETTO» ×5, tutti in questi esemplari
(`/tmp/lavoro-3bs-esame/catalogo.txt`). La pagina vera non ha il difetto (la tappa passa a una colonna con la larghezza dello
schermo, a 760 px), ma il catalogo è ciò che arriva al proprietario con la pagina come «il sistema», e qui mostra il pezzo
rotto: un esemplare deve far vedere il componente com'è. Il motivo è che la tappa decide la sua impaginazione dalla larghezza
dello schermo, non da quella del posto in cui sta. **Correzione (che cosa):** gli esemplari della tappa nel catalogo si vedono
come nella pagina, interi e leggibili (uno per riga, oppure la tappa che si adatta al posto che ha). Lavoro della costruzione,
breve; non serve un altro giro di direzione né un altro sguardo del giudice: basta la foto di chi coordina.

### Minori

**N2. Al telefono girato (844×390) tre risposte, non due, non stanno sotto la barra, e la loro fine non si vede finché non si
scorre tutto l'elenco.** La risposta grande (la scritta della bolla è quella della frase della riunione) in una colonna di
354 px: «E se scrivere è difficile?» 328 px, «Ha frasi pronte o simboli?» e «Chi c'è dietro?» 362 px, contro 306 px sotto la
barra. Il limite dichiarato nomina solo le ultime due; la prima è tagliata di 22 px a metà dell'ultima riga («è un dispositivo
medico.»). La bolla al computer è appiccicosa: scorrendo resta ferma con la stessa parte tagliata per circa 300 px, e la fine
compare solo quando l'elenco delle domande finisce (misurato: bolla 84–412 fino a 240 px di scorrimento, poi sale;
`/tmp/lavoro-3bs-gesti/bolla-scorri-it-844x390-q2/`, `basso-it-844x390/fila.png`). Chi scorre un poco per leggere la fine vede
la bolla che non si muove. Vedi la risposta alla questione 1, sotto.

**N3. Nel computer del tratto chiaro le etichette del disco escono dal loro riquadro nelle lingue lunghe.** «la voce · 53 MB» e
«il programma» sono più larghe del riquadro «Sul disco»: in en-XA escono di 17 px a 390, 12 px a 800 e a 1000, 32 px a 326; in
tutte le altre lingue e in italiano di 3 px a 326×326. Misura su 12 lingue × 5 misure (`/tmp/lavoro-3bs-strumenti/disco.mjs`,
uscita nel testo dell'unità); foto `/tmp/lavoro-3bs-schermi/xa-390/zoom-disco.png`. **Correzione:** le etichette vanno a capo o
il riquadro le contiene.

**N4. La linea tratteggiata passa sopra le impronte che scendono.** Le tre impronte («0d4b…», «3c9f…», «a7e…») escono dal filo
che viene da huggingface.co, ma il filo è disegnato sopra di loro e le taglia a metà, in Chromium e in Firefox
(`/tmp/lavoro-3bs-schermi/it-1440/zoom-0d4b.png`, `/tmp/lavoro-3bs-schermi/ff-1440/zoom-chip.png`; animazione fermata a
300–1700 ms: `/tmp/lavoro-3bs-gesti/pacchi-1440x900/foglio.png`). E la corsa è corta: circa 25 px, dal bordo del computer al
bordo del riquadro del disco. Vedi M8.

**N5. Al telefono la conferma della copia spinge giù «Come si installa» di 44 px.** «Copiato: incollalo in un messaggio o in
una e‑mail.» compare sotto il pulsante (vicino, come chiedeva M6) e sposta tutto ciò che segue
(`/tmp/lavoro-3bs-gesti/copia-it-390x844/fila.png`: «Come si installa» da 546 a 590 px). Al computer sposta il piede di circa
20 px. Piccolo, ma è un salto dopo un tocco. **Correzione:** il posto della conferma c'è già prima del tocco.

**N6. Il fuoco sulle fonti è un rettangolo che taglia la pillola.** Sulle fonti collegate l'anello del fuoco è un riquadro
squadrato attorno al solo nome, che attraversa il bordo arrotondato della pillola e, quando nella pillola ci sono due file
(«LICENSE, NOTICE»), copre la virgola e tocca il nome accanto (`/tmp/lavoro-3bs-gesti/fonti-1440x900-chromium/fonti-stati.png`,
terza colonna). Si vede, quindi funziona; è goffo accanto agli anelli arrotondati del resto della pagina (domande, comandi).

**N7. In arabo e in urdu una cifra con la virgola decimale si legge rovesciata.** Nella costruzione da destra a sinistra le parti
latine vengono isolate, ma la virgola decimale non fa parte della parte isolata: «0,07 s» si vede «07 s,0» e «lo 0,26%» si
spezza (`/tmp/lavoro-3bs-schermi/ar-1440/intera-colonne.jpg`, tappa «La voce nasce qui»; `ar-390`). Oggi succede con il testo
italiano di prova, che in queste pagine è voluto; ma la stessa regola si applicherà a una traduzione che scriva una cifra
decimale con un'unità latina («0,07 s»). È della costruzione del sito, non della pagina. **Correzione:** la virgola fra due cifre
resta dentro la parte isolata.

**N8. A zoom 150–200% al telefono (260 e 195 px di larghezza utile) le etichette dei pacchetti escono dalla tappa** e i titoli
delle tappe vanno a capo stretti (esame-impaginazione, `/tmp/lavoro-3bs-esame/testo-zoom.txt`: tutto il resto pulito, compresi
il testo al 125, 150 e 200% a 390 e 1440 e lo zoom a 1440). Misure estreme; da sapere, non da inseguire ora.

**Fuori da «stato», da sapere.** Il catalogo al telefono (390) scorre di lato (1 030 px) per la tabella dei caratteri e ha i
pulsanti delle misure fuori dalla scheda «Pagine interne», e «Riproduci» sopra gli esemplari della home: non sono della
sezione «stato» (`/tmp/lavoro-3bs-esame/catalogo.txt`, seconda parte).

## I problemi del giudizio di prima

Ogni stato è detto con la stessa prova con cui il problema era stato trovato, rifatta da me.

| Problema | Stato | Come lo vedo |
|---|---|---|
| **I1** la strada si accende in fila e fa aspettare | **chiuso** | Saltando di colpo al «Microfono «Kalliope»» a 1440, titolo, cifra e testo sono a opacità 1 dal primo fotogramma (12 ms) e la tappa è accesa a 203 ms (`/tmp/lavoro-3bs-strumenti/sonde.mjs`, `/tmp/lavoro-3bs-gesti/sonde/esito.json`). Ricaricando a metà pagina e scorrendo in fretta: le tappe si leggono subito, si accendono solo nodo e linea (`/tmp/lavoro-3bs-gesti/meta-1440x900/foglio.png`, `meta-390x844/foglio.png`). |
| **I2** la risposta lampeggia | **chiuso** | Opacità del contenuto della bolla a ogni fotogramma dopo il clic su «Quanto costa?»: il testo vecchio va da 1 a 0 (fino a ~356 ms), il nuovo entra da 0 a 1 (fino a ~680 ms) e non torna mai giù; il testo nuovo non compare mai pieno prima della sua entrata (`sonde/esito.json`, «ricaduta: null»). Nel cambio la bolla cresce e taglia per un istante l'ultima riga nuova (`/tmp/lavoro-3bs-gesti/domande-1440x900-chromium/04-q8-0060-zoom.png`): normale, non un lampeggio. |
| **I3** senza `cornice.js` spariscono pezzi | **chiuso** | Con `cornice.js` bloccato, dopo 5,5 s, nessun titolo, bolla o comando sotto il 50% di opacità in «stato» a 390 e 1440; in «non ancora» solo la frase grigia della bolla, che è grigia per scelta (decisione del 17/11, «tema di copy») (`sonde/esito.json`, foto `sonde/I3-*.png`). |
| **I4** al telefono lunga e fitta | **chiuso** | A 390 la pagina è 8 071 px (era 9 674): catena 3 071 (era 3 543), tratto per chi controlla 2 332 (era 3 527); i dettagli di ogni tappa, le licenze e le impronte si aprono a richiesta («I dettagli e le fonti ↓»), e la scelta resta passando a 1280 e tornando (`telefono-it-390x844-chromium/esito.json`: 10000 → 11111 → 10000; uguale in WebKit). Dopo le domande, «Da mandare a chi ti aiuta: lo stato di oggi in poche righe →» porta al messaggio. Resta lunga (12 schermi), ma il lungo è a richiesta. |
| **I5** catalogo | **chiuso in parte** | La sezione «Pagina «stato»» c'è: cinque schede, 11 pagine vive, stati, regole, provenienza, aperta senza errori. Ma tre esemplari della tappa sono illeggibili (**N1**). |
| **I6** tre fatti mancanti | **chiuso** | Sulla pagina: i permessi di amministratore per `.deb`/`.rpm` in `/usr` e l'archivio in `~/.local` senza (passo «Che cosa scrive sul disco»); «Questo sito lo servono le pagine di GitHub (GitHub Pages), che registrano le richieste come ogni server» (Impronte e provenienza); «le differenze che restano sono soprattutto di scrittura: «10 e 30» per «10:30», «ancora» per «àncora»» (tappa del microfono). `CONTENUTI.md` allineato. |
| **M1** la barra non segna la pagina | **chiuso** | «Stato e limiti» con il fondo chiaro e peso 600 nella barra e nel menu del telefono (`sonde/M1-menu-390.png`, `/tmp/lavoro-3bs-schermi/it-1440/schermo-02.png`). |
| **M2** coda della bolla | **chiuso** | Al telefono la coda sta in alto e indica la domanda premuta; al computer non c'è (`telefono-it-390x844-chromium/fila-1.png`, `domande-1440x900-chromium/08-invio-q2.png`). |
| **M3** parentesi «non misurato» | **chiuso** | La scritta resta in vista mentre si scorre la catena (appiccicosa, a 106 px) e la parentesi va da «Scrivi la frase» a «Gli altri ti sentono» (`it-1440/schermo-03.png`, `schermo-04.png`). |
| **M4** a capo male a misure di mezzo | **chiuso** | Esame-impaginazione a 320, 334, 361, 397 px: pulito (`/tmp/lavoro-3bs-esame/m4.txt`); anche alle 18 misure di mezzo e basse provate. |
| **M5** indirizzo mostrato ≠ copiato | **chiuso** | Mostrato, copiato e `canonical` sono la stessa stringa, `https://sansevieria-ou.github.io/kalliope/it/stato/`, a 1440 e a 390 (`copia-it-*/esito.json`, «uguale: true»). |
| **M6** «Copiato…» lontano | **chiuso** | La conferma sta subito sotto il pulsante; nasce però un piccolo salto (**N5**). |
| **M7** le fonti non si aprono | **chiuso** | 24 fonti collegate al file alla versione mostrata; percorsi verificati sul tag locale `v0.1-rc.1` (tutti presenti, salvo `.github/workflows/pages.yml`, che resta nome senza collegamento per decisione di chi coordina). Riposo, sopra e fuoco si distinguono (**N6** per la forma del fuoco). |
| **M8** le impronte minuscole | **chiuso in parte** | Ora sono pillole leggibili e non passano più sopra «Sul disco»; ma la corsa è di 25 px e il filo le taglia (**N4**). |
| **M9** vuoti lunghi nel tratto chiaro | **chiuso** | A 1440 fra un passo e l'altro circa 130 px (erano 250–300); il computer cambia accanto (`it-1440/schermo-07.png`). |
| **M10** righe lunghe in «Hai provato…» | **chiuso** | La colonna è di circa 520 px, circa 65 caratteri (`it-1440/schermo-04.png`). |
| **M11** etichetta di «Tu» senza caratteri | **chiuso** | Con i caratteri bloccati, a 390 l'etichetta resta su una riga e si riduce a «Tu» (19 px di altezza; `sonde/M11-senza-caratteri-390.png`). In en-XA si vede «[Ţû·», effetto della pseudo-lingua. |
| **M12** elenco dei contenuti | **chiuso** | `CONTENUTI.md` dice ora dove sta ogni voce; i requisiti minimi «rimandati a» Installa. |

## Ciò che è stato rifatto, guardato come la prima volta

- **Il primo schermo** (`/tmp/lavoro-3bs-seq/arrivo/`, `arrivo-lungo/`): titolo che sale riga per riga (0,25–1 s), testo e
  comandi, la riunione (1,5–2 s), la bolla e «Tu» acceso (3 s), l'anello che si allarga da «Tu» (4 s), poi Paola, Luca e Anna
  tratteggiati e velati e «Kalliope · provato fin qui» nell'app (5 s), fermo da lì in poi. Il racconto è chiaro e resta il
  momento della pagina. Uguale a 1000×800 e a 390.
- **Le domande**: pillole con un punto, la scelta chiara, la bolla accanto al computer (appiccicosa) e sotto la domanda al
  telefono; il cambio è una dissolvenza pulita; tastiera: Tab da domanda a domanda con l'anello doppio, Invio e Spazio aprono,
  dopo l'ultima domanda il fuoco va al collegamento dentro la risposta («ecco perché») e poi oltre
  (`domande-1440x900-chromium/esito.json`, foto 06–10). Tocco (Chromium e WebKit): domanda e risposta restano in vista insieme
  a 390 (`telefono-it-390x844-*/esito.json`).
- **I dettagli a richiesta al telefono**: «I dettagli e le fonti ↓» apre il lungo della tappa sotto il suo titolo, la pagina lo
  porta in vista; la freccia si gira. Licenze e impronte allo stesso modo.
- **Il computer del tratto chiaro**: il passo a metà schermo dice che cosa mostrare (il testo nella finestra, i file sul disco,
  la finestra che sparisce quando la si chiude): è il racconto migliore della pagina sotto il primo schermo. Al telefono il
  computer resta in alto e il testo gli scorre sotto; i passi si leggono interi fra il computer e il fondo.
- **Il messaggio da inoltrare**: la bolla si illumina, «Copiato…» sotto il pulsante; senza appunti c'è il ripiego «Seleziona il
  testo della bolla e copialo» (senza JavaScript, `/tmp/lavoro-3bs-schermi/nojs-390/intera-colonne.jpg`).
- **Le fonti collegate**: a riposo pillola sottile con il nome sottolineato, sopra più chiara, fuoco con anello (N6).
- **Senza JavaScript** (390): tutto visibile, le dieci risposte una sotto l'altra, i dettagli aperti, il computer intero.
- **Arabo** (1440, 390): pagina specchiata per intero, filo e nodi a destra, code delle bolle girate; il testo italiano dentro
  la pagina da destra a sinistra ha i punti agli estremi sbagliati, come previsto con il testo di prova (N7 a parte).
- **en-XA** (1440, 390): nessuno scorrimento di lato; il titolo va su sei righe con «Ĺöŕém» da solo (le interruzioni di riga
  sono quelle dell'italiano: lo sistemerà la traduzione); N3.

## La pagina intera, le domande della scheda

- **L'idea tiene fino al piede?** Sì: riunione provata fino al microfono → strada con le misure dove sono prese → domande dette
  nella bolla → computer che mostra che cosa entra e che cosa resta → messaggio nella bolla. Ogni tratto ha il suo oggetto e il
  suo gesto; i cambi di scena sono fogli che salgono, non fasce vuote (`/tmp/lavoro-3bs-schermi/it-1440/intera-colonne.jpg`).
- **Ogni tratto vivo per un motivo (D4)?** Sì. L'arrivo racconta il confine (senza, si perde il significato); le tappe che si
  accendono mostrano il percorso ma non fanno più aspettare; il computer che cambia mostra il fatto letto; la dissolvenza delle
  risposte collega due stati; la luce della bolla dopo la copia risponde. Le impronte (N4) sono l'unico movimento che dice poco.
- **Il primo schermo scelto è uguale?** Sì (sopra).
- **Schermi bassi.** 844×390: titolo, frase e comandi nel primo schermo, la scena dopo (regola della cornice); risposte lunghe:
  N2. 326×326: la bolla della risposta sta intera e ripete la domanda in testa; la domanda premuta resta sotto la barra.
- **Il percorso di una persona.** Chi valuta per un altro, al computer: arrivo → «Per chi è, e per chi no» → dieci domande →
  «Da mandare a chi ti aiuta» → «Copia il messaggio» (copiato = mostrato). Al telefono uguale, con le risposte sotto la domanda
  e il collegamento al messaggio dopo l'elenco. Chi controlla: «Se devi controllare» → il computer e i quattro passi con le
  fonti che si aprono → licenze, impronte, provenienza. Con la tastiera: fuoco visibile su ogni fermata provata. Ancore
  (`#per-chi`, `#controllare`, `#inoltra`): il titolo arriva a 88 px, sotto la barra, a 1440 e 390. Senza JavaScript e senza
  `cornice.js`: tutto si legge. Senza i caratteri: l'etichetta di «Tu» si accorcia, niente si sovrappone.
- **Ciò che un comando promette accade?** Sì: le frecce portano dove dicono; «Copia il messaggio» copia la bolla intera.
- **Il sistema c'è?** Token e componenti sì: `controlla-sorgenti.mjs` verde sulla copia del commit («29 fogli di stile, valori
  solo nei token»). Catalogo sì, con N1.
- **La pagina dice ciò che il progetto deve dire?** Sì: le tre voci mancanti ci sono; niente di inventato; telefono e voce come
  deciso il 17/11.
- **Stile di default sotto il primo schermo**: pillole (domande, fonti, pacchetti), cifre grandi, titoli che entrano tutti allo
  stesso modo. Giustificati come al primo giudizio: la home scelta dal proprietario e i riferimenti R01, R03, R50 per le pillole,
  R04 per le cifre. Nessun fondo crema, viola, griglia di schede uguali, numerazione 01 02 03, monospazio maiuscolo, spunte.

## Le coppie (fogli miei in `/tmp/lavoro-3bs-coppie/`, ognuno nei due versi)

| Coppia | Estetica | Esperienza | Movimento | Cambia scambiando? |
|---|---|---|---|---|
| Primo schermo con la home, 1440 (`primo-1440-stato-home-ab/ba`) | pari: stesso mondo; la home ha la finestra dell'app e «Ascolta Giulia», più viva; «stato» più calmo, con il segno del provato | pari: ognuna il suo comando | home più ricca (la scena che scrive), «stato» racconta il confine | No |
| Primo schermo con «non ancora», 1440 (`primo-1440-stato-nonancora-ab/ba`) | pari: la stessa scena con due stati opposti (voce che arriva / microfono che manca): stanno bene insieme | pari | pari | No |
| Catena con la strada della home (`catena-1440-stato-home-ab/ba`) | «stato» è la strada della home aperta e misurata: stessi nodi, stessa luce; più fitta | la home si coglie in un attimo, «stato» chiede lettura (è il suo compito) | pari | No |
| Domande con le FAQ di R05 (`domande-stato-R05-ab/ba`, R05 da `design/ricerca/prove/R05/012-clic.jpg`) | «stato» meglio: identità, la risposta detta nella bolla | pari: R05 ha la freccia della fisarmonica, che tutti conoscono; «stato» si capisce dal punto e dalla pillola scelta | «stato» meglio ora (dissolvenza pulita; prima era guasto, I2) | No |
| Primo schermo 390 con la home e sotto 390 con «non ancora» (`primo-390-…`, `sotto-390-…`) | pari, stesso mondo | pari | pari | No |

Le risposte non cambiano scambiando le posizioni. Le altre coppie del primo giudizio (R01, R03, R50) reggevano e i tratti
messi a confronto lì sono cambiati poco (la catena, la chiusura): non le ho rifatte. Limite: un modello che giudica da solo
sottostima il piacere estetico e sovrastima la facilità d'uso; sull'aspetto l'ultima parola è del proprietario.

**In assoluto.** Fra i vincitori del suo genere starebbe al suo posto, come al primo giudizio, e ora senza i due difetti di
movimento che la guastavano. Ciò che ha e gli altri no: le misure disegnate nel punto della strada in cui sono prese, il
tratteggio come segno coerente di «non ancora» dalla riunione al computer, il computer che cambia con il passo. Ciò che resta
debole: è fitta di testo piccolo nella catena (per chi controlla, ed è giusto, ma pesa) e lunga anche così; le impronte non
dicono quasi nulla (N4); il fuoco squadrato sulle fonti (N6). Nulla di datato o generico.

## Le questioni lasciate a chi giudica (punto 5)

1. **844×390, le risposte più lunghe della bolla.** Non confermo il limite così com'è scritto: le risposte che non stanno sono
   tre (anche «E se scrivere è difficile?», 328 px), e la bolla appiccicosa non lascia leggere la fine scorrendo un poco, ma solo
   alla fine dell'elenco (N2). È minore (telefono girato, sito di un programma per il computer), ma va corretta, ed è poco
   lavoro: sugli schermi bassi la scritta della bolla più piccola, oppure la bolla non appiccicosa quando è più alta dello
   spazio. **Quando:** con N1, nella stessa breve costruzione; non merita un giro a sé. Se il proprietario preferisce non
   toccarla, è un limite accettabile purché dichiarato con le tre risposte.
2. **326×326, la domanda premuta sotto la barra.** Confermo il limite: la bolla sta intera e ripete la domanda in testa, quindi
   chi ha toccato vede la sua domanda e la risposta. Niente da fare.
3. **326×326, i dettagli aperti non stanno interi nelle lingue lunghe.** Confermo, e aggiungo che non stanno interi neanche in
   italiano: «I dettagli e le fonti» della seconda e della terza tappa sono alti 337 e 525 px contro 270 px sotto la barra
   (`basso-it-326x326/esito.json`). Va bene così: sono testo da leggere, la pagina ne mostra l'inizio sotto la barra e il resto
   si legge scorrendo, come qualunque paragrafo lungo. Niente da fare.
4. **L'indirizzo intero su due righe al telefono.** Tenere l'indirizzo intero: mostrato e copiato devono essere la stessa
   stringa (era M5), e 22 px non pesano. Un dettaglio da sistemare quando si tocca la bolla: va a capo dopo «sansevieria-», che
   sembra una sillabazione e non lo è; meglio che vada a capo dopo una barra («…github.io/» + «kalliope/it/stato/»). Minore,
   dopo.
5. **La linea sotto il nome delle fonti.** Va tenuta: è ciò che distingue una fonte che si apre da quella che resta nome
   (`.github/workflows/pages.yml`, senza linea), e a riposo è sottile e attenuata, quindi non fa rumore. Da cambiare è
   l'anello del fuoco (N6), non la linea.
6. **«README» per sei fonti.** Sono sei collegamenti allo stesso file, `README.md` alla versione mostrata, per sei fatti diversi.
   Va bene: chi controlla apre il file giusto. Due cose minori, da fare con i testi nuovi: scrivere «README.md» come gli altri
   nomi che hanno l'estensione (CHANGELOG.md, docs/releasing.md), e, se si vuole, portare ognuna al punto del file che dice quel
   fatto.

## Pronta per il proprietario?

**La pagina sì; il catalogo dopo una correzione breve.** Nessun bloccante; i sei importanti e i dodici minori del primo
giudizio sono chiusi, salvo I5 e M8 chiusi in parte. Resta un importante, N1, che non è della pagina ma del catalogo che arriva
con lei: tre esemplari illeggibili. Prima di mostrarla va corretto N1 (costruzione, breve; la verifica è una foto di chi
coordina, non un altro sguardo del giudice). I minori N2–N8 arrivano al proprietario come scelte; consiglio di fare N2 insieme
a N1, perché costa poco.

**Ordine, dal più forte al più debole** (le tre pagine della direzione 2, guardate intere alle stesse misure): la **home**
resta la più forte (il gesto vero da ascoltare, la lunghezza giusta); **«stato»** subito dopo, ora senza i difetti di movimento,
ed è la più inventiva sotto il primo schermo, ma la più lunga e la più fitta; **«non ancora»** la più semplice e la più corta.
Contro i riferimenti: sopra R03, R05 e R50; R01 colpisce di più al primo sguardo, «stato» serve di più.

## Non verificato

Telefoni veri; lettori di schermo (la regione che annuncia la risposta c'è, non l'ho ascoltata); il video a velocità reale
(i tempi sono di questa macchina, molto carica); WebKit solo per i gesti al telefono, Firefox solo per lo scorrimento a 1440;
la rete vera (i collegamenti alle fonti verificati sul tag locale, senza aprire GitHub).

## Le note di chi ha corretto e di chi ha costruito, lette dopo

Lette solo ora: `3b-stato/progresso.md` («Correzione dopo il giudizio») e `3b-stato/costruzione/progresso.md`.

**Dove dicono più di quanto ho visto.**
- *Catalogo* (costruzione, punto 1 e «Catalogo»): «si apre senza errori in tre motori», 19/19 prove. Vero per gli errori e per i
  comandi; ma la prova non guarda se gli esemplari si leggono, e tre esemplari della tappa vanno a una parola per riga (N1).
- *Il limite a 844×390* (costruzione, «I 3 limiti» e «Difetti d'aspetto», 1): «le due risposte più lunghe». Sono tre: anche
  «E se scrivere è difficile?» (328 px) supera lo spazio (306 px). La prova della costruzione apre solo «Chi c'è dietro?».
- *326×326, i dettagli* (costruzione, «Difetti d'aspetto», 3): «in italiano sta». Non sta: a 326×326 i dettagli della seconda e
  della terza tappa sono alti 337 e 525 px contro 270 di spazio, e il paragrafo della seconda continua oltre il bordo
  (`/tmp/lavoro-3bs-gesti/basso-it-326x326/fila.png`). Non cambia la risposta (va bene così), ma il dato è sbagliato.
- *Le lingue* (costruzione, «Che cosa si rompe nelle lingue»): «dopo la correzione della colonna dei dettagli nulla esce dal
  bordo» in en-XA. Le etichette del disco escono dal loro riquadro di 12–32 px in en-XA a 326, 390, 800 e 1000 (N3); l'esame
  dell'impaginazione non lo segnala, la misura diretta sì.
- *ar e ur* (costruzione): «parole in ordine rovesciato: è il limite della prova, non della pagina». Per le parole sì; per le
  cifre decimali («0,07 s» → «07 s,0») c'entra anche la regola della costruzione che isola le parti latine (N7).
- *M8* (correzione: «Fatto»): le impronte ora si vedono e non coprono «Sul disco», ma il filo passa sopra di loro e la corsa è
  di 25 px (N4): chiuso in parte.

**Dove corrispondono.** I1 (tappe leggibili subito, accese entro un quinto di secondo), I2 (nessun lampeggio), I3 (niente sparisce
senza lo script della cornice), I4 (8 071 px, dettagli a richiesta che si ricordano fra telefono e computer, collegamento al
messaggio), I6, M1–M7, M9–M12 come descritti; indirizzo mostrato = copiato = `canonical`; l'etichetta di «Tu» senza caratteri
(30×19 px, i miei stessi numeri); home e «non ancora» identiche (0%); la ricarica a metà catena «111110»; `controlla-sorgenti.mjs`
verde (29 fogli); nessun errore nei tre motori alle misure che ho provato.

**Le scelte lasciate a chi giudica:** risposte sopra, al punto 5. Sulla fonte `.github/workflows/pages.yml` senza collegamento
(decisa da chi coordina): d'accordo, si collegherà da sola con la prossima versione e intanto non porta a una pagina vuota.

## Riassunto per il proprietario

### Problemi
- **Nessun problema grave.** La pagina non promette niente che il programma non faccia: sulla voce di chi usa Kalliope dice
  «oggi no», per il telefono dice «solo per il computer». La home e «non ancora» sono rimaste identiche.
- **Importante, ma non nella pagina: tre esempi del catalogo sono illeggibili.** Nella parte del catalogo dedicata a questa
  pagina, tre esempi della «strada» sono messi due per riga e il testo va a una parola per riga. Va sistemato prima che tu
  apra il catalogo; è un lavoro breve.
- Minore: con il telefono girato, tre risposte lunghe non stanno intere sullo schermo e la fine si vede solo dopo aver scorso
  tutte le domande. Costa poco correggerla insieme al catalogo.
- Minori, da decidere tu: nel disegno del computer le etichette del disco escono dal riquadro nelle lingue più lunghe; la linea
  tratteggiata passa sopra i codici dei file che scendono; dopo «Copia il messaggio», al telefono, il collegamento sotto salta
  giù di poco; il contorno che segna la fonte scelta con la tastiera è squadrato; in arabo e urdu un numero con la virgola si
  legge al contrario.

### Che cosa funziona
- Tutti i problemi importanti del primo giudizio sono risolti: la strada si legge subito, le risposte non lampeggiano più, al
  telefono il lungo si apre solo a richiesta, ci sono i tre fatti che mancavano, niente sparisce se uno script non arriva.
- Il primo schermo racconta bene dove arriva la prova: la voce arriva al microfono, il resto della riunione resta tratteggiato.
- Ogni fonte ora si apre sul file della versione, e il messaggio da mandare copia esattamente l'indirizzo che mostra.
- Funziona con la tastiera, senza script, in arabo specchiato e con il testo ingrandito; provata anche in Firefox e nel motore
  di Safari nei passaggi principali.

### Accanto agli altri siti
- Più personale e più inventiva dei siti premiati dello stesso genere; fra le tre pagine fatte resta seconda dopo la home: la
  più ricca sotto il primo schermo, ma anche la più lunga e la più fitta di testo.

### Non verificato
- Telefoni veri, lettori di schermo, la velocità vera dei movimenti (la macchina era molto carica).
