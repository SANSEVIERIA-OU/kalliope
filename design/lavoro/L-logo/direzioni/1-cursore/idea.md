# Direzione 1 · «Il cursore che parla»

**L'idea.** Il cursore di chi scrive è la sorgente della voce: dalla riga che scrivi le onde vanno verso gli altri.

Della frase di Kalliope («chi non può parlare scrive, e una voce parla per lui nella riunione, alla pari») questa direzione
prende il primo gesto, scrivere, e lo fa diventare voce nello stesso segno. Il cursore è il segno che chiunque riconosce come
«qui si scrive»: c'è nel campo della finestra di Kalliope e nel campo ricostruito della home (`design-system/componenti/finestra.css`,
`.f-cursore`). Le onde sono gli anelli che nella home partono da «Tu» e raggiungono gli altri (`design/direzione-2/D2.md`,
«Movimento all'arrivo»). Due metafore, il limite delle regole delle piattaforme (`design/lavoro/ricerca/logo.md`).

**Come realizza il criterio di ambizione.** Nella barra il segno è scritto con l'inchiostro della pagina, accanto al nome come
una lettera in più, e vive con la home: mentre la home scrive la frase il cursore lampeggia e le onde aspettano; quando la voce
parla le onde seguono l'inviluppo della registrazione e a ogni picco ripartono dal cursore, insieme agli anelli di «Tu». Fermo,
nei menu, dice «il testo diventa voce» senza lettere.

## Dopo il giudizio (19/11/2026): la correzione

Il giudice (`../../giudizio/giudizio.md`) ha trovato un problema importante e tre minori. Corretti dentro la stessa idea («dalla
riga che scrivi le onde vanno verso gli altri»): l'idea non cambia, la si vede di più.

- **Importante · da ferma la sagoma era il simbolo del volume.** Prima: un'asta e due onde, come l'altoparlante del volume con
  un'asta al posto del cono. Adesso **la riga scritta sta prima del cursore**: una pillola bassa, sulla linea delle lettere, poi il
  cursore, alto quanto una riga di testo (dal sopra delle maiuscole al sotto delle discendenti), più alto delle onde, poi due onde
  più corte. È la frase stessa dell'idea, da sinistra a destra: scrivi, il cursore, la voce. Nel volume nessun pezzo sta a sinistra
  in basso e le onde sono più alte di ciò che suona; qui è il contrario. Provata la simbolica a 16, 24 e 48 px accanto al volume di
  Adwaita e a «volume_up» di Material (`foto/fra-le-icone-2.png`, ultime sei righe; `/tmp/l1-schizzi/simb3.png`).
- **Minore · il logo quasi spento nei primi dieci secondi.** Il cursore lampeggia fra 100% e 55% (prima 20%) e le onde aspettano al
  60% (prima 38%); in più, mentre la home scrive, **la riga cresce fino al cursore** (da un quarto alla sua lunghezza, in 3,1 s,
  quanto dura la scrittura in `scena.js`): il marchio scrive mentre la pagina scrive.
- **Minore · sbilanciato sul chiaro e sullo scuro.** Tre toni medi invece di uno scuro e uno chiaro: riga e cursore `#d82762`
  (4,6:1 sul chiaro, 3,3:1 sullo scuro), prima onda `#ed537c` (3,3 e 4,6), seconda onda `#ed7c94` (2,5 e 6,0). Sul chiaro la
  seconda onda non si perde più, sullo scuro l'asta non scende nel fondo.
- **Minore · la forma piena spariva sul bordo nello scuro.** La piastrella è magenta `#d82762` (prima la stanza bordeaux scura):
  il bordo si vede su chiaro (4,6:1) e su scuro (3,3:1); sopra, il segno chiaro della barra.

| Token | Valore | Fonte o motivo |
| --- | --- | --- |
| `--d1-inchiostro-scritto` | `#d82762` | riga e cursore, oklch(58% 0.21 8): regge da tutte e due le parti |
| `--d1-onda-vicina`, `--d1-onda-lontana` | `#ed537c`, `#ed7c94` | oklch(66% 0.19 8) e oklch(72% 0.14 8) |
| spessori | `#9f0042`, `#b4144e`, `#d82762` | oklch(45% 0.18 8), oklch(50% 0.19 8), l'inchiostro |
| `--d1-piastra` | `#d82762` | la forma piena; sopra `#ffedef` (`--testo`), `#fdb8c4` (oklch 85% 0.08 8) e `#ffdbe1` (`--voce`) |
| `--d1-segno-proporzione` | `0,875` | il disegno nella barra è largo 112 su 128 (32 × 36 px) |
| `--d1-cursore-spento`, `--d1-onda-quieta` | `0,55`, `0,6` | il marchio non sembra più spento all'arrivo |
| `--d1-scrittura`, `--d1-riga-iniziale`, `--d1-curva-scrittura` | `3,1 s`, `0,25`, lineare | la riga cresce come si scrive, nel tempo della scrittura della home (2,2–5,3 s) |

Geometria (tela 128, griglia di 2 px): riga 26×16 a (12, 70); cursore 16×92 a (46, 18); onde con centro (54, 64), raggi 28 e 48,
aperte 92° e 72°, larghe 16. La versione piccola ha riga 3×2 px, cursore 2×14 px e onde sulle colonne 9–11 e 12–14; la simbolica
lo stesso disegno in un colore.

**Che cosa resta.** Le onde sono ancora onde: chi conosce il simbolo del volume ci vedrà del suono, ed è giusto. La riga, a 16 px,
è un trattino di 3 px: si legge «-|))», non ancora «testo». Da destra a sinistra le onde vanno verso il bordo (regola: il marchio non
si specchia).

## Dove sta che cosa

| Che cosa | File |
| --- | --- |
| I token (colori, tempi, curve) | `token.css` |
| I modelli, con i colori per nome | `modelli/disegno.svg`, `piena.svg`, `piccola.svg`, `simbolica.svg`, `barra.svg` |
| I file con i valori (generati da `../../strumenti/genera.py`) | `disegno.svg` (libero, tela 128), `piena.svg` (macOS), `piccola.svg` (16 e 24 px), `simbolica.svg` (GNOME, 16×16) |
| Il componente della barra | `marchio.css`, `marchio.js` |
| La pagina di prova | `prova.html` (servita dalla radice del repository) |
| Le foto | `foto/barra-2/` (dopo il giudizio), `foto/fra-le-icone-2.png`; prima: `foto/barra/` (barra vera: 1440, 390, con l'azione, ar-XB, compatta, 1366×640, «non ancora»), `foto/prova-intera.png` |
| Le sequenze | dopo il giudizio in `sequenze-2/`; prima in `sequenze/`: `sequenze/barra-arrivo/` (lente 3× a 1440 e 390), `barra-puntatore/`, `barra-ridotto/`, `arrivo-pagina/` (1440 e 390) |
| I confronti | `../../confronti/1-cursore/` (home con R01, R03, R51; barra con i marchi dei riferimenti; icone con i programmi simili) |
| La copia del sito | dopo il giudizio `/tmp/l1-1-copia-5` → `/tmp/l1-sito-1-5` e `-pseudo`; prima `/tmp/l1-sito-1-4` |

## Le scelte e le fonti, prima del giudizio

> Questa sezione descrive il disegno di prima della correzione; i suoi file sono in `../../prima-del-giudizio/1-cursore/`. I valori di adesso sono nella sezione «Dopo il giudizio».

**I tratti comuni del genere, adottati.** Nelle barre dei riferimenti il marchio sta a sinistra del nome (6 su 7, classifica dei
riferimenti), è un segno compatto alto circa una volta e mezza le maiuscole del nome (ElevenAgents R03, LALAL.AI R05, Voiceitt R53:
`../../foto/riferimenti/loghi-dei-riferimenti.png`) e prende il colore dal mondo del sito. Qui: a sinistra di «Kalliope», alto 24 px
accanto a maiuscole di 16 px, nel colore del testo della pagina.

**La peculiarità presa** (un tratto solo): la sfera di ElevenAgents (R03) è un segno della voce che vive quando la voce parla
(`design/ricerca/prove/R03/fogli/widget-apertura.jpg`, `design/ricerca/schede/R03.md` §«sfera di colore come emblema della voce»).
Qui il marchio nella barra vive con la voce della home. Non si prende né la sfera né il suo colore.

**La forma** (scelta progettuale, guardata resa a 16–256 px in `/tmp/l1-schizzi/s1–s3.png` e nelle pagine di prova):
- tratti pieni arrotondati di 16 su 128: a 16 px fanno 2 px, niente linee sottili (regole di Flathub e GNOME);
- il cursore 16×84, le onde con centro sul cursore, raggi 34 e 62, aperte 96° e 78°: la seconda onda sale poco oltre il cursore,
  come una voce che si allarga; provate con le onde da tutti e due i lati (`d1b`, «in diretta», più simile a un segno di trasmissione)
  e scartate;
- uno spessore frontale di 4 px sotto ogni tratto (GNOME: «not flat», al massimo 4 px); niente ombre fuori dalla sagoma;
- griglia di 2 px; il disegno non riempie la tela (GNOME, Flathub).

**I colori** (tinta 8 in OKLCH, quella del bordeaux del sito; calcoli in OKLCH, contrasti guardati resi e misurati con la regola di
Windows «almeno metà dell'icona a 3:1 sul chiaro e sullo scuro»):

| Token | Valore | Fonte o motivo |
| --- | --- | --- |
| `--d1-cursore` | `#c50f56` | il magenta del sito (`--magenta`): l'inchiostro; 5,6:1 sul chiaro |
| `--d1-onda-vicina` | `#e6396e` | nuovo, oklch(62% 0.21 8): 3,9:1 sia su `#fafafb` sia su `#222226`, il colore che regge da tutte e due le parti |
| `--d1-onda-lontana` | `#f3a4b2` | nuovo, oklch(80% 0.095 8), a metà fra `--rosa` e `--voce`: chiaro sul bordo, mai scuro vicino al bordo (Flathub) |
| spessori | `#7e1840`, `#a5154a`, `#e3718a` | `--barre-spente`, oklch(45% 0.18 8), `--rosa` |
| `--d1-onda-lontana-piccola` | `#e3718a` | a 16 px la seconda onda chiara sparisce sul bianco: lì è il rosa del sito |
| forma piena | `#5b0123` → `#2e0010`, `#ffedef`, `#ffdbe1` | la stanza del sito (`--bordeaux`, `--barra-piena`), il testo (`--testo`) e la voce (`--voce`) |
| barra | `--d1-inchiostro: #ffedef` | il testo del sito: il segno è scritto come il nome |
| simbolica | `#2e3436` | il colore dei simboli di Adwaita (`GNOME/adwaita-icon-theme`, master, commit `2066120e`, per esempio `Adwaita/symbolic/actions/open-menu-symbolic.svg`), scelto invece del `#222222` del modello ufficiale delle icone delle app (`Teams/Design/HIG-app-icons`, `template.svg`, commit `3535fe98`) perché è quello delle simboliche installate; GTK le ricolora comunque |

Sul chiaro passano a 3:1 il cursore e la prima onda (circa il 63% dell’area); sullo scuro le due onde (circa il 63%).

**La forma piena** (macOS): il disegno sulla stanza del sito, quadrato pieno senza angoli (macOS mette la maschera); il cursore
diventa chiaro come il testo della pagina perché sul bordeaux il magenta sparirebbe. È l'unico cambio di colore fra le forme.

**La versione piccola** (16 e 24 px): senza spessore, cursore e onde sulla griglia dei pixel di 16 (cursore 2 px a x = 2, onde
larghe 2 px che cadono sulle colonne 7–9 e 11–13). Si usa per la scheda del browser, l'ICO 16 e 24, hicolor 16 e 24. Provata
pixel per pixel nella pagina di prova (`#pixel`).

**Nella barra.** Il disegno ritagliato ai suoi bordi (`viewBox="16 0 100 128"`, larghezza `calc(--misura-17 × 0,78)`), perché con la
tela intera stava staccato dal nome (prima prova: `foto` della barra a 3× di `/tmp/l1-sito-1-1`); il nome resta quello del sito
(Lexend 700, `--corpo-11`, `--spaziatura-marchio`, spazio `--spazio-10`).

**Il movimento** (solo nella barra; le icone del programma restano ferme):

| Quando | Che cosa | Valori e fonte |
| --- | --- | --- |
| la home scrive la frase (2,2–5,3 s) | il cursore lampeggia; le onde restano al 38% | 1 s a scatti come il cursore del campo (`--durata-f-campo-f-cursore`, `--curva-a-scatti`); il marchio scende al 20% invece di sparire (`--d1-cursore-spento`), perché spento del tutto il segno perdeva il suo tratto principale (`sequenze/barra-arrivo`, prima prova); 38% come le parole non dette della bolla (40%, D2) |
| la voce parla | le onde seguono l'inviluppo (38–100%); a ogni picco ripartono dal cursore (da 0,82 a 1) una dopo l'altra | 520 ms, sfasamento 110 ms, curva `--entra` (R03); i picchi sono gli stessi che lanciano gli anelli di «Tu» (`scena.js`, `picchi()`) |
| finita la voce | tutto torna fermo | — |
| puntatore e fuoco | le onde ripartono una volta dal cursore | gli stessi valori; prima prova con un allargamento del 12%, che non si notava (`sequenze/barra-puntatore`, primo foglio) |
| «riduci movimento» | niente | `marchio.css` e `marchio.js` |

La prova della rimozione: senza il movimento si perde il legame fra il marchio e la voce della pagina (significato), non solo
bellezza.

**Stile di default** (`giudizio.md`, parte E): nessun tratto dell'elenco. Il cursore è una barra arrotondata, non un pulsante a
pillola. Il gradiente c'è solo nella forma piena ed è la stanza del sito, un solo colore (R01, già fonte della direzione 2).

## I difetti che vedevo prima del giudizio

- **Somiglia al simbolo del volume** (altoparlante con onde) e, meno, a quello del Wi-Fi: chi non ha visto la home può leggerlo come
  «audio». È il prezzo della lettura immediata «testo che suona».
- Fra le icone vere (GNOME, KDE) il disegno libero è più leggero delle altre: tre tratti senza un corpo. Regge, ma pesa meno di
  un'icona piena.
- Sul chiaro la seconda onda (`#f3a4b2`) è tenue: il disegno sembra più piccolo che sullo scuro.
- La simbolica a 16 px ha le onde sfumate dall'antialiasing (sono curve): si può ritoccare a mano sulla griglia.
- Da destra a sinistra le onde vanno verso il bordo della pagina e non verso il nome: è la regola (il marchio non si specchia), ma la
  lettura «la voce va verso il nome» si perde.
- Il movimento della barra lo comanda `scena.js` con sei chiamate aggiunte nella copia; nel sito vero le aggiungerebbe la costruzione.

## Come verrebbero ICO e ICNS

- **Windows (ICO)**: 16 e 24 da `piccola.svg`, 32, 48 e 256 da `disegno.svg`, rese in PNG a 32 bit con trasparenza e messe in un ICO
  (il 256 compresso PNG). Provato in `/tmp/l1-icone-prova-2/1-cursore/kalliope.ico` (dopo il giudizio; prima `/tmp/l1-icone-prova/1-cursore/kalliope.ico` con `strumenti/png.mjs` (Chromium di Playwright) e
  ImageMagick 7.1.1-43 di questa macchina (`magick piccola-16.png … disegno-256.png kalliope.ico`: 5 grandezze, canale alfa). Per
  l'elenco delle app di Windows le varianti `_altform-unplated` e `-lightunplated` possono essere lo stesso disegno, perché regge sul
  chiaro e sullo scuro; le ombre interne che Microsoft suggerisce si aggiungerebbero solo lì.
- **macOS (ICNS)**: da `piena.svg`, PNG da 16 a 1024 con `@2x` in una cartella `.iconset` e `iconutil -c icns` (gira solo su macOS);
  oppure un file di Icon Composer con due livelli, la stanza e il segno, da cui il sistema ricava le varianti scura e monocroma. Non
  provato: su questa macchina non c'è macOS.
- **Linux**: `disegno.svg` in `hicolor/scalable/apps`, `simbolica.svg` come `…-symbolic.svg` in `hicolor/symbolic/apps`, PNG 48 e 256
  da `disegno.svg`; se si installano PNG a 16 e 24, da `piccola.svg`.

## Non verificato

- Fondi e misure delle ricostruzioni: GNOME e KDE verificati il 19/11/2026 nelle fonti ufficiali (`../contesti/piattaforme.css`); per la barra di Windows c'è il token di ripiego `SolidBackgroundFillColorBase`, perché Microsoft non pubblica il colore vero, e l'accento dell'indicatore è un'approssimazione non verificata; il Dock di macOS è inventato (Apple non pubblica il materiale).
- Firefox e WebKit non provati sulla barra; il movimento solo in Chromium senza finestra, senza suono (orologio della scena).
