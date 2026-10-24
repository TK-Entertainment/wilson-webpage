// 文章日期顯示成 YYYY-MM-DD
// contentlayer 把沒寫時區的日期（例如 2026-10-22T23:00:00）當成 UTC 存，
// 顯示時也固定用 UTC，才會跟 frontmatter 寫的日期一樣；
// 不指定時區的話，台灣的瀏覽器會算成隔天，和伺服器產生的頁面對不上（React hydration 錯誤）
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("sv-SE", { timeZone: "UTC" });
}
