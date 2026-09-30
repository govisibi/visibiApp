const fs = require('fs');
const path = require('path');
const pages = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../content.json'), 'utf8'));
const source = path.resolve(__dirname, '../..');
const sourceFiles = fs.readdirSync(source).filter(x => x.endsWith('.dc.html'));
const bad = [];
const paths = new Set();
const titles = new Map();
for (const page of pages) {
  if (!page.html || page.html.length < 1000) bad.push(`${page.name}: short/empty render`);
  if (!page.h1) bad.push(`${page.name}: no H1`);
  if (!page.description) bad.push(`${page.name}: no description`);
  if (page.html.includes('.dc.html')) bad.push(`${page.name}: unresolved prototype URL`);
  if (/\{\{[^}]+\}\}/.test(page.html)) bad.push(`${page.name}: unresolved template token`);
  if (paths.has(page.path)) bad.push(`${page.name}: duplicate path ${page.path}`);
  paths.add(page.path);
  if (titles.has(page.title)) bad.push(`${page.name}: duplicate SEO title with ${titles.get(page.title)}`);
  titles.set(page.title, page.name);
}
console.log(JSON.stringify({ sourcePrototypeFiles: sourceFiles.length, exported: pages.length, pages: pages.filter(x => x.type === 'page').length, posts: pages.filter(x => x.type === 'post').length, issues: bad.length, issueList: bad }, null, 2));
const inputPages = pages.filter(x => /<input\b/i.test(x.html));
console.log(JSON.stringify({ pagesWithInputs: inputPages.length, inputPagesWithoutAudit: inputPages.filter(x => !x.html.includes('id="audit"') && x.name !== 'Contact').map(x => x.name) }, null, 2));
console.log(JSON.stringify({ longTitles: pages.filter(x => x.title.length > 75).map(x => [x.name, x.title.length]).slice(0, 30), longDescriptions: pages.filter(x => x.description.length > 165).length, shortDescriptions: pages.filter(x => x.description.length < 60).map(x => x.name) }, null, 2));
const unresolved = new Map();
for (const page of pages) {
  for (const [, href] of page.html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    if (!href.startsWith('/')) continue;
    const pathname = href.split(/[?#]/)[0];
    if (pathname && !paths.has(pathname)) unresolved.set(pathname, (unresolved.get(pathname) || 0) + 1);
  }
}
console.log(JSON.stringify({ unresolvedInternalPaths: [...unresolved] }, null, 2));
const faqQuestions = pages.reduce((n, p) => n + (p.html.match(/data-visibi-faq=/g) || []).length, 0);
const faqAnswers = pages.reduce((n, p) => n + (p.html.match(/visibi-faq-answer/g) || []).length, 0);
console.log(JSON.stringify({ faqQuestions, faqAnswers, faqComplete: faqQuestions === faqAnswers }, null, 2));
if (faqQuestions !== faqAnswers) process.exitCode = 1;
if (bad.length) process.exitCode = 1;
