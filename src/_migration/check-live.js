/* Route and preview-indexing smoke check against an installed /v2 site. */
const fs = require('fs');
const path = require('path');
const items = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content.json'), 'utf8'));
const base = (process.argv[2] || 'http://localhost:8082/v2').replace(/\/$/, '');
const queue = items.filter(item => !['Careers', 'Pay Invoice'].includes(item.name));
const errors = [];
let next = 0;
async function worker() {
  while (next < queue.length) {
    const item = queue[next++];
    const url = base + item.path;
    try {
      const res = await fetch(url, { redirect: 'follow' });
      const html = await res.text();
      if (res.status !== 200) errors.push(`${item.name}: HTTP ${res.status}`);
      if (!res.headers.get('x-robots-tag')?.includes('noindex')) errors.push(`${item.name}: missing noindex header`);
      if (!/<h1\b/i.test(html) && item.name !== 'Search') errors.push(`${item.name}: missing H1`);
      if (/\.dc\.html(?:["?#])/i.test(html)) errors.push(`${item.name}: prototype URL found`);
    } catch (error) { errors.push(`${item.name}: ${error.message}`); }
  }
}
Promise.all(Array.from({ length: 8 }, worker)).then(() => {
  console.log(JSON.stringify({ checked: queue.length, errors }, null, 2));
  if (errors.length) process.exitCode = 1;
});
