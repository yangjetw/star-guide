# Unified Handbook Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformat the homepage into consistent, viewport-contained 4:3 handbook pages while preserving its approved copy, images, links, and mobile readability.

**Architecture:** Keep the existing static HTML structure and shared stylesheet. Treat each direct homepage section as one page through a shared CSS contract, remove decorative chapter metadata, and use responsive overrides to change the fixed desktop canvas into a natural-height mobile reading flow.

**Tech Stack:** Semantic HTML5, CSS Grid, CSS custom properties, Node.js built-in test runner.

## Global Constraints

- Desktop uses 800 × 600 only as a 4:3 design ratio, not a fixed pixel size.
- A desktop handbook page must fit within the available viewport height.
- Mobile pages must reflow vertically and must not shrink text into a miniature 4:3 canvas.
- Body text remains at least 18px.
- Existing approved local images, visible copy, links, pricing, and redemption-code rules remain intact.
- Decorative `01／02` chapter numerals are removed; real sequential processes retain list numbering.

---

### Task 1: Define the handbook page layout contract

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `styles.css`

**Interfaces:**
- Consumes: Existing `.book-page > section`, `.story-section`, `.story-copy`, `.story-media`, and responsive breakpoints.
- Produces: Shared `--handbook-*` custom properties and the `.book-page > section` desktop/mobile page contract.

- [ ] **Step 1: Write failing layout tests**

Add assertions requiring a `4 / 3` desktop aspect ratio, a viewport-relative maximum height, clipped desktop overflow, a common direct-section selector, and a mobile override with `aspect-ratio: auto`, `height: auto`, and visible overflow.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/site-styles.test.mjs`

Expected: FAIL because the shared handbook page contract is not present.

- [ ] **Step 3: Implement the shared page geometry**

Add custom properties for page width, page height, and page padding. Style `.book-page > section` as a centered 4:3 page constrained by both viewport width and `100svh`, with common border, background, radius, shadow, and overflow behavior.

- [ ] **Step 4: Normalize inner layout density**

Use stable 42/58 media-copy proportions, fixed section alignment, three equal columns for three-item groups, 2 × 2 for four-item groups, and compact table/testimonial treatments that remain inside the page.

- [ ] **Step 5: Add tablet and mobile reflow**

At `max-width: 900px`, release fixed page height and aspect ratio; at `max-width: 768px`, use one column, natural image height, single-column cards, and `overflow-x: clip`.

- [ ] **Step 6: Run the focused test and verify GREEN**

Run: `node --test tests/site-styles.test.mjs`

Expected: PASS.

### Task 2: Remove decorative chapter numbering

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: Existing `data-chapter` attributes and `[data-chapter]::before` styling.
- Produces: Homepage sections with no decorative chapter-number hooks.

- [ ] **Step 1: Replace the chapter-hook test**

Require all expected homepage section IDs to remain inside `.book-page`, and assert that neither `data-chapter` nor `[data-chapter]::before` appears in published source.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/site-content.test.mjs`

Expected: FAIL because seven `data-chapter` attributes and their CSS pseudo-element still exist.

- [ ] **Step 3: Remove decorative numbering**

Delete all `data-chapter="NN"` attributes from `index.html` and remove the pseudo-element rule from `styles.css`. Keep the ordered process list unchanged.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/site-content.test.mjs`

Expected: PASS.

### Task 3: Verify desktop and mobile behavior

**Files:**
- Modify only if verification exposes a defect: `styles.css`

**Interfaces:**
- Consumes: Completed homepage page contract.
- Produces: A tested static site with no layout regression.

- [ ] **Step 1: Run the complete automated suite**

Run: `node --test`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Start the existing local preview**

Run: `python -m http.server 4173`

Expected: homepage available at `http://localhost:4173/index.html`.

- [ ] **Step 3: Check desktop presentation**

Inspect the homepage at a typical laptop viewport. Confirm each page is fully visible, title position is stable, no card escapes its page, three-card sections remain one row, and the comparison table is contained.

- [ ] **Step 4: Check mobile presentation**

Inspect at 390px and 320px widths. Confirm sections become natural-height single-column pages, text remains readable, buttons remain tappable, and no horizontal scrolling appears.

- [ ] **Step 5: Re-run the complete suite after any visual correction**

Run: `node --test`

Expected: all tests pass with zero failures.
