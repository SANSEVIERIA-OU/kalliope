# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""The ways of speaking with the person's voice, behind one interface.

    s = build(name, threads)          # load models
    s.prepara(rif)                    # once per person: encode the reference (timed as one-time cost)
    audio = s.dici(frase)             # one test sentence (dict from esiti/frasi.json), float32 at s.sr
    s.primo_suono(frase)              # seconds until the first audio of that sentence

Names: oggi (Klein Giulia/Marco), ricerca (Klein with the voice found by strada3_ricerca.py),
pocket24 / pocket6 (Pocket TTS italian_24l / italian, int8, cloning from the reference),
meanvc2 / openvoice (Klein followed by a voice converter).
"""
from __future__ import annotations

import importlib.util
import json
import sys
import time
import types
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, CODICE, DATA, MODELLI, POCKET_DIR, leggi, ort_options, ricampiona  # noqa: E402
from klein import Klein  # noqa: E402

KLEIN_SR = 24000


def _modulo(nome: str, path: Path):
    spec = importlib.util.spec_from_file_location(nome, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nome] = mod
    spec.loader.exec_module(mod)
    return mod


# ----------------------------------------------------------------------------- Klein (today, search)
class Oggi:
    sr = KLEIN_SR

    def __init__(self, threads: int):
        self.k = Klein(threads)
        self.style = None

    def prepara(self, rif: dict):
        self.style = self.k.style(rif["klein"])

    def dici(self, frase: dict) -> np.ndarray:
        return self.k.synth(frase["fonemi"], self.style)

    def primo_suono(self, frase: dict) -> float:
        t0 = time.perf_counter()
        self.k.chunk(self.k.tokens(frase["fonemi"][0]), self.style, 0)
        return time.perf_counter() - t0


    def carica_voce(self, rif: dict):
        self.prepara(rif)


class Ricerca(Oggi):
    def prepara(self, rif: dict):
        z = np.load(DATA / "lavoro" / "ricerca" / f"{rif['rif']}.npz")
        self.style = z["migliore"].astype(np.float32)


VOCI = DATA / "lavoro" / "voci"


def _salva(nome: str, rif: dict, **arrays):
    VOCI.mkdir(parents=True, exist_ok=True)
    np.savez(VOCI / f"{nome}_{rif['rif']}.npz", **arrays)


def _carica(nome: str, rif: dict):
    return np.load(VOCI / f"{nome}_{rif['rif']}.npz")


# ----------------------------------------------------------------------------- Pocket TTS
class Pocket:
    def __init__(self, threads: int, bundle: str):
        import onnxruntime as ort  # noqa: F401
        mod = _modulo("pocket_tts_onnx", POCKET_DIR / "pocket_tts_onnx.py")
        cls = mod.PocketTTSOnnx
        cls._make_session_options = lambda self: ort_options(threads)
        self.tts = cls(models_dir=str(POCKET_DIR / "onnx"), language=bundle, precision="int8",
                       device="cpu", temperature=0.7, lsd_steps=1)
        self.sr = self.tts.sample_rate
        self.voce = None
        self.nome = bundle

    def prepara(self, rif: dict):
        np.random.seed(0)
        emb = self.tts.encode_voice(rif["file"])
        _salva(self.nome, rif, emb=emb)
        self._condiziona(rif, emb)

    def carica_voce(self, rif: dict):
        self._condiziona(rif, _carica(self.nome, rif)["emb"])

    def _condiziona(self, rif, emb):
        state = self.tts._condition_with_voice_embeddings(emb)
        self.tts._voice_state_cache.clear()
        self.voce = f"persona-{rif['rif']}"
        self.tts._voice_state_cache[self.voce] = self.tts._clone_state(state)

    def dici(self, frase: dict) -> np.ndarray:
        np.random.seed(1000 + frase["id"])
        return self.tts.generate(frase["normalizzato"], voice=self.voce).astype(np.float32)

    def primo_suono(self, frase: dict) -> float:
        t0 = time.perf_counter()
        next(iter(self.tts.stream(frase["normalizzato"], voice=self.voce)))
        return time.perf_counter() - t0


# ----------------------------------------------------------------------------- Klein + converter
class KleinVC:
    """Klein speaks (in-process copy of the program), then the converter changes the timbre.
    With `sorgente_cli=True` the Klein audio is the program's own output in AUDIO/oggi."""

    def __init__(self, threads: int):
        self.k = Klein(threads)
        self.threads = threads
        self.sorgente_cli = False
        self.voce_klein = None

    def sorgente(self, frase: dict) -> np.ndarray:
        if self.sorgente_cli:
            return leggi(AUDIO / "oggi" / self.voce_klein / f"{frase['id']}.wav", KLEIN_SR)
        return self.k.synth(frase["fonemi"], self.k.style(self.voce_klein))

    def dici(self, frase: dict) -> np.ndarray:
        return self.converti(self.sorgente(frase))


class MeanVC2(KleinVC):
    sr = 16000

    def __init__(self, threads: int, variante: str = "fp32"):
        super().__init__(threads)
        import onnxruntime as ort
        d = MODELLI / "meanvc2-onnx"
        self.mod = _modulo("meanvc2_onnx_stream", CODICE / "dl-meanvc2_onnx/meanvc2_onnx-main/tool/onnx_stream.py")
        vc = self.mod.OnnxStreamingVC.__new__(self.mod.OnnxStreamingVC)
        # fp32: everything fp32; int8: ASR, DiT and Vocos int8 (the export's default);
        # int8-asr-dit: ASR and DiT int8, Vocos fp32 (one of the export's variants)
        q = {"fp32": (), "int8": ("asr", "dit", "vocos"), "int8-asr-dit": ("asr", "dit"),
             "int8-asr": ("asr",), "int8-dit": ("dit",)}[variante]
        o = ort_options(threads)
        vc.s = {n: ort.InferenceSession(str(d / f"{n}{'.int8' if n in q else ''}.onnx"), o,
                                        providers=["CPUExecutionProvider"])
                for n in ("fbank", "asr", "gtm", "dit", "vocos")}
        vc.steps = 2                 # upstream runtime/run_rt.py uses two mean-flow steps
        vc.noise_fn = None
        vc.rng = np.random.default_rng(0)
        vc.record = False
        vc.spk = None
        vc.reset()
        self.vc = vc
        self.spk_path = d / "speaker" / "speaker.int8.onnx"
        self.spk_sess = None

    def prepara(self, rif: dict):
        import onnxruntime as ort
        self.voce_klein = rif["klein"]
        if self.spk_sess is None:
            self.spk_sess = ort.InferenceSession(str(self.spk_path), ort_options(self.threads),
                                                 providers=["CPUExecutionProvider"])
        ref16 = leggi(rif["file"], 16000)
        emb = self.spk_sess.run(None, {"wav": ref16[None]})[0]
        _salva("meanvc2", rif, emb=emb)
        self.vc.set_target(emb)
        self.spk_sess = None   # the 387 MB encoder is only needed once per person

    def carica_voce(self, rif: dict):
        self.voce_klein = rif["klein"]
        self.vc.set_target(_carica("meanvc2", rif)["emb"])

    def converti(self, a24: np.ndarray, primo: bool = False):
        self.vc.reset()
        self.vc.rng = np.random.default_rng(0)
        x = np.concatenate([ricampiona(a24, KLEIN_SR, 16000), np.zeros(16000 // 2, np.float32)])
        out, t0 = [], time.perf_counter()
        for i in range(0, len(x), self.mod.CHUNK):
            y = self.vc.process(x[i:i + self.mod.CHUNK])
            if y.size:
                if primo:
                    return time.perf_counter() - t0
                out.append(y)
        y = np.concatenate(out) if out else np.zeros(0, np.float32)
        return y[: int(len(a24) / KLEIN_SR * 16000) + 1600]

    def primo_suono(self, frase: dict) -> float:
        t0 = time.perf_counter()
        a = self.k.chunk(self.k.tokens(frase["fonemi"][0]), self.k.style(self.voce_klein), 0)
        t_klein = time.perf_counter() - t0
        return t_klein + self.converti(a, primo=True)


class OpenVoice(KleinVC):
    sr = 22050

    def __init__(self, threads: int):
        super().__init__(threads)
        import torch
        torch.set_num_threads(threads)
        root = CODICE / "dl-openvoice/OpenVoice-main"
        pkg = types.ModuleType("openvoice")
        pkg.__path__ = [str(root / "openvoice")]
        sys.modules["openvoice"] = pkg
        for n in ("commons", "transforms", "attentions", "modules", "mel_processing", "utils", "models"):
            _modulo(f"openvoice.{n}", root / "openvoice" / f"{n}.py")
        utils, models = sys.modules["openvoice.utils"], sys.modules["openvoice.models"]
        self.spec = sys.modules["openvoice.mel_processing"].spectrogram_torch
        d = MODELLI / "openvoice-v2" / "converter"
        self.hps = utils.get_hparams_from_file(str(d / "config.json"))
        m = models.SynthesizerTrn(0, self.hps.data.filter_length // 2 + 1, n_speakers=self.hps.data.n_speakers,
                                  **self.hps.model)
        ck = torch.load(str(d / "checkpoint.pth"), map_location="cpu")
        m.load_state_dict(ck["model"], strict=False)
        self.m = m.eval()
        self.torch = torch
        self.se_src = {}
        self.se_tgt = None

    def _se(self, audio: np.ndarray, sr: int):
        """extract_se of the official ToneColorConverter on ~10 s pieces (as get_se does), averaged."""
        h = self.hps.data
        a = ricampiona(audio, sr, h.sampling_rate)
        n = max(1, int(round(len(a) / h.sampling_rate / 10.0)))
        gs = []
        for piece in np.array_split(a, n):
            y = self.torch.FloatTensor(piece)[None]
            y = self.spec(y, h.filter_length, h.sampling_rate, h.hop_length, h.win_length, center=False)
            with self.torch.no_grad():
                gs.append(self.m.ref_enc(y.transpose(1, 2)).unsqueeze(-1))
        return self.torch.stack(gs).mean(0)

    def se_klein(self, voce: str):
        """Source timbre: today's voice reading a 25 s paragraph (made once, outside the timing)."""
        if voce not in self.se_src:
            p = DATA / "lavoro" / f"paragrafo_{voce}.wav"
            self.se_src[voce] = self._se(leggi(p, KLEIN_SR), KLEIN_SR)
        return self.se_src[voce]

    def prepara(self, rif: dict):
        self.voce_klein = rif["klein"]
        src = self.se_klein(rif["klein"])
        self.se_tgt = self._se(leggi(rif["file"], 24000), 24000)
        _salva("openvoice", rif, tgt=self.se_tgt.numpy(), src=src.numpy())

    def carica_voce(self, rif: dict):
        self.voce_klein = rif["klein"]
        z = _carica("openvoice", rif)
        self.se_tgt = self.torch.from_numpy(z["tgt"])
        self.se_src[rif["klein"]] = self.torch.from_numpy(z["src"])

    def converti(self, a24: np.ndarray) -> np.ndarray:
        h = self.hps.data
        a = ricampiona(a24, KLEIN_SR, h.sampling_rate)
        with self.torch.no_grad():
            y = self.torch.FloatTensor(a)[None]
            spec = self.spec(y, h.filter_length, h.sampling_rate, h.hop_length, h.win_length, center=False)
            lens = self.torch.LongTensor([spec.size(-1)])
            out = self.m.voice_conversion(spec, lens, sid_src=self.se_klein(self.voce_klein),
                                          sid_tgt=self.se_tgt, tau=0.3)[0][0, 0]
        return out.numpy().astype(np.float32)

    def primo_suono(self, frase: dict) -> float:
        t0 = time.perf_counter()
        a = self.k.chunk(self.k.tokens(frase["fonemi"][0]), self.k.style(self.voce_klein), 0)
        self.converti(a)
        return time.perf_counter() - t0


def build(nome: str, threads: int = 2):
    if nome == "oggi":
        return Oggi(threads)
    if nome == "ricerca":
        return Ricerca(threads)
    if nome == "pocket24":
        return Pocket(threads, "italian_24l")
    if nome == "pocket6":
        return Pocket(threads, "italian")
    if nome == "meanvc2":
        return MeanVC2(threads, "fp32")
    if nome == "meanvc2-int8":
        return MeanVC2(threads, "int8")
    if nome.startswith("meanvc2-int8-"):
        return MeanVC2(threads, nome[len("meanvc2-"):])
    if nome == "openvoice":
        return OpenVoice(threads)
    raise ValueError(nome)


def paragrafo_klein():
    """The 25 s paragraph read by Giulia and Marco, the source timbre for OpenVoice."""
    from oggi import say
    testo = ("Buonasera a tutti, grazie per avermi invitato a questa riunione. Prima di cominciare vorrei "
             "riassumere i punti principali del progetto: abbiamo terminato la prima fase in anticipo, il "
             "budget è rispettato e il gruppo lavora bene. Restano da decidere le date della prossima "
             "consegna e la divisione dei compiti. Se siete d'accordo, comincerei proprio da qui.")
    for v in ("Giulia", "Marco"):
        p = DATA / "lavoro" / f"paragrafo_{v}.wav"
        if not p.exists():
            say(testo, p, v)
    return json.dumps({"paragrafo": testo})
