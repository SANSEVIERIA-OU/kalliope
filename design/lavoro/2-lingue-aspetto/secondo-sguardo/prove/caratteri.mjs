// Quali file di caratteri chiede una pagina a riposo (senza scorrere), e quanti byte. Uso: node caratteri.mjs <base> <percorsi,...> [w h]
const pw = await import(process.env.PLAYWRIGHT);
const [base, percorsi, w = '1440', h = '900'] = process.argv.slice(2);
const b = await pw.chromium.launch({headless: true});
for (const percorso of percorsi.split(',')) {
  const ctx = await b.newContext({viewport: {width: +w, height: +h}}); const p = await ctx.newPage(); const f = [];
  p.on('response', async r => { if (/\.(woff2|ttf|otf)$/.test(r.url())) { let n = 0; try { n = (await r.body()).length; } catch {} f.push([r.url().split('/caratteri/')[1], n]); } });
  await p.goto(base + percorso, {waitUntil: 'load'}); await new Promise(r => setTimeout(r, 2500));
  const pre = await p.evaluate(() => [...document.querySelectorAll('link[rel=preload][as=font]')].map(l => l.getAttribute('href').split('/caratteri/')[1]));
  console.log(`${percorso} ${w}x${h}: ${f.length} file, ${f.reduce((a, x) => a + x[1], 0)} byte · ${f.map(x => x[0] + ' ' + x[1]).join(', ')} · precarico: ${pre.join(', ') || '-'}`);
  await ctx.close();
}
await b.close();
