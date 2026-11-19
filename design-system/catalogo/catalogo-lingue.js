/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1 */
// Il catalogo delle lingue (incarico 2, 17/11/2026): le scritture con i loro caratteri, l'elenco delle lingue, la scelta nella barra, la
// pagina della scelta e lo specchio da destra a sinistra. Come catalogo.js non ha stili né markup suoi per i componenti: le scritture e lo
// specchio sono piccole pagine vere (un riquadro con <html lang dir> e i fogli del sistema: :lang() e :dir() valgono sulla radice, come
// nel sito), i componenti sono copiati dalla home e dalla pagina della scelta come la costruzione le fa con tutte le lingue del registro
// (esempio-home.html, esempio-scelta.html, scritte da tools/site.py): con una lingua sola le pagine vere non hanno la scelta nella barra, l'elenco
// del piede né la pagina della scelta (e «/» manda a «/it/»), ma il catalogo li mostra lo stesso.
// Sta in un file suo e aggiunge le proprie sezioni dopo quelle di catalogo.js (che segnala di aver finito con window.__catalogo).
(async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, att = {}, ...figli) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(att)) { if (typeof v === 'function') e.addEventListener(k.replace(/^on/, ''), v); else if (k === 'html') e.innerHTML = v; else if (k === 'testo') e.textContent = v; else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); } e.append(...figli.flat().filter(x => x != null)); return e; };
  const errori = [];
  const prova = async (nome, f) => { try { return await f(); } catch (e) { errori.push(`${nome}: ${e.message}`); return null; } };
  await new Promise(fine => { const t0 = performance.now(); (function chiedi() { if (window.__catalogo || performance.now() - t0 > 20000) fine(); else setTimeout(chiedi, 40); })(); });
  const leggi = async u => new DOMParser().parseFromString(await (await fetch(u)).text(), 'text/html');
  const [home, scelta] = await Promise.all([leggi('esempio-home.html'), leggi('esempio-scelta.html')]);
  const da = (doc, sel) => { const e = doc.querySelector(sel); if (!e) throw new Error('manca ' + sel); const c = e.cloneNode(true); c.querySelectorAll('[id]').forEach(x => x.removeAttribute('id')); return c; };
  const prova1 = (et, nodo, classe = '') => el('div', {class: 'cat-prova' + (classe.includes('largo') ? ' intero' : '')}, el('span', {class: 'cat-et', html: et}), el('div', {class: 'cat-quadro ' + classe}, nodo));
  const scheda = ({nome, id, regola, confine, persona, provenienza, prove}) => el('article', {class: 'cat-scheda'}, el('h3', {testo: nome}),
    el('dl', {}, el('dt', {testo: 'Identificatore'}), el('dd', {html: id}), el('dt', {testo: 'Regola d\'uso'}), el('dd', {html: regola}), el('dt', {testo: 'Non si usa'}), el('dd', {html: confine}),
      el('dt', {testo: 'Persona e compito'}), el('dd', {html: persona}), el('dt', {testo: 'Provenienza'}), el('dd', {html: provenienza})),
    el('div', {class: 'cat-prove'}, prove));
  const radice = $('#cat'), indice = $('#indice');
  const apri = (id, titolo, nota, dopoDi) => {
    const s = el('section', {class: 'cat-sezione', id}); s.append(el('h2', {testo: titolo}));
    if (nota) s.append(el('p', {class: 'cat-nota', html: nota}));
    const ref = dopoDi && $('#' + dopoDi); if (ref) ref.after(s); else radice.append(s);
    const li = el('li', {}, el('a', {href: '#' + id, testo: titolo})); const rl = dopoDi && indice && $(`a[href="#${dopoDi}"]`, indice);
    if (rl) rl.parentElement.after(li); else if (indice) indice.append(li);
    return s;
  };
  // una piccola pagina vera: <html lang dir> con i fogli del sistema, alta quanto il suo contenuto
  const FOGLI = ['token.css', 'base.css', 'componenti/apertura.css', 'componenti/bolla.css', 'componenti/pulsanti.css', 'componenti/riunione.css', 'componenti/finestra.css', 'componenti/strada.css', 'componenti/lingue.css'];
  const base = new URL('../', location.href).href;
  const paginetta = (lang, dir, corpo, titolo) => {
    const f = el('iframe', {title: titolo, class: 'cap-paginetta', loading: 'lazy'});
    f.srcdoc = `<!doctype html><html lang="${lang}" dir="${dir}"><head><meta charset="utf-8"><base href="${base}">${FOGLI.map(x => `<link rel="stylesheet" href="${x}">`).join('')}`
      + `<link rel="stylesheet" href="catalogo/catalogo-lingue.css"></head><body class="cap-dentro">${corpo}</body></html>`;
    f.addEventListener('load', () => { const d = f.contentDocument; const alza = () => { f.style.height = d.documentElement.scrollHeight + 'px'; }; d.fonts.ready.then(alza); setTimeout(alza, 800); });
    return f;
  };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // =============================================================================================================
  // 1. le scritture
  // =============================================================================================================
  await prova('scritture', async () => {
    const s = apri('scritture', 'Le scritture: un carattere per ognuna',
      'Lexend disegna il latino (anche il latino esteso, in un file a parte). Ogni altra scrittura ha il suo carattere dopo Lexend nella pila, legato alla lingua con <code>:lang()</code>, con le sue grandezze e interlinee dei titoli e del testo (fattori in <code>token.css</code>, «Le scritture»); le scritture legate e il cinese non si spaziano. Ogni file ha un <code>unicode-range</code>: una pagina lo scarica soltanto se ha lettere di quella scrittura (i byte qui sotto sono misurati adesso, scaricando il file). Ogni esempio è una piccola pagina con la sua lingua sulla radice, come nel sito: il titolo con le regole del titolo della home, il testo con quelle della presentazione, una bolla, un nome di lingua.', 'caratteri');
    const nomi = Object.fromEntries([...scelta.querySelectorAll('[data-lingue="elenco"] a[hreflang]')].map(a => [a.getAttribute('data-lingua-codice'), a.textContent]));
    const SCRITTURE = [
      ['it', 'ltr', 'Latino: Lexend', 'caratteri/lexend/Lexend-wght-latino.woff2', 'In riunione, alla pari', 'àèéìòù ÀÈÉÌÒÙ «» – … € 0123456789'],
      ['cs', 'ltr', 'Latino esteso: Lexend', 'caratteri/lexend/Lexend-wght-latino-esteso.woff2', 'Čeština · polski · română', 'áčďéěíňóřšťúůýž ąćęłńśźż ăâîșț őű ųū āēģīķļņ ċġħż õ'],
      ['el', 'ltr', 'Greco: Geologica', 'caratteri/geologica/Geologica-wght.woff2', 'Ελληνικά', 'αβγδεζηθικλμνξοπρσςτυφχψω άέήίόύώ ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'],
      ['bg', 'ltr', 'Cirillico, con le forme bulgare: Geologica', 'caratteri/geologica/Geologica-wght.woff2', 'български', 'абвгдежзийклмнопрстуфхцчшщъьюя АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ'],
      ['ar', 'rtl', 'Arabo: Readex Pro', 'caratteri/readex-pro/ReadexPro-wght.woff2', 'العربية', 'ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي ٠١٢٣٤٥٦٧٨٩ ، ؟'],
      ['ur', 'rtl', 'Urdu, in nastaliq: Noto Nastaliq Urdu', 'caratteri/noto-nastaliq-urdu/NotoNastaliqUrdu-wght.woff2', 'اردو', 'ا ب پ ت ٹ ث ج چ ح خ د ڈ ذ ر ڑ ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن ں و ہ ھ ء ی ے ۔'],
      ['hi', 'ltr', 'Devanagari: Noto Sans Devanagari', 'caratteri/noto-sans-devanagari/NotoSansDevanagari-wght.woff2', 'हिन्दी', 'अ आ इ ई उ ऊ ए ऐ ओ औ क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न प फ ब भ म य र ल व श ष स ह क्ष त्र ज्ञ ।'],
      ['bn', 'ltr', 'Bengali: Noto Sans Bengali', 'caratteri/noto-sans-bengali/NotoSansBengali-wght.woff2', 'বাংলা', 'অ আ ই ঈ উ ঊ এ ঐ ও ঔ ক খ গ ঘ চ ছ জ ঝ ট ঠ ড ঢ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ ০১২৩৪৫৬৭৮৯ ।'],
      ['zh-Hans', 'ltr', 'Cinese semplificato: il carattere di sistema (nessun file)', '', '中文', '一二三四五 人口手上下 你我他 说话 会议 声音 电脑'],
    ];
    const tab = el('tbody');
    s.append(el('table', {class: 'cat-tabella'}, el('thead', {}, el('tr', {}, ['Lingua', 'Scrittura e carattere', 'File', 'Byte'].map(t => el('th', {testo: t})))), tab));
    const prove = [];
    for (const [lang, dir, nome, file, titolo, lettere] of SCRITTURE) {
      const byte = el('td', {testo: file ? '…' : '0'});
      tab.append(el('tr', {}, el('td', {html: `<code>${lang}</code>`}), el('td', {testo: nome}), el('td', {html: file ? `<code>${file}</code>` : '—'}), byte));
      if (file) fetch('../' + file).then(r => r.blob()).then(b => { byte.textContent = b.size.toLocaleString('it'); }).catch(() => { byte.textContent = 'non trovato'; });
      const corpo = `<h1>${esc(titolo)}</h1><p class="presentazione">${esc(lettere)}</p>`
        + `<div class="bolla filo-bolla"><div class="bolla-corpo"><p class="bolla-testo">${esc(nomi[lang.split('-')[0]] || titolo)} · Kalliope 0.1</p></div><svg class="coda" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 0h31L7.6 21.6A3.5 3.5 0 0 1 2 18.8V0z"/></svg></div>`;
      prove.push(prova1(`<code>${lang}</code> · ${nome}`, paginetta(lang, dir, corpo, nome), 'largo'));
    }
    s.append(el('div', {class: 'cat-prove'}, prove));
  });

  // =============================================================================================================
  // 2. la scelta della lingua
  // =============================================================================================================
  await prova('lingue', async () => {
    const s = apri('lingue', 'La scelta della lingua',
      'Un componente nuovo, <code>componenti/lingue.css</code>, in tre posti: l\'elenco nel piede di ogni pagina, la scelta nella barra (un <code>&lt;details&gt;</code>: funziona senza script) e la pagina della scelta, all\'indirizzo principale. Ogni lingua è scritta nel suo nome, con il suo <code>lang</code> e <code>hreflang</code>, niente bandiere; i nomi hanno file piccolissimi con le sole loro lettere, così una pagina italiana non scarica un carattere intero per mostrare «العربية». Scegliere una lingua porta alla stessa pagina nell\'altra lingua e la ricorda (<code>lingua.js</code>, <code>localStorage</code>).', 'scritture');
    const elenco = () => { const u = da(home, '.lingua-scelta .lingue-elenco'); u.style.position = 'static'; return u; };
    const stato = (n, f) => { const u = elenco(); const a = u.querySelector('a:not([aria-current])'); if (f) f(a, u); return prova1(n, el('nav', {class: 'menu'}, el('div', {class: 'lingua-scelta'}, u))); };
    s.append(scheda({nome: 'Elenco delle lingue', id: '<code>.lingue-elenco</code> · <code>a[aria-current]</code> · <code>.lingue-in-bolla</code> <code>.preferita</code>',
      regola: 'Un pulsante-voce per lingua, con il nome nella sua scrittura (<code>--font-nomi-lingue</code>); la lingua di adesso è piena come la voce scelta. Dentro la bolla della pagina della scelta i nomi sono scuri sul chiaro e la lingua del browser è accesa in bordeaux.',
      confine: 'Non per scegliere altro che la lingua; mai con le bandiere; il nome non si traduce (lo scrive la costruzione dai dati CLDR).',
      persona: 'Chi arriva in una lingua che non è la sua e cerca la propria, anche senza saper leggere quella della pagina.',
      provenienza: 'I pulsanti-voce con il nome di R51 (un tratto già nel sistema, <code>ascolto.css</code>); W3C qa-link-lang (niente bandiere, ogni nome con il suo lang).',
      prove: [stato('a riposo, la lingua di adesso piena'), stato('passaggio', a => a.classList.add('sim-sopra')), stato('fuoco', a => a.classList.add('sim-fuoco')), stato('premuto', a => a.classList.add('sim-premuto'))]}));
    const barra = () => { const h = da(home, '.barra'); h.classList.add('compatta'); h.style.position = 'relative'; const d = h.querySelector('.lingua-scelta'); d.open = true; h.querySelector('.barra-azione').remove(); return el('div', {class: 'cap-barra'}, h); };
    s.append(scheda({nome: 'La scelta nella barra', id: '<code>details.lingua-scelta</code> <code>summary</code> <code>.lingua-segno</code> · nel menu del telefono',
      regola: 'L\'ultima voce del menu è il nome della lingua di adesso, con la freccia dei collegamenti girata in giù; apre un pannello di vetro scuro come il menu aperto, con i nomi in tre colonne (al telefono, dentro il menu, in due). Esc, un clic fuori o il fuoco che esce lo chiudono (<code>lingua.js</code>); senza script si apre e si chiude dal suo nome.',
      confine: 'Non cambia la lingua senza un gesto: nessuno spostamento indovinato dalla lingua del browser (Google, «Avoid automatically redirecting»).',
      persona: 'Chi legge una pagina e la vuole nella sua lingua, alla stessa pagina.',
      provenienza: 'Progettuale: il pannello del menu aperto della home (<code>barra.css</code>) e la curva d\'entrata del sistema.',
      prove: [prova1('aperta, nella barra compatta', barra(), 'largo')]}));
    const bolla = () => { const m = da(scelta, '.scelta-lingua'); m.style.minHeight = '0'; return m; };
    const viva = (w, h, n) => { const f = el('iframe', {title: n, width: w, height: h, loading: 'lazy', src: 'esempio-scelta.html?lingue'}); const q = el('div', {class: 'cap-schermo'}, f);
      const adatta = () => { const k = Math.min(1, (s.clientWidth - 48) / w) || 1; q.style.width = `${Math.round(w * k)}px`; q.style.height = `${Math.round(h * k)}px`; f.style.transform = `scale(${k})`; }; requestAnimationFrame(adatta); addEventListener('resize', adatta);
      return el('div', {class: 'cat-prova intero'}, el('span', {class: 'cat-et', testo: n}), el('div', {class: 'cat-controlli'}, el('button', {type: 'button', testo: 'Riproduci l\'arrivo', onclick: () => { f.src = f.src; }})), q); };
    s.append(scheda({nome: 'La pagina della scelta', id: '<code>.scelta-lingua</code> <code>.bolla-lingue</code> <code>.scelta-tu</code> <code>.luce-scelta</code> (<code>website/lingue.html</code>)',
      regola: 'La prima frase della riunione è l\'elenco delle lingue: il tuo riquadro entra, la bolla nasce dalla sua coda (la curva e la scala delle frasi del filo) e i nomi si accendono uno dopo l\'altro al passo della scrittura del primo schermo, la lingua del browser per prima e accesa; le barre di «Tu» si muovono finché l\'ultimo nome è acceso, poi tutto si ferma. Con «riduci movimento» è già tutto al suo posto; senza script i nomi sono collegamenti, nell\'ordine dei codici.',
      confine: 'Nessun testo da tradurre (il nome del prodotto e i nomi delle lingue); nessuno spostamento automatico: la scelta ricordata porta alla lingua solo se è stata fatta con un clic, e <code>?lingue</code> mostra comunque la pagina.',
      persona: 'Chi arriva all\'indirizzo principale, in qualunque lingua, e deve trovare la sua senza leggere nient\'altro.',
      provenienza: 'Progettuale, dentro l\'idea della direzione 2: la bolla che nasce dalla coda e le parole che si accendono (D2, «Movimento all\'arrivo»), il riquadro di «Tu» con le barre.',
      prove: [prova1('la bolla e il riquadro (stato finale)', bolla(), 'largo'), viva(1440, 900, 'la pagina viva a 1440×900'), viva(390, 844, 'la pagina viva a 390×844')]}));
  });

  // =============================================================================================================
  // 3. lo specchio
  // =============================================================================================================
  await prova('specchio', async () => {
    const s = apri('specchio', 'Lo specchio: da destra a sinistra',
      'Con <code>&lt;html dir="rtl"&gt;</code> le proprietà logiche specchiano la disposizione da sole; ciò che ha un verso (uno spostamento, l\'origine di una crescita, una freccia, la coda della bolla, gli sguardi verso «Tu», le luci) moltiplica <code>--verso</code>, che vale −1 sotto <code>:root:dir(rtl)</code>. Non si specchiano il triangolo ▶ dei comandi di riproduzione, i numeri, il marchio. Qui la stessa piccola pagina nei due versi; l\'elenco punto per punto, con la decisione e il perché: <code>design/lavoro/2-lingue-aspetto/progresso.md</code>.', 'lingue');
    const corpo = (link, bolla, ascolta) => `<p><a class="collegamento" href="#">${link}<span class="freccia" aria-hidden="true"></span></a></p>`
      + `<div class="bolla filo-bolla"><div class="bolla-corpo"><p class="bolla-testo">${bolla}</p></div><svg class="coda" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 0h31L7.6 21.6A3.5 3.5 0 0 1 2 18.8V0z"/></svg></div>`
      + `<p><button class="pillola voce-chiara" type="button"><span class="tondo" aria-hidden="true"></span>${ascolta}</button></p>`;
    // correzione dopo il giudizio (M8): da destra a sinistra un testo arabo vero (dai cataloghi di prova), con la parte latina isolata come
    // la isola la costruzione con i caratteri LRI…PDI (U+2066, U+2069), come qui: l'esempio mostra la regola, non il difetto del testo
    // latino girato. Non <bdi>: dentro un collegamento (inline-flex) un elemento spezza il testo in pezzi separati, ognuno con la sua linea
    s.append(el('div', {class: 'cat-prove'}, prova1('da sinistra a destra (<code>dir="ltr"</code>, <code>--verso: 1</code>)', paginetta('it', 'ltr', corpo('Non uso Linux: cosa posso fare', 'Sono d\'accordo con «Kalliope 0.1».', 'Ascolta'), 'specchio, da sinistra a destra'), 'largo'),
      prova1('da destra a sinistra (<code>lang="ar" dir="rtl"</code>, <code>--verso: -1</code>): la freccia e la coda si specchiano, il triangolo ▶ no; la parte latina («Linux», «Kalliope 0.1») resta nel suo verso', paginetta('ar', 'rtl', corpo('لا أستخدم \u2066Linux\u2069: ماذا أفعل', 'أوافق على «\u2066Kalliope 0.1\u2069».', 'استمع'), 'specchio, da destra a sinistra'), 'largo')));
  });

  if (errori.length) { const st = $('#stato-catalogo'); if (st) st.textContent += ` · Lingue: ${errori.join(' · ')}`; if (window.__catalogo) window.__catalogo.errori.push(...errori.map(e => `lingue: ${e}`)); }   // anche nel conto dello stato, che le prove leggono
})();
