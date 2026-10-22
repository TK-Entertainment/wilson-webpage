"use client";

import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { commentsConfig, commentsEnabled } from "@/utils/comments";

type Theme = "light" | "dark";

const currentTheme = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

// 留言區：放在文章／相簿頁面最後
export default function Comments() {
  return (
    <section className="nd-not-prose mt-16 border-t-4 border-foreground pt-8">
      <p className="flex items-center gap-3 font-mono-label text-sm font-bold">
        <span className="h-4 w-4 flex-none bg-bh-red" aria-hidden="true" />
        [COMMENTS] 留言區
      </p>
      <div className="mt-6">
        {commentsEnabled ? (
          <GiscusWidget />
        ) : (
          <p className="border-2 border-foreground px-4 py-5 font-mono-label text-sm font-bold">
            {"> 留言區準備中"}
            <span className="caret" aria-hidden="true" />
          </p>
        )}
      </div>
    </section>
  );
}

function GiscusWidget() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // 跟著 <html> 上的 .dark class 切換深淺色
    const sync = () => {
      const next = currentTheme();
      setTheme(next);
      const iframe = document
        .querySelector("giscus-widget")
        ?.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: next } } },
        "https://giscus.app",
      );
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <Giscus
      repo={commentsConfig.repo}
      repoId={commentsConfig.repoId}
      category={commentsConfig.category}
      categoryId={commentsConfig.categoryId}
      mapping="pathname"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="zh-TW"
      loading="lazy"
    />
  );
}
