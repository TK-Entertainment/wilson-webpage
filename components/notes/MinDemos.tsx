"use client";

import { Fragment, useState } from "react";
import { MINERALS, PLACES, TW_OUTLINE } from "./MinData";
import type { ReactElement } from "react";
import "./notes.css";

// 礦物學的互動圖
const INK = "currentColor";
const fmt = (x: number, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const rad = (d: number) => (d * Math.PI) / 180;

/* ───────────── 干涉色：由光程差算顏色 ───────────── */

// CIE 1931 配色函數的多段高斯近似（Wyman, Sloan & Shirley 2013）
const g = (l: number, mu: number, s1: number, s2: number) => Math.exp(-0.5 * Math.pow((l - mu) / (l < mu ? s1 : s2), 2));
const xbar = (l: number) => 1.056 * g(l, 599.8, 37.9, 31.0) + 0.362 * g(l, 442.0, 16.0, 26.7) - 0.065 * g(l, 501.1, 20.4, 26.2);
const ybar = (l: number) => 0.821 * g(l, 568.8, 46.9, 40.5) + 0.286 * g(l, 530.9, 16.3, 31.1);
const zbar = (l: number) => 1.217 * g(l, 437.0, 11.8, 36.0) + 0.681 * g(l, 459.0, 26.0, 13.8);
let Ywhite = 0;
for (let l = 380; l <= 760; l += 5) Ywhite += ybar(l);
const gam = (c: number) => {
  const v = Math.max(0, Math.min(1, c));
  return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
};
/** 正交偏光、45° 位置下，光程差 retardation（nm）對應的干涉色；k 是亮度倍數（0–1，消光時 0） */
export const interferenceRGB = (ret: number, k = 1) => {
  let X = 0, Y = 0, Z = 0;
  for (let l = 380; l <= 760; l += 5) {
    const T = Math.pow(Math.sin((Math.PI * ret) / l), 2) * k;
    X += T * xbar(l);
    Y += T * ybar(l);
    Z += T * zbar(l);
  }
  X /= Ywhite; Y /= Ywhite; Z /= Ywhite;
  const r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  const gg = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  const b = 0.0557 * X - 0.204 * Y + 1.057 * Z;
  return `rgb(${Math.round(gam(r) * 255)},${Math.round(gam(gg) * 255)},${Math.round(gam(b) * 255)})`;
};
const order = (ret: number) => (ret < 550 ? "一階" : ret < 1100 ? "二階" : ret < 1650 ? "三階" : "四階以上");

const BIREF: [string, number][] = [
  ["石英 Qz", 0.009],
  ["斜長石 Pl", 0.01],
  ["正長石 Or", 0.007],
  ["紫蘇輝石 Opx", 0.013],
  ["普通角閃石 Hb", 0.022],
  ["普通輝石 Cpx", 0.025],
  ["橄欖石 Ol", 0.036],
  ["白雲母 Mus", 0.04],
  ["黑雲母 Bi", 0.05],
  ["方解石 Cal", 0.17],
];

export function InterferenceDemo() {
  const [d, setD] = useState(30); // μm
  const [br, setBr] = useState(0.009);
  const ret = d * 1000 * br; // nm
  const W = 360, H = 230, L = 34, R = 12, T = 12, B = 34;
  const maxR = 1800, maxD = 50;
  const x = (r: number) => L + (r / maxR) * (W - L - R);
  const y = (t: number) => T + (1 - t / maxD) * (H - T - B);
  const strips: ReactElement[] = [];
  for (let r = 0; r < maxR; r += 10) strips.push(<rect key={r} x={x(r)} y={T} width={(W - L - R) / (maxR / 10) + 0.6} height={H - T - B} fill={interferenceRGB(r)} />);
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：干涉色表（Michel-Lévy）</b>
        <span>光程差 = 薄片厚度 × 雙折射率；拉厚度、選礦物，看干涉色</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="干涉色表">
          {strips}
          {BIREF.map(([n, b]) => {
            const rEnd = Math.min(maxR, maxD * 1000 * b);
            const tEnd = rEnd / (1000 * b);
            return <line key={n} x1={x(0)} y1={y(0)} x2={x(rEnd)} y2={y(tEnd)} stroke="#000" strokeOpacity={0.35} strokeWidth={0.8} />;
          })}
          <line x1={L} x2={W - R} y1={y(30)} y2={y(30)} stroke="#000" strokeDasharray="4 3" strokeOpacity={0.6} />
          <circle cx={x(Math.min(ret, maxR))} cy={y(d)} r={6} fill="#fff" stroke="#000" strokeWidth={2} />
          {[0, 550, 1100, 1650].map((r) => (
            <line key={r} x1={x(r)} x2={x(r)} y1={T} y2={H - B} stroke="#000" strokeOpacity={0.25} />
          ))}
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[0, 550, 1100, 1650].map((r) => (
            <text key={r} x={x(r)} y={H - B + 14} textAnchor="middle" style={{ fontSize: 10.5 }}>{r}</text>
          ))}
          {[0, 10, 20, 30, 40, 50].map((t) => (
            <text key={t} x={L - 4} y={y(t) + 4} textAnchor="end" style={{ fontSize: 10.5 }}>{t}</text>
          ))}
          <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 11.5 }}>光程差（nm）　一階｜二階｜三階</text>
          <text x={10} y={(T + H - B) / 2} transform={`rotate(-90 10 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 11 }}>厚度（μm）</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-btns">
            {BIREF.map(([n, b]) => (
              <button key={n} type="button" className="ix-btn" aria-pressed={br === b} onClick={() => setBr(b)} style={{ fontSize: "0.75rem" }}>{n}</button>
            ))}
          </div>
          <div className="ix-row">
            <label><span>薄片厚度 d</span><span>{d} μm</span></label>
            <input type="range" min={5} max={50} step={1} value={d} onChange={(e) => setD(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label><span>雙折射率 δ</span><span>{fmt(br, 3)}</span></label>
            <input type="range" min={0} max={0.2} step={0.001} value={br} onChange={(e) => setBr(+e.target.value)} />
          </div>
          <div className="ix-readout">
            光程差 Δ = d × δ = {d * 1000} nm × {fmt(br, 3)} = <b>{fmt(ret, 0)} nm</b>
            <br />干涉色：<span style={{ display: "inline-block", width: 18, height: 12, background: interferenceRGB(ret), border: "1px solid currentColor", verticalAlign: "middle" }} /> <b>{order(ret)}</b>
          </div>
          <div className="ix-note">
            標準薄片厚 30 μm（0.03 mm，虛線）。雙折射小的石英、長石在一階灰白；輝石、角閃石到二階的鮮豔顏色；方解石雙折射 0.17，光程差 5000 nm 以上，變成粉白的「高階白」。黑色斜線是各礦物的雙折射率，沿線往上就是越厚越高階。顏色由 sin²(πΔ/λ) 對可見光積分算出，和實際色表大致相同。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── 偏光顯微鏡：轉動載物台 ───────────── */

type Grain = { n: string; br: number; iso?: boolean; color: [string, string]; ext: "parallel" | "inclined" | "symmetric" | "undulose" | "none"; extAng?: number; cleave: number; twin?: boolean };
const GRAINS: Grain[] = [
  { n: "石英", br: 0.009, color: ["#f2f2f2", "#f2f2f2"], ext: "undulose", cleave: 0 },
  { n: "斜長石", br: 0.01, color: ["#f2f2f2", "#f2f2f2"], ext: "inclined", extAng: 20, cleave: 1, twin: true },
  { n: "黑雲母", br: 0.05, color: ["#d8b67a", "#4a2a12"], ext: "parallel", cleave: 1 },
  { n: "普通角閃石", br: 0.022, color: ["#c9d49a", "#2f4d24"], ext: "inclined", extAng: 18, cleave: 2 },
  { n: "普通輝石", br: 0.025, color: ["#ececdf", "#ececdf"], ext: "inclined", extAng: 40, cleave: 2 },
  { n: "方解石", br: 0.17, color: ["#f4f4f4", "#f4f4f4"], ext: "symmetric", cleave: 2 },
  { n: "石榴子石", br: 0, iso: true, color: ["#f0d8d4", "#f0d8d4"], ext: "none", cleave: 0 },
];

export function MicroscopeDemo() {
  const [gi, setGi] = useState(2);
  const [rot, setRot] = useState(20);
  const [xpl, setXpl] = useState(false);
  const gr = GRAINS[gi];
  const off = gr.ext === "inclined" ? gr.extAng ?? 0 : gr.ext === "symmetric" ? 45 : 0;
  const s2 = Math.pow(Math.sin(2 * rad(rot - off)), 2);
  const bright = gr.iso ? 0 : s2;
  const ret = 30000 * gr.br;
  const pleo = Math.pow(Math.cos(rad(rot)), 2); // 解理（長軸）東西向時最深
  const mix = (a: string, b: string, t: number) => {
    const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16)), pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
    return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
  };
  const ppl = mix(gr.color[0], gr.color[1], pleo);
  const cx = 130, cy = 130, R = 110;
  const grainPts = [[-60, -24], [40, -38], [70, 6], [30, 40], [-50, 34], [-76, 4]];
  const rotP = (p: number[]) => {
    const a = rad(rot);
    return [cx + p[0] * Math.cos(a) - p[1] * Math.sin(a), cy + p[0] * Math.sin(a) + p[1] * Math.cos(a)];
  };
  const poly = grainPts.map(rotP).map((p) => p.join(",")).join(" ");
  const cleavLines: ReactElement[] = [];
  const nC = gr.cleave;
  for (let k = 0; k < nC; k++) {
    const base = k === 0 ? 0 : gr.n === "方解石" ? 75 : gr.n === "普通角閃石" ? 124 : 87;
    for (let i = -4; i <= 4; i++) {
      const a = rad(rot + base);
      const nx = -Math.sin(a), ny = Math.cos(a);
      const ox = cx + nx * i * 10, oy = cy + ny * i * 10;
      cleavLines.push(<line key={`${k}${i}`} x1={ox - Math.cos(a) * 60} y1={oy - Math.sin(a) * 60} x2={ox + Math.cos(a) * 60} y2={oy + Math.sin(a) * 60} stroke="#000" strokeOpacity={0.35} strokeWidth={1} />);
    }
  }
  const twinFill = (i: number) => {
    const b2 = Math.pow(Math.sin(2 * rad(rot - (i % 2 ? off : -off))), 2);
    return xpl ? interferenceRGB(ret, b2) : ppl;
  };
  let fill = xpl ? interferenceRGB(ret, bright) : ppl;
  if (xpl && gr.ext === "undulose") {
    fill = "url(#undul)";
  }
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：偏光顯微鏡下轉動載物台</b>
        <span>選礦物、切換單偏光／正交偏光，轉動載物台看多色性和消光</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox="0 0 260 280" className="ix-svg" role="img" aria-label="偏光顯微鏡視野">
          <defs>
            <clipPath id="fov">
              <circle cx={cx} cy={cy} r={R} />
            </clipPath>
            <clipPath id="grainclip">
              <polygon points={poly} />
            </clipPath>
            <linearGradient id="undul" gradientTransform={`rotate(${rot})`}>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <stop key={t} offset={t} stopColor={interferenceRGB(ret, Math.pow(Math.sin(2 * rad(rot + (t - 0.5) * 30)), 2))} />
              ))}
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R} fill={xpl ? "#000" : "#f7f4ea"} stroke={INK} strokeWidth={3} />
          <g clipPath="url(#fov)">
            {gr.twin ? (
              Array.from({ length: 8 }, (_, i) => {
                const pts = [[-80 + i * 20, -60], [-60 + i * 20, -60], [-60 + i * 20, 60], [-80 + i * 20, 60]].map(rotP).map((p) => p.join(",")).join(" ");
                return <polygon key={i} points={pts} fill={twinFill(i)} stroke="#777" strokeWidth={0.6} />;
              }).concat([<polygon key="ol" points={[[-80, -60], [80, -60], [80, 60], [-80, 60]].map(rotP).map((p) => p.join(",")).join(" ")} fill="none" stroke="#999" strokeWidth={1.2} />])
            ) : (
              <polygon points={poly} fill={fill} stroke="#000" strokeOpacity={0.4} />
            )}
            {!xpl && <g clipPath="url(#grainclip)">{cleavLines}</g>}
            <line x1={cx - R} x2={cx + R} y1={cy} y2={cy} stroke={xpl ? "#888" : "#333"} strokeWidth={0.8} />
            <line x1={cx} x2={cx} y1={cy - R} y2={cy + R} stroke={xpl ? "#888" : "#333"} strokeWidth={0.8} />
          </g>
          <text x={cx} y={262} textAnchor="middle" style={{ fontSize: 11 }}>{xpl ? "正交偏光（XPL）：下偏光南北、上偏光東西" : "單偏光（PPL）：只用下偏光鏡（南北）"}</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-btns">
            {GRAINS.map((x, i) => (
              <button key={x.n} type="button" className="ix-btn" aria-pressed={gi === i} onClick={() => setGi(i)} style={{ fontSize: "0.78rem" }}>{x.n}</button>
            ))}
          </div>
          <div className="ix-btns">
            <button type="button" className="ix-btn" aria-pressed={!xpl} onClick={() => setXpl(false)}>單偏光</button>
            <button type="button" className="ix-btn" aria-pressed={xpl} onClick={() => setXpl(true)}>正交偏光</button>
          </div>
          <div className="ix-row">
            <label><span>載物台角度</span><span>{rot}°</span></label>
            <input type="range" min={0} max={360} step={1} value={rot} onChange={(e) => setRot(+e.target.value)} />
          </div>
          <div className="ix-readout">
            {xpl ? (
              gr.iso ? <>等向性礦物：<b>全消光</b>，怎麼轉都是黑的</> : <>亮度 ∝ sin²2θ = <b>{fmt(bright, 2)}</b>（θ = 振動方向和偏光鏡的夾角）<br />干涉色：{order(ret)}（δ ≈ {gr.br}）</>
            ) : (
              <>多色性：{gr.color[0] === gr.color[1] ? "無" : "有（解理東西向時最深）"}<br />解理：{gr.cleave === 0 ? "無" : `${gr.cleave} 組`}</>
            )}
          </div>
          <div className="ix-note">
            非等向性礦物在正交偏光下每轉 90° 消光一次（一圈 4 次），因為振動方向和上、下偏光鏡平行時，光過不了上偏光鏡。消光的位置和解理平行是平行消光（黑雲母），夾一個角度是斜消光（輝石、角閃石），在兩組解理的角平分線是對稱消光（方解石）；石英常是波狀消光，斜長石的聚片雙晶一條亮一條暗。等向性的石榴子石永遠是黑的（全消光）。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── 造岩礦物光性快速分類表 ───────────── */

type Node = { q: string; a: [string, string | Node][] } | string;
const KEY: Node = {
  q: "浮影（relief）？",
  a: [
    ["低", { q: "干涉色？", a: [
      ["低（一階灰白）", { q: "解理？", a: [
        ["有", { q: "雙晶或表面？", a: [["聚片雙晶（lamellar）", "Pl 斜長石"], ["表面混濁、像蝕變過", "Or 正長石"]] }],
        ["無，表面乾淨", "Qz 石英"],
      ] }],
      ["中／高", { q: "解理幾組？", a: [["1 組", "Mus 白雲母"], ["2 組", "Cal 方解石"]] }],
    ] }],
    ["中／高", { q: "多色性？", a: [
      ["有", { q: "顏色？", a: [["褐色", "Bi 黑雲母"], ["綠色", "Hb 角閃石"]] }],
      ["無", { q: "解理？", a: [
        ["有", { q: "消光？", a: [["斜消光", "Cpx 普通輝石"], ["平行消光", "Opx 紫蘇輝石"]] }],
        ["無", "Ol 橄欖石"],
      ] }],
    ] }],
  ],
};

export function OpticalKeyDemo() {
  const [path, setPath] = useState<number[]>([]);
  let node: Node = KEY;
  const trail: string[] = [];
  for (const i of path) {
    if (typeof node === "string") break;
    trail.push(`${node.q.replace("？", "")}：${node.a[i][0]}`);
    node = node.a[i][1];
  }
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：造岩礦物光性快速分類</b>
        <span>照著課堂的分類表一步一步回答（僅供參考，要配合其他特徵）</span>
      </figcaption>
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        <div className="ix-readout">{trail.length ? trail.map((t, i) => <div key={i}>{i + 1}. {t}</div>) : "從浮影開始"}</div>
        {typeof node === "string" ? (
          <div className="ix-verdict">→ {node}</div>
        ) : (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{node.q}</div>
            <div className="ix-btns">
              {node.a.map(([lab], i) => (
                <button key={lab} type="button" className="ix-btn" onClick={() => setPath([...path, i])}>{lab}</button>
              ))}
            </div>
          </div>
        )}
        <div className="ix-btns">
          {path.length > 0 && <button type="button" className="ix-btn" onClick={() => setPath(path.slice(0, -1))}>上一步</button>}
          {path.length > 0 && <button type="button" className="ix-btn" onClick={() => setPath([])}>重來</button>}
        </div>
      </div>
    </figure>
  );
}

/* ───────────── 貝克線 ───────────── */

export function BeckeDemo() {
  const [nG, setNG] = useState(1.65);
  const [up, setUp] = useState(0.5); // 0 = 焦點在下，1 = 鏡筒（載物台）上升
  const nM = 1.537;
  const higher = nG > nM;
  const shift = (up - 0.5) * 2; // -1..1
  const rr = 60 + (higher ? -1 : 1) * shift * 14; // 亮線半徑：上升時往折射率高的一側移
  const relief = Math.abs(nG - nM);
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：貝克線測試</b>
        <span>礦物顆粒埋在環氧樹脂（n = 1.537）中；提升鏡筒，看亮線往哪邊跑</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox="0 0 240 240" className="ix-svg" role="img" aria-label="貝克線">
          <circle cx={120} cy={120} r={110} fill="#e9e6dc" stroke={INK} strokeWidth={3} />
          <circle cx={120} cy={120} r={60} fill="#dcd8cc" stroke="#222" strokeWidth={1 + relief * 40} />
          <circle cx={120} cy={120} r={Math.max(20, rr)} fill="none" stroke="#fffbe8" strokeWidth={4} />
          <text x={120} y={124} textAnchor="middle" style={{ fontSize: 12, fill: "#222", fontWeight: 800 }}>礦物 n = {fmt(nG, 3)}</text>
          <text x={120} y={30} textAnchor="middle" style={{ fontSize: 11, fill: "#222" }}>環氧樹脂 n = 1.537</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label><span>礦物的折射率</span><span>{fmt(nG, 3)}</span></label>
            <input type="range" min={1.45} max={1.85} step={0.005} value={nG} onChange={(e) => setNG(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label><span>鏡筒（焦點）</span><span>{up > 0.5 ? "提升鏡筒" : up < 0.5 ? "降下鏡筒" : "正焦"}</span></label>
            <input type="range" min={0} max={1} step={0.01} value={up} onChange={(e) => setUp(+e.target.value)} />
          </div>
          <div className="ix-readout">
            折射率差 = {fmt(nG - nM, 3)}：{relief < 0.02 ? "浮影很低，邊界幾乎看不到" : relief < 0.08 ? "中等浮影" : "高浮影，邊界很黑很粗"}
            <br />亮線往<b>{higher ? "顆粒內" : "顆粒外"}</b>移動 → 礦物折射率<b>{higher ? "較高（正浮影）" : "較低（負浮影）"}</b>
          </div>
          <div className="ix-note">
            課堂口訣：提升鏡筒（讓物鏡離開薄片），貝克線往折射率高的介質移動；降下鏡筒則反過來。投影片英文寫成「stage is raised」，判讀以中文口訣「提升鏡筒」為準，實驗時先用已知礦物確認一次。觀察時縮小光圈，把顆粒邊界移到視域中央。浮影的高低取決於礦物和周圍（環氧樹脂或加拿大膠，n ≈ 1.537）折射率差多少：橄欖石 1.64–1.88 浮影高、斜長石 1.53–1.57 浮影低。（示意圖，亮線位置只表示方向。）
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── 摩氏硬度 ───────────── */

const MOHS: [number, string, string][] = [
  [1, "滑石", "Talc"], [2, "石膏", "Gypsum"], [3, "方解石", "Calcite"], [4, "螢石", "Fluorite"], [5, "磷灰石", "Apatite"],
  [6, "正長石", "Orthoclase"], [7, "石英", "Quartz"], [8, "黃玉", "Topaz"], [9, "剛玉", "Corundum"], [10, "金剛石", "Diamond"],
];
const TOOLS: [string, number][] = [["指甲", 2.2], ["銅幣", 3.2], ["小刀", 5.1], ["玻璃", 5.5], ["鋼銼", 6.5], ["條痕板（素燒瓷）", 7.0]];
const ABS = [1, 2, 9, 21, 48, 72, 100, 200, 400, 1500];

export function MohsDemo() {
  const [ti, setTi] = useState(2);
  const [tool, h] = TOOLS[ti];
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：摩氏硬度與簡易工具</b>
        <span>選一個工具，看哪些礦物刮得動；下方是絕對硬度</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox="0 0 340 250" className="ix-svg" role="img" aria-label="摩氏硬度">
          {MOHS.map(([m, n], i) => {
            const x = 20 + i * 31;
            const scratched = m < h;
            return (
              <g key={m}>
                <rect x={x} y={20} width={27} height={26} rx={4} fill={scratched ? "var(--orange)" : "var(--teal)"} fillOpacity={scratched ? 0.5 : 0.2} stroke={INK} strokeOpacity={0.4} />
                <text x={x + 13.5} y={38} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{m}</text>
                <text x={x + 13.5} y={i % 2 ? 76 : 62} textAnchor="middle" style={{ fontSize: 9.5 }}>{n}</text>
              </g>
            );
          })}
          <line x1={20 + h * 31 - 2} x2={20 + h * 31 - 2} y1={12} y2={84} stroke="#d0567a" strokeWidth={2.5} />
          <text x={Math.min(250, 20 + h * 31 + 1)} y={12} style={{ fontSize: 10.5, fontWeight: 800, fill: "#d0567a" }}>{tool} ≈ {h}</text>
          {/* 絕對硬度 */}
          {(() => {
            const L = 40, B = 236, T = 104;
            const y = (v: number) => B - (Math.log10(v) / Math.log10(1500)) * (B - T);
            const x = (m: number) => L + (m - 1) * 30;
            return (
              <g>
                <polyline points={ABS.map((v, i) => `${x(i + 1)},${y(v)}`).join(" ")} fill="none" stroke="var(--orange)" strokeWidth={2.4} />
                {ABS.map((v, i) => <circle key={i} cx={x(i + 1)} cy={y(v)} r={3} fill="var(--orange)" />)}
                <line x1={L} x2={L + 280} y1={B} y2={B} stroke={INK} />
                <line x1={L} x2={L} y1={T} y2={B} stroke={INK} />
                {[1, 10, 100, 1000].map((v) => <text key={v} x={L - 4} y={y(v) + 4} textAnchor="end" style={{ fontSize: 9.5 }}>{v}</text>)}
                <text x={L + 4} y={T - 4} style={{ fontSize: 10.5 }}>絕對硬度（對數，約略值）</text>
                <text x={x(10)} y={y(1500) + 14} textAnchor="end" style={{ fontSize: 10 }}>金剛石遠高於其他</text>
              </g>
            );
          })()}
        </svg>
        <div className="ix-panel">
          <div className="ix-btns">
            {TOOLS.map(([t], i) => (
              <button key={t} type="button" className="ix-btn" aria-pressed={ti === i} onClick={() => setTi(i)}>{t}</button>
            ))}
          </div>
          <div className="ix-readout">
            {tool}（≈ {h}）刮得動：<b>{MOHS.filter(([m]) => m < h).map(([, n]) => n).join("、") || "無"}</b>
          </div>
          <div className="ix-note">
            摩氏硬度是相對的順序（誰刮得動誰），不是等距的：從 1 到 9 的絕對硬度差了好幾百倍，9（剛玉）到 10（金剛石）又跳了好幾倍。野外常用：指甲 ~2.2、銅幣 ~3.2、小刀 ~5.1、玻璃 ~5.5、鋼銼 ~6.5、條痕板 ~7。所以硬度大於 6–7 的礦物在條痕板上畫不出條痕。黃鐵礦（6–6.5）比小刀硬、黃銅礦（3.5–4）比小刀軟，可以用來區分兩者。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── 台灣的礦物：地圖 + 可搜尋的表 ───────────── */


const CLS_ORDER = ["全部", "自然元素", "硫化物", "氧化物", "氫氧化物", "碳酸鹽", "鹵化物", "磷酸鹽", "硫酸鹽", "矽酸鹽"];

export function TaiwanMineralsDemo() {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("全部");
  const [place, setPlace] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const W = 250, H = 330;
  const lon0 = 119.25, lon1 = 122.15, lat0 = 21.8, lat1 = 25.45;
  const px = (lon: number) => 10 + ((lon - lon0) / (lon1 - lon0)) * (W - 20);
  const py = (lat: number) => 10 + ((lat1 - lat) / (lat1 - lat0)) * (H - 20);
  const match = (m: (typeof MINERALS)[number]) => {
    if (cls !== "全部" && !(cls === "矽酸鹽" ? m.cls.includes("矽酸鹽") : m.cls.startsWith(cls))) return false;
    if (place && !m.loc.includes(place)) return false;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      return [m.zh, m.en, m.f, m.tw, m.note, m.look].some((t) => t.toLowerCase().includes(s));
    }
    return true;
  };
  const list = MINERALS.filter(match);
  const counts: Record<string, number> = {};
  for (const m of MINERALS.filter((m) => cls === "全部" || (cls === "矽酸鹽" ? m.cls.includes("矽酸鹽") : m.cls.startsWith(cls)))) for (const l of m.loc) counts[l] = (counts[l] ?? 0) + 1;
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：台灣的礦物地圖</b>
        <span>點地圖上的產地、選類別或打字搜尋（礦物名、化學式、產地、特色都可以）</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="台灣礦物產地示意圖">
          <polygon points={TW_OUTLINE.map(([lo, la]) => `${px(lo)},${py(la)}`).join(" ")} fill="var(--teal)" fillOpacity={0.12} stroke={INK} strokeOpacity={0.5} strokeWidth={1.2} strokeLinejoin="round" />
          {/* 澎湖、綠島、蘭嶼、金門示意 */}
          <circle cx={px(119.58)} cy={py(23.57)} r={7} fill="var(--teal)" fillOpacity={0.12} stroke={INK} strokeOpacity={0.4} />
          <circle cx={px(121.49)} cy={py(22.66)} r={3} fill="var(--teal)" fillOpacity={0.12} stroke={INK} strokeOpacity={0.4} />
          <circle cx={px(121.55)} cy={py(22.04)} r={4} fill="var(--teal)" fillOpacity={0.12} stroke={INK} strokeOpacity={0.4} />
          <rect x={px(119.3)} y={py(24.85)} width={42} height={30} rx={4} fill="none" stroke={INK} strokeOpacity={0.35} strokeDasharray="3 3" />
          <text x={px(119.3) + 21} y={py(24.85) - 3} textAnchor="middle" style={{ fontSize: 8.5 }} opacity={0.7}>金門（移入）</text>
          {Object.entries(PLACES).map(([k, p]) => {
            const n = counts[k] ?? 0;
            const on = place === k;
            return (
              <g key={k} style={{ cursor: "pointer" }} onClick={() => setPlace(on ? null : k)}>
                <title>{p.n}</title>
                <circle cx={px(p.lon)} cy={py(p.lat)} r={on ? 9 : 4 + Math.min(5, n * 0.5)} fill={on ? "var(--orange)" : "#d0567a"} fillOpacity={n ? 0.8 : 0.15} stroke="#fff" strokeWidth={1.2} />
                <circle cx={px(p.lon)} cy={py(p.lat)} r={12} fill="transparent" />
              </g>
            );
          })}
          {place ? (
            <text x={W / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 10.5, fontWeight: 800 }}>{PLACES[place].n}</text>
          ) : (
            <text x={W - 6} y={H - 4} textAnchor="end" style={{ fontSize: 9.5 }} opacity={0.7}>示意圖，非精確地圖</text>
          )}
        </svg>
        <div className="ix-panel">
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜尋：金瓜石、FeS₂、藍閃石…" style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))", fontSize: "0.9rem" }} />
          <div className="ix-btns">
            {CLS_ORDER.map((c) => (
              <button key={c} type="button" className="ix-btn" aria-pressed={cls === c} onClick={() => setCls(c)} style={{ fontSize: "0.75rem" }}>{c}</button>
            ))}
          </div>
          <div className="ix-readout">
            {place ? <>產地：<b>{PLACES[place].n}</b>（<button type="button" className="ix-btn" style={{ fontSize: "0.72rem", padding: "0 0.4rem" }} onClick={() => setPlace(null)}>清除</button>）<br /></> : null}
            找到 <b>{list.length}</b> 種
          </div>
        </div>
      </div>
      <div style={{ padding: "0 1rem 1rem", maxHeight: 460, overflowY: "auto" }}>
        <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid hsl(var(--border))" }}>
              <th style={{ padding: "4px 6px" }}>礦物</th>
              <th style={{ padding: "4px 6px" }}>化學式</th>
              <th style={{ padding: "4px 6px" }}>H</th>
              <th style={{ padding: "4px 6px" }}>台灣產地</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <Fragment key={m.no}>
                <tr onClick={() => setOpen(open === m.no ? null : m.no)} style={{ cursor: "pointer", borderBottom: "1px solid hsl(var(--border) / 0.5)", background: open === m.no ? "hsl(var(--muted))" : undefined }}>
                  <td style={{ padding: "4px 6px", whiteSpace: "nowrap" }}><b>{m.zh}</b><br /><span style={{ opacity: 0.7, fontSize: "0.72rem" }}>{m.en}</span></td>
                  <td style={{ padding: "4px 6px" }}>{m.f}</td>
                  <td style={{ padding: "4px 6px", whiteSpace: "nowrap" }}>{m.H}</td>
                  <td style={{ padding: "4px 6px" }}>{m.tw}</td>
                </tr>
                {open === m.no ? (
                  <tr style={{ background: "hsl(var(--muted))" }}>
                    <td colSpan={4} style={{ padding: "4px 8px 8px" }}>
                      <b>{m.cls}</b>｜{m.sys}晶系｜比重 {m.G}<br />{m.look}<br />{m.note ? <>特色：{m.note}</> : null}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
