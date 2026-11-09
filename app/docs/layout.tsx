import type { ReactNode } from "react";
import { notesTree, researchTree } from "../source";
import DocsI18n from "@/components/docsi18n";
import DocsTreeLayout from "@/components/DocsTreeLayout";

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsI18n>
      <DocsTreeLayout notesTree={notesTree} researchTree={researchTree}>
        {children}
      </DocsTreeLayout>
    </DocsI18n>
  );
}
