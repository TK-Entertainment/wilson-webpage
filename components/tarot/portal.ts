// 進出抽牌頁的「穿越」轉場
// 1. openPortal：紫色圓從點擊位置擴散蓋滿畫面，中央的牌背旋轉放大，然後換頁
// 2. closePortal：抽牌頁載入後，紫色圓往中間收起，露出牌桌
// 遮罩直接掛在 <body> 上（不歸 React 管），所以換頁時會留著，由新頁面負責收掉

const ID = "tarot-portal";

function reduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function build() {
  const el = document.createElement("div");
  el.id = ID;
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = `
    <div class="tp-stars">${Array.from({ length: 14 }, (_, i) => `<i style="--k:${i}"></i>`).join("")}</div>
    <img class="tp-card" src="/img/tarot/back.webp" alt="" />
    <p class="tp-line font-mono-label">&gt; 開啟牌桌 ......<span class="tp-ok"> OK</span></p>
  `;
  document.body.appendChild(el);
  return el;
}

export function openPortal(x: number, y: number, go: () => void) {
  if (reduced() || document.getElementById(ID)) {
    go();
    return;
  }
  const el = build();
  // 圓要大到能蓋住離點擊位置最遠的角落
  const r = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  el.style.setProperty("--x", `${x}px`);
  el.style.setProperty("--y", `${y}px`);
  el.animate(
    [
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(${r}px at ${x}px ${y}px)` },
    ],
    { duration: 650, easing: "cubic-bezier(.6,0,.3,1)", fill: "forwards" },
  );
  el.classList.add("is-opening");
  window.setTimeout(go, 900);
}

export function closePortal() {
  if (reduced()) {
    document.getElementById(ID)?.remove();
    return;
  }
  // 直接打網址進來時也播收起的那一半
  const el = document.getElementById(ID) ?? build();
  el.classList.remove("is-opening");
  el.classList.add("is-closing");
  const r = Math.hypot(innerWidth, innerHeight) / 2;
  const anim = el.animate(
    [
      { clipPath: `circle(${r}px at 50% 50%)` },
      { clipPath: `circle(${r}px at 50% 50%)`, offset: 0.35 },
      { clipPath: "circle(0px at 50% 50%)" },
    ],
    { duration: 1100, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" },
  );
  anim.onfinish = () => el.remove();
}
