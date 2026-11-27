# TOKEN · i valori del design system di Kalliope, con il loro ruolo

Questo file è stato generato quando il sistema è stato ricavato dal foglio di stile della home, senza cambiare un valore: **717 token** (705 alla nascita; vedi sotto, «Specchio»), tutti in `token.css`. Non si rigenera da solo: quando un token cambia, questa pagina si aggiorna a mano.
Per ogni token: il valore, il ruolo e dove è usato (componente, selettore, proprietà, condizione). «Valori della pagina ricondotti»: il valore del token è il valore
scritto nella pagina, identico; un token riunisce tutti gli usi di quel valore **dentro lo stesso ruolo**. Dove due valori quasi uguali potrebbero essere lo stesso ruolo
restano due token: sono elencati in «Da decidere» (non li ho uniti, perché cambierebbe l'aspetto).

## La finestra del programma (ponte `token.css` → Slint, 26/11/2026)

Il programma ha una sola finestra Slint, per Linux, Windows e macOS. I suoi valori non si scrivono nei file `.slint`: li legge la compilazione da questo
`token.css` (`crates/tokens`, chiamata da `crates/app/build.rs`) e ne fa un globale Slint, `Token`. `tools/slint_valori.py` (in CI) rifiuta in
`crates/app/ui/*.slint` un colore, una misura diversa da zero, un tempo, una famiglia di caratteri o un peso scritti a mano. Un valore che alla finestra
manca si aggiunge qui, con il suo ruolo.

**Che cosa vede la finestra.** Soltanto i token `--app-*` dichiarati in `:root`, e soltanto lì: un `:root` dentro `@media`, `@font-face`, `:lang()` e ogni altro selettore
sono del sito. `var()` si risolve alla compilazione: un valore condiviso arriva alla finestra con un ruolo `--app-*` che lo richiama
(`--app-spazio-controlli: var(--spazio-10)`), così i nomi sono per ruolo anche nella finestra e il valore condiviso non ha due nomi. La finestra legge `Token.spazio-controlli`
(il nome senza `--app-`). `--app-` è il nome della finestra del programma: i token della riunione ricostruita sul sito (la griglia, i comandi, l'icona di una
videochiamata) si chiamano `--riunione-app-*` (rinominati il 26/11/2026, valori invariati).

**Che cosa può essere un valore `--app-*`** (altro è un errore di compilazione, con il nome del token e il motivo):

| Valore in `token.css` | Proprietà Slint | Note |
|---|---|---|
| colore: `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hwb()`, `lab()`, `lch()`, `oklab()`, `oklch()`, `color(srgb …)`, `color-mix(in srgb\|srgb-linear\|oklab\|oklch\|lab\|lch\|hsl, …)`, `transparent`, `white`, `black` | `color` | convertito a 8 bit come lo dipinge Chromium (prove in `crates/tokens`); fuori dal gamut sRGB ogni canale è tagliato, come fa Chromium (non c'è riduzione di croma); alfa arrotondato come i browser; la mescola ha la tinta come Chromium (la tinta di un colore da sRGB con croma OKLCH sotto 0,02 manca) |
| lunghezza: `12px`, `0.75rem` (1 rem = 16 px: `html` non ha una grandezza sua), `calc()`, `min()`, `max()`, `clamp()` con `px`, `rem` e numeri | `length` | `vw`, `vh`, `svh`, `em`, `ch` e gli angoli non hanno senso per una finestra: errore |
| tempo: `320ms`, `1.1s` | `duration` | in millisecondi |
| numero: `600`, `0.42` | `int` o `float` | pesi, opacità, rapporti |
| percentuale: `42%` | `float` (0,42) | |
| curva: `cubic-bezier(…)`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `linear` | `easing` | |
| famiglia: `"Lexend", "Lexend esteso", system-ui…` | `string` | la prima famiglia della pila: i glifi che mancano li cerca Slint nei caratteri di riserva |
| `url("caratteri/…/Faccia.ttf")` in un token `--app-carattere-*` | (non è una proprietà) | il file entra nel programma: `import` nel file generato. Slint incorpora TTF, OTF e TTC, non WOFF |

Un valore composto (un `padding: 8px 0 4px`, un'ombra, una griglia, una maschera `url()` di un disegno, un gradiente) non è un valore della finestra: si divide in un token per ogni parte, o resta fuori da `--app-*`.

**Chiaro e scuro.** Il `:root` è il tema **scuro**, che è anche quello del sito. Il tema chiaro è la regola `:root[data-tema="chiaro"] { --app-…: … }` (un attributo che il sito non imposta mai: il sito non cambia).
`Token.dark` segue il sistema (`Palette.color-scheme`, che Slint legge dal portale delle impostazioni XDG su Linux, da Windows e da macOS; senza risposta è chiaro, come ogni controllo di Slint) e
un colore con due valori diventa `dark ? scuro : chiaro`. Un tema chiaro incompleto ferma la compilazione, con un messaggio che nomina ogni colore che manca:
- un token con un valore chiaro e nessuno scuro in `:root`;
- un colore `--app-*` senza valore chiaro (né suo, né di un token che richiama: cambiare `--testo` nel chiaro cambia ogni ruolo che lo richiama), a meno che il suo nome finisca per `-fisso`
  (lo stesso colore nei due temi: il marchio, il bianco sul pulsante);
- un colore `-fisso` a cui il chiaro dà un altro valore;
- un valore di un tipo nel tema scuro e di un altro nel chiaro.
Finché non esiste nessuna regola chiara, ogni colore ha un solo valore. I colori `--app-*` che ci sono oggi (`--ricostruita-fondo`, `--ricostruita-campo`, `--ricostruita-accento`… del disegno della finestra sulla pagina «installa»)
sono i valori di allora, un solo tema: quando arriva il tema chiaro, ognuno va ridisegnato, tolto o chiamato `-fisso`.

**Caratteri.** Una riga `--app-carattere-NOME: url("caratteri/…/Faccia.ttf")` porta un file nel programma. Lexend (`caratteri/lexend/Lexend-wght.ttf`, tutti i pesi) è il primo. Un carattere per scrittura si
aggiunge con una riga: il file `.ttf` si ricava dal `.woff2` del sottoinsieme con `tools/caratteri_ttf.py` (senza perdere nulla: gli stessi glifi, tabelle e regole; la CI controlla che il `.ttf` accanto a un `.woff2` sia quello che il `.woff2` dà),
mai copiato a mano. Attenzione ai nomi interni: Geologica ha come famiglia «Geologica Thin» nel file istanziato al valore predefinito del peso (100).

**Una faccia per lingua (27/11/2026).** Una riga `--app-carattere-<ll>: url("caratteri/…/Faccia.ttf")`, con il codice di due lettere di una lingua nel nome, è la faccia della scrittura di quella lingua: il programma la porta dentro (un `include_bytes!` generato da `crates/app/build.rs`, non un `import` di Slint) e la registra soltanto quando quella lingua è in uso, davanti ai caratteri di sistema (`system-ui`, `sans-serif`) e come ripiego della sua scrittura. Lexend resta il primo carattere di ogni testo. Oggi: `el` e `bg` (Geologica, un file solo), `ar` (Readex Pro), `ur` (Noto Nastaliq Urdu), `hi` (Noto Sans Devanagari), `bn` (Noto Sans Bengali); il cinese non ha un file e usa il carattere di sistema, come il sito. Il `.ttf` si ricava dal `.woff2` con `tools/caratteri_ttf.py` e il sito non lo pubblica. `--app-interlinea-<ll>` è quanto le righe del testo si allontanano nella scrittura di quella lingua (`line-height-factor`, 1 = come in latino): gli stessi valori di `--interlinea-testo-scrittura` nelle regole `:lang()`, e un test li confronta.

**Specchio nella finestra (27/11/2026).** `:root:dir(rtl) { --verso: -1; }` è il valore da destra a sinistra di un token: il ponte lo legge e fa `rtl ? −1 : 1` (`Token.rtl` lo imposta il programma dalla lingua), come `dark ? … : …` per il tema; `--app-verso: var(--verso)` è `Token.verso`. Slint non ha un verso del layout, quindi da destra a sinistra la finestra si gira tutta (`transform-scale-x: Token.verso` sulla radice, `ui/app.slint`) e ogni `Text`, `TextInput` e `Image` si rigira su sé stesso con la stessa proprietà: i posti si specchiano (l'ordine della barra, il lato della cronologia, la coda della bolla, da dove entra un pannello, le frecce disegnate), le lettere e il logo no. Slint dispone `start` a sinistra in ogni lingua: ogni testo dice il suo lato con `horizontal-alignment: Aspetto.inizio` (a destra nelle lingue da destra a sinistra), e una frase scritta dalla persona il suo (`da-destra`, dalla prima lettera). `tools/slint_valori.py` rifiuta un testo, un campo o un'immagine che non si rigira, un testo senza lato o senza `line-height-factor`.

**Nomi.** `--app-nome-della-cosa` diventa `Token.nome-della-cosa`: minuscole, cifre, trattini singoli, prima una lettera; non una parola di Slint (`in`, `out`, `for`…) né `dark`.
Due dichiarazioni dello stesso token in `:root` con valori diversi sono un'ambiguità e fermano la compilazione.

**I ruoli di partenza** (26/11/2026; gli altri li aggiunge chi disegna la finestra): `--app-native-width`, `--app-native-height`, `--app-native-min-width`, `--app-native-min-height` (dimensioni all'apertura e minime: 560 × 460 e 360 × 320 px, il contenuto
oltre il minimo scorre); `--app-spazio-controlli` (= `--spazio-10`, lo spazio comune fra i controlli); `--app-font-testo` (= `--font-testo`, Lexend); `--app-peso-testo` (= 400) e `--app-peso-forte` (= 600);
`--app-carattere-testo` (il file di Lexend). Il resto di `--app-*` è il disegno della finestra sulla pagina «installa», con i valori di allora.

**Specchio (16/11/2026).** Per poter specchiare la pagina da destra a sinistra, i fogli usano proprietà logiche (`margin-inline-start`, `inset-inline-end`, `padding-block`…) e i token non dicono più «sinistra» o «destra»: `--f-cursore-margine-inizio`, `--impulso-margine-inizio`, `--luce-inizio`, `--luce-inizio-medio`, `--tratto-scena-notte-spazio-inizio` e `-fine` (prima `-sinistra` e `-destra`). Le 11 scorciatoie con il lato sinistro diverso dal destro (`padding: 0 24px 0 8px`) sono due token, uno per l'altezza e uno per la riga: `--pillola-spazio-interno-2-blocco` (alto e basso) e `--pillola-spazio-interno-2-inline` (inizio e fine, nell'ordine: `8px 24px`). `--verso` è nuovo. I valori sono quelli di prima: in italiano la pagina è identica, pixel per pixel. `tools/css_logico.py` controlla che nessuna proprietà fisica, nessuna scorciatoia asimmetrica e nessun testo scritto nel CSS rientri.

Come leggere i nomi: i colori, i materiali e i ruoli del movimento hanno un nome per ruolo (`--bordo-cornice`, `--luce-voce-centro`, `--durata-pillola`). Una misura che sta
in un solo componente ha il nome del componente e della proprietà (`--bolla-corpo-spazio-interno`; con un suffisso quando cambia con la larghezza: `-telefono`, `-medio`,
`-basso-802`…). Un valore uguale che compare in più componenti nella stessa famiglia (grandezze e interlinee del testo, raggi, spazi, misure) è un **gradino di scala**
numerato in ordine di valore (`--corpo-7`, `--spazio-12`): il numero è il posto nella scala, non il valore, e il ruolo sta nell'elenco degli usi qui sotto.


## La finestra: direzione «La frase che si accende» (26/11/2026, proposta non ancora approvata)

L'idea: la finestra è la bolla del logo. Si scrive nella bolla tratteggiata del non ancora detto; Invio manda la frase nella bolla
dove la voce la dice, una parola dopo l'altra; la frase detta resta, piena, da ripetere. Direzione, prove e video:
`design/lavoro/4-app/direzione/direzione.md`. Componenti: `crates/app/ui/kalliope/` (aspetto, forme, stato, bolla, scrittura,
voce-propria, finestra, catalogo). Catalogo vivo: `kalliope --catalogo` (la tabella dei token è generata da questo file da
`crates/app/build.rs`, con i due temi uno accanto all'altro e la fonte di ogni valore).

**Il tema chiaro.** È nel sistema dal 26/11/2026: `:root[data-tema="chiaro"]` in fondo a `token.css`, 31 colori `--app-*` con un valore
chiaro. Regola: la stanza chiara è il testo chiaro approvato (`--testo`), la barra è la scena chiara del sito (`--chiara-fondo-basso`), il testo è
`--scuro`; l'azione e la voce passano al verde acqua profondo (`--magenta`, nome storico), perché sul chiaro il menta non si stacca; la bolla
che parla è **sempre il contrario della stanza** (chiara sullo scuro, grafite sul chiaro); le tinte delle voci passano dai fondi dei
riquadri ai colori dei corpi delle figure della home. Due soli colori nuovi, dichiarati: `--app-azione-sopra` chiaro `#1f6a52` e
`--app-attenzione` chiaro `#8f4f36` (scurimenti delle tinte approvate). I colori uguali nei due temi finiscono per `-fisso`:
`--app-registra-fisso` e `--app-segno-fisso` (il rosa del logo).

**I vecchi `--app-*`.** I 18 colori del disegno della finestra 0.1 sulla pagina «installa» e nella riunione ricostruita non erano della
finestra del programma: il 26/11/2026 si chiamarono `--ricostruita-*`, e il 26/11/2026 (sito 0.3) sono stati **tolti**, con gli altri token del disegno di
allora (`--finestra-raggio`, `--finestra-ombra*`, `--f-stato-*`, `--f-pulsante-*`…): il disegno della finestra sulle pagine è ora la finestra nuova, e usa i
ruoli `--app-*` così come sono («La finestra disegnata sulle pagine» più sotto).

| Gruppo | Token `--app-*` | Fonte |
|---|---|---|
| Superfici e testo | `fondo`, `barra`, `campo`, `pannello`, `velo-modale`, `testo`, `testo-tenue`, `testo-spento`, `segnaposto`, `bordo`, `bordo-comando`, `velo-sopra`, `velo-scelto`, `velo-premuto`, `ombra` | colori approvati del sito (visione); `campo` e `segnaposto` scelte |
| Azione, voce, non ancora detto | `azione`, `azione-sopra`, `azione-testo`, `voce`, `tratteggio`, `tratteggio-fuoco`, `bolla`, `bolla-testo`, `bolla-da-dire`, `detta`, `registra-fisso`, `segno-fisso` | sito e marchio; `tratteggio` scelta (il menta a metà: nella finestra il rosa resta del logo) |
| Ciò che non va | `attenzione`, `attenzione-fondo` | la tinta calda dei partecipanti approvata (Paola): il solo colore caldo della finestra |
| Le voci come partecipanti | `tinta-propria` («Tu»), `tinta-voce-1` (Giulia: Anna), `tinta-voce-2` (Marco: Luca), `tinta-voce-3` (barre spente) | visione |
| Testo | `corpo-scrittura` 30, `corpo-lettura` 34, `corpo-titolo` 28, `corpo-bolla` 24, `corpo-marchio` 18, `corpo-detta` 17, `corpo-comando` 16, `corpo-stato` 15, `corpo-nota` 13; `peso-medio`, `peso-titolo`; `scala-passo` 0,25, `scala-massima` 2 | sito (D2); scrittura, lettura e titolo scelte |
| Spazi e misure | `spazio-minimo` 4, `spazio-stretto` 8, `spazio-medio` 16, `spazio-largo` 24, `spazio-ampio` 48, `spazio-parola` 7; `altezza-barra` 56, `altezza-comando` 44, `altezza-comando-piccolo` 34, `marchio` 30, `punto` 10, `barra-voce` 4, `barra-voce-alta` 18, `tratto` 3, `tratteggio-pieno` 14, `tratteggio-vuoto` 10, `filo` 1, `chiusura` 10; `bolla-larghezza` 720, `quota-scrittura` 2, `quota-storia` 1, `righe-scrittura` 3, `righe-scrittura-raccolta` 1, `interlinea` 1,3, `corpo-scrittura-raccolta` 24, `soglia-bassa` 440, `livello-altezza` 72, `registra-diametro` 76, `scelta-altezza` 168, `compatta-larghezza` 400, `compatta-altezza` 320, `soglia-stretta` 900, `soglia-minima` 560, `spostamento-entrata` 24, `ombra-sfocatura` 24, `ombra-scarto` 8 | gradini di scala del sito e marchio (tratteggio 14/9 del logo); le misure della finestra sono scelte |
| Raggi | `raggio-bolla` 24, `raggio-coda` 6, `raggio-scrittura` 26, `raggio-pannello` 20, `raggio-pillola` 999 | sito |
| Movimento | `curva-entrata` cubic-bezier(0.19, 1, 0.22, 1), `curva-dolce` ease, `curva-lineare`; `durata-bolla` 520, `durata-parola` 360, `durata-scurisce` 200, `durata-dissolvenza` 160, `durata-pannello` 300, `durata-pannello-uscita` 240, `durata-barre` 460, `durata-cammino` 1400, `durata-anello` 900, `ritardo-bolla` 110; `intervallo-fotogramma` 16, `intervallo-registrazione` 100, `registrazione-utile` 12 s; `livello-barre` 28; `opacita-spento` 0,42; `scala-coda` 0,6 | sito (base misurata, D2); intervalli scelte |
| Finestra | `native-width` 920, `native-height` 640 (prima 560 × 460) | scelta: la scrittura grande |

**Correzioni dopo il giudizio (26/11/2026).** Le proporzioni della finestra non sono più una fascia fissa: la scrittura prende due parti
dello spazio che avanza e la cronologia una (`--app-quota-scrittura` 2, `--app-quota-storia` 1), con un minimo di righe e non un'altezza
(`--app-righe-scrittura` 3, `--app-righe-scrittura-raccolta` 1, `--app-interlinea` 1,3); `--app-scrittura-altezza` e
`--app-scrittura-altezza-minima` sono tolti. Sotto `--app-soglia-bassa` (440 px × testo) la finestra si raccoglie: niente cronologia, scrittura a
`--app-corpo-scrittura-raccolta` (24 px), la frase detta più piccola o su una riga. Giulia ha la tinta di Anna e un'altra voce propria il grigio
verde delle barre spente: la tinta di Paola resta solo all'avviso.

`controlla-valori.mjs` sui token della finestra (var() risolto, `design/lavoro/4-app/direzione/token-finestra-risolti.css`) con la base
`design/lavoro/4-app/direzione/base.json`: 65 valori tracciati, 0 senza fonte; un tratto di stile di default da guardare (il caldo chiaro
`#8f4f36`, variante della tinta di Paola).

**Costruzione della finestra (26/11/2026).** Collegata al motore vero, la finestra non ha avuto bisogno di nuovi colori, caratteri o misure: ha un solo valore
nuovo, `--app-ritardo-bolla` 110 ms, la scelta che mette in fila i due movimenti del passaggio a Invio (la bolla vecchia si sfuma sul posto, la nuova
nasce quando la vecchia ha perso metà dell'opacità, così i due testi non si sovrappongono; misure prima e dopo in
`design/lavoro/4-app/costruzione/LEGGIMI.md`). Le parti nuove (`Avviso`, `Attesa`, `Avanzamento`, `RigaMicrofono`, `RigaTratto`, la notizia nella riga di stato,
`Informazioni`, `Conferma`) usano soltanto i token di prima: la tinta calda e il suo fondo per un problema, il menta per la barra e le scelte, il velo del
modale. `tools/slint_valori.py` resta verde; il catalogo (`kalliope --catalogo`) le mostra con i loro stati.

## Direzione di scrittura (1)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--verso` | `1` | 1 con la scrittura da sinistra a destra, −1 da destra a sinistra: la cambia `:root:dir(rtl)` (token.css), cioè `<html dir="rtl">`. Ciò che ha un verso la moltiplica; `scena.js` la legge con `Testi.verso()` | usato da `componenti/riunione-ferma.css` (pagine interne); `scena.js` la legge e per ora non la usa: l'elenco dei punti della home che hanno un verso è in `design/lavoro/1-lingue-sito/versi.md` |

## Colori e materiali (128)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--azione` | `#91dfbd` | l'unico colore di ciò che si preme per scegliere | 0 usi:  |
| `--fondo` | `#1b2223` | la stanza: il fondo di tutta la pagina | 0 usi:  |
| `--scuro` | `#171d1d` | testo scuro sul chiaro (bolla, occhi e bocca delle figure) | 0 usi:  |
| `--bordeaux` | `#253331` | testo e segni scuri sul chiaro; capelli di Paola | 1 uso: `.paola` capelli |
| `--magenta` | `#27795f` | la voce dentro la bolla; cuffia di Luca; maglia di Anna | 2 usi: `.luca` cuffia; `.anna` corpo |
| `--rosa` | `#82b4a3` | il bordo che risponde al passaggio sulle voci; maglia di Paola | 1 uso: `.paola` corpo |
| `--voce` | `#b5e8d2` | la voce che suona: contorni, barre di «Tu», tappe accese, maglia di Luca | 1 uso: `.luca` corpo |
| `--testo` | `#f2f5f4` | il testo e la voce chiara: bolla, pillola chiara, fine della scena chiara | 1 uso: `.scena-chiara` background |
| `--barra-piena` | `#151b1c` | la barra compatta e la fascia della riunione agganciata: piene, senza sfocatura | 5 usi in 2 componenti: `.barra.compatta` background; `.barra.compatta` box-shadow; `html:not(.js) .barra` background; +2 |
| `--bordo-barra` | `rgba(181, 218, 206, 0.1)` | il filo sotto la barra compatta e sotto la fascia agganciata | 3 usi in 2 componenti: `.barra.compatta` box-shadow; `html:not(.js) .barra` box-shadow; `.banda-riunione.agganciata` box-shadow ((max-width: 760px)) |
| `--pannello-menu` | `rgba(20, 25, 26, 0.94)` | il menu aperto | 1 uso: `.js .menu.aperto` background ((max-width: 959px)) |
| `--pannello-menu-fondo` | `rgba(20, 25, 26, 0.98)` | il velo sul fondo del menu che scorre | 1 uso: `.js .menu.aperto::after` background (@supports (animation-timeline:) |
| `--pannello-trasparente` | `rgba(20, 25, 26, 0)` | il pannello a zero: inizio del velo sul fondo del menu | 1 uso: `.js .menu.aperto::after` background (@supports (animation-timeline:) |
| `--velo-menu-premuto` | `rgba(242, 245, 244, 0.18)` | una voce del menu premuta | 1 uso: `.menu a:active` background |
| `--velo-menu-sopra` | `rgba(242, 245, 244, 0.1)` | una voce del menu al passaggio | 1 uso: `.menu a:hover` background |
| `--velo-scelto` | `rgba(242, 245, 244, 0.14)` | una frase attiva, «Menu» al passaggio | 2 usi in 2 componenti: `.pulsante-menu:hover` background; `.frase[aria-current="true"]` background |
| `--azione-sopra` | `#b4edcf` | l'azione al passaggio | 1 uso: `.pillola.azione:hover` background |
| `--azione-testo` | `#152c24` | il testo sull'azione | 1 uso: `.pillola.azione` color |
| `--bianco` | `#fff` | il bianco: pillola chiara al passaggio, impulso, testo sui comandi della finestra | 5 usi in 4 componenti: `.pillola.voce-chiara:hover` background; `.f-parla` color; `.f-primario` color; +2 |
| `--bordo-comando-quieto` | `rgba(181, 218, 206, 0.35)` | il bordo di un comando secondario: «Chiudi», «Rivedi» | 2 usi: `.chiudi` border; `.rivedi` border |
| `--bordo-rivedi-chiaro` | `rgba(30, 39, 39, 0.35)` | il bordo di «Rivedi» sulla scena chiara | 1 uso: `.scena-chiara .rivedi` border-color |
| `--ombra-azione` | `rgba(117, 205, 174, 0.7)` | l'ombra dell'azione | 1 uso: `.pillola.azione` box-shadow |
| `--sottolineatura` | `rgba(181, 218, 206, 0.55)` | la sottolineatura dei collegamenti | 2 usi in 2 componenti: `.collegamento` text-decoration-color; `.scarica-file` text-decoration-color |
| `--bordo-evidente` | `rgba(181, 218, 206, 0.4)` | il bordo che si nota: la riga dello stato, il messaggio d'errore, l'alone di una frase in voce | 3 usi in 3 componenti: `.stato` border-inline-start; `.errore-ascolto` border; `.messaggio.in-voce .filo-bolla .bol…` box-shadow |
| `--testo-didascalia` | `rgba(242, 245, 244, 0.78)` | la didascalia e il titolo del microfono | 2 usi in 2 componenti: `.didascalia` color; `.microfono-titolo` color |
| `--testo-spiegazione` | `rgba(242, 245, 244, 0.88)` | la spiegazione sotto un titolo: stato, testo del tratto, esiti | 3 usi in 3 componenti: `.stato` color; `.esito p` color; `.tratto-testo p` color |
| `--ombra-bolla` | `rgba(10, 14, 15, 0.85)` | ombra della bolla | 3 usi in 2 componenti: `.bolla-corpo` box-shadow; `.messaggio.in-voce .filo-bolla .bol…` box-shadow; `.messaggio.in-pausa .filo-bolla .bo…` box-shadow |
| `--alone-tu` | `rgba(181, 218, 206, 0.8)` | l'alone di chi parla | 1 uso: `.alone` box-shadow |
| `--anna-capelli` | `#3b2e29` | Anna: capelli | 1 uso: `.anna` capelli |
| `--anna-corpo` | `#b194bf` | anna: corpo | 1 uso: `.anna` corpo |
| `--anna-fondo-alto` | `#55465c` | Anna: fondo del riquadro, alto | 1 uso: `.anna` background |
| `--anna-fondo-basso` | `#332d3e` | Anna: fondo del riquadro, basso | 1 uso: `.anna` background |
| `--anna-ombra` | `#a16b51` | Anna: collo e ombre | 1 uso: `.anna` ombra |
| `--anna-pelle` | `#c99574` | Anna: pelle | 1 uso: `.anna` pelle |
| `--barre-spente` | `#496259` | le barre della voce quando nessuno parla | 1 uso: `.barre i` background |
| `--bordo-cornice` | `rgba(181, 218, 206, 0.14)` | il bordo di una cornice della riunione e il filo sopra il piede | 4 usi in 2 componenti: `.chiamata` border; `.riunione-filo` border; `.tavolo-cornice` border; +1 |
| `--luca-capelli` | `#252522` | Luca: capelli | 1 uso: `.luca` capelli |
| `--luca-corpo` | `#a4b9d1` | luca: corpo | 1 uso: `.luca` corpo |
| `--luca-cuffia` | `#48617e` | luca: cuffia | 1 uso: `.luca` cuffia |
| `--luca-fondo-alto` | `#3d4e62` | Luca: fondo del riquadro, alto | 1 uso: `.luca` background |
| `--luca-fondo-basso` | `#27323f` | Luca: fondo del riquadro, basso | 1 uso: `.luca` background |
| `--luca-ombra` | `#ca9778` | Luca: collo e ombre | 1 uso: `.luca` ombra |
| `--luca-pelle` | `#e9be9a` | Luca: pelle | 1 uso: `.luca` pelle |
| `--ombra-banda` | `rgba(0, 0, 0, 0.8)` | ombra della fascia agganciata | 1 uso: `.banda-riunione.agganciata` box-shadow ((max-width: 760px)) |
| `--ombra-cornice` | `rgba(5, 9, 10, 0.9)` | ombra di una cornice o di un pannello | 3 usi in 2 componenti: `.chiamata` box-shadow; `.tavolo-cornice` box-shadow; `.ascolto` box-shadow |
| `--ombra-nera` | `rgba(0, 0, 0, 0.9)` | ombra della riunione accanto al filo | 1 uso: `.riunione-filo` box-shadow |
| `--paola-capelli` | `#3c2926` | paola: capelli | 1 uso: `.paola` capelli |
| `--paola-corpo` | `#c99078` | paola: corpo | 1 uso: `.paola` corpo |
| `--paola-fondo-alto` | `#655147` | Paola: fondo del riquadro, alto | 1 uso: `.paola` background |
| `--paola-fondo-basso` | `#3e3531` | Paola: fondo del riquadro, basso | 1 uso: `.paola` background |
| `--paola-ombra` | `#b77e61` | Paola: collo e ombre | 1 uso: `.paola` ombra |
| `--paola-pelle` | `#e1ad8b` | Paola: pelle | 1 uso: `.paola` pelle |
| `--tu-fondo-alto` | `#263b35` | il riquadro «Tu»: parte alta del fondo | 1 uso: `.riquadro.tu` background |
| `--tu-fondo-basso` | `#172923` | il riquadro «Tu»: parte bassa del fondo | 1 uso: `.riquadro.tu` background |
| `--vetro-cornice` | `rgba(14, 20, 21, 0.42)` | la cornice della riunione | 2 usi: `.chiamata` background; `.tavolo-cornice` background |
| `--vetro-nome` | `rgba(10, 14, 15, 0.52)` | l'etichetta di un riquadro | 1 uso: `.nome` background |
| `--vetro-riunione-filo` | `rgba(14, 20, 21, 0.6)` | la riunione accanto al filo | 1 uso: `.riunione-filo` background |
| `--ombra-finestra` | `rgba(5, 9, 10, 0.85)` | ombra della finestra di Kalliope | 1 uso: `.finestra` box-shadow |
| `--testo-nota-chiara` | `rgba(23, 29, 29, 0.66)` | la nota sulla scena chiara | 1 uso: `.nota-ricostruzione` color |
| `--bordo-pannello` | `rgba(181, 218, 206, 0.2)` | il bordo di un pannello: scheda, menu aperto, computer, microfono | 4 usi in 4 componenti: `.microfono` border; `.ascolto` border; `.computer` border; +1 |
| `--bordo-sezione` | `rgba(181, 218, 206, 0.12)` | il filo che divide: tra «Non esiste» e la strada, intorno alla riunione ricostruita | 2 usi in 2 componenti: `.riunione-app` border; `.non-esiste` border-top |
| `--ombra-riunione-app` | `rgba(12, 20, 21, 0.75)` | ombra della riunione ricostruita | 1 uso: `.riunione-app` box-shadow |
| `--riquadro-scuro` | `#202b2b` | il nodo della strada e la finestra della riunione ricostruita | 3 usi in 2 componenti: `.riunione-app` background; `.nodo` background; `.js .tappa.fatta:not(.acceso) .nodo` background |
| `--velo-comando` | `rgba(242, 245, 244, 0.08)` | il fondo di un comando: voce, «Menu», microfono | 2 usi in 2 componenti: `.microfono` background; `.pulsante-menu` background ((max-width: 959px)) |
| `--velo-puntata` | `rgba(242, 245, 244, 0.2)` | la scelta del microfono puntata | 1 uso: `.scelta.puntata` background |
| `--alone-forte` | `rgba(181, 218, 206, 0.7)` | un alone netto: impulso, voce scelta, tratteggio dei «forse» | 3 usi in 2 componenti: `.voce[aria-pressed="true"]` box-shadow; `.impulso` box-shadow; `.esito-forse h3::before` background |
| `--bordo-frase` | `rgba(181, 218, 206, 0.22)` | il bordo di una frase | 1 uso: `.frase` border |
| `--bordo-voce` | `rgba(181, 218, 206, 0.34)` | il bordo di una voce a riposo | 1 uso: `.voce` border |
| `--frase-punto` | `rgba(181, 218, 206, 0.45)` | il punto di una frase non ancora suonata | 1 uso: `.frase::before` background |
| `--pannello-ascolto` | `rgba(20, 25, 26, 0.72)` | la scheda dell'ascolto | 1 uso: `.ascolto` background |
| `--tratteggio` | `rgba(181, 218, 206, 0.6)` | il tratteggio di «non ancora» (linea e pulsazione) | 2 usi in 2 componenti: `@keyframes pulsa 0%, 100%` box-shadow; `.linea-forse` background ((max-width: 760px)) |
| `--velo-sopra` | `rgba(242, 245, 244, 0.06)` | una voce al passaggio | 1 uso: `.voce:hover, .voce:focus-visible` background |
| `--voce-trasparente` | `rgba(181, 218, 206, 0)` | la voce a zero: fine di un alone che si spegne | 1 uso: `@keyframes pulsa 50%` box-shadow |
| `--pannello-errore` | `rgba(20, 25, 26, 0.78)` | il messaggio d'errore (fuori dalla scheda) | 1 uso: `.errore-ascolto` background |
| `--fondo-trasparente` | `rgba(27, 34, 35, 0)` | il fondo a zero: fine di ogni luce che sfuma | 6 usi in 2 componenti: `.ascolto-voce .luce-filo` background; `.luce` background; `.luce-voce` background; +3 |
| `--luce-filo-bordo` | `rgba(65, 94, 86, 0.16)` | la luce del filo: a metà | 1 uso: `.ascolto-voce .luce-filo` background |
| `--luce-filo-centro` | `rgba(117, 205, 174, 0.42)` | la luce del filo: centro | 1 uso: `.ascolto-voce .luce-filo` background |
| `--testo-durata` | `rgba(242, 245, 244, 0.7)` | la durata di una frase | 1 uso: `.durata` color |
| `--testo-nota` | `rgba(242, 245, 244, 0.82)` | una nota sotto una frase e il testo di «Non esiste» | 2 usi in 2 componenti: `.detto-riga` color; `.non-esiste p` color |
| `--tratto-lieve` | `rgba(181, 218, 206, 0.5)` | sottolineatura di «altra voce» e alone della linea fatta | 2 usi in 2 componenti: `.altra-voce` text-decoration-color; `.linea-fatta` box-shadow |
| `--bordo-comando` | `rgba(181, 218, 206, 0.3)` | il bordo di un comando: «Menu», nodo della strada | 3 usi in 2 componenti: `.nodo` border; `.js .tappa.fatta:not(.acceso) .nodo` border-color; `.pulsante-menu` border ((max-width: 959px)) |
| `--bordo-tappa-forse` | `rgba(181, 218, 206, 0.42)` | la tappa «forse»: bordo tratteggiato, e l'alone della tappa accesa | 2 usi: `.tappa.forse .nodo` border-color; `.tappa.fatta.acceso .nodo` box-shadow |
| `--bordo-tappa-raggiunta` | `rgba(181, 218, 206, 0.75)` | la tappa «forse» quando la voce ci arriva | 1 uso: `.tappa.forse.raggiunta .nodo` border-color |
| `--bordo-voce-vecchio` | `rgba(181, 218, 206, 0.28)` | il bordo di una voce (primo disegno; la pagina ora usa quello sotto) | 1 uso: `.impulso` box-shadow |
| `--riquadro-scuro-forse` | `rgba(27, 35, 36, 0.6)` | il nodo «forse» | 1 uso: `.tappa.forse .nodo` background |
| `--testo-forte` | `rgba(242, 245, 244, 0.9)` | la riga sulla riservatezza | 1 uso: `.riservato` color |
| `--testo-secondario` | `rgba(242, 245, 244, 0.8)` | testo di sostegno: piede, nome del computer, tappa «forse» | 3 usi in 2 componenti: `.computer-nome` color; `.tappa.forse .tappa-nome` color; `.piede p` color |
| `--testo-spento` | `rgba(242, 245, 244, 0.6)` | il segno di una tappa non accesa | 2 usi: `.nodo` color; `.js .tappa.fatta:not(.acceso) .nodo` color |
| `--velo-computer` | `rgba(242, 245, 244, 0.035)` | il computer della strada | 1 uso: `.computer` background |
| `--bianco-trasparente` | `rgba(255, 255, 255, 0)` | il bianco a zero: fine della luce della scena chiara | 1 uso: `.scena-chiara .luce-tratto` background |
| `--chiara-fondo-basso` | `#dfe7e3` | la scena chiara: parte bassa del fondo | 1 uso: `.scena-chiara` background |
| `--luce-chiara-bordo` | `rgba(255, 255, 255, 0.3)` | la luce della scena chiara: a metà | 1 uso: `.scena-chiara .luce-tratto` background |
| `--luce-chiara-centro` | `rgba(255, 255, 255, 0.85)` | la luce della scena chiara: centro | 1 uso: `.scena-chiara .luce-tratto` background |
| `--luce-chiusa-bordo` | `rgba(65, 94, 86, 0.2)` | la luce della chiusura: a metà | 1 uso: `.chiusura .luce-chiusa` background |
| `--luce-chiusa-centro` | `rgba(117, 205, 174, 0.5)` | la luce della chiusura: centro | 1 uso: `.chiusura .luce-chiusa` background |
| `--luce-stanza-bordo` | `rgba(63, 82, 79, 0.3)` | la luce della stanza: a metà | 2 usi: `.luce` background; `.chiusura .luce-tratto` background |
| `--luce-stanza-centro` | `rgba(65, 94, 86, 0.62)` | la luce della stanza: centro | 2 usi: `.luce` background; `.chiusura .luce-tratto` background |
| `--luce-tratto-bordo` | `rgba(63, 82, 79, 0.15)` | la luce di un tratto: a metà | 1 uso: `.luce-tratto` background |
| `--luce-tratto-centro` | `rgba(65, 94, 86, 0.36)` | la luce di un tratto: centro | 1 uso: `.luce-tratto` background |
| `--luce-voce-bordo` | `rgba(65, 94, 86, 0.22)` | la luce che segue la voce: a metà | 1 uso: `.luce-voce` background |
| `--luce-voce-centro` | `rgba(117, 205, 174, 0.55)` | la luce che segue la voce: centro | 1 uso: `.luce-voce` background |
| `--notte` | `#111819` | la scena «notte» (il filo) e il piede | 1 uso: `.scena-notte` background |
| `--requisito-traccia` | `rgba(30, 39, 39, 0.16)` | la traccia di un requisito | 1 uso: `.requisiti li::before` background |
| `--testo-avvertenza` | `rgba(242, 245, 244, 0.72)` | l'avvertenza | 1 uso: `.avvertenza` color |
| `--testo-avvertenza-chiusura` | `rgba(242, 245, 244, 0.66)` | l'avvertenza della chiusura | 1 uso: `.chiusura .avvertenza` color |
| `--testo-dettaglio` | `rgba(242, 245, 244, 0.86)` | il dettaglio che chiude (i fatti) | 1 uso: `.fatti` color |
| `--testo-requisiti-chiara` | `rgba(23, 29, 29, 0.86)` | i requisiti sulla scena chiara | 1 uso: `.requisiti li` color |

## Caratteri (2)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--font-testo` | `"Lexend", "Lexend riserva", system-ui, sans-serif` | il carattere di tutta la pagina, con il suo ripiego di larghezza | 1 uso: `body` font-family |
| `--font-app` | `"DejaVu Sans Kalliope", "DejaVu Sans", sans-serif` | il carattere della finestra di Kalliope ricostruita | 1 uso: `.finestra` font-family |

## Pesi (4)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--peso-forte` | `600` | comandi e parole che contano | 17 usi in 11 componenti: `.salta` font-weight; `.pillola` font-weight; `.chiudi` font-weight; +14 |
| `--peso-testo` | `400` | il testo corrente | 1 uso: `body` font-weight |
| `--peso-medio` | `500` | testo con un po' di peso: menu, bolla, nome | 6 usi in 6 componenti: `.menu a` font-weight; `.collegamento` font-weight; `.bolla-testo` font-weight; +3 |
| `--peso-titolo` | `700` | titoli | 4 usi in 4 componenti: `.marchio` font-weight; `h1` font-weight; `.esito h3` font-weight; +1 |

## Scala del testo (55)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--corpo-1` | `10px` | gradino di scala (corpo): lo stesso valore in più componenti | 3 usi in 2 componenti: `.riunione-filo .nome` font-size ((max-width: 760px)); `.tavolo .nome` font-size ((max-width: 760px)); `.app-griglia .nome` font-size ((max-width: 760px)) |
| `--corpo-2` | `11px` | gradino di scala (corpo): lo stesso valore in più componenti | 2 usi in 2 componenti: `.nome` font-size ((max-width: 760px)); `.sotto .finestra` font-size ((max-width: 760px)) |
| `--corpo-3` | `12px` | gradino di scala (corpo): lo stesso valore in più componenti | 4 usi in 3 componenti: `.riunione-filo .nome` font-size; `.app-griglia .nome` font-size; `.didascalia` font-size ((max-width: 760px)); +1 |
| `--corpo-4` | `13px` | gradino di scala (corpo): lo stesso valore in più componenti | 12 usi in 6 componenti: `.didascalia` font-size; `.nome` font-size; `.avvio .f-nota` font-size; +9 |
| `--corpo-5` | `14px` | gradino di scala (corpo): lo stesso valore in più componenti | 10 usi in 6 componenti: `.finestra` font-size; `.frase` font-size; `.palco.compatta .ascolto .riprova` font-size; +7 |
| `--corpo-6` | `15px` | gradino di scala (corpo): lo stesso valore in più componenti | 16 usi in 10 componenti: `.barra .barra-azione` font-size; `.chiudi` font-size; `.rivedi` font-size; +13 |
| `--corpo-7` | `16px` | gradino di scala (corpo): lo stesso valore in più componenti | 9 usi in 6 componenti: `.menu a` font-size; `.voce` font-size; `.messaggio-sotto .pillola` font-size; +6 |
| `--corpo-8` | `17px` | gradino di scala (corpo): lo stesso valore in più componenti | 7 usi in 5 componenti: `.collegamento` font-size; `.tappa-nome` font-size; `.esito p` font-size; +4 |
| `--corpo-9` | `18px` | gradino di scala (corpo): lo stesso valore in più componenti | 7 usi in 5 componenti: `.pillola` font-size; `.non-esiste p` font-size; `.riservato` font-size; +4 |
| `--corpo-10` | `20px` | gradino di scala (corpo): lo stesso valore in più componenti | 6 usi in 5 componenti: `.presentazione` font-size; `.tratto-testo p` font-size; `.requisiti li` font-size; +3 |
| `--corpo-11` | `22px` | gradino di scala (corpo): lo stesso valore in più componenti | 5 usi in 4 componenti: `.marchio` font-size; `.bolla-chiusa .bolla-testo` font-size; `.filo-bolla .bolla-testo` font-size; +2 |
| `--corpo-12` | `25px` | gradino di scala (corpo): lo stesso valore in più componenti | 1 uso: `h1` font-size ((min-width: 350px) and (max-wi) |
| `--interlinea-1` | `13px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 2 componenti: `.riunione-filo .nome` line-height ((max-width: 760px)); `.tavolo .nome` line-height ((max-width: 760px)); `.app-griglia .nome` line-height ((max-width: 760px)) |
| `--interlinea-2` | `16px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.riunione-filo .nome` line-height; `.app-griglia .nome` line-height |
| `--interlinea-3` | `18px` | gradino di scala (interlinea): lo stesso valore in più componenti | 4 usi in 3 componenti: `.nome` line-height; `.palco.compatta .ascolto-dentro > .…` line-height; `.stato` line-height ((max-width: 760px)); +1 |
| `--interlinea-4` | `19px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.didascalia` line-height; `.nota-ricostruzione` line-height |
| `--interlinea-5` | `21px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.chiusura .avvertenza` line-height; `.bolla-testo` line-height ((max-width: 760px)) |
| `--interlinea-6` | `22px` | gradino di scala (interlinea): lo stesso valore in più componenti | 5 usi in 4 componenti: `.stato` line-height; `.errore-ascolto` line-height; `.piede p` line-height; +2 |
| `--interlinea-7` | `24px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 2 componenti: `.detto-riga` line-height; `.filo-bolla .bolla-testo` line-height ((max-width: 760px)); `.riservato` line-height ((max-width: 760px)) |
| `--interlinea-8` | `26px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.esito p` line-height; `.fatti` line-height |
| `--interlinea-9` | `27px` | gradino di scala (interlinea): lo stesso valore in più componenti | 5 usi in 4 componenti: `.non-esiste p` line-height; `.riservato` line-height; `.presentazione` line-height ((min-width: 1000px) and (max-w); +2 |
| `--interlinea-10` | `28px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 3 componenti: `.esito h3` line-height; `.bolla-testo` line-height ((min-width: 761px) and (max-he); `.messaggio[data-frase="3"] .filo-bo…` line-height ((max-width: 760px)) |
| `--interlinea-11` | `29px` | gradino di scala (interlinea): lo stesso valore in più componenti | 1 uso: `h1` line-height ((min-width: 350px) and (max-wi) |
| `--interlinea-12` | `30px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 2 componenti: `.presentazione` line-height; `.tratto-testo p` line-height; `.requisiti li` line-height |
| `--interlinea-13` | `31px` | gradino di scala (interlinea): lo stesso valore in più componenti | 3 usi in 2 componenti: `.bolla-chiusa .bolla-testo` line-height; `.filo-bolla .bolla-testo` line-height; `.messaggio[data-frase="3"] .filo-bo…` line-height ((min-width: 761px) and (max-wi) |
| `--interlinea-14` | `37px` | gradino di scala (interlinea): lo stesso valore in più componenti | 2 usi in 2 componenti: `.messaggio[data-frase="3"] .filo-bo…` line-height; `.tratto h2` line-height ((max-width: 760px)) |
| `--spaziatura-marchio` | `-0.01em` | misura del componente «Barra e menu» | 1 uso: `.marchio` letter-spacing |
| `--didascalia-interlinea-telefono` | `17px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` line-height ((max-width: 760px)) |
| `--h1-grandezza` | `62px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` font-size |
| `--h1-grandezza-medio` | `48px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` font-size ((min-width: 1000px) and (max-w) |
| `--h1-grandezza-telefono` | `30px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` font-size ((max-width: 760px)) |
| `--h1-interlinea` | `64px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` line-height |
| `--h1-interlinea-medio` | `51px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` line-height ((min-width: 1000px) and (max-w) |
| `--h1-interlinea-telefono` | `33px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` line-height ((max-width: 760px)) |
| `--spaziatura-h1` | `-0.018em` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1` letter-spacing |
| `--stato-grandezza-telefono` | `12.5px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` font-size ((max-width: 760px)) |
| `--bolla-testo-grandezza` | `24px` | misura del componente «La bolla» | 1 uso: `.bolla-testo` font-size |
| `--bolla-testo-interlinea` | `34px` | misura del componente «La bolla» | 1 uso: `.bolla-testo` line-height |
| `--spaziatura-bolla-testo` | `-0.005em` | misura del componente «La bolla» | 1 uso: `.bolla-testo` letter-spacing |
| `--nome-interlinea-telefono` | `15px` | misura del componente «I riquadri della riunione» | 1 uso: `.nome` line-height ((max-width: 760px)) |
| `--microfono-grandezza-telefono` | `11.5px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.microfono` font-size ((max-width: 760px)) |
| `--filo-bolla-bolla-testo-grandezza-2` | `27px` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio[data-frase="3"] .filo-bo…` font-size |
| `--filo-bolla-bolla-testo-grandezza-tavoletta-filo` | `19px` | misura del componente «Le frasi del filo» | 1 uso: `.filo-bolla .bolla-testo` font-size ((min-width: 761px) and (max-wi) |
| `--spaziatura-computer-nome` | `0.01em` | misura del componente «La strada della voce» | 1 uso: `.computer-nome` letter-spacing |
| `--tappa-nome-interlinea` | `23px` | misura del componente «La strada della voce» | 1 uso: `.tappa-nome` line-height |
| `--chiusura-grandezza` | `64px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura h2` font-size |
| `--chiusura-grandezza-telefono` | `38px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura h2` font-size ((max-width: 760px)) |
| `--chiusura-interlinea` | `68px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura h2` line-height |
| `--chiusura-interlinea-telefono` | `42px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura h2` line-height ((max-width: 760px)) |
| `--spaziatura-tratto` | `-0.018em` | misura del componente «Tratti e scene» | 1 uso: `.tratto h2` letter-spacing |
| `--tratto-grandezza` | `52px` | misura del componente «Tratti e scene» | 1 uso: `.tratto h2` font-size |
| `--tratto-grandezza-telefono` | `33px` | misura del componente «Tratti e scene» | 1 uso: `.tratto h2` font-size ((max-width: 760px)) |
| `--tratto-interlinea` | `56px` | misura del componente «Tratti e scene» | 1 uso: `.tratto h2` line-height |
| `--tratto-testo-interlinea-telefono` | `25px` | misura del componente «Tratti e scene» | 1 uso: `.tratto-testo p` line-height ((max-width: 760px)) |

## Spazi (scala a gradini) (12)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--spazi-1` | `0 10px` | gradino di scala (spazi): lo stesso valore in più componenti | 3 usi in 2 componenti: `.f-campo` padding; `.palco.compatta .ascolto .frase` padding; `.ascolto .frase` padding ((min-width: 761px) and (max-he) |
| `--spazi-2` | `0 14px` | gradino di scala (spazi): lo stesso valore in più componenti | 4 usi in 3 componenti: `.f-primario` padding; `.frase` padding; `.barra .barra-azione` padding ((max-width: 760px)); +1 |
| `--spazi-3` | `0 18px` | gradino di scala (spazi): lo stesso valore in più componenti | 5 usi in 3 componenti: `.chiudi` padding; `.rivedi` padding; `.palco.compatta .ascolto .riprova` padding; +2 |
| `--spazi-4` | `0 20px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi in 2 componenti: `.barra .barra-azione` padding; `.riprova` padding |
| `--spazi-5` | `0 4px` | gradino di scala (spazi): lo stesso valore in più componenti | 3 usi in 2 componenti: `.collegamento` padding; `.palco.compatta .ascolto-dentro > .…` padding; `.ascolto-dentro > .errore-ascolto` padding ((min-width: 761px) and (max-he) |
| `--spazi-6` | `1px 6px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi: `.riunione-filo .nome` padding ((max-width: 760px)); `.tavolo .nome` padding ((max-width: 760px)) |
| `--spazi-7` | `2px 16px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi: `.palco.compatta .ascolto-dentro > .…` gap; `.ascolto-dentro > .errore-ascolto .…` gap ((min-width: 761px) and (max-he) |
| `--spazi-8` | `3px 9px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi in 2 componenti: `.riunione-filo .nome` padding; `.app-griglia .nome` padding |
| `--spazi-9` | `6px 7px` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi: `.palco.compatta .ascolto-dentro` padding; `.ascolto-dentro` padding ((min-width: 761px) and (max-he) |
| `--spazi-10` | `18px 0 0` | gradino di scala (spazi): lo stesso valore in più componenti | 3 usi in 2 componenti: `.nota-ricostruzione` margin; `.avvio-piede .nota-ricostruzione` margin; `.tratto-testo p` margin |
| `--spazi-11` | `26px 0 0` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi in 2 componenti: `.didascalia` margin; `.riservato` margin ((max-width: 760px)) |
| `--spazi-12` | `30px 0 0` | gradino di scala (spazi): lo stesso valore in più componenti | 2 usi: `.requisiti` margin; `.fatti` margin |

## Misure (265)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--margine` | `80px` |  | 0 usi:  |
| `--raggio-scena` | `48px` |  | 0 usi:  |
| `--sovrap` | `40vh` |  | 0 usi:  |
| `--misura-1` | `1px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi in 2 componenti: `.solo-lettori` width; `.solo-lettori` height; `.f-cursore` width |
| `--misura-2` | `4px` | gradino di scala (misura): lo stesso valore in più componenti | 8 usi in 3 componenti: `.linea` height; `.esito h3::before` height; `.requisiti li::before, .requisiti l…` width; +5 |
| `--misura-3` | `7px` | gradino di scala (misura): lo stesso valore in più componenti | 5 usi in 2 componenti: `.app-griglia .barre i` width; `.palco.compatta .ascolto .frase::be…` width; `.palco.compatta .ascolto .frase::be…` height; +2 |
| `--misura-4` | `8px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi in 2 componenti: `.f-barra` height; `.frase::before` width; `.frase::before` height |
| `--misura-5` | `10px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi in 2 componenti: `.tavolo .barre i` width; `.frase.carica::before` width; `.frase.carica::before` height |
| `--misura-6` | `12px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.voce.suona .voce-tondo::before` width; `.suona-frase.suona .tondo::before` width |
| `--misura-7` | `14px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.voce.suona .voce-tondo::before` height; `.suona-frase.suona .tondo::before` height |
| `--misura-8` | `16px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.collegamento .freccia` width; `.collegamento .freccia` height |
| `--misura-9` | `18px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 3 componenti: `.f-cursore` height; `.impulso` width; `.impulso` height; +1 |
| `--misura-10` | `22px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.app-icona` width ((max-width: 760px)); `.app-icona` height ((max-width: 760px)) |
| `--misura-11` | `24px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.bolla .coda` height; `.bolla .coda` width ((max-width: 760px)) |
| `--misura-12` | `26px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.riunione-filo .barre` height ((max-width: 760px)); `.tavolo .barre` height ((max-width: 760px)) |
| `--misura-13` | `28px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.app-icona` width; `.app-icona` height |
| `--misura-14` | `30px` | gradino di scala (misura): lo stesso valore in più componenti | 6 usi in 4 componenti: `.esito h3::before` width; `.marchio svg` width ((max-width: 760px)); `.marchio svg` height ((max-width: 760px)); +3 |
| `--misura-15` | `32px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi in 2 componenti: `.bolla .coda` width; `.f-campo` height; `.f-pulsante` height |
| `--misura-16` | `34px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.voce-tondo` width; `.voce-tondo` height |
| `--misura-17` | `36px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 2 componenti: `.marchio svg` width; `.marchio svg` height; `.palco.compatta .ascolto .frase` min-height; +1 |
| `--misura-18` | `38px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 2 componenti: `.messaggio-sotto .tondo` width; `.messaggio-sotto .tondo` height; `.tondo` width ((max-width: 760px)); +1 |
| `--misura-19` | `40px` | gradino di scala (misura): lo stesso valore in più componenti | 12 usi in 5 componenti: `.tondo` width; `.tondo` height; `.palco.compatta .ascolto .chiudi` min-height; +9 |
| `--misura-20` | `42px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi: `.frase` min-height; `.palco.compatta .ascolto .voce` min-height; `.ascolto .voce` min-height ((min-width: 761px) and (max-he) |
| `--misura-21` | `44px` | gradino di scala (misura): lo stesso valore in più componenti | 11 usi in 6 componenti: `.barra .barra-azione` min-height; `.marchio` min-height; `.menu a` min-height; +8 |
| `--misura-22` | `48px` | gradino di scala (misura): lo stesso valore in più componenti | 5 usi in 4 componenti: `.collegamento` min-height; `.messaggio-sotto .pillola` min-height; `.pillola.voce-chiara` min-height ((max-width: 760px)); +2 |
| `--misura-23` | `56px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.pillola` min-height; `.barra` height ((max-width: 760px)) |
| `--misura-24` | `58px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.riunione-filo .barre` height; `.app-comandi` height |
| `--misura-25` | `76px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi: `.nodo` width ((max-width: 760px)); `.nodo` height ((max-width: 760px)); `.nodo-altri` width ((max-width: 760px)); +1 |
| `--misura-26` | `80px` | gradino di scala (misura): lo stesso valore in più componenti | 5 usi: `.nodo` width; `.nodo` height; `.scoppio` width; +2 |
| `--misura-27` | `108px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.posto-bolla` height ((max-width: 760px)); `.posto-bolla-chiusa` height ((max-width: 760px)) |
| `--misura-28` | `124px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.posto-bolla-chiusa` height; `.posto-bolla` height ((min-width: 761px) and (max-he) |
| `--misura-29` | `470px` | gradino di scala (misura): lo stesso valore in più componenti | 3 usi: `.finestra` width; `.nota-ricostruzione` max-width; `.avvio-piede .nota-ricostruzione` max-width |
| `--misura-30` | `520px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 4 componenti: `.presentazione` max-width; `.errore-ascolto` max-width; `.esito p` max-width; +1 |
| `--misura-31` | `620px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.finestra.avvio` max-width ((min-width: 761px) and (max-wi); `.ascolto-voce .tratto-testo > p` max-width ((min-width: 761px) and (max-wi) |
| `--misura-32` | `640px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.fatti` max-width; `.chiusura .avvertenza` max-width |
| `--misura-33` | `760px` | gradino di scala (misura): lo stesso valore in più componenti | 4 usi in 3 componenti: `.riservato` max-width; `.palco` max-width ((min-width: 761px) and (max-wi); `.luce, .luce-voce` width ((max-width: 760px)); +1 |
| `--misura-34` | `1250px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi: `.luce, .luce-voce` width; `.chiusura .luce-tratto` width |
| `--misura-35` | `1440px` | gradino di scala (misura): lo stesso valore in più componenti | 2 usi in 2 componenti: `.barra, .scena, .campioni, .oggi, .…` max-width; `.tratto` max-width |
| `--spazio-meno-3` | `-4px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.voce.pausa .voce-tondo::after` inset; `.suona-frase.pausa .tondo::after` inset |
| `--spazio-meno-2` | `-5px` | gradino di scala (spazio): lo stesso valore in più componenti | 4 usi in 2 componenti: `.voce.suona .voce-tondo::after` inset; `.voce.carica .voce-tondo::after` inset; `.suona-frase.carica .tondo::after` inset; +1 |
| `--spazio-meno-1` | `-22px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.barra .barra-azione` margin-top; `.riunione-app` margin-top |
| `--spazio-1` | `2px` | gradino di scala (spazio): lo stesso valore in più componenti | 6 usi in 3 componenti: `.menu ul` gap; `.microfono-scelte` gap; `.ascolto-dentro > .errore-ascolto` margin-top; +3 |
| `--spazio-2` | `3px` | gradino di scala (spazio): lo stesso valore in più componenti | 6 usi in 4 componenti: `.requisiti li::before, .requisiti l…` top; `.requisiti li::before, .requisiti l…` bottom; `.riunione-filo .barre` gap ((max-width: 760px)); +3 |
| `--spazio-3` | `4px` | gradino di scala (spazio): lo stesso valore in più componenti | 13 usi in 8 componenti: `.ascolto-dentro > .errore-ascolto .…` margin-top; `.scarica-file` text-underline-offset; `.messaggio-sotto` padding-inline-start; +10 |
| `--spazio-4` | `5px` | gradino di scala (spazio): lo stesso valore in più componenti | 12 usi in 2 componenti: `.app-griglia .barre` gap; `.chiamata` padding ((max-width: 760px)); `.griglia` gap ((max-width: 760px)); +9 |
| `--spazio-5` | `6px` | gradino di scala (spazio): lo stesso valore in più componenti | 19 usi in 6 componenti: `.collegamento` text-underline-offset; `.riunione-filo` padding; `.riunione-filo .griglia` gap; +16 |
| `--spazio-6` | `7px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 3 componenti: `.tavolo .barre` gap; `.riunione-app` padding; `.app-griglia .nome` inset-inline-start; +2 |
| `--spazio-7` | `8px` | gradino di scala (spazio): lo stesso valore in più componenti | 20 usi in 7 componenti: `.collegamento` gap; `.chiamata` padding; `.griglia` gap; +17 |
| `--spazio-8` | `10px` | gradino di scala (spazio): lo stesso valore in più componenti | 15 usi in 8 componenti: `.rivedi` margin-top; `.nome` inset-inline-start; `.nome` top; +12 |
| `--spazio-9` | `11px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi in 3 componenti: `.voce.suona .voce-tondo::before` left; `.messaggio-sotto .tondo::before` top; `.tondo::before` top ((max-width: 760px)) |
| `--spazio-10` | `12px` | gradino di scala (spazio): lo stesso valore in più componenti | 16 usi in 10 componenti: `.salta:focus` top; `.marchio` gap; `.pillola` gap; +13 |
| `--spazio-11` | `13px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.voce-tondo::before` left; `.suona-frase.suona .tondo::before` left |
| `--spazio-12` | `14px` | gradino di scala (spazio): lo stesso valore in più componenti | 12 usi in 7 componenti: `.stato` padding-inline-start; `.ascolto-dentro > .errore-ascolto` scroll-margin-bottom; `.ascolto` scroll-margin-bottom; +9 |
| `--spazio-13` | `15px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.tondo::before` left; `.bolla-vecchia` top |
| `--spazio-14` | `16px` | gradino di scala (spazio): lo stesso valore in più componenti | 10 usi in 7 componenti: `.salta` inset-inline-start; `.barra` gap; `.didascalia` padding-inline-start; +7 |
| `--spazio-15` | `18px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 3 componenti: `.bolla` bottom; `.computer-nome` top; `.messaggio:nth-child(2)` margin-inline-start ((max-width: 760px)); +2 |
| `--spazio-16` | `20px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi: `.apertura` padding-top ((min-width: 761px) and (max-wi); `.apertura .stato` margin-top ((min-width: 761px) and (max-he) |
| `--spazio-17` | `22px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 5 componenti: `.bolla-vecchia` inset-inline-start ((min-width: 1000px) and (max-w); `.computer-nome` inset-inline-start; `.requisiti` gap; +2 |
| `--spazio-18` | `24px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.messaggio:nth-child(2)` margin-inline-start ((min-width: 761px) and (max-wi); `.tappe` row-gap ((max-width: 760px)) |
| `--spazio-19` | `26px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 4 componenti: `.messaggio-sotto` margin-top; `.requisiti li` padding-inline-start; `.bolla .coda` inset-inline-start ((max-width: 760px)); +2 |
| `--spazio-20` | `30px` | gradino di scala (spazio): lo stesso valore in più componenti | 4 usi in 3 componenti: `.riunione-filo` margin-top; `.voci-filo` margin-top; `.non-esiste` padding-top; +1 |
| `--spazio-21` | `34px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi in 3 componenti: `.tavolo` margin-bottom ((max-width: 760px)); `.filo` row-gap ((max-width: 760px)); `.ascolto-voce, .serve` gap ((max-width: 760px)) |
| `--spazio-22` | `36px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 4 componenti: `.chiusura .comandi` margin-top; `.banda-riunione` margin-top ((min-width: 761px) and (max-wi); `.ascolto-voce` column-gap ((min-width: 761px) and (max-wi); +2 |
| `--spazio-23` | `38px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi: `.scoppio` inset-inline-start ((max-width: 760px)); `.scoppio` top ((max-width: 760px)) |
| `--spazio-24` | `40px` | gradino di scala (spazio): lo stesso valore in più componenti | 7 usi in 4 componenti: `.apertura` padding-top; `.bolla .coda` inset-inline-start; `.messaggi` gap; +4 |
| `--spazio-25` | `44px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi in 2 componenti: `.filo` column-gap; `.esiti` margin-top; `.non-esiste` margin-top ((max-width: 760px)) |
| `--spazio-26` | `48px` | gradino di scala (spazio): lo stesso valore in più componenti | 4 usi in 3 componenti: `.esito-forse` padding-inline-start; `.chiamata .riquadro.tu .barre` top ((min-width: 761px) and (max-he); `.ascolto-voce, .serve` row-gap ((min-width: 761px) and (max-wi); +1 |
| `--spazio-27` | `54px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi: `.linea` inset-inline-start ((max-width: 760px)); `.linea-fatta` inset-inline-start ((max-width: 760px)); `.linea-forse` inset-inline-start ((max-width: 760px)) |
| `--spazio-28` | `56px` | gradino di scala (spazio): lo stesso valore in più componenti | 5 usi in 5 componenti: `.messaggio:nth-child(2)` margin-inline-start; `.piede.scena-notte` padding-top; `.js .menu.aperto` top ((max-width: 760px)); +2 |
| `--spazio-29` | `60px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.scena` column-gap; `.strada` margin-top |
| `--spazio-30` | `80px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.ascolto-voce` column-gap; `.serve` column-gap |
| `--spazio-31` | `88px` | gradino di scala (spazio): lo stesso valore in più componenti | 2 usi in 2 componenti: `html` scroll-padding-top; `.linea` top ((max-width: 760px)) |
| `--spazio-32` | `100px` | gradino di scala (spazio): lo stesso valore in più componenti | 3 usi in 3 componenti: `.ascolto-voce .tratto-testo` top; `.linea` top; `.banda-riunione` top ((min-width: 761px) and (max-wi) |
| `--fuoco-scarto` | `3px` | quanto il contorno del fuoco sta staccato dal comando | 1 uso: `:focus-visible` outline-offset |
| `--salta-sopra` | `-80px` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 1 uso: `.salta` top |
| `--salta-spazio-interno` | `12px 18px` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 1 uso: `.salta` padding |
| `--solo-lettori-margine` | `-1px` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 1 uso: `.solo-lettori` margin |
| `--barra-altezza` | `72px` | misura del componente «Barra e menu» | 1 uso: `.barra` height |
| `--barra-azione-largo-menu-base` | `92px` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` inset-inline-end ((max-width: 959px)) |
| `--barra-azione-margine-sopra-telefono` | `-20px` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` margin-top ((max-width: 760px)) |
| `--barra-azione-sposta-x` | `12px` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transform |
| `--barra-compatto-ritaglio` | `inset(0 -100vmax -1px)` | misura del componente «Barra e menu» | 1 uso: `.barra.compatta` clip-path |
| `--barra-intervallo` | `0 24px` | misura del componente «Barra e menu» | 1 uso: `html:not(.js) .barra` animation-range (@supports (animation-timeline:) |
| `--barra-menu-posto-azione-base` | `235px` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .menu` transform |
| `--barra-ritaglio` | `inset(0 -100vmax -1px)` | misura del componente «Barra e menu» | 1 uso: `html:not(.js) .barra` clip-path |
| `--marchio-larghezza-massima` | `160px` | misura del componente «Barra e menu» | 1 uso: `.marchio span` max-width |
| `--menu-aperto-altezza-massima` | `calc(100vh - 84px)` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` max-height ((max-width: 959px)) |
| `--menu-aperto-altezza-massima-menu-chiuso` | `calc(100dvh - 84px)` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` max-height ((max-width: 959px)) |
| `--menu-aperto-altezza-minima` | `52px` | misura del componente «Barra e menu» | 1 uso: `.menu.aperto a` min-height ((max-width: 959px)) |
| `--menu-aperto-dopo-intervallo` | `0% calc(100% - 12px)` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto::after` animation-range (@supports (animation-timeline:) |
| `--menu-aperto-dopo-margine-sopra` | `-40px` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto::after` margin-top (@supports (animation-timeline:) |
| `--menu-aperto-larghezza` | `min(340px, calc(100vw - 2 * var(--margine)))` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` width ((min-width: 761px) and (max-wi) |
| `--menu-aperto-sfocatura` | `blur(18px)` | misura del componente «Barra e menu» | 2 usi: `.js .menu.aperto` -webkit-backdrop-filter ((max-width: 959px)); `.js .menu.aperto` backdrop-filter ((max-width: 959px)) |
| `--menu-aperto-sopra-tavoletta-stretta` | `calc(100% + 4px)` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` top ((min-width: 761px) and (max-wi) |
| `--menu-spazio-interno` | `0 16px` | misura del componente «Barra e menu» | 1 uso: `.menu a` padding |
| `--collegamento-freccia-sopra-sposta-x` | `4px` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento:hover .freccia, .coll…` transform |
| `--collegamento-sottolineatura-spessore` | `1.5px` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento` text-decoration-thickness |
| `--pillola-spazio-interno` | `0 30px` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola` padding |
| `--pillola-spazio-interno-2-blocco` | `0` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola.voce-chiara` padding-block |
| `--pillola-spazio-interno-2-inline` | `8px 24px` | misura del componente «Pulsanti e pillole», inizio e fine | 1 uso: `.pillola.voce-chiara` padding-inline |
| `--pillola-spazio-interno-telefono-blocco` | `0` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola.voce-chiara` padding-block ((max-width: 760px)) |
| `--pillola-spazio-interno-telefono-inline` | `5px 20px` | misura del componente «Pulsanti e pillole», inizio e fine | 1 uso: `.pillola.voce-chiara` padding-inline ((max-width: 760px)) |
| `--tondo-prima-triangolo` | `14px` | misura del componente «Pulsanti e pillole» | 1 uso: `.tondo::before` border-left |
| `--tondo-prima-triangolo-2` | `8px` | misura del componente «Pulsanti e pillole» | 2 usi: `.tondo::before` border-top; `.tondo::before` border-bottom |
| `--comandi-distanza` | `10px 22px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi` gap |
| `--comandi-margine-sopra` | `32px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi` margin-top |
| `--didascalia-larghezza-massima` | `480px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` max-width |
| `--didascalia-margine-telefono` | `14px 0 6px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` margin ((max-width: 760px)) |
| `--presentazione-margine` | `24px 0 0` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.presentazione` margin |
| `--scena-colonne` | `minmax(0, 560px) minmax(0, 1fr)` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.scena` grid-template-columns |
| `--scena-spazio-interno` | `30px var(--margine) 0` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.scena` padding |
| `--scena-spazio-interno-telefono` | `14px var(--margine) 0` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.scena` padding ((max-width: 760px)) |
| `--stato-larghezza-massima` | `500px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` max-width |
| `--stato-margine` | `28px 0 0` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` margin |
| `--bolla-chiusa-larghezza-massima` | `min(600px, 100%)` | misura del componente «La bolla» | 1 uso: `.bolla-chiusa` max-width |
| `--bolla-coda-sopra` | `calc(100% - 1px)` | misura del componente «La bolla» | 1 uso: `.bolla .coda` top |
| `--bolla-corpo-spazio-interno` | `15px 22px 17px` | misura del componente «La bolla» | 1 uso: `.bolla-corpo` padding |
| `--bolla-corpo-spazio-interno-basso-699` | `12px 20px 14px` | misura del componente «La bolla» | 1 uso: `.bolla-corpo` padding ((min-width: 761px) and (max-he) |
| `--bolla-corpo-spazio-interno-telefono` | `10px 14px 12px` | misura del componente «La bolla» | 1 uso: `.bolla-corpo` padding ((max-width: 760px)) |
| `--posto-bolla-altezza` | `150px` | misura del componente «La bolla» | 1 uso: `.posto-bolla` height |
| `--anna-occhi-sposta-x` | `-3px` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .occhi` transform |
| `--anna-occhi-sposta-y` | `-2.5px` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .occhi` transform |
| `--anna-testa-sposta-x` | `-2px` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .testa` transform |
| `--anna-testa-sposta-y` | `-1px` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .testa` transform |
| `--annuisce-25-sposta-y` | `3px` | misura del componente «I riquadri della riunione» | 1 uso: `@keyframes annuisce 25%` transform |
| `--annuisce-72-sposta-y` | `2px` | misura del componente «I riquadri della riunione» | 1 uso: `@keyframes annuisce 72%` transform |
| `--banda-riunione-margine` | `10px -20px 0` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione` margin ((max-width: 760px)) |
| `--banda-riunione-spazio-interno` | `8px 20px 10px` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione` padding ((max-width: 760px)) |
| `--barre-altezza` | `100px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre` height |
| `--barre-larghezza` | `15px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` width |
| `--barre-larghezza-telefono` | `6px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` width ((max-width: 760px)) |
| `--chiamata-altezza` | `362px` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` height |
| `--chiamata-altezza-basso-699` | `clamp(200px, calc(100vh - 336px), 362px)` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` height ((min-width: 761px) and (max-he) |
| `--chiamata-altezza-computer` | `clamp(190px, calc(100vh - 441px), 362px)` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` height ((min-width: 761px)) |
| `--chiamata-altezza-telefono` | `176px` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` height ((max-width: 760px)) |
| `--chiamata-nome-spazio-interno` | `4px 9px` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata .nome` padding ((min-width: 1181px) and (max-w) |
| `--luca-occhi-sposta-x` | `-1px` | misura del componente «I riquadri della riunione» | 1 uso: `.luca.guarda .occhi` transform |
| `--luca-occhi-sposta-y` | `-3px` | misura del componente «I riquadri della riunione» | 1 uso: `.luca.guarda .occhi` transform |
| `--luca-testa-sposta-y` | `-1px` | misura del componente «I riquadri della riunione» | 1 uso: `.luca.guarda .testa` transform |
| `--nome-spazio-interno` | `4px 11px` | misura del componente «I riquadri della riunione» | 1 uso: `.nome` padding |
| `--nome-spazio-interno-telefono` | `2px 8px` | misura del componente «I riquadri della riunione» | 1 uso: `.nome` padding ((max-width: 760px)) |
| `--paola-occhi-sposta-x` | `-3.5px` | misura del componente «I riquadri della riunione» | 1 uso: `.paola.guarda .occhi` transform |
| `--paola-testa-sposta-x` | `-2px` | misura del componente «I riquadri della riunione» | 1 uso: `.paola.guarda .testa` transform |
| `--riquadro-barre-altezza` | `min(100px, 60%)` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata .riquadro.tu .barre` height ((min-width: 761px)) |
| `--riunione-filo-altezza` | `248px` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo` height |
| `--riunione-filo-altezza-tavoletta-filo` | `clamp(214px, 26vw, 262px)` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo` height ((min-width: 761px) and (max-wi) |
| `--riunione-filo-barre-larghezza` | `9px` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo .barre i` width |
| `--riunione-filo-griglia-righe` | `66px` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo .griglia` grid-template-rows ((max-width: 760px)) |
| `--tavolo-barre-altezza` | `64px` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo .barre` height |
| `--tavolo-cornice-altezza` | `172px` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo-cornice` height |
| `--tavolo-cornice-altezza-telefono` | `78px` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo-cornice` height ((max-width: 760px)) |
| `--tavolo-larghezza` | `min(820px, 100%)` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo` width |
| `--tavolo-margine` | `0 0 52px` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo` margin |
| `--avvio-piede-larghezza` | `calc(100% - 520px)` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.avvio-piede` width ((min-width: 791px)) |
| `--f-cursore-margine-inizio` | `1px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-cursore` margin-inline-start |
| `--finestra-larghezza-2` | `min(470px, 100%)` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.finestra.avvio` width |
| `--nota-ricostruzione-margine-telefono` | `16px 0 0` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.nota-ricostruzione` margin ((max-width: 760px)) |
| `--sotto-margine-sopra` | `-14px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` margin-top |
| `--sotto-margine-sopra-telefono` | `-16px` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` margin-top ((max-width: 760px)) |
| `--riunione-app-comandi-spazio-interno` | `8px 0 4px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-comandi` padding ((max-width: 420px)) |
| `--riunione-app-griglia-barre-larghezza-telefono` | `5px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia .barre i` width ((max-width: 760px)) |
| `--riunione-app-griglia-nome-spazio-interno-telefono` | `2px 7px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia .nome` padding ((max-width: 760px)) |
| `--riunione-app-griglia-righe` | `104px 104px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia` grid-template-rows |
| `--riunione-app-griglia-righe-telefono` | `78px 78px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia` grid-template-rows ((max-width: 760px)) |
| `--microfono-spazio-interno-blocco` | `4px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.microfono` padding-block |
| `--microfono-spazio-interno-inline` | `6px 4px` | misura del componente «La riunione ricostruita, con il microfono», inizio e fine | 1 uso: `.microfono` padding-inline |
| `--microfono-spazio-interno-telefono-blocco` | `3px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.microfono` padding-block ((max-width: 760px)) |
| `--microfono-spazio-interno-telefono-inline` | `4px 3px` | misura del componente «La riunione ricostruita, con il microfono», inizio e fine | 1 uso: `.microfono` padding-inline ((max-width: 760px)) |
| `--microfono-titolo-spazio-interno` | `2px 4px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.microfono-titolo` padding ((max-width: 420px)) |
| `--riunione-app-larghezza` | `min(480px, 100%)` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app` width |
| `--riunione-app-larghezza-telefono` | `calc(100% - 28px)` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app` width ((max-width: 760px)) |
| `--scelta-spazio-interno` | `7px 13px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` padding |
| `--scelta-spazio-interno-telefono` | `6px 9px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` padding ((max-width: 760px)) |
| `--ascolto-dentro-errore-ascolto-spazio-interno` | `0 6px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.ascolto-dentro > .errore-ascolto` padding |
| `--ascolto-dentro-spazio-interno` | `8px 10px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.ascolto-dentro` padding |
| `--ascolto-sfocatura` | `blur(18px)` | misura del componente «La scheda dell'ascolto» | 2 usi: `.ascolto` -webkit-backdrop-filter; `.ascolto` backdrop-filter |
| `--fila-ascolto-altezza-minima` | `112px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.fila-ascolto` min-height |
| `--frase-spazio-interno-telefono` | `0 11px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.frase` padding ((max-width: 760px)) |
| `--voce-altezza-minima` | `46px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce` min-height |
| `--voce-spazio-interno-blocco` | `0` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce` padding-block |
| `--voce-spazio-interno-inline` | `6px 18px` | misura del componente «La scheda dell'ascolto», inizio e fine | 1 uso: `.voce` padding-inline |
| `--voce-tondo-prima-triangolo` | `12px` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce-tondo::before` border-left |
| `--voce-tondo-prima-triangolo-2` | `7px` | misura del componente «La scheda dell'ascolto» | 2 usi: `.voce-tondo::before` border-top; `.voce-tondo::before` border-bottom |
| `--errore-ascolto-spazio-interno` | `14px 18px 16px` | misura del componente «I messaggi d'errore» | 1 uso: `.errore-ascolto` padding |
| `--errore-azioni-distanza` | `6px 20px` | misura del componente «I messaggi d'errore» | 1 uso: `.errore-azioni` gap |
| `--ascolto-voce-colonne` | `440px minmax(0, 1fr)` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce` grid-template-columns |
| `--ascolto-voce-colonne-tavoletta-filo` | `clamp(280px, 36vw, 360px) minmax(0, 1fr)` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce` grid-template-columns ((min-width: 761px) and (max-wi) |
| `--ascolto-voce-dopo-altezza` | `110px` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce::after` height ((max-width: 760px)) |
| `--ascolto-voce-margine-sopra` | `78px` | misura del componente «Le frasi del filo» | 1 uso: `.tratto.ascolto-voce` margin-top |
| `--ascolto-voce-messaggio-scorrimento-margine` | `168px` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce .messaggio, .ascolto-…` scroll-margin-top ((max-width: 760px)) |
| `--ascolto-voce-spazio-sotto` | `calc(var(--sovrap) - 26px)` | misura del componente «Le frasi del filo» | 1 uso: `.tratto.ascolto-voce.scena-notte` padding-bottom ((max-width: 760px)) |
| `--ascolto-voce-voci-filo-margine-sopra` | `28px` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce .voci-filo` margin-top |
| `--detto-riga-larghezza-massima` | `560px` | misura del componente «Le frasi del filo» | 1 uso: `.detto-riga` max-width |
| `--detto-riga-margine-blocco` | `14px 0` | misura del componente «Le frasi del filo» | 1 uso: `.detto-riga` margin-block |
| `--detto-riga-margine-inline` | `4px 0` | misura del componente «Le frasi del filo», inizio e fine | 1 uso: `.detto-riga` margin-inline |
| `--filo-colonne` | `minmax(0, 1fr) 118px` | misura del componente «Le frasi del filo» | 1 uso: `.filo` grid-template-columns |
| `--messaggio-larghezza-massima` | `360px` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio audio` max-width |
| `--messaggio-sotto-distanza` | `10px 16px` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio-sotto` gap |
| `--messaggio-sotto-pillola-spazio-interno-blocco` | `0` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio-sotto .pillola` padding-block |
| `--messaggio-sotto-pillola-spazio-interno-inline` | `5px 20px` | misura del componente «Le frasi del filo», inizio e fine | 1 uso: `.messaggio-sotto .pillola` padding-inline |
| `--computer-altezza` | `236px` | misura del componente «La strada della voce» | 1 uso: `.computer` height |
| `--computer-altezza-telefono` | `352px` | misura del componente «La strada della voce» | 1 uso: `.computer` height ((max-width: 760px)) |
| `--esito-margine` | `0 0 10px` | misura del componente «La strada della voce» | 1 uso: `.esito h3` margin |
| `--esito-spazio-interno-blocco` | `0` | misura del componente «La strada della voce» | 1 uso: `.esito` padding-block |
| `--esito-spazio-interno-inline` | `22px 34px` | misura del componente «La strada della voce», inizio e fine | 1 uso: `.esito` padding-inline |
| `--impulso-margine-inizio` | `-9px` | misura del componente «La strada della voce» | 1 uso: `.impulso` margin-inline-start ((max-width: 760px)) |
| `--impulso-sopra` | `93px` | misura del componente «La strada della voce» | 1 uso: `.impulso` top |
| `--impulso-sopra-telefono` | `79px` | misura del componente «La strada della voce» | 1 uso: `.impulso` top ((max-width: 760px)) |
| `--linea-altezza-telefono` | `200px` | misura del componente «La strada della voce» | 1 uso: `.linea` height ((max-width: 760px)) |
| `--linea-forse-sopra` | `288px` | misura del componente «La strada della voce» | 1 uso: `.linea-forse` top ((max-width: 760px)) |
| `--nodo-altri-larghezza` | `128px` | misura del componente «La strada della voce» | 1 uso: `.nodo-altri` width |
| `--non-esiste-distanza` | `10px 26px` | misura del componente «La strada della voce» | 1 uso: `.non-esiste` gap |
| `--non-esiste-margine-sopra` | `64px` | misura del componente «La strada della voce» | 1 uso: `.non-esiste` margin-top |
| `--riservato-margine-blocco` | `34px 0` | misura del componente «La strada della voce» | 1 uso: `.riservato` margin-block |
| `--riservato-margine-inline` | `22px 0` | misura del componente «La strada della voce», inizio e fine | 1 uso: `.riservato` margin-inline |
| `--scoppio-margine-blocco` | `-40px 0` | misura del componente «La strada della voce» | 1 uso: `.scoppio` margin-block |
| `--scoppio-margine-inline` | `-40px 0` | misura del componente «La strada della voce», inizio e fine | 1 uso: `.scoppio` margin-inline |
| `--strada-esito-sposta-y` | `14px` | misura del componente «La strada della voce» | 1 uso: `.js .strada:not(.fatto) .esito` transform |
| `--strada-riservato-sposta-y` | `14px` | misura del componente «La strada della voce» | 1 uso: `.js .strada:not(.fatto) .riservato` transform |
| `--tappa-nome-larghezza-massima` | `170px` | misura del componente «La strada della voce» | 1 uso: `.tappa-nome` max-width |
| `--tappe-spazio-interno` | `62px 0 0` | misura del componente «La strada della voce» | 1 uso: `.tappe` padding |
| `--tappe-spazio-interno-telefono-blocco` | `50px 0` | misura del componente «La strada della voce» | 1 uso: `.tappe` padding-block ((max-width: 760px)) |
| `--tappe-spazio-interno-telefono-inline` | `18px 0` | misura del componente «La strada della voce», inizio e fine | 1 uso: `.tappe` padding-inline ((max-width: 760px)) |
| `--chiusura-avvertenza-margine` | `14px 0 0` | misura del componente «Tratti e scene» | 1 uso: `.chiusura .avvertenza` margin |
| `--chiusura-luce-tratto-altezza` | `1000px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura .luce-tratto` height |
| `--chiusura-spazio-sopra` | `104px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura` padding-top |
| `--chiusura-spazio-sopra-telefono` | `72px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura` padding-top ((max-width: 760px)) |
| `--chiusura-spazio-sotto` | `130px` | misura del componente «Tratti e scene» | 1 uso: `.chiusura` padding-bottom |
| `--chiusura-spazio-sotto-2` | `calc(128px + var(--raggio-scena))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.chiusura.scena-stanza` padding-bottom |
| `--chiusura-spazio-sotto-telefono` | `84px` | misura del componente «Tratti e scene» | 1 uso: `.tratto.chiusura` padding-bottom ((max-width: 760px)) |
| `--chiusura-spazio-sotto-telefono-2` | `calc(84px + var(--raggio-scena))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.chiusura.scena-stanza` padding-bottom ((max-width: 760px)) |
| `--entra-finestra-sposta-y` | `16px` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-finestra` transform |
| `--entra-titolo-sposta-y` | `20px` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-titolo` transform |
| `--luce-altezza` | `1150px` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` height |
| `--luce-inizio` | `calc(50% + 310px)` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` left (fisico: in coppia con translate(-50%, -50%); elenco dei versi) |
| `--luce-inizio-medio` | `calc(50% + 230px)` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` left (fisico: in coppia con translate(-50%, -50%); elenco dei versi) ((min-width: 1000px) and (max-w) |
| `--luce-sopra` | `470px` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` top |
| `--luce-sopra-tavoletta` | `860px` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` top ((min-width: 761px) and (max-wi) |
| `--luce-sopra-telefono` | `520px` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` top ((max-width: 760px)) |
| `--luce-tratto-altezza` | `950px` | misura del componente «Tratti e scene» | 1 uso: `.luce-tratto` height |
| `--luce-tratto-larghezza` | `1100px` | misura del componente «Tratti e scene» | 1 uso: `.luce-tratto` width |
| `--mondo-altezza-minima` | `100vh` | misura del componente «Tratti e scene» | 1 uso: `.mondo` min-height |
| `--scena-entra-da-ritaglio` | `inset(0 min(4.5vw, 64px, calc(var(--margine) - 2px)) round calc(var(--raggio-scena) * 1…` | misura del componente «Tratti e scene» | 1 uso: `@keyframes scena-entra from` clip-path |
| `--serve-colonne` | `minmax(0, 1fr) 400px` | misura del componente «Tratti e scene» | 1 uso: `.serve` grid-template-columns |
| `--tratto-scena-notte-spazio-fine` | `max(var(--margine), calc(50% - 720px + var(--margine)))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-inline-end |
| `--tratto-scena-notte-spazio-inizio` | `max(var(--margine), calc(50% - 720px + var(--margine)))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-inline-start |
| `--tratto-scena-notte-spazio-sopra` | `112px` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-top |
| `--tratto-scena-notte-spazio-sopra-telefono` | `76px` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-top ((max-width: 760px)) |
| `--tratto-scena-notte-spazio-sotto` | `calc(128px + var(--sovrap))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-bottom |
| `--tratto-scena-notte-spazio-sotto-telefono` | `calc(84px + var(--sovrap))` | misura del componente «Tratti e scene» | 1 uso: `.tratto.scena-notte, .tratto.scena-…` padding-bottom ((max-width: 760px)) |
| `--tratto-spazio-interno` | `150px var(--margine) 0` | misura del componente «Tratti e scene» | 1 uso: `.tratto` padding |
| `--tratto-spazio-interno-telefono` | `96px var(--margine) 0` | misura del componente «Tratti e scene» | 1 uso: `.tratto` padding ((max-width: 760px)) |
| `--tratto-testo-larghezza-massima` | `460px` | misura del componente «Tratti e scene» | 1 uso: `.tratto-testo p` max-width |
| `--piede-distanza` | `4px 20px` | misura del componente «Il piede» | 1 uso: `.piede ul` gap |
| `--piede-larghezza-massima` | `820px` | misura del componente «Il piede» | 1 uso: `.piede p` max-width |
| `--piede-margine` | `0 0 16px` | misura del componente «Il piede» | 1 uso: `.piede ul` margin |
| `--piede-spazio-interno` | `40px var(--margine) 56px` | misura del componente «Il piede» | 1 uso: `.piede` padding |
| `--entra-da-sposta-y` | `18px` | misura del componente «L'arrivo: ingressi del primo schermo» | 1 uso: `@keyframes entra from` transform |
| `--sale-da-sposta-y` | `20px` | misura del componente «L'arrivo: ingressi del primo schermo» | 1 uso: `@keyframes sale from` transform |
| `--sale12-da-sposta-y` | `12px` | misura del componente «L'arrivo: ingressi del primo schermo» | 1 uso: `@keyframes sale12 from` transform |

## Raggi (22)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--raggio-1` | `2px` | gradino di scala (raggio): lo stesso valore in più componenti | 5 usi in 3 componenti: `.linea` border-radius; `.esito h3::before` border-radius; `.requisiti li::before, .requisiti l…` border-radius; +2 |
| `--raggio-2` | `4px` | gradino di scala (raggio): lo stesso valore in più componenti | 4 usi in 2 componenti: `.f-campo` border-radius; `.f-pulsante` border-radius; `.f-barra` border-radius; +1 |
| `--raggio-3` | `5px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi: `.riunione-filo .barre i` border-radius; `.tavolo .barre i` border-radius |
| `--raggio-4` | `6px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.f-stato` border-radius; `.nodo-altri .mini` border-radius ((max-width: 760px)) |
| `--raggio-5` | `11px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi: `.riunione-filo .riquadro` border-radius ((max-width: 760px)); `.tavolo .riquadro` border-radius ((max-width: 760px)) |
| `--raggio-6` | `12px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.marchio` border-radius; `.riquadro` border-radius ((max-width: 760px)) |
| `--raggio-7` | `16px` | gradino di scala (raggio): lo stesso valore in più componenti | 3 usi in 2 componenti: `.riunione-filo` border-radius ((max-width: 760px)); `.riunione-filo .onde-filo` border-radius ((max-width: 760px)); `.microfono` border-radius ((max-width: 420px)) |
| `--raggio-8` | `17px` | gradino di scala (raggio): lo stesso valore in più componenti | 3 usi in 2 componenti: `.riquadro` border-radius; `.tavolo .riquadro` border-radius; `.bolla-corpo` border-radius ((max-width: 760px)) |
| `--raggio-9` | `18px` | gradino di scala (raggio): lo stesso valore in più componenti | 4 usi in 2 componenti: `.errore-ascolto` border-radius; `.chiamata` border-radius ((max-width: 760px)); `.tavolo-cornice` border-radius ((max-width: 760px)); +1 |
| `--raggio-10` | `20px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi in 2 componenti: `.riunione-app` border-radius; `.js .menu.aperto` border-radius ((max-width: 959px)) |
| `--raggio-11` | `22px` | gradino di scala (raggio): lo stesso valore in più componenti | 5 usi in 4 componenti: `.bolla-corpo` border-radius; `.riunione-filo` border-radius; `.riunione-filo .onde-filo` border-radius; +2 |
| `--raggio-12` | `24px` | gradino di scala (raggio): lo stesso valore in più componenti | 2 usi: `.nodo` border-radius; `.computer` border-radius ((max-width: 760px)) |
| `--raggio-13` | `26px` | gradino di scala (raggio): lo stesso valore in più componenti | 3 usi: `.chiamata` border-radius; `.onde` border-radius; `.tavolo-cornice` border-radius |
| `--raggio-pillola` | `999px` | la pillola: ogni comando tondeggiante | 12 usi in 7 componenti: `.salta` border-radius; `.menu a` border-radius; `.pillola` border-radius; +9 |
| `--menu-aperto-dopo-raggio` | `0 0 12px 12px` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto::after` border-radius (@supports (animation-timeline:) |
| `--barre-raggio` | `7px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` border-radius |
| `--barre-raggio-telefono` | `3px` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` border-radius ((max-width: 760px)) |
| `--riunione-filo-riquadro-raggio` | `15px` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo .riquadro` border-radius |
| `--riunione-app-griglia-riquadro-raggio` | `13px` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.app-griglia .riquadro` border-radius |
| `--computer-raggio` | `30px` | misura del componente «La strada della voce» | 1 uso: `.computer` border-radius |
| `--nodo-altri-mini-raggio` | `9px` | misura del componente «La strada della voce» | 1 uso: `.nodo-altri .mini` border-radius |

## Filetti (4)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--filetto-forte` | `3px` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 2 usi in 2 componenti: `:focus-visible` outline; `.scoppio` border |
| `--filetto-comando` | `1.5px` | misura del componente «Pulsanti e pillole» | 6 usi in 4 componenti: `.chiudi` border; `.rivedi` border; `.frase` border; +3 |
| `--filetto-medio` | `2px` | misura del componente «Il primo schermo: titolo, comandi, palco» | 11 usi in 5 componenti: `.stato` border-inline-start; `.f-campo.fuoco` border-bottom; `.voce.suona .voce-tondo::after` border; +8 |
| `--filetto-sottile` | `1px` | misura del componente «I riquadri della riunione» | 12 usi in 7 componenti: `.chiamata` border; `.riunione-filo` border; `.tavolo-cornice` border; +9 |

## Ombre (24)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--barra-compatto-ombra` | `0 0 0 100vmax var(--barra-piena), 0 1px 0 100vmax var(--bordo-barra)` | misura del componente «Barra e menu» | 1 uso: `.barra.compatta` box-shadow |
| `--barra-ombra` | `0 0 0 100vmax var(--barra-piena), 0 1px 0 100vmax var(--bordo-barra)` | misura del componente «Barra e menu» | 1 uso: `html:not(.js) .barra` box-shadow |
| `--barra-piena-da-ombra` | `0 0 0 100vmax transparent, 0 1px 0 100vmax transparent` | misura del componente «Barra e menu» | 1 uso: `@keyframes barra-piena from` box-shadow (@supports (animation-timeline:) |
| `--pillola-ombra` | `0 14px 30px -14px var(--ombra-azione)` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola.azione` box-shadow |
| `--bolla-corpo-ombra` | `0 24px 50px -22px var(--ombra-bolla)` | misura del componente «La bolla» | 1 uso: `.bolla-corpo` box-shadow |
| `--alone-ombra` | `0 0 30px 6px var(--alone-tu)` | misura del componente «I riquadri della riunione» | 1 uso: `.alone` box-shadow |
| `--banda-riunione-ombra` | `0 1px 0 var(--bordo-barra), 0 16px 22px -12px var(--ombra-banda)` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione.agganciata` box-shadow ((max-width: 760px)) |
| `--bordo-ombra` | `inset 0 0 0 3px var(--voce)` | misura del componente «I riquadri della riunione» | 1 uso: `.bordo` box-shadow |
| `--chiamata-ombra` | `0 40px 80px -40px var(--ombra-cornice)` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` box-shadow |
| `--lume-ombra` | `inset 0 0 0 2.5px var(--voce)` | misura del componente «I riquadri della riunione» | 1 uso: `.lume` box-shadow |
| `--riunione-filo-ombra` | `0 40px 80px -40px var(--ombra-nera)` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo` box-shadow |
| `--tavolo-cornice-ombra` | `0 40px 80px -40px var(--ombra-cornice)` | misura del componente «I riquadri della riunione» | 1 uso: `.tavolo-cornice` box-shadow |
| `--riunione-app-ombra` | `0 34px 60px -30px var(--ombra-riunione-app)` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app` box-shadow |
| `--ascolto-ombra` | `0 30px 60px -30px var(--ombra-cornice)` | misura del componente «La scheda dell'ascolto» | 1 uso: `.ascolto` box-shadow |
| `--pulsa-0-100-ombra` | `0 0 0 0 var(--tratteggio)` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes pulsa 0%, 100%` box-shadow |
| `--pulsa-50-ombra` | `0 0 0 5px var(--voce-trasparente)` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes pulsa 50%` box-shadow |
| `--voce-scelta-ombra` | `0 12px 26px -14px var(--alone-forte)` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce[aria-pressed="true"]` box-shadow |
| `--filo-bolla-bolla-corpo-ombra` | `0 0 0 3px var(--voce), 0 0 34px 4px var(--bordo-evidente), 0 24px 50px -22px var(--ombr…` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio.in-voce .filo-bolla .bol…` box-shadow |
| `--filo-bolla-bolla-corpo-ombra-2` | `0 0 0 3px var(--voce), 0 24px 50px -22px var(--ombra-bolla)` | misura del componente «Le frasi del filo» | 1 uso: `.messaggio.in-pausa .filo-bolla .bo…` box-shadow |
| `--impulso-ombra` | `0 0 0 6px var(--bordo-voce-vecchio), 0 0 26px 8px var(--alone-forte)` | misura del componente «La strada della voce» | 1 uso: `.impulso` box-shadow |
| `--linea-fatta-ombra` | `0 0 14px var(--tratto-lieve)` | misura del componente «La strada della voce» | 1 uso: `.linea-fatta` box-shadow |
| `--tappa-nodo-ombra` | `0 0 34px 4px var(--bordo-tappa-forse)` | misura del componente «La strada della voce» | 1 uso: `.tappa.fatta.acceso .nodo` box-shadow |

## Fondi, gradienti e maschere (20)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--menu-aperto-dopo-fondo` | `linear-gradient(var(--pannello-trasparente), var(--pannello-menu-fondo))` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto::after` background (@supports (animation-timeline:) |
| `--collegamento-freccia-maschera` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'%3…` | misura del componente «Pulsanti e pillole» | 2 usi: `.collegamento .freccia` -webkit-mask; `.collegamento .freccia` mask |
| `--anna-fondo` | `linear-gradient(160deg, var(--anna-fondo-alto), var(--anna-fondo-basso))` | misura del componente «I riquadri della riunione» | 1 uso: `.anna` background |
| `--luca-fondo` | `linear-gradient(160deg, var(--luca-fondo-alto), var(--luca-fondo-basso))` | misura del componente «I riquadri della riunione» | 1 uso: `.luca` background |
| `--paola-fondo` | `linear-gradient(160deg, var(--paola-fondo-alto), var(--paola-fondo-basso))` | misura del componente «I riquadri della riunione» | 1 uso: `.paola` background |
| `--riquadro-fondo` | `linear-gradient(160deg, var(--tu-fondo-alto), var(--tu-fondo-basso))` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.tu` background |
| `--riunione-app-icona-prima-maschera` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3…` | misura del componente «La riunione ricostruita, con il microfono» | 2 usi: `.app-icona::before` -webkit-mask; `.app-icona::before` mask |
| `--voce-tondo-prima-fondo` | `linear-gradient(90deg, var(--bordeaux) 0 4px, transparent 4px 8px, var(--bordeaux) 8px …` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce.suona .voce-tondo::before` background |
| `--ascolto-voce-luce-filo-fondo` | `radial-gradient(closest-side, var(--luce-filo-centro), var(--luce-filo-bordo) 50%, var(…` | misura del componente «Le frasi del filo» | 1 uso: `.ascolto-voce .luce-filo` background |
| `--suona-frase-tondo-prima-fondo` | `linear-gradient(90deg, var(--testo) 0 4px, transparent 4px 8px, var(--testo) 8px 12px)` | misura del componente «Le frasi del filo» | 1 uso: `.suona-frase.suona .tondo::before` background |
| `--esito-forse-prima-fondo` | `repeating-linear-gradient(90deg, var(--alone-forte) 0 7px, transparent 7px 12px)` | misura del componente «La strada della voce» | 1 uso: `.esito-forse h3::before` background |
| `--linea-forse-fondo` | `repeating-linear-gradient(90deg, var(--tratteggio) 0 12px, transparent 12px 24px)` | misura del componente «La strada della voce» | 1 uso: `.linea-forse` background |
| `--linea-forse-fondo-telefono` | `repeating-linear-gradient(180deg, var(--tratteggio) 0 12px, transparent 12px 24px)` | misura del componente «La strada della voce» | 1 uso: `.linea-forse` background ((max-width: 760px)) |
| `--chiusura-luce-chiusa-fondo` | `radial-gradient(closest-side, var(--luce-chiusa-centro), var(--luce-chiusa-bordo) 45%, …` | misura del componente «Tratti e scene» | 1 uso: `.chiusura .luce-chiusa` background |
| `--chiusura-luce-tratto-fondo` | `radial-gradient(closest-side, var(--luce-stanza-centro), var(--luce-stanza-bordo) 52%, …` | misura del componente «Tratti e scene» | 1 uso: `.chiusura .luce-tratto` background |
| `--luce-fondo` | `radial-gradient(closest-side, var(--luce-stanza-centro), var(--luce-stanza-bordo) 52%, …` | misura del componente «Tratti e scene» | 1 uso: `.luce` background |
| `--luce-tratto-fondo` | `radial-gradient(closest-side, var(--luce-tratto-centro), var(--luce-tratto-bordo) 55%, …` | misura del componente «Tratti e scene» | 1 uso: `.luce-tratto` background |
| `--luce-tratto-fondo-2` | `radial-gradient(closest-side, var(--luce-chiara-centro), var(--luce-chiara-bordo) 55%, …` | misura del componente «Tratti e scene» | 1 uso: `.scena-chiara .luce-tratto` background |
| `--luce-voce-fondo` | `radial-gradient(closest-side, var(--luce-voce-centro), var(--luce-voce-bordo) 45%, var(…` | misura del componente «Tratti e scene» | 1 uso: `.luce-voce` background |
| `--scena-chiara-fondo` | `linear-gradient(180deg, var(--testo) 0%, var(--chiara-fondo-basso) 100%)` | misura del componente «Tratti e scene» | 1 uso: `.scena-chiara` background |

## Livelli (24)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--livello-salta` | `50` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 1 uso: `.salta` z-index |
| `--livello-barra` | `30` | misura del componente «Barra e menu» | 1 uso: `.barra` z-index |
| `--livello-menu-aperto` | `20` | misura del componente «Barra e menu» | 1 uso: `.js .menu.aperto` z-index ((max-width: 959px)) |
| `--livello-scena` | `2` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.scena` z-index |
| `--livello-posto-bolla` | `7` | misura del componente «La bolla» | 1 uso: `.posto-bolla` z-index |
| `--livello-alone` | `-1` | misura del componente «I riquadri della riunione» | 1 uso: `.alone` z-index |
| `--livello-banda-riunione` | `5` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione` z-index ((max-width: 760px)) |
| `--livello-barre` | `1` | misura del componente «I riquadri della riunione» | 1 uso: `.barre` z-index |
| `--livello-bordo` | `4` | misura del componente «I riquadri della riunione» | 1 uso: `.bordo` z-index |
| `--livello-lume` | `2` | misura del componente «I riquadri della riunione» | 1 uso: `.lume` z-index |
| `--livello-nome` | `3` | misura del componente «I riquadri della riunione» | 1 uso: `.nome` z-index |
| `--livello-onde` | `3` | misura del componente «I riquadri della riunione» | 1 uso: `.onde` z-index |
| `--livello-riunione-filo-onde-filo` | `3` | misura del componente «I riquadri della riunione» | 1 uso: `.riunione-filo .onde-filo` z-index |
| `--livello-finestra` | `1` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.finestra.avvio` z-index |
| `--livello-sotto` | `5` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` z-index |
| `--livello-riunione-app` | `2` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app` z-index |
| `--livello-ascolto` | `6` | misura del componente «La scheda dell'ascolto» | 1 uso: `.ascolto` z-index |
| `--livello-impulso` | `3` | misura del componente «La strada della voce» | 1 uso: `.impulso` z-index |
| `--livello-linea` | `1` | misura del componente «La strada della voce» | 1 uso: `.linea` z-index |
| `--livello-tappe` | `2` | misura del componente «La strada della voce» | 1 uso: `.tappe` z-index |
| `--livello-luce` | `0` | misura del componente «Tratti e scene» | 1 uso: `.luce, .luce-voce` z-index |
| `--livello-luce-tratto` | `-1` | misura del componente «Tratti e scene» | 1 uso: `.luce-tratto` z-index |
| `--livello-tratto` | `1` | misura del componente «Tratti e scene» | 1 uso: `.tratto` z-index |
| `--livello-piede` | `1` | misura del componente «Il piede» | 2 usi: `.piede` z-index; `.piede.scena-notte` z-index |

## Movimento · curve (6)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--entra` | `cubic-bezier(0.19, 1, 0.22, 1)` |  | 0 usi:  |
| `--curva-dolce` | `ease` | misura del componente «Barra e menu» | 33 usi in 11 componenti: `.barra` transition; `.barra .barra-azione` transition; `.barra.con-azione .barra-azione` transition ((max-width: 440px)); +30 |
| `--curva-lineare` | `linear` | misura del componente «Barra e menu» | 13 usi in 5 componenti: `.barra .barra-azione` transition; `.bolla .p` transition; `.voce.carica .voce-tondo::after` animation; +10 |
| `--curva-dolce-doppia` | `ease-in-out` | misura del componente «I riquadri della riunione» | 2 usi in 2 componenti: `.annuisce .cenno` animation; `.frase.suona::before` animation |
| `--curva-a-scatti` | `steps(1)` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-campo.fuoco .f-cursore` animation |
| `--curva-uscita` | `ease-out` | misura del componente «La riunione ricostruita, con il microfono» | 3 usi in 3 componenti: `.riunione-app.vivo .tu .bordo` animation; `.voce.suona .voce-tondo::after` animation; `.suona-frase.suona .tondo::after` animation |

## Movimento · durate (78)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--durata-movimento-ridotto` | `1ms` | misura del componente «Base: caratteri, ripristino, fuoco, utilità» | 2 usi: `*, *::before, *::after` animation-duration ((prefers-reduced-motion: reduc); `*, *::before, *::after` transition-duration ((prefers-reduced-motion: reduc) |
| `--durata-barra` | `320ms` | misura del componente «Barra e menu» | 1 uso: `.barra` transition |
| `--durata-barra-azione-opacita` | `120ms` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transition |
| `--durata-barra-azione-opacita-2` | `240ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition |
| `--durata-barra-azione-opacita-stretto` | `220ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition ((max-width: 440px)) |
| `--durata-barra-azione-trasforma` | `200ms` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transition |
| `--durata-barra-azione-trasforma-2` | `320ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition |
| `--durata-barra-azione-trasforma-stretto` | `300ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition ((max-width: 440px)) |
| `--durata-barra-marchio` | `140ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .marchio span` transition ((max-width: 440px)) |
| `--durata-marchio` | `160ms` | misura del componente «Barra e menu» | 1 uso: `.marchio span` transition |
| `--durata-menu` | `300ms` | misura del componente «Barra e menu» | 1 uso: `.menu` transition |
| `--durata-menu-2` | `200ms` | misura del componente «Barra e menu» | 1 uso: `.menu a` transition |
| `--durata-voce-bordo` | `240ms` | misura del componente «Barra e menu» | 1 uso: `.voce, .frase, .chiudi, .rivedi, .r…` transition |
| `--durata-voce-sfondo` | `240ms` | misura del componente «Barra e menu» | 1 uso: `.voce, .frase, .chiudi, .rivedi, .r…` transition |
| `--durata-voce-trasforma` | `220ms` | misura del componente «Barra e menu» | 1 uso: `.voce, .frase, .chiudi, .rivedi, .r…` transition |
| `--durata-collegamento-freccia` | `240ms` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento .freccia` transition |
| `--durata-collegamento-sottolineatura` | `200ms` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento` transition |
| `--durata-collegamento-trasforma` | `220ms` | misura del componente «Pulsanti e pillole» | 1 uso: `.collegamento` transition |
| `--durata-pillola` | `220ms` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola` transition |
| `--durata-comandi` | `420ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi > *` animation |
| `--durata-didascalia` | `500ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` animation |
| `--durata-presentazione` | `420ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.presentazione` animation |
| `--durata-riga` | `380ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga` animation |
| `--durata-stato` | `420ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` animation |
| `--durata-bolla` | `420ms` | misura del componente «La bolla» | 1 uso: `.bolla` transition |
| `--durata-bolla-2` | `160ms` | misura del componente «La bolla» | 1 uso: `.bolla .p` transition |
| `--durata-posto-bolla` | `480ms` | misura del componente «La bolla» | 1 uso: `.posto-bolla` animation |
| `--durata-anna-occhi` | `200ms` | misura del componente «I riquadri della riunione» | 1 uso: `.anna .occhi ellipse` animation |
| `--durata-annuisce-cenno` | `820ms` | misura del componente «I riquadri della riunione» | 1 uso: `.annuisce .cenno` animation |
| `--durata-banda-riunione` | `200ms` | misura del componente «I riquadri della riunione» | 1 uso: `.banda-riunione` transition ((max-width: 760px)) |
| `--durata-barre` | `240ms` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i` transition |
| `--durata-bordo` | `240ms` | misura del componente «I riquadri della riunione» | 1 uso: `.bordo` transition |
| `--durata-chiamata` | `500ms` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` animation |
| `--durata-figura-occhi` | `460ms` | misura del componente «I riquadri della riunione» | 1 uso: `.figura .occhi` transition |
| `--durata-figura-testa` | `560ms` | misura del componente «I riquadri della riunione» | 1 uso: `.figura .testa` transition |
| `--durata-luca-occhi` | `200ms` | misura del componente «I riquadri della riunione» | 1 uso: `.luca .occhi ellipse` animation |
| `--durata-paola-occhi` | `200ms` | misura del componente «I riquadri della riunione» | 1 uso: `.paola .occhi ellipse` animation |
| `--durata-riquadro` | `520ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro` animation |
| `--durata-tavolo-riquadro` | `520ms` | misura del componente «I riquadri della riunione» | 1 uso: `.js .tavolo.visto .riquadro, .js .r…` animation |
| `--durata-f-campo-f-cursore` | `1s` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.f-campo.fuoco .f-cursore` animation |
| `--durata-sotto` | `360ms` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` animation |
| `--durata-riunione-app-bordo` | `900ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.riunione-app.vivo .tu .bordo` animation |
| `--durata-scelta-sfondo` | `280ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` transition |
| `--durata-scelta-testo` | `280ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` transition |
| `--durata-scelta-trasforma` | `160ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta` transition |
| `--durata-fila-ascolto-pillola` | `360ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.fila-ascolto > .pillola` animation |
| `--durata-frase-prima` | `200ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.frase::before` transition |
| `--durata-frase-prima-2` | `900ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.frase.suona::before` animation |
| `--durata-frase-prima-3` | `1.1s` | misura del componente «La scheda dell'ascolto» | 1 uso: `.frase.carica::before` animation |
| `--durata-voce` | `240ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce` transition |
| `--durata-voce-tondo-dopo` | `1.2s` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce.suona .voce-tondo::after` animation |
| `--durata-voce-tondo-dopo-2` | `1.1s` | misura del componente «La scheda dell'ascolto» | 1 uso: `.voce.carica .voce-tondo::after` animation |
| `--durata-errore-ascolto` | `420ms` | misura del componente «I messaggi d'errore» | 1 uso: `.errore-ascolto` animation |
| `--durata-filo-bolla-bolla-corpo` | `300ms` | misura del componente «Le frasi del filo» | 1 uso: `.filo-bolla .bolla-corpo` transition |
| `--durata-messaggio-filo-bolla-opacita` | `200ms` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra.visto .filo-bolla` transition |
| `--durata-messaggio-filo-bolla-trasforma` | `520ms` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra.visto .filo-bolla` transition |
| `--durata-messaggio-sotto` | `400ms` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra.visto .messagg…` transition |
| `--durata-suona-frase-tondo-dopo` | `1.1s` | misura del componente «Le frasi del filo» | 1 uso: `.suona-frase.carica .tondo::after` animation |
| `--durata-suona-frase-tondo-dopo-2` | `1.2s` | misura del componente «Le frasi del filo» | 1 uso: `.suona-frase.suona .tondo::after` animation |
| `--durata-esito-opacita` | `480ms` | misura del componente «La strada della voce» | 1 uso: `.esito` transition |
| `--durata-esito-trasforma` | `620ms` | misura del componente «La strada della voce» | 1 uso: `.esito` transition |
| `--durata-nodo-altri-mini` | `500ms` | misura del componente «La strada della voce» | 1 uso: `.nodo-altri .mini` transition |
| `--durata-nodo-bordo` | `360ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-nodo-ombra` | `500ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-nodo-sfondo` | `360ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-nodo-testo` | `360ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-nodo-trasforma` | `420ms` | misura del componente «La strada della voce» | 1 uso: `.nodo` transition |
| `--durata-riservato-opacita` | `480ms` | misura del componente «La strada della voce» | 1 uso: `.riservato` transition |
| `--durata-riservato-trasforma` | `620ms` | misura del componente «La strada della voce» | 1 uso: `.riservato` transition |
| `--durata-entra-finestra-opacita` | `300ms` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-finestra.visto` transition |
| `--durata-entra-finestra-trasforma` | `460ms` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-finestra.visto` transition |
| `--durata-entra-titolo` | `380ms` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-titolo.visto` transition |
| `--durata-luce` | `1400ms` | misura del componente «Tratti e scene» | 1 uso: `.luce` animation |
| `--durata-requisiti` | `360ms` | misura del componente «Tratti e scene» | 1 uso: `.requisiti li` transition |
| `--durata-requisiti-dopo-base` | `900ms` | misura del componente «Tratti e scene» | 1 uso: `.js .requisiti.in-scena li.attivo::…` transition |

## Movimento · ritardi (36)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--ritardo-barra-azione-opacita` | `90ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition |
| `--ritardo-barra-azione-opacita-stretto` | `150ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition ((max-width: 440px)) |
| `--ritardo-barra-azione-trasforma` | `90ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition |
| `--ritardo-barra-azione-trasforma-stretto` | `150ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .barra-azione` transition ((max-width: 440px)) |
| `--ritardo-barra-azione-visibilita` | `200ms` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transition |
| `--ritardo-barra-marchio` | `140ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .marchio` transition ((max-width: 440px)) |
| `--ritardo-barra-marchio-larghezza` | `140ms` | misura del componente «Barra e menu» | 1 uso: `.barra.con-azione .marchio span` transition ((max-width: 440px)) |
| `--ritardo-marchio-opacita` | `120ms` | misura del componente «Barra e menu» | 1 uso: `.marchio span` transition |
| `--ritardo-menu` | `130ms` | misura del componente «Barra e menu» | 1 uso: `.menu` transition |
| `--ritardo-comandi-1` | `640ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi > :nth-child(1)` animation-delay |
| `--ritardo-comandi-2` | `720ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.comandi > :nth-child(2)` animation-delay |
| `--ritardo-didascalia` | `900ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.didascalia` animation |
| `--ritardo-presentazione` | `520ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.presentazione` animation |
| `--ritardo-riga-1` | `100ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga:nth-child(1)` animation-delay |
| `--ritardo-riga-2` | `180ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga:nth-child(2)` animation-delay |
| `--ritardo-riga-3` | `260ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga:nth-child(3)` animation-delay |
| `--ritardo-riga-4` | `340ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `h1 .riga:nth-child(4)` animation-delay |
| `--ritardo-stato` | `800ms` | misura del componente «Il primo schermo: titolo, comandi, palco» | 1 uso: `.stato` animation |
| `--ritardo-posto-bolla` | `1500ms` | misura del componente «La bolla» | 1 uso: `.posto-bolla` animation |
| `--ritardo-anna-occhi` | `3.3s` | misura del componente «I riquadri della riunione» | 1 uso: `.anna .occhi ellipse` animation |
| `--ritardo-chiamata` | `700ms` | misura del componente «I riquadri della riunione» | 1 uso: `.chiamata` animation |
| `--ritardo-luca-occhi` | `4.1s` | misura del componente «I riquadri della riunione» | 1 uso: `.luca .occhi ellipse` animation |
| `--ritardo-paola-occhi` | `2.7s` | misura del componente «I riquadri della riunione» | 1 uso: `.paola .occhi ellipse` animation |
| `--ritardo-riquadro` | `1280ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.tu` animation-delay |
| `--ritardo-riquadro-anna` | `1120ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.anna` animation-delay |
| `--ritardo-riquadro-luca` | `1000ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.luca` animation-delay |
| `--ritardo-riquadro-paola` | `880ms` | misura del componente «I riquadri della riunione» | 1 uso: `.riquadro.paola` animation-delay |
| `--ritardo-tavolo-riquadro` | `400ms` | misura del componente «I riquadri della riunione» | 1 uso: `.js .tavolo.visto .riquadro.tu, .js…` animation-delay |
| `--ritardo-tavolo-riquadro-3` | `120ms` | misura del componente «I riquadri della riunione» | 1 uso: `.js .tavolo.visto .riquadro:nth-chi…` animation-delay |
| `--ritardo-tavolo-riquadro-4` | `240ms` | misura del componente «I riquadri della riunione» | 1 uso: `.js .tavolo.visto .riquadro:nth-chi…` animation-delay |
| `--ritardo-sotto` | `1700ms` | misura del componente «La finestra di Kalliope ricostruita» | 1 uso: `.sotto` animation |
| `--riunione-app-entra-finestra-ritardo` | `260ms` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.js .riunione-app.entra-finestra` ritardo |
| `--ritardo-fila-ascolto-pillola` | `1950ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.fila-ascolto > .pillola` animation |
| `--ritardo-sotto-aperto` | `460ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.palco:has(.fila-ascolto.aperta:not…` transition ((min-width: 761px) and (max-he) |
| `--ritardo-sotto-compatto-aperto` | `460ms` | misura del componente «La scheda dell'ascolto» | 1 uso: `.palco.compatta:has(.fila-ascolto.a…` transition |
| `--ritardo-messaggio-sotto-in-piu` | `260ms` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra.visto .messagg…` transition |

## Opacità e filtri (11)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--opacita-spento` | `0.5` | un comando non disponibile | 3 usi in 3 componenti: `.voce:disabled, .frase:disabled, .c…` opacity; `.voce.pausa .voce-tondo::after` opacity; `.nodo-altri .mini` opacity |
| `--opacita-bolla` | `0.72` | misura del componente «La bolla» | 1 uso: `.bolla.detta` opacity |
| `--opacita-bolla-2` | `0.38` | misura del componente «La bolla» | 1 uso: `.bolla .p.attesa` opacity |
| `--opacita-figura-bocca` | `0.8` | misura del componente «I riquadri della riunione» | 1 uso: `.figura .bocca` opacity |
| `--opacita-lampo-100` | `0.55` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `@keyframes lampo 100%` opacity |
| `--opacita-suona-frase-tondo-dopo` | `0.45` | misura del componente «Le frasi del filo» | 1 uso: `.suona-frase.pausa .tondo::after` opacity |
| `--nodo-altri-mini-filtro` | `saturate(0.6)` | misura del componente «La strada della voce» | 1 uso: `.nodo-altri .mini` filter |
| `--opacita-tappa-altri-mini` | `0.68` | misura del componente «La strada della voce» | 1 uso: `.tappa-altri.raggiunta .mini` opacity |
| `--tappa-altri-mini-filtro` | `saturate(0.8)` | misura del componente «La strada della voce» | 1 uso: `.tappa-altri.raggiunta .mini` filter |
| `--opacita-requisiti` | `0.45` | misura del componente «Tratti e scene» | 1 uso: `.js .requisiti.in-scena li:not(.att…` opacity |

## Pose · scale (18)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--barra-azione-scala` | `0.94` | misura del componente «Barra e menu» | 1 uso: `.barra .barra-azione` transform |
| `--collegamento-premuto-scala` | `0.97` | misura del componente «Barra e menu» | 1 uso: `.collegamento:active, .marchio:acti…` transform |
| `--voce-premuto-scala` | `0.97` | misura del componente «Barra e menu» | 1 uso: `.voce:active, .frase:active, .chiud…` transform |
| `--pillola-premuto-scala` | `0.97` | misura del componente «Pulsanti e pillole» | 1 uso: `.pillola:active` transform |
| `--barre-1-scala-y` | `0.34` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i:nth-child(1)` transform |
| `--barre-2-scala-y` | `0.7` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i:nth-child(2)` transform |
| `--barre-4-scala-y` | `0.63` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i:nth-child(4)` transform |
| `--barre-5-scala-y` | `0.41` | misura del componente «I riquadri della riunione» | 1 uso: `.barre i:nth-child(5)` transform |
| `--batte-50-scala-y` | `0.12` | misura del componente «I riquadri della riunione» | 1 uso: `@keyframes batte 50%` transform |
| `--scelta-scala` | `0.94` | misura del componente «La riunione ricostruita, con il microfono» | 1 uso: `.scelta.premuta` transform |
| `--anello-a-scala` | `1.25` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes anello to` transform |
| `--anello-da-scala` | `0.9` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes anello from` transform |
| `--pulsa-50-scala` | `1.25` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes pulsa 50%` transform |
| `--messaggio-filo-bolla-scala` | `0.6` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra .filo-bolla` transform |
| `--tappa-nodo-scala` | `1.04` | misura del componente «La strada della voce» | 1 uso: `.tappa.fatta.acceso .nodo` transform |
| `--entra-finestra-scala` | `0.96` | misura del componente «Tratti e scene» | 1 uso: `.js .entra-finestra` transform |
| `--entra-da-scala` | `0.97` | misura del componente «L'arrivo: ingressi del primo schermo» | 1 uso: `@keyframes entra from` transform |

## Pose · angoli (4)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--anna-testa-rotazione` | `-7deg` | misura del componente «I riquadri della riunione» | 1 uso: `.anna.guarda .testa` transform |
| `--luca-testa-rotazione` | `-4deg` | misura del componente «I riquadri della riunione» | 1 uso: `.luca.guarda .testa` transform |
| `--paola-testa-rotazione` | `-8deg` | misura del componente «I riquadri della riunione» | 1 uso: `.paola.guarda .testa` transform |
| `--gira-a-rotazione` | `360deg` | misura del componente «La scheda dell'ascolto» | 1 uso: `@keyframes gira to` transform |

## Pose · origini (3)

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--bolla-chiusa-origine` | `40px 100%` | misura del componente «La bolla» | 1 uso: `.bolla-chiusa` transform-origin |
| `--bolla-filo-bolla-origine` | `30px 100%` | misura del componente «La bolla» | 1 uso: `.bolla.filo-bolla` transform-origin |
| `--messaggio-filo-bolla-origine` | `30px 100%` | misura del componente «Le frasi del filo» | 1 uso: `.js .messaggio.entra .filo-bolla` transform-origin |

## Soglie delle larghezze (@media e @container)

Non si possono scrivere in una variabile (le domande sui media non leggono `var()`): sono **23 soglie**, elencate qui e in `metodo.config.mjs` (voce `sorgenti.soglie`).

`349px` · `350px` · `360px` · `374px` · `420px` · `440px` · `699px` · `759px` · `760px` · `761px` · `790px` · `791px` · `799px` · `802px` · `819px` · `840px` · `959px` · `999px` · `1000px` · `1010px` · `1180px` · `1181px` · `1209px`

## Da decidere

Tutto ciò che segue sono **valori distinti nella pagina che potrebbero essere lo stesso ruolo**. Non li ho uniti: unirli cambierebbe l'aspetto (anche di poco). Decide chi sceglie l'aspetto; se si unisce, si cambia il valore in `token.css` e si rifà il confronto a vista e pixel per pixel con la pagina di prima.

### Colori con lo stesso colore di base e opacità quasi uguali (33 coppie)

| Un token | L'altro | Differenza | Ruoli |
|---|---|---|---|
| `--bordo-barra` 0.1 | `--bordo-sezione` 0.12 | rgb(255,219,225) · differenza di opacità 0.02 | il filo sotto la barra compatta e sotto la fascia  / il filo che divide: tra «Non esiste» e la strada,  |
| `--bordo-sezione` 0.12 | `--bordo-cornice` 0.14 | rgb(255,219,225) · differenza di opacità 0.02 | il filo che divide: tra «Non esiste» e la strada,  / il bordo di una cornice della riunione e il filo s |
| `--bordo-cornice` 0.14 | `--bordo-pannello` 0.2 | rgb(255,219,225) · differenza di opacità 0.06 | il bordo di una cornice della riunione e il filo s / il bordo di un pannello: scheda, menu aperto, comp |
| `--bordo-pannello` 0.2 | `--bordo-frase` 0.22 | rgb(255,219,225) · differenza di opacità 0.02 | il bordo di un pannello: scheda, menu aperto, comp / il bordo di una frase |
| `--bordo-voce-vecchio` 0.28 | `--bordo-comando` 0.3 | rgb(255,219,225) · differenza di opacità 0.02 | il bordo di una voce (primo disegno; la pagina ora / il bordo di un comando: «Menu», nodo della strada |
| `--bordo-comando` 0.3 | `--bordo-voce` 0.34 | rgb(255,219,225) · differenza di opacità 0.04 | il bordo di un comando: «Menu», nodo della strada / il bordo di una voce a riposo |
| `--bordo-voce` 0.34 | `--bordo-comando-quieto` 0.35 | rgb(255,219,225) · differenza di opacità 0.01 | il bordo di una voce a riposo / il bordo di un comando secondario: «Chiudi», «Rive |
| `--bordo-comando-quieto` 0.35 | `--bordo-evidente` 0.4 | rgb(255,219,225) · differenza di opacità 0.05 | il bordo di un comando secondario: «Chiudi», «Rive / il bordo che si nota: la riga dello stato, il mess |
| `--bordo-evidente` 0.4 | `--bordo-tappa-forse` 0.42 | rgb(255,219,225) · differenza di opacità 0.02 | il bordo che si nota: la riga dello stato, il mess / la tappa «forse»: bordo tratteggiato, e l'alone de |
| `--bordo-tappa-forse` 0.42 | `--frase-punto` 0.45 | rgb(255,219,225) · differenza di opacità 0.03 | la tappa «forse»: bordo tratteggiato, e l'alone de / il punto di una frase non ancora suonata |
| `--frase-punto` 0.45 | `--tratto-lieve` 0.5 | rgb(255,219,225) · differenza di opacità 0.05 | il punto di una frase non ancora suonata / sottolineatura di «altra voce» e alone della linea |
| `--tratto-lieve` 0.5 | `--sottolineatura` 0.55 | rgb(255,219,225) · differenza di opacità 0.05 | sottolineatura di «altra voce» e alone della linea / la sottolineatura dei collegamenti |
| `--sottolineatura` 0.55 | `--tratteggio` 0.6 | rgb(255,219,225) · differenza di opacità 0.05 | la sottolineatura dei collegamenti / il tratteggio di «non ancora» (linea e pulsazione) |
| `--alone-forte` 0.7 | `--bordo-tappa-raggiunta` 0.75 | rgb(255,219,225) · differenza di opacità 0.05 | un alone netto: impulso, voce scelta, tratteggio d / la tappa «forse» quando la voce ci arriva |
| `--bordo-tappa-raggiunta` 0.75 | `--alone-tu` 0.8 | rgb(255,219,225) · differenza di opacità 0.05 | la tappa «forse» quando la voce ci arriva / l'alone di chi parla |
| `--velo-computer` 0.035 | `--velo-sopra` 0.06 | rgb(255,237,239) · differenza di opacità 0.02 | il computer della strada / una voce al passaggio |
| `--velo-sopra` 0.06 | `--velo-comando` 0.08 | rgb(255,237,239) · differenza di opacità 0.02 | una voce al passaggio / il fondo di un comando: voce, «Menu», microfono |
| `--velo-comando` 0.08 | `--velo-menu-sopra` 0.1 | rgb(255,237,239) · differenza di opacità 0.02 | il fondo di un comando: voce, «Menu», microfono / una voce del menu al passaggio |
| `--velo-menu-sopra` 0.1 | `--velo-scelto` 0.14 | rgb(255,237,239) · differenza di opacità 0.04 | una voce del menu al passaggio / una frase attiva, «Menu» al passaggio |
| `--velo-scelto` 0.14 | `--velo-menu-premuto` 0.18 | rgb(255,237,239) · differenza di opacità 0.04 | una frase attiva, «Menu» al passaggio / una voce del menu premuta |
| `--velo-menu-premuto` 0.18 | `--velo-puntata` 0.2 | rgb(255,237,239) · differenza di opacità 0.02 | una voce del menu premuta / la scelta del microfono puntata |
| `--testo-avvertenza-chiusura` 0.66 | `--testo-durata` 0.7 | rgb(255,237,239) · differenza di opacità 0.04 | l'avvertenza della chiusura / la durata di una frase |
| `--testo-durata` 0.7 | `--testo-avvertenza` 0.72 | rgb(255,237,239) · differenza di opacità 0.02 | la durata di una frase / l'avvertenza |
| `--testo-didascalia` 0.78 | `--testo-secondario` 0.8 | rgb(255,237,239) · differenza di opacità 0.02 | la didascalia e il titolo del microfono / testo di sostegno: piede, nome del computer, tappa |
| `--testo-secondario` 0.8 | `--testo-nota` 0.82 | rgb(255,237,239) · differenza di opacità 0.02 | testo di sostegno: piede, nome del computer, tappa / una nota sotto una frase e il testo di «Non esiste |
| `--testo-nota` 0.82 | `--testo-dettaglio` 0.86 | rgb(255,237,239) · differenza di opacità 0.04 | una nota sotto una frase e il testo di «Non esiste / il dettaglio che chiude (i fatti) |
| `--testo-dettaglio` 0.86 | `--testo-spiegazione` 0.88 | rgb(255,237,239) · differenza di opacità 0.02 | il dettaglio che chiude (i fatti) / la spiegazione sotto un titolo: stato, testo del t |
| `--testo-spiegazione` 0.88 | `--testo-forte` 0.9 | rgb(255,237,239) · differenza di opacità 0.02 | la spiegazione sotto un titolo: stato, testo del t / la riga sulla riservatezza |
| `--luce-chiusa-centro` 0.5 | `--luce-voce-centro` 0.55 | rgb(255,92,141) · differenza di opacità 0.05 | la luce della chiusura: centro / la luce che segue la voce: centro |
| `--ombra-finestra` 0.85 | `--ombra-cornice` 0.9 | rgb(10,0,4) · differenza di opacità 0.05 | ombra della finestra di Kalliope / ombra di una cornice o di un pannello |
| `--pannello-menu` 0.94 | `--pannello-menu-fondo` 0.98 | rgb(28,3,11) · differenza di opacità 0.04 | il menu aperto / il velo sul fondo del menu che scorre |
| `--luce-filo-bordo` 0.16 | `--luce-chiusa-bordo` 0.2 | rgb(197,15,86) · differenza di opacità 0.04 | la luce del filo: a metà / la luce della chiusura: a metà |
| `--luce-chiusa-bordo` 0.2 | `--luce-voce-bordo` 0.22 | rgb(197,15,86) · differenza di opacità 0.02 | la luce della chiusura: a metà / la luce che segue la voce: a metà |

### Gradini di «corpo» che differiscono di 1 px o meno (8 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--corpo-1` 10px | `--corpo-2` 11px | 1 px | 3 e 2 usi |
| `--corpo-2` 11px | `--corpo-3` 12px | 1 px | 2 e 4 usi |
| `--corpo-3` 12px | `--corpo-4` 13px | 1 px | 4 e 12 usi |
| `--corpo-4` 13px | `--corpo-5` 14px | 1 px | 12 e 10 usi |
| `--corpo-5` 14px | `--corpo-6` 15px | 1 px | 10 e 17 usi |
| `--corpo-6` 15px | `--corpo-7` 16px | 1 px | 17 e 10 usi |
| `--corpo-7` 16px | `--corpo-8` 17px | 1 px | 10 e 7 usi |
| `--corpo-8` 17px | `--corpo-9` 18px | 1 px | 7 e 8 usi |

### Gradini di «interlinea» che differiscono di 1 px o meno (7 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--interlinea-3` 18px | `--interlinea-4` 19px | 1 px | 4 e 2 usi |
| `--interlinea-5` 21px | `--interlinea-6` 22px | 1 px | 2 e 5 usi |
| `--interlinea-8` 26px | `--interlinea-9` 27px | 1 px | 2 e 5 usi |
| `--interlinea-9` 27px | `--interlinea-10` 28px | 1 px | 5 e 4 usi |
| `--interlinea-10` 28px | `--interlinea-11` 29px | 1 px | 4 e 2 usi |
| `--interlinea-11` 29px | `--interlinea-12` 30px | 1 px | 2 e 3 usi |
| `--interlinea-12` 30px | `--interlinea-13` 31px | 1 px | 3 e 3 usi |

### Gradini di «raggio» che differiscono di 1 px o meno (5 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--raggio-2` 4px | `--raggio-3` 5px | 1 px | 4 e 2 usi |
| `--raggio-3` 5px | `--raggio-4` 6px | 1 px | 2 e 2 usi |
| `--raggio-5` 11px | `--raggio-6` 12px | 1 px | 2 e 2 usi |
| `--raggio-7` 16px | `--raggio-8` 17px | 1 px | 3 e 3 usi |
| `--raggio-8` 17px | `--raggio-9` 18px | 1 px | 3 e 4 usi |

### Gradini di «spazio» che differiscono di 1 px o meno (13 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--spazio-meno-2` -5px | `--spazio-meno-3` -4px | 1 px | 4 e 2 usi |
| `--spazio-1` 2px | `--spazio-2` 3px | 1 px | 6 e 6 usi |
| `--spazio-2` 3px | `--spazio-3` 4px | 1 px | 6 e 13 usi |
| `--spazio-3` 4px | `--spazio-4` 5px | 1 px | 13 e 12 usi |
| `--spazio-4` 5px | `--spazio-5` 6px | 1 px | 12 e 19 usi |
| `--spazio-5` 6px | `--spazio-6` 7px | 1 px | 19 e 5 usi |
| `--spazio-6` 7px | `--spazio-7` 8px | 1 px | 5 e 21 usi |
| `--spazio-8` 10px | `--spazio-9` 11px | 1 px | 15 e 3 usi |
| `--spazio-9` 11px | `--spazio-10` 12px | 1 px | 3 e 16 usi |
| `--spazio-10` 12px | `--spazio-11` 13px | 1 px | 16 e 2 usi |
| `--spazio-11` 13px | `--spazio-12` 14px | 1 px | 2 e 12 usi |
| `--spazio-12` 14px | `--spazio-13` 15px | 1 px | 12 e 2 usi |
| `--spazio-13` 15px | `--spazio-14` 16px | 1 px | 2 e 10 usi |

### Gradini di «misura» che differiscono di 1 px o meno (1 coppie)

| Un gradino | L'altro | Differenza | Usi |
|---|---|---|---|
| `--misura-3` 7px | `--misura-4` 8px | 1 px | 5 e 3 usi |

### Gradini di «spazi» che differiscono di 1 px o meno (0 coppie)

_nessuna_

### Gradini di «misure» che differiscono di 1 px o meno (0 coppie)

_nessuna_

### Durate che differiscono di 40 ms o meno (17 coppie)

| Una durata | L'altra | Differenza | Esempi |
|---|---|---|---|
| 120 ms (1 token) | 140 ms (2 token) | 20 ms | `--durata-barra-azione-opacita` / `--durata-f-primario` `--durata-barra-marchio` |
| 140 ms (2 token) | 160 ms (4 token) | 20 ms | `--durata-f-primario` `--durata-barra-marchio` / `--durata-marchio` `--durata-bolla-2` |
| 160 ms (4 token) | 200 ms (9 token) | 40 ms | `--durata-marchio` `--durata-bolla-2` / `--durata-barra-azione-trasforma` `--durata-menu-2` |
| 200 ms (9 token) | 220 ms (4 token) | 20 ms | `--durata-barra-azione-trasforma` `--durata-menu-2` / `--durata-voce-trasforma` `--durata-pillola` |
| 220 ms (4 token) | 240 ms (8 token) | 20 ms | `--durata-voce-trasforma` `--durata-pillola` / `--durata-barra-azione-opacita-2` `--durata-voce-bordo` |
| 240 ms (8 token) | 280 ms (2 token) | 40 ms | `--durata-barra-azione-opacita-2` `--durata-voce-bordo` / `--durata-scelta-sfondo` `--durata-scelta-testo` |
| 280 ms (2 token) | 300 ms (4 token) | 20 ms | `--durata-scelta-sfondo` `--durata-scelta-testo` / `--durata-menu` `--durata-filo-bolla-bolla-corpo` |
| 300 ms (4 token) | 320 ms (2 token) | 20 ms | `--durata-menu` `--durata-filo-bolla-bolla-corpo` / `--durata-barra` `--durata-barra-azione-trasforma-2` |
| 320 ms (2 token) | 360 ms (6 token) | 40 ms | `--durata-barra` `--durata-barra-azione-trasforma-2` / `--durata-sotto` `--durata-fila-ascolto-pillola` |
| 360 ms (6 token) | 380 ms (2 token) | 20 ms | `--durata-sotto` `--durata-fila-ascolto-pillola` / `--durata-riga` `--durata-entra-titolo` |
| 380 ms (2 token) | 400 ms (1 token) | 20 ms | `--durata-riga` `--durata-entra-titolo` / `--durata-messaggio-sotto` |
| 400 ms (1 token) | 420 ms (6 token) | 20 ms | `--durata-messaggio-sotto` / `--durata-presentazione` `--durata-comandi` |
| 420 ms (6 token) | 460 ms (2 token) | 40 ms | `--durata-presentazione` `--durata-comandi` / `--durata-figura-occhi` `--durata-entra-finestra-trasforma` |
| 460 ms (2 token) | 480 ms (3 token) | 20 ms | `--durata-figura-occhi` `--durata-entra-finestra-trasforma` / `--durata-posto-bolla` `--durata-esito-opacita` |
| 480 ms (3 token) | 500 ms (4 token) | 20 ms | `--durata-posto-bolla` `--durata-esito-opacita` / `--durata-didascalia` `--durata-chiamata` |
| 500 ms (4 token) | 520 ms (3 token) | 20 ms | `--durata-didascalia` `--durata-chiamata` / `--durata-riquadro` `--durata-tavolo-riquadro` |
| 520 ms (3 token) | 560 ms (1 token) | 40 ms | `--durata-riquadro` `--durata-tavolo-riquadro` / `--durata-figura-testa` |

### Altro da decidere
- **Gradini a numero**: le scale (`--corpo-N`, `--spazio-N`…) hanno nomi ordinali perché lo stesso valore serve ruoli diversi; dare a ogni gradino un nome di ruolo è una scelta di progetto.
- **Testo in px**: tutte le grandezze del testo sono in px come nella pagina (non crescono con la grandezza del testo del sistema). Passarle a rem cambia la pagina per chi ha cambiato la grandezza di base.
- **`.f-stato.allarme`** (`--ricostruita-stato-allarme`): la riga di stato in allarme della finestra è definita ma nessun elemento e nessuno script la usa; si tiene perché è uno stato della finestra ricostruita.
- **Colori nell'HTML**: `theme-color` (`#420017`) sta nell'HTML, non nel CSS; non è tokenizzato. Il marchio non è più qui: il verde di prima (`#2fb39a`, `#16806f`) è stato tolto, e i colori del marchio nuovo sono i token `--segno-*` (sezione «Il marchio» in fondo).
- **Valori in `scena.js`**: curve, durate, colori delle onde e ritardi dell'arrivo scritti nello script (`ENTRA`, `rgba(255,219,225,…)` nel disegno delle onde, durate di 360/520/820/1100 ms…) non passano ancora dai token.

## Dichiarazioni scritte e mai in uso (36): non portate

Stesso selettore, stesse condizioni, stessa proprietà: la pagina le sovrascrive più giù nello stesso foglio. Non cambia nulla toglierle; i loro valori restano qui.

| Componente | Selettore | Proprietà | Valore scritto | Sovrascritta da |
|---|---|---|---|---|
| pulsanti | `.collegamento` | transition | `text-decoration-color 200ms` | `text-decoration-color 200ms, transform 220ms var(--entra)` |
| apertura | `.scena` | z-index | `1` | `2` |
| apertura | `.palco` @ (max-width: 760px) | margin-top | `14px` | `0` |
| apertura | `.didascalia` @ (max-width: 760px) | order | `-1` | `3` |
| apertura | `.didascalia` @ (max-width: 760px) | font-size | `12px` | `12px` |
| apertura | `.didascalia` @ (max-width: 760px) | line-height | `17px` | `17px` |
| apertura | `.didascalia` @ (max-width: 760px) | margin | `0 0 6px` | `14px 0 6px` |
| riunione | `.riunione-filo` @ (min-width: 761px) and (max-width: 1010px) | max-width | `440px` | `none` |
| riunione | `.riunione-filo` @ (max-width: 760px) | margin-top | `4px` | `0` |
| finestra | `.primo-avvio` @ (max-width: 760px) | grid-template-columns | `minmax(0, 1fr)` | `minmax(0, 1fr)` |
| finestra | `.finestra.avvio` @ (max-width: 760px) | width | `100%` | `100%` |
| finestra | `.finestra.avvio` @ (max-width: 760px) | font-size | `13px` | `13px` |
| ascolto | `.voce` | background | `rgba(255, 237, 239, 0.08)` | `transparent` |
| ascolto | `.voce` | border | `1.5px solid rgba(255, 219, 225, 0.28)` | `1.5px solid rgba(255, 219, 225, 0.34)` |
| ascolto | `.voce:hover, .voce:focus-visible` | border-color | `var(--rosa)` | `var(--testo)` |
| ascolto | `.voce[aria-pressed="true"]` | background | `rgba(255, 237, 239, 0.16)` | `var(--testo)` |
| ascolto | `.voce[aria-pressed="true"]` | border-color | `var(--voce)` | `var(--testo)` |
| filo | `.ascolto-voce` | grid-template-columns | `420px minmax(0, 1fr)` | `440px minmax(0, 1fr)` |
| filo | `.ascolto-voce` | column-gap | `80px` | `80px` |
| filo | `.ascolto-voce .luce-tratto` | left | `68%` | `62%` |
| filo | `.ascolto-voce .luce-tratto` | top | `55%` | `50%` |
| filo | `.ascolto-voce .tratto-testo` | top | `130px` | `100px` |
| filo | `.filo` | display | `grid` | `block` |
| filo | `.ascolto-voce .tratto-testo` @ (min-width: 761px) and (max-width: 1180px) | position | `static` | `static` |
| filo | `.ascolto-voce` @ (max-width: 760px) | gap | `34px` | `0` |
| filo | `.ascolto-voce` @ (min-width: 761px) and (max-width: 1010px) | grid-template-columns | `minmax(0, 1fr)` | `clamp(280px, 36vw, 360px) minmax(0, 1fr)` |
| filo | `.ascolto-voce` @ (min-width: 761px) and (max-width: 1010px) | row-gap | `48px` | `0` |
| filo | `.ascolto-voce .voci-filo` @ (max-width: 760px) | margin-top | `20px` | `22px` |
| strada | `.nodo` | border-radius | `50%` | `24px` |
| strada | `.tappa.fatta.acceso .nodo` | transform | `scale(1.06)` | `scale(1.04)` |
| strada | `.non-esiste` | gap | `14px 22px` | `10px 26px` |
| tratti | `.requisiti strong` | color | `var(--testo)` | `var(--bordeaux)` |
| tratti | `.chiusura .luce-tratto` | left | `50%` | `50%` |
| tratti | `.chiusura .luce-tratto` | top | `45%` | `36%` |
| tratti | `.requisiti li` @ (max-width: 760px) | font-size | `18px` | `18px` |
| tratti | `.requisiti li` @ (max-width: 760px) | line-height | `27px` | `27px` |

## Regole senza elemento (45): non portate

Nessun elemento di `index.html` né di `scena.js` ha queste classi (sezioni di una versione precedente: «campioni», «oggi», il lettore, gli ascoltatori). Restano nel foglio di stile di partenza, che non è in questo repository.

`.campioni` · `.campioni-capo` · `.campioni h2, .oggi h2` · `.campioni-capo p` · `.campioni-elenco` · `.campione` · `.campione-scritto` · `.campione-detto` · `.campione-detto span` · `.campione audio` · `.lettore` · `.lettore .pillola` · `.lettore .tondo` · `.lettore .suona .tondo::before` · `.lettore-tempo` · `.campione-altra` · `.campione-altra a` · `.oggi` · `.oggi-colonne` · `.oggi-colonne > div` · `.oggi-colonne > div:nth-child(2)` · `.oggi-colonne > div:nth-child(3)` · `.oggi h3` · `.oggi p` · `.oggi-fatti` · `.oggi-fatti strong` · `.campioni, .oggi` · `.campioni-elenco, .oggi-colonne` · `.ascoltatori` · `.ascoltatore` · `.ascoltatore .figura` · `.ascoltatore .lume` · `.ascoltatore .nome` · `.ascoltatori .guarda .testa` · `.ascoltatori .guarda .occhi`

## Pagine interne: la cornice e «non ancora» (incarico 3a, 16/11/2026)

Valori aggiunti per la prima pagina interna rifatta nella direzione 2 (`../website/non-ancora/`), in un blocco a parte in
fondo a `token.css`. Dove il ruolo è lo stesso di un valore della home il token lo richiama (`var(--…)`), così le due
pagine si muovono allo stesso modo. Componenti nuovi: `componenti/pagina.css` (la cornice delle pagine interne),
`riunione-ferma.css` (la riunione in cui la tua voce non arriva), `strada-ferma.css` (la strada che si ferma a una tappa
vuota), `versioni.css` (l'elenco delle versioni con il posto della prossima).

| Token | Valore | Ruolo | Dove |
|---|---|---|---|
| `--pagina-scena-spazio-sotto` | `96px` | aria sotto il primo schermo di una pagina interna | `pagina.css` `.scena-pagina` |
| `--pagina-primo-tratto-margine` | `0px` | la prima scena comincia subito sotto il primo schermo | `pagina.css` |
| `--coppia-colonne` | `minmax(0, 1fr) minmax(0, 480px)` | un tratto con il testo e un oggetto della scena | `pagina.css` `.tratto.coppia` |
| `--testo-spiegazione-chiara` | `var(--testo-requisiti-chiara)` | la spiegazione sotto un titolo sulla scena chiara | `pagina.css` |
| `--chiamata-ferma-altezza` | `clamp(200px, calc(100vh - 380px), 362px)` | i riquadri sopra la barra del microfono, interi a 1366×640 | `riunione-ferma.css` |
| `--chiamata-ferma-altezza-telefono` | `176px` | i riquadri al telefono | `riunione-ferma.css` |
| `--chiamata-ferma-barra-spazio-interno` | `6px 0 4px` | la barra del microfono nella cornice | `riunione-ferma.css` |
| `--barre-ferme-scala-y` | `0.14` | la voce piatta nel posto vuoto | `riunione-ferma.css` |
| `--bolla-nasce-scala` | `var(--messaggio-filo-bolla-scala)` | la bolla nasce dalla coda | `riunione-ferma.css`, `non-ancora.js` |
| `--durata-bolla-nasce` | `var(--durata-messaggio-filo-bolla-trasforma)` | idem | idem |
| `--ritardo-bolla-ferma` | `1900ms` | la bolla nasce dopo l'ultimo riquadro | `riunione-ferma.css` |
| `--durata-cerca`, `--ritardo-cerca` | `1300ms`, `2500ms` | il puntatore resta sul posto vuoto di «Kalliope» | `riunione-ferma.css` |
| `--durata-urto`, `--ritardo-urto` | `900ms`, `2780ms` | l'onda tratteggiata del posto vuoto (la durata delle onde della home) | `riunione-ferma.css`, `strada-ferma.css`, `non-ancora.js` |
| `--urto-scala` | `1.18` | fin dove si allarga l'onda del posto vuoto | idem |
| `--durata-mancante-nota`, `--ritardo-mancante-nota` | `var(--durata-scelta-testo)`, `2900ms` | «non c'è» accanto a «Kalliope» | `riunione-ferma.css` |
| `--opacita-tappa-spenta` | `0.42` | le tappe che la voce non raggiunge | `strada-ferma.css` |
| `--versioni-titolo-margine` | `2px 4px 10px` | il titolo dell'elenco delle versioni | `versioni.css` |
| `--versione-spazio-interno` | `12px 16px 13px` | una riga dell'elenco | `versioni.css` |
| `--durata-respira`, `--ritardo-respira`, `--respira-scala` | `1400ms`, `520ms`, `1.015` | il posto della prossima versione respira una volta | `versioni.css` |

Non ancora nei token (come in `scena.js` per la home, «Da decidere» in `SISTEMA.md`): i tempi della strada e i parametri
delle onde dentro `../website/non-ancora/non-ancora.js` (gli stessi numeri di `scena.js`). Il catalogo non mostra ancora i
quattro componenti nuovi: lo farà il ruolo di costruzione (durante l'incarico 3a il catalogo era in lavorazione dall'incarico 1).

### Correzioni dopo il giudizio (incarico 3a, giro di correzioni)

Nel blocco «Pagine interne» di `token.css` non esistono più `--durata-cerca`, `--ritardo-cerca`, `--ritardo-urto`,
`--ritardo-mancante-nota`, `--durata-respira`, `--ritardo-respira`, `--respira-scala` (il tentativo sul posto di «Kalliope» e
il respiro della prossima versione non si vedevano: sono stati rifatti). `--chiamata-ferma-altezza-telefono` passa da `176px`
a `152px`. Nuovi:

| Token | Valore | Ruolo | Dove |
|---|---|---|---|
| `--didascalia-margine-pagina-telefono` | `8px 0 0` | al telefono la didascalia sta subito sotto la scena | `pagina.css` |
| `--ritardo-segno` | `2400ms` | il segno della scelta parte verso «Kalliope» (dall'arrivo sulla pagina) | `non-ancora.js` |
| `--durata-segno-va`, `--attesa-segno`, `--durata-segno-torna` | `420ms`, `900ms`, `520ms` | va sul posto vuoto, resta svuotato, torna al microfono del computer | `non-ancora.js` |
| `--opacita-segno-vuoto` | `0.16` | il segno sul posto vuoto: non c'è niente da scegliere | `non-ancora.js` |
| `--urto-scelta-scala` | `1.32` | l'onda tratteggiata del posto vuoto nella barra del microfono | `riunione-ferma.css` |
| `--versioni-piede-spazio-interno` | `12px 2px 2px` | sotto l'elenco: il comando per tenerne l'indirizzo | `versioni.css` |
| `--versione-nuova-ombra` | `0 0 0 2px var(--voce), 0 0 26px 4px var(--bordo-evidente)` | l'ultima versione appena arrivata in cima | `versioni.css` |
| `--durata-arriva-in-cima`, `--ritardo-arriva-in-cima` | `1900ms`, `250ms` | l'ultima versione compare in cima, resta, scende; poi si apre il posto tratteggiato | `versioni.css` |
| `--durata-posto-testo`, `--ritardo-posto-testo` | `360ms`, `2050ms` | «Windows e macOS · compariranno qui» si scrive nel posto aperto | `versioni.css` |

`--durata-urto` vale ora anche per il posto della prossima versione che si accende una volta quando si copia l'indirizzo
(`versioni.css`, `.ricordata`). La soglia d'altezza `500px` (telefono girato) è dichiarata in `metodo.config.mjs`.

### Rifinitura (incarico 3a-r, 17/11/2026): gli schermi bassi della chiusura e il fuoco sul piede

Sei token nuovi, in fondo al blocco «Pagine interne» di `token.css`. La riunione della chiusura (`.tavolo-pagina`) si abbassa dove l'altezza
non basta per la bolla, la riunione e il comando (regola in `design/lavoro/3a-non-ancora/PIANO.md`, «La cornice»). Le costanti sono ciò che sta nello
schermo oltre alla riunione, misurato in italiano (barra 72 o 56, 8 px sotto la barra e 8 px in fondo, la coda della bolla 18, 34 + comando 56 o 48, e con
il messaggio d'errore 14 + 132); le righe della bolla e del messaggio sono quelle della scrittura (`--interlinea-13`, `--interlinea-6`: in arabo, con le
righe più alte, la riunione si abbassa di quel tanto, e la bolla sta nello schermo anche lì). Con un testo che fa una riga in più (un'altra lingua, +40%)
la bolla o il messaggio possono non starci: dove l'altezza non basta vince il messaggio (limiti in `metodo.config.mjs`).

| Token | Valore | Ruolo | Dove |
|---|---|---|---|
| `--tavolo-pagina-altezza-minima` | `60px` | la riunione più bassa che regge i nomi e le barre di «Tu» (come la fila della scelta della lingua sugli schermi bassi) | `pagina.css` (minimo dei tre sotto) |
| `--tavolo-pagina-altezza` | `clamp(60px, calc(100vh - 222px - 2 * var(--interlinea-13)), var(--tavolo-cornice-altezza))` | al computer: bolla (due righe), riunione e «Pausa» nello schermo; da 456 px d'altezza (in italiano) è i 172 di sempre | `pagina.css` `.tavolo-pagina .tavolo-cornice` |
| `--tavolo-pagina-altezza-telefono` | `clamp(60px, calc(100vh - 192px - 3 * var(--interlinea-6)), var(--tavolo-cornice-altezza-telefono))` | al telefono (barra da 56, bolla di tre righe, la più alta a 326 px): da 336 px d'altezza è i 78 di sempre | `pagina.css` ((max-width: 760px)) |
| `--tavolo-pagina-altezza-errore` | `clamp(60px, calc(100vh - 324px - 2 * var(--interlinea-13) - 2 * var(--interlinea-6)), var(--tavolo-cornice-altezza))` | al computer con il messaggio d'errore sotto il comando: bolla e messaggio insieme da 500 px d'altezza; da 602 è i 172 di sempre | `pagina.css` `.chiusura:has(.errore-ascolto)` ((min-width: 761px)) |
| `--tavolo-barre-quota` | `42%` | le barre di «Tu» non più alte di questa parte del riquadro (a 156 px di riquadro sono i 64 px di sempre) | `pagina.css` `.tavolo-pagina .barre` ((min-width: 761px)) |
| `--scorrimento-spazio-sotto` | `var(--spazio-29)` | lo spazio che resta sotto una voce del piede portata in vista dal fuoco (`scroll-margin-bottom`): Firefox scorre solo se il comando non si vede affatto | `pagina.css` `.piede a` |

## Le scritture e le lingue (incarico 2, 17/11/2026)

In fondo a `token.css` due blocchi nuovi: «Le scritture» (i caratteri di ogni scrittura, legati alla lingua con `:lang()`) e «Le
lingue» (il componente `componenti/lingue.css`). In italiano nessun valore calcolato cambia: ogni fattore vale 1 e ogni
spaziatura resta quella di prima. Fonti, licenze e pesi dei file: `caratteri/LEGGIMI.md`.

**Valori di prima che ora moltiplicano un fattore della scrittura** (in italiano lo stesso numero di pixel):

| Token | Valore di adesso | Prima |
|---|---|---|
| `--interlinea-1` … `--interlinea-14`, `--didascalia-interlinea-telefono`, `--bolla-testo-interlinea`, `--nome-interlinea-telefono`, `--tappa-nome-interlinea`, `--tratto-testo-interlinea-telefono` | `calc(<px di prima> * var(--interlinea-testo-scrittura))` | i px di prima |
| `--h1-grandezza`, `-medio`, `-telefono`, `--tratto-grandezza`, `-telefono`, `--chiusura-grandezza`, `-telefono` | `calc(<px> * var(--grandezza-titoli-scrittura))` | i px di prima |
| `--h1-interlinea`, `-medio`, `-telefono`, `--tratto-interlinea`, `--chiusura-interlinea`, `-telefono` | `calc(<px> * var(--grandezza-titoli-scrittura) * var(--interlinea-titoli-scrittura))` | i px di prima |
| `--bolla-chiusa-origine`, `--bolla-filo-bolla-origine`, `--messaggio-filo-bolla-origine` | `calc(50% + (40px − 50%) * var(--verso)) 100%` (30px per le ultime due): vicino alla coda, dall'inizio della riga | `40px 100%`, `30px 100%` |
| `--font-testo` | `"Lexend", "Lexend esteso", "Lexend riserva", system-ui, sans-serif` (la famiglia «Lexend esteso» ha soltanto il latino esteso: una pagina italiana non la usa e non la scarica) | `"Lexend", "Lexend riserva", system-ui, sans-serif` |
| `--linea-forse-fondo`, `--esito-forse-prima-fondo` | il tratteggio parte dall'inizio della riga: `repeating-linear-gradient(calc(90deg * var(--verso)), …)` | `90deg` |

**Nuovi, «Le scritture»:**

| Token | Valore | Ruolo | Dove |
|---|---|---|---|
| `--grandezza-titoli-scrittura` | `1` (urdu `0.72`) | la grandezza dei titoli nella scrittura, e con lei la loro interlinea | i token dei titoli |
| `--interlinea-titoli-scrittura` | `1` (arabo `1.3`, urdu `1.75`, hindi e bengali `1.25`, cinese `1.1`) | quanto si allontanano le righe dei titoli | i token dei titoli |
| `--interlinea-testo-scrittura` | `1` (arabo `1.15`, urdu `1.6`, hindi e bengali `1.12`, cinese `1.1`) | quanto si allontanano tutte le altre righe | le interlinee |
| `--tratto-interlinea-telefono` | `calc(37px * …titoli…)` | il titolo di un tratto al telefono (prima `--interlinea-14`, lo stesso valore) | `tratti.css` |
| `--h1-grandezza-stretto`, `--h1-interlinea-stretto` | `calc(25px * …)`, `calc(29px * …)` | il titolo sotto i 375 px (prima `--corpo-12` e `--interlinea-11`) | `apertura.css` |
| `--font-cinese` | `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", "WenQuanYi Micro Hei"` | il carattere di sistema per il cinese, scelto (nessun file) | le pile `:lang(zh)` |
| `--font-nomi-lingue` | `"Kalliope nomi delle lingue", var(--font-cinese), system-ui, sans-serif` (urdu: prima il nastaliq) | i nomi delle lingue, ognuno nella sua scrittura, con file piccolissimi | `lingue.css` |
| `--origine-inizio-x`, `--origine-fine-x` | `calc(50% ∓ 50% * var(--verso))` | il bordo d'inizio e di fine della riga, per le origini delle crescite | `finestra.css`, `strada.css`, `bolla.css`, `tratti.css`, `riunione-app.css`, `lingue.css` |

Per lingua (`:lang(…)`, ridefiniti): `--font-testo` (Lexend, poi il carattere della scrittura: Geologica per `el` e `bg`, Readex Pro
per `ar`, Noto Nastaliq Urdu per `ur`, Noto Sans Devanagari per `hi`, Noto Sans Bengali per `bn`, il carattere di sistema per
`zh`), `--font-app` (la finestra ricostruita: DejaVu per il latino, poi lo stesso carattere della scrittura) e, per `ar ur hi bn zh`,
`--spaziatura-h1`, `--spaziatura-tratto`, `--spaziatura-bolla-testo`, `--spaziatura-computer-nome` a `0em`. Il marchio resta latino e
tiene `--spaziatura-marchio`.

**Nuovi, «Le lingue»** (`componenti/lingue.css`):

| Token | Valore | Ruolo |
|---|---|---|
| `--lingue-distanza`, `--lingua-spazio-interno-inline`, `-telefono` | `var(--spazio-7)`, `var(--spazio-14)`, `var(--spazio-10)` | l'elenco: fra un nome e l'altro, dentro un nome |
| `--lingua-segno-rotazione` | `90deg` | la freccia dei collegamenti girata in giù accanto al nome della lingua (aperta: in su) |
| `--durata-lingue-pannello` | `var(--durata-menu)` | il pannello della barra si apre col tempo del menu |
| `--lingue-pannello-sopra`, `-larghezza`, `-colonne`, `-colonne-telefono`, `-altezza-massima`, `-sposta-y` | `calc(100% + 8px)`, `min(460px, …)`, tre colonne, due colonne, `calc(100vh − 96px)`, `-6px` | il pannello di vetro scuro della barra |
| `--scelta-lingua-spazio-interno`, `-telefono`, `--scelta-altezza-minima` | `56px var(--margine) 96px`, `24px var(--margine) 64px`, `calc(100vh − var(--barra-altezza))` | la pagina della scelta: la bolla e il riquadro a metà schermo |
| `--scelta-bolla-larghezza-massima`, `--scelta-bolla-spazio-interno` | `980px`, `var(--bolla-corpo-spazio-interno)` | la bolla delle lingue |
| `--bordo-lingua-in-bolla`, `--velo-lingua-in-bolla`, `--lingua-preferita-ombra` | `var(--bordo-rivedi-chiaro)`, `rgba(30, 39, 39, 0.07)`, `0 10px 22px -12px rgba(30, 39, 39, 0.6)` | un nome sul chiaro della bolla: bordo, passaggio, la lingua del browser accesa |
| `--scelta-tu-larghezza`, `-altezza`, `-larghezza-telefono`, `-altezza-telefono`, `--scelta-tu-scarto`, `-telefono` | `220px`, `128px`, `148px`, `88px`, `var(--spazio-14)`, `var(--spazio-8)` | il tuo riquadro sotto la coda |
| `--scelta-luce-inizio`, `--scelta-luce-sopra` | `34%`, `46%` | la luce della stanza dietro la bolla |
| `--scelta-barre-scala-y` | `var(--barre-1-scala-y)` | le barre di «Tu» fra un nome e l'altro |
| `--ritardo-scelta-tu`, `--ritardo-scelta-bolla`, `--ritardo-scelta-nomi`, `--passo-scelta-nomi`, `--durata-scelta-nome`, `--durata-scelta-barre`, `--ripetizioni-scelta-barre` | `0ms`, `380ms`, `820ms`, `34ms`, `300ms`, `260ms`, `4` | l'arrivo della pagina della scelta |

`--i` (l'ordine di un nome nella bolla) lo mette `lingua.js` elemento per elemento. Le soglie non cambiano.

### Correzione dopo il giudizio (incarico 2-c, 17/11/2026)

| Token | Valore | Ruolo |
|---|---|---|
| `--sottolineatura-posizione` | `auto` (arabo e urdu: `from-font`) | dove sta la linea dei collegamenti; con `auto` in arabo faceva uno scalino fra la parte araba e quella latina (`base.css`, `a`) |
| `--titolo-caratteristiche` | `normal` (cinese: `"halt"`) | le caratteristiche OpenType dei titoli: in cinese la virgola e il punto pieni a metà larghezza (`apertura.css`, `tratti.css`) |
| `--lingue-piede-altezza-stimata` | `96px` | l'elenco delle lingue nel piede prima di impaginarlo (`content-visibility: auto`: a riposo la pagina non scarica i caratteri dei nomi) |
| `--scelta-larghezza`, `--scelta-distanza`, `--scelta-coda-spazio` | `min(980px, 100%)`, `var(--spazio-21)`, `var(--misura-11)` | la pagina della scelta: bolla e fila larghe uguali, il nome del prodotto sopra, la coda fra la bolla e la fila |
| `--scelta-tavolo-altezza`, `--scelta-tavolo-altezza-basso` | `clamp(96px, calc(100vh − 540px), 172px)`, `60px` | la fila della riunione nella pagina della scelta; sugli schermi bassi si accorcia |
| `--scelta-lingua-spazio-interno-basso` | `12px var(--margine) 24px` | la pagina della scelta in un telefono girato |

Cambiati: `--scelta-lingua-spazio-interno` (`32px var(--margine) 72px`) e `-telefono` (`20px var(--margine) 48px`), `--scelta-luce-inizio`
(`50%`) e `--scelta-luce-sopra` (`52%`), `--ritardo-scelta-bolla` (`760ms`) e `--ritardo-scelta-nomi` (`1200ms`): «Tu» entra per ultimo,
come nella home. Tolti: `--scelta-tu-*`, `--ritardo-scelta-tu`, `--scelta-bolla-larghezza-massima` (la tessera sola non c'è più). Le pile
`--font-nomi-lingue` cominciano da `"Lexend"`: la faccia latina della famiglia dei nomi scaricava lo stesso file una seconda volta. La pila
dell'urdu nomina un nastaliq e un urdu del sistema prima del ripiego generico. Un nome di lingua fuori dall'urdu torna ai file dei nomi
(`[lang]:not(:lang(ur))`). Nessun token per la barra «raccolta» (`barra.css`, misurata da `website/componenti.js`): usa quelli della barra del tablet.

## La pagina «stato» (incarico 3b, 17/11/2026)

Blocco `:root` in fondo a `token.css` («La pagina «stato»») e una domanda sui media che lo segue (al telefono la riga delle parole è più
fitta). Componenti nuovi: `riunione-provata.css`, `catena.css`, `domande.css`, `varco.css`, `inoltra.css`; in `pagina.css` una regola
aggiunta (un titolo di quattro righe sugli schermi bassi del computer prende la misura del tablet). Nessun token esistente è cambiato.

| Token | Valore | Ruolo |
|---|---|---|
| `--opacita-provato-bordo` | `0.55` | il bordo di «Tu» dopo l'arrivo: resta acceso a metà (la voce è arrivata al microfono) |
| `--velo-oltre` | `rgba(17, 24, 25, 0.32)` | il velo sugli altri, oltre il confine del provato |
| `--durata-provato-bordo`, `--durata-provato-barre`, `--ripetizioni-provato-barre`, `--ritardo-provato-barre`, `--provato-barre-da` | `var(--durata-bordo)`, `260ms`, `6`, `130ms`, `0.35` | «Tu» parla: il bordo si accende, le barre salgono e scendono per un secondo e mezzo |
| `--durata-oltre`, `--onda-oltre-da`, `--opacita-onda-oltre`, `--ritardo-oltre-luca`, `-paola`, `-anna` | `360ms`, `0.02`, `0.75`, `220ms`, `440ms`, `500ms` | l'onda tratteggiata che parte da «Tu»: dove tocca un riquadro, lo lascia tratteggiato |
| `--provato-acceso-ombra`, `--durata-provato-frase` | anello della voce, `800ms` | il microfono «Kalliope» quando la voce ci arriva; la frase della bolla che si accende |
| `--ritardo-voce-provata`, `--ritardo-microfono-provato`, `--ritardo-oltre-segnato` | `2500ms`, `600ms`, `700ms` | l'arrivo del primo schermo: «Tu» parla, poi il microfono, poi l'onda verso gli altri (`stato.js`) |
| `--catena-misura-larghezza`, `--catena-misura-margine` | `200px`, `78px 0 18px` | la parentesi sul lato della catena: «dal tasto Invio al suono nella riunione: non misurato» |
| `--catena-computer-spazio-interno`, `-telefono`, `--catena-computer-spazio-inline`, `-telefono` | `20px 26px 4px`, `14px 16px 2px`, `26px`, `16px` | la cornice del computer intorno alle tappe provate |
| `--anello-nodo`, `-telefono`, `--anello-spazio-blocco`, `--anello-spazio-blocco-sopra`, `--anello-ultimo-spazio-sotto`, `--anello-nome-margine`, `-telefono`, `--anello-fatti-colonne` | `64px`, `48px`, `26px`, `26px`, `30px`, `16px 0 0`, `11px 0 0`, `minmax(0, 300px) minmax(0, 1fr)` | una tappa della catena: il nodo, gli spazi, il nome, la cifra a sinistra e il fatto a destra |
| `--anello-nodo-da`, `--opacita-anello-spento`, `--durata-anello-linea`, `--ritardo-anello-dopo`, `--durata-anello-nodo` | `0.9`, `0.4`, `260ms`, `320ms`, `var(--durata-nodo-trasforma)` | una tappa alla volta: la linea arriva al nodo, il nodo si accende crescendo, la linea riparte |
| `--fonte-spazio-interno` | `0 8px 1px` | l'etichetta del file da cui viene un fatto (`.fonte`) |
| `--cifra-grandezza`, `--cifra-interlinea`, `-telefono` | `54px`, `58px`, `38px`, `42px` | una cifra misurata, in voce |
| `--quota-larghezza`, `--quota-altezza`, `--quota-voce-processore`, `--durata-quota`, `--ritardo-quota` | `260px`, `8px`, `0.07`, `900ms`, `520ms` | la quota: un secondo di voce, e la parte accesa (0,07 s di processore, README) che si riempie |
| `--parole-quante`, `--parole-sbagliata`, `--parole-passo`, `--parole-segno`, `-telefono`, `--parole-altezza`, `--parole-segni-fondo`, `--durata-parole`, `--parola-sbagliata-ombra` | `43`, `29`, `6px`, `3px`, `5px`, `2px`, `16px`, gradiente a segni, `900ms`, anello dell'azione | la riga delle parole: una su 43 (il 2,3%) è sbagliata e lampeggia due volte |
| `--pacchetto-spazio-interno`, `--passo-pacchetti` | `3px 10px 4px`, `120ms` | le etichette piccole a pillola (pacchetti, app, file); i quattro pacchetti si accendono in fila |
| `--riscrive-campo-spazio-interno`, `--riscrive-bolla-spazio-interno`, `--ritardo-riscrive` | `6px 10px 7px`, `7px 13px 8px`, `820ms` | «Scrivi la frase»: il campo, poi la bolla di ciò che la voce dice |
| `--domande-colonne`, `--domanda-spazio-interno-blocco`, `-inline`, `--domanda-spazio-interno-telefono-blocco`, `-inline` | `minmax(0, 480px) minmax(0, 1fr)`, `11px 12px`, `16px 22px`, `10px 11px`, `14px 18px` | le domande in fila, e la bolla accanto |
| `--domande-bolla-sopra`, `--domande-bolla-larghezza`, `--domande-bolla-grandezza`, `--domande-bolla-interlinea` | `calc(var(--barra-altezza) + 32px)`, `640px`, `var(--bolla-testo-grandezza)`, `var(--bolla-testo-interlinea)` | la bolla della risposta, che resta in vista sotto la barra |
| `--ritardo-domande-bolla`, `--durata-domanda-via`, `--durata-domanda-arriva`, `--durata-domanda-misura` | `360ms`, `140ms`, `var(--durata-scelta-sfondo)`, `420ms` | la prima risposta nasce; cambiando domanda le parole si spengono, la bolla prende la misura nuova, le parole nuove compaiono |
| `--varco-larghezza`, `-medio`, `--varco-sopra`, `-telefono`, `--varco-spazio-sopra`, `-telefono`, `--varco-spazio-interno`, `-telefono`, `--varco-altezza-minima`, `--varco-colonne` | `600px`, `400px`, `calc(var(--barra-altezza) + 40px)`, `56px`, `40px`, `30px`, `48px 22px 22px`, `30px 12px 12px`, `340px`, `minmax(0, 1.2fr) minmax(0, 1fr)` | il computer del varco, che resta in vista mentre scorrono i passi |
| `--varco-finestra-spazio-interno`, `--varco-disco-spazio-interno`, `--varco-pacco-spazio-interno` | `14px 16px 18px`, `14px 16px 16px`, `3px 7px` | la finestra di Kalliope, il disco, un file della voce |
| `--varco-filo-fine`, `--varco-filo-sopra`, `--varco-filo-altezza` | `148px`, `26px`, `64px` | il filo da cui entra la voce: da «huggingface.co» al disco |
| `--varco-passi-distanza`, `-telefono`, `--varco-fondo-telefono` | `26vh`, `38vh`, chiaro che sfuma | un passo alla volta a metà schermo; al telefono il computer agganciato ha sotto il chiaro della scena |
| `--opacita-varco-quieto`, `--varco-acceso-ombra`, `--varco-chiude-scala`, `--durata-varco`, `--durata-pacco`, `--passo-pacchi`, `--curva-pacco`, `--ritardo-varco-voce`, `--finestra-chiara-ombra-varco` | `0.38`, anello della voce, `0.94`, `420ms`, `620ms`, `220ms`, `cubic-bezier(0.45, 0, 0.2, 1)`, `900ms`, ombra | i passi del varco: ciò che non riguarda il passo si quieta, il campo si accende, i tre file scendono in fila, la finestra si chiude |
| `--inoltra-larghezza`, `--inoltra-spazio-interno`, `--ritardo-inoltra-bolla`, `--durata-inoltra-copiata`, `--inoltra-copiata-ombra` | `720px`, `20px 26px 22px`, `360ms`, `900ms`, anello della voce | il messaggio da inoltrare: la bolla nasce; copiato, l'anello della voce una volta |

Le variabili per elemento che i componenti si danno da sé: `--barra-base` (l'altezza di riposo di ogni barra di «Tu», `riunione-provata.css`),
`--quota` (`catena.css`, da `--quota-voce-processore`), `--anello-spazio-sopra-nodo` (`catena.css`), `--ritardo` (come nei tratti). Le soglie
non cambiano. Da portare nei token (come per `scena.js` e `non-ancora.js`): in `stato.js` i moltiplicatori della discesa dei file (0,6; 1,6;
0,85; 0,7) e le curve `linear` delle dissolvenze della bolla delle domande.

### Correzione dopo il giudizio (incarico 3b-c, 17/11/2026)

Aggiunti in fondo al blocco «La pagina «stato»» (nessun token cambiato: dove un valore nuovo ne sostituisce uno, quello di prima resta e non
è più usato dai fogli; da togliere quando il file non ha altri lavori in corso).

| Token | Valore | Ruolo |
|---|---|---|
| `--passo-cascata-anelli` | `140ms` | le tappe della catena che arrivano insieme sullo schermo si accendono a cascata breve (I1) |
| `--ritardo-fatto-anello` | `300ms` | il fatto della tappa accade appena il nodo è acceso (sostituisce `--ritardo-quota`) |
| `--catena-misura-testo-sopra` | `calc(var(--barra-altezza) + 24px)` | la scritta «non misurato» resta in vista sotto la barra finché c'è la parentesi (M3) |
| `--dettagli-segno-rotazione` | `90deg` | la freccia dei collegamenti girata accanto a «I dettagli e le fonti», «Licenze», «Impronte e provenienza» al telefono |
| `--anello-spazio-blocco-telefono` | `18px` | al telefono meno aria fra le tappe (I4) |
| `--domande-bolla-coda-spazio` | `var(--misura-11)` | al telefono la coda della bolla della risposta sta sopra e indica la domanda (M2) |
| `--varco-spazio-sopra-2`, `-telefono-2`, `--varco-filo-altezza-2`, `--varco-filo-altezza-telefono` | `112px`, `30px`, `134px`, `44px` | il filo da «huggingface.co» più lungo: la discesa delle impronte si vede (M8; sostituiscono `--varco-spazio-sopra`, `--varco-filo-altezza`) |
| `--varco-pacco-spazio-interno-2`, `--varco-pacco-ombra` | `4px 9px 5px`, ombra | un'impronta leggibile (sostituisce `--varco-pacco-spazio-interno`) |
| `--varco-passi-distanza-2`, `--varco-passi-distanza-telefono-2`, `--varco-passo-larghezza-massima` | `14vh`, `10vh`, `520px` | i passi del varco più vicini e la colonna più larga (M9, I4; sostituiscono `26vh`, `38vh`) |

Variabili date dallo script: `--misura-da`, `--misura-a` (`stato.js`, sulla `.catena`: dove comincia e finisce la parentesi «non misurato»).
In `barra.css` una regola in fondo (M1) usa token che c'erano: `--velo-scelto`, `--peso-forte`, `--velo-menu-premuto`.

## Correzioni dopo il secondo sguardo (incarico 2-f, 17/11/2026)

Cinque token nuovi, in fondo a `token.css` (blocco «Correzioni dopo il secondo sguardo» e «L2»), e otto token che cambiano la sola unità dell'altezza (`vh` → `var(--altezza-schermo)`: stesso valore dove lo schermo non cambia, più basso
su un telefono con la barra del browser visibile). Nessun valore dei token che c'erano è cambiato.

| Token | Valore | Ruolo | Dove è usato |
|---|---|---|---|
| `--altezza-schermo` | `100vh`; `100svh` dove il browser lo conosce (`@supports (height: 100svh)`) | l'altezza dello schermo che si vede davvero, con la barra del browser visibile: su un telefono `vh` è l'altezza con la barra nascosta e le misure calcolate su `vh` vengono più alte di quanto serve | negli 8 token sotto. `--mondo-altezza-minima` resta `100vh` (il mondo deve riempire anche lo schermo con la barra nascosta); `--menu-aperto-altezza-massima`, `--lingue-pannello-altezza-massima`, `--sovrap` e `--varco-passi-distanza*` restano come sono |
| `--chiamata-altezza-basso-699`, `--chiamata-altezza-computer`, `--chiamata-ferma-altezza`, `--tavolo-pagina-altezza`, `-telefono`, `-errore`, `--scelta-tavolo-altezza`, `--scelta-altezza-minima` | stessi di prima, con `calc(var(--altezza-schermo) - …)` al posto di `calc(100vh - …)` | l'altezza della riunione (home, chiusura di «non ancora», fila della pagina della scelta) e il minimo della pagina della scelta | `riunione.css`, `riunione-ferma.css`, `pagina.css`, `lingue.css` |
| `--pannello-menu-pieno` | `rgba(28, 3, 11, 0.995)` | il menu aperto dove il browser non sfoca il fondo (Firefox senza scheda grafica: dice di conoscere `backdrop-filter` e non lo disegna) | `barra.css`, solo in `@supports (-moz-appearance: none) { .js .menu.aperto, .js .barra.raccolta .menu.aperto { background: var(--pannello-menu-pieno) } }`: il menu aperto in Firefox; il pannello delle lingue sul computer resta com'è (lì la differenza fra Firefox senza sfocatura e Chromium è piccola: 11 e 10 su 255); Chromium e WebKit non cambiano |
| `--barre-etichetta-distanza`, `--barre-scala-minima`, `--barre-voce-scala-massima` | `3px`, `0.4`, `1.1` | l'etichetta di «Tu» e le barre della voce non si toccano: la distanza che deve restare, quanto possono rimpicciolirsi le barre, la massima altezza che la voce dà a una barra rispetto al riposo | `componenti.js` (`misuraBarreTu`) li legge e mette `--barre-sposta` e `--barre-scala` sulle barre; `riunione.css`: `.tavolo .riquadro.tu .barre { transform: translate(-50%, calc(-50% + var(--barre-sposta, 0px))) scale(var(--barre-scala, 1)) }` |

Regole (non token) che cambiano: in `barra.css` le due regole del menu che stavano in `lingue.css` e `html:has(.barra:focus-within) { scroll-padding-top: 0 }` (il fuoco dentro la barra non muove la pagina); in `lingue.css` il titolo della pagina della scelta
sopra la luce (`z-index: var(--livello-scena)`) e la barra della pagina della scelta senza fondo a riposo (`@keyframes barra-scelta-piena`); in `versioni.css` il posto per la risposta di «Copia» (`.copia-esito` in griglia, `.vuoto` invisibile).


## Costruzione di «stato» (incarico 3b-b, 17/11/2026)

Tredici token nuovi in fondo a `token.css` (blocco «Costruzione di «stato»»): i numeri che `stato.js` teneva scritti nel codice. Nessun valore di quelli che c'erano è cambiato. Numeri senza unità si leggono con `parseFloat`.

| Token | Valore | Ruolo |
|---|---|---|
| `--pacco-corsa-durata` | `1.8` | la discesa di un'impronta dura 1,8 volte `--durata-pacco` (il filo e il tratto fino al disco in un'animazione sola) |
| `--pacco-corsa-ritardo` | `0.6` | parte dopo 0,6 volte `--durata-pacco`: il filo ha già portato il file al varco |
| `--pacco-corsa-pieno-da`, `--pacco-corsa-pieno-a` | `0.2`, `0.8` | l'impronta è piena da un quinto ai quattro quinti della corsa |
| `--pacco-corsa-strada` | `0.85` | a quel punto ha fatto l'85% della strada fino al bordo del disco |
| `--pacco-corsa-scala-fine` | `0.7` | si spegne entrando nel disco, rimpicciolendo |
| `--curva-domanda` | `linear` | le dissolvenze della risposta nella bolla delle domande |
| `--varco-fascia-sopra`, `--varco-fascia-sotto` | `0.42`, `0.42` | la fascia dello schermo (frazione dell'altezza) in cui un passo del varco «conta», al computer |
| `--varco-fascia-sopra-telefono`, `--varco-fascia-sotto-telefono` | `0.56`, `0.24` | la stessa, al telefono (sotto il computer agganciato) |
| `--gesto-aria` | `12px` | ciò che un gesto apre (bolla della risposta, dettagli aperti, conferma della copia) resta in vista con questa aria sotto la barra e sotto il bordo |
| `--domande-indirizzo-centro` | `50vh` | al computer, un collegamento diretto lascia la domanda al centro del viewport e spazio per leggere la risposta sopra |
| `--domande-bolla-sopra-basso` | `calc(var(--barra-altezza) + var(--gesto-aria))` | sugli schermi bassi del computer (altezza ≤ 500 px) la bolla appiccicosa sta a ridosso della barra: ci stanno risposte più alte (domande.css) |

## Rifinitura di «stato» (incarico 3b-r, 17/11/2026)

Un token nuovo in fondo a `token.css` (blocco «Rifinitura di «stato»»); nessun valore di quelli che c'erano è cambiato.

| Token | Valore | Ruolo |
|---|---|---|
| `--varco-disco-aria-lato` | `16px` | l'aria ai lati del riquadro «Sul disco»: `--varco-disco-spazio-interno` ora la nomina (`14px var(--varco-disco-aria-lato) 16px`, lo stesso valore di prima) e le etichette dei file possono occuparla fino al bordo del riquadro (`varco.css`, `.varco-file`) |

Variabile data dallo script: `--scorre-sposta` (`stato.js`, sulla `.domande-bolla.scorre`: dove sta, accanto alla domanda).

## Il marchio (incarico L-3, 19/11/2026)

Dieci token nuovi in fondo a `token.css` (blocco «Il marchio»); nessun valore di quelli che c'erano è cambiato. Sono i colori e i tempi del marchio: la geometria sta in `marchio/disegno.json`. `tools/marchio.py` legge da qui i colori (risolve anche `var()`) e scrive i file di `marchio/` e le icone del programma; `--check` fallisce se non tornano. I tempi e `--segno-fronte-pieno` li legge `marchio/marchio.js` all'uso. Numeri senza unità si leggono con `parseFloat`.

| Token | Valore | Ruolo |
|---|---|---|
| `--segno-colore` | `#e6396e` | la parte detta (piena) e il contorno, pieno o tratteggiato; oklch(62% 0.21 8), 3,9:1 sul chiaro e sullo scuro; `marchio.css` (`.m-detto`, `.m-bordo`) e tutte le forme |
| `--segno-parola` | `#ffedef` | le parole dette, chiare sul pieno; `.m-dette` e le forme libera, piena e piccola |
| `--segno-piastra` | `#fab7c2` | la forma piena per macOS: il quadrato rosa chiaro |
| `--segno-simbolo` | `#2e3436` | la versione simbolica di GNOME: il grigio dei simboli di Adwaita (GTK la ricolora comunque) |
| `--segno-fronte-pieno` | `62` | di quanto si sposta il fronte della voce (unità della tela, 128) dal riposo quando la frase è tutta detta; il riposo è il disegno com'è (0) e non è un valore |
| `--segno-inseguimento` | `220ms` | la costante di tempo con cui il fronte insegue le parole della bolla vera (la dissolvenza della bolla della home, D2) |
| `--segno-sosta` | `600ms` | con l'ultima parola (o a gesto fatto) la bolla resta tutta piena |
| `--segno-ritorno` | `800ms` | e torna a riposo in questo tempo fisso, con `--curva-dolce-doppia` |
| `--segno-prova-chiaro` | `#fafafb` | il fondo chiaro su cui il catalogo prova il segno: la finestra chiara di GNOME (libadwaita 1.10.0, `_colors.scss`) |
| `--segno-prova-scuro` | `#222226` | il fondo scuro: la finestra scura di GNOME (libadwaita 1.10.0; GNOME Shell 51.1) |

Il marchio non usa nessun altro valore: ombre, bagliori e sfumature non ci sono (GNOME le sconsiglia fuori dalla sagoma, Flathub le vieta cotte nell'icona). I fondi su cui il catalogo lo mostra sono `--segno-prova-chiaro`, `--segno-prova-scuro` e `--fondo` (il bordeaux del sito).

## La pagina «installa» (incarico 3c, 20/11/2026)

Blocco `:root` in fondo a `token.css` («La pagina «installa»»), dopo quello del marchio (`tools/marchio.py` legge i token per nome: l'ordine non
conta). Componenti nuovi: `scelta-sistema.css`, `comando.css`, `terminale.css`, `installazione.css`. Nessun token esistente è cambiato; nessun
file condiviso riordinato. Le scelte senza una fonte sono progettuali (piano: `design/lavoro/3c-installa/PIANO.md`).

| Token | Valore | Ruolo |
|---|---|---|
| `--font-terminale` | `"DejaVu Sans Mono", "Liberation Mono", "Noto Sans Mono", ui-monospace, monospace` | il carattere dei comandi e del terminale: quello a spaziatura fissa del computer di chi legge, nessun file da scaricare (come il cinese, `caratteri/LEGGIMI.md`) |
| `--sistemi-margine`, `--sistemi-margine-telefono` | `26px 0 0`, `18px 0 0` | la scelta della distribuzione sotto la presentazione |
| `--sistemi-distanza`, `--sistemi-voce-altezza`, `--sistemi-voce-spazio-inline` | `8px`, `40px`, `15px` | i quattro sistemi: pulsanti-voce alti 40 px (la riga di voci della home) |
| `--sistemi-dice-margine` | `12px 0 0` | la riga che dice che cosa vuol dire la scelta, con «Non uso Linux» |
| `--ritardo-sistemi` | `580ms` | la scelta entra fra la presentazione (520 ms) e i comandi (640 ms) |
| `--comando-fondo`, `--comando-bordo`, `--comando-fondo-in-riga` | `rgba(10, 15, 16, 0.5)`, `rgba(181, 218, 206, 0.2)`, `rgba(242, 245, 244, 0.1)` | il comando da copiare: più scuro della scena, con il bordo dei pannelli; un comando dentro una frase |
| `--comando-raggio`, `--comando-margine`, `--comando-spazio-inizio`, `--comando-spazio-blocco` | `12px`, `10px 0 0`, `16px`, `6px` | la sua forma |
| `--comando-grandezza`, `--comando-interlinea`, `-telefono` | `15px`/`22px`, `13px`/`19px` | il comando, un passo sotto il testo |
| `--comando-grandezza-in-riga` | `0.9em` | un comando dentro una frase (la spaziatura fissa è più larga) |
| `--comando-larghezza-massima` | `600px` | |
| `--comando-numero-spaziatura` | `0.04em` | un'impronta: cifre un poco più distanti, si confrontano a occhio |
| `--comando-copia-altezza`, `--comando-copia-larghezza` | `32px`, `86px` | «Copia»: «Copia» e «Copiato» nella stessa cella, larghezza ferma |
| `--comando-copiato-ombra`, `--durata-comando-copiato` | luce della voce, `1600ms` | copiato: la luce intorno al comando e quanto resta «Copiato» |
| `--terminale-fondo`, `--terminale-barra`, `--terminale-barra-altezza`, `--terminale-raggio`, `--terminale-ombra` | `#1c030b`, `rgba(255,237,239,0.04)`, `30px`, `16px`, ombra della cornice | il terminale ricostruito: la notte più scura (come il menu aperto), la barra del titolo |
| `--terminale-spazio-interno`, `-telefono`, `--terminale-confronto-spazio-interno` | `14px 20px 16px`, `10px 12px 12px`, `12px 20px 16px` | |
| `--terminale-grandezza`, `--terminale-interlinea`, `-telefono` | `14px`/`22px`, `12px`/`19px` | |
| `--terminale-riga-tua`, `--terminale-riga-tua-altezza`, `-lunga`, `-corta` | `rgba(255,237,239,0.16)`, `7px`, `72%`, `44%` | una riga del computer di chi installa: c'è, ma che cosa dice dipende da lui (la pagina non la inventa) |
| `--terminale-numero-larghezza`, `--terminale-trovato-prima`, `--terminale-trovato-dopo` | `3.4em`, `2.4em`, `11em` | la cartella di casa di chi installa, che la pagina non conosce; la riga con «kalliope» |
| `--terminale-cursore-larghezza`, `--terminale-cursore-altezza` | `0.6em`, `1.15em` | il cursore (mentre il comando si scrive non occupa posto) |
| `--terminale-uguale` | `rgba(117, 205, 174, 0.36)` | un gruppo di cifre confrontato, la parola trovata: l'azione, velata |
| `--durata-t-riga`, `--durata-t-gruppo` | `200ms`, `180ms` | una risposta che compare; un gruppo di cifre che si accende |
| `--passo-lettera`, `--passo-lettera-rapido` | `33ms`, `14ms` | il comando si scrive come la frase della home (33 ms a carattere); riscritto in fretta quando si cambia distribuzione |
| `--passo-riga-terminale`, `--pausa-invio`, `--passo-gruppo-impronta` | `300ms`, `260ms`, `130ms` | fra una risposta e l'altra; prima di Invio; fra un gruppo di otto cifre e il successivo |
| `--ritardo-terminale-scrive`, `--ritardo-installata`, `--durata-installata`, `--ritardo-installata-tu` | `2000ms`, `380ms`, `420ms`, `260ms` | il primo schermo: il terminale comincia a scrivere; «Kalliope» compare fra i microfoni; il posto si riempie; il tuo riquadro segue |
| `--passo-pacchi`, `--ritardo-cartella-file`, `--cartella-file-da`, `--pacco-da` | `150ms`, `160ms`, `-14px`, `-18px` | i file che arrivano nella cartella (download; `/usr` o `~/.local`) scendendo da sopra |
| `--avvio-prepara`, `--avvio-pronta`, `--ritardo-avvio` | `3400`, `4300`, `420ms` | il primo avvio della finestra di «installa»: «Preparo la voce…» fino a «Pronta». Dalla 0.1 la voce è nel pacchetto e non c'è più lo scarico (tolti `--avvio-premi`, `--avvio-scarica`, `--avvio-scarico-durata`) |
| `--palco-terminale-altezza`, `--palco-terminale-sotto` | `88px`, `16px` | il terminale del primo schermo, al posto della bolla |
| `--oggetto-fermo-sopra` | `96px` | l'oggetto accanto al testo resta fermo sotto la barra (72) con 24 px d'aria |
| `--passo-distanza`, `-telefono` | `44px`, `32px` | fra un passo e l'altro dello stesso tratto |
| `--passo-nome-grandezza`, `--passo-nome-interlinea`, `-telefono` | `24px`/`30px`, `20px`/`26px` (per i fattori delle scritture) | il nome di un passo («Scarica», «Controlla che sia uguale», «Se la riga dice altro») |
| `--esito-riuscito-bordo` | `var(--voce)` | «Riuscito se…»: la riga piena (quella di «Se no…» è tratteggiata, il segno di «non ancora») |
| `--installa-colonne`, `--apri-colonne` | `minmax(0,500px) minmax(0,1fr)`, `minmax(0,1fr) minmax(0,540px)` | i tratti cambiano lato: la cartella prima dei comandi; il testo prima della finestra |
| `--apri-finestra-larghezza`, `--apri-stato-altezza` | `540px`, `62px` | la finestra di «Apri»; la riga di stato tiene due righe (le frasi lunghe non la spostano) |
| `--microfono-scena-larghezza`, `--riprendi-colonne`, `--riprendi-larghezza` | `560px`, due colonne, `1040px` | la chiusura: comando, terminale e microfono; poi «Se ti sei fermato» e l'indirizzo |
| `--ripresa-linea-inizio`, `--ripresa-segno-scala` | `11px`, `1.15` | la strada dei cinque passi della ripresa |

Soglie: nessuna nuova (760, 761, 699, 1180 della cornice).

## Costruzione di «installa» (incarico 3c-b, 20/11/2026)

Blocco `:root` in fondo a `token.css`: un solo token, e il suo ruolo. Il comando principale resta nel primo schermo in ogni lingua (`installa.js`, `adattaPrimo`).

| Token | Valore | Ruolo |
|---|---|---|
| `--primo-comando-aria-sotto` | `12px` | l'aria che il pulsante del file tiene sotto di sé nel primo schermo: se non ci sta, il titolo scende di un gradino |
| `--righe-prima-dei-file` | `3` | le righe del terminale che si vedono prima che i file comincino a scendere nella cartella (moltiplica `--passo-riga-terminale`) |
| `--impronta-cifre-gruppo` | `8` | le cifre di un gruppo dell'impronta che si confronta |
| `--annuncio-attesa` | `60ms` | l'annuncio si svuota e poi si riscrive: così un lettore di schermo lo legge anche se il testo è uguale al precedente |

Soglie: `501px` (`installazione.css`: il titolo di «installa» alla misura del tablet vale da 501 px d'altezza in su; sotto vale la regola della cornice per il telefono girato).

## Palette approvata il 26 novembre

I token dei colori conservano i loro ruoli e ricevono i valori approvati il 26 novembre: superfici grafite, testo neutro, azione e voce menta; colori delle figure separati dagli accenti funzionali. I nomi storici `--bordeaux`, `--rosa` e `--magenta` restano per compatibilità con i componenti: in questa palette rappresentano rispettivamente segni scuri, bordo reattivo e voce nella bolla. I token `--segno-*` conservano il logo scelto.

| Token aggiunto | Valore | Ruolo |
| --- | --- | --- |
| `--riunione-guida-larghezza` | 860px | Misura dei tratti discorsivi delle guide |
| `--riunione-catalogo-altezza` | 844px | Altezza della pagina viva nel catalogo |
| `--riunione-guida-aria-telefono` | 32px | Distacco del testo dal bordo delle scene al telefono |

Le tre misure sono scelte progettuali rese e viste sulla guida, derivate dalla cornice e dal telefono di confronto; non modificano la home.

Soglia aggiunta: 280px, barra a forte ingrandimento. Il marchio mostra il simbolo e Menu; l’azione usa una riga propria. È una scelta circoscritta al difetto osservato a 180px CSS, con controprove a 326 e 390. Come le altre soglie è elencata in metodo.config.mjs perché le media query non leggono variabili CSS.


## La finestra disegnata sulle pagine (sito 0.3, 26/11/2026)

La finestra ricostruita sulla home («Ascolta»), nel primo avvio e nelle frasi di «Installa» è la finestra del programma ridotta a un disegno
(`componenti/finestra.css`). **Colori, carattere, pesi, raggi, spessore e passo del tratteggio, tempi e curve sono i ruoli `--app-*` così come sono** (`--app-fondo`,
`--app-barra`, `--app-campo`, `--app-testo`, `--app-testo-tenue`, `--app-segnaposto`, `--app-tratteggio`, `--app-tratteggio-fuoco`, `--app-azione`, `--app-voce`,
`--app-attenzione`, `--app-attenzione-fondo`, `--app-velo-*`, `--app-raggio-*`, `--app-tratto`, `--app-tratteggio-pieno` e `-vuoto`, `--app-durata-*`, `--app-curva-*`,
`--app-opacita-spento`…): se cambiano, cambia anche il disegno. Il disegno è sempre nel tema scuro (la regola chiara è `:root[data-tema="chiaro"]`, del solo programma).
Le sole misure proprie sono i `--finestra-*`: per stare in 470 px non sono quelle della finestra a 920 (la scrittura a 30 px non ci starebbe), e ognuna dice nel suo
commento che cosa è nella finestra. La bolla chiara della home (`componenti/bolla.css`) non cambia: è già la bolla della finestra, con gli stessi valori (colore del testo,
corpo 24 px, 520 ms, 200 ms per parola); la parola non ancora detta ha l'opacità 0,38 del sito (la finestra usa `--app-bolla-da-dire`, 0,34: stesso ruolo, valore un po' diverso, non unificati).

| Token | Valore | Ruolo | Fonte |
|---|---|---|---|
| `--finestra-barra-altezza` | `38px` | la barra del disegno | scelta (nella finestra 56 px) |
| `--finestra-marchio` | `var(--spazio-18)` (24 px) | il logo nella barra | scelta (nella finestra 30 px) |
| `--finestra-nome-corpo` | `var(--corpo-7)` (16 px) | «Kalliope» accanto al logo | scelta (nella finestra 18 px) |
| `--finestra-voce-altezza` | `26px` | la pillola della voce, e «Come si risolve» | scelta (nella finestra 34 px) |
| `--finestra-stato-altezza` | `var(--app-altezza-comando-piccolo)` | l'altezza minima della riga di stato | la finestra, 34 px |
| `--finestra-stato-corpo` | `var(--corpo-6)` (15 px) | il nome dello stato | scelta (nella finestra 16 px) |
| `--finestra-detto-corpo` | `var(--corpo-4)` (13 px) | ciò che lo stato spiega | scelta (nella finestra 15 px), perché la frase intera stia in una riga |
| `--finestra-scrittura-altezza` | `54px` | la bolla tratteggiata, una riga | scelta (nella finestra 3 righe da 30 px) |
| `--finestra-scrittura-corpo` | `var(--corpo-8)` (17 px) | ciò che si scrive | scelta (nella finestra 30 px) |
| `--finestra-comando-altezza` | `30px` | «Ferma» e «Di'» dentro la bolla | scelta (nella finestra 44 px) |
| `--finestra-comando-corpo` | `var(--corpo-5)` (14 px) | il testo dei comandi | scelta (nella finestra 16 px) |
| `--finestra-nota-corpo` | `var(--app-corpo-nota)` (13 px) | la nota sotto la scrittura, e i tasti Esc e Invio | la finestra |

Il disegno usa anche i token che c'erano già: `--finestra-larghezza-2` (470 px), `--sotto-margine-sopra` (e `-telefono`), `--misura-29`, `--misura-31`,
`--livello-sotto`, `--livello-finestra`, `--durata-sotto`, `--ritardo-sotto`, `--durata-f-campo-f-cursore`, `--curva-a-scatti`, `--f-cursore-margine-inizio`,
`--avvio-piede-larghezza`, `--nota-ricostruzione-margine-telefono`.

## Il distintivo Slint (issue #21, sito 0.3, 26/11/2026)

`componenti/distintivo.css`; l'immagine è ufficiale e non modificata (`terze-parti/slint/LEGGIMI.md`: fonte, impronta, licenza CC-BY-ND-4.0).

| Token | Valore | Ruolo | Fonte |
|---|---|---|---|
| `--distintivo-slint-larghezza` | `212px` | la larghezza dell'immagine (l'SVG di Slint è 212 × 97) | fonte: la dimensione dell'immagine di Slint (212 × 97, un SVG), solo in proporzione |
| `--distintivo-slint-larghezza-telefono` | `170px` | la stessa, al telefono | scelta |
| `--distintivo-slint-spazio` | `var(--spazio-14)` (16 px) | fra l'immagine e la frase | scelta |
| `--distintivo-slint-sopra` | `var(--spazio-18)` (24 px) | dopo l'esito del passo «Scarica» | scelta |
| `--distintivo-slint-testo-larghezza` | `30ch` | la frase accanto all'immagine | scelta |
