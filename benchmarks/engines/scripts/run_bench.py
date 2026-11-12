# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Orchestrate the benchmark: power sampling + one worker process per configuration.

Energy source: amdgpu hwmon 'PPT' (whole APU package power: CPU cores + iGPU + SoC),
readable without root. Sampled at 50 Hz on a shared CLOCK_MONOTONIC timeline.
Marginal energy = (mean power in synthesis window - idle baseline) * window length,
with the baseline taken from idle windows right before and after each worker.
"""
import glob
import json
import statistics
import subprocess
import sys
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PY = str(ROOT / ".venv" / "bin" / "python")
OUT = ROOT / "out"
IDLE_S = 6.0

SENTENCES = [
    "Buongiorno a tutti, scusate il ritardo: avevo un problema con la connessione.",
    "Posso fare una domanda? Non ho capito bene l'ultimo punto della presentazione.",
    "Fantastico! È esattamente quello che speravamo di ottenere.",
    "Allora... direi che possiamo procedere, se siete tutti d'accordo.",
    "Il preventivo è di 1.250 euro, IVA esclusa, da saldare entro il 15 marzo 2027.",
    "La nave ha gettato l'àncora nel porto; ancora una volta siamo arrivati tardi.",
    "Perché non ne parliamo giovedì alle 10:30, dopo la riunione con l'ufficio tecnico?",
    "Attenzione: il documento va inviato a Marco, Giulia e Stefano entro stasera.",
    "Secondo me dovremmo rivedere le priorità del progetto, concentrandoci prima sulle funzioni "
    "essenziali e rimandando il resto alla prossima versione, così da rispettare la scadenza "
    "senza sacrificare la qualità.",
    "Sì, va bene.",
]

REF_TEXT = ("Buongiorno, questa è una registrazione di riferimento per la voce. "
            "Parlo con calma e con un tono naturale, come durante una normale riunione di lavoro. "
            "Grazie a tutti per l'attenzione.")
REF_WAV = OUT / "ref" / "serena_ref.wav"


def configs():
    c = []
    add = lambda label, **kw: c.append({"label": label, **kw})  # noqa: E731
    for t in (1, 2, 4):
        add(f"pocket-it-int8-t{t}", engine="pocket", voice=str(REF_WAV), precision="int8", bundle="italian", threads=t)
    for t in (1, 2, 4):
        add(f"pocket-it-fp32-t{t}", engine="pocket", voice=str(REF_WAV), precision="fp32", bundle="italian", threads=t)
    for t in (2, 4):
        add(f"pocket-it24l-int8-t{t}", engine="pocket", voice=str(REF_WAV), precision="int8", bundle="italian_24l", threads=t)
    for t in (1, 2, 4):
        add(f"kokoro-sara-fp32-t{t}", engine="kokoro", voice="if_sara", precision="fp32", threads=t)
    for t in (1, 2, 4):
        add(f"kokoro-sara-int8-t{t}", engine="kokoro", voice="if_sara", precision="int8", threads=t)
    add("kokoro-nicola-fp32-t2", engine="kokoro", voice="im_nicola", precision="fp32", threads=2)
    for t in (1, 2, 4):
        add(f"piper-serena-med-t{t}", engine="piper", voice="it_IT-serena-medium", threads=t)
    add("piper-serena-high-t1", engine="piper", voice="it_IT-serena-high", threads=1)
    add("piper-paola-med-t1", engine="piper", voice="it_IT-paola-medium", threads=1)
    add("piper-riccardo-xlow-t1", engine="piper", voice="it_IT-riccardo-x_low", threads=1)
    for t in (1, 2, 4):
        add(f"supertonic-F1-5step-t{t}", engine="supertonic", voice="F1", steps=5, threads=t)
    add("supertonic-F1-2step-t2", engine="supertonic", voice="F1", steps=2, threads=2)
    add("supertonic-M1-5step-t2", engine="supertonic", voice="M1", steps=5, threads=2)
    for t in (1, 2, 4):
        add(f"klein-giulia-t{t}", engine="klein", voice="Giulia", threads=t)
    add("klein-marco-t2", engine="klein", voice="Marco", threads=2)
    # effect of ORT thread spinning (default ON in onnxruntime)
    add("pocket-it-int8-t2-SPIN", engine="pocket", voice=str(REF_WAV), precision="int8", bundle="italian", threads=2, spin=True)
    add("kokoro-sara-fp32-t2-SPIN", engine="kokoro", voice="if_sara", precision="fp32", threads=2, spin=True)
    return c


class PowerSampler(threading.Thread):
    def __init__(self, hz=50):
        super().__init__(daemon=True)
        paths = [p for p in glob.glob("/sys/class/hwmon/hwmon*/power1_input")
                 if Path(p).with_name("power1_label").exists()
                 and Path(p).with_name("power1_label").read_text().strip() == "PPT"]
        if not paths:
            raise SystemExit("PPT sensor not found")
        self.path, self.period, self.samples, self.stop = paths[0], 1.0 / hz, [], False

    def run(self):
        f = open(self.path)
        nxt = time.monotonic()
        while not self.stop:
            f.seek(0)
            self.samples.append((time.monotonic(), int(f.read()) / 1e6))
            nxt += self.period
            time.sleep(max(0.0, nxt - time.monotonic()))

    def mean(self, a, b):
        v = [w for t, w in self.samples if a <= t <= b]
        return (statistics.fmean(v) if v else float("nan")), len(v)


def make_reference():
    if REF_WAV.exists():
        return
    REF_WAV.parent.mkdir(parents=True, exist_ok=True)
    code = (
        "import sys,wave;sys.path.insert(0,sys.argv[1]);import engines;engines.configure_ort(2,False);"
        "e=engines.build('piper',voice='it_IT-serena-medium');import numpy as np,soundfile as sf;"
        "a=e.synth(sys.argv[2]);sf.write(sys.argv[3],a,e.sample_rate,subtype='PCM_16')"
    )
    subprocess.run([PY, "-I", "-c", code, str(ROOT / "scripts"), REF_TEXT, str(REF_WAV)], check=True)


def main():
    only = sys.argv[1:]  # optional label filters
    OUT.mkdir(exist_ok=True)
    make_reference()
    sent_file = OUT / "sentences.json"
    sent_file.write_text(json.dumps(SENTENCES, ensure_ascii=False, indent=1))
    res_file = OUT / "results.jsonl"
    sampler = PowerSampler()
    sampler.start()
    todo = [c for c in configs() if not only or any(o in c["label"] for o in only)]
    for n, cfg in enumerate(todo, 1):
        print(f"[{n}/{len(todo)}] {cfg['label']}", flush=True)
        pre0 = time.monotonic(); time.sleep(IDLE_S); pre1 = time.monotonic()
        p = subprocess.run([PY, "-I", str(ROOT / "scripts" / "worker.py"), json.dumps(cfg),
                            str(sent_file), str(OUT / "wav" / cfg["label"])],
                           capture_output=True, text=True)
        post0 = time.monotonic(); time.sleep(IDLE_S); post1 = time.monotonic()
        if p.returncode != 0:
            print("   FAILED:", p.stderr.strip().splitlines()[-3:], flush=True)
            with res_file.open("a") as f:
                f.write(json.dumps({"label": cfg["label"], "error": p.stderr[-2000:]}) + "\n")
            continue
        r = json.loads(p.stdout.strip().splitlines()[-1])
        a, b = r["window"]
        p_act, n_act = sampler.mean(a, b)
        p_pre, _ = sampler.mean(pre0, pre1)
        p_post, _ = sampler.mean(post0, post1)
        base = (p_pre + p_post) / 2
        r.update({"p_active_w": p_act, "p_idle_pre_w": p_pre, "p_idle_post_w": p_post,
                  "power_samples": n_act,
                  "j_per_audio_s": (p_act - base) * (b - a) / r["audio_s"],
                  "j_per_audio_s_gross": p_act * (b - a) / r["audio_s"]})
        with res_file.open("a") as f:
            f.write(json.dumps(r) + "\n")
        print(f"   rtf={r['rtf']:.3f} coreRTF={r['core_rtf']:.3f} ttfa={r['ttfa_short_s']*1000:.0f}ms "
              f"rss={r['rss_peak_mb']:.0f}MB P={p_act:.1f}W idle={base:.1f}W "
              f"J/s={r['j_per_audio_s']:.2f}", flush=True)
    sampler.stop = True


if __name__ == "__main__":
    main()
