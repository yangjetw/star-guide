# Gamma-Faithful Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dark reinterpretation with a GitHub Pages static site that closely reproduces the original Gamma page's Traditional Chinese copy, bright layout, orange/green calls to action, pricing, and warm parent-child imagery.

**Architecture:** Keep the runtime dependency-free: semantic content stays in `index.html`, the complete visual system stays in `styles.css`, and every production image is a local WebP under `assets/images/`. Node's built-in test runner verifies copy, ordering, links, privacy boundaries, asset loading attributes, responsive CSS, and accessibility; GitHub Actions continues publishing the static repository.

**Tech Stack:** HTML5, CSS3, local WebP images, Node.js built-in `node:test`, PowerShell, bundled Python/Pillow for one-time image conversion, GitHub Pages.

## Global Constraints

- The public source of truth is `https://parent-star-guide-1tpyu0y.gamma.site/` as inspected on 2026-07-20.
- Production HTML and CSS must not reference `gamma.app` or `imgproxy.gamma.app`.
- Runtime files remain `index.html`, `styles.css`, and local assets; add no framework or runtime JavaScript.
- Official LINE URL is exactly `https://lin.ee/gMMpzNy`.
- Public payment-report URL is exactly `https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform`.
- Private redemption-form ID `1FAIpQLSevM95Op1gL8g8iZqnEKVR5u9s_NSyIo7mgHKp5KTxtpRFABA` must not appear in production files.
- The public offer is one `NT$3980` guide for one child; remove the current three-plan presentation.
- Body copy is at least 18px; touch targets are at least 44px high; layouts must work at 360, 390, 768, 1024, and 1440px.
- Preserve semantic landmarks, skip link, visible keyboard focus, safe external-link attributes, and `prefers-reduced-motion` behavior.

---

## File Map

- Modify `index.html`: complete Gamma-faithful content, semantic section ordering, image markup, CTA and privacy boundaries.
- Modify `styles.css`: warm-white visual system, desktop alternating layouts, responsive single-column rules, comparison table/card behavior, focus and reduced-motion rules.
- Create `assets/images/*.webp`: local optimized copies of approved original Gamma assets.
- Modify `tests/site-content.test.mjs`: source-of-truth copy, ordering, pricing, public/private link, local-asset, and deployment assertions.
- Modify `tests/site-styles.test.mjs`: bright palette, typography, CTA, alternating layout, table, image, and responsive assertions.
- Modify `tests/site-accessibility.test.mjs`: semantic structure, image metadata, focus, safe links, and removed fixed mobile CTA assertions.
- Modify `README.md`: describe the faithful static rebuild, local asset policy, test command, and deployment URL.

### Task 1: Lock the original Gamma content contract and rebuild the semantic HTML

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: the exact source copy and section order in the approved design spec.
- Produces: eleven ordered `<section>` elements with stable IDs used by CSS and later asset insertion: `hero`, `concerns`, `unique-child`, `method`, `required-data`, `pricing`, `deliverables`, `value-comparison`, `transformation`, `testimonials`, `closing`.

- [ ] **Step 1: Replace obsolete dark-site content assertions with failing Gamma-copy assertions**

Add helpers and the exact contract to `tests/site-content.test.mjs`:

```js
const orderedMarkers = [
  '《親子成長指南》',
  '你是否也有這些困惑？',
  '每個孩子都是獨特的',
  '我們怎麼做的？',
  '❌做測驗，❌填問卷，✅只要：',
  '方案價格？',
  '你將得到什麼？',
  '我們的指南為什麼值這個價？',
  '指南帶來的轉變',
  '家長們的真實心聲',
  '一份屬於你與孩子的愛之地圖',
];

test('reproduces the original Gamma story in order', async () => {
  const html = await read('index.html');
  let cursor = -1;
  for (const marker of orderedMarkers) {
    const next = html.indexOf(marker, cursor + 1);
    assert.ok(next > cursor, `${marker} should appear in source order`);
    cursor = next;
  }
  assert.match(html, /不是你沒耐心，只是你沒拿到他的專屬說明書。/);
  assert.match(html, /精心打造超過8仟字的PDF電子指南/);
  assert.match(html, /懂，是比愛更深刻的慈悲。/);
});

test('presents only the approved original offer', async () => {
  const html = await read('index.html');
  assert.equal((html.match(/NT\$3980/g) ?? []).length >= 2, true);
  assert.doesNotMatch(html, /自用方案|好友分享包|團購祝福組/);
  assert.doesNotMatch(html, /<section[^>]+id="faq"/);
});
```

- [ ] **Step 2: Run the focused test and confirm it fails on the existing content**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs
```

Expected: FAIL because the current site uses rewritten headings, three plans, and an FAQ section.

- [ ] **Step 3: Replace `index.html` with the approved semantic outline and original copy**

The implementation must use this structure and copy contract:

```html
<a class="skip-link" href="#main-content">跳到主要內容</a>
<header class="site-header">
  <a class="brand" href="#hero" aria-label="赫爾墨斯的小宇宙首頁">赫爾墨斯的小宇宙</a>
  <a class="button button-line" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">加入官方 Line</a>
</header>
<main id="main-content">
  <section id="hero" class="story-section hero-section" aria-labelledby="hero-title">
    <div class="story-copy">
      <p class="eyebrow">《親子成長指南》</p>
      <h1 id="hero-title">看見孩子獨特的宇宙</h1>
      <p>每個父母都想給孩子最好，只是<span class="accent">不知道</span>什麼才是最好。</p>
      <div class="button-row">
        <a class="button button-primary" href="#unique-child">《親子成長指南》是什麼？</a>
        <a class="button button-line" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">加入官方 Line</a>
      </div>
    </div>
    <figure class="story-media story-media-portrait" data-image="hero"></figure>
  </section>

  <section id="concerns" class="story-section" aria-labelledby="concerns-title">
    <div class="story-copy">
      <h2 id="concerns-title">你是否也有這些困惑？</h2>
      <div class="concern-list">
        <article><h3>情緒爆發</h3><p>孩子動不動就失控，我怎麼講都沒用？</p></article>
        <article><h3>潛力未發揮</h3><p>明明很聰明卻拖拖拉拉、沒動力？</p></article>
        <article><h3>教養方式不適用</h3><p>我的方式對別人小孩有效，對他完全無效？</p></article>
        <article><h3>內心想法成謎</h3><p>為什麼總是跟我反著來？他到底在想什麼？</p></article>
      </div>
      <p class="pull-quote">不是你沒耐心，只是你沒拿到他的專屬說明書。</p>
    </div>
    <figure class="story-media story-media-portrait" data-image="concerns"></figure>
  </section>

  <section id="unique-child" class="story-section story-section-reverse" aria-labelledby="unique-title">
    <figure class="story-media story-media-portrait" data-image="guide"></figure>
    <div class="story-copy">
      <h2 id="unique-title">每個孩子都是獨特的</h2>
      <p>專為3–12歲孩子設計的《親子成長指南》，是一份讓你「懂孩子」的教養工具書。</p>
      <div class="feature-list">
        <article><h3>父母與孩子的個性橋接</h3><p>翻譯彼此的差異，創造和諧親子關係</p></article>
        <article><h3>個別化解讀孩子的氣質與天賦</h3><p>專屬你孩子的性格分析，而非套用模板</p></article>
        <article><h3>情緒管理與互動衝突策略</h3><p>具體實用的應對方法，幫助親子溝通更順暢</p></article>
      </div>
    </div>
  </section>

  <section id="method" class="story-section" aria-labelledby="method-title">
    <div class="story-copy">
      <h2 id="method-title">我們怎麼做的？</h2>
      <ol class="process-list">
        <li>🔍 每一份《親子成長指南》，都是從一組出生資料開始</li>
        <li>✍️ 經過占星分析，解讀徵象語言</li>
        <li>🎯 應用兒童心理學，結合生活實境</li>
        <li>逐步轉化為可讀、可感、可用的內容</li>
      </ol>
      <p>📎 每份《親子成長指南》都由專業團隊投入數小時反覆琢磨，為每一位孩子，量身定製出能被家長真正「讀懂與使用」的指南。</p>
    </div>
    <figure class="story-media story-media-landscape" data-image="process"></figure>
  </section>

  <section id="required-data" class="story-section story-section-reverse" aria-labelledby="data-title">
    <div class="story-copy">
      <h2 id="data-title">❌做測驗，❌填問卷，✅只要：</h2>
      <div class="data-list">
        <article><h3>出生時間</h3><p>建議誤差不超過30分鐘，以確保分析準確性</p></article>
        <article><h3>出生地點</h3><p>提供城市即可，用於建立完整的節奏分析</p></article>
        <article><h3>孩子姓名</h3><p>可使用暱稱，完成個人化內容</p></article>
        <article><h3>父母資料</h3><p>選填，用於更完整的關係互動分析</p></article>
      </div>
      <p class="privacy-note">資料僅用於本次內容客製化。應用範圍不涉及個人識別，敬請安心。</p>
    </div>
    <figure class="story-media story-media-portrait" data-image="required-data"></figure>
  </section>

  <section id="pricing" class="price-section" aria-labelledby="pricing-title">
    <div class="price-card">
      <h2 id="pricing-title">方案價格？</h2>
      <p class="price">NT$3980</p>
      <p>包含1位孩子的完整分析報告，以及家長與孩子的節奏互動解讀</p>
      <a class="button button-primary payment-report-link" href="https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform" target="_blank" rel="noopener noreferrer">完成付款後回報</a>
    </div>
  </section>

  <section id="deliverables" class="story-section" aria-labelledby="deliverables-title">
    <div class="story-copy">
      <h2 id="deliverables-title">你將得到什麼？</h2>
      <p>這份指南不只是理論，更是實用的親子溝通工具書。每一頁都經過精心設計，讓你能輕鬆理解並立即應用於日常中。</p>
      <h3>📄 精心打造超過8仟字的PDF電子指南</h3>
      <div class="deliverable-list">
        <article><h3>個人分析解讀</h3><p>詳細剖析孩子的氣質、節奏、互動偏好等特質，幫助你真正看見孩子的內在世界。</p></article>
        <article><h3>情緒節點解析</h3><p>解讀情緒反應與家庭互動的關鍵節點，讓你能預見並妥善回應可能的衝突。</p></article>
        <article><h3>實用情境範例</h3><p>針對常見教養場景提供具體溝通建議與策略示範，豐富你應對方式。</p></article>
        <article><h3>關係節奏圖像</h3><p>呈現父母與孩子之間的互動模式，幫助你找到最佳的連結方式。</p></article>
      </div>
      <p>ℹ️這份指南設計為可長期使用的成長資源，隨著孩子的發展，你可以反覆閱讀，它會是你最珍藏實用的寶典。</p>
    </div>
    <figure class="story-media story-media-portrait" data-image="deliverables"></figure>
  </section>

  <section id="value-comparison" class="comparison-section" aria-labelledby="comparison-title">
    <h2 id="comparison-title">我們的指南為什麼值這個價？</h2>
    <p class="comparison-lead"><strong>一眼看懂差異</strong><br>你買的是一套真正幫你解決親子衝突的實用導航系統。</p>
    <div class="table-wrap"><table><thead><tr><th>產品類型</th><th>價格區間</th><th>通常內容</th><th>我們提供</th></tr></thead><tbody>
      <tr><th>一般星盤解讀（純命盤）</th><td>NT$600～1200</td><td>解釋行星與星座配置，無生活指導</td><td>✅ 客製化分析 + 親子情境應用</td></tr>
      <tr><th>教養顧問線上諮詢（60分鐘）</th><td>NT$1800～2500</td><td>口頭建議，無書面紀錄、無後續參考</td><td>✅ 可反覆閱讀 + 親子互動劇本</td></tr>
      <tr><th>星座親子書籍（通用版）</th><td>NT$380～680</td><td>通則講解，無法應用於個別孩子</td><td>✅ 100%針對你的孩子與家庭配置</td></tr>
      <tr><th>客製化占星PDF報告</th><td>NT$1800～6000</td><td>偶有模版、缺少教育建議</td><td>✅ 整合心理學 + 星座 + 教育策略</td></tr>
      <tr class="our-guide"><th>本指南</th><td>NT$3980</td><td>✅ 全客製｜育兒建議</td><td>❤️ 是你與孩子的理解橋梁</td></tr>
    </tbody></table></div>
  </section>

  <section id="transformation" class="story-section story-section-reverse" aria-labelledby="transformation-title">
    <figure class="story-media story-media-portrait" data-image="transformation"></figure>
    <div class="story-copy"><h2 id="transformation-title">指南帶來的轉變</h2><div class="transformation-list">
      <article><h3>理解行為背後原因</h3><p>知道孩子「為什麼那樣反應」，不再感到困惑</p></article>
      <article><h3>掌握互動平衡點</h3><p>懂得「什麼時候放手，什麼時候給安全感」</p></article>
      <article><h3>有效溝通模式</h3><p>擁有親子互動的具體劇本，說對話、做對事</p></article>
    </div><blockquote>很多爸媽看完說：「我終於理解他不是故意頂嘴，而是用他的方式呼救。」</blockquote></div>
  </section>

  <section id="testimonials" class="testimonial-section" aria-labelledby="testimonials-title">
    <h2 id="testimonials-title">家長們的真實心聲</h2>
    <div class="testimonial-list">
      <blockquote><p>「特質的部份確實是這樣，我的月摩羯也是。」</p><cite>7歲娃的媽媽</cite></blockquote>
      <blockquote><p>「看完後想每年都看一次，提醒自己多一點包容。」</p><cite>5歲娃的媽媽</cite></blockquote>
      <blockquote><p>「寫得太準了，根本就是我家小孩的個性寫照。」</p><cite>4歲娃的爸爸</cite></blockquote>
    </div>
  </section>

  <section id="closing" class="closing-section" aria-labelledby="closing-title">
    <figure class="closing-media" data-image="closing"></figure>
    <div class="closing-copy"><p class="eyebrow">開始你的親子理解之旅</p><h2 id="closing-title">一份屬於你與孩子的愛之地圖</h2><p class="closing-quote">懂，是比愛更深刻的慈悲。</p><p>孩子從來不是「不懂事」，只是用另一種節奏生活。這份指南，讓你能用他的節奏靠近、理解、擁抱。理解之後，行動自然發生。這就是親子之間的真正靠近。</p><p>《親子成長指南》，獻給願意陪孩子一起成長的大人。</p><div class="button-row"><a class="button button-line" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">加入官方 Line</a><a class="button button-primary payment-report-link" href="https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform" target="_blank" rel="noopener noreferrer">完成付款後回報</a></div></div>
  </section>
</main>
<footer class="site-footer"><p>© 2026 赫爾墨斯的小宇宙</p></footer>
```

Do not retain the current nav menu, three plan cards, five FAQs, fixed `.mobile-purchase`, or deep-blue decorative markup.

- [ ] **Step 4: Run the focused content test and make it pass**

Run the same Node command. Expected: all `site-content` tests pass after obsolete expectations are updated to the new contract.

- [ ] **Step 5: Commit the content rebuild**

```powershell
git add index.html tests/site-content.test.mjs
git commit -m "feat: restore original Gamma content flow"
```

### Task 2: Localize and optimize the original Gamma imagery

**Files:**
- Create: `assets/images/hero-parent-child.webp`
- Create: `assets/images/concerns-family.webp`
- Create: `assets/images/guide-parent-child.webp`
- Create: `assets/images/process-wonder.webp`
- Create: `assets/images/required-data-family.webp`
- Create: `assets/images/deliverables-reading.webp`
- Create: `assets/images/closing-cosmos-family.webp`
- Create: `assets/images/guide-preview.webp`
- Modify: `tests/site-content.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: the eight known original CDN assets and the `figure[data-image]` slots from Task 1.
- Produces: eight local WebP files and `<img>` elements with stable filenames, dimensions, alternative text, and loading hints.

- [ ] **Step 1: Add failing tests for local production images**

Extend the existing `node:fs/promises` import to include `stat`, then add:

```js
const approvedImages = [
  'hero-parent-child.webp',
  'concerns-family.webp',
  'guide-parent-child.webp',
  'process-wonder.webp',
  'required-data-family.webp',
  'deliverables-reading.webp',
  'closing-cosmos-family.webp',
  'guide-preview.webp',
];

test('ships approved original imagery locally with stable metadata', async () => {
  const html = await read('index.html');
  for (const filename of approvedImages) {
    const asset = new URL(`assets/images/${filename}`, root);
    const assetStat = await stat(asset);
    assert.ok(assetStat.size > 5_000, `${filename} should be a real local image`);
    assert.match(html, new RegExp(`src="assets/images/${filename}"`));
  }
  assert.doesNotMatch(html, /(?:imgproxy\.)?gamma\.app/i);
  assert.match(html, /loading="eager"[^>]+fetchpriority="high"/);
  assert.equal((html.match(/loading="lazy"/g) ?? []).length >= 6, true);
});
```

- [ ] **Step 2: Run the focused test and confirm missing assets fail**

Run the Task 1 test command. Expected: FAIL with `ENOENT` for `assets/images/hero-parent-child.webp`.

- [ ] **Step 3: Download approved sources to a temporary directory and convert them to WebP**

Use these exact source mappings:

```text
hero-parent-child.webp       generated-images/BbnmKOjrvLNAgfThpoq35.png
concerns-family.webp         generated-images/m5xNB0z8kc_ZyjqvUWjNQ.png
guide-parent-child.webp      generated-images/p476VGCtbZyjxPhB1s9Kj.png
process-wonder.webp          generated-images/i6WCKrXZxzf_w3sK6VX38.png
required-data-family.webp     generated-images/j91zpFGJaEyIhfnB94hdH.png
deliverables-reading.webp    generated-images/sqIaJoznBiJ_sCBZik5ZO.png
closing-cosmos-family.webp   generated-images/XKSBLyPqbvMvWb9tFfUCP.png
guide-preview.webp           f69452804d3749f8be62a1c142fef562/original/1_.png
```

Create a workspace-local temporary folder, download from `https://cdn.gamma.app/akw6y74cp1iyxtt/`, then use bundled Python/Pillow to apply EXIF transpose, resize only when wider than 1400px, and save WebP at quality 84 with method 6. Do not commit temporary PNG files.

```python
from pathlib import Path
from PIL import Image, ImageOps

source_dir = Path('.tmp-gamma-images')
output_dir = Path('assets/images')
output_dir.mkdir(parents=True, exist_ok=True)
for source in source_dir.glob('*.png'):
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    if image.width > 1400:
        height = round(image.height * 1400 / image.width)
        image = image.resize((1400, height), Image.Resampling.LANCZOS)
    image.save(output_dir / f'{source.stem}.webp', 'WEBP', quality=84, method=6)
```

Name the downloaded PNG stems exactly like the destination names before conversion. Remove only the verified workspace-local `.tmp-gamma-images` directory after checking all eight outputs.

- [ ] **Step 4: Replace every empty media slot with complete local image markup**

Use this attribute pattern; insert the intrinsic WebP dimensions measured after conversion:

```html
<figure class="story-media story-media-portrait">
  <img
    src="assets/images/hero-parent-child.webp"
    alt="星空下牽手看著孩子宇宙的親子"
    width="1024"
    height="1024"
    loading="eager"
    fetchpriority="high"
    decoding="async"
  >
</figure>
```

The other seven images use `loading="lazy" decoding="async"`; give each a specific Traditional Chinese alt text. Map `required-data-family.webp` to the required-data slot, `guide-preview.webp` to the deliverables slot, and `deliverables-reading.webp` to the transformation slot; none are decorative backgrounds.

- [ ] **Step 5: Run the focused tests and inspect every converted image**

Run the content tests. Expected: PASS. Open every WebP with the local image viewer and confirm that no source is a watermark, unrelated screenshot, corrupt file, or duplicate image.

- [ ] **Step 6: Commit localized imagery and markup**

```powershell
git add assets/images index.html tests/site-content.test.mjs
git commit -m "feat: localize original Gamma imagery"
```

### Task 3: Rebuild the bright Gamma-faithful responsive visual system

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `styles.css`

**Interfaces:**
- Consumes: Task 1 section classes and Task 2 image markup.
- Produces: warm white layout, alternating desktop grids, orange/green CTA styles, mobile stacking, responsive comparison content, image framing, and no fixed CTA.

- [ ] **Step 1: Replace obsolete starry-theme assertions with failing bright-layout assertions**

```js
test('uses the approved bright Gamma-faithful palette and soft Chinese typography', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /--color-bg:\s*#fff(?:fff)?;/i);
  assert.match(css, /--color-accent:\s*#ff6b4a;/i);
  assert.match(css, /--color-line:\s*#55c982;/i);
  assert.match(css, /Noto Sans TC|PingFang TC|Microsoft JhengHei/);
  assert.match(css, /font-size:\s*clamp\(18px,/);
});

test('alternates desktop stories and stacks them below 768px', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.story-section\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.story-section-reverse\s+\.story-copy/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /grid-template-columns:\s*1fr/);
  assert.doesNotMatch(css, /\.mobile-purchase\s*\{[^}]*position:\s*fixed/s);
});

test('frames local images without the old glass-card treatment', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.story-media img\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(css, /border-radius:\s*2[02468]px/);
  assert.doesNotMatch(css, /backdrop-filter/);
});
```

- [ ] **Step 2: Run style tests and confirm they fail on the dark theme**

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-styles.test.mjs
```

Expected: FAIL on palette, typography, layout, and removed fixed CTA assertions.

- [ ] **Step 3: Replace `styles.css` with the approved design tokens and component rules**

Start the stylesheet with these exact tokens and base contracts:

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #fffaf6;
  --color-text: #38383c;
  --color-heading: #0c0d0f;
  --color-muted: #6f6f73;
  --color-accent: #ff6b4a;
  --color-accent-dark: #d94a2c;
  --color-line: #55c982;
  --color-line-dark: #247a49;
  --color-border: #eee8e2;
  --shadow-soft: 0 18px 50px rgb(76 53 36 / 10%);
  --content-width: 1160px;
  --font-sans: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: clamp(18px, 1.25vw, 20px);
  line-height: 1.75;
}

.story-section {
  width: min(calc(100% - 48px), var(--content-width));
  margin-inline: auto;
  padding-block: clamp(72px, 9vw, 132px);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr);
  gap: clamp(40px, 7vw, 96px);
  align-items: center;
}

.story-section-reverse .story-copy { order: 2; }
.story-section-reverse .story-media { order: 1; }

.button {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
}
.button-primary { background: var(--color-accent); color: #17110e; }
.button-line { background: var(--color-line); color: #102b1c; }

.story-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: var(--shadow-soft);
}
```

Complete the stylesheet with these component and responsive rules:

```css
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
img { max-width: 100%; }
a { color: inherit; }
.skip-link { position: fixed; top: 12px; left: 12px; z-index: 20; transform: translateY(-150%); background: #fff; padding: 10px 14px; }
.skip-link:focus { transform: translateY(0); }
.site-header { width: min(calc(100% - 48px), var(--content-width)); min-height: 76px; margin-inline: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.brand { font-weight: 900; text-decoration: none; }
h1, h2, h3 { color: var(--color-heading); line-height: 1.25; text-wrap: balance; }
h1 { margin: 0 0 24px; font-size: clamp(42px, 5vw, 64px); font-weight: 700; }
h2 { margin: 0 0 28px; font-size: clamp(34px, 4vw, 46px); font-weight: 700; }
h3 { font-size: clamp(21px, 2vw, 26px); }
.eyebrow { margin-bottom: 8px; font-weight: 800; color: var(--color-heading); }
.accent { color: var(--color-accent); font-weight: 900; }
.button-row { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 30px; }
.concern-list, .feature-list, .data-list, .deliverable-list, .transformation-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.concern-list article, .feature-list article, .data-list article, .deliverable-list article, .transformation-list article { padding: 22px; border: 1px solid var(--color-border); border-radius: 20px; background: var(--color-surface); }
.pull-quote, blockquote, .privacy-note { padding: 22px 24px; border-left: 5px solid var(--color-accent); background: var(--color-surface); }
.process-list { display: grid; gap: 16px; padding: 0; list-style: none; }
.process-list li { padding: 18px 20px; border-bottom: 1px solid var(--color-border); }
.price-section, .comparison-section, .testimonial-section, .closing-section { width: min(calc(100% - 48px), var(--content-width)); margin-inline: auto; padding-block: clamp(72px, 9vw, 132px); }
.price-card { max-width: 720px; margin-inline: auto; padding: clamp(32px, 6vw, 64px); text-align: center; border: 1px solid var(--color-border); border-radius: 28px; background: var(--color-surface); box-shadow: var(--shadow-soft); }
.price { margin: 16px 0; color: var(--color-accent-dark); font-size: clamp(48px, 8vw, 76px); font-weight: 900; line-height: 1; }
.comparison-lead { margin-bottom: 32px; }
.table-wrap { overflow-x: auto; border: 1px solid var(--color-border); border-radius: 20px; }
table { width: 100%; min-width: 760px; border-collapse: collapse; background: #fff; }
th, td { padding: 18px; border-bottom: 1px solid var(--color-border); text-align: left; vertical-align: top; }
thead { background: var(--color-surface); }
.our-guide { background: #fff3ec; font-weight: 800; }
.testimonial-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px; }
.testimonial-list blockquote { margin: 0; border-left: 0; border-top: 5px solid var(--color-accent); border-radius: 20px; }
.testimonial-list cite { color: var(--color-muted); font-style: normal; font-weight: 800; }
.closing-media img { width: 100%; max-height: 620px; object-fit: cover; border-radius: 28px; }
.closing-copy { max-width: 820px; margin: 48px auto 0; text-align: center; }
.closing-copy .button-row { justify-content: center; }
.closing-quote { color: var(--color-accent-dark); font-size: clamp(28px, 4vw, 44px); font-weight: 900; }
.site-footer { padding: 32px 24px; border-top: 1px solid var(--color-border); color: var(--color-muted); text-align: center; }
:focus-visible { outline: 4px solid #1d5fd1; outline-offset: 4px; }

@media (hover: hover) {
  .button { transition: transform .2s ease, filter .2s ease; }
  .button:hover { filter: brightness(.96); transform: translateY(-2px); }
}

@media (max-width: 768px) {
  .site-header, .story-section, .price-section, .comparison-section, .testimonial-section, .closing-section { width: min(calc(100% - 32px), var(--content-width)); }
  .site-header { min-height: 68px; }
  .brand { max-width: 55%; }
  .story-section { grid-template-columns: 1fr; gap: 32px; padding-block: 64px; }
  .story-section .story-copy, .story-section .story-media { order: initial; }
  .story-section-reverse .story-copy { order: 1; }
  .story-section-reverse .story-media { order: 2; }
  .concern-list, .feature-list, .data-list, .deliverable-list, .transformation-list, .testimonial-list { grid-template-columns: 1fr; }
  .story-media-portrait { aspect-ratio: 4 / 5; }
  .story-media-landscape { aspect-ratio: 16 / 10; }
  .button-row .button { flex: 1 1 220px; }
  table { min-width: 680px; }
}

@media (max-width: 420px) {
  h1 { font-size: 40px; }
  h2 { font-size: 34px; }
  .site-header .button { padding-inline: 16px; font-size: 16px; }
  .button-row .button { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}

@media print {
  .site-header .button, .button-row, .skip-link { display: none; }
  .story-section, .price-section, .comparison-section, .testimonial-section, .closing-section { width: 100%; padding-block: 32px; break-inside: avoid; }
}
```

- [ ] **Step 4: Run style tests and make them pass**

Run the focused style command. Expected: PASS with no obsolete dark-theme expectation retained.

- [ ] **Step 5: Commit the visual rebuild**

```powershell
git add styles.css tests/site-styles.test.mjs
git commit -m "feat: recreate bright Gamma visual system"
```

### Task 4: Enforce links, privacy boundaries, metadata, and accessibility

**Files:**
- Modify: `tests/site-accessibility.test.mjs`
- Modify: `tests/site-content.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: the complete HTML/CSS from Tasks 1–3.
- Produces: validated public CTAs, non-public redemption flow, semantic image labels, keyboard access, metadata, and no fixed mobile obstruction.

- [ ] **Step 1: Write failing accessibility and link-boundary assertions**

```js
test('keeps the approved public actions and private redemption form separate', async () => {
  const { html } = await siteFiles();
  assert.equal((html.match(/https:\/\/lin\.ee\/gMMpzNy/g) ?? []).length >= 3, true);
  assert.equal((html.match(/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/g) ?? []).length >= 2, true);
  assert.doesNotMatch(html, /1FAIpQLSevM95Op1gL8g8iZqnEKVR5u9s_NSyIo7mgHKp5KTxtpRFABA/);
  for (const tag of html.matchAll(/<a[^>]+target="_blank"[^>]*>/g)) {
    assert.match(tag[0], /rel="noopener noreferrer"/);
  }
});

test('provides semantic images, landmarks, focus, and motion safety', async () => {
  const { html, css } = await siteFiles();
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<main id="main-content">/);
  for (const imageTag of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(imageTag[0], /alt="[^"]+"/);
    assert.match(imageTag[0], /width="\d+"/);
    assert.match(imageTag[0], /height="\d+"/);
  }
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
```

- [ ] **Step 2: Run accessibility and content tests and confirm any missing contracts fail**

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-accessibility.test.mjs tests/site-content.test.mjs
```

Expected: FAIL until every image attribute, metadata item, safe link, and removed obsolete FAQ expectation is aligned.

- [ ] **Step 3: Apply the minimal HTML and CSS fixes required by the assertions**

The `<head>` must include this metadata shape using the local hero asset:

```html
<meta name="description" content="專為 3–12 歲孩子打造的親子成長指南，協助家長理解孩子的氣質、情緒與互動節奏。">
<meta property="og:type" content="website">
<meta property="og:title" content="親子成長指南｜看見孩子獨特的宇宙">
<meta property="og:description" content="一份讓你真正懂孩子、可長期使用的親子溝通工具書。">
<meta property="og:image" content="assets/images/hero-parent-child.webp">
```

Add visible `:focus-visible` outlines, reduced-motion overrides, one privacy paragraph under `#required-data`, and safe attributes on every external link. Do not add the private form link, client-side form capture, analytics, or a cookie banner.

- [ ] **Step 4: Run the entire test suite**

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

Expected: all tests pass, with zero failures and zero skipped tests.

- [ ] **Step 5: Commit the trust and accessibility pass**

```powershell
git add index.html styles.css tests/site-accessibility.test.mjs tests/site-content.test.mjs
git commit -m "fix: preserve accessible purchase and privacy boundaries"
```

### Task 5: Verify all target widths, document the rebuild, and publish

**Files:**
- Modify: `README.md`
- Verify: `.github/workflows/pages.yml`
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `assets/images/*.webp`

**Interfaces:**
- Consumes: the tested site from Tasks 1–4.
- Produces: a documented, visually verified, pushed GitHub Pages deployment at `https://yangjetw.github.io/star-guide/`.

- [ ] **Step 1: Update README with exact local and deployment instructions**

Include this concise operating contract:

```markdown
## Local verification

Run `npm test`, then serve the repository root with any static HTTP server.
The production page is dependency-free and uses only local assets under `assets/`.

## Publishing

Push `main`; `.github/workflows/pages.yml` uploads the static repository and publishes it to:
https://yangjetw.github.io/star-guide/

## Content boundaries

The public page links to official LINE and the payment-report Google Form. The private redemption application remains available only through the post-purchase redemption-code flow.
```

- [ ] **Step 2: Run deterministic pre-browser checks**

```powershell
npm test
git diff --check
git status --short
```

Expected: tests pass; `git diff --check` prints nothing; status contains only the intended README change before its commit.

- [ ] **Step 3: Serve the site and inspect five exact viewport widths**

At 360, 390, 768, 1024, and 1440px, inspect these anchors: `#hero`, `#concerns`, `#unique-child`, `#method`, `#required-data`, `#pricing`, `#deliverables`, `#value-comparison`, `#transformation`, `#testimonials`, `#closing`.

For every width verify: no horizontal scroll; body copy is at least 18px; buttons are at least 44px high; copy precedes images on mobile; faces are not cropped; `NT$3980` is visible; comparison content remains readable; no fixed CTA covers content; console has no errors. Click one LINE CTA, one payment-report CTA, and the hero's internal anchor and verify exact destinations without submitting any form.

- [ ] **Step 4: Commit documentation after visual verification**

```powershell
git add README.md
git commit -m "docs: document faithful static site workflow"
```

- [ ] **Step 5: Run final verification immediately before publishing**

```powershell
npm test
git diff --check
git status --short
git log -5 --oneline
```

Expected: all tests pass, no diff errors, working tree clean, and the task commits appear in order.

- [ ] **Step 6: Push `main` and verify GitHub Pages**

```powershell
git push origin main
gh run list --workflow pages.yml --limit 1
```

Wait for the workflow to finish successfully. Open `https://yangjetw.github.io/star-guide/`, verify HTTP success and confirm each local WebP loads directly. Recheck the hero, pricing, closing CTA, and mobile 390px layout on the live site.
