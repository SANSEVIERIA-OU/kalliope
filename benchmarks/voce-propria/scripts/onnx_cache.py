# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Make the KV-cache length of the exported flow LM a free dimension.

The export fixes every attention cache at 1000 positions ([2, 1, 1000, heads, 64] per layer), and
each step copies the whole cache: ScatterND (writing the new key and value) and Gather (splitting
key from value) are 63% of the flow LM's time on this machine (ONNX Runtime profile, 6 layers),
the matrix products about 11%. The graph reads the cache length with Shape, so nothing else
depends on 1000: we only declare dimension 2 of the cache inputs and outputs as `kv_len` (and
drop the stored intermediate shapes, which ONNX Runtime infers again). The caller then sizes the
cache to what one chunk needs (voice prompt + text + longest generation).

Writes MODELLI/pocket-onnx-kv/<bundle>/<file>; the downloaded files are not modified.
Usage: python -I onnx_cache.py BUNDLE FILE [FILE ...]   (e.g. italian flow_lm_main_int8.onnx)
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import onnx  # noqa: E402

from comune import MODELLI, POCKET_DIR  # noqa: E402

OUT = MODELLI / "pocket-onnx-kv"


def converti(src: Path, dst: Path) -> int:
    m = onnx.load(str(src))
    g = m.graph
    n = 0
    for vi in list(g.input) + list(g.output):
        dims = vi.type.tensor_type.shape.dim
        if len(dims) == 5 and dims[2].HasField("dim_value") and dims[2].dim_value == 1000:
            dims[2].ClearField("dim_value")
            dims[2].dim_param = "kv_len"
            n += 1
    del g.value_info[:]
    dst.parent.mkdir(parents=True, exist_ok=True)
    onnx.save(m, str(dst))
    return n


def main():
    bundle, files = sys.argv[1], sys.argv[2:]
    for f in files:
        src = POCKET_DIR / "onnx" / bundle / f
        if not src.exists():
            src = MODELLI / "pocket-onnx-extra" / bundle / f
        n = converti(src, OUT / bundle / f)
        print(bundle, f, f"{n} cache inputs/outputs made dynamic", flush=True)


if __name__ == "__main__":
    main()
