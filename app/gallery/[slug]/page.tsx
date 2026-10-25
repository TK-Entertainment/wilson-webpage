import { formatDate } from "@/utils/date";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allAlbums } from "contentlayer/generated";
import { MDXContent } from "next-docs-ui/mdx";
import { Content } from "@/components/content";
import GlitchText from "@/components/glitchtext";
import Comments from "@/components/comments";
import { pageMetadata } from "@/utils/seo";
import { Zoomable } from "@/components/lightbox";
import {
  CATEGORY_ZH,
  getCheckinAlbum,
  getCheckinAlbums,
  type CheckinAlbum,
} from "@/utils/checkinAlbums";

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  const params = [
    ...allAlbums.map((album) => ({ slug: album.slug })),
    // 足跡地圖打卡照片自動整理的月份相簿
    ...getCheckinAlbums().map((album) => ({ slug: album.slug })),
  ];

  // Cloudflare (next-on-pages) 要求此路由至少有一個預先產生的頁面，
  // 還沒有任何相簿時放一個會 404 的佔位頁
  return params.length > 0 ? params : [{ slug: "_placeholder" }];
}

// Next 15 起 params 是 Promise
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const checkin = getCheckinAlbum(params.slug);
  if (checkin) {
    return pageMetadata({
      title: `威爾森的生活札記 | ${checkin.title}`,
      description: `${checkin.month.replace("-", " 年 ")} 月在足跡地圖打卡的 ${checkin.photos.length} 張照片：${checkin.counties.join("、")}。`,
      path: `/gallery/${checkin.slug}`,
      image: "gallery",
      type: "article",
      publishedTime: checkin.date,
    });
  }
  const album = allAlbums.find((album) => album.slug == params.slug);

  return pageMetadata({
    title: `威爾森的生活札記 | ${album?.title ?? "生活影像"}`,
    description: album?.description,
    path: `/gallery/${params.slug}`,
    image: album ? `gallery/${album.slug}` : "gallery",
    type: "article",
    publishedTime: album?.date,
  });
}

export default async function AlbumPage(props: Props) {
  const params = await props.params;
  const checkin = getCheckinAlbum(params.slug);
  if (checkin) return <CheckinAlbumPage album={checkin} />;
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
            {formatDate(album.date)}
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
        <Comments />
      </div>
    </MDXContent>
  );
}

// 打卡相簿：足跡地圖上有照片的打卡點，依月份整理
function CheckinAlbumPage({ album }: { album: CheckinAlbum }) {
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
            CHECK-IN {"//"} {album.photos.length} 張 {"//"}{" "}
            {album.counties.join("・")}
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            <GlitchText text={album.title} />
          </h1>
          <p className="mt-4 text-lg font-medium leading-relaxed">
            這個月在
            <Link href="/map" className="mx-1 underline decoration-2 underline-offset-4 hover:text-bh-red">
              足跡地圖
            </Link>
            打卡時拍的照片。
          </p>
        </header>
        <Zoomable>
          <div className="photos checkin-photos nd-not-prose">
            {album.photos.map((p) => (
              <figure key={p.src} className="m-0 flex flex-col gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={`${p.place}（${p.county}）`}
                  loading="lazy"
                />
                <figcaption className="flex flex-col gap-0.5">
                  <span className="font-mono-label text-[11px] font-bold opacity-70">
                    {formatDate(p.date)} {"//"} {p.county} {"//"}{" "}
                    {CATEGORY_ZH[p.category]}
                  </span>
                  <span className="text-sm font-black">{p.place}</span>
                  {p.text ? (
                    <span className="text-xs leading-relaxed opacity-80">
                      {p.text}
                    </span>
                  ) : null}
                  <Link
                    href={`/map?place=${encodeURIComponent(p.placeId)}`}
                    className="font-mono-label text-[11px] font-bold text-bh-red hover:underline"
                  >
                    在地圖上看 →
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        </Zoomable>
        <Comments />
      </div>
    </MDXContent>
  );
}
