import { play } from "./sound";
import { reducedMotion } from "./util";

/** نص صغير بيطلع فوق العنصر وبيختفي (+React.js). الحركة pop-up بـ keyframes.css */
function popText(anchor: Element, text: string) {
  const rect = anchor.getBoundingClientRect();
  const pop = document.createElement("span");
  pop.className = "pop-text";
  pop.textContent = text;
  pop.style.left = `${rect.left + rect.width / 2}px`;
  pop.style.top = `${rect.top - 18}px`;
  pop.style.translate = "-50% 0";
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

const CONFETTI_COLORS = ["#FFC83D", "#3FE0C5", "#FF5AD9", "#5462E8", "#FFFFFF", "#FF6B70"];

/** مربعات ملوّنة بتنفجر من النقطة (x, y) وبتوقع. بدون أي شي مع reduced motion */
export function confetti(x: number, y: number, count = 36) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    piece.className = "confetto";
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 170;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 110;
    const animation = piece.animate(
      [
        { transform: "translate(0, 0)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 240}px)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2, .6, .4, 1)" },
    );
    animation.onfinish = () => piece.remove();
  }
}

let toastTimer = 0;

/** رسالة فوق الصفحة لـ 3.6 ثانية. العنصر role="status"، فقارئ الشاشة بيقرأها */
export function toast(message: string) {
  const el = document.querySelector<HTMLElement>(".toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-on");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("is-on"), 3600);
}

/**
 * أي عنصر عليه data-pop="React.js|Next.js|…": كل كبسة بتطلّع الكلمة اللي بعدها وبترجع للأولى.
 * العدّاد بـ WeakMap لكل عنصر (المرجع بيعمل closure لكل block).
 */
export function initPops() {
  const controller = new AbortController();
  const counts = new WeakMap<Element, number>();

  document.addEventListener(
    "click",
    (e) => {
      const block =
        e.target instanceof Element ? e.target.closest<HTMLElement>("[data-pop]") : null;
      if (!block) return;

      const words = (block.dataset.pop ?? "").split("|");
      const n = counts.get(block) ?? 0;
      counts.set(block, n + 1);
      const word = words[n % words.length];

      block.classList.remove("is-bump");
      void block.offsetWidth; // reflow: مشان القفزة تعيد حتى لو الكبسات ورا بعض
      block.classList.add("is-bump");
      play("bump");
      popText(block, word.startsWith("+") ? word : `+${word}`);
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
