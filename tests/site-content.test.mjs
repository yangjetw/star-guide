import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const lineUrl = 'https://lin.ee/gMMpzNy';
const read = (path) => readFile(new URL(path, root), 'utf8');

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

async function publishedTextFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryUrl = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) files.push(...await publishedTextFiles(entryUrl));
    else {
      const contents = await readFile(entryUrl);
      if (!contents.includes(0)) files.push([entryUrl, contents.toString('utf8')]);
    }
  }
  return files;
}

test('defines the zero-install static site package contract', async () => {
  assert.ok(existsSync(new URL('package.json', root)));
  assert.deepEqual(JSON.parse(await read('package.json')), { name: 'parent-star-guide', version: '1.0.0', private: true, scripts: { test: 'node --test' } });
});

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

test('includes the GitHub Pages publishing package', async () => {
  assert.ok(existsSync(new URL('.nojekyll', root)));
  assert.equal(await read('.nojekyll'), '');
  const readme = await read('README.md');
  for (const text of ['node --test', 'http.server 4173', 'GitHub Pages', 'GitHub Actions']) assert.ok(readme.includes(text));
});

test('uses GitHub Actions to deploy a clean Pages artifact', async () => {
  const workflow = await read('.github/workflows/pages.yml');
  for (const text of ['contents: read', 'pages: write', 'id-token: write', 'index.html', 'styles.css', '.nojekyll', 'assets/', 'actions/upload-pages-artifact@', 'actions/deploy-pages@']) assert.ok(workflow.includes(text));
  assert.match(workflow, /path:\s*\$\{\{\s*runner\.temp\s*\}\}\/pages-staging/);
  assert.doesNotMatch(workflow, /path:\s*\.\s*$/m);
});

test('does not publish the private redemption form identifier in deployed artifacts', async () => {
  const privatePrefix = ['1FAIp', 'QLSev'].join('');
  const files = [
    [new URL('index.html', root), await read('index.html')],
    [new URL('styles.css', root), await read('styles.css')],
    [new URL('.nojekyll', root), await read('.nojekyll')],
    ...await publishedTextFiles(new URL('assets/', root)),
  ];
  for (const [file, contents] of files) assert.ok(!contents.includes(privatePrefix), `${file.pathname} exposes a private form identifier`);
});

test('defines the Traditional Chinese HTML page contract', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('styles.css')]);
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html\s+lang=["']zh-Hant["']>/i);
  assert.match(html, /<meta\s+charset=["']UTF-8["']\s*\/?>/i);
  assert.match(html, /<meta\s+name=["']viewport["']\s+content=["']width=device-width, initial-scale=1["']\s*\/?>/i);
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css\?v=20260725-10["']\s*\/?>/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
  assert.match(html, /<meta\s+property=["']og:image["']\s+content=["']assets\/images\/hero-parent-child\.webp["']/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.ok(css.trim());
});

test('loads the warm stylesheet cache key on every public page', async () => {
  for (const page of ['index.html', 'gift.html', 'navigator.html', 'refund.html']) {
    assert.match(await read(page), /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css\?v=20260725-10["']\s*\/?>/i, `${page} should load the warm stylesheet cache key`);
  }
});

const orderedMarkers = [
  '《親子成長指南》',
  '你是否也有這些困惑？',
  '每個孩子都是獨特的',
  '我們怎麼做的？',
  '❌做測驗，❌填問卷，✅只要：',
  '一份能被慢慢打開的祝福',
  '你將得到什麼？',
  '我們的指南為什麼值這個價？',
  '指南帶來的轉變',
  '家長們的真實心聲',
  '一份屬於你與孩子的愛之地圖',
];

const expectedSectionText = {
  hero: [
    '《親子成長指南》',
    '看見孩子獨特的宇宙',
    '每個父母都想給孩子最好，只是不知道什麼才是最好。',
    '《親子成長指南》是什麼？',
    '進入官方 LINE',
  ],
  concerns: [
    '你是否也有這些困惑？',
    '情緒爆發',
    '孩子動不動就失控，我怎麼講都沒用？',
    '潛力未發揮',
    '明明很聰明卻拖拖拉拉、沒動力？',
    '教養方式不適用',
    '我的方式對別人小孩有效，對他完全無效？',
    '內心想法成謎',
    '為什麼總是跟我反著來？他到底在想什麼？',
    '不是你沒耐心，只是你沒拿到他的專屬說明書。',
  ],
  'unique-child': [
    '每個孩子都是獨特的',
    '專為3–12歲孩子設計的《親子成長指南》，是一份讓你「懂孩子」的教養工具書。',
    '父母與孩子的個性橋接',
    '翻譯彼此的差異，創造和諧親子關係',
    '個別化解讀孩子的氣質與天賦',
    '專屬你孩子的性格分析，而非套用模板',
    '情緒管理與互動衝突策略',
    '具體實用的應對方法，幫助親子溝通更順暢',
  ],
  method: [
    '我們怎麼做的？',
    '🔍 每一份《親子成長指南》，都是從一組出生資料開始',
    '✍️ 經過占星分析，解讀徵象語言',
    '🎯 應用兒童心理學，結合生活實境',
    '逐步轉化為可讀、可感、可用的內容',
    '📎 每份《親子成長指南》都由專業團隊投入數小時反覆琢磨，為每一位孩子，量身定製出能被家長真正「讀懂與使用」的指南。',
  ],
  'required-data': [
    '❌做測驗，❌填問卷，✅只要：',
    '出生時間',
    '建議誤差不超過30分鐘，以確保分析準確性',
    '出生地點',
    '提供城市即可，用於建立完整的節奏分析',
    '孩子姓名',
    '可使用暱稱，完成個人化內容',
    '父母資料',
    '選填，用於更完整的關係互動分析',
    '提供的資料會用於確認申請、製作與交付本次客製指南；可識別資料依《安心購買與服務說明》所載期限保存與刪除。另行參與回饋或研究，會以獨立說明與同意程序辦理。',
  ],
  deliverables: [
    '你將得到什麼？',
    '這份指南不只是理論，更是實用的親子溝通工具書。每一頁都經過精心設計，讓你能輕鬆理解並立即應用於日常中。',
    '📄 精心打造超過8仟字的PDF電子指南',
    '個人分析解讀',
    '詳細剖析孩子的氣質、節奏、互動偏好等特質，幫助你真正看見孩子的內在世界。',
    '情緒節點解析',
    '解讀情緒反應與家庭互動的關鍵節點，讓你能預見並妥善回應可能的衝突。',
    '實用情境範例',
    '針對常見教養場景提供具體溝通建議與策略示範，豐富你應對方式。',
    '關係節奏圖像',
    '呈現父母與孩子之間的互動模式，幫助你找到最佳的連結方式。',
    'ℹ️這份指南設計為可長期使用的成長資源，隨著孩子的發展，你可以反覆閱讀，它會是你最珍藏實用的寶典。',
  ],
  'value-comparison': [
    '我們的指南為什麼值這個價？',
    '一眼看懂差異',
    '你買的是一套真正幫你解決親子衝突的實用導航系統。',
    '產品類型',
    '價格區間',
    '通常內容',
    '我們提供',
    '一般星盤解讀（純命盤）',
    'NT$600～1200',
    '解釋行星與星座配置，無生活指導',
    '✅ 客製化分析 + 親子情境應用',
    '教養顧問線上諮詢（60分鐘）',
    'NT$1800～2500',
    '口頭建議，無書面紀錄、無後續參考',
    '✅ 可反覆閱讀 + 親子互動劇本',
    '星座親子書籍（通用版）',
    'NT$380～680',
    '通則講解，無法應用於個別孩子',
    '✅ 100%針對你的孩子與家庭配置',
    '客製化占星PDF報告',
    'NT$1800～6000',
    '偶有模版、缺少教育建議',
    '✅ 整合心理學 + 星座 + 教育策略',
    '本指南',
    'NT$3980',
    '✅ 全客製｜育兒建議',
    '❤️ 是你與孩子的理解橋梁',
  ],
  transformation: [
    '指南帶來的轉變',
    '理解行為背後原因',
    '知道孩子「為什麼那樣反應」，不再感到困惑',
    '掌握互動平衡點',
    '懂得「什麼時候放手，什麼時候給安全感」',
    '有效溝通模式',
    '擁有親子互動的具體劇本，說對話、做對事',
    '家長閱讀後的感受',
    '很多爸媽看完說：「我終於理解他不是故意頂嘴，而是用他的方式呼救。」',
  ],
  testimonials: [
    '家長們的真實心聲',
    '來自實際使用《親子成長指南》的家庭，經同意分享。',
  ],
  closing: [
    '開始你的親子理解之旅',
    '一份屬於你與孩子的愛之地圖',
    '懂，是比愛更深刻的慈悲。',
    '孩子從來不是「不懂事」，只是用另一種節奏生活。這份指南，讓你能用他的節奏靠近、理解、擁抱。理解之後，行動自然發生。這就是親子之間的真正靠近。',
    '《親子成長指南》，獻給願意陪孩子一起成長的大人。',
    '進入官方 LINE',
    '看看送禮方式',
  ],
};

const section = (html, id) => html.match(new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?<\\/section>`, 'i'))?.[0] ?? '';

const topicPages = {
  concerns: ['concerns'],
  'unique-child': ['unique-child'],
  'required-data': ['required-data'],
  deliverables: ['deliverables'],
  transformation: ['transformation'],
  closing: ['closing'],
};

const topicSection = (html, id) => (topicPages[id] ?? [id]).map((pageId) => section(html, pageId)).join(' ');

function visibleText(fragment) {
  return fragment
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/(?:a|p|h[1-6]|li|th|td|strong|blockquote|cite)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

test('groups the story into one semantic brand journey without decorative chapter-number hooks', async () => {
  const [html, css] = await Promise.all([read('index.html'), read('styles.css')]);
  const main = html.match(/<main\b[^>]*id="main-content"[\s\S]*?<\/main>/i)?.[0] ?? '';
  assert.match(main, /^<main\b[^>]*id="main-content"[^>]*>\s*<article\b[^>]*class="brand-story"/i);
  assert.match(main, /<\/article>\s*<\/main>$/i);

  for (const id of ['hero', 'concerns', 'unique-child', 'method', 'required-data', 'gift-bridge', 'deliverables', 'value-comparison', 'transformation', 'testimonials', 'role-journey', 'closing']) {
    assert.ok(section(main, id), `${id} should remain in the gift journey`);
  }

  for (const retiredId of ['concerns-details', 'unique-child-details', 'required-data-details', 'deliverables-details', 'transformation-details', 'closing-vision']) {
    assert.equal(section(main, retiredId), '', `${retiredId} should be merged into its topic chapter`);
  }

  assert.doesNotMatch(html, /\bdata-chapter=/i);
  assert.doesNotMatch(css, /\[data-chapter\]::before/i);
  assert.doesNotMatch(html, /\bbook-page\b/i);
  assert.doesNotMatch(css, /aspect-ratio:\s*4\s*\/\s*3/i);
});

test('uses professional semantic content patterns and consistent static chrome', async () => {
  const publicPages = await Promise.all(['index.html', 'gift.html', 'navigator.html', 'refund.html'].map(read));
  const homepage = publicPages[0];
  for (const marker of [
    'class="brand-story"',
    'section-shell editorial-layout',
    'class="fact-list',
    'class="process-steps"',
    'class="proof-gallery"',
    'class="action-group"',
  ]) assert.match(homepage, new RegExp(marker, 'i'));

  for (const retired of [
    'story-section-focus',
    'chapter-feature-list',
    'chapter-grid',
    'process-list',
    'testimonial-gallery',
  ]) assert.doesNotMatch(homepage, new RegExp(`\\b${retired}\\b`, 'i'));

  const extract = (html, tag) => html
    .match(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}>`, 'i'))?.[0]
    .replace(/\s+/g, ' ')
    .trim();
  const normalizedNav = (html) => extract(html, 'nav').replace(/\s+aria-current=["']page["']/gi, '');
  assert.equal(new Set(publicPages.map(normalizedNav)).size, 1);
  assert.equal(new Set(publicPages.map((html) => extract(html, 'footer'))).size, 1);
});

const brandOperatorStatement = '赫爾墨斯的小宇宙，由星學會運營。';

test('keeps the guide primary and introduces the three roles only after product proof', async () => {
  const html = await read('index.html');
  const roleJourney = section(html, 'role-journey');
  const guideStart = html.indexOf('《親子成長指南》');
  const testimonials = html.indexOf('家長們的真實心聲');
  const roles = html.indexOf('三種方式，讓理解繼續發生');
  assert.ok(guideStart >= 0 && testimonials > guideStart && roles > testimonials);
  for (const phrase of [
    '點星者',
    '領航者',
    '導航者',
  ]) assert.ok(roleJourney.includes(phrase), `${phrase} must appear in #role-journey`);
  assert.doesNotMatch(roleJourney, /<p\b[^>]*class=["'][^"']*\beyebrow\b[^"']*["']/i);
  assert.ok(html.includes(brandOperatorStatement), 'the homepage needs the exact operator statement');
});

test('uses current customer-facing metadata for navigator and assurance routes', async () => {
  const [navigator, refund] = await Promise.all([read('navigator.html'), read('refund.html')]);
  assert.match(navigator, /<title>導航者計畫｜赫爾墨斯的小宇宙<\/title>/i);
  assert.match(
    navigator,
    /<meta\s+name=["']description["']\s+content=["']認識導航者計畫：給願意陪伴家庭的大人，學習以方法、能力與責任協助多個家庭理解孩子。["']/i,
  );
  assert.match(refund, /<title>安心購買與服務說明｜赫爾墨斯的小宇宙<\/title>/i);
  assert.match(
    refund,
    /<meta\s+name=["']description["']\s+content=["']安心了解親子成長指南的購買、製作、交付、可識別資料保存與刪除，以及聯絡與狀態處理方式。["']/i,
  );
});

test('reproduces the original Gamma story in order', async () => {
  const html = await read('index.html');
  let cursor = -1;
  for (const marker of orderedMarkers) {
    const next = html.indexOf(marker, cursor + 1);
    assert.ok(next > cursor, `${marker} should appear in source order`);
    cursor = next;
  }
  for (const phrase of ['不是你沒耐心，只是你沒拿到他的專屬說明書。', '精心打造超過8仟字的PDF電子指南', '懂，是比愛更深刻的慈悲。']) assert.ok(html.includes(phrase), `${phrase} must be retained`);
});

test('routes the story into the gift marketplace without its retired payment form', async () => {
  const html = await read('index.html');
  assert.match(html, /href="gift\.html"/);
  assert.match(html, /把這份理解，送給一個你在乎的家庭/);
  assert.doesNotMatch(html, /href="https:\/\/docs[.]google[.]com\/forms/i);
});

test('retains the complete exact visible copy in every Gamma section', async () => {
  const html = await read('index.html');
  for (const [id, expectedText] of Object.entries(expectedSectionText)) {
    assert.equal(visibleText(topicSection(html, id)), expectedText.join(' '), `${id} visible copy must exactly match the approved source`);
  }
});

test('retains every original Gamma section structure', async () => {
  const html = await read('index.html');
  const uniqueChild = topicSection(html, 'unique-child');
  const requiredData = topicSection(html, 'required-data');
  const deliverables = topicSection(html, 'deliverables');
  const comparison = section(html, 'value-comparison');
  const transformation = topicSection(html, 'transformation');
  const testimonials = section(html, 'testimonials');
  const method = section(html, 'method');
  const closing = topicSection(html, 'closing');
  assert.match(transformation, /<figure\b[^>]*class="reader-quote"[\s\S]*?<figcaption\b[^>]*class="reader-quote__label">家長閱讀後的感受<\/figcaption>[\s\S]*?<blockquote\b[^>]*class="reader-quote__text">/i);
  assert.equal((uniqueChild.match(/<li\b/gi) ?? []).length, 3);
  assert.equal((requiredData.match(/<li\b/gi) ?? []).length, 4);
  assert.equal((deliverables.match(/<li\b/gi) ?? []).length, 4);
  const comparisonHeader = comparison.match(/<thead[\s\S]*?<\/thead>/i)?.[0] ?? '';
  assert.equal((comparisonHeader.match(/<th\b/gi) ?? []).length, 4);
  const comparisonBody = comparison.match(/<tbody[\s\S]*?<\/tbody>/i)?.[0] ?? '';
  assert.equal((comparisonBody.match(/<tr\b/gi) ?? []).length, 5);
  assert.equal((transformation.match(/<li\b/gi) ?? []).length, 3);
  assert.equal((testimonials.match(/<figure\b/gi) ?? []).length, 3);
  assert.equal((method.match(/<li\b/gi) ?? []).length, 4);
  assert.equal((closing.match(new RegExp(lineUrl, 'g')) ?? []).length, 1);
  assert.equal((closing.match(/href="gift\.html"/g) ?? []).length, 1);
});

test('retains the complete exact comparison-table cell copy', async () => {
  const html = await read('index.html');
  const comparison = section(html, 'value-comparison');
  const cells = [...comparison.matchAll(/<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)].map((match) => visibleText(match[1]));
  assert.deepEqual(cells, expectedSectionText['value-comparison'].slice(3));
});

test('identifies comparison table column and row headers for assistive technology', async () => {
  const html = await read('index.html');
  const comparison = section(html, 'value-comparison');
  const columnHeaders = comparison.match(/<thead[\s\S]*?<\/thead>/i)?.[0].match(/<th\b[^>]*>/gi) ?? [];
  const rowHeaders = comparison.match(/<tbody[\s\S]*?<\/tbody>/i)?.[0].match(/<th\b[^>]*>/gi) ?? [];

  assert.equal(columnHeaders.length, 4);
  assert.equal(rowHeaders.length, 5);
  for (const header of columnHeaders) assert.match(header, /\bscope="col"/i);
  for (const header of rowHeaders) assert.match(header, /\bscope="row"/i);
});

test('retains the exact visible site chrome copy', async () => {
  const html = await read('index.html');
  assert.equal(visibleText(html.match(/<a\b[^>]*class="skip-link"[\s\S]*?<\/a>/i)?.[0] ?? ''), '跳到主要內容');
  assert.equal(visibleText(html.match(/<header\b[\s\S]*?<\/header>/i)?.[0] ?? ''), '指南介紹 送一份祝福 導航者 安心購買 官方 LINE');
  assert.equal(visibleText(html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? ''), '赫爾墨斯的小宇宙 ，由星學會運營。 星學會有限公司｜統一編號 69708677 astrokidsguide@gmail.com ｜官方 LINE ｜安心購買與服務說明');
});
