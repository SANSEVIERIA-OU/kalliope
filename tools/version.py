#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Kalliope's version, kept the same everywhere it is written. Development only; stdlib only.

People see "0.1"; Cargo needs "0.1.0". The version in Cargo.toml is the next one to be
released (or the one just released, until `set` moves on).

  version.py                   print the version, e.g. 0.1
  version.py check             fail if Cargo.lock, AppStream, PKGBUILD or CHANGELOG disagree
  version.py next              print the version after this one (0.9 is followed by 1.0)
  version.py set X.Y           write X.Y everywhere; add AppStream and CHANGELOG entries for it
  version.py release [DATE]    mark this version released on DATE (default today, YYYY-MM-DD)
  version.py tag TAG           check a release tag; print version=, package_version=, prerelease=
  version.py notes TAG         print the CHANGELOG section for a release tag
"""

import datetime
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CARGO = ROOT / "Cargo.toml"
LOCK = ROOT / "Cargo.lock"
METAINFO = ROOT / "packaging/linux/io.github.sansevieria_ou.kalliope.metainfo.xml"
PKGBUILD = ROOT / "packaging/aur/PKGBUILD"
CHANGELOG = ROOT / "CHANGELOG.md"

VERSION = re.compile(r"(\d+)\.(\d+)")
# vX.Y, or vX.Y-PRE for a prerelease (v0.1-rc.1). v0.0-test.N only tries the release workflow.
TAG = re.compile(r"v(\d+\.\d+)(?:-([0-9A-Za-z]+(?:\.[0-9A-Za-z]+)*))?")
NOT_RELEASED = "not yet released"
MONTHS = "January February March April May June July August September October November December"


def fail(message):
    sys.exit(f"version.py: {message}")


def read(path):
    return path.read_text(encoding="utf-8")


def write(path, text):
    path.write_text(text, encoding="utf-8")


def parse(version):
    if not VERSION.fullmatch(version):
        fail(f"{version!r} is not a version like 0.1")
    return tuple(int(n) for n in version.split("."))


def workspace_version_line(text):
    """The `version = "X.Y.Z"` line inside [workspace.package] of Cargo.toml."""
    section = re.search(r"^\[workspace\.package\]\n(.*?)(?=^\[|\Z)", text, re.M | re.S)
    if not section:
        fail("Cargo.toml has no [workspace.package]")
    line = re.search(r'^version = "(\d+)\.(\d+)\.(\d+)"$', section.group(1), re.M)
    if not line:
        fail('Cargo.toml [workspace.package] has no version = "X.Y.Z"')
    return section.start(1) + line.start(), section.start(1) + line.end(), line


def current():
    _, _, line = workspace_version_line(read(CARGO))
    major, minor, patch = line.groups()
    if patch != "0":
        fail(f"Cargo.toml version {major}.{minor}.{patch}: Kalliope versions end in .0")
    return f"{major}.{minor}"


def next_version(version):
    major, minor = parse(version)
    return f"{major + 1}.0" if minor == 9 else f"{major}.{minor + 1}"


def lock_versions(text):
    """Versions of the workspace's own crates in Cargo.lock (the packages without a source)."""
    found = {}
    for block in text.split("[[package]]")[1:]:
        name = re.search(r'^name = "([^"]+)"', block, re.M)
        version = re.search(r'^version = "([^"]+)"', block, re.M)
        if name and version and not re.search(r"^source = ", block, re.M):
            found[name.group(1)] = version.group(1)
    return found


def metainfo_releases(text):
    """(version, type, date) of each AppStream <release>, newest first."""
    releases = []
    for tag in re.findall(r"<release\s[^>]*>", text):
        attrs = dict(re.findall(r'(\w+)="([^"]*)"', tag))
        releases.append((attrs.get("version"), attrs.get("type", "stable"), attrs.get("date")))
    return releases


def pkgbuild_value(text, key):
    match = re.search(rf"^{key}=(\S+)$", text, re.M)
    return match.group(1) if match else None


def changelog_sections(text):
    """(version, heading text, body) of each `## X.Y — …` section, newest first."""
    heads = list(re.finditer(r"^## (\d+\.\d+)\b(.*)$", text, re.M))
    sections = []
    for i, head in enumerate(heads):
        end = heads[i + 1].start() if i + 1 < len(heads) else len(text)
        sections.append((head.group(1), head.group(2), text[head.end() : end].strip()))
    return sections


def problems():
    """What disagrees with the version in Cargo.toml."""
    version = current()
    cargo = f"{version}.0"
    issues = []
    for name, found in sorted(lock_versions(read(LOCK)).items()):
        if found != cargo:
            issues.append(f"Cargo.lock: {name} is {found}, not {cargo} (run cargo build)")
    releases = metainfo_releases(read(METAINFO))
    if not releases or releases[0][0] != version:
        newest = releases[0][0] if releases else "none"
        issues.append(f"{METAINFO.relative_to(ROOT)}: newest release is {newest}, not {version}")
    if pkgbuild_value(read(PKGBUILD), "pkgver") != version:
        issues.append(f"{PKGBUILD.relative_to(ROOT)}: pkgver is not {version}")
    sections = changelog_sections(read(CHANGELOG))
    if not sections or sections[0][0] != version:
        issues.append(f"CHANGELOG.md: the first section is not ## {version}")
    return issues


def check():
    """Fails, listing what disagrees, unless the version is the same everywhere."""
    found = problems()
    for problem in found:
        print(problem, file=sys.stderr)
    if found:
        fail(f"the version is not {current()} everywhere")


def set_version(version):
    parse(version)
    old = current()
    text = read(CARGO)
    start, end, _ = workspace_version_line(text)
    write(CARGO, f'{text[:start]}version = "{version}.0"{text[end:]}')

    def lock_block(block):
        if re.search(r"^source = ", block, re.M):
            return block
        return re.sub(r'^version = "[^"]+"$', f'version = "{version}.0"', block, count=1, flags=re.M)

    blocks = read(LOCK).split("[[package]]")
    write(LOCK, "[[package]]".join(blocks[:1] + [lock_block(b) for b in blocks[1:]]))

    text = read(PKGBUILD)
    text = re.sub(r"^pkgver=.*$", f"pkgver={version}", text, count=1, flags=re.M)
    text = re.sub(r"^pkgrel=.*$", "pkgrel=1", text, count=1, flags=re.M)
    write(PKGBUILD, text)

    text = read(METAINFO)
    if not any(v == version for v, _, _ in metainfo_releases(text)):
        today = datetime.date.today().isoformat()
        entry = (
            f'<release version="{version}" date="{today}" type="development">\n'
            "      <description>\n"
            "        <p>TODO: what this version brings.</p>\n"
            "      </description>\n"
            "    </release>\n    "
        )
        text = re.sub(r"(<releases>\s*)", lambda m: m.group(1) + entry, text, count=1)
        write(METAINFO, text)

    text = read(CHANGELOG)
    if not any(v == version for v, _, _ in changelog_sections(text)):
        first = re.search(r"^## ", text, re.M)
        at = first.start() if first else len(text)
        stub = f"## {version} — {NOT_RELEASED}\n\n- TODO: what this version brings.\n\n"
        write(CHANGELOG, text[:at] + stub + text[at:])
    print(f"{old} → {version}. Write the CHANGELOG.md section and the AppStream description.")


def release(date):
    version = current()
    try:
        day = datetime.date.fromisoformat(date)
    except ValueError:
        fail(f"{date!r} is not a date like 2026-11-20")
    text = read(METAINFO)
    pattern = rf'<release version="{re.escape(version)}"[^>]*>'
    if not re.search(pattern, text):
        fail(f"{METAINFO.relative_to(ROOT)} has no release {version}")
    write(METAINFO, re.sub(pattern, f'<release version="{version}" date="{day}">', text, count=1))
    text = read(CHANGELOG)
    heading = re.compile(rf"^## {re.escape(version)}\b.*$", re.M)
    if not heading.search(text):
        fail(f"CHANGELOG.md has no section ## {version}")
    human = f"{day.day} {MONTHS.split()[day.month - 1]} {day.year}"
    write(CHANGELOG, heading.sub(f"## {version} — {human}", text, count=1))
    print(f"{version} released on {human}. Commit, merge, then tag v{version}.")


def tag_info(tag):
    """What a release tag means; fails if it does not match the version in the tree."""
    match = TAG.fullmatch(tag)
    if not match:
        fail(f"{tag!r} is not a release tag like v0.1 or v0.1-rc.1")
    version, pre = match.groups()
    test = pre is not None and version == "0.0" and re.fullmatch(r"test\.\d+", pre) is not None
    if not test:
        if version != current():
            fail(f"tag {tag} does not match the version in Cargo.toml ({current()})")
        check()
        section = next((s for s in changelog_sections(read(CHANGELOG)) if s[0] == version), None)
        if pre is None and NOT_RELEASED in section[1]:
            fail(f"CHANGELOG.md still says {version} is {NOT_RELEASED}: run version.py release")
        newest = metainfo_releases(read(METAINFO))[0]
        if pre is None and newest[1] == "development":
            fail(f"AppStream still marks {version} as a development release: run version.py release")
        if pre is None and ("TODO" in section[2] or "TODO" in read(METAINFO)):
            fail(f"CHANGELOG.md or the AppStream entry for {version} still has a TODO")
    name = version if pre is None else f"{version}-{pre}"
    print(f"version={name}")
    # Debian and RPM sort a tilde before everything, so 0.1~rc.1 comes before 0.1.
    print(f"package_version={version if pre is None else f'{version}~{pre}'}")
    print(f"prerelease={'true' if pre is not None else 'false'}")
    print(f"test={'true' if test else 'false'}")


def unwrap(markdown):
    """Joins wrapped lines: GitHub shows every line break in release notes."""
    lines = []
    fenced = False
    for line in markdown.splitlines():
        if line.startswith("```"):
            fenced = not fenced
        continuation = (
            not fenced
            and lines
            and lines[-1].strip()
            and not lines[-1].startswith(("#", "```", "|"))
            and line.strip()
            and not line.lstrip().startswith(("- ", "* ", "#", "```", "|"))
            and not re.match(r"\s*\d+\. ", line)
        )
        if continuation:
            lines[-1] += " " + line.strip()
        else:
            lines.append(line)
    return "\n".join(lines)


def notes(tag):
    match = TAG.fullmatch(tag)
    if not match:
        fail(f"{tag!r} is not a release tag like v0.1 or v0.1-rc.1")
    version, pre = match.groups()
    if version == "0.0" and pre and pre.startswith("test."):
        print("A test of the release workflow. Not for use; it will be deleted.")
        return
    for found, _, body in changelog_sections(read(CHANGELOG)):
        if found == version:
            print(unwrap(body))
            return
    fail(f"CHANGELOG.md has no section ## {version}")


def main(args):
    command = args[0] if args else "get"
    if command == "get" and len(args) <= 1:
        print(current())
    elif command == "check" and len(args) == 1:
        check()
        print(f"{current()} everywhere")
    elif command == "next" and len(args) == 1:
        print(next_version(current()))
    elif command == "set" and len(args) == 2:
        set_version(args[1])
    elif command == "release" and len(args) <= 2:
        release(args[1] if len(args) == 2 else datetime.date.today().isoformat())
    elif command == "tag" and len(args) == 2:
        tag_info(args[1])
    elif command == "notes" and len(args) == 2:
        notes(args[1])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
