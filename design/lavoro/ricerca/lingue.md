# Ricerca del 16/11/2026: sito e applicazione pronti per le traduzioni

Raccolta di cinque ricerche (ruolo research, Haiku) per la decisione del proprietario del 16/11/2026 (`CLAUDE.md`,
«Pronti per le traduzioni»). Qui stanno i fatti che servono alle scelte, con la fonte; le copie scaricate erano in
`/tmp` e non ci sono più dopo un riavvio. Dove una fonte è di seconda mano o non verificata, è detto.

## Le lingue (30)

- **UE, 24**: bg cs da de el en es et fi fr ga hr hu it lt lv mt nl pl pt ro sk sl sv. Fonte: european-union.europa.eu,
  «Languages»; translation.ec.europa.eu (aggiornata 14/10/2026). Nessun cambiamento in corso (catalano, basco e
  galiziano ancora senza decisione al Consiglio del 22/09/2026).
- **Le dieci più parlate per parlanti totali** (prima + seconda lingua), Ethnologue 2026 letto attraverso la tabella di
  Wikipedia «List of languages by total number of speakers» (il sito di Ethnologue ha risposto 403): inglese, cinese
  mandarino, hindi, spagnolo, arabo standard, francese, bengali, portoghese, indonesiano, urdu. Nuove rispetto all'UE:
  **zh hi ar bn id ur**. Per soli parlanti nativi l'elenco cambierebbe (entrano russo, giapponese, turco, vietnamita;
  escono arabo, francese, indonesiano, urdu): scelta fatta per parlanti totali.
- **Scritture**: latina (22 UE + id), greca (el), cirillica (bg), cinese semplificato (zh, Hani), devanagari (hi),
  bengali (bn), araba (ar, ur: da destra a sinistra; l'urdu si scrive di solito in nastaliq, W3C alreq §4.1.1.2).
- **Plurali CLDR 49** (2026-10-22, `common/supplemental/plurals.xml`): ar zero/one/two/few/many/other; ga e mt
  one/two/few/many/other; cs sk lt pl one/few/many/other; sl one/two/few/other; hr ro one/few/other; lv zero/one/other;
  fr es pt it one/many/other; zh id other; tutte le altre one/other.

## Il formato dei testi: gettext `.po`

- Slint traduce soltanto da `.po` (gettext a runtime, oppure `.po` compilati dentro il programma). Weblate e Pontoon
  leggono `.po`, Fluent (`.ftl`), XLIFF, JSON (docs.weblate.org «Supported file formats», 2026.12; Pontoon «Adding a
  new project»).
- MessageFormat 2 (Unicode): stabile da CLDR 47 (marzo 2025), TR35 parte 9 «stable document» in CLDR 49; Weblate e
  Pontoon non lo leggono; `Intl.MessageFormat` è allo stadio 1 di TC39. Fluent: sintassi 1.0 dal 2019, Weblate dalla
  4.8, Slint non lo legge.
- Weblate «Libre» gratuito: nel 2020 chiedeva una licenza approvata dall'OSI o riconosciuta dalla FSF (weblate.org,
  notizia del 27/11/2020); la pagina del 2026 dice solo «public libre projects». La licenza SANSEVIERIA 1.0 non è
  OSI/FSF.

## Il sito

- **Indirizzi**: una URL diversa per lingua; sottocartelle «facili da impostare, poca manutenzione» (Google Search
  Central, «Managing multi-regional and multilingual sites», 10/12/2025). `hreflang`: ogni versione elenca sé stessa
  e tutte le altre, altrimenti i tag sono ignorati; codici ISO 639-1 (+ ISO 3166-1), `x-default` per la pagina di
  scelta della lingua («Tell Google about localized versions», 21/09/2026).
- **Niente spostamento automatico** secondo la lingua indovinata: «Avoid automatically redirecting users from one
  language version of a site to a different language version» (Google, stessa pagina). Si possono mettere i
  collegamenti alle altre lingue. `navigator.languages` è disponibile ovunque, ma Safari e Chrome in incognito
  danno una lingua sola (MDN).
- **Lingua e direzione**: `lang` sull'`html`; `dir="rtl"` sull'`html` quando la pagina è da destra a sinistra, mai sul
  `body`, mai la direzione dal CSS; `dir=auto` o `<bdi>` attorno al testo inserito a runtime (W3C i18n,
  qa-html-language-declarations, qa-html-dir, inline-bidi-markup).
- **Scelta della lingua**: niente bandiere («Flags represent countries, not languages», W3C qa-link-lang); ogni
  lingua scritta nel proprio nome con il suo `lang`. Il cambio lingua mantiene la pagina (presidi della skill).
- **Intl nel browser**: PluralRules, NumberFormat, DateTimeFormat, ListFormat, DisplayNames disponibili ovunque;
  DurationFormat Baseline 2025 (MDN).

## La prova senza traduttori (pseudo-lingue)

- Microsoft (Pseudolocalization, 2022): allungare del 40% partendo dall'inglese; casi estremi 200–400%; accenti;
  delimitatori. Android: `en-XA` (accenti, testo allungato, parentesi) e `ar-XB` (direzione da destra a sinistra).
  Mozilla: «accented» circa +30%, «bidi».
- W3C «Text size in translation» (tabella IBM): testi fino a 10 caratteri 200–300%, 11–20 180–200%, 21–30
  160–180%, 31–50 140–160%, oltre 70 130%. Cinese e coreano: un carattere vale due latini in larghezza; tedesco,
  finlandese, olandese fanno parole lunghissime.

## CSS: da destra a sinistra e scritture

- **Proprietà logiche** (margin-inline, padding-inline, inset-inline, border-start-start-radius, text-align
  start/end): Baseline largamente disponibile dal 2024-03 (web-features 3.46.0). `float/clear: inline-start` dal
  2026-04. W3C i18n: «Use CSS logical properties wherever possible».
- **`:dir()`**: largamente disponibile dal 2026-06-07 (web-features); guarda la direzione semantica (`dir`), non la
  proprietà CSS `direction`.
- **Che cosa si specchia** (Mozilla RTL guidelines, Material 1, Wikimedia Codex, Adobe Spectrum): frecce e icone di
  movimento orizzontale, barre di avanzamento, ciò che rappresenta il tempo che passa, ordine di navigazione e
  impaginazione. **Non si specchiano**: testo e numeri, icone con testo o numeri, segni di spunta, comandi di
  riproduzione audio/video e la loro barra, orologi, loghi, icone tenute con la mano destra (lente). Tecnica:
  `transform: scaleX(-1)` o `scale: -1 1`; non funziona su un `background-image` dentro un elemento con testo.
  Nessuna fonte ufficiale su gradienti, `background-position`, keyframes: da decidere guardando.
- **Corsive (arabo, urdu)**: «Authors should avoid applying letter-spacing to cursive scripts» (CSS Text 4 §8.2.1).
  Arabo: ascendenti e discendenti molto più lunghi del latino (alreq §7.4); servono interlinee più alte anche per
  nastaliq, devanagari, cinese (W3C «Text size in translation»). Nessuna fonte dà valori di `line-height`: si
  decidono guardando.
- **Cinese**: nessuno spazio fra le parole (clreq); `text-autospace` (spazio fra cinese e latino) Baseline 2025;
  `text-spacing-trim` solo Chrome; niente corsivo nella maggior parte dei caratteri cinesi.
- **`hyphens: auto`** sillaba solo se la lingua è dichiarata. **Container queries** largamente disponibili dal 2025-08.
- **Caratteri di riserva**: `font-size-adjust` Baseline 2024-07; descrittore `size-adjust` largamente disponibile dal
  2026-03; `ascent-override` e simili non in Safari. `unicode-range`: il file si scarica solo se la pagina usa un
  carattere dell'intervallo. `system-ui` dipende da piattaforma e lingua, sconsigliato per i paragrafi lunghi.

## I caratteri

- **Lexend** (Google Fonts METADATA.pb): sottoinsiemi latin, latin-ext, vietnamese; **niente greco né cirillico**.
  Il README del progetto dice «expanded to Arabic in July 2021», ma METADATA non elenca l'arabo: da verificare nel file.
- **DejaVu Sans**: latino, greco, cirillico, armeno, georgiano; arabo non in tutti gli stili; niente devanagari né CJK.
- **Noto** (tutti OFL, variabili in `wght` 100–900 salvo Nastaliq 400–700): Noto Sans (latino, greco, cirillico,
  devanagari, vietnamita), Noto Sans Devanagari, Noto Sans Bengali, Noto Sans Arabic, Noto Nastaliq Urdu, Noto Sans SC.
  Dimensioni dei file variabili: nessun dato primario; un file cinese statico pesa 8–17 MB (fonti secondarie).
- **CJK sul web**: Google serve il giapponese in fette per `unicode-range` (2000 caratteri più usati in una fetta, il
  resto in 100; −80% di byte), con il limite che le funzioni di composizione fra fette diverse si perdono (Google
  Developers Blog, 28/09/2018).

## Slint (1.19.0, uscito il 16/11/2026)

- **Traduzioni**: `@tr("testo")`, con contesto `@tr("ctx" => "testo")`, plurali `@tr("{n} voce" | "{n} voci" % n)`;
  estrazione con `slint-tr-extractor -o progetto.pot .`; `CompilerConfiguration::with_bundled_translations(path)` con
  `<path>/<lang>/LC_MESSAGES/<crate>.po`, compilati nel programma; la lingua si sceglie da sola da quella di sistema
  (`sys-locale`: LANGUAGE, LC_ALL, LC_MESSAGES, LANG), poi `slint::select_bundled_translation(lang)` per cambiarla; se
  manca una traduzione resta il testo originale. Le stringhe scritte in Rust non passano da `@tr` (nessuna API
  pubblica, issue #7949): gli stati vanno tradotti nella finestra.
- **Scritture complesse con il renderer software**: la documentazione dice ancora «Text rendering currently limited to
  western scripts» (backends_and_renderers.mdx). Il codice 1.19 con `std`: i caratteri vettoriali passano da parley
  (forme con harfrust, bidi automatico per paragrafo, interruzioni di riga con i dizionari) e i glifi mancanti si
  cercano nei caratteri di sistema per scrittura (fontique). **Mai** `EmbedForSoftwareRenderer`: lì il carattere è
  una bitmap senza composizione né riserva. Slint non ha prove con scritture non latine: va provato.
- **Da destra a sinistra**: il testo si dispone da solo (bidi di parley), ma Slint **non specchia le disposizioni**
  (nessuna proprietà di direzione; issue #2294 aperta dal 2023); `TextHorizontalAlignment.start/end` nel disegno
  valgono sinistra/destra; il **cursore nel campo di testo con testo bidirezionale è sbagliato** (issue #7841 aperta).
  La lingua del testo non arriva ad AccessKit; la direzione sì.
- **Renderer software 1.19**: ombre, gradienti sullo sfondo della finestra e ritaglio con gli angoli arrotondati ci
  sono; mancano opacità di gruppo, rotazioni e ingrandimenti, ombre interne, sfocatura dello sfondo.
- **Token per Slint**: nessun importatore ufficiale di CSS o DTCG; la sola uscita ufficiale verso Slint è il plugin
  per Figma (un `global DesignTokens`). `slint-build` emette `rerun-if-changed` solo per i file che carica: un
  `token.css` letto da `build.rs` ha bisogno del suo. Il `Palette` di std-widgets è di sola lettura e i widget
  standard non si ricolorano.
