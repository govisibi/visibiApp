/* Export approved service widget data from the supplied HTML project's source files. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = process.argv[2];
if (!source) throw new Error('Pass the original VISIBI HTML project directory.');
const sandbox = { window: {} };
for (const file of ['marketing-data.js', 'services-data.js', 'cloud-data.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(source, file), 'utf8'), sandbox, { filename: file });
}
const slug = name => name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const data = {};
for (const [key, page] of Object.entries(sandbox.window.MKT_DATA)) {
  if (!page.file) continue;
  data[slug(page.file)] = {
    key, name: page.name, group: page.heroWidget || page.group || 'marketing',
    services: page.services, plans: page.plans, annual: !!page.annual, unit: page.unit
  };
}
const target = path.resolve(__dirname, '../wp-content/themes/visibi/assets/service-interactions-data.json');
fs.writeFileSync(target, JSON.stringify(data));
console.log(`Exported ${Object.keys(data).length} service interactions`);
