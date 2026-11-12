# Confronto dei 13 riferimenti: identico, varianti, peculiarità

Generato il 12/11/2026 da `design/confronto.json` con `design/strumenti/vista-confronto.py` (fonte: `design/ricerca/osservazioni/R*.json`, controllate con `confronta-riferimenti.mjs --controlla`). Questa vista non sostituisce il JSON: lì stanno tutte le osservazioni con valori, descrizioni e prove per sito.

## 1. Campione e limiti

13 riferimenti, tutti visitati con Chromium senza finestra (`passo.mjs`; nessun Chrome MCP in questo host; Firefox e WebKit non usati per la ricerca). Il confronto vale per questo campione e non per «ogni vincitore»: i sottogruppi sono dichiarati qui sotto.

| ID | Riferimento | Gruppo | Premio o tipo | Osservazioni dichiarate: presenti / assenti / non osservate |
|---|---|---|---|---|
| R01 | Signs | A | Webby Winner (Accessibility & Inclusion); Webby Winner e People's Voice Winner (Accessible Technology) | 39 / 5 / 2 |
| R02 | Touch: Beyond Vision | A | Webby Winner (tre categorie, «3 Wins») | 36 / 6 / 2 |
| R03 | ElevenAgents | A | Webby Winner | 40 / 2 / 4 |
| R04 | Waymo / Safety Hub | A | Webby Winner | 49 / 4 / 3 |
| R05 | LALAL.AI | A | People's Voice Winner | 56 / 4 / 3 |
| R06 | Through Sliding Doors | A | Webby Winner | 43 / 1 / 7 |
| R20 | Ottografie (Otto van den Toorn) | B | Webby Winner | 45 / 3 / 3 |
| R21 | Lonely Planet, «Beat the Crowds: How to… | B | People's Voice Winner | 38 / 5 / 1 |
| R22 | Searching for Birds (Visual Cinnamon, T… | B | People's Voice Winner | 35 / 6 / 2 |
| R50 | Text-to-Mic (Scorchsoft) | C | non Webby, gruppo C (prodotto affine; nessun riconoscimento trovato) | 47 / 6 / 2 |
| R51 | Proloquo2Go / Proloquo (AssistiveWare) | C | non Webby, gruppo C (fonti-c: honoree Webby 2013 per Proloquo2Go da comunicato dell'azienda; App Store Award… | 45 / 3 / 2 |
| R52 | Grid (Smartbox) | C | non Webby, gruppo C | 40 / 6 / 3 |
| R53 | Voiceitt | C | non Webby, gruppo C (sulla home un elenco di riconoscimenti senza anno né dettaglio, non verificati) | 38 / 8 / 2 |

Gruppi: A = problema, settore, meccanismo (Webby); B = competenze (Webby); C = prodotti affini e concorrenti (non Webby, nessun premio: R50-R53).

## 2. Risultato in breve

- **Intersezione identica (stesso valore in tutti i 13 riferimenti): vuota.** 0 righe su 184. Nessun denominatore comune è inventato.
- **Meccanismi comuni** (tutti i 13 siti presenti, con valori diversi): 16 righe su 184: sono il modo in cui ciascun sito risolve la stessa funzione (arrivo, 404, tastiera, rete, testo corrente, …), non un'identità condivisa. Elenco al §3.
- Righe con 2 o più presenti ma non tutti: 38. Righe con un solo sito presente (peculiarità, «singolare fra le osservazioni disponibili»): 128. Righe con soli siti assenti: 2.
- Peculiarità registrate (varianti con un solo sito): 368, tra cui 119 effetti o animazioni (§6).
- Righe non osservate: ogni sito ha il suo elenco di lacune con il motivo (§8). Una riga mancante non è mai un'assenza.

## 3. Meccanismi comuni (16): tutti i siti, con le varianti

Ogni riga: stessa funzione in tutti i 13 siti; il valore cambia. Le prove per sito sono in `confronto.json` → `confronti[…].varianti[…].fonti`.

### proposta del primo schermo · arrivo computer

Presenti 13/13; varianti distinte: 13.

| Valore misurato o categoria | Siti |
|---|---|
| `{"frasi": 2, "parole": 23}` | R01 |
| `{"frasi": 2, "parole": 8}` | R02 |
| `{"frasi": 1, "parole": 21}` | R03 |
| `{"frasi": 3, "parole": 75}` | R04 |
| `{"frasi": 3, "parole": 20}` | R05 |
| `{"frasi": 1, "parole": 35}` | R06 |
| `{"frasi": 1, "parole": 12}` | R20 |
| `{"frasi": 1, "parole": 9}` | R21 |
| `{"frasi": 1, "parole": 3}` | R22 |
| `{"frasi": 3, "parole": 49}` | R50 |
| `{"frasi": 4, "parole": 57}` | R51 |
| `{"frasi": 4, "parole": 63}` | R52 |
| `{"frasi": 3, "parole": 42}` | R53 |

### comandi visibili al primo schermo · arrivo computer

Presenti 13/13; varianti distinte: 12.

| Valore misurato o categoria | Siti |
|---|---|
| `{"campi": 0, "link": 4, "pulsanti": 0}` | R02, R20 |
| `{"campi": 0, "link": 0, "pulsanti": 1}` | R01 |
| `{"campi": 1, "link": 15, "pulsanti": 15}` | R03 |
| `{"campi": 0, "link": 11, "pulsanti": 2}` | R04 |
| `{"campi": 0, "link": 8, "pulsanti": 7}` | R05 |
| `{"campi": 0, "link": 4, "pulsanti": 3}` | R06 |
| `{"campi": 0, "link": 17, "pulsanti": 2}` | R21 |
| `{"campi": 0, "link": 0, "pulsanti": 0}` | R22 |
| `{"campi": 0, "link": 13, "pulsanti": 4}` | R50 |
| `{"campi": 0, "link": 6, "pulsanti": 4}` | R51 |
| `{"campi": 0, "link": 4, "pulsanti": 21}` | R52 |
| `{"campi": 0, "link": 5, "pulsanti": 1}` | R53 |

### comandi visibili al primo schermo · arrivo telefono

Presenti 13/13; varianti distinte: 13.

| Valore misurato o categoria | Siti |
|---|---|
| `{"campi": 0, "link": 0, "pulsanti": 1}` | R01 |
| `{"campi": 0, "link": 1, "pulsanti": 1}` | R02 |
| `{"campi": 1, "link": 7, "pulsanti": 8}` | R03 |
| `{"campi": 0, "link": 1, "pulsanti": 3}` | R04 |
| `{"campi": 0, "link": 4, "pulsanti": 8}` | R05 |
| `{"campi": 0, "link": 4, "pulsanti": 3}` | R06 |
| `{"campi": 0, "link": 4, "pulsanti": 0}` | R20 |
| `{"campi": 0, "link": 10, "pulsanti": 3}` | R21 |
| `{"campi": 0, "link": 5, "pulsanti": 0}` | R22 |
| `{"campi": 0, "link": 7, "pulsanti": 2}` | R50 |
| `{"campi": 0, "link": 4, "pulsanti": 1}` | R51 |
| `{"campi": 0, "link": 1, "pulsanti": 15}` | R52 |
| `{"campi": 4, "link": 4, "pulsanti": 3}` | R53 |

### pagina inesistente · 404

Presenti 13/13; varianti distinte: 4.

| Valore misurato o categoria | Siti |
|---|---|
| `{"offre_ritorno": "sì", "utile": "sì"}` | R01, R02, R04, R05, R21, R51, R52 |
| `{"offre_ritorno": "sì", "utile": "no"}` | R20, R50, R53 |
| `{"offre_ritorno": "no", "utile": "no"}` | R06, R22 |
| `{"offre_ritorno": "no", "utile": "sì"}` | R03 |

### attesa del caricamento · rete lenta

Presenti 13/13; varianti distinte: 11.

| Valore misurato o categoria | Siti |
|---|---|
| `{"segnale": "vuoto"}` | R02, R06, R20 |
| `{"s_al_primo_testo": 8.9, "segnale": "spinner"}` | R01 |
| `{"s_al_primo_testo": 1.03, "segnale": "testo"}` | R03 |
| `{"s_al_primo_testo": 0.9, "segnale": "testo"}` | R04 |
| `{"s_al_primo_testo": 5.6, "segnale": "scheletro"}` | R05 |
| `{"s_al_primo_testo": 0.37, "segnale": "testo"}` | R21 |
| `{"s_al_primo_testo": 0.29, "segnale": "testo"}` | R22 |
| `{"s_al_primo_testo": 4.7, "segnale": "vuoto"}` | R50 |
| `{"s_al_primo_testo": 4.2, "segnale": "vuoto"}` | R51 |
| `{"s_al_primo_testo": 3.3, "segnale": "vuoto"}` | R52 |
| `{"s_al_primo_testo": 2.5, "segnale": "vuoto"}` | R53 |

### comportamento senza JavaScript · senza JavaScript

Presenti 13/13; varianti distinte: 8.

| Valore misurato o categoria | Siti |
|---|---|
| `{"comandi_essenziali": "no", "contenuto": "nessuno", "navigazione": "no"}` | R01, R02, R06, R20 |
| `{"contenuto": "parziale"}` | R04, R52 |
| `{"contenuto": "tutto"}` | R50, R51 |
| `{"comandi_essenziali": "funzionano", "contenuto": "parziale", "navigazione": "funziona"}` | R03 |
| `{"comandi_essenziali": "no", "contenuto": "parziale"}` | R05 |
| `{"comandi_essenziali": "funzionano", "contenuto": "tutto", "navigazione": "funziona"}` | R21 |
| `{"comandi_essenziali": "no", "contenuto": "parziale", "navigazione": "funziona"}` | R22 |
| `{"contenuto": "nessuno"}` | R53 |

### effetti con movimento ridotto · movimento ridotto

Presenti 13/13; varianti distinte: 10.

| Valore misurato o categoria | Siti |
|---|---|
| `{"effetti": 2, "invariati": 2, "sostituiti": 0, "tolti": 0}` | R01, R02 |
| `{"effetti": 3, "invariati": 2, "sostituiti": 0, "tolti": 1}` | R03, R53 |
| `{"effetti": 3, "invariati": 3, "sostituiti": 0, "tolti": 0}` | R06, R20 |
| `{"effetti": 8, "invariati": 7, "sostituiti": 0, "tolti": 0}` | R04 |
| `{"effetti": 7, "invariati": 7, "sostituiti": 0, "tolti": 0}` | R05 |
| `{"effetti": 1, "invariati": 0, "sostituiti": 0, "tolti": 1}` | R21 |
| `{"effetti": 2, "invariati": 1, "sostituiti": 0, "tolti": 1}` | R22 |
| `{"effetti": 5, "invariati": 4, "sostituiti": 0, "tolti": 1}` | R50 |
| `{"effetti": 1, "invariati": 1, "sostituiti": 0, "tolti": 0}` | R51 |
| `{"effetti": 2, "invariati": 0, "sostituiti": 0, "tolti": 2}` | R52 |

### percorso da tastiera · tastiera

Presenti 13/13; varianti distinte: 12.

| Valore misurato o categoria | Siti |
|---|---|
| `{"focus_visibile": "sì", "salta_al_contenuto": "no", "trappole": 0}` | R20, R53 |
| `{"salta_al_contenuto": "no", "tab_fino_al_comando_principale": 1, "trappole": 0}` | R01 |
| `{"focus_visibile": "no", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 18, "trappole": 0}` | R02 |
| `{"focus_visibile": "sì", "salta_al_contenuto": "sì", "tab_fino_al_comando_principale": 17, "trappole": 0}` | R03 |
| `{"focus_visibile": "sì", "salta_al_contenuto": "sì", "tab_fino_al_comando_principale": 28, "trappole": 0}` | R04 |
| `{"focus_visibile": "sì", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 29, "trappole": 0}` | R05 |
| `{"focus_visibile": "parziale", "salta_al_contenuto": "no", "trappole": 0}` | R06 |
| `{"focus_visibile": "sì", "salta_al_contenuto": "sì", "tab_fino_al_comando_principale": 1}` | R21 |
| `{"focus_visibile": "sì", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 1, "trappole": 0}` | R22 |
| `{"focus_visibile": "debole", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 14, "trappole": 0}` | R50 |
| `{"focus_visibile": "sì", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 10, "trappole": 0}` | R51 |
| `{"focus_visibile": "sì", "salta_al_contenuto": "sì", "tab_fino_al_comando_principale": 11, "trappole": 0}` | R52 |

### testo al 200% · testo 200%

Presenti 13/13; varianti distinte: 4.

| Valore misurato o categoria | Siti |
|---|---|
| `{"contenuto_perso": "no", "scroll_orizzontale": "no"}` | R01, R02, R04, R05, R06, R20, R50 |
| `{"contenuto_perso": "sì", "scroll_orizzontale": "sì"}` | R03, R52 |
| `{"contenuto_perso": "no", "scroll_orizzontale": "sì"}` | R21, R22 |
| `{"contenuto_perso": "sì", "scroll_orizzontale": "no"}` | R51, R53 |

### albero di accessibilità (proxy) · arrivo computer

Presenti 13/13; varianti distinte: 13.

| Valore misurato o categoria | Siti |
|---|---|
| `{"comandi_senza_nome": 1, "immagini_senza_alternativa": 11, "punti_di_riferimento": 1, "titoli": 0}` | R01 |
| `{"comandi_senza_nome": 3, "immagini_senza_alternativa": 1, "punti_di_riferimento": 3, "titoli": 11}` | R02 |
| `{"comandi_senza_nome": 5, "immagini_senza_alternativa": 6, "punti_di_riferimento": 3, "titoli": 31}` | R03 |
| `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 0, "punti_di_riferimento": 5, "titoli": 14}` | R04 |
| `{"comandi_senza_nome": 6, "immagini_senza_alternativa": 0, "punti_di_riferimento": 7, "titoli": 20}` | R05 |
| `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 14, "punti_di_riferimento": 1, "titoli": 0}` | R06 |
| `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 85, "punti_di_riferimento": 0, "titoli": 4}` | R20 |
| `{"immagini_senza_alternativa": 0, "punti_di_riferimento": 10, "titoli": 9}` | R21 |
| `{"immagini_senza_alternativa": 0, "punti_di_riferimento": 4, "titoli": 37}` | R22 |
| `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 0, "punti_di_riferimento": 9, "titoli": 45}` | R50 |
| `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 0, "punti_di_riferimento": 7, "titoli": 23}` | R51 |
| `{"comandi_senza_nome": 1, "immagini_senza_alternativa": 0, "punti_di_riferimento": 6, "titoli": 19}` | R52 |
| `{"comandi_senza_nome": 46, "immagini_senza_alternativa": 0, "punti_di_riferimento": 5, "titoli": 33}` | R53 |

### bersagli dei comandi principali · arrivo telefono

Presenti 13/13; varianti distinte: 12.

| Valore misurato o categoria | Siti |
|---|---|
| `{"altezza_min_px": 12, "larghezza_min_px": 12}` | R05, R52 |
| `{"altezza_min_px": 56, "larghezza_min_px": 170}` | R01 |
| `{"altezza_min_px": 60, "distanza_min_px": 224, "larghezza_min_px": 38}` | R02 |
| `{"altezza_min_px": 22, "distanza_min_px": 0, "larghezza_min_px": 24}` | R03 |
| `{"altezza_min_px": 16, "larghezza_min_px": 13}` | R04 |
| `{"altezza_min_px": 15, "larghezza_min_px": 42}` | R06 |
| `{"altezza_min_px": 25, "distanza_min_px": 37, "larghezza_min_px": 40}` | R20 |
| `{"altezza_min_px": 14, "distanza_min_px": 8, "larghezza_min_px": 14}` | R21 |
| `{"altezza_min_px": 23, "distanza_min_px": 10, "larghezza_min_px": 92}` | R22 |
| `{"altezza_min_px": 16, "larghezza_min_px": 16}` | R50 |
| `{"altezza_min_px": 16, "larghezza_min_px": 69}` | R51 |
| `{"altezza_min_px": 24, "larghezza_min_px": 48}` | R53 |

### testo corrente · arrivo computer

Presenti 13/13; varianti distinte: 12.

| Valore misurato o categoria | Siti |
|---|---|
| `{"corpo_px": 20, "interlinea": 1.5}` | R51, R53 |
| `{"caratteri_per_riga_max": 73, "corpo_px": 18, "interlinea": 1.5}` | R01 |
| `{"caratteri_per_riga_max": 68, "corpo_px": 15, "interlinea": 1.75}` | R02 |
| `{"caratteri_per_riga_max": 59, "corpo_px": 16, "interlinea": 1.5}` | R03 |
| `{"caratteri_per_riga_max": 58, "corpo_px": 16, "interlinea": 1.5}` | R04 |
| `{"corpo_px": 18, "interlinea": 1.33}` | R05 |
| `{"corpo_px": 23.3, "interlinea": 1.5}` | R06 |
| `{"caratteri_per_riga_max": 42, "corpo_px": 14, "interlinea": 1.29}` | R20 |
| `{"caratteri_per_riga_max": 104, "corpo_px": 18, "interlinea": 1.5}` | R21 |
| `{"caratteri_per_riga_max": 87, "corpo_px": 16, "interlinea": 1.7}` | R22 |
| `{"corpo_px": 18, "interlinea": 1.56}` | R50 |
| `{"corpo_px": 20, "interlinea": 1.4}` | R52 |

### richieste e terze parti · arrivo computer

Presenti 13/13; varianti distinte: 13.

| Valore misurato o categoria | Siti |
|---|---|
| `{"domini_di_terzi": 10, "kb": 19057, "richieste": 65}` | R01 |
| `{"domini_di_terzi": 4, "kb": 11244, "richieste": 51}` | R02 |
| `{"domini_di_terzi": 11, "kb": 6940, "richieste": 192}` | R03 |
| `{"domini_di_terzi": 3, "kb": 1582, "richieste": 82}` | R04 |
| `{"caratteri_caricati": 4, "domini_di_terzi": 3, "richieste": 250}` | R05 |
| `{"caratteri_caricati": 8, "domini_di_terzi": 4, "kb": 9915, "richieste": 76}` | R06 |
| `{"caratteri_caricati": 4, "domini_di_terzi": 2, "kb": 7812, "richieste": 124}` | R20 |
| `{"caratteri_caricati": 6, "domini_di_terzi": 8, "kb": 941, "richieste": 49}` | R21 |
| `{"caratteri_caricati": 10, "domini_di_terzi": 3, "kb": 8548, "richieste": 63}` | R22 |
| `{"caratteri_caricati": 7, "domini_di_terzi": 2, "kb": 445, "richieste": 50}` | R50 |
| `{"caratteri_caricati": 2, "domini_di_terzi": 3, "kb": 515, "richieste": 26}` | R51 |
| `{"caratteri_caricati": 3, "domini_di_terzi": 3, "kb": 4368, "richieste": 65}` | R52 |
| `{"caratteri_caricati": 4, "domini_di_terzi": 15, "kb": 13618, "richieste": 65}` | R53 |

### anteprima del collegamento · arrivo computer

Presenti 13/13; varianti distinte: 2.

| Valore misurato o categoria | Siti |
|---|---|
| `{"descrizione": "sì", "immagine": "sì", "titolo": "sì"}` | R02, R03, R04, R05, R20, R21, R22, R50, R51, R52, R53 |
| `{"descrizione": "sì", "immagine": "no", "titolo": "sì"}` | R01, R06 |

### stampa · stampa

Presenti 13/13; varianti distinte: 4.

| Valore misurato o categoria | Siti |
|---|---|
| `{"comandi_inutili_nascosti": "no", "leggibile": "no"}` | R01, R05, R06, R53 |
| `{"comandi_inutili_nascosti": "no"}` | R02, R03, R20, R21 |
| `{"comandi_inutili_nascosti": "no", "leggibile": "sì"}` | R04, R50, R51, R52 |
| `{"pagine_pdf": 21}` | R22 |

### chi c'è dietro e le fonti · fiducia

Presenti 13/13; varianti distinte: 7.

| Valore misurato o categoria | Siti |
|---|---|
| `{"data": "sì", "firma": "sì", "fonti_collegate": "sì", "versione": "no"}` | R02, R04, R06, R21, R22 |
| `{"data": "no", "firma": "sì", "fonti_collegate": "sì", "versione": "no"}` | R01, R53 |
| `{"data": "no", "firma": "sì", "fonti_collegate": "no", "versione": "no"}` | R20, R52 |
| `{"data": "no", "firma": "sì", "fonti_collegate": "sì", "versione": "sì"}` | R03 |
| `{"data": "sì", "firma": "sì", "fonti_collegate": "no", "versione": "sì"}` | R05 |
| `{"data": "sì", "firma": "sì", "fonti_collegate": "sì", "versione": "sì"}` | R50 |
| `{"data": "no", "firma": "sì", "fonti_collegate": "no", "versione": "sì"}` | R51 |

## 4. Tutte le righe

Una riga = una caratteristica in un ambito. «P» presenti, «A» assenti con prova, «N» non osservati; «var» = varianti distinte tra i presenti. Esito: **comune** (13/13 presenti), **parziale** (2-12 presenti), **singolare** (1 presente), **solo assenze**.

| Caratteristica | Ambito | P | A | N | var | Esito | Presenti |
|---|---|---|---|---|---|---|---|
| albero di accessibilità (proxy) | arrivo computer | 13 | 0 | 0 | 13 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| anteprima del collegamento | arrivo computer | 13 | 0 | 0 | 2 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| apertura del menu | menu computer | 2 | 0 | 11 | 2 | parziale | R04, R05 |
| apertura del menu | menu telefono | 8 | 0 | 5 | 7 | parziale | R02, R04, R05, R20, R21, R50, R51, R52 |
| attesa del caricamento | rete lenta | 13 | 0 | 0 | 11 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| avvertenza sui contenuti con uscita rapida | arrivo computer | 1 | 0 | 12 | 1 | singolare | R06 |
| avvio di audio e video | media | 8 | 4 | 1 | 7 | parziale | R02, R03, R04, R05, R06, R50, R51, R53 |
| bersagli dei comandi principali | arrivo computer | 12 | 0 | 1 | 11 | parziale | R01, R02, R03, R04, R05, R06, R20, R21, R50, R51, R52, R53 |
| bersagli dei comandi principali | arrivo telefono | 13 | 0 | 0 | 12 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| bersagli dei comandi principali | percorso principale · passo 2 telefono | 1 | 0 | 12 | 1 | singolare | R01 |
| campione di suono | media | 3 | 9 | 1 | 3 | parziale | R03, R05, R51 |
| chi c'è dietro e le fonti | fiducia | 13 | 0 | 0 | 7 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| comandi da copiare | installazione | 1 | 1 | 11 | 1 | singolare | R50 |
| comandi visibili al primo schermo | arrivo computer | 13 | 0 | 0 | 12 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| comandi visibili al primo schermo | arrivo telefono | 13 | 0 | 0 | 13 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| comando principale | arrivo computer | 10 | 3 | 0 | 5 | parziale | R01, R03, R04, R05, R06, R20, R50, R51, R52, R53 |
| comando principale | arrivo telefono | 10 | 2 | 1 | 4 | parziale | R01, R03, R04, R05, R06, R20, R50, R51, R52, R53 |
| comando proprio «indietro» | percorso principale | 4 | 1 | 8 | 1 | parziale | R01, R03, R20, R21 |
| comportamento senza JavaScript | senza JavaScript | 13 | 0 | 0 | 8 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| compromessi dichiarati nelle opzioni | aiuto | 1 | 1 | 11 | 1 | singolare | R05 |
| corto subito, lungo a richiesta | aiuto | 9 | 0 | 4 | 4 | parziale | R01, R04, R05, R06, R22, R50, R51, R52, R53 |
| corto subito, lungo a richiesta | percorso principale | 5 | 0 | 8 | 3 | parziale | R04, R05, R20, R21, R22 |
| effetti con movimento ridotto | movimento ridotto | 13 | 0 | 0 | 10 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| effetto o animazione | arrivo computer · M01 Banner dei cookie: ingresso e uscita | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | arrivo computer · M01 Scheletri che pulsano (attesa del widget e dei prezzi) | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | arrivo computer · M01 Soglia: comparsa del testo e dei bottoni | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | arrivo computer · M02 Scelta del suono: uscita della soglia | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | arrivo computer · M02 Spinner di attesa | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | arrivo computer · M03 Dialogo cookie (Cookiebot) | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | arrivo computer · banner cookie | 1 | 0 | 12 | 1 | singolare | R03 |
| effetto o animazione | arrivo computer · caricamento mano e lettere | 1 | 0 | 12 | 1 | singolare | R01 |
| effetto o animazione | arrivo computer · colore dei collegamenti | 1 | 0 | 12 | 1 | singolare | R51 |
| effetto o animazione | arrivo computer · contenuto del hero | 1 | 0 | 12 | 1 | singolare | R02 |
| effetto o animazione | arrivo computer · cross-fade della bandiera UK/IE | 1 | 0 | 12 | 1 | singolare | R52 |
| effetto o animazione | arrivo computer · entrata della finestra del consenso | 1 | 0 | 12 | 1 | singolare | R53 |
| effetto o animazione | arrivo computer · grana | 1 | 0 | 12 | 1 | singolare | R03 |
| effetto o animazione | arrivo computer · hover pulsante | 2 | 0 | 11 | 2 | parziale | R01, R03 |
| effetto o animazione | arrivo computer · intro | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | arrivo computer · pulsazione del pulsante Play | 1 | 0 | 12 | 1 | singolare | R50 |
| effetto o animazione | arrivo computer · scorrimento del carosello | 1 | 0 | 12 | 1 | singolare | R52 |
| effetto o animazione | arrivo computer · sfondi uovo e nido | 1 | 0 | 12 | 1 | singolare | R22 |
| effetto o animazione | arrivo computer · sfondo del hero | 1 | 0 | 12 | 1 | singolare | R02 |
| effetto o animazione | arrivo computer · uccelli del titolo | 1 | 0 | 12 | 1 | singolare | R22 |
| effetto o animazione | arrivo telefono · M08 Ingresso nel capitolo (telefono) | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | arrivo telefono · icone del menu | 1 | 0 | 12 | 1 | singolare | R21 |
| effetto o animazione | arrivo telefono · intro | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | dati · mappa degli Stati | 1 | 0 | 12 | 1 | singolare | R22 |
| effetto o animazione | errore · finestra di ricerca | 1 | 0 | 12 | 1 | singolare | R51 |
| effetto o animazione | media · riquadro del video (lightbox) | 1 | 0 | 12 | 1 | singolare | R53 |
| effetto o animazione | menu computer · M05 Menu a comparsa (computer) | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | menu computer · M05 Voci di intestazione a pillola | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | menu computer · M06 Pannello di ricerca | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | menu computer · M07 Menu «Products» (computer) | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | menu computer · M08 Tendina «Download for…» (app) | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | menu computer · cambio tema chiaro/scuro | 1 | 0 | 12 | 1 | singolare | R52 |
| effetto o animazione | menu computer · pannello Destinations | 1 | 0 | 12 | 1 | singolare | R21 |
| effetto o animazione | menu computer · pannello Products | 1 | 0 | 12 | 1 | singolare | R51 |
| effetto o animazione | menu computer · pannello Solutions | 1 | 0 | 12 | 1 | singolare | R50 |
| effetto o animazione | menu computer · sottomenu Products | 1 | 0 | 12 | 1 | singolare | R52 |
| effetto o animazione | menu telefono · M07 Menu a tutto schermo (telefono) | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | menu telefono · M09 Menu a pannello (telefono) | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | menu telefono · apertura del pannello | 1 | 0 | 12 | 1 | singolare | R21 |
| effetto o animazione | menu telefono · apertura isola | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | menu telefono · pannello | 1 | 0 | 12 | 1 | singolare | R02 |
| effetto o animazione | menu telefono · pannello del menu | 2 | 0 | 11 | 2 | parziale | R51, R52 |
| effetto o animazione | menu telefono · velo e voci del menu | 1 | 0 | 12 | 1 | singolare | R50 |
| effetto o animazione | percorso principale · M04 Scena d'ingresso: treno, luci, nuvole, carte | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | percorso principale · M05 Frecce Previous/Next | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | percorso principale · M06 Riquadri promozionali | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | percorso principale · M07 Barrette dell'interruttore del suono | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | percorso principale · M08 Finestra modale del video | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | percorso principale · M09 Aperture «+/–» (accordion) | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | percorso principale · M10 Finestra «Settings» | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | percorso principale · M10 Pannello di avvertenza: comparsa con ritardo | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | percorso principale · M11 Stato del widget | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | percorso principale · M11 Suono | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | percorso principale · M12 Grafici e tooltip dell'hub | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | percorso principale · M12 Riproduttore degli stem | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | percorso principale · M13 Accordion della FAQ | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | percorso principale · M13 Elenco «Download Data» | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | percorso principale · M14 Passaggio fra pagine (vista di documento) | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | percorso principale · M15 Illustrazione dei tre sistemi (Apps & Plugins) | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | percorso principale · M15 Pagina aggiornamenti («Waymo is coming soon to your city») | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | percorso principale · M16 Anello di focus e stati di tocco | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | percorso principale · Search | 1 | 0 | 12 | 1 | singolare | R01 |
| effetto o animazione | percorso principale · apertura About | 1 | 0 | 12 | 1 | singolare | R01 |
| effetto o animazione | percorso principale · apertura del riquadro voce | 1 | 0 | 12 | 1 | singolare | R03 |
| effetto o animazione | percorso principale · apertura di una domanda FAQ | 2 | 0 | 11 | 2 | parziale | R50, R53 |
| effetto o animazione | percorso principale · apertura di «Full history» | 1 | 0 | 12 | 1 | singolare | R50 |
| effetto o animazione | percorso principale · apertura isola (computer) | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | percorso principale · apertura pagina Info | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | percorso principale · apertura progetto | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | percorso principale · assistente | 1 | 0 | 12 | 1 | singolare | R22 |
| effetto o animazione | percorso principale · cambio categoria | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | percorso principale · chiusura progetto | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | percorso principale · clic sul comando | 1 | 0 | 12 | 1 | singolare | R01 |
| effetto o animazione | percorso principale · condivisione | 1 | 0 | 12 | 1 | singolare | R21 |
| effetto o animazione | percorso principale · consenso e annulla | 1 | 0 | 12 | 1 | singolare | R03 |
| effetto o animazione | percorso principale · finestra di ingrandimento della galleria | 1 | 0 | 12 | 1 | singolare | R50 |
| effetto o animazione | percorso principale · focus da tastiera | 1 | 0 | 12 | 1 | singolare | R21 |
| effetto o animazione | percorso principale · hover carta | 1 | 0 | 12 | 1 | singolare | R01 |
| effetto o animazione | percorso principale · passaggio sull'immagine | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | percorso principale · prossimo progetto | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | percorso principale · ricerca di un uccello | 1 | 0 | 12 | 1 | singolare | R22 |
| effetto o animazione | percorso principale · scorrimento morbido | 1 | 0 | 12 | 1 | singolare | R22 |
| effetto o animazione | scorrimento computer | 0 | 2 | 11 | 0 | solo assenze |  |
| effetto o animazione | scorrimento computer · M02 Entrata allo scorrimento (reveal) con scalare | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | scorrimento computer · M03 Conteggio dei numeri e crescita delle barre | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | scorrimento computer · M03 La porta che si apre (entrata nella scena) | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | scorrimento computer · M04 Intestazione che si compatta | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | scorrimento computer · M04 Intestazione guidata dalla direzione di scorrimento | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | scorrimento computer · M06 Voci e logo dell'intestazione | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | scorrimento computer · M09 Scorrimento (Lenis) | 1 | 0 | 12 | 1 | singolare | R06 |
| effetto o animazione | scorrimento computer · M10 Carosello a scorrimento | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | scorrimento computer · M11 Hub: scambio di pannelli con scorrimento laterale | 1 | 0 | 12 | 1 | singolare | R04 |
| effetto o animazione | scorrimento computer · M14 Indicatore di scheda della FAQ | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | scorrimento computer · M16 Pulsante di scarico fisso e sovrapposizione | 1 | 0 | 12 | 1 | singolare | R05 |
| effetto o animazione | scorrimento computer · anello di focus dei pulsanti voce | 1 | 0 | 12 | 1 | singolare | R51 |
| effetto o animazione | scorrimento computer · barra di prodotto fissa | 1 | 0 | 12 | 1 | singolare | R51 |
| effetto o animazione | scorrimento computer · bordo dei collegamenti LinkedIn | 1 | 0 | 12 | 1 | singolare | R53 |
| effetto o animazione | scorrimento computer · cambio scheda dei casi d'uso | 1 | 0 | 12 | 1 | singolare | R03 |
| effetto o animazione | scorrimento computer · comparsa delle sezioni | 1 | 0 | 12 | 1 | singolare | R52 |
| effetto o animazione | scorrimento computer · comparse di sezione guidate da JS | 1 | 0 | 12 | 1 | singolare | R53 |
| effetto o animazione | scorrimento computer · cursore | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | scorrimento computer · dissolvenza del hero | 1 | 0 | 12 | 1 | singolare | R02 |
| effetto o animazione | scorrimento computer · elenco progetti | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | scorrimento computer · grafico «Waves of Interest» | 1 | 0 | 12 | 1 | singolare | R22 |
| effetto o animazione | scorrimento computer · ingrandimento di una schermata della galleria | 1 | 0 | 12 | 1 | singolare | R50 |
| effetto o animazione | scorrimento computer · link nel testo | 1 | 0 | 12 | 1 | singolare | R21 |
| effetto o animazione | scorrimento computer · navigazione fissa | 1 | 0 | 12 | 1 | singolare | R03 |
| effetto o animazione | scorrimento computer · ombra della barra fissa | 1 | 0 | 12 | 1 | singolare | R50 |
| effetto o animazione | scorrimento computer · ombra delle schede | 1 | 0 | 12 | 1 | singolare | R50 |
| effetto o animazione | scorrimento computer · pagina Info | 1 | 0 | 12 | 1 | singolare | R20 |
| effetto o animazione | scorrimento computer · pagina in generale | 1 | 0 | 12 | 1 | singolare | R02 |
| effetto o animazione | scorrimento computer · puntini di digitazione | 1 | 0 | 12 | 1 | singolare | R03 |
| effetto o animazione | scorrimento computer · schede iOS / macOS | 1 | 0 | 12 | 1 | singolare | R51 |
| effetto o animazione | scorrimento computer · tessera di categoria | 1 | 0 | 12 | 1 | singolare | R02 |
| effetto o animazione | scorrimento computer · uovo e nido | 1 | 0 | 12 | 1 | singolare | R22 |
| effetto o animazione | scorrimento computer · video di sottofondo in ciclo | 1 | 0 | 12 | 1 | singolare | R53 |
| effetto o animazione | scorrimento telefono · elenco progetti | 1 | 0 | 12 | 1 | singolare | R20 |
| finestra del consenso ai cookie | arrivo computer | 1 | 3 | 9 | 1 | singolare | R53 |
| finestra del consenso ai cookie | arrivo telefono | 1 | 0 | 12 | 1 | singolare | R53 |
| guida a passi con ripresa | installazione | 2 | 1 | 10 | 2 | parziale | R05, R50 |
| lunghezza e registro delle frasi | aiuto | 2 | 0 | 11 | 2 | parziale | R05, R06 |
| lunghezza e registro delle frasi | arrivo computer | 11 | 0 | 2 | 11 | parziale | R01, R02, R03, R04, R05, R21, R22, R50, R51, R52, R53 |
| lunghezza e registro delle frasi | arrivo computer · pagina Info | 1 | 0 | 12 | 1 | singolare | R20 |
| media non caricato | media | 5 | 0 | 8 | 1 | parziale | R21, R50, R51, R52, R53 |
| messaggio di errore | errore | 1 | 1 | 11 | 1 | singolare | R22 |
| messaggio di errore | errore · ricerca senza risultati | 2 | 0 | 11 | 2 | parziale | R51, R52 |
| numeri detti a parole | dati | 5 | 3 | 5 | 1 | parziale | R04, R21, R22, R51, R53 |
| pagina inesistente | 404 | 13 | 0 | 0 | 4 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| percorso da tastiera | tastiera | 13 | 0 | 0 | 12 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| porte per pubblici diversi | arrivo computer | 4 | 5 | 4 | 4 | parziale | R03, R06, R20, R21 |
| porte per pubblici diversi | arrivo computer · dopo il primo comando | 1 | 0 | 12 | 1 | singolare | R01 |
| porte per pubblici diversi | menu computer | 3 | 0 | 10 | 3 | parziale | R05, R51, R52 |
| prodotto mostrato | arrivo computer | 10 | 0 | 3 | 10 | parziale | R01, R02, R03, R04, R05, R06, R50, R51, R52, R53 |
| prodotto mostrato | scorrimento computer | 9 | 0 | 4 | 7 | parziale | R02, R03, R20, R21, R22, R50, R51, R52, R53 |
| prodotto mostrato | scorrimento telefono | 5 | 0 | 8 | 4 | parziale | R20, R21, R22, R50, R51 |
| proposta del primo schermo | arrivo computer | 13 | 0 | 0 | 13 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| proposta del primo schermo | arrivo telefono | 12 | 1 | 0 | 12 | parziale | R01, R02, R03, R04, R05, R06, R21, R22, R50, R51, R52, R53 |
| richieste e terze parti | arrivo computer | 13 | 0 | 0 | 13 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| scelta del suono prima di entrare | media | 1 | 0 | 12 | 1 | singolare | R06 |
| scelta per sistema o versione | installazione | 2 | 0 | 11 | 2 | parziale | R05, R50 |
| segnale di posizione e di avanzamento | percorso principale | 3 | 3 | 7 | 2 | parziale | R21, R50, R52 |
| segnale di posizione e di avanzamento | percorso principale · progetto | 1 | 0 | 12 | 1 | singolare | R20 |
| segnale di posizione e di avanzamento | scorrimento computer | 2 | 6 | 5 | 1 | parziale | R20, R22 |
| sovrapposizione di messaggi al primo arrivo | arrivo telefono | 1 | 0 | 12 | 1 | singolare | R05 |
| stampa | stampa | 13 | 0 | 0 | 4 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| stato e limiti dichiarati | arrivo computer | 4 | 3 | 6 | 2 | parziale | R04, R05, R06, R50 |
| stato e limiti dichiarati | fiducia | 10 | 1 | 2 | 2 | parziale | R01, R02, R04, R05, R06, R21, R22, R50, R51, R53 |
| struttura della navigazione | menu computer | 11 | 2 | 0 | 6 | parziale | R01, R02, R03, R04, R05, R06, R20, R21, R50, R51, R52 |
| struttura della navigazione | menu telefono | 9 | 2 | 2 | 6 | parziale | R01, R02, R04, R05, R20, R21, R50, R51, R52 |
| tabella di compatibilità | aiuto | 0 | 1 | 12 | 0 | solo assenze |  |
| tabella di compatibilità | dati | 1 | 4 | 8 | 1 | singolare | R51 |
| tema scelto dalla persona | menu computer | 1 | 0 | 12 | 1 | singolare | R52 |
| tenuta con colori forzati | arrivo computer | 3 | 0 | 10 | 2 | parziale | R01, R02, R03 |
| testimonianze di utenti | fiducia | 4 | 0 | 9 | 4 | parziale | R50, R51, R52, R53 |
| testo al 200% | testo 200% | 13 | 0 | 0 | 4 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| testo al 200% | testo 200% · zoom | 2 | 0 | 11 | 1 | parziale | R05, R06 |
| testo corrente | arrivo computer | 13 | 0 | 0 | 12 | comune | R01, R02, R03, R04, R05, R06, R20, R21, R22, R50, R51, R52, R53 |
| testo corrente | arrivo computer · pagina Info | 1 | 0 | 12 | 1 | singolare | R20 |
| testo corrente | arrivo telefono | 12 | 0 | 1 | 10 | parziale | R01, R02, R03, R04, R05, R06, R21, R22, R50, R51, R52, R53 |
| zoom al 200% | testo 200% | 3 | 0 | 10 | 2 | parziale | R01, R02, R03 |
| zoom della pagina consentito dal meta viewport | arrivo telefono | 3 | 0 | 10 | 2 | parziale | R01, R02, R03 |

## 5. Varianti delle righe parziali (2 o più siti presenti)

### apertura del menu · menu computer

Presenti: R04, R05. Assenti con prova: —. Non osservati: 11.

| Valore | Siti |
|---|---|
| `{"curva": "ease", "direzione": "altezza da 0 a 248 px", "durata_ms": 150}` | R04 |
| `{"curva": "ease", "direzione": "nessuna (dissolvenza)", "durata_ms": 200}` | R05 |

### apertura del menu · menu telefono

Presenti: R02, R04, R05, R20, R21, R50, R51, R52. Assenti con prova: —. Non osservati: 5.

| Valore | Siti |
|---|---|
| `{"direzione": "da destra", "durata_ms": 300}` | R50, R51 |
| `{"curva": "cubic-bezier(0.785, 0.135, 0.15, 0.86)", "direzione": "da destra", "durata_ms": 600}` | R02 |
| `{"curva": "ease", "direzione": "altezza da 0 a 852 px", "durata_ms": 250}` | R04 |
| `{"curva": "ease", "direzione": "nessuna (dissolvenza con ombra)", "durata_ms": 200}` | R05 |
| `{"direzione": "in larghezza dal basso al centro", "durata_ms": 503}` | R20 |
| `{"direzione": "da destra", "durata_ms": 180}` | R21 |
| `{"direzione": "da destra", "durata_ms": 500}` | R52 |

### avvio di audio e video · media

Presenti: R02, R03, R04, R05, R06, R50, R51, R53. Assenti con prova: R01, R20, R21, R22. Non osservati: 1.

| Valore | Siti |
|---|---|
| `{"avvio_automatico": "no"}` | R04, R06 |
| `{"avvio_automatico": "no", "controlli_nativi": "sì"}` | R02 |
| `{"avvio_automatico": "sì", "controlli_nativi": "no", "sottotitoli": "sì", "trascrizione": "sì"}` | R03 |
| `{"avvio_automatico": "no", "controlli_nativi": "no", "trascrizione": "no"}` | R05 |
| `{"avvio_automatico": "no", "controlli_nativi": "sì", "sottotitoli": "no", "trascrizione": "no"}` | R50 |
| `{"avvio_automatico": "no", "controlli_nativi": "sì", "sottotitoli": "sì", "trascrizione": "no"}` | R51 |
| `{"avvio_automatico": "sì", "controlli_nativi": "no", "sottotitoli": "no", "trascrizione": "no"}` | R53 |

### bersagli dei comandi principali · arrivo computer

Presenti: R01, R02, R03, R04, R05, R06, R20, R21, R50, R51, R52, R53. Assenti con prova: —. Non osservati: 1.

| Valore | Siti |
|---|---|
| `{"altezza_min_px": 12, "larghezza_min_px": 12}` | R05, R52 |
| `{"altezza_min_px": 56, "larghezza_min_px": 170}` | R01 |
| `{"altezza_min_px": 60, "distanza_min_px": 4, "larghezza_min_px": 38}` | R02 |
| `{"altezza_min_px": 23, "distanza_min_px": 0, "larghezza_min_px": 32}` | R03 |
| `{"altezza_min_px": 16, "larghezza_min_px": 20}` | R04 |
| `{"altezza_min_px": 16, "larghezza_min_px": 62}` | R06 |
| `{"altezza_min_px": 18, "distanza_min_px": 196, "larghezza_min_px": 169}` | R20 |
| `{"altezza_min_px": 14, "distanza_min_px": 0, "larghezza_min_px": 14}` | R21 |
| `{"altezza_min_px": 16, "larghezza_min_px": 16}` | R50 |
| `{"altezza_min_px": 16, "larghezza_min_px": 24}` | R51 |
| `{"altezza_min_px": 15, "larghezza_min_px": 48}` | R53 |

### campione di suono · media

Presenti: R03, R05, R51. Assenti con prova: R01, R02, R04, R20, R21, R22, R50, R52, R53. Non osservati: 1.

| Valore | Siti |
|---|---|
| `{"campioni": 4, "testo_accanto": "sì"}` | R03 |
| `{"campioni": 8, "durata_indicata": "no", "simultanei_max": 1, "testo_accanto": "no"}` | R05 |
| `{"campioni": 4, "durata_indicata": "no", "testo_accanto": "no"}` | R51 |

### comando principale · arrivo computer

Presenti: R01, R03, R04, R05, R06, R20, R50, R51, R52, R53. Assenti con prova: R02, R21, R22. Non osservati: 0.

| Valore | Siti |
|---|---|
| `{"fisso_allo_scorrimento": "no", "posizione": "basso"}` | R04, R52, R53 |
| `{"fisso_allo_scorrimento": "no", "posizione": "centro"}` | R05, R06, R50 |
| `{"fisso_allo_scorrimento": "sì", "posizione": "basso"}` | R20, R51 |
| `{"posizione": "centro"}` | R01 |
| `{"fisso_allo_scorrimento": "sì", "posizione": "centro"}` | R03 |

### comando principale · arrivo telefono

Presenti: R01, R03, R04, R05, R06, R20, R50, R51, R52, R53. Assenti con prova: R02, R21. Non osservati: 1.

| Valore | Siti |
|---|---|
| `{"fisso_allo_scorrimento": "no", "posizione": "centro"}` | R05, R06, R50, R53 |
| `{"posizione": "centro"}` | R01, R03 |
| `{"fisso_allo_scorrimento": "no", "posizione": "basso"}` | R04, R52 |
| `{"fisso_allo_scorrimento": "sì", "posizione": "basso"}` | R20, R51 |

### comando proprio «indietro» · percorso principale

Presenti: R01, R03, R20, R21. Assenti con prova: R02. Non osservati: 8.

| Valore | Siti |
|---|---|
| `{"presente": "sì"}` | R01, R03, R20, R21 |

### corto subito, lungo a richiesta · aiuto

Presenti: R01, R04, R05, R06, R22, R50, R51, R52, R53. Assenti con prova: —. Non osservati: 4.

| Valore | Siti |
|---|---|
| `{"meccanismo": "apertura"}` | R04, R05, R50, R53 |
| `{"meccanismo": "pagina_a_parte"}` | R06, R51, R52 |
| `{"meccanismo": "finestra"}` | R01 |
| `{"meccanismo": "suggerimento"}` | R22 |

### corto subito, lungo a richiesta · percorso principale

Presenti: R04, R05, R20, R21, R22. Assenti con prova: —. Non osservati: 8.

| Valore | Siti |
|---|---|
| `{"meccanismo": "finestra"}` | R05, R22 |
| `{"meccanismo": "nessuno"}` | R20, R21 |
| `{"meccanismo": "apertura"}` | R04 |

### effetto o animazione · arrivo computer · hover pulsante

Presenti: R01, R03. Assenti con prova: —. Non osservati: 11.

| Valore | Siti |
|---|---|
| `{"durata_ms": 280, "proprieta": ["width", "background-color", "border-color", "transform", "opacity"], "trigger": "passaggio"}` | R01 |
| `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 150, "proprieta": ["background-color"], "trigger": "passaggio"}` | R03 |

### effetto o animazione · menu telefono · pannello del menu

Presenti: R51, R52. Assenti con prova: —. Non osservati: 11.

| Valore | Siti |
|---|---|
| `{"curva": "ease-in-out", "durata_ms": 300, "proprieta": "transform translate(100%)→none + velo opacity 0→0,9", "trigger": "tocco"}` | R51 |
| `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 500, "proprieta": "transform translate(100%)→0", "trigger": "tocco"}` | R52 |

### effetto o animazione · percorso principale · apertura di una domanda FAQ

Presenti: R50, R53. Assenti con prova: —. Non osservati: 11.

| Valore | Siti |
|---|---|
| `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 200, "proprieta": "grid-template-rows + rotate 180°", "trigger": "clic"}` | R50 |
| `{"proprieta": "height 0→auto + rotazione dell'indicatore", "trigger": "clic"}` | R53 |

### guida a passi con ripresa · installazione

Presenti: R05, R50. Assenti con prova: R53. Non osservati: 10.

| Valore | Siti |
|---|---|
| `{"indicatore": "no", "passi": 4}` | R05 |
| `{"indicatore": "sì", "indietro": "no", "passi": 4, "ripresa_dopo_chiusura": "no"}` | R50 |

### lunghezza e registro delle frasi · aiuto

Presenti: R05, R06. Assenti con prova: —. Non osservati: 11.

| Valore | Siti |
|---|---|
| `{"frasi_campione": 10, "parole_per_frase_media": 20.6, "persona": "mista"}` | R05 |
| `{"frasi_campione": 10, "parole_per_frase_media": 20.5, "persona": "prima"}` | R06 |

### lunghezza e registro delle frasi · arrivo computer

Presenti: R01, R02, R03, R04, R05, R21, R22, R50, R51, R52, R53. Assenti con prova: —. Non osservati: 2.

| Valore | Siti |
|---|---|
| `{"frasi_campione": 2, "parole_per_frase_media": 11.5, "persona": "seconda"}` | R01 |
| `{"frasi_campione": 2, "parole_per_frase_media": 4, "persona": "seconda"}` | R02 |
| `{"frasi_campione": 1, "parole_per_frase_media": 21, "persona": "terza"}` | R03 |
| `{"frasi_campione": 10, "parole_per_frase_media": 20.9, "persona": "mista"}` | R04 |
| `{"frasi_campione": 10, "parole_per_frase_media": 13.3, "persona": "mista"}` | R05 |
| `{"frasi_campione": 10, "parole_per_frase_media": 21.6, "persona": "mista"}` | R21 |
| `{"frasi_campione": 9, "parole_per_frase_media": 20.1, "persona": "mista"}` | R22 |
| `{"frasi_campione": 10, "parole_per_frase_media": 16.4, "persona": "seconda"}` | R50 |
| `{"frasi_campione": 10, "parole_per_frase_media": 16.3, "persona": "mista"}` | R51 |
| `{"frasi_campione": 10, "parole_per_frase_media": 14.8, "persona": "mista"}` | R52 |
| `{"frasi_campione": 10, "parole_per_frase_media": 15, "persona": "terza"}` | R53 |

### media non caricato · media

Presenti: R21, R50, R51, R52, R53. Assenti con prova: —. Non osservati: 8.

| Valore | Siti |
|---|---|
| `{"alternativa_testuale": "sì", "pagina_integra": "sì"}` | R21, R50, R51, R52, R53 |

### messaggio di errore · errore · ricerca senza risultati

Presenti: R51, R52. Assenti con prova: —. Non osservati: 11.

| Valore | Siti |
|---|---|
| `{"dice_come_rimediare": "no", "mantiene_i_dati": "sì", "sotto_il_campo": "sì"}` | R51 |
| `{"dice_come_rimediare": "sì", "mantiene_i_dati": "sì", "sotto_il_campo": "sì"}` | R52 |

### numeri detti a parole · dati

Presenti: R04, R21, R22, R51, R53. Assenti con prova: R05, R50, R52. Non osservati: 5.

| Valore | Siti |
|---|---|
| `{"presente": "sì"}` | R04, R21, R22, R51, R53 |

### porte per pubblici diversi · arrivo computer

Presenti: R03, R06, R20, R21. Assenti con prova: R02, R04, R22, R50, R53. Non osservati: 4.

| Valore | Siti |
|---|---|
| `{"criterio": "compito", "porte": 2}` | R03 |
| `{"criterio": "ruolo", "porte": 3}` | R06 |
| `{"criterio": "argomento", "porte": 4}` | R20 |
| `{"criterio": "argomento", "porte": 6}` | R21 |

### porte per pubblici diversi · menu computer

Presenti: R05, R51, R52. Assenti con prova: —. Non osservati: 10.

| Valore | Siti |
|---|---|
| `{"criterio": "compito", "porte": 7}` | R05 |
| `{"criterio": "argomento", "porte": 3}` | R51 |
| `{"criterio": "compito", "porte": 5}` | R52 |

### prodotto mostrato · arrivo computer

Presenti: R01, R02, R03, R04, R05, R06, R50, R51, R52, R53. Assenti con prova: —. Non osservati: 3.

| Valore | Siti |
|---|---|
| `{"con_alternativa": "no", "con_legenda": "no", "tipo": "dimostrazione_viva"}` | R01 |
| `{"con_alternativa": "no", "con_legenda": "no", "tipo": "foto"}` | R02 |
| `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "video"}` | R03 |
| `{"con_alternativa": "sì", "con_legenda": "sì", "tipo": "foto"}` | R04 |
| `{"con_legenda": "sì", "tipo": "dimostrazione_viva"}` | R05 |
| `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "illustrazione"}` | R06 |
| `{"con_alternativa": "sì", "con_legenda": "no", "tipo": "video"}` | R50 |
| `{"con_alternativa": "sì", "con_legenda": "no", "tipo": "foto"}` | R51 |
| `{"con_legenda": "no", "tipo": "schermata"}` | R52 |
| `{"con_legenda": "no", "tipo": "illustrazione"}` | R53 |

### prodotto mostrato · scorrimento computer

Presenti: R02, R03, R20, R21, R22, R50, R51, R52, R53. Assenti con prova: —. Non osservati: 4.

| Valore | Siti |
|---|---|
| `{"con_alternativa": "sì", "con_legenda": "sì", "tipo": "foto"}` | R02, R21 |
| `{"con_alternativa": "sì", "con_legenda": "sì", "tipo": "schermata"}` | R50, R51 |
| `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "schermata"}` | R03 |
| `{"con_alternativa": "no", "con_legenda": "no", "tipo": "foto"}` | R20 |
| `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "dimostrazione_viva"}` | R22 |
| `{"con_legenda": "no", "tipo": "schermata"}` | R52 |
| `{"con_alternativa": "no", "con_legenda": "no", "tipo": "video"}` | R53 |

### prodotto mostrato · scorrimento telefono

Presenti: R20, R21, R22, R50, R51. Assenti con prova: —. Non osservati: 8.

| Valore | Siti |
|---|---|
| `{"con_alternativa": "sì", "con_legenda": "sì", "tipo": "schermata"}` | R50, R51 |
| `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "foto"}` | R20 |
| `{"con_alternativa": "sì", "con_legenda": "sì", "tipo": "foto"}` | R21 |
| `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "dimostrazione_viva"}` | R22 |

### proposta del primo schermo · arrivo telefono

Presenti: R01, R02, R03, R04, R05, R06, R21, R22, R50, R51, R52, R53. Assenti con prova: R20. Non osservati: 0.

| Valore | Siti |
|---|---|
| `{"frasi": 2, "parole": 23}` | R01 |
| `{"frasi": 2, "parole": 8}` | R02 |
| `{"frasi": 1, "parole": 21}` | R03 |
| `{"frasi": 0, "parole": 4}` | R04 |
| `{"frasi": 3, "parole": 20}` | R05 |
| `{"frasi": 1, "parole": 35}` | R06 |
| `{"frasi": 1, "parole": 9}` | R21 |
| `{"frasi": 1, "parole": 3}` | R22 |
| `{"frasi": 3, "parole": 49}` | R50 |
| `{"frasi": 4, "parole": 57}` | R51 |
| `{"frasi": 4, "parole": 63}` | R52 |
| `{"frasi": 3, "parole": 42}` | R53 |

### scelta per sistema o versione · installazione

Presenti: R05, R50. Assenti con prova: —. Non osservati: 11.

| Valore | Siti |
|---|---|
| `{"modo": "automatico"}` | R05 |
| `{"modo": "manuale"}` | R50 |

### segnale di posizione e di avanzamento · percorso principale

Presenti: R21, R50, R52. Assenti con prova: R01, R02, R03. Non osservati: 7.

| Valore | Siti |
|---|---|
| `{"tipo": "indice"}` | R21, R52 |
| `{"tipo": "passi"}` | R50 |

### segnale di posizione e di avanzamento · scorrimento computer

Presenti: R20, R22. Assenti con prova: R04, R05, R50, R51, R52, R53. Non osservati: 5.

| Valore | Siti |
|---|---|
| `{"tipo": "indice"}` | R20, R22 |

### stato e limiti dichiarati · arrivo computer

Presenti: R04, R05, R06, R50. Assenti con prova: R51, R52, R53. Non osservati: 6.

| Valore | Siti |
|---|---|
| `{"presente": "no", "prima_della_promessa": "no"}` | R04, R05 |
| `{"presente": "sì", "prima_della_promessa": "no"}` | R06, R50 |

### stato e limiti dichiarati · fiducia

Presenti: R01, R02, R04, R05, R06, R21, R22, R50, R51, R53. Assenti con prova: R03. Non osservati: 2.

| Valore | Siti |
|---|---|
| `{"presente": "sì", "prima_della_promessa": "no"}` | R01, R02, R04, R05, R06, R50, R51, R53 |
| `{"presente": "sì", "prima_della_promessa": "sì"}` | R21, R22 |

### struttura della navigazione · menu computer

Presenti: R01, R02, R03, R04, R05, R06, R20, R21, R50, R51, R52. Assenti con prova: R22, R53. Non osservati: 0.

| Valore | Siti |
|---|---|
| `{"tipo": "menu_a_comparsa", "voci": 5}` | R50, R51, R52 |
| `{"tipo": "barra", "voci": 3}` | R02, R06 |
| `{"tipo": "menu_a_comparsa", "voci": 6}` | R04, R21 |
| `{"tipo": "menu_a_comparsa", "voci": 4}` | R05, R20 |
| `{"tipo": "pannello", "voci": 1}` | R01 |
| `{"tipo": "barra", "voci": 11}` | R03 |

### struttura della navigazione · menu telefono

Presenti: R01, R02, R04, R05, R20, R21, R50, R51, R52. Assenti con prova: R22, R53. Non osservati: 2.

| Valore | Siti |
|---|---|
| `{"tipo": "pannello", "voci": 6}` | R04, R05, R21 |
| `{"tipo": "pannello", "voci": 5}` | R51, R52 |
| `{"tipo": "pannello", "voci": 1}` | R01 |
| `{"tipo": "pannello", "voci": 3}` | R02 |
| `{"tipo": "menu_a_comparsa", "voci": 4}` | R20 |
| `{"tipo": "pannello", "voci": 7}` | R50 |

### tenuta con colori forzati · arrivo computer

Presenti: R01, R02, R03. Assenti con prova: —. Non osservati: 10.

| Valore | Siti |
|---|---|
| `{"elementi_scomparsi": "sì", "testo_leggibile": "sì"}` | R01, R03 |
| `{"elementi_scomparsi": "no", "testo_leggibile": "sì"}` | R02 |

### testimonianze di utenti · fiducia

Presenti: R50, R51, R52, R53. Assenti con prova: —. Non osservati: 9.

| Valore | Siti |
|---|---|
| `{"con_foto": "no", "con_ruolo": "sì", "numero": 1}` | R50 |
| `{"con_foto": "sì", "con_ruolo": "sì", "numero": 3}` | R51 |
| `{"con_foto": "sì", "con_ruolo": "no", "numero": 3}` | R52 |
| `{"con_foto": "sì", "con_ruolo": "sì", "numero": 11}` | R53 |

### testo al 200% · testo 200% · zoom

Presenti: R05, R06. Assenti con prova: —. Non osservati: 11.

| Valore | Siti |
|---|---|
| `{"contenuto_perso": "sì", "scroll_orizzontale": "no"}` | R05, R06 |

### testo corrente · arrivo telefono

Presenti: R01, R02, R03, R04, R05, R06, R21, R22, R50, R51, R52, R53. Assenti con prova: —. Non osservati: 1.

| Valore | Siti |
|---|---|
| `{"corpo_px": 16, "interlinea": 1.5}` | R04, R53 |
| `{"corpo_px": 18, "interlinea": 1.56}` | R50, R52 |
| `{"caratteri_per_riga_max": 43, "corpo_px": 14, "interlinea": 1.5}` | R01 |
| `{"caratteri_per_riga_max": 43, "corpo_px": 15, "interlinea": 1.75}` | R02 |
| `{"caratteri_per_riga_max": 38, "corpo_px": 16, "interlinea": 1.5}` | R03 |
| `{"corpo_px": 15, "interlinea": 1.6}` | R05 |
| `{"corpo_px": 21.3, "interlinea": 1.5}` | R06 |
| `{"caratteri_per_riga_max": 48, "corpo_px": 18, "interlinea": 1.5}` | R21 |
| `{"caratteri_per_riga_max": 76, "corpo_px": 16, "interlinea": 1.7}` | R22 |
| `{"corpo_px": 18, "interlinea": 1.5}` | R51 |

### zoom al 200% · testo 200%

Presenti: R01, R02, R03. Assenti con prova: —. Non osservati: 10.

| Valore | Siti |
|---|---|
| `{"contenuto_perso": "no", "scroll_orizzontale": "no"}` | R02, R03 |
| `{"contenuto_perso": "sì", "scroll_orizzontale": "no"}` | R01 |

### zoom della pagina consentito dal meta viewport · arrivo telefono

Presenti: R01, R02, R03. Assenti con prova: —. Non osservati: 10.

| Valore | Siti |
|---|---|
| `{"user_scalable": "sì"}` | R02, R03 |
| `{"maximum_scale": 1, "user_scalable": "no"}` | R01 |

## 6. Peculiarità per sito (varianti con un solo sito presente)

Ogni voce: caratteristica · ambito · valore · descrizione (abbreviata; il testo intero e le prove sono nel JSON). «Singolare fra le osservazioni disponibili» vale se la riga ha siti non osservati: non è unicità dimostrata.

### R01 · Signs (28 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 1, "immagini_senza_alternativa": 11, "punti_di_riferimento": 1, "titoli": 0}` — Proxy ariaSnapshot di Playwright, non un lettore di schermo. Solo il landmark main; nessun titolo. [prove/R01/misure/albero-accessibilita-R01.txt, prove/R01/misure/misure-R01.json]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 8.9, "segnale": "spinner"}` — 1,6 Mbit/s e 562 ms: 5 s di gradiente vuoto, poi la mano animata con «Loading»; il valore è il First Contentful Paint (8936 ms), con la macchina carica. [prove/R01/misure/rete-lenta-05s.jpg, prove/R01/misure/rete-lenta-10s.jpg]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 56, "larghezza_min_px": 170}` — Un solo bersaglio. [prove/R01/misure/primo-schermo-R01.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 56, "larghezza_min_px": 170}` — Un solo bersaglio. [prove/R01/misure/primo-schermo-R01.json]
- **bersagli dei comandi principali** · percorso principale · passo 2 telefono · `{"altezza_min_px": 30, "larghezza_min_px": 87}` — Carte 390x183; «About» 87x30 (430x932). [prove/R01/bersagli-scelta-mobile.json]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 0, "pulsanti": 1}` — Il solo comando è «Let's begin», un div con ruolo button. [prove/R01/misure/primo-schermo-R01.json, prove/R01/003-arrivo-desktop-dopo-attesa.jpg]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 0, "pulsanti": 1}` [prove/R01/misure/primo-schermo-R01.json, prove/R01/misure/telefono-390x844-dopo-tocco.png]
- **comando principale** · arrivo computer · `{"posizione": "centro"}` — Etichetta «Let's begin». La pagina non scorre, quindi il parametro «fisso allo scorrimento» non si applica. [prove/R01/003-arrivo-desktop-dopo-attesa.jpg]
- **corto subito, lungo a richiesta** · aiuto · `{"meccanismo": "finestra"}` — Frase corta e carte con tre righe subito; pannello About numerato (15 voci, 4328 px di scorrimento interno) a richiesta. [prove/R01/013-clic.jpg, prove/R01/015-scorri.jpg]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 2, "parole_per_frase_media": 11.5, "persona": "seconda"}` [prove/R01/003-arrivo-desktop-dopo-attesa.jpg]
- **percorso da tastiera** · tastiera · `{"salta_al_contenuto": "no", "tab_fino_al_comando_principale": 1, "trappole": 0}` — Al primo schermo il comando è tra gli elementi focalizzabili (calcolato dall'ordine del DOM). Dal secondo schermo le due carte e «About» non sono raggiungibili: Tab alterna un link vuoto 0x0 e body. [prove/R01/006-tasto.jpg, prove/R01/007-tasto.jpg]
- **porte per pubblici diversi** · arrivo computer · dopo il primo comando · `{"criterio": "compito", "porte": 2}` — «Learn ASL» e «Record Signs»; nel pannello About i due pubblici sono nominati «Learners» e «Contributors». [prove/R01/005-clic.jpg]
- **prodotto mostrato** · arrivo computer · `{"con_alternativa": "no", "con_legenda": "no", "tipo": "dimostrazione_viva"}` — Avatar 3D che firma in cicli dentro un canvas WebGL; nessuna legenda (il testo «Subtitles Goes Here» è un segnaposto non visibile) né alternativa testuale. [prove/R01/003-arrivo-desktop-dopo-attesa.jpg, prove/R01/misure/albero-accessibilita-R01.txt]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 2, "parole": 23}` — Wordmark «SIGNS» (non contato). Testo letterale: «Learn American Sign Language with your webcam and AI. Or help improve the platform by recording signs - and help us build a dataset.» [prove/R01/003-arrivo-desktop-dopo-attesa.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 2, "parole": 23}` — Stesso testo del computer, a capo su quattro righe (390x844). [prove/R01/misure/telefono-390x844-dopo-tocco.png]
- **richieste e terze parti** · arrivo computer · `{"domini_di_terzi": 10, "kb": 19057, "richieste": 65}` — Chromium senza cache, 10 s dopo il load. Terzi: Google Fonts (2 domini), Plausible, Cloudflare Insights, Firebase (2), Google Tag Manager, Google Identity Toolkit, jsDelivr, storage.googleapis.com. La FAQ dichiara «nessun cookie» e solo Plausible. [prove/R01/misure/misure-R01.json]
- **struttura della navigazione** · menu computer · `{"tipo": "pannello", "voci": 1}` — Solo «About», che apre un pannello a tutta pagina con «Close»; dal secondo passo anche una freccia indietro. [prove/R01/005-clic.jpg, prove/R01/013-clic.jpg]
- **struttura della navigazione** · menu telefono · `{"tipo": "pannello", "voci": 1}` — Stesso «About» a una colonna, pannello alto 892 px. [prove/R01/varianti/mobile/003-clic.jpg]
- **testo corrente** · arrivo computer · `{"caratteri_per_riga_max": 73, "corpo_px": 18, "interlinea": 1.5}` [prove/R01/misure/primo-schermo-R01.json]
- **testo corrente** · arrivo telefono · `{"caratteri_per_riga_max": 43, "corpo_px": 14, "interlinea": 1.5}` [prove/R01/misure/primo-schermo-R01.json]
- **zoom al 200%** · testo 200% · `{"contenuto_perso": "sì", "scroll_orizzontale": "no"}` — Viewport 720x450: il pulsante «Let's begin» (y 431-487) è tagliato dal bordo e lo scorrimento non lo porta in vista; si raggiunge cliccando la fetta visibile. [prove/R01/varianti/zoom200/001-vai.jpg, prove/R01/varianti/zoom200/005-clic.jpg]
- **zoom della pagina consentito dal meta viewport** · arrivo telefono · `{"maximum_scale": 1, "user_scalable": "no"}` — Meta viewport: width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover. Caratteristica aggiunta, non in §8. [prove/R01/lettura-arrivo-desktop.json]
- **effetto o animazione** · arrivo computer · caricamento mano e lettere · `{"proprieta": ["rotate", "opacity"], "trigger": "caricamento"}` — Mano con dita che ruotano di ±20° e testo «Loading», poi «SIGN» lettera per lettera e wordmark: sequenza vista in 10 fotogrammi a 700 ms (⚠ LENTO). [prove/R01/varianti/caricamento/001-vai-seq-01.jpg, prove/R01/fogli/caricamento.jpg]
- **effetto o animazione** · arrivo computer · hover pulsante · `{"durata_ms": 280, "proprieta": ["width", "background-color", "border-color", "transform", "opacity"], "trigg…` — Larghezza 181→200 px, riempimento viola con freccia; tween in JS campionato per fotogramma. [prove/R01/004-muovi.movimento.json, prove/R01/fogli/004-hover-lets-begin.jpg]
- **effetto o animazione** · percorso principale · Search · `{"durata_ms": 188, "proprieta": ["opacity", "transform", "width"], "trigger": "clic"}` — L'etichetta diventa campo e la freccia diventa ✕. [prove/R01/020-clic.movimento.json, prove/R01/021-scrivi.jpg]
- **effetto o animazione** · percorso principale · apertura About · `{"durata_ms": 299, "proprieta": ["opacity", "background-color", "border-color"], "trigger": "clic"}` — Il pannello copre la scena; la scena sfuma in circa 992 ms. [prove/R01/013-clic.movimento.json, prove/R01/fogli/013-clic-about.jpg]
- **effetto o animazione** · percorso principale · clic sul comando · `{"durata_ms": 370, "proprieta": ["opacity", "transform"], "trigger": "clic"}` — Il testo sale di 50 px (wordmark) o 20 px e sfuma; entrano la riga alta e le carte. [prove/R01/005-clic.movimento.json, prove/R01/fogli/005-clic-lets-begin.jpg]
- **effetto o animazione** · percorso principale · hover carta · `{"durata_ms": 597, "proprieta": ["background-color", "border-color", "color", "transform"], "trigger": "passa…` — Gradiente 1200x1200 che segue il puntatore, bordo pieno, freccia che scorre. [prove/R01/009-muovi.movimento.json, prove/R01/fogli/009-hover-card-learn.jpg]

### R02 · Touch: Beyond Vision (22 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 3, "immagini_senza_alternativa": 1, "punti_di_riferimento": 3, "titoli": 11}` — Proxy ariaSnapshot. H1 unico; banner, navigation, main; nessun contentinfo. Le immagini dei contenuti hanno alt descrittivi. [prove/R02/misure/albero-accessibilita-R02.txt, prove/R02/misure/misure-R02.json]
- **apertura del menu** · menu telefono · `{"curva": "cubic-bezier(0.785, 0.135, 0.15, 0.86)", "direzione": "da destra", "durata_ms": 600}` — Proprietà right da −430 px a 0 con ombra rgba(0,0,0,0.5); outline del pulsante 3 px→0 in 300 ms ease. Transizione CSS letta dal runtime. [prove/R02/varianti/mobile/002-clic.movimento.json, prove/R02/fogli/mobile-menu.jpg]
- **avvio di audio e video** · media · `{"avvio_automatico": "no", "controlli_nativi": "sì"}` — Un video YouTube incorporato (iframe) con anteprima e tasto play; nessun audio proprio nel sito. [prove/R02/fogli/scorrimento-a.jpg]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 60, "distanza_min_px": 4, "larghezza_min_px": 38}` [prove/R02/misure/primo-schermo-R02.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 60, "distanza_min_px": 224, "larghezza_min_px": 38}` [prove/R02/misure/primo-schermo-R02.json]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 1, "pulsanti": 1}` — Marchio e «Toggle menu» (div con ruolo button, 92x114). [prove/R02/misure/primo-schermo-R02.json]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 2, "parole_per_frase_media": 4, "persona": "seconda"}` [prove/R02/001-vai.jpg]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "no", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 18, "trappole": 0}` — Il conto 18 è calcolato dall'ordine del DOM (21 elementi tabbabili); le prime quattro pressioni sono misurate: marchio, Explore, Webby, Contact. outline none, 0 px: l'unico segnale è che il testo si attenua al 50%. [prove/R02/020-tasto.jpg, prove/R02/021-tasto.jpg]
- **prodotto mostrato** · arrivo computer · `{"con_alternativa": "no", "con_legenda": "no", "tipo": "foto"}` — Foto di una mano su un tessuto con filtro «pittura a olio», come immagine di sfondo (nessun testo alternativo). [prove/R02/001-vai.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 2, "parole": 8}` — Titolo H1 «Touch: Beyond Vision» (non contato). Frase letterale: «Art you can feel. Stories you can touch.» Sotto la piega: «OXO2London OXO TowerSeptember 15th, 2025» (senza separatore). [prove/R02/001-vai.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 2, "parole": 8}` — Stesso testo, a capo su tre righe. [prove/R02/misure/telefono-390x844-arrivo.png]
- **richieste e terze parti** · arrivo computer · `{"domini_di_terzi": 4, "kb": 11244, "richieste": 51}` — Terzi: Google Fonts (2 domini), Google Tag Manager, YouTube. [prove/R02/misure/misure-R02.json]
- **struttura della navigazione** · menu telefono · `{"tipo": "pannello", "voci": 3}` — Pannello bianco da destra con le stesse tre voci e una X. [prove/R02/varianti/mobile/002-clic-seq-06.jpg]
- **tenuta con colori forzati** · arrivo computer · `{"elementi_scomparsi": "no", "testo_leggibile": "sì"}` — Il testo prende un riquadro di sistema e i link diventano blu; la foto resta. Caratteristica aggiunta, non in §8. [prove/R02/varianti/forzati/001-vai.jpg, prove/R02/fogli/varianti-desktop.jpg]
- **testo corrente** · arrivo computer · `{"caratteri_per_riga_max": 68, "corpo_px": 15, "interlinea": 1.75}` — Primo paragrafo di corpo della pagina (sezione Webby, sotto la piega); colore #777 (4,48:1 su bianco) nelle didascalie delle opere. [prove/R02/misure/primo-schermo-R02.json]
- **testo corrente** · arrivo telefono · `{"caratteri_per_riga_max": 43, "corpo_px": 15, "interlinea": 1.75}` [prove/R02/misure/primo-schermo-R02.json]
- **effetto o animazione** · arrivo computer · contenuto del hero · `{"curva": "ease", "durata_ms": 1000, "proprieta": ["opacity"], "trigger": "caricamento"}` — Animazione CSS alpha-in sul blocco del titolo. [prove/R02/001-vai.movimento.json]
- **effetto o animazione** · arrivo computer · sfondo del hero · `{"curva": "ease", "durata_ms": 500, "proprieta": ["opacity"], "trigger": "caricamento"}` — Transizione con ritardo 200 ms. [prove/R02/001-vai.movimento.json]
- **effetto o animazione** · menu telefono · pannello · `{"curva": "cubic-bezier(0.785, 0.135, 0.15, 0.86)", "durata_ms": 600, "proprieta": ["right", "box-shadow"], "…` [prove/R02/varianti/mobile/002-clic.movimento.json]
- **effetto o animazione** · scorrimento computer · dissolvenza del hero · `{"curva": "none", "proprieta": ["opacity"], "trigger": "scorrimento"}` — GSAP fromTo con ScrollTrigger scrub true, start «top top»: opacità 1→0,8356 (144 px), 0,6689 (294), 0,5022 (444), 0,3356 (594), 0,1689 (744): lineare, zero a circa 900 px. Valori letti con valuta. [prove/R02/varianti/scrub/003-scorri.jpg, prove/R02/fogli/scrub-hero.jpg]
- **effetto o animazione** · scorrimento computer · pagina in generale · `{"durata_ms": 1, "proprieta": ["scroll"], "trigger": "scorrimento"}` — Libreria Lenis rilevata (durata 1); il passaggio da una pagina all'altra è un ricaricamento intero, senza transizione. [prove/R02/001-vai.movimento.json]
- **effetto o animazione** · scorrimento computer · tessera di categoria · `{"curva": "cubic-bezier(0.57, 0.21, 0.69, 1)", "durata_ms": 300, "proprieta": ["transform"], "trigger": "pass…` — Immagine scale 1→1,05; uscita da 1,03→1 in 180 ms con la stessa curva. [prove/R02/010-muovi.movimento.json]

### R03 · ElevenAgents (31 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 5, "immagini_senza_alternativa": 6, "punti_di_riferimento": 3, "titoli": 31}` — Proxy ariaSnapshot. Un H1; due navigation e main; nessun contentinfo rilevato dal proxy. [prove/R03/misure/albero-accessibilita-R03.txt, prove/R03/misure/misure-R03.json]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 1.03, "segnale": "testo"}` — 1,6 Mbit/s e 562 ms: il contenuto del primo schermo è già disegnato nella foto a 2 s (HTML generato sul server); First Contentful Paint 1028 ms, con la macchina carica. Banner e riquadro voce arrivano dopo. [prove/R03/misure/rete-lenta-02s.jpg, prove/R03/misure/misure-R03.json]
- **avvio di audio e video** · media · `{"avvio_automatico": "sì", "controlli_nativi": "no", "sottotitoli": "sì", "trascrizione": "sì"}` — Il video della prima scheda parte da solo ma muto e in ciclo (muted=true, loop); il suono parte solo dopo «Unmute» (muted=false, letto con valuta), che diventa «Mute». Trascrizione come bolle di chat nel DOM; nessun elemento track. [prove/R03/006-scorri.jpg, prove/R03/fogli/unmute.jpg]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 23, "distanza_min_px": 0, "larghezza_min_px": 32}` — Il più piccolo è il menu a tendina di lingua (119x23); i pulsanti-icona 32x32; i pulsanti principali 134x44 e 180x44. [prove/R03/misure/primo-schermo-R03.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 22, "distanza_min_px": 0, "larghezza_min_px": 24}` — Pulsanti del banner cookie alti 36 px (88x36, 36x36, 149x36). [prove/R03/misure/primo-schermo-R03.json, prove/R03/varianti/mobile/001-vai.jpg]
- **campione di suono** · media · `{"campioni": 4, "testo_accanto": "sì"}` — Quattro schede con pulsante «Unmute» da 40x40 (provato solo sulla prima) più la conversazione dal vivo nel riquadro «Try an ElevenLabs agent» (non avviata: richiede consenso a essere registrati). [prove/R03/006-scorri.jpg, prove/R03/fogli/unmute.jpg]
- **chi c'è dietro e le fonti** · fiducia · `{"data": "no", "firma": "sì", "fonti_collegate": "sì", "versione": "sì"}` — Marchio ElevenLabs; annuncio «Eleven v4» in alto; storie dei clienti (Deutsche Telekom, Klarna, Meesho); elenco di certificazioni (SOC 2 Type II, ISO 27001, ISO 42001, HIPAA, PCI DSS Level 1). [prove/R03/fogli/scorrimento-a.jpg, prove/R03/fogli/scorrimento-b.jpg]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 1, "link": 15, "pulsanti": 15}` — Conteggio con il banner cookie presente (tre pulsanti) e un menu a tendina di lingua nella barra alta. [prove/R03/misure/primo-schermo-R03.json]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 1, "link": 7, "pulsanti": 8}` [prove/R03/misure/primo-schermo-R03.json]
- **comando principale** · arrivo computer · `{"fisso_allo_scorrimento": "sì", "posizione": "centro"}` — «Talk to sales» pieno nero e «Create an AI agent» bordato a y 383-427; dopo lo scorrimento la barra compatta fissa ripete «Talk to sales» e «Create an AI Agent». [prove/R03/001-vai.jpg, prove/R03/fogli/scorrimento-a.jpg]
- **comportamento senza JavaScript** · senza JavaScript · `{"comandi_essenziali": "funzionano", "contenuto": "parziale", "navigazione": "funziona"}` — Testo e immagini presenti (7495 caratteri, 150 link, 44 immagini); mancano banner cookie, riquadro della voce e video del carosello (restano le immagini di anteprima). [prove/R03/misure/senza-javascript.jpg, prove/R03/misure/misure-R03.json]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 1, "parole_per_frase_media": 21, "persona": "terza"}` [prove/R03/001-vai.jpg]
- **pagina inesistente** · 404 · `{"offre_ritorno": "no", "utile": "sì"}` — Testo: «404 / This page could not be found». Barra di navigazione globale, nessun collegamento di ritorno nel corpo. [prove/R03/030-vai.jpg]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "sì", "salta_al_contenuto": "sì", "tab_fino_al_comando_principale": 17, "trappole": 0}` — Conto calcolato dal DOM dopo aver chiuso il banner (174 elementi tabbabili). Misurato: 1 «Discover», 2 «Skip to content» (appare a 20,20), 3 logo; anello blu 1 px rgb(43,127,255). Con il banner presente i suoi pulsanti vengono prima. [prove/R03/027-tasto.jpg, prove/R03/028-tasto.jpg]
- **porte per pubblici diversi** · arrivo computer · `{"criterio": "compito", "porte": 2}` — «Talk to sales» (chi compra) e «Create an AI agent» (chi costruisce); più avanti «Support/Sales/Operations/Marketing/Talent» come casi d'uso. [prove/R03/001-vai.jpg]
- **prodotto mostrato** · arrivo computer · `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "video"}` — Carosello di quattro schede di persone al telefono; la prima con un video e bolle di chat che trascrivono la conversazione; nessun testo alternativo per i video. [prove/R03/006-scorri.jpg]
- **prodotto mostrato** · scorrimento computer · `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "schermata"}` — Schermate vere dell'interfaccia (flusso di lavoro, guardrail, analisi con grafici) e scene animate con sfera e bolle; titoli e frasi accanto. [prove/R03/fogli/scorrimento-a.jpg, prove/R03/fogli/scorrimento-b.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 1, "parole": 21}` — H1 «Conversational agents that feel human» (non contato). Frase letterale: «Configure, deploy and monitor natural, human-sounding agents in 90+ languages with leading accuracy and ultra-low latency across voice, chat, and email.» [prove/R03/001-vai.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 1, "parole": 21}` — Stesso testo. [prove/R03/misure/telefono-390x844-arrivo.png]
- **richieste e terze parti** · arrivo computer · `{"domini_di_terzi": 11, "kb": 6940, "richieste": 192}` — Terzi: Cookiebot (2), Google Tag Manager, Ketch (2), hCaptcha (2), dreamdata, partnerlinks.io, grsm.io, una Cloud Function di xi-labs. Il banner appare al primo accesso. [prove/R03/misure/misure-R03.json]
- **struttura della navigazione** · menu computer · `{"tipo": "barra", "voci": 11}` — Due livelli: ElevenLabs (Products, Solutions, Customers, Resources, Enterprise, Pricing) e ElevenAgents (Platform, Solutions, Docs, Customers, Pricing); le voci con menu a comparsa non sono state aperte. Log in e Sign up a destra. [prove/R03/001-vai.jpg, prove/R03/lettura-arrivo-desktop.txt]
- **testo corrente** · arrivo computer · `{"caratteri_per_riga_max": 59, "corpo_px": 16, "interlinea": 1.5}` [prove/R03/misure/primo-schermo-R03.json]
- **testo corrente** · arrivo telefono · `{"caratteri_per_riga_max": 38, "corpo_px": 16, "interlinea": 1.5}` [prove/R03/misure/primo-schermo-R03.json]
- **effetto o animazione** · arrivo computer · banner cookie · `{"durata_ms": 337, "proprieta": ["transform", "opacity"], "trigger": "clic"}` — Alla scelta il banner esce (scale 0,988) e subito entra un secondo riquadro che offre l'italiano. [prove/R03/003-clic.movimento.json, prove/R03/fogli/banner-reject.jpg]
- **effetto o animazione** · arrivo computer · grana · `{"curva": "steps(1)", "durata_ms": 200, "proprieta": ["transform"], "trigger": "caricamento"}` — tw-noise-drift: elemento grande il doppio della pagina che salta fra 11 posizioni (da −15% a +15%) in un ciclo di 200 ms, in ciclo infinito; ferma in movimento ridotto. [prove/R03/001-vai.movimento.json]
- **effetto o animazione** · arrivo computer · hover pulsante · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 150, "proprieta": ["background-color"], "trigger": "pa…` [prove/R03/002-muovi.jpg, prove/R03/003-clic.movimento.json]
- **effetto o animazione** · percorso principale · apertura del riquadro voce · `{"durata_ms": 465, "proprieta": ["transform", "border-radius", "opacity"], "trigger": "clic"}` — La pillola «Try an ElevenLabs agent» si trasforma in un riquadro con raggio 10,5%→28 px e scala 0,70/0,12→1; dissolvenze da 300 ms con cubic-bezier(0.25, 0.1, 0.35, 1) per i contenuti. [prove/R03/008-clic.movimento.json, prove/R03/fogli/widget-apertura.jpg]
- **effetto o animazione** · percorso principale · consenso e annulla · `{"curva": "cubic-bezier(0.25, 0.1, 0.35, 1)", "durata_ms": 300, "proprieta": ["opacity"], "trigger": "clic"}` — Dissolvenza fra la sfera e il testo del consenso, nei due versi. [prove/R03/009-clic.movimento.json, prove/R03/011-clic.movimento.json]
- **effetto o animazione** · scorrimento computer · cambio scheda dei casi d'uso · `{"curva": "cubic-bezier(0.25, 0.1, 0.35, 1)", "durata_ms": 300, "proprieta": ["opacity"], "trigger": "clic"}` — La scena esce in 300 ms, poi un vuoto, poi la nuova scena entra con opacità in 700 ms cubic-bezier(0.19, 1, 0.22, 1). [prove/R03/023-clic.movimento.json, prove/R03/fogli/tab-sales.jpg]
- **effetto o animazione** · scorrimento computer · navigazione fissa · `{"proprieta": ["position"], "trigger": "scorrimento"}` — Dopo lo scorrimento la doppia barra diventa una barra compatta fissa con «Talk to sales» e «Create an AI Agent»; non misurata nel tempo. [prove/R03/fogli/scorrimento-a.jpg]
- **effetto o animazione** · scorrimento computer · puntini di digitazione · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 1240, "proprieta": ["opacity", "transform"], "trigger"…` — tw-typing-dot-bounce in ciclo con sfalsamento di 160 ms fra i tre puntini. [prove/R03/023-clic.movimento.json]

### R04 · Waymo / Safety Hub (33 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 0, "punti_di_riferimento": 5, "titoli": 14}` — ariaSnapshot (proxy): banner 1, navigation 2, main 1, contentinfo 1 (più il dialogo cookie); 14 titoli; 40 link, 8 pulsanti, 25 immagini, nessuna senza alt (6 con alt vuoto, decorative). Il mio conteggio nel DOM trovava 11 comandi senza testo né aria-label (i… [prove/R04/albero-accessibilita/aria-snapshot-computer.yml, prove/R04/riepilogo-senza-posto.json]
- **apertura del menu** · menu computer · `{"curva": "ease", "direzione": "altezza da 0 a 248 px", "durata_ms": 150}` — Pannello sotto l'intestazione (altezza 150 ms); il contenuto entra in 200 ms dopo 100 ms di ritardo; un velo scuro sul resto della pagina (opacità 0 a 1, 200 ms); chiusura con le stesse durate invertite (018-muovi.movimento.json). [prove/R04/017-muovi.jpg, prove/R04/017-muovi.movimento.json]
- **apertura del menu** · menu telefono · `{"curva": "ease", "direzione": "altezza da 0 a 852 px", "durata_ms": 250}` — Il pannello cresce in altezza; le voci compaiono con opacità 0 a 1 in 100 ms dopo 100 ms di ritardo; il filetto sotto l'intestazione passa da scaleX 0 a 1 in 200 ms. [prove/R04/telefono/003-clic.jpg, prove/R04/telefono/003-clic.movimento.json]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 0.9, "segnale": "testo"}` — Slow 3G (latenza 400 ms, 400 kbit/s) in Chromium: il testo è letto nel DOM a 934 ms, DOMContentLoaded a 12,3 s, nessun evento load entro 30 s; a 25 s la pagina è disegnata (foto). Nessuno scheletro né spinner. Le altre foto della sequenza non sono riuscite du… [prove/R04/rete-lenta-2/006-25s.jpg, prove/R04/riepilogo-senza-posto.json]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 16, "larghezza_min_px": 20}` — Su 72 comandi visibili: voci di menu a comparsa 350x20, link in linea 18 px d'altezza, voci d'intestazione 32-68x90, cerchio play ~80x80. Distanza minima non misurata. [prove/R04/misura-bersagli-testo-computer.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 16, "larghezza_min_px": 13}` — A 430x932 il conteggio include elementi del pannello menu chiuso (calcolo approssimativo); a 390x844: 89 comandi, 72 sotto 44x44 px (riepilogo-senza-posto.json). Le frecce del menu telefono («Enter Rides menu») sono 13x22 px nel riquadro dell'elemento. [prove/R04/telefono/misura-bersagli-testo-telefono.json, prove/R04/riepilogo-senza-posto.json]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 11, "pulsanti": 2}` — Dopo aver chiuso il banner: logo, 6 voci di intestazione, 3 collegamenti nel testo («data», «Waymo's Safety Framework», «Safety Case»), «Explore our safety dashboard»; pulsanti: ricerca e play del video (la didascalia «Explore our Safety Case Framework» è con… [prove/R04/005-clic.jpg]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 1, "pulsanti": 3}` — Logo; pulsanti: ricerca, menu (hamburger) e play del video. Conteggio da foto. [prove/R04/telefono/004-clic.jpg]
- **corto subito, lungo a richiesta** · percorso principale · `{"meccanismo": "apertura"}` — Nella vetrina: carosello con frecce per le 4 affermazioni e 3 aperture per le tre ragioni dell'impegno. [prove/R04/010-clic.jpg, prove/R04/012-clic.jpg]
- **effetti con movimento ridotto** · movimento ridotto · `{"effetti": 8, "invariati": 7, "sostituiti": 0, "tolti": 0}` — matchMedia(prefers-reduced-motion: reduce) = true. Invariati nelle durate e curve: menu a comparsa (150/200 ms), modale video (300 ms, cubic-bezier(0.83,0,0.17,1)), icone +/-, intestazione, banner. Un effetto cambia di momento: le entrate allo scorrimento e i… [prove/R04/ridotto/001-vai.movimento.json, prove/R04/ridotto/003-scorri.jpg]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 10, "parole_per_frase_media": 20.9, "persona": "mista"}` — Campione delle prime 10 frasi in prosa della vetrina (11-33 parole, media 20,9) e dell'hub (8-39 parole, media 20,9); «we», «our» e «you» insieme. Solo inglese. [prove/R04/testo-main-computer.txt, prove/R04/testo-main-impact-computer.txt]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "sì", "salta_al_contenuto": "sì", "tab_fino_al_comando_principale": 28, "trappole": 0}` — Primo Tab: «Skip to main content» (617,20, 207x58). Anello di focus: 4 px pieno rgb(0,232,157). 71 elementi in ordine di Tab (calcolo approssimato) e «Explore our safety dashboard» è il 28°: ogni sottovoce dei menu è un punto di sosta. Trappole non incontrate… [prove/R04/023-tasto.jpg, prove/R04/riepilogo-senza-posto.json]
- **prodotto mostrato** · arrivo computer · `{"con_alternativa": "sì", "con_legenda": "sì", "tipo": "foto"}` — Il prodotto è un servizio di guida: foto del veicolo e delle strade in un collage circolare, video dietro un tasto, illustrazioni a linea per le affermazioni; didascalia «Explore our Safety Case Framework» vicino al video. 0 immagini senza alt. [prove/R04/001-vai.jpg, prove/R04/012-clic.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 3, "parole": 75}` — Titolo «Safety», sottotitolo «Our Approach to Safety» e un paragrafo di 71 parole: «The data to date shows Waymo is already making streets safer in the cities where we operate. Backed by industry-leading safety practices, the Waymo Driver is always alert, fol… [prove/R04/005-clic.jpg, prove/R04/testo-main-computer.txt]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 0, "parole": 4}` — A 430x932 si vedono per intero il titolo «Safety» (1 parola) e il sottotitolo «Our Approach to Safety» (3 parole); il paragrafo comincia sotto la piega. Banner cookie sul primo arrivo (telefono/001-vai.jpg). [prove/R04/telefono/004-clic.jpg]
- **richieste e terze parti** · arrivo computer · `{"domini_di_terzi": 3, "kb": 1582, "richieste": 82}` — A ricarica (cache attiva): waymo.com 58, storage.googleapis.com 10, lh3.googleusercontent.com 12 (486 kB), fonts.googleapis.com 1; 494 kB trasferiti; fcp 716 ms in headless. kB = byte codificati. Caratteri caricati: GT-Walsheim e Simplon Mono (il numero di fi… [prove/R04/misura-richieste-computer.json]
- **testo corrente** · arrivo computer · `{"caratteri_per_riga_max": 58, "corpo_px": 16, "interlinea": 1.5}` — GT-Walsheim 400, 16/24 px, colonna 461 px; i caratteri per riga sono una stima (larghezza / 0,5 em), non un conteggio sul testo reso. Titoli 120/50/40 px. [prove/R04/misura-bersagli-testo-computer.json]
- **effetto o animazione** · arrivo computer · M01 Banner dei cookie: ingresso e uscita · `{"trigger": "caricamento"}` — Banner dei cookie: ingresso e uscita. chiede il consenso senza spostare il contenuto; [I] appare piano per non sembrare un blocco. [ricerca/movimento/R04.md#M01]
- **effetto o animazione** · menu computer · M05 Menu a comparsa (computer) · `{"trigger": "passaggio"}` — Menu a comparsa (computer). mostra le sottovoci e un'immagine senza lasciare la pagina; il velo isola il menu. [ricerca/movimento/R04.md#M05]
- **effetto o animazione** · menu computer · M06 Pannello di ricerca · `{"trigger": "clic"}` — Pannello di ricerca. Pannello di ricerca [ricerca/movimento/R04.md#M06]
- **effetto o animazione** · menu telefono · M07 Menu a tutto schermo (telefono) · `{"trigger": "clic"}` — Menu a tutto schermo (telefono). elenco grande per il tocco; [F] pannello a tutto schermo. [ricerca/movimento/R04.md#M07]
- **effetto o animazione** · percorso principale · M08 Finestra modale del video · `{"trigger": "clic"}` — Finestra modale del video. porta il video in primo piano senza cambiare pagina, con uscita reversibile. [ricerca/movimento/R04.md#M08]
- **effetto o animazione** · percorso principale · M09 Aperture «+/–» (accordion) · `{"trigger": "clic"}` — Aperture «+/–» (accordion). Aperture «+/–» (accordion) [ricerca/movimento/R04.md#M09]
- **effetto o animazione** · percorso principale · M12 Grafici e tooltip dell'hub · `{"trigger": "scorrimento"}` — Grafici e tooltip dell'hub. Grafici e tooltip dell'hub [ricerca/movimento/R04.md#M12]
- **effetto o animazione** · percorso principale · M13 Elenco «Download Data» · `{"trigger": "scorrimento"}` — Elenco «Download Data». Elenco «Download Data» [ricerca/movimento/R04.md#M13]
- **effetto o animazione** · percorso principale · M14 Passaggio fra pagine (vista di documento) · `{"trigger": "clic"}` — Passaggio fra pagine (vista di documento). dissolvenza fra una pagina e la successiva (ricerca → risultati, menu telefono → Safety) invece di un taglio. [ricerca/movimento/R04.md#M14]
- **effetto o animazione** · percorso principale · M15 Pagina aggiornamenti («Waymo is coming soon to your city») · `{"trigger": "clic"}` — Pagina aggiornamenti («Waymo is coming soon to your city»). Pagina aggiornamenti («Waymo is coming soon to your city») [ricerca/movimento/R04.md#M15]
- **effetto o animazione** · percorso principale · M16 Anello di focus e stati di tocco · `{"trigger": "non indicato"}` — Anello di focus e stati di tocco. Anello di focus e stati di tocco [ricerca/movimento/R04.md#M16]
- **effetto o animazione** · scorrimento computer · M02 Entrata allo scorrimento (reveal) con scalare · `{"trigger": "scorrimento"}` — Entrata allo scorrimento (reveal) con scalare. guida l'occhio sezione per sezione; l'ordine titolo → corpo → dati è l'ordine di lettura. [ricerca/movimento/R04.md#M02]
- **effetto o animazione** · scorrimento computer · M03 Conteggio dei numeri e crescita delle barre · `{"trigger": "scorrimento"}` — Conteggio dei numeri e crescita delle barre. dà il senso di grandezza e direzione del dato; la frase completa è già nel DOM. [ricerca/movimento/R04.md#M03]
- **effetto o animazione** · scorrimento computer · M04 Intestazione guidata dalla direzione di scorrimento · `{"trigger": "scorrimento"}` — Intestazione guidata dalla direzione di scorrimento. libera lo schermo scendendo, torna a portata salendo. [ricerca/movimento/R04.md#M04]
- **effetto o animazione** · scorrimento computer · M10 Carosello a scorrimento · `{"trigger": "clic"}` — Carosello a scorrimento. sfoglia le 4 affermazioni senza saltare la pagina. [ricerca/movimento/R04.md#M10]
- **effetto o animazione** · scorrimento computer · M11 Hub: scambio di pannelli con scorrimento laterale · `{"trigger": "caricamento"}` — Hub: scambio di pannelli con scorrimento laterale. Hub: scambio di pannelli con scorrimento laterale [ricerca/movimento/R04.md#M11]

### R05 · LALAL.AI (41 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 6, "immagini_senza_alternativa": 0, "punti_di_riferimento": 7, "titoli": 20}` — ariaSnapshot (proxy): banner 1, navigation 2, main 1, contentinfo 1, region 2; 60 link, 28 pulsanti, 58 immagini; 5 pulsanti e 1 link senza nome nell'albero (i pulsanti del riproduttore). Il mio conteggio nel DOM trovava 35 comandi senza testo né aria-label:… [prove/R05/albero-accessibilita/aria-snapshot-computer.yml, prove/R05/riepilogo-senza-posto.json]
- **apertura del menu** · menu computer · `{"curva": "ease", "direzione": "nessuna (dissolvenza)", "durata_ms": 200}` — Corpo del menu opacità e visibility 200 ms; freccia ruotata da 180 a 0 gradi in 200 ms; colore della voce 100 ms. [prove/R05/023-muovi.jpg, prove/R05/023-muovi.movimento.json]
- **apertura del menu** · menu telefono · `{"curva": "ease", "direzione": "nessuna (dissolvenza con ombra)", "durata_ms": 200}` — Il pannello passa da opacità 0 a 1 e da visibility hidden a visible in 200 ms, con ombra (box-shadow) in 200 ms; il velo dietro in 100 ms; il logo a testo bianco compare dopo 200 ms. Nessuno spostamento. [prove/R05/telefono/005-clic.jpg, prove/R05/telefono/005-clic.movimento.json]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 5.6, "segnale": "scheletro"}` — Slow 3G in Chromium (latenza 400 ms, 400 kbit/s): primo testo letto a 5,6 s; a ~10 s titolo e sottotitolo visibili e il widget è un blocco grigio con barre pulsanti; a ~25 s il widget è completo; DOMContentLoaded a 24,4 s, nessun load entro 30 s; 337 richiest… [prove/R05/rete-lenta-2/003-4s.jpg, prove/R05/rete-lenta-2/006-25s.jpg]
- **avvio di audio e video** · media · `{"avvio_automatico": "no", "controlli_nativi": "no", "trascrizione": "no"}` — 8 elementi audio, tutti in pausa all'arrivo, preload none, nessun controls nativo; i pulsanti di stem avviano la riproduzione al clic. Il video «Clarity is everything» ha un tasto play e non è avviato. Sottotitoli non applicabili al campione musicale. [prove/R05/003-scorri.jpg, prove/R05/004-clic.jpg]
- **campione di suono** · media · `{"campioni": 8, "durata_indicata": "no", "simultanei_max": 1, "testo_accanto": "no"}` — 8 file audio (traccia originale, vocals, instrumental, drums, bass, e tre del cloner), clip da 263,5 s; un solo elemento in riproduzione in ognuna delle 5 letture; nessun testo accanto né durata o posizione mostrati. Il passaggio fra clip non è misurabile qui… [prove/R05/003-scorri.jpg, prove/R05/004-clic.jpg]
- **chi c'è dietro e le fonti** · fiducia · `{"data": "sì", "firma": "sì", "fonti_collegate": "no", "versione": "sì"}` — «© 2026 OmniSale GMBH»; «Latest Release: 2026-11-12» nella pagina dell'app; versione nell'indirizzo del file (2.21.0.807) ma non nell'etichetta; i riquadri «4x Training data», «40% Faster processing» e «#1 vocal remover» non hanno fonte collegata. [prove/R05/014-vai.jpg, prove/R05/testo-body-desktop-app.txt]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 8, "pulsanti": 7}` — Link: logo, Help, Blog, App Store, Google Play, macOS, Windows, Terms of Service. Pulsanti: Products, Pricing, lingua, Log In, rotella delle impostazioni, selettore del tipo di estrazione, Select Files (è un'etichetta per un campo file nascosto, non contato c… [prove/R05/002-clic.jpg]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 4, "pulsanti": 8}` — Link: logo, App Store, Google Play, Terms of Service. Pulsanti: chiudi e «Get» della barra app, menu, rotella, selettore, Select Files, bolla di assistenza, icona cookie. Conteggio da foto. [prove/R05/telefono/004-clic.jpg]
- **comportamento senza JavaScript** · senza JavaScript · `{"comandi_essenziali": "no", "contenuto": "parziale"}` — Testo, schede prodotto, FAQ (chiuse) e footer ci sono (16101 caratteri); il widget di caricamento resta uno scheletro grigio con «Your browser does not support JavaScript!», i piani di prezzo sono scheletri senza cifre, le immagini dei riquadri promozionali m… [prove/R05/senza-js/001-arrivo.jpg, prove/R05/senza-js/002-pagina-intera.jpg]
- **compromessi dichiarati nelle opzioni** · aiuto · `{"opzioni_con_spiegazione": 2}` — Nella finestra «Settings»: «Clear Cut — Minimizes cross-bleeding between stems but may suppress finer details» e «Deep Extraction — Extracts more details but increases the chance of cross-bleeding.» (caratteristica non nel vocabolario di piano.md §8: aggiunta… [prove/R05/055-clic.jpg]
- **effetti con movimento ridotto** · movimento ridotto · `{"effetti": 7, "invariati": 7, "sostituiti": 0, "tolti": 0}` — matchMedia reduce = true. Invariati: scheletri (pulsar 2000 ms), spinner 3000 ms, dialogo cookie 500 ms, menu 200 ms, intestazione che si compatta 200 ms, voci a pillola 100 ms, indicatore di scheda. 1 regola prefers-reduced-motion nei 5 fogli leggibili su 30… [prove/R05/ridotto/001-vai.movimento.json, prove/R05/ridotto/003-muovi.movimento.json]
- **guida a passi con ripresa** · installazione · `{"indicatore": "no", "passi": 4}` — Un paragrafo di FAQ: «Go to the LALAL.AI desktop app page and click the Download button for your operating system. Once the installer is downloaded, run it and follow the setup steps. After installation, open the app and log in with your LALAL.AI account emai… [prove/R05/019-clic.jpg, prove/R05/testo-body-desktop-app.txt]
- **lunghezza e registro delle frasi** · aiuto · `{"frasi_campione": 10, "parole_per_frase_media": 20.6, "persona": "mista"}` — Prime 10 frasi delle FAQ: 12-29 parole, media 20,6; imperativo per i passi («Click the settings icon…»). [prove/R05/testo-body-computer.txt]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 10, "parole_per_frase_media": 13.3, "persona": "mista"}` — Prime 10 frasi di prosa dopo «What is LALAL.AI?»: 5-32 parole, media 13,3; «you» e «we». [prove/R05/testo-body-computer.txt]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "sì", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 29, "trappole": 0}` — Da inizio pagina il 1° Tab è il logo e il 2° «Products» (poi tutte le voci del menu, una per una). «Select Files» è il 29° elemento in ordine di Tab (conteggio approssimato sul DOM; 119 in tutto). Focus: contorno predefinito del browser (outline auto 1 px). N… [prove/R05/riepilogo-senza-posto.json, prove/R05/misura-accessibilita-meta-computer.json]
- **porte per pubblici diversi** · menu computer · `{"criterio": "compito", "porte": 7}` — Il menu Products elenca 7 compiti (Vocal Remover, Stem Splitter, Voice Cleaner, Voice Changer, Voice Cloner, Echo & Reverb Remover, Lead/Back Splitter) e una colonna per piattaforma; nessuna porta per ruolo (musicista, podcaster, azienda) tranne «Enterprise S… [prove/R05/023-muovi.jpg]
- **prodotto mostrato** · arrivo computer · `{"con_legenda": "sì", "tipo": "dimostrazione_viva"}` — Lo strumento vero è nel primo schermo (selettore + «Select Files»). La pagina /desktop-app/ mostra due schermate reali dell'app con i suoi stati (Uploading, Processing, Downloading, «Full»). [prove/R05/002-clic.jpg, prove/R05/014-vai.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 3, "parole": 20}` — Titolo «Remove Vocals and Instrumentals from Audio and Video» e sottotitolo «Vocal remover built for pro-level quality. Powered by AI and transformer technology.» Accanto, lo strumento: «Choose what to extract, then upload your file / Add up to 20 files in MP… [prove/R05/002-clic.jpg, prove/R05/testo-body-computer.txt]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 3, "parole": 20}` — Stesso testo a 430x932, ma dopo aver chiuso il prompt di Google e il dialogo cookie; sopra c'è la barra «LALAL.AI App · Exclusive batch upload feature for FREE! · Get». Il widget viene prima del sottotitolo. [prove/R05/telefono/004-clic.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 4, "domini_di_terzi": 3, "richieste": 250}` — A ricarica: 246 richieste da s.lalal.ai (altro sottodominio, byte non leggibili), consent.cookiebot.com, consentcdn.cookiebot.com, www.googletagmanager.com; fcp 340 ms, load 901 ms in headless. Quattro pesi di Roobert (300, 400, 500, 600). [prove/R05/misura-richieste-computer.json]
- **scelta per sistema o versione** · installazione · `{"modo": "automatico"}` — Il pulsante primario riconosce il sistema («Download for Ubuntu» con user agent Linux) e una tendina offre Ubuntu Portable, Windows x64, Windows x64 Portable, macOS. «Latest Release: 2026-11-12». Nella home, invece, il pulsante giallo era «macOS» (riconoscime… [prove/R05/014-vai.jpg, prove/R05/015-clic.jpg]
- **sovrapposizione di messaggi al primo arrivo** · arrivo telefono · `{"messaggi_sovrapposti": 3}` — Dialogo cookie quasi a schermo intero + prompt «Accedi all'app lalalai con le credenziali Google» (copre i bottoni del dialogo) + barra «LALAL.AI App · Get» (caratteristica non nel vocabolario: aggiunta con nome nuovo). [prove/R05/telefono/002-clic.jpg, prove/R05/telefono/004-clic.jpg]
- **testo corrente** · arrivo computer · `{"corpo_px": 18, "interlinea": 1.33}` — Roobert: 18/24 px per i testi di scheda (grigio rgb(141,140,141)), 24/32 per il testo introduttivo, 12/16 per le note legali; titolo 48/52 px. [prove/R05/misura-bersagli-testo-computer.json]
- **testo corrente** · arrivo telefono · `{"corpo_px": 15, "interlinea": 1.6}` — A 390x844: 15/24 px; paragrafo largo 344 px. [prove/R05/riepilogo-senza-posto.json]
- **effetto o animazione** · arrivo computer · M01 Scheletri che pulsano (attesa del widget e dei prezzi) · `{"trigger": "caricamento"}` — Scheletri che pulsano (attesa del widget e dei prezzi). dice «sta arrivando» e mantiene lo spazio per evitare salti. [ricerca/movimento/R05.md#M01]
- **effetto o animazione** · arrivo computer · M02 Spinner di attesa · `{"trigger": "caricamento"}` — Spinner di attesa. Spinner di attesa [ricerca/movimento/R05.md#M02]
- **effetto o animazione** · arrivo computer · M03 Dialogo cookie (Cookiebot) · `{"trigger": "clic"}` — Dialogo cookie (Cookiebot). Dialogo cookie (Cookiebot) [ricerca/movimento/R05.md#M03]
- **effetto o animazione** · menu computer · M05 Voci di intestazione a pillola · `{"trigger": "scorrimento"}` — Voci di intestazione a pillola. Voci di intestazione a pillola [ricerca/movimento/R05.md#M05]
- **effetto o animazione** · menu computer · M07 Menu «Products» (computer) · `{"trigger": "non indicato"}` — Menu «Products» (computer). Menu «Products» (computer) [ricerca/movimento/R05.md#M07]
- **effetto o animazione** · menu computer · M08 Tendina «Download for…» (app) · `{"trigger": "clic"}` — Tendina «Download for…» (app). Tendina «Download for…» (app) [ricerca/movimento/R05.md#M08]
- **effetto o animazione** · menu telefono · M09 Menu a pannello (telefono) · `{"trigger": "clic"}` — Menu a pannello (telefono). Menu a pannello (telefono) [ricerca/movimento/R05.md#M09]
- **effetto o animazione** · percorso principale · M06 Riquadri promozionali · `{"trigger": "non indicato"}` — Riquadri promozionali. Riquadri promozionali [ricerca/movimento/R05.md#M06]
- **effetto o animazione** · percorso principale · M10 Finestra «Settings» · `{"trigger": "clic"}` — Finestra «Settings». Finestra «Settings» [ricerca/movimento/R05.md#M10]
- **effetto o animazione** · percorso principale · M11 Stato del widget · `{"trigger": "non indicato"}` — Stato del widget. Stato del widget [ricerca/movimento/R05.md#M11]
- **effetto o animazione** · percorso principale · M12 Riproduttore degli stem · `{"trigger": "clic"}` — Riproduttore degli stem. Riproduttore degli stem [ricerca/movimento/R05.md#M12]
- **effetto o animazione** · percorso principale · M13 Accordion della FAQ · `{"trigger": "clic"}` — Accordion della FAQ. Accordion della FAQ [ricerca/movimento/R05.md#M13]
- **effetto o animazione** · percorso principale · M15 Illustrazione dei tre sistemi (Apps & Plugins) · `{"trigger": "non indicato"}` — Illustrazione dei tre sistemi (Apps & Plugins). Illustrazione dei tre sistemi (Apps & Plugins) [ricerca/movimento/R05.md#M15]
- **effetto o animazione** · scorrimento computer · M04 Intestazione che si compatta · `{"trigger": "scorrimento"}` — Intestazione che si compatta. libera spazio dopo l'arrivo senza nascondersi. [ricerca/movimento/R05.md#M04]
- **effetto o animazione** · scorrimento computer · M14 Indicatore di scheda della FAQ · `{"trigger": "clic"}` — Indicatore di scheda della FAQ. Indicatore di scheda della FAQ [ricerca/movimento/R05.md#M14]
- **effetto o animazione** · scorrimento computer · M16 Pulsante di scarico fisso e sovrapposizione · `{"trigger": "non indicato"}` — Pulsante di scarico fisso e sovrapposizione. Pulsante di scarico fisso e sovrapposizione [ricerca/movimento/R05.md#M16]

### R06 · Through Sliding Doors (27 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 14, "punti_di_riferimento": 1, "titoli": 0}` — ariaSnapshot (proxy): 1 navigation, nessun main/banner/contentinfo, 0 titoli, 7 link, 5 pulsanti con nome (Start with sound, No sound thanks, Thanks I understand, Previous, Next), 14 img senza nome, un `alert`; le carte-capitolo compaiono come testo «Chapter… [prove/R06/albero-accessibilita/aria-snapshot-computer.yml, prove/R06/riepilogo-senza-posto.json]
- **avvertenza sui contenuti con uscita rapida** · arrivo computer · `{"avvertenza": "sì", "resta_dopo_la_scelta": "no", "uscita_rapida": "sì"}` — Avvertenza + due comandi: «THANKS, I UNDERSTAND» e «QUICK EXIT» (link a rosiesplace.org.au). Dopo «No sound thanks» il pannello è invisibile (opacità 0) ma i suoi controlli restano nell'ordine di Tab. Il «Quick exit» non è stato seguito. Caratteristica non ne… [prove/R06/026-aspetta.jpg, prove/R06/zoom-200/003-clic.jpg]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 16, "larghezza_min_px": 62}` — QUICK EXIT 62x16, Kids Helpline 85x19, 1800 RESPECT 92x19, Facilitators' guide 114x16, Thanks I understand 169x34; l'interruttore del suono è 13x13 px (opacità 0). Distanza non misurata. [prove/R06/misura-bersagli-testo-meta-about-computer.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 15, "larghezza_min_px": 42}` — A 390x844 (scena con avvertenza chiusa): 9 comandi, 8 sotto 44x44 px. [prove/R06/riepilogo-senza-posto.json]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 4, "pulsanti": 3}` — Link: «Rosie's Place» nel testo, «Kids Helpline», «1800 RESPECT», «QUICK EXIT» (questi tre nel pannello di avvertenza, che compare con ritardo). Pulsanti: START WITH SOUND, NO SOUND THANKS, THANKS, I UNDERSTAND. Conteggio da foto. [prove/R06/026-aspetta.jpg]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 4, "pulsanti": 3}` — Gli stessi elementi, con il pannello di avvertenza in basso a tutta larghezza. [prove/R06/telefono/001-vai.jpg]
- **lunghezza e registro delle frasi** · aiuto · `{"frasi_campione": 10, "parole_per_frase_media": 20.5, "persona": "prima"}` — Prime 10 frasi in prosa di /about: 11-29 parole, media 20,5; «we», «us», «our» (Rosie's Place che parla). [prove/R06/testo-about-computer.txt]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "parziale", "salta_al_contenuto": "no", "trappole": 0}` — Dopo la scelta del suono i primi 4 Tab vanno su Kids Helpline, 1800 RESPECT, «Thanks, I understand» e Quick exit nel pannello che **non è visibile** (opacità 0); poi Home, sito Rosie's Place, Facilitators' guide, interruttore Toggle sound (13x13 px, opacità 0… [prove/R06/012-tasto.jpg, prove/R06/021-tasto.jpg]
- **porte per pubblici diversi** · arrivo computer · `{"criterio": "ruolo", "porte": 3}` — Dopo l'ingresso: le storie (carte), «FACILITATORS' GUIDE» (per chi accompagna) e «ABOUT THE PROJECT»; la soglia stessa non dice a chi sono rivolte le porte. Criterio misto: una porta per ruolo (facilitatori) e le altre per argomento. [prove/R06/003-aspetta.jpg]
- **prodotto mostrato** · arrivo computer · `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "illustrazione"}` — Illustrazioni a china (scena notturna, carte dei capitoli con numero e nome); 14 img senza nome nell'albero di accessibilità. Il prodotto è il racconto, non un software. [prove/R06/003-aspetta.jpg, prove/R06/fogli/007-sequenza-avvio.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 1, "parole": 35}` — «These stories are inspired by the real experiences of young people shared with us at Rosie's Place, stories of challenge, courage, and searching for doors that lead away from harm and toward safety and dignity.» Non dice che cosa sono (un fumetto in 5 capito… [prove/R06/001-vai.jpg, prove/R06/026-aspetta.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 1, "parole": 35}` — Stesso testo a 430x932; l'avvertenza occupa una striscia a tutta larghezza in basso. [prove/R06/telefono/001-vai.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 8, "domini_di_terzi": 4, "kb": 9915, "richieste": 76}` — Dall'arrivo senza scegliere il suono: 71 richieste dello stesso dominio (9656 kB), googletagmanager.com, use.typekit.net, fonts.googleapis.com, cdn.jsdelivr.net (257 kB: basis_transcoder.wasm); tra i file grandi 3 mp3 (3133, 938 e 259 kB) e 4 PNG da ~1 MB. fc… [prove/R06/misura-richieste-computer.json]
- **scelta del suono prima di entrare** · media · `{"predefinito": "nessuno", "scelta_prima_di_entrare": "sì"}` — START WITH SOUND / NO SOUND THANKS alla pari prima della scena; dopo, l'interruttore SOUND permette di cambiare. Caratteristica non nel vocabolario di piano.md §8: aggiunta con nome nuovo. [prove/R06/001-vai.jpg, prove/R06/telefono/001-vai.jpg]
- **testo corrente** · arrivo computer · `{"corpo_px": 23.3, "interlinea": 1.5}` — Lettura su /about: freight-macro-pro 23,3/35 px, colonna 766 px (circa 66 caratteri per riga: stima non misurata); soglia 28/42 px; avvertenza 14,9/18,6 px. [prove/R06/misura-bersagli-testo-meta-about-computer.json]
- **testo corrente** · arrivo telefono · `{"corpo_px": 21.3, "interlinea": 1.5}` — A 390x844 la soglia ha 21,3/32 px, paragrafo largo 342 px. [prove/R06/riepilogo-senza-posto.json]
- **effetto o animazione** · arrivo computer · M01 Soglia: comparsa del testo e dei bottoni · `{"trigger": "non indicato"}` — Soglia: comparsa del testo e dei bottoni. ferma la persona su una frase e una scelta prima di mostrare qualsiasi scena. [ricerca/movimento/R06.md#M01]
- **effetto o animazione** · arrivo computer · M02 Scelta del suono: uscita della soglia · `{"trigger": "clic"}` — Scelta del suono: uscita della soglia. Scelta del suono: uscita della soglia [ricerca/movimento/R06.md#M02]
- **effetto o animazione** · arrivo telefono · M08 Ingresso nel capitolo (telefono) · `{"trigger": "clic"}` — Ingresso nel capitolo (telefono). Ingresso nel capitolo (telefono) [ricerca/movimento/R06.md#M08]
- **effetto o animazione** · percorso principale · M04 Scena d'ingresso: treno, luci, nuvole, carte · `{"trigger": "clic"}` — Scena d'ingresso: treno, luci, nuvole, carte. dà un ambiente alle storie (una stazione di notte); le carte dei capitoli viaggiano come passeggeri. [ricerca/movimento/R06.md#M04]
- **effetto o animazione** · percorso principale · M05 Frecce Previous/Next · `{"trigger": "clic"}` — Frecce Previous/Next. Frecce Previous/Next [ricerca/movimento/R06.md#M05]
- **effetto o animazione** · percorso principale · M07 Barrette dell'interruttore del suono · `{"trigger": "non indicato"}` — Barrette dell'interruttore del suono. Barrette dell'interruttore del suono [ricerca/movimento/R06.md#M07]
- **effetto o animazione** · percorso principale · M10 Pannello di avvertenza: comparsa con ritardo · `{"trigger": "non indicato"}` — Pannello di avvertenza: comparsa con ritardo. Pannello di avvertenza: comparsa con ritardo [ricerca/movimento/R06.md#M10]
- **effetto o animazione** · percorso principale · M11 Suono · `{"trigger": "non indicato"}` — Suono. Suono [ricerca/movimento/R06.md#M11]
- **effetto o animazione** · scorrimento computer · M03 La porta che si apre (entrata nella scena) · `{"trigger": "non indicato"}` — La porta che si apre (entrata nella scena). unisce il gesto di entrare al titolo («sliding doors»): la scena si rivela come una porta di treno che scorre. [ricerca/movimento/R06.md#M03]
- **effetto o animazione** · scorrimento computer · M06 Voci e logo dell'intestazione · `{"trigger": "clic"}` — Voci e logo dell'intestazione. Voci e logo dell'intestazione [ricerca/movimento/R06.md#M06]
- **effetto o animazione** · scorrimento computer · M09 Scorrimento (Lenis) · `{"trigger": "scorrimento"}` — Scorrimento (Lenis). Scorrimento (Lenis) [ricerca/movimento/R06.md#M09]

### R20 · Ottografie (Otto van den Toorn) (29 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 85, "punti_di_riferimento": 0, "titoli": 4}` — 85 immagini senza attributo alt (nessuna con alt=""), nessun header/nav/main/footer/section, nessuna lingua dei punti di riferimento; 4 titoli h2 spezzati lettera per lettera in div (innerText «B\ne\na…»). Proxy dal DOM, non un lettore di schermo. [prove/R20/misure/meta-e-albero.json, prove/R20/misure/046-tabindex-link-home.json]
- **apertura del menu** · menu telefono · `{"direzione": "in larghezza dal basso al centro", "durata_ms": 503}` — Misura sui campioni di mutazione: la forma della pillola cambia in 503 ms; le immagini si riducono (scale 0,72-0,89) in circa 480 ms; la lettera del titolo e il fondo si sistemano in circa 970 ms. Il fondo diventa grigio (overlay). Orologio della pagina atten… [prove/R20/mobile/005-clic.jpg, prove/R20/mobile/005-clic.movimento.json]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 18, "distanza_min_px": 196, "larghezza_min_px": 169}` — Collegamenti nel DOM in vista: Info 169×18 px; le immagini-collegamento sono 217×289 o 335×447. La pillola (289×68) non è un collegamento. [prove/R20/script/bersagli-computer.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 25, "distanza_min_px": 37, "larghezza_min_px": 40}` — (Info) 40×25 px; le frecce della pillola aperta sono 37×37 px (passo, 430×932). [prove/R20/script/telefono-390.json, prove/R20/misure/m005-bersagli-pillola-aperta-telefono.json]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 4, "pulsanti": 0}` — (Info), due progetti pienamente visibili e un terzo in parte. La pillola non è un pulsante nel DOM. [prove/R20/mobile/003-home-telefono.jpg]
- **lunghezza e registro delle frasi** · arrivo computer · pagina Info · `{"frasi_campione": 5, "parole_per_frase_media": 23.2, "persona": "terza"}` — Cinque frasi della pagina Info (13, 21, 19, 30, 33 parole); terza persona, inglese, nessun elenco. [prove/R20/desktop/029-clic.jpg, prove/R20/fogli/031-033-about-scorrimento.jpg]
- **porte per pubblici diversi** · arrivo computer · `{"criterio": "argomento", "porte": 4}` — Quattro categorie per genere di lavoro (Beauty 9, Campaigns 8, Editorial 6, Celebrities 14 progetti); nessuna porta per ruolo (cliente, redazione). [prove/R20/desktop/003-arrivo-dopo-attesa.jpg, prove/R20/desktop/009-categoria-pillola-aperta.jpg]
- **prodotto mostrato** · scorrimento computer · `{"con_alternativa": "no", "con_legenda": "no", "tipo": "foto"}` — Le fotografie sono il contenuto. Il nome del progetto compare nella pillola solo al passaggio del mouse; nessuna delle 85 immagini ha l'attributo alt. [prove/R20/desktop/017-muovi.jpg, prove/R20/misure/046-tabindex-link-home.json]
- **prodotto mostrato** · scorrimento telefono · `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "foto"}` — Al telefono sotto ogni immagine c'è il nome del progetto in maiuscolo (FOR THOSE WITH CHARACTER); nessun attributo alt. [prove/R20/mobile/003-home-telefono.jpg, prove/R20/fogli/m004-scorri-telefono.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 1, "parole": 12}` — Dopo l'intro di caricamento (circa 10 s) il testo in alto, 14 px, dice «OTTO VAN DEN TOORN ↗ IS A BEAUTY & FASHION PHOTOGRAPHER FROM THE NETHERLANDS.» e il titolo di categoria «Beauty (09)» a 180 px. Conteggio senza ↗ e &. [prove/R20/desktop/003-arrivo-dopo-attesa.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 4, "domini_di_terzi": 2, "kb": 7812, "richieste": 124}` — 80 immagini (6645 kB: le immagini di tutti i progetti, a 1440 px, caricate subito), 13 script (197 kB), 4 file di carattere (301 kB), 15 fetch. Esterni: a.storyblok.com (CDN delle immagini) e plausible.io (statistiche). Dopo lo scorrimento completo del feed 1… [prove/R20/script/richieste.json, prove/R20/script/richieste-elenco.json]
- **segnale di posizione e di avanzamento** · percorso principale · progetto · `{"tipo": "barra"}` — In fondo a un progetto la pillola diventa «Next Project — Esqualo SS24» con un anello che conta da 24 a 100; a 100 la pagina passa da sola al progetto dopo (URL /campaigns/esqualo-ss24). [prove/R20/desktop/026-scorri.jpg, prove/R20/desktop/027-scorri.jpg]
- **struttura della navigazione** · menu telefono · `{"tipo": "menu_a_comparsa", "voci": 4}` — Stessa pillola; al tocco si espande con «Category» e le frecce ‹ › (37×37 px, div senza ruolo e con tabindex -1). Un tocco fuori la richiude. [prove/R20/mobile/005-clic.jpg, prove/R20/mobile/007-clic.jpg]
- **testo corrente** · arrivo computer · `{"caratteri_per_riga_max": 42, "corpo_px": 14, "interlinea": 1.29}` — Testo in alto in Suisse Int'l 14/18 px maiuscolo; titoli in Big Caslon 180 px. Il corpo vero è nella pagina Info (vedi riga seguente). [prove/R20/desktop/003-arrivo-dopo-attesa.jpg, prove/R20/misure/about-scala-tipografica-desktop.json]
- **testo corrente** · arrivo computer · pagina Info · `{"corpo_px": 32, "interlinea": 1.06}` — Big Caslon 32/34 px bianco su arancio, 572 px di colonna, letter-spacing 0,16 px; capoverso introduttivo a 64/66 px; titolo «Otto» 260/250 px, -7,8 px. Contrasto del bianco sui pixel: da 2,95 (arancio chiaro) a 7,19 (arancio scuro) in una JPEG, stima non CSS. [prove/R20/desktop/029-clic.jpg, prove/R20/misure/about-scala-tipografica-desktop.json]
- **effetto o animazione** · arrivo computer · intro · `{"trigger": "caricamento della pagina"}` — Intro a schermo nero: i nomi delle categorie ai lati, contatore a due cifre 00→99 che scorre, scritta «Ottografie» con le lettere che salgono, poi sei fotografie a pieno schermo in sequenza con il pulsante «Skip»; infine tutto si riduce nel layout della home.… [prove/R20/desktop/056-vai.jpg, prove/R20/fogli/056-arrivo-preloader.jpg]
- **effetto o animazione** · arrivo telefono · intro · `{"trigger": "caricamento della pagina"}` — Stessa intro con i nomi delle categorie impilati in verticale; «Skip» in basso. [prove/R20/mobile/001-vai.jpg, prove/R20/fogli/m001-arrivo-telefono.jpg]
- **effetto o animazione** · menu telefono · apertura isola · `{"durata_ms": 971, "proprieta": ["transform", "scale", "opacity"], "trigger": "tocco sulla pillola"}` — Come al computer; 971 ms è la componente più lunga (lettera del titolo), la forma della pillola 503 ms, le immagini circa 480 ms. [prove/R20/mobile/005-clic.movimento.json, prove/R20/misure/m005-clic-durate.txt]
- **effetto o animazione** · percorso principale · apertura isola (computer) · `{"durata_ms": 995, "proprieta": ["transform", "scale", "opacity"], "trigger": "clic sulla pillola"}` — Il fondo diventa grigio (overlay), le immagini si riducono in 477 ms (scale 0,72-0,89 ciascuna), la pillola si allarga in 499 ms, le lettere «eauty» scendono dietro una maschera mentre la «B» scivola al centro in 843-995 ms. Esc chiude: già chiuso al primo fo… [prove/R20/desktop/007-clic.jpg, prove/R20/desktop/007-clic.movimento.json]
- **effetto o animazione** · percorso principale · apertura pagina Info · `{"durata_ms": 1606, "proprieta": ["clip-path", "transform", "opacity"], "trigger": "clic su Info"}` — Un pannello nero scende dall'alto (clip-path) e si apre sull'arancione della pagina Info; «Otto» a 260 px; ultimo campione a 1606 ms. [prove/R20/desktop/029-clic.jpg, prove/R20/desktop/029-clic.movimento.json]
- **effetto o animazione** · percorso principale · apertura progetto · `{"durata_ms": 1031, "proprieta": ["transform", "scale", "opacity"], "trigger": "clic sull'immagine"}` — L'immagine cliccata cresce fino a coprire la finestra e il titolo (180 px) entra in bianco; la pillola diventa «Eyecare 2025 ⌄» con un cerchio «×». [prove/R20/desktop/018-clic.jpg, prove/R20/desktop/018-clic.movimento.json]
- **effetto o animazione** · percorso principale · cambio categoria · `{"durata_ms": 982, "proprieta": ["transform", "scale", "opacity"], "trigger": "clic sulla freccia"}` — Il campo di immagini di Beauty sale e esce in alto, quello di Campaigns entra dal basso; «B» ↔ «C» e l'etichetta della pillola scorrono in verticale; le miniature sotto la pillola traslano di 8 px per livello. L'indirizzo cambia in /campaigns. [prove/R20/desktop/010-clic.jpg, prove/R20/desktop/010-clic.movimento.json]
- **effetto o animazione** · percorso principale · chiusura progetto · `{"durata_ms": 1412, "proprieta": ["transform", "opacity"], "trigger": "clic su ×"}` — L'immagine a pieno schermo e il titolo escono, la categoria riappare con le immagini in posizione di partenza. [prove/R20/desktop/028-clic.jpg, prove/R20/desktop/028-clic.movimento.json]
- **effetto o animazione** · percorso principale · passaggio sull'immagine · `{"trigger": "passaggio del mouse"}` — La pillola mostra «View Project — Eyecare 2025 →» con la miniatura e il cursore diventa un cerchio scuro con «+». Non dipende dal passaggio del mouse per aprire: il clic funziona ovunque. [prove/R20/desktop/017-muovi.jpg, prove/R20/fogli/006-hover-pillola.jpg]
- **effetto o animazione** · percorso principale · prossimo progetto · `{"trigger": "scorrimento in fondo al progetto"}` — In fondo compare «Next Case» a 180 px e l'immagine seguente cresce a pieno schermo mentre un anello nella pillola va da 24 a 100; a 100 il progetto cambia e la pagina si azzera. [prove/R20/desktop/026-scorri.jpg, prove/R20/desktop/027-scorri.jpg]
- **effetto o animazione** · scorrimento computer · cursore · `{"fattore_per_fotogramma": 0.1, "proprieta": ["transform"], "trigger": "movimento del mouse"}` — Un cerchio scuro segue il mouse con translate3d: a ogni campione si copre il 10% della distanza residua (72 px su 720, poi 64,8 + …). Sopra un progetto contiene un «+». La curva è dedotta dai campioni, non letta dal codice. [prove/R20/desktop/005-scorri.movimento.json, prove/R20/desktop/017-muovi.jpg]
- **effetto o animazione** · scorrimento computer · elenco progetti · `{"curva": "decadimento esponenziale", "durata_ms": 2032, "fattore_per_fotogramma": 0.1, "proprieta": ["transf…` — Lo scorrimento è virtuale (scrollHeight 900): ogni li si sposta con translate3d in y a velocità diversa (parallasse); su 300 px di rotella un li arriva a -150 px, con passi di un decimo della distanza residua. Si assesta in 2032 ms. Le immagini passano davant… [prove/R20/desktop/005-scorri.jpg, prove/R20/desktop/005-scorri.movimento.json]
- **effetto o animazione** · scorrimento computer · pagina Info · `{"trigger": "rotella"}` — Tre sezioni a tutta pagina: ritratto fisso e testo che scorre; la sezione successiva entra dal basso come un pannello e cambia il colore di fondo (arancio, blu, verde) e il titolo (Otto, Story, Partners). [prove/R20/desktop/031-scorri.jpg, prove/R20/fogli/031-033-about-scorrimento.jpg]
- **effetto o animazione** · scorrimento telefono · elenco progetti · `{"trigger": "trascinamento verticale"}` — Stesso feed in verticale con parallasse; il titolo è ridotto alla lettera iniziale (206 px) e le immagini lo coprono. [prove/R20/mobile/004-scorri.jpg, prove/R20/fogli/m004-scorri-telefono.jpg]

### R21 · Lonely Planet, «Beat the Crowds: How to… (24 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"immagini_senza_alternativa": 0, "punti_di_riferimento": 10, "titoli": 9}` — main 1, nav 7 con nome («Global Navigation», «Breadcrumbs», «Social media links»…), footer 1, header globale; 9 titoli (H1 + 7 H2 numerati + «Why I love Venice»); 26 immagini, tutte con attributo alt (3 vuoti, decorative); collegamento «Skip to Main Content».… [prove/R21/misure/meta-e-albero.json, prove/R21/misure/001-albero-accessibilita.json]
- **apertura del menu** · menu telefono · `{"direzione": "da destra", "durata_ms": 180}` — WAAPI `transform: translateX(100%) → translateX(0px)`, durata 180 ms, ritardo 0, easing `ease-out` (letto da `timing.easing`), pannello 430×799 px sotto l'intestazione. A 300 ms dal tocco il pannello è già completo nelle foto. [prove/R21/mobile/002-clic.movimento.json, prove/R21/mobile/002-clic.jpg]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 0.37, "segnale": "testo"}` — A 1,6 Mbit/s e 150 ms di latenza il testo (17313 caratteri) c'è dopo 0,37 s (primo testo di almeno 40 caratteri), la prima pittura a 0,83 s, la fotografia grande a 4,5 s (LCP 4528 ms): le immagini arrivano senza scheletro né spinner (2 su 26 complete a 0,8 s)… [prove/R21/script/lenta.json, prove/R21/script/lenta-008-800ms.png]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 14, "distanza_min_px": 0, "larghezza_min_px": 14}` — Il più piccolo è «Share» (il pulsante misura 14×14 px dentro un cerchio di 46×46); briciole di pane alte 14 px; voci di menu alte 73 px. Collegamenti vicini a contatto (distanza 0). [prove/R21/script/bersagli-computer.json, prove/R22/misure/testo-corrente-e-share-script.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 14, "distanza_min_px": 8, "larghezza_min_px": 14}` — Telefono 390×844: «Share» 14×14 (in un cerchio 46×46), briciole di pane 14 px di altezza, «Add us on Google» 138×40; pulsanti dell'intestazione circa 57×60 px (stima dalle posizioni nelle foto). [prove/R21/script/telefono-390.json, prove/R21/misure/m004-testo-e-bersagli-telefono.json]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 17, "pulsanti": 2}` — Tra le voci: logo, 6 voci di menu, cerca, carrello, 5 briciole di pane, «ADD US ON G», autrice, «Summarized by AI»; pulsanti «Sign in» e «Share». Il collegamento «Skip to Main Content» esiste ma compare solo con il focus. [prove/R21/desktop/001-vai.jpg]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 10, "pulsanti": 3}` — Logo, cerca, carrello, 5 briciole, «ADD US ON», autrice; pulsanti «Open main menu», «Share», «CLOSE». [prove/R21/mobile/001-vai.jpg]
- **comportamento senza JavaScript** · senza JavaScript · `{"comandi_essenziali": "funzionano", "contenuto": "tutto", "navigazione": "funziona"}` — Senza JavaScript restano 17013 caratteri e 931 collegamenti: l'articolo intero, titoli, didascalie, piè di pagina. Al telefono (390×844) il menu appare già aperto sopra il titolo (voci e «SIGN IN» in elenco). Non si è provato il clic sui collegamenti; il pann… [prove/R21/script/nojs-1440.png, prove/R21/script/nojs-390.png]
- **effetti con movimento ridotto** · movimento ridotto · `{"effetti": 1, "invariati": 0, "sostituiti": 0, "tolti": 1}` — Con prefers-reduced-motion: reduce il passaggio del mouse su «Destinations» apre lo stesso pannello ma senza l'animazione `nav-pin` (opacità e traslazione di 8 px, 160 ms): 0 voci di movimento contro 3 senza riduzione. Campione di un solo effetto. Nessuna reg… [prove/R21/desktop/014-muovi.movimento.json, prove/R21/ridotto/002-muovi.movimento.json]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 10, "parole_per_frase_media": 21.6, "persona": "mista"}` — Dieci frasi trascritte dall'inizio dell'articolo (15, 27, 33, 29, 6, 17, 18, 39, 18, 14 parole): lunghezza molto variabile, frasi corte per i dati («The current count is just 47,652.»); terza persona nel racconto, «you» nei consigli, «I» nella biografia. [prove/R21/fogli/002-007-scorrimento-computer.jpg, prove/R21/desktop/002-scorri.jpg]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "sì", "salta_al_contenuto": "sì", "tab_fino_al_comando_principale": 1}` — Il primo Tab porta a «Skip to Main Content» (pillola nera 251×48 px in alto a sinistra, href #main-content); poi logo e voci di menu, con anello 2 px pieno (oklch 0,44 0,193 261°) a -3 px. Il focus su «Destinations» apre il pannello a comparsa. Trappole: non… [prove/R21/desktop/017-tasto.jpg, prove/R21/desktop/018-tasto.jpg]
- **porte per pubblici diversi** · arrivo computer · `{"criterio": "argomento", "porte": 6}` — Sei voci per argomento o prodotto (Destinations, Books, Trips, Travel Advice, Best in Travel, App); nessuna per ruolo di chi legge. [prove/R21/desktop/001-vai.jpg, prove/R21/desktop/014-muovi.jpg]
- **prodotto mostrato** · scorrimento telefono · `{"con_alternativa": "sì", "con_legenda": "sì", "tipo": "foto"}` — Come al computer; sopra la prima fotografia la didascalia con il credito. [prove/R21/mobile/001-vai.jpg, prove/R21/fogli/m004-scorrimento-telefono.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 1, "parole": 9}` — Titolo (H1, 48 px): «Beat the Crowds: How to Navigate Venice's Overtourism Problem»; sotto «Aug 11, 2026 • 12 MIN READ», l'autrice e il riquadro «HIGHLIGHTS — SUMMARIZED BY AI» con quattro punti («Writer Virginia DiGaetano offers seven tips for visiting Venic… [prove/R21/desktop/001-vai.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 1, "parole": 9}` — Stesso titolo a 40 px, sotto data, tempo di lettura e «ADD US ON G»; la fotografia viene dopo il titolo; in basso il pannello giallo con la biografia dell'autrice (con «CLOSE»). [prove/R21/mobile/001-vai.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 6, "domini_di_terzi": 8, "kb": 941, "richieste": 49}` — 941 kB e 49 richieste fino a 4 s dopo il load (32 script, 263 kB di JS; 6 file di carattere, 270 kB; 4 immagini, 271 kB). Domini esterni: newrelic, Google Tag Manager, AppsFlyer, Google News, Cohesion (servizi di terzi) e staticlp.com, cloudfront.net, imgix.n… [prove/R21/script/richieste.json, prove/R21/script/richieste-elenco.json]
- **testo corrente** · arrivo computer · `{"caratteri_per_riga_max": 104, "corpo_px": 18, "interlinea": 1.5}` — Corpo ABC Monument Grotesk 18/27 px, colonna di 893 px (mediana 91 caratteri per riga, massimo 104): più lunga dei 75 caratteri consigliati. Titoli di sezione ABC Arizona Flare 36 px maiuscolo; H1 American Grotesk 700 48/55 px. Link blu sottolineati. [prove/R21/script/bersagli-computer.json, prove/R21/misure/002-testo-corrente-computer.json]
- **testo corrente** · arrivo telefono · `{"caratteri_per_riga_max": 48, "corpo_px": 18, "interlinea": 1.5}` — Colonna di 358 px a 390 px: mediana 42 caratteri per riga, massimo 48; scrollWidth = larghezza (nessuno scorrimento orizzontale). [prove/R21/script/telefono-390.json, prove/R22/misure/testo-corrente-e-share-script.json]
- **effetto o animazione** · arrivo telefono · icone del menu · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 150, "proprieta": ["rotate"], "trigger": "caricamento…` — Quattro frecce (chevron) del menu ruotano da 180° a 0 in 150 ms al caricamento (transizione CSS di `rotate`); funzione: stato iniziale del menu. [prove/R21/mobile/001-vai.movimento.json]
- **effetto o animazione** · menu computer · pannello Destinations · `{"curva": "ease-out", "durata_ms": 160, "proprieta": ["opacity", "transform"], "trigger": "passaggio del mous…` — Animazione CSS `nav-pin` su ::before e ::after della voce: opacità 0→1 e `translateY(-8px)→0`, 160 ms, easing `ease-out` per keyframe (timing lineare), un solo ciclo, fill none. Il pannello a comparsa e la pagina scurita compaiono senza animazione misurata. C… [prove/R21/desktop/014-muovi.movimento.json, prove/R21/desktop/019-tasto.movimento.json]
- **effetto o animazione** · menu telefono · apertura del pannello · `{"curva": "ease-out", "durata_ms": 180, "proprieta": ["transform"], "trigger": "tocco sul pulsante «Open main…` — Pannello che entra da destra: translateX(100%)→0, 180 ms. [prove/R21/mobile/002-clic.movimento.json]
- **effetto o animazione** · percorso principale · condivisione · `{"trigger": "clic su «Share»"}` — Il cerchio «Share» si allarga in una fila di sei icone (copia link, X, e-mail, Pinterest, Reddit, Facebook); durata non misurata. [prove/R21/desktop/021-clic.jpg, prove/R21/fogli/021-022-condividi-cerca.jpg]
- **effetto o animazione** · percorso principale · focus da tastiera · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 150, "proprieta": ["border-width"], "trigger": "focus…` — Transizione CSS dello spessore del bordo da 0 a 1 px su 15 proprietà (bordi) quando il focus arriva sul collegamento «Skip» e sul logo. [prove/R21/desktop/017-tasto.movimento.json, prove/R21/desktop/018-tasto.movimento.json]
- **effetto o animazione** · scorrimento computer · link nel testo · `{"curva": "cubic-bezier(0, 0, 0.2, 1)", "durata_ms": 49.36, "proprieta": ["text-decoration-color"], "trigger"…` — Transizione CSS del colore della sottolineatura (da rgba(31,37,40,0.33) a trasparente) sui collegamenti: 49,36 ms. [prove/R21/desktop/014-muovi.movimento.json]

### R22 · Searching for Birds (Visual Cinnamon, T… (27 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"immagini_senza_alternativa": 0, "punti_di_riferimento": 4, "titoli": 37}` — main, article, header, footer; 28 `section`. 37 titoli con ordine insolito: H1, poi H3 «Chart: Snowy Owl Search Interest», H4 «Part One», H2 «I Am Not a Bird Person»… (le etichette delle parti sono H4 prima dei H2). 34 immagini tutte con attributo alt, 14 vuo… [prove/R22/misure/meta-e-albero.json, prove/R22/misure/001-struttura.json]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 0.29, "segnale": "testo"}` — A 1,6 Mbit/s e 150 ms: testo (25972 caratteri) dopo 0,29 s, prima pittura 1,12 s (che è anche LCP), DOMContentLoaded 14,6 s; a 0,8 s gli uccelli del titolo sono pochi (immagini 9 su 34), a 15 s 18 su 34, a 30 s 32 su 34 e 4,46 MB ricevuti. Nessuno scheletro n… [prove/R22/script/lenta.json, prove/R22/script/lenta-008-802ms.png]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 23, "distanza_min_px": 10, "larghezza_min_px": 92}` — Cinque collegamenti dei crediti: 106×25, 117×25, 92×25, 100×25, 113×23 px. Lo script ha contato anche due elementi della scheda dell'uccello (pulsante «Close image» 20×20, «All About Birds» 73×17) che a schermo non sono mostrati: non sono nel minimo. Telefono… [prove/R22/script/telefono-390.json, prove/R22/mobile/001-vai.jpg]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 0, "pulsanti": 0}` — Nessun comando in vista al primo schermo: titolo, data e tempo di lettura. I crediti con collegamenti e i campi di ricerca (invisibili finché non servono) stanno sotto. [prove/R22/desktop/001-vai.jpg]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 5, "pulsanti": 0}` — Cinque collegamenti dei crediti (Nadieh Bremer, Visual Cinnamon, Emily Barone, The Data Desk, Macaulay Library) sottolineati in rosso. [prove/R22/mobile/001-vai.jpg]
- **comportamento senza JavaScript** · senza JavaScript · `{"comandi_essenziali": "no", "contenuto": "parziale", "navigazione": "funziona"}` — Senza JavaScript: titolo, uccelli del titolo, 25972 caratteri di testo, note a margine, penne e illustrazioni, sezione «Data & methodology» e collegamenti (47). Mancano grafici, uovo, nido, mappa, assistente e schede degli uccelli: restano vuoti bianchi tra i… [prove/R22/script/nojs-1440.png, prove/R22/script/nojs-390.png]
- **corto subito, lungo a richiesta** · aiuto · `{"meccanismo": "suggerimento"}` — Note a margine (corsivo piccolo, a destra del testo al computer, dentro il testo al telefono) con spiegazioni brevi; parole con sottolineatura tratteggiata e `[*]` che rimandano a un'osservazione; la metodologia estesa sta in fondo («Data & methodology»). [prove/R22/fogli/002-005-scorrimento-computer.jpg, prove/R22/fogli/s002-nojs-pagina-intera-inizio.jpg]
- **effetti con movimento ridotto** · movimento ridotto · `{"effetti": 2, "invariati": 1, "sostituiti": 0, "tolti": 1}` — Il foglio di stile ha una sola regola: `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }` (lo scorrimento morbido è tolto con la riduzione). L'effetto legato allo scorrimento dell'uovo (sezione «Bird shapes») confrontato a… [prove/R22/misure/regole-reduced-motion-css.txt, prove/R22/fogli/n003-scorrimento-egg-normale-vs-ridotto.jpg]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 9, "parole_per_frase_media": 20.1, "persona": "mista"}` — Nove frasi trascritte dai capitoli iniziali (20, 32, 14, 31, 14, 16, 20, 25, 9 parole): spiegazioni brevi e dirette, «you'll» e «us/our» nel racconto, terza persona nei dati. [prove/R22/fogli/002-005-scorrimento-computer.jpg, prove/R22/fogli/010-013-scorrimento-computer.jpg]
- **messaggio di errore** · errore · `{"dice_come_rimediare": "no", "mantiene_i_dati": "sì", "sotto_il_campo": "sì"}` — Nel campo «Search for a bird…», dopo «owl» (suggerimenti «American Barn Owl · Owls», «Barred Owl», «Boreal Owl») si aggiunge «zzqq»: sotto il campo compare «No birds found»; il testo digitato resta. Il messaggio non dice come rimediare. [prove/R22/desktop/036-clic.jpg, prove/R22/desktop/037-scrivi.jpg]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "sì", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 1, "trappole": 0}` — Il primo Tab arriva su «Nadieh Bremer» (primo collegamento dei crediti), poi Visual Cinnamon, Emily Barone, The Data Desk, Macaulay Library, Google Trends database: ordine di lettura; la pagina scorre fino al collegamento; anello 2 px pieno #f9564e. 55 elemen… [prove/R22/desktop/025-tasto.jpg, prove/R22/desktop/030-tasto.jpg]
- **prodotto mostrato** · scorrimento computer · `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "dimostrazione_viva"}` — La storia è il prodotto: grafici interattivi in SVG (nido con Stati, uovo che si scompone in forme-tipi-specie, linee di interesse nel tempo, mappa a uova, flusso di tre colonne), con titoli, testi di accompagnamento e legende; gli SVG non hanno testo alterna… [prove/R22/fogli/002-005-scorrimento-computer.jpg, prove/R22/fogli/006-009-scorrimento-computer.jpg]
- **prodotto mostrato** · scorrimento telefono · `{"con_alternativa": "no", "con_legenda": "sì", "tipo": "dimostrazione_viva"}` — Gli stessi grafici sul telefono (nido con anello di Stati, uovo con le schede traslucide «American birds», «Bird shapes»). [prove/R22/mobile/004-scorri.jpg, prove/R22/fogli/m001-007-telefono.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 1, "parole": 3}` — Primo schermo (1440×900): sette uccelli illustrati a mano che sbucano dai bordi attorno al titolo «Searching for Birds» (115 px, Jost leggero), sotto «FEBRUARY 12, 2026 · 10 MIN READ». Non c'è una frase che spieghi la storia: la prima è sotto la piega («Winte… [prove/R22/desktop/001-vai.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 1, "parole": 3}` — Stesso titolo a 40 px con gli uccelli ai bordi; sotto data e tempo, i crediti («Concept, analysis, design, and development by Nadieh Bremer | Visual Cinnamon», «Story writing and editing by Emily Barone | The Data Desk», «Sponsored by Google Trends», fotograf… [prove/R22/mobile/001-vai.jpg, prove/R22/fogli/m001-007-telefono.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 10, "domini_di_terzi": 3, "kb": 8548, "richieste": 63}` — 63 richieste e 8548 kB fino a 4 s dopo il load: 35 immagini (7657 kB: le più pesanti nest-background.jpg 2180 kB, egg-background.png 1079 kB, bald_eagle_top_down.png 592 kB), 2 script (107 kB), 10 file di carattere (265 kB), 12 fetch di dati (tra cui google_t… [prove/R22/script/richieste.json, prove/R22/script/richieste-elenco.json]
- **stampa** · stampa · `{"pagine_pdf": 21}` — Con media print: 21 pagine A4 e 12 MB di PDF; 3 elementi di navigazione su 7 nascosti (campi di ricerca/pulsanti). Il PDF non si è potuto rasterizzare (manca Ghostscript): leggibilità e comandi nascosti non giudicati. [prove/R22/script/stampa-schermo.png, prove/R22/script/stampa.json]
- **testo corrente** · arrivo computer · `{"caratteri_per_riga_max": 87, "corpo_px": 16, "interlinea": 1.7}` — Zilla Slab 16/27,2 px; colonna di 599 px (503 px nelle schede traslucide), mediana 74 caratteri per riga, massimo 87. Titoli e tutto il resto in Jost; note a margine in corsivo piccolo. [prove/R22/misure/testo-corrente-e-share-script.json]
- **testo corrente** · arrivo telefono · `{"caratteri_per_riga_max": 76, "corpo_px": 16, "interlinea": 1.7}` — Colonna di 358 px: mediana 49 caratteri per riga, massimo 76; le note a margine passano dentro il testo in corsivo. [prove/R22/misure/testo-corrente-e-share-script.json, prove/R22/mobile/002-scorri.jpg]
- **effetto o animazione** · arrivo computer · sfondi uovo e nido · `{"curva": "ease", "durata_ms": 500, "proprieta": ["opacity"], "trigger": "caricamento della pagina"}` — Transizione CSS di opacità 0→1 sui due sfondi (`div#egg-behind` e `div#nest-behind`, classe `dataviz-background-image`), 500 ms, ritardo 0, fill `backwards`; gli elementi stanno più in basso nella pagina (y=4047). [prove/R22/desktop/001-vai.movimento.json]
- **effetto o animazione** · arrivo computer · uccelli del titolo · `{"trigger": "passaggio del mouse"}` — Le pupille degli uccelli seguono il cursore (confronto di tre fotogrammi su un uccello) e vicino al cursore compare un'etichetta curva con il nome («Cedar Waxwing»). Registrazione del movimento troncata (oltre 17000 bersagli): i valori non sono misurati. [prove/R22/desktop/019-vai.jpg, prove/R22/desktop/020-muovi.jpg]
- **effetto o animazione** · dati · mappa degli Stati · `{"curva": "ease", "durata_ms": 500, "proprieta": ["opacity"], "trigger": "passaggio del mouse su uno Stato"}` — Passando su uno Stato gli altri scendono a opacità 0,2 (transizione di 500 ms, easing `ease`) e compare il cartellino «TEXAS» con i primi dieci uccelli; a destra compare la scheda del primo uccello (Northern Cardinal). [prove/R22/desktop/023-muovi.jpg, prove/R22/desktop/023-muovi.movimento.json]
- **effetto o animazione** · percorso principale · assistente · `{"curva": "ease-out", "durata_ms": 300, "proprieta": ["opacity", "transform"], "trigger": "caricamento della…` — Animazione CSS `fadeIn` del primo messaggio dell'assistente (`div.message.ai-message`): opacità 0→1 e `translateY(10px)→0`, 300 ms, easing `ease-out` per keyframe. L'assistente non è stato interrogato. [prove/R22/desktop/001-vai.movimento.json]
- **effetto o animazione** · percorso principale · ricerca di un uccello · `{"trigger": "digitazione"}` — Mentre si digita «owl» compare l'elenco dei suggerimenti con la parte che coincide in grassetto e l'uovo evidenzia in arancione le celle delle civette e un'altra forma; con «owlzzqq» l'elenco diventa «No birds found». [prove/R22/desktop/037-scrivi.jpg, prove/R22/desktop/038-scrivi.jpg]
- **effetto o animazione** · percorso principale · scorrimento morbido · `{"proprieta": ["scroll-behavior"], "trigger": "scorrimento programmato o ancora"}` — Regola CSS `scroll-behavior: smooth` su `html`, applicata solo con `prefers-reduced-motion: no-preference`; durata e curva sono quelle del browser, non misurate. [prove/R22/misure/regole-reduced-motion-css.txt]
- **effetto o animazione** · scorrimento computer · grafico «Waves of Interest» · `{"trigger": "scorrimento"}` — Il grafico a linee dei 50 uccelli passa tra tre stati con lo scorrimento: tutte le linee, poi una selezione evidenziata con la scheda traslucida («Pandemic peak», «A bit out of line») e le altre attenuate. [prove/R22/fogli/014-018-scorrimento-computer.jpg, prove/R22/desktop/016-scorri.jpg]
- **effetto o animazione** · scorrimento computer · uovo e nido · `{"trigger": "scorrimento"}` — Gli strati dell'uovo (tutti gli uccelli → forme → tipi → specie) e le schede traslucide cambiano con lo scorrimento (nessuna animazione WAAPI o CSS registrata: i valori sono legati alla posizione). Nessuna misura di durata né di rapporto. [prove/R22/fogli/002-005-scorrimento-computer.jpg, prove/R22/fogli/006-009-scorrimento-computer.jpg]

### R50 · Text-to-Mic (Scorchsoft) (31 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 0, "punti_di_riferimento": 9, "titoli": 45}` — header 1, nav 6, main 0, footer 1, aside 1; un solo H1; nessun «salta al contenuto». [prove/R50/lettura-desktop.json]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 4.7, "segnale": "vuoto"}` — Con 400 kbit/s e 400 ms di latenza, cache spenta, solo Chromium: a 1,5 s il corpo è vuoto; primo disegno a 4,7 s; pagina completa entro 14 s. Le foto «1_5s» sono state scattate dopo il campione e non mostrano il vuoto. [prove/R50/script/007-rete-lenta-1_5s.png, prove/R50/script/008-rete-lenta-4s.png]
- **avvio di audio e video** · media · `{"avvio_automatico": "no", "controlli_nativi": "sì", "sottotitoli": "no", "trascrizione": "no"}` — Video MP4 su dominio proprio (524,9 s): parte dopo il clic su Play; nessuna traccia di sottotitoli (0 textTracks). [prove/R50/desktop/022-clic.jpg, prove/R50/lettura-desktop.json]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 16, "larghezza_min_px": 16}` — Minimo sulle icone e sui chevron; il comando principale è 267x60. [prove/R50/lettura-desktop.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 16, "larghezza_min_px": 16}` — Misura a 390x844. [prove/R50/script/misure-script.json]
- **chi c'è dietro e le fonti** · fiducia · `{"data": "sì", "firma": "sì", "fonti_collegate": "sì", "versione": "sì"}` — Scorchsoft Ltd con indirizzo e numero d'impresa nel piede; «v1.4.1 · 18 Aug 2025» per Windows e «v1.0.5» senza data per Mac; SHA-256 troncato a 16 caratteri; collegamenti a GitHub, VB-Cable e documentazione OpenAI. [prove/R50/desktop/008-scorri.jpg, prove/R50/desktop/007-scorri.jpg]
- **comandi da copiare** · installazione · `{"comando_copiabile": "no", "sistema_selezionabile": "sì", "verifica_dopo": "no"}` — Nessun comando di terminale: i tasti rapidi (Ctrl+Shift+0, Ctrl+Shift+8) sono mostrati come tasti; nessun passo di verifica dopo la scelta del microfono; Windows e macOS sono due schede di download. [prove/R50/desktop/004-scorri.jpg]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 13, "pulsanti": 4}` — Undici comandi sono della barra dell'agenzia (About, Solutions, Portfolio, Resources, Contact, Book a call, menu a freccia); il resto è briciole di pane, i tre pulsanti del prodotto e Play. [prove/R50/lettura-desktop.json, prove/R50/desktop/001-vai.jpg]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 7, "pulsanti": 2}` — Misura a 390x844. [prove/R50/script/misure-script.json, prove/R50/script/001-telefono-arrivo.png]
- **effetti con movimento ridotto** · movimento ridotto · `{"effetti": 5, "invariati": 4, "sostituiti": 0, "tolti": 1}` — Tolta la pulsazione del pulsante Play (0 animazioni all'arrivo contro 1); invariati ombra della barra, fisarmonica FAQ, pannello del menu, colore dei collegamenti. Menu telefono e finestra della galleria non provati con ridotto. [prove/R50/ridotto/001-vai.jpg, prove/R50/ridotto/003-clic.jpg]
- **guida a passi con ripresa** · installazione · `{"indicatore": "sì", "indietro": "no", "passi": 4, "ripresa_dopo_chiusura": "no"}` — Quattro passi in colonna con numeri e schermate; nessuno stato salvato; il riquadro «What you need» (VB-Cable, chiave OpenAI) sta a sinistra e resta fermo. [prove/R50/desktop/003-scorri.jpg, prove/R50/desktop/004-scorri.jpg]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 10, "parole_per_frase_media": 16.4, "persona": "seconda"}` — Imperativi e «you» («Type a message…», «Choose voices…»); gergo: virtual audio cable, API key, metered, transcribe. [prove/R50/campione-frasi-10.txt, prove/R50/testo-pagina-desktop.txt]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "debole", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 14, "trappole": 0}` — Il 14° Tab arriva a «Download for Windows»; contorno 1 px «auto» a opacità 50% quasi invisibile sul rosso; sul logo compare un riquadro grigio sottile. Nessun <main>. [prove/R50/desktop/037-tasto.jpg, prove/R50/desktop/024-tasto.jpg]
- **prodotto mostrato** · arrivo computer · `{"con_alternativa": "sì", "con_legenda": "no", "tipo": "video"}` — Poster illustrato (titolo grande sopra un portatile) con «Play video»; il video MP4 di 8:44 mostra il programma vero con una persona in un tondo. [prove/R50/desktop/001-vai.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 3, "parole": 49}` — Titolo «Text-to-Mic», sottotitolo e paragrafo di quattro righe: «Type or record what you want to say, then play natural speech through your speakers, headset or a virtual microphone. Free, open-source software for Windows and Mac; bring an OpenAI API key for… [prove/R50/desktop/001-vai.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 3, "parole": 49}` — Stesso testo del computer, sei righe di paragrafo a 430 px. [prove/R50/telefono/001-vai.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 7, "domini_di_terzi": 2, "kb": 445, "richieste": 50}` — Cache spenta, CDP. Terzi: Google Tag Manager e un bucket S3 (immagine di condivisione). YouTube solo come collegamento. La lettura con passo.mjs aveva contato 66 richieste (finestra di misura diversa). [prove/R50/script/misure-script.json]
- **scelta per sistema o versione** · installazione · `{"modo": "manuale"}` — Il pulsante principale dice «Download for Windows» anche con un browser Linux; macOS sta in «Other platforms» e nella sezione Download. [prove/R50/desktop/008-scorri.jpg, prove/R50/desktop/001-vai.jpg]
- **segnale di posizione e di avanzamento** · percorso principale · `{"tipo": "passi"}` — Quattro passi numerati in cerchi (Download and open the app, Configure voices and output, Select the meeting microphone, Type or record, then play), ciascuno con schermata vera. [prove/R50/desktop/003-scorri.jpg, prove/R50/desktop/004-scorri.jpg]
- **struttura della navigazione** · menu telefono · `{"tipo": "pannello", "voci": 7}` — Pannello da destra: About, Services, Products, Capabilities, Portfolio, Resources, Contact (le voci con freccia si espandono). [prove/R50/telefono/002-clic.jpg]
- **testimonianze di utenti** · fiducia · `{"con_foto": "no", "con_ruolo": "sì", "numero": 1}` — Una citazione lunga (circa 130 parole) di «Niko, Text-to-Mic user · Member of the mute community» che racconta glossectomia e perdita della laringe; perché esiste: «built when a team member lost their voice». [prove/R50/desktop/006-scorri.jpg]
- **testo corrente** · arrivo computer · `{"corpo_px": 18, "interlinea": 1.56}` — Open Sans 18 px, colore rgb(51,65,85); titoli Poppins. Righe del paragrafo d'apertura di circa 65 caratteri (stima dalla foto). [prove/R50/lettura-desktop.json, prove/R50/desktop/001-vai.jpg]
- **effetto o animazione** · arrivo computer · pulsazione del pulsante Play · `{"curva": "ease-out", "durata_ms": 1800, "proprieta": "opacity 0,55→0 e scale 1→1,12", "trigger": "arrivo"}` — Anello che si espande dal pulsante Play, 3 ripetizioni dopo 600 ms di ritardo. L'orologio della pagina correva a 0,07x durante la misura: la durata è quella dei keyframe, non un tempo di orologio verificato. [prove/R50/effetti-misurati.tsv, prove/R50/desktop/001-vai.jpg]
- **effetto o animazione** · menu computer · pannello Solutions · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 200, "proprieta": "opacity 0→1 e rotate chevron", "tri…` — Il pannello a quattro colonne compare in dissolvenza; il colore del titolo cambia in 150 ms; resta aperto finché il puntatore non esce. [prove/R50/effetti-misurati.tsv, prove/R50/desktop/019-muovi.jpg]
- **effetto o animazione** · menu telefono · velo e voci del menu · `{"curva": "cubic-bezier(0, 0, 0.2, 1)", "durata_ms": 300, "proprieta": "opacity + translate 16px→0, ritardi 9…` — Voci sfalsate di 40 ms. [prove/R50/effetti-misurati.tsv, prove/R50/telefono/002-clic.jpg]
- **effetto o animazione** · percorso principale · apertura di una domanda FAQ · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 200, "proprieta": "grid-template-rows + rotate 180°",…` — Una domanda alla volta: aprendo la seconda si chiude la prima; il chevron ruota di 180°; sfondo del titolo 150 ms. [prove/R50/effetti-misurati.tsv, prove/R50/desktop/011-clic.jpg]
- **effetto o animazione** · percorso principale · apertura di «Full history» · `{"durata_ms": 0, "proprieta": "display (altezza della pagina +720 px)", "trigger": "clic"}` — Nessuna transizione registrata: la pagina cresce da 8.489 a 9.209 px; il simbolo passa da + a −. [prove/R50/desktop/013-clic.jpg]
- **effetto o animazione** · percorso principale · finestra di ingrandimento della galleria · `{"trigger": "clic"}` — Il riquadro bianco compare prima dell'immagine (primo fotogramma vuoto, poi l'immagine); ← → e Close in basso. [prove/R50/desktop/016-clic-seq-01.jpg, prove/R50/desktop/016-clic.jpg]
- **effetto o animazione** · scorrimento computer · ingrandimento di una schermata della galleria · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 200, "proprieta": "scale 1→1,02", "trigger": "passaggi…` — Ingrandimento del 2% al passaggio; il clic apre la finestra (dialog) con ← → e Close; Esc la chiude e riporta il focus al pulsante. [prove/R50/effetti-misurati.tsv, prove/R50/desktop/015-muovi.jpg]
- **effetto o animazione** · scorrimento computer · ombra della barra fissa · `{"curva": "ease", "durata_ms": 200, "proprieta": "box-shadow", "trigger": "scorrimento"}` — La barra fissa in alto prende un'ombra scorrendo. [prove/R50/effetti-misurati.tsv, prove/R50/desktop/002-scorri.jpg]
- **effetto o animazione** · scorrimento computer · ombra delle schede · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 300, "proprieta": "box-shadow", "trigger": "passaggio_…` — Le tre schede «What it does» e le schede di download si sollevano con un'ombra. [prove/R50/effetti-misurati.tsv, prove/R50/desktop/015-muovi.jpg]

### R51 · Proloquo2Go / Proloquo (AssistiveWare) (28 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 0, "immagini_senza_alternativa": 0, "punti_di_riferimento": 7, "titoli": 23}` — header 1, nav 4, main 1, footer 1; 57 immagini con alt; i badge dello store hanno il nome dall'alt dell'immagine. [prove/R51/lettura-desktop.json]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 4.2, "segnale": "vuoto"}` — 400 kbit/s, 400 ms: corpo vuoto a 1,5 s, primo disegno a 4,2 s, completa entro 14 s; solo Chromium. [prove/R51/script/misure-script.json, prove/R51/script/008-rete-lenta-4s.png]
- **avvio di audio e video** · media · `{"avvio_automatico": "no", "controlli_nativi": "sì", "sottotitoli": "sì", "trascrizione": "no"}` — «See Proloquo2Go in action» apre un riquadro con un incorporamento YouTube (autoplay=1 dopo il clic, cc_load_policy=1, 0:51); nessun iframe prima del clic; Esc e «Close» chiudono. [prove/R51/desktop/034-clic.jpg, prove/R51/lettura-desktop.json]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 16, "larghezza_min_px": 24}` — Minimo sui collegamenti di testo; i pulsanti voce sono 44x44. [prove/R51/lettura-desktop.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 16, "larghezza_min_px": 69}` — Misura a 390x844. [prove/R51/script/misure-script.json]
- **campione di suono** · media · `{"campioni": 4, "durata_indicata": "no", "testo_accanto": "no"}` — Quattro pulsanti rotondi 44x44 con il nome (Rosie, Josh, Peter, Lily); nel codice 20 pulsanti (15 voci diverse) in un carosello. Il testo detto non è mostrato. In questo browser senza uscita audio il pulsante restava «Play …» dopo il clic: se parta, si fermi… [prove/R51/desktop/006-scorri.jpg, prove/R51/desktop/007-clic.jpg]
- **chi c'è dietro e le fonti** · fiducia · `{"data": "no", "firma": "sì", "fonti_collegate": "no", "versione": "sì"}` — «Copyright 2026 AssistiveWare B.V.»; compatibilità iOS 18 / watchOS 11 dichiarata; «Featured on» (BBC, CNN, Guardian, Fox) senza collegamenti; «award-winning» senza nome né anno; prezzo senza data. [prove/R51/testo-pagina-desktop.txt, prove/R51/desktop/009-scorri.jpg]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 6, "pulsanti": 4}` — Barra globale (Products, Support, AAC Resources, Blog, About Us, ricerca, lingua, Log in) più «Download on the App Store» e «See pricing» sotto il bordo. [prove/R51/lettura-desktop.json]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 4, "pulsanti": 1}` — Misura a 390x844. [prove/R51/script/misure-script.json]
- **effetti con movimento ridotto** · movimento ridotto · `{"effetti": 1, "invariati": 1, "sostituiti": 0, "tolti": 0}` — Il foglio di stile ha 33 regole prefers-reduced-motion ma all'arrivo non c'è nessuna animazione da togliere; la barra di prodotto continua a scorrere in 280 ms. Menu, schede e finestra di ricerca non provati con ridotto. [prove/R51/ridotto/001-vai.jpg, prove/R51/ridotto/003-scorri.jpg]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 10, "parole_per_frase_media": 16.3, "persona": "mista"}` — «We all use AAC - think about texting on your mobile, gestures, or facial expressions.» spiega prima cos'è la CAA; termini del dominio (core words, keyguards, Crescendo™, Thinking Space™). [prove/R51/campione-frasi-10.txt, prove/R51/testo-pagina-desktop.txt]
- **messaggio di errore** · errore · ricerca senza risultati · `{"dice_come_rimediare": "no", "mantiene_i_dati": "sì", "sotto_il_campo": "sì"}` — «No results found» sotto il campo (che conserva «zzzqqq») e «Did you find what you were looking for? Yes / No»; nessun suggerimento. [prove/R51/desktop/031-tasto.jpg]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "sì", "salta_al_contenuto": "no", "tab_fino_al_comando_principale": 10, "trappole": 0}` — Il 10° Tab arriva a «Download now» (badge dello store); contorno pieno di 2 px bordeaux, offset 2 px. Nessun «salta al contenuto». [prove/R51/tastiera/011-tasto.jpg]
- **porte per pubblici diversi** · menu computer · `{"criterio": "argomento", "porte": 3}` — Il menu Products divide per tipo di app (didattiche, CAA, altre); le persone (utente, genitore, logopedista) si riconoscono solo nel testo e nelle testimonianze; la pagina /products/proloquo ha «Proloquo Coach» per famiglie e insegnanti. [prove/R51/desktop/015-clic.jpg]
- **prodotto mostrato** · arrivo computer · `{"con_alternativa": "sì", "con_legenda": "no", "tipo": "foto"}` — Foto a tutta larghezza di una persona che tocca un iPad in una custodia rosa; l'icona e il nome della app sotto. [prove/R51/desktop/001-vai.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 4, "parole": 57}` — Titolo «The world's most popular AAC app for iPad and iPhone» (affermazione del produttore) e paragrafo che nomina chi la usa («nonspeaking children and adults»). [prove/R51/desktop/001-vai.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 4, "parole": 57}` — Stesso testo; la foto è ridotta a una fascia, icona e titolo sono nella prima schermata. [prove/R51/telefono/001-vai.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 2, "domini_di_terzi": 3, "kb": 515, "richieste": 26}` — Terzi: Google Tag Manager, chimpstatic (Mailchimp), api.ipinfodb.com (localizzazione dall'IP); YouTube solo dopo il clic su «See in action»; reCAPTCHA nel modulo del piede. [prove/R51/script/misure-script.json]
- **tabella di compatibilità** · dati · `{"dichiara_non_provato": "no", "righe": 2}` — Schede «For iOS / For macOS» con prezzo, dispositivi e versioni minime; nessuna riga «non provato». [prove/R51/desktop/017-scorri.jpg, prove/R51/desktop/018-clic.jpg]
- **testimonianze di utenti** · fiducia · `{"con_foto": "sì", "con_ruolo": "sì", "numero": 3}` — Tre schede con foto tonda, nome e ruolo (madre di una utente CAA, utente e autore di campagne, madre); frasi di 20-30 parole. [prove/R51/desktop/009-scorri.jpg, prove/R51/desktop/017-scorri.jpg]
- **testo corrente** · arrivo telefono · `{"corpo_px": 18, "interlinea": 1.5}` — Misura a 390x844. [prove/R51/script/misure-script.json]
- **effetto o animazione** · arrivo computer · colore dei collegamenti · `{"curva": "ease-in-out", "durata_ms": 150, "proprieta": "color", "trigger": "passaggio_mouse"}` — Voci della barra: dal blu notte al bordeaux. [prove/R51/effetti-misurati.tsv, prove/R51/desktop/001-vai.jpg]
- **effetto o animazione** · errore · finestra di ricerca · `{"curva": "ease-out", "durata_ms": 300, "proprieta": "transform translateY(-50px)→0 + velo opacity 150 ms lin…` — Si apre dalla lente con campo, «Popular products» e «Support». [prove/R51/effetti-misurati.tsv, prove/R51/desktop/029-clic.jpg]
- **effetto o animazione** · menu computer · pannello Products · `{"trigger": "clic"}` — Si apre al clic (bottone); la comparsa del pannello non è stata registrata come animazione. [prove/R51/desktop/015-clic.jpg]
- **effetto o animazione** · menu telefono · pannello del menu · `{"curva": "ease-in-out", "durata_ms": 300, "proprieta": "transform translate(100%)→none + velo opacity 0→0,9"…` — Velo 150 ms lineare; scorrimento del corpo bloccato. [prove/R51/effetti-misurati.tsv, prove/R51/telefono/009-clic.jpg]
- **effetto o animazione** · scorrimento computer · anello di focus dei pulsanti voce · `{"curva": "ease-in-out", "durata_ms": 150, "proprieta": "box-shadow (anello 2 px + bordo bianco interno)", "t…` — Compare al clic e al Tab; il pulsante non cambia icona. [prove/R51/effetti-misurati.tsv, prove/R51/desktop/foglio-voci-ritaglio.jpg]
- **effetto o animazione** · scorrimento computer · barra di prodotto fissa · `{"curva": "ease", "durata_ms": 280, "proprieta": "opacity 0→1 (250 ms) + translateY(-100%)→0", "trigger": "sc…` — Sostituisce la barra globale scorrendo in giù; scorrendo in su torna la barra globale (inverso, 250/280 ms). Con movimento ridotto resta uguale. [prove/R51/effetti-misurati.tsv, prove/R51/desktop/003-scorri.jpg]
- **effetto o animazione** · scorrimento computer · schede iOS / macOS · `{"curva": "linear", "durata_ms": 150, "proprieta": "opacity 0→1 del pannello", "trigger": "clic"}` — Colore dell'etichetta 150 ms ease-in-out. [prove/R51/effetti-misurati.tsv, prove/R51/desktop/018-clic.jpg]

### R52 · Grid (Smartbox) (24 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 1, "immagini_senza_alternativa": 0, "punti_di_riferimento": 6, "titoli": 19}` — header 1, nav 2, main 1, footer 1, search 1; 16 immagini con alt vuoto su 50; il campo e-mail della newsletter senza nome. [prove/R52/lettura-desktop.json]
- **apertura del menu** · menu telefono · `{"direzione": "da destra", "durata_ms": 500}` — transform translate(100%)→0, 500 ms cubic-bezier(0.4, 0, 0.2, 1). [prove/R52/telefono/010-clic.jpg, prove/R52/effetti-misurati.tsv]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 3.3, "segnale": "vuoto"}` — 400 kbit/s, 400 ms: corpo vuoto a 1,5 s, primo disegno a 3,3 s; a 22 s il documento risultava ancora «loading» (immagini e media in arrivo); solo Chromium. [prove/R52/script/misure-script.json]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 4, "pulsanti": 21}` — Il conteggio dei pulsanti comprende le due frecce e gli otto punti del carosello e i comandi della barra (tema, lingua, ricerca). [prove/R52/lettura-desktop.json]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 0, "link": 1, "pulsanti": 15}` — Misura a 390x844: comprende frecce e punti del carosello. [prove/R52/script/misure-script.json]
- **effetti con movimento ridotto** · movimento ridotto · `{"effetti": 2, "invariati": 0, "sostituiti": 0, "tolti": 2}` — Tolti il cross-fade infinito della bandiera (2 livelli) e la comparsa delle sezioni (0 animazioni all'arrivo e allo scorrimento). Carosello e cambio di tema non provati con ridotto. [prove/R52/ridotto/001-vai.jpg, prove/R52/ridotto/002-scorri.jpg]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 10, "parole_per_frase_media": 14.8, "persona": "mista"}` — Inglese britannico; «Finding the right AAC setup is personal.» (5 parole) accanto a frasi di 25; termini poco spiegati (keyguard, scanning, calibrate). [prove/R52/campione-frasi-10.txt, prove/R52/testo-pagina-desktop.txt]
- **messaggio di errore** · errore · ricerca senza risultati · `{"dice_come_rimediare": "sì", "mantiene_i_dati": "sì", "sotto_il_campo": "sì"}` — Hub: «No results found. Please search for a new term or select different filters.»; il termine resta nel campo e i filtri restano visibili. [prove/R52/desktop/021-vai.jpg]
- **percorso da tastiera** · tastiera · `{"focus_visibile": "sì", "salta_al_contenuto": "sì", "tab_fino_al_comando_principale": 11, "trappole": 0}` — «Skip to content» è il primo Tab; l'11° arriva a «Request a quote» con contorno pieno di 2 px azzurro (rgb 0,150,214), offset 2 px. [prove/R52/tastiera/012-tasto.jpg]
- **porte per pubblici diversi** · menu computer · `{"criterio": "compito", "porte": 5}` — Products, How to try, Training and Support, About, Contact; la pagina chiama persone (storie di una ragazza, di una scuola, di un adulto) ma non ha porte per ruolo. [prove/R52/desktop/014-clic.jpg]
- **prodotto mostrato** · arrivo computer · `{"con_legenda": "no", "tipo": "schermata"}` — Carosello di otto schermate vere di Grid dentro la cornice di un tablet (griglia di app, griglie di simboli, tastiera). [prove/R52/desktop/001-vai.jpg, prove/R52/desktop/011-clic.jpg]
- **prodotto mostrato** · scorrimento computer · `{"con_legenda": "no", "tipo": "schermata"}` — Tre tablet per vocabolari (simboli, testo con «NEW! AI tools», app), tastiera con previsione, foto di persone e di dispositivi con puntamento oculare. [prove/R52/desktop/003-scorri.jpg, prove/R52/desktop/007-scorri.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 4, "parole": 63}` — Logo «Grid» molto grande e «Communicate, connect, and take control»; due paragrafi; il secondo («Finding the right AAC setup is personal…») dice che la scelta è personale e che c'è un gruppo di persone che aiuta. [prove/R52/desktop/001-vai.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 4, "parole": 63}` — Stesso testo; carosello e logo gigante precedono il titolo; il pulsante della chat copre l'ultima riga del paragrafo. [prove/R52/telefono/001-vai.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 3, "domini_di_terzi": 3, "kb": 4368, "richieste": 65}` — Terzi: challenges.cloudflare.com (verifica nel modulo), Cloudflare Insights, Google Tag Manager; immagini da media.smartboxaac.com (32 richieste). Cache spenta. [prove/R52/script/misure-script.json]
- **tema scelto dalla persona** · menu computer · `{"interruttore": "sì", "segue_il_sistema": "sì"}` — Pulsante sole/luna nella barra (stato in localStorage «sb-theme»); con prefers-color-scheme scuro il sito si apre scuro (foto scuro/001-vai.jpg); il pulsante di chat diventa giallo. [prove/R52/desktop/012-clic.jpg, prove/R52/scuro/001-vai.jpg]
- **testimonianze di utenti** · fiducia · `{"con_foto": "sì", "con_ruolo": "no", "numero": 3}` — Tre storie con poster video e titolo «Meet …» (Milly, Oasis Academy, Claire); nessuna frase scritta. [prove/R52/desktop/foglio-a.jpg]
- **testo corrente** · arrivo computer · `{"corpo_px": 20, "interlinea": 1.4}` — Quicksand 20 px peso leggero, rgb(60,60,59) su bianco. [prove/R52/lettura-desktop.json]
- **effetto o animazione** · arrivo computer · cross-fade della bandiera UK/IE · `{"curva": "ease-in-out", "durata_ms": 5000, "proprieta": "opacity (2 livelli sfalsati di 2500 ms), infinito",…` — Animazione infinita nella barra in alto; tolta con movimento ridotto. [prove/R52/effetti-misurati.tsv, prove/R52/desktop/001-vai.jpg]
- **effetto o animazione** · arrivo computer · scorrimento del carosello · `{"curva": "cubic-bezier(0.25, 1, 0.5, 1)", "durata_ms": 400, "proprieta": "transform translateX", "trigger":…` — Libreria Splide (id splide01-list); frecce e punti. [prove/R52/effetti-misurati.tsv, prove/R52/desktop/011-clic.jpg]
- **effetto o animazione** · menu computer · cambio tema chiaro/scuro · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 300, "proprieta": "color + background-color (150-300 m…` — Le icone sole/luna si scambiano con opacità 300 ms; il corpo cambia sfondo in 200 ms ease. [prove/R52/effetti-misurati.tsv, prove/R52/desktop/012-clic.jpg]
- **effetto o animazione** · menu computer · sottomenu Products · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 300, "proprieta": "height 0→313 px", "trigger": "clic"}` — Pannello che si apre in altezza; in parallelo width 200 ms e opacity 300 ms. [prove/R52/effetti-misurati.tsv, prove/R52/desktop/014-clic.jpg]
- **effetto o animazione** · menu telefono · pannello del menu · `{"curva": "cubic-bezier(0.4, 0, 0.2, 1)", "durata_ms": 500, "proprieta": "transform translate(100%)→0", "trig…` — Pannello da destra. [prove/R52/effetti-misurati.tsv, prove/R52/telefono/010-clic.jpg]
- **effetto o animazione** · scorrimento computer · comparsa delle sezioni · `{"curva": "cubic-bezier(0.16, 1, 0.3, 1)", "durata_ms": 600, "proprieta": "opacity 0→1 + transform", "trigger…` — Ogni sezione entra quando compare; tolta con movimento ridotto. [prove/R52/effetti-misurati.tsv, prove/R52/desktop/003-scorri.jpg]

### R53 · Voiceitt (23 peculiarità)

- **albero di accessibilità (proxy)** · arrivo computer · `{"comandi_senza_nome": 46, "immagini_senza_alternativa": 0, "punti_di_riferimento": 5, "titoli": 33}` — header 3, main 1, footer 1; due H1; 128 immagini su 129 con alt vuoto; 46 link senza nome (loghi di partner, stampa e investitori, profili LinkedIn); html lang vuoto. [prove/R53/lettura-desktop.json]
- **attesa del caricamento** · rete lenta · `{"s_al_primo_testo": 2.5, "segnale": "vuoto"}` — 400 kbit/s, 400 ms: corpo vuoto a 1,5 s, primo disegno a 2,5 s; a 22 s il documento era ancora «loading» (video e immagini); la foto a 1,5 s è andata in timeout (30 s). Solo Chromium. [prove/R53/script/misure-script.json]
- **avvio di audio e video** · media · `{"avvio_automatico": "sì", "controlli_nativi": "no", "sottotitoli": "no", "trascrizione": "no"}` — Otto video di sottofondo senza audio, in ciclo, senza controlli né tracce; con ridotto restano in pausa. Il video del riquadro (YouTube via Embedly) non parte da solo. [prove/R53/lettura-desktop.json, prove/R53/desktop/015-clic.jpg]
- **bersagli dei comandi principali** · arrivo computer · `{"altezza_min_px": 15, "larghezza_min_px": 48}` — Minimo nel primo schermo; nella pagina 21x11 (link di testo e loghi). [prove/R53/lettura-desktop.json]
- **bersagli dei comandi principali** · arrivo telefono · `{"altezza_min_px": 24, "larghezza_min_px": 48}` — Misura a 390x844. [prove/R53/script/misure-script.json]
- **comandi visibili al primo schermo** · arrivo computer · `{"campi": 0, "link": 5, "pulsanti": 1}` — Logo, «CONTACT US», «START YOUR FREE TRIAL TODAY», «LEARN MORE»; i comandi della finestra del consenso hanno il focus per primi. [prove/R53/lettura-desktop.json]
- **comandi visibili al primo schermo** · arrivo telefono · `{"campi": 4, "link": 4, "pulsanti": 3}` — Misura a 390x844: comprende i comandi della finestra del consenso (quattro interruttori, tre pulsanti). [prove/R53/script/misure-script.json]
- **comportamento senza JavaScript** · senza JavaScript · `{"contenuto": "nessuno"}` — Il testo è nel codice (12.282 caratteri, 118 collegamenti, 0 pulsanti) ma resta invisibile: il primo schermo mostra solo logo e «CONTACT US» e lo scorrimento mostra blocchi di colore vuoti (le sezioni partono con opacità 0 finché non gira JS). [prove/R53/script/005-senza-js-arrivo.png, prove/R53/script/006-senza-js-scroll.png]
- **finestra del consenso ai cookie** · arrivo computer · `{"copre_il_primo_schermo": "in_parte", "rifiuto_con_un_clic": "sì"}` — Riquadro «Essential Technologies Notice» in basso a destra: solo cookie essenziali, 4 interruttori spenti, «Decline» / «Accept» / «Learn more»; riceve il focus per primo; riappare a ogni nuova sessione. [prove/R53/desktop/001-vai.jpg, prove/R53/tastiera/004-tasto.jpg]
- **finestra del consenso ai cookie** · arrivo telefono · `{"copre_il_primo_schermo": "in_parte", "rifiuto_con_un_clic": "sì"}` — Copre circa metà della prima schermata a 430 px. [prove/R53/telefono/001-vai.jpg]
- **lunghezza e registro delle frasi** · arrivo computer · `{"frasi_campione": 10, "parole_per_frase_media": 15, "persona": "terza"}` — Frasi brevi («Generic speech recognition fails them. Standard APIs don't work.») accanto a periodi di 24-32 parole; termini: IVR, API, dysarthria, non-standard speech, AAC, AT. [prove/R53/campione-frasi-10.txt, prove/R53/testo-home-desktop.txt]
- **prodotto mostrato** · arrivo computer · `{"con_legenda": "no", "tipo": "illustrazione"}` — Raggi turchesi che partono da un punto (grafica sonora), senza il prodotto. [prove/R53/desktop/001-vai.jpg]
- **prodotto mostrato** · scorrimento computer · `{"con_alternativa": "no", "con_legenda": "no", "tipo": "video"}` — Otto video muti in ciclo con persone vere e schermate d'uso (browser con il pannello «Voiceitt Dictation» e il testo «Use your voice», foto 016-tasto); il Play apre il video intero su YouTube. Nessuna schermata ferma del programma con didascalia. [prove/R53/desktop/foglio-a.jpg, prove/R53/desktop/015-clic.jpg]
- **proposta del primo schermo** · arrivo computer · `{"frasi": 3, "parole": 42}` — H1 «Inclusive Voice AI with Impact.» con «with Impact.» in turchese leggero; la frase dice per chi (disabilità del parlato, anziani, accenti) ma la promessa è tecnica («speech recognition for non-standard speech»). [prove/R53/desktop/001-vai.jpg]
- **proposta del primo schermo** · arrivo telefono · `{"frasi": 3, "parole": 42}` — Stesso testo; la finestra del consenso copre quasi metà schermata. [prove/R53/telefono/001-vai.jpg]
- **richieste e terze parti** · arrivo computer · `{"caratteri_caricati": 4, "domini_di_terzi": 15, "kb": 13618, "richieste": 65}` — Il conteggio dei terzi comprende il CDN del sito di costruzione (website-files.com) e Google reCAPTCHA Enterprise, Iubenda (consenso), HubSpot, jsDelivr, geojs; i video di sottofondo portano il totale a 13,6 MB. La lettura con passo.mjs aveva contato 128 rich… [prove/R53/script/misure-script.json]
- **testimonianze di utenti** · fiducia · `{"con_foto": "sì", "con_ruolo": "sì", "numero": 11}` — Carosello di undici citazioni con nome, ruolo e luogo (commissario dello Stato del Tennessee, utenti/ambasciatori, genitori, ricercatori); una è firmata da un dipendente dell'azienda come utente. [prove/R53/desktop/foglio-b.jpg, prove/R53/testo-home-desktop.txt]
- **effetto o animazione** · arrivo computer · entrata della finestra del consenso · `{"curva": "ease", "durata_ms": 400, "proprieta": "opacity 0→1 + translateY(48px)→0", "trigger": "arrivo"}` — Misurata anche con movimento ridotto (invariata). [prove/R53/effetti-misurati.tsv, prove/R53/desktop/001-vai.jpg]
- **effetto o animazione** · media · riquadro del video (lightbox) · `{"curva": "ease", "durata_ms": 300, "proprieta": "opacity 0→1 del velo", "trigger": "clic"}` — Spinner rotate 360° in 800 ms lineare, infinito, durante il caricamento; Esc e «close lightbox» chiudono; il contorno dei comandi passa da 3 a 2 px in 300 ms. [prove/R53/effetti-misurati.tsv, prove/R53/desktop/015-clic.jpg]
- **effetto o animazione** · percorso principale · apertura di una domanda FAQ · `{"proprieta": "height 0→auto + rotazione dell'indicatore", "trigger": "clic"}` — Altezza animata da script (will-change); l'indicatore diventa un cerchio verde con triangolo verso il basso. [prove/R53/desktop/021-clic.jpg, prove/R53/desktop/021-clic.movimento.json]
- **effetto o animazione** · scorrimento computer · bordo dei collegamenti LinkedIn · `{"curva": "ease", "durata_ms": 150, "proprieta": "border-color e border-width 3→2 px", "trigger": "passaggio_…` — Sulle foto del team al passaggio del puntatore. [prove/R53/effetti-misurati.tsv, prove/R53/desktop/008-scorri.jpg]
- **effetto o animazione** · scorrimento computer · comparse di sezione guidate da JS · `{"proprieta": "opacity + translate 25px→0; immagini scale 2→1", "trigger": "scorrimento"}` — Campioni di mutazione (will-change: opacity, transform; translate3d(0,25px,0) e opacità 0 verso la posizione finale; immagini da scala 2 e opacità 0,19): paragrafi e blocchi partono da 25 px di sfasamento e opacità 0, le immagini da scala 2. Durata e curva no… [prove/R53/desktop/003-scorri.movimento.json, prove/R53/ridotto/003-scorri.movimento.json]
- **effetto o animazione** · scorrimento computer · video di sottofondo in ciclo · `{"proprieta": "video muto in ciclo (8)", "trigger": "arrivo"}` — Otto clip di persone vere; con ridotto in pausa. [prove/R53/lettura-desktop.json, prove/R53/ridotto/001-vai.jpg]

## 7. Assenze verificate

Il contesto è stato osservato e il tratto non c'è (con prova). Elenco per riga; la prova è nell'osservazione del sito.

| Caratteristica | Ambito | Siti con assenza verificata | Presenti |
|---|---|---|---|
| avvio di audio e video | media | R01, R20, R21, R22 | R02, R03, R04, R05, R06, R50, R51, R53 |
| campione di suono | media | R01, R02, R04, R20, R21, R22, R50, R52, R53 | R03, R05, R51 |
| comandi da copiare | installazione | R05 | R50 |
| comando principale | arrivo computer | R02, R21, R22 | R01, R03, R04, R05, R06, R20, R50, R51, R52, R53 |
| comando principale | arrivo telefono | R02, R21 | R01, R03, R04, R05, R06, R20, R50, R51, R52, R53 |
| comando proprio «indietro» | percorso principale | R02 | R01, R03, R20, R21 |
| compromessi dichiarati nelle opzioni | aiuto | R06 | R05 |
| effetto o animazione | scorrimento computer | R01, R21 | — |
| finestra del consenso ai cookie | arrivo computer | R50, R51, R52 | R53 |
| guida a passi con ripresa | installazione | R53 | R05, R50 |
| messaggio di errore | errore | R01 | R22 |
| numeri detti a parole | dati | R05, R50, R52 | R04, R21, R22, R51, R53 |
| porte per pubblici diversi | arrivo computer | R02, R04, R22, R50, R53 | R03, R06, R20, R21 |
| proposta del primo schermo | arrivo telefono | R20 | R01, R02, R03, R04, R05, R06, R21, R22, R50, R51, R52, R53 |
| segnale di posizione e di avanzamento | percorso principale | R01, R02, R03 | R21, R50, R52 |
| segnale di posizione e di avanzamento | scorrimento computer | R04, R05, R50, R51, R52, R53 | R20, R22 |
| stato e limiti dichiarati | arrivo computer | R51, R52, R53 | R04, R05, R06, R50 |
| stato e limiti dichiarati | fiducia | R03 | R01, R02, R04, R05, R06, R21, R22, R50, R51, R53 |
| struttura della navigazione | menu computer | R22, R53 | R01, R02, R03, R04, R05, R06, R20, R21, R50, R51, R52 |
| struttura della navigazione | menu telefono | R22, R53 | R01, R02, R04, R05, R20, R21, R50, R51, R52 |
| tabella di compatibilità | aiuto | R05 | — |
| tabella di compatibilità | dati | R04, R50, R52, R53 | R51 |

Dettaglio delle assenze (descrizione e prova del sito):

- avvio di audio e video · media · **R01**: Nessun audio; due video nel DOM, entrambi del flusso webcam, inattivi senza webcam. [prove/R01/lettura-arrivo-desktop.json, prove/R01/011-clic.jpg]
- avvio di audio e video · media · **R20**: Nessun audio né video: nessun avvio. [prove/R20/desktop/001-vai.movimento.json]
- avvio di audio e video · media · **R21**: Nessun audio né video: nessun avvio. [prove/R21/misure/meta-e-albero.json]
- avvio di audio e video · media · **R22**: Nessun audio né video: nessun avvio. [prove/R22/misure/meta-e-albero.json]
- campione di suono · media · **R01**: 0 elementi audio in tutte le schermate percorse. [prove/R01/lettura-arrivo-desktop.json]
- campione di suono · media · **R02**: 0 elementi audio. Le «audio description» dell'esposizione sono descritte in testo («Each artwork is accompanied by: An audio description, A Braille label, A member of our exhibition team») ma non sono ascoltabili sul sito. [prove/R02/lettura-arrivo-desktop.txt]
- campione di suono · media · **R04**: Percorse vetrina e hub fino al fondo, desktop e telefono: nessun audio, solo il video YouTube a richiesta (senza suono dimostrabile in questo ambiente). [prove/R04/001-vai.jpg, prove/R04/014-scorri.jpg]
- campione di suono · media · **R20**: Nessun audio né video nelle pagine percorse (video: 0, canvas: 0 al conteggio di passo.mjs). [prove/R20/desktop/001-vai.movimento.json]
- campione di suono · media · **R21**: Nessun audio né video nella pagina (video 0, audio 0, canvas 0). [prove/R21/misure/meta-e-albero.json]
- campione di suono · media · **R22**: Nessun audio né video nella storia (video 0, audio 0, canvas 0). [prove/R22/misure/meta-e-albero.json]
- campione di suono · media · **R50**: Nessun campione di voce a parte: la voce si sente solo nel video di 8:44 (non ascoltato: nessuna uscita audio). [prove/R50/desktop/022-clic.jpg, prove/R50/script/misure-script.json]
- campione di suono · media · **R52**: Nessun campione di voce; «Voice activation» e «Audio feedback» sono descritti a parole. [prove/R52/desktop/003-scorri.jpg]
- campione di suono · media · **R53**: Nessun campione di voce a parte: la voce sintetica di «Speak» è descritta a parole. [prove/R53/desktop/foglio-a.jpg]
- comandi da copiare · installazione · **R05**: La pagina offre installatori (dmg, exe, pacchetti Ubuntu) e nessun comando da copiare né verifica dell'impronta. [prove/R05/014-vai.jpg, prove/R05/testo-body-desktop-app.txt]
- comando principale · arrivo computer · **R02**: Nessun pulsante o invito nel primo schermo; l'azione «Register your interest» sta a 5955 px dall'alto. [prove/R02/001-vai.jpg]
- comando principale · arrivo computer · **R21**: Pagina di lettura: non c'è un comando principale, l'azione è leggere. Intestazione in alto non fissa (position: relative: sparisce allo scorrimento, verificato in 11 passi di scorrimento). [prove/R21/desktop/001-vai.jpg, prove/R21/desktop/003-scorri.jpg]
- comando principale · arrivo computer · **R22**: Articolo da scorrere: nessun comando principale; i campi «Search for a bird…» e «Search for a state…» compaiono fissi in alto solo dentro le sezioni interattive. [prove/R22/desktop/001-vai.jpg, prove/R22/fogli/006-009-scorrimento-computer.jpg]
- comando principale · arrivo telefono · **R02**: Nessun pulsante nel primo schermo. [prove/R02/varianti/mobile/001-vai.jpg]
- comando principale · arrivo telefono · **R21**: Come al computer: nessun comando principale; l'intestazione scorre via (header relative). Il pannello giallo della biografia resta sotto la foto, non fisso. [prove/R21/mobile/001-vai.jpg, prove/R21/mobile/004-scorri.jpg]
- comando proprio «indietro» · percorso principale · **R02**: Nessuna briciola né comando «indietro»: si torna con il menu o il marchio. [prove/R02/012-clic.jpg, prove/R02/015-clic.jpg]
- compromessi dichiarati nelle opzioni · aiuto · **R06**: Non applicabile: il sito non ha opzioni con compromessi, solo la scelta del suono. [prove/R06/001-vai.jpg]
- effetto o animazione · scorrimento computer · **R01**: La pagina non scorre (corpo con overflow hidden): nessun effetto legato allo scorrimento; il pannello About ha uno scorrimento interno normale. [prove/R01/varianti/zoom200/log/001.txt, prove/R01/misure/primo-schermo-R01.json]
- effetto o animazione · scorrimento computer · **R21**: Undici gesti di scorrimento (850-1800 px) sulla pagina intera con zero animazioni e zero mutazioni registrate: nessuna rivelazione allo scorrimento, nessuna parallasse, nessun effetto legato alla posizione. [prove/R21/desktop/002-scorri.movimento.json, prove/R21/desktop/012-scorri.movimento.json]
- finestra del consenso ai cookie · arrivo computer · **R50**: Nessuna finestra al primo schermo; esiste «Cookie settings» nel piede. [prove/R50/desktop/001-vai.jpg]
- finestra del consenso ai cookie · arrivo computer · **R51**: Nessuna finestra di consenso visibile al primo arrivo in questa sessione. [prove/R51/desktop/001-vai.jpg]
- finestra del consenso ai cookie · arrivo computer · **R52**: Nessuna finestra visibile al primo arrivo in questa sessione. [prove/R52/desktop/001-vai.jpg]
- guida a passi con ripresa · installazione · **R53**: Nessuna installazione: «Voiceitt is an online app available on any device with internet access and the ability to open a web browser». [prove/R53/testo-faq-desktop.txt]
- messaggio di errore · errore · **R01**: Con webcam assente il riquadro resta nero senza messaggio; con ricerca senza risultati l'elenco resta vuoto senza messaggio. [prove/R01/011-clic.jpg, prove/R01/021-scrivi.jpg]
- numeri detti a parole · dati · **R05**: Cifre di prezzo e quantità («10 Minutes», «€6.75/mo», «4x», «40%») senza frase che le traduca né metodo. [prove/R05/008-scorri.jpg, prove/R05/009-scorri.jpg]
- numeri detti a parole · dati · **R50**: Nessuna cifra di qualità o di tempo da leggere in frasi; solo versioni, dimensioni e date. [prove/R50/testo-pagina-desktop.txt]
- numeri detti a parole · dati · **R52**: Cifre solo come durate di prova («60-day», «30-day»). [prove/R52/testo-pagina-desktop.txt]
- porte per pubblici diversi · arrivo computer · **R02**: Nessuna porta per ruolo o compito nel menu; i pubblici sono nominati solo in un blocco di testo «Who's It For?» a metà pagina. [prove/R02/001-vai.jpg, prove/R02/007-scorri.jpg]
- porte per pubblici diversi · arrivo computer · **R04**: Nessuna porta per ruolo, compito o argomento dichiarato al primo schermo né nel menu; le tre vie (guardare, controllare, iscriversi) sono implicite nella pagina. [prove/R04/001-vai.jpg, prove/R04/005-clic.jpg]
- porte per pubblici diversi · arrivo computer · **R22**: Nessuna porta per ruoli né argomenti: un solo percorso di lettura. L'unica scelta sono i due campi di ricerca (per uccello e per Stato). [prove/R22/desktop/001-vai.jpg, prove/R22/misure/meta-e-albero.json]
- porte per pubblici diversi · arrivo computer · **R50**: La navigazione è quella dell'agenzia (servizi, prodotti, capacità): nessuna porta per persona, familiare o tecnico. [prove/R50/desktop/001-vai.jpg, prove/R50/desktop/019-muovi.jpg]
- porte per pubblici diversi · arrivo computer · **R53**: Un solo percorso; il pubblico delle imprese (IVR, API) e quello delle persone sono affiancati senza porte. [prove/R53/desktop/001-vai.jpg, prove/R53/desktop/003-scorri.jpg]
- proposta del primo schermo · arrivo telefono · **R20**: Al telefono (430×932) il primo schermo dopo l'intro mostra solo «(Info)», le didascalie dei progetti e la lettera «B (09)»: la frase che dice chi è Otto e cosa fa non compare (è nella pagina Info). Verificato su foto e testo della pagina. [prove/R20/mobile/003-home-telefono.jpg, prove/R20/mobile/003-home-telefono.movimento.json]
- segnale di posizione e di avanzamento · percorso principale · **R01**: Percorsi Learn e Record fino al passo prima dell'invio: nessun indicatore di passi, indice o barra. [prove/R01/010-clic.jpg, prove/R01/011-clic.jpg]
- segnale di posizione e di avanzamento · percorso principale · **R02**: Percorso Home → Artworks → categoria: nessun indice, passi o barra; solo un tasto «torna su» in basso a destra. [prove/R02/012-clic.jpg, prove/R02/015-clic.jpg]
- segnale di posizione e di avanzamento · percorso principale · **R03**: Pagina unica di 9486 px: nessuna barra di avanzamento né indice; la navigazione compatta fissa non indica la sezione. [prove/R03/fogli/scorrimento-a.jpg, prove/R03/fogli/scorrimento-b.jpg]
- segnale di posizione e di avanzamento · scorrimento computer · **R04**: Percorsa tutta la vetrina dall'inizio al fondo: nessuna barra, indice o numerazione di sezione. Nell'hub /safety/impact solo i numeri delle FAQ (043-scorri.jpg). [prove/R04/006-scorri.jpg, prove/R04/007-scorri.jpg]
- segnale di posizione e di avanzamento · scorrimento computer · **R05**: Percorsa tutta la pagina: nessuna barra, indice o numerazione. Solo l'intestazione che si compatta. [prove/R05/003-scorri.jpg, prove/R05/008-scorri.jpg]
- segnale di posizione e di avanzamento · scorrimento computer · **R50**: Nessuna barra di avanzamento né indice fisso; restano le briciole di pane in cima (Home > Free Tools > Text-to-Mic) e il riquadro «What you need» fermo nei passi. [prove/R50/desktop/003-scorri.jpg, prove/R50/desktop/007-scorri.jpg]
- segnale di posizione e di avanzamento · scorrimento computer · **R51**: Nessuna barra di avanzamento; la barra di prodotto fissa dice dove si è («Proloquo2Go») ma non quanto manca. [prove/R51/desktop/003-scorri.jpg, prove/R51/desktop/009-scorri.jpg]
- segnale di posizione e di avanzamento · scorrimento computer · **R52**: Nessun indicatore sulla pagina del prodotto. [prove/R52/desktop/003-scorri.jpg, prove/R52/desktop/008-scorri.jpg]
- segnale di posizione e di avanzamento · scorrimento computer · **R53**: Nessun indicatore per la pagina lunga (~10.000 px); la FAQ ha un indice di otto sezioni con collegamenti interni. [prove/R53/desktop/003-scorri.jpg, prove/R53/desktop/009-scorri.jpg]
- stato e limiti dichiarati · arrivo computer · **R51**: Primo schermo senza limiti né stato. [prove/R51/desktop/001-vai.jpg]
- stato e limiti dichiarati · arrivo computer · **R52**: Primo schermo senza limiti né stato. [prove/R52/desktop/001-vai.jpg]
- stato e limiti dichiarati · arrivo computer · **R53**: Primo schermo senza limiti. [prove/R53/desktop/001-vai.jpg]
- stato e limiti dichiarati · fiducia · **R03**: Nelle nove schermate dell'intera pagina nessuna dichiarazione di limiti o di cosa il prodotto non fa; i claim «leading accuracy and ultra-low latency» sono senza numeri. [prove/R03/fogli/scorrimento-a.jpg, prove/R03/fogli/scorrimento-b.jpg]
- struttura della navigazione · menu computer · **R22**: Nessun menu né elemento `nav`: la storia è un unico scorrimento con sei parti («PART ONE» … «PART SIX») che hanno un'icona di collegamento diretto accanto al titolo. [prove/R22/fogli/002-005-scorrimento-computer.jpg, prove/R22/misure/meta-e-albero.json]
- struttura della navigazione · menu computer · **R53**: Nessuna barra di navigazione: solo logo e «CONTACT US»; nessun <nav> (punti: header 3, main 1, footer 1). [prove/R53/desktop/001-vai.jpg]
- struttura della navigazione · menu telefono · **R22**: Come al computer: nessun menu; solo scorrimento. [prove/R22/mobile/002-scorri.jpg, prove/R22/fogli/m001-007-telefono.jpg]
- struttura della navigazione · menu telefono · **R53**: Nessun menu al telefono: logo e «CONTACT US». [prove/R53/telefono/002-clic.jpg]
- tabella di compatibilità · aiuto · **R05**: I requisiti (macOS 10.15+, Windows 10/11, Ubuntu 22.04+, «No specific RAM requirements apply») sono in prosa in una FAQ, non in una tabella; nessuna colonna «non provato». [prove/R05/019-clic.jpg]
- tabella di compatibilità · dati · **R04**: Non è un prodotto da installare: nessuna tabella di compatibilità; l'equivalente sono le tabelle di confronto con i benchmark, senza una colonna «non provato» (usa «N/A» dove manca il dato). [prove/R04/045-scorri.jpg]
- tabella di compatibilità · dati · **R50**: Nessuna tabella: due schede (Windows EXE/ZIP, macOS ZIP) e frasi su Teams, Zoom, Meet. [prove/R50/desktop/008-scorri.jpg]
- tabella di compatibilità · dati · **R52**: Nessuna tabella nella pagina: «Available on Windows and iPad» con due paragrafi e due pulsanti di prova; la compatibilità sta nel Hub. [prove/R52/desktop/004-scorri.jpg]
- tabella di compatibilità · dati · **R53**: La compatibilità è una risposta di FAQ in frasi («any device connected to the internet that can open a web browser»), non una tabella. [prove/R53/testo-faq-desktop.txt]

## 8. Non osservati: per sito

Il confronto conserva ogni lacuna con il suo motivo. Qui il conteggio e i motivi più frequenti per sito; l'elenco riga per riga è nel JSON.

| Sito | Righe non osservate | Di cui con motivo esplicito dichiarato dal visitatore | Motivi più frequenti (abbreviati) |
|---|---|---|---|
| R01 | 140 | 2 (le altre 138 sono righe che il visitatore non ha compilato) | «Richieste di media non bloccate in questa visita.» ×1; «Il pannello About al telefono è stato aperto senza sequenza di fotogrammi; la m…» ×1 |
| R02 | 142 | 2 (le altre 140 sono righe che il visitatore non ha compilato) | «I due moduli (registrazione e contatto) non sono stati inviati nemmeno vuoti, p…» ×1; «Richieste di media non bloccate in questa visita.» ×1 |
| R03 | 142 | 4 (le altre 138 sono righe che il visitatore non ha compilato) | «Il pulsante «Open main navigation» e «Menu» non sono stati aperti al telefono.» ×1; «Non innescato: richiede di dare il consenso, inviare un messaggio o usare il mi…» ×1; «Richieste di media non bloccate in questa visita.» ×1 |
| R04 | 131 | 3 (le altre 128 sono righe che il visitatore non ha compilato) | «La vetrina e l'hub sono pagine, non un percorso a passi: non esiste un comando…» ×1; «Il solo campo con errori possibili è il modulo «Keep in touch» (form novalidate…» ×1; «Non ho bloccato la richiesta del video né delle immagini: la finestra con il le…» ×1 |
| R05 | 124 | 3 (le altre 121 sono righe che il visitatore non ha compilato) | «Il percorso principale (caricare un file) richiede l'invio di un file ai server…» ×1; «Gli errori del prodotto (formato non supportato, file troppo grande, nessun fil…» ×1; «Non ho bloccato i file audio né il video: la prova richiederebbe di bloccare le…» ×1 |
| R06 | 140 | 7 (le altre 133 sono righe che il visitatore non ha compilato) | «Nelle foto a 430x932 e 390x844 della scena non compaiono né un pannello né un p…» ×1; «Capitolo 1 al telefono scorso solo per 3000 px su 21063 e /about per 1200 px su…» ×1; «Non ho percorso più capitoli né il ritorno dalla pagina di un capitolo alla sce…» ×1 |
| R20 | 136 | 3 (le altre 133 sono righe che il visitatore non ha compilato) | «Il sito non ha moduli né campi: nelle pagine percorse (home, quattro categorie,…» ×1; «Portfolio fotografico: non ha stato di prodotto né limiti da dichiarare; domand…» ×1; «Portfolio: gli unici numeri sono i conteggi dei progetti «(09)» in cifre; doman…» ×1 |
| R21 | 141 | 1 (le altre 140 sono righe che il visitatore non ha compilato) | «L'unico campo in vista è «Email address» del modulo newsletter in fondo (non in…» ×1 |
| R22 | 143 | 2 (le altre 141 sono righe che il visitatore non ha compilato) | «Al primo schermo non c'è nessun comando in vista (titolo, data, tempo di lettur…» ×1; «Non si è bloccato il caricamento delle immagini. In rete lenta le immagini arri…» ×1 |
| R50 | 131 | 2 (le altre 129 sono righe che il visitatore non ha compilato) | «La pagina non ha un percorso a passi con invio: sono quattro paragrafi di istru…» ×1; «Nessun modulo né campo sulla pagina del prodotto; non si è inviato nulla.» ×1 |
| R51 | 136 | 2 (le altre 134 sono righe che il visitatore non ha compilato) | «Pagina informativa senza percorso a passi; «Start the AAC App Guide» (guida a d…» ×1; «L'installazione avviene dall'App Store: la pagina non ha passi di installazione.» ×1 |
| R52 | 138 | 3 (le altre 135 sono righe che il visitatore non ha compilato) | «Pagine informative senza percorso a passi con invio; «Try Grid» e «Request a qu…» ×1; «Le tre storie video («Meet Milly», «Meet the Oasis Academy», «Meet Claire») han…» ×1; «Le istruzioni di installazione stanno nel Hub (non seguite) e nei moduli «Try G…» ×1 |
| R53 | 138 | 2 (le altre 136 sono righe che il visitatore non ha compilato) | «Pagina informativa; la prova gratuita si chiede per e-mail (non inviata).» ×1; «Nessun modulo compilato né inviato (e-mail di supporto per la prova).» ×1 |

## 9. Limite

Comune riguarda solo il campione dichiarato. Le peculiarità con lacune sono singolari fra le osservazioni disponibili; frequenza e identità non provano efficacia.
