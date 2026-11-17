# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-2/V-3, step 2: does "the trick" work? Checked on voices Kyutai publishes.

For a Kyutai voice whose recording is open (kyutai/tts-voices) and whose state for the current Italian
model is open (kyutai/pocket-tts-without-voice-cloning@a7056f50, computed by Kyutai with the current
encoder from that recording):
- the trick: the recording, ended on a pause as the official code does, through the May encoder of the
  ONNX export (mimi_encoder.onnx gives latent32 @ W_may^T; the 32-number latent is recovered exactly with
  the pseudo-inverse of W_may, rank 32), projected with the current speaker projection, the current
  bos_before_voice in front, then the current flow LM (official PyTorch code, open weights);
- compared with Kyutai's own state for the same voice: the KV caches position by position, and the
  speech: ECAPA similarity of the trick's audio to the ready voice's audio, against two baselines (the
  ready voice with another seed; another ready voice), and Whisper's words.

Writes ESITI/v2/unione.json and AUDIO/v2/unione/. Usage: python -I v2_unione.py
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, ESITI, MODELLI, POCKET_DIR, leggi, ricampiona, scrivi  # noqa: E402

BASE = MODELLI / "pocket-tts-senza-clonazione"
VOCI = {"anna": "vctk/p228_023_enhanced.wav", "marius": "voice-donations/Selfie.wav", "alba": "alba-mackenna/casual.wav"}
TESTI = ["Buongiorno a tutti, scrivo invece di parlare.", "Il preventivo è di mille euro.", "Grazie.", "Va bene."]


def main():
    os.environ["OMP_NUM_THREADS"] = "2"
    import onnxruntime as ort
    import torch
    from safetensors import safe_open
    from v1_ufficiale import modello_ufficiale
    from pocket import fine_su_pausa
    from misure import Ecapa, Whisper, coseno
    torch.set_num_threads(2)
    m = modello_ufficiale(0.3, "attuale")
    with safe_open(str(BASE / "italian-vecchio" / "model.safetensors"), "pt") as f:
        w_may = f.get_tensor("flow_lm.speaker_proj_weight").float().numpy()          # [1024, 32]
    w_cur = m.flow_lm.speaker_proj_weight.detach().float().numpy()
    enc = ort.InferenceSession(str(POCKET_DIR / "onnx" / "italian" / "mimi_encoder.onnx"), providers=["CPUExecutionProvider"])
    pinv = np.linalg.pinv(w_may.T)                                                    # [1024, 32]
    E, W = Ecapa(2), Whisper(2)
    from pocket_tts.modules.stateful_module import init_states

    def stato_trucco(wav):
        a = fine_su_pausa(leggi(wav, 24000))
        cond_may = enc.run(None, {"audio": a.reshape(1, 1, -1)})[0][0]               # [T, 1024]
        lat = cond_may @ pinv                                                         # [T, 32]
        resid = float(np.abs(lat @ w_may.T - cond_may).max() / np.abs(cond_may).max())
        cond = torch.from_numpy((lat @ w_cur.T).astype(np.float32))[None]
        prompt = torch.cat([m.flow_lm.bos_before_voice, cond], dim=1)
        st = init_states(m.flow_lm, batch_size=1, sequence_length=prompt.shape[1])
        with torch.no_grad():
            m._run_flow_lm_and_increment_step(model_state=st, audio_conditioning=prompt)
        return st, resid

    def cache_cos(sa, sb):
        cs = []
        for k in sa:
            if "cache" in sa[k] and k in sb:
                x, y = sa[k]["cache"], sb[k]["cache"]
                n = min(x.shape[2], y.shape[2])
                x = x[:, :, :n].float().reshape(-1).numpy()
                y = y[:, :, :n].float().reshape(-1).numpy()
                ok = np.isfinite(x) & np.isfinite(y)
                cs.append(float(x[ok] @ y[ok] / (np.linalg.norm(x[ok]) * np.linalg.norm(y[ok]))))
        return cs

    def parla(st, testo, seme):
        torch.manual_seed(seme)
        return m.generate_audio(st, testo, copy_state=True).numpy()

    out = {}
    pronte = {v: m.get_state_for_audio_prompt(str(BASE / "voci-attuali" / f"{v}.safetensors")) for v in VOCI}
    for v, rel in VOCI.items():
        st_t, resid = stato_trucco(BASE / "registrazioni-kyutai" / rel)
        lun_t = next(iter(st_t.values()))["cache"].shape[2]
        lun_p = next(iter(pronte[v].values()))["cache"].shape[2]
        cc = cache_cos(st_t, pronte[v])
        altra = [x for x in VOCI if x != v][0]
        cc_altra = cache_cos(pronte[altra], pronte[v])
        righe = []
        for i, t in enumerate(TESTI):
            a_p0 = parla(pronte[v], t, 10 + i)
            a_p1 = parla(pronte[v], t, 20 + i)
            a_t = parla(st_t, t, 10 + i)
            a_o = parla(pronte[altra], t, 10 + i)
            for nome, a in (("pronta", a_p0), ("pronta_seme2", a_p1), ("trucco", a_t), ("altra_voce", a_o)):
                scrivi(AUDIO / "v2" / "unione" / v / f"{nome}_{i}.wav", a)
            e = {n: E.emb_audio(ricampiona(a, 24000, 16000)) for n, a in (("p0", a_p0), ("p1", a_p1), ("t", a_t), ("o", a_o))}
            z = np.zeros(12000, np.float32)
            righe.append({"testo": t,
                          "ecapa_pronta_contro_pronta_altro_seme": coseno(e["p0"], e["p1"]),
                          "ecapa_trucco_contro_pronta": coseno(e["t"], e["p0"]),
                          "ecapa_altra_voce_contro_pronta": coseno(e["o"], e["p0"]),
                          "whisper_trucco": W.trascrivi(np.concatenate([z, a_t, z]), 24000),
                          "whisper_pronta": W.trascrivi(np.concatenate([z, a_p0, z]), 24000),
                          "durata_trucco_s": len(a_t) / 24000, "durata_pronta_s": len(a_p0) / 24000})
            print(v, i, {k: (round(x, 3) if isinstance(x, float) else x) for k, x in righe[-1].items()}, flush=True)
        out[v] = {"residuo_pseudoinversa": resid, "posizioni_trucco": int(lun_t), "posizioni_pronta": int(lun_p),
                  "coseno_cache_trucco_contro_pronta": cc, "coseno_cache_altra_voce_contro_pronta": cc_altra,
                  "frasi": righe}
        print(v, "residuo", resid, "cache trucco/pronta", np.round(cc, 3), "altra voce/pronta", np.round(cc_altra, 3), flush=True)
    (ESITI / "v2").mkdir(parents=True, exist_ok=True)
    (ESITI / "v2" / "unione.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
