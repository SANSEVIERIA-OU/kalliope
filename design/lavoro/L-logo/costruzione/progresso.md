# Incarico L-3 · Il logo scelto nel design system, nel sito e nei pacchetti · progresso

Ruolo costruzione (skill `design-system-generator` 0.49.0). Incarico: `design/lavoro/incarichi/L-3-logo-nel-sistema.md`.
Partenza: HEAD `6820fc7`, albero pulito salvo `design/STATO.md` (di altri, non si tocca). Porte 8960–8969. Nessun commit, nessun push.

**Stato (20/11/2026): CONSEGNATO. Unità 1–6 costruite e provate sugli stessi file finali (impronte uguali prima e dopo le ultime prove: l'unica differenza è lo script che le calcola, cambiato per escludere questo file). Nessun commit, nessun push.**

## Piano (unità)

1. Il disegno unico: modelli, token `--segno-*`, generatore `tools/marchio.py` (+ rasterizzatore senza dipendenze per ICO e PNG), prova `--check`.
2. Il componente: `componenti/marchio.css`, `marchio/marchio.js` (voce, gesto, ripiego), correzione dei difetti noti.
3. Il sito: `tools/site.py` mette il disegno nella barra di tutte le pagine, l'icona della scheda (SVG + ICO), toglie la bolla verde.
4. Il movimento nella home (`scena.js`).
5. Il catalogo: «Il marchio».
6. I pacchetti Linux.
7. Prove: strumenti, sito vero e in dieci lingue, ogni pagina a 1440/768/390 (anche ar-XB), sequenze, confronto con la scelta, pacchetti.

## Fatto

- **U1 · il disegno unico.** `design-system/marchio/disegno.json` (la sola geometria) + token `--segno-*` in `token.css` → `tools/marchio.py` scrive
  `barra.svg`, `libero.svg`, `piena.svg`, `piccola.svg`, `simbolica.svg`, `favicon.ico` (16 e 32 da `piccola`, 48 da `libero`) e le icone di
  `packaging/linux/` (SVG libero, simbolica, PNG 48 e 256). `--check` fallisce se qualcosa non torna. `tools/marchio_raster.py`: rasterizzatore
  senza dipendenze (campioni 16×16, ritagli, tratteggi con tangenti esatte) + PNG e ICO; confrontato con Chromium e cairosvg (media 0,1/255, 10 punti oltre 40).
  Le forme isolate non usano ritagli (QtSvg di KDE non li segue): il fronte è calcolato e la parte detta è un'area più un contorno, il tratteggio
  comincia alla stessa distanza della barra (`stroke-dashoffset`).
- **U2 · il componente.** `componenti/marchio.css`, `marchio/marchio.js` (evento `kalliope:voce`, gesto, ripiego fermo), sempre a riposo all'arrivo, ritorno a
  tempo fisso (sosta 600 ms, ritorno 800 ms). `scena.js`: due righe (`voceDice` in `passoDiscorso` e in `ferma`), non più sei chiamate.
- **U3 · il sito.** `tools/site.py`: `marchio_del_sistema`, `passo_marchio` (segnaposto `<svg data-marchio=…>`, icone della scheda, errore se una pagina
  scrive la sua icona o se il marchio non torna con i token). Sorgenti delle 11 pagine ripulite; `website/immagini/icona.svg` tolta.
- **Prove scritte.** `tools/test_marchio.py` (36 prove; 133 con le altre, verdi). Foto di prima mano: `/tmp/l3-prove/` (da spostare in `foto/`).

- **U4 · il movimento.** Sequenze (con video) in `sequenze/arrivo-1440`, `arrivo-390`, `puntatore-1440`, `puntatore-390`, `ridotto-1440`; la prova `prove/movimento.mjs`
  passa sulla copia di adesso e fallisce su quella della direzione (`/tmp/l1-sito-3-4`: fronte a −60, piena per 2,7 s, ritorno in 2,3 s). La prima correzione lasciava la bolla piena 2,2 s
  dopo l'ultima parola (il respiro finale della voce): ora con l'ultima parola parte la sosta (`sequenze/barra-arrivo/` è quel passaggio intermedio).
- **U5 · il catalogo.** `catalogo/catalogo-marchio.js` + `.css`, aperto nel sito costruito: 0 errori, 0 richieste fallite (`prove/catalogo.mjs`, foto in `foto/catalogo/`).
- **U6 · i pacchetti.** `build-packages.sh` (controlla `marchio.py --check`, installa le quattro icone), `kalliope.spec`, `install` (installa e toglie), `test-packages.sh` (presenti e tolte), PKGBUILD (commento: `cp -r share`),
  `docs/releasing.md`, CI (`marchio.py --check`), `pages.yml` (percorsi).

- **Prove (numeri)**
  - `controlla-sorgenti.mjs`: verde, 31 fogli di stile, valori solo nei token; su una copia con un colore scritto a mano in `marchio.css` fallisce (2 cose).
  - Sito vero (it): 57 pagine×larghezze (19 pagine, 3 larghezze), sito in dieci lingue (ar bg bn de el fi hi ur zh + it, più `en-XA` e `ar-XB`), sotto `/kalliope/`: **156 pagine×larghezze,
    52 pagine, 0 errori in console, 0 richieste fallite, icona SVG e ICO in ogni pagina, segno 36 px (30 al telefono) al suo posto, mai specchiato, all'inizio della riga, nessuno scorrimento orizzontale**
    (`prove/pagine.mjs`; foto delle barre in `foto/pagine-sito-vero/`, `foto/pagine-dieci-lingue/`, `foto/pagine-rtl/`). La 404 si prova sotto `/kalliope/` (ha `<base href="/kalliope/">`).
  - Movimento: `prove/movimento.mjs` passa (fronte da 0,0 a 61,6; piena al più 0,44 s di fila) e fallisce sulla copia della scelta (−60,0; 2,68 s; ritorno in 2,28 s); `prove/stati.mjs` (senza JavaScript, «riduci movimento»,
    Tab a ritmo lento e veloce, puntatore ripetuto, fotogrammi in ritardo, ricarica e indietro, frase nuova, interruzione) passa.
  - Catalogo: `prove/catalogo.mjs` passa (0 errori, 0 richieste fallite, 33 segni in linea senza identificatori doppi, pagina da destra a sinistra letta dalla pagina); fallisce sulla copia di prima delle due correzioni.
  - Confronto con la scelta: `confronta-scelta.mjs` (prima schermata della home, 1440 e 390): uguale su 53 e 46 cose; barra a riposo identica pixel per pixel; segno in ogni posizione del fronte: al più 14 pixel su 17 424, al più 8 su 255 (`prove/confronto-stati-barra.mjs`).
  - `tools/test_marchio.py`: 37 prove; con tutte le altre 134, verdi (`python3 -I -m unittest discover -s tools -p 'test_*.py'`). **Sul codice di prima** (HEAD estratto in `/tmp/l3-prima` con solo i tre file nuovi): 4 FAIL e 21 ERROR su 37 (le pagine che scrivono
    il disegno e l'icona, nessun marchio nel sistema). La copia guastata (token, geometria, file a mano, ICO, PNG) fallisce; le prove del rasterizzatore falliscono sui due comportamenti di prima (estremo del trattino alla corda, giunzioni a disco).

## Prove di consegna (20/11/2026) · numeri

Tutte sugli stessi file finali: impronte in `impronte-prima-delle-ultime-prove.txt` e `impronte-dopo-le-ultime-prove.txt` (sha256, più l'identificatore del file in HEAD; devono essere uguali).
Siti costruiti da `tools/site.py` con `design/lavoro/L-logo/costruzione/prove/releases.json` (la release v0.1-rc.1 salvata), serviti sotto `/kalliope/` come su GitHub Pages (porte 8960–8969).

| Prova | Esito |
| --- | --- |
| `marchio.py --check`, `translations.py extract --check` (260 messaggi) e `check` (it 260/260), `css_logico.py` (32 fogli), `version.py check` (0.1) | verdi |
| `python3 -I -m unittest discover -s tools -p 'test_*.py'` | 134 prove, OK (1 saltata con `-I`: cairosvg; senza `-I` 134 su 134) |
| `controlla-sorgenti.mjs` (da `design-system/`) | «31 fogli di stile, valori solo nei token»; con un colore scritto a mano in `marchio.css` e un token inesistente: «2 cose da sistemare» |
| `prove/pagine.mjs`, sito vero, 1440/768/390 | 57 pagine×larghezze (19 pagine, 404 compresa): 0 errori in console, 0 richieste fallite, icona SVG e ICO in ogni pagina, segno 36 px (30 al telefono), non coperto, non specchiato, nessuno scorrimento orizzontale |
| `prove/pagine.mjs`, dieci lingue (it ar bg bn de el fi hi ur zh) + `en-XA` + `ar-XB` + la scelta della lingua + la 404 | 156 pagine×larghezze (52 pagine): stesso esito; da destra a sinistra il segno sta all'inizio della riga (a destra) e non è specchiato |
| `prove/pagine.mjs`, 49 larghezze (320…1440, ogni soglia di `metodo.config.mjs` e il pixel prima) × home, «stato», «non ancora» | 147 pagine×larghezze: stesso esito (`foto/larghezze-di-mezzo/`) |
| `prove/movimento.mjs` (22 s dall'arrivo) | passa a 1440 e 390: mai sotto il riposo, piena al più 0,44 s di fila, torna a riposo; sulla copia della scelta fallisce (−60, 2,68 s, 2,28 s) |
| `prove/stati.mjs` | passa: senza JavaScript, «riduci movimento», Tab lento e veloce (anello visibile, gesto, ritorno), puntatore ripetuto, fotogrammi in ritardo di 2,5 s, ricarica, indietro e avanti, frase nuova, interruzione |
| `prove/catalogo.mjs`, 1440/768/390, sito vero e dieci lingue | passa: 0 errori, 0 richieste fallite, 33 segni in linea senza identificatori doppi, 2 pagine da destra a sinistra «non specchiato», Riproduci → Ferma → ridotto; a 768 e 390 il catalogo è più largo dello schermo per «Le scritture» (non mio: `foto/catalogo/difetto-non-mio-scritture-390.png`) |
| `prove/motori.mjs` + `motori-diff.py` | Chromium 148, Firefox 150.0.2, WebKit 26.4: 0 errori in console; il segno a fronte 0, 31 e 62 differisce da Chromium di al più 37 pixel su 17 424 sopra 24/255, nessuno sopra 96 (`foto/motori/`) |
| `confronta-scelta.mjs` (prima schermata, 1440 e 390) | uguale su 53 e 46 cose; barra a riposo identica pixel per pixel; segno in ogni posizione: al più 14 pixel su 17 424, scarto al più 8/255 |
| ICO e PNG con lettori indipendenti | Pillow legge l'ICO (16, 32, 48, RGBA, alfa 0–255) e i PNG; ImageMagick `identify` lo stesso; Chromium e cairosvg disegnano `libero.svg` come il rasterizzatore del repository (media 0,1/255; 10 punti oltre 40 su 65 536) |
| `build-packages.sh 0.1-rc.1 …` (binari release ricompilati: `cargo build --release --locked -p kalliope-app -p kalliope-cli`, 3 min 31 s; Slint 1.19.0 compila con l'icona nuova) | `.deb`, tarball, PKGBUILD costruiti (`rpmbuild` qui non c'è: un finto crea il file, l'RPM non è provato); le quattro icone nei pacchetti sono quelle del repository (`cmp`) |
| `test-packages.sh` | tarball: installato con `./install`, `kalliope --version`, `kalliope-cli phonemes` e `say` (2 225 ms di voce), le quattro icone presenti e della misura giusta, rimosso, icone tolte; `.deb`: installato con `apt-get` (qui c'è: Debian 13), lo stesso, rimosso, icone tolte (`/var/log/apt/history.log`: solo kalliope, installato e rimosso); `.rpm` e PKGBUILD saltati (né docker né podman). «All package checks passed.» |
| `prove/prova-deb.sh` | il `.deb` estratto: icone presenti, della misura giusta, uguali a quelle del repository |

Nota sul comando: `test-packages.sh` usa `sudo apt-get` sul `.deb` (come dice il suo commento): l'ho lanciato io, perché l'incarico chiede di provare i pacchetti qui; ha installato e tolto soltanto il pacchetto `kalliope`.

## Dove sta il logo e come si genera

- **Fonti**: `design-system/marchio/disegno.json` (geometria) e i token `--segno-*` di `design-system/token.css` (colori e tempi).
- **Generatore**: `python3 -I tools/marchio.py` scrive `design-system/marchio/{barra,libero,piena,piccola,simbolica}.svg`, `favicon.ico` e `packaging/linux/<id>.svg`, `-symbolic.svg`, `-48.png`, `-256.png`;
  `--check` fallisce se non tornano (CI, `build-packages.sh`, ogni costruzione del sito). `tools/marchio_raster.py` disegna PNG e ICO (senza dipendenze); `tools/test_marchio.py` le prove.
- **Componente**: `design-system/componenti/marchio.css`, `design-system/marchio/marchio.js`; la home lo muove con l'evento `kalliope:voce` (`website/scena.js`, `voceDice`).
- **Catalogo**: `design-system/catalogo/catalogo-marchio.js` + `.css` («Il marchio», dopo «Componenti»). **Documenti**: `SISTEMA.md` («Il marchio»), `TOKEN.md` («Il marchio»).

## Differenze dalla scelta (volute, con il motivo)

1. All'arrivo il segno non è mai una bolla vuota: il fronte non va mai sotto il riposo (nella scelta andava a −60 mentre la home scrive e per 1,2 s di voce) · giudizio, secondo sguardo, importante 3.2.
2. A fine frase torna a riposo a tempo fisso (600 ms piena, poi 800 ms) e già all'ultima parola, non a fine audio (nella scelta restava piena fino a 2,7 s di fila, e tornava come un avvicinarsi senza fine, 2,3 s) · stesso giudizio.
3. Forma piccola: il fondo della bolla da y = 88 a 92 (su 128), mezzo pixel a 16 px, perché il contorno tratteggiato stia al centro di una riga di pixel e a 16 px sullo scuro non si spalmi (giudizio, minore 3.4).
   Non cambiano: la parola, il fronte, il tratteggio. Prima/dopo: `foto/piccola-prima-dopo.png`.
4. Le forme isolate non hanno ritagli (QtSvg di KDE non li segue): il taglio del contorno sul fronte è perpendicolare al contorno invece che curvo (al più 2 unità a 256 px).
5. L'ICO ha 16 e 32 dalla forma piccola (la direzione diceva 32 dalla libera): la scheda mostra lo stesso disegno dell'SVG.
6. `marchio.js` sta in tutte le pagine nuove (il gesto del puntatore dappertutto), non solo nella home.
7. Token per ruolo (`--segno-*`): `detto` e `bordo` sono un colore solo, niente fronte vuoto, niente `passaggio`; due fondi di prova per il catalogo.

## Ciò che resta e ciò che non ho verificato

- **Resta**: l'icona della finestra del programma in Slint; il disegno libero è un colore solo, piatto (difetto minore del giudizio, GNOME/KDE chiedono un po' di profondità, Flathub vieta il simbolo di un colore solo);
  «non ancora» e «stato» non muovono il segno con la loro voce (basta emettere `kalliope:voce`); Windows (ICO a 256 e le varianti) e macOS (ICNS) non hanno ancora pacchetti; `design/direzione-2/D2.md` e `CLAUDE.md`
  dicono ancora «il verde del logo di prima è l'unica eccezione» e «le altre pagine hanno l'aspetto di prima» (non sono in questa area).
- **Non verificato**: Firefox e WebKit (solo Chromium senza finestra, senza suono: l'orologio è quello della scena); l'aspetto vero su GNOME, KDE, Windows e macOS; Safari prima della 26 e Google con l'ICO;
  la documentazione di QtSvg (ricerca in rete bloccata da un hook: le forme isolate non usano ritagli in ogni caso); l'RPM (qui non c'è `rpmbuild`: nelle prove un finto che crea il file; né docker né podman) e AUR (`makepkg`);
  il `.deb` installato con apt (qui non c'è apt: ne ho letto il contenuto con `dpkg-deb`); la finestra del programma con l'icona nuova (non si lancia: niente schermo).

## Ultimo comando

`design/lavoro/L-logo/costruzione/strumenti/impronte.sh` dopo l'ultima serie (pagine, movimento, stati, catalogo, tre motori, sequenze ricatturate sul sito finale `/tmp/l3-pub-reale/kalliope`).

## Problemi aperti

Vedi «Ciò che resta e ciò che non ho verificato». Fuori dall'area elencata dall'incarico ho toccato, per la prova che fallisce e per la consegna, soltanto: `.github/workflows/ci.yml` (una riga: `marchio.py --check`),
`.github/workflows/pages.yml` (i percorsi che ripubblicano il sito), `docs/releasing.md` (due frasi), `design-system/catalogo/catalogo.js` (una riga del testo «Non ancora») e `design-system/metodo.config.mjs` (`marchio/*.js`).
