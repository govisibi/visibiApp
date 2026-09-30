/* Inventory exported controls so migration gaps are visible before launch. */
const items = require('../content.json');
const clean = value => value.replace(/<[^>]*>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
const controls = [];
for (const item of items) {
  const buttons = [...item.html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)].map(match => clean(match[1])).filter(Boolean);
  const inputs = [...item.html.matchAll(/<input\b[^>]*>/gi)].map(match => (match[0].match(/placeholder="([^"]+)"/) || [])[1] || '').filter(Boolean);
  if (buttons.length || inputs.length) controls.push({ page: item.name, buttons, inputs });
}
console.log(JSON.stringify({ pagesWithControls: controls.length, controls }, null, 2));
