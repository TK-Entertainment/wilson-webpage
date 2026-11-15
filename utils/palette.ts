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
const COURSE_COLORS: Record<string, string> = {
  geochemistry: "var(--orange)",
  "structural-geology": "var(--teal)",
  "structural-geology-ntnu": "var(--sky)",
  mineralogy: "var(--plum)",
  "earth-materials": "var(--sage)",
  "earth-science": "var(--rose)",
  astronomy: "var(--gold)",
  research: "var(--plum)",
};

/** 由筆記網址（/docs/<課程>/...）或資料夾名取課程顏色 */
export function courseColor(urlOrFolder: string): string | undefined {
  const parts = urlOrFolder.split("/").filter(Boolean);
  const folder = parts[0] === "docs" ? parts[1] : parts[0];
  return folder ? COURSE_COLORS[folder] : undefined;
}

/** 標籤顏色：同一個標籤永遠同一個顏色 */
export function tagColor(tag: string): string {
  let h = 0;
  for (const ch of tag) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return PALETTE[h % PALETTE.length];
}
