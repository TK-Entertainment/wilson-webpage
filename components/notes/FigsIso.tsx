"use client";

import { useState } from "react";
import { Fig } from "./Figs";
import "./notes.css";

// 地化 L10（Nov 18：U-Pb、¹⁴C、Rb-Sr、二成分混合）的自繪圖與互動圖
const INK = "currentColor";
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", violet: "#8a6fd1", blue: "#5b8bd9" };
const fmt = (x: number, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const halo = { paintOrder: "stroke" as const, stroke: "hsl(var(--card))", strokeWidth: 3 };

// 刻度：步長取 1、2、5 × 10ⁿ
function ticks(lo: number, hi: number, n = 5) {
  const raw = (hi - lo) / n;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const e = raw / mag;
  const step = (e < 1.5 ? 1 : e < 3.5 ? 2 : e < 7.5 ? 5 : 10) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(+v.toPrecision(12));
  return { out, dec: Math.max(0, -Math.floor(Math.log10(step) + 1e-9)) };
}

/* ═════════════ 二成分混合：Sr 濃度 vs ⁸⁷Sr/⁸⁶Sr ═════════════ */

type End = { label: string; c: number; r: number };
const PRESETS: { key: string; name: string; unit: string; A: End; B: End; note: string }[] = [
  {
    key: "hw",
    name: "作業 6-2",
    unit: "ppm",
    A: { label: "A", c: 600, r: 0.709 },
    B: { label: "B", c: 100, r: 0.725 },
    note: "Week 11 作業第 2 題的兩個端元。",
  },
  {
    key: "lake",
    name: "Huron 北水道",
    unit: "µg/L",
    A: { label: "Superior", c: 21.2, r: 0.718 },
    B: { label: "Huron", c: 95.0, r: 0.7107 },
    note: "端元的 Sr 濃度用課本擬合的 0.1996/Sr + 0.7086 反推（投影片 p.50）。",
  },
  {
    key: "rock",
    name: "花崗岩＋玄武岩",
    unit: "ppm",
    A: { label: "花崗岩", c: 160, r: 0.73691 },
    B: { label: "玄武岩", c: 318, r: 0.70362 },
    note: "投影片 p.52 的例子；這組是 Sr 少的一端比值高。",
  },
];

export function MixingDemo() {
  const [key, setKey] = useState("hw");
  const [f, setF] = useState(0.4);
  const [inv, setInv] = useState(false);
  const p = PRESETS.find((q) => q.key === key) ?? PRESETS[0];
  const { A, B } = p;
  const mix = (g: number) => {
    const c = g * A.c + (1 - g) * B.c;
    return { c, r: (g * A.c * A.r + (1 - g) * B.c * B.r) / c };
  };
  const a = (A.c * B.c * (B.r - A.r)) / (A.c - B.c);
  const b = (A.c * A.r - B.c * B.r) / (A.c - B.c);

  const W = 380, H = 262, L = 60, R = 16, T = 14, Bm = 40;
  const cLo = Math.min(A.c, B.c), cHi = Math.max(A.c, B.c);
  const xv = (c: number) => (inv ? 1 / c : c);
  const xLo0 = inv ? 1 / cHi : cLo, xHi0 = inv ? 1 / cLo : cHi;
  const xPad = (xHi0 - xLo0) * 0.1;
  const xLo = Math.max(0, xLo0 - xPad), xHi = xHi0 + xPad;
  const rLo0 = Math.min(A.r, B.r), rHi0 = Math.max(A.r, B.r);
  const yPad = (rHi0 - rLo0) * 0.12;
  const yLo = rLo0 - yPad, yHi = rHi0 + yPad;
  const X = (v: number) => L + ((v - xLo) / (xHi - xLo)) * (W - L - R);
  const Y = (v: number) => T + ((yHi - v) / (yHi - yLo)) * (H - T - Bm);
  const curve = Array.from({ length: 101 }, (_, i) => mix(i / 100))
    .map((m) => `${X(xv(m.c))},${Y(m.r)}`)
    .join(" ");
  const xt = ticks(xLo, xHi, 4), yt = ticks(yLo, yHi, 5);
  const m = mix(f);
  const fromA = (f * A.c) / m.c;
  const marks = [0.2, 0.4, 0.6, 0.8];

  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：二成分混合為什麼是雙曲線</b>
        <span>拉 f，再把橫軸換成 1/Sr</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="兩個端元混合時 Sr 濃度與 87Sr/86Sr 的關係">
          {yt.out.map((v) => (
            <g key={`y${v}`}>
              <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} stroke={INK} strokeOpacity={0.1} />
              <text x={L - 5} y={Y(v) + 4} textAnchor="end" style={{ fontSize: 10.5 }}>{fmt(v, yt.dec)}</text>
            </g>
          ))}
          {xt.out.map((v) => (
            <text key={`x${v}`} x={X(v)} y={H - Bm + 15} textAnchor="middle" style={{ fontSize: 10.5 }}>{fmt(v, xt.dec)}</text>
          ))}
          <polyline points={curve} fill="none" stroke={C.teal} strokeWidth={3} />
          {marks.map((g) => {
            const q = mix(g);
            return (
              <g key={g}>
                <circle cx={X(xv(q.c))} cy={Y(q.r)} r={3.5} fill="hsl(var(--card))" stroke={INK} />
                <text x={X(xv(q.c)) + 6} y={Y(q.r) - 6} style={{ fontSize: 10, opacity: 0.75, ...halo }}>{g}</text>
              </g>
            );
          })}
          {[A, B].map((e, i) => (
            <g key={e.label}>
              <circle cx={X(xv(e.c))} cy={Y(e.r)} r={6} fill={i === 0 ? C.orange : C.blue} stroke={INK} />
              <text
                x={X(xv(e.c)) + (X(xv(e.c)) > W / 2 ? -9 : 9)}
                y={Y(e.r) + (Y(e.r) < H / 2 ? 16 : -10)}
                textAnchor={X(xv(e.c)) > W / 2 ? "end" : "start"}
                style={{ fontSize: 11.5, fontWeight: 800, fill: i === 0 ? C.orange : C.blue, ...halo }}
              >
                {e.label}
              </text>
            </g>
          ))}
          <circle cx={X(xv(m.c))} cy={Y(m.r)} r={7.5} fill={C.gold} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={W - R} y1={H - Bm} y2={H - Bm} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - Bm} stroke={INK} strokeWidth={1.5} />
          <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12 }}>
            {inv ? `1/Sr（1/${p.unit}）` : `Sr（${p.unit}）`}
          </text>
          <text x={13} y={(T + H - Bm) / 2} transform={`rotate(-90 13 ${(T + H - Bm) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>
            ⁸⁷Sr/⁸⁶Sr
          </text>
        </svg>
        <div className="ix-panel">
          <div className="ix-btns">
            {PRESETS.map((q) => (
              <button key={q.key} type="button" className="ix-btn" aria-pressed={key === q.key} onClick={() => setKey(q.key)}>
                {q.name}
              </button>
            ))}
          </div>
          <div className="ix-row">
            <label>
              <span>A 的比例 f</span>
              <span>{fmt(f, 2)}</span>
            </label>
            <input type="range" min={0} max={1} step={0.01} value={f} onChange={(e) => setF(+e.target.value)} />
          </div>
          <div className="ix-btns">
            <button type="button" className="ix-btn" aria-pressed={!inv} onClick={() => setInv(false)}>橫軸 Sr</button>
            <button type="button" className="ix-btn" aria-pressed={inv} onClick={() => setInv(true)}>橫軸 1/Sr</button>
          </div>
          <div className="ix-readout">
            Sr<sub>M</sub> = <b>{fmt(m.c, 1)}</b> {p.unit}，⁸⁷Sr/⁸⁶Sr = <b>{fmt(m.r, 5)}</b>
            <br />混合物裡的 Sr 有 <b>{fmt(fromA * 100, 0)}%</b> 來自 {A.label}
            <br />曲線：⁸⁷Sr/⁸⁶Sr = {fmt(a, 4)}/Sr + {fmt(b, 5)}
          </div>
          <div className="ix-note">
            {p.note}f 是 A 的重量（湖水是體積）比例，不是 Sr 的比例：Sr 濃度高的那一端「拉得比較用力」，所以比值不會照 f 平均分配，點在曲線上也不等距。換成 1/Sr 之後，所有混合物排成一直線，這就是擬合用的線性化。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ ¹⁴C 校正：平台讓年代範圍變寬 ═════════════ */

// 示意用的校正曲線控制點（日曆年 cal BP, ¹⁴C 年 BP），2450–2750 做成平台；不是 IntCal 實際數值
const CAL: [number, number][] = [
  [2000, 2010], [2150, 2140], [2300, 2250], [2400, 2380], [2460, 2445], [2550, 2462], [2650, 2452],
  [2750, 2478], [2850, 2640], [2950, 2780], [3050, 2862], [3200, 2990],
];
function calAt(x: number) {
  // Catmull-Rom 內插，讓曲線平滑
  let i = CAL.findIndex(([cx], k) => k < CAL.length - 1 && x >= cx && x <= CAL[k + 1][0]);
  if (i < 0) i = x < CAL[0][0] ? 0 : CAL.length - 2;
  const p0 = CAL[Math.max(0, i - 1)], p1 = CAL[i], p2 = CAL[i + 1], p3 = CAL[Math.min(CAL.length - 1, i + 2)];
  const t = (x - p1[0]) / (p2[0] - p1[0]);
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
}

export function C14CalibFig() {
  const W = 560, H = 366, L = 108, R = 16, T = 14, B = 116;
  const x0 = 2000, x1 = 3200, y0 = 2000, y1 = 3000;
  const X = (v: number) => L + ((v - x0) / (x1 - x0)) * (W - L - R);
  const Y = (v: number) => T + ((y1 - v) / (y1 - y0)) * (H - T - B);
  const xs = Array.from({ length: 241 }, (_, i) => x0 + i * 5);
  const curve = xs.map((x) => `${X(x)},${Y(calAt(x))}`).join(" ");
  const samples = [
    { mu: 2850, s: 25, c: C.orange, name: "樣品甲 2850 ± 25 BP" },
    { mu: 2460, s: 25, c: C.violet, name: "樣品乙 2460 ± 25 BP" },
  ];
  const base = H - B + 96; // 日曆年機率分布的基線（放在軸標籤下面）
  const GX = L - 4; // 左邊常態分布的基線，往左畫 34 px；刻度數字放在它更左邊
  return (
    <Fig
      caption="¹⁴C 年齡怎麼換成日曆年（示意，曲線不是實際 IntCal 數值）。左邊是量到的 ¹⁴C 年齡和誤差（常態分布），往右碰到校正曲線，再往下投影成日曆年的機率分布。樣品甲落在曲線陡的地方，日曆年範圍和原本的誤差差不多；樣品乙落在平台上，同樣 ±25 年的誤差，換成日曆年卻拉長到將近三百年，還分成好幾個峰。"
      source="課堂投影片（River）p.33–37：Suess 平台、校正曲線與機率分布"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="fg-svg" role="img" aria-label="放射性碳年齡經校正曲線換成日曆年的示意圖">
        {[2000, 2200, 2400, 2600, 2800, 3000].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} stroke={INK} strokeOpacity={0.08} />
            <text x={L - 42} y={Y(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v}</text>
          </g>
        ))}
        {[2000, 2200, 2400, 2600, 2800, 3000, 3200].map((v) => (
          <text key={v} x={X(v)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{v}</text>
        ))}
        <line x1={X(x0)} y1={Y(x0)} x2={X(y1)} y2={Y(y1)} stroke={INK} strokeOpacity={0.3} strokeDasharray="4 4" />
        <text x={X(2930)} y={Y(2990)} textAnchor="end" style={{ fontSize: 10.5, opacity: 0.7 }}>如果 ¹⁴C 年 = 日曆年</text>
        {samples.map((sm, k) => {
          const ys = Array.from({ length: 81 }, (_, i) => sm.mu - 4 * sm.s + (i * 8 * sm.s) / 80);
          const gauss = ys.map((y) => `${GX - 34 * Math.exp(-((y - sm.mu) ** 2) / (2 * sm.s ** 2))},${Y(y)}`).join(" ");
          const dens = xs.map((x) => Math.exp(-((calAt(x) - sm.mu) ** 2) / (2 * (sm.s ** 2 + 15 ** 2))));
          const mx = Math.max(...dens);
          const area = `${X(x0)},${base} ` + xs.map((x, i) => `${X(x)},${base - 30 * (dens[i] / mx)}`).join(" ") + ` ${X(x1)},${base}`;
          return (
            <g key={k}>
              <rect x={L} y={Y(sm.mu + 2 * sm.s)} width={W - L - R} height={Y(sm.mu - 2 * sm.s) - Y(sm.mu + 2 * sm.s)} fill={sm.c} fillOpacity={0.14} />
              <polygon points={`${GX},${Y(sm.mu - 4 * sm.s)} ${gauss} ${GX},${Y(sm.mu + 4 * sm.s)}`} fill={sm.c} fillOpacity={0.55} stroke={sm.c} />
              <polygon points={area} fill={sm.c} fillOpacity={0.5} stroke={sm.c} />
              <text x={k === 0 ? X(3190) : X(2010)} y={Y(sm.mu) - 6} textAnchor={k === 0 ? "end" : "start"} style={{ fontSize: 11, fontWeight: 800, fill: sm.c, ...halo }}>{sm.name}</text>
            </g>
          );
        })}
        <polyline points={curve} fill="none" stroke={C.teal} strokeWidth={3} />
        <text x={X(2600)} y={Y(2462) - 12} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: C.teal, ...halo }}>平台</text>
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={X(x0)} x2={X(x1)} y1={base} y2={base} stroke={INK} strokeOpacity={0.5} />
        <text x={(L + W - R) / 2} y={H - B + 30} textAnchor="middle" style={{ fontSize: 12 }}>日曆年（cal BP）</text>
        <text x={W - R} y={base + 14} textAnchor="end" style={{ fontSize: 10.5, opacity: 0.8 }}>↑ 換算後的日曆年機率</text>
        <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>¹⁴C 年齡（BP）</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 海洋庫效應 ═════════════ */

export function ReservoirFig() {
  const box = (x: number, y: number, w: number, h: number, title: string, lines: string[], c: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={c} fillOpacity={0.14} stroke={c} strokeWidth={2} />
      <text x={x + 10} y={y + 20} style={{ fontSize: 13, fontWeight: 800 }}>{title}</text>
      {lines.map((s, i) => (
        <text key={i} x={x + 10} y={y + 39 + i * 16} style={{ fontSize: 11.5 }}>{s}</text>
      ))}
    </g>
  );
  return (
    <Fig
      caption="為什麼海洋生物定出來的 ¹⁴C 年齡偏老。大氣的 ¹⁴C 一直被宇宙射線補充；表層海水和大氣交換不夠快，又混到湧升上來的老海水，平均看起來比大氣老約 400 年（R）；深層水離開表層上千年，¹⁴C 少約兩成。珊瑚、貝殼用的是表層水的碳，所以定年要用海洋校正曲線（Marine20），再加當地的修正 ΔR。"
      source="課堂投影片（River）p.39–42；Stuiver & Braziunas (1993)"
    >
      <svg viewBox="0 0 560 300" className="fg-svg" role="img" aria-label="大氣、表層海水與深層水的放射性碳差異">
        <defs>
          <marker id="rv-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>
        {box(20, 14, 520, 62, "大氣 CO₂", ["宇宙射線一直做出新的 ¹⁴C：¹⁴N + n → ¹⁴C + p", "陸地植物吃這裡的碳 → 用 IntCal 校正"], C.gold)}
        {box(20, 112, 520, 62, "表層海水（約前幾百公尺）", ["和大氣交換慢＋混到湧升的老水 → 看起來老約 400 年（R）", "珊瑚、貝殼、有孔蟲吃這裡的碳 → 用 Marine20 ＋ 當地 ΔR"], C.teal)}
        {box(20, 210, 520, 76, "深層水", ["從表層下沉後上千年才回到表層", "約 2000 年的水，¹⁴C 比大氣少約 20%", "WOCE 量到的底層水 Δ¹⁴C 約 −240 到 −120‰"], C.navy)}
        <line x1={150} y1={80} x2={150} y2={108} stroke={INK} strokeWidth={1.8} markerStart="url(#rv-a)" markerEnd="url(#rv-a)" />
        <text x={160} y={98} style={{ fontSize: 11, ...halo }}>CO₂ 交換（慢）</text>
        <line x1={360} y1={178} x2={360} y2={206} stroke={INK} strokeWidth={1.8} markerEnd="url(#rv-a)" />
        <text x={370} y={196} style={{ fontSize: 11, ...halo }}>下沉</text>
        <line x1={460} y1={206} x2={460} y2={178} stroke={INK} strokeWidth={1.8} markerEnd="url(#rv-a)" />
        <text x={470} y={196} style={{ fontSize: 11, ...halo }}>湧升（帶回老碳）</text>
      </svg>
    </Fig>
  );
}
