# 家長星球指南

「赫爾墨斯的小宇宙」的靜態網站，以 GitHub Pages 發布；不需要建置步驟或套件相依，網站檔案與本機圖片皆位於專案根目錄。

## 公開頁面

- `/index.html`：完整《親子成長指南》介紹與品牌角色旅程。
- `/gift.html`：點星者送禮方案與收禮流程。
- `/navigator.html`：導航者角色與公開申請入口。
- `/refund.html`：安心購買、資料使用、服務與退款說明。

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

## 購買與服務狀態

票券服務審核完成前，網站不開放收費或直接付款；所有方案僅能透過官方 LINE 洽詢。正式線上販售將於票券服務審核完成後，依核准內容開放。

## 公開資訊邊界

公開網站不揭露兌換碼格式、發行分類或私人指南申請入口。導航者申請表是刻意公開的加入入口，與購買後提供的指南申請流程不同。

## 發布

推送 `main` 分支後，`.github/workflows/pages.yml` 會透過 GitHub Actions 將靜態網站部署至 GitHub Pages。
