import type { Metadata } from "next";
import type { ReactNode } from "react";

// 標籤頁不渲染 MDX，可以在 edge 上即時產生（中文網址在靜態檔案下會 404）
export const runtime = "edge";

export function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Metadata {
  const slug = params.slug ?? "";
  const decodedTag = decodeURIComponent(slug);

  return {
    title: `威爾森的生活札記 | 標籤 > ${decodedTag}`,
    description:
      "來杯好茶聊聊日常碎念，來杯咖啡記下學習日常。威爾森的生活與上課筆記都在這裡。",
    openGraph: {
      images: "",
      title: `威爾森的生活札記 | 標籤 > ${decodedTag}`,
      description:
        "來杯好茶聊聊日常碎念，來杯咖啡記下學習日常。威爾森的生活與上課筆記都在這裡。",
    },
  };
}

export default function TagLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
