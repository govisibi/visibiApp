/* Browser check for migrated homepage controls. Requires local Chrome and /v2 preview. */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'visibi-cdp-'));
const port = 19387;
const chrome = spawn(chromePath, ['--headless=new', '--no-sandbox', '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--remote-allow-origins=*', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket, next = 0;
const pending = new Map();
async function command(method, params = {}) {
  const id = ++next;
  return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.result.exceptionDetails) throw new Error(result.result.exceptionDetails.text);
  return result.result.result.value;
}
(async () => {
  let pages;
  for (let i = 0; i < 40; i++) {
    try { pages = await (await fetch('http://localhost:' + port + '/json')).json(); break; } catch { await pause(250); }
  }
  if (!pages) throw new Error('Chrome did not start');
  const page = pages.find(item => item.type === 'page');
  if (!page) throw new Error('Chrome page target missing');
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') console.error('Browser exception:', message.params.exceptionDetails.text);
    if (message.id && pending.has(message.id)) {
      const job = pending.get(message.id); pending.delete(message.id);
      message.error ? job.reject(new Error(message.error.message)) : job.resolve(message);
    }
  };
  await command('Runtime.enable');
  await command('Page.navigate', { url: 'http://localhost:8082/v2/' });
  await pause(1800);
  const checks = [];
  const check = (name, value) => { checks.push({ name, pass: !!value }); if (!value) throw new Error(name + ' failed'); };
  check('WordPress favicon', await evaluate("!!document.querySelector('link[rel=icon][href*=visibi-site-icon]')"));
  check('logo animation', await evaluate("getComputedStyle(document.querySelector('.visibi-logo-mark g')).animationName === 'visibiLogoSpin'"));
  check('scroller animation', await evaluate("[...document.querySelectorAll('[style*=visibiMarquee]')].some(el => getComputedStyle(el).animationName === 'visibiMarquee')"));
  check('announcement advance', await evaluate("(document.querySelector('[data-announcement-dot=\"1\"]').click(), document.querySelector('[data-announcement-dot=\"1\"]').getAttribute('aria-current') === 'true')"));
  check('mega menu tab', await evaluate("(document.querySelector('#site-services').open=true,document.querySelector('[data-service-tab=\"1\"]').click(),!document.querySelector('[data-service-panel=\"1\"]').hidden)"));
  check('FAQ toggle', await evaluate("(document.querySelector('#faq [data-visibi-faq=\"1\"]').click(),document.querySelector('#faq [data-visibi-faq=\"1\"]').getAttribute('aria-expanded') === 'true')"));
  check('process tab', await evaluate("(document.querySelectorAll('#how button')[1].click(),document.querySelector('#how').textContent.includes('Opportunity mapping'))"));
  await pause(500);
  check('service tab', await evaluate("(document.querySelectorAll('#services button')[1].click(),document.querySelector('#services').textContent.includes('Google Ads & Shopping'))"));
  check('game opens', await evaluate("(document.querySelector('#game button').click(),!!document.querySelector('[data-k=panel]'))"));
  await evaluate("document.querySelector('[aria-label=Close]').click()");
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await pause(100);
  check('mobile menu', await evaluate("(document.querySelector('.menu-toggle').click(),document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true' && document.querySelector('#site-nav').classList.contains('is-open'))"));
  console.log(JSON.stringify({ checks }, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => {
  socket?.close(); chrome.kill();
  setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
});
