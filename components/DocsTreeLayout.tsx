"use client";

import { DocsLayout } from "next-docs-ui/layout";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { courseColor, courseHS } from "@/utils/palette";
import type { notesTree as NotesTree } from "@/app/source";

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
  const tree = isResearch ? researchTree : notesTree;
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
