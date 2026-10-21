"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { MoonIcon, SunIcon, Monitor } from "lucide-react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Logo from "@/components/logo";
import { allBlogs } from "contentlayer/generated";

const sections = [
  {
    href: "/blog",
    label: "/日常碎念",
    shape: "h-3 w-3 rounded-full bg-bh-red",
  },
  {
    href: "/docs",
    label: "/學習日常",
    shape: "h-3 w-3 bg-bh-blue [clip-path:polygon(50%_0,100%_100%,0_100%)]",
  },
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
    <nav className="nd-sticky nd-top-0 nd-h-16 nd-z-50 border-b-4 border-foreground bg-background">
      <div className="nd-container nd-flex nd-flex-row nd-items-center nd-h-full nd-gap-4">
        <Link
          href="/"
          className="group flex flex-row items-center gap-3 text-lg font-black"
        >
          <Logo className="h-4 w-12 jitter-hover" />
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
        <div className="nd-flex nd-flex-row items-center gap-1 ml-auto">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`nd-flex items-center gap-2 px-2 py-1 font-mono-label text-sm font-bold transition-colors ${
                pathname.startsWith(section.href)
                  ? "bg-bh-yellow text-bh-ink"
                  : "hover:text-bh-red"
              }`}
            >
              <span className={section.shape} aria-hidden="true" />
              <span className="max-md:hidden">{section.label}</span>
            </Link>
          ))}
          <Link
            href={`${pathname}#`}
            onClick={() => handlePrefferedThemeChange()}
            className="nd-flex items-center px-2 py-1 transition-colors hover:text-bh-red"
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
            className="max-sm:hidden nd-flex items-center px-2 py-1 transition-colors hover:text-bh-red"
          >
            <FontAwesomeIcon icon={faGithub} className="h-5 w-5 text-lg" />
          </Link>
          <Link
            href="https://instagram.com/wilson_note"
            className="nd-flex items-center px-2 py-1 transition-colors hover:text-bh-red"
          >
            <FontAwesomeIcon icon={faInstagram} className="h-5 w-5 text-lg" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
