import PostBlock from "@/components/PostLayout/postblock";
import { allBlogs } from "contentlayer/generated";
import { type TagCount, getTopicTagsMap } from "@/utils/tags";
import TagBlock from "@/components/PostLayout/tagblock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot, faMugSaucer } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const sections = [
  {
    href: "/blog",
    prefix: "來杯好茶の",
    title: "日常碎念",
    description: "生活裡的大小事、心情與隨手記錄",
    icon: faMugHot,
  },
  {
    href: "/docs",
    prefix: "來杯咖啡の",
    title: "學習日常",
    description: "上課筆記與學習心得",
    icon: faMugSaucer,
  },
];

export default function HomePage() {
  const postSorted = [...allBlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const latestPosts = postSorted.slice(0, 3);
  const topicTags: [string, TagCount][] = [...getTopicTagsMap().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-16">
      <section className="pt-16 pb-12">
        <h1 className="text-4xl sm:text-5xl tracking-wide">威爾森的生活札記</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          來杯好茶聊聊日常碎念，來杯咖啡記下學習日常。
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-10 border-t pt-10">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="group block">
            <FontAwesomeIcon
              icon={section.icon}
              className="text-2xl text-muted-foreground transition-colors group-hover:text-foreground"
            />
            <p className="mt-4 text-muted-foreground">{section.prefix}</p>
            <p className="text-3xl decoration-1 underline-offset-8 group-hover:underline">
              {section.title}
            </p>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {section.description}
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-16">
        <div className="flex items-baseline justify-between border-b pb-3">
          <h2 className="text-2xl">最新碎念</h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {`看全部 ${allBlogs.length} 篇 →`}
          </Link>
        </div>
        <div className="divide-y">
          {latestPosts.map((post) => (
            <PostBlock key={post.slug} page={post} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="border-b pb-3 text-2xl">探索主題</h2>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {topicTags.map(([topic, count]) => (
            <TagBlock key={topic} tag={topic} count={count} />
          ))}
        </div>
      </section>
    </main>
  );
}
