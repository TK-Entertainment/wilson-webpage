"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import "./notes.css";

// 地球物質（台大，吳宗叡／羅立）的互動圖
const INK = "currentColor";
const fmt = (x: number, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false });
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
/** 科學記號：8.98×10⁻⁴ */
const sci = (v: number, d = 2) => {
  if (v === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(v)));
  if (e >= -2 && e <= 3) return fmt(v, Math.max(0, d - e));
  return `${fmt(v / 10 ** e, d)}×10${String(e).replace("-", "⁻").replace(/\d/g, (k) => SUP[+k])}`;
};
const rad = (d: number) => (d * Math.PI) / 180;
const C = { orange: "var(--orange)", teal: "var(--teal)", gold: "var(--gold)", navy: "var(--navy)", rose: "#d0567a", blue: "#5b8bd9", green: "#4f9d5d", violet: "#8a6fd1" };

function Shell({ title, sub, svg, children }: { title: string; sub: string; svg: ReactNode; children: ReactNode }) {
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>{title}</b>
        <span>{sub}</span>
      </figcaption>
      <div className="ix-body">
        <div>{svg}</div>
        <div className="ix-panel">{children}</div>
      </div>
    </figure>
  );
}

function Slider({ label, value, show, min, max, step, onChange }: { label: string; value: number; show: string; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="ix-row">
      <label><span>{label}</span><span>{show}</span></label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

function Btns<T extends string>({ opts, value, onChange }: { opts: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="ix-btns">
      {opts.map(([k, n]) => (
        <button key={k} type="button" className="ix-btn" aria-pressed={value === k} onClick={() => onChange(k)}>{n}</button>
      ))}
    </div>
  );
}

/* ───────────── Ch4：半徑比 → 配位數 ───────────── */

const RR: [number, number, string, string][] = [
  [0, 0.155, "2", "直線"],
  [0.155, 0.225, "3", "三角形"],
  [0.225, 0.414, "4", "四面體"],
  [0.414, 0.732, "6", "八面體"],
  [0.732, 1, "8", "立方體"],
];
// Ahrens (1952) 半徑（Å），課本計算半徑比常用；O²⁻ = 1.40 Å
const IONS: [string, number, string][] = [
  ["B³⁺", 0.23, "BO₃ 三角形"],
  ["Si⁴⁺", 0.42, "SiO₄ 四面體"],
  ["Al³⁺", 0.51, "4 或 6 都有"],
  ["Mg²⁺", 0.66, "八面體"],
  ["Fe²⁺", 0.74, "八面體"],
  ["Na⁺", 0.97, "6–8"],
  ["Ca²⁺", 0.99, "6–8"],
  ["K⁺", 1.33, "8–12"],
];

export function RadiusRatioDemo() {
  const [r, setR] = useState(0.66);
  const [ion, setIon] = useState("Mg²⁺");
  const RX = 1.4;
  const ratio = r / RX;
  const band = RR.find(([a, b]) => ratio >= a && ratio < b) ?? RR[RR.length - 1];
  const cn = ratio >= 1 ? "12" : band[2];
  const poly = ratio >= 1 ? "最密堆積" : band[3];
  const W = 380, H = 190, L = 20, Rr = 20;
  const x = (v: number) => L + Math.min(v, 1.05) / 1.05 * (W - L - Rr);
  const cols = [C.gold, C.teal, C.orange, C.blue, C.rose];
  // 下方：陽離子在陰離子圍成的空隙中（剖面示意）
  const n = +cn >= 12 ? 6 : +cn >= 8 ? 4 : +cn === 6 ? 4 : +cn === 4 ? 3 : +cn;
  const cx = 190, cy = 166, ra = 22;
  const rc = ra * ratio;
  // 陽離子太小時陰離子彼此相碰、陽離子在空隙裡晃動
  const ringR = Math.max(ra + rc, ra / Math.sin(Math.PI / n));
  const anions = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return [cx + ringR * Math.cos(a), cy + ringR * Math.sin(a)];
  });
  const svg = (
    <svg viewBox={`0 0 ${W} 232`} className="ix-svg" role="img" aria-label="半徑比與配位數">
      {RR.map(([a, b, c, nm], i) => (
        <g key={c}>
          <rect x={x(a)} y={20} width={x(b) - x(a)} height={34} fill={cols[i]} fillOpacity={0.35} stroke={INK} strokeWidth={1} />
          <text x={(x(a) + x(b)) / 2} y={35} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{x(b) - x(a) > 40 ? `CN ${c}` : c}</text>
          {x(b) - x(a) > 40 ? <text x={(x(a) + x(b)) / 2} y={49} textAnchor="middle" style={{ fontSize: 9.5 }}>{nm}</text> : null}
        </g>
      ))}
      {[0.155, 0.225, 0.414, 0.732, 1].map((v, i) => (
        <text key={v} x={x(v)} y={i === 1 ? 78 : 66} textAnchor="middle" style={{ fontSize: 9.5 }}>{v}</text>
      ))}
      {IONS.map(([nm, rad]) => (
        <g key={nm} opacity={nm === ion ? 1 : 0.45}>
          <line x1={x(rad / RX)} x2={x(rad / RX)} y1={16} y2={58} stroke={INK} strokeWidth={nm === ion ? 2 : 1} />
        </g>
      ))}
      <polygon points={`${x(ratio)},14 ${x(ratio) - 6},4 ${x(ratio) + 6},4`} fill={C.orange} stroke={INK} />
      <text x={W / 2} y={94} textAnchor="middle" style={{ fontSize: 11 }}>R<tspan baselineShift="sub" style={{ fontSize: 8 }}>A</tspan> ／ R<tspan baselineShift="sub" style={{ fontSize: 8 }}>X</tspan>（O²⁻ = 1.40 Å）</text>
      {anions.map(([ax, ay], i) => (
        <circle key={i} cx={ax} cy={ay} r={ra} fill="var(--teal)" fillOpacity={0.25} stroke={INK} strokeWidth={1.2} />
      ))}
      <circle cx={cx} cy={cy} r={Math.max(rc, 2)} fill={C.orange} stroke={INK} strokeWidth={1.2} />
      <text x={20} y={130} style={{ fontSize: 10.5 }}>剖面示意</text>
      <text x={20} y={145} style={{ fontSize: 10.5 }}>藍：O²⁻</text>
      <text x={20} y={160} style={{ fontSize: 10.5 }}>橘：陽離子</text>
    </svg>
  );
  return (
    <Shell title="互動：半徑比決定配位數（Pauling 第一則）" sub="陽離子越大，周圍塞得下越多陰離子" svg={svg}>
      <div className="ix-btns">
        {IONS.map(([nm, rad]) => (
          <button key={nm} type="button" className="ix-btn" aria-pressed={ion === nm} onClick={() => { setIon(nm); setR(rad); }}>{nm}</button>
        ))}
      </div>
      <Slider label="陽離子半徑 R_A" value={r} show={`${fmt(r, 2)} Å`} min={0.1} max={1.6} step={0.01} onChange={(v) => { setR(v); setIon(""); }} />
      <div className="ix-readout">
        R<sub>A</sub>／R<sub>X</sub> = {fmt(r, 2)} ／ 1.40 = <b>{fmt(ratio, 3)}</b>
        <br />預測配位數：<b>CN {cn}（{poly}）</b>
        {ion ? <><br />實際：{IONS.find((i) => i[0] === ion)?.[2]}</> : null}
      </div>
      <div className="ix-note">
        臨界值來自幾何：陽離子剛好同時碰到所有陰離子、陰離子彼此也相碰時的半徑比。例如八面體的切面是四個陰離子圍成正方形，對角線 2(R<sub>A</sub> + R<sub>X</sub>) = 2√2 R<sub>X</sub>，所以 R<sub>A</sub>／R<sub>X</sub> = √2 − 1 = 0.414。比臨界值小的陽離子會在空隙裡「晃動」，結構不穩，只好降一級配位數。Al³⁺ 剛好在 0.36 附近，所以長石裡是四配位、雲母和剛玉裡是六配位。半徑用 Ahrens (1952) 值；用 Shannon 半徑算出的比值會稍有不同。
      </div>
    </Shell>
  );
}

/* ───────────── Ch4 作業三：金屬晶格密度 ───────────── */

type Lat = "fcc" | "bcc" | "hcp";
const LAT: Record<Lat, { name: string; n: number; r: number; M: number; el: string; apf: number }> = {
  fcc: { name: "面心立方 FCC", n: 4, r: 125, M: 58.933, el: "Co", apf: 0.74 },
  bcc: { name: "體心立方 BCC", n: 2, r: 124, M: 55.845, el: "Fe", apf: 0.68 },
  hcp: { name: "六方最密 HCP", n: 6, r: 160, M: 24.305, el: "Mg", apf: 0.74 },
};

export function PackingDensityDemo() {
  const [lat, setLat] = useState<Lat>("fcc");
  const [r, setR] = useState(LAT.fcc.r);
  const [M, setM] = useState(LAT.fcc.M);
  const L = LAT[lat];
  const NA = 6.022e23;
  const rcm = r * 1e-10;
  let a = 0, c = 0, V = 0, aTxt = "", vTxt = "";
  if (lat === "fcc") { a = 2 * Math.SQRT2 * rcm; V = a ** 3; aTxt = "面對角線 = 4r → a = 2√2 r"; vTxt = "V = a³"; }
  if (lat === "bcc") { a = (4 * rcm) / Math.sqrt(3); V = a ** 3; aTxt = "體對角線 = 4r → a = 4r／√3"; vTxt = "V = a³"; }
  if (lat === "hcp") { a = 2 * rcm; c = a * Math.sqrt(8 / 3); V = ((3 * Math.sqrt(3)) / 2) * a * a * c; aTxt = "a = 2r，c = √(8/3)·a ≈ 1.633a"; vTxt = "V = (3√3／2)a²c（六角柱）"; }
  const m = (L.n * M) / NA;
  const rho = m / V;
  const sci = (v: number, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))); return `${fmt(v / 10 ** e, d)}×10${String(e).replace("-", "⁻").replace(/\d/g, (k) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+k])}`; };
  const s = 70;
  const svg = (
    <svg viewBox="0 0 320 220" className="ix-svg" role="img" aria-label="晶胞示意">
      {lat !== "hcp" ? (
        <g transform="translate(100,40)">
          {/* 立方體：正面 + 斜後面 */}
          <rect x={0} y={30} width={s * 1.6} height={s * 1.6} fill="none" stroke={INK} strokeWidth={1.5} />
          <rect x={36} y={0} width={s * 1.6} height={s * 1.6} fill="none" stroke={INK} strokeWidth={1} strokeDasharray="3 3" />
          {[[0, 30], [s * 1.6, 30], [0, 30 + s * 1.6], [s * 1.6, 30 + s * 1.6]].map(([px, py], i) => (
            <line key={i} x1={px} y1={py} x2={px + 36} y2={py - 30} stroke={INK} strokeWidth={1} />
          ))}
          {[[0, 30], [s * 1.6, 30], [0, 30 + s * 1.6], [s * 1.6, 30 + s * 1.6], [36, 0], [36 + s * 1.6, 0], [36, s * 1.6], [36 + s * 1.6, s * 1.6]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r={9} fill="var(--teal)" fillOpacity={0.6} stroke={INK} />
          ))}
          {lat === "bcc" ? <circle cx={18 + s * 0.8} cy={15 + s * 0.8} r={11} fill={C.orange} stroke={INK} /> : null}
          {lat === "fcc"
            ? [[s * 0.8, 30 + s * 0.8], [36 + s * 0.8, s * 0.8], [18, 15 + s * 0.8], [18 + s * 1.6, 15 + s * 0.8], [18 + s * 0.8, 15], [18 + s * 0.8, 15 + s * 1.6]].map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r={9} fill={C.orange} stroke={INK} />
              ))
            : null}
        </g>
      ) : (
        <g transform="translate(160,110)">
          {[-1, 1].map((k) => (
            <polygon key={k} points={Array.from({ length: 6 }, (_, i) => `${70 * Math.cos(rad(60 * i))},${k * 70 + 22 * Math.sin(rad(60 * i))}`).join(" ")} fill="none" stroke={INK} strokeWidth={1.4} />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={i} x1={70 * Math.cos(rad(60 * i))} y1={-70 + 22 * Math.sin(rad(60 * i))} x2={70 * Math.cos(rad(60 * i))} y2={70 + 22 * Math.sin(rad(60 * i))} stroke={INK} strokeWidth={1} strokeDasharray={i < 3 ? "" : "3 3"} />
          ))}
          {[-1, 1].flatMap((k) => [[0, k * 70], ...Array.from({ length: 6 }, (_, i) => [70 * Math.cos(rad(60 * i)), k * 70 + 22 * Math.sin(rad(60 * i))])]).map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r={8} fill="var(--teal)" fillOpacity={0.6} stroke={INK} />
          ))}
          {[[-30, -8], [30, -8], [0, 12]].map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r={10} fill={C.orange} stroke={INK} />
          ))}
          <text x={0} y={104} textAnchor="middle" style={{ fontSize: 11 }}>中間層 B（橘）；上下層 A</text>
        </g>
      )}
      <text x={10} y={214} style={{ fontSize: 11 }}>每個晶胞含 {L.n} 個原子；堆積率 {L.apf}</text>
    </svg>
  );
  return (
    <Shell title="互動：由原子半徑算金屬密度（作業三）" sub="a → V → m → ρ，四步驟" svg={svg}>
      <Btns opts={[["fcc", "FCC"], ["bcc", "BCC"], ["hcp", "HCP"]]} value={lat} onChange={(k) => { setLat(k); setR(LAT[k].r); setM(LAT[k].M); }} />
      <Slider label="原子半徑 r" value={r} show={`${r} pm`} min={50} max={250} step={1} onChange={setR} />
      <Slider label="莫耳質量 M" value={M} show={`${fmt(M, 3)} g/mol`} min={5} max={210} step={0.001} onChange={setM} />
      <div className="ix-readout">
        ① {aTxt}：a = <b>{fmt(a * 1e10, 1)} pm</b>{lat === "hcp" ? <>，c = {fmt(c * 1e10, 1)} pm</> : null}
        <br />② {vTxt} = <b>{sci(V)} cm³</b>
        <br />③ m = n·M／N<sub>A</sub> = {L.n} × {fmt(M, 3)}／6.022×10²³ = <b>{sci(m)} g</b>
        <br />④ ρ = m／V = <b>{fmt(rho, 2)} g/cm³</b>
      </div>
      <div className="ix-note">
        預設值是作業三的三題（{L.el}）：FCC 約 8.86、BCC 約 7.90、HCP 約 1.74 g/cm³，和鈷、鐵、鎂的實測密度幾乎一樣。n 的來源：FCC = 8 角 × 1/8 + 6 面心 × 1/2 = 4；BCC = 8 × 1/8 + 1 = 2；HCP 六角柱 = 12 角 × 1/6 + 2 面心 × 1/2 + 中間 3 = 6。單位換算 1 pm = 10⁻¹⁰ cm。
      </div>
    </Shell>
  );
}

/* ───────────── Ch3：布拉格定律 ───────────── */

export function BraggDemo() {
  const [d, setD] = useState(3.34);
  const [lam, setLam] = useState(1.5406);
  const [n, setN] = useState(1);
  const s = (n * lam) / (2 * d);
  const ok = s <= 1;
  const th = ok ? (Math.asin(s) * 180) / Math.PI : NaN;
  const show = ok ? th : 25;
  const W = 380, H = 230, y1 = 120, gap = 60, x0 = 190;
  const t = rad(show);
  const Lr = 150;
  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="布拉格繞射">
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <line x1={20} x2={W - 20} y1={y1 + k * gap} y2={y1 + k * gap} stroke={INK} strokeOpacity={0.35} />
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={30 + i * 40} cy={y1 + k * gap} r={5} fill="var(--teal)" fillOpacity={0.6} stroke={INK} />
          ))}
        </g>
      ))}
      {[0, 1].map((k) => {
        const yy = y1 + k * gap;
        return (
          <g key={k} stroke={k ? C.orange : C.rose} strokeWidth={2.2} fill="none">
            <line x1={x0 - Lr * Math.cos(t)} y1={yy - Lr * Math.sin(t)} x2={x0} y2={yy} />
            <line x1={x0} y1={yy} x2={x0 + Lr * Math.cos(t)} y2={yy - Lr * Math.sin(t)} />
          </g>
        );
      })}
      {/* 多走的路：2 d sinθ */}
      <line x1={x0} y1={y1} x2={x0 - gap * Math.sin(t) * Math.cos(t)} y2={y1 + gap * Math.sin(t) * Math.sin(t)} stroke={INK} strokeDasharray="3 3" />
      <line x1={x0} y1={y1} x2={x0 + gap * Math.sin(t) * Math.cos(t)} y2={y1 + gap * Math.sin(t) * Math.sin(t)} stroke={INK} strokeDasharray="3 3" />
      <text x={x0 + 8} y={y1 + gap / 2 + 4} style={{ fontSize: 11 }}>d</text>
      <line x1={x0} x2={x0} y1={y1} y2={y1 + gap} stroke={INK} strokeWidth={1} />
      <text x={x0 - 92} y={y1 - 6} style={{ fontSize: 11 }}>θ</text>
      <text x={20} y={20} style={{ fontSize: 12, fontWeight: 800 }}>第二道光多走 2d sinθ（虛線兩段）</text>
      <text x={20} y={38} style={{ fontSize: 11.5 }}>{ok ? `= ${fmt(2 * d * s, 3)} Å = ${n}λ → 波峰疊加，繞射增強` : "nλ／2d > 1：這組晶面不會產生這一階繞射"}</text>
    </svg>
  );
  return (
    <Shell title="互動：布拉格定律 nλ = 2d sinθ" sub="給晶面間距和波長，算繞射角" svg={svg}>
      <Slider label="晶面間距 d" value={d} show={`${fmt(d, 2)} Å`} min={0.5} max={10} step={0.01} onChange={setD} />
      <Slider label="X 光波長 λ" value={lam} show={`${fmt(lam, 4)} Å`} min={0.5} max={2.5} step={0.0001} onChange={setLam} />
      <Btns opts={[["1", "n = 1"], ["2", "n = 2"], ["3", "n = 3"]]} value={String(n) as "1" | "2" | "3"} onChange={(k) => setN(+k)} />
      <div className="ix-readout">
        sinθ = nλ／2d = {n} × {fmt(lam, 4)}／(2 × {fmt(d, 2)}) = <b>{fmt(s, 4)}</b>
        <br />{ok ? <>θ = <b>{fmt(th, 2)}°</b>，XRD 圖上的位置 2θ = <b>{fmt(2 * th, 2)}°</b></> : <b>無解（sinθ 不能大於 1）</b>}
      </div>
      <div className="ix-note">
        預設是銅靶 Kα（λ = 1.5406 Å）和石英最強的 (101) 峰（d = 3.34 Å），算出 2θ ≈ 26.6°，就是石英 XRD 圖最高的那根峰。d 越小，2θ 越大；XRD 儀器量的是 2θ，用布拉格定律換回 d，再和資料庫比對就能鑑定礦物。
      </div>
    </Shell>
  );
}

/* ───────────── Ch5：Miller 指數 ───────────── */

type Fr = [number, number]; // 分子／分母；[1,0] 代表 ∞
const INT_OPTS: [string, Fr][] = [["1/2", [1, 2]], ["1", [1, 1]], ["2", [2, 1]], ["3", [3, 1]], ["4", [4, 1]], ["6", [6, 1]], ["∞", [1, 0]]];
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

export function MillerDemo() {
  const [ia, setIa] = useState("2");
  const [ib, setIb] = useState("3");
  const [ic, setIc] = useState("1");
  const ints = [ia, ib, ic].map((k) => INT_OPTS.find((o) => o[0] === k)![1]);
  // 倒數：p/q → q/p；∞ → 0
  const recs: Fr[] = ints.map(([p, q]) => (q === 0 ? [0, 1] : [q, p]));
  const L = recs.reduce((acc, [, q]) => lcm(acc, q), 1);
  let hkl = recs.map(([p, q]) => (p * L) / q);
  const g = hkl.reduce((acc, v) => gcd(acc, v), 0) || 1;
  hkl = hkl.map((v) => v / g);
  const fracTxt = (f: Fr) => (f[0] === 0 ? "0" : f[1] === 1 ? `${f[0]}` : `${f[0]}/${f[1]}`);
  // 斜投影：a 往左下、b 往右、c 往上
  const O = [150, 200];
  const ax = [-0.55, 0.45], bx = [1, 0], cx = [0, -1];
  const u = 28;
  const P = (va: number, vb: number, vc: number) => [O[0] + u * (va * ax[0] + vb * bx[0] + vc * cx[0]), O[1] + u * (va * ax[1] + vb * bx[1] + vc * cx[1])];
  const vals = ints.map(([p, q]) => (q === 0 ? Infinity : p / q));
  const big = 5.2;
  const pts: number[][] = [];
  const fin = vals.map((v) => isFinite(v));
  if (fin.every(Boolean)) pts.push(P(vals[0], 0, 0), P(0, vals[1], 0), P(0, 0, vals[2]));
  else {
    // 和 ∞ 的軸平行：畫平行四邊形
    const f = vals.map((v) => (isFinite(v) ? v : 0));
    const inf = fin.map((k) => !k);
    const dir = (i: number, s: number) => [i === 0 ? s : 0, i === 1 ? s : 0, i === 2 ? s : 0];
    const finIdx = [0, 1, 2].filter((i) => fin[i]);
    const infIdx = [0, 1, 2].filter((i) => inf[i]);
    const base = finIdx.map((i) => dir(i, f[i]));
    if (finIdx.length === 2) {
      const e = dir(infIdx[0], big * 0.8);
      const [A, B] = base;
      pts.push(P(A[0], A[1], A[2]), P(B[0], B[1], B[2]), P(B[0] + e[0], B[1] + e[1], B[2] + e[2]), P(A[0] + e[0], A[1] + e[1], A[2] + e[2]));
    } else if (finIdx.length === 1) {
      const A = base[0];
      const e1 = dir(infIdx[0], big * 0.8), e2 = dir(infIdx[1], big * 0.8);
      pts.push(P(A[0], A[1], A[2]), P(A[0] + e1[0], A[1] + e1[1], A[2] + e1[2]), P(A[0] + e1[0] + e2[0], A[1] + e1[1] + e2[1], A[2] + e1[2] + e2[2]), P(A[0] + e2[0], A[1] + e2[1], A[2] + e2[2]));
    }
  }
  const sel = (v: string, set: (s: string) => void, nm: string) => (
    <div className="ix-row">
      <label><span>{nm} 軸截距</span><span>{v}</span></label>
      <div className="ix-btns">
        {INT_OPTS.map(([k]) => (
          <button key={k} type="button" className="ix-btn" aria-pressed={v === k} onClick={() => set(k)} style={{ fontSize: "0.75rem", padding: "0.15rem 0.45rem" }}>{k}</button>
        ))}
      </div>
    </div>
  );
  const svg = (
    <svg viewBox="0 0 330 270" className="ix-svg" role="img" aria-label="Miller 指數">
      {[[ax, "a", 4.6], [bx, "b", 5.6], [cx, "c", 5.6]].map(([v, nm, len]) => {
        const vv = v as number[];
        const l = len as number;
        return (
          <g key={nm as string}>
            <line x1={O[0]} y1={O[1]} x2={O[0] + u * l * vv[0]} y2={O[1] + u * l * vv[1]} stroke={INK} strokeWidth={1.5} />
            <text x={O[0] + u * (l + 0.4) * vv[0]} y={O[1] + u * (l + 0.4) * vv[1] + 4} textAnchor="middle" style={{ fontWeight: 800 }}>{nm as string}</text>
            {[1, 2, 3, 4, 5].filter((k) => k <= l).map((k) => (
              <circle key={k} cx={O[0] + u * k * vv[0]} cy={O[1] + u * k * vv[1]} r={2} fill={INK} />
            ))}
          </g>
        );
      })}
      {pts.length ? <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={C.orange} fillOpacity={0.3} stroke={C.orange} strokeWidth={2} /> : null}
    </svg>
  );
  return (
    <Shell title="互動：Miller 指數" sub="截距 → 倒數 → 通分成最小整數" svg={svg}>
      {sel(ia, setIa, "a")}
      {sel(ib, setIb, "b")}
      {sel(ic, setIc, "c")}
      <div className="ix-readout">
        截距：{ia}, {ib}, {ic}
        <br />倒數：{recs.map(fracTxt).join(", ")}
        <br />乘以 {L}{g > 1 ? `、再除以公因數 ${g}` : ""} → <b>({hkl.join("")})</b>
      </div>
      <div className="ix-note">
        和某軸平行（截距 ∞）時倒數是 0。例：2a、3b、c → 1/2、1/3、1 → ×6 → (326)，這就是考古題的答案。圓括號 (hkl) 是單一晶面，大括號 {"{hkl}"} 是對稱上等價的晶面族（例如立方體 {"{100}"} 有六個面），方括號 [uvw] 是方向。六方晶系用四個指數 (hkil)，且 i = −(h + k)。
      </div>
    </Shell>
  );
}

/* ───────────── Ch8：二元共晶相圖（透輝石–鈣長石） ───────────── */

const DI = 1392, AN = 1553, TE = 1274, XE = 0.42;
const liqDi = (x: number) => DI - (DI - TE) * Math.pow(x / XE, 1.35); // 0 ≤ x ≤ XE
const liqAn = (x: number) => AN - (AN - TE) * Math.pow((1 - x) / (1 - XE), 1.35); // XE ≤ x ≤ 1
const invDi = (T: number) => XE * Math.pow((DI - T) / (DI - TE), 1 / 1.35);
const invAn = (T: number) => 1 - (1 - XE) * Math.pow((AN - T) / (AN - TE), 1 / 1.35);

export function EutecticDemo() {
  const [X, setX] = useState(0.7);
  const [T, setT] = useState(1450);
  const W = 380, H = 260, L = 46, R = 14, Tp = 14, B = 40;
  const x = (v: number) => L + v * (W - L - R);
  const Tmin = 1150, Tmax = 1600;
  const y = (t: number) => Tp + (1 - (t - Tmin) / (Tmax - Tmin)) * (H - Tp - B);
  const liqT = X <= XE ? liqDi(X) : liqAn(X);
  let phases = "", comp = "", lever = "", F = 0, xl = X, solidX: number | null = null;
  if (T >= liqT) { phases = "只有液體（熔體）"; comp = `液體 = ${fmt(X * 100)} % An`; lever = "液體 100 %"; F = 2; }
  else if (T > TE) {
    if (X < XE) { xl = invDi(T); solidX = 0; phases = "透輝石 + 液體"; const fl = X / xl; lever = `液體 ${fmt(fl * 100)} %、透輝石 ${fmt((1 - fl) * 100)} %`; }
    else { xl = invAn(T); solidX = 1; phases = "鈣長石 + 液體"; const fl = (1 - X) / (1 - xl); lever = `液體 ${fmt(fl * 100)} %、鈣長石 ${fmt((1 - fl) * 100)} %`; }
    comp = `液體 = ${fmt(xl * 100)} % An（沿液相線移動）`; F = 1;
  } else if (Math.abs(T - TE) < 1e-9) { phases = "透輝石 + 鈣長石 + 液體（共晶點）"; comp = `液體 = ${XE * 100} % An`; lever = "三相共存，溫度停在 1274 °C 直到液體用完"; F = 0; }
  else { phases = "透輝石 + 鈣長石（全部固化）"; comp = "兩種純礦物"; lever = `透輝石 ${fmt((1 - X) * 100)} %、鈣長石 ${fmt(X * 100)} %`; F = 1; }
  const dpath = (f: (v: number) => number, a: number, b: number) => Array.from({ length: 41 }, (_, i) => { const v = a + ((b - a) * i) / 40; return `${i ? "L" : "M"}${x(v)},${y(f(v))}`; }).join("");
  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="透輝石鈣長石共晶相圖">
      <path d={`${dpath(liqDi, 0, XE)} L${x(XE)},${y(TE)} ${dpath(liqAn, XE, 1).replace("M", "L")} L${x(1)},${y(Tmax)} L${x(0)},${y(Tmax)} Z`} fill={C.rose} fillOpacity={0.1} />
      <path d={dpath(liqDi, 0, XE)} fill="none" stroke={C.rose} strokeWidth={2.5} />
      <path d={dpath(liqAn, XE, 1)} fill="none" stroke={C.rose} strokeWidth={2.5} />
      <line x1={x(0)} x2={x(1)} y1={y(TE)} y2={y(TE)} stroke={C.blue} strokeWidth={2.5} />
      <circle cx={x(XE)} cy={y(TE)} r={5} fill={C.gold} stroke={INK} />
      <rect x={L} y={Tp} width={W - L - R} height={H - Tp - B} fill="none" stroke={INK} strokeWidth={1.5} />
      <text x={x(0.5)} y={y(1560)} textAnchor="middle" style={{ fontSize: 11 }}>液體 L</text>
      <text x={x(0.16)} y={y(1300)} textAnchor="middle" style={{ fontSize: 10.5 }}>Di + L</text>
      <text x={x(0.78)} y={y(1360)} textAnchor="middle" style={{ fontSize: 10.5 }}>An + L</text>
      <text x={x(0.5)} y={y(1200)} textAnchor="middle" style={{ fontSize: 10.5 }}>Di + An（固體）</text>
      <text x={x(0.2)} y={y(1395)} style={{ fontSize: 10.5, fill: C.rose }}>液相線</text>
      <text x={x(0.02)} y={y(TE) + 13} style={{ fontSize: 10.5, fill: C.blue }}>固相線 1274 °C</text>
      <text x={x(XE)} y={y(TE) - 8} textAnchor="middle" style={{ fontSize: 10.5 }}>共晶點 E</text>
      {solidX !== null ? <line x1={x(solidX)} x2={x(xl)} y1={y(T)} y2={y(T)} stroke={C.orange} strokeWidth={3} /> : null}
      {solidX !== null ? <circle cx={x(xl)} cy={y(T)} r={4.5} fill={C.rose} stroke={INK} /> : null}
      <line x1={x(X)} x2={x(X)} y1={Tp} y2={H - B} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.6} />
      <circle cx={x(X)} cy={y(T)} r={6} fill="#fff" stroke="#000" strokeWidth={2} />
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => <text key={v} x={x(v)} y={H - B + 14} textAnchor="middle" style={{ fontSize: 10 }}>{v * 100}</text>)}
      {[1200, 1300, 1400, 1500, 1600].map((t) => <text key={t} x={L - 4} y={y(t) + 4} textAnchor="end" style={{ fontSize: 10 }}>{t}</text>)}
      <text x={x(0)} y={H - 6} style={{ fontSize: 11 }}>Di</text>
      <text x={x(1)} y={H - 6} textAnchor="end" style={{ fontSize: 11 }}>An</text>
      <text x={x(0.5)} y={H - 6} textAnchor="middle" style={{ fontSize: 11 }}>wt % 鈣長石</text>
    </svg>
  );
  return (
    <Shell title="互動：二元共晶相圖與槓桿定律" sub="透輝石–鈣長石（1 atm）；拉成分和溫度" svg={svg}>
      <Slider label="整體成分 X" value={X} show={`${fmt(X * 100)} % An`} min={0} max={1} step={0.01} onChange={setX} />
      <Slider label="溫度 T" value={T} show={`${T} °C`} min={1200} max={1600} step={1} onChange={setT} />
      <button type="button" className="ix-btn" onClick={() => setT(TE)}>跳到共晶溫度 1274 °C</button>
      <div className="ix-readout">
        液相線溫度（開始結晶）：<b>{fmt(liqT)} °C</b>
        <br />相：<b>{phases}</b>
        <br />{comp}
        <br />槓桿定律：{lever}
        <br />自由度（等壓）F = C + 1 − P = <b>{F}</b>
      </div>
      <div className="ix-note">
        槓桿定律：在兩相區，畫一條水平連結線（橘），兩端是兩個相的成分。整體成分點把連結線分成兩段，某一相的比例 = <b>對面那段長度 ÷ 全長</b>。例如 70 % An 的熔體冷到液相線（約 1440 °C）開始析出鈣長石，液體成分沿液相線往共晶點移動；到 1274 °C 液體剩 30/58 ≈ 52 %，透輝石和鈣長石一起結晶直到液體用完。相圖依 Bowen (1915) 的端點與共晶點，曲線形狀是示意。
      </div>
    </Shell>
  );
}

/* ───────────── Ch8：完全固溶體（鎂橄欖石–鐵橄欖石） ───────────── */

const FO = 1890, FA = 1205;
const liqOl = (x: number) => FA + (FO - FA) * (1 - Math.pow(1 - x, 1.6));
const solOl = (x: number) => FA + (FO - FA) * Math.pow(x, 1.6);
const invLiq = (T: number) => 1 - Math.pow(1 - (T - FA) / (FO - FA), 1 / 1.6);
const invSol = (T: number) => Math.pow((T - FA) / (FO - FA), 1 / 1.6);

export function SolidSolutionDemo() {
  const [X, setX] = useState(0.7);
  const [T, setT] = useState(1750);
  const W = 380, H = 260, L = 46, R = 14, Tp = 14, B = 40;
  const x = (v: number) => L + v * (W - L - R);
  const Tmin = 1150, Tmax = 1950;
  const y = (t: number) => Tp + (1 - (t - Tmin) / (Tmax - Tmin)) * (H - Tp - B);
  const TL = liqOl(X), TS = solOl(X);
  let phases = "", comp = "", lever = "";
  let tie: [number, number] | null = null;
  if (T >= TL) { phases = "只有液體"; comp = `液體 = Fo${fmt(X * 100)}`; lever = "液體 100 %"; }
  else if (T <= TS) { phases = "只有橄欖石（單一固溶體）"; comp = `橄欖石 = Fo${fmt(X * 100)}`; lever = "固體 100 %"; }
  else {
    const xl = invLiq(T), xs = invSol(T);
    tie = [xl, xs];
    phases = "液體 + 橄欖石";
    comp = `液體 = Fo${fmt(xl * 100)}，析出的橄欖石 = Fo${fmt(xs * 100)}`;
    const fl = (xs - X) / (xs - xl);
    lever = `液體 ${fmt(fl * 100)} %、橄欖石 ${fmt((1 - fl) * 100)} %`;
  }
  const dpath = (f: (v: number) => number) => Array.from({ length: 51 }, (_, i) => `${i ? "L" : "M"}${x(i / 50)},${y(f(i / 50))}`).join("");
  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="橄欖石固溶體相圖">
      <path d={dpath(liqOl)} fill="none" stroke={C.rose} strokeWidth={2.5} />
      <path d={dpath(solOl)} fill="none" stroke={C.blue} strokeWidth={2.5} />
      <rect x={L} y={Tp} width={W - L - R} height={H - Tp - B} fill="none" stroke={INK} strokeWidth={1.5} />
      <text x={x(0.25)} y={y(1830)} style={{ fontSize: 11 }}>液體 L</text>
      <text x={x(0.55)} y={y(1300)} style={{ fontSize: 11 }}>橄欖石固溶體 Ol</text>
      <text x={x(0.33)} y={y(1640)} style={{ fontSize: 10.5, fill: C.rose }} transform={`rotate(-28 ${x(0.33)} ${y(1640)})`}>液相線</text>
      <text x={x(0.55)} y={y(1525)} style={{ fontSize: 10.5, fill: C.blue }} transform={`rotate(-34 ${x(0.55)} ${y(1525)})`}>固相線</text>
      {tie ? <line x1={x(tie[0])} x2={x(tie[1])} y1={y(T)} y2={y(T)} stroke={C.orange} strokeWidth={3} /> : null}
      {tie ? <><circle cx={x(tie[0])} cy={y(T)} r={4.5} fill={C.rose} stroke={INK} /><circle cx={x(tie[1])} cy={y(T)} r={4.5} fill={C.blue} stroke={INK} /></> : null}
      <line x1={x(X)} x2={x(X)} y1={Tp} y2={H - B} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.6} />
      <circle cx={x(X)} cy={y(T)} r={6} fill="#fff" stroke="#000" strokeWidth={2} />
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => <text key={v} x={x(v)} y={H - B + 14} textAnchor="middle" style={{ fontSize: 10 }}>{v * 100}</text>)}
      {[1200, 1400, 1600, 1800].map((t) => <text key={t} x={L - 4} y={y(t) + 4} textAnchor="end" style={{ fontSize: 10 }}>{t}</text>)}
      <text x={x(0)} y={H - 6} style={{ fontSize: 11 }}>Fa 1205 °C</text>
      <text x={x(1)} y={H - 6} textAnchor="end" style={{ fontSize: 11 }}>Fo 1890 °C</text>
      <text x={x(0.5)} y={H - 6} textAnchor="middle" style={{ fontSize: 11 }}>% Mg₂SiO₄</text>
    </svg>
  );
  return (
    <Shell title="互動：完全固溶體與槓桿定律" sub="Mg₂SiO₄–Fe₂SiO₄；液體和固體的成分都會變" svg={svg}>
      <Slider label="整體成分" value={X} show={`Fo${fmt(X * 100)}`} min={0} max={1} step={0.01} onChange={setX} />
      <Slider label="溫度 T" value={T} show={`${T} °C`} min={1200} max={1950} step={5} onChange={setT} />
      <div className="ix-btns">
        {[1900, 1750, 1650].map((t) => <button key={t} type="button" className="ix-btn" aria-pressed={T === t && X === 0.7} onClick={() => { setX(0.7); setT(t); }}>Fo70 @ {t}</button>)}
      </div>
      <div className="ix-readout">
        開始結晶（液相線）：<b>{fmt(TL)} °C</b>；完全固化（固相線）：<b>{fmt(TS)} °C</b>
        <br />相：<b>{phases}</b>
        <br />{comp}
        <br />槓桿定律：{lever}
      </div>
      <div className="ix-note">
        和共晶不同，這裡只有<b>一種</b>固體，但它的成分會變：最先析出的橄欖石最富 Mg（Fo 高、熔點高），隨著降溫，液體和固體都沿各自的曲線往 Fa 方向移動。平衡結晶時，最後固體成分回到整體成分；如果晶體來不及和液體反應，就會留下核心富 Mg、外圈富 Fe 的<b>環帶</b>。2024 期中 C5 考的就是這三個溫度：先在考卷附圖上畫水平連結線讀出兩端成分，再用槓桿定律算比例。這裡的曲線是示意形狀，數字要以考卷附圖量的為準，方法一樣。
      </div>
    </Shell>
  );
}

/* ───────────── Ch8／2025 考題：NaCl–KCl（最低熔點 + 固溶線） ───────────── */

// 示意：NaCl 801、KCl 771 °C；最低熔點約 657 °C、X_NaCl ≈ 0.5；固溶線頂點約 495 °C
const TNa = 801, TK = 771, TM = 657, XM = 0.5;
const nkLiq = (x: number) => (x >= XM ? TM + (TNa - TM) * Math.pow((x - XM) / (1 - XM), 0.7) : TM + (TK - TM) * Math.pow((XM - x) / XM, 0.7));
const nkSol = (x: number) => (x >= XM ? TM + (TNa - TM) * Math.pow((x - XM) / (1 - XM), 1.8) : TM + (TK - TM) * Math.pow((XM - x) / XM, 1.8));
const SC = 495, SX = 0.62; // 固溶線頂點（X_NaCl）
const solvus = (x: number) => { const w = x >= SX ? (x - SX) / (1 - SX) : (SX - x) / SX; return SC - (SC - 20) * Math.pow(w, 2); };
const solvusLimbs = (T: number) => { const w = Math.pow((SC - T) / (SC - 20), 0.5); return [SX - w * SX, SX + w * (1 - SX)]; };
const invBranch = (f: (x: number) => number, T: number, a: number, b: number) => { let lo = a, hi = b; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if ((f(m) - T) * (f(lo) - T) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; };

export function SylviteHaliteDemo() {
  const [X, setX] = useState(0.72);
  const [T, setT] = useState(800);
  const W = 380, H = 260, L = 46, R = 14, Tp = 14, B = 40;
  const x = (v: number) => L + v * (W - L - R);
  const Tmin = 200, Tmax = 850;
  const y = (t: number) => Tp + (1 - (t - Tmin) / (Tmax - Tmin)) * (H - Tp - B);
  const TL = nkLiq(X), TS = nkSol(X), TV = solvus(X);
  let phases = "", comp = "";
  let tie: [number, number] | null = null;
  if (T >= TL) { phases = "只有熔體 L"; comp = `熔體 = ${fmt(X * 100)} mol% NaCl`; }
  else if (T > TS) {
    const right = X >= XM;
    const xl = right ? invBranch(nkLiq, T, XM, 1) : invBranch(nkLiq, T, 0, XM);
    const xs = right ? invBranch(nkSol, T, XM, 1) : invBranch(nkSol, T, 0, XM);
    tie = [xl, xs];
    const fl = (xs - X) / (xs - xl);
    phases = right ? "熔體 + 岩鹽固溶體（富 NaCl）" : "熔體 + 鉀鹽固溶體（富 KCl）";
    comp = `熔體 = ${fmt(xl * 100)} %、固體 = ${fmt(xs * 100)} % NaCl；熔體 ${fmt(fl * 100)} %`;
  } else if (T > TV) { phases = "單一（Na,K)Cl 固溶體"; comp = `固溶體 = ${fmt(X * 100)} % NaCl`; }
  else {
    const [a, b] = solvusLimbs(T);
    tie = [a, b];
    const fb = (X - a) / (b - a);
    phases = "岩鹽固溶體 + 鉀鹽固溶體（離溶）";
    comp = `富 KCl 相 = ${fmt(a * 100)} %、富 NaCl 相 = ${fmt(b * 100)} % NaCl；富 NaCl 相占 ${fmt(fb * 100)} %`;
  }
  const dp = (f: (v: number) => number, a = 0, b = 1) => Array.from({ length: 61 }, (_, i) => { const v = a + ((b - a) * i) / 60; return `${i ? "L" : "M"}${x(v)},${y(f(v))}`; }).join("");
  const sv = Array.from({ length: 61 }, (_, i) => { const t = Tmin + ((SC - Tmin) * i) / 60; return solvusLimbs(t); });
  const solvusPath = `M${sv.map(([a], i) => `${x(a)},${y(Tmin + ((SC - Tmin) * i) / 60)}`).join(" L")} L${sv.slice().reverse().map(([, b], i) => `${x(b)},${y(SC - ((SC - Tmin) * i) / 60)}`).join(" L")}`;
  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="鉀鹽岩鹽二元相圖">
      <path d={dp(nkLiq)} fill="none" stroke={C.rose} strokeWidth={2.5} />
      <path d={dp(nkSol)} fill="none" stroke={C.blue} strokeWidth={2.5} />
      <path d={solvusPath} fill={C.gold} fillOpacity={0.15} stroke={C.green} strokeWidth={2.5} />
      <rect x={L} y={Tp} width={W - L - R} height={H - Tp - B} fill="none" stroke={INK} strokeWidth={1.5} />
      <circle cx={x(XM)} cy={y(TM)} r={5} fill={C.gold} stroke={INK} />
      <text x={x(XM) - 8} y={y(TM) + 4} textAnchor="end" style={{ fontSize: 10 }}>最低熔點 657 °C</text>
      <text x={x(0.5)} y={y(810)} textAnchor="middle" style={{ fontSize: 11 }}>熔體 L</text>
      <text x={x(0.5)} y={y(560)} textAnchor="middle" style={{ fontSize: 10.5 }}>單一 (Na,K)Cl 固溶體</text>
      <text x={x(0.6)} y={y(330)} textAnchor="middle" style={{ fontSize: 10.5 }}>岩鹽 ss + 鉀鹽 ss</text>
      <text x={x(0.93)} y={y(470)} textAnchor="middle" style={{ fontSize: 10, fill: C.green }}>固溶線</text>
      <text x={x(0.85)} y={y(735)} textAnchor="middle" style={{ fontSize: 10, fill: C.rose }}>液相線</text>
      <text x={x(0.88)} y={y(675)} textAnchor="middle" style={{ fontSize: 10, fill: C.blue }}>固相線</text>
      {tie ? <line x1={x(tie[0])} x2={x(tie[1])} y1={y(T)} y2={y(T)} stroke={C.orange} strokeWidth={3} /> : null}
      <line x1={x(X)} x2={x(X)} y1={Tp} y2={H - B} stroke={INK} strokeDasharray="3 3" strokeOpacity={0.6} />
      <circle cx={x(X)} cy={y(T)} r={6} fill="#fff" stroke="#000" strokeWidth={2} />
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => <text key={v} x={x(v)} y={H - B + 14} textAnchor="middle" style={{ fontSize: 10 }}>{v * 100}</text>)}
      {[200, 400, 600, 800].map((t) => <text key={t} x={L - 4} y={y(t) + 4} textAnchor="end" style={{ fontSize: 10 }}>{t}</text>)}
      <text x={x(0)} y={H - 6} style={{ fontSize: 11 }}>KCl</text>
      <text x={x(1)} y={H - 6} textAnchor="end" style={{ fontSize: 11 }}>NaCl</text>
      <text x={x(0.5)} y={H - 6} textAnchor="middle" style={{ fontSize: 11 }}>mol % NaCl</text>
    </svg>
  );
  return (
    <Shell title="互動：鉀鹽–岩鹽相圖（2025 期中 C5–C7）" sub="液相線、固相線、固溶線三條線；O → A → B → C" svg={svg}>
      <Slider label="整體成分" value={X} show={`${fmt(X * 100)} mol% NaCl`} min={0} max={1} step={0.01} onChange={setX} />
      <Slider label="溫度 T" value={T} show={`${T} °C`} min={200} max={850} step={5} onChange={setT} />
      <div className="ix-btns">
        {[["O", 800], ["A", 700], ["B", 550], ["C", 300]].map(([k, t]) => (
          <button key={k} type="button" className="ix-btn" aria-pressed={T === t && X === 0.72} onClick={() => { setX(0.72); setT(t as number); }}>{k} {t} °C</button>
        ))}
      </div>
      <div className="ix-readout">
        相：<b>{phases}</b>
        <br />{comp}
      </div>
      <div className="ix-note">
        這是「高溫完全固溶、低溫離溶」的系統，和投影片的鹼性長石（超固溶花崗岩）是同一種圖形。考卷把 657 °C 那點叫 eutectic point，嚴格說它是<b>最低熔點</b>（固溶線沒有碰到固相線，所以不是真的共晶），作答時兩個名字都寫上最安全。曲線形狀與數字是依文獻端點畫的示意，<b>實際作答要用考卷附圖讀值</b>，判斷的邏輯一樣：在哪一區 → 有哪些相 → 水平連結線兩端讀成分。
      </div>
    </Shell>
  );
}

/* ───────────── Transport：雷諾數 ───────────── */

export function ReynoldsDemo() {
  const [lr, setLr] = useState(0); // log10 R (m)
  const [lv, setLv] = useState(-1); // log10 v (m/s)
  const [med, setMed] = useState<"w" | "a" | "i">("w");
  const M = { w: { n: "水", rho: 1000, mu: 1e-3 }, a: { n: "空氣", rho: 1.2, mu: 1.8e-5 }, i: { n: "冰河冰", rho: 917, mu: 1e13 } }[med];
  const Rh = 10 ** lr, v = 10 ** lv;
  const Re = (4 * Rh * M.rho * v) / M.mu;
  const regime = Re < 500 ? "層流 laminar" : Re < 2000 ? "過渡" : "紊流 turbulent";
  const lre = Math.log10(Re);
  const W = 380, H = 150;
  const xr = (l: number) => 20 + ((Math.max(-12, Math.min(10, l)) + 12) / 22) * (W - 40);
  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="雷諾數">
      <rect x={xr(-12)} y={40} width={xr(Math.log10(500)) - xr(-12)} height={30} fill={C.teal} fillOpacity={0.35} />
      <rect x={xr(Math.log10(500))} y={40} width={xr(Math.log10(2000)) - xr(Math.log10(500))} height={30} fill={C.gold} fillOpacity={0.45} />
      <rect x={xr(Math.log10(2000))} y={40} width={xr(10) - xr(Math.log10(2000))} height={30} fill={C.rose} fillOpacity={0.35} />
      <rect x={20} y={40} width={W - 40} height={30} fill="none" stroke={INK} />
      <text x={xr(-6)} y={60} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>層流</text>
      <text x={xr(6)} y={60} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>紊流</text>
      {[-12, -8, -4, 0, 4, 8].map((k) => <text key={k} x={xr(k)} y={86} textAnchor="middle" style={{ fontSize: 9.5 }}>10{String(k).replace("-", "⁻").replace(/\d/g, (q) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+q])}</text>)}
      <text x={xr(Math.log10(500))} y={34} textAnchor="middle" style={{ fontSize: 9.5 }}>500</text>
      <text x={xr(Math.log10(2000)) + 8} y={34} textAnchor="start" style={{ fontSize: 9.5 }}>2000</text>
      <polygon points={`${xr(lre)},74 ${xr(lre) - 7},92 ${xr(lre) + 7},92`} fill={C.orange} stroke={INK} />
      {/* 流線 */}
      {[0, 1, 2].map((k) => {
        const yy = 112 + k * 12;
        const amp = Re < 500 ? 0 : Re < 2000 ? 2 : 5;
        const d = Array.from({ length: 41 }, (_, i) => `${i ? "L" : "M"}${20 + i * 8.5},${yy + amp * Math.sin(i * 1.3 + k * 2) * Math.cos(i * 0.7)}`).join("");
        return <path key={k} d={d} fill="none" stroke={C.blue} strokeWidth={1.8} />;
      })}
    </svg>
  );
  return (
    <Shell title="互動：雷諾數 Re 判斷層流或紊流" sub="Re = 4 × 水力半徑 × 密度 × 平均流速 ／ 黏度" svg={svg}>
      <Btns opts={[["w", "水"], ["a", "空氣"], ["i", "冰河冰"]]} value={med} onChange={setMed} />
      <Slider label="水力半徑 R" value={lr} show={`${fmt(Rh, Rh < 0.1 ? 3 : 1)} m`} min={-3} max={1} step={0.05} onChange={setLr} />
      <Slider label="平均流速 v" value={lv} show={`${fmt(v, v < 0.01 ? 5 : 3)} m/s`} min={-5} max={1} step={0.05} onChange={setLv} />
      <div className="ix-readout">
        Re = 4 × {sci(Rh)} × {sci(M.rho)} × {sci(v)} ／ {sci(M.mu, 1)} = <b>{sci(Re, 1)}</b>
        <br />流態：<b>{regime}</b>
      </div>
      <div className="ix-note">
        水力半徑 = 截面積 ÷ 濕周長。投影片的例子：水的密度 10³ kg/m³、黏度 10⁻³ Pa·s，Re = 4×10⁶ × R × v；水深約 1 m 的河，流速只要超過 0.125 mm/s 就有 Re &gt; 500。所以<b>河流和風幾乎都是紊流</b>，只有黏度極高的冰河是層流——這就是冰磧物完全沒有分選的原因之一（冰不會用紊流把顆粒依大小分開）。
      </div>
    </Shell>
  );
}

/* ───────────── Transport：Stokes 沉降 ───────────── */

export function StokesDemo() {
  const [ld, setLd] = useState(-1.5); // log10 d (mm)
  const [med, setMed] = useState<"w" | "a">("w");
  const M = med === "w" ? { rho: 1000, mu: 1e-3, n: "水" } : { rho: 1.2, mu: 1.8e-5, n: "空氣" };
  const dmm = 10 ** ld;
  const dm = dmm / 1000;
  const v = ((2650 - M.rho) * 9.8 * dm * dm) / (18 * M.mu); // m/s
  const name = dmm < 0.004 ? "黏土" : dmm < 0.0625 ? "粉砂" : dmm < 2 ? "砂" : dmm < 64 ? "礫（卵石）" : "巨礫";
  const fall1m = 1 / v;
  const tTxt = fall1m < 60 ? `${fmt(fall1m, 1)} 秒` : fall1m < 3600 ? `${fmt(fall1m / 60, 1)} 分鐘` : fall1m < 86400 ? `${fmt(fall1m / 3600, 1)} 小時` : `${fmt(fall1m / 86400, 1)} 天`;
  const W = 380, H = 160;
  const xs = (l: number) => 20 + ((l + 4) / 6) * (W - 40);
  const bounds: [number, string, string][] = [[0.004, "黏土", C.violet], [0.0625, "粉砂", C.blue], [2, "砂", C.gold], [64, "礫", C.orange], [10000, "", C.rose]];
  let prev = -4;
  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="Udden-Wentworth 粒徑與沉降">
      {bounds.map(([b, nm, col]) => {
        const lb = Math.min(2, Math.log10(b));
        const r = <g key={nm + b}><rect x={xs(prev)} y={30} width={xs(lb) - xs(prev)} height={30} fill={col} fillOpacity={0.35} stroke={INK} strokeWidth={0.8} /><text x={(xs(prev) + xs(lb)) / 2} y={50} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{nm}</text></g>;
        prev = lb;
        return r;
      })}
      {[["1/256", 0.004], ["1/16", 0.0625], ["2", 2], ["64", 64]].map(([t, b]) => <text key={t as string} x={xs(Math.log10(b as number))} y={74} textAnchor="middle" style={{ fontSize: 9.5 }}>{t as string} mm</text>)}
      <polygon points={`${xs(ld)},26 ${xs(ld) - 6},14 ${xs(ld) + 6},14`} fill={C.orange} stroke={INK} />
      <text x={20} y={100} style={{ fontSize: 11.5 }}>懸浮（紊流渦旋撐得住）</text>
      <line x1={xs(-4)} x2={xs(Math.log10(0.0625))} y1={108} y2={108} stroke={C.blue} strokeWidth={4} />
      <text x={xs(Math.log10(0.0625)) + 4} y={130} style={{ fontSize: 11.5 }}>跳躍、滾動（底負載）</text>
      <line x1={xs(Math.log10(0.0625))} x2={xs(2)} y1={138} y2={138} stroke={C.orange} strokeWidth={4} />
      <text x={20} y={156} style={{ fontSize: 10 }}>（以河水為例，邊界會隨流速改變）</text>
    </svg>
  );
  return (
    <Shell title="互動：Stokes 定律——顆粒沉降有多快？" sub="v = (ρs − ρf) g d² ／ 18μ；石英 ρs = 2650 kg/m³" svg={svg}>
      <Btns opts={[["w", "在水中"], ["a", "在空氣中"]]} value={med} onChange={setMed} />
      <Slider label="粒徑 d" value={ld} show={`${dmm < 0.01 ? fmt(dmm * 1000, 1) + " μm" : fmt(dmm, dmm < 1 ? 3 : 1) + " mm"}（${name}）`} min={-3.5} max={0} step={0.05} onChange={setLd} />
      <div className="ix-readout">
        沉降速度 v ≈ <b>{sci(v)} m/s</b>
        <br />沉 1 公尺要 <b>{tTxt}</b>
      </div>
      <div className="ix-note">
        v 和 d² 成正比：粒徑小 10 倍，沉降慢 100 倍，所以只有黏土、粉砂能長時間懸浮。空氣的密度和黏度都很低，紊流撐不住大顆粒，只有很細的塵土能懸浮（沙塵暴、黃土 loess）。Stokes 定律只適用於細顆粒（約 0.1 mm 以下）；粗顆粒沉降時周圍也變成紊流，實際速度比公式算的慢。
      </div>
    </Shell>
  );
}

