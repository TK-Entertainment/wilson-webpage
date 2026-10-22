import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/utils/seo";

// 標籤頁不渲染 MDX，可以在 edge 上即時產生（中文網址在靜態檔案下會 404）
export const runtime = "edge";

export function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Metadata {
  const slug = params.slug ?? "";
  const decodedTag = decodeURIComponent(slug);

  return pageMetadata({
    title: `威爾森的生活札記 | 標籤 > ${decodedTag}`,
    description: `「${decodedTag}」標籤底下的日常碎念。`,
    path: `/blog/tags/${slug}`,
    image: "blog",
  });
}

export default function TagLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
