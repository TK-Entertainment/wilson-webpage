import { formatDate } from "@/utils/date";
import Link from "next/link";
import { tagHref } from "@/utils/tags";
import Image from "next/image";
import type { Blog } from "contentlayer/generated";
import PostCover from "@/components/PostCover";

export default function PostBlock({ page }: { page: Blog }) {
  const href = page.outside ? `${page.outsideLink}` : `/blog/${page.slug}`;
  const cover = page.image ? `/img/${page.slug}/${page.image}` : null;

  return (
    <article className="group flex flex-row gap-5 border-t-2 border-foreground py-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-mono-label text-sm font-bold text-bh-blue dark:text-bh-yellow">
          {formatDate(page.date)}
          {page.outside ? " // 外部文章" : ""}
        </p>
        <Link
          href={href}
          className="split-hover mt-1 text-2xl font-black leading-snug"
        >
          {page.title}
        </Link>
        {page.description ? (
          <p className="mt-2 leading-relaxed text-muted-foreground line-clamp-2">
            {page.description}
          </p>
        ) : (
          <></>
        )}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono-label text-xs font-bold">
          {page.tags?.map((tag) => (
            <Link
              key={tag}
              href={tagHref(tag)}
              className="transition-colors hover:text-bh-red"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
      <Link
        href={href}
        className="aspect-[4/3] w-24 flex-none self-start overflow-hidden border-2 border-foreground sm:w-40"
      >
        {cover ? (
          <Image
            alt={page.title}
            src={cover}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            width={320}
            height={240}
          />
        ) : (
          <div className="h-full w-full transition duration-300 group-hover:scale-105">
            <PostCover seed={page.slug} />
          </div>
        )}
      </Link>
    </article>
  );
}
