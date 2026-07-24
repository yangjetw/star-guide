# 家長星球指南

「赫爾墨斯的小宇宙」的靜態網站，以 GitHub Pages 發布；不需要建置步驟或套件相依，網站檔案與本機圖片皆位於專案根目錄。

## 網站路由

- `/`：親子成長指南介紹。
- `/gift.html`：送禮方案與購買洽詢。
- `/navigator.html`：導航者計畫介紹。
- `/refund.html`：購買與退款政策。

正式網址：<https://yangjetw.github.io/star-guide/>。

## 本機驗證

使用 Node 內建測試執行：

```powershell
npm test
```

測試等同於 `node --test`。如需本機預覽，可在專案根目錄執行：

```powershell
python -m http.server 4173
```

再開啟 <http://localhost:4173/>，並依序檢查四個路由。

## 賣家與客服

- 品牌：赫爾墨斯的小宇宙
- 法律主體：星學會有限公司
- 統一編號：69708677
- 客服信箱：<astrokidsguide@gmail.com>
- 官方 LINE：<https://lin.ee/gMMpzNy>

## 購買與隱私界線

票券服務審核完成前，網站不開放收費或直接付款；所有方案僅能透過官方 LINE 洽詢。正式線上販售將於票券服務審核完成後，依核准內容開放。

私密的兌換／指南申請表單不會公開於網站或公開原始碼；收件者僅會在購買後的兌換流程中取得專屬連結。

## 發布

推送 `main` 分支後，`.github/workflows/pages.yml` 會透過 GitHub Actions 將靜態網站部署至 GitHub Pages。
