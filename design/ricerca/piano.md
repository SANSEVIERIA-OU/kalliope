# Piano della ricerca di Kalliope

Data: 12/11/2026 · Redatto da: design-build (attività `research-plan`) · Fonti del metodo: `metodo.md` §2,
`riferimenti.md`, `confronto.md`, `catalogo.md`, `movimento.md` (skill `design-system-generator` 0.45.0).
Parte dalla scheda `design/progetto.md` (percorsi P1-P10, persone F1-F6, vincoli §9). Non dice nulla sull'aspetto
del sito: dice **chi studiare, perché e cosa chiedere a ogni visita**.

Il piano è pronto quando due ricercatori possono partire senza altre domande. Qui trovano: i compiti da imparare (§1),
le categorie da cercare (§3), quanti riferimenti servono e quando fermarsi (§5), le loro query e le loro consegne (§6),
le domande (§7), le parole fisse per le osservazioni (§8) e come si visita in questo ambiente (§9).

---

## 0. Cosa il piano fa e non fa

- **Fa:** traduce i percorsi del sito in compiti di design; sceglie le vie di ricerca (settore, meccanismo, superficie,
  competenza); elenca le categorie Webby da cercare con il motivo; fissa la copertura; divide la ricerca in due gruppi
  indipendenti; scrive le domande e il vocabolario comune delle osservazioni.
- **Non fa:** non nomina vincitori (si verificano nel catalogo ufficiale); non sceglie colori, caratteri, forme o
  composizioni; non anticipa la direzione; non usa lo storico per scegliere (si consulta **dopo** le schede
  indipendenti: `storico/LEGGIMI.md`).
- **Un limite dichiarato.** Per verificare i nomi delle categorie ho tentato di leggere il catalogo ufficiale, ma
  l'accesso diretto è stato bloccato da una regola del plugin («delega la ricerca a `vibe-next:research`»). I nomi di
  categoria in §3 sono quindi **indizi** presi dal registro dell'edizione 2026 della skill (consultato il
  20-21/10/2026 da altri raccoglitori, per le sole categorie di mestiere) e vanno **riletti nel catalogo ufficiale**
  da chi cerca. Le categorie «di settore» (genere) non sono nel registro: le elenca il ricercatore.
- **Riferimenti dell'utente.** Il proprietario non ne ha indicati. `riferimenti.md` §2.1 chiede di partire da quelli
  della persona: il coordinatore lo chiede una volta ai traguardi; intanto la ricerca parte.

---

## 1. I compiti di design da imparare (dai percorsi del sito)

Ogni riga: il compito che il sito deve saper fare, i percorsi di `progetto.md` che lo richiedono, la competenza da
approfondire, le famiglie di osservazione di `riferimenti.md` (le 15 parole fisse) e la sezione del catalogo
(`catalogo.md`) che il riferimento informerà.

| ID | Compito | Percorsi | Competenza di design | Famiglie | Informa nel catalogo |
|---|---|---|---|---|---|
| C1 | Far capire in pochi secondi a chi non conosce un servizio nuovo cosa fa, per chi è, cosa serve | P1 | Pagina d'arrivo che spiega un servizio, gerarchia della proposta, primo schermo | struttura, testo, navigazione | Anteprime; Spazi e composizioni; Tipografia e parole |
| C2 | Far **sentire** una voce, con il testo accanto e controllo totale | P2 | Dimostrazione di suono: comandi, un ascolto alla volta, alternative, avvio mai automatico | suono, testo, gesto, risposta | Dati e media; Interazioni; Accessibilità |
| C3 | Mostrare il prodotto vero (una finestra di software, i suoi stati) senza simularlo | P1, P2, P4 | Immagine del prodotto: foto reale, schermata, dimostrazione viva; legenda e testo alternativo | immagine, testo, dati | Icone e immagini; Anteprime |
| C4 | Guidare un'installazione a passi, con comandi copiabili, verifica del risultato e ripresa | P4 | Guida a passi e ripresa; scelta per sistema; comandi; verifica; recupero da errore | avanzamento, aiuto, risposta, gesto | Componenti di dominio; Interazioni |
| C5 | Dire con onestà stato, limiti e cosa il prodotto non fa, **prima** di ogni promessa | P1, P3, P6 | Fiducia e tono onesto: stato, versioni, «non provato», cosa manca | fiducia, testo | Tipografia e parole (tono); Componenti di dominio |
| C6 | Scrivere semplice per chi legge con difficoltà; corto subito e lungo a richiesta | tutti | Linguaggio chiaro, lettura facilitata, livelli di dettaglio, frasi corte | testo, aiuto | Tipografia e parole; Accessibilità |
| C7 | Usabilità motoria e oculare: tastiera, interruttore, puntamento a permanenza; niente tempo o passaggio del mouse obbligatori | tutti | Interazione alternativa: ordine di tabulazione, bersagli, nessun gesto complesso | gesto, risposta, navigazione | Interazioni; Accessibilità |
| C8 | Dare fatti verificabili a chi controlla: fonti, impronte, licenze, misure con metodo | P7, P8 | Presentazione di prove, dati e documenti tecnici a pubblici esperti | fiducia, dati, testo | Dati e media; Provenienza |
| C9 | Instradare pubblici diversi con porte e livelli (persona, familiare, logopedista, tecnico, chi controlla) | P1, P3, P7, P8 | Navigazione per pubblici e compiti; «la stessa cosa detta a chi» | navigazione, struttura, testo | Persone e percorsi; Navigazione |
| C10 | Aiuto per l'uso ricorrente e la risoluzione dei problemi (tabelle «provato / non provato», cause e azioni) | P5, P9 | Documentazione d'uso, ricerca interna senza script, diagnosi a causa e azione | aiuto, navigazione, risposta | Componenti di dominio; Interazioni |
| C11 | Leggere e inoltrare dal telefono (lettura lunga, bersagli, collegamenti diretti alle sezioni, stampa) | P1, P3 | Responsive e lettura da mobile; condivisione; stampa | struttura, testo, gesto | Spazi e composizioni (responsive); Prove |
| C12 | Stati vuoti, di errore e «non è per te» che recuperano senza colpa | P4, P5, P6 | Pagine e messaggi di errore, di vuoto e di non disponibilità | risposta, testo, aiuto | Interazioni; Tipografia e parole |
| C13 | Dare carattere a un prodotto di voce con movimento e suono che portano significato e hanno un ripiego | P1, P2 | Motion design, effetti, ritmo; scelte sul suono; variante ridotta | movimento, suono, colore, forma | Movimento ed effetti; Colori e materiali |
| C14 | Pagine leggere e robuste: senza terze parti, senza JavaScript, con dati vivi inseriti da uno script | P10, vincoli §9 | Prestazioni, miglioramento progressivo, sorgente unica dei dati | dati, struttura | Prestazioni e canali; Token |

---

## 2. Le vie di ricerca

`metodo.md` §2 e `riferimenti.md` §2 chiedono tre vie insieme. Per Kalliope:

| Via | Cosa cerchiamo | Esempi di domanda di ricerca |
|---|---|---|
| **Settore o problema affine** | Prodotti e servizi per l'accessibilità e l'inclusione; per chi comunica in modo diverso; salute e benessere; organizzazioni non profit e impatto sociale; strumenti per le riunioni | «Come si presenta un prodotto pensato per persone con disabilità, a chi non lo conosce e a chi lo consiglia?» |
| **Meccanismo affine** | Servizi basati su voce, parlato, audio e intelligenza artificiale che devono mostrare un suono e dichiarare limiti; installazione guidata di un programma o di un dispositivo; confronto di versioni e piattaforme; documentazione tecnica leggibile | «Come si fa ascoltare un campione, e come si dice cosa il sistema non sa fare?» |
| **Superficie affine** | Vetrina di un prodotto software; app a un solo compito (una finestra sola, molti stati); pagina di download e di aiuto; sito da telefono | «Come si spiega una finestra sola con molti stati?» |
| **Competenza da approfondire** | Navigazione e struttura; pagina d'arrivo; scrittura; interfaccia e interazione; responsive e mobile; dati e prove; movimento; video e suono; leggerezza tecnica | Le competenze di C1-C14 |

Una **quarta fonte**, fuori dai Webby, serve per ciò che i premi coprono poco (C2, C6, C7, C9, C10): vedi §4. Il valore
di una fonte non Webby si dichiara per quello che è e non porta con sé un riconoscimento.

---

## 3. Le categorie Webby da cercare, e perché

Regole di verifica (`riferimenti.md` §2): il nome si legge nel catalogo ufficiale (`webbyawards.com`, schede di
`winners.webbyawards.com`); si usa l'edizione **conclusa più recente** (il registro della skill indica la 2026: da
riconfermare) e, solo per una categoria senza progetti pertinenti, la precedente; si registra se la vittoria è
**Webby Winner** o **People's Voice**; una nomination non è una vittoria; si apre il **prodotto**, non la scheda del
premio o il sito dell'agenzia; la motivazione ufficiale si cita letterale con il suo URL, altrimenti si scrive
«motivazione individuale non disponibile».

La colonna «Nome registrato» riporta il nome del registro 2026 della skill (gruppo ufficiale tra parentesi): è un
indizio, non una verifica.

### 3.1 Gruppo A: dal problema, dal settore e dal meccanismo

| Categoria (nome registrato 2026, da verificare) | Perché c'è | Compiti | Cosa deve informare |
|---|---|---|---|
| Accessibility & Inclusion (App Excellence) | Il problema stesso: come comunicano, interagiscono e parlano i prodotti per persone con disabilità, e come si presentano a chi li usa e a chi li consiglia | C5, C6, C7, C9 | Registro del testo; interazioni alternative; porte per pubblici diversi |
| Categorie di **settore** (genere) dei siti e delle app: salute e benessere; istruzione; non profit, impatto sociale e organizzazioni benefiche; scienza e medicina; comunicazione e social; tecnologia e software. **Nomi da elencare dal catalogo**: non sono nel registro | Chi parla a pazienti, caregiver e operatori in un settore sensibile ha già risolto tono, fiducia e fatti | C1, C5, C6, C8, C9 | Tono; fiducia; livelli di dettaglio |
| Best Use of AI (Features & Design); Best Use of AI & Machine Learning (App Excellence) | Meccanismo affine: servizi con modelli di voce o linguaggio devono far provare l'output e dichiarare limiti; ricerca di quanti lo fanno con onestà | C2, C5, C8 | Dimostrazione di un output; dichiarazione di cosa il sistema non fa |
| Technical Achievement (Features & Design e App Excellence) | Meccanismo affine: prodotti tecnici (audio, voce, strumenti per sviluppatori) presentati a pubblici esperti; leggerezza e robustezza | C8, C14, C4 | Fatti tecnici verificabili; peso e dipendenze |
| Connected Products, Wearables, and IoT (App Excellence) | Superficie affine: prodotto con configurazione e app di accompagnamento; guida alla messa in servizio | C4, C3, C12 | Installazione a passi; stati e ripresa |
| Best Streaming or Media Service (App Excellence) | Meccanismo affine: riproduzione di audio, comandi, stati di caricamento e di errore del suono | C2, C12 | Comandi audio; stato del media |
| Categorie su **audio, voce, suono, podcast** o simili in qualunque gruppo (se esistono): **da verificare**; nessun nome registrato | Il suono è il prodotto di Kalliope e nei gruppi del registro non c'è una categoria dedicata | C2, C13 | Suono nella pagina; alternative |
| Best Practices (Features & Design; App Excellence) | Indizio: la categoria potrebbe raccogliere siti che mostrano come si fa una cosa; **verificare che cosa premia** prima di includerla | C4, C10 | Documentazione e guide |

### 3.2 Gruppo B: dalle competenze

| Categoria (nome registrato 2026, da verificare) | Perché c'è | Compiti | Cosa deve informare |
|---|---|---|---|
| Best Home Page (Features & Design) | Come si spiega un servizio nuovo nel primo schermo | C1, C5 | Pagina d'arrivo |
| Best Navigation/Structure (Features & Design) | Pubblici diversi, percorsi, ritorno, posizione | C9, C10 | Navigazione |
| Best User Experience (Features & Design; App Excellence); Best Mobile User Experience (Mobile Features & Design) | Percorsi a passi, errori, recupero | C4, C12, C10 | Interazioni; stati |
| Best User Interface (Features & Design; App Excellence) | App a un solo compito con molti stati; comandi e risposte | C3, C7, C12 | Componenti di dominio |
| Best Writing (Editorial) (Features & Design) | Voce dei testi; lunghezza; ritmo; chiarezza | C5, C6 | Tipografia e parole |
| Best Visual Design - Function (Features & Design; Mobile; App Excellence); Best Mobile Visual Design - Function (Mobile) | Leggibilità e gerarchia al servizio del compito; **si studia la funzione, non l'estetica** | C6, C7, C11 | Spazi, forme, composizioni |
| Best Responsive/Adaptive Design for Mobile (Mobile Features & Design) | Lettura lunga e inoltro da telefono | C11, C7 | Responsive |
| Best Data Visualization (Features & Design) | Come si presentano numeri e prove senza gergo | C8 | Dati |
| Best Use of Animation or Motion Graphics (Features & Design) | Movimento che porta significato e il suo ripiego | C13 | Movimento ed effetti |
| Best Use of Video or Moving Image (Features & Design) | Comandi, didascalie, trascrizioni, alternativa quando il media manca | C2, C13 | Media |
| Best Visual Design - Aesthetic (Features & Design; Mobile; App Excellence): **al massimo due progetti** | Per sapere come altri rendono riconoscibile un prodotto: identità, non da seguire | C13 | Identità (per differenziarsi) |
| Experimental & Innovation (App Excellence); Mobile Innovation & Emerging Tech (Mobile) | Peculiarità e invenzioni; per misurare l'ambizione | C13 | Ambizione |
| Best Practices (Features & Design) | Come sopra | C4, C10 | Guide |

Le categorie dei **due gruppi si cercano entrambe per i due tipi di premio**. Le motivazioni ufficiali possono essere
assenti in alcune categorie: non si deducono dallo stile.

---

## 4. Fonti fuori dai Webby

Servono per i compiti che i premi coprono poco. Si dichiarano come tali, non portano un premio e **non** vanno nei
conteggi dei vincitori.

**C. Prodotti affini e concorrenti (gruppo C, visitati come siti).** Cerca e verifica esistenza, attualità e sito
ufficiale di prodotti con cui una persona potrebbe confrontare Kalliope:
1. software di comunicazione aumentativa e alternativa (CAA) e di sintesi vocale per computer e tablet; esempi noti,
   **non verificati**: Proloquo (AssistiveWare), Tobii Dynavox, Predictable (Therapy Box);
2. strumenti di sintesi vocale che si possono usare come microfono nelle riunioni (cavi audio virtuali, voci
   sintetiche per le chiamate);
3. funzioni di scrittura-in-voce o di accessibilità che le app di riunione offrono o hanno offerto;
4. riconoscimento di parlato atipico (esempio noto, **non verificato**: Voiceitt) per capire come altri parlano a
   chi ha un parlato difficile.
Obiettivo: 4 siti di prodotto (R50-R59). Servono anche come **concorrenti** per `direzione.json` (`concorrenti`).

**Siti per pazienti e caregiver in italiano (fonti di registro, non di forma).** Associazioni e servizi italiani per SLA,
afasia, laringectomia, disartria e balbuzie, e per logopedisti, da identificare: servono per sapere come si parla in
italiano a queste persone, con quali parole, quali frasi e cosa trovano troppo difficile. 3-4 pagine, lette e
fotografate, nessuna scheda completa (C6, C9).

**Guide e standard** (per capire o verificare un meccanismo, non sostituiscono i vincitori): WCAG 2.2 (in particolare
dimensione dei bersagli, tempo, movimento, ordine del focus, testo alternativo); le linee guida del W3C sul contenuto
usabile da persone con disabilità cognitive e di apprendimento; i modelli di lettura facilitata («easy read»,
italiano e standard europei); indicazioni sulla compatibilità con puntamento oculare e interruttori da produttori di
queste tecnologie. Ogni guida si cita con versione e data di consultazione.

---

## 5. Quanti riferimenti servono

### 5.1 Regola di copertura

Il numero lo decide la copertura dei compiti, non una cifra fissa (`metodo.md` §2).
- Ogni compito C1-C14 deve avere **almeno 3 riferimenti** in cui il compito è stato **osservato** nell'ambito giusto
  (non basta che la categoria lo suggerisca): `presente` o `assente` con prova (`confronto.md`).
- Per i compiti rari nei premi (**C2, C6, C7, C9, C10**) si ammette di raggiungere i 3 con fonti non Webby (§4), purché
  etichettate; se anche così restano sotto 3, la lacuna si dichiara nel confronto e non si riempie con ipotesi.
- Un riferimento può contare per più compiti, ma ognuno deve avere la sua osservazione.

### 5.2 Campione e riserve

| Gruppo | Riferimenti primari | Riserve | ID | Tipo |
|---|---|---|---|---|
| A (problema, settore, meccanismo) | 10 | 2 | R01-R19 | Webby Winner o People's Voice |
| B (competenze) | 10 | 2 | R20-R39 | Webby Winner o People's Voice |
| C (affini e concorrenti) | 4 | 1 | R50-R59 | Non Webby; prodotti |
| **Totale** | **24** | **5** | | |

Fonti di registro e guide (§4) usano l'ID `G01…` e non sono riferimenti del campione.

Sono 24 visite complete (desktop e telefono, con varianti). Il numero si riverifica a metà ricerca con la matrice di
copertura: se i compiti sono coperti con meno, si ferma; se un compito resta sotto 3, si aggiungono riferimenti per
quel compito, non in generale.

### 5.3 Sostituzione

Se un prodotto non si apre (verifica anti-bot persistente, accesso negato, sito chiuso), si **registra** schermata e
limite, si prova una volta il browser interattivo normale, e si prende una riserva **per lo stesso meccanismo**
(`riferimenti.md` §2.5). Una fonte non aperta non è una fonte analizzata e non conta per la copertura. L'ID del
sostituto prende il numero libero più basso del gruppo; i file prendono lo stesso ID.

---

## 6. I due gruppi di ricerca indipendenti

I due ricercatori (`vibe-next:research`) lavorano **senza vedere le liste dell'altro** fino alla consegna. Le query sono
diverse per costruzione: A parte dal **problema, dal settore e dal meccanismo**; B parte dalla **categoria e dalla
competenza**. Dopo la consegna il coordinatore elimina le sovrapposizioni: un prodotto in entrambe le liste conta una
volta, nel gruppo dove copre più compiti, con i motivi di entrambi registrati.

La ricerca ha due tempi: **tempo 1** (fonti, ricercatori) e **tempo 2** (visita e scheda, ruolo visivo
`vibe-next:design-visual`). Il gruppo C lo raccoglie un terzo turno del ruolo di ricerca, dopo i due gruppi, con le sue
query di §4.

### 6.1 Gruppo A

**Query di ricerca (da usare tutte, in italiano e in inglese):**
1. Nel catalogo ufficiale: la categoria «accessibilità e inclusione» di ogni gruppo e ogni categoria il cui nome o
   descrizione parli di accessibilità, inclusione, disabilità o tecnologie assistive.
2. Le categorie di **settore** (genere): salute e benessere, istruzione, non profit e impatto sociale, scienza e
   medicina, comunicazione e social, tecnologia e software. Elencare i nomi esatti trovati.
3. Tutti i vincitori (Webby Winner e People's Voice) la cui scheda o il cui sito citi: voce, parlato, audio, sintesi
   vocale, riconoscimento vocale, trascrizione, sottotitoli, chiamate, riunioni, comunicazione, persone che non
   parlano o parlano in modo diverso.
4. Le categorie di intelligenza artificiale, tecnologia e prodotti connessi: vincitori con una pagina che mostri un
   output da provare o una dichiarazione di limiti.
5. Vincitori che sono **app o programmi a un solo compito** con molti stati (una finestra sola) o prodotti con
   configurazione guidata e pagina di download.
6. Per ciò che i premi non coprono, vedi gruppo C in §4.

**Consegna del tempo 1:** da 16 a 20 candidati **verificati** ordinati per utilità ai compiti C1, C2, C4, C5, C6, C7,
C8, C9; il coordinatore sceglie i 10 primari e le 2 riserve.

### 6.2 Gruppo B

**Query di ricerca:**
1. Per ciascuna categoria di §3.2: vincitori **Webby Winner e People's Voice** dell'edizione più recente.
2. Per la competenza di **navigazione e struttura**: come si orientano pubblici diversi in un sito con molti compiti.
3. Per la competenza di **scrittura**: i vincitori delle categorie di scrittura con una pagina che possa essere letta
   da persone che non conoscono il tema.
4. Per **mobile e responsive**: vincitori con lettura lunga da telefono e condivisione.
5. Per **movimento, video e suono**: vincitori in cui il movimento porta significato e c'è una variante ridotta
   visibile o dichiarata.
6. Per **leggerezza tecnica**: vincitori con pagine che usano pochi script e poche risorse (verificabile con la
   misura).
7. Almeno 2 progetti per **Best Visual Design - Aesthetic** (per l'identità).

**Consegna del tempo 1:** da 16 a 20 candidati verificati ordinati per utilità ai compiti C1, C3, C6, C7, C9, C11, C12,
C13, C14; il coordinatore sceglie 10 primari e 2 riserve.

### 6.3 Cosa riporta ogni candidato (tempo 1, ruolo di ricerca)

Nome · indirizzo del **prodotto** (non della scheda) · categoria ufficiale (nome esatto) · edizione · tipo di premio ·
indirizzo della scheda del premio · motivazione ufficiale (letterale, con URL) o «motivazione individuale non
disponibile» · chi lo ha realizzato, se indicato · se il prodotto si apre (esito della richiesta, eventuale verifica
anti-bot) · compiti C a cui serve e perché · prima ipotesi di cosa **non** prendere. Una lista di «non trovati» con il
motivo. Tutto con la data della consultazione.

---

## 7. Le domande a cui ogni visita deve rispondere

La visita la conduce il ruolo visivo (`riferimenti.md` §3): **un gesto alla volta, si guarda la foto, si decide il gesto
dopo**. Si scrive solo ciò che sta in una foto, una sequenza o una misura salvate. Si distinguono sempre ciò che si è
visto, misurato, letto e dedotto. Il percorso principale si fa fino al passo **prima dell'invio**: nessun dato vero,
nessuna iscrizione, nessun acquisto.

### 7.1 Domande comuni (ogni riferimento)

Ogni domanda ha almeno una osservazione con `caratteristica` e `ambito` del §8; se non si può rispondere, stato
`non_osservato` con il motivo.

| ID | Domanda | Come si risponde |
|---|---|---|
| Q1 | **Arrivo.** Chi è il visitatore atteso e cosa promette il primo schermo, senza scorrere? Cosa è chiaro e cosa no in 5 secondi? | Foto a 1440×900 e a telefono; trascrizione del titolo e della frase principale; parole e comandi contati |
| Q2 | Quante scelte sono davanti alla persona, quale è la principale e dove sta; resta ferma allo scorrimento? | Foto e misura delle posizioni |
| Q3 | Come si sa dove si è e quanto manca; come si torna indietro (comando del sito e tasto del browser); si perde il posto? | Percorso con foto prima e dopo |
| Q4 | **Percorso principale** fino al passo prima dell'invio: cosa chiede a ogni passo, cosa risponde a ogni azione, quanto si aspetta? | Una foto per gesto |
| Q5 | **Errore e vuoto.** Cosa succede con un campo vuoto o non valido (senza inviare), con un indirizzo inesistente sullo stesso sito (404), con una ricerca senza risultati? Come si recupera? | Foto; testo letterale del messaggio |
| Q6 | **Attesa.** Cosa si vede mentre carica con rete lenta (emulata)? | Foto a intervalli |
| Q7 | **Senza JavaScript.** Cosa resta di contenuto, navigazione e comandi? | Script Playwright con `javaScriptEnabled: false` (passo.mjs non ha l'opzione) |
| Q8 | **Movimento ridotto.** Cosa cambia: tolto, sostituito o uguale? | `passo.mjs avvia … --ridotto`; stesse scene confrontate |
| Q9 | **Tastiera.** Quante pressioni di Tab all'azione principale; ordine; focus visibile; collegamento «salta al contenuto»; trappole | Foto del focus a ogni passo; conteggio |
| Q10 | **Testo e zoom al 200%.** Si perde contenuto o compare lo scorrimento orizzontale? | `--carattere=200`, `--zoom=200`; `scrollWidth > innerWidth` |
| Q11 | **Lettore di schermo (proxy).** Punti di riferimento, titoli, nomi dei comandi, immagini senza testo alternativo | Snapshot dell'albero di accessibilità. **Non sostituisce** Orca, NVDA o VoiceOver |
| Q12 | **Bersagli.** Dimensioni (larghezza × altezza, in px CSS) e distanza dei comandi principali | `valuta` + `getBoundingClientRect` |
| Q13 | **Testo corrente.** Dimensione, interlinea e caratteri per riga più lunga | Misura |
| Q14 | **Rete.** Quante richieste, a quali domini di terzi, quanti kB, quanti caratteri caricati | CDP / Playwright (richieste) |
| Q15 | **Suono e video.** Partono da soli? Controlli, trascrizione, sottotitoli? Cosa resta se non si caricano? | Foto; richiesta bloccata |
| Q16 | **Condivisione e stampa.** Anteprima del collegamento (meta) presente? Con `emulateMedia print`, la pagina si legge? | Lettura dei `meta`; foto/PDF |
| Q17 | **Fiducia.** Chi c'è dietro, con quali fonti, date e versioni; come mostra prove e limiti | Foto; testo letterale |
| Q18 | **Aiuto.** Corto subito e lungo a richiesta: dove e come; esempi; pagina mai bianca | Foto della coreografia |
| Q19 | **Parole.** Persona grammaticale, lunghezza delle frasi (10 di campione), gergo; porte per pubblici diversi | Campione trascritto |
| Q20 | **Movimento.** Inventario degli effetti: trigger, scena, proprietà e valori, tempi, curve, interruzioni, uscite, varianti | `movimento.md`, `--fotogrammi`, `misura-movimento.mjs` solo come ricognizione |

### 7.2 Domande per compito (si aggiungono alle comuni quando il compito è pertinente)

| Compito | Domande |
|---|---|
| **C1** | In una frase, cosa promette? Quante parole servono per dire cosa fa e per chi è? Prima o dopo la promessa compare cosa serve per usarlo? Il visitatore capisce se **non** è per lui? |
| **C2** | Come si ascolta un campione: quanti passaggi, quanti campioni insieme, un solo suono alla volta? C'è il testo scritto? Si può fermare? Parte da solo? Dichiara come è stato prodotto? Con tastiera e con lettore di schermo si avvia e si ferma? |
| **C3** | Come mostra il prodotto: foto, schermata, video, dimostrazione viva? Con quale legenda e testo alternativo? Mostra gli stati (vuoto, errore, attesa) o solo il caso felice? |
| **C4** | Quanti passi? Il sistema operativo si sceglie o si riconosce? I comandi si copiano con un comando del sito? C'è la verifica del risultato dopo ogni passo? Cosa dice l'errore e come si riprende dopo la chiusura della pagina? |
| **C5** | Dove compare lo stato (versione, anteprima, «non ancora»)? Prima o dopo la promessa? Con quali parole dichiara un limite? Cosa dice di ciò che **non** fa? |
| **C6** | Parole per frase, parole difficili, termini tecnici spiegati o no; il «lungo» sta dietro a una richiesta? Esiste una versione semplice o facilitata? Il testo regge una lettura lenta? |
| **C7** | Percorso solo da tastiera fino all'azione principale; nessun comando dipende dal passaggio del mouse, dal tempo o da un gesto complesso? Dimensione e distanza dei bersagli; ordine del focus; comandi duplicati |
| **C8** | Quali prove mostra e con quale fonte (file, riga, comando)? Come presenta licenze, impronte, misure con metodo? Cosa dichiara di non sapere? |
| **C9** | Quante porte per pubblici diversi, con quale nome (per ruolo, compito o argomento)? Un familiare trova «come lo installo» e un tecnico trova i comandi senza leggere ciò che non gli serve? |
| **C10** | Come si trova la soluzione a un problema: ricerca, elenco, albero di domande? La risposta dice causa e azione? Una tabella di compatibilità dichiara anche il «non provato»? |
| **C11** | A 390×844: lunghezza della pagina, collegamenti diretti alle sezioni, bersagli, tabelle e comandi lunghi; condivisione del collegamento; stampa |
| **C12** | Il messaggio dice cosa impedisce di proseguire, come rimediare, senza colpa? Mantiene ciò che la persona aveva fatto? Il vuoto è una pagina utile? |
| **C13** | Quale effetto porta significato e quale decora? Cosa succede all'interruzione, all'uscita, con movimento ridotto? Se c'è suono, è mai automatico? |
| **C14** | Peso della pagina d'arrivo, richieste, terze parti, script: cosa resta senza script? I dati variabili (versione, link) stanno in un solo punto? |

### 7.3 Varianti e misure obbligatorie per riferimento

| Variante | Come |
|---|---|
| Computer 1440×900 | `passo.mjs … avvia desktop` |
| Telefono 390×844 | `avvia mobile`; la misura è la voce «Telefono» di `scripts/dispositivi.mjs` (il ricercatore verifica quella effettiva con `valuta "innerWidth+'x'+innerHeight"`) |
| Movimento ridotto | `--ridotto` |
| Testo 200% e zoom 200% | `--carattere=200`, `--zoom=200` |
| Colori forzati | `--colori-forzati` |
| Tema scuro, se il sito lo ha | `--scuro` |
| Senza JavaScript | Script Playwright dedicato, scritto dal ruolo visivo in `design/ricerca/strumenti/` |
| Rete lenta | Playwright/CDP, solo in Chromium: dichiararlo |
| Stampa | `emulateMedia({media: 'print'})` |

Dichiarare in ogni scheda cosa **non** si è potuto variare (per esempio rete lenta in Firefox e WebKit).

---

## 8. Il vocabolario delle osservazioni

Perché due gruppi producano dati confrontabili, `caratteristica` e `ambito` vengono **solo** da qui (`confronto.md`:
stessa unità, stesso ambito). Un'altra caratteristica osservata si aggiunge con un nome nuovo e si segnala al
coordinatore; non si cambiano i nomi dati. In `valore` stanno **solo parametri misurati o categorie**; i parametri non
misurati vanno per nome in `non_misurati`; la prosa va in `descrizione`; un'assenza è `stato: "assente"` con prova.
Una riga mancante è «non osservata», mai «assente».

**Ambiti ammessi:** `arrivo computer` · `arrivo telefono` · `scorrimento computer` · `scorrimento telefono` · `menu computer`
· `menu telefono` · `percorso principale` · `errore` · `404` · `senza JavaScript` · `movimento ridotto` · `tastiera` ·
`testo 200%` · `rete lenta` · `stampa` · `media` · `installazione` · `aiuto` · `dati` · `fiducia`. Un ambito si può
specificare dopo un punto mediano (` · `), per esempio `percorso principale · passo 3`.

| ID | `caratteristica` | Ambiti | Cosa si osserva e `valore` | Famiglia | Compiti |
|---|---|---|---|---|---|
| V01 | proposta del primo schermo | arrivo computer, arrivo telefono | `{parole, frasi}`; il testo letterale in `descrizione` | testo | C1, C5 |
| V02 | comandi visibili al primo schermo | arrivo computer, arrivo telefono | `{link, pulsanti, campi}` contati senza scorrere | struttura | C1, C7 |
| V03 | comando principale | arrivo computer, arrivo telefono | `{posizione: alto\|centro\|basso, fisso_allo_scorrimento: sì\|no}`; etichetta in `descrizione` | navigazione | C1, C7 |
| V04 | struttura della navigazione | menu computer, menu telefono | `{voci, tipo: barra\|pannello\|menu_a_comparsa\|assente}` | navigazione | C9 |
| V05 | apertura del menu | menu telefono | `{durata_ms, direzione}`; curva in `non_misurati` se non misurata | movimento | C13 |
| V06 | segnale di posizione e di avanzamento | percorso principale, scorrimento computer | `{tipo: passi\|indice\|barra\|nessuno}` | avanzamento | C4, C9 |
| V07 | comando proprio «indietro» | percorso principale | `{presente, conserva_i_dati}` | navigazione | C4, C12 |
| V08 | messaggio di errore | errore | `{sotto_il_campo, dice_come_rimediare, mantiene_i_dati}`; testo letterale in `descrizione` | risposta | C12 |
| V09 | pagina inesistente | 404 | `{utile: sì\|no, offre_ritorno}` | risposta | C12 |
| V10 | attesa del caricamento | rete lenta | `{segnale: scheletro\|spinner\|testo\|vuoto, s_al_primo_testo}` | risposta | C14 |
| V11 | comportamento senza JavaScript | senza JavaScript | `{contenuto: tutto\|parziale\|nessuno, navigazione: funziona\|no, comandi_essenziali: funzionano\|no}` | struttura | C14, C7 |
| V12 | effetti con movimento ridotto | movimento ridotto | `{effetti, tolti, sostituiti, invariati}` | movimento | C13 |
| V13 | percorso da tastiera | tastiera | `{tab_fino_al_comando_principale, focus_visibile, salta_al_contenuto, trappole}` | gesto | C7 |
| V14 | testo al 200% | testo 200% | `{scroll_orizzontale: sì\|no, contenuto_perso: sì\|no}` | testo | C7, C11 |
| V15 | albero di accessibilità (proxy) | arrivo computer, arrivo telefono | `{punti_di_riferimento, titoli, immagini_senza_alternativa, comandi_senza_nome}` | struttura | C7 |
| V16 | bersagli dei comandi principali | arrivo computer, arrivo telefono | `{larghezza_min_px, altezza_min_px, distanza_min_px}` | gesto | C7, C11 |
| V17 | testo corrente | arrivo computer, arrivo telefono | `{corpo_px, interlinea, caratteri_per_riga_max}` | tipografia | C6, C11 |
| V18 | richieste e terze parti | arrivo computer | `{richieste, domini_di_terzi, kb, caratteri_caricati}` | dati | C14 |
| V19 | avvio di audio e video | media | `{avvio_automatico: sì\|no, controlli_nativi, trascrizione, sottotitoli}` | suono | C2, C13 |
| V20 | media non caricato | media | cosa resta: `{alternativa_testuale: sì\|no, pagina_integra: sì\|no}` | suono | C2, C14 |
| V21 | anteprima del collegamento | arrivo computer | `{titolo, immagine, descrizione}` presenti sì/no | struttura | C11 |
| V22 | stampa | stampa | `{leggibile: sì\|no, comandi_inutili_nascosti: sì\|no}` | struttura | C11 |
| V23 | chi c'è dietro e le fonti | fiducia | `{firma, data, versione, fonti_collegate}` presenti sì/no | fiducia | C5, C8 |
| V24 | stato e limiti dichiarati | fiducia, arrivo computer | `{presente, prima_della_promessa: sì\|no}`; parole letterali in `descrizione` | fiducia | C5 |
| V25 | corto subito, lungo a richiesta | aiuto, percorso principale | `{meccanismo: apertura\|pagina_a_parte\|finestra\|suggerimento\|nessuno}` | aiuto | C6, C10 |
| V26 | porte per pubblici diversi | arrivo computer, menu computer | `{porte, criterio: ruolo\|compito\|argomento\|nessuno}` | navigazione | C9 |
| V27 | lunghezza e registro delle frasi | arrivo computer, aiuto | `{frasi_campione, parole_per_frase_media, persona: prima\|seconda\|terza\|mista}` | testo | C6 |
| V28 | guida a passi con ripresa | installazione | `{passi, indietro, ripresa_dopo_chiusura, indicatore}` | avanzamento | C4 |
| V29 | comandi da copiare | installazione, aiuto | `{comando_copiabile, verifica_dopo, sistema_selezionabile}` | aiuto | C4, C10 |
| V30 | scelta per sistema o versione | installazione | `{modo: automatico\|manuale\|assente}` | dati | C4 |
| V31 | tabella di compatibilità | aiuto, dati | `{righe, dichiara_non_provato: sì\|no}` | fiducia | C5, C10 |
| V32 | prodotto mostrato | arrivo computer, scorrimento computer, scorrimento telefono | `{tipo: foto\|schermata\|illustrazione\|video\|dimostrazione_viva\|assente, con_legenda, con_alternativa}` | immagine | C3 |
| V33 | campione di suono | media | `{campioni, simultanei_max, testo_accanto, durata_indicata}` | suono | C2 |
| V34 | numeri detti a parole | dati | `{presente: sì\|no}`; esempio in `descrizione` | dati | C8 |
| V35 | effetto o animazione (una riga per effetto) | arrivo computer, arrivo telefono, scorrimento computer, scorrimento telefono, menu telefono, percorso principale | `{trigger, durata_ms, curva, proprieta}` come in `movimento.md`; non misurati per nome; la scena dopo il punto mediano (`scorrimento telefono · sezione 3`) | movimento | C13 |

Le righe che non hanno prova non si compilano: si segna `non_osservato` con il motivo. Un modello pronto da copiare e
già controllato con lo script sta in `design/ricerca/modello-osservazioni.json`.

**Copertura delle 21 dimensioni** (`storico/dimensioni.json`): ogni scheda dichiara per ciascuna dimensione
osservazioni, assenza verificata o lacuna. Le dimensioni senza una riga in §8 (impaginazione, colore, materiali,
forme, dimensioni, tipografia di dettaglio, immagini, tecnologie, prestazioni) si compilano con la scheda degli
elementi (`riferimenti.md` §3, punto 10) e con le misure di `misura-vincitori.mjs`, **prima** di avviare altri
browser (`esecuzione.md`).

---

## 9. Come si visita in questo ambiente

- **Mai finestre sul desktop dell'utente.** `DISPLAY=:0` e `WAYLAND_DISPLAY=wayland-1` sono il desktop vero:
  ogni comando parte con `env -u DISPLAY -u WAYLAND_DISPLAY …`. Si usa `passo.mjs prendi leggero <chi>`; non la modalità
  `finestra`. I siti in WebGL si guardano comunque senza finestra (WebGL in software): più lenti e a volte vuoti. Si
  dichiara come limite e si usano fotogrammi.
- **Chrome MCP o browser interattivo equivalente** per la visita, quando l'host lo espone (`browser.md`); altrimenti
  `passo.mjs` senza finestra, e si scrive quale è stato usato.
- **Capacità misurata** (`design/metodo-capacita.json`, 18:29): Chromium regge fino a 24 browser insieme; Firefox e
  WebKit **non si sono avviati** in quella misura. Per le visite basta Chromium; i tre motori servono per la matrice
  finale, non per la ricerca. Il numero di visite in parallelo lo decide `passo.mjs stato`, non il numero dei riferimenti.
- **Mentre le visite girano** non si avvia `misura-vincitori.mjs` né `misura-movimento.mjs` (aprono browser propri):
  prima o dopo.
- **Blocchi.** Una verifica anti-bot («Just a moment…», «Verify you are human») si registra con la schermata e il limite,
  si prova una volta il browser normale, poi si va avanti con una riserva. Nessun aggiramento.
- **Nessun dato vero.** Nessun modulo inviato, nessun account, nessun acquisto, nessun indirizzo di posta inserito.
- **Si scrive solo ciò che sta in una prova.** Foto e misure con ID del riferimento nel nome.

---

## 10. Cartelle, consegne e controlli

```
design/ricerca/
  piano.md                         questo file
  modello-osservazioni.json        modello controllato con lo script
  fonti/A.md · B.md · C.md         tempo 1: candidati verificati (ricercatori)
  schede/<ID>.md                   tempo 2: scheda del riferimento (15 punti di riferimenti.md §3)
  osservazioni/<ID>.json           tempo 2: osservazioni nel vocabolario di §8
  prove/<ID>/                      foto, sequenze, misure grezze (nome: NNN-gesto.png)
  movimento/<ID>.md                inventario degli effetti (movimento.md)
  strumenti/                       script scritti dal ruolo visivo (senza JavaScript, rete lenta, misure)
  lacune.md                        ciò che non si è visto, con il motivo
```

- **Tempo 1 (ricerca):** `fonti/A.md` e `fonti/B.md`, ciascuna scritta dal proprio ricercatore, senza copiare l'altra;
  `fonti/C.md` dal terzo turno. Ogni voce con data e URL.
- **Tempo 2 (visita):** per ID, scheda, osservazioni, prove, inventario del movimento.
- **Ogni file di un riferimento porta il suo ID** (R01…); se un riferimento viene sostituito, anche i file prendono il
  nuovo ID.
- **Prima di consegnare le osservazioni:**
  `node <skill>/scripts/confronta-riferimenti.mjs --controlla design/ricerca/osservazioni/<ID>.json` (uscita 0
  pulito; 1 avvisi; 2 errori). Tutti gli errori si correggono in un giro.
- **Il coordinatore** controlla copertura e qualità sulle schede originali, non sul riepilogo; poi
  `confronta-riferimenti.mjs` per l'intersezione e le peculiarità; lo storico si consulta solo dopo.
- **`progresso.md`** nella cartella dell'incarico di ciascun worker, aggiornato a ogni scheda finita; `STATO.md` a ogni
  traguardo, con tempi e consumi da `modello-effettivo.mjs`.
- **Chi riprende un lavoro** parte da questo piano, dall'incarico e da `progresso.md`, poi verifica i file prodotti.

---

## 11. Ordine, parallelo e tempi

1. **Subito:** ricercatori A e B in parallelo (tempo 1, fonti). Nessuna misura con browser in corso.
2. **Alla consegna A e B:** il coordinatore deduplica, sceglie 10 + 2 per gruppo, avvia il terzo turno (gruppo C) e
   chiede all'utente i riferimenti suoi (§0).
3. **Tempo 2:** visite del ruolo visivo, con il numero di browser dato da `passo.mjs stato` (da Chromium, il solo motore
   confermato), ognuna con la propria cartella. Prima le visite al computer e al telefono con le varianti di §7.3, poi
   l'inventario del movimento.
4. **Matrice di copertura** (compito × riferimento, con stato osservato/assente/non osservato) a metà ricerca e alla fine.
5. **Poi** il confronto (`confronto.md`), la direzione (`direzione.md`) e il cancello con un percorso completo; solo dopo
   l'approvazione dell'utente, la matrice completa delle prove.

La stima del tempo non si fissa a priori: si misura sulla prima scheda completa (durata, comandi e token da
`modello-effettivo.mjs`) e si moltiplica; il risultato va in `STATO.md` con il metodo di calcolo.

---

## 12. Lacune attese e domande aperte

- **Nomi di categoria e edizione** non verificati da me (limite di §0).
- **Compiti difficili per i premi:** C2 (suono con testo), C6 (lettura facilitata), C7 (puntamento oculare e interruttori),
  C9 (porte per pubblici), C10 (aiuto per l'uso ricorrente). Si prevedono pochi vincitori pertinenti: da qui il gruppo C
  e le guide.
- **Lettori di schermo veri:** nessun lettore (Orca, NVDA, VoiceOver) è disponibile in questo ambiente. Q11 è un proxy;
  la revisione con lettori veri resta una lacuna da dichiarare.
- **Puntamento oculare e interruttori:** nessuna verifica con hardware reale; solo il proxy di tastiera e misure.
- **Motori:** Firefox e WebKit vanno riprovati prima della matrice finale.
- **Riferimenti del proprietario:** non indicati.
- **Persone reali:** nessuna prova con utenti; i livelli di `progetto.md` vengono dal proprietario.
- **Tre decisioni del proprietario che cambiano cosa guardare** (`progetto.md` §12): lingua del sito (dubbio B), canale
  di contatto senza account (dubbio A), cosa dire in P6 a chi non può usare Kalliope (dubbio E). Non fermano la ricerca.
