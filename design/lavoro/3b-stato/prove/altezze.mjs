// L'altezza della pagina e dei suoi tratti (I4), alle misure date. Uso: node altezze.mjs <indirizzo> <misura>…
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, ...misure] = process.argv.slice(2);
const b = await chromium.launch();
for (const m of misure) {
  const [w, h] = m.split('x').map(Number);
  const p = await b.newPage({viewport: {width: w, height: h}});
  await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const alt = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().height) : null; };
    const y = s => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
    return {pagina: document.documentElement.scrollHeight, scena: alt('.scena'), catena: alt('#provato'), domande: alt('#per-chi'), controllare: alt('#controllare'), inoltra: alt('#inoltra'),
      daDomandeAInoltra: y('#inoltra') - (y('#per-chi .domande') + alt('#per-chi .domande'))};
  });
  console.log(m, JSON.stringify(r));
  await p.close();
}
await b.close();
