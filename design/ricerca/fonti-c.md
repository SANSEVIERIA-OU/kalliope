# Fonti del Gruppo C: prodotti affini e concorrenti, e pagine italiane per pazienti, caregiver e logopedisti

Data di consultazione: 12/11/2026 · Ruolo: vibe-next:research (raccolta fonti, tempo 1) · Incarico: `design/incarichi/ricerca-c.md`
Prodotto di riferimento: Kalliope (`design/progetto.md` §0-§4) · Piano: `design/ricerca/piano.md` §4, §6.3, §9

## 0. Metodo e limiti (leggere prima)

- **Nessuna visita visiva.** Le letture sono testuali: WebFetch (testo convertito) e richieste HTTP con `curl` (codice,
  URL finale, titolo, descrizione, marcatori anti-bot), oppure estrazione del testo visibile dall'HTML. Lo snippet di ricerca
  non è mai stato usato come lettura di pagina. Le visite visive (Chrome MCP o browser equivalente) sono di competenza del ruolo visivo.
- **Browser interattivo non disponibile in questa sessione.** `ToolSearch` su «chrome browser navigate screenshot» non ha
  restituito tool di browser (solo Gmail, Calendar, DocuSign, in autenticazione). Le pagine bloccate restano lacune, non visite.
- **Nessuna finestra aperta.** Nessun browser grafico, nessun `passo.mjs` in modalità finestra, nessun comando sul DISPLAY dell'utente.
- **Nessun file cancellato.** Materiali scaricati o dati di prova sono in cartelle nuove sotto `design/incarichi/ricerca-c/`
  (vedi §11). Gli script sono in `script-http/`, separati dai contenuti scaricati, che non sono mai stati eseguiti.
- **Gruppo C non Webby.** Il piano (§4) dice che i prodotti del gruppo C non portano premi e non entrano nei conteggi dei vincitori.
  Il criterio «prova della vittoria» dell'incarico non si applica a questi prodotti: per ognuno il campo premio è scritto come «non Webby, gruppo C».
  Dove un prodotto ha un riconoscimento (Webby o altro) lo riporto come osservazione per la deduplica (§6).
- **Lingua delle fonti:** italiano e inglese. Le citazioni in inglese sono tradotte nel testo ma riportate tra virgolette con l'originale.

## 1. Esito in breve

- **Prodotti aperti e verificati: 5** (4 più 1 riserva, in §2). Scelta proposta dal ruolo di ricerca; la decisione spetta al coordinatore.
- **Prodotti non verificati: 2** (TD Snap, bloccato da HTTP 429 su tre host; Zip Speech, bloccato da una verifica JavaScript su addons.mozilla.org). Dettagli in §3.
- **Pagine italiane aperte: 5** (AISLA, AILAR, A.I.T.A. Umbria, Vivavoce, FLI), di cui 4 per pazienti e familiari e 1 professionale (§4).
  Per la disartria non è stata fatta alcuna ricerca (lacuna, §7).
- **Funzioni delle app di riunione: 3 fonti aperte** (Teams RTT, Zoom community, guida RNID per Zoom) più 1 prodotto terzo (InnoCaption), in §5.
- **Inventario:** 280 URL distinti dalle 18 ricerche (incluso `voiceitt.com/`, citato nei risultati). Ogni URL ha una riga in §9 (appendice A), con esito; le pagine aperte direttamente sono in §10 (appendice B).

## 2. Prodotti verificati (gruppo C)

Campi di §6.3 per ciascun prodotto. Data di consultazione per tutti: 12/11/2026. «Compiti C» sono ipotesi del ruolo di ricerca,
da confermare con il ruolo visivo; non sono evidenze.

### 2.1 Proloquo (AssistiveWare) — CAA su iOS e macOS — candidato primario (CAA, voce)

- Nome: Proloquo2Go (prodotto storico) e Proloquo (prodotto più recente, con Proloquo Coach per i caregiver). Riportati entrambi.
- Indirizzo del prodotto: https://www.assistiveware.com/products/proloquo2go (HTTP 200; `/proloquo2go` reindirizza a `/products/proloquo2go`).
  Seconda scheda: https://www.assistiveware.com/products/proloquo (letta via WebFetch; non testata via curl).
- Categoria ufficiale, edizione, tipo di premio, scheda del premio, motivazione: non Webby (gruppo C). Vedi §6 per il riconoscimento Webby 2013 come «honoree».
- Chi lo ha realizzato: AssistiveWare B.V. (footer della scheda: «Copyright 2026 AssistiveWare B.V.»).
- Esito apertura: HTTP 200 (curl), contenuto letto via WebFetch. Nessuna verifica anti-bot.
- Dati dal sito del prodotto (WebFetch, 12/11/2026):
  - Proloquo2Go: «The world's most popular AAC app for iPad and iPhone» e «enables nonspeaking children and adults to express themselves confidently».
  - Piattaforme: iPhone, iPad, Apple Watch (iOS 18, watchOS 11), Mac (macOS 15 o successivo, app separata). Lingue: inglese, spagnolo, francese, olandese.
  - Accesso: «supports a range of interaction methods, switches, and keyguards». Interruttore confermato. Il tocco non è citato come metodo; sguardo (eye gaze) e scansione non compaiono.
  - Prezzi: iOS USD 249,99 e 299,99; Mac USD 124,99, 129,99 e 149,99; pacchetto «AAC Essentials Bundle» con prezzi in varie valute, senza data. Modello di prezzo (acquisto unico o abbonamento) non dichiarato.
  - Proloquo (nuovo): pensieri visivi («Thinking Space»), «Focus Mode», oltre 60 voci gratuite, Proloquo Coach. Abbonamento: USD 9,99 al mese o 99,99 l'anno; un mese gratuito. Data dei prezzi non indicata.
  - Riconoscimenti sulla pagina: «an award-winning AAC app» senza nome, ente o anno. Altro: vedi §6.
- Compiti C a cui può servire (ipotesi): C2 (far sentire una voce con il testo accanto e controllo totale), C7 (interruttore). Proloquo è un
  sistema a simboli: Kalliope non ha pittogrammi (`progetto.md` §1.4), quindi il confronto riguarda la voce e il controllo, non il metodo.
- Prima ipotesi di cosa non prendere: il modello a simboli e la struttura a griglie di frasi preimpostate, che Kalliope esclude; il prezzo
  alto e non datato. Il riferimento al 2023 come «App Store Award» è di Apple, non Webby (§6).

### 2.2 Grid (Smartbox) — CAA per Windows e iPad — candidato primario (CAA, computer)

- Nome: Grid (sito del produttore: «Grid», «Grid 3», «Grid for iPad», «Grid on Windows»).
- Indirizzo del prodotto: https://smartboxaac.com/ukie/grid-software/ (HTTP 200; letto via WebFetch). Il sito generale è https://smartboxaac.com/ukie/
  (HTTP 200; `thinksmartbox.com` reindirizza qui). Documentazione: https://hub.smartboxaac.com/ (HTTP 200 via `hub.thinksmartbox.com`).
- Categoria, edizione, premio, scheda premio, motivazione: non Webby (gruppo C).
- Chi lo ha realizzato: Smartbox (Smartbox Assistive Technology).
- Esito apertura: HTTP 200 (curl) per il sito e per la pagina del software; contenuto letto via WebFetch.
- Dati dal sito del produttore (WebFetch, 12/11/2026):
  - «Grid» è il «flagship software»; «Over 20 million words are spoken with our flagship software, Grid, every week» (dichiarazione del produttore).
  - Piattaforme: Windows («Grid on Windows») e iPad/iOS («Grid for iPad»). Mac non citato.
  - Accessi: sguardo (eye gaze), tocco, interruttore («Switch scanning»), puntatore (mouse o joystick), voce («Hey Grid 3» per le attivazioni, non dettatura).
  - Prova: Windows «60-day free trial»; iPad «free 30-day trial through the App Store». Prezzo e licenza: non trovati sulla pagina.
  - Controllo di computer e della casa: citato per Windows (TV, luci, elettrodomestici).
  - Data o versione: non trovate. «© 2026» è un copyright, non una data di aggiornamento.
- Dati da un rivenditore (Inclusive Technology, support hub, HTTP 200, letto via WebFetch; non è il produttore): «Grid 3 runs on Windows 10 and later»;
  sguardo tramite eye tracker con calibrazione; interruttore a scansione via USB o Bluetooth; chiave di licenza per uscire dal periodo di prova.
  Versione o data assoluta non trovate («Last Update 10 months ago», relativo).
- Compiti C a cui può servire (ipotesi): C7 (sguardo, interruttore e puntatore su computer, con ripiego per il tocco), C10 (documentazione d'uso, in hub).
- Prima ipotesi di cosa non prendere: il comando vocale a parole chiave, le prove gratuite e la struttura a licenza; il dato «20 milioni di parole» è un'affermazione del produttore, non verificata.

### 2.3 Text-to-Mic (Scorchsoft) — sintesi vocale che entra nel microfono di una riunione — candidato primario (microfono virtuale)

- Nome: Text-to-Mic.
- Indirizzo del prodotto: https://www.scorchsoft.com/posts/text-to-mic-for-meetings (HTTP 200 dopo redirect da `/blog/text-to-mic-for-meetings`; letto via WebFetch).
  Repository pubblico: https://github.com/andrew-scorchsoft/text-to-mic (letto via WebFetch). Il sito del produttore non è un dominio dedicato al prodotto: la pagina è un post del sito Scorchsoft.
- Categoria, edizione, premio, scheda premio, motivazione: non Webby (gruppo C). Riconoscimenti del prodotto: «None found» (WebFetch).
- Chi lo ha realizzato: Scorchsoft Ltd (Regno Unito, «a UK-based app development company»).
- Esito apertura: HTTP 200 (curl) e lettura via WebFetch. Nessuna verifica anti-bot.
- Dati dalla pagina (12/11/2026):
  - Converte testo digitato o registrato in voce e la manda a altoparlanti, cuffie o microfono virtuale nelle riunioni.
  - Versioni: Windows EXE (72 MB), versione 1.4.1, data 18/08/2025 (dato della pagina); Mac ZIP (28 MB), versione 1.0.5, senza data.
  - Dipendenza: VB-Cable. La pagina dice: «Install VB-Cable to route app audio into a meeting microphone». Configurazione: uscita dell'app su «Cable Input (VB-Audio)»; nelle app di riunione si sceglie il cavo come microfono. Solo uno screenshot per Google Meet; per Teams e Zoom non ci sono passi.
  - Licenza: «Free and open source · LGPL». Il repository dichiara LGPL v3.0 (vedi §8, conflitto: la versione non compare nella pagina di prodotto).
  - Chiave API: non serve per le voci di sistema (v1.4.1: «Runs without an OpenAI API key for system voice text-to-speech»); serve per le voci AI, per la trascrizione e per la riscrittura del testo con AI.
  - Repository (WebFetch): 20 stelle, 2 fork; sezione «Releases» vuota; il README indica VB-Cable come dipendenza.
- Compiti C a cui può servire (ipotesi): C2 (far sentire una voce con il testo accanto); è un esempio di sintesi vocale verso un microfono virtuale.
- Prima ipotesi di cosa non prendere: la dipendenza da un driver audio di terze parti (VB-Cable), il percorso su Mac non documentato e la dipendenza da chiavi API per le funzioni AI. Kalliope è offline e non usa servizi esterni.

### 2.4 Voiceitt — riconoscimento del parlato atipico — candidato primario (parlato atipico)

- Nome: Voiceitt (azienda e prodotto).
- Indirizzo del prodotto: https://voiceitt.com/ (HTTP 200; letto via WebFetch). FAQ: https://www.voiceitt.com/faq (HTTP 200; letto via WebFetch).
- Categoria, edizione, premio, scheda premio, motivazione: non Webby (gruppo C). Elenco di riconoscimenti sulla home («Google AI Launchpad», «NVIDIA Inception», «Microsoft AI for Accessibility», altri): senza anno né dettaglio; non verificati.
- Chi lo ha realizzato: Voiceitt (società israeliana secondo un comunicato del 2024, citato in una fonte di ricerca non letta per intero; non verificato sul sito).
- Esito apertura: HTTP 200 per home e FAQ; nessuna verifica anti-bot.
- Dati dal sito (WebFetch, 12/11/2026):
  - Riconoscimento per «non-standard speech»: «people with speech disabilities, aging adults, and accented speakers». Condizioni citate: ictus, SLA, Parkinson, paralisi cerebrale, disartria.
  - Modalità: app web con tre modi (Speak, da parlato a parlato; Dictate, da parlato a testo; Integrations); estensione Chrome con account; integrazioni con Zoom («free to link Voiceitt Captions», secondo la FAQ; la home riporta Zoom come beta), Teams e Webex (richiedono abbonamento a pagamento secondo la FAQ).
  - Prezzo (FAQ): USD 49,99 al mese o USD 600 l'anno; prova gratuita di 30 giorni, senza data. La home non indica prezzi.
  - Accuratezza, dichiarazione dell'azienda: «recognition accuracy varies and depends on the individual's unique speech patterns»; «We can't promise you 100% accuracy». Nessuna percentuale. «Up to three times» meglio del software standard, senza condizioni (affermazione del fornitore).
  - Registrazioni richieste per il riconoscimento personale: minimo 50 secondo la FAQ; la sezione Chrome dice 200 (conflitto, §8).
  - Lingua: solo inglese («with more languages to come»).
- Compiti C a cui può servire (ipotesi): C2 (ascolto e controllo) e C5 (dichiarazione onesta di accuratezza). Serve anche per capire come altri parlano a chi ha un parlato difficile (`piano.md` §4, punto 4).
- Prima ipotesi di cosa non prendere: la promessa di accuratezza senza numero; il lungo periodo di addestramento; la frammentazione di Teams e Webex. Kalliope non riconosce il parlato.

### 2.5 Riserva: Predictable (Therapy Box, con PRC-Saltillo nel copyright) — CAA a testo con sintesi vocale

- Nome: Predictable (la pagina parla di «Predictable 8» come versione corrente e di «Predictable Pro»).
- Indirizzo del prodotto: https://www.therapybox.co.uk/predictable-english (letto via WebFetch; l'URL `therapy-box.co.uk/predictable` risponde HTTP 302 verso la home https://therapybox.co.uk/, HTTP 200, letta via WebFetch).
- Categoria, edizione, premio, scheda premio, motivazione: non Webby (gruppo C). La pagina dice «award-winning» senza nome né anno; Apple l'ha segnalata nella sezione «Meet the Developer» dell'App Store.
- Chi lo ha realizzato: Therapy Box (copyright del sito «PRC-Saltillo», comunicato di acquisizione delle app Therapy Box da parte di PRC-Saltillo nella home).
- Esito apertura: HTTP 200 dopo redirect; nessuna verifica anti-bot. Il marcatore «captcha» trovato nel codice è una voce di funzionalità del sito Wix, non una verifica.
- Dati dal sito (WebFetch, 12/11/2026):
  - «designed for people who have difficulty speaking»; utenti citati: «MND/ALS, cerebral palsy, autism, stroke, brain injury, and head and neck cancer». La sindrome di Down non compare.
  - Piattaforme: iOS/iPad «iOS13 and later»; Android «OS12». macOS e Apple Vision non citati.
  - Accesso: testo da tastiera o griglia di frasi; «Head tracking ... with no extra hardware required» su molti dispositivi iOS. Interruttore, sguardo e scansione non citati.
  - Voci: integrazione con ElevenLabs; le voci online hanno quota giornaliera per alcune lingue.
  - Prezzo: non indicato. Supporto: therapybox.co.uk/support; email support@therapy-box.co.uk (dominio diverso dal sito, da verificare).
- Compiti C a cui può servire (ipotesi): C2, C5, C7 (testo con head tracking). Il riferimento esplicito a SLA e malattie neuromuscolari lo rende utile per F1 (`progetto.md` §4.1).
- Prima ipotesi di cosa non prendere: la previsione di parole; la dipendenza da voci iOS o ElevenLabs; il prezzo non noto.

## 3. Prodotti non verificati (non contano nei 5)

- **TD Snap (Tobii Dynavox)** — sito del prodotto non aperto. Tentativi: `https://www.tobiidynavox.com/products/td-snap` (HTTP 429, `Retry-After: 60`),
  `https://us.tobiidynavox.com/products/td-snap` (HTTP 429), `https://ca.tobiidynavox.com/products/td-snap` (HTTP 429); WebFetch sui primi due: 429. Ripetuti tentativi (curl e WebFetch, più di sei) durante la sessione, sempre 429 con Retry-After 60.
  Secondo tentativo con altro strumento: non disponibile (vedi §0). Lettura parziale dalla scheda App Store USA (HTTP 200, `apps.apple.com/us/app/td-snap/id1072799231`, testo letto da HTML): «Free · In-App Purchases»,
  sviluppatore Tobii Dynavox LLC, «Requires iPadOS 13.0 or later», lingue EN + 23; «accessible via touch, eye gaze and switch access methods»; «A monthly subscription is required to enable speech following after a 1-month trial period».
  Conflitto: lo snippet di ricerca (non letto) parla di iPadOS 15 e di Windows 10 1803 o successivo; la scheda App Store dice iPadOS 13.0. Il sito ufficiale resta da verificare.
  **Sostituto proposto dal ruolo di ricerca:** TD Snap va riaperto da un browser o dal ruolo visivo. Fino ad allora la CAA è coperta da Proloquo e Grid (§2.1-2.2); Predictable (§2.5) resta riserva.
- **Zip Speech (add-on Firefox)** — https://addons.mozilla.org/firefox/addon/zip-speech/ restituisce HTTP 200 con la pagina «Client Challenge» (verifica JavaScript; nessun contenuto del prodotto). Dal solo snippet di ricerca (non letto): inietta l'audio nel flusso del microfono di Google Meet e pronuncia il testo con Ctrl+Invio. Non verificato.
- **InnoCaption Bot (TTS in riunione)** — non scelto, osservato per §5. Scheda di aiuto aperta (§5).

## 4. Pagine italiane per pazienti, caregiver e logopedisti

Ordinate per utilità ai compiti del piano (C2, C5, C6, C10 e il livello F1/F2). Data di consultazione: 12/11/2026. Non si tratta di schede di premio.

1. **AISLA — Associazione Italiana Sclerosi Laterale Amiotrofica (APS)** — SLA, F1 e F2.
   - Home: https://www.aisla.it/ (HTTP 200; letta via WebFetch). Sede: via G. B. Pergolesi 6, 20124 Milano; tel. +39 02 66982114; segreteria@aisla.it.
     Lo slogan del footer è «Persone che aiutano persone». Anno di fondazione e riconoscimento ministeriale: non trovati nel testo.
   - Pagina sulla comunicazione: https://www.aisla.it/lespressione-dei-propri-diritti-attraverso-la-comunicazione-non-verbale/ (letta via WebFetch).
     Parla di comunicatori a puntamento oculare («sfruttano l'unico movimento ancora controllabile... quello degli occhi»), di un «puntatore oculare e sintetizzatore vocale» e di tastiera con PIN.
     Il tema principale è la firma e i diritti (notariato, DAT, legge 219/2017), non la conversazione quotidiana. Autore e data dell'articolo: non indicati.
     Nessuna guida operativa per i caregiver: «Il testo non contiene una guida specifica per i caregiver».
   - Guida «CAA nella SLA» (rev. dicembre 2024): https://aisla.it/wp-content/uploads/2024/12/CAA-nella-SLA_DEF_rev-dicembre-2024.pdf
     HTTP 200, 865.729 byte, 23 pagine (dati del PDF). **Non letta:** nessun estrattore di testo PDF nell'ambiente; i font sono in codifica Identity-H; WebFetch restituisce il binario. Scaricata in `download-caa-01/caa-nella-sla.pdf` (vedi §11).
     Dallo snippet di ricerca (non letto): cita app di sintesi vocale per tablet («Io Parlo», «Leggimi»), emulatori di mouse a puntamento oculare, amplificatori di voce, messaggi registrati e voice banking. **Da leggere prima di usarla.**
   - Notizie in evidenza (home): senza data di pubblicazione; solo date di eventi (27/09/2026; congresso SIN 24-27/10/2026).
2. **AILAR — Associazione Italiana Laringectomizzati (OdV)** — laringectomia, F1 e F2 (voce dopo l'intervento).
   - Home: https://www.ailar.it/ (HTTP 200; letta via WebFetch). Sede: via Caroncini 5, 20137 Milano; tel. 02.5510819, urgenze 370.3497559; info@ailar.it.
     Missione: «aiuta le persone laringectomizzate a recuperare la voce e le funzioni sensoriali», con volontari anch'essi laringectomizzati formati come «maestri riabilitatori».
   - Pagina «Tornare a parlare»: https://www.ailar.it/come-si-torna-a-parlare/tornare-a-parlare.html (letta via WebFetch).
     «L'intervento di laringectomia totale compromette definitivamente la produzione della voce... Questo non significa compromettere la possibilità di parlare.»
     Alternative: protesi tracheo-esofagea e laringofono (guida PDF «il laringofono.pdf»). Nessun esercizio pratico e nessuna frase di incoraggiamento esplicita; nessun riferimento ad app di comunicazione.
     L'app «La mia voce» compare solo nel menu («Progetti»), senza descrizione.
   - Notizie (home): 23/04/2026 «Echi dal silenzio»; 23/04/2026 «Assemblea Nazionale Ailar»; 10/03/2026 bando di Servizio Civile 2026.
   - Sito citato nelle fonti (laringect.it, 2017): nessuna risposta (rete/DNS, codice 000). trattoblu.com non è di AILAR (società di corsi ORL).
3. **A.I.T.A. Umbria OdV — afasia** — afasia; F1 (afasia dopo ictus) e F2 (familiari e logopedisti).
   - Pagina: https://sites.google.com/site/aitaumbriaonlus/rubrica/life-participation-approach-to-aphasia (HTTP 200; letta via WebFetch).
     Titolo «Life Participation Approach to Aphasia». Destinatari: logopedisti, persone con afasia e familiari.
     Citazione in apertura di Audrey Holland: «Le persone afasiche comunicano meglio di come parlano.»
     «Le persone con afasia e i loro familiari spesso riferiscono di sentirsi abbandonati.» Le informazioni vanno fornite «in formato accessibile, scritto o con modalità di supporto aumentativo-alternativo».
     Contatto: associazioneaitaumbria@gmail.com. Data di pubblicazione: non trovata. Nessun elenco di sportelli umbri.
   - **Federazione nazionale A.I.T.A.: sito non trovato** (vedi §5 non trovati). Il dominio aita.it (HTTP 200) è un'agenzia immobiliare, non un'associazione per l'afasia (letto via WebFetch).
     La sezione Sardegna (sites.google.com/site/aitasardegnaonlus/) reindirizza a una pagina di accesso Google (login): accesso negato, non letta.
4. **Associazione Vivavoce — balbuzie e altre difficoltà di comunicazione** — balbuzie; F1 (balbuzie) e F2 (famiglie).
   - Home: https://associazionevivavoce.it/ (HTTP 200; letta via WebFetch). Sede: via G. B. Pergolesi 8, 20124 Milano; tel. 349.0525867; info@associazionevivavoce.it.
     Missione: «rendere ogni persona libera di essere sé stessa»; «supporto gratuito» descritto in generale; percorso con i professionisti del Centro Vivavoce e con tutor che hanno superato la balbuzie.
     Destinatari: persone con balbuzie, famiglie, scuole, adulti (volume «La balbuzie spiegata ai grandi»). Pagine «Attività», «Osservatorio», «Voice Help» presenti ma senza contenuto nel testo.
     Anno di fondazione e natura giuridica: non indicati. Nessuna data o evento recente nella pagina.
   - Sul sito di Vivavoce non emerge alcun riferimento a comunicazione alternativa o a tecnologie: utile per il tono e per chi parla con difficoltà, non per il prodotto.
5. **FLI — Federazione Logopedisti Italiani** — professionale; per F2 (logopedisti) e per il quadro normativo.
   - Home: https://www.fli.it/ (HTTP 200; letta via WebFetch). Il sito è rivolto ai logopedisti (iscrizione, albo, codice deontologico, libera professione), non ai pazienti.
     Contatti: pagina https://www.fli.it/chi-siamo/contatti/ (linkata, non letta). Anno di fondazione e riconoscimento ministeriale: non nel testo. Una fonte di ricerca (audizione parlamentare del 2024, solo snippet, non letta) dice che FLI è iscritta nell'elenco delle associazioni tecnico-scientifiche del Ministero della Salute.
   - Unico materiale divulgativo (link dalla home, non aperto): «Parliamo di… Disturbo Primario del Linguaggio – Opuscolo FLI-CLASTA» (18/10/2024).
   - Per afasia c'è solo un master per professionisti (15/10/2026). Nessuna pagina su balbuzie, disfonia o disartria nel testo della home (conflitto con lo snippet, §8).
   - Comunicazione alternativa: il termine non compare.

**Non in lista (per completezza):** Voice for Purpose (https://voiceforpurpose.com/, HTTP 200, letta via WebFetch) è un consorzio (Translated, PI Campus, Campus Bio-Medico, NLab/Nemo Lab, più partner) per donare voci a chi usa sintetizzatori. Le malattie citate sono «degenerative» e «neuromuscolari»; SLA e AISLA non compaiono. Donazione anonima e consenso. Consultare la libreria è gratuito. Il sito indica un codice SSN («22.39.07.003 - sintetizzatore vocale») per la fornitura: **non verificato** contro la fonte normativa. Data di lancio e numero di voci non indicati. Osservato per C2 (voce personale), con cautela.

## 5. Funzioni delle app di riunione (tempo 1, piano §4, punto 3)

- **Microsoft Teams — Real-Time Text (RTT)**: https://support.microsoft.com/accessibility/teams/use-real-time-text-rtt-in-microsoft-teams (HTTP 200; letta via WebFetch).
  Il testo digitato si vede lettera per lettera agli altri partecipanti, senza invio. Attivazione per riunione: «Turn on RTT for this call» (Windows, macOS, web); «Turn on RTT for this meeting» (iOS, Android). Piattaforme: Windows, macOS, iOS, Android, web. Destinatari dichiarati: persone con esigenze di udito, parola, cognitive o di comunicazione non verbale.
  **Verso:** il testo va dal digitato all'uditorio come testo, non come voce. Nessuna sintesi vocale. Licenza: non trovata. Data dell'articolo: solo «© Microsoft 2026».
  La pagina Microsoft letta non cita alcuna sintesi vocale del testo digitato, e la ricerca non ne ha trovata un'altra: non è una prova di assenza su tutta la documentazione Microsoft.
- **Zoom — assenza di sintesi vocale nativa**: discussione della community https://community.zoom.com/chat-3/text-to-speech-80752 (HTTP 200; testo estratto dall'HTML, WebFetch troncato).
  Un Community Manager di Zoom (5 giugno 2026): «Zoom does not currently show a built-in feature that reads typed in-meeting chat messages aloud for participants.» Cita Voice Translator come funzione vicina ma diversa (converte le didascalie tradotte in audio). Consiglia uno strumento TTS separato sul dispositivo. La risposta è segnata come migliore il 19 giugno 2026.
  Fonte: forum della community, non documentazione ufficiale. Voice Translator non è stato aperto né verificato.
- **Zoom — discussione 2023 con un'alternativa**: https://community.zoom.com/meetings-2/accessibility-for-non-speaker-37016 (HTTP 200; testo estratto dall'HTML).
  Domanda del 30/04/2023 sulla sintesi vocale per chi non parla; risposta di ZoomTestKitchen (02/05/2023): imposta il microfono Zoom sul dispositivo audio del computer, digita il testo in uno strumento TTS web e lo fa riprodurre. Soluzione alternativa, non funzione di Zoom.
- **Zoom — guida RNID all'accessibilità**: https://rnid.org.uk/information-and-support/technology-and-products/video-conferencing-accessibility/zoom/ (HTTP 200; letta via WebFetch).
  Funzioni elencate: sottotitoli automatici o umani, trascrizione completa (se abilitata), interprete LIS (BSL) su richiesta, pressione per parlare, soppressione del rumore di base, connessione a dispositivi con uscita cablata o Bluetooth. Nessuna sintesi vocale. Citato come strumento terzo: Otter.ai per le didascalie. Aggiornamento: 27/05/2026 (footer).
- **Zoom Rooms — discussione «Speech to Text option for the Zoom Chat Windows»** (HTTP 200): nessuna occorrenza di sintesi vocale nel testo estratto. Non rilevante.
- **InnoCaption — Bot con sintesi vocale in riunione** (prodotto terzo, non nei 5): https://help.innocaption.com/en/articles/16191297-use-text-to-speech-with-innocaption-bot (HTTP 200; letta via WebFetch, articolo datato 04/08/2026).
  Funzione: l'utente digita un messaggio nella casella TTS e preme «Speak»; il bot lo pronuncia nella riunione. Piattaforme: Google Meet, Teams, Zoom, Webex. Requisiti: account InnoCaption Web, bot nella riunione, TTS abilitato, voce scelta nelle impostazioni. Voci, lingue, costo e limiti: non trovati.
  Il testo non dice dove la voce sia prodotta (sul server o sul dispositivo). Osservato come candidato, non scelto: il suo meccanismo (bot terzo con account) è diverso da quello di Kalliope.

## 6. Riconoscimenti osservati su prodotti del gruppo C o affini (per la deduplica, non per il gruppo C)

Il gruppo C esclude i premi Webby. Queste righe servono al coordinatore per la deduplica con i gruppi A e B (piano §6).

- **Proloquo2Go (AssistiveWare) — 17ª edizione dei Webby Awards (2013)**: comunicato del 23/04/2013 («Proloquo2Go Selected as Official Honoree in the 17th Annual Webby Awards», https://www.assistiveware.com/press-releases/proloquo2go-selected-as-official-honoree-in-the-17th-annual-webby-awards, HTTP 200, letto via WebFetch).
  Il comunicato dice «selected as Official Honoree», cioè honoree, non winner. Categorie citate nel comunicato: «Best Practices» e «Utilities and Services» (testo del comunicato, non verificato sul catalogo ufficiale winners.webbyawards.com). Non c'è il link alla scheda Webby.
- **Proloquo — App Store Award 2023, categoria «Cultural Impact» (winner)** (Apple, non Webby): https://apps.apple.com/be/story/id1705093873 (HTTP 200; letto via WebFetch). Anno dedotto dai link della pagina, non dichiarato. Non è un riconoscimento Webby.
- **Vocable AAC (WillowTree) — Webby 2021, «Experimental & Innovation» (Webby Winner), e «Best Practices» (Honoree)**: https://winners.webbyawards.com/2021/apps-and-software/mobile-ott-app-features/experimental-innovation/168530/vocable-aac (HTTP 200; letto via WebFetch). Prodotto: https://www.vocable.app/ (dalla scheda). Motivazione ufficiale: «Not found» sulla scheda.
  Vocable è un'app di comunicazione (AAC) vincitrice Webby: va verificata dai gruppi A o B, non nel gruppo C.
- **Vocable AAC — Webby 2023, «Best Use of Voice Technology» (Nominee; categoria sotto «Apps, dApps and Software»)**: https://winners.webbyawards.com/2023/apps-dapps-and-software/app-features/best-use-of-voice-technology/250170/vocable-aac (HTTP 200; letto via WebFetch). Prodotto: https://apps.apple.com/us/app/vocable-aac/id1497040547 (dalla scheda). Motivazione: non trovata.
- **AAC Awards 2023 (Communication Matters, 24/03/2023, Leeds)**: https://www.communicationmatters.org.uk/news/aac-awards-2023 (letto via WebFetch). Nessuno dei prodotti del gruppo C compare nella pagina. Il premio «AAC Innovation Award» è andato a Liopa LLC («A simple lipreading app that brings a voice to the voiceless»).
- **Webby, 30ª edizione (2026) — annuncio dei vincitori del 21/04/2026, cerimonia dell'11/05/2026**: https://www.webbyawards.com/press/press-releases/30th-annual-webby-awards-announce-2026-winners/ (letto via WebFetch). È la più recente edizione conclusa e riporta People's Voice (il riconoscimento del pubblico). Il comunicato non elenca le schede, quindi non ho verificato singole categorie 2026 per il gruppo C.

## 7. Non trovato (con motivo)

- **Sito della Federazione nazionale A.I.T.A. (afasia)**: tre ricerche e i link delle sezioni regionali non danno il dominio nazionale. aita.it è un'agenzia immobiliare (letto). Sezione Sardegna su Google Sites: accesso negato (login).
- **Associazione Italiana Balbuzie** (nominata nella ricerca): nessuna associazione con questo nome nei risultati. LEA («Libera Espressione Autentica», citata da un comunicato Italpress) senza sito trovato. Vivavoce è l'unica associazione per la balbuzie aperta.
- **AILO (Associazione Italiana Logopedisti)**: nessun sito trovato. La federazione aperta è FLI (§4.5). ALOSI (fpct.ch) è un'associazione svizzera (404 sulla pagina trovata).
- **Associazione per la disartria**: non cercata (lacuna dichiarata in §0 e §4).
- **Sito della Webby per le schede dei prodotti del gruppo C**: non applicabile (gruppo C non Webby).
- **Sintesi vocale nativa in Teams e Zoom**: non trovata. Teams ha RTT (verso opposto); Zoom dichiara nella community l'assenza di una funzione integrata.
- **Voice Translator (Zoom)**: nominato dalla community; non aperto.
- **Dato del prezzo del software Grid**: non sul sito del produttore. **Prezzo di Predictable**: non sul sito. **Prezzo di TD Snap**: non verificato (sito bloccato).
- **Data o versione di aggiornamento** del sito di Proloquo, Predictable, Voiceitt, Grid: non trovate.
- **Motivazione ufficiale Webby** per Vocable (2021, 2023): non trovata sulle schede. Per Proloquo (2013): solo il comunicato di AssistiveWare.
- **Testo della guida AISLA sulla CAA nella SLA**: non letto (PDF senza estrattore).
- **Schede di prodotto con occhio e interruttore per Predictable e Voiceitt**: non trovate sul sito (vedi §8).

## 8. Conflitti tra fonti (preservati, non risolti)

- **TD Snap, requisiti iPadOS**: App Store USA (letto): 13.0 o successivo; snippet di ricerca (non letto): iPadOS 15. Fonte ufficiale non letta.
- **Voiceitt, registrazioni richieste**: 50 (FAQ, letta); 200 (sezione Chrome, letta) e 200 nel comunicato stampa del 2024 (snippet).
- **Voiceitt, Teams**: la home mostra la scheda Teams come «COMING SOON!» e richiede un account Microsoft 365 a pagamento; la FAQ lo presenta come add-on «Voiceitt Captions» con abbonamento. Stato non chiaro.
- **Predictable, interruttore**: lo snippet di ricerca e una scheda App Store regionale parlano di interruttore Bluetooth; la pagina del prodotto letta non ne parla.
- **Predictable, editore**: Therapy Box (sito), PRC-Saltillo (copyright del sito). Lo snippet di ricerca cita una scheda App Store regionale con Prentke Romich come fornitore (non letta: il titolo della pagina App Store dice solo «Predictable»). Relazione tra le società non chiarita dalle fonti lette.
- **Predictable, sindrome di Down**: citata dallo snippet, non dalla pagina del prodotto.
- **Text-to-Mic, licenza**: «LGPL» senza versione (pagina di prodotto); LGPL v3.0 (README del repository, WebFetch).
- **Grid, piattaforme**: il sito del produttore dice Windows e iPad; il rivenditore Inclusive dice «Windows 10 and later» (nessun Mac). Non è un conflitto grave, ma i dati sono di fonti diverse.
- **AISLA, sede**: sito 2026 (Milano); documenti più vecchi citati dagli snippet (Novara e Milano). Vale il sito.
- **FLI, pagina sulla balbuzie**: lo snippet parla di una pagina dedicata; la home letta non ne ha. Non verificato.
- **Voice for Purpose e AISLA**: lo snippet di Sky TG24 dice che la campagna «My voice» di AISLA usa voiceforpurpose.com; il sito di Voice for Purpose non cita AISLA. Non risolto.
- **Proloquo, premi**: «award-winning» senza nome sul sito (letto); App Store Award 2023 (Apple, letto); honoree Webby 2013 (comunicato, letto). Tre riconoscimenti di natura diversa.


## 9. Appendice A: inventario degli URL trovati dalle ricerche (uno per riga)

Totale URL di ricerca distinti: **280** (ricerche 1-18, più l'URL `voiceitt.com/` citato nei risultati e non incluso nella prima lista). Ogni URL è stato interrogato via HTTP (curl, titolo e marcatori anti-bot) o letto via WebFetch quando citato nel rapporto.

| # | Ricerca | URL trovato | HTTP | URL finale (se diverso) | Titolo (troncato) | Esito e uso |
|---|---|---|---|---|---|---|
| 1 | Q01 Proloquo | https://apps.apple.com/us/app/id1475643220 | 200 | https://apps.apple.com/us/app/proloquo2go/id1475643220?mt=12 | ‎Proloquo2Go App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 2 | Q01 Proloquo | https://apps.apple.com/us/app/-/id308368164 | 200 | https://apps.apple.com/us/app/proloquo2go-aac/id308368164 | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 3 | Q01 Proloquo | https://mixrank.com/appstore/apps/308368164 | 200 |  | Proloquo2Go AAC / MixRank | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 4 | Q01 Proloquo | https://apps.apple.com/pt/app/proloquo2go-aac/id308368164?l=en-GB | 200 |  | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 5 | Q01 Proloquo | https://apps.apple.com/ca/app/proloquo2go-aac/id308368164 | 200 |  | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 6 | Q01 Proloquo | https://apps.apple.com/app/id1475643220 | 200 | https://apps.apple.com/us/app/proloquo2go/id1475643220?mt=12 | ‎Proloquo2Go App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 7 | Q01 Proloquo | https://apps.apple.com/app/id1521978238 | 200 | https://apps.apple.com/us/app/proloquo/id1521978238 | ‎Proloquo App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 8 | Q01 Proloquo | https://intuitionlabs.ai/software/speech-language-pathology/aac-augmentativealternative-communication/proloquo2go | 200 |  | Proloquo2Go - AAC (augmentative/alternative communication) Software / … | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 9 | Q01 Proloquo | https://apps.apple.com/sk/app/proloquo2go/id308368164 | 200 | https://apps.apple.com/sk/app/proloquo2go-aac/id308368164 | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 10 | Q01 Proloquo | https://apps.apple.com/py/app/proloquo2go-aac/id308368164?l=en-GB | 200 |  | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 11 | Q01 Proloquo | https://apple.co/3vyn24O | 200 | https://apps.apple.com/us/app/proloquo2go-aac/id308368164 | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 12 | Q01 Proloquo | https://apps.apple.com/gb/app/proloquo2go-aac/id308368164 | 200 |  | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 13 | Q01 Proloquo | https://apps.apple.com/us/app/-/id1521978238 | 200 | https://apps.apple.com/us/app/proloquo/id1521978238 | ‎Proloquo App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 14 | Q01 Proloquo | https://apps.apple.com/ca/app/id308368164?l=en-ca | 200 | https://apps.apple.com/ca/app/proloquo2go-aac/id308368164 | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 15 | Q01 Proloquo | https://apps.apple.com/nz/app/proloquo2go/id308368164 | 200 | https://apps.apple.com/nz/app/proloquo2go-aac/id308368164 | ‎Proloquo2Go AAC App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 16 | Q01 Proloquo | https://mwm.ai/apps/proloquo-coach/1488458662 | 200 |  | Proloquo Coach - Education App / MWM | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 17 | Q01 Proloquo | https://www.assistivetech.com.au/products/proloquo-app-for-ipad-1-year-license | 429 |  |  | limite di richieste (429), non letta |
| 18 | Q02 TD Snap | https://apps.apple.com/id/app/td-snap/id1072799231?l=id | 200 |  | ‎App TD Snap® - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 19 | Q02 TD Snap | https://apps.apple.com/ro/app/td-snap/id1072799231?l=ro | 200 |  | ‎Aplicația TD Snap® - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 20 | Q02 TD Snap | https://apps.apple.com/kr/app/td-snap/id1072799231 | 200 |  | ‎TD Snap® 앱 - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 21 | Q02 TD Snap | https://apps.apple.com/me/app/td-snap/id1072799231?l=hr | 200 |  | ‎Aplikacija TD Snap® - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 22 | Q02 TD Snap | https://apps.apple.com/tc/app/td-snap/id1072799231 | 200 |  | ‎TD Snap® App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 23 | Q02 TD Snap | https://apps.apple.com/us/app/td-snap/id1072799231 | 200 |  | ‎TD Snap® App - App Store | letta; usata per fatti secondari (§3) |
| 24 | Q02 TD Snap | https://apps.apple.com/ca/app/td-snap/id1072799231 | 200 |  | ‎TD Snap® App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 25 | Q02 TD Snap | https://apps.apple.com/tw/app/td-snap/id1072799231 | 200 |  | ‎《TD Snap®》App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 26 | Q02 TD Snap | https://apps.apple.com/app/id1072799231 | 200 | https://apps.apple.com/us/app/td-snap/id1072799231 | ‎TD Snap® App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 27 | Q02 TD Snap | https://apps.apple.com/pl/app/td-snap/id1072799231?l=pl | 200 |  | ‎Aplikacja TD Snap® — App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 28 | Q02 TD Snap | https://apps.apple.com/my/app/td-snap/id1072799231?l=ms | 200 |  | ‎App TD Snap® - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 29 | Q02 TD Snap | https://apps.apple.com/gr/app/td-snap/id1072799231?l=el | 200 |  | ‎Εφαρμογή TD Snap® - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 30 | Q02 TD Snap | https://apps.apple.com/ua/app/td-snap/id1072799231?l=ru | 200 |  | ‎Приложение «TD Snap®» — App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 31 | Q02 TD Snap | https://apps.apple.com/hk/app/td-snap/id1072799231 | 200 |  | ‎《TD Snap®》App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 32 | Q02 TD Snap | https://ca.tobiidynavox.com/products/td-snap | 429 |  |  | limite di richieste (429), non letta |
| 33 | Q02 TD Snap | https://apps.apple.com/gb/app/td-snap-lite/id1072799231 | 200 | https://apps.apple.com/gb/app/td-snap/id1072799231 | ‎TD Snap® App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 34 | Q02 TD Snap | https://us.tobiidynavox.com/products/td-snap | 429 |  |  | limite di richieste (429), non letta |
| 35 | Q02 TD Snap | https://apps.apple.com/us/app/td-snap/id1072799231?l=vi | 200 |  | ‎Ứng dụng TD Snap® - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 36 | Q03 Voiceitt | https://voiceitt.com/?p=5511 | 200 |  | Voiceitt - Inclusive Voice AI | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 37 | Q03 Voiceitt | https://askjan.org/vendors/Voiceitt.cfm | 200 |  | Voiceitt | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 38 | Q03 Voiceitt | https://www.alyn.org/Voiceitt-more-info | 200 |  | Alyn Hospital / Voiceitt | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 39 | Q03 Voiceitt | https://app.dealroom.co/companies/voiceitt | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 40 | Q03 Voiceitt | https://www.razmobility.com/?p=35137 | 404 |  | Page not found - RAZ Mobility >> Next Generation Assistive Technology | non trovata (404) |
| 41 | Q03 Voiceitt | https://www.razmobility.com/?p=37288 | 404 |  | Page not found - RAZ Mobility >> Next Generation Assistive Technology | non trovata (404) |
| 42 | Q03 Voiceitt | https://voicebot.ai/2021/06/08/atypical-speech-recognition-startup-voiceitt-debuts-ios-app-for-smart-home-control-and-communication/ | 200 |  | Atypical Speech Recognition Startup Voiceitt Debuts iOS App for Smart … | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 43 | Q03 Voiceitt | https://g3ict.org/headlines/voiceitt-launches-speech-recognition-app-to-enhance-communication | 200 |  | Voiceitt Launches Speech Recognition App to Enhance Communication - G3… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 44 | Q03 Voiceitt | https://prnewswire.com/news-releases/voiceitt-validates-next-generation-voice-ai-in-an-innovative-pilot-for-deaf-individuals-302185159.html | 200 | https://www.prnewswire.com/news-releases/voiceitt-validates-next-generation-voice-ai-in-an-innovative-pilot-fo… | Voiceitt validates next-generation Voice AI in an innovative pilot for… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 45 | Q03 Voiceitt | https://www.schoolhealth.com/voiceitt-voice-ai-for-education | 200 |  | Voiceitt - Voice AI for Education / School Health | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 46 | Q03 Voiceitt | https://blog.aboutamazon.co.uk/innovation/voiceitt-launches-innovative-speech-recognition-app-with-alexa-integration-to-improve-communicatio… | 000 |  |  | nessuna risposta (rete/DNS, 000) |
| 47 | Q03 Voiceitt | https://www.digitaltrends.com/?p=2598261 | 200 | https://www.digitaltrends.com/trash/voiceitt-speech-recognition-app/ | Using Alexa is tricky if you have a speech disability. Voiceitt could … | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 48 | Q03 Voiceitt | https://www.voiceitt.com/faq | 200 |  | FAQ | letta; usata (§2.4) |
| 49 | Q03 Voiceitt | https://bataonline.org/members/voiceitt | 404 | https://www.bataonline.org/members/voiceitt | British Assistive Technology Association | non trovata (404) |
| 50 | Q03 Voiceitt | https://help.voiceitt.com/what-is-voiceitt | 200 |  | What is Voiceitt? | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 51 | Q03 Voiceitt | https://www.wral.com/archive/21638524/ | 200 |  | AI-powered tech could help people with speech impairments to work remo… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 52 | Q03 Voiceitt | https://restechtoday.com/voiceitt-speech-recognition-app-built-for-people-with-speech-impairments | 404 |  | Page not found - Residential Tech Today | non trovata (404) |
| 53 | Q04 sintesi vocale/microfono | https://www.scorchsoft.com/blog/text-to-mic-for-meetings | 200 | https://www.scorchsoft.com/posts/text-to-mic-for-meetings | Text-to-Mic: Free AI Text-to-speech-to-microphone TTS & STTTS App / Sc… | letta; usata (§2.3) |
| 54 | Q04 sintesi vocale/microfono | https://chromewebstore.google.com/detail/revoize-ai-speech-enhance/mbhblmngmgaggaaligmpjfebjofdoefc | 200 | https://chromewebstore.google.com/detail/revoize-ai-speech-enhance/mbhblmngmgaggaaligmpjfebjofdoefc?ucbcb=1 | Revoize AI Speech Enhancement - Chrome Web Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 55 | Q04 sintesi vocale/microfono | https://www.producthunt.com/posts/1086073 | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 56 | Q04 sintesi vocale/microfono | https://www.transyncai.com/docs/how-to-set-up-virtual-microphone-on-windows/ | 200 |  | How to Use Virtual Microphone on Windows / Transync AI | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 57 | Q04 sintesi vocale/microfono | https://www.transyncai.com/docs/virtual-microphone/ | 200 |  | How to Use the Transync AI Virtual Microphone | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 58 | Q04 sintesi vocale/microfono | https://chromeboard.com/extension/revoize-ai-speech-enhance-mbhblmngmgaggaaligmpjfebjofdoefc | 200 |  | Revoize Ai Speech Enhance Chrome Extension — Security Analysis / Chrom… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 59 | Q04 sintesi vocale/microfono | https://dubbingai.io/articles/en/use-case/real-time-voice-changer-for-google-meet | 200 |  | Voice Changer for Google Meet / Free Google Meet Voice Changer - Dubbi… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 60 | Q04 sintesi vocale/microfono | https://help.ava.me/en/articles/8482088-configuring-your-mic-on-mac | 404 |  | Ava Help | non trovata (404) |
| 61 | Q04 sintesi vocale/microfono | https://presentationbuilder.internationaltrucks.com/text-speech-microphone | 000 |  |  | nessuna risposta (rete/DNS, 000) |
| 62 | Q04 sintesi vocale/microfono | https://murf.ai/resources/voice-changer-for-google-meet | 200 | https://murf.ai/blog/voice-changer-for-google-meet | Top 5 Best Voice Changer for Google Meet (2026 Guide) | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 63 | Q04 sintesi vocale/microfono | https://addons.mozilla.org/firefox/addon/zip-speech/ | 200 |  | Client Challenge | bloccata: verifica JavaScript/anti-bot (nessun contenuto) |
| 64 | Q04 sintesi vocale/microfono | https://presentationbuilder.internationaltrucks.com/text-speech-microphone-2 | 000 |  |  | nessuna risposta (rete/DNS, 000) |
| 65 | Q04 sintesi vocale/microfono | https://library.peoplespharmacy.com/text-speech-microphone | 410 |  |  | non trovata (410) |
| 66 | Q04 sintesi vocale/microfono | https://voxbooster.com/blog/voice-changer-google-meet-guide | 200 |  | Voice Changer for Google Meet: Setup & Fun Uses — VoxBooster | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 67 | Q05 Predictable | https://apps.apple.com/ca/app/id404445007 | 200 | https://apps.apple.com/ca/app/predictable/id404445007 | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 68 | Q05 Predictable | https://apps.apple.com/jo/app/predictable/id404445007 | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 69 | Q05 Predictable | https://apps.apple.com/dk/app/id404445007 | 200 | https://apps.apple.com/dk/app/predictable/id404445007 | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 70 | Q05 Predictable | https://apps.apple.com/mt/app/id404445007 | 200 | https://apps.apple.com/mt/app/predictable/id404445007 | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 71 | Q05 Predictable | https://apps.apple.com/be/app/id404445007 | 200 | https://apps.apple.com/be/app/predictable/id404445007 | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 72 | Q05 Predictable | https://apps.apple.com/ph/app/id404445007 | 200 | https://apps.apple.com/ph/app/predictable/id404445007 | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 73 | Q05 Predictable | https://apps.apple.com/bs/app/predictable/id404445007 | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 74 | Q05 Predictable | https://apps.apple.com/mn/app/predictable/id404445007 | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 75 | Q05 Predictable | https://apps.apple.com/qa/app/id404445007 | 200 | https://apps.apple.com/qa/app/predictable/id404445007 | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 76 | Q05 Predictable | https://apps.apple.com/sn/app/predictable/id404445007 | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 77 | Q05 Predictable | https://apps.apple.com/ie/app/predictable/id404445007 | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 78 | Q05 Predictable | https://apps.apple.com/py/app/predictable/id404445007?l=en-GB | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 79 | Q05 Predictable | https://apps.apple.com/es/app/predictable/id404445007?l=en | 200 | https://apps.apple.com/es/app/predictable/id404445007?l=en-GB | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 80 | Q05 Predictable | https://apps.apple.com/dm/app/predictable/id404445007 | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 81 | Q05 Predictable | https://apps.apple.com/am/app/predictable/id404445007 | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 82 | Q05 Predictable | https://apps.apple.com/app/id404445007 | 200 | https://apps.apple.com/us/app/predictable/id404445007 | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 83 | Q05 Predictable | https://apps.apple.com/es/app/predictable/id404445007?l=en-GB | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 84 | Q05 Predictable | https://apps.apple.com/dk/app/predictable/id404445007?l=da | 200 |  | ‎Appen Predictable - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 85 | Q05 Predictable | https://apps.apple.com/az/app/predictable/id404445007 | 200 |  | ‎Predictable App - App Store | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 86 | Q06 Teams | https://m365admin.handsontek.net/microsoft-teams-real-time-text-teams-meetings-calls/ | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 87 | Q06 Teams | https://www.webpronews.com/microsoft-teams-to-gain-real-time-text | 200 |  | Microsoft Teams to Gain Real-Time Text | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 88 | Q06 Teams | https://mc.merill.net/message/MC1059674/v/2025-04-21T23-43-24-797Z | 404 |  | Page not found / Microsoft 365 Message Center Archive | non trovata (404) |
| 89 | Q06 Teams | https://windowsreport.com/microsoft-teams-will-be-enhanced-with-real-time-texting-in-meetings-and-calls/ | 403 |  | Attention Required! / Cloudflare | bloccata: verifica anti-bot Cloudflare (403) |
| 90 | Q06 Teams | https://mc.merill.net/message/MC1059664 | 200 |  | MC1059664 - Microsoft Teams: Real-Time Text (RTT) in Teams meetings an… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 91 | Q06 Teams | https://support.microsoft.com/en-us/office/use-real-time-text-rtt-in-microsoft-teams-free-9a89543b-7b77-41f9-99f5-0fdb19c4cc76 | 200 | https://support.microsoft.com/en-us/teams/personal/meetings-calls/use-real-time-text-rtt-in-microsoft-teams-pe… | Use Real-Time Text (RTT) In Microsoft Teams for personal use / Microso… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 92 | Q06 Teams | https://support.microsoft.com/topic/9a89543b-7b77-41f9-99f5-0fdb19c4cc76 | 200 | https://support.microsoft.com/en-us/teams/personal/meetings-calls/use-real-time-text-rtt-in-microsoft-teams-pe… | Use Real-Time Text (RTT) In Microsoft Teams for personal use / Microso… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 93 | Q06 Teams | https://help.innocaption.com/en/articles/16191297-use-text-to-speech-with-innocaption-bot | 200 |  | Use Text-to-speech with InnoCaption Bot / Help Center | letta; usata (§5) |
| 94 | Q06 Teams | https://support.microsoft.com/en-US/teams/free/meetings/use-real-time-text-rtt-in-microsoft-teams-free | 200 | https://support.microsoft.com/en-us/teams/personal/meetings-calls/use-real-time-text-rtt-in-microsoft-teams-pe… | Use Real-Time Text (RTT) In Microsoft Teams for personal use / Microso… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 95 | Q06 Teams | https://support.microsoft.com/accessibility/teams/use-real-time-text-rtt-in-microsoft-teams | 200 | https://support.microsoft.com/en-us/accessibility/teams/use-real-time-text-rtt-in-microsoft-teams | Use Real-time text (RTT) in Microsoft Teams / Microsoft Support | letta; usata (§5) |
| 96 | Q06 Teams | https://mc.merill.net/message/MC1059674 | 200 |  | MC1059674 - Microsoft Teams: Real-Time Text (RTT) in Teams meetings an… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 97 | Q06 Teams | https://inkl.com/news/microsoft-teams-has-a-whole-new-way-for-you-to-talk-to-or-annoy-your-co-workers | 200 | https://www.inkl.com/news/microsoft-teams-has-a-whole-new-way-for-you-to-talk-to-or-annoy-your-co-workers | Microsoft Teams has a whole new way for you to talk to… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 98 | Q06 Teams | https://m365admin.handsontek.net/?p=13333 | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 99 | Q06 Teams | https://wisprflow.ai/integrations/teams | 200 | https://wisprflow.ai/use-cases/teams | Use Teams with Wispr Flow / Wispr Flow | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 100 | Q06 Teams | https://lumevoice.com/use-cases/microsoft-teams/ | 200 |  | Microsoft Teams Speech to Text for Chats / LumeVoice | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 101 | Q06 Teams | https://voicedash.ai/microsoft-teams-dictation/ | 200 |  | Microsoft Teams Dictation: How to Use Voice Typing - VoiceDash | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 102 | Q06 Teams | https://voicedash.ai/?p=13781 | 200 | https://voicedash.ai/microsoft-teams-dictation/ | Microsoft Teams Dictation: How to Use Voice Typing - VoiceDash | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 103 | Q07 Zoom | https://developer.rnid.org.uk/information-and-support/technology-and-products/video-conferencing-accessibility/zoom/ | 200 | https://developer.rnid.org.uk/information-and-support/technology-and-products/video-conferencing-accessibility… | RNID | accesso protetto (login) |
| 104 | Q07 Zoom | https://rnid.org.uk/information-and-support/technology-and-products/video-conferencing-accessibility/zoom/ | 200 |  | How to use accessibility features on Zoom - RNID | letta; usata (§5) |
| 105 | Q07 Zoom | https://community.zoom.com/chat-3/text-to-speech-80752 | 200 |  | Text to speech / Community | letta; usata (§5); testo estratto dall'HTML (WebFetch troncato) |
| 106 | Q07 Zoom | https://community.zoom.com/meetings-2/accessibility-for-non-speaker-37016 | 200 |  | Accessibility for Non Speaker / Community | letta; usata (§5); testo estratto dall'HTML (WebFetch troncato) |
| 107 | Q07 Zoom | https://community.zoom.com/t5/Zoom-Meetings/Accessibility-for-Non-Speaker/m-p/116666 | 200 | https://community.zoom.com/meetings-2/accessibility-for-non-speaker-37016?postid=65452#post65452 | Accessibility for Non Speaker / Community | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 108 | Q07 Zoom | https://community.zoom.com/t5/Zoom-Rooms-and-Workspaces/Is-there-a-Speech-to-Text-option-for-the-Zoom-Chat-Windows/m-p/183395 | 200 | https://community.zoom.com/rooms-workspaces-11/is-there-a-speech-to-text-option-for-the-zoom-chat-windows-5377… | Is there a Speech to Text option for the Zoom Chat Windows / Community | letta; letta (testo visibile): nessuna occorrenza di sintesi vocale |
| 109 | Q07 Zoom | https://community.zoom.com/t5/Zoom-Meetings/Accessibility-for-Non-Speaker/m-p/116274 | 200 | https://community.zoom.com/meetings-2/accessibility-for-non-speaker-37016?postid=65270#post65270 | Accessibility for Non Speaker / Community | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 110 | Q07 Zoom | https://community.zoom.com/t5/Zoom-Rooms-and-Workspaces/Is-there-a-Speech-to-Text-option-for-the-Zoom-Chat-Windows/m-p/183004 | 200 | https://community.zoom.com/rooms-workspaces-11/is-there-a-speech-to-text-option-for-the-zoom-chat-windows-5377… | Is there a Speech to Text option for the Zoom Chat Windows / Community | letta; letta (testo visibile): nessuna occorrenza di sintesi vocale |
| 111 | Q07 Zoom | https://community.zoom.com/t5/Meetings/Accessibility-for-Non-Speaker/m-p/116666 | 200 | https://community.zoom.com/meetings-2/accessibility-for-non-speaker-37016?postid=65452#post65452 | Accessibility for Non Speaker / Community | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 112 | Q07 Zoom | https://rnid.org.uk/?p=12923 | 200 | https://rnid.org.uk/information-and-support/technology-and-products/video-conferencing-accessibility/zoom/ | How to use accessibility features on Zoom - RNID | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 113 | Q07 Zoom | https://uark.teamdynamix.com/TDClient/33/Portal/KB/Article/1237/Zoom-Accessibility-Features | 200 |  | Article - Zoom Accessibility Features | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 114 | Q07 Zoom | https://speaktor.com/text-to-speech-zoom | 200 | https://speaktor.com/ | Convert Text to Speech | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 115 | Q07 Zoom | https://wiki.diglib.org/Zoom_Accessibility | 200 |  | Zoom Accessibility - DLF Wiki | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 116 | Q07 Zoom | https://www.usu.edu/accessibility/resources/zoom-accessibility | 200 |  | Zoom Accessibility / Accessibility / USU | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 117 | Q07 Zoom | https://uark.teamdynamix.com/TDClient/33/Portal/KB/PrintArticle?ID=1237 | 200 |  | Zoom Accessibility Features | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 118 | Q07 Zoom | https://top5accessibility.com/?p=8768 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 119 | Q07 Zoom | https://uit.stanford.edu/news/caption-new-zoom-tools-help-meeting-hosts-support-inclusivity | 200 |  | Caption This! New Zoom Tools Help Meeting Hosts Support Inclusivity / … | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 120 | Q07 Zoom | https://www.ucl.ac.uk/isd/services/communicate-collaborate/zoom/accessibility-and-using-captions-meeting | 200 |  | Accessibility and using captions in a meeting / Information Services D… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 121 | Q08 AISLA sito | https://www.aisla.it/wp-content/uploads/2024/06/2024_AISLA_Global-Day-1.docx | 200 |  |  | vuota o non leggibile |
| 122 | Q08 AISLA sito | https://lucignolo-new.marionegri.it/images/Convegni/Convegni_2003/11th.pdf | 200 |  | 04E01 | PDF o documento: solo metadati HTTP, testo non letto |
| 123 | Q08 AISLA sito | https://docs.google.com/document/d/1MTbVXbvW1_wllf5baS7hIvw5U2_5Aw7k/export?format=pdf | 200 | https://doc-0k-3o-docstext.googleusercontent.com/export/dr04igesal9pftlk9arelf1tq8/pgqvc6uj4uica0guko7qgd51go/… | AISLA_Profilo.docx | PDF o documento: solo metadati HTTP, testo non letto |
| 124 | Q08 AISLA sito | https://www.disabili.com/?p=125323 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 125 | Q08 AISLA sito | https://www.disabili.com/medicina/aisla-onlus-cerca-volontari-per-servizio-civile/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 126 | Q08 AISLA sito | https://www.disabili.com/societa/sp-11761/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 127 | Q08 AISLA sito | https://www.disabili.com/medicina-e-salute/aisla-onlus-cerca-volontari-per-servizio-civile/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 128 | Q08 AISLA sito | https://www.aisla.it/wp-content/uploads/2017/04/Relazione-Gestione-2013.pdf | 200 |  | \376\377\000R\000e\000l\000a\000z\000i\000o\000n\000e\000 \000G\000e\0… | PDF o documento: solo metadati HTTP, testo non letto |
| 129 | Q08 AISLA sito | https://www.disabili.com/?p=128515 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 130 | Q08 AISLA sito | https://www.aisla.it/wp-content/uploads/2017/04/RelazioneGestione2012.pdf | 200 |  | Microsoft Word - Relazione Gestione 2012.doc | PDF o documento: solo metadati HTTP, testo non letto |
| 131 | Q08 AISLA sito | https://docs.google.com/document/d/1IBgbwlnABSG87FCVn6C0QHrtNY3p6MLm/export?format=pdf | 200 | https://doc-0c-3o-docstext.googleusercontent.com/export/dr04igesal9pftlk9arelf1tq8/ag57er783ieq92fj9624gtgfts/… | AISLA_Empowerment.docx | PDF o documento: solo metadati HTTP, testo non letto |
| 132 | Q08 AISLA sito | https://www.aisla.it/wp-content/uploads/2017/04/relazione-missione.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 133 | Q08 AISLA sito | https://www.disabili.com/caregiver-e-famiglia/sla-global-day-una-squadra-un-obiettivo-battere-la-sla/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 134 | Q08 AISLA sito | https://www.aisla.it/wp-content/uploads/2017/04/Relazione-Gestione-2010.pdf | 200 |  | Microsoft Word - Relazione Gestione 2010.doc | PDF o documento: solo metadati HTTP, testo non letto |
| 135 | Q08 AISLA sito | https://www.aisla.it/wp-content/uploads/2022/07/BILANCIO-SOCIALE-2021-.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 136 | Q08 AISLA sito | https://www.quotidianosanita.it/cronache/aisla-massimo-mauro-confermato-alla-presidenza-dell-associazione/ | 200 |  | Aisla. Massimo Mauro confermato alla presidenza dell'Associazione | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 137 | Q08 AISLA sito | https://www.quotidianosanita.it/cronache/aisla-compie-anni-oltre-malati-di-sla-aiutati-nel/ | 200 |  | Aisla compie 35 anni: oltre 2.600 malati di sla aiutati nel 2017 | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 138 | Q08 AISLA sito | https://www.disabili.com/medicina-e-salute/sla-attivato-il-primo-registro-nazionale-dei-malati-italiani-ecco-come-partecipare/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 139 | Q09 AISLA CAA | https://aisla.it/wp-content/uploads/2024/12/CAA-nella-SLA_DEF_rev-dicembre-2024.pdf | 200 | https://www.aisla.it/wp-content/uploads/2024/12/CAA-nella-SLA_DEF_rev-dicembre-2024.pdf |  | PDF o documento: solo metadati HTTP, testo non letto; PDF non letto: nessun estrattore di testo (§4.1); scaricato in download-caa-01 |
| 140 | Q09 AISLA CAA | https://www.avvenire.it/vita-e-cura/ce-una-nuova-voce-per-i-malati-di-sla-la-loro_64224 | 200 |  | C'è una nuova voce per i malati di Sla: la loro | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 141 | Q09 AISLA CAA | https://www.quotidianosanita.it/cronache/voice-for-purpose-nasce-la-banca-dati-delle-voci-per-i-malati-di-sla-schillaci-massimo-impegno-nell… | 200 |  | “Voice for Purpose”, nasce la banca dati delle voci per i malati di SL… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 142 | Q09 AISLA CAA | https://www.disabili.com/caregiver-e-famiglia/sla-un-nuovo-servizio-di-supporto-a-malati-e-famiglie/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 143 | Q09 AISLA CAA | https://www.disabili.com/?p=145508 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 144 | Q09 AISLA CAA | https://www.welforum.it/wp-content/uploads/2018/03/Progetto_SLA_supporto-online_pieghevole.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 145 | Q09 AISLA CAA | https://tg24.sky.it/salute-e-benessere/2022/12/05/sla-campagna-my-voice-donare-voce | 200 |  | Sla, al via la campagna 'My voice' Aisla: per donare la propria voce a… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 146 | Q09 AISLA CAA | https://uploads-ssl.webflow.com/5ec3a48fc21932e37d789c1d/5f9c3d3d518a318357e0e159_f1114739712_compressed%20(1).pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 147 | Q09 AISLA CAA | https://www.disabili.com/?p=145753 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 148 | Q09 AISLA CAA | https://portale.siva.it/files/doc/library/A09_Restano_Laura.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 149 | Q10/Q14/Q16 afasia, AITA | https://www.comune.sassari.it/.galleries/doc-notizie/aita_relazione_associazione_2025.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 150 | Q10/Q14/Q16 afasia, AITA | https://tesi.univpm.it/retrieve/88dd2c4a-bc2f-4c2e-bad7-3f7789618067/PASQUINELLI%20ELEONORA_VALUTAZIONE%20DELLA%20PARTECIPAZIONE%20SOCIALE%2… | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 151 | Q10/Q14/Q16 afasia, AITA | https://aphasiatrials.org/wp-content/uploads/2022/10/Aphasia-United-BPR-Italian.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 152 | Q10/Q14/Q16 afasia, AITA | https://gestione.fondazionetorinomusei.it/media/2023/05/laferla_2-1.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 153 | Q10/Q14/Q16 afasia, AITA | https://www.palazzomadamatorino.it/media/2023/05/laferla_2-1.pdf | 200 | https://gestione.fondazionetorinomusei.it/media/2023/05/laferla_2-1.pdf |  | PDF o documento: solo metadati HTTP, testo non letto |
| 154 | Q10/Q14/Q16 afasia, AITA | https://mymedica.it/wp-content/uploads/2024/01/Nasuti_afasia_FADmag2024.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 155 | Q10/Q14/Q16 afasia, AITA | https://www.libreriauniverso.it/pdf/9788859044215.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 156 | Q10/Q14/Q16 afasia, AITA | https://www.my-personaltrainer.it/benessere/afasia-riassunto.html | 200 |  | Afasia in breve: Riassunto sull'afasia | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 157 | Q10/Q14/Q16 afasia, AITA | https://sites.google.com/site/aitaumbriaonlus/rubrica/life-participation-approach-to-aphasia | 200 |  | A.IT.A. Umbria OdV - Life Participation Approach to Aphasia | letta; usata (§4.3) |
| 158 | Q10/Q14/Q16 afasia, AITA | https://tesi.univpm.it/retrieve/9157305d-6d4d-4ce0-86e6-836c693e4915/Tesi%20no%20frontespizio.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 159 | Q10/Q14/Q16 afasia, AITA | https://www.quotidianosanita.it/?p=8534 | 200 | https://www.quotidianosanita.it/cronache/afasia-post-ictus-ne-soffrono-mila-italiani-al-via-ricerca-per-esplor… | Afasia post-ictus. Ne soffrono 200mila italiani. Al via ricerca per es… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 160 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/?p=124419 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 161 | Q10/Q14/Q16 afasia, AITA | https://dilei.it/salute/problemi-linguaggio-afasia-caregiver/1368096/amp/ | 200 |  | Problemi di linguaggio e afasia, quanto conta il caregiver – DiLei | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 162 | Q10/Q14/Q16 afasia, AITA | https://webthesis.biblio.polito.it/23953/1/tesi.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 163 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/?p=132416 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 164 | Q10/Q14/Q16 afasia, AITA | https://thesis.unipd.it/bitstream/20.500.12608/29137/1/CESCHIN_NATASHA_LOGOPEDIA.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 165 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/?p=134812 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 166 | Q10/Q14/Q16 afasia, AITA | https://www.miodottore.it/domande-risposte/buongiorno-mia-madre-ha-avuto-un-ictus-5-anni-fa-e-ad-oggi-ancora-ha-molte-difficolta-a-parlare-l… | 200 |  | Buongiorno, mia madre ha avuto un ictus 5 anni fa e ad oggi ancora ha … | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 167 | Q10/Q14/Q16 afasia, AITA | https://core.ac.uk/download/228585701.pdf | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 168 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/ultimora/disabilita-e-linguaggio-oggi-la-giornata-nazionale-dellafasia/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 169 | Q10/Q14/Q16 afasia, AITA | https://www.provincia.perugia.it/node/47475 | 200 |  | Sociale – AITA Umbria accende una luce sull'Afasia / Provincia di Peru… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 170 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/?p=141650 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 171 | Q10/Q14/Q16 afasia, AITA | https://docente.unife.it/enrico.granieri/materiale-didattico/scienze-motorie/programma/AFASIA.pdf/ | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 172 | Q10/Q14/Q16 afasia, AITA | https://docente.unife.it/enrico.granieri/materiale-didattico/lezioni-educatore-professionale-sanitario/neurologia-1b0-anno/AFASIE.pdf/ | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 173 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/caregiver-e-famiglia/afasia-quando-le-parole-ci-lasciano/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 174 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/caregiver/afasia-quando-le-parole-ci-lasciano/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 175 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/caregiver/sp-14644/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 176 | Q10/Q14/Q16 afasia, AITA | https://boa.unimib.it/retrieve/e39773b7-5050-35a3-e053-3a05fe0aac26/GdP%202009.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 177 | Q10/Q14/Q16 afasia, AITA | https://link.springer.com/doi/10.1007/s10072-019-03844-0 | 200 |  | Client Challenge | bloccata: verifica JavaScript/anti-bot (nessun contenuto) |
| 178 | Q10/Q14/Q16 afasia, AITA | https://www.academia.edu/28197971/AFASIA | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 179 | Q10/Q14/Q16 afasia, AITA | https://www.disabili.com/societa/isabileit-la-prima-web-tv-realizzata-per-e-con-gli-afasici/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 180 | Q11 AILO | https://www.regione.piemonte.it/web/media/12972/download | 200 |  | \376\377\000D\000S\000A\000.\000C\000o\000m\000p\000e\000t\000e\000n\0… | PDF o documento: solo metadati HTTP, testo non letto |
| 181 | Q11 AILO | https://www.orizzontescuola.it/disturbi-del-linguaggio-in-eta-prescolare-per-7-bambini-italiani-su-100/ | 200 |  | Disturbi del linguaggio, in età prescolare per 7 bambini italiani su 1… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 182 | Q11 AILO | https://www.fpct.ch/documenti/FPC99_Alosi.pdf | 404 | https://fpct.ch/documenti/FPC99_Alosi.pdf | 404 Non trovato / Fondazione Pellegrini Canevascini | non trovata (404) |
| 183 | Q11 AILO | https://www.disabili.com/?p=152003 | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 184 | Q11 AILO | https://www.italpress.com/?p=509531 | 200 | https://www.italpress.com/milano-commissione-dalbo-logopedisti-in-prima-linea-per-giornata-europea/ | Milano, Commissione Logopedisti per 'comunicare senza barriere' | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 185 | Q11 AILO | https://www.quotidianosanita.it/?p=141298 | 200 | https://www.quotidianosanita.it/lavoro-e-professioni/giornata-europea-della-logopedia-commissione-d-albo-logop… | Giornata Europea della Logopedia. Commissione d’Albo Logopedisti di Mi… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 186 | Q11 AILO | https://tsrm-pstrp.org/wp-content/uploads/2023/11/programma-preliminare-Congresso-Logopedisti.pdf | 200 | https://www.tsrm-pstrp.org/wp-content/uploads/2023/11/programma-preliminare-Congresso-Logopedisti.pdf |  | PDF o documento: solo metadati HTTP, testo non letto |
| 187 | Q11 AILO | https://tsrm-pstrp.org/index.php/category/logopedisti | 200 | https://www.tsrm-pstrp.org/index.php/category/logopedisti/ | logopedisti Archivi - FNO TSRM e PSTRP | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 188 | Q11 AILO | https://tsrm-pstrp.org/index.php/giornata-europea-logopedia-2023 | 200 | https://www.tsrm-pstrp.org/index.php/giornata-europea-logopedia-2023/ | 6 marzo 2023 - Giornata europea della Logopedia “Il ruolo del Logopedi… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 189 | Q11 AILO | https://www.disabili.com/caregiver/logopedia-un-milione-di-caregiver-in-italia-assiste-chi-ha-disturbi-del-linguaggio/ | 403 |  | 403 - Forbidden | bloccata: accesso negato (403) |
| 190 | Q11 AILO | https://documenti.camera.it/leg19/documentiAcquisiti/COM12/Audizioni/leg19.com12.Audizioni.Memoria.PUBBLICO.ideGes.51507.26-11-2024-10-45-28… | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 191 | Q11 AILO | https://www.hogrefe.com/it/magazine/giornate-clasta-xv-edizione | 200 |  | Giornate CLASTA XV Edizione / Hogrefe | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 192 | Q11 AILO | https://www.quotidianosanita.it/?p=80012 | 200 | https://www.quotidianosanita.it/scienza-e-farmaci/giornata-europea-logopedia-il-tema-di-quest-anno-sar-l-autis… | Giornata Europea Logopedia. Il tema di quest’anno sarà l’autismo. Fli:… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 193 | Q11 AILO | https://www.quotidianosanita.it/lavoro-e-professioni/al-via-il-primo-congresso-della-commissione-di-albo-nazionale-dei-logopedisti/ | 200 |  | Al via il primo congresso della Commissione di albo nazionale dei Logo… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 194 | Q11 AILO | https://corep.it/images/curricula/CV2024/POLI%20LISA.pdf | 200 |  | Informazioni personali | PDF o documento: solo metadati HTTP, testo non letto |
| 195 | Q11 AILO | https://new.logosacademy.it/wp-content/uploads/2020/01/RSO_LogosAcademy_Piscitelli_Oralita_Programma_2026.pdf | 404 |  | Pagina non trovata - LOGOS ACADEMY - La Migliore Formazione ECM per Lo… | non trovata (404) |
| 196 | Q12 laringectomia | https://csvlombardia.it/wp-content/uploads/2023/04/Corso-di-riabilitazione-Ailar-Odv_30-Mag6-13-20-Giu-2023-1-4.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 197 | Q12 laringectomia | https://www.ieo.it/Documents/Materiale%20infoeducativo/BK_cgf_2017_123_CED.DO.1132_Laringectomia%20-%20Una%20Guida%20per%20i%20pazienti.PDF | 200 | https://www.ieo.it:443/globalassets/Materiale-infoeducativo/BK_cgf_2017_123_CED.DO.1132_Laringectomia---Una-Gu… |  | PDF o documento: solo metadati HTTP, testo non letto |
| 198 | Q12 laringectomia | https://thesis.unipd.it/handle/20.500.12608/93044 | 200 |  | La predizione di successo della protesi fonatoria nella laringectomia … | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 199 | Q12 laringectomia | https://www.actaitalica.it/article/download/320/251 | 404 |  |  | non trovata (404) |
| 200 | Q12 laringectomia | https://thesis.unipd.it/retrieve/1b318c6e-3ec0-4133-97d6-77e55d80016b/Comiato_Miriana.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 201 | Q12 laringectomia | https://www.em-consulte.com/it/article/925487/monitoraggio-e-reinserimento-del-paziente-laringec | 200 |  | Monitoraggio e reinserimento del paziente laringectomizzato - EM consu… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 202 | Q12 laringectomia | https://www.quotidianosanita.it/?p=54947 | 200 | https://www.quotidianosanita.it/regioni-e-asl/protesi-fonatorie-l-asl-to-all-avanguardia-nelle-tecniche-di-rec… | Protesi fonatorie. L’Asl TO5 all’avanguardia nelle tecniche di recuper… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 203 | Q12 laringectomia | https://www.varesenews.it/2011/04/qualita-e-vita-dei-pazienti-laringectomizzati/120461/?output=pdf | 200 |  | þÿ V a r e s e N e w s | PDF o documento: solo metadati HTTP, testo non letto |
| 204 | Q12 laringectomia | https://www.apollohospitals.com/it/procedures/laryngectomy | 403 |  | 403 Forbidden | bloccata: accesso negato (403) |
| 205 | Q12 laringectomia | https://old.jpsychopathol.it/issues/2008/vol14-2/Pirone.pdf | 200 |  | untitled | PDF o documento: solo metadati HTTP, testo non letto |
| 206 | Q12 laringectomia | https://starbene.it/medicina-a-z/laringectomia | 200 | https://www.starbene.it/medicina-a-z/laringectomia/ | Laringectomia - Starbene | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 207 | Q12 laringectomia | https://www.lilt.it/sites/default/files/guide/2018-01/opuscolo_laringectomizzato.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 208 | Q12 laringectomia | https://www.idoctors.it/patologia-tumore-della-laringe-27480 | 200 |  | Tumore della laringe: sintomi, cura e guarigione | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 209 | Q12 laringectomia | https://www.iris.unict.it/retrieve/dfe4d226-fabd-bb0a-e053-d805fe0a78d9/Experience%20with%20the%20heat%20and%20moisture%20exchange%20system%… | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 210 | Q12 laringectomia | https://thesis.unipd.it/retrieve/a262cb06-5b7d-422d-9674-79cb1745c9c6/dussin.sara.1044939.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 211 | Q15 AILAR | https://www.favo.it/comunicazioni.html?start=480 | 200 |  | Notizie e comunicazioni - F.A.V.O. - Federazione delle Associazioni di… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 212 | Q15 AILAR | https://dilei.it/salute/tumori-quando-preoccuparsi-delle-alterazioni-della-voce-e-come-comportarsi/1197094/amp/ | 200 |  | Tumori, quando i cambiamenti della voce sono un segnale preoccupante –… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 213 | Q15 AILAR | https://www.ieo.it/Documents/Materiale%20infoeducativo/BK_cgf_2017_81_NCS.DO.3523_Laringectomia%20totale.PDF | 200 | https://www.ieo.it:443/globalassets/Materiale-infoeducativo/BK_cgf_2017_81_NCS.DO.3523_Laringectomia-totale.PD… |  | PDF o documento: solo metadati HTTP, testo non letto |
| 214 | Q15 AILAR | https://www.ieo.it/Documents/Materiale%20infoeducativo/BK_cgf_2017_80_NCS.DO.3522_Laringectomia%20ricostruttiva%20sovraglottica%20o%20sovrac… | 200 | https://www.ieo.it:443/globalassets/Materiale-infoeducativo/BK_cgf_2017_80_NCS.DO.3522_Laringectomia-ricostrut… |  | PDF o documento: solo metadati HTTP, testo non letto |
| 215 | Q15 AILAR | https://webarchive.library.unt.edu/eot2008/20090113182548/http://healthhotlines.nlm.nih.gov/cgi-bin/hotlines/FindOrg?Record=239 | 200 |  |  | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 216 | Q15 AILAR | https://www.ieo.it/Documents/formazione/Programma_impaginatoATOS.pdf | 200 | https://www.ieo.it:443/globalassets/formazione/Programma_impaginatoATOS.pdf | Informazioni generali | PDF o documento: solo metadati HTTP, testo non letto |
| 217 | Q15 AILAR | https://elevenlabs.io/it/blog/cancer-steals-voices-elevenlabs-gives-them-back | 200 |  | Il cancro ruba le voci. ElevenLabs Impact le restituisce. | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 218 | Q15 AILAR | https://www.em-consulte.com/it/article/1386096/laringectomie-totali | 200 |  | Laringectomie totali - EM consulte | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 219 | Q15 AILAR | https://www.ausl.bologna.it/part/che-male-ce/elenco-completo-delle-schede-di-presentazione/amici-di-luca/files/Scheda-UIMV-aggiornata.pdf | 200 |  | \376\377\000S\000C\000H\000E\000D\000A\000 \000p\000r\000e\000s\000e\0… | PDF o documento: solo metadati HTTP, testo non letto |
| 220 | Q13 balbuzie | https://www.vatican.va/content/john-paul-ii/it/speeches/1988/december/documents/hf_jp-ii_spe_19881210_la-lingua-amara.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 221 | Q13 balbuzie | https://www.quotidianosanita.it/?p=8533 | 200 | https://www.quotidianosanita.it/lavoro-e-professioni/in-italia-un-milione-di-balbuzienti-e-su-un-bambino-essen… | In Italia un milione di balbuzienti. E 1 su 4 è un bambino. Essenziale… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 222 | Q13 balbuzie | https://www.italpress.com/?p=594298 | 200 | https://www.italpress.com/convergenza-bipartisan-sulla-balbuzie-il-lazio-apripista-per-una-legge-ad-hoc-2/ | Convergenza bipartisan sulla balbuzie, il Lazio apripista per una legg… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 223 | Q13 balbuzie | https://www.ilgiorno.it/milano/cronaca/la-balbuzie-non-fa-ridere-centro-medico-e-sportello-per-aiutare-chi-e-in-difficolta-e93affb4 | 200 |  | "La balbuzie non fa ridere" Centro medico e sportello per aiutare chi … | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 224 | Q13 balbuzie | https://www.quotidianosanita.it/?p=8301 | 200 | https://www.quotidianosanita.it/cronache/balbuzie-filo-diretto-con-i-logopedisti-fino-al-marzo/ | Balbuzie. Filo diretto con i logopedisti fino al 9 marzo | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 225 | Q13 balbuzie | https://superando.it/files/2023/06/vivavoce-sportello-maturita-2023.pdf | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 226 | Q13 balbuzie | https://www.avvenire.it/attualita/diritti-delle-persone-con-balbuzie-accordo-storico-tra-anci-e-lea-ecco-cosa-cambia_114685 | 200 |  | Diritti delle persone con balbuzie, accordo storico tra Anci e Lea: ec… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 227 | Q13 balbuzie | https://acp.it/assets/media/download/Quaderni_acp_2022_294_160-161.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 228 | Q13 balbuzie | https://iris.cnr.it/handle/20.500.14243/138117 | 200 |  | Behavior Assessment Battery© (BAB): un approccio evidence-based alla v… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 229 | Q13 balbuzie | https://www.quotidianosanita.it/lavoro-e-professioni/in-italia-un-milione-di-balbuzienti-e-su-un-bambino-essenziale-intervenire-da-piccoli/ | 200 |  | In Italia un milione di balbuzienti. E 1 su 4 è un bambino. Essenziale… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 230 | Q13 balbuzie | https://tvqdirfredgjqqkxrmju.supabase.co/storage/v1/object/public/event-pdfs/478092_1.pdf | 400 |  |  | codice 400 |
| 231 | Q13 balbuzie | https://www.topdoctors.it/balbuzie/dkv/ | 200 | https://www.topdoctors.it/balbuzie/ | Specialisti in Balbuzie . Prenota una visita / Top Doctors | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 232 | Q13 balbuzie | https://www.nostrofiglio.it/bambino/psicologia/la-balbuzie-colpisce-1-milione-di-italiani-da-bambini-si-recupera | 200 |  | Balbuzie: cosa fare se il bambino balbetta - Nostrofiglio.it | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 233 | Q13 balbuzie | https://www.superando.it/files/2023/04/vivavoce-giornata-16-aprile-2023.pdf | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 234 | Q13 balbuzie | https://www.orizzontescuola.it/bullismo-sei-episodi-su-cento-riguarda-la-balbuzie-un-video-per-aiutare-famiglie-e-studenti/ | 200 |  | Bullismo, sei episodi su cento riguardano la balbuzie. Un video per ai… | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 235 | Q13 balbuzie | https://plesk3.logosacademy.it/?p=782743 | 000 |  |  | nessuna risposta (rete/DNS, 000) |
| 236 | Q13 balbuzie | https://techprincess.it/osservatorio-voice-shaming/amp/ | 200 |  | Voice shaming: il 99% di chi soffre di balbuzie è stato discriminato | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 237 | Q17 Webby AAC | https://winners.webbyawards.com/2023/apps-dapps-and-software/app-features/best-use-of-voice-technology/250170/vocable-aac | 200 |  | NEW Webby Gallery + Index | letta; usata (§6) |
| 238 | Q17 Webby AAC | https://www.assistiveware.com/press-releases/proloquo2go-selected-as-official-honoree-in-the-17th-annual-webby-awards | 200 |  | Proloquo2Go Selected as Official Honoree in the 17th Annual Webby Awar… | letta; usata (§6) |
| 239 | Q17 Webby AAC | https://winners.webbyawards.com/2021/apps-software/app-features/best-practices/168530/vocable-aac | 200 |  | NEW Webby Gallery + Index | letta; pagina Webby (titolo generico); la categoria Best Practices 2021 è riportata dalla scheda experimental-innovation (§6) |
| 240 | Q17 Webby AAC | https://winners.webbyawards.com/2021/apps-and-software/mobile-ott-app-features/experimental-innovation/168530/vocable-aac | 200 |  | NEW Webby Gallery + Index | letta; usata (§6) |
| 241 | Q17 Webby AAC | https://willowtreeapps.com/insights/willowtree-transforms-vocable-aac-mobile-app-with-conversational-ai-integration-giving-voice-to-millions | 403 | https://www.telusdigital.com/insights/digital-experience/resource/vocable | Attention Required! / Cloudflare | bloccata: verifica anti-bot Cloudflare (403) |
| 242 | Q17 Webby AAC | https://winners.webbyawards.com/2024/apps-software/software-services-platforms/work-productivity-collaboration/289426/adobe-express-the-aifi… | 200 |  | NEW Webby Gallery + Index | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 243 | Q17 Webby AAC | https://winners.webbyawards.com/2024/apps-software/software-services-platforms/productivity-collaboration/289426/adobe-express-the-aifirst-a… | 200 |  | NEW Webby Gallery + Index | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 244 | Q17 Webby AAC | https://www.webbyawards.com/press/speeches | 200 |  | Speeches / The Webby Awards | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 245 | Q17 Webby AAC | https://www.webbyawards.com/press/press-releases/28th-annual-webby-award-winners-announced | 200 |  | 28th Annual Webby Award Winners Announced / The Webby Awards | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 246 | Q17 Webby AAC | https://winners.webbyawards.com/2023/apps-and-software/software-services-platforms/productivity-collaboration/256130/switchboard | 200 |  | NEW Webby Gallery + Index | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 247 | Q17 Webby AAC | https://apps.apple.com/be/story/id1705093873 | 200 |  | ‎Cultural Impact winner: Proloquo - App Store | letta; usata (§6) |
| 248 | Q17 Webby AAC | https://www.communicationmatters.org.uk/?p=1468 | 200 | https://www.communicationmatters.org.uk/news/aac-awards-2023/ | AAC Awards 2023 – Communication Matters | letta; usata (§6) |
| 249 | Q17 Webby AAC | https://www.webbyawards.com/winner-resources/ | 200 |  | Winner Resources / The Webby Awards | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 250 | Q17 Webby AAC | https://webbyawards.com | 200 | https://www.webbyawards.com/ | The Webby Awards | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 251 | Q17 Webby AAC | https://winners.webbyawards.com/winners/apps-software-immersive | 200 |  | NEW Webby Gallery + Index | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 252 | Q17 Webby AAC | https://winners.webbyawards.com/2025/websites-and-mobile-sites/responsible-technology/responsible-ai/328872/project-euphonia | 200 |  | NEW Webby Gallery + Index | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 253 | Q17 Webby AAC | https://www.webbyawards.com/press/press-releases/30th-annual-webby-awards-announce-2026-winners/ | 200 |  | 30TH ANNUAL WEBBY AWARDS ANNOUNCE 2026 WINNERS / The Webby Awards | letta; usata (§6) |
| 254 | Q17 Webby AAC | https://modev.com/blog/voice-talks-wins-a-webby | 200 | https://www.modev.com/blog/voice-talks-wins-a-webby | VOICE Talks Wins a Webby! | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 255 | Q17 Webby AAC | https://eastmojo.com/premium/2026/05/11/how-a-mizo-led-ai-app-is-helping-nonverbal-children/ | 200 |  | How a Mizo-led AI app is helping nonverbal children | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 256 | Q17 Webby AAC | https://appshunter.io/blog/str-1675956900 | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 257 | Q18 Grid 3 | https://www.inclusive.com/grid-3-from-smartbox.html | 429 | https://www.inclusive.com/products/grid-3-from-smartbox |  | limite di richieste (429), non letta |
| 258 | Q18 Grid 3 | https://livingmadeeasy.org.uk/category/at-home/home-fixtures/environmental-controllers/product/grid-3-software | 200 |  | Living Made Easy - Grid 3 Software) | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 259 | Q18 Grid 3 | https://support.inclusive.com/article/grid3 | 200 |  | Inclusive Support Hub / Grid 3 | letta; usata (§2.2), rivenditore |
| 260 | Q18 Grid 3 | https://assistive.co.nz/product/grid-3/ | 200 |  | Grid 3 - Assistive Technology | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 261 | Q18 Grid 3 | https://www.setbc.org/resources/grid-3/ | 200 |  | Grid 3 | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 262 | Q18 Grid 3 | https://hmi-basen.dk/blobs/brugsvejl/68463.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 263 | Q18 Grid 3 | https://askjan.org/vendors/Smartbox-Assistive-Technology-Inc.cfm | 200 |  | Smartbox Assistive Technology Inc | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 264 | Q18 Grid 3 | https://www.setbc.org/?p=39774 | 200 | https://www.setbc.org/resources/grid-3/ | Grid 3 | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 265 | Q18 Grid 3 | https://askjan.org/products/Grid-3.cfm | 200 |  | Grid 3 | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 266 | Q18 Grid 3 | https://www.closingthegap.com/?p=15804 | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 267 | Q18 Grid 3 | https://cdn.shopify.com/s/files/1/0103/4669/2666/files/Smartbox-Brochure-2020.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 268 | Q18 Grid 3 | https://storage.mtender.gov.md/get/0a717353-4def-49a5-9003-c3ca407cf2b6-1733470559232 | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 269 | Q18 Grid 3 | https://cap.mil/products/266 | 404 |  | Computer/Electronic Accommodations Program 404 Error | non trovata (404) |
| 270 | Q18 Grid 3 | https://setbccdnstorage.blob.core.windows.net/data/Grid_3/Grid3_EyeGazeSet-up_Tutorial%20_2024.pdf | 200 |  |  | PDF o documento: solo metadati HTTP, testo non letto |
| 271 | Q18 Grid 3 | https://fcc.report/FCC-ID/2APXM-GP12V1/3908785.pdf | 403 |  | Just a moment... | bloccata: verifica anti-bot Cloudflare (403) |
| 272 | Q18 Grid 3 | https://www.numotion.com/products-services/speech-solutions/speech-software | 200 | https://www.numotion.com/product-categories/speech-software | AAC Speech Software Solutions / Numotion | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 273 | Q18 Grid 3 | https://www.caretech-uk.com/our-services/technology/smartbox | 200 | https://www.caretech-uk.com/what-we-do/technology-services/smartbox/ | Smartbox | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 274 | Q18 Grid 3 | https://dev.livingmadeeasy.org.uk/product/grid-3-software | 200 |  | Living Made Easy - Grid 3 Software) | aperta: titolo letto, nessun dato di prodotto per il gruppo C |
| 275 | Q18 Grid 3 | https://manuals.online/smartbox/touchscreen/grid-pad/user-manual/1sav6 | 404 | https://manuals.online/ | 404 Not Found | non trovata (404) |
| 276 | Grid 3 (siti aggiunti) | https://thinksmartbox.com/ | 200 | https://smartboxaac.com/ukie/ | Smartbox Home - Explore Grid AAC | aperta: titolo letto, nessun dato di prodotto per il gruppo C; redirect a smartboxaac.com/ukie/ (usata §2.2) |
| 277 | Grid 3 (siti aggiunti) | https://hub.thinksmartbox.com/ | 200 | https://hub.smartboxaac.com/ | Home - Smartbox Hub | aperta: titolo letto, nessun dato di prodotto per il gruppo C; redirect a hub.smartboxaac.com (documentazione, §2.2) |
| 278 | Grid 3 (siti aggiunti) | https://smartboxaac.com/ukie/grid-software/ | 200 |  | Grid - Smartbox UKIE | letta; usata (§2.2) |
| 279 | Grid 3 (siti aggiunti) | https://smartboxaac.com/ukie/ | 200 |  | Smartbox Home - Explore Grid AAC | letta; usata (§2.2) |
| 280 | Q03 Voiceitt | https://voiceitt.com/ | 200 |  | Voiceitt - Inclusive Voice AI | aperta: titolo letto, nessun dato di prodotto per il gruppo C |

**Riepilogo esiti (appendice A):** aperta: 151; PDF o documento: 47; bloccata: 38; letta: 21; non trovata: 12; limite di richieste: 4; nessuna risposta: 4; accesso protetto: 1; vuota o non leggibile: 1; codice 400: 1.


## 10. Appendice B: pagine aperte direttamente (fuori dai risultati di ricerca) e pagine citate senza apertura

| # | URL | Esito HTTP / strumento | Lettura | Uso nel rapporto |
|---|---|---|---|---|
| B01 | https://www.assistiveware.com/products/proloquo2go | 200 (curl; reindirizzamento da /proloquo2go) | letta via WebFetch | usata (§2.1) |
| B02 | https://www.assistiveware.com/products/proloquo | non testata via curl | letta via WebFetch | usata (§2.1) |
| B03 | https://www.assistiveware.com/ | 200 (curl) | titolo «AssistiveWare - What will you say?»; non letta | solo titolo |
| B04 | https://voiceitt.com/ | 200 (curl) | letta via WebFetch | usata (§2.4) |
| B05 | https://www.scorchsoft.com/posts/text-to-mic-for-meetings | 200 (curl, dopo redirect) | letta via WebFetch | usata (§2.3) |
| B06 | https://github.com/andrew-scorchsoft/text-to-mic | non testata via curl | letta via WebFetch | usata (§2.3) |
| B07 | https://therapy-box.co.uk/predictable | 302 verso https://therapybox.co.uk/ (riportato da WebFetch) | redirect seguito, non letta come scheda | redirect |
| B08 | https://therapybox.co.uk/ | 200 (www.therapybox.co.uk) | letta via WebFetch | usata (§2.5) |
| B09 | https://www.therapybox.co.uk/predictable-english | non testata via curl | letta via WebFetch | usata (§2.5) |
| B10 | https://www.tobiidynavox.com/products/td-snap | 429 (curl x2 e WebFetch x2: Retry-After 60) | non letta | bloccata (§3) |
| B11 | https://us.tobiidynavox.com/products/td-snap | 429 (curl e WebFetch) | non letta | bloccata (§3) |
| B12 | https://ca.tobiidynavox.com/products/td-snap | 429 (curl) | non letta | bloccata (§3) |
| B13 | https://apps.apple.com/us/app/td-snap/id1072799231 | 200 (curl), testo visibile estratto da HTML | letta (fatti secondari) | usata (§3) |
| B14 | https://www.aisla.it/ | 200 (curl) | letta via WebFetch | usata (§4.1) |
| B15 | https://www.aisla.it/lespressione-dei-propri-diritti-attraverso-la-comunicazione-non-verbale/ | non testata via curl | letta via WebFetch | usata (§4.1) |
| B16 | https://www.ailar.it/ | 200 (curl) | letta via WebFetch | usata (§4.2) |
| B17 | https://www.ailar.it/come-si-torna-a-parlare/tornare-a-parlare.html | non testata via curl | letta via WebFetch | usata (§4.2) |
| B18 | https://www.fli.it/ | 200 (curl) | letta via WebFetch | usata (§4.5) |
| B19 | https://associazionevivavoce.it/ | 200 (curl) | letta via WebFetch | usata (§4.4) |
| B20 | https://voiceforpurpose.com/ | 200 (curl) | letta via WebFetch | usata (§4, fuori lista) |
| B21 | https://www.aita.it/ | 200 (curl) | letta via WebFetch: agenzia immobiliare | usata (§4.3, §7) |
| B22 | https://sites.google.com/site/aitasardegnaonlus/ | 200 dopo redirect a accounts.google.com (login) | non letta: accesso negato | login (§4.3) |
| B23 | https://laringect.it/ (citato da una guida IEO 2017) | 000 (nessuna risposta) | non letta | lacuna (§4.2) |
| B24 | https://trattoblu.com/ | 200 (curl) | letta via WebFetch: società di corsi ORL, non AILAR | usata (§4.2, nota) |
| B25 | https://www.vocable.app/ (indicato dalla scheda Webby 2021) | non aperto | non letto | citato, non verificato (§6) |
| B26 | https://apps.apple.com/us/app/vocable-aac/id1497040547 (indicato dalla scheda Webby 2023) | non aperto | non letto | citato, non verificato (§6) |
| B27 | https://www.fli.it/chi-siamo/contatti/ e https://www.fli.it/2024/10/18/parliamo-di-disturbo-primario-del-linguaggio-opuscolo-fli-clasta/ (link dalla h… | non aperti | non letti | citati, non verificati (§4.5) |
| B28 | https://www.aisla.it/il-centro-di-ascolto e altre sezioni AISLA (link dalla home) | non aperti | non letti | citati (§4.1) |
| B29 | https://smartboxaac.com/ukie/grid-software/ (in appendice A) | 200 (curl) | letta via WebFetch | usata (§2.2) |

**Nota sulle schede pubbliche Webby citate in §6:** la scheda Webby 2021 «Best Practices» e la categoria «Experimental & Innovation» sono nella stessa pagina del vincitore; non sono state aperte come pagine separate.

## 11. Cartelle create e file di lavoro (nessun file cancellato)

- `design/incarichi/ricerca-c/progresso.md` — avanzamento dell'incarico (aggiornato a fine lavoro).
- `design/incarichi/ricerca-c/script-http/` — `fetch.sh` (richieste HTTP, un URL alla volta, senza salvare il corpo), `parse.py` (titolo, descrizione, marcatori anti-bot), `visibile.py` (testo visibile da HTML), `inventario.py` (generazione delle appendici). Mai eseguiti su contenuti scaricati come codice.
- `design/incarichi/ricerca-c/run-http-01/` — prima esecuzione con un parser difettoso (errore di tipo su marcatori): righe vuote, superata. Non usare.
- `design/incarichi/ricerca-c/run-http-01b/` — esecuzione valida per le ricerche Proloquo, TD Snap, Voiceitt e sintesi vocale (66 URL).
- `design/incarichi/ricerca-c/run-http-02/` — Predictable, Teams, Zoom, AISLA sito (72 URL).
- `design/incarichi/ricerca-c/run-http-03a/` — AISLA CAA e afasia/AITA (41 URL).
- `design/incarichi/ricerca-c/run-http-03b/` — AILO, laringectomia, AILAR (40 URL).
- `design/incarichi/ricerca-c/run-http-04a/` — balbuzie e Webby AAC (37 URL).
- `design/incarichi/ricerca-c/run-http-05/` — Grid 3 e siti del produttore (23 URL).
- `design/incarichi/ricerca-c/run-http-03/`, `run-http-04/`, `run-http-04b/` — cartelle vuote create per errore, non usate.
- `design/incarichi/ricerca-c/download-caa-01/caa-nella-sla.pdf` — PDF AISLA scaricato (865.729 byte), non letto (nessun estrattore di testo).
- `design/incarichi/ricerca-c/texto-zoom-01/td-snap-appstore-us.html` — pagina App Store USA (TD Snap), letta con estrazione del testo visibile.

Altri file presenti in `design/ricerca/` (`fonti-b.md`, `selezione.md`) non sono stati letti: l'incarico chiede di lavorare senza vedere le liste degli altri gruppi.
