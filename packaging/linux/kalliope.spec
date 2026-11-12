# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Packs the files that packaging/linux/build-packages.sh has already built and put in
# the staging folder; nothing is compiled here.

Name:           kalliope
Version:        %{pkg_version}
Release:        1
Summary:        Type, and be heard in video calls
License:        LicenseRef-SANSEVIERIA-1.0
URL:            https://github.com/SANSEVIERIA-OU/kalliope
ExclusiveArch:  x86_64

# Linked libraries (glibc, libgcc, fontconfig, and libstdc++ for ONNX Runtime) are found by rpm.
# These are loaded at run time: xkbcommon always, then Wayland or X11 for the window.
Requires:       libxkbcommon%{?_isa}
Requires:       (libwayland-client%{?_isa} or libX11%{?_isa})
# The app runs curl to download the voice; curl or curl-minimal provides it.
Requires:       /usr/bin/curl
# The virtual microphone.
Recommends:     pipewire-libs%{?_isa}
Recommends:     libwayland-client%{?_isa}
Recommends:     libX11%{?_isa}
Recommends:     libX11-xcb%{?_isa}
Recommends:     libXcursor%{?_isa}
Recommends:     libXi%{?_isa}
Recommends:     libxkbcommon-x11%{?_isa}

# Already built, stripped and linked: no debug package, no post-processing, no build-id links
# (another package with the same ONNX Runtime build would otherwise conflict).
%global debug_package %{nil}
%global __os_install_post %{nil}
%global _build_id_links none
# The private ONNX Runtime must not be offered to other packages, nor required from them.
%global __provides_exclude_from ^/usr/lib/kalliope/.*$
%global __requires_exclude ^libonnxruntime\\.so.*$

%description
Kalliope is for people who cannot speak, or find speaking hard. What you type
during a video call is spoken aloud with a natural voice, through a virtual
microphone that any call app can select. The voice is made on your computer;
it is downloaded once, the first time Kalliope starts.

%install
cp -a %{staging}/. %{buildroot}/

%files
/usr/bin/kalliope
/usr/bin/kalliope-cli
/usr/lib/kalliope/
/usr/share/applications/io.github.sansevieria_ou.kalliope.desktop
/usr/share/icons/hicolor/scalable/apps/io.github.sansevieria_ou.kalliope.svg
/usr/share/metainfo/io.github.sansevieria_ou.kalliope.metainfo.xml
%dir /usr/share/doc/kalliope
%license /usr/share/doc/kalliope/LICENSE
%license /usr/share/doc/kalliope/onnxruntime/
%license /usr/share/doc/kalliope/THIRD_PARTY_LICENSES.txt
%doc /usr/share/doc/kalliope/NOTICE
%doc /usr/share/doc/kalliope/THIRD_PARTY_NOTICES.md
%doc /usr/share/doc/kalliope/CHANGELOG.md
