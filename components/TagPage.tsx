"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Actionbar from "@/components/Navigation/actionbar";
import TagSidebar from "@/components/Navigation/tagsidebar";
import PostBlock from "@/components/PostLayout/postblock";
import GlitchText from "@/components/glitchtext";
import { allBlogs } from "contentlayer/generated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

// 標籤頁：/blog/tags?tag=標籤（整頁在瀏覽器裡依標籤篩選文章）
export default function TagPage() {
  const decodedTag = useSearchParams().get("tag") ?? "";
  const postSorted = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const postSortedByTags = postSorted.filter((post) =>
    post.tags?.includes(decodedTag),
  );
  const [showTagMenu, setShowTagMenu] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [decodedTag]);


  return (
    <>
      {/* 靜態頁的標題沒辦法帶標籤名稱，用 React 19 的 <title> 在瀏覽器裡補上 */}
      {decodedTag ? <title>{`威爾森的生活札記 | 標籤 > ${decodedTag}`}</title> : null}
      <Actionbar
        showTagMenu={showTagMenu}
        setShowTagMenu={setShowTagMenu}
        tag={decodedTag}
      />
      <div className="grid grid-cols-9">
        <div
          className={`${
            showTagMenu
              ? "col-span-full"
              : "max-md:hidden col-span-2 border-r-4 border-foreground pr-4"
          }`}
        >
          <TagSidebar activeTag={decodedTag} />
        </div>
        <div
          className={`${
            showTagMenu
              ? "hidden"
              : "col-span-7 max-md:col-span-full px-6 sm:px-10 pt-10 max-w-3xl"
          }`}
        >
          <Link href="/blog" className="group flex flex-col w-full pb-6">
            <div className="font-mono-label text-sm font-bold transition-colors group-hover:text-bh-red">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              回到全部碎念
            </div>
            <div className="mt-1 text-4xl font-black flex">
              <GlitchText text={`#${decodedTag}`} />
            </div>
          </Link>
          {postSortedByTags.length != 0 ? (
            <>
              <div className="border-b-2 border-foreground">
                {postSortedByTags.map((post) => (
                  <PostBlock key={post.slug} page={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="mx-auto">
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
              <span className="text-normal font-bold">
                沒有找到任何有 #{decodedTag} 標籤的文章
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
