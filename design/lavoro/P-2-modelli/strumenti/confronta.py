"""confronta.py PRIMA DOPO OUT → pixel-by-pixel comparison of the state photos.

For each state, the before/after pair with the fewest different pixels among the 3×3 shots (the
text cursor blinks). Writes OUT/confronto.json, OUT/<state>-diff.png (differences in red over a pale
copy) and OUT/foglio-<name>.png (contact sheets).
"""
import json
import pathlib
import sys

import numpy as np
from PIL import Image, ImageDraw

prima, dopo, out = (pathlib.Path(a) for a in sys.argv[1:4])
out.mkdir(parents=True, exist_ok=True)
states = sorted({p.name.rsplit("-", 1)[0] for p in prima.glob("*-1.png")})


def load(p):
    return np.asarray(Image.open(p).convert("RGB"), dtype=np.int16)


result = {}
for s in states:
    best = None
    for i in (1, 2, 3):
        a_path = prima / f"{s}-{i}.png"
        for j in (1, 2, 3):
            b_path = dopo / f"{s}-{j}.png"
            if not (a_path.exists() and b_path.exists()):
                continue
            a, b = load(a_path), load(b_path)
            if a.shape != b.shape:
                best = best or {"size": [list(a.shape), list(b.shape)]}
                continue
            mask = np.any(a != b, axis=2)
            n = int(mask.sum())
            if best is None or "pixels" not in best or n < best["pixels"]:
                ys, xs = np.nonzero(mask)
                box = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())] if n else None
                best = {"pixels": n, "of": int(mask.size), "box": box, "pair": [i, j],
                        "max_channel_delta": int(np.abs(a - b).max()) if n else 0}
                best_imgs = (a, b, mask)
    result[s] = best
    if best and best.get("pixels"):
        a, b, mask = best_imgs
        pale = (a * 0.35 + 255 * 0.65).astype(np.uint8)
        pale[mask] = [220, 0, 0]
        Image.fromarray(pale).save(out / f"{s}-diff.png")
    print(s, best)

(out / "confronto.json").write_text(json.dumps(result, indent=1) + "\n")


def sheet(folder, name):
    imgs = [Image.open(folder / f"{s}-1.png").convert("RGB") for s in states if (folder / f"{s}-1.png").exists()]
    if not imgs:
        return
    w, h = imgs[0].size
    cols = 4
    rows = (len(imgs) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * (w + 10) + 10, rows * (h + 34) + 10), "white")
    d = ImageDraw.Draw(canvas)
    for k, (s, im) in enumerate(zip(states, imgs)):
        x, y = 10 + (k % cols) * (w + 10), 10 + (k // cols) * (h + 34)
        d.text((x, y), s, fill="black")
        canvas.paste(im, (x, y + 20))
    canvas.save(out / f"foglio-{name}.png")


sheet(prima, "prima")
sheet(dopo, "dopo")
