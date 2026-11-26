# Changes

Kalliope's versions go up one step at a time (0.1, 0.2 … 0.9, 1.0, 1.1 …). Each version is
published for every supported system (see [docs/releasing.md](docs/releasing.md)). This file lists
what each version brings, for the people who use it.

## 0.2 — 26 November 2026

- The desktop window follows its platform. On GNOME it uses GTK and libadwaita, on Plasma the installed Qt widget style. Windows uses Fluent and macOS uses Cupertino.
- You can start typing while the voice loads. The app keeps your draft until it accepts the sentence. At small window sizes, you can scroll to previous phrases and settings.
- Preparing a personal voice now creates its destination folder automatically. On a fresh installation you can save your first voice directly to the voices folder.

## 0.1 — 20 November 2026

The first version, for Linux.

- **The Kalliope window.** Type, press Enter, and Kalliope speaks. Stop cuts it short. The
  phrases you have said stay in a list, so you can say them again with one click. Choose the
  voice, Giulia or Marco. "Senti anche tu" lets you hear the voice on your own speakers too.
  The next sentence is prepared while the one before it plays. Screen readers can use the window.
- **A microphone called "Kalliope".** In Zoom, Teams, Meet, Jitsi or the browser, choose
  "Kalliope" as the microphone, and the call hears what you type. It sends sound only while an
  app is listening, like a real microphone, and costs nothing while nobody is. On Linux it uses
  PipeWire; Windows and macOS do not have it yet. When the microphone cannot open, Kalliope
  says why in plain Italian (for example, that PipeWire does not answer).
- **The voice is made on your computer, and comes with Kalliope.** No text leaves it. Giulia
  and Marco are Klein, a natural neural voice that uses little power: about 0.07 seconds of
  processor time for each second of speech. The voices are inside the package: once installed,
  Kalliope downloads nothing and works without internet from the first start.
- **The voice of the person who uses Kalliope, a first step.** A second engine, Pocket TTS by
  Kyutai, speaks with a voice imitated from a recording. For now the voice is prepared from a
  terminal, from a WAV file of which the first 12 seconds are used:
  `mkdir -p ~/.local/share/kalliope/voices`, then
  `kalliope-cli voice recording.wav -o ~/.local/share/kalliope/voices/NAME.safetensors`. The
  next time it opens, the window offers NAME next to Giulia and Marco. The window cannot record
  or prepare a voice yet. Use your own voice, or the voice of someone who has given explicit
  consent: the model's terms forbid imitating anyone else.
- **Italian read the way people say it.** Numbers, dates, times, money, units, phone numbers,
  addresses, abbreviations and acronyms become words. So does chat shorthand: "cmq ci vediamo dmn
  alle 10:30" is read as "comunque ci vediamo domani alle dieci e trenta". Missing accents are
  put back: "perche" is read as "perché".
- Punctuation shapes the voice. Questions sound like questions, and commas make short pauses.
- Kalliope knows how Italian words are pronounced: where the stress falls, and whether an e or an
  o is open or closed. It uses rules and a list of about 7,900 words, and needs no other program.
- **A new logo**: a speech bubble, half filled, what has been said, and half dashed, what is not
  said yet. It is also the icon of the program in the menu.
- **Packages for Linux x86_64**: a `.deb` for Debian 13 and Ubuntu 24.04 or newer (187 MB), an
  `.rpm` for Fedora (205 MB), an archive with `./install` for any other distribution (205 MB; about 320 MB
  once installed), and `kalliope-bin` on AUR for Arch Linux. They are bigger than the test
  version's because the voices are inside; the engine that imitates a voice is most of it.
- From a terminal: `kalliope --say TEXT` speaks into the microphone without the window, and
  `kalliope-cli` turns text into a WAV file or shows how each sentence is pronounced.
- If you installed the test version 0.1-rc.1: the voice it downloaded, in
  `~/.local/share/kalliope/models` (53 MB), is no longer used, and you can delete that folder.
