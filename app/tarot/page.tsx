import type { Metadata } from "next";
import TarotTable from "@/components/tarot/TarotTable";
import { pageMetadata } from "@/utils/seo";
import "./tarot.css";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 喝完茶の來抽一張牌",
  description:
    "22 張大阿爾克那，每張牌是一種動物，也藏著一個地球科學的小故事。抽一張牌看看今天的指引。",
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
