/* Browser check for the WordPress peak traffic calculator. */
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'visibi-peak-check-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-sandbox', '--no-first-run', '--disable-gpu',
  '--remote-allow-origins=*', '--remote-debugging-port=19390', '--user-data-dir=' + profile,
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
const origin = (process.argv[2] || 'http://localhost:8082/v2').replace(/\/$/, '');
(async () => {
  let pages;
  for (let i = 0; i < 40; i++) {
    try { pages = await (await fetch('http://localhost:19390/json')).json(); break; }
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
  await send('Page.navigate', { url: origin + '/peak-traffic-readiness/' });
  await pause(1500);
  const setRange = (index, value) => `(() => { const r=document.querySelectorAll('#calc input[type="range"]')[${index}];r.value=${value};r.dispatchEvent(new Event('input',{bubbles:true}));return true })()`;
  await check('initial estimate', "document.querySelector('#calc').textContent.includes('£61,200') && document.querySelector('#calc').textContent.includes('£1,020')");
  await evaluate(setRange(0, 800));
  await check('visitors update estimate', "document.querySelector('#calc').textContent.includes('£122,400') && document.querySelector('#calc').textContent.includes('£2,040')");
  await evaluate(setRange(1, 4));
  await check('conversion update estimate', "document.querySelector('#calc').textContent.includes('£163,200') && document.querySelector('#calc').textContent.includes('4%')");
  await evaluate(setRange(2, 100));
  await check('order value update estimate', "document.querySelector('#calc').textContent.includes('£192,000') && document.querySelector('#calc').textContent.includes('£100')");
  await evaluate(setRange(3, 120));
  await check('offline duration update estimate', "document.querySelector('#calc').textContent.includes('£384,000') && document.querySelector('#calc').textContent.includes('2 h')");
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => {
  socket?.close(); chrome.kill();
  const allowed = path.resolve(os.tmpdir()) + path.sep;
  if (path.resolve(profile).startsWith(allowed)) setTimeout(() => { try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }, 500);
});
