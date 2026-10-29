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
