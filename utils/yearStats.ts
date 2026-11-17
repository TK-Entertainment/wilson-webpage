// 年度回顧：從網站現有的資料（碎念、筆記、打卡、相簿）算一年的統計
import { allBlogs, allAlbums, allPlaces, allDocs, allMeta } from "contentlayer/generated";
import notesAdded from "@/components/home/notesAdded.json";
import { courseColor } from "@/utils/palette";

const added = notesAdded as Record<string, string>;
const docPath = (flattened: string) => flattened.replace(/^docs\//, "");

/** 粗估字數：中日文一個字算一字，英文一個單字算一字；程式碼、公式、標籤不算 */
export function countWords(raw: string) {
  const text = raw
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\$[^$\n]*\$/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\{[^{}]*\}/g, "");
  const cjk = text.match(/[぀-ヿ㐀-鿿]/g)?.length ?? 0;
  const latin = text.match(/[A-Za-z]+/g)?.length ?? 0;
  return cjk + latin;
}

export type Kind = "筆記" | "碎念" | "打卡" | "影像";
export const KIND_COLOR: Record<Kind, string> = {
  筆記: "var(--teal)",
  碎念: "var(--gold)",
  打卡: "var(--sage)",
  影像: "var(--orange)",
};

const yearOf = (d?: string) => (d && /^\d{4}/.test(d) ? d.slice(0, 4) : undefined);

export function availableYears() {
  const ys = new Set<string>();
  allBlogs.forEach((b) => ys.add(b.date.slice(0, 4)));
  allAlbums.forEach((a) => ys.add(a.date.slice(0, 4)));
  allPlaces.forEach((p) => {
    const y = yearOf(p.date);
    if (y) ys.add(y);
  });
  Object.values(added).forEach((d) => ys.add(d.slice(0, 4)));
  return [...ys].filter((y) => Number(y) >= 2020).sort().reverse();
}

export function yearStats(year: string) {
  const posts = allBlogs.filter((b) => b.date.startsWith(year) && !b.outside);
  const albums = allAlbums.filter((a) => a.date.startsWith(year));
  const places = allPlaces.filter((p) => yearOf(p.date) === year);
  const notes = allDocs.filter((d) => {
    const path = docPath(d._raw.flattenedPath);
    return path.includes("/") && added[path]?.startsWith(year);
  });

  const noteWords = notes.reduce((n, d) => n + countWords(d.body.raw), 0);
  const postWords = posts.reduce((n, b) => n + countWords(b.body.raw), 0);

  // 每月：有完整日期的才算得進月份
  const months = Array.from({ length: 12 }, (_, i) => ({
    m: i + 1,
    筆記: 0,
    碎念: 0,
    打卡: 0,
    影像: 0,
  }));
  const bump = (d: string | undefined, k: Kind) => {
    if (!d || d.length < 7) return;
    const m = Number(d.slice(5, 7));
    if (m >= 1 && m <= 12) months[m - 1][k] += 1;
  };
  notes.forEach((d) => bump(added[docPath(d._raw.flattenedPath)], "筆記"));
  posts.forEach((b) => bump(b.date, "碎念"));
  places.forEach((p) => bump(p.date, "打卡"));
  albums.forEach((a) => bump(a.date, "影像"));
  const busiest = [...months].sort(
    (a, b) => b.筆記 + b.碎念 + b.打卡 + b.影像 - (a.筆記 + a.碎念 + a.打卡 + a.影像),
  )[0];

  // 各門課新增幾篇
  const byCourse = new Map<string, number>();
  notes.forEach((d) => {
    const folder = docPath(d._raw.flattenedPath).split("/")[0];
    byCourse.set(folder, (byCourse.get(folder) ?? 0) + 1);
  });
  const courses = [...byCourse.entries()]
    .map(([folder, n]) => ({
      folder,
      n,
      title:
        allMeta.find((m) => docPath(m._raw.sourceFileDir) === folder)?.title ?? folder,
      color: courseColor(folder) ?? "var(--teal)",
    }))
    .sort((a, b) => b.n - a.n);

  // 去過的縣市（依第一次去的日期排）
  const counties = new Map<string, string>();
  [...places]
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))
    .forEach((p) => {
      if (!counties.has(p.countyName)) counties.set(p.countyName, p.date ?? year);
    });

  return {
    posts: posts.length,
    albums: albums.length,
    places: places.length,
    notes: notes.length,
    words: noteWords + postWords,
    noteWords,
    postWords,
    months,
    busiest,
    courses,
    counties: [...counties.keys()],
  };
}
