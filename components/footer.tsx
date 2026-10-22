import Link from "next/link";
import Logo from "@/components/logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-foreground bg-bh-ink text-bh-paper">
      <div className="container flex flex-col justify-between gap-8 py-10 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <Logo className="h-5 w-[60px]" />
          <p className="text-2xl font-black">威爾森的生活札記</p>
          <p className="font-mono-label text-xs opacity-70">
            © 2023–{new Date(Date.now()).getFullYear()} 威爾森 (Wilson Chen)
          </p>
        </div>
        <div className="flex flex-col gap-1 font-mono-label text-xs opacity-70 md:text-right">
          <a href="/rss.xml" className="hover:text-bh-yellow">
            RSS 訂閱
          </a>
          <Link
            href="https://github.com/TK-Entertainment"
            className="hover:text-bh-yellow"
          >
            A Project of TK Entertainment
          </Link>
          <p>
            Made with{" "}
            <Link
              href="https://github.com/vercel/next.js"
              className="hover:text-bh-yellow"
            >
              Next.js
            </Link>{" "}
            + Next Docs by{" "}
            <Link
              href="https://github.com/fuma-nama"
              className="hover:text-bh-yellow"
            >
              @Fuma Nama
            </Link>
          </p>
          <p>Website design by Kevinowo</p>
        </div>
      </div>
    </footer>
  );
}
