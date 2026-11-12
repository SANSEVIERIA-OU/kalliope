# Virtual microphone

`crates/mic` (`kalliope-mic`) makes Kalliope's synthesized speech reach Zoom, Teams, Meet,
Webex, Jitsi and any other recording app as if it came from a microphone named **Kalliope**.

## Linux (PipeWire)

The crate loads `libpipewire-0.3.so.0` at run time (no build-time dependency, no crates) and
creates a PipeWire stream whose node has `media.class = Audio/Source`, the same kind of node
`module-loopback` creates. pipewire-pulse lists it as a source, so PulseAudio apps (browsers,
Zoom) see it next to the real microphones. The stream sends F32 mono at the voice's rate
(24 kHz); PipeWire resamples to the rate of the graph.

```rust
let mic = kalliope_mic::VirtualMic::open("kalliope", "Kalliope", 24_000)?;
mic.set_monitor(true)?;          // optional: also play on the speakers
mic.play(&samples);              // returns at once
while mic.queued_seconds() > 0.0 { /* speaking */ }
mic.clear();                     // Stop button
if !mic.is_connected() { /* PipeWire restarted: open a new VirtualMic */ }
```

Behavior:

- **Like a real microphone.** Audio flows only while an app records (`in_use()`). Samples
  played while nobody records are dropped, and so is the rest of the queue when the last app
  stops, so a call never starts with stale speech.
- **Silence between utterances.** While an app records, the mic keeps delivering frames and
  fills them with silence when nothing is queued.
- **No cost when idle.** Measured over 30 s: 0 CPU and 0 wake-ups when nobody records. While
  an app records it costs about 0.26 % of one core, at 47 wake-ups a second (one per 21 ms graph
  cycle). About 6 MiB RSS (3 MiB PSS) with libpipewire loaded.
- **Realtime safe.** Samples are copied inside PipeWire's realtime thread
  (`PW_STREAM_FLAG_RT_PROCESS`). That side never blocks, allocates or frees memory; app threads
  hand it chunks through a queue the realtime side only *tries* to lock. A plain non-realtime
  stream lost whole buffers of speech under CPU load in our tests, and video calls load the CPU.
- **Monitor.** `set_monitor(true)` adds a playback stream (`Stream/Output/Audio`) to the
  default speakers. It is active only while it has audio, so the sound card can suspend.
- Latency: `node.latency = 1024/48000`, which is about 21 ms. This is PipeWire's default
  quantum, so linking the mic never makes the graph cycle faster than its default.

### Try it on a desktop

```sh
cargo run --release -p kalliope-mic --example virtual_mic -- --monitor
# then type, for example:
tone 440 2
wav kalliope.wav        # a 24 kHz file made with: kalliope-cli say -o kalliope.wav "Ciao a tutti"
```

While it runs:

- `pw-cli ls Node | grep -A3 kalliope` and `pactl list short sources` show the microphone;
- `pw-record --target kalliope test.wav` (or `parec -d kalliope --file-format=wav test.wav`)
  records it: type `tone 440 2` in the example, then play `test.wav`;
- in a browser, open a microphone test page (or a Jitsi/Meet test call), choose **Kalliope**
  as the microphone and type `wav kalliope.wav`;
- in Zoom: Settings → Audio → Microphone → Kalliope. If the voice sounds choppy, try a lower
  background-noise suppression setting (not tested yet).

### Troubleshooting

- "PipeWire is not available": libpipewire is not installed (install `pipewire` and
  `pipewire-pulse`; on PulseAudio-only systems the mic is not available yet).
- "PipeWire is not running": start it with
  `systemctl --user start pipewire pipewire-pulse wireplumber`.
- Default microphone: WirePlumber picks the source with the highest `priority.session`.
  Hardware microphones get one; Kalliope sets none, so it becomes the default only when it is the
  only microphone, or when the user selects it as the default in the system settings (WirePlumber
  remembers that choice). Otherwise pick **Kalliope** in each app.

## Windows and macOS

Not supported yet: the crate builds there, and `open` returns a clear error. A virtual audio
driver is needed on those systems.
