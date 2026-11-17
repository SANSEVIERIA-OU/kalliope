# Incarico 2 · Lingue nel design system: progresso e consegna

Ruolo design-direction. Incarico: `design/lavoro/incarichi/2-lingue-aspetto.md`. Nessun commit, nessun push, nessuna finestra.
Ultimo aggiornamento: 17/11/2026. **Stato: finito**, anche la correzione dopo il giudizio (sezione in fondo), salvo «Non verificato» e «Al ruolo di costruzione».
Impronte dei file su cui girano le prove finali: `impronte-finali.txt`.

## Che cosa ho fatto (file)

- `design-system/token.css`: blocco «Le scritture» e blocco «Le lingue» in fondo; le interlinee e le grandezze dei titoli moltiplicano
  un fattore della scrittura (1 in italiano); origini e tratteggi con `--verso`; `--font-testo` con «Lexend esteso».
- `design-system/caratteri/`: `geologica/`, `readex-pro/`, `noto-nastaliq-urdu/`, `noto-sans-devanagari/`, `noto-sans-bengali/` (ognuna con
  `OFL.txt`), `lexend/Lexend-wght-latino-esteso.woff2` e `Lexend-wght-nomi.woff2`, `LEGGIMI.md` (fonti, commit, impronte, byte).
- `design-system/componenti/lingue.css` (nuovo); modifiche a `barra.css`, `pulsanti.css`, `bolla.css`, `riunione.css`, `finestra.css`,
  `strada.css`, `tratti.css`, `filo.css`, `riunione-app.css`, `apertura.css`, `base.css`.
- `design-system/catalogo/catalogo-lingue.js` e `catalogo-lingue.css` (nuovi, area mia del catalogo), due righe in `catalogo/index.html`.
- `design-system/TOKEN.md` («Le scritture e le lingue»), `SISTEMA.md` (un paragrafo), `docs/translating.md` («Typefaces…»).
- `website/index.html` (la scelta nella barra, il link a `lingue.css`, una classe sull'icona del campo), `website/lingue.html` (la pagina della
  scelta, rifatta), `website/lingua.js`, `website/scena.js`, `tools/site.py` (il nome della lingua corrente resta nel suo elemento; senza
  selettore si toglie la voce intera).
- Non toccati: `website/non-ancora/`, `website/cornice.js`, `pagina.css`, `riunione-ferma.css`, `strada-ferma.css`, `versioni.css` (incarico 3a).

## L'idea dentro la direzione 2

Una sola: **la riunione resta la stessa in ogni scrittura**. Ogni scrittura parla con un carattere della stessa famiglia d'aspetto di Lexend
(largo, aperto, a tratto uniforme), con le sue misure di riga; ciò che ha un verso di lettura si gira con la pagina; scegliere la lingua è
scegliere la voce con cui entri nella riunione, e la pagina della scelta è la prima frase che dici.

## 1. Da destra a sinistra: ogni punto di `versi.md`

Tutto passa da `--verso` (o da `:root:dir(rtl)` dove una trasformazione identica cambiava la resa in italiano: lì si applica soltanto da destra
a sinistra, sempre con `--verso`). Visto in `foto/ar/`, `foto/ur/`, `foto/ar-XB/`, `sequenze/arrivo-ar-*`, `sequenze/scorri-ar-*`.

| Punto | Decisione | Perché |
|---|---|---|
| `barra.css` azione che entra (`translateX`) | si specchia (`× --verso`) | entra dal margine finale, che da destra a sinistra è a sinistra |
| `barra.css` menu che scivola per fare posto | si specchia | in `ar-XB` l'azione copriva «Installa»: ora il menu scivola a destra (foto `ar/1440x900-*`) |
| freccia dei collegamenti (maschera `→`) | si specchia (`scaleX(-1)`, solo da destra a sinistra) | punta nel verso della lettura e sta già dopo il testo (flex logico) |
| freccia al passaggio (4 px) | si specchia | si muove nel verso della lettura |
| sguardi di Paola, Luca, Anna (`.guarda`) | si specchiano spostamenti x e rotazioni | «Tu» è all'inizio della griglia: da destra a sinistra in alto a destra |
| barra «Scarico la voce» (`.f-barra i`) | cresce dall'inizio (`--origine-inizio-x`) | è il tempo che passa: Mozilla, Material |
| strada della voce (`.linea`) | cresce dal computer, all'inizio | la voce va dal tuo computer agli altri; al telefono è verticale e non cambia |
| tratteggi `repeating-linear-gradient(90deg)` | l'angolo × `--verso` | la fase parte dall'inizio; lo stesso token serve `strada-ferma.css` (3a), che si specchia da sé |
| origine della bolla del primo schermo | angolo d'inizio, e il volo (scena.js) parte dal bordo d'inizio del campo | dove nel campo comincia la frase |
| origini di bolla del filo, bolla della chiusura, messaggi (`30px/40px 100%`) | vicino alla coda, dall'inizio (token con `--verso`) | crescono dalla coda |
| origine della scheda dell'ascolto (`ascolto.css:12`) | **non cambiata** | la scheda nasce dalla pillola con un passaggio rettangolo su rettangolo calcolato (`morph`): è giusto nei due versi |
| finestre che entrano (`tratti.css:186`, `riunione-app.css:72`) | dall'angolo d'inizio e da quello di fine | stanno all'inizio e alla fine della scena |
| `clip-path` simmetrici, barre della pausa, cerchio che gira, barre centrate | non si specchiano | simmetrici, o un caricamento |
| luci (`.luce`, `.luce-voce`, le `.luce-tratto`) | `inset-inline-start` + `translate(calc(-50% × --verso), -50%)` | la luce sta dietro la riunione, che da destra a sinistra è a sinistra |
| coda della bolla (svg) | si specchia, solo da destra a sinistra | punta verso «Tu» |
| icona «Scrivi la frase» della strada | si specchia, solo da destra a sinistra | un campo con il testo all'inizio e il cursore che lo segue |
| altre icone della strada, figure di Paola, Luca, Anna | non si specchiano | simmetriche, o persone (un volto non ha un verso di lettura: scelta progettuale) |
| triangolo ▶ dei comandi di riproduzione | non si specchia | Mozilla, Material: comandi audio e video |
| `scena.js` misure di onde e bersagli, `morph`, centri della strada | non cambiano | sono posizioni vere, giuste nei due versi |
| `scena.js:431` `p.geo.destra` | lasciato | codice che non si usa |
| `scena.js` testo che scorre nel campo | `× verso()` | da destra a sinistra il testo cresce a sinistra e scorre a destra |

## 2. Una tipografia per scrittura

Scelti **guardandoli resi nella home vera di ogni lingua** (`foto/caratteri-provati/`: greco e bulgaro con 7 candidati, arabo con 3, urdu con 3,
hindi e bengali con 2, cinese 2), poi fattori di grandezza e di riga regolati guardando le foto.

| Lingue | Carattere | Fonte e licenza | Byte (woff2) | Perché |
|---|---|---|---|---|
| it e lingue latine | Lexend (com'era) | OFL | 37 644 | — |
| cs sk pl hu lt lv ro hr sl mt et | Lexend, latino esteso (famiglia «Lexend esteso») | OFL, dal `Lexend-wght.ttf` già nel repository | 37 112 | **il file «latino» non aveva č š ł ő ų ș…**: queste lingue cadevano sul carattere di sistema (trovato nella pagina con 30 lingue) |
| el, bg | Geologica | google/fonts `ofl/geologica`, OFL | 21 984 | la più vicina a Lexend nella resa: larga, geometrica, aperture grandi (DESCRIPTION: «wide stance, generous spacing, large apertures»), il nero del titolo uguale; ha le forme bulgare (`locl BGR`), che Noto Sans non ha. Noto Sans, Commissioner, Manrope, Sofia Sans, Comfortaa, Didact provati e scartati guardando (più stretti, più freddi o troppo leggeri) |
| ar | Readex Pro | google/fonts `ofl/readexpro`, OFL | 21 984 | «the world-script expansion of the font Lexend» (README dell'autore): stessi autori, stesso metodo, stesse misure verticali. Noto Sans Arabic e Noto Naskh provati: più tradizionali, meno della famiglia |
| ur | Noto Nastaliq Urdu | google/fonts, OFL | 234 220 | l'urdu si legge in nastaliq (alreq); Readex Pro non ha le lettere urdu (manca anche ک ی گ پ); Noto Sans Arabic e Naskh provati: leggibili ma «arabi» per chi legge urdu. Il nastaliq chiede titoli più piccoli (0,72) e righe molto più alte |
| hi | Noto Sans Devanagari | google/fonts, OFL | 118 276 | aperto, a tratto uniforme come Lexend; Anek Devanagari provato: più stretto e pesante |
| bn | Noto Sans Bengali | google/fonts, OFL | 101 724 | come per l'hindi; Anek Bangla provato: più compatto |
| zh | **carattere di sistema** (`--font-cinese`: PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, WenQuanYi Micro Hei) | — | 0 | Noto Sans SC ridotto ai 3 755 caratteri più comuni (GB 2312, 1° livello) pesa 1 086 548 byte; ogni sistema ha un cinese senza grazie della stessa famiglia (Noto Sans SC è Source Han Sans = Noto Sans CJK SC). A vista, su questa macchina, sistema e Noto Sans SC sono uguali |

- **Nomi delle lingue**: file con le sole lettere dei nomi (24 112 byte in tutto: Lexend esteso 3 788, Geologica 4 828, Readex 6 056, Nastaliq
  2 104, Devanagari 5 168, Bengali 2 168), così l'elenco in una pagina italiana non scarica gli alfabeti interi.
- **Una pagina italiana non scarica un byte in più**: con l'elenco delle lingue chiuso, `Lexend-wght-latino.woff2` e `DejaVuSans-latino.woff2`
  come prima (misurato con `performance.getEntriesByType`); i file dei nomi arrivano solo se si mostrano quei nomi (il piede, la scelta aperta).
- **Misure per scrittura** (token, `:lang()`): titoli e righe — arabo 1 / 1,3 / 1,15; urdu 0,72 / 1,75 / 1,6; hindi e bengali 1 / 1,25 / 1,12;
  cinese 1 / 1,1 / 1,1 (grandezza dei titoli / interlinea dei titoli / interlinea del testo). Spaziatura fra le lettere 0 per arabo, urdu,
  devanagari, bengali, cinese (CSS Text 4 §8.2.1; il titolo aveva −0,018 em). Il marchio resta latino e tiene la sua.
- **Corsivo**: il sistema non ne usa (nessun `em`, nessun `font-style`); Lexend non ha corsivo. Non ho aggiunto regole per un corsivo che non c'è:
  quando un testo lo chiederà, per arabo, urdu, devanagari, bengali e cinese va resa l'enfasi con il peso, non con l'obliquo (da decidere allora).
- **`[lang]` in `base.css`**: un elemento con una lingua sua (una citazione, un nome) rilegge la pila della sua scrittura.
- Un difetto trovato e corretto: facce della stessa famiglia con intervalli di peso diversi → il browser ne usa un gruppo solo e le altre
  scritture cadono sul sistema (ora tutte `100 900`).

## 3. Il testo più lungo (en-XA, de, fi)

| Difetto (`versi.md`) | Correzione | Dove si vede |
|---|---|---|
| a 1440 con l'azione in barra il menu finiva sul marchio | `scena.js` misura: se il menu che scivola arriverebbe sul marchio, la barra è «stretta» e la parola del marchio sparisce intera prima che l'azione entri, come al telefono (P11) | `foto/en-XA/1440x900-*` |
| «Tu · microfono «Kalliope»» usciva dalla tessera | le etichette vanno a capo dentro il riquadro, in righe pari (`max-width`, `text-wrap: balance`) | `foto/en-XA/390x844-riposo.jpg` |
| le unità che non vanno a capo uscivano dalla bolla | `.unita` è un blocco in linea: resta in un pezzo finché ci sta, va a capo dentro di sé solo se è più larga della riga | — (in italiano invariato) |
| righe del titolo che lasciano una parola sola («anderen», «muut») | `h1 .riga { text-wrap: balance }` | `foto/de/1440x900-riposo.jpg` |
| al telefono l'azione lunga in barra copriva il disegno del marchio («Herunterladen und installieren») | lo spazio fra marchio e «Menu» si misura; se non ci sta va a capo in due righe pari (classe `azione-a-capo`, solo allora) | `foto/de/390x844-*` |
| nome del marchio tagliato senza puntini | non toccato: con il 40% ci sta; il nome è «Kalliope» in ogni traduzione di prova | — |

## 4. La scelta della lingua

- **Pagina della scelta** (`website/lingue.html`, `/`): la bolla con le 30 lingue nasce dal tuo riquadro; i nomi si accendono uno dopo l'altro
  (34 ms, il passo della scrittura del primo schermo), la lingua del browser per prima e accesa in bordeaux; le barre di «Tu» si muovono
  finché l'ultimo nome è acceso, poi tutto si ferma (`sequenze/scelta-arrivo-*`). Ogni nome è un collegamento con `lang`, `hreflang`, niente
  bandiere; senza script tutto funziona (collegamenti, nell'ordine dei codici); la scelta si ricorda dopo un clic (`lingua.js`, com'era);
  nessuno spostamento indovinato. Nessun testo da tradurre.
- **La scelta nella barra** (`<details class="lingua-scelta">`): l'ultima voce del menu è il nome della lingua di adesso con la freccia girata
  in giù; apre un pannello di vetro scuro con i nomi in tre colonne (pulsanti-voce, la lingua di adesso piena). Al telefono sta nel menu
  aperto, in due colonne. Esc, clic fuori, fuoco che esce lo chiudono. Porta alla stessa pagina nell'altra lingua (la costruzione scrive gli
  indirizzi). Funziona senza script.
- **Nel piede**: l'elenco di sempre, con i nomi nella loro scrittura.
- **Componente**: `componenti/lingue.css`, con i suoi token («Le lingue» in `token.css`); nel catalogo: «Le scritture», «La scelta della lingua»,
  «Lo specchio» (`catalogo/catalogo-lingue.js`, foto in `foto/catalogo/`).

## Un difetto di prima, trovato e corretto

Al telefono e sul tablet, aprendo il menu dopo aver scorso (con l'azione in barra), il menu restava spostato del posto dell'azione fuori dallo
schermo e la barra compatta lo ritagliava: **non si vedeva** (anche a `341a841`). Ora il menu aperto non scivola e la barra non ritaglia
mentre un pannello è aperto (`lingue.css`).

## Prove (numeri)

- **Italiano identico a `341a841`** (costruzioni con `--no-selector`, «riduci movimento», per schermata la coppia più vicina, sui file finali):
  Chromium 1440×900, 390×844, 820×1180, 1366×640 + menu, ascolto ed errore a 390: **30/30 a 0 pixel** (3 foto per parte); Firefox 1440 e 390:
  **13/13**; WebKit 1440 e 390: **13/13** (2 foto per parte). Strada fatta: tre differenze trovate e tolte alla causa — un mio token con il nome
  di uno già esistente (`--scelta-spazio-interno`, rompeva la barra del microfono); la seconda faccia di «Lexend» per il latino esteso (42
  pixel, scarto 3: ora famiglia a parte, senza i segni combinanti); la freccia e l'azione in barra con una trasformazione identica in WebKit
  (19 e 54 pixel: ora la trasformazione c'è solo dove cambia qualcosa).
- **Con il selettore** (la costruzione di tutti i giorni) le differenze volute: nella barra «Italiano ↓» (la freccia sposta le voci di circa
  18 px), nel piede la lingua di adesso con la sottolineatura più spessa, il menu del telefono con la scelta che si apre.
- **Lettere** (`alfabeti-qa.mjs`, `prove/alfabeti-tutte.sh`): 12 pagine (it de fi el bg ar ur hi bn zh cs pl), ognuna con le lettere di 12
  lingue, e la pagina italiana con le lettere di **tutte le 30**: ogni lettera disegnata da un carattere del sistema, tranne il cinese,
  disegnato da «Noto Sans CJK SC», una voce di `--font-cinese` (scelta). All'inizio (prima dei caratteri): hindi e bengali da Unifont, arabo
  e urdu da DejaVu, greco e cirillico da Liberation, il latino esteso dal cinese.
- **Foto**: 11 lingue (ar ur hi bn zh el bg de fi en-XA ar-XB) a 1440×900 e 390×844, a riposo, ogni schermata dello scorrimento, ascolto aperto,
  menu aperto al telefono: 187 foto, **0 errori** di console o richieste fallite. In `foto/<lingua>/` i fogli e le foto a riposo, ascolto, menu.
- **Sequenze** (`sequenza.mjs`): arrivo e scorrimento in arabo e in hindi a 1440×900 e 390×844, arrivo della pagina della scelta:
  `sequenze/arrivo-{ar,hi}-*`, `scorri-{ar,hi}-*`, `scelta-arrivo-*` (fogli, fotogrammi, video).
- `controlla-sorgenti.mjs` (da `design-system/`): **verde**, 23 fogli; `css_logico.py`: **verde**, 24 fogli; `translations.py extract --check`
  e `check`: verdi (153 messaggi: anche quelli della «non ancora» dell'incarico 3a); `test_translations.py`: **49 prove, OK**.
- `/it/non-ancora/` dopo i miei cambiamenti ai componenti condivisi: 1440 e 390, a riposo, scorsa, in fondo, 0 errori, intera a vista.

## Scelte senza fonte (progettuali)

Geologica per greco e cirillico (scelta guardando, nessun riferimento la usa); i fattori di grandezza e di riga per scrittura; le forme bulgare;
il cinese di sistema; la finestra ricostruita con DejaVu per il latino e il carattere della scrittura per il resto (nessun DejaVu per scrittura
da scaricare); la pagina della scelta come bolla che nasce dal riquadro (dentro D2: la bolla dalla coda, le parole che si accendono, il riquadro
di «Tu»), il passo di 34 ms, le barre che si muovono, la luce dietro la bolla; il pannello di vetro della barra in tre colonne; la barra «stretta»
che toglie la parola del marchio (estende P11); le etichette che vanno a capo; le unità che vanno a capo solo se più larghe della riga; i volti
che non si specchiano.

## Non verificato

- Le lingue diverse dall'italiano solo in Chromium (non Firefox né WebKit), solo a 1440×900 e 390×844 (non 820, 1366, le larghezze di mezzo,
  il telefono girato, il testo al 200%); il cinese con i caratteri di Windows e macOS (qui solo Noto Sans CJK SC); il nastaliq su un dispositivo
  lento; il selettore con la tastiera e con un lettore di schermo (il `<details>` è nativo, non provato a mano); la pagina della scelta senza
  script fotografata (funziona per costruzione: collegamenti).
- Le traduzioni di prova non sono rivedute da chi parla la lingua; in arabo ho usato le cifre arabe orientali, mentre le date della costruzione
  (CLDR 49) escono in cifre latine: lo decide chi traduce.
- I file `.webm` e i fotogrammi (20 MB in `sequenze/`) e le foto (13 MB in `foto/`): da decidere se si committano.

## Al ruolo di costruzione

- Stati, errori e ripresa della scelta nella barra e della pagina della scelta; tastiera (ordine, Esc, ritorno del fuoco) e lettori di schermo;
  senza script; movimento ridotto della pagina della scelta (c'è: tutto al suo posto) da registrare.
- Le larghezze di mezzo (761–1180) e le soglie per le lingue nuove, Firefox e WebKit per arabo, urdu, hindi, bengali, cinese.
- Il precaricamento del carattere della scrittura nelle pagine della sua lingua (`<link rel="preload">` scritto dalla costruzione per lingua): oggi
  arriva con `font-display: swap`, senza precarico.
- Con una lingua sola pubblicata (oggi) la scelta nella barra mostra un nome solo: decidere se nasconderla finché le lingue sono una.
- La barra della pagina «non ancora» (incarico 3a) ha ancora la voce di prima («Italiano» che porta al piede): può prendere la scelta nuova
  (`<details class="lingua-scelta">` come nella home, più il link a `lingue.css`).
- Il catalogo legge soltanto il primo blocco `:root` di `token.css`: i token dei blocchi aggiunti (3a e i miei) non compaiono nella sua tabella.

## Per la ripresa

Costruire il sito di prova: `prove/costruisci.sh <corsa> [--pseudo]` (9 lingue di prova) o `prove/costruisci30.sh <corsa>` (30 lingue). Foto:
`node prove/foto-lingue.mjs <sito> <uscita> --lingue ar,hi --porta 8804`; scelta e barra: `node prove/foto-scelta.mjs <sito> <uscita>`;
caratteri: `node prove/prova-caratteri.mjs <sito> <uscita> <lingua> "<nome>=<file.ttf>"`; lettere: `prove/alfabeti-tutte.sh <sito> <uscita>`;
sottoinsiemi: `python3 prove/sottoinsiemi.py <file scaricati> design-system/caratteri`. Italiano identico: `foto-home.mjs` e `confronta-serie.mjs`
dell'incarico 1, sulle costruzioni `--no-selector` di `341a841` e di adesso (porta 8808). Porte: 8803–8809 (la 8801 è occupata da un processo non mio).

## Ultimo comando

`node design/lavoro/1-lingue-sito/prove/confronta-serie.mjs … fin2-webkit-1,fin2-webkit-2` (13/13), poi le foto del selettore in italiano
(`/tmp/lavoro-2-sel-{prima,dopo}-*.png`). In `prova-lingue/` resta un `__pycache__` di Python (dall'import dei testi): non serve, si può ignorare.

## Correzione dopo il giudizio (incarico 2-c, 17/11/2026)

Incarico: `design/lavoro/incarichi/2-lingue-correzione.md`; giudizio: `giudizio/GIUDIZIO.md`. Copia di partenza: commit `8c7fae1`
(estratta in `/tmp/lavoro-2-c-prima`); per «non ancora» `b9ba336`. **Stato: finito**, salvo «Non verificato» qui sotto. Le foto prima e
dopo sono in `foto/correzione/` (JPEG, fuori da git per la regola di `.gitignore`); le impronte dei file finali in `impronte-correzione.txt`.
Le prove finali girano sulle costruzioni `/tmp/lavoro-2-sito-cfin6` (9 lingue + pseudo), `/tmp/lavoro-2-sito30-cfin4` (30 lingue: la
scelta e i byte, che non dipendono da ciò che è cambiato dopo), `/tmp/lavoro-2-c-fin6-ns` (`--no-selector`), contro `/tmp/lavoro-2-c-prima-ns` (8c7fae1) e `/tmp/lavoro-2-c-b9ba-ns` (b9ba336).

### Punto per punto

- **B1 (bloccante), la barra nelle lingue lunghe.** Causa: la barra decideva solo «stretta» (via la parola del marchio), e la misura stava
  in `scena.js`, quindi le pagine interne non l'avevano. Adesso una misura sola, in `website/componenti.js` (nuovo, caricato dalla home e
  da `website/non-ancora/index.html`, elencato in `design-system/metodo.config.mjs`): dalle larghezze (non dalle posizioni) calcola se le
  voci ci stanno con il marchio intero, senza la parola, o no; se no la barra è **«raccolta»**: la forma del tablet, «Menu» al posto delle
  voci, l'azione fra il marchio e «Menu» (`design-system/componenti/barra.css`, blocco `.barra.raccolta`; pannello aperto in
  `lingue.css`). Le voci non vanno più a capo (`nowrap`). Prova `prove/barra-larghezze.mjs`: dopo la rotella vera, a ogni larghezza
  761–1440 ogni 10 px, nessuna voce fuori dallo schermo, sopra il marchio o sotto l'azione, nessuna voce su due righe, l'azione non sul
  marchio né su «Menu». **Home, 12 lingue (it de fi el bg ar ur hi bn zh en-XA ar-XB) × 69 larghezze: 0 rotte su 828**; prima (8c7fae1, a
  passo 20) 71 rotte su 420. **«Non ancora», en-XA e it × 69: 0 rotte su 138**; prima (b9ba336, en-XA a passo 20) 21 rotte su 35. Foto
  `foto/correzione/B1-de-1024.jpg`, `B1-bg-1100.jpg`, `B1-en-XA-1440.jpg`, `B1-non-ancora-en-XA-1366.jpg`; il menu aperto nella barra
  raccolta l'ho guardato a 1024 (de, home; en-XA, «non ancora»): pannello sotto «Menu», nessuna voce tagliata.
  **Sotto 761 px**, con la stessa prova (320–760 ogni 20 px), c'erano due difetti già in 8c7fae1 (en-XA 2 e de 1 su 23 larghezze): a
  441–460 px l'azione copriva la parola del marchio quando la pagina scorsa si allargava oltre 440 px (la misura leggeva l'opacità della
  parola mentre riappariva: ora decide dagli stati, telefono stretto o barra «stretta»), e a 320 px in en-XA copriva «Menu» (misurato in
  cima, dove la parola lunga lo stringeva: ora si misura intero). **12 lingue × 23 larghezze: 0 rotte su 276.** Il telefono che gira con
  la pagina scorsa (390×844 ↔ 844×390, 8 lingue, `prove/barra-gira.mjs`): 0 rotte su 16. Foto `foto/correzione/B1-de-450-da-430.jpg`,
  `B1-en-XA-320.jpg`.
- **Pillole lunghe (aggiornamento di chi coordina).** `.pillola` resta su una riga com'era; `componenti.js` misura il testo e, se non ci
  sta nella larghezza della pillola, la segna `a-capo`: va a capo dentro il fondo, in righe pari (`pulsanti.css`). Non una regola sempre
  accesa: in WebKit perfino `text-wrap: balance` su una riga sola spostava le lettere, e l'italiano non sarebbe rimasto identico. L'azione
  della barra ha già la sua misura (`azione-a-capo`) ed è esclusa. En-XA a 390 in «non ancora»: il comando principale e «Copia
  l'indirizzo…» stanno nel loro fondo, su due righe (`foto/correzione/pillole-non-ancora-en-XA-390-comandi.jpg`, `…-copia.jpg`); a 390,
  1366×640 e 1024×768 nessuna pillola né voce esce, nessun errore.
- **I1, la versione al contrario.** Causa alla radice nella costruzione: in una pagina da destra a sinistra ogni pezzo di lettere latine,
  cifre e punti (`0.1-rc.1`, `Linux`, `x86_64`, `Kalliope 0.1`, «Enter») è un pezzo con il suo verso dentro un testo arabo. `tools/site.py`
  (`isola_latino`, chiamata in `costruisci_pagina` solo per le lingue `rtl` vere) lo chiude fra LRI e PDI (U+2066…U+2069), nel testo e
  negli attributi tradotti (`data-t-*`), senza toccare segnaposti, entità, script, stili, attributi non tradotti; due volte è come una.
  Nella home: 41 isolamenti in arabo, 43 in urdu, 0 in italiano e in ar-XB. Prove: «0.1-rc.1» si legge giusto in ar a 1440 e in ur a 390
  (`foto/correzione/I1-ar-1440-stato.jpg`, `I1-ur-390-stato.jpg`); le parentesi di «(x86_64 مع PipeWire)» e i due punti di «Linux:»
  misurati al loro posto; virgolette «Kalliope» in arabo, ”Kalliope“ in urdu. Tre prove nuove in `tools/test_translations.py`
  (`DaDestraASinistra`). Documentato in `docs/translating.md` (i traduttori non devono aggiungere nulla) e in `TOKEN.md`.
- **I2, «Tu · microfono "Kalliope"» sulle barre.** `componenti.js` misura l'etichetta in una riga (con un Range: `scrollWidth` non vede
  ciò che esce a sinistra da destra a sinistra); se non ci sta la tessera è `nome-corto` e resta «Tu» (`riunione.css`). Ar a 390: «أنت»;
  el: «Εσύ»; en-XA: «[Ţû·» (il punto è della pseudo-lingua); ur a 390 ci sta (una riga) e resta intera; a 1440 intere ovunque.
  `foto/correzione/I2-ar-390-tu.jpg`, `I2-el-390-tu.jpg`, `I2-en-XA-390-tu.jpg`.
- **I3, la pagina della scelta.** Una pagina intera, la stessa idea: il nome del prodotto in alto, poi la bolla con i nomi delle lingue,
  la coda verso la tua tessera, e sotto la fila della riunione (Tu, Paola, Luca, Anna, le figure della home). Arrivo: le tessere entrano
  come nella home, la bolla nasce dalla tua a 760 ms, i nomi si accendono da 1 200 ms (la lingua del browser per prima), le barre di «Tu»
  parlano. File: `website/lingue.html`, `website/lingua.js` (lo sguardo delle persone verso «Tu»), `design-system/componenti/lingue.css`,
  token in `token.css` (elenco in `TOKEN.md`). Prova `prove/foto-scelta2.mjs` a 1440×900, 1366×640, 390×844, 844×390, con e senza script:
  nessuno scorrimento, titolo, bolla e fila dentro lo schermo (1440: 177–241, 275–559, 583–755; 1366×640: 104–168, 202–486, 510–610;
  390: 83–116, 150–672, 696–774; 844×390: 84–117, 125–285, 309–369), nessun errore. Sequenza d'arrivo
  `sequenze/scelta-arrivo-corretta-{1440x900,390x844}-foglio.jpg` e `.webm`. Prima e dopo: `foto/correzione/I3-scelta-1440.jpg`,
  `I3-scelta-390.jpg` (prima: foto del giudizio, in arabo; dopo: lingua del browser italiana).
- **I4, byte della pagina italiana.** Causa: il piede (con i nomi delle lingue) era impaginato subito. Ora `.piede .lingue` ha
  `content-visibility: auto` con un'altezza stimata (`--lingue-piede-altezza-stimata`); in più la famiglia dei nomi non ha più una faccia
  latina sua (scaricava Lexend una seconda volta: le pile cominciano da «Lexend»). Misura `prove/byte-italiano.mjs`, con il selettore e 30
  lingue pubblicate (i cataloghi di prova): **a riposo 2 file, 59 480 byte** (Lexend latino, DejaVu latino) a 1440×900 e a 390×844;
  prima 9 file, 121 236 byte. In fondo alla pagina, quando i nomi si vedono, +6 file dei nomi, 24 112 byte.
- **M1, titoli.** Al telefono la terza e la quarta riga sono blocchi con `balance` (prima righe in linea con `\A`): «Du schreibst, / die
  anderen», non «… die / anderen»; le prime due restano di seguito (`apertura.css`). L'arrivo resta com'era (righe che si accendono senza
  spostarsi: `--sale-da-sposta-y: 0` sulle due righe): fotogrammi fermi a 10 istanti, prima e dopo, 0 diversi a 390 e a 1440 (e in «non
  ancora» a 390). A 1440 de ed el restano su cinque righe: la terza si divide in due parti pari; dipende dal testo, che sarà riscritto.
  `foto/correzione/M1-de-390-titolo.jpg`.
- **M2.** La freccia del collegamento segue l'ultima parola quando il testo va a capo (`componenti.js`, `.collegamento.a-capo` in
  `pulsanti.css`). `foto/correzione/M2-el-390-collegamento.jpg`.
- **M3.** Un nome di lingua dentro la pagina urdu torna ai file dei nomi (`[lang]:not(:lang(ur))` in `token.css`): «العربية» in Readex
  Pro anche nella pagina urdu. `foto/correzione/M3-ur-390-scelta.jpg`.
- **M4, non corretto: decisione di direzione.** Noto Nastaliq Urdu arriva fino a 700, che è il peso che usiamo: più massa vuol dire solo
  più grandezza. Provato: all'85% lo stato scende da 877 a 935 px a 1440×900 (esce dal primo schermo); all'85% con l'interlinea stretta a
  1,5 (lo stesso spazio di adesso) le righe del nastaliq si toccano. Resta al 72% con interlinea 1,75. La didascalia della scena (903–933
  px in urdu a 1440×900) è l'ultima riga della colonna del testo; in italiano a 1366×640 è sotto il primo schermo anche lei (642–680).
  Foto `foto/correzione/M4-ur-1440-titolo-prove.jpg`.
- **M5.** Arabo e urdu: linea dei collegamenti `from-font` (`--sottolineatura-posizione`, `base.css`), niente scalino.
  `foto/correzione/M5-ar-390-collegamento.jpg`.
- **M6.** Cinese: titoli con `"halt"` (`--titolo-caratteristiche`, `apertura.css`, `tratti.css`): virgola e punto pieni a metà larghezza.
  `text-spacing-trim` provato, senza effetto in Chromium su questo carattere. `foto/correzione/M6-zh-390-titolo.jpg`.
- **M7.** La pila dell'urdu nomina Noto Nastaliq Urdu, Urdu Typesetting, Jameel Noori Nastaleeq, Noto Naskh Arabic e Segoe UI prima del
  ripiego generico. **Non verificabile qui**: questa macchina non ha nessun carattere urdu o arabo di sistema (`fc-list` vuoto), quindi
  senza i file la resa è la stessa di prima (`foto/correzione/M7-ur-1440-senza-caratteri.jpg`). Da provare su Windows, macOS, Android.
- **M8.** L'esempio dello specchio nel catalogo è in arabo, con la parte latina isolata come nella costruzione (LRI…PDI). Prima l'avevo
  scritto con `<bdi>`: dentro un collegamento `inline-flex` l'elemento spezzava il testo in tre pezzi con tre linee; corretto
  (`design-system/catalogo/catalogo-lingue.js`). `foto/correzione/M8-catalogo-specchio.jpg`. Catalogo: 31 sezioni, nessun errore.

### Prove sui file finali (numeri)

- **Italiano identico a `8c7fae1`** (`--no-selector`, movimento ridotto, `foto-home.mjs` e `confronta-serie.mjs` dell'incarico 1):
  Chromium 30/30 (1440×900, 390×844, 820×1180, 1366×640 con lo scorrimento, più menu, ascolto ed errore a 390; tre serie per parte),
  Firefox 13/13 e WebKit 13/13 (1440 e 390). Rumore: 1 schermata su 30 diversa già fra le serie di prima (Chromium).
- **«Non ancora» in italiano identica a `b9ba336`**: Chromium 21/21, Firefox 11/11, WebKit 11/11.
- **Barra**: vedi B1 (sul computer 0/828 nella home e 0/138 in «non ancora»; al telefono e sul tablet 0/276; girando 0/16).
- **Arabo e urdu** a 1440 e 390: versione giusta, tessera giusta, nessun errore.
- **Scelta**: vedi I3. **Byte**: vedi I4.
- `controlla-sorgenti.mjs`: 23 fogli, valori solo nei token. `css_logico.py`: ok, 24 fogli. `translations.py extract --check`: 153 voci,
  cataloghi aggiornati; `check`: it 153/153. `test_translations.py`: 52 prove, OK.

### Non verificato

- M7 su un sistema con un carattere urdu (Windows, macOS, Android).
- Le pagine interne oltre a «non ancora» (hanno ancora la barra vecchia, `website/stile/`): non caricano `componenti.js`.
- A 320 px in en-XA l'azione va su tre righe e riempie quasi tutta l'altezza della barra: non copre nulla, ma è stretta. Succede solo
  nella pseudo-lingua, che traduce anche il nome «Kalliope» e allunga tutto; le lingue vere a 320 stanno su una o due righe.
- Le pillole in tutte le lingue a ogni larghezza: misurate in «non ancora» en-XA (390, 1024, 1366) e viste nella home.
- Lettori di schermo con gli isolamenti LRI/PDI (sono caratteri invisibili e senza voce per specifica; non ascoltato).
- `design/STATO.md` risulta modificato nella copia di lavoro: non l'ho toccato io.

### Ultimo comando della correzione

`node prove/foto-correzione.mjs /tmp/lavoro-2-sito-c-prima /tmp/lavoro-2-sito-cfin6 /tmp/lavoro-2-c-b9ba-sito /tmp/lavoro-2-foto-corr6`
(19 coppie, nessun errore), poi i fogli in `foto/correzione/`; prima ancora `confronta-serie.mjs` sulle costruzioni `fin6` (tutto identico).
