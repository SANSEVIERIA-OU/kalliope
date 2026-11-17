# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Spectrograms side by side, to look at what one cannot hear here (no audio output on this
machine): cut endings, metallic buzz, missing high band, breaths, long silences.

Usage: python -I spettri.py OUT.png FILE.wav [FILE.wav ...]
"""
from __future__ import annotations

import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402
from scipy.signal import spectrogram  # noqa: E402


def main():
    out, files = Path(sys.argv[1]), [Path(p) for p in sys.argv[2:]]
    fig, axes = plt.subplots(len(files), 1, figsize=(11, 1.9 * len(files)), squeeze=False)
    for ax, f in zip(axes[:, 0], files):
        a, sr = sf.read(str(f), dtype="float32", always_2d=True)
        a = a.mean(1)
        fr, t, s = spectrogram(a, fs=sr, nperseg=int(0.025 * sr), noverlap=int(0.015 * sr))
        db = 10 * np.log10(s + 1e-10)
        ax.pcolormesh(t, fr / 1000, db, vmin=db.max() - 80, vmax=db.max(), shading="auto", cmap="magma")
        ax.set_ylim(0, 12)
        ax.set_ylabel("kHz")
        ax.set_title(f"{f.parent.parent.name}/{f.parent.name}/{f.name} · {len(a) / sr:.2f} s · {sr} Hz", fontsize=8)
        ax.tick_params(labelsize=7)
    fig.tight_layout()
    fig.savefig(out, dpi=80)


if __name__ == "__main__":
    main()
