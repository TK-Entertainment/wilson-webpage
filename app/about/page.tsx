import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Archive, { type ArchiveTab } from "@/components/about/Archive";
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

// 收藏庫：書、歌、電影。要加一本書／一首歌／一部片，在對應陣列加一筆就好
// 書封自架在 public/img/shelf/（來源博客來）；歌的 spotify 是 open.spotify.com/track/<id>；電影 tmdb 是 themoviedb.org/movie/<id>
const SPOTIFY_IMG = (h: string) => `https://i.scdn.co/image/${h}`;
const TMDB_IMG = (size: string, f: string) => `https://image.tmdb.org/t/p/${size}/${f}`;
const BOOK = (id: string) => ({ label: "博客來", url: `https://www.books.com.tw/products/${id}` });
const ARCHIVE: ArchiveTab[] = [
  { key: "books", kanji: "本", en: "BOOKS", items: [
    { title: "被討厭的勇氣", sub: "岸見一郎、古賀史健", img: "/img/shelf/courage.webp", src: BOOK("0010653153") },
    { title: "牧羊少年奇幻之旅", sub: "保羅・科爾賀", img: "/img/shelf/alchemist.webp", src: BOOK("0011067603") },
    { title: "三體", sub: "劉慈欣", img: "/img/shelf/three-body.webp", href: "/blog/three-body-1", note: "寫過一篇讀後心得", src: BOOK("0010950747") },
    { title: "我的神鬼人生", sub: "李家維、廖宏霖", img: "/img/shelf/shengui.webp", src: BOOK("0010973965") },
  ] },
  { key: "music", kanji: "音", en: "MUSIC", items: [
    { title: "W/X/Y", sub: "Tani Yuuki", spotify: "3ZnMe3b6WeuZislPMmCTZN", img: SPOTIFY_IMG("ab67616d00001e02e0d7f6e80ce383cb2ccef66d"), src: { label: "Spotify", url: "https://open.spotify.com/track/3ZnMe3b6WeuZislPMmCTZN" } },
    { title: "もう一度", sub: "Tani Yuuki", spotify: "40gt89icqkSFqWWfMlqagb", img: SPOTIFY_IMG("ab67616d00001e027d9d131027e15c39857682ce"), src: { label: "Spotify", url: "https://open.spotify.com/track/40gt89icqkSFqWWfMlqagb" } },
    { title: "スケッチ", sub: "あいみょん", spotify: "2HCw2hGOPVUim9RWk3wh0C", img: SPOTIFY_IMG("ab67616d00001e02ce2db1dfb891b878060d7cf3"), src: { label: "Spotify", url: "https://open.spotify.com/track/2HCw2hGOPVUim9RWk3wh0C" } },
    { title: "君の夢を聞きながら、僕は笑えるアイデアを！", sub: "あいみょん", spotify: "2SoUv5PuyA99w2XwwwQRST", img: SPOTIFY_IMG("ab67616d00001e02ac2aee5ac331309a79bc6e6a"), src: { label: "Spotify", url: "https://open.spotify.com/track/2SoUv5PuyA99w2XwwwQRST" } },
    { title: "Born This Way", sub: "Lady Gaga", spotify: "30XU4suKzCeoCK9YFzdufg", img: SPOTIFY_IMG("ab67616d00001e02a5d31644260279be8d0c46c0"), src: { label: "Spotify", url: "https://open.spotify.com/track/30XU4suKzCeoCK9YFzdufg" } },
    { title: "no tears left to cry", sub: "Ariana Grande", spotify: "2qT1uLXPVPzGgFOx4jtEuo", img: SPOTIFY_IMG("ab67616d00001e02c3af0c2355c24ed7023cd394"), src: { label: "Spotify", url: "https://open.spotify.com/track/2qT1uLXPVPzGgFOx4jtEuo" } },
    { title: "像我這樣的人", sub: "毛不易", spotify: "7pZYb3XtZ0wMtORwnVY9SE", img: SPOTIFY_IMG("ab67616d00001e024f11d50a19bd09efa1c1fbda"), src: { label: "Spotify", url: "https://open.spotify.com/track/7pZYb3XtZ0wMtORwnVY9SE" } },
    { title: "給你給我", sub: "毛不易", spotify: "0uIfbYtrvFEcueiw3GNFJt", img: SPOTIFY_IMG("ab67616d00001e024f11d50a19bd09efa1c1fbda"), src: { label: "Spotify", url: "https://open.spotify.com/track/0uIfbYtrvFEcueiw3GNFJt" } },
    { title: "平凡的一天", sub: "毛不易", spotify: "6RsXZQiT0Bhlo7tQefEbuW", img: SPOTIFY_IMG("ab67616d00001e024f11d50a19bd09efa1c1fbda"), src: { label: "Spotify", url: "https://open.spotify.com/track/6RsXZQiT0Bhlo7tQefEbuW" } },
    { title: "アオイ", sub: "サカナクション", spotify: "73TEyhGLxixHAwzOdoamgV", img: SPOTIFY_IMG("ab67616d00001e026dd4b6207e6e3780e50a24d6"), src: { label: "Spotify", url: "https://open.spotify.com/track/73TEyhGLxixHAwzOdoamgV" } },
    { title: "怪獣", sub: "サカナクション", spotify: "7sMRDjjwsB7wQEBOkdfg0i", img: SPOTIFY_IMG("ab67616d00001e022337f03620420d4561c7e6c9"), src: { label: "Spotify", url: "https://open.spotify.com/track/7sMRDjjwsB7wQEBOkdfg0i" } },
  ] },
  { key: "films", kanji: "映", en: "FILMS", items: [
    { title: "星際效應", sub: "", year: "2014", img: TMDB_IMG("w342", "v7Iib57HHgSEI9B7XYRF6qrs11T.jpg"), still: TMDB_IMG("w780", "8sNiAPPYU14PUepFNeSNGUTiHW.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/157336" } },
    { title: "奧德賽", sub: "", year: "2026", img: TMDB_IMG("w342", "d7MiRRamaAe58DacYEo2ZgziBBv.jpg"), still: TMDB_IMG("w780", "mIi99BK2mDpLp2lGsa8jCBDFit4.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1368337" } },
    { title: "陽光女子合唱團", sub: "", year: "2025", img: TMDB_IMG("w342", "ryCanTADyAo7bqRr1aca2ThuTeE.jpg"), still: TMDB_IMG("w780", "5K8zQhHIr6GiOIpM18DWsgy2COv.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1481955" } },
    { title: "哆啦A夢：大雄的繪畫世界物語", sub: "", year: "2025", img: TMDB_IMG("w342", "puAxWoIq2AIEHsZpQZzOXng8JvC.jpg"), still: TMDB_IMG("w780", "vncMpsAUDnL1JOb73e5q48gX32S.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1372489" } },
    { title: "哆啦A夢：新‧大雄的海底鬼岩城", sub: "", year: "2026", img: TMDB_IMG("w342", "a6j3pLB0P89TR7YkhD3k7MBkBqE.jpg"), still: TMDB_IMG("w780", "pxd9rc03EMMln3tVFdfd427Fpsi.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1542261" } },
    { title: "穿著PRADA的惡魔", sub: "", year: "2006", img: TMDB_IMG("w342", "he6k1x5nlGGhahh1xSyApU4fGeR.jpg"), still: TMDB_IMG("w780", "gkh6Nt8DtY1XT4gQsyFq9XAVJlJ.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/350" } },
    { title: "穿著PRADA的惡魔2", sub: "", year: "2026", img: TMDB_IMG("w342", "pep61TOT2GJjT0ck2JbtMwIZNyJ.jpg"), still: TMDB_IMG("w780", "dRoFlUbH1l51ACmx5oPCI3jfvZq.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1314481" } },
    { title: "沙丘", sub: "", year: "2021", img: TMDB_IMG("w342", "qtSzr3bY8wP3lUDfTx2Qg5y5Qri.jpg"), still: TMDB_IMG("w780", "qVgZu5BTx6pu4owCvVOm4zjTfOi.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/438631" } },
    { title: "沙丘：第二部", sub: "", year: "2024", img: TMDB_IMG("w342", "1p25wDEdFRRTtwtPFbtPHISefzG.jpg"), still: TMDB_IMG("w780", "eZ239CUp1d6OryZEBPnO2n87gMG.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/693134" } },
    { title: "Jim Queen：肌情四射", sub: "", year: "2026", img: TMDB_IMG("w342", "ue2Orwc7nNYFixoOLBHpse2H1uX.jpg"), still: TMDB_IMG("w780", "gZDF8oChSplhdwTCjFR1SHwKw8s.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1061798" } },
    { title: "動物方城市", sub: "", year: "2016", img: TMDB_IMG("w342", "rGZ6fQ7CPrExi1ox5SPMMhdvX1a.jpg"), still: TMDB_IMG("w780", "9tOkjBEiiGcaClgJFtwocStZvIT.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/269149" } },
    { title: "動物方城市2", sub: "", year: "2025", img: TMDB_IMG("w342", "qKGxhmQb1IAdTF03mJTMuaLCLBo.jpg"), still: TMDB_IMG("w780", "lgotja3xMoJZbynwHfcQcJAEMWH.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1084242" } },
    { title: "海洋奇緣", sub: "", year: "2016", img: TMDB_IMG("w342", "zyldaLGUo7oZpI9Z1bYPg59uPQw.jpg"), still: TMDB_IMG("w780", "qLVNZFHYUR6Li64He67SWl6BHQe.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/277834" } },
    { title: "海洋奇緣2", sub: "", year: "2024", img: TMDB_IMG("w342", "zKFLEeUTO0nGwcff5HPddwZPk1q.jpg"), still: TMDB_IMG("w780", "vYqt6kb4lcF8wwqsMMaULkP9OEn.jpg"), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1241982" } },
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
            <Label>{"// 05 收藏庫：讀過的、在聽的、看過的"}</Label>
            <Archive tabs={ARCHIVE} />
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
