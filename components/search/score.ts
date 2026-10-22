import type { SearchEntry } from "./types";

export interface SearchResult {
  entry: SearchEntry;
  score: number;
  snippet: string;
}

export function toTerms(query: string): string[] {
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  );
}

// 從文字中擷取第一個命中處的前後文
function makeSnippet(text: string, terms: string[], radius = 36): string {
  const lower = text.toLowerCase();
  let at = -1;
  for (const term of terms) {
    const i = lower.indexOf(term);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return "";
  const start = Math.max(0, at - radius);
  const end = Math.min(text.length, at + radius * 2);
  return (
    (start > 0 ? "…" : "") +
    text.slice(start, end).trim() +
    (end < text.length ? "…" : "")
  );
}

/**
 * 簡易評分：標題 > 標籤 > 描述 > 內文；以子字串比對，中英文都適用。
 * 多個關鍵字（以空白分隔）必須全部命中才算結果。
 */
export function search(
  entries: SearchEntry[],
  query: string,
  limit = 30,
): SearchResult[] {
  const terms = toTerms(query);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const tags = entry.tags.map((t) => t.toLowerCase());
    const desc = entry.description.toLowerCase();
    const body = entry.body.toLowerCase();

    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      let s = 0;
      const ti = title.indexOf(term);
      if (ti !== -1) s += ti === 0 ? 120 : 100;
      if (tags.some((t) => t === term)) s += 70;
      else if (tags.some((t) => t.includes(term))) s += 60;
      if (desc.includes(term)) s += 30;
      if (body.includes(term)) {
        // 內文出現次數越多稍微加分，但封頂
        let count = 0;
        let from = 0;
        while (count < 5) {
          const i = body.indexOf(term, from);
          if (i === -1) break;
          count++;
          from = i + term.length;
        }
        s += 8 + count * 2;
      }
      if (s === 0) {
        matchedAll = false;
        break;
      }
      score += s;
    }
    if (!matchedAll) continue;

    const snippet =
      makeSnippet(entry.body, terms) ||
      makeSnippet(entry.description, terms) ||
      entry.description;
    results.push({ entry, score, snippet });
  }

  return results
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.entry.date ?? "").localeCompare(a.entry.date ?? ""),
    )
    .slice(0, limit);
}
