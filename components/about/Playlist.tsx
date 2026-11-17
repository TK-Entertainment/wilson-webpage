"use client";

import { useState } from "react";

// 歌單：點「試聽」才載入 Spotify 官方播放器（沒登入可聽約 30 秒，登入可聽完整首）
// 歌詞有版權，不放在網站上
export type Song = { title: string; id: string };
export type Artist = { name: string; songs: Song[] };

export default function Playlist({ artists }: { artists: Artist[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="mt-3 border-t-4 border-foreground">
      {artists.map((a) =>
        a.songs.map((s, i) => (
          <li key={s.id} className="border-b border-foreground/20 py-2.5">
            <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_auto] items-baseline gap-3">
              <span className="truncate text-sm text-muted-foreground">{i === 0 ? a.name : ""}</span>
              <span className="font-bold">{s.title}</span>
              <button
                type="button"
                onClick={() => setOpen(open === s.id ? null : s.id)}
                aria-expanded={open === s.id}
                aria-label={`${open === s.id ? "收起" : "試聽"}：${a.name}〈${s.title}〉`}
                className="border-2 border-foreground px-2 py-0.5 font-mono-label text-xs font-bold transition-colors hover:bg-[var(--rose)] hover:text-[#14182b]"
              >
                {open === s.id ? "收起" : "▶ 試聽"}
              </button>
            </div>
            {open === s.id ? (
              <iframe
                title={`Spotify：${a.name}〈${s.title}〉`}
                src={`https://open.spotify.com/embed/track/${s.id}?utm_source=generator`}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="mt-2.5 block rounded-xl border-0"
              />
            ) : null}
          </li>
        )),
      )}
    </ul>
  );
}
