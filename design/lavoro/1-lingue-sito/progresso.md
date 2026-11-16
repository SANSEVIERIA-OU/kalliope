# Incarico 1 · Lingue nel sito: progresso e consegna

Ultimo aggiornamento: 16/11/2026, sera. **Stato: finito**, tranne ciò che sta sotto «Non verificato» e «Problemi aperti».
Nessun commit e nessun push. Le impronte dei file su cui girano le prove: `impronte-inizio-giro.txt` (prima del giro di prove) e
`impronte-fine-giro.txt` (dopo): **uguali**; dopo il giro sono cambiati soltanto i testi dei messaggi degli strumenti
(`impronte-dopo-i-messaggi.txt`: solo `tools/`), e il sito costruito è rimasto **identico byte per byte** (`diff -r` fra le due costruzioni),
quindi le foto restano valide; i test degli strumenti, `translations.py` e `css_logico.py` sono stati rifatti dopo.

## Che cosa c'è

- **Formato**: gettext `.po`, lingua di partenza l'italiano. Le pagine di `website/` restano leggibili in italiano e segnano ciò che si
  traduce con attributi `data-*` (`docs/translating.md`, «The marks in a page»). `tools/translations.py extract` ne ricava
  `website/lingue/site.pot` e `it.po` (114 messaggi per la home) e aggiorna ogni `<xx>.po`; **aggiungere una lingua è aggiungere
  `website/lingue/<xx>.po`** (`translations.py new xx` lo avvia).
- **Specchio**: 86 righe fisiche → logiche in `base.css`, `componenti/*.css`, `catalogo/*.css`; 11 scorciatoie asimmetriche → due token
  (`-blocco`, `-inline`); 6 token `sinistra`/`destra` → `inizio`/`fine`; `--verso` e `:root:dir(rtl)`; `Testi.verso()` in `scena.js`;
  `tools/css_logico.py`; l'elenco dei punti con un verso: `versi.md`.
- **Indirizzi**: `/` è la scelta della lingua (`website/lingue.html`, `lingua.js`), una cartella per lingua (`/it/`, `/en/`…), i file condivisi
  (`voce/`, `immagini/`, `design-system/`, `scena.js`, …) restano in cima, i vecchi indirizzi sono pagine di rimando statiche a `/it/…`
  (con ricerca e frammento), la 404 resta in cima. `<html lang dir>`, `canonical` e `hreflang` (tutte le lingue costruite più `x-default`),
  selettore della lingua nella barra (una voce) e nel piede (l'elenco), `{{kalliope.*}}` come prima.
- **Date, grandezze, numeri, plurali da CLDR 49.0.0**: `tools/data/cldr.json`, fatto da `tools/cldr_data.py` dai file JSON ufficiali
  (`unicode-org/cldr-json`); nessuna tabella scritta a mano. In `site.py` (Python) e con `Intl` nel browser (`website/testi.js`).
- **Pseudo-lingue** `en-XA` (accentata, circa +40%, `[delimitatori]`) e `ar-XB` (RLO + `dir="rtl"`): `site.py --pseudo`, mai pubblicate,
  `noindex`, fuori dal selettore e dagli `hreflang`.
- **Documenti**: `docs/translating.md` (nuovo), `docs/releasing.md` («Website»), docstring di `tools/site.py`, `design-system/SISTEMA.md` e
  `TOKEN.md`, `design-system/metodo.config.mjs`, `.github/workflows/ci.yml` (un passo) e `pages.yml` (i percorsi che ripubblicano).

## Scelte, con il perché

1. **Convenzione di segnatura**: attributi `data-t="chiave"` (contenuto), `data-t-<attr>="chiave"` (attributo), `data-t-plurale`, `data-t-n`,
   `data-t-nota`, `data-t-no`. Un testo con markup dentro diventa un messaggio con tag numerati `<1>…</1>`/`<1/>`: gli attributi
   (indirizzi, classi) restano nella pagina, il traduttore sposta le parole e non può rompere il markup, e il controllo lo verifica
   (stessi tag, ognuno una volta, nello stesso tag). Alternative scartate: un file di testi separato dall'HTML (la pagina non si
   leggerebbe più in italiano); il markup scritto per intero nel `msgstr` (un traduttore potrebbe cambiare un indirizzo).
2. **Chiavi**: `msgctxt` scritto nella pagina (`apertura.titolo`), stabile. Cambia il testo italiano → la traduzione resta nel file,
   `fuzzy`, con il testo di prima in `#| msgid`; una chiave tolta va in fondo come `#~`. Lo fa `extract` (nessun `msgmerge` su questa macchina).
3. **Testo che usa lo script**: sta nella pagina, in `<template id="testi-scena">` (non si disegna), con `data-t` come ogni altro testo;
   `testi.js` lo dà allo script. Ciò che è già nella pagina (lo stato «Pronta…», i nomi delle voci, le frasi) lo script lo legge dal DOM:
   si traduce una volta sola. Le tre frasi si ricavano dalla pagina (parti, gruppi «1.250 € +» → «milleduecentocinquanta euro più»,
   unità, chi annuisce): **uguali a quelle di prima**, provato.
4. **Dati CLDR**: un file generato e versionato con la sua fonte e licenza (Unicode License v3), letto da Python standard; la rete serve
   solo a chi lo rigenera. Controllato contro Node ICU 78 (CLDR 48): data lunga, «14,1 MB» e numeri **uguali in tutte e 30 le lingue**.
5. **Plurali**: le forme sono quelle che CLDR definisce per la lingua (ar 6, ga e mt 5, cs sk lt pl sl 4, hr ro lv fr es pt it 3, zh id 1,
   le altre 2: `ricerca/lingue.md`), l'intestazione `Plural-Forms` si ricava dalle regole CLDR e si prova contro gli interi di esempio che
   CLDR dà per ogni regola; il controllo confronta **per significato** (1200 interi e i multipli di un milione), non per grafia.
6. **Regola di pubblicazione** (scritta in `docs/translating.md`, «Add a language»): una lingua si costruisce se il suo `.po` è
   **completo e controllato**: ogni chiave del modello, nessuna vuota o `fuzzy` o tradotta da un italiano più vecchio, tag e segnaposto
   intatti, intestazione giusta. Altrimenti **non si costruisce e il log lo dice** (`language de: left out, de: 112/114 entries ready (2
   missing); first: …`). L'italiano si costruisce sempre. Un errore in una traduzione non ferma il sito: lascia fuori quella lingua; la CI
   (`translations.py check`) fallisce sugli errori, non sulle lingue incomplete.
7. **Pagine di prima**: senza segni, si costruiscono solo in italiano (`/it/installa/`…); le altre lingue collegano alla loro versione
   italiana. I loro indirizzi interni si riscrivono nella costruzione (non si toccano i sorgenti), e un collegamento rotto fa fallire la
   costruzione solo se sta in una pagina tradotta (la pagina di prima `sistema/` ha un collegamento finto di proposito: avviso).
8. **Il selettore**: una voce «Italiano» nella barra (nel menu: al telefono nel menu aperto) che porta all'elenco di tutte le lingue nel
   piede (`#lingue`, come «Menu» porta al piede senza script), e l'elenco nel piede (collegamenti, ognuno con `lang`, `hreflang`,
   `aria-current`). Fatto con ciò che c'è (`.menu`, `.piede ul`): nessun componente nuovo, l'aspetto lo decide l'incarico 2. Una voce
   del menu che porta dentro la pagina ora chiude il menu (prima restava aperto sopra il piede).
9. **Scelta ricordata**: `localStorage` (`kalliope.lingua`), nessun cookie, solo dopo un clic su una lingua; `/?lingue` mostra la scelta anche
   con una lingua ricordata. Il piede dice ancora «non usa cookie né statistiche»: resta vero, ma il sito ora ricorda la lingua in questo
   browser: da dire nel testo nuovo.

## Prove (numeri)

- **Italiano identico** (sito costruito senza il selettore, `--no-selector`, contro quello di HEAD; «riduci movimento»; 3 foto per parte, per
  schermata conta la coppia più vicina): Chromium 1440×900, 390×844, 820×1180, 1366×640 + menu, ascolto, errore audio a 390: **30/30 a 0
  pixel** (3 schermate sono rumorose già fra le foto di prima); Firefox e WebKit 1440 e 390: **13/13 ciascuno**; senza JavaScript 1440 e 390:
  **13/13**; le sette pagine di prima e la `non-ancora` di HEAD spostate in `it/`: **0 pixel** a 1440 e 390 (16/16). Il solo specchio del
  CSS (prima del resto): 27/30 a 0 e le altre con rumore (12, 42, 83 pixel, scarto 3, 3, 22).
- **Con il selettore** (la costruzione vera) le differenze sono spiegate: una fascia di 3776 pixel nella barra a 1440 e 1366 (le voci del menu
  scorrono di 97 px per fare posto a «Italiano»), il piede più alto (ultime schermate: 184000–641606 pixel perché cambia dove sta il
  fondo della pagina), una voce in più nel menu aperto a 390 (22623), più il cerchio che gira (104 pixel, scarto 60). Foto:
  `foto/selettore/`.
- `controlla-sorgenti.mjs` (da `design-system/`): **verde**, «20 fogli di stile, valori solo nei token» (16 + 4 delle pagine interne
  dell'incarico 3a).
- Traduzioni: `tools/test_translations.py` **49 prove**, con le copie guastate apposta (chiave tolta, tag rotto/tolto/spostato/in più, segnaposto
  cambiato, forme dei plurali sbagliate, intestazione sbagliata, testo non segnato, `&` e `<` sciolti, italiano cambiato → fuzzy, voce tolta →
  obsoleta, lingua incompleta → non costruita, collegamento rotto → costruzione ferma, marcatore sconosciuto → costruzione ferma);
  `translations.py extract --check` e `check --complete` verdi; `css_logico.py` verde sui fogli di adesso e **rosso sui fogli di prima**
  (90 fisiche, 12 scorciatoie asimmetriche, 6 nomi, 2 testi).
- Scelta e indirizzi (`prove/prova-lingue.mjs`, sito con ar bn en it pl zh): **36/36 in Chromium, Firefox e WebKit**: nessuno spostamento,
  lingua del browser per prima, nessuna bandiera, memoria, `?lingue`, lingua ricordata non pubblicata ignorata, elenco → stessa pagina,
  senza JavaScript (scelta, elenco, vecchio indirizzo), vecchi indirizzi con ricerca e frammento (8 su 8), 0 richieste fallite e 0 errori,
  `--verso` = 1 / −1 letto dal CSS e da `Testi.verso()`, cifre bengalesi con `Intl`, «0:03» e «1234,5» come prima.
- Plurali nel browser (`prove/prova-plurali.mjs`, en pl ar zh con le loro forme CLDR): **32/32**. Menu → lingua (`prova-menu-lingua.mjs`):
  ok nei tre motori, **rosso sulla copia di prima**. Catalogo: legge 717 token, 0 errori. 404 sotto `/kalliope/`: 10/10 collegamenti portano in `it/`.
  Ordine di Tab: uguale a prima (26 soste a 1440, 22 a 390), lento e veloce; con il selettore una sosta in più (barra) e una nel piede.
  La costruzione vera con l'API delle versioni (`python3 -I tools/site.py --out DIR`): ok.
- **Testi rimasti in italiano** (`prove/testi-rimasti.mjs` su `en-XA`, pagina viva: arrivo, scena che scrive e parla, scorrimento, primo avvio,
  menu, ascolto, errore audio, filo): **nessuno**; la controprova (una stringa dello script e una frase della pagina rimesse in italiano) la
  trova.

## Pseudo-lingue: che cosa si rompe (foto in `foto/pseudo-en-XA/` e `foto/pseudo-ar-XB/`; l'aspetto lo decide l'incarico 2)

`en-XA` (testo circa +40%):
1. **A 1440 la barra compatta si sovrappone**: con l'azione in barra (scorrendo) il menu scivola a sinistra e il nome del marchio finisce sotto
   «Ascolta» (`foglio-1440-a.png`, 2ª e 3ª foto; `foglio-1440-b.png`, 1ª). La barra non ha un minimo fra marchio e menu.
2. **Il nome «Tu · microfono «Kalliope»» esce dalla sua tessera** e copre il nome di Paola, a 390 e 1440 (hero, app, tavolo): `foglio-390-a.png`, `-b.png`.
3. **Il nome del marchio** (`.marchio span`) ha una larghezza massima e `overflow: hidden`: un nome molto più lungo è tagliato senza puntini (lo si
   vedeva nella prima versione della pseudo-lingua, con il nome allungato più del 40%; con il 40% ci sta).
4. **«Scrivi qui e premi Invio per parlare»** (campo) e le righe della finestra: tagliati con puntini (voluto), e la riga di stato va a capo su 3 righe.
5. **Le unità che non vanno a capo** (`.unita`: «alle 15:30?», «31 dicembre.») escono dalla bolla se la traduzione è molto più lunga: c'è il
   rischio anche con traduzioni vere (provato con un riempitivo dentro l'unità; l'ho tolto dalla pseudo-lingua perché lo esagerava).
6. Titoli e paragrafi: vanno a capo senza tagli; il menu aperto a 390 regge la voce lunga della lingua.

`ar-XB` (le stesse parole forzate da destra a sinistra, `dir="rtl"`): la struttura si specchia da sola (barra, griglie, riunione, bolle,
finestra, strada, requisiti, righe del filo, il bordo del «Oggi:»), e le cose da decidere sono **tutte** in `versi.md`:
1. la **luce** rosa resta a destra dietro il titolo invece che dietro la riunione (posizione fisica con `translate(-50%, -50%)`);
2. a 1440 con l'azione in barra l'azione **copre «Installa»** (il menu scivola dalla parte sbagliata: `translateX(-posto)`);
3. la **coda della bolla** punta ancora in basso a sinistra, e le **frecce** dei collegamenti (`→`) puntano a destra e stanno prima del testo;
4. **tutte le animazioni** che hanno un verso (barra di avanzamento, strada, ingresso dell'azione, testa e occhi che si girano verso «Tu») vanno dal
   lato di prima; in «riduci movimento» non si vede;
5. i caratteri: Lexend non ha l'arabo (il testo di `ar-XB` è italiano forzato da destra a sinistra, lettere latine: l'arabo vero, con le sue forme e le sue altezze, non si è visto).

## Per chi coordina

- **Non verificato**: Firefox e WebKit solo per l'italiano a 1440 e 390 (non negli stati, non a 820 e 1366); `:dir()` e le proprietà logiche
  richiedono browser del 2023-24 in su (Chrome 120, Safari 16.4; Firefox da sempre): su uno più vecchio la pagina italiana è giusta e quella da
  destra a sinistra non si specchia; l'arabo vero (nessun catalogo vero, solo pseudo-lingue e cataloghi di prova); nessun import in Weblate o
  Pontoon e nessun `msgfmt` su questa macchina (i `.po` si leggono e si scrivono con il lettore di `tools/i18n/po.py`, scritto sul formato);
  `esame-impaginazione.mjs` e `soglie.mjs` non sono stati lanciati (non è un percorso nuovo); le 15 viewport e la matrice (fase 5).
- **Il lavoro dell'incarico 3a, nello stesso albero**: `design-system/componenti/{pagina,riunione-ferma,strada-ferma,versioni}.css`, `website/cornice.js`,
  `website/non-ancora/`, il blocco in fondo a `token.css` e le righe sue in `TOKEN.md`/`SISTEMA.md` non sono miei; `css_logico.py` e
  `controlla-sorgenti` passano anche con i loro fogli. **`token.css`, `TOKEN.md` e `SISTEMA.md` hanno modifiche di tutti e due**: un commit
  solo per entrambe, o `git add -p`. La loro `non-ancora` non ha ancora i segni `data-t`: va segnata come la home (`docs/translating.md`).
- **Foto**: `foto/` pesa 6 MB di PNG (pseudo-lingue, selettore, scelta con 30 lingue); `/design/incarichi/*/*/` è ignorato da git per le
  catture di pagine, `design/lavoro/` no: decidere se committarle.
- **Decisioni che si ribaltano con una riga**: fuzzy → non pubblicare (ora sì) oppure pubblicare con un avviso; la scelta ricordata (ora
  `localStorage` dopo un clic); il nome della lingua nel selettore (CLDR, maiuscola solo dove CLDR lo dice per i menu: «Italiano», «eesti»).

## Per la ripresa (se serve)

Ultimo comando di prova: `node design/lavoro/1-lingue-sito/prove/testi-rimasti.mjs /tmp/lavoro-1-fin-pseudo`. Per rifare tutto:
`python3 -I -m unittest discover -s tools -p 'test_*.py'`; `python3 -I tools/translations.py extract --check && python3 -I tools/translations.py check`;
`python3 -I tools/css_logico.py`; i programmi in `prove/` (si lanciano come in testa a ciascuno; PLAYWRIGHT=…, nessuna finestra).
