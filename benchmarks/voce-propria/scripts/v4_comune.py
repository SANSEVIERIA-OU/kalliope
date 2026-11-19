# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""V-4: paths and the official model (current Italian release, with voice cloning).

- Code: kyutai-labs/pocket-tts main a4a6054d (18/11/2026), read from its own folder.
- Weights: kyutai/pocket-tts@3e82814a (gated, downloaded with the owner's key), languages/italian and
  italian_24l, the revision the official config pins; tokenizer from the open repository (@4e1e0a3e,
  identical file in both folders).
- Voices for the checks, each with its licence:
  - giovanni: Common Voice Italian (CC0), Kyutai's enhanced copy in kyutai/pocket-tts@64ab7d24;
  - anna (VCTK p228, CC BY 4.0), marius (Unmute voice donation, CC0), alba (Alba MacKenna, CC BY 4.0), from
    kyutai/tts-voices@323332d3;
  - Kyutai's ready states of the same voices, kyutai/pocket-tts-without-voice-cloning@a7056f50;
  - the LibriVox readers of V-m (public domain) for the internal comparison with V-1 only.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from comune import CODICE, MODELLI  # noqa: E402

REPO = CODICE / "dl-pocket-tts-a4a6054d"
GATED = MODELLI / "pocket-tts-gated"
APERTI = MODELLI / "pocket-tts-senza-clonazione"
REGISTRAZIONI = {
    "giovanni": GATED / "registrazioni-64ab7d24" / "common_voice_it_36520747-enhanced-v2.mp3",
    "anna": APERTI / "registrazioni-kyutai" / "vctk" / "p228_023_enhanced.wav",
    "marius": APERTI / "registrazioni-kyutai" / "voice-donations" / "Selfie.wav",
    "alba": APERTI / "registrazioni-kyutai" / "alba-mackenna" / "casual.wav",
}


def pronta(voce: str, strati: int = 6) -> Path:
    """Kyutai's ready state of a voice for the 6- or 24-layer model."""
    return APERTI / ("voci-attuali" if strati == 6 else "voci-attuali-24l") / f"{voce}.safetensors"


def modello(strati: int = 6, temp: float = 0.3, threads: int = 2, aperti: bool = False):
    """The official TTSModel, current Italian release, from the local files (no download)."""
    import torch
    import yaml
    torch.set_num_threads(threads)
    if str(REPO) not in sys.path:
        sys.path.insert(0, str(REPO))
    from pocket_tts.models.tts_model import TTSModel
    nome = "italian" if strati == 6 else "italian_24l"
    cfg = yaml.safe_load((REPO / "pocket_tts" / "config" / f"{nome}.yaml").read_text())
    pesi = (APERTI / nome if aperti else GATED / "languages" / nome) / "model.safetensors"
    cfg["weights_path"] = str(pesi)
    cfg.pop("weights_path_without_voice_cloning", None)
    cfg["flow_lm"]["lookup_table"]["tokenizer_path"] = str(APERTI / nome / "tokenizer.json")
    tmp = Path("/tmp/voce-m-v4cfg")
    tmp.mkdir(exist_ok=True)
    out = tmp / f"{nome}{'_aperti' if aperti else ''}.yaml"
    out.write_text(yaml.safe_dump(cfg))
    return TTSModel.load_model(config=str(out), temp=temp)
