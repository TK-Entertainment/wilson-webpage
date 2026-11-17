import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { pageMetadata } from "@/utils/seo";
import { availableYears, yearStats, KIND_COLOR, type Kind } from "@/utils/yearStats";
import "../year.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return availableYears().map((year) => ({ year }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  return pageMetadata({
    title: `威爾森的生活札記 | ${year} 年度回顧`,
    description: `${year} 年寫了幾篇、去了哪裡，網站自己算給你看。`,
    path: `/year/${year}`,
    image: "year",
  });
}

const KINDS: Kind[] = ["筆記", "碎念", "打卡", "影像"];
const TOTAL_COUNTIES = 22;

const fmtWords = (n: number) =>
  n >= 10000 ? `${(n / 10000).toFixed(1)}` : n.toLocaleString("zh-TW");

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono-label text-xs font-bold tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const s = yearStats(year);
  const years = availableYears();
  const max = Math.max(1, ...s.months.map((m) => KINDS.reduce((n, k) => n + m[k], 0)));
  const maxCourse = Math.max(1, ...s.courses.map((c) => c.n));

  const big = [
    { k: "筆記", v: String(s.notes), u: "篇", c: KIND_COLOR.筆記 },
    { k: "碎念", v: String(s.posts), u: "篇", c: KIND_COLOR.碎念 },
    { k: "打卡", v: String(s.places), u: "次", c: KIND_COLOR.打卡 },
    { k: "相簿", v: String(s.albums), u: "本", c: KIND_COLOR.影像 },
    { k: "寫了", v: fmtWords(s.words), u: s.words >= 10000 ? "萬字" : "字", c: "var(--plum)" },
    { k: "走過", v: String(s.counties.length), u: `／${TOTAL_COUNTIES} 縣市`, c: "var(--sky)" },
  ];

  return (
    <main className="px-6 py-10 md:px-12">
      <PageHeader code="[YR] 一整年的" title={`${year} 年度回顧`} en="YEAR" color="var(--gold)" />

      {years.length > 1 ? (
        <nav className="yr-years font-mono-label" aria-label="選擇年份">
          {years.map((y) => (
            <Link key={y} href={`/year/${y}`} aria-current={y === year ? "page" : undefined}>
              {y}
            </Link>
          ))}
        </nav>
      ) : null}

      <section className="yr-big">
        {big.map((b) => (
          <div key={b.k} style={{ ["--c" as string]: b.c }}>
            <span className="k">{b.k}</span>
            <span className="v">{b.v}</span>
            <span className="u">{b.u}</span>
          </div>
        ))}
      </section>

      <section className="yr-sec">
        <Label>{"// 01 每個月在忙什麼"}</Label>
        <div className="yr-months" role="img" aria-label={`${year} 每月新增的筆記、碎念、打卡、相簿數`}>
          {s.months.map((m) => {
            const total = KINDS.reduce((n, k) => n + m[k], 0);
            return (
              <div key={m.m} className="col" title={`${m.m} 月：${KINDS.map((k) => `${k} ${m[k]}`).join("、")}`}>
                <span className="n font-mono-label">{total || ""}</span>
                <div className="bar" style={{ height: `${(total / max) * 100}%` }}>
                  {KINDS.map((k) =>
                    m[k] ? (
                      <i key={k} style={{ flexGrow: m[k], background: KIND_COLOR[k] }} />
                    ) : null,
                  )}
                </div>
                <span className="m font-mono-label">{m.m}月</span>
              </div>
            );
          })}
        </div>
        <ul className="yr-legend font-mono-label">
          {KINDS.map((k) => (
            <li key={k}>
              <i style={{ background: KIND_COLOR[k] }} />
              {k}
            </li>
          ))}
        </ul>
        {s.busiest && KINDS.some((k) => s.busiest[k] > 0) ? (
          <p className="yr-note">
            最忙的是 <b>{s.busiest.m} 月</b>：
            {KINDS.filter((k) => s.busiest[k] > 0)
              .map((k) => `${k} ${s.busiest[k]}`)
              .join("、")}
            。
          </p>
        ) : null}
      </section>

      {s.courses.length ? (
        <section className="yr-sec">
          <Label>{"// 02 筆記都寫了哪些課"}</Label>
          <ul className="yr-courses">
            {s.courses.map((c) => (
              <li key={c.folder} style={{ ["--c" as string]: c.color }}>
                <Link href={`/docs/${c.folder}`}>{c.title}</Link>
                <span className="track">
                  <i style={{ width: `${(c.n / maxCourse) * 100}%` }} />
                </span>
                <span className="font-mono-label">{c.n} 篇</span>
              </li>
            ))}
          </ul>
          <p className="yr-note">
            筆記約 {s.noteWords.toLocaleString("zh-TW")} 字，碎念約 {s.postWords.toLocaleString("zh-TW")} 字（程式碼、公式不算）。
          </p>
        </section>
      ) : null}

      <section className="yr-sec">
        <Label>{"// 03 走過的縣市"}</Label>
        {s.counties.length ? (
          <ul className="yr-counties">
            {s.counties.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="yr-note">這一年還沒有打卡紀錄。</p>
        )}
        <p className="yr-note">
          <Link href="/map" className="yr-link">到足跡地圖看看 →</Link>
        </p>
      </section>

      <p className="yr-foot font-mono-label">
        {"// 數字由網站資料自動計算；筆記以第一次放上網站的日期為準"}
      </p>
    </main>
  );
}
