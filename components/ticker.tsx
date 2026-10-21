const items = [
  "● 來杯好茶の日常碎念",
  "▲ 來杯咖啡の學習日常",
  "■ 來杯果汁の生活影像",
  "● NOW BREWING",
  "▲ 上課筆記持續更新中",
  "■ WILSON'S NOTES",
  "▲",
];

// 黃色跑馬燈：內容重複兩次，捲到一半時無縫接回開頭
export default function Ticker() {
  const line = items.join("　");
  return (
    <div
      className="overflow-hidden border-b-4 border-foreground bg-bh-yellow text-bh-ink font-mono-label text-sm font-bold"
      aria-hidden="true"
    >
      <div className="ticker-track">
        <span className="whitespace-nowrap py-2">　{line}</span>
        <span className="whitespace-nowrap py-2">　{line}</span>
      </div>
    </div>
  );
}
