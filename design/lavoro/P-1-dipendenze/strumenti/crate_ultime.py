"""crate_ultime.py Cargo.lock OUT.tsv → every registry crate in the lock file against crates.io today.

Columns: name, version in the lock, latest release (no prerelease, not yanked), newest release that
`^version` accepts, and the latest release's rust-version. Reads the sparse index (index.crates.io).
"""
import json
import pathlib
import re
import sys
import tomllib
import urllib.request

lock = tomllib.loads(pathlib.Path(sys.argv[1]).read_text())
cache = pathlib.Path("/tmp/p1-run/index")
cache.mkdir(parents=True, exist_ok=True)


def index_path(name):
    n = name.lower()
    if len(n) <= 2:
        return f"{len(n)}/{n}"
    if len(n) == 3:
        return f"3/{n[0]}/{n}"
    return f"{n[:2]}/{n[2:4]}/{n}"


def entries(name):
    f = cache / name
    if not f.exists():
        req = urllib.request.Request("https://index.crates.io/" + index_path(name),
                                     headers={"User-Agent": "kalliope-p1-check"})
        f.write_bytes(urllib.request.urlopen(req, timeout=30).read())
    return [json.loads(line) for line in f.read_text().splitlines() if line.strip()]


def parse(v):
    m = re.match(r"^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+.*)?$", v)
    return (int(m[1]), int(m[2]), int(m[3])), m[4]


def compatible(base, cand):
    """Cargo's caret rule: same leftmost non-zero component."""
    if base[0] != 0:
        return cand[0] == base[0] and cand >= base
    if base[1] != 0:
        return cand[0] == 0 and cand[1] == base[1] and cand >= base
    return cand == base


rows = []
for p in lock["package"]:
    if not str(p.get("source", "")).startswith("registry+"):
        continue
    name, ver = p["name"], p["version"]
    base, _ = parse(ver)
    releases = []
    for e in entries(name):
        if e.get("yanked"):
            continue
        num, pre = parse(e["vers"])
        if pre:
            continue
        releases.append((num, e["vers"], e.get("rust_version") or ""))
    releases.sort()
    latest = releases[-1]
    compat = max((r for r in releases if compatible(base, r[0])), default=(base, ver, ""))
    rows.append((name, ver, latest[1], compat[1], latest[2]))

rows.sort()
behind = [r for r in rows if r[1] != r[2]]
with open(sys.argv[2], "w") as out:
    out.write(f"# {len(rows)} crate dal registro, {len(behind)} non all'ultima\n")
    out.write("# nome\tnel_lock\tultima\tultima_compatibile\trust_version_ultima\n")
    for r in rows:
        out.write("\t".join(r) + "\n")
print(f"{len(rows)} crates, {len(behind)} behind, {sum(1 for r in behind if r[1] != r[3])} movable within semver")
