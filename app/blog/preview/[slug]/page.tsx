import { type Metadata } from "next";
import { allBlogPreviews } from "contentlayer/generated";
import { MDXContent } from "next-docs-ui/mdx";
import { Content } from "@/components/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser } from "@fortawesome/free-regular-svg-icons";
import { getTableOfContents } from "next-docs-zeta/server";
import { TOC } from "@/components/toc";
import Actionbar from "@/components/Navigation/actionbar";
import Link from "next/link";
import { faInfoCircle, faWarning } from "@fortawesome/free-solid-svg-icons";

export function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Metadata {
  const slug = params.slug ?? "";
  const blog = allBlogPreviews.find(
    (previewblog) => previewblog.slug == params.slug,
  );

  return {
    title: `[PREVIEW] Wilson's Notes | ${blog?.title}`,
    description: blog?.description,
    openGraph: {
      type: "article",
      images: blog?.image ?? "",
      title: `[PREVIEW] Wilson's Notes | ${blog?.title}`,
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
  const page = allBlogPreviews.find(
    (previewblog) => previewblog.slug == params.slug,
  );

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
            <div className="flex flex-col p-4 w-full rounded-2xl border bg-orange-200 dark:bg-orange-500 transition-all hover:drop-shadow-2xl">
              <div className="flex flex-row">
                <FontAwesomeIcon
                  icon={faWarning}
                  className="text-2xl mr-2 my-auto"
                />
                <span className="text-2xl font-bold">
                  阿喔，感覺你來錯地方了！
                </span>
              </div>
              <span className="mt-2 text-normal font-normal">
                若您是誤入的閱者，這是我還沒完成的文章，被您看到算是提前預覽了吧
              </span>
              <span className="text-normal font-normal">
                還請您不要將此連結發出去，並點擊左上角的標題回到首頁，謝謝！
              </span>
            </div>
            <div className="flex flex-col mt-2 p-4 w-full rounded-2xl border bg-slate-300 dark:bg-slate-600 transition-all hover:drop-shadow-2xl">
              <div className="flex flex-row">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-2xl mr-2 my-auto"
                />
                <span className="text-2xl font-bold">
                  請注意，這是預覽頁面！
                </span>
              </div>
              <span className="text-normal font-normal mt-2">
                此處為未完成文章之預覽頁面，僅供預覽參考使用
              </span>
              <span className="text-normal font-normal">
                若已準備好發布，請將此檔案從{" "}
                <span className="font-bold">content/preview/</span> 移動至{" "}
                <span className="font-bold">content/blog/</span>{" "}
                來正式發布此文章
              </span>
            </div>
            <div className="md:py-8 py-4">
              <span className="transition-all text-sm mr-1 rounded-2xl border px-2 bg-red-200 dark:bg-red-400 hover:bg-red-500">
                {`<!> 預覽 Preview`}
              </span>
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
  return allBlogPreviews.map((previewblog) => ({
    slug: previewblog.slug,
  }));
}
