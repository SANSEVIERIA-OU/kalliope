# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-4, part B: end to end with the real program, as a user would.

1. `kalliope-cli voice RECORDING.wav -o VOICE.safetensors` for giovanni (Common Voice Italian, CC0;
   Kyutai's recording, converted to WAV) and F1 (LibriVox, public domain; her 25 s reference, of which
   the program keeps 12 s): time and peak memory of the preparation.
2. `kalliope-cli say --voice VOICE --seed S` for the five test sentences and the sixteen short phrases,
   two seeds: Whisper words (short phrases with 0.5 s of silence around them), first word, ECAPA of the
   sentences against the voice; time and peak memory of each call.
3. Streaming as the app does it (`examples/pocket_stream`, 2 threads): time to the first audio, gaps
   if playback starts with the first audio, CPU per second of speech, peak memory; decode 1, 2 or 4
   frames per call.

Writes AUDIO/v4/e2e[_NAME]/ and ESITI/v4/e2e[_NAME].json.
Usage: python -I v4_e2e.py PROGRAM_DIR POCKET_DIR ORT_LIB [NAME]
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, ESITI, PERSONE, leggi, ricampiona  # noqa: E402
from v4_comune import REGISTRAZIONI  # noqa: E402

OUT = AUDIO / "v4" / "e2e"
SEMI = (1, 2)


def esegui_misurato(cmd: list[str], env: dict) -> dict:
    """Runs a command: wall time, CPU time and peak memory of that child only (wait4), standard error."""
    t = time.time()
    r, w = os.pipe()
    pid = os.fork()
    if pid == 0:
        os.dup2(w, 2)
        os.close(r)
        devnull = os.open(os.devnull, os.O_WRONLY)
        os.dup2(devnull, 1)
        os.execve(cmd[0], cmd, env)
    os.close(w)
    err = b""
    while chunk := os.read(r, 65536):
        err += chunk
    os.close(r)
    _, status, ru = os.wait4(pid, 0)
    return {"codice": os.waitstatus_to_exitcode(status), "stderr": err.decode().strip(), "secondi": time.time() - t,
            "cpu_s": ru.ru_utime + ru.ru_stime, "picco_mb": ru.ru_maxrss / 1024}


def main():
    global OUT
    prog, pocket_dir, ort = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
    nome = f"_{sys.argv[4]}" if len(sys.argv) > 4 else ""
    OUT = AUDIO / "v4" / f"e2e{nome}"
    cli = str(prog / "kalliope-cli")
    stream = str(prog / "examples" / "pocket_stream")
    env = {**os.environ, "KALLIOPE_ORT_LIB": ort}
    from comune import normalizza_kalliope, scrivi
    from misure import Ecapa, Whisper, centroide, clip_persona, coseno, norm_parole
    from v1_genera import testi
    from v1_valuta import prima_ok
    OUT.mkdir(parents=True, exist_ok=True)
    # giovanni's recording is an MP3: the program reads WAV, so convert it (48 kHz, 16 bit, as recorded).
    gio = OUT / "giovanni.wav"
    scrivi(gio, leggi(REGISTRAZIONI["giovanni"], 48000), 48000)
    voci = {"giovanni": gio, "F1": PERSONE / "F1" / "riferimento.wav"}
    res = {"preparazione": {}, "frasi": [], "streaming": {}}
    for v, rec in voci.items():
        r = esegui_misurato([cli, "voice", "--pocket-dir", str(pocket_dir), str(rec), "-o", str(OUT / f"{v}.safetensors")], env)
        res["preparazione"][v] = r
        print(v, r, flush=True)
        assert r["codice"] == 0, r
    tt = testi()
    W, E = Whisper(2), Ecapa(2)
    rif = {"giovanni": E.emb_audio(ricampiona(leggi(REGISTRAZIONI["giovanni"], 24000), 24000, 16000)),
           "F1": centroide([E.emb(f) for f in clip_persona("F1", "tenuto")])}
    for v in voci:
        for seme in SEMI:
            for kind, i, testo, ref in tt:
                wav = OUT / v / f"s{seme}" / f"{kind}{i}.wav"
                wav.parent.mkdir(parents=True, exist_ok=True)
                r = esegui_misurato([cli, "say", "--pocket-dir", str(pocket_dir), "--voice", str(OUT / f"{v}.safetensors"),
                                     "--seed", str(seme * 1000 + i), "-o", str(wav), testo], env)
                assert r["codice"] == 0, r
                m = re.search(r"load (\d+) ms · first audio (\d+) ms · synthesis (\d+) ms · audio ([\d.]+) s", r["stderr"])
                a = leggi(wav, 24000)
                a_w = np.concatenate([np.zeros(12000, np.float32), a, np.zeros(12000, np.float32)]) if kind == "b" else a
                w = W.wer_frase(a_w, 24000, ref)
                hyp = norm_parole(normalizza_kalliope([w["trascrizione"]])[0])
                riga = {"voce": v, "seme": seme, "tipo": kind, "id": i, "testo": testo, **w,
                        "prima_ok": prima_ok(norm_parole(ref), hyp), "durata_s": len(a) / 24000,
                        "load_ms": int(m[1]), "primo_suono_ms": int(m[2]), "sintesi_ms": int(m[3]),
                        "cpu_s": r["cpu_s"], "picco_mb": r["picco_mb"]}
                if kind == "f":
                    riga["ecapa"] = coseno(E.emb_audio(ricampiona(a, 24000, 16000)), rif[v])
                res["frasi"].append(riga)
    for v in voci:
        for kind in ("f", "b"):
            rr = [r for r in res["frasi"] if r["voce"] == v and r["tipo"] == kind]
            e, n = sum(r["errori"] for r in rr), sum(r["parole"] for r in rr)
            s = (f"{v:9s} {'frasi' if kind == 'f' else 'brevi'}: prima parola persa {sum(not r['prima_ok'] for r in rr)}/{len(rr)}, "
                 f"WER {100 * e / n:.1f}%, primo suono mediano {np.median([r['primo_suono_ms'] for r in rr]):.0f} ms, "
                 f"picco {max(r['picco_mb'] for r in rr):.0f} MB")
            if kind == "f":
                s += f", ECAPA {np.mean([r['ecapa'] for r in rr]):.3f}"
            print(s, flush=True)
    # 3. streaming, normalized text as the app passes it
    righe = []
    for kind, i, testo, _ in tt:
        frasi = normalizza_kalliope([testo])[0]
        p = subprocess.run([cli, "phonemes", testo], capture_output=True, text=True, env=env)
        sent = [ln.split("\t")[0] for ln in p.stdout.splitlines() if ln]
        righe.append(" ".join(s[:1].upper() + s[1:] for s in sent) or frasi)
    testo_in = "\n".join(righe) + "\n"
    for v in voci:
        for df in (1, 2, 4):
            t = time.time()
            p = subprocess.run([stream, "--pocket-dir", str(pocket_dir), "--voice", str(OUT / f"{v}.safetensors"),
                                "--threads", "2", "--decode-frames", str(df)], input=testo_in, capture_output=True,
                               text=True, env=env, check=True)
            linee = [json.loads(x) for x in p.stdout.splitlines()]
            somm = linee[-1]
            per = linee[:-1]
            somm["primo_suono_ms_mediano"] = float(np.median([x["first_audio_ms"] for x in per]))
            somm["vuoti_ms_totali"] = float(sum(x["gap_ms"] for x in per))
            somm["carico"] = open("/proc/loadavg").read().split()[:3]
            somm["secondi"] = time.time() - t
            res["streaming"][f"{v}_df{df}"] = {"riassunto": somm, "testi": per}
            print(v, "decode", df, somm, flush=True)
    (ESITI / "v4" / f"e2e{nome}.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
