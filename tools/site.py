# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Build the website: copy site/ and fill in the release that visitors should download.

    python3 -I tools/site.py --out DIR [--release-json FILE]

The pages under site/ never write a version or a package name by hand. They use these markers,
replaced in every .html, .xml, .txt and .webmanifest file:

    {{kalliope.version}}        0.1-rc.1
    {{kalliope.tag}}            v0.1-rc.1
    {{kalliope.date}}           12 novembre 2026          (publication date, Italian, no-break spaces)
    {{kalliope.date.iso}}       2026-11-12
    {{kalliope.prerelease}}     "true" or "false"         (for data-* attributes)
    {{kalliope.release.url}}    the release page on GitHub
    {{kalliope.deb.url}}        {{kalliope.deb.size}}     {{kalliope.deb.name}}
    {{kalliope.rpm.url}}        {{kalliope.rpm.size}}     {{kalliope.rpm.name}}
    {{kalliope.tar.url}}        {{kalliope.tar.size}}     {{kalliope.tar.name}}
    {{kalliope.tar.dir}}        the folder the archive unpacks into
    {{kalliope.aur.url}}        the AUR recipe (kalliope-bin.PKGBUILD)
    {{kalliope.sums.url}}       SHA256SUMS
    {{kalliope.sha256.deb}}     {{kalliope.sha256.rpm}}   {{kalliope.sha256.tar}}

Sizes are written the Italian way, "14,1 MB". The release offered is the newest one that is not a
prerelease; while there is none, the newest prerelease. Release data comes from the public GitHub
API (GH_TOKEN or GITHUB_TOKEN is used when set, to avoid the anonymous rate limit), or from
--release-json, a saved answer of `GET /repos/SANSEVIERIA-OU/kalliope/releases`, to work offline.

The build fails when a marker is unknown or a package is missing from the release, so a typo
never reaches visitors. No dependencies beyond the Python standard library.
"""
import json
import os
import pathlib
import re
import shutil
import sys
import urllib.request

REPO = "SANSEVIERIA-OU/kalliope"
ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
TEXT_SUFFIXES = {".html", ".xml", ".txt", ".webmanifest"}
MARKER = re.compile(r"\{\{kalliope\.([a-z0-9.]+)\}\}")
MONTHS = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto",
          "settembre", "ottobre", "novembre", "dicembre"]
PACKAGES = {"deb": "-amd64.deb", "rpm": "-x86_64.rpm", "tar": "-linux-x86_64.tar.gz"}


def fetch_releases():
    req = urllib.request.Request(f"https://api.github.com/repos/{REPO}/releases?per_page=30",
                                 headers={"Accept": "application/vnd.github+json",
                                          "User-Agent": "kalliope-site-build"})
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def choose(releases):
    published = [r for r in releases if not r.get("draft")]
    stable = [r for r in published if not r.get("prerelease")]
    pool = stable or published
    if not pool:
        sys.exit("site.py: the repository has no published release")
    return max(pool, key=lambda r: r["published_at"])


def italian_size(n):
    return f"{n / 1_000_000:.1f}".replace(".", ",") + " MB"


def values(release):
    tag = release["tag_name"]
    day = release["published_at"][:10]
    y, m, d = (int(x) for x in day.split("-"))
    v = {
        "version": tag.removeprefix("v"),
        "tag": tag,
        # No-break spaces: a date never wraps between day, month and year.
        "date": f"{d}\u00a0{MONTHS[m - 1]}\u00a0{y}",
        "date.iso": day,
        "prerelease": "true" if release.get("prerelease") else "false",
        "release.url": release["html_url"],
    }
    assets = {a["name"]: a for a in release.get("assets", [])}
    for key, suffix in PACKAGES.items():
        found = [a for name, a in assets.items() if name.endswith(suffix)]
        if len(found) != 1:
            sys.exit(f"site.py: release {tag} has {len(found)} files ending in {suffix}, expected 1")
        a = found[0]
        v[f"{key}.url"] = a["browser_download_url"]
        v[f"{key}.size"] = italian_size(a["size"])
        v[f"{key}.name"] = a["name"]
        if key == "tar":
            # The archive unpacks into a folder with its own name.
            v["tar.dir"] = a["name"].removesuffix(".tar.gz")
        digest = a.get("digest") or ""
        v[f"sha256.{key}"] = digest.removeprefix("sha256:")
    for key, name in (("aur", "kalliope-bin.PKGBUILD"), ("sums", "SHA256SUMS")):
        if name not in assets:
            sys.exit(f"site.py: release {tag} has no {name}")
        v[f"{key}.url"] = assets[name]["browser_download_url"]
    return v


def build(out, v):
    if out.exists():
        shutil.rmtree(out)
    shutil.copytree(SITE, out)
    unknown = set()
    for path in out.rglob("*"):
        if path.suffix not in TEXT_SUFFIXES or not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")

        def fill(m):
            key = m.group(1)
            if key not in v or not v[key]:
                unknown.add(f"{path.relative_to(out)}: {m.group(0)}")
                return m.group(0)
            return v[key]

        new = MARKER.sub(fill, text)
        if new != text:
            path.write_text(new, encoding="utf-8")
    if unknown:
        sys.exit("site.py: markers without a value:\n  " + "\n  ".join(sorted(unknown)))


def main():
    args = sys.argv[1:]
    if "--out" not in args:
        sys.exit(__doc__)
    out = pathlib.Path(args[args.index("--out") + 1]).resolve()
    if out == SITE or SITE in out.parents:
        sys.exit("site.py: --out must be outside site/")
    if "--release-json" in args:
        releases = json.loads(pathlib.Path(args[args.index("--release-json") + 1]).read_text())
    else:
        releases = fetch_releases()
    v = values(choose(releases))
    build(out, v)
    print(f"site built in {out} for {v['tag']} ({'prerelease' if v['prerelease'] == 'true' else 'release'})")


if __name__ == "__main__":
    main()
