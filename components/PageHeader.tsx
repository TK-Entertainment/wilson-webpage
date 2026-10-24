import GlitchText from "@/components/glitchtext";

// 各欄目共用的頁首：左邊粗黑體標題，右邊一塊斜切深藍色塊＋金、橘斜線，色塊裡是空心英文字
export default function PageHeader({
  code,
  title,
  en,
  color,
}: {
  code: string;
  title: string;
  en: string;
  color: string;
}) {
  return (
    <header className="ph" style={{ ["--c" as string]: color }}>
      <p className="ph-code font-mono-label">{code}</p>
      <h1 className="ph-title">
        <GlitchText text={title} />
      </h1>
      <div
        className="ph-slab"
        aria-hidden="true"
        style={{ ["--len" as string]: en.length }}
      >
        <span>{en}</span>
      </div>
    </header>
  );
}
