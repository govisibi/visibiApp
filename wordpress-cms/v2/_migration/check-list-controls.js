/* Focused browser checks for Insights and SEO Services. */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'visibi-list-check-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-sandbox', '--no-first-run', '--disable-gpu',
  '--remote-allow-origins=*', '--remote-debugging-port=19389', '--user-data-dir=' + profile,
  'about:blank'
], { stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket, serial = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++serial;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.result.exceptionDetails) throw new Error(result.result.exceptionDetails.text);
  return result.result.result.value;
};
const check = async (name, expression) => {
  const value = await evaluate(expression);
  console.log(`${value ? 'PASS' : 'FAIL'} ${name}`);
  if (!value) throw new Error(name);
};
const origin = process.argv[2] || 'http://localhost:8082/v2';
const visit = async pathName => {
  await send('Page.navigate', { url: origin.replace(/\/$/, '') + pathName });
  await pause(1200);
};
(async () => {
  let pages;
  for (let i = 0; i < 40; i++) {
    try { pages = await (await fetch('http://localhost:19389/json')).json(); break; }
    catch { await pause(250); }
  }
  if (!pages) throw new Error('Chrome did not start');
  socket = new WebSocket(pages.find(item => item.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const job = pending.get(message.id); pending.delete(message.id);
      message.error ? job.reject(new Error(message.error.message)) : job.resolve(message);
    }
  };
  await visit('/insights/');
  await check('initial 12 cards', "document.querySelectorAll('[data-visibi-insight-card]:not([hidden])').length === 12");
  await check('show more reveals 12', "(document.querySelector('[data-visibi-insights-more]').click(),document.querySelectorAll('[data-visibi-insight-card]:not([hidden])').length === 24)");
  await check('category filters cards', "(() => { const b=[...document.querySelectorAll('section[data-screen-label=Hero] button')].find(x=>x.textContent.trim()==='Security'); if(!b)return false;b.click();const c=[...document.querySelectorAll('[data-visibi-insight-card]:not([hidden])')];return c.length>0&&c.every(x=>x.dataset.category==='Security') })()");
  await check('search filters cards', "(() => { const q=document.querySelector('input[aria-label=\"Search guides\"]');q.value='magento';q.dispatchEvent(new Event('input',{bubbles:true}));const c=[...document.querySelectorAll('[data-visibi-insight-card]:not([hidden])')];return c.every(x=>x.dataset.search.includes('magento')) })()");
  await visit('/seo-services/');
  await check('hero toggle changes score', "(() => { const b=[...document.querySelectorAll('section[data-screen-label=Hero] button')].find(x=>x.textContent.includes('See it after VISIBI'));if(!b)return false;b.click();return document.querySelector('section[data-screen-label=Hero]').textContent.includes('SCORE 86%') })()");
  await check('annual billing changes prices', "(() => { const p=document.querySelector('#pricing');const b=[...p.querySelectorAll('button')].find(x=>x.textContent.includes('Annual'));if(!b)return false;b.click();return p.textContent.includes('billed annually')&&p.textContent.includes('£761') })()");
  await check('promo applies', "(() => { const p=document.querySelector('#pricing'),q=p.querySelector('input[placeholder=\"Promo code\"]');if(!q)return false;q.value='EXTRA20';q.nextElementSibling.click();return p.textContent.includes('EXTRA20 applied')&&p.textContent.includes('£609') })()");
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => {
  socket?.close(); chrome.kill();
  const allowed = path.resolve(os.tmpdir()) + path.sep;
  if (path.resolve(profile).startsWith(allowed)) setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
});
