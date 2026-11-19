# Incarico L-1 · Il logo: tre direzioni · progresso

Ruolo design-direction (skill `design-system-generator` 0.49.0). Incarico: `design/lavoro/incarichi/L-1-logo-tre-direzioni.md`.
Partenza HEAD `bf5909f`. Porte 8940 (siti costruiti) e 8941 (radice del repository per le pagine di prova), copie in `/tmp/l1-*`,
scrivo solo qui. Nessun commit, nessun push, nessun altro agente, un browser alla volta senza finestra (`free -m` prima).

**Stato: correzione dopo il giudizio consegnata (19/11/2026).** Prossimo: secondo sguardo del giudice, poi la scelta del proprietario.

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
   Dopo il giudizio la riga scritta sta davanti al cursore. Tratti pieni (riga, cursore e due onde), a colori sul trasparente, su una piastrella magenta nella forma piena, **con l’inchiostro della
   pagina nella barra**; il cursore lampeggia mentre la home scrive, le onde seguono la voce e ripartono a ogni picco.
2. **«Il tuo posto, alla pari»**: il tuo riquadro nella riunione, uguale a quelli degli altri, da cui la voce raggiunge tutti (frase
   ritoccata dopo il giudizio). Dopo il giudizio: quattro riquadri uguali con una persona ciascuno, il tuo buio con il bordo di chi
   parla, **a colori anche nella barra**; a ogni picco i riquadri degli altri si accendono. (Prima: riquadri concentrici.)
3. **«La frase che si accende»** (la bolla, ripensata e dichiarata): la frase che hai scritto è la bolla; le parole si accendono mentre
   la voce le dice. Dopo il giudizio: la bolla detta a metà, piena con le parole dove è detta e tratteggiata dove non lo è ancora;
   nella barra il fronte avanza con le parole della bolla vera. (Prima: bolla chiara con bordo lampone e due righe di parole.)

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

## Problemi aperti
- Per chi coordina: decidere se le sei chiamate a `scena.js` (e il componente `marchio.css`) entrano nel sistema dopo la scelta.

## Correzione dopo il giudizio (19/11/2026)

Giudizio: `giudizio/giudizio.md` (letto tutto, con i fogli in `giudizio/fogli/`). Una correzione per direzione, solo bloccanti e
importanti (più i minori della 1 che si correggevano senza cambiare l'idea), ognuna dentro la sua idea; le tre restano diverse.
**Copia di partenza salvata** prima di toccare: `prima-del-giudizio/<direzione>/` (modelli, token, componenti, disegni, `idea.md`) e
`prima-del-giudizio/contesti.js`. Le foto e le sequenze di prima restano dove erano; le nuove stanno accanto: `foto/barra-2/`,
`foto/fra-le-icone-2.png`, `sequenze-2/`. Porte: 8941–8943 erano occupate da altri, uso 8944 (siti) e 8946 (repository).

### 1 · «Il cursore che parla»
- **Importante, il simbolo del volume** → davanti al cursore c'è ora **la riga scritta** (una pillola bassa, sulla linea delle
  lettere); il cursore è alto quanto una riga di testo e più alto delle onde, che sono più corte: «scrivi → cursore → voce», da
  sinistra a destra. Nel simbolo del volume niente sta a sinistra in basso e le onde superano ciò che suona. Simbolica provata a 16,
  24 e 48 px accanto al volume di Adwaita e a «volume_up» di Material (`direzioni/1-cursore/foto/fra-le-icone-2.png`).
- **Minori, corretti**: il marchio non sembra più spento all'arrivo (cursore che lampeggia fra 100% e 55%, onde al 60%; in più la riga
  cresce fino al cursore mentre la home scrive); tre toni medi che reggono su chiaro e scuro (`#d82762`, `#ed537c`, `#ed7c94`);
  forma piena su una piastrella magenta `#d82762` invece della stanza bordeaux, che spariva sullo scuro.
- **Resta**: le onde restano onde, «suono» si legge ancora; a 16 px la riga è un trattino di 3 px.

### 2 · «Il tuo posto, alla pari»
- **I quattro importanti** (non dice niente; «ferma», «registra», Square; movimento invisibile) venivano tutti dalla forma
  concentrica: **la forma è cambiata, l'idea no**. Ora è la riunione della home vista dal tuo posto: quattro riquadri uguali con una
  persona ciascuno; il tuo è buio come «Tu» e ha il bordo di chi parla. La frase dell'idea è ritoccata: «Il tuo riquadro nella
  riunione, uguale a quelli degli altri, da cui la voce raggiunge tutti» (prima: «… da cui la voce si allarga a tutti alla stessa
  distanza»).
- **Il movimento si vede a 36 px**: a ogni picco i riquadri degli altri si accendono interi, uno dopo l'altro; il bordo del tuo
  segue la voce.
- **Il prezzo, da dire al proprietario**: ora può sembrare un'app di videochiamate; a 16 px è «quattro persone». La persona disegnata
  va guardata con la regola di GNOME sui personaggi (per me è un segno, non un personaggio).

### 3 · «La frase che si accende»
- **Bloccante e importanti** (una chat fra le chat, la sagoma del logo di oggi, l'idea solo in movimento) → la bolla ora è **detta a
  metà**: la parte detta piena con le parole chiare, il fronte della voce curvo, **la parte non ancora detta solo come contorno
  tratteggiato**, il «non ancora» del sito. Ferma, a 32 e 48 px, nessuna app di messaggi le somiglia, non è la sagoma piena di oggi,
  e «detto / non ancora» arriva nei menu (`direzioni/3-frase/foto/fra-le-icone-2.png`). Nella barra il fronte avanza con le parole.
- **Provate e scartate guardandole**: metà vuota (una «D»), riempimento a quarto di cerchio dalla coda (il simbolo «cast»), metà
  piena e metà chiara con le parole (a 48 px una chat con «sta scrivendo»), bolla larga a striscia (sempre una chat).
- **Resta**: è ancora una bolla; il tratteggio può leggersi «bozza»; a 16 px il tratteggio si sfuma.

### Le prove nuove (accanto alle vecchie)
- **Fra le icone vere del genere, alla stessa misura**: `direzioni/<n>/foto/fra-le-icone-2.png` (dieci app di messaggi e otto di voce
  da Flathub a 48 e 32 px su chiaro e scuro, la simbolica fra i simboli di Adwaita e Material a 16, 24 e 48 px, e in fondo il disegno
  prima e adesso accanto al logo di oggi); pagina `strumenti/fra-le-icone.html`, con le icone scaricate dal giudice, solo lette.
- **La barra vera**: `direzioni/<n>/foto/barra-2/` (1440, 390, con l'azione, ar-XB, compatta, 1366×640, «non ancora»), dalle copie
  `/tmp/l1-sito-1-5`, `/tmp/l1-sito-2-3`, `/tmp/l1-sito-3-4` (e `-pseudo`).
- **Le sequenze**: `direzioni/<n>/sequenze-2/` (arrivo con la lente 3× a 1440 e 390, puntatore, movimento ridotto, arrivo a pagina
  intera a 1440 e 390).
- **Le pagine**: `prova.html` e `index.html` puntano alle prove nuove e hanno la sezione «Fra le icone vere»; foto
  `direzioni/<n>/foto/prova-intera-3.png`, `foto/index-intera-3.png`.
- **Gli schizzi delle correzioni** (in `/tmp/l1-schizzi/`, fuori dal repository): `c1.png`–`c4.png`, `simb3.png`.
- `controlla-sorgenti.mjs` verde sulle tre copie nuove (30 fogli, valori solo nei token).

- **Un difetto trovato guardando le sequenze e corretto**: nella 3 il fronte della voce, a frase detta, *scorreva* invece di
  *crescere* (restava una «D» senza coda e senza parole: `sequenze-2/barra-puntatore`, prima registrazione). Il campo della parte detta
  ora si estende a sinistra della tela; copia rifatta (`/tmp/l1-sito-3-4`) e sequenze di arrivo e del puntatore registrate di nuovo.
- **ICO** rifatto con i disegni nuovi: `/tmp/l1-icone-prova-2/<n>/kalliope.ico` (16 e 24 da `piccola.svg`, 32, 48, 256 da
  `disegno.svg`, con il canale alfa).

### Ciò che non sono riuscito a correggere, o che ha un prezzo
- **1**: le onde restano onde; chi conosce il simbolo del volume vede «suono» (ed è giusto). A 16 px la riga è un trattino.
- **2**: uscita dal «comando», entra nel rischio opposto, sembrare un'app per videochiamate. Il proprietario deve saperlo.
- **3**: è ancora una bolla, anche se nessuna è detta a metà e tratteggiata; il tratteggio può leggersi «bozza». A 16 px si sfuma.
- **Tutte**: il mondo di colore è lo stesso (chi coordina: lo dice lui al proprietario). Non ho rifatto le coppie con `affianca.mjs`
  contro R01, R03 e R51 (le aveva rifatte il giudice; il confronto nuovo è fra le icone vere del genere, come ha chiesto chi coordina).
  Solo Chromium senza finestra, senza suono.

## Ultimo comando
- `node con-server.mjs /workspace/kalliope 8946 -- node scatta.mjs /tmp/l1-el-prova4.json` (con `source strumenti/env.sh`)
