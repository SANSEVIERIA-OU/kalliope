# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-2, step 1: are the weights of May and of the current Italian release compatible?

Compared tensor by tensor (shape, identical bits, largest absolute difference relative to the
largest value):
- the open weights of the May release (kyutai/pocket-tts-without-voice-cloning@e7205b6e, Italian)
  against the open weights of the current release (@1e08e6a2, Italian 6 and 24 layers): the Mimi codec
  (encoder, encoder transformer, downsample, quantizer, upsample, decoder, decoder transformer), the
  speaker projection, bos_before_voice, the rest of the flow LM;
- which tensors the open files have zeroed (voice cloning removed);
- the May ONNX export (xennonf4/pocket-tts-onnx, Italian 6 layers) against the May open weights: the
  decoder side of the codec, the downsample and the speaker projection (the MatMul at the end of
  mimi_encoder.onnx), to know what the export's encoder really is.

Writes ESITI/v2/compatibilita.json. Usage: python -I v2_compat.py
"""
from __future__ import annotations

import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import ESITI, MODELLI, POCKET_DIR  # noqa: E402

BASE = MODELLI / "pocket-tts-senza-clonazione"
FILE = {
    "maggio_6": BASE / "italian-vecchio" / "model.safetensors",
    "attuale_6": BASE / "italian" / "model.safetensors",
    "attuale_24": BASE / "italian_24l" / "model.safetensors",
}


def carica(path: Path) -> dict[str, np.ndarray]:
    from safetensors import safe_open
    out = {}
    with safe_open(str(path), framework="pt") as f:
        for k in f.keys():
            out[k] = f.get_tensor(k).float().numpy()
    return out


def gruppo(k: str) -> str:
    p = k.split(".")
    if p[0] == "mimi":
        return "mimi." + p[1]
    if k in ("flow_lm.speaker_proj_weight", "flow_lm.bos_before_voice", "flow_lm.bos_emb", "flow_lm.emb_mean",
             "flow_lm.emb_std"):
        return k
    return "flow_lm." + p[1]


def confronta(a: dict, b: dict) -> dict:
    g = defaultdict(lambda: {"tensori": 0, "identici": 0, "forme_diverse": 0, "diff_rel_max": 0.0, "zero_a": 0, "zero_b": 0})
    for k in sorted(set(a) & set(b)):
        r = g[gruppo(k)]
        r["tensori"] += 1
        x, y = a[k], b[k]
        r["zero_a"] += int(not np.any(x))
        r["zero_b"] += int(not np.any(y))
        if x.shape != y.shape:
            r["forme_diverse"] += 1
            continue
        if np.array_equal(x, y):
            r["identici"] += 1
        scale = max(float(np.abs(x).max()), float(np.abs(y).max()), 1e-12)
        r["diff_rel_max"] = max(r["diff_rel_max"], float(np.abs(x - y).max()) / scale)
    return {k: dict(v) for k, v in sorted(g.items())}


def onnx_contro(ufficiale: dict) -> dict:
    """The May export against the May open weights: decoder side and downsample by name, the
    speaker projection from the last MatMul of the encoder graph."""
    import onnx
    from onnx import numpy_helper
    out = {}
    for nome in ("mimi_encoder.onnx", "mimi_decoder.onnx"):
        m = onnx.load(str(POCKET_DIR / "onnx" / "italian" / nome))
        init = {i.name: numpy_helper.to_array(i) for i in m.graph.initializer}
        righe = {"per_nome": 0, "identici": 0, "diff_rel_max": 0.0, "zero_nell_ufficiale": 0}
        for k, v in init.items():
            if k in ufficiale and ufficiale[k].shape == v.shape:
                righe["per_nome"] += 1
                u = ufficiale[k]
                righe["zero_nell_ufficiale"] += int(not np.any(u))
                if np.any(u):
                    scale = max(float(np.abs(u).max()), 1e-12)
                    d = float(np.abs(u - v).max()) / scale
                    righe["identici"] += int(d < 1e-2)       # bf16 file against fp32 export
                    righe["diff_rel_max"] = max(righe["diff_rel_max"], d)
        out[nome] = righe
        if nome == "mimi_encoder.onnx":
            last = m.graph.node[-1]
            w = init[last.input[1]].T                       # latents = latent32 @ W.T
            u = ufficiale["flow_lm.speaker_proj_weight"]
            scale = float(np.abs(u).max())
            out["proiezione_del_parlante"] = {
                "forma_onnx": list(w.shape), "forma_ufficiale": list(u.shape),
                "diff_rel_max_contro_maggio": float(np.abs(w - u).max()) / scale,
                "coseno_contro_maggio": float((w * u).sum() / (np.linalg.norm(w) * np.linalg.norm(u))),
            }
    return out


def main():
    w = {k: carica(p) for k, p in FILE.items()}
    out = {
        "file": {k: str(p) for k, p in FILE.items()},
        "maggio_6_contro_attuale_6": confronta(w["maggio_6"], w["attuale_6"]),
        "attuale_6_contro_attuale_24": confronta(w["attuale_6"], w["attuale_24"]),
        "onnx_maggio_contro_maggio_6": onnx_contro(w["maggio_6"]),
    }
    u_m, u_a = w["maggio_6"]["flow_lm.speaker_proj_weight"], w["attuale_6"]["flow_lm.speaker_proj_weight"]
    out["proiezione_maggio_contro_attuale"] = {
        "coseno": float((u_m * u_a).sum() / (np.linalg.norm(u_m) * np.linalg.norm(u_a))),
        "rango_attuale": int(np.linalg.matrix_rank(u_a)), "rango_maggio": int(np.linalg.matrix_rank(u_m))}
    (ESITI / "v2").mkdir(parents=True, exist_ok=True)
    (ESITI / "v2" / "compatibilita.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    for sez in ("maggio_6_contro_attuale_6", "attuale_6_contro_attuale_24"):
        print(f"== {sez}")
        for g, r in out[sez].items():
            print(f"  {g:34s} tensori {r['tensori']:3d} identici {r['identici']:3d} forme diverse {r['forme_diverse']} "
                  f"diff rel max {r['diff_rel_max']:.3g} azzerati {r['zero_a']}/{r['zero_b']}")
    print("== ONNX di maggio contro i pesi aperti di maggio", json.dumps(out["onnx_maggio_contro_maggio_6"], indent=1))
    print("== proiezione maggio contro attuale", out["proiezione_maggio_contro_attuale"])


if __name__ == "__main__":
    main()
