# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Intelligibility check: transcribe generated WAVs with Whisper and compute word error rate.

ASR is robust to accent, so this catches gross problems (skipped/truncated words,
wrong numbers, mumbling), not naturalness or intonation — those need human listening.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
SENT = json.loads((ROOT / "out" / "sentences.json").read_text())
CONFIGS = sys.argv[1:] or [
    "piper-serena-med-t1", "piper-paola-med-t1", "piper-riccardo-xlow-t1", "piper-serena-high-t1",
    "klein-giulia-t2", "klein-marco-t2", "kokoro-sara-fp32-t2", "kokoro-sara-int8-t2",
    "kokoro-nicola-fp32-t2", "pocket-it-int8-t2", "pocket-it-fp32-t2", "pocket-it24l-int8-t4",
    "supertonic-F1-5step-t2", "supertonic-F1-2step-t2", "supertonic-M1-5step-t2",
]


def norm(s: str) -> list[str]:
    s = unicodedata.normalize("NFC", s.lower()).replace("’", "'")
    s = re.sub(r"(\d)[.](\d{3})", r"\1\2", s)          # 1.250 -> 1250
    s = re.sub(r"[^\w\s']", " ", s).replace("'", " ")
    return s.split()


def wer(ref: list[str], hyp: list[str]) -> tuple[int, int]:
    d = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        prev, d[0] = d[0], i
        for j, h in enumerate(hyp, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (r != h))
    return d[-1], len(ref)


model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)
report = {}
for cfg in CONFIGS:
    errs = tot = 0
    worst = []
    for i, ref in enumerate(SENT):
        wav = ROOT / "out" / "wav" / cfg / f"{i:02d}.wav"
        audio, sr = sf.read(str(wav), dtype="float32")
        g = np.gcd(sr, 16000)
        audio = resample_poly(audio, 16000 // g, sr // g).astype(np.float32)
        segs, _ = model.transcribe(audio, language="it", beam_size=5, vad_filter=False)
        hyp = " ".join(s.text for s in segs).strip()
        e, n = wer(norm(ref), norm(hyp))
        errs, tot = errs + e, tot + n
        if e:
            worst.append({"i": i, "errors": e, "hyp": hyp})
    report[cfg] = {"wer": errs / tot, "errors": errs, "words": tot, "details": worst}
    print(f"{cfg:28s} WER {100 * errs / tot:5.1f}%  ({errs}/{tot})", flush=True)
(ROOT / "out" / "asr_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1))
