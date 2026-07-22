# Premium Book Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing Gamma-faithful static page into a focused, continuous “premium book” experience while preserving every approved word, image, price, link, and privacy boundary.

**Architecture:** Keep the zero-dependency static HTML/CSS architecture. Add one structural `.book-page` wrapper and non-visible `data-chapter` attributes in HTML, then implement the visual system entirely in CSS. Extend the existing Node test suite to lock structure, typography, responsive behavior, links, accessibility, and image treatment before browser QA and GitHub Pages deployment.

**Tech Stack:** Semantic HTML5, CSS custom properties and responsive media queries, Node.js built-in test runner, GitHub Actions, GitHub Pages.

## Global Constraints

- Preserve all 11 existing section IDs, their order, and their complete visible Traditional-Chinese copy.
- Preserve both visible `NT$3980` occurrences and the single-offer positioning.
- Preserve all eight local WebP assets, their accessible alternative text, intrinsic dimensions, and no-unreasonable-cropping behavior.
- The public LINE URL remains exactly `https://lin.ee/gMMpzNy`.
- The public payment-report URL remains exactly `https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform`.
- The private redemption-form identifier must not appear in `index.html`, `styles.css`, or deployed assets.
- Remain a static GitHub Pages site with no runtime JavaScript, backend, authentication, cart, timer, or external font request.
- Mobile body copy remains at least `18px`; interactive targets remain at least `48px` high.
- Respect `prefers-reduced-motion`, keyboard focus, semantic headings, image alt text, and comparison-table scopes.
- Do not modify `.github/workflows/pages.yml` unless deployment verification proves the existing workflow is broken.

---

## File Map

- `index.html` — owns semantic content, the new `.book-page` structural wrapper, and `data-chapter` hooks. It must not gain new visible copy.
- `styles.css` — owns the complete premium-book visual system, hero cover, chapter rhythm, special panels, responsive behavior, focus, and reduced-motion behavior.
- `tests/site-content.test.mjs` — protects content order, visible-copy identity, public links, privacy, wrapper structure, and chapter metadata.
- `tests/site-styles.test.mjs` — protects design tokens, central paper, cover, chapter cards, special panels, image ratios, and responsive rules.
- `tests/site-accessibility.test.mjs` — protects landmarks, focus, reduced motion, live selectors, and external-link safety.
- `README.md` — no planned content change; update only if the local verification or publishing workflow actually changes.

---

### Task 1: Add the book-page structure without changing visible copy

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `index.html:24-283`

**Interfaces:**
- Consumes: existing section IDs and the existing `section(html, id)` test helper.
- Produces: one `.book-page` wrapper and `data-chapter="01"` through `data-chapter="07"` hooks consumed by Task 2 and Task 3 CSS.

- [ ] **Step 1: Write the failing structural test**

Add this test after the existing `section` and `visibleText` helpers in `tests/site-content.test.mjs`:

```js
test('groups the story into one book page with seven non-copy chapter hooks', async () => {
  const html = await read('index.html');
  const main = html.match(/<main\b[^>]*id="main-content"[\s\S]*?<\/main>/i)?.[0] ?? '';
  assert.match(main, /^<main\b[^>]*id="main-content"[^>]*>\s*<div\b[^>]*class="book-page"/i);
  assert.match(main, /<\/div>\s*<\/main>$/i);

  const chapters = {
    concerns: '01',
    'unique-child': '02',
    method: '03',
    'required-data': '04',
    deliverables: '05',
    transformation: '06',
    testimonials: '07',
  };

  for (const [id, chapter] of Object.entries(chapters)) {
    assert.match(section(html, id), new RegExp(`data-chapter="${chapter}"`, 'i'));
  }

  assert.equal((html.match(/\bdata-chapter="\d{2}"/g) ?? []).length, 7);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test tests/site-content.test.mjs
```

Expected: the new test fails because `.book-page` and the seven `data-chapter` attributes do not exist; all earlier content tests continue to pass.

- [ ] **Step 3: Add the minimal semantic structure**

Insert the opening `.book-page` element immediately after the existing `<main id="main-content">` tag:

```html
<main id="main-content">
  <div class="book-page">
```

Insert its closing tag immediately after the existing closing section and before `</main>`:

```html
  </div>
</main>
```

Apply the chapter hooks to the existing opening tags:

```html
<section id="concerns" class="story-section" data-chapter="01" aria-labelledby="concerns-title">
<section id="unique-child" class="story-section story-section-reverse" data-chapter="02" aria-labelledby="unique-title">
<section id="method" class="story-section" data-chapter="03" aria-labelledby="method-title">
<section id="required-data" class="story-section story-section-reverse" data-chapter="04" aria-labelledby="data-title">
<section id="deliverables" class="story-section" data-chapter="05" aria-labelledby="deliverables-title">
<section id="transformation" class="story-section story-section-reverse" data-chapter="06" aria-labelledby="transformation-title">
<section id="testimonials" class="testimonial-section" data-chapter="07" aria-labelledby="testimonials-title">
```

Do not insert visible chapter-number text; CSS pseudo-elements will render the numbers from `data-chapter`.

- [ ] **Step 4: Run focused and full tests and verify GREEN**

Run:

```powershell
node --test tests/site-content.test.mjs
node --test
```

Expected: all tests pass, including exact visible-copy and section-order tests.

- [ ] **Step 5: Commit Task 1**

```powershell
git add index.html tests/site-content.test.mjs
git commit -m "feat: group Gamma story into a book page"
```

---

### Task 2: Create the premium-book canvas, typography, and cover

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `styles.css:1-208`

**Interfaces:**
- Consumes: `.book-page`, `.hero-section`, `.story-copy`, `.story-media`, `.button`, and existing image metadata.
- Produces: the shared visual tokens and central-paper contract used by every later section.

- [ ] **Step 1: Write failing visual-system tests**

Replace the first palette test in `tests/site-styles.test.mjs` with these two tests:

```js
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
  assert.match(css, /\.book-page\s*\{[^}]*width:\s*min\(calc\(100% - 40px\),\s*1080px\)[^}]*margin:\s*0 auto[^}]*background:\s*var\(--color-paper\)[^}]*border-radius:\s*36px[^}]*box-shadow:/s);
  assert.match(css, /\.hero-section\s*\{[^}]*background:[^;}]*var\(--color-night\)[^}]*border-radius:\s*32px/s);
  assert.match(css, /\.hero-section \.story-copy\s*\{[^}]*color:\s*#fff/s);
  assert.match(css, /\.hero-section \.eyebrow\s*\{[^}]*color:\s*#ffc0a9/s);
  assert.match(css, /\.hero-section \.story-media\s*\{[^}]*align-self:\s*stretch/s);
});
```

- [ ] **Step 2: Run the style tests and verify RED**

Run:

```powershell
node --test tests/site-styles.test.mjs
```

Expected: failures for the missing premium tokens, serif display stack, `.book-page`, and cover styling.

- [ ] **Step 3: Implement the shared tokens and canvas**

At the start of `styles.css`, replace the current token block with this contract, keeping compatibility aliases used by existing focus and component rules:

```css
:root {
  --color-canvas: #f3ede7;
  --color-paper: #fffaf6;
  --color-surface: #ffffff;
  --color-text: #3f3a37;
  --color-heading: #182039;
  --color-muted: #756d68;
  --color-night: #182039;
  --color-accent: #ff6b4a;
  --color-accent-dark: #d94a2c;
  --color-line: #55c982;
  --color-line-dark: #247a49;
  --color-border: #eadfd5;
  --color-gold: #d7aa66;
  --shadow-paper: 0 30px 90px rgb(75 54 41 / 14%);
  --shadow-card: 0 16px 42px rgb(75 54 41 / 9%);
  --content-width: 1080px;
  --reading-width: 920px;
  --font-display: "Noto Serif TC", "Songti TC", "PMingLiU", serif;
  --font-sans: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
  --night-soft: var(--color-night);
  --starlight: var(--color-accent);
  --cream: var(--color-paper);
  --ink: var(--color-text);
}
```

Add or replace the global canvas and heading rules:

```css
body {
  margin: 0;
  background: var(--color-canvas);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: clamp(18px, 1.25vw, 20px);
  line-height: 1.8;
}

h1,
h2,
h3 {
  margin-top: 0;
  color: var(--color-heading);
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.01em;
  text-wrap: balance;
}

.book-page {
  width: min(calc(100% - 40px), 1080px);
  margin: 28px auto 56px;
  overflow: clip;
  border: 1px solid rgb(215 190 171 / 45%);
  border-radius: 36px;
  background: var(--color-paper);
  box-shadow: var(--shadow-paper);
}
```

- [ ] **Step 4: Implement the cohesive cover hero**

Replace the existing hero-specific layout with:

```css
.hero-section {
  width: auto;
  min-height: 610px;
  margin: 20px;
  padding: clamp(32px, 6vw, 72px);
  overflow: hidden;
  border-radius: 32px;
  background: linear-gradient(135deg, var(--color-night), #30345d);
}

.hero-section .story-copy {
  position: relative;
  z-index: 1;
  color: #fff;
}

.hero-section h1 {
  color: #fff;
}

.hero-section .eyebrow {
  color: #ffc0a9;
}

.hero-section .accent {
  color: #ffc0a9;
}

.hero-section .story-media {
  min-height: 100%;
  align-self: stretch;
  border: 1px solid rgb(255 255 255 / 24%);
  box-shadow: 0 28px 70px rgb(0 0 0 / 30%);
}

.hero-section .story-media img {
  height: 100%;
  object-fit: cover;
}
```

Retain the existing hero two-column grid at desktop and all public CTA href values.

- [ ] **Step 5: Run focused and full tests**

Run:

```powershell
node --test tests/site-styles.test.mjs
node --test
```

Expected: all tests pass; image-ratio, copy, link, focus, and privacy tests remain green.

- [ ] **Step 6: Commit Task 2**

```powershell
git add styles.css tests/site-styles.test.mjs
git commit -m "feat: establish premium book canvas and cover"
```

---

### Task 3: Connect chapters and strengthen conversion anchors

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `styles.css:140-381`

**Interfaces:**
- Consumes: `data-chapter`, `.story-section`, `.price-section`, `.comparison-section`, `.testimonial-section`, `.closing-section`.
- Produces: one continuous chapter rhythm plus visually distinct price, comparison, testimonial, and closing anchors.

- [ ] **Step 1: Write failing chapter and anchor tests**

Append to `tests/site-styles.test.mjs`:

```js
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
```

- [ ] **Step 2: Run style tests and verify RED**

Run:

```powershell
node --test tests/site-styles.test.mjs
```

Expected: failures for chapter pseudo-elements, restrained reading width, anchor backgrounds, and shared shadows.

- [ ] **Step 3: Implement the connected chapter rhythm**

Replace the free-standing story spacing with:

```css
.story-section {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.9fr);
  gap: clamp(28px, 5vw, 64px);
  align-items: center;
}

.story-section[data-chapter] {
  width: min(calc(100% - 64px), var(--reading-width));
  margin: 0 auto;
  padding: clamp(64px, 8vw, 96px) 0;
  border-top: 1px solid var(--color-border);
}

[data-chapter]::before {
  content: attr(data-chapter);
  position: absolute;
  top: 30px;
  left: 0;
  color: var(--color-gold);
  font-family: var(--font-display);
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 700;
  line-height: 1;
  opacity: 0.75;
}

.story-media {
  overflow: hidden;
  border: 1px solid rgb(215 190 171 / 42%);
  border-radius: 24px;
  background: #fff;
  box-shadow: var(--shadow-card);
}
```

Keep `.process-media { aspect-ratio: 3 / 4; }`, `.process-media img { object-fit: contain; }`, and `.closing-media img { height: auto; }` intact.

- [ ] **Step 4: Implement the four visual anchors**

Use these section contracts, merging existing table and list details beneath them:

```css
.price-section,
.comparison-section,
.testimonial-section,
.closing-section {
  width: min(calc(100% - 64px), var(--reading-width));
  margin: 0 auto;
}

.price-section {
  padding: 36px 0 76px;
}

.price-card {
  padding: clamp(36px, 6vw, 68px);
  border: 0;
  border-radius: 28px;
  background: linear-gradient(135deg, var(--color-night), #353861);
  color: rgb(255 255 255 / 84%);
  box-shadow: 0 24px 60px rgb(24 32 57 / 25%);
}

.price-card h2,
.price-card .price {
  color: #fff;
}

.comparison-section {
  padding: clamp(48px, 7vw, 76px);
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background: #fff;
  box-shadow: var(--shadow-card);
}

.testimonial-section {
  padding: clamp(64px, 8vw, 92px) 0;
}

.testimonial-list {
  padding: clamp(24px, 4vw, 40px);
  border-radius: 28px;
  background: #f6eee7;
}

.closing-section {
  margin-bottom: 32px;
  padding: clamp(24px, 5vw, 48px);
  border-radius: 32px;
  background: var(--color-night);
  color: rgb(255 255 255 / 84%);
}

.closing-section h2,
.closing-section .eyebrow,
.closing-section .closing-quote {
  color: #fff;
}
```

Do not add new pricing copy, urgency claims, offer cards, or buttons.

- [ ] **Step 5: Run focused and full tests**

Run:

```powershell
node --test tests/site-styles.test.mjs
node --test
```

Expected: all tests pass and the existing natural-ratio image tests remain green.

- [ ] **Step 6: Commit Task 3**

```powershell
git add styles.css tests/site-styles.test.mjs
git commit -m "feat: connect book chapters and conversion anchors"
```

---

### Task 4: Lock responsive focus and accessibility

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `tests/site-accessibility.test.mjs`
- Modify: `styles.css:382-520`

**Interfaces:**
- Consumes: all Task 2 and Task 3 selectors.
- Produces: the final `1024px`, `768px`, and `420px` layout rules plus focus/reduced-motion guarantees.

- [ ] **Step 1: Write failing responsive-contract tests**

Append to `tests/site-styles.test.mjs`:

```js
test('keeps the premium book focused and touch friendly at mobile widths', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /@media\s*\(max-width:\s*1024px\)/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /@media\s*\(max-width:\s*420px\)/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.book-page\s*\{[^}]*width:\s*100%[^}]*border-radius:\s*0/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.story-section\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.story-section-reverse \.story-copy\s*\{[^}]*order:\s*1/s);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.story-section-reverse \.story-media\s*\{[^}]*order:\s*2/s);
  assert.match(css, /\.button\s*\{[^}]*min-height:\s*52px/s);
  assert.match(css, /\.table-wrap\s*\{[^}]*overflow-x:\s*auto/s);
  assert.doesNotMatch(css, /position:\s*fixed[^}]*bottom:/s);
});
```

Extend `keeps current story components and keyboard focus legible` in `tests/site-accessibility.test.mjs` with live premium-book selectors:

```js
assert.match(css, /\.book-page\s*\{/);
assert.match(css, /\.story-section\[data-chapter\]\s*\{/);
assert.match(css, /\.closing-section h2\s*,/);
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```powershell
node --test tests/site-styles.test.mjs tests/site-accessibility.test.mjs
```

Expected: failures until the premium-book breakpoint rules and live-selector assertions are present.

- [ ] **Step 3: Implement tablet and mobile rules**

Add these contracts, reconciling them with existing breakpoint rules rather than duplicating selectors:

```css
@media (max-width: 1024px) {
  .book-page {
    width: min(calc(100% - 28px), 960px);
  }

  .hero-section,
  .story-section[data-chapter],
  .price-section,
  .comparison-section,
  .testimonial-section,
  .closing-section {
    width: min(calc(100% - 48px), var(--reading-width));
  }
}

@media (max-width: 768px) {
  body {
    background: var(--color-paper);
  }

  .book-page {
    width: 100%;
    margin: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .hero-section {
    min-height: 0;
    margin: 12px;
    padding: 28px 22px;
    border-radius: 24px;
  }

  .story-section {
    grid-template-columns: 1fr;
  }

  .story-section[data-chapter],
  .price-section,
  .comparison-section,
  .testimonial-section,
  .closing-section {
    width: calc(100% - 32px);
  }

  .story-section-reverse .story-copy {
    order: 1;
  }

  .story-section-reverse .story-media {
    order: 2;
  }

  .comparison-section {
    padding: 32px 20px;
  }
}

@media (max-width: 420px) {
  .button-row {
    align-items: stretch;
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
```

Keep the existing `.button { min-height: 52px; }`, `.table-wrap { overflow-x: auto; }`, focus-visible rules, and reduced-motion block.

- [ ] **Step 4: Run focused and full tests**

Run:

```powershell
node --test tests/site-styles.test.mjs tests/site-accessibility.test.mjs
node --test
git diff --check
```

Expected: all tests pass, `git diff --check` prints no errors, and no fixed mobile CTA exists.

- [ ] **Step 5: Commit Task 4**

```powershell
git add styles.css tests/site-styles.test.mjs tests/site-accessibility.test.mjs
git commit -m "fix: focus premium book layout across breakpoints"
```

---

### Task 5: Browser QA, privacy verification, and GitHub Pages delivery

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `assets/images/*.webp`
- Verify: `.github/workflows/pages.yml`
- Modify only if verification reveals a reproducible defect: the smallest relevant production file and focused regression test.

**Interfaces:**
- Consumes: the complete static site from Tasks 1–4.
- Produces: reviewed commits on `main`, a successful Pages deployment, and verified production behavior at `https://yangjetw.github.io/star-guide/`.

- [ ] **Step 1: Run a fresh automated verification gate**

Run:

```powershell
node --test
git diff --check
git status --short
```

Expected: every test passes, diff check is silent, and the task branch has no uncommitted files.

- [ ] **Step 2: Verify the privacy and public-link boundary**

Run a literal search that must return zero production matches for the private form ID:

```powershell
$privateId = '1FAIpQLSevM95Op1gL8g8iZqnEKVR5u9s_NSyIo7mgHKp5KTxtpRFABA'
Select-String -LiteralPath 'index.html','styles.css' -SimpleMatch $privateId
```

Then verify `index.html` contains only the approved LINE and payment-report destinations. Expected: private scan has zero matches; all public hrefs match the Global Constraints exactly.

- [ ] **Step 3: Start the local static preview**

Run from the repository root in a retained local process:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Expected: `http://127.0.0.1:4173/` serves `index.html`, `styles.css`, and all eight WebP assets with successful responses.

- [ ] **Step 4: Verify the five-width browser matrix**

At `360`, `390`, `768`, `1024`, and `1440` CSS pixels, record these checks:

- document `scrollWidth` equals `clientWidth`;
- body computed font size is at least `18px`;
- every `.button` is at least `48px` high;
- all 11 sections appear in the approved order;
- the page reads as one centered paper at desktop widths;
- mobile story sections use one column and reverse sections show copy before media;
- all eight images have non-zero natural dimensions after scrolling;
- `process-wonder.webp` displays at `3 / 4` without cropping;
- `closing-cosmos-family.webp` preserves its natural ratio;
- the comparison table scrolls only inside `.table-wrap`;
- console error logs are empty.

Expected: every check passes at every width. If any check fails, add one focused failing regression test before the minimal fix, rerun the matrix, and commit the fix separately.

- [ ] **Step 5: Verify navigation without submitting forms**

Check the internal hero anchor, LINE CTA, and public payment-report CTA. Confirm external links use `target="_blank" rel="noopener noreferrer"`. Do not submit the Google Form.

Expected: the internal anchor reaches `#unique-child`; LINE and the payment-report form resolve to their approved public destinations.

- [ ] **Step 6: Review the complete branch before integration**

Request a read-only final review of the base-to-head diff against:

- `docs/superpowers/specs/2026-07-21-premium-book-refinement-design.md`;
- this implementation plan;
- all Global Constraints;
- the browser matrix evidence.

Expected: no unresolved Critical or Important findings. Fix all such findings with focused tests and request re-review.

- [ ] **Step 7: Merge, push, and verify Pages**

After the final review passes, merge the feature branch into `main`, rerun `node --test` on the merged result, push `main`, and wait for `.github/workflows/pages.yml` to finish successfully.

Expected: local `main`, remote `main`, and the successful Pages run all point to the same commit.

- [ ] **Step 8: Verify the production URL and clean temporary resources**

Open `https://yangjetw.github.io/star-guide/` at `390px`, verify the hero, all eight images, chapter rhythm, both `NT$3980` occurrences, final CTAs, zero overflow, and zero console errors. Stop only the preview server created in Step 3, then clean the workflow-owned worktree according to `superpowers:finishing-a-development-branch`.

Expected: production matches the approved premium-book design and the repository returns to a clean `main` checkout.
