"use client";

import { useState, type ReactElement } from "react";
import { Fig } from "./Figs";
import "./notes.css";

// 2026-11 新增章節的自繪圖與互動圖：地化 L8–L9、地球構造 Ch11–12、地球物質岩石學 1
const INK = "currentColor";
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", violet: "#8a6fd1", blue: "#5b8bd9", sage: "var(--sage)" };
const fmt = (x: number, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const halo = { paintOrder: "stroke" as const, stroke: "hsl(var(--card))", strokeWidth: 3 };

function Marks() {
  return (
    <defs>
      {[
        ["nv-k", "currentColor"],
        ["nv-o", C.orange],
        ["nv-t", C.teal],
        ["nv-r", C.rose],
        ["nv-b", C.blue],
        ["nv-v", C.violet],
      ].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

function Axes({ W, H, L, R, T, B, xl, yl }: { W: number; H: number; L: number; R: number; T: number; B: number; xl: string; yl: string }) {
  return (
    <g>
      <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
      <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
      <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12 }}>{xl}</text>
      <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>{yl}</text>
    </g>
  );
}

/* ═════════════ 地化 L8：衰變方式在核種表上 ═════════════ */

export function DecayModesFig() {
  const s = 46, ox = 230, oy = 120; // 中心格
  const cell = (dn: number, dz: number) => ({ x: ox + dn * s, y: oy - dz * s });
  const box = (dn: number, dz: number, label: string, c: string, fill = 0.18) => {
    const p = cell(dn, dz);
    return (
      <g key={label}>
        <rect x={p.x - s / 2 + 2} y={p.y - s / 2 + 2} width={s - 4} height={s - 4} rx={4} fill={c} fillOpacity={fill} stroke={c} strokeWidth={1.6} />
        <text x={p.x} y={p.y + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{label}</text>
      </g>
    );
  };
  const arrow = (dn: number, dz: number, c: string, id: string) => {
    const a = cell(0, 0), b = cell(dn, dz);
    const k = 0.72;
    return <line x1={a.x + (b.x - a.x) * 0.28} y1={a.y + (b.y - a.y) * 0.28} x2={a.x + (b.x - a.x) * k} y2={a.y + (b.y - a.y) * k} stroke={c} strokeWidth={3} markerEnd={`url(#${id})`} />;
  };
  return (
    <Fig caption="在核種表上（橫軸中子數 N、縱軸質子數 Z）看四種衰變。α 衰變帶走 2 個質子和 2 個中子，往左下斜走兩格；β⁻ 把一個中子變成質子，往左上一格（A 不變）；β⁺ 和電子捕獲把一個質子變成中子，往右下一格（A 不變）。中子太多的核走 β⁻、質子太多的核走 β⁺／EC、很重的核走 α，方向都是往穩定谷靠近。" source="課堂投影片（River）radio isotope p.26–31">
      <svg viewBox="0 0 640 250" className="ix-svg" role="img" aria-label="衰變方式在核種表上的移動方向" style={{ maxWidth: 640, margin: "0 auto" }}>
        <Marks />
        {[-2, -1, 0, 1].map((dz) =>
          [-2, -1, 0, 1].map((dn) => {
            const p = cell(dn, dz);
            return <rect key={`${dn},${dz}`} x={p.x - s / 2} y={p.y - s / 2} width={s} height={s} fill="none" stroke={INK} strokeOpacity={0.12} />;
          }),
        )}
        {box(0, 0, "母核", C.navy, 0.35)}
        {box(-2, -2, "α", C.rose)}
        {box(-1, 1, "β⁻", C.teal)}
        {box(1, -1, "β⁺ / EC", C.orange)}
        {arrow(-2, -2, C.rose, "nv-r")}
        {arrow(-1, 1, C.teal, "nv-t")}
        {arrow(1, -1, C.orange, "nv-o")}
        <line x1={110} y1={225} x2={340} y2={225} stroke={INK} strokeWidth={1.5} markerEnd="url(#nv-k)" />
        <text x={344} y={229} style={{ fontSize: 12 }}>N</text>
        <line x1={110} y1={225} x2={110} y2={20} stroke={INK} strokeWidth={1.5} markerEnd="url(#nv-k)" />
        <text x={104} y={18} textAnchor="end" style={{ fontSize: 12 }}>Z</text>
        <g style={{ fontSize: 12 }}>
          <text x={380} y={50} style={{ fontWeight: 800, fill: C.rose }}>α：A − 4、Z − 2</text>
          <text x={380} y={68} style={{ opacity: 0.85 }}>重核（比 ²⁰⁹Bi 重）</text>
          <text x={380} y={98} style={{ fontWeight: 800, fill: C.teal }}>β⁻：Z + 1，A 不變</text>
          <text x={380} y={116} style={{ opacity: 0.85 }}>中子太多　⁸⁷Rb → ⁸⁷Sr</text>
          <text x={380} y={146} style={{ fontWeight: 800, fill: C.orange }}>β⁺／EC：Z − 1，A 不變</text>
          <text x={380} y={164} style={{ opacity: 0.85 }}>質子太多　⁴⁰K → ⁴⁰Ar</text>
          <text x={380} y={194} style={{ fontWeight: 800 }}>γ：A、Z 都不變</text>
          <text x={380} y={212} style={{ opacity: 0.85 }}>只放出能量</text>
        </g>
      </svg>
    </Fig>
  );
}

/* ═════════════ 地化 L8：衰變曲線（互動） ═════════════ */

export function DecayDemo() {
  const [n, setN] = useState(1); // 經過幾個半衰期
  const W = 360, H = 240, L = 44, R = 14, T = 12, B = 38;
  const x = (t: number) => L + (t / 6) * (W - L - R);
  const y = (v: number) => T + (1 - v) * (H - T - B);
  const pts = (f: (t: number) => number) => Array.from({ length: 121 }, (_, i) => i / 20).map((t) => `${x(t)},${y(f(t))}`).join(" ");
  const N = Math.pow(0.5, n), D = 1 - N;
  const ratio = D / N;
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：母核減少、子核增加</b>
        <span>拉時間，看 N、D* 和 D*/N</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="衰變曲線">
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={INK} strokeOpacity={0.1} />
              <text x={L - 5} y={y(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v}</text>
            </g>
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((t) => (
            <text key={t} x={x(t)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{t}</text>
          ))}
          <polyline points={pts((t) => Math.pow(0.5, t))} fill="none" stroke={C.blue} strokeWidth={3} />
          <polyline points={pts((t) => 1 - Math.pow(0.5, t))} fill="none" stroke={C.orange} strokeWidth={3} />
          <line x1={x(n)} x2={x(n)} y1={T} y2={H - B} stroke={INK} strokeDasharray="4 3" strokeOpacity={0.6} />
          <circle cx={x(n)} cy={y(N)} r={6} fill={C.blue} stroke={INK} />
          <circle cx={x(n)} cy={y(D)} r={6} fill={C.orange} stroke={INK} />
          <text x={x(5.2)} y={y(0.06)} style={{ fontSize: 12, fontWeight: 800, fill: C.blue, ...halo }}>母核 N</text>
          <text x={x(4.5)} y={y(0.9)} style={{ fontSize: 12, fontWeight: 800, fill: C.orange, ...halo }}>子核 D*</text>
          <Axes W={W} H={H} L={L} R={R} T={T} B={B} xl="經過的半衰期數 t / t½" yl="佔 N₀ 的比例" />
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>時間</span>
              <span>{fmt(n, 1)} 個半衰期</span>
            </label>
            <input type="range" min={0} max={6} step={0.1} value={n} onChange={(e) => setN(+e.target.value)} />
          </div>
          <div className="ix-readout">
            N / N₀ = <b>{fmt(N * 100, 1)} %</b>
            <br />D* / N₀ = <b>{fmt(D * 100, 1)} %</b>
            <br />D* / N = e^(λt) − 1 = <b>{ratio > 99 ? fmt(ratio, 0) : fmt(ratio, 2)}</b>
          </div>
          <div className="ix-verdict">{Math.abs(n - 1) < 0.05 ? "一個半衰期：D* = N" : n > 5 ? "剩不到 3 %，快量不準了" : "N + D* 永遠 = N₀"}</div>
          <div className="ix-note">定年方程式用的是 D*/N，兩個都是現在量得到的量。D*/N 隨時間指數增加，所以越老的樣品，同樣的量測誤差造成的年齡誤差越小；但母核剩太少時又量不準，每個系統都有適用的年齡範圍。</div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ 地化 L8：等時線（互動） ═════════════ */

const LRB = 1.42e-11;
const ISO_PTS = [0.2, 0.9, 1.6, 2.4, 3.2, 4.0]; // 現在的 ⁸⁷Rb/⁸⁶Sr（樣品間不同）

export function IsochronDemo() {
  const [t, setT] = useState(1.5); // Ga
  const r0 = 0.704;
  const g = Math.exp(LRB * t * 1e9) - 1;
  const W = 360, H = 250, L = 50, R = 14, T = 12, B = 38;
  const x = (v: number) => L + (v / 4.5) * (W - L - R);
  const y = (v: number) => T + ((0.9 - v) / 0.22) * (H - T - B);
  // 初始的 Rb/Sr（t=0 時）= 現在 × e^(λt)
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：等時線怎麼轉</b>
        <span>拉時間，看同一組樣品怎麼移動</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="Rb-Sr 等時線">
          {[0.7, 0.75, 0.8, 0.85, 0.9].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={INK} strokeOpacity={0.1} />
              <text x={L - 5} y={y(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v.toFixed(2)}</text>
            </g>
          ))}
          {[0, 1, 2, 3, 4].map((v) => (
            <text key={v} x={x(v)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{v}</text>
          ))}
          <line x1={x(0)} x2={x(4.5)} y1={y(r0)} y2={y(r0)} stroke={INK} strokeDasharray="5 4" strokeOpacity={0.5} />
          <text x={x(3.1)} y={y(r0) + 14} style={{ fontSize: 10.5, opacity: 0.75 }}>t = 0：水平線</text>
          <line x1={x(0)} x2={x(4.5)} y1={y(r0)} y2={y(r0 + g * 4.5)} stroke={C.orange} strokeWidth={2.5} />
          {ISO_PTS.map((rb) => {
            const rb0 = rb * (1 + g);
            return (
              <g key={rb}>
                <line x1={x(rb0)} y1={y(r0)} x2={x(rb)} y2={y(r0 + rb * g)} stroke={INK} strokeOpacity={0.35} strokeDasharray="2 3" />
                <circle cx={x(rb0)} cy={y(r0)} r={3} fill="none" stroke={INK} strokeOpacity={0.5} />
                <circle cx={x(rb)} cy={y(r0 + rb * g)} r={5.5} fill={C.teal} stroke={INK} />
              </g>
            );
          })}
          <circle cx={x(0)} cy={y(r0)} r={5} fill={C.rose} stroke={INK} />
          <text x={x(0.08)} y={y(r0) - 8} style={{ fontSize: 11, fontWeight: 800, fill: C.rose, ...halo }}>截距 = (⁸⁷Sr/⁸⁶Sr)₀</text>
          <Axes W={W} H={H} L={L} R={R} T={T} B={B} xl="⁸⁷Rb / ⁸⁶Sr" yl="⁸⁷Sr / ⁸⁶Sr" />
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>經過時間</span>
              <span>{fmt(t, 2)} Ga</span>
            </label>
            <input type="range" min={0} max={4.5} step={0.05} value={t} onChange={(e) => setT(+e.target.value)} />
          </div>
          <div className="ix-readout">
            斜率 = e^(λt) − 1 = <b>{fmt(g, 4)}</b>
            <br />t = ln(1 + 斜率) / λ = <b>{fmt(t, 2)} Ga</b>
            <br />截距 = <b>{r0}</b>（不變）
          </div>
          <div className="ix-note">空心圈是樣品剛形成時的位置（大家 ⁸⁷Sr/⁸⁶Sr 一樣，Rb 多寡不同）。時間過去，每顆 ⁸⁷Rb 變成一顆 ⁸⁷Sr，所以每個點都沿著斜率 −1 的方向往左上走，Rb 越多走越遠；點始終排成直線，繞著截距逆時針轉。</div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ 地化 L9：²³⁸U 衰變鏈 ═════════════ */

export function UChainFig() {
  const ch: [string, string, string][] = [
    ["²³⁸U", "4.47 Ga", C.blue],
    ["²³⁴U", "24.5 萬年", C.blue],
    ["²³⁰Th", "7.6 萬年", C.orange],
    ["²²⁶Ra", "1600 年", INK],
    ["²²²Rn", "3.8 天", INK],
    ["²¹⁰Pb", "22.3 年", C.teal],
    ["²⁰⁶Pb", "穩定", INK],
  ];
  const w = 82;
  return (
    <Fig caption="²³⁸U 衰變到 ²⁰⁶Pb 的主要節點（中間還有幾個半衰期很短的核種沒畫）。U 系列定年用的就是鏈中間這幾個：²³⁴U（海水中過剩）、²³⁰Th（U 溶於水、Th 不溶，碳酸鹽剛形成時幾乎沒有）、²¹⁰Pb（²²²Rn 是氣體，逸散到大氣後衰變成 ²¹⁰Pb 落下）。每個節點的半衰期決定它能定的時間範圍。" source="課堂投影片（River）U-series p.12–16；半衰期取投影片數值">
      <svg viewBox="0 0 640 170" className="ix-svg" role="img" aria-label="鈾 238 衰變鏈" style={{ maxWidth: 680, margin: "0 auto" }}>
        <Marks />
        {ch.map(([n, h, c], i) => {
          const x0 = 12 + i * (w + 8);
          return (
            <g key={n}>
              <rect x={x0} y={36} width={w} height={54} rx={6} fill={c} fillOpacity={c === INK ? 0.06 : 0.18} stroke={c} strokeWidth={1.8} />
              <text x={x0 + w / 2} y={60} textAnchor="middle" style={{ fontSize: 15, fontWeight: 800 }}>{n}</text>
              <text x={x0 + w / 2} y={80} textAnchor="middle" style={{ fontSize: 11 }}>{h}</text>
              {i < ch.length - 1 && <line x1={x0 + w} x2={x0 + w + 8} y1={63} y2={63} stroke={INK} strokeWidth={1.5} markerEnd="url(#nv-k)" />}
            </g>
          );
        })}
        <text x={12 + 1 * 90 + 41} y={22} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: C.blue }}>U：氧化環境可溶</text>
        <text x={12 + 2 * 90 + 41} y={112} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: C.orange }}>Th：不溶</text>
        <text x={12 + 2 * 90 + 41} y={128} textAnchor="middle" style={{ fontSize: 11 }}>²³⁰Th 定年</text>
        <text x={12 + 4 * 90 + 41} y={112} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800 }}>氣體，逸散</text>
        <text x={12 + 5 * 90 + 41} y={112} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: C.teal }}>從大氣落下</text>
        <text x={12 + 5 * 90 + 41} y={128} textAnchor="middle" style={{ fontSize: 11 }}>²¹⁰Pb 定年</text>
        <text x={12 + 1 * 90 + 41} y={112} textAnchor="middle" style={{ fontSize: 11 }}>海水 [²³⁴U/²³⁸U] = 1.146</text>
        <text x={320} y={158} textAnchor="middle" style={{ fontSize: 11.5, opacity: 0.85 }}>長期平衡時：λ₂₃₈N₂₃₈ = λ₂₃₄N₂₃₄ = λ₂₃₀N₂₃₀ = …（每個活度相等）</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 地化 L9：²³⁰Th 長回平衡（互動） ═════════════ */

const L230 = 9.1705e-6, L234 = 2.8221e-6;
const thRatio = (t: number, d: number) => 1 - Math.exp(-L230 * t) + (d / 1000) * (L230 / (L230 - L234)) * (1 - Math.exp(-(L230 - L234) * t));

export function ThGrowthDemo() {
  const [t, setT] = useState(100); // ka
  const [d, setD] = useState(0); // 初始 δ234U（‰），簡化：用量到的值
  const W = 360, H = 250, L = 46, R = 14, T = 12, B = 38;
  const x = (k: number) => L + (k / 800) * (W - L - R);
  const y = (v: number) => T + ((1.25 - v) / 1.25) * (H - T - B);
  const curve = (dd: number) => Array.from({ length: 161 }, (_, i) => i * 5).map((k) => `${x(k)},${y(thRatio(k * 1000, dd))}`).join(" ");
  const v = thRatio(t * 1000, d);
  const v0 = thRatio(t * 1000, 0);
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：²³⁰Th 長回平衡</b>
        <span>拉年齡和 ²³⁴U 過剩，看 [²³⁰Th/²³⁸U]</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="230Th/238U 隨時間增加">
          {[0, 0.25, 0.5, 0.75, 1, 1.25].map((q) => (
            <g key={q}>
              <line x1={L} x2={W - R} y1={y(q)} y2={y(q)} stroke={INK} strokeOpacity={q === 1 ? 0.45 : 0.1} strokeDasharray={q === 1 ? "5 4" : undefined} />
              <text x={L - 5} y={y(q) + 4} textAnchor="end" style={{ fontSize: 11 }}>{q}</text>
            </g>
          ))}
          {[0, 200, 400, 600, 800].map((k) => (
            <text key={k} x={x(k)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{k}</text>
          ))}
          <rect x={x(600)} y={T} width={x(800) - x(600)} height={H - T - B} fill={INK} fillOpacity={0.06} />
          <text x={x(700)} y={y(0.3)} textAnchor="middle" style={{ fontSize: 10.5, opacity: 0.8 }}>太接近平衡</text>
          <text x={x(700)} y={y(0.3) + 13} textAnchor="middle" style={{ fontSize: 10.5, opacity: 0.8 }}>分辨不出</text>
          <polyline points={curve(0)} fill="none" stroke={INK} strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="4 3" />
          <polyline points={curve(d)} fill="none" stroke={C.orange} strokeWidth={3} />
          <line x1={x(t)} x2={x(t)} y1={T} y2={H - B} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
          <circle cx={x(t)} cy={y(v)} r={6} fill={C.orange} stroke={INK} />
          <Axes W={W} H={H} L={L} R={R} T={T} B={B} xl="年齡（千年）" yl="[²³⁰Th/²³⁸U] 活度比" />
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>年齡</span>
              <span>{fmt(t)} 千年</span>
            </label>
            <input type="range" min={0} max={800} step={5} value={t} onChange={(e) => setT(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>δ²³⁴U（‰）</span>
              <span>{fmt(d)}</span>
            </label>
            <input type="range" min={0} max={150} step={5} value={d} onChange={(e) => setD(+e.target.value)} />
          </div>
          <div className="ix-readout">
            [²³⁰Th/²³⁸U] = <b>{fmt(v, 3)}</b>
            <br />沒有 ²³⁴U 過剩時 = {fmt(v0, 3)}
          </div>
          <div className="ix-note">虛線是 1 − e^(−λ₂₃₀t)（²³⁴U 平衡、無初始 Th）。把 δ²³⁴U 拉到 146（海水的值），同樣年齡會長出更多 ²³⁰Th，比值甚至超過 1；忽略這項會把年齡算老。約 60 萬年後曲線太平，比值差異比量測誤差還小。</div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ 地化 L9：²¹⁰Pb 剖面 ═════════════ */

export function Pb210Fig() {
  const W = 560, H = 260, L = 60, R = 200, T = 20, B = 40;
  const x = (lnA: number) => L + ((lnA + 0.5) / 4) * (W - L - R);
  const y = (z: number) => T + (z / 60) * (H - T - B);
  const sup = Math.log(1.2);
  const pts = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54].map((z) => {
    const ex = 25 * Math.exp(-0.0622 * z);
    return { z, tot: Math.log(ex + 1.2), ex: Math.log(ex) };
  });
  return (
    <Fig caption="湖泊或海洋岩芯的 ²¹⁰Pb 活度（取 ln）對深度。總 ²¹⁰Pb（灰）往深處趨近一個常數，那是沉積物裡 ²²⁶Ra 就地產生的 supported ²¹⁰Pb。扣掉它之後的過剩 ²¹⁰Pb（橘）才是一條直線，斜率 = −λ/a，可以算沉積速率 a。直接拿總活度去配直線，深處被墊高、斜率變平，沉積速率會被高估（作業第 3 題）。" source="課堂投影片（River）U-series p.7（翠峰湖沉積物）；數值為示意">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="210Pb 隨深度變化" style={{ maxWidth: 620, margin: "0 auto" }}>
        <Marks />
        {[0, 1, 2, 3].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={T} y2={H - B} stroke={INK} strokeOpacity={0.1} />
            <text x={x(v)} y={T - 6} textAnchor="middle" style={{ fontSize: 11 }}>{v}</text>
          </g>
        ))}
        {[0, 20, 40, 60].map((z) => (
          <text key={z} x={L - 6} y={y(z) + 4} textAnchor="end" style={{ fontSize: 11 }}>{z}</text>
        ))}
        <line x1={x(sup)} x2={x(sup)} y1={T} y2={H - B} stroke={C.teal} strokeWidth={2} strokeDasharray="6 4" />
        <polyline points={pts.map((p) => `${x(p.tot)},${y(p.z)}`).join(" ")} fill="none" stroke={INK} strokeOpacity={0.45} strokeWidth={2} />
        {pts.map((p) => <circle key={`t${p.z}`} cx={x(p.tot)} cy={y(p.z)} r={3.5} fill={INK} fillOpacity={0.45} />)}
        <line x1={x(Math.log(25))} y1={y(0)} x2={x(Math.log(25) - 0.0622 * 54)} y2={y(54)} stroke={C.orange} strokeWidth={2.5} />
        {pts.map((p) => <circle key={`e${p.z}`} cx={x(p.ex)} cy={y(p.z)} r={4.5} fill={C.orange} stroke={INK} />)}
        <line x1={L} x2={W - R} y1={T} y2={T} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <text x={(L + W - R) / 2} y={H - 14} textAnchor="middle" style={{ fontSize: 12 }}>ln A（²¹⁰Pb 活度）→</text>
        <text x={18} y={(T + H - B) / 2} transform={`rotate(-90 18 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>深度（cm）↓</text>
        <g style={{ fontSize: 12 }}>
          <text x={W - R + 14} y={50} style={{ fontWeight: 800, opacity: 0.6 }}>● 總 ²¹⁰Pb</text>
          <text x={W - R + 14} y={78} style={{ fontWeight: 800, fill: C.orange }}>● 過剩 = 總 − supported</text>
          <text x={W - R + 14} y={96}>斜率 = −λ / a</text>
          <text x={W - R + 14} y={124} style={{ fontWeight: 800, fill: C.teal }}>┆ supported（²²⁶Ra）</text>
          <text x={W - R + 14} y={142}>不隨深度衰減</text>
          <text x={W - R + 14} y={180} style={{ opacity: 0.85 }}>例：斜率 −0.0622 cm⁻¹</text>
          <text x={W - R + 14} y={198} style={{ opacity: 0.85 }}>a = 0.0311 / 0.0622</text>
          <text x={W - R + 14} y={216} style={{ opacity: 0.85 }}>= 0.5 cm/yr</text>
        </g>
      </svg>
    </Fig>
  );
}

/* ═════════════ 構造 Ch11：溫度指標與變形機制 ═════════════ */

export function HomologousFig() {
  const W = 640, L = 30, R = 30;
  const x = (th: number) => L + th * (W - L - R);
  const zones: [number, number, string, string, string][] = [
    [0, 0.3, "低溫塑性", "差排滑動、機械雙晶", C.blue],
    [0.3, 0.7, "中溫塑性", "差排潛變（滑動＋爬升）、恢復、再結晶", C.teal],
    [0.7, 1, "高溫塑性", "擴散潛變、顆粒邊界滑動（超塑性）", C.orange],
  ];
  return (
    <Fig caption="溫度指標 Th = T / Tm（都用 K）決定哪一種塑性機制主導。越往右越熱，越能動用需要熱活化的機制：差排爬升需要空缺移動，擴散需要原子大量跳動。下方是兩個最常用的礦物溫度：石英約 300 °C、長石約 450 °C 才開始塑性，所以 300–450 °C 的剪切帶裡石英已經再結晶、長石還是碎的。" source="Fossen (2016) Ch10；課堂投影片 Ch11 p.3–4、p.21">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="溫度指標與變形機制" style={{ maxWidth: 680, margin: "0 auto" }}>
        <Marks />
        {zones.map(([a, b, t, m, c]) => (
          <g key={t}>
            <rect x={x(a)} y={30} width={x(b) - x(a)} height={70} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={1.8} />
            <text x={(x(a) + x(b)) / 2} y={54} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{t}</text>
            <foreignObject x={x(a) + 6} y={60} width={x(b) - x(a) - 12} height={40}>
              <div style={{ fontSize: 11.5, lineHeight: 1.35, textAlign: "center", color: "currentColor" }}>{m}</div>
            </foreignObject>
          </g>
        ))}
        {[0, 0.3, 0.7, 1].map((v) => (
          <text key={v} x={x(v)} y={20} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }}>{v}</text>
        ))}
        <text x={x(0.5)} y={124} textAnchor="middle" style={{ fontSize: 12 }}>T<tspan dy={3} style={{ fontSize: 9 }}>h</tspan><tspan dy={-3}> = T / T</tspan><tspan dy={3} style={{ fontSize: 9 }}>m</tspan><tspan dy={-3}>　→　越熱</tspan></text>
        <line x1={x(0)} x2={x(1)} y1={150} y2={150} stroke={INK} strokeOpacity={0.4} />
        {[
          [0.35, "石英塑性 ≈ 300 °C", C.violet],
          [0.55, "長石塑性 ≈ 450 °C", C.rose],
        ].map(([p, t, c]) => (
          <g key={t as string}>
            <circle cx={x(p as number)} cy={150} r={6} fill={c as string} stroke={INK} />
            <text x={x(p as number)} y={176} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: c as string }}>{t as string}</text>
          </g>
        ))}
        <text x={x(0.45)} y={194} textAnchor="middle" style={{ fontSize: 11, opacity: 0.8 }}>（兩點位置只示意先後，不是準確的 Th）</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 構造 Ch11：刃差排與螺旋差排 ═════════════ */

export function DislocationFig() {
  return (
    <Fig caption="左：刃差排。滑動面（虛線）上方多插了一片半片原子面（多半面，橘色），它的下緣就是差排線（┴，垂直紙面）。差排線垂直滑動方向，像毛毛蟲一節一節往前，只能在一個滑動面上走，遇到障礙要靠爬升（需要空缺）。右：螺旋差排。原子沿差排線排成螺旋梯，差排線平行滑動方向，像撕紙一樣往旁邊剪開，遇到障礙可以側向滑動換到別的面。" source="Fossen (2016) Fig. 10.7–10.9；課堂投影片 Ch11 p.15–18">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="刃差排與螺旋差排" style={{ maxWidth: 660, margin: "0 auto" }}>
        <Marks />
        {/* 刃差排：下半 8 欄、上半 9 欄 */}
        {[0, 1, 2].map((r) =>
          Array.from({ length: 9 }, (_, c) => {
            const off = (c - 4) * 1.5;
            return <circle key={`u${r}${c}`} cx={40 + c * 24 + off} cy={40 + r * 24} r={5} fill={c === 4 ? C.orange : C.blue} fillOpacity={0.85} />;
          }),
        )}
        {[3, 4, 5].map((r) =>
          Array.from({ length: 8 }, (_, c) => <circle key={`d${r}${c}`} cx={52 + c * 24} cy={40 + r * 24} r={5} fill={C.teal} fillOpacity={0.85} />),
        )}
        <line x1={20} x2={250} y1={40 + 2.5 * 24} y2={40 + 2.5 * 24} stroke={INK} strokeDasharray="5 4" />
        <text x={252} y={40 + 2.5 * 24 + 4} style={{ fontSize: 11 }}>滑動面</text>
        <text x={136} y={40 + 2.5 * 24 + 22} textAnchor="middle" style={{ fontSize: 18, fontWeight: 800, fill: C.orange }}>┴</text>
        <line x1={60} x2={110} y1={18} y2={18} stroke={INK} strokeWidth={2} markerEnd="url(#nv-k)" />
        <text x={115} y={22} style={{ fontSize: 11 }}>滑動方向</text>
        <text x={136} y={205} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>刃差排：差排線 ⊥ 滑動方向</text>
        {/* 螺旋差排：方塊示意 */}
        <g transform="translate(360,30)">
          <path d="M0,40 L160,40 L220,0 L60,0 Z" fill={C.blue} fillOpacity={0.15} stroke={INK} strokeOpacity={0.6} />
          <path d="M0,40 L0,140 L160,140 L160,40" fill={C.blue} fillOpacity={0.08} stroke={INK} strokeOpacity={0.6} />
          <path d="M160,140 L220,100 L220,0" fill="none" stroke={INK} strokeOpacity={0.6} />
          <path d="M80,40 L80,90 L0,90" fill="none" stroke={C.orange} strokeWidth={2} />
          <path d="M80,40 L80,90 L140,50 L140,0" fill={C.orange} fillOpacity={0.15} stroke={C.orange} strokeWidth={1.5} />
          <line x1={80} y1={90} x2={140} y2={50} stroke={C.rose} strokeWidth={3.5} />
          <text x={150} y={78} style={{ fontSize: 11.5, fontWeight: 800, fill: C.rose }}>差排線</text>
          <path d="M20,60 q10,-12 20,0 q10,12 20,0" fill="none" stroke={INK} strokeWidth={1.4} />
          <line x1={20} x2={70} y1={160} y2={127} stroke={INK} strokeWidth={2} markerEnd="url(#nv-k)" />
          <text x={76} y={150} style={{ fontSize: 11 }}>滑動方向</text>
          <text x={110} y={175} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>螺旋差排：差排線 ∥ 滑動方向</text>
        </g>
      </svg>
    </Fig>
  );
}

/* ═════════════ 構造 Ch11：恢復與再結晶 ═════════════ */

export function RecrystFig() {
  const panel = (x0: number, title: string, sub: string, body: ReactElement) => (
    <g transform={`translate(${x0},0)`}>
      <rect x={0} y={24} width={140} height={120} rx={8} fill={INK} fillOpacity={0.03} stroke={INK} strokeOpacity={0.4} />
      {body}
      <text x={70} y={164} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{title}</text>
      <text x={70} y={180} textAnchor="middle" style={{ fontSize: 11, opacity: 0.85 }}>{sub}</text>
    </g>
  );
  const disl = (n: number, seed: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = Math.sin(i * 12.9898 + seed) * 43758.5453;
      const b = Math.sin(i * 78.233 + seed) * 12345.678;
      const px = 14 + (a - Math.floor(a)) * 112;
      const py = 36 + (b - Math.floor(b)) * 96;
      return <text key={i} x={px} y={py} style={{ fontSize: 11, fontWeight: 800, fill: C.orange }}>┴</text>;
    });
  return (
    <Fig caption="差排越積越多，顆粒內部儲存了應變能。溫度夠高時：(1) 恢復：差排靠滑動和爬升排成一道道差排牆，把顆粒切成方位只差幾度的次晶粒，顯微鏡下是波狀消光。(2) 次晶粒旋轉再結晶：更多差排移進邊界，方位差超過 10° 就算新顆粒。(3) 隆丘成核：低應變能的顆粒邊界往高應變能的鄰居鼓出去。(4) 應力移除後的靜態再結晶：顆粒長大、邊界變直、三接點約 120°（泡沫構造）。" source="Fossen (2016) §10.6；課堂投影片 Ch11 p.24–31">
      <svg viewBox="0 0 640 190" className="ix-svg" role="img" aria-label="恢復與再結晶的階段" style={{ maxWidth: 680, margin: "0 auto" }}>
        <Marks />
        {panel(6, "變形後", "差排雜亂分布", <g>{disl(16, 1)}</g>)}
        {panel(166, "恢復", "差排牆 → 次晶粒", (
          <g>
            {[50, 95].map((x) => <line key={x} x1={x} x2={x + 6} y1={28} y2={140} stroke={C.orange} strokeWidth={2} />)}
            <line x1={4} x2={136} y1={84} y2={78} stroke={C.orange} strokeWidth={2} />
            {[40, 54, 68, 98, 112, 126].map((y) => <text key={y} x={46 + (y % 3)} y={y} style={{ fontSize: 9, fill: C.orange }}>┴</text>)}
            <text x={70} y={60} textAnchor="middle" style={{ fontSize: 10.5, opacity: 0.8 }}>&lt; 5°</text>
          </g>
        ))}
        {panel(326, "動態再結晶", "旋轉 > 10°；隆丘成核", (
          <g>
            {[[30, 50], [62, 44], [96, 56], [40, 92], [76, 98], [110, 104], [26, 126], [62, 128]].map(([cx, cy], i) => (
              <polygon key={i} points={`${cx - 14},${cy} ${cx - 7},${cy - 14} ${cx + 9},${cy - 13} ${cx + 15},${cy + 1} ${cx + 7},${cy + 14} ${cx - 8},${cy + 13}`} fill={i % 2 ? C.teal : C.blue} fillOpacity={0.25} stroke={INK} strokeOpacity={0.7} />
            ))}
            <path d="M104,128 q10,-14 24,-6" fill="none" stroke={C.rose} strokeWidth={2.5} />
          </g>
        ))}
        {panel(486, "靜態再結晶", "大顆、直邊、120°", (
          <g>
            <path d="M4,80 L52,70 L84,28 M52,70 L74,118 L136,104 M74,118 L66,144" fill="none" stroke={INK} strokeWidth={1.8} />
            <circle cx={52} cy={70} r={4} fill={C.rose} />
            <circle cx={74} cy={118} r={4} fill={C.rose} />
          </g>
        ))}
        {[146, 306, 466].map((x) => <line key={x} x1={x} x2={x + 18} y1={84} y2={84} stroke={INK} strokeWidth={2} markerEnd="url(#nv-k)" />)}
      </svg>
    </Fig>
  );
}

/* ═════════════ 構造 Ch12：褶皺的幾何名詞 ═════════════ */

export function FoldPartsFig() {
  const wave = (yoff: number) => {
    const p: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = 40 + i * 2.6;
      p.push(`${x},${110 + yoff - 55 * Math.cos(((x - 40) / 520) * 2 * Math.PI * 1.5)}`);
    }
    return p.join(" ");
  };
  return (
    <Fig caption="同一組褶皺層的幾何名詞。樞紐是每一層曲率最大的地方（點），多層的樞紐點連起來是軸面（在剖面上看到的是軸跡）。樞紐兩側比較直的是翼部，翼部上曲率方向改變的點是反曲點。包絡面（虛線）是同一層各個樞紐的切面，代表把褶皺燙平後的整體層面。兩翼的夾角是翼間角，決定褶皺有多緊。" source="Fossen (2016) Fig. 11.2–11.4；課堂投影片 Ch12 p.2–3">
      <svg viewBox="0 0 640 240" className="ix-svg" role="img" aria-label="褶皺幾何名詞" style={{ maxWidth: 680, margin: "0 auto" }}>
        <Marks />
        <polyline points={wave(0)} fill="none" stroke={C.blue} strokeWidth={3} />
        <polyline points={wave(26)} fill="none" stroke={C.teal} strokeWidth={3} />
        {/* 軸面：向斜樞紐（cos 最小）在 x = 40 + 520/3 */}
        <line x1={40 + 520 / 3} x2={40 + 520 / 3} y1={20} y2={210} stroke={C.rose} strokeWidth={2} strokeDasharray="7 4" />
        <text x={40 + 520 / 3 + 6} y={30} style={{ fontSize: 12, fontWeight: 800, fill: C.rose }}>軸面（軸跡）</text>
        <circle cx={40 + 520 / 3} cy={165} r={6} fill={C.orange} stroke={INK} />
        <circle cx={40 + 520 / 3} cy={191} r={6} fill={C.orange} stroke={INK} />
        <text x={40 + 520 / 3 + 10} y={160} style={{ fontSize: 12, fontWeight: 800, fill: C.orange, ...halo }}>樞紐點</text>
        <circle cx={40 + 520 * (1 / 6)} cy={110} r={5} fill={C.violet} stroke={INK} />
        <text x={40 + 520 * (1 / 6) - 6} y={100} textAnchor="end" style={{ fontSize: 12, fontWeight: 800, fill: C.violet, ...halo }}>反曲點</text>
        <text x={40 + 520 * 0.24} y={140} style={{ fontSize: 12, fontWeight: 800, ...halo }}>翼部</text>
        <line x1={40} x2={560} y1={55} y2={55} stroke={INK} strokeDasharray="3 4" strokeOpacity={0.7} />
        <line x1={40} x2={560} y1={165} y2={165} stroke={INK} strokeDasharray="3 4" strokeOpacity={0.7} />
        <text x={566} y={59} style={{ fontSize: 11.5 }}>包絡面</text>
        <text x={566} y={169} style={{ fontSize: 11.5 }}>包絡面</text>
        <text x={40 + 520 * (2 / 3)} y={40} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>類背斜</text>
        <text x={40 + 520 / 3} y={225} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>類向斜</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 構造 Ch12：Ramsay 等傾角線分類 ═════════════ */

export function RamsayFig() {
  // 每一類：外弧半徑 Ro、內弧（翼部厚度 tl、軸部厚度 th）用簡化形狀畫
  const cls: [string, string, number, number, string][] = [
    ["1A", "收斂強；軸部薄", 26, 12, C.blue],
    ["1B", "平行褶皺；層厚不變", 20, 20, C.teal],
    ["1C", "收斂弱；翼部稍薄", 18, 24, C.sage],
    ["2", "相似褶皺；等傾角線平行", 14, 30, C.orange],
    ["3", "發散；軸部厚", 10, 36, C.rose],
  ];
  return (
    <Fig caption="Ramsay 依等傾角線（同一層上下兩個層面上傾角相同的點的連線）把褶皺分成三類。Class 1 等傾角線向內弧收斂：1B 是平行褶皺，垂直層面的厚度處處相同，代表硬層主動拱彎；1A、1C 是它的兩側變化。Class 2 等傾角線互相平行，內外弧形狀相同，是相似褶皺，平行軸面量的厚度處處相同，代表被動流動的軟岩。Class 3 等傾角線向內弧發散，常見於夾在硬層之間的軟層。" source="Ramsay (1967)；Fossen (2016) Fig. 11.9；課堂投影片 Ch12 p.15–19">
      <svg viewBox="0 0 640 210" className="ix-svg" role="img" aria-label="Ramsay 褶皺分類" style={{ maxWidth: 680, margin: "0 auto" }}>
        <Marks />
        {cls.map(([n, s, tl, th, c], i) => {
          const cx = 66 + i * 126;
          const top = 40;
          // 外弧（上面那條）：半圓，半徑 44；內弧往下偏移
          const outer = `M${cx - 50},150 C${cx - 50},${top} ${cx + 50},${top} ${cx + 50},150`;
          const inner = `M${cx - 50 + tl},150 C${cx - 50 + tl},${top + th + 30} ${cx + 50 - tl},${top + th + 30} ${cx + 50 - tl},150`;
          // 等傾角線：在樞紐（垂直）和左右翼各畫一條
          const isoY0 = top + 22, isoY1 = top + th + 47;
          return (
            <g key={n}>
              <path d={outer} fill="none" stroke={c} strokeWidth={2.6} />
              <path d={inner} fill="none" stroke={c} strokeWidth={2.6} />
              <line x1={cx} x2={cx} y1={isoY0} y2={isoY1} stroke={INK} strokeWidth={1.4} strokeDasharray="3 3" />
              <line x1={cx - 50} x2={cx - 50 + tl} y1={130} y2={130} stroke={INK} strokeWidth={1.4} strokeDasharray="3 3" />
              <line x1={cx + 50} x2={cx + 50 - tl} y1={130} y2={130} stroke={INK} strokeWidth={1.4} strokeDasharray="3 3" />
              <line x1={cx - 33} x2={cx - 33 + (tl - th / 2) * 0.6} y1={80} y2={80 + th * 0.9} stroke={INK} strokeWidth={1.4} strokeDasharray="3 3" />
              <line x1={cx + 33} x2={cx + 33 - (tl - th / 2) * 0.6} y1={80} y2={80 + th * 0.9} stroke={INK} strokeWidth={1.4} strokeDasharray="3 3" />
              <text x={cx} y={176} textAnchor="middle" style={{ fontSize: 15, fontWeight: 800, fill: c }}>Class {n}</text>
              <text x={cx} y={196} textAnchor="middle" style={{ fontSize: 10.5 }}>{s}</text>
            </g>
          );
        })}
        <text x={320} y={20} textAnchor="middle" style={{ fontSize: 11.5, opacity: 0.85 }}>虛線：等傾角線（示意）　上弧：外弧　下弧：內弧</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 構造 Ch12：寄生褶皺 Z–M–S ═════════════ */

export function ParasiticFig() {
  const big = (x: number) => 150 - 95 * Math.sin(((x - 60) / 440) * Math.PI);
  const pts: string[] = [];
  for (let x = 60; x <= 500; x += 2) {
    const base = big(x);
    // 寄生褶皺：在主褶皺上疊加小波，振幅在樞紐對稱
    pts.push(`${x},${base + 7 * Math.sin((x - 60) / 9)}`);
  }
  const lab: [number, string, string][] = [
    [120, "Z", C.blue],
    [280, "M", C.teal],
    [440, "S", C.orange],
  ];
  return (
    <Fig caption="順著傾伏方向看一個類背斜：左翼的寄生褶皺是 Z 形（長翼相對短翼順時針），樞紐是對稱的 M 形，右翼是 S 形。原因是曲滑時上層往樞紐方向滑，左翼是順時針的剪切、右翼是逆時針。類向斜剛好反過來（左 S、右 Z）。所以在一個露頭看到 Z 或 S，就知道大褶皺的樞紐在哪一邊；但從反方向看時 S、Z 會互換，一定要先確定觀察方向。" source="Fossen (2016) Fig. 11.13；課堂投影片 Ch12 p.21、p.51">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="寄生褶皺在類背斜上的分布" style={{ maxWidth: 640, margin: "0 auto" }}>
        <Marks />
        <polyline points={pts.join(" ")} fill="none" stroke={C.navy} strokeWidth={3} />
        <polyline points={Array.from({ length: 221 }, (_, i) => 60 + i * 2).map((x) => `${x},${big(x)}`).join(" ")} fill="none" stroke={INK} strokeDasharray="4 4" strokeOpacity={0.45} />
        {lab.map(([x, t, c]) => (
          <g key={t}>
            <circle cx={x} cy={big(x) - 34} r={16} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={2} />
            <text x={x} y={big(x) - 28} textAnchor="middle" style={{ fontSize: 17, fontWeight: 800, fill: c }}>{t}</text>
          </g>
        ))}
        <path d="M150,170 a26,26 0 1,1 30,0" fill="none" stroke={C.blue} strokeWidth={2} markerEnd="url(#nv-b)" transform="translate(-60,20)" />
        <text x={70} y={214} style={{ fontSize: 11.5, fill: C.blue, fontWeight: 700 }}>左翼：順時針剪切</text>
        <path d="M500,170 a26,26 0 1,0 -30,0" fill="none" stroke={C.orange} strokeWidth={2} markerEnd="url(#nv-o)" transform="translate(40,20)" />
        <text x={570} y={214} textAnchor="end" style={{ fontSize: 11.5, fill: C.orange, fontWeight: 700 }}>右翼：逆時針剪切</text>
        <text x={280} y={22} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>類背斜（順著傾伏方向看）</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 構造 Ch12：拱彎的主導波長（互動） ═════════════ */

export function BucklingDemo() {
  const [h, setH] = useState(10); // cm
  const [lr, setLr] = useState(3); // log10 黏度比
  const ratio = Math.pow(10, lr);
  const Ld = 2 * Math.PI * h * Math.cbrt(ratio / 6); // cm
  const W = 360, H = 220;
  const span = 1200; // 畫面寬 = 12 m
  const sx = (cm: number) => 10 + (cm / span) * (W - 20);
  const amp = 18;
  const wpts: string[] = [];
  for (let c = 0; c <= span; c += 4) wpts.push(`${sx(c)},${110 - amp * Math.sin((2 * Math.PI * c) / Ld)}`);
  const thick = Math.max(2, (h / span) * (W - 20));
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：拱彎的波長</b>
        <span>拉層厚和黏度比，看 Biot–Ramberg 的主導波長</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="拱彎褶皺的波長">
          <rect x={0} y={20} width={W} height={180} fill={C.sage} fillOpacity={0.12} />
          <text x={8} y={36} style={{ fontSize: 11, opacity: 0.8 }}>基質 η_M（軟）</text>
          <polyline points={wpts.join(" ")} fill="none" stroke={C.orange} strokeWidth={thick} strokeLinejoin="round" />
          <line x1={sx(0)} x2={sx(Math.min(Ld, span))} y1={170} y2={170} stroke={INK} strokeWidth={1.5} markerStart="url(#nv-k)" markerEnd="url(#nv-k)" />
          <Marks />
          <text x={sx(Math.min(Ld, span) / 2)} y={188} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800 }}>L_d = {Ld >= 100 ? `${fmt(Ld / 100, 2)} m` : `${fmt(Ld, 1)} cm`}</text>
          <text x={W - 10} y={36} textAnchor="end" style={{ fontSize: 11, opacity: 0.8 }}>畫面寬 12 m</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>硬層厚度 h</span>
              <span>{h} cm</span>
            </label>
            <input type="range" min={2} max={40} step={1} value={h} onChange={(e) => setH(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>黏度比 η_L / η_M</span>
              <span>{fmt(ratio)}</span>
            </label>
            <input type="range" min={1} max={4} step={0.1} value={lr} onChange={(e) => setLr(+e.target.value)} />
          </div>
          <div className="ix-readout">
            L_d = 2πh (η_L / 6η_M)^(1/3)
            <br />= <b>{Ld >= 100 ? `${fmt(Ld / 100, 2)} m` : `${fmt(Ld, 1)} cm`}</b>
            <br />L_d / h = <b>{fmt(Ld / h, 1)}</b>
          </div>
          <div className="ix-note">層厚變 2 倍，波長變 2 倍；黏度比要變 8 倍，波長才變 2 倍（立方根）。所以野外同一套地層裡，薄層的褶皺比較密、厚層的比較疏；量 L/h 可以反推黏度比。</div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ 地物 岩石學 1：三種部分熔融 ═════════════ */

export function MeltingModesFig() {
  const W = 640, H = 300, L = 60, R = 210, T = 24, B = 40;
  const x = (T_: number) => L + ((T_ - 600) / 1200) * (W - L - R);
  const y = (z: number) => T + (z / 200) * (H - T - B);
  const solidus = (z: number) => 1100 + 3.2 * z - 0.006 * z * z; // 乾橄欖岩固相線（示意）
  const wet = (z: number) => (z < 30 ? 1000 - 4 * z : 880 + 0.6 * (z - 30)); // 含水（示意）
  const geo = (z: number) => (z < 100 ? 20 + 13.3 * z : 1350 + 0.6 * (z - 100)); // 地溫線
  const line = (f: (z: number) => number, z0 = 0, z1 = 200) => Array.from({ length: 101 }, (_, i) => z0 + ((z1 - z0) * i) / 100).map((z) => `${x(Math.max(600, Math.min(1800, f(z))))},${y(z)}`).join(" ");
  return (
    <Fig caption="溫度–深度圖上的三種部分熔融（曲線為示意）。正常的地溫線（灰）在乾橄欖岩固相線（紅）左邊，地函是固體。① 減壓：地函上升時溫度幾乎不變、壓力下降，往上跨過固相線（中洋脊、地函柱）。② 升溫：溫度往右超過固相線。③ 加水：固相線本身大幅往低溫移動（藍），原本不會熔的地函楔就熔了（隱沒帶）。" source="Klein & Philpotts Fig. 9.3；Gill Fig. 2.17–2.18；課堂投影片 岩石學 1 p.30–37">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="三種部分熔融方式" style={{ maxWidth: 660, margin: "0 auto" }}>
        <Marks />
        {[800, 1000, 1200, 1400, 1600].map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={T} y2={H - B} stroke={INK} strokeOpacity={0.08} />
            <text x={x(t)} y={T - 8} textAnchor="middle" style={{ fontSize: 11 }}>{t}</text>
          </g>
        ))}
        {[0, 50, 100, 150, 200].map((z) => (
          <text key={z} x={L - 6} y={y(z) + 4} textAnchor="end" style={{ fontSize: 11 }}>{z}</text>
        ))}
        <polyline points={line(solidus)} fill="none" stroke={C.rose} strokeWidth={3} />
        <polyline points={line(wet, 0, 200)} fill="none" stroke={C.blue} strokeWidth={2.5} strokeDasharray="7 4" />
        <polyline points={line(geo, 40, 200)} fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={2.5} />
        {/* ① 減壓 */}
        <line x1={x(1390)} y1={y(160)} x2={x(1330)} y2={y(55)} stroke={C.orange} strokeWidth={3} markerEnd="url(#nv-o)" />
        <text x={x(1395)} y={y(110)} style={{ fontSize: 13, fontWeight: 800, fill: C.orange, ...halo }}>① 減壓</text>
        {/* ② 升溫 */}
        <line x1={x(1250)} y1={y(70)} x2={x(1430)} y2={y(70)} stroke={C.teal} strokeWidth={3} markerEnd="url(#nv-t)" />
        <text x={x(1250)} y={y(70) - 8} style={{ fontSize: 13, fontWeight: 800, fill: C.teal, ...halo }}>② 升溫</text>
        {/* ③ 加水 */}
        <line x1={x(1240)} y1={y(130)} x2={x(1000)} y2={y(130)} stroke={C.blue} strokeWidth={2.5} markerEnd="url(#nv-b)" />
        <text x={x(1000)} y={y(130) + 18} style={{ fontSize: 13, fontWeight: 800, fill: C.blue, ...halo }}>③ 加水：固相線左移</text>
        <line x1={L} x2={W - R} y1={T} y2={T} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <text x={(L + W - R) / 2} y={H - 10} textAnchor="middle" style={{ fontSize: 12 }}>溫度（°C）→（上方刻度）</text>
        <text x={18} y={(T + H - B) / 2} transform={`rotate(-90 18 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>深度（km）↓</text>
        <g style={{ fontSize: 12 }}>
          <text x={W - R + 16} y={50} style={{ fontWeight: 800, fill: C.rose }}>━ 乾橄欖岩固相線</text>
          <text x={W - R + 16} y={74} style={{ fontWeight: 800, fill: C.blue }}>┅ 含水固相線</text>
          <text x={W - R + 16} y={98} style={{ fontWeight: 800, opacity: 0.6 }}>━ 地溫線</text>
          <text x={W - R + 16} y={136}>① 中洋脊、地函柱</text>
          <text x={W - R + 16} y={156}>② 岩漿底侵加熱</text>
          <text x={W - R + 16} y={176}>③ 隱沒帶地函楔</text>
          <text x={W - R + 16} y={214} style={{ opacity: 0.8 }}>固相線左邊：全固體</text>
          <text x={W - R + 16} y={232} style={{ opacity: 0.8 }}>跨到右邊：開始熔</text>
        </g>
      </svg>
    </Fig>
  );
}

/* ═════════════ 地物 岩石學 1：上部地函的含 Al 相 ═════════════ */

export function LherzoliteFig() {
  const z = (km: number) => 30 + km * 1.7;
  return (
    <Fig caption="上部地函是二輝橄欖岩：橄欖石、斜方輝石、單斜輝石，加上一個含 Al 的礦物。含 Al 相隨深度（壓力）改變：淺處是斜長石，約 20 km 以下是尖晶石，約 70 km 以下是石榴子石。越深越緊密的礦物越穩定。深度為投影片上標示的大約值，實際界線也和溫度有關。" source="Klein & Philpotts Fig. 9.1–9.2；Gill Fig. 5.5；課堂投影片 岩石學 1 p.12–14">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="二輝橄欖岩的含鋁相隨深度改變" style={{ maxWidth: 600, margin: "0 auto" }}>
        <rect x={140} y={z(0)} width={160} height={z(20) - z(0)} fill={C.gold} fillOpacity={0.25} stroke={C.gold} />
        <rect x={140} y={z(20)} width={160} height={z(70) - z(20)} fill={C.teal} fillOpacity={0.22} stroke={C.teal} />
        <rect x={140} y={z(70)} width={160} height={z(105) - z(70)} fill={C.rose} fillOpacity={0.22} stroke={C.rose} />
        <text x={220} y={(z(0) + z(20)) / 2 + 5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>斜長石二輝橄欖岩</text>
        <text x={220} y={(z(20) + z(70)) / 2 + 5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>尖晶石二輝橄欖岩</text>
        <text x={220} y={(z(70) + z(105)) / 2 + 5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>石榴子石二輝橄欖岩</text>
        {[0, 20, 70].map((k) => (
          <g key={k}>
            <line x1={130} x2={140} y1={z(k)} y2={z(k)} stroke={INK} />
            <text x={126} y={z(k) + 4} textAnchor="end" style={{ fontSize: 11 }}>{k} km</text>
          </g>
        ))}
        <text x={126} y={z(100)} textAnchor="end" style={{ fontSize: 11 }}>深 ↓</text>
        <g style={{ fontSize: 12 }}>
          <text x={330} y={z(10) + 4}>CaAl₂Si₂O₈（斜長石）</text>
          <text x={330} y={z(45) + 4}>(Mg,Fe)(Al,Cr)₂O₄（尖晶石）</text>
          <text x={330} y={z(87) + 4}>Mg₃Al₂Si₃O₁₂（鎂鋁榴石）</text>
          <text x={330} y={z(60) + 4} style={{ fontSize: 11, opacity: 0.85 }}>橄欖石 + 石榴子石 ⇌ 斜方輝石 + 尖晶石</text>
        </g>
        <text x={40} y={110} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 700 }} transform="rotate(-90 40 110)">共同的主礦物：ol + opx + cpx</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 地物 岩石學 1：Stokes 沉降（互動） ═════════════ */

export function StokesDemo() {
  const [r, setR] = useState(1); // mm
  const [le, setLe] = useState(2); // log10 黏度
  const [dr, setDr] = useState(600);
  const eta = Math.pow(10, le);
  const v = (2 * dr * 9.8 * Math.pow(r / 1000, 2)) / (9 * eta); // m/s
  const perYr = v * 3.156e7;
  const W = 360, H = 200;
  const bar = Math.max(2, Math.min(300, 30 * Math.log10(1 + perYr)));
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：晶體在岩漿中沉多快</b>
        <span>Stokes 定律 v = 2Δρgr² / 9η</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="Stokes 沉降速度">
          <rect x={20} y={20} width={120} height={160} rx={8} fill={C.orange} fillOpacity={0.12} stroke={C.orange} />
          <circle cx={80} cy={50} r={Math.max(3, Math.min(26, r * 8))} fill={C.sage} stroke={INK} />
          <line x1={80} x2={80} y1={50 + Math.min(26, r * 8) + 4} y2={170} stroke={INK} strokeDasharray="3 3" />
          <text x={80} y={196} textAnchor="middle" style={{ fontSize: 11 }}>岩漿 η = 10^{fmt(le, 1)} Pa·s</text>
          <rect x={170} y={150 - bar * 0.45} width={40} height={bar * 0.45} fill={C.teal} />
          <text x={190} y={168} textAnchor="middle" style={{ fontSize: 11 }}>每年沉降</text>
          <text x={190} y={142 - bar * 0.45} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{perYr >= 1000 ? `${fmt(perYr / 1000, 1)} km` : perYr >= 1 ? `${fmt(perYr, 1)} m` : `${fmt(perYr * 100, 2)} cm`}</text>
          <text x={240} y={60} style={{ fontSize: 11 }}>Palisades 岩床</text>
          <text x={240} y={76} style={{ fontSize: 11 }}>橄欖石估計：</text>
          <text x={240} y={92} style={{ fontSize: 11, fontWeight: 800 }}>151 m / 年</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>晶體半徑 r</span>
              <span>{fmt(r, 1)} mm</span>
            </label>
            <input type="range" min={0.1} max={5} step={0.1} value={r} onChange={(e) => setR(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>岩漿黏度（log Pa·s）</span>
              <span>{fmt(le, 1)}</span>
            </label>
            <input type="range" min={1} max={6} step={0.1} value={le} onChange={(e) => setLe(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>密度差 Δρ</span>
              <span>{dr} kg/m³</span>
            </label>
            <input type="range" min={50} max={1000} step={10} value={dr} onChange={(e) => setDr(+e.target.value)} />
          </div>
          <div className="ix-readout">
            v = <b>{v < 1e-3 ? v.toExponential(2) : fmt(v, 4)} m/s</b>
            <br />= <b>{fmt(v * 360000, 2)} cm/小時</b>
          </div>
          <div className="ix-note">半徑變 2 倍，速度變 4 倍；黏度從玄武岩漿（約 10²）換成花崗岩漿（約 10⁶），速度慢一萬倍。所以基性岩漿庫底部容易堆出橄欖石堆晶，花崗岩漿裡的晶體幾乎沉不下去（還有降伏強度擋著）。</div>
        </div>
      </div>
    </figure>
  );
}
