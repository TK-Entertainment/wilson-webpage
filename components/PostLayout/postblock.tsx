import Link from "next/link";
import Image from "next/image";
import type { Blog } from "contentlayer/generated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUser } from "@fortawesome/free-regular-svg-icons";

export default function PostBlock({ page }: { page: Blog }) {
  return (
    <Link
      href={`/blog/${page.slug}`}
      className="flex flex-row flex-auto p-3 rounded-2xl border bg-card text-card-foreground transition-all hover:bg-accent hover:drop-shadow-2xl hover:scale-105"
    >
      <div className="flex flex-none rounded-2xl border overflow-hidden w-48 h-auto object-cover">
        {page.image != null ? (
          <Image alt="img" src={page.image} width={500} height={400} />
        ) : (
          <Image
            alt="none"
            src="/img/taiwan.png"
            className="object-none overflow-hidden bg-contain bg-center"
            width={500}
            height={400}
          />
        )}
      </div>
      <div className="flex grow flex-auto flex-col ml-4 w-max">
        <div>
          {page.tags?.map((tag, index) => (
            <Link
              key={`${index}`}
              href={`/blog/tags/${tag}`}
              className="transition-all text-sm mr-1 rounded-2xl border px-2 hover:bg-accent active:scale-90"
            >
              #&nbsp;{tag}
            </Link>
          ))}
        </div>
        <div>
          <p className="flex text-3xl font-bold mt-2 mr-auto">{page.title}</p>
          <article className="flex text-xl font-base mt-1 mr-auto">
            {page.description}
          </article>
        </div>
        <div className="mt-auto flex flex-col mr-auto">
          <div className="flex flex-row content-center">
            <FontAwesomeIcon
              icon={faClock}
              className="text-base mr-2 my-auto"
            />
            <p className="text-sm my-auto">
              {new Date(page.date).toLocaleString("zh-TW")}
            </p>
          </div>
          <div className="flex flex-row content-center mt-1">
            <FontAwesomeIcon icon={faUser} className="text-base mr-2 my-auto" />
            <p className="text-sm my-auto">{page.authors}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
