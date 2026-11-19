# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Markdown tables of V-1 for README.md, from esiti/v1/. Usage: python -I v1_resoconto.py"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, ESITI  # noqa: E402

V1 = ESITI / "v1"


def n(x, d=2):
    return "—" if x is None else f"{x:.{d}f}".replace(".", ",")


def carica(cfg):
    p = V1 / f"valuta_{cfg}.json"
    return json.loads(p.read_text())["righe"] if p.exists() else None


def silenzio_iniziale(cfg, tipo):
    import soundfile as sf
    out = []
    for f in sorted((AUDIO / "v1" / cfg).glob(f"*/s*/{tipo}*.wav")):
        a, sr = sf.read(str(f))
        k = int(0.01 * sr)
        fr = a[: len(a) // k * k].reshape(-1, k)
        db = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
        out.append(np.argmax(db > db.max() - 30) * 0.01)
    return float(np.mean(out)) if out else None


def riga(cfg, nome, sim=True):
    rr = carica(cfg)
    if rr is None:
        return None
    f = [r for r in rr if r["tipo"] == "f"]
    b = [r for r in rr if r["tipo"] == "b"]
    wer = lambda x: 100 * sum(r["errori"] for r in x) / max(1, sum(r["parole"] for r in x))  # noqa: E731
    cells = [nome, f"{sum(not r['prima_ok'] for r in f)}/{len(f)}", f"{n(wer(f), 1)}%"]
    pad = all(r["file"].endswith(":pad") for r in b)
    cells.append((f"{sum(not r['prima_ok'] for r in b)}/{len(b)}" + ("" if pad else " ¹")) if b else "—")
    cells.append(n(np.mean([r["durata_s"] for r in b])) + " s" if b else "—")
    if sim:
        cells.append(n(np.mean([r["ecapa"] for r in f])) if f and "ecapa" in f[0] else "—")
        cells.append(n(np.mean([r["wespeaker"] for r in f])) if f and "wespeaker" in f[0] else "—")
    cells.append(n(silenzio_iniziale(cfg, "f")) + " s")
    return "| " + " | ".join(cells) + " |"


def main():
    print("#### La prima parola: le impostazioni una per una (versione di maggio, 4 persone)\n")
    print("| Configurazione | prima parola persa: frasi | WER frasi | prima parola persa: frasi brevi | durata media frasi brevi | ECAPA | WeSpeaker | silenzio iniziale |")
    print("|---|---|---|---|---|---|---|---|")
    for cfg, nome in [("vm-6", "V-m, 6 strati (com'era, 1 seme)"), ("vm-24", "V-m, 24 strati (com'era, 1 seme)"),
                      ("vecchia-6", "6 strati, impostazioni dell'esportazione (temp. 0,7)"),
                      ("pausa-6", "+ fine del riferimento su 80 ms di pausa"),
                      ("temp03-6", "temperatura 0,3 al posto di 0,7"),
                      ("ufficiale-6", "6 strati, tutte le impostazioni ufficiali"),
                      ("ufficiale-6-r10", "… con riferimento di 10 s"),
                      ("ufficiale-6-r5", "… con riferimento di 5 s"),
                      ("vecchia-24", "24 strati, impostazioni dell'esportazione"),
                      ("ufficiale-24", "24 strati, impostazioni ufficiali"),
                      ("ufficiale-24-r10", "… con riferimento di 10 s"),
                      ("klein", "Klein, voce di oggi (Giulia e Marco)")]:
        r = riga(cfg, nome)
        if r:
            print(r)
    print("\nFrasi: le cinque di prova, 4 persone × 2 semi (40); frasi brevi: 16 × 4 × 2 (128), trascritte con 0,5 s di "
          "silenzio attorno (¹ senza: valutate prima di questa correzione della prova, Whisper vi inventa più spesso). Silenzio iniziale: tempo al primo frame entro 30 dB dal più forte.\n")

    print("#### La stessa prova su una voce di Kyutai (giovanni), senza clonazione\n")
    print("| Implementazione | prima parola persa: frasi | WER frasi | prima parola persa: frasi brevi | durata media frasi brevi | silenzio iniziale |")
    print("|---|---|---|---|---|---|")
    for cfg, nome in [("onnx-giovanni", "esportazione ONNX (versione di maggio), il nostro ciclo"),
                      ("pt-vecchio-giovanni", "codice ufficiale, versione di maggio"),
                      ("pt-attuale-giovanni", "codice ufficiale, versione attuale (1/10/2026)")]:
        r = riga(cfg, nome, sim=False)
        if r:
            print(r)
    par = V1 / "parita.json"
    if par.exists():
        p = json.loads(par.read_text())
        print(f"\nParità (temperatura 0, 40 passi, stessa voce, versione di maggio): fp32 coseno medio {n(p['fp32']['coseno_medio'], 3)} "
              f"(minimo {n(p['fp32']['coseno_min'], 3)}); int8 coseno medio {n(p['int8']['coseno_medio'], 3)} "
              f"(minimo {n(p['int8']['coseno_min'], 3)}).\n")

    path = V1 / "passo.jsonl"
    if path.exists():
        rows = {}
        for line in path.read_text().splitlines():
            r = json.loads(line)
            rows[r["nome"]] = r
        print("#### Il peso mentre parla (F1 e M1, cinque frasi ciascuno, una prova alla volta, processi separati)\n")
        print("| Combinazione | thread | primo pezzo / pezzi (×80 ms) | CPU s per s | orologio s per s | primo suono (mediana / max) | frasi con un vuoto | attesa per non avere vuoti (max) | memoria massima | carico |")
        print("|---|---|---|---|---|---|---|---|---|---|")
        for k, r in rows.items():
            fr = r["frasi"]
            attesa = max(x["primo_suono_s"] + max(0.0, x["ritardo_max_s"]) for x in fr)
            print(f"| {k} | {r['threads']} | {r['primo']} / {r['pezzo']} | {n(r['cpu_per_s'], 3)} | {n(r['orologio_per_s'], 3)} | "
                  f"{n(r['primo_suono_mediana_s'] * 1000, 0)} / {n(r['primo_suono_max_s'] * 1000, 0)} ms | "
                  f"{r['frasi_con_vuoti']}/{len(fr)} | {n(attesa * 1000, 0)} ms | {n(r['picco_mb'], 0)} MB | "
                  f"{n(r['carico_inizio'][0], 0)} |")
        print()
        for k in rows:
            rr = carica(k)
            if rr:
                f = [x for x in rr if x["tipo"] == "f"]
                print(f"- {k}: prima parola persa {sum(not x['prima_ok'] for x in f)}/{len(f)}, WER "
                      f"{n(100 * sum(x['errori'] for x in f) / sum(x['parole'] for x in f), 1)}%, ECAPA "
                      f"{n(np.mean([x['ecapa'] for x in f]))}, WeSpeaker {n(np.mean([x['wespeaker'] for x in f]))}")
        print()

    path = V1 / "memoria.jsonl"
    if path.exists():
        print("#### La memoria per preparare la voce (F1, 6 strati, processi separati)\n")
        print("| Riferimento | codifica | encoder | arena ONNX Runtime | memoria massima | CPU s | voce salvata |")
        print("|---|---|---|---|---|---|---|")
        cos = {}
        cp = V1 / "memoria_coseni_italian_F1.json"
        if cp.exists():
            cos = json.loads(cp.read_text())
        for line in path.read_text().splitlines():
            r = json.loads(line)
            tag = f"italian_F1_{r['durata']}_{r['enc']}_{r['pezzo']}"
            c = cos.get(tag, {}).get("coseno_min")
            salv = (f"stato {n(r['file_stato_kb'] / 1000, 1)} MB (ricarica {n(r['ricarica_stato_s'] * 1000, 0)} ms) · "
                    f"embedding {n(r['file_embedding_kb'], 0)} kB (ricarica {n(r['ricarica_da_embedding_s'], 2)} s)") if "file_stato_kb" in r else ""
            print(f"| {r['durata']} s | {'a pezzi di ' + n(r['pezzo'], 0) + ' s' if r['pezzo'] else 'intera'}"
                  f"{' (coseno min ' + n(c, 4) + ')' if c else ''} | {r['enc']} | {'sì' if r['arena'] else 'no'} | "
                  f"{n(r['picco_codifica_mb'], 0)} MB | {n(r['codifica_cpu_s'], 1)} | {salv} |")
        print()


if __name__ == "__main__":
    main()
