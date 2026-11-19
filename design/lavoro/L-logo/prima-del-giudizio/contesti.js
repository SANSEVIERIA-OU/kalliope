// Le pagine di prova del logo: ogni direzione al suo posto, alle grandezze vere. Impalcatura comune alle tre direzioni.
// Uso: Contesti.pagina(document.getElementById('dove'), [direzione…], {radice: '../'}) dove direzione = {id, nome, idea, base}
// e base è il percorso della cartella della direzione dalla pagina. Le ricostruzioni dei sistemi lo dicono nella pagina.
(() => {
  const V = r => `${r}contesti/vicini/`;
  const VECCHIO = r => `${r}../../../../packaging/linux/io.github.sansevieria_ou.kalliope.svg`;
  // la maschera di macOS: superellisse |x|^5 + |y|^5 = 1 (approssimazione degli angoli continui)
  function superellisse(s, n = 5, passi = 96) {
    const p = [];
    for (let i = 0; i < passi; i++) {
      const t = (i / passi) * 2 * Math.PI, c = Math.cos(t), si = Math.sin(t);
      p.push([s / 2 + (s / 2) * Math.sign(c) * Math.abs(c) ** (2 / n), s / 2 + (s / 2) * Math.sign(si) * Math.abs(si) ** (2 / n)]);
    }
    return 'M' + p.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z';
  }
  let conta = 0;
  const mascherata = (src, px) => { const id = `m${conta++}`; return `<svg width="${px}" height="${px}" viewBox="0 0 128 128"><clipPath id="${id}"><path d="${superellisse(128)}"/></clipPath><image href="${src}" width="128" height="128" clip-path="url(#${id})"/></svg>`; };
  const grigio = (px, c = '#9aa0a6') => `<svg width="${px}" height="${px}" viewBox="0 0 128 128"><path d="${superellisse(128)}" fill="${c}"/></svg>`;

  const C = {
    disegni: d => `<div class="disegni">
      <figure><div class="tavola"><img src="${d.base}disegno.svg" width="256" height="256" alt=""></div><figcaption class="cartellino">disegno libero, 256 px, fondo trasparente (chiaro)</figcaption></figure>
      <figure><div class="tavola scura"><img src="${d.base}disegno.svg" width="256" height="256" alt=""></div><figcaption class="cartellino">lo stesso sullo scuro</figcaption></figure>
      <figure><div class="tavola">${mascherata(d.base + 'piena.svg', 256)}</div><figcaption class="cartellino">forma piena nella maschera di macOS (superellisse)</figcaption></figure>
      <figure><div class="tavola"><img src="${d.base}piena.svg" width="160" height="160" alt=""></div><figcaption class="cartellino">forma piena come si consegna: quadrato senza angoli</figcaption></figure>
      <figure><div class="tavola"><img src="${d.base}simbolica.svg" width="128" height="128" alt="" style="image-rendering:auto"></div><figcaption class="cartellino">simbolica GNOME, 16×16 ingrandita 8 volte</figcaption></figure>
    </div>`,
    coppia: d => `<div class="fila"><div class="coppia scuro"><a class="marchio" href="#" style="color:inherit;text-decoration:none;display:inline-flex;align-items:center;gap:12px">${d.barra}<span>Kalliope</span></a></div>
      <div class="coppia chiaro"><img src="${d.base}disegno.svg" alt=""><span>Kalliope</span></div></div>
      <p class="cartellino">A sinistra il disegno della barra (passa il puntatore: il gesto è vivo), a destra il disegno libero sul bianco. Il nome: Lexend 700, 22 px, spaziatura −0,01 em, come nella barra del sito.</p>`,
    barra: d => `<div class="fila">
      <figure style="margin:0;max-width:560px"><img class="foto" src="${d.base}foto/barra/barra-1440-x3.png" alt=""><figcaption class="cartellino">home 1440×900, la barra (foto a 3×)</figcaption></figure>
      <figure style="margin:0;max-width:390px"><img class="foto" src="${d.base}foto/barra/barra-390-x3.png" alt=""><figcaption class="cartellino">home 390×844 (foto a 3×)</figcaption></figure>
      <figure style="margin:0;max-width:390px"><img class="foto" src="${d.base}foto/barra/barra-con-azione-390-x3.png" alt=""><figcaption class="cartellino">390×844 dopo lo scorrimento: la barra con l'azione, resta il disegno</figcaption></figure>
      <figure style="margin:0;max-width:560px"><img class="foto" src="${d.base}foto/barra/ar-XB-barra-x3.png" alt=""><figcaption class="cartellino">ar-XB, da destra a sinistra: il disegno non si specchia</figcaption></figure>
      </div>
      <div class="fila" style="margin-top:14px">
      <figure style="margin:0;width:600px"><img class="foto" src="${d.base}foto/barra/home-1440x900.png" alt=""><figcaption class="cartellino">home 1440×900, primo schermo</figcaption></figure>
      <figure style="margin:0;width:200px"><img class="foto" src="${d.base}foto/barra/home-390x844.png" alt=""><figcaption class="cartellino">home 390×844</figcaption></figure>
      <figure style="margin:0;width:600px"><img class="foto" src="${d.base}foto/barra/ar-XB-1440x900.png" alt=""><figcaption class="cartellino">ar-XB 1440×900</figcaption></figure>
      </div>`,
    movimento: d => {
      const q = 'sequenze/';
      const v = (f, cap, w = 720) => `<figure style="margin:0;width:${w}px"><video src="${d.base}${q}${f}" controls muted loop preload="metadata"></video><figcaption class="cartellino">${cap}</figcaption></figure>`;
      const i = (f, cap, w = 720) => `<figure style="margin:0;width:${w}px"><img class="foto" src="${d.base}${q}${f}" alt=""><figcaption class="cartellino">${cap}</figcaption></figure>`;
      return v('barra-arrivo/barra-arrivo-1440-1200x216.webm', "la barra durante l'arrivo della home, 1440×900 (lente 3×): la home scrive la frase da 2,2 s, la voce parla da 5,3 s a circa 15 s; senza suono (orologio della scena)")
        + i('barra-arrivo/barra-arrivo-1440-1200x216-foglio.jpg', 'il foglio dei fotogrammi, 1440')
        + v('barra-arrivo/barra-arrivo-390-1170x168.webm', "la stessa cosa al telefono, 390×844 (lente 3×)")
        + i('barra-arrivo/barra-arrivo-390-1170x168-foglio.jpg', 'il foglio dei fotogrammi, 390')
        + v('barra-puntatore/puntatore-1440-1200x216.webm', 'il puntatore sul marchio (lente 3×)')
        + i('barra-puntatore/puntatore-1440-1200x216-foglio.jpg', 'il foglio del gesto')
        + i('barra-ridotto/barra-ridotto-1440-1200x216-foglio.jpg', 'con «riduci movimento»: il marchio resta fermo')
        + v('arrivo-pagina/arrivo-1440x900.webm', "l'arrivo della home a grandezza vera, 1440×900", 720)
        + v('arrivo-pagina/arrivo-390x844.webm', "l'arrivo della home a grandezza vera, 390×844", 240);
    },
    scheda: (d, r) => ['chiaro', 'scuro'].map(t => `<div class="ff ${t}"><div class="schede"><div class="scheda scelta"><img src="${d.base}piccola.svg" alt="">Kalliope · In riunione, alla pari</div><div class="scheda"><span class="globo"></span>Nuova scheda</div></div><div class="indirizzo"><div class="campo">sansevieria-ou.github.io/kalliope/it/</div></div></div>`).join(''),
    gnome: (d, r, stretto) => {
      const app = (src, n) => `<div class="app"><img src="${src}" alt="">${n}</div>`;
      const tutte = [app(V(r) + 'firefox-128.png', 'Firefox Nightly'), app(V(r) + 'gvim-256.png', 'GVim'), app(d.base + 'disegno.svg', 'Kalliope'), app(V(r) + 'imagemagick-256.png', 'ImageMagick'), app(VECCHIO(r), 'Kalliope (oggi)')];
      const scelte = stretto ? [tutte[0], tutte[2], tutte[3]] : tutte;
      return `<div class="gnome" style="grid-template-columns:repeat(${scelte.length},auto)">${scelte.join('')}</div>`;
    },
    kde: (d, r) => `<div class="kde"><div class="testa"><div class="cerca">Cerca…</div></div><div class="corpo"><div class="categorie"><div class="su">Preferiti</div><div>Tutte le applicazioni</div><div>Accessibilità</div><div>Internet</div><div>Grafica</div><div>Ufficio</div></div>
      <div><div class="griglia"><div class="app"><img src="${V(r)}firefox-128.png" alt="">Firefox</div><div class="app"><img src="${d.base}disegno.svg" alt="">Kalliope</div><div class="app"><img src="${V(r)}gvim-256.png" alt="">GVim</div><div class="app"><img src="${V(r)}imagemagick-256.png" alt="">ImageMagick</div></div>
      <div class="elenco"><div class="riga"><img src="${d.base}disegno.svg" alt=""><span><b>Kalliope</b><br>Scrivi, e una voce parla per te nelle riunioni</span></div><div class="riga"><img src="${V(r)}chromium-48.png" alt=""><span><b>Chromium</b><br>Navigatore web</span></div></div></div></div></div>`,
    task: (d, r) => [32, 48].map(i => ['chiaro', 'scuro'].map(t => `<div class="task ${t}" style="--i:${i}px"><div class="posto"><img src="${V(r)}firefox-128.png" alt=""></div><div class="posto"><img src="${V(r)}gvim-256.png" alt=""></div><div class="posto attivo"><img src="${d.base}disegno.svg" alt=""></div><div class="posto"><img src="${V(r)}imagemagick-256.png" alt=""></div></div><div class="cartellino">${t}, icone a ${i} px</div>`).join('')).join(''),
    negozio: (d, r) => ['chiaro', 'scuro'].map(t => `<div class="negozio ${t}"><div class="vetrina"><img src="${d.base}disegno.svg" width="128" height="128" alt=""><span><b>Kalliope</b>Scrivi, e una voce parla per te nelle riunioni</span></div>
      <div class="tessera"><img src="${d.base}disegno.svg" width="64" height="64" alt=""><span><b>Kalliope</b>Scrivi, e una voce parla per te</span></div><div class="tessera"><img src="${V(r)}gvim-256.png" width="64" height="64" alt=""><span><b>GVim</b>Editor di testo</span></div></div>`).join(''),
    dock: d => `<div class="mac"><div class="dock">${grigio(64, '#5b8def')}${grigio(64, '#f5f5f7')}<span class="su"><span class="nome">Kalliope</span>${mascherata(d.base + 'piena.svg', 64)}</span>${grigio(64, '#34c759')}${grigio(64, '#ff9f0a')}</div></div>
      <p class="cartellino">Ricostruzione: fondo inventato, icone vicine segnaposto (quadrati arrotondati di colore pieno), maschera a superellisse; icone a 64 px.</p>`,
    scala: (d, r, stretto) => ['chiaro', 'scuro', 'bordeaux'].map(t => `<div class="scala ${t}">${(stretto ? [16, 24, 32, 48, 64, 128] : [16, 24, 32, 48, 64, 128, 256]).map(s => `<figure><img src="${d.base}disegno.svg" width="${s}" height="${s}" alt=""><figcaption>${s}</figcaption></figure>`).join('')}
      <figure style="margin-inline-start:18px;padding-inline-start:18px;border-inline-start:1px solid currentColor"><img src="${d.base}piccola.svg" width="16" height="16" alt=""><figcaption>16 piccola</figcaption></figure><figure><img src="${d.base}piccola.svg" width="24" height="24" alt=""><figcaption>24 piccola</figcaption></figure></div>`).join('<div style="height:10px"></div>') + `<p class="cartellino">A sinistra il disegno principale a ogni grandezza; a destra, dopo il filo, il disegno per le grandezze piccole (piccola.svg), che si usa a 16 e 24 px: icona della scheda, ICO 16, hicolor 16 e 24.</p>`,
    pixel: d => `<div class="pixeli">${['#fafafb', '#222226', '#420017', '#ffffff', '#1c1b22'].map(f => `<figure><canvas class="pixel" data-src="${d.base}disegno.svg" data-fondo="${f}" width="16" height="16"></canvas><figcaption>16 px su ${f}</figcaption></figure>`).join('')}
      <figure><canvas class="pixel" data-src="${d.base}disegno.svg" data-fondo="#ffffff" data-px="32" width="32" height="32"></canvas><figcaption>32 px</figcaption></figure>
      ${['#fafafb', '#222226', '#420017'].map(f => `<figure><canvas class="pixel" data-src="${d.base}piccola.svg" data-fondo="${f}" width="16" height="16"></canvas><figcaption>piccola 16 px su ${f}</figcaption></figure>`).join('')}
      <figure><canvas class="pixel" data-src="${d.base}simbolica.svg" data-fondo="#ffffff" width="16" height="16"></canvas><figcaption>simbolica 16 px</figcaption></figure></div>
      <div class="fila" style="margin-top:12px">${['chiaro', 'scuro'].map(t => `<div class="testa-gnome ${t}"><img src="${d.base}simbolica.svg" alt="">Kalliope</div>`).join('')}</div>
      <p class="cartellino">Ogni quadratino è un pixel vero: il disegno è stato reso a 16 (o 32) px dal browser e poi ingrandito senza sfumare. La testa di finestra è una ricostruzione; sullo scuro la simbolica è ricolorata come fa GNOME.</p>`,
  };
  const SEZ = [
    ['disegni', 'Il disegno, la forma piena, la versione simbolica', false],
    ['coppia', 'Il disegno con il nome', false],
    ['barra', 'La barra vera del sito (copia costruita con tools/site.py)', true],
    ['movimento', 'In movimento nella barra', true],
    ['scheda', 'La scheda del browser: Firefox 157, a 16 px e a 32 px (la stessa scheda a 2×)', false],
    ['gnome', 'GNOME: le applicazioni (sempre su fondo scuro, anche con il tema chiaro), icone a 96 px, la misura massima: la griglia scende a 64, 48 o 32 px se la pagina non ci sta', false],
    ['kde', 'KDE Plasma: il menu delle applicazioni (Breeze chiaro), 48 e 32 px', false],
    ['task', 'La barra delle applicazioni a 32 e 48 px (Windows 11, chiaro e scuro: fondo = token di ripiego di Mica, il colore vero non è pubblicato; accento dell\'indicatore approssimato)', false],
    ['negozio', 'Il negozio dei programmi (GNOME Software): 128 e 64 px', false],
    ['dock', 'Il Dock di macOS con la forma piena (materiale non pubblicato da Apple: inventato)', false],
    ['scala', 'La scala: 16, 24, 32, 48, 64, 128, 256 su chiaro, scuro e bordeaux del sito (e il disegno per le grandezze piccole)', false],
    ['pixel', 'A 16 px, pixel per pixel', false],
  ];
  async function pagina(dove, direzioni, {radice = './', solo = null} = {}) {
    const tre = direzioni.length > 1;
    for (const d of direzioni) if (!d.barra) d.barra = (await (await fetch(d.base + 'modelli/barra.svg')).text()).replace(/<!--[\s\S]*?-->\s*/g, '');
    let html = '';
    for (const [k, titolo, foto] of SEZ) {
      if (solo && !solo.includes(k)) continue;
      if (tre && (k === 'disegni' || k === 'barra' || k === 'movimento' || k === 'coppia')) {
        html += `<section id="${k}"><h2>${titolo}</h2><div class="colonne">${direzioni.map(d => `<div class="col"><h3>${d.nome}</h3>${C[k + 'Breve'] ? C[k + 'Breve'](d, radice) : C[k](d, radice, true)}</div>`).join('')}</div></section>`;
      } else if (tre) {
        html += `<section id="${k}"><h2>${titolo}</h2>${direzioni.map(d => `<h3>${d.nome}</h3><div class="fila">${C[k](d, radice, true)}</div>`).join('')}</section>`;
      } else html += `<section id="${k}"><h2>${titolo}</h2><div class="fila">${C[k](direzioni[0], radice, false)}</div></section>`;
    }
    dove.innerHTML = html;
    // i pixel: il disegno reso alla grandezza vera in una tela, poi ingrandito senza sfumare
    dove.querySelectorAll('canvas.pixel').forEach(cv => {
      const img = new Image(), px = +(cv.dataset.px || 16);
      img.onload = () => { const g = cv.getContext('2d'); g.fillStyle = cv.dataset.fondo; g.fillRect(0, 0, px, px); g.drawImage(img, 0, 0, px, px); };
      img.src = cv.dataset.src;
    });
  }
  C.disegniBreve = d => `<div class="disegni"><figure><div class="tavola" style="width:200px;height:200px"><img src="${d.base}disegno.svg" width="180" height="180" alt=""></div></figure>
    <figure><div class="tavola scura" style="width:200px;height:200px"><img src="${d.base}disegno.svg" width="180" height="180" alt=""></div></figure>
    <figure><div class="tavola" style="width:200px;height:200px">${mascherata(d.base + 'piena.svg', 180)}</div></figure>
    <figure><div class="tavola" style="width:200px;height:200px"><img src="${d.base}simbolica.svg" width="128" height="128" alt=""></div></figure></div><p>${d.idea}</p>`;
  C.barraBreve = d => `<img class="foto" src="${d.base}foto/barra/barra-1440-x3.png" alt=""><div style="height:8px"></div><img class="foto" src="${d.base}foto/barra/barra-con-azione-390-x3.png" alt=""><div style="height:8px"></div><img class="foto" src="${d.base}foto/barra/ar-XB-barra-x3.png" alt="">`;
  C.coppiaBreve = d => `<div class="coppia chiaro"><img src="${d.base}disegno.svg" alt=""><span>Kalliope</span></div>`;
  C.movimentoBreve = d => `<video src="${d.base}sequenze/barra-arrivo/barra-arrivo-1440-1200x216.webm" controls muted loop preload="metadata"></video>`;
  window.Contesti = {pagina};
})();
