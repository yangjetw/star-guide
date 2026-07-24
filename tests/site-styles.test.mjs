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

test('connects the seven chapters inside one restrained reading column', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.story-section\[data-chapter\]\s*\{[^}]*width:\s*min\(calc\(100% - 64px\),\s*var\(--reading-width\)\)[^}]*border-top:/s);
  assert.match(css, /\[data-chapter\]::before\s*\{[^}]*content:\s*attr\(data-chapter\)[^}]*color:\s*var\(--color-gold\)/s);
  assert.match(css, /\.story-section\s*\{[^}]*gap:\s*clamp\(28px,\s*5vw,\s*64px\)/s);
  assert.match(css, /\.story-media\s*\{[^}]*box-shadow:\s*var\(--shadow-card\)/s);
});

test('turns pricing, comparison, testimonials, and closing into clear anchors', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.price-section\s*\{[^}]*width:\s*min\(calc\(100% - 64px\),\s*var\(--reading-width\)/s);
  assert.match(css, /\.price-card\s*\{[^}]*background:\s*linear-gradient\([^}]*var\(--color-night\)/s);
  assert.match(css, /\.price-card \.price\s*\{[^}]*color:\s*#fff/s);
  assert.match(css, /\.comparison-section\s*\{[^}]*background:\s*#fff/s);
  assert.match(css, /\.testimonial-list\s*\{[^}]*background:\s*#f6eee7/s);
  assert.match(css, /\.closing-section\s*\{[^}]*background:\s*var\(--color-night\)/s);
});

test('keeps the premium book focused and touch friendly at mobile widths', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.brand\s*\{[^}]*display:\s*inline-flex[^}]*align-items:\s*center[^}]*min-height:\s*48px/s);
  assert.match(css, /@media\s*\(max-width:\s*1024px\)/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /@media\s*\(max-width:\s*420px\)/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.book-page\s*\{[^}]*width:\s*100%[^}]*border-radius:\s*0/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.story-section\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.story-section-reverse \.story-copy\s*\{[^}]*order:\s*1/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.story-section-reverse \.story-media\s*\{[^}]*order:\s*2/s);
  assert.match(css, /\.button\s*\{[^}]*min-height:\s*52px/s);
  assert.match(css, /@media\s*\(max-width:\s*420px\)\s*\{[\s\S]*?\.button-row\s+\.button\s*\{[^}]*flex:\s*0\s+0\s+auto[^}]*width:\s*100%/s);
  assert.match(css, /\.table-wrap\s*\{[^}]*overflow-x:\s*auto/s);
  assert.doesNotMatch(css, /position:\s*fixed[^}]*bottom:/s);
});

test('keeps the inset hero centered through tablet and mobile widths', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  const tabletRules = css.match(/@media\s*\(max-width:\s*1024px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  const mobileHeroRule = css.match(/@media\s*\(max-width:\s*768px\)[\s\S]*?\.hero-section\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.doesNotMatch(tabletRules, /\.hero-section\s*,/);
  assert.match(mobileHeroRule, /margin:\s*12px/);
});

test('extends the premium book language across shared marketplace pages', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.site-nav\s*\{[^}]*display:\s*flex[^}]*flex-wrap:\s*wrap/s);
  assert.match(css, /\.page-shell\s*\{[^}]*background:\s*var\(--color-paper\)[^}]*border-radius:\s*36px[^}]*box-shadow:\s*var\(--shadow-paper\)/s);
  assert.match(css, /\.subpage-hero\s*\{[^}]*background:[^;}]*var\(--color-night\)[^}]*border-radius:\s*32px/s);
  assert.match(css, /\.pricing-grid\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(css, /\.gift-card-preview\s*\{[^}]*border:\s*1px solid var\(--color-border\)[^}]*border-radius:\s*24px/s);
  assert.match(css, /\.testimonial-gallery\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.testimonial-gallery img\s*\{[^}]*object-fit:\s*contain/s);
  assert.match(css, /\.policy-section\s*\{[^}]*border-top:\s*1px solid var\(--color-border\)/s);
});

test('lets a text-only story section and its pricing grid use both desktop columns', async () => {
  const [html, css] = await Promise.all([
    readFile(new URL('../gift.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
  ]);
  const pricingSection = html.match(/<section\b[^>]*aria-labelledby="plans-title"[\s\S]*?<\/section>/i)?.[0] ?? '';
  assert.match(pricingSection, /^\s*<section\b[^>]*>\s*<div\b[^>]*class="story-copy"/i);
  assert.equal((pricingSection.match(/class="[^"]*\bstory-copy\b[^"]*"/gi) ?? []).length, 1);
  assert.doesNotMatch(pricingSection, /class="[^"]*\bstory-media\b/);
  assert.match(pricingSection, /class="[^"]*\bpricing-grid\b/);
  assert.match(css, /\.story-section\s*>\s*\.story-copy:only-child\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/s);
});

test('keeps shared marketplace pages responsive without fixed purchase controls', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');

  assert.match(css, /body\s*\{[^}]*font-size:\s*clamp\(18px,/s);
  assert.match(css, /\.button\s*\{[^}]*min-height:\s*52px/s);
  assert.match(css, /@media\s*\(max-width:\s*1024px\)[\s\S]*?\.page-shell\s*\{[^}]*width:/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.site-nav\s*\{[^}]*flex-wrap:\s*wrap/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.pricing-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.testimonial-gallery\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.page-shell\s*\{[^}]*padding:\s*20px/s);
  assert.match(css, /@media\s*\(max-width:\s*420px\)[\s\S]*?\.subpage-hero h1\s*\{[^}]*font-size:/s);
  assert.match(css, /@media\s*\(max-width:\s*420px\)[\s\S]*?\.subpage-hero\s+\.button,\s*\.pricing-grid\s+\.button-primary,\s*\.gift-bridge\s+\.button\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /@media\s*\(max-width:\s*320px\)[\s\S]*?\.subpage-hero\s*\{[^}]*padding-inline:\s*20px/s);
  assert.doesNotMatch(css, /position:\s*fixed[^}]*bottom:/s);
});

test('binds shared responsive styles to the hooks used by all four pages', async () => {
  const [css, index, gift, navigator, refund] = await Promise.all([
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../gift.html', import.meta.url), 'utf8'),
    readFile(new URL('../navigator.html', import.meta.url), 'utf8'),
    readFile(new URL('../refund.html', import.meta.url), 'utf8'),
  ]);

  for (const page of [gift, navigator, refund]) {
    assert.match(page, /<div\b[^>]*class="[^"]*\bpage-shell\b[^"]*"/i);
    assert.match(page, /<section\b[^>]*class="[^"]*\bsubpage-hero\b[^"]*"/i);
  }

  assert.match(gift, /<div\b[^>]*class="[^"]*\bpricing-grid\b[^"]*"/i);
  assert.match(gift, /class="[^"]*\bgift-card-preview\b[^"]*"[\s\S]*?STAR-2026-[A-HJ-NP-Z2-9]{4}/i);
  assert.match(gift, /class="[^"]*\bgift-card-preview\b[^"]*"[\s\S]*?GIFT-2026-[A-HJ-NP-Z2-9]{4}/i);
  assert.match(refund, /<section\b[^>]*class="[^"]*\bpolicy-section\b[^"]*"/i);
  assert.match(index, /<p\b[^>]*class="[^"]*\bsection-note\b[^"]*"/i);
  assert.match(index, /<div\b[^>]*class="[^"]*\btestimonial-gallery\b[^"]*"[\s\S]*?<figure\b[\s\S]*?<figure\b[\s\S]*?<figure\b/i);

  for (const page of [index, gift, navigator, refund]) {
    assert.match(page, /<section\b[^>]*class="[^"]*\bgift-bridge\b[^"]*"/i);
  }

  assert.match(css, /\.gift-bridge\s*\{[^}]*border:\s*1px solid var\(--color-border\)[^}]*border-radius:\s*28px/s);
  assert.match(css, /\.section-note\s*\{[^}]*color:\s*var\(--color-muted\)/s);
  assert.match(css, /@media\s*\(max-width:\s*420px\)[\s\S]*?\.subpage-hero\s+\.button,\s*\.pricing-grid\s+\.button-primary,\s*\.gift-bridge\s+\.button\s*\{[^}]*width:\s*100%/s);
});
