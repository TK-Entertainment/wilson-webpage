"use client";
import TagSidebar from "@/components/Navigation/tagsidebar";
import Actionbar from "@/components/Navigation/actionbar";
import PostBlock from "@/components/PostLayout/postblock";
import GlitchText from "@/components/glitchtext";
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
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Actionbar showTagMenu={showTagMenu} setShowTagMenu={setShowTagMenu} />
      <div className="grid grid-cols-9">
        <div
          className={`${
            showTagMenu
              ? "col-span-full"
              : "max-md:hidden col-span-2 border-r-4 border-foreground pr-4"
          }`}
        >
          <TagSidebar />
        </div>
        <div
          className={`${
            showTagMenu
              ? "hidden"
              : "col-span-7 max-md:col-span-full px-6 sm:px-10 pt-10 max-w-3xl"
          }`}
        >
          <p className="font-mono-label text-sm font-bold">[01] 來杯好茶の</p>
          <h1 className="pb-6 text-4xl font-black sm:text-5xl">
            <GlitchText text="日常碎念" />
          </h1>
          <div className="border-b-2 border-foreground">
            {postSorted.length == 0 ? (
              <p className="border-t-2 border-foreground py-6 font-mono-label text-sm font-bold">
                {"> 第一杯茶正在泡，碎念即將上桌"}
                <span className="caret" aria-hidden="true" />
              </p>
            ) : (
              <></>
            )}
            {postSorted.map((post) => (
              <PostBlock key={post.slug} page={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
