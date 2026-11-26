# Releasing Kalliope

## Versions

Kalliope goes up one step at a time: 0.1, 0.2 … 0.9, 1.0, 1.1 … Each step is published for every
supported system. People see "0.1"; Cargo writes it `0.1.0`. A tag is `vX.Y`.

The owner decided on 20 November 2026 how versions are released (`CLAUDE.md`, «Rilasci e AUR»):

- **Every step is final** («ogni passo è finale»): there are no test versions, no `-rc` and no
  prereleases. The next release is 0.1, marked as the latest release. (0.1-rc.1, of 12 November
  2026, was the last test version.)
- Releases are made with Kalliope's own tool, `tools/version.py`, and [CHANGELOG.md](../CHANGELOG.md),
  written by hand for the people who use Kalliope.
- **A release starts by itself** when the version changes on `main`. A push to `main` is asked of
  the owner every time, so each release is too.
- Each version also goes on AUR as `kalliope-bin`, published by the release with an SSH key of its
  own (below).
- GitHub Actions costs nothing for a public repository ([Cost](#cost)).

The version in `Cargo.toml` is the one being prepared. CHANGELOG.md has its section at the top,
marked "not yet released" until the release. Every change that people will notice adds a line
there, written for the people who use Kalliope.

`tools/version.py` keeps the version the same everywhere it is written. CI fails if the places
disagree.

| Command | What it does |
| --- | --- |
| `python3 tools/version.py` | Prints the version, e.g. `0.1`. |
| `python3 tools/version.py check` | Fails unless `Cargo.toml`, `Cargo.lock`, the AppStream metadata, the PKGBUILD and the changelog agree, and unless `rust-version` in `Cargo.toml` is the Rust pinned in `rust-toolchain.toml`. |
| `python3 tools/version.py release [DATE]` | Marks the version released on DATE (default today): the changelog heading gets the date, the AppStream entry stops being a development release. Run it again with another date to change the date. |
| `python3 tools/version.py set X.Y` | Moves to version X.Y everywhere, and adds its AppStream entry and changelog section with a TODO. |
| `python3 tools/version.py next` | Prints the step after this one (0.9 → 1.0). |
| `python3 tools/version.py due [TAG…]` | Given the tags the repository has, says whether a push of this tree to `main` releases a version: `release=true` when the version has no tag and the changelog marks it released. |
| `python3 tools/version.py tag TAG`, `notes TAG` | Used by the release workflow: check a tag against the tree (a version must be completely marked released, without TODO), print its changelog section. |

## Making a version

1. In a branch, mark the version released and finish its texts:
   ```sh
   python3 tools/version.py release            # or: release 2026-11-21
   ```
   Check the changelog section and the AppStream `<release>` description. Neither may contain
   TODO. The date is the day of the release: if the push comes on another day, run
   `python3 tools/version.py release YYYY-MM-DD` again with that day and commit it.
2. Check the branch: CI must be green on it, including Windows and macOS (**Actions → CI → Run
   workflow** on the branch runs them too). **Actions → Release → Run workflow** on the branch builds
   and tests the packages and the AUR recipe, publishes nothing, and says in its summary what a push
   of that commit to `main` would do ("this releases v0.1").
3. **With the owner's permission**, bring the branch to `main` and push. The push releases the
   version: the **Release** workflow sees that `v0.1` does not exist yet and that the changelog marks
   0.1 released, builds, tests, attests and publishes the release (below), makes the tag `v0.1` on
   that commit, rebuilds the website and publishes `kalliope-bin` on AUR. It refuses a version whose
   files disagree, whose changelog or AppStream entry still has a TODO, or whose AppStream entry is
   still a development release: then nothing is built and the run is red.
4. Start the next version in a new branch:
   ```sh
   python3 tools/version.py set "$(python3 tools/version.py next)"
   ```
   Until its changelog section is marked released, pushes to `main` release nothing.

A push to `main` whose version is already tagged, or not marked released, does nothing: the Release
workflow's first job says so and stops. GitHub starts no workflow for a commit whose message
contains `[skip ci]` anywhere: never write it in the commit that brings a version.

The tag can still be made by hand, for a commit on `main` (if the automatic run could not finish, for
example):
```sh
git tag v0.1 <commit> && git push origin v0.1
```
The Release workflow then releases that tag in the same way.

**Tries.** **Actions → Release → Run workflow**, on any branch, builds and tests everything,
publishes nothing, and keeps the packages and the AUR files as workflow artifacts for 7 days. To try
the whole workflow, publishing included, push a test tag `v0.0-test.N`. It skips the version checks,
is a prerelease, never the latest release, and goes neither on AUR nor on the website. Delete it
afterwards:
```sh
gh release delete v0.0-test.1 --cleanup-tag --yes -R SANSEVIERIA-OU/kalliope
```

If publishing fails after the packages were built, delete the release if it was created (with
`--cleanup-tag`, so the tag goes too), then re-run the failed jobs from the workflow run. If only AUR
failed, the release stays: fix the cause and start **Actions → AUR → Run workflow** with the version
and "publish" ticked.

## What the Release workflow does

`.github/workflows/release.yml`, on every push to `main`, on a tag `v…` and by hand:

1. **What to release** (`ubuntu-26.04`). On a push to `main`: `tools/version.py due` with the tags
   the repository has (`git ls-remote`); no version to release ends the run here. On a tag: that tag.
   Then `tools/version.py tag` checks the version completely, and a tag must be on `main`.
   By hand on a branch: only `tools/version.py check`, and the summary says what a push would do.
2. Validates the desktop file and the AppStream metadata (on `ubuntu-24.04`, below).
3. Builds the whole workspace with `cargo build --release --workspace --locked`, from scratch: no
   cache goes into release files. The app binary `kalliope` (crates/app) is required.
4. Downloads what goes inside the packages from the `assets` release of this repository
   (`tools/fetch_assets.py`, below): ONNX Runtime 1.32.0 for Linux x86_64, the Klein model and the
   Pocket TTS model, each checked against its SHA-256 in `tools/assets.json`; and a recording (CC0)
   for the tests.
5. Makes the packages (`packaging/linux/build-packages.sh`).
6. Installs, runs and removes each package (`packaging/linux/test-packages.sh`). For each one it
   runs `kalliope --version` and `kalliope-cli phonemes ciao`, has `kalliope-cli say` speak a
   sentence with Giulia, then prepares a voice from the recording (`kalliope-cli voice`) and speaks
   with it, all with the ONNX Runtime and the models the package brought and no `KALLIOPE_*`
   variable, as people run Kalliope:
   - the tarball through `./install`, into a temporary folder;
   - the `.deb` with apt, on Ubuntu 24.04;
   - the `.rpm` with dnf, in a `fedora:latest` container;
   - `kalliope-bin.PKGBUILD` with makepkg and pacman, in an `archlinux:base-devel` container.
7. Writes `SHA256SUMS` and the release notes: the version's changelog section, then which file to
   download (`packaging/release-notes.md`).
8. **Publish**, for a push to `main` that brings a version and for tags: attests where each file was
   built (`actions/attest`, build provenance), and creates the GitHub release with every file,
   marked as the latest release (a test tag: a prerelease, never the latest). On a push to `main` the
   release makes the tag `vX.Y` on the pushed commit. Then it starts the **Website** workflow, so the
   site offers the new version.
9. **AUR** (`.github/workflows/aur.yml`, below): after the release of a version, `kalliope-bin` goes
   on AUR. In a run by hand, the same job writes and tries the recipe with the tarball the run built,
   and pushes nothing.

A tag or a release made with a run's own token (`GITHUB_TOKEN`) starts no other workflow: GitHub's
documentation says that events made with it "will not create a new workflow run", except
`workflow_dispatch` and `repository_dispatch` ("Triggering a workflow from a workflow", checked on
20 November 2026). So the run that makes the tag does all the rest itself (the new tag does not start
the Release workflow a second time), and it starts the Website workflow by hand, with
`gh workflow run` and the `actions: write` permission, instead of relying on the release event. No
personal token or GitHub App is needed.

Two releases never run at once, and a release is never cancelled half-way (`concurrency`).

Build provenance attestations are free for public repositories, and Kalliope is public since
12 November 2026: anyone can check that a file was built by this workflow with
`gh attestation verify <file> -R SANSEVIERIA-OU/kalliope`. (v0.1-rc.1 was published while the
repository was private, without attestations.) The workflow uses `actions/attest@v4` with
`subject-path`, as GitHub's documentation does ("Generating build provenance for binaries");
`actions/attest-build-provenance` is now only a wrapper around it.

## What is in a release

Linux x86_64 only, for now:

| File | For | Contents |
| --- | --- | --- |
| `kalliope-X.Y-linux-x86_64.tar.gz` | any Linux | `bin/kalliope`, `bin/kalliope-cli`, `lib/libonnxruntime.so.1.32.0` and its `.so.1` link, `share/kalliope/` (the voice models), `share/` (desktop file, icons, AppStream metadata, `doc/kalliope/`), and `./install`, which copies everything into `~/.local` (`./install --remove` takes it away) |
| `kalliope-X.Y-amd64.deb` | Debian 13, Ubuntu 24.04 or newer | the same files under `/usr`, with ONNX Runtime in `/usr/lib/kalliope/` and the models in `/usr/share/kalliope/` |
| `kalliope-X.Y-x86_64.rpm` | current Fedora | the same as the `.deb` |
| `kalliope-bin.PKGBUILD` | Arch Linux | `packaging/aur/PKGBUILD` with this tarball's checksum |
| `SHA256SUMS` | | the checksum of every file above |

The icons (the free SVG in `hicolor/scalable`, the symbolic one in `hicolor/symbolic`, PNGs of 48 and 256 px) are written by `tools/marchio.py` from `design-system/marchio/disegno.json` and the `--segno-*` tokens; `build-packages.sh` stops if they no longer match (`python3 -I tools/marchio.py --check`, which CI also runs).

The packages contain everything Kalliope needs: once installed, it downloads nothing. On 19 November
2026 the `.deb` was 187 MB and the tarball 205 MB (320 MB installed), against 16 and 22 MB when the
voice was downloaded at first start; the Pocket TTS model is most of it (215 MB unpacked).

| Installed in | What | Licence and notices, in `share/doc/kalliope/` |
| --- | --- | --- |
| `lib/kalliope/` (`.deb`, `.rpm`), `lib/` (tarball) | ONNX Runtime | `onnxruntime/LICENSE`, `onnxruntime/ThirdPartyNotices.txt` (MIT; they must travel with the library) |
| `share/kalliope/klein-tts-x1.5-pro/` | Klein-TTS-X1.5-Pro: Giulia and Marco | `klein-tts/LICENSE` (Apache-2.0), `klein-tts/NOTICE.txt` |
| `share/kalliope/pocket-tts-italian/` | Pocket TTS by Kyutai, converted to ONNX by Kalliope: the voices prepared from a recording | `pocket-tts/LICENSE` (CC BY 4.0), `pocket-tts/NOTICE.txt` (the attribution and what Kalliope changed) |

`share/doc/kalliope/` also holds `LICENSE`, `NOTICE`, `THIRD_PARTY_NOTICES.md`, `CHANGELOG.md` and
`THIRD_PARTY_LICENSES.txt`.

The app and `kalliope-cli` find ONNX Runtime at `$KALLIOPE_ORT_LIB`, then in `../lib/kalliope/` and
`../lib/` next to their own program, then wherever the system finds it; and the models at
`$KALLIOPE_MODEL_DIR` and `$KALLIOPE_POCKET_DIR`, then in `../share/kalliope/` next to the program
(`kalliope-cli` takes `--ort-lib`, `--model-dir` and `--pocket-dir` first, and `models/klein` or
`models/pocket` in the current folder last, for development). The variables are for development: the
packages need none. When the Klein model is missing (a broken installation, or a build without the
models), the window shows its error state and says which files are missing where.

The packages are built with each format's own tools, `dpkg-deb` and `rpmbuild`, from a short script
and spec file anyone can read. A third-party packager such as nfpm would need its own download and
pinning, and cannot work out library dependencies; `dpkg-shlibdeps` and rpm do that themselves.

### Dependencies

The binaries are built on Ubuntu 24.04, so they need glibc 2.39 or newer. The release job stays on
Ubuntu 24.04 on purpose while CI uses the newest Ubuntu: a newer build system would raise that
minimum (Ubuntu 26.04 has glibc 2.43, Debian 13 has 2.41) and leave out the systems the packages are
made for. The libraries they link are found by `dpkg-shlibdeps` and by rpm: glibc, libgcc, fontconfig
and libstdc++ (Skia and ONNX Runtime).
The others are loaded at run time and listed by hand: the window is one Slint window drawn by Skia on the CPU through
winit, so there is no Qt, GTK or Python and no GPU driver or OpenGL library to ask for.

| Library | When | `.deb` | `.rpm` |
| --- | --- | --- | --- |
| libxkbcommon | always | Depends | Requires |
| libwayland-client | Wayland | Depends (or libX11), Recommends | Requires (or libX11), Recommends |
| libX11, libX11-xcb, libxcb, libXcursor, libXi, libxkbcommon-x11 | X11 | Recommends | Recommends |
| libpipewire-0.3 | the virtual microphone | Recommends | Recommends |

`tools/test_packaging.py` keeps the table honest. Without a binary it rejects Qt, GTK, libadwaita and Python in the
`PKGBUILD`, the `.deb` and the `.rpm`; with `KALLIOPE_BINARY=target/debug/kalliope` (CI does) it reads the libraries the
program is linked with (`readelf -d … | grep NEEDED`) and the ones it names for `dlopen`
(`strings … | grep -oE 'lib[A-Za-z0-9_.+-]+\.so\.[0-9.]+'`), and fails on any that the table does not account for. When the
program gains a library, decide there which package brings it on Arch, Debian and Fedora, and whether it is required or recommended.

## Arch Linux (AUR)

`packaging/aur/PKGBUILD` is `kalliope-bin`: it unpacks the release tarball and compiles nothing.
Every version goes on AUR, https://aur.archlinux.org/packages/kalliope-bin, published by the release
itself; test tags never do (owner's decision, 20 November 2026). `.github/workflows/aur.yml` does it,
called by the Release workflow after the release:

1. **The recipe.** `tools/aur.py write` fills `packaging/aur/PKGBUILD` with the version and the
   SHA-256 of the published tarball (from the release's `SHA256SUMS`), and compares it with what AUR
   has (an anonymous clone of `https://aur.archlinux.org/kalliope-bin.git`): `pkgrel` is 1 for a new
   version; when AUR already has this version with other files, one more than AUR's, so that pacman
   offers the new build to whoever installed the earlier one; when AUR has exactly these files,
   nothing is pushed. A version older than AUR's is refused. Next to the PKGBUILD goes `LICENSE`: AUR
   asks every package for the licence of its sources ("add a package source license", ArchWiki, AUR
   submission guidelines), and the recipe is under SANSEVIERIA License 1.1, like the rest of
   Kalliope.
2. **On Arch.** In an `archlinux:base-devel` container: `makepkg --printsrcinfo` writes `.SRCINFO`;
   `makepkg` builds the package, downloading the published tarball and checking its SHA-256 as
   people's makepkg will; pacman installs it, `kalliope --version` must answer `kalliope X.Y`, and it
   is removed again. The three files are kept as a workflow artifact (`aur-kalliope-bin`) for 7 days.
3. **The push**, to `ssh://aur@aur.archlinux.org/kalliope-bin.git`, branch `master` (the only one AUR
   takes), with the key in the secret `AUR_SSH_KEY`. The workflow talks only to the server whose
   Ed25519 key has the fingerprint `SHA256:RFzBCUItH9LZS0cKB5UE6ceAYhBD5C8GeOBip8Z11+4`, the one AUR
   lists on its home page and Arch announced on 28 July 2020
   (https://archlinux.org/news/aur-migration-new-ssh-hostkeys/; checked on 20 November 2026). Any
   other key stops it. The first push creates the package on AUR.

Without the secret, the job says so in a warning and publishes nothing; the release is not affected.
In a run of the Release workflow by hand, the job does steps 1 and 2 with the tarball the run built
and never receives the key.

To put a version that is already out on AUR again (after a change to the PKGBUILD, or if AUR failed):
**Actions → AUR → Run workflow**, with the version (`0.1`) and "publish" ticked; unticked, it only
writes and tries the recipe. From a terminal:
```sh
gh workflow run aur.yml -R SANSEVIERIA-OU/kalliope -f version=0.1 -f publish=true
```

### The key

AUR takes pushes from the SSH keys in the maintainer's profile. Kalliope has a key of its own, an
Ed25519 key used for nothing else (the owner's decision, 20 November 2026):
- its private half is the repository secret `AUR_SSH_KEY` (**Settings → Secrets and variables →
  Actions**), which nobody can read back, and a copy is in the owner's `.env`;
- its public half must be in the owner's AUR profile (**My Account → SSH Public Key**, one key per
  line: the owner's own keys stay).

To change it (a leak, or a new maintainer):
```sh
ssh-keygen -t ed25519 -N '' -C 'Kalliope release, AUR' -f kalliope-aur
gh secret set AUR_SSH_KEY -R SANSEVIERIA-OU/kalliope < kalliope-aur
```
Put `kalliope-aur.pub` in the AUR profile and take the old public key out of it, replace the copy in
`.env`, then delete both files. ArchWiki's guidelines also say that automatic PKGBUILD updates are
the maintainer's responsibility: when the release changes what Kalliope needs (a new library, another
licence), change `packaging/aur/PKGBUILD` in the same version.

## CI

The **CI** workflow (`.github/workflows/ci.yml`) runs on every push, on pull requests from forks,
and by hand:

| Job | When | What |
| --- | --- | --- |
| Linux | always, on `ubuntu-26.04` | `tools/version.py check`, the website and window checks (`translations.py`, `css_logico.py`, `marchio.py`, `slint_valori.py` for hand-written values in `crates/app/ui/*.slint`, `caratteri_ttf.py --check`) and the Python tests of `tools/`, `cargo fmt --check`, clippy with `-D warnings`, `cargo test --workspace` with ONNX Runtime and both models (Klein, and Pocket TTS, whose tests prepare a voice and speak with it; this includes the token bridge in `crates/tokens`), `kalliope-cli say`, which must produce 1.5 to 6 seconds of speech, then the program itself: `tools/test_packaging.py` against the built binary, and `tools/check_desktop.py` under Xvfb with the stub settings portal (`tools/portale_finto.py`) announcing the dark appearance, the light one and none, each photographed and checked for the right brightness |
| Windows, macOS | pushes to `main`, and runs started by hand | the workspace's tests with both models, after Linux has passed, on `windows-latest` and `macos-latest` (Apple Silicon); not the examples, as `crates/voice/examples/measure.rs` uses Linux-only calls |
| New versions (`versions.yml`) | Mondays, and by hand | compares the pinned versions with the newest ones and opens an issue for each new one (below) |

Every job uses the Rust named in `rust-toolchain.toml` (rustup installs it on the runner), not the
one the runner image comes with, which can be a release behind.

Pull requests from branches of this repository are not checked twice: the push already was. A new
push to a branch cancels the run it replaces. Compiled dependencies are cached with
`Swatinem/rust-cache`; ONNX Runtime and the models are cached under `.ci-assets`, keyed on
`tools/assets.json`, which pins them, and `tools/fetch_assets.py`, which downloads them from the
`assets` release.

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
| Release, or Release by hand | Linux packages, publish, AUR | 9 (8 + 1; by hand: 8) before AUR; AUR not measured yet | the same: releases use no cache |
| Release, on a push to `main` with no version to release | what to release | under 1 | the same |
| Website | build and deploy | under 1 | the same |

The right-hand column is the first run after the cache stops matching: every dependency (mostly
Slint) is compiled again. That happens when `Cargo.lock` changes and when `rust-toolchain.toml` moves
to a new Rust, about every six weeks. A branch uses `main`'s cache when it has none of its own.

## Website

`website/` is published on GitHub Pages at https://sansevieria-ou.github.io/kalliope/ by
`.github/workflows/pages.yml`, on every change to `website/`, `design-system/` or the site tools on `main`, when
the Release workflow has published a version (it starts the Website workflow itself) and after a release is edited by hand. A push that
brings a version to release (`tools/version.py due`) does not deploy: its pages already speak of that version, so the site waits for
the Release workflow, which publishes the packages and then starts the Website workflow; the site changes in one go. If that release
fails, the site stays as it was. The design system (tokens, base,
components, fonts, living catalogue) lives in `design-system/`, outside the site, because the
application will use it too; the build copies it into the site as `design-system/`, so a page is
complete only once built. `tools/site.py` copies the pages and fills in the version, the
links, sizes and fingerprints of the packages of the newest release (the newest prerelease while
there is no release: until 0.1, that is 0.1-rc.1), so the pages never name a version by hand. What depends on the release being a test
version (the note next to the number, the words «of test» in a sentence) is written for both cases in the page and chosen by the build
(`data-release`, see [translating.md](translating.md)): 0.1, the first release that is not a prerelease, changes those words by itself,
and as there are no test versions any more, they never come back.

A file of the repository named next to a fact (the source of a figure on «Stato e limiti») is a link to that file **as it is in the version the
page shows**: the page writes `{{kalliope.source.url}}/path/to/file` (a folder: `{{kalliope.tree.url}}/path`), the build fills in the repository
address and the tag of the release it shows. The build asks the repository which files that version has (the local one when it has the tag,
else the public API) and a source that is not there is left as its name, without a link, with a line in the build log; offline, with
`--release-json` and no local tag, the links stay unchecked (the build says so). The address a page shows of itself (the message to forward
on «Stato e limiti») is `{{kalliope.page.url}}`, built like the page's `canonical`, so what is shown, what is copied and the canonical are one address.

What `kalliope --version` answers on «Installa» is `kalliope {{kalliope.program.version}}`: the program writes its Cargo version without the last `.0`
(`crates/app/src/main.rs`, `version()`), and a release tag is `vX.Y` for a Cargo version `X.Y.0` (`tools/version.py`; the old test version
`v0.1-rc.1` was also Cargo's `0.1.0`), so the marker is the tag's `X.Y`. `tools/test_translations.py` (`VersioneDelProgramma`) fails if the program's source says it another way.

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

## ONNX Runtime and the models: the `assets` release

Kalliope ships ONNX Runtime and its voice models inside its packages and keeps them up to date itself
(decisions of the owner, 19 November 2026). Their files live in one release of this repository, tagged
`assets`, so that CI, releases and people who build Kalliope download them from here only, never from
Microsoft's or Hugging Face's servers:

| File | What | From |
| --- | --- | --- |
| `onnxruntime-linux-x64-X.Y.Z.tar.xz`, `onnxruntime-osx-arm64-…`, `onnxruntime-win-x64-…` | ONNX Runtime for each system, with its `LICENSE` and `ThirdPartyNotices.txt` | Microsoft's NuGet package `Microsoft.ML.OnnxRuntime`, its official channel for the C library (`github.com/microsoft/onnxruntime` answered 404 on 19 November 2026) |
| `klein-tts-x1.5-pro-REV.tar.xz` | Klein's `onnx/` files, unchanged, with its licence | `klein-ml/Klein-TTS-X1.5-Pro` on Hugging Face, revision REV |
| `pocket-tts-italian-REV.tar.xz` | Pocket TTS, Italian, 6 layers, exported to ONNX by `tools/pocket_export/`, with the CC BY 4.0 text and the attribution | `kyutai/pocket-tts` on Hugging Face (gated: downloading it needs the owner's key), revision REV of the weights |
| `test-recording-selfie-REV.tar.xz` | a voice donated to Kyutai (CC0), only for tests | `kyutai/tts-voices` |

- The release is a **prerelease, never "latest"**, and its tag does not start with `v`: the Release
  workflow does not run for it, and `tools/site.py` offers only releases tagged `vX.Y` or `vX.Y-…`, so
  it is never taken for a version of Kalliope.
- **A file's name carries its version** (the ONNX Runtime version, the first 7 characters of a
  revision). A name is never used twice: a file rebuilt with other contents gets `-2`, `-3`… A file
  stays in the release as long as a version of Kalliope uses it (its `tools/assets.json` names it),
  so older versions can always be built again. Never replace a file that is already there.
- **`tools/assets.json` pins every file**, with its SHA-256, size, folder and the SHA-256 of each file
  inside, and the sources it was made from (versions, revisions, hashes). It is the only place:
  `tools/fetch_assets.py` checks every download against it, and the weekly check reads it. It is
  written by the tool below, never by hand.
- Archives are `.tar.xz` (smaller than `.tar.gz` by a quarter for ONNX Runtime, by 12% for Pocket
  TTS), each a folder with its licence; the same contents always make the same bytes.

### Moving to a new version

The weekly check opens an issue that names the new version and the command. Then:

1. Prepare the files (here, or on any machine with Python 3.10–3.14 and about 3 GB of free memory):
   ```sh
   python3 tools/release_assets.py build OUT --onnxruntime 1.33.0     # or --klein REV, --pocket-weights REV,
                                                                     # --pocket-tokenizer REV, --pocket-code COMMIT
   ```
   It downloads the new sources and checks them (NuGet's SHA-512; the git ids Hugging Face lists), and
   for Pocket TTS makes the export's Python environment from `tools/pocket_export/requirements.txt`
   (first update its pins to the latest versions, as `CLAUDE.md` asks), exports, and checks the graphs
   against Kyutai's code. The Pocket TTS weights need the owner's read key in `HF_TOKEN`, only in that
   command's environment; the tool never prints or saves it. It writes `tools/assets.json` and the new
   files into `OUT`, and prints the command that uploads them. **It uploads nothing.**
2. Check the new files in a branch: `KALLIOPE_ASSETS_URL=http://127.0.0.1:PORT/` makes
   `tools/fetch_assets.py` download them from a local copy (`python3 -m http.server -d OUT PORT`); run
   `cargo test --workspace` with them, build the packages and run `packaging/linux/test-packages.sh`.
   For Pocket TTS, listen to it and run the voice checks of `benchmarks/voce-propria/`; a new Kyutai
   commit may also need changes in `crates/voice/src/pocket/`, which follows Kyutai's generation loop.
3. **With the owner's permission**, upload the files with the printed command
   (`gh release upload assets …`), and only then push the branch: CI downloads from the release.
4. Merge. The next version of Kalliope ships the new files.

The first time, the release does not exist yet: the tool prints `gh release create assets … --prerelease
--latest=false` with every file. Two consequences to weigh before running it, both because
`.github/workflows/pages.yml` runs for every release published, edited or deleted:
- the website workflow starts and builds the site of the commit the tag points to;
- with a `tools/site.py` older than the one that offers only `v…` tags, that build stops with an error
  (the `assets` release has no packages), and the site already online stays as it is.

### The weekly check

`.github/workflows/versions.yml` runs `tools/release_assets.py check --open-issues` every Monday and by
hand. It compares the pins with ONNX Runtime on NuGet, the Klein files and the Pocket TTS weights and
tokenizer on Hugging Face (by their git ids, which the gated repository also shows without a key), the
commits that touch `pocket_tts/` in Kyutai's code, and the stable Rust against `rust-toolchain.toml`.
For each new version it opens one issue, and none when an issue with that title already exists (open
or closed). It changes nothing by itself, needs no secret (the run's own token, with `issues: write`)
and can be run here without `--open-issues` to see what is new.

GitHub disables a scheduled workflow of a public repository after 60 days without activity in the
repository (GitHub's documentation, checked on 19 November 2026). If nothing is pushed for two months,
enable it again: **Actions → New versions → Enable workflow**.

## Not done yet

- **Windows and macOS packages.** CI builds and tests on both, and ONNX Runtime loads on both
  (`onnxruntime.dll`, `libonnxruntime.dylib`), but nothing is packaged yet. Windows needs an
  installer or a zip with `onnxruntime.dll` next to `kalliope.exe`; macOS needs an app bundle with
  the `.dylib` inside, in a `.dmg`. Both should then be signed. A virtual microphone also needs a
  driver on each system (only PipeWire on Linux exists).
- **Signing.** The `.rpm` and `.deb` are not signed. `dnf install` accepts the `.rpm` after a
  warning.
