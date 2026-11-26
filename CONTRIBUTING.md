# Contributing

Original project code uses [SANSEVIERIA License 1.1](LICENSE), except for the separately licensed
material listed in [NOTICE](NOTICE). Contributors retain their copyright; no assignment is
requested. Preserve third-party notices.

## Licence assent for contributions under SANSEVIERIA License

Before submitting code covered by SANSEVIERIA License 1.1, read the complete licence. Include this
express declaration in your PR or an associated signed record, identifying the contribution and
licence version:

> I intentionally submit the identified Contribution under the SANSEVIERIA License 1.1, whose complete text has been provided to me. I have the authority necessary to make the copyright and patent grants applicable to this Contribution. I expressly agree to the limited authority in section 7 allowing SANSEVIERIA OÜ to authorize specified commercial offerings and charge for those authorizations while preserving the source, reciprocity, notice and recipient-rights conditions, and to the authority in section 15 to make the Contribution available under later common versions that preserve the guarantees listed there. I understand that both authorities are personal to SANSEVIERIA OÜ, end or are suspended as provided in section 7, including on a Change of Control or its dissolution, and can be renewed only by my express statement after the event. I retain my rights and do not grant a general proprietary relicensing power. I have identified separately licensed material and other rights holders whose permission is relevant, and I do not purport to grant rights they have not authorized me to grant.

This declaration is specific to SANSEVIERIA License 1.1, not the standard DCO. Maintainers must
record the assent and verify the scope of any employer or third-party permission. An automatically
filled checkbox, silence or merely opening a PR does not establish that assent.

SANSEVIERIA License is a single licence for all SANSEVIERIA OÜ projects. Section 15 lets SANSEVIERIA
OÜ move contributions, and changes published in forks, to later common versions that keep the
guarantees it lists: free use, source availability, reciprocity, the patent permission,
contributors' rights and the limits on SANSEVIERIA OÜ's authority. It allows no proprietary
relicensing, and recipients of earlier copies keep the rights they received.

Under section 7, the authorities you grant SANSEVIERIA OÜ cannot be transferred. They end for your
code if someone else acquires control of the company or it is dissolved or declared bankrupt, and
are suspended during insolvency proceedings; only your express statement after the event renews
them. Your rights and every recipient's rights stay unchanged.

SANSEVIERIA OÜ and its appointed maintainers decide which contributions to merge and which releases
are official. Submission does not guarantee acceptance.

## Layout

| Path | Contents |
| --- | --- |
| `crates/text` | Italian text normalizer (`kalliope-text`) |
| `crates/phonemes` | Italian phonemizer (`kalliope-phonemes`); `data/` is CC BY-SA, see its README |
| `crates/voice` | Neural voices through ONNX Runtime, with its own minimal C API binding (`kalliope-voice`): Klein (Giulia, Marco) and Pocket TTS (`src/pocket/`, a voice prepared from a recording) |
| `crates/cli` | `kalliope-cli` development command line |
| `tools/` | Python helpers: ONNX Runtime and the models (`fetch_assets.py`, `release_assets.py`, `assets.json`, the Pocket TTS export in `pocket_export/`), the website build, version checks; development only: espeak-ng reference phonemes, Whisper WER, phonemizer data build |
| `benchmarks/engines` | The November 2026 engine benchmark that chose the voice |

Principles: no crate dependencies unless clearly justified; every CPU and memory cost is
measured. espeak-ng (GPL) may be used only by development tools, as a separate program, and never
in a build.

## Build and test

```sh
cargo build --release
cargo test --workspace            # model tests run when KALLIOPE_ORT_LIB and KALLIOPE_MODEL_DIR (Klein)
                                  # or KALLIOPE_POCKET_DIR (Pocket TTS) are set
cargo clippy --workspace --all-targets -- -D warnings
cargo fmt --all --check
python3 tools/version.py check    # the version is the same in every file that states it, and so is the Rust
```

`rust-toolchain.toml` names the Rust that builds Kalliope, the latest stable release; rustup installs
it, with clippy and rustfmt, the first time you run `cargo` here. CI and release builds use the same
one, and `rust-version` in `Cargo.toml` says the same version, the only one CI checks. To move to a
newer Rust, change both, then run the checks above: a new clippy often has new warnings.

`python3 tools/fetch_assets.py onnxruntime DIR`, `… model DIR` and `… pocket DIR` download ONNX
Runtime, the Klein model and the Pocket TTS model that CI and the packages use, and print the variables
to set. They come from the `assets` release of this repository, each checked against its SHA-256 in
`tools/assets.json`; nothing is downloaded from anyone else. ONNX Runtime is `libonnxruntime.so` on
Linux, `libonnxruntime.dylib` on macOS and `onnxruntime.dll` on Windows. Installed Kalliope needs none of
these variables: the packages bring ONNX Runtime and the models, and the programs find them next to
themselves. Updating those files is for maintainers, with the owner's permission to upload:
[docs/releasing.md](docs/releasing.md).

On Linux, install the Qt 6 base development kit before compiling the desktop binary (on Ubuntu, `qt6-base-dev`). The GNOME window also needs the distribution's Python 3 GTK bindings and Adwaita typelib (`python3-gi gir1.2-adw-1` on Ubuntu). KDE uses the Qt platform integration and widget style from the desktop session.

CI runs these checks on Linux for every push, and also on Windows and macOS for `main`. The Linux
packages are made by `packaging/linux/build-packages.sh`; [docs/releasing.md](docs/releasing.md)
explains versions, releases and what CI costs.

Versions go up one step at a time (0.1, 0.2 … 0.9, 1.0), and every step is final: there are no test
versions. A change that people will notice adds a line to the version's section of
[CHANGELOG.md](CHANGELOG.md), written for them. A version is released by the push to `main` that marks
it released (`python3 tools/version.py release`): the Release workflow then builds, tests and publishes
it, on GitHub and on AUR. Pushing to `main` is for maintainers, with the owner's permission.

Every source file starts with `SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1`.
