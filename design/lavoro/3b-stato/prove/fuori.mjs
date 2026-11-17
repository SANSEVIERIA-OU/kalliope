// A una larghezza, con tutti i dettagli aperti: c'è un'etichetta di fonte o un testo che esce dalla cornice della sua tappa o dallo schermo?
const {chromium} = await import(process.env.PLAYWRIGHT);
const [url, ...misure] = process.argv.slice(2);
const b = await chromium.launch();
for (const m of misure) {
  const [w, h] = m.split('x').map(Number);
  const p = await b.newPage({viewport: {width: w, height: h}});
  await p.goto(url, {waitUntil: 'networkidle'}); await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    document.querySelectorAll('details').forEach(d => { d.open = true; });
    const out = [];
    document.querySelectorAll('.fonte, .anello-fatti p, .varco-passo p, .licenze p, .cifra-numero').forEach(e => {
      const r = e.getBoundingClientRect(), box = (e.closest('.anello, .varco-passo, .licenze-blocco') || document.body).getBoundingClientRect();
      if (r.right > Math.min(box.right, innerWidth) + 0.5 || r.left < Math.max(box.left, 0) - 0.5) out.push(`${e.className || e.tagName}: ${e.textContent.trim().slice(0, 30)} (${Math.round(r.left)}–${Math.round(r.right)} in ${Math.round(box.left)}–${Math.round(box.right)})`);
    });
    return {fuori: out, scorreDiLato: document.documentElement.scrollWidth > innerWidth};
  });
  console.log(m, JSON.stringify(r));
  await p.close();
}
await b.close();
