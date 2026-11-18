"use client";

import { useState, type ReactElement } from "react";
import { Fig } from "./Figs";
import "./notes.css";

// 地球構造 Ch13 葉理與劈理、Ch14 線理的自繪圖
const INK = "currentColor";
const C = {
  orange: "var(--orange)",
  teal: "var(--teal)",
  gold: "var(--gold)",
  navy: "var(--navy)",
  rose: "#d0567a",
  violet: "#8a6fd1",
  blue: "#5b8bd9",
  sage: "var(--sage)",
};
const deg = (r: number) => (r * 180) / Math.PI;
const halo = { paintOrder: "stroke" as const, stroke: "hsl(var(--card))", strokeWidth: 3 };

function Marks() {
  return (
    <defs>
      {[
        ["fb-k", "currentColor"],
        ["fb-o", C.orange],
        ["fb-t", C.teal],
        ["fb-r", C.rose],
      ].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

/* ═════════════ Ch13：劈理到葉理，隨溫度變化 ═════════════ */

function Micro({ kind }: { kind: number }) {
  // 每格 92×92 的微觀組構示意，原點在格子左上
  const lines: ReactElement[] = [];
  const rnd = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
  if (kind === 0) {
    // 壓密：扁平黏土片大致水平、鬆散
    for (let i = 0; i < 26; i++) {
      const x = 8 + rnd(i) * 70, y = 10 + rnd(i + 50) * 72, a = (rnd(i + 99) - 0.5) * 0.5;
      lines.push(<line key={i} x1={x} y1={y} x2={x + 14 * Math.cos(a)} y2={y + 14 * Math.sin(a)} stroke={INK} strokeWidth={1.4} />);
    }
  } else if (kind === 1) {
    // 鉛筆狀：層理（水平）＋初生劈理（垂直），裂成鉛筆
    for (let y = 14; y < 90; y += 14) lines.push(<line key={`h${y}`} x1={4} x2={88} y1={y} y2={y} stroke={INK} strokeWidth={1.2} />);
    for (let x = 14; x < 90; x += 16) lines.push(<line key={`v${x}`} x1={x} x2={x} y1={4} y2={88} stroke={C.rose} strokeWidth={1.2} strokeDasharray="5 3" />);
  } else if (kind === 2) {
    // 板劈理：密集平行（劈理域）夾微劈石
    for (let x = 6; x < 90; x += 5) lines.push(<line key={x} x1={x} x2={x} y1={4} y2={88} stroke={C.rose} strokeWidth={x % 15 === 6 ? 2.2 : 0.9} />);
  } else if (kind === 3) {
    // 千枚岩：細白雲母、綠泥石，略帶波狀光澤
    for (let x = 6; x < 90; x += 6) {
      const d = `M${x},4 ` + Array.from({ length: 9 }, (_, j) => `Q${x + (j % 2 ? 2.5 : -2.5)},${4 + j * 9.5 + 4.75} ${x},${4 + (j + 1) * 9.5}`).join(" ");
      lines.push(<path key={x} d={d} fill="none" stroke={C.teal} strokeWidth={1.1} />);
    }
  } else if (kind === 4) {
    // 片理：粗粒雲母繞過石榴子石
    lines.push(<circle key="g" cx={46} cy={46} r={12} fill={C.rose} fillOpacity={0.35} stroke={C.rose} strokeWidth={1.5} />);
    for (let x = 8; x < 90; x += 9) {
      const off = x - 46;
      const bend = Math.abs(off) < 22 ? Math.sign(off || 1) * (22 - Math.abs(off)) * 0.9 : 0;
      lines.push(<path key={x} d={`M${x},4 C${x},28 ${x + bend},34 ${x + bend},46 S${x},64 ${x},88`} fill="none" stroke={C.teal} strokeWidth={1.8} />);
    }
  } else {
    // 片麻岩：深淺條帶
    for (let i = 0; i < 6; i++) lines.push(<rect key={i} x={4 + i * 14.5} y={4} width={i % 2 ? 6 : 8.5} height={84} fill={i % 2 ? "#5a6070" : C.gold} fillOpacity={i % 2 ? 0.85 : 0.35} />);
  }
  return <g>{lines}</g>;
}

export function CleavageSeriesFig() {
  const items: [string, string, string][] = [
    ["壓密劈理", "compaction", "成岩、壓密"],
    ["鉛筆狀劈理", "pencil", "剛開始平行層縮短"],
    ["板劈理", "slaty", "≈ 250–350 °C"],
    ["千枚岩劈理", "phyllitic", "低綠色片岩相"],
    ["片理", "schistosity", "≳ 350–375 °C"],
    ["片麻岩葉理", "gneissic", "高變質度"],
  ];
  return (
    <Fig
      caption="同樣是泥質岩，埋得越深、越熱，平面組構就一路從「劈理」變成「片理」、「片麻岩葉理」。鉛筆狀劈理是層理（黑）和剛長出來的劈理（紅虛線）兩組面切出的鉛筆狀碎塊；板劈理是黏土（膨潤石→伊萊石）非常密的平行排列；千枚岩劈理由細粒白雲母、綠泥石構成；片理的雲母變粗、繞過石榴子石這類硬顆粒；片麻岩是淺色（石英＋長石）和深色（黑雲母、角閃石）條帶。大約 350–375 °C 以上就離開劈理的範圍。溫度只是大概。"
      source="Fossen (2016) Fig. 13.4；課堂投影片 Ch13 p.6、p.9–13"
    >
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="劈理與葉理隨溫度的變化" style={{ maxWidth: 640, margin: "0 auto" }}>
        <Marks />
        {items.map(([zh, en, t], i) => {
          const x = 10 + i * 104;
          return (
            <g key={en} transform={`translate(${x},12)`}>
              <rect x={0} y={0} width={92} height={92} fill="none" stroke={INK} strokeOpacity={0.5} />
              <Micro kind={i} />
              <text x={46} y={112} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{zh}</text>
              <text x={46} y={127} textAnchor="middle" style={{ fontSize: 10.5, opacity: 0.7 }}>{en}</text>
              <text x={46} y={143} textAnchor="middle" style={{ fontSize: 10.5, fill: C.orange, fontWeight: 700 }}>{t}</text>
            </g>
          );
        })}
        <line x1={20} x2={620} y1={172} y2={172} stroke={C.orange} strokeWidth={2.2} markerEnd="url(#fb-o)" />
        <text x={20} y={192} style={{ fontSize: 11.5, fontWeight: 700 }}>淺、冷</text>
        <text x={320} y={192} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 700 }}>
          劈理 cleavage ── 約 350 °C ── 片理、片麻岩葉理
        </text>
        <text x={620} y={192} textAnchor="end" style={{ fontSize: 11.5, fontWeight: 700 }}>深、熱</text>
      </svg>
    </Fig>
  );
}

/* ═════════════ Ch13：層理與軸面劈理的夾角（互動） ═════════════ */

// 原始褶皺 y = y0 + A sin(kx)，再加一個「上面往東」的簡單剪切 x' = x + G (Y0 − y)，得到向東伸向、軸面往西傾的褶皺
const A = 55, LAM = 320, K = (2 * Math.PI) / LAM, G = 1.2, Y0 = 140;
const xf = (x: number, y: number) => x + G * (Y0 - y) + 40;
const bedY = (x: number, y0: number) => y0 + A * Math.sin(K * x);
const AX_DIP = deg(Math.atan(1 / G)); // 軸面（＝劈理）傾角，往西

type Site = { id: string; x: number; name: string };
const SITES: Site[] = [
  { id: "a", x: 160, name: "背翼" },
  { id: "b", x: 240, name: "類背斜樞紐" },
  { id: "c", x: 300, name: "前翼（陡）" },
  { id: "d", x: 380, name: "前翼（緩）" },
  { id: "e", x: 80, name: "類向斜樞紐" },
];

function siteInfo(x: number) {
  const s = A * K * Math.cos(K * x); // 原始斜率（SVG y 往下）
  const dx = 1 - G * s; // 變形後沿層的 x 分量（dy = s）
  const over = dx < 0; // 年輕方向翻到下面 = 倒轉
  const dip = deg(Math.atan(Math.abs(s) / Math.max(Math.abs(dx), 1e-6)));
  // 往右（東）走時 y 增加 → 層往東傾；把方向統一成「往右走」
  const goesDownEast = (dx >= 0 ? s : -s) > 0;
  const dir = Math.abs(s) < 0.06 ? "" : goesDownEast ? "E" : "W";
  return { s, dip, dir, over };
}

export function BedCleavDemo() {
  const [sel, setSel] = useState("c");
  const W = 640, H = 270;
  const layers = [110, 140, 170];
  const path = (y0: number) => {
    const pts: string[] = [];
    for (let x = -260; x <= 760; x += 4) {
      const y = bedY(x, y0);
      pts.push(`${xf(x, y).toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };
  const site = SITES.find((s) => s.id === sel)!;
  const info = siteInfo(site.x);
  const hinge = Math.abs(info.s) < 0.06;
  let verdict: string, rule: string;
  if (hinge) {
    verdict = "樞紐帶：層理和劈理接近垂直";
    rule = "劈理平行軸面，在樞紐和層理大角度相交；從層理–劈理夾角看不出是哪一翼，但交線就是樞紐方向。";
  } else if (info.over) {
    verdict = "倒轉翼：層理比劈理陡，兩者同向傾";
    rule = `層理 ${info.dip.toFixed(0)}°${info.dir} ＞ 劈理 ${AX_DIP.toFixed(0)}°W，而且往同一邊傾 → 倒轉。Homework 13-01 露頭 A 就是這種情況，只是東西方向相反。`;
  } else if (info.dir === "W") {
    verdict = "正常翼：劈理比層理陡，兩者同向傾";
    rule = `劈理 ${AX_DIP.toFixed(0)}°W ＞ 層理 ${info.dip.toFixed(0)}°W → 地層正常（新的在上）。`;
  } else {
    verdict = "正常翼：層理和劈理往相反方向傾";
    rule = `層理 ${info.dip.toFixed(0)}°E、劈理 ${AX_DIP.toFixed(0)}°W，反向傾 → 一定是正常翼。`;
  }
  const sy = bedY(site.x, 140), sx = xf(site.x, sy);
  // 劈理線：x' = c + G (Y0 − y)
  const cl: ReactElement[] = [];
  for (let c = -200; c < 900; c += 26) {
    cl.push(<line key={c} x1={c + G * (Y0 - 20) + 40} y1={20} x2={c + G * (Y0 - 250) + 40} y2={250} stroke={C.rose} strokeWidth={1} strokeDasharray="5 4" strokeOpacity={0.55} />);
  }
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：用層理和劈理的夾角判斷翼部</b>
        <span>點剖面上的位置，看層理和軸面劈理怎麼相交</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="向東伸向的褶皺剖面，含軸面劈理">
          <defs>
            <clipPath id="fb-clip">
              <rect x={0} y={16} width={W} height={238} />
            </clipPath>
          </defs>
          <Marks />
          <g clipPath="url(#fb-clip)">
            <polygon points={`${path(110)} ${path(140).split(" ").reverse().join(" ")}`} fill={C.gold} fillOpacity={0.22} />
            <polygon points={`${path(140)} ${path(170).split(" ").reverse().join(" ")}`} fill={C.teal} fillOpacity={0.14} />
            {cl}
            {layers.map((y0) => (
              <polyline key={y0} points={path(y0)} fill="none" stroke={INK} strokeWidth={y0 === 140 ? 2.4 : 1.4} />
            ))}
          </g>
          <text x={8} y={12} style={{ fontSize: 11, fontWeight: 700 }}>W</text>
          <text x={W - 8} y={12} textAnchor="end" style={{ fontSize: 11, fontWeight: 700 }}>E</text>
          <text x={W / 2} y={12} textAnchor="middle" style={{ fontSize: 11, fill: C.rose, fontWeight: 700 }}>紅虛線 = 軸面劈理 S₁（往西傾 {AX_DIP.toFixed(0)}°）　金色層較新</text>
          {SITES.map((s) => {
            const y = bedY(s.x, 140), x = xf(s.x, y);
            const on = s.id === sel;
            return (
              <g key={s.id} style={{ cursor: "pointer" }} onClick={() => setSel(s.id)}>
                <circle cx={x} cy={y} r={on ? 9 : 7} fill={on ? C.orange : "hsl(var(--card))"} stroke={C.orange} strokeWidth={2} />
                <text x={x} y={y + 4} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: on ? "#fff" : C.orange }}>{s.id.toUpperCase()}</text>
              </g>
            );
          })}
          <text x={sx} y={sel === "b" ? sy - 16 : sy + 26} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, ...halo }}>{site.name}</text>
          <text x={8} y={H - 4} style={{ fontSize: 10.5, opacity: 0.7 }}>向東伸向的褶皺：前翼又陡又倒轉，背翼平緩</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-btns">
            {SITES.map((s) => (
              <button key={s.id} type="button" className="ix-btn" aria-pressed={sel === s.id} onClick={() => setSel(s.id)}>
                {s.id.toUpperCase()} {s.name}
              </button>
            ))}
          </div>
          <div className="ix-readout">
            層理 S₀：<b>{hinge ? "近水平" : `${info.dip.toFixed(0)}° ${info.dir}`}</b>
            <br />劈理 S₁：<b>{AX_DIP.toFixed(0)}° W</b>
            <br />
            <b style={{ color: info.over ? C.rose : C.teal }}>{verdict}</b>
          </div>
          <div className="ix-note">{rule}</div>
          <div className="ix-note">前提：劈理和褶皺同時形成、平行軸面（軸面劈理）。如果劈理是後來另一期變形疊上去的，這套判斷就不能用。</div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ Ch13：橫切劈理與走向滑移壓縮 ═════════════ */

export function TransectFig() {
  const panel = (ox: number, dextral: boolean) => {
    const s = dextral ? 1 : -1;
    const hingeA = s * 28; // 褶皺軸跡與剪切帶夾角（從東往北為正）
    const clA = hingeA + s * 12; // 劈理相對軸跡：右剪逆時針、左剪順時針
    const ln = (cx: number, cy: number, a: number, L: number, st: object, k: string) => {
      const r = (a * Math.PI) / 180;
      return <line key={k} x1={cx - (L / 2) * Math.cos(r)} y1={cy + (L / 2) * Math.sin(r)} x2={cx + (L / 2) * Math.cos(r)} y2={cy - (L / 2) * Math.sin(r)} {...st} />;
    };
    return (
      <g transform={`translate(${ox},0)`}>
        <rect x={10} y={40} width={290} height={130} fill={C.sage} fillOpacity={0.1} stroke={INK} strokeOpacity={0.4} />
        <line x1={20} x2={120} y1={30} y2={30} stroke={INK} strokeWidth={2} markerEnd="url(#fb-k)" transform={dextral ? "" : "translate(310,0) scale(-1,1) translate(0,0)"} />
        <line x1={290} x2={190} y1={182} y2={182} stroke={INK} strokeWidth={2} markerEnd="url(#fb-k)" transform={dextral ? "" : "translate(310,0) scale(-1,1)"} />
        {[70, 155, 240].map((cx, i) => ln(cx, 105, hingeA, 120, { stroke: INK, strokeWidth: 2.6 }, `h${i}`))}
        {[50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270].map((cx, i) => ln(cx, 105, clA, 70, { stroke: C.rose, strokeWidth: 1.2, strokeDasharray: "4 3" }, `c${i}`))}
        <text x={155} y={204} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{dextral ? "右剪（dextral）" : "左剪（sinistral）"}</text>
        <text x={155} y={222} textAnchor="middle" style={{ fontSize: 11.5, fill: C.rose, fontWeight: 700 }}>
          劈理相對軸跡{dextral ? "逆時針" : "順時針"}
        </text>
      </g>
    );
  };
  return (
    <Fig
      caption="平面圖。走向滑移加上擠壓（transpression，純剪＋簡單剪切）時，劈理和同時期褶皺的軸面不平行，劈理「橫切」褶皺（實線＝褶皺軸跡，紅虛線＝劈理）。右剪時劈理相對軸跡逆時針轉，左剪時順時針。反過來，量到劈理相對軸跡往哪邊轉，就能判斷剪切方向。"
      source="Fossen (2016) Fig. 13.21；課堂投影片 Ch13 p.28–29"
    >
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="橫切劈理與剪切方向" style={{ maxWidth: 640, margin: "0 auto" }}>
        <Marks />
        {panel(10, true)}
        {panel(330, false)}
      </svg>
    </Fig>
  );
}

/* ═════════════ Ch14：各種線理 ═════════════ */

function LinPanel({ i }: { i: number }) {
  const g: ReactElement[] = [];
  // 斜視的平面（平行四邊形）
  const plane = <polygon key="p" points="10,80 120,80 140,40 30,40" fill={C.sage} fillOpacity={0.14} stroke={INK} strokeOpacity={0.5} />;
  if (i === 0) {
    // 拉伸線理：拉長的礫石
    g.push(plane);
    [[45, 52], [80, 50], [110, 48], [55, 68], [95, 68], [125, 60]].forEach(([x, y], k) => g.push(<ellipse key={k} cx={x} cy={y} rx={14} ry={3.2} fill={C.gold} fillOpacity={0.6} stroke={INK} strokeWidth={0.8} />));
  } else if (i === 1) {
    // 礦物線理：針狀礦物
    g.push(plane);
    for (let k = 0; k < 16; k++) {
      const x = 32 + (k % 6) * 17 + (k > 5 ? 6 : 0) - (k > 11 ? 14 : 0), y = 48 + Math.floor(k / 6) * 11;
      g.push(<line key={k} x1={x} x2={x + 13} y1={y} y2={y} stroke={C.blue} strokeWidth={2.4} strokeLinecap="round" />);
    }
  } else if (i === 2) {
    // 交面線理：層理面上的劈理痕跡
    g.push(plane);
    for (let x = 14; x < 118; x += 11) g.push(<line key={x} x1={x} y1={80} x2={x + 20} y2={40} stroke={C.rose} strokeWidth={1.3} />);
    g.push(<polygon key="cl" points="70,80 90,40 90,12 70,52" fill={C.rose} fillOpacity={0.15} stroke={C.rose} strokeOpacity={0.6} />);
  } else if (i === 3) {
    // 夾皺線理：小皺紋的樞紐
    g.push(plane);
    for (let r = 0; r < 4; r++) {
      const y0 = 46 + r * 10;
      const d = `M${34 - r * 5},${y0} ` + Array.from({ length: 5 }, () => `q4,-5 8,0 q4,5 8,0`).join(" ");
      g.push(<path key={r} d={d} fill="none" stroke={C.teal} strokeWidth={1.4} />);
    }
  } else if (i === 4) {
    // 串腸構造
    g.push(<rect key="m" x={10} y={30} width={130} height={56} fill={C.sage} fillOpacity={0.12} />);
    [[14, 34], [52, 32], [90, 36]].forEach(([x, w], k) => g.push(<path key={k} d={`M${x},58 Q${x + w / 2},40 ${x + w},58 Q${x + w / 2},76 ${x},58 z`} fill={C.gold} fillOpacity={0.6} stroke={INK} strokeWidth={1} />));
    g.push(<line key="a1" x1={8} x2={40} y1={96} y2={96} stroke={C.orange} strokeWidth={1.8} markerStart="url(#fb-o)" />);
    g.push(<line key="a2" x1={110} x2={142} y1={96} y2={96} stroke={C.orange} strokeWidth={1.8} markerEnd="url(#fb-o)" />);
  } else if (i === 5) {
    // 窗櫺：硬層凸起、尖端指向硬層
    g.push(<rect key="s" x={10} y={30} width={130} height={30} fill={INK} fillOpacity={0.22} />);
    g.push(<rect key="w" x={10} y={60} width={130} height={30} fill={C.sage} fillOpacity={0.12} />);
    const d = "M10,60 " + [0, 1, 2, 3].map((k) => `Q${26 + k * 32},${86} ${42 + k * 32},${60}`).join(" ");
    g.push(<path key="i" d={`${d} L142,60`} fill={INK} fillOpacity={0.22} stroke={INK} strokeWidth={1.4} />);
    g.push(<text key="t1" x={14} y={46} style={{ fontSize: 10 }}>硬</text>);
    g.push(<text key="t2" x={124} y={86} style={{ fontSize: 10 }}>軟</text>);
  } else if (i === 6) {
    // 擦痕＋階狀
    g.push(plane);
    for (let y = 46; y < 80; y += 6) g.push(<line key={y} x1={30 - (y - 40) / 2} x2={128 - (y - 40) / 2} y1={y} y2={y} stroke={INK} strokeWidth={0.8} strokeOpacity={0.7} />);
    [50, 80, 108].forEach((x, k) => g.push(<path key={`s${k}`} d={`M${x},44 l-8,10 l4,0 l-8,10 l4,0 l-8,10`} fill="none" stroke={C.orange} strokeWidth={1.6} />));
  } else {
    // 褶皺樞紐（幾何線理）
    const d = "M10,80 Q40,20 70,80 Q100,20 130,80";
    g.push(<path key="f" d={d} fill="none" stroke={INK} strokeWidth={1.8} />);
    g.push(<path key="f2" d="M30,60 Q60,0 90,60 Q120,0 150,60" fill="none" stroke={INK} strokeWidth={1.2} strokeOpacity={0.5} />);
    g.push(<line key="h1" x1={40} y1={50} x2={60} y2={30} stroke={C.orange} strokeWidth={2.2} />);
    g.push(<line key="h2" x1={100} y1={50} x2={120} y2={30} stroke={C.orange} strokeWidth={2.2} />);
  }
  return <g>{g}</g>;
}

export function LineationTypesFig() {
  const labs: [string, string][] = [
    ["拉伸線理", "被拉長的礫石、顆粒 → X 軸"],
    ["礦物線理", "針狀、柱狀礦物排列"],
    ["交面線理", "後來的劈理切過層理面"],
    ["夾皺線理", "小皺紋的樞紐"],
    ["串腸構造", "硬層被拉斷；串腸軸"],
    ["窗櫺構造", "軟硬界面的尖狀波紋"],
    ["擦痕、階狀", "斷層面上；脆性"],
    ["褶皺樞紐", "幾何線理"],
  ];
  return (
    <Fig
      caption="常見的線理。拉伸線理、礦物線理通常記錄應變橢球的 X 軸（最大伸長）；交面線理、夾皺線理、褶皺樞紐是兩組面相交或彎曲產生的「幾何線理」，不直接代表伸長方向；串腸構造是硬層被平行層面拉伸的結果，串腸軸垂直拉伸方向；窗櫺構造是軟硬層界面的尖狀波紋，硬層凸進軟層；擦痕和纖維狀礦物記錄斷層滑動方向。"
      source="Fossen (2016) Ch. 14；課堂投影片 Ch14 p.3、p.7–13"
    >
      <svg viewBox="0 0 640 290" className="ix-svg" role="img" aria-label="八種線理" style={{ maxWidth: 640, margin: "0 auto" }}>
        <Marks />
        {labs.map(([t, s], i) => (
          <g key={t} transform={`translate(${8 + (i % 4) * 158},${(i < 4 ? 0 : 1) * 145})`}>
            <LinPanel i={i} />
            <text x={75} y={112} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{t}</text>
            <text x={75} y={128} textAnchor="middle" style={{ fontSize: 10.5, opacity: 0.75 }}>{s}</text>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/* ═════════════ Ch14：同向脈與反向脈 ═════════════ */

export function VeinGrowthFig() {
  const vein = (ox: number, syn: boolean) => {
    const g: ReactElement[] = [];
    const L = 40, R = 220; // 脈壁 x
    const mid = (L + R) / 2;
    g.push(<rect key="wl" x={0} y={30} width={L} height={150} fill={C.sage} fillOpacity={0.25} />);
    g.push(<rect key="wr" x={R} y={30} width={40} height={150} fill={C.sage} fillOpacity={0.25} />);
    for (let y = 40; y < 175; y += 13) {
      if (syn) {
        // 從兩壁往中間長：靠壁老、中間新；同成分
        g.push(<line key={`a${y}`} x1={L} x2={mid - 2} y1={y} y2={y + 2} stroke={C.teal} strokeWidth={6} strokeOpacity={0.55} />);
        g.push(<line key={`b${y}`} x1={R} x2={mid + 2} y1={y + 1} y2={y + 3} stroke={C.teal} strokeWidth={6} strokeOpacity={0.55} />);
      } else {
        // 纖維從中間（median zone）往兩壁長：中間老、靠壁新；成分和圍岩不同
        g.push(<line key={`a${y}`} x1={L} x2={R} y1={y} y2={y + 4} stroke={C.gold} strokeWidth={4} strokeOpacity={0.7} />);
      }
    }
    if (syn) {
      // crack-seal 的包裹體帶
      [70, 95, 115].forEach((x, k) => g.push(<line key={`cs${k}`} x1={x} x2={x} y1={32} y2={178} stroke={INK} strokeDasharray="2 4" strokeOpacity={0.6} />));
      [145, 165, 190].forEach((x, k) => g.push(<line key={`cr${k}`} x1={x} x2={x} y1={32} y2={178} stroke={INK} strokeDasharray="2 4" strokeOpacity={0.6} />));
      g.push(<line key="m" x1={mid} x2={mid} y1={30} y2={180} stroke={C.rose} strokeWidth={2} />);
    } else {
      g.push(<rect key="m" x={mid - 4} y={30} width={8} height={150} fill={C.rose} fillOpacity={0.4} />);
      g.push(<line key="gl" x1={L} x2={L} y1={30} y2={180} stroke={C.rose} strokeWidth={2} />);
      g.push(<line key="gr" x1={R} x2={R} y1={30} y2={180} stroke={C.rose} strokeWidth={2} />);
    }
    return (
      <g transform={`translate(${ox},0)`}>
        {g}
        <text x={130} y={20} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{syn ? "同向脈 synaxial" : "反向脈 antiaxial"}</text>
        <text x={syn ? L + 4 : mid} y={196} textAnchor={syn ? "start" : "middle"} style={{ fontSize: 10.5, fill: C.orange, fontWeight: 700 }}>{syn ? "老 ←" : "老（中間帶）"}</text>
        <text x={syn ? mid : L + 4} y={196} textAnchor={syn ? "middle" : "start"} style={{ fontSize: 10.5, fill: C.orange, fontWeight: 700 }}>{syn ? "新（生長面）" : "新 ←"}</text>
        <text x={130} y={214} textAnchor="middle" style={{ fontSize: 10.5, opacity: 0.8 }}>{syn ? "從脈壁往中間長；和圍岩同礦物；crack-seal" : "從中間帶往兩壁長；纖維、和圍岩不同礦物"}</text>
      </g>
    );
  };
  return (
    <Fig
      caption="兩種纖維脈。同向脈：晶體從脈壁往中間長，最老的部分貼著脈壁，礦物和圍岩一樣；反覆裂開、癒合（crack-seal）會留下平行脈壁的細包裹體帶（虛線），生長面（紅線）在中間。反向脈：真正的纖維狀礦物、成分和圍岩不同，中間保留一條中間帶（最老），脈往兩側脈壁的兩個生長面（紅線）長寬。纖維方向記錄的是開裂的方向，可以是 ISA₁，也可以垂直脈壁。"
      source="Fossen (2016) Fig. 14.20–14.21；課堂投影片 Ch14 p.17–18"
    >
      <svg viewBox="0 0 560 222" className="ix-svg" role="img" aria-label="同向脈與反向脈" style={{ maxWidth: 560, margin: "0 auto" }}>
        {vein(10, true)}
        {vein(290, false)}
      </svg>
    </Fig>
  );
}
