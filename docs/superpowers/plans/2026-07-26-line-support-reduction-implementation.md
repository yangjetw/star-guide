# LINE Support Reduction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unnecessary LINE prompts while preserving LINE only for real purchases, bulk requests, and service exceptions.

**Architecture:** Keep the existing static HTML/CSS structure. Enforce the contact hierarchy through content tests: self-service navigation and application first, purchase contact only where checkout is not yet available, and human support only on the dedicated service page.

**Tech Stack:** Static HTML5, CSS, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Remove LINE from every public navigation bar and footer.
- Remove LINE calls to action from the homepage and navigator page.
- Remove the gift assurance eyebrow, LINE button, and customer-service promise.
- Keep LINE on gift pricing purchase buttons, the 10-plus gift request, and the dedicated service page.
- Keep all existing accessibility, responsive, content, and deployment contracts passing.

---

### Task 1: Encode the contact hierarchy

**Files:**
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-styles.test.mjs`

**Interfaces:**
- Consumes: Public HTML routes and `lineUrl`.
- Produces: Regression tests for allowed and forbidden LINE placements.

- [ ] **Step 1: Write failing tests**

Add assertions that navigation, footer, homepage action groups, navigator application callout, and gift assurance do not contain `lineUrl`; assert that gift pricing and the service page still contain it. Assert that the assurance section contains the direct birth-time rule and no `.eyebrow`.

- [ ] **Step 2: Run the focused tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs tests/site-content.test.mjs tests/site-styles.test.mjs
```

Expected: FAIL because LINE is still present in global and self-service locations.

- [ ] **Step 3: Commit tests with implementation**

Commit after Task 2 passes so the contract and HTML change remain atomic.

### Task 2: Make self-service actions direct

**Files:**
- Modify: `index.html`
- Modify: `gift.html`
- Modify: `navigator.html`
- Modify: `refund.html`
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-styles.test.mjs`

**Interfaces:**
- Consumes: Existing internal routes `gift.html`, `navigator.html`, and `refund.html`.
- Produces: Public pages with a narrow, deliberate human-support escalation path.

- [ ] **Step 1: Remove global LINE links**

Delete the `nav-line` anchor from all four headers and the official LINE anchor from all four footers.

- [ ] **Step 2: Replace homepage LINE actions**

In the hero, replace “加入官方 Line” with a primary internal link to `gift.html` labelled “送一份祝福”. In the closing action group, remove the LINE button and retain “看看送禮方式”.

- [ ] **Step 3: Simplify navigator application**

Delete the `.navigator-help` paragraph so the only action is the Google application form.

- [ ] **Step 4: Rewrite the gift assurance block**

Use this exact structure:

```html
<section class="content-section brand-callout gift-assurance" aria-labelledby="gift-assurance-title">
  <h2 id="gift-assurance-title">購買前，請先確認孩子的出生資料</h2>
  <p>孩子的出生時間必須可以確認，建議誤差不超過 30 分鐘；若無法確認，請勿購買。</p>
</section>
```

- [ ] **Step 5: Remove unnecessary eligibility escalation**

In `refund.html`, retain the direct “請勿先行購買” rule and remove the instruction to ask LINE when the birth time cannot be confirmed. Keep LINE for actual purchase flow, privacy requests, refunds, delivery problems, and the dedicated service contact block.

- [ ] **Step 6: Run focused and full tests**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs tests/site-content.test.mjs tests/site-styles.test.mjs
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
git diff --check
```

Expected: All tests pass and `git diff --check` exits 0.

- [ ] **Step 7: Commit**

```powershell
git add index.html gift.html navigator.html refund.html tests/site-marketplace.test.mjs tests/site-content.test.mjs tests/site-styles.test.mjs
git commit -m "ux: focus LINE support on necessary cases"
```

### Task 3: Publish and verify

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: The tested `main` commit.
- Produces: Updated GitHub Pages deployment.

- [ ] **Step 1: Push `main`**

```powershell
git push origin main
```

- [ ] **Step 2: Monitor GitHub Pages**

Use `gh run list` to identify the deployment for the pushed commit, then run `gh run watch <run-id> --repo yangjetw/star-guide --exit-status`.

- [ ] **Step 3: Verify production HTML**

Fetch all four production routes with a commit cache key. Confirm global navigation/footer and self-service callouts no longer contain the LINE URL, while the gift purchase controls and service page still do.
