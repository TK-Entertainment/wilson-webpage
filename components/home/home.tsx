"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { openPortal, preloadPortal } from "@/components/tarot/portal";

export type HomePhoto = {
  href: string;
  title: string;
  date: string;
  cover: string;
  top: string;
  bottom: string;
  lat?: number;
  lng?: number;
};

export type HomePost = {
  href: string;
  title: string;
  date: string;
  description?: string;
};

export type HomeAlbum = {
  href: string;
  title: string;
  date: string;
  cover?: string;
};

const MENU = [
  { href: "/blog", n: "01", t: "日常碎念", d: "茶", c: "var(--gold)" },
  { href: "/docs", n: "02", t: "學習日常", d: "咖啡", c: "var(--teal)" },
  { href: "/gallery", n: "03", t: "生活影像", d: "果汁", c: "var(--orange)" },
  { href: "/map", n: "04", t: "足跡地圖", d: "出門", c: "var(--teal)" },
];

const loc = (p: HomePhoto) =>
  p.lat !== undefined && p.lng !== undefined
    ? `${p.lat.toFixed(2)}N ${p.lng.toFixed(2)}E`
    : p.date;

function useReducedMotion() {
  const [reduce, setReduce] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
  }, []);
  return reduce;
}

// 每個字用 span 包起來，故障時才能一個字一個字換
function Ghost({ text, id }: { text: string; id: string }) {
  return (
    <div className="hm-ghost" id={id}>
      {[...text].map((c, i) => (
        <span key={i} data-c={c}>
          {c}
        </span>
      ))}
    </div>
  );
}

export default function Home({
  photos,
  posts,
  albums,
  postCount,
  albumCount,
}: {
  photos: HomePhoto[];
  posts: HomePost[];
  albums: HomeAlbum[];
  postCount: number;
  albumCount: number;
}) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [front, setFront] = useState(0);
  const [clock, setClock] = useState("--:--:--");
  const midRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const photo = photos[front];

  // 台北時間
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Taipei" }),
      );
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, []);

  // 彩蛋：先把抽牌頁和牌背圖載好
  useEffect(() => {
    const t = window.setTimeout(() => {
      router.prefetch("/tarot");
      preloadPortal();
    }, 1500);
    return () => window.clearTimeout(t);
  }, [router]);

  // 每 4.5 秒換一張照片
  useEffect(() => {
    if (reduce || photos.length < 2) return;
    const t = window.setInterval(
      () => setFront((f) => (f + 1) % photos.length),
      4500,
    );
    return () => window.clearInterval(t);
  }, [reduce, photos.length]);

  // 空心大字：換照片時先亂閃，平常偶爾訊號不良
  useEffect(() => {
    const mid = midRef.current;
    if (!mid || reduce) return;
    const pool = [
      ...new Set(
        photos.map((p) => p.title.replace(/[・\s]/g, "")).join("") + "▚▞▙▟",
      ),
    ];
    const glyph = () => pool[Math.floor(Math.random() * pool.length)];
    const spans = () => [
      ...mid.querySelectorAll<HTMLSpanElement>("span[data-c]"),
    ];
    let k = 0;
    const scramble = window.setInterval(() => {
      if (k++ >= 3) {
        window.clearInterval(scramble);
        spans().forEach((s) => (s.textContent = s.dataset.c ?? ""));
        return;
      }
      spans().forEach(
        (s) => (s.textContent = Math.random() < 0.6 ? glyph() : ""),
      );
    }, 70);
    const noise = window.setInterval(() => {
      const all = spans();
      if (!all.length) return;
      const s = all[Math.floor(Math.random() * all.length)];
      s.textContent = glyph();
      window.setTimeout(() => (s.textContent = s.dataset.c ?? ""), 150);
    }, 700);
    return () => {
      window.clearInterval(scramble);
      window.clearInterval(noise);
    };
  }, [front, reduce, photos]);

  // 標題偶爾錯位
  useEffect(() => {
    const el = titleRef.current;
    if (!el || reduce) return;
    let t: number;
    const run = () => {
      el.classList.remove("hm-glitching");
      void el.offsetWidth;
      el.classList.add("hm-glitching");
      t = window.setTimeout(run, 2400 + Math.random() * 2800);
    };
    t = window.setTimeout(run, 2000);
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <>
      <section className="hm-hero">
        <i className="hm-slab" aria-hidden="true" />

        <div className="hm-copy">
          <p className="hm-boot font-mono-label">
            &gt; boot wilson_notes.exe
            <br />
            &gt; loading 茶・咖啡・果汁 ... <span>OK</span>
          </p>
          <h1 className="hm-title" ref={titleRef}>
            <span>威爾森的</span>
            <span>
              生活<em>札記</em>
            </span>
          </h1>
          <p className="hm-lead">
            來杯好茶聊聊日常碎念，來杯咖啡記下學習日常，來杯果汁收藏生活影像。
          </p>
          <ul className="hm-menu">
            {MENU.map((m) => (
              <li key={m.href}>
                <Link href={m.href} style={{ ["--c" as string]: m.c }}>
                  <span className="n font-mono-label">{m.n}</span>
                  <span className="t">{m.t}</span>
                  <span className="d">{m.d}</span>
                </Link>
              </li>
            ))}
          </ul>
          {/* 彩蛋：羅盤點下去會穿越到抽牌頁 */}
          <Link
            href="/tarot"
            className="hm-compass"
            aria-label="彩蛋：喝完茶，來抽一張牌"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0)
                return;
              e.preventDefault();
              openPortal(e.clientX, e.clientY, () => router.push("/tarot"));
            }}
          >
            <svg viewBox="0 0 54 54" aria-hidden="true">
              <circle cx="27" cy="27" r="24" className="ring" />
              <circle cx="27" cy="27" r="19" className="ring2" />
              <g className="needle">
                <path d="M27 9 L31 27 L27 45 L23 27 Z" className="s" />
                <path d="M27 9 L31 27 L23 27 Z" className="nn" />
              </g>
              <circle cx="27" cy="27" r="2.5" className="hub" />
            </svg>
            <span className="font-mono-label">
              N 25°02′ E121°33′
              <br />
              {clock} TPE
            </span>
          </Link>
        </div>

        {photo ? (
          <>
            <div className="hm-marks" aria-hidden="true">
              <svg viewBox="0 0 40 40" className="o">
                <circle cx="20" cy="20" r="15" />
              </svg>
              <svg viewBox="0 0 40 40" className="n">
                <rect x="6" y="6" width="28" height="28" />
              </svg>
              <svg viewBox="0 0 40 40" className="o">
                <path d="M20 5 L35 33 H5 Z" />
              </svg>
            </div>
            <div className="hm-mid" ref={midRef} aria-hidden="true">
              <Ghost key={`t${front}`} text={photo.top} id="hm-top" />
              <p className="hm-loc font-mono-label">
                <b>LOC</b> {loc(photo)}
              </p>
              <Ghost key={`b${front}`} text={photo.bottom} id="hm-bot" />
            </div>

            <div className="hm-shots">
              {photos.map((p, i) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`hm-shot ${i === front ? "is-front" : ""}`}
                  tabIndex={i === front ? 0 : -1}
                  aria-hidden={i !== front}
                >
                  <span className="frame">
                    <Image
                      src={p.cover}
                      alt={p.title}
                      fill
                      sizes="(max-width: 860px) 72vw, 28vw"
                      priority={i === 0}
                    />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="cap">
                    <b>{p.title}</b>
                    <span className="font-mono-label">
                      <em>IMG_{String(i + 1).padStart(2, "0")}</em> // {p.date}
                    </span>
                  </span>
                </Link>
              ))}
              {photos.length > 1 ? (
                <span className="hm-count font-mono-label">
                  PHOTO <b>{String(front + 1).padStart(2, "0")}</b> /{" "}
                  {String(photos.length).padStart(2, "0")}
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </section>

      <section className="hm-latest">
        <div>
          <div className="hm-head">
            <i aria-hidden="true" />
            <h2>最新碎念</h2>
            <Link href="/blog" className="font-mono-label">
              ALL({postCount}) →
            </Link>
          </div>
          <ul className="hm-posts">
            {posts.map((p) => (
              <li key={p.href}>
                <span className="d font-mono-label">{p.date}</span>
                <div>
                  <h3>
                    <Link href={p.href}>{p.title}</Link>
                  </h3>
                  {p.description ? <p>{p.description}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="hm-head">
            <i aria-hidden="true" />
            <h2>最新影像</h2>
            <Link href="/gallery" className="font-mono-label">
              ALL({albumCount}) →
            </Link>
          </div>
          <div className="hm-photos">
            {albums.map((a) => (
              <Link key={a.href} href={a.href} className="hm-photo">
                <span className="img">
                  {a.cover ? (
                    <Image
                      src={a.cover}
                      alt={a.title}
                      fill
                      sizes="(max-width: 860px) 45vw, 22vw"
                    />
                  ) : null}
                </span>
                <span className="meta">
                  <b>{a.title}</b>
                  <span className="font-mono-label">{a.date}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
