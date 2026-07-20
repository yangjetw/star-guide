# Parent Star Guide Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build a large-type, mobile-first Traditional Chinese static sales website for 《親子成長指南》 that publishes directly on GitHub Pages and uses the existing LINE and Google Forms workflow.

**Architecture:** Use semantic index.html, one focused styles.css, and two SVG assets. Do not add a framework, build step, custom form, database, analytics script, or production JavaScript dependency. Node built-in tests validate content, approved URLs, privacy boundaries, accessibility contracts, and responsive CSS.

**Tech Stack:** HTML5, CSS3, SVG, Node.js node:test, GitHub Pages.

## Global Constraints

- Traditional Chinese user-facing copy.
- Static GitHub Pages deployment from repository root.
- Primary CTA: https://lin.ee/gMMpzNy
- Payment report: https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform
- The redemption form is not a homepage CTA.
- Do not expose bank or JKOPay credentials and do not collect personal data on the site.
- Plans: 1 / NT$3,980; 5 / NT$18,900 and NT$3,780 each; 12 / NT$39,800 and about NT$3,317 each.
- Palette: #101329, #1b1d3e, #dad0f5, #efcb7d, #fbf4e6.
- Headings and quotes: LXGW WenKai TC. Body and controls: Noto Sans TC.
- Desktop body: 19px. Mobile body: 18px. Mobile hero heading: at least 38px.
- At 768px and below, content becomes one column and a fixed bottom LINE CTA appears.
- Support reduced motion, keyboard navigation, visible focus, and WCAG AA text contrast.
- Verify widths 360, 390, 768, 1024, and 1440px.

---

## File Map

- index.html: semantic page, copy, plans, FAQ, LINE, and payment-report links.
- styles.css: tokens, typography, layouts, focus, reduced motion, and mobile CTA.
- assets/brand-mark.svg and assets/favicon.svg: star brand assets.
- package.json: dependency-free test script.
- tests/site-content.test.mjs: content order, offers, links, and privacy boundary.
- tests/site-accessibility.test.mjs: landmarks, headings, disclosures, and safe external links.
- tests/site-styles.test.mjs: palette, fonts, type, breakpoint, touch targets, and reduced motion.
- .nojekyll and README.md: GitHub Pages packaging and operator instructions.

### Task 1: Static Scaffold and Test Harness

**Files:**
- Create: package.json
- Create: tests/site-content.test.mjs
- Create: index.html
- Create: styles.css

**Interfaces:**
- Consumes: approved design spec.
- Produces: npm test, root index.html, root styles.css.

- [ ] **Step 1: Write the failing scaffold test**

~~~js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('root page is static Traditional Chinese HTML', async () => {
  const html = await read('index.html');
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
});

test('project has no install-time packages', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.equal(pkg.private, true);
  assert.deepEqual(pkg.scripts, { test: 'node --test' });
  assert.equal(pkg.dependencies, undefined);
  assert.equal(pkg.devDependencies, undefined);
});
~~~

- [ ] **Step 2: Run and verify failure**

Run:

~~~powershell
& 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
~~~

Expected: FAIL with ENOENT for index.html or package.json.

- [ ] **Step 3: Add the minimal implementation**

package.json:

~~~json
{"name":"parent-star-guide","version":"1.0.0","private":true,"scripts":{"test":"node --test"}}
~~~

index.html:

~~~html
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>親子成長指南｜赫爾墨斯的小宇宙</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body><main><h1>每個孩子，都是一座獨特的宇宙。</h1></main></body>
</html>
~~~

styles.css:

~~~css
:root { color-scheme: dark; }
body { margin: 0; }
~~~

- [ ] **Step 4: Run tests and verify 2 pass, 0 fail**

- [ ] **Step 5: Commit**

~~~powershell
$git = 'C:\Users\je235\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe'
& $git add package.json index.html styles.css tests/site-content.test.mjs
& $git commit -m 'test: define static site contract'
~~~

### Task 2: Complete Semantic Content and Conversion Flow

**Files:**
- Modify: tests/site-content.test.mjs
- Modify: index.html

**Interfaces:**
- Produces IDs guide, process, deliverables, plans, stories, faq; classes line-cta, payment-report-link, and exactly three plan-card articles.

- [ ] **Step 1: Add failing content tests**

~~~js
const PAYMENT = 'https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform';
const PRIVATE_REDEMPTION_ID = '私人兌換表單（網址不寫入公開 repository）';

test('required sections are present in order', async () => {
  const html = await read('index.html');
  const ids = ['guide', 'process', 'deliverables', 'plans', 'stories', 'faq'];
  const positions = ids.map((id) => html.indexOf('id="' + id + '"'));
  positions.forEach((position, index) => assert.ok(position > -1, ids[index] + ' missing'));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

test('offers and unit prices are exact', async () => {
  const html = await read('index.html');
  ['NT$3,980','NT$18,900','NT$3,780','NT$39,800','NT$3,317']
    .forEach((value) => assert.ok(html.includes(value), value + ' missing'));
  assert.equal((html.match(/class="plan-card/g) ?? []).length, 3);
});

test('only approved public destinations are exposed', async () => {
  const html = await read('index.html');
  assert.ok((html.match(/https:\/\/lin\.ee\/gMMpzNy/g) ?? []).length >= 4);
  assert.ok(html.includes(PAYMENT));
  assert.ok(!html.includes(PRIVATE_REDEMPTION_ID));
});

test('public page has no data form or payment credential', async () => {
  const html = await read('index.html');
  assert.doesNotMatch(html, /<input|<textarea|<form/i);
  assert.doesNotMatch(html, /\b\d{10,16}\b/);
  assert.doesNotMatch(html, /銀行帳號後五碼|街口暱稱/);
});
~~~

- [ ] **Step 2: Run tests and verify the new assertions fail**

- [ ] **Step 3: Implement index.html with this exact section contract**

Use one h1 and these sections in this exact order:

~~~html
<body>
  <a class="skip-link" href="#main-content">跳到主要內容</a>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="赫爾墨斯的小宇宙首頁"><img src="assets/brand-mark.svg" alt="" width="36" height="36"><span>赫爾墨斯的小宇宙</span></a>
    <nav aria-label="主要導覽"><a href="#guide">指南介紹</a><a href="#process">製作流程</a><a href="#plans">方案</a><a href="#faq">常見問題</a></nav>
    <a class="button button-gold line-cta" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">開始了解</a>
  </header>
  <main id="main-content">
    <section class="hero" id="top" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">YOUR CHILD'S UNIVERSE</p><h1 id="hero-title">每個孩子，<br>都是一座獨特的宇宙。</h1><p class="hero-lede">從出生節奏出發，讀懂孩子的個性、情緒與內在需求，為你們找到更合適的親子對話。</p><div class="button-row"><a class="button button-gold" href="#guide">了解親子指南</a><a class="button button-outline line-cta" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">加入官方 LINE</a></div></div><div class="cosmos" aria-hidden="true"><span class="star star-a">✦</span><span class="star star-b">✧</span><span class="orbit"></span></div></section>
    <section class="section section-light concerns" aria-labelledby="concerns-title"><div class="section-heading"><h2 id="concerns-title">你也曾這樣困惑嗎？</h2><p>不是你不夠耐心，只是還沒拿到屬於這個孩子的說明書。</p></div><div class="card-grid card-grid-four"><article class="info-card"><h3>情緒爆發</h3><p>孩子動不動就失控，怎麼說都沒有用？</p></article><article class="info-card"><h3>潛力未發揮</h3><p>明明很聰明，卻總是拖拖拉拉、沒有動力？</p></article><article class="info-card"><h3>教養方式失效</h3><p>同樣的方法對別人有用，為什麼不適合他？</p></article><article class="info-card"><h3>內心想法成謎</h3><p>為什麼總是跟我反著來？他到底在想什麼？</p></article></div></section>
    <section class="section section-lavender" id="guide" aria-labelledby="guide-title"><div class="section-heading"><h2 id="guide-title">一份專屬你家的關係地圖</h2><p>專為 3–12 歲孩子設計，把個性、情緒與家庭互動翻譯成日常真正能用的建議。</p></div><div class="card-grid card-grid-three"><article class="value-card"><h3>個性與天賦</h3><p>看見孩子的氣質、節奏與內在驅力。</p></article><article class="value-card"><h3>情緒與衝突</h3><p>理解爆發前的關鍵節點。</p></article><article class="value-card"><h3>親子互動</h3><p>找到彼此都能被聽見的溝通方式。</p></article></div></section>
    <section class="section section-dark" id="process" aria-labelledby="process-title"><div class="section-heading"><h2 id="process-title">指南如何誕生？</h2><p>不用測驗，也不用複雜問卷；從正確的出生資料開始。</p></div><ol class="steps"><li><span>01</span><strong>提供出生資料</strong><p>出生時間、城市與暱稱；父母資料選填。</p></li><li><span>02</span><strong>建立個人節奏</strong><p>解讀氣質與關係配置。</p></li><li><span>03</span><strong>連結生活情境</strong><p>結合兒童心理與教養場景。</p></li><li><span>04</span><strong>完成專屬指南</strong><p>交付可長期閱讀的 PDF。</p></li></ol></section>
    <section class="section section-cream" id="deliverables" aria-labelledby="deliverables-title"><div class="section-heading"><h2 id="deliverables-title">你會得到什麼？</h2><p>超過八千字的專屬 PDF，提供能立即應用的對話與行動線索。</p></div><ul class="deliverable-list"><li><strong>個人分析解讀</strong><span>氣質、節奏與互動偏好。</span></li><li><strong>情緒節點解析</strong><span>預見並回應可能的衝突。</span></li><li><strong>實用情境範例</strong><span>常見教養場景與溝通示範。</span></li><li><strong>關係節奏圖像</strong><span>找到雙方最好的連結方式。</span></li></ul></section>
    <section class="section section-light" id="plans" aria-labelledby="plans-title"><div class="section-heading"><h2 id="plans-title">選擇適合你的方案</h2><p>加入官方 LINE 取得付款資訊。付款並回報後，我們會把兌換連結寄至你的 Email。</p></div><div class="plan-grid"><article class="plan-card plan-featured"><p class="badge">初次體驗推薦</p><h3>自用方案</h3><p class="price">NT$3,980</p><p>1 份指南</p><a class="button button-gold line-cta" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">選擇自用方案</a></article><article class="plan-card"><h3>好友分享包</h3><p class="price">NT$18,900</p><p>5 份指南，每份 NT$3,780</p><a class="button button-violet line-cta" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">選擇好友分享包</a></article><article class="plan-card"><p class="badge">最優惠</p><h3>團購祝福組</h3><p class="price">NT$39,800</p><p>12 份指南，每份約 NT$3,317</p><a class="button button-violet line-cta" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">選擇團購祝福組</a></article></div><p class="paid-helper">已完成付款？ <a class="payment-report-link" href="https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform" target="_blank" rel="noopener noreferrer">前往付款回報單</a></p></section>
    <section class="section section-lavender" id="stories" aria-labelledby="stories-title"><div class="section-heading"><h2 id="stories-title">家長們的真實心聲</h2></div><div class="card-grid card-grid-three"><figure class="quote-card"><blockquote>「特質的部分確實是這樣，我終於知道怎麼靠近他。」</blockquote><figcaption>7 歲孩子的媽媽</figcaption></figure><figure class="quote-card"><blockquote>「看完後想每年都重讀一次，提醒自己多一點包容。」</blockquote><figcaption>5 歲孩子的媽媽</figcaption></figure><figure class="quote-card"><blockquote>「寫得太準了，就像為我家孩子量身寫的。」</blockquote><figcaption>4 歲孩子的爸爸</figcaption></figure></div></section>
    <section class="section section-dark" id="faq" aria-labelledby="faq-title"><div class="section-heading"><h2 id="faq-title">在開始之前</h2></div><div class="faq-list"><details><summary>出生時間不確定怎麼辦？</summary><p>建議誤差不超過 30 分鐘；無法確認時請先透過 LINE 說明。</p></details><details><summary>出生資料會如何使用？</summary><p>只用於本次指南的客製化分析與製作。</p></details><details><summary>付款後如何取得兌換連結？</summary><p>完成付款回報與人工核對後，專屬連結會寄到 Email。</p></details><details><summary>可以取消或退費嗎？</summary><p>本商品為客製化數位內容；付款並填寫製作資料後即啟動製作，恕不接受取消或退費。</p></details></div></section>
    <section class="final-cta" aria-labelledby="final-title"><p class="eyebrow">START YOUR JOURNEY</p><h2 id="final-title">懂，是比愛更深刻的慈悲。</h2><p>當你開始用孩子的節奏靠近，理解就會成為關係的起點。</p><a class="button button-gold line-cta" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">加入官方 LINE</a></section>
  </main>
  <footer class="site-footer"><p>© 赫爾墨斯的小宇宙。出生資料只用於專屬指南製作。</p><a class="payment-report-link" href="https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform" target="_blank" rel="noopener noreferrer">付款完成回報</a></footer>
  <a class="mobile-purchase line-cta" href="https://lin.ee/gMMpzNy" target="_blank" rel="noopener noreferrer">選擇方案・開始理解孩子</a>
</body>
~~~

- [ ] **Step 4: Run all content tests and verify zero failures**

- [ ] **Step 5: Commit**

~~~powershell
& $git add index.html tests/site-content.test.mjs
& $git commit -m 'feat: add guide content and conversion flow'
~~~

### Task 3: Visual System, Mobile Layout, and Accessibility

**Files:**
- Create: tests/site-styles.test.mjs
- Create: tests/site-accessibility.test.mjs
- Modify: styles.css
- Create: assets/brand-mark.svg
- Create: assets/favicon.svg
- Modify: index.html

**Interfaces:**
- Consumes Task 2 selectors.
- Produces palette tokens, large type, responsive single columns, fixed mobile CTA, visible focus, and native FAQ behavior.

- [ ] **Step 1: Write failing style and accessibility tests**

tests/site-styles.test.mjs:

~~~js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
test('palette and fonts exist', () => ['#101329','#1b1d3e','#dad0f5','#efcb7d','#fbf4e6','LXGW WenKai TC','Noto Sans TC'].forEach((v) => assert.ok(css.includes(v))));
test('large responsive type exists', () => { assert.match(css,/font-size:19px/); assert.match(css,/font-size:clamp\(38px,/); assert.match(css,/@media \(max-width:768px\)[\s\S]*font-size:18px/); });
test('touch and motion contracts exist', () => { assert.match(css,/min-height:48px/); assert.match(css,/grid-template-columns:1fr/); assert.match(css,/prefers-reduced-motion:reduce/); });
~~~

tests/site-accessibility.test.mjs:

~~~js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
test('one h1 and named landmarks exist', () => { assert.equal((html.match(/<h1\b/g) ?? []).length,1); assert.match(html,/<main id="main-content">/); assert.match(html,/<nav aria-label="主要導覽">/); });
test('FAQ and external links are safe', () => { assert.equal((html.match(/<details>/g) ?? []).length,4); [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].forEach(([tag]) => assert.match(tag,/rel="noopener noreferrer"/)); });
test('focus and reduced motion exist', () => { assert.match(css,/:focus-visible/); assert.match(css,/prefers-reduced-motion:reduce/); });
~~~

- [ ] **Step 2: Run tests and verify failures against the scaffold CSS**

- [ ] **Step 3: Implement styles.css and assets**

Implement these exact contracts:

~~~css
@import url('https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Noto+Sans+TC:wght@400;500;700&display=swap');
:root { --space:#101329; --space-2:#1b1d3e; --lavender:#dad0f5; --gold:#efcb7d; --cream:#fbf4e6; --paper:#f8f4ff; --ink:#292843; --radius:22px; }
* { box-sizing:border-box; }
html { scroll-behavior:smooth; scroll-padding-top:88px; }
body { margin:0; font-family:'Noto Sans TC',system-ui,sans-serif; font-size:19px; line-height:1.7; color:var(--paper); background:var(--space); }
h1,h2,.quote-card blockquote { font-family:'LXGW WenKai TC',serif; }
.skip-link { position:fixed; top:-80px; left:16px; z-index:100; padding:10px 14px; background:var(--gold); color:var(--space); }
.skip-link:focus { top:12px; }
:focus-visible { outline:3px solid var(--gold); outline-offset:4px; }
.site-header { position:sticky; top:0; z-index:50; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:28px; padding:14px clamp(20px,5vw,72px); background:rgb(13 16 36 / 92%); }
.brand,.button { display:inline-flex; align-items:center; text-decoration:none; }
.site-header nav { display:flex; justify-content:center; gap:24px; }
.button { justify-content:center; min-height:48px; padding:11px 20px; border-radius:999px; font-weight:700; }
.button-gold { color:var(--space); background:var(--gold); }
.button-outline { border:1px solid rgb(255 255 255 / 42%); }
.button-violet { background:#6d5da7; }
.button-row { display:flex; gap:12px; flex-wrap:wrap; }
.hero { position:relative; min-height:690px; display:grid; grid-template-columns:minmax(0,720px) 1fr; align-items:center; overflow:hidden; padding:clamp(70px,9vw,130px) clamp(24px,8vw,120px); background:radial-gradient(circle at 84% 12%,#55488b,var(--space-2) 34%,var(--space) 72%); }
.hero-copy { position:relative; z-index:2; }
.hero h1 { font-size:clamp(38px,5.2vw,72px); line-height:1.16; }
.hero-lede { max-width:680px; color:#d7d1e5; }
.cosmos { position:absolute; inset:0; pointer-events:none; }
.star { position:absolute; color:var(--gold); }
.star-a { right:12%; top:14%; font-size:92px; }
.star-b { right:28%; bottom:18%; font-size:34px; }
.orbit { position:absolute; right:-8%; top:18%; width:44vw; aspect-ratio:1; border:1px solid rgb(218 208 245 / 22%); border-radius:50%; }
.section { padding:clamp(70px,8vw,120px) clamp(24px,8vw,120px); }
.section-light { color:var(--ink); background:#f7f3ff; }
.section-lavender { color:var(--ink); background:var(--lavender); }
.section-dark { background:var(--space-2); }
.section-cream { color:var(--ink); background:var(--cream); }
.section-heading { display:grid; grid-template-columns:.9fr 1.1fr; gap:40px; align-items:end; }
.section-heading h2,.final-cta h2 { font-size:clamp(34px,4vw,52px); }
.card-grid,.plan-grid { display:grid; gap:18px; }
.card-grid-four { grid-template-columns:repeat(4,1fr); }
.card-grid-three,.plan-grid { grid-template-columns:repeat(3,1fr); }
.info-card,.value-card,.quote-card,.plan-card { padding:26px; border-radius:var(--radius); background:rgb(255 255 255 / 74%); }
.steps { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; padding:0; list-style:none; }
.deliverable-list { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0; list-style:none; }
.plan-card { display:flex; flex-direction:column; min-height:330px; color:var(--ink); background:white; }
.plan-card .button { margin-top:auto; }
.plan-featured { color:var(--paper); background:#242746; border:2px solid var(--gold); }
.price { font-size:36px; font-weight:700; }
.faq-list { display:grid; gap:12px; max-width:980px; margin:auto; }
.faq-list details { border:1px solid rgb(255 255 255 / 12%); border-radius:16px; }
.faq-list summary { min-height:48px; padding:18px 22px; cursor:pointer; }
.final-cta { padding:100px 24px; text-align:center; background:radial-gradient(circle at 50% 0,#55488b,var(--space)); }
.site-footer { display:flex; justify-content:space-between; gap:24px; padding:28px clamp(24px,8vw,120px); background:#0b0d20; }
.mobile-purchase { display:none; }
@media (max-width:1024px) { .site-header nav { display:none; } .card-grid-four,.steps { grid-template-columns:1fr 1fr; } }
@media (max-width:768px) {
  body { padding-bottom:82px; font-size:18px; }
  .hero { min-height:650px; grid-template-columns:1fr; padding:72px 22px 54px; }
  .hero h1 { font-size:clamp(38px,11vw,46px); }
  .button-row > * { width:100%; }
  .section { padding:66px 20px; }
  .section-heading,.card-grid-four,.card-grid-three,.plan-grid,.steps,.deliverable-list { grid-template-columns:1fr; }
  .site-footer { flex-direction:column; padding:28px 20px; }
  .mobile-purchase { position:fixed; z-index:60; right:12px; bottom:10px; left:12px; display:flex; align-items:center; justify-content:center; min-height:54px; border-radius:18px; color:var(--space); background:var(--gold); text-decoration:none; }
}
@media (prefers-reduced-motion:reduce) { html { scroll-behavior:auto; } *,*::before,*::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
~~~

Create both SVG files:

~~~svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="29" fill="#1b1d3e" stroke="#efcb7d" stroke-width="2"/><path fill="#efcb7d" d="M32 10c2.8 12.8 8.2 18.2 21 21-12.8 2.8-18.2 8.2-21 21-2.8-12.8-8.2-18.2-21-21 12.8-2.8 18.2-8.2 21-21Z"/></svg>
~~~

Add this exact metadata inside the document head:

~~~html
<meta name="description" content="從出生節奏出發，讀懂 3–12 歲孩子的個性、情緒與親子互動。">
<meta name="theme-color" content="#101329">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
~~~

- [ ] **Step 4: Run all tests, then keyboard-check skip link, navigation, CTAs, and FAQ**

- [ ] **Step 5: Commit**

~~~powershell
& $git add index.html styles.css assets tests/site-styles.test.mjs tests/site-accessibility.test.mjs
& $git commit -m 'feat: add accessible starry responsive design'
~~~

### Task 4: GitHub Pages Packaging and Final Verification

**Files:**
- Create: .nojekyll
- Create: README.md
- Modify: tests/site-content.test.mjs

**Interfaces:**
- Produces a repository-root Pages artifact and verified desktop/mobile result.

- [ ] **Step 1: Add a failing packaging test**

~~~js
test('GitHub Pages marker and instructions exist', async () => {
  const marker = await read('.nojekyll');
  const readme = await read('README.md');
  assert.equal(marker, '');
  assert.match(readme, /node --test/);
  assert.match(readme, /http\.server 4173/);
  assert.match(readme, /GitHub Pages/);
});
~~~

- [ ] **Step 2: Run and verify failure for .nojekyll and README.md**

- [ ] **Step 3: Create packaging files**

Create an empty .nojekyll. README.md must contain:

~~~markdown
# 赫爾墨斯的小宇宙・親子成長指南

純 HTML/CSS 靜態網站，可直接發佈至 GitHub Pages。

## 測試
執行 node --test。

## 本機預覽
執行 python -m http.server 4173，開啟 http://localhost:4173。

## GitHub Pages
推送到 GitHub 後，在 Settings → Pages 選擇 GitHub Actions，讓 workflow 以乾淨 staging directory 發佈 allowlist 內的網站檔案。發佈後驗證 LINE、付款回報表單、手機版與 FAQ。

## 資料邊界
本站不收集個人資料。付款回報與指南申請由既有 Google Forms 處理；公開原始碼不包含收款帳號。
~~~

- [ ] **Step 4: Run final automated and browser verification**

Run node --test and require zero failures. Start python -m http.server 4173. Inspect 360, 390, 768, 1024, and 1440px. Require no horizontal overflow, no clipped heading, correct plan order, unobscured footer, exact LINE and payment-report destinations, readable FAQ, and zero page-authored console errors.

- [ ] **Step 5: Commit**

~~~powershell
& $git add .nojekyll README.md tests/site-content.test.mjs
& $git commit -m 'docs: add GitHub Pages publishing guide'
& $git status --short
~~~

Expected: zero tracked changes.

## Final Verification Checklist

- [ ] node --test has zero failures.
- [ ] Browser console has no site-authored error.
- [ ] Widths 360, 390, 768, 1024, and 1440px are verified.
- [ ] Every primary CTA opens the approved LINE URL.
- [ ] Both payment-report links open the approved Google Form.
- [ ] Redemption form ID is absent from index.html.
- [ ] No data form or payment credentials appear in public site files.
- [ ] Large type, selected fonts, focus, and reduced motion match the approved design.
