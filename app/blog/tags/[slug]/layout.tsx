import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RollButton } from "next-docs-ui/components/roll-button";

export function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Metadata {
  const slug = params.slug ?? "";
  const decodedTag = decodeURIComponent(slug);

  return {
    title: {
      template: `Wilson's Notes | 標籤 > ${decodedTag}`,
      default: "Wilson's Notes",
      absolute: "Wilson's Notes",
    },
    description:
      "仰望星空科普專案介紹，為你帶來不同以往的科普體驗，重拾愛好自然與科學之心，讓我們一起徜徉在浩瀚星河中吧！",
    openGraph: {
      images: "",
      title: {
        template: `Wilson's Notes | 標籤 > ${decodedTag}`,
        absolute: "Wilson's Notes",
        default: "Wilson's Notes",
      },
      description:
        "仰望星空科普專案介紹，為你帶來不同以往的科普體驗，重拾愛好自然與科學之心，讓我們一起徜徉在浩瀚星河中吧！",
    },
  };
}

  export default function TagLayout({ children }: { children: ReactNode }) {
    return (
      <>
        <div className="container">
          <RollButton />
          {children}
        </div>
      </>
    );
  }