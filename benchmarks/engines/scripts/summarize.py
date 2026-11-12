# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Turn out/results.jsonl into a markdown report (out/REPORT.md)."""
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
rows = [json.loads(l) for l in (ROOT / "out" / "results.jsonl").read_text().splitlines() if l.strip()]
ok = [r for r in rows if "error" not in r]
bad = [r for r in rows if "error" in r]
NCPU = os.cpu_count() or 1
SPEECH_S_PER_HOUR = 300  # assumption: a mute participant "speaks" 5 minutes per hour of meeting

hdr = ("| config | thr | RTF | CPU-s per audio-s | % total CPU while speaking | first audio short / medium (ms) "
       "| RAM steady (MB) | RAM peak (MB) | model RAM excl. Python (MB) | package W while synth | J per audio-s "
       "| Wh per meeting-hour* |")
sep = "|" + "|".join(["---"] * (hdr.count("|") - 1)) + "|"
lines = ["# Benchmark TTS italiano — AMD Ryzen 5 PRO 6650U (6C/12T), ONNX Runtime CPU", "",
         f"*Wh per meeting-hour = J per audio-s × {SPEECH_S_PER_HOUR} s of synthesized speech / 3600.*", "",
         hdr, sep]
for r in sorted(ok, key=lambda r: (r["engine"], r["label"])):
    e_meet = r["j_per_audio_s"] * SPEECH_S_PER_HOUR / 3600
    lines.append(
        f"| {r['label']} | {r['threads']} | {r['rtf']:.3f} | {r['core_rtf']:.3f} | {100 * r['core_rtf'] / NCPU:.1f}% "
        f"| {r['ttfa_short_s'] * 1000:.0f} / {r['ttfa_medium_s'] * 1000:.0f} "
        f"| {r['rss_end_mb']:.0f} | {r['rss_peak_mb']:.0f} | {r['rss_end_mb'] - r['rss_python_base_mb']:.0f} "
        f"| {r['p_active_w']:.1f} (idle {(r['p_idle_pre_w'] + r['p_idle_post_w']) / 2:.1f}) "
        f"| {r['j_per_audio_s']:.2f} | {e_meet:.3f} |")
if bad:
    lines += ["", "## Failed", *[f"- {r['label']}: {r['error'].strip().splitlines()[-1]}" for r in bad]]
(ROOT / "out" / "REPORT.md").write_text("\n".join(lines) + "\n")
print("\n".join(lines))
