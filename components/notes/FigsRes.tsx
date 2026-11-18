"use client";

import { useState } from "react";
import { Fig } from "./Figs";
import "./notes.css";

// 地球物質 L17 地球物質資源的自繪圖：油母質類型、油窗（互動）、石油系統圈閉、斑岩與淺成熱液礦床、甲烷水合物穩定帶（互動）
const INK = "currentColor";
const C = {
  orange: "var(--orange)",
  teal: "var(--teal)",
  gold: "var(--gold)",
  rose: "#d0567a",
  violet: "#8a6fd1",
  blue: "#5b8bd9",
  sage: "var(--sage)",
  green: "#3fa36b",
};
const fmt = (x: number, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const halo = { paintOrder: "stroke" as const, stroke: "hsl(var(--card))", strokeWidth: 3 };

function Marks() {
  return (
    <defs>
      {[
        ["rs-k", "currentColor"],
        ["rs-o", C.orange],
        ["rs-b", C.blue],
        ["rs-g", C.green],
      ].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

/* ═════════════ 油母質的類型：van Krevelen 圖 ═════════════ */

export function KerogenFig() {
  const W = 600, H = 320, L = 60, R = 200, T = 20, B = 44;
  const sx = (oc: number) => L + (oc / 0.3) * (W - L - R);
  const sy = (hc: number) => H - B - (hc / 2) * (H - T - B);
  const END = { x: 0.015, y: 0.35 };
  const types: { name: string; sub: string; x: number; y: number; c: string }[] = [
    { name: "Type I", sub: "藻類；偏生油", x: 0.03, y: 1.7, c: C.green },
    { name: "Type II", sub: "海洋浮游生物；油＋氣", x: 0.09, y: 1.35, c: C.teal },
    { name: "Type III", sub: "陸生植物；偏生氣（煤）", x: 0.24, y: 0.95, c: C.orange },
    { name: "Type IV", sub: "已碳化；幾乎不生油氣", x: 0.21, y: 0.55, c: "#8a8f99" },
  ];
  const seg = (sx0: number, sy0: number, t0: number, t1: number) => {
    const pts: string[] = [];
    for (let t = t0; t <= t1 + 1e-9; t += 0.02) {
      const x = END.x + (sx0 - END.x) * (1 - t) ** 2;
      const y = END.y + (sy0 - END.y) * (1 - t * t);
      pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
    }
    return pts.join(" ");
  };
  return (
    <Fig
      caption="van Krevelen 圖：油母質的 H/C 和 O/C 原子比。左上富氫（Type I 藻類），右下富氧（Type III 陸生植物）。埋得越深越熱，每一型都沿箭頭往左下走：先失去 O（放出水和 CO₂，藍），再失去 H（先生油，綠；再生氣，紅），最後剩下幾乎純碳。H 越多越能生油，所以 Type I、II 是好的生油岩，Type III 主要生氣、也是煤的來源，Type IV 已經碳化、幾乎不生。"
      source="Tissot & Welte (1984)；課堂投影片 L17 p.12–13"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="油母質 van Krevelen 圖" style={{ maxWidth: 600, margin: "0 auto" }}>
        <Marks />
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0, 0.1, 0.2, 0.3].map((v) => (
          <text key={v} x={sx(v)} y={H - B + 16} textAnchor="middle" style={{ fontSize: 11 }}>{v}</text>
        ))}
        {[0, 0.5, 1, 1.5, 2].map((v) => (
          <text key={v} x={L - 8} y={sy(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v}</text>
        ))}
        <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }}>O/C 原子比</text>
        <text x={16} y={(T + H - B) / 2} transform={`rotate(-90 16 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }}>H/C 原子比</text>
        {types.map((t) => (
          <g key={t.name}>
            {t.name !== "Type IV" ? (
              <>
                <polyline points={seg(t.x, t.y, 0, 0.36)} fill="none" stroke={C.blue} strokeWidth={5} strokeOpacity={0.75} />
                <polyline points={seg(t.x, t.y, 0.34, 0.7)} fill="none" stroke={C.green} strokeWidth={5} strokeOpacity={0.75} />
                <polyline points={seg(t.x, t.y, 0.68, 1)} fill="none" stroke={C.rose} strokeWidth={5} strokeOpacity={0.75} />
              </>
            ) : (
              <polyline points={seg(t.x, t.y, 0, 1)} fill="none" stroke={t.c} strokeWidth={4} strokeDasharray="5 4" />
            )}
            <circle cx={sx(t.x)} cy={sy(t.y)} r={5} fill={t.c} stroke={INK} strokeWidth={1} />
            <text x={sx(t.x) + 10} y={sy(t.y) - 2} style={{ fontSize: 12.5, fontWeight: 800, fill: t.c, ...halo }}>{t.name}</text>
          </g>
        ))}
        <g transform={`translate(${W - R + 20},${T + 10})`}>
          {types.map((t, i) => (
            <g key={t.name} transform={`translate(0,${i * 36})`}>
              <circle cx={6} cy={-4} r={5} fill={t.c} />
              <text x={16} y={0} style={{ fontSize: 12, fontWeight: 800 }}>{t.name}</text>
              <text x={16} y={15} style={{ fontSize: 10.5, opacity: 0.8 }}>{t.sub}</text>
            </g>
          ))}
          {[
            [C.blue, "失去 H₂O、CO₂（成岩）"],
            [C.green, "生油"],
            [C.rose, "生氣 → 剩下碳"],
          ].map(([c, s], i) => (
            <g key={s} transform={`translate(0,${158 + i * 20})`}>
              <rect x={0} y={-9} width={12} height={10} fill={c} fillOpacity={0.8} />
              <text x={18} y={0} style={{ fontSize: 11 }}>{s}</text>
            </g>
          ))}
        </g>
        <circle cx={sx(END.x)} cy={sy(END.y)} r={4} fill={INK} />
        <text x={sx(0.02)} y={sy(0.18)} style={{ fontSize: 10.5, opacity: 0.75 }}>埋藏加熱 →（往左下）</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 油窗（互動） ═════════════ */

const ZONES: [number, number, string, string][] = [
  [-50, 75, "未成熟（生物氣）", "#9aa3b2"],
  [75, 150, "油窗", "var(--green, #3fa36b)"],
  [150, 225, "氣窗（濕氣 → 乾氣）", "#d0567a"],
  [225, 999, "過成熟（只剩甲烷、石墨化）", "#7a6f8f"],
];

export function OilWindowDemo() {
  const [g, setG] = useState(25); // °C/km
  const [z, setZ] = useState(4); // km
  const T0 = 15;
  const W = 360, H = 300, top = 26, bot = 280, maxZ = 10;
  const sy = (km: number) => top + (km / maxZ) * (bot - top);
  const zOf = (t: number) => (t - T0) / g;
  const T = T0 + g * z;
  const zone = ZONES.find(([a, b]) => T >= a && T < b)!;
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：油窗在多深？</b>
        <span>改地溫梯度，看生油的深度範圍怎麼移動</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="油窗隨地溫梯度的深度">
          <Marks />
          {ZONES.map(([a, b, name, c]) => {
            const z1 = Math.max(0, zOf(a)), z2 = Math.min(maxZ, zOf(b));
            if (z2 <= 0 || z1 >= maxZ) return null;
            return (
              <g key={name}>
                <rect x={70} y={sy(z1)} width={150} height={sy(z2) - sy(z1)} fill={c} fillOpacity={0.35} />
                {sy(z2) - sy(z1) > 16 ? (
                  <text x={145} y={(sy(z1) + sy(z2)) / 2 + 4 + (Math.abs((sy(z1) + sy(z2)) / 2 - sy(z)) < 12 ? 16 : 0)} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, ...halo }}>{name}</text>
                ) : null}
              </g>
            );
          })}
          <rect x={70} y={top} width={150} height={bot - top} fill="none" stroke={INK} strokeOpacity={0.5} />
          {Array.from({ length: maxZ + 1 }, (_, k) => (
            <g key={k}>
              <line x1={64} x2={70} y1={sy(k)} y2={sy(k)} stroke={INK} />
              <text x={60} y={sy(k) + 4} textAnchor="end" style={{ fontSize: 10.5 }}>{k}</text>
              <text x={226} y={sy(k) + 4} style={{ fontSize: 10, opacity: 0.7 }}>{fmt(T0 + g * k)} °C</text>
            </g>
          ))}
          <text x={18} y={top + 4} style={{ fontSize: 11, fontWeight: 700 }}>km</text>
          <line x1={70} x2={220} y1={sy(z)} y2={sy(z)} stroke={C.orange} strokeWidth={3} />
          <text x={282} y={sy(z) + 4} style={{ fontSize: 11.5, fontWeight: 800, fill: C.orange, ...halo }}>生油岩</text>
          <line x1={276} x2={224} y1={sy(z)} y2={sy(z)} stroke={C.orange} strokeWidth={1.5} markerEnd="url(#rs-o)" />
          <text x={145} y={16} textAnchor="middle" style={{ fontSize: 11, opacity: 0.8 }}>地表 {T0} °C</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>地溫梯度</span>
              <span>{g} °C/km</span>
            </label>
            <input type="range" min={15} max={50} step={1} value={g} onChange={(e) => setG(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>生油岩埋藏深度</span>
              <span>{fmt(z, 1)} km</span>
            </label>
            <input type="range" min={0.5} max={10} step={0.1} value={z} onChange={(e) => setZ(+e.target.value)} />
          </div>
          <div className="ix-readout">
            溫度 = {T0} + {g} × {fmt(z, 1)} = <b>{fmt(T)} °C</b>
            <br />→ <b>{zone[2]}</b>
            <br />油窗深度：{fmt(Math.max(0, zOf(75)), 1)}–{fmt(zOf(150), 1)} km
          </div>
          <div className="ix-note">生不生油看的是溫度（和時間），不是深度本身。地溫梯度高的地方（裂谷、弧後盆地），油窗比較淺；梯度低的地方（老的克拉通、隱沒帶前緣），要埋得更深才會熟。溫度範圍依投影片（油約 75–150 °C）；其他教科書常寫 60–120 °C。</div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ 石油系統：背斜圈閉 ═════════════ */

export function TrapFig() {
  const W = 620, H = 270;
  const arch = (y0: number, a: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 10) pts.push(`${x},${(y0 - a * Math.exp(-(((x - 330) / 150) ** 2))).toFixed(1)}`);
    return pts;
  };
  const band = (yTop: number, yBot: number, a: number) => [...arch(yTop, a), ...arch(yBot, a).reverse()].join(" ");
  // 油氣：在儲集層頂部、背斜頂
  const oilPts: string[] = [], gasPts: string[] = [];
  const top = (x: number) => 150 - 70 * Math.exp(-(((x - 330) / 150) ** 2));
  for (let x = 220; x <= 440; x += 4) {
    const y = top(x);
    if (y < 118) oilPts.push(`${x},${y.toFixed(1)}`);
  }
  for (let x = 260; x <= 400; x += 4) {
    const y = top(x);
    if (y < 98) gasPts.push(`${x},${y.toFixed(1)}`);
  }
  return (
    <Fig
      caption="石油系統的要素（剖面示意）。生油岩（富含油母質的頁岩）埋到油窗開始生油，油氣比水輕，沿著可滲透的地層和斷層往上移棲，進到孔隙度、滲透率高的儲集岩（砂岩、裂隙石灰岩），被上面不透水的頂蓋岩（頁岩、蒸發岩）擋住，在背斜頂部這種圈閉裡累積：氣在最上面、油在中間、下面是水。覆蓋岩提供把生油岩埋深加熱的重量。圈閉必須在油氣移棲之前就形成，這個時間關係叫關鍵時刻。"
      source="Magoon & Dow (1994)；課堂投影片 L17 p.15–17"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="背斜圈閉的石油系統" style={{ maxWidth: 620, margin: "0 auto" }}>
        <Marks />
        <polygon points={band(10, 60, 70)} fill={C.gold} fillOpacity={0.14} />
        <polygon points={band(60, 100, 70)} fill="#8a8f99" fillOpacity={0.45} />
        <polygon points={band(100, 150, 70)} fill={C.gold} fillOpacity={0.55} />
        <polygon points={band(150, 200, 70)} fill="#8a8f99" fillOpacity={0.2} />
        <polygon points={band(200, 240, 70)} fill={C.violet} fillOpacity={0.55} />
        <polygon points={`${oilPts.join(" ")}`} fill={C.green} fillOpacity={0.8} />
        <polygon points={`${gasPts.join(" ")}`} fill={C.rose} fillOpacity={0.85} />
        {[
          [120, 222, 150, 150],
          [520, 222, 490, 150],
          [230, 222, 255, 140],
        ].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2 + 10},${(y1 + y2) / 2} ${x2},${y2 - 6}`} fill="none" stroke={C.orange} strokeWidth={2.4} markerEnd="url(#rs-o)" />
        ))}
        {[
          [W - 8, 42, "覆蓋岩 overburden", "end"],
          [W - 8, 84, "頂蓋岩 seal（頁岩、蒸發岩）", "end"],
          [W - 8, 132, "儲集岩 reservoir（砂岩）", "end"],
          [W - 8, 230, "生油岩 source rock", "end"],
          [8, 182, "移棲 migration ↗", "start"],
        ].map(([x, y, t, a]) => (
          <text key={t as string} x={x as number} y={y as number} textAnchor={a as "end" | "start"} style={{ fontSize: 12, fontWeight: 800, ...halo }}>{t}</text>
        ))}
        <text x={330} y={70} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: C.rose, ...halo }}>氣</text>
        <text x={330} y={100} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: "#fff" }}>油</text>
        <text x={330} y={262} textAnchor="middle" style={{ fontSize: 11, opacity: 0.75 }}>背斜圈閉 anticline trap</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 斑岩銅礦與淺成熱液礦床 ═════════════ */

export function PorphyryFig() {
  const W = 620, H = 330;
  const ground = "M0,70 L210,62 L270,40 L300,22 L322,22 L350,42 L420,64 L620,72";
  return (
    <Fig
      caption="同一套岩漿–熱液系統，由深到淺形成不同的礦床。岩漿庫頂部的小岩株析出富含金屬和硫的流體，在岩株頂部和周圍形成網脈狀的斑岩銅礦（Cu、Mo、Au，大約地下 1–4 km）。往上靠近火山口，岩漿氣體凝結成強酸性流體，形成高硫化淺成熱液礦床（Au、Cu，例如金瓜石）。往側邊，流體和地下水（大氣水）混合、被中和，在沸騰帶形成低硫化淺成熱液礦床（Au、Ag），地表是溫泉。淺成熱液礦床離地表只有約 1 km，容易被侵蝕掉，所以多半很年輕。"
      source="Hedenquist & Lowenstern (1994)；Richards & Leybourne (2021)；課堂投影片 L17 p.34–37"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="斑岩與淺成熱液礦床" style={{ maxWidth: 620, margin: "0 auto" }}>
        <Marks />
        <path d={`${ground} L620,${H} L0,${H} z`} fill={C.gold} fillOpacity={0.12} />
        <path d={ground} fill="none" stroke={INK} strokeWidth={1.6} />
        {/* 岩漿庫與岩株 */}
        <path d={`M200,${H} C210,270 250,255 280,250 L285,170 C288,150 330,150 333,170 L338,250 C370,255 410,270 420,${H} z`} fill={C.orange} fillOpacity={0.55} stroke={C.orange} strokeWidth={1.5} />
        {/* 斑岩銅礦殼 */}
        <path d="M268,250 L272,165 C278,132 340,132 346,165 L350,250" fill="none" stroke={C.teal} strokeWidth={9} strokeOpacity={0.55} />
        {Array.from({ length: 22 }, (_, i) => {
          const a = (i / 21) * Math.PI;
          const cx = 309 + 44 * Math.cos(a), cy = 168 - 36 * Math.sin(a);
          return <line key={i} x1={cx - 5} y1={cy + 4} x2={cx + 5} y2={cy - 4} stroke={INK} strokeWidth={1} strokeOpacity={0.6} />;
        })}
        {/* 高硫化：火山口下方的通道 */}
        <path d="M300,128 C298,100 304,70 310,30" fill="none" stroke={C.rose} strokeWidth={14} strokeOpacity={0.45} />
        <path d="M318,128 C322,100 318,70 314,30" fill="none" stroke={C.rose} strokeWidth={6} strokeOpacity={0.35} />
        {/* 低硫化：側邊 */}
        <path d="M150,130 C170,110 185,90 196,66" fill="none" stroke={C.blue} strokeWidth={10} strokeOpacity={0.45} />
        <path d="M120,132 C135,115 140,96 146,68" fill="none" stroke={C.blue} strokeWidth={6} strokeOpacity={0.4} />
        {/* 大氣水循環 */}
        <path d="M40,80 C40,210 180,220 258,190" fill="none" stroke={C.blue} strokeWidth={1.8} strokeDasharray="6 4" markerEnd="url(#rs-b)" />
        <path d="M600,84 C600,210 450,220 362,190" fill="none" stroke={C.blue} strokeWidth={1.8} strokeDasharray="6 4" markerEnd="url(#rs-b)" />
        <path d="M240,170 C200,160 175,140 160,120" fill="none" stroke={C.orange} strokeWidth={1.6} markerEnd="url(#rs-o)" />
        {/* 溫泉 */}
        {[150, 196].map((x) => (
          <path key={x} d={`M${x - 6},${58 + (x > 170 ? 2 : 0)} q3,-8 0,-14 M${x + 2},${58 + (x > 170 ? 2 : 0)} q3,-8 0,-14`} fill="none" stroke={C.blue} strokeWidth={1.4} />
        ))}
        <path d="M304,18 q-6,-8 0,-14 q6,-6 0,-12" fill="none" stroke={INK} strokeWidth={1.4} strokeOpacity={0.6} />
        {/* 標籤 */}
        <text x={380} y={110} style={{ fontSize: 12.5, fontWeight: 800, fill: C.rose, ...halo }}>高硫化 Au、Cu</text>
        <text x={380} y={126} style={{ fontSize: 10.5, ...halo }}>岩漿氣體 → 強酸性流體</text>
        <line x1={378} x2={320} y1={106} y2={96} stroke={C.rose} strokeWidth={1.2} />
        <text x={30} y={46} style={{ fontSize: 12.5, fontWeight: 800, fill: C.blue, ...halo }}>低硫化 Au、Ag</text>
        <text x={30} y={30} style={{ fontSize: 10.5, ...halo }}>溫泉</text>
        <text x={40} y={152} style={{ fontSize: 10.5, ...halo }}>中性流體、沸騰</text>
        <text x={372} y={176} style={{ fontSize: 12.5, fontWeight: 800, fill: C.teal, ...halo }}>斑岩銅礦 Cu（Mo、Au）</text>
        <text x={372} y={192} style={{ fontSize: 10.5, ...halo }}>岩株頂部的網脈</text>
        <line x1={370} x2={350} y1={172} y2={160} stroke={C.teal} strokeWidth={1.2} />
        <text x={310} y={300} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, ...halo }}>岩漿庫</text>
        <text x={470} y={250} style={{ fontSize: 10.5, fill: C.blue, ...halo }}>大氣水往下循環</text>
        <line x1={600} x2={600} y1={250} y2={310} stroke={INK} strokeWidth={1.5} />
        <text x={594} y={284} textAnchor="end" style={{ fontSize: 10.5 }}>約 1 km</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ 甲烷水合物穩定帶（互動） ═════════════ */

// 甲烷水合物相平衡近似：T_eq(°C) = 10 ln(P / 2.6 MPa)；靜水壓 P ≈ 0.1 + 0.01 z (MPa, z m)
const teq = (z: number) => 10 * Math.log((0.1 + 0.01 * z) / 2.6);

export function HydrateDemo() {
  const [zw, setZw] = useState(1000);
  const [g, setG] = useState(40);
  const [tb, setTb] = useState(2);
  const Ts = 22;
  const tWater = (z: number) => tb + (Ts - tb) * Math.exp(-z / 250);
  const tSf = tWater(zw);
  const tAt = (z: number) => (z <= zw ? tWater(z) : tSf + (g * (z - zw)) / 1000);
  // 水中穩定帶頂
  let topW: number | null = null;
  for (let z = 0; z <= zw; z += 2) if (tAt(z) < teq(z)) { topW = z; break; }
  // 沉積物中的穩定帶底（BHSZ）
  let bhsz: number | null = null;
  if (tSf < teq(zw)) {
    bhsz = 0;
    for (let d = 0; d <= 3000; d += 2) {
      if (tAt(zw + d) >= teq(zw + d)) { bhsz = d; break; }
      bhsz = d;
    }
  }
  const W = 380, H = 300, L = 54, R = 16, T = 22, B = 34;
  const maxZ = zw + 900, maxT = 30;
  const sx = (t: number) => L + (Math.max(0, Math.min(maxT, t)) / maxT) * (W - L - R);
  const sy = (z: number) => T + (z / maxZ) * (H - T - B);
  const eqPts: string[] = [], tPts: string[] = [];
  for (let z = 0; z <= maxZ; z += maxZ / 120) {
    const e = teq(z);
    if (e >= 0) eqPts.push(`${sx(e).toFixed(1)},${sy(z).toFixed(1)}`);
    tPts.push(`${sx(tAt(z)).toFixed(1)},${sy(z).toFixed(1)}`);
  }
  const stepZ = maxZ > 2500 ? 1000 : 500;
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：甲烷水合物穩定帶</b>
        <span>改水深、地溫梯度、底層水溫，看海床下能存在多厚的「可燃冰」</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="甲烷水合物穩定帶">
          <rect x={L} y={sy(zw)} width={W - L - R} height={H - B - sy(zw)} fill={C.gold} fillOpacity={0.18} />
          <rect x={L} y={T} width={W - L - R} height={sy(zw) - T} fill={C.blue} fillOpacity={0.1} />
          {bhsz !== null && bhsz > 0 ? (
            <rect x={L} y={sy(zw)} width={W - L - R} height={sy(zw + bhsz) - sy(zw)} fill={C.teal} fillOpacity={0.35} />
          ) : null}
          <line x1={L} x2={W - R} y1={sy(zw)} y2={sy(zw)} stroke={INK} strokeWidth={1.5} />
          <text x={W - R - 4} y={sy(zw) - 5} textAnchor="end" style={{ fontSize: 10.5, fontWeight: 700, ...halo }}>海床</text>
          {bhsz !== null && bhsz > 0 ? (
            <>
              <line x1={L} x2={W - R} y1={sy(zw + bhsz)} y2={sy(zw + bhsz)} stroke={C.teal} strokeWidth={2} strokeDasharray="6 3" />
              <text x={W - R - 4} y={sy(zw + bhsz) + 13} textAnchor="end" style={{ fontSize: 10.5, fontWeight: 800, fill: C.teal, ...halo }}>穩定帶底（BSR）</text>
            </>
          ) : null}
          <polyline points={eqPts.join(" ")} fill="none" stroke={C.green} strokeWidth={2.4} />
          <polyline points={tPts.join(" ")} fill="none" stroke={C.rose} strokeWidth={2.2} strokeDasharray="5 3" />
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1} strokeOpacity={0.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.2} />
          {[0, 10, 20, 30].map((t) => (
            <text key={t} x={sx(t)} y={T - 6} textAnchor="middle" style={{ fontSize: 10.5 }}>{t}</text>
          ))}
          <text x={W - R} y={H - 10} textAnchor="end" style={{ fontSize: 11, fontWeight: 700 }}>溫度 °C（上方刻度）</text>
          {Array.from({ length: Math.floor(maxZ / stepZ) + 1 }, (_, k) => k * stepZ).map((z) => (
            <text key={z} x={L - 6} y={sy(z) + 4} textAnchor="end" style={{ fontSize: 10.5 }}>{z}</text>
          ))}
          <text x={6} y={H - 10} style={{ fontSize: 11, fontWeight: 700 }}>深度 m</text>
          <text x={sx(teq(maxZ * 0.25)) + 6} y={sy(maxZ * 0.25)} style={{ fontSize: 10.5, fill: C.green, fontWeight: 800, ...halo }}>相界線</text>
          <text x={sx(tAt(maxZ * 0.12)) + 6} y={sy(maxZ * 0.12)} style={{ fontSize: 10.5, fill: C.rose, fontWeight: 800, ...halo }}>實際溫度</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>水深</span>
              <span>{fmt(zw)} m</span>
            </label>
            <input type="range" min={200} max={3000} step={50} value={zw} onChange={(e) => setZw(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>沉積物地溫梯度</span>
              <span>{g} °C/km</span>
            </label>
            <input type="range" min={20} max={80} step={1} value={g} onChange={(e) => setG(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>深層水溫</span>
              <span>{tb} °C</span>
            </label>
            <input type="range" min={0} max={8} step={0.5} value={tb} onChange={(e) => setTb(+e.target.value)} />
          </div>
          <div className="ix-readout">
            海床溫度 {fmt(tSf, 1)} °C；相平衡溫度 {fmt(teq(zw), 1)} °C
            <br />水中穩定帶頂：<b>{topW !== null ? `${fmt(topW)} m` : "無"}</b>
            <br />海床下穩定帶厚度：<b>{bhsz !== null && bhsz > 0 ? `${fmt(bhsz)} m` : "0（不穩定）"}</b>
          </div>
          <div className="ix-note">綠線左邊（溫度低於相平衡溫度）水合物才穩定。水越深、壓力越大，相平衡溫度越高；進到沉積物後溫度隨地溫梯度上升，碰到綠線的地方就是穩定帶的底，震測上常看到一條和海床平行的反射（BSR）。梯度越大、穩定帶越薄。相平衡用簡化的近似式，數字只是大概。</div>
        </div>
      </div>
    </figure>
  );
}

