# Warm Comparison Emphasis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the dark parent quote into a warm peach callout and make the existing “本指南” comparison row the visual conclusion of the table.

**Architecture:** Keep the existing semantic HTML and one shared stylesheet. Add warm surface tokens, apply them to the existing transformation blockquote and `.our-guide` row, and bump the shared stylesheet cache key on all four public pages.

**Tech Stack:** Semantic HTML5, CSS3, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Keep all existing copy, images, table cells, `th`/`td` structure, scopes, and homepage section order.
- Reuse the existing coral `#ff7859`; large surfaces use low-saturation peach.
- The parent quote uses peach gradient, 5px coral left rail, navy text, 16px radius, and warm restrained shadow.
- The `.our-guide` row uses peach gradient, coral top/bottom separators, approximately 22px guide label, approximately 24px price, and approximately 18px supporting cells.
- Do not add a badge, promotional copy, icon, animation, JavaScript, or dependency.
- Keep the mobile table’s existing contained horizontal scrolling.
- All four public pages must use the same stylesheet cache version `20260725-8`.

---

### Task 1: Lock the warm visual contract

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `styles.css` and the four public HTML pages.
- Produces: failing assertions for the warm tokens, quote surface, featured comparison row, and shared cache key.

- [ ] **Step 1: Add failing contract assertions**

Require:

```js
assert.match(css, /--color-peach:\s*#fff0e8/);
assert.match(css, /--color-peach-deep:\s*#ffd8c8/);
assert.match(css, /\.editorial-layout--transformation blockquote\s*\{[^}]*border-left:\s*5px solid var\(--color-coral\)[^}]*background:\s*linear-gradient\([^}]*var\(--color-peach\)[^}]*color:\s*var\(--color-ink\)/s);
assert.match(css, /\.our-guide th,\s*\.our-guide td\s*\{[^}]*background:\s*linear-gradient\([^}]*var\(--color-peach\)/s);
assert.match(css, /\.our-guide th\s*\{[^}]*font-size:\s*22px/s);
assert.match(css, /\.our-guide td:nth-child\(2\)\s*\{[^}]*font-size:\s*24px[^}]*color:\s*var\(--color-coral-dark\)/s);
```

Require all four public pages to use:

```html
<link rel="stylesheet" href="styles.css?v=20260725-8">
```

- [ ] **Step 2: Verify RED**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-styles.test.mjs tests/site-content.test.mjs
```

Expected: FAIL because the warm tokens and surfaces do not exist and the pages still use `20260725-7`.

- [ ] **Step 3: Commit the failing contract**

```powershell
git add tests/site-styles.test.mjs tests/site-content.test.mjs
git commit -m "test: define warm comparison emphasis"
```

### Task 2: Implement warm quote and featured comparison row

**Files:**
- Modify: `styles.css`
- Modify: `index.html`
- Modify: `gift.html`
- Modify: `navigator.html`
- Modify: `refund.html`

**Interfaces:**
- Consumes: Task 1’s failing contract.
- Produces: shared warm visual tokens and public cache version `20260725-8`.

- [ ] **Step 1: Add warm surface tokens**

Add:

```css
--color-peach: #fff0e8;
--color-peach-deep: #ffd8c8;
--shadow-warm: 0 18px 44px rgb(217 83 57 / 12%);
```

- [ ] **Step 2: Restyle the parent quote**

Apply:

```css
.editorial-layout--transformation blockquote {
  border-left: 5px solid var(--color-coral);
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-peach), var(--color-peach-deep));
  color: var(--color-ink);
  box-shadow: var(--shadow-warm);
}
```

Keep the current typography and placement.

- [ ] **Step 3: Feature the guide row**

Use the peach gradient and coral separators across all four cells. Set `.our-guide th` to `22px`, `.our-guide td` to approximately `18px`, and the price cell to `24px` with `var(--color-coral-dark)`. Preserve all table text and semantics.

- [ ] **Step 4: Bump the cache key**

Update all four public HTML pages to `styles.css?v=20260725-8`.

- [ ] **Step 5: Verify GREEN**

Run the focused Task 1 command, then:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and the diff check is clean.

- [ ] **Step 6: Commit**

```powershell
git add styles.css index.html gift.html navigator.html refund.html
git commit -m "feat: add warm comparison emphasis"
```

### Task 3: Verify and publish

**Files:**
- Verify: `index.html`
- Verify: `styles.css`

**Interfaces:**
- Consumes: Task 2’s finished static site.
- Produces: verified public GitHub Pages output.

- [ ] **Step 1: Verify desktop**

At 1280px, confirm the quote is warm peach rather than dark navy, the guide row is the strongest table row, and the text remains readable.

- [ ] **Step 2: Verify mobile**

At 375px, confirm the page has no horizontal overflow and the comparison table scrolls only inside `.table-wrap`.

- [ ] **Step 3: Publish and confirm**

Push the authorized `main`, wait for the matching GitHub Pages workflow, and confirm the public page references `styles.css?v=20260725-8`.
