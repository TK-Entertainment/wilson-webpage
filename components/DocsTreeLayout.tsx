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
  const tree = pathname.startsWith("/docs/research") ? researchTree : notesTree;
  return (
    <DocsLayout tree={tree} nav={{ enabled: false }}>
      {children}
    </DocsLayout>
  );
}
