import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const lineUrl = 'https://lin.ee/gMMpzNy';
const paymentReportUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform';

const read = (path) => readFile(new URL(path, root), 'utf8');

async function textFiles(directory = root) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === '.superpowers') continue;
    const entryUrl = new URL(entry.name, directory.href.endsWith('/') ? directory : `${directory}/`);
    if (entry.isDirectory()) {
      files.push(...await textFiles(entryUrl));
    } else if (['', '.css', '.html', '.js', '.json', '.md', '.mjs', '.svg', '.yml', '.yaml'].includes(extname(entry.name))) {
      files.push(entryUrl);
    }
  }
  return files;
}

test('defines the zero-install static site package contract', async () => {
  assert.ok(existsSync(new URL('package.json', root)), 'package.json must exist');
  assert.deepEqual(JSON.parse(await read('package.json')), {
    name: 'parent-star-guide',
    version: '1.0.0',
    private: true,
    scripts: { test: 'node --test' },
  });
});

test('uses GitHub Actions to deploy a clean Pages artifact', async () => {
  const workflow = await read('.github/workflows/pages.yml');
  const readme = await read('README.md');

  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /environment:\s*\n\s*name:\s*github-pages/);
  assert.match(workflow, /index\.html/);
  assert.match(workflow, /styles\.css/);
  assert.match(workflow, /\.nojekyll/);
  assert.match(workflow, /assets\//);
  assert.match(workflow, /actions\/upload-pages-artifact@/);
  assert.match(workflow, /actions\/deploy-pages@/);
  assert.match(workflow, /path:\s*\$\{\{\s*runner\.temp\s*\}\}\/pages-staging/);
  assert.doesNotMatch(workflow, /path:\s*\.\s*$/m);
  assert.match(readme, /GitHub Actions/);
  assert.doesNotMatch(readme, /Deploy from a branch/);
});

test('does not publish the private redemption form identifier', async () => {
  const privatePrefix = ['1FAIp', 'QLSev'].join('');
  for (const file of await textFiles()) {
    const text = await readFile(file, 'utf8');
    assert.ok(!text.includes(privatePrefix), `${file.pathname} exposes a private form identifier`);
  }
});

test('defines the Traditional Chinese HTML page contract', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('styles.css')]);
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html\s+lang=["']zh-Hant["']>/i);
  assert.match(html, /<meta\s+charset=["']UTF-8["']\s*\/?>/i);
  assert.match(html, /<main\b[^>]*id=["']main-content["']/i);
  assert.match(html, /<footer\b/i);
  assert.ok(css.trim(), 'styles.css must contain a stylesheet');
});

test('presents complete guide content and preserves approved conversion links', async () => {
  const html = await read('index.html');

  for (const concern of ['情緒爆發', '潛力未發揮', '教養方式失效', '內心想法成謎']) {
    assert.match(html, new RegExp(concern));
  }
  for (const processStep of [
    '提供孩子與父母必要出生資料',
    '建立星盤與親子關係節奏分析',
    '結合兒童心理與生活情境整理可實踐建議',
    '反覆校閱並完成 PDF 親子成長指南',
  ]) {
    assert.match(html, new RegExp(processStep));
  }
  for (const deliverable of ['3–12 歲孩子', '超過八千字 PDF', '孩子個人分析', '情緒節點解析', '實用情境範例', '親子關係節奏圖像']) {
    assert.match(html, new RegExp(deliverable));
  }
  for (const story of [
    '特質的部分確實是這樣，我的月摩羯也是。',
    '看完後想每年都看一次，提醒自己多一點包容。',
    '寫得太準了，根本就是我家小孩的個性寫照。',
  ]) {
    assert.match(html, new RegExp(story));
  }

  assert.match(html, /<article\b[^>]*class=["'][^"']*plan-card[^"']*plan-featured[^"']*["']/i);
  assert.match(html, /自用方案/);
  assert.match(html, /好友分享包/);
  assert.match(html, /團購祝福組/);
  assert.match(html, /初次體驗推薦/);
  assert.match(html, /最優惠/);
  for (const price of ['NT$3,980', 'NT$18,900', 'NT$3,780', 'NT$39,800', 'NT$3,317']) {
    assert.match(html, new RegExp(price.replace('$', '\\$')));
  }
  assert.match(html, /加入 LINE 選方案/);
  assert.match(html, /依指示付款/);
  assert.match(html, /填付款回報/);
  assert.match(html, /訂單處理完成後兌換連結寄到購買者 Email/);
  assert.ok((html.match(new RegExp(lineUrl, 'g')) ?? []).length >= 4);
  assert.match(html, new RegExp(paymentReportUrl));

  assert.equal((html.match(/<details\b/gi) ?? []).length, 5, 'must have exactly five FAQs');
  assert.match(html, /<details\s+id=["']privacy["']/i);
  assert.match(html, /<details\s+id=["']refund["']/i);
  assert.match(html, /誤差不超過 30 分鐘/);
  assert.match(html, /網站不保存/);
  assert.match(html, /私人申請表單/);
  assert.match(html, /不接受取消或退費/);
  assert.match(html, /href=["']#privacy["']/i);
  assert.match(html, /href=["']#refund["']/i);
  assert.match(html, /懂，是比愛更深刻的慈悲。/);

  assert.doesNotMatch(html, /<(?:form|input|textarea)\b/i);
  assert.doesNotMatch(html, /<script\b/i);
});
