# Changes

Kalliope's versions go up one step at a time (0.1, 0.2 … 0.9, 1.0, 1.1 …). Each version is
published for every supported system (see [docs/releasing.md](docs/releasing.md)). This file lists
what each version brings, for the people who use it.

## 0.1 — not yet released

The first version, for Linux. Still being finished.

- **The Kalliope window.** Type, press Enter, and Kalliope speaks. Stop cuts it short. The
  phrases you have said stay in a list, so you can say them again with one click. Choose the
  voice, Giulia or Marco. "Senti anche tu" lets you hear the voice on your own speakers too.
  The next sentence is prepared while the one before it plays. Screen readers can use the window.
- **A microphone called "Kalliope".** In Zoom, Teams, Meet, Jitsi or the browser, choose
  "Kalliope" as the microphone, and the call hears what you type. It sends sound only while an
  app is listening, like a real microphone, and costs nothing while nobody is. On Linux it uses
  PipeWire; Windows and macOS do not have it yet. When the microphone cannot open, Kalliope
  says why in plain Italian (for example, that PipeWire does not answer).
- **The voice is made on your computer.** No text leaves it. The voice is Klein, a natural neural
  voice, and uses little power: about 0.07 seconds of processor time for each second of speech.
  Kalliope downloads it (about 53 MB) the first time it starts.
- **Italian read the way people say it.** Numbers, dates, times, money, units, phone numbers,
  addresses, abbreviations and acronyms become words. So does chat shorthand: "cmq ci vediamo dmn
  alle 10:30" is read as "comunque ci vediamo domani alle dieci e trenta". Missing accents are
  put back: "perche" is read as "perché".
- Punctuation shapes the voice. Questions sound like questions, and commas make short pauses.
- Kalliope knows how Italian words are pronounced: where the stress falls, and whether an e or an
  o is open or closed. It uses rules and a list of about 7,900 words, and needs no other program.
- From a terminal: `kalliope --say TEXT` speaks into the microphone without the window, and
  `kalliope-cli` turns text into a WAV file or shows how each sentence is pronounced.
