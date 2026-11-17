// Foto della home in più lingue: a riposo, a ogni schermata dello scorrimento, con l'ascolto aperto e (al telefono) con il menu aperto.
// Uso: node foto-lingue.mjs <sito costruito> <uscita> --lingue ar,hi,… [--misure 1440x900,390x844] [--porta 8800]
//        [--solo-riposo] [--senza-stati] [--movimento]   (predefinito: «riduci movimento», foto stabili)
// Una cartella per lingua: <uscita>/<lingua>/<misura>-riposo.png, -scorri-NN.png, -ascolto.png, -menu.png; più un foglio per misura.
// Il sito si serve da sé (nessun server da avviare a parte). Nessuna finestra: Chromium senza schermo.
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';

const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const [cartella, uscita] = process.argv.slice(2);
if (!cartella || !uscita || cartella.startsWith('--')) { console.error('uso: foto-lingue.mjs <sito> <uscita> --lingue ar,hi'); process.exit(2); }
const lingue = arg('--lingue', 'it').split(',');
const misure = arg('--misure', '1440x900,390x844').split(',').map(m => m.split('x').map(Number));
const soloRiposo = process.argv.includes('--solo-riposo'), senzaStati = process.argv.includes('--senza-stati');
const movimento = process.argv.includes('--movimento');
const server = await servi(cartella, {porta: +arg('--porta', 8800), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await avvia('chromium');
const esiti = [];
for (const lingua of lingue) {
  const dir = join(uscita, lingua); mkdirSync(dir, {recursive: true});
  for (const [w, h] of misure) {
    const nome = `${w}x${h}`;
    const ctx = await browser.newContext({viewport: {width: w, height: h}, reducedMotion: movimento ? 'no-preference' : 'reduce', deviceScaleFactor: 1, locale: lingua});
    const apri = async (prima) => {
      const p = await ctx.newPage(); const errori = [];
      p.on('pageerror', e => errori.push('pageerror: ' + e.message));
      p.on('console', m => { if (m.type() === 'error') errori.push('console: ' + m.text()); });
      p.on('requestfailed', r => { if (!/voce\//.test(r.url())) errori.push('requestfailed: ' + r.url()); });
      if (prima) await prima(p);
      await p.goto(`${base}${lingua}/`, {waitUntil: 'load'});
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(movimento ? 16500 : 1500);
      return {p, errori};
    };
    const {p, errori} = await apri();
    await p.screenshot({path: join(dir, `${nome}-riposo.png`)});
    const foto = [`${nome}-riposo.png`];
    if (!soloRiposo) {
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = h, k = 1; y < H + h; y += h, k++) {
        const yy = Math.min(y, Math.max(0, H - h));
        await p.evaluate(v => window.scrollTo(0, v), yy); await p.waitForTimeout(700);
        const f = `${nome}-scorri-${String(k).padStart(2, '0')}.png`; await p.screenshot({path: join(dir, f)}); foto.push(f);
        if (yy >= H - h) break;
      }
    }
    await p.close();
    if (!senzaStati) {
      { // l'ascolto aperto: la voce resta in caricamento (la richiesta non risponde), così la scena è ferma
        const {p} = await apri(async p => { await p.route(/\/voce\/(giulia|marco)-\d\.(opus|mp3)/, () => {}); });
        await p.click('#ascolta'); await p.waitForTimeout(1200);
        await p.screenshot({path: join(dir, `${nome}-ascolto.png`)}); foto.push(`${nome}-ascolto.png`); await p.close();
      }
      if (w < 960) {
        const {p} = await apri();
        await p.click('.pulsante-menu'); await p.waitForTimeout(700);
        await p.screenshot({path: join(dir, `${nome}-menu.png`)}); foto.push(`${nome}-menu.png`); await p.close();
      }
    }
    esiti.push({lingua, misura: nome, foto: foto.length, errori});
    await ctx.close();
    // un foglio per misura e lingua, per guardare tutto insieme (le foto a grandezza vera restano accanto)
    const larga = w > 900 ? 480 : 260;
    execFileSync('python3', [new URL('./foglio.py', import.meta.url).pathname, join(dir, `foglio-${nome}.png`), String(larga), '6', ...foto.map(f => join(dir, f))]);
  }
}
await browser.close(); server.close();
writeFileSync(join(uscita, 'esiti.json'), JSON.stringify(esiti, null, 1));
for (const e of esiti) console.log(`${e.lingua} ${e.misura}: ${e.foto} foto${e.errori.length ? ', ERRORI: ' + e.errori.join(' | ') : ''}`);
