"""e2e_mic_whisper.py DIR [DIR...] → Whisper (small, int8, beam 5, Italian, as V-4) on what the virtual
microphone delivered: wrong words, lost first words, seconds of speech. Writes DIR/whisper.json.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel
from scipy.signal import resample_poly


def words(s):
    s = unicodedata.normalize("NFC", s.lower()).replace("’", "'")
    s = re.sub(r"[^\w\s']", " ", s).replace("'", " ")
    return s.split()


def plain(w):
    return "".join(c for c in unicodedata.normalize("NFD", w) if unicodedata.category(c) != "Mn")


def errors(ref, hyp):
    d = list(range(len(hyp) + 1))
    for i in range(1, len(ref) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(hyp) + 1):
            cur = min(d[j] + 1, d[j - 1] + 1, prev + (ref[i - 1] != hyp[j - 1]))
            prev, d[j] = d[j], cur
    return d[len(hyp)]


model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
for folder in map(Path, sys.argv[1:]):
    out = {}
    for prefix, listfile in (("Giulia", "testi.txt"), ("giovanni", "testi.txt"), ("say", "testi-say.txt")):
        if not (folder / listfile).exists() or not (folder / f"{prefix}-0.wav").exists():
            continue
        texts = (folder / listfile).read_text().splitlines()
        rows, err, n, lost = [], 0, 0, 0
        for i, text in enumerate(texts):
            f = folder / f"{prefix}-{i}.wav"
            if not f.exists():
                rows.append({"testo": text, "mancante": True})
                lost += 1
                continue
            a, sr = sf.read(f, dtype="float32")
            if a.ndim > 1:
                a = a.mean(axis=1)
            loud = np.flatnonzero(np.abs(a) > 1e-3)
            speech = (loud[-1] - loud[0]) / sr if len(loud) else 0.0
            a16 = resample_poly(a, 16000, sr).astype(np.float32)
            segs, _ = model.transcribe(a16, language="it", beam_size=5, vad_filter=False)
            hyp = " ".join(s.text for s in segs).strip()
            r, h = words(text), words(hyp)
            e = errors(r, h)
            first = bool(h) and (plain(h[0]) == plain(r[0]) or plain(h[0]).startswith(plain(r[0])))
            err, n, lost = err + e, n + len(r), lost + (not first)
            rows.append({"testo": text, "whisper": hyp, "errori": e, "prima_parola": first,
                         "secondi_di_voce": round(float(speech), 2), "registrato_s": round(len(a) / sr, 2)})
        out[prefix] = {"parole": n, "errori": err, "wer": round(err / max(n, 1), 4), "prime_perse": lost,
                       "testi": len(texts), "righe": rows}
        print(folder.name, prefix, f"WER {err}/{n}", f"first words lost {lost}/{len(texts)}", flush=True)
    (folder / "whisper.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
