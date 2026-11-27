# I caratteri del sistema

Ogni famiglia sta nella sua cartella con la sua licenza accanto. I file `.woff2` sono sottoinsiemi (soltanto i caratteri della
scrittura, con tutte le regole di composizione; degli assi variabili resta soltanto il peso). Ogni `@font-face` in `../token.css`
ha un `unicode-range`: il browser scarica un file soltanto se la pagina ha lettere di quell'intervallo. **Una pagina italiana
scarica soltanto `lexend/Lexend-wght-latino.woff2`** (e `dejavu/DejaVuSans-latino.woff2` per la finestra ricostruita), come prima.

## Per lingua

| Lingue | Scrittura | Carattere | File | Byte |
|---|---|---|---|---|
| it, en, es, fr, de, pt, nl, da, sv, fi, ga, id… | latino | Lexend (OFL) | `lexend/Lexend-wght-latino.woff2` | 37 644 |
| cs, sk, pl, hu, lt, lv, ro, hr, sl, mt, et (e ogni lettera latina estesa) | latino esteso | Lexend (famiglia «Lexend esteso», dopo Lexend nelle pile) | `lexend/Lexend-wght-latino-esteso.woff2` | 37 112 |
| el, bg | greco, cirillico (in bulgaro con le forme bulgare, `locl BGR`) | Geologica (OFL) | `geologica/Geologica-wght.woff2` | 21 936 |
| ar | arabo | Readex Pro (OFL), l'arabo di Lexend | `readex-pro/ReadexPro-wght.woff2` | 21 740 |
| ur | arabo in nastaliq | Noto Nastaliq Urdu (OFL) | `noto-nastaliq-urdu/NotoNastaliqUrdu-wght.woff2` | 216 232 |
| hi | devanagari | Noto Sans Devanagari (OFL) | `noto-sans-devanagari/NotoSansDevanagari-wght.woff2` | 114 460 |
| bn | bengali | Noto Sans Bengali (OFL) | `noto-sans-bengali/NotoSansBengali-wght.woff2` | 100 316 |
| zh | cinese semplificato | il carattere di sistema (`--font-cinese`: PingFang SC, Microsoft YaHei, Noto Sans CJK SC…) | nessuno | 0 |

I nomi delle lingue (l'elenco in ogni pagina, la scelta nella barra, la pagina della scelta) hanno file con le sole lettere dei
nomi: `lexend/Lexend-wght-nomi.woff2` (ăČčšų, 3 788 byte), `geologica/Geologica-wght-nomi.woff2` (Ελληνικά, български, 4 840),
`readex-pro/ReadexPro-wght-nomi.woff2` (العربية, 5 984), `noto-nastaliq-urdu/NotoNastaliqUrdu-wght-nomi.woff2` (اردو, 2 056),
`noto-sans-devanagari/NotoSansDevanagari-wght-nomi.woff2` (हिन्दी, 5 136), `noto-sans-bengali/NotoSansBengali-wght-nomi.woff2`
(বাংলা, 2 120). Il latino di base dei nomi è lo stesso file di Lexend: la famiglia dei nomi non ha una faccia latina sua (con lo
stesso indirizzo il browser lo scaricava una seconda volta, correzione del 17/11/2026) e le pile `--font-nomi-lingue` cominciano da
`"Lexend"`. In una pagina italiana con l'elenco di tutte le lingue questi file pesano 23 924 byte, e si scaricano soltanto quando
l'elenco si impagina: la scelta aperta, o il piede vicino allo schermo (`content-visibility: auto`). A riposo la pagina italiana
scarica 2 file, 59 480 byte (Lexend latino e DejaVu latino).

**Il cinese** usa il carattere di sistema, per scelta: il sottoinsieme di Noto Sans SC con i 3 755 caratteri più comuni (GB 2312,
primo livello) pesa 1 086 548 byte in woff2, contro 0; ogni sistema per cui c'è un browser ha un carattere cinese semplificato
senza grazie della stessa famiglia (Noto Sans SC è Source Han Sans, che su Linux e Android si chiama Noto Sans CJK SC; PingFang
su Apple, Microsoft YaHei su Windows). Se servisse lo stesso disegno ovunque, il passo è un carattere scaricato a fette per
`unicode-range`, come fa Google Fonts.

## Nel programma

Il programma porta dentro un `.ttf` per scrittura, ricavato dal `.woff2` con `python3 -I tools/caratteri_ttf.py` (senza perdere nulla; la CI controlla che
siano quelli che i `.woff2` danno): `geologica/Geologica-wght.ttf` 56 020 byte (greco e cirillico), `readex-pro/ReadexPro-wght.ttf` 47 940 (arabo),
`noto-nastaliq-urdu/NotoNastaliqUrdu-wght.ttf` 1 104 472 (urdu), `noto-sans-devanagari/NotoSansDevanagari-wght.ttf` 323 900 (hindi),
`noto-sans-bengali/NotoSansBengali-wght.ttf` 201 600 (bengalese): 1 733 932 byte in tutto, e Lexend (175 756) c'era già. Il programma ne registra uno solo, quello
della lingua in uso (`--app-carattere-<ll>` in `../token.css`, `TOKEN.md`). Il cinese non ha un file: usa il carattere di sistema come sul sito, e dove
il sistema non ne ha uno il programma disegna dei riquadri vuoti. Il sito non pubblica questi `.ttf` (`tools/site.py`).

## Da dove vengono

Scaricati da `github.com/google/fonts`, ramo `main`, il 16/11/2026 (licenza SIL Open Font License 1.1, `OFL.txt` accanto):

| File di partenza | Ultima commit della cartella | SHA-256 |
|---|---|---|
| `ofl/readexpro/ReadexPro[HEXP,wght].ttf` | `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5` | `268bba7e1e8f3b14d798b3fb0e40ebaa3fc39308c9ac0020e2faf6df181cc30e` |
| `ofl/geologica/Geologica[CRSV,SHRP,slnt,wght].ttf` | `a60a77e14f28abd4ef243a1b5dfc48df0cec5205` | `9124d9e88ac6c11d761f35241713a51d68e2c4ebedce0edaca834717a00959ec` |
| `ofl/notonastaliqurdu/NotoNastaliqUrdu[wght].ttf` | `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5` | `98a4787f34eb6fde57fb9a1121a8f216301196ab0da98ea110cad581be8abbcd` |
| `ofl/notosansdevanagari/NotoSansDevanagari[wdth,wght].ttf` | `2bc5d431b584d89e646214bf6cfa75494e76ceea` | `14ec4af41f27482216d1c2229f417ff9b1425e1babb014e57d1d40d03229853e` |
| `ofl/notosansbengali/NotoSansBengali[wdth,wght].ttf` | `b9b4b56be4f67f120752a756f39299b47366223c` | `dcd42978094e584a849c84a51450eeac40c8826057d566ea6d4b9627a403a05a` |

Lexend viene da `lexend/Lexend-wght.ttf`, già in questa cartella. Il latino esteso è una famiglia a parte («Lexend esteso») e senza i segni combinanti: come seconda faccia della famiglia «Lexend», o con i segni combinanti nel suo intervallo, la pagina italiana cambiava di 42 pixel (scarto 3 su 255) senza scaricare il file (provato, 17/11/2026). Readex Pro è «the world-script expansion of the font Lexend»
(README di `github.com/ThomasJockin/readexpro`): gli stessi autori e lo stesso metodo, e le stesse misure verticali di Lexend.

**Come si rifanno i sottoinsiemi**: `python3 design/lavoro/2-lingue-aspetto/prove/sottoinsiemi.py <cartella dei file scaricati>
design-system/caratteri` (fontTools con brotli). Gli assi si fermano al valore predefinito (Readex `HEXP` 0, Geologica `CRSV` 0
`SHRP` 0 `slnt` 0, Noto `wdth` 100) e resta il peso; `--layout-features=*`, senza hinting. Lo script scrive nella cartella che gli si dà,
sopra i file che ci trova: lanciarlo su una copia di questa cartella (ci legge anche `lexend/Lexend-wght.ttf` e `lexend/Lexend-wght-latino.woff2`).
Sono 12 i file che rifà; `lexend/Lexend-wght-latino.woff2` e `dejavu/DejaVuSans-latino.woff2` non sono suoi e restano come sono.

**Strumenti usati** (20/11/2026, incarico P-3): **fontTools 4.68.0 e brotli 1.2.1**, le ultime di oggi (PyPI; prima 4.63.0 e 1.2.0), in
un ambiente a parte con le versioni fissate (`/workspace/kalliope/materiali-locali/playwright/requirements.txt`). Con i sorgenti qui sopra, lo stesso script e la
stessa data i file sono questi: di Lexend, identici a quelli di prima byte per byte; delle cinque famiglie, più piccoli (Nastaliq −18 KB, Devanagari
−3,8 KB, Bengali −1,4 KB, Readex −244 byte, Geologica −48 byte) con gli stessi glifi, la stessa `cmap`, gli stessi contorni e le stesse regole di
composizione (cambia l'impacchettamento binario di `GSUB` e `GPOS`; in Geologica la 4.68.0 mette l'involucro «Extension» in altri lookup di `GPOS`,
con le stesse sottotabelle). Le pagine non cambiano: 180 foto per prova (home, «stato» e «non ancora», 1440 e 390, tre motori, dieci lingue) uguali
byte per byte prima e dopo (`design/lavoro/P-3-strumenti/progresso.md`).

**Gli stessi byte a ogni corsa: la data.** Le cinque famiglie passano da `instantiateVariableFont` e da `TTFont.save`, che scrivono nella tavola `head`
la data e l'ora della corsa (`modified`, e con lei `checkSumAdjustment`): due corse identiche danno file di byte diversi. fontTools rispetta
`SOURCE_DATE_EPOCH`. I file di qui portano la data del 17/11/2026 (00:34:17 UTC per Readex, 00:34:18 Nastaliq, 00:34:29 Devanagari, 00:34:34
Bengali, 00:34:38 Geologica; si leggono in `head.modified`) e `design/lavoro/P-3-strumenti/strumenti/sottoinsiemi-datati.py vecchio|nuovo
<cartella dei file scaricati> <uscita>` rifà tutto con quella data (e i 14 file vengono identici byte per byte, anche con le versioni di prima).
Gli SHA-256 dei file di oggi: `design/lavoro/P-3-strumenti/esiti/caratteri-sha256-dopo.txt`. Noto Nastaliq Urdu 4.000 (`notofonts/nastaliq`,
17/7/2024) non è ancora in `google/fonts`, dove la cartella resta alla commit scritta sopra (controllato il 20/11/2026: per tutte e cinque le
famiglie quella è ancora l'ultima commit della cartella).
