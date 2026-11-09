"use client";

import { DocsLayout } from "next-docs-ui/layout";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
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
  return (
    <DocsLayout
      tree={tree}
      nav={{ enabled: false }}
      // 學習日常的課程資料夾預設收起來（目前所在的課程仍會自動展開）；研究只有一個資料夾，維持展開
      sidebar={{ defaultOpenLevel: isResearch ? 1 : 0 }}
    >
      {children}
    </DocsLayout>
  );
}
