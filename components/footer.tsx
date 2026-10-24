import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-auto bg-[var(--navy)] text-[var(--cream)] before:absolute before:inset-x-0 before:top-0 before:h-[5px] before:bg-[var(--gold)]">
      <div className="container flex flex-col justify-between gap-8 py-10 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <span
            className="h-3.5 w-3.5 rotate-45 bg-[var(--gold)]"
            aria-hidden="true"
          />
          <p className="text-2xl font-black">威爾森的生活札記</p>
          <p className="font-mono-label text-xs opacity-70">
            © 2023–{new Date(Date.now()).getFullYear()} 威爾森 (Wilson Chen)
          </p>
        </div>
        <div className="flex flex-col gap-1 font-mono-label text-xs opacity-70 md:items-end md:text-right [&_a]:inline-block [&_a]:py-1">
          <a href="/rss.xml" className="hover:text-[var(--gold)]">
            RSS 訂閱
          </a>
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
          <p>Website design by Kevinowo</p>
        </div>
      </div>
    </footer>
  );
}
