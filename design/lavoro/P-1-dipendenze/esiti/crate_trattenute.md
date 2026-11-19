| Crate | Nel lock | Ultima | Linux | Chi lo chiede (versione richiesta) |
|---|---|---|---|---|
| allocator-api2 | 0.2.21 | 0.4.0 | sì | hashbrown 0.16.1: ^0.2.9 |
| atspi | 0.29.0 | 0.30.0 | sì | accesskit_unix 0.24.1: ^0.29 |
| atspi-common | 0.13.0 | 0.14.0 | sì | accesskit_atspi_common 0.21.1: ^0.13; atspi 0.29.0: ^0.13.0; atspi-proxies 0.13.0: ^0.13.0, ^0.13.0 (dev) |
| atspi-proxies | 0.13.0 | 0.14.0 | sì | atspi 0.29.0: ^0.13.0 |
| bincode | 2.0.1 | 3.0.0 | no | typed-index-collections 3.5.0: ^2.0.1 |
| bit-set | 0.10.0 | 0.11.1 | no | naga 30.0.2: ^0.10; wgpu-core 30.0.2: ^0.10; wgpu-hal 30.0.2: ^0.10 [cfg(windows)] |
| bit-vec | 0.9.1 | 0.10.2 | no | bit-set 0.10.0: ^0.9.1; wgpu-core 30.0.2: ^0.9.1 |
| bitflags | 1.3.2 | 2.13.2 | no | core-graphics 0.23.2: ^1.0; core-graphics-types 0.1.3: ^1.0; redox_syscall 0.4.1: ^1.1.0 |
| block2 | 0.5.1 | 0.6.2 | no | objc2-app-kit 0.2.2: ^0.5.1; objc2-cloud-kit 0.2.2: ^0.5.1; objc2-contacts 0.2.2: ^0.5.1; objc2-core-data 0.2.2: ^0.5.1; objc2-core-image 0.2.2: ^0.5.1; objc2-core-location 0.2.2: ^0.5.1; objc2-foundation 0.2.2: ^0.5.1; objc2-link-presentation 0.2.2: ^0.5.1; objc2-metal 0.2.2: ^0.5.1; objc2-quartz-core 0.2.2: ^0.5.1; objc2-ui-kit 0.2.2: ^0.5.1; objc2-uniform-type-identifiers 0.2.2: ^0.5.1; objc2-user-notifications 0.2.2: ^0.5.1; winit 0.30.13: ^0.5.1 [cfg(any(target_os = "ios", target_os = "macos"))] |
| calloop | 0.13.0 | 0.14.5 | sì | calloop-wayland-source 0.3.0: ^0.13.0; smithay-client-toolkit 0.19.2: ^0.13.0; winit 0.30.13: ^0.13.0 [cfg(all(unix, not(any(target_os = "redox", target_family = "wasm", target_os = "android", target_os = "ios", target_os = "macos"))))] |
| calloop-wayland-source | 0.3.0 | 0.4.1 | sì | smithay-client-toolkit 0.19.2: ^0.3.0 |
| color_quant | 1.1.0 | 2.0.0 | sì | gif 0.14.2: ^1.1 |
| convert_case | 0.10.0 | 0.12.0 | sì | derive_more-impl 2.1.1: ^0.10 |
| core-foundation | 0.9.4 | 0.10.1 | no | core-graphics 0.23.2: ^0.9; core-graphics-types 0.1.3: ^0.9.4; winit 0.30.13: ^0.9.3 [cfg(any(target_os = "ios", target_os = "macos"))] |
| core-graphics | 0.23.2 | 0.25.0 | no | winit 0.30.13: ^0.23.1 [cfg(target_os = "macos")] |
| core-graphics-types | 0.1.3 | 0.2.0 | no | core-graphics 0.23.2: ^0.1 |
| ctor | 0.10.1 | 1.0.14 | sì | tiny-xlib 0.2.5: ^0.10.0 |
| downcast-rs | 1.2.1 | 2.0.2 | sì | wayland-backend 0.3.17: ^1.2 |
| drm | 0.14.1 | 0.15.0 | no | i-slint-backend-linuxkms 1.19.0: ^0.14.0 [cfg(target_os = "linux")] |
| dtor | 0.8.1 | 1.0.7 | no | ctor 0.10.1: ^0.8.1 |
| float-cmp | 0.9.0 | 0.10.0 | sì | strict-num 0.1.1: ^0.9 |
| fontique | 0.12.0 | 0.13.0 | sì | i-slint-common 1.19.0: ^0.12.0; parley 0.12.0: ^0.12.0; parley_engine 0.12.0: ^0.12.0; slint-build 1.19.0: ^0.12.0 [cfg(target_os = "linux")] |
| getrandom | 0.3.4 | 0.4.3 | sì | ahash 0.8.12: ^0.3.1 |
| harfrust | 0.12.0 | 0.16.0 | sì | parley_engine 0.12.0: ^0.12.0; usvg 0.49.0: ^0.12.0 |
| hashbrown | 0.14.5 | 0.17.1 | sì | rowan 0.17.0: ^0.14.3 |
| hashbrown | 0.16.1 | 0.17.1 | sì | clru 0.6.3: ^0.16; gpu-allocator 0.28.0: ^0.16.0 |
| hermit-abi | 0.3.9 | 0.5.3 | no | io-lifetimes 1.0.11: ^0.3 [cfg(target_os = "hermit")] |
| io-lifetimes | 1.0.11 | 3.0.1 | no | udev 0.9.3: ^1.0.3 |
| jni-sys | 0.3.1 | 0.4.1 | no | ndk 0.9.0: ^0.3; ndk-sys 0.6.0+11769913: ^0.3.0 |
| libloading | 0.8.9 | 0.9.1 | sì | ash 0.38.0+1.3.281: ^0.8; clang-sys 1.9.1: ^0.8; dlib 0.5.3: >=0.7, <0.9; glutin 0.32.3: ^0.8.0; tiny-xlib 0.2.5: ^0.8.0; wgpu-hal 30.0.2: ^0.8 [cfg(not(target_arch = "wasm32"))], ^0.8 [cfg(target_os = "emscripten")]; x11rb 0.13.2: ^0.8.0 |
| libredox | 0.1.25 | 0.2.0 | no | orbclient 0.3.55: ^0.1 [cfg(target_os = "redox")] |
| linux-raw-sys | 0.4.15 | 0.12.1 | sì | rustix 0.38.44: ^0.4.14 [cfg(all(any(target_os = "android", target_os = "linux"), any(rustix_use_libc, miri, not(all(target_os = "linux", any(target_endian = "little", target_arch = "s390x"), any(target_arch = "arm", all(target_arch = "aarch64", target_pointer_width = "64"), target_arch = "riscv64", all(rustix_use_experimental_asm, target_arch = "powerpc64"), all(rustix_use_experimental_asm, target_arch = "s390x"), all(rustix_use_experimental_asm, target_arch = "mips"), all(rustix_use_experimental_asm, target_arch = "mips32r6"), all(rustix_use_experimental_asm, target_arch = "mips64"), all(rustix_use_experimental_asm, target_arch = "mips64r6"), target_arch = "x86", all(target_arch = "x86_64", target_pointer_width = "64")))))))], ^0.4.14 [cfg(all(not(rustix_use_libc), not(miri), target_os = "linux", any(target_endian = "little", target_arch = "s390x"), any(target_arch = "arm", all(target_arch = "aarch64", target_pointer_width = "64"), target_arch = "riscv64", all(rustix_use_experimental_asm, target_arch = "powerpc64"), all(rustix_use_experimental_asm, target_arch = "s390x"), all(rustix_use_experimental_asm, target_arch = "mips"), all(rustix_use_experimental_asm, target_arch = "mips32r6"), all(rustix_use_experimental_asm, target_arch = "mips64"), all(rustix_use_experimental_asm, target_arch = "mips64r6"), target_arch = "x86", all(target_arch = "x86_64", target_pointer_width = "64"))))] |
| linux-raw-sys | 0.9.4 | 0.12.1 | no | drm-sys 0.8.1: ^0.9 [cfg(any(target_os = "android", target_os = "linux"))] |
| lock_api | 0.4.14 | 0.5.0 | sì | parking_lot 0.12.5: ^0.4.14 |
| miniz_oxide | 0.8.9 | 0.9.1 | sì | png 0.18.1: ^0.8 |
| moxcms | 0.8.1 | 0.9.2 | sì | image 0.25.10: ^0.8.0 |
| nix | 0.31.4 | 0.32.0 | no | i-slint-backend-linuxkms 1.19.0: ^0.31.0 (dev), ^0.31.0 [cfg(target_os = "linux")] |
| nom | 7.1.3 | 8.0.0 | no | cexpr 0.6.0: ^7 |
| objc2 | 0.5.3 | 0.6.5 | no | accesskit_ios 0.2.2: ^0.5.1; accesskit_macos 0.27.2: ^0.5.1; block2 0.5.1: ^0.5.2; objc2-app-kit 0.2.2: ^0.5.2; objc2-cloud-kit 0.2.2: ^0.5.2; objc2-contacts 0.2.2: ^0.5.2; objc2-core-data 0.2.2: ^0.5.2; objc2-core-image 0.2.2: ^0.5.2; objc2-core-location 0.2.2: ^0.5.2; objc2-foundation 0.2.2: ^0.5.2; objc2-link-presentation 0.2.2: ^0.5.2; objc2-metal 0.2.2: ^0.5.2; objc2-quartz-core 0.2.2: ^0.5.2; objc2-symbols 0.2.2: ^0.5.2; objc2-ui-kit 0.2.2: ^0.5.2; objc2-uniform-type-identifiers 0.2.2: ^0.5.2; objc2-user-notifications 0.2.2: ^0.5.2; winit 0.30.13: ^0.5.2 [cfg(any(target_os = "ios", target_os = "macos"))] |
| objc2-app-kit | 0.2.2 | 0.3.2 | no | accesskit_macos 0.27.2: ^0.2.0; objc2-link-presentation 0.2.2: ^0.2.2 [cfg(target_os = "macos")]; winit 0.30.13: ^0.2.2 [cfg(target_os = "macos")] |
| objc2-cloud-kit | 0.2.2 | 0.3.2 | no | objc2-ui-kit 0.2.2: ^0.2.2 |
| objc2-contacts | 0.2.2 | 0.3.2 | no | objc2-core-location 0.2.2: ^0.2.2 [cfg(not(target_os = "tvos"))] |
| objc2-core-data | 0.2.2 | 0.3.2 | no | objc2-app-kit 0.2.2: ^0.2.2 [cfg(target_vendor = "apple")]; objc2-ui-kit 0.2.2: ^0.2.2 |
| objc2-core-image | 0.2.2 | 0.3.2 | no | objc2-app-kit 0.2.2: ^0.2.2 [cfg(target_vendor = "apple")]; objc2-ui-kit 0.2.2: ^0.2.2 [cfg(not(target_os = "watchos"))] |
| objc2-core-location | 0.2.2 | 0.3.2 | no | objc2-cloud-kit 0.2.2: ^0.2.2; objc2-ui-kit 0.2.2: ^0.2.2; objc2-user-notifications 0.2.2: ^0.2.2 |
| objc2-foundation | 0.2.2 | 0.3.2 | no | accesskit_ios 0.2.2: ^0.2.0; accesskit_macos 0.27.2: ^0.2.0; objc2-app-kit 0.2.2: ^0.2.2; objc2-cloud-kit 0.2.2: ^0.2.2; objc2-contacts 0.2.2: ^0.2.2; objc2-core-data 0.2.2: ^0.2.2; objc2-core-image 0.2.2: ^0.2.2; objc2-core-location 0.2.2: ^0.2.2; objc2-link-presentation 0.2.2: ^0.2.2; objc2-metal 0.2.2: ^0.2.2; objc2-quartz-core 0.2.2: ^0.2.2; objc2-symbols 0.2.2: ^0.2.2; objc2-ui-kit 0.2.2: ^0.2.2; objc2-uniform-type-identifiers 0.2.2: ^0.2.2; objc2-user-notifications 0.2.2: ^0.2.2; winit 0.30.13: ^0.2.2 [cfg(target_os = "ios")], ^0.2.2 [cfg(target_os = "macos")] |
| objc2-link-presentation | 0.2.2 | 0.3.2 | no | objc2-ui-kit 0.2.2: ^0.2.2 [cfg(not(target_os = "watchos"))] |
| objc2-metal | 0.2.2 | 0.3.2 | no | objc2-core-image 0.2.2: ^0.2.2; objc2-quartz-core 0.2.2: ^0.2.2 |
| objc2-quartz-core | 0.2.2 | 0.3.2 | no | objc2-app-kit 0.2.2: ^0.2.2 [cfg(target_vendor = "apple")]; objc2-ui-kit 0.2.2: ^0.2.2 [cfg(not(target_os = "watchos"))] |
| objc2-symbols | 0.2.2 | 0.3.2 | no | objc2-ui-kit 0.2.2: ^0.2.2 |
| objc2-ui-kit | 0.2.2 | 0.3.2 | no | accesskit_ios 0.2.2: ^0.2.0; winit 0.30.13: ^0.2.2 [cfg(target_os = "ios")] |
| objc2-uniform-type-identifiers | 0.2.2 | 0.3.2 | no | objc2-ui-kit 0.2.2: ^0.2.2 |
| objc2-user-notifications | 0.2.2 | 0.3.2 | no | objc2-ui-kit 0.2.2: ^0.2.2 |
| orbclient | 0.3.55 | 0.4.6 | no | winit 0.30.13: ^0.3.47 [cfg(target_os = "redox")] |
| parking_lot | 0.12.5 | 0.13.0 | sì | arboard 3.7.0: ^0.12 [cfg(all(unix, not(any(target_os="macos", target_os="android", target_os="emscripten"))))]; wgpu-core 30.0.2: ^0.12.3; wgpu-hal 30.0.2: ^0.12.3 |
| parking_lot_core | 0.9.12 | 0.10.0 | sì | parking_lot 0.12.5: ^0.9.12 |
| parley | 0.12.0 | 0.13.0 | sì | i-slint-core 1.19.0: ^0.12.0 [cfg(not(target_arch = "wasm32"))], ^0.12.0 [cfg(target_arch = "wasm32")] |
| parley_data | 0.12.0 | 0.13.0 | sì | parley_engine 0.12.0: ^0.12.0 |
| parley_emoji | 0.12.0 | 0.13.0 | sì | parley_engine 0.12.0: ^0.12.0 |
| parley_engine | 0.12.0 | 0.13.0 | sì | parley 0.12.0: ^0.12.0 |
| quick-xml | 0.41.0 | 0.42.0 | sì | wayland-scanner 0.31.11: ^0.41 |
| r-efi | 5.3.0 | 7.2.0 | no | getrandom 0.3.4: ^5.1 [cfg(all(target_os = "uefi", getrandom_backend = "efi_rng"))] |
| r-efi | 6.0.0 | 7.2.0 | no | getrandom 0.4.3: ^6 [cfg(all(target_os = "uefi", getrandom_backend = "efi_rng"))] |
| read-fonts | 0.41.0 | 0.47.0 | sì | fontique 0.12.0: ^0.41.0; harfrust 0.12.0: ^0.41.0; i-slint-renderer-skia 1.19.0: ^0.41 [cfg(target_vendor = "apple")]; skrifa 0.44.0: ^0.41.0, ^0.41.0 (dev); write-fonts 0.50.0: ^0.41.0, ^0.41.0 (dev) |
| redox_syscall | 0.4.1 | 0.9.5 | no | winit 0.30.13: ^0.4.1 [cfg(target_os = "redox")] |
| redox_syscall | 0.5.18 | 0.9.5 | no | parking_lot_core 0.9.12: ^0.5 [cfg(target_os = "redox")]; softbuffer 0.4.8: ^0.5 [cfg(target_os = "redox")] |
| resvg | 0.49.0 | 0.50.0 | sì | i-slint-common 1.19.0: ^0.49.0; i-slint-compiler 1.19.0: ^0.49.0; i-slint-core 1.19.0: ^0.49.0 |
| rustc-hash | 1.1.0 | 2.1.3 | sì | naga 30.0.2: ^1.1; naga-types 30.0.2: ^1.1; rowan 0.17.0: ^1.0.1; wgpu-core 30.0.2: ^1.1 |
| rustix | 0.38.44 | 1.1.6 | sì | calloop 0.13.0: ^0.38, ^0.38 (dev); calloop-wayland-source 0.3.0: ^0.38.4; drm 0.14.1: ^0.38.22, ^0.38.22 (dev); smithay-client-toolkit 0.19.2: ^0.38.15; winit 0.30.13: ^0.38.4 [cfg(all(unix, not(any(target_os = "redox", target_family = "wasm", target_os = "android", target_os = "ios", target_os = "macos"))))] |
| sctk-adwaita | 0.10.1 | 0.12.0 | sì | winit 0.30.13: ^0.10.1 [cfg(all(unix, not(any(target_os = "redox", target_family = "wasm", target_os = "android", target_os = "ios", target_os = "macos"))))] |
| skrifa | 0.44.0 | 0.50.0 | sì | i-slint-common 1.19.0: ^0.44; i-slint-compiler 1.19.0: ^0.44; i-slint-core 1.19.0: ^0.44; i-slint-renderer-software 1.19.0: ^0.44; parley_engine 0.12.0: ^0.44.0; swash 0.2.10: >=0.31.1, <=0.44; usvg 0.49.0: ^0.44 |
| smithay-client-toolkit | 0.19.2 | 0.21.1 | sì | sctk-adwaita 0.10.1: ^0.19.0; winit 0.30.13: ^0.19.2 [cfg(all(unix, not(any(target_os = "redox", target_family = "wasm", target_os = "android", target_os = "ios", target_os = "macos"))))] |
| smithay-client-toolkit | 0.20.0 | 0.21.1 | sì | smithay-clipboard 0.7.3: ^0.20.0, ^0.20.0 (dev) |
| smol_str | 0.2.2 | 0.3.7 | sì | winit 0.30.13: ^0.2.0 |
| snafu | 0.8.9 | 0.9.2 | sì | rspolib 0.1.2: ^0.8 |
| snafu-derive | 0.8.9 | 0.9.2 | sì | snafu 0.8.9: ^0.8.9 |
| strict-num | 0.1.1 | 0.2.0 | sì | tiny-skia-path 0.11.4: ^0.1; tiny-skia-path 0.12.0: ^0.1; usvg 0.49.0: ^0.1.1 |
| syn | 2.0.119 | 3.0.10 | sì | derive_more-impl 2.1.1: ^2.0.45; enumflags2_derive 0.7.12: ^2.0; jni-macros 0.22.4: ^2.0; jni-sys-macros 0.4.1: ^2; num_enum_derive 0.7.6: ^2, ^2 (dev); phf_macros 0.14.0: ^2; pin-project-internal 1.1.13: ^2.0.1; snafu-derive 0.8.9: ^2.0; strum_macros 0.28.0: ^2.0; thiserror-impl 1.0.69: ^2.0.87; tracing-attributes 0.1.31: ^2.0; windows-implement 0.60.2: ^2.0; windows-interface 0.59.3: ^2.0; zbus-lockstep-macros 0.5.2: ^2.0; zerocopy-derive 0.8.63: ^2.0.46, ^2.0.46 (dev) |
| thiserror | 1.0.69 | 2.0.21 | sì | calloop 0.13.0: ^1.0.7; ndk 0.9.0: ^1.0.23; smithay-client-toolkit 0.19.2: ^1.0.30 |
| thiserror-impl | 1.0.69 | 2.0.21 | sì | thiserror 1.0.69: =1.0.69 |
| tiny-skia | 0.11.4 | 0.12.0 | sì | sctk-adwaita 0.10.1: ^0.11 |
| tiny-skia-path | 0.11.4 | 0.12.0 | sì | tiny-skia 0.11.4: ^0.11.4 |
| unty | 0.0.4 | 0.0.5 | no | bincode 2.0.1: ^0.0.4 |
| usvg | 0.49.0 | 0.50.0 | sì | resvg 0.49.0: ^0.49.0 |
| wasip2 | 1.0.4+wasi-0.2.12 | 2.0.1+wasi-0.2.12 | no | getrandom 0.3.4: ^1 [cfg(all(target_arch = "wasm32", target_os = "wasi", target_env = "p2"))] |
| wayland-protocols-experimental | 20250721.0.1 | 20251230.0.3 | sì | smithay-client-toolkit 0.20.0: ^20250721.0.1 |
| weezl | 0.1.12 | 0.2.1 | sì | gif 0.14.2: ^0.1.10 |
| windows-collections | 0.3.2 | 0.100.0 | no | windows 0.62.2: ^0.3.2 |
| windows-core | 0.62.2 | 0.100.0 | no | accesskit_windows 0.35.2: ^0.62.0; fontique 0.12.0: ^0.62.2 [cfg(target_os = "windows")]; i-slint-renderer-skia 1.19.0: ^0.62.0 [cfg(target_family = "windows")]; iana-time-zone 0.1.65: >=0.56, <=0.62 [cfg(target_os = "windows")]; wgpu-hal 30.0.2: ^0.62 [cfg(windows)]; windows 0.62.2: ^0.62.2; windows-collections 0.3.2: ^0.62.2; windows-future 0.3.2: ^0.62.2; windows-numerics 0.3.1: ^0.62.2 |
| windows-future | 0.3.2 | 0.100.0 | no | windows 0.62.2: ^0.3.2 |
| windows-implement | 0.60.2 | 0.100.0 | no | windows-core 0.62.2: ^0.60.2 |
| windows-interface | 0.59.3 | 0.100.0 | no | windows-core 0.62.2: ^0.59.3 |
| windows-link | 0.2.1 | 0.100.0 | no | chrono 0.4.45: ^0.2 [cfg(windows)]; gethostname 1.1.0: ^0.2.1 [cfg(windows)]; jni 0.22.4: ^0.2 [cfg(windows)]; libloading 0.8.9: ^0.2 [cfg(windows)]; parking_lot_core 0.9.12: ^0.2.0 [cfg(windows)]; windows-core 0.62.2: ^0.2.1; windows-future 0.3.2: ^0.2.1; windows-numerics 0.3.1: ^0.2.1; windows-result 0.4.1: ^0.2.1; windows-strings 0.5.1: ^0.2.1; windows-sys 0.61.2: ^0.2.1; windows-threading 0.2.1: ^0.2.1 |
| windows-numerics | 0.3.1 | 0.100.0 | no | windows 0.62.2: ^0.3.1 |
| windows-result | 0.4.1 | 0.100.0 | no | windows-core 0.62.2: ^0.4.1 |
| windows-strings | 0.5.1 | 0.100.0 | no | windows-core 0.62.2: ^0.5.1 |
| windows-sys | 0.48.0 | 0.61.2 | no | io-lifetimes 1.0.11: ^0.48.0 [cfg(windows)] |
| windows-sys | 0.52.0 | 0.61.2 | no | glutin 0.32.3: ^0.52 [cfg(windows)]; glutin_egl_sys 0.7.1: ^0.52 [cfg(windows)]; winit 0.30.13: ^0.52.0 [cfg(target_os = "windows")] |
| windows-sys | 0.59.0 | 0.61.2 | no | rustix 0.38.44: >=0.52, <=0.59 [cfg(windows)] |
| windows-targets | 0.48.5 | 0.53.5 | no | windows-sys 0.48.0: ^0.48.0 |
| windows-targets | 0.52.6 | 0.53.5 | no | windows-sys 0.52.0: ^0.52.0; windows-sys 0.59.0: ^0.52.6 |
| windows-threading | 0.2.1 | 0.100.0 | no | windows-future 0.3.2: ^0.2.1 |
| windows_aarch64_gnullvm | 0.48.5 | 0.53.1 | no | windows-targets 0.48.5: ^0.48.5 [aarch64-pc-windows-gnullvm] |
| windows_aarch64_gnullvm | 0.52.6 | 0.53.1 | no | windows-targets 0.52.6: ^0.52.6 [aarch64-pc-windows-gnullvm] |
| windows_aarch64_msvc | 0.48.5 | 0.53.1 | no | windows-targets 0.48.5: ^0.48.5 [cfg(all(target_arch = "aarch64", target_env = "msvc", not(windows_raw_dylib)))] |
| windows_aarch64_msvc | 0.52.6 | 0.53.1 | no | windows-targets 0.52.6: ^0.52.6 [cfg(all(target_arch = "aarch64", target_env = "msvc", not(windows_raw_dylib)))] |
| windows_i686_gnu | 0.48.5 | 0.53.1 | no | windows-targets 0.48.5: ^0.48.5 [cfg(all(target_arch = "x86", target_env = "gnu", not(windows_raw_dylib)))] |
| windows_i686_gnu | 0.52.6 | 0.53.1 | no | windows-targets 0.52.6: ^0.52.6 [cfg(all(target_arch = "x86", target_env = "gnu", not(target_abi = "llvm"), not(windows_raw_dylib)))] |
| windows_i686_gnullvm | 0.52.6 | 0.53.1 | no | windows-targets 0.52.6: ^0.52.6 [i686-pc-windows-gnullvm] |
| windows_i686_msvc | 0.48.5 | 0.53.1 | no | windows-targets 0.48.5: ^0.48.5 [cfg(all(target_arch = "x86", target_env = "msvc", not(windows_raw_dylib)))] |
| windows_i686_msvc | 0.52.6 | 0.53.1 | no | windows-targets 0.52.6: ^0.52.6 [cfg(all(target_arch = "x86", target_env = "msvc", not(windows_raw_dylib)))] |
| windows_x86_64_gnu | 0.48.5 | 0.53.1 | no | windows-targets 0.48.5: ^0.48.5 [cfg(all(target_arch = "x86_64", target_env = "gnu", not(target_abi = "llvm"), not(windows_raw_dylib)))] |
| windows_x86_64_gnu | 0.52.6 | 0.53.1 | no | windows-targets 0.52.6: ^0.52.6 [cfg(all(target_arch = "x86_64", target_env = "gnu", not(target_abi = "llvm"), not(windows_raw_dylib)))] |
| windows_x86_64_gnullvm | 0.48.5 | 0.53.1 | no | windows-targets 0.48.5: ^0.48.5 [x86_64-pc-windows-gnullvm] |
| windows_x86_64_gnullvm | 0.52.6 | 0.53.1 | no | windows-targets 0.52.6: ^0.52.6 [x86_64-pc-windows-gnullvm] |
| windows_x86_64_msvc | 0.48.5 | 0.53.1 | no | windows-targets 0.48.5: ^0.48.5 [cfg(all(target_arch = "x86_64", target_env = "msvc", not(windows_raw_dylib)))] |
| windows_x86_64_msvc | 0.52.6 | 0.53.1 | no | windows-targets 0.52.6: ^0.52.6 [cfg(all(any(target_arch = "x86_64", target_arch = "arm64ec"), target_env = "msvc", not(windows_raw_dylib)))] |
| wit-bindgen | 0.57.1 | 0.63.0 | no | wasip2 1.0.4+wasi-0.2.12: ^0.57.1 |
| write-fonts | 0.50.0 | 0.56.0 | no | i-slint-renderer-skia 1.19.0: ^0.50 [cfg(target_vendor = "apple")] |
| x11rb | 0.13.2 | 0.14.0 | sì | arboard 3.7.0: ^0.13 [cfg(all(unix, not(any(target_os="macos", target_os="android", target_os="emscripten"))))]; softbuffer 0.4.8: ^0.13.0 [cfg(not(any(target_os = "android", target_vendor = "apple", target_os = "redox", target_family = "wasm", target_os = "windows")))]; winit 0.30.13: ^0.13.0 [cfg(all(unix, not(any(target_os = "redox", target_family = "wasm", target_os = "android", target_os = "ios", target_os = "macos"))))] |
| x11rb-protocol | 0.13.2 | 0.14.0 | sì | x11rb 0.13.2: ^0.13.2 |
| xml-rs | 0.8.29 | 1.0.0 | no | gl_generator 0.14.0: ^0.8 |
| zbus | 5.19.0 | 6.3.0 | sì | accesskit_unix 0.24.1: ^5.19; atspi-common 0.13.0: ^5.5, ^5.5 (dev); atspi-proxies 0.13.0: ^5.5; i-slint-backend-winit 1.19.0: ^5.14.0 [cfg(not(any(target_family = "windows", target_vendor = "apple", target_arch = "wasm32", target_os = "android")))] |
| zbus-lockstep | 0.5.2 | 0.8.0 | sì | atspi-common 0.13.0: ^0.5.1; zbus-lockstep-macros 0.5.2: ^0.5.2 |
| zbus-lockstep-macros | 0.5.2 | 0.8.0 | sì | atspi-common 0.13.0: ^0.5.1 |
| zbus_macros | 5.19.0 | 6.3.0 | sì | zbus 5.19.0: ^5.19.0 |
| zbus_xml | 5.2.1 | 6.0.0 | sì | zbus-lockstep 0.5.2: ^5.0.2; zbus-lockstep-macros 0.5.2: ^5.0.2 |
