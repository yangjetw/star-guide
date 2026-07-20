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

test('preserves the Task 1 semantic landmarks and Gamma section flow', async () => {
  const { html, css } = await siteFiles();
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<main\b[^>]*id=["']main-content["']/i);
  assert.match(html, /<a[^>]+class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#main-content["']/i);
  const ids = ['hero', 'concerns', 'unique-child', 'method', 'required-data', 'pricing', 'deliverables', 'value-comparison', 'transformation', 'testimonials', 'closing'];
  assert.deepEqual([...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]), ids);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px/i);
  assert.match(css, /\.skip-link:focus-visible\s*\{[^}]*top:\s*0/i);
  assert.match(css, /\.skip-link:focus(?:-visible)?\s*\{[^}]*top:\s*0/i);
});

test('respects reduced motion and protects external navigation', async () => {
  const { html, css } = await siteFiles();
  const externalAnchors = (html.match(/<a\b[^>]*>/gi) ?? []).filter((anchor) => /href=["']https?:\/\//i.test(anchor));
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /scroll-behavior:\s*auto/i);
  assert.match(css, /(?:animation|transition)-duration:\s*0\.01ms/i);
  for (const anchor of externalAnchors) {
    assert.match(anchor, /target=["']_blank["']/i);
    assert.match(anchor, /rel=["']noopener noreferrer["']/i);
  }
});

test('keeps current story components and keyboard focus legible', async () => {
  const { css } = await siteFiles();
  assert.match(css, /\.process-list li\s*\{[^}]*color:\s*var\(--ink\)/i);
  assert.match(css, /\.deliverable-list article\s*\{[^}]*color:\s*var\(--ink\)/i);
  assert.match(css, /\.eyebrow\s*\{[^}]*color:\s*var\(--night-soft\)/i);
  assert.match(css, /\.hero-section \.eyebrow\s*\{[^}]*color:\s*var\(--starlight\)/i);
  assert.doesNotMatch(css, /\.steps\b|\.deliverable-list li\b|\.hero\s+\.eyebrow|\.section:nth-of-type/i);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--night-soft\)[^}]*box-shadow:\s*0 0 0 6px var\(--cream\),\s*0 0 0 9px var\(--starlight\)/i);
});

test('adds trustworthy metadata and original accessible brand assets', async () => {
  const { html } = await siteFiles();
  assert.match(html, /<meta\s+name=["']description["']\s+content=["']專為 3–12 歲孩子打造的親子成長指南，協助家長理解孩子的氣質、情緒與互動節奏。["']/i);
  assert.match(html, /<meta\s+name=["']theme-color["']\s+content=["']#fffaf6["']/i);
  assert.match(html, /<meta\s+property=["']og:type["']\s+content=["']website["']/i);
  assert.match(html, /<meta\s+property=["']og:title["']\s+content=["']親子成長指南｜看見孩子獨特的宇宙["']/i);
  assert.match(html, /<meta\s+property=["']og:description["']\s+content=["']一份讓你真正懂孩子、可長期使用的親子溝通工具書。["']/i);
  assert.match(html, /<meta\s+property=["']og:image["']\s+content=["']assets\/images\/hero-parent-child\.webp["']/i);
  assert.match(html, /<link\s+rel=["']icon["']\s+href=["']assets\/favicon\.svg["']/i);
  for (const asset of ['assets/brand-mark.svg', 'assets/favicon.svg']) {
    assert.ok(existsSync(new URL(asset, root)));
    const svg = await readFile(new URL(asset, root), 'utf8');
    assert.match(svg, /<svg\b[^>]*viewBox=["']0 0 64 64["']/i);
    assert.match(svg, /#1b1d3e/i);
    assert.match(svg, /#efcb7d/i);
  }
});
