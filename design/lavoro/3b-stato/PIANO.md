# «Stato» nella direzione 2 · piano dei tratti (incarico 3b, 17/11/2026)

**L'idea, in una frase.** Ogni fatto sta dove accade: la pagina disegna sulla riunione e sulla strada della voce il confine di ciò
che è provato (pieno, con la cifra e il file da cui viene) e di ciò che non lo è ancora (tratteggiato), così chi valuta e chi controlla
vedono che Kalliope è **provato fino al microfono, in riunione non ancora**.

Lo stesso mondo della home e di «non ancora» (`design/direzione-2/D2.md`, `PIANO.md`; `design/lavoro/3a-non-ancora/PIANO.md`): un solo
colore, la stanza con la luce, la riunione con Paola, Luca e Anna, la bolla con la coda, le onde di 900 ms lineari, la strada della voce,
le scene a tutta larghezza con gli angoli alti di un riquadro che si allargano dai lati, la curva d'entrata `cubic-bezier(0.19,1,0.22,1)`,
le salite di 12-20 px, il **tratteggio** come segno di «non ancora» (nella home le tappe non provate, in «non ancora» ciò che manca). Qui
il tratteggio è ciò che nessuno ha ancora provato: le persone oltre il microfono, l'app della riunione, i modi di scrivere diversi dalla
tastiera, il tempo dal tasto al suono.

Percorsi: `R/` = `/workspace/prova-design-abc/prova-2/riferimenti/`, `K/` = `/workspace/kalliope/design/ricerca/prove/`. Prove di questa
resa (fuori dal repository, `.gitignore`): `sequenze/` (arrivo, scorri, domanda, copia, copia-riuscita, arrivo-basso), `foto/` (schermi
bassi, ridotto, senza JavaScript, pseudo-lingue in `foto/lingue/`), `confronti/` (fogli a coppie, nei due versi), `esiti/`
(`confronta-scelta`).

## Prima di rendere: che cosa fanno i riferimenti sotto il primo schermo

Guardati negli scorrimenti (`R/sequenze/*/scorri-1440x900-foglio.jpg`) e, per il genere di questa pagina (fatti per chi controlla), nella
scheda e nelle foto di **R04 Waymo Safety Hub** (vincitore 2026, Best Responsible AI Implementation: `design/ricerca/schede/R04.md`).
- Tratto comune: sotto il primo schermo, sezioni con un titolo e un oggetto; una chiamata finale prima del piede (R03, R05, R52, R53); fatti
  di fiducia elencati con il loro segno (R03 `R/sequenze/R03/fotogrammi/scorri-1440x900-f05.jpg`: certificazioni; R53 «Compliance»).
- Peculiarità candidate, provate una alla volta: la cifra grande con la barra che cresce e la frase intera accanto (R04,
  `K/R04/007-scorri.jpg`); i limiti e il metodo «lunghi a richiesta» (R04, `K/R04/044-clic.jpg`); l'onestà in pagina, impronta e avviso
  (R50, `R/sequenze/R50/fotogrammi/scorri-1440x900-f05.jpg`; R50 è un concorrente diretto: preso un tratto solo, dichiarato); la schermata
  del prodotto con le didascalie sulle parti (R51, `R/sequenze/R51/fotogrammi/scorri-istantaneo-1440x900-f03.jpg`).
- Il difetto che torna e che qui non si prende: sezioni di schede uguali e FAQ a fisarmonica impilate (R05 `scorri-senza-avviso`, R50).

## Le alternative, prima di scegliere

1. **Ogni fatto sta dove accade** (scelta): confine del provato sulla riunione, poi la strada vista da vicino con le cifre nel punto in cui
   sono misurate, il computer con ciò che ne entra e ne esce. Rischio smontato: la strada è già nella home e in «non ancora» → qui è la sua
   versione da vicino (sei tappe, verticale, con i fatti), e il primo schermo resta la riunione.
2. **La stessa cosa detta a ciascuno** (la tabella di `progetto.md` §4.3 diventata un gesto: scegli chi sei, cambiano le risposte):
   scartata come idea della pagina: nasconde i fatti dietro una scelta (P7 li vuole tutti), moltiplica per cinque i testi da tradurre, non fa
   vedere niente accadere. Resta, ridotta, nel tratto delle domande (le domande sono quelle di P3).
3. **Il registro delle prove** (una linea del tempo delle verifiche, con le date): scartata: le date delle singole prove non ci sono, si
   dovrebbero inventare.

## I tratti, dall'arrivo al piede

| Tratto | Dentro l'idea | Che cosa si muove, e a che scopo | Fonte o motivazione |
|---|---|---|---|
| Barra | La stessa sala | Come in «non ancora»: trasparente in cima, piena appena si scorre; al telefono «Menu». «Stato e limiti» ha `aria-current`. Nessuna azione in barra: chi valuta o controlla decide alla fine (il messaggio da inoltrare). **Orientare** | Cornice di «non ancora» (`barra.css`, `cornice.js`); tratto comune barra fissa (R03) |
| Primo schermo | Il titolo è la risposta: «Provato fino al microfono. In riunione, non ancora.» La riunione di «non ancora», questa volta con la voce: «Tu · microfono «Kalliope»», nella barra dell'app scelto «Kalliope» | **Arrivo** (`sequenze/arrivo/`): righe del titolo che salgono, testo, comandi e stato come nella home; i riquadri entrano, «Tu» per ultimo; a 1,9 s la bolla nasce dalla coda con la frase grigia; a 2,5 s «Tu» parla (bordo acceso, barre che si muovono per 1,5 s) e la frase si accende; a 3,1 s il microfono «Kalliope» risponde con l'anello della voce e compare «· provato fin qui»; a 3,8 s un'**onda tratteggiata** parte da «Tu» (900 ms lineari, larga quanto la riunione) e i riquadri che tocca, Luca, poi Paola, poi Anna, restano tratteggiati e un poco velati. Poi fermo. **Raccontare** dove si ferma la prova prima ancora di leggerlo. Prova della rimozione: senza l'ordine (voce → microfono → oltre) il tratteggio è decorazione | Impianto, riunione, bolla, onde e curve della home e di «non ancora» (`confronti/primo-home-1440-*.jpg`, `primo-non-ancora-1440-*.jpg`); il tratteggio per «non provato»: tappe «forse» della strada della home; l'onda tratteggiata che lascia il segno e «provato fin qui»: progettuali |
| Passaggi | Ogni tratto è una scena della stessa riunione | Scene in tono: notte (provato), stanza (per chi), chiaro (controllare), stanza (inoltra), notte (piede): la successione della home. Entrando si allargano dai lati, legate allo scorrimento. **Collegare** | Home e «non ancora» (`tratti.css`) |
| Fin dove è provato, e come | La strada della voce vista da vicino, in verticale: si installa · scrivi la frase · la voce nasce · microfono «Kalliope» (dentro la cornice «Le cifre: su un solo computer, Ryzen 5 PRO 6650U») · l'app della riunione · gli altri ti sentono (fuori, tratteggiate). **Ogni cifra sta nella tappa in cui è stata misurata**, con il file da cui viene; a lato la parentesi «dal tasto Invio al suono nella riunione: non misurato». Sotto, «Hai provato in una riunione vera? Dicci come è andata» (P9) | **Arrivo, una tappa alla volta** (`sequenze/scorri/`, 3-9 s): quando una tappa arriva sullo schermo la linea scende al suo nodo (260 ms), il nodo si accende crescendo, compaiono i fatti, la linea riparte; più tappe arrivate insieme si accendono in fila. In ogni tappa il fatto accade: i quattro pacchetti provati si accendono uno dopo l'altro; nel campo «cmq ci vediamo dmn alle 10:30» e poi nasce la bolla «comunque ci vediamo domani alle dieci e trenta»; la quota di un secondo di voce si riempie fino a 0,07; la riga di 43 parole si scrive e una, la sbagliata (2,3%), lampeggia due volte. Dopo il microfono la linea è tratteggiata. **Mostrare** le misure e **raccontare** dove finiscono. Prova della rimozione: si perde «dove» è misurata ogni cifra e l'ordine provato → non provato | Strada della home (`strada.css`) e «non ancora»; la cifra grande con la barra che cresce: R04 (`K/R04/007-scorri.jpg`, scheda R04 §15.1), un tratto; la cifra nel punto della catena, la parentesi, la riga delle parole e la riscrittura nel campo: progettuali, dai fatti di README, `docs/virtual-microphone.md`, `docs/releasing.md` |
| Per chi è, e per chi no | Le domande di chi lo valuta per un'altra persona (P3: «È adatto? Cosa serve? Costa? Limiti?»), in fila come i pulsanti-voce; la risposta nella bolla, una alla volta | **Arrivo:** il titolo sale, la bolla della prima risposta nasce dalla coda. **Gesto:** premuta una domanda, le parole della bolla si spengono (140 ms), la bolla prende la misura nuova (FLIP, 420 ms) e le parole nuove compaiono (`sequenze/domanda/`); al computer la bolla resta in vista sotto la barra mentre si scorrono le domande; al telefono si apre sotto la domanda premuta e viene in vista. **Rispondere**, un'idea per volta | Frase delle cifre della home (dissolvenza incrociata e FLIP nella stessa bolla); pulsanti-voce con lo stato: R51 attraverso la home (`filo.css`); «il lungo solo a richiesta»: `progetto.md` §4.2 e R04 (`K/R04/044-clic.jpg`), un tratto |
| Il testo non esce dal computer | Per chi controlla (P7): il computer come oggetto, con la finestra di Kalliope (la frase, le frasi già dette), il disco e il microfono «Kalliope»; i passi accanto dicono ciascuno un fatto, con il file del codice. Sotto, licenze, impronte e provenienza, il codice | **Scorrendo** (`sequenze/scorri/`, 15-21 s): il passo a metà schermo dice al computer che cosa mostrare. *Il testo*: il campo si accende, il bordo è chiuso. *Una sola connessione*: da «huggingface.co» scende un filo tratteggiato, tre file con l'inizio della loro impronta scendono in fila nel disco e «la voce · 53 MB» si accende. *Che cosa resta*: il disco acceso; campo ed elenco tratteggiati, «solo finché la finestra è aperta». *Quando chiudi*: la finestra si chiude rimpicciolendo, il microfono sparisce, il disco resta. **Mostrare** il fatto mentre lo si legge | Il computer della strada della home («Sul tuo computer»); la schermata del prodotto con le didascalie sulle parti: R51 (`R/sequenze/R51/fotogrammi/scorri-istantaneo-1440x900-f03.jpg`), un tratto; la riunione ferma a lato mentre si scorre: home («Le tue frasi»); l'impronta detta in pagina: R50 (f05), un tratto; il filo, i file che scendono, «solo finché la finestra è aperta»: progettuali |
| Da mandare a chi ti aiuta | La fine del percorso di P3: «ha una pagina o un testo da inoltrare». Lo stato di oggi in poche righe, nella bolla, come una frase di Kalliope, con l'indirizzo della pagina | **Arrivo:** il titolo sale, la bolla nasce dalla coda. **Gesto «Copia il messaggio»:** il testo e l'indirizzo vanno negli appunti, la bolla risponde con l'anello della voce, sotto «Copiato: incollalo in un messaggio o in una e‑mail» (`sequenze/copia-riuscita/`); se gli appunti non ci sono, la frase per copiarlo a mano (`sequenze/copia/`). **Decidere** e portarlo via | Chiamata finale prima del piede: tratto comune (R03, R05, R52, R53); il comando «copia» con le sue due risposte: «non ancora» (`versioni.css`); il messaggio nella bolla: progettuale |
| Piede | — | Fermo, su notte, come nelle altre pagine | `piede.css` |

**Senza JavaScript** (`foto/senzajs-*.png`): tutto il testo; il primo schermo al suo stato finale (voce, «provato fin qui», tratteggio);
la catena disegnata e accesa; ogni domanda con la sua risposta sotto, in due colonne; il computer con tutto in vista e i passi accanto;
la bolla da selezionare e la frase per copiarla a mano.
**Movimento ridotto** (`foto/ridotto-*.png`): ogni scena al suo stato finale; i gesti restano (le domande cambiano senza dissolvenza).
**Da destra a sinistra** (`foto/lingue/ar-XB-*.png`, pseudo-lingua): proprietà logiche in tutti i fogli nuovi (`css_logico.py` verde);
«Tu» in alto all'inizio e l'onda che parte da lì (`--verso`), la catena con i nodi all'inizio, il filo del varco sopra il disco.
**Testo più lungo del 40%** (`foto/lingue/en-XA-*.png`): nulla esce dal bordo nelle foto fatte; difetti da completare sotto.

## La cornice: che cosa ho aggiunto, senza cambiare «non ancora»

- `pagina.css`: un titolo di **quattro righe** sugli schermi bassi del computer (sotto i 700 px d'altezza) prende la misura del tablet
  (`.scena-pagina h1:has(.riga:nth-child(4))`): a 1366×640 sotto il comando resta lo stato «Oggi:» (`foto/primo-1366x640.png`). I titoli di
  tre righe non cambiano: `confronta-scelta` su «non ancora» e sulla home, contro la costruzione di partenza, 0% a 1440×900, 1366×640,
  390×844, in cima e a 1800 px (`esiti/confronta-scelta-*.txt`).
- La **chiusura** di questa pagina non è «la riunione grande con un comando che si prova» ma il messaggio da inoltrare: per chi arriva qui
  (P3, P7) il gesto che chiude è portare via lo stato di oggi; un altro ascolto ripeterebbe «non ancora».
- Gli stati della pagina (riposo, menu, risposta nella bolla, copia fatta e non riuscita) sono in `design-system/metodo.config.mjs`.

## Stile di default (`giudizio.md`, parte E)

- **Pillole**: sì, come nella home (R01 «Let's begin», R03 «Talk to sales», `R/primi-schermi/R01-1440x900.jpg`, `R03-1440x900.jpg`): i
  comandi, le domande (come i pulsanti-voce di R51), le etichette dei file e dei pacchetti.
- **Gradiente**: le luci della stanza della home (monocromo come R01).
- **Cifre grandi**: tre (0,07 s; 2,3%), ognuna con il suo segno e la sua fonte, dentro la catena: R04 (`K/R04/007-scorri.jpg`).
- Niente crema e grazie, corsivo, griglia di schede uguali, etichette numerate o in monospazio (le fonti in Lexend; il comando
  `gh attestation verify` nel carattere della finestra dell'app, come i testi dell'app), elenchi con le spunte, fasce vuote fra sezioni
  dello stesso fondo. La colonna delle domande è un elenco di comandi con lo stato, non di schede. Le entrate non sono una dissolvenza uguale
  per tutti: titoli che salgono, una tappa alla volta, la bolla che nasce, il computer che cambia con il passo.

## Scelte senza una fonte (progettuali, dichiarate)

- Il titolo come risposta in quattro righe; la frase 3 (l'importo) nella bolla del primo schermo.
- L'onda tratteggiata che lascia i riquadri tratteggiati; «provato fin qui» nella barra; i tempi dell'arrivo (2,5 s; +0,6; +0,7; 220/440/500 ms).
- La catena verticale con le cifre nel punto in cui sono misurate; la cornice «Le cifre: su un solo computer»; la parentesi «non misurato»;
  la riga di 43 parole con una sbagliata; la quota di un secondo; il campo e la bolla della riscrittura; i tempi della tappa (260 + 320 ms).
- Le dieci domande e la bolla che resta in vista; la bolla che al telefono si apre sotto la domanda.
- Il computer del varco con i suoi quattro passi, il filo da «huggingface.co», i tre file con l'inizio dell'impronta (frammenti
  d'esempio, non le impronte vere), «solo finché la finestra è aperta», la finestra che si chiude.
- Il messaggio da inoltrare e il suo testo; l'anello della voce sulla bolla copiata.
- La successione delle scene (stanza, notte, stanza, chiaro, stanza, notte), la stessa della home.

## Da completare a chi costruisce

**Sistema**
- Catalogo (`design-system/catalogo/`, un file per area come `catalogo-pagine.js`): i cinque componenti con stati e varianti: la riunione
  provata (prima, durante, dopo l'arrivo); la catena (tappa spenta, accesa, forse; la quota; la riga delle parole; la riscrittura); le
  domande (con e senza script, al computer e al telefono, cambio di risposta); il varco (i cinque stati: tutto, testo, scarico, disco,
  chiudi); il messaggio (riposo, copiato, non riuscito, senza appunti).
- In `stato.js` i moltiplicatori della discesa dei file e le curve `linear` delle dissolvenze delle domande: portarli nei token.
- L'indirizzo mostrato nella bolla del messaggio e il `canonical` sono scritti a mano (come in «non ancora»): dai dati del sito
  (`tools/site.py`, base e cartella della lingua). Il testo copiato usa già l'indirizzo vero della pagina.
- `<meta name="text-scale">`: come la home, non messa.

**Stati, errori e recupero**
- Domande: tastiera (frecce fra le domande? oggi Tab e Invio), annuncio della risposta (regione `aria-live` e `#annuncio`: da provare con
  Orca e NVDA), fuoco quando al telefono la bolla si sposta sotto un'altra domanda; ridimensionamento fra telefono e computer con una
  risposta aperta (la bolla si sposta: provato solo nel codice).
- Varco: scorrimento veloce e ritorno in su (il passo e i file che scendono), salto con l'ancora «Se devi controllare», scheda in secondo
  piano durante la discesa.
- Catena: scorrimento veloce (le tappe in fila possono restare indietro: a 570 px/s tutte accese dopo circa 4 s), ritorno, ricarica a metà
  pagina, salto con il fuoco (la cornice rivela il tratto; la coda accende le tappe prima).
- Copia: Firefox e WebKit; annuncio per i lettori di schermo; la risposta resta finché non si ripreme (come «non ancora»).

**Larghezze, lingue e motori**
- Guardate: 1440×900, 390×844, 1366×640, 390×667, 844×390. Da guardare: 761-1180 (catena a una colonna sotto i 1180, domande a due colonne,
  varco medio a 400 px), i 15 dispositivi, testo grande e zoom.
- Pseudo-lingue: in en-XA al telefono l'etichetta di «Tu» nel primo schermo si taglia (va misurata come in `componenti.js`, «nome-corto»);
  in en-XA a 1440 il titolo va su sei righe e spinge giù la scena: da guardare con la regola del primo schermo.
- Firefox e WebKit (solo Chromium senza finestra qui).

## Non verificato

- Firefox, WebKit, telefoni veri, lettori di schermo, testo grande e zoom; le larghezze di mezzo.
- Le frasi del programma segnate [I] in `progetto.md` e riportate in `CONTENUTI.md` («non lascia un servizio acceso»): i pacchetti non hanno
  un avvio automatico (verificato), il resto no.
- I tempi delle sequenze sono di una macchina carica (fotogrammi scattati in ritardo, fino a 1,1 s): il ritmo va guardato nei video.
