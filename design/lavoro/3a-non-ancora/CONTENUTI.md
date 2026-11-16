# Che cosa dice la pagina «non ancora», e che cosa lascia fuori (incarico 3a · direzione.md §6, punto 0)

Scritto prima di rendere. Fonti: `design/progetto.md` (12/11/2026) §0, §1.4, §7, §9, §10 P6, §12 dubbio E, letto per
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
| Oggi no: Kalliope funziona solo su Linux, x86_64 con PipeWire | §0 P R; P6 «la risposta onesta: oggi no» | primo schermo: titolo «Windows e macOS: non ancora.», presentazione, riga «Oggi:» | c'è |
| Che cos'è Kalliope, in una frase (chi arriva da una ricerca o dal README non ha visto la home) | §0; P6 «Ingresso: da P1, da ricerche, dal README» | primo schermo, presentazione: «il programma che dice nella riunione ciò che scrivi» | c'è |
| Versione di prova {{kalliope.version}} | §0 P R; §7 «dati vivi» | primo schermo, riga «Oggi:»; elenco delle versioni (tratto «Quando arriva») | c'è (segnaposto, mai a mano) |
| Perché non su Windows: per il microfono virtuale serve un driver audio firmato, che non c'è ancora | P6 P; pagina vecchia «driver audio con una firma valida»; `docs/virtual-microphone.md` | tratto «Si ferma al microfono»: sotto la tappa del microfono, dove la strada si interrompe | c'è |
| Perché non su macOS | P6 P: «macOS un account Apple»; pagina vecchia: «un componente audio approvato da Apple» | stesso posto, accanto a Windows | c'è, con la frase della pagina vecchia. **Chiedere**: il documento dice «un account Apple», la pagina vecchia «un componente approvato da Apple»; sono due modi di dire la stessa mancanza o due fatti diversi? |
| Senza il microfono nessuna app di riunione sente la voce | pagina vecchia; §1.4 «per l'app di riunione è semplicemente un microfono» R | primo schermo (nella riunione «Kalliope» manca fra i microfoni); tratto «Si ferma al microfono» (l'impulso si ferma lì) | c'è |
| Che cosa c'è già: il programma si costruisce e supera i test anche su Windows e macOS | P6 R; README («compile and pass tests»); `releasing.md` (ONNX Runtime si carica su entrambi) | tratto «Si ferma al microfono»: le prime due tappe accese, esito «C'è già» | c'è |
| Che cosa manca: il driver del microfono, i pacchetti da installare, la loro firma | P6 («driver, firma, pacchetto», `releasing.md` «Not done yet») | esito «Manca», sotto la strada | c'è |
| Telefono e tablet: Kalliope non esiste, è un programma per il computer | §1.4 R («né un'app per telefono»); §9 esclusi; pagina vecchia | riga «Non esiste ancora» in fondo allo stesso tratto | c'è |
| Non è un servizio online né un'estensione del browser | §1.4 R | stessa riga | c'è (è la domanda naturale di chi non può installare: «c'è una versione online?») |
| Altre lingue: parla solo italiano | §1.4 R; §9; P6 «altra lingua» | stessa riga | c'è |
| La propria voce: «non c'è; forse in futuro, solo con consenso» | §1.4 P; §7 «Con la tua voce» non si promette; §9 esclusi «spiegati, non nascosti» | stessa riga, con le parole del documento | c'è, ma **chiedere**: è la voce che il proprietario ha visto mancare nella home (`design/direzione-2/CONTENUTI.md`, «Da chiedere»); qui ha il suo posto naturale, perché è un «non ancora». La frase è quella del documento (P), nessuna parola in più |
| Pittogrammi, predizione del testo, frasi preimpostate; non è un sistema completo di comunicazione aumentativa | §1.4 R I; §9 esclusi | — | **rimandata a** `stato/`: è ciò che il programma non fa per chi lo può già usare, non un sistema su cui manca. Da non perdere quando si rifà `stato/` |
| Sottotitoli: chi non sente non li riceve da Kalliope (dipendono dall'app della riunione) | §1.4 I; §9 esclusi | — | **rimandata a** `stato/`, stesso motivo |
| Non ascolta e non trascrive; non usa il microfono vero | §1.4 R; §7 «Permessi» | — | **rimandata a** `stato/` (riservatezza) |
| Nessuna data promessa | P6 «Regole» | tratto «Quando arriva»: il titolo | c'è |
| Come essere avvisata senza account e senza lasciare dati: il feed delle release (`releases.atom`) | P6, segnato `[I]` «da verificare» | tratto «Quando arriva»: pillola «Segui le versioni (feed)» e l'elenco delle versioni ricostruito | c'è. **Verificato il 16/11/2026**: `https://github.com/SANSEVIERIA-OU/kalliope/releases.atom` risponde 200, `application/atom+xml`, una voce «Kalliope 0.1-rc.1» del 12/11/2026. Le note della voce sono **in inglese**: la pagina non lo dice ancora (da decidere con il proprietario se dirlo) |
| La pagina delle versioni su GitHub | pagina vecchia | stesso tratto, collegamento | c'è |
| Nessuna lista d'attesa, nessun indirizzo e-mail raccolto | P6; pagina vecchia | stesso tratto, testo | c'è |
| Nessuna alternativa di terzi consigliata | P6 «Regole»; §12 dubbio E | chiusura: «Non consigliamo altri prodotti: non li abbiamo provati» (frase della pagina vecchia) | c'è; il dubbio E resta aperto (**chiedere**) |
| Nel frattempo: se una persona vicina ha un computer Linux, Kalliope si può installare lì | pagina vecchia; è «cosa fare nel frattempo», cioè il dubbio E | chiusura, collegamento a `installa/` | c'è perché la pagina vecchia lo dice; **chiedere** con il dubbio E |
| Intanto si può sentire la voce: le registrazioni vere (giulia-1) | §9 materiale vero C; P2 | chiusura: la stessa frase del primo schermo, qui detta con la registrazione vera, solo dopo un gesto | c'è. Scelta progettuale: è l'unica cosa che chi non ha Linux può fare subito con Kalliope; non è un'alternativa e non promette nulla |
| Ogni suono ha il testo accanto; niente suono che parte da solo | P1 «Regole»; §4.2 sordità | chiusura: la frase è scritta nella bolla, il suono parte solo premendo | c'è |
| Rimando allo stato e ai limiti | pagina vecchia | chiusura, collegamento a `stato/` | c'è |
| Licenza SANSEVIERIA 1.0, codice sorgente disponibile, SANSEVIERIA OÜ; niente cookie né statistiche | §0; §7 | piede, come nella home | c'è |
| «Perché serve: dire no, e perché, subito è rispetto» | P6 | il primo schermo risponde nel titolo, senza scorrere | c'è (è l'ordine della pagina) |
| Il movimento all'arrivo | §4.2 I «nessun movimento imposto»; deciso dal proprietario il 13/11 «il movimento è voluto» | arrivo del primo schermo e dei tratti; con «riduci movimento» tutto al suo stato finale | c'è, per decisione del proprietario |
| Windows e macOS rinviati finché il proprietario non ne riparla | `STATO.md`, 16/11/2026 | nessuna data, nessun «presto» | rispettata |
| Webex, Jitsi | §0 | la tappa della strada dice «Zoom, Teams, Meet» come nella home | lasciata come nella home (la tappa è la stessa); non riguarda questa pagina |

In tutto 29 voci: 23 ci sono (4 con una domanda aperta), 3 rimandate a `stato/`, 1 rispettata come vincolo, 1 lasciata come
nella home, 1 fatto nuovo trovato (il feed è in inglese).

## Da chiedere al proprietario (tramite chi coordina)
- **macOS**: «account Apple» (documento) o «componente audio approvato da Apple» (pagina vecchia)?
- **La propria voce**: va bene qui, con le parole del documento («non c'è; forse in futuro, solo con consenso»)?
- **Dubbio E**: «nel frattempo» si può dire di installarlo su un computer Linux vicino (come la pagina vecchia)?
- **Il feed è in inglese**: dirlo accanto al collegamento?
