/* Finish local packaging after build-content.js. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const base = path.resolve(__dirname, '..');
const source = path.resolve(base, '..');
const media = path.join(base, 'wp-content', 'themes', 'visibi', 'assets', 'source');
fs.mkdirSync(media, { recursive: true });
for (const name of ['assets', 'uploads']) {
  const from = path.join(source, name), to = path.join(media, name);
  if (!fs.existsSync(from)) continue;
  fs.mkdirSync(to, { recursive: true });
  for (const item of fs.readdirSync(from, { withFileTypes: true })) {
    if (item.isFile() && /\.(png|jpe?g|webp|svg|avif|gif)$/i.test(item.name)) fs.copyFileSync(path.join(from, item.name), path.join(to, item.name));
  }
}
const content = JSON.parse(fs.readFileSync(path.join(base, 'content.json'), 'utf8'));
const articleContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(source, 'articles-data.js'), 'utf8'), articleContext);
const articleMeta = new Map((articleContext.window.ARTICLES || []).map(article => [article.file, article]));
const ecommerce = content.find(item => item.name === 'Ecommerce Agency Homepage v2');
if (ecommerce) { ecommerce.slug = 'ecommerce-development'; ecommerce.path = '/ecommerce-development/'; }
const nameToPath = new Map(content.map(item => [item.name, item.path]));
const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
for (const item of content) {
  const prototype = fs.readFileSync(path.join(source, item.source), 'utf8');
  const header = prototype.match(/<dc-import\b[^>]*name="SiteHeader"[^>]*>/i)?.[0] || '';
  const onpage = header.match(/\bonpage="([^"]*)"/i)?.[1] || '';
  item.onpage = onpage.split(';').filter(Boolean).map(part => {
    const [label, href] = part.split('|');
    return { label, href };
  }).filter(link => link.label && /^#[A-Za-z0-9_-]+$/.test(link.href));
  const article = articleMeta.get(item.name);
  if (article) {
    item.displayTitle = article.title;
    item.category = article.cat;
    item.date = article.date;
    item.authorLabel = article.author;
  }
  if (item.title === item.name) item.title += ' | VISIBI';
  if (item.name === 'Home') item.title = 'AI Visibility, Ecommerce & Cloud Agency | VISIBI';
  if (item.name === 'Ecommerce Agency Homepage v2') item.title = 'Ecommerce Development Agency | VISIBI';
  if (item.name === 'GEO') item.title = 'AI Visibility & GEO Services | VISIBI';
  if (item.title.length > 75) {
    let head = item.title.split(' | ')[0].split(' — ')[0];
    if (head.length > 62) head = head.slice(0, 62).replace(/\s+\S*$/, '');
    item.title = head.includes('VISIBI') ? head : head + ' | VISIBI';
  }
  if (!item.description) {
    const paragraphs = [...item.html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(x => plain(x[1])).filter(x => x.length >= 45);
    item.description = (item.h1 + (paragraphs[0] ? ' ' + paragraphs[0] : '')).slice(0, 155).replace(/\s+\S*$/, '').trim() + '.';
  }
  if (item.description.length > 165) item.description = item.description.slice(0, 157).replace(/\s+\S*$/, '').replace(/[.,;:]+$/, '') + '.';
  item.html = item.html.replace(/href="([^"#]+\.dc\.html)(#[^"]*)?"/g, (full, old, hash = '') => {
    const name = decodeURIComponent(old.split('/').pop()).replace(/\.dc\.html$/, '');
    return nameToPath.has(name) ? `href="${nameToPath.get(name)}${hash}"` : full;
  });
  item.html = item.html.replace(/\/ecommerce-agency-homepage-v2\//g, '/ecommerce-development/');
}
fs.writeFileSync(path.join(base, 'content.json'), JSON.stringify(content, null, 2));
require('./extract-home-services');
const esc = value => '"' + value.replace(/"/g, '""') + '"';
const lines = ['source,target'];
const seen = new Set();
const add = (from, to) => { if (from === to || seen.has(from)) return; seen.add(from); lines.push(esc(from) + ',' + esc(to)); };
for (const item of content) {
  const old = '/' + encodeURIComponent(item.source).replace(/%2F/g, '/');
  add(old, item.path);
  add('/' + item.source, item.path);
  add('/' + item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), item.path);
}
fs.writeFileSync(path.join(base, 'redirects.csv'), lines.join('\n') + '\n');
console.log(`Copied media and wrote ${lines.length - 1} redirect rows`);
