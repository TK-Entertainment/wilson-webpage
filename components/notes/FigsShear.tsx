"use client";

import { useMemo, useState, type ReactElement } from "react";
import { Fig } from "./Figs";
import "./notes.css";

// 地球構造 Ch15 串腸構造、Ch16 剪切帶與糜稜岩的自繪圖與互動圖
const INK = "currentColor";
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", violet: "#8a6fd1", blue: "#5b8bd9" };
const fmt = (x: number, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const halo = { paintOrder: "stroke" as const, stroke: "hsl(var(--card))", strokeWidth: 3 };

/* ═════════════ Ch15：串腸的幾種形狀 ═════════════ */

export function BoudinTypesFig() {
  const row = (y: number, label: string, sub: string, body: ReactElement) => (
    <g>
      <text x={12} y={y - 22} style={{ fontSize: 12.5, fontWeight: 800 }}>{label}</text>
      <text x={12} y={y - 8} style={{ fontSize: 11, opacity: 0.8 }}>{sub}</text>
      <line x1={210} x2={600} y1={y - 22} y2={y - 22} stroke={INK} strokeOpacity={0.25} />
      <line x1={210} x2={600} y1={y + 22} y2={y + 22} stroke={INK} strokeOpacity={0.25} />
      {body}
    </g>
  );
  const fill = { fill: C.teal, fillOpacity: 0.35, stroke: C.teal, strokeWidth: 2 };
  const qz = { fill: C.gold, fillOpacity: 0.5, stroke: "none" };
  const xs = [220, 320, 420, 520];
  return (
    <Fig
      caption="串腸的形狀反映強層和基質的黏度差，以及強層裡塑性變形的多寡（Ramberg 的實驗，投影片 p.6）。黏度差越大、應變速率越高，強層越脆，拉斷成方正的矩形串腸，縫隙常被熱液石英填滿；強層有一點塑性就變成桶狀；邊緣塑性變形明顯時兩端裂開成魚嘴狀；黏度差小時根本不斷，只形成縮頸–膨脹構造。"
      source="課堂投影片（陳采蔚）Ch15 p.2–8；Fossen, Structural Geology, Ch14"
    >
      <svg viewBox="0 0 620 330" className="fg-svg" role="img" aria-label="四種串腸形狀：矩形、桶狀、魚嘴狀、縮頸膨脹">
        {row(50, "(a) 矩形", "黏度差大、脆性斷開", (
          <g>
            {xs.map((x, i) => <rect key={i} x={x} y={36} width={78} height={28} {...fill} />)}
            {[298, 398, 498].map((x, i) => <polygon key={i} points={`${x},36 ${x + 22},36 ${x + 22},64 ${x},64`} {...qz} />)}
            <text x={505} y={84} style={{ fontSize: 10.5, opacity: 0.8 }}>縫裡填石英</text>
          </g>
        ))}
        {row(125, "(b) 桶狀", "強層有一點塑性", (
          <g>
            {xs.map((x, i) => (
              <path key={i} d={`M${x + 4},112 Q${x + 39},106 ${x + 74},112 Q${x + 80},125 ${x + 74},138 Q${x + 39},144 ${x + 4},138 Q${x - 2},125 ${x + 4},112 Z`} {...fill} />
            ))}
          </g>
        ))}
        {row(200, "(c) 魚嘴狀", "邊緣塑性、內部較硬", (
          <g>
            {xs.map((x, i) => (
              <path key={i} d={`M${x + 2},186 L${x + 76},186 L${x + 66},200 L${x + 76},214 L${x + 2},214 L${x + 12},200 Z`} {...fill} />
            ))}
          </g>
        ))}
        {row(275, "(d) 縮頸–膨脹", "黏度差小、沒有斷", (
          <path
            d={Array.from({ length: 81 }, (_, i) => {
              const x = 215 + i * 4.8;
              const h = 6 + 8 * (0.5 + 0.5 * Math.cos(((x - 215) / 98) * 2 * Math.PI));
              return `${i ? "L" : "M"}${x},${275 - h}`;
            }).join(" ") +
              " " +
              Array.from({ length: 81 }, (_, i) => {
                const x = 215 + (80 - i) * 4.8;
                const h = 6 + 8 * (0.5 + 0.5 * Math.cos(((x - 215) / 98) * 2 * Math.PI));
                return `L${x},${275 + h}`;
              }).join(" ") +
              " Z"}
            {...fill}
          />
        ))}
        <g style={{ fontSize: 11 }}>
          <line x1={230} x2={300} y1={318} y2={318} stroke={INK} strokeWidth={1.5} markerStart="url(#bt-a)" />
          <line x1={520} x2={590} y1={318} y2={318} stroke={INK} strokeWidth={1.5} markerEnd="url(#bt-a)" />
          <text x={410} y={322} textAnchor="middle">平行層面伸張</text>
        </g>
        <defs>
          <marker id="bt-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>
      </svg>
    </Fig>
  );
}

/* ═════════════ Ch15：應力傳遞模型（串腸長度為什麼差不多） ═════════════ */

// 固定種子的亂數，讓圖每次一樣
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function BoudinDemo() {
  const [ratio, setRatio] = useState(6); // σt/τ = 臨界長度 Lc/T
  const [noise, setNoise] = useState(15); // 斷點偏離中點的程度（%）
  const T = 1, TOTAL = 60; // 層厚 1，總長 60 倍層厚
  const segs = useMemo(() => {
    const r = rng(7);
    const Lc = ratio * T;
    const out: number[] = [];
    const queue = [TOTAL];
    while (queue.length) {
      const L = queue.shift()!;
      if (L > Lc) {
        const f = 0.5 + ((r() - 0.5) * 2 * noise) / 100; // 斷在中點附近
        queue.unshift(L * (1 - f));
        queue.unshift(L * f);
      } else out.push(L);
    }
    return out;
  }, [ratio, noise]);
  const W = 360, H = 230, L0 = 12;
  const gap = 3;
  const scale = (W - 2 * L0 - gap * (segs.length - 1)) / TOTAL;
  let cx = L0;
  const rects = segs.map((L) => {
    const x = cx;
    cx += L * scale + gap;
    return { x, w: L * scale, L };
  });
  const ars = segs.map((L) => L / T);
  const mean = ars.reduce((a, b) => a + b, 0) / ars.length;
  // 一段強層裡的張應力：上下兩面各有剪應力 τ，從端點往內累積，σ(s)/τ = 2·min(s, L − s)/T，中間最大 = L/T
  const sc = 44 / ratio; // σt 那條線固定畫在基線上方 44 px
  const prof = (L: number, px0: number) => {
    const pw = 130, base = 205;
    const pts = Array.from({ length: 41 }, (_, i) => {
      const s = (i / 40) * L;
      return `${px0 + (i / 40) * pw},${base - 2 * Math.min(s, L - s) * sc}`;
    }).join(" ");
    return { pts, px0, pw, base };
  };
  const longest = Math.max(...segs);
  const P = prof(longest, 22);
  const P2 = prof(1.5 * ratio, 196);
  const yT = P.base - ratio * sc;
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：串腸為什麼長度差不多</b>
        <span>改變強層的抗張強度／界面剪應力</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="強層被反覆從中間拉斷，直到每段都短於臨界長度">
          <text x={L0} y={18} style={{ fontSize: 11.5, fontWeight: 800 }}>拉斷後的強層（總長 = 60 倍層厚）</text>
          <rect x={L0} y={30} width={W - 2 * L0} height={36} fill={INK} fillOpacity={0.06} />
          {rects.map((r, i) => (
            <rect key={i} x={r.x} y={40} width={r.w} height={16} fill={C.teal} fillOpacity={0.45} stroke={C.teal} strokeWidth={1.5} />
          ))}
          <text x={L0} y={88} style={{ fontSize: 11 }}>{segs.length} 段；長寬比 W/T 介於 {fmt(Math.min(...ars), 1)} 和 {fmt(Math.max(...ars), 1)}</text>
          <text x={L0} y={112} style={{ fontSize: 11.5, fontWeight: 800 }}>一段強層裡的張應力 σ（中間最大）</text>
          <line x1={P.px0} x2={P.px0 + P.pw} y1={P.base} y2={P.base} stroke={INK} strokeWidth={1.2} />
          <line x1={P2.px0} x2={P2.px0 + P2.pw} y1={P2.base} y2={P2.base} stroke={INK} strokeWidth={1.2} />
          <line x1={P.px0 - 6} x2={P2.px0 + P2.pw + 6} y1={yT} y2={yT} stroke={C.rose} strokeDasharray="5 4" />
          <text x={P2.px0 + P2.pw + 6} y={yT - 5} textAnchor="end" style={{ fontSize: 10.5, fill: C.rose, fontWeight: 800, ...halo }}>抗張強度 σt</text>
          <polyline points={P2.pts} fill="none" stroke={C.orange} strokeWidth={2} strokeDasharray="5 3" />
          <polyline points={P.pts} fill="none" stroke={C.teal} strokeWidth={2.5} />
          <text x={P.px0 + P.pw / 2} y={P.base + 16} textAnchor="middle" style={{ fontSize: 10.5 }}>最長的一段（{fmt(longest, 1)}T）</text>
          <text x={P2.px0 + P2.pw / 2} y={P2.base + 16} textAnchor="middle" style={{ fontSize: 10.5 }}>長 1.5L<tspan baselineShift="sub" fontSize="8">c</tspan> 的一段 → 中間斷</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>σt/τ（臨界長度 Lc/T）</span>
              <span>{fmt(ratio, 1)}</span>
            </label>
            <input type="range" min={2} max={10} step={0.5} value={ratio} onChange={(e) => setRatio(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>斷點偏離中點</span>
              <span>±{noise}%</span>
            </label>
            <input type="range" min={0} max={30} step={5} value={noise} onChange={(e) => setNoise(+e.target.value)} />
          </div>
          <div className="ix-readout">
            臨界長度 L<sub>c</sub> = σ<sub>t</sub>T/τ = <b>{fmt(ratio, 1)}T</b>
            <br />平均長寬比 W/T = <b>{fmt(mean, 1)}</b>
            <br />理論範圍：({fmt(0.5 - noise / 100, 2)})L<sub>c</sub> 到 L<sub>c</sub>（{fmt((0.5 - noise / 100) * ratio, 1)}–{fmt(ratio, 1)}）
          </div>
          <div className="ix-note">
            軟基質流過強層時，在上下界面施加剪應力 τ；張力從兩端往中間累積，所以中間的 σ 最大。一段長於 L<sub>c</sub> 就會在中間附近斷掉，斷成的兩半再各自累積應力，直到每段都短於 L<sub>c</sub>。所以串腸的長度「差不多但不完全一樣」：都從正中間斷時落在 L<sub>c</sub>/2 到 L<sub>c</sub>，斷點偏離中點越多，下限越低；投影片說的 2–4 對應 σt/τ 約 4–8。這是簡化的力平衡模型，不是投影片的內容。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ Ch16：剪切帶的 γ 剖面、葉理轉角與位移 ═════════════ */

export function ShearZoneDemo() {
  const [gmax, setGmax] = useState(6);
  const [wid, setWid] = useState(1.0); // 剪切帶寬度（m）
  const N = 121;
  const ys = Array.from({ length: N }, (_, i) => -0.75 + (1.5 * i) / (N - 1)); // 以帶寬為 1 的相對座標
  const gam = (y: number) => (Math.abs(y) < 0.5 ? gmax * (1 - (2 * y) ** 2) ** 2 : 0);
  // 位移 u(y) = ∫ γ dy（實際座標乘帶寬）
  const u: number[] = [];
  let acc = 0;
  ys.forEach((y, i) => {
    if (i > 0) acc += ((gam(y) + gam(ys[i - 1])) / 2) * (y - ys[i - 1]) * wid;
    u.push(acc);
  });
  const d = acc;
  const theta = (g: number) => (g > 1e-6 ? 0.5 * Math.atan(2 / g) : Math.PI / 4);
  const Rmax = ((gmax + Math.sqrt(gmax * gmax + 4)) / 2) ** 2;

  const W = 420, H = 322;
  // 左圖：剪切帶示意（y 往上），x 方向畫位移
  const lx0 = 20, lw = 240, ly0 = 20, lh = 260;
  const Yp = (y: number) => ly0 + ((0.75 - y) / 1.5) * lh;
  const uMax = Math.max(d, 0.001);
  const Xu = (v: number) => lx0 + 40 + (v / uMax) * (lw - 80);
  const marker = ys.map((y, i) => `${Xu(u[i])},${Yp(y)}`).join(" ");
  // 葉理短線
  const ticks = [];
  for (let k = 0; k < 13; k++) {
    const y = -0.45 + k * 0.075;
    const g = gam(y);
    const th = theta(g);
    for (let j = 0; j < 4; j++) {
      const x0 = lx0 + 30 + j * 55 + ((k % 2) * 27);
      const len = 9 + Math.min(g, 15) * 0.9;
      ticks.push(
        <line key={`${k}-${j}`} x1={x0 - len * Math.cos(th)} y1={Yp(y) + len * Math.sin(th)} x2={x0 + len * Math.cos(th)} y2={Yp(y) - len * Math.sin(th)} stroke={C.violet} strokeWidth={1.6} strokeOpacity={0.8} />,
      );
    }
  }
  // 右圖：γ(y) 剖面
  const rx0 = 290, rw = 115;
  const Xg = (g: number) => rx0 + (g / 20) * rw;
  const gpath = ys.map((y) => `${Xg(gam(y))},${Yp(y)}`).join(" ");
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：剪切帶裡的葉理轉角與位移</b>
        <span>拉中心的剪應變 γ 和帶寬</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="剪切帶中葉理角度隨剪應變變化，以及標記線的位移">
          <rect x={lx0} y={Yp(0.5)} width={lw} height={Yp(-0.5) - Yp(0.5)} fill={C.teal} fillOpacity={0.08} />
          <line x1={lx0} x2={lx0 + lw} y1={Yp(0.5)} y2={Yp(0.5)} stroke={INK} strokeDasharray="4 3" strokeOpacity={0.5} />
          <line x1={lx0} x2={lx0 + lw} y1={Yp(-0.5)} y2={Yp(-0.5)} stroke={INK} strokeDasharray="4 3" strokeOpacity={0.5} />
          {ticks}
          <polyline points={marker} fill="none" stroke={C.orange} strokeWidth={3} />
          <text x={lx0 + 4} y={Yp(0.62)} style={{ fontSize: 10.5, opacity: 0.85 }}>上盤 →</text>
          <text x={lx0 + lw - 4} y={Yp(-0.66)} textAnchor="end" style={{ fontSize: 10.5, opacity: 0.85 }}>← 下盤</text>
          <text x={Xu(0) + 4} y={Yp(-0.72)} style={{ fontSize: 10.5, fill: C.orange, fontWeight: 800, ...halo }}>原本垂直的標記</text>
          <line x1={rx0} x2={rx0} y1={ly0} y2={ly0 + lh} stroke={INK} strokeWidth={1.2} />
          {[0, 10, 20].map((g) => (
            <text key={g} x={Xg(g)} y={ly0 + lh + 14} textAnchor="middle" style={{ fontSize: 10.5 }}>{g}</text>
          ))}
          <polygon points={`${rx0},${Yp(0.75)} ${gpath} ${rx0},${Yp(-0.75)}`} fill={C.gold} fillOpacity={0.35} />
          <polyline points={gpath} fill="none" stroke={C.gold} strokeWidth={2.5} />
          <text x={rx0 + 4} y={ly0 + 10} style={{ fontSize: 11, fontWeight: 800 }}>γ(y)</text>
          <text x={rx0 + rw / 2} y={ly0 + lh + 27} textAnchor="middle" style={{ fontSize: 10.5 }}>面積 = 位移 d</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>中心剪應變 γ<sub>max</sub></span>
              <span>{fmt(gmax, 1)}</span>
            </label>
            <input type="range" min={0.5} max={20} step={0.5} value={gmax} onChange={(e) => setGmax(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>剪切帶寬度</span>
              <span>{fmt(wid, 1)} m</span>
            </label>
            <input type="range" min={0.2} max={5} step={0.1} value={wid} onChange={(e) => setWid(+e.target.value)} />
          </div>
          <div className="ix-readout">
            中心葉理角 θ′ = ½ tan⁻¹(2/γ) = <b>{fmt((theta(gmax) * 180) / Math.PI, 1)}°</b>
            <br />中心應變橢圓 R = X/Z = <b>{fmt(Rmax, 1)}</b>
            <br />總位移 d = ∫γ dy = <b>{fmt(d, 2)} m</b>
          </div>
          <div className="ix-note">
            紫色短線是剪切帶裡新長的葉理（應變橢圓的 XY 面）：邊緣 γ ≈ 0，葉理和剪切帶夾 45°；往中心 γ 變大，葉理轉向剪切帶、越來越平行。橘線是原本垂直的標記，被拉成 S 形，右端的總偏移就是 γ 剖面下的面積。γ 的形狀假設為對稱的鐘形。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ Ch16：剪切方向指標一覽（全部右行） ═════════════ */

export function KinematicIndicatorsFig() {
  const PW = 150, PH = 112;
  const panel = (i: number, title: string, body: ReactElement) => {
    const col = i % 4, rowi = Math.floor(i / 4);
    const x = 8 + col * (PW + 6), y = 8 + rowi * (PH + 26);
    return (
      <g key={i} transform={`translate(${x},${y})`}>
        <rect x={0} y={0} width={PW} height={PH} fill="none" stroke={INK} strokeOpacity={0.35} />
        <g transform="translate(0,6)">{body}</g>
        <line x1={PW / 2 - 16} x2={PW / 2 + 16} y1={7} y2={7} stroke={C.navy} strokeWidth={2} markerEnd="url(#ki-a)" />
        <line x1={PW / 2 + 16} x2={PW / 2 - 16} y1={PH - 5} y2={PH - 5} stroke={C.navy} strokeWidth={2} markerEnd="url(#ki-a)" />
        <text x={PW / 2} y={PH + 16} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{title}</text>
      </g>
    );
  };
  const line = { stroke: INK, strokeWidth: 1.3, fill: "none" };
  const grey = { fill: INK, fillOpacity: 0.18, stroke: INK, strokeWidth: 1.2 };
  return (
    <Fig
      caption="八種剪切方向指標，全部畫成右行（上盤往右、下盤往左；藍色箭頭）。左行就把整張圖左右翻轉。觀察面要垂直葉理、平行線理（XZ 面）。可靠度大致是：S-C、C′、σ／δ 碎斑、雲母魚最常用；書架式碎塊要記得「碎塊間的滑動和整體相反」；雁列脈看尖端。"
      source="課堂投影片（陳采蔚）Ch16 p.17–42；Fossen, Structural Geology, Fig. 15.21、15.28、15.36"
    >
      <svg viewBox="0 0 640 290" className="fg-svg" role="img" aria-label="右行剪切的八種剪切方向指標示意">
        <defs>
          <marker id="ki-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" style={{ fill: C.navy }} />
          </marker>
        </defs>
        {panel(0, "S-C 構造", (
          <g>
            <line x1={6} x2={144} y1={22} y2={22} stroke={C.rose} strokeWidth={2} />
            <line x1={6} x2={144} y1={80} y2={80} stroke={C.rose} strokeWidth={2} />
            {[10, 40, 70, 100].map((x) => (
              <path key={x} d={`M${x},78 C${x + 16},78 ${x + 16},24 ${x + 38},24`} {...line} />
            ))}
            <text x={136} y={18} textAnchor="end" style={{ fontSize: 10, fill: C.rose, fontWeight: 800 }}>C</text>
            <text x={60} y={58} style={{ fontSize: 10, fontWeight: 800 }}>S</text>
          </g>
        ))}
        {panel(1, "C′ 剪切帶", (
          <g>
            {[24, 38, 52, 66, 80].map((y) => {
              const xc = 30 + (y - 20) * 1.6; // C′ 帶在這條線的位置（往右下）
              return <path key={y} d={`M6,${y - 6} L${xc - 12},${y - 6} C${xc - 2},${y - 6} ${xc + 2},${y + 6} ${xc + 12},${y + 6} L144,${y + 6}`} {...line} />;
            })}
            <line x1={26} y1={18} x2={130} y2={84} stroke={C.rose} strokeWidth={2} />
            <text x={128} y={70} style={{ fontSize: 10, fill: C.rose, fontWeight: 800 }}>C′</text>
          </g>
        ))}
        {panel(2, "σ 型碎斑", (
          <g>
            <line x1={6} x2={144} y1={52} y2={52} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
            <path d="M75,58 C60,60 40,64 6,64 L6,60 C40,58 58,55 66,52 Z" {...grey} />
            <path d="M75,44 C90,42 110,40 144,40 L144,44 C110,46 92,49 84,52 Z" {...grey} />
            <circle cx={75} cy={51} r={13} fill="hsl(var(--card))" stroke={INK} strokeWidth={1.5} />
            <text x={8} y={78} style={{ fontSize: 9.5, opacity: 0.8 }}>左尾低、右尾高</text>
          </g>
        ))}
        {panel(3, "δ 型碎斑", (
          <g>
            <line x1={6} x2={144} y1={52} y2={52} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
            <path d="M75,64 C100,68 98,40 144,38" fill="none" stroke={INK} strokeWidth={3} strokeOpacity={0.55} />
            <path d="M75,38 C50,34 52,62 6,66" fill="none" stroke={INK} strokeWidth={3} strokeOpacity={0.55} />
            <circle cx={75} cy={51} r={12} fill="hsl(var(--card))" stroke={INK} strokeWidth={1.5} />
            <text x={8} y={84} style={{ fontSize: 9.5, opacity: 0.8 }}>尾巴繞過碎斑、穿過參考線</text>
          </g>
        ))}
        {panel(4, "雲母魚", (
          <g>
            <line x1={6} x2={144} y1={24} y2={24} stroke={C.rose} strokeWidth={1.5} />
            <line x1={6} x2={144} y1={80} y2={80} stroke={C.rose} strokeWidth={1.5} />
            {[[35, 40], [95, 46], [55, 66], [115, 64]].map(([x, y], k) => (
              <path key={k} d="M-20,4 L12,-6 L22,-4 L-12,6 Z" transform={`translate(${x},${y}) rotate(-12)`} fill={C.teal} fillOpacity={0.6} stroke={C.teal} />
            ))}
            <text x={8} y={94} style={{ fontSize: 9.5, opacity: 0.8 }}>魚往右上翹（/）</text>
          </g>
        ))}
        {panel(5, "書架式碎塊", (
          <g>
            {[0, 1, 2, 3].map((k) => {
              const x = 22 + k * 28, dy = -k * 4;
              return <polygon key={k} points={`${x},${36 + dy} ${x + 24},${36 + dy} ${x + 30},${68 + dy} ${x + 6},${68 + dy}`} {...grey} />;
            })}
            <text x={8} y={88} style={{ fontSize: 9.5, opacity: 0.8 }}>碎塊間左行滑動（反向）</text>
          </g>
        ))}
        {panel(6, "雁列脈", (
          <g>
            <line x1={6} x2={144} y1={30} y2={30} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
            <line x1={6} x2={144} y1={74} y2={74} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
            {[30, 55, 80, 105, 128].map((x) => (
              <ellipse key={x} cx={x} cy={52} rx={18} ry={3.2} transform={`rotate(45 ${x} 52)`} fill={C.gold} fillOpacity={0.7} stroke={C.gold} />
            ))}
            <text x={8} y={92} style={{ fontSize: 9.5, opacity: 0.8 }}>脈往右下（\），垂直 ISA₁</text>
          </g>
        ))}
        {panel(7, "斜交晶粒組構", (
          <g>
            <line x1={6} x2={144} y1={26} y2={26} stroke={C.rose} strokeWidth={1.5} />
            <line x1={6} x2={144} y1={78} y2={78} stroke={C.rose} strokeWidth={1.5} />
            {Array.from({ length: 12 }, (_, k) => {
              const x = 18 + (k % 6) * 22 + (k >= 6 ? 11 : 0), y = k >= 6 ? 62 : 42;
              return <ellipse key={k} cx={x} cy={y} rx={10} ry={4} transform={`rotate(-30 ${x} ${y})`} fill="none" stroke={INK} strokeWidth={1.2} />;
            })}
            <text x={8} y={92} style={{ fontSize: 9.5, opacity: 0.8 }}>石英長軸 Si 往右上（/）</text>
          </g>
        ))}
      </svg>
    </Fig>
  );
}
