// Foto a pagina intera di home, «stato» e «non ancora» nei tre motori, per confrontare due versioni di Playwright o due costruzioni del sito.
// Uso: PLAYWRIGHT=… [PLAYWRIGHT_BROWSERS_PATH=…] [METODO_MOTORI=…] node foto-motori.mjs <sito costruito> <uscita>
//        [--motori chromium,firefox,webkit] [--lingue it] [--pagine home,stato,non-ancora] [--misure 1440x900,390x844] [--porta 8975]
// Una foto per motore, lingua, pagina e misura: <uscita>/<motore>/<lingua>-<pagina>-<larghezza>.png. Un browser alla volta, senza finestra.
// «Riduci movimento» e scala 1: foto stabili. La pagina si scorre fino in fondo e si torna in cima (il piede e gli elenchi si impaginano
// e scaricano i loro caratteri solo quando sono vicini allo schermo: content-visibility), poi si aspetta e si fotografa.
// Stampa anche gli errori delle pagine e le richieste fallite, e i caratteri scaricati (famiglia, byte) per ogni foto.
import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const SKILL = process.env.SKILL || '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.49.0/skills/design-system-generator';
const {avvia} = await import(`${SKILL}/scripts/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/scripts/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const [cartella, uscita] = process.argv.slice(2);
if (!cartella || !uscita || cartella.startsWith('--')) { console.error('uso: foto-motori.mjs <sito> <uscita> [--motori …] [--lingue it] [--pagine …] [--misure …] [--porta N]'); process.exit(2); }
const motori = arg('--motori', 'chromium,firefox,webkit').split(',');
const lingue = arg('--lingue', 'it').split(',');
const PAGINE = {home: '', stato: 'stato/', 'non-ancora': 'non-ancora/'};
const pagine = arg('--pagine', 'home,stato,non-ancora').split(',');
const misure = arg('--misure', '1440x900,390x844').split(',').map(m => m.split('x').map(Number));
const server = await servi(cartella, {porta: +arg('--porta', 8975), fresco: true});
const base = `http://127.0.0.1:${server.address().port}/`;
const esiti = {};
try {
  for (const motore of motori) {
    const dir = join(uscita, motore); mkdirSync(dir, {recursive: true});
    const browser = await avvia(motore);
    esiti[motore] = {versione: browser.version(), foto: {}};
    try {
      for (const lingua of lingue) for (const pagina of pagine) for (const [w, h] of misure) {
        const nome = `${lingua}-${pagina}-${w}`;
        const ctx = await browser.newContext({viewport: {width: w, height: h}, reducedMotion: 'reduce', deviceScaleFactor: 1, locale: lingua});
        const p = await ctx.newPage(); const errori = [], caratteri = {};
        p.on('pageerror', e => errori.push('pageerror: ' + e.message));
        p.on('console', m => { if (m.type() === 'error') errori.push('console: ' + m.text()); });
        p.on('requestfailed', r => { if (!/voce\//.test(r.url())) errori.push('requestfailed: ' + r.url()); });
        p.on('response', async r => { if (/\.woff2?$/.test(r.url())) caratteri[r.url().replace(base, '')] = (await r.body().catch(() => Buffer.alloc(0))).length; });
        await p.goto(`${base}${lingua}/${PAGINE[pagina]}`, {waitUntil: 'load'});
        await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1200);
        const H = await p.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < H; y += Math.round(h * 0.8)) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(150); }
        await p.evaluate(() => { window.scrollTo(0, 0); return document.fonts.ready; }); await p.waitForTimeout(900);
        await p.screenshot({path: join(dir, nome + '.png'), fullPage: true});
        esiti[motore].foto[nome] = {altezza: await p.evaluate(() => document.documentElement.scrollHeight), caratteri, errori};
        console.log(`${motore} ${nome}: ${Object.keys(caratteri).length} file di caratteri${errori.length ? ', ERRORI: ' + errori.join(' | ') : ''}`);
        await ctx.close();
      }
    } finally { await browser.close().catch(() => {}); }
    await new Promise(ok => setTimeout(ok, 500));
  }
} finally { server.close(); }
mkdirSync(uscita, {recursive: true});
writeFileSync(join(uscita, 'esiti.json'), JSON.stringify(esiti, null, 1));
