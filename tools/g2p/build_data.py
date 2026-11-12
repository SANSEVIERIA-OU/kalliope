# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Development only: build the phonemizer's data files from Wiktionary pronunciations and
measure how well the phonemizer predicts words it has never seen.

    python3 -I build_data.py WIKTIONARY_TSV BATCH_BINARY CRATE_DIR [--espeak ESPEAK_TSV]

WIKTIONARY_TSV comes from extract_wiktionary.py, BATCH_BINARY is the release build of
`crates/phonemes/examples/batch.rs`, CRATE_DIR is `crates/phonemes`. The script:

1. turns each Wiktionary pronunciation into the stressed letter, the quality of a stressed e/o
   and the voicing of each z (the "oracle");
2. measures on a held-out tenth of the words how often endings + rules alone get stress and
   vowel quality right, and how often espeak-ng does, as a baseline;
3. writes `data/suffixes.tsv` (endings that predict stress and quality) and `data/lexicon.tsv`
   (every word that endings + rules still get wrong).

The data files are derived from Wiktionary and licensed CC BY-SA 4.0.
"""
import collections
import hashlib
import pathlib
import subprocess
import sys

VOWEL_PHONES = set("aeiouɛɔɪʊ")
BASE = {"a": "a", "e": "e", "ɛ": "e", "i": "i", "ɪ": "i", "o": "o", "ɔ": "o", "u": "u", "ʊ": "u"}
ACCENTS = {"à": "a", "á": "a", "è": "e", "é": "e", "ì": "i", "í": "i", "ò": "o", "ó": "o", "ù": "u", "ú": "u"}
MIN_COUNT = 4
MIN_SHARE = 0.72


def letters(word):
    return [ACCENTS.get(c, c) for c in word.lower() if c.isalpha()]


def stress_info(phonemes):
    """(ordinal among vowel symbols, base vowel, vowel symbol) of the stressed vowel."""
    ordinal = 0
    for i, ch in enumerate(phonemes):
        if ch in VOWEL_PHONES:
            if i > 0 and phonemes[i - 1] == "ˈ":
                return ordinal, BASE[ch], ch
            ordinal += 1
    return None


def nucleus_info(phonemes):
    """Like stress_info, but i/u next to a non-high vowel count as glides, so that "parliˈamo"
    and "parljˈamo" compare equal: a fair comparison across notations."""
    p = phonemes.replace("ˈ", "")
    stress_at = None
    vowels = []
    j = 0
    for ch in phonemes:
        if ch == "ˈ":
            stress_at = j
            continue
        j += 1
    ordinal = 0
    for i, ch in enumerate(p):
        if ch not in VOWEL_PHONES:
            continue
        if i == stress_at:
            return ordinal, BASE[ch]
        near = (p[i - 1] if i else "") + (p[i + 1] if i + 1 < len(p) else "")
        glide = ch in "iɪuʊ" and any(c in "aeɛoɔ" for c in near)
        if not glide:
            ordinal += 1
    return None


def oracle_from_ipa(ipa):
    """Stressed vowel ordinal/identity and z voicing from a Wiktionary IPA string."""
    p = ipa.replace("ˌ", "").replace("ː", "")
    out, pending = [], False
    for ch in p:
        if ch == "ˈ":
            pending = True
            continue
        if ch == ".":
            continue
        if pending and ch in "aeiouɛɔ":
            out.append("ˈ")
            pending = False
        out.append(ch)
    p = "".join(out)
    for a, b in [("ttʃ", "ʧ"), ("tʃ", "ʧ"), ("ddʒ", "ʤ"), ("dʒ", "ʤ"), ("tts", "ʦ"), ("ts", "ʦ"), ("ddz", "ʣ"), ("dz", "ʣ")]:
        p = p.replace(a, b)
    z = "".join("d" if c == "ʣ" else "t" for c in p if c in "ʦʣ")
    return stress_info(p), z


def klein_like(ipa):
    """Wiktionary IPA with the stress mark moved before the stressed vowel and no syllable dots."""
    out, pending = [], False
    for ch in ipa.replace("ˌ", "").replace("ː", ""):
        if ch == "ˈ":
            pending = True
            continue
        if ch == ".":
            continue
        if pending and ch in "aeiouɛɔ":
            out.append("ˈ")
            pending = False
        out.append(ch)
    p = "".join(out)
    # A w after a consonant other than k/ɡ is written ʊ by the rules ("buono" → bʊˈɔno).
    return "".join("ʊ" if c == "w" and i > 0 and p[i - 1] not in "kɡˈ" else c for i, c in enumerate(p))


def bucket(word):
    return hashlib.sha1(word.encode()).digest()[0] % 10


class Batch:
    def __init__(self, binary):
        self.binary = binary

    def run(self, lines):
        res = subprocess.run([self.binary], input="\n".join(lines) + "\n", capture_output=True, text=True, check=True)
        out = res.stdout.split("\n")
        return out[: len(lines)]


def build_oracle(wiktionary, batch):
    words = {}
    for line in open(wiktionary, encoding="utf-8"):
        w, ipas = line.rstrip("\n").split("\t")
        words[w] = ipas.split(" ; ")[0]
    queries, owners = [], []
    for w in words:
        l = letters(w)
        for k, c in enumerate(l):
            if c in "aeiouy":
                queries.append(f"{w}\t{len(l) - 1 - k}\t-\t-")
                owners.append((w, len(l) - 1 - k))
    outputs = batch.run(queries)
    candidates = collections.defaultdict(list)
    nucleus_of = {}
    for (w, k), out in zip(owners, outputs):
        candidates[w].append((k, stress_info(out)))
        nucleus_of[(w, k)] = nucleus_info(out)
    target_nucleus = {w: nucleus_info(klein_like(ipa)) for w, ipa in words.items()}
    oracle, skipped = {}, 0
    for w, ipa in words.items():
        target, z = oracle_from_ipa(ipa)
        if target is None:
            skipped += 1
            continue
        t_ord, t_base, t_sym = target
        t_nuc = target_nucleus[w]
        cands = [(k, s) for k, s in candidates[w] if s and s[1] == t_base]
        exact = [k for k, s in cands if nucleus_of[(w, k)] == t_nuc]
        if exact:
            k = exact[0]
        elif cands:
            k = min(cands, key=lambda c: abs(c[1][0] - t_ord))[0]
        else:
            skipped += 1
            continue
        quality = t_sym if t_sym in "eɛoɔ" else "-"
        z_runs = sum(1 for i, c in enumerate(w) if c == "z" and (i == 0 or w[i - 1] != "z"))
        oracle[w] = (k, quality, z if len(z) == z_runs and z_runs > 0 else "-")
    print(f"oracle: {len(oracle)} words, {skipped} skipped", file=sys.stderr)
    return oracle


def syllables(oracle, batch):
    ws = list(oracle)
    out = batch.run([f"?{w}\t{oracle[w][0]}" for w in ws])
    return {w: int(n) for w, n in zip(ws, out) if n.strip().isdigit()}


def suffix_table(oracle, syl, words):
    counts = collections.defaultdict(collections.Counter)
    qual_e = collections.defaultdict(collections.Counter)
    qual_o = collections.defaultdict(collections.Counter)
    for w in words:
        if w not in syl:
            continue
        k, q, _ = oracle[w]
        for n in range(1, min(7, len(w)) + 1):
            s = w[-n:]
            counts[s][syl[w]] += 1
            if q in "eɛ":
                qual_e[s][q] += 1
            elif q in "oɔ":
                qual_o[s][q] += 1

    def majority(counter, default):
        total = sum(counter.values())
        if total >= MIN_COUNT:
            value, c = counter.most_common(1)[0]
            if c / total >= MIN_SHARE:
                return value
        return default

    children = collections.defaultdict(list)
    for s in counts:
        if len(s) > 1:
            children[s[1:]].append(s)
    table = {}
    stack = [(s, (1, "e", "o")) for s in counts if len(s) == 1]
    while stack:
        suffix, parent = stack.pop()
        p_syl, p_e, p_o = parent
        here = (majority(counts[suffix], p_syl), majority(qual_e[suffix], p_e), majority(qual_o[suffix], p_o))
        if here != parent:
            table[suffix] = here
        stack.extend((child, here) for child in children[suffix])
    return table


def write_suffixes(table, path):
    with open(path, "w", encoding="utf-8") as f:
        for s in sorted(table):
            n, e, o = table[s]
            f.write(f"{s}\t{n}\t{e}{o}\n")


def write_lexicon(entries, path):
    with open(path, "w", encoding="utf-8") as f:
        for w in sorted(entries):
            k, q, z = entries[w]
            f.write(f"{w}\t{k}\t{q}\t{z}\n")


def rebuild(crate):
    subprocess.run(["cargo", "build", "-q", "--release", "-p", "kalliope-phonemes", "--example", "batch"], cwd=crate, check=True)


def target_outputs(oracle, words, batch):
    return dict(zip(words, batch.run([f"{w}\t{oracle[w][0]}\t{oracle[w][1]}\t{oracle[w][2]}" for w in words])))


def main():
    wiktionary, binary, crate = sys.argv[1:4]
    espeak = sys.argv[sys.argv.index("--espeak") + 1] if "--espeak" in sys.argv else None
    crate = pathlib.Path(crate)
    batch = Batch(binary)
    lexicon_path, suffix_path = crate / "data" / "lexicon.tsv", crate / "data" / "suffixes.tsv"
    write_lexicon({}, lexicon_path)
    write_suffixes({}, suffix_path)
    rebuild(crate)

    oracle = build_oracle(wiktionary, batch)
    syl = syllables(oracle, batch)
    train = [w for w in oracle if bucket(w) != 0]
    test = [w for w in oracle if bucket(w) == 0]

    # Held-out evaluation: endings learned without the test words, no lexicon.
    write_suffixes(suffix_table(oracle, syl, train), suffix_path)
    rebuild(crate)
    target = target_outputs(oracle, test, batch)
    predicted = dict(zip(test, batch.run(test)))
    def same_stress(a, b):
        sa, sb = stress_info(a), stress_info(b)
        return sa is not None and sb is not None and sa[:2] == sb[:2]

    stress_ok = sum(same_stress(predicted[w], target[w]) for w in test)
    exact_ok = sum(predicted[w] == target[w] for w in test)
    print(f"held-out {len(test)} words, endings + rules: stress {100 * stress_ok / len(test):.1f}%, "
          f"stress + vowel quality + z {100 * exact_ok / len(test):.1f}%", file=sys.stderr)
    if espeak:
        ref = dict(line.rstrip("\n").split("\t") for line in open(espeak, encoding="utf-8"))
        ok = n = q_ok = ours = 0
        for w in test:
            if w in ref and stress_info(ref[w]) and stress_info(target[w]):
                n += 1
                e, t = nucleus_info(ref[w]), nucleus_info(target[w])
                ok += e == t
                q_ok += e == t and stress_info(ref[w])[2] == stress_info(target[w])[2]
                ours += nucleus_info(predicted[w]) == t
        print(f"same words, glide-tolerant comparison ({n}): espeak-ng stress {100 * ok / n:.1f}%, "
              f"stress + vowel quality {100 * q_ok / n:.1f}%; Kalliope stress {100 * ours / n:.1f}%", file=sys.stderr)

    # Shipping data: endings from all words, then every word they still get wrong.
    table = suffix_table(oracle, syl, list(oracle))
    write_suffixes(table, suffix_path)
    rebuild(crate)
    words = list(oracle)
    target = target_outputs(oracle, words, batch)
    predicted = dict(zip(words, batch.run(words)))
    wrong = {w: oracle[w] for w in words if predicted[w] != target[w]}
    write_lexicon(wrong, lexicon_path)
    rebuild(crate)
    predicted = dict(zip(words, batch.run(words)))
    still = [w for w in words if predicted[w] != target[w]]
    print("still differ:", " ".join(still[:40]), file=sys.stderr)
    still = len(still)
    print(f"suffix table {len(table)} endings, lexicon {len(wrong)} of {len(words)} words; "
          f"{still} words still differ after the lexicon", file=sys.stderr)


if __name__ == "__main__":
    main()
