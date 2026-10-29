"use client";

import { useEffect, useMemo, useState } from "react";
import katex from "katex";
import DATA from "./reviewData.json";
import "./notes.css";

// 每日複習：從各章「自我檢測」抽題。每天一組（依日期固定），標「不會」的題目之後優先出現。
// 作答紀錄只存在這台裝置的瀏覽器（localStorage）。

type Item = { id: string; subj: string; name: string; page: string; title: string; sec: string; anchor: string; q: string; ans: string | null };
type Rec = Record<string, { s: "ok" | "no"; t: string }>;
const ITEMS = DATA as Item[];
const KEY = "daily-review-v1";
const N = 8;

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
// 簡單的可重現亂數（同一天、同一科得到同一組題目）
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** 筆記裡的 markdown 片段 → HTML：$…$ 用 KaTeX，**粗體**、<sub>、<sup>、\< 處理掉 */
function md(s: string) {
  return s
    .split(/(\$[^$]+\$)/)
    .map((seg) => {
      if (/^\$[^$]+\$$/.test(seg)) {
        try {
          return katex.renderToString(seg.slice(1, -1), { throwOnError: false });
        } catch {
          return esc(seg);
        }
      }
      return esc(seg.replace(/\\</g, "<"))
        .replace(/&lt;(\/?)(sub|sup|strong|b)&gt;/g, "<$1$2>")
        .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
        .replace(/\n/g, "<br/>");
    })
    .join("");
}
/** 一個自我檢測區塊只有一段答案「(1)… (2)…」，取出第 k 題那段 */
function answerFor(ans: string, k: number) {
  const parts = ans.split(/(?=\(\d+\)\s)/);
  const hit = parts.find((p) => p.startsWith(`(${k + 1})`));
  return hit ? hit.replace(/^\(\d+\)\s*/, "").trim() : ans;
}

export function DailyReview({ subject }: { subject?: string }) {
  const [rec, setRec] = useState<Rec>({});
  const [subj, setSubj] = useState(subject ?? "all");
  const [shift, setShift] = useState(0);
  const [onlyNo, setOnlyNo] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setRec(JSON.parse(localStorage.getItem(KEY) || "{}"));
    } catch {}
    setReady(true);
  }, []);
  const mark = (id: string, s: "ok" | "no") =>
    setRec((prev) => {
      const r = { ...prev, [id]: { s, t: today() } };
      try {
        localStorage.setItem(KEY, JSON.stringify(r));
      } catch {}
      return r;
    });
  const pool = ITEMS.filter((x) => subj === "all" || x.subj === subj);
  const day = today();
  const pick = useMemo(() => {
    if (onlyNo) return pool.filter((x) => rec[x.id]?.s === "no");
    const r = rng(hash(`${day}|${subj}|${shift}`));
    // 不會的（最久沒複習的先）→ 沒做過的 → 會的；同一類裡隨機
    const no = pool.filter((x) => rec[x.id]?.s === "no").sort((a, b) => (rec[a.id].t < rec[b.id].t ? -1 : 1));
    const fresh = pool.filter((x) => !rec[x.id]).map((x) => [r(), x] as const).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
    const ok = pool.filter((x) => rec[x.id]?.s === "ok").sort((a, b) => (rec[a.id].t < rec[b.id].t ? -1 : 1));
    const nNo = Math.min(no.length, Math.ceil(N / 2));
    return [...no.slice(shift * nNo, shift * nNo + nNo), ...fresh, ...ok].filter((x, i, a) => a.indexOf(x) === i).slice(0, N);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subj, shift, onlyNo, day, ready]);
  const done = pool.filter((x) => rec[x.id]).length;
  const nNo = pool.filter((x) => rec[x.id]?.s === "no").length;
  const subjects = subject ? [] : [["all", "全部"], ["geochemistry", "地球化學"], ["structural-geology", "地球構造"], ["mineralogy", "礦物學"]];
  return (
    <figure className="nd-not-prose ix-wrap">
      <figcaption className="ix-head">
        <b>今日複習（{day}）</b>
        <span>題目來自各章的「自我檢測」；先自己想答案，再打開對照，最後標「會」或「不會」</span>
      </figcaption>
      <div style={{ padding: "0.8rem 1rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {subjects.length > 0 && (
          <div className="ix-btns">
            {subjects.map(([k, n]) => (
              <button key={k} type="button" className="ix-btn" aria-pressed={subj === k} onClick={() => { setSubj(k); setShift(0); setOnlyNo(false); }}>{n}</button>
            ))}
          </div>
        )}
        <div className="ix-readout">
          題庫 <b>{pool.length}</b> 題｜做過 <b>{done}</b>（{pool.length ? Math.round((done / pool.length) * 100) : 0}%）｜標「不會」<b>{nNo}</b> 題
        </div>
        <div className="ix-btns">
          <button type="button" className="ix-btn" onClick={() => { setOnlyNo(false); setShift(shift + 1); setOpen({}); }}>換一組</button>
          <button type="button" className="ix-btn" aria-pressed={onlyNo} onClick={() => setOnlyNo(!onlyNo)}>只看「不會」的（{nNo}）</button>
        </div>
        {pick.length === 0 && <div className="ix-note">{onlyNo ? "目前沒有標「不會」的題目。" : "這一科還沒有題目。"}</div>}
        <ol style={{ margin: 0, paddingLeft: "1.3rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {pick.map((x) => {
            const k = +x.id.split("#")[2];
            const st = rec[x.id]?.s;
            return (
              <li key={x.id} style={{ lineHeight: 1.6 }}>
                <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                  {x.name}｜{x.title}｜{x.sec.replace(/\s*★/, "")}
                </div>
                <div style={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: md(x.q) }} />
                <div className="ix-btns" style={{ marginTop: 4 }}>
                  {x.ans ? (
                    <button type="button" className="ix-btn" style={{ fontSize: "0.78rem" }} aria-pressed={!!open[x.id]} onClick={() => setOpen({ ...open, [x.id]: !open[x.id] })}>{open[x.id] ? "收起答案" : "看答案"}</button>
                  ) : null}
                  <a className="ix-btn" style={{ fontSize: "0.78rem", textDecoration: "none" }} href={`/docs/${x.subj}/${x.page}#${x.anchor}`}>回到筆記</a>
                  <button type="button" className="ix-btn" style={{ fontSize: "0.78rem" }} aria-pressed={st === "ok"} onClick={() => mark(x.id, "ok")}>會</button>
                  <button type="button" className="ix-btn" style={{ fontSize: "0.78rem" }} aria-pressed={st === "no"} onClick={() => mark(x.id, "no")}>不會</button>
                </div>
                {open[x.id] && x.ans ? (
                  <div className="ix-note" style={{ marginTop: 6, borderLeft: "3px solid var(--teal)", paddingLeft: 8 }} dangerouslySetInnerHTML={{ __html: md(answerFor(x.ans, k)) }} />
                ) : null}
              </li>
            );
          })}
        </ol>
        <div className="ix-note">
          每天的題目固定（換一組會往後抽）；標「不會」的題目下次會優先出現，直到你標成「會」。紀錄只存在這台裝置的瀏覽器，換手機或清除瀏覽資料就會重來。
        </div>
      </div>
    </figure>
  );
}
