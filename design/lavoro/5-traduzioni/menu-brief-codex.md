# Translate Kalliope's entry in the applications menu

You are translating three short texts of Kalliope into **several languages**, listed at the end of the prompt as `LANGS`. The
owner has approved this work and wants it done by you, whole, now: this brief is the go-ahead that CLAUDE.md asks for. Do not stop
to ask; finish every language of the list.

## What Kalliope is, and what these texts are

Kalliope is a free program for the computer (Linux today) for people who cannot speak or find it hard: they type a sentence,
press Enter, and a natural voice says it into a virtual microphone, so the others hear them in Zoom, Teams, Meet and the other
meeting apps. The person can also create their own voice in the program, from a recording. **Kalliope's voices speak Italian
only**: never write a text that promises a voice in the reader's language.

The program and its website are already translated into every language of the list, by you, in `website/lingue/LANG.po`. What is
missing is the program's entry in the **applications menu of the desktop** (the `.desktop` file that GNOME, KDE, Xfce and the others
read). It has three texts, three entries of each `website/lingue/LANG.po`, with their notes for translators in the comments `#.`:

| Key | Italian | What it is |
| --- | --- | --- |
| `programma.menu.genere` | «Voce per le videochiamate» | the kind of program (GenericName), shown with the name «Kalliope» in the menu and in the search: a few words, a name, not a sentence |
| `programma.menu.descrizione` | «Scrivi e fatti sentire nelle videochiamate» | the one-line description (Comment): the tooltip, the line under the name in some menus |
| `programma.menu.parole` | «sintesi vocale;voce;parlare;microfono;videochiamata;muto;CAA;» | the words a person types in the menu's search to find Kalliope (Keywords) |

The model they come from is `packaging/linux/io.github.sansevieria_ou.kalliope.desktop.in`; read it.

## How to translate them

For each language of the list:

1. Read `design/lavoro/5-traduzioni/note/LANG.md`, your notes from translating that language: the form of address, the variant,
   the glossary. Use the same form of address and the same terms. Search `website/lingue/LANG.po` for how you translated
   «videochiamata/videochiamate», «voce», «Scrivi», «fatti sentire» and the window's words, and keep them consistent.
2. **GenericName** (`programma.menu.genere`): write it as the desktop menus of that language name a kind of program (as GNOME and
   KDE translate GenericNames such as «Web Browser», «Text Editor» in that language): a short noun phrase, no full stop, the case
   rules of the language for such names.
3. **Comment** (`programma.menu.descrizione`): one short line addressed to the person who uses Kalliope, in the program's form of
   address, plain and warm, no full stop. It may say the same thing in the language's own way rather than word by word.
4. **Keywords** (`programma.menu.parole`): **not a word-by-word translation of the Italian list**. Write the 6 to 10 words or short
   phrases a person of that language would actually type to find a program like this: the language's usual name of text to
   speech (and its common short form if people search with it), voice, speak/speaking, microphone, video call, the established
   name and acronym of augmentative and alternative communication in that language (for example AAC in English, UK in German), and a
   respectful word that people who cannot speak, or their families, use and search with in that language. Avoid words that the
   community considers offensive or outdated (if «mute» or «dumb» in your language is felt as an insult, do not use it), never
   pity, never medical labels. You may keep a widely used English or Latin-script term next to the native one when people of
   that language really search with it (for example «TTS»). Lower case where the language has it. Format, checked by the tool:
   words separated by «;», a «;» at the end, no spaces around «;», no empty word.
5. Write the language's own script and typography. **Do not add invisible direction marks** (U+200E, U+200F, U+202A–U+202E), no
   backslash, no line break, no «;» in GenericName and Comment.

## The only things you may touch

- In each `website/lingue/LANG.po` of the list: only the `msgstr` of the three entries above. Nothing else of the file: not the
  other entries, not a `msgctxt`, a `msgid`, a comment or a flag.
- In each `design/lavoro/5-traduzioni/note/LANG.md` of the list: append at the end a section `## Applications menu` with the
  three texts, a back-translation of each into English, and the reasons of your keyword choices in two or three lines.

Never touch any other file, never run `tools/translations.py extract` (it rewrites every catalogue), never run `tools/menu.py`,
never run git commands. Other translators are working on other languages in this same folder at the same time: if you see another
language's file, leave it alone.

## Done means

1. For every language of the list, `python3 -I tools/translations.py check LANG --complete` passes with no error and no warning.
2. You have read the three texts of each language once more as a native reviewer would, next to the window's words in the same
   file, and corrected what reads like a translation.
3. Each notes file has its new section.

End with a short report: for each language, the three texts and their back-translation into English, and your doubts.
