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

test('defines the warm comparison emphasis contract', async () => {
  const css = await read('styles.css');
  assert.match(css, /--color-peach:\s*#fff0e8/);
  assert.match(css, /--color-peach-deep:\s*#ffd8c8/);
  assert.match(css, /--shadow-warm:\s*0 18px 44px rgb\(217 83 57 \/ 12%\)/);
  assert.match(css, /\.our-guide th,\s*\.our-guide td\s*\{[^}]*background:\s*linear-gradient\([^}]*var\(--color-peach\)/s);
  assert.match(css, /\.our-guide th\s*\{[^}]*font-size:\s*22px/s);
  assert.match(css, /\.our-guide td\s*\{[^}]*font-size:\s*18px/s);
  assert.match(css, /\.our-guide td:nth-child\(2\)\s*\{[^}]*font-size:\s*24px[^}]*color:\s*var\(--color-coral-dark\)/s);
});

test('presents the parent insight as a readable editorial quote card', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.reader-quote\s*\{[^}]*max-width:\s*46rem[^}]*background:\s*var\(--color-white\)[^}]*border:\s*1px solid[^}]*var\(--color-coral\)/s);
  assert.match(css, /\.reader-quote__label\s*\{[^}]*font-family:\s*var\(--font-body\)[^}]*color:\s*var\(--color-coral-dark\)/s);
  assert.match(css, /\.reader-quote__text\s*\{[^}]*font-size:\s*clamp\(20px,[^}]*26px\)[^}]*line-height:\s*1\.6/s);
});

test('keeps coral separators on every guide cell despite the last-row reset', async () => {
  const css = await read('styles.css');
  assert.match(
    css,
    /\.our-guide th,\s*\.our-guide td\s*\{(?=[^}]*border-top:\s*2px solid var\(--color-coral\))(?=[^}]*border-bottom:\s*2px solid var\(--color-coral\))[^}]*\}/s,
    'the shared guide-cell rule should provide both coral separators',
  );
  assert.match(
    css,
    /\.our-guide:last-child th,\s*\.our-guide:last-child td\s*\{[^}]*border-bottom:\s*2px solid var\(--color-coral\)/s,
    'the more-specific last-row rule should restore the coral bottom separator',
  );
});

test('uses restrained semantic editorial sections instead of split handbook canvases', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('styles.css')]);
  assert.match(html, /class="brand-story"/i);
  assert.doesNotMatch(html, /\bbook-page\b/i);
  assert.doesNotMatch(css, /aspect-ratio:\s*4\s*\/\s*3/i);
  assert.doesNotMatch(css, /--handbook-|max-height:\s*calc\(100svh/i);
  assert.match(css, /\.brand-story\s*\{[^}]*overflow:\s*clip/is);
  assert.match(css, /\.editorial-layout\s*\{[^}]*display:\s*grid/is);
  assert.doesNotMatch(css, /\.story-section-focus/);
  assert.doesNotMatch(css, /min-height:\s*520px/i);
});

test('caps wide-screen typography and keeps short facts content-driven', async () => {
  const css = await read('styles.css');
  assert.match(css, /--section-title-max:\s*46px/i);
  assert.doesNotMatch(css, /h2\s*\{[^}]*4vw/is);
  assert.doesNotMatch(css, /\.fact-list[^}]*min-height/is);
  assert.match(css, /@media\s*\(min-width:\s*1600px\)/i);
});

test('defines the readable type and prominent navigation contract', async () => {
  const css = await read('styles.css');
  assert.match(css, /--body-size:\s*clamp\(18px,[^;]+20px\)/);
  assert.match(css, /--nav-height:\s*76px/);
  assert.match(css, /--nav-link-size:\s*clamp\(17px,[^;]+18px\)/);
  assert.match(css, /body\s*\{[^}]*font-size:\s*var\(--body-size\)/s);
  assert.match(css, /\.site-header\s*\{[^}]*min-height:\s*var\(--nav-height\)[^}]*border-bottom:\s*1px solid var\(--nav-border\)[^}]*background:\s*var\(--nav-surface\)[^}]*box-shadow:/s);
  assert.match(css, /\.site-nav a\s*\{[^}]*min-height:\s*44px[^}]*font-size:\s*var\(--nav-link-size\)/s);

  for (const [selector, fontSize] of [
    ['\\.eyebrow', 'clamp\\(16px,'],
    ['\\.fact-list p', 'clamp\\(17px,'],
    ['\\.process-steps li::before', '16px'],
    ['\\.privacy-note,\\s*\\.chapter-note', 'clamp\\(16px,'],
    ['table', 'clamp\\(16px,'],
    ['\\.site-footer', 'clamp\\(16px,'],
  ]) {
    assert.match(css, new RegExp(`${selector}\\s*\\{[^}]*font-size:\\s*${fontSize}`, 's'), `${selector} should keep supporting text at 16px or larger`);
  }
});

test('builds a cinematic starry hero with a readable overlay', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.hero-section\s*\{[^}]*min-height:\s*min\(860px,\s*calc\(100svh/is);
  assert.match(css, /\.hero-section::after\s*\{[^}]*linear-gradient/is);
  assert.match(css, /\.hero-section \.story-media\s*\{[^}]*position:\s*absolute/is);
  assert.match(css, /\.hero-section \.story-copy\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2/is);
});

test('keeps the complete hero artwork visible at every responsive ratio', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.hero-section \.story-media img\s*\{[^}]*object-fit:\s*contain/is);
  assert.doesNotMatch(css, /\.hero-section \.story-media\s*\{[^}]*min-height:\s*660px/is);
  assert.match(
    css,
    /@media\s*\(max-width:\s*768px\)[\s\S]*?\.hero-section \.story-media\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/is,
  );
});

test('creates editorial light and dark chapters with focused conversion actions', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.gift-bridge\s*\{[^}]*background:\s*var\(--color-ivory\)/is);
  assert.match(css, /\.button-primary\s*\{[^}]*background:\s*var\(--color-coral\)/is);
  assert.match(css, /\.button-line\s*\{[^}]*background:\s*var\(--color-jade\)/is);
  assert.match(css, /\.proof-gallery\s*\{[^}]*display:\s*grid/is);
  assert.match(css, /\.comparison-section\s*\{[^}]*background:\s*var\(--color-paper\)/is);
  assert.match(css, /\.chapter-closing\s*\{[^}]*background:\s*var\(--color-night\)/is);
});

test('assigns intentional image and text ratios to each complete topic', async () => {
  const css = await read('styles.css');
  for (const hook of [
    'editorial-layout--concerns',
    'editorial-layout--unique',
    'editorial-layout--method',
    'editorial-layout--data',
    'editorial-layout--deliverables',
    'editorial-layout--transformation',
  ]) {
    assert.match(css, new RegExp(`\\.${hook}\\s*\\{[^}]*grid-template-columns:`, 'is'), `${hook} needs a deliberate desktop ratio`);
  }
  assert.match(css, /\.chapter-closing\s*\{[^}]*min-height:/is);
});

test('keeps illustrations natural and testimonial screenshots credible', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.story-media img\s*\{[^}]*object-fit:\s*cover/is);
  assert.match(css, /\.process-media img\s*\{[^}]*object-fit:\s*contain/is);
  assert.match(css, /\.proof-gallery img\s*\{[^}]*object-fit:\s*contain/is);
  assert.match(css, /\.chapter-closing \.closing-media img\s*\{[^}]*object-fit:\s*cover/is);
  assert.doesNotMatch(css, /backdrop-filter/i);
});

test('supports tablet and phone layouts without clipped copy or fixed controls', async () => {
  const [css, ...pages] = await Promise.all([
    read('styles.css'),
    ...['index.html', 'gift.html', 'navigator.html', 'refund.html'].map(read),
  ]);
  for (const width of ['1024px', '768px', '420px']) {
    assert.match(css, new RegExp(`@media\\s*\\(max-width:\\s*${width}\\)`, 'i'));
  }
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.editorial-layout\s*\{[^}]*grid-template-columns:\s*1fr/is);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.fact-list\s*\{[^}]*grid-template-columns:\s*1fr/is);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.pricing-grid\s*\{[^}]*grid-template-columns:\s*1fr/is);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.site-nav a:first-child\s*\{[^}]*font-size:\s*clamp\(16px,[^;]+17px\)/is);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.site-nav a:not\(:first-child\):not\(\.nav-line\)\s*\{[^}]*display:\s*none/is);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.site-nav \.nav-line\s*\{[^}]*padding-inline:\s*12px/is);
  for (const page of pages) assert.match(page, /<a\b[^>]*class="nav-line"[^>]*>官方 LINE<\/a>/i);
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
    assert.match(page, /class="[^"]*\bbrand-page\b/i);
    assert.match(page, /class="[^"]*\bpage-hero\b/i);
  }
  assert.match(css, /\.brand-page\s*\{[^}]*background:\s*var\(--color-paper\)/is);
  assert.match(css, /\.page-hero\s*\{[^}]*background:\s*var\(--color-night\)/is);
  assert.match(css, /\.pricing-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/is);
  assert.match(css, /\.brand-page--policy \.content-section\s*\{[^}]*border-top:/is);
});

test('provides visible focus and reduced-motion fallbacks', async () => {
  const css = await read('styles.css');
  assert.match(css, /:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--color-jade\)/is);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /scroll-behavior:\s*auto/i);
  assert.match(css, /(?:animation|transition)-duration:\s*0\.01ms/i);
});
