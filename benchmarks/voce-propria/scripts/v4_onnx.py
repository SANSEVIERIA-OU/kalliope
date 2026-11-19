# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""V-4: the official generation loop on Kalliope's ONNX graphs, in Python.

The reference for the Rust engine and the generator of the automatic check. It follows
TTSModel.generate_audio_stream (kyutai-labs/pocket-tts a4a6054d) step by step:
- text: split_into_best_sentences and prepare_text_prompt of the official code, with the Italian config
  (50 tokens per chunk, terminal punctuation, capital letter, replace_characters);
- per chunk, from the voice state: the text prompt, then one flow-LM step per frame with noise of
  variance `temperature` (0.3), EOS when the logit passes -4.0 but not before frame 6, then
  frames_after_eos more frames (guess: 3 for up to four words, else 1, plus 2), at most
  ceil((tokens / 3 + 2) * 12.5) frames;
- Mimi decoder with a fresh state per chunk, the first 5 ms faded in;
- the voice: the recording ended on 80 ms of silence (end_on_pause), encoded in pieces, bos_before_voice
  in front, then one flow-LM call: the state is the keys and values of every layer.

Noise comes from numpy (seeded), so the audio is not the PyTorch one sample by sample, as with two seeds.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from v4_comune import REPO  # noqa: E402

FRAME = 1920


class PocketV4:
    def __init__(self, cartella: Path, flow: str = "flow_lm_nbits8a4.onnx", threads: int = 2):
        if str(REPO) not in sys.path:
            sys.path.insert(0, str(REPO))
        import tokenizers
        from v4_esporta import sessione
        self.meta = json.loads((cartella / "pocket.json").read_text())
        self.tok = tokenizers.Tokenizer.from_file(str(cartella / "tokenizer.json"))
        self.flow = sessione(cartella / flow, threads)
        self.dec = sessione(cartella / "mimi_decoder.onnx", threads)
        self._enc_path = cartella / "mimi_encoder.onnx"
        self._enc = None
        self.threads = threads
        self.nl = self.meta["layers"]

    # --------------------------------------------------------------------------------- voice
    def stato_da_registrazione(self, audio24: np.ndarray, pezzo: int = 10):
        import torch
        from pocket_tts.data.audio_utils import end_on_pause
        from v4_esporta import sessione
        if self._enc is None:
            self._enc = sessione(self._enc_path, self.threads)
        m = self.meta
        x = end_on_pause(torch.from_numpy(audio24.astype(np.float32))[None], m["sample_rate"])[0].numpy()
        x = np.concatenate([x, np.zeros((-len(x)) % FRAME, np.float32)])
        stati = [np.zeros(s["shape"], np.float32) for s in m["encoder_states"]]
        off = np.array([0], np.int64)
        pezzi, bos = [], None
        for i, k in enumerate(range(0, len(x), pezzo * FRAME)):
            feed = {"audio": x[k:k + pezzo * FRAME].reshape(1, 1, -1), "offset": off,
                    "first": np.array([1.0 if i == 0 else 0.0], np.float32)}
            for j, s in enumerate(stati):
                feed[f"state_{j}"] = s
            r = self._enc.run(None, feed)
            pezzi.append(r[0][0])
            bos, off, stati = r[1], r[2], r[3:]
        voice = np.concatenate([bos, np.concatenate(pezzi)[None]], axis=1).astype(np.float32)
        return self._passo(np.zeros((1, 0), np.int64), voice, None, None, self._vuoto())[2]

    def stato_da_kyutai(self, path: Path):
        from safetensors import safe_open
        past = []
        with safe_open(str(path), "np") as f:
            for i in range(self.nl):
                c = f.get_tensor(f"transformer.layers.{i}.self_attn/cache")
                n = int(f.get_tensor(f"transformer.layers.{i}.self_attn/offset").reshape(-1)[0])
                c = c[:, :, :n]
                past += [np.ascontiguousarray(c[0].transpose(0, 2, 1, 3)), np.ascontiguousarray(c[1].transpose(0, 2, 1, 3))]
        return past

    def _vuoto(self):
        return [np.zeros((1, self.meta["heads"], 0, self.meta["head_dim"]), np.float32) for _ in range(2 * self.nl)]

    def _passo(self, tokens, voice, latents, noise, past):
        ld, d = self.meta["latent_dim"], self.meta["dim"]
        feed = {"text_tokens": tokens if tokens is not None else np.zeros((1, 0), np.int64),
                "voice": voice if voice is not None else np.zeros((1, 0, d), np.float32),
                "latents": latents if latents is not None else np.zeros((1, 0, ld), np.float32),
                "noise": noise if noise is not None else np.zeros((1, ld), np.float32)}
        for i in range(self.nl):
            feed[f"past_key_{i}"], feed[f"past_value_{i}"] = past[2 * i], past[2 * i + 1]
        out = self.flow.run(None, feed)
        return out[0], float(out[1].reshape(-1)[0]), out[2:]

    # ---------------------------------------------------------------------------------- text
    def pezzi(self, testo: str) -> list[tuple[str, int]]:
        """(prepared chunk, frames after EOS) as generate_audio_stream makes them."""
        from pocket_tts.models.text_chunking import prepare_text_prompt, split_into_best_sentences
        m = self.meta
        rc = m["replace_characters"]

        class T:  # the official Tokenizer interface over tokenizer.json
            def __init__(s, tk):
                s.tk = tk

            def __call__(s, x):
                import torch
                return torch.tensor(s.tk.encode(x).ids)[None, :]

            def decode(s, ids):
                return s.tk.decode(ids)

        chunks = split_into_best_sentences(T(self.tok), testo, m["max_tokens_per_chunk"], False, m["remove_semicolons"],
                                           m["append_terminal_punctuation"], m["capitalize_first_letter"], rc)
        out = []
        for c in chunks:
            prep, guess = prepare_text_prompt(c, False, m["remove_semicolons"], m["append_terminal_punctuation"],
                                              m["capitalize_first_letter"], rc)
            out.append((prep, m["frames_after_eos"] if m["frames_after_eos"] is not None else guess + 2))
        return out

    # ------------------------------------------------------------------------------ generate
    def latenti(self, past, prep: str, dopo_eos: int, rng, temperatura: float):
        m = self.meta
        ids = np.array([self.tok.encode(prep).ids], np.int64)
        max_len = math.ceil((ids.shape[1] / m["tokens_per_second"] + m["gen_seconds_padding"]) * m["sample_rate"] / FRAME)
        _, _, past = self._passo(ids, None, None, None, past)
        x = np.full((1, 1, m["latent_dim"]), np.nan, np.float32)
        eos_step = None
        std = math.sqrt(temperatura)
        for step in range(max_len):
            noise = (rng.standard_normal((1, m["latent_dim"])) * std).astype(np.float32)
            y, eos, past = self._passo(None, None, x, noise, past)
            if eos > m["eos_threshold"] and eos_step is None and step >= m["min_frames_before_eos"]:
                eos_step = step
            if eos_step is not None and step >= eos_step + dopo_eos:
                break
            yield y
            x = y[:, None]

    def decodifica(self, latenti, pezzo: int = 1):
        """Streaming decode with a fresh state, `pezzo` frames per call; first 5 ms faded in."""
        m = self.meta
        stati = [np.zeros(s["shape"], np.float32) for s in m["decoder_states"]]
        off = np.array([0], np.int64)
        coda, primo = [], True
        for lat in latenti:
            coda.append(lat)
            if len(coda) < pezzo:
                continue
            a, off, stati = self._dec(np.stack(coda, axis=1), off, stati)
            coda = []
            if primo:
                n = m["fade_in_samples"]
                a[:n] *= np.linspace(0, 1, n, dtype=np.float32)[: len(a)]
                primo = False
            yield a
        if coda:
            a, off, stati = self._dec(np.stack(coda, axis=1), off, stati)
            if primo:
                n = m["fade_in_samples"]
                a[:n] *= np.linspace(0, 1, n, dtype=np.float32)[: len(a)]
            yield a

    def _dec(self, lat, off, stati):
        feed = {"latent": lat.astype(np.float32), "offset": off}
        for j, s in enumerate(stati):
            feed[f"state_{j}"] = s
        r = self.dec.run(None, feed)
        return r[0].reshape(-1), r[1], r[2:]

    def dici(self, past, testo: str, seme: int, temperatura: float | None = None, pezzo: int = 1) -> np.ndarray:
        rng = np.random.default_rng(seme)
        t = self.meta["temperature"] if temperatura is None else temperatura
        out = []
        for prep, dopo in self.pezzi(testo):
            out += list(self.decodifica(self.latenti(past, prep, dopo, rng, t), pezzo))
        return np.concatenate(out) if out else np.zeros(0, np.float32)
