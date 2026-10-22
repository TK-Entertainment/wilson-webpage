// 沒有封面照片時，依文章網址產生固定的包浩斯幾何封面（同一篇永遠長一樣）
const BG = ["#d9302a", "#1f4fa3", "#f2c230", "#178046", "#7b3fc4", "#f2721c"];
const FG = ["#141414", "#efece6", "#f2c230", "#d9302a", "#1f4fa3"];

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export default function PostCover({ seed }: { seed: string }) {
  const h = hash(seed);
  const pick = <T,>(list: T[], shift: number) =>
    list[(h >>> shift) % list.length];
  const bg = pick(BG, 5);
  const others = FG.filter((c) => c !== bg);
  const c1 = others[(h >>> 3) % others.length];
  const c2 =
    others[(h >>> 7) % others.length] === c1
      ? others[(h >>> 11) % others.length]
      : others[(h >>> 7) % others.length];
  const flip = (h >>> 13) % 2 === 1;

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: bg }}
      aria-hidden="true"
    >
      <span
        className="absolute aspect-square w-[70%] rounded-full"
        style={{
          background: c1,
          top: "-18%",
          [flip ? "left" : "right"]: "-12%",
        }}
      />
      <span
        className="absolute aspect-square w-[42%]"
        style={{
          background: c2,
          bottom: "-6%",
          [flip ? "right" : "left"]: "8%",
          clipPath: (h >>> 17) % 2 ? "polygon(50% 0,100% 100%,0 100%)" : "none",
        }}
      />
      <span
        className="absolute h-[10%] w-full"
        style={{ background: "#141414", top: `${48 + ((h >>> 21) % 20)}%` }}
      />
    </div>
  );
}
