/* Extract the six source service tabs so the migrated interactive panel keeps its approved copy. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const source = fs.readFileSync(path.resolve(__dirname, '../../Home.dc.html'), 'utf8');
const match = source.match(/const SV = (\{[\s\S]*?\});\s*const ST =/);
if (!match) throw new Error('Homepage service data was not found');
const data = vm.runInNewContext('(' + match[1] + ')');
const pages = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../content.json'), 'utf8'));
const pathByName = new Map(pages.map(page => [page.name, page.path]));
for (const cards of Object.values(data)) {
  for (const card of cards) {
    const name = card[3].replace(/\.dc\.html$/, '');
    if (!pathByName.has(name)) throw new Error('Missing service page: ' + name);
    card[3] = pathByName.get(name);
  }
}
fs.writeFileSync(path.resolve(__dirname, '../wp-content/themes/visibi/assets/home-services.json'), JSON.stringify(data));
console.log('Extracted ' + Object.keys(data).length + ' homepage service tabs.');
