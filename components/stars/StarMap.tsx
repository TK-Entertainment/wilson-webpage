"use client";

// 知識星圖：星的排列照真的古星圖（保井春海〈天文分野之圖〉1677）——北極在中心，越往外越南。
// 圖上 1007 顆星裡，470 顆借來放筆記的名詞：一門課占一個方位，一頁筆記是一群相鄰的星。
// 不放掃描圖，只用星的位置；平常全是灰白的星點，選取時才上色（網站風格：科技、日式、雜訊）。
// 資料：scripts/stars-chart.py 找星點 → scripts/stars-data.mjs 分配名詞（starData.json）
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { courseColor } from "@/utils/palette";

type Term = { i: number; name: string; desc: string; x: number; y: number; r: number };
type Chapter = { page: string; code: string; title: string; url: string; terms: Term[]; edges: number[][] }; // edges：星座的線，用名詞的 i 表示
type Subject = { id: string; name: string; chapters: Chapter[] };
type LinkT = { a: string; b: string; kind: "same" | "concept"; why?: string };
type Chart = {
  title: string;
  author: string;
  year: number;
  credit: string;
  source: string;
  cx: number;
  cy: number;
  edge: number;
  nPoints: number;
  bg: number[][]; // 沒放名詞的星點 [x, y, 墨點大小]
};
export type StarData = { generated: string; subjects: Subject[]; links: LinkT[]; chart: Chart };

type Star = {
  id: string;
  n: number; // 星表編號
  x: number;
  y: number;
  r: number; // 古星圖上墨點的大小
  a: number; // 從正上方順時針的角度（弧度）
  rho: number; // 離北極的距離，外圈＝1
  subj: Subject;
  ch: Chapter;
  term: Term;
  color: string;
};

const SWEEP = 18; // 觀測線轉一圈的秒數
const TAG: Record<string, string> = { geochemistry: "GEOCHEM", "structural-geology": "STRUCT", mineralogy: "MINERAL", "earth-materials": "EARTH-MAT" };
// 古星圖外圈的十二支（子在上、卯在左、午在下、酉在右）
const BRANCH = ["子", "亥", "戌", "酉", "申", "未", "午", "巳", "辰", "卯", "寅", "丑"];

function build(data: StarData) {
  const { cx, cy, edge } = data.chart;
  const stars: Star[] = [];
  let n = 0;
  for (const S of data.subjects)
    for (const ch of S.chapters)
      for (const t of ch.terms)
        stars.push({
          id: `${S.id}/${ch.page}#${t.i}`,
          n: ++n,
          x: t.x,
          y: t.y,
          r: t.r,
          a: (Math.atan2(t.x - cx, -(t.y - cy)) + 2 * Math.PI) % (2 * Math.PI),
          rho: Math.hypot(t.x - cx, t.y - cy) / edge,
          subj: S,
          ch,
          term: t,
          color: courseColor(S.id) ?? "var(--gold)",
        });
  return { stars, byId: new Map(stars.map((s) => [s.id, s])) };
}

const deg = (a: number) => `${((a * 180) / Math.PI).toFixed(1)}°`;
// 圓盤上角度 f（從正上方順時針）、半徑 r 的點
const polar = (cx: number, cy: number, r: number, f: number) => [cx + r * Math.sin(f), cy - r * Math.cos(f)] as const;
const arcTo = (cx: number, cy: number, r: number, f0: number, f1: number) => {
  const [x1, y1] = polar(cx, cy, r, f1);
  return `A${r},${r} 0 ${f1 - f0 > Math.PI ? 1 : 0} 1 ${x1},${y1}`;
};
const arc = (cx: number, cy: number, r: number, f0: number, f1: number) => `M${polar(cx, cy, r, f0).join(",")}${arcTo(cx, cy, r, f0, f1)}`;
const sparkle = (x: number, y: number, r: number) =>
  `M${x},${y - r}L${x + r * 0.22},${y - r * 0.22}L${x + r},${y}L${x + r * 0.22},${y + r * 0.22}L${x},${y + r}L${x - r * 0.22},${y + r * 0.22}L${x - r},${y}L${x - r * 0.22},${y - r * 0.22}Z`;

export default function StarMap({ data }: { data: StarData }) {
  const { chart } = data;
  const { cx, cy, edge } = chart;
  const R = edge * 1.16; // 畫面半徑：外圈再留刻度和十二支的位置
  const VB = `${cx - R} ${cy - R} ${2 * R} ${2 * R}`;
  const { stars, byId } = useMemo(() => build(data), [data]);
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [u, setU] = useState((2 * R) / 900); // 圖上幾個單位＝螢幕 1px
  const boxRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLElement>(null);
  const A = picked ? byId.get(picked) : undefined;
  const Hv = hover && hover !== picked ? byId.get(hover) : undefined;

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.clientWidth && setU((2 * R) / el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [R]);

  const adj = useMemo(() => {
    const m = new Map<string, { other: string; link: LinkT }[]>();
    for (const L of data.links) {
      if (!byId.has(L.a) || !byId.has(L.b)) continue;
      m.set(L.a, [...(m.get(L.a) ?? []), { other: L.b, link: L }]);
      m.set(L.b, [...(m.get(L.b) ?? []), { other: L.a, link: L }]);
    }
    return m;
  }, [data, byId]);

  // 每門課占的方位（給圖例和選取時的外圈弧線）
  const sectors = useMemo(
    () =>
      new Map(
        data.subjects.map((S) => {
          const as = stars.filter((s) => s.subj === S).map((s) => s.a);
          return [S.id, [Math.min(...as), Math.max(...as)] as const];
        }),
      ),
    [data, stars],
  );

  const query = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!query) return [];
    const inName = stars.filter((s) => s.term.name.toLowerCase().includes(query));
    const inDesc = stars.filter((s) => !s.term.name.toLowerCase().includes(query) && s.term.desc.toLowerCase().includes(query));
    return [...inName, ...inDesc];
  }, [query, stars]);

  // 星點大小照古星圖上墨點的大小；畫面小（手機）時跟著縮，才不會擠成一團
  const sc = Math.min(1, Math.max(0.55, (2 * R) / u / 900));
  const dot = (r: number) => (0.55 + 0.2 * r) * u * sc;
  // 外圈文字離圓多遠：手機上 u 很大，要限制在畫面裡
  const out = (px: number) => Math.min(px * u, (px / 24) * 0.085 * edge);
  // 不會變的部分：同心圓、方位線、刻度、十二支、所有的星
  const sky = useMemo(() => {
    const d = (r: number) => (0.55 + 0.2 * r) * u * sc;
    const lab = Math.min(24 * u, 0.085 * edge);
    return (
      <g>
        <g className="sm-grid">
          {[0.25, 0.5, 0.75].map((k) => (
            <circle key={k} cx={cx} cy={cy} r={k * edge} strokeWidth={u} />
          ))}
          {BRANCH.map((_, i) => {
            const [x0, y0] = polar(cx, cy, edge * 0.08, (i * Math.PI) / 6), [x1, y1] = polar(cx, cy, edge, (i * Math.PI) / 6);
            return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} strokeWidth={u} />;
          })}
        </g>
        <g className="sm-ticks">
          <circle cx={cx} cy={cy} r={edge} strokeWidth={1.2 * u} />
          {Array.from({ length: 72 }, (_, i) => {
            const f = (i * Math.PI) / 36, L = i % 6 ? 5 : 11;
            const [x0, y0] = polar(cx, cy, edge, f), [x1, y1] = polar(cx, cy, edge + L * u, f);
            return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} strokeWidth={u} />;
          })}
          {BRANCH.map((b, i) => {
            const [x, y] = polar(cx, cy, edge + lab, (i * Math.PI) / 6);
            return (
              <text key={b} x={x} y={y} dy="0.35em" textAnchor="middle" style={{ fontSize: Math.min(12 * u, 0.06 * edge) }}>
                {b}
              </text>
            );
          })}
        </g>
        <g className="sm-bg">
          {chart.bg.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={d(r)} />
          ))}
        </g>
        <g>
          {stars.map((s) =>
            adj.has(s.id) ? (
              <path key={s.id} d={sparkle(s.x, s.y, d(s.r) * 2.4)} className="sm-star linked" />
            ) : (
              <circle key={s.id} cx={s.x} cy={s.y} r={d(s.r) + 0.3 * u} className="sm-star" />
            ),
          )}
        </g>
      </g>
    );
  }, [chart, stars, adj, u, sc, cx, cy, edge]);

  // 觀測線繞北極轉；掃過時名詞星閃一下（動畫延遲照角度排，和掃描線同步）
  const sweep = useMemo(
    () => (
      <g aria-hidden>
        <g className="sm-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          {Array.from({ length: 14 }, (_, i) => {
            const f0 = (-(i + 1) * 2 * Math.PI) / 180, f1 = (-i * 2 * Math.PI) / 180;
            return <path key={i} d={`M${cx},${cy}L${polar(cx, cy, edge, f0).join(",")}${arcTo(cx, cy, edge, f0, f1)}Z`} style={{ opacity: 0.07 * (1 - i / 14) }} className="trail" />;
          })}
          <line x1={cx} y1={cy} x2={cx} y2={cy - edge} strokeWidth={1.2 * u} />
        </g>
        <g className="sm-blips">
          {stars.map((s) => (
            <circle key={s.id} cx={s.x} cy={s.y} r={6 * u * sc} strokeWidth={1.1 * u} style={{ animationDelay: `${((s.a / (2 * Math.PI)) * SWEEP - SWEEP).toFixed(2)}s` }} />
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
  // 螢幕座標 → 圖上座標，找最近的名詞星
  const locate = (e: React.PointerEvent | React.MouseEvent) => {
    const b = (e.currentTarget as Element).getBoundingClientRect();
    const x = cx - R + ((e.clientX - b.left) / b.width) * 2 * R, y = cy - R + ((e.clientY - b.top) / b.height) * 2 * R;
    let best: Star | undefined, bd = (16 * u) ** 2;
    for (const s of stars) {
      const dd = (s.x - x) ** 2 + (s.y - y) ** 2;
      if (dd < bd) [best, bd] = [s, dd];
    }
    return { x, y, best };
  };
  const reveal = pt ? stars.filter((s) => (s.x - pt.x) ** 2 + (s.y - pt.y) ** 2 < (90 * u) ** 2) : [];
  const fs = (px: number) => ({ fontSize: px * u, strokeWidth: 3.5 * u });
  const ring = (s: Star, r: number, cls: string, color?: string) => (
    <circle key={`${cls}-${s.id}`} cx={s.x} cy={s.y} r={r * u} strokeWidth={1.2 * u} className={cls} style={color ? { stroke: color } : undefined} />
  );
  // 一門課占的方位：外圈一段弧線＋標籤
  const sectorArc = (S: Subject) => {
    const [a0, a1] = sectors.get(S.id)!;
    const [tx, ty] = polar(cx, cy, edge + out(44), (a0 + a1) / 2);
    return (
      <g key={`sec-${S.id}`} className="sector" style={{ ["--c" as string]: courseColor(S.id) }}>
        <path d={arc(cx, cy, edge + out(8), a0 - 0.03, a1 + 0.03)} strokeWidth={2 * u} />
        <text x={tx} y={ty} dy="0.35em" textAnchor="middle" style={fs(10)}>
          [{TAG[S.id] ?? S.id}]
        </text>
      </g>
    );
  };
  const focusS = focus ? data.subjects.find((x) => x.id === focus) : undefined;

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
          <div className="sm-box" ref={boxRef}>
            <svg
              viewBox={VB}
              className={`sm-svg${A || query || focus ? " busy" : ""}`}
              role="img"
              aria-label={`知識星圖：星的排列照 ${chart.year} 年的〈${chart.title}〉，北極在中心；選一顆星，同一頁的名詞連成星座、跨科相關的名詞連線過來`}
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
              {sky}
              {sweep}
              <g className="sm-overlay">
                {reveal.map((s) => ring(s, 6, "near"))}
                {focusS && (
                  <g>
                    {sectorArc(focusS)}
                    {stars.filter((s) => s.subj === focusS).map((s) => ring(s, 6, "focus", s.color))}
                  </g>
                )}
                {hits.map((h) => ring(h, 9, "hitring"))}
                {A && (
                  <g>
                    {(() => {
                      const [rx, ry] = polar(cx, cy, edge, A.a);
                      const right = rx >= cx;
                      return (
                        <g className="polar">
                          <line x1={cx} y1={cy} x2={rx} y2={ry} strokeWidth={u} strokeDasharray={`${2 * u} ${4 * u}`} />
                          <circle cx={cx} cy={cy} r={A.rho * edge} strokeWidth={u} strokeDasharray={`${2 * u} ${4 * u}`} />
                          <text x={rx + (right ? -8 : 8) * u} y={ry + (ry > cy ? -8 : 16) * u} textAnchor={right ? "end" : "start"} className="read" style={fs(10)}>
                            θ {deg(A.a)} · ρ {A.rho.toFixed(2)}
                          </text>
                        </g>
                      );
                    })()}
                    {focusS !== A.subj && sectorArc(A.subj)}
                    {A.ch.edges.map(([i, j]) => {
                      const p = A.ch.terms[i], r = A.ch.terms[j];
                      return <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={r.x} y2={r.y} className="con" strokeWidth={1.3 * u} style={{ stroke: A.color }} />;
                    })}
                    {A.ch.terms.map((t) => (
                      <circle key={t.i} cx={t.x} cy={t.y} r={dot(t.r) + 0.8 * u} style={{ fill: A.color }} />
                    ))}
                    {near.map(({ other, link }) => {
                      const B = byId.get(other)!;
                      return (
                        <g key={other}>
                          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={`link ${link.kind}`} strokeWidth={1.4 * u} strokeDasharray={link.kind === "same" ? `${4 * u} ${3 * u}` : undefined} />
                          <circle cx={B.x} cy={B.y} r={dot(B.r) + u} style={{ fill: B.color }} />
                          {ring(B, 8, "ring")}
                          <text x={B.x + 11 * u} y={B.y + 4 * u} className="lab" style={fs(12)}>
                            {B.term.name}
                          </text>
                        </g>
                      );
                    })}
                    <circle cx={A.x} cy={A.y} r={dot(A.r) + 1.5 * u} style={{ fill: A.color }} />
                    <circle cx={A.x} cy={A.y} r={12 * u} strokeWidth={1.5 * u} className="pulse" />
                    <path
                      d={[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `M${A.x + sx * 20 * u},${A.y + sy * 13 * u}v${sy * 7 * u}h${-sx * 7 * u}`).join("")}
                      className="bracket"
                      strokeWidth={1.5 * u}
                    />
                    <text x={A.x + 24 * u} y={A.y - 10 * u} className="lab cur" style={fs(13.5)}>
                      {A.term.name}
                    </text>
                  </g>
                )}
                {Hv && (
                  <g>
                    {ring(Hv, 7, "hov")}
                    <text x={Hv.x + 10 * u} y={Hv.y - 8 * u} className="lab" style={fs(12)}>
                      {Hv.term.name}
                    </text>
                  </g>
                )}
              </g>
            </svg>
          </div>
        </div>
        <div className="sm-foot font-mono-label">
          <span className="sm-legend">
            {data.subjects.map((S) => (
              <button
                key={S.id}
                type="button"
                style={{ ["--c" as string]: courseColor(S.id) }}
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
            <i className="ln concept" /> 跨科概念 <i className="ln same" /> 同一個名詞 <i className="sp" /> 有連線的星
          </span>
        </div>
        <p className="sm-credit">
          星的位置取自{chart.author}〈{chart.title}〉（{chart.year}），{chart.credit}（
          <a href={chart.source} target="_blank" rel="noopener noreferrer">
            京都大学貴重資料デジタルアーカイブ
          </a>
          ）。
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
              星的排列照 {chart.year} 年的〈{chart.title}〉：北極在中心，越往外越南，外圈是十二支方位。圖上 {chart.nPoints} 顆星裡，<b>{stars.length}</b> 顆放了筆記的名詞，一門課占一個方位。
            </p>
            <p>觀測線掃過時會亮一下的就是名詞星。點一顆：同一頁筆記的名詞連成星座，其他課裡相關的名詞連線過來（共 <b>{data.links.length}</b> 條）。帶光芒的星有跨科連線。</p>
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
