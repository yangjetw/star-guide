import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('defines the approved immersive gift palette and typography', async () => {
  const css = await read('styles.css');
  for (const token of [
    '--color-night: #0d142c',
    '--color-night-soft: #1b2850',
    '--color-ivory: #fbf5ec',
    '--color-paper: #fffaf4',
    '--color-ink: #1b2038',
    '--color-coral: #ff7859',
    '--color-jade: #5dcc88',
    '--color-gold: #e7bf77',
  ]) assert.ok(css.toLowerCase().includes(token), `${token} should be defined`);
  assert.match(css, /--font-display:[^;]*Noto Serif TC[^;]*serif/i);
  assert.match(css, /--font-body:[^;]*Noto Sans TC[^;]*sans-serif/i);
  assert.match(css, /font-size:\s*clamp\(/i);
  assert.doesNotMatch(css, /@import\s+url|fonts\.googleapis\.com/i);
});

test('uses a fluid narrative instead of fixed handbook canvases', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('styles.css')]);
  assert.match(html, /class="site-story"/i);
  assert.doesNotMatch(html, /\bbook-page\b/i);
  assert.doesNotMatch(css, /aspect-ratio:\s*4\s*\/\s*3/i);
  assert.doesNotMatch(css, /--handbook-|max-height:\s*calc\(100svh/i);
  assert.match(css, /\.site-story\s*\{[^}]*overflow:\s*clip/is);
  assert.match(css, /\.story-section\s*\{[^}]*display:\s*grid/is);
});

test('builds a cinematic starry hero with a readable overlay', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.hero-section\s*\{[^}]*min-height:\s*min\(860px,\s*calc\(100svh/is);
  assert.match(css, /\.hero-section::after\s*\{[^}]*linear-gradient/is);
  assert.match(css, /\.hero-section \.story-media\s*\{[^}]*position:\s*absolute/is);
  assert.match(css, /\.hero-section \.story-copy\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2/is);
});

test('creates editorial light and dark chapters with focused conversion actions', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.gift-bridge\s*\{[^}]*background:\s*var\(--color-ivory\)/is);
  assert.match(css, /\.button-primary\s*\{[^}]*background:\s*var\(--color-coral\)/is);
  assert.match(css, /\.button-line\s*\{[^}]*background:\s*var\(--color-jade\)/is);
  assert.match(css, /\.testimonial-gallery\s*\{[^}]*display:\s*grid/is);
  assert.match(css, /\.comparison-section\s*\{[^}]*background:\s*var\(--color-paper\)/is);
  assert.match(css, /\.closing-section\s*\{[^}]*background:\s*var\(--color-night\)/is);
});

test('keeps illustrations natural and testimonial screenshots credible', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.story-media img\s*\{[^}]*object-fit:\s*cover/is);
  assert.match(css, /\.process-media img\s*\{[^}]*object-fit:\s*contain/is);
  assert.match(css, /\.testimonial-gallery img\s*\{[^}]*object-fit:\s*contain/is);
  assert.match(css, /\.closing-media img\s*\{[^}]*height:\s*auto/is);
  assert.doesNotMatch(css, /backdrop-filter/i);
});

test('supports tablet and phone layouts without clipped copy or fixed controls', async () => {
  const css = await read('styles.css');
  for (const width of ['1024px', '768px', '420px']) {
    assert.match(css, new RegExp(`@media\\s*\\(max-width:\\s*${width}\\)`, 'i'));
  }
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.story-section\s*\{[^}]*grid-template-columns:\s*1fr/is);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.pricing-grid\s*\{[^}]*grid-template-columns:\s*1fr/is);
  assert.match(css, /\.button\s*\{[^}]*min-height:\s*52px/is);
  assert.match(css, /\.table-wrap\s*\{[^}]*overflow-x:\s*auto/is);
  assert.doesNotMatch(css, /position:\s*fixed[^}]*bottom:/is);
});

test('extends the same premium language across all supporting pages', async () => {
  const [css, gift, navigator, refund] = await Promise.all([
    read('styles.css'),
    read('gift.html'),
    read('navigator.html'),
    read('refund.html'),
  ]);
  for (const page of [gift, navigator, refund]) {
    assert.match(page, /class="[^"]*\bpage-shell\b/i);
    assert.match(page, /class="[^"]*\bsubpage-hero\b/i);
  }
  assert.match(css, /\.page-shell\s*\{[^}]*background:\s*var\(--color-paper\)/is);
  assert.match(css, /\.subpage-hero\s*\{[^}]*background:\s*var\(--color-night\)/is);
  assert.match(css, /\.pricing-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/is);
  assert.match(css, /\.policy-section\s*\{[^}]*border-top:/is);
});

test('provides visible focus and reduced-motion fallbacks', async () => {
  const css = await read('styles.css');
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--color-jade\)/is);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /scroll-behavior:\s*auto/i);
  assert.match(css, /(?:animation|transition)-duration:\s*0\.01ms/i);
});
