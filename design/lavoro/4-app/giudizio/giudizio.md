# Giudizio della direzione «La frase che si accende» — finestra di Kalliope

Giudice: design-system-generator, ruolo di giudizio (non ho reso né costruito la direzione). 26/11/2026, ~19:15–20:20.
Metodo: `references/giudizio.md`, `direzione.md` §5. Ho provato la finestra da me prima di leggere le note dell'autore: binario
`materiali-locali/target-direzione/release/kalliope`, Xvfb mio `:155` (mai `:0` né Wayland), portale finto per il tema, mouse e tastiera con
xdotool, video con ffmpeg x11grab, misure con `movimento-visibile.mjs`. Chrome MCP non si applica a una finestra Slint: lo dichiaro.
Le mie prove stanno in `giudizio/run1/`, `giudizio/run2/` (una cartella per prova), fogli in `giudizio/foto/`, coppie in `giudizio/coppie/`,
misure in `giudizio/misure/`, script in `giudizio/strumenti/`.

## Verdetto in due frasi

La direzione ha un'identità vera e riconoscibile, la stessa del sito, e fa una cosa che nessun riferimento fa (dire «nessuno ti sente»
con la bolla che si scalda). Però non risolve ancora per intero il motivo per cui il proprietario ha respinto la 0.2: la scrittura resta
una fascia fissa di 200 px che non cresce con la finestra. In più, chi usa solo la tastiera non può scegliere la voce, cioè proprio la voce
propria che la direzione insegna a creare.

## Problemi, prima i più gravi

### Bloccanti

**B1. La scrittura non cresce con la finestra ed è più piccola della conversazione.** Il proprietario ha respinto la 0.2 per «la finestra
di scrittura è minuscola».
- **Prove.**
  - `run2/big-cronologia/root.png`: a 1600 × 1000 la casella è ancora alta 200 px (y 776–975), cioè il 20% dell'altezza. Il terzo superiore
    è vuoto e la metà destra pure.
  - `run1/d-cronologia/foto.png`: a 920 × 640 sopra ci sono 344 px di conversazione, sotto 200 px di scrittura (3 righe a 30 px).
  - `foto/minima.png`: a 360 × 320 resta una riga sola, tagliata («Scrivi. Invio la», e la seconda riga sparisce sotto «Di'»).
  - Il catalogo dichiara `scrittura-altezza · 200px … (cresce con la finestra)` (`foto/catalogo-b.png`), ma a 1600 × 1000 non cresce:
    il token promette una cosa che la finestra non fa.
- **Accanto ai riferimenti.** In Kalipso (`coppie/kalliope-kalipso-ab.jpg` e `-ba.jpg`) e in Proloquo4Text (`coppie/kalliope-p4t-ab.jpg` e
  `-ba.jpg`) la superficie di scrittura è la finestra. Qui è una fascia in fondo. La differenza resta uguale nei due versi.
- **Per chi.** Chi scrive in riunione e chi ha poca energia: vedono poche righe di ciò che scrivono, e a finestra intera lo spazio va
  sprecato.
- **Correzione.** La scrittura prende l'altezza che resta, almeno 3 righe e senza un massimo fisso. La conversazione si riduce alla
  frase detta più una cronologia che scorre. Sotto una certa altezza si passa da soli all'impianto compatto.

**B2. Con la sola tastiera la voce non si sceglie, e la nota dell'autore dice il contrario.**
- **Prove.**
  - `run2/d-menu-tastiera/sheet.png`: Spazio apre il menu. ↓ lo chiude, un altro ↓ lo riapre. Non si evidenzia mai una voce. Invio chiude
    il menu senza scegliere (resta «Giulia»). Esc non fa nulla.
  - `run2/d-comandi/2-menu-esc.png`: aperto con il mouse, Esc non lo chiude. Si chiude solo cliccando altrove, e quel clic va perso
    (il primo clic su A+ ha solo chiuso il menu, `3-a-piu-1.png`).
  - `direzione.md`, «I ripieghi», dice invece «il menu della voce si apre con Invio o ↓ e si chiude con Esc».
- **Per chi.** Chi ha la SLA e usa solo la tastiera non può passare a Marco né alla «voce di Anna», cioè alla voce propria appena creata.
- **Correzione.** Il menu diventa un elenco navigabile: ↑ e ↓ spostano l'evidenziazione, Invio e Spazio scelgono, Esc chiude e riporta
  il fuoco sul pulsante. Il fuoco entra nel menu quando si apre.

### Importanti

**I1. La frase detta adesso, cuore dell'idea, finisce tagliata.**
- **Prove.**
  - `run2/d-tab/z7.png`: dopo Tab sulla cronologia la lista scorre in cima. La bolla perde gli angoli e l'ombra in basso e si appoggia
    sulla riga di stato. Resta così anche quando il fuoco torna alla scrittura.
  - `run2/d-grande/foto.png`: a 150% la bolla entra sotto la barra e perde il bordo superiore.
  - `run2/d-menu-grande/menu.png`: a 175% la prima riga della frase è tagliata a metà.
  - `foto/minima.png`, primo riquadro: a 360 × 320 della bolla resta una striscia.
- **Accanto al riferimento.** Kalipso a 200% taglia anche lui (`coppie/grande-kalipso-ab.jpg` e `-ba.jpg`), quindi qui il confronto regge
  a 150%. A 175% non regge più.
- **Correzione.** La bolla corrente sta fuori dalla lista che scorre, sempre intera fra la cronologia e lo stato. La cronologia scorre
  sopra di lei.

**I2. Quando cambia la grandezza del testo, i comandi si spostano sotto il puntatore.**
- **Prove.**
  - `run2/d-comandi/4-a-piu-2.png`: a 150% spariscono dalla barra «Kalliope», «100%», «Crea la tua voce» e «Informazioni», e A+ si sposta.
  - `run2/d-menu-grande/menu.png`: a 175% spariscono anche A− e A+.
  - `run2/d-comandi/5-informazioni.png`: il mio clic nel punto dove prima c'era «Informazioni» ha aperto la modalità riunione.
  - La misura (`misure/d-movimenti`, tratto 5) dice cambio istantaneo, 37% dello schermo.
- **Per chi.** Il principiante distratto che preme A+ due volte apre il menu della voce o la riunione. Chi ha poca vista non ritrova più
  A−, quindi non sa come tornare indietro.
- **Correzione.** A− e A+ restano allo stesso posto a ogni grandezza. Ciò che non ci sta va in un menu «…» suo, non nel menu della voce.

**I3. La modalità riunione perde l'idea.**
- **Prove.**
  - `run2/d-compatta-parla/foto.png`: mentre la voce parla non si vede che cosa dice, perché non c'è bolla né parole che si scuriscono.
    Lo stato è troncato («Esc la …»).
  - `run2/d-riunione/1-compatta.png`: «Nella riunione…» è troncato.
  - `run2/d-comandi/5-informazioni.png`: a 150% il segnaposto è tagliato («dice» a metà) e si vede una riga e mezza.
- **Per chi.** È la superficie dichiarata dall'ambizione («Dove: … la modalità riunione 400 × 320») e quella che usa chi è in riunione dal
  vivo: proprio lì la frase non «si accende».
- **Correzione.** Una riga di bolla con la frase corrente che si scurisce, sopra la scrittura. Lo stato in una parola. Il consiglio
  «Alt+Spazio» si chiude con «Ho capito» e non torna.

**I4. Il gesto principale salta invece di collegare.**
- **Prove.**
  - `run2/d-scrivi/fot/invio-tile.png`: a Invio la casella si svuota di colpo. Tutta la cronologia sale di una riga in un fotogramma e la
    frase di prima rimpicciolisce di colpo (`misure/d-scrivi-storia`: 166 ms, 100% «salta di colpo», ogni punto in 0 ms). Per un
    fotogramma il posto della bolla resta vuoto, poi la bolla nuova cresce dal nulla. La frase non si vede andare dalla bolla tratteggiata
    a quella piena.
- **Accanto al riferimento.** Nella home del sito lo stesso passaggio dura 2232 ms ed è al 61% «coperto o spostato»
  (`riferimenti/video/kalliope-demo-home-mv/misure.json`, tratto 3). Le parole che si scuriscono invece reggono:
  `misure/d-scrivi-parole` (2266 ms, sfuma e copre progressivamente) contro i 6085 ms del sito, con sfumatura al 71%.
- **Correzione.** Proposta, da decidere al proprietario sul video: la cronologia scorre in su di una riga in 300–500 ms e la frase passa
  dalla scrittura alla bolla.

**I5. La finestra più piccola, 360 × 320, non regge la scrittura.**
- **Prove.**
  - `foto/minima.png`: il segnaposto è tagliato a metà parola, «Di'» e «Ferma» stanno sopra la seconda riga, e con un avviso il bordo
    inferiore della casella esce dalla finestra.
  - `foto/minima-scroll.png`: «Basta così: premi di nuovo per fe…» è tagliato a destra.
  - Il flusso della voce invece scorre con la rotella e segue il fuoco del Tab (`foto/minima-scroll.png`): lì va bene.
  - La modalità riunione a 400 × 320 mostra 3 righe (`run2/d-riunione/1-compatta.png`). La modalità normale a 360 × 320 sta peggio della
    compatta, che ha quasi la stessa misura.
- **Correzione.** Sotto una certa altezza la finestra usa l'impianto compatto. Il testo di stato va a capo invece di finire tagliato.

**I6. Due stati non dicono la verità alla casella di scrittura.**
- **Prove.**
  - `foto/stati-scuro.png`, «La voce non parte»: la casella dice ancora «Scrivi qui. Invio la dice.» e la bolla vuota promette «Qui la
    voce dirà le tue frasi». La riga di stato dice «Reinstalla Kalliope dal pacchetto» ma non dà un comando per farlo.
  - «Preparo la voce»: anche qui la casella promette «Invio la dice».
- **Per chi.** Il principiante distratto non legge la riga di stato e scrive. Chi aiuta e non è tecnico non sa che cosa fare.
- **Correzione.** Il segnaposto segue lo stato («La voce non parte: guarda qui sopra»), e accanto al problema c'è un comando «Come si
  risolve».

**I7. Tratto di default senza un vincitore che lo giustifichi: due schede uguali, mezze vuote, per scegliere come creare la voce.**
- **Prove.**
  - `foto/voce.png`, primo riquadro: due riquadri di 300 px con due righe di testo e un'icona di 20 px. ElevenLabs usa un elenco
    (`coppie/voce-elevenlabs-ab.jpg` e `-ba.jpg`), Apple un flusso solo (`coppie/voce-apple-ab.jpg` e `-ba.jpg`).
  - Al passo 2 non si vede quanto manca ai dodici secondi: il tondo non si riempie e c'è solo «10,3 s». Apple mostra «1 of 150».
- **Correzione.** Una scelta con gerarchia: «Registra adesso» grande, «Usa una registrazione» come seconda strada. Il tondo dello stop si
  riempie fino a 12 s.

### Minori

- **Pulsante spento nel tema chiaro.** «Di' Invio» spento ha il testo bianco su `#A3C6BB`, circa 1,8:1 come è reso: l'etichetta quasi
  non si legge (`run2/l-cronologia/foto.png`, pixel campionati). La cronologia chiara invece è leggibile (`#5D6262` su `#E5E9E8`).
- **Il colore di Giulia è lo stesso dell'allarme.** Il pallino di Giulia (`--app-tinta-voce-1 #c99078`) e l'avviso
  (`--app-attenzione #8f4f36`) vengono dalla stessa tinta di Paola. Nel tema chiaro la voce in uso ha il colore di «la voce non arriva»
  (`run2/l-nessuno/foto.png`, `run2/l-cronologia/foto.png`).
- **Il bordo alto della cronologia.** La frase più vecchia è tagliata dalla barra con un taglio netto, senza sfumatura: sembra una
  sovrapposizione (`run1/demo-default-root.png`).
- **La riga puntinata del passo 3.** Al passo 3, fra «Ascolta la registrazione» e «Rifai», c'è una riga di punti che non dice che cosa
  sia (`foto/voce.png`).
- **L'ingresso nel flusso della voce.** È una dissolvenza incrociata da 166 ms in cui per circa 100 ms le due schermate si leggono una
  sopra l'altra (`misure/d-movimenti/tratto-1.jpg`).

## La scheda

### A. L'idea

| Voce | Risposta | Prova |
|---|---|---|
| A1 | La finestra è la bolla del logo: si scrive nel tratteggio (il non ancora detto) e la frase si scurisce nella bolla piena. | `run2/d-scrivi/sheet.png` |
| A2 | Il momento che resta: le parole che si scuriscono con l'anello verde acqua, e l'anello che diventa caldo quando nessuno sente. | `run2/d-scrivi/sheet.png`, `foto/stati-scuro.png` |
| A3 | Che cos'è: sì (bolla e scrittura). Per chi: in parte (lo dice la riga «Nella riunione scegli Kalliope come microfono»). Che cosa fare dopo: sì, «Scrivi qui. Invio la dice.» | `run1/d-cronologia/foto.png` |
| A4 | Sì: coprendo nome e logo resta la bolla tratteggiata del logo, cioè il segno del sito. | `coppie/kalliope-sito-ba.jpg` |
| A5 | Sì: la finestra stessa è il prodotto al lavoro. | — |

### B. Estetica (alla misura d'apertura; alle altre misure vedi i problemi)

| Voce | Risposta | Prova |
|---|---|---|
| B1 si coglie a colpo d'occhio | Sì | `run1/d-cronologia/foto.png` |
| B2 tutto sta insieme | Sì, stesso mondo del sito | `coppie/kalliope-sito-ab.jpg` e `-ba.jpg` |
| B3 non troppo fitta | Sì; a finestra intera, anzi, è vuota | `run2/big-cronologia/root.png` |
| B4 struttura chiara | Sì a 920 × 640; no a 150%+ e a 360 × 320 | `run2/d-grande/foto.png`, `foto/minima.png` |
| B5 inventiva | Sì: il tratteggio come stato del testo | — |
| B6 ritmo | In parte: la colonna è sempre la stessa; il ritmo sta solo nel movimento delle parole | — |
| B7 non piatta | In parte: il fondo grafite è piatto rispetto agli anelli e al bagliore del sito | `coppie/kalliope-sito-ba.jpg` |
| B8 viva | Sì mentre parla (bagliore, barre); ferma è quieta | `run2/d-scrivi/sheet.png` |
| B9–B11 colore | Sì, con un ruolo per colore: verde acqua azione e voce, caldo avviso, rosa solo marchio e «registra». Una collisione: il pallino di Giulia ha la tinta dell'avviso | `foto/catalogo-a.png` |
| B12 professionale | Sì nel tema scuro; il chiaro è più slavato | `run2/l-cronologia/foto.png` |
| B13 attuale | Sì | — |
| B14 cura del dettaglio | In parte: bolla tagliata, testi troncati, schede mezze vuote | I1, I3, I7 |
| B15 concetto | Sì | — |

### C. Esperienza d'uso

| Voce | Risposta | Prova |
|---|---|---|
| C1 dove si è | Sì | — |
| C2 prossima azione | Sì: la scrittura ha il fuoco all'avvio, Invio dice | `run2/d-scrivi/1-scritto.png` |
| C3 stati | Sì per pronta, parla, nessuno, microfono, problema, prepara. No per la casella in «problema» e «prepara» | I6 |
| C4 invoglia | Sì | — |
| C5 mai visto nel genere | Sì: «Nessuno ti sente» e «Manca il microfono» (0/11 nei riferimenti) | `foto/stati-scuro.png` |
| C6 convenzioni | In parte: il menu a tendina non risponde come un menu da tastiera | B2 |
| C7 contenuto | Sì | — |
| C7 struttura | Sì a 920; no a 150% e oltre e a 360 | — |
| C7 aspetto | Sì | — |
| C7 funzionamento | In parte | B2, I2, I5 |
| C7 interattività | Sì | — |
| C7 innovazione | Sì | — |
| C7 complessiva | Buona alla misura d'apertura, fragile ai margini | — |

### D. Movimento (misure mie, `giudizio/misure/`)

| Voce | Risposta e misura | Accanto al riferimento |
|---|---|---|
| D1 all'arrivo | Niente si muove con il motore pronto (la scena demo parte posata) | — |
| D2 risposte | Le parole si scuriscono: 2266 ms nella zona della bolla. Fine della frase: 500 ms, sfuma 24% e copre 39%. Menu della voce: entra in 200 ms, esce in 167 ms, sfuma 55% e 53%. Flusso della voce: entra in 166 ms, esce in 233 ms, sfuma 54% e 60%. Testo più grande e riunione: un fotogramma | Sito: parole 6085 ms (sfuma 71%), fine frase 801 ms. Cboard, cartella: 383 ms, 92% a salto |
| D3 scopo | Le parole mostrano dove arriva la voce. Il bagliore dice «sta parlando» o «nessuno sente». Menu e pannelli collegano due stati | — |
| D4 prova della rimozione | Le parole: si perderebbe un significato, quindi restano. Il menu: si perderebbe solo bellezza, può restare. La cronologia a Invio: oggi è già un salto, e nel salto si perde il legame fra scrittura e bolla | I4 |
| D5 qualità | La bolla nuova cresce bene. Il passaggio della cronologia è meccanico (100% a salto) | `misure/d-scrivi-storia` contro il sito, tratto 3 (2232 ms, 61% spostato) |
| D6 momento memorabile | Sì: le parole che si scuriscono con l'anello | — |
| D7 stessa lingua | Sì: tratteggio, bolla e Lexend tondo | — |
| D8 entrate e uscite | Menu e flusso: le uscite sfumano e sono un po' più brevi, come vuole la convenzione. Riunione e testo: salti, dichiarati | — |
| D9 input | Mouse e tastiera ci sono quasi ovunque. Il menu della voce funziona solo con il mouse | B2 |

Un «sì» sulle voci di movimento vale solo con queste misure. La sensazione a velocità vera la giudica il proprietario sui video qui sotto.

### E. Stile di default

- **Pulsanti a pillola.** Giustificati: il sito ha le stesse pillole, «Scarica e installa» e «Ascolta Giulia»
  (`riferimenti/foto/kal-01-home-scuro.png`).
- **Accento caldo `#8f4f36` nel tema chiaro** (segnalato da `controlla-valori.txt`). Viene dalla tinta di Paola approvata il 26/11
  (`#655147`) ed è usato solo per gli avvisi: ha una fonte e un ruolo, quindi non è un difetto. Il problema è la collisione con il pallino
  di Giulia (vedi i minori).
- **Lexend.** Viene dal sito: giustificato.
- **Griglia di schede uguali** nel passo 1 della voce: nessun vincitore lo giustifica (I7).
- **Non compaiono** gradienti viola, crema con grazie, etichette 01/02/03 o monospazio maiuscolo.

## Le coppie (ognuna nei due versi)

| Coppia | Estetica | Esperienza | Movimento | Le risposte cambiano scambiando? |
|---|---|---|---|---|
| Finestra – Proloquo4Text Mac (`coppie/kalliope-p4t-ab.jpg`, `-ba.jpg`) | Meglio: P4T è macOS generico, con il testo a 13 px | Non regge sulla superficie di scrittura: in P4T è quasi tutta la finestra | P4T: foto ferme, non confrontabile | No |
| Finestra chiara – Kalipso (`coppie/kalliope-kalipso-ab.jpg`, `-ba.jpg`) | Più carattere (bolla, tratteggio). Barra più pesante: quattro pillole contro le icone quiete di Kalipso | Non regge: in Kalipso il testo è la finestra; qui la scrittura sta in fondo | — | No |
| Mentre parla – Kalipso gobbo (`coppie/parla-kalipso-ab.jpg`, `-ba.jpg`) | Regge, è meglio: stessa meccanica (parole che cambiano tono) con più identità e lo stato vero | Regge | Non misurabile su Kalipso (foto) | No |
| Testo grande – Kalipso 200% (`coppie/grande-kalipso-ab.jpg`, `-ba.jpg`) | Regge a 150% | Tagliano tutti e due; Kalliope in più toglie comandi dalla barra | — | No |
| Voce, passo 2 – Apple Personal Voice (`coppie/voce-apple-ab.jpg`, `-ba.jpg`) | Regge: stesso impianto (frase grande, livello, stop rosso) nell'identità di Kalliope | Non regge sul progresso: niente «quanto manca» | — | No |
| Voce, passo 1 – ElevenLabs IVC (`coppie/voce-elevenlabs-ab.jpg`, `-ba.jpg`) | Meglio come calore; schede mezze vuote | Meglio: meno campi, consenso in parole semplici | — | No |
| Finestra – sito (`coppie/kalliope-sito-ab.jpg`, `-ba.jpg`) | Stessa famiglia, senza essere una copia: impianto diverso (strumento contro vetrina). Più piatta del sito | — | Il passaggio della bolla del sito non c'è (I4) | No |

Nessuna risposta cambia scambiando le posizioni. Non è un ricolorato: impianto e funzione sono propri, mentre colori e forme vengono dal
sito, che è l'identità voluta dal proprietario.

**Fra i vincitori.** Starebbe al suo posto nel tema scuro alla misura d'apertura: ha un'identità più forte di Proloquo4Text e di Kalipso.
- **Goffo:** la scrittura che non cresce, le schede vuote del passo 1, la barra che perde comandi.
- **Generico:** il passo 1 della voce.
- **Sbilanciato:** a finestra intera tutto sta a sinistra in basso.
- **Ciò che gli altri non hanno:** lo stato «nessuno ti sente» dentro la bolla, e la voce propria creata nella stessa finestra.

## Il catalogo vivo e i valori

- `kalliope --catalogo` si apre (1196 × 832) e scorre. Mostra token scuri e chiari affiancati, ognuno con la sua fonte («visione», «fonte»
  o «scelta»), la scala del testo, spazi e raggi, le durate con «Rivedi tutte le durate», e i componenti in tutti gli stati: pulsante
  pieno, quieto e nudo in riposo, sopra, premuto, fuoco e spento; i sette stati veri; la scrittura; le tinte delle voci; i passi della voce
  propria; il consenso (`foto/catalogo-a.png`, `foto/catalogo-b.png`).
- È completo per ciò che la finestra usa.
- Un'affermazione falsa: `scrittura-altezza … cresce con la finestra` (B1).
- `controlla-valori.txt`: 64 colori e 1 carattere, tutti con una fonte, nessuno senza fonte; un tratto di default segnalato (`#8f4f36`,
  sopra).

## L'ambizione e il metro di Kalipso

**L'ambizione è raggiunta in parte.**
- Alla misura d'apertura la finestra mostra dove sta la frase e se qualcuno la sente, cosa che nessun riferimento fa
  (`foto/stati-scuro.png`).
- Nella modalità riunione, uno dei due «Dove» dichiarati, la frase non si vede (I3).
- Il momento «a Invio la frase nasce nella bolla» è un salto della cronologia più una crescita dal nulla (I4).

**Il metro di Kalipso non è ancora raggiunto.**
- Kalipso è più avanti dove il proprietario guarda per primo: la scrittura è la finestra (B1), la barra è quieta e ferma, i comandi non si
  spostano (I2).
- La direzione è più avanti di Kalipso per identità, per la verità sugli stati e per il movimento delle parole.
- Corretti B1, B2 e I1–I3, può superarlo.

**Ordine dal più forte al più debole, per questo lavoro (scrivere e farsi sentire in riunione):**
1. Kalipso: la scrittura è protagonista ed è solido.
2. La direzione: l'identità e gli stati più forti di tutti, ma la scrittura è sacrificata e i margini sono fragili.
3. Proloquo4Text Mac: funzionale ma anonimo.

Per creare la voce:
1. Apple Personal Voice: chiaro sul progresso.
2. La direzione: calda, ma senza progresso e con il passo 1 debole.
3. ElevenLabs: un modulo.

## Dove le note dell'autore dicono più di quanto ho visto

- «Il menu della voce si apre con Invio o ↓ e si chiude con Esc»: con la tastiera ↓ apre e chiude, Esc non chiude e Invio non sceglie
  (B2).
- `scrittura-altezza` «cresce con la finestra»: a 1600 × 1000 non cresce (B1).
- «Invio → la frase nasce … sfuma 56%»: la misura dell'autore prende tutto il tratto insieme. Se si guarda la sola cronologia, il
  passaggio è al 100% a salto (I4).
- Il «testo grande» dichiara come unico limite 150% a 360 × 320. In realtà già a 150% e 920 × 640 la bolla finisce sotto la barra e la
  barra perde due comandi (I1, I2).
- Le debolezze dichiarate («molto vuoto in cima», «frase lunga una riga sola alla misura minima») sono vere, ma l'autore le presenta come
  minori: per il proprietario sono il motivo della prima bocciatura.

## Che cosa non ho verificato

- Il motore vero: non l'ho avviato (le foto `01…07-vero-*` sono dell'autore).
- L'audio: non l'ho sentito.
- I comandi «Usa una registrazione» e «Crea la voce» (l'autore dice che non sono collegati), e il movimento ridotto (non segue il sistema).
- Il Tab dentro il catalogo e le larghezze intermedie fra 360 e 920, tranne 400 × 320.
- Le misure vengono da Xvfb con disegno in software, su una macchina condivisa: fotogrammi persi e scatti si confermano sullo schermo del
  proprietario.

## Riassunto per il proprietario

### Problemi

- **Bloccante: la scrittura è ancora piccola.** È una fascia fissa di 200 px in fondo. Non cresce se si ingrandisce la finestra (a
  schermo intero è un quinto dell'altezza) e nella finestra più piccola resta una riga tagliata. Il catalogo dice che cresce, ma non è
  vero.
- **Bloccante: con la sola tastiera non si sceglie la voce.** Il menu si apre ma le frecce lo chiudono, Esc non lo chiude e Invio non
  sceglie. Chi usa solo la tastiera non può passare alla voce propria.
- **Importante: la frase detta finisce tagliata.** Succede con il testo grande, dopo aver usato Tab sulla cronologia e nella finestra più
  piccola.
- **Importante: i comandi si spostano con A+.** Premendo A+ i pulsanti cambiano posto e alcuni spariscono (anche A− a 175%). Il
  secondo clic finisce su un altro comando.
- **Importante: in modalità riunione non si vede che cosa sta dicendo la voce.** Lo stato è troncato e a testo grande la scrittura è
  tagliata.
- **Importante: a Invio la cronologia salta.** Sale di colpo invece di scorrere, e la frase non si vede passare dalla scrittura alla
  bolla.
- **Importante: due stati mentono.** Con «La voce non parte» la casella dice ancora «Invio la dice», e non c'è un comando per risolvere.
- **Importante: la scelta di come creare la voce è debole.** Sono due riquadri uguali e mezzi vuoti, e mentre si registra non si vede
  quanto manca ai 12 secondi.

### Che cosa funziona

- La finestra è chiaramente Kalliope: stessi colori, carattere e bolla del sito, più il tratteggio del logo attorno a ciò che si scrive.
- Le parole che si scuriscono mentre la voce parla, con l'anello verde acqua.
- «Nessuno ti sente» e «Manca il microfono» con la bolla che si scalda: nessun altro programma lo fa.
- La voce propria si crea nella stessa finestra, in tre passi.
- Il catalogo è completo e ogni colore ha la sua fonte.

### Accanto ai riferimenti

- Più bella e più viva di Proloquo4Text e di Kalipso nel tema scuro.
- Ma Kalipso e Proloquo4Text danno alla scrittura tutta la finestra, e questa no.

### Movimenti da guardare a velocità vera

- **Invio e parole che si scuriscono**
  - Video: `giudizio/run2/d-scrivi/scrivi.mp4`, da circa 2,9 s.
  - Misura: cronologia 166 ms, tutta a salto; parole 2266 ms, progressive.
  - Sito: cambio di bolla 2232 ms (61% spostato), parole 6085 ms (sfuma 71%).
- **Fine della frase**
  - Video: lo stesso, a circa 6,2 s.
  - Misura: 500 ms.
  - Sito: 801 ms.
- **Crea la tua voce, entrata e uscita, e menu della voce, apertura e chiusura**
  - Video: `giudizio/run2/d-movimenti/movimenti.mp4`.
  - Misura: voce 166 ms e 233 ms; menu 200 ms e 167 ms; tutti sfumano.
  - Cboard, cartella: 383 ms, a salto.
- **Riunione e testo più grande**
  - Video: `giudizio/run2/d-riunione/riunione.mp4` e lo stesso `movimenti.mp4`, a circa 8,4 s.
  - Misura: un fotogramma, a salto. È voluto dall'autore.
  - Riferimento: Cboard a salto.
