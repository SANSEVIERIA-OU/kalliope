# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""V-4, part A step 2: the reference chain in Python, official code and settings.

For each voice whose recording is open and whose ready state Kyutai publishes (giovanni, anna, marius,
alba): the voice cloned from the recording by the official code (get_state_for_audio_prompt: end on
pause, Mimi encoder, speaker projection, bos_before_voice) against Kyutai's ready state for the same
voice. Compared: the length of the state, its KV caches layer by layer, and the speech of three
sentences (same seed): ECAPA of the cloned voice against the ready one, against two baselines (the ready
voice with another seed; another ready voice), and Whisper's words.

Writes ESITI/v4/riferimento_<layers>.json and AUDIO/v4/riferimento/<layers>/.
Usage: python -I v4_riferimento.py [--strati 6|24]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, ESITI, picco_mb, ricampiona, scrivi  # noqa: E402
from v4_comune import REGISTRAZIONI, modello, pronta  # noqa: E402

TESTI = ["Buongiorno a tutti, scrivo invece di parlare, ma vi seguo benissimo.",
         "Il preventivo è di mille euro.", "Va bene."]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--strati", type=int, default=6)
    a = ap.parse_args()
    os.environ["OMP_NUM_THREADS"] = "2"
    import torch
    from misure import Ecapa, Whisper, coseno
    m = modello(a.strati, 0.3)
    E, W = Ecapa(2), Whisper(2)
    voci = list(REGISTRAZIONI)
    pronte = {v: m.get_state_for_audio_prompt(str(pronta(v, a.strati))) for v in voci}

    def cache_cos(sa, sb):
        cs = []
        for k in sa:
            if "cache" in sa[k] and k in sb:
                x, y = sa[k]["cache"], sb[k]["cache"]
                n = min(x.shape[2], y.shape[2])
                x = x[:, :, :n].float().reshape(-1).numpy()
                y = y[:, :, :n].float().reshape(-1).numpy()
                ok = np.isfinite(x) & np.isfinite(y)
                cs.append(float(x[ok] @ y[ok] / (np.linalg.norm(x[ok]) * np.linalg.norm(y[ok]))))
        return cs

    def parla(st, testo, seme):
        torch.manual_seed(seme)
        return m.generate_audio(st, testo, copy_state=True).numpy()

    out = {"strati": a.strati, "voci": {}}
    for v in voci:
        st_c = m.get_state_for_audio_prompt(Path(REGISTRAZIONI[v]))
        lun_c = int(next(iter(st_c.values()))["offset"][0])
        lun_p = int(next(iter(pronte[v].values()))["offset"][0])
        cc = cache_cos(st_c, pronte[v])
        altra = voci[(voci.index(v) + 1) % len(voci)]
        righe = []
        for i, t in enumerate(TESTI):
            a_p0, a_p1 = parla(pronte[v], t, 10 + i), parla(pronte[v], t, 20 + i)
            a_c, a_o = parla(st_c, t, 10 + i), parla(pronte[altra], t, 10 + i)
            for nome, x in (("pronta", a_p0), ("pronta_seme2", a_p1), ("clonata", a_c), ("altra_voce", a_o)):
                scrivi(AUDIO / "v4" / "riferimento" / str(a.strati) / v / f"{nome}_{i}.wav", x)
            e = {n: E.emb_audio(ricampiona(x, 24000, 16000)) for n, x in (("p0", a_p0), ("p1", a_p1), ("c", a_c), ("o", a_o))}
            z = np.zeros(12000, np.float32)
            righe.append({"testo": t,
                          "ecapa_clonata_contro_pronta": coseno(e["c"], e["p0"]),
                          "ecapa_pronta_contro_pronta_altro_seme": coseno(e["p0"], e["p1"]),
                          "ecapa_altra_voce_contro_pronta": coseno(e["o"], e["p0"]),
                          "whisper_clonata": W.trascrivi(np.concatenate([z, a_c, z]), 24000),
                          "whisper_pronta": W.trascrivi(np.concatenate([z, a_p0, z]), 24000),
                          "durata_clonata_s": len(a_c) / 24000, "durata_pronta_s": len(a_p0) / 24000})
            print(v, i, {k: (round(x, 3) if isinstance(x, float) else x) for k, x in righe[-1].items()}, flush=True)
        out["voci"][v] = {"posizioni_clonata": lun_c, "posizioni_pronta": lun_p,
                          "coseno_cache_clonata_contro_pronta": cc, "frasi": righe}
        print(v, "posizioni", lun_c, lun_p, "coseno cache", np.round(cc, 4), flush=True)
    out["picco_mb"] = picco_mb()
    (ESITI / "v4").mkdir(parents=True, exist_ok=True)
    (ESITI / "v4" / f"riferimento_{a.strati}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print("picco", out["picco_mb"], "MB", flush=True)


if __name__ == "__main__":
    main()
