// 從各科筆記的「自我檢測」抽出題目，產生每日複習用的資料（components/notes/reviewData.json）
import fs from "fs";
import path from "path";

const SUBJECTS = { geochemistry: "地球化學", "structural-geology": "地球構造", mineralogy: "礦物學" };
const slug = (s) => s.trim().toLowerCase().replace(/[^\p{L}\p{M}\p{Nd}\p{Pc} -]/gu, "").replace(/ /g, "-");
const out = [];
for (const [subj, name] of Object.entries(SUBJECTS)) {
  const dir = path.join("content/docs", subj);
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
  for (const page of meta.pages) {
    const f = path.join(dir, page + ".mdx");
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, "utf8");
    const title = (t.match(/^title:\s*(.+)$/m) || [])[1] || page;
    const lines = t.split("\n");
    let sec = "", anchor = "";
    for (let i = 0; i < lines.length; i++) {
      const h = lines[i].match(/^## (.+)$/);
      if (h) { sec = h[1].trim(); anchor = slug(sec); continue; }
      if (!/^<summary>自我檢測/.test(lines[i].trim())) continue;
      const qs = [];
      let ans = null;
      let j = i + 1;
      for (; j < lines.length && !/^<\/details>/.test(lines[j].trim()); j++) {
        const q = lines[j].match(/^\d+\.\s+(.+)$/);
        if (q && ans === null) qs.push(q[1].trim());
        const a = lines[j].match(/^\*\*答案\*\*[:：]\s*(.+)$/);
        if (a) ans = a[1].trim();
        else if (ans !== null && lines[j].trim()) ans += "\n" + lines[j].trim();
      }
      i = j;
      qs.forEach((q, k) => out.push({ id: `${subj}/${page}#${anchor}#${k}`, subj, name, page, title, sec, anchor, q, ans }));
    }
  }
}
fs.writeFileSync("components/notes/reviewData.json", JSON.stringify(out));
console.log("review questions:", out.length);
