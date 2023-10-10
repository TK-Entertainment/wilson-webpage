"use client";
import TagSidebar from "@/components/Navigation/tagsidebar";
import Actionbar from "@/components/Navigation/actionbar";
import PostBlock from "@/components/PostLayout/postblock";
import { allBlogs } from "contentlayer/generated";
import { useState, useEffect } from "react";

export default function BlogPage() {
  const postSorted = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const [isMobile, setIsMobile] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    window.scrollTo(0, 0)
  }, []);

  return (
    <>
      <Actionbar showTagMenu={showTagMenu} setShowTagMenu={setShowTagMenu}/>
      <div className="grid grid-cols-9">
        <div className={`${showTagMenu ? "col-span-full" : "max-md:hidden col-span-2 border-r-2 pr-2"}`}>
          <TagSidebar />
        </div>
        <div className={`${showTagMenu ? "hidden" : "col-span-7 max-md:col-span-full p-6 mt-2"}`}>
          <p className="text-3xl font-bold">全部文章</p>
          <div className="mt-4 h-auto space-y-4">
          {postSorted.map((post, index) => (
            <div key={index}>
              <PostBlock page={post} />
            </div>
          ))}
          </div>
        </div>
      </div>
    </>
  );
}
