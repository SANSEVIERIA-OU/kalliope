# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-4, part A step 3: which smaller flow_lm.onnx keeps the numbers of the fp32 one.

Variants of flow_lm.onnx (the graph exported by v4_esporta.py):
- dyn8: dynamic int8 (MatMulInteger, activations quantized per tensor at run time), per channel;
- nbits8: weights only in 8 bits (MatMulNBits, blocks of 32), activations in fp32 (accuracy level 1);
- nbits8a4: the same, computed in int8 per block (accuracy level 4);
- nbits4: weights in 4 bits, blocks of 32, fp32 activations.
For each: file size, the voice state of a recording (no autoregression: a direct measure of the
arithmetic) against fp32, the latents of the first 5 steps at temperature 0, and the time per step at 2
threads (median of 60 steps after the prompt).

Writes ESITI/v4/quant_<layers>.json. Usage: python -I v4_quant.py [--strati 6] [--varianti nbits8a4,...]
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import ESITI, MODELLI, picco_mb  # noqa: E402
from v4_esporta import confronto, passo, sessione  # noqa: E402

OUT = MODELLI / "pocket-onnx-v4"


def fai(cartella: Path, nome: str):
    src, dst = cartella / "flow_lm.onnx", cartella / f"flow_lm_{nome}.onnx"
    if dst.exists():
        return dst
    if nome == "dyn8":
        return cartella / "flow_lm_int8.onnx"
    import onnx
    from onnxruntime.quantization import matmul_nbits_quantizer as q
    bits, acc = {"nbits8": (8, 1), "nbits8a4": (8, 4), "nbits4": (4, 1)}[nome]
    model = onnx.load(str(src))
    qz = q.MatMulNBitsQuantizer(model, bits=bits, block_size=32, is_symmetric=True, accuracy_level=acc)
    qz.process()
    qz.model.save_model_to_file(str(dst), use_external_data_format=False)
    return dst


def misura(path: Path, meta: dict, voice: np.ndarray, rif: dict | None):
    nl, H, D = meta["layers"], meta["heads"], meta["head_dim"]
    s = sessione(path)
    e_tok, e_voice, e_lat = np.zeros((1, 0), np.int64), np.zeros((1, 0, 1024), np.float32), np.zeros((1, 0, 32), np.float32)
    z = np.zeros((1, 32), np.float32)
    past0 = [np.zeros((1, H, 0, D), np.float32) for _ in range(2 * nl)]
    _, _, past = passo(s, nl, e_tok, voice, e_lat, z, past0)
    ids = np.array([[120, 45, 300, 77, 980, 12, 640, 8]], np.int64)
    _, _, past = passo(s, nl, ids, e_voice, e_lat, z, past)
    x = np.full((1, 1, 32), np.nan, np.float32)
    lat, tempi = [], []
    for i in range(60):
        t = time.perf_counter()
        y, _, past = passo(s, nl, e_tok, e_voice, x, z, past)
        tempi.append(time.perf_counter() - t)
        lat.append(y)
        x = y[:, None]
    out = {"mb": path.stat().st_size / 1e6, "ms_per_passo": 1000 * float(np.median(tempi)),
           "_stato_ultimo": past[-1], "_lat": np.concatenate(lat)}
    if rif is not None:
        a, b = past[-1][0].transpose(1, 0, 2), rif["_stato_ultimo"][0].transpose(1, 0, 2)
        n = rif["_stato_ultimo"].shape[2]
        out["valori_ultimo_strato"] = confronto(a[:n].reshape(n, -1), b[:n].reshape(n, -1))
        out["latenti_primi_5"] = confronto(out["_lat"][:5], rif["_lat"][:5])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--strati", type=int, default=6)
    ap.add_argument("--varianti", default="dyn8,nbits8,nbits8a4,nbits4")
    a = ap.parse_args()
    cartella = OUT / ("italian" if a.strati == 6 else "italian_24l")
    meta = json.loads((cartella / "pocket.json").read_text())
    rng = np.random.default_rng(0)
    # A voice conditioning of 100 frames with the scale of real ones (max |x| about 1).
    voice = (rng.standard_normal((1, 101, 1024)) * 0.3).astype(np.float32)
    res = {}
    rif = misura(cartella / "flow_lm.onnx", meta, voice, None)
    res["fp32"] = {k: v for k, v in rif.items() if not k.startswith("_")}
    print("fp32", res["fp32"], flush=True)
    for nome in a.varianti.split(","):
        p = fai(cartella, nome)
        r = misura(p, meta, voice, rif)
        res[nome] = {k: v for k, v in r.items() if not k.startswith("_")}
        print(nome, res[nome], flush=True)
    res["picco_mb"] = picco_mb()
    (ESITI / "v4" / f"quant_{a.strati}.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
