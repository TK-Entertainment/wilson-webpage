import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RollButton } from "next-docs-ui/components/roll-button";

export function generateMetadata(): Metadata {
  return {
    title: "威爾森的生活札記 | 來杯好茶の日常碎念",
    description:
      "來杯好茶聊聊日常碎念，來杯咖啡記下學習日常，來杯果汁收藏生活影像。",
    openGraph: {
      images: "",
      title: "威爾森的生活札記 | 來杯好茶の日常碎念",
      description:
        "來杯好茶聊聊日常碎念，來杯咖啡記下學習日常，來杯果汁收藏生活影像。",
    },
  };
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
