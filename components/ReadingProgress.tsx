"use client";

import { useEffect, useRef } from "react";

const NAV_HEIGHT = 64;

/**
 * 閱讀進度條：固定在導覽列正下方，依 `target` 元素（文章內文）的捲動進度填滿。
 * z-index 高於手機版文章操作列（同樣 sticky 在 top-16），確保進度條不被蓋住。
 * 用 requestAnimationFrame 節流，直接改 style 不觸發 re-render；
 * 減少動態效果時仍顯示進度，只是不做緩動。
 */
export default function ReadingProgress({
  target = "[data-reading-body]",
}: {
  target?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = document.querySelector(target) ?? document.documentElement;
      const rect = el.getBoundingClientRect();
      const visible = window.innerHeight - NAV_HEIGHT;
      const scrollable = rect.height - visible;
      let progress =
        scrollable > 0
          ? (NAV_HEIGHT - rect.top) / scrollable
          : rect.bottom <= window.innerHeight
            ? 1
            : 0;
      progress = Math.min(1, Math.max(0, progress));

      if (barRef.current) {
        barRef.current.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
      }
      if (wrapRef.current) {
        wrapRef.current.setAttribute(
          "aria-valuenow",
          String(Math.round(progress * 100)),
        );
      }
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <div
      ref={wrapRef}
      role="progressbar"
      aria-label="閱讀進度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="pointer-events-none fixed inset-x-0 top-16 z-[60] h-1.5"
    >
      <div
        ref={barRef}
        className="h-full w-full motion-safe:transition-[clip-path] motion-safe:duration-150 motion-safe:ease-out"
        style={{
          clipPath: "inset(0 100% 0 0)",
          background:
            "linear-gradient(to right, #e2782d 0 33.34%, #d6a53c 33.34% 66.67%, #26304f 66.67% 100%)",
        }}
      />
    </div>
  );
}
