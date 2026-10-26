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
| 來杯果汁の生活影像 | `/gallery` | `content/gallery/*.mdx`（另有依月份自動產生的打卡相簿） |
| 帶著飲料出門の足跡地圖 | `/map` | `content/places/*.yaml`、`*.json` |
| 喝完茶の來抽一張牌（彩蛋） | `/tarot` | `utils/tarot.ts`、`utils/tarotMinor.ts` |

網站首頁的羅盤是抽牌頁的入口；抽牌頁沒有出現在導覽列。

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
  "title": "微積分",
  "pages": ["..."]
}
```

- `"pages": ["..."]` 一定要寫：代表列出資料夾裡所有筆記。少了它，左側目錄這門課底下會是空的
- 想自訂順序可以改成列出檔名，例如 `["ch1-limits", "ch2-derivative", "..."]`

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

### 足跡地圖（`content/places/`）

一個打卡點一個檔案，縣市會依座標自動判斷，完整格式見 [`content/places/README.md`](content/places/README.md)：

```yaml
name: 龜山島
category: wild        # trip 旅行／life 生活／work 出差／wild 野外
date: "2025-07"       # 可以只寫年份或年月，不寫就顯示「日期待補」
lat: 24.8431
lng: 121.9516
text: 一兩句話（選填）
album: 相簿檔名（選填）
youtube: https://youtu.be/…（選填）
```

照片和短片放在 `public/img/places/<檔名>/`（`1.jpg`、`2.jpg`、`video.mp4`），會自動出現在地圖卡片、
「生活影像」的月份打卡相簿（`/gallery/checkins-2026-10`），以及首頁的照片輪播。

#### 用 iPhone 捷徑即時打卡

`scripts/shortcut/build-checkin-shortcut.py` 會產生「足跡打卡」捷徑（在 macOS 上用 `shortcuts sign --mode anyone` 簽署後 AirDrop 到手機）：
拍照／選照片／傳短片／貼 YouTube 連結 → 讀照片的拍攝位置與日期（沒有就用目前位置，送出前可改成搜尋地點）→ 名稱、分類、一句話 →
直接寫進 `Release` 分支，約 3～4 分鐘後上線。

- 需要一把 GitHub token：TK-Entertainment 沒開放 fine-grained token，所以用 classic token，**只勾 `public_repo`**，貼進捷徑（只存在手機上）
- 照片在建置時由 `scripts/optimize-places.mjs` 壓成長邊 1600、JPEG 品質 80；單檔超過 24MB 的會被略過，不會讓部署失敗
- 照片的 commit 訊息帶 `[CF-Pages-Skip]`，一次打卡只觸發一次 Cloudflare 建置

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

- **Next.js 15＋React 19**（App Router），筆記區使用 [Next Docs](https://github.com/fuma-nama/next-docs)（shoutout to [@fuma-nama](https://github.com/fuma-nama)），文章、相簿、打卡點由 **contentlayer2** 讀取
- **Cloudflare Pages** 透過 `@cloudflare/next-on-pages` 部署：push 到 `Release` 會自動建置並上線；其他分支會產生預覽網址
- Node 版本寫在 `.nvmrc`（22）；`.github/workflows/cf-build-check.yml` 會在 push 到 `redesign-life-notes` 時用同樣的流程建置一次，沒有 Cloudflare 權限也能看到錯誤紀錄
- 整站都是建置時產生的靜態頁面（標籤頁是 `/blog/tags?tag=…` 單一靜態頁），沒有伺服器端程式

### 分支

| 分支 | 用途 |
| --- | --- |
| `Release` | 正式站（wilson.trygong.uk），iPhone 打卡也直接寫在這裡 |
| `redesign-life-notes` | 預覽用，確認沒問題再合併到 `Release` |
| `feat/…`、`fix/…`、`chore/…` | 開發中的功能，合併後刪除 |

> [!NOTE]
> 預覽網址請看 commit 的「Cloudflare Pages」檢查結果；同一個 commit 推到兩個分支時，Cloudflare 只會在先推的那個分支建置。

## 使用技術

- Next.js 15、React 19、TypeScript
- Tailwind CSS、Next Docs、contentlayer2
- KaTeX（數學公式）、giscus（留言區）
- 台灣縣市界線：內政部國土測繪中心（政府資料開放授權），via [taiwan-atlas](https://github.com/dkaoster/taiwan-atlas)，以 mapshaper 簡化

## 如何對專案貢獻

**若遇到了些什麼問題**  
歡迎 [提交 Issue](https://github.com/TK-Entertainment/wilson-webpage/issues) 來跟我們分享你遇到的問題

**若有修改的建議**  
可以運用 Fork 來建立分支或點擊此 Repo 右上角 Code 中的 Download ZIP 來下載原始碼  
並依照下方步驟進行測試
修改完畢後也歡迎開 [Pull Request](https://github.com/TK-Entertainment/wilson-webpage/pulls)，來與我們交流

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

Original design by Kevinowo @ TK Entertainment  
Redesign 2026 & articles by @Wilsonsonsonsonson (Wilson Chen)
