// Foto della home, con «riduci movimento»: a riposo, a ogni schermata dello scorrimento e negli stati aperti.
// Uso: node foto-home.mjs <cartella del sito costruito> <percorso della pagina, es. it/ o vuoto> <cartella di uscita>
//        [--motore chromium|firefox|webkit] [--misure 1440x900,390x844,820x1180,1366x640] [--stati] [--lang it-IT] [--porta 8770]
// Il sito si serve da sé, sulla porta indicata (nessun server da avviare a parte).
// Una foto per schermata, a grandezza vera (non «pagina intera»: lo scorrimento è guidato dalla scena).
// --stati: a 390x844 anche menu aperto, ascolto aperto (la voce resta in caricamento: nessun movimento) ed errore dell'audio.
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';

const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const pos = []; { const valori = new Set(['--motore', '--misure', '--lang', '--porta', '--nome']); const a = process.argv.slice(2); for (let i = 0; i < a.length; i++) { if (valori.has(a[i])) i++; else if (!a[i].startsWith('--')) pos.push(a[i]); } }
const [cartella, percorso = '', uscita] = pos;
if (!cartella || uscita === undefined) { console.error('uso: foto-home.mjs <cartella> <percorso pagina> <uscita> [--motore m] [--misure ..] [--stati]'); process.exit(2); }
const server = await servi(cartella, {porta: +arg('--porta', 8770), fresco: true});
const indirizzo = `http://127.0.0.1:${server.address().port}/${percorso}`;
const motore = arg('--motore', 'chromium');
const misure = arg('--misure', '1440x900,390x844,820x1180,1366x640').split(',').map(m => m.split('x').map(Number));
const stati = process.argv.includes('--stati'), senzaJs = process.argv.includes('--senza-js'), soloRiposo = process.argv.includes('--solo-riposo');
const lang = arg('--lang', 'it-IT');
mkdirSync(uscita, {recursive: true});

const browser = await avvia(motore);
const log = [];
for (const [w, h] of misure) {
  const ctx = await browser.newContext({viewport: {width: w, height: h}, reducedMotion: 'reduce', deviceScaleFactor: 1, locale: lang, javaScriptEnabled: !senzaJs});
  const pagina = async (prima) => {
    const p = await ctx.newPage();
    const errori = [];
    p.on('pageerror', e => errori.push('pageerror: ' + e.message));
    p.on('console', m => { if (m.type() === 'error') errori.push('console: ' + m.text()); });
    p.on('requestfailed', r => { if (!/voce\//.test(r.url())) errori.push('requestfailed: ' + r.url()); });
    if (prima) await prima(p);
    await p.goto(indirizzo, {waitUntil: 'load'});
    if (!senzaJs) await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1500);
    return {p, errori};
  };
  const nome = `${w}x${h}`;
  {
    const {p, errori} = await pagina();
    await p.screenshot({path: join(uscita, `${nome}-riposo.png`)});
    const H = soloRiposo ? 0 : await p.evaluate(() => document.documentElement.scrollHeight);
    let k = 1;
    for (let y = h; y < H + h && !soloRiposo; y += h, k++) {
      const yy = Math.min(y, Math.max(0, H - h));
      await p.evaluate(v => window.scrollTo(0, v), yy);
      await p.waitForTimeout(700);
      await p.screenshot({path: join(uscita, `${nome}-scorri-${String(k).padStart(2, '0')}.png`)});
      if (yy >= H - h) break;
    }
    log.push({misura: nome, altezza: H, schermate: k, errori});
    await p.close();
  }
  if (stati && w === 390 && !senzaJs) {
    // menu aperto
    {
      const {p} = await pagina();
      await p.click('.pulsante-menu'); await p.waitForTimeout(700);
      await p.screenshot({path: join(uscita, `${nome}-stato-menu.png`)}); await p.close();
    }
    // ascolto aperto, voce in caricamento
    {
      const {p} = await pagina(async p => { await p.route(/\/voce\/(giulia|marco)-\d\.(opus|mp3)/, () => {}); });
      await p.click('#ascolta'); await p.waitForTimeout(1200);
      await p.screenshot({path: join(uscita, `${nome}-stato-ascolto.png`)}); await p.close();
    }
    // errore dell'audio
    {
      const {p} = await pagina(async p => { await p.route(/\/voce\/(giulia|marco)-\d\.(opus|mp3)/, r => r.abort()); });
      await p.click('#ascolta'); await p.waitForTimeout(1500);
      await p.screenshot({path: join(uscita, `${nome}-stato-errore.png`)}); await p.close();
    }
  }
  await ctx.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(log));
