#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Makes Kalliope's Linux x86_64 packages from a release build:
#   kalliope-VERSION-linux-x86_64.tar.gz, kalliope-VERSION-amd64.deb, kalliope-VERSION-x86_64.rpm
#   and kalliope-bin.PKGBUILD (packaging/aur/PKGBUILD with the tarball's checksum).
#
#   packaging/linux/build-packages.sh VERSION BIN_DIR ORT_LIB OUT_DIR
#
# VERSION is what people see: 0.1, or 0.1-rc.1 for a prerelease. BIN_DIR holds kalliope and
# kalliope-cli (target/release). ORT_LIB is libonnxruntime.so.X.Y.Z, from tools/fetch_assets.py.
# Needs dpkg-deb, dpkg-shlibdeps (dpkg-dev) and rpmbuild (rpm).
set -euo pipefail

if [ $# -ne 4 ]; then
    sed -n '3,11p' "$0" >&2
    exit 2
fi
version=$1 bin_dir=$2 ort_lib=$3 out=$4
root=$(cd "$(dirname "$0")/../.." && pwd)
id=io.github.sansevieria_ou.kalliope
# Debian and RPM sort a tilde before everything else, so 0.1~rc.1 comes before 0.1.
package_version=${version/-/\~}

for program in kalliope kalliope-cli; do
    if [ ! -x "$bin_dir/$program" ]; then
        echo "build-packages.sh: $bin_dir/$program is missing; build it with cargo build --release" >&2
        exit 1
    fi
done
ort_dir=$(dirname "$(dirname "$ort_lib")")
ort_name=$(basename "$ort_lib")
if [[ ! -f $ort_lib || $ort_name != libonnxruntime.so.*.*.* || ! -f $ort_dir/LICENSE ]]; then
    echo "build-packages.sh: $ort_lib is not an ONNX Runtime library from its release archive" >&2
    exit 1
fi

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
mkdir -p "$out"
out=$(cd "$out" && pwd)
# Same input, same files: timestamps come from the last commit.
export SOURCE_DATE_EPOCH=${SOURCE_DATE_EPOCH:-$(git -C "$root" log -1 --format=%ct 2>/dev/null || date +%s)}

# The installed files, laid out under PREFIX as the .deb and .rpm install them into /usr.
# ONNX Runtime goes to PREFIX/LIBDIR: lib/kalliope for the packages, lib for the tarball. The
# app looks for it next to itself in ../lib/kalliope, then ../lib.
stage() {
    local prefix=$1 libdir=$2
    install -Dm755 -t "$prefix/bin" "$bin_dir/kalliope" "$bin_dir/kalliope-cli"
    install -Dm755 "$ort_lib" "$prefix/$libdir/$ort_name"
    ln -s "$ort_name" "$prefix/$libdir/libonnxruntime.so.1"
    install -Dm644 -t "$prefix/share/applications" "$root/packaging/linux/$id.desktop"
    install -Dm644 -t "$prefix/share/icons/hicolor/scalable/apps" "$root/packaging/linux/$id.svg"
    install -Dm644 -t "$prefix/share/metainfo" "$root/packaging/linux/$id.metainfo.xml"
    install -Dm644 -t "$prefix/share/doc/kalliope" \
        "$root/LICENSE" "$root/NOTICE" "$root/THIRD_PARTY_NOTICES.md" "$root/CHANGELOG.md"
    # ONNX Runtime is MIT-licensed and bundles other code: its notices travel with it.
    install -Dm644 -t "$prefix/share/doc/kalliope/onnxruntime" \
        "$ort_dir/LICENSE" "$ort_dir/ThirdPartyNotices.txt"
}

# Tarball, with ./install for ~/.local.
name=kalliope-$version-linux-x86_64
stage "$work/$name" lib
install -Dm755 "$root/packaging/linux/install" "$work/$name/install"
tar -C "$work" --sort=name --owner=0 --group=0 --numeric-owner --mtime="@$SOURCE_DATE_EPOCH" \
    -cf - "$name" | gzip -9n > "$out/$name.tar.gz"

# .deb, with dpkg-deb. Linked libraries come from dpkg-shlibdeps; the ones loaded at run time
# are listed by hand (see docs/releasing.md for how they were found), and so is curl, which the
# app runs to download the voice.
deb=$work/debian/kalliope
stage "$deb/usr" lib/kalliope
mkdir -p "$deb/DEBIAN"
printf 'Source: kalliope\n\nPackage: kalliope\nArchitecture: amd64\n' > "$work/debian/control"
shlibs=$(cd "$work" && dpkg-shlibdeps -O -xkalliope \
    -e"$deb/usr/bin/kalliope" -e"$deb/usr/bin/kalliope-cli" -e"$deb/usr/lib/kalliope/$ort_name" \
    2> >(grep -v -e 'RPATH' -e 'diversion' >&2) | sed -n 's/^shlibs:Depends=//p')
if [ -z "$shlibs" ]; then
    echo "build-packages.sh: dpkg-shlibdeps found no dependencies" >&2
    exit 1
fi
(cd "$deb" && find usr -type f -print0 | sort -z | xargs -0 md5sum) > "$deb/DEBIAN/md5sums"
cat > "$deb/DEBIAN/control" <<EOF
Package: kalliope
Version: $package_version
Architecture: amd64
Maintainer: Kalliope contributors <https://github.com/SANSEVIERIA-OU/kalliope/issues>
Installed-Size: $(du -sk --exclude=DEBIAN "$deb" | cut -f1)
Depends: $shlibs, libxkbcommon0, libwayland-client0 | libx11-6, curl
Recommends: libpipewire-0.3-0t64 | libpipewire-0.3-0, libwayland-client0, libx11-6, libx11-xcb1, libxcb1, libxcursor1, libxi6, libxkbcommon-x11-0
Section: sound
Priority: optional
Homepage: https://github.com/SANSEVIERIA-OU/kalliope
Description: Type, and be heard in video calls
 Kalliope is for people who cannot speak, or find speaking hard. What you type
 during a video call is spoken aloud with a natural voice, through a virtual
 microphone that any call app can select. The voice is made on your computer;
 it is downloaded once, the first time Kalliope starts.
EOF
dpkg-deb --root-owner-group -Zxz --build "$deb" "$out/kalliope-$version-amd64.deb" >/dev/null

# .rpm, with rpmbuild and packaging/linux/kalliope.spec.
stage "$work/rpm-root/usr" lib/kalliope
rpmbuild -bb --quiet --nodeps --target x86_64 \
    --define "_topdir $work/rpmbuild" \
    --define "pkg_version $package_version" \
    --define "staging $work/rpm-root" \
    --define "use_source_date_epoch_as_buildtime 1" \
    --define "clamp_mtime_to_source_date_epoch 1" \
    "$root/packaging/linux/kalliope.spec"
mv "$work"/rpmbuild/RPMS/x86_64/kalliope-*.rpm "$out/kalliope-$version-x86_64.rpm"

# The AUR recipe for this tarball. pkgver cannot contain "-": 0.1-rc.1 becomes 0.1_rc.1.
sha=$(sha256sum "$out/$name.tar.gz" | cut -d' ' -f1)
sed -e "s/^pkgver=.*/pkgver=${version//-/_}/" -e "s/^sha256sums=.*/sha256sums=('$sha')/" \
    "$root/packaging/aur/PKGBUILD" > "$out/kalliope-bin.PKGBUILD"

ls -l "$out"
