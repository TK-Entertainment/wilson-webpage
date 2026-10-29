"use client";

import { useState } from "react";
import "./notes.css";

// 地化 L2、L4、L5、L7 的互動圖
const INK = "currentColor";
const fmt = (x: number, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

/* ───────────── L2：批次熔融 ───────────── */

const cl = (D: number, F: number) => 1 / (D * (1 - F) + F);

export function BatchMeltingDemo() {
  const [ld, setLd] = useState(-1.3); // log10 D
  const [F, setF] = useState(0.1);
  const D = Math.pow(10, ld);
  const W = 360, H = 260, L = 46, B = 36, R = 14, T = 12;
  const x = (f: number) => L + f * (W - L - R);
  const y = (v: number) => T + ((3 - Math.log10(v)) / 4) * (H - T - B);
  const curve = (d: number) => {
    const p: string[] = [];
    for (let i = 1; i <= 100; i++) {
      const f = i / 100;
      p.push(`${x(f)},${y(Math.max(0.1, Math.min(1000, cl(d, f))))}`);
    }
    return p.join(" ");
  };
  const refs = [0.01, 0.1, 1, 5];
  const v = cl(D, F);
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：批次熔融</b>
        <span>拉 D 和熔融程度 F，看熔體富集多少倍</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="CL/C0 對熔融程度">
          {[0.1, 1, 10, 100, 1000].map((t) => (
            <g key={t}>
              <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={INK} strokeOpacity={0.12} />
              <text x={L - 5} y={y(t) + 4} textAnchor="end" style={{ fontSize: 11 }}>{t}</text>
            </g>
          ))}
          {refs.map((d) => (
            <g key={d}>
              <polyline points={curve(d)} fill="none" stroke={INK} strokeOpacity={0.3} strokeWidth={1.2} strokeDasharray="4 3" />
            </g>
          ))}
          <polyline points={curve(D)} fill="none" stroke="var(--orange)" strokeWidth={3} />
          <circle cx={x(F)} cy={y(Math.min(1000, v))} r={6} fill="var(--orange)" stroke={INK} strokeWidth={1.5} />
          {refs.map((d) => (
            <text key={d} x={x(0.012) + 2} y={y(Math.min(800, cl(d, 0.012))) - 5} style={{ fontSize: 10, paintOrder: "stroke", stroke: "hsl(var(--card))", strokeWidth: 3 }}>D={d}</text>
          ))}
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <text key={f} x={x(f)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{f}</text>
          ))}
          <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 12 }}>熔融程度 F</text>
          <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>C_L / C₀</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>分配係數 D</span>
              <span>{D < 0.1 ? D.toPrecision(2) : fmt(D, 2)}</span>
            </label>
            <input type="range" min={-3} max={1} step={0.05} value={ld} onChange={(e) => setLd(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>熔融程度 F</span>
              <span>{fmt(F * 100, 1)} %</span>
            </label>
            <input type="range" min={0.005} max={1} step={0.005} value={F} onChange={(e) => setF(+e.target.value)} />
          </div>
          <div className="ix-readout">
            C_L/C₀ = 1 / [D(1 − F) + F]
            <br />= <b>{fmt(v, v < 10 ? 2 : 1)} 倍</b>
            <br />F → 0 的上限 1/D = <b>{fmt(1 / D, 1 / D < 10 ? 2 : 0)} 倍</b>
          </div>
          <div className="ix-verdict">{D < 1 ? "不相容：熔體富集" : D > 1 ? "相容：熔體反而變少" : "D = 1：濃度不變"}</div>
          <div className="ix-note">
            D 越小、F 越小，熔體富集得越多；F 再小也不會超過 1/D。D ≪ 1 時 C_L/C₀ ≈ 1/F，所以高度不相容元素的濃度可以拿來估熔融程度。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── L4：G 對反應進度 ξ，Q 與 K ───────────── */

const RT298 = 8.314e-3 * 298; // kJ/mol

export function ReactionProgressDemo() {
  const [dG0, setDG0] = useState(-3); // kJ/mol，A → B 的 ΔG°
  const [xi, setXi] = useState(0.2);
  const W = 360, H = 250, L = 46, R = 14, T = 14, B = 36;
  const g = (s: number) => {
    const e = 1e-6;
    const a = Math.min(1 - e, Math.max(e, s));
    return a * dG0 + RT298 * ((1 - a) * Math.log(1 - a) + a * Math.log(a));
  };
  let gmin = Infinity, gmax = -Infinity;
  for (let i = 0; i <= 100; i++) {
    const v = g(i / 100);
    gmin = Math.min(gmin, v);
    gmax = Math.max(gmax, v);
  }
  const pad = Math.max(0.6, (gmax - gmin) * 0.15);
  const lo = gmin - pad, hi = gmax + pad;
  const x = (s: number) => L + s * (W - L - R);
  const y = (v: number) => T + ((hi - v) / (hi - lo)) * (H - T - B);
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) pts.push(`${x(i / 200)},${y(g(i / 200))}`);
  const K = Math.exp(-dG0 / RT298);
  const xeq = K / (1 + K);
  const Q = xi / (1 - xi);
  const dGr = dG0 + RT298 * Math.log(Q);
  const h = 0.12;
  const tx1 = Math.max(0, xi - h), tx2 = Math.min(1, xi + h);
  const dir = Math.abs(dGr) < 0.15 ? 0 : dGr < 0 ? 1 : -1;
  const fe = (v: number) => (v >= 100 || v < 0.01 ? v.toExponential(1) : fmt(v, v < 1 ? 3 : 2));
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：反應會往哪邊走？</b>
        <span>A ⇌ B（理想混合，25 °C）：拉反應進度 ξ，看切線斜率 ΔG<sub>r</sub> 的正負</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="G 對反應進度">
          <defs>
            <marker id="rp-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--orange)" }} />
            </marker>
          </defs>
          <polyline points={pts.join(" ")} fill="none" stroke="var(--teal)" strokeWidth={3} />
          <line x1={x(xeq)} x2={x(xeq)} y1={T} y2={H - B} stroke={INK} strokeOpacity={0.35} strokeDasharray="4 3" />
          <text x={x(xeq)} y={T + 10} textAnchor={xeq > 0.8 ? "end" : "start"} dx={xeq > 0.8 ? -4 : 4} style={{ fontSize: 10.5 }}>平衡：Q = K</text>
          <circle cx={x(xeq)} cy={y(g(xeq))} r={4} fill="var(--teal)" />
          <line x1={x(tx1)} y1={y(g(xi) + dGr * (tx1 - xi))} x2={x(tx2)} y2={y(g(xi) + dGr * (tx2 - xi))} stroke="var(--gold)" strokeWidth={2.2} />
          {dir !== 0 && (
            <line x1={x(xi)} y1={y(g(xi)) - 24} x2={x(xi) + dir * 34} y2={y(g(xi)) - 24} stroke="var(--orange)" strokeWidth={2.5} markerEnd="url(#rp-a)" />
          )}
          <circle cx={x(xi)} cy={y(g(xi))} r={6} fill="var(--orange)" stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <text x={L} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>全是 A</text>
          <text x={W - R} y={H - B + 15} textAnchor="end" style={{ fontSize: 11 }}>全是 B</text>
          <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 12 }}>反應進度 ξ</text>
          <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>系統的 G</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>ΔG°（kJ/mol）</span>
              <span>{fmt(dG0, 1)}</span>
            </label>
            <input type="range" min={-8} max={8} step={0.5} value={dG0} onChange={(e) => setDG0(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>反應進度 ξ（B 的比例）</span>
              <span>{fmt(xi, 2)}</span>
            </label>
            <input type="range" min={0.01} max={0.99} step={0.01} value={xi} onChange={(e) => setXi(+e.target.value)} />
          </div>
          <div className="ix-readout">
            K = e<sup>−ΔG°/RT</sup> = <b>{fe(K)}</b>
            <br />Q = ξ/(1 − ξ) = <b>{fe(Q)}</b>
            <br />ΔG<sub>r</sub> = ΔG° + RT ln Q = <b>{fmt(dGr, 2)} kJ/mol</b>
          </div>
          <div className="ix-verdict">{dir === 0 ? "Q ≈ K：已經平衡" : dir > 0 ? "Q < K：往右（生成 B）" : "Q > K：往左（生成 A）"}</div>
          <div className="ix-note">
            金色線是切線，斜率就是 ΔG<sub>r</sub>。斜率為負表示往右走 G 會下降，所以反應往右；最低點斜率為 0，就是平衡。ΔG° 只決定最低點在哪裡，不代表反應一定走到底。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── L4：van't Hoff 與溫度計的好壞 ───────────── */

export function ThermometerDemo() {
  const [dH, setDH] = useState(40); // kJ/mol
  const [dV, setDV] = useState(1); // cm³/mol
  const [tc, setTc] = useState(800); // °C
  const W = 360, H = 250, L = 46, R = 14, T = 14, B = 40;
  const T0 = 1073;
  const lnK = (tk: number, pGPa: number) => (-dH * 1000 / 8.314) * (1 / tk - 1 / T0) - (dV * 1e-6 * (pGPa - 0.1) * 1e9) / (8.314 * tk);
  const invLo = 1 / 1473, invHi = 1 / 673;
  const x = (inv: number) => L + ((inv - invLo) / (invHi - invLo)) * (W - L - R);
  const lo = -7, hi = 7;
  const y = (v: number) => T + ((hi - Math.max(lo, Math.min(hi, v))) / (hi - lo)) * (H - T - B);
  const line = (p: number) => {
    const a: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const inv = invLo + ((invHi - invLo) * i) / 40;
      a.push(`${x(inv)},${y(lnK(1 / inv, p))}`);
    }
    return a.join(" ");
  };
  const tk = tc + 273;
  const per100 = Math.abs(lnK(tk + 50, 0.1) - lnK(tk - 50, 0.1));
  const err = (dV * 1e-6 * 0.1e9 * tk) / (dH * 1000); // K，壓力估錯 0.1 GPa 造成的溫度誤差
  const verdict = per100 < 0.02 ? "不好用：ΔH 太小，K 幾乎不隨溫度變" : err > 50 ? "不好用：ΔV 太大，壓力一估錯溫度就差很多" : "可以當溫度計：ΔH 越大、ΔV 越小越準";
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：什麼樣的反應是好溫度計？</b>
        <span>拉 ΔH° 和 ΔV°，看 ln K 對溫度、對壓力各有多敏感</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="ln K 對 1/T">
          {[-6, -3, 0, 3, 6].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={INK} strokeOpacity={0.1} />
              <text x={L - 5} y={y(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v}</text>
            </g>
          ))}
          <polyline points={line(0.1)} fill="none" stroke="var(--orange)" strokeWidth={3} />
          <polyline points={line(1.0)} fill="none" stroke="var(--teal)" strokeWidth={2.5} strokeDasharray="6 4" />
          <line x1={x(1 / tk)} x2={x(1 / tk)} y1={T} y2={H - B} stroke={INK} strokeOpacity={0.4} strokeDasharray="3 3" />
          <circle cx={x(1 / tk)} cy={y(lnK(tk, 0.1))} r={5} fill="var(--orange)" stroke={INK} strokeWidth={1.2} />
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[1200, 1000, 800, 600, 400].map((c) => (
            <text key={c} x={x(1 / (c + 273))} y={H - B + 14} textAnchor="middle" style={{ fontSize: 10.5 }}>{c}</text>
          ))}
          <text x={(L + W) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 11.5 }}>溫度 °C（橫軸實際是 1/T，往右越冷）</text>
          <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>ln K</text>
          <g style={{ fontSize: 10.5 }}>
            <line x1={W - R - 92} x2={W - R - 72} y1={T + 10} y2={T + 10} stroke="var(--orange)" strokeWidth={3} />
            <text x={W - R - 68} y={T + 14}>0.1 GPa</text>
            <line x1={W - R - 92} x2={W - R - 72} y1={T + 26} y2={T + 26} stroke="var(--teal)" strokeWidth={2.5} strokeDasharray="6 4" />
            <text x={W - R - 68} y={T + 30}>1 GPa</text>
          </g>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>ΔH°（kJ/mol）</span>
              <span>{fmt(dH)}</span>
            </label>
            <input type="range" min={1} max={100} step={1} value={dH} onChange={(e) => setDH(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>ΔV°（cm³/mol）</span>
              <span>{fmt(dV, 1)}</span>
            </label>
            <input type="range" min={0} max={10} step={0.1} value={dV} onChange={(e) => setDV(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>溫度</span>
              <span>{tc} °C</span>
            </label>
            <input type="range" min={450} max={1150} step={10} value={tc} onChange={(e) => setTc(+e.target.value)} />
          </div>
          <div className="ix-readout">
            溫度差 100 °C，ln K 變 <b>{fmt(per100, 2)}</b>
            <br />壓力估錯 0.1 GPa，溫度會算錯 <b>{fmt(err, err < 10 ? 1 : 0)} °C</b>
          </div>
          <div className="ix-verdict">{verdict}</div>
          <div className="ix-note">
            斜率 = −ΔH°/R，所以 ΔH 越大線越陡、越能分辨溫度；兩條線的間距來自 ΔV°，間距越大表示 K 越受壓力影響。反過來，ΔV 大的反應就適合當壓力計。（數值為示意，假設 ΔH、ΔV 不隨 T、P 變。）
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── L4：Al₂SiO₅ 相圖（依 Holdaway 1971 的相界） ───────────── */

const kyAnd = (t: number) => (380 * (t - 200)) / 300;
const andSil = (t: number) => (380 * (760 - t)) / 260;
const kySil = (t: number) => 380 + (420 * (t - 500)) / 195;

function alPhase(t: number, p: number) {
  const near = 18;
  if (t <= 500) {
    if (Math.abs(p - kyAnd(t)) < near && t > 200) return t > 485 && Math.abs(p - 380) < near * 1.5 ? "三相共存" : "藍晶石 + 紅柱石";
    return p > kyAnd(t) ? "藍晶石" : "紅柱石";
  }
  if (t < 515 && Math.abs(p - 380) < near * 1.5) return "三相共存";
  if (Math.abs(p - kySil(t)) < near) return "藍晶石 + 矽線石";
  if (p > kySil(t)) return "藍晶石";
  if (t < 760 && Math.abs(p - andSil(t)) < near) return "紅柱石 + 矽線石";
  if (t < 760 && p < andSil(t)) return "紅柱石";
  return "矽線石";
}

export function Al2SiO5Demo() {
  const [t, setT] = useState(420);
  const [p, setP] = useState(500);
  const W = 360, H = 280, L = 50, R = 14, T = 14, B = 40;
  const x = (c: number) => L + ((c - 200) / 600) * (W - L - R);
  const y = (m: number) => T + ((800 - m) / 800) * (H - T - B);
  const ph = alPhase(t, p);
  const n = ph === "三相共存" ? 3 : ph.includes("+") ? 2 : 1;
  const col: Record<string, string> = { 藍晶石: "var(--teal)", 紅柱石: "var(--gold)", 矽線石: "var(--orange)" };
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：Al₂SiO₅ 相圖</b>
        <span>拉溫度和壓力，看穩定的是哪一相、能給多少資訊</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="Al2SiO5 相圖">
          <polygon points={`${x(200)},${y(0)} ${x(500)},${y(380)} ${x(760)},${y(0)}`} fill="var(--gold)" fillOpacity={0.14} />
          <polygon points={`${x(500)},${y(380)} ${x(695)},${y(800)} ${x(800)},${y(800)} ${x(800)},${y(0)} ${x(760)},${y(0)}`} fill="var(--orange)" fillOpacity={0.12} />
          <polygon points={`${x(200)},${y(0)} ${x(500)},${y(380)} ${x(695)},${y(800)} ${x(200)},${y(800)}`} fill="var(--teal)" fillOpacity={0.12} />
          <polyline points={`${x(200)},${y(0)} ${x(500)},${y(380)} ${x(695)},${y(800)}`} fill="none" stroke={INK} strokeWidth={2} />
          <line x1={x(500)} y1={y(380)} x2={x(760)} y2={y(0)} stroke={INK} strokeWidth={2} />
          <text x={x(330)} y={y(520)} textAnchor="middle" style={{ fontWeight: 800 }}>藍晶石 Ky</text>
          <text x={x(490)} y={y(120)} textAnchor="middle" style={{ fontWeight: 800 }}>紅柱石 And</text>
          <text x={x(705)} y={y(300)} textAnchor="middle" style={{ fontWeight: 800 }}>矽線石 Sil</text>
          <text x={x(490)} y={y(395)} textAnchor="end" style={{ fontSize: 10.5 }}>三相點 ≈ 500 °C、380 MPa →</text>
          <circle cx={x(t)} cy={y(p)} r={6} fill={n === 1 ? col[ph] : INK} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[200, 300, 400, 500, 600, 700, 800].map((c) => (
            <text key={c} x={x(c)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{c}</text>
          ))}
          {[0, 200, 400, 600, 800].map((m) => (
            <text key={m} x={L - 5} y={y(m) + 4} textAnchor="end" style={{ fontSize: 11 }}>{m}</text>
          ))}
          <text x={(L + W) / 2} y={H - 6} textAnchor="middle" style={{ fontSize: 12 }}>溫度（°C）</text>
          <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>壓力（MPa）</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>溫度</span>
              <span>{t} °C</span>
            </label>
            <input type="range" min={200} max={800} step={5} value={t} onChange={(e) => setT(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>壓力</span>
              <span>{p} MPa</span>
            </label>
            <input type="range" min={0} max={800} step={5} value={p} onChange={(e) => setP(+e.target.value)} />
          </div>
          <div className="ix-readout">
            穩定的是：<b>{ph}</b>
          </div>
          <div className="ix-verdict">{n === 1 ? "只看到一相：只能給一個 P–T 範圍" : n === 2 ? "兩相共存：落在一條線上，知道 T 就能求 P" : "三相共存：P 和 T 都固定"}</div>
          <div className="ix-note">
            試試看：把點拉到兩區的交界，或拉到三相點。實際岩石裡三相共存非常少見，最常見的是只有一相，所以 univariant reaction 單獨使用時通常只能給範圍。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── L4：一階反應與溫度 ───────────── */

export function FirstOrderDemo() {
  const [tc, setTc] = useState(25);
  const [ea, setEa] = useState(60); // kJ/mol，假設值
  const k = 0.014 * Math.exp((-ea * 1000 / 8.314) * (1 / (tc + 273.15) - 1 / 298.15));
  const half = Math.LN2 / k;
  const W = 360, H = 240, L = 46, R = 14, T = 14, B = 38;
  const tmax = 300;
  const x = (t: number) => L + (t / tmax) * (W - L - R);
  const y = (f: number) => T + (1 - f) * (H - T - B);
  const curve = (kk: number) => {
    const a: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const t = (tmax * i) / 120;
      a.push(`${x(t)},${y(Math.exp(-kk * t))}`);
    }
    return a.join(" ");
  };
  const marks = [1, 2, 3].map((n) => n * half).filter((t) => t <= tmax);
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：一階反應（CO₂ 水合）</b>
        <span>拉溫度，看速率常數 k 和半衰期怎麼變</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="一階反應濃度對時間">
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1={L} x2={W - R} y1={y(f)} y2={y(f)} stroke={INK} strokeOpacity={0.1} />
              <text x={L - 5} y={y(f) + 4} textAnchor="end" style={{ fontSize: 11 }}>{f * 100}%</text>
            </g>
          ))}
          <polyline points={curve(0.014)} fill="none" stroke={INK} strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="5 4" />
          <polyline points={curve(k)} fill="none" stroke="var(--orange)" strokeWidth={3} />
          {marks.map((t, i) => (
            <g key={i}>
              <line x1={x(t)} x2={x(t)} y1={y(Math.pow(0.5, i + 1))} y2={H - B} stroke="var(--gold)" strokeDasharray="3 3" />
              <circle cx={x(t)} cy={y(Math.pow(0.5, i + 1))} r={4} fill="var(--gold)" />
            </g>
          ))}
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[0, 50, 100, 150, 200, 250, 300].map((t) => (
            <text key={t} x={x(t)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{t}</text>
          ))}
          <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 12 }}>時間（s）</text>
          <text x={14} y={(T + H - B) / 2} transform={`rotate(-90 14 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>[CO₂] / [CO₂]₀</text>
          <text x={W - R} y={T + 12} textAnchor="end" style={{ fontSize: 10.5 }}>虛線：25 °C</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>溫度</span>
              <span>{tc} °C</span>
            </label>
            <input type="range" min={0} max={60} step={1} value={tc} onChange={(e) => setTc(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>活化能 Eₐ（假設值）</span>
              <span>{ea} kJ/mol</span>
            </label>
            <input type="range" min={20} max={120} step={5} value={ea} onChange={(e) => setEa(+e.target.value)} />
          </div>
          <div className="ix-readout">
            k = <b>{k < 0.001 ? k.toExponential(2) : fmt(k, 4)} s⁻¹</b>
            <br />t<sub>1/2</sub> = ln 2 / k = <b>{half > 1000 ? fmt(half) : fmt(half, 1)} s</b>
            <br />和 25 °C 相比：速度 × <b>{fmt(k / 0.014, 2)}</b>
          </div>
          <div className="ix-verdict">每過一個半衰期，剩下一半</div>
          <div className="ix-note">
            25 °C 時 k = 0.014 s⁻¹（投影片數據），t<sub>1/2</sub> ≈ 50 s。其他溫度用 Arrhenius 式 k ∝ e<sup>−Eₐ/RT</sup> 推算，Eₐ 是假設值：Eₐ 越大，速度對溫度越敏感。這就是高溫岩石能平衡、降溫後又會「凍結」的原因。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── L5：碳酸系統 ───────────── */

const PK1 = 6.35, PK2 = 10.33;
const alphas = (pH: number) => {
  const h = Math.pow(10, -pH), k1 = Math.pow(10, -PK1), k2 = Math.pow(10, -PK2);
  const d = h * h + k1 * h + k1 * k2;
  return [(h * h) / d, (k1 * h) / d, (k1 * k2) / d];
};

export function CarbonateDemo() {
  const [lct, setLct] = useState(-2); // log C_T (M)
  const [pH, setPH] = useState(8.2);
  const W = 360, H = 260, L = 40, R = 14, T = 12, B = 36;
  const x = (p: number) => L + ((p - 2) / 12) * (W - L - R);
  const lo = -10, hi = 0;
  const y = (lc: number) => T + ((hi - Math.max(lo, Math.min(hi, lc))) / (hi - lo)) * (H - T - B);
  const ct = Math.pow(10, lct);
  const line = (fn: (p: number) => number) => {
    const a: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const p = 2 + (12 * i) / 120;
      a.push(`${x(p)},${y(fn(p))}`);
    }
    return a.join(" ");
  };
  const sp = [
    { n: "H₂CO₃", c: "var(--teal)", f: (p: number) => Math.log10(ct * alphas(p)[0]) },
    { n: "HCO₃⁻", c: "var(--orange)", f: (p: number) => Math.log10(ct * alphas(p)[1]) },
    { n: "CO₃²⁻", c: "#8a6fd1", f: (p: number) => Math.log10(ct * alphas(p)[2]) },
  ];
  const a = alphas(pH);
  const names = ["H₂CO₃", "HCO₃⁻", "CO₃²⁻"];
  const dom = names[a.indexOf(Math.max(...a))];
  // CO₂ 當量點：[H⁺] = [HCO₃⁻]，數值解
  let ep = 4;
  for (let p = 2; p < 8; p += 0.001) {
    if (-p >= Math.log10(ct * alphas(p)[1])) ep = p;
    else break;
  }
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：碳酸物種隨 pH 的變化</b>
        <span>封閉系統（總碳 C<sub>T</sub> 固定）；拉 pH 看哪個物種為主</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="碳酸物種對 pH">
          {[0, -2, -4, -6, -8, -10].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={INK} strokeOpacity={0.1} />
              <text x={L - 5} y={y(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v}</text>
            </g>
          ))}
          {[PK1, PK2].map((p) => (
            <line key={p} x1={x(p)} x2={x(p)} y1={T} y2={H - B} stroke={INK} strokeOpacity={0.3} strokeDasharray="3 3" />
          ))}
          <text x={x(PK1) + 3} y={H - B - 5} style={{ fontSize: 10 }}>pK₁</text>
          <text x={x(PK2) + 3} y={H - B - 5} style={{ fontSize: 10 }}>pK₂</text>
          <polyline points={line((p) => -p)} fill="none" stroke={INK} strokeOpacity={0.5} strokeWidth={1.4} strokeDasharray="5 3" />
          <polyline points={line((p) => p - 14)} fill="none" stroke={INK} strokeOpacity={0.5} strokeWidth={1.4} strokeDasharray="5 3" />
          <text x={x(2.6)} y={y(-2.6) - 4} style={{ fontSize: 10 }}>H⁺</text>
          <text x={x(13.2)} y={y(-0.8) + 12} textAnchor="end" style={{ fontSize: 10 }}>OH⁻</text>
          {sp.map((s) => (
            <polyline key={s.n} points={line(s.f)} fill="none" stroke={s.c} strokeWidth={2.6} />
          ))}
          <circle cx={x(ep)} cy={y(-ep)} r={4} fill={INK} />
          <text x={x(ep) - 4} y={y(-ep) + 14} textAnchor="end" style={{ fontSize: 10 }}>CO₂ 當量點</text>
          <line x1={x(pH)} x2={x(pH)} y1={T} y2={H - B} stroke="var(--gold)" strokeWidth={2} />
          {sp.map((s) => (
            <circle key={s.n} cx={x(pH)} cy={y(s.f(pH))} r={4} fill={s.c} stroke={INK} />
          ))}
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[2, 4, 6, 8, 10, 12, 14].map((p) => (
            <text key={p} x={x(p)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{p}</text>
          ))}
          <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 12 }}>pH</text>
          <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>log 濃度（M）</text>
          <g style={{ fontSize: 10.5, fontWeight: 700 }}>
            {sp.map((s, i) => (
              <g key={s.n}>
                <line x1={L + 8 + i * 70} x2={L + 26 + i * 70} y1={T + 8} y2={T + 8} stroke={s.c} strokeWidth={3} />
                <text x={L + 30 + i * 70} y={T + 12}>{s.n}</text>
              </g>
            ))}
          </g>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>總碳 C<sub>T</sub></span>
              <span>{fmt(ct * 1000, ct < 0.001 ? 2 : 1)} mM</span>
            </label>
            <input type="range" min={-4} max={-1} step={0.1} value={lct} onChange={(e) => setLct(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>pH</span>
              <span>{fmt(pH, 2)}</span>
            </label>
            <input type="range" min={2} max={13} step={0.05} value={pH} onChange={(e) => setPH(+e.target.value)} />
          </div>
          <div className="ix-readout">
            H₂CO₃ <b>{fmt(a[0] * 100, 1)}%</b>　HCO₃⁻ <b>{fmt(a[1] * 100, 1)}%</b>　CO₃²⁻ <b>{fmt(a[2] * 100, 1)}%</b>
            <br />這個 C<sub>T</sub> 的 CO₂ 當量點：pH ≈ <b>{fmt(ep, 2)}</b>
          </div>
          <div className="ix-verdict">以 {dom} 為主</div>
          <div className="ix-note">
            三條彩色線在 pH = pK₁ 和 pK₂ 交叉（兩物種各半）。天然水 pH 約 6–9，所以 HCO₃⁻ 為主。黑點是純 CO₂ 溶液會到的 pH（H⁺ 線碰到 HCO₃⁻ 線）；C<sub>T</sub> 越大，這個 pH 越低。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── L5：鹼度不受 CO₂ 影響 ───────────── */

const solvePH = (alk: number, ct: number) => {
  // alk、ct 單位 M；Alk = C_T(α1 + 2α2) + [OH⁻] − [H⁺]
  let lo = 2, hi = 13;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    const a = alphas(m);
    const f = ct * (a[1] + 2 * a[2]) + Math.pow(10, m - 14) - Math.pow(10, -m) - alk;
    if (f > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
};

export function AlkalinityDemo() {
  const [ct, setCt] = useState(2.35); // mM
  const alk = 2.3; // meq/L
  const pH = solvePH(alk / 1000, ct / 1000);
  const a = alphas(pH);
  const hco3 = ct * a[1], co3 = ct * a[2];
  const oh = Math.pow(10, pH - 14) * 1000, h = Math.pow(10, -pH) * 1000;
  const W = 360, H = 270, base = 60, k = 60; // k：每 meq/L 的像素
  const bx1 = 70, bx2 = 210, bw = 90, y0 = H - 30;
  const parts = [
    { n: "HCO₃⁻", v: hco3, c: "var(--orange)" },
    { n: "2×CO₃²⁻", v: 2 * co3, c: "#8a6fd1" },
    { n: "OH⁻ − H⁺", v: Math.max(0, oh - h), c: "var(--teal)" },
  ];
  let acc = y0 - base;
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：加 CO₂，鹼度變不變？</b>
        <span>鹼度固定 2.3 meq/L，改變溶進來的 CO₂（總碳 C<sub>T</sub>）</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="電荷平衡長條">
          <rect x={bx1} y={y0 - base} width={bw} height={base} fill={INK} fillOpacity={0.15} stroke={INK} />
          <rect x={bx2} y={y0 - base} width={bw} height={base} fill={INK} fillOpacity={0.15} stroke={INK} />
          <text x={bx1 + bw / 2} y={y0 - base / 2 + 4} textAnchor="middle" style={{ fontSize: 10.5 }}>…（其餘）</text>
          <text x={bx2 + bw / 2} y={y0 - base / 2 + 4} textAnchor="middle" style={{ fontSize: 10.5 }}>保守陰離子</text>
          <rect x={bx1} y={y0 - base - alk * k} width={bw} height={alk * k} fill="var(--gold)" fillOpacity={0.35} stroke={INK} strokeWidth={1.5} />
          <text x={bx1 + bw / 2} y={y0 - base - (alk * k) / 2} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>鹼度</text>
          <text x={bx1 + bw / 2} y={y0 - base - (alk * k) / 2 + 15} textAnchor="middle" style={{ fontSize: 10.5 }}>2.3 meq/L</text>
          {parts.map((p) => {
            const hgt = p.v * k;
            acc -= hgt;
            return (
              <g key={p.n}>
                <rect x={bx2} y={acc} width={bw} height={hgt} fill={p.c} fillOpacity={0.55} stroke={INK} strokeWidth={1} />
                {hgt > 14 && (
                  <text x={bx2 + bw / 2} y={acc + hgt / 2 + 4} textAnchor="middle" style={{ fontSize: 10.5, fontWeight: 700 }}>{p.n}</text>
                )}
              </g>
            );
          })}
          <line x1={bx1 - 10} x2={bx2 + bw + 10} y1={y0 - base - alk * k} y2={y0 - base - alk * k} stroke={INK} strokeDasharray="4 3" strokeOpacity={0.6} />
          <text x={bx1 + bw / 2} y={y0 + 18} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>保守陽離子</text>
          <text x={bx2 + bw / 2} y={y0 + 18} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>陰離子</text>
          <text x={W / 2} y={16} textAnchor="middle" style={{ fontSize: 10.5 }}>電荷平衡（當量）：兩根一樣高</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>總碳 C<sub>T</sub>（溶進多少 CO₂）</span>
              <span>{fmt(ct, 2)} mM</span>
            </label>
            <input type="range" min={1.4} max={3.5} step={0.01} value={ct} onChange={(e) => setCt(+e.target.value)} />
          </div>
          <div className="ix-readout">
            pH = <b>{fmt(pH, 2)}</b>
            <br />HCO₃⁻ = <b>{fmt(hco3, 3)}</b> mM，CO₃²⁻ = <b>{fmt(co3, 3)}</b> mM
            <br />鹼度 = HCO₃⁻ + 2CO₃²⁻ + OH⁻ − H⁺ = <b>{fmt(hco3 + 2 * co3 + oh - h, 2)}</b> meq/L
          </div>
          <div className="ix-verdict">CO₂ 變多 → pH 下降、CO₃²⁻ 變 HCO₃⁻；鹼度不變</div>
          <div className="ix-note">
            CO₂ 進來只會在缺口裡面把 CO₃²⁻ 轉成 HCO₃⁻（CO₂ + CO₃²⁻ + H₂O → 2HCO₃⁻），電荷總量不變，所以右邊那根的高度不變。要改變鹼度，得改變保守離子，例如 CaCO₃ 沉澱帶走 Ca²⁺。（長條不按比例：真實海水的鹼度只占總電荷約 0.4%；這裡只算碳酸鹼度，用淡水的 K 值。）
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── L5：礦物穩定圖（K-長石 ⇌ 高嶺石） ───────────── */

export function MineralStabilityDemo() {
  const [pH, setPH] = useState(6);
  const [lk, setLk] = useState(-4); // log [K⁺]
  const [ls, setLs] = useState(-4); // log [H4SiO4]
  const W = 360, H = 260, L = 44, R = 14, T = 12, B = 38;
  const x = (v: number) => L + ((v + 6) / 5) * (W - L - R); // -6 .. -1
  const y = (v: number) => T + ((10 - v) / 10) * (H - T - B); // 0 .. 10
  const b = -2;
  const yy = lk + pH;
  const lineY = -2 * ls + b;
  const over = ls > -2.74;
  const above = yy > lineY;
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：K-長石會不會風化成高嶺石？</b>
        <span>拉 pH、K⁺、溶解矽，看水的組成落在線的哪一側</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="K-長石與高嶺石穩定圖">
          <polygon points={`${x(-6)},${y(10)} ${x(-6)},${y(10)} ${x(-2.74)},${y(-2 * -2.74 + b)} ${x(-2.74)},${y(10)}`} fill="var(--orange)" fillOpacity={0.12} />
          <polygon points={`${x(-6)},${y(10)} ${x(-2.74)},${y(-2 * -2.74 + b)} ${x(-2.74)},${y(0)} ${x(-6)},${y(0)}`} fill="var(--teal)" fillOpacity={0.12} />
          <polygon points={`${x(-2.74)},${y(0)} ${x(-1)},${y(0)} ${x(-1)},${y(10)} ${x(-2.74)},${y(10)}`} fill={INK} fillOpacity={0.12} />
          <line x1={x(-6)} y1={y(10)} x2={x(-1)} y2={y(-2 * -1 + b)} stroke={INK} strokeWidth={2.2} />
          <line x1={x(-2.74)} x2={x(-2.74)} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} strokeDasharray="5 3" />
          <text x={x(-3.4)} y={y(8.5)} textAnchor="middle" style={{ fontWeight: 800 }}>K-長石</text>
          <text x={x(-5.1)} y={y(3)} textAnchor="middle" style={{ fontWeight: 800 }}>高嶺石</text>
          <text x={x(-1.87)} y={y(5.4)} textAnchor="middle" style={{ fontSize: 10.5 }}>非晶質矽</text>
          <text x={x(-1.87)} y={y(5.4) + 13} textAnchor="middle" style={{ fontSize: 10.5 }}>會沉澱</text>
          <circle cx={x(ls)} cy={y(Math.max(0, Math.min(10, yy)))} r={6} fill="var(--gold)" stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[-6, -5, -4, -3, -2, -1].map((v) => (
            <text key={v} x={x(v)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{v}</text>
          ))}
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <text key={v} x={L - 5} y={y(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v}</text>
          ))}
          <text x={(L + W) / 2} y={H - 5} textAnchor="middle" style={{ fontSize: 12 }}>log [H₄SiO₄]</text>
          <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>log([K⁺]/[H⁺])</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>pH</span>
              <span>{fmt(pH, 1)}</span>
            </label>
            <input type="range" min={4} max={9} step={0.1} value={pH} onChange={(e) => setPH(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>log [K⁺]</span>
              <span>{fmt(lk, 1)}</span>
            </label>
            <input type="range" min={-6} max={-1} step={0.1} value={lk} onChange={(e) => setLk(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>log [H₄SiO₄]</span>
              <span>{fmt(ls, 2)}</span>
            </label>
            <input type="range" min={-6} max={-1.5} step={0.05} value={ls} onChange={(e) => setLs(+e.target.value)} />
          </div>
          <div className="ix-readout">
            y = log([K⁺]/[H⁺]) = log[K⁺] + pH = <b>{fmt(yy, 1)}</b>
            <br />直線在這個 x 的高度：−2x − 2 = <b>{fmt(lineY, 1)}</b>
          </div>
          <div className="ix-verdict">{over ? "超過非晶質矽的溶解度：矽會沉澱，到不了這裡" : above ? "在線上方：K-長石穩定" : "在線下方：高嶺石穩定，K-長石會被風化"}</div>
          <div className="ix-note">
            降低 pH（雨水多、酸性）或把 K⁺、矽帶走（淋溶），點會往下、往左移，進入高嶺石區，這就是強烈風化的方向。直線依投影片 25 °C 的線（截距約 −2），考試以題目給的 K 為準。
          </div>
        </div>
      </div>
    </figure>
  );
}
