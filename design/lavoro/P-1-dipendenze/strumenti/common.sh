# Shared settings for the P-1 state photos.
RIG=/tmp/p1-rig
MODEL=/workspace/kalliope/materiali-locali/prove-voce/bench/models/klein/onnx
ORT=/tmp/voce-m-fetch/onnxruntime-linux-x64-1.32.0/lib/libonnxruntime.so.1.32.0
POCKET=/workspace/kalliope/materiali-locali/prove-voce/bench/voce-propria/modelli/pocket-kalliope/italian
READYENV=(KALLIOPE_MODEL_DIR=$MODEL KALLIOPE_ORT_LIB=$ORT KALLIOPE_POCKET_DIR=$POCKET KALLIOPE_VOICES_DIR=/tmp/p1-voci XDG_DATA_HOME=/tmp/p1-home/data XDG_CONFIG_HOME=/tmp/p1-home/config)
xi() { python3 -I $RIG/xinput.py "$@"; }
fresh() { rm -rf /tmp/p1-home/config /tmp/p1-home/data /tmp/p1-home/empty-data; mkdir -p /tmp/p1-home/config /tmp/p1-home/data /tmp/p1-home/empty-data; }
park() { xi move 555 330; }
