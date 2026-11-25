import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import StarMap, { type StarData } from "@/components/stars/StarMap";
import data from "@/components/stars/starData.json";
import { pageMetadata } from "@/utils/seo";
import "./stars.css";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 知識星圖",
  description: "四門地科課的 470 個名詞散成一片星空，跨科相關的概念連成星座。",
  path: "/stars",
  image: "stars",
});

export default function StarsPage() {
  return (
    <main className="px-6 py-10 md:px-12">
      <PageHeader code="[KS] 一個名詞一顆星" title="知識星圖" en="STARS" color="var(--gold)" />
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        筆記開頭「先認識的名詞」裡的每個名詞是一顆星，同一門課聚成一團星雲。同一個概念常常在另一門課換個名字再出現，選一顆星，那些地方就會連成星座。筆記寫得越多，星空就越密。
      </p>
      <StarMap data={data as StarData} />
    </main>
  );
}
