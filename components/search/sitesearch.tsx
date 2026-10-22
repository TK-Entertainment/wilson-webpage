"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Search, X } from "lucide-react";
import type { SearchEntry, SearchSection } from "./types";
import { search, toTerms } from "./score";

const SECTION_META: Record<
  SearchSection,
  { label: string; shape: string; accent: string }
> = {
  blog: {
    label: "日常碎念",
    shape: "h-3 w-3 rounded-full bg-bh-red",
    accent: "bg-bh-red text-white",
  },
  docs: {
    label: "學習日常",
    shape: "h-3 w-3 bg-bh-blue [clip-path:polygon(50%_0,100%_100%,0_100%)]",
    accent: "bg-bh-blue text-white",
  },
  gallery: {
    label: "生活影像",
    shape: "h-3 w-3 bg-bh-yellow",
    accent: "bg-bh-yellow text-bh-ink",
  },
};

// 索引只抓一次，整個分頁共用
let indexPromise: Promise<SearchEntry[]> | null = null;
function loadIndex(): Promise<SearchEntry[]> {
  if (!indexPromise) {
    indexPromise = fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<SearchEntry[]>;
      })
      .catch((err) => {
        indexPromise = null;
        throw err;
      });
  }
  return indexPromise;
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0 || !text) return <>{text}</>;
  const re = new RegExp(
    `(${terms
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join("|")})`,
    "gi",
  );
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="bg-bh-yellow px-0.5 text-bh-ink [box-decoration-break:clone]"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return (
    el.isContentEditable ||
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT"
  );
}

export default function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(0);
  const [isMac, setIsMac] = useState(true);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const titleId = `${baseId}-title`;

  useEffect(() => {
    setMounted(true);
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
    setError(false);
    loadIndex()
      .then(setEntries)
      .catch(() => setError(true));
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    // 關閉後把焦點還給觸發按鈕
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // 全域快捷鍵：⌘K / Ctrl+K、"/"
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) closePanel();
        else openPanel();
        return;
      }
      if (
        e.key === "/" &&
        !open &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isTypingTarget(e.target)
      ) {
        e.preventDefault();
        openPanel();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openPanel, closePanel]);

  // 開啟時鎖住背景捲動、聚焦輸入框
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    inputRef.current?.select();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const terms = useMemo(() => toTerms(query), [query]);
  const results = useMemo(
    () => (entries ? search(entries, query) : []),
    [entries, query],
  );

  useEffect(() => setActive(0), [query]);

  // 讓目前選取的項目保持在可視範圍
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function go(url: string) {
    setOpen(false);
    setQuery("");
    if (/^https?:\/\//.test(url)) window.open(url, "_blank", "noopener");
    else router.push(url);
  }

  function onDialogKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
      return;
    }
    if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
      return;
    }
    if (e.key === "ArrowUp" && results.length > 0) {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
      return;
    }
    if (
      e.key === "Enter" &&
      e.target === inputRef.current &&
      results[active] &&
      !e.nativeEvent.isComposing
    ) {
      e.preventDefault();
      go(results[active].entry.url);
      return;
    }
    // 焦點陷阱：Tab 只在面板內循環
    if (e.key === "Tab" && dialogRef.current) {
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input, [tabindex]",
        ),
      ).filter((el) => el.tabIndex >= 0);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  const activeId = results[active] ? `${baseId}-opt-${active}` : undefined;

  const panel = (
    <div
      className="fixed inset-0 z-[70] flex justify-center sm:items-start sm:px-4 sm:pt-[10vh]"
      onKeyDown={onDialogKeyDown}
    >
      <div
        className="absolute inset-0 bg-bh-ink/60"
        aria-hidden="true"
        onClick={closePanel}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full flex-col bg-background text-foreground sm:h-auto sm:max-h-[75vh] sm:max-w-2xl sm:border-4 sm:border-foreground sm:shadow-[8px_8px_0_#e2342b]"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <h2 id={titleId} className="sr-only">
          全站搜尋
        </h2>
        <div className="flex items-center gap-3 border-b-4 border-foreground px-4">
          <Search className="h-5 w-5 flex-none" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="搜尋文章、筆記與相簿"
            placeholder="搜尋文章、筆記、相簿…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="go"
            autoComplete="off"
            spellCheck={false}
            className="h-16 min-w-0 flex-1 bg-transparent text-lg font-bold outline-none placeholder:font-normal placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={closePanel}
            aria-label="關閉搜尋"
            className="flex h-11 flex-none items-center gap-2 border-2 border-foreground px-2 font-mono-label text-xs font-bold transition-colors hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-bh-blue"
          >
            <X className="h-4 w-4 sm:hidden" aria-hidden="true" />
            <span className="max-sm:hidden">ESC</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {query.trim() === "" ? (
            <div className="px-4 py-6 font-mono-label text-sm text-muted-foreground">
              <p>&gt; 輸入關鍵字，搜尋日常碎念、學習日常與生活影像</p>
              <ul className="mt-4 flex flex-wrap gap-4" aria-hidden="true">
                {(Object.keys(SECTION_META) as SearchSection[]).map((k) => (
                  <li key={k} className="flex items-center gap-2">
                    <span className={SECTION_META[k].shape} />
                    {SECTION_META[k].label}
                  </li>
                ))}
              </ul>
            </div>
          ) : error ? (
            <p className="px-4 py-6 font-mono-label text-sm text-bh-red">
              &gt; 索引載入失敗，請稍後再試
            </p>
          ) : entries === null ? (
            <p className="px-4 py-6 font-mono-label text-sm text-muted-foreground">
              &gt; 載入索引中
              <span className="caret" />
            </p>
          ) : results.length === 0 ? (
            <p
              className="px-4 py-6 font-mono-label text-sm"
              role="status"
              aria-live="polite"
            >
              &gt; 找不到符合「{query.trim()}」的內容
              <span className="caret" />
            </p>
          ) : null}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="搜尋結果"
            className={results.length === 0 ? "hidden" : ""}
          >
            {results.map((r, i) => {
              const meta = SECTION_META[r.entry.type];
              const selected = i === active;
              const external = /^https?:\/\//.test(r.entry.url);
              return (
                <li
                  key={r.entry.url + i}
                  id={`${baseId}-opt-${i}`}
                  role="option"
                  aria-selected={selected}
                  data-index={i}
                  className="border-b-2 border-foreground last:border-b-0"
                >
                  <Link
                    href={r.entry.url}
                    tabIndex={-1}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      go(r.entry.url);
                    }}
                    onMouseMove={() => setActive(i)}
                    className={`flex min-h-[64px] gap-3 px-4 py-3 transition-colors ${
                      selected
                        ? "bg-foreground text-background"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`mt-1.5 flex-none ${meta.shape}`}
                      aria-hidden="true"
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-1.5 font-mono-label text-[11px] font-bold ${meta.accent}`}
                        >
                          {meta.label}
                        </span>
                        {external && (
                          <span className="font-mono-label text-[11px] opacity-70">
                            {"// 外部文章"}
                          </span>
                        )}
                      </span>
                      <span className="text-base font-black leading-snug">
                        <Highlight text={r.entry.title} terms={terms} />
                      </span>
                      {r.snippet && (
                        <span
                          className={`line-clamp-2 text-sm ${
                            selected ? "opacity-80" : "text-muted-foreground"
                          }`}
                        >
                          <Highlight text={r.snippet} terms={terms} />
                        </span>
                      )}
                      {r.entry.tags.length > 0 && r.entry.type === "blog" && (
                        <span className="flex flex-wrap gap-x-2 font-mono-label text-[11px] opacity-80">
                          {r.entry.tags.map((t) => (
                            <span key={t}>
                              #<Highlight text={t} terms={terms} />
                            </span>
                          ))}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-4 border-t-4 border-foreground px-4 py-2 font-mono-label text-[11px] text-muted-foreground max-sm:hidden">
          <span>
            <kbd className="border border-foreground px-1">↑</kbd>{" "}
            <kbd className="border border-foreground px-1">↓</kbd> 選擇
          </span>
          <span>
            <kbd className="border border-foreground px-1">Enter</kbd> 前往
          </span>
          <span>
            <kbd className="border border-foreground px-1">Esc</kbd> 關閉
          </span>
          {results.length > 0 && (
            <span className="ml-auto" aria-live="polite">
              {results.length} 筆結果
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPanel}
        onMouseEnter={() => {
          loadIndex().catch(() => {});
        }}
        aria-label="搜尋全站"
        aria-haspopup="dialog"
        aria-keyshortcuts="Meta+K Control+K /"
        className="nd-flex h-9 items-center gap-2 px-2 py-1 transition-colors hover:text-bh-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-bh-blue lg:border-2 lg:border-foreground"
      >
        <Search className="h-5 w-5" aria-hidden="true" />
        <span className="font-mono-label text-xs font-bold max-lg:hidden">
          {isMac ? "⌘K" : "Ctrl K"}
        </span>
      </button>
      {mounted && open ? createPortal(panel, document.body) : null}
    </>
  );
}
