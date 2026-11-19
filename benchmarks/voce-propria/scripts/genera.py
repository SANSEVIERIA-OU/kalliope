# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Make the audio of one strategy for every reference and every test sentence.

Writes AUDIO/<strategy>/<reference>/<i>.wav and ESITI/genera_<strategy>.json (one-time and
per-sentence times as a side note; the cost table comes from costo.py, one test at a time).
For the converters the source is the program's own output (AUDIO/oggi), so that strategy 2 is
exactly "today's voice plus a converter". For the search, the program itself speaks with the
found voice (kalliope-cli on a model folder with one extra voice).

Usage: python -I genera.py STRATEGY [REF ...] [--threads 2]
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, DATA, ESITI, Cronometro, carico, frasi, picco_mb, riferimenti, scrivi  # noqa: E402


def genera_ricerca(rifs, strada="ricerca"):
    from klein import cartella_con_voci
    from oggi import say
    suff = "" if strada == "ricerca" else "_ecapa"
    out = {}
    for r in rifs:
        z = np.load(DATA / "lavoro" / "ricerca" / f"{r}{suff}.npz")
        voci = {f"xx_{r}": z["migliore"]}
        d = cartella_con_voci(DATA / "lavoro" / "klein-voci" / f"{r}{suff}", voci)
        for f in frasi():
            res = say(f["testo"], AUDIO / strada / r / f"{f['id']}.wav", f"xx_{r}", d)
            out.setdefault(r, []).append(res)
        print(strada, r, flush=True)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("strada")
    ap.add_argument("rif", nargs="*")
    ap.add_argument("--threads", type=int, default=2)
    a = ap.parse_args()
    tutti = riferimenti()
    rifs = a.rif or list(tutti)
    if a.strada in ("ricerca", "ricerca-ecapa"):
        path = ESITI / f"genera_{a.strada}.json"
        prev = json.loads(path.read_text()) if path.exists() else {}
        prev.update(genera_ricerca(rifs, a.strada))
        path.write_text(json.dumps(prev, ensure_ascii=False, indent=1))
        return
    from strade import build, paragrafo_klein
    if a.strada == "openvoice":
        paragrafo_klein()
    c = Cronometro()
    s = build(a.strada, a.threads)
    load_w, load_c = c.fine()
    if hasattr(s, "sorgente_cli"):
        s.sorgente_cli = True
    rapporto = {"strada": a.strada, "threads": a.threads, "carico": carico(), "caricamento_s": load_w,
                "caricamento_cpu_s": load_c, "riferimenti": {}}
    for r in rifs:
        info = {**tutti[r], "rif": r}
        c = Cronometro()
        s.prepara(info)
        pw, pc = c.fine()
        frasi_out = []
        for f in frasi():
            c = Cronometro()
            audio = s.dici(f)
            w, cpu = c.fine()
            scrivi(AUDIO / a.strada / r / f"{f['id']}.wav", audio, s.sr)
            frasi_out.append({"id": f["id"], "orologio_s": w, "cpu_s": cpu, "audio_s": len(audio) / s.sr})
        rapporto["riferimenti"][r] = {"preparazione_s": pw, "preparazione_cpu_s": pc, "frasi": frasi_out}
        print(a.strada, r, f"prep {pc:.1f} cpu-s", " ".join(f"{x['cpu_s'] / max(x['audio_s'], 1e-3):.2f}"
                                                           for x in frasi_out), flush=True)
    rapporto["picco_mb"] = picco_mb()
    (ESITI / f"genera_{a.strada}.json").write_text(json.dumps(rapporto, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
