# Incarico 3a-b · «non ancora»: costruzione (completare senza ridisegnare) · progresso

Ruolo design-build. Incarico: `design/lavoro/incarichi/3a-non-ancora-costruzione.md`. Commit di partenza `0cf5c64`. Nessun commit, nessun push, nessuna
finestra sullo schermo, nessun altro agente. **Stato: consegnato** (17/11/2026, ~03:00). Porte 8810-8819, cartelle `/tmp/lavoro-3ab-*`.

## Come si prova (per chi riprende)

Fino al commit `8c7fae1` (17/11 01:39) l'incarico 2 cambiava nello stesso albero i file condivisi e a metà modifica la pagina si rompeva per colpa sua
(`foto-difetti/riunione-css-a-meta-modifica-*.png`, sistemata da lui dopo pochi minuti): le prove di allora giravano su una copia isolata (base `0cf5c64` più i
miei file; esiti in `esiti/base0cf5c64-*` e `esiti/esplorazione/`, anche rossi, prima delle correzioni). **Le prove finali girano su un'istantanea dell'albero vivo
delle 01:44** (`prove/sincronizza.sh` → `/tmp/lavoro-3ab-lavoro/radice-F/`), costruita con
`python3 -I radice-F/tools/site.py --out /tmp/lavoro-3ab-sito-G --release-json /tmp/lavoro-3ab-releases.json --pseudo`. Le serie sono `prove/serie-A.sh … serie-J.sh`
(`serie-V.sh`: la verifica rapida sull'albero vivo di dopo); ogni esito in `esiti/F-*.txt` (V-* per la verifica di dopo); foto in `foto/`, `foto-pseudo/`, `foto-difetti/`.

## Impronte (le stesse prima e dopo il giro: `esiti/impronte-prima.txt` = `esiti/impronte-dopo.txt`)

File di questo incarico (primi 16 caratteri di sha256; la copia provata e l'albero vivo coincidono): `non-ancora/index.html` 869edfeebd6a8891 · `non-ancora.js`
7c58ed2a9bfc7e2b · `cornice.js` 09007c7fd0fc98b8 · `pagina.css` 99eead94116ace97 · `riunione-ferma.css` fe44a385a58c6e0b · `strada-ferma.css` b11c1389eab74861 · `versioni.css`
7362680b7cab558d · `catalogo-pagine.js` 8075220ed8820318 · `catalogo-pagine.css` cfffbde516c2d652 · `metodo.config.mjs` 890c29e8b824247f · `site.pot` 0b5c1d072ff2b06d · `it.po`
50484136ff77049c. Copia intera (website, design-system, tools) `ab407cfedd9c82fb07b9ce995dc88c1c`; sito costruito (sito-G) `06f3e150231e0bf17951e00ea99f34e3`.
**Dopo l'istantanea l'incarico 2 ha toccato di nuovo** `barra.css`, `lingue.css`, `riunione.css`, `scena.js`, `tools/site.py` (correzioni dopo il suo giudizio): sull'albero vivo di
quel momento (impronta `cd8e0011530a9e7750bb7d56367fb4c5`, `esiti/impronte-albero-vivo-V.txt`) ho rifatto una verifica rapida, `esiti/V-*.txt`: esame a 6 misure pulito, stati 47/47 a 1440×900 e
390×844, robustezza 23/23 e 24/24. Il resto della matrice sui file di prima.

## Fatto

- **Traducibile.** 153 messaggi (114 della home + 39 della pagina; `it.po` 153/153): `data-t` ovunque (chiavi `na.*`; le chiavi della home dove il testo è identico), `<template id="testi-pagina">`
  per lo script, `testi.js`. `translations.py check`, `extract --check`, `check it --complete`, 49 test, `css_logico.py`, `controlla-sorgenti.mjs` (23 fogli, valori solo nei token): verdi sulla copia e sull'albero
  vivo (`esiti/controlli-statici.txt`, `controlli-albero-vivo.txt`). La pagina si costruisce in una lingua con un `.po` completo (`de`, `ar`: `esiti/F-lingua-completa.txt`) e in `en-XA`/`ar-XB`; in `en-XA` nessun
  testo resta in italiano (104 testi in 9 momenti: `prove/pseudo-testi.mjs`; controprova su una copia guasta apposta: trova i 2 testi rimessi in italiano). **L'italiano a riposo è identico a quello
  della direzione** (`confronta-scelta.mjs`, 0% pixel diversi a 1440×900, 390×844, 1366×640, 844×390, 360×640, con «riduci movimento»; `esiti/F-confronta-scelta-ridotto.txt`).
- **Catalogo (I4).** `design-system/catalogo/catalogo-pagine.js` + `.css` (+ 6 righe in `index.html`): sezione «Pagine interne» con 5 schede (cornice, riunione ferma, strada ferma, versioni, ascolto della chiusura), 38 prove
  con stati e varianti (riposo, forzati con le classi del sistema, testo più lungo, senza JS, prima dell'arrivo, il momento riproducibile, le risposte di «Copia», i quattro stati del comando con la larghezza misurata), 6 pagine
  vive a misure vere, tabella «dove stanno comando e stato» misurata adesso nella pagina viva. `prove/catalogo.mjs`: 9/9 in Chromium, Firefox, WebKit a 1440×900 e Chromium a 390×844.
- **M1** messaggio d'errore sotto il comando (`errori.css`, «Riprova» e il file da scaricare), bolla di nuovo grigia, nessuna voce in riunione, niente lettore grigio. **M2** etichette nella stessa cella: 211 px in tutti gli stati, «Tutte le frasi»
  sempre a x 691. **M5** premere prima dell'entrata porta la scena intera (`Cornice.rivela` + `finish()`) e poi suona. **M6** `width`/`height` sui disegni; lo script riconosce i token mancanti (senza fogli di stile: 2.906 px contro 19.644 e nessun
  errore; controprova rossa su 0cf5c64). **M7** la freccia da destra a sinistra l'ha sistemata l'incarico 2 in `pulsanti.css`: verificata (`prove/verifica-freccia.mjs`, `esiti/F-freccia-*.txt`: `matrix(-1,0,0,1,0,0)` in ar-XB).
- **Stati**: «Carico…» mentre carica e dopo 250 ms di attesa dati; messaggio «lento» a 6 s che sparisce quando il suono parte; nome accessibile del comando per stato («Ascolta Giulia», «Carico la registrazione, premi per annullare», «Metti in pausa», «Riprendi»; le etichette
  invisibili non entrano nel nome) e annuncio «Sto leggendo la frase, voce di Giulia.»; scheda in secondo piano (suono in pausa, orologio e animazioni fermi, il tentativo riparte da dov'era; aperta in secondo piano il tentativo parte quando la si guarda); il tentativo
  si interrompe solo se cambia la larghezza e va allo stato finale, uguale a quello del tentativo finito; «Copia»: risposta annunciata a ogni pressione e portata in vista, frase dei preferiti dove gli appunti non ci sono; il contorno del fuoco nel pannello scuro sulla scena chiara
  (era bordeaux su scuro, 1,3:1): `.scena-chiara .versioni :focus-visible { outline-color: var(--voce) }` in `versioni.css`.
- Difetti trovati con le prove e corretti: la risposta di «Copia» sotto il bordo a 320 px; il comando «Ascolta» che spariva sotto il bordo premendo sugli schermi bassi; il contorno del fuoco sul comando di «Copia». Ognuno è ora una prova che fallisce sulla copia di prima
  (`esame` degli stati, `robustezza.mjs`: rapporto del contorno, `senza-stili`).
- `design-system/metodo.config.mjs`: gli stati di «non ancora» (riposo, menu, ascolto, errore audio, copia fatta e non riuscita), `escludi: '.solo-lettori'`, i **limiti dichiarati** (sotto). `SISTEMA.md`: sezione «Le pagine interne» (la cornice, `cornice.js`, la regola «vince il comando», i quattro pezzi, il catalogo, la configurazione). `PIANO.md`: «Completato dalla costruzione» con le scelte da confermare.

## Prove, con i numeri (Chromium salvo dove detto; `esiti/F-*.txt`)

| Prova | Esito |
|---|---|
| `esame-impaginazione` 6 stati × 36 misure delle soglie (320…1920 a 900 px) | 204 casi puliti, 15 stati assenti (il menu dove la barra mostra le voci) |
| ... × altezze 500 501 699 700 759 760 799 800 802 803 819 820 a 390, 844, 1366, 1440 | 268 puliti, 8 con limite dichiarato (500 e 501) |
| ... a 360×640 390×667 375×812 412×915 915×412 320×568 1024×600 820×1180 1366×640 861×609 421×616 951×669 466×678 | 77 puliti, 3 con limite dichiarato |
| `dispositivi-qa` 15 dispositivi × stati | 88 casi puliti, 5 limiti dichiarati, nessun «limite non usato» |
| Firefox, 390×844 1440×900 844×390 360×640 | 22 puliti, 1 segnalazione: lo stato «ascolto» a 844×390 mostra l'errore (nessuna uscita audio) |
| WebKit, stesse misure | 24 puliti, 2 limiti dichiarati; `dispositivi-qa` Telefono, Telefono girato, Computer: 18, 6, 5 puliti (Firefox: gli stessi, 1 segnalazione) |
| `stati.mjs` (ascolto + pausa + ripresa + fine, errore + Riprova, lento, attesa dati, secondo piano, copia, copia no, tentativo, ridimensiona, solo altezza, nascosto, nascosto da subito) | Chromium 57/57 a 1440×900 e 390×844; 42/42 a 844×390, 360×640, 1366×640; WebKit 56/56 ×2 (1 non verificato: il file a goccia non lo fa aspettare); Firefox 56/56 ×2 (8 non verificati: senza uscita audio il suono non parte) |
| `robustezza.mjs` (tastiera lenta 2,6 s e veloce, senza JS, senza stili, senza token, «riduci movimento», scorrimento veloce e ancore, ritorno, ricarica) | Chromium 42/42 (1440×900), 43/43 (390×844), 20/20 (390×667), 19/19 (844×390), 20/20 (360×640); WebKit 42/42 e 43/43; Firefox 42/42 (4 non verificati) e 42/43 (vedi «Difetti non miei») |
| catalogo `catalogo.mjs` | 9/9 in Chromium, Firefox, WebKit (1440×900) e Chromium 390×844 |
| pseudo-lingue `esame` en-XA / ar-XB a 5 misure | ar-XB pulito; en-XA: solo la barra a 1366×640 (sotto) |

**Limiti dichiarati** (`metodo.config.mjs`, una voce per decisione; li ho scritti io sul modello della regola della direzione, **da confermare**): dove l'altezza non basta per la bolla, i riquadri, il comando e il messaggio d'errore (altezze 500 e 501, 844×390, 915×412, 326×326, 320×568) il messaggio d'errore sta
per intero nello schermo e la bolla va sotto la barra; mentre suona (844×390, 915×412, 326×326) vince la bolla dove le parole si accendono e il comando «Pausa» resta sotto il bordo (foto `foto-difetti/limite-*`, `ascolto-844x390-vince-il-comando-bolla-sotto-la-barra.png` mostra l'altra scelta, quella della home). Più in generale l'errore con la
bolla in vista chiede almeno ~610 px d'altezza: fra 500 e ~600 la bolla è sotto la barra (provato: 1366 fino a 580, 390 fino a 560).

## Pseudo-lingue: che cosa si rompe (foto `foto-pseudo/`; non ridisegnato: lo decide la direzione)

- **en-XA (+40%)**: (1) a 390 px le pillole `nowrap` escono dal loro fondo: il comando principale («Come saperlo quando arriva…») di 3 px, «Copia l'indirizzo…» di 40 px (356 contro 316), il testo taglia i bordi (`en-XA-390-comandi-apertura.png`, `en-XA-390-versioni-copia.png`,
  `en-XA-390x844-fogli-1.jpg`); (2) a 1366×640 le voci della barra vanno a capo in due righe («STRETTO» ×3, `en-XA-1366x640-barra.png`); il resto regge: titoli e testi vanno a capo, i riquadri e le tappe non escono, strada e versioni a una colonna.
- **ar-XB**: la pagina si specchia da sola (barra, scena a sinistra e testo a destra, strada da destra a sinistra, coda della bolla a destra, riunione, elenco); la freccia punta a sinistra; nessuna segnalazione dell'esame. (Il carattere arabo vero e il cursore sono dell'incarico 2.)

## Difetti non miei (con la foto)

1. `riunione.css` dell'incarico 2 a metà modifica (~00:15): `.barre {` sostituita da `.nome {…}`, barra del microfono alta 230 px invece di 54, comando principale a 813–905 px a 390×844 (`foto-difetti/riunione-css-a-meta-modifica-*`). Sistemato da lui; foto dopo: `riunione-css-sistemata-dopo-*`.
2. **La barra raccolta (la sua correzione B1, in `scena.js`) non arriva alle pagine interne**: `cornice.js` non ha quella misura; in en-XA a 1366×640 le voci della barra vanno ancora a capo anche sull'albero vivo (`esiti/V-pseudo-esame-en-XA.txt`). Da portare in `cornice.js` quando la sua regola è ferma (non l'ho fatto: è sua).
3. Pillole `nowrap` (pulsanti.css) che escono dal fondo con testi più lunghi (sopra).
4. Firefox, 390×844, Tab: i due collegamenti della seconda riga del piede («In riunione», «Aiuto») finiscono 14 px sotto il bordo (`F-robustezza-firefox-390x844.txt`; Chromium e WebKit scorrono per intero): piede, `scroll-padding-bottom`.
5. M3/M4/M8 del giudizio non sono della costruzione (didascalia al telefono, leggibilità della frase grigia, dubbio E).

## Non verificato

- **Il suono ascoltato**: nessuna uscita audio su questa macchina (Chromium e WebKit suonano su un'uscita finta; Firefox dà errore a ogni suono: 8 esiti «non verificato» per scenario, per questo, non per un difetto). L'attesa dati a metà frase è provata solo in Chromium (il file a goccia non fa aspettare WebKit).
- Lettori di schermo (nome accessibile e annuncio provati solo dall'albero di accessibilità di Playwright, non con Orca o NVDA); il bfcache (in Chromium senza finestra il ritorno ricarica la pagina); testo grande e zoom 125–200% (non rifatti per questa pagina); la matrice 15 dispositivi × 3 motori (solo Chromium per i 15; i principali negli altri); la barra di scorrimento classica; telefoni veri; il feed `releases.atom` (non riaperto); i tempi della strada e i parametri delle onde in `non-ancora.js` non sono ancora token (come in `scena.js`); `<meta name="text-scale">` non messa (come la home).
- Dopo l'istantanea l'incarico 2 ha toccato di nuovo i file condivisi: matrice completa non rifatta su quelli (vedi «Impronte»).
