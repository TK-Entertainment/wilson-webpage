import Link from 'next/link'

import Navbar from '@/components/Navigation/navbar'
import PostBlock from '@/components/PostLayout/postblock'
import { type Blog, allBlogs } from "contentlayer/generated"
import { type TagCount, getTopicTagsMap } from '@/utils/tags'
import TagBlock from '@/components/PostLayout/tagblock'

export default function HomePage() {
  const postSorted = allBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latestPost = postSorted[0]
  const topicTags: [string, TagCount][] = [...getTopicTagsMap().entries()].sort(
    (a, b) => b[1].count - a[1].count,
  )

  return (
    <>
      <main className="overflow-x-clip justify-center">
        <div className="flex flex-col px-8 md:px-20">
          <div className="mt-4 grid sm:grid-cols-2 sm:grid-rows-1 grid-cols-1 grid-rows-2 space-x-4">
            <div className="">
              <h1 className="text-4xl font-bold mt-4 mb-4">最新消息</h1>
              <PostBlock page={latestPost}/>
            </div>
            <div>
              <h1 className="text-4xl font-bold mt-4 mb-4">推薦內容</h1>
              <PostBlock page={latestPost}/>
            </div>
          </div>
          <div className="mt-4 flex sm:flex-col flex-row w-auto space-x-4">
            <h1 className="text-4xl font-bold mt-4 mb-4">探索主題</h1>
            <div className="flex flex-row">
              {topicTags.map(([topic, count], index) => (
                <TagBlock key={index} tag={topic} count={count}/>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
