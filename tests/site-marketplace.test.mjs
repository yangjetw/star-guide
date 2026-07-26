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
const forbiddenPublicOperations = [
  /\bSTAR-/,
  /\bGIFT-/,
  /品牌主動贈送|品牌贈送|朋友試用|朋友體驗/,
  /同一份兌換流程|共用兌換流程|兌換碼前綴|代碼示例/,
];

test('treats only uppercase internal code prefixes as forbidden', () => {
  assert.doesNotMatch('gift-hero', forbiddenPublicOperations[1]);
  assert.match('GIFT-2026-001', forbiddenPublicOperations[1]);
  assert.doesNotMatch('star-guide', forbiddenPublicOperations[0]);
  assert.match('STAR-2026-001', forbiddenPublicOperations[0]);
});

test('describes the gift as a path toward understanding, reconciliation, and family leadership', async () => {
  const html = await readPage('gift.html');
  assert.ok(html.includes('點星者促成理解與和解；使指南陪伴父母成為自己孩子的領航者。'));
  assert.ok(!html.includes('點星者促成理解開始；真正使用指南陪伴孩子的父母，將成為自己家庭的領航者。'));
});

test('publishes four semantic pages with consistent seller disclosure', async () => {
  for (const page of pages) {
    assert.ok(existsSync(new URL(page, root)), `${page} must exist`);
    const html = await readPage(page);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
    assert.match(html, /<main\b[^>]*id=["']main-content["']/i);
    assert.match(html, /<footer\b/i);
    for (const fact of sellerFacts) assert.ok(html.includes(fact), `${page} must include ${fact}`);
  }
});

test('limits LINE escalation to purchases and genuine service exceptions', async () => {
  const [home, gift, navigator, refund] = await Promise.all(pages.map(readPage));

  for (const html of [home, gift, navigator, refund]) {
    const navigation = html.match(/<nav\b[\s\S]*?<\/nav>/i)?.[0] ?? '';
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? '';
    assert.doesNotMatch(navigation, new RegExp(lineUrl));
    assert.doesNotMatch(footer, new RegExp(lineUrl));
  }

  assert.doesNotMatch(home, new RegExp(lineUrl));
  assert.doesNotMatch(navigator, new RegExp(lineUrl));

  const assurance = gift.match(/<section\b[^>]*class=["'][^"']*\bgift-assurance\b[^"']*["'][\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.doesNotMatch(assurance, new RegExp(lineUrl));
  assert.doesNotMatch(assurance, /\beyebrow\b/i);
  assert.ok(assurance.includes('孩子的出生時間必須可以確認，建議誤差不超過 30 分鐘；若無法確認，請勿購買。'));

  const pricing = gift.match(/<section\b[^>]*id=["']gift-plans["'][\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.match(pricing, new RegExp(lineUrl));
  assert.match(refund, new RegExp(lineUrl));
});

test('publishes the approved gift prices and approval-safe calls to action', async () => {
  const html = await readPage('gift.html');
  for (const price of ['NT$3,980', 'NT$7,600', 'NT$17,900']) assert.ok(html.includes(price));
  for (const quantity of ['1 \u4efd', '2 \u4efd', '5 \u4efd']) assert.ok(html.includes(quantity), quantity + ' must be disclosed');
  assert.ok(html.includes('10 \u4efd\u4ee5\u4e0a\u7684\u9001\u79ae\u9700\u6c42'));
  const inquiryCtas = anchors(html)
    .filter((anchor) => anchor.replace(/<[^>]+>/g, '').includes('\u6d3d\u8a62\u8cfc\u8cb7'));
  assert.equal(inquiryCtas.length >= 3, true);
  for (const anchor of inquiryCtas) assert.match(anchor, /href=["']https:\/\/lin\.ee\/gMMpzNy["']/i);
  assert.doesNotMatch(html, /\u532f\u6b3e|\u7acb\u5373\u4ed8\u6b3e|\u8857\u53e3\u4ed8\u6b3e|\u4ee3\u6536|\u8f49\u5e33\u7e73\u8cbb|LINE Bank|\u865b\u64ec\u5e33\u865f/i);
});

test('presents the public gift-card brand and complete delivery contents', async () => {
  const html = await readPage('gift.html');
  assert.match(html, /<title>送一份真正懂孩子的禮物[^<]*<\/title>/);
  assert.match(html, /<h1\b[^>]*>送一份真正懂孩子的禮物<\/h1>/);
  for (const item of [
    '由購買者轉送的電子禮物資訊',
    '收禮者專屬的申請指引',
    '客製 PDF 指南',
    'Email 與官方 LINE 協助',
  ]) assert.ok(html.includes(item), `${item} must be disclosed`);
});

test('presents the purchaser as a 點星者 and explains the recipient journey', async () => {
  const html = await readPage('gift.html');
  for (const phrase of [
    '點星者',
    '你送出的不只是一份指南，而是為一個家庭點亮理解的起點。',
    '選擇送禮方案',
    '轉送電子禮物資訊',
    '收禮的父母提供製作資料',
    '取得專屬的客製指南',
  ]) assert.ok(html.includes(phrase), `${phrase} must be disclosed`);
});
test('explains purchase, delivery, privacy, paper invoices, and support without internal operations', async () => {
  const html = await readPage('refund.html');
  for (const phrase of [
    '星學會有限公司',
    '目前開立紙本統一發票',
    '客製 PDF 指南製作與交付',
    '孩子的出生資料',
    '購買前',
    '開始製作後',
    'astrokidsguide@gmail.com',
    '官方 LINE',
  ]) assert.ok(html.includes(phrase), `${phrase} must be disclosed`);
  for (const pattern of forbiddenPublicOperations) assert.doesNotMatch(html, pattern);
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
  assert.doesNotMatch(html, new RegExp(lineUrl));
});

test('defines 領航者 and 導航者 without unsupported professional claims', async () => {
  const html = await readPage('navigator.html');
  for (const phrase of [
    '領航者',
    '引領自己家的孩子',
    '導航者',
    '協助多位領航者',
    '陪伴一個孩子，需要理解；陪伴更多家庭，更需要方法、能力與責任。',
    '不代替家長作決定',
    '不為孩子貼標籤',
  ]) assert.ok(html.includes(phrase), `${phrase} must be disclosed`);
  assert.doesNotMatch(html, /保證就業|保證收入|專業執照|取得認證|官方認證/);
});


test('keeps internal fulfilment rules out of every public page', async () => {
  const corpus = (await Promise.all(pages.map(readPage))).join('\n');
  for (const pattern of forbiddenPublicOperations) assert.doesNotMatch(corpus, pattern);
  assert.doesNotMatch(corpus, /<form\b|<iframe\b|<script\b/i);
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
