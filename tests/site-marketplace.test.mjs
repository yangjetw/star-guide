import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'gift.html', 'navigator.html', 'refund.html'];
const lineUrl = 'https://lin.ee/gMMpzNy';
const navigatorFormUrl = 'https://forms.gle/GsUYYrCTFfHkA6RE8';
const sellerFacts = ['星學會有限公司', '69708677', 'astrokidsguide@gmail.com'];

const readPage = (name) => readFile(new URL(name, root), 'utf8');
const anchors = (html) => html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? [];
const redemptionCodeCandidates = (html) => (
  html
    .replace(/<[^>]*>/g, ' ')
    .match(/\b[A-Za-z]+-[A-Za-z0-9]{1,8}-[A-Za-z0-9]{1,8}\b/g) ?? []
);
const approvedRedemptionCode = /^(?:STAR|GIFT)-\d{4}-[A-HJ-NP-Z2-9]{4}$/;

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
  for (const quantity of ['1 份', '2 份', '5 份']) assert.ok(html.includes(quantity), `${quantity} must be disclosed`);
  assert.ok(html.includes('10 份以上'));
  assert.ok(html.includes('正式線上販售將於票券服務審核完成後開放'));
  const inquiryCtas = anchors(html)
    .filter((anchor) => anchor.replace(/<[^>]+>/g, '').includes('洽詢購買'));
  assert.equal(inquiryCtas.length >= 3, true);
  for (const anchor of inquiryCtas) assert.match(anchor, /href=["']https:\/\/lin\.ee\/gMMpzNy["']/i);
  assert.doesNotMatch(html, /匯款|立即付款|LINE Bank|街口付款/i);
});

test('presents the public gift-card brand and complete delivery contents', async () => {
  const html = await readPage('gift.html');
  assert.match(html, /<title>赫爾墨斯的小宇宙禮物卡[^<]*<\/title>/);
  assert.match(html, /<h1\b[^>]*>赫爾墨斯的小宇宙禮物卡<\/h1>/);
  for (const item of ['單次使用的 STAR 兌換碼', '由購買者透過 LINE 轉送的電子禮物卡', '客製 PDF 指南', 'Email 協助']) {
    assert.ok(html.includes(item), `${item} must be disclosed`);
  }
  assert.ok(html.includes('星學會有限公司'), 'the legal seller must remain disclosed');
});

test('explains code security, recipient data use, support, and paper invoice handling', async () => {
  const html = await readPage('refund.html');
  for (const phrase of [
    '兌換碼沒有使用期限',
    '兌換碼不可公開',
    '不可重複使用',
    '客製 PDF 指南製作與交付',
    '姓名、Email、孩子出生資料',
    'astrokidsguide@gmail.com',
    '目前開立紙本統一發票',
    '票券服務審核完成後，將依核准內容調整',
  ]) {
    assert.ok(html.includes(phrase), `${phrase} must be disclosed`);
  }
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

test('routes navigator applications directly to the approved public form', async () => {
  const html = await readPage('navigator.html');
  const formAnchor = anchors(html).find((anchor) => anchor.includes(navigatorFormUrl)) ?? '';
  assert.match(formAnchor, /\btarget=["']_blank["']/i);
  assert.match(formAnchor, /\brel=["'][^"']*\bnoopener\b[^"']*\bnoreferrer\b[^"']*["']/i);
  assert.match(html, new RegExp(`<a\\b[^>]*class=["'][^"']*button-primary[^"']*["'][^>]*href=["']${navigatorFormUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>填寫導航者申請表<\\/a>`, 'i'));
  assert.match(html, /填寫前有疑問？[\s\S]*?官方 LINE/i);
});

test('removes retired automation and code labels from every public page', async () => {
  const corpus = (await Promise.all(pages.map(readPage))).join('\n');
  const gift = await readPage('gift.html');
  assert.doesNotMatch(corpus, /n8n|TEST-|PGG-|https:\/\/lin\.ee\/UDM1hMc|https:\/\/docs[.]google[.]com\/forms|匯款|立即付款|LINE Bank|街口付款|銀行|帳號|收款|QR\s*(?:code)?/i);
  assert.doesNotMatch(corpus, /<form\b|<iframe\b|<script\b/i);
  assert.match(gift, /STAR-2026-[A-HJ-NP-Z2-9]{4}/);
  assert.match(gift, /GIFT-2026-[A-HJ-NP-Z2-9]{4}/);
  assert.doesNotMatch(corpus, /\b(?:TEST|PGG)-/);
  assert.doesNotMatch(corpus, /\bSTAR-(?=[A-Z0-9]{0,3}[A-Z])[A-Z0-9]{4}-[A-Z0-9]{4}\b/);
  for (const code of redemptionCodeCandidates(corpus)) {
    assert.match(code, approvedRedemptionCode);
  }
  for (const text of [
    '顧客購買後自用或轉送',
    '品牌主動贈送',
    '使用同一份兌換流程',
    '取得有效兌換碼後，即可進入專屬申請流程',
  ]) {
    assert.match(corpus, new RegExp(text));
  }
});

test('rejects malformed ASCII redemption-code candidates without flagging format templates', () => {
  for (const mutation of [
    'STAR-2-A7K9',
    'STAR-20266-A7K9',
    'STAR-2026-A7K',
    'STAR-2026-A7K99',
    'STAR-26-A7K9',
    'PROMO-YYYY-A7K9',
    'gift-2026-A7K9',
    'STAR-2026-A7I9',
  ]) {
    assert.deepEqual(redemptionCodeCandidates(mutation), [mutation]);
    assert.doesNotMatch(mutation, approvedRedemptionCode);
  }

  assert.deepEqual(redemptionCodeCandidates('STAR-年份-XXXX／GIFT-年份-XXXX'), []);
});

test('allows only approved destinations for every public external link', async () => {
  const approvedPublicDestinations = new Set([lineUrl, navigatorFormUrl]);
  const htmlPages = await Promise.all(pages.map(readPage));
  const pagesByName = new Map(pages.map((page, index) => [page, htmlPages[index]]));
  assert.ok(pagesByName.get('navigator.html').includes(navigatorFormUrl));
  for (const page of pages.filter((page) => page !== 'navigator.html')) {
    assert.equal(pagesByName.get(page).includes(navigatorFormUrl), false, `${page} must not link to the navigator form`);
  }
  for (const anchor of htmlPages.flatMap(anchors)) {
    const href = anchor.match(/\bhref=["']((?:https?:)?\/\/[^"']+)["']/i)?.[1];
    if (href) assert.ok(approvedPublicDestinations.has(href), `${href} is not an approved public-link destination`);
  }
});
