"use client";

import { useState } from "react";
import "./shelf.css";

// 放映廳：點一張電影票，銀幕放出那部片的劇照。
// 劇照來自 TMDB（The Movie Database），版權屬各片商；只在這裡展示、附上來源連結。
export type Movie = { title: string; year: string; tmdb: string; still: string };

export default function Cinema({ movies }: { movies: Movie[] }) {
  const [i, setI] = useState(0);
  const m = movies[i];
  return (
    <div className="cn">
      <div className="cn-hall">
        <i className="cn-curtain l" aria-hidden="true" />
        <i className="cn-curtain r" aria-hidden="true" />
        <i className="cn-valance" aria-hidden="true" />
        <div className="cn-screen">
          {/* key 換片時重新播放「開燈」動畫 */}
          <img
            key={m.still}
            src={`https://image.tmdb.org/t/p/w780/${m.still}`}
            alt={`《${m.title}》劇照`}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <i key={`b${i}`} className="cn-beam" aria-hidden="true" />
        <div className="cn-seats" aria-hidden="true" />
      </div>
      <p className="cn-now font-mono-label" aria-live="polite">
        <span>
          NOW SHOWING // <b>{m.title}</b>（{m.year}）
        </span>
        <a href={`https://www.themoviedb.org/movie/${m.tmdb}`} target="_blank" rel="noopener noreferrer">
          劇照：TMDB ↗
        </a>
      </p>
      <ul className="cn-tickets">
        {movies.map((mv, k) => (
          <li key={mv.tmdb}>
            <button
              type="button"
              className={`cn-ticket ${k === i ? "is-on" : ""}`}
              onClick={() => setI(k)}
              aria-pressed={k === i}
            >
              <span className="stub font-mono-label">
                ADMIT
                <br />
                ONE
              </span>
              <span className="body">
                <b>{mv.title}</b>
                <span className="font-mono-label">
                  {mv.year} · SEAT {String.fromCharCode(65 + Math.floor(k / 8))}-{String((k % 8) + 1).padStart(2, "0")}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="cn-credit">
        劇照來源：<a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a>，版權屬各電影公司所有。
      </p>
    </div>
  );
}
