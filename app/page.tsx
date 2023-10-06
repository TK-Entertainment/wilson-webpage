import Link from 'next/link'

import Navbar from '@/components/Navigation/navbar'
import PostBlock from '@/components/PostLayout/postblock'
import { type Blog, allBlogs } from "contentlayer/generated"

export default function HomePage() {
  const postSorted = allBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latestPost = postSorted[0]

  return (
    <>
      <Navbar/>
      <main className="overflow-x-clip">
        <div className="mx-auto flex max-w-[1400px] flex-col px-8 md:px-12">
          <div className="mt-4 flex sm:flex-row flex-col w-auto mx-auto">
            <div>
              <h1 className="text-4xl font-bold mt-4 mb-4">最新消息</h1>
              <PostBlock page={latestPost}/>
            </div>
            <div className="sm:mx-2"></div>
            <div>
              <h1 className="mt-2 text-4xl font-bold mt-4 mb-4">推薦內容</h1>
              <PostBlock page={latestPost}/>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
