// 會偶爾錯位閃爍的文字（樣式在 app/global.css 的 .glitch）
export default function GlitchText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`glitch vsplit ${className ?? ""}`} data-text={text}>
      {text}
    </span>
  );
}
