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
(config.documentTypes as DocumentType[]).push(BlogPost);

export default makeSource(config);
