# Releasing Kalliope

## Versions

Kalliope goes up one step at a time: 0.1, 0.2 … 0.9, 1.0, 1.1 … Each step is published for every
supported system. People see "0.1"; Cargo writes it `0.1.0`. A tag is `vX.Y`. A release candidate
is tagged `vX.Y-rc.N` and published as a prerelease.

The version in `Cargo.toml` is the one being prepared. [CHANGELOG.md](../CHANGELOG.md) has its
section at the top, marked "not yet released" until the release. Every change that people will
notice adds a line there, written for the people who use Kalliope.

`tools/version.py` keeps the version the same everywhere it is written. CI fails if the places
disagree.

| Command | What it does |
| --- | --- |
| `python3 tools/version.py` | Prints the version, e.g. `0.1`. |
| `python3 tools/version.py check` | Fails unless `Cargo.toml`, `Cargo.lock`, the AppStream metadata, the PKGBUILD and the changelog agree, and unless `rust-version` in `Cargo.toml` is the Rust pinned in `rust-toolchain.toml`. |
| `python3 tools/version.py release [DATE]` | Marks the version released on DATE (default today): the changelog heading gets the date, the AppStream entry stops being a development release. |
| `python3 tools/version.py set X.Y` | Moves to version X.Y everywhere, and adds its AppStream entry and changelog section with a TODO. |
| `python3 tools/version.py next` | Prints the step after this one (0.9 → 1.0). |
| `python3 tools/version.py tag TAG`, `notes TAG` | Used by the release workflow: check a tag against the tree, print its changelog section. |

## Making a version

1. Check that `main` is green, including the Windows and macOS jobs.
2. In a pull request, mark the version released and finish its texts:
   ```sh
   python3 tools/version.py release            # or: release 2026-11-20
   ```
   Check the changelog section and the AppStream `<release>` description. Neither may contain
   TODO.
3. Merge the pull request, then tag the merge commit on `main` and push the tag:
   ```sh
   git switch main && git pull
   git tag v0.1 && git push origin v0.1
   ```
4. The **Release** workflow builds, tests and publishes the release (below). It refuses a tag that
   does not match `Cargo.toml`, that is not on `main`, or whose changelog section still says "not
   yet released".
5. Start the next version in a new pull request:
   ```sh
   python3 tools/version.py set "$(python3 tools/version.py next)"
   ```

GitHub starts no workflow for a commit whose message contains `[skip ci]` anywhere, not even for a
tag pushed on it. Tag a commit without it.

A release candidate needs only step 3, with a tag like `v0.1-rc.1`: it is published as a
prerelease, its packages say `0.1~rc.1`, which sorts before `0.1`, and `kalliope --version` says
`0.1`.

To try the packaging without publishing anything, start the Release workflow by hand: **Actions →
Release → Run workflow**, on any branch. It does everything but the last job, and keeps the
packages as a workflow artifact for 7 days.

To try the whole workflow, publishing included, push a test tag `v0.0-test.N`. It skips the version
checks and is always a prerelease. Delete it afterwards:
```sh
gh release delete v0.0-test.1 --cleanup-tag --yes -R SANSEVIERIA-OU/kalliope
```

If publishing fails after the packages were built, delete the release if it was created, then
re-run the failed jobs from the workflow run.

## What the Release workflow does

1. Checks the tag (`tools/version.py tag`) and that it is on `main`.
2. Validates the desktop file and the AppStream metadata.
3. Builds the whole workspace with `cargo build --release --workspace --locked`, from scratch: no
   cache goes into release files. The app binary `kalliope` (crates/app) is required.
4. Downloads ONNX Runtime 1.32.0 for Linux x86_64 from Microsoft's NuGet package and checks its
   SHA-256 (`tools/fetch_assets.py`).
5. Makes the packages (`packaging/linux/build-packages.sh`).
6. Installs, runs and removes each package (`packaging/linux/test-packages.sh`). For each one it
   runs `kalliope --version` and `kalliope-cli phonemes ciao`, and has `kalliope-cli say` speak a
   sentence with the packaged ONNX Runtime and the Klein model:
   - the tarball through `./install`, into a temporary folder;
   - the `.deb` with apt, on Ubuntu 24.04;
   - the `.rpm` with dnf, in a `fedora:latest` container;
   - `kalliope-bin.PKGBUILD` with makepkg and pacman, in an `archlinux:base-devel` container.
7. Writes `SHA256SUMS` and the release notes: the version's changelog section, then which file to
   download.
8. Publish job, for tags only: attests where each file was built
   (`actions/attest-build-provenance`), and creates the GitHub release with every file. A tag with
   a `-` makes a prerelease; any other tag is marked as the latest release.

Build provenance attestations are free for public repositories, and Kalliope is public since
12 November 2026: from v0.1-rc.2 on, anyone can check that a file was built by this workflow with
`gh attestation verify <file> -R SANSEVIERIA-OU/kalliope`. (v0.1-rc.1 was published while the
repository was private, without attestations.)

## What is in a release

Linux x86_64 only, for now:

| File | For | Contents |
| --- | --- | --- |
| `kalliope-X.Y-linux-x86_64.tar.gz` | any Linux | `bin/kalliope`, `bin/kalliope-cli`, `lib/libonnxruntime.so.1.32.0` and its `.so.1` link, `share/` (desktop file, icon, AppStream metadata, `doc/kalliope/`), and `./install`, which copies everything into `~/.local` (`./install --remove` takes it away) |
| `kalliope-X.Y-amd64.deb` | Debian 13, Ubuntu 24.04 or newer | the same files under `/usr`, with ONNX Runtime in `/usr/lib/kalliope/` |
| `kalliope-X.Y-x86_64.rpm` | current Fedora | the same as the `.deb` |
| `kalliope-bin.PKGBUILD` | Arch Linux | `packaging/aur/PKGBUILD` with this tarball's checksum |
| `SHA256SUMS` | | the checksum of every file above |

`share/doc/kalliope/` holds `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, `CHANGELOG.md`, and
ONNX Runtime's `LICENSE` and `ThirdPartyNotices.txt`, which must travel with its library.

The app finds ONNX Runtime by looking at `$KALLIOPE_ORT_LIB`, then `../lib/kalliope/` and `../lib/`
next to its own program, then the system. The Klein model is not packaged: the app downloads it the
first time it starts. `kalliope-cli` only looks at `--ort-lib`, `$KALLIOPE_ORT_LIB` and the system.

The packages are built with each format's own tools, `dpkg-deb` and `rpmbuild`, from a short script
and spec file anyone can read. A third-party packager such as nfpm would need its own download and
pinning, and cannot work out library dependencies; `dpkg-shlibdeps` and rpm do that themselves.

### Dependencies

The binaries are built on Ubuntu 24.04, so they need glibc 2.39 or newer. The release job stays on
Ubuntu 24.04 on purpose while CI uses the newest Ubuntu: a newer build system would raise that
minimum (Ubuntu 26.04 has glibc 2.43, Debian 13 has 2.41) and leave out the systems the packages are
made for. The libraries they link are found by `dpkg-shlibdeps` and by rpm: glibc, libgcc,
fontconfig, and libstdc++ for ONNX Runtime.
The others are loaded at run time and listed by hand. They were found by listing the library names
in the app's program (Slint with winit, the software renderer, system fonts and AccessKit; the
PipeWire microphone):

| Library | When | `.deb` | `.rpm` |
| --- | --- | --- | --- |
| libxkbcommon | always | Depends | Requires |
| libwayland-client | Wayland | Depends (or libX11), Recommends | Requires (or libX11), Recommends |
| libX11, libX11-xcb, libxcb, libXcursor, libXi, libxkbcommon-x11 | X11 | Recommends | Recommends |
| libpipewire-0.3 | the virtual microphone | Recommends | Recommends |
| curl (the program) | downloading the voice at first start | Depends | Requires `/usr/bin/curl` |

No OpenGL or EGL library is needed: the app draws with Slint's software renderer. Any desktop
already has all of these. When the app changes its Slint features, check the list again:
```sh
readelf -d target/release/kalliope | grep NEEDED
strings target/release/kalliope | grep -oE 'lib[A-Za-z0-9_.+-]+\.so(\.[0-9]+)*' | sort -u
```

## Arch Linux (AUR)

`packaging/aur/PKGBUILD` is `kalliope-bin`: it unpacks the release tarball and compiles nothing. It
is not published on AUR yet. To publish a version:

1. Take `kalliope-bin.PKGBUILD` from the release and save it as `PKGBUILD` in the AUR package's git
   repository (`ssh://aur@aur.archlinux.org/kalliope-bin.git`).
2. Run `makepkg --printsrcinfo > .SRCINFO`, commit both files and push.

This needs an AUR account with an SSH key. The PKGBUILD downloads the tarball from the GitHub
release, which anyone can do now that the repository is public.

## CI

The **CI** workflow (`.github/workflows/ci.yml`) runs on every push, on pull requests from forks,
and by hand:

| Job | When | What |
| --- | --- | --- |
| Linux | always, on `ubuntu-26.04` | `tools/version.py check`, `cargo fmt --check`, clippy with `-D warnings`, `cargo test --workspace` with the Klein model and ONNX Runtime, and `kalliope-cli say`, which must produce 1.5 to 6 seconds of speech |
| Windows, macOS | pushes to `main`, and runs started by hand | the workspace's tests with the model, after Linux has passed, on `windows-latest` and `macos-latest` (Apple Silicon); not the examples, as `crates/voice/examples/measure.rs` uses Linux-only calls |

Every job uses the Rust named in `rust-toolchain.toml` (rustup installs it on the runner), not the
one the runner image comes with, which can be a release behind.

Pull requests from branches of this repository are not checked twice: the push already was. A new
push to a branch cancels the run it replaces. Compiled dependencies are cached with
`Swatinem/rust-cache`; ONNX Runtime and the model are cached under `.ci-assets`, keyed on
`tools/fetch_assets.py`, which pins their versions and checksums.

## Cost

The repository is public, so GitHub's standard runners cost nothing, on Linux, Windows and macOS
alike. Workflow artifacts are kept for 7 days. Windows and macOS still run only on `main` and by
hand: they take longer, and macOS runners are sometimes all busy (on 12 November 2026 a macOS job
was cancelled twice after GitHub found no free runner), which would hold up every branch.

Measured on 12 November 2026, with the app, in minutes of runner time:

| Run | Jobs | Minutes | After a change to `Cargo.lock` or to `rust-toolchain.toml` |
| --- | --- | --- | --- |
| CI on a branch or pull request | Linux | 2 | 8 |
| CI on `main`, or by hand | Linux, Windows, macOS | about 5 | about 18 |
| Release, or Release by hand | Linux packages, publish | 9 (8 + 1; by hand: 8) | the same: releases use no cache |
| Website | build and deploy | under 1 | the same |

The right-hand column is the first run after the cache stops matching: every dependency (mostly
Slint) is compiled again. That happens when `Cargo.lock` changes and when `rust-toolchain.toml` moves
to a new Rust, about every six weeks. A branch uses `main`'s cache when it has none of its own.

## Website

`website/` is published on GitHub Pages at https://sansevieria-ou.github.io/kalliope/ by
`.github/workflows/pages.yml`, on every change to `website/`, `design-system/` or the site tools on `main`, after
every Release run and after a release is edited by hand. The design system (tokens, base,
components, fonts, living catalogue) lives in `design-system/`, outside the site, because the
application will use it too; the build copies it into the site as `design-system/`, so a page is
complete only once built. `tools/site.py` copies the pages and fills in the version, the
links, sizes and fingerprints of the packages of the newest release (the newest prerelease while
there is no release), so the pages never name a version by hand. What depends on the release being a test version (the note next to the
number, the words «of test» in a sentence) is written for both cases in the page and chosen by the build (`data-release`, see
[translating.md](translating.md)): the first release that is not a prerelease changes those words by itself.

A file of the repository named next to a fact (the source of a figure on «Stato e limiti») is a link to that file **as it is in the version the
page shows**: the page writes `{{kalliope.source.url}}/path/to/file` (a folder: `{{kalliope.tree.url}}/path`), the build fills in the repository
address and the tag of the release it shows. The build asks the repository which files that version has (the local one when it has the tag,
else the public API) and a source that is not there is left as its name, without a link, with a line in the build log; offline, with
`--release-json` and no local tag, the links stay unchecked (the build says so). The address a page shows of itself (the message to forward
on «Stato e limiti») is `{{kalliope.page.url}}`, built like the page's `canonical`, so what is shown, what is copied and the canonical are one address.

The site has one folder per language (`/it/`, `/en/` …) with the same pages under the same names, and the top address is the
page where a visitor chooses the language. The build makes only the languages whose catalogue, `website/lingue/<xx>.po`,
is complete and checked, and says in its log which it left out and why; Italian, the language of the pages, is always
built. Dates and sizes are written in the language of each page from Unicode CLDR (`tools/data/cldr.json`). The old
addresses (`/installa/` …) are pages that send to `/it/…`. How to add a language, change a text, build the
pseudo-languages and run the check: [translating.md](translating.md).

To see the site locally:

```sh
python3 -I tools/site.py --out /tmp/kalliope-site && python3 -m http.server -d /tmp/kalliope-site
```

`--release-json FILE` builds offline from a saved answer of the releases API; `--pseudo` adds `en-XA` and `ar-XB`, the
test languages (accented and 40% longer; right to left), never published.

CI (`ci.yml`, Linux job) runs `tools/translations.py extract --check` and `check`, `tools/css_logico.py` and the tests of the
tools (`python3 -I -m unittest discover -s tools -p 'test_*.py'`).

## Not done yet

- **Windows and macOS packages.** CI builds and tests on both, and ONNX Runtime loads on both
  (`onnxruntime.dll`, `libonnxruntime.dylib`), but nothing is packaged yet. Windows needs an
  installer or a zip with `onnxruntime.dll` next to `kalliope.exe`; macOS needs an app bundle with
  the `.dylib` inside, in a `.dmg`. Both should then be signed. A virtual microphone also needs a
  driver on each system (only PipeWire on Linux exists).
- **Signing.** The `.rpm` and `.deb` are not signed. `dnf install` accepts the `.rpm` after a
  warning.
- **AUR.** See above.
