# Engine benchmark (November 2026)

This benchmark chose Kalliope's voice engine. It compares small Italian-capable TTS engines on CPU cost,
memory, time to first audio and intelligibility. The results are in [out/REPORT.md](out/REPORT.md)
and [out/asr_report.json](out/asr_report.json), and the test sentences are in
[out/sentences.json](out/sentences.json). It ran on an AMD Ryzen 5 PRO 6650U with ONNX Runtime 1.31.1 on CPU.

Development only: the scripts use Python packages, including espeak-ng through `phonemizer`, which
is GPL. None of this is part of a Kalliope build.

## Main findings

- Klein-TTS-X1.5-Pro and Piper `it_IT-serena-medium` cost about 0.1 CPU-seconds per second of speech
  and produce first audio in under 160 ms. Whisper's word error rate on them is 4–5%.
- Kokoro uses about 10× more CPU. Pocket TTS uses about 7× more, and its word error rate is 16%.
- ONNX Runtime defaults waste resources. Thread spinning added up to 57% CPU with no speed gain,
  and the CPU memory arena kept about 1 GB of extra memory on Pocket TTS. Kalliope turns both off.
- Energy readings from the APU's PPT sensor were invalid on the test machine. Background load held
  the package at its power cap, so CPU time is used as the energy proxy instead.

## Layout

| Path | Contents |
| --- | --- |
| `scripts/engines.py` | One adapter per engine, with the same ONNX Runtime session settings for all |
| `scripts/worker.py` | Measures one configuration in a fresh process |
| `scripts/run_bench.py` | Runs every configuration and samples package power |
| `scripts/summarize.py` | Writes `out/REPORT.md` |
| `scripts/asr_check.py` | Whisper transcription and word error rate |

Scripts expect `models/` and `.venv/` next to `scripts/`. Both are ignored by git.

## Setup

```sh
python3 -m venv .venv
.venv/bin/pip install onnxruntime numpy soundfile sentencepiece scipy safetensors huggingface_hub \
    psutil piper-tts kokoro-onnx phonemizer-fork espeakng-loader faster-whisper
```

Put each model's files in its own folder under `models/`:

| Folder | Source |
| --- | --- |
| `piper/` | `it_IT-*` voices from https://huggingface.co/rhasspy/piper-voices |
| `kokoro/` | `kokoro-v1.0.onnx`, `kokoro-v1.0.int8.onnx` and `voices-v1.0.bin` from the `model-files-v1.0` release of https://github.com/thewh1teagle/kokoro-onnx |
| `pocket-onnx/` | https://huggingface.co/xennonf4/pocket-tts-onnx (`italian` bundles) |
| `supertonic3/` | https://huggingface.co/Supertone/supertonic-3, with `helper.py` from its GitHub example |
| `klein/` | https://huggingface.co/klein-ml/Klein-TTS-X1.5-Pro (`onnx/`) |

Then run `.venv/bin/python -I scripts/run_bench.py`, followed by `scripts/summarize.py` and
`scripts/asr_check.py`.
