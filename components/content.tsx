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
import * as FigsEM from "@/components/notes/FigsEM";
import * as EMDemos from "@/components/notes/EMDemos";
import * as FigsNov from "@/components/notes/FigsNov";
import * as FigsHW from "@/components/notes/FigsHW";
import * as FigsFab from "@/components/notes/FigsFab";
import * as FigsRes from "@/components/notes/FigsRes";
import * as FigsIso from "@/components/notes/FigsIso";
import * as FigsShear from "@/components/notes/FigsShear";
import { DailyReview } from "@/components/notes/DailyReview";
import { StateFunctionDemo, MeltingGDemo, GraphiteDiamondDemo } from "@/components/notes/Thermo";
import { StarLink } from "@/components/stars/StarLink";
import type { HTMLAttributes } from "react";

const H3 = defaultComponents.h3;

const components = {
  ...defaultComponents,
  // 「先認識的名詞」底下加一行連到知識星圖
  h3: (props: HTMLAttributes<HTMLHeadingElement>) =>
    props.id === "先認識的名詞" ? (
      <>
        <H3 {...props} />
        <StarLink />
      </>
    ) : (
      <H3 {...props} />
    ),
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
  ...FigsEM,
  ...EMDemos,
  ...FigsNov,
  ...FigsHW,
  ...FigsFab,
  ...FigsRes,
  ...FigsIso,
  ...FigsShear,
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
