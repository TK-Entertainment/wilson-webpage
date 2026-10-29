"use client";

import type { ReactElement, ReactNode } from "react";
import { Fig } from "./Figs";

// 地球構造各章的自繪圖
const INK = "currentColor";
const rad = (d: number) => (d * Math.PI) / 180;
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", violet: "#8a6fd1", blue: "#5b8bd9" };

function Marks() {
  return (
    <defs>
      {[
        ["sm-k", "currentColor"],
        ["sm-o", C.orange],
        ["sm-t", C.teal],
        ["sm-r", C.rose],
        ["sm-b", C.blue],
      ].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

/* ───────────── Ch1：構造分析的四個層次 ───────────── */

export function AnalysisLevelsFig() {
  const lv: [string, string, string, string][] = [
    ["幾何分析", "長什麼樣？朝哪個方向？", "位態、形狀、分布；赤平投影", C.blue],
    ["運動學分析", "岩石怎麼動？變形了多少？", "擦痕、拖曳、應變橢圓（Ch2–3）", C.teal],
    ["動力學分析", "什麼力（應力）造成的？", "應力、Mohr 圓、Anderson（Ch4–5、7）", C.orange],
    ["構造分析", "放回盆地、造山帶尺度", "結合前三者解釋區域歷史", C.rose],
  ];
  return (
    <Fig caption="構造分析由淺入深的四個層次，每一層都建立在前一層之上：先把構造量清楚（幾何），才能推它怎麼動（運動學），再推是什麼應力造成的（動力學），最後放回盆地或造山帶的尺度（構造分析）。微構造分析（光學顯微鏡、SEM）在每一層都可以提供證據。這也是整門課的章節順序。" source="Fossen (2016) §1.12；課堂投影片 Ch1 p.37、p.44">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="構造分析四層次">
        <Marks />
        {lv.map(([t, q, e, c], i) => {
          const x = 14 + i * 156;
          return (
            <g key={t}>
              <rect x={x} y={30} width={140} height={150} rx={6} fill={c} fillOpacity={0.16} stroke={c} strokeWidth={2} />
              <text x={x + 70} y={56} textAnchor="middle" style={{ fontSize: 14, fontWeight: 800 }}>{t}</text>
              <foreignObject x={x + 8} y={66} width={124} height={110}>
                <div style={{ fontSize: 12, lineHeight: 1.45, color: "currentColor" }}>
                  <b>{q}</b>
                  <br />
                  <span style={{ opacity: 0.85 }}>{e}</span>
                </div>
              </foreignObject>
              {i < 3 && <line x1={x + 142} x2={x + 154} y1={105} y2={105} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />}
            </g>
          );
        })}
        <rect x={14} y={194} width={608} height={26} rx={4} fill={C.violet} fillOpacity={0.14} stroke={C.violet} strokeWidth={1.5} />
        <text x={318} y={212} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }}>微構造分析：在顯微鏡下看變形，四個層次都用得到</text>
        <text x={318} y={18} textAnchor="middle" style={{ fontSize: 11 }}>描述 → 解釋　（越往右越需要假設）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch1：面與線的位態 ───────────── */

export function OrientationFig() {
  return (
    <Fig caption="左：面的位態。走向（strike）是面和水平面交線的方位；傾角（dip）是面和水平面的最大夾角，量在垂直走向的方向（傾向）。中：線的位態。趨向（trend）是線投影到水平面的方位，要寫三位數（例如 040°，避免和角度混淆）；傾伏（plunge）是線和水平面的夾角。右：面上的線可以用 rake（pitch）描述，也就是在面上從走向量到這條線的角度。" source="Fossen (2016) Appendix B；課堂投影片 Ch1 p.9">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="走向傾角、趨向傾伏、rake">
        <Marks />
        {/* 面 */}
        <path d="M20,120 L120,70 L200,110 L100,160 Z" fill={C.navy} fillOpacity={0.15} stroke={INK} strokeOpacity={0.5} />
        <path d="M40,110 L140,60 L190,150 L90,200 Z" fill={C.teal} fillOpacity={0.3} stroke={C.teal} strokeWidth={2} />
        <line x1={40} y1={110} x2={140} y2={60} stroke={C.orange} strokeWidth={3} />
        <text x={70} y={80} style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>走向</text>
        <line x1={90} y1={85} x2={135} y2={108} stroke={INK} strokeDasharray="4 3" />
        <line x1={90} y1={85} x2={115} y2={150} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        <text x={124} y={128} style={{ fontSize: 12, fontWeight: 800 }}>傾角 δ</text>
        <text x={110} y={222} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>面：strike / dip</text>
        {/* 線 */}
        <path d="M240,140 L340,90 L420,130 L320,180 Z" fill={C.navy} fillOpacity={0.15} stroke={INK} strokeOpacity={0.5} />
        <line x1={330} y1={135} x2={392} y2={120} stroke={INK} strokeDasharray="4 3" />
        <line x1={330} y1={135} x2={392} y2={190} stroke={C.orange} strokeWidth={3} markerEnd="url(#sm-o)" />
        <line x1={392} y1={120} x2={392} y2={190} stroke={INK} strokeOpacity={0.4} strokeDasharray="2 3" />
        <text x={352} y={116} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>水平投影 → 趨向</text>
        <text x={362} y={170} textAnchor="end" style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>傾伏 p</text>
        <line x1={330} y1={50} x2={330} y2={78} stroke={INK} strokeWidth={1.5} markerEnd="url(#sm-k)" />
        <text x={330} y={44} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>N</text>
        <text x={330} y={222} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>線：plunge → trend</text>
        {/* rake */}
        <path d="M460,110 L600,60 L620,150 L480,200 Z" fill={C.teal} fillOpacity={0.3} stroke={C.teal} strokeWidth={2} />
        <line x1={460} y1={110} x2={600} y2={60} stroke={C.orange} strokeWidth={3} />
        <line x1={500} y1={96} x2={580} y2={170} stroke={C.rose} strokeWidth={3} />
        <path d="M530,85 A32,32 0 0,1 524,118" fill="none" stroke={INK} strokeWidth={1.5} />
        <text x={540} y={110} style={{ fontSize: 12, fontWeight: 800 }}>rake</text>
        <text x={560} y={190} style={{ fontSize: 11, fontWeight: 700, fill: C.rose }}>擦痕</text>
        <text x={540} y={222} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>面上的線：rake（pitch）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch1：InSAR 干涉環 ───────────── */

export function InSARFig() {
  return (
    <Fig caption="雷達波從衛星打到地面再反射回來，走的是來回兩趟。地面沿視衛星方向（LOS）移動 d，路徑長度就變 2d，相位差 Δφ = 4πd/λ。所以一個完整的干涉環（Δφ = 2π）對應的地表移動 d = λ/2。C 波段 λ ≈ 5.6 cm，一個干涉環 ≈ 2.8 cm；L 波段 λ ≈ 24 cm，一環 ≈ 12 cm。" source="課堂投影片 Ch1 p.17–20">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="InSAR 原理">
        <Marks />
        <rect x={40} y={20} width={60} height={26} rx={4} fill={C.blue} fillOpacity={0.3} stroke={C.blue} strokeWidth={2} />
        <text x={70} y={38} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>衛星</text>
        <path d="M100,40 L300,170" stroke={C.orange} strokeWidth={2.5} markerEnd="url(#sm-o)" />
        <path d="M290,160 L110,50" stroke={C.teal} strokeWidth={2.5} markerEnd="url(#sm-t)" strokeDasharray="6 4" />
        <text x={170} y={84} style={{ fontSize: 11, fontWeight: 700, fill: C.orange }}>去</text>
        <text x={160} y={116} style={{ fontSize: 11, fontWeight: 700, fill: C.teal }}>回</text>
        <path d="M200,190 L420,190" stroke={INK} strokeWidth={2} />
        <path d="M250,200 L380,200" stroke={INK} strokeWidth={2} strokeDasharray="5 3" />
        <line x1={318} y1={180} x2={330} y2={198} stroke={C.rose} strokeWidth={2.5} markerEnd="url(#sm-r)" />
        <text x={340} y={182} style={{ fontSize: 11, fontWeight: 800, fill: C.rose }}>地表沿 LOS 移動 d</text>
        <text x={300} y={214} textAnchor="middle" style={{ fontSize: 10.5 }}>路徑長度變化 = 2d</text>
        {/* 干涉環 */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse key={i} cx={530} cy={110} rx={i * 15} ry={i * 12} fill="none" stroke={[C.rose, C.gold, C.teal, C.blue, C.violet, C.orange][i - 1]} strokeWidth={5} strokeOpacity={0.7} />
        ))}
        <text x={530} y={200} textAnchor="middle" style={{ fontSize: 11 }}>干涉圖：每一圈彩虹 = 2π = λ/2</text>
        <text x={530} y={18} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>Δφ = 4π·d / λ</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch1：生長斷層 ───────────── */

export function GrowthFaultFig() {
  // 鏟狀斷層：上盤地層往斷層變厚、楔形、越老越陡；下盤厚度不變
  const xf = (y: number) => 330 - 110 * Math.pow((y - 20) / 190, 2);
  const cols = [C.gold, C.orange, C.teal, C.blue, C.violet];
  const hb = (k: number, x: number) => {
    // 上盤第 k 條界線在 x 處的深度：遠處每層 16，靠斷層每層越來越厚
    const f = (x - 20) / 300;
    return 40 + k * 16 + f * (k * 10 + k * k * 2.5);
  };
  const hwPoly = (k: number) => {
    const top: string[] = [], bot: string[] = [];
    for (let i = 0; i <= 30; i++) {
      const x = 20 + (i / 30) * 300;
      const yt = hb(k, x), yb = hb(k + 1, x);
      if (x <= xf(yt)) top.push(`${x},${yt}`);
      if (x <= xf(yb)) bot.push(`${x},${yb}`);
    }
    return [...top, ...bot.reverse()].join(" ");
  };
  const faultPts: string[] = [];
  for (let y = 20; y <= 210; y += 5) faultPts.push(`${xf(y)},${y}`);
  return (
    <Fig caption="生長斷層：斷層一邊活動、一邊有沉積物堆積。上盤（下落盤）一直下沉，靠斷層那側空出的空間最大、堆得最厚，所以上盤地層靠近斷層變厚、呈楔形；越老的地層經歷越多次錯動和旋轉，傾角越陡。下盤同一層薄而且厚度不變。斷層通常是鏟狀（listric），上盤沿著彎曲的斷層面旋轉下陷，形成半地塹。靠近斷層的地方常是較粗的沉積物（斷層崖的崩積）。" source="課堂投影片 Ch1 p.4–5（山腳斷層、台北盆地）">
      <svg viewBox="0 0 640 235" className="ix-svg" role="img" aria-label="生長斷層剖面">
        <Marks />
        {cols.map((c, k) => (
          <polygon key={k} points={hwPoly(k)} fill={c} fillOpacity={0.35} stroke={INK} strokeWidth={0.8} />
        ))}
        {cols.map((c, k) => {
          const y0 = 40 + k * 12;
          return <polygon key={`f${k}`} points={`${xf(y0) + 6},${y0} 620,${y0} 620,${y0 + 12} ${xf(y0 + 12) + 6},${y0 + 12}`} fill={c} fillOpacity={0.35} stroke={INK} strokeWidth={0.8} />;
        })}
        <polyline points={faultPts.join(" ")} fill="none" stroke={C.rose} strokeWidth={3.5} />
        <line x1={300} y1={60} x2={292} y2={88} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        <line x1={360} y1={130} x2={366} y2={104} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        <text x={150} y={228} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>上盤（下落盤）：靠斷層變厚、楔形、越深越陡</text>
        <text x={500} y={140} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>下盤：薄、厚度不變</text>
        <text x={336} y={16} style={{ fontSize: 11, fontWeight: 800, fill: C.rose }}>鏟狀斷層</text>
        <text x={24} y={30} style={{ fontSize: 11 }}>細（盆地中央）</text>
        <text x={292} y={30} textAnchor="end" style={{ fontSize: 11 }}>粗（近斷層）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch1：正牽引與反牽引 ───────────── */

export function DragFig() {
  return (
    <Fig caption="沒有擦痕時，可以看斷層旁地層怎麼彎來判斷運動方向，但要分清楚兩種。正牽引（normal drag）：地層在斷層附近被摩擦「拖」往斷層運動的方向彎（凸形），彎的方向和該盤的運動同向。反牽引（reverse drag）：地層彎的方向和運動相反，例如鏟狀正斷層的上盤沿彎曲斷層下滑，靠近斷層的地層反而往斷層方向下彎，形成滾動背斜（rollover）。兩者都畫的是正斷層。" source="課堂投影片 Ch1 p.43">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="正牽引與反牽引">
        <Marks />
        {/* 正牽引 */}
        <line x1={170} y1={20} x2={130} y2={200} stroke={C.rose} strokeWidth={3.5} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M20,${70 + i * 40} L95,${70 + i * 40} Q132,${70 + i * 40} ${145 - i * 9},${45 + i * 40}`} fill="none" stroke={INK} strokeWidth={2.2} />
            <path d={`M162,${30 + i * 40} Q166,${10 + i * 40} 200,${10 + i * 40} L290,${10 + i * 40}`} fill="none" stroke={INK} strokeWidth={2.2} />
          </g>
        ))}
        <line x1={110} y1={40} x2={100} y2={60} stroke={C.orange} strokeWidth={2.5} markerEnd="url(#sm-o)" />
        <line x1={210} y1={150} x2={214} y2={130} stroke={C.orange} strokeWidth={2.5} markerEnd="url(#sm-o)" />
        <text x={155} y={215} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>正牽引：往運動方向彎（摩擦）</text>
        {/* 反牽引 */}
        <path d="M500,20 C490,90 470,150 420,205" fill="none" stroke={C.rose} strokeWidth={3.5} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M340,${80 + i * 35} Q420,${80 + i * 35} ${478 - i * 10},${110 + i * 35}`} fill="none" stroke={INK} strokeWidth={2.2} />
            <path d={`M505,${40 + i * 35} L620,${40 + i * 35}`} fill="none" stroke={INK} strokeWidth={2.2} />
          </g>
        ))}
        <line x1={430} y1={60} x2={448} y2={78} stroke={C.orange} strokeWidth={2.5} markerEnd="url(#sm-o)" />
        <text x={420} y={50} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700 }}>上盤沿彎曲斷層下滑</text>
        <text x={480} y={215} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>反牽引：往斷層下彎（滾動背斜）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch1：平移斷層的躍階 ───────────── */

export function StepoverFig() {
  const half = (x1: number, y: number, x2: number, dir: 1 | -1, col: string) => (
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={col} strokeWidth={2.5} markerEnd={dir === 1 ? "url(#sm-o)" : "url(#sm-t)"} />
  );
  return (
    <Fig caption="右移（dextral）平移斷層錯開時的兩種躍階（地圖俯視）。斷層段往右跳（右階）時，兩段之間被拉開，形成伸張躍階，下陷成拉張盆地（pull-apart basin）；往左跳（左階）時，兩段之間被擠壓，形成壓縮躍階，隆起成擠壓脊（push-up）。左移斷層剛好相反。判斷方法：站在一段斷層上看向另一段，想像兩邊的塊體怎麼移動，中間是被拉開還是被擠緊。" source="課堂投影片 Ch1 p.16">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="伸張與壓縮躍階">
        <Marks />
        {/* 右階 → 伸張 */}
        <line x1={20} y1={80} x2={170} y2={80} stroke={C.rose} strokeWidth={3.5} />
        <line x1={130} y1={130} x2={290} y2={130} stroke={C.rose} strokeWidth={3.5} />
        <path d="M130,84 L170,84 L170,126 L130,126 Z" fill={C.blue} fillOpacity={0.35} stroke={C.blue} />
        <text x={150} y={110} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800 }}>盆地</text>
        {half(40, 60, 90, 1, C.orange)}
        {half(110, 100, 60, -1, C.teal)}
        {half(200, 112, 250, 1, C.orange)}
        {half(270, 150, 220, -1, C.teal)}
        <text x={155} y={190} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>右移 + 右階 → 伸張躍階（拉張盆地）</text>
        {/* 左階 → 壓縮 */}
        <line x1={350} y1={130} x2={500} y2={130} stroke={C.rose} strokeWidth={3.5} />
        <line x1={460} y1={80} x2={620} y2={80} stroke={C.rose} strokeWidth={3.5} />
        <path d="M460,84 L500,84 L500,126 L460,126 Z" fill={C.orange} fillOpacity={0.35} stroke={C.orange} />
        <text x={480} y={110} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800 }}>隆起</text>
        {half(370, 112, 420, 1, C.orange)}
        {half(440, 150, 390, -1, C.teal)}
        {half(530, 60, 580, 1, C.orange)}
        {half(600, 100, 550, -1, C.teal)}
        <text x={485} y={190} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>右移 + 左階 → 壓縮躍階（擠壓脊）</text>
        <text x={320} y={20} textAnchor="middle" style={{ fontSize: 11 }}>箭頭：斷層兩側塊體的相對運動（右移：對面那側往右）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch2：變形的四個成分 ───────────── */

export function DeformationPartsFig() {
  const sq = (x: number, y: number, pts: [number, number][], col: string, dash = false) => (
    <polygon points={pts.map(([a, b]) => `${x + a},${y - b}`).join(" ")} fill={col} fillOpacity={dash ? 0 : 0.3} stroke={dash ? INK : col} strokeOpacity={dash ? 0.4 : 1} strokeDasharray={dash ? "4 3" : undefined} strokeWidth={2} />
  );
  const base: [number, number][] = [[-30, -30], [30, -30], [30, 30], [-30, 30]];
  const rot = (p: [number, number], t: number): [number, number] => [p[0] * Math.cos(t) - p[1] * Math.sin(t), p[0] * Math.sin(t) + p[1] * Math.cos(t)];
  const panels: [string, string, [number, number][], [number, number]][] = [
    ["剛體平移", "位置變、形狀不變", base, [30, 20]],
    ["剛體旋轉", "方向變、形狀不變", base.map((p) => rot(p, 0.5)), [0, 0]],
    ["應變（形變）", "形狀變：圓 → 橢圓", [[-30, -30], [30, -30], [60, 30], [0, 30]], [0, 0]],
    ["體積變化", "大小變、形狀不變", base.map(([a, b]) => [a * 0.7, b * 0.7] as [number, number]), [0, 0]],
  ];
  return (
    <Fig caption="變形（deformation）是從起始到最終幾何的轉換，可以拆成四個部分：剛體平移、剛體旋轉、應變（形狀改變，distortion）和體積變化。前兩者岩石內部的質點彼此距離不變，構造地質最關心的是後兩者，尤其是應變。虛線是原本的形狀。" source="Fossen (2016) Ch2；課堂投影片 Ch2 p.2">
      <svg viewBox="0 0 640 170" className="ix-svg" role="img" aria-label="變形的四個成分">
        {panels.map(([t, sub, pts, [dx, dy]], i) => {
          const x = 80 + i * 160, y = 80;
          return (
            <g key={t}>
              {sq(x, y, base, INK, true)}
              {sq(x + dx, y - dy, pts, [C.blue, C.teal, C.orange, C.violet][i])}
              <text x={x} y={142} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{t}</text>
              <text x={x} y={160} textAnchor="middle" style={{ fontSize: 11 }}>{sub}</text>
            </g>
          );
        })}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch2：角剪動與應變橢圓 ───────────── */

export function AngularShearFig() {
  const g = 0.7; // γ
  const S = 70;
  const P = (x: number, y: number, ox: number, oy: number) => `${ox + S * (x + g * y)},${oy - S * y}`;
  const psi = Math.atan(g);
  return (
    <Fig caption="左：一個正方形和裡面的圓受到 simple shear。原本互相垂直的兩條線（藍綠的垂直線和水平底邊），變形後夾角不再是 90°，偏離的角度 ψ 叫角剪動（angular shear），剪應變 γ = tan ψ。右：圓變成應變橢圓，長軸 X = 1 + e₁、短軸 Y = 1 + e₂，應變比 R = X/Y。這裡 γ = 0.7，ψ ≈ 35°。" source="Fossen (2016) §2.6–2.8；課堂投影片 Ch2 p.13–15">
      <svg viewBox="0 0 640 210" className="ix-svg" role="img" aria-label="角剪動與應變橢圓">
        <Marks />
        <polygon points={[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => `${60 + S * x},${170 - S * y}`).join(" ")} fill="none" stroke={INK} strokeOpacity={0.35} strokeDasharray="4 3" />
        <polygon points={[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => P(x, y, 60, 170)).join(" ")} fill={C.navy} fillOpacity={0.2} stroke={INK} strokeWidth={2} />
        <line x1={60} y1={170} x2={60} y2={170 - S} stroke={C.teal} strokeOpacity={0.5} strokeDasharray="3 3" strokeWidth={2} />
        <line x1={60} y1={170} x2={60 + S * g} y2={170 - S} stroke={C.teal} strokeWidth={3} />
        <line x1={60} y1={170} x2={60 + S} y2={170} stroke={C.teal} strokeWidth={3} />
        <path d={`M60,${170 - 40} A40,40 0 0,1 ${60 + 40 * Math.sin(psi)},${170 - 40 * Math.cos(psi)}`} fill="none" stroke={C.orange} strokeWidth={2} />
        <text x={72} y={118} style={{ fontSize: 13, fontWeight: 800, fill: C.orange }}>ψ</text>
        <line x1={60 + S} y1={170 - S - 14} x2={60 + S + S * g} y2={170 - S - 14} stroke={INK} strokeWidth={1.5} markerEnd="url(#sm-k)" />
        <text x={60 + S + 20} y={170 - S - 20} style={{ fontSize: 11 }}>上方往右錯動</text>
        <text x={150} y={200} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>γ = tan ψ</text>
        {/* 應變橢圓 */}
        {(() => {
          // 單位圓經 simple shear 後的橢圓
          const ox = 470, oy = 105, r = 55;
          const pts: string[] = [];
          for (let i = 0; i <= 72; i++) {
            const t = (i / 72) * 2 * Math.PI;
            const x = Math.cos(t), y = Math.sin(t);
            pts.push(`${ox + r * (x + g * y)},${oy - r * y}`);
          }
          const tr = 2 + g * g, det = 1;
          const l1 = tr / 2 + Math.sqrt((tr * tr) / 4 - det), l2 = tr / 2 - Math.sqrt((tr * tr) / 4 - det);
          const ang = 0.5 * Math.atan2(2 * g, g * g);
          const X = Math.sqrt(l1), Y = Math.sqrt(l2);
          return (
            <g>
              <circle cx={ox} cy={oy} r={r} fill="none" stroke={INK} strokeOpacity={0.35} strokeDasharray="4 3" />
              <polygon points={pts.join(" ")} fill={C.orange} fillOpacity={0.25} stroke={C.orange} strokeWidth={2.4} />
              <line x1={ox - r * X * Math.cos(ang)} y1={oy + r * X * Math.sin(ang)} x2={ox + r * X * Math.cos(ang)} y2={oy - r * X * Math.sin(ang)} stroke={C.orange} strokeWidth={2} />
              <line x1={ox + r * Y * Math.sin(ang)} y1={oy + r * Y * Math.cos(ang)} x2={ox - r * Y * Math.sin(ang)} y2={oy - r * Y * Math.cos(ang)} stroke={C.teal} strokeWidth={2} />
              <text x={ox + r * X * Math.cos(ang) + 6} y={oy - r * X * Math.sin(ang)} style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>X = 1 + e₁</text>
              <text x={ox - r * Y * Math.sin(ang) - 6} y={oy - r * Y * Math.cos(ang) - 4} textAnchor="end" style={{ fontSize: 12, fontWeight: 800, fill: C.teal }}>Y = 1 + e₂</text>
              <text x={ox} y={200} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>R = X / Y = {(X / Y).toFixed(2)}</text>
            </g>
          );
        })()}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch2：simple shear 下的 c、e、c/e 扇區 ───────────── */

export function SectorsFig() {
  const g = 1.2;
  const len = (phi: number, gg: number) => Math.hypot(Math.cos(phi) + gg * Math.sin(phi), Math.sin(phi));
  const cls = (phi: number) => {
    const fin = len(phi, g);
    let mn = 1;
    for (let i = 1; i <= 40; i++) mn = Math.min(mn, len(phi, (g * i) / 40));
    if (fin < 1) return "c";
    return mn < 0.999 ? "ce" : "e";
  };
  const col: Record<string, string> = { c: C.teal, e: C.orange, ce: C.gold };
  const ox = 200, oy = 110, r = 85;
  const rays: ReactElement[] = [];
  for (let i = 0; i < 180; i++) {
    const phi = (i / 180) * Math.PI;
    const k = cls(phi);
    // 變形後的方向
    const dx = Math.cos(phi) + g * Math.sin(phi), dy = Math.sin(phi);
    const n = Math.hypot(dx, dy);
    const a = Math.atan2(dy / n, dx / n);
    [1, -1].forEach((sg) =>
      rays.push(<line key={`${i}${sg}`} x1={ox} y1={oy} x2={ox + sg * r * Math.cos(a)} y2={oy - sg * r * Math.sin(a)} stroke={col[k]} strokeOpacity={0.5} strokeWidth={2.2} />),
    );
  }
  return (
    <Fig caption="右移 simple shear（γ = 1.2）之後，依線現在的方向分成三種扇區。c（縮短，藍綠）：一路都在縮短，褶皺、壓溶在這裡發育。e（伸長，橘）：一路都在伸長，串腸、張裂脈在這裡。c,e（金）：先縮短、轉過去之後又伸長，所以會有先褶皺、後串腸化的疊加構造。pure shear 的扇區是對稱的，simple shear 不對稱，這種不對稱是判斷剪切方向的依據。" source="Fossen (2016) Fig. 2.39；課堂投影片 Ch2 p.38–41">
      <svg viewBox="0 0 640 235" className="ix-svg" role="img" aria-label="c、e、c,e 扇區">
        {rays}
        <circle cx={ox} cy={oy} r={r} fill="none" stroke={INK} strokeOpacity={0.4} />
        <line x1={ox - 120} x2={ox + 120} y1={oy + r + 12} y2={oy + r + 12} stroke={INK} strokeWidth={1.5} />
        <line x1={ox - 120} x2={ox + 120} y1={oy - r - 12} y2={oy - r - 12} stroke={INK} strokeWidth={1.5} />
        <text x={ox + 110} y={oy - r - 16} textAnchor="end" style={{ fontSize: 11 }}>→ 上盤往右</text>
        <text x={ox - 110} y={oy + r + 28} style={{ fontSize: 11 }}>← 下盤往左</text>
        {[["c 扇區：一直縮短", C.teal], ["e 扇區：一直伸長", C.orange], ["c,e 扇區：先縮短後伸長", C.gold]].map(([t, c], i) => (
          <g key={t}>
            <rect x={380} y={60 + i * 34} width={22} height={14} fill={c} fillOpacity={0.6} />
            <text x={410} y={72 + i * 34} style={{ fontSize: 13, fontWeight: 800 }}>{t}</text>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch2：右移剪切帶的次生構造 ───────────── */

export function SubsidiaryFig() {
  const ox = 230, oy = 115;
  const seg = (deg: number, len: number, col: string, lab: string, w = 3) => {
    const a = (deg * Math.PI) / 180;
    return (
      <g>
        <line x1={ox - len * Math.cos(a)} y1={oy + len * Math.sin(a)} x2={ox + len * Math.cos(a)} y2={oy - len * Math.sin(a)} stroke={col} strokeWidth={w} />
        <text x={ox + (len + 14) * Math.cos(a)} y={oy - (len + 14) * Math.sin(a) + 4} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: col }}>{lab}</text>
      </g>
    );
  };
  return (
    <Fig caption="右移（dextral）簡單剪切帶裡的次生構造（地圖俯視，角度以剪切帶方向為 0°，逆時針為正）。瞬時的縮短方向（ISA3）和剪切帶夾 135°、伸張方向（ISA1）夾 45°。褶皺軸和逆斷層 ⊥ 縮短方向，所以沿 45° 排成雁行；張裂脈、正斷層 ⊥ 伸張方向，沿 135°。共軛的 Riedel 剪裂和縮短方向夾約 30°：R（同向、右移）和剪切帶夾約 −15°，R′（反向、左移）約 −75°（= 105°）；P 剪裂約 +15°。" source="Fossen (2016) Fig. 2.17–2.18；課堂投影片 Ch2 p.17–18；Riedel 的命名詳見 Ch10">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="右移剪切帶次生構造">
        <Marks />
        <rect x={20} y={40} width={420} height={150} fill={C.navy} fillOpacity={0.12} />
        <line x1={20} x2={440} y1={40} y2={40} stroke={INK} strokeWidth={2} />
        <line x1={20} x2={440} y1={190} y2={190} stroke={INK} strokeWidth={2} />
        <line x1={300} x2={380} y1={28} y2={28} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        <line x1={160} x2={80} y1={204} y2={204} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        {seg(-15, 95, C.rose, "R")}
        {seg(105, 58, C.violet, "R′")}
        {seg(15, 95, C.blue, "P", 2)}
        {seg(45, 60, C.gold, "褶皺軸／逆斷層", 4)}
        {seg(135, 60, C.teal, "張裂脈／正斷層", 4)}
        <g transform={`translate(${ox},${oy})`}>
          <ellipse rx={30} ry={14} transform="rotate(-45)" fill={C.orange} fillOpacity={0.3} stroke={C.orange} strokeWidth={2} />
        </g>
        <g style={{ fontSize: 12 }}>
          <text x={470} y={60} style={{ fontWeight: 800 }}>和剪切帶的夾角</text>
          <text x={470} y={84}><tspan style={{ fill: C.rose, fontWeight: 800 }}>R</tspan>：−15°，同向剪裂</text>
          <text x={470} y={106}><tspan style={{ fill: C.violet, fontWeight: 800 }}>R′</tspan>：−75°，反向剪裂</text>
          <text x={470} y={128}><tspan style={{ fill: C.blue, fontWeight: 800 }}>P</tspan>：+15°</text>
          <text x={470} y={150}><tspan style={{ fill: C.gold, fontWeight: 800 }}>褶皺、逆斷層</tspan>：+45°</text>
          <text x={470} y={172}><tspan style={{ fill: C.teal, fontWeight: 800 }}>張裂、正斷層</tspan>：+135°</text>
          <text x={470} y={196}><tspan style={{ fill: C.orange, fontWeight: 800 }}>應變橢圓</tspan>長軸 ≈ +45°</text>
        </g>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch2：應變相容性 ───────────── */

export function CompatibilityFig() {
  return (
    <Fig caption="變形帶和旁邊沒變形的圍岩要能接得起來（相容性）。左：simple shear 帶，剪動面方向的長度不變，所以帶的邊界和圍岩完全貼合，沒有空間問題，這是剪切帶常常接近 simple shear 的原因。右：pure shear 帶，帶內垂直方向被壓扁、水平方向伸長，但旁邊的圍岩沒有伸長，兩端的物質無處可去，必須側向擠出，產生相容性問題。" source="Fossen (2016) Fig. 2.35–2.36；課堂投影片 Ch2 p.35–36">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="simple shear 與 pure shear 的相容性">
        <Marks />
        {/* simple shear */}
        <rect x={30} y={20} width={240} height={50} fill={INK} fillOpacity={0.08} stroke={INK} strokeOpacity={0.4} />
        <rect x={30} y={130} width={240} height={50} fill={INK} fillOpacity={0.08} stroke={INK} strokeOpacity={0.4} />
        <rect x={30} y={70} width={240} height={60} fill={C.teal} fillOpacity={0.2} stroke={C.teal} strokeWidth={2} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={40 + i * 36} y1={130} x2={70 + i * 36} y2={70} stroke={C.teal} strokeWidth={1.5} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i}>
            {70 + i * 36 <= 270 && <line x1={70 + i * 36} y1={20} x2={70 + i * 36} y2={70} stroke={INK} strokeOpacity={0.4} />}
            <line x1={40 + i * 36} y1={130} x2={40 + i * 36} y2={180} stroke={INK} strokeOpacity={0.4} />
          </g>
        ))}
        <text x={150} y={196} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>simple shear：邊界貼合，相容</text>
        {/* pure shear */}
        <rect x={370} y={20} width={240} height={50} fill={INK} fillOpacity={0.08} stroke={INK} strokeOpacity={0.4} />
        <rect x={370} y={130} width={240} height={50} fill={INK} fillOpacity={0.08} stroke={INK} strokeOpacity={0.4} />
        <rect x={340} y={85} width={300} height={30} fill={C.orange} fillOpacity={0.25} stroke={C.orange} strokeWidth={2} />
        <line x1={490} y1={50} x2={490} y2={80} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        <line x1={490} y1={150} x2={490} y2={120} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        <line x1={360} y1={100} x2={326} y2={100} stroke={C.rose} strokeWidth={2.5} markerEnd="url(#sm-r)" />
        <line x1={620} y1={100} x2={636} y2={100} stroke={C.rose} strokeWidth={2.5} markerEnd="url(#sm-r)" />
        <text x={490} y={196} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>pure shear：兩端要側向擠出，不相容</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch4：力與應力的分解 ───────────── */

export function StressVectorFig() {
  return (
    <Fig caption="左：作用在一個面上的力 F 可以直接分解成垂直面的 Fn 和平行面的 Fs。右：應力是「力 ÷ 面積」，同一個力作用在斜的面上時，面積變大（A/cos θ），所以應力不能像力一樣直接分解，要連面積一起算。這就是推導 Mohr 圓時要用三角形元素、分別考慮各面面積的原因。地質慣例：壓應力為正。" source="Fossen (2016) Fig. 4.1–4.2；課堂投影片 Ch4 p.7–8">
      <svg viewBox="0 0 640 210" className="ix-svg" role="img" aria-label="力與應力的分解">
        <Marks />
        <line x1={40} y1={150} x2={260} y2={70} stroke={INK} strokeWidth={3} />
        <line x1={100} y1={45} x2={150} y2={110} stroke={C.orange} strokeWidth={3.5} markerEnd="url(#sm-o)" />
        <text x={92} y={42} style={{ fontSize: 13, fontWeight: 800, fill: C.orange }}>F</text>
        <line x1={150} y1={110} x2={168.7} y2={161.5} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#sm-t)" />
        <text x={176} y={160} style={{ fontSize: 12, fontWeight: 800, fill: C.teal }}>Fn（垂直面）</text>
        <line x1={150} y1={110} x2={178} y2={99.8} stroke={C.rose} strokeWidth={2.5} markerEnd="url(#sm-r)" />
        <text x={182} y={96} style={{ fontSize: 12, fontWeight: 800, fill: C.rose }}>Fs（平行面）</text>
        <text x={150} y={190} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>力：可以直接分解</text>
        {/* 面積效應 */}
        <rect x={380} y={110} width={80} height={20} fill={C.navy} fillOpacity={0.3} stroke={INK} />
        <line x1={420} y1={50} x2={420} y2={106} stroke={C.orange} strokeWidth={3.5} markerEnd="url(#sm-o)" />
        <text x={420} y={150} textAnchor="middle" style={{ fontSize: 11 }}>面積 A：σ = F/A</text>
        <polygon points="510,130 600,95 606,110 516,145" fill={C.navy} fillOpacity={0.3} stroke={INK} />
        <line x1={558} y1={40} x2={558} y2={108} stroke={C.orange} strokeWidth={3.5} markerEnd="url(#sm-o)" />
        <text x={560} y={170} textAnchor="middle" style={{ fontSize: 11 }}>斜面面積 A/cos θ：應力變小</text>
        <text x={500} y={190} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>應力：要考慮面積</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch4：應力張量的九個分量 ───────────── */

export function StressCubeFig() {
  // 等角投影的立方體
  const o = [150, 150];
  const ex = [70, 35], ey = [-70, 35], ez = [0, -80];
  const p = (a: number, b: number, c: number) => `${o[0] + a * ex[0] + b * ey[0] + c * ez[0]},${o[1] + a * ex[1] + b * ey[1] + c * ez[1]}`;
  const pt = (a: number, b: number, c: number) => [o[0] + a * ex[0] + b * ey[0] + c * ez[0], o[1] + a * ex[1] + b * ey[1] + c * ez[1]];
  const arrow = (from: number[], d: number[], col: string, lab: string) => (
    <g>
      <line x1={from[0]} y1={from[1]} x2={from[0] + d[0]} y2={from[1] + d[1]} stroke={col} strokeWidth={2.5} markerEnd={`url(#${col === C.orange ? "sm-o" : "sm-t"})`} />
      <text x={from[0] + d[0] * 1.5} y={from[1] + d[1] * 1.5 + 4} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: col }}>{lab}</text>
    </g>
  );
  const cx = pt(1, 0.5, 0.5); // x 面中心
  return (
    <Fig caption="一個小立方體三個面上的應力：每個面有一個正應力（垂直面）和兩個剪應力（平行面），三個面共 9 個分量，組成二階張量 σij（第一個下標是面的法線方向，第二個是應力的方向，例如 σxy 作用在垂直 x 軸的面上、方向平行 y）。立方體靜止時力矩平衡，σxy = σyx，所以獨立的只有 6 個。轉到適當的座標方向，剪應力全部變成 0，剩下對角線的三個就是主應力 σ1 ≥ σ2 ≥ σ3。" source="Fossen (2016) Fig. 4.6；課堂投影片 Ch4 p.10–12">
      <svg viewBox="0 0 640 260" className="ix-svg" role="img" aria-label="應力張量">
        <Marks />
        <polygon points={[p(1, 0, 0), p(1, 1, 0), p(1, 1, 1), p(1, 0, 1)].join(" ")} fill={C.blue} fillOpacity={0.25} stroke={INK} />
        <polygon points={[p(0, 1, 0), p(1, 1, 0), p(1, 1, 1), p(0, 1, 1)].join(" ")} fill={C.teal} fillOpacity={0.15} stroke={INK} />
        <polygon points={[p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)].join(" ")} fill={C.gold} fillOpacity={0.15} stroke={INK} />
        {arrow(cx, [42, 21], C.orange, "σxx")}
        {arrow(cx, [-30, 15], C.teal, "σxy")}
        {arrow(cx, [0, -38], C.teal, "σxz")}
        <text x={o[0] + 2 * ex[0] + 10} y={o[1] + 2 * ex[1]} style={{ fontSize: 12 }}>x</text>
        <line x1={o[0]} y1={o[1]} x2={o[0] + 1.8 * ex[0]} y2={o[1] + 1.8 * ex[1]} stroke={INK} strokeOpacity={0.4} strokeDasharray="3 3" />
        <foreignObject x={340} y={50} width={280} height={170}>
          <div style={{ fontSize: 15, lineHeight: 1.9, color: "currentColor", fontFamily: "serif" }}>
            <div>σ<sub>ij</sub> =</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 70px)", borderLeft: "2px solid currentColor", borderRight: "2px solid currentColor", padding: "4px 8px", width: 230 }}>
              <b style={{ color: "var(--orange)" }}>σxx</b><span>σxy</span><span>σxz</span>
              <span>σyx</span><b style={{ color: "var(--orange)" }}>σyy</b><span>σyz</span>
              <span>σzx</span><span>σzy</span><b style={{ color: "var(--orange)" }}>σzz</b>
            </div>
            <div style={{ fontSize: 12, fontFamily: "inherit", marginTop: 6 }}>對角線（橘）：正應力；其他：剪應力</div>
          </div>
        </foreignObject>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch4：常見應力狀態的 3D Mohr 圖 ───────────── */

export function Mohr3DFig() {
  const panel = (ox: number, title: string, s: [number, number, number]) => {
    const k = 3.2, y0 = 110;
    const X = (v: number) => ox + 10 + v * k;
    const circ = (a: number, b: number, col: string, fill: boolean) => (
      <circle cx={X((a + b) / 2)} cy={y0} r={Math.max(1.5, ((a - b) / 2) * k)} fill={fill ? col : "none"} fillOpacity={fill ? 0.18 : 0} stroke={col} strokeWidth={2} />
    );
    return (
      <g>
        <line x1={ox} x2={ox + 140} y1={y0} y2={y0} stroke={INK} strokeWidth={1.2} />
        <line x1={X(0)} x2={X(0)} y1={y0 - 55} y2={y0 + 10} stroke={INK} strokeWidth={1.2} />
        {circ(s[0], s[2], C.teal, true)}
        {s[1] !== s[2] && s[1] !== s[0] && circ(s[0], s[1], C.orange, false)}
        {s[1] !== s[2] && s[1] !== s[0] && circ(s[1], s[2], C.orange, false)}
        <text x={ox + 70} y={y0 + 60} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{title}</text>
        <text x={ox + 70} y={y0 + 78} textAnchor="middle" style={{ fontSize: 10.5 }}>σ1 = {s[0]}、σ2 = {s[1]}、σ3 = {s[2]}</text>
      </g>
    );
  };
  return (
    <Fig caption="三維時三個主應力畫成三個圓（σ1–σ3 大圓、σ1–σ2 和 σ2–σ3 兩個小圓），所有可能的面落在大圓內、兩小圓外的區域。靜水（靜岩）狀態三個主應力相等，圓縮成一點，任何面上都沒有剪應力。單軸壓縮只有 σ1；軸向壓縮（三軸實驗）σ2 = σ3，兩個小圓有一個縮成點；一般的三軸應力三個圓都在。" source="Fossen (2016) Fig. 4.10；課堂投影片 Ch4 p.20">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="3D Mohr 圖">
        {panel(10, "靜水／靜岩", [25, 25, 25])}
        {panel(170, "單軸壓縮", [35, 0, 0])}
        {panel(330, "軸向壓縮（σ2 = σ3）", [38, 12, 12])}
        {panel(490, "三軸（一般）", [38, 22, 8])}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch5：裸孔崩落與水力劈裂 ───────────── */

export function BoreholeFig() {
  return (
    <Fig caption="從井孔量現地應力（俯視井的橫切面）。左：裸孔崩落。井壁上和 σH 垂直的兩側應力集中最大，岩石剝落，所以井孔沿 σh 方向被拉長：剝落方向平行最小水平應力 σh。右：水力劈裂。把一段井封起來加壓，張裂會沿著最容易打開的方向形成，也就是垂直 σh、平行 σH 的方向；維持裂縫張開所需的壓力約等於 σh。" source="Fossen (2016) Fig. 5.2–5.4；課堂投影片 Ch5 p.23–28">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="裸孔崩落與水力劈裂">
        <Marks />
        {[0, 1].map((k) => {
          const ox = 160 + k * 320, oy = 110;
          return (
            <g key={k}>
              <rect x={ox - 110} y={oy - 90} width={220} height={180} fill={C.navy} fillOpacity={0.12} />
              {[1, -1].map((sg) => (
                <line key={sg} x1={ox + sg * 105} y1={oy} x2={ox + sg * 70} y2={oy} stroke={C.orange} strokeWidth={5} markerEnd="url(#sm-o)" />
              ))}
              {[1, -1].map((sg) => (
                <line key={`v${sg}`} x1={ox} y1={oy + sg * 88} x2={ox} y2={oy + sg * 66} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#sm-t)" />
              ))}
              <text x={ox + 98} y={oy - 10} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>σH</text>
              <text x={ox + 18} y={oy - 76} style={{ fontSize: 12, fontWeight: 800, fill: C.teal }}>σh</text>
              {k === 0 ? (
                <path d={`M${ox - 28},${oy} A28,28 0 0,1 ${ox - 12},${oy - 25} L${ox},${oy - 46} L${ox + 12},${oy - 25} A28,28 0 0,1 ${ox + 12},${oy + 25} L${ox},${oy + 46} L${ox - 12},${oy + 25} A28,28 0 0,1 ${ox - 28},${oy}`} fill={INK} fillOpacity={0.6} stroke={INK} />
              ) : (
                <g>
                  <circle cx={ox} cy={oy} r={26} fill={INK} fillOpacity={0.6} />
                  <line x1={ox - 70} y1={oy} x2={ox + 70} y2={oy} stroke={C.rose} strokeWidth={3} />
                </g>
              )}
              <text x={ox} y={oy + 108} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{k === 0 ? "崩落：井孔沿 σh 拉長" : "水力劈裂：裂縫平行 σH"}</text>
            </g>
          );
        })}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch5：板塊力 ───────────── */

export function PlateForcesFig() {
  return (
    <Fig caption="和板塊運動有關的力。中洋脊推力（ridge push）：中洋脊地形高，往兩側推，脊頂附近是正斷層、遠處是逆斷層。隱沒板塊拉力（slab pull）：下沉的板塊拉著後面的板塊，老而冷、密度大的海洋岩石圈最大；如果隱沒的是輕的大陸地殼則為負。底部拖曳（basal drag）：岩石圈底部和地函之間的剪力，依兩者的相對運動，可能驅動也可能阻擋。碰撞阻力（collisional resistance）：作用在隱沒板塊上方，陸–陸碰撞時最大。水平應力主要來自這些板塊力，垂直應力來自上覆岩層的重量。" source="Fossen (2016) Fig. 5.13；課堂投影片 Ch5 p.46–47">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="板塊力">
        <Marks />
        <path d="M20,90 L120,90 Q170,60 220,90 L460,96 Q500,98 530,110 L600,200 L570,205 L505,120 Q480,108 455,108 L220,104 Q170,78 120,104 L20,104 Z" fill={C.blue} fillOpacity={0.3} stroke={INK} />
        <path d="M480,80 L640,80 L640,96 L530,96 Z" fill={C.gold} fillOpacity={0.35} stroke={INK} />
        <rect x={0} y={104} width={640} height={110} fill={C.orange} fillOpacity={0.08} />
        <line x1={190} y1={70} x2={250} y2={74} stroke={C.orange} strokeWidth={3} markerEnd="url(#sm-o)" />
        <line x1={150} y1={70} x2={90} y2={74} stroke={C.orange} strokeWidth={3} markerEnd="url(#sm-o)" />
        <text x={170} y={50} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>中洋脊推力</text>
        <line x1={560} y1={150} x2={585} y2={190} stroke={C.rose} strokeWidth={3} markerEnd="url(#sm-r)" />
        <text x={600} y={150} textAnchor="end" style={{ fontSize: 12, fontWeight: 800, fill: C.rose }}>隱沒板塊拉力</text>
        <line x1={380} y1={125} x2={320} y2={125} stroke={C.teal} strokeWidth={3} markerEnd="url(#sm-t)" />
        <text x={350} y={145} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: C.teal }}>底部拖曳（±）</text>
        <line x1={540} y1={70} x2={505} y2={88} stroke={INK} strokeWidth={3} markerEnd="url(#sm-k)" />
        <text x={560} y={66} style={{ fontSize: 12, fontWeight: 800 }}>碰撞阻力</text>
        <text x={330} y={86} textAnchor="middle" style={{ fontSize: 11 }}>海洋岩石圈 → 板塊運動方向</text>
        <text x={320} y={200} textAnchor="middle" style={{ fontSize: 11, opacity: 0.8 }}>軟流圈</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch5：水平擠壓增加時的應力體制 ───────────── */

export function StressRegimeFig() {
  const W = 560, H = 230, L = 50, R = 16, T = 16, B = 40;
  const x = (c: number) => L + c * (W - L - R);
  const y = (s: number) => T + ((100 - s) / 100) * (H - T - B);
  const sv = 50;
  const sH = (c: number) => 15 + 85 * c;
  const sh = (c: number) => 10 + 55 * c;
  const c1 = (sv - 15) / 85, c2 = (sv - 10) / 55;
  return (
    <Fig caption="垂直應力 σV（上覆岩層重量）固定，水平擠壓逐漸增加。一開始兩個水平應力都比 σV 小，σV = σ1，是正斷層體制；σH 先超過 σV，這時 σV 變成 σ2，進入平移斷層體制；擠壓再大，σh 也超過 σV，σV 變成 σ3，進入逆斷層體制。所以從伸張到擠壓，中間會先經過平移體制（應力軸交換）。這也解釋了為什麼造山帶裡逆斷層、平移斷層、正斷層可以同時出現。" source="Fossen (2016) Fig. 5.12；課堂投影片 Ch5 p.40–43">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="應力體制隨水平擠壓變化">
        <rect x={x(0)} y={T} width={x(c1) - x(0)} height={H - T - B} fill={C.teal} fillOpacity={0.1} />
        <rect x={x(c1)} y={T} width={x(c2) - x(c1)} height={H - T - B} fill={C.gold} fillOpacity={0.12} />
        <rect x={x(c2)} y={T} width={x(1) - x(c2)} height={H - T - B} fill={C.orange} fillOpacity={0.1} />
        <line x1={x(0)} x2={x(1)} y1={y(sv)} y2={y(sv)} stroke={INK} strokeWidth={2.5} />
        <line x1={x(0)} x2={x(1)} y1={y(sH(0))} y2={y(sH(1))} stroke={C.orange} strokeWidth={2.5} />
        <line x1={x(0)} x2={x(1)} y1={y(sh(0))} y2={y(sh(1))} stroke={C.blue} strokeWidth={2.5} />
        <text x={x(0.02)} y={y(sv) - 6} style={{ fontSize: 12, fontWeight: 800 }}>σV</text>
        <text x={x(0.97)} y={y(sH(0.97)) - 6} textAnchor="end" style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>σH</text>
        <text x={x(0.97)} y={y(sh(0.97)) + 16} textAnchor="end" style={{ fontSize: 12, fontWeight: 800, fill: C.blue }}>σh</text>
        <text x={x(c1 / 2)} y={T + 16} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>正斷層</text>
        <text x={x(c1 / 2)} y={T + 32} textAnchor="middle" style={{ fontSize: 11 }}>σV = σ1</text>
        <text x={x((c1 + c2) / 2)} y={T + 16} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>平移斷層</text>
        <text x={x((c1 + c2) / 2)} y={T + 32} textAnchor="middle" style={{ fontSize: 11 }}>σV = σ2</text>
        <text x={x((c2 + 1) / 2)} y={T + 16} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>逆斷層</text>
        <text x={x((c2 + 1) / 2)} y={T + 32} textAnchor="middle" style={{ fontSize: 11 }}>σV = σ3</text>
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <text x={(L + W) / 2} y={H - 12} textAnchor="middle" style={{ fontSize: 12 }}>水平擠壓 →</text>
        <text x={18} y={(T + H - B) / 2} transform={`rotate(-90 18 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>應力（示意）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch6：三種彈性 ───────────── */

export function ElasticTypesFig() {
  const panel = (ox: number, title: string, up: string, down: string) => (
    <g transform={`translate(${ox},20)`}>
      <line x1={0} x2={160} y1={130} y2={130} stroke={INK} strokeWidth={1.5} />
      <line x1={0} x2={0} y1={0} y2={130} stroke={INK} strokeWidth={1.5} />
      <path d={up} fill="none" stroke={C.orange} strokeWidth={2.6} />
      <path d={down} fill="none" stroke={C.teal} strokeWidth={2.2} strokeDasharray="5 3" />
      <text x={80} y={150} textAnchor="middle" style={{ fontSize: 11 }}>應變</text>
      <text x={-8} y={65} transform="rotate(-90 -8 65)" textAnchor="middle" style={{ fontSize: 11 }}>應力</text>
      <text x={80} y={172} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{title}</text>
    </g>
  );
  return (
    <Fig caption="彈性的三種型態（橘：加載；藍綠虛線：卸載）。線彈性：加載和卸載都沿同一條直線，斜率就是楊氏模數 E，大部分岩石和礦物在小應變時都是這樣。完美彈性：路徑是曲線，但加載、卸載走同一條。彈性滯後：加載和卸載走不同路徑，圍出一個迴圈，但最後仍回到原點（沒有永久應變）。" source="Fossen (2016) Fig. 6.4；課堂投影片 Ch6 p.6–7">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="三種彈性">
        {panel(40, "線彈性", "M0,130 L140,20", "M140,20 L0,130")}
        {panel(240, "完美彈性（非線性）", "M0,130 C60,120 110,70 140,20", "M140,20 C110,70 60,120 0,130")}
        {panel(440, "彈性滯後", "M0,130 C70,125 110,70 140,20", "M140,20 C90,50 40,100 0,130")}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch6：潛變曲線 ───────────── */

export function CreepCurveFig() {
  return (
    <Fig caption="恆應力潛變試驗的應變–時間曲線。施加應力的瞬間有一段彈性應變；初期（暫態）潛變應變率逐漸減小；二期（穩態）潛變應變隨時間線性增加；三期（加速）潛變應變率越來越快，最後破壞。潛變大多發生在同系溫度 T/Tm（用絕對溫度）大於約 0.5 時。台灣的例子：池上斷層的潛移、1999 草嶺山崩滑動面的潛變。" source="Fossen (2016) Fig. 6.15；課堂投影片 Ch6 p.28–29">
      <svg viewBox="0 0 640 210" className="ix-svg" role="img" aria-label="潛變曲線">
        <rect x={110} y={20} width={140} height={150} fill={C.teal} fillOpacity={0.08} />
        <rect x={250} y={20} width={220} height={150} fill={C.gold} fillOpacity={0.08} />
        <rect x={470} y={20} width={120} height={150} fill={C.rose} fillOpacity={0.08} />
        <path d="M60,170 L60,140 C90,110 110,104 140,100 C180,96 220,93 250,92 L470,70 C520,62 560,40 585,22" fill="none" stroke={C.orange} strokeWidth={3} />
        <text x={585} y={18} textAnchor="end" style={{ fontSize: 11, fontWeight: 800, fill: C.rose }}>破壞</text>
        <text x={64} y={150} style={{ fontSize: 10.5 }}>彈性</text>
        <text x={180} y={150} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>初期（暫態）</text>
        <text x={180} y={166} textAnchor="middle" style={{ fontSize: 10.5 }}>應變率遞減</text>
        <text x={360} y={150} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>二期（穩態）</text>
        <text x={360} y={166} textAnchor="middle" style={{ fontSize: 10.5 }}>應變率固定</text>
        <text x={530} y={150} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>三期（加速）</text>
        <text x={530} y={166} textAnchor="middle" style={{ fontSize: 10.5 }}>應變率遞增</text>
        <line x1={50} x2={600} y1={170} y2={170} stroke={INK} strokeWidth={1.5} />
        <line x1={50} x2={50} y1={10} y2={170} stroke={INK} strokeWidth={1.5} />
        <text x={325} y={194} textAnchor="middle" style={{ fontSize: 12 }}>時間 →</text>
        <text x={30} y={90} transform="rotate(-90 30 90)" textAnchor="middle" style={{ fontSize: 12 }}>應變</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch6：脆性到韌性的四種樣式 ───────────── */

export function DuctileStylesFig() {
  const panel = (ox: number, title: string, width: number, crack: boolean, sideBend: boolean) => {
    const lines = [0, 1, 2, 3, 4];
    return (
      <g transform={`translate(${ox},10)`}>
        <rect x={0} y={0} width={130} height={140} fill={C.navy} fillOpacity={0.12} stroke={INK} strokeOpacity={0.3} />
        {lines.map((i) => {
          const y0 = 20 + i * 25;
          // 剪切帶：中間寬 width，兩側彎曲
          const mid = 65;
          const d = width < 6 ? `M0,${y0} L${mid - 2},${y0} M${mid + 2},${y0 + 18} L130,${y0 + 18}` : `M0,${y0} L${mid - width / 2 - (sideBend ? 10 : 0)},${y0} C${mid - width / 4},${y0} ${mid + width / 4},${y0 + 18} ${mid + width / 2 + (sideBend ? 10 : 0)},${y0 + 18} L130,${y0 + 18}`;
          return <path key={i} d={d} fill="none" stroke={INK} strokeWidth={1.6} />;
        })}
        {width >= 6 && <rect x={65 - width / 2} y={0} width={width} height={140} fill={C.orange} fillOpacity={0.15} />}
        {crack && <line x1={65} y1={0} x2={65} y2={140} stroke={C.rose} strokeWidth={2.4} />}
        <text x={65} y={162} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{title}</text>
      </g>
    );
  };
  return (
    <Fig caption="同一個剪切變形，從脆性到韌性的四種樣式。(a) 脆性：變形集中在一條很窄的破裂面，兩側岩石沒有變形。(b) 韌脆性：仍集中在窄的破裂帶，但兩側有一些韌性彎曲。(c) 脆韌性：寬廣的韌性剪切帶，應變從中心往兩側遞減，中心有裂隙。(d) 韌性：寬廣的剪切帶，中心沒有裂隙，原本連續的層保持連續。注意「韌性」描述的是變形的樣式（保持連續），「塑性」描述的是晶體內差排的機制，「脆性」可以指樣式也可以指機制。" source="Fossen (2016) Fig. 6.20；課堂投影片 Ch6 p.32–33">
      <svg viewBox="0 0 640 180" className="ix-svg" role="img" aria-label="脆性到韌性的四種樣式">
        {panel(20, "(a) 脆性", 0, true, false)}
        {panel(175, "(b) 韌脆性", 14, true, true)}
        {panel(330, "(c) 脆韌性", 50, true, false)}
        {panel(485, "(d) 韌性", 60, false, false)}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch6：地殼斷層模型 ───────────── */

export function FaultZoneModelFig() {
  const zones: [number, number, string, string, string, string][] = [
    [0, 4, "斷層泥", "摩擦區（脆性）", "孔隙、顆粒滑動", C.gold],
    [4, 11, "碎裂岩", "摩擦區（脆性）：大地震震源", "碎裂流", C.orange],
    [11, 15, "碎裂岩 + 糜稜岩", "摩擦–塑性過渡（石英 ~300 °C）", "綠色片岩相", C.rose],
    [15, 25, "糜稜岩", "塑性區（石英塑性）", "綠色片岩相 → 角閃岩相", C.violet],
    [25, 35, "糜稜岩", "長石塑性變形", "角閃岩相", C.blue],
  ];
  const y = (z: number) => 20 + z * 5.4;
  return (
    <Fig caption="一條穿過整個地殼的斷層，在不同深度長不一樣（地殼斷層模型）。淺處是摩擦區，斷層岩是未固結的斷層泥和碎裂岩，強度由 Byerlee 摩擦控制、隨深度增加；大地震的震源通常在脆性區底部、強度最大的地方。石英在約 300 °C（10–15 km）開始塑性變形，進入摩擦–塑性過渡；再往下是塑性區，斷層變成寬廣的韌性剪切帶，斷層岩是糜稜岩，強度隨溫度下降。長石大約在 500 °C 才開始塑性變形。右側曲線是強度剖面的示意。" source="Sibson (1977)、Scholz (1988) 的地殼斷層模型；課堂投影片 Ch6 p.34；斷層岩見 Ch9">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="地殼斷層模型">
        {zones.map(([a, b, rock, regime, meta, c]) => (
          <g key={a}>
            <rect x={20} y={y(a)} width={400} height={y(b) - y(a)} fill={c} fillOpacity={0.15} stroke={INK} strokeOpacity={0.2} />
            <text x={30} y={(y(a) + y(b)) / 2 + 4} style={{ fontSize: 11.5, fontWeight: 800 }}>{rock}</text>
            <text x={160} y={(y(a) + y(b)) / 2 + 4} style={{ fontSize: 11 }}>{regime}</text>
            <text x={415} y={(y(a) + y(b)) / 2 + 4} textAnchor="end" style={{ fontSize: 10, opacity: 0.75 }}>{meta}</text>
          </g>
        ))}
        <path d={`M140,${y(0)} L140,${y(11)} C140,${y(14)} 128,${y(17)} 115,${y(22)} L100,${y(35)}`} fill="none" stroke={C.rose} strokeWidth={2} strokeDasharray="5 3" opacity={0.6} />
        <circle cx={140} cy={y(10)} r={6} fill={C.rose} />
        <text x={430} y={y(0) + 2} style={{ fontSize: 11 }}>0 km</text>
        <text x={430} y={y(11) + 4} style={{ fontSize: 11 }}>~11 km</text>
        <text x={430} y={y(35)} style={{ fontSize: 11 }}>~35 km</text>
        {/* 強度剖面 */}
        <line x1={480} x2={620} y1={y(0)} y2={y(0)} stroke={INK} strokeWidth={1.5} />
        <line x1={480} x2={480} y1={y(0)} y2={y(35)} stroke={INK} strokeWidth={1.5} />
        <path d={`M480,${y(0)} L590,${y(11)} C560,${y(14)} 520,${y(20)} 490,${y(35)}`} fill={C.orange} fillOpacity={0.2} stroke={C.orange} strokeWidth={2.4} />
        <text x={550} y={y(0) - 4} textAnchor="middle" style={{ fontSize: 11 }}>強度 →</text>
        <text x={592} y={y(11) + 14} textAnchor="middle" style={{ fontSize: 10.5 }}>脆–塑轉換</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch6：岩石圈強度的三種模型 ───────────── */

export function LithosphereModelsFig() {
  const panel = (ox: number, title: string, sub: string, d: string) => (
    <g transform={`translate(${ox},20)`}>
      <rect x={0} y={0} width={150} height={60} fill={C.gold} fillOpacity={0.12} />
      <rect x={0} y={60} width={150} height={100} fill={C.violet} fillOpacity={0.1} />
      <text x={146} y={14} textAnchor="end" style={{ fontSize: 10 }}>地殼</text>
      <text x={146} y={74} textAnchor="end" style={{ fontSize: 10 }}>地函</text>
      <line x1={0} x2={150} y1={60} y2={60} stroke={INK} strokeDasharray="4 3" />
      <path d={d} fill={C.orange} fillOpacity={0.3} stroke={C.orange} strokeWidth={2.2} />
      <line x1={0} x2={0} y1={0} y2={160} stroke={INK} strokeWidth={1.5} />
      <text x={75} y={180} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{title}</text>
      <text x={75} y={196} textAnchor="middle" style={{ fontSize: 10.5 }}>{sub}</text>
    </g>
  );
  return (
    <Fig caption="大陸岩石圈的強度怎麼分布（橘色是強度剖面，越往右越強）。果醬三明治：上地殼和上部地函都強，中間的下地殼弱，適用於冷的岩石圈（熱流較低）。焦糖布蕾：只有地殼強，熱的地函很弱（熱流較高）。香蕉船：孔隙壓很高（λ ≈ 0.9）時，整個岩石圈都弱。三者差在溫度和孔隙壓，可以用上面的互動圖自己做出來。" source="Bürgmann & Dresen (2008) Annu. Rev. Earth Planet. Sci.；課堂投影片 Ch6 p.37">
      <svg viewBox="0 0 640 225" className="ix-svg" role="img" aria-label="果醬三明治、焦糖布蕾、香蕉船">
        {panel(40, "果醬三明治", "冷岩石圈：兩個強層", "M0,0 L90,30 L20,58 L0,60 L0,62 L80,75 L10,150 L0,160 Z")}
        {panel(245, "焦糖布蕾", "熱岩石圈：只有地殼強", "M0,0 L100,35 L15,58 L0,60 L0,62 L10,70 L0,90 Z")}
        {panel(450, "香蕉船", "高孔隙壓：整體都弱", "M0,0 L30,40 L5,58 L0,60 L0,62 L20,72 L0,110 Z")}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch6：薄皮與厚皮構造 ───────────── */

export function ThinThickSkinFig() {
  return (
    <Fig caption="左：薄皮構造（thin-skinned）。變形集中在沉積蓋層，逆衝斷層都從一條基底滑脫面（décollement）分出來；滑脫面由軟弱的頁岩、蒸發岩或高孔隙壓的地層組成，力學上很弱，所以下面的基盤幾乎沒有變形。右：厚皮構造（thick-skinned）。基盤也被斷層切穿、參與變形，常是舊的正斷層再活動。流變分層決定哪一種：有軟弱的滑脫層、或中地殼弱（脫偶）時傾向薄皮；基盤強、或有基盤高區（例如台灣西部的北港高區）擋住時，變形會深入基盤。" source="課堂投影片 Ch6 p.48–49；Mouthereau & Petit (2003) JGR">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="薄皮與厚皮構造">
        {/* 薄皮 */}
        <rect x={20} y={130} width={280} height={50} fill={C.violet} fillOpacity={0.25} />
        <text x={160} y={162} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>基盤（不變形）</text>
        <path d="M20,130 L300,130" stroke={C.rose} strokeWidth={3} />
        <text x={296} y={124} textAnchor="end" style={{ fontSize: 10.5, fill: C.rose, fontWeight: 800 }}>基底滑脫面</text>
        {[0, 1, 2].map((i) => {
          const x0 = 60 + i * 80;
          return (
            <g key={i}>
              <path d={`M${x0},130 C${x0 + 20},130 ${x0 + 30},110 ${x0 + 45},60`} fill="none" stroke={C.rose} strokeWidth={2} />
              <path d={`M${x0 - 30},${100 - i * 4} Q${x0 + 25},${70 - i * 4} ${x0 + 70},${100 - i * 4}`} fill="none" stroke={INK} strokeWidth={1.6} />
              <path d={`M${x0 - 30},${115 - i * 4} Q${x0 + 25},${88 - i * 4} ${x0 + 70},${115 - i * 4}`} fill="none" stroke={INK} strokeWidth={1.6} />
            </g>
          );
        })}
        <text x={160} y={196} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>薄皮：只有沉積蓋層變形</text>
        {/* 厚皮 */}
        <rect x={340} y={110} width={280} height={70} fill={C.violet} fillOpacity={0.25} />
        {[0, 1].map((i) => {
          const x0 = 420 + i * 110;
          return (
            <g key={i}>
              <path d={`M${x0 - 20},180 L${x0 + 30},50`} stroke={C.rose} strokeWidth={2.6} />
              <path d={`M${x0 - 80},${90} Q${x0 - 10},${60} ${x0 + 40},${70}`} fill="none" stroke={INK} strokeWidth={1.6} />
              <path d={`M${x0 - 80},${105} Q${x0 - 10},${80} ${x0 + 40},${88}`} fill="none" stroke={INK} strokeWidth={1.6} />
            </g>
          );
        })}
        <text x={480} y={150} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>基盤也被切穿</text>
        <text x={480} y={196} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>厚皮：基盤參與變形</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch7：破裂的模式與方位 ───────────── */

export function FractureModesFig() {
  const box = (ox: number, title: string, sub: string, inner: ReactNode) => (
    <g transform={`translate(${ox},20)`}>
      <rect x={0} y={0} width={130} height={110} fill={C.navy} fillOpacity={0.15} stroke={INK} strokeOpacity={0.35} />
      {inner}
      <text x={65} y={146} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{title}</text>
      <text x={65} y={163} textAnchor="middle" style={{ fontSize: 10.5 }}>{sub}</text>
    </g>
  );
  const s1 = (len = 18) => (
    <g>
      <line x1={65} y1={-16} x2={65} y2={-2} stroke={C.orange} strokeWidth={3} markerEnd="url(#sm-o)" />
      <line x1={65} y1={126 - 0} x2={65} y2={112} stroke={C.orange} strokeWidth={3} markerEnd="url(#sm-o)" transform="translate(0,0)" />
      <text x={74} y={-6} style={{ fontSize: 10.5, fontWeight: 800, fill: C.orange }}>σ1</text>
      {len > 0 && null}
    </g>
  );
  return (
    <Fig caption="破裂的四種模式和它們跟主應力的方位關係（σ1 垂直）。Mode I（張開）：裂面兩側往外張開，形成節理、裂縫或礦脈，裂面垂直 σ3、平行 σ1。Mode II（滑動）與 Mode III（撕裂）：剪裂，兩側沿裂面滑動，位移方向分別垂直和平行裂隙前緣；剪裂成對出現（共軛），各和 σ1 夾約 30°，交線平行 σ2。Mode IV（閉合）：縫合線，壓溶把物質溶走，留下不溶殘餘，面垂直 σ1。剪切加張開的叫混合型（hybrid）破裂。" source="Fossen (2016) Fig. 7.5–7.6；課堂投影片 Ch7 p.5–7">
      <svg viewBox="0 0 640 210" className="ix-svg" role="img" aria-label="破裂模式">
        <Marks />
        {box(20, "Mode I 張開", "節理、脈：⊥ σ3", (
          <g>
            <path d="M65,10 L60,55 L65,100 L70,55 Z" fill={C.blue} fillOpacity={0.5} stroke={C.blue} />
            <line x1={40} y1={55} x2={20} y2={55} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#sm-t)" />
            <line x1={90} y1={55} x2={110} y2={55} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#sm-t)" />
          </g>
        ))}
        {box(175, "Mode II 滑動", "剪裂：和 σ1 夾 ~30°", (
          <g>
            <line x1={36} y1={105} x2={94} y2={5} stroke={C.rose} strokeWidth={3} />
            <line x1={50} y1={60} x2={60} y2={43} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
            <line x1={82} y1={50} x2={72} y2={67} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
          </g>
        ))}
        {box(330, "Mode III 撕裂", "剪裂（位移平行前緣）", (
          <g>
            <line x1={36} y1={105} x2={94} y2={5} stroke={C.rose} strokeWidth={3} />
            <circle cx={55} cy={56} r={6} fill="none" stroke={INK} strokeWidth={1.5} />
            <circle cx={55} cy={56} r={1.8} fill={INK} />
            <circle cx={78} cy={58} r={6} fill="none" stroke={INK} strokeWidth={1.5} />
            <line x1={74} y1={54} x2={82} y2={62} stroke={INK} strokeWidth={1.5} />
            <line x1={82} y1={54} x2={74} y2={62} stroke={INK} strokeWidth={1.5} />
          </g>
        ))}
        {box(485, "Mode IV 閉合", "縫合線：⊥ σ1", (
          <path d="M10,55 L20,48 L28,60 L36,46 L46,58 L56,47 L66,60 L76,46 L86,59 L96,47 L106,58 L120,52" fill="none" stroke={C.gold} strokeWidth={2.5} />
        ))}
        {[20, 175, 330, 485].map((ox) => (
          <g key={ox} transform={`translate(${ox},20)`}>{s1()}</g>
        ))}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch7：四個環境因子 ───────────── */

export function EnvFactorsFig() {
  const panel = (ox: number, title: string, curves: [string, string, string][]) => (
    <g transform={`translate(${ox},14)`}>
      <line x1={0} x2={130} y1={120} y2={120} stroke={INK} strokeWidth={1.4} />
      <line x1={0} x2={0} y1={0} y2={120} stroke={INK} strokeWidth={1.4} />
      {curves.map(([d, col, lab], i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={col} strokeWidth={2.4} />
          <text x={Number(d.split(" ").slice(-1)[0].replace(/[A-Z]/g, "").split(",")[0]) + 4} y={Number(d.split(" ").slice(-1)[0].split(",")[1]) + 4} style={{ fontSize: 9.5, fill: col, fontWeight: 700 }}>{lab}</text>
        </g>
      ))}
      <text x={65} y={136} textAnchor="middle" style={{ fontSize: 10 }}>應變</text>
      <text x={-8} y={60} transform="rotate(-90 -8 60)" textAnchor="middle" style={{ fontSize: 10 }}>差應力</text>
      <text x={65} y={156} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{title}</text>
    </g>
  );
  const strong = "M0,120 L25,30 C30,22 34,25 38,60 L45,95";
  const ductile = "M0,120 L20,50 C40,30 80,22 120,18";
  const weak = "M0,120 L12,90 C40,82 80,80 120,78";
  return (
    <Fig caption="三軸實驗中，四個環境因子讓應力–應變曲線怎麼變（考古題）。圍壓增加：強度增加，而且從破裂後應力驟降（脆性）變成持續塑性流動（延展性增加）。孔隙壓增加：效果相當於降低圍壓（有效應力變小），強度和延展性都下降。溫度增加：強度下降、延展性增加。應變率增加：強度增加、延展性下降（偏脆性）。" source="Fossen (2016) Fig. 7.9–7.11；課堂投影片 Ch7 p.9–11（大理石、Yule marble 等實驗）">
      <svg viewBox="0 0 640 190" className="ix-svg" role="img" aria-label="四個環境因子">
        {panel(30, "圍壓 ↑", [[strong, C.teal, "低"], [ductile, C.orange, "高"]])}
        {panel(185, "孔隙壓 ↑", [[ductile, C.teal, "低"], [strong, C.orange, "高"]])}
        {panel(340, "溫度 ↑", [[ductile, C.teal, "低"], [weak, C.orange, "高"]])}
        {panel(495, "應變率 ↑", [[weak, C.teal, "慢"], [ductile, C.orange, "快"]])}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch7：實驗變形樣式隨圍壓 ───────────── */

export function ExperimentStylesFig() {
  const sample = (ox: number, title: string, inner: ReactNode, barrel = false) => (
    <g transform={`translate(${ox},20)`}>
      {barrel ? (
        <path d="M20,0 L80,0 C95,40 95,80 80,120 L20,120 C5,80 5,40 20,0 Z" fill={C.navy} fillOpacity={0.25} stroke={INK} />
      ) : (
        <rect x={20} y={0} width={60} height={120} fill={C.navy} fillOpacity={0.25} stroke={INK} />
      )}
      {inner}
      <text x={50} y={142} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800 }}>{title}</text>
    </g>
  );
  return (
    <Fig caption="三軸實驗中，隨圍壓（和溫度）增加，岩樣破壞的樣子：(a) 張裂，裂面平行 σ1；(b) 剪裂，和 σ1 夾約 30°；(c) 共軛剪裂；(d) 剪力帶（脆韌性，分散的變形）；(e) 塑性流動，岩樣變成桶狀、沒有明顯破裂。脆–塑轉換在伸張狀態下比壓縮狀態需要更高的圍壓。" source="Fossen (2016) Fig. 7.8；課堂投影片 Ch7 p.8、p.11">
      <svg viewBox="0 0 640 170" className="ix-svg" role="img" aria-label="實驗變形樣式">
        {sample(20, "(a) 張裂", <line x1={50} y1={0} x2={52} y2={120} stroke={C.rose} strokeWidth={2.4} />)}
        {sample(145, "(b) 剪裂", <line x1={28} y1={110} x2={74} y2={10} stroke={C.rose} strokeWidth={2.4} />)}
        {sample(270, "(c) 共軛剪裂", <g><line x1={24} y1={100} x2={76} y2={20} stroke={C.rose} strokeWidth={2.4} /><line x1={24} y1={20} x2={76} y2={100} stroke={C.rose} strokeWidth={2.4} /></g>)}
        {sample(395, "(d) 剪力帶", <path d="M24,110 L74,10 L80,20 L30,120 Z" fill={C.rose} fillOpacity={0.3} />)}
        {sample(520, "(e) 塑性流動", <g />, true)}
        <line x1={20} x2={620} y1={10} y2={10} stroke={INK} strokeOpacity={0.4} />
        <text x={620} y={6} textAnchor="end" style={{ fontSize: 10.5 }}>圍壓、溫度增加 →</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch7：為什麼剪裂不在 45° ───────────── */

export function Why30Fig() {
  const W = 560, H = 230, L = 50, R = 16, T = 14, B = 40;
  const s1 = 100, s3 = 20, mu = 0.6;
  const c = (s1 + s3) / 2, r = (s1 - s3) / 2;
  // a：破裂面和 σ1 的夾角；法線和 σ1 的夾角 θ = 90 − a
  const sn = (a: number) => c + r * Math.cos(rad(2 * (90 - a)));
  const ss = (a: number) => r * Math.sin(rad(2 * (90 - a)));
  const x = (a: number) => L + (a / 90) * (W - L - R);
  const y = (v: number) => T + ((110 - v) / 140) * (H - T - B);
  const line = (f: (a: number) => number) => {
    const p: string[] = [];
    for (let a = 0; a <= 90; a += 1) p.push(`${x(a)},${y(f(a))}`);
    return p.join(" ");
  };
  const eff = (a: number) => ss(a) - mu * sn(a) + 30;
  let best = 0, bv = -1e9;
  for (let a = 0; a <= 90; a += 0.5) if (eff(a) > bv) { bv = eff(a); best = a; }
  return (
    <Fig caption="σ1 = 100、σ3 = 20 MPa 時，不同方向的面上的正應力 σn（藍）、剪應力 σs（橘），以及「剪應力 − μ × 正應力」（紅，μ = 0.6，代表推動破裂的淨量，往上平移以便比較）對「面和 σ1 的夾角」作圖。剪應力在 45° 最大，但那裡的正應力也大，摩擦阻力大；往小角度移，正應力降得比剪應力快，所以淨量在約 30° 最大，剪裂就在那裡形成：θ = 45° − φ/2（面和 σ1 的夾角）。" source="Fossen (2016) Box 7.2；課堂投影片 Ch7 p.16（Hw01）">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="為什麼剪裂不在 45°">
        <line x1={x(45)} x2={x(45)} y1={T} y2={H - B} stroke={C.orange} strokeDasharray="4 3" strokeOpacity={0.6} />
        <line x1={x(best)} x2={x(best)} y1={T} y2={H - B} stroke={C.rose} strokeDasharray="4 3" />
        <polyline points={line(sn)} fill="none" stroke={C.blue} strokeWidth={2.4} />
        <polyline points={line(ss)} fill="none" stroke={C.orange} strokeWidth={2.4} />
        <polyline points={line(eff)} fill="none" stroke={C.rose} strokeWidth={2.6} />
        <text x={x(80)} y={y(sn(80)) - 6} style={{ fontSize: 11, fontWeight: 800, fill: C.blue }}>σn</text>
        <text x={x(45) + 4} y={y(ss(45)) - 6} style={{ fontSize: 11, fontWeight: 800, fill: C.orange }}>σs（45° 最大）</text>
        <text x={x(best) - 4} y={y(eff(best)) - 8} textAnchor="end" style={{ fontSize: 11, fontWeight: 800, fill: C.rose }}>σs − μσn（{best.toFixed(0)}° 最大）</text>
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0, 15, 30, 45, 60, 75, 90].map((a) => (
          <text key={a} x={x(a)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{a}°</text>
        ))}
        <text x={(L + W) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12 }}>面和 σ1 的夾角</text>
        <text x={16} y={(T + H - B) / 2} transform={`rotate(-90 16 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>應力（MPa）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch7：Griffith 裂隙的應力集中與翼裂隙 ───────────── */

export function GriffithFig() {
  const ratios: [number, string][] = [[1, "圓：3 倍"], [3, "3:1：7 倍"], [10, "10:1：21 倍"]];
  return (
    <Fig caption="左：一個橢圓形孔洞受遠場張應力 σr，尖端的應力 σtip = σr(1 + 2a/c)，a、c 是長、短半軸。圓形孔洞放大 3 倍、3:1 的橢圓 7 倍；接近真實微裂隙的 100:1 則放大約 200 倍。所以岩石裡本來就有的微裂隙（Griffith 裂隙）讓實際強度遠低於理論強度；裂隙一開始長大，長寬比更大、應力更集中，於是越長越快。右：即使整體受壓，傾斜的 Griffith 裂隙尖端仍有局部張應力，裂隙會轉向、平行 σ1 成長，形成翼裂隙（Mode I）；剪切型的裂隙不會沿著自己的面成長。" source="Fossen (2016) Fig. 7.20–7.25；課堂投影片 Ch7 p.21–24">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="Griffith 裂隙與翼裂隙">
        <Marks />
        {ratios.map(([k, lab], i) => {
          const ox = 60 + i * 110, a = 30, cc = a / k;
          return (
            <g key={k}>
              <ellipse cx={ox} cy={95} rx={a} ry={Math.max(cc, 2)} fill={INK} fillOpacity={0.6} />
              <circle cx={ox + a} cy={95} r={4 + i * 4} fill={C.rose} fillOpacity={0.5} />
              <text x={ox} y={150} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{lab}</text>
            </g>
          );
        })}
        <line x1={170} y1={40} x2={170} y2={20} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#sm-t)" />
        <line x1={170} y1={160} x2={170} y2={180} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#sm-t)" />
        <text x={180} y={28} style={{ fontSize: 11, fontWeight: 800, fill: C.teal }}>σr（遠場張應力）</text>
        <text x={170} y={196} textAnchor="middle" style={{ fontSize: 11 }}>紅點大小 ≈ 尖端應力集中</text>
        {/* 翼裂隙 */}
        <rect x={420} y={20} width={200} height={160} fill={C.navy} fillOpacity={0.12} />
        <line x1={490} y1={130} x2={550} y2={70} stroke={C.rose} strokeWidth={3} />
        <path d="M550,70 C556,62 558,50 558,30" fill="none" stroke={C.blue} strokeWidth={2.6} />
        <path d="M490,130 C484,138 482,150 482,170" fill="none" stroke={C.blue} strokeWidth={2.6} />
        <line x1={520} y1={4} x2={520} y2={18} stroke={C.orange} strokeWidth={3} markerEnd="url(#sm-o)" />
        <line x1={520} y1={198} x2={520} y2={184} stroke={C.orange} strokeWidth={3} markerEnd="url(#sm-o)" />
        <text x={530} y={14} style={{ fontSize: 11, fontWeight: 800, fill: C.orange }}>σ1</text>
        <text x={562} y={42} style={{ fontSize: 11, fontWeight: 800, fill: C.blue }}>翼裂隙</text>
        <text x={540} y={110} style={{ fontSize: 11, fontWeight: 800, fill: C.rose }}>剪裂</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch7：變形帶的運動學分類 ───────────── */

export function DeformationBandsFig() {
  const band = (ox: number, title: string, sub: string, kind: "dil" | "shear" | "comp") => (
    <g transform={`translate(${ox},14)`}>
      <rect x={0} y={0} width={170} height={120} fill={C.gold} fillOpacity={0.12} stroke={INK} strokeOpacity={0.3} />
      {Array.from({ length: 40 }, (_, i) => {
        const x = 10 + (i % 8) * 20 + (Math.floor(i / 8) % 2) * 10, y = 12 + Math.floor(i / 8) * 24;
        const inBand = Math.abs(x - 85) < 18;
        const rr = inBand ? (kind === "comp" ? 4 : kind === "dil" ? 7 : 5) : 7;
        return <circle key={i} cx={kind === "shear" && inBand ? x + (y - 60) * 0.1 : x} cy={y} r={rr} fill={inBand ? C.orange : C.gold} fillOpacity={inBand ? 0.6 : 0.5} />;
      })}
      <line x1={67} x2={67} y1={0} y2={120} stroke={INK} strokeDasharray="3 3" />
      <line x1={103} x2={103} y1={0} y2={120} stroke={INK} strokeDasharray="3 3" />
      {kind === "shear" && (
        <g>
          <line x1={40} y1={4} x2={40} y2={-8} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
          <line x1={130} y1={-8} x2={130} y2={4} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        </g>
      )}
      {kind !== "shear" && (
        <g>
          <line x1={kind === "dil" ? 60 : 40} y1={60} x2={kind === "dil" ? 40 : 60} y2={60} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
          <line x1={kind === "dil" ? 110 : 130} y1={60} x2={kind === "dil" ? 130 : 110} y2={60} stroke={INK} strokeWidth={2} markerEnd="url(#sm-k)" />
        </g>
      )}
      <text x={85} y={140} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{title}</text>
      <text x={85} y={157} textAnchor="middle" style={{ fontSize: 10.5 }}>{sub}</text>
    </g>
  );
  return (
    <Fig caption="變形帶只出現在高孔隙的顆粒介質（例如孔隙砂岩），依運動學分成三種：膨裂帶（帶內體積增加、孔隙變大）、剪力帶（以剪切為主）、壓密帶（帶內被壓實、孔隙變小）。和同樣位移的剪裂相比，變形帶比較寬、位移很小（mm–cm），通常以群集或帶狀出現；因為顆粒破碎、壓實或膠結，常會降低孔隙率和滲透率，在野外常形成突起的稜線。" source="Fossen (2016) Fig. 7.33；課堂投影片 Ch7 p.32–33">
      <svg viewBox="0 0 640 190" className="ix-svg" role="img" aria-label="變形帶分類">
        <Marks />
        {band(30, "膨裂帶", "體積增加", "dil")}
        {band(235, "剪力帶", "剪切為主", "shear")}
        {band(440, "壓密帶", "體積減少", "comp")}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch8：節理需要的應力條件 ───────────── */

export function JointMohrFig() {
  const W = 560, H = 230, L = 30, R = 14, Y0 = 205;
  const T = 5, mu = 0.6;
  const lo = -8, hi = 34;
  const sc = (W - L - R) / (hi - lo);
  const X = (v: number) => L + (v - lo) * sc;
  const Y = (v: number) => Y0 - v * sc;
  const env = (sn: number) => (sn < 0 ? Math.sqrt(Math.max(0, 4 * T * (sn + T))) : 2 * T + mu * sn);
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const sn = -T + (i / 200) * (hi + T);
    pts.push(`${X(sn)},${Y(env(sn))}`);
  }
  const circ = (c: number, r: number, col: string) => <path d={`M${X(c - r)},${Y0} A${r * sc},${r * sc} 0 0,1 ${X(c + r)},${Y0}`} fill={col} fillOpacity={0.15} stroke={col} strokeWidth={2.4} />;
  return (
    <Fig caption="為什麼節理需要「有效張應力」加上「小的差應力」？藍綠圓：差應力小（直徑 < 4T），σ3 的有效值到達 −T 時，圓先碰到包絡線最左端的張力點，形成垂直 σ3 的張裂（節理）。橘圓：差應力大，圓還沒到 −T 就先碰到包絡線的剪力段，形成的是混合型或剪裂，而不是節理。" source="Fossen (2016) Fig. 8.6；課堂投影片 Ch8 p.6、Ch7 p.17">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="節理的 Mohr 條件">
        <line x1={L} x2={W - R} y1={Y0} y2={Y0} stroke={INK} strokeWidth={1.4} />
        <line x1={X(0)} x2={X(0)} y1={10} y2={Y0} stroke={INK} strokeWidth={1.4} />
        <polyline points={pts.join(" ")} fill="none" stroke={C.rose} strokeWidth={2.4} />
        {circ(-T + 4, 4, C.teal)}
        {circ(12, 14.75, C.orange)}
        <circle cx={X(-T)} cy={Y0} r={5} fill={C.teal} stroke={INK} />
        <text x={X(-T)} y={Y0 + 16} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: C.teal }}>−T：節理</text>
        <text x={X(24)} y={Y(24) - 10} style={{ fontSize: 11, fontWeight: 800, fill: C.orange }}>差應力大：碰到剪力段</text>
        <text x={W - R} y={Y0 - 6} textAnchor="end" style={{ fontSize: 11 }}>σn′</text>
        <text x={X(0) + 4} y={20} style={{ fontSize: 11 }}>σs</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch8：節理的四種成因 ───────────── */

export function JointOriginsFig() {
  const panel = (ox: number, title: string, sub: string, inner: ReactNode) => (
    <g transform={`translate(${ox},10)`}>
      <rect x={0} y={0} width={140} height={130} fill={C.navy} fillOpacity={0.1} stroke={INK} strokeOpacity={0.3} />
      {inner}
      <text x={70} y={150} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{title}</text>
      <text x={70} y={167} textAnchor="middle" style={{ fontSize: 10.5 }}>{sub}</text>
    </g>
  );
  return (
    <Fig caption="地殼裡哪裡會有足夠的張應力形成節理？真正的張應力只存在於地表下幾百公尺內，更深的地方要靠孔隙壓把有效應力變成張應力。埋藏：被頁岩包住的砂岩產生超壓，水力破裂（p_f > σ3 + T），還會形成砂岩脈。構造：褶皺外弧伸張產生平行軸的節理；縮短時的超壓產生垂直褶皺軸的橫褶皺節理；斷層旁的羽狀節理。卸載：上覆岩層被侵蝕，接近自由面時 σ3 垂直地表，形成平行地形的頁狀（剝離）節理，例如優勝美地的半圓頂。冷卻：熔岩冷卻收縮形成柱狀節理；岩層抬升冷卻也會讓硬層進入張應力。" source="Fossen (2016) §8.3；課堂投影片 Ch8 p.7–14">
      <svg viewBox="0 0 640 185" className="ix-svg" role="img" aria-label="節理的四種成因">
        <Marks />
        {panel(15, "埋藏（超壓）", "水力破裂", (
          <g>
            <rect x={0} y={40} width={140} height={50} fill={C.gold} fillOpacity={0.35} />
            <rect x={0} y={0} width={140} height={40} fill={C.teal} fillOpacity={0.15} />
            <rect x={0} y={90} width={140} height={40} fill={C.teal} fillOpacity={0.15} />
            {[30, 70, 110].map((x) => <line key={x} x1={x} x2={x} y1={42} y2={88} stroke={C.rose} strokeWidth={2} />)}
            <text x={70} y={25} textAnchor="middle" style={{ fontSize: 10 }}>頁岩（不透水）</text>
            <text x={70} y={120} textAnchor="middle" style={{ fontSize: 10 }}>p_f 升高</text>
          </g>
        ))}
        {panel(172, "構造（褶皺）", "外弧伸張", (
          <g>
            <path d="M5,110 Q70,10 135,110" fill="none" stroke={INK} strokeWidth={2} />
            <path d="M15,125 Q70,40 125,125" fill="none" stroke={INK} strokeWidth={2} />
            {[40, 70, 100].map((x, i) => {
              const yTop = 110 - 100 * (1 - Math.pow((x - 70) / 65, 2)) * 0.95;
              return <line key={x} x1={x} x2={x + (x - 70) * 0.15} y1={yTop + 2} y2={yTop + 22} stroke={C.rose} strokeWidth={2} />;
            })}
          </g>
        ))}
        {panel(329, "卸載（侵蝕）", "頁狀節理平行地表", (
          <g>
            <path d="M0,110 Q70,10 140,110" fill={C.gold} fillOpacity={0.25} stroke={INK} strokeWidth={2} />
            <path d="M15,110 Q70,30 125,110" fill="none" stroke={C.rose} strokeWidth={2} />
            <path d="M30,110 Q70,50 110,110" fill="none" stroke={C.rose} strokeWidth={2} />
            <line x1={70} y1={6} x2={70} y2={-6} stroke={C.teal} strokeWidth={2} markerEnd="url(#sm-t)" />
            <text x={78} y={8} style={{ fontSize: 10, fill: C.teal, fontWeight: 800 }}>σ3 ⊥ 地表</text>
          </g>
        ))}
        {panel(486, "冷卻", "柱狀節理", (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <polygon key={i} points={`${14 + i * 26},20 ${36 + i * 26},20 ${36 + i * 26},120 ${14 + i * 26},120`} fill={C.blue} fillOpacity={0.2} stroke={INK} strokeWidth={1.5} />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <polygon key={`t${i}`} points={`${25 + i * 26 - 10},14 ${25 + i * 26},8 ${25 + i * 26 + 10},14 ${25 + i * 26 + 10},20 ${25 + i * 26 - 10},20`} fill={C.blue} fillOpacity={0.35} stroke={INK} strokeWidth={1} />
            ))}
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch8：節理面的羽狀構造 ───────────── */

export function PlumoseFig() {
  const barbs: ReactElement[] = [];
  for (let i = -6; i <= 6; i++) {
    if (i === 0) continue;
    const x0 = 320 + i * 38;
    barbs.push(<path key={i} d={`M${x0},100 Q${x0 + (i > 0 ? 14 : -14)},${100 - 30} ${x0 + (i > 0 ? 22 : -22)},40`} fill="none" stroke={INK} strokeOpacity={0.6} strokeWidth={1.2} />);
    barbs.push(<path key={`b${i}`} d={`M${x0},100 Q${x0 + (i > 0 ? 14 : -14)},${100 + 30} ${x0 + (i > 0 ? 22 : -22)},160`} fill="none" stroke={INK} strokeOpacity={0.6} strokeWidth={1.2} />);
  }
  return (
    <Fig caption="節理面上的紋路記錄了破裂怎麼長大。羽狀構造（plumose structure）：從起裂點（常是一個瑕疵、化石或結核）沿著羽軸往外，細紋像羽毛一樣向兩側散開，羽毛張開的方向就是破裂傳播的方向。停止線（arrest lines）：破裂暫停時留下的弧形線，像貝殼的生長紋。扭梳紋（twist hackles）：靠近岩層邊緣時 σ3 的方向扭轉，破裂面分成一排雁行的小面。" source="Fossen (2016) Fig. 8.15–8.17；課堂投影片 Ch8 p.18–20（Weinberger & Bahat）">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="羽狀構造">
        <Marks />
        <rect x={60} y={20} width={520} height={160} fill={C.gold} fillOpacity={0.15} stroke={INK} strokeOpacity={0.4} />
        <line x1={70} x2={570} y1={100} y2={100} stroke={C.orange} strokeWidth={2.4} />
        {barbs}
        <circle cx={320} cy={100} r={7} fill={C.rose} stroke={INK} />
        <text x={320} y={124} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: C.rose }}>起裂點</text>
        <path d="M470,30 Q520,100 470,170" fill="none" stroke={C.teal} strokeWidth={2} />
        <path d="M170,30 Q120,100 170,170" fill="none" stroke={C.teal} strokeWidth={2} />
        <text x={480} y={190} style={{ fontSize: 11, fontWeight: 800, fill: C.teal }}>停止線</text>
        <line x1={380} y1={100} x2={440} y2={100} stroke={C.orange} strokeWidth={2.5} markerEnd="url(#sm-o)" />
        <text x={400} y={94} style={{ fontSize: 11, fontWeight: 800, fill: C.orange }}>羽軸：傳播方向</text>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line key={i} x1={80 + i * 55} y1={22} x2={96 + i * 55} y2={34} stroke={C.violet} strokeWidth={2.2} />
        ))}
        <text x={60} y={14} style={{ fontSize: 11, fontWeight: 800, fill: C.violet }}>層的邊緣：扭梳紋</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch8：節理的交會與尖端交互作用 ───────────── */

export function JointInteractionFig() {
  return (
    <Fig caption="怎麼判斷節理的先後？(a) T 型交會：新的節理碰到舊的就停住，而且接近時會彎過去、以 90° 碰上舊節理，因為舊節理是自由面，附近的 σ3 方向垂直它。所以「停住、彎曲」的是年輕的。(b) X 型交會：兩組互相切過，σ1 和 σ3 大小接近時常見，先後較難判斷。(c) 平行節理的尖端靠得夠近時會互相影響，年輕節理的尖端彎向舊的，形成鉤狀；兩條同時成長則形成雙鉤狀。" source="Fossen (2016) Fig. 8.18–8.20；課堂投影片 Ch8 p.21–22">
      <svg viewBox="0 0 640 190" className="ix-svg" role="img" aria-label="節理交會">
        <g transform="translate(20,10)">
          <rect x={0} y={0} width={180} height={140} fill={C.navy} fillOpacity={0.1} />
          <line x1={20} y1={70} x2={160} y2={70} stroke={INK} strokeWidth={3} />
          <path d="M60,130 L60,100 Q60,80 75,70" fill="none" stroke={C.rose} strokeWidth={2.4} />
          <path d="M120,130 L120,96 Q120,78 108,70" fill="none" stroke={C.rose} strokeWidth={2.4} />
          <text x={90} y={60} textAnchor="middle" style={{ fontSize: 10.5 }}>舊節理</text>
          <text x={90} y={162} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>(a) T 型：新的停住、彎過去</text>
        </g>
        <g transform="translate(230,10)">
          <rect x={0} y={0} width={180} height={140} fill={C.navy} fillOpacity={0.1} />
          <line x1={20} y1={70} x2={160} y2={70} stroke={INK} strokeWidth={3} />
          <line x1={90} y1={10} x2={90} y2={130} stroke={C.rose} strokeWidth={2.4} />
          <text x={90} y={162} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>(b) X 型：互相切過</text>
        </g>
        <g transform="translate(440,10)">
          <rect x={0} y={0} width={180} height={140} fill={C.navy} fillOpacity={0.1} />
          <path d="M10,50 L100,50 Q120,50 125,70" fill="none" stroke={INK} strokeWidth={3} />
          <path d="M170,90 L80,90 Q60,90 55,70" fill="none" stroke={C.rose} strokeWidth={2.4} />
          <text x={90} y={162} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>(c) 尖端交互作用：鉤狀</text>
        </g>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch8：同向脈與反向脈 ───────────── */

export function VeinTypesFig() {
  const fibers = (ox: number, anti: boolean, oblique = 0) => (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const y = 22 + i * 9;
        return anti ? (
          <g key={i}>
            <line x1={ox + 60} y1={y} x2={ox + 20 - oblique} y2={y + oblique * 0.4} stroke={C.gold} strokeWidth={2} />
            <line x1={ox + 60} y1={y} x2={ox + 100 + oblique} y2={y - oblique * 0.4} stroke={C.gold} strokeWidth={2} />
          </g>
        ) : (
          <g key={i}>
            <line x1={ox + 20} y1={y} x2={ox + 58} y2={y} stroke={C.blue} strokeWidth={2} />
            <line x1={ox + 100} y1={y} x2={ox + 62} y2={y} stroke={C.blue} strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
  return (
    <Fig caption="脈是被礦物填起來的張裂，礦物從流經裂縫的流體沉澱。左：同向脈（syntaxial）。拉長的晶體從脈壁往中間長，最老的部分靠近脈壁，礦物和圍岩相同（例如砂岩中的石英脈）；常由反覆破裂、封填（crack–seal）形成，中間有不連續的生長線。右：反向脈（antiaxial）。真正的纖維狀礦物，和圍岩成分不同（例如石灰岩旁的石膏、頁岩中的方解石纖維），從中間的中線往兩側脈壁長，所以中線保留下來；常從變質作用開始一直長到綠色片岩相中期（~350 °C）。纖維的長軸記錄了最大伸張方向：斜的纖維代表斜向張開。" source="Fossen (2016) Fig. 8.25–8.28；課堂投影片 Ch8 p.25–28">
      <svg viewBox="0 0 640 175" className="ix-svg" role="img" aria-label="同向脈與反向脈">
        <rect x={60} y={14} width={20} height={120} fill={C.navy} fillOpacity={0.3} />
        <rect x={160} y={14} width={20} height={120} fill={C.navy} fillOpacity={0.3} />
        {fibers(60, false)}
        <line x1={120} x2={120} y1={14} y2={134} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
        <text x={120} y={156} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>同向脈：從壁往中間長</text>
        <rect x={290} y={14} width={20} height={120} fill={C.navy} fillOpacity={0.3} />
        <rect x={390} y={14} width={20} height={120} fill={C.navy} fillOpacity={0.3} />
        {fibers(290, true)}
        <line x1={350} x2={350} y1={14} y2={134} stroke={C.rose} strokeWidth={2} />
        <text x={350} y={156} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>反向脈：從中線往壁長</text>
        <rect x={500} y={14} width={20} height={120} fill={C.navy} fillOpacity={0.3} />
        <rect x={600} y={14} width={20} height={120} fill={C.navy} fillOpacity={0.3} />
        {fibers(500, true, 18)}
        <line x1={560} x2={560} y1={14} y2={134} stroke={C.rose} strokeWidth={2} />
        <text x={560} y={156} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>斜纖維：斜向張開</text>
      </svg>
    </Fig>
  );
}
