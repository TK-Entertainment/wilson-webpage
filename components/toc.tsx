"use client";

import { TextIcon } from "lucide-react";
import type { TOCItemType } from "next-docs-zeta/server";
import * as Primitive from "next-docs-zeta/toc";
import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createTailwindMerge, getDefaultConfig } from "tailwind-merge";

type PosType = [top: number, height: number];

// @ts-ignore
export const cn = createTailwindMerge(getDefaultConfig, (config) => ({
  ...config,
  prefix: "nd-",
}));

export function TOC(props: { items: TOCItemType[] }) {
  return (
    <div className="nd-sticky nd-divide-y nd-flex nd-flex-col nd-top-16 nd-gap-4 nd-py-12 nd-w-[250px] nd-h-[calc(100vh-4rem)] max-xl:nd-hidden">
      {props.items.length > 0 && <TOCItems items={props.items} />}
    </div>
  );
}

function TOCItems({ items }: { items: TOCItemType[] }) {
  const [pos, setPos] = useState<PosType>();

  return (
    <Primitive.TOCProvider
      toc={items}
      className="nd-relative nd-pt-4 nd-text-sm nd-font-medium nd-overflow-hidden first:nd-pt-0"
    >
      <h3 className="nd-inline-flex nd-items-center nd-mb-4">
        <TextIcon className="nd-w-4 nd-h-4 nd-mr-2" /> 目錄
      </h3>
      <div className="nd-flex nd-flex-col nd-border-l-2 nd-text-muted-foreground">
        <Marker pos={pos} />
        {items.map((item, i) => (
          <TOCItem key={i} item={item} setMarker={setPos} />
        ))}
      </div>
    </Primitive.TOCProvider>
  );
}

function Marker({ pos }: { pos?: PosType }) {
  return (
    <span
      className={cn(
        "nd-absolute nd-left-0 nd-border-l-2 nd-transition-all",
        pos && "nd-border-primary",
      )}
      style={
        pos && {
          top: pos[0],
          height: pos[1],
        }
      }
    />
  );
}

function TOCItem({
  item,
  setMarker,
}: {
  item: TOCItemType;
  setMarker: (v: PosType) => void;
}) {
  const active = Primitive.useActiveAnchor(item.url);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (active && ref.current) {
      setMarker([ref.current.offsetTop, ref.current.clientHeight]);
    }
  }, [active]);

  return (
    <Primitive.TOCItem
      ref={ref}
      href={item.url}
      className={cn(
        "nd-py-1.5 nd-text-ellipsis nd-transition-colors nd-overflow-hidden data-[active=true]:nd-text-primary",
        item.depth <= 2 && "nd-pl-4",
        item.depth === 3 && "nd-pl-7",
        item.depth >= 4 && "nd-pl-10",
      )}
    >
      {item.title}
    </Primitive.TOCItem>
  );
}
