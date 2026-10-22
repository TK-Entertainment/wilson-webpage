import { type Metadata } from "next";
import { RootProvider } from "next-docs-ui/provider";
import { Inter, Noto_Sans_TC, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";
import Navbar from "@/components/Navigation/navbar";
import Footer from "@/components/footer";
import GlitchScroll from "@/components/glitchscroll";
import BackToTop from "@/components/backtotop";
import NoDocSearch from "@/components/search/nodocsearch";
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

// 字型在建置時下載並由網站自己提供，不再讓 Google 字型擋住畫面
// 只保留一般與特粗兩種粗細（粗體 700 會用特粗 900 顯示）
const noto = Noto_Sans_TC({
  weight: ["400", "900"],
  display: "swap",
  preload: false,
  variable: "--font-noto",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
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
    <html
      lang="zh-Hant-TW"
      className={`${inter.className} ${noto.variable} ${spaceMono.variable}`}
    >
      <body className="scanlines">
        <Navbar />
        <RootProvider search={{ SearchDialog: NoDocSearch }}>
          {children}
        </RootProvider>
        <Footer />
        <GlitchScroll />
        <BackToTop />
      </body>
    </html>
  );
}
