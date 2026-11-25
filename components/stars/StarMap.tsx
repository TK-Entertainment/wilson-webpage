"use client";

// 知識星圖：一個名詞一顆星，同一門課聚成一團星雲，同一頁筆記是星雲裡的一小群；
// 選一顆星，同一頁的名詞連成淡淡的星座，跨科相關的名詞用金線連起來。
// 平常全是灰白的星點，只有選取時才上色（網站風格：科技、日式、雜訊）。
// 資料由 scripts/stars-data.mjs 從各頁「先認識的名詞」表產生（starData.json）
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { courseColor } from "@/utils/palette";

type Term = { i: number; name: string; desc: string };
type Chapter = { page: string; code: string; title: string; url: string; terms: Term[] };
type Subject = { id: string; name: string; chapters: Chapter[] };
type LinkT = { a: string; b: string; kind: "same" | "concept"; why?: string };
export type StarData = { generated: string; subjects: Subject[]; links: LinkT[] };

type Star = {
  id: string;
  n: number; // 星表編號
  x: number;
  y: number;
  mag: number; // 0–1，越大越亮
  subj: Subject;
  si: number;
  ch: Chapter;
  term: Term;
  color: string;
};

const W = 1200, H = 720;
const GOLDEN = 2.39996;
const TAG: Record<string, string> = { geochemistry: "GEOCHEM", "structural-geology": "STRUCT", mineralogy: "MINERAL", "earth-materials": "EARTH-MAT" };
// 星雲中心：左右排開、上下錯落
const CENTERS = [
  [175, 330],
  [462, 395],
  [742, 315],
  [1022, 390],
];

// 由字串算出 0–1 的固定亂數：每次畫出來的星空都一樣
function hash(s: string, k = 0) {
  let h = 2166136261 ^ k;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return ((h >>> 0) % 100000) / 100000;
}

function layout(data: StarData) {
  const stars: Star[] = [];
  let n = 0;
  data.subjects.forEach((S, si) => {
    const total = S.chapters.reduce((a, c) => a + c.terms.length, 0);
    const R = 44 + 10 * Math.sqrt(total);
    const [cx, cy] = CENTERS[si % CENTERS.length];
    const color = courseColor(S.id) ?? "var(--gold)";
    S.chapters.forEach((ch, k) => {
      const a = k * GOLDEN + si;
      const rr = R * 0.78 * Math.sqrt((k + 0.5) / S.chapters.length);
      const gx = cx + rr * Math.cos(a), gy = cy + rr * Math.sin(a);
      ch.terms.forEach((t) => {
        const id = `${S.id}/${ch.page}#${t.i}`;
        const r = 5 + 23 * Math.sqrt(hash(id, 1)), th = 2 * Math.PI * hash(id, 2);
        stars.push({ id, n: ++n, x: gx + r * Math.cos(th), y: gy + r * Math.sin(th), mag: hash(id, 3), subj: S, si, ch, term: t, color });
      });
    });
  });
  return { stars, byId: new Map(stars.map((s) => [s.id, s])) };
}

// 假的天球座標：讓讀數看起來像觀測儀器（x → 赤經、y → 赤緯）
const ra = (x: number) => {
  const h = (x / W) * 24;
  return `${String(Math.floor(h)).padStart(2, "0")}h${String(Math.floor((h % 1) * 60)).padStart(2, "0")}m`;
};
const dec = (y: number) => {
  const d = 60 - (y / H) * 120;
  return `${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(1)}°`;
};
const sparkle = (x: number, y: number, r: number) =>
  `M${x},${y - r}L${x + r * 0.22},${y - r * 0.22}L${x + r},${y}L${x + r * 0.22},${y + r * 0.22}L${x},${y + r}L${x - r * 0.22},${y + r * 0.22}L${x - r},${y}L${x - r * 0.22},${y - r * 0.22}Z`;

export default function StarMap({ data }: { data: StarData }) {
  const { stars, byId } = useMemo(() => layout(data), [data]);
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const hudRef = useRef<HTMLElement>(null);
  const A = picked ? byId.get(picked) : undefined;
  const Hv = hover && hover !== picked ? byId.get(hover) : undefined;

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

  // 不會變的部分：格線、刻度、星點、星雲標籤
  const sky = useMemo(
    () => (
      <g>
        <g className="sm-grid">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 100} x2={(i + 1) * 100} y1={0} y2={H} />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`h${i}`} x1={0} x2={W} y1={(i + 1) * 100} y2={(i + 1) * 100} />
          ))}
        </g>
        <g className="sm-ticks">
          {Array.from({ length: 61 }, (_, i) => (
            <line key={`t${i}`} x1={i * 20} x2={i * 20} y1={0} y2={i % 5 ? 4 : 9} />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <text key={`r${i}`} x={i * 100 + 4} y={20}>
              {String(i * 2).padStart(2, "0")}h
            </text>
          ))}
          {Array.from({ length: 37 }, (_, i) => (
            <line key={`s${i}`} x1={0} x2={i % 5 ? 4 : 9} y1={i * 20} y2={i * 20} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <text key={`d${i}`} x={13} y={i * 100 + 4} className="dec">
              {i === 0 ? "" : `${60 - i * 20 >= 0 ? "+" : "−"}${Math.abs(60 - i * 20)}°`}
            </text>
          ))}
        </g>
        <g>
          {stars.map((s) => {
            const linked = adj.has(s.id);
            const r = 0.9 + 1.5 * s.mag + (linked ? 0.5 : 0);
            return (
              <g key={s.id} data-t={s.id} className={`sm-star${linked ? " linked" : ""}${s.mag > 0.82 ? " tw" : ""}`} style={{ ["--d" as string]: `${(s.mag * 7).toFixed(2)}s`, opacity: 0.38 + 0.55 * s.mag }}>
                <circle cx={s.x} cy={s.y} r={7} className="hit" />
                {linked ? <path d={sparkle(s.x, s.y, r * 2.3)} className="dot" /> : <circle cx={s.x} cy={s.y} r={r} className="dot" />}
              </g>
            );
          })}
        </g>
        <g className="sm-tags">
          {data.subjects.map((S, si) => {
            const total = S.chapters.reduce((a, c) => a + c.terms.length, 0);
            const R = 44 + 10 * Math.sqrt(total);
            const [cx, cy] = CENTERS[si % CENTERS.length];
            return (
              <g key={S.id}>
                <text x={cx} y={cy + R * 0.78 + 46} textAnchor="middle" className="tag">
                  [{TAG[S.id] ?? S.id.toUpperCase()}]
                </text>
                <text x={cx} y={cy + R * 0.78 + 62} textAnchor="middle" className="sub">
                  {S.name} {"//"} {total}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    ),
    [data, stars, adj],
  );

  // 同一頁的名詞連成星座：依繞中心的角度排序後連起來
  const constellation = (s: Star) => {
    const sib = stars.filter((x) => x.ch === s.ch);
    const mx = sib.reduce((a, x) => a + x.x, 0) / sib.length, my = sib.reduce((a, x) => a + x.y, 0) / sib.length;
    const ord = [...sib].sort((p, q2) => Math.atan2(p.y - my, p.x - mx) - Math.atan2(q2.y - my, q2.x - mx));
    return { sib, d: ord.map((x, i) => `${i ? "L" : "M"}${x.x},${x.y}`).join("") + "Z" };
  };
  const near = A ? adj.get(A.id) ?? [] : [];

  const pick = (id: string | null) => {
    setPicked(id);
    if (id && window.matchMedia("(max-width: 1100px)").matches) {
      window.setTimeout(() => hudRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
    }
  };

  return (
    <div className="sm-wrap">
      <div className="sm-stage">
        <div className="sm-tools">
          <span className="font-mono-label">&gt; find</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="名詞，例如：糜稜岩、平衡、光" aria-label="搜尋名詞" />
          <span className="font-mono-label sm-count">{query ? `${hits.length} HIT` : `${stars.length} OBJ // ${data.links.length} LINK`}</span>
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
            <svg
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label="知識星圖：四門課的名詞散成星點，相關的名詞連成星座"
              className={`sm-svg${A || query ? " dim" : ""}`}
              onPointerOver={(e) => {
                const g = (e.target as Element).closest("[data-t]");
                setHover(g ? g.getAttribute("data-t") : null);
              }}
              onPointerLeave={() => setHover(null)}
              onClick={(e) => {
                const g = (e.target as Element).closest("[data-t]");
                pick(g ? g.getAttribute("data-t") : null);
              }}
            >
              {sky}
              <defs>
                <linearGradient id="sm-scan-g" x1="0" x2="1">
                  <stop offset="0" stopColor="#4cb8b0" stopOpacity="0" />
                  <stop offset="1" stopColor="#4cb8b0" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <g className="sm-scan">
                <rect x={-90} y={0} width={90} height={H} fill="url(#sm-scan-g)" />
                <line x1={0} x2={0} y1={0} y2={H} />
              </g>
              <g className="sm-overlay">
                {hits.map((h) => (
                  <circle key={h.id} cx={h.x} cy={h.y} r={6} className="hitring" />
                ))}
                {A &&
                  (() => {
                    const { sib, d } = constellation(A);
                    return (
                      <g>
                        <line x1={0} x2={W} y1={A.y} y2={A.y} className="cross" />
                        <line x1={A.x} x2={A.x} y1={0} y2={H} className="cross" />
                        <text x={A.x + 6} y={36} className="read">RA {ra(A.x)}</text>
                        <text x={W - 6} y={A.y - 6} textAnchor="end" className="read">DEC {dec(A.y)}</text>
                        <path d={d} className="con" />
                        {sib.map((s) => (
                          <circle key={s.id} cx={s.x} cy={s.y} r={1.9} style={{ fill: A.color }} />
                        ))}
                        {near.map(({ other, link }) => {
                          const B = byId.get(other)!;
                          return (
                            <g key={other}>
                              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={`link ${link.kind}`} />
                              <circle cx={B.x} cy={B.y} r={3.2} style={{ fill: B.color }} />
                              <circle cx={B.x} cy={B.y} r={8} className="ring" />
                              <text x={B.x + 11} y={B.y + 4} className="lab">{B.term.name}</text>
                            </g>
                          );
                        })}
                        <circle cx={A.x} cy={A.y} r={4} style={{ fill: A.color }} />
                        <circle cx={A.x} cy={A.y} r={12} className="pulse" />
                        <path d={`M${A.x - 20},${A.y - 20}h7M${A.x - 20},${A.y - 20}v7M${A.x + 20},${A.y - 20}h-7M${A.x + 20},${A.y - 20}v7M${A.x - 20},${A.y + 20}h7M${A.x - 20},${A.y + 20}v-7M${A.x + 20},${A.y + 20}h-7M${A.x + 20},${A.y + 20}v-7`} className="bracket" />
                        <text x={A.x + 24} y={A.y - 10} className="lab cur">{A.term.name}</text>
                      </g>
                    );
                  })()}
                {Hv && (
                  <g>
                    <circle cx={Hv.x} cy={Hv.y} r={7} className="hov" />
                    <text x={Hv.x + 10} y={Hv.y - 8} className="lab">{Hv.term.name}</text>
                  </g>
                )}
              </g>
            </svg>
          </div>
          <p className="sm-foot font-mono-label">
            <span>OBS // KNOWLEDGE SKY</span>
            <span>
              <i className="ln concept" /> 跨科概念 <i className="ln same" /> 同一個名詞 <i className="sp" /> 有連線的星
            </span>
          </p>
        </div>
      </div>

      <aside className="sm-hud" aria-live="polite" ref={hudRef}>
        <i className="c tl" />
        <i className="c br" />
        {A ? (
          <div key={A.id} className="sm-swap">
            <p className="font-mono-label sm-cat">
              KS-{String(A.n).padStart(4, "0")} {"//"} RA {ra(A.x)} DEC {dec(A.y)}
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
              <p className="font-mono-label sm-sec">&gt; linked 0 // 同一頁的名詞連成星座</p>
            )}
            <Link href={`${A.ch.url}#先認識的名詞`} className="sm-go font-mono-label">
              open {A.ch.page} →
            </Link>
          </div>
        ) : (
          <div className="sm-idle">
            <p className="font-mono-label sm-cat">&gt; sky.status</p>
            <p>
              {data.subjects.length} 團星雲、<b>{stars.length}</b> 顆星、<b>{data.links.length}</b> 條跨科連線。
            </p>
            <p>點一顆星：同一頁筆記的名詞連成星座，其他課裡相關的名詞用金線連過來。帶光芒的星有跨科連線。</p>
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
