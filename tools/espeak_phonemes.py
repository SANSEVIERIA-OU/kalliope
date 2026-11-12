# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""DEVELOPMENT ONLY: reference Italian phonemes from espeak-ng.

espeak-ng is GPL-3.0. This script calls it (through the `phonemizer` Python package) only as a
pronunciation oracle while Kalliope's own phonemizer is being written, to validate the voice and
to compare our output against. It is never part of a Kalliope build, package or runtime, and no
Kalliope code links to or calls espeak-ng.

Run it with the benchmark virtual environment, isolated:

    .venv/bin/python -I tools/espeak_phonemes.py "Posso fare una domanda?"
    .venv/bin/python -I tools/espeak_phonemes.py --file sentences.json        # a JSON list of texts

Prints one line of phonemes per input text; sentences inside a text are joined with a space, so
the voice still synthesizes them as separate chunks.

Styles:
  klein  (default) what the official @kleinml/kleintts package feeds the model: espeak IPA with
         affricates as single symbols (ʧ ʤ ʦ ʣ), clause by clause.
  bench  what the Python benchmark used: kokoro_onnx's Tokenizer (affricates as two symbols).
"""
import argparse
import json
import re
import sys

SENTENCE_END = re.compile(r"(?<=[.!?…])\s+")
CLAUSE = re.compile(r"([^;:,.!?—…]+)([;:,.!?—…]*)")
# misaki's espeak → model symbol table for non-English languages, applied in sorted key order.
OTHER_E2M = sorted({
    "a^ɪ": "I", "a^ʊ": "W",
    "d^z": "ʣ", "d^ʒ": "ʤ",
    "e^ɪ": "A",
    "o^ʊ": "O", "ə^ʊ": "Q",
    "s^s": "S",
    "t^s": "ʦ", "t^ʃ": "ʧ",
    "ɔ^ɪ": "Y",
}.items())


def klein_style():
    import espeakng_loader
    from phonemizer.backend import EspeakBackend
    from phonemizer.backend.espeak.wrapper import EspeakWrapper

    EspeakWrapper.set_library(espeakng_loader.get_library_path())
    EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
    backend = EspeakBackend("it", with_stress=True, tie="^", language_switch="remove-flags")

    def phonemize(sentence: str) -> str:
        text = sentence.replace("«", "“").replace("»", "”").replace("(", ",").replace(")", ",")
        clauses = [(m.group(1).strip(), m.group(2)) for m in CLAUSE.finditer(text) if m.group(1).strip()]
        if not clauses:
            return ""
        lines = backend.phonemize([words for words, _ in clauses], strip=True)
        out = []
        for line, (_, punct) in zip(lines, clauses):
            for a, b in OTHER_E2M:
                line = line.replace(a, b)
            out.append(line.replace("^", "").replace("-", "") + punct)
        return " ".join(out).strip()

    return phonemize


def bench_style():
    from kokoro_onnx.tokenizer import Tokenizer

    tok = Tokenizer()
    return lambda sentence: tok.phonemize(sentence, "it")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("text", nargs="*")
    ap.add_argument("--file", help="JSON list of texts")
    ap.add_argument("--style", choices=["klein", "bench"], default="klein")
    a = ap.parse_args()
    texts = json.load(open(a.file, encoding="utf-8")) if a.file else [" ".join(a.text)]
    phonemize = klein_style() if a.style == "klein" else bench_style()
    for text in texts:
        sentences = [s for s in SENTENCE_END.split(text.strip()) if s]
        print(" ".join(phonemize(s) for s in sentences))
    sys.stdout.flush()


if __name__ == "__main__":
    main()
