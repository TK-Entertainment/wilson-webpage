"use client";

import { useEffect, useRef, useState } from "react";
import "./shelf.css";

// 唱片機：從唱片箱挑一張，放上唱盤；聲音來自 Spotify 官方播放器（iFrame API），
// 播放時唱盤轉動、唱臂落下。沒登入 Spotify 可試聽約 30 秒。歌詞有版權，不放。
export type Song = { title: string; id: string };
export type Artist = { name: string; color: string; songs: Song[] };

type Controller = {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  addListener: (ev: string, cb: (e: { data: { isPaused: boolean } }) => void) => void;
};
type IFrameAPI = {
  createController: (
    el: HTMLElement,
    opts: { uri: string; width: string; height: number },
    cb: (c: Controller) => void,
  ) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
    __spotifyApi?: IFrameAPI;
  }
}

function loadApi(): Promise<IFrameAPI> {
  return new Promise((resolve) => {
    if (window.__spotifyApi) return resolve(window.__spotifyApi);
    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyApi = api;
      resolve(api);
    };
    if (!document.querySelector("script[data-spotify-api]")) {
      const s = document.createElement("script");
      s.src = "https://open.spotify.com/embed/iframe-api/v1";
      s.async = true;
      s.dataset.spotifyApi = "";
      document.body.appendChild(s);
    }
  });
}

export default function RecordPlayer({ artists }: { artists: Artist[] }) {
  const songs = artists.flatMap((a) => a.songs.map((s) => ({ ...s, artist: a.name, color: a.color })));
  const [cur, setCur] = useState<(typeof songs)[number] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<Controller | null>(null);
  const pending = useRef<string | null>(null);

  // 唱片機捲進畫面時就先把 Spotify 播放器準備好，點唱片時才能馬上播（瀏覽器只允許「點擊當下」開始播放）
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let alive = true;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      loadApi().then((api) => {
        if (!alive || !host.current || ctrl.current) return;
        const box = document.createElement("div");
        host.current.appendChild(box);
        api.createController(box, { uri: `spotify:track:${songs[0].id}`, width: "100%", height: 80 }, (c) => {
          ctrl.current = c;
          setReady(true);
          c.addListener("playback_update", (e) => {
            setPlaying(!e.data.isPaused);
            if (!e.data.isPaused) setHint(false);
          });
          if (pending.current) {
            c.loadUri(pending.current);
            c.play();
          }
        });
      });
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (s: (typeof songs)[number]) => {
    setCur(s);
    setHint(false);
    const uri = `spotify:track:${s.id}`;
    if (ctrl.current) {
      ctrl.current.loadUri(uri);
      ctrl.current.play();
    } else {
      pending.current = uri;
    }
    // 有些瀏覽器擋自動播放：一秒半後還沒開始，就提示按播放器上的 ▶
    window.setTimeout(() => setHint(true), 1500);
  };

  return (
    <div className="rp">
      <div className="rp-deck">
        <div className={`rp-platter ${playing ? "is-playing" : ""}`}>
          <div className={`rp-vinyl ${cur ? "is-on" : ""}`} style={{ ["--c" as string]: cur?.color ?? "var(--gold)" }}>
            <span className="rp-label">
              <b>{cur ? cur.artist : "WILSON"}</b>
              <i>{cur ? cur.title : "SIDE A"}</i>
            </span>
          </div>
        </div>
        {/* 唱臂：座標和唱盤共用 160×100 的畫布，繞軸心旋轉：收著 → 待命 → 落在唱片外圈 */}
        <svg className="rp-armsvg" viewBox="0 0 160 100" aria-hidden="true">
          <g className={`rp-arm ${cur ? (playing ? "is-down" : "is-ready") : ""}`}>
            <line x1="138" y1="14" x2="138" y2="74" className="rod" />
            <rect x="133" y="70" width="10" height="14" rx="1.5" className="head" />
          </g>
          <circle cx="138" cy="14" r="7" className="pivot" />
        </svg>
        <button
          type="button"
          className="rp-btn font-mono-label"
          disabled={!ready || !cur}
          onClick={() => ctrl.current?.togglePlay()}
          aria-label={playing ? "暫停" : "播放"}
        >
          {playing ? "❚❚ PAUSE" : "▶ PLAY"}
        </button>
        <span className={`rp-led ${playing ? "on" : ""}`} aria-hidden="true" />
      </div>

      <div className="rp-now font-mono-label" aria-live="polite">
        {cur ? `${playing ? "NOW PLAYING" : "ON DECK"} // ${cur.artist}〈${cur.title}〉` : "// 從下面的唱片箱挑一張放上去"}
        {cur && hint && !playing ? <b className="rp-hint">沒聲音的話，按下面播放器的 ▶</b> : null}
      </div>
      <div ref={host} className="rp-embed" />

      <ul className="rp-crate">
        {songs.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`rp-sleeve ${cur?.id === s.id ? "is-out" : ""}`}
              style={{ ["--c" as string]: s.color }}
              onClick={() => choose(s)}
              aria-pressed={cur?.id === s.id}
              aria-label={`播放 ${s.artist}〈${s.title}〉`}
            >
              <span className="disc" aria-hidden="true" />
              <span className="t">{s.title}</span>
              <span className="a">{s.artist}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
