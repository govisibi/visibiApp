/* Focused browser checks for every exported form family. */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'visibi-form-ui-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-sandbox', '--no-first-run', '--disable-gpu',
  '--remote-allow-origins=*', '--remote-debugging-port=19391', '--user-data-dir=' + profile,
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
const base = (process.argv[2] || 'http://localhost:8082/v2').replace(/\/$/, '');
const visit = async page => { await send('Page.navigate', { url: base + page }); await pause(1100); };
(async () => {
  let pages;
  for (let i = 0; i < 40; i++) {
    try { pages = await (await fetch('http://localhost:19391/json')).json(); break; }
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
  await visit('/contact/');
  await check('URL field accepts a domain without a scheme', "document.querySelector('[name=visibi_url]').type==='text'");
  await visit('/seo-services/');
  await check('service enquiry records page context', "document.querySelector('#visibi-enquiry [name=visibi_need]').value.includes('SEO Services')");
  await visit('/careers/');
  await check('job role click selects application role', "(() => { const b=document.querySelector('#roles [id^=role-] > button');if(!b)return false;b.click();return document.querySelector('[name=visibi_role]').value.includes('Magento') })()");
  await check('career form accepts a CV', "document.querySelector('[name=visibi_cv]').required && document.querySelector('#visibi-enquiry').enctype==='multipart/form-data'");
  await visit('/about/');
  await check('remote meeting disables in-person choice', "(() => { const r=document.querySelector('[name=visibi_region]');r.value='USA';r.dispatchEvent(new Event('change',{bubbles:true}));return [...document.querySelector('[name=visibi_mode]').options].find(x=>x.value==='In person').disabled && document.querySelector('[name=visibi_timezone]').value==='US Eastern time' })()");
  await visit('/insights/');
  await check('newsletter is a real email form', "!!document.querySelector('#visibi-newsletter input[type=email][required]') && document.querySelectorAll('section[data-screen-label=Newsletter] form').length===1");
  await visit('/pay-invoice/');
  await check('invoice form requests verified payment details', "!!document.querySelector('#visibi-enquiry [name=visibi_invoice]') && !document.querySelector('main').textContent.includes('Payment successful.')");
  await check('footer has approved social links only', "(() => { const f=document.querySelector('.site-footer__social');return f.querySelectorAll('a').length===2 && !!f.querySelector('a[href=\"https://x.com/VisibiAI\"]') && !!f.querySelector('a[href=\"https://www.linkedin.com/company/visibi-ai/\"]') })()");
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => {
  socket?.close(); chrome.kill();
  const allowed = path.resolve(os.tmpdir()) + path.sep;
  if (path.resolve(profile).startsWith(allowed)) setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
});
