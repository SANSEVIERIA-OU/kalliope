# Review Kalliope's entry in the applications menu, as a native speaker

You are reviewing three short texts of Kalliope in **several languages**, listed at the end of the prompt as `LANGS`. The owner
has approved this work and wants it done by you, whole, now: this brief is the go-ahead that CLAUDE.md asks for. Do not stop to
ask; finish every language of the list.

## What you are reviewing

Kalliope is a free program for the computer (Linux today) for people who cannot speak or find it hard: they type a sentence,
press Enter, and a natural voice says it into a virtual microphone, so the others hear them in Zoom, Teams, Meet and the other
meeting apps. **Its voices speak Italian only**: no text may promise a voice in the reader's language.

A first translator has just translated the program's entry in the **applications menu of the desktop** (the `.desktop` file that
GNOME, KDE, Xfce and the others read) into every language of the list. Three entries of each `website/lingue/LANG.po`, with their
notes for translators in the comments `#.`:

| Key | Italian | What it is |
| --- | --- | --- |
| `programma.menu.genere` | «Voce per le videochiamate» | the kind of program (GenericName), shown with the name «Kalliope»: a short noun phrase, not a sentence |
| `programma.menu.descrizione` | «Scrivi e fatti sentire nelle videochiamate» | the one-line description (Comment): tooltip, line under the name in some menus |
| `programma.menu.parole` | «sintesi vocale;voce;parlare;microfono;videochiamata;muto;CAA;» | the words a person types in the menu's search to find Kalliope (Keywords) |

The first translator's reasons are at the end of `design/lavoro/5-traduzioni/note/LANG.md`, section `## Applications menu`; the
same file has the form of address and the glossary of the whole translation. The model is
`packaging/linux/io.github.sansevieria_ou.kalliope.desktop.in`.

**The attached picture** shows the entry in a real launcher (rofi, which reads the desktop file as a menu does) for each language of
the list, two rows per language: the search «kalliope», which shows the name, the kind (after «·») and the description (in italics);
and a search with one of the language's keywords that is in neither of the two texts, which only the Keywords line can find. Each
row is labelled with the language's code. Look at every row.

## What to check, for each language

1. **Meaning.** The kind says what Kalliope is (a voice, a speaking aid, for video calls); the description says what the person does
   (types, and is heard in the call). Nothing promises a voice in the reader's language, nothing pities, nothing sounds medical.
2. **Naturalness.** It reads as written in the language, not translated: the way the desktop menus of that language name a kind of
   program (as GNOME and KDE translate GenericNames such as «Web Browser», «Text Editor»), with the case rules of the language
   for such names; the description in the program's form of address (`note/LANG.md`), plain and warm, no full stop.
3. **Consistency** with the window and the website in the same file: search `website/lingue/LANG.po` for «videochiamata», «voce»,
   «Scrivi», «fatti sentire» and use the same words.
4. **Keywords.** The 6 to 10 words or short phrases people of that language actually type to find a program like this: the usual
   name of text to speech (and its common short form if people search with it), voice, speak, microphone, video call, the
   established name or acronym of augmentative and alternative communication in that language, and a respectful word that people
   who cannot speak, or their families, use. Remove what nobody would type, a word that is offensive or outdated in the
   community, an acronym that is not established or that is also an everyday word or an interjection (it would make Kalliope come up
   for unrelated searches), and duplicates. Lower case where the language has it. Words separated by «;», a «;» at the end, no spaces
   around «;».
5. **The picture.** The script is drawn right (no boxes, joined letters joined), the keyword row shows Kalliope (rofi underlines the
   letters it matched, wherever it finds them). The row puts the name, the kind and the description on one line, 1000 px wide, more
   than most menus do: a description cut at the end there is only longer than the others. Real menus show the description as a
   tooltip or on a line of its own; shorten it only if the same can be said in fewer words, never at the cost of meaning.

Correct what is wrong; leave what is right as it is. A change of taste is not a correction: change a text only when you can say what
was wrong with it.

## The only things you may touch

- In each `website/lingue/LANG.po` of the list: only the `msgstr` of the three entries above.
- In each `design/lavoro/5-traduzioni/note/LANG.md` of the list: at the end of the section `## Applications menu`, a short paragraph
  `Review:` with what you changed and why, or «no change» with one line on why the texts are right.

Never touch any other file, never run `tools/translations.py extract`, never run `tools/menu.py`, never run git commands. Other
reviewers are working on other languages in this same folder at the same time: leave their files alone.

## Done means

1. For every language of the list, `python3 -I tools/translations.py check LANG --complete` passes with no error and no warning.
2. Each notes file has its `Review:` paragraph.

End with a short report: for each language, what you changed (old → new, and why) or «no change», and your doubts.
