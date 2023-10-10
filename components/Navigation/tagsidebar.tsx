import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faNewspaper, faHome } from "@fortawesome/free-solid-svg-icons";
import { allBlogs } from "@/.contentlayer/generated";
import { getTopicTagsMap, getTagsMapWithoutTopics } from "@/utils/tags";
import { usePathname } from "next/navigation";
import getTopicTagsIcon from "@/utils/tagsicon";
import Link from "next/link";

export default function TagSidebar() {
  const topicTags = [...getTopicTagsMap().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );
  const nonTopicTags = [...getTagsMapWithoutTopics().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );
  const blogCount = allBlogs.length;
  const pathname = decodeURIComponent(usePathname());

  return (
    <nav className="overflow-y-auto overflow-x-visible nd-sticky nd-divide-y nd-flex nd-flex-col nd-top-16 nd-gap-4 nd-py-12 nd-px-2 nd-w-[150px] nd-h-[calc(100vh-4rem)]">
      <ul key="all">
        <Link
          href={`/blog`}
          key={"all"}
          className={`flex flex-row flex-auto mb-2 p-3 rounded-2xl border bg-card transition-all ${
            pathname == `/blog`
              ? "bg-slate-950 text-white dark:bg-white dark:text-black"
              : "hover:bg-accent text-card-foreground"
          } hover:drop-shadow-2xl hover:scale-105 active:scale-95 lg:active:scale-100 justify-center`}
        >
          <FontAwesomeIcon icon={faHome} className="text-base my-auto" />
          <span className="text-base font-bold ml-2 my-auto">全部文章</span>
          <span className="text-base font-normal opacity-70 ml-auto my-auto">
            {blogCount}
          </span>
        </Link>
      </ul>
      <ul key="topic" className="">
        <p className="mt-4 text-2xl font-bold mb-2">
          <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
          主題版
        </p>
        {topicTags.map(([topic, count], index) => (
          <Link
            href={`/blog/tags/${topic}`}
            key={index}
            className={`flex flex-row flex-auto mb-2 p-3 rounded-2xl border bg-card transition-all ${
              pathname == `/blog/tags/${topic}`
                ? "bg-slate-950 text-white dark:bg-white dark:text-black"
                : "hover:bg-accent text-card-foreground"
            } hover:drop-shadow-2xl hover:scale-105 active:scale-95 lg:active:scale-100 justify-center`}
          >
            <FontAwesomeIcon
              icon={getTopicTagsIcon(topic)}
              className="text-base my-auto"
            />
            <span className="text-base font-bold ml-2 my-auto">{topic}</span>
            <span className="text-base font-normal opacity-70 ml-auto my-auto">
              {count.count}
            </span>
          </Link>
        ))}
      </ul>
      <ul key="othertags">
        <p className="mt-4 text-2xl font-bold mb-2">
          <FontAwesomeIcon icon={faTag} className="mr-2" />
          其他標籤
        </p>
        {nonTopicTags.map(([topic, count], index) => (
          <Link
            href={`/blog/tags/${topic}`}
            key={index}
            className={`flex flex-row flex-auto mb-2 p-3 rounded-2xl border bg-card transition-all ${
              pathname == `/blog/tags/${topic}`
                ? "bg-slate-950 text-white dark:bg-white dark:text-black"
                : "hover:bg-accent text-card-foreground"
            } hover:drop-shadow-2xl hover:scale-105 active:scale-95 lg:active:scale-100 justify-center`}
          >
            <FontAwesomeIcon icon={faTag} className="text-base my-auto" />
            <span className="text-base font-bold ml-2 my-auto">{topic}</span>
            <span className="text-base font-normal opacity-70 ml-auto my-auto">
              {count.count}
            </span>
          </Link>
        ))}
      </ul>
    </nav>
  );
}
