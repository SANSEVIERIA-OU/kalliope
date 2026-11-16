// La pagina 404 (<base href="/kalliope/">) sotto il prefisso del sito su GitHub Pages: ogni suo collegamento porta a una pagina vera.
// Uso: node prova-404.mjs <cartella che contiene «kalliope» (il sito costruito)>
const SKILL = '/home/dev/.claude/plugins/cache/vibe-next/vibe-next/0.46.1/skills/design-system-generator/scripts';
const {avvia} = await import(`${SKILL}/lib/comune.mjs`);
const {servi} = await import(`${SKILL}/lib/servi.mjs`);
const server = await servi(process.argv[2], {porta: 0});
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await avvia('chromium');
const p = await browser.newPage();
const male = [];
p.on('response', r => { if (r.status() >= 400) male.push(`${r.status()} ${r.url()}`); });
await p.goto(`${base}/kalliope/404.html`, {waitUntil: 'load'});
const link = await p.$$eval('a[href]', as => as.map(a => ({testo: a.textContent.trim(), href: a.href})));
console.log(`${link.length} collegamenti, ${male.length} richieste fallite caricando la pagina`);
let ok = male.length === 0;
for (const l of link) {
  if (!l.href.startsWith(base)) continue;
  await p.goto(`${base}/kalliope/404.html`, {waitUntil: 'load'});
  const prima = male.length;
  await p.goto(l.href, {waitUntil: 'load'});
  await p.waitForTimeout(700);
  const fine = new URL(p.url()).pathname;
  const buono = male.length === prima && /^\/kalliope\/(it\/)?(|[a-z-]+\/)$/.test(fine) && (await p.title()).length > 0;
  ok = ok && buono;
  console.log(`${buono ? 'ok  ' : 'NO  '} «${l.testo}» ${new URL(l.href).pathname} → ${fine}`);
}
await browser.close(); server.close();
process.exit(ok ? 0 : 1);
