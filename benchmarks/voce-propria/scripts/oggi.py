# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Today's voice, made by the program itself: kalliope-cli say (normalizer, phonemizer, Klein).

Writes AUDIO/oggi/<Giulia|Marco>/<i>.wav. With a model folder from klein.cartella_con_voci the
same command speaks with a voice found by the search (strategy 3).

Usage: python -I oggi.py [--model-dir DIR --speaker ID --out SUBDIR]
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from comune import AUDIO, CLI, FRASI, KLEIN_DIR, ORT_LIB  # noqa: E402


def say(text: str, out: Path, speaker: str, model_dir: Path = KLEIN_DIR, threads: int = 1) -> dict:
    """Runs kalliope-cli in its own process; returns its CPU time and peak memory (wait4)."""
    out.parent.mkdir(parents=True, exist_ok=True)
    p = subprocess.Popen([str(CLI), "say", "--model-dir", str(model_dir), "--speaker", speaker,
                          "--threads", str(threads), "--ort-lib", str(ORT_LIB), "-o", str(out), text],
                         stderr=subprocess.PIPE, text=True)
    _, status, ru = os.wait4(p.pid, 0)
    err = p.stderr.read()
    if status != 0:
        raise RuntimeError(err)
    return {"cpu_s": ru.ru_utime + ru.ru_stime, "picco_mb": ru.ru_maxrss / 1e3, "stderr": err.strip()}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model-dir", type=Path, default=KLEIN_DIR)
    ap.add_argument("--speaker", action="append")
    ap.add_argument("--out")
    a = ap.parse_args()
    for sp in a.speaker or ["Giulia", "Marco"]:
        sub = a.out or f"oggi/{sp}"
        for i, t in enumerate(FRASI):
            r = say(t, AUDIO / sub / f"{i}.wav", sp, a.model_dir)
            print(sub, i, r["stderr"], flush=True)


if __name__ == "__main__":
    main()
