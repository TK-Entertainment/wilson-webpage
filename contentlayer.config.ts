import { defineDocumentType, makeSource } from "contentlayer/source-files";
import { createConfig } from "next-docs-zeta/contentlayer/configuration";
import { structure } from "next-docs-zeta/mdx-plugins";

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

const config = createConfig({
  docsComputedFields: {
    structuredData: {
      type: "json",
      resolve: (page) => structure(page.body.raw),
    },
  },
});

// @ts-ignore
(config.documentTypes as DocumentType[]).push(BlogPost, BlogPreviewPost, Album);

export default makeSource(config);
