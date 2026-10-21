"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import defaultComponents from "next-docs-ui/mdx";
import { Photos, Video, YouTube } from "@/components/media";

const components = {
  ...defaultComponents,
  Photos,
  Video,
  YouTube,
};

export function Content({ code }: { code: string }) {
  const MDX = useMDXComponent(code);

  return <MDX components={components} />;
}
