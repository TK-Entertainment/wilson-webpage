"use client";

import { useState } from "react";
import { Fig } from "./Figs";
import "./notes.css";

// 地球構造期中作業的自繪圖：構造反轉（Week 1）、腕足類應變（Week 2）、克里特島正斷層古應力（Week 6）
const INK = "currentColor";
const C = {
  orange: "var(--orange)",
  teal: "var(--teal)",
  gold: "var(--gold)",
  navy: "var(--navy)",
  rose: "#d0567a",
  violet: "#8a6fd1",
  blue: "#5b8bd9",
  sage: "var(--sage)",
};
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const halo = {
  paintOrder: "stroke" as const,
  stroke: "hsl(var(--card))",
  strokeWidth: 3,
};

function Marks() {
  return (
    <defs>
      {[
        ["hw-k", "currentColor"],
        ["hw-o", C.orange],
        ["hw-t", C.teal],
        ["hw-r", C.rose],
      ].map(([id, c]) => (
        <marker
          key={id}
          id={id}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: c }} />
        </marker>
      ))}
    </defs>
  );
}

/* ═════════════ Week 1：正斷層的構造反轉 ═════════════ */

// 每格寬 230、高 150；斷層往右傾（上盤在右），x = 78 + 0.42 (y − 12)
const PW = 230;
const fx = (y: number) => 78 + 0.42 * (y - 12);
const LAYER = {
  A: C.sage,
  B: C.gold,
  C: C.teal,
  D: C.violet,
  base: "currentColor",
};

/** 一條界面：在上盤加上隆起量 bump(x)（往上為負） */
type Curve = (x: number) => number;
const flat =
  (y: number): Curve =>
  () =>
    y;
const band = (top: Curve, bot: Curve) => {
  const xs = Array.from({ length: 47 }, (_, i) => (i * PW) / 46);
  return `M${xs.map((x) => `${x},${top(x)}`).join("L")}L${xs
    .slice()
    .reverse()
    .map((x) => `${x},${bot(x)}`)
    .join("L")}Z`;
};

function Panel({
  i,
  title,
  sub,
  fw,
  hw,
  faultTop,
  sense,
  extra,
}: {
  i: number;
  title: string;
  sub: string;
  fw: [keyof typeof LAYER, Curve, Curve][];
  hw: [keyof typeof LAYER, Curve, Curve][];
  faultTop: number | null;
  sense?: "normal" | "reverse";
  extra?: React.ReactNode;
}) {
  const ox = i * (PW + 14);
  const id = `inv-${i}`;
  const fwPoly = `0,0 ${fx(0)},0 ${fx(150)},150 0,150`;
  const hwPoly = `${fx(0)},0 ${PW},0 ${PW},150 ${fx(150)},150`;
  // 斷層兩側的半箭頭
  const ay = 112;
  const ax = fx(ay);
  return (
    <g transform={`translate(${ox},0)`}>
      <defs>
        <clipPath id={`${id}-f`}>
          <polygon points={fwPoly} />
        </clipPath>
        <clipPath id={`${id}-h`}>
          <polygon points={hwPoly} />
        </clipPath>
      </defs>
      <rect
        x={0}
        y={0}
        width={PW}
        height={150}
        fill="none"
        stroke={INK}
        strokeOpacity={0.25}
      />
      <g clipPath={`url(#${id}-f)`}>
        {fw.map(([k, t, b], j) => (
          <path
            key={j}
            d={band(t, b)}
            fill={LAYER[k]}
            fillOpacity={k === "base" ? 0.08 : 0.4}
            stroke={INK}
            strokeWidth={0.8}
          />
        ))}
      </g>
      <g clipPath={`url(#${id}-h)`}>
        {hw.map(([k, t, b], j) => (
          <path
            key={j}
            d={band(t, b)}
            fill={LAYER[k]}
            fillOpacity={k === "base" ? 0.08 : 0.4}
            stroke={INK}
            strokeWidth={0.8}
          />
        ))}
      </g>
      {faultTop !== null ? (
        <line
          x1={fx(faultTop)}
          y1={faultTop}
          x2={fx(150)}
          y2={150}
          stroke={C.rose}
          strokeWidth={2.4}
        />
      ) : null}
      {faultTop !== null && faultTop > 30 ? (
        <line
          x1={fx(10)}
          y1={10}
          x2={fx(faultTop)}
          y2={faultTop}
          stroke={C.rose}
          strokeWidth={1.2}
          strokeDasharray="3 3"
          strokeOpacity={0.6}
        />
      ) : null}
      {sense ? (
        <g stroke={C.rose} strokeWidth={1.8} fill="none">
          {/* 上盤箭頭（右側） */}
          <line
            x1={ax + 10}
            y1={sense === "normal" ? ay - 14 : ay + 14}
            x2={ax + 10 + 0.42 * (sense === "normal" ? 22 : -22)}
            y2={sense === "normal" ? ay + 8 : ay - 8}
            markerEnd="url(#hw-r)"
          />
          <line
            x1={ax - 10}
            y1={sense === "normal" ? ay + 8 : ay - 8}
            x2={ax - 10 - 0.42 * (sense === "normal" ? 22 : -22)}
            y2={sense === "normal" ? ay - 14 : ay + 14}
            markerEnd="url(#hw-r)"
          />
        </g>
      ) : null}
      {extra}
      <text x={6} y={166} style={{ fontSize: 12, fontWeight: 800 }}>
        {i + 1}. {title}
      </text>
      <text x={6} y={182} style={{ fontSize: 11, opacity: 0.75 }}>
        {sub}
      </text>
    </g>
  );
}

export function InversionFig() {
  // 上盤的拱起：靠斷層附近最高，往右遞減
  const up = (x: number) => {
    const d = x - fx(60);
    return -22 * Math.exp(-((d - 30) ** 2) / (2 * 45 ** 2));
  };
  // 正斷層時期上盤的下陷（越靠斷層越深，像 rollover）
  const sag = (x: number) => 28 * Math.exp(-Math.max(0, x - fx(110)) / 70);
  const H =
    (y: number, s = true, u = false): Curve =>
    (x) =>
      y + (s ? sag(x) : 0) + (u ? up(x) : 0);
  return (
    <Fig
      caption="Week 1 的剖面怎麼一步一步形成。① A 沉積後發生正斷層，上盤下陷，B 一邊沉積一邊被斷層錯動，所以上盤的 B 比下盤厚很多（同沉積楔形）。② 斷層停止，C 均勻覆蓋兩側。③ 應力反轉成擠壓，同一條斷層被當成逆斷層再活動，上盤被推上來、拱成背斜：深處的 A 還保留正斷層的落差（上盤比較低），淺處的 C 已經變成逆斷層的落差（上盤比較高），中間的 B 有一個沒有落差的「零點」。④ D 在擠壓期間沉積（斷層切進 D 的下部、背斜頂上的 D 比較薄），最後侵蝕成平的地表。"
      source="課堂投影片（胡植慶）Week 1 作業圖；構造反轉概念參考 Fossen《Structural Geology》"
    >
      <svg
        viewBox={`0 0 ${4 * PW + 3 * 14} 190`}
        className="ix-svg"
        role="img"
        aria-label="構造反轉的四個階段"
        style={{ maxWidth: 980, margin: "0 auto" }}
      >
        <Marks />
        <Panel
          i={0}
          title="正斷層＋同沉積"
          sub="B 在上盤變厚（楔形）"
          fw={[
            ["base", flat(112), flat(160)],
            ["A", flat(98), flat(112)],
            ["B", flat(88), flat(98)],
          ]}
          hw={[
            ["base", H(112), flat(160)],
            ["A", H(98), H(112)],
            ["B", flat(88), H(98)],
          ]}
          faultTop={88}
          sense="normal"
        />
        <Panel
          i={1}
          title="斷層停止，C 覆蓋"
          sub="C 兩側等厚"
          fw={[
            ["base", flat(112), flat(160)],
            ["A", flat(98), flat(112)],
            ["B", flat(88), flat(98)],
            ["C", flat(74), flat(88)],
          ]}
          hw={[
            ["base", H(112), flat(160)],
            ["A", H(98), H(112)],
            ["B", flat(88), H(98)],
            ["C", flat(74), flat(88)],
          ]}
          faultTop={88}
        />
        <Panel
          i={2}
          title="擠壓：逆斷層再活動"
          sub="上盤拱成背斜"
          fw={[
            ["base", flat(112), flat(160)],
            ["A", flat(98), flat(112)],
            ["B", flat(88), flat(98)],
            ["C", flat(74), flat(88)],
          ]}
          hw={[
            ["base", H(112, true, true), flat(160)],
            ["A", H(98, true, true), H(112, true, true)],
            ["B", H(88, false, true), H(98, true, true)],
            ["C", H(74, false, true), H(88, false, true)],
          ]}
          faultTop={70}
          sense="reverse"
          extra={
            <g>
              <circle
                cx={fx(93)}
                cy={93}
                r={4}
                fill="none"
                stroke={INK}
                strokeWidth={1.5}
              />
              <text
                x={fx(93) - 8}
                y={93 + 3}
                textAnchor="end"
                style={{ fontSize: 10, fontWeight: 800, ...halo }}
              >
                零點
              </text>
            </g>
          }
        />
        <Panel
          i={3}
          title="D 沉積、侵蝕"
          sub="背斜頂上 D 較薄"
          fw={[
            ["base", flat(112), flat(160)],
            ["A", flat(98), flat(112)],
            ["B", flat(88), flat(98)],
            ["C", flat(74), flat(88)],
            ["D", flat(30), flat(74)],
          ]}
          hw={[
            ["base", H(112, true, true), flat(160)],
            ["A", H(98, true, true), H(112, true, true)],
            ["B", H(88, false, true), H(98, true, true)],
            ["C", H(74, false, true), H(88, false, true)],
            ["D", flat(30), H(74, false, true)],
          ]}
          faultTop={62}
          extra={
            <g>
              {(["A", "B", "C", "D"] as const).map((k, j) => (
                <text
                  key={k}
                  x={20}
                  y={[106, 94, 82, 52][j]}
                  style={{ fontSize: 10, fontWeight: 800, ...halo }}
                >
                  {k}
                </text>
              ))}
            </g>
          }
        />
      </svg>
    </Fig>
  );
}

/* ═════════════ Week 2：腕足類殼的應變 ═════════════ */

// 從作業圖量到的變形梯度（以樞紐線為 x 軸、對稱線為 y 軸）：
// 樞紐線 496 → 542 px（× 1.093）；對稱線 (0, 248) → (−235, 234)
const F = [
  [1.093, -0.948],
  [0, 0.944],
];
export function BrachiopodFig() {
  const [t, setT] = useState(1);
  const r = 90;
  const k = (m: number[][]) => [
    [1 + (m[0][0] - 1) * t, m[0][1] * t],
    [0, 1 + (m[1][1] - 1) * t],
  ];
  const M = k(F);
  const map = (x: number, y: number) => [
    M[0][0] * x + M[0][1] * y,
    M[1][1] * y,
  ];
  const arc = Array.from({ length: 61 }, (_, i) => {
    const a = rad(180 - i * 3);
    return map(r * Math.cos(a), r * Math.sin(a));
  });
  const ox0 = 120,
    ox1 = 400,
    oy = 150;
  const ang = deg(Math.atan2(M[1][1], M[0][1])); // 對稱線和樞紐線（往右）的夾角
  const psi = ang - 90;
  const e = M[0][0] - 1;
  const shell = (
    ox: number,
    pts: number[][],
    radial: number[][],
    c: string,
  ) => (
    <g>
      <path
        d={`M${pts.map(([x, y]) => `${ox + x},${oy - y}`).join("L")}Z`}
        fill={c}
        fillOpacity={0.12}
        stroke={INK}
        strokeWidth={1.6}
      />
      {radial.map(([x, y], j) => (
        <line
          key={j}
          x1={ox}
          y1={oy}
          x2={ox + x}
          y2={oy - y}
          stroke={j === 2 ? c : INK}
          strokeWidth={j === 2 ? 2.6 : 1}
        />
      ))}
    </g>
  );
  const rad0 = [150, 120, 90, 60, 30].map((a) => [
    r * Math.cos(rad(a)),
    r * Math.sin(rad(a)),
  ]);
  const rad1 = rad0.map(([x, y]) => map(x, y));
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：腕足類殼的變形（Week 2）</b>
        <span>數字是從作業圖量出來的；拉桿把變形從 0 加到 100%</span>
      </figcaption>
      <div className="ix-body">
        <svg
          viewBox="0 0 560 200"
          className="ix-svg"
          role="img"
          aria-label="腕足類殼變形前後"
        >
          {shell(
            ox0,
            Array.from({ length: 61 }, (_, i) => [
              r * Math.cos(rad(180 - i * 3)),
              r * Math.sin(rad(180 - i * 3)),
            ]),
            rad0,
            C.teal,
          )}
          {shell(ox1, arc, rad1, C.orange)}
          {/* 夾角弧線 */}
          <path
            d={`M${ox1 + 26},${oy} A26,26 0 0 0 ${ox1 + 26 * Math.cos(rad(ang))},${oy - 26 * Math.sin(rad(ang))}`}
            fill="none"
            stroke={C.orange}
            strokeWidth={1.5}
          />
          <text
            x={ox1 + 30}
            y={oy - 26}
            style={{ fontSize: 11, fontWeight: 800, fill: C.orange, ...halo }}
          >
            {ang.toFixed(0)}°
          </text>
          <text
            x={ox0}
            y={oy + 22}
            textAnchor="middle"
            style={{ fontSize: 12, fontWeight: 800 }}
          >
            (a) 變形前：樞紐線 ⊥ 對稱線
          </text>
          <text
            x={ox1}
            y={oy + 22}
            textAnchor="middle"
            style={{ fontSize: 12, fontWeight: 800 }}
          >
            (b) 變形後
          </text>
          <text
            x={ox0}
            y={oy + 40}
            textAnchor="middle"
            style={{ fontSize: 11, opacity: 0.7 }}
          >
            粗線 = 對稱線
          </text>
        </svg>
        <div className="ix-panel">
          <div className="ix-row">
            <label>
              <span>變形進度</span>
              <span>{Math.round(t * 100)}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={t}
              onChange={(ev) => setT(+ev.target.value)}
            />
          </div>
          <div className="ix-readout">
            樞紐線伸長率 e = <b>{e.toFixed(2)}</b>
            <br />
            對稱線和樞紐線夾 <b>{ang.toFixed(0)}°</b>（原本 90°）
            <br />
            角剪動 ψ = <b>{Math.abs(psi).toFixed(0)}°</b>，γ = tan ψ ={" "}
            <b>{Math.tan(rad(Math.abs(psi))).toFixed(2)}</b>
          </div>
          <div className="ix-note">
            樞紐線上每一點原本都在同一條直線上，變形後還是直線、只是變長，所以可以直接量
            e。對稱線原本和樞紐線垂直，變形後往左倒，偏離 90° 的量就是角剪動 ψ。
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ═════════════ Week 6：克里特島正斷層的古應力 ═════════════ */

// Angelier (1979) 的 10 條正斷層（RHR 走向／傾角、從走向量起的 rake）
const CRETE: [number, number, number][] = [
  [45, 61, 80],
  [36, 59, 100],
  [270, 80, 58],
  [232, 68, 78],
  [225, 63, 78],
  [290, 88, 59],
  [254, 78, 65],
  [46, 60, 100],
  [257, 61, 94],
  [67, 56, 88],
];
// 網格搜尋反演的結果（Wallace–Bott，最小化預測滑動方向和擦痕的夾角；見筆記）
const AXES = [
  { k: "σ1", t: 222, p: 82, c: C.rose },
  { k: "σ2", t: 42, p: 8, c: C.gold },
  { k: "σ3", t: 312, p: 0, c: C.teal },
];
const MISFIT = [16, 0, 4, 0, 4, 0, 0, 4, 21, 0];

type V3 = [number, number, number];
const lv = (t: number, p: number): V3 => [
  Math.cos(rad(p)) * Math.sin(rad(t)),
  Math.cos(rad(p)) * Math.cos(rad(t)),
  -Math.sin(rad(p)),
];
const tpOf = (v: V3) => {
  let [x, y, z] = v;
  if (z > 0) [x, y, z] = [-x, -y, -z];
  return {
    t: (deg(Math.atan2(x, y)) + 360) % 360,
    p: deg(Math.asin(Math.min(1, -z))),
  };
};

export function CreteNetFig() {
  const [sel, setSel] = useState<number | null>(null);
  const R = 130,
    cx = 150,
    cy = 150;
  // 等面積（Schmidt）下半球
  const proj = (t: number, p: number) => {
    const r = R * Math.SQRT2 * Math.sin(rad((90 - p) / 2));
    return [cx + r * Math.sin(rad(t)), cy - r * Math.cos(rad(t))];
  };
  const faults = CRETE.map(([st, dp, rk], i) => {
    const s = lv(st, 0);
    const d = lv(st + 90, dp);
    const gc = Array.from({ length: 91 }, (_, j) => {
      const a = rad(j * 2);
      const v: V3 = [
        Math.cos(a) * s[0] + Math.sin(a) * d[0],
        Math.cos(a) * s[1] + Math.sin(a) * d[1],
        Math.cos(a) * s[2] + Math.sin(a) * d[2],
      ];
      const q = tpOf(v);
      return proj(q.t, q.p).join(",");
    }).join(" ");
    const l: V3 = [0, 1, 2].map(
      (j) => Math.cos(rad(rk)) * s[j] + Math.sin(rad(rk)) * d[j],
    ) as V3;
    const q = tpOf(l);
    const [lx, ly] = proj(q.t, q.p);
    // 正斷層：上盤往下滑，擦痕點上的箭頭指向圓外（往趨向方向）
    const ux = Math.sin(rad(q.t)),
      uy = -Math.cos(rad(q.t));
    return { i, gc, lx, ly, ux, uy, st, dp, rk, q };
  });
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>互動：克里特島 10 條正斷層（Week 6）</b>
        <span>等面積、下半球；點右邊的斷層看它的大圓和誤差</span>
      </figcaption>
      <div className="ix-body">
        <svg
          viewBox="0 0 300 318"
          className="ix-svg"
          role="img"
          aria-label="克里特島正斷層的等面積投影與主應力軸"
        >
          <Marks />
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={INK}
            strokeWidth={2}
          />
          {[
            ["N", 0],
            ["E", 90],
            ["S", 180],
            ["W", 270],
          ].map(([t, a]) => (
            <text
              key={t as string}
              x={cx + (R + 12) * Math.sin(rad(a as number))}
              y={cy - (R + 12) * Math.cos(rad(a as number)) + 4}
              textAnchor="middle"
              style={{ fontSize: 12, fontWeight: 800 }}
            >
              {t}
            </text>
          ))}
          <line x1={cx - 4} x2={cx + 4} y1={cy} y2={cy} stroke={INK} />
          <line x1={cx} x2={cx} y1={cy - 4} y2={cy + 4} stroke={INK} />
          {faults.map((f) => {
            const on = sel === null || sel === f.i;
            return (
              <g
                key={f.i}
                opacity={on ? 1 : 0.18}
                style={{ cursor: "pointer" }}
                onClick={() => setSel(sel === f.i ? null : f.i)}
              >
                <polyline
                  points={f.gc}
                  fill="none"
                  stroke={sel === f.i ? C.orange : INK}
                  strokeWidth={sel === f.i ? 2.4 : 1}
                />
                <circle cx={f.lx} cy={f.ly} r={3} fill={C.orange} />
                <line
                  x1={f.lx}
                  y1={f.ly}
                  x2={f.lx + f.ux * 14}
                  y2={f.ly + f.uy * 14}
                  stroke={C.orange}
                  strokeWidth={1.6}
                  markerEnd="url(#hw-o)"
                />
              </g>
            );
          })}
          {AXES.map((a) => {
            const [x, y] = proj(a.t, a.p);
            return (
              <g key={a.k}>
                <rect
                  x={x - 6}
                  y={y - 6}
                  width={12}
                  height={12}
                  fill="hsl(var(--card))"
                  stroke={a.c}
                  strokeWidth={2.4}
                  transform={`rotate(45 ${x} ${y})`}
                />
                <text
                  x={x + 9}
                  y={y - 7}
                  style={{ fontSize: 12, fontWeight: 800, fill: a.c, ...halo }}
                >
                  {a.k}
                </text>
              </g>
            );
          })}
          <text x={cx} y={306} textAnchor="middle" style={{ fontSize: 11 }}>
            細線 = 斷層面；橘點 = 擦痕，箭頭 = 上盤滑動方向
          </text>
        </svg>
        <div className="ix-panel">
          <div className="ix-readout">
            σ1 <b>222°/82°</b>（幾乎垂直）
            <br />
            σ2 <b>042°/08°</b>（東北–西南、水平）
            <br />
            σ3 <b>312°/00°</b>（西北–東南、水平）
            <br />Φ = (σ2 − σ3)/(σ1 − σ3) ≈ <b>0.2</b>；平均誤差 <b>5°</b>
          </div>
          <div className="ix-btns">
            {CRETE.map(([st, dp, rk], i) => (
              <button
                key={i}
                type="button"
                className="ix-btn"
                aria-pressed={sel === i}
                style={{ fontSize: "0.75rem", padding: "0.15rem 0.45rem" }}
                onClick={() => setSel(sel === i ? null : i)}
                title={`誤差 ${MISFIT[i]}°`}
              >
                {i + 1}. {String(st).padStart(3, "0")}/{dp}・{rk}
                {MISFIT[i] >= 15 ? " ⚠" : ""}
              </button>
            ))}
          </div>
          {sel !== null ? (
            <div className="ix-verdict">
              第 {sel + 1} 條：擦痕 {faults[sel].q.p.toFixed(0)}° →{" "}
              {String(Math.round(faults[sel].q.t)).padStart(3, "0")}
              °，預測和實測滑動方向差 {MISFIT[sel]}°
            </div>
          ) : null}
          <div className="ix-note">
            擦痕幾乎都是沿傾斜方向往下（rake 接近
            90°），而且兩組斷層分別往西北、東南傾，像一對共軛正斷層。它們的交線就是
            σ2（東北–西南水平），σ1 垂直，σ3 水平、垂直於平均走向。第 1、9
            條的誤差比較大（16°、21°），可能是量測誤差，或屬於另一期變形。
          </div>
        </div>
      </div>
    </figure>
  );
}
