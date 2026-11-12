#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
# Statistiche di registro sui testi delle fonti G01-G04 (worker visita-4). Uso: visita4-registro.py <file.txt>...
# Considera solo i paragrafi lunghi (>= 8 parole): il resto è menu, etichette e pulsanti.
import sys, re, json
P = '/workspace/kalliope/design/ricerca/prove/'
def analizza(path):
    t = open(path, encoding='utf8').read()
    righe = [r.strip() for r in t.split('\n')]
    par = [r for r in righe if len(r.split()) >= 8 and not (len(r.split()) > 60 and not re.search(r'[\.,;:]', r))]  # esclude la nuvola di tag (molte parole, nessuna punteggiatura)
    testo = ' '.join(par)
    frasi = []
    for r in par:  # ogni riga è un paragrafo o una voce d'elenco: le frasi non attraversano la riga
        frasi += [f.strip() for f in re.split(r'(?<=[\.\!\?…])\s+(?=[A-ZÀ-Ù“"«])', r) if len(f.split()) >= 3]
    lung = [len(f.split()) for f in frasi]
    parole = re.findall(r"[A-Za-zÀ-ÿ']+", testo.lower())
    def c(rx): return len(re.findall(rx, testo.lower()))
    return {
        'file': path.replace(P, ''), 'paragrafi': len(par), 'frasi': len(frasi), 'parole': len(parole),
        'parole_per_frase_media': round(sum(lung) / max(1, len(lung)), 1), 'frase_max': max(lung or [0]),
        'frasi_oltre_30_parole': sum(1 for x in lung if x > 30), 'quota_oltre_30': round(sum(1 for x in lung if x > 30) / max(1, len(lung)), 2),
        'seconda_persona': c(r"\b(tu|ti|te|tuo|tua|tuoi|tue|vostro|vostra|ricorda|impara|rispettati|accetta|difendi|vigila|non permettere|ascoltiamo|sei)\b"),
        'prima_plurale': c(r"\b(noi|nostro|nostra|nostri|nostre|vogliamo|abbiamo|ci auguriamo|ci ritroviamo|siamo|ascoltiamo)\b"),
        'terza_persona_malato_paziente': c(r"\b(malato|malati|paziente|pazienti|ammalato)\b"),
        'persona_con': c(r"\bpersone? (con|affett[ae]|che convivono|che)\b"),
        'disabilita': c(r"\bdisabil"), 'caregiver': c(r"\bcaregiver"),
        'gergo_sigle': c(r"\b(dat|adi|peg|niv|pai|pcc|pdta|rsa|lea|osa|oss|uvm|ict[a-z]*|asr|aac|caa)\b"),
        'termini_ausili': {k: c(k) for k in ['puntatore oculare', 'comunicatore', 'sintetizzatore', 'laringofono', 'protesi', 'comunicazione aumentativa', 'tablet', 'app']},
    }
for f in sys.argv[1:]:
    print(json.dumps(analizza(f), ensure_ascii=False))
