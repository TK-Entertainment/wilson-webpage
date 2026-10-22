"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

export type HomePost = {
  href: string;
  title: string;
  date: string;
  description?: string;
};

export type HomeAlbum = {
  href: string;
  title: string;
  cover?: string;
};

const drinks = [
  {
    code: "[01] 來杯好茶の",
    title: "日常碎念",
    description: "生活裡的大小事、心情與隨手記錄",
    href: "/blog",
  },
  {
    code: "[02] 來杯咖啡の",
    title: "學習日常",
    description: "上課筆記與學習心得",
    href: "/docs",
  },
  {
    code: "[03] 來杯果汁の",
    title: "生活影像",
    description: "生活照片與影片紀錄",
    href: "/gallery",
  },
];

const channels = [
  "CH-01 // TEA.EXE",
  "CH-02 // COFFEE.EXE",
  "CH-03 // JUICE.EXE",
];
const wipes = ["#d9302a", "#1f4fa3", "#178046"];

// 圓 → 三角 → 方：沿同樣的角度取樣，讓每個點一一對應，變形才會平順
const N = 72;
function rayPolygon(verts: number[][]) {
  const pts: number[][] = [];
  for (let k = 0; k < N; k++) {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / N;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    let best = Infinity;
    for (let j = 0; j < verts.length; j++) {
      const p = verts[j];
      const q = verts[(j + 1) % verts.length];
      const ex = q[0] - p[0];
      const ey = q[1] - p[1];
      const den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-9) continue;
      const t = (p[0] * ey - p[1] * ex) / den;
      const u = (p[0] * dy - p[1] * dx) / den;
      if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
    }
    pts.push([dx * best, dy * best]);
  }
  return pts;
}
const CIRCLE = Array.from({ length: N }, (_, k) => {
  const a = -Math.PI / 2 + (k * 2 * Math.PI) / N;
  return [Math.cos(a), Math.sin(a)];
});
const TRIANGLE = rayPolygon([
  [0, -1],
  [0.95, 0.75],
  [-0.95, 0.75],
]);
const SQUARE = rayPolygon([
  [-0.82, -0.82],
  [0.82, -0.82],
  [0.82, 0.82],
  [-0.82, 0.82],
]);
const SHAPE_COLORS = [
  [242, 194, 48],
  [242, 194, 48],
  [217, 48, 42],
];

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ScrollHome({
  posts,
  albums,
  postCount,
  albumCount,
}: {
  posts: HomePost[];
  albums: HomeAlbum[];
  postCount: number;
  albumCount: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("rm");
      root
        .querySelector<HTMLElement>(".sh-outro")
        ?.style.setProperty("--p", "1");
      return;
    }

    const scenes = Array.from(root.querySelectorAll<HTMLElement>(".sh-scene"));
    const drinkScene = root.querySelector<HTMLElement>(".sh-drinks")!;
    const about = root.querySelector<HTMLElement>(".sh-about")!;
    const track = root.querySelector<HTMLElement>(".sh-track")!;
    const shape = root.querySelector<HTMLElement>(".sh-morph-shape")!;
    const drinkEls = Array.from(
      root.querySelectorAll<HTMLElement>(".sh-drink"),
    );
    const steps = Array.from(
      root.querySelectorAll<HTMLElement>(".sh-steps li"),
    );
    const count = root.querySelector<HTMLElement>(".sh-count")!;
    const sig = root.querySelector<HTMLElement>(".sh-sig")!;
    const progress = new Map<HTMLElement, number>();
    const mobile = window.matchMedia("(max-width: 760px)");

    function update() {
      const vh = window.innerHeight;
      scenes.forEach((s) => {
        const r = s.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - vh));
        s.style.setProperty("--p", p.toFixed(4));
        progress.set(s, p);
      });

      // 三杯飲料：形狀變形、背景擴散、文字換杯
      const q = (progress.get(drinkScene) ?? 0) * 3;
      const f1 = clamp((q - 0.85) / 0.3);
      const f2 = clamp((q - 1.85) / 0.3);
      drinkScene.style.setProperty("--f1", f1.toFixed(4));
      drinkScene.style.setProperty("--f2", f2.toFixed(4));
      const pts = CIRCLE.map((c, k) => {
        const x = lerp(lerp(c[0], TRIANGLE[k][0], f1), SQUARE[k][0], f2);
        const y = lerp(lerp(c[1], TRIANGLE[k][1], f1), SQUARE[k][1], f2);
        return `${(50 + 46 * x).toFixed(2)}% ${(50 + 46 * y).toFixed(2)}%`;
      });
      shape.style.clipPath = `polygon(${pts.join(",")})`;
      const color = [0, 1, 2].map((i) =>
        Math.round(
          lerp(
            lerp(SHAPE_COLORS[0][i], SHAPE_COLORS[1][i], f1),
            SHAPE_COLORS[2][i],
            f2,
          ),
        ),
      );
      shape.style.setProperty("--shape-color", `rgb(${color.join(",")})`);
      const base = mobile.matches ? "" : "translateY(-50%) ";
      drinkEls.forEach((el, j) => {
        const lo = j === 0 ? -9 : j;
        const hi = j === 2 ? 9 : j + 1;
        const o = clamp(Math.min(q - lo, hi - q) / 0.15);
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
        el.style.transform = `${base}translateY(${((q - (j + 0.5)) * -80).toFixed(1)}px)`;
      });
      const active = f2 > 0.5 ? 2 : f1 > 0.5 ? 1 : 0;
      steps.forEach((li, i) => li.classList.toggle("on", i === active));
      count.textContent = `0${active + 1} / 03`;
      sig.dataset.active = String(active);

      // 關於我：直向捲動轉成橫向
      const a = progress.get(about) ?? 0;
      const max = Math.max(0, track.scrollWidth - window.innerWidth);
      about.style.setProperty("--tx", `${(-a * max).toFixed(1)}px`);
      about.style.setProperty("--a", clamp(a * 4.5).toFixed(4));

      sig.textContent = channels[active];
    }

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="sh" ref={rootRef}>
      {/* 場景 1：首屏 */}
      <section className="sh-scene sh-hero">
        <div className="sh-stage">
          <i className="sh-shape sh-bar" aria-hidden="true" />
          <i className="sh-shape sh-dots" aria-hidden="true" />
          <i className="sh-shape sh-quarter" aria-hidden="true" />
          <i className="sh-shape sh-tri vshape" aria-hidden="true" />
          <i className="sh-shape sh-circle vshape" aria-hidden="true" />
          <i className="sh-shape sh-sq vshape" aria-hidden="true" />
          <div className="sh-copy">
            <p className="sh-boot font-mono-label" aria-hidden="true">
              <span>&gt; boot wilson_notes.exe</span>
              <span>&gt; loading 茶・咖啡・果汁 ... OK</span>
              <span>&gt; signal: STABLE</span>
            </p>
            <p className="sh-kicker font-mono-label">
              &gt; WILSON&apos;S NOTES
              <span className="caret" aria-hidden="true" />
            </p>
            <h1 className="sh-title vsplit">
              <span className="sh-row sh-r1 glitch" data-text="威爾森的">
                威爾森的
              </span>
              <span className="sh-row sh-r2 glitch" data-text="生活札記">
                生活札記
              </span>
            </h1>
            <p className="sh-lede">
              來杯好茶聊聊日常碎念，來杯咖啡記下學習日常，來杯果汁收藏生活影像。
            </p>
          </div>
          <p className="sh-hint font-mono-label">往下捲</p>
        </div>
      </section>

      {/* 場景 2：三杯飲料 */}
      <section className="sh-scene sh-drinks">
        <div className="sh-stage">
          <div className="sh-layer sh-l1" />
          <div className="sh-layer sh-l2" />
          <div className="sh-layer sh-l3" />
          <div className="sh-morph" aria-hidden="true">
            <div className="sh-morph-shape vshape" />
            <div className="sh-orbit">
              <i />
              <i />
              <i />
            </div>
          </div>
          {drinks.map((drink, i) => (
            <div key={drink.href} className={`sh-drink sh-d${i}`}>
              <small className="font-mono-label">{drink.code}</small>
              <strong className="glitch vsplit" data-text={drink.title}>
                {drink.title}
              </strong>
              <p>{drink.description}</p>
              <Link href={drink.href} className="sh-go font-mono-label">
                進去喝一杯 →
              </Link>
            </div>
          ))}
          <p
            className="sh-sig font-mono-label text-white [&[data-active='2']]:text-bh-ink"
            aria-hidden="true"
          >
            {channels[0]}
          </p>
          <ol className="sh-steps" aria-hidden="true">
            <li />
            <li />
            <li />
          </ol>
          <p className="sh-count font-mono-label" aria-hidden="true">
            01 / 03
          </p>
        </div>
      </section>

      {/* 場景 3：關於我 */}
      <section className="sh-scene sh-about" id="about">
        <div className="sh-stage">
          <div className="sh-track">
            <div className="sh-panel intro">
              <div className="sh-intro-grid">
                <div className="sh-avatar" aria-hidden="true">
                  <i className="av-face" />
                  <i className="av-hat" />
                  <i className="av-cheek l" />
                  <i className="av-cheek r" />
                  <i className="av-eye l" />
                  <i className="av-eye r" />
                  <i className="av-mouth" />
                </div>
                <div>
                  <p className="sh-label font-mono-label">{"// ABOUT"}</p>
                  <h2 className="glitch vsplit" data-text="嗨，我是威爾森">
                    嗨，我是威爾森
                  </h2>
                  <p style={{ marginTop: 14 }}>
                    喜歡天文、地球科學與畫畫，曾在高中做過「Young Want
                    星空」科普專案。繼續往下捲，認識我喜歡的東西 →
                  </p>
                </div>
              </div>
            </div>
            <div className="sh-panel green">
              <i className="sh-big vshape" aria-hidden="true" />
              <p className="sh-label font-mono-label">01 / ASTRONOMY</p>
              <h2 className="glitch vsplit" data-text="天文">
                天文
              </h2>
              <p>從恆星的一生到行星的誕生，仰望星空是我最初的熱情。</p>
            </div>
            <div className="sh-panel purple">
              <i className="sh-big vshape" aria-hidden="true" />
              <p className="sh-label font-mono-label">02 / EARTH SCIENCE</p>
              <h2 className="glitch vsplit" data-text="地球科學">
                地球科學
              </h2>
              <p>冰河、洋流、古氣候，地球本身就是最好看的故事。</p>
            </div>
            <div className="sh-panel orange">
              <i className="sh-big vshape" aria-hidden="true" />
              <p className="sh-label font-mono-label">03 / DRAWING</p>
              <h2 className="glitch vsplit" data-text="畫畫">
                畫畫
              </h2>
              <p>用圖把知識畫出來，讓複雜的東西變得好懂。</p>
            </div>
            <div className="sh-panel ink">
              <i className="sh-big vshape" aria-hidden="true" />
              <p className="sh-label font-mono-label">04 / NOW</p>
              <h2 className="glitch vsplit" data-text="最近在做">
                最近在做
              </h2>
              <ul className="sh-now">
                <li>重新設計這個網站</li>
                <li>開始整理上課筆記</li>
              </ul>
            </div>
          </div>
          <i className="sh-hbar" aria-hidden="true" />
        </div>
      </section>

      {/* 最新內容 */}
      <section className="grid grid-cols-1 gap-12 border-t-4 border-foreground px-6 py-14 md:grid-cols-2 md:px-12">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="flex items-center gap-3 text-2xl font-black">
              <span className="h-4 w-4 rounded-full bg-bh-red" />
              最新碎念
            </h2>
            <Link
              href="/blog"
              className="font-mono-label text-sm font-bold hover:text-bh-red"
            >
              {`ALL(${postCount}) →`}
            </Link>
          </div>
          <div className="mt-4">
            {posts.length == 0 ? (
              <p className="border-t-2 border-foreground py-6 font-mono-label text-sm font-bold">
                {"> 第一杯茶正在泡，碎念即將上桌"}
                <span className="caret" aria-hidden="true" />
              </p>
            ) : (
              <></>
            )}
            {posts.map((post, i) => (
              <Link
                key={post.href}
                href={post.href}
                className="sh-post group grid grid-cols-1 gap-1 border-t-2 border-foreground py-4 sm:grid-cols-[120px_1fr] sm:gap-4"
                style={{ "--wipe": wipes[i % wipes.length] } as CSSProperties}
              >
                <time className="font-mono-label text-sm font-bold text-bh-blue dark:text-bh-yellow">
                  {post.date}
                </time>
                <div>
                  <b className="split-hover block text-xl font-black">
                    {post.title}
                  </b>
                  {post.description ? (
                    <span className="text-sm text-muted-foreground">
                      {post.description}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="flex items-center gap-3 text-2xl font-black">
              <span className="h-4 w-4 bg-bh-yellow" />
              最新影像
            </h2>
            <Link
              href="/gallery"
              className="font-mono-label text-sm font-bold hover:text-bh-red"
            >
              {`ALL(${albumCount}) →`}
            </Link>
          </div>
          {albums.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {albums.map((album) => (
                <Link
                  key={album.href}
                  href={album.href}
                  className="sh-album group flex flex-col gap-2"
                >
                  <div className="aspect-[4/5] overflow-hidden border-2 border-foreground bg-bh-yellow">
                    {album.cover ? (
                      <Image
                        alt={album.title}
                        src={album.cover}
                        width={360}
                        height={450}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <p className="split-hover text-sm font-black">
                    {album.title}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 border-t-2 border-foreground py-6 font-mono-label text-sm font-bold">
              {"> 果汁還在榨，第一本相簿即將登場"}
              <span className="caret" aria-hidden="true" />
            </p>
          )}
        </div>
      </section>

      {/* 場景 4：結尾 */}
      <section className="sh-scene sh-outro">
        <div className="sh-stage">
          <h2 className="vsplit">
            來杯什麼？
            <br />
            隨時歡迎來坐坐。
          </h2>
          <div className="sh-outro-links font-mono-label">
            <Link href="https://instagram.com/wilson_note">
              Instagram @wilson_note
            </Link>
            <Link href="/blog">開始逛逛 →</Link>
          </div>
          <i
            className="sh-fall"
            aria-hidden="true"
            style={fall(0, 200, {
              left: "4vw",
              width: "28vmin",
              height: "28vmin",
              borderRadius: "50%",
              background: "#d9302a",
            })}
          />
          <i
            className="sh-fall"
            aria-hidden="true"
            style={fall(0.08, -160, {
              left: "30vmin",
              width: "22vmin",
              height: "22vmin",
              background: "#f2c230",
            })}
          />
          <i
            className="sh-fall"
            aria-hidden="true"
            style={fall(0.16, 240, {
              left: "52vmin",
              width: "30vmin",
              height: "26vmin",
              background: "#1f4fa3",
              clipPath: "polygon(50% 0,100% 100%,0 100%)",
            })}
          />
          <i
            className="sh-fall"
            aria-hidden="true"
            style={fall(
              0.24,
              -120,
              {
                left: "84vmin",
                width: "40vmin",
                height: "9vmin",
                background: "#178046",
              },
              -8,
            )}
          />
          <i
            className="sh-fall"
            aria-hidden="true"
            style={fall(0.3, 180, {
              right: "22vw",
              width: "20vmin",
              height: "20vmin",
              background: "#7b3fc4",
              borderRadius: "50% 50% 0 0",
            })}
          />
          <i
            className="sh-fall"
            aria-hidden="true"
            style={fall(0.38, -220, {
              right: "6vw",
              width: "24vmin",
              height: "24vmin",
              background: "#f2721c",
              borderRadius: "0 100% 0 0",
            })}
          />
          <i
            className="sh-fall"
            aria-hidden="true"
            style={fall(
              0.46,
              300,
              {
                right: "12vw",
                bottom: "24vmin",
                width: "12vmin",
                height: "12vmin",
                background: "#efece6",
              },
              12,
            )}
          />
        </div>
      </section>
    </div>
  );
}

// 掉落形狀的參數：延遲 d、掉落時的旋轉 r、落地後的角度 end
function fall(
  d: number,
  r: number,
  style: CSSProperties,
  end = 0,
): CSSProperties {
  return {
    ...style,
    "--d": d,
    "--r": `${r}deg`,
    "--end": `${end}deg`,
  } as CSSProperties;
}
