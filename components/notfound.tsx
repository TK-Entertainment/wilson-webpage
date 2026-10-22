import Link from "next/link";
import GlitchText from "@/components/glitchtext";

// 404：包浩斯 × 故障風（純靜態，build 時就產生）
// compact：放在筆記區（有側邊欄）時用比較小的版面

const routes = [
  { href: "/", label: "首頁", code: "00", color: "bg-bh-red text-white" },
  {
    href: "/blog",
    label: "日常碎念",
    code: "01",
    color: "bg-bh-blue text-white",
  },
  {
    href: "/docs",
    label: "學習日常",
    code: "02",
    color: "bg-bh-yellow text-bh-ink",
  },
  {
    href: "/gallery",
    label: "生活影像",
    code: "03",
    color: "bg-foreground text-background",
  },
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
        <span className="nf-circle absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-bh-red md:h-80 md:w-80" />
        <span
          className={`nf-square absolute bottom-6 right-40 hidden h-24 w-24 border-4 border-foreground bg-bh-yellow ${
            compact ? "" : "md:block"
          }`}
        />
        {compact ? (
          <></>
        ) : (
          <span className="nf-tri absolute right-6 top-8 h-24 w-28 bg-bh-blue md:right-24 md:h-32 md:w-36" />
        )}
        <span
          className={`nf-bar absolute -left-10 bottom-24 h-4 w-72 bg-foreground md:w-[28rem] ${
            compact ? "hidden" : ""
          }`}
        />
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

      <div className="mt-8 max-w-xl border-4 border-foreground bg-bh-ink p-4 font-mono-label text-sm leading-relaxed text-bh-paper shadow-[8px_8px_0_#1f4fa3] sm:text-base">
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

      <nav aria-label="回到其他頁面" className="mt-10 max-w-3xl">
        <ul
          className={`grid grid-cols-2 gap-3 ${
            compact ? "" : "sm:grid-cols-4"
          }`}
        >
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className={`nf-link group flex h-full flex-col justify-between gap-6 border-4 border-foreground p-3 ${route.color}`}
              >
                <span className="font-mono-label text-xs font-bold">
                  [{route.code}]
                </span>
                <span className="jitter-hover flex items-center justify-between text-lg font-black">
                  {route.label}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
