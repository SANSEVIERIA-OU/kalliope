# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""V-1: generate the test sentences and the short meeting phrases with one Pocket configuration,
for the four people, with several seeds; record streaming timing and CPU per utterance.

Writes AUDIO/v1/<config>/<ref>/s<seed>/<kind><i>.wav and ESITI/v1/genera_<config>.json.
Usage: python -I v1_genera.py CONFIG [--semi 0 1] [--rif F1 F2 M1 M2] [--threads 2]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from comune import AUDIO, ESITI, Cronometro, carico, frasi, normalizza_kalliope, picco_mb, riferimenti, scrivi  # noqa: E402

# Short phrases that are frequent in a meeting (one or two words), through Kalliope's normalizer.
BREVI = ["Sì.", "No.", "Grazie.", "Un attimo.", "Va bene.", "Certo.", "Esatto.", "Ciao a tutti.", "Scusate.",
         "Mi sentite?", "Arrivo subito.", "D'accordo.", "Perfetto, grazie!", "Un momento, per favore.",
         "Buongiorno.", "A dopo."]

# Configurations: old = the export's wrapper as used in V-m; the others switch on what the
# official code does, one thing at a time, then all together.
CONFIG = {
    "vecchia": dict(temperatura=0.7, fine_pausa=False, min_eos=0, fade_in=False),
    "pausa": dict(temperatura=0.7, fine_pausa=True, min_eos=0, fade_in=False),
    "temp03": dict(temperatura=0.3, fine_pausa=False, min_eos=0, fade_in=False),
    "ufficiale": dict(temperatura=0.3, fine_pausa=True, min_eos=6, fade_in=True),
}


def testi():
    fr = frasi()
    out = [("f", f["id"], f["normalizzato"], " ".join(f["frasi_normalizzate"])) for f in fr]
    path = ESITI / "v1" / "brevi.json"
    if path.exists():
        br = json.loads(path.read_text())
    else:
        norm = normalizza_kalliope(BREVI)
        br = [{"id": i, "testo": t, "normalizzato": n[:1].upper() + n[1:]} for i, (t, n) in enumerate(zip(BREVI, norm))]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(br, ensure_ascii=False, indent=1))
    out += [("b", b["id"], b["normalizzato"], b["normalizzato"].lower()) for b in br]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("config")
    ap.add_argument("--bundle", default="italian")
    ap.add_argument("--semi", type=int, nargs="+", default=[0, 1])
    ap.add_argument("--rif", nargs="+", default=["F1", "F2", "M1", "M2"])
    ap.add_argument("--threads", type=int, default=2)
    ap.add_argument("--solo", choices=("f", "b"), default=None)
    ap.add_argument("--extra", default="{}", help="JSON with extra Pocket options (precision, ...)")
    ap.add_argument("--durata", type=float, default=None, help="reference cut to this many seconds (at a pause)")
    a = ap.parse_args()
    for k in ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS"):
        os.environ[k] = str(a.threads)
    from pocket import Pocket
    nome = f"{a.config}-{'24' if a.bundle.endswith('24l') else '6'}" + (f"-r{a.durata:g}" if a.durata else "")
    opts = {**CONFIG[a.config], **json.loads(a.extra)}
    c = Cronometro()
    p = Pocket(threads=a.threads, bundle=a.bundle, **opts)
    load = c.fine()
    rif_all = riferimenti()
    rep = {"config": nome, "opzioni": opts, "durata_riferimento": a.durata, "bundle": a.bundle, "threads": a.threads, "carico": carico(),
           "caricamento": load, "righe": []}
    for r in a.rif:
        c = Cronometro()
        p.prepara(rif_all[r]["file"], durata_s=a.durata)
        prep = c.fine()
        for seme in a.semi:
            for kind, i, testo, _ in testi():
                if a.solo and kind != a.solo:
                    continue
                c = Cronometro()
                audio, st = p.dici(testo, seme=1000 * seme + (i if kind == "f" else 100 + i))
                w, cpu = c.fine()
                scrivi(AUDIO / "v1" / nome / r / f"s{seme}" / f"{kind}{i}.wav", audio)
                rep["righe"].append({"rif": r, "seme": seme, "tipo": kind, "id": i, "cpu_s": cpu, "orologio_s": w,
                                     "audio_s": len(audio) / 24000, **st})
        rep.setdefault("preparazione", {})[r] = prep
        print(nome, r, f"prep {prep[1]:.1f} cpu-s", flush=True)
    rep["picco_mb"] = picco_mb()
    (ESITI / "v1").mkdir(parents=True, exist_ok=True)
    out = ESITI / "v1" / f"genera_{nome}.json"
    old = json.loads(out.read_text()) if out.exists() else None
    if old and old.get("opzioni") == opts:
        keep = [x for x in old["righe"] if not (x["rif"] in a.rif and x["seme"] in a.semi
                                                 and (a.solo is None or x["tipo"] == a.solo))]
        rep["righe"] = keep + rep["righe"]
    out.write_text(json.dumps(rep, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
