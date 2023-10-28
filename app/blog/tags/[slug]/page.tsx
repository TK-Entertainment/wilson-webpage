"use client";
import { useState, useEffect } from "react";
import Actionbar from "@/components/Navigation/actionbar";
import TagSidebar from "@/components/Navigation/tagsidebar";
import PostBlock from "@/components/PostLayout/postblock";
import { allBlogs } from "contentlayer/generated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function TagSlug({ params }: { params: { slug?: string } }) {
  const postSorted = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const slug = params.slug ?? "";
  const decodedTag = decodeURIComponent(slug);
  const postSortedByTags = postSorted.filter(
    (post) => post.tags?.includes(decodedTag),
  );
  const [showTagMenu, setShowTagMenu] = useState(false);

  useEffect(() => {
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
              : "max-md:hidden col-span-2 border-r-2 pr-2"
          }`}
        >
          <TagSidebar />
        </div>
        <div
          className={`${
            showTagMenu
              ? "hidden"
              : "col-span-7 max-md:col-span-full p-6 mt-2 space-y-4"
          }`}
        >
          <Link
            href="/blog"
            className="flex flex-col w-fit justify-left rounded-2xl px-2 py-1 transition-all hover:bg-accent hover:drop-shadow-normal active:scale-95"
          >
            <div className="text-sm opacity-60">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              點此檢視所有文章
            </div>
            <div className="font-bold text-2xl flex">
              <p className="font-normal opacity-70">全部文章</p>
              <p>&nbsp;/&nbsp;</p>
              <p>#{decodedTag}</p>
            </div>
          </Link>
          {postSortedByTags.length != 0 ? (
            <>
              {postSortedByTags.map((post, index) => (
                <div key={index}>
                  <PostBlock page={post} />
                </div>
              ))}
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
