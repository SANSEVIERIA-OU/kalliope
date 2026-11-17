# Incarico 3a-r · «non ancora»: la rifinitura · progresso

Ruolo design-build. Incarico: `design/lavoro/incarichi/3a-non-ancora-rifinitura.md`, più il punto in più di chi coordina (il fuoco nel menu del telefono muoveva la
pagina). Partenza `82823d5`. Nessun commit, nessun push, nessuna finestra, nessun altro agente. Porte 8850-8859, cartelle `/tmp/lavoro-3ar-*`.
Ambiente: `source prove/env.sh`. **Stato: consegnato** (17/11/2026). Ultimo comando: `bash prove/serie-L.sh <motore> <parte>`.

## File toccati

`design-system/token.css` (6 token in fondo al blocco «Pagine interne»), `design-system/componenti/pagina.css`, `design-system/componenti/versioni.css`,
`design-system/metodo.config.mjs` (i limiti), `design-system/catalogo/catalogo-pagine.js`, `design-system/SISTEMA.md`, `design-system/TOKEN.md`,
`website/non-ancora/index.html`, `website/non-ancora/non-ancora.js`, `website/index.html` (solo la variante «non di prova» di due frasi), `website/lingue/site.pot` e
`it.po` (rigenerati: 156 messaggi, tre nuovi, nessuno di quelli che c'erano cambiato), `tools/site.py` (`passo_release`), `tools/test_translations.py` (classe
`DataRelease`), `docs/translating.md`, `docs/releasing.md`, `design/lavoro/3a-non-ancora/PIANO.md` («La cornice» e una sezione in fondo).
Non toccati: `lingue.html`, `lingua.js`, `lingue.css`, `catalogo-lingue.*`, `catalogo.js`, `catalogo.css`, `componenti.js` (dell'incarico 2-b).

## Che cosa è cambiato, punto per punto (foto in `foto/`, prima = `82823d5`)

- **N5** (`versioni.css`): la regola dell'apertura del posto (`.js .versioni.visto …`) era più specifica di quella della risposta; ora c'è `.js .versioni.visto … .ricordata`.
  Prova `prove/versioni.mjs`: con il tempo fermato a 0, 135, 270, 450, 899 ms il bordo passa da tratteggio a voce (luce 141 → 227) e torna; sulla copia di prima: 0 animazioni
  «ricorda», luce sempre 141. Foto: `foto/N5/N5-copia-posto-prima-dopo.png`.
- **N1** (`token.css`, `pagina.css`, `non-ancora.js`, `index.html`: classe `tavolo-pagina`): la riunione della chiusura si abbassa fino a 60 px dove l'altezza non basta; regola completa in
  `PIANO.md`. Mentre suona: a 844×390 la riunione è di 106 px (era 172), a 915×412 di 128, a 326×326 di 68 (era 78); bolla e «Pausa» stanno insieme a ogni misura (`prove/bassi.mjs`,
  3 motori; sulla copia di prima a 844×390 mancavano 66 px, a 915×412 44, a 326×326 10). Con il messaggio d'errore, al computer: 70 px a 500 d'altezza, bolla e messaggio insieme da 500
  (1440×500, 1440×501, 1440×560, 1440×600, 1280×500, 844×500: tutti nello schermo). Restano i limiti dove nemmeno così basta (844×390, 915×412, 326×326, 390×500/501, 320×568): lì il messaggio
  sta intero nello schermo e vince, con l'errore che arriva a 0, 150 o 700 ms dal clic. Limiti di `metodo.config.mjs`: prima 3 voci (bolla nell'errore a `*x500`, `*x501`, 844×390, 915×412, 326×326,
  320×568; comando mentre suona a 844×390, 915×412, 326×326; comando nell'errore a 326×326), adesso 3 voci (bolla FUORI VISTA a 844×390 e 326×326; bolla COPERTA a 915×412, 390×500/501, 320×568;
  comando nell'errore a 326×326): mentre suona nessun limite, e 500/501 al computer non ne hanno più.
  Foto: `foto/N1/N1-844x390-suona-prima-dopo.png`, `N1-326x326-suona-…`, `N1-1440x500-errore-…`, `N1-844x390-errore-…`.
- **N2** (`pagina.css`): al telefono (≤760 px) le etichette che non si vedono non occupano posto (il comando è largo quanto lo schermo: la larghezza è già ferma) e il tondo con la parola
  stanno dove stanno a riposo (scarto 0 px in ogni stato, a 390×844 e 326×326; prima fino a 33 px); larghezza ferma, 350 e 286 px (`prove/etichetta.mjs`, 11/11 in tre motori). Al computer non è
  cambiato: il comando resta largo quanto l'etichetta più lunga e in «Pausa» ha 95 px d'aria dalla parte della parola. Foto: `foto/N2/N2-etichetta-390x844-prima-dopo.png`.
- **N3** (`versioni.css`): la riga della versione ha il fondo pieno, lo stesso colore (il velo steso sul colore del pannello): il tratteggio si apre sotto la riga che scende. `prove/versioni.mjs`
  ferma le animazioni a 109 istanti da 0 a 2,7 s: in 42 ci sono la riga e il tratteggio, e in nessuno il tratteggio sta dentro la riga (prima 13 istanti, da 1675 a 1975 ms); a riposo 0 pixel
  diversi. Foto: `foto/N3/N3-tratteggio-prima-dopo.png`.
- **N4** (`tools/site.py`, `index.html` della home e di «non ancora», cataloghi): `data-release="prova"` / `"stabile"`, scelti dalla costruzione dai dati della versione. La variante «non di prova»
  è una frase intera con la sua chiave (`apertura.stato-stabile`, `chiusura.fatti-stabile`, `na.versioni.ultima.nota-stabile`): le chiavi che c'erano non cambiano. Con la versione di prova la home e la
  pagina sono identiche a prima (0 pixel); con `v0.2` non di prova: «Oggi: versione 0.2», «Versione 0.2, solo per Linux…», nota «Solo Linux», nessuna parola «di prova».
  `tools/test_translations.py`: 72 prove, 4 nuove (`DataRelease`), 3 rosse con il `site.py` di prima.
- **M3** (`pagina.css`): al telefono la didascalia dice per intero che cos'è la scena, su due righe, nello stesso posto (`prove/primo.mjs`: la frase si legge a 8 misure di telefono e il comando principale
  è nello schermo a tutte; sulla copia di prima la frase non si legge a nessuna). Effetto: lo stato finisce a 832 px (era 815): nello schermo a 390×844 e 412×915, 20 px sotto il bordo a 375×812 (dove era già
  3 px sotto). Foto: `foto/M3/M3-didascalia-390x844-prima-dopo.png`.
- **Selettore della lingua** (`non-ancora/index.html`): `<details class="lingua-scelta">`, `lingue.css`, `lingua.js`, lo stesso markup della home; con una lingua sola la costruzione lo toglie. Provato con siti a
  più lingue (`prove/costruisci-lingue.py`: en, de, ar con la pseudo-lingua; `prove/costruisci-lingue-vere.py`: le nove lingue vere dell'incarico 2, con le due frasi nuove ricavate per la prova): si apre, porta
  alla stessa pagina nell'altra lingua (`/it/non-ancora/` → `/de/non-ancora/`), torna indietro, Esc e il clic fuori lo chiudono, in arabo sta a sinistra della barra e dentro lo schermo, al telefono sta nel menu
  (`prove/lingua-barra.mjs`: 22/22 a 1440×900 e 390×844 in tre motori, con quattro e con dieci lingue). Foto: `foto/selettore/`.
- **Il piede in Firefox** e **il punto in più (il fuoco nel menu)**: una sola regola, `.piede a { scroll-margin-bottom }` (token `--scorrimento-spazio-sotto`). Il primo tentativo, `html { scroll-padding-bottom }`,
  portava in vista le voci del piede ma faceva scorrere la pagina di 51 px a 844×390 e di 23 a 326×326 quando il fuoco entrava nell'elenco delle lingue nel menu del telefono (la causa trovata da 2-b).
  Ora: Firefox a 390×844 con Tab, 9/9 soste del piede nello schermo (senza la regola 7/9: «In riunione» e «Aiuto» 14 px sotto il bordo), Chromium e WebKit 9/9; la pagina resta ferma con il fuoco nel menu
  (`prove/menu-fuoco.mjs`: 0 px in tre motori a 844×390, 326×326, 390×844, 360×640, 750×832; con il primo tentativo 51 e 23). La prova rossa di 2-b (`selettore-barra.mjs`, pagina `non-ancora/`, sezioni telefono
  e basso, it, ar e ur, 10 lingue): 48 ok e 0 rosse (con il foglio del primo tentativo: le 2 rosse). Foto: `foto/piede/…`, `foto/menu/…`.

## Prove, con i numeri

Una copia nuova dell'albero vivo a ogni batteria (`prove/sincronizza.sh`). **J** = tutta la batteria; **L** = J più l'ultima correzione (il fuoco: `token.css` e `pagina.css`; e la misura della
larghezza nel catalogo: `catalogo-pagine.js`): i tre file sono i soli che differiscono (impronte sotto). Su J girano le prove che non dipendono da quei tre file; su L tutte quelle che ne dipendono
(fuoco, piede, menu, selettore, robustezza, catalogo, esame delle 22 misure). `prove/riepilogo.py J|L` stampa gli esiti, `esiti/J-*` e `esiti/L-*` sono i file.

- Chromium, esame dell'impaginazione (J): 36 larghezze delle soglie a 900 d'altezza × 6 stati = 216 casi, 201 puliti e 15 senza il menu; 24 altezze (500 501 699 700 759 760 799 800 802 803 819 820) a 390 e 844:
  144 puliti, 2 limiti dichiarati; a 1366 e 1440: 144 casi, 120 puliti e 24 senza menu; 22 misure (i 15 dispositivi e 7 telefoni e finestre basse): 132 casi, 128 puliti, 4 senza menu, 5 limiti; `dispositivi-qa`: 88 casi
  puliti, 3 limiti (45 non eseguiti: il filtro è «non-ancora»). Sulla copia L, le 22 misure: 132 casi, 128 puliti, 5 limiti. Nessun limite non usato.
- Stati (`stati.mjs`), Chromium (J): 57/57 a 1440×900 e 390×844; 42/42 a 844×390, 360×640, 1366×640, 1440×500, 326×326 (1 «non verificato»: la riunione accanto al messaggio, limite dichiarato a 326×326).
  WebKit: 56/56 ×2, 30/30 a 844×390 e 326×326. Firefox: 56/56 ×2 e 30/30 ×2 (con «non verificato» tutto ciò che vuole il suono: nessuna uscita audio).
- Robustezza (tastiera lenta e veloce, senza JavaScript, senza stili, ridotto, scorrimento, ritorno, ricarica), copia L: Chromium 42/42 a 1440×900, 43/43 a 390×844, 20/20 a 390×667, 19/19 a 844×390, 20/20 a 360×640;
  WebKit 42/42 e 43/43; Firefox 42/42 e 43/43.
- Catalogo (L): Chromium 9/9 a 1440×900 e 390×844, Firefox e WebKit 9/9 a 1440×900.
- Pseudo-lingue (J): en-XA e ar-XB, 5 misure, 28 casi puliti su 30 e un limite dichiarato ciascuna; 100 testi guardati in en-XA, nessuno rimasto in italiano.
- Firefox e WebKit, esame a 1440×900, 390×844, 844×390, 360×640, 326×326, 1440×500, 1366×640 (L): WebKit 39 puliti su 42 e 3 limiti; Firefox 37 puliti, 3 limiti e 3 segnalazioni, tutte nello stato «ascolto in corso» a 844×390
  e 326×326: senza uscita audio il suono dà errore e lo stato è quello dell'errore (non è un difetto della pagina; `bassi.mjs` «suona» in Firefox non si può provare).
- Italiano a riposo contro `82823d5` (`confronta-scelta.mjs`, con «riduci movimento», costruito senza selettore come l'italiano di oggi): 1440×900, 1366×640, 1280×720, 1180×820, 844×390: uguale, 0% di pixel diversi;
  360×640: solo la luce del tratto sotto, +17 px (M3), 0%; 390×844: differenze volute (M3: la didascalia su due righe e 17 px in più per ciò che sta sotto), 8,56% di pixel diversi, tutti da quello spostamento.
  Sotto il primo schermo a 1440×900 (quattro tratti): uguale, tranne il fondo della riga della versione (N3, voluto, 0%); a 390×844 con lo spostamento: 0,008% (99 pixel: gli occhi che battono), 0, 0. La home: uguale, 0%,
  in cima e in fondo, a 1440×900 e 390×844 (`esiti/J-confronta-scelta.txt`). Differenze volute dichiarate in `prove/ammesse*.json`.
- Statici (L): `controlla-sorgenti.mjs` verde (23 fogli, valori solo nei token), `css_logico.py` verde, `translations.py extract --check` e `check --complete` verdi (156/156), `test_translations.py` 72 prove, `prove/graffe.py` verde.

## Impronte (primi 16 caratteri di sha256; `esiti/impronte-*.txt`)

Copia **L** = albero vivo (nessun «DIVERSO», `esiti/impronte-L-dopo.txt`): `non-ancora/index.html` 1fc2e7b53f81fb2b · `non-ancora.js` ef87898d130e8d92 · `index.html` edd3302633567dce · `token.css` daca9d7a5d615249 ·
`pagina.css` 8ad6ef88327f1d56 · `versioni.css` c5a07548a38d96ef · `catalogo-pagine.js` 8340d830fe267cef · `metodo.config.mjs` a1608dac3b1880fc · `tools/site.py` f3553b17a397232c · `test_translations.py` 695553f54eb7488a ·
`it.po` cfcc9b33967d728c · `site.pot` c310ec53c4c2dc4e. Copia intera (website, design-system, tools) 5963e1403a7a47c9c0aa2d570595e078; sito costruito (L) 9d21d4f84861addc3231056f8f1ab0ae.
Copia **J** (la batteria): `token.css` 4064a8e618a05d4f, `pagina.css` 1bf1b28e29fa6c91, `catalogo-pagine.js` 0b3c8ae3834c934e; gli altri file elencati sono uguali a L. Prima del giro: `esiti/impronte-F-prima.txt`.

## Controprove (ogni difetto trovato è una prova che fallisce sulla copia di prima)

N1 `bassi.mjs` (rossa su 82823d5: 844×390, 915×412, 326×326; e senza la misura a metà scorrimento di `mostraInsieme`: messaggio sotto il bordo a 844×390), N2 `etichetta.mjs`, N3 e N5 `versioni.mjs`, N4 `DataRelease` (3 prove su 4
rosse con il `site.py` di prima), M3 `primo.mjs`, selettore `lingua-barra.mjs` (rossa sulla pagina di prima), piede `piede-fuoco.mjs` (rossa senza la regola: 7/9 in Firefox), menu `menu-fuoco.mjs` (rossa con
`html { scroll-padding-bottom }`: 51 e 23 px), graffe `graffe.py` (rossa su un `token.css` senza una graffa).

## Trovato lungo la strada (cause, non sintomi)

- Con «riduci movimento» `base.css` dà a ogni elemento una transizione di 1 ms: l'altezza nuova della riunione si vedeva un attimo dopo il messaggio d'errore e lo scorrimento misurava quella vecchia
  (`transition-property: none` su `.tavolo-pagina .tavolo-cornice`).
- Se il messaggio d'errore arrivava mentre lo scorrimento del gesto era ancora in corso (pochi millisecondi dopo il clic, dove il suono manca), `mostraInsieme` misurava a metà strada, vedeva il messaggio già in
  vista e non chiedeva niente: lo scorrimento in corso lo portava 100 px sotto il bordo a 844×390. Ora misura dove lo scorrimento in corso arriverà (`meta`) e lo sostituisce. Il difetto era nel codice anche prima:
  il restringimento della riunione lo ha reso visibile. Il messaggio che entra (`sale12`) parte 12 px più in basso di dove resta: misurato subito, spingeva lo scorrimento 12 px più in là.
- Le costanti dei token sono misurate in italiano e usano le righe della scrittura (`--interlinea-13`, `--interlinea-6`): in arabo (pseudo-lingua, righe più alte) la bolla stava 9 px sotto il bordo con la formula
  fissa, con quella che segue le righe sta a 844×390 e 915×412.

## Difetti trovati e non miei

1. **Una graffa dimenticata da me in `token.css`** (corretta dopo una ventina di minuti, trovata da una misura che non tornava: bolla 82 px contro 88): se l'incarico 2-b ha fatto prove in quel tratto, le ha su un foglio rotto.
2. **Le traduzioni di prova dell'incarico 2** (`design/lavoro/2-lingue-aspetto/prova-lingue/`, `crea_cataloghi.py`, `costruisci.sh`) non producono più cataloghi completi: mancano `apertura.stato-stabile` e `chiusura.fatti-stabile` in
   ognuna delle 9 lingue (due frasi intere, le stesse di prima senza «di prova»). Non ho toccato i loro file: `prove/costruisci-lingue-vere.py` le ricava in una copia, solo per la prova.
3. **Catalogo, la tabella «dove stanno comando e stato»**: parte quando arriva sullo schermo, e a volte non parte (la prova la scorre una volta sola e il catalogo costruisce altre sezioni dopo, che la spostano): in 10 giri a
   390×844 serviva riportarla sotto gli occhi 2 volte su 5 sulla copia di prima e 3 su 5 su L; riportata, sempre 9/9. È una fragilità del catalogo di prima, non una regressione; `prove/catalogo.mjs` adesso la riporta in vista.
4. **Firefox 1440×900, `stati.mjs tentativo-altezza`**: intermittente, rosso su `82823d5` e su H (3 giri su 3 da soli), verde nella batteria J; la prova comincia a guardare dopo che il segno è già tornato (`setViewportSize` in Firefox è
   lento), lo stato finale è giusto. Non è della pagina.
5. **`selettore-barra.mjs` di 2-b con tutte le sezioni su `non-ancora/`**: «scelta del tedesco» è rossa perché si aspetta `/de/` (la home); la pagina porta, giustamente, a `/de/non-ancora/`.
6. **Il catalogo in WebKit**: la larghezza del comando nel catalogo includeva lo stato «premuto» (scala 0,97: 202,8 contro 209): misurava la resa, non la larghezza. Ora `offsetWidth` (`catalogo-pagine.js`), 9/9.
7. Al telefono, Esc con l'elenco delle lingue aperto nel menu chiude l'elenco; il menu resta aperto o si chiude secondo lo script di 2-b: la prova non lo assume.
8. Da guardare, non indagato: nella foto `foto/selettore/barra-aperta-ar-rtl-1440x900.png` il nome «български» nell'elenco ha lettere che sembrano di un altro carattere.

## Non verificato

- Il suono ascoltato (nessuna uscita audio: in Firefox gli stati con la voce sono «non verificato»); lettori di schermo; telefoni veri. **`100vh` nei token della riunione bassa**: su un telefono vero con la barra del browser visibile
  `100vh` è più alto dello schermo che si vede, e la riunione risulterebbe più alta del necessario di quanto la barra (è la scelta già fatta da `--chiamata-ferma-altezza` e `--scelta-tavolo-altezza`); da provare con una finestra vera.
- Lingue con testo più lungo o scritture con altre righe: la bolla fa una riga in più e a 326×326 non sta (en-XA: 276 contro 254 px; in arabo con righe più alte manca 1,9 px a 326×326, con la riunione già al minimo).
- Testo grande e zoom; la matrice dei 15 dispositivi in Firefox e WebKit (solo le misure principali); il catalogo in Firefox e WebKit a 390×844.
