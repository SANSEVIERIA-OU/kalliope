"""chi_trattiene.py Cargo.lock crate.tsv OUT.md → for each crate behind its latest release, the crates
in the lock file that depend on it and the version range they ask for (from the crates.io index).
"""
import collections
import json
import pathlib
import sys
import tomllib

lock = tomllib.loads(pathlib.Path(sys.argv[1]).read_text())
rows = [l.split("\t") for l in pathlib.Path(sys.argv[2]).read_text().splitlines() if l and not l.startswith("#")]
behind = {(r[0], r[1]): r for r in rows if r[1] != r[2]}
cache = pathlib.Path("/tmp/p1-run/index")

pkgs = lock["package"]
by_name = collections.defaultdict(list)
for p in pkgs:
    by_name[p["name"]].append(p["version"])


def resolve(dep):
    parts = dep.split(" ")
    name = parts[0]
    ver = parts[1] if len(parts) > 1 else by_name[name][0]
    return name, ver


def req_of(parent, pver, child):
    f = cache / parent
    if not f.exists():
        return "?"
    for line in f.read_text().splitlines():
        e = json.loads(line)
        if e["vers"] != pver:
            continue
        found = []
        for d in e["deps"]:
            real = d.get("package") or d["name"]
            if real == child:
                t = f" [{d['target']}]" if d.get("target") else ""
                k = "" if d.get("kind", "normal") == "normal" else f" ({d['kind']})"
                found.append(f"{d['req']}{k}{t}")
        return ", ".join(sorted(set(found))) or "?"
    return "?"


holders = collections.defaultdict(list)
for p in pkgs:
    for dep in p.get("dependencies", []):
        name, ver = resolve(dep)
        if (name, ver) in behind:
            src = "workspace" if "source" not in p else "registry"
            req = req_of(p["name"], p["version"], name) if src == "registry" else "(Kalliope)"
            holders[(name, ver)].append(f"{p['name']} {p['version']}: {req}")

with open(sys.argv[3], "w") as out:
    out.write("| Crate | Nel lock | Ultima | Chi lo chiede (versione richiesta) |\n|---|---|---|---|\n")
    for key in sorted(behind):
        r = behind[key]
        who = "; ".join(sorted(holders[key])) or "nessuno (?)"
        out.write(f"| {r[0]} | {r[1]} | {r[2]} | {who} |\n")
print(len(behind), "rows")
