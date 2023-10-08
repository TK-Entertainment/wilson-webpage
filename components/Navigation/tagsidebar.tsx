import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { getTopicTagsMap, getTagsMapWithoutTopics } from "@/utils/tags";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function TagSidebar() {
  const topicTags = [...getTopicTagsMap().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );
  const nonTopicTags = [...getTagsMapWithoutTopics().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );
  const pathname = decodeURIComponent(usePathname());

  return (
    <nav className="nd-sticky nd-divide-y nd-flex nd-flex-col nd-top-16 nd-gap-4 nd-py-12 nd-w-[150px] nd-h-[calc(100vh-4rem)] max-xl:nd-hidden">
      <ul key="topic" className="">
        <p className="text-2xl font-bold mb-2">
          <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
          主題版
        </p>
        {topicTags.map(([topic, count], index) => (
          <Link
            href={`/blog/tags/${topic}`}
            key={index}
            className={`flex flex-row flex-auto mb-2 p-3 rounded-2xl border bg-card transition-all ${
              pathname == `/blog/tags/${topic}`
                ? "bg-black text-card-foreground dark:bg-white dark:text-black"
                : "hover:bg-accent text-card-foreground"
            } hover:drop-shadow-2xl hover:scale-105 active:scale-100 justify-center`}
          >
            <FontAwesomeIcon icon={faNewspaper} className="text-base my-auto" />
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
                ? "bg-black text-card-foreground dark:bg-white dark:text-black"
                : "hover:bg-accent text-card-foreground"
            } hover:drop-shadow-2xl hover:scale-105 active:scale-100 justify-center`}
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
