# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""V-4, part B: Kalliope's Pocket TTS front end (Rust) against the official one, token by token.

The corpus: Italian sentences with numbers, acronyms, accents and punctuation from Kalliope's own
texts (the normalizer's tests, the Italian website strings, design/progetto.md, the test sentences
and short phrases of V-m and V-1), each as written and as Kalliope's normalizer says it, plus edge
cases (quotes and brackets, ellipses, characters outside the vocabulary, emoji, special tokens,
repeated spaces).

For every line: the token ids (`tokenizers` 0.23.3 on tokenizer.json against crates/voice
pocket::Tokenizer), the decoded text, and the chunks with their prompts and frames after the end
(the official split_into_best_sentences and prepare_text_prompt against pocket::FrontEnd).

Writes ESITI/v4/tokenizer.json. Usage: python -I v4_tokenizer.py MODEL_DIR RUST_EXAMPLE
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from comune import CLI, ESITI, FRASI  # noqa: E402
from v4_comune import REPO  # noqa: E402

KALLIOPE = Path(__file__).resolve().parents[3]

EXTRA = [
    "Ciao!!", "Davvero?!", "Aspetta… cosa?", "Lui disse: «Vengo subito».", "“Pronto?” chiese lei.",
    "(Va bene.) Poi ripartiamo.", "[nota] testo", "Costa 3,50 €, IVA inclusa, cioè 4,27 €.", "Il 3. punto",
    "Pi greco vale 3.14 circa.", "Scrivi a mario.rossi@example.it o vai su www.kalliope.it.", "Dr. Rossi è qui.",
    "e.g. questo", "Un'idea; un'altra: la terza – forse.", "Sì   no", "tab\tseparato", "<s> speciale </s>",
    "testo <0x41> strano", "Emoji 😀 qui", "中文 e العربية", "Ñandú ß Ærø", "perché? Perché sì!", "a.b.c",
    "\"\"", "...", "?", "x", "Città, università, più, già, così, perché.", "L'ha detto l’altro ieri.",
    "Numeri: 1, 22, 333, 4.444, 55.555, 1.000.000.", "C.V.D.", "U.S.A. e U.E.", "Ore 15:30; poi 18.45.",
    "«Uno.» «Due!» «Tre?»", "Fine.”", "Ok.) Poi", "Ho 3.5 anni e 2,75 metri,", "  spazi davanti e dietro  ",
]


def corpus() -> list[str]:
    righe: list[str] = []
    norm = (KALLIOPE / "crates" / "text" / "tests" / "normalize.rs").read_text()
    righe += [s.encode().decode("unicode_escape").encode("latin-1").decode("utf-8")
              for s in re.findall(r'"((?:[^"\\]|\\.)*)"', norm) if len(s) > 1]
    po = (KALLIOPE / "website" / "lingue" / "it.po").read_text()
    righe += [m.replace('\\"', '"') for m in re.findall(r'^msgstr "(.+)"$', po, re.M)]
    prog = (KALLIOPE / "design" / "progetto.md").read_text()
    for par in prog.split("\n"):
        par = re.sub(r"[*_`#>|]", "", par).strip()
        if len(par) > 3:
            righe += [s for s in re.split(r"(?<=[.!?])\s+", par) if s]
    righe += FRASI
    from v1_genera import BREVI
    righe += BREVI + EXTRA
    righe = [r.replace("\n", " ") for r in righe if r.strip() or r == "  spazi davanti e dietro  "]
    # Kalliope's normalizer, as the program feeds the model
    out = subprocess.run([str(CLI), "phonemes", "--"], input=None, capture_output=True, text=True)
    normalizzate = []
    for r in righe:
        p = subprocess.run([str(CLI), "phonemes", r], capture_output=True, text=True)
        frasi = [ln.split("\t")[0] for ln in p.stdout.splitlines() if ln]
        if frasi:
            normalizzate.append(" ".join(f[:1].upper() + f[1:] for f in frasi))
    del out
    visti, finale = set(), []
    for r in righe + normalizzate:
        if r not in visti:
            visti.add(r)
            finale.append(r)
    return finale


def main():
    cartella, esempio = Path(sys.argv[1]), Path(sys.argv[2])
    sys.path.insert(0, str(REPO))
    import tokenizers
    import torch
    from pocket_tts.models.text_chunking import prepare_text_prompt, split_into_best_sentences
    meta = json.loads((cartella / "pocket.json").read_text())
    tk = tokenizers.Tokenizer.from_file(str(cartella / "tokenizer.json"))

    class T:
        def __call__(s, x):
            return torch.tensor(tk.encode(x).ids)[None, :]

        def decode(s, ids):
            return tk.decode(ids)

    righe = corpus()
    p = subprocess.run([str(esempio), str(cartella)], input="\n".join(righe) + "\n", capture_output=True, text=True, check=True)
    rust = [json.loads(x) for x in p.stdout.splitlines()]
    assert len(rust) == len(righe), (len(rust), len(righe))
    rc = meta["replace_characters"]
    diversi = {"ids": [], "decode": [], "chunks": []}
    n_tok = 0
    for r, x in zip(righe, rust):
        ids = tk.encode(r).ids
        n_tok += len(ids)
        if ids != x["ids"]:
            diversi["ids"].append({"testo": r, "ufficiale": ids, "rust": x["ids"]})
        if tk.decode(ids) != x["decode"]:
            diversi["decode"].append({"testo": r, "ufficiale": tk.decode(ids), "rust": x["decode"]})
        try:
            chunks = split_into_best_sentences(T(), r, meta["max_tokens_per_chunk"], False, meta["remove_semicolons"],
                                               meta["append_terminal_punctuation"], meta["capitalize_first_letter"], rc)
        except ValueError:
            chunks = []
        uff = []
        for c in chunks:
            try:
                prep, guess = prepare_text_prompt(c, False, meta["remove_semicolons"], meta["append_terminal_punctuation"],
                                                  meta["capitalize_first_letter"], rc)
                uff.append([prep, guess + 2])
            except ValueError:
                pass
        if uff != x["chunks"]:
            diversi["chunks"].append({"testo": r, "ufficiale": uff, "rust": x["chunks"]})
    res = {"righe": len(righe), "token": n_tok, "diversi": {k: len(v) for k, v in diversi.items()},
           "esempi": {k: v[:20] for k, v in diversi.items()}}
    (ESITI / "v4").mkdir(parents=True, exist_ok=True)
    (ESITI / "v4" / "tokenizer.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))
    print("righe", len(righe), "token", n_tok, "diversi", res["diversi"], flush=True)
    for k, v in diversi.items():
        for e in v[:5]:
            print(k, json.dumps(e, ensure_ascii=False)[:400], flush=True)


if __name__ == "__main__":
    main()
