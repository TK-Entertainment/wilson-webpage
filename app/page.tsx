import PostBlock from "@/components/PostLayout/postblock";
import { allBlogs } from "contentlayer/generated";
import { type TagCount, getTopicTagsMap } from "@/utils/tags";
import TagBlock from "@/components/PostLayout/tagblock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faMugHot,
  faMugSaucer,
} from "@fortawesome/free-solid-svg-icons";
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
    description: "上課筆記與學習心得，一門課一個資料夾",
    icon: faMugSaucer,
  },
];

export default function HomePage() {
  const postSorted = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const latestPost = postSorted[0];
  const topicTags: [string, TagCount][] = [...getTopicTagsMap().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );

  const suggestIndex = Math.floor(Math.random() * (allBlogs.length - 1));
  const suggestPost = allBlogs[suggestIndex];

  return (
    <>
      <main className="overflow-x-clip justify-center">
        <div className="flex flex-col px-8 lg:px-20">
          <div className="flex flex-col flex-wrap">
            <h1 className="mt-4 text-4xl font-bold mb-4">威爾森的生活札記</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sections.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="flex flex-row p-3 rounded-2xl border bg-card text-card-foreground transition-all hover:bg-accent hover:drop-shadow-2xl hover:scale-105"
                >
                  <div className="flex flex-row w-full items-center justify-between">
                    <div className="flex flex-col justify-center">
                      <p className="text-2xl font-normal">{section.prefix}</p>
                      <p className="text-4xl font-bold">{section.title}</p>
                      <p className="mt-2 text-base font-normal opacity-70">
                        {section.description}
                      </p>
                    </div>
                    <div className="relative flex">
                      <FontAwesomeIcon
                        icon={section.icon}
                        className="text-7xl opacity-10 max-sm:absolute max-sm:inset-y-0 max-sm:right-0"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-2 grid lg:grid-cols-2 lg:grid-rows-1 grid-cols-1 grid-rows-2 lg:space-x-4">
            <div className="">
              <h1 className="text-4xl font-bold mt-4 mb-4">最新碎念</h1>
              <PostBlock page={latestPost} />
            </div>
            <div>
              <h1 className="text-4xl font-bold mt-4 mb-4">推薦內容</h1>
              <PostBlock page={suggestPost} />
            </div>
          </div>
          <div className="mt-4 flex flex-col w-auto space-x-4 mb-4">
            <h1 className="text-4xl font-bold mt-4 mb-4">探索主題</h1>
            <div className="flex flex-col flex-wrap sm:flex-row max-sm:space-y-2">
              <Link
                href={`/blog`}
                className="flex flex-row p-3 sm:mr-2 sm:w-fit rounded-2xl border bg-card text-card-foreground transition-all hover:bg-accent hover:drop-shadow-2xl hover:scale-105"
              >
                <div className="flex flex-row w-full max-sm:items-center justify-between sm:my-auto">
                  <div className="flex flex-col justify-center">
                    <p className="text-3xl font-bold">查看所有碎念</p>
                    <p className="text-base font-normal opacity-70">{`${allBlogs.length} 個文章`}</p>
                  </div>
                  <div className="relative flex">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-7xl opacity-10 sm:absolute sm:inset-y-0 sm:right-0"
                    />
                  </div>
                </div>
              </Link>
              <div className="border-b-2 sm:border-l-2 sm:mr-2"></div>
              {topicTags.map(([topic, count], index) => (
                <TagBlock key={index} tag={topic} count={count} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
