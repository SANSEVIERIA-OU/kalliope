# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-1: memory and time of preparing the voice (Mimi encoder of the reference), each setting in a
fresh process; and the saved voice: file size and reload time.

Settings: reference length (10, 15, 25 s), whole or in overlapping pieces, encoder fp32 or int8,
ONNX Runtime arena on or off. For pieces and int8 the latents are compared with the whole fp32
encoding of the same audio (cosine per frame, minimum and mean).

Usage: python -I v1_memoria.py [--bundle italian] [--rif F1]
       (internal: --worker JSON)
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

from comune import DATA, ESITI, Cronometro, carico, leggi, picco_mb, riferimenti, rss_mb  # noqa: E402

LAT = DATA / "lavoro" / "v1_latenti"


def worker(cfg: dict):
    for k in ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS"):
        os.environ[k] = str(cfg["threads"])
    from pocket import Pocket, fine_su_pausa
    rss0 = rss_mb()
    p = Pocket(threads=cfg["threads"], bundle=cfg["bundle"], enc=cfg["enc"], arena=cfg["arena"])
    rss_load = rss_mb()
    from pocket import taglia_su_pausa
    audio = taglia_su_pausa(leggi(riferimenti()[cfg["rif"]]["file"]), cfg["durata"])
    c = Cronometro()
    emb = p.codifica(audio, cfg["pezzo"])
    w, cpu = c.fine()
    out = {**cfg, "rss_python_mb": rss0, "rss_modelli_mb": rss_load, "codifica_s": w, "codifica_cpu_s": cpu,
           "picco_codifica_mb": picco_mb(), "frames": int(emb.shape[1])}
    LAT.mkdir(parents=True, exist_ok=True)
    tag = f"{cfg['bundle']}_{cfg['rif']}_{cfg['durata']}_{cfg['enc']}_{cfg['pezzo']}"
    np.save(LAT / f"{tag}.npy", emb)
    ref = LAT / f"{cfg['bundle']}_{cfg['rif']}_{cfg['durata']}_fp32_None.npy"
    if ref.exists() and tag != ref.stem:
        r = np.load(ref)[0]
        e = emb[0]
        n = min(len(r), len(e))
        cos = (r[:n] * e[:n]).sum(1) / (np.linalg.norm(r[:n], axis=1) * np.linalg.norm(e[:n], axis=1) + 1e-9)
        out.update({"coseno_min": float(cos.min()), "coseno_medio": float(cos.mean()), "frames_rif": len(r)})
    if cfg.get("salva"):
        c = Cronometro()
        p.usa_embedding(emb)
        cond = c.fine()
        voce = DATA / "lavoro" / "voci_v1"
        voce.mkdir(parents=True, exist_ok=True)
        f_emb = voce / f"{tag}_emb.npy"
        np.save(f_emb, emb.astype(np.float16))
        f_st = voce / f"{tag}_stato.npz"
        used = p.salva_stato(f_st)
        c = Cronometro()
        p.carica_stato(f_st)
        load_st = c.fine()
        c = Cronometro()
        p.usa_embedding(np.load(f_emb).astype(np.float32))
        load_emb = c.fine()
        out.update({"condizionamento_s": cond[0], "condizionamento_cpu_s": cond[1], "posizioni": used,
                    "file_embedding_kb": f_emb.stat().st_size / 1e3, "file_stato_kb": f_st.stat().st_size / 1e3,
                    "ricarica_stato_s": load_st[0], "ricarica_da_embedding_s": load_emb[0],
                    "ricarica_da_embedding_cpu_s": load_emb[1]})
    out["carico"] = carico()
    print(json.dumps(out))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--worker")
    ap.add_argument("--bundle", default="italian")
    ap.add_argument("--rif", default="F1")
    ap.add_argument("--threads", type=int, default=2)
    a = ap.parse_args()
    if a.worker:
        worker(json.loads(a.worker))
        return
    # the lighter settings first, the whole 25 s encodings (4-5 GB in V-m) last
    prove = [dict(durata=10, enc="fp32", pezzo=None, arena=False, salva=True),
             dict(durata=15, enc="fp32", pezzo=None, arena=False, salva=True),
             dict(durata=25, enc="fp32", pezzo=5.0, arena=False, salva=True),
             dict(durata=25, enc="fp32", pezzo=10.0, arena=False),
             dict(durata=25, enc="int8", pezzo=5.0, arena=False),
             dict(durata=25, enc="fp32", pezzo=5.0, arena=True),
             dict(durata=25, enc="fp32", pezzo=None, arena=False, salva=True),
             dict(durata=25, enc="int8", pezzo=None, arena=False),
             dict(durata=25, enc="fp32", pezzo=None, arena=True)]
    path = ESITI / "v1" / "memoria.jsonl"
    for pr in prove:
        cfg = {**pr, "bundle": a.bundle, "rif": a.rif, "threads": a.threads}
        p = subprocess.run([sys.executable, "-I", __file__, "--worker", json.dumps(cfg)], capture_output=True, text=True)
        if p.returncode:
            print("ERRORE", cfg, p.stderr[-600:], flush=True)
            continue
        r = json.loads(p.stdout.strip().splitlines()[-1])
        r["quando"] = time.time()
        with path.open("a") as f:
            f.write(json.dumps(r) + "\n")
        print(f"{a.bundle} {r['durata']}s enc={r['enc']} pezzo={r['pezzo']} arena={r['arena']}: picco {r['picco_codifica_mb']:.0f} MB, "
              f"{r['codifica_cpu_s']:.1f} cpu-s, coseno min {r.get('coseno_min', 1):.4f}"
              + (f", stato {r['file_stato_kb']:.0f} kB, embedding {r['file_embedding_kb']:.0f} kB, ricarica {r['ricarica_stato_s']*1000:.0f} ms / {r['ricarica_da_embedding_s']*1000:.0f} ms" if "file_stato_kb" in r else ""),
              flush=True)


    confronta(a.bundle, a.rif)


def confronta(bundle: str, rif: str):
    """Cosine per frame of every encoding of the 25 s reference against the whole fp32 one."""
    ref_p = LAT / f"{bundle}_{rif}_25_fp32_None.npy"
    if not ref_p.exists():
        return
    r = np.load(ref_p)[0]
    out = {}
    for f in sorted(LAT.glob(f"{bundle}_{rif}_25_*.npy")):
        if f == ref_p:
            continue
        e = np.load(f)[0]
        n = min(len(r), len(e))
        cos = (r[:n] * e[:n]).sum(1) / (np.linalg.norm(r[:n], axis=1) * np.linalg.norm(e[:n], axis=1) + 1e-9)
        out[f.stem] = {"coseno_min": float(cos.min()), "coseno_medio": float(cos.mean()), "frames": [len(e), len(r)]}
        print(f.stem, f"coseno min {cos.min():.4f} medio {cos.mean():.4f} frames {len(e)}/{len(r)}", flush=True)
    (ESITI / "v1" / f"memoria_coseni_{bundle}_{rif}.json").write_text(json.dumps(out, indent=1))


if __name__ == "__main__":
    main()
