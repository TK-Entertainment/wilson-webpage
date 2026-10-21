import { type Metadata } from "next";
import { RootProvider } from "next-docs-ui/provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import Navbar from "@/components/Navigation/navbar";
import Footer from "@/components/footer";
import "next-docs-ui/style.css";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    title: {
      template: "威爾森的生活札記",
      default: "威爾森的生活札記",
      absolute: "威爾森的生活札記",
    },
    description:
      "來杯好茶聊聊日常碎念，來杯咖啡記下學習日常。威爾森的生活與上課筆記都在這裡。",
    openGraph: {
      images: "",
      title: {
        template: "威爾森的生活札記",
        absolute: "威爾森的生活札記",
        default: "威爾森的生活札記",
      },
      description:
        "來杯好茶聊聊日常碎念，來杯咖啡記下學習日常。威爾森的生活與上課筆記都在這裡。",
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
          href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@300;400;700&display=swap"
        />
      </head>
      <body>
        <Navbar />
        <RootProvider>{children}</RootProvider>
        <Footer />
      </body>
    </html>
  );
}
