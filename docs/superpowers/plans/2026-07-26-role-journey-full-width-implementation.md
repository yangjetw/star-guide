# Role Journey Full-Width Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the redundant role-section eyebrow and extend the warm role-journey background to both browser edges without widening the card content.

**Architecture:** Keep the current HTML structure and shared CSS. Remove one paragraph, then add a desktop-only `.section-shell.role-journey` width override with responsive inline padding; mobile keeps the existing section gutter and one-column cards.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner.

## Global Constraints

- Modify only `index.html`, `styles.css`, and their focused regression tests.
- Preserve all role-card copy, links, prices, images, navigation, and other pages.
- Desktop background reaches both viewport edges; card content remains visually centered.
- Mobile remains one column with no horizontal overflow.

---

### Task 1: Add Red Regression Contracts

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-styles.test.mjs`

- [ ] Add a content assertion that `#role-journey` does not contain `<p class="eyebrow">`.
- [ ] Add a desktop CSS assertion for `@media (min-width: 769px)` containing `.section-shell.role-journey` with `width: 100%`, `max-width: none`, and responsive `padding-inline`.
- [ ] Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/site-styles.test.mjs
```

Expected: FAIL on both new contracts.

### Task 2: Implement the Focused Visual Change

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [ ] Remove:

```html
<p class="eyebrow">讓理解繼續發生</p>
```

- [ ] Add:

```css
@media (min-width: 769px) {
  .section-shell.role-journey {
    width: 100%;
    max-width: none;
    padding-inline: clamp(36px, 7.5vw, 154px);
  }
}
```

- [ ] Run the focused tests; expected PASS.
- [ ] Run the complete Node test suite; expected zero failures.
- [ ] Run `git diff --check`.
- [ ] Commit with `fix: extend the homepage role journey`.

### Task 3: Publish and Verify

- [ ] Push `main`.
- [ ] Confirm the GitHub Pages workflow succeeds for the pushed commit.
- [ ] Open the production homepage and verify the small eyebrow is absent, the warm section fills the viewport width, and the role cards remain centered.
