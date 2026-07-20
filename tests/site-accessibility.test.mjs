import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);

async function siteFiles() {
  const [html, css] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('styles.css', root), 'utf8'),
  ]);
  return { html, css };
}

test('preserves the semantic landmarks and keyboard-friendly FAQ', async () => {
  const { html, css } = await siteFiles();

  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, 'must keep one H1');
  assert.match(html, /<main\b[^>]*id=["']main-content["']/i);
  assert.match(html, /<nav\b[^>]*aria-label=/i);
  assert.equal((html.match(/<details\b/gi) ?? []).length, 4, 'must keep four native details elements');
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px/i);
  assert.match(css, /\.skip-link:focus(?:-visible)?\s*\{[^}]*top:\s*0/i);
});

test('respects reduced motion and protects external navigation', async () => {
  const { html, css } = await siteFiles();
  const externalAnchors = (html.match(/<a\b[^>]*>/gi) ?? []).filter((anchor) =>
    /href=["']https?:\/\//i.test(anchor),
  );

  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /scroll-behavior:\s*auto/i);
  assert.match(css, /(?:animation|transition)-duration:\s*0\.01ms/i);
  for (const anchor of externalAnchors) {
    assert.match(anchor, /target=["']_blank["']/i);
    assert.match(anchor, /rel=["']noopener noreferrer["']/i);
  }
});

test('keeps small text and keyboard focus legible on light and dark surfaces', async () => {
  const { css } = await siteFiles();

  assert.match(css, /\.steps span\s*\{[^}]*color:\s*var\(--ink\)/i);
  assert.match(css, /\.deliverable-list li\s*\{[^}]*color:\s*var\(--ink\)/i);
  assert.match(css, /\.eyebrow\s*\{[^}]*color:\s*var\(--night-soft\)/i);
  assert.match(css, /\.hero \.eyebrow,\s*\.section:nth-of-type\(3n \+ 2\) \.eyebrow\s*\{[^}]*color:\s*var\(--starlight\)/i);
  assert.match(
    css,
    /:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--night-soft\)[^}]*box-shadow:\s*0 0 0 6px var\(--cream\),\s*0 0 0 9px var\(--starlight\)/i,
  );
});

test('adds trustworthy metadata and original accessible brand assets', async () => {
  const { html } = await siteFiles();

  assert.match(html, /<meta\s+name=["']description["']\s+content=["'][^"']+["']/i);
  assert.match(html, /<meta\s+name=["']theme-color["']\s+content=["']#101329["']/i);
  assert.match(html, /<link\s+rel=["']icon["']\s+href=["']assets\/favicon\.svg["']/i);

  for (const asset of ['assets/brand-mark.svg', 'assets/favicon.svg']) {
    assert.ok(existsSync(new URL(asset, root)), `${asset} must exist`);
    const svg = await readFile(new URL(asset, root), 'utf8');
    assert.match(svg, /<svg\b[^>]*viewBox=["']0 0 64 64["']/i);
    assert.match(svg, /#1b1d3e/i);
    assert.match(svg, /#efcb7d/i);
  }
});
