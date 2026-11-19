# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Judges of the benchmark.

- Similarity to the person: ECAPA-TDNN (SpeechBrain spkrec-ecapa-voxceleb, Apache-2.0), cosine
  between the embedding of a clip and the centroid of the person's four held-out clips.
- Search score (strategy 3 only): Resemblyzer (Apache-2.0), as KVoiceWalk does. The search never
  sees ECAPA, so ECAPA on held-out clips is an independent check of what the search found.
- Wrong words: Whisper small int8, beam 5, Italian, as benchmarks/engines/scripts/asr_check.py;
  both the sentence and the transcript go through Kalliope's normalizer before the word count,
  so that "14 marzo" and "quattordici marzo" count as the same words.
"""
from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import MODELLI, PERSONE, leggi, normalizza_kalliope, ricampiona  # noqa: E402


def _unit(v: np.ndarray) -> np.ndarray:
    v = np.asarray(v, dtype=np.float64).reshape(-1)
    return v / (np.linalg.norm(v) + 1e-12)


class Ecapa:
    def __init__(self, threads: int = 2):
        import torch
        torch.set_num_threads(threads)
        from speechbrain.inference.speaker import EncoderClassifier
        d = MODELLI / "spkrec-ecapa-voxceleb"
        self.m = EncoderClassifier.from_hparams(source=str(d), savedir=str(d), run_opts={"device": "cpu"})
        self.torch = torch

    def emb_audio(self, a16: np.ndarray) -> np.ndarray:
        with self.torch.inference_mode():
            e = self.m.encode_batch(self.torch.from_numpy(a16[None].astype(np.float32)))
        return _unit(e.numpy())

    def emb(self, path: Path) -> np.ndarray:
        return self.emb_audio(leggi(path, 16000))


class Resemblyzer:
    def __init__(self, threads: int = 1):
        import torch
        torch.set_num_threads(threads)
        from resemblyzer import VoiceEncoder, preprocess_wav
        self.enc = VoiceEncoder("cpu", verbose=False)
        self.pre = preprocess_wav

    def emb_audio(self, a: np.ndarray, sr: int) -> np.ndarray:
        return _unit(self.enc.embed_utterance(self.pre(a, source_sr=sr)))


class WeSpeaker:
    """Third, independent judge: WeSpeaker ResNet34 trained on VoxCeleb (Apache-2.0), ONNX.
    Features as in wespeaker: Kaldi fbank, 80 bins, 25/10 ms, no dither, mean normalisation."""

    def __init__(self, threads: int = 2):
        import onnxruntime as ort
        import torch
        import torchaudio.compliance.kaldi as kaldi
        from comune import ort_options
        self.kaldi, self.torch = kaldi, torch
        self.s = ort.InferenceSession(str(MODELLI / "wespeaker-voxceleb-resnet34" / "voxceleb_resnet34.onnx"),
                                      ort_options(threads), providers=["CPUExecutionProvider"])

    def emb_audio(self, a16: np.ndarray) -> np.ndarray:
        w = self.torch.from_numpy(a16.astype(np.float32) * (1 << 15))[None]
        f = self.kaldi.fbank(w, num_mel_bins=80, frame_length=25, frame_shift=10, dither=0.0,
                             sample_frequency=16000, window_type="hamming")
        f = (f - f.mean(0, keepdim=True)).numpy()[None]
        return _unit(self.s.run(None, {"feats": f})[0])

    def emb(self, path: Path) -> np.ndarray:
        return self.emb_audio(leggi(path, 16000))


def centroide(embs: list[np.ndarray]) -> np.ndarray:
    return _unit(np.mean([_unit(e) for e in embs], axis=0))


def coseno(a: np.ndarray, b: np.ndarray) -> float:
    return float(_unit(a) @ _unit(b))


def clip_persona(p: str, tipo: str) -> list[Path]:
    return sorted((PERSONE / p).glob(f"{tipo}_*.wav"))


# ----------------------------------------------------------------------------- word errors
def norm_parole(s: str) -> list[str]:
    """asr_check.py's normalization (lower case, no punctuation, apostrophes split)."""
    s = unicodedata.normalize("NFC", s.lower()).replace("’", "'")
    s = re.sub(r"(\d)[.](\d{3})", r"\1\2", s)
    s = re.sub(r"[^\w\s']", " ", s).replace("'", " ")
    return s.split()


def errori(ref: list[str], hyp: list[str]) -> int:
    d = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        prev, d[0] = d[0], i
        for j, h in enumerate(hyp, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (r != h))
    return d[-1]


class Whisper:
    def __init__(self, threads: int = 2, size: str = "small"):
        from faster_whisper import WhisperModel
        self.m = WhisperModel(size, device="cpu", compute_type="int8", cpu_threads=threads)

    def trascrivi(self, a: np.ndarray, sr: int) -> str:
        a16 = ricampiona(a, sr, 16000)
        segs, _ = self.m.transcribe(a16, language="it", beam_size=5, vad_filter=False)
        return " ".join(s.text for s in segs).strip()

    def wer_frase(self, a: np.ndarray, sr: int, riferimento_normalizzato: str) -> dict:
        hyp = self.trascrivi(a, sr)
        hyp_n = normalizza_kalliope([hyp])[0]
        ref_w, hyp_w = norm_parole(riferimento_normalizzato), norm_parole(hyp_n)
        return {"trascrizione": hyp, "errori": errori(ref_w, hyp_w), "parole": len(ref_w)}

