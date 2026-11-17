# Research notes: adapting a small TTS to a new speaker, and what it costs

Date of research: 17 Nov 2026. Scope: evidence only, no recommendation.

Method: decisive facts come from raw files, GitHub/Hugging Face APIs, PyPI and npm JSON, or downloaded artifacts. WebFetch summaries (a small model) were used only for kleinml.com, the Pocket TTS blog and docs site, and are marked as such. Search results were all fetched (HTTP, title, keyword counts) and inventoried in section 5. Full extraction was done for the sources cited below, not for every third-party page.

## 1. Klein-TTS (klein-ml)

**Organisation and site.** The Hugging Face org is `klein-ml` (`huggingface.co/kleinml` returned 404). The site is kleinml.com, a WebFetch summary only: "Klein ML is a model developer". It lists Flash Lite 0.4M, Flash 1.7M, Pro 13M, and "Pro QAT: Coming soon". It gives no licence, dates or training information.

**Model card** (`huggingface.co/klein-ml/Klein-TTS-X1.5-Pro/raw/main/README.md`; API: created and last modified 2026-11-03).
- Licence: `apache-2.0` in the metadata and "Apache-2.0 (see LICENSE)". The LICENSE file is Apache 2.0. English dictionaries are misaki-derived, Apache-2.0 (NOTICE-misaki.txt). Weights and code are not separately licensed.
- Architecture: "a StyleTTS 2 / ISTFTNet-style generator"; 13.12M-parameter generator; 24 kHz mono; 178-symbol IPA input.
- Training: "trained by distillation on synthetic speech". Data: "synthetic speech ... from the 17 release voices (single voices, no blended clips)", speeds 0.9/1.0/1.1, text from FineWeb and FineWeb-2. Checkpoint is step 100,000 of 150,000. The teacher is not named.
- Kokoro: appears only as a benchmark row (Kokoro 82M: 81.8M parameters, RTF CPU 0.14, GPU 0.0057). The card does not say Kokoro was the teacher or distillation source, so the brief's "said to be distilled from Kokoro" is not supported by this card.
- Languages: en-US, en-GB, es, fr, it. Only English was scored. Italian voices: Giulia (female), Marco (male).
- Voices: 17 named voices, "blendable within a language" with `voice2`/`mix`. The card says "This checkpoint was not trained on blends, so treat them as experimental."
- Author-reported speed: Pro RTF CPU 0.022 ("a desktop PC", CPU model not named); GPU 0.0020.

**How voices are represented** (official code and files I downloaded).
- `config.json` (Pro): `n_speakers: 17`, `style_dim: 128`, `default_voice: Sarah`.
- `modeling_klein_tts.py` (PyTorch path): `self.speakers = nn.Embedding(cfg.n_speakers, 2 * cfg.style_dim)`. `style()` splits the row into a decoder style (first 128) and a prosody style (last 128). A voice is therefore one fixed learned row, not a reference-audio encoder output.
- `onnx/model.json` (Pro; name `klein-tts-small`, step 100000, 13,122,196 params): `speakers` (17 ids) and `styles` (17 rows × 256 floats). This matches the brief's "fixed style vector per speaker read from a JSON file".
- The npm code (`src/model.js`) passes the style tensor as an input to both the ONNX encoder and decoder. Reading the code, a custom 256-float vector could be passed in, but no official API or doc says so. This is my reading, not documented.
- The 17 internal ids (`af_heart, af_aoede, af_bella, af_nicole, af_sarah, am_fenrir, am_michael, bf_emma, bf_isabella, bm_fable, bm_george, ef_dora, em_alex, em_santa, ff_siwis, if_sara, im_nicola`) are the same names as the voice files in `hexgrad/Kokoro-82M`. Klein does not state this. My check of Klein's `af_heart` row against the 510 rows of Kokoro's `af_heart.pt` (and their mean) found max cosine 0.058. That does not rule out other derivation.

**Style encoder, training code, new voices.**
- No reference-audio style encoder appears in the published Pro files. The classes in `modeling_klein_tts.py` contain no module that takes reference audio.
- Training code is not published. The modeling file has `loss()` methods for an optional evaluation module "M" (described as "trained jointly; off is the recommended setting") and a LoRA adapter class. It has no optimizer, data pipeline, discriminator or training loop (grep for AdamW, optim, backward, discriminator: none).
- The card and the packages document no way to create a new voice. Only blends are documented, and they are experimental.

**npm package `@kleinml/kleintts`** (registry JSON; tarball 0.2.0 extracted; not run).
- Versions: 0.0.0-stage and 0.1.0 published 2026-10-29; 0.2.0 published 2026-11-03. Licence Apache-2.0. Node >= 18. Dependencies: `onnxruntime-node` 1.31.1, `espeak-ng` 1.0.2.
- Bundled: Flash (7 MB) and Flash-Lite (2 MB). Pro is downloaded from the HF repo on first use (about 51 MB, cached).
- README: "Flash writes about 6 seconds of speech in about 0.3 seconds on a desktop CPU." eSpeak NG is a separate GPL-3.0-or-later dependency that "matters if you redistribute an application that bundles it."
- The tarball contains inference code only (g2p.js, espeak.js, index.js, model.js, bin/klein-tts.js).

**PyPI `kleintts` 0.1.0** (JSON API): uploaded 2026-11-03; author "Klein ML"; licence in the description "Apache-2.0 (see LICENSE)"; `from_pretrained("pro")`.

**Other klein-ml repos** (API listing only): `Klein-TTS-X1.5-Small-Checkpoints` is gated (manual; README returns 401). Its file list includes `latest-full.pt` and `samples/step-XXXX/N_student.wav` and `N_teacher.wav`; the contents are inaccessible. Other repos include `Klein-TTS-X1.6-Flash-Checkpoints` (created 2026-11-02), `Klein-TTS-Pro` (empty, created 2026-10-18), `asr-training-models` (gated). The org also lists KV1 LLM repos, which are not TTS.

## 2. Kokoro-82M, StyleTTS 2, and community methods

**Kokoro official.**
- Model card (`huggingface.co/hexgrad/Kokoro-82M`; repo created 2024-12-26, last modified 2025-04-10 per API; v1.0 published 2025 Jan 27 per card; Apache-2.0): "Decoder only: no diffusion, no encoder release." Architecture StyleTTS 2 + ISTFTNet. Training data: "permissive/non-copyrighted audio ... Synthetic audio ... generated by closed TTS models ... No synthetic audio from open TTS models or 'custom voice clones'." Few hundred hours; about $1000 for 1000 A100-80GB hours.
- `VOICES.md` (raw): voice grades include training-duration bands (MM = 10–100 minutes, H = 1–10 hours, HH = 10–100 hours). Italian `if_sara` and `im_nicola` are both "MM minutes", grade C. French `ff_siwis` is "<11 hours", grade B-.
- Official inference code (`kokoro/pipeline.py`, GitHub main, fetched 17 Nov 2026): `return model(ps, pack[len(ps)-1], speed, ...)`. The voicepack is indexed by phoneme length, so it is a table of rows, not one vector. `load_voice` averages several voices with `torch.mean`.
- `kokoro/model.py`: `s = ref_s[:, 128:]` (predictor) and `ref_s[:, :128]` (decoder). Klein uses the same 128/128 split.
- My measurement of `voices/af_heart.pt` (HF, 523,425 bytes): the data storage is 522,240 bytes = 510 × 256 float32. This matches `pack[len(ps)-1]`.
- The GitHub repo (`hexgrad/kokoro`, Apache-2.0, pushed 2025-08-06) describes itself as "An inference library for Kokoro-82M". Its tree has no training scripts.
- kLegacy v0.19 README (`huggingface.co/hexgrad/kLegacy/raw/main/v0.19/README.md`, Dec 2024–Jan 2025): `af.pt` is "a 50-50 mix of Bella and Sarah ... torch.mean(torch.stack([bella, sarah]), dim=0)", with an `assert` in the card. It says "Lacks voice cloning capability, likely due to small <100h training set." Training: about 500 A100 hours, under 100 h of audio, under 20 epochs.
- `restoring-sky.md` (kLegacy repo, dated by its text "Tonight on NYE", about 31 Dec 2024): `af_sky` was reconstructed from "about 3 minutes of 2023 Sky". The text says the model was "not yet trained on enough data to effectively zero-shot out of distribution (aka voice cloning)" and that "Sky shows that it is possible to reconstruct a voice ... from fairly little training data." The method for `af_sky` is not described in what I read.
- HF post by hexgrad, 6 Jan 2025 (`huggingface.co/posts/hexgrad/418806998707773`): the author offered "Trained Voicepacks" in exchange for labelled synthetic audio: "If your data ... is approved into the next hexgrad/Kokoro-82M training mix ... I will DM back the corresponding voicepacks for YOUR data if/when the next Apache-licensed Kokoro base model drops." So voicepacks are produced by the author from contributed data; no self-serve procedure is documented.
- The phrase "mean of means" (a claim that most Kokoro style vectors come from synthetic audio and are averages of averages) is in no official page I fetched: not in the HF main README, GitHub README, PR #3 README, PR #44, or v0.19 README. It appears only in a third-party aggregator snippet. Not verified.

**StyleTTS 2 official** (`github.com/yl4579/StyleTTS2`, raw README; repo created 2023-06-14, last push 2024-08-10; code MIT).
- Fine-tuning: "The default configuration config_ft.yml finetunes on LJSpeech with 1 hour of speech data (around 1k samples) for 50 epochs. This took about 4 hours to finish on four NVidia A100." It needs the LibriTTS checkpoint. A single-GPU variant, `train_finetune_accelerate.py` (fp16), is listed. The README roadmap includes "Add a finetuning script for new speakers with base pre-trained multispeaker models" (ticked).
- Zero-shot: the official README gives no few-minute fine-tune figure. The abstract (arXiv 2306.07691 v2, submitted 13 Jun 2023, revised 20 Nov 2023; NeurIPS 2023 poster page) says: "when trained on the LibriTTS dataset, our model outperforms previous publicly available models for zero-shot speaker adaptation."
- Pre-trained model terms: listeners must be told speech is synthesised unless the speaker permits cloning.
- Academic evidence (not StyleTTS 2): arXiv 2110.05798 (submitted 12 Oct 2021; Interspeech 2022 submission): "fine-tuning a single-speaker TTS model on just 30 minutes of data, can yield comparable performance to a model trained from scratch on more than 27 hours of data."

**KVoiceWalk (community, official README).** `github.com/RobViren/kvoicewalk`: created 2025-05-20, last push 2026-04-06, Apache-2.0, 296 stars.
- What it does: random walk over Kokoro style tensors, scored by a harmonic mean of Resemblyzer target similarity, self-similarity and feature similarity. Output is a `.pt` tensor. `--interpolate_start` builds a starting population.
- Input: "Mono 24000 Hz WAV (around 20-30s single speaker)". `target_text` should be "around 100-200 tokens".
- Results in the README: stock `af_heart` target similarity 0.709; best interpolated 0.780; random walk "Step:9371, Target Sim: 0.917". The header says "Similarity score of 93% ... after 10,000 steps". The README's own step number and metric differ.
- Time and hardware (README, "CUDA Performance Note", April 2026): "CUDA mode VRAM usage: about 4 GB. CPU run: about 26 hours. RTX 3060 CUDA run: about 4 hours." Tested on RTX 3060. Random: "some ... led to incredible sounding results ... others can crash and burn right away." Does not run in parallel.
- The README says early Resemblyzer-only scoring "resulted in overfitted garbage" and that feature similarity was needed.
- Conflict: PR #7 (`RobViren/kvoicewalk` pull request by a contributor, 16 Jun 2025; state "Open" when fetched; I read it via a mirror URL) logs a 10,000-iteration run: "Duration: 56.80 minutes ... Best Score: 0.42 Best Similarity: 0.48" on GPU. The PR says "~3x faster on RTX4070 8GB" and "10-15% CPU utilization on Intel i9-14900HX". These are a different version and metric; the figures are not comparable with the README.
- Academic relative: arXiv 2408.17068 (Tian Liu Lee et al., CUHK; submitted 30 Aug 2024, v5 26 May 2025): "personalized voice synthesis through human-in-the-loop coordinate descent" over PCA directions of a speaker-embedding space (ECAPA-TDNN). It needs no reference recordings and is aimed at people who have lost their voice. The model is a resynthesis framework trained on LibriTTS-R (527 h, 2,293 speakers, 200k steps), not Kokoro. Results are simulations and user studies.

**Community Kokoro fine-tunes** (not official).
- `semidark/kikiri-tts` (GitHub, Apache-2.0, created 2026-04-10, pushed 2026-11-06): "a complete, documented training recipe for fine-tuning Kokoro-82M on a new language". Pipeline: dataset prep, weight conversion, Stage 1, Stage 2, voicepack extraction (`scripts/extract_voicepack.py --audio-dir`). `docs/TRAINING_GUIDE.md`: "NVIDIA (CUDA) Recommended. Any GPU with 10GB+ VRAM. batch_size=4 works on 12GB." "CPU only: Not practical. Training would take weeks."
- `Thorsten-Voice/Kokoro` (HF): German fine-tune on CC0 Thorsten-Voice data, 12,283 training sentences, Stage 1 10 epochs, Stage 2 10 epochs. Compute not stated. Voicepack `thorsten.pt`.
- `BH-Builds/goonj-1-82M` (HF): 15 persona voicepacks; about 5,000 clips / about 10 h of synthetic audio (ElevenLabs references, Fish Audio S2 Pro synthesis). "Hardware: 1× NVIDIA L40S, ~7h total. Voicepacks extracted by averaging style/prosody encoder outputs over each persona's training clips."
- `akhaliq/Ming-Kokoro-82M` (HF): student warm-started from Kokoro, retrained on a 24-hour corpus synthesised by stock Kokoro. Self-reported "~$35 of GPU" and "~20 minutes on a single GPU" for a stage. "Voices mimic the stock Kokoro voices they were trained from — timbre similarity, not clones."

## 3. Piper (OHF-Voice/piper1-gpl)

- Repo: `github.com/OHF-Voice/piper1-gpl`, GPL-3.0, created 2025-03-28, pushed 2026-11-15. The old `rhasspy/piper` is archived; its README says "Development has moved".
- `docs/TRAINING.md` (raw main): `python3 -m piper.train fit ... --ckpt_path /path/to/finetune.ckpt # optional but highly recommended`. "Using --ckpt_path is recommended since it will speed up training a lot, even if the checkpoint is from a different language. Only medium quality checkpoints are supported without tweaking other settings."
- Run length (official table): fine-tune from a Piper checkpoint on under about 5 h: 2,000 epochs. About 10–15 h: 650–850 epochs. Scratch: 15–30 h. "2,000 epochs is the recipe behind recent voices made from 0.9-4 h of audio." No minutes-based figure is given.
- Wall-clock (official): "an epoch on an H100 at batch 48 takes roughly 9 s plus 4 s per hour of audio, so 2,000 epochs of a 2 h voice takes about 10 h. On a 3090 at batch 24, budget roughly 25 s per hour of audio per epoch, and on an A6000 at batch 32, roughly 20 s."
- Hardware: "Most of the Piper voices were trained/fine-tuned on a Threadripper 1900X ... and either an NVIDIA A6000 (48 GB VRAM) or a 3090 (24 GB VRAM). Users have reported success with as little as 8GB of VRAM and alternative GPUs like the RX 7600." CPU training is not documented. Not verified.
- Licence (`docs/LICENSING.md`): "The Piper engine is GPL-3.0-or-later." "The Piper project makes no license grant of its own over voice models." Each voice's MODEL_CARD licence line "names the license of that voice's own dataset only". `docs/COMMERCIAL_USE.md` lists voices whose whole training chain is permissive.
- Italian checkpoints (`huggingface.co/datasets/rhasspy/piper-checkpoints`, MIT, created 2023-06-08, last modified 2026-11-15; and `rhasspy/piper-voices`):
  - `it_IT/paola/medium`: 1 speaker, 22,050 Hz. Dataset: OHF-Voice voice-datasets, CC0. "Finetuned from the U.S. English hifi_tts_92 base model (medium quality)". Requires Piper 1.5+.
  - `it_IT/serena/medium` and `/high`: 22,050 Hz. Dataset `committa/serena-synthetic-it-27h`, CC-BY-4.0. "Trained from scratch." Training script `train.sh` uses `--accelerator 'gpu'`, batch 10, max 10,000 epochs (medium).
  - `it_IT/riccardo/x_low` (`rhasspy/piper-voices`): 16,000 Hz, M-AILABS dataset, "License: See URL", trained from scratch.
- Voices README: "Piper is intended for personal use and text to speech research only; we do not impose any additional restrictions on voice models."

## 4. Small and edge TTS with documented adaptation

**Pocket TTS (Kyutai).** `github.com/kyutai-labs/pocket-tts`: MIT (LICENSE raw), created 2026-01-07, pushed 2026-11-16. HF `kyutai/pocket-tts`: cc-by-4.0, gated (auto), created 2025-12-29, modified 2026-10-21.
- README: "Runs on CPU", "100M parameters", "English models down to 1.9M", "~6x real-time on a CPU of MacBook Air M4", "Uses only 2 CPU cores", "~200 ms to get the first audio chunk". Release date: "January 2026" (the blog slug is 2026-01-13; blog body not retrievable).
- Languages (README): English, French, German, Portuguese, Italian, Spanish, Dutch. `--language italian_24l` is a 24-layer Italian model: "higher quality but slower". The official `italian_24l.yaml` is in the repo.
- Voice cloning: "The `--voice` argument can also take a plain wav file as input for voice cloning." "Processing an audio file ... for voice cloning is relatively slow, but loading a safetensors file ... is very fast" (`export-voice`). "We recommend cleaning the sample". Reference length is not stated officially (a third-party page says 20 s; not verified).
- GPU: "moving the model to GPU gave a consistent ~2.6x speedup over CPU" on a T4 cloud VM. "On Apple Silicon ... we did not observe a GPU speedup." Hardware-dependent.
- Training (`training/README.md`): "If you have a GPU and some speech data". Requirements: Linux, "One NVIDIA GPU (the default batch size wants ~56 GB; a consumer GPU runs batch_size: 16 ... ~16 GB)", about 60 GB disk per 1,000 h. 200 h "will speak", 2000 h "sounds good". `finetune.yaml` "continues from the pretrained English teacher ... useful if you want to finetune on more data in the same language (new voices, a new domain)." The teacher is a 24-layer model that is distilled to a 6-layer student; whether the teacher weights are released is not verified.
- Speaker similarity in Pocket's own evaluation uses `microsoft/wavlm-base-plus-sv` embeddings (official training README).
- HF card gated prompt prohibits "voice impersonation or cloning without explicit and lawful consent".

**Supertonic (Supertone).**
- Official GitHub repo is archived: `supertone-oss-archive/supertonic` (the `supertone-inc/supertonic` URL redirects). README top: "This repository is archived. Development and support have ended. ... No updates, bug fixes, security patches, or support will be provided." API: archived true, pushed 2026-09-09.
- Supertonic 3 (README: released 2026-04-29): about 99M parameters, 31 languages including Italian (`it`), ONNX Runtime, "no GPU required".
- Cloning: "does not include an official voice-cloning pipeline. ... Voice Builder ... turns a short reference recording into version-specific JSON files for Supertonic 2 and Supertonic 3." Voice Builder live 2026-01-22; S3 support 2026-05-18 (README). The archive "does not include ... Voice Builder services."
- Original card `huggingface.co/Supertone/supertonic-3` (raw README; licence openrail): "To create your own Supertonic 3 voice-style JSON from reference audio, use Supertonic Voice Builder; purchased Voice Builder styles include downloadable embeddings".
- Licence: sample code MIT; model OpenRAIL-M.
- Preset voice styles are JSON (`voice_styles/F1..M5.json` in the HF listing).

**KittenTTS 2 (KittenML).**
- HF `KittenML/kitten-tts-2`: created 2026-09-30, modified 2026-10-23; licence "other", Stellon Labs Community License. Model is 1.7B. Weights 947 MiB.
- Cloning: "clone one, from 5-30 seconds of a single speaker" (`m.generate(..., reference="my_voice.wav")`). GitHub README: "Clone any speaker from 5-30 seconds of audio, no fine-tuning". Self-reported similarity: "0.49-0.72 speaker similarity against its own reference and 0.01-0.18 against the other 37". Metric name not given.
- Licence: "Research, non-commercial and limited commercial use are free ... the commercial grant ends once you or your affiliates pass USD $1,000,000 in annual revenue or in total cumulative funding." The `speaker/` embedding model is "pyannote speaker-embedding model, under MIT".
- Requirements (GitHub README, Quick Start): "A CUDA GPU with roughly 8 GB free, or a CPU with about 6 GB of RAM."
- Smaller models (`kitten-tts-2-mini` 82M, `-nano` 17M, `-pico` 7M): the tiny-model doc has no cloning text. Cloning support not verified.
- GitHub `KittenML/KittenTTS`: Apache-2.0 code, created 2025-08-05, pushed 2026-11-13. "Runs realtime on CPUs" (no numbers). "Commercial support is available ... custom voices".

**NeuTTS (Neuphonic).**
- `github.com/neuphonic/neuTTS` (GitHub licence "NOASSERTION"). README licence table: NeuTTS-Air Apache 2.0; Nano and 2E "NeuTTS Open License 1.0". The LICENSE file ("Last Updated: 11 December 2025") has a threshold: "annual revenue of 5 million United States dollars ($5,000,000) or more" requires a paid licence.
- Cloning: "create your own speaker with as little as 3 seconds of audio". Inputs: "A reference audio sample (.wav file)" and "A text string". Adaptation is by reference encoding, not weight training.
- Parameters (README table): Air about 552M (emb + active), Nano about 229M, 2E about 236M.
- Languages: "English, Spanish, German, French (model-dependent)". Italian is not listed.
- CPU (README, llama-bench, Q4_0): Air 119 tokens/s on AMD Ryzen 9 HX 370; Galaxy A25 20 tokens/s. No seconds-of-audio figure.
- Fine-tuning (`TRAINING.md`): based on Llasa; uses transformers; example `examples/finetune.py` on Emilia-YODAS encoded with NeuCodec. "for a dataset of 10 hours, 1000 to 2000 steps is often sufficient." Learning rate 1e-5 to 4e-5. No hardware statement.
- HF `neuphonic/neutts-air`: licence apache-2.0, gated (auto); README returns 401.

**Academic adaptation evidence (LLM-based TTS, third party).** arXiv 2603.10904 (Purwar and Choudhary; submitted 11 Mar 2026; CC BY-SA 4.0): LoRA and full fine-tuning of NeuTTS's Qwen-0.5B backbone on single-speaker data. Full FT: 5 epochs on NVIDIA L4 24 GB, batch size 2. Reported: DNS-MOS gains "up to +0.42" for speakers with acoustic variability; voice similarity rose for all evaluated speakers; "speakers trained on acoustically homogeneous data experience limited gains or perceptual degradation."

## 5. Speaker-similarity tools (offline)

- **Resemblyzer** (`github.com/resemble-ai/Resemblyzer`): Apache-2.0 (GitHub API), last push 2023-10-12. PyPI 0.1.4 uploaded 2023-10-12; wheel 15,747,704 bytes (includes pretrained model). 256-dim embedding. README: "create a voice profile for a person from a few seconds of speech (5s - 30s)"; "around 1000x real-time on a GTX 1080 ... can run both on CPU or GPU"; "works best on English language only". Used by KVoiceWalk.
- **SpeechBrain ECAPA-TDNN** (`huggingface.co/speechbrain/spkrec-ecapa-voxceleb`): Apache-2.0; HF last modified 2025-02-18. `embedding_model.ckpt` 83,316,686 bytes. Card EER 0.80% on VoxCeleb1-test (cleaned), release "05-03-21". Cosine distance. SpeechBrain library: Apache-2.0; PyPI 1.1.2 uploaded 2026-10-14; repo pushed 2026-10-14.
- **WavLM-base-plus-sv** (`huggingface.co/microsoft/wavlm-base-plus-sv`): `pytorch_model.bin` 404,547,053 bytes. HF licence field empty. The card points to `github.com/microsoft/UniSpeech/blob/main/LICENSE`. That raw file, fetched 17 Nov 2026, starts "Attribution-ShareAlike 3.0 Unported" (CC BY-SA 3.0 legal text). GitHub API reports NOASSERTION. Which applies is unresolved. Card example: "threshold = 0.86 # the optimal threshold is dataset-dependent". Used by Pocket TTS's own evaluation.
- **pyannote/wespeaker-voxceleb-resnet34-LM**: cc-by-4.0 (card); last modified 2024-05-10; `pytorch_model.bin` 26,645,418 bytes. Card: "The pretrained model in WeNet follows the license of it's corresponding dataset ... VoxCeleb follows Creative Commons Attribution 4.0".
- CPU timing for ECAPA and WavLM-SV is not in official docs. Not verified.

## 6. Conflicts

- Klein's Pro card versus the brief: the card does not say "distilled from Kokoro"; teacher not named. The internal ids match Kokoro's names (observation).
- Kokoro voicepacks: stock voicepacks are per-length tables (510 rows); Klein's Pro voice is one row per speaker (17 × 256). Both are 256-wide.
- KVoiceWalk timing: README 26 h CPU / 4 h RTX 3060 for 10k steps vs PR #7 log 56.8 min on GPU for 10k steps. Different versions and metrics.
- KVoiceWalk similarity: README "93%" and "Target Sim 0.917 at step 9371". Also PR log "Best Similarity 0.48" (different metric). Not reconciled.
- Pocket TTS languages: official README lists 7 (incl. Italian); a tts.ai aggregator page lists English and French. Official used.
- NeuTTS parameters: README 552M (Air); third-party 748M. Official used.
- Supertonic Voice Builder: a third-party mirror says paid cloning "stopped working after August 31, 2026". Official archive says the archive "does not include ... Voice Builder services". No official statement on service status found.
- KittenTTS 2 licence: one third-party page footer mentions CC-BY-NC-SA; official card says Stellon Labs Community License. Official used.
- WavLM-SV licence: card empty; linked UniSpeech LICENSE is CC BY-SA 3.0 text (see §5).

## 7. Not verified / coverage gaps

- Klein: teacher identity; whether Pro can be fine-tuned; style-encoder or training code (not published, per files inspected); CPU model behind "RTF 0.022"; contents of gated checkpoint repos; kleinml.com content only via WebFetch summary; `huggingface.co/spaces/hugging-apps/klein-tts-x15-pro` listed in API but not opened.
- Kokoro: the "mean of means" claim (not found in official pages); no official voicepack-creation procedure beyond the author's data-for-voicepack offer; `af_sky` method not described in text read; Kokoro voicepacks for a new speaker (none officially).
- StyleTTS 2: "few minutes" zero-shot fine-tuning not in the official README (only the 1-hour figure); style encoder in StyleTTS 2 code not inspected.
- KVoiceWalk: no independent benchmark; "uncanny valley" claim appears only in an aggregator; the Derpy Turtle (RVC) page timed out.
- Piper: CPU training not documented; minutes-based requirement not stated; no official Italian fine-tune from real speech.
- Pocket TTS: reference length not official; Italian cloning quality not verified; HF model card README returned 401; blog body not retrievable (WebFetch got headline only); whether teacher weights are released not verified.
- NeuTTS: no fine-tune hardware statement; HF card README returned 401; Italian not supported per README.
- Supertonic: cloning quality only relative (S3 vs S2 speaker similarity "improves"); no absolute number.
- KittenTTS 2: cloning in small models not documented; no CPU numbers beyond "realtime".
- Speaker tools: CPU cost of ECAPA and WavLM-SV not documented; WavLM-SV licence unresolved.
- Access: several PyPI HTML pages returned a "Client Challenge" page (pocket-tts, styletts2, neutts, kokoro, pyttsx4, TTS). The PyPI JSON API worked for `kleintts`, `Resemblyzer`, `speechbrain`. npmjs.com HTML returned 403 (Cloudflare); the npm registry JSON worked.

## 8. Inventory

### A. Search-result URLs (167 unique, all fetched with curl, HTTP status recorded)

Status key: **P** = used for facts (official or primary, or community source used with label) · **A** = abstract read via a different URL (see note) · **S** = screened only (title and keyword counts; third-party or unrelated; not used for facts) · **B** = blocked or failed (code given).

Search 1 (Klein):
1. https://huggingface.co/mlx-community/IndexTTS-1.5/tree/main — S (200; unrelated)
2. https://huggingface.co/kruatech/studio-mlx — S (200; Klein image model, not Klein-TTS)
3. https://www.alphaxiv.org/abs/2512.14291.md — S (200; GLM-TTS)
4. https://huggingface.co/Kremon96/MOSS-TTS-v1.5/discussions — S (200)
5. https://huggingface.co/AEmotionStudio/fish-speech-s2-pro/blob/main/README.md — S (200; community)
6. https://huggingface.co/deepbrainspace/TTS/tree/main — S (200)
7. https://aiweekly.co/alerts/openmoss-ships-tts-v15-with-multi-speaker-cloning — S (200; news)
8. https://huggingface.co/Jinstudio/MOSS-TTS-v1.5 — B (401; "404 – Hugging Face")
9. https://huggingface.co/subhash131/MOSS-TTS-v1.5 — S (200)
10. https://huggingface.co/liskasYR/MOSS-TTS-v1.5 — S (200)
11. https://huggingface.co/CompactAI-O/Flare-TTS-v1.5/blob/main/README.md — B (401)
12. https://huggingface.co/KittenML/kitten-tts-2 — P (HTML; raw README used, see §4)
13. https://ai.azure.com/catalog/models/inworld-tts-1-5-mini — S (200; unrelated)
14. https://huggingface.co/nineninesix/kani-tts-2-pt — S (200)

Search 2 (npm kleintts):
15. https://socket.dev/npm/package/kitten-tts-js — S (200)
16. https://socket.dev/npm/package/%40kittentts%2Freact-native — S (200)
17. https://socket.dev/npm/package/@kittentts/react-native — S (200)
18. https://socket.dev/npm/package/klein — S (200; unrelated package)
19. https://snyk.io/advisor/npm-package/klm — S (200; redirect to security.snyk.io; unrelated)
20. https://npmjs.com/package/kml-pipe-ts — B (403; Cloudflare)
21. https://www.npmjs.com/package/klm — B (403)
22. https://libraries.io/npm/kleisimo/1.2.2 — B (login redirect)
23. https://www.npmjs.com/package/@itsmworkbench/kleislis — B (403)
24. https://www.jsdelivr.com/package/npm/@kanaries/ml — S (200; unrelated)
25. https://socket.dev/npm/package/npmts — S (200; unrelated)
26. https://classic.yarnpkg.com/en/package/npm-ts-starter — S (200; unrelated)
27. https://libraries.io/npm/npmts/3.5.0 — B (login redirect)
28. https://www.pkgstats.com/pkg:klein — S (200; unrelated)
29. https://awesome.ecosyste.ms/projects/github.com%2Fpalmerhq%2Ftsdx — S (200; unrelated)
30. https://packages.ecosyste.ms/registries/npmjs.org/keywords/ts — S (200; unrelated)

Search 3 (Kokoro voicepack):
31. https://huggingface.co/akhaliq/Ming-Kokoro-82M — P (HTML; raw README used, community)
32. https://huggingface.co/christopherthompson81/kokoro-82m-onnx — S (200; ONNX export)
33. https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX — S (200)
34. https://huggingface.co/datasets/ecyht2/kokoro-82M-voices — S (200)
35. https://huggingface.co/hexgrad/Kokoro-82M/raw/refs%2Fpr%2F3/README.md — P (used; PR #3 README)
36. https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX-timestamped — S (200)
37. https://www.promptlayer.com/models/kokoro-82m — S (200; pricing)
38. https://huggingface.co/hexgrad/Kokoro-82M/blob/refs%2Fpr%2F44/README.md — S (200; checked for "mean of means": absent)
39. https://tts.ai/voices/kokoro/?lang=hy — S (200; aggregator)
40. https://tts.ai/voices/kokoro/?lang=fi — S (200; aggregator)
41. https://www.eachlabs.ai/blog/kokoro-82m-small-tts-model-big-voice — S (200; third-party)
42. https://awesome.ecosyste.ms/projects/github.com%2Fhexgrad%2Fkokoro — S (200)
43. https://mixpeek.com/model/hexgrad/Kokoro-82M — S (200)
44. https://huggingface.co/hexgrad/Kokoro-82M/blob/main/README.md?code=true — S (200; same card as raw main)
45. https://huggingface.co/cstr/kokoro-voices-GGUF — S (200)
46. https://soniqo.audio/guides/kokoro — S (200; third-party voice list)
47. https://findailist.com/tools/kokoro-tts — B (DNS failure)
48. https://tts.ai/voices/kokoro/ — S (200; aggregator)
49. https://tts.ai/voices/kokoro/?lang=ml — S (200; aggregator)
50. https://tts.ai/voices/kokoro/?lang=so — S (200; aggregator)

Search 4 (KVoiceWalk):
51. https://arxiv.org/pdf/2408.17068 — A (PDF not text-extracted; same paper read at arxiv.org/abs/2408.17068 and /html/2408.17068v5)
52. https://devbytes.co.in/news/kvoicewalk-in-a-nutshell-a-novel-tool-for-voice-cloning — S (200; third-party)
53. https://bestofai.com/article/github-robvirenkvoicewalk-... — S (200; mirror of README)
54. https://hn.jakechampion.name/item/44052295 — S (200; HN mirror)
55. https://hn.jakechampion.name/reader/https://github.com/RobViren/kvoicewalk — S (200; README mirror; official README used directly)
56. https://bittide.aicompass.dev/article/9dd596d2-4520-4396-949d-0837ea628e68?locale=en — B (timeout; Derpy Turtle RVC article, not read)
57. https://synapsesocial.com/papers/W7161162899 — B (429; Vercel challenge)
58. https://redlib.cypherpunktools.com/r/LocalLLaMA/comments/1ks0arl/... — B (TLS certificate error)
59. https://github.qingwei-s.workers.dev/RobViren/kvoicewalk/pull/7 — P (mirror of PR #7; 56.8-min run, conflict noted)
60. https://relatedrepos.com/gh/RobViren/kvoicewalk — S (200)

Search 4b (Kokoro and paper screens, from later queries):
61. https://arxiv.org/pdf/2110.05798 — A (abstract read at arxiv.org/abs/2110.05798)
62. https://arxiv.org/pdf/2303.11816 — A (abstract read at arxiv.org/abs/2303.11816)
63. https://betterstack.com/community/guides/ai/kitten-tts-2.md — S (200; third-party)
64. https://www.alphaxiv.org/abs/2606.07240 — S (200; IWSLT 2026 cross-lingual cloning; not used)
65. https://arxiv.org/html/2605.05611 — S (200; X-Voice; not used)
66. https://arxiv.org/pdf/2603.10904 — A (PDF text not extracted; read at arxiv.org/html/2603.10904v1)
67. https://arxiv.org/html/2603.10904v1 — P (used)
68. https://www.alphaxiv.org/abs/2606.07240.md — S (200)
69. https://www.opentrain.ai/papers/when-fine-tuning-fails-... — S (200; mirror)
70. https://www.wizwand.com/paper/69b2488fd030084c22e2f8ef — S (200; mirror)
71. https://pypi.org/project/pyttsx4/3.0.9 — B (challenge page)
72. https://pypi.org/project/TTS/0.14.3 — B (challenge page)
73. https://packages.ecosyste.ms/registries/pypi.org/keywords/pytts — S (200; unrelated)
74. https://www.piwheels.org/project/outetts — S (200; unrelated)
75. https://packages.ecosyste.ms/registries/pypi.org/packages/en-tts — S (200; unrelated)
76. https://socket.dev/pypi/package/primitive-tts — S (200; unrelated)
77. https://www.everydev.ai/tools/kitten-tts/llms.txt — B (429; challenge)
78. https://pypi.python.org/project/voxpopuli/0.1/ — B (challenge)
79. https://hiplab.mc.vanderbilt.edu/git/Medix-AI/coqui-tts/... — B (TLS certificate expired)

Search 5 (Supertonic):
80. https://mer.vin/medium/supertonic-3-99m-on-device-tts-... — S (200; third-party)
81. https://github.com/supertone-inc/supertonic — P (raw README used; redirects to archive)
82. https://huggingface.co/q3146dq4/supertonic-3 — S (200; mirror)
83. https://huggingface.co/LeeAeron/supertonic-3 — S (200; mirror)
84. https://huggingface.co/Vocabook/supertonic-3 — S (200; mirror)
85. https://huggingface.co/i2so/supertonic-3 — S (200; mirror)
86. https://huggingface.co/mlx-community/supertonic-3-mlx — S (200)
87. https://huggingface.co/lnkiai/supertonic-3-mirror — S (200; mirror)
88. https://huggingface.co/saymynameX1/supertonic-3 — S (200; mirror)
89. https://huggingface.co/mlx-community/supertonic-3 — S (200)

Search 6 (KittenTTS):
90. https://betterstack.com/community/guides/ai/kitten-tts-2/ — S (200; third-party)
91. https://github.com/xtrigg/KittenTTS — S (200; fork)
92. https://github.com/KittenML/KittenTTS — P (raw README used)
93. https://huggingface.co/onnx-community/kitten-tts-nano-0.1-ONNX/blob/987b2627.../README.md — S (200; v0.1)
94. https://huggingface.co/KittenML/kitten-tts-nano-0.1/tree/main — S (200)
95. https://dev.to/jaainil/kitten-tts-the-25mb-ai-voice-model-... — S (200; third-party)
96. https://cdn.jsdelivr.net/npm/kitten-tts-js@0.1.2/NOTICE — S (200)
97. https://huggingface.co/netbadass/kitten-tts-2 — S (200; unknown owner)
98. https://andrew.ooo/posts/kittentts-review-cpu-text-to-speech-voice-cloning/ — S (200; third-party; licence claim unverified)
99. https://huggingface.co/palshub/kitten-tts-mini-0.8 — S (200)
100. https://tts.ai/voices/kitten-tts/?lang=uz — S (200; aggregator)
101. https://huggingface.co/spaces/webml-community/KittenTTS-web/blob/main/README.md — S (200)
102. https://www.sourcepulse.org/projects/11096489 — S (200)

Search 7 (NeuTTS):
103. https://pypi.org/project/neutts/1.1.0/ — B (challenge)
104. https://www.spheron.network/blog/neutts-air-spheron-voice-ai/ — S (200; third-party benchmark)
105. https://github.com/neuphonic/neuTTS — P (raw README and TRAINING.md used)
106. https://pypi.org/project/neutts/0.1.2/ — B (challenge)
107. https://github.com/Tavus-Engineering/neutts-air — S (200; fork)
108. https://pypi.org/project/neutts/1.0.0/ — B (challenge)
109. https://github.com/nociza/neutts-air — S (200; fork)
110. https://github.com/agentisx/neutts-air — S (200; fork)
111. https://docs.rs/crate/neutts/0.1.0/source/README.md — S (200; Rust crate)
112. https://docs.rs/crate/neutts/0.0.7/source/README.md — S (200)
113. https://github.com/goodtab/neutts-air — S (200; fork)
114. https://huggingface.co/BricksDisplay/NeuTTS-Air-GGUF — S (200; community GGUF)
115. https://www.scriptbyai.com/on-device-voice-cloning-neutts-air — B (HTTP 202, empty body)
116. https://localclaw.io/tts/neutts-air — S (200; third-party; licence claim unverified)
117. https://hyper.ai/en/notebooks/45446 — S (200; third-party; timing claim unverified)
118. https://docs.rs/crate/neutts/0.1.1 — S (200)
119. https://docs.rs/crate/neutts/0.0.4/source/README.md — S (200)
120. https://www.sourcepulse.org/projects/16111448 — S (200)

Search 8 (Pocket TTS):
121. https://github.com/kyutai-labs/pocket-tts — P (raw README, training README, LICENSE, italian_24l.yaml used)
122. https://pypi.org/project/pocket-tts/1.0.0/ — B (challenge)
123. https://kyutai-labs.github.io/pocket-tts — P (WebFetch summary; secondary)
124. https://pypi.org/project/pocket-tts/1.0.2/ — B (challenge)
125. https://dev.to/andrew-ooo/pocket-tts-review-kyutais-100m-cpu-voice-cloner-2026-40lb — B (404)
126. https://pypi.org/project/pocket-tts/ — B (challenge)
127. https://tts.ai/voices/pocket-tts/?lang=th — S (200; aggregator)
128. https://tts.ai/voices/pocket-tts/?lang=vi — S (200; aggregator)
129. https://tts.ai/voices/pocket-tts/?lang=mi — S (200; aggregator)
130. https://tts.ai/voices/pocket-tts/?lang=gu — S (200; aggregator)
131. https://tts.ai/voices/pocket-tts/?lang=uk — S (200; aggregator)
132. https://tts.ai/voices/pocket-tts/?lang=gn — S (200; aggregator)
133. https://tts.ai/voices/pocket-tts/?lang=it — S (200; aggregator; says EN and FR, conflict noted)
134. https://tts.ai/voices/pocket-tts/?lang=fr — S (200; aggregator)
135. https://tts.ai/voices/pocket-tts/?lang=ja — S (200; aggregator)
136. https://tts.ai/voices/pocket-tts/?lang=sv — S (200; aggregator)
137. https://tts.ai/voices/pocket-tts/?lang=tl — S (200; aggregator)
138. https://tts.ai/voices/pocket-tts/?lang=et — S (200; aggregator)
139. https://gh.hhj520.top/CatchNip/pocket-tts — B (DNS failure)

Search 9 (Kokoro community and "mean of means"):
140. https://huggingface.co/spaces/ysharma/Make_Custom_Voices_With_KokoroTTS/commit/e8263b3f... — S (200; community; not used)
141. https://huggingface.co/geneing/Kokoro/commit/3767727882dd08a67a1b91a7513c28dc3887a9e9 — S (200; community)
142. https://huggingface.co/onnx-community/Kokoro-82M-ONNX/blob/529d6138.../README.md?code=true — S (200)
143. https://huggingface.co/spaces/ysharma/Make_Custom_Voices_With_KokoroTTS/blame/b869fc97.../README.md — S (200)
144. https://huggingface.co/software-mansion/react-native-executorch-kokoro/blob/main/README.md — S (200; redirects to ExecuTorch repo)
145. https://huggingface.co/geneing/Kokoro/commit/b08fa2292f7aba5d98e001a24ab68a2ddc46d97e — S (200; community)
146. https://huggingface.co/hexgrad/Kokoro-82M/blob/main/README.md — S (200; same as raw main)
147. https://huggingface.co/AHDeveloperAI/minimax-speech-03-hd/blob/main/README.md — S (200; derivative card)
148. https://huggingface.co/mlboydaisuke/Kokoro-82M-ExecuTorch — S (200)
149. https://huggingface.co/simonfxr/kokoro.cpp-GGUF — S (200)
150. https://huggingface.co/hexgrad/Kokoro-82M/tree/main — S (200; file tree)
151. https://pypi.org/project/kokoro/0.2.1/ — B (challenge)
152. https://huggingface.co/jeevav62/kokoro-82m-indian-en — B (401; "404")
153. https://huggingface.co/Thorsten-Voice/Kokoro — P (community; used)
154. https://huggingface.co/BH-Builds/goonj-1-82M — P (community; used)
155. https://together.ai/models/kokoro-82m — S (200; pricing; redirect)
156. https://huggingface.co/geneing/Kokoro — S (200)
157. https://huggingface.co/erenyeager-1/Kokoro-82M — S (200; not used)

Search 10 (StyleTTS 2):
158. https://bohrium.dp.tech/paper/arxiv/2306.07691 — B (404)
159. https://pypi.org/project/styletts2/0.1.3 — B (challenge)
160. https://pypi.org/project/styletts2 — B (challenge)
161. https://huggingface.co/papers/2306.07691 — S (200; paper page)
162. https://pypi.org/project/styletts2/0.1.4 — B (challenge)
163. https://arxiv.org/abs/2306.07691v2 — P (dates and zero-shot claim)
164. https://liner.com/review/styletts-2-towards-humanlevel-... — S (200; third-party)
165. https://www.emergentmind.com/papers/2306.07691 — S (200; third-party)
166. https://nips.cc/virtual/2023/poster/70566 — P (confirms NeurIPS 2023)
167. https://sotaverified.org/papers/styletts-2-towards-human-level-text-to-speech — B (429; challenge)

Totals: 167 search URLs. P or A: 22 entries (12, 31, 35, 51, 59, 61, 62, 66, 67, 81, 92, 105, 121, 123, 153, 154, 163, 166, 61/62/66 abstract routes). B: 33. S: the rest.

### B. Direct sources opened (not in search results)

- Klein: `huggingface.co/klein-ml/Klein-TTS-X1.5-Pro/raw/main/{README.md, config.json, LICENSE, modeling_klein_tts.py}` and `.../onnx/model.json` — P (raw). `huggingface.co/api/models/klein-ml/Klein-TTS-X1.5-Pro` — P. `huggingface.co/api/models?author=klein-ml` — P (org listing). `huggingface.co/api/models/klein-ml/{Klein-TTS-X1.5-Small-Checkpoints, Klein-TTS-X1.5-Flash-Lite, asr-training-models}` — P (API). `.../Klein-TTS-X1.5-Small-Checkpoints/raw/main/README.md` — B (401, restricted). `huggingface.co/kleinml` — B (404). `kleinml.com` — P (WebFetch summary only). `registry.npmjs.org/@kleinml%2Fkleintts` — P. `registry.npmjs.org/@kleinml/kleintts/-/kleintts-0.2.0.tgz` — P (extracted to npm-pkg/package; inference-only). `www.npmjs.com/package/@kleinml/kleintts` — B (403). `pypi.org/pypi/kleintts/json` — P.
- Kokoro: `huggingface.co/hexgrad/Kokoro-82M/raw/main/README.md` — P. `raw.githubusercontent.com/hexgrad/kokoro/main/README.md` — P. `raw.githubusercontent.com/hexgrad/kokoro/main/kokoro/{pipeline.py, model.py}` — P. `api.github.com/repos/hexgrad/kokoro` and `/contents` and `/contents/kokoro` — P. `huggingface.co/hexgrad/Kokoro-82M/raw/main/{VOICES.md, EVAL.md}` — P. `huggingface.co/hexgrad/Kokoro-82M/resolve/main/voices/af_heart.pt` — P (measured). `huggingface.co/api/models/hexgrad/Kokoro-82M` — P. `huggingface.co/hexgrad/kLegacy/raw/main/v0.19/{README.md, demo/restoring-sky.md}` — P. `huggingface.co/api/models/hexgrad/kLegacy` — P. `huggingface.co/posts/hexgrad/418806998707773` — P (6 Jan 2025 post).
- KVoiceWalk: `raw.githubusercontent.com/RobViren/kvoicewalk/main/README.md` — P. `api.github.com/repos/RobViren/kvoicewalk` — P.
- Community Kokoro: `github.com/semidark/kikiri-tts` raw README, `docs/TRAINING_GUIDE.md`, API — P. `huggingface.co/akhaliq/Ming-Kokoro-82M/raw/main/README.md` — P. `huggingface.co/BH-Builds/goonj-1-82M/raw/main/README.md` — P. `huggingface.co/Thorsten-Voice/Kokoro/raw/main/README.md` — P.
- StyleTTS 2: `raw.githubusercontent.com/yl4579/StyleTTS2/main/README.md` — P. `api.github.com/repos/yl4579/StyleTTS2` — P. `arxiv.org/abs/2110.05798`, `arxiv.org/abs/2303.11816`, `arxiv.org/abs/2408.17068`, `arxiv.org/html/2408.17068v5` — P (abstracts; html for model identity).
- Piper: `raw.githubusercontent.com/OHF-Voice/piper1-gpl/main/README.md`, `docs/TRAINING.md`, `docs/LICENSING.md`, `docs/COMMERCIAL_USE.md`, `docs/VOICES.md` — P. `raw.githubusercontent.com/rhasspy/piper/master/README.md` — P (archive notice). `api.github.com/repos/OHF-Voice/piper1-gpl` and `/repos/rhasspy/piper` — P. `huggingface.co/api/datasets/rhasspy/piper-checkpoints` — P. `huggingface.co/api/models/rhasspy/piper-voices/tree/main/it/it_IT` — P (tree). `huggingface.co/datasets/rhasspy/piper-checkpoints/raw/main/it/it_IT/{paola/medium, serena/medium, serena/high}/MODEL_CARD`, and `serena/{medium,high}/train.sh` — P. `huggingface.co/rhasspy/piper-voices/raw/main/it/it_IT/riccardo/x_low/MODEL_CARD` — P. `huggingface.co/api/datasets/rhasspy/piper-voices` — B (401).
- Small TTS: `github.com/supertone-oss-archive/supertonic` raw README (via redirect) — P. `huggingface.co/Supertone/supertonic-3/raw/main/README.md` and `api/models/Supertone/supertonic-3` — P. `huggingface.co/KittenML/kitten-tts-2/raw/main/README.md` and API — P. `raw.githubusercontent.com/KittenML/KittenTTS/main/README.md`, `docs/kitten-tts-2-tiny.md`, and `api.github.com/repos/KittenML/KittenTTS` — P. `raw.githubusercontent.com/neuphonic/neutts/main/{README.md, TRAINING.md, LICENSE}` and API — P. `huggingface.co/api/models/neuphonic/neutts-air` — P. `huggingface.co/neuphonic/neutts-air/raw/main/README.md` — B (401). `raw.githubusercontent.com/kyutai-labs/pocket-tts/main/{README.md, training/README.md, LICENSE, pocket_tts/config/italian_24l.yaml}` — P. `api.github.com/repos/kyutai-labs/pocket-tts` — P. `huggingface.co/api/models/kyutai/pocket-tts` — P. `huggingface.co/kyutai/pocket-tts/raw/main/README.md` — B (401). `kyutai.org/blog/2026-01-13-pocket-tts` — WebFetch, headline only (body not retrievable).
- Speaker tools: `huggingface.co/api/models/{speechbrain/spkrec-ecapa-voxceleb, microsoft/wavlm-base-plus-sv, microsoft/wavlm-base-plus, pyannote/wespeaker-voxceleb-resnet34-LM}` — P. Raw READMEs of the first three and pyannote — P. `resolve/main/...` HEAD requests for model sizes — P. `api.github.com/repos/resemble-ai/Resemblyzer` and `raw.githubusercontent.com/resemble-ai/Resemblyzer/master/README.md` — P. `pypi.org/pypi/Resemblyzer/json` — P. `pypi.org/pypi/speechbrain/json` and `api.github.com/repos/speechbrain/speechbrain` — P. `api.github.com/repos/microsoft/UniSpeech` and `raw.githubusercontent.com/microsoft/UniSpeech/main/LICENSE` — P (licence text, CC BY-SA 3.0).

### C. Local artifacts (absolute paths)

- Downloads and extractions: `/tmp/kr-run1/` (Klein: `2cd4a07c.out` README, `kl-config.json`, `kl-modeling.py`, `kl-pro-onnx-model.json`, `npm-pkg/package/`; Kokoro: `kokoro-*.md`, `kokoro-pipeline.py`, `kokoro-af_heart.pt`, `kl-v019-*.md`; Piper: `piper1-*.md`, `ck_*`; subfolders `sm/` (small TTS), `spk/` (speaker tools), `kvw/` (KVoiceWalk), `kok/` (Kokoro community), `papers/` (arXiv), `sup/` (Supertone card)).
- Search-result sweep: `/tmp/kr-run1/search_urls.txt` (167 URLs), `/tmp/kr-run1/sweep/NNN.bin` (bodies), `/tmp/kr-run1/sweep_index.json` (status, final URL, title, keyword counts), `/tmp/kr-run1/sweep_table.txt` (summary table).
- Scripts: `/tmp/kr-scripts/sweep.py` (the only script written; kept outside the download folders).