import Link from "next/link";
import Logo from "@/components/logo";

const sections = [
  { href: "/blog", no: "01", label: "日常碎念" },
  { href: "/docs", no: "02", label: "學習日常" },
  { href: "/gallery", no: "03", label: "生活影像" },
  { href: "/map", no: "04", label: "足跡地圖" },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-[var(--navy)] text-[var(--cream)] before:absolute before:inset-x-0 before:top-0 before:h-[5px] before:bg-[var(--gold)]">
      <div className="container flex flex-col justify-between gap-8 py-10 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <Logo className="h-4 w-12 text-[var(--cream)]" />
          <p className="text-2xl font-black">威爾森的生活札記</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-black">
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="transition-colors hover:text-[var(--gold)]"
                >
                  <span className="mr-1.5 font-mono-label text-[11px] opacity-60">
                    {s.no}
                  </span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="font-mono-label text-xs opacity-70">
            © 2023–{new Date(Date.now()).getFullYear()} 威爾森 (Wilson Chen)
          </p>
        </div>
        <div className="flex flex-col gap-1 font-mono-label text-xs opacity-70 md:items-end md:text-right [&_a]:inline-block [&_a]:py-1">
          <Link
            href="https://instagram.com/sleepy__wilson"
            className="hover:text-[var(--gold)]"
          >
            Instagram @sleepy__wilson
          </Link>
          <Link
            href="https://github.com/TK-Entertainment"
            className="hover:text-[var(--gold)]"
          >
            A Project of TK Entertainment
          </Link>
          <p>
            Made with{" "}
            <Link
              href="https://github.com/vercel/next.js"
              className="hover:text-[var(--gold)]"
            >
              Next.js
            </Link>{" "}
            + Next Docs by{" "}
            <Link
              href="https://github.com/fuma-nama"
              className="hover:text-[var(--gold)]"
            >
              @Fuma Nama
            </Link>
          </p>
          <p>Original design by Kevinowo</p>
          <p>Redesign 2026 by 威爾森</p>
        </div>
      </div>
    </footer>
  );
}
