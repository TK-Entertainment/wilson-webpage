"use client";
import TagSidebar from "@/components/Navigation/tagsidebar";
import PostBlock from "@/components/PostLayout/postblock";
import { allBlogs } from "contentlayer/generated";

export default function BlogPage() {
  const postSorted = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <>
      <div className="grid grid-cols-9">
        <div className="col-span-2 border-r-2 pr-2">
          <TagSidebar />
        </div>
        <div className="col-span-7 p-6 mt-2 space-y-4">
          <p className="text-3xl font-bold">全部文章</p>
          {postSorted.map((post, index) => (
            <div key={index}>
              <PostBlock page={post} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
