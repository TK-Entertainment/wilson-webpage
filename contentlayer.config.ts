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
(config.documentTypes as DocumentType[]).push(BlogPost, BlogPreviewPost, Album);

export default makeSource(config);
