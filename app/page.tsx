import { formatDate } from "@/utils/date";
import { allBlogs, allAlbums } from "contentlayer/generated";
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

  // 首頁照片：最新幾本有封面的相簿；空心大字用 place／subject，沒填就用「・」拆標題
  const photos: HomePhoto[] = albumsByDate
    .filter((album) => album.cover)
    .slice(0, 4)
    .map((album) => {
      const [first, second] = album.title.split("・");
      return {
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

  const posts = [...allBlogs]
    .sort(byDate)
    .slice(0, 3)
    .map((post) => ({
      href: post.outside ? `${post.outsideLink}` : `/blog/${post.slug}`,
      title: post.title,
      date: formatDate(post.date),
      description: post.description,
    }));

  const albums = albumsByDate.slice(0, 2).map((album) => ({
    href: `/gallery/${album.slug}`,
    title: album.title,
    date: dot(album.date).slice(5),
    cover: album.cover
      ? `/img/gallery/${album.slug}/${album.cover}`
      : undefined,
  }));

  return (
    <main>
      <Home
        photos={photos}
        posts={posts}
        albums={albums}
        postCount={allBlogs.length}
        albumCount={allAlbums.length}
      />
    </main>
  );
}
