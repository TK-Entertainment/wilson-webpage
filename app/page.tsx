import { allBlogs, allAlbums } from "contentlayer/generated";
import Image from "next/image";
import { type TagCount, getTopicTagsMap } from "@/utils/tags";
import getTopicTagsIcon from "@/utils/tagsicon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import GlitchText from "@/components/glitchtext";
import Ticker from "@/components/ticker";

const sections = [
  {
    href: "/blog",
    code: "[01] 來杯好茶の",
    title: "日常碎念",
    description: "生活裡的大小事、心情與隨手記錄",
    block: "bg-bh-red text-white",
    shape: "rounded-full bg-bh-yellow",
  },
  {
    href: "/docs",
    code: "[02] 來杯咖啡の",
    title: "學習日常",
    description: "上課筆記與學習心得",
    block:
      "bg-bh-blue text-white md:border-l-4 max-md:border-t-4 border-foreground",
    shape: "bg-bh-yellow [clip-path:polygon(50%_0,100%_100%,0_100%)]",
  },
  {
    href: "/gallery",
    code: "[03] 來杯果汁の",
    title: "生活影像",
    description: "生活照片與影片紀錄",
    block:
      "bg-bh-yellow text-bh-ink md:border-l-4 max-md:border-t-4 border-foreground",
    shape: "rotate-12 bg-bh-red",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sv-SE");
}

export default function HomePage() {
  const postSorted = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const latestPosts = postSorted.slice(0, 3);
  const latestAlbums = [...allAlbums]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const topicTags: [string, TagCount][] = [...getTopicTagsMap().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );

  return (
    <main>
      <Ticker />

      <section className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] border-b-4 border-foreground">
        <div className="flex flex-col justify-end gap-5 px-6 py-12 md:px-12 md:py-16">
          <p className="font-mono-label text-sm font-bold tracking-wider">
            &gt; WILSON&apos;S NOTES
            <span className="caret" aria-hidden="true" />
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.98] tracking-tight">
            <GlitchText text="威爾森的" className="block" />
            <GlitchText text="生活札記" className="block text-bh-red" />
          </h1>
          <p className="max-w-[30ch] text-lg font-medium leading-relaxed">
            來杯好茶聊聊日常碎念，來杯咖啡記下學習日常，來杯果汁收藏生活影像。
          </p>
        </div>
        <div
          className="bh-art relative overflow-hidden bg-bh-yellow md:border-l-4 max-md:border-t-4 border-foreground max-md:aspect-[16/10] md:aspect-square"
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 left-[12%] w-1 bg-bh-ink" />
          <div className="ghost absolute left-[8%] top-[10%] aspect-square w-[62%] rounded-full bg-bh-blue" />
          <div className="circle absolute left-[8%] top-[10%] aspect-square w-[62%] rounded-full bg-bh-red" />
          <div className="quarter absolute right-0 top-0 aspect-square w-[42%] rounded-bl-full bg-bh-ink" />
          <div className="bar absolute inset-x-0 bottom-[18%] h-[14%] bg-bh-blue" />
          <div className="tri absolute bottom-[6%] right-[10%] aspect-square w-[26%] bg-bh-paper [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
          <div className="scan absolute inset-x-0 h-[18%]" />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 border-b-4 border-foreground">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`group relative flex min-h-[220px] flex-col justify-end gap-2 overflow-hidden px-6 py-10 md:px-10 ${section.block}`}
          >
            <i
              className={`absolute -right-[6%] -top-[20%] aspect-square w-[46%] transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110 ${section.shape}`}
              aria-hidden="true"
            />
            <span className="relative font-mono-label text-sm font-bold">
              {section.code}
            </span>
            <strong className="jitter-hover relative text-4xl lg:text-5xl font-black leading-none">
              {section.title}
            </strong>
            <span className="relative text-sm opacity-90">
              {section.description}
            </span>
          </Link>
        ))}
      </section>

      <section className="px-6 py-10 md:px-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="flex items-center gap-3 text-2xl font-black">
            <span className="h-4 w-4 rounded-full bg-bh-red" />
            最新碎念
          </h2>
          <Link
            href="/blog"
            className="font-mono-label text-sm font-bold hover:text-bh-red"
          >
            {`ALL(${allBlogs.length}) →`}
          </Link>
        </div>
        <div className="mt-4">
          {latestPosts.length == 0 ? (
            <p className="border-t-2 border-foreground py-6 font-mono-label text-sm font-bold">
              {"> 第一杯茶正在泡，碎念即將上桌"}
              <span className="caret" aria-hidden="true" />
            </p>
          ) : (
            <></>
          )}
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={post.outside ? `${post.outsideLink}` : `/blog/${post.slug}`}
              className="group grid grid-cols-1 gap-1 border-t-2 border-foreground py-4 sm:grid-cols-[140px_1fr] sm:gap-4"
            >
              <time className="font-mono-label text-sm font-bold text-bh-blue dark:text-bh-yellow">
                {formatDate(post.date)}
              </time>
              <div>
                <b className="split-hover block text-xl font-black">
                  {post.title}
                </b>
                {post.description ? (
                  <span className="text-sm text-muted-foreground">
                    {post.description}
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t-4 border-foreground px-6 py-10 md:px-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="flex items-center gap-3 text-2xl font-black">
            <span className="h-4 w-4 bg-bh-yellow" />
            最新影像
          </h2>
          <Link
            href="/gallery"
            className="font-mono-label text-sm font-bold hover:text-bh-red"
          >
            {`ALL(${allAlbums.length}) →`}
          </Link>
        </div>
        {latestAlbums.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {latestAlbums.map((album) => (
              <Link
                key={album.slug}
                href={`/gallery/${album.slug}`}
                className="group flex flex-col gap-2"
              >
                <div className="aspect-[4/5] overflow-hidden border-2 border-foreground bg-bh-yellow">
                  {album.cover ? (
                    <Image
                      alt={album.title}
                      src={`/img/gallery/${album.slug}/${album.cover}`}
                      width={480}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <p className="split-hover font-black">{album.title}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 border-t-2 border-foreground py-6 font-mono-label text-sm font-bold">
            {"> 果汁還在榨，第一本相簿即將登場"}
            <span className="caret" aria-hidden="true" />
          </p>
        )}
      </section>

      {topicTags.length > 0 ? (
        <section className="border-t-4 border-foreground px-6 py-10 md:px-12">
          <h2 className="flex items-center gap-3 text-2xl font-black">
            <span className="h-4 w-4 bg-bh-blue [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
            探索主題
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {topicTags.map(([topic, count]) => (
              <Link
                key={topic}
                href={`/blog/tags/${topic}`}
                className="group inline-flex items-center gap-2 border-2 border-foreground px-3 py-2 font-bold transition-colors hover:bg-bh-yellow hover:text-bh-ink"
              >
                <FontAwesomeIcon
                  icon={getTopicTagsIcon(topic)}
                  className="text-sm"
                />
                <span>{topic}</span>
                <span className="font-mono-label text-xs">{count.count}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <></>
      )}
    </main>
  );
}
