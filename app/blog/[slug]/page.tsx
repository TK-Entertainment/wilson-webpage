import { type Metadata } from "next";
import { allBlogs } from "contentlayer/generated";
import { MDXContent } from "next-docs-ui/mdx";
import { Content } from "@/components/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser } from "@fortawesome/free-regular-svg-icons";
import { getTableOfContents } from "next-docs-zeta/server";
import { TOC } from "@/components/toc";
import Actionbar from "@/components/Navigation/actionbar";
import Link from "next/link";

export function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Metadata {
  const slug = params.slug ?? "";
  const blog = allBlogs.find((blog) => blog.slug == params.slug);

  return {
    title: `Wilson's Notes | ${blog?.title}`,
    description: blog?.description,
    openGraph: {
      type: "article",
      images: blog?.image ?? "",
      title: `Wilson's Notes | ${blog?.title}`,
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
    return <></>;
  }

  const toc = await getTableOfContents(page.body.raw);

  return (
    <>
      <Actionbar showTagMenu={null} setShowTagMenu={null} />
      <MDXContent>
        <div className="grid grid-cols-7">
          <div className="col-span-6 max-xl:col-span-full px-8 md:px-12 md:mt-8 mt-4">
            <div className="md:py-8 py-4">
              {page.tags?.map((tag, index) => (
                <Link
                  key={`${index}`}
                  href={`/blog/tags/${tag}`}
                  className="transition-all text-sm mr-1 rounded-2xl border px-2 hover:bg-accent active:scale-90"
                >
                  #&nbsp;{tag}
                </Link>
              ))}
              <h1>{page.title}</h1>
              <h2>{page.description}</h2>
              <h4 className="my-auto flex flex-row">
                <div className="flex flex-row max-sm:flex-col">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="max-sm:mr-auto my-auto sm:mr-2"
                  />
                  {page.authors}
                </div>
                <div className="border-r-2 ml-2 mr-2"></div>
                <div className="flex flex-row max-sm:flex-col">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="max-sm:mr-auto my-auto sm:mr-2"
                  />
                  {new Date(page.date).toLocaleDateString("zh-TW")}
                </div>
              </h4>
            </div>
            <Content code={page.body.code} />
          </div>
          <TOC items={toc} />
        </div>
      </MDXContent>
    </>
  );
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return allBlogs.map((blog) => ({
    slug: blog.slug,
  }));
}
