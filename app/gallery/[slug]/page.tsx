import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allAlbums } from "contentlayer/generated";
import { MDXContent } from "next-docs-ui/mdx";
import { Content } from "@/components/content";
import GlitchText from "@/components/glitchtext";

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  const params = allAlbums.map((album) => ({ slug: album.slug }));

  // Cloudflare (next-on-pages) 要求此路由至少有一個預先產生的頁面，
  // 還沒有任何相簿時放一個會 404 的佔位頁
  return params.length > 0 ? params : [{ slug: "_placeholder" }];
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const album = allAlbums.find((album) => album.slug == params.slug);

  return {
    title: `威爾森的生活札記 | ${album?.title ?? "生活影像"}`,
    description: album?.description,
    openGraph: {
      images: album?.cover ? `/img/gallery/${album.slug}/${album.cover}` : "",
    },
  };
}

export default function AlbumPage({ params }: { params: { slug: string } }) {
  const album = allAlbums.find((album) => album.slug == params.slug);

  if (album == undefined) {
    notFound();
  }

  return (
    <MDXContent>
      <div className="mx-auto max-w-4xl px-2 pt-4 md:px-12 md:pt-8">
        <header className="nd-not-prose mb-8 border-b-4 border-foreground pb-8 md:pt-8 pt-4">
          <Link
            href="/gallery"
            className="font-mono-label text-sm font-bold hover:text-bh-red"
          >
            ← 回到生活影像
          </Link>
          <p className="mt-4 font-mono-label text-sm font-bold text-bh-blue dark:text-bh-yellow">
            {new Date(album.date).toLocaleDateString("sv-SE")}
            {album.location ? ` // ${album.location}` : ""}
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            <GlitchText text={album.title} />
          </h1>
          {album.description ? (
            <p className="mt-4 text-lg font-medium leading-relaxed">
              {album.description}
            </p>
          ) : (
            <></>
          )}
        </header>
        <Content code={album.body.code} />
      </div>
    </MDXContent>
  );
}
