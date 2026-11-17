# Che cosa dice la pagina «non ancora», e che cosa lascia fuori (incarico 3a · direzione.md §6, punto 0)

Scritto prima di rendere, aggiornato nel giro di correzioni dopo il giudizio (`giudizio/GIUDIZIO.md`, I1, I2, I3, M8) con le
decisioni prese da chi coordina sulle risposte del proprietario (17/11/2026, riportate nell'incarico di correzione). Fonti: `design/progetto.md` (12/11/2026) §0, §1.4, §7, §9, §10 P6, §12 dubbio E, letto per
intero; la pagina di oggi `website/non-ancora/index.html` (HEAD 0c2ed90); per lo stato del programma `README.md`,
`CHANGELOG.md`, `docs/releasing.md` («Not done yet»), `docs/virtual-microphone.md` («Windows and macOS»); le decisioni del
proprietario del 16/11/2026 in `design/lavoro/STATO.md`. I testi della pagina verranno riscritti da capo (decisione del
proprietario, `STATO.md`): qui conta dove sta ogni voce, non la frase.

Legenda del documento: **P** proprietario · **R** file del programma · **G** release · **C** coordinatore · **I** ipotesi da
confermare · **L** nessun dato. Colonna «Decisione»: **c'è** · **rimandata a** (la voce riguarda un'altra pagina) ·
**lasciata fuori** (chi e perché) · **chiedere** (al proprietario, tramite chi coordina).

## Tabella

| Voce | Fonte | Dove sta nella pagina | Decisione |
|---|---|---|---|
| Oggi no: Kalliope funziona solo su Linux, x86_64 con PipeWire | §0 P R; P6 «la risposta onesta: oggi no» | primo schermo: titolo «Su Windows e macOS: non ancora.», presentazione, riga «Oggi:» | c'è |
| Non ancora provata in una riunione vera con Zoom, Teams o Meet | §0 P R; §7 «Promesse che il sito non può fare»; §9 «Stato onesto» | primo schermo, riga «Oggi:» (come nella home); nella strada le tappe dopo il microfono sono tratteggiate, come nella home le tappe non provate | c'è (dal giro di correzioni: mancava nell'elenco e nella pagina, I1) |
| Che cos'è Kalliope, in una frase (chi arriva da una ricerca o dal README non ha visto la home) | §0; P6 «Ingresso: da P1, da ricerche, dal README» | primo schermo, presentazione: «il programma che dice nella riunione ciò che scrivi» | c'è |
| Versione di prova {{kalliope.version}} | §0 P R; §7 «dati vivi» | primo schermo, riga «Oggi:»; elenco delle versioni (tratto «Quando arriva») | c'è (segnaposto, mai a mano) |
| Perché non su Windows: per il microfono virtuale serve un driver audio firmato, che non c'è ancora | P6 P; pagina vecchia «driver audio con una firma valida»; `docs/virtual-microphone.md` | tratto «Si ferma al microfono»: sotto la tappa del microfono, dove la strada si interrompe | c'è |
| Perché non su macOS: serve un account sviluppatore Apple per firmare il componente audio | P6 P | stesso posto, accanto a Windows: «su macOS, per firmare il componente audio, un account sviluppatore Apple» | c'è. Deciso da chi coordina sulla risposta del proprietario: vale il documento [P]; «componente approvato da Apple» (pagina vecchia) tolto |
| Senza il microfono nessuna app di riunione sente la voce | pagina vecchia; §1.4 «per l'app di riunione è semplicemente un microfono» R | primo schermo (nella riunione «Kalliope» manca fra i microfoni); tratto «Si ferma al microfono» (l'impulso si ferma lì) | c'è |
| Che cosa c'è già: il programma si costruisce e supera i test anche su Windows e macOS | P6 R; README («compile and pass tests»); `releasing.md` (ONNX Runtime si carica su entrambi) | tratto «Si ferma al microfono»: le prime due tappe accese, esito «C'è già» | c'è |
| Che cosa manca: il driver del microfono, i pacchetti da installare, la loro firma | P6 («driver, firma, pacchetto», `releasing.md` «Not done yet») | esito «Manca», sotto la strada | c'è |
| Telefono e tablet: non ancora | §1.4 R («né un'app per telefono»); §9 «esclusi per ora»; pagina vecchia | riga «Non esiste ancora per telefono e tablet» in fondo allo stesso tratto | c'è, come «non ancora» (§9, «per ora»; confermato da chi coordina) |
| Non è un servizio online né un'estensione del browser | §1.4 R | stessa riga, detta come confine: «Kalliope è un programma per il computer: non è un servizio online né un'estensione del browser» | c'è, **senza «ancora»** (I2: prima diceva «non esiste ancora … né come servizio online», una promessa che il progetto esclude) |
| Altre lingue: per ora parla solo italiano | §1.4 R; §9 «esclusi per ora»; P6 «altra lingua» | stessa riga: «per ora parla solo italiano» | c'è, come «non ancora» |
| La propria voce: «non c'è; forse in futuro, solo con consenso» | §1.4 P; §9 esclusi | — | **lasciata fuori** da questa pagina, deciso da chi coordina (17/11): la pagina parla di piattaforme e la decisione del proprietario sulla propria voce è ancora aperta (`STATO.md`: clonazione rinviata) |
| Pittogrammi, predizione del testo, frasi preimpostate; non è un sistema completo di comunicazione aumentativa | §1.4 R I; §9 esclusi | — | **rimandata a** `stato/`: è ciò che il programma non fa per chi lo può già usare, non un sistema su cui manca. Da non perdere quando si rifà `stato/` |
| Sottotitoli: chi non sente non li riceve da Kalliope (dipendono dall'app della riunione) | §1.4 I; §9 esclusi | — | **rimandata a** `stato/`, stesso motivo |
| Non ascolta e non trascrive; non usa il microfono vero | §1.4 R; §7 «Permessi» | — | **rimandata a** `stato/` (riservatezza) |
| Nessuna data promessa | P6 «Regole» | tratto «Quando arriva»: il titolo | c'è |
| Come saperlo quando arriva, senza account e senza lasciare dati | P6 «Azioni e dati» | tratto «Quando arriva»: l'elenco delle versioni di questa pagina, con il posto di Windows e macOS in cima; comando pieno «Copia l'indirizzo di questa pagina» (senza script: «salvala tra i preferiti») e «ripassa da qui». Fatto su cui si regge: il sito si ricostruisce dopo ogni release con i dati della release (`docs/releasing.md`, «Website»), quindi l'elenco si aggiorna da solo | c'è (dal giro di correzioni, I3: prima il comando pieno apriva il file del feed). Scelta progettuale; non promette un avviso, dice dove guardare |
| Il feed delle release (`releases.atom`) | P6, segnato `[I]` «da verificare» | stesso tratto, una nota sotto: «Usi un lettore di feed, un programma che ti avvisa quando un sito pubblica qualcosa? Il feed delle versioni segnala ogni nuova versione, anche quelle solo per Linux, ed è in inglese» | c'è, come nota per chi lo sa usare, con che cos'è, che segnala ogni versione e che è in inglese. **Verificato il 16/11/2026**: risponde 200, `application/atom+xml`, una voce «Kalliope 0.1-rc.1»; note in inglese. Non riaperto il 17/11 |
| La pagina delle versioni su GitHub | pagina vecchia | stessa nota, detta in inglese | c'è |
| Nessuna lista d'attesa, nessun indirizzo e-mail raccolto | P6; pagina vecchia | stesso tratto, testo | c'è |
| Nessuna alternativa di terzi | P6 «Regole»; §12 dubbio E | — (nessuna frase, nessun collegamento) | rispettata. Dubbio E: il proprietario ha risposto «non ancora» (17/11, tramite chi coordina) |
| Nel frattempo: installarlo sul computer Linux di una persona vicina | pagina vecchia; dubbio E | — | **lasciata fuori**: risposta del proprietario al dubbio E, «non ancora» (prima c'era, presa dalla pagina vecchia; M8 del giudizio) |
| Intanto si può sentire la voce: le registrazioni vere (giulia-1) | §9 materiale vero C; P2 | chiusura: la stessa frase del primo schermo, qui detta con la registrazione vera, solo dopo un gesto | c'è. Scelta progettuale: è l'unica cosa che chi non ha Linux può fare subito con Kalliope; non è un'alternativa e non promette nulla |
| Ogni suono ha il testo accanto; niente suono che parte da solo | P1 «Regole»; §4.2 sordità | chiusura: la frase è scritta nella bolla, il suono parte solo premendo | c'è |
| Rimando allo stato e ai limiti | pagina vecchia | chiusura, collegamento a `stato/` | c'è |
| Licenza SANSEVIERIA 1.0, codice sorgente disponibile, SANSEVIERIA OÜ; niente cookie né statistiche | §0; §7 | piede, come nella home | c'è |
| «Perché serve: dire no, e perché, subito è rispetto» | P6 | il primo schermo risponde nel titolo, senza scorrere | c'è (è l'ordine della pagina) |
| Il movimento all'arrivo | §4.2 I «nessun movimento imposto»; deciso dal proprietario il 13/11 «il movimento è voluto» | arrivo del primo schermo e dei tratti; con «riduci movimento» tutto al suo stato finale | c'è, per decisione del proprietario |
| Windows e macOS rinviati finché il proprietario non ne riparla | `STATO.md`, 16/11/2026 | nessuna data, nessun «presto» | rispettata |
| Webex, Jitsi | §0 | la tappa della strada dice «Zoom, Teams, Meet» come nella home | lasciata come nella home (la tappa è la stessa); non riguarda questa pagina |

In tutto 31 voci: 24 ci sono, 3 rimandate a `stato/`, 2 lasciate fuori per decisione (la propria voce; installarlo su un
Linux vicino), 1 rispettata come vincolo (nessuna alternativa), 1 lasciata come nella home.

## Le domande del primo giro, con la risposta (17/11/2026, decise da chi coordina sulle risposte del proprietario)
- **macOS**: vale il documento: serve un account sviluppatore Apple per firmare il componente audio.
- **La propria voce**: tolta da questa pagina (la pagina parla di piattaforme; la decisione è aperta).
- **Dubbio E**: «non ancora»: niente consiglio di installarlo sul Linux di una persona vicina, niente alternative.
- **Il feed in inglese**: resta come nota, con che cos'è e che è in inglese; il comando pieno è un altro (vedi sopra).

## Da chiedere ancora
- Un modo di essere avvisati con un messaggio (e-mail o altro) resta escluso: «nessuna lista d'attesa, nessuna e-mail raccolta».
  Se il proprietario ne volesse uno, è una decisione sua (il giudizio, I3, lo segnala).
