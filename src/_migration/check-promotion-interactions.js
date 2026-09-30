/* Compare imported controls with the approved HTML interactions in a real browser. */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'visibi-promotion-check-'));
const port = 19396;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-sandbox', '--no-first-run', '--disable-gpu',
  '--remote-allow-origins=*', '--remote-debugging-port=' + port, '--user-data-dir=' + profile,
  'about:blank'
], { stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const base = (process.argv[2] || 'http://localhost:8082/v2').replace(/\/$/, '');
let socket, serial = 0;
const pending = new Map(), exceptions = [];
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
const visit = async route => { await send('Page.navigate', { url: base + route }); await pause(1700); };
const check = async (label, expression) => {
  const pass = await evaluate(expression);
  console.log(`${pass ? 'PASS' : 'FAIL'} ${label}`);
  if (!pass) throw new Error(label);
};
(async () => {
  let pages;
  for (let i = 0; i < 50; i++) { try { pages = await (await fetch('http://localhost:' + port + '/json')).json(); break; } catch { await pause(200); } }
  if (!pages) throw new Error('Chrome did not start');
  socket = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text);
    if (message.id && pending.has(message.id)) {
      const job = pending.get(message.id); pending.delete(message.id);
      message.error ? job.reject(new Error(message.error.message)) : job.resolve(message);
    }
  };
  await send('Runtime.enable');
  await visit('/ai-agents/');
  await check('AI agent scenario tabs update run', "(() => {const h=document.querySelector('section[data-screen-label=Hero]');const b=[...h.querySelectorAll('button')].find(x=>x.textContent.trim()==='Sales');b?.click();return h.textContent.includes('LEAD QUALIFICATION')&&h.textContent.includes('Need 40 seats')})()");
  await check('AI agent replay restarts run', "(() => {const h=document.querySelector('section[data-screen-label=Hero]');const b=[...h.querySelectorAll('button')].find(x=>x.textContent.includes('Replay'));b?.click();return h.textContent.includes('RUNNING')})()");
  await check('AI agent use case filters', "(() => {const s=document.querySelector('#usecases');const b=[...s.querySelectorAll('button')].find(x=>x.textContent.trim()==='Finance');b?.click();return s.textContent.includes('Invoice processing agent')&&!s.textContent.includes('Content operations agent')})()");
  await check('AI agent promo code', "(() => {const s=document.querySelector('#packages'),q=s.querySelector('input[placeholder=\"Promo code\"]');q.value='EXTRA20';q.nextElementSibling.click();return s.textContent.includes('EXTRA20 applied')&&s.textContent.includes('£1,076')})()");
  await visit('/seo-services/');
  await check('service hero issue selection', "(() => {const h=document.querySelector('section[data-screen-label=Hero]'),b=[...h.querySelectorAll('button')].find(x=>x.textContent.includes('Found: Ecommerce SEO'));b?.click();return b?.getAttribute('aria-pressed')==='true'&&b.textContent.includes('Category, product')})()");
  await check('service hero before/after', "(() => {const h=document.querySelector('section[data-screen-label=Hero]'),b=[...h.querySelectorAll('button')].find(x=>x.textContent.includes('See it after VISIBI'));b?.click();return h.textContent.includes('SCORE 86%')})()");
  await check('service annual pricing', "(() => {const p=document.querySelector('#pricing'),b=[...p.querySelectorAll('button')].find(x=>x.textContent.includes('Annual'));b?.click();return p.textContent.includes('billed annually')})()");
  await check('service promo pricing', "(() => {const p=document.querySelector('#pricing'),q=p.querySelector('input[placeholder=\"Promo code\"]');q.value='EXTRA20';q.nextElementSibling.click();return p.textContent.includes('EXTRA20 applied')&&p.textContent.includes('£609')})()");
  await visit('/cloud-cost-optimisation/');
  await check('cloud savings slider', "(() => {const h=document.querySelector('section[data-screen-label=Hero]'),q=h.querySelector('input[aria-label=\"Monthly bill\"]');q.value='20000';q.dispatchEvent(new Event('input',{bubbles:true}));return h.textContent.includes('£20,000')&&h.textContent.includes('£13,000')})()");
  await visit('/software-consulting/');
  await check('consulting recommendation choices', "(() => {const h=document.querySelector('section[data-screen-label=Hero]'),b=[...h.querySelectorAll('button')].find(x=>x.textContent.trim()==='Enterprise');b?.click();return b?.getAttribute('aria-pressed')==='true'})()");
  await visit('/managed-hosting/');
  await check('hosting Black Friday simulator', "(() => {const h=document.querySelector('section[data-screen-label=Hero]'),b=[...h.querySelectorAll('button')].find(x=>x.textContent.includes('Simulate Black Friday'));b?.click();return h.textContent.includes('Black Friday spike')&&h.textContent.includes('9.2×')})()");
  await visit('/shopify-plus/');
  await check('store desktop audit', "(() => {const h=document.querySelector('section[data-screen-label=Hero]'),b=[...h.querySelectorAll('button')].find(x=>x.textContent.trim()==='Desktop');b?.click();return h.textContent.includes('3.1s')&&b?.getAttribute('aria-pressed')==='true'})()");
  await check('store before/after audit', "(() => {const h=document.querySelector('section[data-screen-label=Hero]'),b=[...h.querySelectorAll('button')].find(x=>x.textContent.includes('See it after VISIBI'));b?.click();return h.textContent.includes('AFTER VISIBI')&&h.textContent.includes('0.9s')})()");
  await visit('/react-development/');
  await check('development estimate choices', "(() => {const h=document.querySelector('section[data-screen-label=Hero]'),b=[...h.querySelectorAll('button')].find(x=>x.textContent.trim()==='Large');b?.click();return b?.getAttribute('aria-pressed')==='true'&&h.textContent.includes('20 wks')})()");
  await visit('/website-security/');
  const beforeSecurity = await evaluate("document.querySelector('section[data-screen-label=Hero]').textContent");
  await pause(2500);
  await check('security dashboard activity rotates', `document.querySelector('section[data-screen-label=Hero]').textContent !== ${JSON.stringify(beforeSecurity)}`);
  await visit('/website-support-and-maintenance/');
  const beforeSupport = await evaluate("document.querySelector('section[data-screen-label=Hero]').textContent");
  await pause(2500);
  await check('support dashboard activity rotates', `document.querySelector('section[data-screen-label=Hero]').textContent !== ${JSON.stringify(beforeSupport)}`);
  await visit('/');
  await check('red banner controls', "(() => {const b=document.querySelector('[data-visibi-announcement]');b.querySelector('[data-announcement-dot=\"1\"]').click();b.querySelector('[data-announcement-dot=\"0\"]').click();return b.querySelector('[data-announcement-dot=\"0\"]').getAttribute('aria-current')==='true'&&b.style.background.includes('220, 38, 38')})()");
  if (exceptions.length) throw new Error('Browser exceptions: ' + exceptions.join('; '));
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => {
  socket?.close(); chrome.kill();
  const allowed = path.resolve(os.tmpdir()) + path.sep;
  if (path.resolve(profile).startsWith(allowed)) setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
});
