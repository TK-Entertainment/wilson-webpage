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
        <text x={206} y={78} style={{ fontSize: 11 }}>低質量</text>
        <text x={206} y={162} style={{ fontSize: 11 }}>大質量</text>
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
        <text x={594} y={96} textAnchor="middle" style={{ fontSize: 11 }}>雙星吸積到 1.4 M☉</text>
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
