"use client";

import { DocsLayout } from "next-docs-ui/layout";
import { usePathname } from "next/navigation";
import { useMemo, type CSSProperties, type ReactNode } from "react";
import { courseColor, courseHS } from "@/utils/palette";
import type { notesTree as NotesTree } from "@/app/source";

type TreeNode = (typeof NotesTree)["children"][number];
// 資料夾的代表網址：有首頁用首頁，沒有就用第一個子頁
function firstUrl(node: TreeNode): string | undefined {
  if (node.type === "page") return node.url;
  if (node.type === "folder") {
    if (node.index) return node.index.url;
    for (const child of node.children) {
      const u = firstUrl(child);
      if (u) return u;
    }
  }
  return undefined;
}

// 依目前網址選側欄：研究頁只顯示研究的目錄，其他筆記頁只顯示課程筆記
export default function DocsTreeLayout({
  notesTree,
  researchTree,
  children,
}: {
  notesTree: typeof NotesTree;
  researchTree: typeof NotesTree;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isResearch = pathname.startsWith("/docs/research");
  const baseTree = isResearch ? researchTree : notesTree;
  // 每門課的資料夾名稱前加一個課程色方塊（和筆記目錄的方形標記一致）
  const tree = useMemo(
    () => ({
      ...baseTree,
      children: baseTree.children.map((node) => {
        if (node.type !== "folder") return node;
        const c = courseColor(firstUrl(node) ?? "");
        if (!c) return node;
        return {
          ...node,
          icon: <span className="course-sq" style={{ background: c }} aria-hidden="true" />,
        };
      }),
    }),
    [baseTree],
  );
  // 在某門課裡時，側欄目前頁、右側目錄、連結強調色都換成這門課的顏色
  const hs = courseHS(pathname);
  const style = hs
    ? ({ ["--course" as string]: courseColor(pathname), ["--course-hs" as string]: hs } as CSSProperties)
    : undefined;
  return (
    <div className="contents" data-course-hs={hs ? "" : undefined} style={style}>
    <DocsLayout
      tree={tree}
      nav={{ enabled: false }}
      // 學習日常的課程資料夾預設收起來（目前所在的課程仍會自動展開）；研究只有一個資料夾，維持展開
      sidebar={{ defaultOpenLevel: isResearch ? 1 : 0 }}
    >
      {children}
    </DocsLayout>
    </div>
  );
}
