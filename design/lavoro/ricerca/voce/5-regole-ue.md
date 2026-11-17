# EU rules and practice for local voice cloning: evidence as of 17 November 2026

## 0. Access and quote notes

- **Official sources read:** the Commission's AI Act Service Desk (Articles 2, 50 and 99, text as at 27 July 2026); the Commission Article 50 guidelines (page dated 20 July 2026, updated 5 November 2026; the PDF I read is dated 5 November 2026); the Commission FAQ on Article 50 (last updated 24 July 2026); the Commission Code of Practice pages (10 June 2026); EDPB Guidelines 02/2021 (7 July 2021) and Opinion 28/2024 (17 December 2024); the Garante decision of 18 December 2025 (n. 789); Law 132/2025 in the Gazzetta Ufficiale PDF; the Estonian DPA (AKI) yearbook PDF; the Apple, ElevenLabs and Microsoft official documentation; the Resemble consent page; and the GitHub, arXiv and Hugging Face pages of the watermarking tools.
- **Not reachable with my tools:** every EUR-Lex URL (all returned empty), the curia text of C-212/13, EDPB Guidelines 3/2019 (404), the Google Meet codec developer page (404), the ElevenLabs help article (403), and an official Microsoft Teams codec page (not found).
- **Quote labels:**
  - [PDF-text]: extracted from an official PDF saved locally. Verbatim, but with extraction artefacts.
  - [fetch]: returned by the fetch tool's page conversion. Near-verbatim, not checked against the original; verify before quoting in any legal document.
  - [snippet]: search result only, not opened.

## 1. AI Act, Article 50

**Dates**
- Article 50 applies from 2 August 2026 (Commission Code page, 10 June 2026; Commission guidelines page, 20 July 2026).
- Omnibus: Regulation (EU) 2026/1744. EFTA-EEA metadata gives the Commission proposal as COM(2025) 836 (19 November 2025), adoption on 8 July 2026, and a compliance date of 27 July 2026 (https://www.efta.int/eea-lex/32026r1744). The Official Journal date of 24 July 2026 is shown only as a link label on that page; the OJ text was not read.
- Grace period, per the Commission FAQ [fetch] and the guidelines [PDF-text]: only the Article 50(2) marking and detection duty is deferred, and only for generative systems "placed on the market or put into service before 2 August 2026", until 2 December 2026. The guidelines add that the disclosure duty for systems interacting directly with people applies from 2 August 2026. Content generated before 2 August 2026 need not be marked retroactively.
- Secondary sources [snippet] also describe Annex III high-risk duties moving to 2 December 2027 and Annex I to 2 August 2028. Not verified against the OJ.

**Article 50(2): marking duty**
- [fetch, Service Desk Art. 50, https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50, text as at 27 July 2026]: providers of systems generating synthetic audio, image, video or text must mark outputs "in a machine-readable format and detectable as artificially generated or manipulated", with solutions "effective, interoperable, robust and reliable as far as this is technically feasible".
- Exceptions in Article 50(2) [fetch, same page]: (1) the system performs an assistive function for standard editing; (2) it does not substantially alter the deployer's input data or its semantics; (3) law-enforcement authorisation.
- Guidelines [PDF-text, https://ec.europa.eu/newsroom/dae/redirection/document/131215, "C(2026) 7702", 5 November 2026]:
  - Article 50(2) "applies to AI systems ... generating synthetic audio, image, video or text content". Manipulation of existing content is also covered, e.g. "an existing image or a voice recording that is manipulated by an AI system in accordance with human instructions".
  - Among minor alterations that benefit from the exception: "AI-generated content that only transforms authentic human input through assistive technologies allowing persons with disabilities to communicate (e.g., augmentative and alternative communication (AAC) or customized neural voices (CNV)) since they do not alter semantically the meaning of the content."
  - Among semantic changes that require marking: "Synthesis of realistic speech in a specific person's voice, or generation of realistic video depicting events that did not occur".
  - Standard editing "does not involve generating new content" (footnote 90).
  - Where a system can be used for both generation and minor non-substantial alteration, the duty does not apply to the minor-altered content (footnote 92).
- Marking techniques, per the guidelines [PDF-text]:
  - Recital 133 examples: "watermarks, metadata identifications, cryptographic methods for proving provenance and authenticity of content, logging methods, fingerprints or other techniques, and a combination".
  - Machine-readable marks "that are not perceivable by users" are listed among techniques that are "not necessary and, when used alone, insufficient" for Article 50(1) and (5), but "does not affect the appropriateness of such marks to comply with Article 50(2)".
  - "Robustness refers to the capability of the technical solution to ... identify ... under varying conditions, covering both common alterations and adversarial attacks."
  - The requirements apply "insofar as this is technically feasible", taking into account "costs of implementation, and the generally acknowledged state of the art" (footnote 80).

**Deepfakes and deployers (Article 50(4))**
- The guidelines [PDF-text] list "AI-generated audio involving voice cloning of a newspaper a guest interlocutor discussing some news events" as a deepfake example.
- Deepfake criteria are cumulative: resemblance ("a high level of similarity"), an existing subject, and content that "would falsely appear to a person to be authentic or truthful" (Article 3(60)).
- Timing: disclosure "at the latest at the time of the first interaction or exposure" [fetch, Article 50 Service Desk page].
- Personal non-professional use: Article 2(10) excludes deployers who are natural persons using AI in a purely personal, non-professional activity [fetch, https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-2]. The guidelines say economic benefit on a regular basis, or a professional role, falls outside this [PDF-text, section 2.4.1].

**Open source and free distribution**
- Article 2(12): AI systems released under free and open-source licences are outside the Act "unless" they are high-risk or fall under Article 5 or 50 [fetch, Service Desk Art. 2]. Guidelines [PDF-text, section 2.4.3, para 23]: such systems are outside scope "provided they do not fall under the prohibitions of Article 5 AI Act or the transparency obligations of Article 50 AI Act". FOSS components that are not AI systems in themselves have no Article 50 duties (para 24).
- Article 3(3), as quoted in the guidelines [PDF-text, section 2.3]: providers place systems on the market "whether for payment or free of charge".
- Guidelines [PDF-text, example in section 2.3]: "a company provides a generative or interactive AI application ... on the Union market under its own name or trademark to consumers ..."
- Footnote 6 [PDF-text]: a company that takes an existing generative AI system from another provider and modifies it, then puts it into service under its own name, "becomes a provider of the new system".

**Penalties**
- Article 99(4)(g): up to EUR 15,000,000 or 3% of worldwide annual turnover, whichever is higher; for SMEs, the lower of the two (Article 99(6)) [fetch, https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-99].

**Code of Practice on marking and labelling AI-generated content**
- Final text published 10 June 2026 [fetch, https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content].
- Voluntary. "The Commission and the AI Board have confirmed that the code is an adequate voluntary tool to demonstrate compliance" (no date on the page). About 190 organisations had signed "by the end of July 2026" [fetch, https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content].
- Two sections: Section 1 "Rules for marking and detection of AI-generated and manipulated content" (providers); Section 2 "Rules for labelling of deepfakes and AI-generated and manipulated text" (deployers).
- The policy page names no specific watermark technique. Secondary sources describe layered marking with at least two marks [snippet; not verified against the Code text, which was not retrieved].
- Timeline on the page: kick-off 5 November 2025; first draft 17 December 2025; second draft 3 March 2026; draft Article 50 guidelines 8 May 2026; final 10 June 2026.

**Commission guidelines**
- Commission guidelines page: published 20 July 2026, last updated 5 November 2026. It calls itself practical guidance [fetch, https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems].
- The PDF I read is "Brussels, 5.11.2026 C(2026) 7702 final", titled "Guidelines on the implementation of the transparency obligations for certain AI systems" [PDF-text]. Secondary sources cite a 20 July version as "C(2026) 5054"; I did not read that version, so the two references are unreconciled.

**Commission FAQ**
- Last updated 24 July 2026 [fetch, https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act]. It states the grace period covers only marking and detection, and that providers "must comply with those obligations only as from 2 December 2026".

## 2. GDPR: personal data, biometric data, household exemption

**Voice as personal and biometric data**
- Garante, decision of 18 December 2025, n. 789, doc. web 10207132 [fetch, https://www.garanteprivacy.it/home/docweb/-/docweb-display/print/10207132]:
  - Voice and images of a person "rientrano nella definizione di cui all'art. 4 punto 1)" (are within the Article 4(1) definition of personal data).
  - Voice or image data is biometric only if specific criteria are met; it is not automatic.
  - The decision is a warning under Article 58(2)(a) GDPR, addressed to persons who "utilizzano" these services as controllers or processors. It flags fraud, defamation and identity theft.
  - Development and design stage: the Garante suggests considering data protection "sin dalla fase di sviluppo, progettazione, selezione e utilizzo" (Recital 78, Article 25).
  - Publication in the Gazzetta Ufficiale is ordered; the GU issue date of 8 January 2026 is from a search snippet only.
- EDPB Guidelines 02/2021 on virtual voice assistants, v2.0, adopted 7 July 2021 [PDF-text, https://www.edpb.europa.eu:443/system/files/2021-07/edpb_guidelines_202102_on_vva_v2.0_adopted_en.pdf]:
  - Para 31: "The EDPB recalls that voice data is inherently biometric personal data." (footnote 14).
  - Same para: where such data is processed "for the purpose of uniquely identifying a natural person or is inherently or determined to be special category personal data", a valid Article 6 basis and an Article 9 derogation are required; "Explicit consent may be one of the appropriate derogations" (section 3.7).
  - Para 132: "biometric recognition is only activated at each use at the user's initiative, and not by a permanent analysis of the voices heard by the assistant".
  - Scope: these passages concern voice assistants and speaker recognition in households, not voice cloning.
- AKI yearbook (Estonian DPA) [PDF-text, https://aastaraamat.aki.ee/sites/default/files/Andmekaitseinspektsioon_AR_uus.pdf]: the GDPR defines biometric data as data obtained by technical means about physical, physiological and behavioural characteristics "mis võimaldavad inimest kordumatult tuvastada" (allowing unique identification of the person). The yearbook's year is unclear; its text mentions "2019 aastaraamat". No passage on voice or deepfakes was found.

**Trained models**
- EDPB Opinion 28/2024, adopted 17 December 2024 [PDF-text, https://www.edpb.europa.eu/system/files/2024-12/edpb_opinion_202428_ai-models_en.pdf]:
  - Para 34: "AI models trained on personal data cannot, in all cases, be considered anonymous. Instead, the determination ... should be assessed ... on a case-by-case basis."
  - Para 43: for anonymity, both the likelihood of extraction of training data and the likelihood of obtaining such data from queries "should be insignificant for any data subject".
  - General to AI models; not voice-specific.
- Vendor claim (not a legal determination): Microsoft says a voice model "does not contain audio recordings" and "cannot be reverse engineered" to construct them [fetch, https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/disclosure-voice-talent, ms.date 2026-03-31].

**Household exemption**
- Article 2(2)(c) GDPR: text not verified. EUR-Lex was unreachable.
- CJEU C-212/13 Ryneš, decided 11 December 2014 under Directive 95/46 [fetch, FRA summary, https://fra.europa.eu/en/caselaw-reference/cjeu-c-21213-judgment]: a home camera that also monitors public space falls outside the household exemption; the exception "must be narrowly construed". The curia text (infocuria redirect) returned no content.
- EDPB Guidelines 3/2019 on video devices: the PDF returned 404 and the landing page has no household text. Not verified.

**EDPB on voice cloning**
- No EDPB document specific to voice cloning or deepfakes was found.
- EDPB news of 8 July 2026 [fetch, https://www.edpb.europa.eu/news/edpb-sheds-light-on-anonymisation-and-web-scraping-for-generative-ai-and-adopts-final-version_sv, Swedish auto-translation]:
  - The anonymisation and web-scraping-for-generative-AI guidelines are v1, adopted but not final, with consultation until 30 October 2026.
  - The blockchain guidelines are the final version.
  - Web scraping of special-category data needs an Article 6 basis and an Article 9 exception.
  - The page does not mention voice or likeness.

**Italian criminal law (not an EU rule)**
- Law 132/2025 (GU n. 223, 25 September 2025; in force 10 October 2025), art. 26(1)(c), inserts art. 612-quater c.p. [PDF-text, https://www.gazzettaufficiale.it/eli/gu/2025/09/25/223/sg/pdf]:
  - Punishes anyone who causes unjust harm "cedendo, pubblicando o altrimenti diffondendo, senza il suo consenso, immagini, video o voci falsificati o alterati mediante l'impiego di sistemi di intelligenza artificiale e idonei a indurre in inganno sulla loro genuinità" (by transferring, publishing or otherwise disseminating, without consent, falsified or altered images, videos or voices made with AI systems and capable of deceiving as to their authenticity).
  - Penalty: reclusione da uno a cinque anni (one to five years).
  - Prosecutable on the victim's complaint (querela), with exceptions.

## 3. Consent and misuse controls in official documentation

- **Apple Personal Voice** [fetch, https://support.apple.com/en-us/104993, published 13 October 2025]:
  - The user reads "a series of sentences aloud"; "Your recorded speech is then processed securely on device."
  - Device authentication is required: "Your device must be set up to use Face ID, Touch ID, or a device passcode or password."
  - Use is limited to "using only your own voice" and "only for your own personal, non-commercial use".
  - No phrase count and no speaker check beyond the recorded sentences. Third-party guides give 150 phrases and 15–30 minutes; not confirmed by Apple.
- **ElevenLabs Professional Voice Cloning** [fetch, https://elevenlabs.io/docs/product/voices/voice-lab/professional-voice-cloning, no date visible]:
  - "All Professional Voice Clones require a verification process to confirm that the voice belongs to you."
  - "Read each verification line only once"; reading more than once "can cause the verification process to fail".
  - "For now, we only allow you to clone your own voice." "Even with their consent, you cannot clone someone else's voice."
  - Pass criteria are not stated. The page does not say verification cannot prove ownership.
- **Microsoft Custom Neural Voice** [fetch, https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/limited-access, ms.date 2026-03-31]:
  - Limited Access, by registration and only for approved use cases.
  - Customers must warrant "explicit written permission from voice talent prior to creating a voice model".
  - A recorded acknowledgement statement is required. "Microsoft reserves the right to use Microsoft's speaker recognition biometric identification technology on this recorded acknowledgement statement and verify it against the training audio data."
  - Customers must disclose "the synthetic nature of the service to users".
  - The disclosure page [fetch, https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/disclosure-voice-talent, ms.date 2026-03-31] lists "ALS-afflicted individuals preserving their voices" as appropriate use.
- **Resemble AI** [fetch, https://www.resemble.ai/our-commitment-to-consent, dated 4 September 2024]:
  - "No permission? No voice cloning. Simple as that."
  - A consent clip and Resemblyzer, "an open-source speaker verification model", to check that the consenting person matches the dataset.
  - Mismatch handling and written consent are not described.
  - A Google Docs copy of a Resemble DPA dated 17 March 2026 places consent on the customer; not an official Resemble page and not verified.

## 4. Open-source audio watermarking

| Tool | Licence (code / weights) | Sample rate | Size and CPU | Codec evidence | Sources and dates |
|---|---|---|---|---|---|
| AudioSeal (Meta) | MIT / MIT (README note 2024-04-02; HF tag "mit") | 16 kHz per HF; README also lists 16/24 kHz and 44.1/48 kHz | No size stated. Paper timings on a single Nvidia Quadro GP100 GPU; no CPU figures | Paper Table 3: MP3 32 kbps accuracy 1.00; AAC 64 kbps 1.00; EnCodec 0.98; resampling 32 kHz 1.00; white noise 0.91; highpass 0.61. No Opus. README: AudioSeal 0.2 on 2024-12-12 | github.com/facebookresearch/audioseal; huggingface.co/facebook/audioseal; arxiv.org/html/2401.17264v2 |
| SilentCipher (Sony AI) | MIT / not stated on repo page | 16 kHz and 44.1 kHz | No size stated. Paper runtimes on A100 GPU; repo example uses CUDA, CPU optional. Training code "still" being released | Table 1 (6 s, SC-16): MP3 64 kbps 96%; AAC 64 kbps 94.55%; other MP3/OGG/AAC settings 100%. No Opus. arXiv 2406.03822 (June 2024; INTERSPEECH 2024) | github.com/sony/silentcipher; arxiv.org/html/2406.03822v2 |
| WavMark | MIT / no separate statement | Single-channel 16 kHz WAV | 32 bits per 1 s (about 16 user bits per second per README). No size. Sample code falls back to CPU | README names MP3, Gaussian noise, low-pass, speed variation. No Opus. Paper: WavMark MP3 32 kbps 1.00; EnCodec at chance (0.51) | github.com/wavmark/wavmark; arxiv.org/abs/2308.12770 (search snippet only) |
| Timbre (NDSS 2024) | GPL-3.0 code / pretrained watermark weights not mentioned | Not verified | Not verified | Evaluated in AudioMarkBench; no codec numbers gathered | github.com/TimbreWatermarking/TimbreWatermarking; arxiv.org/pdf/2312.03410 (search only) |
| Resemble Perth (Perth-Net implicit) | MIT / not verified | Not stated | GPU example shown; CPU not confirmed; no size | Claims "survive common audio transformations like compression, resampling"; no numbers | github.com/resemble-ai/Perth (no date visible) |
| VocBulwark (arXiv 2601.22556, 30 January 2026) | Not verified | Not verified | Not verified | Abstract only; codec numbers not verified | arxiv.org/abs/2601.22556 |
| CRAW (arXiv 2609.03107, 2 September 2026) | Not verified | Not verified | No CPU claim in abstract | Claims state-of-the-art against neural codecs; no codec named in abstract | arxiv.org/abs/2609.03107 |

**Robustness scope:** I found no published robustness result for Opus, the codec behind Zoom's audio, in any of the three main tools' own papers or repositories. The one Opus result is AudioMarkBench (NeurIPS 2024 Datasets and Benchmarks, PDF, text extracted locally). It tests Opus at 16–256 kbps and tests three methods: AudioSeal-B, Timbre and WavMark. It states: "when ViSQOL is no smaller than 3, EnCodec, SoundStream, and Opus achieve very high FNRs, indicating that those perturbations can remove watermarks from watermarked audios while preserving the audio quality." Table values were not extracted.

## 5. Opus, Zoom, Teams and Meet

- Zoom, official library page, undated [fetch, https://library.zoom.com/admin-corner/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage]: "Opus and SILK codecs are used for audio communications in Zoom Meetings and Webinars"; both "are adaptive, dynamically adjusting their bitrates to real-time network conditions". No sample rates given.
- RFC 6716, Opus, IETF Standards Track, September 2012 [fetch, https://www.rfc-editor.org/rfc/rfc6716]: bitrates 6–510 kbit/s; effective sample rates 8, 12, 16, 24 and 48 kHz; frame sizes 2.5–60 ms.
- Microsoft Teams: no official current codec page found. A Microsoft Tech Community post dated 17 February 2021, updated 24 August 2022 [fetch, https://techcommunity.microsoft.com/t5/microsoft-teams-blog/satin-microsoft-s-latest-ai-powered-audio-codec-for-real-time/ba-p/2141382], says Satin "is already being used for all Teams and Skype two-party calls" and "will roll out for Teams meetings soon". It says SILK "served us well as the default codec for Skype and Microsoft Teams". It does not say Satin is the default.
- Google Meet: the official developer codec page returned 404. The Workspace network page [fetch, https://knowledge.workspace.google.com/admin/meet/prepare-your-network-for-meet-meetings-and-live-streams?hl=en, "Last updated 2026-11-10 UTC"] names no audio codec; audio-only bandwidth is 12 kbps up and 18 kbps down for large organisations (average), and 100 kbps for small organisations or individuals.
- Gap: no benchmark found under real-time VoIP or WebRTC conditions (packet loss, jitter, FEC).

## 6. Conflicts and their scope

- **Guidelines reference:** C(2026) 5054 of 20 July 2026 (secondary sources) versus C(2026) 7702 of 5 November 2026 (the PDF I read, on the Commission page updated 5 November). Which version is current, and whether the two differ in substance, is not established.
- **Grace-period scope:** one secondary source [snippet] says the extension covers all synthetic-content generators. The official FAQ and guidelines limit it to systems placed on the market or put into service before 2 August 2026, and to the marking duty only.
- **Apple Personal Voice:** phrase count (150) and time (15 to 30 minutes, or about an hour) come from third-party guides. Apple's page states neither.
- **ElevenLabs verification:** secondary sources describe a voice-captcha prompt, a recorded statement, and a concession that verification cannot prove ownership. The fetched official page describes "verification lines" and says nothing about proof limits.
- **EDPB anonymity threshold:** one secondary summary says "negligible" [snippet]; the Opinion text says "insignificant" (para 43).
- **Teams default codec:** Microsoft's 2021 post says SILK was the default; a February 2026 community post [snippet] says Satin. The latter is not an official source.
- **Anonymisation guidance:** a headline in EDPB news ("adopts final version") could be read as final guidelines; the body shows the anonymisation and web-scraping guidelines are v1, and only the blockchain guidelines are final.

## 7. Not verified or unanswered

- AI Act and Omnibus text: not read from EUR-Lex or the Official Journal. Article 2(10), 2(12), 3(60), 50 and 99 come from the Commission's own Service Desk pages, and Article 50 detail from the Commission guidelines PDF.
- Omnibus entry-into-force date: 27 July 2026 is from EFTA metadata and secondary sources only.
- Code of Practice full text: not retrieved; the Commission policy page is the source. The adequacy date (secondary: 8 to 9 July 2026) is not verified.
- Guidelines version C(2026) 5054: not read.
- Household exemption text (GDPR Article 2(2)(c)) and the EDPB Guidelines 3/2019 household section: not verified.
- Curia text of C-212/13: not retrieved.
- Garante decision n. 789 quotations: produced through the fetch tool's conversion, not checked against the PDF. GU publication date 8 January 2026: search snippet only.
- AKI: only the yearbook was read; no AKI guidance on voice or deepfakes was found. AKI replies were found only on a third-party host (adr-docs.karlerss.com) and were not used.
- Microsoft Teams and Google Meet codec use: not confirmed by official documentation.
- Watermark model sizes: not stated in any source read. CPU latency: not reported for CPU in the papers read.
- Perth weights licence and CPU support: not verified.
- Timbre pretrained weights and WavMark weights licence: not verified.
- Opus robustness numbers for AudioSeal, WavMark and Timbre: not extracted from AudioMarkBench tables. VocBulwark and CRAW: abstracts only.
- ElevenLabs help article: 403, not read.
- EDPB position specific to voice cloning: none found.

## 8. Inventory

### 8a. Pages opened (fetch, or text extracted from a saved PDF)

1. https://eur-lex.europa.eu/eli/reg/2026/1744/oj?locale=en. Empty render; blocked. Variant CELEX:32026R1744 also empty.
2. https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng. Empty; blocked.
3. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202401689. Empty; blocked.
4. https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202401689. Empty; blocked.
5. https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng. Blank; blocked.
6. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679. Blank; blocked.
7. https://digital-strategy.ec.europa.eu/en/news/commission-publishes-code-practice-marking-and-labelling-ai-generated-content. OK; dated 10 June 2026, updated 12 June 2026.
8. https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content. OK; timeline, adequacy statement, about 190 signatories by end July 2026.
9. https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act. OK; last updated 24 July 2026.
10. https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems. OK; published 20 July 2026, updated 5 November 2026.
11. https://ec.europa.eu/newsroom/dae/redirection/document/131215. OK via PDF text; "C(2026) 7702", 5 November 2026.
12. https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-transparency-obligations-under-ai-act. 404.
13. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50. OK; text as at 27 July 2026.
14. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-2. OK.
15. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-99. OK.
16. https://www.efta.int/eea-lex/32026r1744. Metadata only; adoption 8 July 2026, compliance date 27 July 2026, COM(2025) 836 on 19 November 2025.
17. https://www.efta.int/eea-lex/32024r1689. Metadata only.
18. https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-022021-virtual-voice-assistants_en. Landing page; no text.
19. https://www.edpb.europa.eu:443/system/files/2021-07/edpb_guidelines_202102_on_vva_v2.0_adopted_en.pdf. OK via PDF text; adopted 7 July 2021; paras 31, 132; fn 14; section 3.7.
20. https://www.edpb.europa.eu/our-work-tools/our-documents/opinion-board-art-64/opinion-282024-certain-data-protection-aspects_en. Landing; page date 18 December 2024. PDF gives adoption on 17 December 2024.
21. https://www.edpb.europa.eu/system/files/2024-12/edpb_opinion_202428_ai-models_en.pdf. OK via PDF text; adopted 17 December 2024; paras 34, 43.
22. https://www.edpb.europa.eu/news/edpb-sheds-light-on-anonymisation-and-web-scraping-for-generative-ai-and-adopts-final-version_sv. OK; Swedish auto-translation; 8 July 2026; v1 guidelines; blockchain guidelines final.
23. https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_en.pdf. 404.
24. https://www.edpb.europa.eu/system/files/2023-09/edpb_guidelines_201903_video_devices_v2.0_adopted_en.pdf. 404.
25. https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-32019-processing-personal-data-through-video_en. Landing; shows 30 January 2020; no household text read.
26. https://www.garanteprivacy.it/home/docweb/-/docweb-display/print/10207132. OK via fetch conversion; decision of 18 December 2025, n. 789.
27. https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/10130115. Opened; Replika ordinance of 10 April 2025; not relevant to voice cloning.
28. https://www.dirittobancario.it/wp-content/uploads/2026/01/Delibera-Garante-Privacy-18-dicembre-2025.pdf. Binary; not readable with my tools; superseded by item 26.
29. https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2025-09-23;132. Partial; art. 1 and metadata only; in force 10 October 2025.
30. https://www.gazzettaufficiale.it/eli/id/2025/09/25/25G00143/sg. Metadata only.
31. https://www.gazzettaufficiale.it/eli/gu/2025/09/25/223/sg/pdf. OK via PDF text; GU n. 223 of 25 September 2025; art. 612-quater text.
32. https://aastaraamat.aki.ee/sites/default/files/Andmekaitseinspektsioon_AR_uus.pdf. OK via PDF text; Estonian; biometric definition; no voice or deepfake passages; year unclear.
33. https://fra.europa.eu/en/caselaw-reference/cjeu-c-21213-judgment. OK; summary of C-212/13 (decided 11 December 2014).
34. https://infocuria.curia.europa.eu/tabs/redirect/juris/document/document.jsf?docid=160561&doclang=EN. Returned only "RPEX"; no text.
35. https://curia.europa.eu/juris/document/document.jsf?docid=160561&doclang=EN. 301 redirect to item 34.
36. https://support.apple.com/en-us/104993. OK; fetch conversion; published 13 October 2025.
37. https://elevenlabs.io/docs/product/voices/voice-lab/professional-voice-cloning. OK; fetch conversion; no date visible.
38. https://help.elevenlabs.io/hc/en-us/articles/36842751624209-Can-I-create-a-Professional-Voice-Clone-of-someone-else-s-voice. 403.
39. https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/limited-access. OK; ms.date 2026-03-31.
40. https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/disclosure-voice-talent. OK; ms.date 2026-03-31.
41. https://www.resemble.ai/our-commitment-to-consent. OK; dated 4 September 2024.
42. https://github.com/facebookresearch/audioseal. OK; MIT; no commit date visible.
43. https://arxiv.org/abs/2401.17264. Abstract only.
44. https://arxiv.org/html/2401.17264v2. OK; Tables 3 and 5; section 5.5; no Opus.
45. https://huggingface.co/facebook/audioseal. OK; tag mit; 16 kHz; no size.
46. https://github.com/sony/silentcipher. OK; MIT (code); 16 and 44.1 kHz; training code not released; no date visible.
47. https://arxiv.org/html/2406.03822v2. OK; Table 1 (HTML table misalignment noted by the reader); no Opus.
48. https://github.com/wavmark/wavmark. OK; MIT; no commit date visible.
49. https://github.com/TimbreWatermarking/TimbreWatermarking. OK; GPL-3.0; no commit date visible.
50. https://github.com/resemble-ai/Perth. OK; MIT; no commit date visible.
51. https://proceedings.neurips.cc/paper_files/paper/2024/file/5d9b7775296a641a1913ab6b4425d5e8-Paper-Datasets_and_Benchmarks_Track.pdf. OK via PDF text; AudioMarkBench; Opus range and claim; watermarks evaluated AudioSeal-B, Timbre, WavMark. Table values not extracted.
52. https://arxiv.org/abs/2601.22556. Abstract only; submitted 30 January 2026.
53. https://arxiv.org/abs/2609.03107. Abstract only; submitted 2 September 2026.
54. https://library.zoom.com/admin-corner/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage. OK; undated.
55. https://www.rfc-editor.org/rfc/rfc6716. OK; September 2012.
56. https://developers.google.com/workspace/meet/media-api/guides/codecs. 404.
57. https://developers.google.cn/meet/media-api/guides/codecs?hl=en. 404.
58. https://support.google.com/a/answer/1279090?hl=en. 301 to item 59.
59. https://knowledge.workspace.google.com/admin/meet/prepare-your-network-for-meet-meetings-and-live-streams?hl=en. OK; last updated 2026-11-10 UTC; no codec named.
60. https://techcommunity.microsoft.com/t5/microsoft-teams-blog/satin-microsoft-s-latest-ai-powered-audio-codec-for-real-time/ba-p/2141382. OK; 17 February 2021; updated 24 August 2022.

### 8b. Search-result URLs not opened (snippet only)

**AI Act and Omnibus**
- https://usercentrics.com/knowledge-hub/eu-ai-act-high-risk-delay-article-50-transparency-consent/
- https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/
- https://www.dastra.eu/en/blog/ai-act-transparency-rules-what-changes-august-2-2026/60164
- https://www.cobalt.legal/news-cases/digital-omnibus-on-ai/
- https://astraea.law/insights/eu-ai-act-august-2026-us-companies
- https://blackmatter.vc/lab/eu-ai-act-august-2026-what-changed-vs-what-got-delayed
- https://www.winstontaylor.com/insights/ai-act-rules-on-high-risk-ai-delayed-as-ai-digital-omnibus-agreed
- https://www.technology.org/2026/10/13/eu-ai-act-deadlines-after-the-digital-omnibus-what-applies-from-december-2026-to-august-2028/
- https://www.theleveragedyears.com/ai-regulation-news/eu-ai-act-article-50-transparency-august-2-2026
- https://safeguard.sh/resources/blog/ai-act-article-50-gpai-enforcement-august-2026-software-makers
- https://ertico.com/digital-omnibus-on-ai-enters-into-force
- https://www.netlaw.bg/en/a/the-eus-ai-act-is-already-changing-understanding-the-digital-omnibus-on-ai
- https://ertico.com/digital-omnibus-on-ai-enters-into-force-what-it-means-for-the-mobility-sector
- https://globalsuitesolutions.com/digital-omnibus-ai-regulation-2026-1744
- https://www.globalsuitesolutions.com/?p=123707
- https://www.ibf-solutions.com/fileadmin/dateidownloads/regulation-2026-1744.pdf
- https://www.ecija.com/en/news-and-insights/the-european-parliament-and-the-council-approve-the-digital-omnibus-package-on-ai/
- https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act
- https://www.cuatrecasas.com/en/spain/intellectual-property/art/key-aspects-ai-omnibus-regulation
- https://abreuadvogados.com/en/conhecimento/publications/digital-omnibus-regulation-on-ai-the-key-amendments-to-the-ai-act/
- https://data.consilium.europa.eu/doc/document/ST-13206-2026-INIT/en/pdf (Council document; corrigendum notice referenced in a snippet)
- https://www.cuatrecasas.com/resources/ai-omnibus-regulation-eng-txt-6a6c91679b13e331880996.pdf
- https://www.cuatrecasas.com/en/latam/intellectual-property/art/digital-omnibus-ai-has-been-published
- https://pasqualepillitteri.it/en/news/8951/eu-regulation-2026-1744-digital-omnibus-ai-act
- https://eur-lex.europa.eu/eli/reg/2026/1744 (base URL; the /oj variant was opened, returned empty)

**Code of Practice**
- https://www.jonesday.com/en/insights/2026/06/european-commission-publishes-final-code-of-practice-on-marking-and-labelling-aigenerated-content
- https://www.scl.org/european-commission-publishes-code-of-practice-on-marking-and-labelling-ai-generated-content/
- https://www.jonesday.com/de/insights/2026/06/european-commission-publishes-final-code-of-practice-on-marking-and-labelling-aigenerated-content
- https://idpc.org.mt/?p=5041
- https://eoc.org.cy/?p=10829
- https://service.betterregulation.com/document/851523
- https://www.reedsmith.com/our-insights/blogs/viewpoints/102nbz0/transparency-obligations-for-ai-generated-content-the-code-of-practice-adequacy/
- https://www.cepic.org/post/commission-publishes-code-of-practice-on-marking-and-labelling-ai-generated-content
- https://chatgptiseatingtheworld.com/2026/06/10/european-commission-published-the-final-code-of-practice-on-marking-and-labelling-of-ai-generated-content/
- https://www.rpclegal.com/snapshots/technology-digital/spring-2026/european-commission-publishes-first-draft-code-of-practice-on-transparency-of-genai-content/
- https://techpolicy.press/the-eus-ai-transparency-code-of-practice-explained
- https://aiweekly.co/alerts/eu-publishes-final-ai-transparency-code-ahead-of-article-50
- https://opi.gr/?p=7169
- https://service.betterregulation.com/document/851516
- https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/eu-ai-act-unpacked-33-the-final-code-of-practice-on-transparency-of-ai-generate-102n4yx
- https://www.freevacy.com/news/european-commission/eu-publishes-final-code-of-practice-on-transparency-of-ai-generated-content/7453
- https://cadeproject.org/updates/european-commission-publishes-code-of-practice-on-marking-and-labelling-ai-generated-content/
- https://compliancehub.wiki/blog/eu-ai-act-marking-labelling-code-of-practice-article-50-2026
- https://compliancehub.wiki/eu-ai-act-marking-labelling-code-of-practice-article-50-2026/
- https://europa.eu/newsroom/ecpc-failover/pdf/ip-26-1328_en.pdf (press release IP/26/1328)
- https://ec.europa.eu/commission/presscorner/detail/en/ip_26_1328 (press release)
- https://www.eweek.com/news/eu-ai-content-labelling-code/
- https://cepis.org/european-commission-publishes-final-ai-content-labelling-code-of-practice/
- https://cadeproject.org/?p=154690
- https://www.europeanoutdoorgroup.com/members-knowledge-hub/final-voluntary-code-of-practice-on-the-marking-and-labelling-of-ai-generated-content

**Article 50 guidelines and commentary**
- https://www.jdsupra.com/legalnews/the-european-commission-issues-draft-6420284/
- https://www.stephensonharwood.com/post/102nfqh/eu-ai-act-update-european-commission-adopts-guidelines-on-article-50-transparency-obligations/
- https://www.mondaq.com/germany/new-technology/1800448/deepfakes-chatbots-ai-generated-text-european-commission-details-transparency-obligations-under-the-ai-act
- https://natlawreview.com/article/deepfakes-chatbots-ai-generated-text-european-commission-details-transparency
- https://www.gtlaw.com/he/insights/2026/6/deepfakes-chatbots-ai-generated-text-european-commission-details-transparency-obligations-under-the-ai-act
- https://www.akingump.com/en/insights/ai-law-and-regulation-tracker/guidelines-on-transparency-obligations-under-the-eu-ai-act
- https://www.williamfry.com/?p=162323
- https://gtlaw.com/en/insights/2026/6/deepfakes-chatbots-ai-generated-text-european-commission-details-transparency-obligations-under-the-ai-act
- https://www.gtlaw.com/ar/insights/2026/6/deepfakes-chatbots-ai-generated-text-european-commission-details-transparency-obligations-under-the-ai-act
- https://conventuslaw.com/report/taking-the-eu-ai-act-to-practice-reading-the-commissions-draft-article-50-guidelines/
- https://www.gtlaw.com/-/media/files/insights/alerts/2026/06/gt-alert_deepfakes-chatbots-ai-generated-text-european-commission-details-transparency-obligations-under-the-ai-act.pdf
- https://ppc.land/eu-ai-content-rules-force-publishers-to-label-or-risk-3-of-turnover/
- https://hlc.com/en/publications/the-european-commission-issues-draft-guidelines-on-the-transparency-requirements-under-the-ai-act
- https://www.winstontaylor.com/insights/article-50-eu-ai-act-what-the-european-commission-s-draft-transparency-guidelines-mean-for-your-business
- https://docs.modulos.ai/frameworks/eu-ai-act/commission-guidance/transparency
- https://www.dirittobancario.it/wp-content/uploads/2026/07/Guidelines-European-Commission-20-July-2026.pdf
- https://www.dirittobancario.it/wp-content/uploads/2026/07/Communication-European-Commission-20-July-2026.pdf
- https://www.williamfry.com/knowledge/time-running-out-as-ai-transparency-guidelines-published/
- https://ppc.land/non-eu-advertisers-face-3-eu-fines-for-unlabelled-ai-deep-fake-ads/
- https://www.aigl.blog/guidelines-on-the-implementation-of-the-transparency-obligations-for-certain-ai-systems-under-article-50-of-regulation-eu-2024-1689-the-ai-act/
- https://www.aiactblog.nl/en/richtsnoeren/richtsnoeren-over-de-transparantieverplichtingen-van-artikel-50
- https://www.mccannfitzgerald.com/knowledge/technology/european-commission-publishes-draft-guidelines-on-transparency-obligations-under-the-eu-ai-act
- https://www.globalpolicywatch.com/2026/05/10-takeaways-european-commission-draft-guidelines-on-ai-transparency-under-the-eu-ai-act/
- https://www.mondaq.com/constitutional-administrative-law/1823814/eu-ai-act-final-guidelines-on-transparency-obligations-under-article-50
- https://ecovis.lt/?p=11631
- https://trustarc.com/products/privacy-data-governance/nymity-research/eu-ai-act-article-50-transparency-guidelines/
- https://trustarc.com/?p=10486
- https://www.faegredrinker.com/en/insights/publications/2026/7/eu-ai-act-commission-confirms-transparency-code-of-practice-as-adequate-and-publishes-final-version-of-its-guidelines-on-transparency-obligations
- https://natlawreview.com/article/eu-ai-act-final-guidelines-transparency-obligations-under-article-50
- https://www.paulweiss.com/insights/client-memos/eu-finalises-transparency-rules-for-ai-generated-content
- https://www.paulweiss.com/media/204bwi3d/eu_finalises_transparency_rules_for_ai_generated_content.pdf
- https://www.burges-salmon.com/articles/102nekf/eu-ai-act-transparency-guidance-lands-what-providers-and-deployers-need-to-do-no
- https://www.mccannfitzgerald.com/knowledge/data-privacy-and-cyber-risk/ai-transparency-european-commissions-guidelines-on-article-50-part-1-provider-obligations
- https://www.mccannfitzgerald.com/knowledge/data-privacy-and-cyber-risk/ai-transparency-european-commissions-guidelines-on-article-50-part-2-deployer-obligations
- https://www.pearlcohen.com/european-commission-publishes-final-guidelines-on-ai-transparency-obligations/
- https://www.mishcon.com/news/what-the-eus-final-ai-transparency-guidelines-mean-for-providers-and-deployers
- https://www.enz.ai/eu-ai-act-article-50-transparency-guidance
- https://emailexpert.com/ai-act-article-50-transparency-guidelines/
- https://www.hlc.com/en/publications/the-ai-acts-transparency-obligations-in-light-of-the-eu-commissions-final-version-of-the-guidelines
- https://www.stibbe.com/publications-and-insights/the-ai-acts-transparency-obligations-rules-scope-and-timeline
- https://www.lexgo.be/en/news-and-articles/14976-the-ai-act-s-transparency-obligations-rules-scope-and-timeline
- https://www.lexgo.lu/en/news-and-articles/14976-the-ai-act-s-transparency-obligations-rules-scope-and-timeline
- https://secureprivacy.ai/blog/eu-ai-act-article-50-transparency-obligations-for-chatbots-and-deepfakes-2026
- https://gdprlocal.com/eu-ai-act-article-50/
- https://gdprlocal.com/ga/eu-ai-act-article-50/
- https://www.williamfry.com/knowledge/part-1-ai-act-articles-501-and-502-transparency-obligations/
- https://artificialintelligenceact.eu/?p=6131
- https://artificialintelligenceact.eu/transparency-rules-article-50/
- https://digital-strategy.ec.europa.eu/de/node/17084
- https://www.euaiact.com/blog/eu-ai-act-article-50-transparency

**Open source (Article 2(12))**
- https://www.aoshearman.com/en/insights/ao-shearman-on-tech/zooming-in-on-ai-16-open-source-artificial-intelligence
- https://linuxfoundation.eu/newsroom/ai-act-explainer
- https://www.jdsupra.com/legalnews/the-eu-ai-act-open-source-exceptions-9085314
- https://orrick.com/Insights/2024/05/The-EU-AI-Act-Open-Source-Exceptions-and-Considerations-for-Your-AI-Strategy
- https://production.jdsupra.com/legalnews/zooming-in-on-ai-16-open-source-3160299
- https://eolevent.eu/wp-content/uploads/2024/12/AI_EOLE_marco-ciurcina.pdf

**EDPB and voice (virtual assistants)**
- https://edpb.europa.eu/sites/default/files/webform/public_consultation_reply/ebf_045080_response_edpb_consultation_on_guidelines_on_virtual_voice_assistants.pdf
- https://cuatrecasas.com/en/spain/article/new-eu-guidelines-on-voice-assistants-and-data-protection
- https://www.cuatrecasas.com/en/portugal/intellectual-property/art/new-eu-guidelines-on-voice-assistants-and-data-protection
- https://www.cuatrecasas.com/en/global/intellectual-property/art/new-eu-guidelines-on-voice-assistants-and-data-protection
- https://www.cuatrecasas.com/en/latam/intellectual-property/art/new-eu-guidelines-on-voice-assistants-and-data-protection
- https://www.cuatrecasas.com/en/spain/intellectual-property/art/new-eu-guidelines-on-voice-assistants-and-data-protection
- https://dataprivacy.foxrothschild.com/2021/04/articles/european-union/gdpr/edpb-issues-draft-guidelines-on-data-protection-aspects-of-voice-assistants/
- https://www.osborneclarke.com/insights/virtual-voice-assistants-challenge-comply-data-protection-legislation
- https://www.pwclegal.be/en/news/voices-as-personal-data--belgian-dpa-challenges-antwerp-s-noise-.html
- https://edps-edpb.acc.fpfis.tech.ec.europa.eu/sites/default/files/webform/public_consultation_reply/edpb_feedback_by_comprise.pdf
- https://www.pearlcohen.com/?p=9020
- https://www.lexgo.be/nl/nieuws-en-publicaties/10794-new-edpb-guidelines-on-virtual-voice-assistants
- https://graces.community/media/eu-edpb-launches-public-consultation-on-virtual-voice-assistants-guidelines
- https://odo24.pl/en/wiedza/blog/jak-wdrozyc-voicebota-zgodnie-z-rodo-kluczowe-zasady-i-dobre-praktyki
- https://callsphere.ai/blog/vw6f-eu-gdpr-ai-voice-chat-2026-dpia-ropa
- https://callsphere.ai/blog/vw6f-eu-gdpr-ai-voice-chat-2026-dpia-ropa.md

**Garante and Italian material**
- https://www.agendadigitale.eu/?p=284941
- https://documenti.camera.it/leg19/documentiAcquisiti/COM10/Audizioni/leg19.com10.Audizioni.Memoria.PUBBLICO.ideGes.62427.07-05-2025-12-09-20.368.pdf
- https://www.orizzontescuola.it/deepfake-il-garante-privacy-richiama-alla-prudenza-attenzione-a-voce-e-immagini-di-terzi-rischio-frodi-diffamazione-e-furto-didentita/
- https://www.dirittobancario.it/wp-content/uploads/2026/02/Provvedimento-Garante-Privacy-29-gennaio-26-n.-35.pdf
- https://lespresso.it/c/innovazione/2025/7/17/garante-privacy-relazione-attivita-2024/55656
- https://www.studiocerbone.com/502703-2/
- https://lentepubblica.it/personale-e-previdenza/impronte-digitali-per-timbrare-il-cartellino-divieto-garante-privacy/
- https://lentepubblica.it/?p=435688
- https://lentepubblica.it/?p=430684
- https://lentepubblica.it/cittadini-e-imprese/deepfake-e-ia-lallarme-del-garante-su-diritti-privacy-e-liberta-personali/
- https://www.tomshw.it/business/se-vendete-ia-ad-alto-rischio-alla-pa-italiana-la-conformita-passa-sotto-il-garante
- https://www.tomshw.it/business/faceboarding-a-linate-perche-il-garante-ha-fermato-il-riconoscimento-facciale
- https://www.lcalex.it/wp-content/uploads/2024/04/DPOst_Your-Data-Protection-Journal_-n°1.pdf
- https://www.dirittobancario.it/wp-content/uploads/2024/03/GarantePrivacy-105-2024.pdf
- https://www.dirittobancario.it/wp-content/uploads/2024/03/GarantePrivacy-106-2024.pdf
- https://www.dirittobancario.it/wp-content/uploads/2024/03/GarantePrivacy-109-2024.pdf
- https://www.dirittobancario.it/wp-content/uploads/2024/04/Provvedimento-Garante-Privacy-21-marzo-2024-n.-179.pdf
- https://www.dirittobancario.it/wp-content/uploads/2025/09/Provvedimento-Garante-Privacy-11-settembre-2025-n.-489.pdf
- https://www.garanteprivacy.it/garante/doc.jsp?ID=10207132 (variant of item 26)
- https://www.garanteprivacy.it/garante/doc.jsp?ID=10207147 and https://www.garanteprivacy.it/home/docweb/-/docweb-display/print/10207147 (Garante press release on deepfakes)
- https://www.garanteprivacy.it/garante/doc.jsp?ID=10306949 (Garante news "Deepfake, cosa ha fatto il Garante Privacy")
- https://www.garanteprivacy.it/home/docweb/-/docweb-display/print/10266612 and https://garanteprivacy.it/garante/doc.jsp?ID=10266612 (Garante 2025 annual report, summary)
- https://www.garanteprivacy.it/home/docweb/-/docweb-display/print/10228173
- https://www.garanteprivacy.it/home/ricerca/-/search/argomento/Foto%20e%20filmati
- https://ntplusdiritto.ilsole24ore.com/art/ia-generativa-garante-privacy-ammonisce-provider-e-utenti-AIzJI7dB
- https://ntplusdiritto.ilsole24ore.com/art/deepfake-provvedimenti-garante-privacy-nudi-e-voci-rubate-AJn8BKdB
- https://iusletter.com/dalla-redazione/intelligenza-artificiale/deepfake-il-garante-della-privacy-interviene-per-la-tutela-dei-diritti-fondamentali/
- https://www.quotidianopiu.it/dettaglio/14364576/deepfake-a-rischio-diritti-e-liberta-fondamentali
- https://www.dirittobancario.it/art/deepfake-avvertimento-del-garante-privacy-a-utilizzatori-e-fornitori-di-servizi-di-ia/
- https://www.dirittobancario.it/art/le-immagini-generate-con-lia-e-la-tutela-della-privacy/
- https://www.dirittobancario.it/?p=143235
- https://digitalpolicyalert.org/event/36818-guarantor-for-the-protection-of-personal-data-concluded-investigation-into-artificial-intelligence-services-using-third-party-voices-and-images
- https://www.diritto.it/?p=241054
- https://www.diritto.it/legge-132-intelligenza-artificiale-novita-penali/
- https://edotto.com/articolo/intelligenza-artificiale-introdotto-il-nuovo-reato-di-deep-fake
- https://www.agendadigitale.eu/documenti/giustizia-digitale/legge-italiana-sullai-tutti-i-profili-penali-ecco-cosa-cambia/
- https://static.labiennale.org/files/labiennale/Documenti/trasparenza/corruzione/anticorr-formazione_ia-2025.pdf
- https://www.giustiziainsieme.it/print/articolo_pdf?id=3717
- https://www.studiocataldi.it/articoli/48017-il-nuovo-reato-il-deepfake.asp
- https://www.cybersecurity360.it/legal/il-nuovo-reato-di-deepfake-quando-il-diritto-penale-diventa-lultima-difesa-dellincertezza/
- https://agendadigitale.eu/cultura-digitale/deep-fake-e-violenza-sulle-donne-quando-lia-diventa-unarma-potente
- https://www.editorialedomani.it/giustizia/ora-lintelligenza-artificiale-e-anche-nel-codice-penale-mpxnsg4n
- https://www.eroicafenice.com/fun-tech/video-creati-con-ai-cosa-vieta-e-sanziona-la-nuova-legge/
- https://www.agendadigitale.eu/?p=249525
- https://ildiritto.it/?p=14679
- https://www.cni.it/images/Rassegna_stampa/2025/37_02.pdf
- https://thesis.unipd.it/handle/20.500.12608/99685
- https://www.diritto.it/deepfake-sessuali-cyberbullismo-cosa-prevede-legge/
- https://pasqualepillitteri.it/news/2082/deepfake-meloni-foto-false-ai-pericoli-2026
- https://www.italiaoggi.it/diritto-e-fisco/intelligenza-artificiale-contro-i-deepfake-la-tutela-e-a-meta-lvptvhlp
- https://truescreen.io/it/?p=56955

**Estonian AKI and other**
- https://adr-docs.karlerss.com/5uKu4G5iEv0KJoynJ0M51hCwAXYopbrF/Vastus selgitustaotlusele.pdf (third-party copy of AKI reply; authenticity not verified)
- https://adr-docs.karlerss.com/ZeUOCW7csYjYCvrBshYGphJVUHAiK0dv/Vastus selgitustaotlusele.pdf
- https://adr-docs.karlerss.com/1wBechBzis2DbBX2FqwHihTuK5HuR7Pd/Arvamuse avaldamine ettepanekule.pdf
- https://adr-docs.karlerss.com/BQbYszJa6RIPkQv0Y3iSzGBrmTel9reT/Vastus selgitustaotlusele.pdf
- https://adr-docs.karlerss.com/jowzvKYfwLkZzoCyskk2OADVmwShl9mX/Vastus selgitustaotlusele.pdf
- https://adr-docs.karlerss.com/4unzgHHCElmflOP4xVb3Z8PdRg2d57jJ/Vastus selgitustaotlusele.pdf
- https://adr-docs.karlerss.com/GTyc4WvdrKYAwTrl1Hua9ECZPZjQXwbZ/Vastus selgitustaotlusele_transkribeerimisteenus.pdf
- https://www.err.ee/1608254904/el-i-andmekaitse-nouab-naotuvastustehnoloogia-keelustamist
- https://www.err.ee/1609195564/andmekaitse-asper-biogene-andmelekkes-on-ka-naiteks-isadusteste

**EDPB 2026 and deepfakes**
- https://elearning.uia.no/observatory/?p=8268
- https://www.alstonprivacy.com/?p=6086
- https://www.ithome.com.tw/news/174068
- https://babl.ai/european-data-protection-supervisor-issues-new-guidelines-for-generative-ai-compliance/
- https://www.biometricupdate.com/202602/europe-formalizes-concerns-about-genai-enabled-nonconsensual-deepfakes
- https://ppc.land/edpb-blocks-ai-firms-from-using-consent-as-an-excuse-to-scrape/
- https://www.pulse.bot/govtech/news/europe-formalizes-concerns-about-genai-enabled-nonconsensual-deepfakes-aa0a7039-1797-49cb-9699-dc3aebb9b5c7
- https://connectontech.bakermckenzie.com/?p=5878
- https://www.reedsmith.com/our-insights/blogs/technology-law-dispatch/102nbqu/edpb-web-scraping-guidelines-for-ai-making-the-impossible-possible/
- https://europrivacy.com/en/aggregator/sources/1?page=0
- https://datenrecht.ch/en/edoeb-und-weitere-behoerden-gemeinsame-erklaerung-zu-ki-generierten-bildern/
- https://idpc.org.mt/?p=4213
- https://www.edpb.europa.eu/node/747_sv
- https://www.mondaq.com/unitedstates/new-technology/1567324/edpb-releases-opinion-on-the-use-of-personal-data-with-artificial-intelligence
- https://ourtake.bakerbotts.com/post/102jsan/edpb-releases-opinion-on-the-use-of-personal-data-with-artificial-intelligence
- https://production.jdsupra.com/legalnews/european-data-protection-board-releases-5357780
- https://cms.law/en/int/legal-updates/edpb-opinion-28-2024-key-takeaways-on-processing-personal-data-in-the-context-of-ai-models (and cms.law regional variants: /en/aut, /en/bel, /en/hun, /en/lux, /en/hrv, /en/bgr)

**Household exemption and Ryneš**
- https://www.hunton.com/privacy-and-cybersecurity-law-blog/edpb-adopts-guidelines-on-data-processing-through-video-devices (plus hunton.com/privacy-and-information-security-law/ and huntonak.com variants)
- https://www.hunton.com/privacy-and-cybersecurity-law-blog/2019/07/26/edpb-adopts-guidelines-on-data-processing-through-video-devices/
- https://edpb.europa.eu/sites/edpb/files/consultation/edpb_guidelines_201903_videosurveillance.pdf
- https://www.edpb.europa.eu:443/sites/default/files/consultation/edpb_guidelines_201903_videosurveillance.pdf
- https://democracy.middevon.gov.uk/documents/s14943/CCTV%20Annex%20A%20-%20edpb_guidelines.pdf
- https://road.cc/?p=58220
- https://odo24.pl/en/wiedza/blog/monitoring-wizyjny-na-gruncie-najnowszych-wytycznych-EROD
- https://www.mondaq.com/Article/842286
- https://www.bitkom.org/sites/main/files/2019-09/20190909-bitkom-position-edpb-guidelines-videosurveillance-and-processing-through-video-devices.pdf
- https://certifico.com/id/10059
- https://certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/linee-guida-edpb-3-2019-sulla-videosorveglianza
- https://www.digitaleurope.org/resources/response-to-edpb-consultation-on-video-devices/
- https://www.edpb.europa.eu/documents/guideline/guidelines-32019-on-processing-of-personal-data-through-video-devices_ga
- https://www.edpb.europa.eu/documents/195_en
- https://edpb.europa.eu/our-work-tools/documents/public-consultations/2019/guidelines-32019-processing-personal-data_de
- https://www.edpb.europa.eu/public-consultations/guidelines-32019-on-processing-of-personal-data-through-video-devices_es
- https://dataprotection.ro/servlet/ViewDocument?id=1832
- https://dataprotection.ro/servlet/ViewDocument?id=1843
- https://www.privacy-regulation.eu/privazyplan/materialien/eu-european-data-protection-board-edpd/guidelines%202019-03%20Videogeraete%202020%2001%2029.pdf
- https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices_sv.pdf and the fi, lv, lt, cs, sl language variants (language versions of the same guidelines)
- https://eulawanalysis.blogspot.com/2014/12/bringing-data-protection-home-cjeu.html
- https://www.mccannfitzgerald.com/knowledge/privacy/beyond-safe-harbor-other-important-data-protection-decisions-of-2015
- https://inforrm.org/2014/12/17/bringing-data-protection-home-the-cjeu-rules-on-data-protection-law-and-home-cctv-lorna-woods/
- https://www.mondaq.com/ireland/data-protection/363940/all-quiet-on-the-home-front-home-surveillance-and-data-protection
- https://www.lexgo.be/fr/actualites-et-articles/2611-eu-data-protection-rules-may-apply-to-home-surveillance-cameras
- https://www.thomashelbing.com/en/wissen/dsgvo-hub/rechtsprechung/1.4.20-eugh-rynes
- https://www.thomashelbing.com/en/wissen/llms.mdx/dsgvo-hub/rechtsprechung/1.4.20-eugh-rynes
- https://eulawradar.com/?p=225
- https://scl.org/?p=3340
- https://fra.europa.eu/en/node/37086 (Lithuanian case A-1452-442/2018)
- https://fra.europa.eu/en/node/17582 and language variants of the FRA C-212/13 page (sl, bg, nl, es)

**Apple Personal Voice**
- https://app.iphonelife.com/content/personal-voice-iphone
- https://iphonelife.com/content/personal-voice-iphone
- https://iphonelife.com/node/283681
- https://www.trustedreviews.com/how-to/how-to-set-up-personal-voice-on-ios-17-4355761
- https://www.popsci.com/diy/how-to-use-personal-voice
- https://appleinsider.com/inside/ios-17/tips/how-to-use-personal-voice-in-ios-17-and-how-it-compares-to-an-actual-voice
- https://www.whistleout.com/CellPhones/Guides/iphone-personal-voice-feature
- https://techradar.com/phones/ios/i-let-ios17-public-beta-create-my-personal-voice-and-it-was-a-real-journey
- https://maketecheasier.com/create-personal-voice-on-ios-macos
- https://maketecheasier.com/?p=689479
- https://digitaltrends.com/?p=3402760
- https://discussions-jp-prz.apple.com/thread/255812113
- https://www.att.com/device-support/article-modal/125883/apple/iphone-xr/
- https://hi-network.com/how-to-use-your-own-synthesized-voice-on-your-iphone-ipad-mac-or-apple-watch.html
- https://cyberguy.com/apple/life-changing-benefits-apples-personal-voice-live-speech/amp/
- https://www.idropnews.com/?p=200586
- https://support.apple.com/en-eg/104993 (regional copy of item 36)
- https://support.apple.com/HT213878 (earlier URL for the same guide)
- https://igeeksblog.com/?p=639672
- https://www.igeeksblog.com/how-to-set-up-personal-voice-on-iphone/
- https://www.assistiveware.com/fr/aide/proloquo/personalization/setting-up-and-using-apple-personal-voice
- https://aphasia.org/wp-content/uploads/2025/06/iphone-VOICE-BANKING-1.docx
- https://9to5mac.com/?p=889121
- https://appleworld.today/how-to-create-a-personal-voice-on-your-iphone-or-ipad/
- https://www.hongkiat.com/blog/personal-voice-iphone/
- https://dcmpx.remotevs.com/com/apple/www/PL/accessibility/iphone

**ElevenLabs**
- https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning.mdx
- https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning
- https://elevenlabs.io/docs/eleven-api/concepts/voice-cloning/llms.txt
- https://elevenlabs.io/docs/help-center/product/voices/voice-cloning/can-i-create-a-professional-voice-clone-of-someone-elses-voice.md
- https://help.elevenlabs.io/hc/en-us/articles/36842751624209 (403 on the slug variant, item 38)
- https://elevenlabs.io/docs/product/voices/pvc-step-by-step-guide
- https://elevenlabs.io/pt/blog/voice-cloning-api
- https://elevenlabs.io/pl/blog/voice-cloning-api
- https://docs.beyondwords.io/docs-and-guides/voices/voice-cloning
- https://docs.beyondwords.io/docs-and-guides/voices/voice-cloning.md
- https://techjacksolutions.com/?p=70977

**Microsoft Custom Neural Voice**
- https://learn.microsoft.com/en-my/Azure/ai-services/speech-service/custom-neural-voice
- https://learn.microsoft.com/en-au/Azure/ai-services/speech-service/custom-neural-voice
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/custom-neural-voice
- https://learn.microsoft.com/el-gr/azure/ai-services/speech-service/custom-neural-voice-lite
- https://learn.microsoft.com/en-us/legal/cognitive-services/speech-service/text-to-speech/limited-access
- https://news.microsoft.com/source/features/ai/custom-neural-voice-ga/
- https://blogs.microsoft.com/ai-for-business/?p=3039
- https://techcommunity.microsoft.com/t5/azure-ai/build-a-natural-custom-voice-for-your-brand/ba-p/2112777
- https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/build-a-natural-custom-voice-for-your-brand/2112777
- https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/try-out-custom-neural-voice-in-5-minutes-with-a-lite-project/3270455
- https://venturebeat.com/technology/microsoft-launches-custom-neural-voice-in-limited-access
- https://techcrunch.com/?p=2629089
- https://istart.com.au/?p=37757
- https://uxdesign.cc/custom-neural-voice-designing-for-human-centered-policy-7ce2e03a1c

**Resemble AI**
- https://www.resemble.ai/resources/voice-security-solutions-guide
- https://www.resemble.ai/?p=20205598
- https://www.resemble.ai/?p=231240
- https://www.resemble.ai/company/ethics
- https://www.resemble.ai/ai-ethics/
- https://www.resemble.ai/ethics/
- https://www.resemble.ai/neural-speech-watermarker/
- https://www.resemble.ai/resources/neural-speech-watermarker
- https://www.resemble.ai/?p=20206877
- https://resemble.ai/identity
- https://docs.google.com/document/d/1rlgjFE6sN0mB5MCuE_erMgMuXmPu-e_E/export?format=pdf (Google Docs copy of a DPA; not official)
- https://www.judiciary.senate.gov/download/2024-04-16-pm-testimony-ahmed?download=1
- https://www.resemble.ai/python
- https://www.resemble.ai/create-ai-voice-model-rvc/
- https://www.resemble.ai/?p=238453
- https://typecast.ai/learn/?p=15082

**Watermark tools**
- https://pypi.org/project/audioseal/
- https://pypi.org/project/audioseal/0.1.3
- https://ai.meta.com/research/publications/proactive-detection-of-voice-cloning-with-localized-watermarking/
- https://arxiv.org/pdf/2401.17264.pdf
- https://aimodels.substack.com/p/meta-found-a-way-to-secretly-watermark
- https://openreview.net/pdf/8753fe22b324eb5c20d653a8c2ae6a4243f002b3.pdf
- https://chatpaper.com/paper/36924
- https://www.huggingface.co/facebook/audioseal/blob/main/README.md?code=true
- https://awesome.ecosyste.ms/projects/github.com%2Ffacebookresearch%2Faudioseal
- https://huggingface.co/sony/silentcipher
- https://www.ai.sony/publications/SilentCipher-Deep-Audio-Watermarking/
- https://arxiv.org/pdf/2406.03822
- https://arxiv.org/abs/2406.03822
- https://huggingface.co/Sony/SilentCipher/blob/main/README.md?code=true
- https://katalog.lib.cas.cz/KNAV/EdsRecord/edsarx,edsarx.2406.03822
- https://www.scoredetect.com/blog/posts/ai-audio-watermarking-key-metrics-measure-efficiency (claims a May 2025 Sony comparison of four tools; not verified)
- https://arxivlens.com/PaperView/ViewPdf/silentcipher-deep-audio-watermarking-6490-1278806
- https://astro.paperswithcode.com/paper/wavmark-watermarking-for-audio-generation
- https://arxiv.org/abs/2308.12770
- https://arxiv.org/pdf/2308.12770v1
- https://arxiv.org/abs/2308.12770v2
- https://arxiv.org/abs/2308.12770v3
- https://api.emergentmind.com/papers/2308.12770
- https://arxivlens.com/paperview/details/wavmark-watermarking-for-audio-generation-8465-1457833
- https://sotaverified.org/papers/wavmark-watermarking-for-audio-generation
- https://fugumt.com/fugumt/paper_check/2308.12770v3_enmode
- https://www.wizwand.com/paper/68fa71b31e209131cea529ae
- https://arxiv.org/pdf/2312.03410
- https://arxiv.org/html/2312.03410v1
- https://export.arxiv.org/pdf/2312.03410
- https://papers.cool/venue/detecting-voice-cloning-attacks-via-timbre-watermarking@NDSS
- https://www.secrss.com/articles/61363
- https://www.arxiv.org/abs/2312.03410
- https://ar5iv.labs.arxiv.org/html/2312.03410
- https://citation.thinkst.com/talk/88168
- https://ndss-symposium.org/ndss-paper/detecting-voice-cloning-attacks-via-timbre-watermarking
- https://dev.ndss-symposium.org/ndss-paper/detecting-voice-cloning-attacks-via-timbre-watermarking
- https://dukespace.lib.duke.edu/server/api/core/bitstreams/b1d0494c-ab66-4f7c-a9ea-1d6cdf1fd193/content (Guo dissertation, 2025)
- https://arxiv.org/pdf/2510.17512 (AWARE)
- https://arxiv.org/pdf/2609.25830 (latent watermarking vs neural codec resynthesis)
- https://arxiv.org/pdf/2606.11828 (feature-aligned speech watermarking)
- https://arxiv.org/pdf/2606.15187 (VoxWatermark benchmark)
- https://arxiv.org/pdf/2601.22556 (VocBulwark, PDF)
- https://www.researchgate.net/publication/396812950_A_Comprehensive_Real-World_Assessment_of_Audio_Watermarking_Algorithms_Will_They_Survive_Neural_Codecs
- https://openreview.net/pdf/182b8e96fc7b3ba5738aa3f6f95b5d325cf63859.pdf (ICLR 2025 GenAI workshop, post-hoc watermark removal)

**Codec sources (Zoom, Teams, Meet)**
- https://www.sipper.co.th/en/knowledge/glossary/opus
- https://vodlix.com/blog/opus-audio-codec.md
- https://mta-sts.vodlix.com/blog/opus-audio-codec
- https://vodlix.com/blog/opus-audio-codec/
- https://cococonvert.com/blog/informational__what-is-opus-audio
- https://cococonvert.com/blog/what-is-opus-audio
- https://dropvert.pages.dev/guides/what-is-opus-audio
- https://cloudinary.com/guides/video-formats/opus-codec
- https://www.red5.net/?p=6500
- https://library.zoom.com/it/angolo-admin/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage
- https://library.zoom.com/technical-library/it/area-admin/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage
- https://library.zoom.com/technical-library/nl/beheerdershoek/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage
- https://library.zoom.com/technical-library/zh/guan-li-yuan-zhuan-qu/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage
- https://library.zoom.com/technical-library/pt/canto-do-administrador/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage
- https://library.zoom.com/technical-library/de/administrationsbereich/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage
- https://library.zoom.com/technical-library/fr/coin-admin/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage
- https://library.zoom.com/admin-corner/network-management/quality-of-service-and-network-best-practices-explainer/how-zoom-audio-and-video-codecs-affect-bandwidth-usage (opened, item 54)
- https://developers.google.com/workspace/meet/media-api/guides/get-started
- https://developers.google.cn/meet/media-api/guides/get-started?hl=en
- https://developers.google.com/workspace/meet/media-api/guides/codecs?authuser=5
- https://developers.google.cn/workspace/meet/media-api/guides/codecs?authuser=0
- https://developers-dot-devsite-v2-prod.appspot.com/workspace/meet/media-api/guides/codecs?hl=it
- https://sthq.pages.dev/guides/google-meet-internet-speed.html (third-party; claims Opus; conflicts with Google figures)
- https://speedtesthq.com/guides/work/google-meet-internet-speed
- https://knowledge.workspace.google.com/admin/meet/prepare-your-network-for-meet-meetings-and-live-streams?authuser=6
- https://cloud-captains.com/en/article/setting-up-google-meet-technical-guide
- https://webcf.waybackmachine.org/web/20231108055532/https://support.google.com/a/answer/1279090
- https://support.google.com/a/answer/1279090?hl=da
- https://docs.vmware.com/en/VMware-Horizon/2103/horizon-remote-desktop-features/GUID-F68FA7BB-B08F-4EFF-9BB1-1F9FC71F8214.html
- https://docs.vmware.com/en/VMware-Horizon/2006/horizon-remote-desktop-features/GUID-F68FA7BB-B08F-4EFF-9BB1-1F9FC71F8214.html
- https://docs.vmware.com/en/VMware-Horizon-7/7.13/horizon-remote-desktop-features/GUID-3E913459-7215-427A-AA2C-B7237A2790CE.html
- https://techcommunity.microsoft.com/discussions/azurecommunicationservices/audiovideo-codecs-by-acs/2449366
- https://techcommunity.microsoft.com/discussions/azurecommunicationservices/audiovideo-codecs-by-acs/2449366/replies/2449584
- https://techcommunity.microsoft.com/t5/azure-communication-services/audio-video-codecs-by-acs/m-p/2449407
- https://learn.microsoft.com/en-us/previous-versions/mt599587(v=vs.85) (Edge WebRTC codec settings; archived)
- https://testweb.playready.microsoft.com/en-us/answers/questions/5758591/inquiry-regarding-teams-media-codecs-protocols-and-unlisted-ip-ranges-48-x-and-20-x-detected-during-packet-analysis
- https://testweb.playready.microsoft.com/en-us/answers/questions/5758580/inquiry-regarding-teams-media-codecs-protocols-and-unlisted-ip-ranges-48-x-and-20-x-detected-during-packet-analysis
- https://techcommunity.microsoft.com/t5/microsoft-teams/audio-bitrates/m-p/817944
- https://digitaltrends.wp.txstate.edu/?p=1442
- https://digitaltrends.wp.txstate.edu/?p=1434
- https://calendar-uk.co.uk/frequently-asked-questions/what-voice-codec-does-teams-use
- https://support.bemopro.com/hc/en-us/articles/360060061673
- https://www.citrix.com/blogs/2018/03/21/bandwidth-guidelines-for-virtualized-skype-for-business/
- https://springerlink.bibliotecabuap.elogim.com/content/pdf/10.1007/979-8-8688-0014-6_3