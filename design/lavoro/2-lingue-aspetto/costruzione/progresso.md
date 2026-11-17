# Incarico 2-b · Lingue: completare senza ridisegnare · progresso

Ruolo design-build. Incarico: `design/lavoro/incarichi/2-lingue-costruzione.md`. Punto di partenza: commit `82823d5` (poi `71a8cc7`, solo documenti).
Nessun commit, nessun push, nessuna finestra. Cartelle in `/tmp/lavoro-2b-*`, porte 8840–8849. Prove e script miei: `costruzione/prove/`, misure
grezze: `costruzione/misure/`.

## Stato

- 17/11/2026. Letto incarico, STATO.md, progresso della direzione e della correzione, skill (direzione §6, prove, presidi, catalogo).
- **Punto 1 (una lingua sola): fatto** in `tools/site.py`, prove in `tools/test_translations.py`.
- **Punto 2 (precarico): fatto**, con una scelta contraria alla lettera dell'incarico, da confermare (sotto).
- **Punto 5 (catalogo): fatto**, con un difetto che il punto 1 aveva creato nel catalogo e che ho corretto alla causa (sotto).
- **Punto 3 (selettore e scelta: stati, tastiera, lettori): fatto**, con cinque difetti trovati e corretti alla causa e una cosa provata che non era un difetto.
- **Punto 4 (larghezze e motori): fatto** (corsa finale di `coda.mjs`, sotto «Corsa finale»); trovati e corretti tre difetti (l'elenco nel menu che scorre, l'azione della barra su più righe, la misura della barra che dipendeva dalla storia).
- **Stato: finito**, salvo «Non verificato» e «Difetti non miei» in fondo. Nessun commit, nessun push.
- Le porte: ho usato quasi sempre la porta scelta dal sistema (0); per poche prove brevi ho aperto anche 8850–8854, che sono dell'incarico 3a-r (server chiusi a fine prova, nessun conflitto notato).
- **Solo i file in `esiti/finale/` e in `misure/` contano come esito finale**; le cartelle `esiti/*.txt` fuori da `finale/` sono prove fatte su copie precedenti dei file (le ho tenute perché non cancello).

## Punto 1 · una lingua sola

- `tools/site.py`, in `build()`: con meno di due lingue pubblicate (le pseudo-lingue non contano) la costruzione imposta `senza_selettore` (il
  meccanismo che c'era già per `--no-selector`: toglie la voce della barra e l'elenco del piede) e scrive `/index.html` con `pagina_rimando`
  (stesso rimando dei vecchi indirizzi: `<meta refresh>` e `location.replace(… + search + hash)`, canonical su `/it/`). La seconda lingua
  completa fa tornare tutto da sola (nessun'altra modifica).
- La costruzione vera (solo `it`) è identica, byte per byte, a quella con `--no-selector` (`diff -r`); rispetto alla costruzione di `82823d5` cambiano
  solo la `<li class="lingua-voce">` della barra, il `<nav class="lingue">` del piede e `/index.html`.
- Prove: `tools/test_translations.py` 72 prove (erano 52; 4 sono di 3a-r, `DataRelease`; le mie 16 sono nelle classi `Sito`, `SitoVero`, `Precarico`, `DaDestraASinistra`): `test_solo_italiano` (esteso), `test_con_la_seconda_lingua_tornano_il_selettore_e_la_scelta`,
  `test_una_lingua_incompleta_non_riporta_il_selettore`, `test_le_pseudo_lingue_non_contano_per_il_selettore`, e sul sito vero `SitoVero`
  (home e «non ancora», con una lingua e con due). **Controprova**: con la `site.py` di `82823d5` falliscono (4 delle nuove sul sito di prova e sul sito
  vero; nel registro `/tmp/lavoro-2b-controprova-1b`); con la nuova passano tutte.
- `prove/radice.mjs`: da `/`, `/?lingue`, `/#a`, `/installa/`, `/installa/?x=1#y`, con e senza JavaScript, in Chromium, Firefox e WebKit: **30 su 30**; con
  JavaScript restano query e frammento, senza arriva la sola pagina (il `<meta refresh>` non può portarli: come per i vecchi indirizzi), e «Indietro»
  torna alla pagina di prima e non sul rimando. Contro la costruzione di `82823d5` (la scelta in `/`): 6 rosse su 10 in Chromium.
- Il selettore nella barra di «non ancora»: la costruzione toglie la voce vecchia (`<a data-lingua-corrente>`) e quella nuova
  (`<li><details class="lingua-scelta">`) allo stesso modo; `SitoVero` lo prova su quella pagina com'è adesso e controlla da sé la nuova quando
  l'avrà.

## Punto 2 · il precarico del carattere

- `tools/site.py`: `caratteri_per_lingua()` legge da `design-system/token.css` quale file disegna il primo schermo di ogni lingua (la prima famiglia, con
  `@font-face` e `url()`, della regola `:lang(xx)` che dà `--font-testo` e che la pila di base non ha: el, bg → Geologica; ar → Readex Pro; ur →
  Nastaliq; hi → Devanagari; bn → Bengali; zh nessuno, è di sistema); `precarica_carattere()` scrive `<link rel="preload" … as="font" type="font/woff2"
  crossorigin>` dopo quello di Lexend, nelle pagine traducibili di quella lingua (non nelle pseudo-lingue). La pagina italiana e quelle latine
  non cambiano di un byte (`diff -r` it, de, fi, zh, en-XA, ar-XB tra la costruzione di prima e quella con il precarico: identiche).
- **Misura** (`prove/precarico.mjs`, Chromium, contesto nuovo a ogni corsa, 390×844, tre corse; il tempo è quello in cui il titolo è disegnato da un
  carattere scaricato della scrittura, `CSS.getPlatformFontsForNode` ogni 25 ms). Due server: quello della libreria (HTTP/1.1, senza compressione:
  i fogli pesano cinque volte) e `prove/servi-h2.mjs` (HTTP/2 su TLS e gzip, come GitHub Pages). Contano le misure con HTTP/2 e gzip:

  | Lingua (file) | rete | testo nel carattere giusto, prima → dopo | primo disegno, prima → dopo |
  |---|---|---|---|
  | ar (Readex Pro, 22 KB) | 4G lento 1,6 Mbps, 150 ms | 1299 → 1077 ms (−17%) | 952 → 1032 |
  | ar | 3G 400 kbps, 400 ms | 4682 → 3630 (−22%) | 2948 → 3260 |
  | el, bg (Geologica, 22 KB) | 4G lento | 1304 → 1058, 1300 → 1061 (−19%) | 952 → 1024, 948 → 1032 |
  | el, bg | 3G | 4677 → 3626, 4680 → 3627 (−22%) | 2924 → 3244, 2944 → 3248 |
  | bn (Bengali, 102 KB) | 4G lento | 1712 → 1681 (−2%) | 948 → 1024 |
  | bn | 3G | 6253 → 6141 (−2%) | 2956 → 3260 |
  | hi (Devanagari, 118 KB) | 4G lento | 1803 → 1776 (−1,5%) | 948 → 1032 |
  | hi | 3G | 6631 → 6463 (−2,5%) | 2960 → 3240 |
  | ur (Nastaliq, 234 KB) | 4G lento | 2490 → 2384 (−4%) | 968 → 1028 |
  | ur | 3G | 9026 → 8860 (−2%) | 2940 → 3252 |

  Senza il precarico il browser scopre il file solo dopo aver impaginato il testo, e (la pila comincia da Lexend) solo dopo che Lexend latino è
  arrivato: il titolo passa dal ripiego (a 4G 0,35 s, a 3G 1,7 s). Col precarico, per i file piccoli il testo compare già nel carattere giusto
  (tempo del carattere ≈ primo disegno). Per i file grandi il file occupa la rete in ogni caso: guadagno 1–4%, e il primo disegno arriva dell'8–9% dopo
  (+0,06–0,08 s al 4G, +0,3 s al 3G). Misure con il server della libreria (HTTP/1.1 senza compressione, `misure/precarico-*.json`): stesso quadro, e peggio
  per i grandi (hindi: primo disegno +0,7 s al 4G, +2,1 s al 3G). Il punto in cui il precarico sta nella testa non cambia nulla (provato:
  dopo i fogli di stile, stessi numeri); `fetchpriority="low"` neanche.
- **Scelta, contraria alla lettera dell'incarico («ogni pagina…») e da confermare**: si precaricano soltanto i file piccoli (`PRECARICO_FINO_A = 40 000` byte
  in `site.py`, con la misura nel commento): ar, el, bg. Per bn, hi e ur il precarico non guadagna e ritarda il primo disegno. Un solo numero da alzare
  se chi coordina vuole tutte: `da_precaricare()` in `tools/site.py`. Il rimedio vero per i grandi non è il precarico ma meno byte (un sottoinsieme
  più stretto del Nastaliq, 234 KB, o un file per fette di `unicode-range`): non è dell'incarico.
- Prove: `test_translations.py` (`Precarico`, 5 prove, e 2 su `SitoVero`): il file lo dice token.css, i piccoli sì e i grandi no, l'indirizzo giusto
  per pagine a profondità diverse, dopo il precarico di Lexend, nessun'altra lingua né pseudo-lingua né pagina italiana lo ha. Controprova: con la `site.py` di
  `82823d5` falliscono tutte (8 prove rosse in `/tmp/lavoro-2b-controprova-2`).
- Limite della misura: la rete è emulata (CDP), il server è locale; in produzione contano anche le priorità HTTP/2 della rete di GitHub Pages.

## Punto 5 · il catalogo

- **La tabella dei token** (`design-system/catalogo/catalogo.js`): leggeva soltanto il primo `:root` (717 token). Ora legge tutti i blocchi `:root` di
  `token.css` (4: Base 717, «Pagine interne» 36, «Le scritture» 12, «Le lingue» 34 = **799**), con il titolo di ogni blocco preso dal suo commento di
  intestazione, i gruppi `/* · … */` (anche quelli su più righe, che il lettore di prima non vedeva), una colonna «Blocco», una «Sezione» (nei
  blocchi aggiunti, il gruppo) e una nuova «Varia»: per ogni token, come lo ridefiniscono `@media`/`@container` (larghezza), `:lang()` (scrittura) e
  `:dir(rtl)` (verso): `--verso` «da destra a sinistra: -1», `--interlinea-titoli-scrittura` «ar: 1.3 · ur: 1.75 · hi: 1.25 · bn: 1.25 · zh: 1.1».
  Campioni dal valore per i blocchi aggiunti (colori, px, durate). Cerca anche nel blocco e nella colonna «Varia».
- **Un difetto di prima, trovato guardando la tabella**: la pagina del catalogo era larga 3 951 px (a 1440, a 1024 e a 390) perché i campioni a barra delle
  misure in px (fino a 1440 px) e delle durate (fino a 3 436 ms → 3 299 px) allargavano la colonna «Campione» (`max-width: 100%` in una cella non limita).
  Ora i campioni hanno un tetto (`20em`, in `catalogo.css` e nelle due righe dei campioni): a 1440 la pagina è larga 1440 (nessuno scorrimento di lato); a
  1024 e a 390 la tabella (998 px) fa ancora scorrere la pagina di lato di 22 e 628 px (colonne con il nome del token senza andare a capo: com'era,
  non toccato). Foto: `foto/catalogo/`.
- **Un difetto creato dal punto 1, trovato dalla controprova**: con una lingua sola la home e `/` non hanno più la scelta nella barra, l'elenco del piede e la
  pagina della scelta, e la sezione «La scelta della lingua» del catalogo, che li **copia dalle pagine vere**, andava in errore («manca
  .lingua-scelta .lingue-elenco»; e la pagina della scelta viva diventava il rimando a `/it/`). Correzione alla causa: la costruzione scrive due
  file per il catalogo, `design-system/catalogo/esempio-home.html` e `esempio-scelta.html` (`esempi_per_il_catalogo()` in `tools/site.py`): le stesse pagine, costruite
  con le stesse funzioni, con le 30 lingue del registro (`tools/data/cldr.json`) come se fossero pubblicate, con `noindex`, senza canonical né hreflang e con
  `<base>`; `catalogo-lingue.js` li legge al posto di `../../it/index.html` e `../../index.html`. Il catalogo mostra sempre la scelta con 30 nomi, qualunque sia il numero
  di lingue pubblicate. Il catalogo ora mette gli errori della sezione delle lingue anche in `window.__catalogo.errori` (prima solo nel testo di stato).
- **Prova** (`prove/catalogo.mjs`, 12 controlli per motore) sul sito vero con una lingua sola: **Chromium, Firefox e WebKit: tutto ok**: 799 token letti = 799 contati a parte
  (Python, sui blocchi `:root`), 799 righe, 4 blocchi nella tabella, un token di ogni blocco aggiunto col suo blocco, «Varia» giusta, 13 sezioni, 9 riquadri
  delle scritture, 2 dello specchio, 2 pagine della scelta vive, scelta nella barra aperta con 30 voci, elenco 30, bolla 30, 21 riquadri tutti caricati, 0 errori di console.
  **Controprova**: il catalogo di prima sullo stesso sito: 6 controlli rossi (717 token, nessun blocco, «Varia» vuota, «manca .lingua-scelta .lingue-elenco», pagina
  della scelta viva 0/2). Anche il catalogo, fra le cose da non dichiarare completo, diceva «il sito è solo in italiano» e «Alfabeti: il sito è in italiano»: corretto.
- `tools/test_translations.py`: 69 prove, OK (una per i file di esempio, con una lingua e con due). `controlla-sorgenti.mjs` verde (23 fogli), `css_logico.py` ok.

## Punto 3 · il selettore nella barra e la pagina della scelta

Prove: `prove/selettore-barra.mjs` (tastiera, clic, scelta ricordata, ritorno e ricarica, telefono con il menu, schermo che cambia forma, senza JavaScript, movimento
ridotto e normale), `prove/selettore-scelta.mjs` (la pagina della scelta), `prove/selettore-a11y.mjs` (nome, ruolo, lingua di ogni voce). Esiti scritti in `esiti/`. Sul sito
di prova con 10 lingue (it + le 9 di prova: de fi el bg ar ur hi bn zh) e sul sito con 30 lingue per la pagina della scelta.

**Difetti trovati e corretti** (ognuno con la prova che fallisce sulla copia di prima):

1. **Un solo Esc chiudeva l'elenco e il menu del telefono insieme, e il fuoco saltava su «Menu».** Causa: `lingua.js` (su `document`) e il gestore del menu
   (`scena.js` e `cornice.js`, su `window`) rispondevano tutti e due. Ora Esc chiude lo strato che sta sopra: l'elenco (`stopPropagation`), il menu resta e il
   fuoco va sul comando; il secondo Esc chiude il menu. `website/lingua.js`. Prova: «390 · Esc dall'elenco chiude l'elenco, il menu resta e il fuoco va sul comando»: sulla copia
   di prima «elenco chiuso, menu chiuso, fuoco A»; ora «elenco chiuso, menu aperto, fuoco SUMMARY».
2. **Il tasto «Indietro» non portava mai fuori da una lingua.** Con una scelta ricordata «/» rimandava avanti ogni volta, anche tornando indietro dalla pagina
   di una lingua: da `/it/` «Indietro» finiva su `/` e subito di nuovo su `/it/`. `lingua.js`: il rimando non parte se la visita è un ritorno (`back_forward`) o una ricarica, né con `?lingue`.
   Prova «[ritorno] da «/» alla pagina italiana e «Indietro»: si torna alla scelta»: sulla copia di prima si finiva su `/it/`; ora su `/`, in Chromium, Firefox e WebKit.
3. **La pagina della scelta scorreva su niente**: la luce della stanza (più alta dello schermo, centrata al 52%) sporgeva sotto il bordo e la pagina scorreva di 143 px a 1440×900,
   206 a 1024×768, 9 a 820×1180, 388 a 844×390 (10 lingue); in fondo l'ultimo nome usciva dallo schermo a 844×390. `design-system/componenti/lingue.css`: `.mondo:has(> .scelta-lingua)
   { overflow-y: clip }`. Sopra il bordo non cambia un pixel. Con 30 lingue ora: 0 px a 1440×900, 1024×768, 820×1180, 390×844; 3 px a 844×390; vedi «Larghezze» per gli schermi bassi.
4. **Il comando della scelta si chiamava soltanto «Italiano»** (il testo del `title` era un suggerimento, non il nome): chi ascolta la pagina non sapeva che apre una scelta. La costruzione
   (`tools/site.py`, `passo_struttura`) dà al `<summary>` il nome «Cambia lingua: Italiano» (`aria-label` = il suo `title` già tradotto, due punti, la lingua di adesso, che è
   sempre quella della pagina: si legge in un'unica lingua); non inventa un nome se manca il `title`. Albero di accessibilità di Chromium: ruolo `DisclosureTriangle`, nome «Cambia lingua: Italiano»
   (ar: «تغيير اللغة: العربية», zh: «切换语言: 中文»), `expanded` false/true. Nessun testo nuovo da tradurre.
5. **Caratteri invisibili nel nome delle lingue in una pagina da destra a sinistra**: l'isolamento dei pezzi latini (correzione I1) avvolgeva anche «Deutsch» nel suo elenco (`⁦Deutsch⁩`), e
   quei caratteri finivano nel nome accessibile del collegamento (per chi detta il nome al computer o lo cerca). `isola_latino` salta il testo di un `<a hreflang>` (è l'unico testo del suo collegamento, con il suo `lang`).

**Provato e non era un difetto**: con l'elenco aperto a 1440 e lo schermo ridotto a 390 (o la barra che diventa «raccolta»), riaprendo il menu l'elenco è chiuso: il clic su «Menu» lo chiude già (il gestore dei clic fuori di `lingua.js`). Avevo
aggiunto un osservatore del menu e un gestore di `pageshow`: tolti, senza una prova che li chieda (il codice di prima passa la stessa prova).

**Esiti (numeri).**

- **Barra, computer 1440×900** (it, ar, ur; Chromium, Firefox, WebKit): Tab dal marchio alla scelta nell'ordine in cui si vedono (da sinistra a destra in it, da destra a sinistra in ar e ur: le x
  seguono la lettura); la scelta ha il fuoco, sta nello schermo e niente la copre; Invio la apre e il fuoco resta lì; il pannello sta nello schermo (900–1360 su 1440, 66–270 su 900); Tab percorre tutte le 10 voci riga per riga nel
  verso della lettura, ognuna nello schermo e non coperta; dopo l'ultima il fuoco esce e l'elenco si chiude; Maiusc+Tab torna al comando e l'elenco resta aperto; Esc dalla seconda voce e dal comando chiude e il fuoco torna/resta
  sul comando; il clic apre, il clic fuori chiude. **Corsa finale: it 61 controlli per motore (tastiera, ricordo, telefono, schermi bassi, resize, senza script, movimento, scorrimento veloce, i due ritmi di Tab), ar e ur 50 per motore (tastiera, telefono, scorrimento): 0 rossi in Chromium, Firefox e WebKit.**
- **Scelta ricordata** (it, 3 motori): dal tedesco nell'elenco della barra si va a `/de/` (l'indirizzo scritto dalla costruzione, `../de/`), la scelta è in `localStorage kalliope.lingua`, «/» porta a `/de/`, `/?lingue`
  mostra la scelta; «Indietro» da `/ar/` torna a `/it/` con l'elenco chiuso; ricaricando con l'elenco aperto riparte chiuso.
- **Telefono 390×844** (con tocco; it, ar, ur; 3 motori): il menu si apre, Tab arriva alla scelta dentro il menu (6 comandi), l'elenco sta nel menu e nello schermo (21–369 su 390), Tab percorre le 10 voci riga per riga nel verso della
  lettura, ognuna nello schermo; Esc (due volte), riaprendo il menu l'elenco è chiuso.
- **Senza JavaScript**: a 1440 la scelta si apre e si chiude con il clic, con Invio e con Spazio, l'elenco sta nello schermo, 10 collegamenti veri con href, lang e hreflang; **al telefono, senza script, il menu non c'è (si apre con
  lo script) e «Menu» porta all'elenco del piede**: 10/10 lingue tutte nello schermo, nessuno scorrimento di lato. (Firefox: dentro `evaluate` una promessa non si risolve con JavaScript spento: lo script lo evita.)
- **Movimento ridotto** (da registrare): l'elenco della barra si apre senza animazione (a 60 ms 0 animazioni, opacità 1; con il movimento normale 1 animazione e opacità 0,69). La pagina della scelta: nessuna animazione più lunga di 1 ms
  (la regola di `base.css`), la bolla e i 30 nomi già al loro posto fin dal primo istante e la pagina a 0,6 s e a 3,6 s identica (foto uguali); con il movimento normale a 50 ms 47 animazioni, i nomi non ancora accesi, e a 4,5 s tutto acceso e fermo. In WebKit
  le transizioni da 1 ms finiscono dopo qualche centinaio di millisecondi (a 50 ms c'erano ancora 6): la prima foto si prende a 0,6 s.
- **Pagina della scelta** (30 lingue, 3 motori, 23 controlli ciascuno, 0 rossi): la lingua del browser (de) è la prima e accesa; Tab percorre 30 nomi nell'ordine in cui si leggono, uguale all'ordine del documento, ognuno nello schermo, non coperto e con il segno del
  fuoco; Invio porta alla lingua e la ricorda; una scelta ricordata scritta a mano (`../../esempio`) o di una lingua che il sito non ha (`zz`) mostra la scelta; senza script 30 collegamenti con href, lang e hreflang, nell'ordine dei codici, tutti visibili.
- **Accessibilità** (`prove/selettore-a11y.mjs`, 3 motori × it, ar, zh): nome del comando giusto in tutte; `lang` della lingua di adesso uguale a quello della pagina, sola con `aria-current`; 10 voci ognuna con `lang` e `hreflang`, nessun nome ripetuto; **albero vero di Chromium**: ruolo,
  nome, `expanded`; aperto, i collegamenti hanno per nome il nome della lingua. In Firefox e WebKit solo l'istantanea di Playwright (ruolo e nome calcolati da Playwright, non dal browser): **nessun lettore di schermo vero è stato ascoltato**.
- Controprove: la copia di prima (`/tmp/lavoro-2b-sito-s1`, `-s2`, `82823d5`) fa fallire: l'Esc (1), il ritorno (3), lo scorrimento della scelta (4: 143, 206, 9, 388 px), e `test_translations.py` fa fallire le prove 5 e 6 sulla `site.py` di prima.

## Punto 4 · larghezze e motori

- Config: `esame-lingue.config.mjs` (home in ogni lingua di prova più gli stati: `_menu`, `_selettore`, `_ascolto`); lavori per `coda.mjs`: `esame-lavori.json` (Chromium: ogni lingua × 53 larghezze di
  `soglie.mjs` + le larghezze di mezzo 761–1180 a passo di circa 40 px; × 14 altezze (soglie d'altezza a 1366) + 8 dispositivi e schermi bassi; Firefox e WebKit: ar ur hi bn zh × 390×844, 1440×900, 844×390, 360×640), `pillole-lavori.json` (le pillole).
  Il sito su cui girano è quello con **30 lingue** (le 9 di prova vere più 20 pseudo-lingue e en-XA, ar-XB): con 10 lingue l'elenco della scelta è corto e non mostra i difetti dell'elenco vero.
- **Difetto trovato dall'esame con 30 lingue, corretto**: aprendo la scelta dentro il menu (telefono, tablet, barra «raccolta») l'elenco, alto 756 px, si apre sotto il comando e spesso **sotto il bordo del menu**: a 844×390 non se ne
  vedeva una riga (comando a 322–374, elenco da 380, bordo del menu a 382), a 326×326 neanche: chi toccava il comando non vedeva succedere niente. `website/lingua.js`: all'apertura il menu scorre il minimo perché le prime due righe (quattro nomi) stiano
  in vista (dal posto che hanno nel layout, non dalla misura dello schermo: l'elenco nasce con una scala e uno spostamento, e a quell'istante la misura era 9 px più in alto); dove si vedono già (390×844, 360×640, 750×832, 959×900) non si muove niente. Prova `selettore-barra.mjs --sezioni basso`: 844×390 e 326×326 rossi sulla copia di
  prima (menu scostato di 33 e 98 px, 4 nomi non in vista), verdi ora (scostato di 123 e 187 px: il comando e quattro nomi nel menu e nello schermo); con Tab tutte le 30 voci raggiungibili, ognuna nello schermo e non coperta, a 6 misure.
  `esame-impaginazione.mjs` con la voce `_selettore` (prima: l'elenco intero in vista; dava FUORI VISTA a ogni larghezza fino a 959 con 30 lingue, anche dove il menu scorre per scelta): ora l'`inVista` è il comando e le prime due righe.
- **Difetto trovato dalle pillole in en-XA a 441 px, corretto**: tra 441 e 959 px (telefono largo e tablet), con la pagina scorsa, l'azione della barra («Scarica e installa») sta fra il marchio e «Menu»; con una lingua
  e un marchio lunghi (in en-XA anche «Kalliope» è tradotto e diventa «[Ķáļļîöþé Ĺöŕ]») lo spazio era di 88 px e l'azione andava su **quattro righe**, alta 72 px in una barra di 56, con il testo tagliato (foto `foto/azione/enXA-441-prima.png`). Nessuna misura della barra
  guardava l'altezza dell'azione (`barra-larghezze.mjs` guarda solo che non copra niente). `website/componenti.js` (`misuraBarra`): se a capo l'azione ha più di due righe e la parola del marchio c'è ancora, la parola sparisce intera (la classe `stretta` che c'era già, come sotto 441 px e
  sul computer) e l'azione prende il suo posto. Prova nuova `prove/barra-azione.mjs`: l'azione sta nell'altezza della barra, non copre marchio e «Menu», non esce dallo schermo, al massimo due righe con la parola ancora in barra. Sulla copia di prima, en-XA 450–490 rotte (3 righe, con la
  parola ancora in barra); dopo, 0 rotte e al massimo 2 righe. L'italiano non cambia (l'azione ci sta).
- **Difetto trovato dalla prova «a storia» della barra, corretto** (la misura dipendeva dalla storia della pagina): `componenti.js` ricordava il **marchio più largo mai visto** (`marchioPieno`, un massimo sulla storia) e lo usava tra 441 e 959 px, dove il marchio è più piccolo che sul computer (icona e spazio più piccoli): lo spazio per l'azione risultava 18 px
  di meno e l'azione andava a capo di troppo; in urdu (il nastaliq ha righe alte) a 450 px su **due righe, 70 px in una barra di 56**, e a 320 px lo stesso se prima la pagina era a 960 px. Se la pagina era nata a quella larghezza non succedeva. Correzione: lo spazio si misura dal marchio com'è adesso
  (`marchio.getBoundingClientRect()`: sotto 441 px e con «stretta» la parola non c'è e conta l'icona), e la barra si rimisura quando l'azione entra o esce (osservatore della classe `con-azione`: la misura fatta in cima alla pagina non vale per la barra con l'azione). Prova `barra-azione.mjs`: prima, ur 2 rotte (320 e 450) dopo una storia di larghezze; dopo, 0.
- **Difetto di traduzione di prova, non mio**: in bengali «OSI-এর» (sigla latina, trattino, suffisso) va a capo dopo il trattino (A CAPO NEL MEZZO, 20 larghezze). È il testo di prova non rivisto; la regola per i traduttori è marcare con un tag le parti che non vanno spezzate.

## Corsa finale (stessi file per tutte le prove)

`coda.mjs` ha girato 85 lavori in più chiamate da meno di 10 minuti (`esame-lavori.json`, `finale-lavori.json`; i log e gli esiti sono in `esiti/finale/finale1/` e `esiti/finale/finale2D/`, il riassunto in `esiti/finale/RIASSUNTO.txt`), sul sito con 30
lingue costruito dai file con impronta `impronte-provati-s10.txt` (insieme `588f97a9…`). Dopo, chi lavora alla «non ancora» (3a-r) ha cambiato altri cinque file condivisi (`website/index.html`, `website/non-ancora/index.html`, `design-system/token.css`,
`website/lingue/it.po`, `site.pot`: la frase della versione di prova, due elementi invece di un tag; le altezze della riunione nella pagina interna): **un sottoinsieme (33 lavori) è stato rifatto sui file di adesso** (`impronte-finali.txt`, insieme `7eff76eb…`,
corsa `finale3`, vedi sotto). Quello che segue vale per i file di prima, salvo dove dice «di adesso».

- **La barra** (`barra-larghezze.mjs` dell'incarico 2 sul computer, 761–1440 ogni 10 px; `barra-azione.mjs` al telefono e sul tablet, 320–960 ogni 10 px; dopo una rotella vera): 12 lingue (it de fi el bg ar ur hi bn zh en-XA ar-XB) + la pagina «non ancora» (it, en-XA) + il telefono che gira
  (`barra-gira.mjs`): **29 lavori, 1 892 prove, 0 rotte**.
- **L'esame dell'impaginazione** (`esame-impaginazione.mjs`, «riduci movimento», testo al 100%; gli stati `_home`, `_menu`, `_selettore`, `_ascolto`): **Chromium** 10 lingue (ar ur hi bn zh el de fi en-XA ar-XB) × (53 larghezze di `soglie.mjs` e di mezzo + 22 misure d'altezza e
  di dispositivo) × 4 stati = **3 000 pagine** (316 stati che a quella misura non esistono, come il menu dove le voci sono in riga); **ar, ur, hi, el, de, fi, ar-XB: 0 segnalazioni** (7 lingue × 300 pagine = 2 100). Le segnalazioni sono tre, tutte spiegate:
  bengali «OSI-এর» (A CAPO NEL MEZZO, testo di prova non rivisto: sigla latina, trattino, suffisso; 24 pagine; foto `foto/difetti-non-miei/bn-OSI-349.png`); cinese **SPEZZATA** (836 + 339 righe in Chromium, 67 + 67 in Firefox e WebKit: il controllo cerca parole spezzate con gli spazi, e il cinese va a capo fra i caratteri; **tutte** le segnalazioni
  del cinese sono di questo tipo, nessun'altra: né FUORI, né TAGLIATO, né ESCE); en-XA **STRETTO** sul pulsante «Menu» a 320, 334 e 326×326 (12 pagine) (la pseudo-lingua mette anche «Ĺ» dentro il nome e traduce «Kalliope»; solo pseudo). **Firefox e WebKit** (ar ur hi bn zh × 390×844, 1440×900, 844×390, 360×640,
  4 stati = 80 pagine ciascuno): ar, ur, hi **0 segnalazioni**; bn e zh le stesse due di sopra.
- **Il cinese, davvero** (`cinese.mjs`: nessuna riga comincia con «，。、；：！？）」』》»… né finisce con «（「『《», nessun pezzo latino come Linux o `0.1-rc.1` va a capo a metà): 117, 117 e 120 testi su più righe (259–269 righe) in 8 larghezze (320–1440), in Chromium, Firefox e WebKit: **0 segni fuori posto**. Controprova con `word-break: break-all` e
  `line-break: anywhere` iniettati: 12 e 8 segni fuori posto.
- **Le pillole** (`pillole.mjs`, a riposo e dopo lo scorrimento: il testo dentro il fondo, la pillola nello schermo e non fuori di lato, a capo in righe pari quando non ci sta): Chromium 10 lingue × 59 larghezze = **7 670 pillole, 0 fuori posto**; Firefox e WebKit 5 lingue × 4 larghezze = 260 + 260, 0. Controprova con `.pillola{max-width:90px;white-space:nowrap}` iniettato: 21 su 26 fuori posto.
  Una sola segnalazione era uscita in una corsa precedente (en-XA a 441 px, l'azione della barra su quattro righe): corretta (sopra).
- **Il selettore nella barra** (`selettore-barra.mjs`, corretto due volte durante la corsa per due falsi allarmi miei: l'ordine «riga per riga» con il menu che scorre misurato in coordinate dello schermo, e l'azione contata anche dove la barra non l'ha): it (3 motori, 61 controlli ciascuno), ar e ur (3 motori, 50 ciascuno): **376 ok**;
  `non ancora` in Chromium: 43 ok e 2 rossi che non sono miei (sotto).
- **La scheda in secondo piano** (pagina della scelta): senza finestra nessun motore rende nascosta una scheda (`visibilityState` resta «visible» anche con `bringToFront`: la prima versione della prova passava senza provare niente, e l'ho tolta). Soltanto in
  Chromium si congela la scheda come fa il browser con una scheda in secondo piano (CDP `Page.setWebLifecycleState`, «frozen» 5 s durante l'arrivo, poi «active»): al risveglio 30/30 nomi accesi, bolla a 1, 3/3 persone girate, 0 errori. **Firefox e WebKit: non verificabile.**
- **La pagina della scelta** (30 lingue, 3 motori, 24 controlli ciascuno), **i nomi e i ruoli** (42 controlli in 3 motori), **il catalogo** (3 motori, 12 controlli ciascuno, 799 token, 4 blocchi), **«/» con una lingua sola** (30 casi in 3 motori, con e senza JavaScript): tutti ok.
- **L'italiano è identico** (`foto-home.mjs` e `confronta-serie.mjs` dell'incarico 1, «riduci movimento», la costruzione vera con una lingua sola contro le costruzioni `--no-selector` di `82823d5` e di `341a841`, la direzione scelta dal proprietario e verificata da chi coordina; tre serie per parte in Chromium, due in Firefox e WebKit):
  **Chromium 28 su 30 schermate a 0 pixel**, le altre due (390×844, scorrimento 5 e 6) a 21 pixel di differenza, al più 1 su 255 per canale, nel bordo del pulsante «Menu»: rumore di disegno, nessuna misura diversa (le posizioni sono le stesse al centesimo di pixel); **Firefox 15 su 16** (l'altra è nel rumore della serie, 59 pixel);
  **WebKit 16 su 16 contro `82823d5`, 14 su 16 contro `341a841`** (le due differenti, 390×844 con l'ascolto aperto e con l'errore, sono identiche a `82823d5`: vengono dalla correzione precedente, non da questa). Foto della differenza ingrandita: `foto/italiano-differenza-390-scorri-05.png`. Queste foto sono su file di prima della modifica di 3a-r (la frase della versione): rifatte, vedi sotto.

## Sui file di adesso (corsa `finale3` e `italiano2`)

Dopo la corsa finale, 3a-r ha cambiato `website/index.html` e `non-ancora/index.html` (la frase della versione: due elementi con `data-release`, nuove voci `apertura.stato-stabile` e `chiusura.fatti-stabile`), `design-system/token.css` (altezze della riunione nella pagina interna) e i cataloghi `it.po`/`site.pot`.
Ho aggiornato i testi di prova (`prove/testi_aggiornati.py`: le due voci nuove), ricostruito (`impronte-provati-s11.txt` = `impronte-finali.txt`, insieme `7eff76eb…`, uguale ai file di adesso) e **rifatto un sottoinsieme di 33 lavori** (`esame-lavori` per ar, hi e en-XA in Chromium e per ar e zh in Firefox e WebKit; la barra it, ar, en-XA e «non ancora»; le pillole sui dispositivi in tre motori;
il selettore it in tre motori e «non ancora»; la pagina della scelta; i nomi; il catalogo in tre motori; «/» con una lingua sola): **stessi esiti** (barra 536 prove 0 rotte; esame: ar e hi puliti, en-XA solo lo STRETTO del pulsante «Menu» a 320, 334 e 326×326, zh solo SPEZZATA; pillole 780 + 260 + 259, 0 fuori posto; selettore it 61 controlli ciascuno in tre motori; scelta 70 ok;
nomi 42 ok; catalogo 36 ok). **L'italiano rifatto sulla costruzione di adesso** (tre serie in Chromium, due in Firefox e WebKit): identico come prima (Chromium 28/30 con le stesse due a 21 pixel e ±1/255; Firefox 15/16 nel rumore; WebKit 16/16 contro `82823d5`, 14/16 contro `341a841`).
Non rifatte sui file di adesso: l'esame degli altri sette lingue × 53+22 misure (ur, bn, zh, el, de, fi, ar-XB), le pillole di tutte le larghezze, il selettore in ar e ur: dipendono dalla home solo per la frase della versione, che in un rilascio di prova ha le stesse parole.

## Difetti non miei (con la foto)

1. **«Non ancora»: il fuoco nel menu fa scorrere la pagina sotto** (file di 3a-r: `design-system/componenti/pagina.css:151`, `html { scroll-padding-bottom: var(--scorrimento-spazio-sotto) }`). Aprendo la scelta della lingua nel menu a 844×390 la pagina scorre di 51 px (a 326×326 di 23), nella home di 0: il fuoco su un comando di un menu fisso viene portato in vista
   anche per il viewport, che ha quel margine in fondo. Foto `foto/difetti-non-miei/non-ancora-844x390-menu-elenco.png` (e `home-…` accanto). Le prove rosse (2 su 45) sono `D-selettore-barra-chromium-non-ancora`.
2. **La pagina della scelta con 30 lingue sugli schermi bassi scorre**: a 1366×640 di 42 px (solo il bordo), a 360×640 di 217 px, a 326×326 di 623 px. Ogni nome si raggiunge scorrendo (provato), e la fila dei riquadri, decorativa, resta sotto; è la composizione della direzione (la bolla con i nomi va a capo in più righe, titolo e marchio sopra). Foto `foto/difetti-non-miei/scelta-1366x640.png`, `scelta-360x640.png`, `scelta-326x326.png`.
3. **Testo di prova in bengali**: «OSI-এর» (sigla latina, trattino, suffisso) va a capo dopo il trattino a 349 px (e a 320–349 px, e a 360×640): un testo non rivisto; la regola per chi traduce (`docs/translating.md`: marcare con un tag le parti che non vanno spezzate) basta, ma i traduttori di bengali e hindi incontreranno spesso «sigla-suffisso». Foto `foto/difetti-non-miei/bn-OSI-349.png`.
4. **En-XA, pulsante «Menu» su due righe a 320, 334 e 326×326** (la pseudo-lingua aggiunge «Ĺ» al nome e traduce anche «Kalliope», che resta «Kalliope» in ogni traduzione vera).
5. **Il catalogo**: la tabella dei token è larga 998 px: a 1024 la pagina scorre di lato di 22 px, a 390 di 628 (le colonne dei nomi non vanno a capo: come prima della mia modifica, che ha tolto soltanto i 3 900 px dei campioni a barra).
6. **Il Nastaliq pesa 234 KB** (Bengali 102, Devanagari 118): per queste scritture il testo nel carattere giusto arriva 1,7 s (4G) o 6–9 s (3G) dopo l'inizio e il precarico non aiuta; il rimedio sono meno byte (un sottoinsieme più stretto, o file per fette di `unicode-range`), non il precarico.
7. **`design-system/componenti/lingue.css` contiene due correzioni che non riguardano le lingue** (il menu aperto del telefono che non scivola con l'azione in barra, la barra compatta che non ritaglia con un pannello aperto): stanno in quel foglio per come sono nate, ma sono della barra. Spostarle in `barra.css` può cambiare l'ordine delle regole: non l'ho fatto.
8. **`CLAUDE.md`**: «Una cartella per lingua» dice che «`/` è la scelta della lingua»: oggi, con una lingua sola, `/` manda a `/it/`. Una riga da aggiornare a chi coordina (non l'ho toccato).

## Non verificato

- **Nessun lettore di schermo vero** (né VoiceOver, né NVDA, né TalkBack): l'albero di accessibilità vero è solo quello di Chromium (CDP); in Firefox e WebKit l'istantanea di Playwright (ruoli e nomi calcolati da Playwright, non dal browser). I caratteri invisibili LRI/PDI nel testo arabo e urdu non ascoltati.
- **Dispositivi veri**: tutto in simulazione di viewport. Firefox e WebKit solo per ar, ur, hi, bn, zh a 390×844, 1440×900, 844×390 e 360×640 (come chiesto), non i 15 dispositivi né le larghezze di mezzo; il **testo grande** (125, 150, 200%) e lo zoom **non** sono stati provati per le lingue (l'esame gira in «normale»).
- **La rete**: emulata con CDP su un server locale HTTP/2 con gzip; le priorità di HTTP/2 di GitHub Pages non sono provate. Il precarico dei caratteri grandi è escluso per la misura fatta qui.
- **La scheda in secondo piano**: congelata in Chromium soltanto; Firefox e WebKit senza finestra non rendono nascosta una scheda.
- **Il tasto «Indietro» con la cache dei browser** (bfcache): in automazione non si attiva; provato con la navigazione normale (che ricarica la pagina).
- **Le trenta lingue**: nove con testi di prova non rivisti da chi parla la lingua, venti pseudo-lingue (en-XA con accenti e +40%); nessuna traduzione vera. Il cinese solo con il carattere «Noto Sans CJK SC» di questa macchina (non quelli di Windows o macOS); l'urdu e l'arabo di sistema (M7) non provabili: la macchina non li ha.
- **Il rilascio stabile**: la costruzione con un rilascio non di prova (la frase della versione senza «di prova») non è stata provata da me; i test di 3a-r (`DataRelease`) la coprono.
- Le pagine interne oltre a «non ancora» (stato, installa, in riunione, aiuto, 404) hanno ancora la barra vecchia: non hanno la scelta nuova né `componenti.js`.
- `design/STATO.md` è modificato nella copia di lavoro: non da me.

## Ultimo comando

`design/lavoro/2-lingue-aspetto/costruzione/prove/riprendi.sh finale3 …/finale-bis-lavori.json /tmp/lavoro-2b-coda-finale3-c.txt` → «COMPLETA finale3: 33/33»; poi `riprendi.sh italiano2 …/foto-it-bis-lavori.json` e `confronta-serie.mjs`. Prove sulle stesse impronte: `python3 -I -m unittest discover -s tools -p 'test_*.py'` → 72 prove, OK; `controlla-sorgenti.mjs` verde (23 fogli);
`css_logico.py` ok (24 fogli); `translations.py extract --check` e `check` ok (156 voci).

## File toccati da me

`tools/site.py`, `tools/test_translations.py`, `website/lingua.js`, `website/componenti.js`, `design-system/componenti/lingue.css`, `design-system/catalogo/catalogo.js`, `catalogo.css`, `catalogo-lingue.js`, `design-system/SISTEMA.md` (tre righe), `docs/translating.md`; in `design/lavoro/2-lingue-aspetto/costruzione/`: `prove/`, `misure/`, `esiti/`, `foto/`,
`impronte-*.txt`, `esame-lingue.config.mjs`, i file dei lavori di `coda.mjs`, questo documento. Non toccati: `website/non-ancora/`, `cornice.js`, `pagina.css`, `riunione-ferma.css`, `strada-ferma.css`, `versioni.css`, `catalogo-pagine.*`, `token.css`, `TOKEN.md`, `metodo.config.mjs`, `it.po`.
