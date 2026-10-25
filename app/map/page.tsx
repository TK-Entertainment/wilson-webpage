import type { Metadata } from "next";
import { allAlbums, allBlogs, allPlaces } from "contentlayer/generated";
import FootprintMap, { type CheckIn } from "@/components/map/FootprintMap";
import { pageMetadata } from "@/utils/seo";
import mapData from "@/data/map/taiwan-map.json";
import "./map.css";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 帶著飲料出門の足跡地圖",
  description: "去過的地方、生活裡有趣的點，一個一個打卡，把台灣的版圖慢慢點亮。",
  path: "/map",
  image: "map",
});

// 打卡點的連結：相簿 → 文章 → 其他網址，有哪個用哪個
function linkOf(p: (typeof allPlaces)[number]): CheckIn["link"] {
  if (p.album && allAlbums.some((a) => a.slug === p.album))
    return { label: "看相簿", href: `/gallery/${p.album}` };
  if (p.post && allBlogs.some((b) => b.slug === p.post))
    return { label: "看文章", href: `/blog/${p.post}` };
  if (p.url) return { label: "看連結", href: p.url };
  return undefined;
}

export default function MapPage() {
  const checkins: CheckIn[] = allPlaces.map((p) => ({
    id: p.id,
    name: p.name,
    cat: p.category,
    date: p.date ?? "",
    lat: p.lat,
    lng: p.lng,
    county: p.countyName,
    text: p.text,
    photos: (p.photos as string[] | undefined) ?? [],
    videos: (p.videos as string[] | undefined) ?? [],
    youtube: p.youtubeId || undefined,
    link: linkOf(p),
  }));

  return <FootprintMap checkins={checkins} map={mapData} />;
}
