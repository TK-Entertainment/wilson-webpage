import PostBlock from "@/components/PostLayout/postblock";
import { allBlogs } from "contentlayer/generated";
import { type TagCount, getTopicTagsMap } from "@/utils/tags";
import TagBlock from "@/components/PostLayout/tagblock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function HomePage() {
  const postSorted = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const latestPost = postSorted[0];
  const topicTags: [string, TagCount][] = [...getTopicTagsMap().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  );

  return (
    <>
      <main className="overflow-x-clip justify-center">
        <div className="flex flex-col px-8 lg:px-20">
          <div className="mt-4 grid lg:grid-cols-2 lg:grid-rows-1 grid-cols-1 grid-rows-2 lg:space-x-4">
            <div className="">
              <h1 className="text-4xl font-bold mt-4 mb-4">最新消息</h1>
              <PostBlock page={latestPost} />
            </div>
            <div>
              <h1 className="text-4xl font-bold mt-4 mb-4">推薦內容</h1>
              <PostBlock page={latestPost} />
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
                    <p className="text-3xl font-bold">查看所有文章</p>
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
