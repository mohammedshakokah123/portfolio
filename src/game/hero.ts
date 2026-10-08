import { play } from "./sound";
import { wait } from "./util";

type HeroEls = { wrap: HTMLElement; body: HTMLElement; sprite: HTMLElement };

let els: HeroEls | null = null;
let moving = false;

function state(next: "idle" | "run" | "jump") {
  if (els) els.sprite.dataset.state = next;
}

/** الحركة الأفقية عالـ wrap، والقفزة عالـ body اللي جوّاه: هيك بيقدر يقفز وهو عم يركض */
function move(x: number, ms: number) {
  if (!els) return;
  els.wrap.style.transition = ms ? `transform ${ms}ms linear` : "none";
  els.wrap.style.transform = `translateX(${x}px)`;
}

/** مكان الوقوف: 6% من عرض الشاشة، بين 14 و140px */
const homeX = () => Math.round(Math.min(Math.max(14, window.innerWidth * 0.06), 140));

export const hero = {
  isMoving: () => moving,

  /** بمكانه فوراً (أول تحميل مع reduced motion، وبعد الـ resize) */
  place() {
    moving = false;
    move(homeX(), 0);
    state("idle");
  },

  runOff() {
    moving = true;
    state("run");
    move(window.innerWidth + 60, 620);
  },

  /** برّا الشاشة عاليسار، جاهز يفوت */
  toStart() {
    move(-140, 0);
    state("run");
  },

  async runIn(ms = 560) {
    if (!els) return;
    moving = true;
    state("run");
    void els.wrap.offsetWidth; // reflow: مشان الـ transition يبلّش من -140 مش من المكان القديم
    move(homeX(), ms);
    await wait(ms);
    moving = false;
    if (!els?.body.classList.contains("is-jumping")) state("idle");
  },

  jump() {
    if (!els || els.body.classList.contains("is-jumping")) return;
    const { body } = els;
    state("jump");
    body.classList.add("is-jumping");
    play("jump");
    setTimeout(() => {
      body.classList.remove("is-jumping");
      state(moving ? "run" : "idle");
    }, 560);
  },
};

export function initHero() {
  const wrap = document.querySelector<HTMLElement>(".hero-wrap");
  const body = wrap?.querySelector<HTMLElement>(".hero");
  const sprite = wrap?.querySelector<HTMLElement>(".hero-sprite");
  if (!wrap || !body || !sprite) return () => {};

  els = { wrap, body, sprite };
  const controller = new AbortController();
  wrap.addEventListener("click", () => hero.jump(), { signal: controller.signal });

  return () => {
    controller.abort();
    els = null;
    moving = false;
  };
}
