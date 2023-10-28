import { structure } from 'next-docs-zeta/mdx-plugins'
import { allBlogs } from "contentlayer/generated";
import { createSearchAPI } from "next-docs-zeta/search/server";

export const { GET } = createSearchAPI("advanced", {
  indexes: allBlogs.map((blog) => ({
    id: blog._id,
    title: blog.title,
    content: blog.body.raw,
    url: `/blog/${blog.slug}`,
    structuredData: structure(blog.body.raw)
  })),
});
