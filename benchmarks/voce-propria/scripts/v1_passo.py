# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-1: which combination speaks without making the listener wait.

Each combination runs in a fresh process, one at a time: Pocket with the official settings
(pocket.py defaults), the voice loaded from the saved embedding (the one-time encoding is not
timed here), a warm-up, then the five test sentences of F1 and M1 in streaming. Per sentence:
time to the first audio, gaps a real-time playback would have had (a chunk ready after its turn)
and the worst delay, CPU seconds and wall seconds per second of speech; per process the memory
peak. The audio goes to AUDIO/v1/<name>/<ref>/s0/ for v1_valuta.py (words, similarity).

The decoder runs in the same thread as the generator (a conservative choice: the official code
decodes in a second thread).

Usage: python -I v1_passo.py NAME [NAME ...]    (names in COMBO)   internal: --worker NAME
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

import numpy as np  # noqa: E402

from comune import AUDIO, DATA, ESITI, Cronometro, carico, frasi, picco_mb, riferimenti, rss_mb, scrivi  # noqa: E402

C6 = dict(bundle="italian")
C24 = dict(bundle="italian_24l")
COMBO = {
    # name: (Pocket options, threads, (first chunk, chunk) in latents of 80 ms, reference seconds or None)
    "6-int8-t2": (dict(C6), 2, (2, 6), None),
    "6-int8-t2-p1": (dict(C6), 2, (1, 3), None),
    "6-int8-t2-p4": (dict(C6), 2, (4, 4), None),
    "6-int8-t2-p6": (dict(C6), 2, (6, 12), None),
    "6-int8-t4": (dict(C6), 4, (2, 6), None),
    "6-int8-t1": (dict(C6), 1, (2, 6), None),
    "6-main32-t2": (dict(C6, main="fp32"), 2, (2, 6), None),
    "6-fp32-t2": (dict(C6, main="fp32", flow="fp32", dec="fp32"), 2, (2, 6), None),
    "6-int8-dec32-t2": (dict(C6, dec="fp32", flow="fp32"), 2, (2, 6), None),
    "6-int8-t2-r10": (dict(C6), 2, (2, 6), 10.0),
    "6-int8-t2-r15": (dict(C6), 2, (2, 6), 15.0),
    "6-int8-t2-r10-p4": (dict(C6), 2, (4, 4), 10.0),
    "6-int8-t1-r10-p4": (dict(C6), 1, (4, 4), 10.0),
    "6-int8-t1-p4": (dict(C6), 1, (4, 4), None),
    "24-int8-t4-p4": (dict(C24), 4, (4, 4), None),
    "6-int8-t2-nokv": (dict(C6, kv=False), 2, (2, 6), None),
    "24-int8-t2": (dict(C24), 2, (2, 6), None),
    "24-int8-t4": (dict(C24), 4, (2, 6), None),
    "24-int8-t4-r10": (dict(C24), 4, (2, 6), 10.0),
}
RIF = ["F1", "M1"]


def worker(nome: str):
    opts, threads, (primo, pezzo), durata = COMBO[nome]
    for k in ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS"):
        os.environ[k] = str(threads)
    from pocket import Pocket
    rss0 = rss_mb()
    c = Cronometro()
    p = Pocket(threads=threads, **opts)
    load = c.fine()
    out = {"nome": nome, "opzioni": opts, "threads": threads, "primo": primo, "pezzo": pezzo, "riferimento_s": durata,
           "rss_python_mb": rss0, "caricamento_s": load[0], "rss_caricato_mb": rss_mb(), "carico_inizio": carico(),
           "frasi": []}
    voci = DATA / "lavoro" / "voci_v1"
    voci.mkdir(parents=True, exist_ok=True)
    for r in RIF:
        f_emb = voci / f"{opts['bundle']}_{r}_{durata}_emb.npy"
        if not f_emb.exists():       # encoded once in a separate process (v1_memoria measures it)
            subprocess.run([sys.executable, "-I", __file__, "--prepara", opts["bundle"], r, str(durata)], check=True)
        c = Cronometro()
        p.usa_embedding(np.load(f_emb).astype(np.float32))
        out.setdefault("voce_s", {})[r] = c.fine()[0]
        p.dici("Prova di riscaldamento.", seme=7)
        for f in frasi():
            c = Cronometro()
            audio, st = p.dici(f["normalizzato"], seme=1000 + f["id"], primo=primo, pezzo=pezzo)
            w, cpu = c.fine()
            scrivi(AUDIO / "v1" / nome / r / "s0" / f"f{f['id']}.wav", audio)
            out["frasi"].append({"rif": r, "id": f["id"], "audio_s": len(audio) / 24000, "orologio_s": w, "cpu_s": cpu, **st})
    fr = out["frasi"]
    tot = sum(x["audio_s"] for x in fr)
    out.update({"cpu_per_s": sum(x["cpu_s"] for x in fr) / tot, "orologio_per_s": sum(x["orologio_s"] for x in fr) / tot,
                "primo_suono_mediana_s": float(np.median([x["primo_suono_s"] for x in fr])),
                "primo_suono_max_s": max(x["primo_suono_s"] for x in fr),
                "frasi_con_vuoti": sum(1 for x in fr if x["vuoti"]), "vuoti": sum(x["vuoti"] for x in fr),
                "ritardo_max_s": max(x["ritardo_max_s"] for x in fr), "picco_mb": picco_mb(), "carico_fine": carico()})
    print(json.dumps(out, default=float))


def prepara(bundle: str, rif: str, durata: str):
    from pocket import Pocket
    p = Pocket(threads=2, bundle=bundle)
    d = None if durata == "None" else float(durata)
    emb = p.prepara(riferimenti()[rif]["file"], durata_s=d)
    np.save(DATA / "lavoro" / "voci_v1" / f"{bundle}_{rif}_{d}_emb.npy", emb.astype(np.float16))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("nomi", nargs="*")
    ap.add_argument("--worker")
    ap.add_argument("--prepara", nargs=3)
    a = ap.parse_args()
    if a.worker:
        worker(a.worker)
        return
    if a.prepara:
        prepara(*a.prepara)
        return
    path = ESITI / "v1" / "passo.jsonl"
    for nome in a.nomi or list(COMBO):
        t0 = time.time()
        p = subprocess.run([sys.executable, "-I", __file__, "--worker", nome], capture_output=True, text=True)
        if p.returncode:
            print(nome, "ERRORE", p.stderr[-800:], flush=True)
            continue
        r = json.loads(p.stdout.strip().splitlines()[-1])
        r["quando"] = t0
        with path.open("a") as f:
            f.write(json.dumps(r) + "\n")
        print(f"{nome:18s} cpu/s {r['cpu_per_s']:.3f} orologio/s {r['orologio_per_s']:.3f} primo suono "
              f"{r['primo_suono_mediana_s'] * 1000:.0f} ms (max {r['primo_suono_max_s'] * 1000:.0f}) frasi con vuoti "
              f"{r['frasi_con_vuoti']}/{len(r['frasi'])} ritardo max {r['ritardo_max_s'] * 1000:.0f} ms picco "
              f"{r['picco_mb']:.0f} MB carico {r['carico_inizio'][0]:.1f}", flush=True)


if __name__ == "__main__":
    main()
