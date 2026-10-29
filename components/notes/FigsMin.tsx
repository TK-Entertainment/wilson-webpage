"use client";

import type { ReactElement } from "react";
import { Fig } from "./Figs";

// 礦物學各講的自繪圖
const INK = "currentColor";
const rad = (d: number) => (d * Math.PI) / 180;
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", violet: "#8a6fd1", blue: "#5b8bd9", green: "#4f9d5d" };

function Marks() {
  return (
    <defs>
      {[
        ["mm-k", "currentColor"],
        ["mm-o", C.orange],
        ["mm-t", C.teal],
        ["mm-r", C.rose],
        ["mm-b", C.blue],
      ].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

/* ───────────── L03：礦物學史 ───────────── */

export function HistoryFig() {
  const ev: [number, string, string, string][] = [
    [1556, "Agricola", "《論金屬》：礦業名著，被稱為礦物學之父", C.gold],
    [1669, "Steno", "量石英晶體 → 面角守恆定律", C.orange],
    [1784, "Haüy", "晶體由相同的小單位堆成 → 晶胞", C.rose],
    [1809, "Wollaston", "反射式測角器，精準量面角", C.violet],
    [1828, "Nicol", "尼科爾稜鏡：做出偏振光", C.blue],
    [1850, "Sorby", "偏光顯微鏡看岩石薄片", C.teal],
    [1912, "X 光繞射", "證明晶體內原子規則排列（課堂寫 1920）", C.green],
  ];
  const x = (y: number) => 30 + ((y - 1540) / (1930 - 1540)) * 580;
  return (
    <Fig caption="礦物學的幾個里程碑：從「描述外形」（Agricola）→「外形有規律」（Steno 面角守恆）→「規律來自內部的重複單位」（Haüy 晶胞）→ 量得更準（測角器）→ 用光看內部（偏光、薄片）→ 直接證明原子規則排列（X 光繞射）。每一步都在回答「晶體的外形為什麼這麼規則」。" source="課堂投影片 L03 p.26–32；Klein & Dutrow (2007)">
      <svg viewBox="0 0 640 260" className="ix-svg" role="img" aria-label="礦物學史年表">
        <line x1={20} x2={620} y1={130} y2={130} stroke={INK} strokeWidth={2} />
        {[1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900].map((y) => (
          <g key={y}>
            <line x1={x(y)} x2={x(y)} y1={126} y2={134} stroke={INK} />
            <text x={x(y)} y={147} textAnchor="middle" style={{ fontSize: 10 }} opacity={0.6}>{y}</text>
          </g>
        ))}
        {ev.map(([y, n, d, c], i) => {
          const up = i % 2 === 0;
          const k = Math.floor(i / 2);
          const bx = up ? 6 + k * 159 : 85 + k * 159;
          const by = up ? 8 : 178;
          const cx = x(y);
          return (
            <g key={n}>
              <line x1={bx + 75} y1={up ? by + 72 : by} x2={cx} y2={up ? 124 : 136} stroke={c} strokeWidth={1.5} />
              <circle cx={cx} cy={130} r={6} fill={c} />
              <rect x={bx} y={by} width={150} height={72} rx={6} fill={c} fillOpacity={0.14} stroke={c} />
              <text x={bx + 8} y={by + 18} style={{ fontSize: 12.5, fontWeight: 800 }}>{y}　{n}</text>
              <foreignObject x={bx + 6} y={by + 24} width={140} height={46}>
                <div style={{ fontSize: 11, lineHeight: 1.35, color: "currentColor" }}>{d}</div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </Fig>
  );
}

/* Steno：面角守恆 */
export function StenoFig() {
  // 120° 內角的六邊形：邊長須滿足 a1−a4 = a3−a6 = a5−a2
  const hexa = (ox: number, oy: number, a: number[]) => {
    let px = ox, py = oy;
    const pts: [number, number][] = [[px, py]];
    a.forEach((len, i) => {
      px += len * Math.cos(rad(i * 60));
      py -= len * Math.sin(rad(i * 60));
      pts.push([px, py]);
    });
    return pts;
  };
  const A = hexa(70, 170, [60, 60, 60, 60, 60, 60]);
  const B = hexa(330, 175, [110, 40, 80, 80, 70, 50]);
  const poly = (p: [number, number][]) => p.map(([u, v]) => `${u},${v}`).join(" ");
  const lab = (p: [number, number][], k: string) => {
    const q = p.slice(0, 6);
    const gx = q.reduce((a, v) => a + v[0], 0) / 6, gy = q.reduce((a, v) => a + v[1], 0) / 6;
    return q.map(([vx, vy], i) => {
      const dx = gx - vx, dy = gy - vy, L = Math.hypot(dx, dy);
      return <text key={`${k}${i}`} x={vx + (dx / L) * 22} y={vy + (dy / L) * 22 + 4} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: "var(--orange)" }}>120°</text>;
    });
  };
  return (
    <Fig caption="面角守恆（Steno 1669）：同一種礦物的晶體，即使長歪了（某些面特別大、某些面特別小），對應晶面之間的夾角仍然相同。圖是兩個石英柱的橫切面：左邊是理想的正六邊形，右邊各邊長短不一，但每個內角都是 120°（晶面法線夾 60°）。這說明決定外形的是內部原子排列，不是生長時的環境。" source="課堂投影片 L03 p.27–28">
      <svg viewBox="0 0 560 210" className="ix-svg" role="img" aria-label="面角守恆">
        <polygon points={poly(A)} fill={C.teal} fillOpacity={0.15} stroke={INK} strokeWidth={2} />
        <polygon points={poly(B)} fill={C.teal} fillOpacity={0.15} stroke={INK} strokeWidth={2} />
        {lab(A, "a")}
        {lab(B, "b")}
        <text x={100} y={200} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 700 }}>理想晶形</text>
        <text x={400} y={200} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 700 }}>歪晶（各面大小不同）</text>
        <text x={250} y={20} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800, fill: C.orange }}>每個角都是 120°</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L02：薄片製作 ───────────── */

export function ThinSectionFig() {
  const steps: [string, string][] = [
    ["① 切割", "切割機把標本切成可以貼在載玻片上的小塊"],
    ["② 磨平", "用金剛砂把要貼的那一面磨平、拋光"],
    ["③ 黏貼", "AB 膠把磨平的面黏在載玻片上"],
    ["④ 細切、磨薄", "切掉多餘部分，再用金剛砂磨到 0.03 mm"],
  ];
  return (
    <Fig caption="岩石薄片的製作流程。最後的厚度 0.03 mm（30 μm）是標準：在這個厚度下大部分礦物變得透光，石英的干涉色是一階灰白；如果石英出現黃色，表示磨得太厚（見 L08 干涉色）。" source="課堂投影片 L02 p.1–5">
      <svg viewBox="0 0 640 210" className="ix-svg" role="img" aria-label="薄片製作流程">
        <Marks />
        {steps.map(([t, d], i) => {
          const x = 10 + i * 158;
          return (
            <g key={t}>
              <rect x={x} y={8} width={145} height={194} rx={6} fill={C.teal} fillOpacity={0.07} stroke={INK} strokeOpacity={0.25} />
              <text x={x + 72} y={28} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{t}</text>
              {i === 0 && (
                <g>
                  <path d={`M${x + 30},90 l40,-20 l50,10 l-10,40 l-60,10 z`} fill="#9a8f80" stroke={INK} />
                  <line x1={x + 82} x2={x + 74} y1={52} y2={140} stroke={C.rose} strokeWidth={2.5} strokeDasharray="5 3" />
                  <circle cx={x + 84} cy={46} r={14} fill="none" stroke={INK} strokeWidth={1.5} />
                </g>
              )}
              {i === 1 && (
                <g>
                  <rect x={x + 35} y={70} width={75} height={40} fill="#9a8f80" stroke={INK} />
                  <rect x={x + 20} y={110} width={105} height={10} fill={C.gold} fillOpacity={0.5} stroke={INK} />
                  <text x={x + 72} y={136} textAnchor="middle" style={{ fontSize: 10.5 }}>金剛砂＋玻璃板</text>
                  <path d={`M${x + 40},62 h65`} stroke={C.orange} strokeWidth={2} markerStart="url(#mm-o)" markerEnd="url(#mm-o)" />
                </g>
              )}
              {i === 2 && (
                <g>
                  <rect x={x + 15} y={92} width={115} height={10} fill={C.blue} fillOpacity={0.25} stroke={INK} />
                  <rect x={x + 45} y={52} width={55} height={36} fill="#9a8f80" stroke={INK} />
                  <rect x={x + 45} y={88} width={55} height={4} fill={C.orange} />
                  <text x={x + 72} y={120} textAnchor="middle" style={{ fontSize: 10.5 }}>載玻片</text>
                  <text x={x + 110} y={84} style={{ fontSize: 10 }} fill={C.orange}>AB 膠</text>
                </g>
              )}
              {i === 3 && (
                <g>
                  <rect x={x + 15} y={92} width={115} height={10} fill={C.blue} fillOpacity={0.25} stroke={INK} />
                  <rect x={x + 45} y={89} width={55} height={3} fill="#9a8f80" stroke={INK} strokeWidth={0.5} />
                  <rect x={x + 45} y={52} width={55} height={30} fill="#9a8f80" fillOpacity={0.25} stroke={INK} strokeDasharray="3 3" />
                  <text x={x + 72} y={70} textAnchor="middle" style={{ fontSize: 10 }}>切掉、磨掉</text>
                  <text x={x + 72} y={120} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }} fill={C.rose}>0.03 mm</text>
                </g>
              )}
              <foreignObject x={x + 8} y={140} width={130} height={60}>
                <div style={{ fontSize: 11, lineHeight: 1.4, color: "currentColor" }}>{d}</div>
              </foreignObject>
              {i < 3 && <line x1={x + 146} x2={x + 157} y1={100} y2={100} stroke={INK} strokeWidth={2} markerEnd="url(#mm-k)" />}
            </g>
          );
        })}
      </svg>
    </Fig>
  );
}

/* ───────────── L04：晶體場與顏色 ───────────── */

const SPEC = ["#7a3fd1", "#3f5fe0", "#2aa7d8", "#2fb35a", "#c9d22a", "#f2b632", "#f07a2a", "#d8302a"];
function Spectrum({ x, y, w, band, label, see, seeColor, id }: { x: number; y: number; w: number; band: [number, number]; label: string; see: string; seeColor: string; id: string }) {
  const lx = (l: number) => x + ((l - 400) / 300) * w;
  return (
    <g>
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" x2="1">
          {SPEC.map((c, i) => <stop key={i} offset={i / (SPEC.length - 1)} stopColor={c} />)}
        </linearGradient>
      </defs>
      <text x={x} y={y - 6} style={{ fontSize: 12, fontWeight: 800 }}>{label}</text>
      <rect x={x} y={y} width={w} height={18} fill={`url(#sp-${id})`} />
      <rect x={lx(band[0])} y={y} width={lx(band[1]) - lx(band[0])} height={18} fill="#000" fillOpacity={0.75} />
      <text x={(lx(band[0]) + lx(band[1])) / 2} y={y + 13} textAnchor="middle" style={{ fontSize: 10, fill: "#fff", fontWeight: 700 }}>吸收</text>
      <rect x={x + w + 10} y={y} width={18} height={18} rx={3} fill={seeColor} stroke={INK} />
      <text x={x + w + 34} y={y + 13} style={{ fontSize: 11.5 }}>{see}</text>
    </g>
  );
}

export function CrystalFieldFig() {
  const lv = (x: number, y: number, n: number, c = INK) =>
    Array.from({ length: n }, (_, i) => <line key={i} x1={x + i * 16} x2={x + i * 16 + 12} y1={y} y2={y} stroke={c} strokeWidth={2.5} />);
  return (
    <Fig caption="晶體場轉變。左：過渡金屬（如 Fe²⁺、Cr³⁺）的五個 3d 軌道，在氣態時能量相同；放進對稱的球形電子雲中一起被抬高；放進礦物的八面體位置時，指向陰離子的兩個軌道（eg）被推得更高，另外三個（t2g）較低，能量差 Δ 剛好落在可見光範圍。吸收這一段光，看到的就是剩下的顏色（補色）。右：同樣是 Cr³⁺，在剛玉中晶體場較強（Δ 大），吸收黃綠光 → 紅寶石；在綠柱石中較弱（Δ 小），吸收偏紅黃的光 → 祖母綠。" source="課堂投影片 L04 p.39–41；Klein & Dutrow (2007)">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="晶體場分裂">
        <Marks />
        <line x1={20} x2={20} y1={200} y2={30} stroke={INK} strokeWidth={1.2} markerEnd="url(#mm-k)" />
        <text x={26} y={34} style={{ fontSize: 11 }}>能量</text>
        <g>{lv(36, 170, 5)}</g>
        <text x={72} y={195} textAnchor="middle" style={{ fontSize: 11 }}>氣態離子</text>
        <g>{lv(126, 130, 5)}</g>
        <text x={162} y={195} textAnchor="middle" style={{ fontSize: 11 }}>球形電子雲</text>
        <g>{lv(232, 78, 2, C.rose)}</g>
        <g>{lv(224, 150, 3, C.blue)}</g>
        <text x={270} y={82} style={{ fontSize: 11.5 }} fill={C.rose}>e<tspan dy={3} style={{ fontSize: 8.5 }}>g</tspan></text>
        <text x={276} y={154} style={{ fontSize: 11.5 }} fill={C.blue}>t<tspan dy={3} style={{ fontSize: 8.5 }}>2g</tspan></text>
        <line x1={300} x2={300} y1={146} y2={84} stroke={C.orange} strokeWidth={2} markerStart="url(#mm-o)" markerEnd="url(#mm-o)" />
        <text x={306} y={119} style={{ fontSize: 13, fontWeight: 800 }} fill={C.orange}>Δ</text>
        <text x={256} y={195} textAnchor="middle" style={{ fontSize: 11 }}>八面體晶體場</text>
        <line x1={92} x2={124} y1={162} y2={136} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
        <line x1={202} x2={222} y1={130} y2={86} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
        <line x1={202} x2={222} y1={130} y2={146} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.5} />
        <Spectrum x={350} y={70} w={180} band={[520, 600]} id="ruby" label="紅寶石（Cr³⁺ 在剛玉）Δ 大" see="紅" seeColor="#c8243a" />
        <Spectrum x={350} y={150} w={180} band={[570, 660]} id="emer" label="祖母綠（Cr³⁺ 在綠柱石）Δ 小" see="綠" seeColor="#2f9e5b" />
        <text x={350} y={212} style={{ fontSize: 10.5 }} opacity={0.75}>400 nm　　　　　波長　　　　　700 nm</text>
      </svg>
    </Fig>
  );
}

export function ColorCausesFig() {
  const panel = (x: number, t: string, sub: string, body: ReactElement) => (
    <g>
      <rect x={x} y={8} width={148} height={224} rx={6} fill={C.teal} fillOpacity={0.06} stroke={INK} strokeOpacity={0.25} />
      <text x={x + 74} y={28} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{t}</text>
      {body}
      <foreignObject x={x + 6} y={160} width={136} height={70}>
        <div style={{ fontSize: 10.5, lineHeight: 1.35, color: "currentColor" }}>{sub}</div>
      </foreignObject>
    </g>
  );
  const oct = (cx: number, cy: number, lab: string, c: string) => (
    <g>
      <polygon points={`${cx},${cy - 28} ${cx + 26},${cy} ${cx},${cy + 28} ${cx - 26},${cy}`} fill={c} fillOpacity={0.15} stroke={c} />
      <text x={cx} y={cy + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{lab}</text>
    </g>
  );
  return (
    <Fig caption="礦物顏色的四種成因。① 晶體場：單一過渡金屬離子的 3d 軌道分裂（橄欖石的 Fe²⁺ 綠、紅寶石的 Cr³⁺ 紅）；② 電荷轉移：電子在相鄰的兩個離子之間跳動（Fe²⁺ + Fe³⁺ ⇄ Fe³⁺ + Fe²⁺），是藍閃石、藍晶石、藍寶石等藍色礦物的主因；③ 色心：晶格缺陷抓住電子或電子空洞（紫色螢石、煙水晶、藍色岩鹽）；④ 雜質：混入少量其他礦物（含綠泥石的綠石英、含赤鐵礦的紅色長石和碧玉）。" source="課堂投影片 L04 p.38–48">
      <svg viewBox="0 0 640 240" className="ix-svg" role="img" aria-label="顏色的四種成因">
        <Marks />
        {panel(8, "① 晶體場", "一個離子自己的 d 軌道吸收光。自色（olivine）或他色（ruby）都可能。", (
          <g>
            {oct(82, 90, "Cr³⁺", C.rose)}
            {[[-40, 0], [40, 0], [0, -40], [0, 40]].map(([dx, dy], i) => <circle key={i} cx={82 + dx} cy={90 + dy} r={6} fill={C.blue} fillOpacity={0.6} />)}
            <text x={82} y={146} textAnchor="middle" style={{ fontSize: 10 }}>周圍 O²⁻ 的電場</text>
          </g>
        ))}
        {panel(166, "② 電荷轉移", "價電子不再固定在一個離子上，在 A、B 兩個位置之間轉移。", (
          <g>
            {oct(210, 90, "Fe²⁺", C.green)}
            {oct(270, 90, "Fe³⁺", C.orange)}
            <path d="M216,58 Q240,36 264,58" fill="none" stroke={C.rose} strokeWidth={2} markerEnd="url(#mm-r)" />
            <text x={240} y={44} textAnchor="middle" style={{ fontSize: 10.5 }} fill={C.rose}>e⁻</text>
            <text x={240} y={140} textAnchor="middle" style={{ fontSize: 10 }}>A 位置 → B 位置</text>
          </g>
        ))}
        {panel(324, "③ 色心", "缺了一個陰離子的空位抓住電子（電子色心，紫螢石）；或 Al³⁺ 取代 Si⁴⁺ 後被輻射打出電子（洞色心，煙水晶）。", (
          <g>
            {Array.from({ length: 16 }, (_, i) => {
              const cx = 358 + (i % 4) * 26, cy = 52 + Math.floor(i / 4) * 26;
              if (i === 6) return <g key={i}><rect x={cx - 9} y={cy - 9} width={18} height={18} fill="none" stroke={C.rose} strokeDasharray="3 2" /><text x={cx} y={cy + 4} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800 }} fill={C.rose}>e⁻</text></g>;
              return <circle key={i} cx={cx} cy={cy} r={(i + Math.floor(i / 4)) % 2 ? 5 : 8} fill={(i + Math.floor(i / 4)) % 2 ? C.violet : C.teal} fillOpacity={0.55} />;
            })}
          </g>
        ))}
        {panel(482, "④ 雜質", "原本無色或白色的礦物，混入極少量其他礦物就變色。顏色不可靠的主因。", (
          <g>
            <polygon points="526,130 520,70 556,40 592,70 586,130" fill="#f2f2f2" fillOpacity={0.6} stroke={INK} />
            {[[536, 92], [560, 75], [570, 110], [548, 115], [578, 88]].map(([cx, cy], i) => <ellipse key={i} cx={cx} cy={cy} rx={5} ry={2.5} fill="#b8322a" transform={`rotate(${i * 37} ${cx} ${cy})`} />)}
            <text x={556} y={146} textAnchor="middle" style={{ fontSize: 10 }}>石英 + 赤鐵礦細片</text>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/* 螢光與磷光 */
export function FluorescenceFig() {
  return (
    <Fig caption="螢光和磷光都是電子吸收紫外光躍上激發態、再掉回基態時放出的可見光（能量比吸收的小，所以波長比較長）。差別在時間：螢光一下就結束（關掉 UV 就不亮）；磷光的電子先被「陷阱」能階卡住，慢慢才釋放，所以關掉 UV 之後還會繼續發光。有些方解石在長波和短波 UV 下顏色不同。" source="課堂投影片 L04 p.62–64">
      <svg viewBox="0 0 560 220" className="ix-svg" role="img" aria-label="螢光與磷光">
        <Marks />
        <line x1={40} x2={520} y1={190} y2={190} stroke={INK} strokeWidth={2.5} />
        <text x={524} y={194} style={{ fontSize: 11.5 }}>基態</text>
        <line x1={40} x2={520} y1={40} y2={40} stroke={INK} strokeWidth={2.5} />
        <text x={524} y={44} style={{ fontSize: 11.5 }}>激發態</text>
        <line x1={320} x2={460} y1={80} y2={80} stroke={C.violet} strokeWidth={2.5} strokeDasharray="6 3" />
        <text x={464} y={84} style={{ fontSize: 11 }} fill={C.violet}>陷阱</text>
        <line x1={90} x2={90} y1={188} y2={44} stroke={C.violet} strokeWidth={3} markerEnd="url(#mm-k)" />
        <text x={80} y={120} textAnchor="end" style={{ fontSize: 12, fontWeight: 700 }}>吸收 UV</text>
        <path d="M110,44 Q130,48 150,56" fill="none" stroke={INK} strokeDasharray="3 3" markerEnd="url(#mm-k)" />
        <line x1={170} x2={170} y1={58} y2={186} stroke={C.green} strokeWidth={3} markerEnd="url(#mm-t)" />
        <text x={180} y={120} style={{ fontSize: 12, fontWeight: 700 }} fill={C.green}>螢光（立即）</text>
        <path d="M300,44 Q310,62 330,78" fill="none" stroke={C.violet} strokeWidth={2} markerEnd="url(#mm-k)" />
        <line x1={400} x2={400} y1={84} y2={186} stroke={C.orange} strokeWidth={3} markerEnd="url(#mm-o)" />
        <text x={410} y={140} style={{ fontSize: 12, fontWeight: 700 }} fill={C.orange}>磷光（延遲）</text>
        <text x={360} y={104} textAnchor="middle" style={{ fontSize: 10.5 }} opacity={0.8}>卡住一段時間</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L04：解理 ───────────── */

export function CleavageTypesFig() {
  const items: [string, string, string, ReactElement][] = [
    ["立方體解理", "3 組，互相垂直", "方鉛礦、石鹽", (
      <g>
        <polygon points="-30,-14 10,-14 30,-30 -10,-30" fill={C.teal} fillOpacity={0.25} stroke={INK} />
        <polygon points="-30,-14 10,-14 10,26 -30,26" fill={C.teal} fillOpacity={0.12} stroke={INK} />
        <polygon points="10,-14 30,-30 30,10 10,26" fill={C.teal} fillOpacity={0.35} stroke={INK} />
      </g>
    )],
    ["八面體解理", "4 組", "螢石、尖晶石", (
      <g>
        <polygon points="0,-36 -32,0 0,36 32,0" fill={C.teal} fillOpacity={0.15} stroke={INK} />
        <polygon points="0,-36 -32,0 8,8" fill={C.teal} fillOpacity={0.3} stroke={INK} />
        <polygon points="0,-36 8,8 32,0" fill={C.teal} fillOpacity={0.4} stroke={INK} />
        <polygon points="0,36 -32,0 8,8 32,0" fill={C.teal} fillOpacity={0.12} stroke={INK} />
      </g>
    )],
    ["菱形十二面體解理", "6 組", "閃鋅礦", (
      <g>
        {Array.from({ length: 6 }, (_, i) => {
          const a = rad(90 + i * 60), b = rad(150 + i * 60);
          return <polygon key={i} points={`0,0 ${34 * Math.cos(a)},${-34 * Math.sin(a)} ${34 * Math.cos(b)},${-34 * Math.sin(b)}`} fill={C.teal} fillOpacity={0.12 + (i % 3) * 0.1} stroke={INK} />;
        })}
      </g>
    )],
    ["菱面體解理", "3 組，不互相垂直", "方解石、白雲石", (
      <g>
        <polygon points="-36,10 4,10 28,-22 -12,-22" fill={C.teal} fillOpacity={0.3} stroke={INK} />
        <polygon points="-36,10 4,10 -6,40 -46,40" fill={C.teal} fillOpacity={0.12} stroke={INK} />
        <polygon points="4,10 28,-22 18,8 -6,40" fill={C.teal} fillOpacity={0.4} stroke={INK} />
      </g>
    )],
    ["柱狀解理", "2 組，平行柱長", "輝石、角閃石", (
      <g>
        <polygon points="-14,-36 14,-36 22,-28 22,30 14,38 -14,38 -22,30 -22,-28" fill={C.teal} fillOpacity={0.15} stroke={INK} />
        {[-14, -4, 6, 16].map((d) => <line key={`l${d}`} x1={d - 4} x2={d - 4} y1={-32} y2={34} stroke={INK} strokeOpacity={0.5} />)}
      </g>
    )],
    ["底面（軸面）解理", "1 組，一片一片剝", "雲母、石墨", (
      <g>
        {[0, 1, 2, 3, 4, 5].map((i) => <polygon key={i} points={`-34,${24 - i * 9} 22,${24 - i * 9} 36,${16 - i * 9} -20,${16 - i * 9}`} fill={C.teal} fillOpacity={0.12 + i * 0.05} stroke={INK} />)}
      </g>
    )],
  ];
  return (
    <Fig caption="解理是礦物沿著原子間鍵結最弱（面間距最大）的面裂開的傾向，所以解理的方向和組數直接反映晶體結構。依組數和夾角分成六類。描述時還要加上好壞程度：極完全（雲母，薄片一撕就開）、完全（平整但有台階）、中等、不完全。" source="課堂投影片 L04 p.66–72">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="解理類型">
        {items.map(([t, n, ex, g], i) => {
          const cx = 55 + i * 106;
          return (
            <g key={t}>
              <g transform={`translate(${cx},70)`}>{g}</g>
              <text x={cx} y={135} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{t}</text>
              <text x={cx} y={154} textAnchor="middle" style={{ fontSize: 11 }}>{n}</text>
              <text x={cx} y={173} textAnchor="middle" style={{ fontSize: 11 }} fill={C.orange}>{ex}</text>
            </g>
          );
        })}
      </svg>
    </Fig>
  );
}

export function PyxAmphFig() {
  const panel = (cx: number, outline: string, half: number, title: string, ang: string, note: string, idp: string) => {
    const lines: ReactElement[] = [];
    for (let k = -8; k <= 8; k++) {
      for (const s of [1, -1]) {
        const a = rad(s * half);
        const off = k * 13;
        const nx = Math.sin(a), ny = Math.cos(a);
        lines.push(<line key={`${k}${s}`} x1={cx + off * nx - 200 * Math.cos(a)} y1={110 + off * ny + 200 * Math.sin(a)} x2={cx + off * nx + 200 * Math.cos(a)} y2={110 + off * ny - 200 * Math.sin(a)} stroke={INK} strokeOpacity={0.55} strokeWidth={1} />);
      }
    }
    return (
      <g>
        <clipPath id={idp}><polygon points={outline} /></clipPath>
        <polygon points={outline} fill={C.teal} fillOpacity={0.15} stroke={INK} strokeWidth={2} />
        <g clipPath={`url(#${idp})`}>{lines}</g>
        <text x={cx} y={22} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{title}</text>
        <text x={cx} y={202} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }} fill={C.orange}>{ang}</text>
        <text x={cx} y={220} textAnchor="middle" style={{ fontSize: 11 }}>{note}</text>
      </g>
    );
  };
  return (
    <Fig caption="輝石和角閃石都有兩組平行柱長的柱狀解理，只看縱切面分不出來；要看垂直柱長（c 軸）的橫切面。輝石的單鏈很窄，橫切面近似正方形（八邊形），兩組解理幾乎垂直（87°／93°）；角閃石是雙鏈，比較寬，橫切面是扁的菱形（六邊形），兩組解理交成 124°／56°。這在手標本和顯微鏡下都是區分兩者最快的方法。" source="課堂投影片 L04 p.71；L06 p.45–52">
      <svg viewBox="0 0 560 230" className="ix-svg" role="img" aria-label="輝石與角閃石的解理">
        {panel(140, "100,40 180,40 210,75 210,145 180,180 100,180 70,145 70,75", 46.5, "輝石（橫切面）", "87° ／ 93°", "近似正方形，解理近直交", "clip-px")}
        {panel(420, "330,110 370,62 470,62 510,110 470,158 370,158", 28, "角閃石（橫切面）", "124° ／ 56°", "扁菱形，解理斜交", "clip-am")}
      </svg>
    </Fig>
  );
}

/* ───────────── L04：磁性 ───────────── */

export function MagnetismFig() {
  const cols: [string, string][] = [["反磁性", "電子成對、磁矩抵消；外加磁場時產生微弱的反向磁性（石英、方解石）"], ["順磁性", "有不成對電子，但磁矩亂排；外加磁場時稍微順著排，移除就消失（黑雲母、石榴子石）"], ["鐵磁性", "磁矩自發整齊排列；移除磁場仍保有磁性，加熱超過居禮點（磁鐵礦 580 °C）才消失"]];
  const rows = ["無外加磁場", "外加磁場 →", "移除磁場後"];
  const arrow = (x: number, y: number, a: number, len: number, c: string, k: string) => (
    <line key={k} x1={x - (len / 2) * Math.cos(rad(a))} y1={y + (len / 2) * Math.sin(rad(a))} x2={x + (len / 2) * Math.cos(rad(a))} y2={y - (len / 2) * Math.sin(rad(a))} stroke={c} strokeWidth={1.8} markerEnd="url(#mm-k)" />
  );
  const rnd = [37, 200, 115, 290, 10, 160, 250, 75, 320];
  const cell = (ci: number, ri: number) => {
    const x0 = 130 + ci * 168, y0 = 34 + ri * 62;
    const out: ReactElement[] = [];
    for (let k = 0; k < 9; k++) {
      const x = x0 + 22 + (k % 3) * 40, y = y0 + 10 + Math.floor(k / 3) * 17;
      let a = 0, len = 14;
      if (ci === 0) { if (ri === 1) { a = 180; len = 7; } else { out.push(<circle key={k} cx={x} cy={y} r={2} fill={INK} opacity={0.5} />); continue; } }
      if (ci === 1) { a = ri === 1 ? (rnd[k] % 60) - 30 : rnd[k]; }
      if (ci === 2) { a = ri === 0 ? (k < 5 ? 0 : 180) : 0; }
      out.push(arrow(x, y, a, len, ci === 2 ? C.rose : INK, `${k}`));
    }
    return <g key={`${ci}${ri}`}><rect x={x0} y={y0} width={160} height={54} rx={4} fill={C.teal} fillOpacity={0.06} stroke={INK} strokeOpacity={0.2} />{out}</g>;
  };
  return (
    <Fig caption="三種磁性。大部分礦物是反磁性；含 Fe²⁺、Mn²⁺ 等不成對電子的是順磁性，磁感率比反磁性大上千倍但仍很弱；只有少數礦物（磁鐵礦強磁、磁黃鐵礦弱磁）是鐵磁性。鐵磁性礦物的磁矩在一個個磁區內自發排列（左下圖兩個磁區方向相反，整體仍可能不顯磁性），外加磁場後磁區轉成同一方向，移除磁場仍保留。" source="課堂投影片 L04 p.82–86">
      <svg viewBox="0 0 640 260" className="ix-svg" role="img" aria-label="三種磁性">
        <Marks />
        {cols.map(([t], ci) => <text key={t} x={210 + ci * 168} y={24} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{t}</text>)}
        {rows.map((r, ri) => <text key={r} x={120} y={66 + ri * 62} textAnchor="end" style={{ fontSize: 11.5 }}>{r}</text>)}
        {[0, 1, 2].map((ci) => [0, 1, 2].map((ri) => cell(ci, ri)))}
        <text x={320} y={250} textAnchor="middle" style={{ fontSize: 11 }} opacity={0.8}>反磁性移除磁場後、順磁性移除後都回到無磁性；鐵磁性保留（紅箭頭）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L05：矽酸鹽結構 ───────────── */

const HL = 16; // Si–Si 距離
function Tet({ x, y, A, unshared = [] as number[] }: { x: number; y: number; A: boolean; unshared?: number[] }) {
  const dirs = A ? [90, 210, 330] : [30, 150, 270];
  const pts = dirs.map((d) => [x + (HL / 2 + 1) * Math.cos(rad(d)), y - (HL / 2 + 1) * Math.sin(rad(d))]);
  return (
    <g>
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={C.teal} fillOpacity={0.35} stroke={INK} strokeWidth={1} />
      <circle cx={x} cy={y} r={1.8} fill={INK} />
      {unshared.map((i) => <circle key={i} cx={pts[i][0]} cy={pts[i][1]} r={2.2} fill={C.rose} />)}
    </g>
  );
}

export function SilicateFig() {
  const s3 = (Math.sqrt(3) / 2) * HL;
  const tets: ReactElement[] = [];
  const P = (k: string, x: number, y: number, A: boolean) => tets.push(<Tet key={k} x={x} y={y} A={A} />);
  // 1 島狀
  P("n1", 38, 95, true); P("n2", 66, 112, true); P("n3", 58, 72, true);
  // 2 對狀
  P("s1", 132, 96, true); P("s2", 132 + s3, 96 + HL / 2, false);
  // 3 環狀（正六邊形，邊長 HL）
  for (let k = 0; k < 6; k++) {
    const a = rad(30 + k * 60);
    P(`c${k}`, 232 + HL * Math.cos(a), 96 - HL * Math.sin(a), k % 2 === 0);
  }
  // 4 單鏈
  for (let k = 0; k < 3; k++) { P(`i${k}`, 302 + k * 2 * s3, 96, true); P(`j${k}`, 302 + (2 * k + 1) * s3, 96 + HL / 2, false); }
  // 5 雙鏈（一排六邊形）
  for (let k = 0; k < 3; k++) {
    P(`d${k}`, 420 + k * 2 * s3, 108, true); if (k < 2) P(`e${k}`, 420 + (2 * k + 1) * s3, 108 + HL / 2, false);
    P(`f${k}`, 420 + k * 2 * s3, 108 - HL, false); if (k < 2) P(`g${k}`, 420 + (2 * k + 1) * s3, 108 - 1.5 * HL, true);
  }
  // 6 層狀（蜂巢）
  for (let r = 0; r < 3; r++)
    for (let k = 0; k < 3; k++) {
      const x0 = 538 + k * 2 * s3 + (r % 2) * s3, y0 = 124 - r * 1.5 * HL;
      P(`pa${r}${k}`, x0, y0, true); P(`pb${r}${k}`, x0, y0 - HL, false);
    }
  const lab: [number, string, string, string, string][] = [
    [55, "島狀 neso", "SiO₄　1 : 4", "不共用", "橄欖石、石榴子石、鋯石、Al₂SiO₅"],
    [140, "對狀 soro", "Si₂O₇　1 : 3.5", "共用 1 個", "綠簾石"],
    [232, "環狀 cyclo", "Si₆O₁₈　1 : 3", "共用 2 個成環", "電氣石、綠柱石、堇青石"],
    [337, "單鏈 ino", "SiO₃　1 : 3", "共用 2 個成鏈", "輝石"],
    [448, "雙鏈 ino", "Si₄O₁₁　1 : 2.75", "共用 2–3 個", "角閃石"],
    [577, "層狀 phyllo", "Si₂O₅　1 : 2.5", "共用 3 個", "雲母、黏土、滑石、蛇紋石"],
  ];
  return (
    <Fig caption="矽酸鹽依 SiO₄ 四面體怎麼共用頂點的氧來分類（俯視，三角形是四面體，紅點是沒有共用的氧可以接陽離子）。共用的氧越多，四面體連得越廣，Si : O 的比值越大：島狀 1 : 4 → 層狀 1 : 2.5；四個角全部共用時延伸成三維的架狀（石英、長石，SiO₂，1 : 2），圖上沒有畫。這個順序大致也是鮑文反應系列從高溫到低溫的順序。" source="課堂投影片 L05 p.38–76；L07 p.4；Klein & Dutrow (2007)">
      <svg viewBox="0 0 640 240" className="ix-svg" role="img" aria-label="矽酸鹽結構分類">
        {tets}
        {lab.map(([x, t, f, s, ex]) => (
          <g key={t}>
            <text x={x} y={160} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{t}</text>
            <text x={x} y={177} textAnchor="middle" style={{ fontSize: 11 }}>{f}</text>
            <text x={x} y={193} textAnchor="middle" style={{ fontSize: 10.5 }} opacity={0.8}>{s}</text>
            <foreignObject x={x - 52} y={198} width={104} height={40}>
              <div style={{ fontSize: 10, lineHeight: 1.3, color: "var(--orange)", textAlign: "center" }}>{ex}</div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/* ───────────── L05：火山與寶石 ───────────── */

export function GemOriginFig() {
  return (
    <Fig caption="火山活動產生寶石的三種途徑。① 斑晶：岩漿自己冷卻結晶（日光石、月光石、黃玉、鋯石），和結晶分化有關；② 捕獲晶：岩漿上升時帶上來的圍岩或地函碎塊中原有的礦物（鑽石、尖晶石、剛玉、石榴子石、橄欖石），和同化混染有關；③ 熱液：岩漿釋出的熱水沿裂隙換質、沉澱（祖母綠、綠松石、電氣石、海藍寶）。另外黑曜岩、蛋白石、玉髓也和火山有關。" source="課堂投影片 L05 p.77–96">
      <svg viewBox="0 0 640 300" className="ix-svg" role="img" aria-label="火山與寶石的三種成因">
        <Marks />
        <rect x={0} y={250} width={640} height={50} fill={C.orange} fillOpacity={0.12} />
        <text x={14} y={290} style={{ fontSize: 11.5 }}>地函</text>
        <path d="M0,70 L250,70 L300,20 L340,20 L390,70 L640,70 L640,250 L0,250 Z" fill="#9a8f80" fillOpacity={0.18} stroke={INK} strokeOpacity={0.4} />
        <text x={14} y={90} style={{ fontSize: 11.5 }}>地殼（圍岩）</text>
        <path d="M312,20 L308,150 L332,150 L328,20 Z" fill={C.rose} fillOpacity={0.5} />
        <ellipse cx={320} cy={180} rx={110} ry={42} fill={C.rose} fillOpacity={0.45} stroke={C.rose} />
        <path d="M300,220 Q310,240 305,262" fill="none" stroke={C.rose} strokeWidth={10} strokeOpacity={0.45} />
        <text x={320} y={176} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>岩漿庫</text>
        {[[280, 190], [300, 200], [350, 192], [365, 170], [270, 168]].map(([x, y], i) => <polygon key={i} points={`${x},${y - 6} ${x + 5},${y} ${x},${y + 6} ${x - 5},${y}`} fill="#fff" stroke={INK} strokeWidth={0.8} />)}
        {[[226, 168], [418, 186], [306, 252]].map(([x, y], i) => <rect key={i} x={x - 6} y={y - 6} width={12} height={12} fill="#2f2f2f" transform={`rotate(20 ${x} ${y})`} />)}
        {[[420, 120, 470, 80], [450, 140, 520, 120], [210, 130, 160, 96]].map(([a, b, c, d], i) => <path key={i} d={`M${a},${b} L${(a + c) / 2 + 6},${(b + d) / 2} L${c},${d}`} fill="none" stroke={C.green} strokeWidth={3} />)}
        <g>
          <rect x={14} y={112} width={150} height={52} rx={6} fill={C.green} fillOpacity={0.12} stroke={C.green} />
          <text x={22} y={130} style={{ fontSize: 12, fontWeight: 800 }} fill={C.green}>③ 熱液</text>
          <text x={22} y={148} style={{ fontSize: 10.5 }}>祖母綠、綠松石</text>
          <text x={22} y={160} style={{ fontSize: 10.5 }}>電氣石、海藍寶</text>
        </g>
        <g>
          <rect x={470} y={170} width={160} height={58} rx={6} fill="#2f2f2f" fillOpacity={0.1} stroke={INK} />
          <text x={478} y={188} style={{ fontSize: 12, fontWeight: 800 }}>② 捕獲晶（黑方塊）</text>
          <text x={478} y={206} style={{ fontSize: 10.5 }}>鑽石、尖晶石、剛玉</text>
          <text x={478} y={220} style={{ fontSize: 10.5 }}>石榴子石、橄欖石</text>
        </g>
        <line x1={470} y1={190} x2={426} y2={186} stroke={INK} strokeWidth={1} markerEnd="url(#mm-k)" />
        <g>
          <rect x={440} y={88} width={170} height={52} rx={6} fill="#fff" fillOpacity={0.1} stroke={C.rose} />
          <text x={448} y={106} style={{ fontSize: 12, fontWeight: 800 }} fill={C.rose}>① 斑晶（白菱形）</text>
          <text x={448} y={124} style={{ fontSize: 10.5 }}>日光石、月光石、黃玉、鋯石</text>
        </g>
        <line x1={440} y1={122} x2={372} y2={166} stroke={C.rose} strokeWidth={1} markerEnd="url(#mm-r)" />
      </svg>
    </Fig>
  );
}

/* ───────────── L06：偏光顯微鏡 ───────────── */

export function MicroscopeFig() {
  const parts: [number, string, number][] = [
    [1, "目鏡 ocular", 30],
    [2, "上偏光鏡（檢偏器）analyzer：只讓東西向的光通過，可抽出", 66],
    [3, "附加板插槽 slot for accessory plate", 92],
    [4, "物鏡轉盤 revolving nosepiece", 122],
    [5, "物鏡 objectives", 146],
    [6, "旋轉載物台 rotating stage（有角度刻度）", 172],
    [7, "聚光鏡 condenser lens", 192],
    [8, "下偏光鏡（起偏器）polarizer：只讓南北向的光通過", 210],
    [9, "垂直調節（對焦）旋鈕", 236],
    [10, "光圈 diaphragm", 254],
    [11, "照明 illuminator", 276],
  ];
  return (
    <Fig caption="偏光顯微鏡和一般生物顯微鏡最大的差別是多了兩片偏光鏡：載物台下的「下偏光鏡」把光變成只在南北向振動的偏振光；鏡筒中的「上偏光鏡」只讓東西向的光通過。只用下偏光鏡叫開放偏光（open nicol, PPL）；兩片都放入叫正交偏光（crossed nicols, XPL）。另外載物台可以旋轉、有刻度，用來量消光角。" source="課堂投影片 L06 p.10–18">
      <svg viewBox="0 0 640 300" className="ix-svg" role="img" aria-label="偏光顯微鏡構造">
        <Marks />
        <path d="M60,286 L200,286 L200,270 L60,270 Z" fill="#888" fillOpacity={0.35} stroke={INK} />
        <path d="M170,270 L190,120 Q192,80 160,70 L150,90 Q170,100 168,120 L150,270 Z" fill="#888" fillOpacity={0.3} stroke={INK} />
        <rect x={98} y={20} width={24} height={20} fill="#666" fillOpacity={0.5} stroke={INK} />
        <rect x={92} y={40} width={36} height={80} fill="#888" fillOpacity={0.25} stroke={INK} />
        <rect x={86} y={60} width={48} height={12} fill={C.blue} fillOpacity={0.35} stroke={INK} />
        <rect x={86} y={86} width={48} height={10} fill={C.gold} fillOpacity={0.4} stroke={INK} />
        <polygon points="84,116 136,116 140,128 80,128" fill="#777" fillOpacity={0.5} stroke={INK} />
        <rect x={100} y={128} width={20} height={24} fill="#666" fillOpacity={0.5} stroke={INK} />
        <ellipse cx={110} cy={172} rx={58} ry={8} fill="#888" fillOpacity={0.35} stroke={INK} />
        <rect x={94} y={166} width={32} height={4} fill={C.teal} />
        <rect x={96} y={186} width={28} height={10} fill="#888" fillOpacity={0.3} stroke={INK} />
        <rect x={86} y={204} width={48} height={10} fill={C.blue} fillOpacity={0.35} stroke={INK} />
        <circle cx={178} cy={236} r={12} fill="#888" fillOpacity={0.35} stroke={INK} />
        <rect x={96} y={250} width={28} height={8} fill="#888" fillOpacity={0.3} stroke={INK} />
        <circle cx={110} cy={276} r={7} fill={C.gold} />
        <line x1={110} x2={110} y1={268} y2={24} stroke={C.gold} strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#mm-o)" />
        {parts.map(([n, t, yy]) => (
          <g key={n}>
            <line x1={n === 9 ? 190 : 140} x2={262} y1={yy} y2={yy} stroke={INK} strokeOpacity={0.35} />
            <circle cx={272} cy={yy} r={8} fill={C.teal} fillOpacity={0.25} stroke={C.teal} />
            <text x={272} y={yy + 3.5} textAnchor="middle" style={{ fontSize: 9.5, fontWeight: 800 }}>{n}</text>
            <text x={286} y={yy + 4} style={{ fontSize: 11 }}>{t}</text>
          </g>
        ))}
        <text x={24} y={160} textAnchor="middle" style={{ fontSize: 10.5 }} fill={C.orange} transform="rotate(-90 24 160)">光由下往上</text>
      </svg>
    </Fig>
  );
}

/* 偏振光與正交偏光 */
export function PolarizerFig() {
  const vib = (cx: number, cy: number, angs: number[], c: string) => (
    <g>
      <circle cx={cx} cy={cy} r={20} fill="none" stroke={INK} strokeOpacity={0.3} />
      {angs.map((a, i) => <line key={i} x1={cx - 17 * Math.cos(rad(a))} y1={cy + 17 * Math.sin(rad(a))} x2={cx + 17 * Math.cos(rad(a))} y2={cy - 17 * Math.sin(rad(a))} stroke={c} strokeWidth={2} markerStart="url(#mm-k)" markerEnd="url(#mm-k)" />)}
    </g>
  );
  const pol = (cx: number, cy: number, vert: boolean, lab: string) => (
    <g>
      <rect x={cx - 22} y={cy - 22} width={44} height={44} rx={4} fill="#888" fillOpacity={0.15} stroke={INK} />
      {[-12, -4, 4, 12].map((d) => (vert ? <line key={d} x1={cx + d} x2={cx + d} y1={cy - 18} y2={cy + 18} stroke={INK} strokeOpacity={0.6} /> : <line key={d} y1={cy + d} y2={cy + d} x1={cx - 18} x2={cx + 18} stroke={INK} strokeOpacity={0.6} />))}
      <text x={cx} y={cy + 36} textAnchor="middle" style={{ fontSize: 10.5 }}>{lab}</text>
    </g>
  );
  const row = (y: number, iso: boolean) => (
    <g>
      <text x={8} y={y - 30} style={{ fontSize: 12.5, fontWeight: 800 }}>{iso ? "均向性（等軸晶系、玻璃）" : "非均向性（其他晶系）"}</text>
      {vib(40, y, [0, 45, 90, 135], INK)}
      <text x={40} y={y + 36} textAnchor="middle" style={{ fontSize: 10.5 }}>未偏振光</text>
      {pol(120, y, true, "下偏光鏡（南北）")}
      {vib(200, y, [90], C.blue)}
      <rect x={250} y={y - 24} width={70} height={48} rx={6} fill={iso ? "#ddd" : C.teal} fillOpacity={0.3} stroke={INK} />
      <text x={285} y={y + 4} textAnchor="middle" style={{ fontSize: 11 }}>{iso ? "礦物" : "礦物"}</text>
      {vib(370, y, iso ? [90] : [30, 120], iso ? C.blue : C.orange)}
      <text x={370} y={y + 36} textAnchor="middle" style={{ fontSize: 10.5 }}>{iso ? "方向不變" : "分成兩道互相垂直的光"}</text>
      {pol(450, y, false, "上偏光鏡（東西）")}
      <rect x={510} y={y - 22} width={44} height={44} rx={22} fill={iso ? "#111" : "url(#pz-ic)"} stroke={INK} />
      <text x={580} y={y + 4} style={{ fontSize: 12, fontWeight: 800 }}>{iso ? "全黑" : "干涉色"}</text>
      {[70, 160, 228, 330, 412, 486].map((x) => <line key={x} x1={x - 6} x2={x + 6} y1={y} y2={y} stroke={INK} strokeWidth={1.5} markerEnd="url(#mm-k)" />)}
    </g>
  );
  return (
    <Fig caption="正交偏光下為什麼會有顏色。下偏光鏡只讓南北向振動的光通過；均向性礦物不改變振動方向，到了只收東西向光的上偏光鏡就全被擋掉，所以全黑，而且轉動載物台也一直黑（全消光）。非均向性礦物把光拆成兩道振動方向互相垂直、速度不同的光，它們都有東西向的分量，通過上偏光鏡後互相干涉，產生干涉色；當這兩個振動方向剛好和偏光鏡平行時，就變黑（消光），所以轉一圈會消光四次。" source="課堂投影片 L06 p.12–20；L08 p.7、p.24">
      <svg viewBox="0 0 640 260" className="ix-svg" role="img" aria-label="偏振光通過礦物">
        <Marks />
        <defs>
          <linearGradient id="pz-ic" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#e4c84a" />
            <stop offset="0.5" stopColor="#c05ac9" />
            <stop offset="1" stopColor="#3a8fd9" />
          </linearGradient>
        </defs>
        {row(70, true)}
        {row(196, false)}
      </svg>
    </Fig>
  );
}

/* ───────────── L06/L08：開放偏光下的特徵 ───────────── */

export function FormFig() {
  return (
    <Fig caption="晶形的發育程度。自形（euhedral）晶面完整，通常是早結晶、周圍還有空間時長成的（如火山岩中的橄欖石、輝石斑晶）；他形（anhedral）完全沒有晶面，是和其他晶體搶空間、最後才填進縫隙的（如花崗岩中的石英）；半自形介於兩者之間。所以晶形可以推結晶的先後順序。" source="課堂投影片 L04 p.6；L06 p.29–30">
      <svg viewBox="0 0 560 180" className="ix-svg" role="img" aria-label="自形、半自形、他形">
        <polygon points="70,70 100,30 150,30 180,70 150,110 100,110" fill={C.teal} fillOpacity={0.25} stroke={INK} strokeWidth={1.8} />
        <text x={125} y={150} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>自形 euhedral</text>
        <text x={125} y={168} textAnchor="middle" style={{ fontSize: 11 }}>晶面完整</text>
        <path d="M230,70 L260,30 L320,30 L345,62 Q338,95 312,112 Q280,120 258,106 Q236,95 230,70 Z" fill={C.teal} fillOpacity={0.25} stroke={INK} strokeWidth={1.8} />
        <text x={287} y={150} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>半自形 subhedral</text>
        <text x={287} y={168} textAnchor="middle" style={{ fontSize: 11 }}>部分晶面</text>
        <path d="M400,58 Q412,30 440,36 Q470,26 490,48 Q510,70 492,92 Q478,118 448,110 Q420,118 408,96 Q392,80 400,58 Z" fill={C.teal} fillOpacity={0.25} stroke={INK} strokeWidth={1.8} />
        <text x={450} y={150} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>他形 anhedral</text>
        <text x={450} y={168} textAnchor="middle" style={{ fontSize: 11 }}>沒有晶面，填空隙</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L08：正交偏光下的特徵 ───────────── */

export function TwinZoningFig() {
  const stripes: ReactElement[] = [];
  for (let i = 0; i < 12; i++) stripes.push(<rect key={i} x={40 + i * 10} y={40} width={10} height={90} fill={i % 2 ? "#3a3a3a" : "#c9c9c9"} />);
  return (
    <Fig caption="正交偏光下的兩個特徵。左：斜長石的聚片雙晶，由很多薄片狀的雙晶個體交替排列，相鄰兩片的消光位置不同，所以呈現黑白相間的條紋，轉動載物台時條紋明暗互換；正長石常見簡單的兩半雙晶（卡式雙晶）。右：環帶，晶體成長時不同階段的成分不同（固溶體在不同溫壓下結晶，或化學不平衡），一圈一圈記錄生長過程，例如斜長石從核心富鈣到邊緣富鈉。" source="課堂投影片 L08 p.5–6">
      <svg viewBox="0 0 560 180" className="ix-svg" role="img" aria-label="雙晶與環帶">
        <clipPath id="tw-clip"><polygon points="40,60 70,40 160,40 160,110 130,130 40,130" /></clipPath>
        <g clipPath="url(#tw-clip)">{stripes}</g>
        <polygon points="40,60 70,40 160,40 160,110 130,130 40,130" fill="none" stroke={INK} strokeWidth={1.8} />
        <text x={100} y={155} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>聚片雙晶（斜長石）</text>
        <polygon points="230,40 290,40 290,130 230,130" fill="#d6d6d6" stroke={INK} strokeWidth={1.8} />
        <polygon points="260,40 290,40 290,130 260,130" fill="#4a4a4a" />
        <text x={260} y={155} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>簡單雙晶（正長石）</text>
        {[48, 38, 28, 18, 9].map((r, i) => (
          <polygon key={r} points={Array.from({ length: 6 }, (_, k) => `${440 + r * 1.3 * Math.cos(rad(k * 60))},${85 - r * Math.sin(rad(k * 60))}`).join(" ")} fill={["#c7c7c7", "#a8a8a8", "#8a8a8a", "#6c6c6c", "#4e4e4e"][i]} stroke={INK} strokeWidth={i === 0 ? 1.8 : 0.6} />
        ))}
        <text x={440} y={155} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>環帶 zoning</text>
        <text x={440} y={172} textAnchor="middle" style={{ fontSize: 11 }}>核心早、邊緣晚</text>
      </svg>
    </Fig>
  );
}

export function ExtinctionFig() {
  const cross = (cx: number) => (
    <g>
      <circle cx={cx} cy={90} r={70} fill="none" stroke={INK} strokeOpacity={0.4} />
      <line x1={cx - 70} x2={cx + 70} y1={90} y2={90} stroke={INK} strokeOpacity={0.5} />
      <line x1={cx} x2={cx} y1={20} y2={160} stroke={INK} strokeOpacity={0.5} />
    </g>
  );
  const lines = (cx: number, ang: number, n: number, sp: number, clip: string) => {
    const a = rad(ang);
    return (
      <g clipPath={`url(#${clip})`}>
        {Array.from({ length: n }, (_, k) => {
          const off = (k - (n - 1) / 2) * sp;
          const nx = -Math.sin(a), ny = -Math.cos(a);
          return <line key={k} x1={cx + off * nx - 80 * Math.cos(a)} y1={90 + off * ny + 80 * Math.sin(a)} x2={cx + off * nx + 80 * Math.cos(a)} y2={90 + off * ny - 80 * Math.sin(a)} stroke="#bbb" strokeWidth={1} />;
        })}
      </g>
    );
  };
  return (
    <Fig caption="三種消光（正交偏光下顆粒變黑的位置）。平行消光：解理或晶體長邊和十字絲平行時消光（黑雲母、白雲母、正長石、斜方輝石、橄欖石）；對稱消光：十字絲剛好平分兩組解理的夾角時消光（方解石、角閃石的橫切面）；斜消光：解理和十字絲夾一個角度時才消光，這個角就是消光角（單斜輝石約 36–45°、角閃石、斜長石）。量法：先把解理對齊十字絲，再轉載物台到全黑，轉過的角度就是消光角。" source="課堂投影片 L08 p.7–11">
      <svg viewBox="0 0 600 210" className="ix-svg" role="img" aria-label="三種消光">
        <defs>
          <clipPath id="ex1"><polygon points="70,60 150,60 150,120 70,120" /></clipPath>
          <clipPath id="ex2"><polygon points="300,40 340,90 300,140 260,90" /></clipPath>
          <clipPath id="ex3"><polygon points="460,110 480,50 540,70 520,130" transform="rotate(0)" /></clipPath>
        </defs>
        {cross(110)}
        <polygon points="70,60 150,60 150,120 70,120" fill="#222" />
        {lines(110, 0, 6, 10, "ex1")}
        <text x={110} y={185} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>平行消光</text>
        <text x={110} y={203} textAnchor="middle" style={{ fontSize: 11 }}>解理 ∥ 十字絲</text>
        {cross(300)}
        <polygon points="300,40 340,90 300,140 260,90" fill="#222" />
        {lines(300, 51, 7, 10, "ex2")}
        {lines(300, -51, 7, 10, "ex2")}
        <text x={300} y={185} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>對稱消光</text>
        <text x={300} y={203} textAnchor="middle" style={{ fontSize: 11 }}>十字絲平分兩組解理</text>
        {cross(490)}
        <polygon points="460,110 480,50 540,70 520,130" fill="#222" />
        {lines(490, 71.6, 7, 9, "ex3")}
        <path d={`M490,50 A40,40 0 0 1 ${490 + 40 * Math.cos(rad(71.6))},${90 - 40 * Math.sin(rad(71.6))}`} fill="none" stroke={C.orange} strokeWidth={2} />
        <text x={505} y={44} style={{ fontSize: 12, fontWeight: 800 }} fill={C.orange}>消光角</text>
        <text x={490} y={185} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>斜消光</text>
        <text x={490} y={203} textAnchor="middle" style={{ fontSize: 11 }}>解理和十字絲斜交</text>
      </svg>
    </Fig>
  );
}

/* 光率體 */
export function IndicatrixFig() {
  const ind = (cx: number, a: number, c: number, title: string, rel: string, ex: string, col: string) => (
    <g>
      <line x1={cx} x2={cx} y1={20} y2={190} stroke={INK} strokeDasharray="4 3" />
      <text x={cx + 6} y={28} style={{ fontSize: 11 }}>光軸（c 軸）</text>
      <ellipse cx={cx} cy={105} rx={a} ry={c} fill={col} fillOpacity={0.18} stroke={col} strokeWidth={2} />
      <ellipse cx={cx} cy={105} rx={a} ry={a * 0.28} fill="none" stroke={col} strokeWidth={1.2} strokeDasharray="4 3" />
      <line x1={cx} x2={cx + a} y1={105} y2={105} stroke={INK} strokeWidth={1.8} />
      <text x={cx + a / 2} y={100} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>ω</text>
      <line x1={cx} x2={cx} y1={105} y2={105 - c} stroke={C.rose} strokeWidth={2.5} />
      <text x={cx - 8} y={105 - c / 2} textAnchor="end" style={{ fontSize: 12, fontWeight: 800 }} fill={C.rose}>ε</text>
      <text x={cx} y={214} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{title}</text>
      <text x={cx} y={232} textAnchor="middle" style={{ fontSize: 11.5 }}>{rel}；{ex}</text>
    </g>
  );
  return (
    <Fig caption="一軸晶的光率體：從晶體中心沿每個振動方向畫一段長度等於折射率的線段，端點連成的立體就是光率體。垂直光軸的切面是半徑為 ω（No，正常光）的圓（虛線），所以光沿光軸前進時不分裂（沒有雙折射）；沿光軸方向的半徑是 ε（Ne，異常光）。ε > ω 時光率體沿光軸拉長，是正光性（石英 +）；ε < ω 時壓扁，是負光性（方解石 −）。雙折射率 = 最大與最小折射率的差，方解石 1.66 − 1.49 = 0.17。" source="課堂投影片 L08 p.13–21">
      <svg viewBox="0 0 560 245" className="ix-svg" role="img" aria-label="正負光性光率體">
        {ind(150, 60, 82, "正光性（+）", "ε > ω，沿光軸拉長", "石英", C.teal)}
        {ind(410, 90, 56, "負光性（−）", "ε < ω，沿光軸壓扁", "方解石", C.orange)}
      </svg>
    </Fig>
  );
}
