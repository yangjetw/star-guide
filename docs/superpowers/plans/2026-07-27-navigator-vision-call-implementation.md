# Navigator Vision Call Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the navigator page as a concise vision call with a family-growth path, a navigator-growth path, and a direct invitation to join the interest list.

**Architecture:** Keep the existing static route, navigation, footer, form destination, responsive layout, and visual classes. Replace only navigator-specific metadata and body copy, then update exact-copy tests so the page remains short and does not publish unconfirmed curriculum or commercial claims.

**Tech Stack:** Static HTML5, CSS, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- The public page uses five short sections only: hero, worldview, learning paths, invitation, and role boundary.
- The first screen communicates the vision, not a course, qualification, or application.
- The page links child understanding, family well-being, and a less violent, more peaceful society without guaranteeing outcomes.
- The family-growth path has complete value even when the learner does not become a navigator.
- The navigator path requires ongoing learning, practice, reflection, correction, and responsibility.
- Do not publish the four-stage curriculum, prices, certification, income, career, or cooperation promises.
- Keep `https://forms.gle/GsUYYrCTFfHkA6RE8` as the only navigator interest destination.
- Keep the medical, psychological, developmental-screening, educational-diagnosis, labeling, and parental-decision boundaries.
- Do not redesign unrelated routes or the global visual system.

---

### Task 1: Encode the concise vision and invitation contract

**Files:**
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `navigator.html` and `navigatorFormUrl`.
- Produces: Exact-copy tests for the five-section vision call and approved form destination.

- [ ] **Step 1: Replace the old navigator growth and role-copy assertions**

Update `tests/site-marketplace.test.mjs` so the navigator tests require:

```js
for (const phrase of [
  '讓理解走進更多家庭',
  '我們想改變的，不只是一段親子關係',
  '身邊幾個重要的人，就是我們的全世界',
  '社會便少一分暴戾，多一分安康與和諧',
  '願景要成真，理解就必須被學習',
  '先為自己的家庭而學',
  '願意走得更遠',
  '這條路還在形成，方向已經很清楚',
  '加入導航者同行名單',
]) assert.ok(html.includes(phrase), `${phrase} must appear on the navigator page`);
```

Keep assertions for the approved form URL and external-link safety. Change the primary-button text assertion from `填寫導航者申請表` to `加入導航者同行名單`. Assert that the page does not contain `四階`, `NT$`, `認證`, `收入`, `保證`, `填寫導航者申請表`, or `申請了解導航者計畫`.

- [ ] **Step 2: Update the navigator metadata assertion**

In `tests/site-content.test.mjs`, require:

```html
<meta name="description" content="從理解孩子開始，讓個人幸福、家庭幸福與社會和諧在日常關係中發生；加入導航者同行名單，一起學習、實踐並把理解帶進更多家庭。">
```

Keep the existing title assertion.

- [ ] **Step 3: Run focused tests to verify RED**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs tests/site-content.test.mjs
```

Expected: FAIL because `navigator.html` still contains the old application-oriented copy.

### Task 2: Rewrite the navigator page without redesigning it

**Files:**
- Modify: `navigator.html`

**Interfaces:**
- Consumes: Existing `.navigator-hero`, `.navigator-growth`, `.role-contrast`, `.role-cards`, `.navigator-apply`, and `.navigator-boundary` styles.
- Produces: A five-section static vision call with the approved Google Form link.

- [ ] **Step 1: Replace metadata and page-specific body copy**

Keep the site navigation and footer unchanged. Replace the navigator page body with five semantic sections:

1. Hero: `讓理解走進更多家庭` and `我們想改變的，不只是一段親子關係`.
2. Worldview: `身邊幾個重要的人，就是我們的全世界`, linking child understanding, family repair, and social harmony in one paragraph.
3. Learning paths: `願景要成真，理解就必須被學習`, followed by two cards named `先為自己的家庭而學` and `願意走得更遠`.
4. Invitation: `這條路還在形成，方向已經很清楚`, ending with the button `加入導航者同行名單`.
5. Boundary: one short paragraph preserving the approved service limits.

Use the existing classes and IDs; do not add CSS unless visual verification exposes a real defect.

- [ ] **Step 2: Run focused tests to verify GREEN**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs tests/site-content.test.mjs
```

Expected: all focused tests pass.

- [ ] **Step 3: Commit the content change**

```powershell
git add navigator.html tests/site-marketplace.test.mjs tests/site-content.test.mjs docs/superpowers/specs/2026-07-27-navigator-vision-call-design.md docs/superpowers/plans/2026-07-27-navigator-vision-call-implementation.md
git commit -m "ux: recast navigator page as vision call"
```

### Task 3: Verify and publish

**Files:**
- Modify only if verification reveals a defect.
- Update after successful deployment: `../網站現況與技術.md`, `../../00_交接/新對話交接.md`, `../../06_待辦/下一步.md`, `../../00_系統管理/異動日誌.md`

**Interfaces:**
- Consumes: Completed static page and test suite.
- Produces: A deployed GitHub Pages version and synchronized Obsidian status records.

- [ ] **Step 1: Run full verification**

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
git diff --check
```

Expected: all tests pass and `git diff --check` exits 0.

- [ ] **Step 2: Inspect desktop and mobile**

Serve the repository locally and inspect `navigator.html` at desktop and phone widths. Confirm readable type, five short sections, no clipped copy, no horizontal scroll, and a working interest-list button.

- [ ] **Step 3: Push and verify deployment**

```powershell
git push origin main
gh run list --repo yangjetw/star-guide --branch main --limit 1
```

Wait for the matching `Deploy GitHub Pages` run to complete successfully. Fetch `https://yangjetw.github.io/star-guide/navigator.html` with a cache-busting query and confirm the new hero, worldview, two learning paths, interest-list label, and service boundary.

- [ ] **Step 4: Synchronize current records**

Record the deployed commit, passing test count, and Pages result in the current website status, handoff, next-step list, and global change log. Do not rewrite the 22 imported planning documents.
