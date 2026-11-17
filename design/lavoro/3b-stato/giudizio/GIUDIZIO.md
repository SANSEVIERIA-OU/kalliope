# Giudizio della pagina «stato» (incarico 3b-g)

Giudice: design-judge (opus), che non ha reso né costruito la pagina. Pagina al commit `b456308`, costruita da una copia del
commit (`/tmp/lavoro-3bg-radice`, sito in `/tmp/lavoro-3bg-sito`, servito sulle porte 8880–8883 solo durante le prove).
Guardata prima di leggere le note di chi l'ha resa. Foto, sequenze e misure del giudice stanno in `/tmp/lavoro-3bg-*` (fuori
dal repository, come le altre foto di `design/lavoro/`); il percorso è scritto accanto a ogni prova.

*Scritto mentre guardavo: i problemi prima, la scheda dopo; le note di chi ha reso lette solo alla fine (ultima parte).*

## Problemi, per gravità

Nessun problema **bloccante**: la pagina non inventa funzioni, date o promesse; la voce di chi usa Kalliope è detta «oggi no»;
per il telefono dice «solo per il computer»; il primo schermo della home e quello di «non ancora» sono identici a prima
(`confronta-scelta.mjs` fra `13547e7` e `b456308`: home uguale su 62 cose a 1440 e 55 a 390, i pixel diversi sono la bolla che si
muove; «non ancora» 0%; anche dopo aver scorso e su 1366×640 e 844×390; `/tmp/lavoro-3bg-scelta/`); nessuno scorrimento di lato
né errori alle due misure, in Chromium e in Firefox.

### Importanti

**I1. La strada si accende in fila e fa aspettare chi legge.** Le sei tappe della catena si accendono una dopo l'altra, circa
580 ms ciascuna, e prima stanno al 40% di opacità (titolo, cifra, testo, fonti). Chi arriva direttamente a metà strada (scorre
veloce, torna indietro, ricarica a metà pagina, cerca una parola, Pag giù) legge la tappa che ha davanti spenta: misurato a 1440
saltando al «Microfono «Kalliope»», la tappa comincia ad accendersi dopo 2,1 s e si legge piena dopo 2,6 s (le tre sopra, già
fuori dallo schermo, si accendono prima di lei). Prove: `/tmp/lavoro-3bg-strumenti/accende.mjs` (uscita nel testo di questo
giudizio, sotto «Movimento»); la tappa spenta nelle foto `/tmp/lavoro-3bg-schermi/ff-1440/s03-y1530.png` (Firefox) e
`/tmp/lavoro-3bg-misure/catena-1920.png` (1920, 2 s dopo l'arrivo). È movimento che ostacola la lettura, contro «mai fine a sé
stesso». **Correzione:** la tappa che sta nello schermo si legge subito; l'accensione in fila resta, se serve, solo come
cascata breve per ciò che entra dal basso, non come coda che parte dalla prima tappa.

**I2. La risposta lampeggia a ogni domanda.** Premendo una domanda (computer), il testo vecchio sfuma via in 150 ms, poi il
testo nuovo compare **pieno** per circa 150 ms, sparisce di colpo e solo allora sfuma dentro (misurato campionando
l'opacità a ogni fotogramma: 1 da 382 a 530 ms dopo il clic, poi 0,04, poi 1 a 829 ms). Si vede come un doppio battito, nel
gesto principale del tratto a cui il primo schermo manda chi valuta per un altro (P3). Prove: `/tmp/lavoro-3bg-strumenti/sonda-domanda.mjs`;
fotogrammi `/tmp/lavoro-3bg-seq/domanda/fotogrammi/domanda-costa-1440x900-f02.jpg` (pieno a 0,13 s) e `-f04.jpg` (sbiadito a
0,38 s). **Correzione:** la risposta nuova compare una volta sola, con la sua dissolvenza (la causa è l'arrivo che aspetta senza
tenere il suo stato iniziale durante l'attesa).

**I3. Se lo script della cornice non arriva, spariscono titoli e messaggi.** Con `cornice.js` che non si carica (rete, filtro,
browser vecchio che non lo legge) restano invisibili i titoli dei quattro tratti, la frase riscritta della catena, la bolla della
risposta e la bolla del messaggio da inoltrare: «Copia il messaggio» resta sotto una bolla vuota; e la barra resta trasparente
sul tratto chiaro, con «Kalliope» e «Menu» quasi illeggibili. La rete di sicurezza della pagina (dopo 4 s toglie lo stato «con
script») guarda solo lo script della pagina, non quello della cornice che fa comparire quei pezzi. Succede uguale in «non ancora»
(già approvata): è della cornice. Prove: `/tmp/lavoro-3bg-manca/mont-390.png` (quattro schermi senza `cornice.js`),
`/tmp/lavoro-3bg-strumenti/manca-na.mjs` (elenco dei pezzi nascosti in tutte e due le pagine). Senza JavaScript, invece, tutto
si vede (`/tmp/lavoro-3bg-schermi/nojs-1440/mont.png`). **Correzione:** nella cornice, per tutte le pagine: ciò che entra con un
movimento si vede comunque se lo script che lo fa entrare non gira.

**I4. Al telefono la pagina è lunga e fitta proprio per chi legge dal telefono.** A 390 la pagina è 9 674 px: la catena 3 543 px
(15 px in una colonna di 254 px, circa 34 caratteri per riga, due paragrafi per tappa) e «Il testo non esce dal computer» 3 527 px
(il computer fermo in alto prende il 36% dello schermo, i passi scorrono sotto di lui con vuoti chiari in mezzo). Chi valuta per
un altro (P3, `progetto.md` §4.1: «spesso leggono dal telefono») trova le domande con un tocco, ma per arrivare a «Da mandare a
chi ti aiuta», il suo gesto finale, attraversa poi circa quattro schermi di fatti per chi controlla. `progetto.md` §4.2 chiede
«un'idea per volta; il "lungo" solo a richiesta». Prove: `/tmp/lavoro-3bg-schermi/stato-390/mont-1.png` … `mont-4.png`, misure
dei tratti a 390 e 1440 (scena 958/812, catena 3 543/2 588, domande 1 490/1 426, controllare 3 527/2 651, inoltra 812/808 px).
**Correzione:** al telefono i due tratti lunghi si accorciano (il lungo delle tappe a richiesta o sotto, i passi del computer
senza lo scorrimento vuoto fra l'uno e l'altro), e chi ha letto le domande arriva al messaggio da inoltrare senza attraversare
tutto il tratto per chi controlla.

**I5. Il catalogo non mostra i pezzi nuovi.** I cinque componenti nuovi (la riunione provata, la strada verticale, le domande con
la bolla, il computer con il varco, il messaggio da inoltrare) e i loro stati non sono nel catalogo vivo: il commit non tocca
`design-system/catalogo/`. Il resto del sistema c'è: `controlla-sorgenti.mjs` verde sulla copia del commit («28 fogli di stile,
valori solo nei token»), token e componenti nei file del sistema. Spetta al ruolo di costruzione (com'è stato per «non ancora»),
ma la pagina non arriva al proprietario senza. **Correzione:** i cinque pezzi nel catalogo, con gli stati (domanda scelta,
copia fatta e non riuscita, tappa spenta e accesa, passo del computer) e il ripiego senza script.

**I6. Tre voci che il progetto vuole dette mancano, e l'elenco dei contenuti dice che ci sono.** Letto `progetto.md` (§1.4, §2.2,
§2.3, §4, §7, §9, §10 P3, P7, P9, §12) e cercate sulla pagina, poi confrontate con `CONTENUTI.md`:
- *Che cosa modifica l'installazione e con quali permessi* (`progetto.md` §7 «Cosa si modifica»: nulla fuori dalle sue cartelle;
  `.deb` e `.rpm` con i permessi di amministratore, l'archivio in `~/.local` senza; P7: «cosa si installa e dove»). `CONTENUTI.md`:
  «c'è in breve», nota della terza scena. Sulla pagina non c'è: la terza scena dice solo «la voce scaricata in una cartella
  dell'utente» (cercati «amministra», «local», «~/»: zero).
- *Chi ospita il sito* (§7 «Sito: reti»: GitHub Pages, che registra le richieste come ogni host; P7 «hosting del sito»).
  `CONTENUTI.md`: «c'è», nel piede. Il piede dice solo «Questo sito non usa cookie né statistiche» (cercati «Pages», «host»:
  zero).
- *I limiti noti della voce* (§2.2, README: restano differenze di scrittura, «10 e 30» per «10:30», «ancora» per «àncora»).
  `CONTENUTI.md`: «c'è», nota della tappa del microfono. Sulla pagina non c'è.
Nessuna delle tre ha una decisione del proprietario che la lasci fuori. **Correzione:** le tre voci sulla pagina, nel tratto per chi
controlla e nella tappa del microfono; e `CONTENUTI.md` riallineato a ciò che la pagina dice davvero (vedi anche, sotto, le
differenze minori fra elenco e pagina).

### Minori

**M1. La barra non dice dove si è.** «Stato e limiti» è la pagina corrente (`aria-current`), ma ha lo stesso colore, peso e
sottolineatura delle altre voci (misurato: tutte `rgb(255,237,239)`, peso 500, niente segno). È la prima pagina rifatta che sta
nel menu: il difetto nasce adesso, nella cornice. **Correzione:** un segno della voce corrente, nella barra e nel menu del telefono.

**M2. La coda della bolla delle risposte indica la cosa sbagliata.** Al computer la coda in basso a sinistra non indica niente;
al telefono, con la bolla aperta sotto la domanda premuta, la coda punta in giù alla domanda *dopo* («Quanto costa?» → la coda
indica «Chi lo installa?»). Nella home la coda indica chi parla. Prove: `/tmp/lavoro-3bg-seq/domanda/domanda-costa-390x844-foglio.jpg`.
**Correzione:** la coda verso la domanda a cui risponde, o niente coda.

**M3. La parentesi «Dal tasto Invio al suono nella riunione: non misurato».** A 1440 è una colonna di 200 px con solo una linea
tratteggiata per circa 1 900 px: la scritta sta in cima ed esce dallo schermo mentre si leggono le tappe, poi resta una linea
senza senso accanto a una colonna vuota; e comincia all'altezza di «Si installa», non di «Scrivi la frase», dove c'è l'Invio.
Prove: `/tmp/lavoro-3bg-schermi/stato-1440/s03-y1530.png`, `catena-intera.png`. **Correzione:** la scritta resta in vista
finché c'è la parentesi, e la parentesi va da «Scrivi la frase» a «Gli altri ti sentono».

**M4. Righe a capo male a misure di mezzo.** «alle 10:30» va a capo nel mezzo a 334, 360, 361 e 397 px; la fonte «engine.rs,
benchmarks/engines» esce dalla cornice della tappa a 320 px (`/tmp/lavoro-3bg-misure/fonte-320.png`; esame-impaginazione
sulle 36 misure delle soglie, `/tmp/lavoro-3bg-strumenti/esame-a.log`, `esame-b.log`; il resto pulito, stati compresi).

**M5. L'indirizzo mostrato non è quello copiato.** La bolla mostra «sansevieria-ou.github.io/kalliope/stato/», «Copia il
messaggio» copia l'indirizzo vero della pagina (con la cartella della lingua). Il vecchio indirizzo rimanda, quindi funziona, ma
chi confronta vede due indirizzi diversi. Prova: `/tmp/lavoro-3bg-strumenti/copia.mjs` (testo copiato nell'uscita).

**M6. Al telefono «Copiato…» compare lontano dal pulsante**, sotto «Come si installa», a circa 100 px dal tocco
(`/tmp/lavoro-3bg-gesti/copia-390-quattro.png`).

**M7. Le fonti non si aprono.** Ogni cifra ha il suo file («README», «download.rs, catalog.rs»…), ma come etichetta: chi
controlla (P7, «Posso verificare?») deve cercare il file nel repository da sé. Una scelta per il proprietario: collegarle ai file
della versione pubblicata.

**M8. Il momento più eloquente del tratto chiaro è minuscolo.** Le tre impronte che scendono da huggingface.co nel disco sono
etichette di 8–9 px che passano in circa 1,2 s sopra la scritta «Sul disco» (`/tmp/lavoro-3bg-gesti/varco/mont-1440.png`): quasi
nessuno le vede, e a metà corsa coprono la scritta.

**M9. Il tratto chiaro al computer ha vuoti lunghi.** Quattro passi brevi in 2 651 px: fra un passo e l'altro 250–300 px di rosa
pieno, con la colonna del testo larga 450 px (`/tmp/lavoro-3bg-schermi/stato-1440/s07-y4590.png`, `s08-y5355.png`). Il computer
fermo a destra cambia, quindi il vuoto non è morto, ma la pagina si allunga (7 445 px contro 4 577 della home).

**M10. Righe lunghe nel riquadro «Hai provato Kalliope in una riunione vera?»** a 1440: 760 px, circa 95 caratteri per riga
(`/tmp/lavoro-3bg-schermi/stato-1440/s04-y2295.png`).

**M11. Senza i caratteri del sito** (se non si caricano) l'etichetta «Tu · microfono «Kalliope»» va su due righe sopra le
barre della voce al telefono (`/tmp/lavoro-3bg-manca/senza-caratteri-390-0.png`).

**M12. L'elenco dei contenuti descrive domande che la pagina non ha** («Che cosa serve?», «In che lingua parla?»: le risposte stanno
dentro «È per chi non può parlare?» e «Parla con la sua voce?») e licenze «accanto alla parte della strada in cui lavorano»
(stanno tutte nel blocco «Licenze»). I requisiti minimi (glibc 2.39, Debian 13, Ubuntu 24.04 o più recenti) non sono sulla pagina:
vanno bene nella pagina Installa, ma l'elenco dice «c'è».

## Dove va ciascuna correzione

- **Direzione (rendendo):** I1, I2, I4, I6; M2, M3, M8, M9, M10, M12.
- **Cornice, per tutte le pagine** (insieme alle correzioni della cornice già in corso): I3, M1.
- **Costruzione:** I5; M4, M5, M6, M11; e ciò che la direzione ha già elencato in `PIANO.md`.

## La scheda

### A. L'idea
- **A1** Il confine del provato disegnato sulle cose: la riunione e la strada della voce sono piene fino al microfono e tratteggiate
  dopo; ogni cifra sta nel punto in cui è stata misurata.
- **A2** A 4 s dall'arrivo: «Tu» parla, nella barra dell'app compare «Kalliope · provato fin qui», un'onda tratteggiata parte da «Tu»
  e lascia Luca, Paola e Anna tratteggiati e velati (`/tmp/lavoro-3bg-seq/arrivo/riunione-5-8.png`). Poi, sotto, la cornice del
  computer che finisce al microfono (`/tmp/lavoro-3bg-schermi/stato-1440/catena-intera.png`).
- **A3** Che cos'è: sì (titolo-risposta e presentazione). Per chi: sì (chi valuta e chi controlla, detto nella presentazione e nei
  due comandi). Che cosa fare: sì, «Per chi è, e per chi no» e «Se devi controllare», tutti e due portano al tratto giusto con il
  titolo sotto la barra (provato: 200 px a 1440, 164 px a 390).
- **A4** Sì: la riunione a quattro con la bolla, il bordeaux, il tratteggio; senza il nome è la stessa famiglia della home.
- **A5** In ricostruzione dichiarata («Ricostruzione · …»): la riunione, la finestra di Kalliope nel computer. Nessuna voce da
  ascoltare in questa pagina, giustamente (sta nella home).

### B. Estetica
- **B1** Sì nel primo schermo; in parte sotto: la catena e il tratto chiaro sono fitti di testo piccolo (15–16 px).
- **B2** Sì: stesso mondo della home e di «non ancora» (`/tmp/lavoro-3bg-coppie/primo-1440-stato-home-ba.jpg`, `-nonancora-ab.jpg`).
- **B3** In parte: a sinistra nel primo schermo sei blocchi di testo (titolo, presentazione, due comandi, «Oggi», didascalia);
  al telefono la catena è un muro di testo (I4).
- **B4** Sì: quattro scene, ognuna con un titolo e un oggetto suo (strada, domande, computer, messaggio).
- **B5** Sì: la strada con le cifre al loro posto e la cornice del provato, la quota di un secondo, la riga delle parole con quella
  sbagliata, il computer che cambia con il passo, il messaggio nella bolla.
- **B6** Sì al computer (notte, stanza, chiaro, stanza, notte); al telefono i due tratti lunghi rompono il ritmo.
- **B7** Sì. **B8** Sì: arrivo, tappe, computer, bolle.
- **B9–B11** Sì: un colore solo con il rosa dell'azione per ciò che si preme, il rosa chiaro della bolla per ciò che si dice, il
  tratteggio per ciò che non è provato, la scena chiara per chi controlla.
- **B12** In gran parte; goffi la colonna destra con la sola linea (M3) e le impronte minuscole (M8).
- **B13** Sì. **B14** In parte: M2, M4, M10. **B15** Sì.

### C. Esperienza d'uso
- **C1** Sì dal titolo; la barra non segna la pagina (M1).
- **C2** Sì: due comandi nel primo schermo, domande a un tocco, «Copia il messaggio» in fondo; al telefono il messaggio è lontano (I4).
- **C3** In parte: domande con sopra, premuto e scelta; copia con fatto e non riuscita (provati); ma la risposta lampeggia (I2).
- **C4** Sì. **C5** Sì: le misure sulla strada nel punto in cui sono prese; nessun riferimento lo fa.
- **C6** Sì; le domande sono pillole con un punto (scelta singola) invece della freccia della fisarmonica, e si capiscono.
- **C7** Contenuto: forte, onesto, con fonte (meno I6). Struttura e navigazione: buona al computer, lunga al telefono. Aspetto: forte e
  coerente. Funzionamento: nessun errore, ripieghi buoni senza script e senza i fogli; I2, I3. Interattività: domande, copia,
  computer guidato dallo scorrimento. Innovazione: la strada misurata. Esperienza complessiva: buona, pesante al telefono.

### D. Movimento
- **D1** Arrivo (`/tmp/lavoro-3bg-seq/arrivo/arrivo-1440x900-foglio.jpg`): righe del titolo che salgono (0,25–1 s), testo e
  comandi (1,5 s), la riunione (1,5–2 s), la bolla e «Tu» acceso (3 s), l'onda tratteggiata e i riquadri tratteggiati (4–5 s), poi
  fermo con le barre della voce. Al telefono lo stesso ordine (`arrivo-390x844-foglio.jpg`).
- **D2** Scorrendo: le scene si allargano dai lati, le tappe si accendono, il computer cambia con il passo, le impronte scendono
  (`/tmp/lavoro-3bg-seq/scorri/scorri-1440x900-foglio.jpg`). Puntando: le domande si schiariscono. Premendo: la bolla cambia
  risposta; «Copia» accende l'anello della bolla e scrive l'esito (`/tmp/lavoro-3bg-gesti/copia-1440-tris.png`).
- **D3** Arrivo: raccontare dove finisce la prova. Tappe: mostrare e raccontare l'ordine. Computer: mostrare il fatto mentre lo si
  legge. Domande e copia: rispondere.
- **D4** Senza l'onda si perde il significato (la voce va, oltre non si sa); senza il computer che cambia si perde il fatto; senza
  l'accensione in fila si perde poco e si guadagna lettura (I1); le impronte oggi non le vede nessuno (M8); la dissolvenza delle
  risposte dà solo bellezza ed è guasta (I2).
- **D5** Arrivo naturale, in ordine, con la curva d'uscita della home. Le tappe: coda meccanica di 580 ms l'una (misura, saltando
  al microfono a 1440: prima tappa piena a 0,84 s, seconda 1,43, terza 2,0, il microfono comincia a 2,1 e si legge a 2,6 s).
  Domande: battito doppio (I2).
- **D6** Sì: l'onda tratteggiata che lascia gli altri tratteggiati.
- **D7** Sì: il tratteggio vuol dire «non ancora» nella riunione, sulla strada, nel computer («solo finché la finestra è aperta»).

### E. Stile di default
- **E1** Pulsanti a pillola (comandi, domande, etichette); titoli che entrano tutti allo stesso modo; cifre grandi. Nessun fondo
  crema con grazie e corsivo, nessun viola, nessuna griglia di schede uguali, niente 01 02 03, niente monospazio maiuscolo, niente
  spunte, niente fasce vuote fra sezioni dello stesso fondo.
- **E2** Le pillole: home scelta dal proprietario e R01, R03, R50 (`R/primi-schermi/R01-1440x900.jpg`, `R03-1440x900.jpg`); le
  entrate dei titoli: le stesse della home; le cifre grandi: R04 (scheda della ricerca). Nessun tratto senza giustificazione.

## Il giudizio a coppie (fogli in `/tmp/lavoro-3bg-coppie/`, ognuno nei due versi)

| Coppia | Estetica | Esperienza | Movimento | Cambia scambiando? |
|---|---|---|---|---|
| Primo schermo con R01 (`primo-1440-stato-R01-ab/ba`, `primo-390-…`) | R01 colpisce di più: un'immagine sola, la parola gigante; «stato» regge per colore e mestiere ma è più fitto | «stato» meglio: due comandi chiari; in R01 testo e pulsante poggiano sul busto | «stato» racconta (l'onda); R01 mette in scena l'ingresso, più spettacolare, 12–15 s | No |
| Primo schermo con R03 (`primo-1440-stato-R03-…`) | «stato» meglio: identità propria; R03 è la vetrina generica | pari; R03 mostra persone vere al telefono, «stato» una ricostruzione | «stato» meglio (R03 carica e basta) | No |
| Primo schermo con R05 (`primo-1440-stato-R05-…`) | «stato» meglio | R05 più diretto (lo strumento è il primo schermo); «stato» non ha uno strumento da dare qui | «stato» meglio | No |
| Domande con le FAQ di R05 (`sotto-domande-R05-…`) | «stato» meglio: la risposta detta nella bolla | pari: una risposta alla volta in tutti e due; R05 ha la freccia della convenzione | «stato» guasto dal lampeggio (I2) | No |
| Strada con la fiducia di R03 (`sotto-catena-R03-…`) | «stato» più ricco e vivo; R03 più calmo e arioso | R03 si scorre in un attimo; «stato» chiede lettura | «stato» meglio, salvo la coda (I1) | No |
| Computer con scarico e impronte di R50 (`sotto-controllare-R50-…`) | «stato» meglio | «stato» meglio (fatto e fonte insieme); R50 ha l'avviso dell'antivirus utile e i cookie sopra | «stato» meglio | No |
| Chiusura con R03 (`sotto-chiusura-R03-…`) | «stato» meglio: un'azione sola | «stato» meglio | pari | No |

Le risposte non cambiano scambiando le posizioni: le differenze qui sono grandi. Limite dichiarato: un modello che giudica da solo
sottostima il piacere estetico e sovrastima la facilità d'uso; la parola sull'aspetto resta del proprietario.

**In assoluto.** Fra i vincitori del suo genere starebbe al suo posto, sopra R03, R05 e R50 per identità e invenzione. Stonano: la
densità al telefono, il tratto chiaro lungo con i vuoti, la colonna destra vuota con la sola linea. Ha ciò che gli altri non hanno:
le misure disegnate nel punto della strada in cui sono prese, e il «non ancora» come segno grafico coerente in tutta la pagina.
Non è la copia di un riferimento: impianto e colori vengono dalla home scelta, le peculiarità prese (R04, R50, R51) sono un tratto
ciascuna, dichiarate.

## La pagina intera

- **L'idea tiene fino al piede?** Sì: riunione → strada → domande dette nella bolla → computer → messaggio nella bolla. Non torna la
  vetrina di sezioni impilate: ogni scena ha il suo oggetto e il suo gesto (`/tmp/lavoro-3bg-schermi/tre-pagine-1440.png`).
- **Ogni tratto vivo per un motivo?** Sì, con due eccezioni: l'accensione in fila ostacola la lettura (I1), le impronte sono troppo
  piccole per dire qualcosa (M8). Niente di fermo senza motivo: il riquadro per dire come è andata è fermo e va bene così.
- **Il primo schermo scelto è uguale?** Sì: home e «non ancora» identiche a prima, in cima, dopo aver scorso, su schermi bassi.
- **Schermi bassi:** 1366×640 comando a 464–520 px; 844×390 a 329–385 (stretto ma intero); 360×640 il comando sale sopra la
  riunione (`/tmp/lavoro-3bg-misure/bassi.png`).
- **Il percorso di una persona.**
  - *P3 al computer:* arrivo → «Per chi è, e per chi no» → dieci domande con la risposta sempre in vista (anche l'ultima, provato a
    900 e 700 px d'altezza) → «Copia il messaggio» (copiato testo e indirizzo vero). Regge, salvo il lampeggio.
  - *P3 al telefono:* stesso percorso, la risposta si apre sotto la domanda e resta in vista (598–780 px su 844); poi quattro schermi
    di fatti per chi controlla prima del messaggio (I4).
  - *P7:* «Se devi controllare» → il computer con i quattro fatti e le fonti → licenze, impronte, provenienza, repository. Mancano
    due voci (I6); le fonti non si aprono (M7).
  - *P9:* «Hai provato Kalliope in una riunione vera?» subito dopo «non ancora fatta», con che cosa scrivere, di non incollare le
    frasi e che serve un account GitHub: regge.
  - *Tastiera:* 30 fermate in ordine logico (salta al contenuto, barra, due comandi, «Dicci come è andata», dieci domande, tre
    collegamenti, «Copia», piede), anello visibile su ogni fermata, Invio apre la risposta e il fuoco resta sulla domanda.
  - *Senza JavaScript:* tutto il testo, le domande con le risposte in due colonne, il computer intero, la frase per copiare a mano.
  - *Quando qualcosa non si carica:* senza lo script della pagina, dopo 4 s la vista senza script (buona); senza il foglio della
    strada, un elenco leggibile; senza i caratteri, un difetto piccolo (M11); senza lo script della cornice, titoli e bolle spariti (I3).
- **Ciò che un comando promette accade?** Sì: le frecce portano dove dicono; «Copia il messaggio» copia e lo dice, anche quando non
  può (provato con gli appunti negati).
- **Il sistema c'è?** Token e componenti sì, dalla stessa fonte (`controlla-sorgenti.mjs` verde); il catalogo no (I5).
- **La pagina dice ciò che il progetto deve dire?** Quasi: tre voci mancano (I6). Non inventa funzioni, non promette date, non
  presenta la voce di chi usa Kalliope come presente, non dice «non ancora» per il telefono.
- **Stile di default sotto il primo schermo:** solo i tratti giustificati della parte E.

## Che cosa funziona e va tenuto

- Il primo schermo: il titolo che è già la risposta e la riunione con l'onda tratteggiata che lascia gli altri tratteggiati.
- La strada verticale con la cornice del computer intorno al provato, il tratteggio dopo il microfono, le cifre al loro posto con
  la quota di un secondo e la riga delle parole, e il file accanto a ogni fatto.
- Le domande come pulsanti-voce con la risposta detta nella bolla, che resta in vista al computer e si apre sotto al telefono.
- Il computer del tratto chiaro che cambia con il passo (la finestra che si chiude e il microfono che sparisce dicono il fatto).
- Il messaggio da inoltrare nella bolla con «Copia il messaggio» e le sue due risposte.
- I due comandi del primo schermo che dividono chi valuta da chi controlla.
- I ripieghi: senza JavaScript, con movimento ridotto (subito lo stato finale), senza il foglio della strada, senza lo script della
  pagina; nessun errore e nessuno scorrimento di lato alle misure provate, anche in Firefox.
- La home e «non ancora» non toccate.

## Conclusione

**Pronta per la correzione, non da rifare.** L'idea regge dal primo schermo al piede e sta sopra i riferimenti. Prima di mostrarla
al proprietario vanno chiusi i sei importanti: I1, I2, I4, I6 dalla direzione; I3 nella cornice; I5 dalla costruzione. Nessuno è
bloccante. I minori arrivano al proprietario come scelte, salvo quelli che la correzione tocca comunque.

**Ordine, dal più forte al più debole** (le tre pagine della direzione 2, guardate intere alle stesse misure): la **home** resta la più
forte (il gesto vero che si ascolta, la lunghezza giusta); **«stato»** subito dopo, e sotto il primo schermo è la più inventiva delle
tre, ma è la più lunga e la più fitta al telefono; **«non ancora»** è la più semplice e la più corta. Contro i riferimenti: «stato»
sta sopra R03, R05 e R50; R01 colpisce di più al primo sguardo, «stato» serve di più.

## Le note di chi ha reso, lette dopo

Lette: `PIANO.md`, `CONTENUTI.md`, `progresso.md`, `esiti/`, il foglio della sequenza delle domande e l'elenco dei confronti.

- **Dove dicono più di quanto ho visto.**
  - Domande: il piano descrive «le parole si spengono (140 ms), la bolla prende la misura nuova, le parole nuove compaiono»; la sua
    stessa sequenza (`sequenze/domanda/domanda-1440x900-foglio.jpg`) mostra il testo nuovo pieno a 0,15 e 0,29 s, sbiadito a 0,37 e
    di nuovo pieno a 0,6: il lampeggio (I2) c'è anche nelle sue prove.
  - `progresso.md`: «file in fila che non si sovrappongono alle etichette»: a metà discesa le impronte coprono «Sul disco» (M8).
  - `CONTENUTI.md`: tre voci date per presenti non ci sono (I6); due domande e la posizione delle licenze descritte diversamente
    dalla pagina (M12). Il conto «55 voci ci sono» è quindi più alto del vero.
  - Il piano mette fra le cose da completare «le tappe in fila possono restare indietro»: lo sapeva, ma non è lavoro della
    costruzione, che non cambia tempi né toglie movimento: è da correggere rendendo (I1).
- **Dove corrispondono.** Home e «non ancora» uguali (io: 62 e 43 cose uguali, i pixel diversi solo della bolla che si muove nella
  home); ripieghi senza JavaScript e con movimento ridotto come descritti; nessuna funzione inventata; telefono e voce detti come
  deciso il 17/11; `controlla-sorgenti.mjs` verde; catalogo lasciato alla costruzione, dichiarato.
- **Le tre debolezze che chi ha reso dichiara.**
  - *La lunghezza (7 445 px a 1440):* al computer la lunghezza è giustificata dai contenuti, salvo i vuoti del tratto chiaro (M9);
    il problema vero è al telefono (9 674 px, I4).
  - *Il vuoto chiaro fra i passi:* al computer non è vuoto morto, perché il computer accanto cambia, ma è lungo (M9); al telefono il
    computer fermo prende un terzo dello schermo e il testo gli scorre sotto: lì pesa (I4).
  - *La catena fitta per chi legge dal telefono:* d'accordo, ed è importante (I4): 34 caratteri per riga, due paragrafi per tappa,
    3 543 px.
- **Le due domande che chi ha reso lascia a chi coordina** («non è un dispositivo medico», «non lascia un servizio acceso»): già
  decise da chi coordina il 17/11 (`STATO.md`, riga 3b); la pagina le dice come deciso.

## Non verificato da me

WebKit; telefoni veri; lettori di schermo (la regione che annuncia la risposta c'è, non l'ho ascoltata); testo grande e zoom; le
pseudo-lingue; il video a velocità reale (i tempi delle mie sequenze sono di questa macchina, condivisa).

## Riassunto per il proprietario

### Problemi
- **Nessun problema grave.** La pagina non promette niente che il programma non faccia, e la home e «non ancora» sono rimaste uguali.
- **Importante: la strada della voce fa aspettare.** Le sei tappe si accendono una dopo l'altra; chi arriva a metà legge la sua
  tappa spenta per più di due secondi. La tappa che si ha davanti deve leggersi subito.
- **Importante: le risposte alle domande lampeggiano.** A ogni domanda la risposta nuova compare, sparisce e ricompare.
- **Importante: al telefono è lunga e fitta.** Quasi dieci schermate di testo stretto; chi valuta per un altro, dopo le domande,
  deve attraversarne quattro per arrivare al messaggio da mandare. Va accorciata al telefono.
- **Importante: mancano tre fatti** che il progetto vuole detti: che cosa tocca l'installazione e con quali permessi, chi ospita il
  sito, e i piccoli errori di lettura che la voce ancora fa.
- **Importante: se un pezzo della cornice non si carica, spariscono i titoli e i messaggi**, qui e in «non ancora». Va sistemato
  nella cornice, per tutte le pagine.
- **Importante: i pezzi nuovi non sono ancora nel catalogo** (lo fa chi costruisce, prima che la pagina arrivi a te).
- Minori: la barra non segna la pagina in cui sei; la punta della bolla delle risposte indica la domanda sbagliata al telefono; una
  colonna a destra con una sola linea; le impronte che scendono nel disco sono troppo piccole per vederle.

### Che cosa funziona
- Il primo schermo dice già la risposta: la voce arriva al microfono, oltre è tratteggiato. L'onda che lascia gli altri tratteggiati
  è il momento che resta.
- Ogni misura sta nel punto della strada in cui è stata presa, con il file da cui viene.
- Le domande con la risposta nella bolla, il computer che mostra che cosa entra e che cosa resta, il messaggio da copiare.
- Funziona con la tastiera, senza script e con il movimento ridotto; nessun errore, anche in Firefox.

### Accanto ai riferimenti
- Più personale e più inventiva dei siti premiati dello stesso genere; il più forte colpisce di più al primo sguardo, questa serve di più.

### Non verificato
- Safari, telefoni veri, lettori di schermo, testo ingrandito.
