import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);

test('defines the zero-install static site package contract', async () => {
  assert.ok(existsSync(new URL('package.json', root)), 'package.json must exist');
  const packageJson = JSON.parse(
    await readFile(new URL('package.json', root), 'utf8'),
  );

  assert.deepEqual(packageJson, {
    name: 'parent-star-guide',
    version: '1.0.0',
    private: true,
    scripts: { test: 'node --test' },
  });
});

test('defines the Traditional Chinese HTML page contract', async () => {
  assert.ok(existsSync(new URL('index.html', root)), 'index.html must exist');
  assert.ok(existsSync(new URL('styles.css', root)), 'styles.css must exist');
  const html = await readFile(new URL('index.html', root), 'utf8');
  const css = await readFile(new URL('styles.css', root), 'utf8');

  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html\s+lang=["']zh-Hant["']>/i);
  assert.match(html, /<meta\s+charset=["']UTF-8["']\s*\/?>/i);
  assert.match(
    html,
    /<meta\s+name=["']viewport["']\s+content=["']width=device-width, initial-scale=1["']\s*\/?>/i,
  );
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']\s*\/?>/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
  assert.match(html, /<h1>[^<]+<\/h1>/i);
  assert.ok(css.trim(), 'styles.css must contain a minimal stylesheet');
});

test('presents the guide content and a privacy-safe conversion flow', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const lineUrl = 'https://lin.ee/gMMpzNy';
  const paymentReportUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform';
  const redemptionFormId = '1FAIpQLSevM95Op1gL8g8iZqnEKVR5u9s_NSyIo7mgHKp5KTxtpRFABA';

  assert.match(html, /赫爾墨斯的小宇宙/);
  assert.match(html, /親子成長指南/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, 'must have one H1');
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

  assert.equal(
    (html.match(/<article\b[^>]*class=["'][^"']*plan-card[^"']*["']/gi) ?? []).length,
    3,
    'must present exactly three plan cards',
  );
  for (const price of ['NT$3,980', 'NT$18,900', 'NT$3,780', 'NT$39,800', 'NT$3,317']) {
    assert.match(html, new RegExp(price.replace('$', '\\$')));
  }

  const lineCtas = html.match(/<a\b[^>]*class=["'][^"']*line-cta[^"']*["'][^>]*>/gi) ?? [];
  assert.ok(lineCtas.length >= 4, 'must offer at least four LINE CTAs');
  assert.ok((html.match(new RegExp(lineUrl, 'g')) ?? []).length >= 4, 'LINE URL must appear at least four times');
  assert.match(
    html,
    new RegExp(`<a[^>]+class=["'][^"']*payment-report-link[^"']*["'][^>]+href=["']${paymentReportUrl}["']`, 'i'),
  );

  assert.equal((html.match(/<details\b/gi) ?? []).length, 4, 'must have exactly four FAQs');
  assert.match(html, /加入 LINE 諮詢[／/]選方案/);
  assert.match(html, /依 LINE 指示付款/);
  assert.match(html, /填寫付款回報/);
  assert.match(html, /收到兌換碼[／/]連結並申請指南/);
  assert.match(html, /製作時間/);
  assert.match(html, /需要資料/);
  assert.match(html, /付款後流程/);
  assert.match(html, /退費|個資/);

  assert.doesNotMatch(html, /<(?:form|input|textarea)\b/i);
  assert.doesNotMatch(html, new RegExp(redemptionFormId));
  assert.doesNotMatch(html, /(?:銀行帳號|JKOPay\s*(?:帳密|帳號|密碼))/i);
  assert.doesNotMatch(html, /\b\d{10,16}\b/);
  assert.doesNotMatch(html, /<script\b/i);

  const externalAnchors = (html.match(/<a\b[^>]*>/gi) ?? []).filter((anchor) =>
    /href=["']https?:\/\//i.test(anchor),
  );
  for (const anchor of externalAnchors) {
    assert.match(anchor, /target=["']_blank["']/i, 'external links must open in a new tab');
    assert.match(anchor, /rel=["']noopener noreferrer["']/i, 'external links must be safe');
  }
});
