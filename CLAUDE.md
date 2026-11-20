# CLAUDE.md — Kalliope

Questo file comanda per tutto il repository, anche per Codex (`AGENTS.md` rimanda qui). Le decisioni datate sono
del proprietario e prevalgono su note di memoria, documenti di stato e piani più vecchi.

Kalliope è un programma per il computer per chi non può parlare o fa fatica: scrivi una frase e una voce italiana la
dice in un microfono virtuale, per Zoom, Teams, Meet e gli altri. Che cosa fa e come si costruisce: `README.md`,
`CONTRIBUTING.md`, `docs/`. Questo file dice ciò che lì non c'è: da dove si riparte sul sito e sul design system, e
come si lavora.

## Il sito e il design system: da dove si riparte

**Stato al 20/11/2026.** Aggiorna questa sezione ogni volta che lo stato cambia.

- **Il sito è `website/`** (prima si chiamava `site/`). La home è quella nuova, nella direzione 2 «Alla pari, in
  riunione», scelta dal proprietario il 14/11/2026 fra tre direzioni rese.
- **«non ancora» è rifatta** nella direzione 2 (mostrata al proprietario il 17/11/2026) e fissa la cornice delle pagine
  interne (`website/cornice.js`, `design-system/componenti/pagina.css`). La pagina della scelta della lingua (`/`) è
  nuova anche lei.
- **«stato» è rifatta** nella direzione 2 e approvata dal proprietario il 19/11/2026 («ok per tutto»).
- **«installa» è rifatta** nella direzione 2, approvata dal proprietario il 20/11/2026 («va bene», vista senza giudice per sua
  scelta) e pubblicata lo stesso giorno («pubblica tutto»). Restano aperti i nove punti d'aspetto della costruzione
  (`design/lavoro/3c-installa/costruzione/progresso.md`, «Consegna della ripresa»). La prossima è «in riunione», con «aiuto».
- **Il logo nuovo** (decisione del proprietario del 19/11/2026: «rifarei il logo perché con il nuovo sito c'entra poco»):
  fra tre direzioni rese e giudicate il proprietario ha scelto la 3, «La frase che si accende», una bolla metà piena (detto)
  e metà tratteggiata (non ancora detto) (`design/lavoro/L-logo/`). È in `design-system/marchio/`, generato dai token da
  `tools/marchio.py`: la costruzione lo mette nella barra di ogni pagina e nell'icona della scheda, i pacchetti lo installano
  come icona del programma. Il verde del logo di prima non c'è più (la nota di `design/direzione-2/D2.md` è superata).
- **Pubblicare** (19/11/2026): il proprietario ha detto di «cominciare a mergiare in main e caricare il nuovo sito». Il sito
  nuovo va in linea con le pagine fatte; le altre arrivano una alla volta. Ogni push resta un passo detto al proprietario.
- **Le altre pagine non sono ancora state rifatte.** Ascolta, in riunione, aiuto e la pagina 404
  hanno l'aspetto di prima, con i loro fogli in `website/stile/`, gli script in `website/script/` e il vecchio
  catalogo in `website/sistema/`. Restano solo perché le pagine nuove rimandano a loro.
- **Il design system è `design-system/`**, fuori dal sito: token, base, componenti, caratteri, catalogo vivo,
  `SISTEMA.md` e `TOKEN.md`. Lo usano la home, «non ancora», «stato», «installa» e la scelta della lingua.
- **In linea c'è il sito nuovo** dal 20/11/2026 (push su `main` autorizzato dal proprietario): le pagine rifatte, il logo nuovo
  anche sulle pagine ancora da rifare, che hanno ancora i colori di prima.
- **Il lavoro in corso** (dal 16/11/2026: lingue, poi le altre pagine, poi l'applicazione) è in `design/lavoro/`:
  `STATO.md` dice fasi, decisioni prese a lavoro avviato e incarichi; `ricerca/lingue.md` i fatti con le fonti.
- **La voce di chi usa Kalliope** (decisione del proprietario del 17/11/2026: «voglio che lo faccia già adesso (non "la
  mia voce" ma la voce dell'utente)»): il programma parlerà con la voce della persona che lo usa. Si fa adesso, in
  parallelo alle pagine: prima ricerca e proposta con le alternative, poi la costruzione (`design/lavoro/STATO.md`, fase V).
  Strada scelta dal proprietario il 17/11/2026 dopo l'ascolto dei campioni: «Strada 1», un secondo motore che imita la voce
  dalla registrazione (Pocket TTS; misure in `benchmarks/voce-propria/README.md`). La voce di oggi resta per chi non ha una registrazione. Il 17/11/2026 il proprietario ha chiesto di metterlo nel
  programma senza ascoltare prove («ti dico già di inserire il trucco senza farmi sentire i test»); «il trucco» (pesi aperti
  attuali più l'encoder di maggio) non regge, perché Kyutai ha riaddestrato il codec (V-3). Il 19/11/2026 il proprietario ha
  creato l'account Hugging Face: si usa la versione attuale ufficiale con la clonazione (`kyutai/pocket-tts`), sempre senza
  prove d'ascolto (`design/lavoro/STATO.md`, V-4). Account, condizioni e chiave li gestisce solo il proprietario.
- **Modelli e ONNX Runtime dentro il programma** (decisioni del proprietario del 19/11/2026). Il modello di Kyutai si
  ridistribuisce citandolo («ridistribuiamo con citazione»). ONNX Runtime non si scarica da terzi: «anche onx lo mettiamo nel
  programma e a noi l'onere di tenerlo aggiornato così come il modello kyutai». Proposta approvata il 19/11/2026 («ok per tutto»): una release
  di GitHub di Kalliope fa da magazzino dei file, i pacchetti contengono tutto (Giulia e Marco compresi), un controllo ogni
  settimana segnala le versioni nuove (`design/lavoro/STATO.md`, P-2). Costruito il 19/11/2026: i file stanno in `tools/assets.json`,
  l'aggiornamento in `docs/releasing.md`. Caricare i file nella release `assets` e pubblicare si chiede ogni volta, e la release
  va creata prima del push, perché la CI scarica da lì. Le dipendenze del programma si portano tutte all'ultima versione («si, aggiorniamo
  tutto», P-1).
- **Rilasci e AUR** (scelte del proprietario del 20/11/2026, fra le alternative proposte dopo la ricerca, `design/lavoro/ricerca/rilasci.md`).
  - Le release si fanno con il nostro strumento: `tools/version.py` e `CHANGELOG.md` scritto a mano per chi usa Kalliope.
  - Partono da sole quando la versione cambia su `main`, come in Kalipso.
  - Niente più versioni di prova: «ogni passo è finale», e la prossima release è la 0.1, marcata latest.
  - Su AUR va `kalliope-bin`, solo con le versioni finali, pubblicato dalla release con una chiave SSH dedicata a Kalliope. La chiave
    sta nel secret `AUR_SSH_KEY` e in copia nel `.env`; la parte pubblica sta nel profilo AUR del proprietario.
  - La ricetta su AUR (PKGBUILD e `.SRCINFO`) resta sotto la SANSEVIERIA 1.1 come il resto del repository, non 0BSD (scelta del
    proprietario del 20/11/2026).
  - La 0.1 è pubblicata il 20/11/2026 («Sì, pubblica ora»).
  - Per un repository pubblico GitHub Actions è gratuito. Una release parte con un push su `main`, quindi resta un passo chiesto al
    proprietario ogni volta.
- **Il telefono** (17/11/2026): «non è per telefono: è solo desktop per il momento». Il sito non dice «non ancora» per
  il telefono.

**«Riprendiamo dal sito» vuol dire questo, e non altro:** rifare le altre pagine nella direzione 2, sopra
`design-system/`, partendo dalla home nuova. Non vuol dire riprendere il lavoro del 12/11/2026.

1. Leggi, in quest'ordine: `design/direzione-2/LEGGIMI.md`, `design-system/SISTEMA.md`,
   `design/direzione-2/CONTENUTI.md`, `design/direzione-2/D2.md`.
2. ~~Prima di rendere una pagina, i contenuti~~: superato dalla decisione del 16/11/2026 qui sotto («Pronti per
   le traduzioni»): i testi si rifanno da capo, quindi le domande di `CONTENUTI.md` non sono il lavoro di adesso.
   Resta vero che il sito non inventa funzioni che il programma non ha.
3. Ogni pagina si costruisce con i token e i componenti di `design-system/`. Ciò che manca si aggiunge lì, con il
   suo ruolo, e il catalogo cresce con la pagina: nessun valore scritto a mano nella pagina, nessun secondo
   sistema. Il metodo è la skill `design-system-generator` del plugin vibe-next, con i suoi ruoli.
4. Ogni pagina rifatta si mostra al proprietario prima di passare alla successiva.
5. Quando l'ultima pagina è rifatta, `website/stile/`, `website/script/` e `website/sistema/` si tolgono.

**Che cosa è superato.** Il resto di `design/` (`STATO.md`, `direzione.md`, `incarichi/`, `strumenti/`,
`metodo.config.mjs`) e le note di memoria del 12/11/2026 descrivono il sito di prima, «Carta e voce», e nominano
ancora `site/`. Restano come storia: non sono il punto di ripresa, e i loro strumenti generavano le pagine di
allora. Resta valido `design/progetto.md`, il documento di progetto da cui si prendono i contenuti.

## Il design system vale anche per l'applicazione

Decisione del proprietario del 16/11/2026: «il nuovo sito al posto del vecchio, nella stessa cartella rinominata
website; il design system in una cartella dedicata (dato che comunque dovrà essere applicato anche
all'applicazione)».

- `design-system/` è l'unica fonte di colori, caratteri, forme, spazi e tempi, per il sito e per l'applicazione.
- **Oggi l'applicazione non lo usa**: la finestra (`crates/app/ui/app.slint`) ha i suoi colori scritti a mano, e i
  token sono variabili CSS, che Slint non legge. Come portarli nell'applicazione non è deciso.
- Ogni volta che si tocca l'aspetto dell'applicazione, il primo passo è questo: proporre al proprietario come
  ricavare da `design-system/token.css` i valori per Slint, con una sola fonte e senza copie a mano, e aspettare
  il via. Un colore, un carattere o una misura nuovi scritti a mano nell'applicazione sono un errore.
- Ciò che serve all'applicazione e nel sistema manca si aggiunge al sistema, non all'applicazione.

## Pronti per le traduzioni

Decisione del proprietario del 16/11/2026: «chissenefrega dei testi tanto anno rifatti da capo: preoccupati solo di
rendere predisposto sito e applicazione per essere tradotta nelle lingue dell'UE + prime dieci lingueparlate al
mondo.»

- I testi di oggi, del sito e dell'applicazione, verranno riscritti da capo: non si perde tempo a rifinirli né a
  chiedere contenuti.
- Il lavoro è la predisposizione: sito, applicazione e design system devono poter ricevere le traduzioni nelle
  lingue ufficiali dell'UE e nelle dieci lingue più parlate al mondo, comprese scritture non latine e da destra a
  sinistra. Sono 30 (ricerca del 16/11/2026: le 24 dell'UE da europa.eu; le dieci per parlanti totali da Ethnologue
  2026, letto attraverso Wikipedia perché il sito di Ethnologue era bloccato): bg cs da de el en es et fi fr ga hr hu
  it lt lv mt nl pl pt ro sk sl sv, più zh hi ar bn id ur. Scritture: latina, greca, cirillica (bg), cinese,
  devanagari, bengali, araba (ar, ur; da destra a sinistra; l'urdu di solito in nastaliq).
- Come farlo: proposto dopo la ricerca e approvato dal proprietario il 16/11/2026 (`.po` unico per sito e
  applicazione, una cartella per lingua, design system specchiabile, applicazione con `@tr`). **Il sito è pronto**
  (17/11/2026): struttura, specchio da destra a sinistra, un carattere per scrittura (`design-system/caratteri/LEGGIMI.md`),
  scelta della lingua. **L'applicazione è da fare**, dopo le pagine del sito (`design/lavoro/STATO.md`, fase 4).

## Come si costruisce e si pubblica il sito

- `python3 -I tools/site.py --out DIR` costruisce il sito: copia `website/`, ci mette `design-system/` e riempie i
  segnaposto della versione (`{{kalliope.version}}` e gli altri). Le pagine non scrivono mai una versione a mano.
- La home è completa solo nel sito costruito: i suoi stili arrivano da `design-system/`. Per vederla:
  `docs/releasing.md`, «Website».
- **Una cartella per lingua** (dal 16/11/2026): `/` è la scelta della lingua, `/it/`, `/en/`… le pagine; i vecchi
  indirizzi rimandano a `/it/…`. Finché la lingua pubblicata è una sola, `/` manda a `/it/` e il selettore non si
  mostra; tornano da soli con la seconda lingua (decisione del 17/11/2026, `tools/site.py`). Aggiungere una lingua vuol dire aggiungere `website/lingue/<xx>.po`
  (`docs/translating.md`); una lingua con voci mancanti o da rivedere non si pubblica. I testi da tradurre si segnano
  nell'HTML con `data-t`; `tools/translations.py check`, `tools/css_logico.py` (niente sinistra/destra nel CSS) e
  `tools/test_translations.py` girano in CI. Le pseudo-lingue `en-XA` e `ar-XB` si costruiscono solo per le prove.
- **Un push su `main` che tocca `website/`, `design-system/` o `tools/site.py` ripubblica il sito.** Il push si fa
  solo su autorizzazione esplicita del proprietario, ogni volta.

## Come si lavora

**Visione del design (decisione del proprietario del 13/11/2026).** Prima il risultato più bello e vivo possibile,
funzionale per chi lo usa; poi l'ottimizzazione perché giri così com'è anche sui dispositivi datati, senza perdere
l'effetto. Tutto è vivo, armonioso, pragmatico e mai fine a sé stesso. WCAG non è un obiettivo, una soglia né una
motivazione, a nessun livello.

**Ricerca e qualità della soluzione**
- Prima di scegliere o implementare, cerca lo stato dell'arte nelle fonti ufficiali, mai a memoria.
- Il risultato deve essere il migliore per tecnologia, modalità ed efficienza, non «funziona e basta».
- **Sempre l'ultimissima versione di ogni dipendenza** (modelli, librerie, programmi, esportazioni; decisione del
  proprietario del 17/11/2026: «devi sempre usare l'ultimissima versione di qualunque dipendenza usi»). Prima di usarne
  una, verifica nelle fonti ufficiali che sia l'ultima alla data di oggi. Se l'ultima non si può avere (serve un account,
  manca un'esportazione, una licenza lo vieta), lo si dice subito al proprietario: non si lavora in silenzio su una vecchia.
- La prima idea non è necessariamente la migliore: almeno due alternative, smonta la preferita, poi conferma con
  una motivazione.

**Spiega prima di costruire**
- Prima di sviluppare qualunque cosa spiega bene che cosa e perché proprio adesso, e aspetta il via.
- Sfida lo scope: gli opzionali si rinviano, non si costruiscono di default.

**Verifica**
- Prove iterative, da capo a fondo e «come utente»: far girare davvero, non solo i test tecnici, fino al verde.
- Ogni modifica di interfaccia: prove funzionali, simulazione dell'utente, prove estetiche, visive e di UX, e vanno
  viste (con la finestra: video e foto degli stati chiave; dove non si può, foto di tutte le schermate,
  analizzate). I comandi di avvio dei server per le prove li esegue l'AI.
- Un bug si corregge alla causa, valutando gli impatti sull'intera codebase, non nell'ultimo miglio.
- A verde → commit → fase successiva. Versioni, rilasci e controlli: `CONTRIBUTING.md`, `docs/releasing.md`.

Con il proprietario si parla in italiano.
