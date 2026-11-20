# Rilasci, versioni, changelog e AUR: fatti con le fonti (ricerca del 20/11/2026)

Tre ricerche (vibe-next:research, Haiku), lette da chi coordina. Si citano soltanto le fonti ufficiali aperte. Ciò che le
ricerche non hanno potuto aprire è segnato come tale.

## GitHub Actions per un repository pubblico (organizzazione con piano Free)

- **Gratis, senza limite di minuti.** I runner standard ospitati da GitHub (Linux, Windows, macOS) sono gratuiti nei repository
  pubblici: «The use of standard GitHub-hosted runners is free: In public repositories». Fonte:
  https://docs.github.com/en/billing/concepts/product-billing/github-actions (sorgente aggiornato il 28/10/2026). E ancora: «Standard
  hosted runner usage in public repositories remains free», https://github.blog/changelog/2026-01-01-reduced-pricing-for-github-hosted-runners-usage/.
  I runner «larger», comprese le GPU, si pagano anche nei repository pubblici, ma un'organizzazione Free non li ha comunque:
  https://docs.github.com/en/billing/reference/actions-runner-pricing.
- **La tariffa per i runner self-hosted** annunciata il 16/12/2025 è stata rinviata («to take time to re-evaluate our approach»). Non
  toccava i repository pubblici: https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/.
- **Limiti che restano**: 6 ore per job, 35 giorni per workflow, 20 job contemporanei di cui 5 macOS, matrice di 256 job, cache di
  10 GB per repository. Fonte: https://docs.github.com/en/actions/reference/limits (sorgente aggiornato il 12/11/2026).
- **Release**: fino a 1000 file per release, ogni file sotto i 2 GiB, nessun limite sul totale né sulla banda. Fonte:
  https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases.
- **Attestations**: disponibili nei repository pubblici con ogni piano, anche Free. Fonte:
  https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations.
  - `actions/attest-build-provenance` v4.2.2 (6/8/2026) è soltanto un involucro di `actions/attest` v4.2.2 (4/8/2026), e gli esempi
    della documentazione usano `actions/attest@v4`.
  - `release.yml` usa ancora `attest-build-provenance@v4`.
- **Dal 2/12/2026** `pull_request_target` è bloccato di default nei repository pubblici:
  https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2/. Kalliope non lo usa (controllato il
  20/11).

## AUR

Le pagine di ArchWiki e di aur.archlinux.org rispondono agli accessi automatici con una pagina di blocco (Anubis), quindi le regole
di invio non sono state lette. Fatti verificati:
- **`pkgver`** non può contenere trattini (PKGBUILD(5), https://man.archlinux.org/man/PKGBUILD.5).
  - vercmp(8) ordina così: «1.0a < 1.0b < 1.0beta < 1.0p < 1.0pre < 1.0rc < 1.0 < 1.0.a < 1.0.1»
    (https://man.archlinux.org/man/vercmp.8).
  - Quindi `0.1rc2` viene prima di `0.1`, ed è la forma giusta.
  - `0.1.rc2` invece verrebbe dopo `0.1`, che è sbagliato.
  - Da provare su un Arch vero con `vercmp`.
- **Più chiavi SSH sullo stesso account AUR** si possono registrare da aurweb 4.0.0 (2015): https://bugs.archlinux.org/task/45469.
- **Impronta Ed25519 di aur.archlinux.org**: `SHA256:RFzBCUItH9LZS0cKB5UE6ceAYhBD5C8GeOBip8Z11+4`, annunciata il 28/7/2020
  (https://archlinux.org/news/aur-migration-new-ssh-hostkeys/). La stessa la controlla il workflow AUR di Kalipso, che funziona.
- **Versioni di prova su AUR**: nessuna regola ufficiale letta. Le fonti informali dicono di pacchettizzare l'ultima versione che
  il progetto considera stabile, o di usare un nome a parte per le versioni di prova. Kalipso pubblica su AUR solo le versioni finali.
- I nomi `kalliope` e `kalliope-bin` sono liberi su AUR (RPC interrogata il 20/11/2026).
- **La chiave di Kalipso** per AUR è soltanto un secret del suo repository (`AUR_SSH_KEY`), che non si può rileggere. Su questa
  macchina non ce n'è una copia.

## Versioni e changelog: gli strumenti, ultime versioni al 20/11/2026

| Strumento | Ultima versione | Che cosa fa, per noi |
|---|---|---|
| Keep a Changelog | 2.0.0 (7/6/2026), https://keepachangelog.com/en/2.0.0/ | formato di un changelog scritto a mano, per le persone |
| SemVer | 2.0.0, https://semver.org/ | numeri MAJOR.MINOR.PATCH; Kalliope usa i passi X.Y (`docs/releasing.md`) |
| Conventional Commits | 1.0.0, https://www.conventionalcommits.org/en/v1.0.0/ | formato dei messaggi di commit che i generatori leggono |
| release-please | action v5.0.0 (22/4/2026), CLI v17.11.2 (24/8/2026) | una PR di release dai commit, poi tag e release; changelog generato dai commit; supporta Rust |
| git-cliff | 2.14.2 (18/9/2026) | changelog generato dalla storia Git |
| semantic-release | 26.0.1 (16/11/2026) | versione, note e tag dai commit; Rust solo con un plugin di comunità |
| cargo-release | 1.1.7 (21/10/2026) | versione, tag e pubblicazione su crates.io; non scrive il changelog |
| release-plz | 0.4.3 (2/11/2026) | PR di release per crate Rust, changelog con git-cliff, crates.io |
| Note generate da GitHub | documentazione viva | note dalle pull request unite; Kalliope lavora senza PR |

Gli strumenti automatici generano il changelog dai commit, cioè per chi sviluppa. Kalliope invece lo scrive a mano per chi usa il
programma (`docs/releasing.md`), e lo stesso fa Kalipso.
