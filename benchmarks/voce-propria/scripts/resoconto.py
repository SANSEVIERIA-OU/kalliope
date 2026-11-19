# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Markdown tables for README.md from the JSON results (qualita.json, costo.jsonl, curva.json,
ricerca/*.json). Usage: python -I resoconto.py > /tmp/voce-m-tabelle.md
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import ESITI, PERSONE_INFO, riferimenti  # noqa: E402

STRADE = [("oggi", "Voce di oggi (Klein)"), ("miscela", "3 · la voce o miscela di Klein più vicina (partenza)"),
          ("ricerca", "3 · ricerca dentro Klein, 1 h di CPU"),
          ("ricerca-ecapa", "3 · ricerca giudicata da ECAPA, 30 min (esperimento)"), ("pocket24", "1 · Pocket TTS `italian_24l`"),
          ("pocket6", "1 · Pocket TTS `italian`"), ("meanvc2", "2 · Klein + MeanVC2"),
          ("openvoice", "2 · Klein + OpenVoice V2"), ("meanvc2-int8", "2 · Klein + MeanVC2 int8 (difettosa, vedi sopra)")]


def n(x, d=2):
    return "—" if x is None or (isinstance(x, float) and np.isnan(x)) else f"{x:.{d}f}".replace(".", ",")


def main():
    q = json.loads((ESITI / "qualita.json").read_text())
    rifs = list(riferimenti())
    print("### Somiglianza (ECAPA) e parole sbagliate (Whisper), per strada e per persona\n")
    print("| Strada | " + " | ".join(rifs) + " | media F1–M2 |")
    print("|---|" + "---|" * (len(rifs) + 1))
    for k, nome in STRADE:
        if k not in q["strade"]:
            continue
        cells, sims, wers = [], [], []
        for r in rifs:
            righe = q["strade"][k].get(r)
            if not righe:
                cells.append("—")
                continue
            s = float(np.mean([x["ecapa"] for x in righe]))
            e, w = sum(x["errori"] for x in righe), sum(x["parole"] for x in righe)
            cells.append(f"{n(s)} · {n(100 * e / w, 1)}%")
            if r in PERSONE_INFO:
                sims.append(s)
                wers.append((e, w))
        media = f"{n(np.mean(sims))} · {n(100 * sum(e for e, _ in wers) / sum(w for _, w in wers), 1)}%" if sims else "—"
        print(f"| {nome} | " + " | ".join(cells) + f" | {media} |")
    print("\nOgni cella: somiglianza media sulle cinque frasi · parole sbagliate sul totale delle cinque frasi.\n")

    print("### Punti di riferimento (ECAPA contro gli stessi brani tenuti da parte)\n")
    print("| Persona | sé stessa (5 brani veri) | altre persone dello stesso sesso | voce di oggi | il suo riferimento | riferimento rovinato |")
    print("|---|---|---|---|---|---|")
    for p, b in q["basi"].items():
        oggi = q["strade"]["oggi"][p]
        print(f"| {p} | {n(np.mean([x['ecapa'] for x in b['se_stessa']]))} "
              f"(da {n(min(x['ecapa'] for x in b['se_stessa']))} a {n(max(x['ecapa'] for x in b['se_stessa']))}) | "
              f"{n(np.mean([x['ecapa'] for x in b['altre_stesso_sesso']]))} | {n(np.mean([x['ecapa'] for x in oggi]))} | "
              f"{n(b['riferimento']['ecapa'])} | {n(b['riferimento_degradato']['ecapa']) if 'riferimento_degradato' in b else '—'} |")

    for chiave, titolo in (("wespeaker", "WeSpeaker ResNet34 (terzo giudice: non lo usa nessuna strada)"),
                           ("resemblyzer", "Resemblyzer (il giudice della ricerca: favorisce la strada 3)")):
        print(f"\n### {titolo}\n")
        print("| Strada | " + " | ".join(rifs) + " |")
        print("|---|" + "---|" * len(rifs))
        for k, nome in STRADE:
            if k not in q["strade"]:
                continue
            print(f"| {nome} | " + " | ".join(
                n(np.mean([x[chiave] for x in q["strade"][k][r]])) if q["strade"][k].get(r) and chiave in q["strade"][k][r][0] else "—"
                for r in rifs) + " |")
        print("| persona contro sé stessa | " + " | ".join(
            n(np.mean([x[chiave] for x in q["basi"][riferimenti()[r]["persona"]]["se_stessa"]])) for r in rifs) + " |")
        print("| altre persone dello stesso sesso | " + " | ".join(
            n(np.mean([x[chiave] for x in q["basi"][riferimenti()[r]["persona"]]["altre_stesso_sesso"]])) for r in rifs) + " |")

    print("\n### Altezza della voce (mediana F0, Hz) e variazione (deviazione standard in semitoni)\n")
    print("| Strada | " + " | ".join(rifs) + " |")
    print("|---|" + "---|" * len(rifs))
    print("| persona (brani veri) | " + " | ".join(
        f"{n(np.nanmedian([x['f0_mediana_hz'] for x in q['basi'][riferimenti()[r]['persona']]['se_stessa']]), 0)} · "
        f"{n(np.nanmean([x['f0_sd_semitoni'] for x in q['basi'][riferimenti()[r]['persona']]['se_stessa']]), 1)}" for r in rifs) + " |")
    for k, nome in STRADE:
        if k not in q["strade"]:
            continue
        print(f"| {nome} | " + " | ".join(
            f"{n(np.nanmedian([x['f0_mediana_hz'] for x in q['strade'][k][r]]), 0)} · {n(np.nanmean([x['f0_sd_semitoni'] for x in q['strade'][k][r]]), 1)}"
            if q["strade"][k].get(r) else "—" for r in rifs) + " |")

    path = ESITI / "costo.jsonl"
    if path.exists():
        rows = [json.loads(x) for x in path.read_text().splitlines()]
        print("\n### Costo (2 thread, una prova alla volta, processi separati)\n")
        print("| Strada | CPU s per s di parlato | orologio s per s | memoria massima parlando | primo suono, frase 1 / frase 4 | carico medio (1 min) |")
        print("|---|---|---|---|---|---|")
        t_ricerca = min((r["quando"] for r in rows if r["strada"] == "ricerca"), default=float("inf"))
        principale = [r for r in rows if r["quando"] < t_ricerca]          # the main pass, one window
        seconda = [r for r in rows if r["quando"] >= t_ricerca]            # today's voice and the found voices
        for k, nome in STRADE:
            rr = [r for r in principale if r["strada"] == k and r["modo"] == "parla"]
            if not rr:
                continue
            ps = [r["primo_suono_s"] for r in rr]
            print(f"| {nome} | {n(np.mean([r['cpu_per_s_parlato'] for r in rr]), 3)} | "
                  f"{n(np.mean([r['orologio_per_s_parlato'] for r in rr]), 3)} | {n(max(r['picco_mb'] for r in rr), 0)} MB | "
                  f"{n(np.mean([p['0'] for p in ps]) * 1000, 0)} / {n(np.mean([p['3'] for p in ps]) * 1000, 0)} ms | "
                  f"{n(np.mean([r['carico_inizio'][0] for r in rr]), 1)} |")
        if seconda:
            print("\nLa voce trovata dalla ricerca contro la voce di oggi, misurate più tardi nella stessa finestra (carico più alto):\n")
            print("| Strada | CPU s per s di parlato | orologio s per s | memoria massima | primo suono, frase 1 / frase 4 | carico medio (1 min) |")
            print("|---|---|---|---|---|---|")
            for k, nome in (("oggi", "Voce di oggi (Klein)"), ("ricerca", "3 · voce trovata dalla ricerca")):
                rr = [r for r in seconda if r["strada"] == k and r["modo"] == "parla"]
                if not rr:
                    continue
                ps = [r["primo_suono_s"] for r in rr]
                print(f"| {nome} | {n(np.mean([r['cpu_per_s_parlato'] for r in rr]), 3)} | "
                      f"{n(np.mean([r['orologio_per_s_parlato'] for r in rr]), 3)} | {n(max(r['picco_mb'] for r in rr), 0)} MB | "
                      f"{n(np.mean([p['0'] for p in ps]) * 1000, 0)} / {n(np.mean([p['3'] for p in ps]) * 1000, 0)} ms | "
                      f"{n(np.mean([r['carico_inizio'][0] for r in rr]), 1)} |")
        print("\n### Costo una volta sola (preparare la voce della persona)\n")
        print("| Strada | CPU s | orologio s | memoria massima | che cosa |")
        print("|---|---|---|---|---|")
        cosa = {"pocket24": "codifica Mimi del riferimento", "pocket6": "codifica Mimi del riferimento",
                "meanvc2": "codificatore del parlante WavLM-Large + ECAPA (int8, 387 MB)",
                "meanvc2-int8": "come sopra", "openvoice": "codificatore del timbro sul riferimento"}
        for k, nome in STRADE:
            rr = [r for r in rows if r["strada"] == k and r["modo"] == "prepara"]
            if not rr:
                continue
            print(f"| {nome} | {n(np.mean([r['preparazione_cpu_s'] for r in rr]), 1)} | "
                  f"{n(np.mean([r['preparazione_s'] for r in rr]), 1)} | {n(max(r['picco_mb'] for r in rr), 0)} MB | {cosa.get(k, '')} |")
    if path.exists():
        corse_t = [json.loads(f.read_text()) for f in (ESITI / "ricerca").glob("*.json")]
        for g, nome in (("resemblyzer", "3 · ricerca dentro Klein (Resemblyzer)"),
                        ("ecapa", "3 · ricerca giudicata da ECAPA (esperimento)")):
            dd = [d for d in corse_t if d.get("giudice", "resemblyzer") == g]
            if dd:
                print(f"| {nome} | {n(min(d['cpu_s'] for d in dd), 0)}–{n(max(d['cpu_s'] for d in dd), 0)} | "
                      f"{n(min(d['orologio_s'] for d in dd), 0)}–{n(max(d['orologio_s'] for d in dd), 0)} | "
                      f"{n(max(d['picco_mb'] for d in dd), 0)} MB | {len(dd)} ricerche, "
                      f"{min(d['passi'] for d in dd)}–{max(d['passi'] for d in dd)} passi ciascuna |")

    nomi = {"af_heart": "Sarah", "af_aoede": "Lyra", "af_bella": "Maya", "af_nicole": "Ivy", "af_sarah": "Bella",
            "am_fenrir": "Owen", "am_michael": "Caleb", "bf_emma": "Isabella", "bf_isabella": "Harriet",
            "bm_fable": "Edmund", "bm_george": "Arthur", "ef_dora": "Lucia", "em_alex": "Mateo",
            "em_santa": "Diego", "ff_siwis": "Camille", "if_sara": "Giulia", "im_nicola": "Marco"}

    def leggibile(t):
        for k, v in nomi.items():
            t = t.replace(k, v)
        return t.replace("0.25*", "¼ ").replace("0.75*", "¾ ").replace("0.50*", "½ ").replace("+", " + ")

    corse = sorted((json.loads(f.read_text()) for f in (ESITI / "ricerca").glob("*.json")),
                   key=lambda d: (d.get("giudice", "resemblyzer"), d["rif"]))
    if corse:
        print("\n### Strada 3: le ricerche\n")
        print("| Ricerca | giudice | CPU s | orologio | passi | controlli (respinti) | memoria massima | carico all'inizio → alla fine | partenza |")
        print("|---|---|---|---|---|---|---|---|---|")
        for d in corse:
            print(f"| {d['rif']} | {d.get('giudice', 'resemblyzer')} | {n(d['cpu_s'], 0)} | {n(d['orologio_s'] / 60, 0)} min | "
                  f"{d['passi']} | {d['controlli']} ({d['rifiutati_dal_controllo']}) | {n(d['picco_mb'], 0)} MB | "
                  f"{n(d['carico_inizio'][0], 0)} → {n(d['carico_fine'][0], 0)} | {leggibile(d['partenza']['scelta'])} |")

    path = ESITI / "curva.json"
    if path.exists():
        c = json.loads(path.read_text())
        print("\n### Strada 3: somiglianza nel tempo\n")
        mins = (0, 2, 5, 10, 20, 40)
        print("| Ricerca | giudice | partenza | " + " | ".join(f"{m} min" for m in mins) + " | fine |")
        print("|---|---|---|" + "---|" * (len(mins) + 1))

        def cella(p):
            return (f"{n(p['ecapa_frasi_di_prova'])} / {n(p.get('wespeaker_frasi_di_prova'))} "
                    f"({n(p.get('punteggio_ricerca', p.get('resemblyzer_ricerca')))})")
        for r, v in c.items():
            byp = {p["minuti_cpu_cammino"]: p for p in v["punti"]}
            celle = [cella(byp[m]) if m in byp and v["cpu_partenza_s"] + 60 * m <= v["cpu_s"] else "—" for m in mins]
            print(f"| {r} | {v.get('giudice_ricerca', 'resemblyzer')} | {leggibile(v['partenza'])} | "
                  + " | ".join(celle) + f" | {cella(v['punti'][-1])} |")
        print("\nOgni cella: ECAPA / WeSpeaker sulle cinque frasi di prova contro i brani tenuti da parte (tra parentesi il "
              "punteggio del giudice della ricerca sulle due frasi di ricerca contro il riferimento). Minuti di CPU del "
              "cammino dopo la partenza (la scelta fra le 17 voci e le miscele costa 1,5–2,5 minuti); «fine»: la voce finale.")


if __name__ == "__main__":
    main()
