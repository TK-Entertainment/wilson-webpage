// 建置前壓縮足跡打卡的照片（public/img/places/），只影響這次建置的輸出，不改 repo 裡的原檔
//
//   node scripts/optimize-places.mjs
//
// iPhone 捷徑上傳的照片可能很大（品質設定在手機上不一定生效），這裡統一縮成長邊 1600、JPEG 品質 80
// 任何錯誤都不會中斷建置
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "img", "places");
const MAX = 1600;
const TARGET = 450 * 1024; // 比這小、尺寸也不超過的就不動

async function walk(d) {
  let out = [];
  for (const e of await fs.readdir(d, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out = out.concat(await walk(p));
    else if (/\.jpe?g$/i.test(e.name)) out.push(p);
  }
  return out;
}

async function main() {
  const { default: sharp } = await import("sharp");
  const files = await walk(dir);
  let done = 0, saved = 0;
  for (const f of files) {
    try {
      const buf = await fs.readFile(f);
      const meta = await sharp(buf).metadata();
      if (buf.length <= TARGET && Math.max(meta.width ?? 0, meta.height ?? 0) <= MAX) continue;
      const out = await sharp(buf)
        .rotate() // 依 EXIF 方向轉正
        .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
      if (out.length < buf.length) {
        await fs.writeFile(f, out);
        done++;
        saved += buf.length - out.length;
      }
    } catch (e) {
      console.warn(`[places] ${path.relative(root, f)} 壓縮失敗，維持原檔：${e.message}`);
    }
  }
  console.log(`[places] 壓縮 ${done}/${files.length} 張打卡照片，省下 ${(saved / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((e) => console.warn(`[places] 略過照片壓縮：${e.message}`));
