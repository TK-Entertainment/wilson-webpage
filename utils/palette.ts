// 網站色票：主色（金、青綠、橘）＋低彩度輔助色（灰綠、灰紫、灰玫瑰、灰藍）
// 標籤、課程、提示框都從這裡取色，整站配色才會一致
export const PALETTE = [
  "var(--gold)",
  "var(--teal)",
  "var(--orange)",
  "var(--sage)",
  "var(--plum)",
  "var(--rose)",
  "var(--sky)",
];

// 學習日常：每門課一個顏色（key 是 content/docs 底下的資料夾名）
// c：色塊用的顏色；hs：色相＋彩度，給側欄、目錄等「文字」用（亮度依深淺色模式另外調，才看得清楚）
const COURSE_COLORS: Record<string, { c: string; hs: string }> = {
  geochemistry: { c: "var(--orange)", hs: "25 75%" },
  "structural-geology": { c: "var(--teal)", hs: "176 50%" },
  "structural-geology-ntnu": { c: "var(--sky)", hs: "212 40%" },
  mineralogy: { c: "var(--plum)", hs: "266 30%" },
  "earth-materials": { c: "var(--sage)", hs: "91 28%" },
  "earth-science": { c: "var(--rose)", hs: "6 45%" },
  astronomy: { c: "var(--gold)", hs: "41 70%" },
  research: { c: "var(--plum)", hs: "266 30%" },
};

function courseOf(urlOrFolder: string) {
  const parts = urlOrFolder.split("/").filter(Boolean);
  const folder = parts[0] === "docs" ? parts[1] : parts[0];
  return folder ? COURSE_COLORS[folder] : undefined;
}

/** 由筆記網址（/docs/<課程>/...）或資料夾名取課程顏色 */
export function courseColor(urlOrFolder: string): string | undefined {
  return courseOf(urlOrFolder)?.c;
}

/** 課程顏色的色相＋彩度（例如 "266 30%"），給 --primary 用 */
export function courseHS(urlOrFolder: string): string | undefined {
  return courseOf(urlOrFolder)?.hs;
}

// 標籤：常用的手動指定（同一篇文章裡不撞色），其他的依名稱自動算
const TAG_COLORS: Record<string, string> = {
  日常紀錄板: "var(--sky)",
  自我介紹: "var(--orange)",
  INTP: "var(--plum)",
  讀書心得: "var(--gold)",
  三體: "var(--rose)",
  劉慈欣: "var(--sage)",
  影片: "var(--teal)",
  地球科學: "var(--sage)",
};

/** 標籤顏色：同一個標籤永遠同一個顏色 */
export function tagColor(tag: string): string {
  if (TAG_COLORS[tag]) return TAG_COLORS[tag];
  let h = 0;
  for (const ch of tag) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return PALETTE[h % PALETTE.length];
}
