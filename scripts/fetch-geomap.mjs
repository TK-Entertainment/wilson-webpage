// 下載足跡地圖要疊的地質圖（只在本機手動跑一次，產出的圖片放在 public/img/geomap/，建置時不會跑）
//
//   node scripts/fetch-geomap.mjs
//
// 來源：經濟部地質調查及礦業管理中心 WMS（政府資料開放授權條款第 1 版，須標示出處）
//   地層：WMS/1M_Geomap_strata_1986（一百萬分之一臺灣區域地質圖，1986）
//   斷層：WMS/500K_Geomap_fault_2000（五十萬分之一臺灣地質圖－斷層，2000）
// 2000 年版的地層圖層（WMS/500K_Geomap_strata_2000）在 2026-11 測試時回傳全透明，所以地層改用 1986 年版。
//
// 範圍要和 data/map/taiwan-map.json 的主圖投影完全一樣：
//   x = (lng − lng0)·C·k，y = (lat1 − lat)·k，畫布 600 × 805
// 這是經緯度的線性縮放，所以 EPSG:4326 的 WMS 圖片直接拉到 600 × 805 就會對齊。
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const map = JSON.parse(await fs.readFile(path.join(root, "data/map/taiwan-map.json"), "utf8"));
const { lng0, lat1, k, C } = map.proj;
const W = map.width ?? 600, H = map.height ?? 805;
const lng1 = lng0 + W / (C * k);
const lat0 = lat1 - H / k;

const SCALE = 4; // 輸出 4 倍解析度，放大到縣市時才不會糊
const TILES = 2; // 每個方向切 2 塊下載，避免單張太大被伺服器拒絕
const BASE = "https://geomap.gsmma.gov.tw/mapguide/mapagent/mapagent.fcgi";
const outDir = path.join(root, "public/img/geomap");

async function getTile(layer, bbox, w, h) {
  const q = new URLSearchParams({
    SERVICE: "WMS", VERSION: "1.1.1", REQUEST: "GetMap", SRS: "EPSG:4326",
    BBOX: bbox.join(","), WIDTH: String(w), HEIGHT: String(h),
    FORMAT: "image/png", TRANSPARENT: "TRUE", STYLES: "", LAYERS: layer,
  });
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch(`${BASE}?${q}`, { headers: { "User-Agent": "personal-site-build-script" } });
    const buf = Buffer.from(await r.arrayBuffer());
    if (r.ok && buf.subarray(1, 4).toString() === "PNG") return buf;
    console.warn(`  ${layer} 第 ${attempt} 次失敗（HTTP ${r.status}），重試`);
  }
  throw new Error(`下載失敗：${layer} ${bbox}`);
}

async function fetchLayer(layer, file, quality, tint) {
  const TW = (W * SCALE) / TILES, TH = (H * SCALE) / TILES;
  const M = 16; // 每塊多抓一圈 16 px 再裁掉：WMS 會在圖塊邊緣畫出淡淡的邊線，裁掉才不會有接縫
  const pxLng = (lng1 - lng0) / (W * SCALE), pxLat = (lat1 - lat0) / (H * SCALE);
  const parts = [];
  for (let i = 0; i < TILES; i++) {
    for (let j = 0; j < TILES; j++) {
      // i：由北往南，j：由西往東
      const x0 = j * TW, y0 = i * TH;
      const bbox = [
        lng0 + (x0 - M) * pxLng,
        lat1 - (y0 + TH + M) * pxLat,
        lng0 + (x0 + TW + M) * pxLng,
        lat1 - (y0 - M) * pxLat,
      ];
      console.log(`  ${layer} 第 ${i * TILES + j + 1}/${TILES * TILES} 塊`);
      const raw = await getTile(layer, bbox, TW + 2 * M, TH + 2 * M);
      const input = await sharp(raw).extract({ left: M, top: M, width: TW, height: TH }).png().toBuffer();
      parts.push({ input, left: x0, top: y0 });
    }
  }
  let png = await sharp({ create: { width: W * SCALE, height: H * SCALE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(parts)
    .png()
    .toBuffer();
  if (tint) {
    // 黑色線條在深藍底上看不到：保留透明度，整張換成指定顏色
    const alpha = await sharp(png).extractChannel(3).toBuffer();
    png = await sharp({ create: { width: W * SCALE, height: H * SCALE, channels: 3, background: tint } })
      .joinChannel(alpha)
      .png()
      .toBuffer();
  }
  await fs.writeFile(path.join(outDir, file), await sharp(png).webp({ quality, alphaQuality: 90, effort: 6 }).toBuffer());
  const { size } = await fs.stat(path.join(outDir, file));
  console.log(`→ public/img/geomap/${file}（${(size / 1024).toFixed(0)} KB）`);
}

await fs.mkdir(outDir, { recursive: true });
console.log(`範圍：經度 ${lng0}–${lng1.toFixed(5)}，緯度 ${lat0.toFixed(5)}–${lat1}`);
await fetchLayer("WMS/1M_Geomap_strata_1986", "strata-1m-1986.webp", 82);
await fetchLayer("WMS/500K_Geomap_fault_2000", "faults-500k-2000.webp", 90, "#f1e6c8");
