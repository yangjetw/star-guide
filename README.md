# 家長星球指南

本專案是零建置、無套件相依的 HTML/CSS 靜態站；網站檔案位於專案根目錄，可直接發布。

## 測試

專案不需要安裝相依套件。在專案根目錄執行：

```sh
node --test
```

## 本機預覽

在專案根目錄啟動靜態伺服器：

```sh
python -m http.server 4173
```

接著開啟 [http://localhost:4173](http://localhost:4173)。

## 發布至 GitHub Pages

將變更 push 到 `main` 或 `master` 後，前往 **Settings → Pages**，將 Source 設為 **GitHub Actions**。`.github/workflows/pages.yml` 會建立乾淨的發布目錄，只上傳 `index.html`、`styles.css`、`.nojekyll` 與 `assets/`，再部署至 GitHub Pages；也可由 Actions 頁面手動執行 workflow。

## 發布前檢查

- LINE CTA 可正常開啟。
- 付款回報 Google Form 連結正確。
- 三方案價格正確。
- 手機版在 360、390、768 寬度下可用。
- 桌面版在 1024、1440 寬度下可用。
- FAQ 與 footer 內容完整。

## 資料與隱私邊界

首頁不收集資料，也不公開兌換表單或付款帳密。交易與申請資料仍依既有的 LINE、Email、Google Forms 流程處理。
