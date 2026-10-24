"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { MoonIcon, SunIcon, Monitor } from "lucide-react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Logo from "@/components/logo";
import SiteSearch from "@/components/search/sitesearch";
import { allBlogs } from "contentlayer/generated";

const sections = [
  { href: "/blog", label: "日常碎念", no: "01", color: "var(--gold)" },
  { href: "/docs", label: "學習日常", no: "02", color: "var(--teal)" },
  { href: "/gallery", label: "生活影像", no: "03", color: "var(--orange)" },
];

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
    <nav className="nd-sticky nd-top-0 nd-h-16 nd-z-50 border-b border-foreground/15 bg-background">
      <div className="nd-flex nd-flex-row nd-items-center nd-h-full gap-2 px-4 sm:gap-4 sm:px-5 lg:px-[44px]">
        <Link
          href="/"
          className="group flex flex-none flex-row items-center gap-2 whitespace-nowrap text-base font-black sm:gap-3 sm:text-lg"
        >
          <Logo className="h-3.5 w-10 flex-none jitter-hover sm:h-4 sm:w-12" />
          <span className="max-sm:hidden">威爾森的生活札記</span>
          <span className="sm:hidden">生活札記</span>
        </Link>
        {blog && !isMobile ? (
          <Link
            href="/blog"
            className="max-md:hidden font-mono-label text-sm text-muted-foreground transition-colors hover:text-bh-red"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            回到日常碎念
          </Link>
        ) : (
          <></>
        )}
        <div className="nd-flex nd-flex-row items-center gap-0.5 sm:gap-1 ml-auto">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              aria-label={section.label}
              aria-current={
                pathname.startsWith(section.href) ? "page" : undefined
              }
              className="nav-sec group/sec relative nd-flex items-baseline gap-1.5 px-1.5 py-1 text-[15px] sm:px-2 font-black"
              style={{ ["--c" as string]: section.color }}
            >
              <span className="font-mono-label text-[11px] font-bold text-muted-foreground">
                {section.no}
              </span>
              <span className="max-lg:hidden">{section.label}</span>
            </Link>
          ))}
          <SiteSearch />
          <Link
            href={`${pathname}#`}
            onClick={() => handlePrefferedThemeChange()}
            aria-label="切換深色／淺色模式"
            className="nd-flex items-center px-1.5 py-1 transition-colors sm:px-2 hover:text-bh-red"
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
            aria-label="GitHub 原始碼"
            className="max-sm:hidden nd-flex items-center px-1.5 py-1 transition-colors sm:px-2 hover:text-bh-red"
          >
            <FontAwesomeIcon icon={faGithub} className="h-5 w-5 text-lg" />
          </Link>
          <Link
            href="https://instagram.com/sleepy__wilson"
            aria-label="Instagram @sleepy__wilson"
            className="nd-flex items-center px-1.5 py-1 transition-colors sm:px-2 hover:text-bh-red"
          >
            <FontAwesomeIcon icon={faInstagram} className="h-5 w-5 text-lg" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
