import { formatDate } from "@/utils/date";
import { allBlogs, allAlbums, allPlaces } from "contentlayer/generated";
import { getCheckinAlbums } from "@/utils/checkinAlbums";
import Home, { type HomePhoto } from "@/components/home/home";
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

  return (
    <main>
      <Home
        photos={photos}
        posts={posts}
        albums={albums}
        postCount={allBlogs.length}
        albumCount={allAlbums.length + checkinAlbums.length}
      />
    </main>
  );
}
