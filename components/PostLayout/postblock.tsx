import Link from "next/link";
import Image from "next/image";
import type { Blog } from "contentlayer/generated";

export default function PostBlock({ page }: { page: Blog }) {
  const href = page.outside ? `${page.outsideLink}` : `/blog/${page.slug}`;
  const cover =
    page.image != null ? `/img/${page.slug}/${page.image}` : "/img/taiwan.png";

  return (
    <article className="group flex flex-row gap-5 py-6">
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">
          {new Date(page.date).toLocaleDateString("zh-TW")}
          {page.outside ? " · 外部文章" : ""}
        </p>
        <Link
          href={href}
          className="mt-1 text-2xl leading-snug decoration-1 underline-offset-4 hover:underline"
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
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {page.tags?.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              className="transition-colors hover:text-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
      <Link
        href={href}
        className="flex-none self-start w-24 sm:w-40 aspect-[4/3] overflow-hidden rounded-lg"
      >
        <Image
          alt={page.title}
          src={cover}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={320}
          height={240}
        />
      </Link>
    </article>
  );
}
