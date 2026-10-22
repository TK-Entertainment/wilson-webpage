"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// 圖片燈箱：包住 MDX 內文，點圖片放大檢視
// - <Photos> 照片牆裡的圖片：可左右切換（按鈕、鍵盤 ←/→、手機左右滑）
// - 文章裡單張的圖片：單張放大
// 不能放大的圖：放在連結裡的、或加上 data-nozoom 的

type Item = { src: string; alt: string };

const ZOOMABLE = "img:not(a img):not(button img):not([data-nozoom])";

// next/image 會把網址改成 /_next/image?url=...，放大時改用原圖
function originalSrc(img: HTMLImageElement): string {
  const raw = img.currentSrc || img.src;
  try {
    const url = new URL(raw, window.location.href);
    if (url.pathname == "/_next/image") {
      return url.searchParams.get("url") ?? raw;
    }
  } catch {
    // 網址解析失敗就用原本的
  }
  return raw;
}

export function Zoomable({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ items: Item[]; index: number } | null>(
    null,
  );
  const trigger = useRef<HTMLElement | null>(null);

  // 讓可放大的圖片能用鍵盤操作（每次換頁內容都重新標記，重複標記無妨）
  useEffect(() => {
    const images = root.current?.querySelectorAll<HTMLImageElement>(ZOOMABLE);
    images?.forEach((img) => {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute(
        "aria-label",
        `放大檢視${img.alt ? `：${img.alt}` : "圖片"}`,
      );
      img.classList.add("zoomable");
    });
  });

  const open = (img: HTMLImageElement) => {
    const wall = img.closest(".photos");
    const group = wall
      ? Array.from(wall.querySelectorAll<HTMLImageElement>(ZOOMABLE))
      : [img];
    trigger.current = img;
    setState({
      items: group.map((el) => ({ src: originalSrc(el), alt: el.alt })),
      index: Math.max(0, group.indexOf(img)),
    });
  };

  const target = (event: { target: EventTarget }) => {
    const el = event.target as HTMLElement;
    if (!(el instanceof HTMLImageElement)) return null;
    if (!root.current?.contains(el) || !el.matches(ZOOMABLE)) return null;
    return el;
  };

  const close = useCallback(() => {
    setState(null);
    // 關閉後把焦點還給原本的圖片
    const el = trigger.current;
    requestAnimationFrame(() => el?.focus({ preventScroll: true }));
  }, []);

  return (
    <div
      ref={root}
      className="contents"
      onClick={(event) => {
        const img = target(event);
        if (img) open(img);
      }}
      onKeyDown={(event) => {
        if (event.key != "Enter" && event.key != " ") return;
        const img = target(event);
        if (img) {
          event.preventDefault();
          open(img);
        }
      }}
    >
      {children}
      {state ? (
        <Lightbox
          items={state.items}
          index={state.index}
          onIndex={(index) => setState({ ...state, index })}
          onClose={close}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: Item[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [glitch, setGlitch] = useState(0);
  const many = items.length > 1;
  const item = items[index];

  const go = useCallback(
    (step: number) => {
      if (!many) return;
      onIndex((index + step + items.length) % items.length);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setGlitch((n) => n + 1);
      }
    },
    [index, items.length, many, onIndex],
  );

  // 開啟時：鎖住背景捲動、焦點移到關閉鈕
  useEffect(() => {
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    closeButton.current?.focus({ preventScroll: true });

    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
    };
  }, []);

  // 鍵盤：←/→ 切換、Esc 關閉、Tab 只在燈箱裡循環
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key == "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key == "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key == "Tab" && dialog.current) {
        const focusable = Array.from(
          dialog.current.querySelectorAll<HTMLElement>("button"),
        ).filter((el) => el.offsetParent != null);
        if (focusable.length == 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (!dialog.current.contains(active)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active == first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active == last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // 預先載入前後兩張
  useEffect(() => {
    if (!many) return;
    for (const step of [-1, 1]) {
      const next = items[(index + step + items.length) % items.length];
      const img = new window.Image();
      img.src = next.src;
    }
  }, [index, items, many]);

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="圖片檢視"
      className="lightbox fixed inset-0 z-[80] flex flex-col bg-bh-ink text-bh-paper"
      onClick={(event) => {
        if (event.target == event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        const t = event.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const t = event.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          go(dx < 0 ? 1 : -1);
        }
      }}
    >
      <div className="flex flex-none items-center justify-between gap-4 border-b-4 border-bh-paper px-4 py-3 md:px-6">
        <p className="flex items-center gap-3 font-mono-label text-sm font-bold">
          <span className="h-4 w-4 flex-none bg-bh-yellow" aria-hidden="true" />
          <span aria-live="polite">
            {pad(index + 1)} / {pad(items.length)}
          </span>
        </p>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="關閉圖片檢視"
          className="lb-btn flex bg-bh-red text-white"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
              d="M5 5 19 19M19 5 5 19"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center p-3 md:px-24 md:py-6"
        onClick={(event) => {
          if (event.target == event.currentTarget) onClose();
        }}
      >
        <figure
          key={`${index}-${glitch}`}
          className={`flex max-h-full max-w-full flex-col items-center ${
            glitch > 0 ? "lb-glitch" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            data-nozoom
            draggable={false}
            className="block max-h-[calc(100dvh-11rem)] max-w-full select-none border-4 border-bh-paper bg-bh-ink object-contain"
          />
          {item.alt ? (
            <figcaption className="mt-3 max-w-2xl text-center text-sm font-medium leading-relaxed md:text-base">
              {item.alt}
            </figcaption>
          ) : (
            <></>
          )}
        </figure>

        {many ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="上一張"
              className="lb-btn absolute left-3 top-1/2 hidden -translate-y-1/2 bg-bh-blue text-white md:flex"
            >
              <Arrow flip />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="下一張"
              className="lb-btn absolute right-3 top-1/2 hidden -translate-y-1/2 bg-bh-yellow text-bh-ink md:flex"
            >
              <Arrow />
            </button>
          </>
        ) : (
          <></>
        )}
      </div>

      {many ? (
        <div className="flex flex-none items-center justify-between gap-4 border-t-4 border-bh-paper px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="上一張"
            className="lb-btn flex bg-bh-blue text-white"
          >
            <Arrow flip />
          </button>
          <p className="font-mono-label text-xs font-bold opacity-70">
            ← 滑動切換 →
          </p>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="下一張"
            className="lb-btn flex bg-bh-yellow text-bh-ink"
          >
            <Arrow />
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>,
    document.body,
  );
}

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${flip ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M4 12h15M13 5l7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
