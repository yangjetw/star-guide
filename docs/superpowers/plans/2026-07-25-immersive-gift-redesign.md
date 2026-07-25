# Immersive Gift Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the static Parent Star Guide site as a polished, emotionally immersive gift landing experience while preserving the approved copy, local imagery, pricing, legal terms, and existing Google Form/LINE flow.

**Architecture:** Keep the zero-backend GitHub Pages architecture. Recompose the homepage into a fluid narrative rather than fixed 4:3 panels, introduce a shared design system in `styles.css`, and restyle the three supporting pages with the same visual language. Use semantic HTML and progressive CSS only; JavaScript is not required.

**Tech Stack:** HTML5, CSS3, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Preserve all approved visible copy and all 11 local images.
- Preserve prices, legal terms, LINE links, Google Form links, email, and redemption-code rules.
- Do not add n8n, a backend, or a payment integration.
- Do not retain fixed `800 × 600`/`4:3` page canvases.
- Support 375, 768, 1024, and 1440 pixel widths without clipping or horizontal scrolling.
- Use Noto Serif TC for display text and Noto Sans TC for body text.
- Respect `prefers-reduced-motion`.

---

### Task 1: Encode the approved redesign in tests

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-styles.test.mjs`
- Modify: `tests/site-accessibility.test.mjs`

**Step 1: Add failing structural assertions**

- Assert the homepage has the approved narrative sections and shared CTA hierarchy.
- Assert all eleven local images remain referenced and all current critical copy remains present.
- Assert legacy fixed handbook classes and `aspect-ratio: 4 / 3` are absent.
- Assert the new visual tokens, fluid layout, responsive rules, and reduced-motion rule exist.

**Step 2: Run the targeted tests and confirm RED**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/site-styles.test.mjs tests/site-accessibility.test.mjs
```

Expected: failures identify the missing immersive structure and new style system.

**Step 3: Commit the test contract**

```powershell
git add tests/site-content.test.mjs tests/site-styles.test.mjs tests/site-accessibility.test.mjs
git commit -m "test: define immersive gift experience"
```

### Task 2: Recompose the homepage narrative

**Files:**
- Modify: `index.html`
- Test: `tests/site-content.test.mjs`
- Test: `tests/site-accessibility.test.mjs`

**Step 1: Build the semantic narrative**

- Create a full-viewport starry hero with the primary emotional promise.
- Present gift promise, parent concerns, personalization, process/privacy, deliverables, transformation, testimonials, choice/value, and closing CTA in that order.
- Keep existing anchors where useful and give each section an accessible heading.
- Keep every approved text block and all eight homepage illustrations plus three testimonial screenshots.

**Step 2: Keep conversion actions accurate**

- Primary action: Google Form.
- Secondary action: LINE.
- Preserve policy/support links and clarify that the purchaser receives the redemption information and forwards it.

**Step 3: Run content and accessibility tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/site-accessibility.test.mjs
```

Expected: homepage structure and content tests pass; style-specific assertions may remain red.

**Step 4: Commit**

```powershell
git add index.html
git commit -m "feat: rebuild homepage gift narrative"
```

### Task 3: Implement the immersive visual system

**Files:**
- Modify: `styles.css`
- Test: `tests/site-styles.test.mjs`

**Step 1: Add the shared design tokens**

Implement the approved midnight, ivory, coral, jade, and gold palette; serif/sans typography; spacing scale; radius; shadow; and width constraints.

**Step 2: Style the homepage chapters**

- Full-bleed hero with image overlay and restrained star texture.
- Editorial split layouts with alternating image/text balance.
- Warm gift promise and deliverables cards.
- Compact, credible testimonial screenshot gallery.
- Clear pricing/value hierarchy and a focused final CTA.
- No fixed-height content cards or clipped text.

**Step 3: Add responsive and accessible behavior**

- Fluid type with `clamp()`.
- One-column mobile layouts and touch-friendly actions.
- Visible focus states, sufficient contrast, and reduced-motion override.
- Prevent decorative layers from intercepting interaction.

**Step 4: Run style tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-styles.test.mjs
```

Expected: all style tests pass.

**Step 5: Commit**

```powershell
git add styles.css
git commit -m "feat: add immersive editorial design system"
```

### Task 4: Align the supporting pages

**Files:**
- Modify: `gift.html`
- Modify: `navigator.html`
- Modify: `refund.html`
- Test: `tests/site-marketplace.test.mjs`
- Test: `tests/site-content.test.mjs`

**Step 1: Apply the shared shell**

- Use the same navigation, typography, spacing, CTA, footer, and responsive conventions.
- Give each page a concise starry header and readable ivory content area.

**Step 2: Preserve operational truth**

- Do not change redemption rules, code prefixes, pricing, refund wording, purchaser/recipient responsibilities, email, LINE, or Google Form destinations.

**Step 3: Run supporting-page tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs tests/site-content.test.mjs
```

Expected: all supporting-page tests pass.

**Step 4: Commit**

```powershell
git add gift.html navigator.html refund.html
git commit -m "feat: align guide pages with gift experience"
```

### Task 5: Verify visually and publish

**Files:**
- Modify if needed: `index.html`
- Modify if needed: `gift.html`
- Modify if needed: `navigator.html`
- Modify if needed: `refund.html`
- Modify if needed: `styles.css`

**Step 1: Run the complete automated suite**

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

Expected: zero failures.

**Step 2: Serve and inspect**

Start a local static server and inspect at:

- 1440 × 900 desktop
- 1280 × 720 laptop
- 768 × 1024 tablet
- 390 × 844 and 375 × 667 mobile

Check: hero readability, narrative rhythm, image crops, testimonial credibility, CTA prominence, no clipping, no horizontal overflow, and all links.

**Step 3: Correct visual defects and rerun tests**

Apply only evidence-driven spacing, crop, typography, or responsive fixes. Rerun the complete suite.

**Step 4: Commit final polish**

```powershell
git add index.html gift.html navigator.html refund.html styles.css tests
git commit -m "fix: polish responsive gift experience"
```

Skip this commit if no further files changed.

**Step 5: Push and verify GitHub Pages**

```powershell
git push origin main
```

Wait for the Pages workflow, then verify:

`https://yangjetw.github.io/star-guide/index.html`

## Plan Self-Review

- The plan covers every section and visual principle in the approved design specification.
- The implementation remains static and uses existing assets only.
- Test-first steps protect all critical business copy, links, and operational rules.
- Mobile, accessibility, reduced motion, and real-browser checks are explicit.
- No unresolved placeholders or product decisions remain.
