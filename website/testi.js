/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// I testi di una pagina per il suo script, nella lingua della pagina.
// Il testo non sta negli script: sta nella pagina, segnato come ogni altro testo (data-t), e si traduce con lei
// (docs/translating.md). Quello che uno script legge e la pagina non mostra sta in <template id="testi-…">, che il browser
// non disegna: un elemento con data-t per ogni testo, con le parole nella lingua della pagina. Qui:
//   Testi.testo(chiave)             il testo di quella chiave (prima nei <template id^="testi-">, poi nella pagina)
//   Testi.chiavi(prefisso)          le chiavi dei <template id^="testi-"> che cominciano così
//   Testi.formato(testo, {nome: v}) mette i valori al posto dei segnaposto {nome}
//   Testi.plurale(chiave, n, {…})   la forma giusta per n (data-t-forme e data-t-nomi, che la costruzione mette)
//   Testi.numero(n, opzioni)        un numero come lo scrive la lingua (Intl.NumberFormat)
//   Testi.minuti(secondi)           «0:03»: minuti e secondi con le cifre della lingua
//   Testi.verso()                   1 con la scrittura da sinistra a destra, −1 da destra a sinistra: la variabile --verso
//                                   di design-system/token.css (la cambia <html dir="rtl">)
(() => {
  'use strict';
  const lingua = () => document.documentElement.lang || 'it';
  const modelli = () => [...document.querySelectorAll('template[id^="testi-"]')].map(t => t.content);   // a ogni uso: lo script può stare prima dei modelli
  const cerca = chiave => {
    const sel = `[data-t="${CSS.escape(chiave)}"]`;
    for (const m of modelli()) { const e = m.querySelector(sel); if (e) return e; }
    return document.querySelector(sel);
  };
  const nf = {};
  const formatoNumero = opzioni => { const k = lingua() + JSON.stringify(opzioni || {}); return nf[k] || (nf[k] = new Intl.NumberFormat(lingua(), opzioni)); };
  const T = {
    testo(chiave) { const e = cerca(chiave); return e ? e.textContent : chiave; },
    formato(testo, valori = {}) { return testo.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (tutto, k) => (k in valori ? valori[k] : tutto)); },
    chiavi(prefisso) { return modelli().flatMap(m => [...m.querySelectorAll('[data-t]')]).map(e => e.dataset.t).filter(k => k.startsWith(prefisso)); },
    numero(n, opzioni) { return formatoNumero(opzioni).format(n); },
    minuti(secondi) {
      return `${T.numero(Math.floor(secondi / 60))}:${T.numero(Math.round(secondi % 60), {minimumIntegerDigits: 2})}`;
    },
    plurale(chiave, n, valori = {}) {
      const e = cerca(chiave);
      if (!e || !e.dataset.tForme) return T.formato(T.testo(chiave), {n: T.numero(n), ...valori});
      const forme = JSON.parse(e.dataset.tForme), nomi = e.dataset.tNomi.split(' ');
      const i = nomi.indexOf(new Intl.PluralRules(lingua()).select(n));
      return T.formato(forme[i >= 0 ? i : forme.length - 1], {n: T.numero(n), ...valori});
    },
    verso() {
      const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--verso'));
      return v === -1 ? -1 : 1;
    },
  };
  window.Testi = T;
})();
