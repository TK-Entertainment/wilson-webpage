"use client";

import { useState } from "react";
import "./notes.css";

// 地球構造各章的互動圖
const INK = "currentColor";
const fmt = (x: number, d = 0) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

function Arrow({ id, color }: { id: string; color: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" style={{ fill: color }} />
    </marker>
  );
}

/* ───────────── Ch1：赤平投影（下半球、等角） ───────────── */

// 向量：x 東、y 北、z 上
type V = [number, number, number];
const lineVec = (trend: number, plunge: number): V => [Math.cos(rad(plunge)) * Math.sin(rad(trend)), Math.cos(rad(plunge)) * Math.cos(rad(trend)), -Math.sin(rad(plunge))];
const toTP = (v: V) => {
  let [x, y, z] = v;
  if (z > 0) [x, y, z] = [-x, -y, -z];
  const plunge = deg(Math.asin(Math.min(1, -z)));
  let trend = deg(Math.atan2(x, y));
  if (trend < 0) trend += 360;
  return { trend, plunge };
};

export function StereonetDemo() {
  const [strike, setStrike] = useState(30);
  const [dip, setDip] = useState(40);
  const [trend, setTrend] = useState(80);
  const [plunge, setPlunge] = useState(25);
  const R = 120, cx = 140, cy = 140;
  const proj = (t: number, p: number) => {
    const r = R * Math.tan(rad((90 - p) / 2));
    return [cx + r * Math.sin(rad(t)), cy - r * Math.cos(rad(t))];
  };
  // 右手法則：傾向 = 走向 + 90
  const dd = (strike + 90) % 360;
  const s: V = [Math.sin(rad(strike)), Math.cos(rad(strike)), 0];
  const d = lineVec(dd, dip);
  const gc: string[] = [];
  for (let i = 0; i <= 180; i++) {
    const t = rad(i);
    const v: V = [Math.cos(t) * s[0] + Math.sin(t) * d[0], Math.cos(t) * s[1] + Math.sin(t) * d[1], Math.cos(t) * s[2] + Math.sin(t) * d[2]];
    const tp = toTP(v);
    const [px, py] = proj(tp.trend, tp.plunge);
    gc.push(`${px},${py}`);
  }
  const pole = proj((dd + 180) % 360, 90 - dip);
  const ln = proj(trend, plunge);
  const [ddx, ddy] = proj(dd, dip);
  // 線在不在面上：線和法向量的夾角
  const n: V = lineVec((dd + 180) % 360, 90 - dip);
  const l = lineVec(trend, plunge);
  const dot = Math.abs(n[0] * l[0] + n[1] * l[1] + n[2] * l[2]);
  const onPlane = dot < Math.sin(rad(3));
  const tick = (a: number, len: number) => {
    const [x1, y1] = [cx + R * Math.sin(rad(a)), cy - R * Math.cos(rad(a))];
    const [x2, y2] = [cx + (R + len) * Math.sin(rad(a)), cy - (R + len) * Math.cos(rad(a))];
    return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={1} />;
  };
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：赤平投影</b>
        <span>下半球、等角投影；拉面的走向／傾角和線的趨向／傾伏</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox="0 0 280 312" className="ix-svg" role="img" aria-label="赤平投影">
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={INK} strokeWidth={2} />
          {Array.from({ length: 36 }, (_, i) => tick(i * 10, i % 9 === 0 ? 8 : 4))}
          {[["N", 0], ["E", 90], ["S", 180], ["W", 270]].map(([t, a]) => (
            <text key={t as string} x={cx + (R + 16) * Math.sin(rad(a as number))} y={cy - (R + 16) * Math.cos(rad(a as number)) + 4} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800 }}>{t}</text>
          ))}
          <line x1={cx - 4} x2={cx + 4} y1={cy} y2={cy} stroke={INK} />
          <line x1={cx} x2={cx} y1={cy - 4} y2={cy + 4} stroke={INK} />
          {/* 走向線 */}
          <line x1={cx + R * Math.sin(rad(strike))} y1={cy - R * Math.cos(rad(strike))} x2={cx - R * Math.sin(rad(strike))} y2={cy + R * Math.cos(rad(strike))} stroke={INK} strokeOpacity={0.35} strokeDasharray="4 3" />
          <polyline points={gc.join(" ")} fill="none" stroke="var(--teal)" strokeWidth={2.6} />
          <circle cx={ddx} cy={ddy} r={3} fill="var(--teal)" />
          <circle cx={pole[0]} cy={pole[1]} r={5} fill="none" stroke="var(--teal)" strokeWidth={2.2} />
          <text x={pole[0] + 7} y={pole[1] - 6} style={{ fontSize: 11, fontWeight: 800, fill: "var(--teal)" }}>極點</text>
          <rect x={ln[0] - 5} y={ln[1] - 5} width={10} height={10} fill="var(--orange)" stroke={INK} />
          <text x={ln[0] + 8} y={ln[1] + 14} style={{ fontSize: 11, fontWeight: 800, fill: "var(--orange)" }}>線</text>
          <text x={cx} y={306} textAnchor="middle" style={{ fontSize: 11 }}>藍綠大圓 = 面；圓圈 = 面的極點；方塊 = 線</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>面：走向（右手法則）</span>
              <span>{String(strike).padStart(3, "0")}°</span>
            </label>
            <input type="range" min={0} max={359} step={1} value={strike} onChange={(e) => setStrike(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>面：傾角</span>
              <span>{dip}°</span>
            </label>
            <input type="range" min={1} max={90} step={1} value={dip} onChange={(e) => setDip(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>線：趨向（trend）</span>
              <span>{String(trend).padStart(3, "0")}°</span>
            </label>
            <input type="range" min={0} max={359} step={1} value={trend} onChange={(e) => setTrend(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>線：傾伏（plunge）</span>
              <span>{plunge}°</span>
            </label>
            <input type="range" min={0} max={90} step={1} value={plunge} onChange={(e) => setPlunge(+e.target.value)} />
          </div>
          <div className="ix-readout">
            面 {String(strike).padStart(3, "0")}/{dip}：傾向 <b>{String(dd).padStart(3, "0")}°</b>
            <br />極點：<b>{fmt(90 - dip)}° → {String((dd + 180) % 360).padStart(3, "0")}°</b>（plunge/trend）
            <br />線：<b>{plunge}° → {String(trend).padStart(3, "0")}°</b>
          </div>
          <div className="ix-verdict">{onPlane ? "這條線落在面上" : "這條線不在面上"}</div>
          <div className="ix-note">
            大圓越靠近圓心，傾角越陡；極點在大圓對面、離圓心 (90° − 傾角) 的位置。線的 plunge 越大越靠近圓心。試著讓方塊落到大圓上：那就是面上的一條線，可以量 rake。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── Ch1：Anderson 斷層理論 ───────────── */

type Regime = "normal" | "strike" | "reverse";

export function AndersonDemo() {
  const [rg, setRg] = useState<Regime>("normal");
  const [phi, setPhi] = useState(30); // 內摩擦角
  const theta = 45 - phi / 2; // 斷層與 σ1 的夾角
  const W = 340, H = 250, cx = 170, cy = 130;
  const info: Record<Regime, { v: string; name: string; view: string; dip: string }> = {
    normal: { v: "σ1", name: "正斷層", view: "垂直剖面（⊥ 走向）", dip: `${fmt(90 - theta)}°` },
    strike: { v: "σ2", name: "平移斷層", view: "地圖（俯視）", dip: "90°（直立）" },
    reverse: { v: "σ3", name: "逆斷層", view: "垂直剖面（⊥ 走向）", dip: `${fmt(theta)}°` },
  };
  // σ1 的方向角（畫面座標，0 = 水平）
  const s1ang = rg === "normal" ? 90 : 0;
  const a1 = rad(s1ang + theta), a2 = rad(s1ang - theta);
  const L = 120;
  const fl = (a: number) => <line x1={cx - L * Math.cos(a)} y1={cy + L * Math.sin(a)} x2={cx + L * Math.cos(a)} y2={cy - L * Math.sin(a)} stroke="var(--orange)" strokeWidth={3} />;
  const arr = (ang: number, col: string, id: string, lab: string, big: boolean) => {
    const a = rad(ang);
    const r0 = 104, r1 = big ? 70 : 84;
    return (
      <g>
        {[1, -1].map((sg) => (
          <line key={sg} x1={cx + sg * r0 * Math.cos(a)} y1={cy - sg * r0 * Math.sin(a)} x2={cx + sg * r1 * Math.cos(a)} y2={cy - sg * r1 * Math.sin(a)} stroke={col} strokeWidth={big ? 5 : 2.5} markerEnd={`url(#${id})`} />
        ))}
        <text x={cx + 124 * Math.cos(a)} y={cy - 120 * Math.sin(a) + 5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800, fill: col }}>{lab}</text>
      </g>
    );
  };
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：Anderson 斷層理論</b>
        <span>選哪個主應力是垂直的，再拉內摩擦角，看斷層的位態</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="Anderson 斷層">
          <defs>
            <Arrow id="an-o" color="var(--orange)" />
            <Arrow id="an-t" color="var(--teal)" />
          </defs>
          <rect x={cx - 100} y={cy - 100} width={200} height={200} fill="var(--navy)" fillOpacity={0.18} stroke={INK} strokeOpacity={0.4} />
          {rg !== "strike" && <line x1={cx - 100} x2={cx + 100} y1={cy - 100} y2={cy - 100} stroke={INK} strokeWidth={3} />}
          {rg !== "strike" && <text x={cx - 98} y={cy - 106} style={{ fontSize: 10.5 }}>地表（自由面）</text>}
          <clipPath id="an-clip">
            <rect x={cx - 100} y={cy - 100} width={200} height={200} />
          </clipPath>
          <g clipPath="url(#an-clip)">
            {fl(a1)}
            {fl(a2)}
          </g>
          {arr(s1ang, "var(--orange)", "an-o", "σ1", true)}
          {arr(s1ang + 90, "var(--teal)", "an-t", "σ3", false)}
          <circle cx={cx} cy={cy} r={6} fill="none" stroke={INK} strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={1.8} fill={INK} />
          <text x={cx + 9} y={cy + 18} style={{ fontSize: 11, fontWeight: 800 }}>σ2（垂直紙面）</text>
          <path d={`M${cx + 40 * Math.cos(rad(s1ang))},${cy - 40 * Math.sin(rad(s1ang))} A40,40 0 0,0 ${cx + 40 * Math.cos(a1)},${cy - 40 * Math.sin(a1)}`} fill="none" stroke={INK} strokeWidth={1.2} />
          <text x={cx + 50 * Math.cos(rad(s1ang + theta / 2))} y={cy - 50 * Math.sin(rad(s1ang + theta / 2)) + 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800 }}>{fmt(theta)}°</text>
          <text x={6} y={H - 8} style={{ fontSize: 11 }}>{info[rg].view}</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-btns">
            {([["normal", "σv = σ1"], ["strike", "σv = σ2"], ["reverse", "σv = σ3"]] as [Regime, string][]).map(([k, t]) => (
              <button key={k} type="button" className="ix-btn" aria-pressed={rg === k} onClick={() => setRg(k)}>
                {t}
              </button>
            ))}
          </div>
          <div className="ix-row">
            <label>
              <span>內摩擦角 φ</span>
              <span>{phi}°</span>
            </label>
            <input type="range" min={0} max={50} step={1} value={phi} onChange={(e) => setPhi(+e.target.value)} />
          </div>
          <div className="ix-readout">
            垂直的主應力：<b>{info[rg].v}</b>
            <br />斷層和 σ1 的夾角 θ = 45° − φ/2 = <b>{fmt(theta)}°</b>
            <br />斷層傾角：<b>{info[rg].dip}</b>
          </div>
          <div className="ix-verdict">{info[rg].name}</div>
          <div className="ix-note">
            兩條橘線是一對共軛斷層，都包含 σ2；σ1 平分它們的銳角（2θ），σ3 平分鈍角。φ = 30°（一般岩石）時 θ = 30°，所以正斷層傾角約 60°、逆斷層約 30°。φ = 0 時 θ = 45°，就是最大剪應力面。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── Ch2：pure / subsimple / simple shear ───────────── */

type M2 = [number, number, number, number]; // [a b; c d]
const mul = (m: M2, p: [number, number]): [number, number] => [m[0] * p[0] + m[1] * p[1], m[2] * p[0] + m[3] * p[1]];
// 速度梯度 L = [[a, b], [0, −a]]，exp(L t)
const flowD = (a: number, b: number, t: number): M2 => {
  const e = Math.exp(a * t), ei = Math.exp(-a * t);
  const off = Math.abs(a) < 1e-9 ? b * t : (b * Math.sinh(a * t)) / a;
  return [e, off, 0, ei];
};
// 2×2 矩陣的奇異值與長軸方向
const svd = (m: M2) => {
  const [a, b, c, d] = m;
  // F Fᵀ 的特徵向量給出變形後橢圓的軸
  const p = a * a + b * b, q = a * c + b * d, r = c * c + d * d;
  const tr = p + r, det = p * r - q * q;
  const l1 = tr / 2 + Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const l2 = tr / 2 - Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const ang = 0.5 * Math.atan2(2 * q, p - r);
  return { X: Math.sqrt(l1), Y: Math.sqrt(Math.max(l2, 1e-12)), ang };
};

export function ShearDemo() {
  const [wk, setWk] = useState(1);
  const [amt, setAmt] = useState(1);
  const a = (amt * Math.sqrt(Math.max(0, 1 - wk * wk))) / 2;
  const b = amt * wk;
  const D = flowD(a, b, 1);
  const { X, Y, ang } = svd(D);
  const S = 60, cx = 170, cy = 125;
  const P = (p: [number, number]) => `${cx + S * p[0]},${cy - S * p[1]}`;
  const sq: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const grid: [number, number][][] = [];
  for (let i = -1; i <= 1; i += 0.5) {
    grid.push([[i, -1], [i, 1]]);
    grid.push([[-1, i], [1, i]]);
  }
  const circle: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const t = (i / 72) * 2 * Math.PI;
    circle.push(P(mul(D, [0.8 * Math.cos(t), 0.8 * Math.sin(t)])));
  }
  // 流脊：L 的特徵向量 (1,0) 與 (−b, 2a)
  const apo2 = a < 1e-6 && b > 0 ? null : ([-b, 2 * a] as [number, number]);
  const alpha = apo2 ? deg(Math.acos(Math.abs(apo2[0]) / Math.hypot(apo2[0], apo2[1]))) : 0;
  // 質點路徑
  const starts: [number, number][] = [[-0.9, 0.9], [0.3, 0.9], [-0.9, -0.5], [0.9, -0.9], [0.9, 0.4]];
  const paths = starts.map((p0) => {
    const pts: string[] = [];
    for (let i = 0; i <= 30; i++) pts.push(P(mul(flowD(a, b, i / 30), p0)));
    return pts.join(" ");
  });
  const name = wk > 0.98 ? "simple shear" : wk < 0.02 ? "pure shear" : "subsimple shear";
  const L = 1.6;
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：pure、subsimple、simple shear</b>
        <span>拉運動渦度數 W<sub>k</sub> 和變形量，看格子、應變橢圓、流脊和質點路徑</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox="0 0 340 250" className="ix-svg" role="img" aria-label="剪切變形">
          <defs>
            <clipPath id="sh-clip">
              <rect x={0} y={0} width={340} height={250} />
            </clipPath>
          </defs>
          <polygon points={sq.map(P).join(" ")} fill="none" stroke={INK} strokeOpacity={0.25} strokeDasharray="3 3" />
          <g clipPath="url(#sh-clip)">
            {grid.map((g, i) => (
              <line key={i} x1={cx + S * mul(D, g[0])[0]} y1={cy - S * mul(D, g[0])[1]} x2={cx + S * mul(D, g[1])[0]} y2={cy - S * mul(D, g[1])[1]} stroke={INK} strokeOpacity={0.35} />
            ))}
            <polygon points={sq.map((p) => P(mul(D, p))).join(" ")} fill="var(--navy)" fillOpacity={0.2} stroke={INK} strokeWidth={1.5} />
            <line x1={cx - S * L} y1={cy} x2={cx + S * L} y2={cy} stroke="var(--gold)" strokeWidth={1.6} strokeDasharray="7 4" />
            {apo2 && <line x1={cx - (S * L * apo2[0]) / Math.hypot(...apo2)} y1={cy + (S * L * apo2[1]) / Math.hypot(...apo2)} x2={cx + (S * L * apo2[0]) / Math.hypot(...apo2)} y2={cy - (S * L * apo2[1]) / Math.hypot(...apo2)} stroke="var(--gold)" strokeWidth={1.6} strokeDasharray="7 4" />}
            {paths.map((p, i) => (
              <polyline key={i} points={p} fill="none" stroke="var(--teal)" strokeWidth={1.4} strokeOpacity={0.9} />
            ))}
            <polygon points={circle.join(" ")} fill="var(--orange)" fillOpacity={0.25} stroke="var(--orange)" strokeWidth={2.2} />
            <line x1={cx - S * 0.8 * X * Math.cos(ang)} y1={cy + S * 0.8 * X * Math.sin(ang)} x2={cx + S * 0.8 * X * Math.cos(ang)} y2={cy - S * 0.8 * X * Math.sin(ang)} stroke="var(--orange)" strokeWidth={2.4} />
          </g>
          <text x={8} y={16} style={{ fontSize: 10.5 }}>虛線方框：原本的正方形；橘色：原本的圓 → 應變橢圓與 X 軸</text>
          <text x={8} y={244} style={{ fontSize: 10.5, fill: "var(--teal)" }}>藍綠：質點路徑</text>
          <text x={110} y={244} style={{ fontSize: 10.5, fill: "var(--gold)" }}>金色虛線：流脊（flow apophyses）</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>運動渦度數 W<sub>k</sub></span>
              <span>{fmt(wk, 2)}</span>
            </label>
            <input type="range" min={0} max={1} step={0.01} value={wk} onChange={(e) => setWk(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>變形量</span>
              <span>{fmt(amt, 2)}</span>
            </label>
            <input type="range" min={0} max={2} step={0.02} value={amt} onChange={(e) => setAmt(+e.target.value)} />
          </div>
          <div className="ix-readout">
            應變比 R = X/Y = <b>{fmt(X / Y, 2)}</b>
            <br />X 軸與剪動方向夾角 = <b>{fmt(Math.abs(deg(ang)), 1)}°</b>
            <br />兩條流脊的夾角 α = <b>{wk > 0.98 ? "0°（只剩一條）" : `${fmt(alpha, 0)}°`}</b>（cos α = W<sub>k</sub>）
            <br />面積不變（det = 1）
          </div>
          <div className="ix-verdict">{name}</div>
          <div className="ix-note">
            W<sub>k</sub> = 0 是 pure shear：X 軸一直水平（共軸），兩條流脊互相垂直，質點沿雙曲線進出。W<sub>k</sub> = 1 是 simple shear：水平的剪動面長度不變，質點直線水平移動，X 軸從 45° 一路轉向剪動方向（非共軸）。中間是 subsimple shear。同一個 R 可以由不同的 W<sub>k</sub> 達成。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── Ch2：Flinn 圖 ───────────── */

export function FlinnDemo() {
  const [a, setA] = useState(2); // X/Y
  const [bb, setB] = useState(1.5); // Y/Z
  const k = (a - 1) / Math.max(1e-6, bb - 1);
  const W = 260, H = 250, L = 40, R = 12, T = 12, B = 36;
  const x = (v: number) => L + ((v - 1) / 3) * (W - L - R);
  const y = (v: number) => T + ((4 - v) / 3) * (H - T - B);
  const shape = Math.abs(a - bb) < 0.08 ? "平面應變（k ≈ 1）" : a > bb ? "雪茄狀 prolate（k > 1）：L-tectonite" : "鬆餅狀 oblate（k < 1）：S-tectonite";
  // 三軸：Z = 1，Y = bb，X = a·bb，畫兩個主切面
  const Z = 1, Yv = bb, Xv = a * bb;
  const sc = 22 / Math.max(Xv, 1);
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：Flinn 圖</b>
        <span>拉 X/Y 和 Y/Z，看應變橢球是雪茄還是鬆餅</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W + 120} ${H}`} className="ix-svg" role="img" aria-label="Flinn 圖">
          <polygon points={`${x(1)},${y(1)} ${x(4)},${y(4)} ${x(1)},${y(4)}`} fill="var(--orange)" fillOpacity={0.1} />
          <polygon points={`${x(1)},${y(1)} ${x(4)},${y(4)} ${x(4)},${y(1)}`} fill="var(--teal)" fillOpacity={0.1} />
          <line x1={x(1)} y1={y(1)} x2={x(4)} y2={y(4)} stroke={INK} strokeWidth={1.6} strokeDasharray="6 4" />
          <text x={x(3.35)} y={y(3.65)} textAnchor="end" style={{ fontSize: 10.5 }}>k = 1</text>
          <text x={x(1.4)} y={y(3.5)} style={{ fontSize: 11, fontWeight: 800 }}>雪茄 k &gt; 1</text>
          <text x={x(2.9)} y={y(1.5)} style={{ fontSize: 11, fontWeight: 800 }}>鬆餅 k &lt; 1</text>
          <circle cx={x(Math.min(4, bb))} cy={y(Math.min(4, a))} r={6} fill="var(--gold)" stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[1, 2, 3, 4].map((v) => (
            <g key={v}>
              <text x={x(v)} y={H - B + 15} textAnchor="middle" style={{ fontSize: 11 }}>{v}</text>
              <text x={L - 5} y={y(v) + 4} textAnchor="end" style={{ fontSize: 11 }}>{v}</text>
            </g>
          ))}
          <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 12 }}>b = Y/Z</text>
          <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 12 }}>a = X/Y</text>
          {/* 兩個主切面 */}
          <g transform={`translate(${W + 60},70)`}>
            <ellipse cx={0} cy={0} rx={sc * Xv} ry={sc * Yv} fill="var(--orange)" fillOpacity={0.3} stroke="var(--orange)" strokeWidth={2} />
            <text x={0} y={-sc * Yv - 6} textAnchor="middle" style={{ fontSize: 10.5 }}>XY 面</text>
          </g>
          <g transform={`translate(${W + 60},170)`}>
            <ellipse cx={0} cy={0} rx={sc * Yv} ry={sc * Z} fill="var(--teal)" fillOpacity={0.3} stroke="var(--teal)" strokeWidth={2} />
            <text x={0} y={-Math.max(sc * Z, 10) - 6} textAnchor="middle" style={{ fontSize: 10.5 }}>YZ 面</text>
          </g>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>a = X/Y</span>
              <span>{fmt(a, 2)}</span>
            </label>
            <input type="range" min={1} max={4} step={0.02} value={a} onChange={(e) => setA(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>b = Y/Z</span>
              <span>{fmt(bb, 2)}</span>
            </label>
            <input type="range" min={1} max={4} step={0.02} value={bb} onChange={(e) => setB(+e.target.value)} />
          </div>
          <div className="ix-readout">
            k = (a − 1)/(b − 1) = <b>{bb - 1 < 0.01 ? "∞" : fmt(k, 2)}</b>
          </div>
          <div className="ix-verdict">{shape}</div>
          <div className="ix-note">
            k &gt; 1：X 特別長，像雪茄，岩石發育線理（L-tectonite）；k &lt; 1：Z 特別短，像鬆餅，發育葉理（S-tectonite）；k = 1 是沒有體積變化時的平面應變（Y = 1）。原點 (1, 1) 是沒有變形。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── Ch3：Fry 法 ───────────── */

const seeded = (n: number) => {
  // 簡單的偽亂數，讓每次畫出來一樣
  let s = 12345;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const pts: [number, number][] = [];
  let tries = 0;
  while (pts.length < n && tries < 20000) {
    tries++;
    const p: [number, number] = [r() * 2 - 1, r() * 2 - 1];
    if (pts.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.16)) pts.push(p);
  }
  return pts;
};
const FRY_PTS = seeded(90);

export function FryDemo() {
  const [Rs, setRs] = useState(2.2);
  const [th, setTh] = useState(25);
  const k = Math.sqrt(Rs);
  const c = Math.cos(rad(th)), s = Math.sin(rad(th));
  // 先在主軸座標拉伸，再旋轉
  const def = (p: [number, number]): [number, number] => {
    const u = c * p[0] + s * p[1], v = -s * p[0] + c * p[1];
    const U = u * k, V = v / k;
    return [c * U - s * V, s * U + c * V];
  };
  const pts = FRY_PTS.map(def);
  const pairs: [number, number][] = [];
  for (let i = 0; i < pts.length; i++)
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const d: [number, number] = [pts[j][0] - pts[i][0], pts[j][1] - pts[i][1]];
      if (Math.abs(d[0]) < 0.75 && Math.abs(d[1]) < 0.75) pairs.push(d);
    }
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：Fry 法</b>
        <span>原本大致均勻分布的顆粒中心被變形；把每一點輪流放到中心，疊起來看空白區</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox="0 0 340 180" className="ix-svg" role="img" aria-label="Fry 法">
          <rect x={5} y={10} width={160} height={160} fill="none" stroke={INK} strokeOpacity={0.3} />
          <clipPath id="fry-a">
            <rect x={5} y={10} width={160} height={160} />
          </clipPath>
          <g clipPath="url(#fry-a)">
            {pts.map((p, i) => (
              <circle key={i} cx={85 + p[0] * 55} cy={90 - p[1] * 55} r={2.6} fill="var(--orange)" />
            ))}
          </g>
          <text x={85} y={8} textAnchor="middle" style={{ fontSize: 10.5 }}>變形後的顆粒中心</text>
          <rect x={175} y={10} width={160} height={160} fill="none" stroke={INK} strokeOpacity={0.3} />
          <clipPath id="fry-b">
            <rect x={175} y={10} width={160} height={160} />
          </clipPath>
          <g clipPath="url(#fry-b)">
            {pairs.map((d, i) => (
              <circle key={i} cx={255 + d[0] * 105} cy={90 - d[1] * 105} r={1.1} fill="var(--teal)" />
            ))}
          </g>
          <line x1={255 - 70 * c} y1={90 + 70 * s} x2={255 + 70 * c} y2={90 - 70 * s} stroke="var(--gold)" strokeDasharray="4 3" />
          <text x={255} y={8} textAnchor="middle" style={{ fontSize: 10.5 }}>Fry 圖：中央空白 = 應變橢圓</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>應變比 R<sub>s</sub></span>
              <span>{fmt(Rs, 2)}</span>
            </label>
            <input type="range" min={1} max={4} step={0.05} value={Rs} onChange={(e) => setRs(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>長軸方向</span>
              <span>{th}°</span>
            </label>
            <input type="range" min={-80} max={80} step={1} value={th} onChange={(e) => setTh(+e.target.value)} />
          </div>
          <div className="ix-readout">
            空白區的長短軸比 ≈ <b>{fmt(Rs, 2)}</b>，長軸方向 ≈ <b>{th}°</b>（金色虛線）
          </div>
          <div className="ix-note">
            前提：變形前顆粒大小相近、中心彼此的距離大致相同（不會靠太近）。變形後，沿 X 方向的鄰居被拉遠、沿 Z 方向的被推近，所以疊圖中央那圈「不會有點」的空白區被拉成和應變橢圓一樣的形狀。R<sub>s</sub> = 1 時空白區是圓。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── Ch4：Mohr 圓 ───────────── */

export function MohrDemo() {
  const [s1, setS1] = useState(50);
  const [s3, setS3] = useState(22);
  const [th, setTh] = useState(60); // σ1 和面的法線的夾角
  const [pf, setPf] = useState(0);
  const e1 = s1 - pf, e3 = Math.min(s3, s1) - pf;
  const c = (e1 + e3) / 2, r = (e1 - e3) / 2;
  const sn = c + r * Math.cos(rad(2 * th)), ss = r * Math.sin(rad(2 * th));
  // Mohr 圖座標
  const W = 360, H = 200, L = 30, R = 10, T = 10, B = 30;
  const lo = -20, hi = 80;
  const X = (v: number) => L + ((v - lo) / (hi - lo)) * (W - L - R);
  const sc = (W - L - R) / (hi - lo);
  const Y0 = T + (H - T - B) * 0.62;
  const Y = (v: number) => Y0 - v * sc;
  // 物理圖：σ1 垂直，面依 θ 傾斜
  const bx = 70, by = 300, bs = 52;
  const dip = th; // 法線和垂直夾 θ → 面的傾角 = θ
  const pa = rad(dip);
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：Mohr 圓</b>
        <span>拉 σ1、σ3 和面的方向，看這個面上的正應力和剪應力；加孔隙壓看有效應力</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} 380`} className="ix-svg" role="img" aria-label="Mohr 圓">
          <defs>
            <Arrow id="mo-o" color="var(--orange)" />
            <Arrow id="mo-t" color="var(--teal)" />
          </defs>
          <line x1={L} x2={W - R} y1={Y0} y2={Y0} stroke={INK} strokeWidth={1.5} />
          <line x1={X(0)} x2={X(0)} y1={T} y2={H - B + 6} stroke={INK} strokeWidth={1.5} />
          {[-20, 0, 20, 40, 60, 80].map((v) => (
            <text key={v} x={X(v)} y={Y0 + 14} textAnchor="middle" style={{ fontSize: 10 }}>{v}</text>
          ))}
          <text x={W - R} y={Y0 - 6} textAnchor="end" style={{ fontSize: 11 }}>σn（MPa）</text>
          <text x={X(0) + 5} y={T + 8} style={{ fontSize: 11 }}>σs</text>
          {pf > 0 && <circle cx={X(c + pf)} cy={Y0} r={r * sc} fill="none" stroke={INK} strokeOpacity={0.3} strokeDasharray="4 3" />}
          <circle cx={X(c)} cy={Y0} r={Math.max(0.5, r * sc)} fill="var(--teal)" fillOpacity={0.12} stroke="var(--teal)" strokeWidth={2.4} />
          <line x1={X(c)} y1={Y0} x2={X(sn)} y2={Y(ss)} stroke={INK} strokeWidth={1.4} />
          <path d={`M${X(c) + 22},${Y0} A22,22 0 0,0 ${X(c) + 22 * Math.cos(rad(2 * th))},${Y0 - 22 * Math.sin(rad(2 * th))}`} fill="none" stroke={INK} />
          <text x={X(c) + 28 * Math.cos(rad(th))} y={Y0 - 28 * Math.sin(rad(th)) + 2} style={{ fontSize: 10.5, fontWeight: 800 }}>2θ</text>
          <line x1={X(sn)} y1={Y(ss)} x2={X(sn)} y2={Y0} stroke="var(--orange)" strokeDasharray="3 3" />
          <line x1={X(0)} y1={Y(ss)} x2={X(sn)} y2={Y(ss)} stroke="var(--orange)" strokeDasharray="3 3" />
          <circle cx={X(sn)} cy={Y(ss)} r={5.5} fill="var(--orange)" stroke={INK} strokeWidth={1.2} />
          <text x={X(e3)} y={Y0 + 26} textAnchor="middle" style={{ fontSize: 10.5, fontWeight: 800 }}>σ3{pf > 0 ? "′" : ""}</text>
          <text x={X(e1)} y={Y0 + 26} textAnchor="middle" style={{ fontSize: 10.5, fontWeight: 800 }}>σ1{pf > 0 ? "′" : ""}</text>
          {pf > 0 && <text x={X(c + pf)} y={T + 16} textAnchor="middle" style={{ fontSize: 10, opacity: 0.7 }}>虛線：沒有孔隙壓時</text>}
          {/* 物理圖 */}
          <rect x={bx - bs} y={by - bs} width={2 * bs} height={2 * bs} fill="var(--navy)" fillOpacity={0.15} stroke={INK} strokeOpacity={0.4} />
          <line x1={bx - 60 * Math.cos(pa)} y1={by - 60 * Math.sin(pa)} x2={bx + 60 * Math.cos(pa)} y2={by + 60 * Math.sin(pa)} stroke="var(--orange)" strokeWidth={3} />
          <line x1={bx} y1={by} x2={bx + 34 * Math.sin(pa)} y2={by - 34 * Math.cos(pa)} stroke={INK} strokeWidth={1.5} markerEnd="url(#mo-o)" />
          <text x={bx + 40 * Math.sin(pa) + 4} y={by - 40 * Math.cos(pa)} style={{ fontSize: 10 }}>法線</text>
          {[1, -1].map((sg) => (
            <line key={sg} x1={bx} y1={by - sg * 78} x2={bx} y2={by - sg * 58} stroke="var(--orange)" strokeWidth={4} markerEnd="url(#mo-o)" />
          ))}
          {[1, -1].map((sg) => (
            <line key={`h${sg}`} x1={bx - sg * 78} y1={by} x2={bx - sg * 60} y2={by} stroke="var(--teal)" strokeWidth={2.5} markerEnd="url(#mo-t)" />
          ))}
          <text x={bx + 12} y={by - 66} style={{ fontSize: 11, fontWeight: 800, fill: "var(--orange)" }}>σ1</text>
          <text x={bx + 62} y={by - 6} style={{ fontSize: 11, fontWeight: 800, fill: "var(--teal)" }}>σ3</text>
          <text x={bx + 2} y={by - 12} style={{ fontSize: 10.5 }}>θ</text>
          <text x={200} y={258} style={{ fontSize: 11 }}>面的傾角 = θ = {th}°</text>
          <text x={200} y={278} style={{ fontSize: 11 }}>（σ1 垂直、σ3 水平時）</text>
          <text x={200} y={310} style={{ fontSize: 11, fill: "var(--orange)", fontWeight: 800 }}>σn = {fmt(sn, 1)} MPa</text>
          <text x={200} y={330} style={{ fontSize: 11, fill: "var(--orange)", fontWeight: 800 }}>σs = {fmt(ss, 1)} MPa</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>σ1</span>
              <span>{s1} MPa</span>
            </label>
            <input type="range" min={0} max={80} step={1} value={s1} onChange={(e) => setS1(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>σ3</span>
              <span>{Math.min(s3, s1)} MPa</span>
            </label>
            <input type="range" min={-10} max={80} step={1} value={s3} onChange={(e) => setS3(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>θ（σ1 與面的法線夾角）</span>
              <span>{th}°</span>
            </label>
            <input type="range" min={0} max={90} step={1} value={th} onChange={(e) => setTh(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>孔隙壓 p<sub>f</sub></span>
              <span>{pf} MPa</span>
            </label>
            <input type="range" min={0} max={40} step={1} value={pf} onChange={(e) => setPf(+e.target.value)} />
          </div>
          <div className="ix-readout">
            圓心（平均應力）= <b>{fmt(c, 1)}</b>，半徑 = <b>{fmt(r, 1)}</b>
            <br />差應力 σ1 − σ3 = 直徑 = <b>{fmt(2 * r, 1)} MPa</b>
            <br />σn = {fmt(c, 1)} + {fmt(r, 1)} cos {2 * th}° = <b>{fmt(sn, 1)}</b>
            <br />σs = {fmt(r, 1)} sin {2 * th}° = <b>{fmt(ss, 1)}</b>
          </div>
          <div className="ix-note">
            預設值就是作業 Hw05：σ1 = 50、σ3 = 22，向東傾 60° 的斷層（θ = 60°）。θ = 45° 時剪應力最大，等於半徑。孔隙壓讓所有正應力減少 p<sub>f</sub>（有效應力），圓整個往左平移、大小不變。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ───────────── Ch5：埋藏與抬升的應力路徑（示意模型） ───────────── */

export function BurialUpliftDemo() {
  const [zmax, setZmax] = useState(4);
  const [z, setZ] = useState(1);
  const rg = 25; // MPa/km
  const G = 30; // °C/km
  const alpha = 1e-5;
  const rocks = [
    { n: "砂岩（硬：E = 40 GPa、ν = 0.15）", K0: 0.43, E: 40, nu: 0.15, col: "var(--orange)" },
    { n: "頁岩（軟：E = 10 GPa、ν = 0.35）", K0: 0.82, E: 10, nu: 0.35, col: "var(--teal)" },
  ];
  const rate = (r: (typeof rocks)[0]) => (r.nu / (1 - r.nu)) * rg + (r.E * 1e3 * alpha * G) / (1 - r.nu);
  const sH = (r: (typeof rocks)[0], zz: number) => r.K0 * rg * zmax - rate(r) * (zmax - zz);
  const W = 340, H = 260, L = 44, R = 14, T = 14, B = 34;
  const lo = -60, hi = 150;
  const x = (s: number) => L + ((s - lo) / (hi - lo)) * (W - L - R);
  const y = (d: number) => T + (d / 6) * (H - T - B);
  const zc = Math.min(z, zmax);
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：埋藏再抬升，水平應力怎麼變？</b>
        <span>先埋到最大深度，再拉「現在深度」往上抬，看砂岩和頁岩誰先進入張應力</span>
      </figcaption>
      <div className="ix-body">
        <svg viewBox={`0 0 ${W} ${H}`} className="ix-svg" role="img" aria-label="埋藏抬升應力路徑">
          <rect x={x(lo)} y={T} width={x(0) - x(lo)} height={H - T - B} fill="var(--rose, #d0567a)" fillOpacity={0.1} />
          <text x={x(-30)} y={y(5.7)} textAnchor="middle" style={{ fontSize: 10.5, fontWeight: 800 }}>張應力區</text>
          <line x1={x(0)} y1={T} x2={x(0)} y2={H - B} stroke={INK} strokeWidth={1.2} />
          <line x1={x(0)} y1={y(0)} x2={x(rg * 6)} y2={y(6)} stroke={INK} strokeDasharray="5 4" strokeOpacity={0.6} />
          <text x={x(rg * 5.3) - 4} y={y(5.3)} textAnchor="end" style={{ fontSize: 10.5 }}>σV</text>
          {rocks.map((r) => (
            <g key={r.n}>
              <line x1={x(0)} y1={y(0)} x2={x(r.K0 * rg * zmax)} y2={y(zmax)} stroke={r.col} strokeWidth={1.6} strokeDasharray="4 3" />
              <line x1={x(r.K0 * rg * zmax)} y1={y(zmax)} x2={x(sH(r, zc))} y2={y(zc)} stroke={r.col} strokeWidth={3} />
              <circle cx={x(sH(r, zc))} cy={y(zc)} r={5} fill={r.col} stroke={INK} />
            </g>
          ))}
          <line x1={L} x2={W - R} y1={y(zc)} y2={y(zc)} stroke="var(--gold)" strokeOpacity={0.6} />
          <line x1={L} x2={W - R} y1={T} y2={T} stroke={INK} strokeWidth={1.5} />
          <line x1={L} x2={L} y1={T} y2={H - B} stroke={INK} strokeWidth={1.5} />
          {[-50, 0, 50, 100, 150].map((s) => (
            <text key={s} x={x(s)} y={H - B + 14} textAnchor="middle" style={{ fontSize: 10.5 }}>{s}</text>
          ))}
          {[0, 2, 4, 6].map((d) => (
            <text key={d} x={L - 5} y={y(d) + 4} textAnchor="end" style={{ fontSize: 10.5 }}>{d}</text>
          ))}
          <text x={(L + W) / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 11.5 }}>應力（MPa，壓為正）</text>
          <text x={12} y={(T + H - B) / 2} transform={`rotate(-90 12 ${(T + H - B) / 2})`} textAnchor="middle" style={{ fontSize: 11.5 }}>深度（km）</text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>最大埋藏深度</span>
              <span>{zmax} km</span>
            </label>
            <input type="range" min={1} max={6} step={0.1} value={zmax} onChange={(e) => setZmax(+e.target.value)} />
          </div>
          <div className="ix-row">
            <label>
              <span>現在深度（抬升後）</span>
              <span>{fmt(zc, 1)} km</span>
            </label>
            <input type="range" min={0} max={6} step={0.1} value={z} onChange={(e) => setZ(+e.target.value)} />
          </div>
          <div className="ix-readout">
            σV = <b>{fmt(rg * zc, 0)}</b> MPa
            {rocks.map((r) => (
              <span key={r.n}>
                <br />
                <span style={{ color: r.col }}>■</span> {r.n.split("（")[0]} σH = <b>{fmt(sH(r, zc), 0)}</b> MPa{sH(r, zc) < 0 ? "（張應力 → 節理）" : ""}
              </span>
            ))}
          </div>
          <div className="ix-note">
            虛線：埋藏時（未固結的沉積物，σH 隨 σV 成比例增加）。實線：固結後抬升，σH 下降的速率 = ν/(1 − ν)·ρg + Eα·(地溫梯度)/(1 − ν)，第一項是覆蓋層變輕，第二項是冷卻收縮。E 大、ν 小的砂岩下降得快，先跨進張應力區；頁岩一直是壓應力。示意模型：ρg = 25 MPa/km、地溫梯度 30 °C/km、α = 10⁻⁵ /°C，岩石參數為代表值，未考慮孔隙壓。
          </div>
        </div>
      </div>
    </figure>
  );
}
