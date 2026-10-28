"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import "./notes.css";

// 邏輯心智圖：中間（最上面）是核心問題，往下一層一層是「為了回答它要解決的子問題」，
// 連線上標關係（因為／所以／用來／用到）。
//
// MDX 用法：
// <LogicMap
//   core={{ label: "核心問題", sub: "一句話答案" }}
//   rows={[[{ id: "a", label: "子問題？", sub: "答案", to: "3." }], [...]]}
//   links={[{ from: "core", to: "a", label: "因為" }, { from: "a", to: "b", label: "用到", dashed: true }]}
//   note="前提：……"
// />
// to：章節標題的開頭文字，點節點右下角的 ↗ 會捲到那一節。
// tone：0–5，節點邊框的顏色。

export type LogicNode = { id: string; label: string; sub?: string; to?: string; tone?: number };
export type LogicLink = { from: string; to: string; label?: string; dashed?: boolean };

const TONES = ["var(--orange)", "var(--teal)", "var(--gold)", "#8a6fd1", "#d0567a", "#5b8bd9"];

function goTo(text: string) {
  const hs = Array.from(document.querySelectorAll("[data-reading-body] h2, [data-reading-body] h3")) as HTMLElement[];
  const norm = (s: string) => s.replace(/\s+/g, "");
  const key = norm(text);
  const h = hs.find((x) => norm(x.textContent ?? "").startsWith(key)) ?? hs.find((x) => norm(x.textContent ?? "").includes(key));
  if (!h) return;
  h.scrollIntoView({ behavior: "smooth", block: "start" });
  if (h.id) history.replaceState(null, "", `#${h.id}`);
}

type Geo = { x: number; y: number; w: number; h: number };
type Drawn = { d: string; lx: number; ly: number; label?: string; dashed?: boolean; color: string; tone: number };

export function LogicMap({
  core,
  rows,
  links,
  note,
  minWidth = 560,
}: {
  core: { label: string; sub?: string };
  rows: LogicNode[][];
  links: LogicLink[];
  note?: string;
  minWidth?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const [paths, setPaths] = useState<Drawn[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [quiz, setQuiz] = useState(false);
  const [shown, setShown] = useState<Record<string, boolean>>({});

  const toneOf = useCallback(
    (id: string) => {
      for (const r of rows) for (const n of r) if (n.id === id) return (n.tone ?? 0) % TONES.length;
      return -1;
    },
    [rows],
  );

  const layout = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const base = el.getBoundingClientRect();
    const geo: Record<string, Geo> = {};
    el.querySelectorAll<HTMLElement>("[data-node]").forEach((n) => {
      const r = n.getBoundingClientRect();
      geo[n.dataset.node!] = { x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height };
    });
    const out: Drawn[] = [];
    for (const l of links) {
      const a = geo[l.from], b = geo[l.to];
      if (!a || !b) continue;
      let x1, y1, x2, y2, d;
      if (b.y > a.y + a.h - 2) {
        // 往下
        x1 = a.x + a.w / 2; y1 = a.y + a.h; x2 = b.x + b.w / 2; y2 = b.y;
        const my = (y1 + y2) / 2;
        d = `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
      } else if (a.y > b.y + b.h - 2) {
        // 往上（引用前面的節點）
        x1 = a.x + a.w / 2; y1 = a.y; x2 = b.x + b.w / 2; y2 = b.y + b.h;
        const my = (y1 + y2) / 2;
        d = `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
      } else {
        // 同一層
        const right = b.x > a.x;
        x1 = right ? a.x + a.w : a.x; y1 = a.y + a.h / 2;
        x2 = right ? b.x : b.x + b.w; y2 = b.y + b.h / 2;
        d = `M${x1},${y1} L${x2},${y2}`;
      }
      const tn = l.from === "core" ? -1 : toneOf(l.from);
      out.push({ d, lx: (x1 + x2) / 2, ly: (y1 + y2) / 2, label: l.label, dashed: l.dashed, color: tn < 0 ? "hsl(var(--foreground))" : TONES[tn], tone: tn + 1 });
    }
    setPaths(out);
    setSize({ w: el.scrollWidth, h: el.scrollHeight });
  }, [links, toneOf]);

  useLayoutEffect(() => {
    layout();
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    el.querySelectorAll("[data-node]").forEach((n) => ro.observe(n));
    return () => ro.disconnect();
  }, [layout, quiz, shown]);

  const nodeBody = (n: { id: string; label: string; sub?: string; to?: string }) => {
    const hidden = quiz && n.id !== "core" && n.sub && !shown[n.id];
    return (
      <>
        <div className="lm-label">{n.label}</div>
        {n.sub ? <div className={`lm-sub${hidden ? " lm-hidden" : ""}`}>{hidden ? "點一下看答案" : n.sub}</div> : null}
        {n.to ? (
          <button
            type="button"
            className="lm-go"
            aria-label="跳到這一節"
            onClick={(e) => {
              e.stopPropagation();
              goTo(n.to!);
            }}
          >
            ↗
          </button>
        ) : null}
      </>
    );
  };

  const reveal = (id: string) => quiz && setShown((s) => ({ ...s, [id]: !s[id] }));

  return (
    <figure className="nd-not-prose lm-wrap">
      <div className="lm-bar">
        <span>邏輯地圖</span>
        <button
          type="button"
          className="ix-btn"
          aria-pressed={quiz}
          onClick={() => {
            setQuiz(!quiz);
            setShown({});
          }}
        >
          {quiz ? "顯示全部答案" : "考自己：蓋住答案"}
        </button>
      </div>
      <div className="lm-scroll">
        <div className="lm-canvas" ref={box} style={{ minWidth }}>
          <svg className="lm-svg" width={size.w} height={size.h} aria-hidden>
            <defs>
              {["hsl(var(--foreground))", ...TONES].map((c, i) => (
                <marker key={i} id={`lm-a${uid}-${i}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
                </marker>
              ))}
            </defs>
            {paths.map((p, i) => (
              <path
                key={i}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={2}
                strokeDasharray={p.dashed ? "6 5" : undefined}
                markerEnd={`url(#lm-a${uid}-${p.tone})`}
              />
            ))}
          </svg>
          {paths.map((p, i) =>
            p.label ? (
              <div key={i} className="lm-edge" style={{ left: p.lx, top: p.ly }}>
                {p.label}
              </div>
            ) : null,
          )}
          <div className="lm-row">
            <div className="lm-node lm-core" data-node="core">
              {nodeBody({ id: "core", ...core })}
            </div>
          </div>
          {rows.map((r, ri) => (
            <div className="lm-row" key={ri}>
              {r.map((n) => (
                <div
                  key={n.id}
                  className={`lm-node${quiz && n.sub ? " lm-clickable" : ""}`}
                  data-node={n.id}
                  style={{ ["--lm-c" as string]: TONES[(n.tone ?? 0) % TONES.length] }}
                  onClick={() => reveal(n.id)}
                >
                  {nodeBody(n)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="lm-note">
        <span className="lm-swipe">手機上可以左右滑動看全圖。</span>
        {note}
      </figcaption>
    </figure>
  );
}
