# Google 表單與研究流程 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不更換現有申請表網址及兌換碼預填欄位的前提下，重整指南申請表、建立交付後回饋表，並以研究編號安全串接星盤特徵、指南版本與家長回饋。

**Architecture:** 現有 Google Form 與回覆試算表繼續作為申請入口及作業資料來源；Apps Script 改以欄名而非固定欄號讀取回覆，並新增表單配置、研究編號、回饋邀請、保存期限及彙整報告模組。可識別作業資料在交付後 90 日清除；另經同意的研究資料以隨機研究編號分表保存 5 年，只供內部查詢，對外只產生符合樣本門檻的彙整報告。

**Tech Stack:** Google Forms、Google Sheets、Google Apps Script V8、Google Maps Geocoding／Timezone API、OpenAI、Node.js `node:test`、HTML/CSS 靜態網站。

## Global Constraints

- 使用現有正式申請表及公開網址；識別碼只存於 Apps Script Properties 的 `APPLICATION_FORM_ID`，不得寫入 Git。
- 使用現有正式回覆試算表；識別碼只存於 Apps Script Properties 的 `RESPONSE_SPREADSHEET_ID`，不得寫入 Git。
- 保留既有「兌換碼」問題本身及預填欄位識別；識別只存於 `REDEMPTION_ENTRY_ID`，不得刪除後重建或寫入 Git。
- `STAR-年份-XXXX` 與 `GIFT-年份-XXXX` 是對外格式簡稱；實際系統延續目前驗證規則，使用 `STAR-YYYY-XXXXXX` 與 `GIFT-YYYY-XXXXXX` 六碼英數亂數，不使用 `TEST` 前綴。
- 不使用 n8n；排程只使用 Google Apps Script installable triggers。
- 孩子出生日期、時間、城市、性別及時間可靠確認全部必填。
- 至少一位家長的身分與出生日期必填；家長出生時間與城市可留白。
- 指南申請不強迫參與研究；研究同意只在交付後回饋表取得。
- Email、暱稱、兌換碼與原始出生資料於指南交付後 90 日清除；依法保存的訂單、付款及發票資料另表保存。
- 經研究同意的研究編號資料內部保存 5 年；不得建立逐筆公開查詢。
- 第一份公開趨勢報告至少需要 100 份有效回饋；每個公開分類至少 20 份。
- 只有彙整且無法合理回推個人的公開報告可長期保存。
- 在把正式出生資料送往 OpenAI 前，重新核對當時有效的官方資料使用與保存政策；只使用已在告知內容列明的服務。
- 正式表單或試算表的任何破壞性變更前，先建立可還原備份。

---

## File Structure

### Create

- `apps-script/star-guide/Config.gs` — 表單 ID、欄名別名、保存期限、工作表名稱及同意版本。
- `apps-script/star-guide/Core.gs` — 可在 Node 測試的純函式：欄名解析、研究編號、日期與去識別化文字處理。
- `apps-script/star-guide/FormSetup.gs` — 重整現有申請表、建立回饋表及安裝觸發器。
- `apps-script/star-guide/Research.gs` — 建立研究編號、記錄同意、產生預填回饋連結及匯入研究資料。
- `apps-script/star-guide/Retention.gs` — 90 日清除、5 年到期處理及稽核紀錄。
- `apps-script/star-guide/TrendReports.gs` — 100 份門檻、20 份小群組抑制與年度彙整。
- `apps-script/star-guide/README.md` — Apps Script 部署、回復與例行操作說明。
- `tests/apps-script-loader.mjs` — 以 Node `vm` 載入 Apps Script 純函式及設定。
- `tests/apps-script-core.test.mjs` — 欄名解析、研究編號及文字清理測試。
- `tests/apps-script-form-contract.test.mjs` — 表單題目、必填與保存規則合約測試。
- `tests/apps-script-research.test.mjs` — 研究邀請、配對與同意狀態測試。
- `tests/apps-script-retention.test.mjs` — 90 日及 5 年到期測試。
- `tests/apps-script-trends.test.mjs` — 100／20 筆門檻及公開欄位測試。
- `docs/operations/google-form-research-runbook.md` — 一人公司可執行的備份、交付、刪除、撤回與年度報告手冊。

### Mirror and modify

- `apps-script/star-guide/Code.gs` — 從目前綁定試算表的 Apps Script 匯出；保留既有發碼、兌換、地理編碼、時區與寄信流程，將表單回覆讀取改成欄名查找。
- Live Google Form（由 `APPLICATION_FORM_ID` 指定）— 依合約重整五個區段。
- Live Google Sheet（由 `RESPONSE_SPREADSHEET_ID` 指定）— 新增研究工作表，不刪除歷史回覆。
- Live bound Apps Script project — 與 `apps-script/star-guide/*.gs` 同步。

---

### Task 1: 建立可還原的正式資料備份與本機來源鏡像

**Files:**
- Create: `apps-script/star-guide/Code.gs`
- Create: `apps-script/star-guide/README.md`
- Create: `docs/operations/google-form-research-runbook.md`

**Interfaces:**
- Consumes: 現有 Google Form、回覆試算表及綁定 Apps Script。
- Produces: 可回復的 Drive 備份、本機 `Code.gs`、現況欄位清單與 Script Properties 清單。

- [ ] **Step 1: 記錄正式資源識別**

在 runbook 寫入：

```markdown
## 正式資源

- 申請表：由 Apps Script Property `APPLICATION_FORM_ID` 指定
- 公開表單網址：只記錄於星學會的私人營運文件，不提交 Git
- 回覆試算表：由 Apps Script Property `RESPONSE_SPREADSHEET_ID` 指定
- 兌換碼預填欄位：由 Apps Script Property `REDEMPTION_ENTRY_ID` 指定
```

- [ ] **Step 2: 在 Google Drive 建立兩份備份**

建立：

- `BACKUP-申請兌換親子成長指南-2026-07-25`
- `BACKUP-親子成長指南回覆資料-2026-07-25`

驗證備份表單可預覽，備份試算表包含所有工作表、Apps Script 綁定關係與現有回覆。

- [ ] **Step 3: 匯出 Apps Script**

從回覆試算表的「擴充功能 → Apps Script」逐檔複製目前正式程式至 `apps-script/star-guide/Code.gs`。不得使用附件中的亂碼版本取代正式程式。

- [ ] **Step 4: 記錄現況**

在 runbook 加入：

```markdown
## 變更前基準

- 申請表區段數：2
- 兌換碼題目 ID：核對後只存於 `REDEMPTION_ENTRY_ID`
- 表單回覆目的地：表單回應 2
- Apps Script 觸發器：逐項記錄名稱、事件來源與執行函式
- Script Properties：只記錄 key 名稱，不記錄 API 金鑰值
```

- [ ] **Step 5: 驗證本機鏡像未遺漏**

Run:

```powershell
rg -n "sendRedemptionEmail|validateRedemptionCode|processDataInProcessingSheet|geocodeAddress|getTimezone" apps-script/star-guide/Code.gs
```

Expected: 五個既有函式均至少出現一次。

- [ ] **Step 6: Commit**

```powershell
git add apps-script/star-guide/Code.gs apps-script/star-guide/README.md docs/operations/google-form-research-runbook.md
git commit -m "chore: mirror live guide workflow"
```

---

### Task 2: 建立表單及研究資料合約的失敗測試

**Files:**
- Create: `apps-script/star-guide/Config.gs`
- Create: `tests/apps-script-loader.mjs`
- Create: `tests/apps-script-form-contract.test.mjs`
- Create: `tests/apps-script-core.test.mjs`

**Interfaces:**
- Consumes: 規格中的題目、必填規則、ID 與保存期限。
- Produces: `STAR_GUIDE_CONFIG`、`APPLICATION_FORM_SPEC`、`FEEDBACK_FORM_SPEC` 合約。

- [ ] **Step 1: 建立最小設定檔**

在 `Config.gs` 先只加入：

```javascript
var STAR_GUIDE_CONFIG = Object.freeze({
  applicationFormIdProperty: 'APPLICATION_FORM_ID',
  responseSpreadsheetIdProperty: 'RESPONSE_SPREADSHEET_ID',
  redemptionEntryIdProperty: 'REDEMPTION_ENTRY_ID',
  applicationSections: 5,
  studyPrefix: 'SGR',
  operationalRetentionDays: 90,
  researchRetentionYears: 5,
  firstReportMinimum: 100,
  publicGroupMinimum: 20,
  consentVersion: '2026-07-25-v1'
});
```

- [ ] **Step 2: 建立 Apps Script loader**

在 `tests/apps-script-loader.mjs`：

```javascript
import fs from 'node:fs';
import vm from 'node:vm';

export function loadAppsScriptFiles(paths) {
  const context = vm.createContext({ console, Date, JSON, Math, Object, RegExp });
  for (const path of paths) {
    vm.runInContext(fs.readFileSync(path, 'utf8'), context, { filename: path });
  }
  return context;
}
```

- [ ] **Step 3: 撰寫表單合約失敗測試**

在 `tests/apps-script-form-contract.test.mjs` 驗證：

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAppsScriptFiles } from './apps-script-loader.mjs';

const context = loadAppsScriptFiles(['apps-script/star-guide/Config.gs']);

test('application form preserves the redemption question', () => {
  assert.equal(context.STAR_GUIDE_CONFIG.redemptionEntryIdProperty, 'REDEMPTION_ENTRY_ID');
  assert.ok(context.APPLICATION_FORM_SPEC.some(
    item => item.title === '兌換碼' && item.preserveExisting === true && item.required === true
  ));
});

test('child data and one primary parent birth date are required', () => {
  const byTitle = Object.fromEntries(context.APPLICATION_FORM_SPEC.map(item => [item.title, item]));
  for (const title of ['孩子暱稱', '孩子性別', '孩子出生日期', '孩子出生時間', '孩子出生城市', '出生時間準確度確認', '主要家長身分', '主要家長出生日期']) {
    assert.equal(byTitle[title].required, true, title);
  }
  for (const title of ['主要家長出生時間', '主要家長出生城市', '第二位家長身分', '第二位家長出生日期', '第二位家長出生時間', '第二位家長出生城市']) {
    assert.equal(byTitle[title].required, false, title);
  }
});

test('research is optional relative to guide application', () => {
  const invite = context.APPLICATION_FORM_SPEC.find(item => item.title === '回饋邀請');
  assert.equal(invite.required, false);
  assert.equal(context.FEEDBACK_FORM_SPEC.find(item => item.title === '研究資料配對、保存與內部分析同意').required, true);
});
```

- [ ] **Step 4: 撰寫核心函式失敗測試**

在 `tests/apps-script-core.test.mjs`：

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAppsScriptFiles } from './apps-script-loader.mjs';

const context = loadAppsScriptFiles([
  'apps-script/star-guide/Config.gs',
  'apps-script/star-guide/Core.gs'
]);

test('study ID is random-looking and not derived from personal data', () => {
  assert.equal(context.makeStudyId_(2026, 'A1B2C3'), 'SGR-2026-A1B2C3');
  assert.match(context.makeStudyId_(2026, '9Z8Y7X'), /^SGR-2026-[A-Z0-9]{6}$/);
});

test('header aliases support old and new form titles', () => {
  const map = context.buildHeaderMap_(['主角（孩子）暱稱', '主角（Protagonist）生日', '主角（Protagonist）出生地']);
  assert.equal(context.findHeaderIndex_(map, ['孩子暱稱', '主角（孩子）暱稱']), 0);
  assert.equal(context.findHeaderIndex_(map, ['孩子出生日期與時間', '主角（Protagonist）生日']), 1);
});

test('missing parent time is preserved as unknown instead of invented', () => {
  const record = context.buildBirthRecord_('1985-05-03', '', '台北');
  assert.equal(record.completeness, 'DATE_LOCATION');
  assert.equal(record.birthTime, null);
});
```

- [ ] **Step 5: Run tests to verify they fail**

Run:

```powershell
npm test -- tests/apps-script-form-contract.test.mjs tests/apps-script-core.test.mjs
```

Expected: FAIL because `APPLICATION_FORM_SPEC`, `FEEDBACK_FORM_SPEC`, `Core.gs` and pure functions do not exist.

- [ ] **Step 6: Commit failing tests**

```powershell
git add apps-script/star-guide/Config.gs tests/apps-script-loader.mjs tests/apps-script-form-contract.test.mjs tests/apps-script-core.test.mjs
git commit -m "test: define guide form and research contracts"
```

---

### Task 3: 實作設定、欄名解析與研究編號純函式

**Files:**
- Modify: `apps-script/star-guide/Config.gs`
- Create: `apps-script/star-guide/Core.gs`
- Modify: `apps-script/star-guide/Code.gs`
- Test: `tests/apps-script-form-contract.test.mjs`
- Test: `tests/apps-script-core.test.mjs`

**Interfaces:**
- Produces:
  - `buildHeaderMap_(headers: string[]): Object<string, number>`
  - `findHeaderIndex_(headerMap: Object, aliases: string[]): number`
  - `valueByAliases_(row: any[], headerMap: Object, aliases: string[]): any`
  - `classifyBirthCompleteness_(dateValue: any, timeValue: any, city: string): string`
  - `buildBirthRecord_(dateValue: any, timeValue: any, city: string): Object`
  - `makeStudyId_(year: number, entropy: string): string`
  - `randomStudyId_(): string`
  - `sanitizeFeedbackText_(text: string): string`

- [ ] **Step 1: 實作完整表單合約**

在 `Config.gs` 加入五個區段及所有題目。每個 item 使用一致結構：

```javascript
var APPLICATION_FORM_SPEC = Object.freeze([
  { kind: 'section', title: '申請前說明與個資告知' },
  { kind: 'checkbox', title: '個人資料蒐集、處理與利用同意', required: true, choices: ['我已閱讀並同意上述說明。'] },
  { kind: 'section', title: '申請與交付資料' },
  { kind: 'text', title: '兌換碼', required: true, preserveExisting: true },
  { kind: 'text', title: '申請者稱呼', required: true },
  { kind: 'multipleChoice', title: '申請者所在國家／地區', required: true, choices: ['台灣地區', '中國大陸地區', '其他地區（包含香港、澳門及海外）'] },
  { kind: 'checkbox', title: '客製化服務啟動與退費確認', required: true, choices: ['我已閱讀並同意客製化服務啟動與退費說明。'] },
  { kind: 'section', title: '孩子的必要資料' },
  { kind: 'text', title: '孩子暱稱', required: true },
  { kind: 'multipleChoice', title: '孩子性別', required: true, choices: ['男孩', '女孩'] },
  { kind: 'date', title: '孩子出生日期', required: true },
  { kind: 'time', title: '孩子出生時間', required: true },
  { kind: 'text', title: '孩子出生城市', required: true },
  { kind: 'checkbox', title: '出生時間準確度確認', required: true, choices: ['我確認孩子的出生時間可靠，建議誤差不超過30分鐘。'] },
  { kind: 'section', title: '家長資料' },
  { kind: 'multipleChoice', title: '主要家長身分', required: true, choices: ['父親', '母親'] },
  { kind: 'date', title: '主要家長出生日期', required: true },
  { kind: 'time', title: '主要家長出生時間', required: false },
  { kind: 'text', title: '主要家長出生城市', required: false },
  { kind: 'multipleChoice', title: '第二位家長身分', required: false, choices: ['父親', '母親'] },
  { kind: 'date', title: '第二位家長出生日期', required: false },
  { kind: 'time', title: '第二位家長出生時間', required: false },
  { kind: 'text', title: '第二位家長出生城市', required: false },
  { kind: 'section', title: '最終確認' },
  { kind: 'checkbox', title: '父母或法定代理人確認', required: true, choices: ['我是孩子的父母或法定代理人，並有權提供上述資料。'] },
  { kind: 'checkbox', title: '資料正確與開始製作確認', required: true, choices: ['我確認資料正確，並同意開始製作客製化指南。'] },
  { kind: 'checkbox', title: '回饋邀請', required: false, choices: ['我願意在指南交付後收到一次回饋邀請。'] }
]);
```

`FEEDBACK_FORM_SPEC` 以 `var FEEDBACK_FORM_SPEC = Object.freeze([...])` 宣告，至少包含研究編號、研究同意、閱讀完成度、五點符合度、五點幫助度、正向與負向文字回饋、追蹤聯絡同意。使用 `var` 是為了讓 Node `vm` 合約測試與 Apps Script 全域環境都能讀取同一份設定。

- [ ] **Step 2: 實作純函式**

在 `Core.gs`：

```javascript
function buildHeaderMap_(headers) {
  return headers.reduce(function (map, header, index) {
    map[String(header).trim()] = index;
    return map;
  }, {});
}

function findHeaderIndex_(headerMap, aliases) {
  for (var i = 0; i < aliases.length; i += 1) {
    if (Object.prototype.hasOwnProperty.call(headerMap, aliases[i])) return headerMap[aliases[i]];
  }
  return -1;
}

function valueByAliases_(row, headerMap, aliases) {
  var index = findHeaderIndex_(headerMap, aliases);
  return index < 0 ? '' : row[index];
}

function classifyBirthCompleteness_(dateValue, timeValue, city) {
  if (!dateValue) return 'EMPTY';
  if (timeValue && city) return 'FULL';
  if (timeValue) return 'DATE_TIME';
  if (city) return 'DATE_LOCATION';
  return 'DATE_ONLY';
}

function buildBirthRecord_(dateValue, timeValue, city) {
  return {
    birthDate: dateValue || null,
    birthTime: timeValue || null,
    birthCity: String(city || '').trim() || null,
    completeness: classifyBirthCompleteness_(dateValue, timeValue, city)
  };
}

function makeStudyId_(year, entropy) {
  var normalized = String(entropy).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  if (normalized.length !== 6) throw new Error('研究編號亂數必須為6碼');
  return STAR_GUIDE_CONFIG.studyPrefix + '-' + year + '-' + normalized;
}

function randomStudyId_() {
  var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid() + new Date().getTime());
  var entropy = '';
  for (var i = 0; i < 6; i += 1) entropy += alphabet.charAt(Math.abs(bytes[i]) % alphabet.length);
  return makeStudyId_(new Date().getFullYear(), entropy);
}

function sanitizeFeedbackText_(text) {
  return String(text || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[已移除Email]')
    .replace(/(?:\+?886[-\s]?)?0?9\d{2}[-\s]?\d{3}[-\s]?\d{3}/g, '[已移除電話]')
    .replace(/https?:\/\/\S+/gi, '[已移除連結]')
    .trim();
}
```

- [ ] **Step 3: 將表單回覆讀取改為欄名**

在 `Code.gs` 的表單提交處理函式中，以第一列建立 `headerMap`，用以下別名讀取：

```javascript
var GUIDE_HEADER_ALIASES = Object.freeze({
  applicantEmail: ['電子郵件地址', '電子郵件'],
  redemptionCode: ['兌換碼'],
  applicantName: ['申請者稱呼', '怎麼稱呼？'],
  applicantRegion: ['申請者所在國家／地區', '您現居地'],
  childNickname: ['孩子暱稱', '主角（孩子）暱稱'],
  childGender: ['孩子性別', '主角（Protagonist）性別'],
  childDate: ['孩子出生日期'],
  childTime: ['孩子出生時間'],
  childLegacyDatetime: ['主角（Protagonist）生日'],
  childLocation: ['孩子出生城市', '主角（Protagonist）出生地'],
  primaryParentRole: ['主要家長身分', '您是孩子的'],
  primaryParentDate: ['主要家長出生日期'],
  primaryParentTime: ['主要家長出生時間'],
  primaryParentLocation: ['主要家長出生城市'],
  secondParentRole: ['第二位家長身分'],
  secondParentDate: ['第二位家長出生日期'],
  secondParentTime: ['第二位家長出生時間'],
  secondParentLocation: ['第二位家長出生城市'],
  feedbackInvite: ['回饋邀請']
});
```

舊回覆仍可由 legacy aliases 讀取；新回覆不得再依固定欄號讀取。

新 payload 對每位人物分開保存 `birthDate`、`birthTime`、`birthCity` 與 `completeness`。孩子必須為 `FULL` 且已完成時間可靠確認；家長可為 `DATE_ONLY`、`DATE_TIME` 或 `DATE_LOCATION`。不得為缺少時間的家長自動填入中午或其他推測時間；Python 只計算不依賴出生時間的特徵，並省略上升、宮位及其他時間敏感結果。

- [ ] **Step 4: Run focused tests**

Run:

```powershell
npm test -- tests/apps-script-form-contract.test.mjs tests/apps-script-core.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Run all tests**

Run:

```powershell
npm test
```

Expected: all existing site tests and new Apps Script tests pass.

- [ ] **Step 6: Commit**

```powershell
git add apps-script/star-guide/Config.gs apps-script/star-guide/Core.gs apps-script/star-guide/Code.gs tests/apps-script-form-contract.test.mjs tests/apps-script-core.test.mjs
git commit -m "feat: add stable form data contracts"
```

---

### Task 4: 以可重複執行的程式重整現有申請表

**Files:**
- Create: `apps-script/star-guide/FormSetup.gs`
- Modify: `tests/apps-script-form-contract.test.mjs`
- Modify: `docs/operations/google-form-research-runbook.md`

**Interfaces:**
- Consumes: `APPLICATION_FORM_SPEC`
- Produces:
  - `configureApplicationForm(): Object`
  - `{ formId, publishedUrl, redemptionPrefillUrl, itemSummary }`

- [ ] **Step 1: 新增失敗測試**

增加靜態合約測試，要求：

```javascript
assert.equal(context.STAR_GUIDE_CONFIG.applicationSections, 5);
assert.equal(context.STAR_GUIDE_CONFIG.operationalRetentionDays, 90);
assert.equal(context.STAR_GUIDE_CONFIG.researchRetentionYears, 5);
assert.equal(context.STAR_GUIDE_CONFIG.firstReportMinimum, 100);
assert.equal(context.STAR_GUIDE_CONFIG.publicGroupMinimum, 20);
```

- [ ] **Step 2: 實作 item upsert**

`FormSetup.gs` 必須先取得並保留現有兌換碼 item：

```javascript
function findUniqueItemByTitle_(form, title) {
  var matches = form.getItems().filter(function (item) { return item.getTitle().trim() === title; });
  if (matches.length !== 1) throw new Error('預期唯一題目「' + title + '」，實際為 ' + matches.length + ' 題');
  return matches[0];
}
```

`configureApplicationForm()` 執行順序：

1. `FormApp.openById(STAR_GUIDE_CONFIG.applicationFormId)`。
2. 取得「兌換碼」item 與其 ID。
3. 刪除所有不在新規格且不需保留的舊題目；不得刪除兌換碼 item。
4. 依 `APPLICATION_FORM_SPEC` 新增／移動五個區段與題目。
5. 設定表單標題、說明、進度列、成功訊息與回覆收集設定。
6. 以現有兌換碼 item 產生測試預填 URL，確認包含 Script Property `REDEMPTION_ENTRY_ID` 對應的欄位識別。
7. 若兌換碼 ID 改變，立即丟出錯誤並停止，不得發布。

- [ ] **Step 3: 在備份表單先演練**

將 `applicationFormId` 暫時指向 Task 1 的備份表單，執行 `configureApplicationForm()`；預覽手機及桌面版，確認：

- 五個區段與進度列。
- 必填／選填狀態。
- 第二位家長欄位直接顯示且選填。
- 個資說明在送出前清楚可讀。
- 兌換碼預填連結有效。

- [ ] **Step 4: 在正式表單執行**

還原正式 `applicationFormId`，執行一次 `configureApplicationForm()`。執行後立即記錄 item summary 與正式預覽網址。

- [ ] **Step 5: 設定暖橘色主題**

在 Google Forms UI 設定：

- 主題色使用與網站 coral 接近的暖橘色。
- 背景使用米白或最接近的淺暖色。
- 不使用低對比背景圖片。
- 以手機預覽確認說明文字可讀、單選與核取控制不擁擠。

- [ ] **Step 6: 驗證回覆試算表**

送出一筆使用 `GIFT-YYYY-XXXXXX` 格式的受控測試回覆，確認新欄位追加至既有回覆工作表，舊資料未刪除。測試回覆加上明確內部標記並在完成端到端驗證後刪除。

- [ ] **Step 7: Commit**

```powershell
git add apps-script/star-guide/FormSetup.gs tests/apps-script-form-contract.test.mjs docs/operations/google-form-research-runbook.md
git commit -m "feat: configure the guide application form"
```

---

### Task 5: 建立研究編號及交付後回饋表

**Files:**
- Create: `apps-script/star-guide/Research.gs`
- Create: `tests/apps-script-research.test.mjs`
- Modify: `apps-script/star-guide/FormSetup.gs`
- Modify: `apps-script/star-guide/Config.gs`

**Interfaces:**
- Produces:
  - `ensureStudyId_(applicationKey: string): string`
  - `stageResearchArtifacts_(studyId: string, chartPayload: Object, guideArtifact: Object): void`
  - `makeFeedbackPrefillUrl_(studyId: string): string`
  - `feedbackInvitationStatus_(record: Object, now: Date): string`
  - `markSelectedGuideDeliveredAndScheduleFeedback(): void`
  - `sendDueFeedbackInvitations(): Object`
  - `onFeedbackSubmit_(event): void`

- [ ] **Step 1: 撰寫失敗測試**

測試狀態規則：

```javascript
test('only opted-in applicants receive one feedback invitation', () => {
  assert.equal(context.feedbackInvitationStatus_({ optedIn: false, sentAt: '' }, new Date()), 'NOT_ELIGIBLE');
  assert.equal(context.feedbackInvitationStatus_({ optedIn: true, sentAt: '', deliveredAt: '2026-08-01' }, new Date('2026-08-10')), 'DUE');
  assert.equal(context.feedbackInvitationStatus_({ optedIn: true, sentAt: '2026-08-08' }, new Date()), 'ALREADY_SENT');
});
```

- [ ] **Step 2: 建立研究工作表**

`ensureResearchSheets_()` 建立且只建立一次：

```text
研究索引:
研究編號 | 原始回覆列 | 建立時間 | 交付時間 | 回饋邀請同意 | 邀請預定日 | 邀請寄送時間 | 研究同意版本 | 研究同意時間 | 對照刪除期限 | 對照刪除時間 | 狀態

研究暫存:
研究編號 | 星盤特徵JSON | 指南內容JSON | 建立時間 | 到期時間

研究星盤特徵:
研究編號 | 同意版本 | 星盤引擎版本 | 宮位系統 | 指南版本 | 孩子特徵JSON | 主要家長特徵JSON | 第二位家長特徵JSON | 親子互動特徵JSON | 建立時間

研究指南內容:
研究編號 | 指南版本 | 分析模型版本 | 提示詞版本 | 內容項目JSON | 建立時間

研究回饋:
研究編號 | 同意版本 | 送出時間 | 閱讀完成度 | 符合度JSON | 幫助度 | 正向回饋 | 不符合回饋 | 追蹤同意
```

- [ ] **Step 3: 建立回饋表**

`createFeedbackFormIfMissing_()`：

- 依 `FEEDBACK_FORM_SPEC` 建立新 Google Form。
- 關閉自動收集 Email。
- 將回覆連結至同一試算表的新回覆工作表。
- 將 form ID、published URL、研究編號 item ID 寫入 Script Properties。
- 安裝 `onFeedbackSubmit_` form-submit trigger。
- 重複執行時不得建立第二份表單或重複 trigger。

- [ ] **Step 4: 建立專屬預填連結**

使用 FormApp `createResponse()` 與研究編號 item 建立 prefilled URL；測試 URL 中只含研究編號，不含 Email、暱稱、兌換碼或出生資料。

- [ ] **Step 5: 定義 Python／指南產出交接格式**

指南完成時計算端呼叫：

```javascript
stageResearchArtifacts_(studyId, {
  engineVersion: 'python-chart-v1',
  houseSystem: 'PLACIDUS',
  child: { positions: {}, houses: {}, aspects: [] },
  primaryParent: { completeness: 'DATE_ONLY', positions: {}, houses: {}, aspects: [] },
  secondParent: null,
  interactions: []
}, {
  guideVersion: 'guide-v1',
  modelVersion: 'gpt-5',
  promptVersion: 'prompt-v1',
  contentItems: [{ id: 'CHILD-001', theme: '個性與需求', text: '孩子在新環境中通常需要先觀察，再逐步投入。' }]
});
```

`研究暫存` 只保存到作業資料 90 日期限。家長完成研究同意後，`onFeedbackSubmit_` 才把星盤特徵與指南內容移入 5 年研究表；未同意或逾期者刪除暫存。

- [ ] **Step 6: 實作交付標記與邀請**

`markSelectedGuideDeliveredAndScheduleFeedback()`：

- 只處理目前選取的有效指南列。
- 若申請者未勾選回饋邀請，不產生寄送排程。
- 若已勾選，建立研究編號、記錄交付日，預定交付後 7 日寄送。
- 不在訂單表或兌換碼表寫入研究編號。

`sendDueFeedbackInvitations()`：

- 每日一次。
- 每筆只寄一次。
- Email 只包含回饋說明及預填研究編號連結，不包含出生資料。

- [ ] **Step 7: 實作回饋同意與清理**

`onFeedbackSubmit_` 驗證研究編號存在、研究同意已勾選，將 `研究暫存` 的星盤特徵與指南內容移入研究表，將自由文字經 `sanitizeFeedbackText_()` 處理後寫入 `研究回饋`，再刪除該研究編號的暫存列。不同意者不得寫入 5 年研究表。

- [ ] **Step 8: Run tests**

Run:

```powershell
npm test -- tests/apps-script-research.test.mjs
npm test
```

Expected: all pass.

- [ ] **Step 9: Commit**

```powershell
git add apps-script/star-guide/Research.gs apps-script/star-guide/FormSetup.gs apps-script/star-guide/Config.gs tests/apps-script-research.test.mjs
git commit -m "feat: add consented research feedback flow"
```

---

### Task 6: 實作 90 日清除、5 年研究期限及撤回

**Files:**
- Create: `apps-script/star-guide/Retention.gs`
- Create: `tests/apps-script-retention.test.mjs`
- Modify: `apps-script/star-guide/Config.gs`
- Modify: `docs/operations/google-form-research-runbook.md`

**Interfaces:**
- Produces:
  - `operationalDeletionDueAt_(deliveredAt: Date): Date`
  - `researchExpiryAt_(consentedAt: Date): Date`
  - `purgeExpiredOperationalData(): Object`
  - `deleteResearchByStudyId(studyId: string): Object`
  - `expireResearchRecords(): Object`

- [ ] **Step 1: 撰寫失敗測試**

```javascript
test('operational data expires exactly 90 days after delivery', () => {
  assert.equal(
    context.operationalDeletionDueAt_(new Date('2026-08-01T00:00:00Z')).toISOString(),
    '2026-10-30T00:00:00.000Z'
  );
});

test('research expires five calendar years after consent', () => {
  assert.equal(
    context.researchExpiryAt_(new Date('2026-08-15T00:00:00Z')).toISOString(),
    '2031-08-15T00:00:00.000Z'
  );
});
```

- [ ] **Step 2: 實作日期函式**

使用 calendar year 而不是 `365 * 5`，避免閏年誤差。所有 Apps Script 日期計算使用試算表時區 `Asia/Taipei`。

- [ ] **Step 3: 實作作業資料清除**

`purgeExpiredOperationalData()` 只清除已交付超過 90 日的欄位：

- Email
- 申請者稱呼
- 地區
- 兌換碼
- 孩子暱稱、性別、出生日期、時間、城市
- 家長身分與出生資料
- 研究索引中的原始回覆列對照
- 未取得研究同意的研究暫存列

保留「已清除」狀態與清除時間。不得清除依法保存的訂單、付款與發票表；研究表不得包含訂單 ID 或兌換碼。

- [ ] **Step 4: 實作研究撤回**

`deleteResearchByStudyId(studyId)`：

- 驗證格式 `^SGR-\d{4}-[A-Z0-9]{6}$`。
- 從研究星盤特徵、研究指南內容、研究回饋及研究索引刪除同一研究編號的列。
- 在獨立稽核表只記錄不可逆雜湊、處理時間與 `DELETED_BY_REQUEST`，不保留原研究編號。

- [ ] **Step 5: 實作 5 年期滿**

`expireResearchRecords()` 刪除個別研究列；公開且已彙整的年度報告不受影響。

- [ ] **Step 6: 安裝每日 trigger**

安裝：

- `sendDueFeedbackInvitations`
- `purgeExpiredOperationalData`
- `expireResearchRecords`

每個函式最多一個 trigger。runbook 記錄如何停用、重建及查看失敗通知。

- [ ] **Step 7: Run tests**

Run:

```powershell
npm test -- tests/apps-script-retention.test.mjs
npm test
```

Expected: all pass.

- [ ] **Step 8: Commit**

```powershell
git add apps-script/star-guide/Retention.gs apps-script/star-guide/Config.gs tests/apps-script-retention.test.mjs docs/operations/google-form-research-runbook.md
git commit -m "feat: enforce research data retention"
```

---

### Task 7: 建立安全的年度趨勢彙整

**Files:**
- Create: `apps-script/star-guide/TrendReports.gs`
- Create: `tests/apps-script-trends.test.mjs`
- Modify: `docs/operations/google-form-research-runbook.md`

**Interfaces:**
- Produces:
  - `aggregateTrendRows_(rows: Object[], groupKey: string, metricKey: string, minimum: number): Object[]`
  - `buildAnnualTrendSummary(year: number): Object`
  - `validatePublicSummary_(summary: Object): void`

- [ ] **Step 1: 撰寫失敗測試**

```javascript
test('groups below 20 responses are suppressed', () => {
  const rows = Array.from({ length: 19 }, () => ({ group: 'rare', score: 5 }));
  assert.deepEqual(context.aggregateTrendRows_(rows, 'group', 'score', 20), []);
});

test('first report is blocked below 100 valid responses', () => {
  assert.throws(
    () => context.assertReportEligible_(99, 100),
    /至少需要100份有效回饋/
  );
});

test('public summary rejects direct identifiers and row-level data', () => {
  assert.throws(
    () => context.validatePublicSummary_({ email: 'x@example.com' }),
    /公開摘要含禁止欄位/
  );
});
```

- [ ] **Step 2: 實作群組抑制**

每一公開 group 回傳：

```javascript
{
  groupLabel: '年齡 6–8 歲',
  sampleSize: 42,
  averageScore: 4.12,
  distribution: { '1': 1, '2': 2, '3': 8, '4': 15, '5': 16 }
}
```

禁止輸出研究編號、精確度數、完整星盤 JSON、原始指南內容及原始自由文字。

- [ ] **Step 3: 建立年度摘要工作表**

`buildAnnualTrendSummary(year)`：

- 只讀取已同意且未撤回的研究資料。
- 少於 100 份有效回饋時停止並顯示原因。
- 每一群組少於 20 份時抑制。
- 建立 `年度趨勢摘要-YYYY` 工作表。
- 加入固定研究聲明與樣本限制。
- 不自動發布到網站；公開前必須人工檢查。

- [ ] **Step 4: 建立公開前檢查清單**

Runbook 必須包含：

```markdown
- [ ] 無研究編號、Email、暱稱、兌換碼
- [ ] 無出生日期、時間、城市或座標
- [ ] 無精確星盤或逐筆指南
- [ ] 每個分類樣本數至少20
- [ ] 總有效樣本數至少100
- [ ] 無未另行同意公開的原始回饋
- [ ] 已附探索性研究限制聲明
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -- tests/apps-script-trends.test.mjs
npm test
```

Expected: all pass.

- [ ] **Step 6: Commit**

```powershell
git add apps-script/star-guide/TrendReports.gs tests/apps-script-trends.test.mjs docs/operations/google-form-research-runbook.md
git commit -m "feat: add privacy-safe trend summaries"
```

---

### Task 8: 同步正式 Apps Script 並完成端到端驗證

**Files:**
- Modify: Live bound Apps Script project
- Modify: `apps-script/star-guide/README.md`
- Modify: `docs/operations/google-form-research-runbook.md`
- Test: all `tests/*.test.mjs`

**Interfaces:**
- Consumes: Tasks 1–7 的本機來源。
- Produces: 正式申請表、回饋表、研究工作表、觸發器及可回復操作紀錄。

- [ ] **Step 1: 本機總驗證**

Run:

```powershell
npm test
git diff --check
git status --short
```

Expected: tests all pass, no whitespace errors, only intended files changed.

- [ ] **Step 2: 檢查 OpenAI 正式資料設定**

只使用 OpenAI 官方資料核對當時有效的：

- API／所用產品是否把輸入用於訓練。
- 資料保存時間與可用控制。
- 處理地區及隱私政策連結。

將實際使用方式與日期寫入 runbook。若無法確認符合表單告知，不得傳送正式出生資料。

- [ ] **Step 3: 同步 Apps Script**

將 `Code.gs`、`Config.gs`、`Core.gs`、`FormSetup.gs`、`Research.gs`、`Retention.gs`、`TrendReports.gs` 同步至綁定 Apps Script。逐檔比對首尾函式名稱，避免漏貼或重複全域常數。

- [ ] **Step 4: 驗證 installable triggers**

確認每個事件只有一個 trigger：

- 既有申請表提交處理
- `onFeedbackSubmit_`
- `sendDueFeedbackInvitations`
- `purgeExpiredOperationalData`
- `expireResearchRecords`

- [ ] **Step 5: 執行受控測試申請**

使用一組專門的 `GIFT` 測試碼及非真實出生資料：

1. 從既有兌換預填連結開啟表單。
2. 確認兌換碼已填入且 entry ID 未變。
3. 在手機寬度完成五區段。
4. 提交並確認新回覆寫入。
5. 執行既有兌換驗證與處理。
6. 確認 payload、Google Maps 地理編碼與時區結果。
7. 標記交付並確認研究編號及預定邀請日。
8. 將預定日暫設為當日，執行邀請函式。
9. 透過預填連結送出回饋。
10. 確認三張研究表以同一研究編號串接，且沒有 Email、暱稱、兌換碼或原始出生資料。

- [ ] **Step 6: 驗證清除與撤回**

在備份試算表或受控測試列：

- 模擬交付日超過 90 日，執行清除，確認作業個資欄位清空。
- 執行 `deleteResearchByStudyId`，確認三張研究表均移除該測試編號。
- 不在正式歷史回覆上執行模擬日期清除。

- [ ] **Step 7: 清理測試資料**

移除受控測試回覆、研究列、測試 trigger 及臨時 Script Properties；保留測試執行紀錄，不保留測試用 Email。

- [ ] **Step 8: Final commit**

```powershell
git add apps-script/star-guide docs/operations tests
git commit -m "docs: finalize guide research operations"
```

- [ ] **Step 9: 發布前交付**

向使用者提供：

- 正式申請表公開網址。
- 回饋表狀態及寄送規則。
- 備份位置。
- 每日 trigger 狀態。
- 90 日／5 年保存規則。
- 測試結果及尚需法律專業人員最終確認的文字。
