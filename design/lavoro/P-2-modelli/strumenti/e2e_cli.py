"""e2e_cli.py OUT → the installed kalliope-cli (/usr/bin, from the .deb), as a user runs it: no KALLIOPE_*
variable, the models from /usr/share/kalliope. Prepares a voice from giovanni's CC0 recording (V-4), then
says the 5 sentences and 16 short phrases of V-1/V-4/P-1 with Giulia and with that voice (seed 1).
Compares each file byte by byte with P-1's (/tmp/p1-e2e/cli/dopo, same texts, models from variables),
and has Whisper (small, int8, beam 5, Italian; as V-4) transcribe them. Writes OUT/e2e_cli.json.
Run with bench/voce-propria/.venv (faster-whisper). (From P-1's e2e_cli.py.)
"""
import hashlib, json, os, re, subprocess, sys, time, unicodedata
from pathlib import Path
import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel
from scipy.signal import resample_poly

OUT = Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
P1 = Path("/tmp/p1-e2e/cli/dopo")
CLI = "/usr/bin/kalliope-cli"
REC = "/workspace/nomedadefinire/bench/voce-propria/audio/v4/e2e/giovanni.wav"
ENV = {k: v for k, v in os.environ.items() if not k.startswith("KALLIOPE_") and k not in ("DISPLAY", "WAYLAND_DISPLAY")}
FRASI = ["Buongiorno a tutti, scusate il ritardo.", "Possiamo rivedere insieme i numeri del terzo trimestre?",
         "Mi sentite bene? Ho cambiato microfono stamattina.",
         "Sono d'accordo con Marco, ma preferirei aspettare la riunione di giovedì.",
         "Vi mando il documento appena finiamo, così lo leggete con calma."]
BREVI = ["Sì.", "No.", "Grazie.", "Un attimo.", "Va bene.", "Certo.", "Esatto.", "Ciao a tutti.", "Scusate.",
         "Mi sentite?", "Arrivo subito.", "D'accordo.", "Perfetto, grazie!", "Un momento, per favore.", "Buongiorno.", "A dopo."]
TESTI = [("f", i, t) for i, t in enumerate(FRASI)] + [("b", i, t) for i, t in enumerate(BREVI)]


def run(cmd):
    t = time.time()
    r = subprocess.run(cmd, env=ENV, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"{cmd}: {r.stderr}")
    return time.time() - t


def words(s):
    s = unicodedata.normalize("NFC", s.lower()).replace("’", "'")
    return re.sub(r"[^\w\s']", " ", s).replace("'", " ").split()


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


res = {"programma": CLI, "variabili_kalliope": [k for k in ENV if k.startswith("KALLIOPE_")], "uguali_a_p1": {}, "whisper": {}}
res["voce_s"] = round(run([CLI, "voice", REC, "-o", str(OUT / "giovanni.safetensors")]), 2)
res["uguali_a_p1"]["giovanni.safetensors"] = (OUT / "giovanni.safetensors").read_bytes() == Path("/tmp/p1-voci/giovanni.safetensors").read_bytes()
for voice in ("giulia", "giovanni"):
    t0 = time.time()
    for kind, i, text in TESTI:
        wav = OUT / f"{voice}-{kind}{i:02d}.wav"
        extra = ["--voice", str(OUT / "giovanni.safetensors"), "--seed", "1"] if voice == "giovanni" else []
        run([CLI, "say", *extra, "-o", str(wav), text])
        res["uguali_a_p1"][wav.name] = (P1 / wav.name).exists() and wav.read_bytes() == (P1 / wav.name).read_bytes()
    res[f"{voice}_s"] = round(time.time() - t0, 1)
model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=2)
for voice in ("giulia", "giovanni"):
    rows, err, n, lost = [], 0, 0, 0
    for kind, i, text in TESTI:
        a, sr = sf.read(OUT / f"{voice}-{kind}{i:02d}.wav", dtype="float32")
        segs, _ = model.transcribe(resample_poly(a, 16000, sr).astype(np.float32), language="it", beam_size=5, vad_filter=False)
        hyp = " ".join(s.text for s in segs).strip()
        r, h = words(text), words(hyp)
        e = errors(r, h)
        first = bool(h) and (plain(h[0]) == plain(r[0]) or plain(h[0]).startswith(plain(r[0])))
        err, n, lost = err + e, n + len(r), lost + (not first)
        rows.append({"testo": text, "whisper": hyp, "errori": e, "prima_parola": first})
    res["whisper"][voice] = {"errori": err, "parole": n, "prime_perse": lost, "testi": len(TESTI), "righe": rows}
    print(voice, f"WER {err}/{n}", f"first words lost {lost}/{len(TESTI)}", flush=True)
same = sum(res["uguali_a_p1"].values())
print(f"identical to P-1: {same}/{len(res['uguali_a_p1'])}")
(OUT / "e2e_cli.json").write_text(json.dumps(res, ensure_ascii=False, indent=1) + "\n")
