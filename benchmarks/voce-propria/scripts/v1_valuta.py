# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-1: judge the utterances of v1_genera.py.

Per utterance: Whisper small transcript (settings of asr_check.py, Kalliope-normalized on both
sides), word errors, whether the FIRST word is right, duration; for the test sentences also
ECAPA and WeSpeaker similarity to the held-out clips (as in V-m).

Short phrases are transcribed with 0.5 s of silence before and after (see below).
First word right = the first transcribed word, accents stripped, equals or starts with the first
word of the text ("scusatemi" for "scusate, mi" is the transcriber merging two words, not a loss).
Writes ESITI/v1/valuta_<config>.json (per utterance) and prints a summary.
Usage: python -I v1_valuta.py CONFIG [CONFIG ...]
"""
from __future__ import annotations

import json
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, ESITI, PERSONE_INFO, leggi  # noqa: E402
from misure import Ecapa, WeSpeaker, Whisper, centroide, clip_persona, coseno, norm_parole  # noqa: E402
from v1_genera import testi  # noqa: E402


def senza_accenti(w: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", w) if unicodedata.category(c) != "Mn")


def prima_ok(ref: list[str], hyp: list[str]) -> bool:
    if not ref:
        return True
    if not hyp:
        return False
    r, h = senza_accenti(ref[0]), senza_accenti(hyp[0])
    return h == r or h.startswith(r)


def main():
    configs = sys.argv[1:]
    W, E, WS = Whisper(2), Ecapa(2), WeSpeaker(2)
    cen_e = {p: centroide([E.emb(f) for f in clip_persona(p, "tenuto")]) for p in PERSONE_INFO}
    cen_w = {p: centroide([WS.emb(f) for f in clip_persona(p, "tenuto")]) for p in PERSONE_INFO}
    tt = {(k, i): (testo, ref) for k, i, testo, ref in testi()}
    for cfg in configs:
        base = AUDIO / "v1" / cfg
        out_path = ESITI / "v1" / f"valuta_{cfg}.json"
        cache = {}
        if out_path.exists():
            for r in json.loads(out_path.read_text())["righe"]:
                cache[r["file"]] = r
        righe = []
        for wav in sorted(base.glob("*/s*/*.wav")):
            rel = str(wav.relative_to(base))
            key = f"{rel}:{wav.stat().st_mtime_ns}" + (":pad" if wav.stem.startswith("b") else "")
            if key in cache:
                righe.append(cache[key])
                continue
            rif, seme, nome = wav.parent.parent.name, int(wav.parent.name[1:]), wav.stem
            kind, i = nome[0], int(nome[1:])
            testo, ref = tt[(kind, i)]
            a = leggi(wav)
            # short phrases: 0.5 s of silence around the clip, as Klein's clips have, so that Whisper
            # does not invent text ("Sottotitoli a cura di ...") on a clip with no lead silence
            a_w = np.concatenate([np.zeros(12000, np.float32), a, np.zeros(12000, np.float32)]) if kind == "b" else a
            w = W.wer_frase(a_w, 24000, ref)
            ref_w = norm_parole(ref)
            from comune import normalizza_kalliope
            hyp_w = norm_parole(normalizza_kalliope([w["trascrizione"]])[0])
            r = {"file": key, "rif": rif, "seme": seme, "tipo": kind, "id": i, "testo": testo,
                 "durata_s": len(a) / 24000, **w, "prima_ok": prima_ok(ref_w, hyp_w)}
            persona = rif.rstrip("d")
            if kind == "f" and persona in cen_e:
                r["ecapa"] = coseno(E.emb_audio(_a16(a)), cen_e[persona])
                r["wespeaker"] = coseno(WS.emb_audio(_a16(a)), cen_w[persona])
            righe.append(r)
        out_path.write_text(json.dumps({"config": cfg, "righe": righe}, ensure_ascii=False, indent=1))
        f = [r for r in righe if r["tipo"] == "f"]
        b = [r for r in righe if r["tipo"] == "b"]

        def riass(rr):
            if not rr:
                return "—"
            e, n = sum(r["errori"] for r in rr), sum(r["parole"] for r in rr)
            return (f"prima parola persa/storpiata {sum(not r['prima_ok'] for r in rr)}/{len(rr)}, "
                    f"WER {100 * e / n:.1f}%")
        print(f"{cfg:16s} frasi: {riass(f)}"
              + (f", ECAPA {np.mean([r['ecapa'] for r in f]):.3f}, WeSpeaker {np.mean([r['wespeaker'] for r in f]):.3f}" if f and "ecapa" in f[0] else "")
              + f" | brevi: {riass(b)}, durata media {np.mean([r['durata_s'] for r in b]) if b else 0:.2f} s", flush=True)


def _a16(a24):
    from comune import ricampiona
    return ricampiona(a24, 24000, 16000)


if __name__ == "__main__":
    main()
