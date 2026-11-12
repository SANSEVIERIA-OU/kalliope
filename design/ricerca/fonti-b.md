# Fonti Gruppo B (competenze), tempo 1

Ricercatore: worker `ricerca-b` (ruolo vibe-next:research). Data di consultazione: 12/11/2026 (tutte le letture e le richieste HTTP).
Riferimenti: `design/ricerca/piano.md` §3.2, §6.2, §6.3 (regole di verifica §3); contesto `design/progetto.md` §1-§4.
Stato: fonti e prove HTTP raccolte. Nessuna visita visiva dei siti dei prodotti (compito del ruolo visivo, tempo 2).

## 0. Come è stato fatto (e limiti)

- Catalogo ufficiale (`webbyawards.com/categories`, `winners.webbyawards.com`): pagine renderizzate con Chromium headless (Playwright 1.60 da `/workspace/test-playwright`), lanciato sempre con `env -u DISPLAY -u WAYLAND_DISPLAY`: nessuna finestra, nessun `passo.mjs` in modalità finestra. Il testo grezzo dell'HTML era una shell vuota (placeholder `{{ }}`), quindi il testo letto è quello renderizzato.
- Chrome MCP o browser interattivo equivalente: non esposto in questo host (il ruolo ha solo WebSearch/WebFetch e Bash). Dichiarato come limite.
- Prodotti: solo richiesta HTTP semplice (curl, seguito dei redirect) per l'esito di accesso; nessuna navigazione dei siti. Per le verifiche anti-bot: nessun segnale nei primi 4 KB di risposta (Cloudflare, captcha, «Just a moment»), salvo dove indicato.
- Ricerca web: 2 query (`Webby Awards 2026 winners Best Navigation Structure Features & Design`; `Webby Awards "Best Visual Design - Innovation" category`). Ogni URL di risultato è stato aperto (vedi §8), con merge dei duplicati.
- File grezzi: `design/incarichi/ricerca-b/estrazioni/` (testo renderizzato `NN.txt`, link `NN.links.txt`, ancore con testo `NN.ancore.tsv`, screenshot `NN.png`, riepilogo `riepilogo.json`); esiti HTTP in `design/incarichi/ricerca-b/prove-http/run-01/esito.txt` e `esito-2.txt`; voci 2026 estratte in `estrazioni/voci-2026.json`. Strumenti: `design/incarichi/ricerca-b/strumenti/`.

## 1. Edizione

- Edizione 2026 (30th Annual Webby Awards). Fonte: comunicato ufficiale `https://www.webbyawards.com/press/press-releases/30th-annual-webby-awards-announce-2026-winners/` (letto 12/11/2026): annuncio dei vincitori del 21 aprile 2026, cerimonia dell'11 maggio 2026 a New York. Conferma: `gamesbeat.com/webby-awards-announce-2026-gaming-category-winners-exclusive/` (cerimonia 11 maggio) e `thewrap.com/...2026-webbys-winners-list...` («30th Anniversary class of Webby Winners»).
- Il sito dei vincitori mostra già «31st ANNUAL WEBBY AWARDS CALL FOR ENTRIES OPEN»: l'edizione 2026 è conclusa ed è la più recente. Il registro della skill (`storico/edizioni/2026.json`, consultato 2026-10-20/21) indica la stessa edizione: è una conferma di fonte secondaria, non una verifica autonoma.

## 2. Candidati verificati (20)

Ordine: utilità ai compiti del Gruppo B (C1, C3, C6, C7, C9, C11, C12, C13, C14; C2 e C8 dove il compito lo richiede). Per ognuno: prodotto (indirizzo dal link «View the work» della scheda, non dell'agenzia), categoria ufficiale, edizione, premio, scheda, motivazione, chi lo ha realizzato, esito della richiesta HTTP, compiti, prima ipotesi di cosa non prendere (ipotesi nostra, non verificata).

«Motivazione individuale non disponibile» vale per tutti i 20: nelle schede c'è solo il testo «About <categoria>» (criterio della categoria, citato come tale) e, per 9 schede, un discorso di accettazione («Five Word Speech») che non è una motivazione della giuria.

### 2.1 Candidati dalla parte di C9 (navigazione) e C1 (pagina d'arrivo)

**01. Ottografie**
- Prodotto: https://www.ottografie.nl/ («View the work»).
- Categoria: `Best Navigation/Structure` (Features & Design) · Webby Winner · edizione 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-navigationstructure/363523/ottografie
- Criterio della categoria (scheda, letterale): «Sites that offer the best-possible user experience through superior navigation and site structure. Only information architecture will be judged.»
- Motivazione: non disponibile.
- Realizzato da: Exo Ape (entrant; sito `https://www.exoape.com/`).
- Accesso (richiesta HTTP, 12/11/2026): 200, 281 KB, nessun redirect, nessun segnale anti-bot.
- Compiti: C9, C10.
- Prima ipotesi di cosa non prendere: lo stile grafico, perché il premio giudica solo l'architettura informativa; la struttura va presa, l'estetica no.

**02. Netflix Ads**
- Prodotto: https://advertising.netflix.com/en-us («View the work»).
- Categoria: `Best Navigation/Structure` · People's Voice Winner · 2026. Nella stessa edizione: Honoree in `Best Responsive/Adaptive Design for Mobile`.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-navigationstructure/378594/netflix-ads
- Motivazione: non disponibile.
- Realizzato da: BASIC/DEPT® (entrant, `deptagency.com`), con team Netflix indicato.
- Accesso: 200, ma corpo di 2,2 KB (risposta breve con script): contenuto non valutato con richiesta semplice.
- Compiti: C9, C11.
- Prima ipotesi di cosa non prendere: il registro rivolto a inserzionisti; il pubblico non è quello di persone con difficoltà di comunicazione.

**03. The Renaissance Edition**
- Prodotto: https://www.shopify.com/editions/winter2026 («View the work»).
- Categorie: `Best Home Page` · Webby Winner · 2026; `Best Visual Design - Aesthetic` · People's Voice Winner · 2026 («2 Wins»).
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-home-page/372642/the-renaissance-edition
- Criteri (scheda): Home page: «Only home page is judged. Sites that set an industry standard of excellence for home page design.» Aesthetic: «Only visual design judged. Geared toward sites and experiences where visual design is intended to be beautiful, emotional, and appeal to the senses.»
- Motivazione: non disponibile.
- Realizzato da: Shopify (entrant).
- Accesso: 200, 1,45 MB, nessun segnale anti-bot.
- Compiti: C1 (prima schermata che spiega un servizio); C13 (identità, come secondo progetto Aesthetic).
- Prima ipotesi di cosa non prendere: la spettacolarità di una pagina evento commerciale a stagione; non è un modello per un sito che deve parlare con calma.

**04. Jesko Jets**
- Prodotto: https://jeskojets.com/ («View the work»).
- Categoria: `Best Home Page` · People's Voice Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-home-page/363546/jesko-jets
- Motivazione: non disponibile. Discorso di accettazione letto: «First Idea. Last Obsession. Takeoff» (non è motivazione).
- Realizzato da: The First The Last (entrant, `thefirstthelast.agency`).
- Accesso: 200, 128 KB.
- Compiti: C1.
- Prima ipotesi di cosa non prendere: il registro di lusso di un prodotto costoso; non è il tono per chi cerca un servizio d'aiuto.

### 2.2 Candidati dalla parte di C3, C7, C12 (interfaccia, stati, errori)

**05. DICH™ Fashion**
- Prodotto: https://dich-fashion.webflow.io/ («View the work»).
- Categoria: `Best User Interface` (Features & Design) · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-user-interface/363972/dich-fashion
- Criterio (scheda): «Sites that set an industry standard of excellence for user interface design by creating a seamless experience for end users.»
- Motivazione: non disponibile. Discorso di accettazione: «Blacklead Studio, First Webby, Let's go» (non è motivazione).
- Realizzato da: BL/S® (entrant, `blacklead.studio`).
- Accesso: 200, 216 KB.
- Compiti: C3, C7, C12.
- Prima ipotesi di cosa non prendere: il tono di moda (immagini e tipografia di spettacolo); l'interazione è da prendere, la forma no.

**06. Chase Mobile® App**
- Prodotto: https://www.chase.com/digital/mobile-banking («View the work»). È la pagina pubblica del prodotto sul sito Chase, non il flusso dell'app: il flusso non è stato percorso.
- Categoria: `Best User Experience` (App Excellence, gruppo Apps, Software & Immersive) · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/apps-software-immersive/app-excellence/best-user-experience/362076/chase-mobile-app
- Motivazione: non disponibile.
- Realizzato da: SourceCode Communications (entrant, `sourcecodecommunications.com`).
- Accesso: 200, 370 KB.
- Compiti: C12, C10 (stati, errori, recupero).
- Prima ipotesi di cosa non prendere: il contesto bancario (conferme di sicurezza e linguaggio di tutela) non si applica a un servizio senza account.

**07. Pentagram Archive**
- Prodotto: https://www.pentagram.com/archive («View the work»).
- Categoria: `Best User Experience` (Features & Design) · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-user-experience/363516/pentagram-archive
- Criterio (scheda): «Sites that offer the best user experience through innovative design, and useful functionality.»
- Motivazione: non disponibile.
- Realizzato da: AREA 17 & Pentagram (entrant).
- Accesso: 200, 147 KB.
- Compiti: C12, C10, C9 (ricerca dentro un archivio).
- Prima ipotesi di cosa non prendere: la quantità di immagini e filtri di un archivio di opere; un prodotto con poche schermate non ha quel problema.

**08. The Wildlife Society**
- Prodotto: http://wildlife.org/ (redirect a https://wildlife.org/, 200).
- Categoria: `Best User Experience` (Features & Design) · People's Voice Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-user-experience/381848/the-wildlife-society
- Motivazione: non disponibile.
- Realizzato da: Chariot (entrant, `chariotcreative.com`).
- Accesso: 200 dopo un redirect da http a https, 145 KB.
- Compiti: C6 (lingua per pubblici diversi), C9 (porte per pubblici).
- Prima ipotesi di cosa non prendere: il tono di campagna e le richieste di adesione o donazione (non vanno replicate in Kalliope).

### 2.3 Candidati dalla parte di C6 (scrittura semplice)

**09. Lonely Planet's guide to overtourism in Venice**
- Prodotto: https://www.lonelyplanet.com/articles/venice-overtourism («View the work»). È un articolo, non la home del sito.
- Categoria: `Best Writing (Editorial)` (Features & Design) · People's Voice Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-writing-editorial/362789/lonely-planets-guide-to-overtourism-in-venice
- Motivazione: non disponibile. Discorso di accettazione: «Real Writing Will Always Matter.» (non è motivazione).
- Realizzato da: Lonely Planet (entrant; team indicato: Virginia DiGaetano, Daniel Bolger).
- Accesso: 200, 1,9 MB.
- Compiti: C6, C5.
- Prima ipotesi di cosa non prendere: la lunghezza del reportage; per C6 interessano il ritmo delle frasi e la gerarchia dei titoli.

**10. Chronically Online Magazine by Manychat**
- Prodotto: https://com.manychat.com/ («View the work»). Nota: il link ufficiale è al sottodominio `com.manychat.com`, non a `manychat.com`; da confermare.
- Categoria: `Best Writing (Editorial)` · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-writing-editorial/368481/chronically-online-magazine-by-manychat
- Motivazione: non disponibile.
- Realizzato da: Manychat (entrant, `manychat.com`).
- Accesso: 200, 224 KB.
- Compiti: C6, C5.
- Prima ipotesi di cosa non prendere: il registro informale e il linguaggio dei creator, che non è quello di un sito per persone con difficoltà di lettura.

### 2.4 Candidati dalla parte di C7 e C13 (funzione visiva, identità, movimento)

**11. FOLLOW.ART**
- Prodotto: https://follow.art/ («View the work»).
- Categoria: `Best Visual Design - Function` (Features & Design) · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-function/383443/followart
- Motivazione: non disponibile. Discorso di accettazione: «It Proves Everything Is Possible» (non è motivazione).
- Realizzato da: Vide Infra (entrant, `videinfra.com`). Un post del laboratorio (`videinfra.com/blog/we-won-a-webby-the-oscars-of-web-design`, letto) conferma la vittoria, ma è una fonte dell'entrant.
- Accesso: 200, 301 KB.
- Compiti: C7 (bersagli, contrasto), C6.
- Prima ipotesi di cosa non prendere: l'impianto da galleria d'arte (sfondi e immagini a tutto schermo) che non serve a un servizio di voce.

**12. Igloo Inc**
- Prodotto: https://www.igloo.inc/ («View the work»).
- Categorie: `Best Visual Design - Aesthetic` · Webby Winner · 2026; nella stessa edizione Nominee in `Technical Achievement` (Features & Design).
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-aesthetic/361001/igloo-inc
- Motivazione: non disponibile.
- Realizzato da: Bureaux (entrant, `bureaux.us`); team indicato: Abeto, Pudgy Penguins.
- Accesso: 200, ma corpo di 1,4 KB (shell con titolo «Igloo Inc.»): il contenuto non è valutabile con richiesta semplice.
- Compiti: C13 (identità, carattere). È il primo dei due progetti Aesthetic richiesti dalla regola del piano (§6.2, n. 7); il secondo è il n. 03 (Renaissance).
- Prima ipotesi di cosa non prendere: il mondo di marca (personaggi e pinguini); per l'identità serve la logica, non il tema.

**13. The Spark**
- Prodotto: https://spark.thedigitalpanda.com/ («View the work»).
- Categorie: `Best Use of Animation or Motion Graphics` · People's Voice Winner · 2026; `Best Visual Design - Aesthetic` · Honoree · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-use-of-animation-or-motion-graphics/374106/the-spark
- Motivazione: non disponibile.
- Realizzato da: The Digital Panda (entrant, `digitalpanda.com`).
- Accesso: 200, 27 KB (risposta breve: il contenuto principale potrebbe arrivare via script).
- Compiti: C13 (movimento con ripiego).
- Prima ipotesi di cosa non prendere: l'animazione come contenuto principale senza testo di spiegazione.

**14. Aether 1**
- Prodotto: https://www.aether1.ai/ («View the work»).
- Categorie: `Best Use of Animation or Motion Graphics` · Webby Winner · 2026; `Best Home Page` · Honoree · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-use-of-animation-or-motion-graphics/364444/aether-1
- Motivazione: non disponibile.
- Realizzato da: OFF+BRAND. (entrant, `itsoffbrand.com`).
- Accesso: 200, 247 KB.
- Compiti: C13, C1 (come home, Honoree).
- Prima ipotesi di cosa non prendere: un'apertura animata continua; la variante ridotta va dichiarata, non assunta.

**15. iPhone 17 Pro / 17 Pro Max Product Site**
- Prodotto: https://www.apple.com/iphone-17-pro/ («View the work»); redirect a https://www.apple.com/iphone/ (200).
- Categoria: `Best Use of Video or Moving Image` · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-use-of-video-or-moving-image/374085/iphone-17-pro--17-pro-max-product-site
- Motivazione: non disponibile.
- Realizzato da: Apple (entrant).
- Accesso: 200 dopo redirect, 417 KB.
- Compiti: C2 (comandi del video, didascalie), C13 (video e alternativa quando il media manca).
- Prima ipotesi di cosa non prendere: la produzione video ad alto budget e l'avvio automatico; si prende solo l'idea di un'alternativa testuale.

**16. Lady Gaga - A Digital Home for a Pop Icon**
- Prodotto: http://www.ladygaga.com/ (redirect a https://www.ladygaga.com/us-en, 200).
- Categorie: `Best Mobile Visual Design - Aesthetic` · People's Voice Winner · 2026; `Best Responsive/Adaptive Design for Mobile` · People's Voice Winner · 2026. Nella stessa scheda, fuori dal Gruppo B: `Music` · Webby Winner e People's Voice (Websites & Mobile Sites); «4 Wins».
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/mobile-features-design/best-mobile-visual-design-aesthetic/374444/lady-gaga--a-digital-home-for-a-pop-icon
- Motivazione: non disponibile.
- Realizzato da: Morningview, Commerce-UI & Yung Studio (entrant).
- Accesso: 200, 222 KB.
- Compiti: C11 (lettura e inoltro dal telefono), C13.
- Prima ipotesi di cosa non prendere: il tema musicale (immagini e animazioni ad alta densità).

### 2.5 Candidati dalla parte di C11 (telefono) e C8 (dati)

**17. Pixis - Digital Brand Experience**
- Prodotto: https://pixis.ai/ («View the work»).
- Categoria: `Best Responsive/Adaptive Design for Mobile` (Mobile Features & Design) · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/mobile-features-design/best-responsiveadaptive-design-for-mobile/364964/pixis--digital-brand-experience
- Motivazione: non disponibile.
- Realizzato da: Ryze Agency UK (entrant, `ryzeagency.co.uk`).
- Accesso: 200, 216 KB.
- Compiti: C11, C7.
- Prima ipotesi di cosa non prendere: la campagna di marca di un prodotto AI; il responsive va preso, il registro no.

**18. WWF - Blue Corridors**
- Prodotto: https://bluecorridors.org/explore/species#tracks («View the work»).
- Categoria: `Best Data Visualization` (Features & Design) · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-data-visualization/364937/wwf--blue-corridors
- Motivazione: non disponibile. Discorso di accettazione: «Three Words: Just Keep Swimming» (non è motivazione).
- Realizzato da: Ode (entrant, `ode.partners`).
- Accesso: 200, 3,8 MB (pagina pesante: dato utile per C14, da misurare dal ruolo visivo).
- Compiti: C8 (fonti e metodo), C14 (peso).
- Prima ipotesi di cosa non prendere: la mappa interattiva densa e le tracce di animali; per C8 interessa solo il modo di spiegare le fonti.

**19. Searching for Birds**
- Prodotto: https://searchingforbirds.visualcinnamon.com/ («View the work»).
- Categoria: `Best Data Visualization` · People's Voice Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-data-visualization/384216/searching-for-birds
- Motivazione: non disponibile. Discorso di accettazione: «Your Votes Gave Me Wings» (non è motivazione).
- Realizzato da: Visual Cinnamon (entrant, `visualcinnamon.com`); team indicato: Nadieh Bremer, Emily Barone (The Data Desk).
- Accesso: 200, 88 KB.
- Compiti: C8.
- Prima ipotesi di cosa non prendere: la visualizzazione come contenuto principale; per C8 contano le spiegazioni testuali accanto ai dati.

### 2.6 Candidati dalla parte di C11, C12 (mobile) e C2 (app audio, video)

**20. Beats: Mobile Product Experience**
- Prodotto: https://www.beats-experience.com/ («View the work»). **Non aperto**: richiesta HTTP semplice risposta 500 (due tentativi, 12/11/2026); corpo di 4,8 KB, pagina di errore Next.js (`__next_error__`). Non è una verifica anti-bot. Non valutato.
- Categoria: `Best Mobile User Experience` (Mobile Features & Design) · Webby Winner · 2026.
- Scheda: https://winners.webbyawards.com/2026/websites-and-mobile-sites/mobile-features-design/best-mobile-user-experience/380213/beats-mobile-product-experience
- Motivazione: non disponibile.
- Realizzato da: Beats by Dre x OddCommon (entrant).
- Accesso: non aperto (500). Da riprovare dal ruolo visivo nel browser normale; se resta non aperto, il candidato va sostituito con una riserva dello stesso meccanismo (`piano.md` §5.3).
- Compiti: C11, C12.
- Prima ipotesi di cosa non prendere: non valutabile senza aprire il sito.

## 3. Non contati nei 20: indirizzo del prodotto non verificato, o non scelti

Quattro vincitori 2026 con «View the work» che non porta al prodotto: restano fuori dal conteggio e vanno letti dal coordinatore come riserve con riserva.

- **Affinity Studio Website** (Canva; `Best Visual Design - Function`, People's Voice Winner 2026). Scheda: `.../best-visual-design-function/373954/affinity-studio-website`. «View the work» = `https://public.canva.site/affinity-case-study` (200): è un caso di studio, non il sito del prodotto. Il prodotto Affinity non è indicato nella scheda. Discorso: «We Think Designers Deserve Better!».
- **LISA** (Locomotive; `Best Mobile Visual Design - Function`, Webby Winner 2026). Scheda: `.../mobile-features-design/best-mobile-visual-design-function/364215/lisa`. «View the work» = `https://locomotive.ca/en/contact` (200): è la pagina contatti dell'agenzia. Prodotto non indicato.
- **A More Intuitive OURA App** (Instrument; App Excellence: `Best User Interface` e `Best Visual Design - Function`, Webby Winner 2026; anche `Health, Wellness & Fitness`). Scheda: `.../app-excellence/best-user-interface/373483/a-more-intuitive-oura-app`. «View the work» = `https://bit.ly/OuraCaseStudy`, che risolve a `https://45103872.hs-sites.com/a-more-intuitive-oura-app` (200): caso di studio ospitato da un servizio di marketing. Prodotto non indicato.
- **Google Store** (BASIC/DEPT®; People's Voice Winner 2026 in `Best User Interface` e in `Best Mobile Visual Design - Function`; Nominee in `Best Mobile User Experience`). Scheda: `.../best-user-interface/378591/google-store`. «View the work» = pagina dell'agenzia `https://www.deptagency.com/awards/google-store-translating-hardware-into-human-terms/` (200 dopo redirect a `dept.global`). Non è il negozio del prodotto; l'indirizzo del negozio non è nella scheda.

Vincitori 2026 nelle categorie del Gruppo B, visti nelle pagine categoria ma **non aperti come scheda** (riserve, non valutate; dato di partenza: nome, categoria, premio, entrant dalla pagina categoria):
- `Best Practices` (Features & Design): Docusign (Webby Winner e People's Voice; BASIC/DEPT®); tutte le altre voci della categoria sono Nominee/Honoree.
- `Best Use of Video or Moving Image`: A Closer Look: The Boteti River, from sunrise to sunset (National Geographic; People's Voice Winner).
- `Best Mobile User Experience`: Wrapped Product Experience (Spotify; People's Voice Winner).
- `Best Mobile Visual Design - Aesthetic`: Dunes & Stars - Brand Experience (Ryze Agency UK; Webby Winner).
- `Mobile Innovation & Emerging Tech`: Keebler «Meet the Elves» (Amp Agency (PX); Webby Winner e People's Voice Winner).
- `Best User Experience` (App Excellence): BandLab: Music Creation Made Simple (BandLab; People's Voice Winner).
- `Best User Interface` (App Excellence): theCut Inc. (People's Voice Winner).
- `Best Visual Design - Function` (App Excellence): The Way Meditation App (People's Voice Winner; confermato anche dal comunicato stampa).
- `Best Visual Design - Aesthetic` (App Excellence): OPERATOR (FUN AND AWE; Webby Winner); Cosmos (People's Voice Winner).
- `Experimental & Innovation` (App Excellence): Luna: Storytime reimagined (TINY SPARKS FOUNDRY LTD; Webby Winner); Lilo & Stitch: Livestream Stitch (People's Voice Winner; credito nella pagina categoria: «Industrial | The Walt Disney Company - Studios…», troncato; scheda non aperta).
- `Best Practices` (App Excellence): 2026 Special Olympics USA Games Champions Mobile App (World Wide Technology; Webby Winner e People's Voice Winner).

## 4. Non trovati

- **Best Visual Design - Innovation** (nel catalogo `webbyawards.com/about/categories/` è marcata con * «Denotes new category»). L'URL di categoria `winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-innovation` reindirizza alla pagina del gruppo: nessuna categoria con questo nome nei vincitori 2026. Nessun risultato di ricerca web con questo nome (WebSearch: restituiti solo Aesthetic e Function). Non è nel piano §3.2: da segnalare al coordinatore, non da includere.
- **Motivazione ufficiale individuale**: non disponibile per nessuno dei 20 candidati e per nessuna delle schede aperte. Le schede riportano solo il criterio di categoria; per 9 schede c'è un discorso di accettazione, che non è una motivazione.
- **Categorie del piano §3.2 con nome diverso dal catalogo**: nessuna. Tutte quelle del piano esistono con il nome del piano (vedi §5); «Best Writing (Editorial)» è il nome esatto.
- **Best Visual Design - Aesthetic** e **Best Visual Design - Function** esistono anche in App Excellence e, per Aesthetic, nel Mobile: le voci sono in §5; non sono categorie senza candidati.

## 5. Categorie esatte trovate (nomi del catalogo e pagine di gruppo)

Fonte: `webbyawards.com/about/categories/` (elenco del sito, letto 12/11/2026) e pagine `winners.webbyawards.com/winners/<gruppo>/<sottogruppo>/<categoria>` renderizzate. «Pagina letta» = la pagina categoria 2026 è stata aperta con vincitori.

**Features & Design** (`websites-and-mobile-sites/features-design/`), dall'elenco del catalogo:
- Best Data Visualization (pagina letta; slug `best-data-visualization`)
- Best Digital Storytelling * (solo catalogo; nuova)
- Best Home Page (pagina letta)
- Best Individual Editorial Feature - Ind/Brand/Org (solo catalogo, slug visto nei link)
- Best Individual Editorial Feature - Media Company (solo catalogo)
- Best Navigation/Structure (pagina letta)
- Best Practices (pagina letta)
- Best Trend, Insights or Impact Report (pagina letta: `best-trend-insights-or-impact-report`; vincitore 2026: Pinterest Predicts 2026, Webby Winner e People's Voice Winner; non è nel piano §3.2)
- Best Use of AI (solo catalogo)
- Best Use of Animation or Motion Graphics (pagina letta)
- Best Use of Photography (solo catalogo)
- Best Use of Video or Moving Image (pagina letta)
- Best User Experience (pagina letta)
- Best User Interface (pagina letta)
- Best Visual Design - Aesthetic (pagina letta)
- Best Visual Design - Function (pagina letta)
- Best Visual Design - Innovation * (catalogo; nessun vincitore 2026, vedi §4)
- Best Writing (Editorial) (pagina letta)
- Technical Achievement (solo catalogo; nel piano è nel Gruppo A)

**Mobile Features & Design** (`websites-and-mobile-sites/mobile-features-design/`), pagine lette: Best Mobile User Experience; Best Mobile Visual Design - Function; Best Mobile Visual Design - Aesthetic; Best Responsive/Adaptive Design for Mobile (slug `best-responsiveadaptive-design-for-mobile`); Mobile Innovation & Emerging Tech.

**App Excellence** (`apps-software-immersive/app-excellence/`), pagine lette: Best User Experience; Best User Interface; Best Visual Design - Function; Best Visual Design - Aesthetic; Experimental & Innovation; Best Practices. Sono anche visibili nel gruppo: Accessibility & Inclusion (slug `accessibility-inclusion`, Gruppo A). Il gruppo ha altri sottogruppi (Immersive content, Immersive experiences): non letti come categorie B.

**Fuori dal Gruppo B ma visti nel catalogo e utili al coordinatore**: `Accessible Technology` (Responsible Technology, pagina letta, 2026: Signs, Webby Winner e People's Voice); `Best Use of AI` e `Best Use of Photography` (Features & Design, solo catalogo).

Esito per il piano §3.2: confermati con il nome del piano, nell'edizione 2026: Best Home Page; Best Navigation/Structure; Best User Experience (F&D e App Excellence); Best Mobile User Experience; Best User Interface (F&D e App Excellence); Best Writing (Editorial); Best Visual Design - Function (F&D, App, Mobile); Best Visual Design - Aesthetic (F&D, App, Mobile); Best Responsive/Adaptive Design for Mobile; Best Data Visualization; Best Use of Animation or Motion Graphics; Best Use of Video or Moving Image; Mobile Innovation & Emerging Tech; Experimental & Innovation (App Excellence); Best Practices (F&D e App). Non confermato: nessuno dei nomi del piano.

## 6. Conflitti, versioni e note

- Liste dei candidati: la sintesi del primo WebSearch segnalava versioni della pagina con nominee diversi (ShieldAI, TinyWins, Build in Amsterdam, misti al 2024). La pagina viva 2026 li riporta come Nominee 2026 (ShieldAI, TinyWins) o 2024 (Build in Amsterdam). Vale la pagina viva; il conflitto non cambia i 20.
- Registro della skill (`storico/edizioni/2026.json`): 33 categorie e 55 progetti per i tre gruppi. Non riconteggiato qui: non è un controllo di copertura completo del catalogo.
- Nome della categoria: il catalogo usa `Best Visual Design - Function` (trattino); articoli stampa usano `Best Visual Design – Function` (trattino lungo). Stessa categoria.
- Il link «View the work» non sempre porta al prodotto: in 4 casi (Affinity, LISA, OURA, Google Store) porta a un caso di studio o a una pagina agenzia (§3). Il piano §6.3 chiede l'indirizzo del prodotto: per questi 4 non c'è.
- Storia dei nomi (solo indicativa; non usata per la verifica 2026): nel 2009 (NIKEiD, `best-visual-design-function`) e nel 2022 (See Sound) esisteva `Best Visual Design - Function`; nel 2020 la tabella di Wikipedia elenca `Best Navigation/Structure`, `Best Writing (Editorial)`, `Best Visual Design - Aesthetic` e `Best Use Of Animation Or Motion Graphics`. Il gruppo App ha avuto percorsi diversi nel tempo (es. 2018 `apps-dapps-and-software/app-features`; 2025 `apps-software/app-features`). Un confronto storico richiede l'edizione, non il nome.
- Lady Gaga: 4 premi nella stessa scheda (2 in Music, fuori dal Gruppo B; 2 in B).
- Il comunicato stampa conferma `The Way Meditation App` (App Excellence, Best Visual Design – Function, People's Voice Award). Nessun altro nome del Gruppo B è stato confrontato con il comunicato: il comunicato non elenca le categorie B.

## 7. Lacune

- Nessuna visita visiva dei siti dei prodotti (compito del ruolo visivo). Le richieste HTTP dicono se il sito risponde, non come si usa.
- Beats: non aperto (500). Affinity, LISA, OURA, Google Store: indirizzo del prodotto non verificato (§3).
- Motivazione ufficiale individuale: assente per tutti (§4).
- Igloo Inc (1,4 KB), Netflix Ads (2,2 KB), The Spark (27 KB): risposta breve; probabile pagina con script. Il contenuto non è valutato da richiesta semplice.
- Il catalogo App Excellence: letti 6 sottogruppi, non l'elenco completo del gruppo.
- Browser interattivo normale (Chrome MCP): non esposto in questo host; il catalogo è stato letto con Chromium headless (dichiarato).
- Non letti i tre motori (Firefox, WebKit): non necessari per il tempo 1.

## 8. Inventario per URL (tutte le URL di risultato e le letture aperte)

Colonne: ID di lettura (cartella/numero in `design/incarichi/ricerca-b/estrazioni/`) · URL originale · URL finale dopo i redirect · stato HTTP · caratteri di testo renderizzato · titolo. Il testo di ogni lettura è in `NN.txt` della cartella indicata.

### 8.1 Catalogo, gruppi e pagine categoria

| ID | URL originale | URL finale | Stato | Caratteri | Titolo |
|---|---|---|---|---|---|
| gruppi/01 | https://www.webbyawards.com/categories/ | https://www.webbyawards.com/about/categories/ | 200 | 3229 | Categories / The Webby Awards  |
| gruppi/02 | https://winners.webbyawards.com/winners/websites-and-mobile-sites | https://winners.webbyawards.com/winners/websites-and-mobile-sites?years=0 | 200 | 8489 | Websites and Mobile Sites / 2026 Webby Awards Winners  |
| gruppi/03 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design | https://winners.webbyawards.com/winners | 200 | 3213 | Webby Gallery + Index / 2026 Webby Awards Winners  |
| gruppi/04 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design | https://winners.webbyawards.com/winners | 200 | 3213 | Webby Gallery + Index / 2026 Webby Awards Winners  |
| gruppi/05 | https://winners.webbyawards.com/winners/apps-software-immersive | https://winners.webbyawards.com/winners/apps-software-immersive?years=0 | 200 | 7627 | Apps, Software & Immersive / 2026 Webby Awards Winners  |
| cat-01/01 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-home-page | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-home-page?years=0 | 200 | 3629 | Features & Design — Best Home Page / 2026 Webby Awards Winners  |
| cat-01/02 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-navigationstructure | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-navigationstructure?years=0 | 200 | 3115 | Features & Design — Best Navigation/Structure / 2026 Webby Awards Winners  |
| cat-01/03 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-user-interface | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-user-interface?years=0 | 200 | 2924 | Features & Design — Best User Interface / 2026 Webby Awards Winners  |
| cat-01/04 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-user-experience | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-user-experience?years=0 | 200 | 3592 | Features & Design — Best User Experience / 2026 Webby Awards Winners  |
| cat-01/05 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-practices | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-practices?years=0 | 200 | 2899 | Features & Design — Best Practices / 2026 Webby Awards Winners  |
| cat-01/06 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-writing-editorial | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-writing-editorial?years=0 | 200 | 3548 | Features & Design — Best Writing (Editorial) / 2026 Webby Awards Winners  |
| cat-01/07 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-function | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-function?years=0 | 200 | 3666 | Features & Design — Best Visual Design - Function / 2026 Webby Awards Winners  |
| cat-01/08 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-aesthetic | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-aesthetic?years=0 | 200 | 3779 | Features & Design — Best Visual Design - Aesthetic / 2026 Webby Awards Winners  |
| cat-01/09 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-innovation | https://winners.webbyawards.com/winners/websites-and-mobile-sites?years=0 | 200 | 8175 | Websites and Mobile Sites / 2026 Webby Awards Winners  |
| cat-01/10 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-data-visualization | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-data-visualization?years=0 | 200 | 3469 | Features & Design — Best Data Visualization / 2026 Webby Awards Winners  |
| cat-01/11 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-use-of-animation-or-motion-graphics | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-use-of-animation-or-motion-graphics?years=0 | 200 | 3238 | Features & Design — Best Use of Animation or Motion Graphics / 2026 Webby Awards Winners  |
| cat-01/12 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-use-of-video-or-moving-image | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-use-of-video-or-moving-image?years=0 | 200 | 3130 | Features & Design — Best Use of Video or Moving Image / 2026 Webby Awards Winners  |
| cat-02/01 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/best-mobile-user-experience | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/best-mobile-user-experience?years=0 | 200 | 2103 | Mobile Features & Design — Best Mobile User Experience / 2026 Webby Awards Winners  |
| cat-02/02 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/best-mobile-visual-design-function | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/best-mobile-visual-design-function?years=0 | 200 | 1750 | Mobile Features & Design — Best Mobile Visual Design - Function / 2026 Webby Awards Winner  |
| cat-02/03 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/best-mobile-visual-design-aesthetic | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/best-mobile-visual-design-aesthetic?years=0 | 200 | 1826 | Mobile Features & Design — Best Mobile Visual Design - Aesthetic / 2026 Webby Awards Winne  |
| cat-02/04 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/best-responsiveadaptive-design-for-mobile | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/best-responsiveadaptive-design-for-mobile?years=0 | 200 | 1809 | Mobile Features & Design — Best Responsive/Adaptive Design for Mobile / 2026 Webby Awards   |
| cat-02/05 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/mobile-innovation-emerging-tech | https://winners.webbyawards.com/winners/websites-and-mobile-sites/mobile-features-design/mobile-innovation-emerging-tech?years=0 | 200 | 1772 | Mobile Features & Design — Mobile Innovation & Emerging Tech / 2026 Webby Awards Winners  |
| cat-02/06 | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-user-experience | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-user-experience?years=0 | 200 | 1673 | App Excellence — Best User Experience / 2026 Webby Awards Winners  |
| cat-02/07 | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-user-interface | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-user-interface?years=0 | 200 | 1724 | App Excellence — Best User Interface / 2026 Webby Awards Winners  |
| cat-02/08 | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-visual-design-function | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-visual-design-function?years=0 | 200 | 1708 | App Excellence — Best Visual Design - Function / 2026 Webby Awards Winners  |
| cat-02/09 | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-visual-design-aesthetic | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-visual-design-aesthetic?years=0 | 200 | 1737 | App Excellence — Best Visual Design - Aesthetic / 2026 Webby Awards Winners  |
| cat-02/10 | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/experimental-innovation | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/experimental-innovation?years=0 | 200 | 1754 | App Excellence — Experimental & Innovation / 2026 Webby Awards Winners  |
| cat-02/11 | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-practices | https://winners.webbyawards.com/winners/apps-software-immersive/app-excellence/best-practices?years=0 | 200 | 1675 | App Excellence — Best Practices / 2026 Webby Awards Winners  |

Nota: `cat-01/09` (la categoria Best Visual Design - Innovation) è reindirizzata alla pagina del gruppo: nessun vincitore di quella categoria. Le voci della pagina gruppo non sono attribuite alla categoria. `gruppi-01/03` e `gruppi-01/04` (Features & Design e Mobile Features & Design come pagine di gruppo) reindirizzano a `/winners`: non sono pagine di gruppo valide.

### 8.2 Schede dei candidati (tempo 1, con ancore e link)

| ID | URL originale | URL finale | Stato | Caratteri | Titolo |
|---|---|---|---|---|---|
| sch-01/01 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-navigationstructure/363523/ottografie | = originale | 200 | 1336 | Ottografie / Webby Winner / 2026 The Webby Awards  |
| sch-01/02 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-navigationstructure/378594/netflix-ads | = originale | 200 | 1694 | Netflix Ads / People's Voice Winner, Honoree / 2026 The Webby Awards  |
| sch-01/03 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-home-page/372642/the-renaissance-edition | = originale | 200 | 1078 | The Renaissance Edition / 2 Wins / 2026 The Webby Awards  |
| sch-01/04 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-home-page/363546/jesko-jets | = originale | 200 | 1381 | Jesko Jets / People's Voice Winner / 2026 The Webby Awards  |
| sch-01/05 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-user-interface/363972/dich-fashion | = originale | 200 | 1195 | DICH™ Fashion / Webby Winner / 2026 The Webby Awards  |
| sch-01/06 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-user-experience/363516/pentagram-archive | = originale | 200 | 829 | Pentagram Archive / Webby Winner / 2026 The Webby Awards  |
| sch-01/07 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-user-experience/381848/the-wildlife-society | = originale | 200 | 869 | The Wildlife Society / People's Voice Winner / 2026 The Webby Awards  |
| sch-01/08 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-writing-editorial/362789/lonely-planets-guide-to-overtourism-in-venice | = originale | 200 | 1164 | Lonely Planet’s guide to overtourism in Venice / People's Voice Winner / 2026 The Webby Aw  |
| sch-01/09 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-writing-editorial/368481/chronically-online-magazine-by-manychat | = originale | 200 | 1266 | Chronically Online Magazine by Manychat / Webby Winner / 2026 The Webby Awards  |
| sch-01/10 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-function/383443/followart | = originale | 200 | 997 | FOLLOW.ART / Webby Winner / 2026 The Webby Awards  |
| sch-02/01 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-function/373954/affinity-studio-website | = originale | 200 | 1646 | Affinity Studio Website / People's Voice Winner / 2026 The Webby Awards  |
| sch-02/02 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-aesthetic/361001/igloo-inc | = originale | 200 | 1180 | Igloo Inc / Webby Winner, Nominee / 2026 The Webby Awards  |
| sch-02/03 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-data-visualization/364937/wwf--blue-corridors | = originale | 200 | 1176 | WWF - Blue Corridors / Webby Winner / 2026 The Webby Awards  |
| sch-02/04 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-data-visualization/384216/searching-for-birds | = originale | 200 | 1178 | Searching for Birds / People's Voice Winner / 2026 The Webby Awards  |
| sch-02/05 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-use-of-animation-or-motion-graphics/364444/aether-1 | = originale | 200 | 1087 | Aether 1 / Webby Winner, Honoree / 2026 The Webby Awards  |
| sch-02/06 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-use-of-video-or-moving-image/374085/iphone-17-pro--17-pro-max-product-site | = originale | 200 | 940 | iPhone 17 Pro / 17 Pro Max Product Site / Webby Winner / 2026 The Webby Awards  |
| sch-02/07 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/mobile-features-design/best-mobile-visual-design-aesthetic/374444/lady-gaga--a-digital-home-for-a-pop-icon | = originale | 200 | 1531 | Lady Gaga - A Digital Home for a Pop Icon / 4 Wins / 2026 The Webby Awards  |
| sch-02/08 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/mobile-features-design/best-responsiveadaptive-design-for-mobile/364964/pixis--digital-brand-experience | = originale | 200 | 805 | Pixis - Digital Brand Experience / Webby Winner / 2026 The Webby Awards  |
| sch-02/09 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/mobile-features-design/best-mobile-visual-design-function/364215/lisa | = originale | 200 | 832 | LISA / Webby Winner / 2026 The Webby Awards  |
| sch-02/10 | https://winners.webbyawards.com/2026/apps-software-immersive/app-excellence/best-user-interface/373483/a-more-intuitive-oura-app | = originale | 200 | 3011 | A More Intuitive OURA App / 3 Wins / 2026 The Webby Awards  |
| sch-03/01 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-user-interface/378591/google-store | = originale | 200 | 1415 | Google Store / 2 Wins, Nominee / 2026 The Webby Awards  |
| sch-03/02 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/mobile-features-design/best-mobile-user-experience/380213/beats-mobile-product-experience | = originale | 200 | 795 | Beats: Mobile Product Experience / Webby Winner / 2026 The Webby Awards  |
| sch-03/03 | https://winners.webbyawards.com/2026/apps-software-immersive/app-excellence/best-user-experience/362076/chase-mobile-app | = originale | 200 | 756 | Chase Mobile® App / Webby Winner / 2026 The Webby Awards  |
| sch-04/01 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-use-of-animation-or-motion-graphics/374106/the-spark | = originale | 200 | 1577 | The Spark / People's Voice Winner, Honoree / 2026 The Webby Awards  |

Le letture `schede-01/` e `schede-02/` (senza ancore) sono la stessa pagina dei primi 10 e degli undici successivi: duplicati, usati solo come controllo.

### 8.3 Risultati di ricerca web (ogni URL aperta; i duplicati sono indicati in 8.5)

| ID | URL originale | URL finale | Stato | Caratteri | Titolo |
|---|---|---|---|---|---|
| ric-01/01 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-navigationstructure | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-navigationstructure?years=0 | 200 | 3429 | Features & Design — Best Navigation/Structure / 2026 Webby Awards Winners  |
| ric-01/02 | https://www.deptagency.com/en-in/?p=4428479 | https://www.dept.global/en-in/insight/dept-is-the-webby-agency-network-of-the-year/ | 200 | 5668 | DEPT® is the Webby Agency & Network of the Year - DEPT®  |
| ric-01/03 | https://www.deptagency.com/?p=4428271 | https://www.dept.global/insight/dept-is-the-webby-agency-network-of-the-year/ | 200 | 5670 | DEPT® is the Webby Agency & Network of the Year - DEPT®  |
| ric-01/04 | https://www.deptagency.com/?p=4426934 | https://www.dept.global/insight/dept-brings-growth-invention-to-the-webby-shortlists/ | 200 | 3953 | DEPT® brings growth invention to the Webby shortlists - DEPT®  |
| ric-01/05 | https://winners.webbyawards.com/winners/websites-and-mobile-sites?years=2 | = originale | 200 | 7755 | Websites and Mobile Sites / 2024 Webby Awards Winners  |
| ric-01/06 | https://winners.webbyawards.com/winners/websites-and-mobile-sites?years=27 | = originale | 200 | 7939 | Websites and Mobile Sites / 1999 Webby Awards Winners  |
| ric-01/07 | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-trend-insights-or-impact-report | https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-trend-insights-or-impact-report?years=0 | 200 | 2716 | Features & Design — Best Trend, Insights or Impact Report / 2026 Webby Awards Winners  |
| ric-02/01 | https://www.deptagency.com/en-in/search/webby%20award/ | https://www.dept.global/en-in/search/webby%20award/ | 200 | 48538 | You searched for webby award - DEPT®  |
| ric-02/02 | https://www.codeandtheory.com/news/webby-awards-finalist-nominees | = originale | 200 | 6847 | Webby Awards 2026 Wins - Code and Theory / Celebrate Our 18 Nominations  |
| ric-02/03 | https://www.webbyawards.com/press/press-releases/30th-annual-webby-awards-announce-2026-winners/ | = originale | 200 | 15742 | 30TH ANNUAL WEBBY AWARDS ANNOUNCE 2026 WINNERS / The Webby Awards  |
| ric-02/04 | https://www.hollywoodreporter.com/business/digital/2026-webby-awards-winners-list-1236570024/ | = originale | 200 | 14514 | 2026 Webby Awards Winners: List  |
| ric-02/05 | https://gamesbeat.com/?p=321118 | https://gamesbeat.com/webby-awards-announce-2026-gaming-category-winners-exclusive/ | 200 | 7798 | Webby Awards announce 2026 gaming category winners / exclusive - GamesBeat  |
| ric-02/06 | https://www.hollywoodreporter.com/business/digital/2026-webby-awards-nominees-list-1236551621/ | = originale | 200 | 33510 | 2026 Webby Awards: List of Nominees  |
| ric-02/07 | https://www.thewrap.com/?p=8004175 | https://www.thewrap.com/culture-lifestyle/culture/2026-webbys-winners-list-media-companies/ | 200 | 9835 | 2026 Webbys Winners List: Google, iHeartMedia and PBS Win Big  |
| ric-03/01 | https://www.whiteboard.is/articles/whiteboard-nominated-for-best-visual-design-aesthetic-websites-and-mobile-sites-in-the-26th-annual-webby-awards | = originale | 200 | 5597 | Whiteboard / Whiteboard Nominated For Best Visual Design in Annual Webbys  |
| ric-03/02 | https://winners.webbyawards.com/2009/websites-and-mobile-sites/features-design/best-visual-design-function/152382/nikeid | = originale | 200 | 1223 | NIKEiD / Webby Winner, Nominee / 2009 The Webby Awards  |
| ric-03/03 | https://winners.webbyawards.com/2018/apps-dapps-and-software/app-features/best-visual-design-function/46140/invisible-world | = originale | 200 | 1133 | Invisible World / Webby Winner / 2018 The Webby Awards  |
| ric-03/04 | https://en.wikipedia.org/wiki/2020_Webby_Award | https://en.wikipedia.org/wiki/2020_Webby_Awards | 200 | 34883 | 2020 Webby Awards - Wikipedia  |
| ric-03/05 | https://winners.webbyawards.com/2021/websites-and-mobile-sites/general-websites-and-mobile-sites/corporate-social-responsibility/179244/crafted | = originale | 200 | 1475 | Crafted™ / Webby Winner, 2 Nominations / 2021 The Webby Awards  |
| ric-03/06 | https://winners.webbyawards.com/2022/websites-and-mobile-sites/features-design/best-visual-design-function/208980/see-sound | = originale | 200 | 1025 | See Sound / Webby Winner / 2022 The Webby Awards  |
| ric-03/07 | https://winners.webbyawards.com/2025/websites-and-mobile-sites/features-design/best-visual-design-function/324140/bzier | = originale | 200 | 910 | Bézier / Webby Winner / 2025 The Webby Awards  |
| ric-04/01 | https://winners.webbyawards.com/2025/apps-software/app-features/best-visual-design-aesthetic/324754/spireworks | = originale | 200 | 1168 | Spireworks / Honoree / 2025 The Webby Awards  |
| ric-04/02 | https://www.deptagency.com/?p=4287159 | https://www.dept.global/insight/creativity-impact-dominate-depts-20-webby-award-nominations/ | 200 | 3534 | Creativity & impact dominate DEPT®’s 20 Webby Award nominations - DEPT®  |
| ric-04/03 | https://videinfra.com/blog/we-won-a-webby-the-oscars-of-web-design | = originale | 200 | 3902 | Vide Infra Won a Webby for Best Visual Design — Function / Vide Infra  |
| ric-04/04 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-function/362439/clay | = originale | 200 | 1156 | Clay / 2 Nominations / 2026 The Webby Awards  |
| ric-04/05 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-aesthetic/374710/air | = originale | 200 | 992 | Air / Honoree / 2026 The Webby Awards  |
| ric-04/06 | https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-aesthetic/365395/seamless-studio | = originale | 200 | 1080 | Seamless Studio / Honoree / 2026 The Webby Awards  |
| ric-04/07 | https://clay.global/blog/webby-2025 | = originale | 200 | 4626 | Clay’s Proud Moments at The Webby Awards 2025 / Clay  |
| ric-05/01 | https://en.wikipedia.com/wiki/2020_Webby_Award | https://en.wikipedia.org/wiki/2020_Webby_Awards | 200 | 34883 | 2020 Webby Awards - Wikipedia  |

Mappa delle schede: `schede-01-ancore/01` Ottografie · `02` Netflix Ads · `03` The Renaissance Edition · `04` Jesko Jets · `05` DICH™ Fashion · `06` Pentagram Archive · `07` The Wildlife Society · `08` Lonely Planet · `09` Chronically Online · `10` FOLLOW.ART. `schede-02-ancore/01` Affinity Studio (non contato) · `02` Igloo Inc · `03` WWF Blue Corridors · `04` Searching for Birds · `05` Aether 1 · `06` iPhone 17 Pro · `07` Lady Gaga · `08` Pixis · `09` LISA (non contato) · `10` OURA (non contato). `schede-03-ancore/01` Google Store (non contato) · `02` Beats (non aperto) · `03` Chase Mobile App. `schede-04-ancore/01` The Spark. Le altre schede letta in `estrazioni/schede-01/` e `schede-02/` (senza ancore) sono duplicati.

### 8.4 Richieste HTTP semplici ai prodotti (curl, seguito dei redirect, 12/11/2026)

File: `design/incarichi/ricerca-b/prove-http/run-01/esito.txt` (ID 01-20) e `esito-2.txt` (ID 21-24). Le richieste non sono visite. Nessun segnale anti-bot nei primi 4 KB di risposta, salvo nota.

| ID | Prodotto | URL di partenza | Esito | URL finale | Note |
|---|---|---|---|---|---|
| 01 | Ottografie | https://www.ottografie.nl/ | 200 | = | 281 KB |
| 02 | Netflix Ads | https://advertising.netflix.com/en-us | 200 | = | 2,2 KB (risposta breve) |
| 03 | The Renaissance Edition | https://www.shopify.com/editions/winter2026 | 200 | = | 1,45 MB |
| 04 | Jesko Jets | https://jeskojets.com/ | 200 | = | 128 KB |
| 05 | DICH Fashion | https://dich-fashion.webflow.io/ | 200 | = | 216 KB |
| 06 | Pentagram Archive | https://www.pentagram.com/archive | 200 | = | 147 KB |
| 07 | The Wildlife Society | http://wildlife.org/ | 200 | https://wildlife.org/ | 1 redirect (http→https) |
| 08 | Lonely Planet | https://www.lonelyplanet.com/articles/venice-overtourism | 200 | = | 1,9 MB |
| 09 | Chronically Online | https://com.manychat.com/ | 200 | = | 224 KB |
| 10 | FOLLOW.ART | https://follow.art/ | 200 | = | 301 KB |
| 11 | Affinity (caso di studio, non contato) | https://public.canva.site/affinity-case-study | 200 | = | 190 KB |
| 12 | Igloo Inc | https://www.igloo.inc/ | 200 | = | 1,4 KB (shell) |
| 13 | WWF Blue Corridors | https://bluecorridors.org/explore/species#tracks | 200 | = (fragment ignorato) | 3,8 MB |
| 14 | Searching for Birds | https://searchingforbirds.visualcinnamon.com/ | 200 | = | 88 KB |
| 15 | Aether 1 | https://www.aether1.ai/ | 200 | = | 247 KB |
| 16 | iPhone 17 Pro | https://www.apple.com/iphone-17-pro/ | 200 | https://www.apple.com/iphone/ | 1 redirect, 417 KB |
| 17 | Lady Gaga | http://www.ladygaga.com/ | 200 | https://www.ladygaga.com/us-en | 2 redirect, 222 KB |
| 18 | Pixis | https://pixis.ai/ | 200 | = | 216 KB |
| 19 | LISA (contatti agenzia, non contato) | https://locomotive.ca/en/contact | 200 | = | 136 KB |
| 20 | OURA (caso di studio, non contato) | https://bit.ly/OuraCaseStudy | 200 | https://45103872.hs-sites.com/a-more-intuitive-oura-app | 1 redirect, 113 KB |
| 21 | Beats (non aperto) | https://www.beats-experience.com/ | **500** (anche al 2° tentativo) | = | 4,8 KB, pagina di errore Next.js |
| 22 | Chase Mobile App | https://www.chase.com/digital/mobile-banking | 200 | = | 370 KB |
| 23 | The Spark | https://spark.thedigitalpanda.com/ | 200 | = | 27 KB (risposta breve) |
| 24 | Google Store (pagina agenzia, non contato) | https://www.deptagency.com/awards/google-store-translating-hardware-into-human-terms/ | 200 | https://www.dept.global/awards/google-store-translating-hardware-into-human-terms/ | 1 redirect, 50 KB |

Nota: ID 21-24 sono i prodotti aggiunti dopo la prima lista (Beats, Chase, The Spark, Google Store) e i tre sostituti non contati.

### 8.5 Duplicati e merge

- `best-navigationstructure?years=0` (risultato di WebSearch 1) e `best-navigationstructure` (risultato 4): stessa pagina; il secondo è letto come `cat-01/02` e `ric-01/01`; il primo risolve in `?years=0`, già letto come `cat-01/02`.
- `websites-and-mobile-sites` (risultato 6) = `gruppi/02`. `best-practices` (risultato 9) = `cat-01/05`. `best-user-interface` (risultato 18) = `cat-01/03`. `best-trend-insights-or-impact-report` (risultato 17) = `ric-01/07`.
- `deptagency.com/en-in/search/webby%20award/` (risultato 10 di WebSearch 1; ripetuto in WebSearch 2) = `ric-02/01` (risolto in `dept.global/en-in/search/webby%20award/`).
- `deptagency.com/?p=4287159` (WebSearch 2) = `ric-04/02` (risolto in `dept.global/insight/creativity-impact-dominate-depts-20-webby-award-nominations/`).
- `en.wikipedia.com/wiki/2020_Webby_Award` (WebSearch 2) = `ric-05/01` (risolto in `en.wikipedia.org/wiki/2020_Webby_Awards`).
- `winners.webbyawards.com/2026/.../clay`, `/air`, `/seamless-studio` (WebSearch 2) = `ric-04/04`, `ric-04/05`, `ric-04/06`.

### 8.6 Risultati di WebSearch (2 query, 12/11/2026)

- Query 1: «Webby Awards 2026 winners Best Navigation Structure Features & Design»: 18 URL restituiti. Tutti aperti, come sopra in 8.1-8.5 (le corrispondenze sono in 8.5).
- Query 2: «Webby Awards "Best Visual Design - Innovation" category»: 15 URL restituiti. Tutti aperti (ric-03, ric-04, ric-05 e i duplicati di 8.5). Il riassunto della query dichiarava: «I didn't find any result naming a Webby category exactly "Best Visual Design - Innovation."»: confermato dalle letture.
- Il riassunto di WebSearch è stato usato solo come indice; i dati sono quelli delle pagine aperte.
