# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Similarity over time for strategy 3: the best voice the search had after N minutes of CPU,
judged on the five test sentences against the held-out clips (ECAPA), next to the search's own
score (Resemblyzer on the two search sentences against the reference).

Writes ESITI/curva.json and AUDIO/miscela/<ref>/<i>.wav (the starting point of the search: the
closest stock voice or blend, i.e. what one gets by only choosing among Klein's voices).
With --giudice ecapa it reads the side experiment (search judged by ECAPA on the reference): then
ECAPA is no longer independent, and WeSpeaker (used by no search) is the check that counts.
Usage: python -I curva.py [REF ...] [--giudice ecapa]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, DATA, ESITI, PERSONE_INFO, frasi, riferimenti, scrivi  # noqa: E402
from klein import Klein  # noqa: E402
from misure import Ecapa, WeSpeaker, centroide, clip_persona, coseno  # noqa: E402

MINUTI = [0, 1, 2, 5, 10, 15, 20, 30, 40, 50, 60]


def main():
    args = sys.argv[1:]
    suff = ""
    if "--giudice" in args:
        i = args.index("--giudice")
        suff = "_" + args[i + 1] if args[i + 1] != "resemblyzer" else ""
        args = args[:i] + args[i + 2:]
    rifs = args or list(riferimenti())
    K, E, WS = Klein(2), Ecapa(2), WeSpeaker(2)
    fr = frasi()
    cen = {p: centroide([E.emb(f) for f in clip_persona(p, "tenuto")]) for p in PERSONE_INFO}
    cen_w = {p: centroide([WS.emb(f) for f in clip_persona(p, "tenuto")]) for p in PERSONE_INFO}
    path = ESITI / "curva.json"
    out = json.loads(path.read_text()) if path.exists() else {}
    for r in rifs:
        info = riferimenti()[r]
        j = ESITI / "ricerca" / f"{r}{suff}.json"
        if not j.exists():
            continue
        d = json.loads(j.read_text())
        z = np.load(DATA / "lavoro" / "ricerca" / f"{r}{suff}.npz")
        validi = [k for k, s in enumerate(d["storia"]) if not s.get("scartato")]
        t0 = d["storia"][0]["cpu_s"]          # end of the start phase (17 voices and blends)

        def giudica(vec, salva=None):
            sims, simw = [], []
            for f in fr:
                a = K.synth(f["fonemi"], vec)
                if salva:
                    scrivi(AUDIO / salva / r / f"{f['id']}.wav", a)
                sims.append(coseno(E.emb_audio(_a16(a)), cen[info["persona"]]))
                simw.append(coseno(WS.emb_audio(_a16(a)), cen_w[info["persona"]]))
            return float(np.mean(sims)), float(np.mean(simw))

        punti = []
        for m in MINUTI:
            limite = t0 + 60 * m
            ks = [k for k in validi if d["storia"][k]["cpu_s"] <= limite]
            if not ks:
                continue
            k = ks[-1]
            s = d["storia"][k]
            ec, ws = giudica(z["vettori"][k], "miscela" if (m == 0 and not suff) else None)
            punti.append({"minuti_cpu_cammino": m, "cpu_s_totali": s["cpu_s"], "passo": s["passo"],
                          "punteggio_ricerca": s["somiglianza_resemblyzer"],
                          "ecapa_frasi_di_prova": ec, "wespeaker_frasi_di_prova": ws})
            print(r + suff, m, round(ec, 3), round(ws, 3), round(s["somiglianza_resemblyzer"], 3), flush=True)
        out = json.loads(path.read_text()) if path.exists() else {}   # re-read: other runs may have written
        out[r + suff] = {"giudice_ricerca": d.get("giudice", "resemblyzer"), "partenza": d["partenza"]["scelta"], "cpu_partenza_s": t0, "punti": punti,
                  "passi": d["passi"], "cpu_s": d["cpu_s"]}
        path.write_text(json.dumps(out, ensure_ascii=False, indent=1))


def _a16(a24: np.ndarray) -> np.ndarray:
    from comune import ricampiona
    return ricampiona(a24, 24000, 16000)


if __name__ == "__main__":
    main()
