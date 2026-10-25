import type { MetadataRoute } from "next";
import { allAlbums, allBlogs, allDocs } from "contentlayer/generated";
import { siteUrl } from "@/utils/seo";

// 建置時產生的靜態 sitemap.xml，方便搜尋引擎找到每一篇內容
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/blog", "/docs", "/gallery", "/map"].map((path) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
  }));
  const posts = allBlogs
    .filter((post) => !post.outside)
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }));
  const notes = allDocs
    .filter((doc) => doc.slug !== "")
    .map((doc) => ({ url: `${siteUrl}/docs/${doc.slug}` }));
  const albums = allAlbums.map((album) => ({
    url: `${siteUrl}/gallery/${album.slug}`,
    lastModified: new Date(album.date),
  }));
  return [...pages, ...posts, ...notes, ...albums];
}
