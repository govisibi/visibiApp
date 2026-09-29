/* Compare public WordPress pages with the supplied rendered HTML export. */
const fs = require('fs');
const path = require('path');
const items = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content.json'), 'utf8'))
  .filter(item => !['Careers', 'Pay Invoice'].includes(item.name));
const base = process.argv[2] || 'http://localhost:8082/v2';
const errors = [], warnings = [], internalLinks = new Map(), assets = new Set();
const decode = s => s.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
  .replace(/&(amp|quot|apos|lt|gt|nbsp);/gi, (_, n) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' })[n.toLowerCase()] || ' ');
const plain = s => decode(s.replace(/<[^>]*>/g, ' ')).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const headings = html => [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m => m[1] + ':' + plain(m[2]));
const sectionIds = html => [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/gi)].map(m => m[1]);
let next = 0;
async function worker() {
  while (next < items.length) {
    const item = items[next++];
    const url = new URL(item.path.replace(/^\//, ''), base.replace(/\/$/, '') + '/');
    let html;
    try {
      const response = await fetch(url);
      if (response.status !== 200) { errors.push(item.name + ': HTTP ' + response.status); continue; }
      html = await response.text();
      if (!response.headers.get('x-robots-tag')?.includes('noindex')) errors.push(item.name + ': noindex header missing');
    } catch (e) { errors.push(item.name + ': ' + e.message); continue; }
    const main = html.match(/<main\b[^>]*id="main-content"[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '';
    if (!main) { errors.push(item.name + ': main landmark missing'); continue; }
    const expected = headings(item.html), actual = headings(main);
    const eH1 = expected.filter(h => h.startsWith('1:')).length, aH1 = actual.filter(h => h.startsWith('1:')).length;
    if (eH1 !== 1 || aH1 !== 1) warnings.push(item.name + ': H1 count source=' + eH1 + ' live=' + aH1);
    if (expected.join('|') !== actual.join('|')) {
      const first = expected.findIndex((heading, index) => heading !== actual[index]);
      errors.push(item.name + ': heading differs at ' + first + ' (' + expected[first] + ' => ' + actual[first] + ')');
    }
    if (sectionIds(item.html).join('|') !== sectionIds(main).join('|')) errors.push(item.name + ': section IDs differ');
    if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(item.name + ': title missing');
    if (!/<meta name="description"/i.test(html)) warnings.push(item.name + ': meta description missing');
    if (!responseNoindex(html) && !/<link rel="canonical"/i.test(html)) warnings.push(item.name + ': canonical missing');
    for (const match of html.matchAll(/\b(?:href|action)="([^"]+)"/gi)) {
      const href = decode(match[1]); if (href.startsWith(base)) {
        const link = href.split('#')[0]; if (!internalLinks.has(link)) internalLinks.set(link, new Set());
        internalLinks.get(link).add(item.name);
      }
    }
    for (const match of html.matchAll(/\bsrc="([^"]+)"/gi)) {
      const src = decode(match[1]); if (src.startsWith(base)) assets.add(src.split('?')[0]);
    }
  }
}
Promise.all(Array.from({ length: 8 }, worker)).then(async () => {
  const broken = [];
  for (const url of [...internalLinks.keys(), ...assets]) {
    try { const r = await fetch(url, { method: 'HEAD', redirect: 'follow' }); if (r.status >= 400) broken.push(r.status + ' ' + url + ' from ' + [...(internalLinks.get(url) || [])].slice(0, 8).join(', ')); }
    catch (e) { broken.push(e.message + ' ' + url); }
  }
  console.log(JSON.stringify({ pages: items.length, linksChecked: internalLinks.size, assetsChecked: assets.size, errors, warnings, broken }, null, 2));
  if (errors.length || broken.length) process.exitCode = 1;
});
function responseNoindex(html) { return /<meta\b[^>]*name=['"]robots['"][^>]*content=['"][^'"]*noindex/i.test(html); }
