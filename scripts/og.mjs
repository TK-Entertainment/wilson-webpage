// 建置前產生分享卡片（Open Graph 圖片），輸出到 public/og/
//
//   node scripts/og.mjs
//
// - 使用 next 內建的 @vercel/og（satori + resvg），不需要額外安裝套件
// - 中文字型：優先讀環境變數 OG_FONT（本機 .ttf/.otf 路徑），
//   否則從 Google Fonts 下載 Noto Sans TC 子集；都拿不到時改產生只有幾何圖形與英文的卡片
// - 任何錯誤都不會中斷建置
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "og");
const require = createRequire(import.meta.url);

const C = {
  paper: "#efece6",
  ink: "#141414",
  red: "#e2342b",
  blue: "#1f4fa3",
  yellow: "#f2c230",
};

const SECTIONS = {
  blog: {
    no: "01",
    label: "來杯好茶の日常碎念",
    latin: "TEA // DAILY NOTES",
    description: "來杯好茶，聊聊生活裡的大小事。",
    color: C.red,
  },
  docs: {
    no: "02",
    label: "來杯咖啡の學習日常",
    latin: "COFFEE // STUDY NOTES",
    description: "來杯咖啡，記下上課筆記與學習心得。",
    color: C.blue,
  },
  gallery: {
    no: "03",
    label: "來杯果汁の生活影像",
    latin: "JUICE // GALLERY",
    description: "來杯果汁，收藏生活裡的照片與影片。",
    color: C.yellow,
  },
};

/* ---------------- 讀取 MDX frontmatter ---------------- */

function parseValue(raw) {
  const v = raw.trim();
  if (v === "") return undefined;
  if (v.startsWith("[") && v.endsWith("]")) {
    return v
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return v.replace(/^["']|["']$/g, "");
}

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};
  if (!m) return data;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):(.*)$/);
    if (kv) data[kv[1]] = parseValue(kv[2]);
  }
  return data;
}

async function walk(dir) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (/\.mdx?$/.test(e.name)) files.push(p);
  }
  return files;
}

async function collect(section) {
  const dir = path.join(root, "content", section);
  const items = [];
  for (const file of await walk(dir)) {
    const data = frontmatter(await fs.readFile(file, "utf8"));
    let slug = path
      .relative(dir, file)
      .replace(/\.mdx?$/, "")
      .split(path.sep)
      .join("/");
    if (section === "docs") slug = slug.replace(/(^|\/)index$/, "");
    if (section === "blog" && data.outside === "true") continue;
    items.push({ slug, ...data });
  }
  return items;
}

/* ---------------- 卡片版面 ---------------- */

const h = (type, style, ...children) => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.flat() },
});
const svg = (w, hgt, ...children) => ({
  type: "svg",
  props: { width: w, height: hgt, viewBox: `0 0 ${w} ${hgt}`, children },
});
const shape = (type, props) => ({ type, props });

function geometry(color) {
  // 右側包浩斯構圖：大圓、方塊、三角形與粗黑線
  return h(
    "div",
    { position: "absolute", right: 0, top: 0, width: 430, height: 630 },
    svg(
      430,
      630,
      shape("rect", { x: 0, y: 0, width: 430, height: 630, fill: C.paper }),
      shape("circle", { cx: 250, cy: 230, r: 165, fill: color }),
      shape("rect", { x: 60, y: 380, width: 170, height: 170, fill: C.ink }),
      shape("polygon", {
        points: "430,330 430,630 160,630",
        fill: color === C.yellow ? C.red : C.yellow,
      }),
      shape("rect", { x: 0, y: 0, width: 14, height: 630, fill: C.ink }),
      shape("rect", { x: 0, y: 350, width: 430, height: 14, fill: C.ink }),
      shape("circle", { cx: 330, cy: 470, r: 34, fill: C.blue }),
    ),
  );
}

function trimText(text, max) {
  const chars = [...(text ?? "")];
  return chars.length > max
    ? chars.slice(0, max - 1).join("") + "…"
    : chars.join("");
}

function card({ color, kicker, title, description, footer, cjk }) {
  const t = trimText(title, 36);
  const len = [...t].length;
  const titleSize = len <= 8 ? 84 : len <= 10 ? 72 : len <= 18 ? 64 : 54;
  return h(
    "div",
    {
      width: 1200,
      height: 630,
      position: "relative",
      background: C.paper,
      color: C.ink,
      fontFamily: cjk ? "TC, Mono" : "Mono",
    },
    // 左上色塊與頂部粗線
    h("div", {
      position: "absolute",
      left: 0,
      top: 0,
      width: 1200,
      height: 22,
      background: C.ink,
    }),
    h("div", {
      position: "absolute",
      left: 0,
      top: 22,
      width: 22,
      height: 608,
      background: color,
    }),
    geometry(color),
    h(
      "div",
      {
        position: "absolute",
        left: 70,
        top: 70,
        width: 680,
        height: 500,
        flexDirection: "column",
        justifyContent: "space-between",
      },
      h(
        "div",
        { flexDirection: "column" },
        h(
          "div",
          {
            fontFamily: "Mono",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            alignItems: "center",
          },
          h("div", {
            width: 26,
            height: 26,
            background: color,
            marginRight: 14,
          }),
          kicker,
        ),
        h(
          "div",
          {
            marginTop: 30,
            fontSize: titleSize,
            fontWeight: 900,
            lineHeight: 1.15,
            flexWrap: "wrap",
          },
          t,
        ),
        description
          ? h(
              "div",
              {
                marginTop: 24,
                fontSize: 30,
                lineHeight: 1.45,
                fontWeight: 500,
              },
              trimText(description, 60),
            )
          : [],
      ),
      h(
        "div",
        {
          borderTop: `8px solid ${C.ink}`,
          paddingTop: 18,
          fontFamily: "Mono",
          fontSize: 24,
          fontWeight: 700,
          justifyContent: "space-between",
        },
        h("div", {}, "WILSON.TRYGONG.UK"),
        h("div", {}, footer ?? ""),
      ),
    ),
  );
}

/* ---------------- 字型 ---------------- */

const UA =
  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0"; // 舊瀏覽器 UA：Google 回傳 ttf/woff（satori 不支援 woff2）

async function googleFont(family, weight, text) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}${
    text ? `&text=${encodeURIComponent(text)}` : ""
  }`;
  const css = await (
    await fetch(url, { headers: { "User-Agent": UA } })
  ).text();
  const src = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype|woff)'\)/,
  );
  if (!src) throw new Error(`找不到字型 ${family}`);
  const res = await fetch(src[1]);
  if (!res.ok) throw new Error(`下載字型失敗 ${family}`);
  return Buffer.from(await res.arrayBuffer());
}

async function loadFonts(allText) {
  const fonts = [];
  // 英文等寬標籤：Space Mono，拿不到就用 next 內建的 Noto Sans（latin）
  try {
    fonts.push({
      name: "Mono",
      data: await googleFont("Space+Mono", 700),
      weight: 700,
    });
  } catch {
    const ogDir = path.dirname(
      require.resolve("next/dist/compiled/@vercel/og/package.json"),
    );
    fonts.push({
      name: "Mono",
      data: await fs.readFile(
        path.join(ogDir, "noto-sans-v27-latin-regular.ttf"),
      ),
      weight: 700,
    });
  }

  if (process.env.OG_FONT) {
    try {
      const data = await fs.readFile(process.env.OG_FONT);
      if (!/\.ttc$/i.test(process.env.OG_FONT)) {
        fonts.push(
          { name: "TC", data, weight: 900 },
          { name: "TC", data, weight: 500 },
        );
        return { fonts, cjk: true };
      }
      console.warn("[og] OG_FONT 不支援 .ttc，改從 Google Fonts 下載");
    } catch (e) {
      console.warn(`[og] 讀不到 OG_FONT：${e.message}`);
    }
  }

  try {
    // 只下載用得到的字（子集），字太多時分批，satori 會在多個字型間逐字回退
    const chars = [...new Set([...allText])].filter((c) => c.trim()).join("");
    const chunks = [];
    const all = [...chars];
    for (let i = 0; i < all.length; i += 400)
      chunks.push(all.slice(i, i + 400).join(""));
    for (const chunk of chunks) {
      fonts.push(
        {
          name: "TC",
          data: await googleFont("Noto+Sans+TC", 900, chunk),
          weight: 900,
        },
        {
          name: "TC",
          data: await googleFont("Noto+Sans+TC", 500, chunk),
          weight: 500,
        },
      );
    }
    return { fonts, cjk: true };
  } catch (e) {
    console.warn(`[og] 無法取得中文字型（${e.message}），改用純幾何卡片`);
    return { fonts, cjk: false };
  }
}

/* ---------------- 主程式 ---------------- */

const fmtDate = (d) => (d ? String(d).slice(0, 10).replace(/-/g, ".") : "");

async function main() {
  const { ImageResponse } = await import(
    "next/dist/compiled/@vercel/og/index.node.js"
  );

  const blog = await collect("blog");
  const docs = await collect("docs");
  const gallery = await collect("gallery");

  // 卡片清單：[輸出檔名, 內容]
  const jobs = [
    [
      "default",
      {
        color: C.red,
        kicker: "[00] WILSON'S NOTES",
        title: "威爾森的生活札記",
        description:
          "來杯好茶聊聊日常碎念，來杯咖啡記下學習日常，來杯果汁收藏生活影像。",
        footer: "TEA / COFFEE / JUICE",
      },
    ],
  ];
  for (const [key, s] of Object.entries(SECTIONS)) {
    jobs.push([
      key,
      {
        color: s.color,
        kicker: `[${s.no}] ${s.latin}`,
        title: s.label,
        description: s.description,
        footer: "WILSON'S NOTES",
      },
    ]);
  }
  const push = (section, list) => {
    const s = SECTIONS[section];
    for (const item of list) {
      if (section === "docs" && item.slug === "") continue; // 學習日常首頁用 docs.png
      jobs.push([
        `${section}/${item.slug}`,
        {
          color: s.color,
          kicker: `[${s.no}] ${s.latin}`,
          title: item.title ?? s.label,
          description: item.description,
          footer: fmtDate(item.date) || "WILSON'S NOTES",
        },
      ]);
    }
  };
  push("blog", blog);
  push("docs", docs);
  push("gallery", gallery);

  const allText = jobs
    .map(([, j]) => `${j.title}${j.description ?? ""}`)
    .join("");
  const { fonts, cjk } = await loadFonts(allText);

  await fs.rm(outDir, { recursive: true, force: true });
  let ok = 0;
  for (const [name, job] of jobs) {
    const opts = cjk
      ? job
      : // 沒有中文字型：標題改成英文，只留幾何圖形
        { ...job, title: "WILSON'S NOTES", description: undefined };
    const file = path.join(outDir, `${name}.png`);
    try {
      const res = new ImageResponse(card({ ...opts, cjk }), {
        width: 1200,
        height: 630,
        fonts,
      });
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, buf);
      ok++;
    } catch (e) {
      console.warn(`[og] ${name}.png 產生失敗：${e.message}`);
    }
  }
  console.log(
    `[og] 已產生 ${ok}/${jobs.length} 張分享卡片${cjk ? "" : "（無中文字型）"} → public/og/`,
  );
}

main().catch((e) => {
  console.warn(`[og] 分享卡片產生失敗，略過：${e.stack ?? e}`);
});
