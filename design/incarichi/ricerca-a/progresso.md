# Progresso: ricerca A (fonti, Gruppo A) (research)

Worker: vibe-next:research (raccolta fonti, nessun agente annidato). Incarico: `design/incarichi/ricerca-a.md`.
Regole: `design/incarichi/comune.md`. Output: `design/ricerca/fonti-a.md`.

## Stato

| Unità | Stato | Note |
|---|---|---|
| U0. Lettura di comune.md, ricerca-a.md, piano §1, §3.1, §5, §6.1, §6.3, §9-§10; progetto §0-§2; riferimenti.md §2-§3 | fatta | output da `ricerca/fonti-a.md` (il piano §10 dice `fonti/A.md`: seguo l'incarico) |
| U1. Caricamento WebSearch e WebFetch (ToolSearch) | fatta | nessun browser interattivo elencato nel mio host: Chrome MCP non presente |
| U2. Ricerche Gruppo A (query §6.1, IT e EN, senza nomi di progetto nelle query) | da fare | |
| U3. Apertura di ogni URL di risultato (WebFetch, registro per URL) | da fare | |
| U4. Verifica catalogo ufficiale (categorie, edizione, Webby Winner / People's Voice, motivazione) | da fare | |
| U5. Controllo HTTP semplice dei prodotti (codice, verifica anti-bot) | da fare | |
| U6. Scrittura `ricerca/fonti-a.md` | da fare | |

## Ultimo comando
nessuno ancora (solo lettura e creazione di questa cartella).

## Prossimo passo
Ricerche §6.1 query 1-5, poi apertura dei risultati.

## Problemi aperti
- Il WebFetch sul catalogo Webby è stato bloccato in un turno precedente da un hook del plugin
  («delega la ricerca a vibe-next:research»), come riportato nel progresso del progetto. Da riprovare: se ancora bloccato, registro come lacuna.
- Privacy: nelle query e negli User-Agent non compaiono nome del progetto, nome dell'utente o altri dettagli.

## Aggiornamento (dopo ricerche Q1-Q5 e prime aperture)
- Ricerche: 5 WebSearch eseguite (Accessibilità EN/IT, TTS/voce EN, AI EN, salute EN). Inventario: `inventario-url.tsv` (62 URL di risultato).
- Aperti con WebFetch: pagine ufficiali winners.webbyawards.com (Apps/Accessibility & Inclusion, Accessible Technology, Health & Wellness, Best Use of AI, DEI, Corporate Communications, Charitable, Joel Bervell, Flourish), catalogo AI, comunicato ufficiale 30ª edizione, deptagency (redirect a dept.global, seguito), schede di progetto Signs, Bedtime Donations, Touch: Beyond Vision.
- Edizioni: `years=27` = 1999 e `years=2` = 2024 (non 2026: escluse dall'elenco 2026).
- Prodotti (HTTP semplice, curl, nessun display): signs-ai.com 200; touch-beyond-vision.com 200 (è un'esposizione fisica, non un software); bedtime-donations.com/casefilm.html 200 (pagina di campagna, non prodotto).
- Conflitto da preservare: Signs compare come «Webby Winner» in Accessibility & Inclusion (Apps) e come «Webby Winner + People's Voice» in Accessible Technology (Websites). Entrambe le pagine ufficiali sono lette.
- Ancora da aprire: U06, U10-U15, U17-U22, U24, U25, U27, U29-U31, U34, U35, U37-U39, U41-U49, U50-U51, U53-U62 (vedi inventario).
- Ultimo comando: WebFetch su U17 non ancora; ultimo blocco di letture: Joel Bervell, Flourish, Bedtime, Touch.

## Stato finale (12/11/2026)

| Unità | Stato | Note |
|---|---|---|
| U0-U1. Letture e caricamento strumenti | fatta | |
| U2. Ricerche Q1-Q5 + Kettle | fatta | 6 WebSearch; URL di risultato in `inventario-url.tsv` (62) |
| U3. Apertura dei risultati | fatta con lacune | 62 URL di risultato + 52 URL aperti per il brief: esito per URL in `inventario-esiti.tsv` |
| U4. Verifica categorie e vittorie (catalogo ufficiale) | fatta | edizione 2026 (30ª); 1999 e 2024 scartate |
| U5. Prodotti: richiesta HTTP semplice + lettura | fatta con lacune | vedi gap in `fonti-a.json` (lacune_accesso) |
| U6. Scrittura risultati | fatta come JSON | `fonti-a.json` (18 candidati, non trovati, categorie esatte, conflitti, lacune, copertura) |

## Decisione sul formato
L'incarico chiede `design/ricerca/fonti-a.md`. La regola del worker vieta di scrivere report in .md: il contenuto e in
`design/incarichi/ricerca-a/fonti-a.json` (stesso contenuto, strutturato). Il coordinatore decide se convertirlo.

## File prodotti (cartella dell'incarico)
- `inventario-url.tsv`: 62 URL di risultato di WebSearch, con query di origine.
- `inventario-esiti.tsv`: 114 righe (62 di ricerca + 52 extra aperti per il brief), con esito di accesso e dati estratti.
- `fonti-a.json`: candidati (18), esclusi, categorie esatte, conflitti, lacune, copertura query.
- `progresso.md`: questo file.

## Conflitti aperti (da riportare)
1. Kettle come vincitore di Best Use of AI Voice & Conversational Interface (Code and Theory, non letto: 429) contro la scheda ufficiale (T-Mobile's AI Assistant = People's Voice; ElevenAgents = Webby Winner).
2. Signs: Webby Winner in Accessibility & Inclusion (Apps) e Webby + People's Voice in Accessible Technology (Websites): due categorie, non un conflitto.

## Lacune principali
- Prodotto non verificato: My First Voice (solo video YouTube), T-Mobile's AI Assistant (t-mobile.com 403), Bedtime Donations (pagina di campagna).
- Letture non riuscite: Maui Food Bank (contenuto vuoto), Esther Perel podcast (rifiutato), Beeble (solo titolo), Instagram di Joel Bervell (solo titolo).
- Bloccati: Code and Theory (429), pulse.bot (non raggiungibile), BusinessWire (403), AppleInsider (403), Hollywood Reporter (gateway 402, non aggirato).
- Non coperto: catalogo generale (webbyawards.com/winners) come indice unico; ricerca mirata su installazione guidata (C4) e su sottotitoli o trascrizioni: lacune per Gruppo A.

## Prossimo passo (coordinatore)
Deduplicare con Gruppo B (in particolare Signs, Touch, Flourish, The Way, Waymo, Suno), verificare i conflitti 1 e 2, e decidere la riserva fra F15 e F17.
