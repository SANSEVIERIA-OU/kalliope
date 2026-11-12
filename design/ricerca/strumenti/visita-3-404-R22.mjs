/* SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0 */
// R22: indirizzo inesistente (stato HTTP, schermata, testo). Posto libero, Chromium.
import fs from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT); const chromium = pw.chromium || pw.default.chromium;
const browser = await chromium.launch({headless: true, channel: 'chromium', args: ['--hide-scrollbars']});
const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, locale: 'it-IT'}); const page = await ctx.newPage();
const r = await page.goto('https://searchingforbirds.visualcinnamon.com/pagina-che-non-esiste', {waitUntil: 'load', timeout: 45000}).catch(e => ({status: () => String(e)}));
await new Promise(x => setTimeout(x, 3000));
await page.screenshot({path: '/workspace/kalliope/design/ricerca/prove/R22/script/404.png'});
const d = await page.evaluate(() => ({titolo: document.title, testo: document.body.innerText.trim().replace(/\s+/g, ' ').slice(0, 300), link: [...document.querySelectorAll('a')].map(a => [a.textContent.trim().slice(0, 30), a.getAttribute('href')]).slice(0, 8)}));
fs.writeFileSync('/workspace/kalliope/design/ricerca/prove/R22/script/404.json', JSON.stringify({url: 'https://searchingforbirds.visualcinnamon.com/pagina-che-non-esiste', stato_http: r.status(), ...d}, null, 1));
console.log(r.status(), JSON.stringify(d));
await browser.close();
