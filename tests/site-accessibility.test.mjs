import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'gift.html', 'navigator.html', 'refund.html'];
const brandOperatorStatement = '赫爾墨斯的小宇宙，由星學會運營。';

const readPage = (name) => readFile(new URL(name, root), 'utf8');
const externalAnchors = (html) => (html.match(/<a\b[^>]*>/gi) ?? [])
  .filter((anchor) => /href=["'](?:https?:)?\/\//i.test(anchor));
const visibleText = (fragment) => fragment
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<\/(?:p|h[1-6]|li|th|td|blockquote|cite)>/gi, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();

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
  const ids = [
    'hero',
    'concerns',
    'unique-child',
    'method',
    'required-data',
    'gift-bridge',
    'deliverables',
    'value-comparison',
    'transformation',
    'testimonials',
    'role-journey',
    'closing',
  ];
  assert.deepEqual([...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]), ids);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px/i);
  assert.match(css, /\.skip-link:focus-visible\s*\{[^}]*top:\s*0/i);
  assert.match(css, /\.skip-link:focus(?:-visible)?\s*\{[^}]*top:\s*0/i);
});

test('marks the current route in shared navigation', async () => {
  for (const page of pages) {
    const html = await readPage(page);
    const nav = html.match(/<nav\b[\s\S]*?<\/nav>/i)?.[0] ?? '';
    const currentAnchors = nav.match(/<a\b[^>]*\baria-current=["']page["'][^>]*>/gi) ?? [];
    assert.equal(currentAnchors.length, 1, `${page} needs one current-page marker in its navigation`);
    assert.equal(
      currentAnchors[0].match(/\bhref=["']([^"']+)["']/i)?.[1],
      page,
      `${page} must mark its own route as current`,
    );
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? '';
    assert.ok(visibleText(footer).includes(brandOperatorStatement), `${page} needs the exact operator statement`);
  }
});

test('respects reduced motion and protects external navigation', async () => {
  const { html, css } = await siteFiles();
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /scroll-behavior:\s*auto/i);
  assert.match(css, /(?:animation|transition)-duration:\s*0\.01ms/i);
});

test('keeps each public page keyboard-accessible and secures every external link', async () => {
  for (const page of pages) {
    const html = await readPage(page);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1, `${page} needs one h1`);
    assert.match(html, /<main\b[^>]*id=["']main-content["']/i);
    assert.match(html, /<a[^>]+class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#main-content["']/i);
    for (const anchor of externalAnchors(html)) {
      assert.doesNotMatch(anchor, /href=["']http:\/\//i);
      assert.doesNotMatch(anchor, /href=["']\/\//i);
      assert.match(anchor, /target=["']_blank["']/i);
      assert.match(anchor, /rel=["']noopener noreferrer["']/i);
    }
    for (const image of html.match(/<img\b[^>]*>/gi) ?? []) {
      assert.match(image, /\balt=["'][^"']+[^"']["']/i, `${page} content images need descriptive alt text`);
    }
  }
});

test('keeps semantic brand components and keyboard focus legible', async () => {
  const { css } = await siteFiles();
  assert.match(css, /\.brand-story\s*\{/);
  assert.match(css, /\.editorial-layout\s*\{/);
  assert.doesNotMatch(css, /\[data-chapter\]/);
  assert.match(css, /\.chapter-closing h2\s*,/);
  assert.match(css, /\.process-steps li\s*\{[^}]*color:\s*var\(--ink\)/i);
  assert.match(css, /\.fact-list li\s*\{[^}]*color:\s*var\(--ink\)/i);
  assert.match(css, /\.eyebrow\s*\{[^}]*color:\s*var\(--night-soft\)/i);
  assert.match(css, /\.hero-section \.eyebrow\s*\{[^}]*color:\s*var\(--color-gold\)/i);
  assert.doesNotMatch(css, /\.process-list\b|\.chapter-grid\b|\.hero\s+\.eyebrow|\.section:nth-of-type/i);
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--color-jade\)/i);
});

test('adds trustworthy metadata and original accessible brand assets', async () => {
  const { html } = await siteFiles();
  assert.match(html, /<meta\s+name=["']description["']\s+content=["']專為 3–12 歲孩子打造的親子成長指南，協助家長理解孩子的氣質、情緒與互動節奏。["']/i);
  assert.match(html, /<meta\s+name=["']theme-color["']\s+content=["']#0d142c["']/i);
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
