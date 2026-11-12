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
| `python3 tools/version.py check` | Fails unless `Cargo.toml`, `Cargo.lock`, the AppStream metadata, the PKGBUILD and the changelog agree. |
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
4. Downloads ONNX Runtime 1.31.1 for Linux x86_64 from its GitHub release and checks its SHA-256
   (`tools/fetch_assets.py`).
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

Build provenance attestations are free for public repositories. For private repositories they need
GitHub Enterprise Cloud; SANSEVIERIA-OU is on GitHub Free, so while Kalliope is private this step
fails with a warning and the release goes ahead without it. Once the repository is public, it works
without changes, and anyone can check a file with
`gh attestation verify <file> -R SANSEVIERIA-OU/kalliope`.

## What is in a release

Linux x86_64 only, for now:

| File | For | Contents |
| --- | --- | --- |
| `kalliope-X.Y-linux-x86_64.tar.gz` | any Linux | `bin/kalliope`, `bin/kalliope-cli`, `lib/libonnxruntime.so.1.31.1` and its `.so.1` link, `share/` (desktop file, icon, AppStream metadata, `doc/kalliope/`), and `./install`, which copies everything into `~/.local` (`./install --remove` takes it away) |
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

The binaries are built on Ubuntu 24.04, so they need glibc 2.39 or newer. The libraries they link
are found by `dpkg-shlibdeps` and by rpm: glibc, libgcc, fontconfig, and libstdc++ for ONNX Runtime.
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

This needs an AUR account with an SSH key. The tarball must also be downloadable without signing
in, so AUR only works once releases are public: the PKGBUILD downloads it from the GitHub release.

## CI

The **CI** workflow (`.github/workflows/ci.yml`) runs on every push, on pull requests from forks,
and by hand:

| Job | When | What |
| --- | --- | --- |
| Linux | always | `tools/version.py check`, `cargo fmt --check`, clippy with `-D warnings`, `cargo test --workspace` with the Klein model and ONNX Runtime, and `kalliope-cli say`, which must produce 1.5 to 6 seconds of speech |
| Windows, macOS | pushes to `main`, and runs started by hand | the workspace's tests with the model, after Linux has passed, on `windows-latest` and `macos-latest` (Apple Silicon); not the examples, as `crates/voice/examples/measure.rs` uses Linux-only calls |

Pull requests from branches of this repository are not checked twice: the push already was. A new
push to a branch cancels the run it replaces. Compiled dependencies are cached with
`Swatinem/rust-cache`; ONNX Runtime and the model are cached under `.ci-assets`, keyed on
`tools/fetch_assets.py`, which pins their versions and checksums.

## Cost

The repository is private, so its Actions minutes come from the organisation's free quota of
2,000 minutes a month. A Linux minute counts once, a Windows minute twice and a macOS minute ten
times. Each job is rounded up to a whole minute. Measured on these workflows:

| Run | Jobs | Counted minutes |
| --- | --- | --- |
| CI on a branch or pull request | Linux | MEASURE |
| CI on `main`, or by hand | Linux, Windows (×2), macOS (×10) | MEASURE |
| Release, or Release by hand | build and test (Linux), publish (Linux) | MEASURE |

The first run after `Cargo.lock` changes compiles every dependency again and takes longer. macOS is
by far the dearest part: that is why it runs only on `main`. Workflow artifacts are kept for 7 days
and count towards the organisation's 500 MB of storage.

## Not done yet

- **Windows and macOS packages.** CI builds and tests on both, and ONNX Runtime loads on both
  (`onnxruntime.dll`, `libonnxruntime.dylib`), but nothing is packaged yet. Windows needs an
  installer or a zip with `onnxruntime.dll` next to `kalliope.exe`; macOS needs an app bundle with
  the `.dylib` inside, in a `.dmg`. Both should then be signed. A virtual microphone also needs a
  driver on each system (only PipeWire on Linux exists).
- **Signing.** The `.rpm` and `.deb` are not signed. `dnf install` accepts the `.rpm` after a
  warning.
- **AUR.** See above.
