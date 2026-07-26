# LINE Self-Service and Navigator Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore official LINE as the self-service purchase channel, remove unnecessary customer-service language, and replace the navigator capability list with one concise continuous-growth concept.

**Architecture:** Keep the existing static routes and visual system. Update shared navigation/footer copy consistently across four HTML pages, isolate self-service LINE language from exception-support language, and collapse the navigator responsibility/capability sections into one semantic editorial section.

**Tech Stack:** Static HTML5, CSS, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Official LINE must be visible in every public navigation bar and footer.
- Purchase actions must describe entering LINE and completing the flow, not asking a staff member.
- Human-assistance language is reserved for refunds, data correction, payment problems, and delivery problems.
- The navigator section communicates continuous growth without listing abilities, fields, stages, or a curriculum.
- Existing accessibility, responsive, content, and deployment contracts remain passing.

---

### Task 1: Encode LINE self-service behavior

**Files:**
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-styles.test.mjs`

**Interfaces:**
- Consumes: Public HTML routes and `lineUrl`.
- Produces: Tests that distinguish self-service LINE actions from human-support exceptions.

- [ ] **Step 1: Write failing tests**

Assert that every navigation bar and footer contains `lineUrl`; homepage LINE actions use `進入官方 LINE`; gift plan buttons use `前往 LINE 選購`; the purchase reminder uses `加入 LINE 完成購買`; and ordinary purchase sections do not contain `洽詢購買`, `客服陪伴`, `有問題請詢問`, or `填寫前有疑問`.

- [ ] **Step 2: Verify RED**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs tests/site-content.test.mjs tests/site-styles.test.mjs
```

Expected: FAIL because the deployed source currently removes global LINE entry points.

- [ ] **Step 3: Implement LINE self-service language**

Modify `index.html`, `gift.html`, `navigator.html`, and `refund.html`:

- Restore the shared `官方 LINE` navigation link and footer link.
- Restore homepage LINE actions labelled `進入官方 LINE`.
- Label all three gift-plan actions `前往 LINE 選購`.
- Change the gift journey first step to `加入官方 LINE，依選單選擇方案並自行完成購買。`
- Keep the birth-time rule and add the action `加入 LINE 完成購買`.
- Keep navigator application focused on the Google form; do not add a question prompt beside it.
- Change the service-page purchase step to self-service language.

- [ ] **Step 4: Verify GREEN**

Run the focused test command from Step 2. Expected: all focused tests pass.

### Task 2: Replace the navigator capability list with a growth concept

**Files:**
- Modify: `navigator.html`
- Modify: `styles.css`
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `tests/site-styles.test.mjs`

**Interfaces:**
- Consumes: Existing `content-section` and `content-copy` layout patterns.
- Produces: One semantic section with `navigator-growth` styling.

- [ ] **Step 1: Write failing tests**

Assert that `navigator.html` contains:

```html
<p class="eyebrow">持續成長</p>
<h2 id="growth-title">看懂星盤，只是導航者的起點</h2>
<p>要陪伴更多家庭，導航者需要在每一次實踐中持續學習、持續修正，也持續成長。</p>
```

Assert that the old `capability-grid` section and its four-item `fact-list` are absent.

- [ ] **Step 2: Verify RED**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs tests/site-styles.test.mjs
```

Expected: FAIL because the old capability list remains.

- [ ] **Step 3: Implement the growth section**

Replace both the current responsibility section and capability list with:

```html
<section class="content-section navigator-growth" aria-labelledby="growth-title">
  <div class="content-copy">
    <p class="eyebrow">持續成長</p>
    <h2 id="growth-title">看懂星盤，只是導航者的起點</h2>
    <p>要陪伴更多家庭，導航者需要在每一次實踐中持續學習、持續修正，也持續成長。</p>
  </div>
</section>
```

Style `.navigator-growth` as a centered warm editorial statement with a readable maximum line length. Do not add icons, cards, numbered stages, or animation.

- [ ] **Step 4: Verify GREEN**

Run the focused tests from Step 2. Expected: all focused tests pass.

### Task 3: Verify, commit, publish, and inspect

**Files:**
- Modify only if verification reveals a defect.

**Interfaces:**
- Consumes: Completed static site changes.
- Produces: Tested `main` commit and updated GitHub Pages deployment.

- [ ] **Step 1: Run full verification**

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
git diff --check
```

Expected: all tests pass and `git diff --check` exits 0.

- [ ] **Step 2: Inspect desktop and mobile layouts**

Serve the isolated worktree locally. Confirm the global LINE entry is visible, purchase actions read as self-service, the gift reminder has no eyebrow, and the navigator growth statement is legible without overflow.

- [ ] **Step 3: Commit**

```powershell
git add index.html gift.html navigator.html refund.html styles.css tests/site-marketplace.test.mjs tests/site-content.test.mjs tests/site-styles.test.mjs
git commit -m "ux: align LINE purchase flow and navigator growth"
```

- [ ] **Step 4: Merge and push**

Fast-forward the feature branch into `main`, rerun the full suite, push `main`, and wait for the matching GitHub Pages workflow.

- [ ] **Step 5: Verify production**

Fetch all four production routes using the deployed commit as a cache key. Confirm the LINE self-service labels, absence of ordinary customer-service prompts, birth-time rule, and navigator growth copy.
