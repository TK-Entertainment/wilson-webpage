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

export const runtime = "edge";

export function generateMetadata(): Metadata {
  return {
    title: {
      template: "Wilson's Notes",
      default: "Wilson's Notes",
      absolute: "Wilson's Notes",
    },
    description:
      "仰望星空科普專案介紹，為你帶來不同以往的科普體驗，重拾愛好自然與科學之心，讓我們一起徜徉在浩瀚星河中吧！",
    openGraph: {
      images: "",
      title: {
        template: "Wilson's Notes",
        absolute: "Wilson's Notes",
        default: "Wilson's Notes",
      },
      description:
        "仰望星空科普專案介紹，為你帶來不同以往的科普體驗，重拾愛好自然與科學之心，讓我們一起徜徉在浩瀚星河中吧！",
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        <RootProvider>{children}</RootProvider>
        <Footer />
      </body>
    </html>
  );
}
