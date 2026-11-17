# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-1: what remains wrong in the Italian pronunciation, apart from the lost first word.

For the test sentences of the given configurations: word alignment of text and transcript (both
through Kalliope's normalizer, accents kept), the first word set aside, each remaining error
classed as number words, the acronym "iva", a word with an accent, the name "paola", or other.
Writes ESITI/v1/pronuncia.json and prints a summary with examples.
Usage: python -I v1_pronuncia.py CONFIG [CONFIG ...]
"""
from __future__ import annotations

import difflib
import json
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from comune import ESITI, frasi, normalizza_kalliope  # noqa: E402
from misure import norm_parole  # noqa: E402

NUMERI = {"quattordici", "marzo", "quindici", "trenta", "mille", "duecento", "cinquanta", "trentuno", "dicembre", "euro"}
ACCENTI = set("àèéìòù")


def classe(parola: str) -> str:
    if parola in NUMERI:
        return "numeri e date"
    if parola == "iva":
        return "sigla «iva»"
    if parola == "paola":
        return "nome «Paola»"
    if any(c in ACCENTI for c in parola):
        return "parola accentata"
    return "altre parole"


def main():
    fr = {f["id"]: " ".join(f["frasi_normalizzate"]) for f in frasi()}
    out = {}
    for cfg in sys.argv[1:]:
        d = json.loads((ESITI / "v1" / f"valuta_{cfg}.json").read_text())
        righe = [r for r in d["righe"] if r["tipo"] == "f"]
        hyps = normalizza_kalliope([r["trascrizione"] for r in righe])
        cnt, esempi, tot_err, tot_par = Counter(), {}, 0, 0
        for r, h in zip(righe, hyps):
            ref = norm_parole(fr[r["id"]])
            hyp = norm_parole(h)
            sm = difflib.SequenceMatcher(a=ref, b=hyp, autojunk=False)
            for op, i1, i2, j1, j2 in sm.get_opcodes():
                if op == "equal" or i1 == 0:      # errors touching the first word are counted apart
                    continue
                parole = ref[i1:i2] or hyp[j1:j2]
                for w in parole:
                    k = classe(w)
                    cnt[k] += 1
                    esempi.setdefault(k, Counter())[f"{' '.join(ref[i1:i2]) or '∅'} → {' '.join(hyp[j1:j2]) or '∅'}"] += 1
                tot_err += max(i2 - i1, j2 - j1)
            tot_par += len(ref) - 1
        out[cfg] = {"errori_senza_prima_parola": tot_err, "parole": tot_par, "per_classe": dict(cnt),
                    "esempi": {k: v.most_common(6) for k, v in esempi.items()}}
        print(f"{cfg}: {tot_err}/{tot_par} parole sbagliate senza la prima ({100 * tot_err / tot_par:.1f}%)", dict(cnt))
        for k, v in esempi.items():
            print("   ", k, v.most_common(5))
    (ESITI / "v1" / "pronuncia.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
