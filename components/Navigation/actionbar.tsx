"use client";

import Link from "next/link";
import { FC, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { allBlogs } from "contentlayer/generated";

interface ActionbarProps {
  showTagMenu: boolean | null;
  setShowTagMenu: ((showTagMenu: boolean) => void) | null;
}

const Actionbar: FC<ActionbarProps> = ({ showTagMenu, setShowTagMenu }) => {
  const pathname = usePathname();
  const blogSlug = pathname.split("/")[2];
  const tagSlug = pathname.split("/")[3];
  const decodedTag = decodeURIComponent(tagSlug);
  const blog = allBlogs.find((blog) => blog.slug == blogSlug);

  const showTagMenuHandler = () => {
    if (setShowTagMenu === null) {
      return;
    }
    setShowTagMenu(!showTagMenu!);
  };

  return (
    <nav
      className={`md:nd-hidden nd-content-start text-left nd-sticky nd-top-0 nd-h-16 nd-z-50 nd-border-b nd-transition-colors nd-bg-background/80 nd-border-foreground/10 nd-backdrop-blur-sm`}
    >
      <div className="nd-container nd-flex nd-flex-row nd-items-center nd-h-full nd-gap-4">
        {pathname === "/blog" || pathname.startsWith("/blog/tags") ? (
          <button
            onClick={() => showTagMenuHandler()}
            className="flex flex-col rounded-2xl px-2 py-1 transition-all hover:bg-accent hover:drop-shadow-normal active:scale-95"
          >
            <div
              className={`${
                showTagMenu! ? "nd-hidden" : "md:nd-hidden"
              } text-sm opacity-60 text-left`}
            >
              <FontAwesomeIcon icon={faBars} className="mr-2" />
              點此查看所有標籤
            </div>
            <div className="flex flex-row">
                <div className="flex flex-row max-sm:flex-col">
                {pathname.startsWith("/blog/tags") ? (
                    <>
                        <p
                            className={`opacity-70 font-normal max-sm:text-base text-2xl text-left`}
                        >
                            部落格
                        </p>
                    <p className="opacity-70 font-normal max-sm:text-base text-2xl text-left">
                        &nbsp;/&nbsp;標籤
                    </p>
                    </>
                ) : (
                    <p
                    className={`font-bold text-2xl text-left`}
                >
                    部落格
                </p>
                )}
                </div>
                <div className="flex flex-row">
                {pathname.startsWith("/blog/tags") ? (
                    <>
                    <p className="font-bold text-2xl text-left my-auto justify-center items-stretch">
                        &nbsp;/&nbsp;#{decodedTag}
                    </p>
                    </>
                ) : (
                    <></>
                )}
                </div>
            </div>
          </button>
        ) : (
          <Link
            href="/blog"
            className="flex flex-col rounded-2xl px-2 py-1 transition-all hover:bg-accent hover:drop-shadow-normal active:scale-95"
          >
            <div className="text-sm opacity-60">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              點此回到文章列表
            </div>
            <div className="font-bold text-2xl flex flex-row">
              <p className="font-normal max-md:text-base max-md:items-end max-md:mt-auto opacity-70">部落格</p>
              <p>&nbsp;/&nbsp;</p>
              {blog ? (
                <p className="overflow-hidden overflow-ellipsis">{blog.title}</p>
              ) : (
                <p className="italic">未知的文章</p>
              )}
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Actionbar;
