import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navigation/navbar";

export const metadata: Metadata = {
    title: {
      template: "Wilson's Blog | %s",
      default: "Wilson's Blog",
      absolute: "Wilson's Blog",
    },
    description: "",
    openGraph: {
      images: "",
      title: {
        template: "Wilson's Blog | %s",
        absolute: "Wilson's Blog",
        default: "Wilson's Blog",
      },
      description: "",
    },
  };

export default function BlogLayout({ children }: { children: ReactNode }) {
    return (
      <>
        <Navbar/>
        <div className="container">
          {children}
        </div>
      </>
    )
}