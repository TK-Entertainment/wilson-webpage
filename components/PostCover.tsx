// 沒有封面照片時，依文章網址產生固定的封面（同一篇永遠長一樣）：深藍底＋斜切的金、橘色帶
const STRIPE = ["#e2782d", "#d6a53c", "#4cb8b0"];

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
  const main = STRIPE[h % STRIPE.length];
  const thin =
    STRIPE[(h >>> 4) % STRIPE.length] === main
      ? "#efe4c8"
      : STRIPE[(h >>> 4) % STRIPE.length];
  const x = 18 + ((h >>> 8) % 46);
  const ring = (h >>> 14) % 3;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#26304f]"
      aria-hidden="true"
    >
      <span
        className="absolute top-[-10%] h-[120%] w-[22%] -skew-x-12"
        style={{ left: `${x}%`, background: main }}
      />
      <span
        className="absolute top-[-10%] h-[120%] w-[4%] -skew-x-12"
        style={{ left: `${x + 28}%`, background: thin }}
      />
      <span
        className="absolute bottom-[12%] right-[10%] aspect-square w-[22%] border-[3px] border-[#efe4c8]"
        style={{
          borderRadius: ring === 0 ? "50%" : 0,
          transform: ring === 2 ? "rotate(45deg)" : undefined,
        }}
      />
    </div>
  );
}
