# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
# Packs the files that packaging/linux/build-packages.sh has already built and put in
# the staging folder; nothing is compiled here.

Name:           kalliope
Version:        %{pkg_version}
Release:        1
Summary:        Type, and be heard in video calls
License:        LicenseRef-SANSEVIERIA-1.1
URL:            https://github.com/SANSEVIERIA-OU/kalliope
ExclusiveArch:  x86_64

# Linked libraries (glibc, libgcc, fontconfig, and libstdc++ for ONNX Runtime) are found by rpm.
# Loaded at run time for the window, all required: it falls back to X11 where Wayland is missing, and a missing X11 library stops it.
Requires:       libxkbcommon%{?_isa}
Requires:       libxkbcommon-x11%{?_isa}
Requires:       libwayland-client%{?_isa}
Requires:       libX11%{?_isa}
Requires:       libX11-xcb%{?_isa}
Requires:       libXcursor%{?_isa}
Requires:       libXi%{?_isa}
# The virtual microphone, and recording a personal voice.
Recommends:     pipewire-libs%{?_isa}
# Making a personal voice from Opus voice messages (WhatsApp, Telegram).
Recommends:     opus%{?_isa}

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
microphone that any call app can select. The voice is made on your computer,
with the voice models that come in this package: nothing is downloaded.

%install
cp -a %{staging}/. %{buildroot}/

%files
/usr/bin/kalliope
/usr/bin/kalliope-cli
/usr/lib/kalliope/
/usr/share/kalliope/
/usr/share/applications/io.github.sansevieria_ou.kalliope.desktop
/usr/share/icons/hicolor/scalable/apps/io.github.sansevieria_ou.kalliope.svg
/usr/share/icons/hicolor/symbolic/apps/io.github.sansevieria_ou.kalliope-symbolic.svg
/usr/share/icons/hicolor/48x48/apps/io.github.sansevieria_ou.kalliope.png
/usr/share/icons/hicolor/256x256/apps/io.github.sansevieria_ou.kalliope.png
/usr/share/metainfo/io.github.sansevieria_ou.kalliope.metainfo.xml
%dir /usr/share/doc/kalliope
%license /usr/share/doc/kalliope/LICENSE
%license /usr/share/doc/kalliope/onnxruntime/
%license /usr/share/doc/kalliope/skia/
%license /usr/share/doc/kalliope/klein-tts/
%license /usr/share/doc/kalliope/pocket-tts/
%license /usr/share/doc/kalliope/THIRD_PARTY_LICENSES.txt
%doc /usr/share/doc/kalliope/NOTICE
%doc /usr/share/doc/kalliope/THIRD_PARTY_NOTICES.md
%doc /usr/share/doc/kalliope/CHANGELOG.md
