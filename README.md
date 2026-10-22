<img src="https://i.imgur.com/wApgX8J.png" height=64 width=64></img>

### A Project of TK Entertainment | with Wilson Chen

# 威爾森的生活札記｜Wilson's Notes

[![CodeFactor](https://www.codefactor.io/repository/github/tk-entertainment/wilson-webpage/badge)](https://www.codefactor.io/repository/github/tk-entertainment/wilson-webpage)  
[來看看網站吧~](https://wilson.trygong.uk)

## 網站分區

| 分區 | 網址 | 內容放在 |
| --- | --- | --- |
| 來杯好茶の日常碎念 | `/blog` | `content/blog/*.mdx` |
| 來杯咖啡の學習日常 | `/docs` | `content/docs/**` |
| 來杯果汁の生活影像 | `/gallery` | `content/gallery/*.mdx` |

## 如何新增內容

### 日常碎念（`content/blog/`）

新增一個 `.mdx` 檔，檔名就是網址（例如 `my-day.mdx` → `/blog/my-day`），開頭寫：

```yaml
---
title: 文章標題
authors: [威爾森]
description: "一句話簡介"
tags: ["日常紀錄板", "其他標籤"]
date: 2026-10-21T12:00:00
image: cover.png
outside: false
outsideLink:
---
```

- `outside: false` 一定要寫，缺少會建置失敗
- 封面圖放在 `public/img/<檔名>/cover.png`，資料夾名稱要和 `.mdx` 檔名相同；不需要封面就把 `image:` 留空
- 標籤要出現在「主題板」，必須先在 `utils/tagsicon.ts` 登記（`iconList.set("板名", 圖示)`）

### 生活影像（`content/gallery/`）

一則一個相簿。新增 `.mdx` 檔，檔名就是網址（例如 `2026-10-kenting.mdx` → `/gallery/2026-10-kenting`），
照片和影片放在 `public/img/gallery/<檔名>/`：

```mdx
---
title: 墾丁三天兩夜
date: 2026-10-20
description: 一句話簡介
cover: 1.jpg
location: 屏東墾丁
---

想寫的文字可以直接寫。

<Photos>

![海邊](/img/gallery/2026-10-kenting/1.jpg)

![夕陽](/img/gallery/2026-10-kenting/2.jpg)

</Photos>

<Video src="/img/gallery/2026-10-kenting/clip.mp4" caption="浮潛" />

<YouTube id="影片網址 watch?v= 後面那串" caption="vlog" />
```

- `cover`、`location`、`description` 可省略
- `<Photos>` 裡每張圖片之間要空一行
- 影片檔請壓在 25MB 以下（Cloudflare 單檔上限）；較長的影片建議上傳 YouTube 後用 `<YouTube>`

### 學習日常（`content/docs/`）

一門課開一個資料夾，一章一個檔案，左側目錄會自動產生：

```
content/docs/
  index.mdx              ← 學習日常首頁
  calculus/
    meta.json            ← 左側目錄顯示的課程名稱
    ch1-limits.mdx       ← /docs/calculus/ch1-limits
```

`meta.json` 內容（資料夾名稱建議用英文，中文課名寫在這裡）：

```json
{
  "title": "微積分"
}
```

每個筆記檔案開頭只需要：

```yaml
---
title: 第一章 極限
description: 一句話簡介
---
```

筆記（以及日常碎念、生活影像）都可以寫 LaTeX 數學公式：行內用 `$...$`，獨立一行的區塊用 `$$...$$`：

```mdx
理想氣體方程式 $PV = nRT$ 可以寫在句子裡。

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$
```

- 公式太長時會在框內左右捲動，不會撐開整頁
- 公式裡的 `{`、`}` 不會被當成 MDX 語法；但公式「以外」的文字若要寫大括號，仍要寫成 `\{`、`\}`

## 留言區、分享卡片與 RSS

### 留言區（giscus）

文章與相簿頁面最下方的留言區使用 [giscus](https://giscus.app)，留言會存放在本 repo 的 GitHub Discussions。
設定集中在 `utils/comments.ts`，`categoryId` 還沒填時頁面會顯示「留言區準備中」。啟用步驟：

1. 到 GitHub repo 的 **Settings → General → Features**，勾選 **Discussions**
2. 安裝 giscus app：<https://github.com/apps/giscus>，授權給 `TK-Entertainment/wilson-webpage`
3. （建議）在 Discussions 新增一個 **Announcement** 類型的分類，例如 `Comments`，只讓 giscus 建立討論串
4. 打開 <https://giscus.app>，Repository 填 `TK-Entertainment/wilson-webpage`，對應方式選 `pathname`，分類選上一步的分類
5. 從頁面下方產生的設定中複製 `data-category` 與 `data-category-id`（若 `data-repo-id` 和檔案裡的不同也一併更新），填進 `utils/comments.ts`：

```ts
export const commentsConfig = {
  repo: "TK-Entertainment/wilson-webpage",
  repoId: "R_kgDOKXkJtQ",
  category: "Comments",
  categoryId: "DIC_kwDO........", // 填入後留言區就會出現
};
```

留言區會跟著網站的深淺色模式自動切換。

### 分享卡片（Open Graph 圖片）

分享到 IG、LINE、Facebook 時顯示的預覽圖，是 `pnpm build` 時由 `scripts/og.mjs` 產生的 1200×630 PNG，
輸出在 `public/og/`（不進版控）。每篇文章、相簿、筆記與各分區首頁都有一張；想先在本機看效果可以執行 `pnpm og`。

- 中文字型會從 Google Fonts 下載需要的字（Noto Sans TC）；離線時可設定 `OG_FONT=/path/to/字型.ttf`（不支援 `.ttc`）
- 兩者都拿不到時會改產生只有幾何圖形與英文的卡片，不會讓建置失敗

### RSS 訂閱

網址是 `/rss.xml`，會列出所有日常碎念與生活影像（新到舊），建置時產生成靜態檔案。

## 專案原理

此專案建置於非常好用且好看的 [Next Docs](https://github.com/fuma-nama/next-docs) 框架 (shoutout to [@fuma-nama](https://github.com/fuma-nama))  
並自行建置 Blog 的部件，並為手機使用者設計相關導覽邏輯，讓使用者能更方便的瀏覽文章

此專案利用 **Cloudflare Pages** 進行自動部署，在 push 時就會自動建置並部署到 **Cloudflare edge network**

## 相關截圖

### 電腦版網站

<img src="https://github.com/TK-Entertainment/wilson-webpage/assets/52964758/bd4d2172-d4fb-46a8-8fa6-a34ead15e318" width=400></img>
<img src="https://github.com/TK-Entertainment/wilson-webpage/assets/52964758/54b1ed42-3ebf-4ce4-b028-6b6a5c3a6af4" width=400></img>
<img src="https://github.com/TK-Entertainment/wilson-webpage/assets/52964758/4f677426-c6e3-49c9-a41f-aea0e714d925" width=400></img>

### 手機版網站

<img src="https://github.com/TK-Entertainment/wilson-webpage/assets/52964758/53672f4b-c20e-460b-9c5d-2519ae000ad6" width=250></img>
<img src="https://github.com/TK-Entertainment/wilson-webpage/assets/52964758/d2eae6df-f51a-46bd-a815-603fd3c64f89" width=250></img>
<img src="https://github.com/TK-Entertainment/wilson-webpage/assets/52964758/13cca01b-65e0-4894-b8fd-b03b42e84d7f" width=250></img>

## 使用技術

- Tailwind CSS
- FontAwesome Icon
- Next Docs (by [@fuma-nama](https://github.com/fuma-nama))
- Next.js
- TypeScript

## 如何對專案貢獻

**若遇到了些什麼問題**  
歡迎 [提交 Issue](https://github.com/TK-Entertainment/tkablent_music/issues) 來跟我們分享你遇到的問題

**若有修改的建議**  
可以運用 Fork 來建立分支或點擊此 Repo 右上角 Code 中的 Download ZIP 來下載原始碼  
並依照下方步驟進行測試
修改完畢後也歡迎開 [Pull Request](https://github.com/TK-Entertainment/tkablent_music/pulls)，來與我們交流

**1. 複製本倉庫到你的本地環境 (亦可點擊此 Repo 右上角 Code 中的 Download ZIP 來下載原始碼)**

> [!NOTE]  
> 如果是 Fork 到自己倉庫者，請將 git clone 的地址改為自己的 fork

```bash
git clone https://github.com/TK-Entertainment/wilson-webpage.git
```

**2. 前往專案目錄**

```bash
cd wilson-webpage
```

**3. 安裝依賴**

> [!WARNING]  
> 請不要使用 **npm install**，會導致無法安裝的問題

```bash
pnpm install
```

**4. 執行開發環境**

```bash
pnpm run dev
```

## 授權

**威爾森的生活札記 開發專案**  
本專案依 **MIT License** 授權 _(限於其餘程式部分)_  
授權詳細內容請參 **LICENSE** 檔案 _(限於其餘程式部分)_

> [!WARNING]  
> **文章部分 (/content/\*)** 受到著作權保護，請不要隨意修改及發布

## 作者

Website design by Kevinowo @ TK Entertainment  
Articles written by @Wilsonsonsonsonson (Wilson Chen)
