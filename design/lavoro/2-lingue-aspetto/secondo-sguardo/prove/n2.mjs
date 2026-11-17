const pw = await import(process.env.PLAYWRIGHT);
const [url] = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await pw.chromium.launch({headless: true, args: ['--autoplay-policy=no-user-gesture-required']});
for (const [w, h] of [[390, 844], [326, 326], [1440, 900]]) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, ...(w < 900 ? {isMobile: true, hasTouch: true} : {})}); const p = await ctx.newPage();
  await p.goto(url, {waitUntil: 'load'}); await sleep(1000);
  await p.evaluate(() => document.querySelector('.suona-frase').scrollIntoView({block: 'center'})); await sleep(1500);
  const m = () => p.evaluate(() => { const btn = document.querySelector('.suona-frase'), r = btn.getBoundingClientRect();
    const parti = [btn.querySelector('.tondo'), ...[...btn.querySelectorAll('.etichette > span')].filter(s => getComputedStyle(s).display !== 'none' && getComputedStyle(s).visibility !== 'hidden' && +getComputedStyle(s).opacity > 0.1)];
    const rr = parti.map(e => e.getBoundingClientRect()).filter(x => x.width > 0); const l = Math.min(...rr.map(x => x.left)), d = Math.max(...rr.map(x => x.right));
    return `${btn.textContent.replace(/\s+/g, ' ').trim().slice(0, 0)}larga ${Math.round(r.width)} · sinistra ${Math.round(l - r.left)} · destra ${Math.round(r.right - d)} · «${parti.slice(1).map(e => e.textContent.trim()).join('|')}»`; });
  const out = [`riposo: ${await m()}`];
  if (w < 900) await p.tap('.suona-frase'); else await p.click('.suona-frase');
  await sleep(1200); out.push(`suona: ${await m()}`);
  if (w < 900) await p.tap('.suona-frase'); else await p.click('.suona-frase');
  await sleep(500); out.push(`pausa: ${await m()}`);
  console.log(`${w}x${h} ` + out.join(' ‖ '));
  await ctx.close();
}
await b.close();
