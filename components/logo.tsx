// 茶杯與熱氣：「威爾森的生活札記」的標誌，顏色跟著文字 (currentColor)
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M11 3.5c-1.6 1.6 1.6 3.2 0 4.8" />
      <path d="M16 3.5c-1.6 1.6 1.6 3.2 0 4.8" />
      <path d="M6 12h16v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z" />
      <path d="M22 14h1.5a3.5 3.5 0 0 1 0 7H21" />
      <path d="M4 28.5h22" />
    </svg>
  );
}
