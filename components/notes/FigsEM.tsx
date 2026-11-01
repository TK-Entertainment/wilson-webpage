"use client";

import type { ReactNode } from "react";
import { Fig } from "./Figs";

// 地球物質（台大）各章的自繪圖
const INK = "currentColor";
const rad = (d: number) => (d * Math.PI) / 180;
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", violet: "#8a6fd1", blue: "#5b8bd9", green: "#4f9d5d" };
const T = ({ x, y, children, s = 12, w, a, c }: { x: number; y: number; children: ReactNode; s?: number; w?: number; a?: "start" | "middle" | "end"; c?: string }) => (
  <text x={x} y={y} textAnchor={a ?? "start"} style={{ fontSize: s, fontWeight: w, fill: c }}>{children}</text>
);

function Marks() {
  return (
    <defs>
      {[["em-k", "currentColor"], ["em-o", C.orange], ["em-b", C.blue], ["em-r", C.rose]].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

/* ───────────── Ch2：地殼的礦物組成 ───────────── */

export function CrustMineralsFig() {
  const d: [string, number, string][] = [
    ["斜長石", 39, C.blue], ["鹼性長石", 12, C.rose], ["石英", 12, C.gold], ["輝石", 11, C.green], ["角閃石", 5, C.teal], ["雲母", 5, C.violet], ["黏土礦物", 4.6, C.orange], ["其他矽酸鹽", 3, "#999"], ["非矽酸鹽", 8, "#555"],
  ];
  let acc = 0;
  const x = (v: number) => 20 + v * 6;
  const small = d.filter(([, v]) => v < 11);
  return (
    <Fig caption="地殼的礦物組成（體積 %）。長石（斜長石 + 鹼性長石）一半以上，加上石英和輝石就約 75 %；矽酸鹽總共約 92 %，非矽酸鹽（碳酸鹽、氧化物、硫化物……）只有 8 %。考古題「組成地殼的三種主要礦物」答長石、石英、輝石。" source="Ronov & Yaroshevsky (1969)；課堂投影片 Ch2">
      <svg viewBox="0 0 640 170" className="ix-svg" role="img" aria-label="地殼礦物組成長條圖">
        {d.map(([n, v, c]) => {
          const x0 = x(acc);
          acc += v;
          const w = v * 6;
          return (
            <g key={n}>
              <rect x={x0} y={30} width={w} height={44} fill={c} fillOpacity={0.55} stroke={INK} strokeWidth={1} />
              {v >= 11 ? <T x={x0 + w / 2} y={50} a="middle" w={800} s={12.5}>{n}</T> : null}
              {v >= 11 ? <T x={x0 + w / 2} y={66} a="middle" s={11.5}>{v} %</T> : null}
            </g>
          );
        })}
        {small.map(([n, v, c], i) => (
          <g key={n}>
            <rect x={20 + i * 122} y={92} width={12} height={12} fill={c} fillOpacity={0.55} stroke={INK} strokeWidth={0.8} />
            <T x={37 + i * 122} y={103} s={11}>{n} {v} %</T>
          </g>
        ))}
        <line x1={x(0)} x2={x(74)} y1={20} y2={20} stroke={INK} strokeWidth={2} />
        <T x={x(37)} y={15} a="middle" s={11}>長石 + 石英 + 輝石 ≈ 74 %</T>
        <line x1={x(0)} x2={x(91.6)} y1={130} y2={130} stroke={C.orange} strokeWidth={2} />
        <T x={x(46)} y={148} a="middle" s={11} c={C.orange}>矽酸鹽 ≈ 92 %</T>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch1：地函過渡帶 ───────────── */

export function TransitionZoneFig() {
  const z = (km: number) => 20 + km * 0.32;
  const L: [number, number, string, string, string][] = [
    [0, 410, "鎂橄欖石 α-Mg₂SiO₄", "斜方，SiO₄ 獨立四面體", C.green],
    [410, 525, "瓦茲利石 β-Mg₂SiO₄（Wadsleyite）", "尖晶石類似結構", C.teal],
    [525, 660, "林伍德石 γ-Mg₂SiO₄（Ringwoodite）", "尖晶石結構", C.blue],
    [660, 800, "布里奇曼石 MgSiO₃ + 方鎂石 MgO", "Si 變成六配位（鈣鈦礦結構）", C.violet],
  ];
  return (
    <Fig caption="同樣成分 Mg₂SiO₄，壓力越大排得越緊密，所以 410、525、660 km 三個深度的震波速度突然跳增，就是同質異像相變。660 km 以下 Si 從四配位變六配位，礦物分解成 bridgmanite + periclase，是下部地函的主要礦物。" source="課堂投影片 Ch1；Open Petrology">
      <svg viewBox="0 0 640 290" className="ix-svg" role="img" aria-label="地函過渡帶的橄欖石相變">
        {L.map(([a, b, n, s, c]) => (
          <g key={n}>
            <rect x={90} y={z(a)} width={120} height={z(b) - z(a)} fill={c} fillOpacity={0.35} stroke={INK} />
            <T x={230} y={(z(a) + z(b)) / 2} w={800} s={13}>{n}</T>
            <T x={230} y={(z(a) + z(b)) / 2 + 17} s={11.5}>{s}</T>
          </g>
        ))}
        {[0, 410, 525, 660].map((k) => <T key={k} x={80} y={z(k) + 4} a="end" s={11}>{k} km</T>)}
        <Marks />
        <line x1={40} x2={40} y1={z(0)} y2={z(800)} stroke={INK} strokeWidth={2} markerEnd="url(#em-k)" />
        <text x={30} y={z(400)} textAnchor="middle" transform={`rotate(-90 30 ${z(400)})`} style={{ fontSize: 11 }}>深度、壓力增加 →</text>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch2：礦物演化 ───────────── */

export function MineralEvolutionFig() {
  const S: [string, string, string, number, string][] = [
    ["0", "恆星形成前", ">4.6 Ga", 12, "超新星、紅巨星外層凝結：鑽石、石墨、碳化矽"],
    ["1", "原始球粒隕石", "4.56", 60, "太陽星雲凝結：CAI、球粒（橄欖石、輝石）"],
    ["2", "微行星換質、分異", "4.56–4.55", 250, "水換質、熱變質、分異出核與殼"],
    ["3", "火成岩演化", "4.55–4.0", 420, "地殼火成岩、揮發份"],
    ["4", "花崗岩形成", "4.0–3.5", 1000, "部分熔融再熔融 → 偉晶岩"],
    ["5", "板塊作用", ">3.0", 1500, "隱沒、熱液硫化物、高壓變質礦物"],
    ["6", "無氧生物世界", "3.9–2.5", 1500, "生物還沒改變大氣"],
    ["7", "古元古代大氣變遷", "2.5–1.9", 4000, "大氧化事件：數千種氧化、水合礦物"],
    ["8", "過渡型海洋", "1.9–1.0", 4000, "深海缺氧、硫化"],
    ["9", "新元古代變遷", "1.0–0.542", 4000, "雪球地球、氧氣再上升"],
    ["10", "顯生宙", "0.542–今", 4400, "生物礦化：殼、骨骼、黏土、煤"],
  ];
  const y = (i: number) => 22 + i * 24;
  const bw = (n: number) => 20 + Math.log10(n) * 34;
  return (
    <Fig caption="礦物演化（Hazen et al. 2008）：地球上的礦物種類不是一開始就有，而是隨地質事件一階段一階段增加，從恆星形成前約十幾種，到現在約六千種。長條是各階段累積的礦物種數（約略，對數）。最大的一次跳增在第 7 期大氧化事件：氧氣讓 Fe、Mn、Cu、U 等元素出現大量氧化物與水合礦物。" source="Hazen et al. (2008)；課堂投影片 Ch2">
      <svg viewBox="0 0 660 296" className="ix-svg" role="img" aria-label="礦物演化十個階段">
        {S.map(([k, n, t, cnt, d], i) => {
          const era = i <= 2 ? C.gold : i <= 6 ? C.teal : C.green;
          return (
            <g key={k}>
              <rect x={10} y={y(i) - 13} width={bw(cnt)} height={18} fill={era} fillOpacity={0.45} stroke={INK} strokeWidth={0.8} />
              <T x={16} y={y(i)} s={11} w={800}>{k}</T>
              <T x={210} y={y(i)} s={12} w={800}>{n}</T>
              <T x={340} y={y(i)} s={10.5}>{t} Ga</T>
              <T x={420} y={y(i)} s={10.5}>{d}</T>
              <T x={bw(cnt) + 4} y={y(i)} s={10}>~{cnt}</T>
            </g>
          );
        })}
        <T x={10} y={292} s={10.5} c={C.gold}>■ 原行星盤吸積時期</T>
        <T x={180} y={292} s={10.5} c={C.teal}>■ 地殼與地函改造時期</T>
        <T x={360} y={292} s={10.5} c={C.green}>■ 生物介導礦物作用時期</T>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch4：最密堆積 ───────────── */

export function PackingFig() {
  const r = 18;
  const layer = (ox: number, oy: number, fill: string, op = 1, dx = 0, dy = 0) => {
    const out: ReactNode[] = [];
    for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
      const cx = ox + dx + i * 2 * r + (j % 2) * r;
      const cy = oy + dy + j * r * Math.sqrt(3);
      out.push(<circle key={`${i}-${j}-${fill}`} cx={cx} cy={cy} r={r} fill={fill} fillOpacity={op} stroke={INK} strokeWidth={1} />);
    }
    return out;
  };
  const bdx = r, bdy = r / Math.sqrt(3);
  return (
    <Fig caption="最密堆積：每一層都是六方排列，下一層放在上一層的凹洞上。HCP 第三層正好疊回第一層的位置（ABAB…）；CCP 第三層放在第一、二層都沒用過的凹洞（ABCABC…），等於面心立方（FCC）。兩者配位數都是 12、空間占有率都是 74 %；BCC 不是最密堆積，配位數 8、占有率 68 %。" source="課堂投影片 Ch4">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="六方與立方最密堆積">
        {layer(40, 50, "var(--teal)", 0.35)}
        {layer(40, 50, C.orange, 0.65, bdx, bdy).slice(0, 7)}
        <T x={150} y={20} a="middle" w={800} s={14}>HCP：A B A B…</T>
        <T x={150} y={200} a="middle" s={11.5}>第三層在 A 正上方</T>
        <T x={150} y={216} a="middle" s={11.5}>Mg、Zn、Ti（延展性差）</T>
        {layer(360, 50, "var(--teal)", 0.35)}
        {layer(360, 50, C.orange, 0.65, bdx, bdy).slice(0, 7)}
        {[[2 * r, 2 * bdy], [4 * r, 2 * bdy], [3 * r, 2 * bdy + r * Math.sqrt(3)]].map(([dx, dy], i) => (
          <circle key={i} cx={360 + dx} cy={50 + dy} r={7} fill={C.violet} stroke={INK} />
        ))}
        <T x={480} y={20} a="middle" w={800} s={14}>CCP（FCC）：A B C…</T>
        <T x={480} y={200} a="middle" s={11.5}>紫點：第三層 C 的位置</T>
        <T x={480} y={216} a="middle" s={11.5}>Cu、Au、Al（延展性好）</T>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch4：Pauling 第三則 ───────────── */

export function PolyShareFig() {
  const tri = (cx: number, cy: number, rot: number, s = 46) =>
    [0, 120, 240].map((a) => [cx + s * Math.cos(rad(a + rot)), cy + s * Math.sin(rad(a + rot))]);
  const P = (pts: number[][]) => pts.map((p) => p.join(",")).join(" ");
  const panel = (ox: number, kind: "corner" | "edge" | "face") => {
    let A: number[][], B: number[][];
    const cy = 100;
    if (kind === "corner") { A = tri(ox + 52, cy, 0); const v = A[0]; B = tri(v[0] + 46, cy, 180); }
    else if (kind === "edge") { A = tri(ox + 60, cy, 0); B = tri(ox + 60 + 46, cy, 180); }
    else { A = tri(ox + 80, cy, -90, 52); B = tri(ox + 80, cy, -90, 52).map(([x, y]) => [x + 6, y + 4]); }
    const ca = A.reduce((s, p) => [s[0] + p[0] / 3, s[1] + p[1] / 3], [0, 0]);
    const cb = B.reduce((s, p) => [s[0] + p[0] / 3, s[1] + p[1] / 3], [0, 0]);
    return (
      <g>
        <polygon points={P(A)} fill="var(--teal)" fillOpacity={0.25} stroke={INK} strokeWidth={1.5} />
        <polygon points={P(B)} fill={C.gold} fillOpacity={0.25} stroke={INK} strokeWidth={1.5} />
        <line x1={ca[0]} y1={ca[1]} x2={cb[0]} y2={cb[1]} stroke={C.rose} strokeWidth={2} strokeDasharray="4 3" />
        <circle cx={ca[0]} cy={ca[1]} r={5} fill={C.orange} stroke={INK} />
        <circle cx={cb[0]} cy={cb[1]} r={5} fill={C.orange} stroke={INK} />
      </g>
    );
  };
  return (
    <Fig caption="Pauling 第三則：多面體共用頂點最穩定，共用邊次之，共用面最不穩定。原因是共用越多，兩個中心陽離子（橘點）距離越近（紅虛線），正電互相排斥越強。兩個四面體中心距離的比例：共角 1、共邊 0.58、共面 0.33。矽酸鹽的 SiO₄ 四面體只共用頂點（橋氧），從不共邊、共面——這也是第四則：高價、低配位的陽離子（Si⁴⁺）最不願意共用多面體元素。" source="課堂投影片 Ch4；Klein & Philpotts (2017)">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="多面體共角共邊共面">
        {panel(20, "corner")}
        {panel(240, "edge")}
        {panel(440, "face")}
        <T x={100} y={185} a="middle" w={800}>共角：最穩定 (1.00)</T>
        <T x={320} y={185} a="middle" w={800}>共邊：次穩定 (0.58)</T>
        <T x={530} y={185} a="middle" w={800}>共面：最不穩定 (0.33)</T>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch4：固溶體三型 ───────────── */

export function SolidSolTypesFig() {
  const grid = (ox: number, kind: "sub" | "int" | "om") => {
    const out: ReactNode[] = [];
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
      const cx = ox + 20 + i * 38, cy = 40 + j * 38;
      const special = (i + j * 4) % 5 === 2;
      if (kind === "om" && special) out.push(<rect key={`${i}${j}`} x={cx - 11} y={cy - 11} width={22} height={22} fill="none" stroke={INK} strokeDasharray="3 2" />);
      else out.push(<circle key={`${i}${j}`} cx={cx} cy={cy} r={12} fill={kind === "sub" && special ? C.orange : "var(--teal)"} fillOpacity={kind === "sub" && special ? 0.9 : 0.4} stroke={INK} />);
      if (kind === "int" && i < 3 && j < 3 && (i + j) % 3 === 0) out.push(<circle key={`x${i}${j}`} cx={cx + 19} cy={cy + 19} r={5} fill={C.rose} stroke={INK} />);
    }
    return out;
  };
  return (
    <Fig caption="固溶體的三種方式。替換型：尺寸相近的離子互換位置（橄欖石的 Mg²⁺ ⇄ Fe²⁺）。間隙型：小的離子塞進結構的空隙（綠柱石六元環孔洞中的 Na⁺，Na₀.₃Be₃Al₂(Si₅.₇Al₀.₃)O₁₈；Al³⁺ 替 Si⁴⁺ 少的電荷由 Na⁺ 補）。缺位型：有些位置空著（磁黃鐵礦 Fe₁₋ₓS，部分 Fe²⁺ 變成 Fe³⁺ 來平衡電荷，寫成 (Fe²⁺₁₋₃ₓFe³⁺₂ₓ)□ₓS，□ 代表空位）。" source="課堂投影片 Ch4">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="替換、間隙、缺位固溶體">
        {grid(20, "sub")}
        {grid(235, "int")}
        {grid(450, "om")}
        <T x={95} y={200} a="middle" w={800}>替換 substitutional</T>
        <T x={95} y={218} a="middle" s={11}>橄欖石 Mg ⇄ Fe</T>
        <T x={310} y={200} a="middle" w={800}>間隙 interstitial</T>
        <T x={310} y={218} a="middle" s={11}>綠柱石孔洞中的 Na⁺</T>
        <T x={525} y={200} a="middle" w={800}>缺位 omission</T>
        <T x={525} y={218} a="middle" s={11}>磁黃鐵礦 Fe₁₋ₓS</T>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch5：對稱要素的圖形符號 ───────────── */

export function SymmetrySymbolsFig() {
  const poly = (cx: number, cy: number, n: number, r: number, fill = INK) => (
    <polygon points={Array.from({ length: n }, (_, i) => `${cx + r * Math.cos(rad(-90 + (360 * i) / n))},${cy + r * Math.sin(rad(-90 + (360 * i) / n))}`).join(" ")} fill={fill} stroke={INK} strokeWidth={1.5} />
  );
  const items: [string, string, ReactNode][] = [
    ["2", "二次軸", <ellipse key="2" cx={0} cy={0} rx={14} ry={7} fill={INK} />],
    ["3", "三次軸", poly(0, 2, 3, 13)],
    ["4", "四次軸", <rect key="4" x={-10} y={-10} width={20} height={20} fill={INK} />],
    ["6", "六次軸", poly(0, 0, 6, 13)],
    ["3̄", "三次旋反軸", <g key="3b">{poly(0, 2, 3, 14)}<circle cx={0} cy={2} r={4} fill="hsl(var(--background))" /></g>],
    ["4̄", "四次旋反軸", <g key="4b"><rect x={-11} y={-11} width={22} height={22} fill="none" stroke={INK} strokeWidth={2} /><ellipse cx={0} cy={0} rx={8} ry={4} fill={INK} /></g>],
    ["6̄", "六次旋反軸（= 3/m）", <g key="6b">{poly(0, 0, 6, 14, "none")}{poly(0, 1, 3, 8)}</g>],
    ["1̄", "反演中心 i", <circle key="i" cx={0} cy={0} r={6} fill="none" stroke={INK} strokeWidth={2} />],
    ["m", "鏡面（垂直紙面）", <line key="m" x1={-18} x2={18} y1={0} y2={0} stroke={INK} strokeWidth={4} />],
    ["m", "鏡面（紙面）：基圓加粗", <circle key="mm" cx={0} cy={0} r={15} fill="none" stroke={INK} strokeWidth={4} />],
  ];
  return (
    <Fig caption="對稱要素的書寫符號（written symbol）與圖形符號（graphical symbol）。考古題常要「看圖寫符號」或「看符號畫圖」：旋轉軸用 n 邊形（二次是橢圓）；旋反軸 n̄ 是 n 邊形中間挖白，或外框加小一級的實心圖形；1̄ 就是對稱中心；2̄ 等於垂直該軸的鏡面，所以不另外用。" source="課堂投影片 Ch5；Klein & Philpotts (2017)">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="對稱要素符號表">
        {items.map(([w, n, g], i) => {
          const cx = 64 + (i % 5) * 128, cy = 50 + Math.floor(i / 5) * 100;
          return (
            <g key={i}>
              <g transform={`translate(${cx},${cy})`}>{g}</g>
              <T x={cx} y={cy + 36} a="middle" w={900} s={14}>{w}</T>
              <T x={cx} y={cy + 52} a="middle" s={10.5}>{n}</T>
            </g>
          );
        })}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch5：球面投影 → 赤平投影 ───────────── */

export function StereoProjFig() {
  const cx = 170, cy = 120, R = 90;
  const p = rad(40); // 極點與北極夾角
  const P = [cx + R * Math.sin(p), cy - R * Math.cos(p)];
  const S = [cx, cy + R];
  const t = (cy - S[1]) / (P[1] - S[1]);
  const Q = [S[0] + t * (P[0] - S[0]), cy];
  return (
    <Fig caption="晶體投影的兩步驟（2025 考題 B12、B13）：① 球面投影——把晶體放在球心，每個晶面的法線延伸出去和球面交於一點（極點）；② 赤平投影——把上半球的極點和南極連線，連線穿過赤道面（基圓 primitive circle）的位置就是投影點（實心點），下半球的極點和北極連線（空心圈）。晶面越陡，極點越靠近基圓；水平的 (001) 投在圓心。結晶學用保角度的「等角」投影（Wulff net），構造地質用保面積的「等面積」投影（Schmidt net）。" source="課堂投影片 Ch5；Klein & Philpotts (2017) Fig. 5.13">
      <svg viewBox="0 0 640 250" className="ix-svg" role="img" aria-label="球面投影與赤平投影">
        <Marks />
        <circle cx={cx} cy={cy} r={R} fill="var(--teal)" fillOpacity={0.08} stroke={INK} strokeWidth={1.5} />
        <ellipse cx={cx} cy={cy} rx={R} ry={22} fill="none" stroke={INK} strokeDasharray="4 3" />
        <rect x={cx - 18} y={cy - 18} width={36} height={36} fill={C.gold} fillOpacity={0.5} stroke={INK} transform={`rotate(40 ${cx} ${cy})`} />
        <line x1={cx} y1={cy} x2={P[0]} y2={P[1]} stroke={C.orange} strokeWidth={2} markerEnd="url(#em-o)" />
        <circle cx={P[0]} cy={P[1]} r={5} fill={C.orange} stroke={INK} />
        <line x1={P[0]} y1={P[1]} x2={S[0]} y2={S[1]} stroke={C.blue} strokeWidth={1.5} strokeDasharray="4 3" />
        <circle cx={Q[0]} cy={Q[1]} r={5} fill={INK} />
        <circle cx={S[0]} cy={S[1]} r={4} fill={C.blue} />
        <T x={P[0] + 8} y={P[1] - 6} s={11}>極點（面的法線）</T>
        <T x={S[0] + 8} y={S[1] + 14} s={11}>南極</T>
        <T x={cx} y={20} a="middle" w={800}>① 球面投影 + ② 往南極連線</T>
        <g transform="translate(470,120)">
          <circle r={R} fill="none" stroke={INK} strokeWidth={2} />
          <circle cx={Q[0] - cx} cy={0} r={5} fill={INK} />
          <circle cx={-40} cy={30} r={6} fill="none" stroke={INK} strokeWidth={1.8} />
          <circle cx={0} cy={0} r={3} fill={INK} />
          <T x={0} y={-R - 10} a="middle" w={800}>赤平投影圖（從上往下看）</T>
          <T x={Q[0] - cx + 8} y={-6} s={11}>上半球 ●</T>
          <T x={-34} y={50} s={11}>下半球 ○</T>
          <T x={0} y={R + 20} a="middle" s={11}>外圈 = 基圓（赤道面）</T>
        </g>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch5：雙晶 ───────────── */

export function TwinTypesFig() {
  return (
    <Fig caption="依雙晶個體的幾何關係分三種。接觸雙晶：兩個個體以一個雙晶面接觸（尖晶石律、石膏燕尾雙晶）。貫穿雙晶：兩個個體互相穿插，通常繞雙晶軸旋轉產生（正長石卡斯巴律、十字石、黃鐵礦鐵十字、螢石）。多重雙晶：三個以上個體依同一雙晶律重複；組成面全部平行時叫聚片（多層）雙晶，例如斜長石的鈉長石律雙晶，正交偏光下是黑白條紋。" source="課堂投影片 Ch5">
      <svg viewBox="0 0 640 210" className="ix-svg" role="img" aria-label="接觸、貫穿、聚片雙晶">
        <polygon points="60,160 110,40 160,160" fill="var(--teal)" fillOpacity={0.3} stroke={INK} strokeWidth={1.5} />
        <polygon points="110,40 160,160 210,40" fill={C.gold} fillOpacity={0.35} stroke={INK} strokeWidth={1.5} />
        <line x1={110} y1={40} x2={160} y2={160} stroke={C.rose} strokeWidth={3} />
        <T x={135} y={190} a="middle" w={800}>接觸雙晶</T>
        <T x={135} y={206} a="middle" s={11}>紅線＝雙晶面（組成面）</T>
        <rect x={290} y={60} width={50} height={110} fill="var(--teal)" fillOpacity={0.3} stroke={INK} strokeWidth={1.5} />
        <rect x={290} y={60} width={50} height={110} fill={C.gold} fillOpacity={0.35} stroke={INK} strokeWidth={1.5} transform="rotate(60 315 115)" />
        <T x={315} y={190} a="middle" w={800}>貫穿雙晶</T>
        <T x={315} y={206} a="middle" s={11}>十字石：繞雙晶軸轉 60° 或 90°</T>
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={440 + i * 14} y={50} width={14} height={110} fill={i % 2 ? "#333" : "#ddd"} stroke={INK} strokeWidth={0.6} />
        ))}
        <T x={503} y={190} a="middle" w={800}>聚片雙晶</T>
        <T x={503} y={206} a="middle" s={11}>斜長石鈉長石律：組成面全部平行 (010)</T>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch5：同質異像四型 ───────────── */

export function PolymorphTypesFig() {
  const box = (x: number, title: string, sub: string, ex: string, body: ReactNode) => (
    <g>
      <rect x={x} y={30} width={145} height={120} fill="none" stroke={INK} strokeWidth={1.5} />
      <g transform={`translate(${x},30)`}>{body}</g>
      <T x={x + 72} y={20} a="middle" w={800} s={13}>{title}</T>
      <T x={x + 72} y={170} a="middle" s={11}>{sub}</T>
      <T x={x + 72} y={186} a="middle" s={11}>{ex}</T>
    </g>
  );
  const hex = (cx: number, cy: number, r: number, rot = 0, col = INK) => (
    <polygon points={Array.from({ length: 6 }, (_, i) => `${cx + r * Math.cos(rad(rot + 60 * i))},${cy + r * Math.sin(rad(rot + 60 * i))}`).join(" ")} fill="none" stroke={col} strokeWidth={2} />
  );
  return (
    <Fig caption="同質異像（polymorphism）四型。重建型要打斷化學鍵、重新連接，活化能高、通常不可逆、很慢（石英 → 方矽石、柯石英、重矽石；鑽石 ⇄ 石墨）。位移型只是鍵角稍微扭動，不斷鍵，幾乎瞬間完成且可逆（低溫 α 石英 ⇄ 高溫 β 石英，573–575 °C）；降溫回 α 石英時，左旋右旋兩種螺旋結構混在一起形成巴西雙晶，相同旋向但取向不同形成道芬雙晶。有序–無序型是原子在位置上的排列從規則到隨機（鉀長石的 Al、Si：低溫微斜長石有序 ⇄ 高溫透長石無序）。疊型是相同的層，用不同方式往上疊（雲母 1M、2M、3T；石墨）。" source="課堂投影片 Ch5">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="四種同質異像">
        {box(5, "重建型", "斷鍵重組・不可逆", "石英 → 柯石英", <>{hex(40, 60, 22)}<line x1={68} x2={86} y1={60} y2={60} stroke={C.orange} strokeWidth={2} /><rect x={92} y={40} width={36} height={36} fill="none" stroke={C.orange} strokeWidth={2} /></>)}
        {box(165, "位移型", "鍵角扭動・可逆、快", "α 石英 ⇄ β 石英", <>{hex(42, 60, 22, 0)}<polygon points={Array.from({ length: 6 }, (_, i) => `${105 + 22 * Math.cos(rad(60 * i)) * (i % 2 ? 0.8 : 1)},${60 + 22 * Math.sin(rad(60 * i))}`).join(" ")} fill="none" stroke={C.orange} strokeWidth={2} /></>)}
        {box(325, "有序–無序型", "位置上的排列", "微斜長石 ⇄ 透長石", <>{[0, 1, 2, 3].map((i) => [0, 1, 2].map((j) => <circle key={`${i}${j}`} cx={14 + i * 14} cy={38 + j * 22} r={5} fill={(i + j) % 2 ? C.blue : C.gold} stroke={INK} />))}{[0, 1, 2, 3].map((i) => [0, 1, 2].map((j) => <circle key={`r${i}${j}`} cx={86 + i * 14} cy={38 + j * 22} r={5} fill={[1, 4, 6, 7, 11].includes(i * 3 + j) ? C.blue : C.gold} stroke={INK} />))}</>)}
        {box(485, "疊型", "相同的層、不同疊法", "雲母 1M、2M", <>{[0, 1, 2, 3].map((k) => <rect key={k} x={20 + (k % 2) * 10} y={18 + k * 22} width={50} height={12} fill="var(--teal)" fillOpacity={0.4} stroke={INK} />)}{[0, 1, 2, 3].map((k) => <rect key={`b${k}`} x={82 + k * 6} y={18 + k * 22} width={50} height={12} fill={C.gold} fillOpacity={0.45} stroke={INK} />)}</>)}
      </svg>
    </Fig>
  );
}

/* ───────────── Ch8：Al₂SiO₅ 單成分相圖 ───────────── */

export function Al2SiO5Fig() {
  // Holdaway (1971)：三相點 ~504 °C、0.38 GPa
  const x = (t: number) => 60 + ((t - 200) / 700) * 540;
  const y = (p: number) => 220 - (p / 1.0) * 200;
  const tp = [504, 0.38];
  return (
    <Fig caption="單成分（Al₂SiO₅）溫壓相圖。藍晶石（kyanite）在高壓、紅柱石（andalusite）在低壓低溫、矽線石（sillimanite）在高溫。相律 P + F = C + 2，C = 1：區域內只有一相，F = 2（溫度、壓力都能變）；線上兩相共存，F = 1（定了溫度，壓力就跟著定）；三相點 F = 0，三相共存只能在唯一的一組溫壓（約 504 °C、0.38 GPa）。線的斜率就是 Clapeyron 方程式 dP/dT = ΔS/ΔV。變質岩中出現哪一種，可以大致告訴我們它經歷的溫壓。" source="Holdaway (1971)；課堂投影片 Ch8">
      <svg viewBox="0 0 640 260" className="ix-svg" role="img" aria-label="Al2SiO5 相圖">
        <rect x={60} y={20} width={540} height={200} fill="none" stroke={INK} strokeWidth={1.5} />
        <line x1={x(200)} y1={y(0.08)} x2={x(tp[0])} y2={y(tp[1])} stroke={INK} strokeWidth={2.5} />
        <line x1={x(tp[0])} y1={y(tp[1])} x2={x(900)} y2={y(0.95)} stroke={INK} strokeWidth={2.5} />
        <line x1={x(tp[0])} y1={y(tp[1])} x2={x(800)} y2={y(0.0)} stroke={INK} strokeWidth={2.5} />
        <circle cx={x(tp[0])} cy={y(tp[1])} r={6} fill={C.gold} stroke={INK} />
        <T x={x(tp[0]) + 10} y={y(tp[1]) + 18} s={11}>三相點 F = 0</T>
        <T x={x(330)} y={y(0.75)} w={800} s={14} c={C.blue}>藍晶石 Ky</T>
        <T x={x(330)} y={y(0.12)} w={800} s={14} c={C.orange}>紅柱石 And</T>
        <T x={x(760)} y={y(0.42)} w={800} s={14} c={C.rose}>矽線石 Sil</T>
        <T x={x(740)} y={y(0.6)} s={11}>線上：兩相、F = 1</T>
        <T x={x(260)} y={y(0.55)} s={11}>區域內：一相、F = 2</T>
        {[200, 400, 600, 800].map((t) => <T key={t} x={x(t)} y={236} a="middle" s={10.5}>{t}</T>)}
        {[0, 0.5, 1].map((p) => <T key={p} x={54} y={y(p) + 4} a="end" s={10.5}>{p}</T>)}
        <T x={330} y={254} a="middle" s={11.5}>溫度（°C）</T>
        <T x={16} y={120} s={11.5}>GPa</T>
      </svg>
    </Fig>
  );
}

/* ───────────── Ch8：封存溫度 ───────────── */

export function ClosureFig() {
  const d: [string, string, number, number, string][] = [
    ["U–Pb", "鋯石", 900, 1000, C.rose],
    ["Rb–Sr", "白雲母", 450, 550, C.orange],
    ["K–Ar", "角閃石", 480, 550, C.gold],
    ["K–Ar", "黑雲母", 280, 350, C.gold],
    ["Rb–Sr", "黑雲母", 300, 400, C.orange],
    ["分裂徑跡 FT", "鋯石", 200, 250, C.teal],
    ["分裂徑跡 FT", "磷灰石", 90, 120, C.teal],
  ];
  const x = (t: number) => 150 + (t / 1000) * 460;
  return (
    <Fig caption="常見定年系統的封存溫度（約略範圍，依礦物與冷卻速率而變）。溫度高於封存溫度時，子元素會擴散跑掉，時鐘一直被歸零；冷到封存溫度以下，時鐘才開始走。所以同一顆岩石用不同方法定年會得到不同年齡，越低封存溫度的方法記錄越晚的冷卻。考古題的排序（高 → 低）：U–Pb ＞ Rb–Sr ＞ K–Ar ＞ 分裂徑跡；分裂徑跡是在顯微鏡下數輻射損傷的軌跡，是唯一不需要質譜儀的方法。" source="Reiners & Brandon (2006)；課堂投影片 Ch8">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="封存溫度">
        {d.map(([m, mn, a, b, c], i) => (
          <g key={i}>
            <rect x={x(a)} y={18 + i * 26} width={x(b) - x(a)} height={16} fill={c} fillOpacity={0.6} stroke={INK} />
            <T x={140} y={31 + i * 26} a="end" s={11.5} w={700}>{m}（{mn}）</T>
          </g>
        ))}
        <line x1={x(0)} x2={x(1000)} y1={206} y2={206} stroke={INK} />
        {[0, 200, 400, 600, 800, 1000].map((t) => <T key={t} x={x(t)} y={222} a="middle" s={10.5}>{t} °C</T>)}
      </svg>
    </Fig>
  );
}

/* ───────────── 沉積物：粒徑、分選、圓度 ───────────── */

export function SortRoundFig() {
  const rnd = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  const grains = (ox: number, sorted: boolean) =>
    Array.from({ length: 22 }, (_, i) => {
      const r = sorted ? 7 + rnd(i) * 1.5 : 3 + rnd(i) * 13;
      return <circle key={i} cx={ox + 12 + (i % 6) * 26 + rnd(i + 3) * 6} cy={40 + Math.floor(i / 6) * 26 + rnd(i + 7) * 6} r={r} fill={C.gold} fillOpacity={0.55} stroke={INK} />;
    });
  const shape = (cx: number, k: number) => {
    const n = 7;
    const pts = Array.from({ length: n * (k + 1) }, (_, i) => {
      const a = (2 * Math.PI * i) / (n * (k + 1));
      const jag = k === 0 ? (i % 2 ? 0.55 : 1) : k === 1 ? (i % 2 ? 0.8 : 1) : k === 2 ? 0.92 + 0.08 * Math.cos(3 * a) : 1;
      return [cx + 22 * jag * Math.cos(a), 170 + 18 * jag * Math.sin(a)];
    });
    return k >= 2 ? <ellipse cx={cx} cy={170} rx={22} ry={18} fill={C.gold} fillOpacity={0.55} stroke={INK} /> : <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={C.gold} fillOpacity={0.55} stroke={INK} />;
  };
  return (
    <Fig caption="上：分選（sorting）是粒徑分布的集中程度。分選好的顆粒大小一致（海灘砂、沙漠砂），分選差的大小混雜（冰磧物、土石流）。下：圓度（roundness）從角狀到圓狀，搬運越久、磨蝕越多越圓。分選 + 圓度 = 組構成熟度（textural maturity）：未成熟（含泥、角狀、分選差，幾乎沒搬運）→ 次成熟（泥被洗掉，但仍角狀、分選差）→ 成熟（分選好、次角狀）→ 超成熟（分選好、圓）。" source="Klein & Philpotts (2017) Fig. 12.5；課堂投影片 Sediments">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="分選與圓度">
        {grains(20, true)}
        {grains(350, false)}
        <T x={105} y={20} a="middle" w={800}>分選好 well sorted</T>
        <T x={435} y={20} a="middle" w={800}>分選差 poorly sorted</T>
        {["角狀", "次角狀", "次圓", "圓狀"].map((n, k) => (
          <g key={n}>
            {shape(90 + k * 150, k)}
            <T x={90 + k * 150} y={208} a="middle" s={11.5}>{n}</T>
          </g>
        ))}
      </svg>
    </Fig>
  );
}

/* ───────────── 搬運：三種方式 ───────────── */

export function TransportModesFig() {
  return (
    <Fig caption="流體搬運顆粒的三種方式。滾動（rolling）：最大的顆粒貼著底部滾。跳躍（saltation）：流體流過顆粒頂部流速較快、壓力較低（Bernoulli 原理），顆粒被舉起、跳一小段再落下，是河底和沙丘最有效率的搬運方式。懸浮（suspension）：紊流的渦旋向上的力大於重力，黏土和粉砂可以一直懸在水中。滾動 + 跳躍 = 底負載（bed load），懸浮的叫懸浮負載（suspended load）；懸浮負載通常比較多、跑得比較快、比較遠，所以河流會依粒徑把沉積物分開（分選）。礫石若被水流排成同方向斜靠，就是覆瓦狀構造（imbrication），可以指示古水流方向。" source="課堂投影片 Transport">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="滾動、跳躍、懸浮">
        <Marks />
        <rect x={10} y={20} width={620} height={150} fill={C.blue} fillOpacity={0.08} />
        <path d="M10,170 L630,170" stroke={INK} strokeWidth={3} />
        <line x1={30} x2={130} y1={34} y2={34} stroke={C.blue} strokeWidth={2} markerEnd="url(#em-b)" />
        <T x={140} y={38} s={11}>水流</T>
        {[[80, 152], [160, 154]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={16} fill={C.gold} fillOpacity={0.6} stroke={INK} />)}
        <path d="M60,128 a24,24 0 1,1 40,0" fill="none" stroke={INK} markerEnd="url(#em-k)" />
        <T x={120} y={110} a="middle" w={800}>滾動</T>
        <path d="M250,166 Q290,95 330,166 Q360,115 390,166" fill="none" stroke={C.orange} strokeWidth={2} strokeDasharray="4 3" markerEnd="url(#em-o)" />
        {[[250, 164], [330, 164], [390, 164]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={5} fill={C.gold} stroke={INK} />)}
        <T x={320} y={100} a="middle" w={800}>跳躍</T>
        {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={460 + (i % 8) * 20 + (i % 3) * 4} cy={50 + Math.floor(i / 8) * 30 + (i % 4) * 5} r={2.2} fill={C.violet} />)}
        <path d="M470,130 q20,-30 40,0 q20,30 40,0 q20,-30 40,0" fill="none" stroke={C.violet} strokeDasharray="3 3" />
        <T x={540} y={154} a="middle" w={800}>懸浮（黏土、粉砂）</T>
        <T x={210} y={194} a="middle" s={11.5}>← 底負載 bed load →</T>
        <T x={540} y={194} a="middle" s={11.5}>懸浮負載 suspended load</T>
      </svg>
    </Fig>
  );
}

/* ───────────── 沉積構造：判斷地層上下 ───────────── */

export function WayUpFig() {
  const panel = (ox: number, title: string, sub: string, body: ReactNode) => (
    <g>
      <rect x={ox} y={26} width={146} height={130} fill="none" stroke={INK} strokeWidth={1.2} />
      <g transform={`translate(${ox},26)`}>{body}</g>
      <T x={ox + 73} y={18} a="middle" w={800} s={12.5}>{title}</T>
      <T x={ox + 73} y={172} a="middle" s={10.5}>{sub}</T>
    </g>
  );
  const rnd = (i: number) => Math.abs(Math.sin(i * 7.31) * 9301.7) % 1;
  return (
    <Fig caption="判斷地層上下（頂底）的沉積構造。① 粒級層理：每一層底部粗、往上變細（濁流沉積），粗的那一側是底。② 交錯層理：前積層在頂部被下一層截切、在底部和下界面相切（切線狀收斂），截切的那邊朝上。③ 對稱波痕：尖的波峰朝上、圓的波谷朝下。④ 泥裂：裂縫呈 V 字形往下尖滅，被上一層的砂填滿；也常見捲起的泥片（rip-up clasts）。另外還有負荷鑄型與焰狀構造（底面有突起、泥質火焰往上竄）、疊層石（圓頂朝上）、生痕化石。考古題問「舉兩個例子並說明」，畫圖加一句判斷方法就能拿滿分。" source="課堂投影片 Transport、Layering">
      <svg viewBox="0 0 640 186" className="ix-svg" role="img" aria-label="判斷地層上下的沉積構造">
        {panel(6, "① 粒級層理", "底粗 → 頂細", <>{Array.from({ length: 60 }, (_, i) => { const yy = 8 + rnd(i) * 112; const r = 1 + (yy / 120) * 5; return <circle key={i} cx={8 + rnd(i + 50) * 130} cy={yy} r={r} fill={C.gold} stroke={INK} strokeWidth={0.5} />; })}</>)}
        {panel(164, "② 交錯層理", "頂部截切、底部相切", <>{[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M${10 + k * 22},6 Q${30 + k * 22},80 ${70 + k * 22},122`} fill="none" stroke={INK} strokeWidth={1.2} />)}<line x1={0} x2={146} y1={6} y2={6} stroke={C.rose} strokeWidth={2} /><T x={73} y={20} a="middle" s={10} c={C.rose}>截切面（朝上）</T></>)}
        {panel(322, "③ 對稱波痕", "尖頂朝上", <>{[50, 80].map((yy, k) => <path key={k} d={`M2,${yy} ` + Array.from({ length: 6 }, (_, i) => `Q${i * 24 + 14},${yy + 14} ${i * 24 + 26},${yy}`).join(" ")} fill="none" stroke={INK} strokeWidth={1.5} />)}</>)}
        {panel(480, "④ 泥裂", "V 形往下尖滅", <><rect x={0} y={0} width={146} height={50} fill={C.gold} fillOpacity={0.3} /><rect x={0} y={50} width={146} height={80} fill="#8a6a4a" fillOpacity={0.3} />{[25, 72, 118].map((cx) => <polygon key={cx} points={`${cx - 9},50 ${cx + 9},50 ${cx},104`} fill={C.gold} fillOpacity={0.6} stroke={INK} />)}<T x={73} y={30} a="middle" s={10}>上層砂填入</T></>)}
      </svg>
    </Fig>
  );
}

/* ───────────── 濁流 vs 土石流 ───────────── */

export function TurbiditeFig() {
  const rnd = (i: number) => Math.abs(Math.sin(i * 3.71) * 4517.3) % 1;
  return (
    <Fig caption="左：濁流（turbidity current）沉積的濁積岩，每一次事件留下一層底粗頂細的粒級層理，一層一層重複。右：土石流（debris flow）沉積，顆粒由泥質基質的強度和浮力撐住，大石塊可以「浮」在基質中，完全沒有分選、也沒有粒級。" source="課堂投影片 Transport">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="濁積岩與土石流沉積">
        {[0, 1, 2].map((k) => Array.from({ length: 45 }, (_, i) => { const yy = 20 + k * 55 + rnd(i + k * 50) * 48; const r = 0.8 + ((yy - 20 - k * 55) / 48) * 3.6; return <circle key={`${k}-${i}`} cx={30 + rnd(i * 3 + k) * 220} cy={yy} r={r} fill={C.gold} stroke={INK} strokeWidth={0.4} />; }))}
        {[0, 1, 2, 3].map((k) => <line key={k} x1={20} x2={260} y1={18 + k * 55} y2={18 + k * 55} stroke={INK} strokeWidth={1.5} />)}
        <T x={140} y={196} a="middle" w={800}>濁積岩：重複的粒級層</T>
        <rect x={360} y={18} width={260} height={165} fill="#8a6a4a" fillOpacity={0.25} stroke={INK} />
        {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={375 + rnd(i + 99) * 230} cy={30 + rnd(i + 199) * 140} r={2 + rnd(i + 299) * 16} fill={C.gold} fillOpacity={0.7} stroke={INK} />)}
        <T x={490} y={196} a="middle" w={800}>土石流：基質支撐、無分選</T>
      </svg>
    </Fig>
  );
}

/* ───────────── 海進、海退 ───────────── */

export function TransgressionFig() {
  const col = (ox: number, seq: [string, string][], title: string, sub: string) => (
    <g>
      {seq.map(([n, c], i) => (
        <g key={n}>
          <rect x={ox} y={30 + i * 34} width={90} height={34} fill={c} fillOpacity={0.5} stroke={INK} />
          <T x={ox + 100} y={52 + i * 34} s={11.5}>{n}</T>
        </g>
      ))}
      <T x={ox + 45} y={18} a="middle" w={800}>{title}</T>
      <T x={ox + 45} y={186} a="middle" s={11}>{sub}</T>
    </g>
  );
  return (
    <Fig caption="Walther 定律：在連續沉積的地層中，垂直方向的岩相順序，等於當時水平方向相鄰的沉積環境。海進時海岸線往陸地推，同一地點從近岸砂變成離岸泥，地層往上變細；海退相反，往上變粗。海水面變化的原因：冰期（大陸冰川）、洋脊擴張速率（白堊紀擴張快、海水淹上大陸形成陸緣海，沉積白堊）、陸地升降（造山、均衡、地函柱加熱）。台灣卓蘭層的砂泥旋迴和米蘭科維奇週期（約 41 kyr 自轉軸傾角）對應。" source="Klein & Philpotts (2017) Fig. 12.27；Vaucher et al. (2021)；課堂投影片 Layering">
      <svg viewBox="0 0 640 196" className="ix-svg" role="img" aria-label="海進海退的地層序列">
        {col(60, [["頁岩（外海）", "#777"], ["粉砂岩", "#a88"], ["砂岩（近岸）", C.gold], ["礫岩（海灘）", C.orange]], "海進 transgression", "往上變細 fining upward")}
        {col(380, [["礫岩（海灘）", C.orange], ["砂岩（近岸）", C.gold], ["粉砂岩", "#a88"], ["頁岩（外海）", "#777"]], "海退 regression", "往上變粗 coarsening upward")}
      </svg>
    </Fig>
  );
}

/* ───────────── 成岩作用 ───────────── */

export function DiagenesisFig() {
  const g = (cx: number, cy: number, r: number, k: string) => <circle key={k} cx={cx} cy={cy} r={r} fill={C.gold} fillOpacity={0.55} stroke={INK} />;
  return (
    <Fig caption="成岩作用（diagenesis，約 150 °C 以下）把鬆散沉積物變成岩石（岩化 lithification）。① 壓密：顆粒重新排列、孔隙水被擠出；等大圓球隨機堆積的孔隙率約 33 %，海底黏土可高達 60–80 %，黏土片會轉成平行層面。② 膠結：孔隙水中的離子沉澱成膠結物（石英、方解石、氧化鐵），把顆粒黏在一起；石英膠結常在原顆粒外以相同結晶方向長出「次生加大」，中間留下一圈灰塵環。③ 壓溶：顆粒接觸點壓力大、溶解，物質移到壓力低的孔隙沉澱；在石灰岩中沿垂直最大壓應力的面形成縫合線（stylolite），不溶的黏土殘留在線上。" source="課堂投影片 Lithification">
      <svg viewBox="0 0 640 200" className="ix-svg" role="img" aria-label="壓密、膠結、壓溶">
        {[[40, 50], [80, 50], [120, 50], [60, 85], [100, 85], [40, 120], [80, 120], [120, 120]].map(([x, y], i) => g(x, y, 17, `a${i}`))}
        <T x={80} y={170} a="middle" w={800}>沉積時：孔隙多</T>
        {[[240, 60], [274, 60], [308, 60], [257, 90], [291, 90], [240, 120], [274, 120], [308, 120]].map(([x, y], i) => g(x, y, 17, `b${i}`))}
        <rect x={222} y={40} width={104} height={100} fill="var(--teal)" fillOpacity={0.25} />
        <T x={274} y={170} a="middle" w={800}>壓密 + 膠結</T>
        <T x={274} y={186} a="middle" s={11}>藍：膠結物填孔隙</T>
        <polygon points="420,40 470,40 482,88 410,88" fill={C.gold} fillOpacity={0.55} stroke={INK} />
        <polygon points="410,92 482,92 470,140 420,140" fill={C.gold} fillOpacity={0.55} stroke={INK} />
        <path d={Array.from({ length: 13 }, (_, i) => `${i ? "L" : "M"}${400 + i * 8},${90 + (i % 2 ? -5 : 5)}`).join("")} fill="none" stroke={C.rose} strokeWidth={2.5} />
        <T x={446} y={170} a="middle" w={800}>壓溶與縫合線</T>
        <T x={446} y={186} a="middle" s={11}>⊥ 最大壓應力</T>
        <T x={580} y={70} a="middle" s={11}>↓ σ1</T>
        <T x={580} y={130} a="middle" s={11}>↑ σ1</T>
      </svg>
    </Fig>
  );
}

/* ───────────── 砂岩分類 ───────────── */

export function SandstoneFig() {
  const A = [160, 20], B = [40, 220], Cc = [280, 220];
  const tp = (q: number, f: number, l: number) => [q * A[0] + f * B[0] + l * Cc[0], q * A[1] + f * B[1] + l * Cc[1]];
  const line = (p: number[], q: number[], k: string) => <line key={k} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke={INK} strokeWidth={1} />;
  return (
    <Fig caption="砂岩先看泥質基質多不多：基質 < 15 % 是淨砂岩（arenite），> 15 % 是雜砂岩（wacke，graywacke：深色、海相濁流、常有粒級層理和底痕，常輕度變質出板劈理）。淨砂岩再依顆粒的石英 Q、長石 F、岩屑 L 比例分：石英砂岩（> 90–95 % 石英，最成熟，被動大陸邊緣、沙漠）、長石砂岩（arkose，長石 > 25 %，多為粉紅色微斜長石，源自花崗岩、未成熟、沖積扇）、岩屑砂岩（岩屑 > 25 %，來自年輕造山帶的火山岩、低度變質岩）。" source="Klein & Philpotts (2017) Fig. 13.6；課堂投影片 Classification">
      <svg viewBox="0 0 640 250" className="ix-svg" role="img" aria-label="砂岩 QFL 分類">
        <polygon points={`${A} ${B} ${Cc}`} fill="var(--teal)" fillOpacity={0.08} stroke={INK} strokeWidth={2} />
        {line(tp(0.9, 0.1, 0), tp(0.9, 0, 0.1), "q")}
        {line(tp(0.75, 0.25, 0), tp(0.75, 0, 0.25), "s")}
        {line(tp(0.75, 0.125, 0.125), tp(0, 0.5, 0.5), "m")}
        <T x={A[0]} y={A[1] - 6} a="middle" w={800}>Q 石英</T>
        <T x={B[0] - 4} y={B[1] + 18} a="middle" w={800}>F 長石</T>
        <T x={Cc[0] + 4} y={Cc[1] + 18} a="middle" w={800}>L 岩屑</T>
        <T x={160} y={tp(0.95, 0.025, 0.025)[1] + 6} a="middle" s={9.5}>石英砂岩</T>
        <T x={110} y={180} a="middle" s={11.5} w={800}>長石砂岩</T>
        <T x={110} y={196} a="middle" s={10}>arkose</T>
        <T x={212} y={180} a="middle" s={11.5} w={800}>岩屑砂岩</T>
        <T x={212} y={196} a="middle" s={10}>lithic arenite</T>
        <rect x={360} y={40} width={250} height={60} fill={C.gold} fillOpacity={0.3} stroke={INK} />
        <T x={485} y={66} a="middle" w={800}>淨砂岩 arenite</T>
        <T x={485} y={84} a="middle" s={11}>泥質基質 &lt; 15 %（左邊三角形）</T>
        <rect x={360} y={120} width={250} height={60} fill="#8a6a4a" fillOpacity={0.35} stroke={INK} />
        <T x={485} y={146} a="middle" w={800}>雜砂岩 wacke</T>
        <T x={485} y={164} a="middle" s={11}>泥質基質 &gt; 15 %</T>
        <T x={485} y={210} a="middle" s={11}>基質＝同時沉積的細粒物；膠結物＝沉積後沉澱的礦物</T>
      </svg>
    </Fig>
  );
}

/* ───────────── 碳酸鹽岩 Dunham 分類 ───────────── */

export function DunhamFig() {
  const box = (x: number, n: string, s: string, c: string) => {
    const [zh, en] = n.split(" ");
    return (
      <g key={n}>
        <rect x={x} y={96} width={112} height={66} fill={c} fillOpacity={0.35} stroke={INK} />
        <T x={x + 56} y={116} a="middle" w={800} s={13}>{zh}</T>
        <T x={x + 56} y={132} a="middle" s={10.5}>{en}</T>
        <T x={x + 56} y={150} a="middle" s={10.5}>{s}</T>
      </g>
    );
  };
  return (
    <Fig caption="Dunham (1962) 碳酸鹽岩分類，看三件事：沉積時顆粒有沒有被生物黏結在一起？有沒有灰泥？是灰泥撐著顆粒還是顆粒互相支撐？灰泥越少代表水動能越高：顆粒岩（grainstone）沒有灰泥，形成於高能環境（可有交錯層理、丘狀交錯層理 HCS）；泥岩到泥粒岩形成於較平靜的環境，灰泥來自他化顆粒磨蝕、生物鑽孔和鈣質綠藻崩解。生物黏結岩（boundstone）包括珊瑚礁（現代只在赤道 ±30° 內，可當古緯度指標）和疊層石（藍綠菌黏住灰泥，最早的化石 3.5 Ga）。" source="Dunham (1962)；Klein & Philpotts (2017) Fig. 13.19">
      <svg viewBox="0 0 640 190" className="ix-svg" role="img" aria-label="Dunham 碳酸鹽岩分類">
        <rect x={10} y={14} width={480} height={30} fill="none" stroke={INK} />
        <T x={250} y={34} a="middle" w={800}>沉積時顆粒沒有被生物黏結</T>
        <rect x={10} y={54} width={240} height={30} fill="none" stroke={INK} />
        <T x={130} y={74} a="middle" s={11.5}>含灰泥・灰泥支撐</T>
        <rect x={250} y={54} width={240} height={30} fill="none" stroke={INK} />
        <T x={370} y={74} a="middle" s={11.5}>顆粒支撐</T>
        {box(10, "泥岩 mudstone", "顆粒 < 10 %", C.violet)}
        {box(130, "粒泥岩 wackestone", "顆粒 > 10 %", C.blue)}
        {box(250, "泥粒岩 packstone", "有灰泥", C.teal)}
        {box(370, "顆粒岩 grainstone", "無灰泥", C.gold)}
        {box(510, "黏結岩 boundstone", "生物黏結", C.green)}
        <T x={250} y={182} a="middle" s={11}>← 低能（平靜）　　水動能　　高能 →</T>
      </svg>
    </Fig>
  );
}

/* ───────────── 蒸發岩沉澱順序 ───────────── */

export function EvaporiteFig() {
  const s: [string, string, number, string][] = [
    ["① 方解石／霰石、白雲石", "最少、最不溶", 50, C.gold],
    ["② 石膏 → 硬石膏", "高溫、高鹽度利於硬石膏", 80, C.teal],
    ["③ 岩鹽 NaCl", "量最多", 90, C.blue],
    ["④ 鉀鹽 KCl 等鉀鎂鹽", "最易溶，最後才沉澱", 96, C.rose],
  ];
  const x = (v: number) => 220 + (v / 100) * 380;
  return (
    <Fig caption="海水蒸發時礦物沉澱的順序：越難溶的越早沉澱。碳酸鹽最先，接著石膏（溫度、鹽度高時是硬石膏），然後是量最多的岩鹽，最後是最易溶的鉀鹽（鉀石鹽 sylvite）。如果海水完全蒸乾，岩鹽占最多。乾燥氣候的鹽湖還會有硼砂等硼酸鹽。蒸發岩搬運少、常成層；岩鹽密度低（約 2.2），埋藏後會往上貫入形成鹽丘。橫軸是開始沉澱時海水已蒸發的比例（約略）。" source="Klein & Philpotts (2017) Fig. 12.10；課堂投影片 Sediments、Classification">
      <svg viewBox="0 0 640 170" className="ix-svg" role="img" aria-label="蒸發岩沉澱順序">
        {s.map(([n, d, v, c], i) => (
          <g key={n}>
            <rect x={x(v)} y={14 + i * 34} width={x(100) - x(v)} height={24} fill={c} fillOpacity={0.5} stroke={INK} />
            <T x={210} y={26 + i * 34} a="end" s={12} w={800}>{n}</T>
            <T x={210} y={40 + i * 34} a="end" s={10}>{d}</T>
          </g>
        ))}
        {[0, 50, 80, 90, 100].map((v) => <T key={v} x={x(v)} y={164} a="middle" s={10.5}>{v} %</T>)}
      </svg>
    </Fig>
  );
}

/* ───────────── 煤階與油氣窗 ───────────── */

export function CoalOilFig() {
  const coal: [string, string, string][] = [["泥炭 peat", "植物殘骸", C.green], ["褐煤 lignite", "低階", "#8a6a4a"], ["煙煤 bituminous", "細紋層；燭煤", "#555"], ["無煙煤 anthracite", "最高階：油脂光澤、貝殼狀斷口", "#222"]];
  const y = (km: number) => 20 + km * 28;
  return (
    <Fig caption="左：煤化作用。植物在氧化分解前就被埋藏，隨埋深（溫度、壓力）增加，水分和揮發份被趕出、含碳量升高：泥炭 → 褐煤 → 煙煤（成岩作用）→ 無煙煤（低度變質）→ 石墨。煤從志留紀（約 420 Ma）陸生植物出現後才有，石炭紀的大量埋藏降低了大氣 CO₂。右：油氣窗。黑色頁岩（源岩）中的油母質（kerogen）在約 60–120 °C（2–4 km）裂解成石油，100 °C 以上、3–6 km 變成天然氣，再深就只剩石墨；油氣往上遷移到孔隙度高的儲集岩，被不透水層蓋住才能保存。" source="課堂投影片 Sediments、Classification">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="煤階與油氣窗">
        <Marks />
        {coal.map(([n, d, c], i) => (
          <g key={n}>
            <rect x={20} y={20 + i * 46} width={36} height={36} fill={c} fillOpacity={0.6} stroke={INK} />
            <T x={66} y={36 + i * 46} w={800} s={12.5}>{n}</T>
            <T x={66} y={52 + i * 46} s={10.5}>{d}</T>
          </g>
        ))}
        <line x1={290} x2={290} y1={20} y2={200} stroke={INK} strokeWidth={2} markerEnd="url(#em-k)" />
        <T x={282} y={110} a="end" s={11}>埋深 ↓</T>
        {[0, 2, 4, 6].map((k) => <T key={k} x={360} y={y(k) + 4} a="end" s={10.5}>{k} km</T>)}
        <rect x={370} y={y(2)} width={120} height={y(4) - y(2)} fill={C.orange} fillOpacity={0.45} stroke={INK} />
        <T x={430} y={y(3) + 4} a="middle" w={800}>石油窗</T>
        <T x={556} y={y(2.5) + 4} s={10.5}>石油 60–120 °C</T>
        <rect x={420} y={y(3)} width={120} height={y(6) - y(3)} fill={C.blue} fillOpacity={0.3} stroke={INK} />
        <T x={480} y={y(5) + 4} a="middle" w={800}>天然氣</T>
        <T x={556} y={y(5.3) + 4} s={10.5}>天然氣 &gt; 100 °C</T>
        <T x={430} y={y(6.6)} a="middle" s={11}>更深 → 石墨</T>
      </svg>
    </Fig>
  );
}
