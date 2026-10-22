"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "#1f4fa3",
  "#f2c230",
  "#e2342b",
  "#1f9d55",
  "#7b3fc4",
  "#f2721c",
];

// 全站故障：捲得越快 --v 越大（文字與形狀錯位），並閃過撕裂色條
export default function GlitchScroll() {
  const tearsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    const tears = Array.from(tearsRef.current?.children ?? []) as HTMLElement[];
    let lastY = window.scrollY;
    let v = 0;
    let looping = false;

    function frame() {
      const y = window.scrollY;
      v = Math.max(v * 0.86, Math.min(1, Math.abs(y - lastY) / 90));
      lastY = y;
      html.style.setProperty("--v", v.toFixed(3));
      tears.forEach((t) => {
        if (v > 0.18 && Math.random() < v) {
          t.style.top = `${(Math.random() * 100).toFixed(1)}%`;
          t.style.height = `${(2 + Math.random() * 14).toFixed(0)}px`;
          t.style.background = COLORS[(Math.random() * COLORS.length) | 0];
          t.style.transform = `translateX(${((Math.random() - 0.5) * 30).toFixed(0)}%)`;
          t.style.opacity = (0.4 + v * 0.6).toFixed(2);
        } else {
          t.style.opacity = "0";
        }
      });
      if (v > 0.01) {
        requestAnimationFrame(frame);
      } else {
        looping = false;
        html.style.setProperty("--v", "0");
        tears.forEach((t) => (t.style.opacity = "0"));
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

  return (
    <div className="tears" ref={tearsRef} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
