"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { MoonIcon, SunIcon, Monitor } from "lucide-react";
import {
  faArrowLeft,
  faMugHot,
  faMugSaucer,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Logo from "@/components/logo";
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
    <nav className="nd-sticky nd-top-0 nd-h-16 nd-z-50 nd-border-b nd-transition-colors nd-bg-background/80 nd-border-foreground/5 nd-backdrop-blur-sm">
      <div className="nd-container nd-flex nd-flex-row nd-items-center nd-h-full nd-gap-4">
        <Link
          href="/"
          className="flex flex-row items-center gap-2 text-xl tracking-wide"
        >
          <Logo className="h-7 w-7" />
          <span className="max-sm:hidden">威爾森的生活札記</span>
          <span className="sm:hidden">生活札記</span>
        </Link>
        {blog && !isMobile ? (
          <Link
            href="/blog"
            className="max-md:hidden text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            回到日常碎念
          </Link>
        ) : (
          <></>
        )}
        <div className="nd-flex nd-flex-row content-end ml-auto">
          <Link
            href="/blog"
            className={`nd-flex items-center gap-2 px-2 py-1 transition-colors hover:text-foreground ${
              pathname.startsWith("/blog")
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <FontAwesomeIcon icon={faMugHot} className="text-lg" />
            <span className="max-md:hidden">日常碎念</span>
          </Link>
          <Link
            href="/docs"
            className={`nd-flex items-center gap-2 px-2 py-1 transition-colors hover:text-foreground ${
              pathname.startsWith("/docs")
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <FontAwesomeIcon icon={faMugSaucer} className="text-lg" />
            <span className="max-md:hidden">學習日常</span>
          </Link>
          <Link
            href={`${pathname}#`}
            onClick={() => handlePrefferedThemeChange()}
            className="nd-flex items-center px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            {!theme ? (
              <Monitor className="h-5 w-5 text-lg" />
            ) : theme === "dark" ? (
              <MoonIcon className="h-5 w-5 text-lg" />
            ) : theme === "light" ? (
              <SunIcon className="h-5 w-5 text-lg" />
            ) : (
              <Monitor className="h-5 w-5 text-lg" />
            )}
          </Link>
          <Link
            href="https://github.com/TK-Entertainment/wilson-webpage"
            className="max-sm:hidden nd-flex items-center px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <FontAwesomeIcon icon={faGithub} className="h-5 w-5 text-lg" />
          </Link>
          <Link
            href="https://instagram.com/wilson_note"
            className="nd-flex items-center px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <FontAwesomeIcon icon={faInstagram} className="h-5 w-5 text-lg" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
