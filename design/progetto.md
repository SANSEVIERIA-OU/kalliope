# Kalliope: scheda del progetto

Data: 12/11/2026 · Redatta da: design-build (attività `project`) · Per: il sito di Kalliope su GitHub Pages (`site/`).
Questa scheda dice cosa fanno il prodotto e il sito da fare, come e perché. Non dice nulla di colori, caratteri o
forme: quelli nascono dalla ricerca e dalla direzione.

**Provenienza di ogni affermazione**
`[R]` file del repository (percorso indicato) · `[G]` release GitHub v0.1-rc.1 · `[P]` deciso dal proprietario
(conversazione con l'utente, 2026) · `[M]` misura dichiarata dal progetto (Ryzen 5 PRO 6650U) · `[C]` dato del
coordinatore (`design/STATO.md`, incarico) · `[I]` inferenza mia, da confermare · `[L]` lacuna: nessun dato.

---

## 0. In breve

Kalliope è un programma per il computer che dà la voce a chi non può parlare o fa fatica a farlo. La persona scrive in
una finestra e preme Invio. Un microfono che esiste solo dentro il computer, chiamato «Kalliope», pronuncia il testo
con una voce italiana naturale. In Zoom, Teams, Meet, Webex, Jitsi o nel browser la persona sceglie «Kalliope» come
microfono, e gli altri partecipanti sentono la voce come se parlasse lei. Tutto avviene sul suo computer: niente
server, niente account, il testo non esce `[P][R]`.

È un prodotto di SANSEVIERIA OÜ, con licenza SANSEVIERIA 1.0 (codice sorgente disponibile) `[P][R NOTICE]`. Oggi è una
versione di prova (0.1-rc.1) per Linux x86_64 con PipeWire; la voce è stata provata fino al microfono virtuale con
PipeWire privato, **non ancora** in una riunione vera con Zoom, Teams o Meet; Windows e macOS non hanno ancora il
microfono virtuale `[P][R README]`.

Il sito deve fare cinque cose: far capire a chi non conosce il prodotto cosa fa e se è per lui; far **sentire** la voce;
dire con onestà cosa si può fare oggi e cosa no; portare chi può installarlo fino a una voce che esce davvero in una
riunione; dare a chi deve controllare fatti verificabili. Lo fa in italiano, per persone con ogni genere di
difficoltà di comunicazione, di movimento e di lettura (§4).

---

## 1. Cosa fa

### 1.1 Il problema

Le riunioni in video (lavoro, scuola, visite, famiglia) presuppongono la voce. Chi non può parlare, o parla con grande
fatica, resta escluso o dipende da qualcuno che parli al suo posto `[P]`. Kalliope toglie questa condizione per la
parte sonora: la persona scrive, il computer parla con la sua tempistica.

### 1.2 Le operazioni disponibili nella versione 0.1 (finestra, `crates/app/ui/app.slint`, `main.rs`)

| Operazione | Come funziona | Fonte |
|---|---|---|
| Dire una frase | Si scrive nel campo e si preme Invio, o «Parla». Il campo si svuota; il testo scritto in più frasi si pronuncia una frase alla volta | `app.slint`, `engine.rs` |
| Accodare | Altro testo scritto mentre parla si aggiunge in coda: non sostituisce quello in corso | `engine.rs` (`pending.extend`) |
| Fermare | «Ferma» interrompe subito il suono e svuota la coda. È attivo solo mentre parla | `engine.rs` (`Stop`) |
| Ripetere | Le frasi dette restano in un elenco (fino a 30, la più recente in alto; una frase uguale non si duplica, risale). Un clic sulla frase la ripete | `main.rs` (`HISTORY`) |
| Scegliere la voce | Giulia (predefinita) o Marco; la scelta si ricorda | `main.rs`, `settings.rs` |
| Sentirsi | «Senti anche tu» riproduce la voce anche sulle casse del proprio computer; la scelta si ricorda | `app.slint`, `settings.rs` |
| Scaricare la voce | Al primo avvio: «Scarica la voce», con barra di avanzamento e «Annulla» | `main.rs`, `download.rs` |
| Informazioni | Versione, scopo, licenze e attribuzioni (Slint obbliga a mostrare la sua) | `app.slint`, `NOTICE` |
| Dire da terminale | `kalliope --say TESTO` parla nel microfono senza finestra; `kalliope-cli` produce un WAV o mostra la pronuncia | `main.rs`, `CHANGELOG.md` |

Il testo scritto e l'elenco delle frasi **non** si salvano: l'elenco vive nella memoria della finestra e sparisce alla
chiusura; solo voce e «Senti anche tu» vanno su disco (`settings.conf`) `[R main.rs, settings.rs]`.

### 1.3 Il risultato concreto per la persona

Chi è in riunione scrive e gli altri sentono quella frase con una voce naturale, con date, orari, importi e sigle
lette come le direbbe una persona (§2.2). La persona partecipa «alla pari»: interviene quando ha scritto, con il tempo
della scrittura `[I]`.

### 1.4 Cosa Kalliope non fa (confini da dire, non da nascondere)

- Non ascolta e non trascrive: nessun riconoscimento vocale, nessuna registrazione `[R]`. Chi non sente non riceve da
  Kalliope sottotitoli della riunione: quelli dipendono dall'app della riunione `[I]`.
- Non clona la voce della persona: «non c'è; forse in futuro, solo con consenso» `[P]`.
- Parla solo italiano: normalizzazione e pronuncia sono italiane `[R crates/text, crates/phonemes]`.
- Non ha pittogrammi, predizione del testo né frasi preimpostate: solo le frasi già dette in quella sessione `[R]`.
  Non è un sistema completo di comunicazione aumentativa (CAA) `[I]`.
- Non è un servizio online, né un'estensione del browser, né un'app per telefono `[R]`.
- Non si integra con una app di riunione in particolare: per l'app di riunione è semplicemente un microfono `[R docs]`.
  Quindi la compatibilità con una app è un fatto da provare app per app, non una promessa generale.
- Il suono arriva solo se un'app sta registrando dal microfono: le frasi dette mentre nessuno ascolta vengono scartate
  (come per un microfono vero; così una riunione non inizia con parole vecchie) `[R docs/virtual-microphone.md]`.

---

## 2. Come lo fa

### 2.1 La catena, e chi decide

```
testo scritto → normalizzatore → fonetizzatore → voce neurale → microfono virtuale → la riunione
```

| Passo | Cosa fa | Chi decide | Costo misurato `[M]` | Fonte |
|---|---|---|---|---|
| Normalizzatore (`kalliope-text`) | Scrive in parole numeri, date, orari, importi, unità, telefoni, indirizzi, abbreviazioni, sigle e linguaggio da chat; rimette gli accenti; divide in frasi; conserva la punteggiatura | Regole deterministiche | circa 11 µs a frase | README |
| Fonetizzatore (`kalliope-phonemes`) | Dall'ortografia italiana alla pronuncia, con accento e vocali aperte o chiuse da regole, desinenze e un lessico di 7.920 parole, senza altri programmi | Regole + lessico (Wiktionary, CC BY-SA 4.0) | microsecondi a parola | README, NOTICE |
| Voce (`kalliope-voice`) | Modello neurale Klein-TTS-X1.5-Pro (Apache-2.0) eseguito in locale con ONNX Runtime, un thread, nessuna attesa attiva | Modello locale: pronuncia, non decide cosa dire | circa 0,07 s di CPU per ogni secondo di voce | README |
| Microfono (`kalliope-mic`) | Nodo PipeWire «Kalliope» (sorgente audio) che le app elencano accanto ai microfoni veri; manda suono solo mentre un'app registra | Sistema audio PipeWire | 0% CPU se nessuno ascolta; circa 0,26% di un core mentre un'app registra; ritardo circa 21 ms | `docs/virtual-microphone.md` |
| Finestra (`kalliope-app`) | Scrive, mostra stato ed elenco | La persona | 10,6 MB di RAM con la sola finestra, circa 117 MB con la voce, 0% CPU a riposo | README |

Servizi esterni: **nessuno**, tranne lo scarico della voce al primo avvio (§7). Nessun modello generativo riscrive il
testo della persona `[R]`.

### 2.2 Il testo viene letto come lo direbbe una persona

Esempi veri del progetto: «cmq ci vediamo dmn alle 10:30» si legge «comunque ci vediamo domani alle dieci e trenta»;
«perche» si legge «perché»; la punteggiatura dà forma alla voce (le domande suonano come domande, le virgole fanno
pause) `[R CHANGELOG]`. Limiti noti: negli ascolti di verifica restano differenze soprattutto di scrittura («10 e 30»
per «10:30», «ancora» per «àncora») `[R README]`.

### 2.3 Qualità e attese: cosa è misurato e cosa no

- Parole sbagliate secondo Whisper sulla voce registrata dal microfono «Kalliope», come la sentirebbe una riunione: 2,3%
  sulle 10 frasi del benchmark `[R README]`; circa 1 errore su 45 parole sui sei campioni del sito `[C]`. Sono due
  misure diverse: non si fondono in un numero solo.
- Nel benchmark di scelta del motore il primo suono arriva in meno di 160 ms (strumento di prova in Python, non l'app)
  `[R benchmarks/engines/README.md]`. **Non è misurato** il tempo dalla pressione di Invio al suono nella riunione `[L]`.
- La sintesi procede una frase alla volta: la voce parte dopo la prima frase e mentre una suona si prepara la
  successiva; «Ferma» e il nuovo testo si vedono fra una frase e l'altra `[R engine.rs]`.
- Tutte le cifre sono misurate su **un solo computer** (Ryzen 5 PRO 6650U); su altri non sono note `[L]`.
- Lo scarico: 52.974.546 byte in tre file (53 MB), una volta, con verifica dell'impronta SHA-256 di ciascun file;
  poi il programma funziona senza internet `[R catalog.rs, download.rs]`.
- Il tempo di «Preparo la voce…» a ogni avvio non è stato misurato `[L]`.

### 2.4 Gli stati della finestra (testo vero che la persona legge)

| Stato | Cosa dice la finestra | Cosa può fare la persona |
|---|---|---|
| Primo avvio, voce assente | «Per parlare, Kalliope deve scaricare la voce: 53 MB, una volta sola. Poi funziona senza internet.» | «Scarica la voce»; il campo di testo è disattivato |
| Scarico in corso | «Scarico la voce… N di 53 MB», con barra | «Annulla» |
| Scarico non riuscito o annullato | «Download annullato.» · «Per scaricare la voce serve il programma curl: …» · «Download non riuscito: …» · «Il file … scaricato non corrisponde all'impronta attesa: l'ho scartato.» | Ripetere «Scarica la voce» |
| Caricamento | «Preparo la voce…» | Attendere; il campo è disattivato |
| Pronta | «Pronta. In Zoom, Teams, Meet o nel browser scegli «Kalliope» come microfono.» | Scrivere, parlare, ripetere, scegliere voce |
| Pronta, ma senza microfono | «La voce è pronta, ma <causa>: per ora nessuno ti sentirà nelle chiamate.» La causa oggi compare in inglese («PipeWire is not available: …») | Sistemare PipeWire (§10, P5); la finestra continua a funzionare «a vuoto» |
| Parla | «Sto parlando…» | «Ferma»; accodare altro testo |
| Parla ma nessuno ascolta | «Nessuna chiamata sta usando il microfono «Kalliope»: sceglilo come microfono nell'app della riunione.» Compare solo se «Senti anche tu» è spento; se è acceso la finestra dice «Sto parlando…» | Scegliere il microfono nell'app della riunione |
| Errore | «Non riesco a preparare la voce: …» · «Errore della voce: …» · «Non riesco a cambiare voce: …» | Dipende dalla causa; nessun rimando a un aiuto: l'app non ha link al sito |

Fonte: `main.rs`, `engine.rs`, `download.rs`, `crates/mic`. Lo stato sta in una riga in cima alla finestra; come lo si
mostra non è materia di questa scheda.

### 2.5 Il flusso reale d'uso

**Prima volta.** Installa il pacchetto → apre Kalliope → «Scarica la voce» (53 MB) → «Pronta» → nell'app della riunione
sceglie «Kalliope» come microfono → entra → tiene vicine la finestra della riunione e quella di Kalliope → scrive →
Invio → gli altri sentono.
**Uso ricorrente.** Apre Kalliope (la voce si ricarica: «Preparo la voce…») → il microfono compare nelle app → sceglie
«Kalliope» (il sistema ricorda la scelta; Kalliope diventa il microfono predefinito solo se è l'unico, oppure se lo si
imposta nel sistema `[R docs]`) → scrive; ripete frasi dall'elenco; ferma se serve.
**Una difficoltà reale** `[I][L]`: la finestra di Kalliope e quella della riunione sono due finestre; nel codice 0.1 non
esistono scorciatoie da tastiera valide fuori dalla finestra. Cosa significhi in una riunione vera, per chi scrive con
un solo interruttore o con lo sguardo, non è stato provato.

---

## 3. Perché lo fa

| Funzione o scelta | Bisogno | Motivo e fonte |
|---|---|---|
| Scrivere e far pronunciare | Partecipare alle riunioni senza la propria voce | Richiesta del proprietario `[P]` |
| Microfono virtuale | Funzionare con **qualsiasi** app di riunione senza accordi con ciascuna | Le app scelgono un microfono; Kalliope ne è uno `[R docs/virtual-microphone.md]` |
| Tutto sul computer, senza account | Un testo scritto per parlare può essere privato (lavoro, salute, famiglia); funzionare offline e senza costi ricorrenti | Decisione `[P]`; motivi di privacy e costo `[I]`; «prestazioni per watt» `[R README, obiettivi]` |
| Voce neurale locale su CPU modeste | Voce naturale senza una scheda grafica né connessione | Obiettivo «excellent, punctuation-aware voice quality on modest CPUs»; scelta fatta con un benchmark (`benchmarks/engines`) `[R]` |
| Normalizzazione dell'italiano | Chi scrive in fretta usa abbreviazioni e dimentica gli accenti; la voce deve leggere come direbbe una persona | `[R CHANGELOG]` |
| Italiano prima | Il pubblico di partenza è italiano; la voce e la pronuncia sono italiane | `[P][R]` |
| Due voci (Giulia, Marco) | Scegliere una voce in cui riconoscersi | `[I]` (le due voci esistono `[R]`, il motivo no) |
| Elenco delle frasi dette | Scrivere è lento: ripetere un'ora di saluti o richieste con un clic | `[R CHANGELOG]`; motivo `[I]` |
| «Senti anche tu» | Sapere cosa sta uscendo | `[I]` |
| Programma piccolo, zero dipendenze non giustificate | Girare su computer modesti, con consumo minimo | Principi di `CONTRIBUTING.md` `[R]` |
| Codice sorgente disponibile, licenza propria | Riutilizzo, controllo e contributi, con autorizzazione per le offerte commerciali | Scelta del proprietario `[P]`; testo in `LICENSE`, `NOTICE` |
| **Un sito** | Il README è in inglese e tecnico; chi ha bisogno di Kalliope e chi lo consiglia non legge GitHub | Richiesta del 12/11/2026 «rendiamo la repo pubblica e fai il sito su github pages» `[C]`; motivo `[I]` |

---

## 4. Persone e contesti

I livelli vengono da ciò che ha detto il proprietario `[P]`. Dove non ci sono frasi vere né dati dichiaro la lacuna:
nessuna intervista, nessuna statistica di uso (per scelta il sito non avrà statistiche) `[L]`.

### 4.1 Le famiglie

| Famiglia | Chi è | Dispositivo e attenzione | Cosa vuole | Cosa teme (ipotesi `[I]`) |
|---|---|---|---|---|
| **F1. Chi parla con Kalliope** | Persone con SLA o altre malattie neuromuscolari; afasia dopo un ictus; laringectomia; disartria; balbuzie; mutismo selettivo e autismo; sordità `[P]` | Computer con tastiera, sensori o puntamento oculare `[P]`; spesso poca energia per ogni gesto; per alcuni lettura e scrittura lente o difficili | Intervenire in riunione senza dipendere da altri, con una voce che le sembri accettabile | Restare muta nel momento importante; una voce «da robot»; non capire come installare; essere compatita |
| **F2. Chi sta intorno** | Familiari che assistono; logopedisti, terapisti, educatori `[P]` | Spesso leggono **dal telefono** `[P]`; poco tempo; non sempre tecnici | Capire se è adatto, cosa serve, se fidarsi; consigliare o inoltrare un link | Consigliare qualcosa che non funziona nel momento critico; promettere troppo |
| **F3. Chi controlla** | Responsabili IT, privacy, legale o acquisti di aziende, scuole, enti dove la persona lavora o studia `[I]` | Computer di lavoro, lettura attenta | Sapere cosa esce dal computer, cosa si installa, con quale licenza, chi risponde | Perdite di dati; software non verificabile |
| **F4. Chi installa e mantiene** | Utenti Linux, chi installa per un altro, chi crea pacchetti per distribuzioni, chi contribuisce al codice | Terminale, lettura veloce | Comandi esatti, requisiti, impronte, sorgente | Pacchetti non firmati o non riproducibili; passaggi non chiari |
| **F5. Chi guarda da fuori** | Stampa, associazioni, ricercatori di accessibilità, possibili sostenitori | Qualsiasi dispositivo | Cos'è, a che punto è, cosa si può citare | Promesse gonfiate |
| **F6. Chi amministra il sito** | Proprietario e coordinatore: pubblicano ogni versione con `tools/site.py` | Terminale | Un sito sempre allineato alla release, senza riscrivere | Dati di versione vecchi o scritti a mano |

### 4.2 I livelli dentro F1 e dove la persona incontra il sito

| Livello | Evidenza | Conseguenza per il sito |
|---|---|---|
| Scopre il prodotto (non lo conosce) | — | Deve capire in pochi secondi e senza gergo |
| Prova (ha deciso di installare) | — | Passi chiari, errori recuperabili |
| Usa ogni giorno | — | Aiuto rapido, senza ricominciare da capo |
| Installa per un altro | `[P]` familiari | Linguaggio per chi non è esperto, comandi copiabili |
| SLA/neuromuscolare: tastiera, sensori, puntamento oculare | `[P]` | Ogni comando raggiungibile senza mouse, senza passaggio del mouse, senza limiti di tempo, con pochi arresti da tastiera e con bersagli adatti a un puntamento impreciso |
| Afasia dopo ictus | `[P]` testi semplici | Frasi corte, un'idea per volta, parole comuni; il «lungo» solo a richiesta. Per alcune persone con afasia anche la scrittura è difficile: Kalliope può non servire, o servire con un familiare; non va promesso `[I]`, da confermare con un logopedista |
| Laringectomia, disartria, balbuzie | `[P]` | A volte parlano, a volte scrivono: il sito non presuppone che «non parli» sempre |
| Mutismo selettivo, autismo | `[P]` | Prevedibilità: nessun suono né movimento imposto, nessuna sorpresa, controllo sempre in mano alla persona `[I]` |
| Sordità | `[P]` | I campioni di voce hanno il testo accanto; il sito dice che non può far «sentire» a chi non sente; «Senti anche tu» non è per questa persona |
| Usa un lettore di schermo (Orca, NVDA, VoiceOver) | `[P]` | Struttura, nomi dei comandi e testi alternativi significativi; l'ascolto del campione deve essere comandabile da lettore |
| Legge dal telefono (familiari, logopedisti) | `[P]` | Il sito è prima di tutto una pagina da telefono; i collegamenti si inoltrano nei messaggi |
| Senza JavaScript | `[P]` | Tutto il contenuto e i comandi essenziali funzionano senza script; l'espressività si aggiunge sopra |

Sul numero di persone raggiungibili: oggi può installare solo chi ha Linux x86_64 con PipeWire; quante persone del
pubblico lo usino **non si sa** `[L]`.

### 4.3 La stessa cosa detta a chi

| Cosa dire | Chi parla con Kalliope | Familiare | Logopedista | Tecnico Linux | Chi controlla |
|---|---|---|---|---|---|
| Cosa fa | Una frase: «scrivi, e la tua voce parla nella riunione» | Come a lei, più «per chi è» | Per chi è e per chi no; cosa non è | Catena e microfono PipeWire | Cosa fa e cosa non fa, con fonte |
| Cosa succede al testo | «Resta sul tuo computer» | Come a lei | Stesso, con la conferma che non si salva | Nessuna rete dopo lo scarico; dove stanno i file | Elenco dei flussi di rete (uno solo) e dei file scritti |
| Costo | «Nessun prezzo; uso personale libero» | Come a lei | Come a lei | Licenza SANSEVIERIA 1.0 | Testo della licenza, uso aziendale interno, autorizzazione commerciale `[R LICENSE §2, §4, §7]` |
| Cosa serve oggi | Un computer Linux; se non ce l'hai, dillo subito | Idem + chi lo installa | Idem | Distribuzioni, PipeWire, glibc 2.39 | Piattaforme e dipendenze |
| È provato? | Provato fino al microfono, non in riunione vera | Idem, con cosa significa per lei | Idem | Cosa è stato provato e come | Prove, cifre, metodo |
| Come si installa | Chiedi a chi ti aiuta (fornire loro la pagina) | Passi con comandi copiabili | Link da inoltrare | Comandi esatti, impronte | Impronte e provenienza |

---

## 5. Superfici

| Superficie | Lavoro | Per chi | Stato | Passaggi |
|---|---|---|---|---|
| **App** (finestra) | Scrivere, far parlare, ripetere | F1 | Esiste, 0.1-rc.1 | Dal pacchetto installato; nel dialogo «Informazioni» **non** rimanda al sito né al repository |
| **Microfono «Kalliope»** nelle app di terzi | Essere scelto come microfono | F1 (indirettamente tutti i partecipanti) | Esiste | Il nome compare nei menu di Zoom, Teams ecc.: va usato identico nel sito |
| **Terminale** (`kalliope --say`, `kalliope-cli`) | Provare il microfono, scriptare | F4 | Esiste | Dalle istruzioni di installazione |
| **Sito** | Spiegare, far sentire, dire lo stato, guidare l'installazione e l'uso, dare i fatti a chi controlla | F1–F5 | **Da fare** | Dal README, da ricerche, da link inoltrati; verso la pagina di release e il repository |
| **Repository GitHub** (README, CHANGELOG, `docs/`, CONTRIBUTING; in inglese) | Codice, contributi, segnalazioni | F4, F5 | Esiste, pubblico dal 12/11/2026 `[C]` | Il README dovrà rimandare al sito (lo fa il coordinatore) |
| **Pagina della release** (GitHub) | File, note in inglese, `SHA256SUMS` | F4 | Esiste (prerelease v0.1-rc.1, 12/11/2026) `[G]` | I link di scarico del sito portano qui; la pagina è di terzi: non la controlliamo |
| **Pacchetti** `.deb`, `.rpm`, `.tar.gz`, `PKGBUILD` | Installare | F1, F4 | Esistono; AUR non pubblicato `[R releasing.md]` | — |
| **Schede AppStream e `.desktop`** (negozi di software Linux) | Nome, riassunto IT/EN, descrizione | F1, F4 | Esistono; nessuna schermata; l'indirizzo punta al repository | Il sito sarà il primo posto con un'immagine della finestra |
| **Documenti legali** (`LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`) | Licenze e attribuzioni | F3 | Esistono, in inglese | Dal sito, per chi controlla |
| **Messaggi, e-mail, newsletter** | — | — | **Non esistono**: nessun server, nessun modulo | — |

**Contratto di identità e adattamento.** Il sito è la prima superficie progettata di Kalliope: l'app oggi usa elementi
standard del suo toolkit, con testi italiani, senza un sistema proprio. Non è deciso se il sistema del sito si estenderà
mai alla finestra; ciò che va mantenuto uguale fra sito e app sono i **nomi** (Kalliope, «Scarica la voce», «Parla»,
«Ferma», «Senti anche tu», «Già detto», Giulia, Marco) e le frasi di stato quando il sito le cita. L'icona dell'app
(`packaging/linux/io.github.sansevieria_ou.kalliope.svg`) è l'unico segno di marca esistente: se il sito la adotti e
quanto ne derivi è una decisione della direzione, non un vincolo `[L]`.

---

## 6. Piattaforme e motori

| Superficie | Gira su | Fonte | Conseguenza sulle prove |
|---|---|---|---|
| Sito | Qualsiasi browser: Chromium (Chrome, Edge, Brave, Samsung Internet, Android System WebView), WebKit (Safari su macOS e iOS, tutti i browser su iOS, i browser interni delle app di messaggi su iOS), Gecko (Firefox desktop e Android). Lettori di schermo: Orca, NVDA, VoiceOver; a questi si aggiunge TalkBack `[I]` | Natura statica del sito `[P]`; lettori `[P]` | Matrice completa nei tre motori; **ordine proposto**: Chromium e Firefox per i percorsi di installazione e aiuto (su Linux è dove si installa; Firefox è il browser comune lì `[I]`), WebKit e Chromium per i percorsi da telefono (capire, ascoltare, inoltrare). Senza dati d'uso l'ordine è un'ipotesi dichiarata |
| App | Linux x86_64, glibc 2.39 o più recente; Wayland o X11; disegno in software; AccessKit per i lettori di schermo (Orca) | `releasing.md`, `README` | Non è un browser: non rientra nella matrice dei motori web. Windows e macOS: compila e supera i test, ma senza microfono virtuale |
| Microfono virtuale | PipeWire con `pipewire-pulse` (provato con PipeWire 1.6); non PulseAudio da solo | `docs/virtual-microphone.md` | — |
| Distribuzioni | Debian 13, Ubuntu 24.04 o più recente (`.deb`); Fedora attuale (`.rpm`); Arch (`PKGBUILD`); altre (`.tar.gz`) | `releasing.md` | — |

Dispositivi dell'app: finestra libera da 360×320 px minimi, 560×460 preferiti `[R app.slint]`. Dispositivi del sito: tutti
quelli di `scripts/dispositivi.mjs` (15 voci) più testo grande, zoom, movimento ridotto, senza JavaScript, tastiera, colori
forzati. Il formato dei campioni voce è MP3 a 24 kHz, circa 4,6–9,5 s ciascuno (stima dalla dimensione, bitrate
costante di 64 kbit/s): la riproduzione nei tre motori, incluso Firefox e WebKit su Linux senza codec di sistema, è da
verificare `[L]`.

Vincolo operativo dell'ambiente di lavoro: i browser girano senza finestra, mai sul desktop dell'utente `[C comune.md]`.
Capacità misurata alle 18:29: Chromium regge fino a 24 browser insieme; Firefox e WebKit non si sono avviati nella
misura (da riprovare) `[C metodo-capacita.json]`.

---

## 7. Regole e conseguenze

| Tema | Regola e comportamento osservabile | Fonte |
|---|---|---|
| Cosa si salva | Preferenze (voce, «Senti anche tu») in `settings.conf` nella cartella di configurazione; la voce scaricata in `~/.local/share/kalliope/models/klein-tts-x1.5-pro` (o equivalente del sistema) | `settings.rs`, `paths.rs`, `catalog.rs` |
| Cosa **non** si salva | Il testo scritto; l'elenco delle frasi (resta in memoria, fino a 30) | `main.rs` |
| Cosa si invia | Nulla del testo. L'unica connessione dell'app è lo scarico della voce al primo avvio: con il programma `curl`, da `huggingface.co`, a una revisione fissata del modello, con verifica SHA-256 di ogni file; un file con impronta diversa si scarta | `download.rs`, `catalog.rs` |
| Cosa si modifica | Nulla fuori dalle sue cartelle. Per un `.deb` o `.rpm` servono i permessi di amministratore; il `.tar.gz` con `./install` scrive in `~/.local` senza amministratore | `releasing.md` |
| Reversibile | Sì: `./install --remove`, oppure la rimozione del pacchetto. Se la rimozione toglie anche la voce scaricata e le preferenze: **non verificato** | `releasing.md`; `[L]` |
| Attese | Scarico una tantum (dipende dalla rete); «Preparo la voce…» a ogni avvio; la voce parte dopo la prima frase | `main.rs`, `engine.rs` |
| Errori | Vedi §2.4. Il recupero è quasi sempre «ripeti» o «sistema PipeWire»; l'app non rimanda ad alcun aiuto | `main.rs` |
| Permessi | Nessun account, nessun servizio in background dopo la chiusura della finestra `[I]` (da confermare), nessuna richiesta di accesso al microfono vero: Kalliope non lo usa | `[R]`, `[I]` |
| Licenza | Uso personale, di ricerca e interno aziendale: permesso senza compenso. Offerte commerciali (compenso per copia o accesso): serve un'autorizzazione scritta di SANSEVIERIA OÜ. Chi distribuisce o offre uso in rete deve fornire il sorgente corrispondente. Non è una licenza approvata come «open source» dall'OSI | `LICENSE` §2, §4, §5, §7; `NOTICE` |
| Sito: reti | Nessuna richiesta a terzi: niente caratteri remoti, CDN, statistiche, cookie `[P]`. I file li serve GitHub Pages; i collegamenti di scarico portano a github.com solo se la persona li apre. Va scritto come fatto, senza dire «nessuno raccoglie dati» (GitHub registra le richieste come ogni host) | `[P]`, `[I]` |
| Sito: dati vivi | Versione, nomi e link dei pacchetti, dimensioni: inseriti al deploy da `tools/site.py` al posto di segnaposto; il sito non li scrive a mano | `[P]` |

**Promesse che il sito non può fare** (ognuna con il motivo):
- «Funziona con Zoom, Teams o Meet» come fatto: non provato in una riunione vera `[P]`.
- «Open source»: la licenza è propria; si dice «codice sorgente disponibile» `[P][R NOTICE]`.
- «Gratis per ogni uso» o un prezzo: nessun prezzo esiste; l'uso commerciale richiede autorizzazione `[R]`.
- «Per Windows/macOS» o «per telefono» `[R]`.
- «Con la tua voce» (nessuna clonazione) `[P]`.
- «In tempo reale» o un tempo di risposta: non misurato end-to-end `[L]`.
- «Nessuna connessione»: c'è lo scarico della voce `[R]`.
- «Provato con lettori di schermo» o «con puntamento oculare»: non risulta alcuna prova `[L]`.
- «Dispositivo medico», «terapia» o simili: nessuna dichiarazione del proprietario; va aggiunta, se serve, una
  avvertenza concordata con lui `[L]`.

---

## 8. Esito utile

**Per la persona, nel prodotto.** Riuscito: in una riunione vera gli altri sentono la frase scritta, intelligibile e
con i numeri letti giusti, senza che la persona abbia dovuto chiedere aiuto oltre l'installazione. Fallimento: la persona
resta muta proprio quando serve, perché il microfono non compare, perché nessuna app lo ascolta, perché l'installazione
si è fermata, o perché la voce ha letto male una cifra. Segnali disponibili: parole sbagliate (2,3% e 1/45), costo di
CPU e memoria, installazione e voce provate da script su Debian/Ubuntu, Fedora e Arch `[R releasing.md]`. Mancano: prova
in una riunione vera, prova con utenti reali, tempi dal tasto al suono `[L]`.

**Per la persona, nel sito.** Riuscito se: chi arriva capisce in meno di un minuto se Kalliope è per lei e per il suo
computer (proposta); chi può installarlo arriva a una voce che esce nel test del microfono dell'app di riunione; chi non
può sa perché e cosa fare; chi controlla trova fatti con fonte. Fallimento: una promessa non mantenuta; una persona che
non capisce e rinuncia; una voce che non si ascolta o non si legge; un familiare che installa e si ferma al terminale
senza una via d'uscita. Misure di prodotto: per scelta il sito non ha statistiche. L'esito si giudica con prove di
lettura e di compito con persone reali, e con le segnalazioni che arrivano (P9): oggi non esistono `[L]`.

---

## 9. Vincoli e confini

| Vincolo | Fonte e data | Conseguenza |
|---|---|---|
| Lingua del sito: italiano | `comune.md`; Italiano prima `[P]` | Una sola lingua per ora; l'inglese del repository resta nel repository (§12, dubbio B) |
| Sito statico su GitHub Pages, cartella `site/`, senza passi di build né dipendenze npm | Incarico `[P]`, 12/11/2026 | Tutto è file; niente framework da compilare; il catalogo e le prove stanno fuori da `site/` |
| Nessuna richiesta a terzi: niente font remoti, CDN, statistiche, cookie | `[P]` | Tutte le risorse stanno nel sito; i link in uscita sono azioni della persona |
| Nessun obbligo di JavaScript | `[P]` | Contenuto, ascolto dei campioni e navigazione funzionano senza script; l'espressività si aggiunge |
| Accessibilità massima: tastiera, sensori, puntamento oculare, testi semplici, lettori di schermo | `[P]` | Requisiti funzionali di ripiego (movimento ridotto, testo grande, contrasto) e linguaggio semplice |
| Dati di release non scritti a mano | `[P]`, `tools/site.py` | Il sistema definisce i punti dove entrano i dati; ogni dato ha un segnaposto |
| Stato onesto: 0.1-rc.1, Linux x86_64 con PipeWire; non provato con Zoom/Teams/Meet su desktop reale; Windows/macOS senza microfono virtuale | `[P]` | §7, «Promesse che il sito non può fare» |
| Materiale vero già pronto: sei campioni (`site/voce/{giulia,marco}-{1,2,3}.mp3`) e la foto della finestra (`site/immagini/kalliope-finestra.png`, 640×500) | `[C]` | Si usa questo; non si simula la voce né la finestra |
| Testi dei campioni, scritti esattamente così: 1. «Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo.» 2. «Sono d'accordo con Paola. Però la consegna del 14/3 mi sembra stretta: possiamo sentirci venerdì alle 15:30?» 3. «Il preventivo è di 1.250 € + IVA, valido fino al 31 dicembre.» | `[C]` | Il testo mostrato accanto al suono è identico, carattere per carattere |
| Codebase, identità e meccanismi separati dalla sorella Kalipso | `comune.md` | Nessuna copia di codice, identità o meccanismi; solo ciò che si conosce per esistenza |
| Licenza SANSEVIERIA 1.0: sorgente disponibile, non «open source» | `[P]`, `NOTICE` | Parole del sito sulla licenza |
| Clonazione della propria voce: non c'è | `[P]` | Non compare fra le funzioni; al massimo «forse in futuro, solo con consenso» |
| Nessun invio di moduli, nessun account, nessun server | `[P]` | Il sito non ha moduli; i contatti passano da canali esterni (§12, dubbio A) |
| Esclusi per ora | Windows, macOS, telefono, altre lingue, clonazione, pittogrammi, sottotitoli | Spiegati, non nascosti |

---

## 10. I percorsi del sito

Ogni percorso: **persona → bisogno → ingresso → azioni e dati → regole → esito → errore e recupero → perché serve**.

### P1. Capire e decidere (scoprire il prodotto)

- **Persona.** Chi non parla o parla con fatica e non conosce Kalliope (F1); chi l'ha ricevuto in un messaggio da un
  familiare o da un logopedista (F2). Dal telefono o dal computer.
- **Bisogno.** «Posso partecipare alle riunioni senza la voce? È per me e per il mio computer?»
- **Ingresso.** Link inoltrato; ricerca; README. Pagina d'arrivo del sito.
- **Azioni e dati.** Legge cosa fa, per chi è, cosa serve; guarda la finestra (foto vera); ascolta un campione (P2); vede
  lo stato onesto (versione di prova, solo Linux); sceglie: installare (P4), saperne di più (P3, P7), o «non posso» (P6).
- **Regole.** Niente suono che parte da solo; ogni suono ha il testo; lo stato prima di ogni promessa; nessuna richiesta
  a terzi; funziona senza JavaScript.
- **Esito.** In meno di un minuto sa se Kalliope fa ciò che cerca e se può usarlo oggi, e qual è il passo dopo.
- **Errore e recupero.** Computer non Linux: P6. Non sente: testo scritto e file diretto. Non capisce: una versione più
  corta e più semplice degli stessi fatti, senza perdere lo stato onesto.
- **Perché serve.** È l'unica porta per chi non legge GitHub; una impressione sbagliata (una promessa, una paura) costa la
  fiducia di persone già fragili.

### P2. Ascoltare la voce

- **Persona.** Chiunque: chi dovrebbe usarla, il familiare, il logopedista, chi controlla.
- **Bisogno.** «Come suona? Si capisce? Legge bene date, orari e importi?»
- **Ingresso.** Da P1 o da un link diretto all'ascolto.
- **Azioni e dati.** Sceglie Giulia o Marco; avvia una delle tre frasi (saluto; richiesta con data e orario; preventivo
  con importo); legge il testo mostrato; ferma; confronta le due voci. Dati: sei MP3, tre testi.
- **Regole.** Un ascolto per volta; mai automatico; comandabile da tastiera e da lettore di schermo; durata indicata;
  testo identico; dichiarare che sono registrazioni vere di Kalliope 0.1 e se sono state ritoccate `[L]: da chiedere al
  coordinatore`. La forma parlata delle cifre («14/3», «15:30», «1.250 € + IVA») si mostra solo se verificata con
  `kalliope-cli` o con la trascrizione Whisper.
- **Esito.** Ha un'idea fondata della qualità e sceglie la voce.
- **Errore e recupero.** Il suono non parte (codec, rete, impostazioni del dispositivo): il testo resta, il file è
  scaricabile. Persona sorda: il testo basta a capire cosa fa Kalliope; il sito non finge che ascoltare sia possibile.
- **Perché serve.** La qualità della voce è la promessa centrale e l'unica che un testo non può dimostrare.

### P3. Valutare per un'altra persona

- **Persona.** Familiare (F2), logopedista, terapista, educatore.
- **Bisogno.** «È adatto a mia madre o al mio paziente? Cosa serve? È difficile? Costa? Quali sono i limiti? Posso
  fidarmi?»
- **Ingresso.** Link da P1, ricerca, passaparola.
- **Azioni e dati.** Legge per chi è e per chi no (serve scrivere; solo italiano; solo Linux oggi); requisiti; uso e
  costo (§7); lo stato di prova; chi c'è dietro (SANSEVIERIA OÜ; l'autore originale, Davide Briani, è nominato in
  `NOTICE` e nei metadati `[R]`); inoltra il link o salva la pagina per chi installerà.
- **Regole.** Nessuna promessa clinica; avvertenza sull'uso consigliato solo se concordata `[L]`; ciò che non si sa («non
  sappiamo ancora») è scritto.
- **Esito.** Sa se proporlo, e ha una pagina o un testo da inoltrare.
- **Errore e recupero.** Un'informazione che cerca e non c'è (prezzo, assistenza telefonica, certificazioni): il sito
  dice che non esiste, non la lascia vuota.
- **Perché serve.** Familiari e logopedisti spesso leggono dal telefono e sono la via d'accesso `[P]`; scelgono per chi non
  può farlo da solo.

### P4. Installare su Linux

- **Persona.** Chi ha un computer Linux, o il familiare tecnico che lo installa per un altro (F4, F2).
- **Bisogno.** «Metterlo sul computer e farlo funzionare, senza rompere nulla.»
- **Ingresso.** «Scarica» da P1 o P3; dal README o dalla pagina di release.
- **Azioni e dati.** Controlla i requisiti (distribuzione, x86_64, PipeWire, glibc 2.39); sceglie il file; copia il
  comando; installa; apre Kalliope; «Scarica la voce» (53 MB); controlla che sia «Pronta». Dati vivi (versione, nomi, link,
  dimensioni) inseriti al deploy.
  - `.deb` (Debian 13, Ubuntu 24.04+): `sudo apt install ./kalliope-<versione>-amd64.deb`
  - `.rpm` (Fedora): `sudo dnf install ./kalliope-<versione>-x86_64.rpm`
  - `.tar.gz` (altre): decomprimere ed eseguire `./install` (in `~/.local`, senza amministratore); `./install --remove`
  - Arch: salvare `kalliope-bin.PKGBUILD` come `PKGBUILD` vicino al `.tar.gz`, poi `makepkg -si`
  - Controllo: `sha256sum -c SHA256SUMS --ignore-missing` `[G]`
- **Regole.** Dichiarare «versione di prova»; `.deb` e `.rpm` non sono firmati e `dnf` avvisa `[R releasing.md]`; `curl` è
  necessario per lo scarico (i pacchetti lo richiedono); i comandi si copiano come sono, senza modificarli a mano.
- **Esito.** Kalliope si apre, ha la voce, dice «Pronta», e «Kalliope» compare fra i microfoni.
- **Errore e recupero.** Distribuzione o glibc troppo vecchie; PipeWire assente o solo PulseAudio; `curl` assente; rete
  assente o interrotta (lo scarico si ripete da capo); impronta non corrispondente (file scartato, si riprova); avviso
  di `dnf` sulla firma. Ogni causa ha una frase e un'azione; l'ultima è la segnalazione (P9).
- **Perché serve.** È il punto in cui si perde chi non è tecnico: senza di esso interesse e uso non si incontrano.

### P5. Usarlo in una riunione e risolvere i problemi (uso ricorrente)

- **Persona.** Chi usa Kalliope (F1) e chi la assiste (F2), a ogni riunione.
- **Bisogno.** «Fare in modo che gli altri mi sentano, ora, in questa riunione.»
- **Ingresso.** Pagina di aiuto del sito, raggiunta anche da un segnalibro; per chi vede l'avviso «Nessuna chiamata sta
  usando il microfono» o «La voce è pronta, ma…» (l'app non porta al sito: il sito deve riconoscere queste frasi).
- **Azioni e dati.** Sceglie l'app della riunione; trova dove cambiare il microfono (documentato: Zoom → Impostazioni →
  Audio → Microfono → Kalliope; le altre app **non** sono documentate: non si inventano i menu `[L]`); fa il test del
  microfono dell'app; scrive una frase e verifica. Se non funziona: PipeWire spento
  (`systemctl --user start pipewire pipewire-pulse wireplumber`), `libpipewire` assente, microfono predefinito di
  sistema (scegliere «Kalliope» in ogni app), voce a scatti (provare una soppressione del rumore più bassa: **non
  provato**), «Kalliope» non compare.
- **Regole.** Una tabella «provato / non provato» per app e piattaforma, oggi tutta «non provato in una riunione
  vera», aggiornata quando arrivano segnalazioni (P9); i comandi da terminale sono avvisati come tali, con l'invito a
  chiedere aiuto; il testo di errore citato è quello che la persona legge davvero, anche quando è in inglese.
- **Esito.** La voce arriva nella riunione.
- **Errore e recupero.** Come sopra; ultima via: P9.
- **Perché serve.** È il rischio più alto del prodotto: una persona muta in una riunione importante. Il resto del sito
  conta se questo passo regge.

### P6. «Non posso ancora usarlo» (Windows, macOS, telefono, altra lingua)

- **Persona.** Chiunque arrivi con un sistema non supportato: la maggior parte dei computer, finché la sola piattaforma è
  Linux `[I]`.
- **Bisogno.** «Posso usarlo? Quando?»
- **Ingresso.** Da P1, da ricerche, dal README.
- **Azioni e dati.** Legge la risposta onesta: oggi no. Perché: per il microfono virtuale Windows richiede un driver
  firmato e macOS un account Apple, non ancora disponibili `[P]`. Cosa c'è: il programma compila e supera i test su
  entrambi `[R]`. Cosa manca: driver, firma, pacchetto (`releasing.md`, «Not done yet»). Come essere avvisata di una
  nuova versione senza account e senza lasciare dati: il feed delle release del repository (`releases.atom`) `[I]` da
  verificare; nessuna lista d'attesa.
- **Regole.** Nessuna data promessa; nessuna alternativa di terzi consigliata senza decisione del proprietario
  (dubbio E).
- **Esito.** Non perde tempo, sa perché, sa come tornare.
- **Errore e recupero.** Non applicabile: il percorso è già il recupero.
- **Perché serve.** È probabilmente il primo incontro di molte persone con Kalliope: dire «no, e perché» subito è
  rispetto; nasconderlo è un danno.

### P7. Controllare prima di fidarsi

- **Persona.** Responsabile IT, privacy, legale (F3); utente attento; giornalista (F5).
- **Bisogno.** «Cosa fa con i miei dati? Cosa installa? Con quale licenza? Chi c'è dietro? Posso verificare?»
- **Ingresso.** Collegamento dal menu o dal piè di pagina; README; link inoltrato da chi ne ha parlato.
- **Azioni e dati.** Legge risposte brevi, ciascuna con fonte: cosa esce (nulla del testo; unico traffico: scarico della
  voce da `huggingface.co`, revisione fissata, impronte); cosa si installa e dove; permessi (nessun account); licenze
  (SANSEVIERIA 1.0; ONNX Runtime MIT; Klein Apache-2.0; Slint; Wiktionary CC BY-SA 4.0); impronte dei file e
  attestazione di provenienza (`gh attestation verify <file> -R SANSEVIERIA-OU/kalliope`: **la v0.1-rc.1 non ce l'ha**, perché
  fu pubblicata quando il repository era ancora privato; l'interrogazione dell'API con l'impronta vera del `.tar.gz` dà
  «Not Found», 12/11/2026; le release future sì, `releasing.md`); sorgente e istruzioni di
  compilazione; hosting del sito.
- **Regole.** Ogni affermazione rimanda a un file o a un comando; nessun aggettivo («sicuro», «privato») senza il fatto
  che lo regge; ciò che non è stato fatto è scritto («nessun audit indipendente» `[L]`, da confermare).
- **Esito.** Ha ciò che serve per autorizzare o rifiutare l'uso.
- **Errore e recupero.** Informazione assente: il sito lo dice e rimanda al repository per le segnalazioni.
- **Perché serve.** Chi controlla decide se la persona potrà usare Kalliope al lavoro o a scuola.

### P8. Seguire e contribuire

- **Persona.** Sviluppatore, chi pacchettizza, stampa, associazione (F4, F5).
- **Bisogno.** «Cos'è tecnicamente, a che punto è, come contribuisco, cosa posso citare?»
- **Ingresso.** Collegamento da P1, README, ricerca.
- **Azioni e dati.** Legge la catena e le misure (con macchina e metodo); la cronologia (`CHANGELOG.md`); apre repository,
  segnalazioni, benchmark; trova come contribuire (assenso di licenza descritto in `CONTRIBUTING.md`).
- **Regole.** Ogni cifra dice dove è stata misurata e dove si rifà; versioni e date vengono dai dati di release.
- **Esito.** Ha fatti citabili e un posto dove contribuire.
- **Errore e recupero.** Una misura che non si riproduce: il sito indica lo strumento e il file.
- **Perché serve.** Il progetto è pubblico e vive di contributi e di prove reali.

### P9. Dire come è andata (prove reali e problemi)

- **Persona.** Chi ha provato Kalliope in una riunione vera; chi ha un problema.
- **Bisogno.** «Segnalare che ha funzionato o no con una certa app.»
- **Ingresso.** Dal fondo di P5 e da P4.
- **Azioni e dati.** Indica app e versione, distribuzione, versione di PipeWire, cosa è successo, la frase di stato che
  la finestra mostrava. Canale: oggi solo le segnalazioni del repository su GitHub, che richiedono un account (dubbio A).
- **Regole.** Il sito non ha moduli; chiede di **non** incollare le frasi dette (sono private); spiega cosa serve per una
  segnalazione utile.
- **Esito.** Un dato reale che aggiorna la tabella «provato / non provato» (P5).
- **Errore e recupero.** Nessun account GitHub: finora senza alternativa (dubbio A).
- **Perché serve.** Lo stato «non ancora provato» si chiude solo con prove reali; il sito è il posto che le chiede.

### P10. Pubblicare una nuova versione (amministrazione)

- **Persona.** Proprietario e coordinatore (F6).
- **Bisogno.** «Aggiornare il sito a ogni release senza riscrivere nulla e senza dire cose non più vere.»
- **Ingresso.** Tag di una nuova release → esecuzione di `tools/site.py` al deploy.
- **Azioni e dati.** Lo script legge la release (versione, nomi, link, dimensioni, impronte) e li inserisce al posto dei
  segnaposto; chi pubblica rilegge le frasi di stato («versione di prova», «non provato con…») e la tabella «provato / non
  provato».
- **Regole.** Il sito non contiene versioni, nomi di file o dimensioni scritti a mano; i segnaposto sono pochi e
  definiti; se manca un dato atteso la pubblicazione deve fallire in modo visibile, non mostrare dati vecchi.
- **Esito.** Sito e release coincidono.
- **Errore e recupero.** Release senza uno dei file attesi, o segnaposto non sostituito: la pubblicazione si ferma.
- **Perché serve.** La regola «zero dipendenze e nessun passo di build» regge solo se i dati vengono da una fonte unica.

---

## 11. Dalla scheda alla ricerca

I percorsi si traducono in compiti di design (spiegare un servizio sconosciuto; far sentire una voce; guidare una
installazione con ripresa; dire con onestà stato e limiti; testi semplici; accessibilità motoria e oculare; fatti per chi
controlla; telefono e inoltro; stati vuoti e «non per te»; documentazione d'uso ricorrente). Il piano, con categorie,
quantità e domande per ogni visita, è in `design/ricerca/piano.md`.

---

## 12. Lacune e dubbi

**Cambiano lo scopo o i compiti: da chiedere al proprietario**

| ID | Dubbio | Perché conta |
|---|---|---|
| A | Un canale per dire «ha funzionato» o «no» senza un account GitHub (un indirizzo e-mail?). Oggi non ne esiste uno | Cambia P9 e la coerenza con «niente account» |
| B | Il sito è solo italiano? README e metainfo sono già in inglese; il prodotto parla solo italiano | Cambia localizzazione e prove di lingua. Assunto: solo italiano |
| E | Il sito può, nel percorso P6, indicare cosa fare nel frattempo (per esempio provare Linux) o alternative di terzi? | Cambia il tono e i contenuti del percorso più frequente |
| F | Avvertenza d'uso («non è un dispositivo medico; non sostituisce la valutazione di un logopedista») | Cambia P3 e il registro; non va inventata da noi |
| G | I campioni voce: sono registrazioni non ritoccate di Kalliope 0.1? E la forma parlata delle cifre è nota? | Cambia cosa può dire P2 sulla fiducia |

**Non cambiano lo scopo; da tenere presenti**

- Il proprietario non ha indicato siti di riferimento: `riferimenti.md` chiede di partire da quelli. Va chiesto una volta ai
  traguardi, la ricerca può partire.
- Nessun materiale di persone reali (foto, testimonianze, frasi): il sito non ne inventa. Sarebbe utile averne, con
  consenso.
- Se la rimozione toglie anche la voce scaricata; tempo di «Preparo la voce…»; test con Orca e con puntamento oculare;
  compatibilità con le app di riunione; latenza end-to-end; codec dei campioni nei tre motori (§2.3, §6).
- Discrepanze nel repository, già segnalate al coordinatore (`design/incarichi/progetto/progresso.md`): «There is no
  release yet» nel README con una prerelease pubblicata; «52 MB» nel README contro 53 MB altrove; la foto della finestra
  mostra «Senti anche tu» spento mentre il codice lo accende di default; errori del microfono in inglese dentro frasi
  italiane; l'app non rimanda al sito.
- Nessun dato d'uso (per scelta) né prove con utenti reali.

---

## 13. Fonti

Repository `/workspace/kalliope`: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `NOTICE`, `THIRD_PARTY_NOTICES.md`,
`LICENSE` (§2, §4, §5, §7), `docs/virtual-microphone.md`, `docs/releasing.md`, `benchmarks/engines/README.md`,
`crates/app/ui/app.slint`, `crates/app/src/{main,engine,audio,catalog,download,settings,paths}.rs`, `crates/mic`,
`packaging/linux/*` (metainfo, `.desktop`, icona). Release: https://github.com/SANSEVIERIA-OU/kalliope/releases/tag/v0.1-rc.1
(letta con `gh release view`, 12/11/2026: `.deb` 14.132.560 B, `.tar.gz` 19.165.753 B, `.rpm` 19.169.644 B,
`kalliope-bin.PKGBUILD`, `SHA256SUMS`; prerelease). Materiale del sito: `site/voce/*.mp3`, `site/immagini/kalliope-finestra.png`.
Coordinatore: `design/STATO.md`, `design/incarichi/{comune,progetto}.md`, `design/metodo-capacita.json`. Il proprietario:
conversazione con l'utente, 2026 (fatti riportati nell'incarico).
