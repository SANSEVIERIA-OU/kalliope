#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Installs, runs and removes the packages that build-packages.sh made:
#   the tarball with ./install, into a temporary folder;
#   the .deb with apt, here (needs Debian or Ubuntu, and root or sudo);
#   the .rpm with dnf, in a Fedora container, and kalliope-bin.PKGBUILD with makepkg, in an
#   Arch Linux container (needs docker or podman).
#
#   packaging/linux/test-packages.sh DIST_DIR VERSION APP_VERSION [MODEL_DIR]
#
# VERSION is the one in the file names (0.1, 0.1-rc.1); APP_VERSION is what kalliope --version
# must print (tools/version.py). With MODEL_DIR (tools/fetch_assets.py model), each installed
# copy also speaks a sentence with the ONNX Runtime it brought.
set -euo pipefail

# Inside a container, this script runs one check: test-packages.sh --inside rpm|arch ...
if [ "${1:-}" = "--inside" ]; then
    inside=$2
    shift 2
else
    inside=
fi
if [ $# -lt 3 ]; then
    sed -n '3,13p' "$0" >&2
    exit 2
fi
dist=$(cd "$1" && pwd) version=$2 app_version=$3 model=${4:-}
if [ -n "$model" ]; then model=$(cd "$model" && pwd); fi
here=$(cd "$(dirname "$0")" && pwd)
sudo=$([ "$(id -u)" = 0 ] || echo sudo)

# Runs the installed programs in BIN_DIR, with ONNX Runtime at ORT_LIB.
check() {
    local bin=$1 ort=$2 out
    echo "--- $bin/kalliope --version"
    out=$("$bin/kalliope" --version)
    echo "$out"
    grep -qF "$app_version" <<<"$out" || { echo "expected $app_version" >&2; return 1; }
    echo "--- $bin/kalliope-cli phonemes ciao"
    out=$("$bin/kalliope-cli" phonemes "ciao")
    echo "$out"
    grep -q $'^ciao\t.' <<<"$out" || { echo "expected ciao and its phonemes" >&2; return 1; }
    test -f "$ort" || { echo "$ort is missing" >&2; return 1; }
    if [ -n "$model" ]; then
        echo "--- $bin/kalliope-cli say, with $ort"
        local wav
        wav=$(mktemp --suffix=.wav)
        KALLIOPE_ORT_LIB=$ort "$bin/kalliope-cli" say --model-dir "$model" -o "$wav" \
            "Ciao a tutti, mi sentite?"
        # 16-bit mono PCM: two bytes per sample after the 44-byte header.
        local rate bytes ms
        rate=$(od -An -tu4 -j24 -N4 "$wav" | tr -d ' ')
        bytes=$(stat -c %s "$wav")
        ms=$(((bytes - 44) * 500 / rate))
        rm -f "$wav"
        echo "$ms ms of speech"
        if ((ms < 700 || ms > 6000)); then
            echo "expected 0.7 to 6 seconds of speech" >&2
            return 1
        fi
    fi
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
    gone /usr/bin/kalliope /usr/bin/kalliope-cli /usr/lib/kalliope
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
    gone /usr/bin/kalliope /usr/bin/kalliope-cli /usr/lib/kalliope
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
gone "$tmp/prefix/bin/kalliope" "$tmp/prefix/lib/kalliope" "$tmp/prefix/share/doc/kalliope"

if command -v apt-get >/dev/null; then
    echo "=== .deb"
    $sudo env DEBIAN_FRONTEND=noninteractive apt-get install -y -q "$dist/kalliope-$version-amd64.deb" >/dev/null
    dpkg -s kalliope | grep -E '^(Version|Depends|Recommends):'
    check /usr/bin /usr/lib/kalliope/libonnxruntime.so.1
    $sudo env DEBIAN_FRONTEND=noninteractive apt-get remove -y -q kalliope >/dev/null
    gone /usr/bin/kalliope /usr/bin/kalliope-cli /usr/lib/kalliope
else
    echo "=== .deb: skipped (no apt-get)"
fi

engine=$(command -v docker || command -v podman || true)
if [ -n "$engine" ]; then
    mounts=(-v "$dist:/dist:ro" -v "$here:/test:ro")
    model_arg=()
    if [ -n "$model" ]; then
        mounts+=(-v "$model:/model:ro")
        model_arg=(/model)
    fi
    echo "=== .rpm, in fedora:latest"
    "$engine" run --rm "${mounts[@]}" fedora:latest \
        bash /test/test-packages.sh --inside rpm /dist "$version" "$app_version" "${model_arg[@]}"
    echo "=== kalliope-bin.PKGBUILD, in archlinux:base-devel"
    "$engine" run --rm "${mounts[@]}" archlinux:base-devel \
        bash /test/test-packages.sh --inside arch /dist "$version" "$app_version" "${model_arg[@]}"
else
    echo "=== .rpm and PKGBUILD: skipped (no docker or podman)"
fi
echo "All package checks passed."
