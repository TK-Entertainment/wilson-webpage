// 估計閱讀時間：中日韓文字約每分鐘 400 字，英文等拉丁文字約每分鐘 200 字
const CJK_PER_MINUTE = 400;
const WORDS_PER_MINUTE = 200;

const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/g;

export function readingMinutes(raw: string): number {
  const text = raw
    .replace(/^---[\s\S]*?---/, " ") // frontmatter
    .replace(/```[\s\S]*?```/g, " ") // 程式碼區塊
    .replace(/\$\$[\s\S]*?\$\$/g, " ") // 區塊公式
    .replace(/^\s*(import|export)\s.*$/gm, " ") // MDX import / export
    .replace(/<[^>]+>/g, " ") // JSX / HTML 標籤
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 圖片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 連結只留文字
    .replace(/https?:\/\/\S+/g, " ");

  const cjk = text.match(CJK)?.length ?? 0;
  const words =
    text.replace(CJK, " ").match(/[A-Za-z0-9À-ɏ]+(?:['’-][A-Za-z0-9]+)*/g)
      ?.length ?? 0;

  return Math.max(
    1,
    Math.ceil(cjk / CJK_PER_MINUTE + words / WORDS_PER_MINUTE),
  );
}

export function readingTimeLabel(raw: string): string {
  return `約 ${readingMinutes(raw)} 分鐘`;
}
