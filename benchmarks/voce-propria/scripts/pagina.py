# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""The listening page for the owner: static HTML and <audio>, no scripts, no libraries.

For each person: the reference and a real held-out clip, then sentence by sentence today's voice
and the strategies side by side, with the numbers under each. The audio is copied next to the
page (DATA/ascolto/audio), so the folder can be served on its own.

Usage: python -I pagina.py
"""
from __future__ import annotations

import html
import json
import os
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402

from comune import AUDIO, DATA, ESITI, PERSONE, frasi, riferimenti  # noqa: E402

OUT = DATA / "ascolto"
COLONNE = [
    ("oggi", "Voce di oggi", "Klein, senza clonazione"),
    ("pocket24", "Strada 1 · Pocket TTS 24 strati", "imita la voce dal riferimento"),
    ("pocket6", "Strada 1 · Pocket TTS 6 strati", "più leggero"),
    ("meanvc2", "Strada 2 · Klein + MeanVC2", "converte il timbro (16 kHz)"),
    ("openvoice", "Strada 2 · Klein + OpenVoice V2", "converte il timbro"),
    ("ricerca", "Strada 3 · ricerca dentro Klein", "un’ora di CPU per persona"),
]
NOMI = {"F1": "F1 · voce femminile", "F2": "F2 · voce femminile", "M1": "M1 · voce maschile",
        "M2": "M2 · voce maschile", "F1d": "F1 con il riferimento rovinato", "M2d": "M2 con il riferimento rovinato"}


def num(x: float, d: int = 2) -> str:
    return f"{x:.{d}f}".replace(".", ",")


def copia(src: Path, rel: str) -> str:
    dst = OUT / "audio" / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)
    return "audio/" + rel


def audio_tag(src: str) -> str:
    return f'<audio controls preload="none" src="{html.escape(src)}"></audio>'


def main():
    q = json.loads((ESITI / "qualita.json").read_text())
    persone = json.loads((ESITI / "persone.json").read_text())
    costi, memoria = {}, {}
    if (ESITI / "costo.jsonl").exists():
        righe_costo = [json.loads(line) for line in (ESITI / "costo.jsonl").read_text().splitlines()]
        t_ricerca = min((r["quando"] for r in righe_costo if r["strada"] == "ricerca"), default=float("inf"))
        for r in righe_costo:                      # the main pass only: one window, one load
            if r["modo"] == "parla" and r["quando"] < t_ricerca:
                costi.setdefault(r["strada"], []).append(r["cpu_per_s_parlato"])
                memoria.setdefault(r["strada"], []).append(r["picco_mb"])
    preparazione = {}
    if (ESITI / "costo.jsonl").exists():
        for line in (ESITI / "costo.jsonl").read_text().splitlines():
            r = json.loads(line)
            if r["modo"] == "prepara":
                preparazione.setdefault(r["strada"], []).append(r["preparazione_cpu_s"])
    ricerche = [d for d in (json.loads(f.read_text()) for f in sorted((ESITI / "ricerca").glob("*.json")))
                if d.get("giudice", "resemblyzer") == "resemblyzer"]
    sintesi = ['<table class="sintesi"><thead><tr><th>Strada</th><th>Somiglianza media (F1, F2, M1, M2)</th>'
               '<th>Parole sbagliate</th><th>Con il riferimento rovinato (F1, M2)</th>'
               '<th>CPU per secondo di parlato</th><th>Memoria parlando</th><th>Preparare la voce, una volta</th>'
               '</tr></thead><tbody>']
    for k, t, _ in COLONNE:
        if k not in q["strade"]:
            continue
        dati = q["strade"][k]
        pul = [x for rr in ("F1", "F2", "M1", "M2") for x in dati.get(rr, [])]
        rov = [x for rr in ("F1d", "M2d") for x in dati.get(rr, [])]
        if not pul:
            continue
        e, n_ = sum(x["errori"] for x in pul), sum(x["parole"] for x in pul)
        rv = (f'{num(np.mean([x["ecapa"] for x in rov]))} · {num(100 * sum(x["errori"] for x in rov) / sum(x["parole"] for x in rov), 1)}%'
              if rov and k != "oggi" else "—")
        cpu = f'{num(np.mean(costi[k]))} s' if k in costi else ("come la voce di oggi" if k == "ricerca" else "—")
        mem = f'{num(max(memoria[k]), 0)} MB' if k in memoria else ("come la voce di oggi" if k == "ricerca" else "—")
        if k == "ricerca" and ricerche:
            prep = f'{num(np.mean([d["cpu_s"] for d in ricerche]) / 60, 0)} min di CPU (la ricerca)'
        elif k in preparazione:
            prep = f'{num(np.mean(preparazione[k]), 1)} s di CPU'
        else:
            prep = "—"
        sintesi.append(f'<tr><th>{html.escape(t)}</th><td>{num(np.mean([x["ecapa"] for x in pul]))}</td>'
                       f'<td>{num(100 * e / n_, 1)}%</td><td>{rv}</td><td>{cpu}</td><td>{mem}</td><td>{prep}</td></tr>')
    sintesi.append("</tbody></table>")
    fr = frasi()
    OUT.mkdir(parents=True, exist_ok=True)   # updated in place: the folder is being served
    rifs = riferimenti()
    parti = []
    indice = []
    for r, info in rifs.items():
        p = info["persona"]
        fonte = persone[p]
        basi = q["basi"][p]
        se = np.mean([x["ecapa"] for x in basi["se_stessa"]])
        indice.append(f'<a href="#{r}">{html.escape(NOMI[r])}</a>')
        ref_file = info["file"]
        h = [f'<section id="{r}"><h2>{html.escape(NOMI[r])}</h2>',
             f'<p class="fonte">{html.escape(fonte["lettore"])}, {html.escape(fonte["opera"])} '
             f'(LibriVox, pubblico dominio). Somiglianza di un suo brano vero con sé stessa: '
             f'<b>{num(se)}</b>.</p>',
             '<div class="rif">',
             f'<figure><figcaption>Il riferimento ({num(fonte["riferimento_durata"], 0)} s): l’unica cosa '
             f'che le strade sentono</figcaption>{audio_tag(copia(ref_file, f"{r}/riferimento.wav"))}</figure>',
             f'<figure><figcaption>Un brano vero della stessa persona, mai dato alle strade</figcaption>'
             f'{audio_tag(copia(PERSONE / p / "tenuto_0.wav", f"{r}/tenuto.wav"))}</figure>']
        if r.endswith("d"):
            h.append(f'<figure><figcaption>Il riferimento com’era prima di rovinarlo</figcaption>'
                     f'{audio_tag(copia(PERSONE / p / "riferimento.wav", f"{r}/riferimento_pulito.wav"))}</figure>')
        h.append("</div>")
        h.append('<div class="tab"><table><thead><tr><th>Frase</th>')
        cols = [c for c in COLONNE if r in q["strade"].get(c[0], {})]
        for k, t, sub in cols:
            h.append(f'<th>{html.escape(t)}<span>{html.escape(sub)}</span></th>')
        h.append("</tr></thead><tbody>")
        for f in fr:
            h.append(f'<tr><th class="frase">{html.escape(f["testo"])}</th>')
            for k, _, _ in cols:
                righe = {x["id"]: x for x in q["strade"][k][r]}
                x = righe.get(f["id"])
                src = (AUDIO / "oggi" / info["klein"] / f"{f['id']}.wav") if k == "oggi" else (AUDIO / k / r / f"{f['id']}.wav")
                if x is None or not src.exists():
                    h.append("<td>—</td>")
                    continue
                tag = audio_tag(copia(src, f"{r}/{k}/{f['id']}.wav"))
                err = x["errori"]
                h.append(f'<td>{tag}<div class="n">somiglianza <b>{num(x["ecapa"])}</b> · '
                         f'parole sbagliate <b>{err}</b> su {x["parole"]}</div>'
                         f'<div class="t" title="che cosa ha capito Whisper">«{html.escape(x["trascrizione"])}»</div></td>')
            h.append("</tr>")
        h.append('<tr class="tot"><th>In media</th>')
        for k, _, _ in cols:
            righe = q["strade"][k][r]
            sim = np.mean([x["ecapa"] for x in righe])
            e, n = sum(x["errori"] for x in righe), sum(x["parole"] for x in righe)
            c = f' · CPU {num(np.mean(costi[k]))} s per s' if k in costi else ""
            h.append(f'<td>somiglianza <b>{num(sim)}</b> · parole sbagliate <b>{num(100 * e / n, 1)}%</b>{c}</td>')
        h.append("</tr></tbody></table></div></section>")
        parti.append("".join(h))

    prima_dopo = sezione_prima_dopo(fr)
    pagina = f"""<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kalliope · la voce di chi la usa: campioni d’ascolto</title>
<style>
body{{font:16px/1.5 system-ui,sans-serif;margin:0;padding:1.5rem;background:#f6f4ef;color:#1d1b17}}
h1{{font-size:1.6rem;margin:0 0 .5rem}} h2{{margin:2.5rem 0 .25rem;font-size:1.3rem}} h3{{margin:1.5rem 0 .5rem;font-size:1.1rem}}
.intro{{max-width:60rem}} .fonte{{margin:.25rem 0 1rem;color:#4a463e}}
nav a{{margin-right:1rem}} .rif{{display:flex;flex-wrap:wrap;gap:1rem 2rem;margin-bottom:1rem}}
figure{{margin:0}} figcaption{{font-size:.9rem;color:#4a463e;margin-bottom:.25rem}}
.tab{{overflow-x:auto}} table{{border-collapse:collapse;min-width:100%}}
th,td{{border:1px solid #d8d3c8;padding:.5rem;vertical-align:top;text-align:start;background:#fff}}
thead th{{background:#ece8df;font-size:.9rem}} thead th span{{display:block;font-weight:400;color:#5b564c}}
th.frase{{font-weight:400;min-width:11rem;max-width:15rem;background:#faf8f3;position:sticky;inset-inline-start:0;z-index:1}}
thead th:first-child,tr.tot th{{position:sticky;inset-inline-start:0;z-index:1}}
thead th{{min-width:12.5rem}} audio{{width:12.5rem;height:2rem}}
table.sintesi{{min-width:0;margin:1rem 0}} table.sintesi thead th{{min-width:0}} table.sintesi th,table.sintesi td{{font-size:.9rem}} .n{{font-size:.85rem;margin-top:.25rem}} .t{{font-size:.8rem;color:#6a655b;margin-top:.15rem}}
tr.tot td,tr.tot th{{background:#f1eee6;font-size:.9rem}}
</style></head><body>
<h1>La voce di chi usa Kalliope: campioni d’ascolto</h1>
<div class="intro">
<p>Quattro voci vere (lettori LibriVox, pubblico dominio) fanno la parte di chi usa Kalliope. Ogni strada ha sentito
solo il riferimento di 25 secondi; le frasi sono quelle dei campioni del sito più una domanda e un’esclamazione,
passate dal normalizzatore di Kalliope.</p>
<p><b>Somiglianza</b>: quanto la voce assomiglia ai brani veri della persona tenuti da parte (ECAPA, da 0 a 1). Per
farsi un’idea: un brano vero della stessa persona fa 0,80–0,85; un’altra persona dello stesso sesso 0,12–0,22; la voce
di oggi (Giulia o Marco) 0,16–0,21. <b>Parole sbagliate</b>: le parole che Whisper non capisce come scritte.
Il testo sotto ogni campione è ciò che ha capito Whisper.</p>
<p>Nessun numero dice tutto: ascoltate se la voce è metallica, se respira, se ha un accento straniero, se taglia la fine.</p>
<p>In sintesi (CPU a 2 thread su questo computer, condiviso con altri lavori; memoria del processo Python, il programma in
Rust con la voce di oggi sta a circa 100 MB; con il riferimento rovinato: somiglianza · parole sbagliate):</p>
{"".join(sintesi)}
</div>
{prima_dopo}
<h2>V-m · le tre strade a confronto (prima della scelta)</h2>
<nav>{" ".join(indice)}</nav>
{"".join(parti)}
</body></html>
"""
    tmp = OUT / "index.html.tmp"
    tmp.write_text(pagina)
    os.replace(tmp, OUT / "index.html")
    print(OUT / "index.html")


# V-1: before and after, on the first word (filled from esiti/v1/scelta.json)
def sezione_prima_dopo(fr) -> str:
    path = ESITI / "v1" / "scelta.json"
    if not path.exists():
        return ""
    sc = json.loads(path.read_text())
    colonne = sc["colonne"]          # [config, ref, title, subtitle]
    v = {}
    for cfg, _, _, _ in colonne:
        p = ESITI / "v1" / f"valuta_{cfg}.json"
        if p.exists():
            v[cfg] = {(r["rif"], r["tipo"], r["id"]): r for r in json.loads(p.read_text())["righe"] if r["seme"] == 0}
    brevi = json.loads((ESITI / "v1" / "brevi.json").read_text())

    def cella(cfg, rif, tipo, i):
        x = v.get(cfg, {}).get((rif, tipo, i))
        src = AUDIO / "v1" / cfg / rif / "s0" / f"{tipo}{i}.wav"
        if x is None or not src.exists():
            return "<td>—</td>"
        tag = audio_tag(copia(src.resolve(), f"v1/{cfg}/{rif}/{tipo}{i}.wav"))
        prima = "giusta" if x["prima_ok"] else "<b>persa o storpiata</b>"
        return (f'<td>{tag}<div class="n">prima parola {prima} · {num(x["durata_s"])} s</div>'
                f'<div class="t">«{html.escape(x["trascrizione"])}»</div></td>')

    def tabella(righe, tipo):
        h = ['<div class="tab"><table><thead><tr><th>Frase</th>']
        for _, _, t, sub in colonne:
            h.append(f"<th>{html.escape(t)}<span>{html.escape(sub)}</span></th>")
        h.append("</tr></thead><tbody>")
        for i, testo in righe:
            h.append(f'<tr><th class="frase">{html.escape(testo)}</th>'
                     + "".join(cella(cfg, rif, tipo, i) for cfg, rif, _, _ in colonne) + "</tr>")
        tot = ['<tr class="tot"><th>Prima parola persa (tutte le persone, due semi)</th>']
        for cfg, _, _, _ in colonne:
            p = ESITI / "v1" / f"valuta_{cfg}.json"
            rr = [r for r in json.loads(p.read_text())["righe"] if r["tipo"] == tipo] if p.exists() else []
            tot.append(f"<td><b>{sum(not r['prima_ok'] for r in rr)}</b> su {len(rr)}</td>" if rr else "<td>—</td>")
        h.append("".join(tot) + "</tr></tbody></table></div>")
        return "".join(h)

    h = [f'<section id="prima-dopo"><h2>Pocket TTS prima e dopo: la prima parola (V-1)</h2><div class="intro">{sc["spiegazione"]}</div>',
         "<h3>Frasi brevi</h3>", tabella([(b["id"], b["testo"]) for b in brevi], "b"),
         "<h3>Le frasi di prova</h3>", tabella([(f["id"], f["testo"]) for f in fr], "f"), "</section>"]
    return "".join(h)


if __name__ == "__main__":
    main()
