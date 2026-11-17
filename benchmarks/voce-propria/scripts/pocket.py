# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Pocket TTS on the third-party ONNX export (xennonf4/pocket-tts-onnx), with what the official
code (kyutai-labs/pocket-tts, MIT) does and the export's wrapper does not, each switchable so
that its effect can be measured (incarico V-1, 17/11/2026):

- fine_su_pausa: the voice prompt ends on exactly 80 ms of silence (official end_on_pause, PR #334:
  "a voice prompt that stops on speech ... shows up ... as a wrong or missing word").
- temperatura: official default 0.3 ("0.3 beats 0.7 on WER and UTMOS for every shipped model");
  the wrapper uses 0.7.
- min_eos: EOS is ignored during the first 6 generated frames (official _MIN_FRAMES_BEFORE_EOS).
- fade_in: the first 5 ms of every chunk fade in (official decoder worker: fresh-state click).
- precisione per part (main, flow, dec, enc), threads, ONNX Runtime arena on/off.
- codifica a pezzi: the Mimi encoder (full attention over the whole prompt in the export) run on
  overlapping pieces, to bound its memory.
- streaming with fixed decode chunks and a real-time playback check (no gap while speaking).

The wrapper class is reused (loading, tokenizer, sentence chunking); the generation loop is ours.
"""
from __future__ import annotations

import importlib.util
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import MODELLI, POCKET_DIR, leggi, ort_options  # noqa: E402

SR = 24000
FRAME = 1920            # samples per latent (80 ms)
EXTRA = MODELLI / "pocket-onnx-extra"   # files of the export not downloaded on 12/11
KV = MODELLI / "pocket-onnx-kv"         # flow LM with a free cache length (onnx_cache.py)


def _wrapper():
    if "pocket_tts_onnx" in sys.modules:
        return sys.modules["pocket_tts_onnx"]
    spec = importlib.util.spec_from_file_location("pocket_tts_onnx", POCKET_DIR / "pocket_tts_onnx.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules["pocket_tts_onnx"] = mod
    spec.loader.exec_module(mod)
    return mod


def fine_su_pausa(wav: np.ndarray, sr: int = SR, pause_sec: float = 0.08, fade_sec: float = 0.02,
                  floor_db: float = 35.0) -> np.ndarray:
    """numpy port of the official end_on_pause (pocket_tts/data/audio_utils.py)."""
    frame = max(1, int(0.02 * sr))
    n = len(wav) // frame
    if n == 0:
        return wav
    rms = np.sqrt(np.square(wav[: n * frame].reshape(n, frame).astype(np.float64)).mean(1))
    db = 20 * np.log10(rms + 1e-12)
    loud = np.nonzero(db > db.max() - floor_db)[0]
    end = (int(loud[-1]) + 1) * frame
    out = wav[:end].astype(np.float32).copy()
    fade = min(int(fade_sec * sr), end)
    out[end - fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
    return np.concatenate([out, np.zeros(int(pause_sec * sr), np.float32)])


def taglia_su_pausa(audio: np.ndarray, durata_s: float, sr: int = SR) -> np.ndarray:
    """The first `durata_s` seconds or a little less, cut in the middle of the last pause (at least
    100 ms, 35 dB under the speech level) of the final 3 s, so that the prompt does not stop on speech."""
    n = int(0.01 * sr)
    a = audio[: int(durata_s * sr)]
    fr = a[: len(a) // n * n].reshape(-1, n)
    db = 20 * np.log10(np.sqrt((fr.astype(np.float64) ** 2).mean(1)) + 1e-9)
    quiet = db < np.percentile(db, 90) - 35
    best, run = None, 0
    for i in range(len(quiet)):
        run = run + 1 if quiet[i] else 0
        if run >= 10 and i * 0.01 >= durata_s - 3:
            best = i - run // 2
    return a if best is None else a[: best * n]


class Pocket:
    def __init__(self, threads: int = 2, bundle: str = "italian", main: str = "int8", flow: str = "int8",
                 dec: str = "int8", enc: str = "fp32", temperatura: float = 0.3, fine_pausa: bool = True,
                 min_eos: int = 6, fade_in: bool = True, arena: bool = False, kv: bool = True,
                 silenzio: int = 0):
        import onnxruntime as ort
        mod = _wrapper()
        base = mod.PocketTTSOnnx
        bdir = POCKET_DIR / "onnx" / bundle
        prec = {"flow_lm_main": main, "flow_lm_flow": flow, "mimi_decoder": dec, "mimi_encoder": enc}

        def opts(_self):
            o = ort_options(threads)
            if arena:
                o.enable_cpu_mem_arena = True
                o.enable_mem_pattern = True
            return o

        def path_for(stem):
            name = f"{stem}_int8.onnx" if prec.get(stem) == "int8" else f"{stem}.onnx"
            dirs = ((KV / bundle,) if kv and stem == "flow_lm_main" else ()) + (bdir, EXTRA / bundle)
            for d in dirs:
                if (d / name).exists():
                    return str(d / name)
            raise FileNotFoundError(f"{bundle}/{name}")

        def load_models(_self):
            o = _self._make_session_options()
            mk = lambda stem: ort.InferenceSession(path_for(stem), sess_options=o,  # noqa: E731
                                                   providers=["CPUExecutionProvider"])
            _self.mimi_encoder = None          # loaded only when a voice is prepared
            _self._mk = mk
            _self.text_conditioner = ort.InferenceSession(str(bdir / "text_conditioner.onnx"), sess_options=o,
                                                          providers=["CPUExecutionProvider"])
            _self.flow_lm_main = mk("flow_lm_main")
            _self.flow_lm_flow = mk("flow_lm_flow")
            _self.mimi_decoder = mk("mimi_decoder")

        cls = type("PocketV1", (base,), {"_make_session_options": opts, "_load_models": load_models})
        self.t = cls(models_dir=str(POCKET_DIR / "onnx"), language=bundle, precision="int8", device="cpu",
                     temperature=temperatura, lsd_steps=1)
        self.temperatura, self.fine_pausa, self.min_eos, self.fade_in = temperatura, fine_pausa, min_eos, fade_in
        self.kv = kv
        self.silenzio = silenzio          # forced silent frames before each chunk (experiment)
        self.lat_silenzio = None
        self.stato_voce = None
        self.rng = np.random.default_rng(0)

    # ------------------------------------------------------------------ the voice
    def codifica(self, audio: np.ndarray, pezzo_s: float | None = None, sovrapp_s: float = 2.0) -> np.ndarray:
        """Mimi encoder (+ speaker projection) -> [1, frames, 1024]. With pezzo_s, overlapping pieces
        aligned to the 80 ms frame grid; each piece keeps only the frames of its own span."""
        if self.t.mimi_encoder is None:
            self.t.mimi_encoder = self.t._mk("mimi_encoder")
        if self.fine_pausa:
            audio = fine_su_pausa(audio)
        enc = self.t.mimi_encoder
        if pezzo_s is None:
            out = enc.run(None, {"audio": audio.reshape(1, 1, -1).astype(np.float32)})[0]
        else:
            n_fr = int(np.ceil((len(audio) - FRAME) / FRAME)) + 1
            step = int(pezzo_s * 12.5)
            ov = int(np.ceil(sovrapp_s * 12.5))
            parts = []
            for f0 in range(0, n_fr, step):
                f1 = min(n_fr, f0 + step)
                a0 = max(0, f0 - ov)
                a1 = min(n_fr, f1 + ov)
                piece = audio[a0 * FRAME: min(len(audio), (a1 - 1) * FRAME + FRAME)]
                lat = enc.run(None, {"audio": piece.reshape(1, 1, -1).astype(np.float32)})[0]
                parts.append(lat[:, f0 - a0: f0 - a0 + (f1 - f0)])
            out = np.concatenate(parts, axis=1)
        self.t.mimi_encoder = None     # the encoder is needed once per person: free it
        return out.astype(np.float32)

    def prepara(self, ref: Path | np.ndarray, durata_s: float | None = None, pezzo_s: float | None = 5.0):
        audio = leggi(ref, SR) if not isinstance(ref, np.ndarray) else ref
        if durata_s:
            audio = taglia_su_pausa(audio, durata_s)
        emb = self.codifica(audio, pezzo_s)
        self.usa_embedding(emb)
        return emb

    def usa_embedding(self, emb: np.ndarray):
        self.stato_voce = self.t._condition_with_voice_embeddings(emb)
        if self.silenzio:
            self.prepara_silenzio()

    def prepara_silenzio(self, frasi_prova=("Buongiorno a tutti.", "Grazie mille.", "Va bene così.")):
        """Silent latent frames of this voice: the frames after the end of short utterances whose
        decoded energy is more than 60 dB under the speech (searched with a few seeds)."""
        t = self.t
        keep, saved = [], self.silenzio
        self.silenzio = 0
        for k, testo in enumerate(frasi_prova * 3):
            self.rng = np.random.default_rng(900 + k)
            lat = np.concatenate(list(self._latenti(testo, 12)), axis=1)
            ms = t._init_state(t.mimi_state_manifest)
            a = t.mimi_decoder.run(None, {"latent": lat, **ms})[0].reshape(-1)
            fr = a[: len(a) // FRAME * FRAME].reshape(-1, FRAME)
            db = 20 * np.log10(np.sqrt((fr.astype(np.float64) ** 2).mean(1)) + 1e-9)
            quiet = [i for i in range(len(db)) if db[i] < db.max() - 60 and i > 2]
            keep += [lat[:, i:i + 1] for i in quiet]
            if len(keep) >= 8:
                break
        self.silenzio = saved
        self.lat_silenzio = np.concatenate(keep[-8:], axis=1) if keep else None
        return self.lat_silenzio

    def salva_stato(self, path: Path):
        """The conditioned state, KV caches cut to the positions in use (official export-voice keeps
        the state too)."""
        man = self.t.flow_state_manifest
        used = None
        arrays = {}
        for e in man:
            v = self.stato_voce[e["input_name"]]
            if e["key"] == "step":
                used = int(v.reshape(-1)[0])
        for e in man:
            v = self.stato_voce[e["input_name"]]
            arrays[e["input_name"]] = v[:, :, :used] if e["key"] == "cache" else v
        np.savez(path, **arrays)
        return used

    def carica_stato(self, path: Path):
        z = np.load(path)
        st = {}
        for e in self.t.flow_state_manifest:
            v = z[e["input_name"]]
            if e["key"] == "cache":
                full = np.full(e["shape"], np.nan, dtype=np.float32)
                full[:, :, : v.shape[2]] = v
                v = full
            st[e["input_name"]] = v
        self.stato_voce = st

    # ------------------------------------------------------------------ speaking
    def _taglia_cache(self, state: dict, lunghezza: int) -> dict:
        """Cache arrays cut or padded (NaN, as the export's empty slots) to `lunghezza` positions."""
        out = {}
        for e in self.t.flow_state_manifest:
            v = state[e["input_name"]]
            if e["key"] == "cache":
                used = min(v.shape[2], lunghezza)
                nv = np.full((*v.shape[:2], lunghezza, *v.shape[3:]), np.nan, np.float32)
                nv[:, :, :used] = v[:, :, :used]
                v = nv
            else:
                v = v.copy()
            out[e["input_name"]] = v
        return out

    def _posizioni_usate(self) -> int:
        for e in self.t.flow_state_manifest:
            if e["key"] == "step":
                return int(self.stato_voce[e["input_name"]].reshape(-1)[0])
        raise KeyError("step")

    def _latenti(self, testo_pezzo: str, frames_after_eos: int):
        t = self.t
        ids = t._tokenize(testo_pezzo)
        if self.kv:   # only the positions this chunk can reach: prompt + text + longest generation
            need = self._posizioni_usate() + ids.shape[1] + t._estimate_max_gen_len(ids.shape[1]) + 2 + self.silenzio
            state = self._taglia_cache(self.stato_voce, need)
        else:
            state = t._clone_state(self.stato_voce)
        emb = t.text_conditioner.run(None, {"token_ids": ids})[0]
        if emb.ndim == 2:
            emb = emb[None]
        empty_seq = np.zeros((1, 0, t.latent_dim), np.float32)
        empty_text = np.zeros((1, 0, t.conditioning_dim), np.float32)
        bos = np.full((1, 1, t.latent_dim), np.nan, np.float32)
        if self.silenzio and self.lat_silenzio is not None:
            # Teacher forcing as the official code does to continue a chunk: the text and BOS plus every
            # forced frame but the last in one call, then the last forced frame is the first input.
            forced = self.lat_silenzio[:, : self.silenzio]
            seq = np.concatenate([bos, forced[:, :-1]], axis=1)
            res = t.flow_lm_main.run(None, {"sequence": seq, "text_embeddings": emb, **state})
            t._update_state_from_outputs(state, res, t.flow_state_manifest, output_offset=2)
            curr = forced[:, -1:]
        else:
            res = t.flow_lm_main.run(None, {"sequence": empty_seq, "text_embeddings": emb, **state})
            t._update_state_from_outputs(state, res, t.flow_state_manifest, output_offset=2)
            curr = bos
        eos_step = None
        limit = t._estimate_max_gen_len(ids.shape[1])
        std = np.float32(np.sqrt(self.temperatura))
        for step in range(limit):
            res = t.flow_lm_main.run(None, {"sequence": curr, "text_embeddings": empty_text, **state})
            cond, eos = res[0], res[1]
            t._update_state_from_outputs(state, res, t.flow_state_manifest, output_offset=2)
            if eos[0][0] > -4.0 and eos_step is None and step >= self.min_eos:
                eos_step = step
            if eos_step is not None and step >= eos_step + frames_after_eos:
                break
            x = (self.rng.standard_normal((1, t.latent_dim)).astype(np.float32) * std
                 if self.temperatura > 0 else np.zeros((1, t.latent_dim), np.float32))
            for s_arr, t_arr in t._st_buffers:
                x = x + t.flow_lm_flow.run(None, {"c": cond, "s": s_arr, "t": t_arr, "x": x})[0] / len(t._st_buffers)
            lat = x.reshape(1, 1, t.latent_dim)
            yield lat
            curr = lat

    def flusso(self, testo: str, primo: int = 2, pezzo: int = 6):
        """Yields (audio chunk, seconds since start). First chunk after `primo` latents, then every
        `pezzo` latents; each sentence chunk of the text starts from the voice state."""
        t = self.t
        t0 = time.perf_counter()
        for chunk_text in t._split_into_best_sentences(testo):
            _, guess = t._prepare_text_prompt(chunk_text)
            fae = t.model_recommended_frames_after_eos or (guess + 2)
            mstate = t._init_state(t.mimi_state_manifest)
            buf, first = [], True
            if self.silenzio and self.lat_silenzio is not None:   # decoder warm-up, audio dropped
                res = t.mimi_decoder.run(None, {"latent": self.lat_silenzio[:, : self.silenzio], **mstate})
                t._update_state_from_outputs(mstate, res, t.mimi_state_manifest, output_offset=1)
                first = False
            for lat in self._latenti(chunk_text, fae):
                buf.append(lat)
                if len(buf) >= (primo if first else pezzo):
                    yield self._decodifica(buf, mstate, first), time.perf_counter() - t0
                    buf, first = [], False
            if buf:
                yield self._decodifica(buf, mstate, first), time.perf_counter() - t0

    def _decodifica(self, buf, mstate, first):
        t = self.t
        res = t.mimi_decoder.run(None, {"latent": np.concatenate(buf, axis=1), **mstate})
        t._update_state_from_outputs(mstate, res, t.mimi_state_manifest, output_offset=1)
        a = res[0].reshape(-1).astype(np.float32)
        if first and self.fade_in:
            n = min(SR // 200, len(a))
            a[:n] *= np.linspace(0, 1, n, dtype=np.float32)
        return a

    def dici(self, testo: str, seme: int | None = None, primo: int = 2, pezzo: int = 6):
        """Whole utterance plus the streaming record: first-audio time and whether real-time
        playback would have had a gap (chunk k ready after its playback time)."""
        if seme is not None:
            self.rng = np.random.default_rng(seme)
        parts, ready = [], []
        for a, tr in self.flusso(testo, primo, pezzo):
            parts.append(a)
            ready.append(tr)
        audio = np.concatenate(parts) if parts else np.zeros(0, np.float32)
        starts = np.cumsum([0] + [len(p) for p in parts[:-1]]) / SR
        t_play = ready[0] if ready else 0.0
        ritardi = [r - (t_play + s) for r, s in zip(ready, starts)]
        return audio, {"primo_suono_s": ready[0] if ready else None,
                       "ritardo_max_s": max(ritardi) if ritardi else 0.0,
                       "vuoti": int(sum(1 for d in ritardi[1:] if d > 0.0)),
                       "pezzi": len(parts)}
