# Contributing

Original project code uses [SANSEVIERIA License 1.0](LICENSE), except for the separately licensed
material listed in [NOTICE](NOTICE). Contributors retain their copyright; no assignment is
requested. Preserve third-party notices.

## Licence assent for contributions under SANSEVIERIA License

Before submitting code covered by SANSEVIERIA License 1.0, read the complete licence. Include this
express declaration in your PR or an associated signed record, identifying the contribution and
licence version:

> I intentionally submit the identified Contribution under the SANSEVIERIA License 1.0, whose complete text has been provided to me. I have the authority necessary to make the copyright and patent grants applicable to this Contribution. I expressly agree to the limited authority in section 7 allowing SANSEVIERIA OÜ to authorize specified commercial offerings and charge for those authorizations while preserving the source, reciprocity, notice and recipient-rights conditions. I retain my rights and do not grant a general proprietary relicensing power. I have identified separately licensed material and other rights holders whose permission is relevant, and I do not purport to grant rights they have not authorized me to grant.

This declaration is specific to SANSEVIERIA License 1.0, not the standard DCO. Maintainers must
record the assent and verify the scope of any employer or third-party permission. An automatically
filled checkbox, silence or merely opening a PR does not establish that assent.

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

CI runs these checks on Linux for every push, and also on Windows and macOS for `main`. The Linux
packages are made by `packaging/linux/build-packages.sh`; [docs/releasing.md](docs/releasing.md)
explains versions, releases and what CI costs.

Every source file starts with `SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0`.
