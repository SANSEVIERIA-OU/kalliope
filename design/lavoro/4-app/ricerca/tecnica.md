# Fatti tecnici per la finestra (ricerca del 26/11/2026, solo fonti ufficiali)

Raccolta fatta da `vibe-next:research` (haiku). Dove la fonte è un'estrazione automatica, la formulazione esatta va riletta prima di citarla.

## Slint
- **Ultima versione: 1.19.1** (24/11/2026), quella che il progetto usa già. https://github.com/slint-ui/slint/releases/tag/v1.19.1
- **Renderer** (https://docs.slint.dev/latest/docs/slint/guide/backends-and-renderers/backends_and_renderers/):
  - software: «text rendering currently limited to western scripts». **Non basta** per arabo, devanagari, bengali e cinese, che sono fra le 30 lingue da predisporre.
  - FemtoVG: OpenGL ES 2.0, ma «text and path rendering quality sometimes sub-optimal».
  - Skia: OpenGL, Vulkan, Metal o D3D, con un ripiego `renderer-skia-software` solo CPU; occupa molto disco.
  - L'ordine di scelta automatico di winit è Skia, poi FemtoVG, poi software. `SLINT_BACKEND=winit-skia-software` forza Skia su CPU.
- **Caratteri:** si incorporano solo TTF, TTC e OTF (`import "file.ttf"`); WOFF e WOFF2 non sono documentati. La 1.19 usa fontique per la ricerca dei caratteri. Il ripiego per scrittura non è documentato.
- **Tema chiaro o scuro:** `Palette.color-scheme` (`unknown`, `dark`, `light`). Su Linux winit legge il portale XDG Settings (`org.freedesktop.appearance` / `color-scheme`: 1 scuro, 2 chiaro) e segue `SettingChanged`. GNOME e KDE funzionano attraverso i loro portali. Sorgente: `internal/backends/winit/xdg_desktop_settings.rs` alla v1.19.1.
- **Sempre in primo piano:** la proprietà `always-on-top` di `Window` diventa `WindowLevel::AlwaysOnTop` di winit, che su Wayland è «Unsupported» (https://docs.rs/winit/0.30.13/winit/window/enum.WindowLevel.html). I manutentori GNOME confermano: «On Wayland, you simply don't have access to that behaviour». Su X11 i rapporti si contraddicono (issue #6691 aperta, discussione #5261). **Conseguenza per #17:** su GNOME e KDE con Wayland non lo può decidere l'app; lo concede il menu della finestra del sistema (Alt+Spazio, «Sempre in primo piano»), oppure una regola di KWin.
- **Scrittura su più righe:** `TextInput` ha `single-line: false`, `wrap`, `accepted` e `key-pressed` che restituisce `EventResult`. `TextEdit` inoltra `key-pressed` e non ha `accepted`. Che restituire `accept` su `Key.Return` impedisca l'a capo è un'ipotesi da provare.
- **Licenza Royalty-free 2.0, sezione 2:** il widget `AboutSlint` in una finestra «Informazioni» raggiungibile dal livello più alto, **oppure** il distintivo di Slint su una pagina pubblica, meglio quella da cui si scaricano i programmi. https://raw.githubusercontent.com/slint-ui/slint/v1.19.1/LICENSES/LicenseRef-Slint-Royalty-free-2.0.md

## Scelta del file da importare
- `rfd` **0.18.0** (07/11/2026, MIT): portale XDG predefinito, con `libdbus-1` caricata quando serve e zenity come ripiego; filtri per estensione (`*.ext`, e il portale distingue maiuscole e minuscole).
- `ashpd` **0.14.3** (21/11/2026, MIT): zbus, tokio predefinito; `FileFilter::mimetype("audio/*")`, perché il portale accetta il carattere jolly nel sottotipo.

## Un solo Kalliope aperto
- `zbus` **6.5.0** (20/11/2026, MIT): `request_name` con `DO_NOT_QUEUE`, che risponde `Exists` se un'altra istanza c'è già. Lo schema di GApplication è questo: si chiede il nome sul bus di sessione, e chi arriva secondo attiva il primo ed esce. Il backend winit di Slint porta già **zbus 5.14** su Linux, per il portale.
- La cassa `single-instance` 0.3.3 è ferma al 2021. Le altre casse sono piccole e di terzi.

## Registrare dal microfono
- La cassa `pipewire` **0.10.1** (19/08/2026, MIT) ha l'esempio `audio-capture.rs`: flusso di cattura F32LE con AUTOCONNECT e RT_PROCESS.
- `cpal` **0.18.2** (Apache-2.0): su Linux usa ALSA, PipeWire con la feature `pipewire`.
- Il progetto ha già un binding proprio a PipeWire caricato quando serve (`crates/mic`): aggiungerci la cattura evita una dipendenza nuova.

## Leggere i file audio da importare
- `symphonia` **0.6.1** (13/08/2026, MPL-2.0): legge WAV, FLAC, MP3, OGG/Vorbis e M4A/AAC-LC. **Opus no**, e Opus è il formato dei messaggi vocali di WhatsApp e Telegram. Per #16 serve un'altra strada per Opus, per esempio `libopus` caricata quando serve.
