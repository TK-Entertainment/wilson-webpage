// 今日地球的資料：抓取、整理成統一的「事件」、算重要度
// 三個來源都允許跨網域，瀏覽器直接抓（CSP connect-src 已放行）
// - USGS：過去 7 天 M4.5 以上地震
// - NASA EONET：進行中的自然事件（野火、風暴、火山、海冰…）
// - GDACS：聯合國／歐盟的全球災害警報（只取橘色、紅色；種類清單加 TS 會整個回 204）

export const TW = { lat: 23.7, lng: 121 };
export const DAY = 86400000;

export type Quake = {
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
export type Natural = {
  id: string;
  title: string;
  cat: string;
  date: number;
  lng: number;
  lat: number;
  track: [number, number][];
  mag?: string;
  kts?: number;
  url?: string;
};
export type Alert = {
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

/** 0 注意、1 警戒、2 危險 */
export type Level = 0 | 1 | 2;
export const LEVEL = [
  { zh: "注意", en: "WATCH", c: "var(--gold)" },
  { zh: "警戒", en: "WARNING", c: "var(--orange)" },
  { zh: "危險", en: "CRITICAL", c: "var(--en-red)" },
] as const;

export type Ev = {
  key: string;
  kind: "eq" | "nat" | "alert";
  tag: string;
  lng: number;
  lat: number;
  time: number;
  score: number;
  level: Level;
  /** 中文主標 */
  title: string;
  /** 一句話：為什麼要看 */
  why: string;
  rows: [string, string][];
  url?: string;
  color: string;
  /** 已結束的警報：地圖上淡一點、不進巡邏 */
  past?: boolean;
};

// EONET 分類
export const NAT: Record<
  string,
  { zh: string; tag: string; c: string; shape: "tri" | "dia" | "cir" | "sq" }
> = {
  wildfires: { zh: "野火", tag: "FIRE", c: "var(--orange)", shape: "tri" },
  severeStorms: {
    zh: "強烈風暴",
    tag: "STORM",
    c: "var(--teal)",
    shape: "dia",
  },
  volcanoes: { zh: "火山", tag: "VOLC", c: "var(--rose)", shape: "tri" },
  seaLakeIce: { zh: "海冰與湖冰", tag: "ICE", c: "var(--sky)", shape: "cir" },
  floods: { zh: "洪水", tag: "FLOOD", c: "var(--sky)", shape: "sq" },
  landslides: { zh: "山崩", tag: "SLIDE", c: "var(--gold)", shape: "sq" },
  drought: { zh: "乾旱", tag: "DRY", c: "var(--gold)", shape: "sq" },
  dustHaze: { zh: "沙塵與霾", tag: "DUST", c: "var(--gold)", shape: "cir" },
  snow: { zh: "雪", tag: "SNOW", c: "var(--cream)", shape: "cir" },
  tempExtremes: { zh: "極端溫度", tag: "TEMP", c: "var(--rose)", shape: "sq" },
  waterColor: { zh: "水色異常", tag: "WATER", c: "var(--teal)", shape: "cir" },
  earthquakes: { zh: "地震", tag: "EQ", c: "var(--orange)", shape: "cir" },
  manmade: { zh: "人為事件", tag: "MAN", c: "var(--plum)", shape: "sq" },
};
export const natOf = (c: string) =>
  NAT[c] ?? { zh: c, tag: "EVT", c: "var(--cream)", shape: "cir" as const };

// GDACS 事件種類
export const GD: Record<string, string> = {
  EQ: "地震",
  TC: "熱帶氣旋",
  FL: "洪水",
  VO: "火山",
  DR: "乾旱",
  WF: "野火",
};

// 震源深度：淺（<70 km）橘、中（70–300）金、深（>300）青綠
export const depthColor = (d: number) =>
  d < 70 ? "var(--orange)" : d < 300 ? "var(--gold)" : "var(--teal)";
export const depthZh = (d: number) =>
  d < 70 ? "淺層" : d < 300 ? "中層" : "深層";
export const quakeR = (m: number) =>
  Math.max(1.6, 1.25 * Math.pow(1.75, m - 4.5));

export const pad = (n: number) => String(n).padStart(2, "0");
/** 一律顯示台北時間（UTC+8），不管讀者在哪 */
export function tpe(t: number, withDate = true) {
  const d = new Date(t + 8 * 3600000);
  const hm = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  return withDate
    ? `${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())} ${hm}`
    : hm;
}
export function ago(t: number, now: number) {
  const m = Math.max(0, Math.round((now - t) / 60000));
  if (m < 60) return `${m} 分鐘前`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} 小時前`;
  return `${Math.round(h / 24)} 天前`;
}
export function km(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const r = Math.PI / 180;
  const s =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) *
      Math.cos(b.lat * r) *
      Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(s));
}
/** USGS 的地點「148 km WSW of Tual, Indonesia」取最後的國家／地區 */
const region = (place: string) =>
  place
    .split(", ")
    .pop()
    ?.replace(/^.* of /, "") || place;
const kmZh = (n: number) => `${Math.round(n).toLocaleString("zh-TW")} km`;

/* ---------------- 抓資料 ---------------- */

async function getJSON(url: string) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(String(r.status));
  // GDACS 查不到東西時回 204、沒有內容
  if (r.status === 204) return {};
  return r.json();
}

export async function loadQuakes(): Promise<Quake[]> {
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

export async function loadNatural(): Promise<Natural[]> {
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
      kts: last.magnitudeUnit === "kts" ? last.magnitudeValue : undefined,
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

export async function loadAlerts(): Promise<Alert[]> {
  const day = (t: number) => new Date(t).toISOString().slice(0, 10);
  const now = Date.now();
  const d = await getJSON(
    "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=EQ;TC;FL;VO;DR;WF" +
      `&alertlevel=Orange;Red&fromdate=${day(now - 30 * DAY)}&todate=${day(now + DAY)}`,
  );
  // GDACS 的時間沒有時區，實際是 UTC
  const t = (s: string) =>
    Date.parse(/Z|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);
  return ((d.features ?? []) as any[])
    .map((f) => {
      const p = f.properties;
      return {
        id: `${p.eventtype}-${p.eventid}`,
        type: p.eventtype,
        level: p.alertlevel,
        // 颱風、火山用名字；其他（地震、洪水、乾旱、野火）用國家，太多國只列前三個
        name:
          ["TC", "VO"].includes(p.eventtype) && p.eventname
            ? p.eventname
            : short(p.country ?? p.name),
        country: short(p.country ?? ""),
        from: t(p.fromdate),
        to: t(p.todate),
        current: p.iscurrent === "true",
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
        severity: p.severitydata?.severitytext,
        url: p.url?.report,
      } as Alert;
    })
    .filter((a) => a.level === "Red" || a.level === "Orange");
}

/* ---------------- 統一成事件、算重要度 ---------------- */

const lv = (s: number): Level => (s >= 75 ? 2 : s >= 45 ? 1 : 0);

export function toEvents(
  quakes: Quake[],
  nat: Natural[],
  alerts: Alert[],
  now: number,
): Ev[] {
  const out: Ev[] = [];

  for (const q of quakes) {
    const d = km(q, TW);
    const age = now - q.time;
    // M6.6 約 61（警戒）、M7.5 約 81（危險）；PAGER 橘紅、海嘯、離台灣近再往上加
    let s = 15 + (q.mag - 4.5) * 22;
    if (age > DAY) s *= 0.5;
    if (q.tsunami) s += 20;
    if (q.alert === "yellow") s += 10;
    if (q.alert === "orange") s += 30;
    if (q.alert === "red") s += 50;
    if (d < 1500) s += 20;
    const why: string[] = [];
    if (q.mag >= 6) why.push(`規模 ${q.mag.toFixed(1)}，足以造成災害的強震`);
    else why.push(`規模 ${q.mag.toFixed(1)} 的${depthZh(q.depth)}地震`);
    if (q.depth < 70 && q.mag >= 5.5) why.push("震源淺、地表搖晃會比較明顯");
    if (q.tsunami) why.push("USGS 標示有海嘯相關資訊");
    if (d < 1500) why.push(`離台灣只有約 ${kmZh(d)}`);
    out.push({
      key: `eq:${q.id}`,
      kind: "eq",
      tag: "EQ",
      lng: q.lng,
      lat: q.lat,
      time: q.time,
      score: s,
      level: lv(s),
      title: `M${q.mag.toFixed(1)} 地震・${region(q.place)}`,
      why: why.join("；"),
      rows: [
        ["位置", q.place],
        ["時間", `${tpe(q.time)}（${ago(q.time, now)}）`],
        ["震源深度", `${q.depth.toFixed(1)} km・${depthZh(q.depth)}`],
        ["距台灣", `約 ${kmZh(d)}`],
        ...(q.alert
          ? ([["PAGER", q.alert.toUpperCase()]] as [string, string][])
          : []),
      ],
      url: q.url,
      color: depthColor(q.depth),
    });
  }

  for (const n of nat) {
    const m = natOf(n.cat);
    const base: Record<string, number> = {
      severeStorms: 45,
      volcanoes: 50,
      floods: 40,
      landslides: 35,
      wildfires: 12,
      tempExtremes: 30,
    };
    let s = base[n.cat] ?? 8;
    if (n.kts) s += Math.max(0, (n.kts - 34) / 2); // 熱帶風暴以上，風越強越重要
    if (now - n.date > 5 * DAY) s *= 0.6;
    const why =
      n.cat === "severeStorms"
        ? `還在發展中的風暴${n.kts ? `，最大風速約 ${Math.round(n.kts * 1.852)} km/h` : ""}`
        : n.cat === "volcanoes"
          ? "活動中的火山"
          : n.cat === "wildfires"
            ? `仍在燃燒的野火${n.mag ? `，面積 ${n.mag}` : ""}`
            : n.cat === "seaLakeIce"
              ? "衛星追蹤中的冰山或海冰"
              : `進行中的${m.zh}事件`;
    out.push({
      key: `nat:${n.id}`,
      kind: "nat",
      tag: m.tag,
      lng: n.lng,
      lat: n.lat,
      time: n.date,
      score: s,
      level: lv(s),
      title: `${m.zh}・${n.title}`,
      why,
      rows: [
        ["種類", m.zh],
        ["最新紀錄", `${tpe(n.date)}（${ago(n.date, now)}）`],
        ["座標", `${n.lat.toFixed(2)}, ${n.lng.toFixed(2)}`],
        ...(n.mag ? ([["強度", n.mag]] as [string, string][]) : []),
        ...(n.track.length > 1
          ? ([["紀錄點", `${n.track.length} 個（虛線是路徑）`]] as [
              string,
              string,
            ][])
          : []),
      ],
      url: n.url,
      color: m.c,
    });
  }

  for (const a of alerts) {
    // 乾旱一拖好幾個月，同樣等級排在其他災害後面
    let s = a.level === "Red" ? 95 : 70;
    if (a.type === "DR") s -= 35;
    if (!a.current) s = 10;
    const why = a.current
      ? `GDACS ${a.level === "Red" ? "紅色（最高等級）" : "橘色"}警報，預估${a.level === "Red" ? "可能需要國際救援" : "會有明顯災情"}`
      : "已結束的警報";
    out.push({
      key: `alert:${a.id}`,
      kind: "alert",
      tag: "ALERT",
      lng: a.lng,
      lat: a.lat,
      time: a.to,
      score: s,
      level: a.current ? (a.level === "Red" ? 2 : 1) : 0,
      title: `${GD[a.type] ?? a.type}・${a.name}`,
      why,
      rows: [
        ["警報等級", a.level === "Red" ? "紅色（最高）" : "橘色"],
        ["狀態", a.current ? "進行中" : "已結束"],
        ["期間", `${tpe(a.from)} – ${tpe(a.to)}`],
        ["國家", a.country],
        ...(a.severity ? ([["強度", a.severity]] as [string, string][]) : []),
      ],
      url: a.url,
      color: a.level === "Red" ? "var(--en-red)" : "var(--orange)",
      past: !a.current,
    });
  }
  return out;
}
