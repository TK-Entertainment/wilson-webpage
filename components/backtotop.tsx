"use client";

import { useEffect, useState } from "react";

// 回到頂端：捲過約一個螢幕高後出現的黑方塊＋黃三角
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    function update() {
      ticking = false;
      setVisible(window.scrollY > window.innerHeight * 0.9);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function toTop() {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // 焦點移回頁首，鍵盤使用者不會停在已隱藏的按鈕上
    const main = document.querySelector<HTMLElement>("nav a, nav button");
    main?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="回到頂端"
      title="回到頂端"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed z-40 flex h-12 w-12 items-center justify-center border-2 border-foreground bg-bh-ink shadow-[4px_4px_0_#e2342b] transition-[opacity,transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#e2342b] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-bh-blue active:translate-x-1 active:translate-y-1 active:shadow-none motion-reduce:transition-none max-sm:h-11 max-sm:w-11 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{
        right: "calc(1rem + env(safe-area-inset-right))",
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
    >
      <span
        aria-hidden="true"
        className="block h-0 w-0 border-x-[10px] border-b-[14px] border-x-transparent border-b-bh-yellow transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
    </button>
  );
}
