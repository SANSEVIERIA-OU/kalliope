# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""V-4, part B: peak memory of the real program, measured from outside.

`ru_maxrss` of a child started from Python counts the Python process it was forked from (in v4_e2e.py
the `say` calls showed 600-800 MB for that reason), so here the peak is VmHWM of the program's own
memory, read from /proc every 2 ms while it runs. Voice preparation from giovanni's recording and from
F1's 25 s reference; `say` with one short phrase and with the five test sentences in one text.

Writes ESITI/v4/memoria.json. Usage: python -I v4_memoria.py PROGRAM_DIR POCKET_DIR ORT_LIB
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from comune import AUDIO, ESITI, FRASI, PERSONE  # noqa: E402

E2E = AUDIO / "v4" / "e2e"


def picco(cmd: list[str], env: dict) -> dict:
    t = time.time()
    p = subprocess.Popen(cmd, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    hwm = 0
    while p.poll() is None:
        try:
            for line in open(f"/proc/{p.pid}/status"):
                if line.startswith("VmHWM:"):
                    hwm = max(hwm, int(line.split()[1]))
        except (FileNotFoundError, ProcessLookupError):
            break
        time.sleep(0.002)
    err = p.communicate()[1]
    return {"picco_mb": hwm / 1024, "secondi": time.time() - t, "codice": p.returncode, "stderr": err.strip()}


def main():
    prog, pocket_dir, ort = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
    cli = str(prog / "kalliope-cli")
    env = {**os.environ, "KALLIOPE_ORT_LIB": ort}
    out = {}
    for nome, rec in (("giovanni", E2E / "giovanni.wav"), ("F1", PERSONE / "F1" / "riferimento.wav")):
        out[f"voce_{nome}"] = picco([cli, "voice", "--pocket-dir", str(pocket_dir), str(rec), "-o", f"/tmp/voce-m-v4/mem-{nome}.safetensors"], env)
    voce = str(E2E / "giovanni.safetensors")
    out["say_breve"] = picco([cli, "say", "--pocket-dir", str(pocket_dir), "--voice", voce, "-o", "/tmp/voce-m-v4/mem.wav", "Va bene."], env)
    out["say_cinque_frasi"] = picco([cli, "say", "--pocket-dir", str(pocket_dir), "--voice", voce, "-o", "/tmp/voce-m-v4/mem.wav", " ".join(FRASI)], env)
    out["klein_cinque_frasi"] = picco([cli, "say", "--model-dir", "/workspace/kalliope/materiali-locali/prove-voce/bench/models/klein/onnx", "-o", "/tmp/voce-m-v4/mem.wav", " ".join(FRASI)], env)
    for k, v in out.items():
        print(k, f"{v['picco_mb']:.0f} MB", f"{v['secondi']:.1f} s", v["stderr"][:160], flush=True)
    (ESITI / "v4" / "memoria.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
