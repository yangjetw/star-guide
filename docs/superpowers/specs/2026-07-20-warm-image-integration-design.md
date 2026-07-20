# 親子成長指南溫馨圖片整合設計規格

## 1. 目標

在不破壞現有「星空療癒」、大字與手機閱讀體驗的前提下，從原 Gamma 網站精選六張無浮水印的 AI 圖，補回親子互動與生活情境的溫度。所有正式圖片都下載到 repository，GitHub Pages 不依賴 Gamma CDN 才能顯示。

## 2. 範圍

### 納入

- 六張原 Gamma AI 圖的下載、轉成 WebP、命名與本機化。
- Hero、家長困擾、指南價值、製作流程、交付內容與最終 CTA 的圖文交錯版面。
- 桌機左右交錯、手機文字在前圖片在後的單欄配置。
- 圖片替代文字、固定尺寸、延遲載入與響應式裁切。
- 自動測試、五種寬度瀏覽器驗收、GitHub Pages 重新部署。

### 不納入

- 聊天截圖、報告截圖、帶浮水印圖片或原站三張見證截圖。
- 重新生成 AI 圖、改寫銷售文案、改價格、改 LINE／Google Form 流程。
- 外連 Gamma 圖片作為正式網站資源。

## 3. 圖片選擇與位置

| 檔名 | 原站素材 | 網站位置 | 用途 |
|---|---|---|---|
| `hero-parent-child.webp` | `generated-images/BbnmKOjrvLNAgfThpoq35.png` | Hero 右側 | 星空下親子牽手，建立品牌第一印象 |
| `concerns-family.webp` | `generated-images/m5xNB0z8kc_ZyjqvUWjNQ.png` | 家長困擾 | 疲憊家長與孩子，承接困擾內容 |
| `guide-parent-child.webp` | `generated-images/p476VGCtbZyjxPhB1s9Kj.png` | 指南價值 | 父親抱孩子與星光，表達理解與連結 |
| `process-wonder.webp` | `generated-images/i6WCKrXZxzf_w3sK6VX38.png` | 製作流程 | 孩子圍著發光意象，表達探索與發現 |
| `deliverables-reading.webp` | `generated-images/sqIaJoznBiJ_sCBZik5ZO.png` | 交付內容 | 家長陪孩子閱讀星空書，呼應指南使用情境 |
| `closing-cosmos-family.webp` | `generated-images/XKSBLyPqbvMvWb9tFfUCP.png` | 最終 CTA 上方或背景視覺 | 親子坐在宇宙花園，作為溫柔收尾 |

素材來自使用者既有 Gamma 品牌頁，不新增第三方圖庫素材。每張來源網址為 `https://cdn.gamma.app/akw6y74cp1iyxtt/` 加上表中的「原站素材」路徑；正式網站不保存 imgproxy 轉址，也不直接引用 Gamma CDN。

## 4. 資產處理

- 儲存目錄：`assets/images/`。
- 格式：WebP。
- 直式圖最大寬度約 960px；橫式圖最大寬度約 1200px；不放大原始圖片。
- 以約 80–84 的品質轉檔，先維持人物臉部與星光細節，再控制檔案大小。
- HTML 必須提供 `width`、`height` 與具體繁中 `alt`，避免版面位移並支援螢幕閱讀器。
- Hero 圖使用 `loading="eager"` 與 `fetchpriority="high"`；其餘五張使用 `loading="lazy"` 與 `decoding="async"`。
- 圖片容器以約 22–28px 圓角、柔和邊框、薰衣草陰影與淡金光暈統一不同素材色調。
- `object-fit: cover` 搭配每張圖的 `object-position`，人物臉部是裁切優先保留區。

## 5. 版面配置

### 桌機

- Hero 保持左文右圖，原 CSS 星環改為圖後方的輕量裝飾，不與人物競爭。
- 家長困擾、指南價值、製作流程與交付內容採左右交錯：奇數段圖片靠右、偶數段圖片靠左。
- 原有卡片、流程與交付清單仍完整顯示；圖片放在標題／清單旁，不取代關鍵文字。
- 最終 CTA 先顯示寬幅宇宙親子圖，再接金句、LINE 與付款回報入口。

### 手機與平板

- 768px 以下全部單欄，閱讀順序固定為標題與說明、圖片、卡片／清單。
- 圖片寬度 100%，不使用滿版負邊距；保留頁面左右安全留白。
- Hero 圖放在兩個主要按鈕後方，固定底部 LINE CTA 不得遮住圖片與後續內容。
- 直式圖片採約 4:5 或 5:6 容器，橫式圖片採約 16:9；個別 `object-position` 避免人物臉部被裁切。

## 6. HTML 與 CSS 邊界

- `index.html` 增加六個本機 `<img>`，可用語意化 `<figure>` 包裝；不加入 JavaScript。
- `styles.css` 增加共用 `.section-media` 與必要的位置修飾 class，避免每張圖片各寫一套重複樣式。
- 現有語意 landmark、標題順序、五個 FAQ、方案與外部連結不可改變。
- GitHub Pages workflow 已複製整個 `assets/`，因此不需要新增部署步驟，只需確認新圖片包含在 artifact。

## 7. 失敗與降級

- 若單張原圖無法下載或轉檔，該區保留現有星空／色塊背景與完整文字，不使用失效外部 URL。
- 圖片載入失敗時，固定容器尺寸避免版面塌陷；文字與 CTA 仍可完整操作。
- 若 WebP 轉檔後肉眼可見色帶或臉部細節損失，僅提高該張品質，不改回外部 PNG。

## 8. 測試與驗收

### 自動測試

- `assets/images/` 六張指定 WebP 全部存在且非空。
- `index.html` 正好引用六張本機圖片，production HTML/CSS 不含 `gamma.app` 圖片 URL。
- 六張圖皆有非空繁中替代文字與 `width`／`height`。
- Hero 圖具有 eager/high priority，其餘圖具有 lazy/async。
- CSS 具備共用圖片容器、圓角、`object-fit`、768px 單欄與 reduced-motion 相容性。
- 原有 17 項網站、隱私、連結、手機與無障礙測試繼續通過。

### 瀏覽器驗收

- 360、390、768、1024、1440px 無水平溢出、人物臉部裁切、文字遮擋或固定 CTA 重疊。
- Hero、困擾、指南、流程、交付與結尾六個位置各顯示正確圖片。
- 圖片尚未載入時不造成內容跳動；非首屏圖片在接近視窗時才載入。
- LINE 與付款回報入口仍指向原核准網址，console 無頁面錯誤。

### 上線驗收

- 推送 `main` 後 GitHub Pages workflow 成功。
- 正式網址回應 200，六張 WebP 均可直接取得。
- 正式 HTML 不含私人兌換表單 ID，也不依賴 Gamma CDN。

## 9. 完成標準

網站保留目前乾淨、療癒與大字的閱讀體驗，同時在首屏與主要說明段落加入明確親子情境。手機閱讀仍流暢，正式網站即使 Gamma 頁面移除或 CDN 失效也能完整呈現。
