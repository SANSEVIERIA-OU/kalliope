# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Development only: extract Italian word → IPA pairs from a kaikki.org Wiktionary dump.

Usage: python3 -I extract_wiktionary.py kaikki.org-dictionary-Italian.jsonl.gz out.tsv

The output is derived from Wiktionary (CC BY-SA 4.0); keep its attribution when it is used.
"""
import gzip
import json
import re
import sys

src, dst = sys.argv[1], sys.argv[2]
seen = {}
with gzip.open(src, "rt", encoding="utf-8") as f:
    for line in f:
        e = json.loads(line)
        word = e.get("word", "")
        if not re.fullmatch(r"[a-zàèéìíòóùú']+", word):
            continue  # lower-case Italian words only (no names, phrases, abbreviations)
        for s in e.get("sounds", []):
            ipa = s.get("ipa", "")
            m = re.fullmatch(r"/([^/]+)/", ipa.strip())
            if not m or "ˈ" not in m.group(1) and len(word) > 3:
                continue
            p = m.group(1).replace("͡", "").replace("‿", "")
            seen.setdefault(word, [])
            if p not in seen[word]:
                seen[word].append(p)
with open(dst, "w", encoding="utf-8") as out:
    for word in sorted(seen):
        out.write(word + "\t" + " ; ".join(seen[word]) + "\n")
print(len(seen), "words")
