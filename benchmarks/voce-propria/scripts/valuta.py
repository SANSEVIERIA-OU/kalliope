# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Similarity, wrong words and simple listening aids for every generated file, plus baselines.

For each AUDIO/<strategy>/<reference>/<i>.wav:
  ecapa       cosine with the centroid of the person's four held-out clips (ECAPA-TDNN)
  resemblyzer the same with Resemblyzer (the search's own judge: biased in favour of strategy 3)
  wespeaker   the same with WeSpeaker ResNet34 (a third judge, used by no strategy)
  errori/parole/trascrizione  Whisper small (asr_check.py settings), Kalliope-normalized on both sides
  durata_s, f0_mediana_hz, f0_sd_semitoni (pYIN), picco/clip
Baselines: the person against herself (five check clips), other people of the same sex, today's
voice, the reference and the ruined reference.

Results are cached per file (path + modification time) in ESITI/qualita_cache.json.
Usage: python -I valuta.py [strategy ...]
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, ESITI, PERSONE, PERSONE_INFO, frasi, leggi, riferimenti  # noqa: E402
from misure import Ecapa, Resemblyzer, WeSpeaker, Whisper, centroide, clip_persona, coseno  # noqa: E402

CACHE = ESITI / "qualita_cache.json"


def f0_stats(a: np.ndarray, sr: int) -> tuple[float, float]:
    import librosa
    a16 = librosa.resample(a, orig_sr=sr, target_sr=16000)
    f0, voiced, _ = librosa.pyin(a16, fmin=60, fmax=450, sr=16000, frame_length=1024)
    f = f0[voiced]
    if f.size < 5:
        return float("nan"), float("nan")
    st = 12 * np.log2(f / np.median(f))
    return float(np.median(f)), float(np.std(st))


def main():
    strade = sys.argv[1:] or sorted(p.name for p in AUDIO.iterdir() if p.is_dir())
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    E, R, WS = Ecapa(2), Resemblyzer(2), WeSpeaker(2)
    W = None
    fr = frasi()
    cen_e = {p: centroide([E.emb(f) for f in clip_persona(p, "tenuto")]) for p in PERSONE_INFO}
    cen_r = {p: centroide([R.emb_audio(leggi(f), 24000) for f in clip_persona(p, "tenuto")]) for p in PERSONE_INFO}
    cen_w = {p: centroide([WS.emb(f) for f in clip_persona(p, "tenuto")]) for p in PERSONE_INFO}

    def misura(path: Path, persona: str, frase: dict | None) -> dict:
        nonlocal W
        key = f"{path}:{path.stat().st_mtime_ns}:{persona}"
        if key in cache:
            if "wespeaker" not in cache[key]:
                cache[key]["wespeaker"] = coseno(WS.emb(path), cen_w[persona])
            return cache[key]
        if W is None and frase is not None:
            W = Whisper(2)
        import soundfile as sf
        a, sr = sf.read(str(path), dtype="float32")
        r = {"ecapa": coseno(E.emb(path), cen_e[persona]),
             "resemblyzer": coseno(R.emb_audio(a, sr), cen_r[persona]),
             "wespeaker": coseno(WS.emb(path), cen_w[persona]),
             "durata_s": len(a) / sr, "sr": sr}
        r["f0_mediana_hz"], r["f0_sd_semitoni"] = f0_stats(a, sr)
        if frase is not None:
            r.update(W.wer_frase(a, sr, " ".join(frase["frasi_normalizzate"])))
        cache[key] = r
        return r

    out = {"basi": {}, "strade": {}}
    # baselines
    for p in PERSONE_INFO:
        sesso = PERSONE_INFO[p]["sesso"]
        b = {"se_stessa": [misura(f, p, None) for f in clip_persona(p, "controllo")],
             "riferimento": misura(PERSONE / p / "riferimento.wav", p, None),
             "altre_stesso_sesso": [misura(f, p, None) for q in PERSONE_INFO
                                    if q != p and PERSONE_INFO[q]["sesso"] == sesso for f in clip_persona(q, "controllo")]}
        if (PERSONE / p / "riferimento_degradato.wav").exists():
            b["riferimento_degradato"] = misura(PERSONE / p / "riferimento_degradato.wav", p, None)
        out["basi"][p] = b
        CACHE.write_text(json.dumps(cache))
    # generated audio
    rifs = riferimenti()
    for s in strade:
        out["strade"][s] = {}
        for r, info in rifs.items():
            if s == "oggi":
                d = AUDIO / "oggi" / info["klein"]
            else:
                d = AUDIO / s / r
            if not d.exists():
                continue
            righe = [dict(id=f["id"], **misura(d / f"{f['id']}.wav", info["persona"], f)) for f in fr
                     if (d / f"{f['id']}.wav").exists()]
            out["strade"][s][r] = righe
            e = sum(x["errori"] for x in righe)
            n = sum(x["parole"] for x in righe)
            print(f"{s:12s} {r:4s} ecapa {np.mean([x['ecapa'] for x in righe]):.3f} "
                  f"resem {np.mean([x['resemblyzer'] for x in righe]):.3f} wesp {np.mean([x['wespeaker'] for x in righe]):.3f} WER {100 * e / max(n, 1):5.1f}% "
                  f"({e}/{n}) f0 {np.nanmedian([x['f0_mediana_hz'] for x in righe]):.0f}Hz", flush=True)
            CACHE.write_text(json.dumps(cache))
    prev = json.loads((ESITI / "qualita.json").read_text()) if (ESITI / "qualita.json").exists() else {"strade": {}}
    prev["basi"] = out["basi"]
    prev["strade"].update(out["strade"])
    (ESITI / "qualita.json").write_text(json.dumps(prev, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
