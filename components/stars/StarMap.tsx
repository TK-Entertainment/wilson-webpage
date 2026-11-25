"use client";

// 知識星圖：底圖是真的古星圖（保井春海〈天文分野之圖〉1677，京都大學數學教室圖書室所藏）。
// 紙上印好的星點有一部分被借來當名詞：一門課占圓盤的一個扇區，一頁筆記是一群相鄰的星。
// 程式不畫任何東西本身，只疊互動：觀測掃描線、游標附近的星表、選取後的星座和跨科連線。
// 資料：scripts/stars-chart.py 找星點 → scripts/stars-data.mjs 分配名詞（starData.json）
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { courseColor } from "@/utils/palette";

type Term = { i: number; name: string; desc: string; x: number; y: number; red?: number };
type Chapter = { page: string; code: string; title: string; url: string; terms: Term[]; edges: [number, number][] };
type Subject = { id: string; name: string; chapters: Chapter[] };
type LinkT = { a: string; b: string; kind: "same" | "concept"; why?: string };
type Chart = { title: string; author: string; year: number; credit: string; source: string; size: number; h: number; cx: number; cy: number; edge: number; nPoints: number };
export type StarData = { generated: string; subjects: Subject[]; links: LinkT[]; chart: Chart };

type Star = {
  id: string;
  n: number; // 星表編號
  x: number;
  y: number;
  a: number; // 從正上方順時針的角度（弧度）
  rho: number; // 離圓心的距離，外圈＝1
  subj: Subject;
  ch: Chapter;
  term: Term;
  color: string; // 網站上的課程色（面板用）
  ink: string; // 印在紙上的顏色
};

const IMG = "/img/stars/tenmon-bunya-1677";
const SWEEP = 18; // 觀測線轉一圈的秒數
const TAG: Record<string, string> = { geochemistry: "GEOCHEM", "structural-geology": "STRUCT", mineralogy: "MINERAL", "earth-materials": "EARTH-MAT" };
// 紙上用的墨色：比網站的課程色深，印在米色紙上才看得清楚
const INK: Record<string, string> = { geochemistry: "#b0401f", "structural-geology": "#136a64", mineralogy: "#5f3b7d", "earth-materials": "#4a6820" };
const PAPER = "#efe6d1";

function build(data: StarData) {
  const { cx, cy, edge } = data.chart;
  const stars: Star[] = [];
  let n = 0;
  for (const S of data.subjects)
    for (const ch of S.chapters)
      for (const t of ch.terms) {
        const a = (Math.atan2(t.x - cx, -(t.y - cy)) + 2 * Math.PI) % (2 * Math.PI);
        stars.push({
          id: `${S.id}/${ch.page}#${t.i}`,
          n: ++n,
          x: t.x,
          y: t.y,
          a,
          rho: Math.hypot(t.x - cx, t.y - cy) / edge,
          subj: S,
          ch,
          term: t,
          color: courseColor(S.id) ?? "var(--gold)",
          ink: INK[S.id] ?? "#7a5a10",
        });
      }
  return { stars, byId: new Map(stars.map((s) => [s.id, s])) };
}

const deg = (a: number) => `${((a * 180) / Math.PI).toFixed(1)}°`;
// 圓盤上角度 φ、半徑 r 的點（φ 從正上方順時針）
const polar = (cx: number, cy: number, r: number, f: number) => [cx + r * Math.sin(f), cy - r * Math.cos(f)] as const;

export default function StarMap({ data }: { data: StarData }) {
  const { chart } = data;
  const { size: W, h: H, cx, cy, edge } = chart;
  const { stars, byId } = useMemo(() => build(data), [data]);
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [u, setU] = useState(W / 900); // 圖上幾個單位＝螢幕 1px
  const paperRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLElement>(null);
  const A = picked ? byId.get(picked) : undefined;
  const Hv = hover && hover !== picked ? byId.get(hover) : undefined;

  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.clientWidth && setU(W / el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [W]);

  const adj = useMemo(() => {
    const m = new Map<string, { other: string; link: LinkT }[]>();
    for (const L of data.links) {
      if (!byId.has(L.a) || !byId.has(L.b)) continue;
      m.set(L.a, [...(m.get(L.a) ?? []), { other: L.b, link: L }]);
      m.set(L.b, [...(m.get(L.b) ?? []), { other: L.a, link: L }]);
    }
    return m;
  }, [data, byId]);

  const query = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!query) return [];
    const inName = stars.filter((s) => s.term.name.toLowerCase().includes(query));
    const inDesc = stars.filter((s) => !s.term.name.toLowerCase().includes(query) && s.term.desc.toLowerCase().includes(query));
    return [...inName, ...inDesc];
  }, [query, stars]);

  // 觀測線掃過時，被借來當名詞的星會閃一下（動畫延遲照角度排，跟掃描線同步）
  const sweep = useMemo(
    () => (
      <g aria-hidden>
        <g className="sm-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {Array.from({ length: 14 }, (_, i) => {
            const f0 = (-(i + 1) * 2 * Math.PI) / 180, f1 = (-i * 2 * Math.PI) / 180;
            const [x0, y0] = polar(cx, cy, edge, f0), [x1, y1] = polar(cx, cy, edge, f1);
            return <path key={i} d={`M${cx},${cy}L${x0},${y0}A${edge},${edge} 0 0 1 ${x1},${y1}Z`} style={{ opacity: 0.09 * (1 - i / 14) }} className="trail" />;
          })}
          <line x1={cx} y1={cy} x2={cx} y2={cy - edge} strokeWidth={1.3 * u} />
        </g>
        <g className="sm-blips">
          {stars.map((s) => (
            <circle key={s.id} cx={s.x} cy={s.y} r={7 * u} strokeWidth={1.2 * u} style={{ animationDelay: `${((s.a / (2 * Math.PI)) * SWEEP - SWEEP).toFixed(2)}s` }} />
          ))}
        </g>
      </g>
    ),
    [stars, cx, cy, edge, u],
  );

  const near = A ? adj.get(A.id) ?? [] : [];
  const pick = (id: string | null) => {
    setPicked(id);
    if (id && window.matchMedia("(max-width: 1100px)").matches) {
      window.setTimeout(() => hudRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
    }
  };
  // 螢幕座標 → 圖上座標，找最近的星
  const locate = (e: React.PointerEvent | React.MouseEvent) => {
    const r = (e.currentTarget as Element).getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
    let best: Star | undefined, bd = (18 * u) ** 2;
    for (const s of stars) {
      const d = (s.x - x) ** 2 + (s.y - y) ** 2;
      if (d < bd) [best, bd] = [s, d];
    }
    return { x, y, best };
  };
  const reveal = pt ? stars.filter((s) => (s.x - pt.x) ** 2 + (s.y - pt.y) ** 2 < (110 * u) ** 2) : [];
  const fs = (px: number) => ({ fontSize: px * u, strokeWidth: 4 * u });
  const ring = (s: Star, r: number, cls: string, color?: string) => (
    <circle key={`${cls}-${s.id}`} cx={s.x} cy={s.y} r={r * u} strokeWidth={1.4 * u} className={cls} style={color ? { stroke: color } : undefined} />
  );

  return (
    <div className="sm-wrap">
      <div className="sm-stage">
        <div className="sm-tools">
          <span className="font-mono-label">&gt; find</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="名詞，例如：糜稜岩、平衡、光" aria-label="搜尋名詞" />
          <span className="font-mono-label sm-count">{query ? `${hits.length} HIT` : `${stars.length} / ${chart.nPoints} OBJ`}</span>
        </div>
        {query && hits.length > 0 && (
          <ul className="sm-hits">
            {hits.slice(0, 10).map((h) => (
              <li key={h.id}>
                <button type="button" onClick={() => pick(h.id)} aria-pressed={picked === h.id}>
                  {h.term.name}
                  <span className="font-mono-label">{TAG[h.subj.id]} {h.ch.code}</span>
                </button>
              </li>
            ))}
            {hits.length > 10 && <li className="font-mono-label sm-more">+{hits.length - 10}</li>}
          </ul>
        )}

        <div className="sm-frame">
          <i className="c tl" />
          <i className="c tr" />
          <i className="c bl" />
          <i className="c br" />
          <div className="sm-box">
            <div className="sm-paper" ref={paperRef}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 底圖要和 SVG 疊在一起、尺寸固定 */}
              <img
                src={`${IMG}-2400.webp`}
                srcSet={`${IMG}-1200.webp 1200w, ${IMG}-2400.webp 2400w`}
                sizes="(max-width: 1100px) 100vw, 900px"
                width={W}
                height={H}
                alt={`${chart.title}（${chart.author}，${chart.year}）：圓形星圖，北極在中心，四周是二十八宿的分野`}
                draggable={false}
              />
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className={`sm-svg${A || query || focus ? " busy" : ""}`}
                role="img"
                aria-label="名詞放在古星圖的星點上；選一顆星，同一頁的名詞連成星座、跨科相關的名詞連線過來"
                onPointerMove={(e) => {
                  const { x, y, best } = locate(e);
                  setPt({ x, y });
                  setHover(best?.id ?? null);
                }}
                onPointerLeave={() => {
                  setPt(null);
                  setHover(null);
                }}
                onClick={(e) => pick(locate(e).best?.id ?? null)}
              >
                {sweep}
                <g className="sm-overlay">
                  {reveal.map((s) => ring(s, 7, "near"))}
                  {focus && stars.filter((s) => s.subj.id === focus).map((s) => ring(s, 8, "focus", s.ink))}
                  {hits.map((h) => ring(h, 11, "hitring"))}
                  {A && (
                    <g>
                      {(() => {
                        const [rx, ry] = polar(cx, cy, edge, A.a);
                        const right = rx >= cx;
                        return (
                          <g className="polar">
                            <line x1={cx} y1={cy} x2={rx} y2={ry} strokeWidth={1.1 * u} strokeDasharray={`${3 * u} ${5 * u}`} />
                            <circle cx={cx} cy={cy} r={A.rho * edge} strokeWidth={1.1 * u} strokeDasharray={`${3 * u} ${5 * u}`} />
                            <text x={rx + (right ? -8 : 8) * u} y={ry + (ry > cy ? -8 : 16) * u} textAnchor={right ? "end" : "start"} className="read" style={fs(10.5)}>
                              θ {deg(A.a)} · ρ {A.rho.toFixed(2)}
                            </text>
                          </g>
                        );
                      })()}
                      {A.ch.edges.map(([i, j]) => {
                        const p = A.ch.terms[i], r = A.ch.terms[j];
                        return <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={r.x} y2={r.y} className="con" strokeWidth={2 * u} style={{ stroke: A.ink }} />;
                      })}
                      {A.ch.terms.map((t) => (
                        <circle key={t.i} cx={t.x} cy={t.y} r={6 * u} strokeWidth={1.5 * u} className="sib" style={{ stroke: A.ink }} />
                      ))}
                      {near.map(({ other, link }) => {
                        const B = byId.get(other)!;
                        return (
                          <g key={other}>
                            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={`link ${link.kind}`} strokeWidth={2 * u} strokeDasharray={link.kind === "same" ? `${6 * u} ${5 * u}` : undefined} />
                            {ring(B, 9, "ring", B.ink)}
                            <text x={B.x + 13 * u} y={B.y + 4 * u} className="lab" style={fs(12)}>
                              {B.term.name}
                            </text>
                          </g>
                        );
                      })}
                      {ring(A, 12, "sel", A.ink)}
                      <circle cx={A.x} cy={A.y} r={12 * u} strokeWidth={1.5 * u} className="pulse" style={{ stroke: A.ink }} />
                      <path
                        d={[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `M${A.x + sx * 22 * u},${A.y + sy * 15 * u}v${sy * 7 * u}h${-sx * 7 * u}`).join("")}
                        className="bracket"
                        strokeWidth={1.6 * u}
                      />
                      <text x={A.x + 26 * u} y={A.y - 10 * u} className="lab cur" style={{ ...fs(14), fill: A.ink }}>
                        {A.term.name}
                      </text>
                    </g>
                  )}
                  {Hv && (
                    <g>
                      {ring(Hv, 9, "hov", Hv.ink)}
                      <text x={Hv.x + 12 * u} y={Hv.y - 9 * u} className="lab" style={fs(12)}>
                        {Hv.term.name}
                      </text>
                    </g>
                  )}
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="sm-foot font-mono-label">
          <span className="sm-legend">
            {data.subjects.map((S) => (
              <button
                key={S.id}
                type="button"
                style={{ ["--ink" as string]: INK[S.id] }}
                aria-pressed={focus === S.id}
                onMouseEnter={() => setFocus(S.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(S.id)}
                onBlur={() => setFocus(null)}
                onClick={() => setFocus((f) => (f === S.id ? null : S.id))}
              >
                <i /> {TAG[S.id] ?? S.id} <span>{S.chapters.reduce((a, c) => a + c.terms.length, 0)}</span>
              </button>
            ))}
          </span>
          <span>
            <i className="ln concept" /> 跨科概念 <i className="ln same" /> 同一個名詞
          </span>
        </div>
        <p className="sm-credit">
          底圖：{chart.author}〈{chart.title}〉，{chart.year} 年。{chart.credit}（
          <a href={chart.source} target="_blank" rel="noopener noreferrer">
            京都大学貴重資料デジタルアーカイブ
          </a>
          ）
        </p>
      </div>

      <aside className="sm-hud" aria-live="polite" ref={hudRef}>
        <i className="c tl" />
        <i className="c br" />
        {A ? (
          <div key={A.id} className="sm-swap">
            <p className="font-mono-label sm-cat">
              KS-{String(A.n).padStart(4, "0")} {"//"} θ {deg(A.a)} ρ {A.rho.toFixed(2)}
            </p>
            <div
              className="sm-zoom"
              style={{ backgroundImage: `url(${IMG}-2400.webp)`, backgroundSize: `${W}px ${H}px`, backgroundPosition: `calc(50% + ${W / 2 - A.x}px) calc(50% + ${H / 2 - A.y}px)` }}
              aria-hidden
            >
              <span className="font-mono-label">IMG {"//"} 紙上原樣 1:1</span>
            </div>
            <p className="font-mono-label sm-path" style={{ ["--c" as string]: A.color }}>
              <i /> {A.subj.name} {"//"} {A.ch.code} {A.ch.title}
            </p>
            <h2>{A.term.name}</h2>
            <p className="sm-desc">{A.term.desc}</p>
            {near.length > 0 ? (
              <>
                <p className="font-mono-label sm-sec">&gt; linked {near.length}</p>
                <ul className="sm-rel">
                  {near.map(({ other, link }) => {
                    const B = byId.get(other)!;
                    return (
                      <li key={other}>
                        <button type="button" onClick={() => pick(other)} style={{ ["--c" as string]: B.color }}>
                          <span className="font-mono-label">
                            {link.kind === "concept" ? "◆" : "◇"} {B.subj.name} {B.ch.code}
                          </span>
                          <b>{B.term.name}</b>
                          <span className="why">{link.why ?? "同一個名詞，另一門課也教過。"}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="font-mono-label sm-sec">&gt; linked 0 {"//"} 同一頁的名詞連成星座</p>
            )}
            <Link href={`${A.ch.url}#先認識的名詞`} className="sm-go font-mono-label">
              open {A.ch.page} →
            </Link>
          </div>
        ) : (
          <div className="sm-idle">
            <p className="font-mono-label sm-cat">&gt; sky.status</p>
            <p>
              這張是 {chart.year} 年保井（澀川）春海刻印的〈{chart.title}〉：他把中國的分野星圖改成日本版，四周的地名換成日本的國名。紙上 {chart.nPoints} 個星點裡，有 <b>{stars.length}</b> 個借來放筆記裡的名詞。
            </p>
            <p>觀測線掃過時會亮一下的就是名詞星。點一顆：同一頁筆記的名詞連成星座，其他課裡相關的名詞連線過來（共 <b>{data.links.length}</b> 條）。</p>
            <p className="font-mono-label sm-gen">updated {data.generated}</p>
          </div>
        )}
      </aside>

      <section className="sm-index">
        <h2 className="font-mono-label">&gt; catalog // 全部名詞</h2>
        {data.subjects.map((S) => (
          <details key={S.id}>
            <summary>
              <span className="font-mono-label">[{TAG[S.id] ?? S.id}]</span> {S.name}
              <span className="font-mono-label n">{S.chapters.reduce((a, c) => a + c.terms.length, 0)}</span>
            </summary>
            {S.chapters.map((ch) => (
              <p key={ch.page}>
                <Link href={`${ch.url}#先認識的名詞`} className="font-mono-label">
                  {ch.code}
                </Link>{" "}
                {ch.terms.map((t) => t.name).join("、")}
              </p>
            ))}
          </details>
        ))}
      </section>
    </div>
  );
}
