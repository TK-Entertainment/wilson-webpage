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
      <div className="container mt-auto border-t p-8 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <Info />
        </div>
      </div>
    );
  }
  
  function Info() {
    return (
      <div className="hidden flex-col gap-2 sm:flex">
        <div className="flex flex-row items-center gap-2">

          <h1 className="text-xl font-bold">Yeecord</h1>
        </div>
        <p className="mt-auto text-xs text-muted-foreground">
          YEE式機器龍 © 2019 ~ {new Date(Date.now()).getFullYear()}
        </p>
      </div>
    );
  }