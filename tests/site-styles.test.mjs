import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('uses the approved bright Gamma-faithful palette and soft Chinese typography', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /--color-bg:\s*#fff(?:fff)?;/i);
  assert.match(css, /--color-accent:\s*#ff6b4a;/i);
  assert.match(css, /--color-line:\s*#55c982;/i);
  assert.match(css, /Noto Sans TC|PingFang TC|Microsoft JhengHei/);
  assert.match(css, /font-size:\s*clamp\(18px,/);
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
