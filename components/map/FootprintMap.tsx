"use client";

// 帶著飲料出門の足跡地圖（設計稿：~/Desktop/網站新風格設計稿/足跡地圖設計稿v1.html）
// 地圖是 SVG，縣市路徑來自 data/map/taiwan-map.json；互動直接操作 DOM，
// 因為放大時每一格動畫都要依縮放重畫打卡點，交給 React 重算反而卡
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export type CheckIn = {
  id: string;
  name: string;
  cat: "trip" | "life" | "work" | "wild";
  /** 2026-08-20、只有年份 2025，或空字串（日期待補） */
  date: string;
  lat: number;
  lng: number;
  county: string;
  text?: string;
  /** 打卡照片（/img/places/<代號>/1.jpg…） */
  photos?: string[];
  /** 短片（/img/places/<代號>/video.mp4） */
  videos?: string[];
  /** YouTube 影片 id */
  youtube?: string;
  link?: { label: string; href: string };
};

type Proj = { lng0: number; lat1: number; k: number; ox?: number; oy?: number };
type MapData = {
  proj: Proj & { C: number };
  insets: Record<string, Proj & { box: number[]; label: string }>;
  counties: { name: string; en: string; d: string; inset?: boolean }[];
};

// 四種分類：○ 旅行、□ 生活、◇ 出差、△ 野外
const CAT = {
  trip: { zh: "旅行", color: "var(--orange)" },
  life: { zh: "生活", color: "var(--gold)" },
  work: { zh: "出差", color: "var(--cream)" },
  wild: { zh: "野外", color: "var(--teal)" },
} as const;
const CATS = Object.keys(CAT) as CheckIn["cat"][];

const PIN = 7; // 打卡點在螢幕上的大小（像素，不隨縮放改變）
const LIST_LIMIT = 8; // 清單先列幾筆
const TOTAL = 22; // 台灣縣市數

const fmtDate = (d: string) => (d ? d.replace(/-/g, ".") : "日期待補");
const byDate = (a: CheckIn, b: CheckIn) =>
  (b.date || "0").localeCompare(a.date || "0");

function shapeAttrs(
  cat: CheckIn["cat"],
  x: number,
  y: number,
  s: number,
): [string, Record<string, string | number>] {
  if (cat === "trip") return ["circle", { cx: x, cy: y, r: s * 0.55 }];
  if (cat === "life")
    return ["rect", { x: x - s / 2, y: y - s / 2, width: s, height: s }];
  if (cat === "work")
    return [
      "path",
      {
        d: `M${x} ${y - s * 0.68}L${x + s * 0.68} ${y}L${x} ${y + s * 0.68}L${x - s * 0.68} ${y}Z`,
      },
    ];
  return [
    "path",
    { d: `M${x} ${y - s * 0.62}L${x + s * 0.62} ${y + s * 0.45}H${x - s * 0.62}Z` },
  ];
}

function Shape({ cat }: { cat: CheckIn["cat"] }) {
  const [tag, a] = shapeAttrs(cat, 8, 8, 12);
  const props = {
    ...a,
    fill: CAT[cat].color,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      {tag === "circle" ? (
        <circle {...props} />
      ) : tag === "rect" ? (
        <rect {...props} />
      ) : (
        <path {...props} />
      )}
    </svg>
  );
}

export default function FootprintMap({
  checkins,
  map,
}: {
  checkins: CheckIn[];
  map: MapData;
}) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const visited = new Set(checkins.map((c) => c.county));
  const countByCat = (c: CheckIn["cat"]) =>
    checkins.filter((x) => x.cat === c).length;

  useEffect(() => {
    const el = root.current!;
    const $ = <T extends Element = HTMLElement>(sel: string) =>
      el.querySelector(sel) as unknown as T;
    const NS = "http://www.w3.org/2000/svg";
    const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(
      t: EventTarget,
      type: K | string,
      fn: (e: any) => void,
    ) => {
      t.addEventListener(type, fn);
      cleanups.push(() => t.removeEventListener(type, fn));
    };
    const svgEl = (
      t: string,
      a: Record<string, string | number> = {},
      p?: Element,
    ) => {
      const e = document.createElementNS(NS, t);
      for (const k in a) e.setAttribute(k, String(a[k]));
      if (p) p.appendChild(e);
      return e as SVGGraphicsElement;
    };
    const proj = (county: string, lng: number, lat: number) => {
      const p: Proj = map.insets[county] || map.proj;
      return [
        (lng - p.lng0) * map.proj.C * p.k + (p.ox || 0),
        (p.lat1 - lat) * p.k + (p.oy || 0),
      ];
    };

    const svg = $<SVGSVGElement>(".fm-map");
    const mapbox = $(".fm-mapbox");
    const ghostName = $(".fm-ghost b");
    const ghostMeta = $(".fm-ghost span");
    const list = $(".fm-list");
    const more = $<HTMLButtonElement>(".fm-more");
    const card = $(".fm-card");
    const cardBody = $(".fm-card-body");
    svg.replaceChildren();

    const FULL = [-10, -10, 620, 825];
    let vb = [...FULL];
    let focus: string | null = null;
    const cats = new Set<string>(CATS);
    let showAll = false;
    let selected: CheckIn | null = null;
    let popNext = true;

    const gInsets = svgEl("g", {}, svg);
    const gCounties = svgEl("g", {}, svg);
    const gPins = svgEl("g", {}, svg);

    // ---------- 故障風（同首頁 app/home.css 的 hm-rgb／hm-swap／空心字亂碼） ----------
    const POOL = [
      ...new Set(map.counties.map((c) => c.name).join("") + "▚▞▙▟"),
    ];
    const glyph = () => POOL[(Math.random() * POOL.length) | 0];
    const scrambling = new Map<Element, number>();
    function scramble(node: HTMLElement, text: string) {
      node.dataset.c = text;
      window.clearInterval(scrambling.get(node));
      if (REDUCE || !text) {
        node.textContent = text;
        return;
      }
      let k = 0;
      const id = window.setInterval(() => {
        if (k++ >= 3) {
          window.clearInterval(id);
          scrambling.delete(node);
          node.textContent = text;
          return;
        }
        node.textContent = [...text]
          .map(() => (Math.random() < 0.6 ? glyph() : ""))
          .join("");
      }, 70);
      scrambling.set(node, id);
    }
    // 縣市名偶爾訊號不良：隨機一個字閃一下
    timers.push(
      window.setInterval(() => {
        const text = ghostName.dataset.c;
        if (REDUCE || !text || scrambling.has(ghostName)) return;
        const i = (Math.random() * text.length) | 0;
        ghostName.textContent = [...text]
          .map((c, j) => (j === i ? glyph() : c))
          .join("");
        window.setTimeout(() => (ghostName.textContent = ghostName.dataset.c ?? ""), 150);
      }, 700),
    );
    // 標題偶爾錯位（同首頁：2.4～5.2 秒一次）
    const title = $(".fm-title");
    let titleTimer = 0;
    const glitchTitle = () => {
      title.classList.remove("fm-glitching");
      void title.offsetWidth;
      title.classList.add("fm-glitching");
      titleTimer = window.setTimeout(glitchTitle, 2400 + Math.random() * 2800);
    };
    if (!REDUCE) titleTimer = window.setTimeout(glitchTitle, 2000);
    const swap = (n: Element) => {
      if (REDUCE) return;
      n.classList.remove("fm-swap");
      void (n as HTMLElement).getBoundingClientRect();
      n.classList.add("fm-swap");
    };
    // 滑過縣市：橘、青兩色輪廓錯位閃一下
    function rgbGlitch(p: Element) {
      if (REDUCE) return;
      const dx = 3 * unit();
      for (const [cls, sign] of [["a", 1], ["b", -1]] as const) {
        const e = svgEl(
          "path",
          { class: "fm-rgb " + cls, d: p.getAttribute("d")!, style: `--dx:${dx * sign}px` },
          gCounties,
        );
        window.setTimeout(() => e.remove(), 420);
      }
    }

    // ---------- 金門、馬祖小框 ----------
    for (const ins of Object.values(map.insets)) {
      const g = svgEl("g", { class: "fm-inset" }, gInsets);
      const [x, y, w, h] = ins.box;
      const L = 10;
      svgEl("rect", { class: "frame", x, y, width: w, height: h }, g);
      svgEl(
        "path",
        {
          class: "corner",
          d: `M${x} ${y + L}V${y}H${x + L}M${x + w - L} ${y}H${x + w}V${y + L}M${x} ${y + h - L}V${y + h}H${x + L}M${x + w - L} ${y + h}H${x + w}V${y + h - L}`,
        },
        g,
      );
      svgEl("text", { x: x + 8, y: y + h - 8 }, g).textContent = ins.label;
    }

    // ---------- 縣市：去過的依打卡數變亮，點一下放大 ----------
    const countyEl: Record<string, SVGGraphicsElement> = {};
    const count = (n: string) => checkins.filter((c) => c.county === n).length;
    for (const c of map.counties) {
      const k = count(c.name);
      const p = svgEl("path", { class: "fm-county" + (k ? " on" : ""), d: c.d }, gCounties);
      // 打卡越多越亮：1～2 筆暗金、3～5 筆金、6 筆以上米白
      if (k) p.style.setProperty("--lv", k >= 6 ? "#efe4c8" : k >= 3 ? "#d6a53c" : "#9c834b");
      svgEl("title", {}, p).textContent = c.name;
      on(p, "mouseenter", () => {
        setGhost(c.name);
        rgbGlitch(p);
      });
      on(p, "mouseleave", () => setGhost(focus || selected?.county || null));
      on(p, "click", () => zoomTo(focus === c.name ? null : c.name));
      countyEl[c.name] = p;
    }

    // ---------- 縣市名（地圖上方那一行） ----------
    let ghostNow: string | null = null;
    function setGhost(county: string | null) {
      if (!county) {
        ghostName.textContent = "";
        ghostName.dataset.c = "";
        ghostMeta.innerHTML = "";
        ghostNow = null;
        return;
      }
      const name = county.replace(/[縣市]$/, "");
      if (ghostNow !== county) scramble(ghostName, name);
      ghostNow = county;
      const n = count(county);
      ghostMeta.innerHTML = `<em>${n ? n + " CHECK-IN" : "LOCKED"}</em>`;
    }

    // ---------- 打卡點 ----------
    const unit = () => vb[2] / svg.getBoundingClientRect().width; // 1 螢幕像素＝幾個地圖單位
    function drawPins() {
      const pop = popNext && !REDUCE;
      popNext = false;
      gPins.replaceChildren();
      const u = unit();
      const s = PIN * u;
      // 南邊先畫、北邊疊在上面；選中的最後畫
      const order = [...checkins]
        .sort((a, b) => a.lat - b.lat)
        .sort((a, b) => Number(a === selected) - Number(b === selected));
      const seen: Record<string, number> = {};
      for (const ci of order) {
        let [x, y] = proj(ci.county, ci.lng, ci.lat);
        // 同一個地點去好幾次：繞著原點錯開一點，每個都點得到
        const key = ci.lat.toFixed(4) + "," + ci.lng.toFixed(4);
        const k = (seen[key] = (seen[key] ?? -1) + 1);
        if (k > 0) {
          const a = k * 2.4;
          const r = s * 1.15 * Math.ceil(k / 6);
          x += Math.cos(a) * r;
          y += Math.sin(a) * r;
        }
        const off = !cats.has(ci.cat) || (focus !== null && ci.county !== focus);
        const g = svgEl(
          "g",
          {
            class:
              "fm-pin" +
              (ci === selected ? " active" : "") +
              (off ? " dim" : "") +
              (pop ? " pop" : ""),
            tabindex: off ? -1 : 0,
            role: "button",
            "aria-label": ci.name,
            style: pop ? `--d:${(Math.random() * 450) | 0}ms` : "",
          },
          gPins,
        );
        svgEl("circle", { class: "hit", cx: x, cy: y, r: s * 1.1 }, g);
        svgEl("circle", { class: "ring", cx: x, cy: y, r: s * 0.9 }, g);
        const [tag, a] = shapeAttrs(ci.cat, x, y, s);
        svgEl(tag, { ...a, class: "shape", fill: CAT[ci.cat].color }, g);
        svgEl(
          "text",
          { class: "lbl", x: x + s * 1.3, y: y + s * 0.5, "font-size": 13 * u, "stroke-width": 4 * u },
          g,
        ).textContent = ci.name;
        g.addEventListener("click", (e) => {
          e.stopPropagation();
          select(ci);
        });
        g.addEventListener("keydown", (e) => {
          if ((e as KeyboardEvent).key === "Enter") select(ci);
        });
        g.addEventListener("mouseenter", () => setGhost(ci.county));
      }
    }

    // ---------- 放大縮小：viewBox 平滑移到縣市範圍 ----------
    let raf = 0;
    function zoomTo(county: string | null) {
      focus = county;
      for (const g of [gCounties, gPins]) swap(g);
      mapbox.classList.toggle("zoomed", !!county);
      Object.entries(countyEl).forEach(([n, p]) => p.classList.toggle("focus", n === county));
      let target = FULL;
      if (county) {
        // 留比較多邊距，讓縣市整個落在不淡出的中央
        const b = countyEl[county].getBBox();
        const pad = Math.max(b.width, b.height) * 0.5 + 10;
        let [x, y, w, h] = [b.x - pad, b.y - pad, b.width + pad * 2, b.height + pad * 2];
        const ar = FULL[2] / FULL[3];
        if (w / h > ar) {
          const nh = w / ar;
          y -= (nh - h) / 2;
          h = nh;
        } else {
          const nw = h * ar;
          x -= (nw - w) / 2;
          w = nw;
        }
        target = [x, y, w, h];
      }
      const from = [...vb];
      const t0 = performance.now();
      const dur = REDUCE ? 0 : 550;
      const ease = (k: number) => 1 - Math.pow(1 - k, 3);
      cancelAnimationFrame(raf);
      const step = (now: number) => {
        const k = dur ? Math.min(1, (now - t0) / dur) : 1;
        vb = from.map((v, i) => v + (target[i] - v) * ease(k));
        svg.setAttribute("viewBox", vb.join(" "));
        drawPins();
        if (k < 1) raf = requestAnimationFrame(step);
        else {
          popNext = true; // 放大完成後，點重新閃爍出現
          drawPins();
        }
      };
      raf = requestAnimationFrame(step);
      setGhost(county || selected?.county || null);
      showAll = false;
      renderList();
    }
    on($(".fm-back"), "click", () => zoomTo(null));
    on(window, "keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape" && focus) zoomTo(null);
    });

    // ---------- 圖例：點一下篩選分類 ----------
    el.querySelectorAll<HTMLButtonElement>(".fm-legend button").forEach((b) =>
      on(b, "click", () => {
        const c = b.dataset.cat!;
        if (cats.has(c) && cats.size > 1) cats.delete(c);
        else cats.add(c);
        el.querySelectorAll<HTMLButtonElement>(".fm-legend button").forEach((x) =>
          x.setAttribute("aria-pressed", String(cats.has(x.dataset.cat!))),
        );
        showAll = false;
        drawPins();
        renderList();
      }),
    );

    // ---------- 清單：新到舊；放大縣市時只列那個縣市 ----------
    function renderList() {
      const items = checkins
        .filter((c) => cats.has(c.cat) && (!focus || c.county === focus))
        .sort(byDate);
      $(".fm-listhead b").textContent = focus ? `${focus}的打卡` : "全部打卡";
      $(".fm-listhead span").textContent = `${items.length} 筆`;
      list.replaceChildren();
      for (const ci of showAll ? items : items.slice(0, LIST_LIMIT)) {
        const li = document.createElement("li");
        if (ci === selected) li.className = "active";
        const btn = document.createElement("button");
        btn.style.setProperty("--c", CAT[ci.cat].color);
        const icon = svgEl("svg", { class: "ic", viewBox: "0 0 18 18", "aria-hidden": "true" }, btn);
        const [tag, a] = shapeAttrs(ci.cat, 9, 9, 12);
        svgEl(tag, { ...a, fill: CAT[ci.cat].color, stroke: "currentColor", "stroke-width": 2, "stroke-linejoin": "round" }, icon);
        const d = document.createElement("span");
        d.className = "d";
        d.textContent = fmtDate(ci.date);
        const t = document.createElement("span");
        t.className = "t";
        t.textContent = ci.name;
        const c = document.createElement("span");
        c.className = "c";
        c.textContent = ci.county;
        btn.append(d, t, c);
        btn.addEventListener("click", () => select(ci));
        li.addEventListener("mouseenter", () => setGhost(ci.county));
        li.appendChild(btn);
        list.appendChild(li);
      }
      more.hidden = items.length <= LIST_LIMIT;
      more.textContent = showAll ? "收起 ↑" : `顯示全部 ${items.length} 筆 ↓`;
    }
    on(more, "click", () => {
      showAll = !showAll;
      renderList();
    });

    // ---------- 選取：地圖上的點、清單、卡片一起更新 ----------
    function select(ci: CheckIn) {
      selected = ci;
      cardBody.replaceChildren();
      const m = document.createElement("div");
      m.className = "m";
      m.innerHTML = `CHECK-IN // <em></em>`;
      m.querySelector("em")!.textContent = fmtDate(ci.date);
      const h = document.createElement("h2");
      const where = document.createElement("div");
      where.className = "where";
      where.textContent = `${ci.county} ・ ${CAT[ci.cat].zh} ・ ${ci.lat.toFixed(2)}N ${ci.lng.toFixed(2)}E`;
      // 照片：大圖＋多張時下面一排小圖，點小圖換大圖
      if (ci.photos?.length) {
        const fig = document.createElement("figure");
        fig.className = "fm-photo";
        const img = document.createElement("img");
        img.src = ci.photos[0];
        img.alt = ci.name;
        img.loading = "lazy";
        fig.appendChild(img);
        if (ci.photos.length > 1) {
          const strip = document.createElement("div");
          strip.className = "fm-thumbs";
          ci.photos.forEach((src, i) => {
            const b = document.createElement("button");
            b.type = "button";
            b.setAttribute("aria-label", `第 ${i + 1} 張照片`);
            if (i === 0) b.className = "on";
            const t = document.createElement("img");
            t.src = src;
            t.alt = "";
            t.loading = "lazy";
            b.appendChild(t);
            b.addEventListener("click", () => {
              img.src = src;
              strip.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
              swap(fig);
            });
            strip.appendChild(b);
          });
          fig.appendChild(strip);
        }
        cardBody.append(m, fig, h, where);
      } else cardBody.append(m, h, where);
      // 短片與 YouTube：放在名稱下面
      for (const src of ci.videos ?? []) {
        const v = document.createElement("video");
        v.className = "fm-video";
        v.src = src;
        v.controls = true;
        v.playsInline = true;
        v.preload = "metadata";
        cardBody.appendChild(v);
      }
      if (ci.youtube) {
        const f = document.createElement("iframe");
        f.className = "fm-video";
        f.src = `https://www.youtube-nocookie.com/embed/${ci.youtube}`;
        f.title = `${ci.name}（YouTube）`;
        f.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture";
        f.allowFullscreen = true;
        f.loading = "lazy";
        cardBody.appendChild(f);
      }
      if (ci.text) {
        const p = document.createElement("p");
        p.textContent = ci.text;
        cardBody.appendChild(p);
      }
      if (ci.link) {
        const a = document.createElement("a");
        a.href = ci.link.href;
        a.textContent = `${ci.link.label} →`;
        // 站內連結用 Next 的路由切換，不整頁重載
        if (ci.link.href.startsWith("/"))
          a.addEventListener("click", (e) => {
            e.preventDefault();
            router.push(ci.link!.href);
          });
        cardBody.appendChild(a);
      }
      scramble(h, ci.name);
      swap(card);
      setGhost(ci.county);
      drawPins();
      renderList();
    }

    // ---------- 十字準星＋即時經緯度 ----------
    const hx = $(".fm-hud .hx");
    const hy = $(".fm-hud .hy");
    const hc = $(".fm-hud .hc");
    on(mapbox, "mousemove", (e: MouseEvent) => {
      const r = svg.getBoundingClientRect();
      const b = mapbox.getBoundingClientRect();
      const px = e.clientX - b.left;
      const py = e.clientY - b.top;
      hx.style.top = py + "px";
      hy.style.left = px + "px";
      hc.style.left = px + "px";
      hc.style.top = py + "px";
      const mx = vb[0] + ((e.clientX - r.left) / r.width) * vb[2];
      const my = vb[1] + ((e.clientY - r.top) / r.height) * vb[3];
      const P = map.proj;
      const lng = P.lng0 + mx / (P.C * P.k);
      const lat = P.lat1 - my / P.k;
      hc.innerHTML = `N ${lat.toFixed(4)}° <em>/</em> E ${lng.toFixed(4)}°`;
    });

    on(window, "resize", drawPins);
    // 網址帶 ?place=代號（例如從打卡相簿點「在地圖上看」）：直接選到那個點並放大到它的縣市
    const wanted = new URLSearchParams(window.location.search).get("place");
    const target = checkins.find((c) => c.id === wanted);
    const latest = [...checkins].sort(byDate)[0];
    if (target) {
      select(target);
      zoomTo(target.county);
    } else if (latest) select(latest);
    else {
      drawPins();
      renderList();
    }

    return () => {
      timers.forEach((t) => window.clearInterval(t));
      window.clearTimeout(titleTimer);
      scrambling.forEach((id) => window.clearInterval(id));
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
    };
  }, [checkins, map, router]);

  return (
    <div className="fm" ref={root}>
      <i className="fm-slab" aria-hidden="true" />
      <i className="fm-stripe" aria-hidden="true" />
      <i className="fm-goldline" aria-hidden="true" />

      <div className="fm-left">
        <section className="fm-side">
          <p className="fm-boot font-mono-label">
            &gt; boot footprints.exe
            <br />
            &gt; 載入版圖 ........ {visited.size} / {TOTAL} <b>OK</b>
          </p>
          <p className="fm-kicker font-mono-label">
            [04] FOOTPRINTS {"//"} 帶著飲料出門の
          </p>
          <h1 className="fm-title">
            足跡<em>地圖</em>
          </h1>

          <div className="fm-progress">
            <div className="bar" aria-hidden="true">
              {Array.from({ length: TOTAL }, (_, i) => (
                <i key={i} className={i < visited.size ? "on" : ""} />
              ))}
            </div>
            <p>
              <span className="font-mono-label">版圖 {"//"} TAIWAN</span>
              <b>
                <em>{visited.size}</em> / {TOTAL} 縣市
              </b>
            </p>
          </div>

          <ul className="fm-legend">
            {CATS.map((c) => (
              <li key={c}>
                <button type="button" data-cat={c} aria-pressed="true">
                  <Shape cat={c} />
                  {CAT[c].zh}
                  <span className="font-mono-label">{countByCat(c)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <article className="fm-card" aria-live="polite">
          <i />
          <i />
          <i />
          <i />
          <div className="fm-card-body" />
        </article>

        <section className="fm-side fm-side-list">
          <div className="fm-listhead">
            <b>全部打卡</b>
            <span className="font-mono-label" />
          </div>
          <ol className="fm-list" />
          <button type="button" className="fm-more font-mono-label" hidden />
          <p className="fm-credit font-mono-label">
            縣市界線：內政部國土測繪中心（政府資料開放授權）
            <br />
            via taiwan-atlas {"//"} 簡化成幾何線條
          </p>
        </section>
      </div>

      <section className="fm-mapwrap" aria-label="台灣足跡地圖">
        <div className="fm-mapbox">
          <div className="fm-ctl">
            <button type="button" className="fm-back font-mono-label">
              ← 回到全台
            </button>
          </div>
          <div className="fm-hud" aria-hidden="true">
            <i className="hx" />
            <i className="hy" />
            <span className="hc font-mono-label" />
          </div>
          <div className="fm-ghost" aria-hidden="true">
            <b />
            <span className="font-mono-label" />
          </div>
          <svg className="fm-map" viewBox="-10 -10 620 825" role="img" aria-label="台灣縣市地圖與打卡點" />
        </div>
      </section>
    </div>
  );
}
