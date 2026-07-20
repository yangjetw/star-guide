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
