# Brand Site Typography and Structure Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the four-page static site as a coherent brand website with semantic, de-duplicated HTML, restrained editorial typography, reliable responsive layouts, and explicit stylesheet cache invalidation.

**Architecture:** Keep the zero-build GitHub Pages architecture. Refactor each page into semantic page-specific sections while sharing one CSS design system organized by tokens, primitives, content patterns, page compositions, and responsive rules. Automated tests enforce structural consistency and cache-version synchronization before browser verification.

**Tech Stack:** HTML5, CSS, Node.js built-in test runner, GitHub Pages, GitHub Actions.

## Global Constraints

- Preserve the existing pure-static GitHub Pages package; add no JavaScript include system, framework, or build dependency.
- Preserve the approved copy, all 11 homepage images, testimonial screenshots, LINE destination, seller disclosure, and policy content.
- Homepage chapter headings must be `36–46px` on desktop and `30–38px` on mobile; body copy must remain at least `17px`.
- Content width must not exceed `1180px`.
- Every page must reference one identical new stylesheet version, different from `20260725-5`.
- Required visual checks: `1920×1080`, `1280×800`, and `375×844`.
- No numbered badge may overlap text; no short fact item may be stretched into a large empty card.

---

### Task 1: Lock the Brand-Site Contract in Tests

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-styles.test.mjs`
- Modify: `tests/site-accessibility.test.mjs`

**Interfaces:**
- Consumes: the approved spec and current four public HTML pages.
- Produces: failing assertions for the semantic section classes, cache version, typography limits, content-density rules, and shared chrome consistency.

- [ ] **Step 1: Add failing content-structure assertions**

Add assertions that every page contains `header`, one `main`, and `footer`; homepage contains `.brand-story`; and retired generic hooks are absent from `index.html`:

```js
for (const marker of [
  'class="brand-story"',
  'class="section-shell editorial-layout',
  'class="fact-list"',
  'class="process-steps"',
  'class="proof-gallery"',
  'class="action-group"',
]) assert.match(homepage, new RegExp(marker, 'i'));

for (const retired of [
  'story-section-focus',
  'chapter-feature-list',
  'chapter-grid',
  'process-list',
  'testimonial-gallery',
]) assert.doesNotMatch(homepage, new RegExp(`\\b${retired}\\b`, 'i'));
```

- [ ] **Step 2: Add cache-version synchronization assertions**

Extract the stylesheet query from all four pages and verify a single non-retired version:

```js
const versions = pages.map((html) =>
  html.match(/styles\.css\?v=([0-9-]+)/i)?.[1]
);
assert.equal(new Set(versions).size, 1);
assert.notEqual(versions[0], '20260725-5');
```

- [ ] **Step 3: Add CSS typography and density assertions**

Require the final CSS to define these exact limits and forbid the previous fluid chapter heading:

```js
assert.match(css, /--section-title-max:\s*46px/i);
assert.match(css, /--body-size:\s*clamp\(17px,[^,]+,\s*19px\)/i);
assert.doesNotMatch(css, /h2\s*\{[^}]*4vw/is);
assert.doesNotMatch(css, /\.fact-list[^}]*min-height/is);
assert.match(css, /@media\s*\(min-width:\s*1600px\)/i);
```

- [ ] **Step 4: Add shared chrome consistency assertions**

Normalize and compare each page’s `nav` and `footer` visible links so static duplication cannot drift:

```js
const extract = (html, tag) =>
  html.match(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, 'i'))?.[0]
    .replace(/\s+/g, ' ')
    .trim();
assert.equal(new Set(pages.map((html) => extract(html, 'nav'))).size, 1);
assert.equal(new Set(pages.map((html) => extract(html, 'footer'))).size, 1);
```

- [ ] **Step 5: Run the tests and confirm RED**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/site-styles.test.mjs tests/site-accessibility.test.mjs
```

Expected: failures for the new semantic hooks, unchanged cache version, missing type tokens, and retired classes still present.

- [ ] **Step 6: Commit the test contract**

```powershell
git add tests/site-content.test.mjs tests/site-styles.test.mjs tests/site-accessibility.test.mjs
git commit -m "test: define professional brand site contract"
```

---

### Task 2: Refactor the Homepage into Semantic Brand Chapters

**Files:**
- Modify: `index.html`
- Test: `tests/site-content.test.mjs`
- Test: `tests/site-accessibility.test.mjs`

**Interfaces:**
- Consumes: the 11 approved content chapters and all existing image paths.
- Produces: `.brand-story`, `.section-shell`, `.editorial-layout`, `.fact-list`, `.process-steps`, `.proof-gallery`, and `.action-group` for CSS composition.

- [ ] **Step 1: Replace the homepage container and generic chapter hooks**

Use:

```html
<article class="brand-story">
  <section id="concerns" class="section-shell editorial-layout editorial-layout--concerns" aria-labelledby="concerns-title">
    <div class="section-copy">
      <h2 id="concerns-title">你是否也有這些困惑？</h2>
    </div>
    <figure class="section-visual">
      <img src="assets/images/concerns-family.webp" alt="一位母親被四名表情沮喪的孩子圍繞">
    </figure>
  </section>
</article>
```

Retain all existing IDs and `aria-labelledby` relationships.

- [ ] **Step 2: Convert short claims into semantic lists**

Use unordered lists for concerns, unique values, required data, deliverables, and transformations:

```html
<ul class="fact-list fact-list--compact">
  <li>
    <h3>父母與孩子的個性橋接</h3>
    <p>翻譯彼此的差異，創造和諧親子關係</p>
  </li>
</ul>
```

Do not add empty wrappers or fixed-height cards.

- [ ] **Step 3: Convert the method into an ordered process**

Use:

```html
<ol class="process-steps">
  <li>
    <span class="step-label" aria-hidden="true">01</span>
    <p>🔍 每一份《親子成長指南》，都是從一組出生資料開始</p>
  </li>
</ol>
```

The number and text must occupy separate layout columns.

- [ ] **Step 4: Reduce repeated CTA presentation**

Keep primary actions only in the hero, gift bridge, and closing. Intermediate chapters may contain text links only when they lead to a distinct page.

- [ ] **Step 5: Rename proof and action groups**

Use:

```html
<div class="proof-gallery">
  <figure>
    <img src="assets/images/testimonial-1.jpg" alt="家長分享閱讀親子成長指南後的真實對話截圖一">
  </figure>
</div>
<div class="action-group">
  <a class="button button-line" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">加入官方 Line</a>
  <a class="button button-primary" href="gift.html">看看送禮方式</a>
</div>
```

Retain the three testimonial figures and both closing actions.

- [ ] **Step 6: Run homepage content and accessibility tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/site-accessibility.test.mjs
```

Expected: homepage structure, copy, image, link, and accessibility assertions pass; CSS assertions may remain red.

- [ ] **Step 7: Commit the homepage refactor**

```powershell
git add index.html
git commit -m "refactor: structure homepage as a brand story"
```

---

### Task 3: Clarify Supporting Page Responsibilities

**Files:**
- Modify: `gift.html`
- Modify: `navigator.html`
- Modify: `refund.html`
- Test: `tests/site-pages.test.mjs`
- Test: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: the same shared navigation/footer text and the current gift, navigator, and policy content.
- Produces: focused `.brand-page`, `.page-hero`, `.content-section`, `.fact-list`, `.process-steps`, and `.action-group` markup.

- [ ] **Step 1: Give each page a semantic page wrapper**

Use:

```html
<main id="main-content" class="brand-page brand-page--gift">
  <header class="page-hero" aria-labelledby="gift-title">
    <h1 id="gift-title">送一份真正懂孩子的祝福</h1>
  </header>
  <section class="content-section" aria-labelledby="gift-plans-title">
    <h2 id="gift-plans-title">選擇適合的祝福份數</h2>
  </section>
</main>
```

Apply `brand-page--navigator` and `brand-page--policy` to the other pages.

- [ ] **Step 2: Remove cross-page promotional repetition**

Gift retains packages, delivery, redemption, and contact. Navigator retains role, method, and boundaries. Refund retains transaction, delivery, paper invoice, refund, and contact policy. Preserve legally or operationally distinct sentences even if terminology repeats.

- [ ] **Step 3: Reuse semantic list patterns**

Replace supporting-page `.process-list` and generic `.feature-list` markup with `.process-steps` and `.fact-list` while keeping ordered versus unordered semantics.

- [ ] **Step 4: Make navigation and footer markup byte-consistent**

Copy the approved `nav` and `footer` markup from `index.html` to the three supporting pages without page-specific wording changes.

- [ ] **Step 5: Run all page/content tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-pages.test.mjs tests/site-content.test.mjs tests/site-accessibility.test.mjs
```

Expected: shared chrome, seller disclosure, operational content, and semantic structure assertions pass.

- [ ] **Step 6: Commit the supporting-page refactor**

```powershell
git add gift.html navigator.html refund.html
git commit -m "refactor: focus supporting pages by responsibility"
```

---

### Task 4: Rebuild the Shared Editorial CSS System

**Files:**
- Modify: `styles.css`
- Modify: `index.html`
- Modify: `gift.html`
- Modify: `navigator.html`
- Modify: `refund.html`
- Test: `tests/site-styles.test.mjs`

**Interfaces:**
- Consumes: semantic class hooks from Tasks 2 and 3.
- Produces: a single cascade ordered as tokens → reset/base → shared chrome → content primitives → homepage compositions → supporting pages → responsive rules.

- [ ] **Step 1: Define restrained type and spacing tokens**

Add:

```css
:root {
  --content-width: 1180px;
  --reading-width: 720px;
  --body-size: clamp(17px, 0.35vw + 16px, 19px);
  --section-title-min: 36px;
  --section-title-max: 46px;
  --item-title-size: clamp(20px, 0.3vw + 19px, 23px);
  --section-space: clamp(64px, 6vw, 92px);
}
```

- [ ] **Step 2: Implement semantic content primitives**

Create `.section-shell`, `.editorial-layout`, `.fact-list`, `.process-steps`, `.proof-gallery`, and `.action-group`. Facts must use content-driven height:

```css
.fact-list > li {
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
}
```

No `min-height` is permitted on `.fact-list` items.

- [ ] **Step 3: Give each homepage chapter an intentional composition**

Keep the hero composition. Use chapter modifiers only for image ratio/order:

```css
.editorial-layout--unique {
  grid-template-columns: minmax(360px, 0.92fr) minmax(0, 1.08fr);
}

.editorial-layout--method {
  grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.88fr);
}
```

The unique value list is one vertical list. The method is a compact 2×2 ordered grid with auto height.

- [ ] **Step 4: Style supporting pages as documents, not landing-page clones**

`.page-hero` may use the night palette but must be shorter than the homepage hero. `.content-section` uses readable document width; `.brand-page--policy` uses restrained headings and dividers rather than promotional cards.

- [ ] **Step 5: Add wide-screen containment and responsive rules**

At `min-width: 1600px`, hold body and chapter type sizes at token maxima. At `max-width: 768px`, switch all editorial layouts, fact lists, process steps, and pricing grids to one column. At `max-width: 420px`, reduce side padding without reducing body text below `17px`.

- [ ] **Step 6: Bump the stylesheet version on all pages**

Replace `styles.css?v=20260725-5` with this exact new version:

```html
<link rel="stylesheet" href="styles.css?v=20260725-6">
```

Use the exact same version on all four pages.

- [ ] **Step 7: Run style and full automated tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/*.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 8: Commit the design system**

```powershell
git add styles.css index.html gift.html navigator.html refund.html
git commit -m "feat: establish restrained editorial brand system"
```

---

### Task 5: Verify Real Rendering and Publish

**Files:**
- Modify only if verification exposes a confirmed defect.

**Interfaces:**
- Consumes: the completed static site.
- Produces: browser evidence for typography, density, image loading, mobile behavior, and the public GitHub Pages deployment.

- [ ] **Step 1: Run a clean diff and full test gate**

Run:

```powershell
git diff --check
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/*.test.mjs
```

Expected: no whitespace errors and zero test failures.

- [ ] **Step 2: Inspect `1920×1080`**

Verify the unique-value section uses a vertical three-item list, title is no larger than `46px`, body is at least `17px`, and no badge overlaps text.

- [ ] **Step 3: Inspect `1280×800`**

Measure every homepage section, confirm no horizontal overflow, load all 11 images, and verify short facts do not create empty fixed-height cards.

- [ ] **Step 4: Inspect `375×844`**

Verify one-column reading order, `30–38px` section headings, body text at least `17px`, full-width touch targets, and the comparison table’s intentional horizontal scroll.

- [ ] **Step 5: Verify all four public pages**

Open `index.html`, `gift.html`, `navigator.html`, and `refund.html`. Confirm navigation and footer consistency, distinct page responsibilities, image health, and no console-visible asset failures.

- [ ] **Step 6: Push the approved `main` branch**

```powershell
git push origin main
```

- [ ] **Step 7: Wait for GitHub Pages and verify production**

Run:

```powershell
gh run list --repo yangjetw/star-guide --limit 3
gh run watch $(gh run list --repo yangjetw/star-guide --workflow "Deploy GitHub Pages" --limit 1 --json databaseId --jq '.[0].databaseId') --repo yangjetw/star-guide --exit-status
```

Then fetch `https://yangjetw.github.io/star-guide/index.html` with a unique query string and confirm it references `styles.css?v=20260725-6`; fetch that CSS and confirm `--section-title-max: 46px`.
