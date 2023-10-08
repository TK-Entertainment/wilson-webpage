"use client";

import { Nav } from "next-docs-ui/nav";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { allBlogs } from "contentlayer/generated";

const links = [
  {
    label: "Instagram",
    icon: <FontAwesomeIcon icon={faInstagram} className={"my-auto"} />,
    href: "https://instagram.com/wilson_note",
    external: true,
  },
  {
    label: "GitHub",
    icon: <FontAwesomeIcon icon={faGithub} className={"my-auto"} />,
    href: "https://github.com/TK-Entertainment/wilson-webpage",
    external: true,
  },
];

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const slug = pathname.split("/")[2];
  const blog = allBlogs.find((blog) => blog.slug == slug);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <Nav
      title={""}
      transparent={false}
      links={links}
      collapsibleSidebar={false}
      enableSidebar={false}
    >
      <Link href="/" className="text-2xl font-bold">
        威爾森的科普天地
      </Link>
      {pathname.startsWith("/blog") ? (
        <>
          <Link
            href="/blog"
            className="flex flex-col justify-left rounded-2xl px-2 py-1 transition-all hover:bg-accent hover:drop-shadow-normal active:scale-95"
          >
            {(pathname !== "/blog") && (pathname !== "/blog/tags") ? (
              <>
              {!isMobile && blog ? (
                <>
                  <div className="text-sm opacity-60">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    點此回到文章列表
                  </div>
                  <div className="font-bold text-2xl flex flex-row">
                    <p className="font-normal opacity-70">部落格</p>
                    <p>&nbsp;/&nbsp;</p>
                    <p>{blog.title}</p>
                  </div>
                </>
              ) : (
                <FontAwesomeIcon icon={faArrowLeft} className="p-2 text-2xl" />
              )}
              </>
            ) : (
              <p className="font-bold text-2xl">部落格</p>
            )}
          </Link>
        </>
      ) : (
        <></>
      )}
    </Nav>
  );
}
