# Il giudizio delle tre direzioni del logo (incarico L-2)

Giudice: ruolo `design-judge` della skill `design-system-generator` 0.49.0. Non ho disegnato queste direzioni.
Data: 19/11/2026. Ho guardato prima di leggere: disegni resi da me, la pagina delle tre direzioni, le copie del sito,
le sequenze che ho registrato io; `idea.md` e `progresso.md` li ho letti solo alla fine (ultima sezione).

I percorsi sono relativi a `design/lavoro/L-logo/giudizio/`. Le copie del sito giudicate sono `/tmp/l1-sito-1-4`,
`/tmp/l1-sito-2-2`, `/tmp/l1-sito-3-2` (e `-pseudo`). I disegni sono cambiati alle 14:10, dopo le copie (13:38–13:50):
ho controllato che le icone delle copie siano uguali a `piccola.svg` di adesso (`foto/favicon-diff.png`: 0, 1 e 0 pixel
diversi su 128×128) e che `marchio.js` sia identico byte per byte. Le copie mostrano quindi i disegni di adesso.

## Che cosa ho fatto

- **I disegni, resi da me**: tutte le forme su chiaro, scuro e bordeaux (`foto/disegni-grandi.png`); 16–64 px a pixel
  veri (`foto/piccole-1x.png`, `foto/minime-16-24-32-x6.png`); le tre affiancate (`fogli/tre-direzioni-affiancate.png`).
- **Le sequenze, registrate da me** (le loro erano più vecchie dei disegni): l'arrivo della home a 1440 e 390
  (`sequenze/1-cursore/arrivo/`); la barra da vicino, a 3×, per 22 s dall'arrivo, ogni 250 ms, per le tre
  (`sequenze/*/barra-1440/`); 45 s con il puntatore a 30 s (`sequenze/1-cursore/barra-1440-lunga-punta/`); il puntatore
  sul marchio ogni 100 ms (`sequenze/*/punta-1440/`, `sequenze/punta-1440-tutte.png`); «riduci movimento»
  (`sequenze/ridotto-tutte.png`).
- **Fra le icone vere**: ogni logo fra dieci app di messaggi e otto programmi di voce presi da Flathub, a 48 e 32 px, su
  chiaro e scuro, e la sua simbolica fra i simboli di sistema di Adwaita e Material a 16, 24 e 48 px
  (`fogli/fra-le-icone-*.png`); le simboliche accanto ai segni che ricordano (`fogli/simboliche-e-segni-esistenti.png`).
  Le icone scaricate stanno in `scaricati/` (Flathub, App Store, GNOME GitLab, Google, Simple Icons).
- **Le coppie, nei due versi** (`affianca.mjs`), 36 fogli in `fogli/`:
  - il marchio nella barra contro R03 (ElevenLabs ed ElevenAgents) e R51 (AssistiveWare), ritagli alla stessa scala
    (`fogli/barra-*-vs-R03|R51-ab|ba.jpg`);
  - il primo schermo contro R01, che nella barra non ha un marchio (`fogli/primo-schermo-*-vs-R01-ab|ba.jpg`);
  - l'icona del programma (forma piena nella maschera arrotondata, 96, 48 e 32 px, chiaro e scuro) contro le tre icone
    più forti del genere: ElevenLabs (sintesi vocale), Proloquo di AssistiveWare (comunicazione aumentativa, R51) e
    Grid Player (comunicazione aumentativa, R52) (`fogli/icona-*-vs-elevenlabs|proloquo|grid-ab|ba.jpg`).
  Le icone vicine di chi ha reso (Firefox, GVim, ImageMagick) non sono del genere: per questo ho preso le altre.
- **Che funzioni**: home, «non ancora» e stato a 1440, 768 e 390 per le tre copie: nessuno scorrimento orizzontale,
  nessun errore, nessuna risorsa mancante (`strumenti/salute.mjs`, uscita in questo file, sezione «Funziona»); da destra a
  sinistra (ar-XB) il marchio non si specchia (`foto/barre-rtl-stato.png`); con «riduci movimento» i tre marchi stanno
  fermi e accesi (`sequenze/ridotto-tutte.png`).

## Le tre direzioni affiancate fra loro (coppie, punto 7)

Prova: `fogli/tre-direzioni-affiancate.png`, `foto/barre-tutte.png`.

- **Diverse in quattro aspetti**: la metafora (suono che esce da una riga / riquadri concentrici / bolla con righe), la
  sagoma (tre tratti aperti / quadrato pieno / bolla con la coda), il trattamento nella barra (segno chiaro di un colore
  solo come il nome / piastrella a colori / piastrella a colori) e il movimento (cursore che lampeggia e onde / anello dal
  centro / parole che si accendono).
- **Uguali in due**: il mondo di colore (magenta, rosa e bordeaux del sito, la stessa tinta: `--magenta #c50f56`,
  `--bordeaux #5b0123`, `--rosa #e3718a`, `--voce`, `--testo` più pochi toni nuovi della stessa famiglia) e lo stile di
  resa (piatto con uno spessore di 4 px sotto, estremità arrotondate).
- **Il mio parere**: sono tre direzioni di forma dentro un solo mondo di colore e di stile. Il proprietario deve saperlo:
  se il rosa e bordeaux non lo convincono per un logo, o se vuole un segno di un altro genere (un marchio fatto col nome
  come ElevenLabs, un personaggio come Proloquo, un segno monocromo), nessuna delle tre glielo fa vedere. Il colore è
  giustificato (è il sito che ha scelto), ma è un limite della scelta che gli si offre.

## Direzione 1 · «Il cursore che parla»

### Problemi

1. **Importante · da fermo la sagoma è il simbolo del volume.** Una barra verticale e due archi: la simbolica, accanto
   al volume di Adwaita e a «volume_up» di Material, a 16 e 24 px si distingue solo perché al posto del cono c'è un'asta
   (`fogli/fra-le-icone-1-cursore.png`, ultime sei righe; `fogli/simboliche-e-segni-esistenti.png`, terza riga). Nella
   barra in alto di GNOME, accanto al volume vero, si leggerebbe come un secondo volume. Fermo, il cursore non si legge
   come un cursore: è un'asta qualsiasi; diventa un cursore solo quando lampeggia nella barra del sito. A colori, fra le
   app di messaggi e di voce a 32 e 48 px, invece si distingue (stesso foglio, prime otto righe): lì è un segno «audio»,
   non un programma di messaggi.
2. **Minore · per dieci secondi all'arrivo il marchio sembra spento.** Mentre la home scrive e parla (da circa 2,5 a
   12,5 s) il cursore scende al 20% e le onde al 38%: il marchio è meno visibile del nome accanto proprio nei primi
   secondi (`fogli/movimento-1-cursore-2-7s.png`; `sequenze/1-cursore/arrivo/fotogrammi/arrivo-1440x900-f09.jpg` a 5 s;
   `foto/rtl-barra-1-cursore.png` a 3 s). Poi resta pieno (`sequenze/1-cursore/lunga-punta-foglio.png`).
3. **Minore · sbilanciato sul chiaro e sullo scuro.** Sul chiaro l'onda esterna rosa chiaro si perde e l'asta scura
   domina; sullo scuro succede il contrario, l'asta magenta e il suo spessore bordeaux scendono nel fondo
   (`foto/disegni-grandi.png`, prima e seconda riga; `foto/minime-16-24-32-x6.png`). Regge, ma pesa da un lato diverso a
   seconda del fondo.
4. **Minore · la forma piena sparisce sul bordo nello scuro.** La piastrella bordeaux scura su un fondo scuro a 32 px
   perde il contorno e restano i tratti chiari che galleggiano (`fogli/icona-1-cursore-vs-elevenlabs-ab.jpg`, metà
   scura). La ricerca lo aveva segnalato («niente colori scuri sul bordo esterno»). Su macOS il sistema aggiunge un bordo
   suo: non verificato.

### Punti forti

- **Nella barra è il più a suo agio fra i marchi dei vincitori**: segno chiaro di un colore solo, alto quanto il nome,
  della stessa forza delle lettere, come «II» di ElevenLabs (`fogli/barra-1-cursore-vs-R03-ab.jpg` e `-ba.jpg`).
- **L'unico momento che resta in mente**: mentre la home scrive il cursore del marchio lampeggia come quello del campo,
  quando la voce parla le onde si accendono (`fogli/movimento-1-cursore-2-7s.png`). Si nota anche a 28×36 px.
- **Fra le app di messaggi non si confonde**, e a 16 px resta leggibile: tre segni, niente linee sottili
  (`foto/minime-16-24-32-x6.png`).
- Semplice da ricordare e da disegnare a mano.

### Scheda

| Voce | Risposta | Prova |
| --- | --- | --- |
| A1 idea | «il testo diventa suono»: un'asta e due onde | `fogli/tre-direzioni-affiancate.png` |
| A2 momento | sì: il cursore che lampeggia nella barra e poi «parla» | `fogli/movimento-1-cursore-2-7s.png` |
| A3/A4 coperto il nome | si capisce «audio, voce»; non «scrivere» | `fogli/fra-le-icone-1-cursore.png` |
| A5 al lavoro | solo nella barra del sito, con la scena | `sequenze/1-cursore/barra-1440-foglio.png` |
| B1–B4 semplicità | sì: tre tratti, si coglie subito | `foto/disegni-grandi.png` |
| B5–B8 varietà | in parte: vivo nella barra, fermo è un segno già visto | sequenze e `fogli/simboliche-e-segni-esistenti.png` |
| B9–B11 colore | in parte: tre rosa che sul chiaro perdono l'onda esterna | `foto/disegni-grandi.png` |
| B12–B15 mestiere | sì: tratti sulla griglia, spessore misurato, versione piccola fatta apposta | `foto/minime-16-24-32-x6.png` |
| C1, C6 | sì: a sinistra del nome, porta alla pagina iniziale («Kalliope, pagina iniziale») | `strumenti/salute.mjs` |
| C3 puntatore | sì, breve: le onde ripartono, circa 0,6 s | `sequenze/punta-1440-tutte.png` (prima riga) |
| D1 | cursore che lampeggia (1 s a scatti) e onde che seguono la voce, da 2,5 a 12,5 s | `sequenze/1-cursore/barra-1440/` |
| D3/D4 | collega il marchio al gesto della pagina; togliendolo si perde il legame, non solo bellezza | stesso |
| D5 | a scatti come un cursore vero, poi onde morbide: naturale | stesso |
| D6 | sì | `fogli/movimento-1-cursore-2-7s.png` |
| D7 | sì: il lampeggio è quello del campo della finestra | `foto/home-1-cursore-1440.png` |
| E stile di default | nessun tratto dell'elenco | — |

### Le coppie (risposte uguali nei due versi)

| Contro | Estetica | Esperienza | Movimento | Esito |
| --- | --- | --- | --- | --- |
| R03, barra (`fogli/barra-1-cursore-vs-R03-*`) | stessa sobrietà di «II ElevenLabs», segno e nome una cosa sola | uguale: a sinistra, porta all'inizio | ElevenLabs è fermo, la sfera di ElevenAgents vive solo nel suo pannello; qui vive nella barra | regge; il movimento è meglio |
| R51, barra (`fogli/barra-1-cursore-vs-R51-*`) | AssistiveWare ha più calore e carattere (segno disegnato e nome a due colori); la 1 è più attuale e pulita | uguale | AssistiveWare è fermo | regge |
| R01, primo schermo (`fogli/primo-schermo-1-cursore-vs-R01-*`) | R01 non ha un marchio nella barra: il suo marchio è il titolo gigante; qui il logo è un dettaglio di 28×36 px e non cambia il confronto | — | — | non si decide sul logo |
| ElevenLabs, icona (`fogli/icona-1-cursore-vs-elevenlabs-*`) | due segni minimi; «II» è il loro nome e appartiene solo a loro, l'onda è un segno di tutti; sullo scuro la piastrella bianca spicca, quella bordeaux sparisce sul bordo | uguale leggibilità a 32 px | — | regge in parte |
| Proloquo, icona (`fogli/icona-1-cursore-vs-proloquo-*`) | il gufo è inconfondibile; la 1 è più pulita e a 32 px più leggibile, ma meno personale | — | — | regge per leggibilità, non per carattere |
| Grid Player, icona (`fogli/icona-1-cursore-vs-grid-*`) | Grid usa le lettere «gp», la 1 no; leggibili tutte e due | — | — | regge |

**In assoluto**: fra i marchi dei vincitori nella barra starebbe al suo posto. Come icona del programma è pulita e
attuale, ma generica: l'onda del suono è il segno di tutti i programmi audio. Ha ciò che le altre due non hanno: un
gesto che si vede e che dice ciò che fa il programma. **L'idea si vede?** Solo nella barra, quando lampeggia; ferma, nei
menu, «il cursore» non arriva. Non è la versione ricolorata di un riferimento.

## Direzione 2 · «Il tuo posto, alla pari»

### Problemi

1. **Importante · non dice niente del programma.** Coperto il nome, sono quattro quadrati uno dentro l'altro: un
   bersaglio, un pulsante, una caramella. «Il tuo riquadro nella riunione» non si legge senza spiegazione
   (`fogli/tre-direzioni-affiancate.png`; `fogli/icona-2-posto-vs-proloquo-ab.jpg`).
2. **Importante · si confonde con i comandi «ferma» e «registra».** La simbolica, un quadrato vuoto con un quadratino al
   centro, accanto a «stop_circle» e «radio_button_checked» di Material e al «ferma» di Adwaita si legge come un comando
   (`fogli/fra-le-icone-2-posto.png`, ultime sei righe). In un programma di voce, dove registrare e fermare sono gesti
   veri, è un'ambiguità che pesa.
3. **Importante · la simbolica somiglia al marchio di Square** (pagamenti, Block): stesso quadrato arrotondato vuoto con
   un quadrato pieno al centro; a 24 px quasi uguali (`fogli/simboliche-e-segni-esistenti.png`, prima riga). Non è un
   parere legale: è una somiglianza da far sapere prima di scegliere.
4. **Importante · il movimento nella barra non si vede alla misura vera.** La luce che parte dal centro è un anello di
   2–3 px dentro un marchio di 36 px (`fogli/movimento-2-posto.png`; `sequenze/2-posto/marchio-1440-ogni-mezzo-secondo.png`).
   Prova della rimozione: si perde quasi niente. La promessa «il marchio vive con la voce» per questa direzione non arriva.
5. **Minore · nella barra è l'elemento più acceso**: la piastrella rosa pieno compete con il pulsante «Scarica e
   installa» (`foto/home-2-posto-1440.png`).
6. **Minore · sul chiaro il bordo rosa chiaro si ammorbidisce** e la sagoma sembra più piccola (`foto/minime-16-24-32-x6.png`).

### Punti forti

- **Il più lontano dai segni della voce** che si vedono nel genere (onde, barre, bolle): fra le app di messaggi e di voce
  non si scambia con nessuna (`fogli/fra-le-icone-2-posto.png`, prime otto righe).
- **Regge a 16 px su chiaro e su scuro** senza perdere niente (`foto/minime-16-24-32-x6.png`), ed è la stessa piastrella
  in tutte le forme.
- Calmo e ordinato.

### Scheda

| Voce | Risposta | Prova |
| --- | --- | --- |
| A1 idea | quella vista: quadrati concentrici; quella dichiarata («il tuo posto») non si legge | `fogli/tre-direzioni-affiancate.png` |
| A2 momento | no | `fogli/movimento-2-posto.png` |
| A3/A4 coperto il nome | no: un pulsante o un bersaglio | `fogli/fra-le-icone-2-posto.png` |
| A5 al lavoro | no, alla misura vera | stesso del movimento |
| B1–B4 semplicità | sì | `foto/disegni-grandi.png` |
| B5–B8 varietà | no: geometria generica, ferma anche quando si muove | sequenze |
| B9–B11 colore | in parte: quattro gradini dello stesso rosa, il più dolce della serie ma senza un ruolo | `foto/disegni-grandi.png` |
| B12–B15 mestiere | sì nell'esecuzione, no nel concetto che si vede | — |
| C1, C6 | sì | `strumenti/salute.mjs` |
| C3 puntatore | sì, breve: l'anello, circa 0,5 s | `sequenze/punta-1440-tutte.png` (seconda riga) |
| D1–D5 | anello chiaro dal centro a ogni picco e bordo che segue la voce; morbido, ma quasi invisibile a 36 px | `sequenze/2-posto/barra-1440/` |
| D6 | no | — |
| D7 | sì nelle intenzioni (è l'anello di «Tu»), ma non si vede | — |
| E stile di default | nessun tratto dell'elenco | — |

### Le coppie (risposte uguali nei due versi)

| Contro | Estetica | Esperienza | Movimento | Esito |
| --- | --- | --- | --- | --- |
| R03, barra (`fogli/barra-2-posto-vs-R03-*`) | piastrella a colori come quella di ElevenAgents, ma molto più accesa; quella di ElevenAgents è discreta | uguale | non si vede | regge in parte |
| R51, barra (`fogli/barra-2-posto-vs-R51-*`) | senza il carattere del segno di AssistiveWare | uguale | — | regge in parte |
| R01, primo schermo | come per la 1: non si decide sul logo | — | — | — |
| ElevenLabs, icona | due geometrie; «II» vuol dire il loro nome, i quadrati niente | uguale | — | non regge per significato |
| Proloquo, icona | il gufo è inconfondibile, la 2 sembra un segnaposto | — | — | non regge |
| Grid Player, icona | leggibili tutte e due; Grid dice il suo nome | — | — | regge per leggibilità, non per significato |

**In assoluto**: fra le icone dei vincitori starebbe come un segnaposto ben fatto. Non è goffa, ma è generica e,
ferma, ricorda comandi e un marchio che esistono. **L'idea si vede?** No. Non è la versione ricolorata di un riferimento.

## Direzione 3 · «La frase che si accende»

### Problemi

1. **Bloccante · è l'icona di una chat.** Fra le app di messaggi a 48 e 32 px è una bolla fra le bolle (Signal, Chats,
   Fractal, Polari, Delta Chat, Karere): la distingue solo il rosa (`fogli/fra-le-icone-3-frase.png`, prime quattro
   righe). La simbolica è il simbolo «chat» di Material, pieno invece che vuoto (`fogli/simboliche-e-segni-esistenti.png`,
   seconda riga). Anche nel suo genere la bolla è il segno più usato: Grid (R52), «Speech Assistant AAC», «Text to Speech»
   (`foto/vicini-appstore.png`). Chi cerca Kalliope fra le applicazioni prima di una riunione la può prendere per un
   programma di messaggi. Un logo che non si distingue dal simbolo generico non fa il suo lavoro.
2. **Importante · è la sagoma del logo di oggi, in rosa.** Bolla arrotondata con la coda in basso a sinistra e segni
   dentro: messa accanto alla bolla verde di oggi cambia solo il colore e il contenuto
   (`fogli/simboliche-e-segni-esistenti.png`, seconda riga, ultima figura; `foto/disegni-grandi.png`, ultima riga). Il
   proprietario ha chiesto di rifare quel logo: rischia di sembrargli lo stesso.
3. **Importante · l'idea si vede solo in movimento, cioè solo nella barra del sito.** Nei menu, nelle barre delle
   applicazioni e nel negozio l'icona sta ferma, e ferma è «una bolla con del testo»; a 16 px restano due tratti
   (`foto/minime-16-24-32-x6.png`).
4. **Minore · accanto alla bolla grande della home** il marchio sembra un pezzo della scena (`foto/home-3-frase-1440.png`).
5. **Minore · le «parole» sono righe di testo finto arrotondate**, il segno che si usa per i caricamenti: già visto.

### Punti forti

- **La più coerente con la home**: è la bolla della scena in piccolo, e nella barra le parole si accendono con quelle della
  bolla vera (`fogli/movimento-3-frase.png`).
- **La forma piena è la più rifinita delle tre** su macOS e regge su chiaro e scuro (`fogli/icona-3-frase-vs-grid-ab.jpg`).
- Il movimento ha un senso chiaro (le parole dette si accendono), anche se piccolo.

### Scheda

| Voce | Risposta | Prova |
| --- | --- | --- |
| A1 idea | «un messaggio»; quella dichiarata (parole dette e non dette) si vede solo in movimento | `fogli/tre-direzioni-affiancate.png` |
| A2 momento | in parte: le parole che si accendono nella barra, piccole | `fogli/movimento-3-frase.png` |
| A3/A4 coperto il nome | sì, ma sbagliato: si legge «app di messaggi» | `fogli/fra-le-icone-3-frase.png` |
| A5 al lavoro | solo nella barra | `sequenze/3-frase/barra-1440/` |
| B1–B4 semplicità | sì | `foto/disegni-grandi.png` |
| B5–B8 varietà | no: la bolla è il segno più visto del genere | `foto/vicini-appstore.png` |
| B9–B11 colore | sì: bordo lampone, interno chiaro, testo scuro, ognuno con il suo ruolo | `foto/disegni-grandi.png` |
| B12–B15 mestiere | sì nell'esecuzione | `fogli/icona-3-frase-vs-grid-*` |
| C1, C6 | sì | `strumenti/salute.mjs` |
| C3 puntatore | sì, appena: due o tre parole che cambiano, circa 0,3 s | `sequenze/3-frase/punta-3-dettaglio.png` |
| D1–D5 | durante la scrittura le parole vanno al 40%, poi si accendono con la voce; morbido | `sequenze/3-frase/barra-1440/` |
| D6 | in parte | — |
| D7 | sì: è la dissolvenza della bolla della home | `foto/home-3-frase-1440.png` |
| E stile di default | nessun tratto dell'elenco; le righe di testo finto sono un luogo comune minore | — |

### Le coppie (risposte uguali nei due versi)

| Contro | Estetica | Esperienza | Movimento | Esito |
| --- | --- | --- | --- | --- |
| R03, barra (`fogli/barra-3-frase-vs-R03-*`) | piastrella a colori come ElevenAgents, ma si legge «chat» | uguale | piccolo ma sensato | regge in parte |
| R51, barra (`fogli/barra-3-frase-vs-R51-*`) | meno carattere del segno di AssistiveWare | uguale | — | regge in parte |
| R01, primo schermo | come per la 1: non si decide sul logo | — | — | — |
| ElevenLabs, icona | rifinita, ma «II» è solo loro e la bolla è di tutti | uguale | — | non regge per distinzione |
| Proloquo, icona | il gufo è inconfondibile, la bolla no | — | — | non regge per distinzione |
| Grid Player, icona | Grid stessa usa la bolla come marchio; mestiere pari | — | — | regge per mestiere, non per distinzione |

**In assoluto**: fra le icone dei vincitori starebbe al suo posto come fattura e stonerebbe come identità: sembra
un'app di messaggi qualunque. **L'idea si vede?** Solo nella barra. Non è la copia di un riferimento, ma è vicina al logo
di oggi e allo stesso segno di Grid.

## I requisiti delle piattaforme

| Requisito | 1 · cursore | 2 · posto | 3 · frase |
| --- | --- | --- | --- |
| niente lettere | sì (a 24 px l'asta e il primo arco formano quasi una «D», si legge comunque «I))») | sì | sì |
| leggibile da 16 px | sì | sì | sì, ma l'idea sparisce |
| chiaro e scuro senza varianti | sì, sbilanciato (problema 3) | sì, bordo tenue sul chiaro | sì |
| forma piena per macOS | sì, bordo scuro (problema 4) | sì | sì |
| forma libera | sì | è anch'essa una piastrella | sì |
| simbolica | c'è; si legge come volume | c'è; si legge come «ferma» e come Square | c'è; è il simbolo «chat» |
| non si specchia | sì (`foto/barre-rtl-stato.png`) | sì | sì |

Nessun requisito mancato in senso stretto; i problemi stanno nella distinzione, che il brief chiedeva di guardare.

## Il movimento nella barra (D4) e la lettura della home

- Si muove solo durante la scena dell'arrivo (circa da 2,5 a 12,5 s), poi i marchi restano fermi; con «riduci movimento»
  stanno fermi da subito (`sequenze/ridotto-tutte.png`). Nessuno ostacola la lettura: il marchio è 28–36 px in alto a
  sinistra mentre la scena grande si muove a destra.
- **1**: aggiunge significato e si vede (cursore che lampeggia, onde che parlano); il costo è il marchio quasi spento per
  dieci secondi. **2**: non si vede alla misura vera, quindi non aggiunge niente. **3**: aggiunge un significato piccolo
  (le parole dette), visibile solo guardando il marchio.

## Funziona

Le tre copie (uscita di `strumenti/salute.mjs`): `it/`, `it/non-ancora/`, `it/stato/` a 1440, 768 e 390 rispondono 200,
senza scorrimento orizzontale, senza errori nella console né risorse fallite. Marchio: 28×36 px (1), 36×36 (2 e 3) al
computer; 23×30 e 30×30 al telefono; nome per i lettori di schermo «Kalliope, pagina iniziale». Al telefono la barra regge
in tutte e tre (`foto/barre-390.png`). Da destra a sinistra il disegno non si specchia (`foto/barre-rtl-stato.png`).

## Ordine, dalla più forte alla più debole

1. **1 · cursore**: è la sola che nella barra sta come i marchi dei vincitori e la sola con un momento che si ricorda; il
   suo difetto (il volume) è importante, non bloccante, e si può correggere dentro l'idea.
2. **3 · frase**: la più rifinita e la più coerente con la home, ma come identità è il simbolo generico della chat e la
   sagoma del logo di oggi: l'unico problema bloccante dei tre.
3. **2 · posto**: ben eseguita ma muta: non dice niente del programma, ferma ricorda «ferma», «registra» e il marchio di
   Square, e il suo movimento non si vede.

L'ordine fra la 3 e la 2 è meno sicuro di quello fra la 1 e le altre: la 3 è fatta meglio ma non si può possedere, la 2 si
distingue di più fra le app ma non dice niente. Lo lascio al proprietario come parere, non come certezza.

**Sono all'altezza?** Nessuna è pronta così com'è. La 1 è vicina: corretta la somiglianza con il volume, starebbe fra i
vincitori. La 2 e la 3, anche corrette, partono da un'idea che si vede poco (2) o da un segno che è di tutti (3).

## Che cosa deve correggere chi ha reso (una correzione per autore, solo bloccanti e importanti)

- **1 · cursore**: far uscire la sagoma ferma dal simbolo del volume, rendendo l'asta riconoscibile come il cursore di chi
  scrive anche senza il lampeggio; provarla in simbolica a 16 e 24 px accanto ai simboli del volume di Adwaita e Material.
- **2 · posto**: rendere l'idea leggibile da ferma (che il riquadro sia un posto in una riunione, non un comando), uscendo
  dalla somiglianza con «ferma», «registra» e con il marchio di Square, e far vedere il movimento alla misura vera della
  barra (36 px) o toglierlo.
- **3 · frase**: dare alla bolla un tratto suo, che a 32 e 48 px la distingua dalle app di messaggi e dalla bolla di oggi
  anche da ferma, e che porti l'idea delle parole dette fuori dalla barra del sito.

## Non verificato

- Firefox e WebKit; l'aspetto vero su GNOME, KDE, Windows e macOS (solo le ricostruzioni di chi ha reso e le mie righe
  di icone); il Dock e la maschera di macOS con i suoi bordi.
- L'uso con il puntamento oculare; il suono della scena (Chromium senza finestra, senza audio).
- La somiglianza con Square è un confronto a occhio, non una verifica di marchi registrati.
- `controlla-sorgenti.mjs` non l'ho rifatto io (chi ha reso lo dà verde); ICO e ICNS non li ho provati.
- L'arrivo della pagina intera l'ho registrato solo con la 1: la pagina è la stessa nelle tre copie e il marchio l'ho
  registrato da vicino per tutte e tre.

## Dopo aver letto le note di chi ha reso

Letti `direzioni/*/idea.md` e `progresso.md` dopo il giudizio. Chi ha reso vede da sé quasi tutti i difetti che ho trovato
(il volume per la 1, «registra» e «ferma» per la 2, l'app di messaggi e Grid per la 3). Dove afferma più di quanto ho visto:

- **2**, «la prova della rimozione: senza il movimento si perde il legame … (significato)»: alla misura vera l'anello non
  si vede; il significato non arriva (`fogli/movimento-2-posto.png`). Non nomina la somiglianza con Square.
- **3**, «fermo, nei menu, si legge al primo sguardo "un programma che parla"»: io leggo «un programma di messaggi»
  (`fogli/fra-le-icone-3-frase.png`); la stessa nota più sotto lo ammette. Non nomina che la sagoma è quella del logo di oggi.
- **Tutte**, «regge il confronto in tutte e tre» (marchi nelle barre): vero per la 1; per la 2 e la 3 regge in parte, perché
  sono piastrelle più accese di quella di ElevenAgents e dicono meno.
- **Le differenze fra le tre**, «colore: inchiostro e tre toni / quattro gradini / chiaro, lampone e testo scuro»: sono
  tre usi della stessa tinta, non tre colori.
- **I confronti con le icone simili** (`confronti/*/icone-simili-*.jpg`) mettono Kalliope a 16–128 px accanto a ritagli a
  128 px sfocati, e le icone vicine nei contesti non sono del genere (Firefox, GVim, ImageMagick): per questo li ho rifatti
  alla stessa misura e fra app di messaggi e di voce.
- Le scelte lasciate al proprietario: il mondo di colore comune è giustificato dal sito, ma va detto che è uno solo.
