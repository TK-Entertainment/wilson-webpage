import type { Metadata } from "next";

// 分享卡片與 RSS 共用的網站資訊
export const siteUrl = "https://wilson.trygong.uk";
export const siteName = "威爾森的生活札記";
export const siteDescription =
  "來杯好茶聊聊日常碎念，來杯咖啡記下學習日常，來杯果汁收藏生活影像。";

// 每個頁面都帶上 RSS 連結（子頁面設定 alternates 會整個覆蓋父層，所以統一在這裡加）
export const rssAlternate = {
  types: {
    "application/rss+xml": [{ url: "/rss.xml", title: `${siteName} RSS` }],
  },
};

// 建置前由 scripts/og.mjs 產生的分享卡片（public/og/）
export function ogImage(path: string) {
  return {
    url: `/og/${path}.png`,
    width: 1200,
    height: 630,
    type: "image/png",
  };
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  authors,
  tags,
}: {
  title: string;
  description?: string;
  /** 頁面網址路徑，例如 /blog/hello */
  path: string;
  /** public/og/ 底下的卡片名稱（不含 .png），例如 blog/hello */
  image: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
}): Metadata {
  const desc = description || siteDescription;
  const images = [{ ...ogImage(image), alt: title }];

  return {
    title,
    description: desc,
    alternates: { canonical: path, ...rssAlternate },
    openGraph: {
      type,
      url: path,
      siteName,
      locale: "zh_TW",
      title,
      description: desc,
      images,
      ...(type === "article" ? { publishedTime, authors, tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images,
    },
  };
}
