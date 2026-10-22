import { type Metadata } from "next";
import { RootProvider } from "next-docs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Navbar from "@/components/Navigation/navbar";
import Footer from "@/components/footer";
import GlitchScroll from "@/components/glitchscroll";
import {
  ogImage,
  rssAlternate,
  siteDescription,
  siteName,
  siteUrl,
} from "@/utils/seo";
import "next-docs-ui/style.css";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      // 各頁面自己帶完整標題（例如「威爾森的生活札記 | 文章名」）
      template: "%s",
      default: siteName,
    },
    description: siteDescription,
    alternates: rssAlternate,
    openGraph: {
      type: "website",
      siteName,
      locale: "zh_TW",
      title: siteName,
      description: siteDescription,
      images: [{ ...ogImage("default"), alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [{ ...ogImage("default"), alt: siteName }],
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={inter.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body className="scanlines">
        <Navbar />
        <RootProvider>{children}</RootProvider>
        <Footer />
        <GlitchScroll />
      </body>
    </html>
  );
}
