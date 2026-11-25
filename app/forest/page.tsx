import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import KnowledgeForest, { type ForestData } from "@/components/forest/KnowledgeForest";
import data from "@/components/forest/forestData.json";
import { pageMetadata } from "@/utils/seo";
import "./forest.css";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 知識森林",
  description: "四門地科課的名詞長成四棵樹，跨科相關的概念用線連起來。",
  path: "/forest",
  image: "forest",
});

export default function ForestPage() {
  return (
    <main className="px-6 py-10 md:px-12">
      <PageHeader code="[KF] 慢慢長出來的" title="知識森林" en="FOREST" color="var(--sage)" />
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        一門課是一棵樹，一頁筆記是一根枝，筆記開頭「先認識的名詞」裡的每個名詞是一片葉子。同一個概念常常在不同課裡換個名字再出現一次，那些地方用線連起來。筆記寫得越多，森林就長得越密。
      </p>
      <KnowledgeForest data={data as ForestData} />
    </main>
  );
}
