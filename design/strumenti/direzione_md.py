# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Vista leggibile di direzione.json: ambizione, alternative confrontate, direzione scelta, regole, decisioni, esito del controllo."""
import subprocess, datetime, collections

S = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.45.0/skills/design-system-generator'

ALTERNATIVE = '''
Le evidenze ammettono tre strutture sostanzialmente diverse per gli stessi contenuti (P1-P6 di `progetto.md`: capire, ascoltare, stato onesto,
installare, usare in riunione, aiuto, «non ancora»). Sono confrontate sugli stessi criteri, non solo sulla palette.

| Criterio (da persona e compito) | A. Una pagina narrata | B. Cammino a pagine per compito | C. Porte per persona |
|---|---|---|---|
| Che cosa è | Un solo scorrimento: proposta, ascolto, stato, installazione, aiuto in sezioni | Pagina iniziale e cinque pagine con indirizzo proprio (Ascolta, Stato e limiti, Installa, In riunione, Aiuto), più Non ancora; stepper e «Avanti» | Home con quattro porte («Scrivo per parlare», «Leggo per un altro», «Controllo», «Installo»), ciascuna con il suo percorso |
| Riscontro nel campione | R22 e R21 reggono una lettura lunga; R53 (home di 11.800-15.000 px, 104 comandi) e R02 mostrano il costo | R51, R52, R50: prodotto con pagine per compito e documentazione a parte; R20 per «dove sono, cosa viene dopo» | R06 ha una sola porta per ruolo (facilitatori); R20 e R21 porte per argomento; nessuno instrada per persona |
| Carico di lettura (afasia, lettura lenta: RG8) | Alto: tutto in una pagina | Basso: un compito per pagina, «Avanti» in fondo | Medio: due livelli prima del contenuto |
| Inoltro da telefono (P3) | Ancore dentro una pagina lunga | Un indirizzo per compito, da incollare in un messaggio | Un indirizzo per porta: rischio di inoltrare la porta sbagliata |
| Aiuto da segnalibro (P5) | In fondo a una pagina lunga | Pagina Aiuto con indirizzo proprio (come l\'Hub di R52) | Ripetuto in ogni porta |
| Tastiera e interruttore (RG9) | Molti Tab per le sezioni profonde (R50: 14 Tab fino al comando) | Cinque voci e salta-al-contenuto | Un livello in più prima del compito |
| Stato prima della promessa (RG4) | Nell\'apertura | Nell\'apertura e in una riga in ogni pagina | Da ripetere in ogni porta |
| «Non è per te» al primo incontro (RG16 proposta) | Sezione in fondo | Collegamento nell\'apertura e pagina propria | Una porta in più («Non uso Linux») |
| Etichettare chi legge (RG13) | No | No | Sì: dice alla persona «chi è» |
| Costo di costruzione e prova | Una pagina molto lunga da provare a ogni misura | Otto pagine piccole, componenti riusati | Come B più i percorsi per porta |

**Scelta: B**, con due prestiti. Da C resta solo un elenco di quattro collegamenti con parole della persona nella home («Chi sei?»), che portano a sezioni della pagina
Stato e limiti senza etichettare nessuno. Da A resta l\'idea che la home racconti l\'essenziale in un solo schermo: proposta, stato e ascolto.
Motivo: B è la sola che dà a ogni compito un indirizzo da inoltrare e da tenere nei segnalibri (F2 legge dal telefono e inoltra; F1 torna all\'aiuto in
mezzo a una riunione), riduce il carico di lettura per chi ha difficoltà e tiene la navigazione a cinque voci raggiungibili con pochi Tab. A e C
non sono errate: A costa a chi legge con lentezza e a chi usa un interruttore; C etichetta le persone e duplica stato e aiuto.
'''

DIREZIONE = '''
**Nome di lavoro: «Carta e voce».** Una carta calda e un inchiostro verde scurissimo (14,4:1), il verde acqua dell\'icona come tinta di comandi e barre, riquadri a bolla,
cinque barre a capsula come unico motivo. Ciò che la persona digita è in carattere a spaziatura fissa (come il campo della finestra); ciò che la voce dice è nel
carattere del corpo. L\'unico movimento espressivo è quello delle barre che seguono la voce quando la persona preme «Ascolta»; tutto il resto è fermo o cambia stato in
meno di 240 ms. Il carattere non è ospitato: si usa quello di sistema (nessuna richiesta, nessun peso).

Che cosa si noterebbe coprendo nome e logo: un cartellino a tre colonne («Provato», «Non ancora provato», «Non esiste») nel primo schermo; una frase digitata con le
cifre evidenziate e la stessa frase detta a parole; una pagina d\'aiuto fatta delle frasi vere della finestra. Nessun hero con immagine di sfondo, nessun gradiente
viola, nessuna foto di stock, nessun contatore.
'''

NON_VERIFICATO = '''
- **Qualità visiva**: la rivede il ruolo visivo con le foto del percorso (`design/prove-percorso/`); questo controllo verifica il metodo, non l\'aspetto.
- **Dispositivi e motori**: il percorso è provato solo in Chromium, 1440×900 e 390×844; la matrice di 15 dispositivi per tre motori parte dopo l\'approvazione.
- **Ausili veri** (puntamento oculare, interruttore, lettore di schermo): non disponibili; si usa l\'albero di accessibilità come proxy e la tastiera.
- **R50-R53**: osservazioni controllate e confrontate; le schede e gli inventari del movimento erano in scrittura da parte del visitatore alla generazione di questa vista.
- **Righe «effetto o animazione» di R04, R05 e R06** aggiunte dal worker di costruzione dagli inventari del movimento, con solo il trigger letto (vedi `copertura.md`, «Integrazioni»).
'''

def sito(f):
    return f['riferimento']

def scrivi(d):
    run = subprocess.run(['node', S + '/scripts/controlla-direzione.mjs', '/workspace/kalliope/design/direzione.json', '--confronto', '/workspace/kalliope/design/confronto.json'],
                         capture_output=True, text=True)
    L = []
    w = L.append
    w('# Direzione di Kalliope: ambizione, alternative, regole e decisioni\n')
    w(f'Generata il {datetime.date.today().strftime("%d/%m/%Y")} da `design/direzione.json` con `design/strumenti/costruisci-direzione.py` (dati in `direzione_dati.py`; le fonti di ogni decisione '
      'sono righe di `design/confronto.json`, lette dal confronto e non ricopiate). Controllo: `controlla-direzione.mjs design/direzione.json --confronto design/confronto.json` (§9).\n')
    w('Stato: **direzione proposta, non ancora approvata**. Il cancello di `references/direzione.md` §5 richiede il percorso vero in `site/`, la revisione visiva e la mostra al proprietario.\n')
    w('## 1. Criterio di ambizione\n')
    w('Che cosa il sito di Kalliope fa o mostra che nessuno dei 13 riferimenti né dei concorrenti (R50 Text-to-Mic, R51 Proloquo, R52 Grid, R53 Voiceitt) mostra. Le assenze citate sono righe del confronto con le prove dei visitatori.\n')
    for a in d['ambizione']:
        w(f"### {a['id']}\n")
        w(f"- **Che cosa:** {a['cosa']}")
        w(f"- **Per chi:** {'; '.join(a['persone'])}")
        w(f"- **Dove:** {a['dove']}")
        w(f"- **Come si riconosce:** {a['come_si_riconosce']}")
        w(f"- **Destinazioni:** {'; '.join(a['destinazioni'])}\n")
    w('## 2. Alternative confrontate sugli stessi contenuti\n')
    w(ALTERNATIVE.strip() + '\n')
    w('## 3. Direzione scelta\n')
    w(DIREZIONE.strip() + '\n')
    w('### Revisione dopo la revisione visiva (12/11/2026, sera)\n')
    w('La revisione indipendente (`design/revisione-visiva.md`) ha giudicato la riconoscibilità media: il momento più di Kalliope, la coppia «Tu scrivi / Kalliope dice», stava a y≈1100 sul computer, mentre il primo schermo era dominato da una foto della finestra per due terzi vuota. '
      'Cambia una decisione, non l\'ambizione: **A1 passa nel primo schermo** (pagina iniziale, computer e telefono, con il comando «Ascolta Giulia» intero senza scorrere); la foto scende e si rimpicciolisce (D01, D02, D03, D32, D33). '
      'La riga di stato sale sotto il titolo e al telefono viene prima di «Scarica e installa» (A2, B2 della revisione). Il percorso diventa una riga «Passo N di 5» (D06) e la scelta della distribuzione diventa una scelta vera con JavaScript (D40). A2-A5 restano come scritte.\n')
    w('## 4. Criteri\n')
    for k in d['criteri']:
        w(f"- **{k['id']}** {k['testo']}")
    w('\n## 5. Regole\n')
    for r in d['regole']:
        w(f"- **{r['id']}** {r['testo']} _Fonte: {r['fonte']}._")
    w('\n### Regole proposte (da accogliere o respingere dal coordinatore)\n')
    for r in d['regole_proposte']:
        w(f"- **{r['id']}** {r['testo']} _Fonte: {r['fonte']}_")
    w('\n## 6. Concorrenti diretti\n')
    w('R50 (Text-to-Mic: voce sintetica nel microfono di una riunione), R51 (Proloquo, con Proloquo4Text solo testo) e R52 (Grid: comunicazione aumentativa per computer). '
      'R53 (Voiceitt) riconosce il parlato atipico e non è un concorrente diretto. Le decisioni prese soltanto da R50 o R52 portano una «distinzione».\n')
    w('## 7. Decisioni\n')
    esiti = collections.Counter(x['esito'] for x in d['decisioni'])
    w('Esiti: ' + ', '.join(f'{k} {v}' for k, v in esiti.items()) + '. Ogni riga del confronto (432 varianti) è fonte di almeno una decisione. '
      'Gli identificatori D** sono decisioni di struttura e di contenuto, E** di effetti e animazioni, T** di token e composizione (scelte progettuali dichiarate).\n')
    w('| Id | Esito | Destinazione | Ambizione | Fonti (siti) |')
    w('|---|---|---|---|---|')
    for x in d['decisioni']:
        siti = sorted({sito(f) for f in x['fonti']})
        w(f"| {x['id']} | {x['esito']} | {x['destinazione'][:150]} | {', '.join(x.get('ambizione', []))} | {', '.join(siti) or 'progettuale'} |")
    w('')
    for x in d['decisioni']:
        w(f"### {x['id']} · {x['esito']} · {x['destinazione']}\n")
        siti = sorted({sito(f) for f in x['fonti']})
        righe = len(x['fonti'])
        w(f"- **Fonti:** {', '.join(siti) or 'nessuna (scelta progettuale)'}" + (f" ({righe} righe del confronto: caratteristica · ambito)" if righe else ''))
        w(f"- **Persona:** {x['persona']}. **Compito:** {x['compito']}.")
        w(f"- **Motivo:** {x['motivo']}")
        if x.get('motivo_dettaglio'): w(f"- **Esclusione ({x.get('motivo_tipo')}):** {x['motivo_dettaglio']}")
        elif x.get('motivo_tipo'): w(f"- **Tipo di motivo:** {x['motivo_tipo']}")
        if x.get('adattamento'): w(f"- **Adattamento:** {x['adattamento']}")
        if x.get('requisiti_funzionali'): w(f"- **Ripiego** ({', '.join(x['requisiti_funzionali'])}): {x.get('ripiego', '')}")
        if x.get('distinzione'): w(f"- **Distinzione:** {x['distinzione']}")
        if x.get('candidati'):
            w('- **Candidati:** ' + '; '.join(f"{c['valore']} ({c['fonte']}) → " + (f"eliminato da {c['eliminato_da']}" if c.get('eliminato_da') else '**scelto**') for c in x['candidati']))
        w(f"- **Ambizione:** {', '.join(x.get('ambizione', [])) or '—'}. **Regole:** {', '.join(x.get('regole', [])) or '—'}.")
        w(f"- **Prova viva:** {x.get('prova', '—')}. **Verifica:** {x.get('verifica', '—')}.\n")
    w('## 8. Decisioni provvisorie del coordinatore (in attesa di conferma del proprietario)\n')
    w('Da `design/incarichi/costruzione.md`, dubbi di `progetto.md` §12. Il sito le adotta e le dichiara come provvisorie nel catalogo.\n')
    w('- **A**: nessun indirizzo e-mail per ora; le segnalazioni passano dalle issue di GitHub, che richiedono un account; il sito lo dice.')
    w('- **B**: solo italiano, con `lang="it"` e una struttura che permette altre lingue in seguito (testi di interfaccia raccolti, nessuna stringa nel CSS).')
    w('- **E**: a chi ha Windows o macOS il sito dice «non ancora» e perché (serve un driver firmato su Windows e un componente audio approvato da Apple su macOS) e come seguire le novità (release su GitHub); nessun prodotto di terzi consigliato.')
    w('- **F**: una frase breve: Kalliope non è un dispositivo medico e non sostituisce la valutazione di un logopedista.')
    w('- **G**: i sei campioni sono l\'uscita di Kalliope 0.1-rc.1 senza ritocchi, in MP3 a 64 kbit/s, mono, 24 kHz; Whisper li trascrive con circa una parola sbagliata su 45.\n')
    w('## 9. Esito del controllo del metodo\n')
    w('```')
    w((run.stdout or '').strip() or (run.stderr or '').strip())
    w('```\n')
    w('## 10. Che cosa il controllo non dice\n')
    w(NON_VERIFICATO.strip() + '\n')
    open('/workspace/kalliope/design/direzione.md', 'w', encoding='utf-8').write('\n'.join(L) + '\n')
    print('direzione.md scritto', sum(len(x) for x in L), 'caratteri; controllo uscita', run.returncode)
