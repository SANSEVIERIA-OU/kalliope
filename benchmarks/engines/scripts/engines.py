# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Uniform adapters around the candidate TTS engines.

Every adapter exposes:
    sample_rate: int
    synth(text) -> np.float32 mono array
    first_audio(text) -> seconds until the first audio chunk is available
                         (native streaming granularity of the engine)

Thread count and ORT spinning are forced globally through `configure_ort`,
which must be called before any engine is constructed.
"""
from __future__ import annotations

import importlib.util
import json
import time
from pathlib import Path

import numpy as np
import onnxruntime as ort

MODELS = Path(__file__).resolve().parent.parent / "models"

_ORIG_SESSION_OPTIONS = ort.SessionOptions
_CFG = {"threads": 1, "spin": False}


def configure_ort(threads: int, spin: bool) -> None:
    """Make every SessionOptions created from now on use our thread settings."""
    _CFG["threads"] = threads
    _CFG["spin"] = spin

    def make_options():
        opts = _ORIG_SESSION_OPTIONS()
        opts.intra_op_num_threads = threads
        opts.inter_op_num_threads = 1
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        # production-like memory settings: no arena / memory pattern caching
        # (arena kept ~1 GB extra RSS on Pocket TTS with no speed benefit)
        opts.enable_cpu_mem_arena = False
        opts.enable_mem_pattern = False
        spin_flag = "1" if spin else "0"
        opts.add_session_config_entry("session.intra_op.allow_spinning", spin_flag)
        opts.add_session_config_entry("session.inter_op.allow_spinning", spin_flag)
        return opts

    ort.SessionOptions = make_options  # type: ignore[assignment]


def _session(path: Path) -> ort.InferenceSession:
    return ort.InferenceSession(str(path), sess_options=ort.SessionOptions(),
                                providers=["CPUExecutionProvider"])


# --------------------------------------------------------------------------- Piper
class PiperEngine:
    def __init__(self, voice: str, precision: str = "fp32"):
        from piper import PiperVoice, SynthesisConfig  # noqa: F401
        from piper.config import PiperConfig

        model = MODELS / "piper" / f"{voice}.onnx"
        cfg = json.loads((MODELS / "piper" / f"{voice}.onnx.json").read_text())
        from piper.voice import ESPEAK_DATA_DIR
        self.voice = PiperVoice(config=PiperConfig.from_dict(cfg), session=_session(model),
                                espeak_data_dir=Path(ESPEAK_DATA_DIR), download_dir=Path("/tmp"))
        self.sample_rate = self.voice.config.sample_rate

    def _chunks(self, text):
        for chunk in self.voice.synthesize(text):
            yield chunk.audio_float_array

    def synth(self, text: str) -> np.ndarray:
        return np.concatenate(list(self._chunks(text))).astype(np.float32)

    def first_audio(self, text: str) -> float:
        t0 = time.perf_counter()
        next(iter(self._chunks(text)))
        return time.perf_counter() - t0


# --------------------------------------------------------------------------- Kokoro
class KokoroEngine:
    def __init__(self, voice: str = "if_sara", precision: str = "fp32"):
        from kokoro_onnx import Kokoro

        name = "kokoro-v1.0.int8.onnx" if precision == "int8" else "kokoro-v1.0.onnx"
        self.k = Kokoro.from_session(_session(MODELS / "kokoro" / name),
                                     str(MODELS / "kokoro" / "voices-v1.0.bin"))
        self.voice = voice
        self.sample_rate = 24000

    def synth(self, text: str) -> np.ndarray:
        audio, _sr = self.k.create(text, voice=self.voice, speed=1.0, lang="it")
        return audio.astype(np.float32)

    def first_audio(self, text: str) -> float:
        # kokoro-onnx streams per sentence; first sentence = first audio
        import re
        first = re.split(r"(?<=[.!?…])\s+", text.strip())[0]
        t0 = time.perf_counter()
        self.synth(first)
        return time.perf_counter() - t0


# --------------------------------------------------------------------------- Pocket TTS
def _load_pocket_module():
    path = MODELS / "pocket-onnx" / "pocket_tts_onnx.py"
    spec = importlib.util.spec_from_file_location("pocket_tts_onnx", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # reviewed code: no network except HF for predefined voices
    return mod


class PocketEngine:
    def __init__(self, voice: str, precision: str = "int8", bundle: str = "italian",
                 lsd_steps: int = 1, temperature: float = 0.7):
        mod = _load_pocket_module()
        cls = mod.PocketTTSOnnx
        cls._make_session_options = lambda self: ort.SessionOptions()  # use our thread config
        self.tts = cls(models_dir=str(MODELS / "pocket-onnx" / "onnx"), language=bundle,
                       precision=precision, device="cpu", temperature=temperature,
                       lsd_steps=lsd_steps)
        self.sample_rate = self.tts.sample_rate
        t0 = time.perf_counter()
        self.embedding = self.tts.encode_voice(voice)  # voice cloning from reference wav
        self.clone_seconds = time.perf_counter() - t0

    def synth(self, text: str) -> np.ndarray:
        return self.tts.generate(text, voice=self.embedding).astype(np.float32)

    def first_audio(self, text: str) -> float:
        t0 = time.perf_counter()
        next(iter(self.tts.stream(text, voice=self.embedding)))
        return time.perf_counter() - t0


# --------------------------------------------------------------------------- Supertonic 3
class SupertonicEngine:
    def __init__(self, voice: str = "F1", precision: str = "fp32", steps: int = 5):
        path = MODELS / "supertonic3" / "code" / "helper.py"
        spec = importlib.util.spec_from_file_location("supertonic_helper", path)
        helper = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(helper)
        onnx_dir = str(MODELS / "supertonic3" / "onnx")
        self.tts = helper.load_text_to_speech(onnx_dir)
        self.style = helper.load_voice_style([str(MODELS / "supertonic3" / "voice_styles" / f"{voice}.json")])
        self.steps = steps
        self.sample_rate = self.tts.sample_rate

    def synth(self, text: str) -> np.ndarray:
        wav, _dur = self.tts(text, "it", self.style, self.steps)
        return wav.reshape(-1).astype(np.float32)

    def first_audio(self, text: str) -> float:  # no streaming: whole utterance
        t0 = time.perf_counter()
        self.synth(text)
        return time.perf_counter() - t0


# --------------------------------------------------------------------------- Klein-TTS X1.5 Pro
class KleinEngine:
    """Port of the official Node pipeline (npm @kleinml/kleintts 0.2.0, src/model.js)."""

    VOICES = {"Giulia": "if_sara", "Marco": "im_nicola"}

    def __init__(self, voice: str = "Giulia", precision: str = "fp32"):
        from kokoro_onnx.tokenizer import Tokenizer  # espeak-ng -> misaki phonemes (same as Klein training)

        d = MODELS / "klein" / "onnx"
        self.info = json.loads((d / "model.json").read_text())
        self.enc = _session(d / "encoder.onnx")
        self.dec = _session(d / "decoder.onnx")
        idx = self.info["speakers"].index(self.VOICES[voice])
        self.style = np.asarray(self.info["styles"][idx], dtype=np.float32)[None, :]
        self.tok = Tokenizer()
        self.sample_rate = self.info["sample_rate"]
        self.rng = np.random.default_rng(0)

    def _phonemes(self, text: str) -> str:
        return self.tok.phonemize(text, "it")

    def _synth_chunk(self, text: str) -> np.ndarray:
        vocab = self.info["vocab"]
        ids = [vocab[c] for c in self._phonemes(text) if c in vocab][:510]
        if not ids:
            return np.zeros(0, np.float32)
        tokens = np.array([[0, *ids, 0]], dtype=np.int64)
        durations, features = self.enc.run(None, {"tokens": tokens, "style": self.style,
                                                  "speed": np.array([1.0], np.float32)})
        fpd = self.info["frames_per_duration"]
        reps = np.maximum(1, np.rint(durations[0])).astype(np.int64) * fpd
        frames = np.repeat(features[0], reps, axis=0)[None]
        T = frames.shape[1] * self.info["hop"]
        noise = self.rng.standard_normal((1, self.info["noise_channels"], T)).astype(np.float32)
        (audio,) = self.dec.run(None, {"frames": frames, "style": self.style, "noise": noise})
        return audio.reshape(-1)

    def synth(self, text: str) -> np.ndarray:
        import re
        parts = [p for p in re.split(r"(?<=[.!?…])\s+", text.strip()) if p]
        return np.concatenate([self._synth_chunk(p) for p in parts]).astype(np.float32)

    def first_audio(self, text: str) -> float:
        import re
        first = re.split(r"(?<=[.!?…])\s+", text.strip())[0]
        t0 = time.perf_counter()
        self._synth_chunk(first)
        return time.perf_counter() - t0


def build(engine: str, **kw):
    return {"piper": PiperEngine, "kokoro": KokoroEngine, "pocket": PocketEngine,
            "supertonic": SupertonicEngine, "klein": KleinEngine}[engine](**kw)
