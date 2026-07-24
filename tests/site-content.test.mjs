import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const lineUrl = 'https://lin.ee/gMMpzNy';
const paymentReportUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSffcXc1FyJsZwo8qBXpAna4_lMZ_n04s4t9wWYlo5NSD1qxUQ/viewform';
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
  assert.match(html, /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']\s*\/?>/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
  assert.match(html, /<meta\s+property=["']og:image["']\s+content=["']assets\/images\/hero-parent-child\.webp["']/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.ok(css.trim());
});

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

const expectedSectionText = {
  hero: [
    '《親子成長指南》',
    '看見孩子獨特的宇宙',
    '每個父母都想給孩子最好，只是不知道什麼才是最好。',
    '《親子成長指南》是什麼？',
    '加入官方 Line',
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
    '資料僅用於本次內容客製化。應用範圍不涉及個人識別，敬請安心。',
  ],
  pricing: [
    '方案價格？',
    'NT$3980',
    '包含1位孩子的完整分析報告，以及家長與孩子的節奏互動解讀',
    '完成付款後回報',
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
    '很多爸媽看完說：「我終於理解他不是故意頂嘴，而是用他的方式呼救。」',
  ],
  testimonials: [
    '家長們的真實心聲',
    '「特質的部份確實是這樣，我的月摩羯也是。」',
    '7歲娃的媽媽',
    '「看完後想每年都看一次，提醒自己多一點包容。」',
    '5歲娃的媽媽',
    '「寫得太準了，根本就是我家小孩的個性寫照。」',
    '4歲娃的爸爸',
  ],
  closing: [
    '開始你的親子理解之旅',
    '一份屬於你與孩子的愛之地圖',
    '懂，是比愛更深刻的慈悲。',
    '孩子從來不是「不懂事」，只是用另一種節奏生活。這份指南，讓你能用他的節奏靠近、理解、擁抱。理解之後，行動自然發生。這就是親子之間的真正靠近。',
    '《親子成長指南》，獻給願意陪孩子一起成長的大人。',
    '加入官方 Line',
    '完成付款後回報',
  ],
};

const section = (html, id) => html.match(new RegExp(`<section\\b[^>]*id="${id}"[\\s\\S]*?<\\/section>`, 'i'))?.[0] ?? '';

function visibleText(fragment) {
  return fragment
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/(?:a|p|h[1-6]|li|th|td|strong|blockquote|cite)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

test('groups the story into one book page with seven non-copy chapter hooks', async () => {
  const html = await read('index.html');
  const main = html.match(/<main\b[^>]*id="main-content"[\s\S]*?<\/main>/i)?.[0] ?? '';
  assert.match(main, /^<main\b[^>]*id="main-content"[^>]*>\s*<div\b[^>]*class="book-page"/i);
  assert.match(main, /<\/div>\s*<\/main>$/i);

  const chapters = {
    concerns: '01',
    'unique-child': '02',
    method: '03',
    'required-data': '04',
    deliverables: '05',
    transformation: '06',
    testimonials: '07',
  };

  for (const [id, chapter] of Object.entries(chapters)) {
    assert.match(section(html, id), new RegExp(`data-chapter="${chapter}"`, 'i'));
  }

  assert.equal((html.match(/\bdata-chapter="\d{2}"/g) ?? []).length, 7);
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
  assert.match(html, /把這份理解送給一個家庭/);
  assert.doesNotMatch(html, /href="https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSffc/);
});

test('retains the complete exact visible copy in every Gamma section', async () => {
  const html = await read('index.html');
  for (const [id, expectedText] of Object.entries(expectedSectionText)) {
    assert.equal(visibleText(section(html, id)), expectedText.join(' '), `${id} visible copy must exactly match the approved source`);
  }
});

test('retains every original Gamma section structure', async () => {
  const html = await read('index.html');
  const uniqueChild = section(html, 'unique-child');
  const requiredData = section(html, 'required-data');
  const deliverables = section(html, 'deliverables');
  const comparison = section(html, 'value-comparison');
  const transformation = section(html, 'transformation');
  const testimonials = section(html, 'testimonials');
  const method = section(html, 'method');
  const closing = section(html, 'closing');
  assert.equal((uniqueChild.match(/<article\b/gi) ?? []).length, 3);
  assert.equal((requiredData.match(/<article\b/gi) ?? []).length, 4);
  assert.equal((deliverables.match(/<article\b/gi) ?? []).length, 4);
  const comparisonHeader = comparison.match(/<thead[\s\S]*?<\/thead>/i)?.[0] ?? '';
  assert.equal((comparisonHeader.match(/<th\b/gi) ?? []).length, 4);
  const comparisonBody = comparison.match(/<tbody[\s\S]*?<\/tbody>/i)?.[0] ?? '';
  assert.equal((comparisonBody.match(/<tr\b/gi) ?? []).length, 5);
  assert.equal((transformation.match(/<article\b/gi) ?? []).length, 3);
  assert.equal((testimonials.match(/<blockquote\b/gi) ?? []).length, 3);
  assert.equal((method.match(/<li\b/gi) ?? []).length, 4);
  assert.equal((closing.match(new RegExp(lineUrl, 'g')) ?? []).length, 1);
  assert.equal((closing.match(new RegExp(paymentReportUrl, 'g')) ?? []).length, 1);
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
  assert.equal(visibleText(html.match(/<header\b[\s\S]*?<\/header>/i)?.[0] ?? ''), '赫爾墨斯的小宇宙 加入官方 Line');
  assert.equal(visibleText(html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] ?? ''), '© 2026 赫爾墨斯的小宇宙');
});
