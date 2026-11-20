#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
# Installs, runs and removes the packages that build-packages.sh made:
#   the tarball with ./install, into a temporary folder;
#   the .deb with apt, here (needs Debian or Ubuntu, and root or sudo);
#   the .rpm with dnf, in a Fedora container, and kalliope-bin.PKGBUILD with makepkg, in an
#   Arch Linux container (needs docker or podman).
#
#   packaging/linux/test-packages.sh DIST_DIR VERSION APP_VERSION [RECORDING]
#
# VERSION is the one in the file names (0.1, 0.1-rc.1); APP_VERSION is what kalliope --version
# must print (tools/version.py). Each installed copy speaks a sentence with Giulia, with the ONNX
# Runtime and the model it brought and no KALLIOPE_* variable. With RECORDING, a WAV file
# (tools/fetch_assets.py recording), it also prepares a voice from it and speaks with that voice.
set -euo pipefail

# Inside a container, this script runs one check: test-packages.sh --inside rpm|arch ...
if [ "${1:-}" = "--inside" ]; then
    inside=$2
    shift 2
else
    inside=
fi
if [ $# -lt 3 ]; then
    sed -n '3,14p' "$0" >&2
    exit 2
fi
dist=$(cd "$1" && pwd) version=$2 app_version=$3 recording=${4:-}
if [ -n "$recording" ]; then recording=$(cd "$(dirname "$recording")" && pwd)/$(basename "$recording"); fi
here=$(cd "$(dirname "$0")" && pwd)
sudo=$([ "$(id -u)" = 0 ] || echo sudo)

# The icons the packages install (tools/marchio.py): the free SVG, the symbolic one for GNOME and the two PNGs (freedesktop asks for 48x48 at least).
id=io.github.sansevieria_ou.kalliope
icons=(scalable/apps/$id.svg symbolic/apps/$id-symbolic.svg 48x48/apps/$id.png 256x256/apps/$id.png)

# Every icon is installed under SHARE/icons/hicolor, not empty, and is what it says (PNG signature and size, SVG root).
icons_present() {
    local share=$1 f
    for f in "${icons[@]}"; do
        test -s "$share/icons/hicolor/$f" || { echo "$share/icons/hicolor/$f is missing" >&2; return 1; }
    done
    for size in 48 256; do
        f=$share/icons/hicolor/${size}x$size/apps/$id.png
        [ "$(head -c 8 "$f" | od -An -tx1 | tr -d ' \n')" = 89504e470d0a1a0a ] || { echo "$f is not a PNG" >&2; return 1; }
        [ "$(od -An -tu1 -j19 -N1 "$f" | tr -d ' ')" = $((size % 256)) ] && [ "$(od -An -tu1 -j18 -N1 "$f" | tr -d ' ')" = $((size / 256)) ] || { echo "$f is not ${size}x$size" >&2; return 1; }
    done
    grep -q '<svg' "$share/icons/hicolor/scalable/apps/$id.svg" && grep -q '<svg' "$share/icons/hicolor/symbolic/apps/$id-symbolic.svg" || { echo "an icon is not an SVG" >&2; return 1; }
}

# The icons after the program is removed, for gone().
icon_paths() {
    local share=$1 f
    for f in "${icons[@]}"; do echo "$share/icons/hicolor/$f"; done
}

# The installed programs run as people run them: no variable says where ONNX Runtime or the models are.
bare() {
    env -u KALLIOPE_ORT_LIB -u KALLIOPE_MODEL_DIR -u KALLIOPE_POCKET_DIR -u KALLIOPE_VOICES_DIR "$@"
}

# Milliseconds of speech in a 16-bit mono WAV file (two bytes per sample after the 44-byte header).
speech_ms() {
    local rate bytes
    rate=$(od -An -tu4 -j24 -N4 "$1" | tr -d ' ')
    bytes=$(stat -c %s "$1")
    echo $(((bytes - 44) * 500 / rate))
}

# Runs the installed programs in BIN_DIR; ORT_LIB is the ONNX Runtime they must have brought.
check() {
    local bin=$1 ort=$2 out tmp ms
    echo "--- $bin/kalliope --version"
    out=$(bare "$bin/kalliope" --version)
    echo "$out"
    grep -qF "$app_version" <<<"$out" || { echo "expected $app_version" >&2; return 1; }
    echo "--- $bin/kalliope-cli phonemes ciao"
    out=$(bare "$bin/kalliope-cli" phonemes "ciao")
    echo "$out"
    grep -q $'^ciao\t.' <<<"$out" || { echo "expected ciao and its phonemes" >&2; return 1; }
    test -f "$ort" || { echo "$ort is missing" >&2; return 1; }
    icons_present "$(dirname "$bin")/share"
    tmp=$(mktemp -d)
    echo "--- $bin/kalliope-cli say, with Giulia"
    bare "$bin/kalliope-cli" say -o "$tmp/giulia.wav" "Ciao a tutti, mi sentite?"
    ms=$(speech_ms "$tmp/giulia.wav")
    echo "$ms ms of speech"
    if ((ms < 700 || ms > 6000)); then
        echo "expected 0.7 to 6 seconds of speech" >&2
        return 1
    fi
    if [ -n "$recording" ]; then
        echo "--- $bin/kalliope-cli voice, then say with that voice"
        bare "$bin/kalliope-cli" voice "$recording" -o "$tmp/voce.safetensors"
        bare "$bin/kalliope-cli" say --voice "$tmp/voce.safetensors" -o "$tmp/voce.wav" "Ciao a tutti, mi sentite?"
        ms=$(speech_ms "$tmp/voce.wav")
        echo "$ms ms of speech"
        if ((ms < 700 || ms > 6000)); then
            echo "expected 0.7 to 6 seconds of speech" >&2
            return 1
        fi
    fi
    rm -rf "$tmp"
}

gone() {
    local f
    for f in "$@"; do
        if [ -e "$f" ] || [ -L "$f" ]; then
            echo "$f is still there after removing" >&2
            return 1
        fi
    done
}

case $inside in
rpm)
    dnf install -y -q "$dist/kalliope-$version-x86_64.rpm"
    rpm -q --requires kalliope
    check /usr/bin /usr/lib/kalliope/libonnxruntime.so.1
    dnf remove -y -q kalliope
    gone /usr/bin/kalliope /usr/bin/kalliope-cli /usr/lib/kalliope /usr/share/kalliope $(icon_paths /usr/share)
    exit 0
    ;;
arch)
    pacman -Syu --noconfirm >/dev/null
    useradd -m builder
    build=/home/builder/build
    install -d -o builder "$build"
    install -o builder -m644 "$dist/kalliope-bin.PKGBUILD" "$build/PKGBUILD"
    install -o builder -m644 "$dist/kalliope-$version-linux-x86_64.tar.gz" "$build/"
    # Only packing here; pacman -U below installs the dependencies.
    su builder -c "cd $build && makepkg --noconfirm --nodeps"
    pacman -U --noconfirm "$build"/kalliope-bin-*.pkg.tar.zst
    check /usr/bin /usr/lib/kalliope/libonnxruntime.so.1
    test -L /usr/share/licenses/kalliope-bin/LICENSE
    pacman -R --noconfirm kalliope-bin
    gone /usr/bin/kalliope /usr/bin/kalliope-cli /usr/lib/kalliope /usr/share/kalliope $(icon_paths /usr/share)
    exit 0
    ;;
esac

echo "=== tarball"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
tar -C "$tmp" -xzf "$dist/kalliope-$version-linux-x86_64.tar.gz"
"$tmp/kalliope-$version-linux-x86_64/install" "$tmp/prefix"
check "$tmp/prefix/bin" "$tmp/prefix/lib/kalliope/libonnxruntime.so.1"
grep -qx "Exec=\"$tmp/prefix/bin/kalliope\"" \
    "$tmp/prefix/share/applications/io.github.sansevieria_ou.kalliope.desktop"
"$tmp/kalliope-$version-linux-x86_64/install" --remove "$tmp/prefix"
gone "$tmp/prefix/bin/kalliope" "$tmp/prefix/lib/kalliope" "$tmp/prefix/share/kalliope" "$tmp/prefix/share/doc/kalliope" $(icon_paths "$tmp/prefix/share")

if command -v apt-get >/dev/null; then
    echo "=== .deb"
    $sudo env DEBIAN_FRONTEND=noninteractive apt-get install -y -q "$dist/kalliope-$version-amd64.deb" >/dev/null
    dpkg -s kalliope | grep -E '^(Version|Depends|Recommends):'
    check /usr/bin /usr/lib/kalliope/libonnxruntime.so.1
    $sudo env DEBIAN_FRONTEND=noninteractive apt-get remove -y -q kalliope >/dev/null
    gone /usr/bin/kalliope /usr/bin/kalliope-cli /usr/lib/kalliope /usr/share/kalliope $(icon_paths /usr/share)
else
    echo "=== .deb: skipped (no apt-get)"
fi

engine=$(command -v docker || command -v podman || true)
if [ -n "$engine" ]; then
    mounts=(-v "$dist:/dist:ro" -v "$here:/test:ro")
    recording_arg=()
    if [ -n "$recording" ]; then
        mounts+=(-v "$recording:/recording.wav:ro")
        recording_arg=(/recording.wav)
    fi
    echo "=== .rpm, in fedora:latest"
    "$engine" run --rm "${mounts[@]}" fedora:latest \
        bash /test/test-packages.sh --inside rpm /dist "$version" "$app_version" "${recording_arg[@]}"
    echo "=== kalliope-bin.PKGBUILD, in archlinux:base-devel"
    "$engine" run --rm "${mounts[@]}" archlinux:base-devel \
        bash /test/test-packages.sh --inside arch /dist "$version" "$app_version" "${recording_arg[@]}"
else
    echo "=== .rpm and PKGBUILD: skipped (no docker or podman)"
fi
echo "All package checks passed."
