import { getPage, getPageUrl, tree } from "@/app/source";
import { allDocs } from "contentlayer/generated";
import type { Metadata } from "next";
import { MDXContent } from "next-docs-ui/mdx";
import { DocsPage } from "next-docs-ui/page";
import { findNeighbour, getTableOfContents } from "next-docs-zeta/server";
import { notFound } from "next/navigation";
import { Content } from "@/components/content";
import GlitchText from "@/components/glitchtext";
import ReadingProgress from "@/components/ReadingProgress";
import { readingTimeLabel } from "@/utils/readingtime";
import { pageMetadata } from "@/utils/seo";
import NotesIndex from "@/components/NotesIndex";
import PageHeader from "@/components/PageHeader";

export default async function Page({
  params,
}: {
  params: { slug?: string[] };
}) {
  const page = getPage(params.slug);

  if (page == null) {
    notFound();
  }

  const toc = await getTableOfContents(page.body.raw);
  const neighbour = findNeighbour(tree, getPageUrl(params.slug));

  return (
    <DocsPage toc={toc} footer={neighbour}>
      <ReadingProgress />
      <MDXContent>
        {(params.slug ?? []).length === 0 ? (
          <div className="nd-not-prose">
            <PageHeader
              code="[02] 來杯咖啡の"
              title="學習日常"
              en="COFFEE"
              color="var(--teal)"
            />
          </div>
        ) : (
          <h1 className="font-black">
            <GlitchText text={page.title} />
          </h1>
        )}
        <p className="nd-not-prose -mt-4 mb-8 font-mono-label text-sm font-bold text-bh-blue dark:text-bh-yellow">
          閱讀時間 // {readingTimeLabel(page.body.raw)}
        </p>
        <div data-reading-body>
          <Content code={page.body.code} />
        </div>
        {(params.slug ?? []).length === 0 ? <NotesIndex tree={tree} /> : <></>}
      </MDXContent>
    </DocsPage>
  );
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const params = allDocs
    .filter((page) => page.slug !== "")
    .map((page) => ({
      slug: page.slug.split("/"),
    }));

  // Cloudflare (next-on-pages) 要求此路由至少有一個預先產生的頁面，
  // 還沒有任何筆記時放一個會 404 的佔位頁
  return params.length > 0 ? params : [{ slug: ["_placeholder"] }];
}

export function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Metadata | undefined {
  const page = getPage(params.slug);

  if (page == null) return;

  const slug = params.slug?.join("/") ?? "";
  const isIndex = slug === "";

  return pageMetadata({
    title: isIndex
      ? "威爾森的生活札記 | 來杯咖啡の學習日常"
      : `威爾森的生活札記 | ${page.title}`,
    description: page.description,
    path: isIndex ? "/docs" : `/docs/${slug}`,
    image: isIndex ? "docs" : `docs/${slug}`,
  });
}
