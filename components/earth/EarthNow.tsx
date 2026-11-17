"use client";

// 今日地球：監控台版面
// - 系統依重要度挑出「現在最該看的」幾件事，鏡頭（CAM）輪流巡邏、地圖準星跟著鎖定
// - 下面是所有來源依時間混在一起的事件紀錄（終端機），點任一筆就鎖定
// 資料與重要度算法在 feeds.ts；底圖 Natural Earth 110m、PB2002 板塊邊界（data/earth/，等距圓柱投影）
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import land from "@/data/earth/world-land.json";
import plates from "@/data/earth/plates.json";
import {
  DAY,
  LEVEL,
  TW,
  ago,
  depthColor,
  km,
  loadAlerts,
  loadNatural,
  loadQuakes,
  natOf,
  pad,
  quakeR,
  toEvents,
  tpe,
  type Alert,
  type Ev,
  type Natural,
  type Quake,
} from "./feeds";

const W = land.W;
const H = land.H;
const K = land.k;
const TOP = land.top;
const xy = (lng: number, lat: number) =>
  [(lng + 180) * K, (TOP - lat) * K] as const;

const REFRESH = 5 * 60 * 1000;
const PATROL = 8000; // 巡邏時每件看幾毫秒
const QUEUE = 6; // 巡邏佇列幾件
// 鏡頭範圍（地圖單位）：約經度 50°、緯度 37°
const CAM_W = 140;
const CAM_H = 105;

type Status = "loading" | "ok" | "error";
type Show = { eq: boolean; nat: boolean; alert: boolean; plates: boolean };

/* ---------------- 地圖符號 ---------------- */

function Shape({
  shape,
  x,
  y,
  s,
  c,
}: {
  shape: string;
  x: number;
  y: number;
  s: number;
  c: string;
}) {
  if (shape === "tri")
    return (
      <path
        d={`M${x},${y - s}L${x + s * 0.9},${y + s * 0.6}L${x - s * 0.9},${y + s * 0.6}Z`}
        fill={c}
      />
    );
  if (shape === "dia")
    return (
      <path
        d={`M${x},${y - s}L${x + s},${y}L${x},${y + s}L${x - s},${y}Z`}
        fill={c}
      />
    );
  if (shape === "sq")
    return (
      <rect
        x={x - s * 0.75}
        y={y - s * 0.75}
        width={s * 1.5}
        height={s * 1.5}
        fill={c}
      />
    );
  return <circle cx={x} cy={y} r={s * 0.8} fill={c} />;
}

// 四角對位記號（和收藏庫、首頁照片同一套語言）
function Corners({
  x,
  y,
  s,
  c,
  w = 1.4,
}: {
  x: number;
  y: number;
  s: number;
  c: string;
  w?: number;
}) {
  const l = s * 0.45;
  const d = [
    `M${x - s},${y - s + l}V${y - s}H${x - s + l}`,
    `M${x + s - l},${y - s}H${x + s}V${y - s + l}`,
    `M${x + s},${y + s - l}V${y + s}H${x + s - l}`,
    `M${x - s + l},${y + s}H${x - s}V${y + s - l}`,
  ].join("");
  return <path d={d} fill="none" stroke={c} strokeWidth={w} />;
}

/** 地圖內容；u 是符號大小倍率（鏡頭放大時要縮小，螢幕上看起來才一樣大） */
function Layers({
  quakes,
  nat,
  alerts,
  show,
  now,
  focus,
  onPick,
  u = 1,
  dots,
}: {
  quakes: Quake[];
  nat: Natural[];
  alerts: Alert[];
  show: Show;
  now: number;
  focus?: string;
  onPick: (key: string) => void;
  u?: number;
  dots: string;
}) {
  const [twx, twy] = xy(TW.lng, TW.lat);
  return (
    <>
      <g className="en-grat">
        {Array.from({ length: 13 }, (_, i) => -180 + i * 30).map((lng) => (
          <line
            key={`g${lng}`}
            x1={xy(lng, 0)[0]}
            x2={xy(lng, 0)[0]}
            y1={0}
            y2={H}
          />
        ))}
        {[60, 30, 0, -30].map((lat) => (
          <line
            key={`t${lat}`}
            x1={0}
            x2={W}
            y1={xy(0, lat)[1]}
            y2={xy(0, lat)[1]}
            className={lat === 0 ? "eq0" : ""}
          />
        ))}
      </g>
      <path d={land.d} fill={`url(#${dots})`} />
      <path d={land.d} className="en-coast" />
      {show.plates ? <path d={plates.d} className="en-plates" /> : null}

      <g className="en-tw" transform={`translate(${twx},${twy}) scale(${u})`}>
        <path d="M-7,0H-3M3,0H7M0,-7V-3M0,3V7" />
        <text x={9} y={-6}>
          TW
        </text>
      </g>

      {show.nat
        ? nat.map((n) => {
            const m = natOf(n.cat);
            const [x, y] = xy(n.lng, n.lat);
            const key = `nat:${n.id}`;
            const on = focus === key;
            return (
              <g
                key={key}
                className={`en-pt${on ? " on" : ""}`}
                onClick={() => onPick(key)}
              >
                {n.track.length > 1 ? (
                  <polyline
                    points={n.track
                      .map((p) => xy(p[0], p[1]).join(","))
                      .join(" ")}
                    className="en-track"
                    stroke={m.c}
                  />
                ) : null}
                <Shape
                  shape={m.shape}
                  x={x}
                  y={y}
                  s={(on ? 5 : 3.2) * u}
                  c={m.c}
                />
                <circle cx={x} cy={y} r={9 * u} className="en-hit" />
              </g>
            );
          })
        : null}

      {show.eq
        ? quakes
            .slice()
            .sort((a, b) => b.mag - a.mag)
            .map((q) => {
              const [x, y] = xy(q.lng, q.lat);
              const age = (now - q.time) / DAY;
              const key = `eq:${q.id}`;
              const on = focus === key;
              const r = quakeR(q.mag) * u;
              return (
                <g
                  key={key}
                  className={`en-pt${on ? " on" : ""}`}
                  onClick={() => onPick(key)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={depthColor(q.depth)}
                    fillOpacity={on ? 0.95 : Math.max(0.25, 0.85 - age * 0.09)}
                    className="en-q"
                  />
                  {age < 1 ? (
                    <circle
                      cx={x}
                      cy={y}
                      r={r + 2.5 * u}
                      className="en-ring"
                      stroke={depthColor(q.depth)}
                    />
                  ) : null}
                  {now - q.time < 3 * 3600000 ? (
                    <circle
                      cx={x}
                      cy={y}
                      r={r}
                      className="en-pulse"
                      stroke={depthColor(q.depth)}
                    />
                  ) : null}
                  <circle
                    cx={x}
                    cy={y}
                    r={Math.max(8 * u, r)}
                    className="en-hit"
                  />
                </g>
              );
            })
        : null}

      {show.alert
        ? alerts.map((a) => {
            const [x, y] = xy(a.lng, a.lat);
            const c = a.level === "Red" ? "var(--en-red)" : "var(--orange)";
            const key = `alert:${a.id}`;
            const on = focus === key;
            return (
              <g
                key={key}
                className={`en-pt${on ? " on" : ""}${a.current ? "" : " past"}`}
                onClick={() => onPick(key)}
              >
                <Corners x={x} y={y} s={(on ? 11 : 8) * u} c={c} w={1.4 * u} />
                <circle cx={x} cy={y} r={10 * u} className="en-hit" />
              </g>
            );
          })
        : null}
    </>
  );
}

/* ---------------- 主元件 ---------------- */

export default function EarthNow() {
  const [quakes, setQuakes] = useState<Quake[]>([]);
  const [nat, setNat] = useState<Natural[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [st, setSt] = useState<{ eq: Status; nat: Status; alert: Status }>({
    eq: "loading",
    nat: "loading",
    alert: "loading",
  });
  const [updated, setUpdated] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [show, setShow] = useState<Show>({
    eq: true,
    nat: true,
    alert: true,
    plates: true,
  });
  const [idx, setIdx] = useState(0); // 巡邏到第幾件
  const [manual, setManual] = useState<string | null>(null); // 使用者自己點的那件
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<"all" | "eq" | "nat" | "alert">("all");
  const scroller = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLElement>(null);

  const refresh = useCallback(async () => {
    const run = async <T,>(
      k: "eq" | "nat" | "alert",
      f: () => Promise<T>,
      set: (v: T) => void,
    ) => {
      try {
        set(await f());
        setSt((s) => ({ ...s, [k]: "ok" }));
      } catch {
        setSt((s) => ({ ...s, [k]: "error" }));
      }
    };
    await Promise.all([
      run("eq", loadQuakes, setQuakes),
      run("nat", loadNatural, setNat),
      run("alert", loadAlerts, setAlerts),
    ]);
    setUpdated(Date.now());
  }, []);

  useEffect(() => {
    setNow(Date.now());
    refresh();
    const a = setInterval(refresh, REFRESH);
    const b = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, [refresh]);

  // 重要度只在資料更新時重算（不跟著每秒的時鐘跑）
  const evs = useMemo(
    () => toEvents(quakes, nat, alerts, updated ?? 0),
    [quakes, nat, alerts, updated],
  );
  const byKey = useMemo(() => new Map(evs.map((e) => [e.key, e])), [evs]);
  const queue = useMemo(
    () =>
      evs
        .filter((e) => !e.past)
        .sort((a, b) => b.score - a.score)
        .slice(0, QUEUE),
    [evs],
  );

  // 巡邏：每 PATROL 毫秒換下一件；使用者點了別的、或按暫停就停
  useEffect(() => {
    if (paused || manual || queue.length < 2) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % queue.length), PATROL);
    return () => clearTimeout(t);
  }, [idx, paused, manual, queue.length]);

  const focus: Ev | undefined =
    (manual && byKey.get(manual)) || queue[idx % Math.max(1, queue.length)];
  const queuePos = focus ? queue.findIndex((e) => e.key === focus.key) : -1;

  // 手機上地圖可以左右滑：鏡頭換到哪，地圖就捲到哪
  useEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const lng = focus?.lng ?? TW.lng;
    el.scrollTo({
      left: ((lng + 180) / 360) * el.scrollWidth - el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [focus?.key, focus?.lng]);

  const pick = (key: string) => {
    setManual((m) => (m === key ? null : key));
  };
  const pickAndScroll = (key: string) => {
    setManual(key);
    consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const resume = () => {
    setManual(null);
    setPaused(false);
  };

  const day = quakes.filter((q) => now - q.time < DAY);
  const biggest = quakes.reduce<Quake | undefined>(
    (b, q) => (!b || q.mag > b.mag ? q : b),
    undefined,
  );
  const nearTW = quakes.reduce<{ q: Quake; d: number } | undefined>((b, q) => {
    const d = km(q, TW);
    return !b || d < b.d ? { q, d } : b;
  }, undefined);
  const liveAlerts = alerts.filter((a) => a.current);
  const nOk = Object.values(st).filter((s) => s === "ok").length;

  const log = useMemo(
    () =>
      evs
        .filter((e) => filter === "all" || e.kind === filter)
        .sort((a, b) => b.time - a.time)
        .slice(0, 60),
    [evs, filter],
  );

  const utc = new Date(now);
  const clock = now
    ? `${pad(utc.getUTCHours())}:${pad(utc.getUTCMinutes())}:${pad(utc.getUTCSeconds())}`
    : "--:--:--";
  const left = updated && now ? Math.max(0, updated + REFRESH - now) : 0;
  const countdown = `${pad(Math.floor(left / 60000))}:${pad(Math.floor((left % 60000) / 1000))}`;

  // 鏡頭視窗
  const [fx, fy] = focus ? xy(focus.lng, focus.lat) : xy(TW.lng, TW.lat);
  const cx = Math.min(W - CAM_W, Math.max(0, fx - CAM_W / 2));
  const cy = Math.min(H - CAM_H, Math.max(0, fy - CAM_H / 2));
  const lvl = focus ? LEVEL[focus.level] : LEVEL[0];
  const camNo = queuePos >= 0 ? queuePos + 1 : 0;

  const feeds = [
    { k: "USGS", s: st.eq, n: quakes.length },
    { k: "EONET", s: st.nat, n: nat.length },
    { k: "GDACS", s: st.alert, n: alerts.length },
  ];

  return (
    <div className="en">
      <section className="en-console" ref={consoleRef}>
        {/* ---- 頂部狀態列 ---- */}
        <div className="en-hud font-mono-label">
          <span className="live">
            <i aria-hidden="true" /> LIVE
          </span>
          <span>UTC {clock}</span>
          <span>TPE {now ? tpe(now, false) : "--:--"}</span>
          <span className="feeds">
            {feeds.map((f) => (
              <span
                key={f.k}
                className={`feed ${f.s}`}
                title={f.s === "error" ? "暫時抓不到，5 分鐘後再試" : undefined}
              >
                <i aria-hidden="true" />
                {f.k}
                <em>{f.s === "ok" ? f.n : f.s === "loading" ? "…" : "ERR"}</em>
              </span>
            ))}
          </span>
          <span className="dim">
            {updated ? `下次更新 ${countdown}` : "連線中⋯⋯"}
          </span>
        </div>

        <div className="en-grid">
          {/* ---- 主螢幕：世界地圖 ---- */}
          <div className="en-main">
            <div className="en-frame">
              <span className="en-lbl tl font-mono-label">MAIN // WORLD</span>
              <span className="en-lbl br font-mono-label">
                {nOk}/3 FEEDS ONLINE
              </span>
              <div className="en-scroll" ref={scroller}>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  role="img"
                  aria-label="世界地圖：近期地震、自然事件與災害警報位置"
                >
                  <defs>
                    <pattern
                      id="en-dots"
                      width="4"
                      height="4"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="2" cy="2" r="0.9" className="en-dot" />
                    </pattern>
                  </defs>
                  <Layers
                    quakes={quakes}
                    nat={nat}
                    alerts={alerts}
                    show={show}
                    now={now}
                    focus={focus?.key}
                    onPick={pick}
                    dots="en-dots"
                  />
                  {/* 準星：十字線跟著鏡頭走，外框是鏡頭拍到的範圍 */}
                  {focus ? (
                    <g
                      className="en-aim"
                      style={{ transform: `translate(${fx}px, ${fy}px)` }}
                    >
                      <line x1={-W * 2} x2={-16} y1={0} y2={0} />
                      <line x1={16} x2={W * 2} y1={0} y2={0} />
                      <line x1={0} x2={0} y1={-H * 2} y2={-16} />
                      <line x1={0} x2={0} y1={16} y2={H * 2} />
                      <Corners x={0} y={0} s={12} c={lvl.c} w={1.6} />
                      <text x={16} y={-14} fill={lvl.c}>
                        {camNo ? `TGT-${pad(camNo)}` : "TGT-USR"} {lvl.en}
                      </text>
                    </g>
                  ) : null}
                  {focus ? (
                    <rect
                      x={cx}
                      y={cy}
                      width={CAM_W}
                      height={CAM_H}
                      className="en-camrect"
                    />
                  ) : null}
                </svg>
              </div>
              <span className="en-scan" aria-hidden="true" />
            </div>
            <p className="en-swipe font-mono-label">← 地圖可以左右滑 →</p>

            {/* 圖例兼開關 */}
            <div className="en-legend font-mono-label">
              <button
                type="button"
                aria-pressed={show.eq}
                onClick={() => setShow((s) => ({ ...s, eq: !s.eq }))}
              >
                <i
                  className="sw"
                  style={{ background: "var(--orange)", borderRadius: "50%" }}
                />
                地震 <em>淺</em>
                <i
                  className="sw"
                  style={{ background: "var(--gold)", borderRadius: "50%" }}
                />
                <em>中</em>
                <i
                  className="sw"
                  style={{ background: "var(--teal)", borderRadius: "50%" }}
                />
                <em>深</em>
              </button>
              <button
                type="button"
                aria-pressed={show.nat}
                onClick={() => setShow((s) => ({ ...s, nat: !s.nat }))}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="-6 -6 12 12"
                  aria-hidden="true"
                >
                  <Shape shape="tri" x={0} y={1} s={5} c="var(--orange)" />
                </svg>
                自然事件
              </button>
              <button
                type="button"
                aria-pressed={show.alert}
                onClick={() => setShow((s) => ({ ...s, alert: !s.alert }))}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="-7 -7 14 14"
                  aria-hidden="true"
                >
                  <Corners x={0} y={0} s={6} c="var(--en-red)" />
                </svg>
                災害警報
              </button>
              <button
                type="button"
                aria-pressed={show.plates}
                onClick={() => setShow((s) => ({ ...s, plates: !s.plates }))}
              >
                <i className="sw line" />
                板塊邊界
              </button>
            </div>

            {/* 數字列 */}
            <div className="en-stats">
              <div style={{ ["--c" as string]: "var(--orange)" }}>
                <span className="k font-mono-label">24H 地震 M4.5+</span>
                <span className="v">{st.eq === "ok" ? day.length : "—"}</span>
              </div>
              <div style={{ ["--c" as string]: "var(--gold)" }}>
                <span className="k font-mono-label">本週最大</span>
                <span className="v">
                  {biggest ? `M${biggest.mag.toFixed(1)}` : "—"}
                </span>
              </div>
              <div style={{ ["--c" as string]: "var(--teal)" }}>
                <span className="k font-mono-label">進行中自然事件</span>
                <span className="v">{st.nat === "ok" ? nat.length : "—"}</span>
              </div>
              <div style={{ ["--c" as string]: "var(--en-red)" }}>
                <span className="k font-mono-label">進行中警報</span>
                <span className="v">
                  {st.alert === "ok" ? liveAlerts.length : "—"}
                </span>
              </div>
              {nearTW ? (
                <button
                  type="button"
                  style={{ ["--c" as string]: "var(--sky)" }}
                  onClick={() => pick(`eq:${nearTW.q.id}`)}
                >
                  <span className="k font-mono-label">離台灣最近</span>
                  <span className="v">
                    M{nearTW.q.mag.toFixed(1)}
                    <small>
                      {Math.round(nearTW.d).toLocaleString("zh-TW")} km
                    </small>
                  </span>
                </button>
              ) : null}
            </div>
            {/* ---- 事件紀錄 ---- */}
            <section className="en-log">
              <div className="en-loghead">
                <h2>
                  <span className="no font-mono-label">LOG</span>事件紀錄
                </h2>
                <div className="tabs font-mono-label" role="tablist">
                  {(
                    [
                      ["all", "全部"],
                      ["eq", "地震"],
                      ["nat", "自然事件"],
                      ["alert", "災害警報"],
                    ] as const
                  ).map(([k, zh]) => (
                    <button
                      key={k}
                      type="button"
                      role="tab"
                      aria-selected={filter === k}
                      onClick={() => setFilter(k)}
                    >
                      {zh}
                    </button>
                  ))}
                </div>
              </div>
              <ol className="en-term font-mono-label">
                {log.length ? (
                  log.map((e) => (
                    <li key={e.key}>
                      <button
                        type="button"
                        className={`${focus?.key === e.key ? "on" : ""}${e.past ? " past" : ""}`}
                        style={{
                          ["--c" as string]: e.color,
                          ["--l" as string]: LEVEL[e.level].c,
                        }}
                        onClick={() => pickAndScroll(e.key)}
                      >
                        <span className="ts">[{tpe(e.time)}]</span>
                        <span className="lvl">
                          {LEVEL[e.level].en.padEnd(8, " ")}
                        </span>
                        <span className="tag">{e.tag}</span>
                        <span className="msg">{e.title}</span>
                        {updated &&
                        updated - e.time < REFRESH * 2 &&
                        e.time <= updated ? (
                          <span className="new">NEW</span>
                        ) : null}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="empty">
                    &gt; {nOk ? "沒有符合的事件" : "loading⋯"}_
                  </li>
                )}
              </ol>
            </section>
          </div>

          {/* ---- 右側：鏡頭＋重點 ---- */}
          <aside className="en-side" style={{ ["--c" as string]: lvl.c }}>
            <div className="en-cam">
              <span className="en-lbl tl font-mono-label">
                <i className="rec" aria-hidden="true" />
                CAM-{camNo ? pad(camNo) : "USR"}
              </span>
              <span className="en-lbl tr font-mono-label">
                {focus
                  ? `${focus.lat.toFixed(1)}°${focus.lat >= 0 ? "N" : "S"} ${Math.abs(focus.lng).toFixed(1)}°${focus.lng >= 0 ? "E" : "W"}`
                  : ""}
              </span>
              <span className="en-lbl br font-mono-label">
                ZOOM ×{(W / CAM_W).toFixed(0)}
              </span>
              <svg
                key={focus?.key ?? "none"}
                viewBox={`${cx} ${cy} ${CAM_W} ${CAM_H}`}
                className="en-camsvg"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="en-dots-cam"
                    width="1.2"
                    height="1.2"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="0.6" cy="0.6" r="0.28" className="en-dot" />
                  </pattern>
                </defs>
                <Layers
                  quakes={quakes}
                  nat={nat}
                  alerts={alerts}
                  show={show}
                  now={now}
                  focus={focus?.key}
                  onPick={pick}
                  u={0.32}
                  dots="en-dots-cam"
                />
                {focus ? (
                  <g transform={`translate(${fx},${fy})`} className="en-camaim">
                    <path d="M-9,0H-3M3,0H9M0,-9V-3M0,3V9" />
                    <circle r={6} />
                  </g>
                ) : null}
              </svg>
              <span className="en-noise" aria-hidden="true" />
              <span className="en-scan" aria-hidden="true" />
              {!focus ? (
                <p className="en-camwait font-mono-label">
                  NO SIGNAL — 等資料進來⋯⋯
                </p>
              ) : null}
            </div>

            {focus ? (
              <div className="en-focus" key={focus.key}>
                <p className="font-mono-label head">
                  <b className="lv">{lvl.zh}</b>
                  <span>{lvl.en}</span>
                  <span className="dim">
                    {focus.tag}・{ago(focus.time, now || focus.time)}
                  </span>
                </p>
                <h3>{focus.title}</h3>
                <p className="why">
                  <span className="font-mono-label">&gt; 為什麼要看：</span>
                  {focus.why}
                </p>
                <dl>
                  {focus.rows.map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-mono-label">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                {focus.url ? (
                  <a
                    href={focus.url}
                    rel="noreferrer"
                    target="_blank"
                    className="font-mono-label more"
                  >
                    → 原始資料
                  </a>
                ) : null}
              </div>
            ) : null}

            {/* 巡邏佇列 */}
            <div className="en-queue">
              <p className="font-mono-label head">
                <span>
                  {manual ? "手動鎖定" : paused ? "巡邏暫停" : "自動巡邏"}・重點{" "}
                  {queue.length} 件
                </span>
                {manual || paused ? (
                  <button type="button" onClick={resume}>
                    ▶ 恢復巡邏
                  </button>
                ) : (
                  <button type="button" onClick={() => setPaused(true)}>
                    ❚❚ 暫停
                  </button>
                )}
              </p>
              {!manual && !paused && queue.length > 1 ? (
                <span
                  className="en-prog"
                  key={`${idx}-${focus?.key}`}
                  aria-hidden="true"
                />
              ) : null}
              <ol>
                {queue.map((e, i) => (
                  <li key={e.key}>
                    <button
                      type="button"
                      className={focus?.key === e.key ? "on" : ""}
                      style={{ ["--c" as string]: LEVEL[e.level].c }}
                      onClick={() => {
                        setManual(null);
                        setIdx(i);
                        setPaused(true);
                      }}
                    >
                      <span className="n font-mono-label">{pad(i + 1)}</span>
                      <i className="dot" aria-hidden="true" />
                      <span className="t">{e.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <p className="en-src font-mono-label">
        資料來源：
        <a
          href="https://earthquake.usgs.gov/earthquakes/feed/"
          rel="noreferrer"
        >
          USGS 即時地震
        </a>
        ・
        <a href="https://eonet.gsfc.nasa.gov/" rel="noreferrer">
          NASA EONET
        </a>
        ・
        <a href="https://www.gdacs.org/" rel="noreferrer">
          GDACS
        </a>
        ；底圖 Natural Earth、板塊邊界 PB2002（Bird
        2003）。重點排序是這個網站自己的算法（規模、警報等級、離台灣遠近），不是官方分級。時間一律為台北時間。台灣附近的地震以
        <a href="https://scweb.cwa.gov.tw/" rel="noreferrer">
          中央氣象署
        </a>
        為準。
      </p>
    </div>
  );
}
