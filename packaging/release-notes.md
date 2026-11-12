
## Which file

- **Debian 13, Ubuntu 24.04 or newer:** `kalliope-@VERSION@-amd64.deb`. Install it with
  `sudo apt install ./kalliope-@VERSION@-amd64.deb`.
- **Fedora:** `kalliope-@VERSION@-x86_64.rpm`. Install it with
  `sudo dnf install ./kalliope-@VERSION@-x86_64.rpm`.
- **Other Linux (x86_64):** `kalliope-@VERSION@-linux-x86_64.tar.gz`. Unpack it and run `./install`:
  Kalliope goes into `~/.local`, for you alone. `./install --remove` takes it away again.
- **Arch Linux:** `kalliope-bin.PKGBUILD`. Save it as `PKGBUILD` next to the `.tar.gz`, then run
  `makepkg -si`.

The first time it starts, Kalliope downloads its voice (about 53 MB).

To check what you downloaded: `sha256sum -c SHA256SUMS --ignore-missing`.
