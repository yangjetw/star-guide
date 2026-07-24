import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'gift.html', 'navigator.html', 'refund.html'];
const lineUrl = 'https://lin.ee/gMMpzNy';
const sellerFacts = ['星媽會有限公司', '69708677', 'astrokidsguide@gmail.com'];

const readPage = (name) => readFile(new URL(name, root), 'utf8');

test('publishes four semantic pages with consistent seller disclosure', async () => {
  for (const page of pages) {
    assert.ok(existsSync(new URL(page, root)), `${page} must exist`);
    const html = await readPage(page);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
    assert.match(html, /<main\b[^>]*id="main-content"/i);
    assert.match(html, /<footer\b/i);
    for (const fact of sellerFacts) assert.ok(html.includes(fact), `${page} must include ${fact}`);
    assert.ok(html.includes(lineUrl));
  }
});

test('publishes the approved gift prices and approval-safe calls to action', async () => {
  const html = await readPage('gift.html');
  for (const price of ['NT$3,980', 'NT$7,600', 'NT$17,900']) assert.ok(html.includes(price));
  assert.ok(html.includes('10 份以上'));
  assert.ok(html.includes('正式線上販售將於票券服務審核完成後開放'));
  assert.equal((html.match(/洽詢購買/g) ?? []).length >= 3, true);
  assert.doesNotMatch(html, /匯款|立即付款|LINE Bank|街口付款/i);
});

test('uses three local testimonial screenshots and STAR gift language', async () => {
  const html = await readPage('index.html');
  for (const asset of ['testimonial-1.jpg', 'testimonial-2.jpg', 'testimonial-3.jpg']) {
    assert.ok(existsSync(new URL(`assets/images/${asset}`, root)));
    assert.match(html, new RegExp(`assets/images/${asset}`));
  }
  assert.ok(html.includes('家長們的真實心聲'));
  assert.ok(html.includes('經同意分享'));
  assert.match(html, /STAR-[A-Z0-9]{4}-[A-Z0-9]{4}/);
});

test('removes retired automation and code labels from every public page', async () => {
  const corpus = (await Promise.all(pages.map(readPage))).join('\n');
  assert.doesNotMatch(corpus, /n8n|TEST-|PGG-|https:\/\/lin\.ee\/UDM1hMc/i);
});
