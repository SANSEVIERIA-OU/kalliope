# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Writes the licence notices of every Rust crate compiled into Kalliope's programs.

MIT, Apache-2.0 and similar licences require their text and copyright lines to travel with the
binaries. This lists each crate with its licence and includes every distinct licence file once,
with the crates that ship it. Development only (Python standard library); run from the repo:

    python3 tools/third_party_licenses.py [--target x86_64-unknown-linux-gnu] > THIRD_PARTY_LICENSES.txt
"""
import collections
import json
import pathlib
import subprocess
import sys

ROOTS = {"kalliope-app", "kalliope-cli"}
FILES = ("LICENSE", "LICENCE", "COPYING", "NOTICE", "COPYRIGHT")

target = sys.argv[sys.argv.index("--target") + 1] if "--target" in sys.argv else "x86_64-unknown-linux-gnu"
meta = json.loads(subprocess.run(
    ["cargo", "metadata", "--format-version", "1", "--locked", "--filter-platform", target],
    check=True, capture_output=True, text=True).stdout)
packages = {p["id"]: p for p in meta["packages"]}
nodes = {n["id"]: n for n in meta["resolve"]["nodes"]}
members = set(meta["workspace_members"])

# Normal (not build or dev) dependencies reachable from the shipped programs.
todo = [i for i in members if packages[i]["name"] in ROOTS]
seen = set()
while todo:
    i = todo.pop()
    if i in seen:
        continue
    seen.add(i)
    for d in nodes[i]["deps"]:
        if any(k["kind"] is None for k in d["dep_kinds"]):
            todo.append(d["pkg"])
crates = sorted((packages[i] for i in seen - members), key=lambda p: (p["name"], p["version"]))

texts = collections.OrderedDict()
missing = []
for p in crates:
    folder = pathlib.Path(p["manifest_path"]).parent
    found = sorted(f for f in folder.iterdir() if f.is_file() and f.name.upper().startswith(FILES))
    if p.get("license_file"):
        extra = folder / p["license_file"]
        if extra.is_file() and extra not in found:
            found.append(extra)
    if not found:
        missing.append(p)
    for f in found:
        text = f.read_text(encoding="utf-8", errors="replace").strip()
        texts.setdefault(text, []).append(f"{p['name']} {p['version']}")

out = sys.stdout
out.write("Kalliope — licences of third-party Rust crates compiled into kalliope and kalliope-cli\n")
out.write(f"Generated from Cargo.lock for {target}. {len(crates)} crates.\n\n")
out.write("CRATES\n\n")
for p in crates:
    out.write(f"{p['name']} {p['version']}: {p.get('license') or 'see licence file'}"
              f"{' — ' + p['repository'] if p.get('repository') else ''}\n")
if missing:
    out.write("\nThese crates publish no licence file; their licence is the standard text of the SPDX "
              "identifier above:\n")
    out.write("".join(f"  {p['name']} {p['version']} ({p.get('license')})\n" for p in missing))
# Crates without a licence file still need the licence text: add the standard Apache-2.0 text.
apache = next((t for t, users in texts.items() if t.lstrip().startswith("Apache License") and "Version 2.0" in t[:200]), None)
if apache and any("Apache-2.0" in (p.get("license") or "") for p in missing):
    texts.setdefault(apache, [])
out.write("\nLICENCE TEXTS\n")
for text, users in texts.items():
    out.write("\n" + "=" * 78 + "\n")
    out.write("Used by: " + ", ".join(users) + "\n")
    out.write("-" * 78 + "\n" + text + "\n")
