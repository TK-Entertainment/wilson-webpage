import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { allBlogs } from "@/.contentlayer/generated";
import { getTopicTagsMap, getTagsMapWithoutTopics } from "@/utils/tags";
import { usePathname } from "next/navigation";
import getTopicTagsIcon from "@/utils/tagsicon";
import Link from "next/link";

function itemClass(active: boolean) {
  return `flex flex-row items-center gap-2 px-2 py-1 font-bold transition-colors ${
    active ? "bg-bh-yellow text-bh-ink" : "hover:text-bh-red"
  }`;
}

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
    <nav className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col gap-8 overflow-y-auto px-2 py-10">
      <Link href="/blog" className={itemClass(pathname == "/blog")}>
        <span className="h-3 w-3 rounded-full bg-bh-red" aria-hidden="true" />
        <span className="text-lg">全部碎念</span>
        <span className="ml-auto font-mono-label text-xs">{blogCount}</span>
      </Link>
      <div>
        <p className="mb-2 border-b-2 border-foreground pb-1 font-mono-label text-xs font-bold tracking-widest">
          {"// TOPICS"}
        </p>
        {topicTags.map(([topic, count]) => (
          <Link
            href={`/blog/tags/${topic}`}
            key={topic}
            className={itemClass(pathname == `/blog/tags/${topic}`)}
          >
            <FontAwesomeIcon
              icon={getTopicTagsIcon(topic)}
              className="w-4 text-sm"
            />
            <span>{topic}</span>
            <span className="ml-auto font-mono-label text-xs">
              {count.count}
            </span>
          </Link>
        ))}
      </div>
      <div>
        <p className="mb-2 border-b-2 border-foreground pb-1 font-mono-label text-xs font-bold tracking-widest">
          {"// TAGS"}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono-label text-xs font-bold">
          {nonTopicTags.map(([tag]) => (
            <Link
              href={`/blog/tags/${tag}`}
              key={tag}
              className={
                pathname == `/blog/tags/${tag}`
                  ? "bg-bh-yellow px-1 text-bh-ink"
                  : "transition-colors hover:text-bh-red"
              }
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
