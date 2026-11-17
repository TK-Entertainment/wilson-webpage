"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./archive.css";

// 收藏庫：書、歌、電影共用一套「檔案」介面（和首頁照片同一套：細框＋四角對位記號、等寬字標籤、換檔時錯位閃一下）
// 圖片來源：書封＝博客來、專輯封面＝Spotify、海報與劇照＝TMDB，版權屬原作者／出版社／片商。
export type ArchiveItem = {
  title: string;
  sub: string;
  year?: string;
  img: string;
  /** 電影：橫式劇照 */
  still?: string;
  /** 歌：Spotify 歌曲 id */
  spotify?: string;
  href?: string;
  note?: string;
  src: { label: string; url: string };
};
export type ArchiveTab = { key: string; kanji: string; en: string; items: ArchiveItem[] };

type Controller = {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  addListener: (
    ev: string,
    cb: (e: { data: { isPaused: boolean; position: number; duration: number } }) => void,
  ) => void;
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

const pad = (n: number) => String(n).padStart(2, "0");
const mmss = (ms: number) => `${pad(Math.floor(ms / 60000))}:${pad(Math.floor(ms / 1000) % 60)}`;

export default function Archive({ tabs }: { tabs: ArchiveTab[] }) {
  const [t, setT] = useState(0);
  const [sel, setSel] = useState<number[]>(tabs.map(() => 0));
  const [swap, setSwap] = useState(0);
  const tab = tabs[t];
  const i = sel[t];
  const it = tab.items[i];
  const isMusic = !!it.spotify;

  // ---- Spotify：切到「音」就先準備播放器，點歌的當下才能直接播（瀏覽器只允許點擊當下開始播放）----
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<Controller | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState({ p: 0, d: 0 });
  const [hint, setHint] = useState(false);
  useEffect(() => {
    if (!isMusic || ctrl.current) return;
    let alive = true;
    loadApi().then((api) => {
      if (!alive || !host.current || ctrl.current) return;
      const box = document.createElement("div");
      host.current.appendChild(box);
      api.createController(box, { uri: `spotify:track:${it.spotify}`, width: "100%", height: 80 }, (c) => {
        ctrl.current = c;
        setReady(true);
        c.addListener("playback_update", (e) => {
          setPlaying(!e.data.isPaused);
          setPos({ p: e.data.position, d: e.data.duration });
          if (!e.data.isPaused) setHint(false);
        });
      });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMusic]);

  const pick = (k: number) => {
    setSel((s) => s.map((v, j) => (j === t ? k : v)));
    setSwap((n) => n + 1);
    const item = tab.items[k];
    if (item.spotify && ctrl.current) {
      ctrl.current.loadUri(`spotify:track:${item.spotify}`);
      ctrl.current.play();
      setHint(false);
      window.setTimeout(() => setHint(true), 1800);
    }
  };

  return (
    <div className="ax">
      <div className="ax-tabs font-mono-label" role="tablist">
        {tabs.map((tb, k) => (
          <button
            key={tb.key}
            role="tab"
            type="button"
            aria-selected={k === t}
            className={k === t ? "on" : ""}
            onClick={() => {
              setT(k);
              setSwap((n) => n + 1);
            }}
          >
            <span className="kj">{tb.kanji}</span>
            {tb.en}
            <em>{pad(tb.items.length)}</em>
          </button>
        ))}
      </div>

      {/* ---- 目前這一筆 ---- */}
      <div className={`ax-view ${it.still ? "is-wide" : ""}`}>
        <div key={`${t}-${i}-${swap}`} className="ax-frame ax-swap">
          <span className="ax-img">
            <img src={it.still ?? it.img} alt={`${it.title}${it.still ? " 劇照" : ""}`} referrerPolicy="no-referrer" />
            {isMusic ? (
              <span
                className={`ax-disc ${playing ? "spin" : ""}`}
                aria-hidden="true"
                style={{ backgroundImage: `url(${it.img})` }}
              />
            ) : null}
          </span>
          <i />
          <i />
          <i />
          <i />
          {it.still ? (
            <span className="ax-rec font-mono-label" aria-hidden="true">
              ● REC <b>{pad(i + 1)}</b>
            </span>
          ) : null}
        </div>

        <div className="ax-meta">
          <p className="ax-cmd font-mono-label">
            &gt; open archive/{tab.key}/{pad(i + 1)}
            <span className="cur" aria-hidden="true" />
          </p>
          <h3 className="ax-title">{it.href ? <Link href={it.href}>{it.title} →</Link> : it.title}</h3>
          <dl className="font-mono-label">
            {it.sub ? (
              <div>
                <dt>{tab.key === "music" ? "ARTIST" : "AUTHOR"}</dt>
                <dd>{it.sub}</dd>
              </div>
            ) : null}
            {it.year ? (
              <div>
                <dt>YEAR</dt>
                <dd>{it.year}</dd>
              </div>
            ) : null}
            {it.note ? (
              <div>
                <dt>NOTE</dt>
                <dd>{it.note}</dd>
              </div>
            ) : null}
            <div>
              <dt>SRC</dt>
              <dd>
                <a href={it.src.url} target="_blank" rel="noopener noreferrer">
                  {it.src.label} ↗
                </a>
              </dd>
            </div>
            {isMusic ? (
              <div>
                <dt>STATUS</dt>
                <dd className={playing ? "live" : ""}>
                  {playing ? "▶ PLAYING" : ready ? "■ STANDBY" : "… LOADING"}
                  {pos.d ? ` ${mmss(pos.p)} / ${mmss(pos.d)}` : ""}
                </dd>
              </div>
            ) : null}
          </dl>
          {isMusic ? (
            <div className="ax-ctl font-mono-label">
              <button
                type="button"
                disabled={!ready}
                onClick={() => (playing ? ctrl.current?.togglePlay() : pick(i))}
              >
                {playing ? "❚❚ PAUSE" : "▶ PLAY"}
              </button>
              {hint && !playing ? <span>沒聲音的話，按下方播放器的 ▶</span> : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Spotify 播放器（灰階，和頁面一致）；只在「音」顯示 */}
      <div ref={host} className="ax-player" hidden={!isMusic} />

      {/* ---- 清單：平常灰階、選到才上色 ---- */}
      <ul className={`ax-grid g-${tab.key}`}>
        {tab.items.map((x, k) => (
          <li key={x.title + k}>
            <button type="button" className={k === i ? "on" : ""} onClick={() => pick(k)} aria-pressed={k === i}>
              <span className="th">
                <img src={x.img} alt="" loading="lazy" referrerPolicy="no-referrer" />
              </span>
              <span className="cap font-mono-label">
                <em>No.{pad(k + 1)}</em>
                {x.year ? ` // ${x.year}` : ""}
              </span>
              <b>{x.title}</b>
            </button>
          </li>
        ))}
      </ul>
      <p className="ax-credit font-mono-label">
        {"// 圖片來源：書封 博客來、專輯封面 Spotify、海報與劇照 TMDB；版權屬原出版社、唱片公司與片商"}
      </p>
    </div>
  );
}
