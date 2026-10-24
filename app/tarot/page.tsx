import type { Metadata } from "next";
import TarotTable from "@/components/tarot/TarotTable";
import { pageMetadata } from "@/utils/seo";
import "./tarot.css";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 喝完茶の來抽一張牌",
  description:
    "一整副 78 張的地科動物塔羅：22 張大阿爾克那各是一種動物，56 張小阿爾克那對應地球的四個圈層。抽一張牌看看今天的指引。",
  path: "/tarot",
  image: "default",
});

export default function TarotPage() {
  return (
    <main className="min-h-screen">
      <TarotTable />
    </main>
  );
}
