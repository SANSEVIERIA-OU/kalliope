# CLAUDE.md — Kalliope

Questo file comanda per tutto il repository, anche per Codex (`AGENTS.md` rimanda qui). Le decisioni datate sono
del proprietario e prevalgono su note di memoria, documenti di stato e piani più vecchi.

Kalliope è un programma per il computer per chi non può parlare o fa fatica: scrivi una frase e una voce italiana la
dice in un microfono virtuale, per Zoom, Teams, Meet e gli altri. Che cosa fa e come si costruisce: `README.md`,
`CONTRIBUTING.md`, `docs/`. Questo file dice ciò che lì non c'è: da dove si riparte sul sito e sul design system, e
come si lavora.

## Il sito e il design system: da dove si riparte

**Stato al 16/11/2026.** Aggiorna questa sezione ogni volta che lo stato cambia.

- **Il sito è `website/`** (prima si chiamava `site/`). La home è quella nuova, nella direzione 2 «Alla pari, in
  riunione», scelta dal proprietario il 14/11/2026 fra tre direzioni rese.
- **Le altre pagine non sono ancora state rifatte.** Ascolta, stato, installa, in riunione, aiuto, «non ancora» e
  la pagina 404 hanno l'aspetto di prima, con i loro fogli in `website/stile/`, gli script in `website/script/` e
  il vecchio catalogo in `website/sistema/`. Restano solo perché la home nuova rimanda a loro.
- **Il design system è `design-system/`**, fuori dal sito: token, base, componenti, caratteri, catalogo vivo,
  `SISTEMA.md` e `TOKEN.md`. Oggi lo usa solo la home.
- **In linea c'è ancora il sito di prima** finché il proprietario non dice di pubblicare.

**«Riprendiamo dal sito» vuol dire questo, e non altro:** rifare le altre pagine nella direzione 2, sopra
`design-system/`, partendo dalla home nuova. Non vuol dire riprendere il lavoro del 12/11/2026.

1. Leggi, in quest'ordine: `design/direzione-2/LEGGIMI.md`, `design-system/SISTEMA.md`,
   `design/direzione-2/CONTENUTI.md`, `design/direzione-2/D2.md`.
2. Prima di rendere una pagina, i contenuti: `CONTENUTI.md` elenca 15 voci del documento di progetto che nella
   home si sono perse e 8 da chiedere al proprietario; fra le mancanze che lui ha visto c'è la parte sulla
   campionatura della propria voce. Che cosa dice il sito lo decide il proprietario: si chiede, non si inventa.
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

## Come si costruisce e si pubblica il sito

- `python3 -I tools/site.py --out DIR` costruisce il sito: copia `website/`, ci mette `design-system/` e riempie i
  segnaposto della versione (`{{kalliope.version}}` e gli altri). Le pagine non scrivono mai una versione a mano.
- La home è completa solo nel sito costruito: i suoi stili arrivano da `design-system/`. Per vederla:
  `docs/releasing.md`, «Website».
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
