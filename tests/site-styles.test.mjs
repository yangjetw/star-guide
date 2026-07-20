import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);

const stylesheet = () => readFile(new URL('styles.css', root), 'utf8');

test('uses the approved healing starry palette and type scale', async () => {
  const css = await stylesheet();

  for (const color of ['#101329', '#1b1d3e', '#dad0f5', '#efcb7d', '#fbf4e6']) {
    assert.match(css, new RegExp(color, 'i'), `must include ${color}`);
  }
  assert.match(css, /@import\s+url\([^)]*LXGW\+WenKai\+TC[^)]*Noto\+Sans\+TC/i);
  assert.match(css, /body\s*\{[^}]*font-size:\s*19px/i);
  assert.match(css, /\.hero\s+h1\s*\{[^}]*font-size:\s*clamp\(38px,\s*11vw,\s*46px\)/i);
  assert.match(css, /line-height:\s*1\.(?:7|75|8|85)/i);
});

test('keeps actions comfortably tappable and the mobile CTA available', async () => {
  const css = await stylesheet();

  assert.match(css, /\.button\s*,\s*\.mobile-purchase\s*\{[^}]*min-height:\s*48px/i);
  assert.match(css, /summary\s*\{[^}]*min-height:\s*48px/i);
  assert.match(css, /\.mobile-purchase\s*\{[^}]*position:\s*fixed/i);
  assert.match(css, /\.mobile-purchase\s*\{[^}]*min-height:\s*54px/i);
  assert.match(css, /body\s*\{[^}]*padding-bottom:\s*(?:68|70)px/i);
});

test('stacks the content into a readable single column on small screens', async () => {
  const css = await stylesheet();
  const mobileRule = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*)$/i)?.[1] ?? '';

  assert.match(mobileRule, /body\s*\{[^}]*font-size:\s*18px/i);
  assert.match(mobileRule, /\.hero\s*\{[^}]*grid-template-columns:\s*1fr/i);
  assert.match(mobileRule, /\.card-grid[\s\S]{0,200}\.plan-grid[\s\S]{0,200}grid-template-columns:\s*1fr/i);
  assert.match(mobileRule, /\.steps[\s\S]{0,200}grid-template-columns:\s*1fr/i);
  assert.match(mobileRule, /\.mobile-purchase\s*\{[^}]*display:\s*(?:flex|inline-flex)/i);
});

test('adjusts navigation and dense layouts below tablet width', async () => {
  const css = await stylesheet();
  const tabletRule = css.match(/@media\s*\(max-width:\s*1024px\)\s*\{([\s\S]*?)@media\s*\(max-width:\s*768px\)/i)?.[1] ?? '';

  assert.match(tabletRule, /\.site-header\s+nav\s*\{[^}]*display:\s*none/i);
  assert.match(tabletRule, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/i);
});
