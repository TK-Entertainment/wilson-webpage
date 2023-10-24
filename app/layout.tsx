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
