"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import defaultComponents from "next-docs-ui/mdx";
import { Photos, Video, YouTube } from "@/components/media";
import "katex/dist/katex.min.css";
import "./math.css";
import { Zoomable } from "@/components/lightbox";
import { MindMap } from "@/components/notes/MindMap";
import { StateFunctionDemo, MeltingGDemo, GraphiteDiamondDemo } from "@/components/notes/Thermo";

const components = {
  ...defaultComponents,
  Photos,
  Video,
  YouTube,
  MindMap,
  StateFunctionDemo,
  MeltingGDemo,
  GraphiteDiamondDemo,
};

export function Content({ code }: { code: string }) {
  const MDX = useMDXComponent(code);

  // 內文圖片可點擊放大（燈箱）
  return (
    <Zoomable>
      <MDX components={components} />
    </Zoomable>
  );
}
