"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

type FooterItem = {
  label: string;
  href: string;
  newWindow?: boolean;
};

export default function Footer() {
  return (
    <div className="container mt-auto border-t p-8 md:pb-20 pb-4">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
        <Info />
      </div>
    </div>
  );
}

function Info() {
  return (
    <>
      <div className="flex-col flex">
        <Link
          href="https://github.com/TK-Entertainment"
          className="flex flex-row items-center gap-2"
        >
          <p className="text-base font-base">A Project of TK Entertainment</p>
        </Link>
        <p className="text-2xl font-bold">威爾森的科普天地 / Wilson's blog</p>
        <div className="max-md:mt-12 flex flex-col md:hidden text-left">
          <p className="mt-auto text-xs text-muted-foreground">
            Made with{" "}
            <Link href="https://github.com/vercel/next.js">Next.js</Link>
          </p>
          <p className="mt-auto text-xs text-muted-foreground">
            Next Docs framework by{" "}
            <Link href="https://github.com/fuma-nama">@Fuma Nama</Link>
          </p>
          <p className="text-xs text-muted-foreground">v20231010 by Kevinowo</p>
        </div>
        <p className="md:mt-12 text-xs text-muted-foreground">
          威爾森 (Wilson Chen) © 2019 ~ {new Date(Date.now()).getFullYear()}
        </p>
      </div>
      <div className="hidden flex-col md:flex text-right">
        <p className="mt-auto text-xs text-muted-foreground">
          Made with{" "}
          <Link href="https://github.com/vercel/next.js">Next.js</Link>
        </p>
        <p className="mt-auto text-xs text-muted-foreground text-right">
          Next Docs framework by{" "}
          <Link href="https://github.com/fuma-nama">@Fuma Nama</Link>
        </p>
        <p className="mt-12 text-xs text-muted-foreground">
          v20231109 by Kevinowo
        </p>
      </div>
    </>
  );
}
