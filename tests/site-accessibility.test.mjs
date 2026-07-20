import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);

test('preserves semantic landmarks, five native FAQs, and safe external links', async () => {
  const [html, css] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('styles.css', root), 'utf8'),
  ]);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<main\b[^>]*id=["']main-content["']/i);
  assert.match(html, /<nav\b[^>]*aria-label=/i);
  assert.equal((html.match(/<details\b/gi) ?? []).length, 5);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px/i);
  for (const anchor of (html.match(/<a\b[^>]*href=["']https?:\/\/[^>]*>/gi) ?? [])) {
    assert.match(anchor, /target=["']_blank["']/i);
    assert.match(anchor, /rel=["']noopener noreferrer["']/i);
  }
});
