import Link from "next/link";
import { allBlogs, type Blog } from "contentlayer/generated";

function byDateAsc(a: Blog, b: Blog) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("sv-SE");
}

/** 文章底部：上一篇／下一篇（依日期）與相關文章（共同標籤最多的前三篇） */
export default function ArticleNeighbours({ slug }: { slug: string }) {
  const posts = [...allBlogs].sort(byDateAsc);
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return null;

  const current = posts[index];
  const prev = index > 0 ? posts[index - 1] : undefined;
  const next = index < posts.length - 1 ? posts[index + 1] : undefined;

  const tags = new Set(current.tags ?? []);
  const related = posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: (post.tags ?? []).filter((tag) => tags.has(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime(),
    )
    .slice(0, 3)
    .map(({ post }) => post);

  if (!prev && !next && related.length === 0) return null;

  return (
    <nav aria-label="更多文章" className="nd-not-prose mt-16 mb-8">
      {prev || next ? (
        <div className="grid border-y-4 border-foreground sm:grid-cols-2">
          {prev ? (
            <NeighbourLink post={prev} label="← 上一篇" accent="red" />
          ) : (
            <></>
          )}
          {next ? (
            <NeighbourLink
              post={next}
              label="下一篇 →"
              accent="blue"
              alignEnd
              divider={!!prev}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      {related.length > 0 ? (
        <section className="mt-12">
          {/* 用 div 避開文章 h2 的紅點樣式 */}
          <div
            role="heading"
            aria-level={2}
            className="flex items-center gap-3 border-b-4 border-foreground pb-3 text-2xl font-black"
          >
            <span aria-hidden className="inline-block h-4 w-4 bg-bh-red" />
            相關文章
            <span className="ml-auto font-mono-label text-xs font-bold text-bh-blue dark:text-bh-yellow">
              RELATED // {related.length}
            </span>
          </div>
          <ul>
            {related.map((post, i) => (
              <li key={post.slug} className="border-b-2 border-foreground">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-4 py-4 transition-colors hover:bg-bh-yellow hover:text-bh-ink"
                >
                  <span
                    aria-hidden
                    className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center bg-bh-blue font-mono-label text-xs font-bold text-white"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="split-hover block text-lg font-black leading-snug">
                      {post.title}
                    </span>
                    <span className="mt-1 block font-mono-label text-xs font-bold opacity-70">
                      {formatDate(post.date)}
                      {post.tags?.length
                        ? ` // ${post.tags.map((t) => `#${t}`).join(" ")}`
                        : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <></>
      )}
    </nav>
  );
}

function NeighbourLink({
  post,
  label,
  accent,
  alignEnd = false,
  divider = false,
}: {
  post: Blog;
  label: string;
  accent: "red" | "blue";
  alignEnd?: boolean;
  divider?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative block px-4 py-6 transition-colors hover:bg-bh-yellow hover:text-bh-ink ${
        alignEnd ? "text-right sm:col-start-2" : ""
      } ${divider ? "border-foreground max-sm:border-t-4 sm:border-l-4" : ""}`}
    >
      <span
        aria-hidden
        className={`absolute top-0 h-2 w-12 ${alignEnd ? "right-0" : "left-0"} ${
          accent === "red" ? "bg-bh-red" : "bg-bh-blue"
        }`}
      />
      <span
        className={`font-mono-label text-xs font-bold ${
          accent === "red" ? "text-bh-red" : "text-bh-blue dark:text-bh-yellow"
        } group-hover:text-bh-ink`}
      >
        {label}
      </span>
      <span className="split-hover mt-2 block text-xl font-black leading-snug">
        {post.title}
      </span>
      <span className="mt-1 block font-mono-label text-xs opacity-70">
        {formatDate(post.date)}
      </span>
    </Link>
  );
}
