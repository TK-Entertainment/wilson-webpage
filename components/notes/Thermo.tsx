"use client";

import { useEffect, useRef, useState } from "react";
import "./notes.css";

// L3 熱力學的互動圖：狀態函數（P–V 路徑）、熔化的 G–T、石墨–鑽石相圖

const fmt = (x: number, d = 0) =>
  x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

/* ───────────── 1. 狀態函數：三條路徑 ───────────── */

// 1 mol 單原子理想氣體，P 用 kPa、V 用 L（kPa·L = J）
const S1 = { V: 10, P: 200 };
const S2 = { V: 30, P: 100 };
const DU = 1.5 * (S2.P * S2.V - S1.P * S1.V); // 1500 J

type PathKey = "A" | "B" | "C";
const PATHS: Record<PathKey, { name: string; pts: { V: number; P: number }[]; desc: string }> = {
  A: { name: "路徑 A", pts: [S1, { V: S2.V, P: S1.P }, S2], desc: "先在高壓下膨脹，再降壓" },
  B: { name: "路徑 B", pts: [S1, { V: S1.V, P: S2.P }, S2], desc: "先降壓，再在低壓下膨脹" },
  C: { name: "路徑 C", pts: [S1, S2], desc: "壓力和體積同時改變（直線）" },
};

// 外界對氣體作的功 W = −∫P dV（梯形積分）
function workOn(pts: { V: number; P: number }[]) {
  let w = 0;
  for (let i = 1; i < pts.length; i++) {
    w -= ((pts[i].P + pts[i - 1].P) / 2) * (pts[i].V - pts[i - 1].V);
  }
  return w;
}

export function StateFunctionDemo() {
  const [key, setKey] = useState<PathKey>("A");
  const [t, setT] = useState(1);
  const raf = useRef<number | null>(null);

  const W = 360, H = 250, L = 48, B = 36, R = 16, T = 14;
  const x = (V: number) => L + ((V - 0) / 35) * (W - L - R);
  const y = (P: number) => H - B - (P / 230) * (H - B - T);

  const path = PATHS[key];
  const w = workOn(path.pts);
  const q = DU - w;

  // 沿路徑播放的小點
  const play = (k: PathKey) => {
    setKey(k);
    if (raf.current) cancelAnimationFrame(raf.current);
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      setT(p);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  // 依比例 t 取路徑上的點
  const segLen = path.pts.slice(1).map((p, i) => Math.hypot(x(p.V) - x(path.pts[i].V), y(p.P) - y(path.pts[i].P)));
  const total = segLen.reduce((a, b) => a + b, 0);
  let remain = t * total, dot = { X: x(S2.V), Y: y(S2.P) };
  for (let i = 0; i < segLen.length; i++) {
    if (remain <= segLen[i]) {
      const f = segLen[i] ? remain / segLen[i] : 0;
      const a = path.pts[i], b = path.pts[i + 1];
      dot = { X: x(a.V) + f * (x(b.V) - x(a.V)), Y: y(a.P) + f * (y(b.P) - y(a.P)) };
      break;
    }
    remain -= segLen[i];
  }

  const poly = (pts: { V: number; P: number }[]) => pts.map((p) => `${x(p.V)},${y(p.P)}`).join(" ");
  const area = `${x(path.pts[0].V)},${y(0)} ${poly(path.pts)} ${x(path.pts[path.pts.length - 1].V)},${y(0)}`;

  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：狀態函數</b>
        <span>同一個起點和終點，走不同的路：Q、W 會變，ΔU 不會變</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="P–V 圖上的三條路徑">
          <polygon points={area} fill="var(--orange)" opacity={0.15} />
          {(Object.keys(PATHS) as PathKey[]).map((k) => (
            <polyline
              key={k}
              points={poly(PATHS[k].pts)}
              fill="none"
              stroke={k === key ? "var(--orange)" : "currentColor"}
              strokeWidth={k === key ? 3.5 : 1.5}
              strokeDasharray={k === key ? undefined : "5 4"}
              opacity={k === key ? 1 : 0.45}
            />
          ))}
          <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="currentColor" strokeWidth={2} />
          <line x1={L} y1={T} x2={L} y2={H - B} stroke="currentColor" strokeWidth={2} />
          <text x={W - R} y={H - 10} textAnchor="end">V (L)</text>
          <text x={8} y={T + 10}>P</text>
          <text x={8} y={T + 24} style={{ fontSize: 11 }}>(kPa)</text>
          {[10, 20, 30].map((v) => (
            <text key={v} x={x(v)} y={H - B + 16} textAnchor="middle" style={{ fontSize: 11 }}>{v}</text>
          ))}
          {[100, 200].map((p) => (
            <text key={p} x={L - 6} y={y(p) + 4} textAnchor="end" style={{ fontSize: 11 }}>{p}</text>
          ))}
          <circle cx={x(S1.V)} cy={y(S1.P)} r={6} fill="var(--navy)" stroke="var(--cream)" strokeWidth={2} />
          <text x={x(S1.V) - 4} y={y(S1.P) - 10} textAnchor="end" style={{ fontWeight: 800 }}>狀態 1</text>
          <circle cx={x(S2.V)} cy={y(S2.P)} r={6} fill="var(--navy)" stroke="var(--cream)" strokeWidth={2} />
          <text x={x(S2.V)} y={y(S2.P) + 22} textAnchor="middle" style={{ fontWeight: 800 }}>狀態 2</text>
          <circle cx={dot.X} cy={dot.Y} r={7} fill="var(--orange)" />
        </svg>
        <div className="ix-panel">
          <div className="ix-btns">
            {(Object.keys(PATHS) as PathKey[]).map((k) => (
              <button key={k} type="button" className="ix-btn" aria-pressed={k === key} onClick={() => play(k)}>
                {PATHS[k].name}
              </button>
            ))}
          </div>
          <div className="ix-note">{path.desc}。橘色面積 = 氣體對外作的功。</div>
          <div className="ix-readout">
            功 W（外界對氣體）= <b>{fmt(w)} J</b>
            <br />
            熱 Q（氣體吸收）= <b>{fmt(q)} J</b>
            <br />
            ΔU = Q + W = <b>{fmt(DU)} J</b>
          </div>
          <div className="ix-note">
            三條路的 Q、W 都不一樣（路徑函數），但加起來的 ΔU 永遠是 1,500 J：U 只看起點和終點，所以是狀態函數。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── 2. 熔化：G 對 T ───────────── */

// 冰 → 水：ΔH = 6010 J/mol、ΔS = 22.0 J/(K·mol)，熔點 ≈ 273 K
const DH_M = 6010;
const S_ICE = 41;
const S_WATER = 63;
const TM = DH_M / (S_WATER - S_ICE);

export function MeltingGDemo() {
  const [T, setT] = useState(250);
  const W = 360, H = 250, L = 40, B = 34, R = 16, Tp = 14;
  const tMin = 213, tMax = 333;
  const gS = (t: number) => -S_ICE * (t - TM);
  const gL = (t: number) => -S_WATER * (t - TM);
  const gMin = gL(tMax), gMax = gL(tMin);
  const x = (t: number) => L + ((t - tMin) / (tMax - tMin)) * (W - L - R);
  const y = (g: number) => Tp + ((gMax - g) / (gMax - gMin)) * (H - B - Tp);

  const dG = DH_M - T * (S_WATER - S_ICE);
  const stable = dG > 0 ? "冰" : dG < 0 ? "水" : "冰水共存";

  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：誰的 G 比較低，誰就穩定</b>
        <span>拉溫度，看冰和水的 G 誰在下面</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="冰與水的 G 對溫度">
          <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="currentColor" strokeWidth={2} />
          <line x1={L} y1={Tp} x2={L} y2={H - B} stroke="currentColor" strokeWidth={2} />
          <text x={W - R} y={H - 8} textAnchor="end">T (K)</text>
          <text x={10} y={Tp + 10}>G</text>
          <line x1={x(TM)} y1={Tp} x2={x(TM)} y2={H - B} stroke="currentColor" strokeDasharray="4 4" opacity={0.5} />
          <text x={x(TM)} y={H - B + 16} textAnchor="middle" style={{ fontSize: 11 }}>Tm ≈ {fmt(TM)} K</text>
          <line x1={x(tMin)} y1={y(gS(tMin))} x2={x(tMax)} y2={y(gS(tMax))} stroke="var(--teal)" strokeWidth={3} />
          <line x1={x(tMin)} y1={y(gL(tMin))} x2={x(tMax)} y2={y(gL(tMax))} stroke="var(--orange)" strokeWidth={3} />
          <text x={x(222)} y={y(gL(222)) - 8} style={{ fontWeight: 800 }}>水（較陡）</text>
          <text x={x(217)} y={y(gS(217)) + 20} style={{ fontWeight: 800 }}>冰（較平）</text>
          <line x1={x(T)} y1={Tp} x2={x(T)} y2={H - B} stroke="var(--navy)" strokeWidth={2} />
          <circle cx={x(T)} cy={y(gS(T))} r={5} fill="var(--teal)" />
          <circle cx={x(T)} cy={y(gL(T))} r={5} fill="var(--orange)" />
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>溫度 T</span>
              <span>{T} K（{fmt(T - 273.15, 1)} °C）</span>
            </label>
            <input type="range" min={tMin} max={tMax} value={T} onChange={(e) => setT(+e.target.value)} />
          </div>
          <div className="ix-readout">
            冰 → 水：ΔG = ΔH − TΔS
            <br />= 6010 − {T} × 22.0
            <br />= <b>{fmt(dG)} J/mol</b>
          </div>
          <div className="ix-verdict">穩定的是：{stable}</div>
          <div className="ix-note">
            熔化要吸熱（ΔH &gt; 0，不利），但會變亂（ΔS &gt; 0，有利）。溫度低時 H 贏，維持冰；溫度高時 TΔS 贏，變成水。平手的那一點 ΔG = 0，就是熔點 Tm = ΔH/ΔS。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── 3. 石墨–鑽石相圖 ───────────── */

// Table 2.2：ΔG°(298 K) = +2865 J、ΔS = −3.37 J/K、ΔV = −1.881 J/MPa
const G0 = 2865;
const DS_GD = -3.37;
const DV_GD = -1.881;
const dGgd = (tC: number, pMPa: number) => G0 - DS_GD * (tC + 273.15 - 298.15) + DV_GD * pMPa;
const pBoundary = (tC: number) => (G0 - DS_GD * (tC + 273.15 - 298.15)) / -DV_GD;

export function GraphiteDiamondDemo() {
  const [tC, setTC] = useState(25);
  const [p, setP] = useState(500);
  const W = 360, H = 270, L = 48, B = 40, R = 22, T = 14;
  const tMax = 1500, pMax = 6000;
  const x = (t: number) => L + (t / tMax) * (W - L - R);
  const y = (pp: number) => H - B - (pp / pMax) * (H - B - T);

  const g = dGgd(tC, p);
  const pb = pBoundary(tC);
  const stable = g > 0 ? "石墨" : "鑽石";

  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：石墨–鑽石相圖</b>
        <span>拉溫度和壓力，看這一點哪個相穩定</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="石墨–鑽石相界">
          <polygon
            points={`${x(0)},${y(pBoundary(0))} ${x(tMax)},${y(pBoundary(tMax))} ${x(tMax)},${y(pMax)} ${x(0)},${y(pMax)}`}
            fill="var(--teal)"
            opacity={0.18}
          />
          <polygon
            points={`${x(0)},${y(0)} ${x(tMax)},${y(0)} ${x(tMax)},${y(pBoundary(tMax))} ${x(0)},${y(pBoundary(0))}`}
            fill="var(--gold)"
            opacity={0.15}
          />
          <line x1={x(0)} y1={y(pBoundary(0))} x2={x(tMax)} y2={y(pBoundary(tMax))} stroke="currentColor" strokeWidth={2.5} />
          <text x={x(350)} y={y(4600)} style={{ fontWeight: 800 }}>鑽石穩定（ΔG &lt; 0）</text>
          <text x={x(750)} y={y(900)} style={{ fontWeight: 800 }}>石墨穩定（ΔG &gt; 0）</text>
          <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="currentColor" strokeWidth={2} />
          <line x1={L} y1={T} x2={L} y2={H - B} stroke="currentColor" strokeWidth={2} />
          <text x={(L + W - R) / 2} y={H - 1} textAnchor="middle">T (°C)</text>
          <text x={6} y={T + 10}>P</text>
          <text x={6} y={T + 24} style={{ fontSize: 11 }}>(GPa)</text>
          {[0, 500, 1000, 1500].map((t) => (
            <text key={t} x={x(t)} y={H - B + 16} textAnchor="middle" style={{ fontSize: 11 }}>{t}</text>
          ))}
          {[0, 2000, 4000, 6000].map((pp) => (
            <text key={pp} x={L - 6} y={y(pp) + 4} textAnchor="end" style={{ fontSize: 11 }}>{pp / 1000}</text>
          ))}
          <circle cx={x(tC)} cy={y(p)} r={7} fill={g > 0 ? "var(--gold)" : "var(--teal)"} stroke="var(--navy)" strokeWidth={2.5} />
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>溫度</span>
              <span>{tC} °C</span>
            </label>
            <input type="range" min={0} max={tMax} step={25} value={tC} onChange={(e) => setTC(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>壓力</span>
              <span>{fmt(p / 1000, 2)} GPa</span>
            </label>
            <input type="range" min={0} max={pMax} step={50} value={p} onChange={(e) => setP(+e.target.value)} />
          </div>
          <div className="ix-readout">
            石墨 → 鑽石：
            <br />ΔG ≈ 2865 + 3.37 × (T − 298) − 1.881 × P
            <br />= <b>{fmt(g)} J/mol</b>
            <br />這個溫度的相界壓力 ≈ <b>{fmt(pb / 1000, 2)} GPa</b>
          </div>
          <div className="ix-verdict">穩定的是：{stable}</div>
          <div className="ix-note">
            加壓有利體積小的鑽石（ΔV &lt; 0）；升溫有利熵大的石墨（ΔS &lt; 0）。相界斜率 = ΔS/ΔV ≈ 1.79 MPa/K，所以溫度越高，要越大的壓力才長得出鑽石。
          </div>
        </div>
      </div>
    </figure>
  );
}
