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
      <!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-34DNHD0LDL"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-34DNHD0LDL');
      </script>
    </html>
  );
}
