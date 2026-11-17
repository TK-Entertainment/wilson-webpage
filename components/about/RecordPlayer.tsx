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
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<Controller | null>(null);

  useEffect(() => {
    if (!cur) return;
    const uri = `spotify:track:${cur.id}`;
    if (ctrl.current) {
      ctrl.current.loadUri(uri);
      ctrl.current.play();
      return;
    }
    let alive = true;
    loadApi().then((api) => {
      if (!alive || !host.current) return;
      const el = document.createElement("div");
      host.current.appendChild(el);
      api.createController(el, { uri, width: "100%", height: 80 }, (c) => {
        ctrl.current = c;
        setReady(true);
        c.addListener("playback_update", (e) => setPlaying(!e.data.isPaused));
        c.addListener("ready", () => c.play());
      });
    });
    return () => {
      alive = false;
    };
  }, [cur]);

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
          disabled={!ready}
          onClick={() => ctrl.current?.togglePlay()}
          aria-label={playing ? "暫停" : "播放"}
        >
          {playing ? "❚❚ PAUSE" : "▶ PLAY"}
        </button>
        <span className={`rp-led ${playing ? "on" : ""}`} aria-hidden="true" />
      </div>

      <div className="rp-now font-mono-label" aria-live="polite">
        {cur ? `NOW PLAYING // ${cur.artist}〈${cur.title}〉` : "// 從下面的唱片箱挑一張放上去"}
      </div>
      <div ref={host} className="rp-embed" />

      <ul className="rp-crate">
        {songs.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`rp-sleeve ${cur?.id === s.id ? "is-out" : ""}`}
              style={{ ["--c" as string]: s.color }}
              onClick={() => setCur(s)}
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
