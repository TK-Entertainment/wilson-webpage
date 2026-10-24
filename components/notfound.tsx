import Link from "next/link";
import GlitchText from "@/components/glitchtext";

// 404：訊號中斷（純靜態，build 時就產生）
// compact：放在筆記區（有側邊欄）時用比較小的版面

const routes = [
  { href: "/", label: "首頁", code: "00", color: "var(--orange)" },
  { href: "/blog", label: "日常碎念", code: "01", color: "var(--gold)" },
  { href: "/docs", label: "學習日常", code: "02", color: "var(--teal)" },
  { href: "/gallery", label: "生活影像", code: "03", color: "var(--orange)" },
];

export default function NotFoundScreen({ compact }: { compact?: boolean }) {
  return (
    <main
      className={`nf relative isolate overflow-hidden ${
        compact
          ? "py-8 lg:py-12"
          : "min-h-[calc(100vh-4rem)] px-6 py-10 md:px-12 md:py-16"
      }`}
    >
      {/* 被撞倒的幾何形狀 */}
      <div
        className="nf-shapes pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        {/* 斜切的深藍色塊＋金、橘斜線，進場時像訊號斷掉一樣滑進來 */}
        <span className="nf-slab absolute -right-16 -top-10 h-[130%] w-[34vw] bg-[var(--navy)]" />
        <span
          className={`nf-stripe absolute -top-10 h-[130%] w-4 bg-[var(--orange)] ${
            compact ? "right-[30vw]" : "right-[calc(34vw-10px)]"
          }`}
        />
        <span className="nf-stripe2 absolute -top-10 right-[calc(34vw-90px)] h-[130%] w-1 bg-[var(--gold)]" />
      </div>

      <p className="font-mono-label text-sm font-bold">
        <span className="bg-bh-red px-1.5 py-0.5 text-white">ERR</span> [404]{" "}
        {"//"} SIGNAL LOST
      </p>

      <h1
        className={`nf-404 mt-2 font-black leading-none tracking-tighter ${
          compact
            ? "text-[6.5rem] sm:text-[9rem]"
            : "text-[7.5rem] sm:text-[11rem] md:text-[14rem]"
        }`}
      >
        <GlitchText text="404" />
      </h1>

      <p
        className={`font-mono-label font-bold ${
          compact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-5xl"
        }`}
      >
        <GlitchText text="SIGNAL LOST" />
      </p>
      <p className="mt-2 text-xl font-black sm:text-2xl">
        訊號中斷，這一頁不見了
      </p>

      <div className="mt-8 max-w-xl border-4 border-foreground bg-bh-ink p-4 font-mono-label text-sm leading-relaxed text-bh-paper shadow-[8px_8px_0_#26304f] sm:text-base">
        <p>
          {"> 連線到這個頁面 ......... "}
          <span className="text-bh-yellow">OK</span>
        </p>
        <p>
          {"> 找不到這個頁面 ......... "}
          <span className="nf-err bg-bh-red px-1 text-white">ERR</span>
        </p>
        <p className="opacity-70">{"> 可能被搬走了，或是網址打錯了"}</p>
        <p>
          {"> 請從下面挑一條路回去"}
          <span className="caret" aria-hidden="true" />
        </p>
      </div>

      <nav aria-label="回到其他頁面" className="mt-10">
        <ul className="sweep-menu">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                style={{ ["--c" as string]: route.color }}
              >
                <span className="n font-mono-label">{route.code}</span>
                <span className="t">{route.label}</span>
                <span className="a" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
