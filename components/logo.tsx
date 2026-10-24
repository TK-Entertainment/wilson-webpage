// 三原形：橘圓、金方、三角（跟文字同色，深淺模式都看得到）
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 16" className={className} aria-hidden="true">
      <circle cx="7" cy="8" r="7" fill="#e2782d" />
      <rect x="17" y="1" width="14" height="14" fill="#d6a53c" />
      <path d="M41 1 48 15H34z" fill="currentColor" />
    </svg>
  );
}
