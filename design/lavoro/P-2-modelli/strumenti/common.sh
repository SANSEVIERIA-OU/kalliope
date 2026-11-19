# Shared settings for the P-2 state photos (copied from P-1's rig: Xvfb :138, Weston p2-wayland, private PipeWire).
RIG=/tmp/p2-rig
A=/tmp/p2-assets
# Before (the program of 7369a80, P-1's release build): the models come from variables, as in P-1's photos.
# (env(1) takes its -u options before the assignments.)
PRIMAENV=(-u KALLIOPE_VOICES_DIR KALLIOPE_MODEL_DIR=$A/klein-tts-x1.5-pro-25e0e73
  KALLIOPE_ORT_LIB=$A/onnxruntime-linux-x64-1.32.0/lib/libonnxruntime.so.1.32.0
  KALLIOPE_POCKET_DIR=$A/pocket-tts-italian-3e82814 XDG_DATA_HOME=/tmp/p2-home/data XDG_CONFIG_HOME=/tmp/p2-home/config)
# After (the installed program): no KALLIOPE_* variable, as people run it.
DOPOENV=(-u KALLIOPE_MODEL_DIR -u KALLIOPE_ORT_LIB -u KALLIOPE_POCKET_DIR -u KALLIOPE_VOICES_DIR
  XDG_DATA_HOME=/tmp/p2-home/data XDG_CONFIG_HOME=/tmp/p2-home/config)
xi() { python3 -I $RIG/xinput.py "$@"; }
# A new home: settings empty, and the voice prepared from giovanni's CC0 recording in the data folder.
fresh() {
  rm -rf /tmp/p2-home/config /tmp/p2-home/data /tmp/p2-home/empty-data
  mkdir -p /tmp/p2-home/config /tmp/p2-home/data/kalliope/voices /tmp/p2-home/empty-data
  cp /tmp/p2-parity/new-giovanni.safetensors /tmp/p2-home/data/kalliope/voices/giovanni.safetensors
}
park() { xi move 555 330; }
