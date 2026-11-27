# Changes

Kalliope's versions go up one step at a time (0.1, 0.2 … 0.9, 1.0, 1.1 …). Each version is
published for every supported system (see [docs/releasing.md](docs/releasing.md)). This file lists
what each version brings, for the people who use it.

## 0.4 — not yet released

Kalliope in your language, and a window that fits your screen.

- **The window speaks the language of your system**: the 24 languages of the European Union, and
  Chinese, Hindi, Arabic, Bengali, Indonesian and Urdu. Buttons, states, advice and error messages
  are all translated. Arabic and Urdu are written from right to left, and the whole window turns
  round for them. Greek, Bulgarian, Arabic, Urdu, Hindi and Bengali have their own typeface inside
  Kalliope; Chinese uses the one of your system. `KALLIOPE_LINGUA=de kalliope` opens Kalliope in
  another language. **The voices still speak Italian only.**
- **The website too**, in the same 30 languages, with a page to choose yours. «Come si risolve»
  opens the guide in the language of the window.
- **The window fits your screen.** On a small laptop it opens no taller than the space between the
  panels, and Kalliope remembers where you left it (on Wayland your desktop decides where windows go).
- **Words light up when you hear them**, measured on the voice itself, also in long texts and with
  your own voice.
- **Kalliope ends with its window**: if the desktop destroys the window without asking, Kalliope
  no longer keeps running in the background.
- **The guide quotes the window's own words** for every problem it explains.

## 0.3 — 27 November 2026

A new window, made for writing, and your own voice made inside Kalliope.

- **A window of its own.** Kalliope now has the look of its website: graphite or light, following
  your system, with the Lexend typeface and the logo. It is one window on every desktop, with no Qt,
  GTK or Python to install.
- **Writing comes first.** You write in a large area that grows with the window, with big text.
  Enter says the phrase. The phrase rises into a bubble, and its words light up as the voice says
  them. Esc stops at once, and the bubble shows how far the voice got. ↑ brings back the last
  phrase.
- **The phrases you have said stay**, also after you close Kalliope, stored only on your computer.
  Repeat one with a click, or with Tab and Enter. «Altro» → «Svuota la cronologia» empties the list.
- **Kalliope tells you when nobody hears you.** If no app in the call is using the «Kalliope»
  microphone, the bubble turns warm and says «Nessuno ti sente». The same goes for a missing
  microphone and a voice that cannot start. «Come si risolve» opens the right page of the guide.
- **Your own voice, inside Kalliope.** «Altro» → «Crea la tua voce» offers two ways:
  - Record yourself reading a short text. A circle fills up to twelve seconds of voice.
  - Use an old recording: a WhatsApp or Telegram voice message, a video, or a WAV, FLAC, MP3, OGG or
    M4A file. Kalliope finds the clearest stretches and says in plain words if one is noisy or too
    short.

  Listen, give the voice a name and confirm you may use it. The new voice is ready in a couple of
  seconds.
- **«Riunione»**, a compact window to keep next to Zoom or Meet. On Wayland, your system keeps it on
  top: Alt+Space, then «Sempre in primo piano».
- **Bigger or smaller text** with A− and A+, or with Ctrl+plus and Ctrl+minus. Kalliope remembers
  your choice and the meeting mode.
- **Stop works at once**, even on long texts. The first words start in under a second instead of
  waiting for the whole text. Closing Kalliope while it speaks takes the microphone away right away.
- **Read the way people say it.** Initials («via G. Verdi»), «a.C.», «½», units like «kg» and «mld»,
  and names like Zoom, Teams, Meet and WhatsApp are read as an Italian speaker says them.
- **Sturdier.** A broken voice file no longer locks the window. Kalliope reconnects by itself when
  the audio service restarts, and opening it twice brings back the window already open.
- **Installing.** The packages require the small Wayland and X11 libraries the window needs, and
  recommend libopus, for importing voice messages.

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
