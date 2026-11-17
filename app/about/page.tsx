import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Bookshelf, { type Book } from "@/components/about/Bookshelf";
import RecordPlayer, { type Artist } from "@/components/about/RecordPlayer";
import { pageMetadata } from "@/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 關於我",
  description: "出生自台中豐原的平凡小孩，內心永遠住著一個 15 歲的小屁孩。",
  path: "/about",
  image: "about",
});

// ───────── 要更新近況，改這裡就好 ─────────
const UPDATED = "2026.11";

const NOW = [
  { k: "在忙", v: "在實驗室裡做專案（雖然還是很菜鳥）" },
  { k: "想看", v: "想看的書跟電影真的超多，清單只會越來越長" },
];

const MUSIC: { when: string; artists: { name: string; href: string }[] }[] = [
  {
    when: "最近忽然喜歡上",
    artists: [
      { name: "Lady Gaga", href: "https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms" },
      { name: "Ariana Grande", href: "https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR" },
    ],
  },
  {
    when: "大二開始聽",
    artists: [
      { name: "あいみょん", href: "https://open.spotify.com/search/%E3%81%82%E3%81%84%E3%81%BF%E3%82%87%E3%82%93" },
    ],
  },
  {
    when: "高中時期",
    artists: [
      { name: "毛不易", href: "https://open.spotify.com/search/%E6%AF%9B%E4%B8%8D%E6%98%93" },
    ],
  },
];

// 書架：短評、星等之後想寫再補（note 欄位）
// color：書背顏色；h：書背高度（%）；w：厚度（px）
const BOOKS: Book[] = [
  { title: "被討厭的勇氣", author: "岸見一郎、古賀史健", color: "var(--plum)", h: 86, w: 54 },
  { title: "牧羊少年奇幻之旅", author: "保羅・科爾賀", color: "var(--gold)", h: 80, w: 46 },
  { title: "三體Ⅰ", author: "劉慈欣", color: "var(--teal)", h: 94, w: 58, href: "/blog/three-body-1", note: "寫過一篇讀後心得" },
  { title: "我的神鬼人生", author: "李家維、廖宏霖", color: "var(--sage)", h: 84, w: 50 },
];

// 歌單：id 是 Spotify 歌曲網址 open.spotify.com/track/<id> 的最後一段
const SONGS: Artist[] = [
  { name: "Tani Yuuki", color: "var(--teal)", songs: [
    { title: "W/X/Y", id: "3ZnMe3b6WeuZislPMmCTZN" },
    { title: "もう一度", id: "40gt89icqkSFqWWfMlqagb" },
  ] },
  { name: "あいみょん", color: "var(--orange)", songs: [
    { title: "スケッチ", id: "2HCw2hGOPVUim9RWk3wh0C" },
    { title: "君の夢を聞きながら、僕は笑えるアイデアを！", id: "2SoUv5PuyA99w2XwwwQRST" },
  ] },
  { name: "Lady Gaga", color: "var(--rose)", songs: [{ title: "Born This Way", id: "30XU4suKzCeoCK9YFzdufg" }] },
  { name: "Ariana Grande", color: "var(--plum)", songs: [{ title: "no tears left to cry", id: "2qT1uLXPVPzGgFOx4jtEuo" }] },
  { name: "毛不易", color: "var(--sage)", songs: [
    { title: "像我這樣的人", id: "7pZYb3XtZ0wMtORwnVY9SE" },
    { title: "給你給我", id: "0uIfbYtrvFEcueiw3GNFJt" },
    { title: "平凡的一天", id: "6RsXZQiT0Bhlo7tQefEbuW" },
  ] },
  { name: "サカナクション", color: "var(--sky)", songs: [
    { title: "アオイ", id: "73TEyhGLxixHAwzOdoamgV" },
    { title: "怪獣", id: "7sMRDjjwsB7wQEBOkdfg0i" },
  ] },
];

// OC：住在威爾森內心深處的那隻狼
const MERIDIAN = [
  { k: "身分", v: "住在威爾森內心深處的投射，是他希望成為的完美角色（但其實也不完美 www）" },
  { k: "個性", v: "陽光、溫暖的大狗狗，熱愛旅行和探險" },
  { k: "年齡", v: "看起來 23 歲，其實才 15 歲" },
  { k: "生日", v: "不可知" },
  { k: "怪癖", v: "一隻不愛吃肉的狼；整天拿著地質錘到處找東西敲，有點破壞狂" },
  { k: "配色", v: "這個網站的深藍、米白、金、橘、青綠，都是從他身上取的" },
];

const LIKES = ["畫畫", "烹飪", "看劇", "看電影", "收藏書"];

const SECTIONS = [
  { href: "/blog", no: "01", label: "日常碎念", c: "var(--gold)" },
  { href: "/docs", no: "02", label: "學習日常", c: "var(--teal)" },
  { href: "/gallery", no: "03", label: "生活影像", c: "var(--orange)" },
  { href: "/map", no: "04", label: "足跡地圖", c: "var(--sage)" },
  { href: "/docs/research", no: "05", label: "研究", c: "var(--plum)" },
];

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono-label text-xs font-bold tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <main className="px-6 py-10 md:px-12">
      <PageHeader code="[06] 來杯什麼都好の" title="關於我" en="ABOUT" color="var(--rose)" />

      <p className="max-w-3xl text-2xl font-black leading-relaxed md:text-3xl">
        出生自台中豐原的平凡小孩，
        <br className="max-sm:hidden" />
        內心永遠住著一個 <span className="about-mark">15 歲的小屁孩</span>。
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_300px] md:gap-16">
        <div className="flex flex-col gap-12">
          <section>
            <Label>{"// 01 為什麼讀地科"}</Label>
            <div className="mt-3 border-t-4 border-foreground pt-4 text-lg leading-loose">
              原因真的很多，但最主要的是——
              <strong className="font-black">我想用不同的角度，好好看看這個我生活的世界。</strong>
            </div>
          </section>

          <section>
            <Label>{"// 02 喜歡的事"}</Label>
            <div className="mt-3 border-t-4 border-foreground pt-4">
              <ul className="flex flex-wrap gap-2">
                {LIKES.map((x) => (
                  <li key={x} className="border-2 border-foreground px-3 py-1 font-bold">
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-loose text-muted-foreground">
                畫畫、烹飪算是比較能直接聯想到的；特別喜歡看劇和電影。書的話比較偏收藏，假如有足夠多的時間，應該也算愛看書。
              </p>
            </div>
          </section>

          <section>
            <Label>{`// 03 近況（更新於 ${UPDATED}）`}</Label>
            <dl className="mt-3 border-t-4 border-foreground">
              {NOW.map((n) => (
                <div key={n.k} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-foreground/20 py-3">
                  <dt className="font-mono-label text-sm font-bold text-[var(--rose)]">{n.k}</dt>
                  <dd className="font-bold">{n.v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-foreground/20 py-3">
                <dt className="font-mono-label text-sm font-bold text-[var(--rose)]">在聽</dt>
                <dd className="flex flex-col gap-2">
                  {MUSIC.map((m) => (
                    <div key={m.when} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-sm text-muted-foreground">{m.when}</span>
                      {m.artists.map((a) => (
                        <a
                          key={a.name}
                          href={a.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline decoration-[var(--rose)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--rose)]"
                        >
                          {a.name} ↗
                        </a>
                      ))}
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
          </section>
          <section>
            <Label>{"// 04 住在心裡的那隻狼"}</Label>
            <div className="mt-3 grid gap-6 border-t-4 border-foreground pt-6 sm:grid-cols-[240px_minmax(0,1fr)]">
              <figure className="mx-auto w-60 sm:w-full">
                {/* 逐格動畫（6 格）；偏好減少動態時只顯示最後一格 */}
                <div className="relative">
                  <div
                    className="absolute inset-x-3 bottom-2 top-8 -skew-x-6 bg-[var(--navy)] dark:bg-[#2f3a5e]"
                    aria-hidden="true"
                  />
                  <picture>
                    <source srcSet="/img/meridian/hammer-still.webp" media="(prefers-reduced-motion: reduce)" />
                    <img
                      src="/img/meridian/hammer.webp"
                      alt="子午線 Meridian：戴圓框眼鏡和白色棒球帽的灰狼，揮地質錘敲石頭，敲下碎片後得意地笑"
                      width={480}
                      height={485}
                      loading="lazy"
                      className="relative block h-auto w-full"
                    />
                  </picture>
                </div>
                <figcaption className="mt-3 font-mono-label text-xs text-muted-foreground">
                  {"// 今天也在找東西敲"}
                </figcaption>
              </figure>
              <div>
                <p className="text-2xl font-black">
                  子午線 <span className="font-mono-label text-base text-muted-foreground">MERIDIAN</span>
                </p>
                <dl className="mt-3">
                  {MERIDIAN.map((m) => (
                    <div key={m.k} className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-foreground/20 py-2.5">
                      <dt className="font-mono-label text-sm font-bold text-[var(--rose)]">{m.k}</dt>
                      <dd className="text-sm font-bold leading-relaxed">{m.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section>
            <Label>{"// 05 書架"}</Label>
            <Bookshelf books={BOOKS} />
          </section>

          <section>
            <Label>{"// 06 唱片機"}</Label>
            <RecordPlayer artists={SONGS} />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              播放器來自 Spotify：沒登入可以試聽約 30 秒，登入後可以聽完整首。
            </p>
          </section>
        </div>

        <aside className="flex flex-col gap-10 md:sticky md:top-24 md:self-start">
          <div className="border-2 border-foreground p-5 shadow-[6px_6px_0_var(--rose)]">
            <p className="font-mono-label text-xs font-bold tracking-widest">ID CARD</p>
            <p className="mt-2 text-3xl font-black">威爾森</p>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-12 flex-none font-mono-label font-bold text-muted-foreground">來自</dt>
                <dd className="font-bold">台中豐原</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 flex-none font-mono-label font-bold text-muted-foreground">現在</dt>
                <dd className="font-bold">臺灣師範大學地球科學系</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 flex-none font-mono-label font-bold text-muted-foreground">找我</dt>
                <dd>
                  <a
                    href="https://instagram.com/sleepy__wilson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline decoration-[var(--rose)] decoration-2 underline-offset-4 hover:text-[var(--rose)]"
                  >
                    IG @sleepy__wilson
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <nav aria-label="網站分區">
            <Label>{"// 在這裡逛逛"}</Label>
            <ul className="mt-3 border-t-4 border-foreground">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="group flex items-center gap-3 border-b border-foreground/20 py-3 font-bold"
                  >
                    <span className="h-3 w-3 flex-none" style={{ background: s.c }} aria-hidden="true" />
                    <span className="font-mono-label text-xs text-muted-foreground">{s.no}</span>
                    <span className="split-hover">{s.label}</span>
                    <span className="ml-auto transition-transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </main>
  );
}
