# Kalliope

**Type, and be heard.** Kalliope lets people who cannot speak, or find speaking hard, take part in
video calls. What they type is spoken aloud with a natural voice, through a virtual microphone that
any conferencing app (Zoom, Teams, Meet, Webex, Jitsi…) can select. Everything runs on your computer.

Goals: excellent, punctuation-aware voice quality on modest CPUs; a very small app with the best
performance per watt; Italian first.

**Status:** early development. There is no usable release yet. The text-to-speech pipeline works
from the command line on Linux. The virtual microphone and the app window are still to come.

## What works today

```
typed text → normalizer → phonemizer → neural voice → WAV
```

| Part | Crate | What it does | Cost on a Ryzen 5 PRO 6650U |
| --- | --- | --- | --- |
| Normalizer | `kalliope-text` | Writes out numbers, dates, times, money, units, phone numbers, addresses, abbreviations, acronyms and chat shorthand as words; restores missing accents; splits sentences; keeps punctuation | about 11 µs per sentence |
| Phonemizer | `kalliope-phonemes` | Italian spelling → IPA, with stress and e/o quality from rules, endings and a 7,920-word lexicon (no espeak-ng) | microseconds per word |
| Voice | `kalliope-voice` | Klein-TTS-X1.5-Pro through ONNX Runtime, loaded at run time; one thread, no spinning, no memory arena | about 0.07 CPU-seconds per second of speech; 95 MB resident when idle |

With the 10 benchmark sentences, Whisper transcribes the output with a 2.3% word error rate, for
both the Giulia and Marco voices. The remaining differences are mostly spelling: "10 e 30" for
"10:30", and "ancora" for "àncora". The release binary is about 0.7 MB and has no crate
dependencies.

```sh
cargo build --release
export KALLIOPE_ORT_LIB=/path/to/libonnxruntime.so KALLIOPE_MODEL_DIR=/path/to/klein/onnx
./target/release/kalliope say -o ciao.wav "Buongiorno a tutti, scusate il ritardo."
./target/release/kalliope phonemes "Il preventivo è di 1.250 €, IVA esclusa."
```

The model comes from https://huggingface.co/klein-ml/Klein-TTS-X1.5-Pro (`onnx/` folder). ONNX
Runtime 1.16 or newer works.

See [benchmarks/engines](benchmarks/engines/README.md) for why Klein was chosen, and
[CONTRIBUTING.md](CONTRIBUTING.md) for the layout and the licence terms.
