# Che cosa dice la pagina, e che cosa lascia fuori (incarico 8g · metodo, direzione.md §6, punto 0)

Fonte: `/workspace/kalliope/design/progetto.md` (12/11/2026), letto per intero; accanto, per lo stato di oggi, il README,
il CHANGELOG e `docs/` del repository. Pagina guardata: `percorso/sito/index.html` com'è ora (non il piano).
Da dove viene ogni voce nel documento (la sua legenda): **P** l'ha deciso il proprietario · **R** sta in un file del
programma · **G** sta nella release su GitHub · **M** misura del progetto · **C** dato di chi coordinava · **I** ipotesi di
chi ha scritto il documento, da confermare · **L** nessun dato.
Colonna «Decisione»: **c'è** · **lasciata fuori: decisa da …** · **persa** (nessuno l'ha decisa) · **chiedere**.

## Tabella

| Voce del documento | Dove nel documento | Sulla pagina | Decisione |
|---|---|---|---|
| Un programma per il computer che dà la voce a chi non può parlare o fa fatica | §0 r.16, P | primo schermo: «Un programma per chi non può parlare o fa fatica.» | c'è |
| Scrivi nella finestra e premi Invio; il microfono «Kalliope» dice il testo con una voce italiana naturale | §0 r.16-18, P R | primo schermo: «Scrivi una frase e premi Invio: una voce italiana naturale la dice nella riunione.»; riquadro «Tu · microfono «Kalliope»» | c'è |
| Il microfono si sceglie in Zoom, Teams, Meet, **Webex, Jitsi** o nel browser | §0 r.18, P R | «Zoom, Teams, Meet» in più punti; Webex e Jitsi mai | in parte: Webex e Jitsi persi |
| Tutto sul computer: niente server, niente account, il testo non esce | §0 r.19-20, P R | strada: «Il testo che scrivi resta sul tuo computer: non passa da internet e non serve un account.» | c'è |
| SANSEVIERIA OÜ, licenza SANSEVIERIA 1.0, codice sorgente disponibile | §0 r.22, P R | piede: «Codice sorgente disponibile, licenza SANSEVIERIA 1.0 (non «open source» nel senso dell'OSI). Prodotto da SANSEVIERIA OÜ.» | c'è |
| Versione di prova 0.1-rc.1, Linux x86_64 con PipeWire | §0 r.23, P R | primo schermo «Oggi: …»; chiusura | c'è |
| Provata fino al microfono virtuale, non ancora in una riunione vera con Zoom, Teams o Meet | §0 r.23-24, P R | primo schermo «Non ancora provata in una riunione vera…»; strada «Provato / Non ancora provato» | c'è |
| Windows e macOS non hanno **ancora** il microfono virtuale | §0 r.24-25, P R | strada: «Non esiste ancora per Windows, macOS, telefono e altre lingue.» | c'è |
| Il problema: le riunioni presuppongono la voce; chi non parla resta escluso o dipende da qualcuno che parli al suo posto | §1.1, P | non detto come frase; lo porta l'idea della pagina («In riunione, alla pari.») | c'è come idea, non come frase |
| Dire una frase: si scrive e si preme Invio o «Parla»; il testo lungo si dice una frase alla volta | §1.2, R | primo schermo: il campo si scrive, Invio, la frase sale nella bolla; «Parla» nella finestra ricostruita | c'è (mostrato, «una frase alla volta» non detto) |
| Accodare: ciò che scrivi mentre parla si aggiunge in coda, non sostituisce | §1.2, R | non c'è | persa |
| Fermare: «Ferma» interrompe subito e svuota la coda | §1.2, R | «Ferma» nella finestra ricostruita (si preme e ferma la scena); che cosa fa non è detto | in parte: mostrato, non spiegato |
| Ripetere: le frasi dette restano in un elenco (fino a 30); un clic la ripete | §1.2, R | primo avvio: «Le frasi che dici restano qui, per ripeterle.»; scheda dell'ascolto: le tre frasi da riascoltare | c'è (il numero 30 no) |
| Scegliere la voce: Giulia o Marco; la scelta si ricorda | §1.2, R | filo e scheda: «Giulia», «Marco»; «La stessa frase con Marco» | c'è (che la scelta si ricordi, no) |
| «Senti anche tu»: la voce anche sulle casse del tuo computer | §1.2, R | non c'è | persa |
| Scaricare la voce al primo avvio, con barra e «Annulla» | §1.2, R | primo avvio: «Scarica la voce», «Scarico la voce… N di 53 MB», «Annulla», «Preparo la voce…», «Pronta…» | c'è |
| Informazioni: versione, scopo, licenze e attribuzioni nella finestra | §1.2, R | non c'è (la pagina dà versione e licenza nel piede) | lasciata fuori senza decisione: non serve alla home |
| Dire da terminale: `kalliope --say`, `kalliope-cli` | §1.2, R | non c'è | lasciata fuori senza decisione: è per chi installa (pagina `installa/`) |
| Il testo e l'elenco delle frasi non si salvano: spariscono alla chiusura; su disco solo voce e preferenze | §1.2 r.56-57, R | non c'è (la pagina dice che il testo resta sul computer, non che non si salva) | persa |
| Date, orari, importi e sigle letti come li direbbe una persona | §1.3, R | filo, frase 3: «Detto: «Il preventivo è di milleduecentocinquanta euro più IVA, valido fino al trentuno dicembre.»» e il cambio in bolla | c'è |
| «Alla pari»: interviene quando ha scritto, con il tempo della scrittura | §1.3, I | titolo «In riunione, alla pari.» | c'è, ma nel documento è un'ipotesi: **chiedere** |
| Non ascolta e non trascrive: nessun riconoscimento vocale, nessuna registrazione | §1.4, R | non c'è | persa |
| Chi non sente non riceve sottotitoli da Kalliope: dipendono dall'app della riunione | §1.4, I; §9 «esclusi: sottotitoli», «spiegati, non nascosti» | non c'è | persa (il documento la vuole spiegata) |
| Non clona la voce della persona: «non c'è; forse in futuro, solo con consenso» | §1.4, P; §7 «Con la tua voce» non si può promettere; §9 «al massimo forse in futuro, solo con consenso»; «esclusi: clonazione … spiegati, non nascosti» | non c'è | **chiedere** (vedi sotto); nel riassunto `brief/comune.md` era diventata «Kalliope non clona la voce» |
| Parla solo italiano | §1.4, R | strada: «Non esiste ancora per … altre lingue.»; «una voce italiana naturale» | c'è |
| Niente pittogrammi, predizione del testo, frasi preimpostate: non è un sistema completo di comunicazione aumentativa | §1.4, R I; §9 «esclusi: pittogrammi … spiegati, non nascosti» | non c'è | persa (il documento la vuole spiegata) |
| Non è un servizio online, né un'estensione del browser, né un'app per telefono | §1.4, R | «Un programma per …»; «Non esiste ancora per … telefono» | c'è in parte (servizio online ed estensione non detti) |
| Non si integra con un'app in particolare: per l'app è un microfono; la compatibilità si prova app per app | §1.4, R I | strada: Zoom, Teams, Meet «Non ancora provato»; requisiti: «Un'app di riunione che ti lasci scegliere il microfono» | c'è |
| Il suono arriva solo se un'app sta registrando dal microfono: le frasi dette mentre nessuno ascolta si scartano | §1.4, R | non c'è | persa |
| La catena: testo → normalizzatore → pronuncia → voce neurale → microfono virtuale → riunione; nessun servizio esterno tranne lo scarico della voce | §2.1, R | strada: «Scrivi la frase → La voce nasce qui → Microfono «Kalliope» → Zoom, Teams, Meet → Gli altri ti sentono»; «53 MB… una volta sola. Poi funziona senza internet.» | c'è (semplificata) |
| Esempi di lettura: «cmq … dmn alle 10:30» → «comunque … domani alle dieci e trenta»; rimette gli accenti | §2.2, R | solo l'esempio del preventivo | c'è in parte |
| Qualità misurata: 2,3% di parole sbagliate sul benchmark; circa 1 su 45 sui sei campioni del sito (due misure diverse) | §2.3, R C | non c'è | lasciata fuori senza decisione (fatto per «chi controlla», pagina `stato/`) |
| Non è misurato il tempo da Invio al suono nella riunione; le cifre sono di un solo computer | §2.3, L | non c'è | lasciata fuori senza decisione (pagina `stato/`) |
| Scarico: 53 MB in tre file, una volta, con verifica dell'impronta; poi senza internet | §2.3, R | primo avvio e requisiti: «53 MB, una volta sola. Poi funziona senza internet.» (la verifica no) | c'è |
| Gli stati della finestra con le frasi vere (primo avvio, scarico, errori, «Pronta», «Sto parlando…», «Nessuna chiamata sta usando il microfono…») | §2.4, R | ricostruzione: «Pronta…», «Sto parlando…», primo avvio; gli stati di errore no | c'è in parte (gli errori sono per `aiuto/`) |
| La causa del problema del microfono «oggi compare in inglese» | §2.4, R | — | **documento vecchio**: il programma la spiega in italiano dal 12/11 (modifica `3701c7b`); non riguarda la home |
| Prima volta: installa → «Scarica la voce» → «Pronta» → nella riunione scegli «Kalliope» → tieni vicine le due finestre → scrivi → Invio | §2.5, R | primo avvio + scelta del microfono nella riunione (ricostruzione); primo schermo: due finestre vicine | c'è |
| Uso ricorrente: «Preparo la voce…» a ogni avvio; il sistema ricorda «Kalliope» | §2.5, R | primo avvio: «Preparo la voce…» (solo la prima volta) | c'è in parte |
| Difficoltà reale: due finestre, nessuna scorciatoia fuori dalla finestra; con un interruttore o lo sguardo non provato | §2.5, I L | non c'è | persa (è un limite vero per chi usa sensori o lo sguardo) |
| Perché tutto sul computer: un testo scritto per parlare può essere privato (lavoro, salute, famiglia); funziona offline e senza costi | §3, P (motivi: I) | strada: «Il testo che scrivi resta sul tuo computer…» (il perché non è detto) | c'è il fatto, non il motivo |
| Voce naturale su computer modesti, senza scheda grafica né connessione; programma piccolo | §3, R | non c'è | persa (risponde a «il mio computer va bene?») |
| Per chi: SLA e malattie neuromuscolari, afasia, laringectomia, disartria, balbuzie, mutismo selettivo e autismo, sordità; chi assiste; logopedisti | §4.1, P | «per chi non può parlare o fa fatica» | c'è in sintesi |
| Per chi no: serve poter scrivere; con l'afasia anche scrivere può essere difficile, non va promesso | §4.2, I; P3 «per chi è e per chi no (serve scrivere; solo italiano; solo Linux oggi)» | «solo Linux» e «altre lingue» sì; «serve poter scrivere» no | persa; la frase sull'afasia è un'ipotesi: **chiedere** (o a un logopedista) |
| Sordità: i campioni hanno il testo accanto; il sito dice che non può far sentire a chi non sente | §4.2, P; P2 | filo: ogni frase con il testo (e «Detto» per la terza); la frase esplicita no | c'è in parte |
| Nessun suono né movimento imposto (mutismo selettivo, autismo) | §4.2, I | suono solo con un gesto: c'è; movimento all'arrivo: sì | lasciata fuori: decisa dal proprietario il 13/11 («il movimento è voluto», `brief/comune.md`); era un'ipotesi del documento |
| Costo: «Nessun prezzo; uso personale libero» | §4.3, R; §7 «Licenza» | chiusura: «Nessun account, nessun prezzo: l'uso personale è libero.» | c'è |
| Licenza: anche uso di ricerca e interno aziendale permesso; offerte commerciali con autorizzazione scritta | §7 «Licenza», R | non c'è (solo «uso personale libero») | lasciata fuori senza decisione scritta; il posto naturale è la pagina per chi controlla |
| Cosa si salva: voce e preferenze; il testo e l'elenco no | §7, R | non c'è | persa (vedi §1.2) |
| Cosa si invia: nulla del testo; unica connessione lo scarico della voce (da huggingface.co, con verifica) | §7, R; P7 | «non passa da internet»; «53 MB, una volta sola» (la fonte no) | c'è (la fonte è per chi controlla) |
| Reversibile: si toglie con `./install --remove` o rimuovendo il pacchetto | §7, R | non c'è | lasciata fuori senza decisione (pagina `installa/`) |
| Nessuna richiesta di accesso al microfono vero: Kalliope non lo usa | §7 «Permessi», R | non c'è | persa (rassicura chi teme di essere ascoltato; va con «non ascolta e non trascrive») |
| Il sito non usa cookie né statistiche; dirlo come fatto, senza «nessuno raccoglie dati» | §7 «Sito: reti», P I | piede: «Questo sito non usa cookie né statistiche.» | c'è |
| Promesse che il sito non può fare: Zoom/Teams/Meet come fatto, «open source», «gratis per ogni uso», Windows/macOS/telefono, «con la tua voce», «in tempo reale», «nessuna connessione», «provato con lettori di schermo», «dispositivo medico» | §7, P R L | nessuna di queste è fatta | rispettate |
| Avvertenza «non è un dispositivo medico; non sostituisce la valutazione di un logopedista» | §7, L; §12 dubbio F «non va inventata da noi» | chiusura: «Kalliope non è un dispositivo medico e non sostituisce la valutazione di un logopedista.» | c'è, ma il documento la vuole concordata: **chiedere** se il proprietario l'ha approvata (in pagina viene da `brief/comune.md`) |
| Clonazione della propria voce: non c'è; al massimo «forse in futuro, solo con consenso»; fra gli esclusi «spiegati, non nascosti» | §9, P | non c'è | **chiedere** |
| Esclusi per ora: Windows, macOS, telefono, altre lingue, clonazione, pittogrammi, sottotitoli — spiegati, non nascosti | §9, P | i primi quattro sì («Non esiste ancora per …»); clonazione, pittogrammi, sottotitoli no | in parte: tre persi |
| Home: guardare la finestra con la **foto vera** | P1; §9 «si usa questo; non si simula la finestra», C | ricostruzione animata della finestra, dichiarata «Ricostruzione…» | lasciata fuori: decisa da chi coordinava in `brief/comune.md` («una ricostruzione animata della finestra… è ammessa se è fedele») e scelta dal proprietario con la direzione 2 |
| Home: «non capisci? una versione più corta e più semplice degli stessi fatti» | P1 «errore e recupero» | non c'è | persa |
| Home: «Non posso»: perché Windows e macOS non ci sono ancora (driver firmato, account Apple) | P6, P | collegamento «Non uso Linux: cosa posso fare» a `non-ancora/`; il perché no | lasciata alla pagina `non-ancora/` (dalla lista di `brief/comune.md`) |
| Ascolto: dichiarare che sono registrazioni vere di Kalliope 0.1 e se sono ritoccate | P2; §12 dubbio G, L | filo: «registrazioni vere di Kalliope 0.1»; «ritoccate o no» non detto | **chiedere** se sono senza ritocchi |
| Ascolto: la forma detta delle cifre si mostra solo se verificata con `kalliope-cli` o la trascrizione | P2; §12 dubbio G | «Detto: …» solo per la frase 3, dato da chi coordinava; per «14/3» e «15:30» no | c'è per la frase 3; la verifica non è scritta da nessuna parte |
| Chi c'è dietro: SANSEVIERIA OÜ; l'autore originale è nominato in `NOTICE` | P3, R | piede: «Prodotto da SANSEVIERIA OÜ.» | c'è (l'autore no: per chi controlla) |
| Un'informazione cercata che non esiste (prezzo, assistenza telefonica, certificazioni): dirlo, non lasciarla vuota | P3 | prezzo sì («nessun prezzo»); assistenza e certificazioni no | persa in parte |
| Un canale per dire «ha funzionato» senza account GitHub | §12 dubbio A | non c'è | **chiedere** (dubbio già aperto nel documento) |
| Nel frattempo, per chi non ha Linux: cosa fare o alternative di terzi | §12 dubbio E | collegamento a `non-ancora/` | **chiedere** (dubbio già aperto) |

In tutto 65 voci: 32 ci sono (alcune in parte), 15 si sono perse, 9 sono lasciate fuori (2 per decisione scritta: il
movimento, il 13/11, e la finestra ricostruita; una affidata a `non-ancora/` dalla lista di `brief/comune.md`; 6 senza
decisione, rimandate a pagine che non esistono ancora), 8 sono da chiedere al proprietario, 1 riga del documento è vecchia
rispetto al programma.

## Manca e si è perso
Nessuno ha deciso di lasciarle fuori: non erano nella lista «I contenuti della home» di `brief/comune.md` (il riassunto di
chi coordinava), e chi ha reso la pagina (l'autore della direzione 2, poi io) è partito da quella lista, non dal documento.
- **Ciò che Kalliope non fa**, che il documento vuole spiegato: non ascolta e non trascrive; non dà sottotitoli a chi non
  sente; niente pittogrammi, predizione o frasi pronte (non è un sistema completo di comunicazione aumentativa).
- **La clonazione della propria voce** fra gli esclusi «spiegati, non nascosti» (§1.4, §9): nel riassunto era diventata
  il divieto «Kalliope non clona la voce», e la pagina non ne parla. È la voce che il proprietario ha trovato mancante.
- **Che cosa succede al testo dopo:** non si salva, sparisce alla chiusura; Kalliope non usa il microfono vero.
- **Funzioni della finestra non dette:** accodare mentre parla; «Senti anche tu».
- **Il suono arriva solo se un'app sta ascoltando** il microfono «Kalliope» (le frasi dette prima si scartano).
- **Per chi no:** serve poter scrivere.
- **Gira su computer modesti**, senza scheda grafica e senza connessione dopo lo scarico.
- **Le app nominate:** il documento dice anche Webex e Jitsi; la pagina solo Zoom, Teams, Meet.
- **La difficoltà vera delle due finestre** per chi usa un sensore o lo sguardo (nessuna scorciatoia, non provato).
- **Una versione più corta e più semplice** per chi non capisce (P1), e «non esiste» per assistenza e certificazioni (P3).

## Da chiedere al proprietario (prima di rendere qualcosa)
- **La campionatura della propria voce:** oggi esiste? Il programma non ne ha traccia (README, CHANGELOG, `docs/`); il
  documento del 12/11 dice «non c'è; forse in futuro, solo con consenso». Va raccontata come futura, come presente, o in
  altro modo? Non si inventa.
- **«Alla pari», «interviene quando ha scritto»:** nel documento è un'ipotesi di chi l'ha scritto; è anche il titolo.
- **L'avvertenza medica** («non è un dispositivo medico…»): il documento vuole che sia concordata con lui (dubbio F);
  sulla pagina c'è, presa dal riassunto. L'ha approvata così?
- **I campioni:** sono registrazioni senza ritocchi? E la forma detta delle cifre è verificata (dubbio G)?
- **Con l'afasia anche scrivere può essere difficile:** dirlo, e come (ipotesi del documento, «da confermare con un
  logopedista»).
- **Un canale per dire «ha funzionato»** senza account (dubbio A); **che cosa dire a chi non ha Linux** nel frattempo
  (dubbio E): sono già aperti nel documento.
- **Documento e programma non coincidono** in un punto: i problemi del microfono ora sono spiegati in italiano (modifica
  del 12/11), il documento dice in inglese. Non tocca la home; va aggiornato il documento.

## Dove andrebbe (non reso; solo dove e quanto sposta)
- Non ascolta, non trascrive, non usa il microfono vero, il testo non si salva → «Fin dove arriva la voce», accanto alla
  frase di riservatezza · una frase in un tratto che c'è.
- Niente sottotitoli, pittogrammi, frasi pronte; per chi no: serve poter scrivere → «Fin dove arriva la voce», vicino a
  «Non esiste ancora» · una o due frasi in un tratto che c'è.
- Accodare, «Senti anche tu» → il primo avvio in «Che cosa serve», o la scheda dell'ascolto · una frase.
- Il suono arriva solo se un'app ascolta → «Che cosa serve», terzo requisito · una frase.
- Gira su computer modesti → «Che cosa serve», primo requisito · una frase.
- Webex e Jitsi → «Fin dove arriva la voce», tappa «Zoom, Teams, Meet» · due parole (e vale «non ancora provato»).
- Le due finestre con un sensore o lo sguardo → «Fin dove arriva la voce», fra il non provato · una frase.
- Versione più semplice; «non esiste» per assistenza e certificazioni → fuori dalla home (una pagina o un interruttore
  di lettura semplice) · un tratto nuovo o una pagina.

## Come ha funzionato il passo (direzione.md §6, punto 0)
- Mancava come trattare le voci che appartengono ad altre pagine del sito ancora da fare (`installa/`, `stato/`): ho dovuto
  inventare «lasciata fuori, rimandata a una pagina che non esiste», ma il punto 0 conosce solo «c'è» o «lasciata fuori,
  con chi l'ha deciso»; serve dire quali voci del documento riguardano questa pagina (qui il percorso P1) e quali no.
- Non dice dove guardare «il prodotto com'è oggi» (README, CHANGELOG, la storia dei cambiamenti) né come pesare le decisioni
  del proprietario arrivate dopo il documento dentro i riassunti di chi coordina (il movimento voluto, la finestra
  ricostruita): «parti dal documento, non da un riassunto» rischia di cancellare anche quelle.
- È arrivato dopo la pagina, non prima: fatto prima avrebbe evitato le 15 voci perse; e non dice chi lo controlla oltre al
  proprietario (il giudice non l'ha avuto in nessuno dei tre sguardi).
