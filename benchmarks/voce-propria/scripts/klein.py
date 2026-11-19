# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Klein-TTS X1.5 Pro in Python, following crates/voice step by step (chunk per sentence, phoneme
durations rounded as JavaScript does, 0.12 s pause between chunks), with any 256-number style.

The program itself (kalliope-cli) makes the reference audio; this copy exists for the voice
search, which needs thousands of syntheses with styles that are not in model.json.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import KLEIN_DIR, ort_options  # noqa: E402

VOICE_NAMES = {"Giulia": "if_sara", "Marco": "im_nicola"}
PAUSE_S = 0.12


class Klein:
    def __init__(self, threads: int = 1, model_dir: Path = KLEIN_DIR):
        import onnxruntime as ort
        self.info = json.loads((model_dir / "model.json").read_text())
        o = ort_options(threads)
        self.enc = ort.InferenceSession(str(model_dir / "encoder.onnx"), o, providers=["CPUExecutionProvider"])
        self.dec = ort.InferenceSession(str(model_dir / "decoder.onnx"), o, providers=["CPUExecutionProvider"])
        self.vocab = self.info["vocab"]
        self.sr = self.info["sample_rate"]
        self.styles = np.asarray(self.info["styles"], dtype=np.float32)
        self.speakers = self.info["speakers"]
        self.rng = np.random.default_rng(0)

    def style(self, name: str) -> np.ndarray:
        return self.styles[self.speakers.index(VOICE_NAMES.get(name, name))].copy()

    def tokens(self, phonemes: str) -> np.ndarray:
        ids = [self.vocab[c] for c in phonemes if c in self.vocab][:510]
        return np.array([[0, *ids, 0]], dtype=np.int64)

    def chunk(self, tokens: np.ndarray, style: np.ndarray, seed: int | None = None) -> np.ndarray:
        st = style.reshape(1, -1).astype(np.float32)
        durations, features = self.enc.run(None, {"tokens": tokens, "style": st,
                                                  "speed": np.array([1.0], np.float32)})
        reps = np.maximum(1, np.floor(durations[0].astype(np.float64) + 0.5)).astype(np.int64)
        reps *= self.info["frames_per_duration"]
        frames = np.repeat(features[0], reps, axis=0)[None]
        n = frames.shape[1] * self.info["hop"]
        rng = self.rng if seed is None else np.random.default_rng(seed)
        noise = rng.standard_normal((1, self.info["noise_channels"], n), dtype=np.float32)
        (audio,) = self.dec.run(None, {"frames": frames, "style": st, "noise": noise})
        return audio.reshape(-1)

    def synth(self, phonemes: list[str], style: np.ndarray, seed: int = 0) -> np.ndarray:
        """`phonemes`: one string per sentence, as printed by `kalliope-cli phonemes`."""
        parts = []
        for i, p in enumerate(phonemes):
            for k, s in enumerate(x for x in re.split(r"(?<=[.!?…])\s+", p.strip()) if x):
                a = self.chunk(self.tokens(s), style, seed + 1000 * i + k)
                if parts:
                    parts.append(np.zeros(int(PAUSE_S * self.sr), np.float32))
                parts.append(a)
        return np.concatenate(parts).astype(np.float32)


def cartella_con_voci(dest: Path, voci: dict[str, np.ndarray], model_dir: Path = KLEIN_DIR) -> Path:
    """A model folder for kalliope-cli whose model.json has extra voices (id -> 256 numbers):
    encoder and decoder are links to the real ones, nothing else changes."""
    dest.mkdir(parents=True, exist_ok=True)
    for f in ("encoder.onnx", "decoder.onnx"):
        link = dest / f
        if link.is_symlink() or link.exists():
            link.unlink()
        link.symlink_to(model_dir / f)
    info = json.loads((model_dir / "model.json").read_text())
    for vid, vec in voci.items():
        info["speakers"].append(vid)
        info["styles"].append([float(x) for x in np.asarray(vec, dtype=np.float32)])
    (dest / "model.json").write_text(json.dumps(info))
    return dest

