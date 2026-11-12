# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Development only: espeak-ng phonemes for a list of words, in the convention the official Klein
package feeds the model (affricates as single symbols ʧ ʤ ʦ ʣ).

espeak-ng is GPL-3.0; it is run here as a separate program to compare pronunciations and is never
part of a Kalliope build. Usage (benchmark venv):
    python -I espeak_reference.py words.txt out.tsv
"""
import sys

import espeakng_loader
from phonemizer.backend import EspeakBackend
from phonemizer.backend.espeak.wrapper import EspeakWrapper

TIES = {"d^z": "ʣ", "d^ʒ": "ʤ", "t^s": "ʦ", "t^ʃ": "ʧ", "s^s": "S"}

EspeakWrapper.set_library(espeakng_loader.get_library_path())
EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
backend = EspeakBackend("it", with_stress=True, tie="^", language_switch="remove-flags")
words = [w.strip() for w in open(sys.argv[1], encoding="utf-8") if w.strip()]
lines = backend.phonemize(words, strip=True)
with open(sys.argv[2], "w", encoding="utf-8") as f:
    for w, p in zip(words, lines):
        for a, b in TIES.items():
            p = p.replace(a, b)
        f.write(w + "\t" + p.replace("^", "").replace("-", "") + "\n")
print(len(words), "words")
