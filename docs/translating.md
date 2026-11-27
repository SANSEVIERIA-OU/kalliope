# Translating Kalliope: the website and the program

The website and the program are ready for the 30 languages Kalliope was asked to speak: the 24 official languages of the European Union
and the ten most spoken in the world (Arabic, Bengali, Chinese, French, Hindi, Indonesian, Portuguese, Spanish, Urdu and
English; the list is in `tools/data/cldr.json`):

`bg cs da de el en es et fi fr ga hr hu it lt lv mt nl pl pt ro sk sl sv` and `zh hi ar bn id ur`.

**Adding a language is adding one file**, `website/lingue/<xx>.po`, which holds the texts of the website **and** of the program
(the window the person types in). No page, no script, no style sheet and no source file changes. The pages and the program are
written in Italian and say what a translator sees; the build puts each translation in. «The program» below says what is different
for its texts; everything else in this file is the same for both.

## How it fits together

| What | Where |
| --- | --- |
| The pages, in Italian, with the marks of what to translate | `website/**/*.html` |
| The window and its status lines, errors and advice, in Italian, each with its key | `crates/app/ui/**/*.slint` (`@tr`), `crates/*/src/**/*.rs` (`tr!`, `trn!`) |
| The model: every message once, with a stable key | `website/lingue/site.pot` (made, never edited) |
| Italian, the language of the pages | `website/lingue/it.po` (made, never edited) |
| One catalogue per language | `website/lingue/<xx>.po` |
| Dates, sizes and plural rules of the 30 languages | `tools/data/cldr.json`, from Unicode CLDR |
| Extract, update, check | `tools/translations.py` |
| Build the site, with every language that is ready | `tools/site.py` |
| Build the program, with every language that is ready | `cargo build` (`crates/i18n`, `crates/app/build.rs`) |

The format is gettext `.po`, the one the application will use too (Slint reads nothing else), and Weblate and Pontoon read.
Each message is known by its `msgctxt`, a key written in the page (`apertura.titolo`, `menu.installa`), never by its
Italian words: when the Italian text changes, the translation is kept and marked `#, fuzzy`, with the old text in
`#| msgid`, instead of being lost.

The site has one folder per language: `/it/`, `/en/`, `/ar/` … with the same pages under the same names. The top address,
`/`, is the language chooser (`hreflang="x-default"`): every language written in its own name, the browser's language first,
no automatic jump. A choice made there, or with the selector in the bar or the list of languages at the foot of a page, is
remembered in the browser (localStorage, no cookie) and the next visit to `/` goes straight to it; `/?lingue` shows the
chooser anyway, and so does «Back» from a language page and a reload (otherwise «Back» would never leave the language).
**While only one language is published (today Italian) there is nothing to choose:** the build leaves the selector out of the
bar and the list out of the foot, and `/` is one more of the small pages that send to `/it/` (like the old addresses; the query
and the fragment are kept when a script runs). The second complete language brings the selector, the list and the chooser back,
with no other change. The catalogue (`design-system/catalogo/`) still shows them, from `esempio-home.html` and `esempio-scelta.html`,
which the build writes with the 30 languages of the registry (`noindex`, only for the catalogue). The selector's name for a screen
reader is «Change language: English» (the `title` of the control, already translated, and the language of the page: nothing new to
translate). The site builder keeps old addresses working. For example, `/installa/` opens the Italian installation guide,
`/ascolta/` opens the voice samples on the home page, and `/sistema/` opens the design-system catalogue.
The mappings live in `website/rimandi.json`. With JavaScript, redirects keep query parameters and map old fragments.
Without JavaScript, a meta refresh and a plain link lead to the default destination. Files shared by the
languages stay where they were: `/voce/…`, `/immagini/…`, `/design-system/…`.

## The program

The window speaks the language of the system, from the same file as the website. Nothing is read at run time and nothing needs
installing: the build reads `website/lingue/*.po` and writes the messages of every ready language into the program
(`crates/i18n`; Slint bundles its own, `slint_build::with_bundled_translations`).

**Which messages are the program's.** The ones whose key starts with `programma.` (the website's never do): `programma.finestra.riunione`
(a button), `programma.sessione.pronta` (the status line), `programma.analisi.distorta` (advice after a recording), `programma.nome.esiste`
(a name check), `programma.file.rovinato` (an import error). They are in `site.pot` and in every `<xx>.po` after the website's. A comment
(`#.`) says what the text is for, the file it is used in is in `#:`, and the flag says how its placeholders are written:

| Flag | Where it comes from | Placeholders |
| --- | --- | --- |
| `kalliope-slint` | the window (`.slint`, `@tr`) | `{}` or `{0}` `{1}`… for the arguments, in order; `{n}` is the count of a plural. A translation may reorder them with `{0}`, `{1}`, but not mix `{}` and `{0}` in one text |
| `kalliope-rust` | a status line, an error, advice (`.rs`, `tr!`) | `{name}` for the argument called `name`; `{n}` is the count of a plural |

Both use `{n}` for the count, and `{{` and `}}` for a brace written as itself. Leave every placeholder as it is (a plural form may
drop `{n}` where the language says «one second» without the number; every other form keeps all of them). `check` finds a missing,
an added and a wrong placeholder.

**Plurals.** A message with a count has `msgid_plural` and as many `msgstr[N]` as the language has forms (the same as the
website: `ar` six, `ga` and `mt` five, `cs` `sk` `lt` `pl` `sl` four, `hr` `ro` `lv` `fr` `es` `pt` `it` three, `zh` and `id` one,
all others two). The Italian text gives the singular and the plural of the *count in the message*: «Ne manca {n}» and «Ne mancano {n}». The program picks the form with the rule of the `Plural-Forms` header (compiled into
the program, checked against CLDR for the 30 languages), so a language with one form writes one text.

**What is not translated, and what is not touched.**
- The name «Kalliope», the voices «Giulia» and «Marco», and the sentences a person types or says: they are not messages.
- `{causa}` (and `{formato}`) in a message is the system's own error text, in English: it stays as a cause, in the message as it is.
- The keys (`msgctxt`) and the Italian text (`msgid`): never edit `site.pot` or `it.po` (`extract` writes them), and never a `.slint` or
  `.rs` file for a translation.
- Write the text as the language writes it. Do not add the invisible marks that direct a text (U+200E, U+200F, U+202A…U+202E):
  for a language written from right to left the build opens every message with the right-to-left mark itself, so a text that
  begins with a Latin word, such as «Kalliope», still sits on the right of the mirrored window and its punctuation lands on the
  right side. Digits: a number written in the Italian text («4 secondi», «12») is written as the language writes it; a number the
  program puts in (`{n}`, a time) is always 0 to 9, because Slint formats numbers itself. CLDR's own digits for the 30 languages are 0 to 9,
  except Bengali (০১২…): a Bengali window shows Western digits in counts and times, and the translator writes Bengali digits in the fixed text.
- The keys of the window's keyboard shortcuts (Invio, Esc, Alt+Spazio) are texts to translate as the keys are named on the
  keyboard of that language; a letter such as «A−» and «A+» (text size) is a text too: the sign for it in that language.

**Which language the program shows.** The one the system asks for: on Linux `LANGUAGE` (a list: `fr:de`, ignored when the locale is `C`
or `POSIX`, as gettext does), then `LC_ALL`, `LC_MESSAGES`, `LANG`; on Windows and macOS the system's own list of preferred languages.
The first of them that the program has, by its language part (`pt-BR` is `pt`, `zh-TW` is `zh`); Italian when none is. There is **no language
menu**. `KALLIOPE_LINGUA=de` shows one language whatever the system says (to try it, or to ask for Italian).
**A language is in the program only when its whole file is ready**, website and program: the program never shows a language half
translated, and the guide the window opens («Come si risolve», the site) is the one of the same language, because the site has it too.
The terminal commands (`kalliope --say`, `--registra-voce`, `--importa-voce`, `--help`) and `kalliope-cli` stay in Italian.

**Right to left.** `ar` and `ur` mirror the window: the order of the bar, the side of the history, the tail of the bubble, the way a
panel comes in, the arrows, the writing area (its caret starts on the right), the text of every line. Slint has no direction of writing
for a layout, so the window is turned round as a whole (`transform-scale-x: Token.verso` on the root, `--verso` of the design
system, `design-system/TOKEN.md`) and every text, field and picture turns itself back; `tools/slint_valori.py` fails when one does
not. Mixed Latin and Arabic text keeps its logical order (the text engine's own bidirectional algorithm).

**Typefaces.** One face per script, the same as the website's, embedded as TTF (derived from the design system's WOFF2 with
`tools/caratteri_ttf.py`): Geologica for Greek and Cyrillic (`el`, `bg`), Readex Pro for Arabic, Noto Nastaliq Urdu for Urdu, Noto Sans
Devanagari for Hindi, Noto Sans Bengali for Bengali. Only the face of the language in use is registered (`--app-carattere-<ll>` in
`token.css`; Lexend, which draws Latin and the digits, is always there and comes first). **Chinese uses the face of the system**, as on the
website; where the system has none, the program draws empty boxes: the same as every page of the site on that system.

**Pseudo-languages, to test the program without translators.** `cargo build -p kalliope-app --features pseudo`, then
`KALLIOPE_LINGUA=en-XA kalliope` (accented letters, a text 40% longer, delimiters) or `KALLIOPE_LINGUA=ar-XB` (the words forced
right to left, the window mirrored). They are made from the Italian text when the program is built, are never in a normal build, and
`--demo SCENA` and `--catalogo` open the window and the catalogue in them.

**Looking at a translation in the window.** Build the program once with the catalogue as it is (`cargo build -p kalliope-app`); a
language that is ready is in it. `KALLIOPE_LINGUA=de ./target/debug/kalliope` opens the window in German, and `--demo SCENA` shows every
state without the voice engine: `vuota`, `prepara`, `scrive`, `parla`, `nessuno` (nobody hears), `microfono` (no virtual microphone),
`problema` (the voice does not start), `compatta`, `notizia`, `info`, `conferma`, `voce-1`, `voce-mic`, `voce-2`, `voce-suggerimento`,
`voce-3`, `voce-nome`, `voce-crea`, `voce-importa`, `voce-errore`, `voce-tratti`; `KALLIOPE_DEMO_MISURA=360x320` and `KALLIOPE_DEMO_SCALA=1.75`
open it at the smallest size and with the largest text. `kalliope --catalogo` shows the components, with a switch for right to left.
**Plural rules.** The rule of each language is read from its `Plural-Forms` header and compiled into the program; for Slint's own `@tr`
it is written without `!` (Slint's reader of a plural rule does not know negation, which Croatian, Lithuanian and Polish use, and
`crates/i18n/tests/slint.rs` reads all 30 rules with Slint's own reader so a language never stops the build).

**A message in the source.** In a `.slint` file: `@tr("programma.finestra.riunione" => "Riunione")`, with arguments
`@tr("programma.bolla.ripeti-frase" => "Ripeti: {}", testo)`, and a plural `@tr("programma.crea.trovati" => "Ho trovato {n} tratto." | "Ho trovato {n} tratti." % quanti)`.
In Rust: `tr!("programma.sessione.parlo" => "Sto parlando…")`, `tr!("…" => "Leggo «{nome}»", nome = file)`, `trn!("…" => "Ne manca {n}" | "Ne mancano {n}", secondi)`.
A comment `// TRANSLATORS: …` on the line above, or after the call, goes to the translators. The key is
`programma.area.nome`, lowercase letters, digits, dots and dashes, and it never changes when the Italian text does: a changed Italian text makes
every translation `fuzzy` and the language leaves the program until someone has read it again (the website does the same). Then
`python3 -I tools/translations.py extract` writes the entries. CI fails when it was not run.

## Add a language

```sh
python3 -I tools/translations.py new fr       # website/lingue/fr.po: every entry empty, the right plural forms
# translate with any .po editor (or Weblate, Pontoon)
python3 -I tools/translations.py check fr --complete
python3 -I tools/site.py --out /tmp/kalliope-site --release-json releases.json
```

A language is **published** (the site) and **shown by the program** (the window) when its file is complete and checked: every key of the model there, **the website's and the program's**, none empty, none
`fuzzy`, none translated from an older Italian text, tags and placeholders intact, the `Plural-Forms` header and the number
of forms those of the language. A language that is not (a missing, fuzzy or out-of-date entry, or a broken tag) is **left
out of the build, and the build says so** (`site.py: language de: left out, de: 112/114 entries ready (2 missing); first:
…`); the site goes on without it, and Italian is always built. Nothing else decides: a language goes online when its file
is complete, not before. The same rule keeps a language out for a moment when the Italian text of one entry changes: it comes
back when somebody has read the fuzzy entry again.

Commit the file; the push publishes the site (`.github/workflows/pages.yml`) if the owner has authorised it, and the next build of the
program has the language. `python3 -I tools/translations.py status` says, for each of the 30, how many entries are ready and whether the language is
published; `cargo build -p kalliope-app` prints one line for the files that are there and not ready (`kalliope-i18n: not ready, so not in the program: de (programma.crea.mancano is missing)`).

### What a translator sees

* The key (`msgctxt`) and the Italian text (`msgid`). Extracted comments (`#.`) say what a text is for and what its tags are.
* Tags: `<1>…</1>` and `<1/>`. An element inside a text (a link, a bold word, an arrow) is written as a numbered tag, and its
  address, class and every other attribute stay in the page. **Move the words, keep every tag**: each tag appears once, closed
  as it was, inside the same tag it was inside. `<1/>` is an empty element and stays `<1/>`. A comment says what each tag is.
* Placeholders: `{n}`, `{voce}` and `{{kalliope.version}}`. They are filled in by the script or by the build: leave them as
  they are. `{{kalliope.date}}` and `{{kalliope.deb.size}}` are written by the build in the language of the page, from CLDR.
* `&amp;`, `&lt;` and `&gt;` for the three characters that mean something in HTML; everything else is written as itself.
* Plurals: as many `msgstr[N]` as the language has forms (CLDR: `ar` six, `ga` and `mt` five, `cs` `sk` `lt` `pl` `sl` four, `hr`
  `ro` `lv` `fr` `es` `pt` `it` three, `zh` and `id` one, all others two). `tools/translations.py new` writes the header and the
  fields; `check` compares the header with the CLDR rule by meaning, so a header written by another tool is accepted if it
  counts the same.

## The marks in a page

A page is translatable when it has any `data-t` attribute; one that has none (the old pages, until they are redone) is built in
Italian only. The marks are attributes, so the page stays readable in Italian:

```html
<h2 data-t="campioni.titolo">Senti come suona, con il testo accanto.</h2>
<a href="installa/" data-t="menu.installa">Installa</a>
<p data-t="piede.testo">Versione {{kalliope.version}} del {{kalliope.date}}. <a href="…">Codice</a>…</p>
<a href="./" aria-label="Kalliope, pagina iniziale" data-t-aria-label="barra.marchio">…</a>
<meta name="description" content="…" data-t-content="pagina.descrizione">
<title data-t="pagina.titolo">Kalliope · In riunione, alla pari</title>
```

| Attribute | Meaning |
| --- | --- |
| `data-t="key"` | the content of the element is a message; inline elements inside it become numbered tags |
| `data-t-<attr>="key"` | the attribute `<attr>` is a message: `alt title aria-label aria-description aria-placeholder aria-roledescription placeholder content value data-lungo` |
| `data-t-plurale="…{n}…"` | the content is the singular and this the plural of a message that counts `{n}` things; `data-t-n="3"` is the number, if the page itself shows a plural |
| `data-t-nota="…"` | a note for the translator (English), copied to the catalogue |
| `data-t-no="reason"` | text or attributes here are deliberately not translated (the name of a language, a code) |
| `data-release="prova"` / `"stabile"` | the element (with its content) stays in the page only when the release the site shows is a prerelease (`prova`) or is not (`stabile`): the build decides, from the release data, like the version and the date. Write the two as sibling elements with their own keys (`apertura.stato`, `apertura.stato-stabile`): each language writes both sentences in its own grammar («Testversion» / «Version»), and the existing key does not change when the other is added. Words inside one sentence also work (`<span data-release="prova"> di prova</span>`), where the language can take them out without changing the rest |

Rules: a key is written once or repeated with the same text; two different texts under one key are an error. Everything a person
sees or hears read (text, the attributes above, the `<title>`, the description, the text a script shows) is marked; **text in a
style sheet is not allowed** (`content: "text"`: use `content: attr(data-x)` and mark the attribute). `tools/translations.py`
fails on a translatable page that has unmarked text or an unmarked `alt`, `title`, `aria-label`, `placeholder` or description.

### What a script shows

A script does not carry texts. What it shows or has read aloud sits in the page, in a `<template id="testi-…">` (the browser
does not draw it), one element with `data-t` for each text; it is a message like any other, and so is translated with the page.
`website/testi.js` gives the script its text in the language of the page:

```js
const {testo: T, formato: fmt} = window.Testi;
statoEl.textContent = T('finestra.parlando');                       // «Sto parlando…», in the language of the page
annuncia(fmt(T('annuncio.frase'), {n: Testi.numero(3), voce: nome}));   // «Sto leggendo la frase {n}, voce di {voce}.»
Testi.plurale('elenco.voci', 3, {});                                 // the form for 3, from data-t-forme / data-t-nomi
Testi.numero(1234.5); Testi.minuti(3);                               // Intl: digits and separators of the language
Testi.verso();                                                       // 1, or −1 on a right-to-left page
```

Text that is also on the page (the first state of a window, a button label) is read from the page, so it is translated once.
Dates and numbers a script computes use `Intl` (`Testi.numero`, `Testi.minuti`) in the language of `<html lang>`.

### Dates, sizes, plurals

`{{kalliope.date}}` ("12 novembre 2026", "November 12, 2026", "2026年11月12日", "১২ নভেম্বর, ২০২৬") and `{{kalliope.deb.size}}`
("14,1 MB", "14.1 MB", "14,1 Mo") are written by `tools/site.py` for each language from CLDR (`tools/data/cldr.json`: month names,
long date pattern, decimal and group separators, digits, the short unit of a megabyte). Nothing is a table written by hand;
`tools/cldr_data.py` makes the file from the official CLDR JSON release (`unicode-org/cldr-json`, tag `49.0.0`, Unicode License
v3), and `python3 -I tools/cldr_data.py` is the one command to run when CLDR or the list of languages changes. The plural
rules of the file are the CLDR rules, turned into a gettext `Plural-Forms` line and checked against the integer samples CLDR
gives for every rule. The build does not need a network.

## Change a text

Change the Italian text in the page (or in the source of the program), then:

```sh
python3 -I tools/translations.py extract      # site.pot, it.po, and every <xx>.po brought up to date (pages and program)
```

New keys appear empty in every language; a changed Italian text makes the entry `fuzzy` (the translation is kept, the old text is
in `#| msgid`); a key taken out of the pages goes to the end of each file as an obsolete `#~` entry. A typo fixed in Italian
leaves every language fuzzy: read the entry, take away `#, fuzzy` and put the new text in `msgid` (or ask the translator).
CI runs `translations.py extract --check`, which fails when the catalogues are not what `extract` writes.

## The check

```sh
python3 -I tools/translations.py check [xx …] [--complete]   # exit 1 on an error; --complete also on missing/fuzzy/out of date
python3 -I tools/translations.py status                      # per language: how many entries are ready, published or not
python3 -I tools/translations.py extract --check             # catalogues up to date with the pages
python3 -I tools/css_logico.py                               # style sheets can be mirrored (below)
python3 -I -m unittest discover -s tools -p 'test_*.py'      # the tools themselves, with spoilt copies that must fail
```

`check` finds: a key missing, a key present twice, an empty or fuzzy entry, an entry whose Italian text is not the page's
any more, a different set of placeholders, a tag missing, added, broken, unclosed, moved into another tag, a stray `&` or
`<`, a wrong number of plural forms, a `Plural-Forms` header that is not the CLDR rule of the language, a `Language` that is
not the file's, a charset that is not UTF-8. The tests spoil a copy on purpose (a key taken away, a tag broken, a placeholder
changed, a header wrong) and check that each is found.

## Pseudo-languages, to test without translators

```sh
python3 -I tools/site.py --out /tmp/pseudo-site --release-json releases.json --pseudo
# /tmp/pseudo-site/en-XA/   accented letters, a text 40% longer, [delimiters]
# /tmp/pseudo-site/ar-XB/   the same words forced right to left (RLO), <html dir="rtl">
```

They are made from the Italian catalogue when the site is built (nothing is stored), are never in the chooser nor in any
`hreflang`, and have `noindex`. `en-XA` shows what breaks when the text grows and which text nobody marked (it stays Italian);
`ar-XB` shows the page mirrored. They are Android's pseudo-locales.

## Right to left

A page is right to left when its `<html>` says `dir="rtl"` (the build sets `lang` and `dir` from CLDR on every page; never on
`<body>`, never in CSS). The style sheets of `design-system/` use logical properties (`margin-inline-start`, `inset-inline-end`,
`padding-block`, `text-align: start`) so the layout mirrors by itself. Two things a mirror does not do alone:

* `--verso` (`design-system/token.css`) is `1`, and `-1` under `:root:dir(rtl)`. Whatever moves sideways and has a direction (a
  `translateX`, the origin of a bar that grows, a gradient, an arrow) multiplies by it; `scena.js` reads it with `Testi.verso()`.
* What does not mirror stays physical, with `/* fisico: the reason */` on the line (the play triangle ▶; a centring that is
  symmetric). `tools/css_logico.py` fails on any other `left`/`right`, on a shorthand whose left and right differ (use
  `padding-block` and `padding-inline: start end`), on text written in CSS, and on a token that names a side.

`design/lavoro/1-lingue-sito/versi.md` lists every point that has a direction of its own, with file and line.

## Typefaces and the look of each script

Lexend draws Latin (a second file adds Latin Extended: č š ł ő ų ș…). Every other script has its own typeface after Lexend,
chosen by `:lang()` in `design-system/token.css` («Le scritture»): Geologica for Greek and Bulgarian (with the Bulgarian letter
forms), Readex Pro (Lexend's Arabic) for Arabic, Noto Nastaliq Urdu for Urdu, Noto Sans Devanagari and Noto Sans Bengali for Hindi
and Bengali, the system font for Chinese. Each file has a `unicode-range`, so a page downloads only the scripts it shows. Factors per
script scale the title size and the line height of titles and text; joined scripts and Chinese get no letter spacing. Sources,
licences and sizes: `design-system/caratteri/LEGGIMI.md`. A right-to-left page mirrors what has a direction (`--verso`); play
triangles, numbers and the logo do not.

On a right-to-left page the build isolates every run of Latin letters, digits and dots (a version such as `0.1-rc.1`, `x86_64`,
`Kalliope 0.1`) between LRI and PDI (U+2066…U+2069), in the text and in the translated attributes, so it keeps its own direction
and is never read backwards (`rc.1-0.1`); quotation marks around it follow the Arabic or Urdu text. Translators write the text as
it is: nothing to add.

Text that is not translated (an element marked `data-t-no`: a command, a hash, a file name, a path, the address of the page, a
program name) and `<code>`, `<pre>`, `<kbd>`, `<samp>` are isolated by the markup instead: on a right-to-left page the build adds `dir="ltr"`
to the element (its Latin text, with no right-to-left letter of its own), as the W3C recommends and the HTML specification defines
(`dir` isolates the contents of the element, `unicode-bidi: isolate` in the browser's style sheet), and puts **no character** in the
text. The characters are real: a command copied with «Copia», or selected by hand, would carry them to the terminal, where
`./kalliope-….deb` with invisible marks around the name is «file not found». There is no list of kinds to keep up to date: the author's
`data-t-no` is the declaration, and `tools/test_translations.py` (`DaDestraASinistra`) and `robustezza.mjs` (scenario `appunti`, which
reads the real clipboard and `getSelection()` in ar and ur) fail if a page puts a mark in what is copied.

The build also tells the browser to fetch the font of the script at once: a page in a language with a small font file (Arabic,
Greek, Bulgarian: 22 KB) carries a `<link rel="preload">` for it, found in `design-system/token.css` (the `:lang()` rule of the
language), so the first screen is drawn in the right font and does not flash the fallback (at 1.6 Mbps the text is in the right
font 17-22% sooner; at 400 kbps, 1 s sooner). For the large files (Bengali 102 KB, Devanagari 118 KB, Nastaliq 234 KB) a preload
was measured to gain 1-4% and to delay the first paint by 8-9%, so there is none (`PRECARICO_FINO_A` in `tools/site.py`). The
Italian page does not change by a byte. Measures: `design/lavoro/2-lingue-aspetto/costruzione/misure/`.

Two notes for translators: in Chinese write the four lines of `apertura.titolo` with no space between the tags (`<1>…</1><2>…</2>`),
or the phone shows a gap where the lines run on; and keep the units marked in the sentences (`<1>alle 15:30?</1>`) short, a few
words that must not break.

The texts of the site and of the program are today's Italian ones and will be rewritten: the tools do not care.
