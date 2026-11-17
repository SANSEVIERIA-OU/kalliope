// L'indirizzo principale con una lingua sola: dove si arriva da «/», «/?lingue», «/#a» e da un vecchio indirizzo, con e senza JavaScript,
// nei tre motori; e che «Indietro» non riporti sul rimando. Uso: node radice.mjs <sito costruito> [--porta 8840] [--motori chromium,firefox,webkit]
import {createRequire} from 'node:module';
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const sito = process.argv[2];
const server = await servi(sito, {porta: +arg('--porta', 8840), fresco: true});
const base = `http://127.0.0.1:${server.address().port}`;
// con JavaScript la query e il frammento restano; senza, il rimando è un <meta refresh> e arriva soltanto la pagina (come per i vecchi indirizzi)
const casi = [['/', '/it/', '/it/'], ['/?lingue', '/it/?lingue', '/it/'], ['/#a', '/it/#a', '/it/'], ['/installa/', '/it/installa/', '/it/installa/'], ['/installa/?x=1#y', '/it/installa/?x=1#y', '/it/installa/']];
const PRIMA = '/404.html';   // la pagina da cui si parte: «Indietro» deve tornare qui, non sul rimando
let rosse = 0;
for (const motore of arg('--motori', 'chromium,firefox,webkit').split(',')) {
  const b = await avvia(motore);
  for (const js of [true, false]) {
    const ctx = await b.newContext({javaScriptEnabled: js});
    for (const [da, conJs, senzaJs] of casi) {
      const atteso = js ? conJs : senzaJs;
      const p = await ctx.newPage(); const err = [];
      p.on('pageerror', e => err.push(e.message));
      await p.goto(base + PRIMA, {waitUntil: 'load'});
      await p.goto(base + da, {waitUntil: 'load'}).catch(e => err.push(String(e.message).slice(0, 80)));
      await p.waitForURL(u => u.pathname.startsWith('/it/'), {timeout: 4000}).catch(() => {});
      const fin = new URL(p.url()); const url = fin.pathname + fin.search + fin.hash;
      // Indietro: deve tornare alla pagina di prima, non al rimando
      await p.goBack({timeout: 3000}).catch(() => {});
      const dopo = p.url();
      const ok = url === atteso && dopo === base + PRIMA && !err.length;
      if (!ok) rosse++;
      console.log(`${motore} js=${js ? 'sì' : 'no'} ${da.padEnd(18)} → ${url.padEnd(20)} indietro: ${dopo === base + PRIMA ? 'ok' : dopo} ${ok ? 'ok' : 'ROSSO ' + (url !== atteso ? 'atteso ' + atteso : '') + err.join('|')}`);
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
}
server.close();
console.log(rosse ? `${rosse} ROSSE` : 'tutto ok');
process.exit(rosse ? 1 : 0);
