# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-4, part A step 4: does the length of the recording change how much of the sentence is said?

In the check (v4_controllo.py) the voice F1, cloned from her 25 s reference, drops the end of the
longer sentences with the official code as with the graphs (WER 31-33%), while giovanni (a 7 s
recording) says them. Here the four LibriVox readers of V-m (public domain, internal measure only) are
cloned from the first 6, 10, 15 and 25 s of their reference, cut at the quietest 20 ms inside the last
1.5 s, and say the five test sentences (one seed) through the graphs (scripts/v4_onnx.py). Judged with
Whisper (WER, first word, length of the audio) and ECAPA against the held-out clips.

Writes ESITI/v4/lunghezza.json (merged with earlier runs). Usage: python -I v4_lunghezza.py [SECONDS ...]
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, ESITI, MODELLI, PERSONE, PERSONE_INFO, leggi, ricampiona, scrivi  # noqa: E402

DURATE = (6, 10, 15, 25)


def taglia(a: np.ndarray, sec: float, sr: int = 24000) -> np.ndarray:
    if len(a) <= sec * sr:
        return a
    fine = int(sec * sr)
    inizio = fine - int(1.5 * sr)
    fr = 480
    rms = [float(np.sqrt(np.mean(a[i:i + fr] ** 2))) for i in range(inizio, fine - fr, fr)]
    return a[: inizio + int(np.argmin(rms)) * fr + fr // 2]


def main():
    os.environ["OMP_NUM_THREADS"] = "2"
    from misure import Ecapa, Whisper, centroide, clip_persona, coseno, norm_parole
    from comune import normalizza_kalliope
    from v1_genera import testi
    from v1_valuta import prima_ok
    from v4_onnx import PocketV4
    p = PocketV4(MODELLI / "pocket-onnx-v4" / "italian")
    tt = [(i, testo, ref) for k, i, testo, ref in testi() if k == "f"]
    W, E = Whisper(2), Ecapa(2)
    durate = [int(x) for x in sys.argv[1:]] or DURATE
    path = ESITI / "v4" / "lunghezza.json"
    out = json.loads(path.read_text()) if path.exists() else {}
    for persona in PERSONE_INFO:
        cen = centroide([E.emb(f) for f in clip_persona(persona, "tenuto")])
        ref_audio = leggi(PERSONE / persona / "riferimento.wav", 24000)
        for sec in durate:
            past = p.stato_da_registrazione(taglia(ref_audio, sec))
            righe = []
            for i, testo, ref in tt:
                a = p.dici(past, testo, 1000 + i)
                scrivi(AUDIO / "v4" / "lunghezza" / persona / f"{sec}s" / f"f{i}.wav", a)
                w = W.wer_frase(a, 24000, ref)
                hyp = norm_parole(normalizza_kalliope([w["trascrizione"]])[0])
                righe.append({"id": i, "durata_s": len(a) / 24000, **w, "prima_ok": prima_ok(norm_parole(ref), hyp),
                              "ecapa": coseno(E.emb_audio(ricampiona(a, 24000, 16000)), cen)})
            e, n = sum(r["errori"] for r in righe), sum(r["parole"] for r in righe)
            out[f"{persona}_{sec}"] = {"persona": persona, "secondi": sec, "posizioni": int(past[0].shape[2]),
                                       "wer": e / n, "prima_persa": sum(not r["prima_ok"] for r in righe),
                                       "ecapa": float(np.mean([r["ecapa"] for r in righe])),
                                       "durata_audio_s": float(sum(r["durata_s"] for r in righe)), "righe": righe}
            print(persona, sec, "s", f"WER {100 * e / n:.1f}%", "prima persa", out[f'{persona}_{sec}']['prima_persa'],
                  f"ECAPA {out[f'{persona}_{sec}']['ecapa']:.3f}", f"audio {out[f'{persona}_{sec}']['durata_audio_s']:.1f} s", flush=True)
    path.write_text(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
