import { allPlaces } from "contentlayer/generated";

// 打卡相簿：有照片的打卡點依月份自動整理成相簿（/gallery/checkins-2026-10）
// 只有年份、或沒有日期的打卡不會出現在相簿裡（地圖上照樣看得到）

export const CATEGORY_ZH = {
  trip: "旅行",
  life: "生活",
  work: "出差",
  wild: "野外",
} as const;

export type CheckinPhoto = {
  /** photo：照片、video：短片、youtube：src 是影片 id */
  kind: "photo" | "video" | "youtube";
  src: string;
  place: string;
  placeId: string;
  date: string;
  county: string;
  category: keyof typeof CATEGORY_ZH;
  text?: string;
};

export type CheckinAlbum = {
  slug: string;
  month: string; // 2026-10
  title: string;
  /** 這個月最新一筆打卡的日期 */
  date: string;
  cover: string;
  photos: CheckinPhoto[];
  counties: string[];
};

export function getCheckinAlbums(): CheckinAlbum[] {
  const byMonth = new Map<string, CheckinPhoto[]>();
  for (const p of allPlaces) {
    const media: [CheckinPhoto["kind"], string][] = [
      ...((p.photos as string[] | undefined) ?? []).map((src) => ["photo", src] as [CheckinPhoto["kind"], string]),
      ...((p.videos as string[] | undefined) ?? []).map((src) => ["video", src] as [CheckinPhoto["kind"], string]),
      ...(p.youtubeId ? [["youtube", p.youtubeId] as [CheckinPhoto["kind"], string]] : []),
    ];
    if (!p.date || p.date.length < 7 || !media.length) continue;
    const month = p.date.slice(0, 7);
    const list = byMonth.get(month) ?? [];
    for (const [kind, src] of media) {
      list.push({
        kind,
        src,
        place: p.name,
        placeId: p.id,
        date: p.date,
        county: p.countyName,
        category: p.category,
        text: p.text,
      });
    }
    byMonth.set(month, list);
  }
  return [...byMonth.entries()]
    .map(([month, photos]) => {
      // 相簿裡新的在前，同一天依打卡代號（時間）排
      photos.sort(
        (a, b) => b.date.localeCompare(a.date) || b.placeId.localeCompare(a.placeId),
      );
      return {
        slug: `checkins-${month}`,
        month,
        title: `打卡相簿・${month.replace("-", ".")}`,
        date: photos[0].date,
        // 封面：第一張照片；只有影片的月份沒有封面
        cover: photos.find((x) => x.kind === "photo")?.src ?? "",
        photos,
        counties: [...new Set(photos.map((p) => p.county))],
      };
    })
    .sort((a, b) => b.month.localeCompare(a.month));
}

export function getCheckinAlbum(slug: string) {
  return getCheckinAlbums().find((a) => a.slug === slug);
}
