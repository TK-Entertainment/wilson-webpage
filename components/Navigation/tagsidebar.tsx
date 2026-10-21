import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { allBlogs } from "@/.contentlayer/generated";
import { getTopicTagsMap, getTagsMapWithoutTopics } from "@/utils/tags";
import { usePathname } from "next/navigation";
import getTopicTagsIcon from "@/utils/tagsicon";
import Link from "next/link";

function itemClass(active: boolean) {
  return `flex flex-row items-center gap-2 py-1 transition-colors ${
    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
    <nav className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col gap-8 overflow-y-auto px-2 py-12">
      <Link href="/blog" className={itemClass(pathname == "/blog")}>
        <span className="text-lg">全部碎念</span>
        <span className="ml-auto text-sm opacity-60">{blogCount}</span>
      </Link>
      <div>
        <p className="mb-2 text-sm tracking-widest text-muted-foreground opacity-70">
          主題
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
            <span className="ml-auto text-sm opacity-60">{count.count}</span>
          </Link>
        ))}
      </div>
      <div>
        <p className="mb-2 text-sm tracking-widest text-muted-foreground opacity-70">
          標籤
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {nonTopicTags.map(([tag]) => (
            <Link
              href={`/blog/tags/${tag}`}
              key={tag}
              className={
                pathname == `/blog/tags/${tag}`
                  ? "text-foreground"
                  : "text-muted-foreground transition-colors hover:text-foreground"
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
