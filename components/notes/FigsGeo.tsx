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
