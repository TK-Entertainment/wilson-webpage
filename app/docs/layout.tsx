import { DocsLayout } from "next-docs-ui/layout";
import type { ReactNode } from "react";
import { tree } from "../source";
import DocsI18n from "@/components/docsi18n";

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsI18n>
      <DocsLayout tree={tree} nav={{ enabled: false }}>
        {children}
      </DocsLayout>
    </DocsI18n>
  );
}
