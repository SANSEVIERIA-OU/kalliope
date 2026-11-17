# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Cut the test people out of LibriVox chapters (public domain).

For each person: a reference of 22-30 s from chapter A (the only audio the strategies may see),
and from chapter B (another recording session) four held-out clips of 6-12 s, used as the
target of every similarity measure, plus five sentence-length clips of 2.5-6.5 s for the
"person against herself" baseline. Cuts fall in pauses found from the frame energy.
Two references (one woman, one man) are also ruined like an old phone recording.

Usage: python -I prepara_persone.py   (reads the MP3s downloaded into DATA/scaricati)
"""
from __future__ import annotations

import io
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402
from scipy.signal import butter, sosfilt  # noqa: E402

from comune import DATA, ESITI, PERSONE, SR, leggi, ricampiona, scrivi  # noqa: E402

DL = DATA / "scaricati"
FONTI = {
    "F1": {"lettore": "Enrica Giampieretti", "opera": "Grazia Deledda, «Canne al vento»",
           "item": "canne_al_vento_1609_librivox",
           "a": "cannealvento_01_deledda.mp3", "b": "cannealvento_02_deledda.mp3",
           "licenza": "pubblico dominio (LibriVox; archive.org: Public Domain Mark 1.0)"},
    "F2": {"lettore": "Claudia Caldi", "opera": "Scipio Sighele, «La crisi dell'infanzia e la delinquenza dei minorenni»",
           "item": "lacrisidellinfanzi_2405_librivox",
           "a": "crisidellinfanzia_01_sighele.mp3", "b": "crisidellinfanzia_02_sighele.mp3",
           "licenza": "pubblico dominio (LibriVox; archive.org: Public Domain Mark 1.0)"},
    "M1": {"lettore": "Riccardo Fasol", "opera": "Luigi Pirandello, «Il fu Mattia Pascal»",
           "item": "mattia_pascal_1012_librivox",
           "a": "mattiapascal_01_pirandello.mp3", "b": "mattiapascal_02_pirandello.mp3",
           "licenza": "pubblico dominio (LibriVox; archive.org: Public Domain Mark 1.0)"},
    "M2": {"lettore": "Renzo Clerico", "opera": "Niccolò Machiavelli, «Il Principe»",
           "item": "il_principe_1711_librivox",
           "a": "ilprincipe_01_machiavelli.mp3", "b": "ilprincipe_02_machiavelli.mp3",
           "licenza": "pubblico dominio (LibriVox; archive.org: Public Domain Mark 1.0)"},
}
HOP = 0.01  # s


def pause(a: np.ndarray) -> tuple[np.ndarray, float]:
    """Boolean per 10 ms frame: True where the frame is a pause (well below speech level)."""
    n = int(HOP * SR)
    fr = a[: len(a) // n * n].reshape(-1, n)
    db = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
    speech = np.percentile(db, 90)
    return db < speech - 35, speech


def segmenti(a: np.ndarray, min_pause: float = 0.25) -> list[tuple[float, float]]:
    """Speech stretches separated by pauses of at least `min_pause` seconds."""
    p, _ = pause(a)
    out, start, run = [], None, 0
    for i, quiet in enumerate(p):
        if not quiet:
            if start is None:
                start = i
            run = 0
        else:
            run += 1
            if start is not None and run * HOP >= min_pause:
                out.append((start * HOP, (i - run + 1) * HOP))
                start = None
    if start is not None:
        out.append((start * HOP, len(p) * HOP))
    return out


def unisci(seg, t0, lo, hi):
    """From the first stretch starting after t0, join consecutive stretches (keeping the pauses
    between them) until the total lasts between lo and hi seconds."""
    for i, (s, _) in enumerate(seg):
        if s < t0:
            continue
        for j in range(i, len(seg)):
            d = seg[j][1] - s
            if d > hi:
                break
            if d >= lo:
                return (max(0.0, s - 0.1), seg[j][1] + 0.1), j
    raise RuntimeError(f"no stretch of {lo}-{hi} s after {t0} s")


def degrada(a: np.ndarray, seed: int = 0) -> np.ndarray:
    """Old phone recording: room noise at 20 dB SNR, telephone band 300-3400 Hz at 8 kHz,
    MP3 at 16 kbit/s (like an old voice memo), back to 24 kHz."""
    import av
    rng = np.random.default_rng(seed)
    white = rng.standard_normal(len(a))
    spec = np.fft.rfft(white)
    spec /= np.sqrt(np.maximum(np.arange(len(spec)), 1))        # pink noise
    noise = np.fft.irfft(spec, len(a)).astype(np.float32)
    p_sig = np.mean(a[np.abs(a) > 0.01 * np.max(np.abs(a))] ** 2)
    noise *= np.sqrt(p_sig / 10 ** (20 / 10) / np.mean(noise ** 2))
    x = a + noise
    x8 = ricampiona(x, SR, 8000)
    x8 = sosfilt(butter(6, [300, 3400], btype="bandpass", fs=8000, output="sos"), x8).astype(np.float32)
    x8 = x8 / max(np.max(np.abs(x8)), 1e-6) * 0.7
    pcm = (x8 * 32767).astype(np.int16)
    buf = io.BytesIO()
    with av.open(buf, "w", format="mp3") as out:
        st = out.add_stream("libmp3lame", rate=8000, layout="mono")
        st.bit_rate = 16000
        for i in range(0, len(pcm), 1152 * 20):
            frame = av.AudioFrame.from_ndarray(pcm[None, i:i + 1152 * 20], format="s16", layout="mono")
            frame.sample_rate = 8000
            for pkt in st.encode(frame):
                out.mux(pkt)
        for pkt in st.encode(None):
            out.mux(pkt)
    buf.seek(0)
    dec = []
    with av.open(buf, "r", format="mp3") as inp:
        for frame in inp.decode(audio=0):
            dec.append(frame.to_ndarray().astype(np.float32).reshape(-1))
    y = np.concatenate(dec)
    if np.max(np.abs(y)) > 2:
        y = y / 32768.0
    return ricampiona(y.astype(np.float32), 8000, SR)


def main():
    rapporto = {}
    for p, f in FONTI.items():
        cartella = DL / f"librivox-{f['item']}"
        a = leggi(cartella / f["a"])
        b = leggi(cartella / f["b"])
        out = PERSONE / p
        out.mkdir(parents=True, exist_ok=True)
        # Reference: from minute 3 of chapter A (after LibriVox's spoken preamble).
        sa = segmenti(a)
        (r0, r1), _ = unisci(sa, 180.0, 22.0, 30.0)
        ref = a[int(r0 * SR):int(r1 * SR)]
        scrivi(out / "riferimento.wav", ref)
        # Held-out clips and self-check clips from chapter B, spread over the chapter.
        sb = segmenti(b)
        dur_b = len(b) / SR
        tenuti, controllo, usati = [], [], []
        for k, frac in enumerate((0.2, 0.4, 0.6, 0.8)):
            (s0, s1), _ = unisci(sb, frac * dur_b, 6.0, 12.0)
            tenuti.append((s0, s1))
        for k, frac in enumerate((0.1, 0.3, 0.5, 0.7, 0.9)):
            t = frac * dur_b
            while True:
                (s0, s1), j = unisci(sb, t, 2.5, 6.5)
                if all(s1 <= u0 or s0 >= u1 for u0, u1 in tenuti):
                    break
                t = s1 + 0.5
            controllo.append((s0, s1))
        for k, (s0, s1) in enumerate(tenuti):
            scrivi(out / f"tenuto_{k}.wav", b[int(s0 * SR):int(s1 * SR)])
        for k, (s0, s1) in enumerate(controllo):
            scrivi(out / f"controllo_{k}.wav", b[int(s0 * SR):int(s1 * SR)])
        rapporto[p] = {**f, "riferimento_s": [r0, r1], "riferimento_durata": r1 - r0,
                       "tenuti_s": tenuti, "tenuti_durata": sum(e - s for s, e in tenuti),
                       "controllo_s": controllo}
        if p in ("F1", "M2"):
            scrivi(out / "riferimento_degradato.wav", degrada(ref))
            rapporto[p]["degradato"] = ("rumore rosa a 20 dB di SNR, banda del telefono 300-3400 Hz a "
                                        "8 kHz, MP3 a 16 kbit/s, riportato a 24 kHz")
        print(p, f"rif {r1 - r0:.1f} s", "tenuti", [round(e - s, 1) for s, e in tenuti],
              "controllo", [round(e - s, 1) for s, e in controllo], flush=True)
    ESITI.mkdir(parents=True, exist_ok=True)
    (ESITI / "persone.json").write_text(json.dumps(rapporto, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
