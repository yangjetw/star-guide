# 家長星球指南

本專案是零建置、無套件相依的 HTML/CSS 靜態站；網站檔案位於專案根目錄，可直接發布。

## Local verification

Run `npm test`, then serve the repository root with any static HTTP server.
The production page is dependency-free and uses only local assets under `assets/`.
The test script runs `node --test`; one preview option is `python -m http.server 4173`.

## Publishing

Push `main`; `.github/workflows/pages.yml` uploads the static repository and publishes it to:
https://yangjetw.github.io/star-guide/
GitHub Actions performs the GitHub Pages deployment.

## Content boundaries

The public page links to official LINE and the payment-report Google Form. The private redemption application remains available only through the post-purchase redemption-code flow.
