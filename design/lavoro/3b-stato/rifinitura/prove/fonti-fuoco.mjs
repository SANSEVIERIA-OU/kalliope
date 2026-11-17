// L'anello del fuoco sulle fonti (secondo sguardo, N6): con la tastiera, su ogni fonte provata (scena scura, scena chiara, due nomi nella stessa pillola): su che cosa sta l'anello,
// se è tondo, se copre il nome accanto, e la foto. Uso: node fonti-fuoco.mjs <cartella-sito> <porta> <motore> <uscita> [WxH=1440x900]
import {servi} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/servi.mjs';
import {avvia, pagina, tocco} from '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts/lib/comune.mjs';
import {mkdirSync} from 'node:fs';
const [cartella, porta, motore, uscita, misura = '1440x900'] = process.argv.slice(2);
const [W, H] = misura.split('x').map(Number);
mkdirSync(uscita, {recursive: true});
const server = await servi(cartella, {porta: +porta, fresco: true});
const b = await avvia(motore);
const ctx = await b.newContext({viewport: {width: W, height: H}, reducedMotion: 'reduce', ...tocco(motore, W <= 760)});
const errori = []; const p = pagina(await ctx.newPage(), errori);
await p.goto(`http://127.0.0.1:${porta}/it/stato/`, {waitUntil: 'networkidle'}); await p.waitForTimeout(1200);
// ogni nome di una fonte, per testo e posizione nella pillola
const bersagli = [['README della cifra (scena scura)', '.catena-programma .fonte a', 0], ['main.rs (scena chiara)', '.varco-passo[data-passo=testo] .fonte a', 0], ['LICENSE (due nomi)', '.licenze-blocco .fonte a', 0], ['NOTICE (due nomi)', '.licenze-blocco .fonte a', 1], ['engine.rs (due nomi, scena scura)', '.anello[data-anello=voce] .fonte a', 0], ['benchmarks/engines (due nomi, scena scura)', '.anello[data-anello=voce] .fonte a', 1]];
let male = 0;
for (const [nome, sel, k] of bersagli) {
  const a = p.locator(sel).nth(k);
  await a.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  // fuoco da tastiera: si va al comando prima e si preme Tab, così è :focus-visible in ogni motore
  await p.evaluate(([s, i]) => { const e = document.querySelectorAll(s)[i]; let prec = e.parentElement.previousElementSibling; document.body.focus(); const t = document.createElement('button'); t.id = '__prima'; t.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0'; document.body.append(t); e.focus(); }, [sel, k]);
  await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab'); await p.waitForTimeout(900);
  const r = await p.evaluate(([s, i]) => {
    const a = document.querySelectorAll(s)[i], pill = a.closest('.fonte'), ca = getComputedStyle(a), cp = getComputedStyle(pill);
    const ra = a.getBoundingClientRect(), rp = pill.getBoundingClientRect(), altri = [...pill.querySelectorAll('a')].filter(x => x !== a).map(x => x.getBoundingClientRect());
    const anello = el => { const c = getComputedStyle(el); return c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0 ? {larghezza: c.outlineWidth, colore: c.outlineColor, scarto: c.outlineOffset, raggio: c.borderTopLeftRadius} : null; };
    const sul = anello(a) ? 'nome' : anello(pill) ? 'pillola' : 'nessuno';
    const el = sul === 'nome' ? a : pill, re = el.getBoundingClientRect(), o = parseFloat(getComputedStyle(el).outlineWidth) + parseFloat(getComputedStyle(el).outlineOffset);
    const copre = sul === 'nome' && altri.some(x => re.left - o < x.right - 1 && re.right + o > x.left + 1 && re.top - o < x.bottom && re.bottom + o > x.top);   // l'anello tocca un altro nome
    return {sul, anello: anello(a) || anello(pill), focus: document.activeElement === a, visibile: a.matches(':focus-visible'), raggio: parseFloat(getComputedStyle(el).borderTopLeftRadius), larghezzaPillola: Math.round(rp.width), altezzaPillola: Math.round(rp.height), linea: ca.textDecorationThickness, copre,
      anelloAlto: Math.round(re.height + 2 * o), pillolaAlta: Math.round(rp.height)};
  }, [sel, k]);
  const ok = r.focus && r.visibile && r.sul === 'pillola' && r.raggio > 0 && !r.copre; if (!ok) male++;
  console.log(`${ok ? 'ok  ' : 'NO  '}${motore} ${nome}: l'anello sta sulla ${r.sul}${r.anello ? ` (${r.anello.larghezza}, scarto ${r.anello.scarto}, ${r.anello.colore})` : ''}, angoli ${r.raggio.toFixed(0)} px, ${r.copre ? 'COPRE il nome accanto' : 'non copre il nome accanto'}, linea del nome ${r.linea}`);
  const rp = await p.locator(sel).nth(k).evaluate(e => { const q = e.closest('.fonte').getBoundingClientRect(); return {x: q.x, y: q.y, w: q.width, h: q.height}; });
  await p.screenshot({path: `${uscita}/fonte-${nome.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${motore}.png`, clip: {x: Math.max(0, rp.x - 140), y: Math.max(0, rp.y - 22), width: Math.min(W - Math.max(0, rp.x - 140), rp.w + 190), height: rp.h + 44}});
  await p.evaluate(() => { const t = document.getElementById('__prima'); if (t) t.remove(); document.activeElement && document.activeElement.blur(); });
}
console.log(`\n${bersagli.length - male}/${bersagli.length} fonti con l'anello sulla pillola, tondo, senza coprire il nome accanto`);
await b.close(); server.close(); process.exit(male ? 1 : 0);
