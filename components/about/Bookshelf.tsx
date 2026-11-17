"use client";

import Link from "next/link";
import { useState } from "react";
import "./shelf.css";

// 書架：書背直立排在架上，點一本會抽出來，下面顯示作者和短評
export type Book = {
  title: string;
  author: string;
  color: string;
  /** 書背高度（%）與厚度（px），讓書架看起來不整齊才像真的 */
  h: number;
  w: number;
  href?: string;
  note?: string;
};

export default function Bookshelf({ books }: { books: Book[] }) {
  const [pick, setPick] = useState<number | null>(null);
  const b = pick === null ? null : books[pick];
  return (
    <div className="bs">
      <div className="bs-stage">
      <div className="bs-shelf">
        {books.map((book, i) => (
          <button
            key={book.title}
            type="button"
            className={`bs-book ${pick === i ? "is-out" : ""}`}
            style={{
              ["--c" as string]: book.color,
              height: `${book.h}%`,
              width: `${book.w}px`,
            }}
            onClick={() => setPick(pick === i ? null : i)}
            aria-pressed={pick === i}
            aria-label={`${book.title}，${book.author}`}
          >
            <span className="t">{book.title}</span>
          </button>
        ))}
        {/* 書擋：一塊地科人會撿回家的石頭 */}
        <svg className="bs-rock" viewBox="0 0 80 60" aria-hidden="true">
          <path d="M6 58 L10 30 L26 12 L50 8 L70 24 L76 58 Z" />
          <path d="M26 12 L34 32 L10 30 M34 32 L50 8 M34 32 L56 40 L70 24 M56 40 L76 58 M34 32 L30 58" className="ln" />
        </svg>
      </div>
      <div className="bs-board" aria-hidden="true" />
      </div>
      <div className="bs-info" aria-live="polite">
        {b ? (
          <>
            <p className="t" style={{ ["--c" as string]: b.color }}>
              {b.href ? <Link href={b.href}>{b.title} →</Link> : b.title}
            </p>
            <p className="a">{b.author}</p>
            {b.note ? <p className="n">{b.note}</p> : null}
          </>
        ) : (
          <p className="hint font-mono-label">{"// 點一本書抽出來看看"}</p>
        )}
      </div>
    </div>
  );
}
