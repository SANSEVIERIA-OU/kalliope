# Giudizio della finestra costruita · «La frase che si accende» (26/11/2026, prima della 0.3)

Giudice: ruolo di giudizio del metodo design-system-generator (`references/giudizio.md`, «La pagina intera» e «Il secondo
sguardo»; `references/direzione.md` §6). Non ho reso né costruito la finestra e non l'ho toccata.

**Che cosa ho giudicato.** Il binario di rilascio `materiali-locali/target-direzione/release/kalliope`, sha256 `c3c74634…`, uguale
all'impronta che il costruttore ha scritto; costruito alle 23:00:29 da `5973720`, e i commit dopo (`6639bef`, `b8418b4`, `93ee4f9`)
non toccano `crates/`. L'ho fatto girare io, su Xvfb `:158` e con un PipeWire privato (`/tmp/kmic-run-giudicec`), senza gestore delle
finestre. Ho usato il motore vero (Giulia e Marco) e l'ho guidato con xdotool, con la tastiera e il mouse. Ho guardato tutto prima di
leggere le note del costruttore. Le mie prove stanno in `giudizio/costruzione/`: foto in `foto/`, fogli `sheet-*.png`, coppie
`*-ab.jpg` e `*-ba.jpg`, video in `video/`, misure in `misure/`, audio in `03-sentita.wav`. Gli strumenti stanno in
`materiali-locali/giudice-costruzione/`.

**Non ho verificato:**
- il tema scuro sul binario vero, perché qui non c'è un portale. Per lo scuro ho guardato soltanto le foto del costruttore;
- Wayland e «Sempre in primo piano» con un gestore delle finestre;
- la registrazione con un microfono vero e l'importazione di un file;
- la sincronia della voce propria;
- Windows e macOS.

## Verdetto

**Non è ancora da rilasciare, ma ci manca poco.** Non c'è niente di bloccante. Il primo schermo è identico alla scelta del
proprietario: 0 pixel diversi su 588 800 fra `foto/01-primo-avvio.png` e `direzione/foto/c-vuota-920x640-1-light.png`. Il passaggio a
Invio è migliorato rispetto alla direzione approvata. La voce arriva davvero al microfono «Kalliope», e Whisper ha trascritto «Sono
d'accordo con Paola e possiamo sentirci venerdì alle 3 e mezza».

Restano **quattro problemi importanti**. Due li ho trovati io e il costruttore non li dichiara: la cronologia taglia le frasi e, con
il testo grande, un clic nell'area di scrittura va perso. Gli altri due li ha dichiarati il costruttore e io ne confermo la gravità:
«Crea la voce» finisce sotto la piega, e le parole della voce propria non vanno a tempo. Il metodo dice che la finestra arriva al
proprietario appena non resta niente di importante: serve **un giro di correzioni** su questi quattro punti, poi il proprietario la
guarda e si rilascia.

## Problemi, dal più grave

### Importanti

**I-1 · La cronologia taglia le frasi a metà riga: alla misura d'apertura, e in mezzo alle misure come scheggia vuota** (non dichiarato)
- **Prova:** `foto/06a-ripeti.png`, `06b-ripeti-fine.png` e `sheet-06.png`, dopo aver ripetuto una frase della cronologia. La riga
  «Vorrei aggiungere una cosa importante sul progetto prima che chiudiate la / riunione di oggi» resta tagliata a metà della seconda
  riga, e resta così finché non si scorre: si vede anche in `07a`-`07e`, `10a`, `12b` e `14a`. Nella foto approvata
  (`direzione/foto/c-cronologia-920x640-1-light.png`) la frase più recente della cronologia sta intera sopra la bolla.
- **La stessa causa a 640 × 480:** la bolla vuota diventa una scheggia di tratteggio senza testo (`crop-640-bolla.png` e
  `sheet-18.png`).
- **Persone:** la 2 (afasia) non riconosce la frase da ripetere; la 6 (in riunione) cerca la frase con lo sguardo e non la trova
  intera.
- **Correzione:** dopo ogni cambio della cronologia (nuova frase, ripetizione, Tab che ci passa sopra), scorrerla in fondo quando
  l'altezza delle righe è già nota. Lo spazio della cronologia va tenuto a righe intere: si nasconde sotto l'altezza di una bolla,
  invece di mostrarne un pezzo. Poi rifare la prova a 920 × 640 con una frase di due righe e alle altezze fra 420 e 560.

**I-2 · Con il testo grande, un clic nella parte bassa della scrittura non la attiva e ciò che si scrive va perso** (non dichiarato)
- **Prova:** a 200% clicco nel riquadro tratteggiato, sotto la riga del segnaposto (y = 560 e y = 605), poi scrivo «uno» e «due». La
  scrittura non prende il fuoco, il tratteggio resta tenue e il testo non compare da nessuna parte (`sheet-13.png`, `13b`, `13c`).
  Soltanto un clic sulla riga del segnaposto funziona (`crop-13d.png`). A 100% un clic in basso nel riquadro funziona
  (`12b-clic-basso.png`). Il difetto sta quindi nell'impianto raccolto, quello del testo grande.
- **Persone:** la 7 (clicca nel riquadro grande e scrive) e chi ingrandisce il testo perché vede poco. Una frase scritta e persa è
  il guaio peggiore per chi scrive a fatica (la 1).
- **Correzione:** la zona del clic e del fuoco deve coprire tutto il riquadro tratteggiato a ogni grandezza del testo. Va provato a
  125, 150, 175 e 200%.

**I-3 · «Crea la voce» sotto la piega con tre tratti a 920 × 640** (dichiarato)
- **Prova:** `costruzione-prove/foto/m-voce-tratti-920x640-1-dark.png`. Il passo sembra finito: in fondo si vede la casella del
  permesso, e il comando che chiude tutto il percorso non si vede. Non c'è nessun segno che la pagina scorra. «Rifai» sta da solo a
  destra, staccato dal resto.
- **Persone:** la 5 (aiuta un'altra persona e non è pratica) e la 7 (non scorre e pensa che non vada). Con la tastiera Tab ci arriva,
  quindi la persona 1 non resta bloccata.
- **Correzione:** la proposta del costruttore è giusta: un piede fisso con «Crea la voce» quando il passo trabocca, oppure tratti
  più compatti. La gravità resta importante, perché è l'ultimo passo del percorso più lungo.

**I-4 · Voce propria: le parole si accendono fino a 0,7 s prima o dopo il suono** (dichiarato, il motore si sta correggendo)
- **Prova:** sono le misure del costruttore (da −0,64 a +0,74 s); io non le ho rifatte, perché qui non posso creare una voce propria.
  Per Giulia il costruttore misura 0,10 s di errore medio. È meglio della stima approvata (0,36 s per parola, fissa), e le mie foto
  `03a`/`03b` sono coerenti con l'audio di `03-sentita.wav` (circa 3,8 s di voce).
- **Persone:** la 3 e la 4, che parleranno con la loro voce. Una parola accesa prima che la si senta è uno stato che anticipa la
  verità. Non è bloccante, perché la frase resta giusta e lo stato «sentita» è vero.
- **Correzione:** nel motore, annunciare un pezzo quando il suo primo campione viene riprodotto, come propone il costruttore. Dopo
  la correzione serve una nuova misura con `sync2.py` sulla voce propria.

### Minori

- **M-1 · Il salto della scrittura a Invio quando lo stato cambia altezza.** Alla prima frase, con «Nessuno ti sente» su due righe,
  il riquadro di scrittura scende di circa 64 px in un fotogramma. Per tre fotogrammi la zona della conversazione resta vuota, poi la
  bolla compare (`fot02/sheet.png` nel banco, `misure/02-invio-nessuno/tratto-2.jpg`). Con la cronologia piena il salto è di circa
  20 px (`misure/03-invio-sentita/tratto-2.jpg`). Il costruttore lo dichiara. Non ostacola, perché il cursore resta nel campo; è
  però un taglio dove il resto scorre. Correzione: animare l'altezza della riga di stato con la stessa curva della cronologia
  (520 ms).
- **M-2 · A 200% il bordo basso della scrittura tocca il bordo della finestra** (`crop-200-fondo.png`, `grande-kalipso-ab.jpg`). A
  175% il margine c'è. Correzione: la quota della scrittura deve lasciare il margine di fondo anche all'ultimo gradino.
- **M-3 · Dopo «Svuota la cronologia» lo stato dice ancora «Nessuno nella chiamata ha sentito la frase»**, ma la frase non c'è più
  (`foto/15c-svuotata.png`). Correzione: dopo lo svuotamento tenere soltanto la parte vera, cioè che nessuna app usa il microfono.
- **M-4 · ↑ riporta l'ultima frase con il cursore all'inizio** (`foto/04b-freccia-su.png`). Chi vuole aggiungere una parola in fondo
  deve premere Fine. Correzione: cursore alla fine.
- **M-5 · Le frecce nelle liste a scelta** (microfoni, tratti) non spostano la scelta, mentre nel menu della voce sì
  (`sheet-07.png`). Il costruttore lo dichiara. Tab e Spazio funzionano, quindi non è una trappola, ma nella stessa finestra la
  regola cambia. Nel menu della voce, poi, ↓ da Marco torna a Giulia e salta «Senti anche tu la voce» (`07c-giu2.png`). Non ho
  provato se Tab ci arriva.
- **M-6 · Il messaggio «La voce non parte» mostra un percorso di file e i nomi `encoder.onnx`, `decoder.onnx` e `model.json`**
  (`foto/19-senza-modelli.png`). Per la persona 5 è gergo. Il resto va bene: «Reinstalla Kalliope» e «Come si risolve» danno
  un'uscita, e la frase scritta non si perde. Correzione: una frase per la persona, con i dettagli tecnici nel registro. Sta nella
  stessa famiglia del messaggio lungo «non è un audio», che il costruttore dichiara: anche quello è minore.
- **M-7 · Dopo un giro di Tab la cronologia resta sulla frase vecchia** anche quando il fuoco torna alla scrittura (`sheet-05.png`,
  quinto e sesto riquadro).
- **M-8 · In riunione il comando si chiama «Intera»** (`sheet-09.png`), mentre la direzione approvata a 920 × 640 dice «Finestra
  intera». A 400 px non c'era posto, ed è dichiarato. Per la persona 7, però, «Intera» da solo non dice che cosa fa: un'icona
  insieme alla parola, o un aiuto al passaggio del puntatore, basterebbero.
- **M-9 · La posizione della finestra non si ricorda** (dichiarato). Per la persona 6 vuol dire rimetterla accanto a Zoom a ogni
  avvio. La modalità riunione invece si ricorda, quindi il danno è piccolo.
- **M-10 · «Informazioni» dice «Kalliope 0.2»** (`foto/14b-info.png`). Al rilascio deve dire 0.3: va controllato che
  `tools/version.py` aggiorni anche questa riga.
- **Ereditato dalla direzione, non dalla costruzione:** a 360 × 320 «A+» tocca il bordo destro della finestra, come nella foto
  approvata (`sheet-360.png`, `crop-360-barra.png`).

## Le differenze dichiarate, una per una

| Differenza | Giudizio | Prova |
|---|---|---|
| Il fuoco entra sulla prima scelta di ogni passo | Giusta: la persona 1 non lo deve cercare | `16a-crea-1.png` (anello su «Registrala adesso») |
| Anello del fuoco del «registra» fuori dal tondo | Giusta: non copre l'arco dei 12 s | foto del costruttore; non rifatta |
| «Annulla» mentre si registra, scelta del microfono, consigli | Giuste: danno un'uscita. Ho visto il caso senza microfono: «Non trovo un microfono… poi riprova» con «Come si risolve», e il microfono virtuale «Kalliope» non viene preso per registrare | `sheet-17.png` |
| Elenco dei tratti, il pulsante spento che dice perché | Giuste come contenuto; il problema è l'impaginazione (I-3) | `m-voce-tratti-*` |
| Avanzamento e «Annulla» di «Crea la voce», la voce nuova scelta da sola | Giuste | non provate da me |
| «Informazioni» come pannello dentro la finestra | Giusta: Esc chiude, il fuoco torna su «Altro», `AboutSlint` (Slint 1.19.1) c'è in fondo | `14b-info.png`, `14c-info-fondo.png`, `15a` |
| Domanda prima di svuotare la cronologia | Giusta, con «Annulla» che ha il fuoco | `sheet-15.png` |
| Consiglio «Alt+Spazio» solo sotto Wayland | Giusta in principio; non verificata | — |
| La finestra della riunione cresce con il testo | Giusta: a 150% la direzione non ci stava | non provata da me |
| A riposo, in riunione, si vede l'inizio della frase | Indifferente: la direzione mostrava la fine, tagliata a sinistra; qui l'inizio, tagliato a metà parola senza sfumare al bordo («frase mo», `sheet-09.png`) | `sheet-08.png` |
| «Aiuto» al posto di «Come si risolve» in raccolta | Giusta | `sheet-08.png`, `sheet-10.png` |
| A Invio la bolla vecchia sfuma sul posto | **Migliora la direzione**: 1700 ms visibili, salta di colpo il 34%, sfuma il 33%, metà entro 167 ms. Nella direzione approvata: 1933 ms, 55% a salto, 5% sfuma | `misure/03-invio-sentita/` accanto a `direzione/misure/c-invio-passaggio/` |
| Le parole seguono i pezzi veri, non la stima | Giusta: per Giulia è migliore della stima approvata. Per la voce propria vedi I-4 | — |

Ci sono anche tre differenze non dichiarate, oltre a I-1 e I-2. Nessuna peggiora la direzione:
- l'elenco dei formati nel passo 1 è più lungo (OPUS, M4A, MP4, WEBM; `sheet-16.png`);
- nella barra c'è Marco quando lo si sceglie, il che è giusto;
- in riunione mancano la voce, A− e A+, come previsto dalla direzione («solo stato, scrittura, Ferma»).

## La scheda (finestra costruita)

### A. L'idea
- **A1:** la bolla del logo diventata finestra. Tratteggio per ciò che non è ancora detto, bolla piena per ciò che è detto. Tiene.
- **A2:** il momento che resta è Invio. La frase lascia il tratteggio, nasce nella bolla con l'anello verde acqua e le parole si
  scuriscono mentre la voce le dice (`sheet-03.png`).
- **A3:**
  - che cos'è: sì, dicono «Scrivi qui. Invio la dice.» e la bolla vuota;
  - per chi: in parte, si capisce soltanto dalla frase «Nella riunione scegli «Kalliope» come microfono»;
  - che cosa fare: sì (`01-primo-avvio.png`).
- **A4:** sì, il tratteggio e la bolla bastano a riconoscerla senza nome né logo (`parla-sito-ab.jpg` e `-ba.jpg`).
- **A5:** sì, perché il prodotto è la finestra stessa.

### B. Estetica
- **B1-B4, semplicità:** sì. Una colonna, un comando pieno solo, la gerarchia chiara (`01`, `03b`). B3 è in parte: a 920 × 640 con
  «Nessuno ti sente» la riga di stato pesa per due righe di testo piccolo (`02c`).
- **B5-B8, varietà:** sì. L'anello, le barre e le parole che si scuriscono rendono la finestra viva quando serve, e ferma quando non
  serve.
- **B9-B11, colore:** sì. Il verde acqua vuol dire «a posto e sentito», il caldo vuol dire «non arriva», e il rosa sta soltanto nel
  logo e nel «registra» (`sheet-03`, `sheet-02`, `sheet-16`).
- **B12-B15, mestiere:** in parte. Il lavoro è da professionisti e il concetto c'è. B14, la cura dei dettagli, cade su I-1 (righe
  tagliate), M-1 (salto) e M-2 (bordo).

### C. Esperienza d'uso
- **C1/C2:** sì. Il fuoco parte nella scrittura e Invio dice. La guida in basso cambia («↑ l'ultima frase» compare solo quando c'è
  una frase).
- **C3:** sì. Si vedono tutti gli stati: pronta, sto parlando, nessuno ti sente, fermata (le parole non dette restano tenui, `04a`),
  la voce non parte (`19`), manca il microfono (passo della voce, `17a`).
- **C4/C5:** sì. «Nessuno ti sente» con «Come si risolve» non esiste in nessun riferimento.
- **C6:** sì. Tab gira senza trappole (`sheet-05.png`: Giulia → Riunione → Altro → A+ → la cronologia → «Come si risolve» → la
  scrittura); Esc chiude menu, pannelli e domande.
- **C7:**
  - contenuto: sì;
  - struttura: sì;
  - aspetto: sì, tranne I-1;
  - funzionamento: in parte (I-2, I-3);
  - interattività: sì;
  - innovazione: sì, lo stato «sentita»;
  - esperienza complessiva: buona.

### D. Movimento (misure con `movimento-visibile.mjs`, finestra a 30 fps, Xvfb senza GPU)

| Gesto | Costruita (mia misura) | Direzione approvata | Riferimento |
|---|---|---|---|
| Invio con la cronologia | 1700 ms, salta 34%, sfuma 33%, spostato 33%, metà entro 167 ms (`misure/03-invio-sentita`) | 1933 ms, salta 55%, sfuma 5%, spostato 39% | sito: 2232 ms, 61% spostato |
| Invio alla prima frase, nessuno sente | 767 ms, salta 45%, con un salto di 64 px della scrittura (M-1) (`misure/02-invio-nessuno`, tratto 2) | — (la direzione non lo misura) | — |
| Parole che si scuriscono | 1567 ms, sfuma 87% (tratto 4, prima frase) | dentro i 4700 ms di `vero-invio` | sito: 6085 ms, sfuma 71% |
| Fine della frase | 334 ms, salta 56% (tratto 5) | 467 ms | sito: 801 ms |
| Menu della voce, da tastiera | apre in 167 ms; chiude in 167 ms, con Esc e dopo la scelta, sfumando il 37-45%; le frecce cambiano in un fotogramma (`misure/07-menu-tastiera`) | apre in 167 ms, chiude in 200-234 ms, sfuma il 34-53% | Cboard: 383 ms, 92% a salto |
| «Crea la tua voce», entrata e uscita | 166 ms e 167 ms; l'uscita è una dissolvenza incrociata in cui i testi delle due schermate si sovrappongono per circa 100 ms (`misure/16-crea-voce/tratto-3.jpg`) | 167 ms e 234 ms | Cboard: 383 ms, a taglio |
| Riunione e testo grande | istantanei (voluto) | istantanei | Kalipso: istantaneo |

- **D4, la prova della rimozione:** se il passaggio a Invio fosse istantaneo, si perderebbe il significato (da dove viene la frase);
  le parole che si scuriscono sono informazione; il menu perderebbe solo bellezza, che però dà carattere.
- **D8, entrata e uscita:** le uscite sono un po' più brevi delle entrate e sfumano. Quella del menu dura 167 ms contro i 200-234 ms
  approvati, uno o due fotogrammi in meno.
- **«Sì» con le misure:** passaggio a Invio con la cronologia, menu.
- **Da guardare per il proprietario a velocità vera:** l'uscita di «Crea la tua voce» (testi sovrapposti) e il salto alla prima
  frase (M-1).

### E. Stile di default
- **Pillole:** giustificate dal sito, come nel giudizio della direzione.
- **Lexend:** giustificato dal sito.
- **Terracotta della riga «Nessuno ti sente» nel chiaro:** viene dalla tinta di Paola approvata, ed è stata guardata. Non ci sono
  tratti nuovi di default rispetto alla direzione.

## Il confronto a coppie, nei due versi

- **Contro Kalipso** (`parla-kalipso-ab.jpg` e `-ba.jpg`):
  - regge, ed è meglio come identità, perché Kalipso usa il blu d'azione di sistema e i pulsanti generici. Kalipso è meglio nella
    grandezza del testo letto, che è il suo compito. Scambiando le posizioni la risposta non cambia;
  - a 200% (`grande-kalipso-ab.jpg` e `-ba.jpg`) Kalipso taglia il testo letto, Kalliope tiene la frase intera e perde soltanto il
    margine di fondo (M-2), quindi qui è meglio.
- **Contro la home del sito** (`parla-sito-ab.jpg` e `-ba.jpg`): stesso mondo, stessa bolla, stesso tratteggio. La finestra è più
  piatta del sito, che ha bagliori e profondità: è una scelta della direzione, già giudicata. Scambiando le posizioni la risposta
  non cambia.
- **Contro Proloquo4Text** (`cronologia-p4t-ab.jpg` e `-ba.jpg`, fotogramma del video, quindi un confronto debole): la scrittura di
  Kalliope è grande quanto quella di P4T e più leggibile, e la cronologia è meno fitta. P4T ha le frasi pronte, che qui sono
  rinviate per decisione del proprietario.
- **In assoluto:** fra i vincitori della categoria starebbe al suo posto. Ha ciò che gli altri non hanno: la verità su chi ti sente.
  Che cosa è goffo:
  - le righe tagliate della cronologia (I-1);
  - la riga di stato fitta di testo piccolo quando c'è un problema;
  - «Rifai» isolato nel passo dei tratti.

  Non è la versione ricolorata di un riferimento.
- **Rispetto al metro del proprietario (Kalipso):** come identità e come stati lo supera. Sui dettagli (I-1, M-1, M-2) è ancora un
  gradino sotto la pulizia che chiede.

## Il percorso delle persone (fatto da me sul binario)

1. **Solo tastiera, poca energia.** Fatto tutto senza mouse:
   - scrivere e Invio; Esc ferma; ↑ riporta l'ultima frase (M-4);
   - Maiusc+Tab porta alla cronologia, Invio ripete (`sheet-06`);
   - menu della voce con ↓, Esc e Invio, e il fuoco torna sul pulsante (`sheet-07`);
   - «Riunione» e «Intera», con il fuoco che resta nella scrittura;
   - Ctrl+meno e Ctrl+più per il testo;
   - «Altro» → «Informazioni» → Esc, con il fuoco che torna su «Altro».

   Nessuna trappola.
2. **Afasia.** Le frasi brevi tengono. Le righe tagliate (I-1) e la riga di stato lunga sono un ostacolo.
3. **Voce già persa.** La strada «Usa vecchie registrazioni» si vede, anche se è seconda (`sheet-16`). L'importazione non l'ho
   provata.
4. **Voce da conservare.** «Registrala adesso» è in testa. Senza microfono c'è l'errore con un'uscita (`sheet-17`).
5. **Chi aiuta, non pratico.**
   - Il passo dei tratti nasconde il comando finale (I-3).
   - L'errore dei modelli parla di file (M-6).
6. **In riunione.**
   - «Nessuno ti sente» arriva subito alla prima frase senza ascoltatori, ed è vero (`sheet-02`).
   - Con un ascoltatore lo stato è «Sto parlando» (`sheet-03`).
   - In modalità riunione la frase scorre su una riga (`sheet-08`).
7. **Principiante distratto.**
   - Scrive e preme Invio senza aver scelto il microfono in Zoom: la finestra glielo dice, con «Come si risolve».
   - Con il testo grande clicca nel riquadro e scrive a vuoto (I-2).
   - Non trova «Crea la voce» (I-3).
   - Non capisce «Intera» (M-8).

## Riassunto per il proprietario

### Problemi
- **Importante, la cronologia taglia le frasi.** Dopo una frase lunga, la frase più recente della cronologia si vede a metà, tagliata
  sotto la seconda riga. A finestra media si vede un pezzo di bolla vuota.
- **Importante, con il testo al 200% un clic nella parte bassa del riquadro di scrittura non lo attiva.** Quello che si scrive dopo
  va perso.
- **Importante, «Crea la voce» finisce fuori dallo schermo.** Quando la registrazione ha tre pezzi, il pulsante finale non si vede e
  bisogna scorrere senza saperlo.
- **Importante, voce propria: le parole si accendono fino a 0,7 secondi fuori tempo.** La correzione è in corso nel motore.
- **Minori:**
  - alla prima frase, se nessuno ti sente, il riquadro di scrittura scende di colpo;
  - a 200% il riquadro tocca il fondo della finestra;
  - dopo «Svuota la cronologia» lo stato parla ancora di «la frase»;
  - con ↑ il cursore va all'inizio della frase invece che in fondo;
  - nelle liste della voce le frecce non spostano la scelta;
  - il messaggio per i modelli mancanti è tecnico;
  - il comando «Intera» si capisce poco;
  - la posizione della finestra non si ricorda;
  - «Informazioni» dice ancora 0.2.

### Che cosa funziona
- Il primo schermo è identico a quello che hai scelto.
- La voce arriva davvero al microfono «Kalliope». L'ho registrata e trascritta.
- «Nessuno ti sente» e «Come si risolve» compaiono quando servono.
- Con la sola tastiera si fa tutto, senza trappole.
- Il passaggio a Invio adesso scorre meglio della direzione approvata.
- Le schermate nuove («Informazioni» con Slint, la domanda prima di svuotare, l'errore senza microfono) stanno nello stesso mondo.

### Confronto
- Accanto a Kalipso regge ed è più riconoscibile.
- A testo grande tiene meglio di Kalipso.
- Nei dettagli è ancora un gradino sotto la pulizia che chiedi.

### Non verificato
- Il tema scuro sul programma vero.
- Wayland.
- Un microfono vero.
- L'importazione di un file.
- Windows e macOS.

### Movimenti da guardare a velocità vera
- **Invio con la cronologia:** `giudizio/costruzione/video/03-invio-sentita.mp4`. Misura: 1700 ms, 34% a salto. Nella direzione
  approvata: 1933 ms, 55% a salto. Nel sito: 2232 ms.
- **Prima frase senza ascoltatori:** `video/02-invio-nessuno.mp4`. Misura: 767 ms, con il salto della scrittura. La direzione non ha
  una misura comparabile.
- **Menu della voce da tastiera:** `video/07-menu-tastiera.mp4`. Misura: apre in 167 ms e chiude in 167 ms. Nella direzione
  approvata: 167 ms e 200-234 ms. Cboard: 383 ms a taglio.
- **«Crea la tua voce», apertura e chiusura:** `video/16-crea-voce.mp4`. Misura: 166 ms e 167 ms, con i testi che si sovrappongono in
  chiusura. Nella direzione approvata: 167 ms e 234 ms.
