# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-4, part A step 3: export the current official Italian model to the ONNX graphs Kalliope runs.

Graphs (scripts/v4_grafi.py): flow_lm.onnx (one flow-LM step: text, voice or latents in, next latent,
EOS logit and the grown KV cache out), mimi_decoder.onnx and mimi_encoder.onnx (streaming, explicit
state). Plus tokenizer.json (copied from the open repository) and pocket.json (what the engine needs to
know: sizes, state shapes, the official generation settings of the config).

Then checks every graph against the official PyTorch code (fp32): latents and EOS of a sentence from
Kyutai's ready voice at temperature 0, the voice conditioning and the voice state from a recording, and
the decoded audio. With --int8, also makes flow_lm_int8.onnx (dynamic int8 on the MatMul weights) and
checks it the same way.

Writes MODELLI/pocket-onnx-v4/<italian|italian_24l>/ and ESITI/v4/esporta_<layers>.json.
Usage: python -I v4_esporta.py --strati 6 [--int8] [--solo-verifica]
"""
from __future__ import annotations

import argparse
import json
import math
import os
import shutil
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import ESITI, MODELLI, leggi, picco_mb  # noqa: E402
from v4_comune import APERTI, REGISTRAZIONI, REPO, modello, pronta  # noqa: E402

OUT = MODELLI / "pocket-onnx-v4"
FRAME = 1920  # samples per latent frame at 24 kHz (12.5 Hz)
TESTO = "Buongiorno a tutti, scrivo invece di parlare, ma vi seguo benissimo."


def esporta(modulo, args, nomi_in, nomi_out, dinamiche, path: Path, fissi: int):
    """`fissi` positional inputs, then the state tensors (the module's *args, one nested group for torch.export)."""
    import torch
    t = time.time()
    din = tuple(dinamiche[:fissi]) + (tuple(dinamiche[fissi:]),)
    prog = torch.onnx.export(modulo, tuple(args), input_names=nomi_in, output_names=nomi_out,
                             dynamic_shapes=din, dynamo=True, optimize=True, external_data=False)
    prog.save(str(path), external_data=False)
    print("esportato", path.name, f"{path.stat().st_size / 1e6:.1f} MB", f"{time.time() - t:.0f} s", flush=True)


def esporta_tutto(m, cartella: Path, strati: int) -> dict:
    import torch
    from torch.export import Dim
    from v4_grafi import FlowStep, MimiDecoderStep, MimiEncoderStep
    f = m.flow_lm
    nl = len(f.transformer.layers)
    a0 = f.transformer.layers[0].self_attn
    H, D = a0.num_kv_heads, a0.dim_per_head
    meta = {"layers": nl, "heads": H, "head_dim": D, "latent_dim": f.ldim, "dim": f.dim}

    # flow_lm.onnx
    N, V, S, P = Dim("n_tokens", min=0, max=4096), Dim("n_voice", min=0, max=8192), Dim("n_latents", min=0, max=8), Dim("past", min=0, max=16384)
    step = FlowStep(f).eval()
    args = [torch.tensor([[5, 6, 7]], dtype=torch.int64), torch.zeros(1, 2, f.dim), torch.full((1, 2, f.ldim), float("nan")),
            torch.zeros(1, f.ldim)]
    din = [{1: N}, {1: V}, {1: S}, None]
    nomi_in = ["text_tokens", "voice", "latents", "noise"]
    nomi_out = ["latent", "eos_logit"]
    for i in range(nl):
        args += [torch.zeros(1, H, 4, D), torch.zeros(1, H, 4, D)]
        din += [{2: P}, {2: P}]
        nomi_in += [f"past_key_{i}", f"past_value_{i}"]
        nomi_out += [f"present_key_{i}", f"present_value_{i}"]
    with torch.no_grad():
        esporta(step, args, nomi_in, nomi_out, din, cartella / "flow_lm.onnx", 4)

    # mimi_decoder.onnx
    dec = MimiDecoderStep(m.mimi, f.emb_std, f.emb_mean).eval()
    T, PK = Dim("n_frames", min=1, max=512), Dim("past", min=0, max=249)
    args = [torch.zeros(1, 3, f.ldim), torch.tensor([0], dtype=torch.int64)]
    din = [{1: T}, None]
    nomi_in, nomi_out = ["latent", "offset"], ["audio", "next_offset"]
    stati_dec = []
    for i, (kind, ch, n) in enumerate(dec.state_shapes()):
        if kind in ("key", "value"):
            args.append(torch.zeros(1, ch, 5, n))
            din.append({2: PK})
            stati_dec.append({"name": f"{kind}_{i}", "shape": [1, ch, 0, n]})
        else:
            args.append(torch.zeros(1, ch, n))
            din.append(None)
            stati_dec.append({"name": f"{kind}_{i}", "shape": [1, ch, n]})
        nomi_in.append(f"state_{i}")
        nomi_out.append(f"next_state_{i}")
    with torch.no_grad():
        esporta(dec, args, nomi_in, nomi_out, din, cartella / "mimi_decoder.onnx", 2)
    meta["decoder_states"] = stati_dec

    # mimi_encoder.onnx
    enc = MimiEncoderStep(m.mimi, f.speaker_proj_weight, f.bos_before_voice).eval()
    K = Dim("n_pieces", min=1, max=1024)
    args = [torch.zeros(1, 1, 2 * FRAME), torch.tensor([0], dtype=torch.int64), torch.tensor([1.0])]
    din = [{2: K * FRAME}, None, None]
    nomi_in, nomi_out = ["audio", "offset", "first"], ["voice", "bos", "next_offset"]
    stati_enc = []
    for i, (kind, ch, n) in enumerate(enc.state_shapes()):
        if kind in ("key", "value"):
            args.append(torch.zeros(1, ch, 5, n))
            din.append({2: PK})
            stati_enc.append({"name": f"{kind}_{i}", "shape": [1, ch, 0, n]})
        else:
            args.append(torch.zeros(1, ch, n))
            din.append(None)
            stati_enc.append({"name": f"{kind}_{i}", "shape": [1, ch, n]})
        nomi_in.append(f"state_{i}")
        nomi_out.append(f"next_state_{i}")
    with torch.no_grad():
        esporta(enc, args, nomi_in, nomi_out, din, cartella / "mimi_encoder.onnx", 3)
    meta["encoder_states"] = stati_enc
    return meta


def scrivi_meta(m, cartella: Path, strati: int, meta: dict):
    nome = "italian" if strati == 6 else "italian_24l"
    shutil.copyfile(APERTI / nome / "tokenizer.json", cartella / "tokenizer.json")
    c = m.config
    meta.update({
        "format": 1,
        "model": f"kyutai/pocket-tts languages/{nome} @3e82814a68665eec246ff649b14c71331f955c06",
        "tokenizer": f"kyutai/pocket-tts-without-voice-cloning languages/{nome}/tokenizer.json @4e1e0a3e611c51c0b4ed8174fc10f32a54644303",
        "code": "kyutai-labs/pocket-tts a4a6054d",
        "licence": "CC-BY-4.0",
        "sample_rate": c.mimi.sample_rate,
        "frame_size": FRAME,
        "steps_per_frame": int(m.mimi.encoder_frame_rate / m.mimi.frame_rate),
        "temperature": c.default_temperature,
        "eos_threshold": c.default_eos_threshold,
        "max_tokens_per_chunk": 50,
        "min_frames_before_eos": 6,
        "tokens_per_second": 3.0,
        "gen_seconds_padding": 2.0,
        "fade_in_samples": c.mimi.sample_rate // 200,
        "pause_seconds": 0.08, "pause_fade_seconds": 0.02, "pause_floor_db": 35.0,
        "frames_after_eos": c.model_recommended_frames_after_eos,
        "remove_semicolons": c.remove_semicolons,
        "append_terminal_punctuation": c.append_terminal_punctuation,
        "capitalize_first_letter": c.capitalize_first_letter,
        "pad_with_spaces_for_short_inputs": c.pad_with_spaces_for_short_inputs,
        "replace_characters": c.replace_characters,
    })
    (cartella / "pocket.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))


# ----------------------------------------------------------------------------------------- checks
def sessione(path: Path, threads: int = 2):
    import onnxruntime as ort
    o = ort.SessionOptions()
    o.intra_op_num_threads = threads
    o.inter_op_num_threads = 1
    o.enable_cpu_mem_arena = False
    o.enable_mem_pattern = False
    o.add_session_config_entry("session.intra_op.allow_spinning", "0")
    return ort.InferenceSession(str(path), o, providers=["CPUExecutionProvider"])


def stato_da_kyutai(st, nl):
    """Kyutai's model state (cache [2,1,L,H,D] + offset per layer) -> past keys/values [1,H,P,D]."""
    past = []
    for i in range(nl):
        s = st[f"transformer.layers.{i}.self_attn"]
        n = int(s["offset"].view(-1)[0])
        c = s["cache"][:, :, :n].float().numpy()
        past += [np.ascontiguousarray(c[0].transpose(0, 2, 1, 3)), np.ascontiguousarray(c[1].transpose(0, 2, 1, 3))]
    return past


def passo(sess, nl, tokens, voice, latents, noise, past):
    feed = {"text_tokens": tokens, "voice": voice, "latents": latents, "noise": noise}
    for i in range(nl):
        feed[f"past_key_{i}"], feed[f"past_value_{i}"] = past[2 * i], past[2 * i + 1]
    out = sess.run(None, feed)
    return out[0], out[1], out[2:]


def latenti_onnx(sess, nl, past, ids, n, ldim=32, dim=1024):
    e_tok = np.zeros((1, 0), np.int64)
    e_voice = np.zeros((1, 0, dim), np.float32)
    e_lat = np.zeros((1, 0, ldim), np.float32)
    z = np.zeros((1, ldim), np.float32)
    _, _, past = passo(sess, nl, ids, e_voice, e_lat, z, past)
    x = np.full((1, 1, ldim), np.nan, np.float32)
    lat, eos = [], []
    for _ in range(n):
        y, e, past = passo(sess, nl, e_tok, e_voice, x, z, past)
        lat.append(y)
        eos.append(float(e[0, 0]))
        x = y[:, None]
    return np.concatenate(lat), np.array(eos)


def latenti_ufficiali(m, st, testo_preparato, n):
    """The official flow LM at temperature 0: latents and EOS logits of n steps (no early stop)."""
    import copy
    import torch
    st = copy.deepcopy(st)
    f = m.flow_lm
    temp, m.temp = m.temp, 0.0
    eos = []
    hook = f.out_eos.register_forward_hook(lambda mod, inp, outp: eos.append(float(outp.reshape(-1)[0])))
    try:
        prepared = f.conditioner.prepare(testo_preparato)
        m._expand_kv_cache(st, m._flow_lm_current_end(st) + prepared.shape[1] + n + 1)
        with torch.no_grad():
            m._run_flow_lm_and_increment_step(model_state=st, text_tokens=prepared)
            eos.clear()
            x = torch.full((1, 1, f.ldim), float("nan"))
            lat = []
            for _ in range(n):
                y, _ = m._run_flow_lm_and_increment_step(model_state=st, backbone_input_latents=x)
                lat.append(y[:, 0].numpy())
                x = y
    finally:
        hook.remove()
        m.temp = temp
    return np.concatenate(lat), np.array(eos), prepared.numpy()


def confronto(a, b):
    a, b = np.asarray(a, np.float64).reshape(len(a), -1), np.asarray(b, np.float64).reshape(len(b), -1)
    cos = (a * b).sum(1) / (np.linalg.norm(a, axis=1) * np.linalg.norm(b, axis=1) + 1e-12)
    return {"diff_max": float(np.abs(a - b).max()), "max_abs": float(np.abs(b).max()),
            "coseno_min": float(cos.min()), "coseno_medio": float(cos.mean())}


def verifica(m, cartella: Path, strati: int, flow_file: str) -> dict:
    import torch
    from pocket_tts.data.audio_utils import end_on_pause
    from pocket_tts.models.text_chunking import prepare_text_prompt
    from pocket_tts.modules.stateful_module import increment_steps, init_states
    meta = json.loads((cartella / "pocket.json").read_text())
    nl = meta["layers"]
    out = {"flow_lm": flow_file}
    # 1. flow LM from Kyutai's ready voice (giovanni), temperature 0, 40 steps
    st = m.get_state_for_audio_prompt(str(pronta("giovanni", strati)))
    testo, _ = prepare_text_prompt(TESTO, False, False, True, True, m.replace_characters)
    ref_lat, ref_eos, ids = latenti_ufficiali(m, st, testo, 40)
    sf = sessione(cartella / flow_file)
    t = time.time()
    lat, eos = latenti_onnx(sf, nl, stato_da_kyutai(st, nl), ids.astype(np.int64), 40)
    out["flow_tempo_s"] = time.time() - t
    out["latenti"] = confronto(lat, ref_lat)
    out["eos"] = {"diff_max": float(np.abs(eos - ref_eos).max()), "primo_sopra_soglia_ufficiale":
                  int(np.argmax(ref_eos > -4.0)) if (ref_eos > -4.0).any() else None,
                  "primo_sopra_soglia_onnx": int(np.argmax(eos > -4.0)) if (eos > -4.0).any() else None}
    print("latenti", out["latenti"], "eos", out["eos"], flush=True)

    # 2. encoder: conditioning and voice state from a recording (anna), pieces of 10 frames (0.8 s)
    a = torch.from_numpy(leggi(REGISTRAZIONI["anna"], 24000))[None]
    a = end_on_pause(a, 24000)
    with torch.no_grad():
        ref_cond = m._encode_audio(a[None])[0].numpy()
    se = sessione(cartella / "mimi_encoder.onnx")
    x = a[0].numpy()
    x = np.concatenate([x, np.zeros((-len(x)) % FRAME, np.float32)])
    stati = [np.zeros(s["shape"], np.float32) for s in meta["encoder_states"]]
    off = np.array([0], np.int64)
    pezzi = []
    t = time.time()
    for i, k in enumerate(range(0, len(x), 10 * FRAME)):
        feed = {"audio": x[k:k + 10 * FRAME].reshape(1, 1, -1), "offset": off, "first": np.array([1.0 if i == 0 else 0.0], np.float32)}
        for j, s in enumerate(stati):
            feed[f"state_{j}"] = s
        r = se.run(None, feed)
        pezzi.append(r[0][0])
        bos, off, stati = r[1], r[2], r[3:]
    out["encoder_tempo_s"] = time.time() - t
    cond = np.concatenate(pezzi)
    out["voce_condizionamento"] = confronto(cond, ref_cond)
    print("condizionamento", out["voce_condizionamento"], flush=True)
    voice = np.concatenate([bos, cond[None]], axis=1).astype(np.float32)
    past0 = [np.zeros((1, meta["heads"], 0, meta["head_dim"]), np.float32) for _ in range(2 * nl)]
    _, _, past = passo(sf, nl, np.zeros((1, 0), np.int64), voice, np.zeros((1, 0, 32), np.float32), np.zeros((1, 32), np.float32), past0)
    ref_past = stato_da_kyutai(m.get_state_for_audio_prompt(str(pronta("anna", strati))), nl)
    out["stato_voce"] = {"posizioni": int(past[0].shape[2]), "posizioni_kyutai": int(ref_past[0].shape[2]),
                         "chiavi_strato_0": confronto(past[0][0].transpose(1, 0, 2).reshape(past[0].shape[2], -1),
                                                      ref_past[0][0].transpose(1, 0, 2).reshape(ref_past[0].shape[2], -1)),
                         "valori_ultimo_strato": confronto(past[-1][0].transpose(1, 0, 2).reshape(past[-1].shape[2], -1),
                                                           ref_past[-1][0].transpose(1, 0, 2).reshape(ref_past[-1].shape[2], -1))}
    print("stato voce", out["stato_voce"], flush=True)

    # 3. decoder: the official latents of step 1, official streaming decode (one call per frame, as the
    #    official worker can do) against the graph fed 1, 2, 3, 4... frames per call
    f = m.flow_lm
    lt = torch.from_numpy(ref_lat)[None]
    ms = init_states(m.mimi, batch_size=1, sequence_length=lt.shape[1] * 16 + 16)
    ref_audio = []
    with torch.no_grad():
        for i in range(lt.shape[1]):
            ref_audio.append(m.mimi.decode_from_latent(lt[:, i:i + 1] * f.emb_std + f.emb_mean, ms)[0, 0].numpy())
            increment_steps(m.mimi, ms, increment=16)
    ref_audio = np.concatenate(ref_audio)
    sd = sessione(cartella / "mimi_decoder.onnx")
    stati = [np.zeros(s["shape"], np.float32) for s in meta["decoder_states"]]
    off = np.array([0], np.int64)
    audio, i, n = [], 0, 1
    t = time.time()
    while i < lt.shape[1]:
        feed = {"latent": ref_lat[None, i:i + n], "offset": off}
        for j, s in enumerate(stati):
            feed[f"state_{j}"] = s
        r = sd.run(None, feed)
        audio.append(r[0].reshape(-1))
        off, stati = r[1], r[2:]
        i += n
        n = n % 4 + 1
    out["decoder_tempo_s"] = time.time() - t
    audio = np.concatenate(audio)
    out["audio"] = {"diff_max": float(np.abs(audio - ref_audio).max()), "max_abs": float(np.abs(ref_audio).max()),
                    "campioni": int(len(audio)), "campioni_ufficiali": int(len(ref_audio))}
    print("audio", out["audio"], flush=True)
    return out


def int8(cartella: Path):
    from onnxruntime.quantization import QuantType, quantize_dynamic
    t = time.time()
    quantize_dynamic(str(cartella / "flow_lm.onnx"), str(cartella / "flow_lm_int8.onnx"),
                     op_types_to_quantize=["MatMul"], weight_type=QuantType.QInt8, per_channel=True)
    p = cartella / "flow_lm_int8.onnx"
    print("int8", p.name, f"{p.stat().st_size / 1e6:.1f} MB", f"{time.time() - t:.0f} s", flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--strati", type=int, default=6)
    ap.add_argument("--int8", action="store_true")
    ap.add_argument("--solo-verifica", action="store_true")
    a = ap.parse_args()
    os.environ["OMP_NUM_THREADS"] = "2"
    sys.path.insert(0, str(REPO))
    m = modello(a.strati, 0.3)
    cartella = OUT / ("italian" if a.strati == 6 else "italian_24l")
    cartella.mkdir(parents=True, exist_ok=True)
    if not a.solo_verifica:
        meta = esporta_tutto(m, cartella, a.strati)
        scrivi_meta(m, cartella, a.strati, meta)
    if a.int8 and not (cartella / "flow_lm_int8.onnx").exists():
        int8(cartella)
    res = {"strati": a.strati, "fp32": verifica(m, cartella, a.strati, "flow_lm.onnx")}
    if a.int8:
        res["int8"] = verifica(m, cartella, a.strati, "flow_lm_int8.onnx")
    res["picco_mb"] = picco_mb()
    (ESITI / "v4").mkdir(parents=True, exist_ok=True)
    (ESITI / "v4" / f"esporta_{a.strati}.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))
    print("picco", res["picco_mb"], "MB", flush=True)


if __name__ == "__main__":
    main()
