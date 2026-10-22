"use client";

import { useEffect } from "react";

// 全站捲動錯位：捲得越快 --v 越大，標題出現輕微的紅藍錯位，停下就恢復
export default function GlitchScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    let lastY = window.scrollY;
    let v = 0;
    let looping = false;

    function frame() {
      const y = window.scrollY;
      v = Math.max(v * 0.86, Math.min(1, Math.abs(y - lastY) / 90));
      lastY = y;
      html.style.setProperty("--v", v.toFixed(3));
      if (v > 0.01) {
        requestAnimationFrame(frame);
      } else {
        looping = false;
        html.style.setProperty("--v", "0");
      }
    }
    const kick = () => {
      if (!looping) {
        looping = true;
        requestAnimationFrame(frame);
      }
    };
    window.addEventListener("scroll", kick, { passive: true });
    return () => window.removeEventListener("scroll", kick);
  }, []);

  return null;
}
