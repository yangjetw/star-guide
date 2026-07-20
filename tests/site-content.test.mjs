import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const lineUrl = 'https://lin.ee/gMMpzNy';
const paymentReportUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform';
const read = (path) => readFile(new URL(path, root), 'utf8');

async function everyTextFile(directory = root) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === '.superpowers') continue;
    if (entry.isDirectory()) {
      files.push(...await everyTextFile(new URL(`${entry.name}/`, directory)));
    } else {
      const entryUrl = new URL(entry.name, directory);
      const contents = await readFile(entryUrl);
      if (!contents.includes(0)) files.push([entryUrl, contents.toString('utf8')]);
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

test('includes the GitHub Pages publishing package', async () => {
  assert.ok(existsSync(new URL('.nojekyll', root)), '.nojekyll must exist');
  assert.equal(await read('.nojekyll'), '', '.nojekyll must be empty');
  const readme = await read('README.md');
  for (const requiredText of ['node --test', 'http.server 4173', 'GitHub Pages', 'GitHub Actions']) {
    assert.match(readme, new RegExp(requiredText.replace(/[().]/g, '\\$&')));
  }
  assert.doesNotMatch(readme, /Deploy from a branch/);
});

test('uses GitHub Actions to deploy a clean Pages artifact', async () => {
  const workflow = await read('.github/workflows/pages.yml');
  for (const permission of ['contents: read', 'pages: write', 'id-token: write']) {
    assert.match(workflow, new RegExp(permission));
  }
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /environment:\s*\n\s*name:\s*github-pages/);
  for (const allowedPath of ['index.html', 'styles.css', '.nojekyll', 'assets/']) {
    assert.match(workflow, new RegExp(allowedPath.replace('.', '\\.')));
  }
  assert.match(workflow, /actions\/upload-pages-artifact@/);
  assert.match(workflow, /actions\/deploy-pages@/);
  assert.match(workflow, /path:\s*\$\{\{\s*runner\.temp\s*\}\}\/pages-staging/);
  assert.doesNotMatch(workflow, /path:\s*\.\s*$/m);
});

test('does not publish the private redemption form identifier in any text file', async () => {
  const privatePrefix = ['1FAIp', 'QLSev'].join('');
  for (const [file, contents] of await everyTextFile()) {
    assert.ok(!contents.includes(privatePrefix), `${file.pathname} exposes a private form identifier`);
  }
});

test('defines the Traditional Chinese HTML page contract', async () => {
  assert.ok(existsSync(new URL('index.html', root)));
  assert.ok(existsSync(new URL('styles.css', root)));
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

test('presents the guide, conversion flow, plans, and privacy boundaries', async () => {
  const html = await read('index.html');
  assert.match(html, /赫爾墨斯的小宇宙/);
  assert.match(html, /親子成長指南/);
  assert.match(html, /<a[^>]+class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#main-content["']/i);
  assert.match(html, /<header\b/i);
  assert.match(html, /<nav\b/i);
  assert.match(html, /<main\b[^>]*id=["']main-content["']/i);
  assert.match(html, /<footer\b/i);
  assert.match(html, /assets\/brand-mark\.svg/);

  const requiredSections = ['guide', 'process', 'deliverables', 'plans', 'stories', 'faq'];
  let previousPosition = -1;
  for (const id of requiredSections) {
    const position = html.indexOf(`id="${id}"`);
    assert.ok(position > previousPosition, `#${id} must appear in the required order`);
    previousPosition = position;
  }
  assert.equal((html.match(/<article\b[^>]*class=["'][^"']*plan-card[^"']*["']/gi) ?? []).length, 3);
  for (const price of ['NT$3,980', 'NT$18,900', 'NT$3,780', 'NT$39,800', 'NT$3,317']) {
    assert.match(html, new RegExp(price.replace('$', '\\$')));
  }
  assert.ok((html.match(new RegExp(lineUrl, 'g')) ?? []).length >= 4);
  assert.match(html, new RegExp(paymentReportUrl));
  assert.match(html, /加入 LINE 選方案/);
  assert.match(html, /依指示付款/);
  assert.match(html, /填付款回報/);
  assert.match(html, /訂單處理完成後兌換連結寄到購買者 Email/);
  assert.doesNotMatch(html, /透過 LINE 提供後續申請所需的兌換碼或連結/);
  assert.doesNotMatch(html, /<(?:form|input|textarea)\b/i);
  assert.doesNotMatch(html, /(?:銀行帳號|JKOPay\s*(?:帳密|帳號|密碼))/i);
  assert.doesNotMatch(html, /\b\d{10,16}\b/);
  assert.doesNotMatch(html, /<script\b/i);
});

test('includes all final Task 5 content commitments', async () => {
  const html = await read('index.html');
  for (const concern of ['情緒爆發', '潛力未發揮', '教養方式失效', '內心想法成謎']) {
    assert.match(html, new RegExp(concern));
  }
  assert.match(html, /class=["'][^"']*concern-grid[^"']*["']/i);
  for (const processStep of [
    '提供孩子與父母必要出生資料',
    '建立星盤與親子關係節奏分析',
    '結合兒童心理與生活情境整理可實踐建議',
    '反覆校閱並完成 PDF 親子成長指南',
  ]) {
    assert.match(html, new RegExp(processStep));
  }
  for (const deliverable of ['3–12 歲孩子', '超過八千字 PDF', '孩子個人分析', '情緒節點解析', '實用情境範例', '親子關係節奏圖像', '可長期反覆閱讀', '隨孩子成長重新對照']) {
    assert.match(html, new RegExp(deliverable));
  }
  assert.equal((html.match(/<ul\s+class=["']deliverable-list["'][^>]*>[\s\S]*?<\/ul>/i)?.[0].match(/<li\b/gi) ?? []).length, 5);
  for (const story of ['特質的部分確實是這樣，我的月摩羯也是。', '看完後想每年都看一次，提醒自己多一點包容。', '寫得太準了，根本就是我家小孩的個性寫照。']) {
    assert.match(html, new RegExp(story));
  }
  for (const plan of ['自用方案', '好友分享包', '團購祝福組', '初次體驗推薦', '最優惠']) {
    assert.match(html, new RegExp(plan));
  }
  assert.equal((html.match(/<details\b/gi) ?? []).length, 5);
  assert.match(html, /<details\s+id=["']privacy["']/i);
  assert.match(html, /<details\s+id=["']refund["']/i);
  assert.match(html, /誤差不超過 30 分鐘/);
  assert.match(html, /網站不保存/);
  assert.match(html, /私人申請表單/);
  assert.match(html, /不接受取消或退費/);
  assert.match(html, /href=["']#privacy["']/i);
  assert.match(html, /href=["']#refund["']/i);
  assert.match(html, /懂，是比愛更深刻的慈悲。/);
  const finalCta = html.match(/<section\s+class=["'][^"']*final-cta[^"']*["'][\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.match(finalCta, new RegExp(`<a[^>]+class=["'][^"']*payment-report-link[^"']*["'][^>]+href=["']${paymentReportUrl}["']`, 'i'));
  assert.match(finalCta, /target=["']_blank["']/i);
  assert.match(finalCta, /rel=["']noopener noreferrer["']/i);
});
