import { formatDate } from "@/utils/date";
import { allBlogs, allAlbums, allPlaces, allDocs, allMeta } from "contentlayer/generated";
import notesAdded from "@/components/home/notesAdded.json";
import { courseColor } from "@/utils/palette";
import { getCheckinAlbums } from "@/utils/checkinAlbums";
import Home, { type HomePhoto, type HomeActivity } from "@/components/home/home";
import { pageMetadata, siteName } from "@/utils/seo";
import "./home.css";

export const metadata = pageMetadata({
  title: siteName,
  path: "/",
  image: "default",
});

const byDate = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

const dot = (d: string) =>
  formatDate(d).replace(/-/g, ".");

export default function HomePage() {
  const albumsByDate = [...allAlbums].sort(byDate);

  // 首頁照片：相簿封面＋足跡地圖有照片的打卡，依日期混在一起取最新 6 張
  // 空心大字：相簿用 place／subject（沒填就用「・」拆標題）；打卡用縣市／地點名稱
  const albumPhotos = albumsByDate
    .filter((album) => album.cover)
    .map((album) => {
      const [first, second] = album.title.split("・");
      return {
        sort: album.date,
        href: `/gallery/${album.slug}`,
        title: album.title,
        date: dot(album.date),
        cover: `/img/gallery/${album.slug}/${album.cover}`,
        top: album.place ?? first,
        bottom: album.subject ?? second ?? album.location ?? "",
        lat: album.lat,
        lng: album.lng,
      };
    });
  const checkinPhotos = allPlaces
    .filter((p) => p.photos?.length && p.date && p.date.length >= 10)
    .map((p) => ({
      sort: p.date!,
      href: `/map?place=${encodeURIComponent(p.id)}`,
      title: p.name,
      date: dot(p.date!),
      cover: (p.photos as string[])[0],
      top: p.countyName.replace(/[縣市]$/, ""),
      // 字多的時候首頁的空心字會自己縮小，不用截斷
      bottom: p.name.split("・").pop() ?? p.name,
      lat: p.lat,
      lng: p.lng,
    }));
  const photos: HomePhoto[] = [...albumPhotos, ...checkinPhotos]
    .sort((a, b) => b.sort.localeCompare(a.sort))
    .slice(0, 6)
    .map(({ sort, ...photo }) => photo);

  const posts = [...allBlogs]
    .sort(byDate)
    .slice(0, 3)
    .map((post) => ({
      href: post.outside ? `${post.outsideLink}` : `/blog/${post.slug}`,
      title: post.title,
      date: formatDate(post.date),
      description: post.description,
    }));

  // 最新相簿：手動整理的相簿＋月份打卡相簿
  const checkinAlbums = getCheckinAlbums();
  const albums = [
    ...albumsByDate.map((album) => ({
      sort: album.date,
      href: `/gallery/${album.slug}`,
      title: album.title,
      date: dot(album.date).slice(5),
      cover: album.cover
        ? `/img/gallery/${album.slug}/${album.cover}`
        : undefined,
    })),
    ...checkinAlbums.map((album) => ({
      sort: album.date,
      href: `/gallery/${album.slug}`,
      title: album.title,
      date: dot(album.date).slice(5),
      cover: album.cover || undefined,
    })),
  ]
    .sort((a, b) => b.sort.localeCompare(a.sort))
    .slice(0, 2)
    .map(({ sort, ...album }) => album);

  // 最近動態：碎念、筆記、打卡、相簿依日期混在一起；同一天同一門課的筆記、同一天的打卡併成一則
  const added = notesAdded as Record<string, string>;
  const courseTitle = (folder: string) =>
    allMeta.find((m) => m._raw.sourceFileDir === folder)?.title ?? folder;
  const noteGroups = new Map<string, { date: string; folder: string; docs: { title: string; url: string }[] }>();
  for (const doc of allDocs) {
    const path = doc._raw.flattenedPath;
    const date = added[path];
    const folder = path.split("/")[0];
    if (!date || !path.includes("/")) continue;
    const key = `${date}|${folder}`;
    const g = noteGroups.get(key) ?? { date, folder, docs: [] };
    g.docs.push({ title: doc.title, url: `/docs/${path}` });
    noteGroups.set(key, g);
  }
  const short = (t: string) => t.split("　")[0];
  const noteItems: (HomeActivity & { sort: string })[] = [...noteGroups.values()].map((g) => ({
    sort: g.date,
    date: dot(g.date),
    kind: g.folder === "research" ? "研究" : "筆記",
    color: courseColor(g.folder) ?? "var(--teal)",
    title:
      g.docs.length === 1
        ? `${courseTitle(g.folder)}：${g.docs[0].title}`
        : `${courseTitle(g.folder)}新增 ${g.docs.length} 篇筆記`,
    sub: g.docs.length === 1 ? undefined : g.docs.map((d) => short(d.title)).slice(0, 4).join("、") + (g.docs.length > 4 ? "⋯⋯" : ""),
    href: g.docs[0].url,
  }));
  const checkinDays = new Map<string, typeof allPlaces>();
  for (const p of allPlaces) {
    if (!p.date || p.date.length < 10) continue;
    const d = p.date.slice(0, 10);
    checkinDays.set(d, [...(checkinDays.get(d) ?? []), p]);
  }
  const checkinItems: (HomeActivity & { sort: string })[] = [...checkinDays.entries()].map(([d, ps]) => ({
    sort: d,
    date: dot(d),
    kind: "打卡",
    color: "var(--sage)",
    title: ps.length === 1 ? `${ps[0].countyName}・${ps[0].name}` : `${ps[0].countyName}等地打卡 ${ps.length} 處`,
    sub: ps.length === 1 ? undefined : ps.map((p) => p.name).slice(0, 4).join("、") + (ps.length > 4 ? "⋯⋯" : ""),
    href: `/map?place=${encodeURIComponent(ps[0].id)}`,
  }));
  const activity: HomeActivity[] = [
    ...allBlogs.filter((b) => !b.outside).map((b) => ({
      sort: b.date.slice(0, 10),
      date: dot(b.date),
      kind: "碎念",
      color: "var(--gold)",
      title: b.title,
      href: `/blog/${b.slug}`,
    })),
    ...allAlbums.map((a) => ({
      sort: a.date.slice(0, 10),
      date: dot(a.date),
      kind: "影像",
      color: "var(--orange)",
      title: a.title,
      href: `/gallery/${a.slug}`,
    })),
    ...noteItems,
    ...checkinItems,
  ]
    .sort((a, b) => b.sort.localeCompare(a.sort))
    .slice(0, 8)
    .map(({ sort, ...item }) => item);

  return (
    <main>
      <Home
        photos={photos}
        posts={posts}
        albums={albums}
        activity={activity}
        postCount={allBlogs.length}
        albumCount={allAlbums.length + checkinAlbums.length}
      />
    </main>
  );
}
