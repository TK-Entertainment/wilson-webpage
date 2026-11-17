import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import EarthNow from "@/components/earth/EarthNow";
import { pageMetadata } from "@/utils/seo";
import "./earth.css";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 今日地球",
  description: "此刻地球上正在發生的事：即時地震、野火與風暴、全球災害警報。",
  path: "/earth",
  image: "earth",
});

export default function EarthPage() {
  return (
    <main className="px-6 py-10 md:px-12">
      <PageHeader
        code="[EA] 此刻的"
        title="今日地球"
        en="EARTH"
        color="var(--teal)"
      />
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        地球不會停下來等人。這一頁每 5 分鐘從 USGS、NASA、GDACS
        抓一次資料，看看此刻哪裡在搖、哪裡在燒、哪裡有颱風。
      </p>
      <EarthNow />
    </main>
  );
}
