// 包浩斯三原形：紅圓、黃方、藍三角
export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 16" className={className} aria-hidden="true">
      <circle cx="7" cy="8" r="7" fill="#d9302a" />
      <rect x="17" y="1" width="14" height="14" fill="#f2c230" />
      <path d="M41 1 48 15H34z" fill="#1f4fa3" />
    </svg>
  );
}
