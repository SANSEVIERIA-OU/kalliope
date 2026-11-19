# P-2 · I fatti per mettere ONNX Runtime e i modelli dentro il programma

Ricerca del 19/11/2026 (ruolo research), su fonti ufficiali. Le pagine di GitHub e Hugging Face non portano una data. Le
copie grezze sono in `/tmp/dsg-research-2026-11-19/` (locali, non nel repository).

## Che cosa entra

| File | Dimensione |
|---|---|
| Pocket TTS italiano, 6 strati: `flow_lm.onnx`, `mimi_encoder.onnx`, `mimi_decoder.onnx`, `tokenizer.json`, `pocket.json` | 212 MB, un file da 141 MB |
| Pocket TTS italiano, 24 strati (alternativa, non usato dal programma) | 457 MB |
| Klein, Giulia e Marco (`onnx/`) | 51 MB |
| ONNX Runtime 1.32.0, Linux x86_64 (`libonnxruntime.so.1.32.0` e `providers_shared`) | 35 MB |

## GitHub

- **Un file nel repository**: GitHub blocca i file oltre 100 MiB e avvisa oltre 50 MiB. Si raccomanda di tenere il
  repository sotto 1 GB, e comunque sotto 5 GB.
  https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- **Git LFS**, account personale gratuito:
  - 10 GiB di spazio e 10 GiB di traffico al mese;
  - oltre si paga a consumo; senza un metodo di pagamento, LFS si spegne fino al mese dopo;
  - i download di GitHub Actions contano nel traffico del proprietario («If GitHub Actions downloads a 500 MB file … it will
    use 500 MB of the repository owner's bandwidth»), anche per i repository pubblici;
  - ogni nuova versione di un file conta per intero nello spazio.

  https://docs.github.com/en/billing/concepts/product-billing/git-lfs
- **Release**:
  - ogni file sotto 2 GiB, fino a 1000 file per release;
  - «There is no limit on the total size of a release, nor bandwidth usage».

  https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- **Regola generale**: con un uso di banda eccessivo GitHub può rallentare o sospendere (Acceptable Use Policies, §9).

## Hugging Face

- Repository pubblici di un account gratuito: spazio «best-effort», da usare con giudizio oltre i primi gigabyte. Un file può
  arrivare a 500 GB, e non c'è un limite per repository.
  https://huggingface.co/docs/hub/storage-limits
- Download anonimi: 3000 richieste di file ogni 5 minuti per indirizzo IP (tabella di settembre 2025, «subject to change»). Non
  si è trovato un limite di traffico. https://huggingface.co/docs/hub/rate-limits

## ONNX Runtime

- **Il repository** `github.com/microsoft/onnxruntime`, e anche `onnxruntime-genai` e gli altri `onnxruntime-*`, risponde 404 da
  ogni strada: web, API, git, con o senza autenticazione. Gli altri repository di Microsoft rispondono.
  - Nessun avviso ufficiale trovato.
  - Un sito terzo, releasealert.dev, dice «no longer available (or publicly accessible) from GitHub», ma elenca i rilasci fino a
    1.32.0.
  - Le pagine ufficiali puntano ancora lì.
  - Non è solo un problema di questa macchina, ma la causa non è nota.
- **Ultima versione**: 1.32.0 del 13/11/2026, la stessa su PyPI, NuGet e Maven Central.
- **Canali ufficiali delle librerie C/C++** (https://onnxruntime.ai/docs/install/): NuGet `Microsoft.ML.OnnxRuntime` per Windows,
  Linux e macOS; Maven per Android; CocoaPods per iOS. Le release di GitHub non sono elencate come canale per le librerie C/C++
  principali. Non c'è più il sorgente pubblico da cui compilarle.
- **Obblighi di chi ridistribuisce le librerie**:
  - il testo MIT con il copyright di Microsoft;
  - `ThirdPartyNotices.txt`, che riporta le licenze dei componenti: Apache-2.0, BSD, MPL-2.0 per Eigen, Boost, ISC.

  Kalliope li mette già in `share/doc/kalliope/onnxruntime/`.

## CC BY 4.0, i pesi di Kyutai

https://creativecommons.org/licenses/by/4.0/legalcode

Chi li ridistribuisce, anche convertiti, deve:
- citare l'autore e mantenere gli avvisi;
- mettere il collegamento al materiale e alla licenza;
- **dire che li ha modificati** (qui: esportati in ONNX, pesi a 8 bit).

Non può aggiungere condizioni che limitino i diritti della licenza (§2(a)(5)(B)).

La regola del consenso delle condizioni di Kyutai si comunica a chi usa Kalliope e il programma la fa rispettare nei suoi gesti
(«la tua voce, o di chi ti ha dato il consenso»), ma non diventa una condizione aggiunta alla licenza dei pesi. È una lettura,
non un parere legale.
