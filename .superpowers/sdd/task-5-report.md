# Task 5 文件與發布前靜態驗證報告

日期：2026-07-24

## 完成內容

- 更新 `README.md`：列出 `/`、`/gift.html`、`/navigator.html`、`/refund.html` 四個路由，以及本機驗證與正式網址。
- 記錄賣家資訊：赫爾墨斯的小宇宙、星學會有限公司、統一編號 69708677、客服信箱與官方 LINE。
- 明確記錄票券服務審核前不收費、僅能透過官方 LINE 洽詢，並說明私密兌換／指南申請表單不公開。

## 執行命令

```powershell
& $nodeExe --test
& $gitExe diff --check
rg -n --fixed-strings $privateId index.html gift.html navigator.html refund.html styles.css
rg -n -i -e 'n8n|TEST-|PGG-|https://docs\\.google\\.com/forms|LINE Bank|街口付款|匯款|立即付款' index.html gift.html navigator.html refund.html styles.css
```

## 結果與完整計數

- `node --test`：37 tests、37 pass、0 fail、0 skipped、0 todo。
- `git diff --check`：0 errors。
- 公開 HTML 路由：4；`h1`：4；本機圖片引用：11。
- 外部連結引用：18；唯一外部目的地：1（`https://lin.ee/gMMpzNy`）。
- 私密兌換表單 ID：0 matches。
- 禁止標記／公開付款表單／直接付款文字：0 matches。

## 自我檢查

- README 包含四路由、本機 `node --test`／`python -m http.server 4173` 驗證、GitHub Pages 正式網址、公司／統編／客服資料。
- README 未將票券審核前的洽詢描述成可直接付款；私密兌換表單未公開。
- 本任務未 push、未合併、未做瀏覽器 QA，亦未宣稱 production 已驗證。

## Commit

`PENDING`（提交後以實際 SHA 更新）
