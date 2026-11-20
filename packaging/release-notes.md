
## Which file

- **Debian 13, Ubuntu 24.04 or newer:** `kalliope-@VERSION@-amd64.deb`. Install it with `sudo apt install ./kalliope-@VERSION@-amd64.deb`.
- **Fedora:** `kalliope-@VERSION@-x86_64.rpm`. Install it with `sudo dnf install ./kalliope-@VERSION@-x86_64.rpm`.
- **Other Linux (x86_64):** `kalliope-@VERSION@-linux-x86_64.tar.gz`. Unpack it and run `./install`: Kalliope goes into `~/.local`, for you alone. `./install --remove` takes it away again.
- **Arch Linux:** `kalliope-bin` on AUR, https://aur.archlinux.org/packages/kalliope-bin, which this release updates. Or `kalliope-bin.PKGBUILD` from here: save it as `PKGBUILD` next to the `.tar.gz`, then run `makepkg -si`.

The voices come inside the packages, Giulia and Marco as well as the model that speaks with a voice prepared from a recording: once installed, Kalliope downloads nothing.

To check what you downloaded: `sha256sum -c SHA256SUMS --ignore-missing`.
