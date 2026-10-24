"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import GlitchText from "@/components/glitchtext";
import { closePortal } from "@/components/tarot/portal";
import { tarotCards, type TarotCard } from "@/utils/tarot";
import { minorCards, suits } from "@/utils/tarotMinor";

// 完整一副牌：22 張大阿爾克那＋56 張小阿爾克那
const fullDeck: TarotCard[] = [...tarotCards, ...minorCards];

// 整副牌的分組：大阿爾克那一組，小阿爾克那依花色各一組
const groups = [
  { code: "22", en: "MAJOR ARCANA", title: "大阿爾克那", cards: tarotCards },
  ...suits.map((s) => ({
    code: "14",
    en: s.en.toUpperCase(),
    title: `${s.name}・${s.sphere}`,
    cards: minorCards.filter((c) => c.suit === s.key),
  })),
];

type Phase = "idle" | "shuffling" | "picking" | "reading";
type Pick = { card: TarotCard; reversed: boolean; flipped: boolean };

type ModeKey = "one" | "three" | "theme";

const SPREADS = {
  one: [{ en: "TODAY", zh: "今日指引" }],
  three: [
    { en: "PAST", zh: "過去" },
    { en: "PRESENT", zh: "現在" },
    { en: "FUTURE", zh: "未來" },
  ],
  // 大小牌分開抽：第一張從大牌選主題，後兩張從小牌看細節
  theme: [
    { en: "THEME", zh: "主題" },
    { en: "DETAIL", zh: "現況" },
    { en: "ADVICE", zh: "建議" },
  ],
} as const;

const MODES = [
  {
    key: "one",
    code: "01",
    label: "抽一張",
    sub: "今日指引",
    color: "is-red",
  },
  {
    key: "three",
    code: "03",
    label: "抽三張",
    sub: "過去・現在・未來",
    color: "is-blue",
  },
  {
    key: "theme",
    code: "1+2",
    label: "主題＋細節",
    sub: "大牌定主題・小牌看細節",
    color: "is-teal",
  },
] as const;

// 每種抽法第 i 張牌要從哪一疊抽
function pileFor(mode: ModeKey, i: number) {
  if (mode !== "theme") return fullDeck;
  return i === 0 ? tarotCards : minorCards;
}

function shuffled<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

// 牌面與牌背：直接用完整的牌（深藍底金線框）
function CardFace({ card, lazy }: { card: TarotCard; lazy?: boolean }) {
  return (
    <img
      className="tcard"
      src={`/img/tarot/${card.key}.webp`}
      alt={`${card.num} ${card.name}・${card.animal}`}
      loading={lazy ? "lazy" : undefined}
      draggable={false}
    />
  );
}

function CardBack() {
  return (
    <img
      className="tcard"
      src="/img/tarot/back.webp"
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}

export default function TarotTable() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<ModeKey>("three");
  const [deck, setDeck] = useState<TarotCard[]>(fullDeck);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [detail, setDetail] = useState<TarotCard | null>(null);
  const [showAll, setShowAll] = useState(false);

  // 抽到的牌從扇形飛到牌位：記下起點位置，等牌位出現後再補動畫
  const flyFrom = useRef<DOMRect | null>(null);
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // 進場：把穿越轉場的紫色圓收起來，露出牌桌
  useEffect(() => {
    closePortal();
  }, []);

  const count = SPREADS[mode].length;

  function start(m: ModeKey) {
    timers.current.forEach(clearTimeout);
    setMode(m);
    setPicks([]);
    setDeck(shuffled(pileFor(m, 0)));
    setPhase("shuffling");
    timers.current.push(
      window.setTimeout(() => setPhase("picking"), reduce ? 0 : 1500),
    );
  }

  function pick(card: TarotCard, el: HTMLElement) {
    if (phase !== "picking" || picks.length >= count) return;
    flyFrom.current = el.getBoundingClientRect();
    // 正逆位各一半
    const next = [
      ...picks,
      { card, reversed: Math.random() < 0.5, flipped: false },
    ];
    setPicks(next);
    // 主題＋細節：選完大牌後，扇形換成小牌那一疊
    if (
      next.length < count &&
      pileFor(mode, next.length) !== pileFor(mode, picks.length)
    ) {
      setDeck(shuffled(pileFor(mode, next.length)));
    }
    if (next.length === count) {
      timers.current.push(
        window.setTimeout(() => setPhase("reading"), reduce ? 0 : 700),
      );
    }
  }

  useLayoutEffect(() => {
    const from = flyFrom.current;
    const el = slotRefs.current[picks.length - 1];
    flyFrom.current = null;
    if (!from || !el || reduce) return;
    const to = el.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    el.animate(
      [
        {
          transform: `translate(${dx}px, ${dy}px) scale(${from.width / to.width}) rotate(-8deg)`,
        },
        { transform: "translate(0, 0) scale(1) rotate(0)" },
      ],
      { duration: 600, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
  }, [picks.length, reduce]);

  function flip(i: number) {
    setPicks((ps) => ps.map((p, j) => (j === i ? { ...p, flipped: true } : p)));
  }

  const labels = SPREADS[mode];
  const pickedKeys = new Set(picks.map((p) => p.card.key));
  const allOpen = picks.length === count && picks.every((p) => p.flipped);

  return (
    <div className="tarot relative isolate overflow-hidden">
      {/* 包浩斯幾何色塊：開場時滾進來、掉下來（方塊和橫條在手機上會壓到按鈕，手機版不顯示） */}
      <div
        className="tarot-shapes pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px]"
        aria-hidden="true"
      >
        <span className="tarot-circle absolute -right-24 top-10 h-72 w-72 rounded-full bg-bh-red md:right-[6%] md:h-[22rem] md:w-[22rem]" />
        <span className="tarot-tri absolute right-[38%] top-4 hidden h-28 w-32 bg-bh-blue md:block" />
        <span className="tarot-square absolute max-sm:hidden right-[4%] top-[22rem] h-24 w-24 border-4 border-foreground bg-bh-yellow md:h-32 md:w-32" />
        <span className="tarot-bar absolute max-sm:hidden -left-8 top-[34rem] h-4 w-56 bg-foreground md:top-[37rem] md:w-80" />
        <span className="tarot-half absolute left-[42%] top-[24rem] hidden h-20 w-40 rounded-t-full bg-bh-purple md:block" />
      </div>

      <header className="tarot-head">
        <p className="font-mono-label text-sm font-bold">
          <span className="bg-bh-purple px-1.5 py-0.5 text-white">RUN</span>{" "}
          [04] 喝完茶の
        </p>
        <h1 className="mt-3 text-6xl font-black leading-none tracking-tighter sm:text-8xl">
          <GlitchText text="來抽" />
          <br />
          <GlitchText text="一張牌" />
        </h1>

        <div className="mt-8 max-w-xl border-4 border-foreground bg-bh-ink p-4 font-mono-label text-sm leading-relaxed text-bh-paper shadow-[8px_8px_0_#26304f] sm:text-base">
          <p>
            {"> 載入牌組 ............ "}
            <span className="text-bh-yellow">{fullDeck.length} 張 OK</span>
          </p>
          <p className="opacity-70">{"> 靜下心，想一個問題"}</p>
          <p aria-live="polite">
            {"> "}
            {phase === "idle" && "選一種抽法開始"}
            {phase === "shuffling" && (
              <>
                洗牌中{" "}
                <span className="tarot-blink bg-bh-red px-1 text-white">
                  BUSY
                </span>
              </>
            )}
            {phase === "picking" &&
              picks.length < count &&
              (mode === "theme"
                ? picks.length === 0
                  ? "先從 22 張大牌選 1 張，當作主題"
                  : `再從 56 張小牌選 ${count - picks.length} 張，看細節`
                : `憑直覺選出 ${count - picks.length} 張牌`)}
            {phase === "picking" && picks.length === count && "牌選好了"}
            {phase === "reading" && !allOpen && "點牌，翻開它"}
            {phase === "reading" && allOpen && (
              <>
                完成 <span className="text-bh-yellow">OK</span>
                ，想再問一次就重新選
              </>
            )}
            <span className="caret" aria-hidden="true" />
          </p>
        </div>

        <ul className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
          {MODES.map((m) => (
            <li key={m.key}>
              <button
                type="button"
                className={`tarot-mode flex h-full w-full flex-col gap-3 ${m.color} ${mode === m.key && phase !== "idle" ? "is-active" : ""}`}
                onClick={() => start(m.key)}
                disabled={phase === "shuffling"}
              >
                <span className="tarot-mode-code font-mono-label">
                  [{m.code}] {m.sub}
                </span>
                <span className="tarot-mode-t text-2xl sm:text-3xl">
                  {m.label}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </header>

      <section className="tarot-table" aria-label="牌桌">
        {phase === "idle" || phase === "shuffling" ? (
          <div
            className={`tarot-stack ${phase === "shuffling" ? "is-shuffling" : ""}`}
            aria-hidden="true"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ ["--i" as string]: i }}>
                <CardBack />
              </span>
            ))}
          </div>
        ) : null}

        {phase === "picking" ? (
          <div className="tarot-fan" style={{ ["--n" as string]: deck.length }}>
            {deck.map((card, i) => (
              <button
                key={card.key}
                type="button"
                className={`tarot-fan-card ${pickedKeys.has(card.key) ? "is-picked" : ""}`}
                style={{
                  ["--i" as string]: i,
                  animationDelay: reduce
                    ? undefined
                    : `${Math.round((i * 600) / deck.length)}ms`,
                }}
                onClick={(e) => pick(card, e.currentTarget)}
                disabled={pickedKeys.has(card.key)}
                aria-label={`第 ${i + 1} 張牌`}
              >
                <CardBack />
              </button>
            ))}
          </div>
        ) : null}

        {picks.length > 0 ? (
          <div className={`tarot-spread n${count}`}>
            {labels.map((l, i) => {
              const p = picks[i];
              return (
                <div className="tarot-slot" key={l.en}>
                  <p className="tarot-pos font-mono-label">
                    [{String(i + 1).padStart(2, "0")}] {l.en}
                    <span>{l.zh}</span>
                  </p>
                  <span className="tarot-slot-shape" aria-hidden="true" />
                  {p ? (
                    <button
                      type="button"
                      ref={(el) => {
                        slotRefs.current[i] = el;
                      }}
                      className={`tarot-flip ${p.flipped ? "is-open" : ""} ${p.reversed ? "is-reversed" : ""}`}
                      onClick={() => flip(i)}
                      disabled={p.flipped || phase !== "reading"}
                      aria-label={
                        p.flipped
                          ? `${l.zh}：${p.card.name}${p.reversed ? "（逆位）" : "（正位）"}`
                          : `${l.zh}：翻開牌`
                      }
                    >
                      <span className="tarot-flip-inner">
                        <span className="face back">
                          <CardBack />
                        </span>
                        <span className="face front">
                          <CardFace card={p.card} />
                        </span>
                      </span>
                    </button>
                  ) : (
                    <div className="tarot-flip is-empty" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

        {picks.some((p) => p.flipped) ? (
          <div className={`tarot-readings n${count}`}>
            {picks.map((p, i) =>
              p.flipped ? (
                <article className="tarot-reading" key={p.card.key}>
                  <p className="tarot-reading-pos font-mono-label">
                    [{String(i + 1).padStart(2, "0")}] {labels[i].en} {"//"}{" "}
                    {labels[i].zh}
                  </p>
                  <h2>
                    {p.card.name}・{p.card.animal}
                    <small className="font-mono-label">
                      [{p.card.num}] {p.card.en.toUpperCase()}
                    </small>
                    <span className={`tarot-tag ${p.reversed ? "rev" : ""}`}>
                      {p.reversed ? "逆位" : "正位"}
                    </span>
                  </h2>
                  <p className="tarot-kw">
                    {(p.reversed ? p.card.rev : p.card.up).kw}
                  </p>
                  <p>{(p.reversed ? p.card.rev : p.card.up).text}</p>
                </article>
              ) : null,
            )}
          </div>
        ) : null}
      </section>

      <section className="tarot-gallery" aria-labelledby="tarot-all">
        <p className="font-mono-label text-sm font-bold">
          [{fullDeck.length}] {"//"} FULL DECK
        </p>
        <h2
          id="tarot-all"
          className="flex items-center gap-4 pb-4 text-4xl font-black sm:text-5xl"
        >
          <span className="h-8 w-8 flex-none bg-bh-yellow" aria-hidden="true" />
          <GlitchText text="整副牌" />
        </h2>
        <button
          type="button"
          className="tarot-mode tarot-toggle mt-2 flex w-full max-w-md flex-col gap-3"
          aria-expanded={showAll}
          aria-controls="tarot-grid"
          onClick={() => setShowAll((v) => !v)}
        >
          <span className="tarot-mode-code font-mono-label">
            [{fullDeck.length}] 點任何一張看正位和逆位的牌義
          </span>
          <span className="tarot-mode-t text-2xl">
            {showAll ? "收起整副牌" : "展開整副牌"}
            <span aria-hidden="true">{showAll ? "−" : "+"}</span>
          </span>
        </button>
        {showAll ? (
          <div id="tarot-grid">
            {groups.map((g) => (
              <div key={g.en} className="tarot-group">
                <h3 className="tarot-group-title">
                  <span className="font-mono-label">
                    [{g.code}] {g.en}
                  </span>
                  {g.title}
                </h3>
                <div className="tarot-grid">
                  {g.cards.map((c) => (
                    <button
                      type="button"
                      key={c.key}
                      className="tarot-grid-card"
                      onClick={() => setDetail(c)}
                    >
                      <CardFace card={c} lazy />
                      <span className="split-hover">
                        {c.name}・{c.animal}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {detail ? <Detail card={detail} onClose={() => setDetail(null)} /> : null}
    </div>
  );
}

function Detail({ card, onClose }: { card: TarotCard; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  // 不在卸載時呼叫 close()：開發模式會先卸載再掛載一次，close 會觸發 onClose 把視窗清掉
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="tarot-dialog"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="tarot-dialog-title"
    >
      <div className="tarot-dialog-body">
        <CardFace card={card} />
        <div>
          <p className="font-mono-label text-sm font-bold">
            [{card.num}] {card.en.toUpperCase()}
          </p>
          <h2 id="tarot-dialog-title">
            {card.name}・{card.animal}
          </h2>
          <h3>
            <span className="tarot-tag">正位</span>
            {card.up.kw}
          </h3>
          <p>{card.up.text}</p>
          <h3>
            <span className="tarot-tag rev">逆位</span>
            {card.rev.kw}
          </h3>
          <p>{card.rev.text}</p>
          <button type="button" className="tarot-btn" onClick={onClose}>
            關閉 ✕
          </button>
        </div>
      </div>
    </dialog>
  );
}
