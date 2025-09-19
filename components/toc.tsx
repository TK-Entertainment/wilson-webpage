"use client";

import { TextIcon } from "lucide-react";
import type { TOCItemType } from "next-docs-zeta/server";
import * as Primitive from "next-docs-zeta/toc";
import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createTailwindMerge, getDefaultConfig } from "tailwind-merge";

type PosType = [top: number, height: number];

// @ts-ignore
export const cn = createTailwindMerge(getDefaultConfig);

export function TOC(props: { items: TOCItemType[] }) {
  return (
    <div className="sticky divide-y flex flex-col top-16 gap-4 py-12 w-[250px] h-[calc(100vh-4rem)] max-xl:hidden">
      {props.items.length > 0 && <TOCItems items={props.items} />}
    </div>
  );
}

export function TOCItems({ items }: { items: TOCItemType[] }) {
  const [pos, setPos] = useState<PosType>();

  return (
    <Primitive.TOCProvider
      toc={items}
      className="relative pt-4 text-sm font-medium overflow-hidden first:pt-0"
    >
      <h3 className="inline-flex items-center mb-4">
        <TextIcon className="w-4 h-4 mr-2" /> 目錄
      </h3>
      <div className="flex flex-col border-l-2 text-muted-foreground">
        <Marker pos={pos} />
        {items.map((item, i) => (
          <TOCItem key={i} item={item} setMarker={setPos} />
        ))}
      </div>
    </Primitive.TOCProvider>
  );
}

export function MobileTOC({
  items,
  open,
  onClose,
}: {
  items: TOCItemType[];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`xl:hidden fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className={`absolute right-0 top-16 bottom-0 w-[85%] max-w-[360px] p-4 bg-background border-l shadow-xl overflow-y-auto transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {items.length > 0 && (
          <div className="pb-8">
            <TOCItems items={items} />
          </div>
        )}
      </div>
    </div>
  );
}

function Marker({ pos }: { pos?: PosType }) {
  return (
    <span
      className={cn(
        "absolute left-0 border-l-2 transition-all",
        pos && "border-primary",
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
        "py-1.5 text-ellipsis transition-colors overflow-hidden data-[active=true]:text-primary",
        item.depth <= 2 && "pl-4",
        item.depth === 3 && "pl-7",
        item.depth >= 4 && "pl-10",
      )}
    >
      {item.title}
    </Primitive.TOCItem>
  );
}
