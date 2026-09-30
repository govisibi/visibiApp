/* Summarise real and simulated form fields across all exported /v2 pages. */
const items = require('../content.json');
const base = (process.argv[2] || 'http://localhost:8082/v2').replace(/\/$/, '');
const candidates = items.filter(item => /<(?:input|textarea|select)\b/i.test(item.html));
const output = [];
let next = 0;
async function worker() {
  while (next < candidates.length) {
    const item = candidates[next++];
    try {
      const response = await fetch(base + item.path);
      const html = await response.text();
      const main = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || '';
      const forms = [...main.matchAll(/<form\b[^>]*>/gi)].map(match => match[0]);
      const inputs = [...main.matchAll(/<input\b[^>]*>/gi)].map(match => match[0]);
      const missing = inputs.filter(tag => !/name="(?:visibi_|s")/i.test(tag) && !/type="(?:hidden|range)"/i.test(tag));
      const buttons = [...main.matchAll(/<button\b[^>]*data-visibi-static-action[^>]*>([\s\S]*?)<\/button>/gi)].map(match => match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
      output.push({ path: item.path, status: response.status, forms: forms.length, inputs: inputs.length, unboundInputs: missing.length, staticActions: buttons.slice(0, 5) });
    } catch (error) { output.push({ path: item.path, error: error.message }); }
  }
}
Promise.all(Array.from({ length: 8 }, worker)).then(() => {
  output.sort((a, b) => a.path.localeCompare(b.path));
  console.log(JSON.stringify({ checked: output.length, noForms: output.filter(row => !row.forms), issues: output.filter(row => row.status !== 200 || row.unboundInputs || row.staticActions?.length) }, null, 2));
});
