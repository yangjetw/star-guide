import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const stylesheet = () => readFile(new URL('../styles.css', import.meta.url), 'utf8');

test('uses the approved healing starry palette and responsive hero type', async () => {
  const css = await stylesheet();
  for (const color of ['#101329', '#1b1d3e', '#dad0f5', '#efcb7d', '#fbf4e6']) {
    assert.match(css, new RegExp(color, 'i'));
  }
  assert.match(css, /body\s*\{[^}]*font-size:\s*19px/i);
  assert.match(css, /\.hero\s+h1\s*\{[^}]*font-size:\s*clamp\(54px,\s*5\.2vw,\s*72px\)/i);
  const mobileRule = css.match(/@media\s*\(max-width:\s*768px\)\s*\{([\s\S]*)$/i)?.[1] ?? '';
  assert.match(mobileRule, /\.hero\s+h1\s*\{[^}]*font-size:\s*clamp\(38px,\s*11vw,\s*46px\)/i);
});

test('keeps the first plan visually featured and native FAQ markers visible', async () => {
  const css = await stylesheet();
  assert.match(css, /\.plan-featured\s*\{[^}]*border:\s*2px solid var\(--starlight\)/i);
  assert.doesNotMatch(css, /\.plan-card:nth-child\(2\)\s*\{/i);
  assert.match(css, /\.faq-list summary\s*\{[^}]*display:\s*list-item/i);
  assert.match(css, /\.faq-list summary\s*\{[^}]*min-height:\s*48px/i);
});
