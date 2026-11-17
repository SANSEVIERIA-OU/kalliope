## Voice-cloning TTS models for local CPU use: evidence as of 17 Nov 2026

**Scope and method.** I ran 31 web searches (standard mode) and opened about 60 distinct URLs, mostly official Hugging Face cards, GitHub READMEs, arXiv pages and vendor pages. Three URLs failed (coqui.ai/cpml and cpml.txt return 404; kyutai.org/next/tts is empty). Roughly 250 search-result URLs were not opened; they are listed in section 5 and carry no extracted facts. Where a fact comes only from a mirror, aggregator or search snippet, I say so. Nothing here is a recommendation.

**Headline evidence (official sources only):**
- Italian is on the official list for Pocket TTS, Chatterbox Multilingual V3, VoxCPM2, XTTS-v2, CosyVoice 3, Fish S1/S1-mini, MOSS-TTS-Nano, MOSS-TTS v1.5, Voxtral TTS, Qwen3-TTS-Base, Supertonic 3, OuteTTS 1.0, KittenTTS 2 and Llasa-1B-Multilingual.
- Italian is not on the official list for NeuTTS, IndexTTS-2.5, ZipVoice, Spark-TTS, MegaTTS 3, Dia, Kani-TTS-2-en, Chatterbox Turbo, Voice.ai TTS Lite or Kokoro. For OmniVoice, Higgs v3 and Chatterbox-Nano, Italian is not verified.
- Permissive code and weights, with Italian listed: VoxCPM2 (Apache-2.0 for both), Qwen3-TTS-0.6B-Base (Apache-2.0), MOSS-TTS-Nano (Apache-2.0 per HF tag and README, with a conditional LICENSE statement), Fun-CosyVoice3-0.5B (Apache-2.0), Supertonic 3 (OpenRAIL-M weights, MIT sample code, but preset voices only in the open package). Pocket TTS has CC-BY-4.0 weights and MIT code.
- Weights non-commercial or research-only: XTTS-v2 (CPML), F5-TTS (CC-BY-NC), Voxtral TTS (CC BY-NC 4.0), OmniVoice (CC-BY-NC), Fish S1-mini (CC-BY-NC-SA-4.0), Spark-TTS (CC BY-NC-SA 4.0), Llasa (CC BY-NC 4.0), OuteTTS 1.0 (CC-BY-NC-SA for OuteAI additions), Higgs Audio v3 (research and non-commercial). KittenTTS 2 weights are free for non-commercial use with a separate licence above a revenue or funding threshold.
- Officially reported CPU numbers exist for only a few models, and none are for your Ryzen 5 6650U:
  - Pocket TTS: about 6x real time on a MacBook Air M4 CPU, 2 cores [P1].
  - NeuTTS: LM-only tokens/s on CPUs, including a Ryzen 9 HX 370 [N2].
  - Chatterbox-Nano: 3x real time on 8 CPU threads, CPU model not named [C1, C4].
  - ZipVoice: single-thread Xeon RTF in the paper's Table II [Z3].
  - Voice.ai TTS Lite: RTF 0.31–0.37 on a 2-vCPU cloud instance, vendor-reported, and not yet released [VA1].
- Several vendor or paper sources report GPU-only RTF or none at all.

---

### 1. Comparison table

Dates and facts are "as of" the page fetched on 17 Nov 2026. Bracketed IDs refer to the source register in section 4.

| # | Model (org) | Latest dated item | Licence: code / weights | Params | Italian on official list | Reference audio (official) | CPU speed (official, hardware) | Streaming | CPU-friendly export |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Pocket TTS (Kyutai) | Released Jan 2026 [P3]; paper arXiv 2509.06926, 8 Sep 2025 [P5]; multilingual update blog 4 May 2026 [P4, headline only] | MIT / cc-by-4.0 [P1, P2]; each voice has its own licence [P2] | 100M [P1, P2, P5] | Yes, in HF list [P2] and GitHub list [P1]. GitHub also lists Dutch | Not stated numerically [P1] | ~6x real time on MacBook Air M4 CPU; "Uses only 2 CPU cores"; ~200 ms to first chunk [P1] | "Audio streaming" listed [P1] | No official ONNX; voice embeddings as safetensors. Community ONNX, C++, Core ML, MLX, LiteRT [P1] |
| 2 | NeuTTS Air (Neuphonic) | No release date on card [N1, N2] | Code: not in fetched text [N2]; weights Apache-2.0 [N1, N2] | "0.7B" metadata; "0.5B LLM backbone" [N1] | No; the multilingual collection is EN/ES/DE/FR [N2] | "3–15 seconds" recommended; "as little as 3 seconds" [N2]; reference text required [N2] | LM-only tokens/s on CPU: Ryzen 9 HX 370 = 119; iMac M4 = 111; Galaxy A25 = 20. Codec excluded [N2] | Streaming requires GGUF [N2] | Official GGUF Q4/Q8 [N1, N2]; official ONNX decoder needing pre-encoded references [N2] |
| 3 | NeuTTS Nano (Neuphonic) | No date [N3] | GitHub: "NeuTTS Open License 1.0" [N2]; HF: "License: other", gated [N3] | ~117M active, ~229M total [N3] | No, English-only card [N3] | "3–15 seconds" [N3] | Tokens/s on CPU: Ryzen 9 HX 370 = 221; iMac M4 = 195; Galaxy A25 = 45 [N2]. "real-time... on laptop-class CPUs" is qualitative [N3] | GGUF only [N2] | Official GGUF Q4/Q8 [N3]; ONNX decoder optional [N3] |
| 4 | MOSS-TTS-Nano (OpenMOSS) | Release 2026.4.10; ONNX CPU version 2026.4.17 [MO3] | Code Apache-2.0 sidebar; README defers to the LICENSE file [MO2, MO3]. Models "licensed under the Apache License 2.0" [MO1]. HF tag apache-2.0 [MO2] | 0.1B [MO2] | Yes, "Italian (it)" in table. Text says 20 languages, table has 19 [MO2] | Not stated [MO2, MO3] | "streaming generation can run on a 4-core CPU"; "single CPU core on a MacBook Air M4"; no RTF [MO3] | "Streaming inference: low realtime latency and fast first audio" [MO2]; ONNX "Realtime Streaming Decode" [MO3] | Official ONNX CPU (MOSS-TTS-Nano-100M-ONNX) [MO3]; 48 kHz stereo output [MO2] |
| 5 | Chatterbox Multilingual V3 (Resemble AI) | Retired: "As of August 2026, Chatterbox is retired research and is no longer maintained." [C1] | MIT [C1, C2] | 500M [C1] | Yes, 23 languages incl. Italian [C1, C2] | "requires a reference clip"; no length [C1] | None official for Multilingual [C1] | Not stated [C1] | None official |
| 6 | Chatterbox Turbo (Resemble AI) | Same retirement notice [C1] | MIT [C3] | 350M [C1, C3] | No, English only [C3, C1] | "requires a reference clip"; no length [C3] | None official | Not stated [C3] | Repo ResembleAI/chatterbox-turbo-ONNX exists, MIT, exporter not stated [C5] |
| 7 | Chatterbox-Nano (Resemble AI) | Same retirement notice; vendor page undated [C4] | MIT per vendor FAQ [C4]; HF gated, not read [C6] | 110M [C4] | Not verified; vendor page lists no languages, every sample is English [C4] | "10 seconds or more" [C4] | "3× real-time on CPU using 8 threads"; GPU 10x; CPU model not named [C1, C4] | Not stated for Nano [C4] | No official ONNX [C4] |
| 8 | VoxCPM2 (OpenBMB) | "2026.04" release [V2]; paper v1, 29 Sep 2025 [V3] | Apache-2.0, code and weights [V1, V2] | 2B [V1, V2] | Yes, 30-language list incl. Italian [V1, V2] | Not stated for cloning; "Accepts 16kHz reference" [V1]. Fine-tuning: 5–10 min [V1] | None on CPU. RTF ~0.30 on RTX 4090 (PyTorch), ~0.13 with Nano-vLLM; llama.cpp-omni RTF ~1.76 (Q8_0) on Apple M4 Pro Metal [V1, V2] | "Real-Time Streaming", `generate_streaming` API [V1, V2] | No official ONNX/GGUF. Community ONNX and GGML, "not officially maintained" [V2] |
| 9 | Qwen3-TTS-12Hz-0.6B-Base (Qwen) | Paper "Published Jan 22" (2026) [Q1] | Apache-2.0 [Q1] | Name says 0.6B; HF metadata says 0.9B [Q1] | Yes, 10 languages incl. Italian [Q1] | Not stated for this checkpoint; family claims "3-second voice cloning" [Q1] | None official; "End-to-end synthesis latency as low as 97ms", hardware not named [Q1] | "Extreme Low-Latency Streaming Generation" [Q1] | None stated |
| 10 | Voxtral TTS 4B (Mistral) | Blog 23 Mar 2026 [VX1]; arXiv 26 Mar 2026 [VX2] | Weights CC BY-NC 4.0 [VX1, VX3]; code licence not stated | 4B [VX1] | Yes, 9 languages incl. Italian [VX1, VX3] | "as little as 3 seconds" [VX1, VX2]; "(5 to 25 seconds)" voice prompt [VX1]; 10 s used in benchmark [VX3]. Conflicting | None official. RTF 0.103 at concurrency 1 on H200 (vLLM) [VX3]; ">= 16GB" GPU [VX3] | "streaming and batch inference support" [VX3] | None stated |
| 11 | Fish S1-mini / S1 (Fish Audio, "OpenAudio") | S1 blog, 20 Nov 2025 [FS3] | S1-mini: CC-BY-NC-SA-4.0 [FS1]. Current README: codebase and weights under FISH AUDIO COMMUNITY LICENSE [FS2] | S1-mini 0.5B; S1 4B [FS1, FS3] | Yes for S1: Italian in list [FS3]; S1-mini card lists 13 incl. Italian [FS1]; S2-Pro README does not name Italian [FS2] | S1 blog: "Zero-shot & few-shot voice cloning from short samples", no length [FS3]. S2-Pro: "10–30 seconds" [FS2]. S1-mini card does not mention cloning [FS1] | S1: "about 1:7 real-time factor on an NVIDIA RTX 4090" (notation unclear) [FS3]. S2-Pro RTF 0.195 on H200 [FS2] | S2-Pro streaming; S1 not stated [FS2] | None official |
| 12 | Fun-CosyVoice3-0.5B-2512 (FunAudioLLM) | Roadmap entry 2025/12 [CV1] | Code Apache-2.0 [CV1]; weights Apache-2.0 [CV2] | 0.5B [CV2] | Yes, "9 common languages" incl. Italian [CV1, CV2] | Not stated; prompt wav + prompt text [CV2] | None official; "latency as low as 150ms", hardware not named [CV1] | "text-in streaming and audio-out streaming" [CV1] | None described; HF ONNX tag but no export text [CV2]; TensorRT-LLM and vLLM [CV1] |
| 13 | IndexTTS-2.5 / IndexTTS-2 (IndexTeam / bilibili) | IndexTTS-2.5 on 2026/08/10; IndexTTS-2 on 2025/09/08 [I2] | "bilibili Model Use License Agreement" [I2]; HF card has no licence statement [I1] | Not stated [I1, I2] | No. 2.5 "supports Chinese, English, Japanese, Spanish and Arabic" [I2] | Not stated; "single reference audio clip" [I2] | None official. RTF 0.2065 (2.5, bf16) and 0.3257 (2, fp16), RTX 4090 [I2] | Not mentioned [I2] | None official; vLLM [I2] |
| 14 | F5-TTS (SWivid) | News 2025/03/12, F5-TTS v1 [F1] | Code MIT; pretrained weights CC-BY-NC [F1]; HF metadata cc-by-nc-4.0 [F2] | Not stated [F1, F2] | Not official. Community Italian-only fine-tune alien79/F5-TTS-italian, cc-by-4.0 [F3] | Not stated; ref_text optional, ASR fallback costs memory [F1] | GPU only on card: RTF 0.1467 PyTorch, L20 [F1]. CPU single-thread RTF 37.28 (32 NFE) in ZipVoice paper [Z3] | Not mentioned [F1] | None official. Third-party ONNX (DakeQQ) and MLX [F1] |
| 15 | XTTS-v2 (Coqui) | No date [X1] | CPML [X1]; toolkit MPL-2.0 (secondary only) | Not stated [X1] | Yes, 17 languages incl. Italian [X1] | "Voice cloning with just a 6-second audio clip" [X1] | None official; GPU examples [X1] | Not described [X1] | None |
| 16 | ZipVoice (k2-fsa) | Releases 2025/06/16; last news 2025/07/14 [Z1] | Code Apache-2.0 [Z1]; checkpoint licence not stated [Z1] | 123M [Z1, Z3] | No: "Chinese and English" [Z1] | "less than 3 seconds" single speaker; "less than 10 seconds" dialogue [Z1] | Table II, Xeon 8457C single thread: ZipVoice 16 NFE RTF 9.55; Distill 8 NFE 2.42; Distill 4 NFE 1.22; F5 37.28. GPU H20 Distill 4 NFE 0.0125 [Z3] | Not mentioned [Z1] | Official ONNX CPU path, int8 option (quality loss) [Z1]; sherpa-onnx pointer [Z1]. Dialogue models lack ONNX [Z1] |
| 17 | Spark-TTS 0.5B (SparkAudio) | Paper 2025-03-04; code news 2025-03-12 [S2] | Code Apache-2.0 [S2]; weights CC BY-NC-SA 4.0 [S1] | 0.5B (name) [S1] | No, zh and en [S1, S2] | Not stated [S1] | RTF 0.1362 at concurrency 1, single L20 GPU, Triton [S2] | Not mentioned | None official |
| 18 | MegaTTS 3 (ByteDance) | 2025-03-22 [M1] | Code Apache-2.0 [M1]; weights licence not stated; "primarily intended for academic purposes" [M1] | Backbone 0.45B [M1] | No, zh and en [M1] | Submitted samples "< 24s"; WavVAE encoder not released [M1] | CPU about 30 s for 10 steps; no audio duration or hardware [M1] | Not mentioned | None official |
| 19 | Llasa-1B / Llasa-1B-Multilingual (HKUST) | Paper "Published Feb 6, 2025" [L1] | CC-BY-NC-4.0 [L1, L2] | 1B [L1]; 2B metadata [L2] | Llasa-1B: No, zh and en [L1]. Multilingual: tag "11 languages", It included [L2] | Not stated; 16 kHz only [L1, L2] | None | None | None |
| 20 | OuteTTS 1.0 1B (OuteAI) | Collection "Updated Mar 2", no year [O1] | Base: Llama 3.2 Community License. OuteAI additions: CC-BY-NC-SA-4.0 [O1] | 1B [O1] | Yes, 23 languages; Italian in high-data group [O1] | "around 10 seconds" [O1]; transcript not stated [O1] | Token rate "75 to 150 tokens per second", no hardware, no RTF [O1] | "CHUNKED" generation option, not described [O1] | Official GGUF repo [O1] |
| 21 | KittenTTS 2 (KittenML) | No date on HF [KT1]; PyPI 0.9.4 on 6 Oct 2026 (snippet only) | Code Apache-2.0 [KT2]; weights Stellon Labs Community License. Free non-commercial; separate licence above USD 1M revenue or funding [KT1] | 1.7B text; 2B metadata [KT1] | Yes. HF: 16 languages with named voices incl. Italian [KT1]. GitHub: "20 languages" incl. Italian [KT2] | "5-30 seconds" [KT1, KT2]; transcript optional, Whisper fills it [KT2] | "Runs real time on a CPU" (no numbers) [KT2]; requirements "about 6 GB of RAM" [KT1] | Chunk-level streaming [KT2] | Official GGUF in `cpp/` (llama.cpp fork) and int8 ONNX for CPU [KT2, KT1]. Weights "947 MiB" [KT1] |
| 22 | Supertonic 3 (Supertone Inc.) | "Copyright (c) 2026" only [ST1] | Model OpenRAIL-M; sample code MIT [ST1] | ~99M [ST1] | Yes, 31 languages incl. Italian [ST1] | Open package: fixed preset voices. Custom styles need the separate Voice Builder [ST1] | "Supertonic 3 runs fast on CPU..." (qualitative; charts only) [ST1] | Not mentioned | ONNX Runtime, on-device [ST1] |
| 23 | Kani-TTS-2-en (nineninesix) | No date; citation year 2026 [K1] | HF "License: lfm1.0"; text not read [K1] | 400M [K1] | No, "Optimized primarily for English" [K1] | Not stated; SpeakerEmbedder from reference file [K1] | GPU only: RTF ~0.2 on RTX 5080, 3 GB VRAM [K1] | "optimized for Realtime Conversations" [K1] | None; vLLM "Coming soon" [K1] |
| 24 | OmniVoice (k2-fsa) | arXiv 2604.00688, "Published Apr 1" [OV1] | Code Apache-2.0; model CC-BY-NC [OV1] | 0.6B [OV1] | Not verified. Tag "646 languages", no per-language list [OV1] | Not stated [OV1] | "RTF as low as 0.025"; hardware not stated [OV1] | Not stated | None |
| 25 | Higgs Audio v3 / Higgs TTS 2 (Boson AI) | v3 README (BibTeX year 2026) [H2]; v2 card undated [H1] | v3: "Boson Higgs Audio v3 Research and Non-Commercial License" [H2]. v2: "License: other" [H1] | v2: "3.6B (LLM) + 2.2B" [H1] | v3: "100+ languages", no list [H2]. v2: tag "4 languages", unnamed [H1]. Not verified | "zero-shot cloning"; no length [H1, H2] | None | v3 streaming via SGLang-Omni [H2] | None |
| 26 | Dia-1.6B (Nari Labs) | HF card undated [D1] | Apache-2.0 [D1] | 1.6B text; 2B metadata [D1] | No, "only supports English" [D1] | Audio prompt; no length [D1] | GPU only: "roughly generates 40 tokens/s" on A4000 (86 tokens = 1 s); "CPU support is to be added soon" [D1] | Not mentioned | None |
| 27 | VibeVoice-TTS (Microsoft) | TTS released 2025-08-25; removed 2025-09-05 [VV1] | MIT (sidebar) [VV1] | Not stated [VV1] | TTS-1.5B: "English, Chinese and other languages"; Italian not named. Realtime: experimental Italian voices [VV1] | No cloning statement [VV1] | None | Realtime-0.5B "~300 milliseconds first audible latency"; no hardware [VV1] | None |
| 28 | Kokoro-82M (hexgrad) | v1.0 published 2025-01-27 [KO1] | Apache-2.0 [KO1] | 82M [KO1] | Not stated on card [KO1] | No cloning [KO1] | None [KO1] | Not stated | None official |
| 29 | Voice.ai TTS Lite (Voice.ai) | "Research · May 2026" [VA1] | Not stated; code and model "Soon" [VA1] | 112M [VA1] | No, "English only for now" [VA1] | "short reference clip"; no transcript; no length [VA1] | RTF "0.31–0.37" on 2 vCPU, 8 GB, no GPU (vendor) [VA1] | "Streaming starts in <200 ms" (vendor) [VA1] | Vendor: "CPU (ONNX) · iOS (ONNX)" [VA1] |
| 30 | VITS-EVOlution (ZDisket) | No date [VE1] | Code Apache-2.0; checkpoint licence not named [VE1] | Not stated [VE1] | English shown only [VE1] | "Zero-shot voice cloning from a reference clip"; length not stated [VE1] | "about 0.18 real-time factor on Intel Xeon Platinum 8470", ~5.6x [VE1] | Not stated | ONNX speaker encoder and TTS in repo [VE1] |
| 31 | MOSS-TTS 1.0 / v1.5 (OpenMOSS, 8B) | v1.5 released 2026.5.26 [MO1] | Weights Apache-2.0 [MO1] | 8B [MO1] | v1.5: Italian in 31-language list [MO1] | Not stated [MO1] | Realtime model RTF 0.51, single L20 GPU [MO1] | "Realtime streaming decode" examples [MO1] | Official GGUF backbone (Q4_K_M), ONNX tokenizer, mlx-audio [MO1] |
| 32 | MOSS-TTSD (OpenMOSS) | Tech report 2026.3.31 [MO1] | Not verified; MOSS-TTSD defers to its own card [MO1] | 8B [MO1] | Not verified [MO1] | Not verified | None | None | None |

---

### 2. Notes per model

**Pocket TTS (Kyutai).** This is the only candidate with official Italian and an explicit cloning statement on several pages.
- Italian: HF card lists "english, french, german, portuguese, italian, spanish" [P2]. GitHub lists the same plus "dutch" [P1]. The Kyutai page's selector shows Italian and a voice "Giovanni (Italian, m)" [P3].
- Conflicts: the kyutai.org page says "In April, we made it speak five other languages" but its selector shows six non-English languages [P3]. The 4 May 2026 blog body could not be read [P4].
- Cloning: "The `--voice` argument can also take a plain wav file as input for voice cloning" [P1]. "Processing an audio file ... for voice cloning is relatively slow" [P1]. No reference length is official.
- Speed: "Faster than real-time, ~6x real-time on a CPU of MacBook Air M4" [P1]. For a cloud x86 4-vCPU VM, the README says "RTF ~2.3-2.5x on CPU vs. ~6.28x on GPU". These values look like speed multipliers, not RTF in the time-per-second sense, so the label is ambiguous [P1].
- Weaknesses stated: no pause tokens; "GPU... not officially supported"; `quantize=True` works only on CPU; the Rust port "cannot load training checkpoints"; x86 binaries need AVX2 [P1]. Access to the HF card is gated [P2]. "Voice impersonation or cloning without explicit and lawful consent" is prohibited [P2].
- Repo `kyutai/pocket-tts-without-voice-cloning` exists, but its card does not say how it relates to the main repo [P6].

**NeuTTS Air / Nano / 2E (Neuphonic).**
- Italian is not listed. The README says "English, Spanish, German, French (model-dependent)" [N2]. The HF Nano card is English-only [N3].
- Weaknesses stated: reference text required [N2]; context of 2048 tokens, "enough for processing ~30 seconds of audio" [N2]; "Generation is sampled" [N2]; Perth watermark on every output [N1]; espeak-ng required [N1].
- Benchmarks: "these benchmarks only include the Speech Language Model and do not include the Codec" [N2].
- NeuTTS-2E: "fixed-speaker" model with "4 fixed speakers" [N2].

**MOSS-TTS-Nano and MOSS-TTS family (OpenMOSS).**
- Italian is in the Nano table [MO2]. The text says "20 languages" but the table has 19 entries [MO2].
- No RTF. "streaming generation can run on a 4-core CPU" [MO2, MO3]. ONNX is "nearly 2x the processing efficiency of the original" [MO3].
- Licence: "This repository will follow the license specified in the root `LICENSE` file... treat the repository as not yet licensed for redistribution" if unpublished [MO2].
- Install issues: WeTextProcessing or pynini may fail [MO2].
- MO4 (demo page) redirected to openmoss.ai, not followed.

**Chatterbox family (Resemble AI).**
- Retirement: "As of August 2026, Chatterbox is retired research and is no longer maintained" [C1]. The vendor page says the family is "no longer offered as commercial paid products" [C4].
- Multilingual V3 Italian is listed [C1, C2]. Language transfer: "outputs may inherit the accent of the reference clip's language" [C2].
- Nano CPU claim: "running 3x faster than realtime on 8 CPU cores" [C1].
- Unverified: a third-party "V3 release June 10, 2026" claim and the Nano HF card (gated, not read).

**VoxCPM2 (OpenBMB).**
- Italian is in the 30-language list [V1, V2].
- Limitations stated: "Performance varies across languages depending on training data availability" [V1]. "Occasional instability may occur with very long or highly expressive inputs" [V1].
- The README's own MiniMax-MLS WER table shows VoxCPM2 with the highest error among compared systems in Arabic, Czech, Romanian, Hindi and Ukrainian [V2].
- "Strictly forbidden to use for impersonation, fraud, or disinformation" [V1].
- The arXiv ID "2606.06928" appears in the GitHub README but was not verified.

**Qwen3-TTS-0.6B-Base (Qwen).** Italian is in the 10-language list [Q1]. Cloning and latency are marketing-level claims, and parameter count is inconsistent (0.6B name, 0.9B metadata) [Q1]. No CPU data.

**Voxtral TTS (Mistral).**
- Cloning: "as little as 3 seconds" [VX1, VX2], but the same page gives "The model takes a voice prompt (5 to 25 seconds)" [VX1].
- Evaluation: a 68.4% win rate over ElevenLabs Flash v2.5, with 2 voices per language and 3 annotators [VX1, VX2].
- Weights: "We release the model weights under a CC BY NC license" [VX2].

**Fish S1-mini / S1 (Fish Audio).**
- S1 blog: Italian listed; "Zero-shot & few-shot voice cloning from short samples" [FS3].
- Licence conflict: HF S1-mini says CC-BY-NC-SA-4.0 [FS1]. The current GitHub README says the codebase and "associated model weights" are under FISH AUDIO COMMUNITY LICENSE, but its content covers S2-Pro [FS2].
- S2-Pro README: "10–30 seconds of reference audio is enough to reproduce a timbre" [FS2]. Italian is not named there.

**Fun-CosyVoice3 (FunAudioLLM).**
- Italian is in the 9-language list [CV1, CV2].
- Disclaimer on the HF card: "for academic purposes only" [CV2].
- The GitHub README describes CosyVoice 3.0 as the newest version, and CosyVoice 2.0 and 1.0 as having no language list [CV1].

**IndexTTS-2.5 / 2 (IndexTeam).**
- Italian is not listed. "Enabling random sampling reduces the voice cloning fidelity" [I2].
- Licence: the GitHub README gives the bilibili agreement [I2]. The HF card has no licence statement [I1]. Third-party sources conflict (apache-2.0 vs "other") and are not used.

**F5-TTS (SWivid).**
- Code is MIT and pretrained weights are CC-BY-NC per the README [F1]. The HF card metadata is cc-by-nc-4.0 [F2].
- Italian: the only Italian model is a community fine-tune of the base model, "Italian only so can't speak english properly" [F3]. Its licence is cc-by-4.0 [F3], which conflicts with the base model's NC terms. Whether that is legally valid was not verified.
- The base model's CPU RTF of 37.28 comes from the ZipVoice paper, not F5's own docs [Z3].

**XTTS-v2 (Coqui).**
- Licence is CPML [X1]. The CPML text page returned 404 [X2], so I could not read the licence directly.
- Italian is listed [X1]. No official CPU data.

**ZipVoice (k2-fsa).**
- Table II is the only official CPU RTF in the sources read [Z3]. For ZipVoice-Distill (4 NFE), RTF on one Xeon thread is 1.2202 (RTF >1 means slower than real time under the usual definition; the paper's definition was not verified).
- Arithmetic check: the paper says "32.6 times faster on a single thread... CPU", but 37.284 / 1.2202 ≈ 30.6 (worker computation).
- Weaknesses stated: "A very long prompt will slow down the inference and degenerate the speech quality"; "occasionally has long silence in the middle"; "k2 is necessary for training" [Z1].

**Spark-TTS (SparkAudio).** The fetched GitHub README has a badge that says "mit" in alt text, while the image and sidebar say Apache 2.0 [S2]. The HF weights are CC BY-NC-SA 4.0 [S1]. "The developers assume no liability for any misuse" [S1].

**MegaTTS 3 (ByteDance).** "We do not upload the parameters of WaveVAE encoder... For security issues" [M1]. Public cloning is therefore limited to pre-extracted latents, and the README states the project is "primarily intended for academic purposes" [M1].

**Llasa (HKUST).** The 1B card is CC-BY-NC and "prohibits free commercial use" [L1]. The Multilingual variant lists 11 languages with Italian in the training list [L2].

**OuteTTS 1.0 (OuteAI).**
- Italian is in the high-data group of 23 languages [O1].
- Stated weaknesses: "Without one, it generates random vocal characteristics" (without a speaker reference); accent carry-over from the speaker; "Mixing languages in a single prompt may lead to mistakes" [O1].

**KittenTTS 2 (KittenML).**
- Italian listed [KT1, KT2]. The two pages disagree on language count: "Sixteen languages have a named voice" (HF) vs "20 languages" (GitHub).
- Weaknesses stated: expression control is beta; "the text normalizer is English-tuned and will mangle numbers and dates in other languages" [KT1]; "Streaming does not work on short text" [KT2]; the emb4 option is "the one lossy thing here" [KT1].

**Supertonic 3 (Supertone).**
- Italian listed [ST1]. Custom voice cloning is not in the open package; a separate Voice Builder creates styles from reference audio [ST1].
- Mirror-only claims that the company dissolved and services ended on 2026-08-31 are not verified; the official card has no such statement [ST1].

**Kani-TTS-2-en (nineninesix).** Clore.ai and other third-party pages say Apache 2.0, which conflicts with the official card's lfm1.0 [K1]. Official limitation: "Performance degrades with inputs exceeding ~40sec" [K1].

**OmniVoice (k2-fsa).** Official text: "Users are strictly prohibited from using this model for unauthorized voice cloning, voice impersonation, fraud, scams" [OV1]. Italian is not confirmed because the card has no per-language list [OV1].

**Higgs (Boson AI).** v3 licence is research and non-commercial, and "Production / hosted / revenue-generating use requires a separate commercial license" [H2].

**Dia-1.6B (Nari Labs).** English only [D1]. CPU support was "to be added soon" [D1]; this may be out of date. "Do not produce audio resembling real individuals without permission" [D1].

**VibeVoice (Microsoft).** TTS code removed from the main repo on 2025-09-05 "after release, we discovered instances where the tool was used in ways inconsistent with the stated intent" [VV1]. The page shows no re-release notice at fetch time. A search snippet claimed re-release with safeguards; I did not verify it.

**Kokoro-82M (hexgrad).** No cloning on the card [KO1]. Italian is not mentioned on the card; the VOICES.md file was not opened.

**Voice.ai TTS Lite.** English only [VA1]. Code and model "Soon" [VA1]. The CPU RTF is vendor-measured on a cloud 2-vCPU instance, and the page states "These are predicted scores, not human MOS" [VA1].

**VITS-EVOlution (ZDisket).** English only in the README [VE1]. Parameter count and checkpoint licence not stated [VE1].

---

### 3. What I could not verify

- **Reference audio length, official:** not stated by Pocket TTS, VoxCPM2, CosyVoice 3, IndexTTS, Kani, Higgs, Dia, OmniVoice, Chatterbox Multilingual or Voice.ai Lite. Figures in third-party pages (for example "5 seconds" or "20 seconds" for Pocket) were not used.
- **Pocket TTS:** the 4 May 2026 blog body (only headline read); the official release version (GitHub has no releases, and a PyPI snippet showed 1.0.2, not opened); the Dutch language conflict; the relation of `kyutai/pocket-tts-without-voice-cloning` to the main repo; a Kyutai tech report (the 2026-01-13 page returned only its title).
- **CPU speed for the candidates:** no official CPU RTF for Pocket TTS on x86, VoxCPM2, Qwen3-TTS, Voxtral, Fish, Spark, IndexTTS, XTTS, CosyVoice, Kani, OmniVoice, Dia, Higgs or Chatterbox Multilingual. Several official pages give GPU-only figures, and the ZipVoice Table II hardware is a single Xeon thread, not a laptop.
- **Your Ryzen 5 6650U:** not benchmarked by any official source reviewed.
- **Download sizes:** only KittenTTS 2 (947 MiB weights, [KT1]) and Pocket TTS (100M params, no file size) are stated. The rest are not given in official text, so I did not estimate them.
- **Italian:** not verified for OmniVoice, Higgs v3, Chatterbox-Nano, MOSS-TTSD and Kokoro (voice list not read).
- **Licences not read in full:** the Stellon Labs Community License text (KittenTTS 2); lfm1.0 (Kani); Bilibili Model Use License (IndexTTS); NeuTTS Open License 1.0; the CPML text (coqui.ai returned 404); Fish Audio Community License; Higgs v2 LICENSE file; Llasa and OuteTTS code licences; the Chatterbox-Nano HF card (gated).
- **Chatterbox Multilingual V3 release date:** the official card gives no date. A third-party claim of June 10, 2026 was not verified.
- **Coqui company shutdown date:** only secondary sources say December 2023 or January 2024. The official coqui.ai pages were unavailable.
- **MOSS-TTSD:** licence and language list not opened.
- **Spark-TTS code licence:** the badge conflicts with the sidebar (Apache 2.0 vs "mit" alt text); not resolved.
- **Chatterbox-Nano ONNX:** community ONNX repos exist, but no official export statement was found; ResembleAI/chatterbox-turbo-ONNX exporter attribution is a commit by a user, not a Resemble statement.
- **Discontinuation of Supertone's services:** mirror claims only.

---

### 4. Source register (every URL opened for extraction)

Status: "extracted" means the page returned content used above. "Failed" means no content.

| ID | URL | Status |
|---|---|---|
| P1 | https://github.com/kyutai-labs/pocket-tts | extracted (fetched twice, two prompts) |
| P2 | https://huggingface.co/kyutai/pocket-tts | extracted; gated access |
| P3 | https://kyutai.org/tts/ | extracted |
| P4 | https://kyutai.org/blog/2026-05-04-pocket-tts-multilingual/ | headline and date only |
| P5 | https://arxiv.org/abs/2509.06926 | extracted (CALM paper, Pocket TTS 100M) |
| P6 | https://huggingface.co/kyutai/pocket-tts-without-voice-cloning | extracted; relation not stated |
| P7 | https://kyutai.org/blog/2026-01-13-pocket-tts | title only; no body (constructed URL) |
| P8 | https://kyutai.org/next/tts | failed: empty body |
| N1 | https://huggingface.co/neuphonic/neutts-air | extracted (constructed official URL) |
| N2 | https://github.com/neuphonic/neutts-air | extracted |
| N3 | https://huggingface.co/neuphonic/neutts-nano | extracted; English-only card |
| MO1 | https://github.com/OpenMOSS/MOSS-TTS | extracted |
| MO2 | https://huggingface.co/OpenMOSS-Team/MOSS-TTS-Nano | extracted; resolved to .../MOSS-TTS-Nano-100M |
| MO3 | https://github.com/OpenMOSS/MOSS-TTS-Nano | extracted |
| MO4 | https://openmoss.github.io/MOSS-TTS-Nano-Demo/ | redirect (301 to openmoss.ai); not followed |
| C1 | https://github.com/resemble-ai/chatterbox | extracted |
| C2 | https://huggingface.co/ResembleAI/chatterbox | extracted |
| C3 | https://huggingface.co/ResembleAI/chatterbox-turbo | extracted |
| C4 | https://www.resemble.ai/learn/models/chatterbox-nano | extracted (vendor page) |
| C5 | https://huggingface.co/ResembleAI/chatterbox-turbo-ONNX/tree/main | file listing only |
| C6 | https://huggingface.co/ResembleAI/chatterbox-nano | gated; not read |
| V1 | https://huggingface.co/openbmb/VoxCPM2 | extracted |
| V2 | https://github.com/OpenBMB/VoxCPM | extracted |
| V3 | https://arxiv.org/abs/2509.24650 | extracted |
| Q1 | https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-Base | extracted |
| VX1 | https://mistral.ai/en/news/voxtral-tts | extracted |
| VX2 | https://arxiv.org/abs/2603.25551 | extracted |
| VX3 | https://huggingface.co/mistralai/Voxtral-4B-TTS-2603 | extracted |
| FS1 | https://huggingface.co/fishaudio/openaudio-s1-mini | extracted; resolved to fishaudio/s1-mini |
| FS2 | https://github.com/fishaudio/fish-speech | extracted; current README covers S2-Pro |
| FS3 | https://fish.audio/blog/introducing-s1/ | extracted |
| CV1 | https://github.com/FunAudioLLM/CosyVoice | extracted |
| CV2 | https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512 | extracted |
| I1 | https://huggingface.co/IndexTeam/IndexTTS-2 | extracted |
| I2 | https://github.com/index-tts/index-tts | extracted |
| F1 | https://github.com/SWivid/F5-TTS | extracted |
| F2 | https://huggingface.co/SWivid/F5-TTS | extracted |
| F3 | https://huggingface.co/alien79/F5-TTS-italian | extracted |
| X1 | https://huggingface.co/coqui/XTTS-v2 | extracted |
| X2 | https://coqui.ai/cpml and https://coqui.ai/cpml.txt | failed: HTTP 404 |
| Z1 | https://github.com/k2-fsa/ZipVoice | extracted |
| Z2 | https://arxiv.org/abs/2506.13053 | extracted |
| Z3 | https://arxiv.org/html/2506.13053v3 | extracted (Table II) |
| S1 | https://huggingface.co/SparkAudio/Spark-TTS-0.5B | extracted |
| S2 | https://github.com/SparkAudio/Spark-TTS | extracted |
| M1 | https://github.com/bytedance/MegaTTS3 | extracted |
| L1 | https://huggingface.co/HKUSTAudio/Llasa-1B | extracted |
| L2 | https://huggingface.co/HKUSTAudio/Llasa-1B-Multilingual | extracted |
| O1 | https://huggingface.co/OuteAI/Llama-OuteTTS-1.0-1B | extracted |
| KT1 | https://huggingface.co/KittenML/kitten-tts-2 | extracted |
| KT2 | https://github.com/KittenML/KittenTTS | extracted |
| ST1 | https://huggingface.co/Supertone/supertonic-3 | extracted |
| K1 | https://huggingface.co/nineninesix/kani-tts-2-en | extracted |
| OV1 | https://huggingface.co/k2-fsa/OmniVoice | extracted |
| H1 | https://huggingface.co/bosonai/higgs-tts-2-3b-base | extracted (v2) |
| H2 | https://cdn.jsdelivr.net/gh/boson-ai/higgs-audio@main/README.md | extracted (v3 README, jsDelivr mirror of official repo) |
| D1 | https://huggingface.co/nari-labs/Dia-1.6B | extracted |
| VV1 | https://github.com/microsoft/VibeVoice | extracted |
| KO1 | https://huggingface.co/hexgrad/Kokoro-82M | extracted |
| VA1 | https://voice.ai/tts-lite/research | extracted (vendor page) |
| VE1 | https://github.com/ZDisket/vits-evo | extracted |

---

### 5. Search-result URLs not opened (snippet only, not used for facts)

These were returned by searches but not opened. Most are aggregators, mirrors, forks, or blogs. Listed for coverage.

**Pocket TTS (search 1, 24):** tts.ai/voices/pocket-tts/?lang=uz; tts.ai/voices/pocket-tts/?lang=ms; huggingface.co/EryriLabs/pocket-tts-GGUF; geekchamp.com/products/pocket-tts/; vegu-ai.github.io/talemate/user-guide/agents/voice/pocket-tts/; alphasignal.ai/news/kyutai-s-pocket-tts-now-speaks-6-languages-faster-than-real-time-on-cpu (and .md); huggingface.co/xennonf4/pocket-tts-onnx; huggingface.co/miraclemind/pocket-tts-onnx; huggingface.co/takuma104/pocket-tts-ja; huggingface.co/mwangiderrick640/pocket-tts-onnx; newreleases.io/project/github/kyutai-labs/pocket-tts/release/v2.0.0; huggingface.co/stephvax/pocket-tts-onnx; huggingface.co/openensemble/pocket-tts; everydev.ai/tools/pocket-tts; gh.hhj520.top/CatchNip/pocket-tts; cdn.jsdelivr.net/gh/kyutai-labs/pocket-tts@main/README.md; pypi.org/project/pocket-tts/1.0.2/; pypi.org/project/pocket-tts/; kyutai-labs.github.io/pocket-tts; eweek.com/news/pocket-tts-real-time-voice-ai-laptop-neuron/ (and /de/ variant); medium.com/@cooksusan482/kyutai-pocket-tts-100m-parameter-that-runs-on-your-cpu-6cae1fd812bf; dev.to/andrew-ooo/pocket-tts-review-kyutais-100m-cpu-voice-cloner-2026-40lb; blog.brightcoding.dev/2026/06/10/pocket-tts-why-developers-are-ditching-gpu-tts-forever; alphasignal.ai/news/kyutai-opens-pocket-tts-training-so-anyone-can-build-cpu-voice-cloning.md; theneuron.ai/explainer-articles/your-laptop-can-now-clone-anyones-voice--no-gpu-required.

**NeuTTS (search 2):** jimmysong.io/ai/neutts-air; github.com/Tavus-Engineering/neutts-air; replicate.com/lucataco/neutts-air; github.com/nociza/neutts-air; github.com/goodtab/neutts-air; sourceforge.net/mirror/neutts-air/; github.com/agentisx/neutts-air; huggingface.co/shefowl/neutts-nano-polish; huggingface.co/geopromini/Backbone/blob/main/README.md; voiceaispace.com/articles/v3-neuphonic-launch-neutts-2e-...

**Chatterbox (search 3, 27):** resemble.ai/chatterbox; resemble.ai/chatterbox-turbo; resemble.ai/learn/models/chatterbox; resemble.ai/chatterbox/?id=ChatterboxTTS; resemble.ai/chatterbox/?=aibreakfast; resemble.ai/chatterbox-turbo/?id=ChatterboxTurbo; resemble.ai/learn/models/chatterbox-turbo; resemble.ai/resources/chatterbox-nano-and-flash-speed-at-the-edge-throughput-at-scale; vast.ai/model/chatterbox; docs.clore.ai/guides/audio-and-voice/chatterbox-tts; linuxlinks.com/chatterbox-family-text-to-speech-models/; huggingface.co/ModelsLab/chatterbox-turbo/blob/main/README.md; the-decoder.com/resemble-ai-drops-chatterbox-turbo-...; geeky-gadgets.com/multilingual-ai-voice-chatterbox/; docsearch.algolia.com/mcp/docs/repo/resemble-ai/chatterbox; mintlify.com/yocxy2/chatterboxyocxy; cdn.jsdelivr.net/gh/resemble-ai/chatterbox@master/README.md; localaimaster.com/blog/chatterbox-multilingual-v3; freeapihub.com/ai-models/chatterbox-tts; huggingface.co/vokra/chatterbox-nano-v1; huggingface.co/ResembleAI/chatterbox-hf; huggingface.co/ResembleAI/chatterbox/tree/main; huggingface.co/ResembleAI/chatterbox/blob/main/README.md; huggingface.co/ResembleAI/chatterbox/blob/5ba0317b.../README.md; huggingface.co/ResembleAI/chatterbox-nano/discussions/1; huggingface.co/owensong/chatterbox-nano-ONNX; huggingface.co/Rybib/chatterbox-nano-fp16-mlx; huggingface.co/KitsuMate/chatterbox-nano-onnx; huggingface.co/seanll95/chatterbox-nano-coreml; build.nvidia.com/resembleai/chatterbox-multilingual-tts/modelcard; huggingface.co/aiplexdeveloper/chatterbox/tree/main.

**VoxCPM (search 4):** jimmysong.io/ai/vox-cpm; huggingface.co/openbmb/VoxCPM1.5; huggingface.co/openbmb/voxcpm1.5; huggingface.co/papers/2509.24650; github.com/azhao1981/VoxCPM; huggingface.co/openbmb/VoxCPM-0.5B/blob/main/README.md; huggingface.co/matichon/VoxCPM2/commit/8b0024ef...; awesome.ecosyste.ms/projects/github.com%2Fopenbmb%2Fvoxcpm; huggingface.co/safranyu/VoxCPM2; huggingface.co/3scale/VoxCPM2/commit/06b85d76...; cdn.jsdelivr.net/gh/openbmb/voxcpm@main/README.md; silenceper.com/en/article/2026-06-19-voxcpm-open-source-tts-voice-cloning/; betterstack.com/community/guides/ai/voxcpm2-local-tts.md (and /voxcpm2-local-tts/).

**Kani (search 5):** docs.clore.ai/guides/audio-and-voice/kani-tts (and guides_v2-hi variant); huggingface.co/nineninesix/kani-tts-2-en/discussions/2; huggingface.co/nineninesix/kani-tts-450m-0.1-ft; huggingface.co/nineninesix/kani-tts-450m-0.2-ft; pypi.org/project/kani-tts-2/; glm-image.pages.dev/blog/kani-tts-2-complete-guide-en; huggingface.co/spaces/Gapeleon/KaniTTS_Voice_Cloning/blob/main/util.py; thedailypac.blogspot.com/2026/02/meet-kani-tts-2-...; huggingface.co/spaces/nineninesix/KaniTTS_Voice_Cloning_dev/commit/164603cb...; wiro.ai/models/nineninesix/kani-tts-2-en; techintelpro.com/pressreleases/kanitts-...; tts.ai/voices/kani-tts-default/; tts.ai/voices/kani-tts/?lang=ro; tts.ai/voices/kani-tts/?lang=el.

**F5-TTS / E2 (search 6):** hyper.ai/en/notebooks/35468; hyper.ai/tutorials/35468; awesome.ecosyste.ms/projects/github.com%2FSWivid%2FF5-TTS; pyvideotrans.com/_posts/f5ttsdoc; pyvideotrans.com/f5ttsdoc; proxy-ga.blitzz.co/proxy/123456/huggingface.co/mrfakename/OpenF5-TTS-Base; catalyzex.com/author/Yunting%20Yang; index-tts-2-fw9.pages.dev/tools/f5-tts; huggingface.co/SpongeBobFan2002; oriel-f5-tts-hebrew.hf.space/; deepwiki.com/abus-aikorea/voice-pro/7.1-voice-cloning-guide; arxiv.org/pdf/2509.14579v2; soniqo.audio/guides/f5-tts; gradientflow.com/f5-tts/; localaimaster.com/blog/f5-tts-setup-guide; opensourcealternatives.to/item/f5-tts.

**XTTS (search 7, 26):** huggingface.co/deepbrainspace/TTS/commit/f1a2c848...; huggingface.co/coqui/XTTS-v2/raw/v2.0.0/README.md; huggingface.co/coqui/XTTS-v2/blob/v2.0.1/README.md?code=true; huggingface.co/Borcherding/XTTS-v2_CarliG/blob/418d3f64.../LICENSE.txt; huggingface.co/coqui/XTTS-v2/blob/865bf5bf.../README.md?code=true; huggingface.co/tts-hub/XTTS-v2; huggingface.co/coqui/XTTS-v2/blob/refs%2Fpr%2F46/README.md?code=true; huggingface.co/vokra/xtts-v2; promptquorum.com/power-local-llm/xtts-v2-review; localaimaster.com/blog/xtts-coqui-commercial-license; analyticsindiamag.com/?p=10109988; analyticsindiamag.com/conversational-ai-startup-coqui-shuts-down/; stork.ai/en/coqui; vantaige.io/ai-tool/coqui-tts; github.com/coqui-ai/TTS/discussions/4145; github.com/coqui-ai/TTS/issues/3488; huggingface.co/coqui/XTTS-v2/discussions/33; huggingface.co/coqui/XTTS-v2/discussions/65; hn.matthewblode.com/item/40648193; promptquorum.com/power-local-llm/coqui-tts-review; aiwiki.ai/wiki/xtts/raw; aiwiki.ai/wiki/xtts (www variant); stork.ai/pt/coqui; vantaige.io/fr/ai-tool/coqui-tts.

**CosyVoice (search 8):** arxiv.org/abs/2505.17589v2; arxiv.org/html/2505.17589v2; arxiv.org/pdf/2505.17589v1; tts.ai/voices/cosyvoice3/ (and ?lang=es, ?lang=rw, ?lang=tg, ?lang=sl, ?lang=ms); hf-2025.pages.dev/ayousanz/cosy-voice3-onnx; awesome.ecosyste.ms/projects/github.com%2FQwenAudio%2FCosyVoice; huggingface.co/zhchhe/Fun-CosyVoice3-0.5B-2512; fugumt.com/fugumt/paper_check/2505.17589v1_enmode; aiindigo.com/tool/fun-cosyvoice3-05b-1; gitserver.onethingai.com/ai-models/Fun-CosyVoice3-0.5B-2512/raw/branch/master/README.md.

**IndexTTS (search 9):** arxiv.org/pdf/2506.21619; arxiv.org/abs/2506.21619v1 and v2; arxiv.org/html/2506.21619v1; arxiv.org/pdf/2506.21619v1; tts.ai/voices/indextts2/?lang=es; gitserver.onethingai.com/ai-models/IndexTTS-2/src/branch/pr/LZY9295/20251009175652; gitserver.onethingai.com/ai-models/IndexTTS-2/src/commit/29f24b9a...; gitserver.onethingai.com/ai-models/IndexTTS-2/src/branch/pr/ccccck123/20260114092532; gitserver.onethingai.com/ai-models/IndexTTS-2/src/commit/7d52ae77...

**Fish (search 10):** huggingface.co/fishaudio/openaudio-s1-mini/blob/main/README.md; huggingface.co/fishaudio/s1-mini/blob/main/README.md; huggingface.co/cocktailpeanut/oa; app.alphaneural.io/assets/cocktailpeanut/oa; c-sharpcorner.com/news/openaudio-s1-brings-natural-text-to-speech-breakthrough; gitee.com/zzhdbw/fish-speech; sourceforge.net/projects/fish-speech.mirror/; pypi.org/project/fish-speech/; cnb.cool/xoipz/fish-speech; theresanaiforthat.com/model/openaudio-s1/; backiee.wasmer.app/https_github_com/McMvMc/fish-speech; hn.jakechampion.name/reader/https://openaudio.com/blogs/s1; vercel.com/ai-gateway/models/s1; openrouter.ai/fish-audio/s1-20260729; hyper.ai/en/tutorials/40534; traefik.me mirror page for "openaudio-launches-s1-mini".

**ZipVoice (search 11):** arxiv.org/html/2506.13053v2; arxiv.org/pdf/2506.13053v3; alphaxiv.org/overview/2506.13053v3; emergentmind.com/topics/zipvoice; pypi.org/project/zipvoice/; gitee.com/tophats/ZipVoice; docsearch.algolia.com/mcp/docs/repo/k2-fsa/zipvoice; awesomepapers.io/speech-audio/papers/2506.13053; sourcepulse.org/projects/9136710.

**Spark (search 12, 13):** arxiv.org/abs/2503.01710; arxiv.org/html/2503.01710v1; pdf.arxiv.org/pdf/2503.01710; aitopics.org/doc/arxivorg:D6989D2C; huggingface.co/papers/2503.01710; huggingface.co/TigreGotico/voiceclonnx-bicodec; github.com/arghyasur1991/Spark-TTS; github.com/hhsl1/Spark-TTS; sourceforge.net/mirror/spark-tts; sourceforge.net/projects/spark-tts.mirror/; tts.ai/voices/spark/ (and ?lang=bn, ?lang=fa); wizwand.com/paper/68fa77381e209131cea71c24; sotaverified.org/papers/2503-01710; aibars.net/en/library/open-source-ai/details/721662671379894272; huggingface.co/hua231/Spark-TTS-0.5B; huggingface.co/HKUSTAudio/Spark-TTS-0.5B (and /raw/main/README.md, /tree/main); huggingface.co/SparkAudio/Spark-TTS-0.5B/tree/main; huggingface.co/CurvedArray/Spark-TTS-0.5B; huggingface.co/DragonLineageAI/Vi-SparkTTS-0.5B/blob/.../README.md; huggingface.co/unsloth/Spark-TTS-0.5B/tree/main/src; huggingface.co/RedbeardNZ/Spark-TTS-0.5B/tree/main/src; huggingface.co/beyoru/Spark-TTS-0.5B-with-KafSpark/tree/main/src.

**Supertonic (search 14, 18):** huggingface.co/mlx-community/supertonic-3 (and mlx-community/supertonic-3-mlx); jiangzhuo9357/supertonic-3; mer.vin/linkedin/supertonic-3-99m-on-device-tts-...; techrounder.com/github-trending/supertonic-supertone-inc; lnkiai/supertonic-3-mirror; i2so/supertonic-3; Aliados/supertonic-3; q3146dq4/supertonic-3; q3146dq4/Supertonic-3-ONNX-INT8; felycia/supertonic-3; leok7v/supertonic; Vocabook/supertonic-3; davidgortega/supertonic-3; eugenehp/supertonic-3; saymynameX1/supertonic-3; dungdq1/supertonic-3; Rabidx/supertonic-3; ngoctham/supertonic-3; Supertone/supertonic-3/discussions; scriptbyai.com/supertonic-free-on-device-tts/; everydev.ai/tools/supertonic; betterstack.com/community/guides/ai/supertonic-3.md.

**MOSS (search 15, 17):** aiweekly.co/alerts/openmoss-ships-tts-v15-with-multi-speaker-cloning; docs.clore.ai/guides/audio-and-voice/moss-tts; awesome.ecosyste.ms/projects/github.com%2Fopenmoss%2Fmoss-ttsd; howaiworks.ai/models/moss-tts (and .md); gitee.com/hf-models/MOSS-TTS; gitee.com/itjee/MOSS-TTS; gitee.com/taiyi-one/MOSS-TTS; huggingface.co/OpenMOSS-Team/MOSS-TTS-Local-Transformer; huggingface.co/OpenMOSS-Team/MOSS-TTS/blob/main/README.md; voiceaispace.com/knowledge/repo/moss-tts; ltx-2-7y7.pages.dev/blog/moss-tts-complete-guide-en; voiceaispace.com/knowledge/repo/0a67d072-...; ai-tldr.dev/tools/moss-tts/; llmreference.com/model/moss-tts-1-5; ai-radar.it/article/moss-tts-1-5-...; sourcepulse.org/projects/24506469; huggingface-gw-kz.just-ai.com/OpenMOSS-Team/MOSS-TTS; sourcepulse.org/projects/11049878; huggingface.co/hoskasii/nano; huggingface.co/maanka2/wwe; p.codekk.com/detail/69f469425b02fc5c75bb9fa2; cnb.cool/wss/ai/moss-tts-cnb; mixpeek.com/model/OpenMOSS-Team/MOSS-TTS-Nano-100M; hackernoon.com/moss-tts-nano-100m-brings-multilingual-voice-cloning-to-cpus; tts.ai/voices/moss-tts-nano/?lang=nl (and ?lang=th); 1clonegithubbyxjn.1934672944.workers.dev/OpenMOSS; github.zuike.workers.dev/OpenMOSS/MOSS-TTS-Nano; skillsdirectory.com/skills/yanacuti1121-moss-tts-nano; skills.sh/aradotso/trending-skills/moss-tts-nano-speech; aiindigo.com/tool/moss-tts-nano-100m-1 (and ?lang=fr); voicechanger.live/text-to-speech/models/moss-tts-nano; scriptbyai.com/moss-tts-nano/; theaibench-site.pages.dev/changes/drops/2026-04-13-moss-tts-nano/.

**Llasa (search 16):** huggingface.co/blog/srinivasbilla/llasa-tts; replicate.com/kjjk10/llasa-3b-long/readme; replicate.com/kjjk10/llasa-3b-long; huggingface.co/Gapeleon/llasa-3b; huggingface.co/HKUSTAudio/Llasa-8B; huggingface.co/HKUSTAudio/Llasa-3B; huggingface.co/HKUSTAudio/Llasa-8B/discussions/2; huggingface.co/HKUSTAudio/Llasa-1B/blob/main/README.md?code=true; promptlayer.com/models/llasa-8b; huggingface.co/Prince-1/Llasa-3B/commit/a847b656...; huggingface.co/spaces/zouyunzouyunzouyun/llasa-8b-tts/blob/main/app.py; scrapbox.io/work4ai/Llasa; codersera.com/blog/install-llasa-tts-3b-on-ubuntu-voice-cloning-and-text-to-speech/amp/; huggingface.co/collections/HKUSTAudio/llasa; arxiv.org/abs/2502.04128?context=cs; arxiv.org/pdf/2502.04128; huggingface.co/papers/2502.04128.

**Qwen3-TTS (search 19):** rits.shanghai.nyu.edu (Qwen3-TTS article); medium.com/@zh.milo/qwen3-tts-the-complete-2026-guide-...; letsdatascience.com/news/qwen3-tts-releases-open-source-voice-cloning-and-generation-37ef2448; gigazine.net/gsc_news/en/20260123-qwen3-tts-family-opensource; dev.to/czmilo/qwen3-tts-the-complete-2026-guide-...; hyper.ai/en/papers/Qwen3_TTS; docs.clore.ai/guides/audio-and-voice/qwen3-tts; huggingface.co/simone00/it4/blob/main/README.md; simonwillison.net/b/9255; pub.towardsai.net/alibaba-just-open-sourced-voice-cloning-that-works-in-3-seconds-7ad5d3f6b9fe; huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice/blob/main/README.md; qwen3tts.pages.dev/; voiceradar-2wg.pages.dev/news/qwen3-tts-open-source-voice-cloning/; bretthamlin-com.pages.dev/briefing/2026-01/...; lilting.ch/en/articles/qwen3-tts-voice-synthesis; dokeyai.com/item/qwen3-tts-app; backiee.wasmer.app/https_qwen3tts_app.

**OuteTTS (search 20):** huggingface.co/OuteAI/OuteTTS-0.2-500M-GGUF (and blob/blame variants); promptlayer.com/models/outetts-01-350m-gguf (and -a36d0); promptlayer.com/models/outetts-01-350m; huggingface.co/outeai/outetts-0.1-350m; huggingface.co/OuteAI/Llama-OuteTTS-1.0-1B-FP8; localclaw.io/tts/outetts; huggingface.co/OuteAI/Llama-OuteTTS-1.0-1B-GGUF; promptlayer.com/models/llama-outetts-10-1b-gguf; tts.ai/voices/outetts/; socket.dev/pypi/package/outetts; pypi.org/project/outetts/0.1.7; huggingface.co/OuteAI/OuteTTS-0.1-350M-GGUF/raw/main/README.md; redlib.hbubli.cc/r/LocalLLaMA/comments/1jth72b/...; redlib.hbubli.cc/r/LocalLLaMA/comments/1i1xbv1/...

**Voxtral (search 21):** enterprisedna.co/resources/news/mistral-voxtral-open-source-voice-ai; kdnuggets.com/?p=204366; kdnuggets.com/open-weight-text-to-speach-with-voxtral-tts; rits.shanghai.nyu.edu/ai/voxtral-tts-mistrals-open-weight-text-to-speech-model-rivals-elevenlabs/; datanorth.ai/news/mistral-releases-voxtral-tts-open-weight-text-to-speech-model; slator.com/mistral-text-to-speech-model/; noqta.tn/en/news/mistral-voxtral-tts-open-source-speech-ai-2026; gigazine.net/gsc_news/en/20260327-mistral-voxtral-tts; dev.to/gentic_news/mistral-ai-launches-voxtral-tts-3b-...; ground.news/article/mistral-releases-a-new-open-source-model-for-speech-generation; the-decoder.com/mistrals-first-open-weight-tts-model-voxtral-...; tensoria.fr/en/tools/voxtral-mistral-voice-synthesis; insiderllm.com/guides/mistral-voxtral-tts-local-voice-ai/; jangwook.net/en/blog/en/mistral-voxtral-tts-open-weight-speech/; tools.skila.ai/tools/voxtral-tts.

**OmniVoice (search 22):** techsy.io/en/blog/omnivoice-review; huggingface.co/theoracleguy/OmniVoice-8bit; blog.brightcoding.dev/2026/09/02/k2-fsaomnivoice-600-language-tts-with-voice-cloning; dev.to/_46ea277e677b888e0cd13/omnivoice-open-source-tts-with-600-languages-...; sourceforge.net/projects/omnivoice.mirror/; sourceforge.net/mirror/omnivoice/profile/; sourceforge.net/mirror/omnivoice/; huggingface.co/voiceunlimited/promax; huggingface.co/justmeeandy/OmniVoice; huggingface.co/Infinix-io/OmniVoice; pypi.org/project/omnivoice/0.1.1/; besthub.dev/articles/omnivoice-open-source-tts-model-clones-voices-in-600-languages-...; sourcepulse.org/projects/27349814.

**KittenTTS (search 23):** huggingface.co/netbadass/kitten-tts-2; huggingface.co/kittenml/kitten-tts-2 (lowercase); betterstack.com/community/guides/ai/kitten-tts-2/; everydev.ai/tools/kitten-tts (and /llms.txt); github.com/xtrigg/KittenTTS; stork.ai/blog/kittentts-2-clones-your-voicewith-a-catch; andrew.ooo/posts/kittentts-review-cpu-text-to-speech-voice-cloning/; stork.ai/en/kittentts-2; stork.ai/blog/kittentts-2-got-biggerand-more-complicated; docsearch.algolia.com/mcp/docs/repo/kittenml/kittentts; rits.shanghai.nyu.edu/ai/kittentts-state-of-the-art-voice-synthesis-in-under-25-mb/; tts.ai/voices/kitten-tts/?lang=tr.

**Higgs (search 28):** hackernoon.com/lite/the-higgs-tts-2-3b-base-model-a-text-to-speech-foundation-model; hackernoon.com/the-higgs-tts-2-3b-base-model-...; ai.azure.com/catalog/models/Higgs-Audio-v2.5; freeapihub.com/ai-models/higgs-audio; huggingface.co/PierrunoYT/higgs-audio-v2-generation-3B-base/blob/main/README.md; gitee.com/lcl_101/higgs-audio; huggingface.co/RenderAI/higgs-audio-2/blob/main/README.md; huggingface.co/quangdung/higgs-tts-3-4b; gh.r-mj.com/latentforge/higgs-audio; hyper.ai/en/notebooks/42688 (and ja, cn); sourcepulse.org/projects/11031791; voiceaispace.com/knowledge/repo/higgs-audio; localclaw.io/tts/higgs-audio-v2; blog.brightcoding.dev/2025/09/17/higgs-audio-v2-...; hn.jakechampion.name/reader/https://www.boson.ai/blog/higgs-audio-v2.

**Dia (search 29):** sourceforge.net/projects/dia-1-6b; huggingface.co/nari-labs/Dia-1.6B-0626; vast.ai/model/dia-1.6b; speechtechmag.com/Articles/News/Speech-Technology-News/Nari-Labs-Launches-Dia-TTS-Model-169240.aspx; codersera.com/blog/nari-dia-1-6b-vs-sesame-csm-1b-which-is-the-best-tts/amp/; github.com/TechniStars/dia; tts.ai/voices/dia-speaker-1; huggingface.co/nari-labs/Dia-1.6B/blob/refs%2Fpr%2F46/README.md; huggingface.co/nari-labs/dia-1.6b; github.com/anyopensource/dia; science.ecosyste.ms/projects/120835; sourcepulse.org/projects/2396526; featherless.ai/docs/audio-speech-model-dia; okmiku.com/blog/dia-1-6b-dialogue-first-tts; freeapihub.com/ai-models/dia-tts; redlib.hbubli.cc/r/LocalLLaMA/comments/1k4lmil/...

**VibeVoice (search 30):** apidog.com/blog/microsoft-vibevoice; github.com/vibevoice-community/VibeVoice; gh.r-mj.com/vibevoice-community/VibeVoice; dev.to/preecha/what-is-microsoft-vibevoice-...; dev.to/apilover/what-is-microsoft-vibevoice-...; vibevoice-e0r.pages.dev/vibevoice-1.5b; tts.ai/voices/vibevoice/?lang=ky; tts.ai/voices/vibevoice/?lang=eu; tts.ai/voices/vibevoice/?lang=sn; affiversemedia.com/?p=104407; github.com/ivanrdg/VibeVoice; github.com/brenth82/ViPodspeak; windowscentral.com/artificial-intelligence/microsofts-latest-ai-project-...; freeapihub.com/ai-models/vibevoice; knowara.com/ai-tools/voice/vibevoice-review/; opensourcealternatives.to/item/vibevoice.

**MegaTTS3 (search 31):** sourceforge.net/projects/megatts-3.mirror/; sourceforge.net/mirror/megatts-3/; tts.ai/voices/megatts3-default/?lang=en (and mi, or); github.com/vishwamartur/MegaTTS3; pypi.org/project/tts-webui-megatts3/; awesome.ecosyste.ms/projects/github.com%2Fbytedance%2FMegaTTS3; pypi.org/project/megatts/; doc.pyvideotrans.com/en/blog/megatts3-windows (and /blog/megatts3-windows); huggingface.co/ByteDance/MegaTTS3/blob/refs%2Fpr%2F12/README.md; huggingface.co/spaces/ByteDance/MegaTTS3/blob/main/README.md (and ?code=true); sani2024-mytts.hf.space; huggingface.co/spaces/DelinaresMassates/MegaTTS3/blob/593f3bc.../readme.md; huggingface.co/ByteDance/MegaTTS3; huggingface-gw-kz.just-ai.com/ByteDance/MegaTTS3; aibars.net/en/library/open-source-ai/details/722071276180606976; arxiv.org/pdf/2502.18924v4.

**Generic 2026 CPU searches (search 25):** blog.brightcoding.dev/2026/06/10/pocket-tts-...; hnshowcase.com/post/47431263/real-time-local-tts-31m-params-5-6x-cpu-voice-cloning-onnx; betterstack.com/community/guides/ai/supertonic-3.md (already listed); pkgstats.com/pkg:@qvac/tts-onnx; lilachbullock.com/?p=209368; codesota.com/guides/tts-models; offlinetts.com/blog/tts-stt-landscape-h1-2026/; creativeainews.com/articles/best-open-source-voice-cloning-2026/; github.com/ZDisket/vits-evo mirror on hn.jakechampion.name (secondary of VE1).

**Chatterbox-Nano (search 27):** listed above.

---

### 6. Gaps in this report

- Roughly 250 search-result URLs were not opened (section 5). No fact in this report comes from them; their presence is recorded only for coverage.
- Snippet-only claims that I did not open or verify: a 2026 Chatterbox Multilingual V3 date, the MOSS-TTSD licence, the KittenTTS 2 PyPI version (0.9.4, Oct 6 2026), the VibeVoice re-release claim, the Supertone discontinuation claim, and the VoxCPM2 arXiv "2606.06928" reference.
- The CosyVoice 3 arXiv paper (2505.17589) and the Qwen3-TTS technical report were not opened.