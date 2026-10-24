import type { Metadata } from "next";
import { Suspense } from "react";
import TagPage from "@/components/TagPage";
import { pageMetadata } from "@/utils/seo";

// 標籤頁：建置時產生一個靜態頁，用 ?tag= 參數決定要看哪個標籤
// （原本 /blog/tags/[slug] 在 edge 上即時產生，正式站會 500；中文路徑的靜態頁又會 404）
export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 標籤",
  description: "依標籤瀏覽日常碎念。",
  path: "/blog/tags",
  image: "blog",
});

export default function Page() {
  return (
    <Suspense>
      <TagPage />
    </Suspense>
  );
}
