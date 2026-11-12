# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""DEVELOPMENT ONLY: intelligibility check of generated speech with Whisper.

Transcribes DIR/00.wav, DIR/01.wav… (one per text of a JSON list) with faster-whisper "small"
(int8, CPU) and reports the word error rate against the texts. ASR is robust to accent, so this
catches gross problems (skipped, garbled or wrong words, wrong numbers), not naturalness or
intonation, which need listening. Same method as the engine benchmark.

    .venv/bin/python -I tools/asr_wer.py --sentences sentences.json DIR [DIR...]
"""
import argparse
import json
import re
import unicodedata

import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel
from scipy.signal import resample_poly


def norm(s: str) -> list[str]:
    s = unicodedata.normalize("NFC", s.lower()).replace("’", "'")
    s = re.sub(r"(\d)[.](\d{3})", r"\1\2", s)  # 1.250 -> 1250
    s = re.sub(r"[^\w\s']", " ", s).replace("'", " ")
    return s.split()


def word_errors(ref: list[str], hyp: list[str]) -> int:
    d = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        prev, d[0] = d[0], i
        for j, h in enumerate(hyp, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (r != h))
    return d[-1]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("dirs", nargs="+")
    ap.add_argument("--sentences", required=True)
    ap.add_argument("--json", help="write details to this file")
    a = ap.parse_args()
    sentences = json.load(open(a.sentences, encoding="utf-8"))
    model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)
    report = {}
    for d in a.dirs:
        errors = words = 0
        details, durations = [], []
        for i, ref in enumerate(sentences):
            audio, sr = sf.read(f"{d}/{i:02d}.wav", dtype="float32")
            durations.append(len(audio) / sr)
            g = np.gcd(sr, 16000)
            audio = resample_poly(audio, 16000 // g, sr // g).astype(np.float32)
            segments, _ = model.transcribe(audio, language="it", beam_size=5, vad_filter=False)
            hyp = " ".join(s.text for s in segments).strip()
            e = word_errors(norm(ref), norm(hyp))
            errors, words = errors + e, words + len(norm(ref))
            if e:
                details.append({"i": i, "errors": e, "hyp": hyp})
        report[d] = {"wer": errors / words, "errors": errors, "words": words,
                     "durations": durations, "details": details}
        print(f"{d}: WER {100 * errors / words:.1f}% ({errors}/{words}), audio {sum(durations):.1f} s", flush=True)
        for x in details:
            print(f"  {x['i']:02d} ({x['errors']}): {x['hyp']}")
    if a.json:
        json.dump(report, open(a.json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
