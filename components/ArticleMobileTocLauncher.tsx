"use client";

import { useState } from "react";
import type { TOCItemType } from "next-docs-zeta/server";
import Actionbar from "@/components/Navigation/actionbar";
import { MobileTOC } from "@/components/toc";

export default function ArticleMobileTocLauncher({ items }: { items: TOCItemType[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Actionbar showTagMenu={null} setShowTagMenu={null} onOpenToc={() => setOpen(true)} />
      <MobileTOC items={items} open={open} onClose={() => setOpen(false)} />
    </>
  );
}


