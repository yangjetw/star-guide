# 家長心聲卡與導航者表單直達 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將首頁引言重做為清楚精緻的暖色家長心聲卡，並讓導航者頁直接開啟既有 Google 申請表單。

**Architecture:** 網站維持無框架、無 JavaScript 的靜態 HTML/CSS。`index.html` 負責語意化引言結構，`navigator.html` 負責公開申請動線，`styles.css` 提供共用視覺語言；Node 內建測試鎖定可讀性、連結白名單、安全邊界與完整文案。

**Tech Stack:** HTML5、CSS3、Node.js `node:test`、GitHub Pages、Google Forms。

## Global Constraints

- 保留原家長引言全文，不改寫原意。
- 公開導航者表單固定使用 `https://forms.gle/GsUYYrCTFfHkA6RE8`。
- 指南兌換表單仍不得出現在公開網站或追蹤文件。
- 導航者表單以新分頁開啟並使用 `rel="noopener noreferrer"`。
- 官方 LINE 保留為導航者頁次要入口，其他頁面 LINE 動線不變。
- 不新增 JavaScript、表單嵌入碼、iframe 或第三方追蹤。
- 375px 手機版不得產生整頁橫向溢出，互動目標至少 44px。

---

## File Structure

- `index.html`：家長心聲卡的語意結構與原文。
- `navigator.html`：導航者申請說明、Google 表單主 CTA、LINE 次要入口。
- `styles.css`：家長心聲卡與導航者申請區的響應式樣式。
- `tests/site-styles.test.mjs`：視覺契約與手機響應式回歸。
- `tests/site-content.test.mjs`：首頁完整文案與語意結構回歸。
- `tests/site-marketplace.test.mjs`：公開連結白名單與導航者表單邊界。
- `gift.html`、`refund.html`：僅更新 CSS 快取鍵。

---

### Task 1: 暖色編輯式家長心聲卡

**Files:**
- Modify: `tests/site-styles.test.mjs`
- Modify: `tests/site-content.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `--color-paper`、`--color-coral`、`--color-ink`、`--shadow-warm`。
- Produces: `.reader-quote`、`.reader-quote__label`、`.reader-quote__text` 三個穩定樣式鉤子。

- [ ] **Step 1: 寫入失敗的語意與視覺測試**

在 `tests/site-styles.test.mjs` 新增：

```js
test('presents the parent insight as a readable editorial quote card', async () => {
  const css = await read('styles.css');
  assert.match(css, /\.reader-quote\s*\{[^}]*max-width:\s*46rem[^}]*background:\s*var\(--color-white\)[^}]*border:\s*1px solid[^}]*var\(--color-coral\)/s);
  assert.match(css, /\.reader-quote__label\s*\{[^}]*font-family:\s*var\(--font-body\)[^}]*color:\s*var\(--color-coral-dark\)/s);
  assert.match(css, /\.reader-quote__text\s*\{[^}]*font-size:\s*clamp\(20px,[^}]*26px\)[^}]*line-height:\s*1\.6/s);
});
```

在 `tests/site-content.test.mjs` 的 transformation 結構檢查加入：

```js
assert.match(transformation, /<figure\b[^>]*class="reader-quote"[\s\S]*?<figcaption\b[^>]*class="reader-quote__label">家長閱讀後的感受<\/figcaption>[\s\S]*?<blockquote\b[^>]*class="reader-quote__text">/i);
```

並將 `家長閱讀後的感受` 加入 transformation 的核准可見文字清單，原引言全文保留。

- [ ] **Step 2: 執行測試並確認因缺少新結構而失敗**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-styles.test.mjs tests/site-content.test.mjs
```

Expected: FAIL，指出 `.reader-quote` 或新 `<figure>` 結構不存在。

- [ ] **Step 3: 實作最小 HTML 結構**

將 `index.html` 現有單一 `<blockquote>` 改為：

```html
<figure class="reader-quote">
  <figcaption class="reader-quote__label">家長閱讀後的感受</figcaption>
  <blockquote class="reader-quote__text">
    <p>很多爸媽看完說：「我終於理解他不是故意頂嘴，而是用他的方式呼救。」</p>
  </blockquote>
</figure>
```

- [ ] **Step 4: 實作暖色編輯式卡片**

以以下契約取代舊 `.editorial-layout--transformation blockquote` 樣式：

```css
.reader-quote {
  position: relative;
  width: min(100%, 46rem);
  max-width: 46rem;
  margin: 30px auto 0;
  padding: 26px 30px 28px;
  border: 1px solid rgb(255 120 89 / 46%);
  border-top: 4px solid var(--color-coral);
  border-radius: 18px;
  background: var(--color-white);
  box-shadow: var(--shadow-warm);
}

.reader-quote::before {
  content: "“";
  position: absolute;
  top: 8px;
  right: 24px;
  color: rgb(255 120 89 / 18%);
  font-family: var(--font-display);
  font-size: 74px;
  line-height: 1;
}

.reader-quote__label {
  position: relative;
  z-index: 1;
  margin-bottom: 10px;
  color: var(--color-coral-dark);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.reader-quote__text {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: clamp(20px, 1.1vw + 16px, 26px);
  font-weight: 700;
  line-height: 1.6;
}

.reader-quote__text p {
  margin: 0;
}
```

在 `@media (max-width: 768px)` 中加入：

```css
.reader-quote {
  padding: 22px 20px 24px;
}
```

- [ ] **Step 5: 執行測試並確認通過**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-styles.test.mjs tests/site-content.test.mjs
```

Expected: PASS。

- [ ] **Step 6: 提交家長心聲卡**

```powershell
git add index.html styles.css tests/site-styles.test.mjs tests/site-content.test.mjs
git commit -m "feat: redesign parent insight quote"
```

---

### Task 2: 導航者 Google 表單主 CTA

**Files:**
- Modify: `tests/site-marketplace.test.mjs`
- Modify: `navigator.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: 公開短網址 `https://forms.gle/GsUYYrCTFfHkA6RE8`、官方 LINE `https://lin.ee/gMMpzNy`、既有 `.button-primary`。
- Produces: 導航者頁唯一 Google Forms 主 CTA 與 `.navigator-help` 次要聯絡文字。

- [ ] **Step 1: 寫入失敗的公開連結邊界測試**

在 `tests/site-marketplace.test.mjs` 新增常數與測試：

```js
const navigatorFormUrl = 'https://forms.gle/GsUYYrCTFfHkA6RE8';

test('routes navigator applications directly to the approved public form', async () => {
  const html = await readPage('navigator.html');
  assert.match(html, new RegExp(`<a\\\\b[^>]*class=["'][^"']*button-primary[^"']*["'][^>]*href=["']${navigatorFormUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>填寫導航者申請表<\\\\/a>`, 'i'));
  assert.match(html, /填寫前有疑問？[\s\S]*?官方 LINE/i);
});
```

將全站外部連結白名單測試調整為只允許：

```js
const approvedPublicDestinations = new Set([lineUrl, navigatorFormUrl]);
```

並額外斷言 `navigatorFormUrl` 只出現在 `navigator.html`。

- [ ] **Step 2: 執行測試並確認因仍指向 LINE 而失敗**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs
```

Expected: FAIL，指出缺少 `填寫導航者申請表` 或表單短網址。

- [ ] **Step 3: 更新導航者申請區**

將 `navigator.html` 申請區更新為：

```html
<section class="content-section brand-callout navigator-apply" aria-labelledby="contact-title">
  <p class="eyebrow">開始申請</p>
  <h2 id="contact-title">申請方式</h2>
  <p>填寫申請資料，讓我們了解你的背景、動機與期待方向。</p>
  <a class="button button-primary" href="https://forms.gle/GsUYYrCTFfHkA6RE8" target="_blank" rel="noopener noreferrer">填寫導航者申請表</a>
  <p class="navigator-help">填寫前有疑問？<a href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">聯絡官方 LINE</a></p>
</section>
```

- [ ] **Step 4: 加入主次層級樣式**

在 `styles.css` 加入：

```css
.navigator-apply .button {
  min-width: min(100%, 320px);
}

.navigator-help {
  margin: 16px 0 0;
  color: var(--color-muted);
  font-size: 17px;
}

.navigator-help a {
  color: var(--color-jade-dark);
  font-weight: 800;
}
```

- [ ] **Step 5: 執行測試並確認通過**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-marketplace.test.mjs
```

Expected: PASS。

- [ ] **Step 6: 提交導航者表單動線**

```powershell
git add navigator.html styles.css tests/site-marketplace.test.mjs
git commit -m "feat: link navigator application form"
```

---

### Task 3: 快取、完整驗收與部署

**Files:**
- Modify: `index.html`
- Modify: `navigator.html`
- Modify: `gift.html`
- Modify: `refund.html`
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: 完成的 `.reader-quote` 與導航者表單 CTA。
- Produces: 所有公開頁載入相同新 CSS 版本，GitHub Pages 公開站完成部署。

- [ ] **Step 1: 將 CSS 快取鍵由 `20260725-9` 更新為 `20260725-10`**

四個公開 HTML 頁面統一使用：

```html
<link rel="stylesheet" href="styles.css?v=20260725-10">
```

同步更新 `tests/site-content.test.mjs` 的快取鍵斷言。

- [ ] **Step 2: 執行完整測試與靜態檢查**

Run:

```powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
git diff --check
```

Expected: 全部 PASS，`git diff --check` 無輸出。

- [ ] **Step 3: 啟動本機靜態站並做視覺驗收**

在隱藏視窗啟動：

```powershell
Start-Process -FilePath 'py' -ArgumentList '-3','-m','http.server','8765','--bind','127.0.0.1' -WorkingDirectory 'C:\Users\je235\Documents\網站' -WindowStyle Hidden
```

瀏覽器驗收：

- `index.html`：1280px 與 375px 的引言卡文字清楚、行長合理、無裁切。
- `navigator.html`：1280px 與 375px 的橘色表單主 CTA 明顯，LINE 為次要文字。
- 兩頁 `documentElement.scrollWidth === documentElement.clientWidth`。
- 點擊前檢查 CTA `href`，不送出 Google 表單。

- [ ] **Step 4: 提交快取與驗收契約**

```powershell
git add index.html navigator.html gift.html refund.html tests/site-content.test.mjs
git commit -m "chore: refresh public site styles"
```

- [ ] **Step 5: 推送並確認 GitHub Pages**

```powershell
git push origin main
$latestRun = gh run list --limit 1 --json databaseId,headSha,status,conclusion,url,workflowName | ConvertFrom-Json
$latestRun
gh run watch $latestRun[0].databaseId --exit-status
```

Expected: `Deploy GitHub Pages` 完成且 conclusion 為 `success`。

- [ ] **Step 6: 公開站驗收**

開啟：

```text
https://yangjetw.github.io/star-guide/index.html
https://yangjetw.github.io/star-guide/navigator.html
```

確認公開頁載入 `styles.css?v=20260725-10`、引言卡與導航者 CTA 已生效，且 Google 表單連結精確為核准短網址。
