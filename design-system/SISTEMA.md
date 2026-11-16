# SISTEMA · il design system di Kalliope

Ricavato dalla home nella direzione scelta (D2 «Alla pari, in riunione») **senza cambiarne l'aspetto**: ogni valore del foglio di stile della home è qui con lo stesso valore, un nome e un posto. Nessuno ha deciso un colore, un carattere, una curva o una durata nel ricavarlo.

Sta in questa cartella, fuori dal sito, perché dovrà servire anche all'applicazione. Oggi lo usa una sola superficie: la home del sito (`website/index.html`). Le altre pagine del sito (ascolta, stato, installa, in riunione, aiuto, non ancora) hanno ancora l'aspetto di prima, con i loro fogli in `website/stile/`; l'applicazione non lo usa ancora.

## Che cosa c'è e dove

- `token.css`: la fonte unica dei valori, **705 token** e i `@font-face`. I file dei caratteri stanno in `caratteri/` (Lexend e DejaVu Sans, ciascuno con la sua licenza accanto).
- `base.css` e 14 componenti in `componenti/` (barra, pulsanti, apertura, bolla, riunione, finestra, riunione-app, ascolto, errori, filo, strada, tratti, piede, arrivo).
- `TOKEN.md`: per ogni token valore, ruolo, dove è usato; le 23 soglie delle larghezze; «Da decidere»; ciò che non è stato portato.
- `catalogo/` (`index.html`, `catalogo.js`, `catalogo.css`): la tabella dei token è letta da `token.css` all'apertura; colori, caratteri e scala, spazi/forme/raggi/ombre; ogni componente (copiato dalla home vera) con varianti e stati; inventario del movimento con «Riproduci» e «Ferma»; la home viva a tre larghezze; «Non ancora».
- `metodo.config.mjs`: la configurazione di `controlla-sorgenti.mjs` (i valori stanno solo nei token), da lanciare da questa cartella.

**Come arriva nel sito.** `tools/site.py` copia questa cartella dentro il sito costruito come `design-system/` (senza i documenti `.md` e la configurazione). La home collega `design-system/token.css`, `design-system/base.css` e i componenti: è completa solo nel sito costruito, non aprendo `website/index.html` dalla cartella. Il catalogo si apre nel sito costruito, a `design-system/catalogo/`, perché legge la home vera (`../../index.html`). Per vederli: `docs/releasing.md`, «Website».

**Perché 705 token:** è una trascrizione fedele, non una riprogettazione: ogni valore diverso della pagina (128 colori, 55 grandezze e interlinee di testo, 266 misure e spazi, 78 durate e 36 ritardi, 24 ombre, 22 raggi, 24 livelli, 20 fondi e gradienti, 11 opacità e filtri, 6 curve, 4 pesi, 4 filetti, 25 pose, 2 caratteri) è un token, perché unire valori quasi uguali cambierebbe l'aspetto. Un valore uguale in più componenti nella stessa famiglia (testo, raggi, spazi, misure) è un gradino di scala numerato (`--corpo-7`, `--spazio-10`: il numero è il posto, non il valore); il resto ha il nome del componente (`--bolla-corpo-spazio-interno`) o del ruolo (`--bordo-cornice`, `--durata-pillola`). Le 36 dichiarazioni sovrascritte e le 45 regole senza elemento (sezioni vecchie) non sono portate: elenco in `TOKEN.md`.

## Come si usa per un'altra pagina

1. Collega `design-system/token.css`, `design-system/base.css` e solo i componenti che servono, nell'ordine in cui li collega la home: è l'ordine del foglio da cui vengono. Nella prova è stato verificato sulla home che nessuna coppia di regole di file diversi, a pari specificità, riguardi lo stesso elemento con l'ordine invertito; su una pagina nuova va riguardato.
2. Ogni valore passa dai token (`var(--voce)`, `var(--durata-pillola)`, `var(--entra)`); se manca si aggiunge a `token.css` con il suo ruolo, non alla regola. `controlla-sorgenti.mjs`, da questa cartella, dice se è rimasto un valore a mano.
3. Varianti e stati dei componenti: il catalogo, «Componenti». Una variante nuova entra nel file del componente.
4. `token.css` e `TOKEN.md` da qui in poi si modificano a mano: gli strumenti con cui sono stati ricavati dalla home non sono in questo repository, e rilanciati riscriverebbero tutto dal foglio di partenza.

## Che cosa è provato

**Prima dello spostamento, nella prova (15/11/2026).** Il sistema è stato confrontato con la home scelta dal proprietario, in Chromium senza finestra, con l'orologio della scena fermato e avanzato a mano: foto confrontate punto per punto, poi stili calcolati di ogni elemento e animazioni. 88 foto, a 1440×900, 390×844, 820×1180 e 1366×640, ciascuna a riposo, dopo aver scorso la pagina, con l'ascolto aperto, con una frase che suona, con l'errore dell'audio, con il menu aperto (390 e 820) e con «riduci movimento».
- **74 su 88 a 0 pixel diversi.**
- **14 foto con pixel diversi, non conclusive**: dove la voce suona le barre e la luce differiscono al terzo decimale (la pagina confrontata con sé stessa dà lo stesso rumore); errore a 390 e 820 (9–16 px, scarto 2 su 255); le ultime schermate dello scorrimento a 1440 e 1366 (92–97 px); e 820×1180 a riposo e nelle prime due schermate dello scorrimento (fino a 128992 px), con differenze solo in valori guidati dall'orologio della scena. Su quest'ultimo caso un controllo a parte ha dato 0 pixel con «riduci movimento», e con il movimento differenze dello stesso ordine della pagina confrontata con sé stessa.
- Le foto e gli esiti di quelle prove sono rimasti nella cartella della prova, fuori da questo repository.

**Dopo lo spostamento in questo repository (16/11/2026).** Il sito costruito da `tools/site.py` è stato confrontato con la home della prova, con lo stesso strumento:
- con «riduci movimento», a riposo e a ogni schermata dello scorrimento: **0 pixel diversi** a 390×844 e 820×1180; a 1440×900 e 1366×640 0 pixel ovunque tranne una schermata ciascuna con 8 pixel (scarto 2–3 su 255) e 0 proprietà calcolate diverse;
- stati aperti a 390×844: menu 0 pixel; errore dell'audio 16 pixel (scarto 2); ascolto e frase che suona con il solo rumore delle barre della voce. A 1440×900 ascolto ed errore a 0 pixel;
- le sei pagine interne e la pagina 404 costruite sono identiche, byte per byte, a quelle di prima;
- home, catalogo e una pagina interna aperti nel sito costruito: 0 errori in console, 0 richieste fallite, i collegamenti della home rispondono, la voce parte; il catalogo legge 705 token;
- `controlla-sorgenti.mjs`: **verde**, «16 fogli di stile, valori solo nei token».

## Da decidere

1. **Valori quasi uguali che potrebbero essere lo stesso ruolo** (elenco in `TOKEN.md`): colori con lo stesso rgb e opacità a 0,06 o meno (33 coppie; bordi in rosa chiaro a 0,10 / 0,12 / 0,14 / 0,20 / 0,22 / 0,30 / 0,34 / 0,35 / 0,40; testi a 0,60 … 0,90), gradini a 1 px (corpo 8 coppie, interlinea 7, raggi 5, spazi 13, misure 1), durate a 40 ms (17 coppie). Unendoli si risparmierebbero **al più circa 84 token** (33 colori, 34 gradini, 17 durate; ogni catena conta uno in meno del numero dei suoi elementi), a costo di cambiare l'aspetto di poco.
2. **`<meta name="text-scale" content="scale">`**: `controlla-sorgenti.mjs` la pretende in ogni pagina costruita; la home non l'ha e non è stata aggiunta (può cambiare la pagina su Android con il testo ingrandito, e non è stato provato). Nella configurazione il controllo copre solo il catalogo, che ce l'ha.
3. Nomi a numero delle scale; testo in px (non segue la grandezza del testo di sistema); `scena.js` e HTML con valori non tokenizzati (`ENTRA`, durate delle animazioni dello script, colori delle onde, colori del marchio, `theme-color`); `.f-stato.allarme` definito e mai usato; le sezioni di `TOKEN.md` «Spazi» e «Misure» mescolano gradini e misure di componente (le scale di spazi stanno sotto «Misure»).
4. **Per l'applicazione**: i token sono scritti come variabili CSS. Come portarli nell'applicazione (che non usa CSS) non è deciso né fatto.

## Non verificato

- Solo Chromium, solo quattro misure; niente Firefox e WebKit per il sistema. Nessuna matrice dei dispositivi.
- Hover, fuoco e premuto reali non confrontati foto per foto (le regole `:hover`/`:active`/`:focus-visible` sono identiche per costruzione); nel catalogo si vedono forzati.
- La voce vera nel confronto: lì l'audio è finto, con orologio virtuale. Nel sito costruito la voce vera è stata fatta partire una volta, senza ascoltarla.
- Il confronto di geometria con la scelta del proprietario (`confronta-scelta.mjs`) sui file finali; le foto dell'arrivo a 820 e 1366; il catalogo ad altre larghezze e in altri motori; le prestazioni (16 fogli di stile invece di uno).
- La pubblicazione su GitHub Pages con questa disposizione: provata solo costruendo il sito in locale.

## Che cosa il catalogo non copre

Persone e percorsi di tutto il sito; anteprime dei compiti oltre la home; icone e immagini (solo marchio e figure); interazioni (tastiera, tocco: provate sulla home, non qui; gli stati qui sono forzati); dati e media (nessun audio); accessibilità e testo grande; prestazioni e canali; provenienza e decisioni (la direzione è in `design/direzione-2/`); i quindici dispositivi nei tre motori (qui tre larghezze vive); gli esiti letti dai log; lingue. Il catalogo non si dichiara completo: l'elenco con i motivi è in fondo alla sua pagina («Non ancora»).
