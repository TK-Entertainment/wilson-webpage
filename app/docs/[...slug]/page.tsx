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
        <h1 className="font-black">
          <GlitchText text={page.title} />
        </h1>
        <p className="nd-not-prose -mt-4 mb-8 font-mono-label text-sm font-bold text-bh-blue dark:text-bh-yellow">
          閱讀時間 // {readingTimeLabel(page.body.raw)}
        </p>
        <div data-reading-body>
          <Content code={page.body.code} />
        </div>
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

export function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = getPage(params.slug);

  if (page == null) return;

  return {
    title: page.title,
    description: page.description,
  } satisfies Metadata;
}
