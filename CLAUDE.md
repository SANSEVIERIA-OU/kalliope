# CLAUDE.md — Kalliope

Questo file comanda per tutto il repository, anche per Codex (`AGENTS.md` rimanda qui). Le decisioni datate sono
del proprietario e prevalgono su note di memoria, documenti di stato e piani più vecchi.

Kalliope è un programma per il computer per chi non può parlare o fa fatica: scrivi una frase e una voce italiana la
dice in un microfono virtuale, per Zoom, Teams, Meet e gli altri. Che cosa fa e come si costruisce: `README.md`,
`CONTRIBUTING.md`, `docs/`. Questo file dice ciò che lì non c'è: da dove si riparte sul sito e sul design system, e
come si lavora.

## Dove conservare i materiali locali

Gli strumenti di prova e i dati di Kalliope si tengono nella cartella del progetto. Playwright, i browser e gli strumenti
per i caratteri stanno in `materiali-locali/playwright/`. I campioni vocali, i modelli e i dati delle prove stanno in
`materiali-locali/prove-voce/`. Git ignora `materiali-locali/` per tenere questi file su questa macchina.

## Il sito e il design system: da dove si riparte

**Stato al 27/11/2026.** Aggiorna questa sezione ogni volta che lo stato cambia.

- **Il sito è `website/`** (prima si chiamava `site/`). La home è quella nuova, nella direzione 2 «Alla pari, in
  riunione», scelta dal proprietario il 14/11/2026 fra tre direzioni rese.
- **«non ancora» è rifatta** nella direzione 2 (mostrata al proprietario il 17/11/2026) e fissa la cornice delle pagine
  interne (`website/cornice.js`, `design-system/componenti/pagina.css`). La pagina della scelta della lingua (`/`) è
  nuova anche lei.
- **«stato» è rifatta** nella direzione 2 e approvata dal proprietario il 19/11/2026 («ok per tutto»).
- **«installa» è rifatta** nella direzione 2, approvata dal proprietario il 20/11/2026 («va bene», vista senza giudice per sua
  scelta) e pubblicata lo stesso giorno («pubblica tutto»). Restano aperti i nove punti d'aspetto della costruzione
  (`design/lavoro/3c-installa/costruzione/progresso.md`, «Consegna della ripresa»). Il 26/11 la scelta del pacchetto precede la scena anche sul telefono alto, e il menu resta raggiungibile a forte ingrandimento.
- **Il logo nuovo** (decisione del proprietario del 19/11/2026: «rifarei il logo perché con il nuovo sito c'entra poco»):
  fra tre direzioni rese e giudicate il proprietario ha scelto la 3, «La frase che si accende», una bolla metà piena (detto)
  e metà tratteggiata (non ancora detto) (`design/lavoro/L-logo/`). È in `design-system/marchio/`, generato dai token da
  `tools/marchio.py`: la costruzione lo mette nella barra di ogni pagina e nell'icona della scheda, i pacchetti lo installano
  come icona del programma. Il verde del logo di prima non c'è più (la nota di `design/direzione-2/D2.md` è superata).
- **Pubblicare** (19/11/2026): il proprietario ha detto di «cominciare a mergiare in main e caricare il nuovo sito». Il sito
  nuovo va in linea con le pagine fatte; le altre arrivano una alla volta.
- **Commit, push e release senza chiedere** (decisione del proprietario del 26/11/2026, che supera le regole «ogni push si chiede»
  più sotto): «man mano che sviluppi, TESTI (e2e e personas come "utente deficiente", compreso test di UX e UI GUARDANDO) e tutto
  funziona e ti soddisfa, per me puoi fare commit e push e nuova release». Vale per i commit, il push su `main`, la ripubblicazione
  del sito, le release con AUR e il caricamento nella release `assets`. La condizione è sempre la stessa: prove da capo a fondo
  sul programma o sul sito veri, il giro con le personas di #20 (compreso il principiante che non legge e sbaglia), prove di UX e
  UI con foto e video guardati, e un risultato che soddisfa. Le scelte d'aspetto restano del proprietario: la direzione resa si
  mostra prima di costruirla.
- **Il sito completo ha il via alla pubblicazione del 26/11/2026.** La guida «In riunione»
  comprende la ricerca di «Aiuto». «Ascolta» apre i tre campioni della home, con Giulia e Marco. I vecchi indirizzi
  passano dalle regole di `website/rimandi.json`. La 404 usa gli stili condivisi e funziona anche a indirizzi profondi.
- **Il proprietario ha approvato i colori il 26/11/2026.** La home usa fondi grafite, accenti verde acqua e tinte distinte per i partecipanti. Il logo conserva i suoi colori.
- **Il design system è `design-system/`**, con token, base, componenti, caratteri e catalogo vivo. Lo usano tutte le
  pagine del sito. Gli alberi `website/stile/`, `website/script/` e `website/sistema/` sono ritirati.
- **La home su GitHub Pages** è <https://sansevieria-ou.github.io/kalliope/it/>. **Il 27/11/2026 è stata pubblicata la 0.3** per Linux: la finestra nuova «La frase che si accende», la voce propria creata nell'app (registrata o importata, anche dai vocali Opus), la cronologia salvata, la modalità riunione, il testo regolabile, i difetti della 0.2 corretti. Il sito offre la 0.3 e AUR ha `kalliope-bin 0.3-1` (la ricerca di AUR può mostrare per qualche ora la versione prima). [Release](https://github.com/SANSEVIERIA-OU/kalliope/releases/tag/v0.3). **Lo stesso giorno è stata pubblicata la 0.4**: programma e sito nelle 30 lingue (finestra specchiata per arabo e urdu, un carattere per scrittura, le voci sempre solo italiane), la finestra che sta negli schermi piccoli e ricorda dove la si è lasciata, le parole accese quando si sentono, Kalliope che finisce con la sua finestra (#22–#27; #8 verificato su mutter). AUR `kalliope-bin 0.4-1`. [Release](https://github.com/SANSEVIERIA-OU/kalliope/releases/tag/v0.4). Seguiti aperti, scelte del proprietario: la voce del menu delle applicazioni tradotta solo in inglese e italiano; in urdu la frase italiana della bolla eredita l'interlinea del nastaliq; nelle finestre minime i passi della voce propria scorrono sotto la barra fissa; l'uscita fino a ~2 s se la finestra è distrutta mentre la voce parla (`RunOptionsSetTerminate`).
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
  l'aggiornamento in `docs/releasing.md`. La release `assets` va creata prima del push, perché la CI scarica da lì (caricare e
  pubblicare: vedi «Commit, push e release senza chiedere»). Le dipendenze del programma si portano tutte all'ultima versione («si, aggiorniamo
  tutto», P-1).
- **Rilasci e AUR** (scelte del proprietario del 20/11/2026, fra le alternative proposte dopo la ricerca, `design/lavoro/ricerca/rilasci.md`).
  - Le release si fanno con il nostro strumento: `tools/version.py` e `CHANGELOG.md` scritto a mano per chi usa Kalliope.
  - Partono da sole quando la versione cambia su `main`, come in Kalipso.
  - Niente più versioni di prova: «ogni passo è finale», e la prossima release è la 0.1, marcata latest.
  - Su AUR va `kalliope-bin`, solo con le versioni finali, pubblicato dalla release con una chiave SSH dedicata a Kalliope. La chiave
    sta nel secret `AUR_SSH_KEY` e in copia nel `.env`; la parte pubblica sta nel profilo AUR del proprietario.
  - La ricetta su AUR (PKGBUILD e `.SRCINFO`) resta sotto la SANSEVIERIA 1.1 come il resto del repository, non 0BSD (scelta del
    proprietario del 20/11/2026).
  - La 0.1 è pubblicata su GitHub dal 20/11/2026 e su AUR dal 26/11/2026 come [kalliope-bin 0.1-1](https://aur.archlinux.org/packages/kalliope-bin).
  - Per un repository pubblico GitHub Actions è gratuito. Una release parte con un push su `main` che cambia la versione (dal
    26/11/2026 senza chiedere, alle condizioni di «Commit, push e release senza chiedere»).
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
- **L'applicazione ha l'identità di Kalliope** (decisioni del proprietario del 26/11/2026, dopo aver provato la 0.2 e averla
  giudicata «orripilante»). La finestra della 0.2, fatta con Codex, imitava GTK/libadwaita su GNOME (uno script Python lanciato dal
  programma) e Qt altrove: è superata. Ora:
  - un aspetto suo, dai token di `design-system/` come il sito, con tema chiaro e scuro che seguono il sistema; una sola
    interfaccia Slint per Linux, Windows e macOS, senza Python e senza il backend Qt. Il metro di qualità è la finestra di Kalipso
    (le idee, non il codice);
  - il ponte approvato: la compilazione legge `design-system/token.css` e genera per Slint tutti i valori della finestra (colori
    chiari e scuri, caratteri, raggi, spazi, tempi); la CI rifiuta colori, misure e tempi scritti a mano nei `.slint`; ciò che
    manca al sistema (il tema chiaro, per esempio) si aggiunge al sistema con il suo ruolo;
  - la voce propria si crea nell'app, registrandola dal microfono o importando un file audio;
  - subito anche: una grande area di scrittura dove Invio parla (niente a capo: «ha poco senso andare a capo»), la modalità
    riunione compatta, il testo regolabile, la cronologia salvata. Rinviate: le frasi pronte.
  - **Direzione della finestra approvata dal proprietario il 26/11/2026** («per me va tutto bene»): «La frase che si accende»
    (`design/lavoro/4-app/direzione/direzione.md`), resa, giudicata (`design/lavoro/4-app/giudizio/giudizio.md`) e corretta una
    volta; i video e il catalogo visti dal proprietario sono in `design/lavoro/4-app/direzione/per-il-proprietario/`. È il termine
    di confronto della costruzione.
  - Attribuzione a Slint (decisione del proprietario del 26/11/2026): entrambe le forme ammesse dalla licenza, il widget
    `AboutSlint` in «Informazioni» e il distintivo ufficiale «Made with Slint» sulla pagina «installa» (issue #21).
  - Il lavoro si segue nelle issue della milestone 0.3 (coordinamento in #20, personas e protocollo di verifica lì): ogni issue
    si chiude solo dopo test automatico, prova e2e, giro con le personas e risultato guardato. Il proprietario vede la
    direzione resa prima della costruzione, e la finestra finita prima del rilascio.
- I valori condivisi hanno una sola fonte, senza copie a mano nelle finestre. Ogni nuovo valore di progetto entra nel sistema.
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
  scelta della lingua. **L'applicazione è pronta anche lei** (27/11/2026, #25): ogni testo della finestra passa dal catalogo unico
  (`crates/i18n`), la lingua è quella del sistema, la finestra si specchia per arabo e urdu, ogni testo breve ha la nota per chi
  traduce.
- **Le traduzioni le fa Codex** (decisione del proprietario del 27/11/2026: «il codice lo fai tu ma tutte le traduzioni le fai
  fare a codex»). Claude scrive il codice, i controlli e le istruzioni; Codex traduce e rilegge, con le foto della finestra
  nella sua lingua. Come si è fatto la prima volta, con le istruzioni e le note di ogni lingua: `design/lavoro/5-traduzioni/`.
  Le 29 lingue sono pubblicate dal 27/11/2026 con la 0.4.

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
- **Un push su `main` che tocca `website/`, `design-system/` o `tools/site.py` ripubblica il sito.** Dal 26/11/2026 il
  push non si chiede più, alle condizioni di «Commit, push e release senza chiedere».

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
