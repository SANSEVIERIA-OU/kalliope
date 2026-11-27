# Review Kalliope's translation into one language, with the window in front of you

You translated `website/lingue/LANG.po` (the language is given at the end as `LANG`). This is the second pass, as a native
reviewer. The owner wants it done by you, whole, now: this is the go-ahead CLAUDE.md asks for. Do not stop to ask.

Since your first pass:

1. **Every short text of the window now has a note** (`#.` above the entry: what it is, what it does, how short it must be).
   Read every entry whose key starts with `programma.` against its note and correct each one whose meaning or kind is wrong:
   a button that is a verb, a state that is said by Kalliope, a title. Example found in two languages: «Torna a scrivere» is a
   button that leaves the voice steps and goes back to the writing area; it was translated as «write again».
2. **Three Italian texts of the website changed** and are marked `#, fuzzy`, with the old Italian in `#|` lines:
   `in.stato.voce.detto`, `ai.testo.21`, `ai.testo.54`. They now quote the window's real messages
   (`programma.voce.file-mancanti`, `programma.motore.non-prepara`, `programma.motore.frase-non-detta`): translate them again
   using the very same words as your translation of those program entries, then remove the `fuzzy` flag and the `#|` lines of
   those three entries.
   Also new: `frase.3.detto-etichetta`, the label «Detto:» before the words the Italian voice said (translate it, as the label
   «Said:» of your language), and `frase.3.detto-frase`, the words the voice said, which stay in Italian exactly as they are.
   `frase.3.detto-riga` is gone.
3. **Photos of the window in your language are attached**: contact sheets of its scenes at its normal size (920×640, shown at
   half size), at its smallest size (360×320) and with the largest text (175 %). Look at each one. Where a text of yours is cut
   off, overflows its button or panel, is hidden by another element, or wraps so badly that it reads wrong, shorten it (choose
   a shorter natural word or phrasing; never an abbreviation with a dot). The Italian window has the same layout: a label much
   longer than the Italian one is the usual cause. Say in your report which ones you shortened and why. If something looks
   wrong in the window but is not a text you can change (a layout problem), describe it in the report with the photo's name.

Everything in the first brief still holds (it follows below): touch only `website/lingue/LANG.po` and your notes file
`materiali-locali/note-traduzioni/LANG.md`; never run `extract` or git; keep placeholders, numbered tags, plural forms; the
Italian sentences the voice says stay in Italian; a window text quoted by the website is the same words as the program entry.

Done means: `python3 -I tools/translations.py check LANG --complete` passes for your language; every `programma.` entry has
been read against its note; the three fuzzy entries are translated and no longer fuzzy; the photos have been looked at. End
with a short report: what you changed and why, in a list.

---

