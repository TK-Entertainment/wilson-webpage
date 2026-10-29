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
