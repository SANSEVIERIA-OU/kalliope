"""e2e_cli.py PRIMA_DIR DOPO_DIR OUT → kalliope-cli before and after the update, as a user runs it.

For both programs: prepares the voice from giovanni's CC0 recording, then says 5 sentences and the 16
short phrases of V-1/V-4 with Giulia (Klein) and with that voice (Pocket TTS, seed 1). Compares the
files byte by byte, and has Whisper (small, int8, beam 5, Italian; as V-4) transcribe the files of
the new program: wrong words and lost first words. Writes OUT/e2e_cli.json.
Run with bench/voce-propria/.venv (faster-whisper, numpy, soundfile).
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel
from scipy.signal import resample_poly

PRIMA, DOPO, OUT = (Path(a) for a in sys.argv[1:4])
OUT.mkdir(parents=True, exist_ok=True)
REC = "/workspace/nomedadefinire/bench/voce-propria/audio/v4/e2e/giovanni.wav"
ENV = {**os.environ,
       "KALLIOPE_MODEL_DIR": "/workspace/nomedadefinire/bench/models/klein/onnx",
       "KALLIOPE_POCKET_DIR": "/workspace/nomedadefinire/bench/voce-propria/modelli/pocket-kalliope/italian",
       "KALLIOPE_ORT_LIB": "/tmp/voce-m-fetch/onnxruntime-linux-x64-1.32.0/lib/libonnxruntime.so.1.32.0"}
for k in ("DISPLAY", "WAYLAND_DISPLAY"):
    ENV.pop(k, None)
FRASI = [
    "Buongiorno a tutti, scusate il ritardo.",
    "Possiamo rivedere insieme i numeri del terzo trimestre?",
    "Mi sentite bene? Ho cambiato microfono stamattina.",
    "Sono d'accordo con Marco, ma preferirei aspettare la riunione di giovedì.",
    "Vi mando il documento appena finiamo, così lo leggete con calma.",
]
BREVI = ["Sì.", "No.", "Grazie.", "Un attimo.", "Va bene.", "Certo.", "Esatto.", "Ciao a tutti.", "Scusate.",
         "Mi sentite?", "Arrivo subito.", "D'accordo.", "Perfetto, grazie!", "Un momento, per favore.",
         "Buongiorno.", "A dopo."]
TESTI = [("f", i, t) for i, t in enumerate(FRASI)] + [("b", i, t) for i, t in enumerate(BREVI)]


def run(cmd):
    t = time.time()
    r = subprocess.run(cmd, env=ENV, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"{cmd}: {r.stderr}")
    return time.time() - t, r.stderr.strip()


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


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


result = {"programmi": {}, "uguali": {}, "whisper": {}}
for name, prog in (("prima", PRIMA), ("dopo", DOPO)):
    cli = str(prog / "kalliope-cli")
    d = OUT / name
    d.mkdir(exist_ok=True)
    secs, log = run([cli, "voice", REC, "-o", str(d / "giovanni.safetensors")])
    info = {"voce_s": round(secs, 2), "voce_log": log, "say_s": {}}
    for voice in ("giulia", "giovanni"):
        total = 0.0
        for kind, i, text in TESTI:
            wav = d / f"{voice}-{kind}{i:02d}.wav"
            extra = ["--voice", str(d / "giovanni.safetensors"), "--seed", "1"] if voice == "giovanni" else []
            s, _ = run([cli, "say", *extra, "-o", str(wav), text])
            total += s
        info["say_s"][voice] = round(total, 1)
    result["programmi"][name] = info
    print(name, info["voce_s"], info["say_s"], flush=True)

files = sorted(p.name for p in (OUT / "prima").iterdir())
same = [f for f in files if sha(OUT / "prima" / f) == sha(OUT / "dopo" / f)]
result["uguali"] = {"file": len(files), "identici": len(same), "diversi": sorted(set(files) - set(same))}
print("identical:", len(same), "of", len(files), flush=True)

model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
for voice in ("giulia", "giovanni"):
    rows, err, n, lost = [], 0, 0, 0
    for kind, i, text in TESTI:
        a, sr = sf.read(OUT / "dopo" / f"{voice}-{kind}{i:02d}.wav", dtype="float32")
        pad = np.zeros(sr // 2, dtype=np.float32)
        a16 = resample_poly(np.concatenate([pad, a, pad]), 16000, sr).astype(np.float32)
        segs, _ = model.transcribe(a16, language="it", beam_size=5, vad_filter=False)
        hyp = " ".join(s.text for s in segs).strip()
        r, h = words(text), words(hyp)
        e = errors(r, h)
        first = bool(h) and (plain(h[0]) == plain(r[0]) or plain(h[0]).startswith(plain(r[0])))
        err, n, lost = err + e, n + len(r), lost + (not first)
        rows.append({"testo": text, "whisper": hyp, "errori": e, "prima_parola": first})
    result["whisper"][voice] = {"parole": n, "errori": err, "wer": round(err / n, 4), "prime_perse": lost,
                                "testi": len(TESTI), "righe": rows}
    print(voice, f"WER {err}/{n}", f"first words lost {lost}/{len(TESTI)}", flush=True)

(OUT / "e2e_cli.json").write_text(json.dumps(result, ensure_ascii=False, indent=1) + "\n")
