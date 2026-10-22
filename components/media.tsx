import type { ReactNode } from "react";

// 相簿用的 MDX 元件：在 .mdx 裡直接寫 <Photos>、<Video>、<YouTube>

// 照片牆：裡面放 Markdown 圖片（每張之間空一行）
export function Photos({ children }: { children: ReactNode }) {
  return <div className="photos nd-not-prose">{children}</div>;
}

// 影片檔（建議 25MB 以下，放在 public/img/gallery/<相簿>/）
export function Video({
  src,
  caption,
  poster,
}: {
  src: string;
  caption?: string;
  poster?: string;
}) {
  return (
    <figure className="nd-not-prose my-6">
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="w-full border-2 border-foreground bg-bh-ink"
      />
      {caption ? (
        <figcaption className="mt-2 font-mono-label text-xs font-bold">
          {caption}
        </figcaption>
      ) : (
        <></>
      )}
    </figure>
  );
}

// YouTube 影片：id 是網址 watch?v= 後面那串
export function YouTube({ id, caption }: { id: string; caption?: string }) {
  return (
    <figure className="nd-not-prose my-6">
      <div className="aspect-video w-full border-2 border-foreground bg-bh-ink">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={caption ?? "YouTube 影片"}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 font-mono-label text-xs font-bold">
          {caption}
        </figcaption>
      ) : (
        <></>
      )}
    </figure>
  );
}
