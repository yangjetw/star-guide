# Redemption Code Prefix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the public static site and its regression tests to use `STAR-YYYY-XXXX` for paid orders and `GIFT-YYYY-XXXX` for brand-issued gifts.

**Architecture:** Keep the existing four-page static site and shared redemption flow. Change only public copy, examples, documentation, and static acceptance tests; no form, generator, spreadsheet, or payment automation is added to this repository.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Paid orders, including customer-to-friend transfers, use `STAR-YYYY-XXXX`.
- Free brand-issued gifts use `GIFT-YYYY-XXXX`.
- `YYYY` is the four-digit issue year.
- `XXXX` is four uppercase alphanumeric characters excluding `I`, `O`, `0`, and `1`.
- Both prefixes use the same redemption form and receive the same service.
- The production site must not expose the redemption-form URL or a live redemption code.
- `TEST-`, `PGG-`, and all unapproved prefixes remain forbidden.
- The site remains dependency-free and deploys through the existing GitHub Pages workflow.

---

## File Structure

- `gift.html`: Explain both issuance sources and show non-live examples for both formats.
- `refund.html`: Describe code handling without assuming every code came from a purchase.
- `README.md`: Describe the shared redemption boundary for purchased and brand-issued codes.
- `docs/superpowers/specs/2026-07-24-gift-market-pilot-design.md`: Remove the superseded single-prefix rule and reference the approved prefix design.
- `tests/site-marketplace.test.mjs`: Enforce the two formats, source classification, shared service, and forbidden prefixes.
- `tests/site-styles.test.mjs`: Protect the visible gift-card example hook without hard-coding the retired format.

### Task 1: Lock the approved code formats in failing acceptance tests

**Files:**
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `tests/site-styles.test.mjs`

**Interfaces:**
- Consumes: Public HTML files loaded by the existing Node test helpers.
- Produces: Regression assertions for `STAR-YYYY-XXXX` and `GIFT-YYYY-XXXX`.

- [ ] **Step 1: Replace the retired format assertion with the approved patterns**

Add assertions equivalent to:

```js
assert.match(gift, /STAR-2026-[A-HJ-NP-Z2-9]{4}/);
assert.match(gift, /GIFT-2026-[A-HJ-NP-Z2-9]{4}/);
assert.doesNotMatch(corpus, /\b(?:TEST|PGG)-/);
assert.doesNotMatch(corpus, /\bSTAR-[A-Z0-9]{4}-[A-Z0-9]{4}\b/);
```

- [ ] **Step 2: Add source and shared-flow assertions**

Require visible copy that states:

```js
for (const text of [
  '顧客購買後自用或轉送',
  '品牌主動贈送',
  '使用同一份兌換流程',
  '取得有效兌換碼後，即可進入專屬申請流程',
]) {
  assert.match(corpus, new RegExp(text));
}
```

- [ ] **Step 3: Update the style-hook test**

Keep the `.gift-card-preview` hook assertion, but require both approved example prefixes instead of `STAR-7K4P-9Q2D`.

- [ ] **Step 4: Run the focused tests and verify RED**

Run:

```powershell
node --test tests/site-marketplace.test.mjs tests/site-styles.test.mjs
```

Expected: FAIL because the current site still publishes `STAR-7K4P-9Q2D` and does not explain `GIFT`.

- [ ] **Step 5: Commit the failing tests**

```powershell
git add tests/site-marketplace.test.mjs tests/site-styles.test.mjs
git commit -m "test: define STAR and GIFT redemption formats"
```

### Task 2: Update public copy and superseded documentation

**Files:**
- Modify: `gift.html`
- Modify: `refund.html`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-07-24-gift-market-pilot-design.md`

**Interfaces:**
- Consumes: The acceptance rules introduced in Task 1.
- Produces: Publicly accurate source classification and non-live code examples.

- [ ] **Step 1: Update the gift contents and example block**

Replace the single-format delivery line with:

```html
<li>正式訂單使用 <strong>STAR-年份-XXXX</strong>；品牌主動贈送使用 <strong>GIFT-年份-XXXX</strong>。</li>
<li>顧客購買後自用或轉送，都屬於正式營運的 STAR 代碼。</li>
<li>兩種代碼使用同一份兌換流程，並享有相同的指南製作與客服服務。</li>
```

Use clearly non-live examples:

```html
<p class="gift-card-preview">
  格式示例：<strong>STAR-2026-A7K9</strong>／<strong>GIFT-2026-M8Q3</strong>。
</p>
```

- [ ] **Step 2: Make the redemption instruction source-neutral**

Add this sentence to the visible gift or policy flow:

```html
<p>取得有效兌換碼後，即可進入專屬申請流程。</p>
```

Update `refund.html` so code security applies to every holder, not only a purchaser:

```html
<p>兌換碼不可公開或重複使用，請由代碼持有人妥善保存；需要協助時可聯絡客服查詢。</p>
```

- [ ] **Step 3: Correct the repository documentation**

In `README.md`, replace “購買後的兌換流程” with wording that covers valid `STAR` and `GIFT` holders. In the earlier gift-market design, remove `STAR-XXXX-XXXX` and the “same STAR format” rule, then state that the prefix rules are defined by `2026-07-24-redemption-code-prefix-design.md`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run:

```powershell
node --test tests/site-marketplace.test.mjs tests/site-styles.test.mjs
```

Expected: all focused tests PASS.

- [ ] **Step 5: Run the full verification**

Run:

```powershell
node --test
git diff --check
rg -n "\b(?:TEST|PGG)-|STAR-[A-Z0-9]{4}-[A-Z0-9]{4}" index.html gift.html navigator.html refund.html README.md
```

Expected: all tests PASS, `git diff --check` returns no errors, and the retired/forbidden-code scan returns no matches.

- [ ] **Step 6: Commit the implementation**

```powershell
git add gift.html refund.html README.md docs/superpowers/specs/2026-07-24-gift-market-pilot-design.md
git commit -m "feat: distinguish paid and brand gift codes"
```

### Task 3: Review, publish, and verify production

**Files:**
- Verify: `.github/workflows/pages.yml`
- Verify: `index.html`
- Verify: `gift.html`
- Verify: `navigator.html`
- Verify: `refund.html`

**Interfaces:**
- Consumes: The completed static-site commits from Tasks 1 and 2.
- Produces: A deployed GitHub Pages site at `https://yangjetw.github.io/star-guide/`.

- [ ] **Step 1: Request a read-only code review**

Review the full implementation against:

- `docs/superpowers/specs/2026-07-24-redemption-code-prefix-design.md`
- this implementation plan

Require no Critical or Important findings before publishing.

- [ ] **Step 2: Run browser QA locally**

At 1440px, 390px, and 320px verify:

- `gift.html` displays both example formats.
- No horizontal overflow occurs.
- Body text remains at least 18px.
- Buttons remain at least 52px high.
- No browser console errors occur.

- [ ] **Step 3: Push `main`**

```powershell
git push origin main
```

Expected: GitHub accepts the new commits without a force push.

- [ ] **Step 4: Verify GitHub Pages deployment**

Confirm the `Deploy GitHub Pages` workflow for the new head commit finishes with `conclusion: success`.

- [ ] **Step 5: Verify production**

Open:

- `https://yangjetw.github.io/star-guide/gift.html`
- `https://yangjetw.github.io/star-guide/refund.html`

Confirm both approved formats and source-neutral redemption wording are live, with no overflow or console errors at 1440px, 390px, and 320px.
