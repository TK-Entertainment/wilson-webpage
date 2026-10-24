// 進出抽牌頁的「穿越」轉場
// 1. openPortal：紫色圓從點擊位置擴散蓋滿畫面，中央的牌背旋轉放大，然後換頁
// 2. closePortal：抽牌頁載入後，紫色圓收起，露出牌桌
// 遮罩直接掛在 <body> 上（不歸 React 管），所以換頁時會留著，由新頁面負責收掉
// 圓用 transform: scale 做（交給顯示卡處理），不用 clip-path，否則每一格都要重算整個畫面而卡頓

const ID = "tarot-portal";
const BACK = "/img/tarot/back.webp";

function reduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// 首頁先把牌背圖載好，點下去的瞬間就不用等下載和解碼
export function preloadPortal() {
  const img = new Image();
  img.src = BACK;
  img.decode?.().catch(() => {});
}

function build(x: number, y: number) {
  const el = document.createElement("div");
  el.id = ID;
  el.setAttribute("aria-hidden", "true");
  // 圓的半徑要能蓋住離圓心最遠的角落
  const r = Math.ceil(
    Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)),
  );
  el.innerHTML = `
    <div class="tp-disc" style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px"></div>
    <div class="tp-body">
      <div class="tp-stars">${Array.from({ length: 14 }, (_, i) => `<i style="--k:${i}"></i>`).join("")}</div>
      <img class="tp-card" src="${BACK}" alt="" decoding="sync" />
      <p class="tp-line font-mono-label">&gt; 開啟牌桌 ......<span class="tp-ok"> OK</span></p>
    </div>
  `;
  document.body.appendChild(el);
  return el;
}

export function openPortal(x: number, y: number, go: () => void) {
  if (reduced() || document.getElementById(ID)) {
    go();
    return;
  }
  const el = build(x, y);
  el.querySelector(".tp-disc")!.animate(
    [{ transform: "scale(0)" }, { transform: "scale(1)" }],
    { duration: 600, easing: "cubic-bezier(.6,0,.3,1)", fill: "forwards" },
  );
  el.classList.add("is-opening");
  // 換頁那一下瀏覽器會短暫停頓（約 0.1 秒），所以等圓完全蓋滿、牌背轉完、畫面靜止時才換頁，停頓就看不出來
  window.setTimeout(go, 950);
}

export function closePortal() {
  if (reduced()) {
    document.getElementById(ID)?.remove();
    return;
  }
  // 直接打網址進來時也播收起的那一半
  const el =
    document.getElementById(ID) ?? build(innerWidth / 2, innerHeight / 2);
  // 等新頁面畫好第一格再開始收，避免跟頁面初始化搶時間
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      el.classList.remove("is-opening");
      el.classList.add("is-closing");
      el.querySelector(".tp-body")!.animate(
        [{ opacity: 1 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }],
        { duration: 700, fill: "forwards" },
      );
      const anim = el
        .querySelector(".tp-disc")!
        .animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1)", offset: 0.35 },
            { transform: "scale(0)" },
          ],
          {
            duration: 1000,
            easing: "cubic-bezier(.7,0,.3,1)",
            fill: "forwards",
          },
        );
      anim.onfinish = () => el.remove();
    }),
  );
}
