import type { Metadata } from "next";
import type { ReactNode } from "react";

export function generateMetadata({
  params,
}: {
  params: { slug?: string };
}): Metadata {
  const slug = params.slug ?? "";
  const decodedTag = decodeURIComponent(slug);

  return {
    title: `Wilson's Notes | 標籤 > ${decodedTag}`,
    description:
      "仰望星空科普專案介紹，為你帶來不同以往的科普體驗，重拾愛好自然與科學之心，讓我們一起徜徉在浩瀚星河中吧！",
    openGraph: {
      images: "",
      title: `Wilson's Notes | 標籤 > ${decodedTag}`,
      description:
        "仰望星空科普專案介紹，為你帶來不同以往的科普體驗，重拾愛好自然與科學之心，讓我們一起徜徉在浩瀚星河中吧！",
    },
  };
}

  export default function TagLayout({ children }: { children: ReactNode }) {
    return (
      <>
        {children}
      </>
    );
  }