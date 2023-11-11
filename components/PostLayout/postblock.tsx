import Link from "next/link";
import Image from "next/image";
import type { Blog } from "contentlayer/generated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faClock, faUser } from "@fortawesome/free-regular-svg-icons";

export default function PostBlock({ page }: { page: Blog }) {
  return (
    <Link
      href={page.outside ? `${page.outsideLink}` : `/blog/${page.slug}`}
      className="flex flex-col lg:flex-row flex-auto lg:p-3 rounded-2xl border bg-card text-card-foreground transition-all hover:bg-accent hover:drop-shadow-2xl hover:scale-105 active:scale-95 lg:active:scale-100"
    >
      <div className="flex flex-none max-lg:aspect-video max-lg:justify-center rounded-2xl lg:rounded-2xl border overflow-hidden lg:w-48 max-lg:h-48 h-auto object-cover">
        {page.image != null ? (
          <Image
            alt="img"
            src={`/img/${page.slug}/${page.image}`}
            className="object-cover lg:object-none overflow-hidden max-lg:h-full"
            width={500}
            height={400}
          />
        ) : (
          <Image
            alt="none"
            src="/img/taiwan.png"
            className="object-cover lg:object-none overflow-hidden max-lg:h-full"
            width={500}
            height={400}
          />
        )}
      </div>
      <div className="flex max-lg:p-3 flex-col ml-4 w-fit">
        {page.outside ? (
          <div className="flex flex-row opacity-60">
            <FontAwesomeIcon
              icon={faUpRightFromSquare}
              className="text-sm my-auto mr-2"
            />
            <p className="text-sm mr-1">外部文章</p>
          </div>
        ) : (
          <></>
        )}
        <div className="flex flex-wrap">
          {page.tags?.map((tag, index) => (
            <div key={`${index}`}>
              <Link
                href={`/blog/tags/${tag}`}
                className="transition-all text-sm mr-1 rounded-2xl border px-2 hover:bg-accent active:scale-90"
              >
                #&nbsp;{tag}
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          <p className="flex text-3xl max-md:text-2xl font-bold mt-2 mr-auto overflow-hidden overflow-ellipsis">
            {page.title}
          </p>
          <p className="flex flex-1 text-xl font-base mt-1 mr-auto overflow-hidden overflow-ellipsis text-muted-foreground">
            {page.description}
          </p>
        </div>
        <div className="mt-auto flex flex-col mr-auto">
          <div className="flex flex-row content-center">
            <FontAwesomeIcon
              icon={faClock}
              className="text-base mr-2 my-auto"
            />
            <p className="text-sm my-auto">
              {new Date(page.date).toLocaleDateString("zh-TW")}
            </p>
          </div>
          <div className="flex flex-row content-center mt-1">
            <FontAwesomeIcon icon={faUser} className="text-base mr-2 my-auto" />
            <p className="text-sm my-auto">
              {page.authors?.map((author, index) => (
                <span key={index}>
                  {index != 0 ? ", " : ""}
                  {author}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
