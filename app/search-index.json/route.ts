import { NextResponse } from "next/server";
import { allAlbums, allBlogs, allDocs } from "contentlayer/generated";
import type { SearchEntry } from "@/components/search/types";

// 全站搜尋索引：build 時產生成靜態 JSON，前端打開搜尋面板時才載入
export const dynamic = "force-static";

// 把 MDX 原始碼粗略轉成純文字，只留給搜尋比對用
function toPlainText(raw: string): string {
  return raw
    .replace(/^\s*(import|export)\s.*$/gm, " ")
    .replace(/```[^\n]*\n?/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_~`|]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function GET() {
  const entries: SearchEntry[] = [
    ...allBlogs.map((post) => ({
      type: "blog" as const,
      title: post.title,
      description: post.description ?? "",
      tags: post.tags ?? [],
      body: toPlainText(post.body.raw),
      url:
        post.outside && post.outsideLink
          ? post.outsideLink
          : `/blog/${post.slug}`,
      date: post.date,
    })),
    ...allDocs.map((doc) => ({
      type: "docs" as const,
      title: doc.title,
      description: doc.description ?? "",
      tags: [],
      body: toPlainText(doc.body.raw),
      url: doc.slug ? `/docs/${doc.slug}` : "/docs",
    })),
    ...allAlbums.map((album) => ({
      type: "gallery" as const,
      title: album.title,
      description: [album.description, album.location]
        .filter(Boolean)
        .join(" · "),
      tags: album.location ? [album.location] : [],
      body: toPlainText(album.body.raw),
      url: `/gallery/${album.slug}`,
      date: album.date,
    })),
  ];

  return NextResponse.json(entries);
}
