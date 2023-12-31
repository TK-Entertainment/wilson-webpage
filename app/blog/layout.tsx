import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RollButton } from "next-docs-ui/components/roll-button";

export function generateMetadata(): Metadata {
  return {
    title: "Wilson's Notes | 部落格",
    description:
      "仰望星空科普專案介紹，為你帶來不同以往的科普體驗，重拾愛好自然與科學之心，讓我們一起徜徉在浩瀚星河中吧！",
    openGraph: {
      images: "",
      title: "Wilson's Notes | 部落格",
      description:
        "仰望星空科普專案介紹，為你帶來不同以往的科普體驗，重拾愛好自然與科學之心，讓我們一起徜徉在浩瀚星河中吧！",
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
