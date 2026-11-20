# P-3 · Gli strumenti del sito all'ultima versione · progresso

Incarico: `design/lavoro/incarichi/P-3-strumenti-del-sito.md`. Data: 20/11/2026.

## Unità

| # | Unità | Stato |
|---|---|---|
| 0 | Lettura e verifica delle versioni di oggi | fatta |
| 1 | Playwright 1.65.1 in `/workspace/kalliope-playwright/` con i tre motori | fatta (venv Python con fontTools 4.68.0 e brotli 1.2.1 accanto) |
| 2 | I tre motori partono dopo un riavvio | fatta: `motori-test.mjs` 8 controprove passate (Firefox senza uscita audio, come prima) |
| 3 | Prove di sempre con la versione nuova (`controlla-sorgenti.mjs`) | fatta: 31 fogli in ordine, uscita identica alla 1.60 |
| 4 | Foto prima e dopo (home, stato, non ancora; 1440 e 390; tre motori) e confronto | fatta (sotto, «Unità 4») |
| 5 | fontTools 4.68.0 e brotli 1.2.1: sottoinsiemi rifatti e confronto | fatta: 10 file nuovi **tenuti** (sotto, «Unità 5, parte 2») |
| 6 | Documentazione | fatta: `design-system/caratteri/LEGGIMI.md`; `docs/releasing.md` non dice quale Playwright usare, quindi non cambia (sotto) |

## Versioni verificate oggi (20/11/2026)

| Dipendenza | Prima | Ultima | Fonte |
|---|---|---|---|
| Playwright | 1.60.0 (`/workspace/test-playwright`) | 1.65.1 | `npm view playwright`: `latest` = 1.65.1, pubblicata il 13/11/2026 (`next` è 1.66.0-alpha, non conta) |
| fontTools | 4.63.0 | 4.68.0 | `pypi.org/pypi/fonttools/json`: 4.68.0 del 27/10/2026 |
| brotli | 1.2.0 | 1.2.1 | `pypi.org/pypi/brotli/json`: 1.2.1 del 22/10/2026 |

## Note di lavoro

### Unità 1–3 (20/11)

- `/workspace/kalliope-playwright/`: `package.json` con `"playwright": "1.65.1"` esatta, `package-lock.json`, `env.sh`,
  `requirements.txt` e `venv/` (fontTools 4.68.0, brotli 1.2.1, Pillow 13.0.0, NumPy 2.5.5: le ultime di oggi).
- I browser stanno **dentro la cartella** (`browsers/`, via `PLAYWRIGHT_BROWSERS_PATH`) e non nella cache condivisa
  `~/.cache/ms-playwright`: un `playwright install` di un altro progetto toglie i browser che non gli servono, e quella cache
  è di tutti. Versioni: Chromium 159.0.8154.6 (rev. 1255), Firefox 159.0 (1572), WebKit 27.2 (2388); la 1.60.0 aveva
  148.0.7778.96, 150.0.2 e 26.4. **I browser cambiano di 9–11 versioni maggiori**: sarà la parte principale di ogni differenza
  nelle foto.
- Le librerie che Firefox e WebKit non trovano su questa macchina (Arch) sono preparate da `prepara-motori.sh` della skill in
  `motori/` della stessa cartella (`METODO_MOTORI`, non più `/tmp/metodo-motori`): restano dopo un riavvio. Provato: Firefox e
  WebKit lanciati con l'API di Playwright e basta non partono (`Failed to launch the browser process`; `Target … has been closed`); con `avvia()` della skill e `env.sh`, sì.

### Unità 4 · Foto con la 1.60.0 e con la 1.65.1 (20/11)

Strumenti in `strumenti/`: `costruisci.sh` (sito di prova in dieci lingue, it più le nove di `2-lingue-aspetto/prova-lingue/`; non
rigenera i cataloghi, che riscriverebbe file del repository, e `translations.py check --complete` li trova al passo: 260/260 voci
in ognuna), `foto-motori.mjs` (foto a pagina intera, un browser alla volta, «riduci movimento», scala 1, scorrimento fino in fondo e
ritorno prima della foto), `corsa.sh vecchio|nuovo` (sceglie Playwright e motori) e `confronta.py` (pixel per pixel). Sito: quello di
oggi, `rilasci.json` salvato in `esiti/` (stessa risposta dell'API per tutte le corse).

- 18 foto per corsa (home, «stato», «non ancora» × 1440×900 e 390×844 × Chromium, Firefox, WebKit), in italiano, senza errori di pagina
  né richieste fallite, 7 file di caratteri nella home e 6 in «non ancora» (come prima).
- **Il rumore è zero**: due corse uguali della 1.60.0, e due della 1.65.1, danno 18 foto su 18 uguali byte per byte. Ogni
  differenza fra le due versioni è quindi vera.
- **Chromium 148.0.7778.96 → 159.0.8154.6**: 6 foto su 6 uguali byte per byte.
- **Firefox 150.0.2 → 159.0**: 3 foto uguali nei pixel (cambia solo la codifica del PNG: IDAT di 1 498 363 contro 1 451 644 byte nella home,
  l'encoder comprime meglio) e 3 con 4 pixel diversi, di 1 livello su 255 per canale, negli spigoli di un riquadro arrotondato (stessi
  pixel in ogni foto). Nessuna differenza visibile.
- **WebKit 26.4 → 27.2**: «stato» (2 foto) uguale byte per byte; home e «non ancora» (4 foto) cambiano da 420 a 946 pixel (0,014–0,023%,
  scarto massimo 57/255 in home a 1440, 14–18 nelle altre) **tutti dentro un riquadro di circa 110×60 px**: la miniatura della
  riunione con le tre figure dell'ultima tappa della catena (`span.mini` di `.nodo-altri`, `svg.figura`: viso, occhi, bocca) e la sua
  cornice tratteggiata. WebKit 27.2 rasterizza in modo un po' diverso i tratti minuscoli (i trattini della cornice cadono di mezzo
  pixel altrove, la bocca da un sorriso di 1 px diventa una riga): è il disegno del motore, non della pagina né di Playwright (il sito,
  le impostazioni e il banco sono gli stessi, e il rumore fra due corse uguali è zero). Ritagli ingranditi 4 volte prima/dopo in
  `foto/playwright/webkit-*-miniature-1-60-poi-1-65.png`; le immagini delle differenze in `foto/playwright/differenze/`; le foto
  nuove, ridotte, dei tre motori affiancati in `foto/playwright/nuovo-*.jpg` (guardate: nessuna pagina rotta, stessa impaginazione nei tre).
- Esito completo in `esiti/playwright-confronto.txt`. Le foto intere (21 MB a corsa) restano in `/tmp/p3-foto/` e si rifanno in
  1,5 minuti: `strumenti/corsa.sh vecchio|nuovo /tmp/p3-sito-base USCITA`.

### Unità 5 · fontTools 4.68.0 e brotli 1.2.1 (20/11), parte 1: i file

Strumenti in `strumenti/`: `sottoinsiemi-datati.py` (lancia lo script di sempre, `2-lingue-aspetto/prove/sottoinsiemi.py`, intatto, con le
due catene di strumenti), `prova-testo.py` e `prova-testo.mjs` (pagina con le frasi del sito in ogni scrittura, composta con i file di prima e
con quelli di dopo, pesi diversi, confrontata pixel per pixel in ogni motore).

- **Sorgenti**: i cinque file di `github.com/google/fonts` alle commit scritte in `LEGGIMI.md`, riscaricati in
  `/workspace/kalliope-playwright/caratteri-sorgenti/` (fuori dal repository). **I cinque SHA-256 coincidono con quelli scritti**, e i cinque
  `OFL.txt` sono uguali a quelli di `design-system/caratteri/`. Lexend viene dal file già nel repository.
- **Scoperta: la ricetta di `LEGGIMI.md` da sola non rifà gli stessi byte, nemmeno con gli strumenti di prima.** Le cinque famiglie passano da
  `instantiateVariableFont` e da `TTFont.save`, che scrivono nella tavola `head` la data e l'ora della corsa (`modified`, e di conseguenza
  `checkSumAdjustment`): due corse identiche danno file diversi (con 4.63.0 e brotli 1.2.0, alle 01:17 di oggi: i 10 file delle cinque famiglie
  diversi, da 4 a 364 byte). fontTools rispetta `SOURCE_DATE_EPOCH`: con la data scritta nel file di ogni famiglia (17/11/2026, 00:34:17–00:34:38 UTC)
  **gli strumenti di prima (fontTools 4.63.0, brotli 1.2.0) rifanno tutti i 14 file identici byte per byte** a quelli di
  `design-system/caratteri/` (12 rifatti dallo script più Lexend latino e DejaVu, che lo script non tocca e restano). Quindi la ricetta è
  completa, e ogni differenza qui sotto viene dagli strumenti nuovi, non dall'orologio né dai sorgenti.
- **Con fontTools 4.68.0 e brotli 1.2.1, stessa data**: i file di Lexend (latino esteso e nomi) sono **identici byte per byte**; i dieci
  delle cinque famiglie cambiano e sono più piccoli (tranne uno):

  | File | Prima | Dopo | |
  |---|---|---|---|
  | `noto-nastaliq-urdu/NotoNastaliqUrdu-wght.woff2` | 234 220 | 216 232 | −7,7% |
  | `noto-sans-devanagari/NotoSansDevanagari-wght.woff2` | 118 276 | 114 460 | −3,2% |
  | `noto-sans-bengali/NotoSansBengali-wght.woff2` | 101 724 | 100 316 | −1,4% |
  | `readex-pro/ReadexPro-wght.woff2` | 21 984 | 21 740 | −1,1% |
  | `geologica/Geologica-wght.woff2` | 21 984 | 21 936 | −0,2% |
  | `readex-pro/ReadexPro-wght-nomi.woff2` | 6 056 | 5 984 | −1,2% |
  | `noto-sans-devanagari/NotoSansDevanagari-wght-nomi.woff2` | 5 168 | 5 136 | −0,6% |
  | `geologica/Geologica-wght-nomi.woff2` | 4 828 | 4 840 | +0,2% |
  | `noto-sans-bengali/NotoSansBengali-wght-nomi.woff2` | 2 168 | 2 120 | −2,2% |
  | `noto-nastaliq-urdu/NotoNastaliqUrdu-wght-nomi.woff2` | 2 104 | 2 056 | −2,3% |

- **Che cosa cambia dentro** (confronto delle tavole decompresse, fontTools 4.68.0): in tutti e dieci **stesso ordine dei glifi, stessa `cmap`,
  stessi contorni (`glyf`), `gvar`, `fvar`, `hmtx`, `name`, `OS/2`, `post`, `hhea`, `maxp`, `STAT`, `avar`**; cambiano solo i byte di `GSUB`
  e `GPOS` (e `head`, per la data, ma la data è fissata). In otto file il testo decompilato di `GSUB` e `GPOS` è **identico**: cambia solo
  l'impacchettamento binario (per il Nastaliq la `GSUB` decompressa passa da 265 162 a 769 478 byte, ma compressa il file è più piccolo).
  In Geologica (e nei suoi nomi) `GPOS` ha le stesse regole: tolta l'estensione (`LookupType 9`, un involucro che serve solo se gli offset
  non bastano), ogni lookup ha le stesse sottotabelle e lo stesso `ScriptList` e `FeatureList`; la 4.68.0 mette l'involucro in altri
  lookup. Quindi le stesse lettere, le stesse legature, la stessa spaziatura.

### Unità 5, parte 2 · le pagine con i file nuovi (20/11)

- **Sito in dieci lingue** (`strumenti/costruisci.sh`: it più ar, bg, bn, de, el, fi, hi, ur, zh di prova): costruito due volte, con i file di
  prima e con quelli di dopo. Nei due siti **cambiano soltanto i 10 file `.woff2`**: l'HTML è identico (anche i `preload`: la soglia è 40 000 byte e Readex
  e Geologica restano sotto, gli altri sopra, come prima).
- **Foto**: 180 per sito (10 lingue × home, «stato», «non ancora» × 1440×900 e 390×844 × Chromium 159.0.8154.6, Firefox 159.0, WebKit 27.2; stesso
  banco, stessa Playwright 1.65.1): **180 su 180 uguali byte per byte** prima e dopo, senza errori di pagina né richieste fallite, e gli stessi file
  scaricati in ogni foto. Esito in `esiti/caratteri-confronto.txt`. Le foto dei sei sistemi di scrittura con i file nuovi, guardate: arabo, urdu in nastaliq,
  devanagari, bengali, greco e bulgaro (con le forme bulgare) a posto, versi giusti (`foto/caratteri-dopo-*.jpg`).
- **Prova più dura delle pagine** (`strumenti/prova-testo.py` e `.mjs`): le frasi del sito di ogni scrittura (90 per lingua più il nome) e i nomi
  delle lingue, composti con i file di prima e con quelli di dopo nella stessa pagina, in 4–7 pesi (arabo 160–700, urdu 400–700, gli altri 100–900), in
  ognuno dei tre motori: **74 coppie su 74 uguali byte per byte in Chromium, in Firefox e in WebKit**, tutti i file caricati. Controllo di sensibilità: lo
  stesso test fra il peso 400 e il 700 dà 325 755 pixel diversi.
- **Peso delle pagine** (file scaricati in home a 1440, scorsa fino in fondo): urdu 314 024 → 295 848 byte (−5,8%), hindi 198 080 → 194 076 (−2,0%),
  bengali 181 528 → 179 932 (−0,9%), arabo 101 788 → 101 356, greco e bulgaro 101 788 → 101 552, italiano e le altre latine e il cinese 79 804 → 79 616.
- **Verdetto: i file nuovi si tengono.** Le pagine non cambiano di un pixel in nessuno dei tre motori, le lettere, le legature e la spaziatura sono le stesse
  (tavole identiche, glifi identici), i file pesano meno (tranne i nomi greci/bulgari, +12 byte) e sono in regola con la licenza e con le versioni di oggi.
  Copiati in `design-system/caratteri/` (10 file; Lexend non cambia), SHA-256 in `esiti/caratteri-sha256-dopo.txt`. Il `head.modified` resta quello del
  17/11/2026 (data fissata apposta, vedi `LEGGIMI.md`). Controllo: `tools/test_translations.py` 86/86 verdi.
- **Sorgenti già all'ultima**: per tutte e cinque le famiglie la commit scritta in `LEGGIMI.md` è ancora l'ultima della cartella in `google/fonts`
  (API di GitHub, 20/11/2026). Noto Nastaliq Urdu 4.000 (`notofonts/nastaliq`) resta fuori: non è in `google/fonts` (già detto in P-1); non l'ho cambiato.

### Unità 6 · Documentazione (20/11)

- `design-system/caratteri/LEGGIMI.md`: pesi dei file e dei nomi aggiornati (23 924 byte i nomi), la ricetta con le **versioni di fontTools 4.68.0 e brotli
  1.2.1** (prima 4.63.0 e 1.2.0), la scoperta della data nella tavola `head` e come averne gli stessi byte, dove stanno gli SHA-256 e l'esito delle pagine.
- `docs/releasing.md`, «Website»: **non dice quale Playwright usare** (non nomina Playwright), quindi non l'ho cambiato. Il documento descrive la costruzione e la
  pubblicazione, non le prove, e un percorso di questa macchina non ci va.
- **Non toccati, perché fuori dalla mia area, e da aggiornare a cura di chi coordina**: `design/lavoro/L-logo/strumenti/env.sh` (riga
  `PLAYWRIGHT=/workspace/test-playwright/…`, la 1.60.0: è la storia di L-1…L-3) e `design/lavoro/STATO.md`, «Ambiente delle prove (16/11/2026)» (Playwright 1.60,
  `/tmp/metodo-motori`, «dopo un riavvio si rifà»). Per i lavori nuovi: `source /workspace/kalliope-playwright/env.sh`.

## Consegna

**Versioni, prima e dopo** (fonti del 20/11/2026): Playwright 1.60.0 → **1.65.1** (`npm view playwright`, `latest`, 13/11/2026; Chromium 148.0.7778.96 → 159.0.8154.6,
Firefox 150.0.2 → 159.0, WebKit 26.4 → 27.2); fontTools 4.63.0 → **4.68.0** e brotli 1.2.0 → **1.2.1** (PyPI, 27 e 22/10/2026). In più, solo come strumenti del
confronto delle foto, Pillow 13.0.0 e NumPy 2.5.5 (le ultime di PyPI).

**Dove sta, e che cosa usare**: `/workspace/kalliope-playwright/` (nuova; `/workspace/test-playwright/` mai toccata, resta alla 1.60.0).

```sh
source /workspace/kalliope-playwright/env.sh
# che esporta, fra l'altro:
PLAYWRIGHT=/workspace/kalliope-playwright/node_modules/playwright/index.mjs
PLAYWRIGHT_BROWSERS_PATH=/workspace/kalliope-playwright/browsers
METODO_MOTORI=/workspace/kalliope-playwright/motori
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1     # e toglie DISPLAY e WAYLAND_DISPLAY
```

La riga `PLAYWRIGHT=…` da sola **non basta**: i browser stanno in `browsers/` (non nella cache condivisa, perché un `playwright install` di un altro progetto ripulisce
quelli che non gli servono), e senza `PLAYWRIGHT_BROWSERS_PATH` Playwright cerca in `~/.cache/ms-playwright`, dove la 1.65.1 non ha browser. Python (fontTools, brotli, Pillow,
NumPy): `/workspace/kalliope-playwright/venv/bin/python -I`.

**Come partono i tre motori dopo un riavvio**: da soli, con `env.sh`. Niente sta in `/tmp`: le librerie di Firefox e WebKit (pacchetti Debian trixie scompattati da
`prepara-motori.sh` della skill) stanno in `motori/`, che `env.sh` indica con `METODO_MOTORI`. Provato due volte: (1) `strumenti/dopo-riavvio.sh` mette un `/tmp`
vuoto (spazio di mount proprio, `unshare -Urm`; il `/tmp` vero non si tocca) e lancia `motori-test.mjs`: **8 controprove passate**, Firefox senza uscita audio come prima;
(2) `/workspace/kalliope-playwright/prepara.sh` rifà tutto da zero (`npm ci`, `playwright install`, `prepara-motori.sh` per Firefox e WebKit, venv, controprova), si può
rilanciare: 42 secondi con tutto già presente, stesso esito. Firefox e WebKit lanciati con l'API di Playwright e basta, senza passare da `avvia()` della skill (`lib/comune.mjs`, che trova le librerie preparate da `METODO_MOTORI`), non partono (provato): uno script che li lancia da sé deve usare `avvia()`. Chromium parte anche lanciato direttamente. Dipende dalla skill (percorso con la versione, oggi
`…/vibe-next/0.49.0/skills/design-system-generator`, in `env.sh` come `SKILL`): se il plugin cambia versione si cambia quella riga.

**Esiti**:
- `controlla-sorgenti.mjs` da `design-system/`: «Sorgenti in ordine: 31 fogli di stile», uscita uguale con la 1.60.0 e con la 1.65.1 (**non usa un browser**: non prova Playwright).
- `motori-test.mjs`: 8 controprove passate nei tre motori. `esame-impaginazione.mjs` (home, testo 100%, 360, 820 e 1440, un motore alla volta, sito di prova con i file nuovi): pulito in tutti e tre.
- Foto con la 1.60.0 e con la 1.65.1 (home, «stato», «non ancora», 1440 e 390, tre motori, 18 foto): rumore zero (due corse uguali, 18 su 18 byte per byte, per ciascuna versione); Chromium 6/6
  uguali byte per byte; Firefox 3 uguali nei pixel (codifica del PNG diversa) e 3 con 4 pixel di 1 livello su 255; WebKit «stato» uguale e home e «non ancora» con 420–946 pixel
  (0,014–0,023%) tutti nella miniatura delle tre figure dell'ultima tappa (rasterizzazione dei tratti minuscoli di WebKit 27.2). Differenze tutte spiegate (sopra, «Unità 4»).
- Caratteri: ricetta di prima riprodotta byte per byte con la data fissata; con fontTools 4.68.0 e brotli 1.2.1 Lexend identico e dieci file delle altre famiglie diversi ma con glifi,
  `cmap`, contorni e regole uguali; pagine in dieci lingue 180/180 identiche nei tre motori, prova del testo 74/74 per motore; **tenuti**, e il sito pesa meno (urdu −5,8%).

**Non verificato**:
- Altre prove della skill con la 1.65.1: la matrice completa (15 dispositivi × 3 motori, `dispositivi-qa.mjs`), i modi `carattere`, `zoom` e `sistema` di `esame-impaginazione.mjs` (quest'ultimo
  chiede Chrome for Testing 146+), le sequenze con il movimento acceso (le foto sono con «riduci movimento»), i gesti e gli stati aperti (menu, ascolto, errori), le altre pagine del sito (aiuto, installa,
  ascolta, in riunione, 404, che hanno ancora il vecchio aspetto) e il catalogo vivo. Il suono: Firefox qui non ha un'uscita audio (come prima).
- Le nove lingue di prova sono traduzioni di prova non riviste (`2-lingue-aspetto/prova-lingue/`), non quelle da pubblicare; il cinese usa un carattere di sistema e non ha file.
- `Lexend-wght-latino.woff2` e `DejaVuSans-latino.woff2` non vengono dallo script di `LEGGIMI.md` (restano come sono): la loro ricetta non è scritta e non l'ho provata con gli strumenti nuovi.
  Solo Python 3.13.5 (fontTools e brotli non provati con 3.14 o 3.15).
- Il sito pubblicato (GitHub Pages) con i file nuovi: nessun push, come da regola. WebKit gira con Mesa in software e senza finestra, Firefox e Chromium senza schermo: nessuna prova su schermo vero o su GPU.
- Non ho cambiato Noto Nastaliq Urdu 4.000 (non è in `google/fonts`, come già detto in P-1).
