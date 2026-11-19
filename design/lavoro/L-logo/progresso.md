# Incarico L-1 · Il logo: tre direzioni · progresso

Ruolo design-direction (skill `design-system-generator` 0.49.0). Incarico: `design/lavoro/incarichi/L-1-logo-tre-direzioni.md`.
Partenza HEAD `bf5909f`. Porte 8940 (siti costruiti) e 8941 (radice del repository per le pagine di prova), copie in `/tmp/l1-*`,
scrivo solo qui. Nessun commit, nessun push, nessun altro agente, un browser alla volta senza finestra (`free -m` prima).

**Stato: resa consegnata (19/11/2026).** Prossimo: giudizio (design-judge), una correzione, poi la scelta del proprietario.

## Il criterio di ambizione

Il marchio fa ciò che fa il programma. Nella barra del sito lo muove la voce vera della pagina: gli stessi istanti (la scrittura, le
parole, i picchi, l'inviluppo della registrazione) che muovono la riunione della home, così chi guarda vede il marchio parlare quando
parla Kalliope. Fermo, nei menu del computer, tiene in un segno solo un momento della catena «scrivi → la voce arriva agli altri, alla
pari». I marchi dei riferimenti e dei programmi simili sono segni fermi della voce in generale (barre: ElevenLabs, LALAL.AI, il
Kalliope di oggi; bolla con il nome: Grid; mascotte: Proloquo2Go); l'unico che vive con la voce, la sfera di ElevenAgents (R03), lo fa
nel suo pannello, non nella barra. **Per chi**: chi parla con Kalliope, che lo cerca fra le applicazioni prima di una riunione (32–96
px, chiaro o scuro, a volte con il puntamento oculare), e chi gli sta intorno e inoltra l'indirizzo (la scheda a 16 px). **Dove**:
barra del sito (vivo), scheda, menu, barra delle applicazioni, negozio, Dock (fermo). **Come si riconosce**: chi ha visto la home
ritrova nel marchio il gesto della riunione; coperto il nome, non si scambia con il logo di oggi.

## Le tre idee

1. **«Il cursore che parla»**: il cursore di chi scrive è la sorgente della voce; dalla riga che scrivi le onde vanno verso gli altri.
   Tratti pieni (cursore e due onde), a colori sul trasparente, sulla stanza del sito nella forma piena, **con l'inchiostro della
   pagina nella barra**; il cursore lampeggia mentre la home scrive, le onde seguono la voce e ripartono a ogni picco.
2. **«Il tuo posto, alla pari»**: il tuo riquadro nella riunione, da cui la voce si allarga a tutti alla stessa distanza. Quattro
   riquadri concentrici in quattro gradini di luce uguali, **a colori anche nella barra**; il tuo riquadro prende il bordo di chi parla
   e a ogni picco una luce passa verso l'esterno.
3. **«La frase che si accende»** (la bolla, ripensata e dichiarata): la frase che hai scritto è la bolla; le parole si accendono mentre
   la voce le dice. Bolla chiara con bordo lampone e due righe di parole, una detta e una no, **la bolla della home in piccolo nella
   barra**; le parole del marchio si accendono con quelle della bolla vera.

Differenze: metafora (scrivere / la riunione / il parlato), forma (tratti aperti / riquadri pieni concentrici / sagoma di bolla con
dentro le parole), colore (inchiostro e tre toni sulla stanza / quattro gradini piatti / chiaro, lampone e testo scuro della bolla),
vita nella barra (lampeggio e onde / bordo e luce che passa / parole che si accendono).

## Dove sta che cosa

- **Le tre direzioni insieme**: `direzioni/index.html` (criterio, idee e gli stessi contesti per le tre); foto `foto/index-intera.png`.
  Le pagine si aprono servendo la radice del repository (`node strumenti/con-server.mjs /workspace/kalliope 8941 -- …`).
- Per ogni direzione, in `direzioni/1-cursore/`, `2-posto/`, `3-frase/`:
  - **disegno** `disegno.svg` (libero, tela 128), `piena.svg` (macOS), `piccola.svg` (16 e 24 px), `simbolica.svg` (GNOME 16×16),
    generati da `modelli/*.svg` e `token.css` con `strumenti/genera.py`;
  - **token** `token.css`; **barra** `modelli/barra.svg`, `marchio.css`, `marchio.js`;
  - **pagina** `prova.html` (disegni, nome, barra vera, movimento, Firefox chiaro e scuro a 16 e 32, GNOME, KDE, barra delle
    applicazioni a 32 e 48, negozio a 64 e 128, Dock, scala 16–256 su chiaro/scuro/bordeaux, pixel per pixel);
  - **note** `idea.md` (idea, scelte e fonti di ogni valore, difetti, ICO e ICNS, non verificato);
  - **foto** `foto/barra/` (home 1440 e 390, barra a 3×, barra con l'azione, ar-XB, barra compatta, 1366×640, «non ancora»),
    `foto/prova-intera.png`;
  - **sequenze** `sequenze/barra-arrivo/` (lente 3×, 1440 e 390: video, foglio, fotogrammi), `barra-puntatore/`, `barra-ridotto/`,
    `arrivo-pagina/` (pagina intera a 1440 e 390).
- **Confronti**: `confronti/<direzione>/home-R01|R03|R51-ab|ba.jpg`, `barra-loghi-ab|ba.jpg` (con i marchi nelle barre dei
  riferimenti), `icone-simili-ab|ba.jpg` (con Proloquo2Go, Grid, ElevenAgents, LALAL.AI, Voiceitt, AssistiveWare); i fogli di base
  `confronti/simili.png`, `confronti/icone-<direzione>.png`, `foto/riferimenti/loghi-dei-riferimenti.png`.
- **Copie del sito** (non nel repository): `/tmp/l1-1-copia-4` → `/tmp/l1-sito-1-4`, `/tmp/l1-2-copia-2` → `/tmp/l1-sito-2-2`,
  `/tmp/l1-3-copia-2` → `/tmp/l1-sito-3-2`, ciascuna anche `-pseudo` (en-XA, ar-XB). `controlla-sorgenti.mjs` verde su tutte e tre
  (30 fogli, valori solo nei token). Prova di ICO: `/tmp/l1-icone-prova/<direzione>/kalliope.ico`.
- **Strumenti miei** (`strumenti/`): `env.sh`, `con-server.mjs`, `scatta.mjs`, `genera.py`, `prepara-sito.py`, `lente.html`,
  `gesto-lente.mjs`, `foglio.mjs`, `png.mjs`, `icone.html`.

## I difetti di ciascuna (dettagli in `idea.md`)

- **1 · cursore**: somiglia al simbolo del volume (e un po' al Wi-Fi); fra le icone piene pesa meno (tre tratti senza corpo); sul
  chiaro la seconda onda è tenue; da destra a sinistra le onde vanno verso il bordo, non verso il nome (regola: il marchio non si
  specchia); la simbolica ha le curve sfumate a 16 px.
- **2 · posto**: il più astratto, senza la home non dice «voce» (può sembrare «registra», «ferma» o un bersaglio); nella barra il suo
  rosa fa concorrenza al pulsante d'azione; la luce a ogni picco si vede solo nel video; la simbolica a 16 px è fitta.
- **3 · frase**: il più vicino ai segni che esistono (fermo si legge come un'app di messaggi, come Grid); a 16 px le parole spariscono
  e resta una bolla con due tratti; a 32 px il bordo è poco più di un pixel; vicino alla bolla della home può sembrare un pezzo della
  scena.
- **Tutte**: il movimento nella barra lo comandano sei chiamate aggiunte a `scena.js` nella copia (`marchio('inizia'|'env'|…)`); nel
  sito vero le scriverebbe la costruzione. Le altre pagine (stato, «non ancora», scelta della lingua) hanno il disegno e il gesto del
  puntatore, ma nessuna voce che lo muova. Le pagine vecchie (ascolta, installa…) non sono state toccate.

## Come le ho guardate accanto ai riferimenti, e che cosa ho corretto

- I marchi delle barre dei riferimenti ritagliati e messi accanto alla barra di ogni direzione (`barra-loghi`), la home accanto ai
  primi schermi di R01, R03 e R51 (`home-…`), le icone accanto a quelle dei programmi simili e a quella di oggi (`icone-simili`), e
  tutte nelle ricostruzioni con icone vere di programmi installati qui (Firefox, Chromium, GVim, ImageMagick, il Kalliope di oggi).
  Il segno compatto a sinistra del nome, alto circa due volte le maiuscole come la piastrella di ElevenAgents, regge il confronto in
  tutte e tre.
- Corretto guardando: la 1 nella barra stava staccata dal nome (tela intera) → disegno ritagliato ai suoi bordi; il suo gesto del
  puntatore (allargamento del 12%) non si notava → le onde ripartono dal cursore; il cursore che si spegneva del tutto lasciava il
  marchio senza il suo tratto → scende al 20%. A 16 px lo spessore sporcava i tratti e le parole diventavano una macchia → un disegno
  per le grandezze piccole in tutte e tre. La simbolica della 2 sembrava una casella di spunta → quattro livelli. La 3 aveva una
  parola di 10 px che diventava un'ellisse → due parole per riga.

## Ciò che non ho potuto rendere o verificare

- **I valori delle piattaforme** erano da memoria (un hook bloccava la ricerca in rete e l'incarico vieta altri agenti); **chi coordina
  li ha fatti verificare il 19/11/2026** e sono corretti con la fonte accanto (sezione «Correzione dei valori delle piattaforme»).
  Restano non pubblicati: il colore vero della barra di Windows (c'è il token di ripiego), l'accento predefinito di Windows
  (approssimazione), il materiale del Dock di macOS (inventato).
- Il Dock di macOS ha un fondo inventato, icone vicine segnaposto e una maschera a superellisse (approssimazione); l'ICNS non è
  provato (serve macOS). La griglia di GNOME a 96 px e il negozio sono ricostruzioni, non foto.
- Il movimento è provato solo in Chromium senza finestra e senza suono (orologio della scena); niente Firefox e WebKit sulla barra.
- La lente (`lente.html`) è mia: `sequenza.mjs` registra la pagina vera dentro una cornice ingrandita 3×. Per il gesto del puntatore
  dentro la cornice `sequenza.mjs` non basta (punta solo elementi della pagina esterna): l'ho registrato con `gesto-lente.mjs`, che fa
  la stessa cosa (fotogrammi, foglio, video) portando il mouse vero sul marchio.
- ImageMagick (7.1.1-43, quello della macchina) l'ho usato solo per provare l'ICO in `/tmp`; non è una dipendenza del progetto e non
  ho potuto verificare che sia l'ultima versione (rete bloccata).

## Correzione dei valori delle piattaforme (19/11/2026, su richiesta di chi coordina)

Corretti solo i valori delle ricostruzioni e il grigio delle simboliche, con la fonte accanto a ogni valore. **I loghi non sono
cambiati**: i file generati (`disegno`, `piena`, `piccola`, `simbolica`.svg) sono identici byte per byte (md5 prima e dopo `genera.py`).
- `direzioni/contesti/piattaforme.css`:
  - GNOME, libadwaita 1.10.0 `_colors.scss`: confermati `#fafafb` (r. 32), `#222226` (r. 95), `#ffffff` (r. 61), `rgb(0 0 6 / 80%)`
    (r. 33); la scheda scura passa da `#36363a` a `rgb(255 255 255 / 8%)` (r. 123). GNOME Shell 51.1: la griglia è sempre scura,
    `#222226` anche con il tema chiaro; 96 px è la misura massima, la griglia scende a 64, 48 o 32 (`iconGrid.js`).
  - KDE, Breeze v6.8.3 `BreezeLight.colors`: confermati `#eff0f1`, `#232629`, `#3daee9`; la vista passa da `#fcfcfc` (che è
    `[Colors:Button]`) a `#ffffff` (`[Colors:View]`, r. 115).
  - Windows 11: `#f3f3f3` e `#202020` tenuti e scritti per quello che sono, il token `SolidBackgroundFillColorBase` (ripiego di Mica,
    `microsoft-ui-xaml`, commit `905a4f6c`); il colore vero della barra non è pubblicato. Gli accenti `#005fb8` e `#60cdff` tenuti
    come «approssimazione, non verificato».
  - macOS: scritto che Apple non pubblica il materiale del Dock (HIG «Materials»); resta inventato.
- **Il grigio delle simboliche**: tengo `#2e3436`, il colore dei simboli di Adwaita (`GNOME/adwaita-icon-theme`, commit `2066120e`,
  per esempio `open-menu-symbolic.svg`), perché è quello delle simboliche installate accanto alla nostra; il `#222222` del modello
  ufficiale delle icone delle app (`HIG-app-icons`, `template.svg`, commit `3535fe98`) è scritto come alternativa. GTK le ricolora
  comunque. Fonte scritta nei commenti di `--d1-simbolo`, `--d2-simbolo`, `--d3-simbolo` (valore invariato) e in `idea.md`.
- Aggiornati i testi che dicevano «da memoria»: `idea.md` (tabella dei colori e «Non verificato»), `prova.html` e `index.html`
  (le note in cima), `contesti.js` (i titoli di GNOME, Windows e Dock), `contesti.css` (la tinta della vetrina del negozio, inventata).
- Foto rifatte, in file nuovi accanto a quelle di prima: `foto/index-intera-2.png`, `direzioni/<n>/foto/prova-intera-2.png`. Cambiano
  il menu di KDE (vista bianca), la scheda scura del negozio e i titoli; GNOME, Firefox, la barra di Windows e la scala restano
  uguali. Le foto della barra vera e le sequenze non dipendono da questi valori.

## Ultimo comando
- `node con-server.mjs /workspace/kalliope 8941 -- node scatta.mjs /tmp/l1-el-prova3.json` (con `source strumenti/env.sh`)

## Problemi aperti
- Per chi coordina: decidere se le sei chiamate a `scena.js` (e il componente `marchio.css`) entrano nel sistema dopo la scelta.
