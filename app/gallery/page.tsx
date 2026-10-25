import { formatDate } from "@/utils/date";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { allAlbums } from "contentlayer/generated";
import PageHeader from "@/components/PageHeader";
import { pageMetadata } from "@/utils/seo";
import { getCheckinAlbums } from "@/utils/checkinAlbums";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 來杯果汁の生活影像",
  description: "來杯果汁，收藏生活裡的照片與影片紀錄。",
  path: "/gallery",
  image: "gallery",
});

export default function GalleryPage() {
  // 手動整理的相簿＋足跡地圖打卡照片自動整理的月份相簿，一起依日期排
  const albums = [
    ...allAlbums.map((a) => ({
      slug: a.slug,
      title: a.title,
      date: a.date,
      location: a.location,
      cover: a.cover ? `/img/gallery/${a.slug}/${a.cover}` : undefined,
      checkin: false,
    })),
    ...getCheckinAlbums().map((a) => ({
      slug: a.slug,
      title: a.title,
      date: a.date,
      location: `${a.photos.length} 則 // ${a.counties.join("・")}`,
      cover: a.cover || undefined,
      checkin: true,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className="px-6 py-10 md:px-12">
      <PageHeader
        code="[03] 來杯果汁の"
        title="生活影像"
        en="JUICE"
        color="var(--orange)"
      />

      {albums.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 pt-2 md:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album.slug}
              href={`/gallery/${album.slug}`}
              className="group flex flex-col gap-2"
            >
              <div className="aspect-[4/5] overflow-hidden border-2 border-foreground bg-bh-yellow transition-shadow group-hover:shadow-[6px_6px_0_#d6a53c]">
                {album.cover ? (
                  <Image
                    alt={album.title}
                    src={album.cover}
                    width={480}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <></>
                )}
              </div>
              <p className="font-mono-label text-xs font-bold text-bh-blue dark:text-bh-yellow">
                {formatDate(album.date)}
                {album.location ? ` // ${album.location}` : ""}
              </p>
              <p className="split-hover text-lg font-black leading-snug">
                {album.checkin ? (
                  <span
                    className="mr-1.5 inline-block bg-[var(--teal)] px-1 align-middle font-mono-label text-[10px] text-bh-ink"
                    aria-hidden="true"
                  >
                    CHECK-IN
                  </span>
                ) : null}
                {album.title}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="border-t-4 border-foreground pt-8 font-mono-label text-sm font-bold">
          {"> 果汁還在榨，第一本相簿即將登場"}
          <span className="caret" aria-hidden="true" />
        </p>
      )}
    </main>
  );
}
