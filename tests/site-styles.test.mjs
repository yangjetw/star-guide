import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('defines the premium book palette and soft Chinese type system', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /--color-canvas:\s*#f3ede7;/i);
  assert.match(css, /--color-paper:\s*#fffaf6;/i);
  assert.match(css, /--color-night:\s*#182039;/i);
  assert.match(css, /--color-accent:\s*#ff6b4a;/i);
  assert.match(css, /--color-line:\s*#55c982;/i);
  assert.match(css, /--font-display:[^;]*Noto Serif TC[^;]*Songti TC[^;]*PMingLiU[^;]*serif;/i);
  assert.match(css, /--font-sans:[^;]*Noto Sans TC[^;]*PingFang TC[^;]*Microsoft JhengHei[^;]*sans-serif;/i);
  assert.match(css, /h1,\s*h2,\s*h3\s*\{[^}]*font-family:\s*var\(--font-display\)/s);
  assert.match(css, /font-size:\s*clamp\(18px,/);
  assert.doesNotMatch(css, /@import\s+url|fonts\.googleapis\.com/i);
});

test('renders one centered paper and a cohesive cover hero', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /body\s*\{[^}]*background:\s*var\(--color-canvas\)/s);
  assert.match(css, /\.book-page\s*\{[^}]*width:\s*min\(calc\(100% - 40px\),\s*1080px\)[^}]*margin:\s*28px auto 56px[^}]*background:\s*var\(--color-paper\)[^}]*border-radius:\s*36px[^}]*box-shadow:/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\.book-page\s*\{[^}]*margin:\s*0/s);
  assert.match(css, /\.hero-section\s*\{[^}]*background:[^;}]*var\(--color-night\)[^}]*border-radius:\s*32px/s);
  assert.match(css, /\.hero-section \.story-copy\s*\{[^}]*color:\s*#fff/s);
  assert.match(css, /\.hero-section \.eyebrow\s*\{[^}]*color:\s*#ffc0a9/s);
  assert.match(css, /\.hero-section \.story-media\s*\{[^}]*align-self:\s*stretch/s);
});

test('alternates desktop stories and stacks them below 768px', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.story-section\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.story-section-reverse\s+\.story-copy/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /grid-template-columns:\s*1fr/);
  assert.doesNotMatch(css, /\.mobile-purchase\s*\{[^}]*position:\s*fixed/s);
});

test('frames local images without the old glass-card treatment', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.story-media img\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(css, /border-radius:\s*2[02468]px/);
  assert.doesNotMatch(css, /backdrop-filter/);
});

test('shows the portrait process image at its natural ratio without cropping', async () => {
  const [html, css] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);
  const method = html.match(/<section\b[^>]*id="method"[\s\S]*?<\/section>/i)?.[0] ?? '';
  const processFrameRule = css.match(/\.process-media\s*\{([^}]*)\}/s)?.[1] ?? '';
  const processImageRule = css.match(/\.process-media img\s*\{([^}]*)\}/s)?.[1] ?? '';

  assert.match(method, /<figure\b[^>]*class="[^"]*\bprocess-media\b[^"]*"/i);
  assert.match(method, /<img\b[^>]*src="assets\/images\/process-wonder\.webp"[^>]*width="864"[^>]*height="1152"/i);
  assert.match(processFrameRule, /aspect-ratio:\s*3\s*\/\s*4/i);
  assert.match(processImageRule, /object-fit:\s*contain/i);
  assert.doesNotMatch(method, /\bstory-media-landscape\b/i);
});

test('preserves the closing image aspect ratio at mobile widths', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const closingImageRule = css.match(/\.closing-media img\s*\{([^}]*)\}/s)?.[1] ?? '';

  assert.match(closingImageRule, /width:\s*100%/);
  assert.match(closingImageRule, /height:\s*auto/);
  assert.match(closingImageRule, /max-height:\s*620px/);
  assert.match(closingImageRule, /object-fit:\s*cover/);
  assert.match(closingImageRule, /border-radius:\s*28px/);
});
