#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
"""Matrice di copertura compito (C1-C14 di design/ricerca/piano.md §1) x riferimento, da design/confronto.json.

Uso: python3 -I design/strumenti/copertura.py design/confronto.json [--json]
Stampa la matrice in Markdown (o JSON con --json). Il «nucleo» di un compito sono le righe del confronto in cui il compito
si esercita davvero (non solo le righe che il piano §8 etichetta con quel compito): cosi un sito non risulta «osservato» per
la guida all'installazione solo perche ha un indicatore di scorrimento. Il «supporto» e solo contato.
Cella: P = almeno una riga del nucleo presente; A = nessuna presente ma almeno una assente con prova; . = non osservato.
"""
import json, sys, collections

NUCLEI = {
 'C1':  ('Capire in pochi secondi', ['proposta del primo schermo', 'comandi visibili al primo schermo', 'comando principale'], []),
 'C2':  ('Far sentire una voce', ['campione di suono', 'scelta del suono prima di entrare'], ['avvio di audio e video', 'media non caricato']),
 'C3':  ('Mostrare il prodotto vero', ['prodotto mostrato'], []),
 'C4':  ('Guidare un\'installazione', ['guida a passi con ripresa', 'comandi da copiare', 'scelta per sistema o versione'], ['segnale di posizione e di avanzamento', 'comando proprio «indietro»']),
 'C5':  ('Stato, limiti, cosa non fa', ['stato e limiti dichiarati', 'avvertenza sui contenuti con uscita rapida', 'compromessi dichiarati nelle opzioni', 'tabella di compatibilità'], ['chi c\'è dietro e le fonti']),
 'C6':  ('Scrivere semplice', ['lunghezza e registro delle frasi', 'corto subito, lungo a richiesta'], ['testo corrente']),
 'C7':  ('Tastiera, interruttore, puntamento', ['percorso da tastiera', 'bersagli dei comandi principali', 'testo al 200%', 'zoom al 200%', 'tenuta con colori forzati'], ['albero di accessibilità (proxy)', 'comportamento senza JavaScript', 'zoom della pagina consentito dal meta viewport', 'tema scelto dalla persona']),
 'C8':  ('Fatti verificabili', ['chi c\'è dietro e le fonti', 'numeri detti a parole'], ['testimonianze di utenti']),
 'C9':  ('Porte per pubblici diversi', ['porte per pubblici diversi', 'struttura della navigazione'], ['testimonianze di utenti']),
 'C10': ('Aiuto per l\'uso ricorrente', ['@aiuto'], ['messaggio di errore']),
 'C11': ('Leggere e inoltrare dal telefono', ['stampa', 'anteprima del collegamento', 'sovrapposizione di messaggi al primo arrivo'], ['testo corrente', 'bersagli dei comandi principali']),
 'C12': ('Vuoti, errori, «non è per te»', ['pagina inesistente', 'messaggio di errore', 'avvertenza sui contenuti con uscita rapida'], ['comando proprio «indietro»']),
 'C13': ('Carattere con movimento e suono', ['effetto o animazione', 'effetti con movimento ridotto'], ['apertura del menu', 'scelta del suono prima di entrare']),
 'C14': ('Pagine leggere e robuste', ['richieste e terze parti', 'attesa del caricamento', 'comportamento senza JavaScript'], ['finestra del consenso ai cookie', 'media non caricato']),
}

def calcola(c):
    ids = c['campione']
    righe = c['confronti']
    out = {}
    for cid, (titolo, nucleo, supporto) in NUCLEI.items():
        def sel(nomi):
            r = []
            for x in righe:
                for n in nomi:
                    if n == '@aiuto':
                        if x['ambito'].startswith('aiuto'): r.append(x)
                    elif x['caratteristica'] == n: r.append(x)
            return r
        rn = sel(nucleo); rs = sel(supporto)
        celle = {}
        for i in ids:
            p = [f"{x['caratteristica']} · {x['ambito']}" for x in rn if i in x['presenti']]
            a = [f"{x['caratteristica']} · {x['ambito']}" for x in rn if i in x['assenti']]
            celle[i] = ('P' if p else 'A' if a else '.', p, a)
        P = [i for i in ids if celle[i][0] == 'P']
        A = [i for i in ids if celle[i][0] == 'A']
        N = [i for i in ids if celle[i][0] == '.']
        sup = [i for i in ids if any(i in x['presenti'] or i in x['assenti'] for x in rs)]
        verdetto = 'coperto' if len(P) >= 3 else (f'lacuna: {len(P)} presenti, con le assenze {len(P) + len(A)} osservati' if len(P) + len(A) >= 3 else f'lacuna: {len(P)} presenti')
        out[cid] = dict(titolo=titolo, nucleo=nucleo, supporto=supporto, celle=celle, P=P, A=A, N=N, supporto_siti=sup,
                        righe_nucleo=len(rn), verdetto=verdetto)
    return ids, out


PROFONDITA = {
 'C1': ('Tutti e 13 hanno un primo schermo osservato (3-75 parole di proposta). Modelli positivi per «cosa fa, per chi, cosa serve»: R22 e R21 (titolo breve e chiaro), R50 (titolo, sottotitolo, pulsante con versione e peso). Nessuno dice «non è per te» al primo schermo.',
        'nessuna sul compito; manca il caso «non è per te» (si inventa in direzione)'),
 'C2': ('Presenti 4: R03 (campioni muti con testo accanto, «Unmute»), R05 (stem con un solo suono per volta, senza testo né durata), R06 (scelta del suono prima di entrare, nessun predefinito), R51 (quattro voci, nessun testo detto accanto; lo stato di riproduzione non è stato osservato perché in questo browser non c\'è uscita audio). Assenze verificate in 9 siti. **Profondità sotto 3**: solo R03 accoppia suono e testo, e il suo testo è una conversazione registrata, non una frase digitata e pronunciata; nessun sito mostra la frase scritta e la stessa frase detta (con numeri e date a parole) a fianco.',
        'profondità: 1 sito su 4 con testo accanto. Riserva: Predictable (Therapy Box, `selezione.md`, CAA con voci) per le voci; non esiste nel campione un riferimento per «scritto → detto»: è lo spazio dell\'ambizione A1'),
 'C3': ('Tutti mostrano il prodotto (foto, schermata, video, avatar vivo). Prodotto software con finestra vera: R50 (schermate reali e video), R05 (schermata dell\'app con gli stati), R52 (8 schermate nel carosello), R51 (schermata annotata). Solo R05 e R50 mostrano stati diversi dal caso felice.',
        'nessuna sul compito'),
 'C4': ('Presenti 2: R05 (pagina di scarico che riconosce il sistema, data dell\'ultimo rilascio, schermata con gli stati; la guida è un paragrafo senza passi) e R50 (quattro passi numerati con schermate, riquadro «What you need»; nessun comando da copiare, nessuna verifica del risultato, nessuna ripresa). Assente verificato: R53 (app nel browser, nessuna installazione). **Nessun sito ha comandi da terminale copiabili, impronta del file o verifica dopo ogni passo**: il percorso P4 di Kalliope non ha un modello osservato.',
        '**lacuna: 2 presenti su 3 richiesti**. Riserva per `selezione.md`: Human In The Loop (hitl.sh, C4 C9); il suo adattamento a un\'installazione di programma è dubbio (non è una pagina di download): se il coordinatore vuole un terzo modello vero, serve un sito di programma per Linux con guida a passi e verifica, da cercare (nessuno nominato qui: non verificato)'),
 'C5': ('10 presenti, 2 assenti (R03, R52 con primo schermo senza limiti). Dichiarano un limite o uno stato: R53 («We can\'t promise 100% accuracy… still learning the potential and limitations», in fondo alla pagina), R21 («SUMMARIZED BY AI» e commissione prima del testo), R22 (note a margine sui limiti del dato, «Sponsored by Google Trends» in testa), R06 (avvertenza con aiuto 24 ore e uscita rapida, compare dopo 2-8 s), R50 (avviso antivirus in giallo), R01 (limiti nella FAQ). **Solo R21 e R22 mettono lo stato prima della promessa**, e nessuna dichiara cosa non è stato provato.',
        'nessuna sul compito; nessun modello per «provato / non provato» (R51 ha solo requisiti)'),
 'C6': ('Osservato in 13 (registro delle frasi al primo schermo: 3-75 parole). Frasi corte con seconda persona: R50 (passi), R21; frasi lunghe: R53, R52, R04. Nessun sito ha una versione facilitata o semplice; «corto subito, lungo a richiesta» è una FAQ in fisarmonica in 8 siti. Le quattro pagine italiane G01-G04 (`registro-italiano.md`) danno il registro: 15-18 parole per frase nelle pagine che parlano a una persona sola.',
        'nessuna per il numero; profondità: nessun testo facilitato osservato. Riserva: The Way Meditation App (C6 C7) in `selezione.md`'),
 'C7': ('Tastiera, bersagli e testo al 200% osservati in tutti i 13; colori forzati e zoom in tutti. Modelli positivi: «Skip to content» visibile al focus in R03 e R21, R52 (anche 6 metodi d\'accesso dichiarati: sguardo, tocco, interruttore, puntatore, voce, audio), R51 (0 immagini senza alt su 57). Da non prendere: comandi non raggiungibili da tastiera in R01 (div senza ruolo) e R20 (tabindex -1); controlli invisibili nell\'ordine di Tab e carte non accessibili in R06. **Mai osservato: puntamento oculare, interruttore o lettore di schermo veri** (solo proxy: albero di accessibilità, Tab, foto).',
        'nessuna per i controlli da proxy; il resto (ausili veri) non si copre con una riserva: serve una prova con persone e ausili, domanda al proprietario. Riserve: The Way Meditation App (C6 C7), Chase Mobile App (C3 C7 C12)'),
 'C8': ('13 presenti (firma, data, versione, fonti). Modelli: R22 (sezione «Data & methodology» con criteri numerati e nove fonti), R04 (grafico con incertezza, tabella gemella, FAQ citabili, limiti in una voce propria), R03 (certificazioni in un blocco). Numeri detti a parole: R04, R21, R22 (presenti), R05, R50, R52 (assenti).',
        'nessuna sul compito'),
 'C9': ('11 presenti, 2 assenti (R22, R53). Porte per ruolo: solo R06 («FACILITATORS\' GUIDE») e R51 (menu per tipo di app, persone nei testi e nelle testimonianze); R01, R03, R52 per compito; R20, R21 per argomento. **Nessun sito ha porte per «persona / familiare / logopedista / tecnico / chi controlla» con le stesse informazioni dette a ciascuno.**',
        'nessuna per il numero; la tabella «la stessa cosa detta a chi» (`progetto.md` §4.3) non ha un modello osservato'),
 'C10': ('9 presenti (FAQ in fisarmonica R01, R04, R05, R06, R50, R53; documentazione Hub R52 con articoli a domanda, filtri per tipo e risposta per dispositivo; ricerca senza risultati R51 e R52, che non suggeriscono alternative). Non osservati: R02, R03, R20, R21 (nessun aiuto). **Nessun sito indicizza l\'aiuto sulle frasi che il prodotto mostra, né dichiara «provato / non provato» per app e piattaforma** (tabella di compatibilità: R51 presente come requisiti, R04, R05, R50, R52, R53 assenti).',
        'nessuna sul compito; solo R52 ha documentazione di diagnosi vera'),
 'C11': ('13 osservati: stampa, anteprima del collegamento, telefono 390×844 con script. Modello di lettura lunga da telefono: R21 (18/27 px, colonna 358 px, 42-48 caratteri per riga), R22 (note a margine che entrano nel testo). Sovrapposizioni da non prendere: R05 (tre messaggi), R53 (consenso + CONTACT US), R52 (chat sul testo).',
        'nessuna sul compito'),
 'C12': ('13 presenti con la 404 (utile: R51 con ricerca e «Popular products», R52 con elenco di link, R21 con una frase senza colpa; inutile: R53 «click here», R06 nero su nero, R22 predefinita di Netlify); ricerca senza risultati R51 e R52; messaggio di errore su un campo: solo R22 (nessun modulo si è inviato per la regola «nessun dato vero»). Avvertenza con uscita rapida: R06.',
        'nessuna per 404 e vuoto; errore di campo non osservato in 12 siti perché la regola vieta di inviare moduli (Kalliope non ha moduli, quindi non serve). Riserva se utile: Chase Mobile App (C3 C7 C12)'),
 'C13': ('13 presenti con effetti inventariati (R04-R06 dai loro inventari del movimento, §«Integrazioni»). Movimento che porta significato: R06 (la porta di «sliding doors»), R04 (conteggio con la frase già nel DOM), R20 (isola contestuale), R03 (pillola che diventa riquadro). Movimento ridotto (riga «effetti con movimento ridotto», 13 siti con la riga misurata): 0 siti **sostituiscono** un effetto con un\'alternativa; R52 toglie 2 effetti su 2, R21 1 su 1, R03, R53, R22 e R50 ne tolgono 1; R01, R02, R04, R05, R06, R20 e R51 non cambiano nulla.',
        'nessuna sul compito'),
 'C14': ('13 presenti (richieste e domini di terzi, attesa, senza JavaScript). Pagine leggere da prendere a modello di peso: R50 (66 richieste, 4 domini, 471 kB), R51 (24 richieste, 83 kB di JS); pesanti: R01 (11,4 MB), R03 (192 richieste), R05 (250 richieste), R53 (128 richieste, 17 domini). Con senza JavaScript: R21 e R22 hanno il testo intero; R01, R02 lo nascondono (opacità 0).',
        'nessuna sul compito'),
}

def scrivi_md(c, dst):
    import datetime
    ids, out = calcola(c)
    nome = {r['id']: r.get('nome', r['id']).replace('|', '/') for r in c['riferimenti']}
    L = []
    w = L.append
    w('# Copertura dei compiti: matrice compito × riferimento\n')
    w(f'Generata il {datetime.date.today().strftime("%d/%m/%Y")} da `design/confronto.json` con `design/strumenti/copertura.py` (nessuna cifra scritta a mano nella matrice; '
      'le note di profondità sono lette dalle schede e dagli appunti dei visitatori e citano il sito). Compiti C1-C14: `design/ricerca/piano.md` §1.\n')
    w('## Come si legge\n')
    w('- **P** = nel sito almeno una riga del *nucleo* del compito è presente (osservato, con prova). **A** = nessuna riga del nucleo presente e almeno una assente con prova '
      '(contesto osservato, il tratto non c\'è). **·** = non osservato (riga mancante o dichiarata non osservata): non è un\'assenza.')
    w('- Il *nucleo* di un compito sono le righe del confronto in cui il compito si esercita davvero; le altre righe che il piano §8 etichetta con quel compito sono «supporto» e non decidono la copertura '
      '(un sito non conta per la guida all\'installazione perché ha un indicatore di scorrimento).')
    w('- Regola di piano §5.1: ogni compito in almeno 3 riferimenti con tratto **presente**. Un compito coperto solo da assenze, o con meno di 3 presenti, è una lacuna. '
      'Poi una seconda lettura, la **profondità**: P dice che il sito è stato osservato su quel compito, non che sia un buon modello.\n')
    w('## Matrice\n')
    w('| Compito | ' + ' | '.join(ids) + ' | Presenti | Assenti | Non oss. | Esito |')
    w('|---|' + '---|' * len(ids) + '---|---|---|---|')
    for k, v in out.items():
        w(f"| **{k}** {v['titolo']} | " + ' | '.join(v['celle'][i][0] for i in ids) + f" | {len(v['P'])} | {len(v['A'])} | {len(v['N'])} | {v['verdetto']} |")
    w('\nRiferimenti: ' + '; '.join(f'{i} {nome[i]}' for i in ids) + '. R01-R06 gruppo A, R20-R22 gruppo B (Webby), R50-R53 gruppo C (prodotti affini, non Webby).\n')
    w('## Nuclei e profondità, compito per compito\n')
    for k, v in out.items():
        w(f"### {k} · {v['titolo']}\n")
        w(f"- **Nucleo** (righe del confronto): {'; '.join('«' + n + '»' if n != '@aiuto' else 'tutte le righe con ambito «aiuto»' for n in v['nucleo'])}. Supporto: {'; '.join('«' + n + '»' for n in v['supporto']) or '—'}.")
        w(f"- **Presenti ({len(v['P'])}):** {', '.join(v['P']) or '—'}. **Assenti verificati ({len(v['A'])}):** {', '.join(v['A']) or '—'}. **Non osservati ({len(v['N'])}):** {', '.join(v['N']) or '—'}. Esito: **{v['verdetto']}**.")
        prof, lac = PROFONDITA[k]
        w(f"- **Profondità:** {prof}")
        w(f"- **Lacuna e riserva:** {lac}\n")
    w('## Lacune riassunte e riserve (`selezione.md`)\n')
    w('| Compito | Lacuna | Che cosa coprirebbe | Decisione richiesta |')
    w('|---|---|---|---|')
    w('| C4 installazione guidata | 2 presenti (R05, R50), nessuno con comandi copiabili, verifica o ripresa | Riserva Human In The Loop (C4 C9) per `selezione.md`; adattamento dubbio. In alternativa un sito di programma per Linux con guida a passi (da cercare, non nominato) | Al coordinatore: visita di una riserva solo per C4 (piano §5.2: «si aggiungono riferimenti per quel compito»). La direzione procede senza aspettare: P4 è dichiarato progettuale |')
    w('| C2 voce con testo accanto | 4 presenti ma solo R03 con testo accanto; nessun «scritto → detto» | Riserva Predictable (Therapy Box) per le voci; non copre «scritto → detto» | Come sopra; l\'idea di mostrare scritto e detto è una scelta progettuale dichiarata (ambizione A1) |')
    w('| C6 testo facilitato | Nessun sito con versione semplice | Riserva The Way Meditation App (C6 C7); registro italiano G01-G04 già letto | Solo se serve un modello visivo; il registro è coperto da G01-G04 |')
    w('| C7 ausili veri | Mai osservati puntamento oculare, interruttore, lettore di schermo | Nessuna riserva: serve una prova con persone e ausili | Al proprietario: persone disposte a provare (domanda aperta) |')
    w('| C9 porte per persona | Nessun sito instrada per persona / familiare / tecnico con le stesse informazioni dette a ciascuno | Nessuna riserva nota | Progettuale (A3) |\n')
    w('## Integrazioni e limiti di questa matrice\n')
    w('- **Righe «effetto o animazione» aggiunte** per R04, R05 e R06: le loro osservazioni JSON non avevano la riga V35 (gli effetti stanno nei file `ricerca/movimento/R0x.md`). '
      'Il worker di costruzione ha aggiunto una riga per ogni effetto Mxx (solo il trigger letto dal testo; durate, curve e proprietà dichiarate non misurate nel JSON e lette nel file del visitatore), con il campo `origine`. '
      'Lo strumento è `design/strumenti/unisci-osservazioni.py`. Da correggere alla fonte dal collettore se serve il valore misurato.')
    w('- Il campione ha 13 riferimenti, visitati in Chromium senza finestra. Firefox e WebKit non sono stati usati: ciò che dipende dal motore (riproduzione degli MP3, rendering) non è coperto dalla ricerca.')
    w('- R50-R53: osservazioni controllate (formato pulito); schede e inventari del movimento in scrittura da parte dell\'altro worker al momento di questa generazione: rigenerare con `python3 -I design/strumenti/copertura.py` dopo la consegna.')
    open(dst, 'w', encoding='utf-8').write('\n'.join(L) + '\n')

if __name__ == '__main__':
    c = json.load(open(sys.argv[1], encoding='utf-8'))
    if '--md' in sys.argv:
        scrivi_md(c, sys.argv[sys.argv.index('--md') + 1]); sys.exit(0)
    ids, out = calcola(c)
    if '--json' in sys.argv:
        print(json.dumps({k: {kk: vv for kk, vv in v.items() if kk != 'celle'} for k, v in out.items()}, ensure_ascii=False, indent=1))
    else:
        print('| Compito | ' + ' | '.join(ids) + ' | P | A | verdetto |')
        print('|---|' + '---|' * len(ids) + '---|---|---|')
        for k, v in out.items():
            print(f"| {k} {v['titolo']} | " + ' | '.join(v['celle'][i][0] for i in ids) + f" | {len(v['P'])} | {len(v['A'])} | {v['verdetto']} |")
