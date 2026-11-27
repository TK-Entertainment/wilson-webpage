"use client";

// 筆記頁「先認識的名詞」標題底下的一行：這一頁的名詞在知識星圖上是一個星座，點了直接飛過去。
// 只有放進星圖的四門課才有（scripts/stars-data.mjs 從這四門課的「先認識的名詞」抽名詞）。
import Link from "next/link";
import { usePathname } from "next/navigation";

const COURSES = ["geochemistry", "structural-geology", "mineralogy", "earth-materials"];

export function StarLink() {
  const path = (usePathname() ?? "").replace(/^\/docs\//, "").replace(/\/$/, "");
  if (!COURSES.includes(path.split("/")[0]) || !path.includes("/")) return null;
  return (
    <p className="nd-not-prose -mt-2 mb-4">
      <Link href={`/stars?p=${path}`} className="font-mono-label text-xs font-bold text-muted-foreground no-underline transition-colors hover:text-[var(--gold)]">
        ✦ 這些名詞在知識星圖上是一個星座 → 飛過去看
      </Link>
    </p>
  );
}
