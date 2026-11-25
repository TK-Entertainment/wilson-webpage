// 知識星圖的資料：從各科筆記的「先認識的名詞」表抽出名詞，產生 components/stars/starData.json
//
//   node scripts/stars-data.mjs（建置時自動跑）
//
// 一個名詞一顆星，同一門課聚成一團星雲。
// 連線有兩種：不同科出現同一個名詞（自動），以及 data/star-links.json 手寫的跨科概念（附一句為什麼）。
import fs from "node:fs";
import path from "node:path";

// 有名詞表的課；順序就是森林裡由左到右
const SUBJECTS = ["geochemistry", "structural-geology", "mineralogy", "earth-materials"];
const DOCS = "content/docs";

const stripHtml = (s) => s.replace(/<sub>(.*?)<\/sub>/g, "$1").replace(/<sup>(.*?)<\/sup>/g, "$1").replace(/<[^>]+>/g, "");
const clean = (s) =>
  stripHtml(s)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\$([^$]*)\$/g, (_, m) => m.replace(/\\mathrm\{([^}]*)\}/g, "$1").replace(/\\[a-zA-Z]+/g, "").replace(/[{}]/g, ""))
    .replace(/\\([<>*_])/g, "$1")
    .trim();
// 比對用：去掉括號內容、拉丁與希臘字母、數字、上下標和空白，只留中文
const norm = (s) =>
  clean(s)
    .replace(/[（(][^）)]*[）)]/g, "")
    .replace(/[A-Za-zΑ-Ωα-ω0-9⁰-⁹₀-₉ₐ-ₜ′'"\-–_.,:;=≥≤·/*+]/g, "")
    .replace(/\s+/g, "")
    .trim();

const out = { generated: new Date().toISOString().slice(0, 10), subjects: [], links: [] };
const all = []; // 全部名詞，給連線用

for (const subj of SUBJECTS) {
  const dir = path.join(DOCS, subj);
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
  const S = { id: subj, name: meta.title, chapters: [] };
  for (const page of meta.pages) {
    const f = path.join(dir, page + ".mdx");
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, "utf8");
    const at = t.indexOf("### 先認識的名詞");
    if (at < 0) continue;
    const title = (t.match(/^title:\s*(.+)$/m) || [])[1]?.trim() ?? page;
    // 代號＋短標題：「第 10 講　U-Pb…」→ L10；「L04　礦物的物理性質」→ L04；
    // 「沉積岩（一）沉積物從哪裡來」→ 沉積岩（一）；都不符合就用標題最後兩個字
    let code, short;
    let m;
    if ((m = title.match(/^第\s*([\d–-]+)\s*(講|章)\s*(.*)$/))) [code, short] = [(m[2] === "講" ? "L" : "Ch") + m[1], m[3]];
    else if ((m = title.match(/^([^　]{1,8})　(.+)$/))) [code, short] = [m[1], m[2]];
    else if ((m = title.match(/^(.+?（[一二三四五六七八九十]+）)(.+)$/))) [code, short] = [m[1], m[2]];
    else [code, short] = [title.slice(-2), title];
    short = short.trim();
    let seg = t.slice(at);
    seg = seg.slice(seg.indexOf("|")).split(/\n\s*\n/)[0];
    const rows = seg.split("\n").filter((l) => l.startsWith("|") && !/^\|\s*-/.test(l)).slice(1);
    const terms = rows
      .map((r) => r.replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim()))
      .filter((c) => c[0])
      .map((c, i) => ({ i, name: clean(c[0]), desc: clean(c[1] ?? "") }));
    if (!terms.length) continue;
    const ch = { page, code, title: short, url: `/docs/${subj}/${page}`, terms };
    S.chapters.push(ch);
    for (const x of terms) all.push({ id: `${subj}/${page}#${x.i}`, subj, name: x.name, keys: norm(x.name).split("、").filter((k) => k.length >= 2), full: norm(x.name) });
  }
  out.subjects.push(S);
}

// 自動連線：不同科出現同一個名詞
const seen = new Set();
const key = (a, b) => [a, b].sort().join("|");
for (let i = 0; i < all.length; i++) {
  for (let j = i + 1; j < all.length; j++) {
    const A = all[i], B = all[j];
    if (A.subj === B.subj) continue;
    if (A.keys.some((k) => B.keys.includes(k)) && !seen.has(key(A.id, B.id))) {
      seen.add(key(A.id, B.id));
      out.links.push({ a: A.id, b: B.id, kind: "same" });
    }
  }
}

// 手寫的跨科概念：名詞用「包含」比對，先找完全相同的
const find = (subj, word) => {
  const w = norm(word);
  return all.find((x) => x.subj === subj && x.full === w) ?? all.find((x) => x.subj === subj && x.full.includes(w));
};
const curated = JSON.parse(fs.readFileSync("data/star-links.json", "utf8"));
let missing = 0;
for (const L of curated) {
  const A = find(...L.a), B = find(...L.b);
  if (!A || !B) {
    missing++;
    console.warn(`[stars] 找不到連線的名詞：${L.a.join("/")} ↔ ${L.b.join("/")}`);
    continue;
  }
  const k = key(A.id, B.id);
  const old = out.links.find((x) => key(x.a, x.b) === k);
  if (old) Object.assign(old, { kind: "concept", why: L.why });
  else out.links.push({ a: A.id, b: B.id, kind: "concept", why: L.why });
}

fs.mkdirSync("components/stars", { recursive: true });
fs.writeFileSync("components/stars/starData.json", JSON.stringify(out));
const nCh = out.subjects.reduce((s, x) => s + x.chapters.length, 0);
console.log(`stars: ${out.subjects.length} 門課、${nCh} 頁、${all.length} 顆星、${out.links.length} 條連線${missing ? `（${missing} 條手寫連線找不到名詞）` : ""}`);
