import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import StarMap, { type StarData } from "@/components/stars/StarMap";
import data from "@/components/stars/starData.json";
import { pageMetadata } from "@/utils/seo";
import "./stars.css";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 知識星圖",
  description: "四門地科課的 470 個名詞，照 1677 年日本古星圖〈天文分野之圖〉的星位排成一片星空，跨科相關的概念連成星座。",
  path: "/stars",
  image: "stars",
});

export default function StarsPage() {
  return (
    <main className="px-6 py-10 md:px-12">
      <PageHeader code="[KS] 一個名詞一顆星" title="知識星圖" en="STARS" color="var(--gold)" />
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        筆記開頭「先認識的名詞」裡的每個名詞是一顆星。星的位置照 1677 年保井（澀川）春海刻印的〈天文分野之圖〉：北極在中心，一門課占一個方位，一頁筆記是一群相鄰的星。同一個概念常常在另一門課換個名字再出現：點一顆星，鏡頭會飛進那一頁的星座，跨科的連線可以一路飛過去；點過的星會留著光，一頁全點過，星座就留在天上。
      </p>
      <StarMap data={data as StarData} />
    </main>
  );
}
