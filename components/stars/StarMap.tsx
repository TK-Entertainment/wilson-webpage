"use client";

// 知識星圖：星的排列照真的古星圖（保井春海〈天文分野之圖〉1677）——北極在中心，越往外越南。
// 圖上 1007 顆星裡，470 顆借來放筆記的名詞：一門課占一個方位，一頁筆記是一群相鄰的星。
// 星空畫在 canvas（星點、閃爍、觀測線、星軌、流星、跨科跳躍的彗星），選取時的線和字疊在上面的 SVG。
// 互動參考：WikiGalaxy 點星就飛進星群、Skyrim 技能星座「點過的星會亮」、長時間曝光的星軌照片、星座早見盤。
// 平常全是灰白的星點，選取時才上色（網站風格：科技、日式、雜訊）。
// 資料：scripts/stars-chart.py 找星點 → scripts/stars-data.mjs 分配名詞（starData.json）
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { courseColor } from "@/utils/palette";

type Term = { i: number; name: string; desc: string; x: number; y: number; r: number };
type Chapter = { page: string; code: string; title: string; url: string; terms: Term[]; edges: number[][] }; // edges：星座的線，用名詞的 i 表示
type Subject = { id: string; name: string; chapters: Chapter[] };
type LinkT = { a: string; b: string; kind: "same" | "concept"; why?: string };
type Chart = {
  title: string;
  author: string;
  year: number;
  credit: string;
  source: string;
  cx: number;
  cy: number;
  edge: number;
  nPoints: number;
  bg: number[][]; // 沒放名詞的星點 [x, y, 墨點大小]
};
export type StarData = { generated: string; subjects: Subject[]; links: LinkT[]; chart: Chart };

type Star = {
  id: string;
  n: number; // 星表編號
  x: number;
  y: number;
  r: number; // 古星圖上墨點的大小
  a: number; // 從正上方順時針的角度（弧度）
  rho: number; // 離北極的距離，外圈＝1
  subj: Subject;
  ch: Chapter;
  term: Term;
  color: string;
};
type Cam = { x: number; y: number; w: number }; // 鏡頭：畫面中心和寬度（星圖座標）
// canvas 上的每一顆星。kind：0 背景星、1 名詞星、2 有跨科連線的名詞星
type Dot = { x: number; y: number; r: number; kind: number; id: string | null; a: number; th: number; d: number; amp: number; lum: number; w: number; ph: number };
type Toast = { key: number; head: string; text: string; color: string };
type Anim = {
  intro: number; // 開場描星開始的時間（秒），-1＝還沒開始
  sweep0: number; // 觀測線從正上方出發的時間
  expo: number; // 長曝光開始的時間，-1＝沒有
  expoOn: boolean;
  fly: { from: Cam; to: Cam; t0: number; dur: number; bump: number } | null;
  jump: { a: Star; b: Star; t0: number; gold: boolean } | null;
  meteor: { x0: number; y0: number; x1: number; y1: number; t0: number } | null;
  nextMeteor: number;
  busy: number; // 選取時星空變暗的程度（0–1，慢慢過渡）
};

const SWEEP = 18; // 觀測線轉一圈的秒數
const INTRO = 2.6; // 開場：觀測線快轉一圈，把星描上去
const EXPO = 4.5; // 長曝光：星空繞北極轉一整圈的秒數
const FADE = 3; // 曝光結束後星軌淡掉的秒數
const JUMP = 1.5; // 跨科跳躍
const METEOR = 0.9;
const SIDEREAL = 23 * 60 + 56; // 一個恆星日（分）
const STORE = "ks-seen-v1";
const POOL = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789";
const TAG: Record<string, string> = { geochemistry: "GEOCHEM", "structural-geology": "STRUCT", mineralogy: "MINERAL", "earth-materials": "EARTH-MAT" };
// 古星圖外圈的十二支（子在上、卯在左、午在下、酉在右）
const BRANCH = ["子", "亥", "戌", "酉", "申", "未", "午", "巳", "辰", "卯", "寅", "丑"];
const SK = "239,228,200"; // 星的顏色
const TEAL = "76,184,176";

function build(data: StarData) {
  const { cx, cy, edge } = data.chart;
  const stars: Star[] = [];
  let n = 0;
  for (const S of data.subjects)
    for (const ch of S.chapters)
      for (const t of ch.terms)
        stars.push({
          id: `${S.id}/${ch.page}#${t.i}`,
          n: ++n,
          x: t.x,
          y: t.y,
          r: t.r,
          a: (Math.atan2(t.x - cx, -(t.y - cy)) + 2 * Math.PI) % (2 * Math.PI),
          rho: Math.hypot(t.x - cx, t.y - cy) / edge,
          subj: S,
          ch,
          term: t,
          color: courseColor(S.id) ?? "var(--gold)",
        });
  return { stars, byId: new Map(stars.map((s) => [s.id, s])) };
}

const TAU = 2 * Math.PI;
const deg = (a: number) => `${((a * 180) / Math.PI).toFixed(1)}°`;
const pad = (n: number, k = 4) => String(n).padStart(k, "0");
// 圓盤上角度 f（從正上方順時針）、半徑 r 的點
const polar = (cx: number, cy: number, r: number, f: number) => [cx + r * Math.sin(f), cy - r * Math.cos(f)] as const;
const arcTo = (cx: number, cy: number, r: number, f0: number, f1: number) => {
  const [x1, y1] = polar(cx, cy, r, f1);
  return `A${r},${r} 0 ${f1 - f0 > Math.PI ? 1 : 0} 1 ${x1},${y1}`;
};
const arc = (cx: number, cy: number, r: number, f0: number, f1: number) => `M${polar(cx, cy, r, f0).join(",")}${arcTo(cx, cy, r, f0, f1)}`;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
const easeOut = (k: number) => 1 - (1 - k) ** 3;
const hash = (i: number) => {
  const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const now = () => performance.now() / 1000;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// 點到線段的距離
const segDist = (x: number, y: number, x0: number, y0: number, x1: number, y1: number) => {
  const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy || 1;
  const k = clamp(((x - x0) * dx + (y - y0) * dy) / L, 0, 1);
  return Math.hypot(x - x0 - k * dx, y - y0 - k * dy);
};

// 換目標時，字先變成亂碼再一個一個解出來
function Scramble({ text }: { text: string }) {
  const [s, setS] = useState(text);
  useEffect(() => {
    if (reducedMotion()) {
      setS(text);
      return;
    }
    const chars = Array.from(text);
    let f = 0;
    const N = 9;
    const id = window.setInterval(() => {
      f++;
      const k = Math.floor((chars.length * f) / N);
      setS(chars.map((c, i) => (i < k || c === " " ? c : POOL[Math.floor(Math.random() * POOL.length)])).join(""));
      if (f >= N) window.clearInterval(id);
    }, 32);
    return () => window.clearInterval(id);
  }, [text]);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{s}</span>
    </>
  );
}

export default function StarMap({ data }: { data: StarData }) {
  const { chart } = data;
  const { cx, cy, edge } = chart;
  const R = edge * 1.16; // 畫面半徑：外圈再留刻度和十二支的位置
  const HOME: Cam = { x: cx, y: cy, w: 2 * R };
  const { stars, byId } = useMemo(() => build(data), [data]);
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [W, setW] = useState(900); // 星圖在螢幕上的寬度（px）
  const [cam, setCamS] = useState<Cam>(HOME);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [mode, setMode] = useState<"idle" | "expose" | "jump">("idle"); // 長曝光、跨科跳躍時先把疊圖收起來
  const [toast, setToast] = useState<Toast | null>(null);
  const [reduced, setReduced] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hudRef = useRef<HTMLElement>(null);
  const readRef = useRef<HTMLParagraphElement>(null);
  const camRef = useRef(cam);
  const seenRef = useRef(seen);
  const anim = useRef<Anim>({ intro: -1, sweep0: 0, expo: -1, expoOn: false, fly: null, jump: null, meteor: null, nextMeteor: 0, busy: 0 });
  const live = useRef({ busy: false, seen: seen, done: [] as Chapter[], dirty: true });
  const cb = useRef<{ cam: (c: Cam) => void; endJump: (b: Star) => void; endExpo: () => void; esc: () => void }>({ cam: () => {}, endJump: () => {}, endExpo: () => {}, esc: () => {} });
  const drag = useRef<{ x: number; y: number; cam: Cam; moved: boolean } | null>(null);
  const dragged = useRef(false);

  const A = picked ? byId.get(picked) : undefined;
  const Hv = hover && hover !== picked ? byId.get(hover) : undefined;
  const zoomed = cam.w < 2 * R * 0.97;
  const Z = (2 * R) / cam.w; // 放大倍率
  const uz = cam.w / W; // 圖上幾個單位＝螢幕 1px
  // 星點大小照古星圖上墨點的大小；畫面小（手機）時跟著縮，放大時慢慢變大（和 canvas 一樣）
  const sc = clamp(W / 900, 0.55, 1);
  const dot = (r: number) => (0.55 + 0.2 * r) * sc * Z ** 0.45 * uz;
  const [vx0, vy0] = [cam.x - cam.w / 2, cam.y - cam.w / 2];
  const [vx1, vy1] = [vx0 + cam.w, vy0 + cam.w];
  const inView = (x: number, y: number, m = 0) => x > vx0 + m && x < vx1 - m && y > vy0 + m && y < vy1 - m;

  const setCam = (c: Cam) => {
    camRef.current = c;
    setCamS(c);
  };
  // 鏡頭不能拉出圓盤外
  const fit = (c: Cam): Cam => {
    const w = clamp(c.w, (2 * R) / 8, 2 * R);
    return { w, x: clamp(c.x, cx - R + w / 2, cx + R - w / 2), y: clamp(c.y, cy - R + w / 2, cy + R - w / 2) };
  };
  // 飛過去：中心直線移動、寬度照對數內插；距離遠時中途先拉遠一點，才看得出是從哪裡飛到哪裡
  const flyTo = (to: Cam, dur = 0.9) => {
    const f = fit(to), from = camRef.current;
    if (reduced) {
      anim.current.fly = null;
      setCam(f);
      return;
    }
    const dist = Math.hypot(f.x - from.x, f.y - from.y);
    anim.current.fly = { from, to: f, t0: now(), dur, bump: clamp((dist / Math.max(from.w, f.w)) * 0.5, 0, 0.9) };
  };
  // 一頁筆記的星座剛好填滿畫面
  const frameOf = (ch: Chapter): Cam => {
    const xs = ch.terms.map((t) => t.x), ys = ch.terms.map((t) => t.y);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: clamp(Math.max(x1 - x0, y1 - y0) * 1.8 + 0.2 * edge, (2 * R) / 7, 2 * R * 0.8) };
  };

  const adj = useMemo(() => {
    const m = new Map<string, { other: string; link: LinkT }[]>();
    for (const L of data.links) {
      if (!byId.has(L.a) || !byId.has(L.b)) continue;
      m.set(L.a, [...(m.get(L.a) ?? []), { other: L.b, link: L }]);
      m.set(L.b, [...(m.get(L.b) ?? []), { other: L.a, link: L }]);
    }
    return m;
  }, [data, byId]);

  // canvas 用的星：背景星＋名詞星，各自的閃爍速度
  const sky = useMemo(() => {
    const dots: Dot[] = [
      ...chart.bg.map(([x, y, r]) => ({ x, y, r, kind: 0, id: null })),
      ...stars.map((s) => ({ x: s.x, y: s.y, r: s.r, kind: adj.has(s.id) ? 2 : 1, id: s.id })),
    ].map((p, i) => ({
      ...p,
      a: (Math.atan2(p.x - cx, -(p.y - cy)) + TAU) % TAU,
      th: Math.atan2(p.y - cy, p.x - cx),
      d: Math.hypot(p.x - cx, p.y - cy),
      amp: p.kind ? 0.18 : 0.32,
      lum: 0.2 + 1.3 * hash(i + 2027) ** 2, // 星軌的亮度：每顆不一樣，才像真的曝光照片
      w: 0.6 + 2.2 * hash(i),
      ph: TAU * hash(i + 1013),
    }));
    return { dots, angles: dots.map((p) => p.a).sort((a, b) => a - b) };
  }, [chart, stars, adj, cx, cy]);

  // 每門課占的方位（給圖例和選取時的外圈弧線）
  const sectors = useMemo(
    () =>
      new Map(
        data.subjects.map((S) => {
          const as = stars.filter((s) => s.subj === S).map((s) => s.a);
          return [S.id, [Math.min(...as), Math.max(...as)] as const];
        }),
      ),
    [data, stars],
  );
  const nCh = useMemo(() => data.subjects.reduce((a, S) => a + S.chapters.length, 0), [data]);
  // 名詞全部點過的頁＝完成的星座
  const done = useMemo(() => data.subjects.flatMap((S) => S.chapters.filter((ch) => ch.terms.every((t) => seen.has(`${S.id}/${ch.page}#${t.i}`)))), [data, seen]);

  const query = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!query) return [];
    const inName = stars.filter((s) => s.term.name.toLowerCase().includes(query));
    const inDesc = stars.filter((s) => !s.term.name.toLowerCase().includes(query) && s.term.desc.toLowerCase().includes(query));
    return [...inName, ...inDesc];
  }, [query, stars]);
  const near = A ? adj.get(A.id) ?? [] : [];

  // 點過的星記在瀏覽器裡（只有自己看得到）；一頁的名詞全點過就完成那個星座
  const markSeen = (S: Star) => {
    const cur = seenRef.current;
    if (cur.has(S.id)) return;
    const n = new Set(cur).add(S.id);
    seenRef.current = n;
    setSeen(n);
    try {
      localStorage.setItem(STORE, JSON.stringify([...n]));
    } catch {}
    const pre = `${S.subj.id}/${S.ch.page}#`;
    if (S.ch.terms.every((t) => n.has(pre + t.i)))
      setToast({ key: Date.now(), head: "CONSTELLATION COMPLETE", text: `${TAG[S.subj.id] ?? S.subj.id} ${S.ch.code} ${S.ch.title} · ${S.ch.terms.length}/${S.ch.terms.length}`, color: S.color });
  };
  const select = (id: string | null, fly = true) => {
    setPicked(id);
    const S = id ? byId.get(id) : undefined;
    if (!S) return;
    markSeen(S);
    if (fly) flyTo(frameOf(S.ch));
  };
  // 跨科跳躍：彗星沿著連線飛過去，鏡頭跟著
  const jump = (id: string) => {
    const B = byId.get(id);
    if (!B) return;
    if (!A || reduced || mode !== "idle") return select(id);
    const link = near.find((x) => x.other === id)?.link;
    anim.current.jump = { a: A, b: B, t0: now(), gold: link?.kind !== "same" };
    setMode("jump");
    setHover(null);
    flyTo(frameOf(B.ch), JUMP);
  };
  // 長曝光：星空繞北極轉一整圈，留下星軌
  const expose = () => {
    if (reduced || mode !== "idle") return;
    Object.assign(anim.current, { expo: now(), expoOn: true });
    setMode("expose");
    setHover(null);
  };

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.clientWidth && setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    setReduced(reducedMotion());
    try {
      const v = JSON.parse(localStorage.getItem(STORE) ?? "[]");
      if (Array.isArray(v)) {
        const n = new Set<string>(v.filter((x) => typeof x === "string" && byId.has(x)));
        seenRef.current = n;
        setSeen(n);
      }
    } catch {}
  }, [byId]);
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(id);
  }, [toast]);
  // 每次 render 後把最新狀態交給動畫迴圈
  useEffect(() => {
    Object.assign(live.current, { busy: !!(A || query || focus), seen, done, dirty: true });
    cb.current = {
      cam: (c) => setCam(fit(c)),
      endJump: (b) => {
        select(b.id, false);
        setMode("idle");
      },
      endExpo: () => setMode("idle"),
      esc: () => (picked ? setPicked(null) : zoomed && flyTo(HOME)),
    };
  });

  // 動畫迴圈：整片星空每一格重畫
  useEffect(() => {
    const cv = cvRef.current, box = boxRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !box || !ctx) return;
    const css = getComputedStyle(box);
    const gold = css.getPropertyValue("--gold").trim() || "#d6a53c";
    const mono = `${css.getPropertyValue("--font-mono").trim() || "'Space Mono'"}, monospace`;
    const sans = css.fontFamily;
    const red = reducedMotion();
    const { dots, angles } = sky;
    let visible = false, raf = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      live.current.dirty = true;
    });
    io.observe(box);
    // 開發時給測試腳本用（正式建置會整段拿掉）
    if (process.env.NODE_ENV === "development") (window as unknown as { __ks: unknown }).__ks = { anim: anim.current, cam: camRef };
    const spark =(x: number, y: number, r: number) => {
      const k = r * 0.22;
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + k, y - k);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x + k, y + k);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - k, y + k);
      ctx.lineTo(x - r, y);
      ctx.lineTo(x - k, y - k);
      ctx.closePath();
    };
    // 一條由淡到亮的尾巴（流星、彗星）
    const streak = (x0: number, y0: number, x1: number, y1: number, col: string, wmax: number, fade: number) => {
      ctx.strokeStyle = col;
      ctx.lineCap = "round";
      for (let j = 0; j < 10; j++) {
        ctx.globalAlpha = ((j + 1) / 10) ** 1.6 * fade;
        ctx.lineWidth = 0.4 + (wmax * j) / 10;
        ctx.beginPath();
        ctx.moveTo(lerp(x0, x1, j / 10), lerp(y0, y1, j / 10));
        ctx.lineTo(lerp(x0, x1, (j + 1) / 10), lerp(y0, y1, (j + 1) / 10));
        ctx.stroke();
      }
    };

    const frame = (ms: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = ms / 1000, an = anim.current, L = live.current;
      if (an.intro < 0) {
        an.intro = red ? t - INTRO : t;
        an.sweep0 = an.intro + INTRO;
        an.nextMeteor = t + 10 + 10 * Math.random();
      }
      if (an.fly) {
        const f = an.fly, k = ease(clamp((t - f.t0) / f.dur, 0, 1));
        const w = Math.exp(lerp(Math.log(f.from.w), Math.log(f.to.w), k)) * (1 + f.bump * Math.sin(Math.PI * k));
        cb.current.cam({ x: lerp(f.from.x, f.to.x, k), y: lerp(f.from.y, f.to.y, k), w });
        if (k >= 1) an.fly = null;
      }
      if (red && !L.dirty) return;
      L.dirty = false;

      const Wp = cv.clientWidth;
      if (!Wp) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (cv.width !== Math.round(Wp * dpr)) cv.width = cv.height = Math.round(Wp * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, Wp, Wp);
      const c = camRef.current, s = Wp / c.w, ox = c.x - c.w / 2, oy = c.y - c.w / 2;
      const pcx = (cx - ox) * s, pcy = (cy - oy) * s, pe = edge * s;
      const sc = clamp(Wp / 900, 0.55, 1), zs = ((2 * R) / c.w) ** 0.45;
      const dp = (r: number) => (0.55 + 0.2 * r) * sc * zs;

      // 開場：觀測線快轉一圈，掃過的地方才出現星
      const ip = clamp((t - an.intro) / INTRO, 0, 1), front = easeOut(ip) * TAU, intro = ip < 1;
      // 長曝光：轉的角度 phi；轉滿一圈剛好回到原位，星軌再慢慢淡掉
      let phi = 0, trail = 0;
      if (an.expo >= 0) {
        const e = t - an.expo;
        if (e < EXPO) [phi, trail] = [ease(e / EXPO) * TAU, 1];
        else {
          [phi, trail] = [TAU, Math.max(0, 1 - (e - EXPO) / FADE)];
          if (an.expoOn) {
            an.expoOn = false;
            cb.current.endExpo();
          }
          if (trail <= 0) an.expo = -1;
        }
      }
      const rot = phi >= TAU ? 0 : phi, cr = Math.cos(-rot), sr = Math.sin(-rot);
      const P = (x: number, y: number) => {
        const dx = x - cx, dy = y - cy;
        return [pcx + (dx * cr - dy * sr) * s, pcy + (dx * sr + dy * cr) * s] as const;
      };
      an.busy += ((L.busy ? 1 : 0) - an.busy) * (red ? 1 : 0.18);
      const B = an.busy;

      // 盤面：同心圓、方位線、外圈刻度、十二支
      ctx.globalAlpha = clamp(ip * 2.5, 0, 1);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${SK},0.06)`;
      ctx.beginPath();
      for (const k of [0.25, 0.5, 0.75]) {
        ctx.moveTo(pcx + k * pe, pcy);
        ctx.arc(pcx, pcy, k * pe, 0, TAU);
      }
      for (let i = 0; i < 12; i++) {
        const f = (i * Math.PI) / 6;
        ctx.moveTo(pcx + 0.08 * pe * Math.sin(f), pcy - 0.08 * pe * Math.cos(f));
        ctx.lineTo(pcx + pe * Math.sin(f), pcy - pe * Math.cos(f));
      }
      ctx.stroke();
      ctx.strokeStyle = `rgba(${SK},0.28)`;
      ctx.beginPath();
      ctx.moveTo(pcx + pe, pcy);
      ctx.arc(pcx, pcy, pe, 0, TAU);
      for (let i = 0; i < 72; i++) {
        const f = (i * Math.PI) / 36, Lk = i % 6 ? 5 : 11;
        ctx.moveTo(pcx + pe * Math.sin(f), pcy - pe * Math.cos(f));
        ctx.lineTo(pcx + (pe + Lk) * Math.sin(f), pcy - (pe + Lk) * Math.cos(f));
      }
      ctx.stroke();
      const lr = pe + Math.min(24, 0.085 * pe);
      ctx.font = `700 ${Math.min(12, 0.06 * pe)}px ${sans}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(${SK},0.4)`;
      BRANCH.forEach((b, i) => ctx.fillText(b, pcx + lr * Math.sin((i * Math.PI) / 6), pcy - lr * Math.cos((i * Math.PI) / 6)));
      ctx.globalAlpha = 1;

      // 完成的星座：線留在天上
      if (L.done.length && !intro) {
        ctx.strokeStyle = `rgba(${SK},${0.26 * (1 - 0.6 * B)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const ch of L.done)
          for (const [i, j] of ch.edges) {
            const [x0, y0] = P(ch.terms[i].x, ch.terms[i].y), [x1, y1] = P(ch.terms[j].x, ch.terms[j].y);
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
          }
        ctx.stroke();
        ctx.font = `700 9px ${mono}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = `rgba(${SK},${0.45 * (1 - 0.6 * B)})`;
        for (const ch of L.done) {
          const [x, y] = P(ch.terms[0].x, ch.terms[0].y);
          ctx.fillText(ch.code, x + 6, y - 6);
        }
      }

      // 星軌
      if (trail > 0) {
        ctx.lineCap = "round";
        for (const p of dots) {
          ctx.strokeStyle = `rgba(${SK},${(p.kind === 2 ? 0.32 : p.kind ? 0.2 : 0.07) * p.lum * trail})`;
          ctx.lineWidth = dp(p.r) * (p.kind ? 1.5 : 1.1);
          ctx.beginPath();
          ctx.arc(pcx, pcy, p.d * s, p.th - phi, p.th);
          ctx.stroke();
        }
      }

      // 觀測線（開場時就是描星的那條線）
      const sweepOn = an.expo < 0 && !red;
      const psi = intro ? front : (((t - an.sweep0) / SWEEP) * TAU) % TAU;
      if (sweepOn) {
        ctx.fillStyle = `rgb(${TEAL})`;
        for (let i = 0; i < 14; i++) {
          const f0 = psi - ((i + 1) * TAU) / 180, f1 = psi - (i * TAU) / 180;
          ctx.globalAlpha = 0.07 * (1 - i / 14) * (1 - 0.7 * B) * (intro ? 1.8 : 1);
          ctx.beginPath();
          ctx.moveTo(pcx, pcy);
          ctx.arc(pcx, pcy, pe, f0 - Math.PI / 2, f1 - Math.PI / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = (intro ? 0.9 : 0.45) * (1 - 0.7 * B);
        ctx.strokeStyle = `rgb(${TEAL})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pcx, pcy);
        ctx.lineTo(pcx + pe * Math.sin(psi), pcy - pe * Math.cos(psi));
        ctx.stroke();
      }

      // 星：背景星淡、名詞星亮、有跨科連線的帶光芒、點過的留著光
      for (const p of dots) {
        let k = 1;
        if (intro) {
          const d = front - p.a;
          if (d < 0) continue;
          k = clamp(d / 0.4, 0, 1);
        }
        const [x, y] = P(p.x, p.y);
        if (x < -30 || y < -30 || x > Wp + 30 || y > Wp + 30) continue;
        const lit = p.id !== null && L.seen.has(p.id);
        const base = p.kind === 0 ? lerp(0.22, 0.12, B) : lit ? lerp(1, 0.32, B) : lerp(p.kind === 2 ? 0.95 : 0.62, 0.16, B);
        const tw = red ? 1 : 1 - p.amp * (0.5 + 0.5 * Math.sin(t * p.w + p.ph));
        const rr = dp(p.r);
        ctx.fillStyle = `rgb(${SK})`;
        if (lit) {
          ctx.globalAlpha = 0.13 * k * (1 - 0.6 * B);
          ctx.beginPath();
          ctx.arc(x, y, rr * 3.6, 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = base * k * tw;
        ctx.beginPath();
        if (p.kind === 2) spark(x, y, rr * 2.4);
        else ctx.arc(x, y, rr + (p.kind ? 0.3 : 0), 0, TAU);
        ctx.fill();
        // 開場：剛描上去的星閃一圈
        if (intro && front - p.a < 0.25) {
          const d01 = (front - p.a) / 0.25;
          ctx.globalAlpha = (1 - d01) * (p.kind ? 0.9 : 0.4);
          ctx.strokeStyle = `rgb(${TEAL})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, (2 + 9 * d01) * sc, 0, TAU);
          ctx.stroke();
        }
      }

      // 觀測線掃過的名詞星閃一下
      if (!intro && sweepOn) {
        ctx.strokeStyle = `rgb(${TEAL})`;
        ctx.lineWidth = 1.1;
        const rb = 6 * sc * Math.min(zs, 1.6);
        for (const st of stars) {
          const f = (((psi - st.a) % TAU) + TAU) % TAU / TAU;
          if (f >= 0.1) continue;
          const [op, k] = f < 0.05 ? [lerp(0.8, 0.3, f / 0.05), lerp(0.55, 1.15, f / 0.05)] : [lerp(0.3, 0, (f - 0.05) / 0.05), lerp(1.15, 1.25, (f - 0.05) / 0.05)];
          const [x, y] = P(st.x, st.y);
          ctx.globalAlpha = op * (1 - 0.7 * B);
          ctx.beginPath();
          ctx.arc(x, y, rb * k, 0, TAU);
          ctx.stroke();
        }
      }

      // 跨科跳躍的彗星
      const J = an.jump;
      if (J) {
        const e = (t - J.t0) / JUMP;
        if (e >= 1) {
          an.jump = null;
          cb.current.endJump(J.b);
        } else {
          const k = ease(clamp(e, 0, 1)), k0 = ease(clamp(e - 0.22, 0, 1));
          const [ax, ay] = P(J.a.x, J.a.y), [bx, by] = P(J.b.x, J.b.y);
          const col = J.gold ? gold : `rgb(${SK})`;
          ctx.globalAlpha = 0.22;
          ctx.strokeStyle = col;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
          ctx.setLineDash([]);
          const [hx, hy] = [lerp(ax, bx, k), lerp(ay, by, k)];
          streak(lerp(ax, bx, k0), lerp(ay, by, k0), hx, hy, col, 2.6, 1);
          ctx.fillStyle = col;
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(hx, hy, 9, 0, TAU);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = `rgb(${SK})`;
          ctx.beginPath();
          ctx.arc(hx, hy, 2.4, 0, TAU);
          ctx.fill();
        }
      }

      // 流星：沒在看東西的時候，偶爾劃過畫面
      if (!red && !intro && an.expo < 0 && !L.busy && !an.jump && !an.meteor && t > an.nextMeteor) {
        for (let tries = 0; tries < 12; tries++) {
          const mx = ox + c.w * (0.15 + 0.7 * Math.random()), my = oy + c.w * (0.15 + 0.7 * Math.random());
          if (Math.hypot(mx - cx, my - cy) > edge * 0.92) continue;
          const g = Math.random() * TAU, len = c.w * (0.18 + 0.12 * Math.random());
          an.meteor = { x0: mx - (Math.cos(g) * len) / 2, y0: my - (Math.sin(g) * len) / 2, x1: mx + (Math.cos(g) * len) / 2, y1: my + (Math.sin(g) * len) / 2, t0: t };
          break;
        }
        if (!an.meteor) an.nextMeteor = t + 5;
      }
      const M = an.meteor;
      if (M) {
        const e = (t - M.t0) / METEOR;
        if (e > 2) {
          an.meteor = null;
          an.nextMeteor = t + 16 + 26 * Math.random();
        } else if (e < 1.3) {
          const k = clamp(e, 0, 1), k0 = clamp(e - 0.35, 0, 1);
          const sx = (x: number) => (x - ox) * s, sy = (y: number) => (y - oy) * s;
          streak(sx(lerp(M.x0, M.x1, k0)), sy(lerp(M.y0, M.y1, k0)), sx(lerp(M.x0, M.x1, k)), sy(lerp(M.y0, M.y1, k)), `rgb(${SK})`, 1.8, e > 0.8 ? clamp(1 - (e - 0.8) / 0.5, 0, 1) : 1);
        }
      }
      ctx.globalAlpha = 1;

      // 左上角的讀數：描星的進度、曝光的時間
      const rd = readRef.current;
      if (rd) {
        let txt = "";
        if (intro) {
          let lo = 0, hi = angles.length;
          while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (angles[mid] <= front) lo = mid + 1;
            else hi = mid;
          }
          txt = `PLOTTING ${pad(lo)} / ${pad(angles.length)} // ${chart.title} ${chart.year}`;
        } else if (an.expo >= 0 && t - an.expo < EXPO + 1) {
          const m = Math.round((phi / TAU) * SIDEREAL);
          txt = `EXPOSURE ${pad(Math.floor(m / 60), 2)}h${pad(m % 60, 2)}m / 23h56m // 一個恆星日`;
        }
        if (rd.textContent !== txt) rd.textContent = txt;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [sky, stars, chart, cx, cy, edge, R]);

  // 觸控板捏合（ctrl＋滾輪）縮放；一般的滾輪留給頁面捲動
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const b = el.getBoundingClientRect(), c = camRef.current;
      const fx = (e.clientX - b.left) / b.width, fy = (e.clientY - b.top) / b.height;
      const X = c.x - c.w / 2 + fx * c.w, Y = c.y - c.w / 2 + fy * c.w;
      const w = clamp(c.w * Math.exp(e.deltaY * 0.012), (2 * R) / 8, 2 * R);
      anim.current.fly = null;
      cb.current.cam({ w, x: X - fx * w + w / 2, y: Y - fy * w + w / 2 });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cb.current.esc();
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [R]);

  // 螢幕座標 → 圖上座標，找最近的名詞星
  const locate = (e: { clientX: number; clientY: number; currentTarget: Element }) => {
    const b = e.currentTarget.getBoundingClientRect(), c = camRef.current;
    const x = c.x - c.w / 2 + ((e.clientX - b.left) / b.width) * c.w, y = c.y - c.w / 2 + ((e.clientY - b.top) / b.height) * c.w;
    let best: Star | undefined, bd = ((c.w / b.width) * 16) ** 2;
    for (const s of stars) {
      const dd = (s.x - x) ** 2 + (s.y - y) ** 2;
      if (dd < bd) [best, bd] = [s, dd];
    }
    return { x, y, best };
  };
  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    if (mode !== "idle") return;
    const { x, y, best } = locate(e);
    // 接到流星：帶你去它落下的地方
    const M = anim.current.meteor;
    if (M) {
      const k = clamp((now() - M.t0) / METEOR, 0, 1);
      if (now() - M.t0 < METEOR * 2 && segDist(x, y, M.x0, M.y0, lerp(M.x0, M.x1, k), lerp(M.y0, M.y1, k)) < 30 * uz) {
        const land = stars.reduce((b, s) => ((s.x - M.x1) ** 2 + (s.y - M.y1) ** 2 < (b.x - M.x1) ** 2 + (b.y - M.y1) ** 2 ? s : b), stars[0]);
        Object.assign(anim.current, { meteor: null, nextMeteor: now() + 20 });
        setToast({ key: Date.now(), head: "METEOR CAUGHT", text: `落在 KS-${pad(land.n)} ${land.term.name}`, color: land.color });
        return select(land.id);
      }
    }
    if (best) return A && near.some((x) => x.other === best.id) ? jump(best.id) : select(best.id);
    if (A) return setPicked(null);
    if (zoomed) flyTo(HOME);
  };

  const reveal = pt && mode === "idle" ? stars.filter((s) => (s.x - pt.x) ** 2 + (s.y - pt.y) ** 2 < (90 * uz) ** 2) : [];
  const fs = (px: number) => ({ fontSize: px * uz, strokeWidth: 3.5 * uz });
  const out = (px: number) => Math.min(px * uz, (px / 24) * 0.085 * edge); // 外圈文字離圓多遠：手機上要限制在畫面裡
  const ring = (s: Star, r: number, cls: string, color?: string) => (
    <circle key={`${cls}-${s.id}`} cx={s.x} cy={s.y} r={r * uz} strokeWidth={1.2 * uz} className={cls} style={color ? { stroke: color } : undefined} />
  );
  // 一門課占的方位：外圈一段弧線＋標籤
  const sectorArc = (S: Subject) => {
    const [a0, a1] = sectors.get(S.id)!;
    const [tx, ty] = polar(cx, cy, edge + out(44), (a0 + a1) / 2);
    return (
      <g key={`sec-${S.id}`} className="sector" style={{ ["--c" as string]: courseColor(S.id) }}>
        <path d={arc(cx, cy, edge + out(8), a0 - 0.03, a1 + 0.03)} strokeWidth={2 * uz} />
        <text x={tx} y={ty} dy="0.35em" textAnchor="middle" style={fs(10)}>
          [{TAG[S.id] ?? S.id}]
        </text>
      </g>
    );
  };
  // 連到畫面外的星：在畫面邊緣放一個箭頭，點了就飛過去
  const pointer = (Bs: Star, gold: boolean) => {
    if (!A) return null;
    const o = inView(A.x, A.y) ? A : { x: cam.x, y: cam.y };
    const dx = Bs.x - o.x, dy = Bs.y - o.y, ins = 26 * uz;
    const tx = dx > 0 ? (vx1 - ins - o.x) / dx : dx < 0 ? (vx0 + ins - o.x) / dx : Infinity;
    const ty = dy > 0 ? (vy1 - ins - o.y) / dy : dy < 0 ? (vy0 + ins - o.y) / dy : Infinity;
    const k = Math.max(0, Math.min(tx, ty)), L = Math.hypot(dx, dy) || 1, [ux, uy] = [dx / L, dy / L];
    const [px, py] = [o.x + dx * k, o.y + dy * k];
    const side = tx < ty ? (dx > 0 ? "end" : "start") : "middle";
    const [lx, ly] = side === "middle" ? [px, py + (dy > 0 ? -14 : 20) * uz] : [px - ux * 4 * uz + (dx > 0 ? -12 : 12) * uz, py + 4 * uz];
    const tri = `M${px + ux * 8 * uz},${py + uy * 8 * uz}L${px - ux * 3 * uz - uy * 5 * uz},${py - uy * 3 * uz + ux * 5 * uz}L${px - ux * 3 * uz + uy * 5 * uz},${py - uy * 3 * uz - ux * 5 * uz}Z`;
    return (
      <g
        key={`ptr-${Bs.id}`}
        className={`ptr ${gold ? "concept" : "same"}`}
        onClick={(e) => {
          e.stopPropagation();
          jump(Bs.id);
        }}
      >
        <circle cx={px} cy={py} r={16 * uz} className="hit" />
        <path d={tri} />
        <text x={lx} y={ly} textAnchor={side} style={fs(11)}>
          {Bs.term.name}
          <tspan className="tag" dx={4 * uz}>
            {TAG[Bs.subj.id]}
          </tspan>
        </text>
      </g>
    );
  };
  const focusS = focus ? data.subjects.find((x) => x.id === focus) : undefined;
  // 放大時浮出名字：先放重要的，和已經放好的字（或右上角按鈕）疊到就不放，游標移過去還是看得到
  type Box = [number, number, number, number];
  const textW = (s: string, px: number) => Array.from(s).reduce((a, c) => a + (c.codePointAt(0)! > 0x2e80 ? 1 : 0.56), 0) * px * uz;
  const boxAt = (x: number, y: number, s: string, px: number): Box => [x, y - px * 0.9 * uz, x + textW(s, px), y + px * 0.3 * uz];
  const taken: Box[] = [[vx1 - 250 * uz, vy0, vx1, vy0 + 44 * uz]];
  // 目前這顆星的名字太靠右會被切掉，就改放左邊
  const flip = !!A && A.x + 24 * uz + textW(A.term.name, 13.5) > vx1 - 6 * uz;
  const place = (b: Box) => {
    if (taken.some((o) => b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1])) return false;
    taken.push(b);
    return true;
  };
  if (A) {
    place([A.x - 22 * uz, A.y - 22 * uz, A.x + 22 * uz, A.y + 22 * uz]); // 準星
    const w = textW(A.term.name, 13.5);
    place(flip ? [A.x - 24 * uz - w, A.y - 22 * uz, A.x - 24 * uz, A.y - 6 * uz] : boxAt(A.x + 24 * uz, A.y - 10 * uz, A.term.name, 13.5));
    for (const { other } of near) {
      const B = byId.get(other)!;
      if (inView(B.x, B.y, 10 * uz)) place(boxAt(B.x + 11 * uz, B.y + 4 * uz, B.term.name, 12));
    }
  }
  if (Hv) place(boxAt(Hv.x + 10 * uz, Hv.y - 8 * uz, Hv.term.name, 12));
  const d2A = (t: { x: number; y: number }) => (A ? (t.x - A.x) ** 2 + (t.y - A.y) ** 2 : 0);
  const mates =
    A && Z >= 1.8
      ? [...A.ch.terms]
          .filter((t) => t.i !== A.term.i && t.name !== Hv?.term.name)
          .sort((p, r) => d2A(p) - d2A(r))
          .filter((t) => place(boxAt(t.x + 7 * uz, t.y + 3.5 * uz, t.name, 10.5)))
      : [];
  const named = Z >= 2.4 && !A ? stars.filter((s) => s !== Hv && inView(s.x, s.y) && place(boxAt(s.x + 6 * uz, s.y + 3.5 * uz, s.term.name, 10))) : [];
  const step = A ? Math.min(0.07, 1.2 / A.ch.terms.length) : 0;

  const catalog = useMemo(
    () => (
      <section className="sm-index">
        <h2 className="font-mono-label">&gt; catalog // 全部名詞</h2>
        {data.subjects.map((S) => (
          <details key={S.id}>
            <summary>
              <span className="font-mono-label">[{TAG[S.id] ?? S.id}]</span> {S.name}
              <span className="font-mono-label n">{S.chapters.reduce((a, c) => a + c.terms.length, 0)}</span>
            </summary>
            {S.chapters.map((ch) => (
              <p key={ch.page}>
                <Link href={`${ch.url}#先認識的名詞`} className="font-mono-label">
                  {ch.code}
                </Link>{" "}
                {ch.terms.map((t) => t.name).join("、")}
              </p>
            ))}
          </details>
        ))}
      </section>
    ),
    [data],
  );

  return (
    <div className="sm-wrap">
      <div className="sm-stage">
        <div className="sm-tools">
          <span className="font-mono-label">&gt; find</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="名詞，例如：糜稜岩、平衡、光" aria-label="搜尋名詞" />
          <span className="font-mono-label sm-count">{query ? `${hits.length} HIT` : `SEEN ${seen.size}/${stars.length} · CONST ${done.length}/${nCh}`}</span>
        </div>
        {query && hits.length > 0 && (
          <ul className="sm-hits">
            {hits.slice(0, 10).map((h) => (
              <li key={h.id}>
                <button type="button" onClick={() => select(h.id)} aria-pressed={picked === h.id}>
                  {h.term.name}
                  <span className="font-mono-label">
                    {TAG[h.subj.id]} {h.ch.code}
                  </span>
                </button>
              </li>
            ))}
            {hits.length > 10 && <li className="font-mono-label sm-more">+{hits.length - 10}</li>}
          </ul>
        )}

        <div className="sm-frame">
          <i className="c tl" />
          <i className="c tr" />
          <i className="c bl" />
          <i className="c br" />
          <div className="sm-box" ref={boxRef}>
            <canvas ref={cvRef} className="sm-cv" aria-hidden />
            <svg
              ref={svgRef}
              viewBox={`${vx0} ${vy0} ${cam.w} ${cam.w}`}
              className={`sm-svg${mode !== "idle" ? " hide" : ""}${zoomed ? " zoomed" : ""}`}
              style={{ touchAction: zoomed ? "none" : "manipulation" }}
              role="img"
              aria-label={`知識星圖：星的排列照 ${chart.year} 年的〈${chart.title}〉，北極在中心；選一顆星，鏡頭飛進同一頁名詞連成的星座，跨科相關的名詞連線過來`}
              onPointerDown={(e) => {
                drag.current = { x: e.clientX, y: e.clientY, cam: camRef.current, moved: false };
                dragged.current = false;
              }}
              onPointerMove={(e) => {
                const d = drag.current;
                if (d && zoomed && mode === "idle") {
                  const dx = e.clientX - d.x, dy = e.clientY - d.y;
                  if (!d.moved && Math.hypot(dx, dy) > 6) {
                    d.moved = dragged.current = true;
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }
                  if (d.moved) {
                    const k = d.cam.w / e.currentTarget.getBoundingClientRect().width;
                    anim.current.fly = null;
                    setCam(fit({ x: d.cam.x - dx * k, y: d.cam.y - dy * k, w: d.cam.w }));
                    setHover(null);
                    return;
                  }
                }
                if (mode !== "idle") return;
                const { x, y, best } = locate(e);
                setPt({ x, y });
                setHover(best?.id ?? null);
              }}
              onPointerUp={() => (drag.current = null)}
              onPointerCancel={() => (drag.current = null)}
              onPointerLeave={() => {
                setPt(null);
                setHover(null);
              }}
              onClick={onClick}
            >
              <g className="sm-overlay">
                {named.length <= 80 &&
                  named.map((s) => (
                    <text key={`n-${s.id}`} x={s.x + 6 * uz} y={s.y + 3.5 * uz} className="lab dim" style={fs(10)}>
                      {s.term.name}
                    </text>
                  ))}
                {reveal.map((s) => ring(s, 6, "near"))}
                {focusS && (
                  <g>
                    {sectorArc(focusS)}
                    {stars.filter((s) => s.subj === focusS).map((s) => ring(s, 6, "focus", s.color))}
                  </g>
                )}
                {hits.map((h) => ring(h, 9, "hitring"))}
                {A && (
                  <g>
                    {(() => {
                      const [rx, ry] = polar(cx, cy, edge, A.a);
                      const right = rx >= cx;
                      return (
                        <g className="polar">
                          <line x1={cx} y1={cy} x2={rx} y2={ry} strokeWidth={uz} strokeDasharray={`${2 * uz} ${4 * uz}`} />
                          <circle cx={cx} cy={cy} r={A.rho * edge} strokeWidth={uz} strokeDasharray={`${2 * uz} ${4 * uz}`} />
                          {!zoomed && (
                            <text x={rx + (right ? -8 : 8) * uz} y={ry + (ry > cy ? -8 : 16) * uz} textAnchor={right ? "end" : "start"} className="read" style={fs(10)}>
                              θ {deg(A.a)} · ρ {A.rho.toFixed(2)}
                            </text>
                          )}
                        </g>
                      );
                    })()}
                    {focusS !== A.subj && sectorArc(A.subj)}
                    {/* 星座：照最小生成樹的順序一條一條畫出來，星一顆一顆點亮 */}
                    <g key={A.ch.url} className={toast?.head === "CONSTELLATION COMPLETE" && done.includes(A.ch) ? "flash" : undefined}>
                      {A.ch.edges.map(([i, j], k) => {
                        const p = A.ch.terms[i], r = A.ch.terms[j];
                        return <path key={`${i}-${j}`} d={`M${p.x},${p.y}L${r.x},${r.y}`} pathLength={1} className="con" strokeWidth={1.3 * uz} style={{ stroke: A.color, animationDelay: `${0.3 + k * step}s` }} />;
                      })}
                      {A.ch.terms.map((t) => (
                        <circle key={t.i} cx={t.x} cy={t.y} r={dot(t.r) + 0.8 * uz} className="ign" style={{ fill: A.color, animationDelay: `${0.3 + t.i * step}s` }} />
                      ))}
                    </g>
                    {mates.map((t) => (
                      <text key={`m-${t.i}`} x={t.x + 7 * uz} y={t.y + 3.5 * uz} className="lab mate" style={fs(10.5)}>
                        {t.name}
                      </text>
                    ))}
                    {near.map(({ other, link }) => {
                      const B = byId.get(other)!;
                      const vis = inView(B.x, B.y, 10 * uz);
                      return (
                        <g key={other}>
                          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={`link ${link.kind}`} strokeWidth={1.4 * uz} strokeDasharray={link.kind === "same" ? `${4 * uz} ${3 * uz}` : undefined} />
                          {vis ? (
                            <>
                              <circle cx={B.x} cy={B.y} r={dot(B.r) + uz} style={{ fill: B.color }} />
                              {ring(B, 8, "ring")}
                              <text x={B.x + 11 * uz} y={B.y + 4 * uz} className="lab" style={fs(12)}>
                                {B.term.name}
                              </text>
                            </>
                          ) : (
                            pointer(B, link.kind === "concept")
                          )}
                        </g>
                      );
                    })}
                    <circle cx={A.x} cy={A.y} r={dot(A.r) + 1.5 * uz} style={{ fill: A.color }} />
                    <circle cx={A.x} cy={A.y} r={12 * uz} strokeWidth={1.5 * uz} className="pulse" />
                    <path
                      d={[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `M${A.x + sx * 20 * uz},${A.y + sy * 13 * uz}v${sy * 7 * uz}h${-sx * 7 * uz}`).join("")}
                      className="bracket"
                      strokeWidth={1.5 * uz}
                    />
                    <text x={A.x + (flip ? -24 : 24) * uz} y={A.y - 10 * uz} textAnchor={flip ? "end" : "start"} className="lab cur" style={fs(13.5)}>
                      {A.term.name}
                    </text>
                  </g>
                )}
                {Hv && (
                  <g>
                    {ring(Hv, 7, "hov")}
                    <text x={Hv.x + 10 * uz} y={Hv.y - 8 * uz} className="lab" style={fs(12)}>
                      {Hv.term.name}
                    </text>
                  </g>
                )}
              </g>
            </svg>
            <p className="sm-read font-mono-label" ref={readRef} aria-hidden />
            <div className="sm-ctl font-mono-label">
              {!reduced && (
                <button type="button" onClick={expose} disabled={mode !== "idle"} title="長時間曝光：星空繞北極轉一整圈（一個恆星日），留下星軌">
                  ◐ 曝光
                </button>
              )}
              <button type="button" onClick={() => flyTo({ ...camRef.current, w: camRef.current.w / 1.8 }, 0.5)} aria-label="放大" disabled={Z >= 7.9}>
                ＋
              </button>
              <button type="button" onClick={() => flyTo({ ...camRef.current, w: camRef.current.w * 1.8 }, 0.5)} aria-label="縮小" disabled={!zoomed}>
                －
              </button>
              <button type="button" onClick={() => flyTo(HOME)} disabled={!zoomed}>
                ⤢ 全天
              </button>
              {zoomed && <span>×{Z.toFixed(1)}</span>}
            </div>
            {toast && (
              <p key={toast.key} className="sm-toast font-mono-label" style={{ ["--c" as string]: toast.color }}>
                <b>{toast.head}</b> {toast.text}
              </p>
            )}
            {A && mode === "idle" && (
              <button type="button" className="sm-cap" style={{ ["--c" as string]: A.color }} onClick={() => hudRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })}>
                <span className="font-mono-label">
                  [{TAG[A.subj.id]}] {A.ch.code}
                </span>
                <b>{A.term.name}</b>
                <span className="d">{A.term.desc}</span>
                <span className="font-mono-label">↓</span>
              </button>
            )}
          </div>
        </div>
        <div className="sm-foot font-mono-label">
          <span className="sm-legend">
            {data.subjects.map((S) => (
              <button
                key={S.id}
                type="button"
                style={{ ["--c" as string]: courseColor(S.id) }}
                aria-pressed={focus === S.id}
                onMouseEnter={() => setFocus(S.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(S.id)}
                onBlur={() => setFocus(null)}
                onClick={() => setFocus((f) => (f === S.id ? null : S.id))}
              >
                <i /> {TAG[S.id] ?? S.id} <span>{S.chapters.reduce((a, c) => a + c.terms.length, 0)}</span>
              </button>
            ))}
          </span>
          <span>
            <i className="ln concept" /> 跨科概念 <i className="ln same" /> 同一個名詞 <i className="sp" /> 有連線的星
          </span>
        </div>
        <p className="sm-credit">
          星的位置取自{chart.author}〈{chart.title}〉（{chart.year}），{chart.credit}（
          <a href={chart.source} target="_blank" rel="noopener noreferrer">
            京都大学貴重資料デジタルアーカイブ
          </a>
          ）。
        </p>
      </div>

      <aside className="sm-hud" aria-live="polite" ref={hudRef}>
        <i className="c tl" />
        <i className="c br" />
        {A ? (
          <div key={A.id} className="sm-swap">
            <p className="font-mono-label sm-cat">
              <Scramble text={`KS-${pad(A.n)} // θ ${deg(A.a)} ρ ${A.rho.toFixed(2)}`} />
            </p>
            <p className="font-mono-label sm-path" style={{ ["--c" as string]: A.color }}>
              <i /> {A.subj.name} {"//"} {A.ch.code} {A.ch.title}
            </p>
            <h2>
              <Scramble text={A.term.name} />
            </h2>
            <p className="sm-desc">{A.term.desc}</p>
            {(() => {
              const got = A.ch.terms.filter((t) => seen.has(`${A.subj.id}/${A.ch.page}#${t.i}`)).length;
              return (
                <p className="font-mono-label sm-prog" style={{ ["--c" as string]: A.color }}>
                  <span>
                    {A.ch.code} 星座 {got}/{A.ch.terms.length}
                  </span>
                  <i style={{ ["--k" as string]: got / A.ch.terms.length }} />
                </p>
              );
            })()}
            {near.length > 0 ? (
              <>
                <p className="font-mono-label sm-sec">&gt; linked {near.length} // 點了沿著連線飛過去</p>
                <ul className="sm-rel">
                  {near.map(({ other, link }) => {
                    const B = byId.get(other)!;
                    return (
                      <li key={other}>
                        <button type="button" onClick={() => jump(other)} style={{ ["--c" as string]: B.color }}>
                          <span className="font-mono-label">
                            {link.kind === "concept" ? "◆" : "◇"} {B.subj.name} {B.ch.code}
                          </span>
                          <b>{B.term.name}</b>
                          <span className="why">{link.why ?? "同一個名詞，另一門課也教過。"}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="font-mono-label sm-sec">&gt; linked 0 {"//"} 同一頁的名詞連成星座</p>
            )}
            <Link href={`${A.ch.url}#先認識的名詞`} className="sm-go font-mono-label">
              open {A.ch.page} →
            </Link>
          </div>
        ) : (
          <div className="sm-idle">
            <p className="font-mono-label sm-cat">&gt; sky.status</p>
            <p>
              星的排列照 {chart.year} 年的〈{chart.title}〉：北極在中心，越往外越南，外圈是十二支方位。圖上 {chart.nPoints} 顆星裡，<b>{stars.length}</b> 顆放了筆記的名詞，一門課占一個方位。
            </p>
            <p>點一顆星，鏡頭會飛進那一頁筆記的星座；跨科的連線（共 <b>{data.links.length}</b> 條）點下去，會沿著線飛到另一門課。</p>
            <p>
              點過的星會留著光；一頁的名詞全部點過，星座就完成，線會留在天上。按 <b>◐ 曝光</b>，星空繞北極轉一整圈，留下星軌。偶爾會有流星，點得到它，就帶你去它落下的地方。
            </p>
            <p className="font-mono-label sm-gen">
              SEEN {seen.size}/{stars.length} · CONST {done.length}/{nCh} {"//"} updated {data.generated}
              {seen.size > 0 && (
                <button
                  type="button"
                  className="sm-reset"
                  onClick={() => {
                    const n = new Set<string>();
                    seenRef.current = n;
                    setSeen(n);
                    try {
                      localStorage.removeItem(STORE);
                    } catch {}
                  }}
                >
                  reset
                </button>
              )}
            </p>
          </div>
        )}
      </aside>

      {catalog}
    </div>
  );
}
