"use client";

import { Fig } from "./Figs";

// 地球化學各講的自繪圖（L3 的在 Figs.tsx）。
const INK = "currentColor";
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", violet: "#8a6fd1", blue: "#5b8bd9" };

function Marks() {
  return (
    <defs>
      {[
        ["gm-k", "currentColor"],
        ["gm-o", C.orange],
        ["gm-t", C.teal],
        ["gm-r", C.rose],
        ["gm-v", C.violet],
      ].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

/* ───────────── L1：太陽系元素豐度（Anders & Grevesse 1989，Si = 10⁶） ───────────── */

const SOLAR: [number, string, number][] = [
  [1, "H", 2.79e10], [2, "He", 2.72e9], [3, "Li", 57.1], [4, "Be", 0.73], [5, "B", 21.2], [6, "C", 1.01e7], [7, "N", 3.13e6], [8, "O", 2.38e7],
  [9, "F", 843], [10, "Ne", 3.44e6], [11, "Na", 5.74e4], [12, "Mg", 1.074e6], [13, "Al", 8.49e4], [14, "Si", 1.0e6], [15, "P", 1.04e4], [16, "S", 5.15e5],
  [17, "Cl", 5240], [18, "Ar", 1.01e5], [19, "K", 3770], [20, "Ca", 6.11e4], [21, "Sc", 34.2], [22, "Ti", 2400], [23, "V", 293], [24, "Cr", 1.35e4],
  [25, "Mn", 9550], [26, "Fe", 9.0e5], [27, "Co", 2250], [28, "Ni", 4.93e4], [29, "Cu", 522], [30, "Zn", 1260], [31, "Ga", 37.8], [32, "Ge", 119],
  [33, "As", 6.56], [34, "Se", 62.1], [35, "Br", 11.8], [36, "Kr", 45], [37, "Rb", 7.09], [38, "Sr", 23.5], [39, "Y", 4.64], [40, "Zr", 11.4],
  [41, "Nb", 0.698], [42, "Mo", 2.55], [44, "Ru", 1.86], [45, "Rh", 0.344], [46, "Pd", 1.39], [47, "Ag", 0.486], [48, "Cd", 1.61], [49, "In", 0.184],
  [50, "Sn", 3.82], [51, "Sb", 0.309], [52, "Te", 4.81], [53, "I", 0.9], [54, "Xe", 4.7], [55, "Cs", 0.372], [56, "Ba", 4.49], [57, "La", 0.446],
  [58, "Ce", 1.136], [59, "Pr", 0.1669], [60, "Nd", 0.8279], [62, "Sm", 0.2582], [63, "Eu", 0.0973], [64, "Gd", 0.33], [65, "Tb", 0.0603], [66, "Dy", 0.3942],
  [67, "Ho", 0.0889], [68, "Er", 0.2508], [69, "Tm", 0.0378], [70, "Yb", 0.2479], [71, "Lu", 0.0367], [72, "Hf", 0.154], [73, "Ta", 0.0207], [74, "W", 0.133],
  [75, "Re", 0.0517], [76, "Os", 0.675], [77, "Ir", 0.661], [78, "Pt", 1.34], [79, "Au", 0.187], [80, "Hg", 0.34], [81, "Tl", 0.184], [82, "Pb", 3.15],
  [83, "Bi", 0.144], [90, "Th", 0.0335], [92, "U", 0.009],
];

export function SolarAbundanceFig() {
  const W = 640, H = 300, L = 60, R = 14, T = 14, B = 36;
  const x = (z: number) => L + ((z - 0) / 93) * (W - L - R);
  const y = (lg: number) => T + ((11 - lg) / 14) * (H - T - B);
  // 缺號（Tc、Pm、Po–Ac、Pa）處斷開
  const segs: [number, number][][] = [];
  let cur: [number, number][] = [];
  SOLAR.forEach(([z, , a], i) => {
    if (i > 0 && z - SOLAR[i - 1][0] > 1) {
      segs.push(cur);
      cur = [];
    }
    cur.push([x(z), y(Math.log10(a))]);
  });
  segs.push(cur);
  const lab = (z: number) => SOLAR.find((s) => s[0] === z)!;
  const show = [1, 2, 6, 8, 14, 26, 28, 56, 82, 92];
  return (
    <Fig
      caption="太陽系的元素豐度（以 Si = 10⁶ 標準化，對數座標）。H、He 最多；Li、Be、B 掉進很深的谷；Fe 附近有一個峰；比 Fe 重的元素一路遞減，而且相鄰元素呈鋸齒（偶數原子序比奇數多）；Pb 附近有一個小峰。每一個特徵都對應一個核合成過程。"
      source="數據：Anders & Grevesse (1989)；課堂投影片 L1 p.28"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="太陽系元素豐度對原子序">
        {[-2, 0, 2, 4, 6, 8, 10].map((g) => (
          <g key={g}>
            <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke={INK} strokeOpacity={0.12} />
            <text x={L - 6} y={y(g) + 4} textAnchor="end" style={{ fontSize: 11 }}>{`10${["⁻²", "⁰", "²", "⁴", "⁶", "⁸", "¹⁰"][[-2, 0, 2, 4, 6, 8, 10].indexOf(g)]}`}</text>
          </g>
        ))}
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((z) => (
          <text key={z} x={x(z)} y={H - B + 16} textAnchor="middle" style={{ fontSize: 11 }}>{z}</text>
        ))}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 12 }}>原子序 Z</text>
        <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>豐度（Si = 10⁶）</text>
        {segs.map((s, i) => (
          <polyline key={i} points={s.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.orange} strokeWidth={1.6} />
        ))}
        {SOLAR.map(([z, , a]) => (
          <circle key={z} cx={x(z)} cy={y(Math.log10(a))} r={2.2} fill={C.orange} />
        ))}
        {show.map((z) => {
          const [, s, a] = lab(z);
          const yy = y(Math.log10(a));
          const below = z === 4 || z === 3 || z === 5;
          return (
            <text key={z} x={x(z) + (z <= 2 ? 6 : 0)} y={below ? yy + 15 : yy - 7} textAnchor={z <= 2 ? "start" : "middle"} style={{ fontSize: 11, fontWeight: 700 }}>
              {s}
            </text>
          );
        })}
        <text x={x(4) + 4} y={y(-1.6)} textAnchor="start" style={{ fontSize: 11, fontWeight: 700 }}>Li–Be–B 谷</text>
        <text x={x(26)} y={y(7.6)} textAnchor="middle" style={{ fontSize: 11 }}>Fe 峰</text>
        <text x={x(60)} y={y(2.2)} textAnchor="middle" style={{ fontSize: 11 }}>奇偶鋸齒</text>
        <text x={x(82)} y={y(1.6)} textAnchor="middle" style={{ fontSize: 11 }}>Pb 峰</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L1：CI 球粒隕石 vs 太陽光球（示意） ───────────── */

export function CISunFig() {
  const W = 420, H = 330, L = 50, R = 16, T = 16, B = 44;
  const lo = -2, hi = 11;
  const x = (g: number) => L + ((g - lo) / (hi - lo)) * (W - L - R);
  const y = (g: number) => T + ((hi - g) / (hi - lo)) * (H - T - B);
  const normal = [11, 12, 13, 14, 15, 16, 19, 20, 22, 24, 25, 26, 27, 28, 29, 30, 38, 40, 56, 57, 58, 63, 71];
  const pts = SOLAR.filter((s) => normal.includes(s[0])).map(([z, s, a], i) => {
    const g = Math.log10(a);
    return { z, s, cx: x(g + ((i % 3) - 1) * 0.08), cy: y(g - ((i % 2) - 0.5) * 0.12) };
  });
  // [符號, log CI, log 太陽]
  const outl: [string, number, number][] = [
    ["H", 6.7, 10.45],
    ["He", -0.2, 9.43],
    ["C", 6.0, 7.0],
    ["N", 4.9, 6.5],
    ["O", 6.9, 7.38],
    ["Li", 1.76, -0.4],
  ];
  return (
    <Fig
      caption="橫軸是 CI 碳質球粒隕石的豐度，縱軸是太陽光球（從光譜量得）的豐度。大部分元素落在 1:1 線上，所以 CI 隕石可以代表太陽系的平均組成。偏在線上方的是揮發性高、沒凝結進隕石的 H、He、C、N、O（惰性氣體 Ne、Ar 也是，偏離更多，圖上沒畫）；Li 在線下方，因為它在恆星內部被燒掉了。"
      source="數量級示意，依 Anders & Grevesse (1989)；課堂投影片 L1 p.27"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="CI 球粒隕石與太陽光球豐度比較" style={{ maxWidth: 460, margin: "0 auto" }}>
        <line x1={x(lo)} y1={y(lo)} x2={x(hi)} y2={y(hi)} stroke={INK} strokeDasharray="5 4" strokeOpacity={0.6} />
        <text x={x(9.4)} y={y(8.8)} style={{ fontSize: 11 }}>1:1</text>
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0, 2, 4, 6, 8, 10].map((g) => (
          <g key={g}>
            <text x={x(g)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{g}</text>
            <text x={L - 6} y={y(g) + 4} textAnchor="end" style={{ fontSize: 11 }}>{g}</text>
          </g>
        ))}
        <text x={(L + W) / 2} y={H - 8} textAnchor="middle" style={{ fontSize: 12 }}>log CI 隕石豐度</text>
        <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>log 太陽光球豐度</text>
        {pts.map((p) => (
          <circle key={p.z} cx={p.cx} cy={p.cy} r={3.2} fill={C.teal} />
        ))}
        {outl.map(([s, ci, sun]) => (
          <g key={s}>
            <circle cx={x(ci)} cy={y(sun)} r={4.2} fill={s === "Li" ? C.rose : C.orange} stroke={INK} strokeWidth={1} />
            <text x={x(ci) + 7} y={y(sun) + 4} style={{ fontSize: 12, fontWeight: 800 }}>{s}</text>
          </g>
        ))}
        <text x={x(2.2)} y={y(9.9)} style={{ fontSize: 11 }}>揮發性元素：太陽多</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L1：吸積溫度與離太陽距離（依投影片 p.44 的曲線重畫） ───────────── */

// 從投影片圖上讀出的點（AU, K），中間以 log–log 內插
const ACC: [number, number][] = [[0.2, 2050], [0.5, 1880], [0.9, 1640], [1.5, 1050], [2.5, 620], [5, 320], [10, 120], [15, 60], [20, 30]];
function accT(au: number) {
  if (au <= ACC[0][0]) return ACC[0][1];
  for (let i = 1; i < ACC.length; i++) {
    const [a1, t1] = ACC[i - 1], [a2, t2] = ACC[i];
    if (au <= a2) {
      const f = (Math.log(au) - Math.log(a1)) / (Math.log(a2) - Math.log(a1));
      return Math.exp(Math.log(t1) + f * (Math.log(t2) - Math.log(t1)));
    }
  }
  return ACC[ACC.length - 1][1];
}

export function AccretionTempFig() {
  const W = 600, H = 300, L = 56, R = 20, T = 40, B = 40;
  const x = (au: number) => L + (au / 21) * (W - L - R);
  const y = (k: number) => T + ((2200 - k) / 2200) * (H - T - B);
  const curve: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const au = 0.2 + (20 - 0.2) * (i / 200);
    curve.push(`${x(au)},${y(accT(au))}`);
  }
  const notes: [number, string][] = [[0.9, "金屬"], [1.6, "矽酸鹽、岩石物質"], [4.2, "水冰"], [9.5, "氨冰"]];
  const planets: [string, number][] = [["地球", 1], ["木星", 5.2], ["土星", 9.54], ["天王星", 19.2]];
  return (
    <Fig
      caption="太陽星雲吸積時，離太陽越遠溫度越低。地球軌道附近約 1600 K，只有金屬和矽酸鹽能凝結成固體，所以內行星是岩石；到木星以外，溫度低到水冰、氨冰都能凝結，可以吸積的固體多出好幾倍，行星長得大，重力抓得住氣體。"
      source="依課堂投影片 L1 p.44 的曲線重畫"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="吸積溫度對離太陽距離" style={{ maxWidth: 620, margin: "0 auto" }}>
        <Marks />
        <polyline points={curve.join(" ")} fill="none" stroke={C.teal} strokeWidth={3} />
        {notes.map(([au, s]) => (
          <g key={s}>
            <line x1={x(au) + 4} y1={y(accT(au)) - 2} x2={x(au) + 26} y2={y(accT(au)) - 18} stroke={INK} strokeOpacity={0.6} />
            <text x={x(au) + 29} y={y(accT(au)) - 20} style={{ fontSize: 12, fontWeight: 700 }}>{s}</text>
          </g>
        ))}
        {planets.map(([n, au]) => (
          <g key={n}>
            <text x={x(au)} y={16} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{n}</text>
            <line x1={x(au)} y1={21} x2={x(au)} y2={35} stroke={INK} strokeWidth={1.5} markerEnd="url(#gm-k)" />
          </g>
        ))}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0, 5, 10, 15, 20].map((au) => (
          <text key={au} x={x(au)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{au}</text>
        ))}
        {[0, 1000, 2000].map((k) => (
          <text key={k} x={L - 6} y={y(k) + 4} textAnchor="end" style={{ fontSize: 11 }}>{k}</text>
        ))}
        <text x={(L + W) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12 }}>離太陽距離（AU）</text>
        <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>溫度（K）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L1：核種表上的 s 與 r 路徑 ───────────── */

// 真實的穩定同位素（Z: 中子數 N）
const STABLE: Record<number, number[]> = {
  26: [28, 30, 31, 32],
  27: [32],
  28: [30, 32, 33, 34, 36],
  29: [34, 36],
  30: [34, 36, 37, 38, 40],
  31: [38, 40],
  32: [38, 40, 41, 42, 44],
  33: [42],
  34: [40, 42, 43, 44, 46, 48],
};
const SYM: Record<number, string> = { 26: "Fe", 27: "Co", 28: "Ni", 29: "Cu", 30: "Zn", 31: "Ga", 32: "Ge", 33: "As", 34: "Se" };

export function NuclideChartFig() {
  const n0 = 28, n1 = 48, z0 = 26, z1 = 34, cs = 26;
  const L = 52, T = 14;
  const cx = (n: number) => L + (n - n0) * cs;
  const cy = (z: number) => T + (z1 - z) * cs;
  const W = L + (n1 - n0 + 1) * cs + 12, H = T + (z1 - z0 + 1) * cs + 40;
  const c = (n: number, z: number) => ({ x: cx(n) + cs / 2, y: cy(z) + cs / 2 });
  // s 路徑：⁵⁶Fe 開始，捕獲（往右）遇到不穩定就 β⁻（往左上）
  const s: [number, number][] = [[30, 26], [31, 26], [32, 26], [33, 26], [32, 27], [33, 27], [32, 28], [33, 28], [34, 28], [35, 28], [34, 29], [35, 29], [34, 30]];
  // r 路徑：一口氣衝到 Z = 26、N = 44，再沿 A = 70 的對角線 β⁻ 衰變到 ⁷⁰Zn
  const r: [number, number][] = [[30, 26], [44, 26], [43, 27], [42, 28], [41, 29], [40, 30]];
  const path = (pts: [number, number][]) => pts.map(([n, z]) => `${c(n, z).x},${c(n, z).y}`).join(" ");
  return (
    <Fig
      caption="核種表的一角（Fe 到 Se）：橫軸中子數 N、縱軸質子數 Z，青綠色格子是真實的穩定同位素，它們排成一條「穩定谷」。s process（橘色）每吃一個中子往右一格，遇到不穩定核就 β⁻ 衰變往左上一格（Z + 1），所以貼著穩定谷前進。r process（紫色虛線）一下子吃很多中子，衝進富中子區，之後沿著等質量數的對角線一路 β⁻ 衰變，停在第一個穩定的核，例如 ⁷⁰Zn。"
      source="穩定同位素為實際資料；課堂投影片 L1 p.37–38"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="核種表上的 s 與 r 路徑">
        <Marks />
        {Array.from({ length: z1 - z0 + 1 }, (_, i) => z0 + i).map((z) => (
          <g key={z}>
            <text x={L - 6} y={cy(z) + cs / 2 + 4} textAnchor="end" style={{ fontSize: 11, fontWeight: 700 }}>{`${SYM[z]} ${z}`}</text>
            {Array.from({ length: n1 - n0 + 1 }, (_, j) => n0 + j).map((n) => {
              const st = STABLE[z]?.includes(n);
              return (
                <rect key={n} x={cx(n) + 1} y={cy(z) + 1} width={cs - 2} height={cs - 2} fill={st ? C.teal : "none"} fillOpacity={st ? 0.55 : 0} stroke={INK} strokeOpacity={st ? 0.7 : 0.15} />
              );
            })}
          </g>
        ))}
        {[28, 32, 36, 40, 44, 48].map((n) => (
          <text key={n} x={cx(n) + cs / 2} y={T + (z1 - z0 + 1) * cs + 14} textAnchor="middle" style={{ fontSize: 11 }}>{n}</text>
        ))}
        <text x={L + ((n1 - n0 + 1) * cs) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12 }}>中子數 N →</text>
        <polyline points={path(r)} fill="none" stroke={C.violet} strokeWidth={3} strokeDasharray="7 4" markerEnd="url(#gm-v)" />
        <polyline points={path(s)} fill="none" stroke={C.orange} strokeWidth={3.5} markerEnd="url(#gm-o)" />
        <circle cx={c(30, 26).x} cy={c(30, 26).y} r={6} fill={C.gold} stroke={INK} />
        <text x={c(30, 26).x} y={c(30, 26).y + 22} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>⁵⁶Fe</text>
        <text x={c(34, 30).x - 4} y={c(34, 30).y - 18} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>s</text>
        <text x={c(44, 26).x + 14} y={c(44, 26).y + 4} style={{ fontSize: 12, fontWeight: 800 }}>r</text>
        <text x={c(40, 30).x + 12} y={c(40, 30).y - 10} style={{ fontSize: 11, fontWeight: 800 }}>⁷⁰Zn</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L1：恆星生命週期 ───────────── */

export function StarLifeFig() {
  const box = (x: number, y: number, w: number, label: string, col: string) => (
    <g>
      <rect x={x} y={y} width={w} height={34} rx={4} fill={col} fillOpacity={0.18} stroke={col} strokeWidth={2} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{label}</text>
    </g>
  );
  const arr = (x1: number, y1: number, x2: number, y2: number) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" />;
  return (
    <Fig caption="恆星的一生由質量決定。低質量星（像太陽）最後變成白矮星；大質量星燒到 Fe 之後核心塌縮，爆成 Type II 超新星，留下中子星或黑洞。雙星系統裡的白矮星吸積物質到 1.4 倍太陽質量，會爆成 Type Ia 超新星。" source="課堂投影片 L1 p.22">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="恆星的生命週期">
        <Marks />
        {box(10, 98, 86, "分子雲", C.blue)}
        {arr(98, 115, 118, 115)}
        {box(120, 98, 80, "原恆星", C.gold)}
        {arr(200, 108, 236, 58)}
        {arr(200, 122, 236, 172)}
        <text x={214} y={66} textAnchor="end" style={{ fontSize: 11 }}>低質量</text>
        <text x={214} y={176} textAnchor="end" style={{ fontSize: 11 }}>大質量</text>
        {box(238, 40, 80, "主序星", C.gold)}
        {arr(318, 57, 336, 57)}
        {box(338, 40, 80, "紅巨星", C.orange)}
        {arr(418, 57, 436, 57)}
        {box(438, 40, 96, "行星狀星雲", C.teal)}
        {arr(534, 57, 552, 57)}
        {box(554, 40, 80, "白矮星", C.violet)}
        {box(238, 155, 80, "主序星", C.gold)}
        {arr(318, 172, 336, 172)}
        {box(338, 155, 88, "紅超巨星", C.rose)}
        {arr(426, 172, 444, 172)}
        {box(446, 155, 100, "Type II 超新星", C.rose)}
        {arr(546, 172, 564, 172)}
        <g>
          <rect x={566} y={147} width={68} height={50} rx={4} fill={C.navy} fillOpacity={0.3} stroke={INK} strokeWidth={2} />
          <text x={600} y={168} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>中子星</text>
          <text x={600} y={186} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>或黑洞</text>
        </g>
        <text x={586} y={94} textAnchor="end" style={{ fontSize: 11 }}>雙星吸積到 1.4 M☉</text>
        {arr(594, 76, 594, 104)}
        <text x={594} y={122} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>Type Ia 超新星</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L1：HR 圖（示意） ───────────── */

export function HRFig() {
  const W = 520, H = 320, L = 56, R = 16, T = 16, B = 44;
  // 橫軸：溫度由左（熱）到右（冷），對數；縱軸：光度（太陽 = 1），對數
  const x = (t: number) => L + ((Math.log10(40000) - Math.log10(t)) / (Math.log10(40000) - Math.log10(2500))) * (W - L - R);
  const y = (lum: number) => T + ((6 - Math.log10(lum)) / 10) * (H - T - B);
  const ms: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = 35000 * Math.pow(2800 / 35000, i / 40);
    const lum = Math.pow(t / 5800, 5.2);
    ms.push(`${x(t)},${y(lum)}`);
  }
  return (
    <Fig caption="HR 圖：橫軸是表面溫度（往右越冷），縱軸是光度。大部分恆星落在左上到右下的主序帶上；太陽在中間（約 5800 K）。右上是又冷又亮的紅巨星和超巨星，左下是又熱又暗的白矮星。B²FH 理論能解釋這些分群，這是它被接受的理由之一。" source="課堂投影片 L1 p.23、p.40">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="HR 圖" style={{ maxWidth: 560, margin: "0 auto" }}>
        <polyline points={ms.join(" ")} fill="none" stroke={C.gold} strokeWidth={14} strokeOpacity={0.35} strokeLinecap="round" />
        <polyline points={ms.join(" ")} fill="none" stroke={C.gold} strokeWidth={2} />
        <text x={x(14000)} y={y(30)} style={{ fontSize: 12, fontWeight: 800 }}>主序帶</text>
        <ellipse cx={x(4300)} cy={y(300)} rx={44} ry={24} fill={C.orange} fillOpacity={0.3} stroke={C.orange} strokeWidth={2} />
        <text x={x(4300)} y={y(300) + 4} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>紅巨星</text>
        <ellipse cx={x(6000)} cy={y(2e5)} rx={120} ry={14} fill={C.rose} fillOpacity={0.25} stroke={C.rose} strokeWidth={2} />
        <text x={x(6000)} y={y(2e5) + 4} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>超巨星</text>
        <ellipse cx={x(15000)} cy={y(0.003)} rx={40} ry={16} fill={C.violet} fillOpacity={0.3} stroke={C.violet} strokeWidth={2} />
        <text x={x(15000)} y={y(0.003) + 4} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>白矮星</text>
        <circle cx={x(5800)} cy={y(1)} r={6} fill={C.gold} stroke={INK} strokeWidth={1.5} />
        <text x={x(5800) + 10} y={y(1) + 18} style={{ fontSize: 12, fontWeight: 800 }}>太陽</text>
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[30000, 10000, 5000, 3000].map((t) => (
          <text key={t} x={x(t)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{t}</text>
        ))}
        {[1e-4, 1e-2, 1, 1e2, 1e4, 1e6].map((lum, i) => (
          <text key={i} x={L - 6} y={y(lum) + 4} textAnchor="end" style={{ fontSize: 11 }}>{["10⁻⁴", "10⁻²", "1", "10²", "10⁴", "10⁶"][i]}</text>
        ))}
        <text x={(L + W) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12 }}>表面溫度（K）← 熱　冷 →</text>
        <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>光度（太陽 = 1）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L2：第一游離能（實際數據，eV） ───────────── */

const IE: [number, string, number][] = [
  [1, "H", 13.6], [2, "He", 24.59], [3, "Li", 5.39], [4, "Be", 9.32], [5, "B", 8.3], [6, "C", 11.26], [7, "N", 14.53], [8, "O", 13.62], [9, "F", 17.42], [10, "Ne", 21.56],
  [11, "Na", 5.14], [12, "Mg", 7.65], [13, "Al", 5.99], [14, "Si", 8.15], [15, "P", 10.49], [16, "S", 10.36], [17, "Cl", 12.97], [18, "Ar", 15.76], [19, "K", 4.34], [20, "Ca", 6.11],
  [21, "Sc", 6.56], [22, "Ti", 6.83], [23, "V", 6.75], [24, "Cr", 6.77], [25, "Mn", 7.43], [26, "Fe", 7.9], [27, "Co", 7.88], [28, "Ni", 7.64], [29, "Cu", 7.73], [30, "Zn", 9.39],
  [31, "Ga", 6.0], [32, "Ge", 7.9], [33, "As", 9.79], [34, "Se", 9.75], [35, "Br", 11.81], [36, "Kr", 14.0], [37, "Rb", 4.18], [38, "Sr", 5.69], [39, "Y", 6.22], [40, "Zr", 6.63],
  [41, "Nb", 6.76], [42, "Mo", 7.09], [43, "Tc", 7.28], [44, "Ru", 7.36], [45, "Rh", 7.46], [46, "Pd", 8.34], [47, "Ag", 7.58], [48, "Cd", 8.99], [49, "In", 5.79], [50, "Sn", 7.34],
  [51, "Sb", 8.61], [52, "Te", 9.01], [53, "I", 10.45], [54, "Xe", 12.13], [55, "Cs", 3.89], [56, "Ba", 5.21],
];

export function IonizationFig() {
  const W = 640, H = 270, L = 46, R = 14, T = 14, B = 36;
  const x = (z: number) => L + ((z - 0.5) / 56) * (W - L - R);
  const y = (e: number) => T + ((26 - e) / 26) * (H - T - B);
  const noble = [2, 10, 18, 36, 54], alkali = [3, 11, 19, 37, 55];
  return (
    <Fig
      caption="第一游離能（拿走最外層一個電子所需的能量）對原子序。每一週期從左到右遞增，到惰性氣體（藍）最高，下一個鹼金屬（橘）突然掉到最低；同一族往下（例如 Li → Na → K → Rb → Cs）逐漸變小。游離能低的鹼金屬容易失去電子，是電子提供者；右邊的鹵素和氧則是電子接受者。"
      source="數據：NIST 原子游離能；課堂投影片 L2 p.22"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="第一游離能對原子序">
        {[0, 5, 10, 15, 20, 25].map((e) => (
          <g key={e}>
            <line x1={L} x2={W - R} y1={y(e)} y2={y(e)} stroke={INK} strokeOpacity={0.12} />
            <text x={L - 6} y={y(e) + 4} textAnchor="end" style={{ fontSize: 11 }}>{e}</text>
          </g>
        ))}
        <polyline points={IE.map(([z, , e]) => `${x(z)},${y(e)}`).join(" ")} fill="none" stroke={INK} strokeOpacity={0.5} strokeWidth={1.5} />
        {IE.map(([z, s, e]) => {
          const col = noble.includes(z) ? C.blue : alkali.includes(z) ? C.orange : C.teal;
          const lab = noble.includes(z) || alkali.includes(z);
          return (
            <g key={z}>
              <circle cx={x(z)} cy={y(e)} r={lab ? 4 : 2.6} fill={col} />
              {lab ? (
                <text x={x(z)} y={noble.includes(z) ? y(e) - 8 : y(e) + 16} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{s}</text>
              ) : null}
            </g>
          );
        })}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[10, 20, 30, 40, 50].map((z) => (
          <text key={z} x={x(z)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{z}</text>
        ))}
        <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 12 }}>原子序 Z</text>
        <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>第一游離能（eV）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L2：Onuma 圖（示意） ───────────── */

export function OnumaFig() {
  const W = 560, H = 330, L = 50, R = 20, T = 18, B = 44;
  const x = (r: number) => L + ((r - 0.3) / (1.7 - 0.3)) * (W - L - R);
  const y = (q: number) => T + ((5.6 - q) / 5.2) * (H - T - B);
  const cx = x(0.8), cy = y(2.4);
  const rings: [number, number, string][] = [
    [0.11, 0.55, "D > 1"],
    [0.2, 0.95, "0.5"],
    [0.3, 1.35, "0.2"],
    [0.42, 1.8, "0.1"],
    [0.62, 2.7, "0.01"],
  ];
  const el: [string, number, number][] = [
    ["Ni²⁺", 0.69, 2], ["Co²⁺", 0.745, 2], ["Mn²⁺", 0.83, 2], ["Mg²⁺", 0.72, 2], ["Fe²⁺", 0.78, 2], ["Ca²⁺", 1.0, 2],
    ["Cr³⁺", 0.615, 3], ["Sc³⁺", 0.745, 3], ["Lu³⁺", 0.86, 3], ["La³⁺", 1.03, 3],
    ["Zr⁴⁺", 0.72, 4], ["Th⁴⁺", 0.94, 4], ["Nb⁵⁺", 0.64, 5], ["Ta⁵⁺", 0.64, 5.25],
    ["K⁺", 1.38, 1], ["Rb⁺", 1.52, 1], ["Ba²⁺", 1.35, 2],
  ];
  const main = ["Mg²⁺", "Fe²⁺", "Ca²⁺"];
  // +2 那排太擠：標籤往下扇開、用引線連回點
  const fan: Record<string, number> = { "Ni²⁺": 0.56, "Mg²⁺": 0.655, "Co²⁺": 0.75, "Fe²⁺": 0.845, "Mn²⁺": 0.94 };
  return (
    <Fig
      caption="單斜輝石（cpx）的 Onuma 圖：橫軸是離子半徑，縱軸是電荷，橢圓是分配係數 D 的等值線，中心是 cpx 晶格位置原本放的主要元素（Mg、Fe、Ca）。越靠近中心越容易進入晶格（D 大，相容）：Ni、Co、Cr、Sc 在最內圈；半徑大的 K、Rb、Ba 和電荷高的 Nb、Ta、Th、Zr 都在外圈（D 很小，不相容）。REE 都是 +3，La 半徑大、離中心遠，Lu 比較小、比較近，所以 HREE 比 LREE 相容。"
      source="離子半徑依 Shannon (1976)；White (2013)；課堂投影片 L2 p.28"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="單斜輝石的 Onuma 圖" style={{ maxWidth: 600, margin: "0 auto" }}>
        {rings.slice().reverse().map(([rx, ry, lab], i) => (
          <g key={lab}>
            <ellipse cx={cx} cy={cy} rx={(rx * (W - L - R)) / 1.4} ry={(ry * (H - T - B)) / 5.2} fill={C.teal} fillOpacity={0.06 + i * 0.03} stroke={C.teal} strokeWidth={1.5} />
            <text x={cx + (rx * (W - L - R)) / 1.4 - 4} y={cy - 4} textAnchor="end" style={{ fontSize: 10.5, fontWeight: 700 }}>{lab}</text>
          </g>
        ))}
        {el.map(([s, r, q]) => (
          <g key={s}>
            <circle cx={x(r)} cy={y(q)} r={main.includes(s) ? 5 : 3.5} fill={main.includes(s) ? C.orange : INK} />
            {fan[s] === undefined ? (
              <text x={x(r) + 6} y={y(q) - 5} style={{ fontSize: 11, fontWeight: main.includes(s) ? 800 : 600 }}>{s}</text>
            ) : (
              <>
                <line x1={x(r)} y1={y(q) + 4} x2={x(fan[s])} y2={y(q) + 19} stroke={INK} strokeOpacity={0.45} strokeWidth={0.8} />
                <text x={x(fan[s])} y={y(q) + 30} textAnchor="middle" style={{ fontSize: 11, fontWeight: main.includes(s) ? 800 : 600 }}>{s}</text>
              </>
            )}
          </g>
        ))}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6].map((r) => (
          <text key={r} x={x(r)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{r.toFixed(1)}</text>
        ))}
        {[1, 2, 3, 4, 5].map((q) => (
          <text key={q} x={L - 8} y={y(q) + 4} textAnchor="end" style={{ fontSize: 11 }}>+{q}</text>
        ))}
        <text x={(L + W) / 2} y={H - 8} textAnchor="middle" style={{ fontSize: 12 }}>離子半徑（Å）</text>
        <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>電荷</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L2：REE（Sun & McDonough 1989 等標準值，ppm） ───────────── */

const REE = ["La", "Ce", "Pr", "Nd", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"];
const REE_Z = [57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71];
const CI_REE = [0.237, 0.613, 0.0928, 0.457, 0.148, 0.0563, 0.199, 0.0361, 0.246, 0.0546, 0.16, 0.0247, 0.161, 0.0246];
const NMORB = [2.5, 7.5, 1.32, 7.3, 2.63, 1.02, 3.68, 0.67, 4.55, 1.01, 2.97, 0.456, 3.05, 0.455];
const OIB = [37, 80, 9.7, 38.5, 10, 3.0, 7.62, 1.05, 5.6, 1.06, 2.62, 0.35, 2.16, 0.3];
const UCC = [30, 64, 7.1, 26, 4.5, 0.88, 3.8, 0.64, 3.5, 0.8, 2.3, 0.33, 2.2, 0.32];

function REEPlot({ series, lo, hi, ylab, w = 300 }: { series: { name: string; v: number[]; col: string }[]; lo: number; hi: number; ylab: string; w?: number }) {
  const W = w, H = 250, L = 46, R = 10, T = 12, B = 34;
  const x = (z: number) => L + ((z - 56.5) / 15) * (W - L - R);
  const y = (v: number) => T + ((Math.log10(hi) - Math.log10(v)) / (Math.log10(hi) - Math.log10(lo))) * (H - T - B);
  const ticks: number[] = [];
  for (let e = Math.ceil(Math.log10(lo)); e <= Math.floor(Math.log10(hi)); e++) ticks.push(Math.pow(10, e));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label={ylab}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={INK} strokeOpacity={0.12} />
          <text x={L - 5} y={y(t) + 4} textAnchor="end" style={{ fontSize: 10.5 }}>{t >= 1 ? t : t.toString()}</text>
        </g>
      ))}
      {series.map((s) => (
        <g key={s.name}>
          <polyline points={s.v.map((v, i) => `${x(REE_Z[i])},${y(v)}`).join(" ")} fill="none" stroke={s.col} strokeWidth={2.4} />
          {s.v.map((v, i) => (
            <circle key={i} cx={x(REE_Z[i])} cy={y(v)} r={2.8} fill={s.col} />
          ))}
        </g>
      ))}
      <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
      <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
      {REE.map((s, i) => (
        <text key={s} x={x(REE_Z[i])} y={H - B + 14} textAnchor="middle" style={{ fontSize: 9.5 }}>{s}</text>
      ))}
      <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 11 }}>{ylab}</text>
      {series.map((s, i) => (
        <g key={s.name}>
          <line x1={W - R - 104} x2={W - R - 88} y1={T + 10 + i * 15} y2={T + 10 + i * 15} stroke={s.col} strokeWidth={3} />
          <text x={W - R - 84} y={T + 14 + i * 15} style={{ fontSize: 10.5, fontWeight: 700 }}>{s.name}</text>
        </g>
      ))}
    </svg>
  );
}

export function REENormFig() {
  const norm = (v: number[]) => v.map((a, i) => a / CI_REE[i]);
  return (
    <Fig
      caption="第一張：CI 球粒隕石和上部大陸地殼的 REE 原始濃度（ppm），兩條線都是鋸齒狀，因為偶數原子序的元素本來就比相鄰的奇數多（L1 的 Oddo–Harkins 效應）。第二張：每個元素除以球粒隕石的值之後，鋸齒消失，球粒隕石自己變成一條水平線（= 1），地殼則是一條往右下斜的平滑線（LREE 富集），這才是地質過程造成的差異。"
      source="數據：Sun & McDonough (1989)、Taylor & McLennan (1985)；課堂投影片 L2 p.34"
    >
      <div className="fg-pair">
        <REEPlot lo={0.01} hi={100} ylab="濃度（ppm）" series={[{ name: "上部地殼", v: UCC, col: C.orange }, { name: "CI 球粒隕石", v: CI_REE, col: C.teal }]} />
        <REEPlot lo={0.5} hi={300} ylab="樣品 / 球粒隕石" series={[{ name: "上部地殼", v: norm(UCC), col: C.orange }, { name: "CI 球粒隕石", v: norm(CI_REE), col: C.teal }]} />
      </div>
    </Fig>
  );
}

export function MorbOibFig() {
  const norm = (v: number[]) => v.map((a, i) => a / CI_REE[i]);
  return (
    <Fig
      caption="球粒隕石標準化的 REE 型態。OIB（熱點玄武岩，例如夏威夷）強烈 LREE 富集：La 約 150 倍、Lu 約 12 倍，整條往右下斜。N-MORB（中洋脊玄武岩）LREE 虧損：La 只有約 10 倍，比 HREE（約 18 倍）還低，往左下彎。"
      source="數據：Sun & McDonough (1989) 的平均 OIB 與 N-MORB；課堂投影片 L2 p.35（HW1）"
    >
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <REEPlot w={420} lo={1} hi={300} ylab="樣品 / 球粒隕石" series={[{ name: "OIB", v: norm(OIB), col: C.orange }, { name: "N-MORB", v: norm(NMORB), col: C.blue }]} />
      </div>
    </Fig>
  );
}

/* ───────────── L4：ln K 對 1/T 的切線（示意） ───────────── */

export function VantHoffTangentFig() {
  const W = 560, H = 300, L = 44, R = 16, T = 16, B = 44;
  const x = (u: number) => L + (u / 3.5) * (W - L - R);
  const lo = -12.3, hi = -8.6;
  const y = (v: number) => T + ((hi - v) / (hi - lo)) * (H - T - B);
  const f = (u: number, shift: number) => -9.6 + shift - 0.9 * (u - 2.85) ** 2;
  const curve = (shift: number) => {
    const a: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const u = 1.7 + (1.7 * i) / 60;
      a.push(`${x(u)},${y(f(u, shift))}`);
    }
    return a.join(" ");
  };
  const u0 = 2.4, v0 = f(u0, 0.5), m = -1.8 * (u0 - 2.85);
  const icpt = v0 - m * u0;
  return (
    <Fig
      caption="真實的 ln K 對 1/T 常常是彎的（ΔH 本身會隨溫度變），這時在想知道的溫度畫切線：切線斜率 = −ΔH°/R，延伸到 1/T = 0（溫度無限高）的截距 = ΔS°/R。左半邊溫度高、右半邊溫度低；這個例子在高壓時整條曲線往上，表示加壓讓 K 變大（ΔV° < 0）。"
      source="White (2013) Fig. 3.17（重晶石溶解，after Blount 1977）；課堂投影片 L4 p.17。曲線形狀為示意，未標實際數值"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="ln K 對 1/T 與切線" style={{ maxWidth: 620, margin: "0 auto" }}>
        <Marks />
        <polyline points={curve(0)} fill="none" stroke={C.teal} strokeWidth={2.5} />
        <polyline points={curve(0.5)} fill="none" stroke={C.orange} strokeWidth={2.5} />
        <text x={x(3.42)} y={y(f(3.4, 0)) + 16} textAnchor="end" style={{ fontSize: 11, fontWeight: 700 }}>低壓</text>
        <text x={x(3.42)} y={y(f(3.4, 0.5)) - 8} textAnchor="end" style={{ fontSize: 11, fontWeight: 700 }}>高壓</text>
        <line x1={x(0)} y1={y(icpt)} x2={x(3.1)} y2={y(icpt + m * 3.1)} stroke={INK} strokeWidth={1.6} strokeDasharray="7 5" />
        <circle cx={x(u0)} cy={y(v0)} r={5} fill={C.gold} stroke={INK} />
        <circle cx={x(0)} cy={y(icpt)} r={5} fill={C.violet} stroke={INK} />
        <text x={x(0) + 10} y={y(icpt) + 18} style={{ fontSize: 12, fontWeight: 700 }}>截距 = ΔS°/R</text>
        <text x={x(1.2)} y={y(icpt + m * 1.2) - 12} textAnchor="middle" transform={`rotate(${(-Math.atan((m * (H - T - B)) / (hi - lo) / ((W - L - R) / 3.5)) * 180) / Math.PI} ${x(1.2)} ${y(icpt + m * 1.2) - 12})`} style={{ fontSize: 12, fontWeight: 700 }}>
          切線斜率 = −ΔH°/R
        </text>
        <text x={x(u0) - 12} y={y(v0) - 12} textAnchor="end" style={{ fontSize: 11 }}>在這個溫度畫切線</text>
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0, 1, 2, 3].map((u) => (
          <text key={u} x={x(u)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{u}</text>
        ))}
        <text x={(L + W) / 2} y={H - 8} textAnchor="middle" style={{ fontSize: 12 }}>1/T（×10⁻³ K⁻¹）　← 高溫　低溫 →</text>
        <text x={16} y={(T + H - B) / 2} transform={`rotate(-90 16 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>ln K</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L4：與鎂橄欖石共存的 opx 的 Al 含量（示意） ───────────── */

export function OpxAlFig() {
  const W = 560, H = 320, L = 50, R = 16, T = 14, B = 44;
  const x = (t: number) => L + ((t - 300) / 1350) * (W - L - R);
  const y = (p: number) => T + ((3 - p) / 3) * (H - T - B);
  const ga = (t: number) => 1.55 + 0.7 * ((t - 850) / 500) ** 2;
  const an = (t: number) => 0.88 * Math.pow(Math.max(0, (t - 430) / 870), 1.15);
  const path = (fn: (t: number) => number, a: number, b: number) => {
    const s: string[] = [];
    for (let i = 0; i <= 50; i++) {
      const t = a + ((b - a) * i) / 50;
      s.push(`${x(t)},${y(fn(t))}`);
    }
    return s.join(" ");
  };
  const sol: [number, number][] = [[1255, 0], [1285, 0.55], [1300, 0.88], [1380, 1.5], [1455, 2.2], [1520, 3]];
  // Sp 區的等值線：從 Fo+An 的邊界（或 P = 0）往上畫到 Fo+Ga 的邊界，稍往右傾
  const iso: [number, number][] = [[2, 480], [4, 600], [6, 700], [8, 800], [10, 900], [12, 1000], [14, 1100], [16, 1200]];
  const isoLine = (t0: number) => {
    const p0 = an(t0);
    let p1 = p0;
    let t1 = t0;
    for (let i = 0; i < 400; i++) {
      p1 += 0.01;
      t1 = t0 + 40 * (p1 - p0);
      if (p1 >= ga(t1)) break;
    }
    return { p0, t1, p1 };
  };
  return (
    <Fig
      caption="與鎂橄欖石（Fo）共存的斜方輝石（opx）的 Al 含量。依共存的含鋁礦物分成三區：斜長石（An，低壓）、尖晶石（Sp，中壓）、石榴子石（Ga，高壓）。尖晶石區的等值線幾乎是直的，表示 opx 的 Al 主要由溫度決定，溫度越高 Al 越多；斜長石區的等值線很平，Al 同時受壓力影響。量出 opx 的 Al 含量，再配合共存礦物，就能估 P–T。"
      source="White (2013) Fig. 4.15（after Gasparik 1984）；課堂投影片 L4 p.25。相界與等值線位置為示意"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="opx 的 Al 含量等值線" style={{ maxWidth: 620, margin: "0 auto" }}>
        {iso.map(([a, t0]) => {
          const { p0, t1, p1 } = isoLine(t0);
          return (
            <g key={a}>
              <line x1={x(t0)} y1={y(p0)} x2={x(t1)} y2={y(p1)} stroke={C.rose} strokeWidth={1.3} />
              <text x={x(t0 + 40 * 0.35) - 3} y={y(p0 + 0.35) + 4} textAnchor="end" style={{ fontSize: 10.5, fill: C.rose, fontWeight: 700 }}>{a}</text>
            </g>
          );
        })}
        {[0.12, 0.26, 0.42].map((d, i) => (
          <polyline key={i} points={path((t) => Math.max(0, an(t) - d + 0.00025 * (t - 900)), 700 + i * 120, 1270)} fill="none" stroke={C.rose} strokeWidth={1.3} />
        ))}
        <polyline points={path(ga, 330, 1470)} fill="none" stroke={INK} strokeWidth={2.4} />
        <polyline points={path(an, 430, 1300)} fill="none" stroke={INK} strokeWidth={2.4} />
        <polyline points={sol.map(([t, p]) => `${x(t)},${y(p)}`).join(" ")} fill="none" stroke={INK} strokeWidth={2.4} />
        <text x={x(850)} y={y(2.45)} textAnchor="middle" style={{ fontWeight: 800 }}>Fo + Ga（石榴子石）</text>
        <text x={x(640)} y={y(0.95)} textAnchor="middle" style={{ fontWeight: 800 }}>Fo + Sp（尖晶石）</text>
        <text x={x(1070)} y={y(0.12)} textAnchor="middle" style={{ fontWeight: 800 }}>Fo + An（斜長石）</text>
        <text x={x(1500)} y={y(0.6)} textAnchor="middle" style={{ fontWeight: 800 }}>晶體 +</text>
        <text x={x(1500)} y={y(0.6) + 16} textAnchor="middle" style={{ fontWeight: 800 }}>熔體</text>
        <text x={x(1215)} y={y(1.42)} textAnchor="middle" style={{ fontSize: 11, fill: C.rose, fontWeight: 700 }}>opx 的 Al（wt%）</text>
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[400, 600, 800, 1000, 1200, 1400, 1600].map((t) => (
          <text key={t} x={x(t)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{t}</text>
        ))}
        {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((p) => (
          <text key={p} x={L - 6} y={y(p) + 4} textAnchor="end" style={{ fontSize: 11 }}>{p}</text>
        ))}
        <text x={(L + W) / 2} y={H - 8} textAnchor="middle" style={{ fontSize: 12 }}>溫度（°C）</text>
        <text x={16} y={(T + H - B) / 2} transform={`rotate(-90 16 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>壓力（GPa）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L4：熱力學 vs 動力學（能量障壁） ───────────── */

export function EnergyBarrierFig() {
  const prof = "M20,110 L80,110 C120,110 125,40 160,40 C195,40 200,175 240,175 L300,175";
  const mb = (e: number, kt: number) => Math.sqrt(e) * Math.exp(-e / kt);
  const ex = (e: number) => 360 + e * 26; // e 0..10
  const dist = (kt: number, from = 0, to = 10) => {
    const a: string[] = [];
    let mx = 0;
    for (let i = 0; i <= 100; i++) mx = Math.max(mx, mb((10 * i) / 100, 1));
    for (let i = 0; i <= 100; i++) {
      const e = from + ((to - from) * i) / 100;
      a.push(`${ex(e)},${200 - (mb(e, kt) / mx) * 120}`);
    }
    return a;
  };
  const ea = 5;
  const tail = (kt: number) => [`${ex(ea)},200`, ...dist(kt, ea, 10), `${ex(10)},200`].join(" ");
  return (
    <Fig caption="左：熱力學只比較起點和終點的高低（ΔG），決定反應往哪邊走；動力學看中間的山有多高（活化能 Eₐ），決定走得多快。右：分子的能量有一個分布，只有能量超過 Eₐ 的（塗色部分）才翻得過山。溫度升高，分布往高能量拉長，超過 Eₐ 的比例急遽增加，所以速率隨溫度指數上升。" source="課堂投影片 L4 p.29–32、p.35">
      <svg viewBox="0 0 640 240" className="ix-svg" role="img" aria-label="能量障壁與能量分布">
        <Marks />
        <path d={prof} fill="none" stroke={INK} strokeWidth={3} />
        <text x={45} y={100} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>反應物</text>
        <text x={275} y={165} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>產物</text>
        <line x1={95} y1={110} x2={95} y2={44} stroke={C.orange} strokeWidth={2} markerEnd="url(#gm-o)" />
        <line x1={95} y1={40} x2={160} y2={40} stroke={C.orange} strokeWidth={1} strokeDasharray="3 3" />
        <text x={88} y={80} textAnchor="end" style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>Eₐ</text>
        <line x1={80} y1={110} x2={215} y2={110} stroke={INK} strokeOpacity={0.4} strokeDasharray="3 3" />
        <line x1={215} y1={110} x2={215} y2={171} stroke={C.teal} strokeWidth={2} markerEnd="url(#gm-t)" />
        <text x={222} y={145} style={{ fontSize: 12, fontWeight: 800, fill: C.teal }}>ΔG</text>
        <text x={160} y={222} textAnchor="middle" style={{ fontSize: 12 }}>反應進行 →</text>
        <text x={160} y={20} textAnchor="middle" style={{ fontSize: 11 }}>動力學：山多高？　熱力學：高低差多少？</text>
        {/* 右：能量分布 */}
        <polygon points={tail(2)} fill={C.orange} fillOpacity={0.3} />
        <polygon points={tail(1)} fill={C.teal} fillOpacity={0.45} />
        <polyline points={dist(1).join(" ")} fill="none" stroke={C.teal} strokeWidth={2.5} />
        <polyline points={dist(2).join(" ")} fill="none" stroke={C.orange} strokeWidth={2.5} />
        <line x1={ex(ea)} x2={ex(ea)} y1={60} y2={200} stroke={INK} strokeDasharray="4 3" />
        <text x={ex(ea) + 4} y={70} style={{ fontSize: 12, fontWeight: 800 }}>Eₐ</text>
        <line x1={ex(0)} x2={ex(10)} y1={200} y2={200} stroke={INK} strokeWidth={1.5} />
        <line x1={ex(0)} x2={ex(0)} y1={60} y2={200} stroke={INK} strokeWidth={1.5} />
        <text x={ex(5)} y={222} textAnchor="middle" style={{ fontSize: 12 }}>分子的能量 →</text>
        <text x={ex(1.8)} y={120} style={{ fontSize: 11, fontWeight: 700, fill: C.teal }}>低溫</text>
        <text x={ex(3.5)} y={84} style={{ fontSize: 11, fontWeight: 700, fill: C.orange }}>高溫</text>
        <text x={ex(7.4)} y={182} textAnchor="middle" style={{ fontSize: 10.5 }}>翻得過山的分子</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L4：碰撞截面 ───────────── */

export function CollisionFig() {
  const dots: [number, number][] = [[190, 70], [250, 112], [300, 88], [360, 128], [420, 96], [470, 60], [520, 118], [230, 160], [330, 40], [400, 170], [560, 150], [140, 140], [500, 30], [280, 190]];
  const inCyl = (px: number, py: number) => px > 110 && px < 540 && Math.abs(py - 100) < 34;
  return (
    <Fig caption="N 原子以速度 v 前進，時間 t 內掃過一個半徑 r = r(N) + r(O₂)、長度 v·t 的圓柱。中心落在圓柱裡的 O₂ 分子（橘色）會被撞到，外面的不會。所以碰撞次數 ∝ 圓柱體積 × 對方的濃度：濃度加倍，碰撞次數加倍，這就是速率和濃度成正比的來源。" source="White (2013) Ch. 5；課堂投影片 L4 p.33">
      <svg viewBox="0 0 640 220" className="ix-svg" role="img" aria-label="碰撞截面圓柱">
        <Marks />
        <path d="M110,66 L540,66 M110,134 L540,134" stroke={INK} strokeWidth={1.8} />
        <ellipse cx={110} cy={100} rx={14} ry={34} fill={C.gold} fillOpacity={0.15} stroke={INK} strokeWidth={1.8} />
        <ellipse cx={540} cy={100} rx={14} ry={34} fill="none" stroke={INK} strokeWidth={1.8} strokeDasharray="4 3" />
        <circle cx={110} cy={100} r={13} fill={C.teal} stroke={INK} strokeWidth={1.5} />
        <text x={110} y={104} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>N</text>
        <line x1={130} y1={100} x2={200} y2={100} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#gm-t)" />
        <text x={165} y={92} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>v</text>
        <line x1={78} y1={100} x2={78} y2={68} stroke={INK} strokeWidth={1.3} markerEnd="url(#gm-k)" />
        <text x={14} y={56} style={{ fontSize: 11 }}>r = r(N) + r(O₂)</text>
        <line x1={110} y1={208} x2={540} y2={208} stroke={INK} strokeWidth={1.3} markerEnd="url(#gm-k)" markerStart="url(#gm-k)" />
        <text x={325} y={202} textAnchor="middle" style={{ fontSize: 12 }}>長度 = v · t</text>
        {dots.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={7} fill={inCyl(px, py) ? C.orange : "none"} stroke={inCyl(px, py) ? INK : INK} strokeOpacity={inCyl(px, py) ? 1 : 0.55} strokeWidth={1.3} />
        ))}
        <circle cx={566} cy={56} r={6} fill={C.orange} stroke={INK} strokeWidth={1.2} />
        <text x={577} y={60} style={{ fontSize: 11 }}>會被撞</text>
        <circle cx={566} cy={76} r={6} fill="none" stroke={INK} strokeOpacity={0.55} strokeWidth={1.2} />
        <text x={577} y={80} style={{ fontSize: 11 }}>不會</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L4：穩態 ≠ 平衡 ───────────── */

export function SteadyStateFig() {
  return (
    <Fig caption="左：平衡。正反應和逆反應一直在發生，但速率相等，沒有淨變化，而且系統沒有和外界交換物質。右：穩態。湖的水位不變，但那是因為流入 = 流出，水一直在流過；把河流截斷，水位就會變。平衡一定是穩態，穩態不一定是平衡。" source="課堂投影片 L4 p.37–38">
      <svg viewBox="0 0 640 210" className="ix-svg" role="img" aria-label="平衡與穩態">
        <Marks />
        <rect x={40} y={40} width={220} height={120} rx={8} fill={C.teal} fillOpacity={0.08} stroke={INK} strokeWidth={2.5} />
        <text x={90} y={108} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800 }}>A</text>
        <text x={210} y={108} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800 }}>B</text>
        <line x1={112} y1={92} x2={186} y2={92} stroke={C.orange} strokeWidth={2.5} markerEnd="url(#gm-o)" />
        <line x1={186} y1={114} x2={112} y2={114} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#gm-t)" />
        <text x={150} y={82} textAnchor="middle" style={{ fontSize: 11 }}>正反應 k₊[A]</text>
        <text x={150} y={134} textAnchor="middle" style={{ fontSize: 11 }}>逆反應 k₋[B]</text>
        <text x={150} y={185} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>平衡：正 = 逆，封閉</text>
        {/* 湖 */}
        <path d="M380,90 L590,90 L560,160 L410,160 Z" fill={C.teal} fillOpacity={0.3} stroke={INK} strokeWidth={2.5} />
        <line x1={380} y1={90} x2={590} y2={90} stroke={C.teal} strokeWidth={3} />
        <text x={485} y={130} textAnchor="middle" style={{ fontSize: 12, fontWeight: 700 }}>水位不變</text>
        <line x1={320} y1={70} x2={392} y2={88} stroke={C.orange} strokeWidth={3} markerEnd="url(#gm-o)" />
        <text x={330} y={60} style={{ fontSize: 11 }}>流入 10</text>
        <line x1={580} y1={92} x2={630} y2={70} stroke={C.orange} strokeWidth={3} markerEnd="url(#gm-o)" />
        <text x={600} y={60} textAnchor="middle" style={{ fontSize: 11 }}>流出 10</text>
        <text x={485} y={185} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>穩態：流入 = 流出，開放</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L5：緩衝強度（封閉碳酸系統，C_T = 10 mM） ───────────── */

export function BufferFig() {
  const W = 560, H = 280, L = 52, R = 16, T = 14, B = 44;
  const x = (p: number) => L + ((p - 2) / 11) * (W - L - R);
  const lo = -5, hi = 0;
  const y = (v: number) => T + ((hi - Math.max(lo, Math.min(hi, v))) / (hi - lo)) * (H - T - B);
  const ct = 0.01, k1 = Math.pow(10, -6.35), k2 = Math.pow(10, -10.33);
  const beta = (p: number) => {
    const h = Math.pow(10, -p), d = h * h + k1 * h + k1 * k2;
    const a0 = (h * h) / d, a1 = (k1 * h) / d, a2 = (k1 * k2) / d;
    return 2.303 * (h + Math.pow(10, p - 14) + ct * (a0 * a1 + 4 * a0 * a2 + a1 * a2));
  };
  const pts: string[] = [];
  for (let i = 0; i <= 220; i++) {
    const p = 2 + (11 * i) / 220;
    pts.push(`${x(p)},${y(Math.log10(beta(p)))}`);
  }
  const marks: [number, string, boolean][] = [[6.35, "pK₁", true], [10.33, "pK₂", true], [4.2, "CO₂ 當量點", false], [8.34, "HCO₃⁻ 當量點", false]];
  return (
    <Fig caption="封閉碳酸系統（C_T = 10 mM）的緩衝強度 β 對 pH（對數座標）。β 在 pH = pK₁、pK₂ 最大，因為那裡兩種物種一樣多，加進來的酸或鹼都有對象可以中和；在當量點最小，那裡幾乎只有一種物種，pH 很容易被推動。pH 很低或很高時 β 又變大，是 H⁺、OH⁻ 本身多到能緩衝。" source="課堂投影片 L5 p.27–28；用 K₁、K₂ 計算">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="緩衝強度對 pH" style={{ maxWidth: 620, margin: "0 auto" }}>
        {[0, -1, -2, -3, -4, -5].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={INK} strokeOpacity={0.1} />
            <text x={L - 6} y={y(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v}</text>
          </g>
        ))}
        {marks.map(([p, lab, mx]) => (
          <g key={lab}>
            <line x1={x(p)} x2={x(p)} y1={T} y2={H - B} stroke={mx ? C.orange : C.teal} strokeDasharray="4 3" strokeOpacity={0.8} />
            <text x={x(p) + 4} y={mx ? T + 12 : H - B - 8} style={{ fontSize: 11, fontWeight: 700, fill: mx ? C.orange : C.teal }}>{lab}</text>
          </g>
        ))}
        <polyline points={pts.join(" ")} fill="none" stroke={INK} strokeWidth={2.6} />
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[2, 4, 6, 8, 10, 12].map((p) => (
          <text key={p} x={x(p)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{p}</text>
        ))}
        <text x={(L + W) / 2} y={H - 8} textAnchor="middle" style={{ fontSize: 12 }}>pH</text>
        <text x={16} y={(T + H - B) / 2} transform={`rotate(-90 16 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>log β（eq/L 每 pH）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L5：離子勢（White Table 6.3 的 Z/r） ───────────── */

const IP: [string, number, number][] = [
  ["Cs", 1, 0.6], ["Rb", 1, 0.68], ["K", 1, 0.75], ["Na", 1, 1.0], ["Li", 1, 1.5],
  ["Ba", 2, 1.5], ["Sr", 2, 1.8], ["Ca", 2, 2.0], ["Mn", 2, 2.5], ["Fe²", 2, 2.7], ["Mg", 2, 3.0],
  ["La", 3, 2.6], ["Y", 3, 3.3], ["Lu", 3, 3.5], ["Sc", 3, 3.7], ["Fe³", 3, 4.7], ["Al", 3, 5.9], ["B", 3, 13],
  ["Th", 4, 3.9], ["Ce⁴", 4, 4.3], ["Zr", 4, 5.1], ["Ti", 4, 5.9], ["Mn⁴", 4, 6.7], ["Si", 4, 9.5], ["C", 4, 25],
  ["Nb", 5, 7.5], ["P", 5, 14], ["N", 5, 38], ["Mo", 6, 9.7], ["S", 6, 20],
];

export function IonicPotentialFig() {
  const W = 560, H = 320, L = 46, R = 16, T = 14, B = 44;
  const x = (r: number) => L + (r / 1.8) * (W - L - R);
  const y = (z: number) => T + ((6.6 - z) / 6.6) * (H - T - B);
  const lineAt = (ip: number) => {
    const zmax = Math.min(6.6, ip * 1.8);
    return { x2: x(zmax / ip), y2: y(zmax) };
  };
  const l3 = lineAt(3), l9 = lineAt(9);
  const col = (ip: number) => (ip <= 3 ? C.teal : ip < 9 ? C.orange : C.violet);
  const label = (s: string) => s.replace("Fe²", "Fe²⁺").replace("Fe³", "Fe³⁺");
  const below = ["Lu", "Fe²", "Ce⁴"];
  return (
    <Fig caption="橫軸是離子半徑 r，縱軸是電荷 Z，所以通過原點的直線就是固定的離子勢 Z/r。低離子勢（藍綠，左下到右邊）：電荷小、半徑大，在水中是水合陽離子，易溶。中離子勢（橘）：水解成氫氧化物，最難溶，Fe³⁺、Al³⁺、Ti⁴⁺、Zr⁴⁺ 都在這裡，所以它們留在風化殘餘的土壤裡。高離子勢（紫，靠縱軸）：小而高電荷，和 O 形成共價的含氧陰離子（CO₃²⁻、NO₃⁻、SO₄²⁻、PO₄³⁻），又變得易溶。分界約在 Z/r ≈ 3 和 ≈ 9（投影片寫中間是 ~4–10，邊界是大概的）。" source="Z/r 數值依 White (2013) Table 6.3；課堂投影片 L5 p.34">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="離子勢圖" style={{ maxWidth: 620, margin: "0 auto" }}>
        <line x1={x(0)} y1={y(0)} x2={l3.x2} y2={l3.y2} stroke={INK} strokeDasharray="5 4" strokeOpacity={0.6} />
        <line x1={x(0)} y1={y(0)} x2={l9.x2} y2={l9.y2} stroke={INK} strokeDasharray="5 4" strokeOpacity={0.6} />
        <text x={x(1.5)} y={y(4.5) - 6} textAnchor="end" style={{ fontSize: 10.5 }}>Z/r = 3</text>
        <text x={l9.x2 + 4} y={l9.y2 + 12} style={{ fontSize: 10.5 }}>Z/r = 9</text>
        <text x={x(1.25)} y={y(0.45)} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: C.teal }}>水合陽離子：易溶</text>
        <text x={x(1.15)} y={y(5.6)} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>氫氧化物：難溶</text>
        <text x={x(0.17)} y={y(6.35)} textAnchor="start" style={{ fontSize: 12, fontWeight: 800, fill: C.violet }}>含氧陰離子：易溶</text>
        {IP.map(([s, z, ip]) => {
          const r = z / ip;
          return (
            <g key={s}>
              <circle cx={x(r)} cy={y(z)} r={4.5} fill={col(ip)} stroke={INK} strokeWidth={1} />
              <text x={x(r)} y={below.includes(s) ? y(z) + 16 : y(z) - 7} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700 }}>{label(s)}</text>
            </g>
          );
        })}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0, 0.4, 0.8, 1.2, 1.6].map((r) => (
          <text key={r} x={x(r)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{r}</text>
        ))}
        {[1, 2, 3, 4, 5, 6].map((z) => (
          <text key={z} x={L - 6} y={y(z) + 4} textAnchor="end" style={{ fontSize: 11 }}>+{z}</text>
        ))}
        <text x={(L + W) / 2} y={H - 8} textAnchor="middle" style={{ fontSize: 12 }}>離子半徑 r（Å，= Z ÷ 離子勢）</text>
        <text x={16} y={(T + H - B) / 2} transform={`rotate(-90 16 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>電荷 Z</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L5：海水組成在週期表上（log μmol/kg，數量級） ───────────── */

// [符號, 週期列, 族, log10(μmol/kg)]；數量級整理自 Nozaki (1997) 等；不含 H、O、溶解氣體
const SW: [string, number, number, number][] = [
  ["Li", 2, 1, 1.4], ["Be", 2, 2, -4.7], ["B", 2, 13, 2.6], ["C", 2, 14, 3.4], ["F", 2, 17, 1.8],
  ["Na", 3, 1, 5.67], ["Mg", 3, 2, 4.72], ["Al", 3, 13, -2.7], ["Si", 3, 14, 2.0], ["P", 3, 15, 0.3], ["S", 3, 16, 4.45], ["Cl", 3, 17, 5.74],
  ["K", 4, 1, 4.01], ["Ca", 4, 2, 4.01], ["Sc", 4, 3, -4.8], ["Ti", 4, 4, -4.8], ["V", 4, 5, -1.5], ["Cr", 4, 6, -2.4], ["Mn", 4, 7, -3.3], ["Fe", 4, 8, -3.3],
  ["Co", 4, 9, -4.7], ["Ni", 4, 10, -2.1], ["Cu", 4, 11, -2.4], ["Zn", 4, 12, -2.3], ["Ga", 4, 13, -4.7], ["Ge", 4, 14, -4.2], ["As", 4, 15, -1.6], ["Se", 4, 16, -2.8], ["Br", 4, 17, 2.92],
  ["Rb", 5, 1, 0.15], ["Sr", 5, 2, 1.95], ["Y", 5, 3, -3.7], ["Zr", 5, 4, -3.7], ["Nb", 5, 5, -5.4], ["Mo", 5, 6, -0.97], ["Ag", 5, 11, -4.7], ["Cd", 5, 12, -3.2], ["Sn", 5, 14, -5.4], ["Sb", 5, 15, -2.9], ["I", 5, 17, -0.35],
  ["Cs", 6, 1, -2.6], ["Ba", 6, 2, -1.0], ["La", 6, 3, -4.5], ["Hf", 6, 4, -6], ["Ta", 6, 5, -7], ["W", 6, 6, -4.3], ["Re", 6, 7, -4.4], ["Au", 6, 11, -7], ["Hg", 6, 12, -6], ["Tl", 6, 13, -4.2], ["Pb", 6, 14, -5], ["Bi", 6, 15, -7],
  ["Th", 7, 4, -7], ["U", 7, 6, -1.87],
];

export function SeawaterTableFig() {
  const cw = 33, ch = 34, ox = 20, oy = 34;
  const lo = -7, hi = 6;
  const op = (v: number) => 0.08 + ((v - lo) / (hi - lo)) * 0.88;
  return (
    <Fig caption="海水中各元素的濃度，畫在週期表上（橘色越濃 = 越多，數字是 log μmol/kg，只看數量級）。左邊的鹼金屬、鹼土金屬（低離子勢，水合陽離子）和右邊的 B、C、S、Cl、Br、Mo、U（高離子勢，含氧陰離子或鹵素陰離子）很多；中間的 Al、Ti、Fe、Zr、Th 等（中離子勢，氫氧化物）極少，呈 U 形。空白格是沒有列出的元素（含 H、O、N 和溶解的惰性氣體）。U 和 Th 同在錒系，U⁶⁺ 形成碳酸鈾醯錯合物而易溶，Th⁴⁺ 不易溶，差了五個數量級。" source="數量級整理自 Nozaki (1997)；White (2013) Fig. 15.5；課堂投影片 L5 p.35">
      <svg viewBox="0 0 640 300" className="ix-svg" role="img" aria-label="海水元素濃度週期表">
        {[1, 2, 13, 14, 15, 16, 17].map((g) => (
          <text key={g} x={ox + (g - 0.5) * cw} y={oy - 8} textAnchor="middle" style={{ fontSize: 10, opacity: 0.6 }}>{g}</text>
        ))}
        {SW.map(([s, p, g, v]) => (
          <g key={s}>
            <rect x={ox + (g - 1) * cw + 1} y={oy + (p - 2) * ch + 1} width={cw - 2} height={ch - 2} rx={3} fill={C.orange} fillOpacity={op(v)} stroke={INK} strokeOpacity={0.35} />
            <text x={ox + (g - 0.5) * cw} y={oy + (p - 2) * ch + 15} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800 }}>{s}</text>
            <text x={ox + (g - 0.5) * cw} y={oy + (p - 2) * ch + 28} textAnchor="middle" style={{ fontSize: 9 }}>{v > 0 ? v.toFixed(1) : v.toFixed(1)}</text>
          </g>
        ))}
        <text x={ox + 3 * cw - 4} y={oy + 5 * ch + 22} textAnchor="end" style={{ fontSize: 10, opacity: 0.7 }}>錒系 →</text>
        {/* 色階 */}
        {Array.from({ length: 14 }, (_, i) => lo + i).map((v, i) => (
          <rect key={v} x={330 + i * 20} y={250} width={20} height={14} fill={C.orange} fillOpacity={op(v)} />
        ))}
        <text x={326} y={261} textAnchor="end" style={{ fontSize: 10 }}>少 −7</text>
        <text x={334 + 14 * 20} y={261} style={{ fontSize: 10 }}>+6 多</text>
        <text x={470} y={284} textAnchor="middle" style={{ fontSize: 10.5 }}>log 濃度（μmol/kg）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L6：簡化碳循環（投影片 p.7 的數字） ───────────── */

export function CarbonCycleFig() {
  const box = (x: number, y: number, w: number, h: number, t: string, v: string, col: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={col} fillOpacity={0.16} stroke={col} strokeWidth={2} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{t}</text>
      <text x={x + w / 2} y={y + 40} textAnchor="middle" style={{ fontSize: 11.5 }}>{v}</text>
    </g>
  );
  return (
    <Fig caption="簡化的全球碳循環。方框是儲庫（PgC），旁邊的 τ 是滯留時間，箭頭上是通量（PgC/yr）。大氣、表層海洋、陸地生物圈之間的交換只要幾年到幾十年；深海要幾百年；地殼要上億年。人為 CO₂ 最後要進到下面那幾個大儲庫，才算真正離開大氣。" source="課堂投影片 L6 p.7">
      <svg viewBox="0 0 640 330" className="ix-svg" role="img" aria-label="簡化碳循環">
        <Marks />
        {box(20, 14, 230, 54, "大氣 CO₂", "600（τ 到海 7 yr、到陸 12 yr）", C.teal)}
        {box(400, 14, 220, 54, "陸地有機碳", "2,100（τ 42 yr）", C.gold)}
        {box(20, 118, 230, 54, "表層海洋 DIC", "700（τ 到深海 7 yr）", C.blue)}
        {box(20, 250, 230, 54, "深層海洋 DIC", "38,000（τ 380 yr）", C.navy)}
        {box(400, 196, 220, 54, "地殼碳酸鹽 (Ca,Mg)CO₃", "4.8×10⁷（風化 240 Myr）", C.orange)}
        {box(400, 266, 220, 54, "地殼有機碳", "1.5×10⁷（風化 300 Myr）", C.rose)}
        <line x1={252} y1={41} x2={396} y2={41} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" markerStart="url(#gm-k)" />
        <text x={324} y={34} textAnchor="middle" style={{ fontSize: 11 }}>光合／呼吸</text>
        <line x1={110} y1={70} x2={110} y2={114} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" markerStart="url(#gm-k)" />
        <text x={118} y={96} style={{ fontSize: 11 }}>海–氣交換</text>
        <line x1={80} y1={174} x2={80} y2={246} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" markerStart="url(#gm-k)" />
        <text x={88} y={196} style={{ fontSize: 11 }}>環流交換</text>
        <line x1={170} y1={174} x2={170} y2={246} stroke={C.orange} strokeWidth={2} markerEnd="url(#gm-o)" />
        <text x={178} y={208} style={{ fontSize: 10.5 }}>沉降：CaCO₃ 1</text>
        <text x={178} y={222} style={{ fontSize: 10.5 }}>有機碳 10</text>
        <line x1={252} y1={286} x2={396} y2={226} stroke={C.orange} strokeWidth={2} markerEnd="url(#gm-o)" />
        <text x={300} y={246} textAnchor="middle" style={{ fontSize: 10.5 }}>埋藏 CaCO₃ 0.25</text>
        <line x1={252} y1={296} x2={396} y2={296} stroke={C.rose} strokeWidth={2} markerEnd="url(#gm-r)" />
        <text x={324} y={312} textAnchor="middle" style={{ fontSize: 10.5 }}>埋藏有機碳 0.05</text>
        <path d="M430,194 C400,150 330,150 254,146" fill="none" stroke={C.teal} strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#gm-t)" />
        <text x={360} y={140} textAnchor="middle" style={{ fontSize: 10.5 }}>河流帶入溶解 CaCO₃ 0.2</text>
        <path d="M560,194 C560,110 330,100 254,62" fill="none" stroke={INK} strokeWidth={1.6} strokeDasharray="5 4" markerEnd="url(#gm-k)" />
        <text x={470} y={88} textAnchor="middle" style={{ fontSize: 10.5 }}>變質 CaCO₃ + SiO₂ → CaSiO₃ + CO₂：0.05（回到大氣）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L6：CaCO₃ 越深越容易溶（Broecker Table 2-2） ───────────── */

export function LysoclineFig() {
  const W = 300, H = 300, L = 50, R = 12, T = 30, B = 36;
  const x = (c: number) => L + (c / 300) * (W - L - R);
  const y = (d: number) => T + (d / 6000) * (H - T - B);
  // 飽和 CO₃²⁻：0 m 用 24 °C；冷水之後依壓力（100 atm ≈ 1000 m）
  const cal: [number, number][] = [[0, 53], [700, 72], [2500, 97], [5000, 130], [6000, 143]];
  const ara: [number, number][] = [[0, 90], [700, 110], [2500, 144], [5000, 190], [6000, 208]];
  const sea: [number, number][] = [[0, 230], [300, 200], [800, 120], [1200, 95], [6000, 90]];
  const pl = (a: [number, number][]) => a.map(([d, c]) => `${x(c)},${y(d)}`).join(" ");
  return (
    <Fig caption="第一張：飽和所需的 CO₃²⁻（虛線）隨深度增加，因為深海冷、壓力大，CaCO₃ 的 K_sp 變大；海水實際的 CO₃²⁻（實線，示意）表層多、深層少。實線跑到虛線左邊（不足）的深度以下，CaCO₃ 就會溶解；aragonite 比 calcite 更淺就開始溶。第二張：海底剖面。溶躍面（lysocline）以下溶解速率急增，CCD 以下幾乎沒有 CaCO₃，所以淺的洋脊頂有白色的碳酸鹽軟泥，深海盆沒有。" source="飽和濃度依 Broecker Table 2-2；課堂投影片 L6 p.12–13（Peterson 1966 方解石球實驗）">
      <div className="fg-pair">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="飽和 CO3 對深度">
          <polyline points={pl(sea)} fill="none" stroke={C.teal} strokeWidth={3} />
          <polyline points={pl(cal)} fill="none" stroke={C.orange} strokeWidth={2.4} strokeDasharray="6 4" />
          <polyline points={pl(ara)} fill="none" stroke={C.violet} strokeWidth={2.4} strokeDasharray="6 4" />
          {([["海水實際", C.teal, ""], ["calcite 飽和", C.orange, "6 4"], ["aragonite 飽和", C.violet, "6 4"]] as [string, string, string][]).map(([n, c, d], i) => (
            <g key={n}>
              <line x1={x(205)} x2={x(222)} y1={y(3300 + i * 450)} y2={y(3300 + i * 450)} stroke={c} strokeWidth={2.6} strokeDasharray={d} />
              <text x={x(226)} y={y(3300 + i * 450) + 4} style={{ fontSize: 10, fontWeight: 700 }}>{n}</text>
            </g>
          ))}
          <line x1={L} x2={W - R} y1={y(2280)} y2={y(2280)} stroke={C.orange} strokeOpacity={0.6} />
          <text x={W - R - 2} y={y(2280) - 4} textAnchor="end" style={{ fontSize: 10 }}>以下 calcite 不飽和</text>
          <line x1={L} x2={W - R} y1={T} y2={T} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[0, 100, 200].map((c) => (
            <text key={c} x={x(c)} y={T - 6} textAnchor="middle" style={{ fontSize: 10.5 }}>{c}</text>
          ))}
          <text x={(L + W) / 2} y={12} textAnchor="middle" style={{ fontSize: 11 }}>CO₃²⁻（μmol/kg）</text>
          {[0, 1000, 2000, 3000, 4000, 5000, 6000].map((d) => (
            <text key={d} x={L - 5} y={y(d) + 4} textAnchor="end" style={{ fontSize: 10.5 }}>{d}</text>
          ))}
          <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 11 }}>深度（m）</text>
        </svg>
        <svg viewBox="0 0 300 300" className="ix-svg" role="img" aria-label="海底剖面、溶躍面與 CCD">
          <rect x={0} y={20} width={300} height={250} fill={C.blue} fillOpacity={0.12} />
          <path d="M0,270 L0,230 C40,225 70,130 110,110 C140,100 160,100 190,120 C230,150 260,230 300,240 L300,270 Z" fill={INK} fillOpacity={0.25} />
          <path d="M70,170 C85,140 100,118 110,112 C140,100 160,100 190,120 C205,132 215,150 222,165 L215,168 C205,150 195,136 185,128 C160,110 140,110 118,120 C105,128 92,148 78,172 Z" fill="#f2efe6" stroke={INK} strokeWidth={0.8} />
          <line x1={0} x2={300} y1={160} y2={160} stroke={C.orange} strokeDasharray="6 4" strokeWidth={1.8} />
          <text x={296} y={154} textAnchor="end" style={{ fontSize: 11, fontWeight: 800, fill: C.orange }}>溶躍面</text>
          <line x1={0} x2={300} y1={200} y2={200} stroke={C.rose} strokeDasharray="6 4" strokeWidth={1.8} />
          <text x={296} y={194} textAnchor="end" style={{ fontSize: 11, fontWeight: 800, fill: C.rose }}>CCD</text>
          {[30, 60, 95, 130, 165, 200, 235, 265].map((px, i) => (
            <g key={px}>
              <circle cx={px} cy={40 + (i % 3) * 22} r={4} fill="#f2efe6" stroke={INK} strokeWidth={0.8} />
              <line x1={px} x2={px} y1={48 + (i % 3) * 22} y2={70 + (i % 3) * 22} stroke={INK} strokeOpacity={0.35} strokeDasharray="2 3" />
            </g>
          ))}
          <text x={150} y={15} textAnchor="middle" style={{ fontSize: 11 }}>表層：浮游生物製造 CaCO₃ 殼，往下沉</text>
          <text x={150} y={96} textAnchor="middle" style={{ fontSize: 10.5, fontWeight: 700 }}>洋脊</text>
          <text x={150} y={140} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: "#1c2135" }}>碳酸鹽軟泥</text>
          <text x={40} y={258} textAnchor="middle" style={{ fontSize: 10.5 }}>深海盆：</text>
          <text x={40} y={271} textAnchor="middle" style={{ fontSize: 10.5 }}>沒有 CaCO₃</text>
          <text x={260} y={258} textAnchor="middle" style={{ fontSize: 10.5 }}>紅黏土</text>
          <text x={150} y={292} textAnchor="middle" style={{ fontSize: 11 }}>（示意，不按比例）</text>
        </svg>
      </div>
    </Fig>
  );
}

/* ───────────── L6：Bowen 反應系列與風化穩定性 ───────────── */

export function BowenFig() {
  const b = (x: number, y: number, t: string, col: string, w = 104) => (
    <g>
      <rect x={x - w / 2} y={y - 15} width={w} height={30} rx={4} fill={col} fillOpacity={0.18} stroke={col} strokeWidth={2} />
      <text x={x} y={y + 5} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{t}</text>
    </g>
  );
  return (
    <Fig caption="Bowen 反應系列：岩漿冷卻時礦物結晶的順序。左支是不連續系列（橄欖石 → 輝石 → 角閃石 → 黑雲母），右支是連續系列（Ca 斜長石 → Na 斜長石），最後是鉀長石、白雲母、石英。在地表風化時順序剛好反過來：越早結晶的（越高溫形成，和地表條件差越遠）越不穩定、越容易風化；石英最穩定。" source="課堂投影片 L6 p.17（Goldich 風化序列）">
      <svg viewBox="0 0 640 300" className="ix-svg" role="img" aria-label="Bowen 反應系列">
        <Marks />
        {b(150, 40, "橄欖石", C.rose)}
        {b(150, 92, "輝石", C.orange)}
        {b(150, 144, "角閃石", C.gold)}
        {b(150, 196, "黑雲母", C.teal)}
        {b(390, 40, "Ca 斜長石", C.rose, 120)}
        {b(390, 118, "Ca–Na 斜長石", C.gold, 120)}
        {b(390, 196, "Na 斜長石", C.teal, 120)}
        {[[150, 56, 150, 76], [150, 108, 150, 128], [150, 160, 150, 180], [390, 56, 390, 102], [390, 134, 390, 180]].map(([a, b2, c, d], i) => (
          <line key={i} x1={a} y1={b2} x2={c} y2={d} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" />
        ))}
        <line x1={160} y1={212} x2={250} y2={238} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" />
        <line x1={380} y1={212} x2={300} y2={238} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" />
        {b(275, 254, "鉀長石 → 白雲母 → 石英", C.blue, 200)}
        <text x={150} y={14} textAnchor="middle" style={{ fontSize: 11 }}>不連續系列</text>
        <text x={390} y={14} textAnchor="middle" style={{ fontSize: 11 }}>連續系列</text>
        <line x1={30} y1={40} x2={30} y2={254} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" />
        <text x={22} y={147} transform="rotate(-90 22 147)" textAnchor="middle" style={{ fontSize: 11 }}>結晶溫度 高 → 低</text>
        <rect x={500} y={40} width={26} height={214} fill="url(#bw-g)" stroke={INK} />
        <defs>
          <linearGradient id="bw-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d0567a" />
            <stop offset="1" stopColor="#5b8bd9" />
          </linearGradient>
        </defs>
        <text x={536} y={52} style={{ fontSize: 12, fontWeight: 800 }}>最容易風化</text>
        <text x={536} y={254} style={{ fontSize: 12, fontWeight: 800 }}>最穩定</text>
        <text x={536} y={150} style={{ fontSize: 11 }}>地表風化</text>
        <text x={536} y={165} style={{ fontSize: 11 }}>穩定性</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L6：人為 CO₂ 進入海洋的深度（示意剖面） ───────────── */

export function AnthroSectionFig() {
  const W = 640, H = 260, L = 50, R = 14, T = 30, B = 34;
  const x = (f: number) => L + f * (W - L - R);
  const y = (d: number) => T + (d / 5000) * (H - T - B);
  // 沿大西洋（北→南）→ 南大洋 → 太平洋（南→北）；每個位置 [相對距離, 人為 CO₂ 穿透深度 m]
  const pen = (lev: number): [number, number][] => [
    [0, 2600 * lev], [0.08, 2000 * lev], [0.2, 1000 * lev], [0.3, 700 * lev], [0.42, 1000 * lev], [0.52, 1500 * lev], [0.6, 1300 * lev], [0.7, 700 * lev], [0.82, 450 * lev], [0.92, 400 * lev], [1, 350 * lev],
  ];
  const area = (lev: number) => {
    const p = pen(lev);
    return [`${x(0)},${y(0)}`, ...p.map(([f, d]) => `${x(f)},${y(d)}`), `${x(1)},${y(0)}`].join(" ");
  };
  return (
    <Fig caption="人為 CO₂ 進入海洋的深度（示意剖面，顏色越濃越多）。大部分還留在上層 1000 m 以內；只有在北大西洋和南大洋，表層水變冷變重、下沉形成深層水的地方，才被帶到 2000 m 以下。所以把人為 CO₂ 送進深海的速度，由海洋環流（數百年）決定，而不是海氣交換（約半年）。" source="Sabine et al. (2004) 的 GLODAP 剖面；課堂投影片 L6 p.22。輪廓為示意">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="人為 CO2 剖面示意">
        <Marks />
        <rect x={L} y={T} width={W - L - R} height={H - T - B} fill={C.navy} fillOpacity={0.25} />
        {[1, 0.7, 0.45, 0.25].map((lev, i) => (
          <polygon key={lev} points={area(lev)} fill={C.orange} fillOpacity={0.18 + i * 0.14} />
        ))}
        <line x1={x(0.03)} y1={y(300)} x2={x(0.03)} y2={y(2300)} stroke={C.teal} strokeWidth={2.4} markerEnd="url(#gm-t)" />
        <text x={x(0.05)} y={y(2600) + 4} style={{ fontSize: 10.5, fontWeight: 700 }}>北大西洋深層水下沉</text>
        <line x1={x(0.52)} y1={y(200)} x2={x(0.52)} y2={y(1300)} stroke={C.teal} strokeWidth={2.4} markerEnd="url(#gm-t)" />
        <text x={x(0.54)} y={y(1700)} style={{ fontSize: 10.5, fontWeight: 700 }}>南大洋下沉</text>
        <text x={x(0.8)} y={y(1300)} textAnchor="middle" style={{ fontSize: 10.5 }}>太平洋：只到幾百公尺</text>
        <text x={x(0.12)} y={T - 10} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>大西洋（北）</text>
        <text x={x(0.52)} y={T - 10} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>南大洋</text>
        <text x={x(0.9)} y={T - 10} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>太平洋（北）</text>
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0, 1000, 2000, 3000, 4000, 5000].map((d) => (
          <text key={d} x={L - 5} y={y(d) + 4} textAnchor="end" style={{ fontSize: 10.5 }}>{d}</text>
        ))}
        <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 11 }}>深度（m）</text>
        <text x={(L + W) / 2} y={H - 10} textAnchor="middle" style={{ fontSize: 11 }}>沿剖面距離 →</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L7：Redox ladder（pH 7） ───────────── */

export function RedoxLadderFig() {
  const steps: [string, number, string][] = [
    ["O₂ → H₂O", 13.8, C.teal],
    ["NO₃⁻ → N₂", 12.6, C.blue],
    ["MnO₂ → Mn²⁺", 8, C.violet],
    ["Fe(OH)₃ → Fe²⁺", -1, C.orange],
    ["SO₄²⁻ → HS⁻", -3.7, C.gold],
    ["CO₂ → CH₄", -4.1, C.rose],
  ];
  const W = 640, H = 290, L = 50, R = 16, T = 16, B = 40;
  const y = (e: number) => T + ((16 - e) / 22) * (H - T - B);
  const sw = (W - L - R) / steps.length;
  return (
    <Fig caption="Redox ladder：把有機物丟進一杯水（或埋進沉積物），微生物先用能量最多的電子接受者 O₂；O₂ 用完了才換 NO₃⁻，再來是 MnO₂、Fe(OH)₃、SO₄²⁻，最後是產甲烷。每換一種，pε 就往下掉一階（數值為 pH 7 時的代表值）。標「不溶 → 可溶」的兩階，固體被還原後變成溶解離子，所以孔隙水的 Mn、Fe 會突然增加。" source="課堂投影片 L7 p.25–27（Stumm & Morgan；Langmuir）">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="Redox ladder">
        <Marks />
        {[15, 10, 5, 0, -5].map((e) => (
          <g key={e}>
            <line x1={L} x2={W - R} y1={y(e)} y2={y(e)} stroke={INK} strokeOpacity={0.1} />
            <text x={L - 6} y={y(e) + 4} textAnchor="end" style={{ fontSize: 11 }}>{e}</text>
          </g>
        ))}
        {steps.map(([n, e, c], i) => (
          <g key={n}>
            <rect x={L + i * sw + 3} y={y(e)} width={sw - 6} height={H - B - y(e)} fill={c} fillOpacity={0.22} />
            <line x1={L + i * sw} x2={L + (i + 1) * sw} y1={y(e)} y2={y(e)} stroke={c} strokeWidth={4} />
            {i > 0 && <line x1={L + i * sw} x2={L + i * sw} y1={y(steps[i - 1][1])} y2={y(e)} stroke={INK} strokeWidth={1.5} strokeOpacity={0.6} />}
            <text x={L + (i + 0.5) * sw} y={y(e) - 8} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{n}</text>
            <text x={L + (i + 0.5) * sw} y={Math.max(y(e) + 18, y(0) + 18)} textAnchor="middle" style={{ fontSize: 10.5 }}>pε ≈ {e > 0 ? "+" : ""}{e}</text>
            {(i === 2 || i === 3) && (
              <text x={L + (i + 0.5) * sw} y={H - B - 8} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: c }}>不溶 → 可溶</text>
            )}
          </g>
        ))}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L + 10} x2={W - R - 10} y1={H - 14} y2={H - 14} stroke={INK} strokeWidth={1.5} markerEnd="url(#gm-k)" />
        <text x={(L + W) / 2} y={H - 20} textAnchor="middle" style={{ fontSize: 11.5 }}>分解掉的有機物越來越多（或沉積物越來越深）</text>
        <text x={16} y={(T + H - B) / 2} transform={`rotate(-90 16 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>pε（pH 7）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L7：同一張 ladder 在沉積物和地下水裡 ───────────── */

export function RedoxZonesFig() {
  const W = 300, H = 300, L = 40, R = 10, T = 26, B = 20;
  const y = (d: number) => T + d * (H - T - B); // d 0..1
  const x = (c: number) => L + c * (W - L - R);
  const curve = (f: (d: number) => number) => {
    const a: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const d = i / 60;
      a.push(`${x(f(d))},${y(d)}`);
    }
    return a.join(" ");
  };
  const sig = (d: number, c: number, w: number) => 1 / (1 + Math.exp((d - c) / w));
  const prof: [string, string, (d: number) => number, number][] = [
    ["O₂", C.teal, (d) => 0.9 * sig(d, 0.06, 0.02), 0.02],
    ["NO₃⁻", C.blue, (d) => 0.6 * sig(d, 0.18, 0.03), 0.12],
    ["Mn²⁺", C.violet, (d) => 0.45 * (1 - sig(d, 0.28, 0.03)), 0.36],
    ["Fe²⁺", C.orange, (d) => 0.7 * (1 - sig(d, 0.45, 0.04)), 0.55],
    ["SO₄²⁻", C.gold, (d) => 0.85 * sig(d, 0.68, 0.05), 0.6],
    ["CH₄", C.rose, (d) => 0.8 * (1 - sig(d, 0.85, 0.04)), 0.93],
  ];
  const zones: [string, string][] = [["產甲烷", C.rose], ["硫酸鹽還原", C.gold], ["Fe(III) 還原", C.orange], ["硝酸鹽／Mn(IV) 還原", C.violet], ["有氧", C.teal]];
  return (
    <Fig caption="同一張 redox ladder，在不同地方以不同的「軸」出現。第一張：沉積物孔隙水隨深度（示意）。O₂ 最先耗盡，接著 NO₃⁻ 減少，Mn²⁺、Fe²⁺ 依序在更深處冒出（固體 MnO₂、Fe(OH)₃ 被還原溶出），再往下 SO₄²⁻ 被用掉、CH₄ 出現。第二張：垃圾掩埋場下游的地下水（俯視）。有機物最多的污染源附近最還原，順著地下水流往下游，依序是產甲烷、硫酸鹽還原、Fe(III) 還原、硝酸鹽／Mn 還原，最後回到有氧。淹水的土壤則是同樣的順序隨時間出現。" source="課堂投影片 L7 p.28–30（Langmuir Fig. 11.13、11.16）">
      <div className="fg-pair">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="沉積物孔隙水剖面">
          <rect x={L} y={T} width={W - L - R} height={y(0.12) - T} fill="#a0703c" fillOpacity={0.25} />
          <rect x={L} y={y(0.12)} width={W - L - R} height={H - B - y(0.12)} fill="#6b7a5c" fillOpacity={0.18} />
          {prof.map(([n, c, f, dl]) => (
            <g key={n}>
              <polyline points={curve(f)} fill="none" stroke={c} strokeWidth={2.6} />
              <text x={x(f(dl)) + 5} y={y(dl) + 4} style={{ fontSize: 10.5, fontWeight: 800, fill: c }}>{n}</text>
            </g>
          ))}
          <line x1={L} x2={W - R} y1={T} y2={T} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <text x={(L + W) / 2} y={14} textAnchor="middle" style={{ fontSize: 11 }}>孔隙水濃度 →</text>
          <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 11 }}>深度 →（約數十 cm）</text>
          <text x={W - R - 4} y={y(0.11)} textAnchor="end" style={{ fontSize: 9.5 }}>棕色（氧化）</text>
          <text x={x(0.03)} y={y(0.97)} style={{ fontSize: 9.5 }}>橄欖綠、灰（還原）</text>
        </svg>
        <svg viewBox="0 0 300 300" className="ix-svg" role="img" aria-label="掩埋場下游地下水分帶">
          <defs>
            <marker id="gm-k2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: "currentColor" }} />
            </marker>
          </defs>
          {zones
            .map(([n, c], i) => {
              const rx = 25 + i * 26, ry = 14 + i * 14;
              return <ellipse key={n} cx={34 + rx} cy={170} rx={rx} ry={ry} fill={c} fillOpacity={0.22} stroke={c} strokeWidth={1.5} />;
            })
            .reverse()}
          {zones.map(([n], i) => {
            const r0 = i === 0 ? 0 : 25 + (i - 1) * 26, r1 = 25 + i * 26;
            return (
              <text key={n} x={34 + r0 + r1} y={174} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{i + 1}</text>
            );
          })}
          <rect x={12} y={160} width={22} height={20} fill={INK} fillOpacity={0.7} />
          <text x={8} y={154} style={{ fontSize: 10, fontWeight: 800 }}>掩埋場</text>
          {zones.map(([n, c], i) => (
            <g key={n}>
              <rect x={14} y={10 + i * 15} width={10} height={10} fill={c} fillOpacity={0.6} />
              <text x={30} y={19 + i * 15} style={{ fontSize: 10.5, fontWeight: 700 }}>{i + 1}　{n}</text>
            </g>
          ))}
          <line x1={40} x2={285} y1={258} y2={258} stroke={INK} strokeWidth={1.5} markerEnd="url(#gm-k2)" />
          <text x={160} y={280} textAnchor="middle" style={{ fontSize: 11 }}>地下水流向：往下游越氧化（俯視示意）</text>
        </svg>
      </div>
    </Fig>
  );
}

/* ───────────── L7：電化學電池（Zn–Cu） ───────────── */

export function CellFig() {
  return (
    <Fig caption="Zn–Cu 電池。Zn 比 Cu 容易失去電子（E° 較負），所以 Zn 片被氧化成 Zn²⁺（陽極），電子經導線流到 Cu 片，把溶液中的 Cu²⁺ 還原成 Cu（陰極）；鹽橋讓離子流動、維持電中性。在導線上加一個反向電壓，剛好讓電子停止流動時的電壓，就是兩個半反應的電位差。每個半反應單獨的電位，都是和標準氫電極（E = 0）比出來的。" source="課堂投影片 L7 p.9–10">
      <svg viewBox="0 0 640 240" className="ix-svg" role="img" aria-label="Zn-Cu 電池">
        <Marks />
        <path d="M110,90 L110,210 L250,210 L250,90" fill={C.blue} fillOpacity={0.12} stroke={INK} strokeWidth={2} />
        <path d="M390,90 L390,210 L530,210 L530,90" fill={C.teal} fillOpacity={0.14} stroke={INK} strokeWidth={2} />
        <rect x={160} y={60} width={16} height={130} fill="#9aa3ad" stroke={INK} />
        <rect x={464} y={60} width={16} height={130} fill="#c27a4a" stroke={INK} />
        <path d="M230,110 L230,70 Q320,40 410,70 L410,110" fill="none" stroke={C.gold} strokeWidth={10} strokeOpacity={0.5} />
        <text x={320} y={40} textAnchor="middle" style={{ fontSize: 11 }}>鹽橋</text>
        <path d="M168,60 L168,22 L472,22 L472,60" fill="none" stroke={INK} strokeWidth={2} />
        <line x1={240} y1={22} x2={330} y2={22} stroke={C.orange} strokeWidth={3} markerEnd="url(#gm-o)" />
        <text x={285} y={14} textAnchor="middle" style={{ fontSize: 11.5, fontWeight: 800, fill: C.orange }}>e⁻</text>
        <text x={168} y={228} textAnchor="middle" style={{ fontSize: 11 }}>Zn²⁺ 溶液</text>
        <text x={472} y={228} textAnchor="middle" style={{ fontSize: 11 }}>Cu²⁺ 溶液</text>
        <text x={60} y={110} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>Zn 片（−）</text>
        <text x={60} y={128} textAnchor="middle" style={{ fontSize: 11 }}>陽極：氧化</text>
        <text x={60} y={146} textAnchor="middle" style={{ fontSize: 11 }}>Zn → Zn²⁺ + 2e⁻</text>
        <text x={585} y={110} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>Cu 片（+）</text>
        <text x={585} y={128} textAnchor="middle" style={{ fontSize: 11 }}>陰極：還原</text>
        <text x={585} y={146} textAnchor="middle" style={{ fontSize: 11 }}>Cu²⁺ + 2e⁻ → Cu</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L1：核合成的流程 ───────────── */

export function NucleoFlowFig() {
  const box = (x: number, y: number, t: string, a: string, b: string, col: string) => (
    <g>
      <rect x={x} y={y} width={108} height={64} rx={6} fill={col} fillOpacity={0.18} stroke={col} strokeWidth={2} />
      <text x={x + 54} y={y + 20} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 800 }}>{t}</text>
      <text x={x + 54} y={y + 38} textAnchor="middle" style={{ fontSize: 11 }}>{a}</text>
      <text x={x + 54} y={y + 55} textAnchor="middle" style={{ fontSize: 10.5, opacity: 0.8 }}>{b}</text>
    </g>
  );
  return (
    <Fig caption="元素是怎麼做出來的。大霹靂只做出 H、He（和微量 Li）；恆星依序把 H 融合成 He、He 融合成 C，大質量星再用 α process 一次加一個 He 做出 O、Ne、Mg、Si，最後 e process 在統計平衡下做出 Fe 附近的元素，那裡結合能最大，融合到此為止。比 Fe 重的元素只能靠捕獲中子再 β⁻ 衰變：慢的 s process（沿著穩定谷走，在 AGB 紅巨星）和快的 r process（富中子環境，超新星、中子星合併）。" source="課堂投影片 L1 p.24–38（B²FH 1957）">
      <svg viewBox="0 0 640 230" className="ix-svg" role="img" aria-label="核合成流程">
        <Marks />
        {box(8, 20, "大霹靂", "H、He", "（微量 Li）", C.blue)}
        {box(134, 20, "H burning", "4 H → He", "主序星", C.gold)}
        {box(260, 20, "He burning", "3 He → C", "紅巨星", C.orange)}
        {box(386, 20, "α process", "C → O → … → Si", "每次 + ⁴He", C.rose)}
        {box(512, 20, "e process", "Si + Si → Fe", "結合能最大", C.teal)}
        {[116, 242, 368, 494].map((x) => <line key={x} x1={x} x2={x + 16} y1={52} y2={52} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" />)}
        <line x1={540} y1={86} x2={430} y2={140} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" />
        <line x1={580} y1={86} x2={580} y2={140} stroke={INK} strokeWidth={2} markerEnd="url(#gm-k)" />
        <text x={440} y={104} style={{ fontSize: 11, fontWeight: 800, fill: C.teal }}>+ 中子</text>
        {box(370, 142, "s process（慢）", "沿穩定谷", "AGB 紅巨星", C.violet)}
        {box(520, 142, "r process（快）", "富中子", "超新星", C.violet)}
        <text x={20} y={150} style={{ fontSize: 12, fontWeight: 800, fill: C.orange }}>融合只能做到 Fe：</text>
        <text x={20} y={172} style={{ fontSize: 11 }}>再往上融合會吸收能量，</text>
        <text x={20} y={190} style={{ fontSize: 11 }}>重元素只能靠捕獲中子 + β⁻ 衰變</text>
        <text x={20} y={208} style={{ fontSize: 11 }}>（Sr、Ba、Pb、U…）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L1：每核子結合能 ───────────── */

const BE: [number, number, string?][] = [
  [1, 0], [2, 1.11], [3, 2.57], [4, 7.07, "⁴He"], [6, 5.33], [7, 5.61], [9, 6.46], [10, 6.48], [11, 6.93], [12, 7.68], [14, 7.48], [16, 7.98],
  [20, 8.03], [24, 8.26], [28, 8.45], [32, 8.49], [40, 8.55], [56, 8.79, "⁵⁶Fe"], [62, 8.79], [84, 8.72], [120, 8.5], [138, 8.39], [184, 8.0], [208, 7.87], [238, 7.57, "²³⁸U"],
];

export function BindingEnergyFig() {
  const W = 560, H = 260, L = 50, R = 16, T = 18, B = 40;
  const x = (a: number) => L + (a / 240) * (W - L - R);
  const y = (b: number) => T + ((9.5 - b) / 9.5) * (H - T - B);
  return (
    <Fig caption="每核子結合能對質量數。越高越穩定，最高點在 ⁵⁶Fe 附近（⁶²Ni 幾乎一樣高）。比 Fe 輕的核融合時往曲線高處走、放出能量（恆星發光）；比 Fe 重的核分裂時也往高處走（核能）；但融合到比 Fe 更重會吸收能量，所以恆星燒到 Fe 就停。⁴He 特別穩定，在曲線上突出一個尖峰，這也是 α process 一次加一個 ⁴He 的原因。" source="核子結合能數據（AME）；課堂投影片 L1 p.31–33">
      <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="結合能曲線" style={{ maxWidth: 620, margin: "0 auto" }}>
        <Marks />
        {[0, 2, 4, 6, 8].map((b) => (
          <g key={b}>
            <line x1={L} x2={W - R} y1={y(b)} y2={y(b)} stroke={INK} strokeOpacity={0.1} />
            <text x={L - 6} y={y(b) + 4} textAnchor="end" style={{ fontSize: 11 }}>{b}</text>
          </g>
        ))}
        <polyline points={BE.map(([a, b]) => `${x(a)},${y(b)}`).join(" ")} fill="none" stroke={C.blue} strokeWidth={2.4} />
        {BE.map(([a, b, l]) => (
          <g key={a}>
            <circle cx={x(a)} cy={y(b)} r={l ? 5 : 3} fill={l ? C.orange : C.blue} />
            {l && <text x={x(a) + (a === 238 ? -6 : 8)} y={y(b) + (a === 4 ? 16 : -8)} textAnchor={a === 238 ? "end" : "start"} style={{ fontSize: 11.5, fontWeight: 800 }}>{l}</text>}
          </g>
        ))}
        <line x1={x(70)} y1={y(4.6)} x2={x(30)} y2={y(4.6)} stroke={C.teal} strokeWidth={2.5} markerStart="url(#gm-t)" />
        <text x={x(32)} y={y(4.6) - 8} style={{ fontSize: 11.5, fontWeight: 800, fill: C.teal }}>融合（放能）</text>
        <line x1={x(150)} y1={y(6.2)} x2={x(210)} y2={y(6.2)} stroke={C.rose} strokeWidth={2.5} markerStart="url(#gm-r)" />
        <text x={x(150)} y={y(6.2) - 8} style={{ fontSize: 11.5, fontWeight: 800, fill: C.rose }}>分裂（放能）</text>
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
        <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
        {[0, 40, 80, 120, 160, 200, 240].map((a) => (
          <text key={a} x={x(a)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{a}</text>
        ))}
        <text x={(L + W) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12 }}>質量數 A</text>
        <text x={16} y={(T + H - B) / 2} transform={`rotate(-90 16 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>每核子結合能（MeV）</text>
      </svg>
    </Fig>
  );
}

/* ───────────── L2：分異後元素住在哪裡 ───────────── */

export function DifferentiationFig() {
  const layers: [string, number, number, string, string, string][] = [
    ["大氣 + 海洋", 10, 30, "親氣：N、H、惰性氣體", "不形成礦物", C.blue],
    ["地殼", 44, 30, "親石 + 不相容：Si、Al、K、Na、Rb、Ba、REE", "親硫礦床：Cu、Zn、Pb", C.gold],
    ["地函", 78, 62, "親石 + 相容：Mg、Ni、Cr、Co", "D > 1，熔融時留在殘餘固體", C.teal],
    ["地核", 144, 50, "親鐵：Fe、Ni、Au、Pt 族", "金屬 Fe⁰ 下沉", C.orange],
  ];
  return (
    <Fig caption="分異之後，元素住在哪裡。金屬鐵下沉時，把親鐵元素一起帶進地核；地函部分熔融時，不相容的親石元素（K、Rb、Ba、REE）進入熔體、上升形成地殼，相容的（Mg、Ni、Cr、Co）留在地函；親硫元素集中在硫化物礦床；親氣元素在大氣和海洋。" source="課堂投影片 L2 p.9–11">
      <svg viewBox="0 0 640 205" className="ix-svg" role="img" aria-label="地球分異">
        <Marks />
        {layers.map(([n, y, h, a, b, c]) => (
          <g key={n}>
            <rect x={150} y={y} width={150} height={h} rx={4} fill={c} fillOpacity={0.22} stroke={c} strokeWidth={1.5} />
            <text x={225} y={y + h / 2 + 5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800 }}>{n}</text>
            <text x={315} y={y + h / 2 - 2} style={{ fontSize: 11.5, fontWeight: 700 }}>{a}</text>
            <text x={315} y={y + h / 2 + 14} style={{ fontSize: 10.5, opacity: 0.8 }}>{b}</text>
          </g>
        ))}
        <path d="M130,130 C100,110 100,80 130,60" fill="none" stroke={C.teal} strokeWidth={2.4} markerEnd="url(#gm-t)" />
        <text x={92} y={88} textAnchor="end" style={{ fontSize: 11.5, fontWeight: 800, fill: C.teal }}>部分熔融</text>
        <text x={92} y={104} textAnchor="end" style={{ fontSize: 11, fill: C.teal }}>不相容 ↑</text>
        <path d="M130,140 C100,155 100,175 130,185" fill="none" stroke={INK} strokeWidth={2.4} markerEnd="url(#gm-k)" />
        <text x={92} y={170} textAnchor="end" style={{ fontSize: 11.5, fontWeight: 800 }}>金屬下沉</text>
      </svg>
    </Fig>
  );
}
