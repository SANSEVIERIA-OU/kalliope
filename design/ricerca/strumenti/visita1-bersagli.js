/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
(() => {
  const vis = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && parseFloat(c.opacity) > 0.05 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth; };
  const els = [...document.querySelectorAll('*')].filter(e => vis(e) && getComputedStyle(e).cursor === 'pointer' && !(e.parentElement && getComputedStyle(e.parentElement).cursor === 'pointer' && vis(e.parentElement)));
  const out = els.map(e => { const r = e.getBoundingClientRect(); return {t: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''), txt: (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 30), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)}; });
  let dmin = null; for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) { const a = out[i], b = out[j]; const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.w, b.x + b.w)), dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.h, b.y + b.h)); const d = Math.hypot(dx, dy); if (dmin === null || d < dmin) dmin = d; }
  return {n: out.length, wmin: Math.min(...out.map(o => o.w)), hmin: Math.min(...out.map(o => o.h)), dmin: dmin === null ? null : Math.round(dmin), out};
})()
