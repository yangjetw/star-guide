# Guide-Centered Brand Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the four-page GitHub Pages site around the complete《親子成長指南》story, remove internal operating rules from public pages, and add the 點星者／領航者／導航者 brand journey without turning the site into a cheap sales page.

**Architecture:** Keep the zero-build static HTML/CSS structure and the four existing routes. Preserve the approved homepage guide copy and local imagery, add a focused brand-role bridge near the end of the homepage, and give each supporting page one responsibility: gifting, navigator recruitment, or purchase confidence. Regression tests define the public/private information boundary, copy requirements, semantic structure, accessibility, and responsive design contract.

**Tech Stack:** Semantic HTML5, hand-authored CSS, Node.js built-in test runner (`node --test`), GitHub Pages and GitHub Actions.

## Global Constraints

- Public brand statement: `赫爾墨斯的小宇宙，由星學會運營。`
- Legal seller: `星學會有限公司`, unified business number `69708677`.
- Customer email: `astrokidsguide@gmail.com`.
- Official LINE: `https://lin.ee/gMMpzNy`.
- Public navigator application: `https://forms.gle/GsUYYrCTFfHkA6RE8`.
- Homepage guide introduction remains the primary content and retains the approved original copy, AI illustrations, guide preview, and three testimonial screenshots.
- Public HTML, metadata, and FAQ copy must not expose `STAR`, `GIFT`, brand-issued gift classifications, friend trial classifications, private redemption forms, internal filing rules, or shared redemption mechanics.
- The existing prices remain `NT$3,980`, `NT$7,600`, and `NT$17,900` for 1, 2, and 5 guides; purchases remain LINE enquiries until an approved checkout is available.
- The site remains a static GitHub Pages project with no backend, database, framework, form embed, iframe, or required JavaScript.
- Desktop body text is approximately 18–20px; mobile body text is at least 16px; targets are at least 44×44px; normal text contrast meets WCAG AA.
- Support 375px, 768px, 1024px, and 1440px without horizontal page scrolling, clipped text, or covered images.
- Do not claim medical diagnosis, therapy, guaranteed effects, confirmed certification, guaranteed employment, fixed income, unapproved delivery times, or unapproved refund promises.

---

## File Structure

- `index.html`: complete guide story, proof, purchase bridge, and final three-role brand journey.
- `gift.html`: customer-facing gift meaning, plans, recipient journey, contents, and purchase enquiry.
- `navigator.html`: navigator mission, role distinction, capability development, boundaries, and public application.
- `refund.html`: seller identity, purchase/delivery, privacy, service boundary, problem handling, and refund/contact information.
- `styles.css`: shared tokens, navigation, page shells, editorial layouts, role journey, gift journey, policy sections, responsive rules, focus, and reduced motion.
- `tests/site-marketplace.test.mjs`: seller disclosure, approved destinations, public/private boundary, plans, gift journey, navigator form, and policy trust content.
- `tests/site-content.test.mjs`: homepage story order, exact approved guide copy, role bridge, shared chrome, and image contract.
- `tests/site-accessibility.test.mjs`: landmarks, one-`h1` rule, active navigation, external link security, image alternatives, and heading order.
- `tests/site-styles.test.mjs`: readable typography, visible navigation, color tokens, role components, responsive behavior, focus, and reduced motion.
- `tests/site-deployment.test.mjs`: clean artifact routes and private redemption boundary.
- `README.md`: public routes, local verification, brand/legal facts, and explicit public/private boundary.

---

### Task 1: Enforce the Public Information Boundary and Rebuild the Gift Journey

**Files:**
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `gift.html`

**Interfaces:**
- Consumes: the approved LINE URL and prices already defined in `tests/site-marketplace.test.mjs`.
- Produces: customer-facing `.gift-journey`, `.pricing-grid`, `.gift-includes`, and `.gift-assurance` sections used by shared CSS in Task 5.

- [ ] **Step 1: Replace redemption-code approval tests with public-boundary tests**

Delete `redemptionCodeCandidates`, `approvedRedemptionCode`, the malformed-code test, and all positive assertions for STAR/GIFT. Add:

```js
const forbiddenPublicOperations = [
  /\bSTAR-/i,
  /\bGIFT-/i,
  /品牌主動贈送|品牌贈送|朋友試用|朋友體驗/,
  /同一份兌換流程|共用兌換流程|兌換碼前綴|代碼示例/,
];

test('keeps internal fulfilment rules out of every public page', async () => {
  const corpus = (await Promise.all(pages.map(readPage))).join('\n');
  for (const pattern of forbiddenPublicOperations) assert.doesNotMatch(corpus, pattern);
  assert.doesNotMatch(corpus, /<form\b|<iframe\b|<script\b/i);
});
```

Change the delivery-content expectations to:

```js
assert.match(html, /<title>送一份真正懂孩子的禮物[^<]*<\/title>/);
assert.match(html, /<h1\b[^>]*>送一份真正懂孩子的禮物<\/h1>/);
for (const item of [
  '由購買者轉送的電子禮物資訊',
  '收禮者專屬的申請指引',
  '客製 PDF 指南',
  'Email 與官方 LINE 協助',
]) assert.ok(html.includes(item), `${item} must be disclosed`);
```

Add a role and flow assertion:

```js
test('presents the purchaser as a 點星者 and explains the recipient journey', async () => {
  const html = await readPage('gift.html');
  for (const phrase of [
    '點星者',
    '你送出的不只是一份指南，而是為一個家庭點亮理解的起點。',
    '選擇送禮方案',
    '轉送電子禮物資訊',
    '收禮的父母提供製作資料',
    '取得專屬的客製指南',
  ]) assert.ok(html.includes(phrase), `${phrase} must be disclosed`);
});
```

- [ ] **Step 2: Run the marketplace tests and verify the intended failure**

Run:

```powershell
node --test tests/site-marketplace.test.mjs
```

Expected: FAIL because `gift.html` and `refund.html` still expose STAR/GIFT and `gift.html` lacks the new customer-facing journey.

- [ ] **Step 3: Replace the public gift content with the approved semantic structure**

Keep the shared header/footer and seller facts. Replace the gift page main content with these exact hooks and key phrases:

```html
<main id="main-content" class="brand-page brand-page--gift">
  <header class="page-hero gift-hero" aria-labelledby="gift-title">
    <div class="content-copy">
      <p class="eyebrow">成為點亮理解起點的人</p>
      <h1 id="gift-title">送一份真正懂孩子的禮物</h1>
      <p>你送出的不只是一份指南，而是為一個家庭點亮理解的起點。</p>
      <a class="button button-primary" href="#gift-plans">了解送禮方案</a>
    </div>
  </header>

  <section class="content-section gift-meaning" aria-labelledby="gift-meaning-title">
    <div class="content-copy">
      <p class="eyebrow">點星者</p>
      <h2 id="gift-meaning-title">有些祝福，能陪一個家庭走得更久</h2>
      <p>點星者促成理解開始；真正使用指南陪伴孩子的父母，將成為自己家庭的領航者。</p>
    </div>
  </section>

  <section id="gift-plans" class="content-section" aria-labelledby="plans-title">
    <div class="content-copy">
      <h2 id="plans-title">選擇你想送出的祝福</h2>
      <div class="pricing-grid">
        <article>
          <h3>一個家庭的祝福</h3>
          <p class="plan-count">1 份</p>
          <p class="plan-price">NT$3,980</p>
          <p>為一個重要的家庭，送出一份專屬的理解。</p>
          <a class="button button-primary" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">洽詢購買</a>
        </article>
        <article>
          <h3>兩個家庭的祝福</h3>
          <p class="plan-count">2 份</p>
          <p class="plan-price">NT$7,600</p>
          <p>把理解分別送給兩個你關心的家庭。</p>
          <a class="button button-primary" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">洽詢購買</a>
        </article>
        <article>
          <h3>讓祝福走得更遠</h3>
          <p class="plan-count">5 份</p>
          <p class="plan-price">NT$17,900</p>
          <p>讓五個家庭各自收到一份專屬指南。</p>
          <a class="button button-primary" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">洽詢購買</a>
        </article>
      </div>
      <p>10 份以上的送禮需求，請透過官方 LINE 洽詢。</p>
    </div>
  </section>

  <section class="content-section gift-includes" aria-labelledby="included-title">
    <div class="content-copy">
      <h2 id="included-title">這份禮物包含</h2>
      <ul class="fact-list">
        <li>由購買者轉送的電子禮物資訊</li>
        <li>收禮者專屬的申請指引</li>
        <li>完成資料提供後製作的客製 PDF 指南</li>
        <li>Email 與官方 LINE 協助</li>
      </ul>
    </div>
  </section>

  <section class="content-section gift-journey" aria-labelledby="gift-journey-title">
    <div class="content-copy">
      <h2 id="gift-journey-title">從送出祝福，到收到專屬指南</h2>
      <ol class="process-steps">
        <li><strong>選擇送禮方案</strong>，透過官方 LINE 洽詢購買。</li>
        <li><strong>轉送電子禮物資訊</strong>，由你親自把祝福傳給重要的人。</li>
        <li><strong>收禮的父母提供製作資料</strong>，依指引完成指南申請。</li>
        <li><strong>取得專屬的客製指南</strong>，開始更理解孩子的旅程。</li>
      </ol>
    </div>
  </section>

  <section class="content-section brand-callout gift-assurance" aria-labelledby="gift-assurance-title">
    <p class="eyebrow">安心送出</p>
    <h2 id="gift-assurance-title">每一份祝福，都有清楚的申請指引與客服陪伴</h2>
    <p>購買前若不確定孩子的出生資料是否符合製作條件，請先透過官方 LINE 詢問。</p>
    <a class="button button-line" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">洽詢購買</a>
  </section>
</main>
```

In the plan cards, retain exact quantities/prices:

```html
<p class="plan-count">1 份</p><p class="plan-price">NT$3,980</p>
<p class="plan-count">2 份</p><p class="plan-price">NT$7,600</p>
<p class="plan-count">5 份</p><p class="plan-price">NT$17,900</p>
```

Each card CTA must remain:

```html
<a class="button button-primary" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">洽詢購買</a>
```

- [ ] **Step 4: Run the marketplace tests and isolate the remaining refund failure**

Run:

```powershell
node --test tests/site-marketplace.test.mjs
```

Expected: gift-specific assertions PASS; the public-boundary test still FAILS only because `refund.html` exposes internal code classifications.

- [ ] **Step 5: Commit the gift journey**

```powershell
git add -- tests/site-marketplace.test.mjs gift.html
git commit -m "feat: present the customer-facing gift journey"
```

---

### Task 2: Turn the Policy Page into an Assurance Page

**Files:**
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `refund.html`

**Interfaces:**
- Consumes: `forbiddenPublicOperations` and seller facts introduced in Task 1.
- Produces: `.policy-list` and `.service-contact` sections styled in Task 5.

- [ ] **Step 1: Replace code-security expectations with customer-action expectations**

Replace the current refund phrase list with:

```js
test('explains purchase, delivery, privacy, paper invoices, and support without internal operations', async () => {
  const html = await readPage('refund.html');
  for (const phrase of [
    '星學會有限公司',
    '目前開立紙本統一發票',
    '客製 PDF 指南製作與交付',
    '孩子的出生資料',
    '購買前',
    '開始製作後',
    'astrokidsguide@gmail.com',
    '官方 LINE',
  ]) assert.ok(html.includes(phrase), `${phrase} must be disclosed`);
  for (const pattern of forbiddenPublicOperations) assert.doesNotMatch(html, pattern);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
node --test --test-name-pattern="purchase, delivery, privacy" tests/site-marketplace.test.mjs
```

Expected: FAIL because the current page speaks about code security instead of the customer-facing service sequence.

- [ ] **Step 3: Recompose `refund.html` around purchase confidence**

Use one `h1` and the following section headings in this order:

```html
<h1 id="policy-title">安心購買與服務說明</h1>
<h2 id="seller-title">品牌與營運資訊</h2>
<h2 id="delivery-title">從洽詢到指南交付</h2>
<h2 id="eligibility-title">購買前請先確認</h2>
<h2 id="privacy-title">資料如何使用與保護</h2>
<h2 id="handling-title">取消、退款與異常處理</h2>
<h2 id="contact-title">需要協助時，請直接聯絡我們</h2>
```

The delivery sequence must be customer-facing:

```html
<ol class="process-steps">
  <li>透過官方 LINE 洽詢方案與確認申請條件。</li>
  <li>完成購買後取得清楚的申請指引；目前開立紙本統一發票。</li>
  <li>收禮者或購買者依指引提供製作所需資料。</li>
  <li>資料確認完整後，進入客製 PDF 指南製作與交付。</li>
</ol>
```

The eligibility section must state:

```html
<p>孩子的出生時間是製作指南的必要資料，建議誤差不超過 30 分鐘。若出生時間無法確認，請勿先行購買，並透過官方 LINE 詢問。</p>
```

The handling list must distinguish:

```html
<dl class="policy-list">
  <div>
    <dt>購買前或尚未開始製作</dt>
    <dd>請立即聯絡客服，我們會依當時的付款與服務狀態確認可行的處理方式。</dd>
  </div>
  <div>
    <dt>資料已確認並開始製作後</dt>
    <dd>因指南依個別資料客製，請由客服依實際完成進度與適用規定說明後續處理。</dd>
  </div>
  <div>
    <dt>資料、檔案或交付發生問題</dt>
    <dd>請提供購買時使用的聯絡資訊，讓客服核對並協助補正或重新交付。</dd>
  </div>
</dl>
```

Use this privacy copy:

```html
<p>為製作與交付指南，我們會蒐集聯絡 Email、孩子暱稱、出生日期、出生時間、出生城市，以及申請人選擇提供的父母出生資料。這些資料用於確認申請、製作內容、交付檔案與提供客服。</p>
<p>可識別的申請與出生資料原則上保存至指南交付後 90 日，期滿刪除；依法應保存的訂單、付款與發票資料不在此限。</p>
<p>指南交付後如另行邀請參與回饋或研究，會以獨立說明及同意程序辦理；不同意不影響指南申請與交付。</p>
<p>如需查詢、更正或請求刪除適用資料，請聯絡 astrokidsguide@gmail.com 或官方 LINE。</p>
```

Do not add fixed refund promises or delivery days, and remove all internal fulfilment classifications.

- [ ] **Step 4: Run marketplace tests**

Run:

```powershell
node --test tests/site-marketplace.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the assurance page**

```powershell
git add -- tests/site-marketplace.test.mjs refund.html
git commit -m "feat: make service policies customer-facing"
```

---

### Task 3: Rebuild the Navigator Page Around Responsibility and Capability

**Files:**
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `navigator.html`

**Interfaces:**
- Consumes: approved public navigator form URL and LINE URL.
- Produces: `.role-contrast`, `.capability-grid`, `.navigator-boundary`, and `.navigator-apply` sections styled in Task 5.

- [ ] **Step 1: Add tests for the approved role distinction**

Add:

```js
test('defines 領航者 and 導航者 without unsupported professional claims', async () => {
  const html = await readPage('navigator.html');
  for (const phrase of [
    '領航者',
    '引領自己家的孩子',
    '導航者',
    '協助多位領航者',
    '陪伴一個孩子，需要理解；陪伴更多家庭，更需要方法、能力與責任。',
    '不代替家長作決定',
    '不為孩子貼標籤',
  ]) assert.ok(html.includes(phrase), `${phrase} must be disclosed`);
  assert.doesNotMatch(html, /保證就業|保證收入|專業執照|取得認證|官方認證/);
});
```

- [ ] **Step 2: Run the role test and verify it fails**

Run:

```powershell
node --test --test-name-pattern="defines 領航者" tests/site-marketplace.test.mjs
```

Expected: FAIL because the existing navigator page does not clearly define both roles and their boundaries.

- [ ] **Step 3: Replace the navigator main content**

Use:

```html
<main id="main-content" class="brand-page brand-page--navigator">
  <header class="page-hero navigator-hero" aria-labelledby="navigator-title">
    <div class="content-copy">
      <p class="eyebrow">讓理解走進更多家庭</p>
      <h1 id="navigator-title">成為陪人看見方向的導航者</h1>
      <p>陪伴一個孩子，需要理解；陪伴更多家庭，更需要方法、能力與責任。</p>
    </div>
  </header>

  <section class="content-section role-contrast" aria-labelledby="role-contrast-title">
    <div class="content-copy">
      <h2 id="role-contrast-title">領航自己的家庭，也可以幫助更多家庭</h2>
      <div class="role-cards">
        <article>
          <p class="eyebrow">領航者</p>
          <h3>引領自己家的孩子</h3>
          <p>父母或主要照顧者透過指南理解孩子，為自己的家庭作出選擇。</p>
        </article>
        <article>
          <p class="eyebrow">導航者</p>
          <h3>協助多位領航者</h3>
          <p>願意培養更多方法與能力，陪伴多個家庭找到理解與溝通的方向。</p>
        </article>
      </div>
    </div>
  </section>

  <section class="content-section" aria-labelledby="responsibility-title">
    <div class="content-copy">
      <p class="eyebrow">能力與責任</p>
      <h2 id="responsibility-title">想承擔更多責任，就要培養更多能力</h2>
      <p>導航者不是替家庭下結論，而是學習如何看見差異、翻譯資訊、保持界線，讓領航者更有能力陪伴自己的孩子。</p>
    </div>
  </section>

  <section class="content-section capability-grid" aria-labelledby="capability-title">
    <div class="content-copy">
      <h2 id="capability-title">導航者需要培養的能力</h2>
      <ul class="fact-list">
        <li><h3>理解差異</h3><p>辨識孩子與家庭不同的節奏，不套用單一模板。</p></li>
        <li><h3>翻譯資訊</h3><p>把複雜分析轉化為家長能理解、能採取行動的說法。</p></li>
        <li><h3>陪伴溝通</h3><p>協助領航者整理困惑，找到適合自己家庭的方向。</p></li>
        <li><h3>守住界線</h3><p>尊重家長的決定與孩子的獨特性，不製造依賴。</p></li>
      </ul>
    </div>
  </section>

  <section class="content-section navigator-boundary" aria-labelledby="boundary-title">
    <div class="content-copy">
      <h2 id="boundary-title">導航者的角色邊界</h2>
      <p>指南與導航者提供理解及溝通方向，不代替家長作決定，不為孩子貼標籤，也不提供醫療、心理治療或診斷。</p>
    </div>
  </section>

  <section class="content-section brand-callout navigator-apply" aria-labelledby="contact-title">
    <p class="eyebrow">如果你也想讓理解走得更遠</p>
    <h2 id="contact-title">申請了解導航者計畫</h2>
    <p>告訴我們你的經驗與期待，我們會依目前計畫內容與你聯絡。</p>
    <a class="button button-primary" href="https://forms.gle/GsUYYrCTFfHkA6RE8" target="_blank" rel="noopener noreferrer">填寫導航者申請表</a>
    <p class="navigator-help">填寫前有疑問？<a href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">聯絡官方 LINE</a></p>
  </section>
</main>
```

- [ ] **Step 4: Run the navigator and marketplace tests**

Run:

```powershell
node --test tests/site-marketplace.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the navigator journey**

```powershell
git add -- tests/site-marketplace.test.mjs navigator.html
git commit -m "feat: define the navigator brand role"
```

---

### Task 4: Preserve the Full Guide Story and Add the Brand-Role Bridge

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-accessibility.test.mjs`
- Modify: `index.html`
- Modify: `gift.html`
- Modify: `navigator.html`
- Modify: `refund.html`

**Interfaces:**
- Consumes: the existing exact-copy fixtures and section helpers in `tests/site-content.test.mjs`.
- Produces: `#role-journey`, `.role-journey`, and `.role-cards` markup styled in Task 5.

- [ ] **Step 1: Extend the homepage order contract without weakening exact guide-copy tests**

Add `role-journey` between `testimonials` and `closing` in the expected section ID arrays. Do not delete `expectedSectionText`, the exact comparison cells, or the existing image assertions.

Add:

```js
const brandOperatorStatement = '赫爾墨斯的小宇宙，由星學會運營。';

test('keeps the guide primary and introduces the three roles only after product proof', async () => {
  const html = await read('index.html');
  const guideStart = html.indexOf('《親子成長指南》');
  const testimonials = html.indexOf('家長們的真實心聲');
  const roles = html.indexOf('三種方式，讓理解繼續發生');
  assert.ok(guideStart >= 0 && testimonials > guideStart && roles > testimonials);
  for (const phrase of [
    '點星者',
    '領航者',
    '導航者',
    '赫爾墨斯的小宇宙，由星學會運營。',
  ]) assert.ok(html.includes(phrase), `${phrase} must appear in the role journey`);
});
```

Add an accessibility assertion for current-page navigation:

```js
test('marks the current route in shared navigation', async () => {
  for (const page of pages) {
    const html = await readPage(page);
    assert.equal((html.match(/\baria-current=["']page["']/gi) ?? []).length, 1, `${page} needs one current-page marker`);
    assert.ok(html.includes(brandOperatorStatement), `${page} needs the exact operator statement`);
  }
});
```

- [ ] **Step 2: Run content and accessibility tests and verify they fail**

Run:

```powershell
node --test tests/site-content.test.mjs tests/site-accessibility.test.mjs
```

Expected: FAIL because `#role-journey` and `aria-current="page"` are absent.

- [ ] **Step 3: Add the role journey after testimonials**

Insert this section after `#testimonials` and before `#closing`:

```html
<section id="role-journey" class="section-shell role-journey" aria-labelledby="role-journey-title">
  <div class="section-heading">
    <p class="eyebrow">讓理解繼續發生</p>
    <h2 id="role-journey-title">三種方式，讓理解繼續發生</h2>
    <p>從自己的家庭開始，也可以把理解送出去，或陪伴更多家庭找到方向。</p>
  </div>
  <div class="role-cards">
    <article>
      <p class="role-name">點星者</p>
      <h3>為一個家庭點亮起點</h3>
      <p>把一份理解孩子的機會，送給重要的人。</p>
      <a href="gift.html">了解送禮方式</a>
    </article>
    <article>
      <p class="role-name">領航者</p>
      <h3>引領自己家的孩子</h3>
      <p>使用指南理解孩子，為自己的家庭選擇適合的陪伴方式。</p>
      <a href="#deliverables">看看指南內容</a>
    </article>
    <article>
      <p class="role-name">導航者</p>
      <h3>陪伴更多家庭找到方向</h3>
      <p>培養更多方法與能力，協助多位領航者。</p>
      <a href="navigator.html">了解導航者計畫</a>
    </article>
  </div>
  <p class="brand-signature">赫爾墨斯的小宇宙，由星學會運營。</p>
</section>
```

Do not change the exact visible copy inside the existing guide sections except for the separately approved privacy/data language already covered by the current source. Preserve all original image paths and three testimonial screenshots.

- [ ] **Step 4: Mark the active navigation item on each route**

In each page’s otherwise-identical navigation, add `aria-current="page"` only to its local link:

```html
<!-- index.html -->
<a href="index.html" aria-current="page">指南介紹</a>

<!-- gift.html -->
<a href="gift.html" aria-current="page">送一份祝福</a>

<!-- navigator.html -->
<a href="navigator.html" aria-current="page">導航者</a>

<!-- refund.html -->
<a href="refund.html" aria-current="page">安心購買</a>
```

Update the shared label from `購買與退款` to `安心購買` on all four pages and update the exact shared-chrome expectation accordingly.

Use this shared footer structure on all four pages:

```html
<footer class="site-footer">
  <p><strong>赫爾墨斯的小宇宙</strong>，由星學會運營。</p>
  <p>星學會有限公司｜統一編號 69708677</p>
  <p><a href="mailto:astrokidsguide@gmail.com" target="_blank" rel="noopener noreferrer">astrokidsguide@gmail.com</a>｜<a href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">官方 LINE</a>｜<a href="refund.html">安心購買與服務說明</a></p>
</footer>
```

- [ ] **Step 5: Run content and accessibility tests**

Run:

```powershell
node --test tests/site-content.test.mjs tests/site-accessibility.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit the homepage role bridge and active navigation**

```powershell
git add -- tests/site-content.test.mjs tests/site-accessibility.test.mjs index.html gift.html navigator.html refund.html
git commit -m "feat: connect the guide to the brand role journey"
```

---

### Task 5: Consolidate the Warm Editorial Design System

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `styles.css`

**Interfaces:**
- Consumes: semantic hooks from Tasks 1–4.
- Produces: shared responsive visual treatment for all public pages.

- [ ] **Step 1: Add style-contract tests for active navigation and role components**

Add:

```js
test('makes the current navigation route unmistakable', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.site-nav a\[aria-current="page"\]\s*\{[^}]*color:\s*var\(--color-gold\)[^}]*background:/s);
  assert.match(css, /\.site-nav a\[aria-current="page"\]::after\s*\{[^}]*height:\s*3px/s);
});

test('styles role cards as a warm brand system rather than sales tiles', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.role-journey\s*\{[^}]*background:/s);
  assert.match(css, /\.role-cards\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.role-cards article\s*\{[^}]*border:\s*1px solid var\(--warm-border\)[^}]*box-shadow:/s);
  assert.doesNotMatch(css, /\.role-cards article\s*\{[^}]*transform:\s*scale/is);
});
```

Extend the responsive contract:

```js
assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.role-cards\s*\{[^}]*grid-template-columns:\s*1fr/is);
assert.match(css, /body\s*\{[^}]*overflow-x:\s*(?:clip|hidden)/is);
assert.doesNotMatch(css, /font-size:\s*(?:1[0-5]|[0-9])px/i);
```

- [ ] **Step 2: Run style tests and verify they fail**

Run:

```powershell
node --test tests/site-styles.test.mjs
```

Expected: FAIL because the role system and active navigation states are not styled.

- [ ] **Step 3: Consolidate design tokens at the top of `styles.css`**

Retain the approved existing palette and add semantic warm tokens:

```css
:root {
  --color-night: #0d142c;
  --color-night-soft: #1b2850;
  --color-ivory: #fbf5ec;
  --color-paper: #fffaf4;
  --color-ink: #1b2038;
  --color-coral: #ff7859;
  --color-coral-dark: #d95339;
  --color-coral-accessible: #c4472e;
  --color-jade: #5dcc88;
  --color-gold: #e7bf77;
  --color-peach: #fff0e8;
  --color-peach-deep: #ffd8c8;
  --warm-border: #ead8ca;
  --warm-shadow: 0 18px 44px rgb(76 46 32 / 10%);
  --body-size: clamp(18px, 0.25vw + 17px, 20px);
  --nav-height: 76px;
  --nav-link-size: clamp(17px, 0.2vw + 16px, 18px);
  --content-max: 1200px;
}
```

Remove duplicate raw color declarations when they can use these tokens. Preserve `Noto Serif TC` and `Noto Sans TC` system font stacks; do not introduce external font requests.

- [ ] **Step 4: Implement visible current-page navigation**

```css
.site-nav a[aria-current="page"] {
  position: relative;
  color: var(--color-gold);
  background: rgb(231 191 119 / 10%);
}

.site-nav a[aria-current="page"]::after {
  position: absolute;
  right: 18px;
  bottom: -1px;
  left: 18px;
  height: 3px;
  border-radius: 999px 999px 0 0;
  background: var(--color-gold);
  content: "";
}
```

Keep `.site-header` visually separated from content with its existing dark surface, border, and shadow.

- [ ] **Step 5: Add the shared role and supporting-page layouts**

```css
.role-journey {
  background:
    radial-gradient(circle at 15% 5%, rgb(255 216 200 / 60%), transparent 34rem),
    var(--color-ivory);
}

.section-heading {
  max-width: 48rem;
  margin: 0 auto 40px;
  text-align: center;
}

.role-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(18px, 2vw, 28px);
}

.role-cards article {
  padding: clamp(24px, 3vw, 38px);
  border: 1px solid var(--warm-border);
  border-radius: 28px;
  background: rgb(255 250 244 / 92%);
  box-shadow: var(--warm-shadow);
}

.role-name,
.brand-signature {
  color: var(--color-coral-accessible);
  font-family: var(--font-body);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.brand-signature {
  margin-top: 36px;
  text-align: center;
}

.gift-journey,
.gift-includes,
.role-contrast,
.capability-grid,
.navigator-boundary,
.policy-list,
.service-contact {
  border-top: 1px solid var(--warm-border);
}
```

Give the three pricing cards equal visual weight; use coral only for primary actions and price emphasis. Do not add badges, countdowns, fake scarcity, scaling hover effects, emoji icons, glassmorphism, or carousels.

- [ ] **Step 6: Finish responsive and accessibility rules**

Use:

```css
body {
  overflow-x: clip;
}

@media (max-width: 768px) {
  .role-cards,
  .pricing-grid,
  .editorial-layout,
  .fact-list {
    grid-template-columns: 1fr;
  }

  .role-cards article {
    padding: 24px;
    border-radius: 22px;
  }

  .content-section,
  .section-shell {
    padding-inline: max(20px, env(safe-area-inset-left));
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Preserve visible `:focus-visible` outlines, 44px navigation targets, 52px primary buttons, and the existing mobile rule that hides secondary navigation links instead of allowing a crowded multi-line bar.

- [ ] **Step 7: Run style tests**

Run:

```powershell
node --test tests/site-styles.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit the consolidated design system**

```powershell
git add -- tests/site-styles.test.mjs styles.css
git commit -m "style: unify the warm editorial brand system"
```

---

### Task 6: Improve Image Delivery, Documentation, and End-to-End Verification

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/site-deployment.test.mjs`
- Modify: `index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: final markup and CSS from Tasks 1–5.
- Produces: verified production-ready static source and documented public/private boundary.

- [ ] **Step 1: Add responsive-image and public-boundary regression assertions**

For the homepage editorial images, require intrinsic dimensions and responsive hints:

```js
test('reserves image space and supplies responsive sizing hints', async () => {
  const html = await read('index.html');
  for (const image of html.match(/<img\b[^>]*>/gi) ?? []) {
    assert.match(image, /\bwidth="\d+"/i);
    assert.match(image, /\bheight="\d+"/i);
  }
  for (const asset of [
    'concerns-family.webp',
    'guide-parent-child.webp',
    'process-wonder.webp',
    'required-data-family.webp',
    'deliverables-reading.webp',
  ]) {
    const tag = html.match(new RegExp(`<img\\b[^>]*src="assets/images/${asset}"[^>]*>`, 'i'))?.[0] ?? '';
    assert.match(tag, /\bsizes="/i, `${asset} needs responsive sizes`);
  }
});
```

Change the deployment-boundary test name and assertion to:

```js
test('documents the public/private fulfilment boundary', async () => {
  const readme = await readFile(new URL('README.md', root), 'utf8');
  assert.ok(readme.includes('公開網站不揭露兌換碼格式、發行分類或私人指南申請入口'));
});
```

Do not broaden the approved navigator-form exception into permission to publish the private guide redemption form.

- [ ] **Step 2: Run content and deployment tests and verify they fail**

Run:

```powershell
node --test tests/site-content.test.mjs tests/site-deployment.test.mjs
```

Expected: FAIL because current editorial images lack `sizes` and README lacks the new exact boundary statement.

- [ ] **Step 3: Add image sizing hints without changing approved assets**

For images inside two-column editorial sections, add:

```html
sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1200px) 46vw, 560px"
```

For three testimonial screenshots, retain `loading="lazy"`, existing intrinsic width/height, and use:

```html
sizes="(max-width: 768px) calc(100vw - 40px), 30vw"
```

Do not invent nonexistent `srcset` files. Retain the eager/fetch-priority treatment only for the hero image.

- [ ] **Step 4: Update README with the final route and privacy contract**

Document:

```markdown
## 公開頁面

- `/index.html`：完整《親子成長指南》介紹與品牌角色旅程。
- `/gift.html`：點星者送禮方案與收禮流程。
- `/navigator.html`：導航者角色與公開申請入口。
- `/refund.html`：安心購買、資料使用、服務與退款說明。

## 公開資訊邊界

公開網站不揭露兌換碼格式、發行分類或私人指南申請入口。導航者申請表是刻意公開的加入入口，與購買後提供的指南申請流程不同。
```

Preserve the existing local preview, `node --test`, GitHub Pages, and GitHub Actions instructions.

- [ ] **Step 5: Run the complete automated suite**

Run:

```powershell
npm test
```

Expected: all tests PASS with zero failures.

- [ ] **Step 6: Run source-boundary and formatting checks**

Run:

```powershell
rg -n "\bSTAR-|\bGIFT-|品牌主動贈送|品牌贈送|朋友試用|朋友體驗|同一份兌換流程|共用兌換流程|兌換碼前綴|代碼示例" index.html gift.html navigator.html refund.html
git diff --check
```

Expected: `rg` returns no matches in public pages; `git diff --check` returns no output.

- [ ] **Step 7: Start the local site and inspect four viewports**

Run:

```powershell
python -m http.server 4173
```

Inspect:

- `http://localhost:4173/index.html`
- `http://localhost:4173/gift.html`
- `http://localhost:4173/navigator.html`
- `http://localhost:4173/refund.html`

At 375px, 768px, 1024px, and 1440px verify:

- no page-level horizontal scroll;
- no clipped hero artwork or text;
- body and policy text are readable;
- current navigation is obvious;
- testimonial screenshots remain legible and uncropped;
- the homepage guide remains dominant before the role journey;
- gift page contains no internal fulfilment terminology;
- navigator form opens the approved public URL;
- external links open securely in a new tab.

- [ ] **Step 8: Commit production readiness**

```powershell
git add -- tests/site-content.test.mjs tests/site-deployment.test.mjs index.html README.md
git commit -m "chore: verify the guide-centered brand site"
```

---

## Final Integration Review

- [ ] Run `git status --short` and confirm only intentional files are changed.
- [ ] Run `npm test` once more from a clean working tree.
- [ ] Compare `git diff HEAD~6 --stat` with the file structure in this plan.
- [ ] Confirm the four public pages use one consistent navigation/footer and exactly one `aria-current="page"` each.
- [ ] Confirm the production artifact workflow still stages all four pages, `styles.css`, `.nojekyll`, and `assets/`.
- [ ] Push `main` only after the user authorizes publishing or the active task already includes deployment authorization.
- [ ] After push, verify the GitHub Pages workflow succeeds and open `https://yangjetw.github.io/star-guide/` plus the three supporting routes.
