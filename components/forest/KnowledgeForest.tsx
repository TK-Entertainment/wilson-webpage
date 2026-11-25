"use client";

// 知識森林：一門課一棵樹、一頁筆記一根枝、一個名詞一片葉；跨科的線連起相關的名詞
// 資料由 scripts/forest-data.mjs 從各頁「先認識的名詞」表產生（forestData.json）
import Link from "next/link";
import { useMemo, useRef, useState, type ReactElement } from "react";
import { courseColor } from "@/utils/palette";

type Term = { i: number; name: string; desc: string };
type Chapter = { page: string; code: string; title: string; url: string; terms: Term[] };
type Subject = { id: string; name: string; chapters: Chapter[] };
type LinkT = { a: string; b: string; kind: "same" | "concept"; why?: string };
export type ForestData = { generated: string; subjects: Subject[]; links: LinkT[] };

type Leaf = { id: string; x: number; y: number; subj: Subject; ch: Chapter; term: Term; color: string };

const W = 1200, H = 790, GROUND = 726;
const GOLDEN = 2.39996; // 黃金角（弧度）：葉子像向日葵種子那樣排，不會重疊

function layout(data: ForestData) {
  const leaves: Leaf[] = [];
  const branches: ReactElement[] = [];
  const labels: ReactElement[] = [];
  const N = data.subjects.length;
  const MARGIN = 64; // 兩側留邊，最外側的枝名（例如「沉積岩（三）」）才不會被切掉
  const colW = (W - 2 * MARGIN) / N;
  data.subjects.forEach((S, s) => {
    const cx = MARGIN + colW * (s + 0.5);
    const color = courseColor(S.id) ?? "var(--gold)";
    const n = S.chapters.length;
    const trunkH = Math.min(560, 150 + n * 32);
    const top = GROUND - trunkH;
    // 樹幹：往上逐漸變細
    branches.push(
      <path key={`t${s}`} d={`M${cx - 3.2},${GROUND} L${cx - 1},${top} L${cx + 1},${top} L${cx + 3.2},${GROUND} Z`} className="kf-trunk" />,
    );
    S.chapters.forEach((ch, k) => {
      const side = k % 2 ? 1 : -1;
      const baseY = GROUND - 56 - ((k + 0.5) * (trunkH - 56)) / n;
      const th = ((58 - (18 * k) / Math.max(1, n - 1)) * Math.PI) / 180; // 和垂直線的夾角：下面的枝比較平
      const L = Math.min(colW / 2 - 36, 66 + 3.6 * ch.terms.length);
      const midX = cx + side * 0.55 * L * Math.sin(th), midY = baseY - 0.55 * L * Math.cos(th);
      const th2 = th - (16 * Math.PI) / 180; // 枝的後半段往上翹一點
      const tipX = midX + side * 0.45 * L * Math.sin(th2), tipY = midY - 0.45 * L * Math.cos(th2);
      branches.push(<polyline key={`b${s}-${k}`} points={`${cx},${baseY} ${midX},${midY} ${tipX},${tipY}`} className="kf-branch" />);
      let rmax = 0;
      ch.terms.forEach((t, i) => {
        const r = 6.2 * Math.sqrt(i + 0.6), a = i * GOLDEN;
        rmax = Math.max(rmax, r);
        leaves.push({ id: `${S.id}/${ch.page}#${t.i}`, x: tipX + r * Math.cos(a), y: tipY + r * Math.sin(a), subj: S, ch, term: t, color });
      });
      const lx = tipX + side * (rmax + 8), ly = tipY + 3;
      labels.push(
        <text key={`l${s}-${k}`} x={lx} y={ly} textAnchor={side > 0 ? "start" : "end"} className="kf-code">
          {ch.code}
        </text>,
      );
    });
    labels.push(
      <g key={`g${s}`}>
        <rect x={cx - 5} y={GROUND - 5} width={10} height={10} style={{ fill: color }} />
        <text x={cx} y={GROUND + 28} textAnchor="middle" className="kf-subj">{S.name}</text>
        <text x={cx} y={GROUND + 44} textAnchor="middle" className="kf-count">
          {S.chapters.length} CH {"//"} {S.chapters.reduce((a, c) => a + c.terms.length, 0)} TERMS
        </text>
      </g>,
    );
  });
  const byId = new Map(leaves.map((l) => [l.id, l]));
  return { leaves, branches, labels, byId };
}

const curve = (a: Leaf, b: Leaf) => {
  const cy = Math.max(12, Math.min(a.y, b.y) - 70 - 0.2 * Math.abs(a.x - b.x));
  return `M${a.x},${a.y} Q${(a.x + b.x) / 2},${cy} ${b.x},${b.y}`;
};

export default function KnowledgeForest({ data }: { data: ForestData }) {
  const { leaves, branches, labels, byId } = useMemo(() => layout(data), [data]);
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const active = hover ?? picked;
  const A = active ? byId.get(active) : undefined;

  // 每片葉子連到哪些葉子
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
  // 名稱符合的排前面，解釋裡提到的排後面
  const hits = useMemo(() => {
    if (!query) return [];
    const inName = leaves.filter((l) => l.term.name.toLowerCase().includes(query));
    const inDesc = leaves.filter((l) => !l.term.name.toLowerCase().includes(query) && l.term.desc.toLowerCase().includes(query));
    return [...inName, ...inDesc];
  }, [query, leaves]);
  const hitSet = useMemo(() => new Set(hits.map((h) => h.id)), [hits]);

  // 不會變的部分（樹、葉、所有連線）只算一次，滑鼠移動時不重畫
  const staticLayer = useMemo(
    () => (
      <g>
        <g className="kf-links">
          {data.links.map((L, k) => {
            const a = byId.get(L.a), b = byId.get(L.b);
            return a && b ? <path key={k} d={curve(a, b)} className={`kf-link ${L.kind}`} /> : null;
          })}
        </g>
        <g>{branches}</g>
        <g>
          {leaves.map((l) => (
            <g key={l.id} data-t={l.id} className={`kf-leaf${adj.has(l.id) ? " linked" : ""}`}>
              <circle cx={l.x} cy={l.y} r={6} className="hit" />
              <rect x={l.x - 3} y={l.y - 3} width={6} height={6} transform={`rotate(45 ${l.x} ${l.y})`} style={{ fill: l.color }} />
            </g>
          ))}
        </g>
        <g>{labels}</g>
        <line x1={0} x2={W} y1={GROUND} y2={GROUND} className="kf-ground" />
        {Array.from({ length: W / 20 + 1 }, (_, i) => (
          <line key={i} x1={i * 20} x2={i * 20} y1={GROUND} y2={GROUND + (i % 5 ? 4 : 9)} className="kf-tick" />
        ))}
      </g>
    ),
    [data, byId, branches, labels, leaves, adj],
  );

  const near = A ? adj.get(A.id) ?? [] : [];
  const hudRef = useRef<HTMLElement>(null);
  const pick = (id: string | null) => {
    setPicked(id);
    setHover(null);
    // 窄螢幕的說明面板在森林下面：點了葉子就捲過去，不然看不到
    if (id && window.matchMedia("(max-width: 1100px)").matches) {
      window.setTimeout(() => hudRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
    }
  };

  return (
    <div className="kf-wrap">
      <div className="kf-stage">
        <div className="kf-tools">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="找名詞，例如：糜稜岩、平衡、光"
            aria-label="搜尋名詞"
          />
          <span className="font-mono-label">
            {query ? `${hits.length} HITS` : `${leaves.length} LEAVES // ${data.links.length} LINKS`}
          </span>
        </div>
        {query && hits.length > 0 && (
          <ul className="kf-hits">
            {hits.slice(0, 12).map((h) => (
              <li key={h.id}>
                <button type="button" onClick={() => pick(h.id)} style={{ ["--c" as string]: h.color }}>
                  {h.term.name}
                  <span className="font-mono-label">{h.ch.code}</span>
                </button>
              </li>
            ))}
            {hits.length > 12 && <li className="font-mono-label kf-more">＋{hits.length - 12}</li>}
          </ul>
        )}
        <div className="kf-svgbox">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="知識森林：四門課的名詞長成四棵樹，跨科相關的名詞用線連起來"
            className={`kf-svg${query ? " searching" : ""}${active ? " focusing" : ""}`}
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
            {staticLayer}
            {/* 會變的部分：搜尋結果、目前的葉子和它的連線 */}
            <g className="kf-overlay">
              {hits.map((h) => (
                <circle key={h.id} cx={h.x} cy={h.y} r={7.5} className="kf-hitring" />
              ))}
              {A &&
                near.map(({ other, link }, k) => {
                  const B = byId.get(other)!;
                  return (
                    <g key={k}>
                      <path d={curve(A, B)} className={`kf-link on ${link.kind}`} />
                      <circle cx={B.x} cy={B.y} r={8} className="kf-near" />
                    </g>
                  );
                })}
              {A && <circle cx={A.x} cy={A.y} r={10} className="kf-cur" />}
            </g>
          </svg>
        </div>
        <p className="kf-legend font-mono-label">
          <span className="sw concept" /> 跨科的相關概念（附說明）
          <span className="sw same" /> 不同科出現同一個名詞
          <span className="ring" /> 有連線的葉子
        </p>
      </div>

      <aside className="kf-hud" aria-live="polite" ref={hudRef}>
        {A ? (
          <div key={A.id} className="kf-swap">
            <p className="font-mono-label kf-path" style={{ ["--c" as string]: A.color }}>
              <i /> {A.subj.name} {"//"} {A.ch.code}
            </p>
            <h2>{A.term.name}</h2>
            <p className="kf-desc">{A.term.desc}</p>
            <p className="font-mono-label kf-from">{A.ch.title}</p>
            {near.length > 0 && (
              <ul className="kf-rel">
                {near.map(({ other, link }) => {
                  const B = byId.get(other)!;
                  return (
                    <li key={other}>
                      <button type="button" onClick={() => pick(other)} style={{ ["--c" as string]: B.color }}>
                        <span className="font-mono-label">↔ {B.subj.name} {B.ch.code}</span>
                        <b>{B.term.name}</b>
                        {link.why ? <span className="why">{link.why}</span> : <span className="why">同一個名詞，另一門課也教過。</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <Link href={`${A.ch.url}#先認識的名詞`} className="kf-go font-mono-label">
              打開這一頁筆記 →
            </Link>
          </div>
        ) : (
          <div className="kf-idle">
            <p className="font-mono-label">&gt; forest.status</p>
            <p>
              <b>{data.subjects.length}</b> 棵樹、<b>{data.subjects.reduce((a, s) => a + s.chapters.length, 0)}</b> 根枝、
              <b>{leaves.length}</b> 片葉、<b>{data.links.length}</b> 條跨科連線。
            </p>
            <p>滑過一片葉子看名詞；點一下鎖定，右邊會列出它連到的其他課。外圈有亮環的葉子有連線。</p>
            <p className="font-mono-label kf-gen">updated {data.generated}</p>
          </div>
        )}
      </aside>

      <section className="kf-index">
        <h2 className="font-mono-label">INDEX {"//"} 全部名詞</h2>
        {data.subjects.map((S) => (
          <details key={S.id} style={{ ["--c" as string]: courseColor(S.id) ?? "var(--gold)" }}>
            <summary>
              <i /> {S.name}
              <span className="font-mono-label">{S.chapters.reduce((a, c) => a + c.terms.length, 0)}</span>
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
