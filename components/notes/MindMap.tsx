"use client";

import { useEffect, useRef, useState } from "react";
import "./notes.css";

// 筆記用心智圖：MDX 裡寫 <MindMap root={{ label, children: [...] }} />
// 版面由上往下：根節點在上，第一層分支並排成欄，第二層以下在欄內往下列
// 節點可以帶 href（跳到同頁的章節）和 sub（一行小字，例如公式）

export type MindNode = {
  label: string;
  sub?: string;
  href?: string;
  children?: MindNode[];
};

const BRANCH_COLORS = ["var(--orange)", "var(--teal)", "var(--gold)", "#8a6fd1", "#d0567a", "#5b8bd9"];

function Label({ node }: { node: MindNode }) {
  return node.href ? (
    <a href={node.href} className="mm-link">
      {node.label}
    </a>
  ) : (
    <span>{node.label}</span>
  );
}

function Leaf({ node, depth }: { node: MindNode; depth: number }) {
  const kids = node.children ?? [];
  return (
    <li className={`mm-leaf mm-ld${Math.min(depth, 3)}`}>
      <div className="mm-leaf-box">
        <div className="mm-label">
          <Label node={node} />
        </div>
        {node.sub ? <div className="mm-sub">{node.sub}</div> : null}
      </div>
      {kids.length > 0 ? (
        <ul className="mm-leaves">
          {kids.map((k, i) => (
            <Leaf key={i} node={k} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Branch({ node, color }: { node: MindNode; color: string }) {
  const [open, setOpen] = useState(true);
  const kids = node.children ?? [];
  return (
    <div className="mm-col" style={{ ["--mm-c" as string]: color }}>
      <div className="mm-head">
        <div className="mm-label">
          <Label node={node} />
        </div>
        {node.sub ? <div className="mm-sub">{node.sub}</div> : null}
        {kids.length > 0 ? (
          <button
            type="button"
            className="mm-toggle"
            aria-expanded={open}
            aria-label={open ? "收合" : "展開"}
            onClick={() => setOpen(!open)}
          >
            {open ? "−" : `+${kids.length}`}
          </button>
        ) : null}
      </div>
      {kids.length > 0 && open ? (
        <ul className="mm-leaves">
          {kids.map((k, i) => (
            <Leaf key={i} node={k} depth={2} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function MindMap({ root, caption }: { root: MindNode; caption?: string }) {
  const kids = root.children ?? [];
  const cols = useRef<HTMLDivElement>(null);

  // 換到第二排以後的分支不畫上方連接線（第一排才接到根節點下的橫線）
  useEffect(() => {
    const el = cols.current;
    if (!el) return;
    const mark = () => {
      const items = Array.from(el.children) as HTMLElement[];
      const top = items[0]?.offsetTop ?? 0;
      items.forEach((c) => c.toggleAttribute("data-wrapped", c.offsetTop > top + 4));
    };
    mark();
    const ro = new ResizeObserver(mark);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="nd-not-prose mm-wrap">
      <div className="mm-inner">
        <div className="mm-root">
          <div className="mm-label">{root.label}</div>
          {root.sub ? <div className="mm-sub">{root.sub}</div> : null}
        </div>
        <div ref={cols} className="mm-cols" style={{ ["--mm-n" as string]: String(kids.length) }}>
          {kids.map((k, i) => (
            <Branch key={i} node={k} color={BRANCH_COLORS[i % BRANCH_COLORS.length]} />
          ))}
        </div>
      </div>
      <figcaption className="mm-caption">{caption ?? "點節點跳到該節；按 − 收合分支。"}</figcaption>
    </figure>
  );
}
