# Gift Market Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a four-page, mobile-friendly GitHub Pages site that presents 《親子成長指南》 as a gift, exposes the seller information required for ECPay review, and avoids taking paid voucher orders before ticket-service approval.

**Architecture:** Keep the site dependency-free and static. `index.html`, `gift.html`, `navigator.html`, and `refund.html` share one `styles.css`, the existing local illustrations, a repeated semantic header/footer, and HTTPS links to LINE or Email. Node’s built-in test runner verifies content, business disclosure, links, accessibility, and responsive CSS before deployment.

**Tech Stack:** HTML5, CSS3, local WebP/JPEG assets, Node.js `node:test`, GitHub Actions, GitHub Pages.

## Global Constraints

- Public brand: `赫爾墨斯的小宇宙`.
- Legal seller: `星學會有限公司`, UBN `69708677`.
- Public service email: `astrokidsguide@gmail.com`.
- Official LINE: `https://lin.ee/gMMpzNy`.
- Prices: `NT$3,980`, `NT$7,600`, `NT$17,900`; 10+ gifts use LINE quotation.
- Every public redemption code begins with `STAR-`; never expose `TEST-` or `PGG-`.
- No n8n, webhook, payment API, invoice API, accounts, cart, CRM, or child-data collection on the site.
- Before ticket-service approval, all purchase CTAs say `洽詢購買` and go to official LINE; there is no direct payment link.
- Main text is at least `18px`; primary controls are at least `52px`; widths down to `320px` must not overflow.

---

### Task 1: Define the gift-market acceptance tests

**Files:**
- Create: `tests/site-marketplace.test.mjs`
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-accessibility.test.mjs`

**Interfaces:**
- Consumes: UTF-8 HTML files and `styles.css` from the repository root.
- Produces: `readPage(name) -> Promise<string>`, `externalAnchors(html) -> string[]`, and acceptance tests used by all later tasks.

- [ ] **Step 1: Write the failing multi-page and seller-disclosure tests**

Create `tests/site-marketplace.test.mjs` with Node built-ins:

```js
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'gift.html', 'navigator.html', 'refund.html'];
const lineUrl = 'https://lin.ee/gMMpzNy';
const sellerFacts = ['星學會有限公司', '69708677', 'astrokidsguide@gmail.com'];

const readPage = (name) => readFile(new URL(name, root), 'utf8');

test('publishes four semantic pages with consistent seller disclosure', async () => {
  for (const page of pages) {
    assert.ok(existsSync(new URL(page, root)), `${page} must exist`);
    const html = await readPage(page);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
    assert.match(html, /<main\b[^>]*id="main-content"/i);
    assert.match(html, /<footer\b/i);
    for (const fact of sellerFacts) assert.ok(html.includes(fact), `${page} must include ${fact}`);
    assert.ok(html.includes(lineUrl));
  }
});

test('publishes the approved gift prices and approval-safe calls to action', async () => {
  const html = await readPage('gift.html');
  for (const price of ['NT$3,980', 'NT$7,600', 'NT$17,900']) assert.ok(html.includes(price));
  assert.ok(html.includes('10 份以上'));
  assert.ok(html.includes('正式線上販售將於票券服務審核完成後開放'));
  assert.equal((html.match(/洽詢購買/g) ?? []).length >= 3, true);
  assert.doesNotMatch(html, /匯款|立即付款|LINE Bank|街口付款/i);
});

test('uses three local testimonial screenshots and STAR gift language', async () => {
  const html = await readPage('index.html');
  for (const asset of ['testimonial-1.jpg', 'testimonial-2.jpg', 'testimonial-3.jpg']) {
    assert.ok(existsSync(new URL(`assets/images/${asset}`, root)));
    assert.match(html, new RegExp(`assets/images/${asset}`));
  }
  assert.ok(html.includes('家長們的真實心聲'));
  assert.ok(html.includes('經同意分享'));
  assert.match(html, /STAR-[A-Z0-9]{4}-[A-Z0-9]{4}/);
});

test('removes retired automation and code labels from every public page', async () => {
  const corpus = (await Promise.all(pages.map(readPage))).join('\n');
  assert.doesNotMatch(corpus, /n8n|TEST-|PGG-|https:\/\/lin\.ee\/UDM1hMc/i);
});
```

- [ ] **Step 2: Replace exact-old-copy assertions with durable story-flow assertions**

In `tests/site-content.test.mjs`, keep the existing image, section-order, table semantics, and approved main-copy assertions, but replace the single-offer assertion with checks for:

```js
assert.match(html, /href="gift\.html"/);
assert.match(html, /把這份理解送給一個家庭/);
assert.doesNotMatch(html, /href="https:\/\/docs[.]google[.]com\/forms/i);
```

Remove assertions that require the former one-price card or the former plain-text testimonial quotes.

- [ ] **Step 3: Extend accessibility tests across all pages**

Update `tests/site-accessibility.test.mjs` so every external link on every page must contain:

```js
assert.match(anchor, /target=["']_blank["']/i);
assert.match(anchor, /rel=["']noopener noreferrer["']/i);
```

Also require a skip link, one `h1`, `main#main-content`, and descriptive `alt` text on each content image.

- [ ] **Step 4: Run tests and verify the new behavior fails**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

Expected: FAIL because `gift.html`, `navigator.html`, `refund.html`, and the three testimonial assets do not exist.

- [ ] **Step 5: Commit the failing tests**

```powershell
& $gitExe add -- tests
& $gitExe commit -m "test: define gift market site requirements"
```

---

### Task 2: Localize real testimonials and refocus the main guide page

**Files:**
- Create: `assets/images/testimonial-1.jpg`
- Create: `assets/images/testimonial-2.jpg`
- Create: `assets/images/testimonial-3.jpg`
- Modify: `index.html`

**Interfaces:**
- Consumes: Existing eight local illustrations and the approved Gamma testimonial image URLs.
- Produces: The trust-building main page and local testimonial assets used by `index.html`.

- [ ] **Step 1: Download the three already-approved Gamma testimonial screenshots**

Use the exact sources:

```powershell
Invoke-WebRequest 'https://cdn.gamma.app/akw6y74cp1iyxtt/b5acb6973701448187c586a6f93444e8/original/1.jpg' -OutFile 'assets/images/testimonial-1.jpg'
Invoke-WebRequest 'https://cdn.gamma.app/akw6y74cp1iyxtt/9198bc358a9f4e4791ede6d6bf8a4e9c/original/2.jpg' -OutFile 'assets/images/testimonial-2.jpg'
Invoke-WebRequest 'https://cdn.gamma.app/akw6y74cp1iyxtt/cc7ca9e0c07d449289903516fed5080f/original/3.jpg' -OutFile 'assets/images/testimonial-3.jpg'
```

Verify each file is non-empty and recognized as JPEG.

- [ ] **Step 2: Add the shared site navigation and seller footer**

Replace the old two-item header with links to:

```html
<nav class="site-nav" aria-label="主要導覽">
  <a href="index.html">指南介紹</a>
  <a href="gift.html">送一份祝福</a>
  <a href="navigator.html">導航者</a>
  <a href="refund.html">購買與退款</a>
  <a class="nav-line" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">官方 LINE</a>
</nav>
```

Use the same legal disclosure in the footer:

```html
<p><strong>赫爾墨斯的小宇宙</strong>｜星學會有限公司｜統一編號 69708677</p>
<p><a href="mailto:astrokidsguide@gmail.com" target="_blank" rel="noopener noreferrer">astrokidsguide@gmail.com</a>｜<a href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">官方 LINE</a>｜<a href="refund.html">購買與退款政策</a></p>
```

- [ ] **Step 3: Replace the direct-payment card with a gift-market bridge**

Keep the existing Gamma story sections and replace the old single-price payment CTA with:

```html
<section id="gift-bridge" class="gift-bridge" aria-labelledby="gift-bridge-title">
  <p class="eyebrow">一份能被慢慢打開的祝福</p>
  <h2 id="gift-bridge-title">把這份理解，送給一個你在乎的家庭</h2>
  <p>不是替父母決定答案，而是送他們一個理解孩子、重新靠近彼此的起點。</p>
  <a class="button button-primary" href="gift.html">看看送禮方式</a>
</section>
```

Update the closing CTA to `gift.html`, retain LINE as the secondary action, and remove the public payment-report Google Form URL.

- [ ] **Step 4: Replace text-only testimonials with the three screenshots**

Use `<figure>` elements with `loading="lazy"`, fixed width/height attributes taken from the downloaded files, and alt text such as `家長分享閱讀親子成長指南後的真實對話截圖一`.

Add:

```html
<p class="section-note">來自實際使用《親子成長指南》的家庭，經同意分享。</p>
```

- [ ] **Step 5: Run the focused tests**

Run:

```powershell
& $nodeExe --test tests/site-content.test.mjs tests/site-marketplace.test.mjs
```

Expected: testimonial and main-page assertions PASS; missing secondary pages still FAIL.

- [ ] **Step 6: Commit the main-page work**

```powershell
& $gitExe add -- index.html assets/images/testimonial-1.jpg assets/images/testimonial-2.jpg assets/images/testimonial-3.jpg tests
& $gitExe commit -m "feat: position the guide as a meaningful gift"
```

---

### Task 3: Build the gift, navigator, and policy pages

**Files:**
- Create: `gift.html`
- Create: `navigator.html`
- Create: `refund.html`

**Interfaces:**
- Consumes: Shared `styles.css`, navigation/footer contract, existing local illustrations, official LINE, and seller facts.
- Produces: Three reviewable public routes for product, course, and policy information.

- [ ] **Step 1: Create `gift.html`**

Use one `h1` and sections for gift meaning, three price cards, what is included, buyer-to-recipient steps, `STAR-7K4P-9Q2D` example, current approval notice, and contact CTA. Every plan CTA must link to `https://lin.ee/gMMpzNy` with text `洽詢購買`.

Do not include a payment form, bank account, payment QR code, or redemption-form URL.

- [ ] **Step 2: Create `navigator.html`**

Explain that this route is for adults who want to learn how to accompany families, with sections:

1. `成為能陪人看見方向的導航者`
2. `你會學習什麼`
3. `適合誰`
4. `申請方式`

The only action is `透過官方 LINE 詢問導航者計畫`. Do not state dates, limited seats, certification, employment guarantees, or prices.

- [ ] **Step 3: Create `refund.html`**

Publish seller identity, contact routes, delivery flow, no-expiry code statement, and status-based handling:

- Before payment: no order is formed.
- Paid but not issued: contact support to request cancellation.
- Gift card issued but code unused: contact support for manual review.
- Code redeemed or custom production confirmed: customized digital-content preparation has begun; refund availability is reviewed under the disclosed agreement and applicable law.
- Seller error or inability to deliver: contact support for correction, replacement, or refund.

State that invoice and ticket-performance wording will follow the finally approved service. Do not claim a guarantee provider or approval number.

- [ ] **Step 4: Run the multi-page tests**

Run:

```powershell
& $nodeExe --test tests/site-marketplace.test.mjs tests/site-accessibility.test.mjs
```

Expected: all multi-page, disclosure, link-safety, and approval-state assertions PASS.

- [ ] **Step 5: Commit the three pages**

```powershell
& $gitExe add -- gift.html navigator.html refund.html
& $gitExe commit -m "feat: add gift purchase and policy pages"
```

---

### Task 4: Create a cohesive shared responsive design

**Files:**
- Modify: `styles.css`
- Modify: `tests/site-styles.test.mjs`

**Interfaces:**
- Consumes: Classes introduced by all four pages.
- Produces: Shared visual behavior at desktop, tablet, and mobile widths.

- [ ] **Step 1: Add failing CSS assertions**

Add tests requiring `.site-nav`, `.page-shell`, `.subpage-hero`, `.pricing-grid`, `.gift-card-preview`, `.testimonial-gallery`, `.policy-section`, and responsive rules at `1024px`, `768px`, and `420px`.

Require:

```js
assert.match(css, /body\s*\{[^}]*font-size:\s*clamp\(18px,/s);
assert.match(css, /\.button\s*\{[^}]*min-height:\s*52px/s);
assert.match(css, /\.testimonial-gallery\s*\{[^}]*display:\s*grid/s);
assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.pricing-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
assert.doesNotMatch(css, /position:\s*fixed[^}]*bottom:/s);
```

- [ ] **Step 2: Run CSS tests and verify they fail**

Run:

```powershell
& $nodeExe --test tests/site-styles.test.mjs
```

Expected: FAIL because the new shared-page classes are not yet styled.

- [ ] **Step 3: Implement the shared styles**

Extend the existing premium-book design without changing the approved palette. Keep the main page concentrated inside `.book-page`; use `.page-shell` for secondary pages with the same paper, radius, border, and shadow.

Desktop price cards use three equal columns. Testimonial screenshots use `object-fit: contain` and must not crop conversation content. At `768px`, navigation wraps, story sections and all grids become one column, page corners reduce, and padding remains at least `20px`. At `420px`, primary buttons become full width and headings remain within the viewport.

- [ ] **Step 4: Run the complete test suite**

Run:

```powershell
& $nodeExe --test
```

Expected: PASS with zero failed tests and no warnings.

- [ ] **Step 5: Commit the responsive design**

```powershell
& $gitExe add -- styles.css tests/site-styles.test.mjs
& $gitExe commit -m "feat: unify responsive gift site styling"
```

---

### Task 5: Verify, review, publish, and inspect production

**Files:**
- Modify if necessary: `index.html`
- Modify if necessary: `gift.html`
- Modify if necessary: `navigator.html`
- Modify if necessary: `refund.html`
- Modify if necessary: `styles.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: Complete static site and GitHub Pages workflow.
- Produces: Verified `main` branch and production URL `https://yangjetw.github.io/star-guide/`.

- [ ] **Step 1: Update the README**

Document the four routes, local verification command, official production URL, seller disclosure, and the rule that paid ticket sales stay closed until approval.

- [ ] **Step 2: Run fresh automated verification**

Run:

```powershell
& $nodeExe --test
& $gitExe diff --check
```

Expected: all tests PASS; `git diff --check` returns no errors.

- [ ] **Step 3: Run local browser QA**

Serve the root with:

```powershell
& $pythonExe -m http.server 4173
```

Inspect all four pages at 1440px, 768px, 390px, and 320px. Confirm:

- no horizontal overflow;
- one visible `h1`;
- navigation and CTAs work;
- all 11 existing guide sections remain readable;
- all 11 local images load;
- testimonial screenshots are uncropped;
- seller facts and prices are visible;
- no direct payment entry exists;
- browser console has no errors.

- [ ] **Step 4: Request independent code and spec review**

Give the reviewer the design spec, implementation plan, `git diff`, and test output. Fix every confirmed requirement gap using a failing regression test before changing production code.

- [ ] **Step 5: Commit final corrections**

```powershell
& $gitExe add -- .
& $gitExe commit -m "docs: finalize gift market pilot site"
```

Skip this commit if there are no uncommitted changes.

- [ ] **Step 6: Push the verified main branch**

```powershell
& $gitExe push origin main
```

Expected: push succeeds and GitHub Pages workflow starts.

- [ ] **Step 7: Verify GitHub Pages production**

Wait for the workflow to complete, then open:

- `https://yangjetw.github.io/star-guide/`
- `https://yangjetw.github.io/star-guide/gift.html`
- `https://yangjetw.github.io/star-guide/navigator.html`
- `https://yangjetw.github.io/star-guide/refund.html`

Repeat the essential disclosure, price, image, link, overflow, and console checks against production rather than localhost.
