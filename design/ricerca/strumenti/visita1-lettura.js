/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
(() => {
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const nome = e => (e.getAttribute('aria-label') || e.innerText || e.value || e.getAttribute('title') || e.alt || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const inter = [...document.querySelectorAll('a,button,input,select,textarea,summary,[role=button],[role=link],[tabindex],[onclick]')].filter(vis).map(e => { const r = e.getBoundingClientRect(); return `${e.tagName.toLowerCase()}${e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : ''} «${nome(e)}» ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}${e.tabIndex >= 0 ? ' tab' + e.tabIndex : ''}${e.getAttribute('href') ? ' → ' + e.getAttribute('href').slice(0, 60) : ''}`; });
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e => `${e.tagName} ${vis(e) ? '' : '(nascosto) '}«${e.innerText.trim().slice(0, 60)}»`);
  const land = [...document.querySelectorAll('header,nav,main,footer,aside,section,[role=banner],[role=navigation],[role=main],[role=contentinfo]')].map(e => e.tagName.toLowerCase() + (e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : '') + (e.getAttribute('aria-label') ? '«' + e.getAttribute('aria-label') + '»' : ''));
  const imgs = [...document.images].map(e => ({src: (e.currentSrc || e.src).slice(-50), alt: e.getAttribute('alt'), w: e.naturalWidth}));
  const meta = {};
  for (const m of document.querySelectorAll('meta[property],meta[name]')) { const k = m.getAttribute('property') || m.getAttribute('name'); if (/^(og:|twitter:|description|viewport|theme-color|color-scheme)/.test(k)) meta[k] = m.content.slice(0, 120); }
  const body = getComputedStyle(document.body);
  const texts = [...document.querySelectorAll('p,li,span,div,a,button')].filter(e => vis(e) && e.children.length === 0 && e.innerText && e.innerText.trim().length > 12);
  const fs = texts.slice(0, 8).map(e => { const c = getComputedStyle(e); return `${e.tagName} «${e.innerText.trim().slice(0, 30)}» ${c.fontSize}/${c.lineHeight} ${c.fontFamily.split(',')[0]} ${c.fontWeight} ${c.color}`; });
  const L = [];
  L.push('lang=' + document.documentElement.lang + ' title=' + document.title);
  L.push('bodyFont=' + body.fontFamily.slice(0, 60) + ' bodyBg=' + body.backgroundColor);
  L.push('scroll(sw,sh,iw,ih)=' + [document.documentElement.scrollWidth, document.documentElement.scrollHeight, innerWidth, innerHeight].join(','));
  L.push('canvas=' + [...document.querySelectorAll('canvas')].map(c => c.width + 'x' + c.height).join(',') + ' video=' + document.querySelectorAll('video').length + ' audio=' + document.querySelectorAll('audio').length + ' iframe=' + document.querySelectorAll('iframe').length + ' nimgs=' + imgs.length + ' imgsSenzaAlt=' + imgs.filter(i => i.alt === null || i.alt === '').length);
  L.push('skip=' + !![...document.querySelectorAll('a')].find(a => /skip|salta/i.test(a.innerText + a.getAttribute('href'))) + ' landmarks=' + land.slice(0, 14).join(','));
  L.push('meta=' + JSON.stringify(meta));
  L.push('fonti=' + [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight).slice(0, 10).join('; '));
  L.push('--inter (' + inter.length + ')'); inter.slice(0, 30).forEach(x => L.push(x));
  L.push('--heads (' + heads.length + ')'); heads.slice(0, 24).forEach(x => L.push(x));
  L.push('--testo'); fs.forEach(x => L.push(x));
  L.push('--imgs'); imgs.slice(0, 8).forEach(i => L.push(JSON.stringify(i)));
  return L.join('\n');
})()
