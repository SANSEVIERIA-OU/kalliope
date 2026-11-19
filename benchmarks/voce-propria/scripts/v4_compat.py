# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""V-4, part A step 1: the gated Italian weights against the open ones, tensor by tensor.

kyutai/pocket-tts@3e82814a (gated, with voice cloning) against
kyutai/pocket-tts-without-voice-cloning@1e08e6a2 (open), for the 6- and 24-layer Italian models, which
the official config pins together. Expected: equal everywhere except the part that encodes a voice
(the Mimi encoder, its transformer and the downsample), which the open file has zeroed. For each
tensor: same name and shape, identical bits, largest absolute value in each file.

Writes ESITI/v4/compatibilita.json. Usage: python -I v4_compat.py
"""
from __future__ import annotations

import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))


from comune import ESITI, MODELLI  # noqa: E402

GATED = MODELLI / "pocket-tts-gated" / "languages"
APERTI = MODELLI / "pocket-tts-senza-clonazione"


def gruppo(nome: str) -> str:
    parti = nome.split(".")
    if parti[0] == "mimi":
        return "mimi." + parti[1]
    if parti[0] == "flow_lm" and parti[1] in ("transformer", "flow_net", "conditioner"):
        return "flow_lm." + parti[1]
    return nome


def confronta(a: Path, b: Path) -> dict:
    import torch
    from safetensors import safe_open
    out = {"gruppi": {}, "solo_gated": [], "solo_aperti": [], "diversi": []}
    righe = defaultdict(lambda: {"tensori": 0, "uguali": 0, "zero_negli_aperti": 0, "zero_nei_gated": 0})
    with safe_open(str(a), "pt") as fa, safe_open(str(b), "pt") as fb:
        ka, kb = set(fa.keys()), set(fb.keys())
        out["solo_gated"] = sorted(ka - kb)
        out["solo_aperti"] = sorted(kb - ka)
        for k in sorted(ka & kb):
            x, y = fa.get_tensor(k), fb.get_tensor(k)
            g = righe[gruppo(k)]
            g["tensori"] += 1
            if x.shape != y.shape:
                out["diversi"].append({"tensore": k, "forma_gated": list(x.shape), "forma_aperti": list(y.shape)})
                continue
            # bit-identical (NaN included): the raw bytes
            uguale = x.dtype == y.dtype and torch.equal(x.contiguous().view(-1).view(torch.uint8),
                                                        y.contiguous().view(-1).view(torch.uint8))
            g["uguali"] += int(uguale)
            ma, mb = float(x.float().abs().max()), float(y.float().abs().max())
            g["zero_negli_aperti"] += int(mb == 0.0 and ma > 0.0)
            g["zero_nei_gated"] += int(ma == 0.0)
            if not uguale:
                out["diversi"].append({"tensore": k, "max_abs_gated": ma, "max_abs_aperti": mb})
    out["gruppi"] = dict(righe)
    return out


def main():
    res = {}
    for nome in ("italian", "italian_24l"):
        r = confronta(GATED / nome / "model.safetensors", APERTI / nome / "model.safetensors")
        res[nome] = r
        print(nome, "solo gated:", len(r["solo_gated"]), "solo aperti:", len(r["solo_aperti"]), flush=True)
        for g, v in sorted(r["gruppi"].items()):
            print(f"  {g:40s} {v}", flush=True)
        diversi_fuori = [d["tensore"] for d in r["diversi"]
                         if not d["tensore"].startswith(("mimi.encoder.", "mimi.encoder_transformer.", "mimi.downsample."))]
        r["diversi_fuori_dall_encoder"] = diversi_fuori
        print("  diversi fuori dall'encoder:", diversi_fuori, flush=True)
    (ESITI / "v4").mkdir(parents=True, exist_ok=True)
    (ESITI / "v4" / "compatibilita.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
