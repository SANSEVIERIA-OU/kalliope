# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Strategy 3: look for the person's voice inside Klein's style space (the 256 numbers).

On the model of KVoiceWalk (github.com/RobViren/kvoicewalk, Apache-2.0): Klein speaks two search
sentences (never the test sentences) with a candidate style, Resemblyzer compares the result to
the reference, and a random walk keeps a candidate only if it scores better.

- Start: the 17 voices of model.json, then blends of the five closest (weights 1/4, 1/2, 3/4).
- Walk: best + sigma * N(0, std of the 17 voices per number); sigma shrinks after long runs
  without improvement; each number stays within the range of the 17 voices widened by 25%.
- Score: mean target similarity of the two sentences, minus the shortfall of their mutual
  similarity below 0.80 (a voice that changes from sentence to sentence is not a voice).
- Guard against nonsense: Whisper (base, int8; the small model costs 6 CPU-s per sentence here)
  must hear the two sentences with at most 15% wrong words, and their length must stay within
  0.6-1.6 times that of today's voice. The start is checked; during the walk the current best is
  checked at most once a minute of CPU, and if it fails the walk goes back to the last best that
  passed (the improvements in between are marked as discarded). The final voice is checked too.
- Budget: CPU seconds of this process (one thread), default 3600, logged against time.

Usage: python -I strada3_ricerca.py RIF [--budget 3600]  (RIF: F1 F1d F2 M1 M2 M2d)
Writes ESITI/ricerca/RIF.json (curve) and DATA/lavoro/ricerca/RIF.npz (every best vector).
"""
from __future__ import annotations

import os

for _k in ("OMP_NUM_THREADS", "MKL_NUM_THREADS", "OPENBLAS_NUM_THREADS"):
    os.environ[_k] = "1"   # one thread for everything: the budget is CPU time

import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import CLI, DATA, ESITI, MODELLI, carico, cpu_s, leggi, normalizza_kalliope, picco_mb, riferimenti  # noqa: E402
from klein import Klein  # noqa: E402
from misure import Resemblyzer, Whisper, coseno, errori, norm_parole  # noqa: E402

TESTI_RICERCA = [
    "Oggi il cielo è sereno e il treno parte alle nove.",
    "Vorrei sapere se domani la sala delle riunioni è libera.",
]


def fonemi(testo: str) -> tuple[list[str], str]:
    import subprocess
    r = subprocess.run([str(CLI), "phonemes", testo], capture_output=True, text=True, check=True)
    rows = [line.split("\t") for line in r.stdout.strip().splitlines()]
    return [p for _, p in rows], " ".join(s for s, _ in rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("rif")
    ap.add_argument("--budget", type=float, default=3600.0)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--giudice", choices=("resemblyzer", "ecapa"), default="resemblyzer")
    a = ap.parse_args()
    info = riferimenti()[a.rif]
    nome = a.rif if a.giudice == "resemblyzer" else f"{a.rif}_ecapa"
    lock = DATA / "lavoro" / "ricerca" / f"{nome}.lock"
    lock.parent.mkdir(parents=True, exist_ok=True)
    try:
        lock.open("x").write(str(os.getpid()))
    except FileExistsError:
        print(f"{a.rif}: ricerca già fatta o in corso ({lock})", flush=True)
        return
    c_start, w_start = cpu_s(), time.perf_counter()
    carico0 = carico()

    K = Klein(threads=1)
    if a.giudice == "ecapa":   # side experiment: the search judged by ECAPA on the reference
        from misure import Ecapa
        E = Ecapa(threads=1)

        class _R:
            @staticmethod
            def emb_audio(x, sr):
                from comune import ricampiona
                return E.emb_audio(ricampiona(x, sr, 16000))
        R = _R()
    else:
        R = Resemblyzer(threads=1)
    W = Whisper(threads=1, size=str(MODELLI / "faster-whisper-base"))
    rng = np.random.default_rng(a.seed)
    testi = [fonemi(t) for t in TESTI_RICERCA]
    target = R.emb_audio(leggi(info["file"]), 24000)
    soglia = 0.80 if a.giudice == "resemblyzer" else 0.75   # stock voices: ECAPA 0.82-0.86 between the two sentences
    c_prep = cpu_s() - c_start

    def voce(style):
        return [K.synth(f, style, seed=7 + i) for i, (f, _) in enumerate(testi)]

    def punteggio(style):
        audios = voce(style)
        embs = [R.emb_audio(x, K.sr) for x in audios]
        sims = [coseno(e, target) for e in embs]
        auto = coseno(embs[0], embs[1])
        return float(np.mean(sims) - max(0.0, soglia - auto)), float(np.mean(sims)), auto, audios

    base_style = K.style(info["klein"])
    base_len = [len(x) for x in voce(base_style)]

    def capibile(audios):
        err = par = 0
        trasc = []
        for x, (_, norm) in zip(audios, testi):
            hyp = W.trascrivi(x, K.sr)
            trasc.append(hyp)
            e = errori(norm_parole(norm), norm_parole(normalizza_kalliope([hyp])[0]))
            err, par = err + e, par + len(norm_parole(norm))
        lens_ok = all(0.6 <= len(x) / b <= 1.6 for x, b in zip(audios, base_len))
        return err / par, lens_ok, trasc

    S = K.styles
    lo, hi = S.min(0), S.max(0)
    span = hi - lo
    lo, hi = lo - 0.25 * span, hi + 0.25 * span
    std = S.std(0)

    storia, vettori, eventi = [], [], []
    t_rel = lambda: (cpu_s() - c_start, time.perf_counter() - w_start)  # noqa: E731

    def registra(fase, passo, sc, sim, auto, wer, nome, vec):
        c, w = t_rel()
        storia.append({"cpu_s": c, "orologio_s": w, "fase": fase, "passo": passo, "punteggio": sc,
                       "somiglianza_resemblyzer": sim, "coerenza": auto, "wer_ricerca": wer, "da": nome})
        vettori.append(np.asarray(vec, np.float32).copy())

    # 1. the 17 voices
    stock = []
    for i, sp in enumerate(K.speakers):
        sc, sim, auto, _ = punteggio(S[i])
        stock.append((sc, sim, auto, sp, S[i]))
    stock.sort(key=lambda r: -r[0])
    # 2. blends of the five best
    cand = list(stock)
    top = stock[:5]
    for i in range(5):
        for j in range(i + 1, 5):
            for w in (0.25, 0.5, 0.75):
                v = w * top[i][4] + (1 - w) * top[j][4]
                sc, sim, auto, _ = punteggio(v)
                cand.append((sc, sim, auto, f"{w:.2f}*{top[i][3]}+{1 - w:.2f}*{top[j][3]}", v))
    cand.sort(key=lambda r: -r[0])
    best = None
    for sc, sim, auto, nome_c, v in cand:        # first candidate that passes the guard
        wer, ok, _ = capibile(voce(v))
        if wer <= 0.15 and ok:
            best = (sc, sim, auto, nome_c, v.astype(np.float32), wer)
            break
    registra("partenza", 0, best[0], best[1], best[2], best[5], best[3], best[4])
    storia[-1]["verificato"] = True
    partenza = {"voci": [{"id": r[3], "punteggio": r[0], "somiglianza": r[1]} for r in stock],
                "miscele_migliori": [{"id": r[3], "punteggio": r[0]} for r in cand[:8]], "scelta": best[3]}

    # 3. random walk
    sigma, fermo, passo, rifiutati, controlli = 0.30, 0, 0, 0, 0
    verificato, da_verificare = best, []
    ultimo_controllo = cpu_s() - c_start

    def controlla():
        nonlocal best, verificato, sigma, rifiutati, controlli, da_verificare
        controlli += 1
        wer, ok, trasc = capibile(voce(best[4]))
        c_now, _ = t_rel()
        eventi.append({"cpu_s": c_now, "superato": bool(wer <= 0.15 and ok), "wer": wer, "durata_ok": ok,
                       "trascrizioni": trasc, "punteggio": best[0]})
        if wer <= 0.15 and ok:
            best = (*best[:5], wer)
            verificato = best
            for k in da_verificare:
                storia[k]["verificato"] = True
                storia[k]["wer_ricerca"] = wer
        else:
            for k in da_verificare:
                storia[k]["scartato"] = True
            best = verificato
            sigma = max(0.03, sigma * 0.7)
            rifiutati += 1
        da_verificare = []

    while cpu_s() - c_start < a.budget:
        passo += 1
        v = np.clip(best[4] + sigma * std * rng.standard_normal(256).astype(np.float32), lo, hi)
        sc, sim, auto, audios = punteggio(v)
        if sc > best[0]:
            best = (sc, sim, auto, f"passo {passo}", v, None)
            registra("cammino", passo, sc, sim, auto, None, best[3], v)
            storia[-1]["verificato"] = False
            da_verificare.append(len(storia) - 1)
            fermo = 0
            sigma = min(0.5, sigma * 1.05)
        else:
            fermo += 1
            if fermo >= 150:
                sigma, fermo = max(0.03, sigma * 0.7), 0
        if da_verificare and cpu_s() - c_start - ultimo_controllo >= 60:
            controlla()
            ultimo_controllo = cpu_s() - c_start
        if passo % 200 == 0:
            c, w = t_rel()
            print(f"{a.rif} passo {passo} cpu {c:.0f}s best {best[0]:.4f} sigma {sigma:.3f} "
                  f"rifiutati {rifiutati}", flush=True)
    if da_verificare:
        controlla()

    c, w = t_rel()
    fine = {"rif": a.rif, "giudice": a.giudice, "persona": info["persona"], "voce_di_oggi": info["klein"], "budget_cpu_s": a.budget,
            "cpu_s": c, "orologio_s": w, "cpu_preparazione_s": c_prep, "passi": passo,
            "rifiutati_dal_controllo": rifiutati, "controlli": controlli, "picco_mb": picco_mb(), "carico_inizio": carico0,
            "carico_fine": carico(), "testi_ricerca": TESTI_RICERCA, "partenza": partenza, "storia": storia,
            "controlli_dettaglio": eventi,
            "migliore": {"punteggio": best[0], "somiglianza_resemblyzer": best[1], "coerenza": best[2],
                         "wer_ricerca": best[5], "da": best[3]}}
    (ESITI / "ricerca").mkdir(parents=True, exist_ok=True)
    (ESITI / "ricerca" / f"{nome}.json").write_text(json.dumps(fine, ensure_ascii=False, indent=1))
    out = DATA / "lavoro" / "ricerca"
    out.mkdir(parents=True, exist_ok=True)
    np.savez(out / f"{nome}.npz", vettori=np.stack(vettori), cpu_s=np.array([s["cpu_s"] for s in storia]),
             migliore=best[4])
    print(f"{a.rif} fine: {passo} passi, cpu {c:.0f}s, orologio {w:.0f}s, best {best[0]:.4f} "
          f"(sim {best[1]:.3f}), picco {picco_mb():.0f} MB", flush=True)


if __name__ == "__main__":
    main()
