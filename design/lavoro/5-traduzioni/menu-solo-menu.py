# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
"""Did Codex touch only the three menu entries? Compares every website/lingue/<xx>.po of a worktree with the same file at a git
revision: every entry the same (text, comments, flags) except the msgstr of programma.menu.*.

    python3 -I solo-menu.py WORKTREE REV
"""
import pathlib
import subprocess
import sys

W = pathlib.Path(sys.argv[1]).resolve()
REV = sys.argv[2]
sys.path.insert(0, str(W / "tools"))
from i18n import po  # noqa: E402

MENU = {"programma.menu.genere", "programma.menu.descrizione", "programma.menu.parole"}
male = 0
for f in sorted((W / "website" / "lingue").glob("*.po")):
    prima = po.leggi(subprocess.run(["git", "-C", str(W), "show", f"{REV}:website/lingue/{f.name}"], capture_output=True, text=True,
                                    check=True).stdout)
    dopo = po.leggi(f.read_text(encoding="utf-8"))
    a, b = prima.per_chiave(), dopo.per_chiave()
    problemi = []
    if prima.intestazione != dopo.intestazione:
        problemi.append("header changed")
    if set(a) != set(b):
        problemi.append(f"keys differ: {sorted(set(a) ^ set(b))[:5]}")
    for k in a.keys() & b.keys():
        x, y = a[k], b[k]
        stessi = (x.id, x.id_plurale, x.estratti, x.riferimenti, x.flags, x.traduttore) == (y.id, y.id_plurale, y.estratti, y.riferimenti, y.flags, y.traduttore)
        if not stessi:
            problemi.append(f"{k}: something besides msgstr changed")
        elif k not in MENU and x.str != y.str:
            problemi.append(f"{k}: msgstr changed")
    nuovi = [k for k in MENU if k in b and b[k].str != a.get(k, po.Voce()).str]
    stato = "ok" if not problemi else "PROBLEMS"
    if f.stem != "it":
        print(f"{f.stem}: {stato}; menu entries filled: {len(nuovi)}/3")
    for p in problemi:
        print("   ", p)
    male += bool(problemi)
sys.exit(1 if male else 0)
