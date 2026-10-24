"use client";

import { useEffect } from "react";

// 舊的標籤網址 /blog/tags/<標籤> 轉到新的 /blog/tags?tag=<標籤>，以前分享出去的連結才不會壞
export default function LegacyTagRedirect() {
  useEffect(() => {
    const m = window.location.pathname.match(/^\/blog\/tags\/([^/]+)\/?$/);
    if (m) {
      window.location.replace(`/blog/tags?tag=${m[1]}`);
    }
  }, []);
  return null;
}
