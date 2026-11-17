"use client";

// 今日地球：瀏覽器直接抓三個免授權碼的公開資料（都允許跨網域），每 5 分鐘更新一次
// - USGS：過去 7 天 M4.5 以上地震
// - NASA EONET：進行中的自然事件（野火、風暴、火山、海冰…）
// - GDACS：聯合國／歐盟的全球災害警報（只取橘色、紅色；種類清單加 TS 會整個回 204）
// 底圖：Natural Earth 110m 陸地、PB2002 板塊邊界（data/earth/，等距圓柱投影，經度 −180–180、緯度 84–−58）
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import land from "@/data/earth/world-land.json";
import plates from "@/data/earth/plates.json";

const W = land.W;
const H = land.H;
const K = land.k;
const TOP = land.top;
const xy = (lng: number, lat: number) =>
  [(lng + 180) * K, (TOP - lat) * K] as const;

const TW = { lat: 23.7, lng: 121 };
const REFRESH = 5 * 60 * 1000;
const DAY = 86400000;

type Quake = {
  id: string;
  mag: number;
  place: string;
  time: number;
  depth: number;
  lng: number;
  lat: number;
  url: string;
  tsunami: boolean;
  alert: string | null;
};
type Natural = {
  id: string;
  title: string;
  cat: string;
  date: number;
  lng: number;
  lat: number;
  track: [number, number][];
  mag?: string;
  url?: string;
};
type Alert = {
  id: string;
  type: string;
  level: "Red" | "Orange";
  name: string;
  country: string;
  from: number;
  to: number;
  current: boolean;
  lng: number;
  lat: number;
  severity?: string;
  url?: string;
};
type Sel = { kind: "eq" | "nat" | "alert"; id: string } | null;
type Status = "loading" | "ok" | "error";

// EONET 分類
const NAT: Record<
  string,
  { zh: string; c: string; shape: "tri" | "dia" | "cir" | "sq" }
> = {
  wildfires: { zh: "野火", c: "var(--orange)", shape: "tri" },
  severeStorms: { zh: "強烈風暴", c: "var(--teal)", shape: "dia" },
  volcanoes: { zh: "火山", c: "var(--rose)", shape: "tri" },
  seaLakeIce: { zh: "海冰與湖冰", c: "var(--sky)", shape: "cir" },
  floods: { zh: "洪水", c: "var(--sky)", shape: "sq" },
  landslides: { zh: "山崩", c: "var(--gold)", shape: "sq" },
  drought: { zh: "乾旱", c: "var(--gold)", shape: "sq" },
  dustHaze: { zh: "沙塵與霾", c: "var(--gold)", shape: "cir" },
  snow: { zh: "雪", c: "var(--cream)", shape: "cir" },
  tempExtremes: { zh: "極端溫度", c: "var(--rose)", shape: "sq" },
  waterColor: { zh: "水色異常", c: "var(--teal)", shape: "cir" },
  earthquakes: { zh: "地震", c: "var(--orange)", shape: "cir" },
  manmade: { zh: "人為事件", c: "var(--plum)", shape: "sq" },
};
const natOf = (c: string) =>
  NAT[c] ?? { zh: c, c: "var(--cream)", shape: "cir" as const };

// GDACS 事件種類
const GD: Record<string, string> = {
  EQ: "地震",
  TC: "熱帶氣旋",
  FL: "洪水",
  VO: "火山",
  DR: "乾旱",
  WF: "野火",
  TS: "海嘯",
};

// 震源深度：淺（<70 km）橘、中（70–300）金、深（>300）青綠
const depthColor = (d: number) =>
  d < 70 ? "var(--orange)" : d < 300 ? "var(--gold)" : "var(--teal)";
const quakeR = (m: number) => Math.max(1.6, 1.25 * Math.pow(1.75, m - 4.5));

const pad = (n: number) => String(n).padStart(2, "0");
// 一律顯示台北時間（UTC+8），不管讀者在哪
function tpe(t: number, withDate = true) {
  const d = new Date(t + 8 * 3600000);
  const hm = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  return withDate
    ? `${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())} ${hm}`
    : hm;
}
function ago(t: number, now: number) {
  const m = Math.max(0, Math.round((now - t) / 60000));
  if (m < 60) return `${m} 分鐘前`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} 小時前`;
  return `${Math.round(h / 24)} 天前`;
}
function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = Math.PI / 180;
  const s =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) *
      Math.cos(b.lat * r) *
      Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(s));
}

/* ---------------- 抓資料 ---------------- */

async function getJSON(url: string) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(String(r.status));
  // GDACS 查不到東西時回 204、沒有內容
  if (r.status === 204) return {};
  return r.json();
}

async function loadQuakes(): Promise<Quake[]> {
  const d = await getJSON(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson",
  );
  return (d.features as any[])
    .filter((f) => f.geometry?.coordinates && f.properties?.mag != null)
    .map((f) => ({
      id: f.id,
      mag: f.properties.mag,
      place: f.properties.place ?? "",
      time: f.properties.time,
      depth: f.geometry.coordinates[2] ?? 0,
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
      url: f.properties.url,
      tsunami: f.properties.tsunami === 1,
      alert: f.properties.alert ?? null,
    }));
}

// EONET 的位置可能是點或多邊形；多邊形取第一圈的平均
function pt(g: any): [number, number] | null {
  if (g.type === "Point") return [g.coordinates[0], g.coordinates[1]];
  if (g.type === "Polygon" && g.coordinates?.[0]?.length) {
    const r = g.coordinates[0] as [number, number][];
    return [
      r.reduce((s, p) => s + p[0], 0) / r.length,
      r.reduce((s, p) => s + p[1], 0) / r.length,
    ];
  }
  return null;
}

async function loadNatural(): Promise<Natural[]> {
  const d = await getJSON(
    "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30",
  );
  const out: Natural[] = [];
  for (const e of d.events as any[]) {
    const gs = (e.geometry as any[])
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date));
    const track = gs.map(pt).filter(Boolean) as [number, number][];
    const last = gs[gs.length - 1];
    if (!track.length || !last) continue;
    const [lng, lat] = track[track.length - 1];
    out.push({
      id: e.id,
      title: e.title,
      cat: e.categories?.[0]?.id ?? "",
      date: Date.parse(last.date),
      lng,
      lat,
      track,
      mag:
        last.magnitudeValue != null
          ? `${last.magnitudeValue} ${last.magnitudeUnit ?? ""}`.trim()
          : undefined,
      url: e.sources?.[0]?.url,
    });
  }
  return out.sort((a, b) => b.date - a.date);
}

function short(list: string) {
  const cs = list
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  return (
    cs.slice(0, 3).join(", ") + (cs.length > 3 ? ` 等 ${cs.length} 國` : "")
  );
}

async function loadAlerts(): Promise<Alert[]> {
  const day = (t: number) => new Date(t).toISOString().slice(0, 10);
  const now = Date.now();
  const d = await getJSON(
    "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=EQ;TC;FL;VO;DR;WF" +
      `&alertlevel=Orange;Red&fromdate=${day(now - 30 * DAY)}&todate=${day(now + DAY)}`,
  );
  return ((d.features ?? []) as any[])
    .map((f) => {
      const p = f.properties;
      // GDACS 的時間沒有時區，實際是 UTC
      const t = (s: string) =>
        Date.parse(/Z|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);
      return {
        id: `${p.eventtype}-${p.eventid}`,
        type: p.eventtype,
        level: p.alertlevel,
        // 颱風、火山用名字；其他（地震、洪水、乾旱、野火）用國家，太多國只列前三個
        name:
          ["TC", "VO"].includes(p.eventtype) && p.eventname
            ? p.eventname
            : short(p.country ?? p.name),
        country: (p.country ?? "")
          .split(",")
          .map((c: string) => c.trim())
          .filter(Boolean)
          .join(", "),
        from: t(p.fromdate),
        to: t(p.todate),
        current: p.iscurrent === "true",
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
        severity: p.severitydata?.severitytext,
        url: p.url?.report,
      } as Alert;
    })
    .filter((a) => a.level === "Red" || a.level === "Orange")
    .sort(
      (a, b) =>
        Number(b.current) - Number(a.current) ||
        (a.level === b.level ? b.to - a.to : a.level === "Red" ? -1 : 1),
    );
}

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

// 四角對位記號（和收藏庫、首頁照片同一套語言），用來框警報
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
  const [sel, setSel] = useState<Sel>(null);
  const [show, setShow] = useState({
    eq: true,
    nat: true,
    alert: true,
    plates: true,
  });
  const scroller = useRef<HTMLDivElement>(null);

  // 手機上地圖可以左右滑，一開始把台灣放中間
  useEffect(() => {
    const el = scroller.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    el.scrollLeft =
      ((TW.lng + 180) / 360) * el.scrollWidth - el.clientWidth / 2;
  }, []);

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

  const day = useMemo(
    () => quakes.filter((q) => now - q.time < DAY),
    [quakes, now],
  );
  const biggest = useMemo(
    () => quakes.slice().sort((a, b) => b.mag - a.mag)[0],
    [quakes],
  );
  const nearTW = useMemo(
    () => quakes.map((q) => ({ q, d: km(q, TW) })).sort((a, b) => a.d - b.d)[0],
    [quakes],
  );
  const liveAlerts = alerts.filter((a) => a.current);
  const quakeList = useMemo(
    () =>
      day
        .slice()
        .sort((a, b) => b.mag - a.mag)
        .slice(0, 10),
    [day],
  );
  const natGroups = useMemo(() => {
    const g = new Map<string, Natural[]>();
    for (const n of nat) g.set(n.cat, [...(g.get(n.cat) ?? []), n]);
    return [...g.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [nat]);

  const selected = useMemo(() => {
    if (!sel) return null;
    if (sel.kind === "eq") {
      const q = quakes.find((x) => x.id === sel.id);
      return q && { kind: "eq" as const, v: q };
    }
    if (sel.kind === "nat") {
      const n = nat.find((x) => x.id === sel.id);
      return n && { kind: "nat" as const, v: n };
    }
    const a = alerts.find((x) => x.id === sel.id);
    return a && { kind: "alert" as const, v: a };
  }, [sel, quakes, nat, alerts]);

  const pick = (s: Sel) =>
    setSel((o) => (o && s && o.kind === s.kind && o.id === s.id ? null : s));
  // 從下面清單點的：選好後捲回地圖，才看得到詳細資料和位置
  const mapRef = useRef<HTMLElement>(null);
  const pickFromList = (s: Sel) => {
    pick(s);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const isSel = (kind: string, id: string) =>
    sel?.kind === kind && sel.id === id;

  const utc = new Date(now);
  const clock = now
    ? `${pad(utc.getUTCHours())}:${pad(utc.getUTCMinutes())}:${pad(utc.getUTCSeconds())}`
    : "--:--:--";
  const [twx, twy] = xy(TW.lng, TW.lat);

  return (
    <div className="en">
      {/* ---- 數字列 ---- */}
      <section className="en-big">
        <div style={{ ["--c" as string]: "var(--orange)" }}>
          <span className="k">24 小時內 M4.5+ 地震</span>
          <span className="v">{st.eq === "ok" ? day.length : "—"}</span>
          <span className="u">次</span>
        </div>
        <div style={{ ["--c" as string]: "var(--gold)" }}>
          <span className="k">本週最大</span>
          <span className="v">{biggest ? biggest.mag.toFixed(1) : "—"}</span>
          <span className="u">{biggest ? "規模" : ""}</span>
        </div>
        <div style={{ ["--c" as string]: "var(--teal)" }}>
          <span className="k">進行中的自然事件</span>
          <span className="v">{st.nat === "ok" ? nat.length : "—"}</span>
          <span className="u">件</span>
        </div>
        <div style={{ ["--c" as string]: "var(--rose)" }}>
          <span className="k">橘／紅色災害警報</span>
          <span className="v">
            {st.alert === "ok" ? liveAlerts.length : "—"}
          </span>
          <span className="u">件進行中</span>
        </div>
      </section>

      {/* ---- 地圖 ---- */}
      <section className="en-map" ref={mapRef}>
        <div className="en-bar font-mono-label">
          <span className="live">
            <i aria-hidden="true" /> LIVE
          </span>
          <span>UTC {clock}</span>
          <span>台北 {now ? tpe(now, false) : "--:--"}</span>
          <span className="dim">
            {updated
              ? `上次更新 ${tpe(updated, false)}・每 5 分鐘自動更新`
              : "抓資料中⋯⋯"}
          </span>
        </div>

        <div className="en-frame">
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
              {/* 經緯線每 30° */}
              <g className="en-grat">
                {Array.from({ length: 13 }, (_, i) => -180 + i * 30).map(
                  (lng) => (
                    <line
                      key={`g${lng}`}
                      x1={xy(lng, 0)[0]}
                      x2={xy(lng, 0)[0]}
                      y1={0}
                      y2={H}
                    />
                  ),
                )}
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
              <path d={land.d} className="en-land" />
              <path d={land.d} className="en-coast" />
              {show.plates ? <path d={plates.d} className="en-plates" /> : null}

              {/* 台灣 */}
              <g className="en-tw" transform={`translate(${twx},${twy})`}>
                <path d="M-7,0H-3M3,0H7M0,-7V-3M0,3V7" />
                <text x={9} y={-6} className="font-mono-label">
                  TW
                </text>
              </g>

              {/* 自然事件：風暴畫路徑 */}
              {show.nat
                ? nat.map((n) => {
                    const m = natOf(n.cat);
                    const [x, y] = xy(n.lng, n.lat);
                    const on = isSel("nat", n.id);
                    return (
                      <g
                        key={n.id}
                        className={`en-pt${on ? " on" : ""}`}
                        onClick={() => pick({ kind: "nat", id: n.id })}
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
                          s={on ? 5 : 3.2}
                          c={m.c}
                        />
                        <circle cx={x} cy={y} r={9} className="en-hit" />
                      </g>
                    );
                  })
                : null}

              {/* 地震：越舊越淡，24 小時內的外面多一圈 */}
              {show.eq
                ? quakes
                    .slice()
                    .sort((a, b) => b.mag - a.mag)
                    .map((q) => {
                      const [x, y] = xy(q.lng, q.lat);
                      const age = (now - q.time) / DAY;
                      const on = isSel("eq", q.id);
                      const r = quakeR(q.mag);
                      return (
                        <g
                          key={q.id}
                          className={`en-pt${on ? " on" : ""}`}
                          onClick={() => pick({ kind: "eq", id: q.id })}
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={r}
                            fill={depthColor(q.depth)}
                            fillOpacity={
                              on ? 0.95 : Math.max(0.25, 0.85 - age * 0.09)
                            }
                            className="en-q"
                          />
                          {age < 1 ? (
                            <circle
                              cx={x}
                              cy={y}
                              r={r + 2.5}
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
                            r={Math.max(8, r)}
                            className="en-hit"
                          />
                        </g>
                      );
                    })
                : null}

              {/* 災害警報：四角框 */}
              {show.alert
                ? alerts.map((a) => {
                    const [x, y] = xy(a.lng, a.lat);
                    const c =
                      a.level === "Red" ? "var(--en-red)" : "var(--orange)";
                    const on = isSel("alert", a.id);
                    return (
                      <g
                        key={a.id}
                        className={`en-pt${on ? " on" : ""}${a.current ? "" : " past"}`}
                        onClick={() => pick({ kind: "alert", id: a.id })}
                      >
                        <Corners
                          x={x}
                          y={y}
                          s={on ? 11 : 8}
                          c={c}
                          w={on ? 2 : 1.4}
                        />
                        <circle cx={x} cy={y} r={10} className="en-hit" />
                      </g>
                    );
                  })
                : null}
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

        {/* 選到的那一筆 */}
        <div className="en-info" aria-live="polite">
          {selected ? (
            <Info s={selected} now={now} onClose={() => setSel(null)} />
          ) : (
            <p className="font-mono-label dim">
              &gt; 點地圖上的點，或下面清單的任一筆，看詳細資料_
            </p>
          )}
        </div>
      </section>

      {/* ---- 離台灣最近 ---- */}
      {nearTW ? (
        <button
          type="button"
          className="en-near"
          onClick={() => pickFromList({ kind: "eq", id: nearTW.q.id })}
        >
          <span className="font-mono-label k">
            離台灣最近的一筆（本週 M4.5+）
          </span>
          <span className="v">
            M{nearTW.q.mag.toFixed(1)}
            <small>
              距台灣約 {Math.round(nearTW.d).toLocaleString("zh-TW")} km・
              {ago(nearTW.q.time, now)}
            </small>
          </span>
          <span className="font-mono-label place">{nearTW.q.place}</span>
        </button>
      ) : null}

      {/* ---- 三欄清單 ---- */}
      <section className="en-cols">
        <div className="en-col">
          <h2>
            <span className="no font-mono-label">01</span>地震
            <em className="font-mono-label">USGS · 24h · M4.5+</em>
          </h2>
          <StateNote
            s={st.eq}
            empty={!day.length}
            emptyText="過去 24 小時沒有 M4.5 以上的地震"
          />
          <ul>
            {quakeList.map((q) => (
              <li key={q.id}>
                <button
                  type="button"
                  className={isSel("eq", q.id) ? "on" : ""}
                  onClick={() => pickFromList({ kind: "eq", id: q.id })}
                >
                  <b className="mag" style={{ color: depthColor(q.depth) }}>
                    {q.mag.toFixed(1)}
                  </b>
                  <span className="t">
                    <span className="place">{q.place}</span>
                    <span className="meta font-mono-label">
                      {tpe(q.time)}・深 {Math.round(q.depth)} km
                      {q.tsunami ? "・海嘯資訊" : ""}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="en-col">
          <h2>
            <span className="no font-mono-label">02</span>自然事件
            <em className="font-mono-label">NASA EONET · OPEN</em>
          </h2>
          <StateNote
            s={st.nat}
            empty={!nat.length}
            emptyText="目前沒有進行中的事件"
          />
          {natGroups.map(([cat, list]) => {
            const m = natOf(cat);
            return (
              <div key={cat} className="en-grp">
                <p className="g font-mono-label">
                  <svg
                    width="10"
                    height="10"
                    viewBox="-5 -5 10 10"
                    aria-hidden="true"
                  >
                    <Shape shape={m.shape} x={0} y={0.5} s={4} c={m.c} />
                  </svg>
                  {m.zh}
                  <span>{list.length}</span>
                </p>
                <ul>
                  {list.slice(0, 4).map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        className={isSel("nat", n.id) ? "on" : ""}
                        onClick={() => pickFromList({ kind: "nat", id: n.id })}
                      >
                        <span className="t">
                          <span className="place">{n.title}</span>
                          <span className="meta font-mono-label">
                            最新 {tpe(n.date)}
                            {n.mag ? `・${n.mag}` : ""}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                  {list.length > 4 ? (
                    <li className="more font-mono-label">
                      ＋另外 {list.length - 4} 件（在地圖上）
                    </li>
                  ) : null}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="en-col">
          <h2>
            <span className="no font-mono-label">03</span>災害警報
            <em className="font-mono-label">GDACS · 30 DAYS</em>
          </h2>
          <StateNote
            s={st.alert}
            empty={!alerts.length}
            emptyText="過去 30 天沒有橘色以上的警報"
          />
          <ul>
            {alerts.slice(0, 10).map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={`${isSel("alert", a.id) ? "on" : ""}${a.current ? "" : " past"}`}
                  onClick={() => pickFromList({ kind: "alert", id: a.id })}
                >
                  <b className={`lv ${a.level === "Red" ? "red" : "org"}`}>
                    {a.level === "Red" ? "紅" : "橘"}
                  </b>
                  <span className="t">
                    <span className="place">
                      {GD[a.type] ?? a.type}・{a.name}
                    </span>
                    <span className="meta font-mono-label">
                      {a.current ? "進行中" : "已結束"}・{tpe(a.to)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
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
        2003）。時間一律為台北時間。台灣附近的地震以
        <a href="https://scweb.cwa.gov.tw/" rel="noreferrer">
          中央氣象署
        </a>
        為準。
      </p>
    </div>
  );
}

function StateNote({
  s,
  empty,
  emptyText,
}: {
  s: Status;
  empty: boolean;
  emptyText: string;
}) {
  if (s === "loading")
    return <p className="en-state font-mono-label">&gt; loading⋯</p>;
  if (s === "error")
    return (
      <p className="en-state err font-mono-label">
        &gt; 暫時抓不到資料，5 分鐘後再試
      </p>
    );
  if (empty) return <p className="en-state font-mono-label">{emptyText}</p>;
  return null;
}

function Info({
  s,
  now,
  onClose,
}: {
  s:
    | { kind: "eq"; v: Quake }
    | { kind: "nat"; v: Natural }
    | { kind: "alert"; v: Alert };
  now: number;
  onClose: () => void;
}) {
  let head: string;
  let title: string;
  let rows: [string, string][];
  let link: string | undefined;
  let color: string;
  if (s.kind === "eq") {
    const q = s.v;
    head = `usgs/${q.id}`;
    title = `M${q.mag.toFixed(1)} 地震`;
    color = depthColor(q.depth);
    rows = [
      ["位置", q.place],
      ["時間", `${tpe(q.time)}（${ago(q.time, now)}）`],
      ["震源深度", `${q.depth.toFixed(1)} km`],
      ["座標", `${q.lat.toFixed(2)}, ${q.lng.toFixed(2)}`],
      ["距台灣", `約 ${Math.round(km(q, TW)).toLocaleString("zh-TW")} km`],
    ];
    if (q.tsunami)
      rows.push(["海嘯", "USGS 標示有海嘯相關資訊，請看當地官方發布"]);
    if (q.alert) rows.push(["PAGER", q.alert.toUpperCase()]);
    link = q.url;
  } else if (s.kind === "nat") {
    const n = s.v;
    const m = natOf(n.cat);
    head = `eonet/${n.id}`;
    title = n.title;
    color = m.c;
    rows = [
      ["種類", m.zh],
      ["最新紀錄", `${tpe(n.date)}（${ago(n.date, now)}）`],
      ["座標", `${n.lat.toFixed(2)}, ${n.lng.toFixed(2)}`],
    ];
    if (n.mag) rows.push(["強度", n.mag]);
    if (n.track.length > 1)
      rows.push(["紀錄點", `${n.track.length} 個（地圖上的線是路徑）`]);
    link = n.url;
  } else {
    const a = s.v;
    head = `gdacs/${a.id}`;
    title = `${GD[a.type] ?? a.type}・${a.name}`;
    color = a.level === "Red" ? "var(--en-red)" : "var(--orange)";
    rows = [
      ["警報等級", a.level === "Red" ? "紅色（最高）" : "橘色"],
      ["狀態", a.current ? "進行中" : "已結束"],
      ["期間", `${tpe(a.from)} – ${tpe(a.to)}`],
      ["國家", a.country],
    ];
    if (a.severity) rows.push(["強度", a.severity]);
    link = a.url;
  }
  return (
    <div className="en-card" style={{ ["--c" as string]: color }}>
      <p className="font-mono-label head">
        &gt; open {head}
        <button type="button" onClick={onClose} aria-label="關閉">
          ×
        </button>
      </p>
      <h3>{title}</h3>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono-label">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {link ? (
        <a
          href={link}
          rel="noreferrer"
          target="_blank"
          className="font-mono-label more"
        >
          → 原始資料
        </a>
      ) : null}
    </div>
  );
}
