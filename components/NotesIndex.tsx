import Link from "next/link";
import type { tree as Tree } from "@/app/source";

type Node = (typeof Tree)["children"][number];
type Folder = Extract<Node, { type: "folder" }>;
type Page = Extract<Node, { type: "page" }>;

const markers = [
  "rounded-full bg-bh-red",
  "bg-bh-blue [clip-path:polygon(50%_0,100%_100%,0_100%)]",
  "bg-bh-yellow",
  "bg-bh-green rounded-[50%_0]",
];

// 學習日常首頁的筆記目錄：依側欄的資料夾（課程）自動列出所有筆記
export default function NotesIndex({ tree }: { tree: typeof Tree }) {
  const folders = tree.children.filter(
    (node): node is Folder => node.type === "folder",
  );
  const loose = tree.children.filter(
    (node): node is Page => node.type === "page" && node.url !== "/docs",
  );
  const groups = [
    ...folders.map((folder) => ({
      name: String(folder.name),
      pages: folder.children.filter((n): n is Page => n.type === "page"),
    })),
    ...(loose.length > 0 ? [{ name: "其他筆記", pages: loose }] : []),
  ].filter((group) => group.pages.length > 0);

  if (groups.length === 0) return <></>;

  return (
    <section className="nd-not-prose mt-12 border-t-4 border-foreground pt-6">
      <p className="font-mono-label text-xs font-bold tracking-widest">
        {"// 筆記目錄"}
      </p>
      <div className="mt-4 grid gap-8 sm:grid-cols-2">
        {groups.map((group, i) => (
          <div key={group.name}>
            <div
              role="heading"
              aria-level={2}
              className="flex items-center gap-3 border-b-2 border-foreground pb-2 text-xl font-black"
            >
              <span
                className={`h-4 w-4 flex-none ${markers[i % markers.length]}`}
                aria-hidden="true"
              />
              {group.name}
            </div>
            <ul className="mt-2">
              {group.pages.map((page) => (
                <li key={page.url}>
                  <Link
                    href={page.url}
                    className="group flex items-baseline justify-between gap-3 border-b border-foreground/20 py-3 font-bold"
                  >
                    <span className="split-hover">{String(page.name)}</span>
                    <span
                      className="font-mono-label text-sm transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
