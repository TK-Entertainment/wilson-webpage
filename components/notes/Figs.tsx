"use client";

import type { ReactNode } from "react";
import "./notes.css";

// 自繪示意圖（取代課堂投影片的圖）。全部是內嵌 SVG，跟著網站深淺色變色。
// 用法：<SystemTypesFig />，圖說寫在元件裡。

export function Fig({ children, caption, source }: { children: ReactNode; caption: string; source?: string }) {
  return (
    <figure className="nd-not-prose fg-wrap">
      {children}
      <figcaption className="fg-cap">
        {caption}
        <span className="fg-src">自繪示意圖{source ? `；概念參考：${source}` : ""}</span>
      </figcaption>
    </figure>
  );
}

const INK = "currentColor";
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", violet: "#8a6fd1" };

/* ───────── L3 p.4：系統四型 ───────── */

function Box({ x, label, sub, wall, heat, work, mass }: { x: number; label: string; sub: string; wall: "thick" | "insul" | "thin"; heat?: boolean; work?: boolean; mass?: boolean }) {
  const y = 40, w = 110, h = 90;
  return (
    <g>
      {wall === "insul" ? (
        <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} fill="none" stroke={INK} strokeWidth={1.5} strokeDasharray="3 3" />
      ) : null}
      <rect x={x} y={y} width={w} height={h} fill="var(--teal)" fillOpacity={0.12} stroke={INK} strokeWidth={wall === "thin" ? 2 : 5} />
      {work ? (
        <g>
          <rect x={x + 30} y={y - 22} width={50} height={8} fill={INK} />
          <line x1={x + 55} y1={y - 40} x2={x + 55} y2={y - 24} stroke={C.orange} strokeWidth={3} markerEnd="url(#fg-arr-o)" />
          <text x={x + 64} y={y - 30} style={{ fontSize: 11 }}>功</text>
        </g>
      ) : null}
      {heat ? (
        <g>
          <path d={`M${x + 22},${y - 40} q-7,6 0,12 q7,6 0,12 l0,8`} fill="none" stroke={C.rose} strokeWidth={2.5} markerEnd="url(#fg-arr-r)" />
          <path d={`M${x + 88},${y - 4} l0,-8 q-7,-6 0,-12 q7,-6 0,-12`} fill="none" stroke={C.rose} strokeWidth={2.5} markerEnd="url(#fg-arr-r)" />
          <text x={x + 55} y={y - 20} textAnchor="middle" style={{ fontSize: 11 }}>熱</text>
        </g>
      ) : null}
      {mass ? (
        <g>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={x + 14 + i * 10} cy={y + 62} r={3.5} fill={C.navy} stroke={INK} strokeWidth={1} />
          ))}
          <line x1={x - 30} y1={y + 62} x2={x + 6} y2={y + 62} stroke={INK} strokeWidth={2} markerEnd="url(#fg-arr-k)" />
          <text x={x - 30} y={y + 80} style={{ fontSize: 11 }}>物質</text>
        </g>
      ) : null}
      <text x={x + w / 2} y={y + h + 30} textAnchor="middle" style={{ fontWeight: 800, fontSize: 14 }}>{label}</text>
      <text x={x + w / 2} y={y + h + 48} textAnchor="middle" style={{ fontSize: 11.5 }}>{sub}</text>
    </g>
  );
}

function Arrows() {
  return (
    <defs>
      {[
        ["fg-arr-o", C.orange],
        ["fg-arr-r", C.rose],
        ["fg-arr-k", "currentColor"],
        ["fg-arr-t", C.teal],
      ].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

export function SystemTypesFig() {
  return (
    <Fig caption="系統依「能不能交換質量、能不能交換能量」分成四種。粗牆：什麼都不能進出；虛線外框：隔熱，但可以被活塞作功。" source="White (2013) Fig. 2.1；課堂投影片 L3 p.4">
      <svg viewBox="0 -8 640 208" className="ix-svg" role="img" aria-label="孤立、絕熱、封閉、開放系統">
        <Arrows />
        <Box x={30} label="孤立 Isolated" sub="質量 ✗　能量 ✗" wall="thick" />
        <Box x={185} label="絕熱 Adiabatic" sub="質量 ✗　熱 ✗　功 ✓" wall="insul" work />
        <Box x={340} label="封閉 Closed" sub="質量 ✗　能量 ✓" wall="thin" heat />
        <Box x={495} label="開放 Open" sub="質量 ✓　能量 ✓" wall="thin" heat mass />
      </svg>
    </Fig>
  );
}

/* ───────── L3 p.5：山谷中的球 ───────── */

export function StabilityFig() {
  // 地形：左高右低，中間有一個小凹槽（介穩），最右邊是谷底（平衡）
  const d = "M20,40 C90,40 110,110 160,120 C200,128 215,95 240,95 C265,95 280,128 320,150 C380,182 430,205 500,205 C560,205 600,200 620,170";
  return (
    <Fig caption="山谷中的球：谷底是平衡（不再變化）；半山腰的小凹槽是介穩態（暫時不動，但不是最低點，例如地表的鑽石）；斜坡上的球不穩定，會自己滾下去。" source="White (2013) Fig. 2.2；課堂投影片 L3 p.5">
      <svg viewBox="0 0 640 260" className="ix-svg" role="img" aria-label="平衡、介穩與不穩定狀態">
        <path d={`${d} L620,240 L20,240 Z`} fill="var(--gold)" fillOpacity={0.18} />
        <path d={d} fill="none" stroke={INK} strokeWidth={3} />
        <circle cx={92} cy={50} r={13} fill={C.rose} stroke={INK} strokeWidth={2} />
        <circle cx={240} cy={82} r={13} fill={C.gold} stroke={INK} strokeWidth={2} />
        <circle cx={500} cy={192} r={13} fill={C.teal} stroke={INK} strokeWidth={2} />
        <text x={70} y={22} style={{ fontWeight: 800, fontSize: 14 }}>不穩定 Unstable</text>
        <text x={70} y={86} style={{ fontSize: 11.5 }}>在斜坡上，會自己滾</text>
        <text x={240} y={50} textAnchor="middle" style={{ fontWeight: 800, fontSize: 14 }}>介穩 Metastable</text>
        <text x={240} y={66} textAnchor="middle" style={{ fontSize: 11.5 }}>卡在小凹槽，推一下才會走</text>
        <text x={500} y={150} textAnchor="middle" style={{ fontWeight: 800, fontSize: 14 }}>平衡 Equilibrium</text>
        <text x={500} y={166} textAnchor="middle" style={{ fontSize: 11.5 }}>最低點，不再變化</text>
        <text x={30} y={252} style={{ fontSize: 11.5 }}>能量（G）高 ←</text>
        <text x={610} y={252} textAnchor="end" style={{ fontSize: 11.5 }}>→ 能量低</text>
      </svg>
    </Fig>
  );
}

/* ───────── L3 p.39：成分的圖解（二元、三元） ───────── */

export function ComponentsFig() {
  // 二元：Al₂O₃ — H₂O，橫軸為 H₂O 的莫耳分率
  const bx = (f: number) => 40 + f * 220;
  // 三元：頂點 Al₂O₃（上）、SiO₂（左下）、H₂O（右下）
  const A = { x: 470, y: 30 }, S = { x: 350, y: 238 }, W = { x: 590, y: 238 };
  const tp = (a: number, s: number, w: number) => {
    const t = a + s + w;
    return { x: (a * A.x + s * S.x + w * W.x) / t, y: (a * A.y + s * S.y + w * W.y) / t };
  };
  const pts: [string, ReturnType<typeof tp>, string, number?][] = [
    ["剛玉 corundum", tp(1, 0, 0), C.navy, 0],
    ["石英 quartz", tp(0, 1, 0), C.navy, 0],
    ["水 water", tp(0, 0, 1), C.navy, 0],
    ["Al₂SiO₅", tp(1, 1, 0), C.orange, -1],
    ["高嶺石 kaolinite", tp(1, 2, 2), C.teal, 2],
    ["葉蠟石 pyrophyllite", tp(1, 4, 1), C.rose, -1],
    ["軟水鋁石 boehmite", tp(1, 0, 1), C.gold, 1],
    ["三水鋁石 gibbsite", tp(1, 0, 3), C.gold, 1],
  ];
  return (
    <Fig caption="選對成分，就能用最少的成分描述所有相。左：Al₂O₃–H₂O 二元系統，軟水鋁石／硬水鋁石（boehmite／diaspore，Al₂O₃·H₂O）和三水鋁石（gibbsite，Al₂O₃·3H₂O）都落在兩端點的連線上，2 個成分就夠。右：Al₂O₃–SiO₂–H₂O 三元系統，每個礦物的位置由化學式的比例決定；Al₂SiO₅（藍晶石、紅柱石、矽線石三種同質異形體）都落在 Al₂O₃–SiO₂ 邊上的同一點。" source="White (2013)；課堂投影片 L3 p.39">
      <svg viewBox="0 0 690 290" className="ix-svg" role="img" aria-label="二元與三元成分圖">
        {/* 二元 */}
        <line x1={bx(0)} y1={140} x2={bx(1)} y2={140} stroke={INK} strokeWidth={3} />
        <circle cx={bx(0)} cy={140} r={6} fill={C.navy} stroke={INK} />
        <circle cx={bx(1)} cy={140} r={6} fill={C.navy} stroke={INK} />
        <text x={bx(0)} y={170} textAnchor="middle" style={{ fontWeight: 800 }}>Al₂O₃</text>
        <text x={bx(1)} y={170} textAnchor="middle" style={{ fontWeight: 800 }}>H₂O</text>
        <circle cx={bx(0.5)} cy={140} r={6} fill={C.gold} stroke={INK} />
        <text x={bx(0.5)} y={104} textAnchor="middle" style={{ fontSize: 11.5 }}>軟水鋁石／硬水鋁石 AlO(OH)</text>
        <text x={bx(0.5)} y={120} textAnchor="middle" style={{ fontSize: 11 }}>= Al₂O₃·H₂O</text>
        <circle cx={bx(0.75)} cy={140} r={6} fill={C.gold} stroke={INK} />
        <text x={bx(0.75)} y={195} textAnchor="middle" style={{ fontSize: 11.5 }}>三水鋁石 Al(OH)₃</text>
        <text x={bx(0.75)} y={210} textAnchor="middle" style={{ fontSize: 11 }}>= Al₂O₃·3H₂O</text>
        <text x={150} y={260} textAnchor="middle" style={{ fontWeight: 800, fontSize: 13 }}>二元：2 個成分</text>
        {/* 三元 */}
        <polygon points={`${A.x},${A.y} ${S.x},${S.y} ${W.x},${W.y}`} fill="var(--teal)" fillOpacity={0.08} stroke={INK} strokeWidth={2.5} />
        <text x={A.x} y={A.y - 10} textAnchor="middle" style={{ fontWeight: 800 }}>Al₂O₃</text>
        <text x={S.x - 6} y={S.y + 22} textAnchor="middle" style={{ fontWeight: 800 }}>SiO₂</text>
        <text x={W.x + 6} y={W.y + 22} textAnchor="middle" style={{ fontWeight: 800 }}>H₂O</text>
        {pts.slice(3).map(([name, p, col, side], i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={6} fill={col} stroke={INK} />
            <text
              x={side === -1 ? p.x - 10 : side === 2 ? p.x : p.x + 10}
              y={side === 2 ? p.y + 20 : p.y + 4}
              textAnchor={side === -1 ? "end" : side === 2 ? "middle" : "start"}
              style={{ fontSize: 11 }}
            >
              {name}
            </text>
          </g>
        ))}
        <text x={470} y={278} textAnchor="middle" style={{ fontWeight: 800, fontSize: 13 }}>三元：3 個成分</text>
      </svg>
    </Fig>
  );
}
