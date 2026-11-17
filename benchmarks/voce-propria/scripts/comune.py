# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Shared paths, test sentences and helpers for the own-voice benchmark (V-m, 17/11/2026).

Heavy data (recordings, downloaded models, generated audio) lives outside the repository in
DATA; this folder keeps only programs and JSON results.
"""
from __future__ import annotations

import json
import os
import resource
import subprocess
import time
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

HERE = Path(__file__).resolve().parent
REPO_BENCH = HERE.parent                      # benchmarks/voce-propria
ESITI = REPO_BENCH / "esiti"                  # JSON results (committed)
DATA = Path("/workspace/nomedadefinire/bench/voce-propria")
PERSONE = DATA / "persone"
AUDIO = DATA / "audio"
MODELLI = DATA / "modelli"
CODICE = DATA / "codice"
OLD_MODELS = Path("/workspace/nomedadefinire/bench/models")   # models of the 12/11 benchmark
KLEIN_DIR = OLD_MODELS / "klein" / "onnx"
POCKET_DIR = OLD_MODELS / "pocket-onnx"
CLI = Path("/tmp/voce-m-target/release/kalliope-cli")       # built from crates/ untouched
ORT_LIB = DATA / ".venv/lib/python3.13/site-packages/onnxruntime/capi/libonnxruntime.so.1.31.1"

SR = 24000  # master rate for references and generated audio

# The three sentences of the website samples (design/progetto.md, "Testi dei campioni"), plus a
# question and an exclamation.
FRASI = [
    "Buongiorno a tutti! Scrivo invece di parlare, ma vi seguo benissimo.",
    "Sono d'accordo con Paola. Però la consegna del 14/3 mi sembra stretta: possiamo sentirci "
    "venerdì alle 15:30?",
    "Il preventivo è di 1.250 € + IVA, valido fino al 31 dicembre.",
    "Scusate, mi sentite bene adesso? Posso condividere lo schermo?",
    "Che bella notizia, complimenti a tutta la squadra!",
]

# Women speak through Giulia and men through Marco, as the program does today.
PERSONE_INFO = {
    "F1": {"sesso": "F", "klein": "Giulia"},
    "F2": {"sesso": "F", "klein": "Giulia"},
    "M1": {"sesso": "M", "klein": "Marco"},
    "M2": {"sesso": "M", "klein": "Marco"},
}
DEGRADATE = {"F1": "F1d", "M2": "M2d"}   # the same reference, ruined like an old phone recording


def riferimenti() -> dict[str, dict]:
    """Every reference to clone from: the four people plus the two degraded copies."""
    out = {}
    for p, info in PERSONE_INFO.items():
        out[p] = {"persona": p, "file": PERSONE / p / "riferimento.wav", **info}
        if p in DEGRADATE:
            out[DEGRADATE[p]] = {"persona": p, "file": PERSONE / p / "riferimento_degradato.wav", **info}
    return out


def leggi(path: Path, sr: int = SR) -> np.ndarray:
    a, s = sf.read(str(path), dtype="float32", always_2d=True)
    a = a.mean(1)
    if s != sr:
        g = np.gcd(s, sr)
        a = resample_poly(a, sr // g, s // g).astype(np.float32)
    return a


def scrivi(path: Path, audio: np.ndarray, sr: int = SR, peak: float | None = None) -> None:
    """16-bit WAV. With `peak`, scale so that the loudest sample is `peak` (for listening)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    a = np.asarray(audio, dtype=np.float32)
    if peak is not None and a.size:
        a = a / max(float(np.max(np.abs(a))), 1e-6) * peak
    sf.write(str(path), np.clip(a, -1, 1), sr, subtype="PCM_16")


def ricampiona(a: np.ndarray, da: int, a_sr: int) -> np.ndarray:
    if da == a_sr:
        return a.astype(np.float32)
    g = np.gcd(da, a_sr)
    return resample_poly(a, a_sr // g, da // g).astype(np.float32)


def cpu_s() -> float:
    r = resource.getrusage(resource.RUSAGE_SELF)
    return r.ru_utime + r.ru_stime


def rss_mb() -> float:
    with open("/proc/self/statm") as f:
        return int(f.read().split()[1]) * os.sysconf("SC_PAGE_SIZE") / 1e6


def picco_mb() -> float:
    return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e3


def carico() -> list[float]:
    return [float(x) for x in open("/proc/loadavg").read().split()[:3]]


def ort_options(threads: int):
    """ONNX Runtime settings that Kalliope uses: no spinning, no arena, no memory patterns."""
    import onnxruntime as ort
    o = ort.SessionOptions()
    o.intra_op_num_threads = threads
    o.inter_op_num_threads = 1
    o.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
    o.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    o.enable_cpu_mem_arena = False
    o.enable_mem_pattern = False
    o.add_session_config_entry("session.intra_op.allow_spinning", "0")
    o.add_session_config_entry("session.inter_op.allow_spinning", "0")
    return o


def frasi() -> list[dict]:
    """Sentences after Kalliope's own normalizer and phonemizer (kalliope-cli phonemes)."""
    path = ESITI / "frasi.json"
    if path.exists():
        return json.loads(path.read_text())
    out = []
    for i, t in enumerate(FRASI):
        r = subprocess.run([str(CLI), "phonemes", t], capture_output=True, text=True, check=True)
        rows = [line.split("\t") for line in r.stdout.strip().splitlines()]
        norm = [s for s, _ in rows]
        out.append({
            "id": i, "testo": t, "frasi_normalizzate": norm, "fonemi": [p for _, p in rows],
            # Pocket TTS gets the normalized text with each sentence capitalised (its wrapper
            # capitalises only the first letter of the whole input).
            "normalizzato": " ".join(s[:1].upper() + s[1:] for s in norm),
        })
    ESITI.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(out, ensure_ascii=False, indent=1))
    return out


def normalizza_kalliope(testi: list[str]) -> list[str]:
    """Kalliope's normalizer on any text (used on Whisper transcripts too, for a fair WER)."""
    out = []
    for t in testi:
        r = subprocess.run([str(CLI), "phonemes", t or "."], capture_output=True, text=True)
        out.append(" ".join(line.split("\t")[0] for line in r.stdout.strip().splitlines()))
    return out


class Cronometro:
    def __init__(self):
        self.w0, self.c0 = time.perf_counter(), cpu_s()

    def fine(self) -> tuple[float, float]:
        return time.perf_counter() - self.w0, cpu_s() - self.c0
