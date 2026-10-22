import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { allBlogs } from "contentlayer/generated";
import { MDXContent } from "next-docs-ui/mdx";
import { Content } from "@/components/content";
import { getTableOfContents } from "next-docs-zeta/server";
import { TOC } from "@/components/toc";
import Actionbar from "@/components/Navigation/actionbar";
import ArticleMobileTocLauncher from "@/components/ArticleMobileTocLauncher";
import Link from "next/link";
import GlitchText from "@/components/glitchtext";
import ReadingProgress from "@/components/ReadingProgress";
import ArticleNeighbours from "@/components/ArticleNeighbours";
import { readingTimeLabel } from "@/utils/readingtime";

export function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Metadata {
  const slug = params.slug ?? "";
  const blog = allBlogs.find((blog) => blog.slug == params.slug);

  return {
    title: `威爾森的生活札記 | ${blog?.title}`,
    description: blog?.description,
    openGraph: {
      type: "article",
      images: blog?.image ?? "",
      title: `威爾森的生活札記 | ${blog?.title}`,
      authors: blog?.authors,
      tags: blog?.tags,
      description: blog?.description,
    },
  };
}

export default async function BlogSlug({
  params,
}: {
  params: { slug?: string };
}) {
  const page = allBlogs.find((blog) => blog.slug == params.slug);

  if (page == undefined) {
    notFound();
  }

  const toc = await getTableOfContents(page.body.raw);

  return (
    <>
      <ArticleMobileTocLauncher items={toc} />
      <ReadingProgress />
      <MDXContent>
        <div className="grid grid-cols-7">
          <div className="col-span-6 max-xl:col-span-full px-2 md:px-12 md:mt-8 mt-4 max-w-3xl">
            <header className="nd-not-prose mb-10 border-b-4 border-foreground pb-8 md:pt-8 pt-4">
              <p className="font-mono-label text-sm font-bold text-bh-blue dark:text-bh-yellow">
                {new Date(page.date).toLocaleDateString("sv-SE")}
                {page.authors ? ` // ${page.authors.join("、")}` : ""}
                {` // ${readingTimeLabel(page.body.raw)}`}
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                <GlitchText text={page.title} />
              </h1>
              {page.description ? (
                <p className="mt-4 text-lg font-medium leading-relaxed">
                  {page.description}
                </p>
              ) : (
                <></>
              )}
              <div className="mt-5 flex flex-wrap gap-2 font-mono-label text-xs font-bold">
                {page.tags?.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tags/${tag}`}
                    className="border-2 border-foreground px-2 py-1 transition-colors hover:bg-bh-yellow hover:text-bh-ink"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </header>
            <div data-reading-body>
              <Content code={page.body.code} />
            </div>
            <ArticleNeighbours slug={page.slug} />
          </div>
          <TOC items={toc} />
        </div>
      </MDXContent>
    </>
  );
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const params = allBlogs.map((blog) => ({
    slug: blog.slug,
  }));

  // Cloudflare (next-on-pages) 要求此路由至少有一個預先產生的頁面，
  // 還沒有任何文章時放一個會 404 的佔位頁
  return params.length > 0 ? params : [{ slug: "_placeholder" }];
}
