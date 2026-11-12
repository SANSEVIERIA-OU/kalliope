# Direzione di Kalliope: ambizione, alternative, regole e decisioni

Generata il 12/11/2026 da `design/direzione.json` con `design/strumenti/costruisci-direzione.py` (dati in `direzione_dati.py`; le fonti di ogni decisione sono righe di `design/confronto.json`, lette dal confronto e non ricopiate). Controllo: `controlla-direzione.mjs design/direzione.json --confronto design/confronto.json` (§9).

Stato: **direzione proposta, non ancora approvata**. Il cancello di `references/direzione.md` §5 richiede il percorso vero in `site/`, la revisione visiva e la mostra al proprietario.

## 1. Criterio di ambizione

Che cosa il sito di Kalliope fa o mostra che nessuno dei 13 riferimenti né dei concorrenti (R50 Text-to-Mic, R51 Proloquo, R52 Grid, R53 Voiceitt) mostra. Le assenze citate sono righe del confronto con le prove dei visitatori.

### A1

- **Che cosa:** Mostra la frase scritta e la stessa frase detta, una accanto all'altra, con la voce vera: sotto ogni campione compare ciò che la persona digita («14/3», «15:30», «1.250 € + IVA») e ciò che la voce pronuncia («quattordici marzo», «quindici e trenta», «milleduecentocinquanta euro più IVA»), e la frase in corso si evidenzia mentre suona. Un solo ascolto per volta, mai automatico, sei registrazioni vere di Kalliope 0.1-rc.1 senza ritocchi.
- **Per chi:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità); F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento; F3 chi controlla (IT, privacy, legale, acquisti)
- **Dove:** Primo schermo della pagina iniziale, sul computer e sul telefono (una frase con cifre e importi, una voce, il comando «Ascolta Giulia» senza scorrere) e pagina «Ascolta» (due voci, tre frasi); momento: appena arrivati, prima di decidere di installare.
- **Come si riconosce:** Chi ha ascoltato ricorda che le cifre erano state lette come parole e ha visto quali; chi non può ascoltare ha già letto la stessa cosa. Nessun riferimento mostra la trasformazione da scritto a detto: R03 accoppia suono e testo solo in una conversazione registrata; R05 e R51 hanno suono senza testo; R50 ha la voce soltanto nel video di 8 minuti.
- **Destinazioni:** componente ascolto (variante del primo schermo); componente scritto-detto; token colore voce e barre; pagina Ascolta

### A2

- **Che cosa:** Mette lo stato prima della promessa, con la prova: nella stessa schermata che dice cosa fa Kalliope, un cartellino a tre colonne dice che cosa è provato (voce fino al microfono, con un PipeWire privato), che cosa non è ancora provato (Zoom, Teams, Meet su un desktop reale) e che cosa non esiste (Windows, macOS, telefono, clonazione); chi non può usarlo ancora lo legge subito, con il motivo e un passo.
- **Per chi:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità); F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento; F3 chi controlla (IT, privacy, legale, acquisti); F5 chi guarda da fuori (stampa, associazioni, ricercatori)
- **Dove:** Home: riga di stato sotto il titolo nel primo schermo (anche al telefono) e cartellino subito dopo; pagina «Stato e limiti» con la tabella app per app; ogni pagina del percorso porta la riga corta dello stato.
- **Come si riconosce:** Una persona vede «non ancora provato in una riunione vera» prima di vedere «Scarica» e ricorda che il sito non ha promesso. Solo R21 e R22 mettono una dichiarazione prima del testo (generato da IA, sponsor, commissioni) e nessuno dichiara cosa non è stato provato; R53 scrive il limite in fondo alla pagina; R50 non dice nulla su qualità o ritardo; nessuno dice «non è per te» al primo schermo.
- **Destinazioni:** componente stato (cartellino); componente tabella provato/non provato; composizione apertura; pagina Stato e limiti; pagina Non ancora

### A3

- **Che cosa:** Riconosce le frasi che la finestra di Kalliope mostra: la pagina Aiuto è un indice delle frasi vere dell'app («Nessuna chiamata sta usando il microfono «Kalliope»…», «La voce è pronta, ma PipeWire is not available…»), ciascuna con la causa e l'azione; chi legge la frase la trova scrivendone una parte (con JavaScript) o scorrendo un elenco di soli collegamenti (senza).
- **Per chi:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità); F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento; F4 chi installa, per sé o per un altro, e chi pacchettizza
- **Dove:** Pagina Aiuto, raggiunta anche da un segnalibro e dal piede di ogni pagina; momento: la persona è in una riunione o sta per entrarvi e qualcosa non va.
- **Come si riconosce:** La persona dice «ha riconosciuto il mio messaggio». R52 (Hub) indicizza per domande dei prodotti, R51 e R52 hanno una ricerca che a vuoto non propone alternative; nessuno indicizza l'aiuto sulle parole che il prodotto stesso mostra, né dichiara «non so» per le cause non provate.
- **Destinazioni:** componente scheda-frase; componente filtro; pagina Aiuto

### A4

- **Che cosa:** Fa vedere la voce senza imporre movimento: le cinque barre dell'icona diventano l'indicatore del suono (si alzano seguendo la voce mentre suona, con JavaScript), e il ripiego per il movimento ridotto le sostituisce con la frase evidenziata e la posizione scritta («frase 1 di 2, 00:03»), perché porta la stessa informazione: dove siamo nella voce.
- **Per chi:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità); F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento
- **Dove:** Componente ascolto, in ogni pagina in cui compare; è l'unico movimento espressivo del sito.
- **Come si riconosce:** Una persona sorda vede la voce muoversi e leggere; una persona con mutismo selettivo o autismo vede muoversi qualcosa solo dopo averlo chiesto. Dei 13 siti con la riga «effetti con movimento ridotto» misurata, 0 sostituiscono un effetto (7 non cambiano nulla, 6 ne tolgono almeno uno); R06 usa barrette per l'interruttore del suono ma non le lega a una voce.
- **Destinazioni:** componente ascolto (barre e frase evidenziata); token durate e movimento; variante prefers-reduced-motion; motivo barre (token forma)

### A5

- **Che cosa:** Guida l'installazione con comandi veri e un controllo dopo ogni passo: per Debian/Ubuntu, Fedora, Arch e le altre distribuzioni, ogni passo ha il comando copiabile, «come sai che è andata bene», «se non è andata» e il punto da cui riprendere; un familiare che si ferma al terminale sa che cosa fare.
- **Per chi:** F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento; F4 chi installa, per sé o per un altro, e chi pacchettizza; F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità)
- **Dove:** Pagina Installa e pagina Usalo in una riunione; momento: dopo aver deciso, davanti al terminale o a un messaggio di errore.
- **Come si riconosce:** Chi installa per un altro dice «mi diceva come capire se era riuscito». Nei due siti con una guida all'installazione (R05 un paragrafo, R50 quattro passi) non c'è alcun comando da copiare, nessuna verifica del risultato, nessuna ripresa; R53 non ha installazione.
- **Destinazioni:** componente passi; componente comando copiabile; componente controllo/se-non-va; pagine Installa e Riunione

## 2. Alternative confrontate sugli stessi contenuti

Le evidenze ammettono tre strutture sostanzialmente diverse per gli stessi contenuti (P1-P6 di `progetto.md`: capire, ascoltare, stato onesto,
installare, usare in riunione, aiuto, «non ancora»). Sono confrontate sugli stessi criteri, non solo sulla palette.

| Criterio (da persona e compito) | A. Una pagina narrata | B. Cammino a pagine per compito | C. Porte per persona |
|---|---|---|---|
| Che cosa è | Un solo scorrimento: proposta, ascolto, stato, installazione, aiuto in sezioni | Pagina iniziale e cinque pagine con indirizzo proprio (Ascolta, Stato e limiti, Installa, In riunione, Aiuto), più Non ancora; stepper e «Avanti» | Home con quattro porte («Scrivo per parlare», «Leggo per un altro», «Controllo», «Installo»), ciascuna con il suo percorso |
| Riscontro nel campione | R22 e R21 reggono una lettura lunga; R53 (home di 11.800-15.000 px, 104 comandi) e R02 mostrano il costo | R51, R52, R50: prodotto con pagine per compito e documentazione a parte; R20 per «dove sono, cosa viene dopo» | R06 ha una sola porta per ruolo (facilitatori); R20 e R21 porte per argomento; nessuno instrada per persona |
| Carico di lettura (afasia, lettura lenta: RG8) | Alto: tutto in una pagina | Basso: un compito per pagina, «Avanti» in fondo | Medio: due livelli prima del contenuto |
| Inoltro da telefono (P3) | Ancore dentro una pagina lunga | Un indirizzo per compito, da incollare in un messaggio | Un indirizzo per porta: rischio di inoltrare la porta sbagliata |
| Aiuto da segnalibro (P5) | In fondo a una pagina lunga | Pagina Aiuto con indirizzo proprio (come l'Hub di R52) | Ripetuto in ogni porta |
| Tastiera e interruttore (RG9) | Molti Tab per le sezioni profonde (R50: 14 Tab fino al comando) | Cinque voci e salta-al-contenuto | Un livello in più prima del compito |
| Stato prima della promessa (RG4) | Nell'apertura | Nell'apertura e in una riga in ogni pagina | Da ripetere in ogni porta |
| «Non è per te» al primo incontro (RG16 proposta) | Sezione in fondo | Collegamento nell'apertura e pagina propria | Una porta in più («Non uso Linux») |
| Etichettare chi legge (RG13) | No | No | Sì: dice alla persona «chi è» |
| Costo di costruzione e prova | Una pagina molto lunga da provare a ogni misura | Otto pagine piccole, componenti riusati | Come B più i percorsi per porta |

**Scelta: B**, con due prestiti. Da C resta solo un elenco di quattro collegamenti con parole della persona nella home («Chi sei?»), che portano a sezioni della pagina
Stato e limiti senza etichettare nessuno. Da A resta l'idea che la home racconti l'essenziale in un solo schermo: proposta, stato e ascolto.
Motivo: B è la sola che dà a ogni compito un indirizzo da inoltrare e da tenere nei segnalibri (F2 legge dal telefono e inoltra; F1 torna all'aiuto in
mezzo a una riunione), riduce il carico di lettura per chi ha difficoltà e tiene la navigazione a cinque voci raggiungibili con pochi Tab. A e C
non sono errate: A costa a chi legge con lentezza e a chi usa un interruttore; C etichetta le persone e duplica stato e aiuto.

## 3. Direzione scelta

**Nome di lavoro: «Carta e voce».** Una carta calda e un inchiostro verde scurissimo (14,4:1), il verde acqua dell'icona come tinta di comandi e barre, riquadri a bolla,
cinque barre a capsula come unico motivo. Ciò che la persona digita è in carattere a spaziatura fissa (come il campo della finestra); ciò che la voce dice è nel
carattere del corpo. L'unico movimento espressivo è quello delle barre che seguono la voce quando la persona preme «Ascolta»; tutto il resto è fermo o cambia stato in
meno di 240 ms. Il carattere non è ospitato: si usa quello di sistema (nessuna richiesta, nessun peso).

Che cosa si noterebbe coprendo nome e logo: un cartellino a tre colonne («Provato», «Non ancora provato», «Non esiste») nel primo schermo; una frase digitata con le
cifre evidenziate e la stessa frase detta a parole; una pagina d'aiuto fatta delle frasi vere della finestra. Nessun hero con immagine di sfondo, nessun gradiente
viola, nessuna foto di stock, nessun contatore.

### Revisione dopo la revisione visiva (12/11/2026, sera)

La revisione indipendente (`design/revisione-visiva.md`) ha giudicato la riconoscibilità media: il momento più di Kalliope, la coppia «Tu scrivi / Kalliope dice», stava a y≈1100 sul computer, mentre il primo schermo era dominato da una foto della finestra per due terzi vuota. Cambia una decisione, non l'ambizione: **A1 passa nel primo schermo** (pagina iniziale, computer e telefono, con il comando «Ascolta Giulia» intero senza scorrere); la foto scende e si rimpicciolisce (D01, D02, D03, D32, D33). La riga di stato sale sotto il titolo e al telefono viene prima di «Scarica e installa» (A2, B2 della revisione). Il percorso diventa una riga «Passo N di 5» (D06) e la scelta della distribuzione diventa una scelta vera con JavaScript (D40). A2-A5 restano come scritte.

## 4. Criteri

- **K1** Compito: la persona arriva in pochi minuti dal capire all'avere la voce in una riunione (P1-P6 di progetto.md), e ogni pagina dice qual è la prossima azione.
- **K2** Leggerezza: nessuna richiesta a terzi, nessun cookie, nessun carattere remoto, nessun passo di build (progetto.md §9, vincolo del proprietario).
- **K3** Leggibilità: testo del corpo con contrasto di almeno 7:1, elementi grafici con almeno 3:1, nessuna informazione affidata al solo colore.
- **K4** Distinzione: il sito non si confonde con i concorrenti diretti (R50 Text-to-Mic, R51 Proloquo, R52 Grid) né con un modello generico di vetrina di prodotto.
- **K5** Continuità: l'unico segno di marca esistente, l'icona dell'app (bolla verde acqua con cinque barre), guida colore, forma e motivo.
- **K6** Prevedibilità: nulla si muove, suona o compare senza che la persona lo abbia chiesto (persone con mutismo selettivo e autismo, interruttori e tremore).

## 5. Regole

- **RG1** Ogni valore ha una fonte oppure una motivazione progettuale dichiarata, legata a persona, compito o ambizione. _Fonte: references/direzione.md §3._
- **RG2** Movimento ridotto, senza JavaScript, tastiera, testo grande, colori forzati e dispositivi lenti sono ripieghi, non divieti: ogni effetto ha un equivalente che conserva informazione e controllo. _Fonte: references/direzione.md §2._
- **RG3** Nessun suono parte da solo e nessun video si avvia senza un gesto; ogni suono ha accanto il testo identico, la durata e un solo ascolto per volta. _Fonte: progetto.md P2, regole._
- **RG4** Lo stato (versione di prova, solo Linux, non provato in una riunione vera) sta prima di ogni promessa, nella stessa schermata, senza ritardo. _Fonte: progetto.md P1 e §9._
- **RG5** Il contenuto non dipende da un effetto né da uno script: tutto il testo e i comandi essenziali stanno nel documento HTML e si vedono subito; gli script aggiungono, non sostituiscono. _Fonte: progetto.md §9; references/direzione.md §2._
- **RG6** Nessun movimento che la persona non ha provocato. Ogni movimento porta un'informazione (un cambio di stato), dura al più 240 ms, salvo quello legato a un suono che dura quanto il suono; con movimento ridotto è sostituito, non solo tolto. _Fonte: progetto.md §4.2 (mutismo selettivo, autismo, interruttore); decisione progettuale di design-build._
- **RG7** Nessuna richiesta a terzi, nessun cookie, nessuna statistica, nessun embed: i collegamenti in uscita sono azioni della persona. _Fonte: progetto.md §9, vincolo [P]._
- **RG8** Frasi di 15-20 parole al massimo nei testi che servono un'azione, un'idea per frase, parole comuni; il termine nuovo si spiega al primo uso con una frase sola; seconda persona nelle istruzioni. _Fonte: ricerca/registro-italiano.md (G01-G04); progetto.md §4.2 (afasia)._
- **RG9** Ogni comando si raggiunge da tastiera, ha un bersaglio di almeno 44×44 px con 8 px di distanza, non dipende dal passaggio del mouse né dal tempo, e lo scorrimento resta quello nativo. _Fonte: progetto.md §4.2 (SLA, sensori, puntamento oculare); WCAG 2.5.8._
- **RG10** I nomi del prodotto sono identici a quelli dell'app: Kalliope, «Scarica la voce», «Parla», «Ferma», «Senti anche tu», «Già detto», Giulia, Marco; le frasi di stato citate sono quelle vere della finestra. _Fonte: progetto.md §5, contratto di identità._
- **RG11** Versioni, nomi di file, dimensioni, collegamenti di scarico e impronte vengono solo dai segnaposto di tools/site.py, mai scritti a mano. _Fonte: progetto.md §9; tools/site.py._
- **RG12** Le promesse che il sito non può fare (funziona con Zoom, Teams o Meet; open source; gratis per ogni uso; Windows, macOS o telefono; con la tua voce; in tempo reale; nessuna connessione; dispositivo medico) non compaiono mai come fatti. _Fonte: progetto.md §7._
- **RG13** Le persone sono «persone»: la condizione si nomina solo quando serve e con il nome che usano loro; mai «malato» o «paziente» per chi usa Kalliope. _Fonte: ricerca/registro-italiano.md, «Cosa si porta a Kalliope»._
- **RG14** Ogni cifra dice dove è stata misurata e dove si rifà; ciò che non è stato misurato lo dice. _Fonte: progetto.md P8 e §2.3._

### Regole proposte (da accogliere o respingere dal coordinatore)

- **RG15** Un ripiego per il movimento ridotto sostituisce l'effetto con un equivalente che porta la stessa informazione (per esempio, evidenziazione fissa al posto del movimento), non si limita a toglierlo. _Fonte: design-build (costruzione): nei 13 siti con la riga «effetti con movimento ridotto» misurata dai visitatori nessuno sostituisce un effetto (sostituiti 0 in tutte le varianti); references/direzione.md §2 chiede di ridurre o sostituire, non togliere. Da accogliere in references/direzione.md come esempio di ripiego._
- **RG16** Quando un sito deve dire «non è per te», lo dice al primo incontro, nella stessa schermata della promessa, con il motivo e un passo successivo. _Fonte: design-build (costruzione): nessuno dei 13 riferimenti dice «non è per te» al primo schermo (confronto.json, riga «stato e limiti dichiarati · arrivo computer»); progetto.md P6._

## 6. Concorrenti diretti

R50 (Text-to-Mic: voce sintetica nel microfono di una riunione), R51 (Proloquo, con Proloquo4Text solo testo) e R52 (Grid: comunicazione aumentativa per computer). R53 (Voiceitt) riconosce il parlato atipico e non è un concorrente diretto. Le decisioni prese soltanto da R50 o R52 portano una «distinzione».

## 7. Decisioni

Esiti: adattata 43, trasferita 1, esclusa 20, progettuale 9. Ogni riga del confronto (432 varianti) è fonte di almeno una decisione. Gli identificatori D** sono decisioni di struttura e di contenuto, E** di effetti e animazioni, T** di token e composizione (scelte progettuali dichiarate).

| Id | Esito | Destinazione | Ambizione | Fonti (siti) |
|---|---|---|---|---|
| D01 | adattata | composizione Apertura (home): titolo, riga di stato, riquadro «Tu scrivi / Kalliope dice» con il comando d'ascolto, frase, cartellino, azioni | A2 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D02 | adattata | composizione Apertura: tre comandi + barra a cinque voci | A2 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D03 | adattata | componente bottone primario nella composizione Apertura | A1 | R01, R03, R04, R05, R06, R20, R50, R51, R52, R53 |
| D04 | adattata | componente nav: elenco di cinque voci per compito, sempre visibile | A2 | R01, R02, R03, R04, R05, R06, R20, R21, R50, R51, R52 |
| D05 | adattata | componente nav per compito + elenco «Chi sei?» con quattro collegamenti nella home | A2 | R01, R03, R05, R06, R20, R21, R51, R52 |
| D06 | adattata | componente percorso: riga «Passo N di 5» in cima e «Indietro / Avanti» in fondo a ogni pagina del cammino | A5 | R20, R21, R22, R50, R52 |
| D07 | adattata | componente percorso: collegamenti «Indietro» e «Avanti» a fine pagina | A5 | R01, R03, R20, R21 |
| D08 | adattata | pagina 404 con una frase senza colpa e cinque collegamenti | A2 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D09 | adattata | componente filtro dell'Aiuto: messaggio «nessun risultato» con tre passi | A3 | R22, R51, R52 |
| D10 | adattata | foglio di stile di stampa: navigazione nascosta, indirizzi dei collegamenti scritti, colori a nero | A5 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D11 | trasferita | meta title, description e Open Graph di ogni pagina | A2 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D12 | adattata | struttura semantica: banner, nav, main, contentinfo; un solo H1; ordine dei titoli; testi alternativi | A1 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D13 | adattata | componente salta (collegamento «Vai al contenuto») + anello di focus doppio | A5 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D14 | adattata | token dimensione-bersaglio e distanza-bersagli | A5 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D15 | adattata | token tipografia: corpo 18-20 px, interlinea 1,6, riga di al più 62 caratteri | A1 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D16 | adattata | regole di layout: nessuna larghezza in px sui contenitori di testo, intestazione che va a capo | A5 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D17 | esclusa | meta viewport senza limiti di ingrandimento | A5 | R01, R02, R03 |
| D18 | adattata | regole forced-colors: bordi su bottoni e chip, barre in colore di sistema | A4 | R01, R02, R03 |
| D19 | adattata | regola di progetto: HTML completo, script solo per aggiungere | A4 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D20 | adattata | regola di progetto: nessuno scheletro né spinner; testo per primo; audio caricato solo alla richiesta | A4 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D21 | esclusa | nessuna terza parte nel sito | A2 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D22 | progettuale | token budget di pagina: al più 200 kB di HTML, CSS e script per pagina, 0 domini esterni, audio escluso | A2 | progettuale |
| D23 | adattata | piede del sito + sezione «Chi c'è dietro» nella pagina Stato e limiti | A2 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D24 | adattata | componente stato (cartellino a tre colonne: provato, non ancora provato, non esiste) | A2 | R01, R02, R04, R05, R06, R21, R22, R50, R51, R53 |
| D25 | esclusa | nessuna uscita rapida | A2 | R06 |
| D26 | adattata | componente scelta-sistema: ogni formato dice cosa si guadagna e cosa si perde | A5 | R05 |
| D27 | adattata | componente tabella provato/non provato per app e piattaforma | A2 | R51 |
| D28 | esclusa | nessuna testimonianza | A2 | R50, R51, R52, R53 |
| D29 | adattata | regola di scrittura e componente misura: ogni cifra accompagnata dalla frase che la dice e da dove è misurata | A1 | R04, R21, R22, R51, R53 |
| D30 | adattata | componente disclosure (dettagli) su <details> | A3 | R01, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D31 | adattata | regola di scrittura RG8 e glossario dei termini nuovi | A5 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D32 | adattata | componente foto: la foto vera della finestra con didascalia e testo alternativo; elenco delle frasi di stato | A3 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| D33 | adattata | componente ascolto: due voci, tre frasi, un solo suono per volta, testo scritto e testo detto | A1, A4 | R03, R05, R51 |
| D34 | adattata | regola RG3: il suono parte solo dal gesto, nessun predefinito | A1 | R06 |
| D35 | adattata | regola RG3 e componente ascolto: avvio solo da gesto, preload none | A1 | R04, R05, R06, R50, R51 |
| D36 | esclusa | nessun video di sottofondo né in ciclo | A4 | R02, R03, R53 |
| D37 | adattata | componente ascolto: collegamento al file e messaggio se la riproduzione non parte | A1 | R21, R50, R51, R52, R53 |
| D38 | adattata | componente passi: passi numerati con comando, controllo e «se non va» | A5 | R05, R50 |
| D39 | adattata | componente comando: blocco a spaziatura fissa con pulsante «Copia» | A5 | R50 |
| D40 | adattata | componente scelta-sistema: indice di quattro distribuzioni e sezioni sempre visibili | A2, A5 | R05, R50 |
| D41 | esclusa | nessuna finestra di consenso né sovrapposizione al primo arrivo | A2 | R05, R53 |
| D42 | adattata | token colore con variante scura che segue il sistema (prefers-color-scheme) | A4 | R52 |
| D43 | esclusa | nessun menu a pannello o a comparsa | A5 | R02, R04, R05, R20, R21, R50, R51, R52 |
| E01 | adattata | componente disclosure: dissolvenza di 120 ms all'apertura di un dettaglio, istantanea con movimento ridotto | A4 | R01, R02, R04, R05, R21, R50, R51, R52, R53 |
| E02 | esclusa | nessuna comparsa all'ingresso per scorrimento | A4 | R02, R04, R05, R22, R52, R53 |
| E03 | esclusa | nessun movimento ciclico o decorativo | A4 | R03, R05, R50, R52, R53 |
| E04 | esclusa | scorrimento nativo, senza smorzamento, parallasse, cursore personalizzato né passaggio automatico | A5 | R02, R04, R06, R20, R22 |
| E05 | esclusa | intestazione di altezza costante, non fissa e senza trasformazioni allo scorrimento | A5 | R03, R04, R05, R06, R50, R51 |
| E06 | esclusa | nessun banner di consenso, nessuna introduzione all'arrivo | A2 | R03, R04, R05, R20, R53 |
| E07 | adattata | componente percorso: posizione («Passo N di 5») e «cosa viene dopo» come informazione fissa, senza transizioni | A5 | R20 |
| E08 | esclusa | nessun riquadro di dialogo dal vivo né passo di consenso | A1 | R03 |
| E09 | esclusa | nessun carosello né scheda che sostituisce il contenuto | A5 | R03, R04, R52 |
| E10 | adattata | componente scelta-sistema: l'etichetta della voce scelta cambia colore e simbolo in 120 ms | A5 | R05, R51 |
| E11 | esclusa | nessun conteggio animato dei numeri | A4 | R04 |
| E12 | adattata | componente filtro: scrivendo parte della frase, l'elenco si restringe e la parte coincidente è in grassetto | A3 | R04, R22 |
| E13 | esclusa | nessun grafico guidato dallo scorrimento né dal puntatore | A2 | R22 |
| E14 | adattata | stato dei comandi: hover e focus identici, transizione di 100 ms su colore e sottolineatura | A5 | R01, R02, R03, R04, R21, R50, R51, R53 |
| E15 | esclusa | nessun effetto che segue il puntatore | A5 | R01, R20, R22 |
| E16 | adattata | componente condividi: indirizzo della pagina in un campo selezionabile e pulsante «Copia l'indirizzo» | A5 | R21 |
| E17 | adattata | token colore: variante scura con lo stesso schema di ruoli | A4 | R52 |
| E18 | esclusa | nessuna scena WebGL né sequenza di caricamento | A4 | R01 |
| E19 | adattata | componente ascolto: cinque barre dell'icona come indicatore del suono; il gesto del titolo diventa il gesto «Ascolta» | A1, A4 | R05, R06 |
| E20 | esclusa | nessuna soglia animata, scena di treno, frecce di capitolo né avvertenza ritardata | A2 | R06 |
| E21 | esclusa | nessuno scorrimento a velocità diverse per elemento | A5 | R20 |
| D44 | adattata | regola RG6/RG15 e tutte le varianti prefers-reduced-motion: l'effetto è sostituito da un equivalente fermo | A4 | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| T01 | progettuale | token colore: verde acqua scuro per testo e comandi, verde acqua dell'icona per barre e grafica | A1, A4 | progettuale |
| T02 | progettuale | token colore: sfondo carta #f8f6f0, inchiostro #1b2623, variante scura che segue il sistema | A4 | progettuale |
| T03 | progettuale | token tipografia: carattere di sistema per il testo, carattere a spaziatura fissa per il testo digitato | A1 | progettuale |
| T04 | progettuale | token forma: riquadri a bolla di fumetto (raggio 18 px), barre a capsula | A4 | progettuale |
| T05 | progettuale | token motivo: cinque barre a capsula di altezze diverse (come l'icona) per indicatore del suono, divisore di sezione e segno del cartellino | A4 | progettuale |
| T06 | progettuale | token spazi: scala di 4 px (4, 8, 12, 16, 24, 32, 48, 64, 96), colonna di testo di 62 caratteri, bersagli di 44 px | A5 | progettuale |
| T07 | progettuale | token movimento: durate 0 (ridotto), 100, 120 e 240 ms; il movimento del suono dura quanto il suono | A4 | progettuale |
| T08 | progettuale | composizione del sito: pagina iniziale con l'ascolto nel primo schermo e cammino in cinque pagine (Ascolta, Stato e limiti, Installa, In riunione, Aiu | A2, A3, A5 | progettuale |

### D01 · adattata · composizione Apertura (home): titolo, riga di stato, riquadro «Tu scrivi / Kalliope dice» con il comando d'ascolto, frase, cartellino, azioni

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (25 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1 capire in pochi secondi cosa fa, per chi è, cosa serve.
- **Motivo:** La proposta dei riferimenti va da 3 a 75 parole; la persona di Kalliope ha bisogno di una sola frase chiara e del limite (solo Linux) nello stesso schermo.
- **Adattamento:** Titolo corto; sotto, una riga di stato («Versione di prova: solo per Linux, non ancora provata in una riunione vera»); accanto (computer) o subito dopo (telefono) il riquadro scritto/detto con una frase, una voce e il comando «Ascolta Giulia» interi nel primo schermo a 1440×900 e a 390×844; la frase che dice cosa fa e per chi è viene dopo il riquadro al telefono; il cartellino segue. La foto della finestra, per due terzi vuota, scende più in basso e si rimpicciolisce. Nessun testo sopra un'immagine.
- **Ambizione:** A2. **Regole:** RG4, RG8, RG12.
- **Prova viva:** site/sistema/#c-apertura. **Verifica:** esame-impaginazione a 1440×900 e 390×844; lettura a testo 200%.

### D02 · adattata · composizione Apertura: tre comandi + barra a cinque voci

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (26 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1 scegliere la prossima azione.
- **Motivo:** I riferimenti mostrano da 1 a 21 comandi al primo schermo; le barre aziendali di R50 e R51 aggiungono scelte che non servono al compito.
- **Adattamento:** Cinque voci di navigazione per compito e nel corpo: il comando d'ascolto del riquadro (principale), «Scarica e installa» e «Non uso Linux: cosa posso fare» (collegamento). Al telefono «Scarica e installa» viene dopo il cartellino di stato. Nessun comando flottante né chat.
- **Ambizione:** A2. **Regole:** RG9.
- **Prova viva:** site/sistema/#c-nav. **Verifica:** conteggio dei comandi al primo schermo con esame-impaginazione.

### D03 · adattata · componente bottone primario nella composizione Apertura

- **Fonti:** R01, R03, R04, R05, R06, R20, R50, R51, R52, R53 (20 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 arrivare all'ascolto con un gesto.
- **Motivo:** Il comando principale dei riferimenti sta al centro o in basso, spesso fisso allo scorrimento; per chi usa un interruttore un comando che si sposta o copre il testo è un ostacolo.
- **Adattamento:** Il comando principale è «Ascolta Giulia» dentro il riquadro del primo schermo, non fisso allo scorrimento, 48 px di altezza, etichetta con il verbo; «Scarica e installa» è il secondo bottone pieno, dopo lo stato. Nessuna barra fissa che copra il testo a zoom 200%.
- **Ripiego** (zoom, tastiera): Senza script il riquadro ha i controlli nativi dell'audio e il collegamento al file; «Scarica e installa» è un collegamento. Funzionano con tastiera e a qualunque ingrandimento.
- **Ambizione:** A1. **Regole:** RG9.
- **Prova viva:** site/sistema/#c-bottone. **Verifica:** prova tastiera: Tab fino al comando; testo 200%.

### D04 · adattata · componente nav: elenco di cinque voci per compito, sempre visibile

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R50, R51, R52 (20 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 sapere dove andare.
- **Motivo:** Menu a comparsa e pannelli dei riferimenti dipendono da JavaScript o dal passaggio del mouse; cinque voci stanno in due righe anche a 360 px.
- **Adattamento:** Elenco semplice di cinque voci (Ascolta, Stato e limiti, Installa, Usalo in una riunione, Aiuto) più «Come è fatto questo sito» nel piede; la voce corrente è segnata con testo e sottolineatura, non solo con il colore. Nessun menu a tre barre.
- **Ripiego** (senza_js, tastiera, testo_grande): La barra è già un elenco di collegamenti: senza script resta uguale; a testo grande va a capo.
- **Ambizione:** A2. **Regole:** RG5, RG9.
- **Prova viva:** site/sistema/#c-nav. **Verifica:** esame-impaginazione a 390×844 e testo 200%.

### D05 · adattata · componente nav per compito + elenco «Chi sei?» con quattro collegamenti nella home

- **Fonti:** R01, R03, R05, R06, R20, R21, R51, R52 (8 righe del confronto: caratteristica · ambito)
- **Persona:** F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P3 e P7 trovare le informazioni che servono al proprio ruolo.
- **Motivo:** Le porte per compito (R01, R03, R05, R52) e per argomento (R20, R21) funzionano senza etichettare chi legge; la sola porta per ruolo (R06, facilitatori) e i testi per famiglie (R51) mostrano che il ruolo si dichiara nel testo.
- **Adattamento:** Navigazione per compito; nella home quattro collegamenti con parole della persona («Scrivo per parlare», «Leggo per un'altra persona», «Devo controllare», «Installo per un altro») che portano a sezioni della pagina Stato e limiti, dove la tabella «la stessa cosa detta a chi» dà le stesse informazioni a ciascuno. Nessuna etichetta clinica.
- **Ambizione:** A2. **Regole:** RG8, RG13.
- **Prova viva:** site/sistema/#c-nav. **Verifica:** lettura delle quattro porte; prova tastiera.

### D06 · adattata · componente percorso: riga «Passo N di 5» in cima e «Indietro / Avanti» in fondo a ogni pagina del cammino

- **Fonti:** R20, R21, R22, R50, R52 (6 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P5 sapere dove sono e cosa viene dopo.
- **Motivo:** R20 tiene in un solo oggetto dove sei e cosa succede dopo, ma con scorrimento virtuale e movimento; R21, R50 e R52 mostrano il segnale con numeri o indici.
- **Adattamento:** Una riga di testo («Passo 2 di 5: Stato e limiti») e un collegamento «Avanti» grande a fine pagina; l'elenco delle cinque tappe non si ripete perché la barra principale in cima ha già le stesse voci (la revisione visiva ha misurato 318 px di doppia navigazione su telefono). L'informazione dell'isola contestuale, senza oggetti che si muovono o seguono lo scorrimento.
- **Ripiego** (tastiera, senza_js): È testo: nessuna parte dipende da script. La barra principale conserva aria-current sulla voce corrente.
- **Ambizione:** A5. **Regole:** RG5, RG6, RG9.
- **Prova viva:** site/sistema/#c-percorso. **Verifica:** prova senza JavaScript; esame-impaginazione.

### D07 · adattata · componente percorso: collegamenti «Indietro» e «Avanti» a fine pagina

- **Fonti:** R01, R03, R20, R21 (4 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P4-P5 tornare alla tappa precedente senza perdere il posto.
- **Motivo:** I comandi «indietro» dei riferimenti sono pulsanti che dipendono da script o da stati interni; qui basta un collegamento e il tasto del browser.
- **Adattamento:** Due collegamenti testuali grandi, «Indietro: <pagina>» e «Avanti: <pagina>»; nessun dato da conservare perché il sito non ha moduli.
- **Ambizione:** A5. **Regole:** RG5, RG9.
- **Prova viva:** site/sistema/#c-percorso. **Verifica:** prova tastiera; link-spenti-qa.

### D08 · adattata · pagina 404 con una frase senza colpa e cinque collegamenti

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1 recuperare da un indirizzo sbagliato.
- **Motivo:** Le 404 utili dei riferimenti (R21 una frase che non colpevolizza, R51 e R52 elenco di destinazioni) riportano la persona nel sito; quelle inutili (R53 «click here», R06 nero su nero) la lasciano sola.
- **Adattamento:** Una frase («Questa pagina non esiste o è stata spostata.»), l'elenco delle cinque pagine del cammino e il collegamento alla home; senza campo di ricerca perché il sito è piccolo e la ricerca richiederebbe script.
- **Ripiego** (senza_js): Solo HTML: nessun comportamento da recuperare senza script.
- **Ambizione:** A2. **Regole:** RG5.
- **Prova viva:** site/404.html e site/sistema/#c-404. **Verifica:** apertura di un indirizzo inesistente con il server locale; foto.

### D09 · adattata · componente filtro dell'Aiuto: messaggio «nessun risultato» con tre passi

- **Fonti:** R22, R51, R52 (3 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P5 trovare la causa quando la frase digitata non coincide.
- **Motivo:** R51 e R52 rispondono «No results found» senza proporre altro; R22 mostra suggerimenti mentre si digita.
- **Adattamento:** Il filtro riguarda solo le frasi della finestra. Se non ne trova, sparisce il gruppo (titolo, indice e schede) e il messaggio dice cosa fare: provare una parola sola («pronta», «scarico»), guardare i tre casi «La mia frase non c'è», che restano sempre in vista, o segnalare. Il numero detto è quello delle voci mostrate.
- **Ripiego** (senza_js, movimento_ridotto): Senza script non c'è filtro: l'elenco completo di collegamenti è l'unico comando e basta. Il messaggio compare senza movimento.
- **Ambizione:** A3. **Regole:** RG5.
- **Prova viva:** site/sistema/#c-filtro. **Verifica:** prova con filtro vuoto, parziale e senza risultati; prova senza JavaScript.

### D10 · adattata · foglio di stile di stampa: navigazione nascosta, indirizzi dei collegamenti scritti, colori a nero

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F4 chi installa, per sé o per un altro, e chi pacchettizza. **Compito:** P4 stampare la guida all'installazione e consegnarla a chi installerà.
- **Motivo:** I riferimenti si stampano senza accorgimenti (barre, banner, sfondi); chi installa per un altro potrebbe volere la guida su carta.
- **Adattamento:** In stampa spariscono navigazione, stepper e barre; i collegamenti mostrano l'indirizzo; i comandi restano in carattere a spaziatura fissa con bordo; il cartellino di stato si stampa.
- **Ambizione:** A5. **Regole:** RG2.
- **Prova viva:** site/sistema/#c-stampa. **Verifica:** emulazione media print con foto.

### D11 · trasferita · meta title, description e Open Graph di ogni pagina

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1 inoltrare un collegamento con un'anteprima che dica cosa è.
- **Motivo:** Familiari e logopedisti inoltrano collegamenti nei messaggi; l'anteprima è ciò che il destinatario legge prima di aprirli.
- **Ambizione:** A2. **Regole:** RG11.
- **Prova viva:** site/sistema/#c-meta. **Verifica:** lettura dei meta di ogni pagina nell'anteprima locale.

### D12 · adattata · struttura semantica: banner, nav, main, contentinfo; un solo H1; ordine dei titoli; testi alternativi

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 usare il sito con un lettore di schermo (Orca, NVDA, VoiceOver).
- **Motivo:** Tutti i riferimenti hanno punti di riferimento o li dovrebbero avere; R03 ha 32 immagini su 46 senza alternativa e R05 cinque pulsanti senza nome: sono i difetti da evitare, non solo i modelli.
- **Adattamento:** Un solo H1 per pagina, titoli in ordine, ogni immagine con alternativa utile (la foto della finestra descrive i controlli), ogni pulsante con nome, l'audio con etichetta che dice voce e frase.
- **Ripiego** (lettore_schermo, tastiera): La semantica è il livello di base; gli script non cambiano la struttura.
- **Ambizione:** A1. **Regole:** RG2, RG9.
- **Prova viva:** site/sistema/#c-semantica. **Verifica:** albero di accessibilità (proxy) con Playwright; lettore vero non disponibile: dichiarato.

### D13 · adattata · componente salta (collegamento «Vai al contenuto») + anello di focus doppio

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 arrivare al comando principale con pochi arresti.
- **Motivo:** R03, R21 e R52 hanno un «Skip to content» che compare al focus; R50 e R51 non lo hanno e R50 ha un anello quasi invisibile; R01 e R20 rendono i comandi irraggiungibili.
- **Adattamento:** Salta-al-contenuto come primo Tab, visibile al focus; anello di focus di 3 px in colore dell'inchiostro con alone chiaro (contrasto oltre 3:1 su carta e su verde); ordine di Tab uguale all'ordine visivo.
- **Ripiego** (tastiera, contrasto): Nessuno: la tastiera è il comando di base.
- **Ambizione:** A5. **Regole:** RG9.
- **Prova viva:** site/sistema/#c-focus. **Verifica:** sequenza di Tab con foto; contrasto-qa.

### D14 · adattata · token dimensione-bersaglio e distanza-bersagli

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (26 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P5 premere un comando con puntamento impreciso o interruttore.
- **Motivo:** I minimi misurati nei riferimenti vanno da 8 px a 48 px; per un puntamento oculare o un tremore servono bersagli ampi e distanziati.
- **Adattamento:** Minimo 44×44 px per ogni comando, 8 px fra comandi vicini; collegamenti nel testo con interlinea che lascia una riga libera; nessun comando da 14 px.
- **Ripiego** (tocco, tastiera): Il bersaglio è esteso con padding, non con script.
- **Ambizione:** A5. **Regole:** RG9.
- **Prova viva:** site/sistema/#t-spazi. **Verifica:** misura dei bersagli con esame-impaginazione.

### D15 · adattata · token tipografia: corpo 18-20 px, interlinea 1,6, riga di al più 62 caratteri

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (26 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 leggere con lentezza o con difficoltà.
- **Motivo:** I corpi misurati vanno da 13 a 27 px e le righe fino a 104 caratteri; il registro italiano G01-G04 mostra corpi di 13-15 px in grigio come causa di lettura faticosa.
- **Adattamento:** Corpo 1,125 rem (18 px) a 1,25 rem (20 px), interlinea 1,6, colonna di 62 caratteri, testo in inchiostro con contrasto oltre 7:1; nessun testo grigio chiaro in peso leggero.
- **Ripiego** (testo_grande, zoom, contrasto): Unità relative (rem): al 200% il layout si riorganizza senza scorrimento orizzontale.
- **Ambizione:** A1. **Regole:** RG8, RG9.
- **Prova viva:** site/sistema/#t-tipografia. **Verifica:** contrasto-qa; prova testo 200%.

### D16 · adattata · regole di layout: nessuna larghezza in px sui contenitori di testo, intestazione che va a capo

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (15 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 ingrandire il testo senza perdere contenuto.
- **Motivo:** R52 e R01 mostrano scorrimento orizzontale o sovrapposizioni al 200%; R50, R51 e R53 non scorrono di lato ma rompono la barra o sovrappongono pulsante e paragrafo.
- **Adattamento:** Intestazione, navigazione e stepper vanno a capo; i comandi non si sovrappongono al testo; nessuna barra fissa che occupi più di un decimo dell'altezza.
- **Ripiego** (testo_grande, zoom): Layout fluido in rem e clamp; la pagina funziona a 200% di testo e a 400% di zoom.
- **Ambizione:** A5. **Regole:** RG9.
- **Prova viva:** site/sistema/#t-spazi. **Verifica:** prova testo 200% e zoom 200% con foto.

### D17 · esclusa · meta viewport senza limiti di ingrandimento

- **Fonti:** R01, R02, R03 (6 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 ingrandire la pagina.
- **Motivo:** R01, R02 e R03 impediscono o limitano lo zoom della pagina: è un difetto da non riprodurre.
- **Esclusione (vincolo):** accessibilità massima [P], progetto.md §9: il meta viewport di Kalliope non limita lo zoom.
- **Ambizione:** A5. **Regole:** RG9.
- **Prova viva:** site/sistema/#c-meta. **Verifica:** lettura del meta viewport.

### D18 · adattata · regole forced-colors: bordi su bottoni e chip, barre in colore di sistema

- **Fonti:** R01, R02, R03 (3 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 leggere con i colori imposti dal sistema.
- **Motivo:** R01, R02 e R03 sono stati osservati con colori forzati; i bottoni perdono il riempimento ma tengono il bordo, i chip senza bordo perdono ogni segno.
- **Adattamento:** Ogni bottone, chip e cartellino ha un bordo reale (non solo sfondo); le barre usano CanvasText e Highlight in modalità forzata; l'icona non dipende dal gradiente.
- **Ripiego** (colori_forzati, contrasto): In modalità forzata i riempimenti diventano contorni e il motivo delle barre usa i colori di sistema.
- **Ambizione:** A4. **Regole:** RG2.
- **Prova viva:** site/sistema/#c-forzati. **Verifica:** emulazione forced-colors con foto.

### D19 · adattata · regola di progetto: HTML completo, script solo per aggiungere

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P1-P6 usare il sito senza JavaScript.
- **Motivo:** R21 e R22 hanno il testo intero senza script; R01 e R02 lo nascondono con opacità 0; R04 lascia blocchi vuoti.
- **Adattamento:** Ogni pagina è documento completo; le sole aggiunte con script sono: evidenziazione e barre dell'ascolto, filtro dell'Aiuto, copia dei comandi e rilevazione del sistema operativo. Ognuna ha il suo equivalente senza script.
- **Ripiego** (senza_js): Audio con controlli nativi, comandi in testo selezionabile, elenco completo dell'Aiuto, banner di sistema sostituito da un collegamento fisso «Non uso Linux».
- **Ambizione:** A4. **Regole:** RG5.
- **Prova viva:** site/sistema/#c-senza-js. **Verifica:** prova con javaScriptEnabled false su ogni pagina.

### D20 · adattata · regola di progetto: nessuno scheletro né spinner; testo per primo; audio caricato solo alla richiesta

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 vedere il testo subito su rete lenta.
- **Motivo:** Gli scheletri e gli spinner dei riferimenti (R05) e le attese oltre 20 secondi (R02, R20) lasciano la persona senza contenuto.
- **Adattamento:** Pagine di poche decine di kB senza immagini oltre la foto della finestra; l'audio ha preload none e un testo «Carico il file…» solo dopo il gesto; la foto ha dimensioni dichiarate per non spostare il testo.
- **Ripiego** (rete_lenta, prestazioni): Il testo è nel primo byte; nessun segnaposto animato è necessario.
- **Ambizione:** A4. **Regole:** RG5, RG7.
- **Prova viva:** site/sistema/#c-prestazioni. **Verifica:** misura delle richieste e prova con rete lenta emulata in Chromium.

### D21 · esclusa · nessuna terza parte nel sito

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P7 sapere che il sito non invia dati a terzi.
- **Motivo:** I riferimenti caricano da 4 a 17 domini esterni (strumenti di misura, consenso, chat, mappe, caratteri).
- **Esclusione (vincolo):** Nessuna richiesta a terzi, nessun cookie, nessuna statistica [P], progetto.md §9. Il fatto si scrive nel piede del sito.
- **Ambizione:** A2. **Regole:** RG7.
- **Prova viva:** site/sistema/#c-prestazioni. **Verifica:** richieste di rete della home: tutte verso lo stesso dominio.

### D22 · progettuale · token budget di pagina: al più 200 kB di HTML, CSS e script per pagina, 0 domini esterni, audio escluso

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P1 e P7 pagine leggere su computer modesti.
- **Motivo:** Kalliope è un programma leggero per computer modesti (README, obiettivi): il sito ne dà l'esempio. Il valore è scelto dal progetto, non preso da un riferimento; i riferimenti più leggeri misurati sono R51 con 24 richieste e R50 con 66 richieste e 471 kB, ma includono immagini e script di terzi.
- **Ambizione:** A2. **Regole:** RG1, RG7.
- **Prova viva:** site/sistema/#c-prestazioni. **Verifica:** misura del peso di ogni pagina.

### D23 · adattata · piede del sito + sezione «Chi c'è dietro» nella pagina Stato e limiti

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F3 chi controlla (IT, privacy, legale, acquisti) / F5 chi guarda da fuori (stampa, associazioni, ricercatori). **Compito:** P7 sapere chi risponde e dove si verifica.
- **Motivo:** Tutti i riferimenti dicono chi c'è dietro in forme diverse (firma, data, versione, fonti); R22 mette il metodo e nove fonti con scopo.
- **Adattamento:** SANSEVIERIA OÜ, versione e data della release (segnaposto), collegamenti ai file del repository (README, LICENSE, NOTICE, docs) e alla pagina della release; nessun nome di persona se non quelli già nel repository.
- **Ambizione:** A2. **Regole:** RG11, RG14.
- **Prova viva:** site/sistema/#c-piede. **Verifica:** lettura; segnaposto sostituiti da tools/site.py.

### D24 · adattata · componente stato (cartellino a tre colonne: provato, non ancora provato, non esiste)

- **Fonti:** R01, R02, R04, R05, R06, R21, R22, R50, R51, R53 (14 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P1 e P3 sapere cosa si può aspettare, prima di decidere.
- **Motivo:** R21 e R22 dichiarano prima del testo (IA, sponsor, limiti del dato); R53 scrive il limite onesto in fondo; R06 dà l'avvertenza ma dopo 2-8 secondi; R50 dà solo l'avviso antivirus; R05, R51 limiti sparsi.
- **Adattamento:** Il cartellino è nel primo schermo, subito sotto la proposta, senza ritardo né chiusura; tre colonne con parola, simbolo e testo (non solo colore): «Provato» (voce fino al microfono, con un PipeWire privato), «Non ancora provato» (Zoom, Teams, Meet su un desktop reale; lettori di schermo; puntamento oculare) e «Non esiste» (Windows, macOS, telefono, clonazione della voce).
- **Distinzione:** Il cartellino con tre colonne è proprio di Kalliope; nei concorrenti (R50, R51) lo stato è assente o limitato a requisiti e prezzo.
- **Candidati:** avviso a scomparsa in alto (come R06 M10) (R06) → eliminato da RG4; riga di limiti in fondo alla pagina (come R53) (R53) → eliminato da RG4; etichetta «Beta» accanto al nome (nessuna: uso comune dei prodotti) → eliminato da RG14; cartellino a tre colonne provato / non ancora provato / non esiste nel primo schermo (R21 (dichiarare prima), R53 (parole oneste), R51 (tabella di requisiti)) → **scelto**
- **Ambizione:** A2. **Regole:** RG4, RG12, RG14.
- **Prova viva:** site/sistema/#c-stato. **Verifica:** lettura a 1440×900 e 390×844: il cartellino compare senza scorrere; contrasto-qa.

### D25 · esclusa · nessuna uscita rapida

- **Fonti:** R06 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 non applicabile.
- **Motivo:** R06 offre avvertenza con aiuto 24 ore e uscita rapida perché le storie trattano di violenza; il sito di Kalliope non ha contenuti sensibili né pagine da nascondere.
- **Esclusione (compito):** Il principio utile, l'avvertenza presente subito e non ritardata, è già nella decisione D24; l'uscita rapida non ha un compito qui.
- **Ambizione:** A2. **Regole:** RG4.
- **Prova viva:** site/sistema/#c-stato. **Verifica:** nessuna: esclusione motivata dal compito.

### D26 · adattata · componente scelta-sistema: ogni formato dice cosa si guadagna e cosa si perde

- **Fonti:** R05 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F4 chi installa, per sé o per un altro, e chi pacchettizza. **Compito:** P4 scegliere il formato giusto per il proprio computer.
- **Motivo:** R05 scrive in ogni opzione cosa si guadagna e cosa si perde; la scelta fra pacchetto e archivio è la stessa decisione.
- **Adattamento:** Per ciascun formato una riga: .deb e .rpm si aggiornano con il gestore dei pacchetti e chiedono i permessi di amministratore; il .tar.gz con ./install scrive in ~/.local senza amministratore e si toglie con ./install --remove; Arch usa il PKGBUILD senza compilare.
- **Ambizione:** A5. **Regole:** RG11, RG14.
- **Prova viva:** site/sistema/#c-scelta-sistema. **Verifica:** confronto con docs/releasing.md.

### D27 · adattata · componente tabella provato/non provato per app e piattaforma

- **Fonti:** R51 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P5 sapere se funziona con la propria app di riunione.
- **Motivo:** Solo R51 ha una tabella, e di requisiti; nessuno dichiara il non provato. Per Kalliope la compatibilità è un fatto da provare app per app (progetto.md §1.4).
- **Adattamento:** Righe: Zoom, Teams, Meet, Webex, Jitsi, browser; colonne: provato in una riunione vera, provato con un test del microfono, non provato; oggi tutte «non provato in una riunione vera»; la tabella dice la data e come segnalare (P9).
- **Distinzione:** La tabella dichiara il non provato come dato; nei riferimenti la compatibilità è un elenco di requisiti.
- **Candidati:** elenco puntato di app compatibili (uso comune dei prodotti) → eliminato da RG12; tabella dei requisiti minimi (R51) → eliminato da RG4; tabella provato / non provato per app con data (R51 (forma tabellare), R53 (onestà)) → **scelto**
- **Ambizione:** A2. **Regole:** RG4, RG12, RG14.
- **Prova viva:** site/sistema/#c-tabella. **Verifica:** lettura; aggiornamento previsto quando arrivano segnalazioni.

### D28 · esclusa · nessuna testimonianza

- **Fonti:** R50, R51, R52, R53 (4 righe del confronto: caratteristica · ambito)
- **Persona:** F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P3 fidarsi.
- **Motivo:** R50, R51, R52 e R53 usano storie di utenti; il sito di Kalliope non ha materiale di persone reali e non lo inventa.
- **Esclusione (vincolo):** Nessun materiale di persone reali (foto, testimonianze, frasi) senza consenso, progetto.md §12; un componente «storia» entrerà solo con un consenso scritto.
- **Ambizione:** A2. **Regole:** RG1.
- **Prova viva:** site/sistema/#c-stato. **Verifica:** nessuna: esclusione motivata dal vincolo.

### D29 · adattata · regola di scrittura e componente misura: ogni cifra accompagnata dalla frase che la dice e da dove è misurata

- **Fonti:** R04, R21, R22, R51, R53 (5 righe del confronto: caratteristica · ambito)
- **Persona:** F3 chi controlla (IT, privacy, legale, acquisti) / F5 chi guarda da fuori (stampa, associazioni, ricercatori). **Compito:** P7 e P8 citare una misura senza fraintenderla.
- **Motivo:** R04, R21 e R22 accompagnano il numero con una frase; per Kalliope la forma detta dei numeri è anche il prodotto (A1).
- **Adattamento:** Le cifre di Kalliope (2,3% di parole sbagliate su 10 frasi; circa una parola ogni 45 sui sei campioni; 53 MB di voce; 0,07 s di CPU per secondo di voce) hanno la frase intera accanto, il computer su cui sono misurate e il file dove si rifà la misura. Nessun conteggio animato.
- **Ambizione:** A1. **Regole:** RG14.
- **Prova viva:** site/sistema/#c-misura. **Verifica:** lettura; ogni cifra rimanda a un file del repository.

### D30 · adattata · componente disclosure (dettagli) su <details>

- **Fonti:** R01, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (14 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P5 leggere il corto subito e il lungo a richiesta.
- **Motivo:** Le FAQ in fisarmonica dei riferimenti (R01, R04, R05, R06, R50, R53) tengono le risposte lunghe dietro una domanda; per chi ha difficoltà di lettura il corto sta in vista e il lungo si apre quando serve.
- **Adattamento:** Risposta corta sempre visibile; il «perché» e i dettagli tecnici dentro <details> con etichetta chiara; aprire non muove nient'altro; apertura con dissolvenza di 120 ms, istantanea con movimento ridotto; mai informazione essenziale solo dentro un dettaglio chiuso.
- **Ripiego** (movimento_ridotto, senza_js, tastiera): <details> funziona senza script e da tastiera; con movimento ridotto non c'è dissolvenza.
- **Ambizione:** A3. **Regole:** RG5, RG6, RG8.
- **Prova viva:** site/sistema/#c-disclosure. **Verifica:** prova tastiera, senza JavaScript, movimento ridotto.

### D31 · adattata · regola di scrittura RG8 e glossario dei termini nuovi

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (14 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 capire senza fatica.
- **Motivo:** Le frasi dei riferimenti vanno da 3 a 75 parole al primo schermo; le pagine italiane G01-G04 mostrano 15-18 parole per frase dove parlano a una persona sola e 25-36 dove parlano a professionisti.
- **Adattamento:** Obiettivo di 15-20 parole per frase nei testi che chiedono un'azione, seconda persona nelle istruzioni, termini nuovi (microfono virtuale, PipeWire) spiegati al primo uso con una frase sola e raccolti nel piede come «Parole usate».
- **Ambizione:** A5. **Regole:** RG8, RG13.
- **Prova viva:** site/sistema/#t-parole. **Verifica:** misura della lunghezza delle frasi di ogni pagina con uno script.

### D32 · adattata · componente foto: la foto vera della finestra con didascalia e testo alternativo; elenco delle frasi di stato

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (24 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P1 e P5 vedere com'è fatto il prodotto vero, anche quando qualcosa non va.
- **Motivo:** R05 mostra una schermata con gli stati (Uploading, Processing, Downloading); R50 schermate reali e un video; R52 otto schermate nel carosello; solo R05 e R50 mostrano stati diversi dal caso felice.
- **Adattamento:** La foto vera della finestra (640×500, con «Senti anche tu» acceso) con didascalia e alternativa che nomina i controlli; la foto resta più piccola (24 rem), nella pagina iniziale sotto «Cosa serve» e nella pagina In riunione al primo passo, dove spiega la riga «Pronta»; non è più l'immagine più grande del primo schermo. Le frasi vere di stato della finestra sono testo (non immagini); nessun video (non esiste una registrazione) e nessuna schermata simulata.
- **Ambizione:** A3. **Regole:** RG10, RG1.
- **Prova viva:** site/sistema/#c-foto. **Verifica:** lettura; alternativa controllata con l'albero di accessibilità.

### D33 · adattata · componente ascolto: due voci, tre frasi, un solo suono per volta, testo scritto e testo detto

- **Fonti:** R03, R05, R51 (3 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P2 capire come suona e se legge bene date, orari e importi.
- **Motivo:** R03 accoppia il suono e il testo (campioni muti con bolle di chat); R05 limita a un suono per volta; R51 offre quattro voci con pulsanti da 44 px. Nessuno mostra la frase scritta e la frase detta insieme.
- **Adattamento:** Sei registrazioni vere (Giulia e Marco, tre frasi ciascuna) con il testo digitato, il testo pronunciato e la durata (arrotondata ai secondi, uguale nel testo e nella posizione); nel primo schermo della pagina iniziale il riquadro mostra la frase dell'importo con la voce di Giulia, sulla pagina Ascolta tutte e sei; le cifre trasformate sono evidenziate nelle due righe; il pulsante cambia etichetta («Ascolta» / «Ferma») come «Unmute / Mute» di R03; altri campioni si fermano quando se ne avvia uno.
- **Ripiego** (senza_js, movimento_ridotto, lettore_schermo, tastiera): Senza script: <audio controls preload="none"> nativo per ogni campione e il testo comunque visibile. Con movimento ridotto: nessuna barra in movimento, la frase in corso resta evidenziata e la posizione è scritta.
- **Distinzione:** La coppia scritto/detto con la trasformazione delle cifre evidenziata non esiste in R03, R05, R51 né nei concorrenti.
- **Candidati:** lettore con solo i controlli nativi (R05 senza testo accanto) → eliminato da RG3; campioni muti con testo in bolle di chat (R03) → eliminato da K1; quattro pulsanti rotondi con il nome della voce (R51) → eliminato da RG3; testo scritto e testo detto a fianco, con pulsante, barre e frase evidenziata (R03 (testo accanto), R05 (un suono per volta), R06 (barrette del suono), progetto.md P2) → **scelto**
- **Ambizione:** A1, A4. **Regole:** RG3, RG5, RG6, RG10.
- **Prova viva:** site/sistema/#c-ascolto. **Verifica:** prova tastiera, senza JavaScript, movimento ridotto; riproduzione in Chromium; lacuna: Firefox e WebKit da provare.

### D34 · adattata · regola RG3: il suono parte solo dal gesto, nessun predefinito

- **Fonti:** R06 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P2 non essere sorpresa da un suono.
- **Motivo:** R06 chiede la scelta del suono prima di ogni cosa, con due scelte alla pari e nessun predefinito; Kalliope non ha una soglia d'ingresso, ma ha lo stesso rischio: il suono improvviso.
- **Adattamento:** Nessuna soglia: il sito è silenzioso finché la persona non preme «Ascolta»; il pulsante dice cosa sta per succedere («Ascolta Giulia, 6 secondi»).
- **Ambizione:** A1. **Regole:** RG3, RG6.
- **Prova viva:** site/sistema/#c-ascolto. **Verifica:** nessun audio in riproduzione al caricamento: prova in Chromium.

### D35 · adattata · regola RG3 e componente ascolto: avvio solo da gesto, preload none

- **Fonti:** R04, R05, R06, R50, R51 (5 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P2 avviare e fermare l'ascolto.
- **Motivo:** R04, R05 e R50 avviano il media solo dopo un gesto (R05 con preload none); R06 e R51 lasciano la scelta alla persona.
- **Adattamento:** Tutti gli audio hanno preload none; nessun controllo si attiva da solo; l'avvio è un pulsante con testo. Non c'è video.
- **Ambizione:** A1. **Regole:** RG3.
- **Prova viva:** site/sistema/#c-ascolto. **Verifica:** lettura degli attributi degli elementi audio.

### D36 · esclusa · nessun video di sottofondo né in ciclo

- **Fonti:** R02, R03, R53 (3 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P2 non avere movimento imposto.
- **Motivo:** R02, R03 e R53 hanno video muti in ciclo o carosello che parte da solo.
- **Esclusione (conflitto):** Conflitto con RG6 e K6: nessun movimento non provocato. Un ripiego non serve: il video non porta informazione che il testo e la foto non portino.
- **Ambizione:** A4. **Regole:** RG3, RG6.
- **Prova viva:** site/sistema/#c-ascolto. **Verifica:** nessun elemento video nel sito.

### D37 · adattata · componente ascolto: collegamento al file e messaggio se la riproduzione non parte

- **Fonti:** R21, R50, R51, R52, R53 (5 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P2 sentire anche quando il browser non riproduce.
- **Motivo:** R21, R50, R51, R52 e R53 sono stati osservati con il media non caricato; la riproduzione degli MP3 in Firefox e WebKit su Linux senza codec di sistema è da verificare.
- **Adattamento:** Il testo resta; sotto ogni campione c'è «Scarica il file (MP3, <durata>)»; se il browser rifiuta l'audio, un messaggio dice cosa fare.
- **Ripiego** (rete_lenta, senza_js): Collegamento diretto al file MP3 e testo integrale.
- **Ambizione:** A1. **Regole:** RG5.
- **Prova viva:** site/sistema/#c-ascolto. **Verifica:** prova con richiesta del file bloccata.

### D38 · adattata · componente passi: passi numerati con comando, controllo e «se non va»

- **Fonti:** R05, R50 (2 righe del confronto: caratteristica · ambito)
- **Persona:** F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F4 chi installa, per sé o per un altro, e chi pacchettizza / F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P4 installare e sapere se è riuscito.
- **Motivo:** R50 ha quattro passi numerati con schermate; R05 un paragrafo; entrambi senza comandi copiabili, senza verifica e senza ripresa; R53 non ha installazione.
- **Adattamento:** Cinque passi (scarica, controlla l'impronta, installa, apri e scarica la voce, controlla «Pronta»); sotto ciascuno «Come sai che è andata bene» e «Se non è andata»; in testa a ogni passo il numero e, a fine pagina, «Se ti sei fermato qui» con il passo da cui riprendere. La ripresa è scritta, perché il sito non salva nulla.
- **Ripiego** (senza_js, tastiera): Elenco ordinato <ol> di sezioni con titolo e ancora; nessuno stato in script.
- **Distinzione:** La verifica dopo ogni passo e la ripresa scritta non sono in R05, R50 né in altri riferimenti.
- **Candidati:** paragrafo unico di istruzioni (R05) → eliminato da K1; passi numerati con schermate (R50) → eliminato da RG11; passi numerati con comando, controllo del risultato e «se non va» (R50 (passi numerati), R05 (data dell'ultima release), progetto.md P4) → **scelto**
- **Ambizione:** A5. **Regole:** RG5, RG8, RG11.
- **Prova viva:** site/sistema/#c-passi. **Verifica:** confronto dei comandi con packaging/linux e docs/releasing.md; prova senza JavaScript.

### D39 · adattata · componente comando: blocco a spaziatura fissa con pulsante «Copia»

- **Fonti:** R50 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F4 chi installa, per sé o per un altro, e chi pacchettizza / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P4 eseguire un comando senza sbagliare.
- **Motivo:** R50 non ha comandi da terminale; R05 offre installatori; nessuno ha comandi copiabili con verifica.
- **Adattamento:** Comandi veri ricavati da packaging/linux e docs/releasing.md in un blocco selezionabile con un clic; con script un pulsante «Copia» che dice «Copiato» a parole; il nome del file e l'impronta vengono dai segnaposto.
- **Ripiego** (senza_js, tastiera): Il testo del comando è selezionabile e si copia con la tastiera; il pulsante è un'aggiunta.
- **Distinzione:** Comandi da terminale veri, con verifica dopo ciascuno: il concorrente R50 guida solo con schermate di Windows e Mac.
- **Ambizione:** A5. **Regole:** RG5, RG9, RG11.
- **Prova viva:** site/sistema/#c-comando. **Verifica:** prova senza JavaScript; confronto con i file di packaging.

### D40 · adattata · componente scelta-sistema: indice di quattro distribuzioni e sezioni sempre visibili

- **Fonti:** R05, R50 (2 righe del confronto: caratteristica · ambito)
- **Persona:** F4 chi installa, per sé o per un altro, e chi pacchettizza / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P4 trovare il proprio formato.
- **Motivo:** R05 riconosce il sistema e propone il suo pulsante con una tendina; R50 propone Windows di default anche con un browser Linux.
- **Adattamento:** Nessun riconoscimento automatico della distribuzione (il browser non la dice); quattro collegamenti (Debian/Ubuntu, Fedora, Arch, altre). Con script la scelta tiene in vista solo i blocchi di quella distribuzione nei passi 1-3 («Mostra tutte» li rimette), senza memoria sul dispositivo; senza script le sezioni sono tutte visibili e in ordine. Se il sistema è Windows, macOS o un telefono compare un riquadro compatto che manda alla pagina «Non ancora».
- **Ripiego** (senza_js): Le sezioni sono tutte in pagina e raggiungibili da un indice di collegamenti; nessun contenuto nascosto in schede.
- **Ambizione:** A2, A5. **Regole:** RG5.
- **Prova viva:** site/sistema/#c-scelta-sistema. **Verifica:** prova senza JavaScript; prova con user agent Windows e macOS.

### D41 · esclusa · nessuna finestra di consenso né sovrapposizione al primo arrivo

- **Fonti:** R05, R53 (3 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 leggere subito.
- **Motivo:** R53 copre parte del testo con la finestra di consenso; R05 sovrappone tre messaggi al telefono.
- **Esclusione (vincolo):** Il sito non usa cookie né statistiche [P]: non serve consenso e nulla si sovrappone al primo schermo. Il fatto resta scritto nel piede.
- **Ambizione:** A2. **Regole:** RG7.
- **Prova viva:** site/sistema/#c-piede. **Verifica:** nessun elemento sovrapposto al primo schermo.

### D42 · adattata · token colore con variante scura che segue il sistema (prefers-color-scheme)

- **Fonti:** R52 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 leggere con il tema che la persona ha già scelto nel sistema.
- **Motivo:** R52 ha un interruttore sole/luna e segue il tema del sistema; R53 e altri sono scuri per scelta di design.
- **Adattamento:** Il tema segue il sistema; non c'è un interruttore perché richiederebbe memoria locale e un comando in più. La variante scura mantiene gli stessi rapporti di contrasto.
- **Ripiego** (contrasto, colori_forzati): In modalità forzata decide il sistema; il sito non impone colori.
- **Distinzione:** Il tema non ha interruttore e usa i colori di Kalliope (carta e verde acqua dell'icona), non gli azzurri di R52.
- **Ambizione:** A4. **Regole:** RG2, RG7.
- **Prova viva:** site/sistema/#t-colori. **Verifica:** contrasto-qa in tema chiaro e scuro.

### D43 · esclusa · nessun menu a pannello o a comparsa

- **Fonti:** R02, R04, R05, R20, R21, R50, R51, R52 (10 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1 raggiungere cinque destinazioni.
- **Motivo:** I menu a pannello dei riferimenti (150-600 ms) nascondono le voci dietro un pulsante.
- **Esclusione (compito):** Con cinque voci il compito è raggiungerle in un gesto: nasconderle aggiunge un passo e un comando che dipende da script. Le voci sono sempre in vista (D04).
- **Ambizione:** A5. **Regole:** RG5, RG9.
- **Prova viva:** site/sistema/#c-nav. **Verifica:** nessun elemento a comparsa nella navigazione.

### E01 · adattata · componente disclosure: dissolvenza di 120 ms all'apertura di un dettaglio, istantanea con movimento ridotto

- **Fonti:** R01, R02, R04, R05, R21, R50, R51, R52, R53 (30 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P5 aprire un dettaglio e capire che è successo qualcosa.
- **Motivo:** Le aperture di pannelli, menu, finestre e fisarmoniche dei riferimenti durano da 150 a 600 ms (oltre 240 ms solo nei pannelli a tutto schermo): un cambio di stato che la persona ha provocato.
- **Adattamento:** Un'unica apertura breve per i dettagli (dissolvenza di 120 ms, curva ease-out) e nessun pannello a tutto schermo; la dissolvenza porta l'informazione «si è aperto»; senza movimento il dettaglio appare di colpo con il simbolo che cambia da + a −.
- **Ripiego** (movimento_ridotto, senza_js, tastiera): Con movimento ridotto durata 0 e il cambio del simbolo e dell'etichetta («Chiudi») porta l'informazione; senza script <details> funziona.
- **Ambizione:** A4. **Regole:** RG5, RG6.
- **Prova viva:** site/sistema/#c-disclosure. **Verifica:** controllo della durata computata e prova con prefers-reduced-motion.

### E02 · esclusa · nessuna comparsa all'ingresso per scorrimento

- **Fonti:** R02, R04, R05, R22, R52, R53 (11 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 leggere senza attendere un effetto.
- **Motivo:** Le comparse di sezione dei riferimenti (opacità e traslazione di 25-50 px in 300-1000 ms) nascondono il contenuto finché un evento non lo mostra; senza script o a movimento ridotto restano blocchi vuoti (R01, R02, R04).
- **Esclusione (conflitto):** Conflitto con RG5 e RG6: il contenuto è visibile subito e nessun movimento è privo di informazione. Un ripiego darebbe il contenuto subito visibile, che è già il comportamento di base.
- **Ambizione:** A4. **Regole:** RG5, RG6.
- **Prova viva:** site/sistema/#c-movimento. **Verifica:** nessuna comparsa: contenuto visibile alla prima foto.

### E03 · esclusa · nessun movimento ciclico o decorativo

- **Fonti:** R03, R05, R50, R52, R53 (7 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 leggere senza distrazioni.
- **Motivo:** Grana animata, puntini di digitazione, scheletri che pulsano, spinner, anelli che pulsano, dissolvenze infinite e video in ciclo si muovono senza essere stati provocati.
- **Esclusione (conflitto):** Conflitto con RG6 e K6 (persone con mutismo selettivo o autismo, tremore, attenzione fragile): non portano informazione. Dove l'attesa è vera (il file audio che carica) il testo «Carico il file…» sostituisce lo spinner.
- **Ambizione:** A4. **Regole:** RG6.
- **Prova viva:** site/sistema/#c-movimento. **Verifica:** nessuna animazione infinita nel sito (controllo con le animazioni computate).

### E04 · esclusa · scorrimento nativo, senza smorzamento, parallasse, cursore personalizzato né passaggio automatico

- **Fonti:** R02, R04, R06, R20, R22 (11 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 controllare la velocità dello scorrimento.
- **Motivo:** Lenis, scorrimento virtuale, parallasse, cursori che seguono il mouse e il passaggio automatico al progetto seguente tolgono il controllo della velocità a chi ha tremore o usa un interruttore.
- **Esclusione (conflitto):** Conflitto con RG9 (scorrimento nativo) e RG6: la persona controlla ciò che si muove. Il comportamento nativo del browser è già il ripiego.
- **Ambizione:** A5. **Regole:** RG6, RG9.
- **Prova viva:** site/sistema/#c-movimento. **Verifica:** nessuna libreria di scorrimento nel sito.

### E05 · esclusa · intestazione di altezza costante, non fissa e senza trasformazioni allo scorrimento

- **Fonti:** R03, R04, R05, R06, R50, R51 (8 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 non perdere il testo sotto un elemento fisso.
- **Motivo:** Le intestazioni che si compattano, cambiano con la direzione di scorrimento o diventano barre di prodotto coprono il testo a zoom 200% e al focus; R05 sovrappone un pannello fisso al pulsante di una scheda.
- **Esclusione (conflitto):** Conflitto con RG9 e RG6: un elemento fisso o mobile copre il focus e il testo ingrandito; il ripiego (intestazione ferma in cima alla pagina) non richiede alcuna trasformazione.
- **Ambizione:** A5. **Regole:** RG6, RG9.
- **Prova viva:** site/sistema/#c-nav. **Verifica:** prova a testo 200% e zoom 200%: nessun elemento fisso.

### E06 · esclusa · nessun banner di consenso, nessuna introduzione all'arrivo

- **Fonti:** R03, R04, R05, R20, R53 (7 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 leggere subito.
- **Motivo:** Banner di consenso e introduzioni animate (R20 dura 6-12 secondi) precedono il contenuto.
- **Esclusione (vincolo):** Niente cookie né statistiche [P]: nessun consenso da chiedere; il compito P1 chiede di capire in pochi secondi, quindi nessuna introduzione.
- **Ambizione:** A2. **Regole:** RG4, RG7.
- **Prova viva:** site/sistema/#c-piede. **Verifica:** la prima foto mostra già proposta e stato.

### E07 · adattata · componente percorso: posizione («Passo N di 5») e «cosa viene dopo» come informazione fissa, senza transizioni

- **Fonti:** R20 (5 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P5 sapere dove sono e dove vado.
- **Motivo:** L'isola contestuale di R20 tiene in un solo oggetto categoria, anteprima, selettore e contatore, con transizioni di 500-1400 ms.
- **Adattamento:** Si conserva la funzione (dove sei, cosa succede dopo) e si toglie la forma: «Passo N di 5» e il collegamento «Avanti» sono testo fisso. Dichiarato: l'attenuazione toglie ciò che rendeva l'isola spettacolare (la metamorfosi della pillola); resta ciò che serve alla persona.
- **Ripiego** (movimento_ridotto, tastiera): Nessuna transizione: l'informazione è già in testo.
- **Ambizione:** A5. **Regole:** RG6.
- **Prova viva:** site/sistema/#c-percorso. **Verifica:** prova tastiera e movimento ridotto.

### E08 · esclusa · nessun riquadro di dialogo dal vivo né passo di consenso

- **Fonti:** R03 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P2 ascoltare un campione registrato.
- **Motivo:** R03 trasforma una pillola fissa in un riquadro con consenso a registrare e a condividere dati con terzi per parlare con un agente.
- **Esclusione (compito):** Kalliope non ha una conversazione dal vivo sul sito: i campioni sono registrazioni; non c'è nulla da registrare né un consenso da chiedere.
- **Ambizione:** A1. **Regole:** RG3, RG7.
- **Prova viva:** site/sistema/#c-ascolto. **Verifica:** nessuna richiesta di microfono né consenso nel sito.

### E09 · esclusa · nessun carosello né scheda che sostituisce il contenuto

- **Fonti:** R03, R04, R52 (4 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P2 e P5 vedere tutte le scelte insieme.
- **Motivo:** Carosello e schede a scambio fanno vedere un solo elemento alla volta e nascondono gli altri.
- **Esclusione (compito):** Le sei registrazioni, le cinque distribuzioni e le frasi dell'Aiuto sono poche e vanno confrontate: devono stare tutte in pagina. Con le schede il contenuto nascosto non si trova con la ricerca del browser.
- **Ambizione:** A5. **Regole:** RG5.
- **Prova viva:** site/sistema/#c-scelta-sistema. **Verifica:** tutte le sezioni visibili senza gesto.

### E10 · adattata · componente scelta-sistema: l'etichetta della voce scelta cambia colore e simbolo in 120 ms

- **Fonti:** R05, R51 (2 righe del confronto: caratteristica · ambito)
- **Persona:** F4 chi installa, per sé o per un altro, e chi pacchettizza. **Compito:** P4 capire quale sezione è attiva.
- **Motivo:** R51 cambia il colore dell'etichetta di scheda in 150 ms e dissolve il pannello; R05 sposta un indicatore sulla scheda della FAQ.
- **Adattamento:** Si conserva solo il segnale di stato sull'indice delle distribuzioni (testo e sottolineatura quando la sezione è raggiunta), senza sostituire il contenuto.
- **Ripiego** (movimento_ridotto): Istantaneo con movimento ridotto; il segno non è il solo colore.
- **Ambizione:** A5. **Regole:** RG6.
- **Prova viva:** site/sistema/#c-scelta-sistema. **Verifica:** prova movimento ridotto.

### E11 · esclusa · nessun conteggio animato dei numeri

- **Fonti:** R04 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F3 chi controlla (IT, privacy, legale, acquisti) / F5 chi guarda da fuori (stampa, associazioni, ricercatori). **Compito:** P7 leggere una cifra senza attendere.
- **Motivo:** R04 fa crescere la cifra da zero in 1500 ms con le barre, con la frase completa già nel DOM.
- **Esclusione (conflitto):** Conflitto con RG6: contare una cifra non porta informazione e ritarda chi legge con lentezza. Si trasferisce solo il principio (la frase intera già nel documento) con RG5 e D29.
- **Ambizione:** A4. **Regole:** RG5, RG6.
- **Prova viva:** site/sistema/#c-misura. **Verifica:** le cifre sono nel testo al caricamento.

### E12 · adattata · componente filtro: scrivendo parte della frase, l'elenco si restringe e la parte coincidente è in grassetto

- **Fonti:** R04, R22 (2 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P5 trovare la frase della finestra.
- **Motivo:** R22 mostra suggerimenti con la parte coincidente in grassetto; R04 mostra l'incertezza accanto al dato.
- **Adattamento:** Il filtro dell'Aiuto riduce l'elenco mentre si scrive e dichiara quante frasi restano («3 frasi»), con la parte coincidente in grassetto; senza movimento: l'elenco si aggiorna di colpo.
- **Ripiego** (senza_js, movimento_ridotto, lettore_schermo): Senza script l'elenco è completo; il numero di risultati è annunciato con una regione aria-live educata.
- **Ambizione:** A3. **Regole:** RG5, RG6.
- **Prova viva:** site/sistema/#c-filtro. **Verifica:** prova con tastiera, senza JavaScript e lettore (proxy).

### E13 · esclusa · nessun grafico guidato dallo scorrimento né dal puntatore

- **Fonti:** R22 (4 righe del confronto: caratteristica · ambito)
- **Persona:** F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P7 leggere le misure.
- **Motivo:** Le uova, i nidi, la mappa e il grafico a linee di R22 cambiano con lo scorrimento o il puntatore e non hanno alternativa da tastiera.
- **Esclusione (compito):** Le misure di Kalliope sono sei numeri con metodo: una tabella con la frase accanto serve il compito (D29); non esistono serie geografiche o temporali da disegnare.
- **Ambizione:** A2. **Regole:** RG14.
- **Prova viva:** site/sistema/#c-misura. **Verifica:** nessuna.

### E14 · adattata · stato dei comandi: hover e focus identici, transizione di 100 ms su colore e sottolineatura

- **Fonti:** R01, R02, R03, R04, R21, R50, R51, R53 (10 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 sapere cosa è comandabile e cosa ha il focus.
- **Motivo:** I riferimenti cambiano colore, ombra o bordo in 50-300 ms al passaggio e al focus.
- **Adattamento:** Un solo stato per hover e focus: colore e sottolineatura in 100 ms; il focus ha in più l'anello. Nessuna informazione esiste solo al passaggio del mouse.
- **Ripiego** (movimento_ridotto, tastiera, tocco): Con movimento ridotto il cambio è istantaneo; su tocco non c'è passaggio e lo stato premuto lo sostituisce.
- **Ambizione:** A5. **Regole:** RG6, RG9.
- **Prova viva:** site/sistema/#c-bottone. **Verifica:** prova hover, focus e pressione con foto.

### E15 · esclusa · nessun effetto che segue il puntatore

- **Fonti:** R01, R20, R22 (3 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 usare il sito senza puntatore.
- **Motivo:** Il gradiente che segue il mouse (R01), il cerchio con «+» (R20) e le pupille che seguono il cursore (R22) dipendono dal puntatore e non portano informazione.
- **Esclusione (conflitto):** Conflitto con RG6 e RG9: puntamento oculare, interruttore e tocco non hanno un puntatore che passa; il gesto di ricompensa senza scopo non serve al compito.
- **Ambizione:** A5. **Regole:** RG6, RG9.
- **Prova viva:** site/sistema/#c-movimento. **Verifica:** nessuna regola che segua il puntatore.

### E16 · adattata · componente condividi: indirizzo della pagina in un campo selezionabile e pulsante «Copia l'indirizzo»

- **Fonti:** R21 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P3 inoltrare il collegamento a chi installerà.
- **Motivo:** R21 allarga un cerchio «Share» in sei icone di reti sociali e e-mail; per Kalliope serve solo copiare l'indirizzo.
- **Adattamento:** Nessuna icona di terzi: un campo di sola lettura con l'indirizzo e, con script, il pulsante «Copia l'indirizzo» che risponde a parole.
- **Ripiego** (senza_js, tastiera): Il campo è selezionabile con la tastiera; senza script resta il testo.
- **Ambizione:** A5. **Regole:** RG5, RG7.
- **Prova viva:** site/sistema/#c-condividi. **Verifica:** prova senza JavaScript.

### E17 · adattata · token colore: variante scura con lo stesso schema di ruoli

- **Fonti:** R52 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 leggere con il tema del sistema.
- **Motivo:** R52 scambia le icone e cambia lo sfondo in 200-300 ms al cambio di tema.
- **Adattamento:** Il cambio avviene con il sistema e non dal sito: nessuna transizione, nessun interruttore.
- **Ripiego** (contrasto, colori_forzati): In modalità forzata decide il sistema.
- **Distinzione:** Variante scura nei colori di Kalliope (inchiostro verde scuro e verde acqua), senza interruttore: diversa da R52.
- **Ambizione:** A4. **Regole:** RG2.
- **Prova viva:** site/sistema/#t-colori. **Verifica:** contrasto-qa in tema scuro.

### E18 · esclusa · nessuna scena WebGL né sequenza di caricamento

- **Fonti:** R01 (2 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 capire senza attendere.
- **Motivo:** R01 carica una scena WebGL (11,4 MB, 1 fotogramma al secondo in software) con una mano che ruota e un titolo che si scrive lettera per lettera.
- **Esclusione (vincolo):** Sito statico leggero, nessuna dipendenza né peso inutile (progetto.md §9): la scena richiederebbe una libreria di rendering e megabyte. Il gesto «il prodotto che lavora davanti a te» si conserva in A4 con le barre della voce, senza WebGL.
- **Ambizione:** A4. **Regole:** RG7.
- **Prova viva:** site/sistema/#c-movimento. **Verifica:** nessun canvas nel sito.

### E19 · adattata · componente ascolto: cinque barre dell'icona come indicatore del suono; il gesto del titolo diventa il gesto «Ascolta»

- **Fonti:** R05, R06 (4 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P2 vedere che la voce sta parlando e dove.
- **Motivo:** R06 lega il titolo («sliding doors») a un gesto: la porta si apre al clic sul suono; ha anche barrette che indicano il suono acceso o spento. R05 tiene un solo suono per volta e un riproduttore a pulsanti.
- **Adattamento:** Cinque barre arrotondate (come l'icona) che si alzano seguendo il livello della voce mentre suona e restano ferme e piene a suono finito; il gesto è il solo pulsante «Ascolta». Dichiarato: la scenografia della porta è attenuata a una sola animazione di barre; si conserva il legame fra gesto, tema e suono.
- **Ripiego** (movimento_ridotto, senza_js, lettore_schermo): Con movimento ridotto le barre restano ferme e piene; la frase in corso è evidenziata e la posizione scritta («frase 1 di 2, 00:03»). Senza script: controlli nativi dell'audio.
- **Distinzione:** Barre dell'icona di Kalliope legate alla voce vera e al testo in corso; R06 usa barrette per acceso/spento senza voce.
- **Candidati:** sfera di colore come stato della voce (R03) (R03) → eliminato da K5; scena animata che racconta il titolo (porta, treno: R06) (R06) → eliminato da K2; avatar 3D che esegue il prodotto (R01) (R01) → eliminato da K2; cinque barre dell'icona che seguono il livello della voce (icona dell'app (K5), R06 M07 per l'idea delle barrette) → **scelto**
- **Ambizione:** A1, A4. **Regole:** RG3, RG6.
- **Prova viva:** site/sistema/#c-ascolto. **Verifica:** prova con e senza movimento ridotto; foto della sequenza a 0, 1, 2 secondi.

### E20 · esclusa · nessuna soglia animata, scena di treno, frecce di capitolo né avvertenza ritardata

- **Fonti:** R06 (6 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 capire e decidere con calma.
- **Motivo:** R06 apre con una soglia, una scena di treno, frecce da 1000 ms e un pannello di avvertenza che compare dopo 2-8 secondi e scompare da solo.
- **Esclusione (conflitto):** Conflitto con RG4 (lo stato prima della promessa, senza ritardo né scomparsa) e RG6: la scena e il ritardo sono incompatibili con il cartellino fisso (D24); il tema narrativo non esiste nel sito.
- **Ambizione:** A2. **Regole:** RG4, RG6.
- **Prova viva:** site/sistema/#c-stato. **Verifica:** il cartellino di stato è nella prima foto.

### E21 · esclusa · nessuno scorrimento a velocità diverse per elemento

- **Fonti:** R20 (1 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1 leggere dal telefono.
- **Motivo:** R20 al telefono mantiene il parallasse del computer.
- **Esclusione (conflitto):** Conflitto con RG9: lo scorrimento è quello nativo del telefono.
- **Ambizione:** A5. **Regole:** RG9.
- **Prova viva:** site/sistema/#c-movimento. **Verifica:** nessuna.

### D44 · adattata · regola RG6/RG15 e tutte le varianti prefers-reduced-motion: l'effetto è sostituito da un equivalente fermo

- **Fonti:** R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 (13 righe del confronto: caratteristica · ambito)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 non subire movimento e non perdere informazione.
- **Motivo:** Nei tredici siti con la riga misurata nessuno sostituisce un effetto con un'alternativa: R52, R21 e in parte R03, R53, R22, R50 lo tolgono; R01, R02, R04, R05, R06, R20 e R51 lo lasciano invariato. Il ripiego richiesto dal metodo è ridurre o sostituire, non solo togliere.
- **Adattamento:** Ogni effetto del sito ha la sua variante ridotta con lo stesso contenuto: le barre dell'ascolto restano ferme e piene e la frase in corso resta evidenziata con la posizione scritta; la dissolvenza dei dettagli è istantanea con il cambio di simbolo; lo stato dei comandi cambia colore di colpo.
- **Ripiego** (movimento_ridotto): Sostituzione, non rimozione: evidenziazione fissa e testo di posizione al posto del movimento delle barre; cambio di simbolo e di etichetta al posto della dissolvenza.
- **Distinzione:** Nessun riferimento sostituisce: la sostituzione con evidenziazione e posizione scritta è una scelta di Kalliope (regola proposta RG15).
- **Candidati:** lasciare l'effetto invariato (R01, R02, R04, R05, R06, R20, R51) (R04, R05, R06) → eliminato da RG2; togliere l'effetto (R52, R21) (R52, R21) → eliminato da RG15; sostituire l'effetto con un equivalente fermo che porta la stessa informazione (references/direzione.md §2 (ridurre o sostituire); progetto.md §4.2) → **scelto**
- **Ambizione:** A4. **Regole:** RG2, RG6.
- **Prova viva:** site/sistema/#c-movimento. **Verifica:** confronto tra foto normale e foto con prefers-reduced-motion per ogni effetto; verifica delle animazioni computate.

### T01 · progettuale · token colore: verde acqua scuro per testo e comandi, verde acqua dell'icona per barre e grafica

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P1-P6 riconoscere Kalliope e leggere con contrasto.
- **Motivo:** L'unico segno di marca esistente è l'icona (bolla con gradiente da #2fb39a a #16806f e cinque barre bianche). Il verde chiaro non regge il testo (2,4:1 su carta); la tinta scura derivata (#0a5347, 8,3:1 su carta, 7,5:1 su carta-2, 9,0:1 con testo bianco) regge testo e bottoni; #16806f (4,5:1) resta per barre e grafica.
- **Candidati:** #2fb39a come colore di testo e di bottone (icona dell'app) → eliminato da K3; blu notte con turchese chiaro (R53) → eliminato da K4; rosso pieno per il comando principale (R50) → eliminato da K4; bordeaux per collegamenti e comandi (R51) → eliminato da K5; viola su vetro scuro (R01) → eliminato da K5; #0a5347 per testo e comandi, #16806f per barre e grafica (derivato dall'icona dell'app, verificato per contrasto) → **scelto**
- **Ambizione:** A1, A4. **Regole:** RG1.
- **Prova viva:** site/sistema/#t-colori. **Verifica:** contrasto-qa in tema chiaro e scuro.

### T02 · progettuale · token colore: sfondo carta #f8f6f0, inchiostro #1b2623, variante scura che segue il sistema

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 leggere a lungo senza abbagliamento.
- **Motivo:** Una carta calda e un inchiostro verde scurissimo danno 14,4:1 senza il bianco puro dei concorrenti e senza il fondo scuro obbligato; la variante scura (#10181a con testo #e9efec, 15,4:1) segue il sistema.
- **Candidati:** bianco puro con testo nero (R50, R51, R52) → eliminato da K4; fondo scuro come tema predefinito (R53, R01) → eliminato da K4; carta #f8f6f0 con inchiostro #1b2623 (scelta progettuale) → **scelto**
- **Ambizione:** A4. **Regole:** RG1.
- **Prova viva:** site/sistema/#t-colori. **Verifica:** contrasto-qa in tema chiaro e scuro.

### T03 · progettuale · token tipografia: carattere di sistema per il testo, carattere a spaziatura fissa per il testo digitato

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P2 distinguere il testo scritto dal testo detto.
- **Motivo:** Nessun carattere ospitato: non c'è in questo ambiente un file con licenza libera verificata e il vincolo è di non aggiungere peso né richieste. L'identità tipografica sta nella distinzione fra il testo digitato (spaziatura fissa, come nel campo della finestra) e il testo detto (carattere del corpo).
- **Candidati:** carattere remoto da un servizio di caratteri (R50 (Poppins, Open Sans), R52 (Quicksand)) → eliminato da K2; carattere ospitato nel sito con licenza OFL (R51 usa un carattere proprio) → eliminato da K2; carattere di sistema per il corpo e a spaziatura fissa per il testo digitato (scelta progettuale; campo di testo dell'app) → **scelto**
- **Ambizione:** A1. **Regole:** RG1, RG7.
- **Prova viva:** site/sistema/#t-tipografia. **Verifica:** prova nei tre motori (carattere di sistema diverso per sistema): lacuna fino alla matrice completa.

### T04 · progettuale · token forma: riquadri a bolla di fumetto (raggio 18 px), barre a capsula

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 riconoscere la famiglia visiva.
- **Motivo:** L'icona è una bolla con angoli ampi e barre a capsula: la stessa geometria dà il carattere ai riquadri, ai cartellini e ai bottoni.
- **Candidati:** riquadri a spigolo vivo (uso comune dei siti di prodotto) → eliminato da K5; pillole per ogni comando e voce di menu (R20, R05) → eliminato da K4; bolla con raggio 18 px e barre a capsula (icona dell'app) → **scelto**
- **Ambizione:** A4. **Regole:** RG1.
- **Prova viva:** site/sistema/#t-forme. **Verifica:** lettura delle foto del percorso.

### T05 · progettuale · token motivo: cinque barre a capsula di altezze diverse (come l'icona) per indicatore del suono, divisore di sezione e segno del cartellino

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P2 e P1 vedere la voce e riconoscere il prodotto.
- **Motivo:** Le cinque barre dell'icona sono il solo segno di marca e rappresentano già una voce: usarle come indicatore del suono lega l'identità al compito.
- **Candidati:** sfera di colore (R03) → eliminato da K5; punti braille che formano il marchio (R02) → eliminato da K5; cinque barre a capsula dell'icona (icona dell'app) → **scelto**
- **Ambizione:** A4. **Regole:** RG1, RG6.
- **Prova viva:** site/sistema/#t-forme. **Verifica:** foto dell'ascolto a riposo, in riproduzione e con movimento ridotto.

### T06 · progettuale · token spazi: scala di 4 px (4, 8, 12, 16, 24, 32, 48, 64, 96), colonna di testo di 62 caratteri, bersagli di 44 px

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento. **Compito:** P1-P6 ritmo di lettura prevedibile.
- **Motivo:** Una scala unica evita valori occasionali; la colonna di 62 caratteri e i bersagli di 44 px vengono da RG8 e RG9.
- **Ambizione:** A5. **Regole:** RG1, RG8, RG9.
- **Prova viva:** site/sistema/#t-spazi. **Verifica:** esame-impaginazione.

### T07 · progettuale · token movimento: durate 0 (ridotto), 100, 120 e 240 ms; il movimento del suono dura quanto il suono

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità). **Compito:** P1-P6 movimento breve e prevedibile.
- **Motivo:** RG6 limita ogni cambio di stato a 240 ms; i riferimenti misurati tengono da 100 a 600 ms per le aperture e i cambi di stato.
- **Ripiego** (movimento_ridotto): Con prefers-reduced-motion tutte le durate vanno a 0 e le informazioni sono portate da simbolo, etichetta ed evidenziazione.
- **Ambizione:** A4. **Regole:** RG1, RG6.
- **Prova viva:** site/sistema/#t-movimento. **Verifica:** verifica delle durate computate.

### T08 · progettuale · composizione del sito: pagina iniziale con l'ascolto nel primo schermo e cammino in cinque pagine (Ascolta, Stato e limiti, Installa, In riunione, Aiuto), pagina Non ancora, 404, catalogo

- **Fonti:** nessuna (scelta progettuale)
- **Persona:** F1 chi scrive per parlare (SLA, afasia, laringectomia, disartria, balbuzie, mutismo selettivo, autismo, sordità) / F2 familiare, logopedista o educatore che legge dal telefono e inoltra il collegamento / F3 chi controlla (IT, privacy, legale, acquisti). **Compito:** P1-P6 un compito per pagina, con indirizzo proprio da inoltrare e conservare.
- **Motivo:** Tre direzioni sono state confrontate sugli stessi contenuti (una pagina narrata, un cammino a pagine per compito, porte per persona); il cammino a pagine vince per inoltro, aiuto da segnalibro, carico di lettura e tastiera (confronto in direzione.md).
- **Ambizione:** A2, A3, A5. **Regole:** RG1, RG5.
- **Prova viva:** site/index.html. **Verifica:** percorso completo con foto a 1440×900 e 390×844.

## 8. Decisioni provvisorie del coordinatore (in attesa di conferma del proprietario)

Da `design/incarichi/costruzione.md`, dubbi di `progetto.md` §12. Il sito le adotta e le dichiara come provvisorie nel catalogo.

- **A**: nessun indirizzo e-mail per ora; le segnalazioni passano dalle issue di GitHub, che richiedono un account; il sito lo dice.
- **B**: solo italiano, con `lang="it"` e una struttura che permette altre lingue in seguito (testi di interfaccia raccolti, nessuna stringa nel CSS).
- **E**: a chi ha Windows o macOS il sito dice «non ancora» e perché (serve un driver firmato su Windows e un componente audio approvato da Apple su macOS) e come seguire le novità (release su GitHub); nessun prodotto di terzi consigliato.
- **F**: una frase breve: Kalliope non è un dispositivo medico e non sostituisce la valutazione di un logopedista.
- **G**: i sei campioni sono l'uscita di Kalliope 0.1-rc.1 senza ritocchi, in MP3 a 64 kbit/s, mono, 24 kHz; Whisper li trascrive con circa una parola sbagliata su 45.

## 9. Esito del controllo del metodo

```
73 decisioni: trasferita 1, adattata 43, esclusa 20, progettuale 9
esclusioni per motivo: vincolo 6, compito 5, conflitto 9
ambizione: A1 servita da 12, A2 servita da 19, A3 servita da 5, A4 servita da 19, A5 servita da 24
unica fonte dei valori d'identità: R51 (concorrente) 1
copertura del confronto: 432/432 varianti con destinazione o esclusione

Nessun errore del metodo (la qualità visiva resta alla revisione)
```

## 10. Che cosa il controllo non dice

- **Qualità visiva**: la rivede il ruolo visivo con le foto del percorso (`design/prove-percorso/`); questo controllo verifica il metodo, non l'aspetto.
- **Dispositivi e motori**: il percorso è provato solo in Chromium, 1440×900 e 390×844; la matrice di 15 dispositivi per tre motori parte dopo l'approvazione.
- **Ausili veri** (puntamento oculare, interruttore, lettore di schermo): non disponibili; si usa l'albero di accessibilità come proxy e la tastiera.
- **R50-R53**: osservazioni controllate e confrontate; le schede e gli inventari del movimento erano in scrittura da parte del visitatore alla generazione di questa vista.
- **Righe «effetto o animazione» di R04, R05 e R06** aggiunte dal worker di costruzione dagli inventari del movimento, con solo il trigger letto (vedi `copertura.md`, «Integrazioni»).

