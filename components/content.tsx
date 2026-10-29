"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import defaultComponents from "next-docs-ui/mdx";
import { Photos, Video, YouTube } from "@/components/media";
import "katex/dist/katex.min.css";
import "./math.css";
import { Zoomable } from "@/components/lightbox";
import { MindMap } from "@/components/notes/MindMap";
import { LogicMap } from "@/components/notes/LogicMap";
import * as Figs from "@/components/notes/Figs";
import * as FigsGeo from "@/components/notes/FigsGeo";
import * as GeoDemos from "@/components/notes/GeoDemos";
import * as FigsSG from "@/components/notes/FigsSG";
import * as SGDemos from "@/components/notes/SGDemos";
import * as FigsMin from "@/components/notes/FigsMin";
import * as MinDemos from "@/components/notes/MinDemos";
import { DailyReview } from "@/components/notes/DailyReview";
import { StateFunctionDemo, MeltingGDemo, GraphiteDiamondDemo } from "@/components/notes/Thermo";

const components = {
  ...defaultComponents,
  Photos,
  Video,
  YouTube,
  MindMap,
  LogicMap,
  ...Figs,
  ...FigsGeo,
  ...GeoDemos,
  ...FigsSG,
  ...SGDemos,
  ...FigsMin,
  ...MinDemos,
  DailyReview,
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
