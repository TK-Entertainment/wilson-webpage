import { defineDocumentType, makeSource } from "contentlayer/source-files";
import { createConfig } from "next-docs-zeta/contentlayer/configuration";
import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";
import counties from "./data/map/counties-lnglat.json";

const BlogPost = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: true },
    image: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" } },
    authors: { type: "list", of: { type: "string" } },
    theme: { type: "string", required: false },
    outside: { type: "boolean", required: true },
    outsideLink: { type: "string", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve(page) {
        return page._raw.flattenedPath.split("/")[1];
      },
    },
  },
}));

const BlogPreviewPost = defineDocumentType(() => ({
  name: "BlogPreview",
  filePathPattern: "preview/**",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: true },
    image: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" } },
    authors: { type: "list", of: { type: "string" } },
    theme: { type: "string", required: false },
    outside: { type: "boolean", required: true },
    outsideLink: { type: "string", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve(page) {
        return page._raw.flattenedPath.split("/")[1];
      },
    },
  },
}));

// 來杯果汁の生活影像：一則一個相簿，照片放在 public/img/gallery/<檔名>/
const Album = defineDocumentType(() => ({
  name: "Album",
  filePathPattern: "gallery/**",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: true },
    cover: { type: "string", required: false },
    location: { type: "string", required: false },
    // 首頁照片旁的空心大字：上排地點、下排主題（沒填就用「・」拆標題）
    place: { type: "string", required: false },
    subject: { type: "string", required: false },
    // 拍攝地點座標（首頁顯示 LOC）
    lat: { type: "number", required: false },
    lng: { type: "number", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve(page) {
        return page._raw.flattenedPath.split("/")[1];
      },
    },
  },
}));

// 內文圖片（/img/... 開頭）補上寬高：next-docs-ui 的 img 是 next/image，少了寬高會報錯
function rehypeLocalImageSize() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      const src = node.tagName === "img" ? node.properties?.src : undefined;
      if (typeof src !== "string" || !src.startsWith("/")) return;
      if (node.properties.width && node.properties.height) return;
      try {
        const { width, height } = imageSize(
          readFileSync(path.join("public", decodeURI(src))),
        );
        node.properties.width ??= width;
        node.properties.height ??= height;
      } catch {
        // 找不到檔案就維持原樣
      }
    });
  };
}

// 來杯什麼の足跡地圖：一個打卡點一個 yaml（content/places/），縣市依座標自動判斷

type Ring = number[][];
function inRing(x: number, y: number, r: Ring) {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function countyOf(lng: number, lat: number) {
  const polys = (f: any): Ring[][] =>
    f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const f of (counties as any).features)
    if (polys(f).some((p) => inRing(lng, lat, p[0]))) return f.properties.name as string;
  // 海岸邊的點可能落在簡化後的邊界外：取最近的縣市
  let best = { d: Infinity, name: "" };
  for (const f of (counties as any).features)
    for (const p of polys(f))
      for (const [x, y] of p[0]) {
        const d = (x - lng) ** 2 + (y - lat) ** 2;
        if (d < best.d) best = { d, name: f.properties.name };
      }
  return best.name;
}

const Place = defineDocumentType(() => ({
  name: "Place",
  filePathPattern: "places/**/*.yaml",
  contentType: "data",
  fields: {
    name: { type: "string", required: true },
    category: { type: "enum", options: ["trip", "life", "work", "wild"], required: true },
    // 可以只寫年份或年月，所以用字串
    date: { type: "string", required: false },
    lat: { type: "number", required: true },
    lng: { type: "number", required: true },
    // 自動判斷錯了才需要手動指定
    county: { type: "string", required: false },
    text: { type: "string", required: false },
    album: { type: "string", required: false },
    post: { type: "string", required: false },
    url: { type: "string", required: false },
  },
  computedFields: {
    id: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").pop() ?? "",
    },
    countyName: {
      type: "string",
      resolve: (doc) => doc.county || countyOf(doc.lng, doc.lat),
    },
  },
}));

const config = createConfig();

// MDX 外掛：contentlayer2 用的是 MDX 3（unified 11），next-docs-zeta 內建的外掛是舊版，
// 這裡整組換掉，只保留實際用得到的功能，套用到所有文件類型（筆記、文章、相簿）
// - remark-gfm：表格、刪除線
// - remark-math＋rehype-katex：$行內$ 與 $$區塊$$ 數學公式
// - rehype-slug：標題 id，跟目錄（getTableOfContents）一樣用 github-slugger
config.mdx = {
  remarkPlugins: [remarkGfm, remarkMath],
  rehypePlugins: [rehypeSlug, rehypeKatex, rehypeLocalImageSize],
};

// @ts-ignore
(config.documentTypes as DocumentType[]).push(BlogPost, BlogPreviewPost, Album, Place);

// 打卡點資料夾的格式說明不是文件
// @ts-ignore
config.contentDirExclude = [...(config.contentDirExclude ?? []), "places/README.md"];

export default makeSource(config);
