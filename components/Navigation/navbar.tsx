"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { MoonIcon, SunIcon, Monitor } from "lucide-react";
import { faArrowLeft, faW } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { allBlogs } from "contentlayer/generated";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [localStorage, setLocalStorage] = useState<Storage>();
  const [theme, setThemeValue] = useState<string | null>(null);
  const pathname = usePathname();
  const slug = pathname.split("/")[2];
  const blog = allBlogs.find((blog) => blog.slug == slug);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }

    function getLocalStorage() {
      setLocalStorage(window.localStorage);
      let theme = window.localStorage.getItem("theme");
      setThemeValue(theme);
    }

    handleResize();
    getLocalStorage();
    window.addEventListener("resize", handleResize);
  }, []);

  function setTheme() {
    if (localStorage === undefined) {
      return;
    }

    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  setTheme();

  const handlePrefferedThemeChange = () => {
    if (localStorage === undefined) {
      return;
    }

    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
      setThemeValue("light");
    } else {
      switch (localStorage.getItem("theme")) {
        case "light":
          localStorage.setItem("theme", "dark");
          setThemeValue("dark");
          break;

        case "dark":
          localStorage.removeItem("theme");
          setThemeValue(null);
          break;
      }
    }
    setTheme();
  };

  return (
    <nav className="nd-sticky nd-top-0 nd-h-16 nd-z-50 nd-border-b nd-transition-colors nd-bg-background/80 nd-border-foreground/10 nd-backdrop-blur-sm">
      <div className="nd-container nd-flex nd-flex-row nd-items-center nd-h-full nd-gap-4">
        <Link href="/" className="text-2xl font-bold">
          <div className="max-sm:hidden">威爾森的科普天地</div>
          <div className="sm:hidden flex flex-row">
            <FontAwesomeIcon icon={faW} className="my-auto" />
            <div className="border-r-2 ml-2 mr-2"></div>
            <p>Notes</p>
          </div>
        </Link>
        {pathname.startsWith("/blog") && !isMobile ? (
          <>
            <Link
              href="/blog"
              className="max-md:hidden flex flex-col justify-left rounded-2xl px-2 py-1 transition-all hover:bg-accent hover:drop-shadow-normal active:scale-95"
            >
              {pathname !== "/blog" && pathname.indexOf("/blog/tags") ? (
                <>
                  {blog ? (
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
                    <></>
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
        <div className="nd-flex nd-flex-row content-end ml-auto">
          <Link
            href={`${pathname}#`}
            onClick={() => handlePrefferedThemeChange()}
            className="justify-left rounded-2xl px-2 py-1 transition-all hover:bg-accent hover:drop-shadow-normal active:scale-95"
          >
            {!theme ? (
              <Monitor className={"text-2xl my-auto"} />
            ) : theme === "dark" ? (
              <MoonIcon className={"text-2xl my-auto"} />
            ) : theme === "light" ? (
              <SunIcon className={"text-2xl my-auto"} />
            ) : (
              <Monitor className={"text-2xl my-auto"} />
            )}
          </Link>
          <Link
            href="https://github.com/TK-Entertainment/wilson-webpage"
            className="nd-flex justify-left rounded-2xl px-2 py-1 transition-all hover:bg-accent hover:drop-shadow-normal active:scale-95"
          >
            <FontAwesomeIcon icon={faGithub} className={"text-2xl my-auto"} />
          </Link>
          <Link
            href="https://instagram.com/wilson_note"
            className="nd-flex justify-left rounded-2xl px-2 py-1 transition-all hover:bg-accent hover:drop-shadow-normal active:scale-95"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              className={"text-2xl my-auto"}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
