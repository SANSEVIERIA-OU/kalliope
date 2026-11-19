# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Cost of each strategy, one test at a time, each in a fresh process, same thread count.

Two measurements per strategy and reference, each in its own process so that peak memory is
not mixed up:
  prepara  the one-time cost: load the models, encode the reference (Pocket: Mimi encoder;
           MeanVC2: WavLM-Large + ECAPA speaker encoder; OpenVoice: tone colour encoder);
           the search of strategy 3 is measured by strada3_ricerca.py itself.
  parla    load the models and the prepared voice, warm up, then: time to the first audio of
           two sentences (median of three), and the five test sentences twice: CPU seconds per
           second of speech, wall seconds per second of speech, peak memory (ru_maxrss).
The machine is shared: CPU time is the measure, wall time and load average are reported.

Usage: python -I costo.py [--threads 2] [--strade oggi,pocket24,...] [--rif F1,M1]
       (the worker mode is internal: costo.py --worker MODE STRATEGY REF THREADS)
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from comune import ESITI, Cronometro, carico, frasi, picco_mb, riferimenti, rss_mb  # noqa: E402

PY = sys.executable


def worker(modo: str, strada: str, rif: str, threads: int):
    for k in ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS"):
        os.environ[k] = str(threads)
    from strade import build
    info = {**riferimenti()[rif], "rif": rif}
    rss0 = rss_mb()
    c = Cronometro()
    s = build(strada, threads)
    load_w, load_c = c.fine()
    out = {"modo": modo, "strada": strada, "rif": rif, "threads": threads, "rss_python_mb": rss0,
           "caricamento_s": load_w, "caricamento_cpu_s": load_c, "rss_caricato_mb": rss_mb(),
           "carico_inizio": carico()}
    fr = frasi()
    if modo == "prepara":
        c = Cronometro()
        s.prepara(info)
        w, cpu = c.fine()
        out.update({"preparazione_s": w, "preparazione_cpu_s": cpu, "picco_mb": picco_mb()})
    else:
        c = Cronometro()
        s.carica_voce(info)
        out["voce_s"], out["voce_cpu_s"] = c.fine()
        s.dici({"id": 99, "testo": "Prova.", "frasi_normalizzate": ["prova."], "fonemi": ["prˈɔva."],
                "normalizzato": "Prova."})                       # warm-up
        out["primo_suono_s"] = {str(f["id"]): sorted(s.primo_suono(f) for _ in range(3))[1]
                                for f in (fr[0], fr[3])}
        per = []
        for rep in range(2):
            for f in fr:
                c = Cronometro()
                a = s.dici(f)
                w, cpu = c.fine()
                per.append({"id": f["id"], "rep": rep, "orologio_s": w, "cpu_s": cpu, "audio_s": len(a) / s.sr})
        tot_a = sum(p["audio_s"] for p in per)
        out.update({"frasi": per, "cpu_per_s_parlato": sum(p["cpu_s"] for p in per) / tot_a,
                    "orologio_per_s_parlato": sum(p["orologio_s"] for p in per) / tot_a,
                    "picco_mb": picco_mb(), "rss_fine_mb": rss_mb()})
    out["carico_fine"] = carico()
    print(json.dumps(out))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--worker", nargs=4)
    ap.add_argument("--threads", type=int, default=2)
    ap.add_argument("--strade", default="oggi,ricerca,pocket24,pocket6,meanvc2,meanvc2-int8,openvoice")
    ap.add_argument("--rif", default="F1,M1")
    ap.add_argument("--modi", default="prepara,parla")
    a = ap.parse_args()
    if a.worker:
        m, s, r, t = a.worker
        worker(m, s, r, int(t))
        return
    path = ESITI / "costo.jsonl"
    for s in a.strade.split(","):
        for r in a.rif.split(","):
            for m in a.modi.split(","):
                if m == "prepara" and s in ("oggi", "ricerca"):
                    continue
                t0 = time.time()
                p = subprocess.run([PY, "-I", __file__, "--worker", m, s, r, str(a.threads)],
                                   capture_output=True, text=True)
                if p.returncode:
                    print(s, r, m, "ERRORE", p.stderr[-800:], flush=True)
                    continue
                res = json.loads(p.stdout.strip().splitlines()[-1])
                res["quando"] = t0
                with path.open("a") as f:
                    f.write(json.dumps(res) + "\n")
                if m == "parla":
                    print(f"{s:13s} {r} parla: {res['cpu_per_s_parlato']:.3f} cpu-s/s, "
                          f"{res['orologio_per_s_parlato']:.3f} s/s, primo suono "
                          f"{res['primo_suono_s']}, picco {res['picco_mb']:.0f} MB, carico {res['carico_inizio']}",
                          flush=True)
                else:
                    print(f"{s:13s} {r} prepara: {res['preparazione_cpu_s']:.2f} cpu-s, "
                          f"{res['preparazione_s']:.2f} s, picco {res['picco_mb']:.0f} MB", flush=True)


if __name__ == "__main__":
    main()
