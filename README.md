# Kalliope

**Type, and be heard.** Kalliope lets people who cannot speak, or find speaking hard, take part in
video calls. What they type is spoken aloud with a natural voice, through a virtual microphone that
any conferencing app (Zoom, Teams, Meet, Webex, Jitsi…) can select. Everything runs on your computer.

Goals: excellent, punctuation-aware voice quality on modest CPUs; a very small app with the best
performance per watt; Italian first.

**Status:** first version on its way, Linux only. The app speaks into a virtual microphone named
"Kalliope". It has been tested end to end with PipeWire 1.6 but not yet with Zoom, Teams or Meet on
a real desktop. Windows and macOS builds compile and pass tests, but have no virtual microphone yet.

## Use it (Linux)

1. Install the package for your system from the [releases page](https://github.com/SANSEVIERIA-OU/kalliope/releases)
   and open **Kalliope**.
2. The first time, press **Scarica la voce**: the voice (53 MB) is downloaded once and checked,
   and Kalliope then works offline.
3. In Zoom, Teams, Meet, Webex, Jitsi or your browser, choose **Kalliope** as the microphone.
4. Type and press Enter. **Ferma** stops; earlier phrases stay in the list, ready to repeat.
   **Senti anche tu** also plays the voice on your speakers.

Needs PipeWire with pipewire-pulse (the default on current Fedora, Ubuntu, Debian, Arch and openSUSE desktops).
From a terminal: `kalliope --say "Buongiorno a tutti"` speaks without opening the window, and
`kalliope --download-voice` downloads the voice.

## How it works

```
typed text → normalizer → phonemizer → neural voice → virtual microphone → your call
```

| Part | Crate | What it does | Cost on a Ryzen 5 PRO 6650U |
| --- | --- | --- | --- |
| Normalizer | `kalliope-text` | Writes out numbers, dates, times, money, units, phone numbers, addresses, abbreviations, acronyms and chat shorthand as words; restores missing accents; splits sentences; keeps punctuation | about 11 µs per sentence |
| Phonemizer | `kalliope-phonemes` | Italian spelling → IPA, with stress and e/o quality from rules, endings and a 7,920-word lexicon (no espeak-ng) | microseconds per word |
| Voice | `kalliope-voice` | Klein-TTS-X1.5-Pro through ONNX Runtime, loaded at run time; one thread, no spinning, no memory arena | about 0.07 CPU-seconds per second of speech |
| Own voice | `kalliope-voice` (`pocket`) | Pocket TTS by Kyutai: three ONNX graphs, the flow model with 8-bit weights, two threads; streamed frame by frame | see [A voice of your own](#a-voice-of-your-own-in-progress) |
| Microphone | `kalliope-mic` | PipeWire virtual source "Kalliope", loaded at run time; audio flows only while an app listens | 0% CPU when nobody listens |
| App | `kalliope-app` | Slint window, software-rendered, accessible to screen readers; one sentence is synthesized while the previous one plays | 10.6 MB RAM with the window alone, about 117 MB with the voice loaded, 0% CPU when idle |

## A voice of your own (in progress)

Kalliope can also speak with the voice of the person who uses it, imitated from a short recording,
with [Pocket TTS](https://github.com/kyutai-labs/pocket-tts) by Kyutai (Italian model, CC BY 4.0).
Giulia and Marco stay for whoever has no recording.

**Whose voice.** Record your own voice, or use the voice of someone who has given you explicit consent.
Kyutai's terms, which everyone who downloads the model accepts, forbid imitating a voice without the
explicit and lawful consent of its owner.

The model is not downloaded by Kalliope yet: its files come from Kyutai's repository on Hugging Face,
which asks for an account and the acceptance of those terms, and are converted to ONNX by
`benchmarks/voce-propria/scripts/v4_esporta.py`. Once its folder is in place:

```sh
export KALLIOPE_POCKET_DIR=/path/to/pocket-tts-italian   # flow_lm.onnx, mimi_*.onnx, tokenizer.json, pocket.json
kalliope-cli voice my-voice.wav -o ~/.local/share/kalliope/voices/Mia.safetensors
kalliope-cli say --voice ~/.local/share/kalliope/voices/Mia.safetensors -o prova.wav "Buongiorno a tutti."
```

The recording is a WAV file of the person speaking naturally, as clean as possible (the model also
imitates noise and echo); Kalliope uses its first 12 seconds (longer prompts make the model end
sentences early). The voice file (4 to 7 MB) is then listed in the app next to Giulia and Marco,
and speaks into the microphone while it is being generated: on the Ryzen 5 PRO 6650U, about 0.43
CPU-seconds per second of speech with two threads, the first audio about 50 ms after the text is
ready, 294 MB of memory (measures in [benchmarks/voce-propria](benchmarks/voce-propria/README.md)).

Speech recorded from the "Kalliope" microphone, as a call would hear it, transcribes with a 2.3%
word error rate on the 10 benchmark sentences. The remaining differences are mostly spelling:
"10 e 30" for "10:30", and "ancora" for "àncora".

Development:

```sh
cargo build --release
export KALLIOPE_ORT_LIB=/path/to/libonnxruntime.so KALLIOPE_MODEL_DIR=/path/to/klein/onnx
./target/release/kalliope                        # the app
./target/release/kalliope-cli say -o ciao.wav "Buongiorno a tutti, scusate il ritardo."
./target/release/kalliope-cli phonemes "Il preventivo è di 1.250 €, IVA esclusa."
```

`python3 tools/fetch_assets.py` downloads the model and ONNX Runtime with pinned fingerprints. See
[benchmarks/engines](benchmarks/engines/README.md) for why Klein was chosen,
[docs/virtual-microphone.md](docs/virtual-microphone.md) for the microphone, and
[CONTRIBUTING.md](CONTRIBUTING.md) for the layout and the licence terms.

## Releases

Website: https://sansevieria-ou.github.io/kalliope/

The first test version, [0.1-rc.1](https://github.com/SANSEVIERIA-OU/kalliope/releases/tag/v0.1-rc.1),
is a prerelease. Each version is published on the
[releases page](https://github.com/SANSEVIERIA-OU/kalliope/releases). For now it is Linux x86_64:
a `.deb` for Debian 13 and Ubuntu 24.04 or newer, an `.rpm` for Fedora, a `.tar.gz` for any other
distribution and a PKGBUILD for Arch. [CHANGELOG.md](CHANGELOG.md) says what each version brings;
[docs/releasing.md](docs/releasing.md) explains how versions and releases are made.
