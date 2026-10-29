"use client";

import { Fig } from "./Figs";

// 地球構造各章的自繪圖
const INK = "currentColor";
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
