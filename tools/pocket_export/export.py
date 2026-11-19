# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Exports Kyutai's Pocket TTS Italian model to the ONNX graphs Kalliope runs, then checks them against
Kyutai's own code. tools/release_assets.py runs it, in a Python environment made from requirements.txt
next to this file. (It was benchmarks/voce-propria/scripts/v4_esporta.py, written in V-4 on 19/11/2026;
the export itself is unchanged.)

  python -I export.py --code DIR --weights FILE --tokenizer FILE --recording WAV --out DIR --work DIR
                      --model-revision REV --tokenizer-revision REV --code-revision REV [--layers 6]

  --code       kyutai-labs/pocket-tts at --code-revision (the folder that holds pocket_tts/)
  --weights    languages/italian/model.safetensors of kyutai/pocket-tts (the weights with voice cloning)
  --tokenizer  languages/italian/tokenizer.json of kyutai/pocket-tts-without-voice-cloning
  --recording  a recording to check the graphs with: voice-donations/Selfie.wav of kyutai/tts-voices
               (CC0), as tools/assets.json pins it
  --layers     6 (languages/italian, what Kalliope uses) or 24 (languages/italian_24l)

OUT receives what the program reads (crates/voice/src/pocket/):
- flow_lm.onnx: one step of the flow LM (text, voice or latents in; the next latent, the EOS logit and
  the grown KV cache out), with 8-bit weights in blocks of 32 computed in int8 (MatMulNBits, accuracy
  level 4): 141 MB instead of 358, 8.6 ms a step instead of 13.2 at 2 threads, in V-4;
- mimi_decoder.onnx and mimi_encoder.onnx (streaming, explicit state, fp32); graphs.py says what each
  graph computes;
- tokenizer.json (copied) and pocket.json (sizes, state shapes, and the official generation settings of
  the config).
WORK keeps the fp32 flow LM, the config written for Kyutai's loader, and report.json.

torch.onnx writes into every node where it came from: the stack trace with the paths of the files on the
machine that exports, and the Python names of the modules. Those are removed (strip_metadata): they
would put the maintainer's folders into the published files, and make the output depend on where the
export runs. What the graphs compute is not touched: with the metadata removed, the graphs exported in
V-4 and the ones exported here from the same inputs are the same bytes.

The checks, all against the official PyTorch code in fp32, with the voice of --recording: the latents
and EOS logits of a sentence at temperature 0, the voice conditioning and the voice state, and the
decoded audio, for the fp32 flow LM and for the 8-bit one. The export fails when a number is outside
the bounds in BOUNDS (V-4 measured fp32 latents at cosine 0.99999998, the conditioning within 4e-6,
the audio within 1.2e-6).
"""
from __future__ import annotations

import argparse
import json
import os
import resource
import shutil
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

FRAME = 1920  # samples per latent frame at 24 kHz (12.5 Hz)
RATE = 24000
TEXT = "Buongiorno a tutti, scrivo invece di parlare, ma vi seguo benissimo."
# (graph, measure, key, bound, "min" or "max"): the check fails when the value is past the bound.
BOUNDS = [
    ("fp32", "latents", "cosine_min", 0.9999, "min"),
    ("fp32", "eos", "diff_max", 0.01, "max"),
    ("fp32", "conditioning", "diff_max", 1e-4, "max"),
    ("fp32", "voice_state_keys_layer_0", "cosine_min", 0.9999, "min"),
    ("fp32", "voice_state_values_last_layer", "cosine_min", 0.9999, "min"),
    ("fp32", "audio", "diff_max", 1e-4, "max"),
    # 8-bit flow LM: 0.998 on Selfie.wav (19/11/2026). Dynamic int8 was at 0.97 in V-4, 4-bit weights at 0.88.
    ("int8", "latents_first_5", "cosine_min", 0.995, "min"),
    ("int8", "voice_state_keys_layer_0", "cosine_min", 0.999, "min"),
    ("int8", "voice_state_values_last_layer", "cosine_min", 0.99, "min"),
]


def peak_mb() -> float:
    return resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024


def load_model(code: Path, weights: Path, tokenizer: Path, layers: int, work: Path, temp: float = 0.3,
               threads: int = 2):
    """The official TTSModel with the given weights and tokenizer, from local files (no download)."""
    import torch
    import yaml
    torch.set_num_threads(threads)
    if str(code) not in sys.path:
        sys.path.insert(0, str(code))
    from pocket_tts.models.tts_model import TTSModel
    name = "italian" if layers == 6 else "italian_24l"
    cfg = yaml.safe_load((code / "pocket_tts" / "config" / f"{name}.yaml").read_text())
    cfg["weights_path"] = str(weights)
    cfg.pop("weights_path_without_voice_cloning", None)
    cfg["flow_lm"]["lookup_table"]["tokenizer_path"] = str(tokenizer)
    out = work / f"{name}.yaml"
    out.write_text(yaml.safe_dump(cfg))
    return TTSModel.load_model(config=str(out), temp=temp)


# ----------------------------------------------------------------------------------------- export
def export_graph(module, args, names_in, names_out, dynamic, path: Path, fixed: int):
    """`fixed` positional inputs, then the state tensors (the module's *args, one nested group for torch.export)."""
    import torch
    t = time.time()
    shapes = tuple(dynamic[:fixed]) + (tuple(dynamic[fixed:]),)
    prog = torch.onnx.export(module, tuple(args), input_names=names_in, output_names=names_out,
                             dynamic_shapes=shapes, dynamo=True, optimize=True, external_data=False)
    prog.save(str(path), external_data=False)
    print("exported", path.name, f"{path.stat().st_size / 1e6:.1f} MB", f"{time.time() - t:.0f} s", flush=True)


def export_all(m, folder: Path, flow_path: Path) -> dict:
    import torch
    from torch.export import Dim
    from graphs import FlowStep, MimiDecoderStep, MimiEncoderStep
    f = m.flow_lm
    nl = len(f.transformer.layers)
    a0 = f.transformer.layers[0].self_attn
    H, D = a0.num_kv_heads, a0.dim_per_head
    meta = {"layers": nl, "heads": H, "head_dim": D, "latent_dim": f.ldim, "dim": f.dim}

    # flow_lm.onnx (fp32)
    N, V, S, P = Dim("n_tokens", min=0, max=4096), Dim("n_voice", min=0, max=8192), Dim("n_latents", min=0, max=8), Dim("past", min=0, max=16384)
    step = FlowStep(f).eval()
    args = [torch.tensor([[5, 6, 7]], dtype=torch.int64), torch.zeros(1, 2, f.dim), torch.full((1, 2, f.ldim), float("nan")),
            torch.zeros(1, f.ldim)]
    dynamic = [{1: N}, {1: V}, {1: S}, None]
    names_in = ["text_tokens", "voice", "latents", "noise"]
    names_out = ["latent", "eos_logit"]
    for i in range(nl):
        args += [torch.zeros(1, H, 4, D), torch.zeros(1, H, 4, D)]
        dynamic += [{2: P}, {2: P}]
        names_in += [f"past_key_{i}", f"past_value_{i}"]
        names_out += [f"present_key_{i}", f"present_value_{i}"]
    with torch.no_grad():
        export_graph(step, args, names_in, names_out, dynamic, flow_path, 4)

    # mimi_decoder.onnx
    dec = MimiDecoderStep(m.mimi, f.emb_std, f.emb_mean).eval()
    T, PK = Dim("n_frames", min=1, max=512), Dim("past", min=0, max=249)
    args = [torch.zeros(1, 3, f.ldim), torch.tensor([0], dtype=torch.int64)]
    dynamic = [{1: T}, None]
    names_in, names_out = ["latent", "offset"], ["audio", "next_offset"]
    dec_states = []
    for i, (kind, ch, n) in enumerate(dec.state_shapes()):
        if kind in ("key", "value"):
            args.append(torch.zeros(1, ch, 5, n))
            dynamic.append({2: PK})
            dec_states.append({"name": f"{kind}_{i}", "shape": [1, ch, 0, n]})
        else:
            args.append(torch.zeros(1, ch, n))
            dynamic.append(None)
            dec_states.append({"name": f"{kind}_{i}", "shape": [1, ch, n]})
        names_in.append(f"state_{i}")
        names_out.append(f"next_state_{i}")
    with torch.no_grad():
        export_graph(dec, args, names_in, names_out, dynamic, folder / "mimi_decoder.onnx", 2)
    meta["decoder_states"] = dec_states

    # mimi_encoder.onnx
    enc = MimiEncoderStep(m.mimi, f.speaker_proj_weight, f.bos_before_voice).eval()
    K = Dim("n_pieces", min=1, max=1024)
    args = [torch.zeros(1, 1, 2 * FRAME), torch.tensor([0], dtype=torch.int64), torch.tensor([1.0])]
    dynamic = [{2: K * FRAME}, None, None]
    names_in, names_out = ["audio", "offset", "first"], ["voice", "bos", "next_offset"]
    enc_states = []
    for i, (kind, ch, n) in enumerate(enc.state_shapes()):
        if kind in ("key", "value"):
            args.append(torch.zeros(1, ch, 5, n))
            dynamic.append({2: PK})
            enc_states.append({"name": f"{kind}_{i}", "shape": [1, ch, 0, n]})
        else:
            args.append(torch.zeros(1, ch, n))
            dynamic.append(None)
            enc_states.append({"name": f"{kind}_{i}", "shape": [1, ch, n]})
        names_in.append(f"state_{i}")
        names_out.append(f"next_state_{i}")
    with torch.no_grad():
        export_graph(enc, args, names_in, names_out, dynamic, folder / "mimi_encoder.onnx", 3)
    meta["encoder_states"] = enc_states
    return meta


def write_meta(m, folder: Path, layers: int, meta: dict, tokenizer: Path, revisions: dict):
    name = "italian" if layers == 6 else "italian_24l"
    shutil.copyfile(tokenizer, folder / "tokenizer.json")
    c = m.config
    meta.update({
        "format": 1,
        "model": f"kyutai/pocket-tts languages/{name} @{revisions['model']}",
        "tokenizer": f"kyutai/pocket-tts-without-voice-cloning languages/{name}/tokenizer.json @{revisions['tokenizer']}",
        "code": f"kyutai-labs/pocket-tts {revisions['code'][:8]}",
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
    (folder / "pocket.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))


def strip_metadata(path: Path):
    """Removes what torch.onnx writes about where each node came from (see the top of this file)."""
    import onnx
    model = onnx.load(str(path))
    for g in [model.graph, *model.functions]:
        for node in g.node:
            del node.metadata_props[:]
            node.ClearField("doc_string")
        if isinstance(g, onnx.GraphProto):
            for v in [*g.value_info, *g.input, *g.output]:
                del v.metadata_props[:]
                v.ClearField("doc_string")
            for i in g.initializer:
                del i.metadata_props[:]
        g.ClearField("doc_string")
    del model.metadata_props[:]
    model.ClearField("doc_string")
    onnx.save(model, str(path))


def quantize(src: Path, dst: Path):
    """The flow LM with 8-bit weights in blocks of 32, computed in int8 per block (MatMulNBits, accuracy
    level 4). V-4 (benchmarks/voce-propria, v4_quant.py) compared it with dynamic int8 (103 MB, further
    from fp32: cosine 0.97) and 4-bit weights (0.88)."""
    import onnx
    from onnxruntime.quantization import matmul_nbits_quantizer as q
    t = time.time()
    model = onnx.load(str(src))
    qz = q.MatMulNBitsQuantizer(model, bits=8, block_size=32, is_symmetric=True, accuracy_level=4)
    qz.process()
    qz.model.save_model_to_file(str(dst), use_external_data_format=False)
    print("quantized", dst.name, f"{dst.stat().st_size / 1e6:.1f} MB", f"{time.time() - t:.0f} s", flush=True)


# ----------------------------------------------------------------------------------------- checks
def session(path: Path, threads: int = 2):
    import onnxruntime as ort
    o = ort.SessionOptions()
    o.intra_op_num_threads = threads
    o.inter_op_num_threads = 1
    o.enable_cpu_mem_arena = False
    o.enable_mem_pattern = False
    o.add_session_config_entry("session.intra_op.allow_spinning", "0")
    return ort.InferenceSession(str(path), o, providers=["CPUExecutionProvider"])


def state_from_kyutai(st, nl):
    """Kyutai's model state (cache [2,1,L,H,D] + offset per layer) -> past keys/values [1,H,P,D]."""
    past = []
    for i in range(nl):
        s = st[f"transformer.layers.{i}.self_attn"]
        n = int(s["offset"].view(-1)[0])
        c = s["cache"][:, :, :n].float().numpy()
        past += [np.ascontiguousarray(c[0].transpose(0, 2, 1, 3)), np.ascontiguousarray(c[1].transpose(0, 2, 1, 3))]
    return past


def step(sess, nl, tokens, voice, latents, noise, past):
    feed = {"text_tokens": tokens, "voice": voice, "latents": latents, "noise": noise}
    for i in range(nl):
        feed[f"past_key_{i}"], feed[f"past_value_{i}"] = past[2 * i], past[2 * i + 1]
    out = sess.run(None, feed)
    return out[0], out[1], out[2:]


def onnx_latents(sess, nl, past, ids, n, ldim=32, dim=1024):
    e_tok = np.zeros((1, 0), np.int64)
    e_voice = np.zeros((1, 0, dim), np.float32)
    e_lat = np.zeros((1, 0, ldim), np.float32)
    z = np.zeros((1, ldim), np.float32)
    _, _, past = step(sess, nl, ids, e_voice, e_lat, z, past)
    x = np.full((1, 1, ldim), np.nan, np.float32)
    lat, eos = [], []
    for _ in range(n):
        y, e, past = step(sess, nl, e_tok, e_voice, x, z, past)
        lat.append(y)
        eos.append(float(e[0, 0]))
        x = y[:, None]
    return np.concatenate(lat), np.array(eos)


def official_latents(m, st, prepared_text, n):
    """The official flow LM at temperature 0: latents and EOS logits of n steps (no early stop)."""
    import copy
    import torch
    st = copy.deepcopy(st)
    f = m.flow_lm
    temp, m.temp = m.temp, 0.0
    eos = []
    hook = f.out_eos.register_forward_hook(lambda mod, inp, outp: eos.append(float(outp.reshape(-1)[0])))
    try:
        prepared = f.conditioner.prepare(prepared_text)
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


def compare(a, b):
    a, b = np.asarray(a, np.float64).reshape(len(a), -1), np.asarray(b, np.float64).reshape(len(b), -1)
    cos = (a * b).sum(1) / (np.linalg.norm(a, axis=1) * np.linalg.norm(b, axis=1) + 1e-12)
    return {"diff_max": float(np.abs(a - b).max()), "max_abs": float(np.abs(b).max()),
            "cosine_min": float(cos.min()), "cosine_mean": float(cos.mean())}


def by_position(past):
    """[1,H,P,D] -> [P, H*D]."""
    return past[0].transpose(1, 0, 2).reshape(past.shape[2], -1)


def check(m, folder: Path, flow: Path, recording: Path, decoder_and_encoder: bool) -> dict:
    import torch
    from pocket_tts.data.audio import audio_read
    from pocket_tts.data.audio_utils import convert_audio, end_on_pause
    from pocket_tts.models.text_chunking import prepare_text_prompt
    from pocket_tts.modules.stateful_module import increment_steps, init_states
    meta = json.loads((folder / "pocket.json").read_text())
    nl = meta["layers"]
    out = {"flow_lm": str(flow)}
    audio, rate = audio_read(recording)
    audio = convert_audio(audio, rate, RATE, 1)
    with torch.no_grad():
        voice_state = m.get_state_for_audio_prompt(audio)
    sf = session(flow)

    # 1. flow LM from the voice of the recording, temperature 0, 40 steps
    text, _ = prepare_text_prompt(TEXT, False, False, True, True, m.replace_characters)
    ref_lat, ref_eos, ids = official_latents(m, voice_state, text, 40)
    t = time.time()
    lat, eos = onnx_latents(sf, nl, state_from_kyutai(voice_state, nl), ids.astype(np.int64), 40)
    out["flow_seconds"] = time.time() - t
    out["latents"] = compare(lat, ref_lat)
    out["latents_first_5"] = compare(lat[:5], ref_lat[:5])
    out["eos"] = {"diff_max": float(np.abs(eos - ref_eos).max())}
    print("latents", out["latents"], "eos", out["eos"], flush=True)

    # 2. encoder: the voice conditioning and the voice state, in pieces of 10 frames (0.8 s), as the program does
    a = end_on_pause(audio, RATE)
    with torch.no_grad():
        ref_cond = m._encode_audio(a[None])[0].numpy()
    se = session(folder / "mimi_encoder.onnx")
    x = a[0].numpy()
    x = np.concatenate([x, np.zeros((-len(x)) % FRAME, np.float32)])
    states = [np.zeros(s["shape"], np.float32) for s in meta["encoder_states"]]
    off = np.array([0], np.int64)
    pieces = []
    t = time.time()
    for i, k in enumerate(range(0, len(x), 10 * FRAME)):
        feed = {"audio": x[k:k + 10 * FRAME].reshape(1, 1, -1), "offset": off, "first": np.array([1.0 if i == 0 else 0.0], np.float32)}
        for j, s in enumerate(states):
            feed[f"state_{j}"] = s
        r = se.run(None, feed)
        pieces.append(r[0][0])
        bos, off, states = r[1], r[2], r[3:]
    out["encoder_seconds"] = time.time() - t
    cond = np.concatenate(pieces)
    out["conditioning"] = compare(cond, ref_cond)
    print("conditioning", out["conditioning"], flush=True)
    voice = np.concatenate([bos, cond[None]], axis=1).astype(np.float32)
    past0 = [np.zeros((1, meta["heads"], 0, meta["head_dim"]), np.float32) for _ in range(2 * nl)]
    _, _, past = step(sf, nl, np.zeros((1, 0), np.int64), voice, np.zeros((1, 0, 32), np.float32), np.zeros((1, 32), np.float32), past0)
    ref_past = state_from_kyutai(voice_state, nl)
    if past[0].shape[2] != ref_past[0].shape[2]:
        raise SystemExit(f"export.py: the voice state has {past[0].shape[2]} positions, Kyutai's {ref_past[0].shape[2]}")
    out["voice_positions"] = int(past[0].shape[2])
    out["voice_state_keys_layer_0"] = compare(by_position(past[0]), by_position(ref_past[0]))
    out["voice_state_values_last_layer"] = compare(by_position(past[-1]), by_position(ref_past[-1]))
    print("voice state", out["voice_state_keys_layer_0"], out["voice_state_values_last_layer"], flush=True)
    if not decoder_and_encoder:
        return out

    # 3. decoder: the official latents of step 1, the official streaming decode (one call per frame) against
    #    the graph fed 1, 2, 3, 4... frames per call
    f = m.flow_lm
    lt = torch.from_numpy(ref_lat)[None]
    ms = init_states(m.mimi, batch_size=1, sequence_length=lt.shape[1] * 16 + 16)
    ref_audio = []
    with torch.no_grad():
        for i in range(lt.shape[1]):
            ref_audio.append(m.mimi.decode_from_latent(lt[:, i:i + 1] * f.emb_std + f.emb_mean, ms)[0, 0].numpy())
            increment_steps(m.mimi, ms, increment=16)
    ref_audio = np.concatenate(ref_audio)
    sd = session(folder / "mimi_decoder.onnx")
    states = [np.zeros(s["shape"], np.float32) for s in meta["decoder_states"]]
    off = np.array([0], np.int64)
    decoded, i, n = [], 0, 1
    t = time.time()
    while i < lt.shape[1]:
        feed = {"latent": ref_lat[None, i:i + n], "offset": off}
        for j, s in enumerate(states):
            feed[f"state_{j}"] = s
        r = sd.run(None, feed)
        decoded.append(r[0].reshape(-1))
        off, states = r[1], r[2:]
        i += n
        n = n % 4 + 1
    out["decoder_seconds"] = time.time() - t
    decoded = np.concatenate(decoded)
    if len(decoded) != len(ref_audio):
        raise SystemExit(f"export.py: the decoder made {len(decoded)} samples, Kyutai's {len(ref_audio)}")
    out["audio"] = {"diff_max": float(np.abs(decoded - ref_audio).max()), "max_abs": float(np.abs(ref_audio).max()),
                    "samples": int(len(decoded))}
    print("audio", out["audio"], flush=True)
    return out


def out_of_bounds(report: dict) -> list[str]:
    bad = []
    for graph, measure, key, bound, kind in BOUNDS:
        value = report[graph][measure][key]
        if (kind == "min" and not value >= bound) or (kind == "max" and not value <= bound):
            bad.append(f"{graph} {measure} {key} = {value:.3g} ({kind} {bound})")
    return bad


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    for name in ("code", "weights", "tokenizer", "out", "work"):
        ap.add_argument(f"--{name}", type=Path, required=True)
    for name in ("model-revision", "tokenizer-revision", "code-revision"):
        ap.add_argument(f"--{name}", required=True)
    ap.add_argument("--recording", type=Path, required=True)
    ap.add_argument("--layers", type=int, choices=(6, 24), default=6)
    a = ap.parse_args()
    os.environ["OMP_NUM_THREADS"] = "2"
    a.out.mkdir(parents=True, exist_ok=True)
    a.work.mkdir(parents=True, exist_ok=True)
    revisions = {"model": a.model_revision, "tokenizer": a.tokenizer_revision, "code": a.code_revision}
    m = load_model(a.code.resolve(), a.weights.resolve(), a.tokenizer.resolve(), a.layers, a.work)
    fp32 = a.work / "flow_lm_fp32.onnx"
    meta = export_all(m, a.out, fp32)
    write_meta(m, a.out, a.layers, meta, a.tokenizer, revisions)
    for graph in (fp32, a.out / "mimi_decoder.onnx", a.out / "mimi_encoder.onnx"):
        strip_metadata(graph)
    quantize(fp32, a.out / "flow_lm.onnx")
    report = {"layers": a.layers, "revisions": revisions,
              "fp32": check(m, a.out, fp32, a.recording, True),
              "int8": check(m, a.out, a.out / "flow_lm.onnx", a.recording, False)}
    report["peak_mb"] = peak_mb()
    report["out_of_bounds"] = out_of_bounds(report)
    (a.work / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n")
    print("peak", round(report["peak_mb"]), "MB", flush=True)
    if report["out_of_bounds"]:
        sys.exit("export.py: the graphs do not match Kyutai's code: " + "; ".join(report["out_of_bounds"]))


if __name__ == "__main__":
    main()
