// 首頁「最近動態」用：每篇筆記第一次加進 repo 的日期（筆記本身沒有日期欄位）
// 從 git 紀錄算，寫進 components/home/notesAdded.json（有 commit 進 repo）。
// 建置環境如果只抓了淺層 git 紀錄，就保留 repo 裡現有的檔案不覆蓋。
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const OUT = "components/home/notesAdded.json";
let count = 0;
try {
  count = Number(execSync("git rev-list --count HEAD", { encoding: "utf8" }).trim());
} catch {}
if (count < 50) {
  console.log(`[notes-added] git 紀錄只有 ${count} 筆，沿用現有的 ${OUT}`);
  process.exit(0);
}
const log = execSync(
  'git log --diff-filter=A --name-only --format="@@%ad" --date=short -- content/docs',
  { encoding: "utf8" },
);
const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const out = {};
let date = "";
for (const line of log.split("\n")) {
  if (line.startsWith("@@")) date = line.slice(2);
  else if (line.endsWith(".mdx") && existsSync(line)) {
    const key = line.replace(/^content\/docs\//, "").replace(/\.mdx$/, "");
    // git log 由新到舊，最後看到的是最早加入的日期
    out[key] = date;
  }
}
// 檔案改名後 git 會當成新增；之前記過的日期比較早就沿用
for (const [k, d] of Object.entries(prev)) if (out[k] && d < out[k]) out[k] = d;
const sorted = Object.fromEntries(Object.entries(out).sort());
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`[notes-added] ${Object.keys(sorted).length} 篇筆記`);
