# Unified Page Composition Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose the homepage below the approved cover so every topic presents its complete text, supporting points, and image in one concentrated chapter that looks professionally edited and supports gift conversion.

**Architecture:** Keep the existing static HTML/CSS site and all business content. Merge each split topic pair into one semantic `<section>`, assign chapter-specific layout classes instead of one universal image/text template, and replace oversized generic spacing with a content-driven editorial system. Supporting pages remain functionally unchanged.

**Tech Stack:** HTML5, CSS3, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Keep the current cover composition unchanged except for necessary responsive corrections.
- Preserve all approved text, prices, legal terms, LINE links, and service boundaries.
- Preserve all 11 local images; crop and resize chapter images according to meaning.
- Each original topic must form one complete semantic and visual section.
- Desktop chapter height target: approximately 680–900px where content permits.
- Mobile topics remain one continuous section without forced one-screen fitting.
- Use existing Noto Serif TC and Noto Sans TC stacks.
- Keep the site pure HTML/CSS with no backend or new JavaScript.
- Validate at 375, 768, 1024, and 1440px.

---

### Task 1: Encode unified chapter composition in tests

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-styles.test.mjs`
- Modify: `tests/site-accessibility.test.mjs`

**Interfaces:**
- Consumes: Existing homepage section IDs and exact-copy fixtures.
- Produces: A regression contract for merged sections, image retention, responsive layout, and removal of split-detail page hooks.

- [ ] **Step 1: Replace the split-section structural assertions**

Require this homepage section order:

```js
[
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
  'closing',
]
```

Assert that `concerns-details`, `unique-child-details`, `required-data-details`, `deliverables-details`, `transformation-details`, and `closing-vision` no longer exist.

- [ ] **Step 2: Preserve exact topic copy through merged section fixtures**

Update `topicPages` so each topic maps to its single section:

```js
const topicPages = {
  concerns: ['concerns'],
  'unique-child': ['unique-child'],
  'required-data': ['required-data'],
  deliverables: ['deliverables'],
  transformation: ['transformation'],
  closing: ['closing'],
};
```

Keep all existing exact visible copy arrays and image assertions unchanged.

- [ ] **Step 3: Add layout contract assertions**

Assert the CSS defines:

```js
assert.match(css, /\.chapter-layout\s*\{[^}]*display:\s*grid/is);
assert.match(css, /\.chapter-concerns\s*\{[^}]*grid-template-columns:/is);
assert.match(css, /\.chapter-deliverables\s*\{[^}]*grid-template-columns:/is);
assert.match(css, /\.chapter-closing\s*\{[^}]*min-height:/is);
assert.doesNotMatch(css, /\.story-section-focus/);
assert.doesNotMatch(css, /min-height:\s*520px/);
```

Also require mobile one-column rules for `.chapter-layout`, `.chapter-grid`, and testimonial screenshots without rotation.

- [ ] **Step 4: Run targeted tests and verify RED**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/site-styles.test.mjs tests/site-accessibility.test.mjs
```

Expected: failures report the existing split sections and missing chapter-specific styles.

- [ ] **Step 5: Commit the new contract**

```powershell
git add tests/site-content.test.mjs tests/site-styles.test.mjs tests/site-accessibility.test.mjs
git commit -m "test: define unified editorial chapters"
```

### Task 2: Merge homepage topics into complete semantic chapters

**Files:**
- Modify: `index.html`
- Test: `tests/site-content.test.mjs`
- Test: `tests/site-accessibility.test.mjs`

**Interfaces:**
- Consumes: Exact approved copy and all 11 existing assets.
- Produces: Eleven top-level homepage sections with chapter-specific hooks.

- [ ] **Step 1: Keep the cover and merge the concerns chapter**

Keep `#hero` content unchanged. Replace `#concerns` plus `#concerns-details` with:

```html
<section id="concerns" class="chapter chapter-layout chapter-concerns">
  <div class="chapter-copy">
    <h2>你是否也有這些困惑？</h2>
    <div class="concern-list chapter-grid">…four existing articles…</div>
    <p class="pull-quote">不是你沒耐心，只是你沒拿到他的專屬說明書。</p>
  </div>
  <figure class="chapter-media">…concerns image…</figure>
</section>
```

- [ ] **Step 2: Merge the personalization and process chapters**

Combine `#unique-child` with its three feature articles in one chapter. Keep `#method` as one chapter, but use `chapter-copy`, `chapter-media`, and a compact ordered process list.

- [ ] **Step 3: Merge data and deliverables chapters**

Move the four data articles and privacy note into `#required-data`. Move the four deliverable articles and long-term value note into `#deliverables`, alongside `guide-preview.webp`.

- [ ] **Step 4: Merge transformation and closing chapters**

Move the three transformation articles and quotation into `#transformation`. Combine `closing-cosmos-family.webp`, the emotional headline, all closing copy, and both CTAs into `#closing`.

- [ ] **Step 5: Keep gift, comparison, and testimonials as focused chapters**

Preserve their copy and business links. Apply `chapter-gift`, `chapter-comparison`, and `chapter-testimonials` hooks. Keep all three testimonial screenshots uncropped.

- [ ] **Step 6: Update stylesheet cache version**

Change every public page to:

```html
<link rel="stylesheet" href="styles.css?v=20260725-5">
```

- [ ] **Step 7: Run content and accessibility tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/site-accessibility.test.mjs
```

Expected: exact copy, image retention, section order, headings, and external-link safety pass.

- [ ] **Step 8: Commit**

```powershell
git add index.html gift.html navigator.html refund.html
git commit -m "feat: merge homepage topics into complete chapters"
```

### Task 3: Build chapter-specific editorial layouts

**Files:**
- Modify: `styles.css`
- Test: `tests/site-styles.test.mjs`

**Interfaces:**
- Consumes: `.chapter-*`, `.chapter-copy`, `.chapter-media`, and `.chapter-grid` hooks from Task 2.
- Produces: Content-driven desktop and mobile layouts without generic oversized image rules.

- [ ] **Step 1: Remove the split-page and universal oversized rules**

Delete `.story-section-focus`, paired-detail spacing, universal `.story-media-portrait { min-height: 520px; }`, rotated media, and full-width light backgrounds that force separate screens.

- [ ] **Step 2: Add the common editorial chapter foundation**

Implement:

```css
.chapter {
  width: min(calc(100% - 64px), var(--content-width));
  margin-inline: auto;
  padding-block: clamp(72px, 8vw, 112px);
}

.chapter-layout {
  display: grid;
  align-items: center;
  gap: clamp(40px, 6vw, 84px);
}

.chapter-copy {
  min-width: 0;
}

.chapter-media {
  margin: 0;
  overflow: hidden;
  border-radius: 30px;
}
```

- [ ] **Step 3: Give each chapter an intentional ratio**

Use:

```css
.chapter-concerns { grid-template-columns: minmax(0, 1.12fr) minmax(320px, .88fr); }
.chapter-unique { grid-template-columns: minmax(320px, .9fr) minmax(0, 1.1fr); }
.chapter-method { grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr); }
.chapter-data { grid-template-columns: minmax(0, 1.18fr) minmax(280px, .82fr); }
.chapter-deliverables { grid-template-columns: minmax(300px, .82fr) minmax(0, 1.18fr); }
.chapter-transformation { grid-template-columns: minmax(320px, .9fr) minmax(0, 1.1fr); }
```

Set chapter-specific image aspect ratios and object positions rather than one universal crop.

- [ ] **Step 4: Tighten cards and type hierarchy**

Use compact internal grids, 20–28px card padding, 16–18px gaps, and section headings capped below the hero scale. Keep body line-height between 1.6 and 1.75 and readable line width.

- [ ] **Step 5: Refine evidence, comparison, gift, and closing chapters**

Keep screenshots unrotated and uncropped. Make the comparison table visually compact. Reduce the gift bridge height. Build the closing as a single overlaid composition where image, copy, and CTA share one section.

- [ ] **Step 6: Add responsive layouts**

At 768px:

```css
.chapter-layout {
  grid-template-columns: 1fr;
}

.chapter-grid {
  grid-template-columns: 1fr;
}
```

Use chapter-specific mobile ordering and image max-heights; preserve `object-fit: contain` for process, guide preview, and testimonial screenshots. Keep buttons full-width at 420px.

- [ ] **Step 7: Run style tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-styles.test.mjs
```

Expected: all editorial layout and responsive assertions pass.

- [ ] **Step 8: Commit**

```powershell
git add styles.css
git commit -m "feat: add chapter-specific editorial layouts"
```

### Task 4: Visual verification and deployment

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `styles.css`
- Modify if needed: `tests/*.test.mjs`

**Interfaces:**
- Consumes: Completed static site from Tasks 1–3.
- Produces: Verified and deployed GitHub Pages release.

- [ ] **Step 1: Run the complete suite**

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

Expected: zero failures.

- [ ] **Step 2: Measure chapter integrity in a browser**

At 1440×900 and 1280×800, inspect every homepage chapter and record:

- section height;
- text and image bounding boxes;
- page overflow;
- image loading completion.

No topic may be split into a separate detail screen. Heading-only empty space must not exceed the content it introduces.

- [ ] **Step 3: Inspect responsive screenshots**

Inspect:

- 1440×900 desktop;
- 768×1024 tablet;
- 390×844 and 375×667 mobile.

Check visual hierarchy, image crops, complete testimonial screenshots, CTA visibility, and no horizontal overflow.

- [ ] **Step 4: Apply evidence-driven polish and rerun tests**

Only adjust chapter ratios, spacing, crop positions, and type size where browser evidence shows imbalance.

- [ ] **Step 5: Commit final polish if files changed**

```powershell
git add index.html styles.css tests
git commit -m "fix: balance chapter typography and imagery"
```

- [ ] **Step 6: Push and verify Pages**

```powershell
git push origin main
```

Wait for `Deploy GitHub Pages`, then confirm the public HTML loads `styles.css?v=20260725-5`, the new chapter classes are present, and the legacy split-detail IDs are absent.

## Plan Self-Review

- Every design-spec chapter maps to an implementation task.
- The exact-copy tests remain authoritative while their section mapping changes.
- All images remain present; only presentation changes.
- Desktop one-topic composition and mobile continuous-topic behavior are both testable.
- No new backend, script, pricing, legal, or service-flow work is included.
- No placeholders or unresolved decisions remain.
