import { allBlogs, allAlbums } from "contentlayer/generated";
import ScrollHome from "@/components/home/scrollhome";
import "./home.css";

const byDate = (a: { date: string }, b: { date: string }) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

export default function HomePage() {
  const posts = [...allBlogs]
    .sort(byDate)
    .slice(0, 3)
    .map((post) => ({
      href: post.outside ? `${post.outsideLink}` : `/blog/${post.slug}`,
      title: post.title,
      date: new Date(post.date).toLocaleDateString("sv-SE"),
      description: post.description,
    }));
  const albums = [...allAlbums]
    .sort(byDate)
    .slice(0, 3)
    .map((album) => ({
      href: `/gallery/${album.slug}`,
      title: album.title,
      cover: album.cover
        ? `/img/gallery/${album.slug}/${album.cover}`
        : undefined,
    }));

  return (
    <main>
      <ScrollHome
        posts={posts}
        albums={albums}
        postCount={allBlogs.length}
        albumCount={allAlbums.length}
      />
    </main>
  );
}
