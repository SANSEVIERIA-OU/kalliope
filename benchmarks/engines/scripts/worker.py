# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Run ONE engine configuration in a fresh process and print a JSON result line.

Measures: load time, RSS (before/after load, peak), time-to-first-audio,
wall time and process CPU time per sentence, audio duration.
The orchestrator integrates package power over the reported synthesis window.
"""
import json
import os
import resource
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))  # our own scripts dir (python -I drops it)

import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402

import engines  # noqa: E402

SHORT = "Sì, sono d'accordo."
MEDIUM = "Posso fare una domanda? Non ho capito bene l'ultimo punto."


def rss_mb() -> float:
    with open("/proc/self/statm") as f:
        pages = int(f.read().split()[1])
    return pages * os.sysconf("SC_PAGE_SIZE") / 1e6


def cpu_s() -> float:
    r = resource.getrusage(resource.RUSAGE_SELF)
    return r.ru_utime + r.ru_stime


def main():
    cfg = json.loads(sys.argv[1])
    sentences = json.loads(Path(sys.argv[2]).read_text())
    wavdir = Path(sys.argv[3])
    reps = int(cfg.pop("reps", 2))
    label = cfg.pop("label")
    threads = cfg.pop("threads")
    spin = cfg.pop("spin", False)
    engine_name = cfg.pop("engine")

    engines.configure_ort(threads, spin)
    rss_base = rss_mb()

    t0, c0 = time.perf_counter(), cpu_s()
    eng = engines.build(engine_name, **cfg)
    load_s, load_cpu = time.perf_counter() - t0, cpu_s() - c0
    rss_loaded = rss_mb()

    eng.synth("Prova di riscaldamento del motore.")  # warm-up, not measured

    ttfa_short = sorted(eng.first_audio(SHORT) for _ in range(3))[1]
    ttfa_medium = sorted(eng.first_audio(MEDIUM) for _ in range(3))[1]

    per = []
    wavdir.mkdir(parents=True, exist_ok=True)
    win_start = time.monotonic()
    for rep in range(reps):
        for i, text in enumerate(sentences):
            w0, c0 = time.perf_counter(), cpu_s()
            audio = eng.synth(text)
            wall, cpu = time.perf_counter() - w0, cpu_s() - c0
            dur = len(audio) / eng.sample_rate
            per.append({"i": i, "rep": rep, "wall": wall, "cpu": cpu, "audio": dur})
            if rep == 0:
                peak = float(np.max(np.abs(audio))) if len(audio) else 1.0
                sf.write(wavdir / f"{i:02d}.wav", audio / max(peak, 1e-6) * 0.9, eng.sample_rate)
    win_end = time.monotonic()

    tot_wall = sum(p["wall"] for p in per)
    tot_cpu = sum(p["cpu"] for p in per)
    tot_audio = sum(p["audio"] for p in per)
    print(json.dumps({
        "label": label, "engine": engine_name, "threads": threads, "spin": spin, **cfg,
        "load_s": load_s, "load_cpu_s": load_cpu,
        "rss_python_base_mb": rss_base, "rss_loaded_mb": rss_loaded,
        "rss_end_mb": rss_mb(),
        "rss_peak_mb": resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1e3,
        "ttfa_short_s": ttfa_short, "ttfa_medium_s": ttfa_medium,
        "rtf": tot_wall / tot_audio, "core_rtf": tot_cpu / tot_audio,
        "audio_s": tot_audio, "wall_s": tot_wall,
        "window": [win_start, win_end],
        "clone_s": getattr(eng, "clone_seconds", None),
        "per_sentence": per,
    }))


if __name__ == "__main__":
    main()
