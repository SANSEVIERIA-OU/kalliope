# Translate Kalliope into one language

You are translating Kalliope's website and program into **one language**, given at the end of the prompt as `LANG` (a code
such as `de`). The owner has approved this work and wants it done by you, whole, now: this brief is the go-ahead that CLAUDE.md
asks for. Do not stop to ask; finish the language.

## What Kalliope is, and the voice of the text

Kalliope is a free program for the computer (Linux today) for people who cannot speak or find it hard: they type a sentence,
press Enter, and a natural voice says it into a virtual microphone, so the others hear it in Zoom, Teams, Meet and the other
meeting apps. The person can also create their own voice in the program, from a recording.

The Italian text is plain, warm and direct, written as between equals: it never pities, never sounds medical, never sells.
Short sentences, everyday words, the person addressed directly. Keep that voice. Choose the form of address that modern,
friendly software in your language uses for the general public (for example the informal one where it is the norm), use it
the same way everywhere, and write the choice in your notes.

**Kalliope's voices speak Italian only, and the text must keep saying so.** Never make a sentence promise a voice in the
reader's language. Therefore:

- What the voice says, or what a person types for the voice to say, **stays in Italian, exactly as it is**: the sample
  sentences of the home page (`frase.1`, `frase.2`, `frase.3` and their parts `frase.*.gruppo.*`, `frase.*.detto.*`,
  `frase.2.chi.paola`), the beginnings of the samples you can listen to (`ascolto.frase.*`, they are Italian recordings), the
  example of abbreviations (`st.riscrive.da`, `st.riscrive.a`), and the Italian words quoted inside an explanation about how
  the voice reads Italian («cmq ci vediamo dmn alle 10:30», «comunque ci vediamo domani alle dieci e trenta», «10 e 30»,
  «10:30», «ancora», «àncora»). Translate the words around them, and labels such as «Detto:» (`frase.3.detto-etichetta`); `frase.3.detto-frase` is the voice's words and stays Italian.
- Keep the numbered tags and the placeholders of those entries as they are, too.

## The files, and the only things you may touch

Read `docs/translating.md` whole before starting: it is the guide, including its section «The program». Then:

1. `python3 -I tools/translations.py new LANG` creates `website/lingue/LANG.po` with 703 empty entries (528 of the website,
   175 of the program, whose keys start with `programma.`). If the file already exists, continue it: fill what is empty.
2. Fill **every** `msgstr` of `website/lingue/LANG.po`, translating from the Italian `msgid`, reading the comments (`#.`), the
   file it is used in (`#:`) and the flags of each entry.
3. Write your notes in `materiali-locali/note-traduzioni/LANG.md` (create the folder if needed): the form of address you chose,
   the variant of the language if there is a choice (see below), a glossary of 15–30 recurring terms with your translation, and
   every doubt you could not settle.

**Touch nothing else.** Only `website/lingue/LANG.po` and your notes file. Never edit `site.pot`, `it.po`, another language's
`.po`, a key (`msgctxt`), an Italian text (`msgid`), or any `.html`, `.slint`, `.rs`, `.py`, `.css` or `.md` file of the
repository. Never run `tools/translations.py extract` (it rewrites every catalogue) and never run git commands. Other
translators are working on other languages in this same folder at the same time: always pass your code to the tool
(`check LANG`), and if you see another language's file, leave it alone even when it has errors.

## The rules of each entry

- **Placeholders** (`{}`, `{0}`, `{1}`, `{n}`, `{nome}`, `{azione}`…) stay exactly as written; you may move them where your
  grammar needs them. `{causa}` and `{formato}` are the system's own text in English and stay as placeholders.
- **Numbered tags** (`<1>…</1>`, `<2/>`, entries flagged `kalliope-markup`): keep every tag, with its number, around the
  words that correspond in your language; the comment says what each number is (a line break, a bold word, a link).
- **Plurals:** write every `msgstr[N]` the language has (the header's `Plural-Forms` says how many).
- **Attributes** (comment «Attribute … plain text, no tags»): plain text, no tags.
- **Not translated:** «Kalliope», «Giulia», «Marco», «Paola», brand and product names (Zoom, Teams, Meet, Google Meet, Linux,
  PipeWire, GitHub, AUR, Flatpak, WhatsApp, Telegram, WAV, FLAC, MP3…), file and command names, and the Italian sentences
  listed above.
- **Translated:** the names of keys (Invio, Esc, Alt+Spazio: as they are named on that language's keyboard), the size signs
  «A−» and «A+» (as your language writes them), and the menu names of other programs, written as those programs name them in
  your language when you know it (Zoom's, Teams', Meet's settings; «Sempre in primo piano» is the desktop's «Always on top»).
- **A text of the window quoted by the website must be the same words.** The website tells people which button to press and
  which status they will see; the window must show exactly that. Translate the program entry first, then use the very same
  words wherever the site quotes it. The quotations today:

  | Window text | Program key | Quoted by the website in |
  | --- | --- | --- |
  | «Altro» | `programma.finestra.altro` | `riu.immagine.8`, `riu.voce.testo`, `st.d.voce.personale` |
  | «Attenzione» | `programma.stato.attenzione` | `ai.testo.18` |
  | «Come si risolve» | `programma.comune.come-si-risolve` | `in.frasi.voce.rimedio`, `riu.testo.6`, `riu.testo.34` |
  | «Crea la tua voce» | `programma.finestra.crea-tua-voce` | `riu.voce.testo`, `st.d.voce.personale` |
  | «Di'» | `programma.scrittura.di` | `riu.immagine.8` |
  | «Ferma» | `programma.comune.ferma` | `riu.scrivi.riunione`, `ai.testo.46` |
  | «La voce non parte» | `programma.stato.voce-non-parte` | `in.installa.voce-non-parte`, `in.frasi.voce.frase`, `riu.testo.6`, `ai.testo.12` |
  | «Manca il microfono» | `programma.stato.manca-microfono` | `in.frasi.microfono.frase`, `in.microfono.se-no`, `riu.testo.6`, `ai.testo.15` |
  | «Nessuno ti sente» | `programma.stato.nessuno-ti-sente` | `in.frasi.nessuno.frase`, `riu.testo.6`, `riu.testo.25`, `ai.testo.17` |
  | «Preparo la voce» / «Preparo la voce…» | `programma.stato.preparo-la-voce`, `programma.sessione.preparo` | `in.apri.ogni-volta`, `ai.testo.13`, `st.voce.forse` |
  | «Pronta» | `programma.stato.pronta` | `in.apri.titolo`, `in.apri.riuscito`, `in.ripresa.pronta`, `riu.testo.1` and others |
  | «Riunione» | `programma.finestra.riunione` | `riu.immagine.8`, `riu.scrivi.riunione` |
  | «Senti anche tu la voce» | `programma.finestra.senti-anche-tu-voce` | `riu.testo.33`, `ai.testo.63`, `st.passo.disco.testo` |
  | «Sto parlando» | `programma.stato.sto-parlando` | `riu.testo.25`, `ai.testo.16` |

  Search the file for «…» around any other window text you meet and keep it consistent too. Keep the quotation marks your
  language uses.
- **The window is small.** Buttons, menu items, status words and short labels of the program (`programma.*`) must stay about
  as short as the Italian: prefer the short everyday word, no abbreviations with a dot. The website's sentences can take the
  length they need.
- **Do not add invisible direction marks** (U+200E, U+200F, U+202A–U+202E); the build adds them for right-to-left languages.
- **Digits:** write numbers in the text as your language writes them; see the guide for Bengali. Dates, sizes and plural
  rules come from CLDR through the tool: nothing to write by hand there.
- **Typography of your language:** its own quotation marks, apostrophe, non-breaking spaces where it needs them (for example
  before «:» and «?» in French), its own decimal separator in numbers you write.

## Variants

- `pt`: Portuguese that reads naturally in Portugal and in Brazil. Where a choice cannot be avoided, use European Portuguese
  (the official language of the EU) and write those places in your notes.
- `zh`: Simplified Chinese.
- `en`: international English with the spelling common in software (US), plain and warm, not marketing.
- `ar`: Modern Standard Arabic, simple and modern.
- `ur`: Urdu in its usual script; `hi`: everyday modern Hindi in Devanagari, not heavily Sanskritised; `bn`: standard Bengali.
- `ga`, `mt`: the standard written language; keep technical words people actually use.

## Done means

1. `python3 -I tools/translations.py check LANG --complete` passes with no error and no warning for your language.
2. You have read the whole file once more from top to bottom as a native reviewer would, and corrected what reads like a
   translation, every inconsistency of terms and of the form of address, and every quotation of a window text that is not
   the same words as the program's entry.
3. Your notes file exists.

End with a short report: the number of entries, what `check LANG --complete` printed, and your doubts.
