import { allBlogs } from "contentlayer/generated";
import { MDXContent } from "next-docs-ui/mdx";
import { Content } from "@/components/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser } from "@fortawesome/free-regular-svg-icons";
import { getTableOfContents } from "next-docs-zeta/server";
import { TOC } from "@/components/toc";

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
      <MDXContent>
        <div className="grid grid-cols-7">
          <div className="col-span-6 px-8 md:px-12 md:mt-8 mt-4">
            <div className="md:py-8 py-4">
              {page.tags?.map((tag, index) => (
                <span
                  key={`${index}`}
                  className="text-sm mr-1 rounded-2xl border px-2"
                >
                  #&nbsp;{tag}
                </span>
              ))}
              <h1>{page.title}</h1>
              <h2>{page.description}</h2>
              <h4 className="my-auto flex flex-row">
                <FontAwesomeIcon icon={faUser} className="my-auto mr-2" />
                {page.authors}
                <div className="border-r-2 ml-2"></div>
                <FontAwesomeIcon icon={faClock} className="my-auto ml-2 mr-2" />
                {new Date(page.date).toLocaleString("zh-TW")}
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
