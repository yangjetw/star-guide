# Readable Type and Prominent Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve desktop readability across the four public pages and make the shared top navigation immediately recognizable without changing content, imagery, or section order.

**Architecture:** Keep the existing static four-page architecture and shared `styles.css`. Lock the user-visible behavior with source-level contract tests, then update only shared type and navigation tokens so every page changes consistently.

**Tech Stack:** Semantic HTML5, CSS3, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Do not rewrite copy, replace images, or reorder homepage sections.
- Keep one identical static navigation structure across all four public pages.
- Use a distinct deep-navy navigation surface with a subtle divider and shadow.
- Desktop navigation height is approximately 76px; brand text is approximately 20px and functional links are 17–18px.
- Desktop body text reaches 20px; eyebrow and supporting text do not fall below 16px.
- Keep every interactive target at least 44px high.
- Keep the 375px layout free of horizontal overflow.
- Do not add JavaScript, a hamburger menu, or a new dependency.

---

### Task 1: Lock the readability and navigation contract

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: the existing `styles.css` and four public HTML files.
- Produces: a failing test contract for the new shared cache version, typography floor, navigation surface, navigation height, and touch-target size.

- [ ] **Step 1: Write the failing tests**

Add assertions that:

```js
assert.match(css, /--body-size:\s*clamp\(18px,[^;]+20px\)/);
assert.match(css, /--nav-height:\s*76px/);
assert.match(css, /--nav-link-size:\s*clamp\(17px,[^;]+18px\)/);
assert.match(css, /\.site-header\s*\{[^}]*background:\s*var\(--nav-surface\)/s);
assert.match(css, /\.site-nav a\s*\{[^}]*min-height:\s*44px/s);
```

Require all four pages to load `styles.css?v=20260725-7`.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-styles.test.mjs tests/site-content.test.mjs
```

Expected: FAIL because the current stylesheet uses cache version `20260725-6`, body size tops out at `19px`, and the navigation tokens do not exist.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add tests/site-styles.test.mjs tests/site-content.test.mjs
git commit -m "test: define readable navigation contract"
```

### Task 2: Implement the shared navigation and type scale

**Files:**
- Modify: `styles.css`
- Modify: `index.html`
- Modify: `gift.html`
- Modify: `navigator.html`
- Modify: `refund.html`

**Interfaces:**
- Consumes: the contract from Task 1.
- Produces: shared CSS tokens and the cache version `20260725-7` used by every public page.

- [ ] **Step 1: Add the navigation and typography tokens**

Add or update:

```css
--body-size: clamp(18px, 0.35vw + 17px, 20px);
--nav-height: 76px;
--nav-link-size: clamp(17px, 0.2vw + 16px, 18px);
--nav-surface: #10172d;
--nav-border: rgba(232, 190, 118, 0.28);
```

- [ ] **Step 2: Make the header a visible navigation surface**

Update `.site-header`, `.site-nav`, `.site-nav a`, the first brand link, hover/focus states, and `.nav-line` so the navigation:

- has a distinct surface, divider, and restrained shadow;
- keeps content centered within the existing maximum width;
- gives every link a 44px minimum target;
- uses the new type tokens without layout-shifting hover effects.

- [ ] **Step 3: Raise small text floors without enlarging display headings**

Update `.eyebrow`, `.fact-list p`, process numbers, table/supporting labels, footer text, and supporting-page copy so normal supporting information is 16–20px. Keep existing `h1` and `h2` caps unchanged.

- [ ] **Step 4: Preserve responsive behavior**

At `max-width: 768px`, keep the simplified navigation, use readable 16–17px labels, retain 44px touch targets, and prevent overflow. Do not reveal the desktop-only secondary links.

- [ ] **Step 5: Bump the shared stylesheet cache key**

Change all four HTML pages to:

```html
<link rel="stylesheet" href="styles.css?v=20260725-7">
```

- [ ] **Step 6: Run the focused tests and verify GREEN**

Run the same focused command from Task 1.

Expected: PASS.

- [ ] **Step 7: Commit the implementation**

```powershell
git add styles.css index.html gift.html navigator.html refund.html
git commit -m "feat: improve readability and navigation prominence"
```

### Task 3: Verify responsive behavior and publish

**Files:**
- Verify: `index.html`
- Verify: `refund.html`
- Verify: `gift.html`
- Verify: `navigator.html`
- Verify: `styles.css`

**Interfaces:**
- Consumes: the completed public pages from Task 2.
- Produces: a verified and deployed GitHub Pages revision.

- [ ] **Step 1: Run the complete automated suite**

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and `git diff --check` exits with code 0.

- [ ] **Step 2: Inspect the live local site**

Verify at 1280px desktop and in a 375px iframe:

- the navigation is immediately recognizable;
- body and supporting copy remain readable;
- no navigation link clips or wraps unexpectedly;
- no horizontal overflow appears;
- the homepage and refund page preserve their existing composition.

- [ ] **Step 3: Push the authorized `main` branch**

```powershell
git push origin main
```

- [ ] **Step 4: Verify GitHub Pages**

Wait for the matching Pages workflow to succeed, then confirm:

- public `index.html` returns HTTP 200;
- it references `styles.css?v=20260725-7`;
- public CSS contains `--nav-height: 76px`;
- the public page has no horizontal overflow at the tested desktop viewport.
