# Pronunciation data

| File | Contents |
| --- | --- |
| `lexicon.tsv` | Words whose stress, stressed e/o quality or z voicing the rules and endings get wrong. Fields: word, stressed letter counted from the end, quality, z voicing (`d` = ʣ, `t` = ʦ). |
| `suffixes.tsv` | Word endings that predict stress and vowel quality. Fields: ending, stressed syllable counted from the end, e/o qualities. |

Both files are derived from Wiktionary pronunciations, as extracted by kaikki.org (wiktextract), and
are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Attribution:
Wiktionary contributors, https://en.wiktionary.org. These two files are separately licensed
material. The Kalliope code that reads them stays under SANSEVIERIA License 1.0.

## Rebuild

```sh
python3 -I tools/g2p/extract_wiktionary.py kaikki.org-dictionary-Italian.jsonl.gz wiktionary.tsv
cargo build --release -p kalliope-phonemes --example batch
python3 -I tools/g2p/build_data.py wiktionary.tsv target/release/examples/batch crates/phonemes \
    [--espeak espeak.tsv]
```

`build_data.py` also measures accuracy on a held-out tenth of the words, using endings and rules
only. Results on 12 November 2026, with 8,199 held-out words:

| | Stress correct | Stress and e/o quality correct |
| --- | --- | --- |
| Kalliope (endings + rules) | 93.3% | 89.0% (z voicing included) |
| espeak-ng 1.52 | 93.8% | 87.8% |

Words in the lexicon (7,920 entries) and every other Wiktionary word are reproduced exactly.
