import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const lineUrl = 'https://lin.ee/gMMpzNy';
const paymentReportUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform';
const read = (path) => readFile(new URL(path, root), 'utf8');

async function publishedTextFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryUrl = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) files.push(...await publishedTextFiles(entryUrl));
    else {
      const contents = await readFile(entryUrl);
      if (!contents.includes(0)) files.push([entryUrl, contents.toString('utf8')]);
    }
  }
  return files;
}

test('defines the zero-install static site package contract', async () => {
  assert.ok(existsSync(new URL('package.json', root)));
  assert.deepEqual(JSON.parse(await read('package.json')), { name: 'parent-star-guide', version: '1.0.0', private: true, scripts: { test: 'node --test' } });
});

test('includes the GitHub Pages publishing package', async () => {
  assert.ok(existsSync(new URL('.nojekyll', root)));
  assert.equal(await read('.nojekyll'), '');
  const readme = await read('README.md');
  for (const text of ['node --test', 'http.server 4173', 'GitHub Pages', 'GitHub Actions']) assert.ok(readme.includes(text));
});

test('uses GitHub Actions to deploy a clean Pages artifact', async () => {
  const workflow = await read('.github/workflows/pages.yml');
  for (const text of ['contents: read', 'pages: write', 'id-token: write', 'index.html', 'styles.css', '.nojekyll', 'assets/', 'actions/upload-pages-artifact@', 'actions/deploy-pages@']) assert.ok(workflow.includes(text));
  assert.match(workflow, /path:\s*\$\{\{\s*runner\.temp\s*\}\}\/pages-staging/);
  assert.doesNotMatch(workflow, /path:\s*\.\s*$/m);
});

test('does not publish the private redemption form identifier in deployed artifacts', async () => {
  const privatePrefix = ['1FAIp', 'QLSev'].join('');
  const files = [
    [new URL('index.html', root), await read('index.html')],
    [new URL('styles.css', root), await read('styles.css')],
    [new URL('.nojekyll', root), await read('.nojekyll')],
    ...await publishedTextFiles(new URL('assets/', root)),
  ];
  for (const [file, contents] of files) assert.ok(!contents.includes(privatePrefix), `${file.pathname} exposes a private form identifier`);
});

test('defines the Traditional Chinese HTML page contract', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('styles.css')]);
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html\s+lang=["']zh-Hant["']>/i);
  assert.match(html, /<meta\s+charset=["']UTF-8["']\s*\/?>/i);
  assert.match(html, /<meta\s+name=["']viewport["']\s+content=["']width=device-width, initial-scale=1["']\s*\/?>/i);
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']\s*\/?>/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.ok(css.trim());
});

const orderedMarkers = ['?扛摮??瑟???', '雿?虫????唳?嚗?', '瘥酋摮?舐?寧?', '?獐??嚗?', '??皜祇?嚗?憛怠??瘀??閬?', '?寞??寞嚗?', '雿?敺隞暻潘?', '?????箔?暻澆潮嚗?', '??撣嗡???霈?', '摰園???祕敹', '銝隞賢惇?潔??酋摮????啣?'];

test('reproduces the original Gamma story in order', async () => {
  const html = await read('index.html');
  let cursor = -1;
  for (const marker of orderedMarkers) {
    const next = html.indexOf(marker, cursor + 1);
    assert.ok(next > cursor, `${marker} should appear in source order`);
    cursor = next;
  }
  for (const phrase of ['銝雿???嚗?臭?瘝?唬???撅祈牧???', '蝎曉?????隞??DF?餃???', '???舀??瘛勗???脯?']) assert.ok(html.includes(phrase), `${phrase} must be retained`);
});

test('presents only the approved original offer and semantic outline', async () => {
  const html = await read('index.html');
  assert.equal((html.match(/NT\$3980/g) ?? []).length >= 2, true);
  assert.equal(html.includes('?芰?寞?'), false);
  assert.equal(html.includes('憟賢??澈?'), false);
  assert.doesNotMatch(html, /<section[^>]+id="faq"/);
  assert.doesNotMatch(html, /<nav\b|mobile-purchase|plan-card|<details\b/i);
  const ids = ['hero', 'concerns', 'unique-child', 'method', 'required-data', 'pricing', 'deliverables', 'value-comparison', 'transformation', 'testimonials', 'closing'];
  assert.deepEqual([...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]), ids);
  assert.ok((html.match(new RegExp(lineUrl, 'g')) ?? []).length >= 2);
  assert.ok((html.match(new RegExp(paymentReportUrl, 'g')) ?? []).length >= 2);
});

test('retains every original Gamma section structure and long-form copy', async () => {
  const html = await read('index.html');
  const section = (id) => html.match(new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?<\\/section>`, 'i'))?.[0] ?? '';
  const uniqueChild = section('unique-child');
  const requiredData = section('required-data');
  const deliverables = section('deliverables');
  const comparison = section('value-comparison');
  const transformation = section('transformation');
  const testimonials = section('testimonials');
  const method = section('method');
  const closing = section('closing');
  assert.equal((uniqueChild.match(/<article\b/gi) ?? []).length, 3);
  assert.equal((requiredData.match(/<article\b/gi) ?? []).length, 4);
  assert.equal((deliverables.match(/<article\b/gi) ?? []).length, 4);
  const comparisonHeader = comparison.match(/<thead[\s\S]*?<\/thead>/i)?.[0] ?? '';
  assert.equal((comparisonHeader.match(/<th\b/gi) ?? []).length, 4);
  const comparisonBody = comparison.match(/<tbody[\s\S]*?<\/tbody>/i)?.[0] ?? '';
  assert.equal((comparisonBody.match(/<tr\b/gi) ?? []).length, 5);
  assert.equal((transformation.match(/<article\b/gi) ?? []).length, 3);
  assert.equal((testimonials.match(/<blockquote\b/gi) ?? []).length, 3);
  for (const phrase of [
    '??蝞∠?????蝒???',
    '摮拙?憪?', '?嗆?鞈?', '蝎曉?????隞??DF?餃???',
    '??蝭憟???', '?郊頧??箏霈???函??批捆',
    '瘥遢?扛摮??瑟???勗?璆剖????交撠????Ｙㄗ',
    '??皞芋撘?', '敺??詨直??隤迎???蝯?圾隞??',
    '4甇脣????', '摮拙?敺?銝???????芣?典',
    '?扛摮??瑟????餌策憿??芸酋摮?韏瑟??瑞?憭找犖??',
  ]) assert.ok(html.includes(phrase), `missing approved copy: ${phrase}`);
  assert.equal((method.match(/<li\b/gi) ?? []).length, 4);
  assert.equal((closing.match(new RegExp(lineUrl, 'g')) ?? []).length, 1);
  assert.equal((closing.match(new RegExp(paymentReportUrl, 'g')) ?? []).length, 1);
});
