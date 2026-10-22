import { allAlbums, allBlogs } from "contentlayer/generated";
import { siteDescription, siteName, siteUrl } from "@/utils/seo";

// 建置時產生成靜態檔案（Cloudflare Pages 不支援 Node 動態路由）
export const dynamic = "force-static";

const escape = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

type Item = {
  title: string;
  link: string;
  description?: string;
  date: string;
  categories: string[];
};

export function GET() {
  const items: Item[] = [
    ...allBlogs.map((post) => ({
      title: post.title,
      link:
        post.outside && post.outsideLink
          ? post.outsideLink
          : `${siteUrl}/blog/${post.slug}`,
      description: post.description,
      date: post.date,
      categories: ["來杯好茶の日常碎念", ...(post.tags ?? [])],
    })),
    ...allAlbums.map((album) => ({
      title: album.title,
      link: `${siteUrl}/gallery/${album.slug}`,
      description: album.description,
      date: album.date,
      categories: [
        "來杯果汁の生活影像",
        ...(album.location ? [album.location] : []),
      ],
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escape(siteDescription)}</description>
    <language>zh-TW</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/og/default.png</url>
      <title>${escape(siteName)}</title>
      <link>${siteUrl}</link>
    </image>
${items
  .map(
    (item) => `    <item>
      <title>${escape(item.title)}</title>
      <link>${escape(item.link)}</link>
      <guid isPermaLink="true">${escape(item.link)}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
${item.description ? `      <description>${escape(item.description)}</description>\n` : ""}${item.categories
      .map((c) => `      <category>${escape(c)}</category>\n`)
      .join("")}    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
