/* Render the supplied design-component prototypes into server-ready page HTML.
 * Run with Node 22 and Chrome on the migration workstation. No production request.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawn } = require('child_process');

const source = path.resolve(__dirname, '../..');
const output = path.resolve(__dirname, '../content.json');
const react = path.resolve('D:/wamp64/www/wp/wordpress/wp-includes/js/dist/vendor');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const skip = new Set(['ArticlePage', 'MarketingService', 'TechPage', 'PlatformPage', 'SiteHeader', 'SiteFooter', 'MobileCTA', 'RelatedArticles', 'HeroDemo', 'Mobile Pages']);
const files = fs.readdirSync(source).filter(f => f.endsWith('.dc.html') && !skip.has(f.slice(0, -8))).sort();
const seoContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(source, 'seo-data.js'), 'utf8').split('window.applySEO')[0], seoContext);
const seo = seoContext.window.SEO_PAGES;
const slug = name => name.toLowerCase().replace(/^article - /, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const urlFor = name => name === 'Home' ? '/' : name.startsWith('Article - ') ? '/insights/' + slug(name) + '/' : '/' + slug(name) + '/';
const exportScript = `
setTimeout(async () => {
  const host = document.querySelector('#dc-root > .sc-host');
  if (!host) return;
  const faqButtons = [...host.querySelectorAll('section#faq button')];
  const faqAnswers = [];
  for (const button of faqButtons) {
    let answer = [...button.parentElement.children].find(n => n !== button && n.tagName === 'DIV');
    if (!answer) {
      button.click();
      await new Promise(resolve => setTimeout(resolve, 60));
      answer = [...button.parentElement.children].find(n => n !== button && n.tagName === 'DIV');
    }
    faqAnswers.push(answer ? answer.cloneNode(true) : null);
  }
  const clone = host.cloneNode(true);
  [...clone.querySelectorAll('section#faq button')].forEach((button, index) => {
    const wrapper = button.parentElement;
    [...wrapper.children].filter(n => n !== button && n.tagName === 'DIV').forEach(n => n.remove());
    button.setAttribute('data-visibi-faq', String(index));
    button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    button.setAttribute('type', 'button');
    if (faqAnswers[index]) {
      const panel = faqAnswers[index].cloneNode(true);
      panel.classList.add('visibi-faq-answer');
      panel.hidden = index !== 0;
      wrapper.appendChild(panel);
    }
  });
  clone.querySelectorAll('.sc-host[data-sc-name="SiteHeader"],.sc-host[data-sc-name="SiteFooter"],.sc-host[data-sc-name="MobileCTA"],script,style').forEach(n => n.remove());
  clone.querySelectorAll('[data-dc-tpl],[data-sc-name]').forEach(n => { n.removeAttribute('data-dc-tpl'); n.removeAttribute('data-sc-name'); });
  const payload = { html: clone.innerHTML, title: document.title, description: document.querySelector('meta[name="description"]')?.content || '', headings: [...clone.querySelectorAll('h1')].map(n => n.textContent.trim()) };
  const tag = document.createElement('script'); tag.id = 'visibi-export'; tag.type = 'application/octet-stream';
  tag.textContent = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  document.body.appendChild(tag);
}, 3000);`;
const server = http.createServer((req, res) => {
  const name = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '');
  const file = name === '__react.js' ? path.join(react, 'react.min.js') : name === '__react-dom.js' ? path.join(react, 'react-dom.min.js') : path.resolve(source, name || 'Home.dc.html');
  if (!file.startsWith(source + path.sep) && !file.startsWith(react + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  let data = fs.readFileSync(file);
  if (name.endsWith('.html')) {
    const resources = '<script>window.__resources={"https://unpkg.com/react@18.3.1/umd/react.production.min.js":"/__react.js","https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js":"/__react-dom.js"};' + exportScript + '</script>';
    data = Buffer.from(data.toString('utf8').replace('<script src="./support.js"></script>', resources + '<script src="./support.js"></script>'));
  }
  res.setHeader('Content-Type', name.endsWith('.js') ? 'text/javascript; charset=utf-8' : name.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream');
  res.end(data);
});
function render(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--virtual-time-budget=5500', '--dump-dom', 'http://127.0.0.1:8765/' + encodeURIComponent(file)], { windowsHide: true });
    let html = '';
    child.stdout.on('data', d => html += d);
    child.on('error', reject);
    child.on('close', code => {
      const match = html.match(/<script id="visibi-export" type="application\/octet-stream">([^<]+)<\/script>/);
      if (code !== 0 || !match) return reject(new Error('Render failed: ' + file + ' (exit ' + code + ')'));
      resolve(JSON.parse(Buffer.from(match[1], 'base64').toString('utf8')));
    });
  });
}
function clean(content) {
  return content.replace(/(?:\.\/)?([^"'<>]+?)\.dc\.html(#[\w-]+)?/g, (full, name, hash = '') => {
    const known = name.split('/').pop();
    return files.includes(known + '.dc.html') ? urlFor(known) + hash : full;
  }).replace(/\s+data-dc-tpl="[^"]*"/g, '').replace(/\s+class="sc-interp"/g, '');
}
async function main() {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i], name = file.slice(0, -8);
    try {
      const rendered = await render(file);
      const meta = seo[name] || [];
      const html = clean(rendered.html);
      results.push({ source: file, name, type: name.startsWith('Article - ') ? 'post' : 'page', slug: slug(name), path: urlFor(name), title: meta[0] || rendered.title || name, description: meta[1] || rendered.description || '', robots: meta[2] || '', h1: rendered.headings[0] || '', html });
      console.log(`${i + 1}/${files.length} ${file} (${html.length} bytes)`);
    } catch (e) { console.error(String(e)); process.exitCode = 1; }
  }
  fs.writeFileSync(output, JSON.stringify(results, null, 2));
  console.log(`Wrote ${results.length} pages to ${output}`);
}
server.listen(8765, '127.0.0.1', () => main().finally(() => server.close()));
