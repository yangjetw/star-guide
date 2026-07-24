import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'gift.html', 'navigator.html', 'refund.html'];
const lineUrl = 'https://lin.ee/gMMpzNy';
const sellerFacts = ['星學會有限公司', '69708677', 'astrokidsguide@gmail.com'];

const readPage = (name) => readFile(new URL(name, root), 'utf8');
const anchors = (html) => html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? [];

test('publishes four semantic pages with consistent seller disclosure', async () => {
  for (const page of pages) {
    assert.ok(existsSync(new URL(page, root)), `${page} must exist`);
    const html = await readPage(page);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
    assert.match(html, /<main\b[^>]*id=["']main-content["']/i);
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
  const inquiryCtas = anchors(html)
    .filter((anchor) => anchor.replace(/<[^>]+>/g, '').includes('洽詢購買'));
  assert.equal(inquiryCtas.length >= 3, true);
  for (const anchor of inquiryCtas) assert.match(anchor, /href=["']https:\/\/lin\.ee\/gMMpzNy["']/i);
  assert.doesNotMatch(html, /匯款|立即付款|LINE Bank|街口付款/i);
});

test('uses three local testimonial screenshots with approved trust copy', async () => {
  const html = await readPage('index.html');
  for (const asset of ['testimonial-1.jpg', 'testimonial-2.jpg', 'testimonial-3.jpg']) {
    assert.ok(existsSync(new URL(`assets/images/${asset}`, root)));
    assert.match(html, new RegExp(`assets/images/${asset}`));
  }
  assert.ok(html.includes('家長們的真實心聲'));
  assert.ok(html.includes('經同意分享'));
  assert.match(html, /<figure\b[^>]*>\s*<img\b[^>]*loading=["']lazy["'][^>]*width=["']\d+["'][^>]*height=["']\d+["']/i);
});

test('removes retired automation and code labels from every public page', async () => {
  const corpus = (await Promise.all(pages.map(readPage))).join('\n');
  assert.doesNotMatch(corpus, /n8n|TEST-|PGG-|https:\/\/lin\.ee\/UDM1hMc|https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSffc|匯款|立即付款|LINE Bank|街口付款|銀行|帳號|收款|QR\s*(?:code)?/i);
  assert.doesNotMatch(corpus, /<form\b|<iframe\b|<script\b/i);
  for (const code of corpus.match(/\b(?:[A-Z0-9]{4}-){2}[A-Z0-9]{4}\b/g) ?? []) {
    assert.match(code, /^STAR-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  }
});

test('allows only the approved LINE destination for every public external link', async () => {
  const htmlPages = await Promise.all(pages.map(readPage));
  for (const anchor of htmlPages.flatMap(anchors)) {
    const href = anchor.match(/\bhref=["']((?:https?:)?\/\/[^"']+)["']/i)?.[1];
    if (href) assert.equal(href, lineUrl, `${href} is not an approved public-link destination`);
  }
});
