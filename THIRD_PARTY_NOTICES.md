# Third-party notices

Kalliope's own code is under [SANSEVIERIA License 1.0](LICENSE). The components below keep their own
licences. This list covers what a Kalliope build uses or downloads; development-only tools are listed
separately.

## Used by Kalliope

| Component | Use | Licence | Source |
| --- | --- | --- | --- |
| ONNX Runtime | Runs the voice model (loaded at run time) | MIT | https://github.com/microsoft/onnxruntime |
| Klein-TTS-X1.5-Pro | Voice model (downloaded, not in this repository) | Apache-2.0 | https://huggingface.co/klein-ml/Klein-TTS-X1.5-Pro |
| Wiktionary pronunciations (via kaikki.org) | `crates/phonemes/data/`: stress, vowel quality and z voicing of Italian words | CC BY-SA 4.0 | https://en.wiktionary.org, https://kaikki.org |

## Development only (never part of a build or distribution)

| Component | Use | Licence |
| --- | --- | --- |
| espeak-ng (through `phonemizer`/`kokoro-onnx` in a Python environment) | Reference pronunciations to check Kalliope's phonemizer | GPL-3.0-or-later |
| faster-whisper, Whisper models | Intelligibility checks of generated audio | MIT |
| Python packages listed in `benchmarks/engines/README.md` and the models they download | Engine benchmark | Their own terms |
