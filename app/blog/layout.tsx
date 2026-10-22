import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/utils/seo";
import { RollButton } from "next-docs-ui/components/roll-button";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "威爾森的生活札記 | 來杯好茶の日常碎念",
    description: "來杯好茶，聊聊生活裡的大小事。威爾森的日常碎念與讀書心得。",
    path: "/blog",
    image: "blog",
  });
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="container">
        <RollButton />
        {children}
      </div>
    </>
  );
}
