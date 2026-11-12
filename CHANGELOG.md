# Changes

Kalliope's versions go up one step at a time (0.1, 0.2 … 0.9, 1.0, 1.1 …). Each version is
published for every supported system (see [docs/releasing.md](docs/releasing.md)). This file lists
what each version brings, for the people who use it.

## 0.1 — not yet released

The first version is still being built. What already works:

- Kalliope reads Italian text the way a person says it. Numbers, dates, times, money, units,
  phone numbers, addresses, abbreviations and acronyms become words. So does chat shorthand:
  "cmq ci vediamo dmn alle 10:30" is read as "comunque ci vediamo domani alle dieci e trenta".
- Missing accents are put back: "perche" is read as "perché".
- Punctuation shapes the voice. Questions sound like questions, and commas make short pauses.
- Kalliope knows how Italian words are pronounced: where the stress falls, and whether an e or an
  o is open or closed. It uses rules and a list of about 7,900 words, and needs no other program.
- The voice is Klein, a natural neural voice, with two speakers: Giulia and Marco. It runs on your
  computer, so speaking needs no internet connection. It uses little power: about 0.07 seconds of
  processor time for each second of speech.
- For testing, `kalliope-cli` turns text into a WAV file, or shows how each sentence is
  pronounced.

Still being written:

- the virtual microphone, which call apps will offer like any other microphone (Linux first,
  with PipeWire);
- the Kalliope window, where you type and choose the voice.
