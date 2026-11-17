# Incarico 3b-b · «stato»: costruzione (completare senza ridisegnare) · progresso

Ruolo design-build. Incarico: `design/lavoro/incarichi/3b-stato-costruzione.md`. Partenza `c8d2aa3` (HEAD `2f3d478`: solo documenti in più). Porte 8910–8919, cartelle `/tmp/lavoro-3bb-*`.
Nessun commit, nessun push, nessuna finestra sullo schermo, nessun altro agente. Ambiente: `source prove/env.sh`.

**Stato: consegnato** (17/11/2026). Ultimo comando: `bash prove/corsa.sh H-… 8911 /tmp/lavoro-3bb-sito-H-it esame-impaginazione.mjs …` e `node prove/robustezza.mjs …` sul sito H.

## Come si prova (per chi riprende)

- `prove/costruisci.sh <nome> <it|10> <vivo|commit> [--pseudo]` copia l'albero (website, design-system, tools, docs) in `/tmp/lavoro-3bb-radice-<nome>` e costruisce il sito in `/tmp/lavoro-3bb-sito-<nome>` con i dati della versione di
  `/tmp/lavoro-3bb-dati/releases.json` (v0.1-rc.1, prerelease) e con `GIT_DIR` del repository (così la costruzione trova i file del tag). `it` = solo italiano (il sito di oggi), `10` = italiano + nove lingue di prova.
- **I file provati sono «H»**: `/tmp/lavoro-3bb-radice-H-10` (albero) e i siti `/tmp/lavoro-3bb-sito-H-it`, `…-H-10` (con `--pseudo`: en-XA, ar-XB). Tutte le prove finali (`esiti/H-*`) girano su H; le prove di
  esplorazione, su copie precedenti (`c1`…`c12`, `F`, `G`), stanno in `esiti/esplorazione/` e `esiti/controprove/`. F → G → H cambiano soltanto `inoltra.css` (il prefisso `-webkit-user-select`) e i due file del catalogo
  (`catalogo-stato.js`, `.css`); le foto delle lingue (`foto-pseudo/`) sono state fatte su F (le pagine uguali a H salvo quei file).
- `prove/corsa.sh` serve il sito e lancia gli strumenti della skill; `config-prove.mjs` legge `design-system/metodo.config.mjs` dell'albero provato; `config-lingue.mjs` fa lo stesso stato per stato in ogni lingua.
  `prove/robustezza.mjs` (tastiera a due ritmi, domande, dettagli, copia, senza JavaScript, senza stili, senza token, «riduci movimento», scorrimento, scheda in secondo piano, ritorno, ricarica),
  `prove/catalogo.mjs`, `prove/etichetta-tu.mjs`, `prove/senza-cornice.mjs`, `prove/foto-*.mjs`, `prove/impronte.sh`.

## Che cosa ho fatto, punto per punto

1. **Catalogo (I5)** — `design-system/catalogo/catalogo-stato.js` + `.css` (+ cinque `<link>` e uno `<script>` in `index.html`): sezione «Pagina «stato»» dopo «Pagine interne», cinque schede con identificatore, regola, confine, persona,
   provenienza e **44 prove**: la riunione provata (a riposo, prima dell'arrivo, «Tu» parla, il microfono risponde, l'onda e il tratteggio, l'arrivo riproducibile con gli stessi token, testo più lungo); la catena (intera,
   a cascata, una tappa spenta e accesa, la riga delle parole e la riscrittura, i pacchetti e le app, testo più lungo, **le fonti** a riposo / al passaggio / al fuoco / senza collegamento, su scena scura e chiara, **la parentesi
   «non misurato» che segue i nodi**, **i dettagli a richiesta** al telefono nella pagina viva); le domande (senza JavaScript, scelta, i cinque stati del comando, testo più lungo); il varco (i cinque passi scelti dal catalogo,
   senza JavaScript, testo più lungo); il messaggio (riposo, copiato con l'anello riproducibile, non riuscito, senza appunti, senza JavaScript, testo più lungo); 11 pagine vive a 1440, 390 e 844×390 con comandi che premono i
   comandi veri del riquadro. Si apre senza errori in tre motori (numeri sotto).
2. **Dati, non scritti a mano (M5)** — `tools/site.py`: segnaposto `{{kalliope.page.url}}` (l'indirizzo della pagina nella sua lingua, scritto dalla stessa funzione `indirizzo_pagina` del `canonical`); la bolla del messaggio mostra
   quell'indirizzo e `stato.js` copia **il testo della bolla**, non `location`. Un indirizzo si legge sempre da sinistra a destra (`<span dir="ltr">`: in ar e ur la barra finale andava in testa). Il testo copiato non ha i segni
   di verso (U+2066–2069) che la costruzione mette attorno alle parti latine da destra a sinistra.
   **I moltiplicatori** di `scendono()` (6), la curva delle dissolvenze delle domande, le fasce del passo che conta (4) e l'aria di ciò che un gesto apre: 13 token nuovi in fondo a `token.css`
   («Costruzione di «stato»», `TOKEN.md`); nessun numero resta nello script.
3. **Le fonti si aprono (M7)** — ogni nome di file di `.fonte` (14 etichette, più i due file di «L'elenco completo» delle licenze) è `<a href="{{kalliope.source.url}}/percorso">` (cartelle: `{{kalliope.tree.url}}`), da
   `https://github.com/SANSEVIERIA-OU/kalliope/blob|tree/<tag della versione mostrata>`; `title` con il percorso intero; stile `.fonte a` in `catena.css`. **Prova nella costruzione** (`passo_fonti`, `percorsi_della_versione`):
   la costruzione chiede al repository i file di quella versione (git locale se ha il tag, altrimenti l'API pubblica; offline senza tag: non può sapere e lo dice) e una fonte che a quella versione non c'è resta il suo nome,
   senza collegamento, con una riga nel registro. **Risultato a `v0.1-rc.1`**: 23 collegamenti su 24 si aprono su un file o una cartella che c'è; **`.github/workflows/pages.yml` a quella versione non esiste** (il sito è stato
   aggiunto dopo): resta etichetta senza collegamento. *Da confermare con chi coordina* (nessun file di quella versione dice che il sito sta su GitHub Pages; alla prossima release il collegamento tornerebbe da solo).
   Prove in `tools/test_translations.py`, classe `FontiEIndirizzo` (9 prove; su `tools/` di `c8d2aa3` sono rosse: 2 fallimenti, 7 errori; `esiti/controprove/controprova-test-fonti-su-c8d2aa3.txt`).
4. **M11** — `website/componenti.js`, `misuraEtichette()`: l'etichetta di «Tu» si misurava con la larghezza del testo contro quella del riquadro, a meno di un pixel di tolleranza; con il carattere di riserva (140,3 contro 139 px a 390) il testo
   non stava e la misura diceva di sì. Ora **conta le righe vere** (come l'azione della barra). Senza i caratteri del sito: a 390×844 una riga, `nome-corto`, 30×19 px, non tocca le barre (prima 155×34, due righe). Con i caratteri del sito
   non cambia niente: sonda `etichetta-tu.mjs` su `stato`, home e «non ancora», 10 misure × con e senza caratteri, 60/60 in Chromium; Firefox e WebKit 32/32; `confronta-scelta` della home e di «non ancora» 0%.
5. **I3 riprovato** — `senza-cornice.mjs` (cornice.js bloccato, 5,5 s di attesa): «stato» a 1440×900 e 390×844 in Chromium, Firefox e WebKit: 3 elementi invisibili, gli stessi di senza JavaScript, classe `js` tolta (6/6). Foto a quattro
   schermate in `foto/senza-cornice/`.
6. **Stati, errori e recupero** — difetti trovati dalle prove e corretti (sotto, «Difetti trovati e corretti») e tutto il resto provato con `prove/robustezza.mjs`.
7. **Tutte le larghezze**, **8. Lingue**: numeri sotto.

## Difetti trovati con le prove e corretti (ognuno è ora una prova che fallisce sulla copia di prima)

| Difetto | Dove era | Correzione | Prova che falliva |
|---|---|---|---|
| M11, etichetta di «Tu» su due righe senza i caratteri | `componenti.js` | conta le righe vere | `etichetta-tu.mjs`: 390×844 senza caratteri, 2 righe |
| L'indirizzo mostrato ≠ copiato (M5) | `stato.js`, pagina | `{{kalliope.page.url}}`, si copia il testo della bolla | `robustezza.mjs copia` + 3 prove di `FontiEIndirizzo` |
| La scelta dei dettagli si perdeva passando da telefono a computer e ritorno | `stato.js` | `sceltaDettagli` (un gesto sul titolo la ricorda) | `robustezza.mjs dettagli` a 390×844: «00101 → 00000» (c1) |
| Il fuoco su un collegamento della risposta si perdeva se la bolla si spostava (cambio misura) | `stato.js`, `posto()` | si rimette il fuoco dove era | `robustezza.mjs domande`, 1440 e 390 (c1: il fuoco finiva su `body`) |
| Ricarica a metà catena: una tappa con la parte alta già oltre il bordo restava spenta e la linea mancava | `stato.js`, `accendi()` | «saltata» = il suo inizio sopra il bordo (`top < 0`, non `bottom < 0`) | `robustezza.mjs ricarica`: accese «101110» (c2) → «111110» |
| La risposta della copia e i dettagli aperti restavano sotto il bordo; la bolla era misurata a metà della sua entrata (rimpicciolita) o del suo ridimensionamento | `stato.js` | `inVista()`: ciò che un gesto apre resta in vista (la sua parte alta sotto la barra se è più alto dello spazio; con il comando o la domanda premuta se ci stanno insieme), misurato quando ha la sua altezza | esame a 22 misure: 18 segnalazioni su `c8d2aa3` (stessa configurazione) → 0 + 3 limiti dichiarati |
| La bolla appiccicosa sugli schermi bassi (844×390) stava 20 px più giù del necessario | `domande.css` | `--domande-bolla-sopra-basso` (altezza ≤ 500 px) | `robustezza.mjs domande` a 844×390 (ogni risposta) |
| «I dettagli e le fonti» largo quanto il testo portava fuori dal bordo i paragrafi (en-XA a 326 e 360 px: 16 ESCE, 8 FUORI) | `catena.css` | colonna `minmax(0, 1fr)` | `esame` en-XA 326×326 (c9: 38 segnalazioni → 13, tutte altre) |
| Il testo da copiare a mano non si selezionava con un clic in WebKit (`user-select` senza prefisso) | `inoltra.css` | `-webkit-user-select: all` accanto a `user-select: all` | `robustezza.mjs copia`, WebKit 1440×900: 46/47 → 47/47 |
| Un indirizzo in una pagina da destra a sinistra comincia con la barra finale | pagina | `<span dir="ltr">` | `robustezza.mjs copia --rtl` (ar, ur, ar-XB) |
| Nel catalogo i cinque passi del varco uscivano dalla riga a 390 px; il blocco chiaro aveva il fondo scuro | catalogo | `.cat-passi` va a capo, `.cat-quadro.scena-chiara` | `catalogo.mjs` a 390×844 (click intercettati) |

Trovati come difetti della prova (non della pagina) e corretti nella prova: tolleranza di tempo nel giro di Tab senza JavaScript (il punto di partenza di Tab dopo uno scorrimento), Firefox senza finestra che resta sull'ultima sosta invece di uscire dalla pagina,
la fascia del varco al telefono (il passo va al 66% dell'altezza, non al 50%), i segni di verso nelle pagine da destra a sinistra, il titolo che non è in vista dopo il ritorno su uno schermo basso.

## Prove sui file H, con i numeri

**Statici** (`esiti/H-statici.txt`): `translations.py extract --check` e `check --complete` (260/260, e le nove lingue di prova 260/260), `css_logico.py` (30 fogli), **81 prove degli strumenti** (72 + 9 nuove, OK), `controlla-sorgenti.mjs`
(**29 fogli, valori solo nei token**).

**Catalogo** (`prove/catalogo.mjs`): Chromium 1440×900 19/19 e 390×844 18/18, Firefox 1440×900 19/19, WebKit 1440×900 19/19 (una corsa su quattro in WebKit è fallita, una sola prova, con le altre corse in parallelo e il riquadro che non
disegnava ancora: la risposta nel riquadro cambiava dopo la fine dell'attesa fissa di 1,5 s; non la so spiegare con certezza e non l'ho riprodotta sulla pagina; ora la prova aspetta fino a 8 s). 5 schede, 44 prove, 11 pagine vive.

**Larghezze di «stato» in Chromium** (`esame-impaginazione.mjs`, 6 stati: riposo, menu, domanda, dettagli, copia fatta, copia non riuscita; il menu e i dettagli non esistono dove la barra mostra le voci / al computer, e la misura è saltata):
- le **36 larghezze delle soglie** a 900 d'altezza (`esiti/soglie-stato.txt`, `scripts/soglie.mjs`): 216 casi, **183 puliti**, 33 senza lo stato;
- le soglie d'altezza (500 501 699 700 759 760 799 800 802 803 819 820) a 390, 844, 1366, 1440: 288 casi, **228 puliti**, 60 senza lo stato;
- le **22 misure** (i 15 dispositivi e 7 finestre basse o strette): 132 casi, **119 puliti** (2 con limite: 3 voci dichiarate), 13 senza lo stato (le 40 segnalazioni di `2-3a-correzioni`: erano 40 a `b456308`; 22 le aveva già tolte 3b-c; a `c8d2aa3`, con la stessa configurazione, 18; con lo stato nuovo dei dettagli 20: `esiti/controprove/P-misure-*.txt`; qui 0 + 3 limiti);
- `dispositivi-qa.mjs` sui 15 dispositivi (`stato`, 6 stati): 90 casi, **82 puliti, 3 limiti dichiarati**, 5 senza lo stato; Firefox e WebKit (Telefono, Telefono piccolo, Telefono girato, Computer): 17 + 4 casi puliti e i 2 limiti dell'844×390, ciascuno;
- **Firefox e WebKit** 390×844, 1440×900, 844×390, 360×640: 24 casi, 21 puliti, 1 con i due limiti dell'844×390, 3 senza lo stato, ciascuno.
- **I 3 limiti** (`design-system/metodo.config.mjs`, `limiti`; **li ho scritti io, da confermare alla direzione**, con le foto in `foto-difetti/`): `stato-domanda` a 844×390 (le due risposte più lunghe, 362 px, sono più alte dello spazio sotto la barra, 306 px: la parte alta
  sta in vista, il fondo e la domanda premuta no) e a 326×326 (la bolla sta tutta nello schermo, 234 px, ma con la domanda premuta sopra non c'è spazio: la bolla ripete la domanda in testa). Nessun limite non usato.

**Robustezza** (`prove/robustezza.mjs`, `esiti/H-robustezza-*`): Chromium **1440×900** tastiera lenta + veloce 20/20, domande, dettagli, copia, senza JavaScript, senza stili, senza token, «riduci movimento», scorrimento, scheda in secondo piano, ritorno, ricarica 77/77;
**390×844** 20/20 e 77/77; **844×390** 87/87 (con la tastiera veloce); **360×640** 87/87; **Firefox** 390×844 e 1440×900 80/80 ciascuno, tastiera lenta a 1440 10/10; **WebKit** 390×844 e 1440×900 80/80 ciascuno, tastiera lenta a 1440 10/10;
da destra a sinistra, **ar e ur** a 1440 e 390 (domande, dettagli, copia, senza JavaScript, «riduci movimento», tastiera veloce) 59/59 ciascuno. Che cosa guardano: ordine del fuoco dall'alto in basso (e da una colonna alla seguente), contorno del fuoco
visibile e ≥ 1,8:1, ogni sosta nello schermo e non sotto la barra a passo di persona (2 s) e in fretta, annuncio «Risposta: …» in `#annuncio`, `aria-expanded` e regione `aria-live`, il testo copiato e l'indirizzo, la risposta della copia in vista, la catena
accesa entro 176 ms dalla scorsa veloce, il ritorno in su, le ancore, il varco passo per passo, le impronte che non restano a metà, la scheda in secondo piano che ferma e fa ripartire l'arrivo, il ritorno e la ricarica.

**Lingue** (`config-lingue.mjs`, 5 stati × 6 misure: 390×844, 360×640, 844×390, 1440×900, 326×326, 1366×640; `esiti/H-lingue-*`): el, de, fi, bg **puliti**; ar, ur, hi, bn: soltanto il primo paragrafo dei dettagli a 326×326, più alto dello spazio (24–119 px); en-XA 13 segnalazioni, ar-XB 3
(sotto). I testi di «stato» nelle nove lingue di prova restano in italiano (le traduzioni di prova non li hanno: `crea_cataloghi.py`, 260 voci per lingua, rigenerati i nove `.po` con le chiavi nuove): le nove lingue provano lo specchio, i caratteri e la barra; il testo più lungo
e le parti da destra a sinistra le provano **en-XA e ar-XB** (tutti i testi). Foto a 390×844 e 1440×900 di en-XA, ar-XB, ar, ur: `foto-pseudo/` (fogli `fogli-<lingua>-<misura>.png`).

**Confronto con la scelta** (`confronta-scelta.mjs`, `c8d2aa3` contro H, con «riduci movimento»): home 1440×900, 1366×640, 390×844, 844×390, 360×640 e dopo 1800 px (1440, 390): **0% di pixel diversi**; «non ancora», le stesse misure: **0%**. «stato» contro `c8d2aa3`: primo schermo a 1440 e 390 0%;
le sole differenze volute sono le fonti (il nome è un collegamento: `README` e gli altri) e l'indirizzo (`https://…/it/stato/`, non `…/kalliope/stato/`): **al telefono va su due righe e `section#inoltra` è 22 px più alta (796 → 818)** (`esiti/H-confronta-scelta-stato-su-c8d2aa3.txt`).

## Che cosa si rompe nelle lingue, con la foto (non ridisegnato)

- **en-XA (+40%)**: dopo la correzione della colonna dei dettagli nulla esce dal bordo (prima 16 ESCE, 8 FUORI a 326×326). Restano, a 326×326: «Menu» su due righe nel pulsante della barra (già noto da 2-f, punto 5) e `p.cifra-numero` «[0,07 š Lorem]» su due righe (il
  riempimento della pseudo-lingua aggiunge parole a un numero: non succede con una lingua vera); il primo paragrafo dei dettagli più alto dello spazio (88 px) e la bolla della risposta 28 px sotto il bordo (`foto-difetti/dettagli-326x326-enXA.png`); l'indirizzo va a capo dentro «en-XA»
  (il nome della cartella della pseudo-lingua; le lingue vere hanno due lettere). Il titolo del primo schermo a 1440 va su sei righe e il comando resta nello schermo (`foto-pseudo/fogli-en-XA-1440x900.png`).
- **ar-XB**: lo specchio regge in ogni tratto (barra, catena con la parentesi a sinistra, varco, bolla con la coda dall'altra parte, il messaggio); a 326×326 il primo paragrafo dei dettagli sta 30 px sotto il bordo e la bolla 7 px (`foto-difetti/`, foto d'insieme in `foto-pseudo/fogli-ar-XB-*.png`).
- **ar, ur** (testi di «stato» in italiano dentro una pagina da destra a sinistra, quindi parole in ordine rovesciato: è il limite della prova, non della pagina): barra, catena, varco e messaggio specchiati; l'indirizzo si legge da sinistra a destra; l'urdu a 326×326 ha i dettagli 119 px
  sotto il bordo (righe alte del nastaliq: `foto-difetti/dettagli-326x326-ur.png`). hi 24 px, bn 19 px.
- **zh**: 34 `SPEZZATA` nelle frasi in comune con la home («开源», «本网站不使用»…): lo strumento vede come una parola spezzata il ritorno a capo normale del cinese (già noto da 2-f); **bn** «OSI-এর» a capo nel piede (frase in comune). Nessuno è di «stato».

## Difetti d'aspetto trovati e non miei da decidere (con la foto)

1. **844×390, le due risposte più lunghe** («Ha frasi pronte o simboli?», «Chi c'è dietro?»): la bolla (scritta grande come la frase della riunione, 362 px) è più alta dello spazio sotto la barra; il fondo si legge scorrendo, ma non si vede intera
   (`foto-difetti/domanda-844x390-risposta-piu-alta-dello-spazio.png`). La direzione può abbassare la scritta sugli schermi bassi o accorciare le due risposte; ho dichiarato il limite.
2. **326×326, la domanda premuta** sta sopra la barra di 10 px (la bolla ripete la domanda in testa) (`foto-difetti/domanda-326x326-la-domanda-premuta-sopra-la-barra.png`).
3. **326×326, i dettagli aperti**: in en-XA, ar-XB, ur, hi, bn il primo paragrafo è più alto dello spazio (`foto-difetti/dettagli-326x326-*.png`); in italiano sta.
4. **L'indirizzo ora è «https://…/it/stato/»** (M5: lo stesso mostrato e copiato): al telefono va a capo in due righe, di norma dopo «sansevieria-» (`foto/senza-cornice/senza-cornice-390x844-4-inoltra.png`) e alza il tratto di 22 px. Si può mostrare senza «https://» e copiare
   con: ma allora non sono la stessa stringa.
5. **La fonte `.github/workflows/pages.yml` non ha un file a `v0.1-rc.1`** (punto 3 sopra): resta etichetta. Decisione di chi coordina: o si toglie la fonte, o si lascia così fino alla prossima release.
6. Il collegamento dentro la `.fonte` ha la linea dei collegamenti sotto il nome (prima l'etichetta era piatta): è il segno che si apre, ma cambia l'aspetto della etichetta; a riposo, al passaggio e al fuoco: `foto/fonti/`.

## Impronte (primi 16 caratteri di sha256; `esiti/impronte-prima.txt` = `esiti/impronte-dopo.txt`, nessun «DIVERSO»)

`website/stato/index.html` f729c2481dc88cb6 · `stato.js` 0f7d38986c3e27b5 · `componenti.js` 59245a4f24e4ce11 · `cornice.js` 09007c7fd0fc98b8 · `design-system/token.css` c7e8c7d5b85eee99 · `catena.css` 6d58c1c1f8569b09 · `domande.css` e08c244e1bf89dc3 ·
`varco.css` cb4ba72ef1ec37d5 · `inoltra.css` 0daf5089e292533d · `riunione-provata.css` 07b658969129ec61 · `pagina.css` 7d5624b8b0212bb7 · `catalogo-stato.js` 0055fcc46c0ae03e · `catalogo-stato.css` 379ea5893cc98164 · `catalogo/index.html` 297d4d272089939c ·
`metodo.config.mjs` 8576214ca043cc96 · `SISTEMA.md` 61808a80d2fcc366 · `TOKEN.md` ee016ce7a5b98815 · `tools/site.py` b2b96f751f7c5b28 · `tools/test_translations.py` b121aec73f0f026e · `site.pot` e1dcb4d466284622 · `it.po` f16afc9b148e35db.
Albero provato intero (website, design-system, tools) `2a8181e1e6a0aad186b3dfd59ee242fc`; sito costruito: it `4829c296d707fa2d99f564490bcb2d0f`, a dieci lingue `e0a4a85fbb03420c63feb799eb03da80`.

## File toccati

`website/stato/index.html`, `website/stato/stato.js`, `website/componenti.js`; `design-system/token.css`, `componenti/catena.css`, `componenti/domande.css`, `componenti/inoltra.css`, `metodo.config.mjs`, `catalogo/index.html`, `catalogo/catalogo-stato.js` e `.css` (nuovi),
`SISTEMA.md`, `TOKEN.md`; `tools/site.py`, `tools/test_translations.py`; `website/lingue/site.pot`, `it.po` (rigenerati: 15 messaggi con le fonti, nessuna parola italiana cambiata); `docs/releasing.md` (un paragrafo); i nove `.po` di prova
`design/lavoro/2-lingue-aspetto/prova-lingue/*.po` (rigenerati con `crea_cataloghi.py`); questa cartella. Non toccati: `pagina.css`, `cornice.js`, `varco.css`, `riunione-provata.css`, `website/non-ancora/`, `website/index.html`, `design/lavoro/STATO.md`.

## Suggerimenti per chi coordina

- `.github/workflows/ci.yml` e `pages.yml` fanno un `checkout` senza i tag: la costruzione che pubblica non trova `v…` nel git locale e chiede l'albero all'API pubblica (una richiesta; usa `GH_TOKEN`/`GITHUB_TOKEN` se c'è). Se l'API non risponde, lascia i collegamenti e lo dice nel registro.
- Aggiornare la riga 3b-b di `STATO.md` e le voci «Da completare a chi costruisce» di `3b-stato/PIANO.md` (I5, M5, M7, M11, stati, larghezze, lingue sono fatti; restano le decisioni sopra).

## Non verificato

- **Lettori di schermo** (Orca, NVDA, VoiceOver): l'annuncio «Risposta: …», la regione `aria-live` della bolla (che potrebbe leggere due volte, con `#annuncio`), la risposta della copia (`role="status"`), il nome dei collegamenti delle fonti (`README` ripetuto sei volte: il `title` ha il percorso): provati solo come attributi e testo.
- **Telefoni veri** (il tocco, la barra del browser che cambia l'altezza, il menu), Firefox con la scheda grafica; tutte le larghezze in Firefox e WebKit (solo 4 misure e i dispositivi Telefono, Telefono piccolo, Telefono girato, Computer); la matrice dei 15 dispositivi × 3 motori.
- Testo grande, zoom e `text-scale` (non richiesti da questo incarico; `<meta name="text-scale">` non messa, come la home).
- Il suono (nessuno in questa pagina); le altre lingue vere (le nove di prova hanno i testi di «stato» in italiano); l'intermittenza del catalogo in WebKit (sopra).
- Il collegamento a `pages.yml` e a ogni fonte è verificato sul tag locale `v0.1-rc.1`; la rete non è stata usata (nessuna richiesta all'API).
- Le foto delle lingue sono su F, non su H (le pagine uguali; `inoltra.css` e il catalogo differiscono).
