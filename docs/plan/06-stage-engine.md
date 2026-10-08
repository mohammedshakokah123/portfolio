# 06: محرك المراحل (router، الشخصية، الـ wipe، الصوت، الـ pause)

## الهدف
التنقل بين المراحل شغّال متل المرجع بالضبط: الشخصية بتركض وبتطلع من يمين الشاشة، الـ wipe بيغطي الشاشة بكسل بكسل، بتطلع بطاقة "Stage 2 / Skills"، بينكشف المشهد، والشخصية بتفوت من اليسار. ومعها: الأسهم، Back/Forward، الروابط المباشرة، الصوت، وقائمة الـ pause. المراحل نفسها لسا فاضية (محتواها بالمراحل 07 لـ 10).

## الفكرة
- **المحرك modules TS عادية** بـ `src/game/`، منقولة من سكربت المرجع block بـ block. بتشتغل مباشرة عالـ DOM، متل المرجع.
- **React بيرسم الـ markup وبس.** مكوّن واحد (`GameRoot`) بيشغّل المحرك بـ `useEffect` وبيوقّفه بالـ cleanup.
- **listener واحد عالـ `document`** لكل روابط المراحل (`a[href^="#"]`)، وواحد للمودالات (`[data-dialog]` و`[data-close]`). هيك أي رابط `<a href="#about">` بأي Server Component بيشتغل بدون ما يكون client.
- **كل `init*` بيرجّع cleanup.** بالـ dev الـ Strict Mode بيشغّل الـ effect مرتين، وبدون cleanup الكبسة بتعمل انتقالين.

```
GameRoot (client) ──► initEngine() ──► initHero()    الشخصية + الكبس عليها
                                   ├─► initWipe()    الـ canvas والبطاقة
                                   ├─► initDialogs() فتح وتسكير الـ <dialog>
                                   └─► initRouter()  الروابط، الأسهم، popstate، أول عرض
                                              │
                          go(id) ─► render(id) ─► html[data-stage] + stageStore ─► HudNav / GroundBar / PauseMenu
```

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 995–1023 CSS المراحل | `src/styles/pixel/stages.css` |
| 1246–1303 CSS الـ wipe، البطاقة، الـ toast، المودال، الـ pause | `src/styles/pixel/overlays.css` |
| 1879–1889 HTML الـ wipe والـ toast والـ announcer | `src/components/layout/overlays.tsx` |
| 1892–1913 HTML قائمة الـ pause | `src/components/game/pause-menu.tsx` |
| 1500–1505 (شكل `stage-head`) | `src/components/stages/stage.tsx` |
| 2055–2057 `wait` و`reduced` | `src/game/util.ts` |
| 2073–2130 SOUND | `src/game/sound.ts` + `src/components/game/sound-toggle.tsx` |
| 2158–2192 HERO | `src/game/hero.ts` |
| 2197–2246 WIPE والبطاقة | `src/game/wipe.ts` |
| 2251–2361 ROUTER | `src/game/router.ts` |
| 2491–2517 DIALOGS | `src/game/dialogs.ts` |
| 2599–2610 START والـ resize | `src/game/router.ts` (`initRouter`) |

## الخطوات

### 1. الـ CSS

#### `stages.css` ← 995–1023
متل ما هو، مع تعديل الـ selectors اللي بتعتمد على class الـ `<html>`:

| السطر | المرجع | بيصير |
|-------|--------|-------|
| 997 | `.js .stage { display: none; }` | `html[data-js] .stage { display: none; }` |
| 998–1003 | `.js[data-stage="home"] #home,` (والـ 5 الباقيين) | `html[data-js][data-stage="home"] #home,` (والـ 5 الباقيين) |

وبآخر الملف إضافة لصفحة الـ 404 (بتنستعمل بالمرحلة 12):
```css
/* إضافة عن المرجع: مرحلة لحالها (صفحة الـ 404) بتضل ظاهرة مهما كان data-stage */
html[data-js] .stage.stage-solo {
  display: block;
}
```

#### `overlays.css` ← 1246–1303
متل ما هو، بدون تعديل.

### 2. `src/game/util.ts`
```ts
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** بتنقرأ وقت كل استعمال (مش مرة وحدة): المستخدم ممكن يغيّر الإعداد والصفحة مفتوحة */
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

### 3. `src/game/sound.ts` ← 2073–2115
```ts
import { KEYS, readJson, writeJson } from "./persist";
import { createStore } from "./store";

export type SoundName =
  | "select"
  | "jump"
  | "gem"
  | "bump"
  | "warp"
  | "start"
  | "success"
  | "error"
  | "toggle";

/** مطفي افتراضياً. المتصفح أصلاً ما بيسمح بصوت قبل أول تفاعل */
export const soundStore = createStore<boolean>(
  typeof window !== "undefined" && readJson<unknown>(KEYS.sound, false) === true,
);

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;

function unlock() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

type ToneOptions = { type?: OscillatorType; vol?: number; slide?: number; delay?: number };

/** نغمة وحدة 8-bit: oscillator مع fade سريع. slide = انزلاق التردد (للقفزة والـ warp) */
function tone(
  freq: number,
  dur: number,
  { type = "square", vol = 0.045, slide = 0, delay = 0 }: ToneOptions = {},
) {
  if (!soundStore.get() || !ctx) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function play(name: SoundName) {
  if (!soundStore.get()) return;
  unlock();
  switch (name) {
    case "select":
      tone(880, 0.05);
      tone(1320, 0.07, { delay: 0.05 });
      break;
    case "jump":
      tone(280, 0.22, { slide: 560 });
      break;
    case "gem":
      tone(1046, 0.08);
      tone(1568, 0.16, { delay: 0.07 });
      break;
    case "bump":
      tone(150, 0.08, { type: "triangle", vol: 0.12 });
      tone(988, 0.07, { delay: 0.06 });
      tone(1319, 0.12, { delay: 0.12 });
      break;
    case "warp":
      tone(780, 0.3, { type: "triangle", slide: -620, vol: 0.07 });
      break;
    case "start":
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.1, { delay: i * 0.08 }));
      break;
    case "success":
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.12, { delay: i * 0.09 }));
      break;
    case "error":
      tone(170, 0.18, { type: "sawtooth", vol: 0.035 });
      break;
    case "toggle":
      tone(520, 0.05);
      tone(780, 0.06, { delay: 0.04 });
      break;
  }
}

export function toggleSound() {
  const on = !soundStore.get();
  soundStore.set(on);
  writeJson(KEYS.sound, on);
  if (on) {
    unlock();
    play("toggle");
  }
}
```

### 4. `src/game/hero.ts` ← 2158–2192
```ts
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
```

### 5. `src/game/wipe.ts` ← 2197–2246
```ts
import { STAGE_NAMES, STAGES, type StageId } from "./stages";

type Cell = [x: number, y: number, order: number];

let el: HTMLElement | null = null;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let cells: Cell[] = [];

/**
 * canvas صغير (خلية لكل 30px من الشاشة، و22px عالموبايل) والـ CSS بيكبّره بـ image-rendering: pixelated.
 * الترتيب قطري من فوق-يسار لتحت-يمين مع شوية عشوائية، فالتغطية بتطلع "ذوبان بكسلات".
 */
function setup() {
  if (!canvas) return;
  const size = window.innerWidth < 720 ? 22 : 30;
  const cols = Math.ceil(window.innerWidth / size);
  const rows = Math.ceil(window.innerHeight / size);
  canvas.width = cols;
  canvas.height = rows;
  ctx = canvas.getContext("2d");
  if (ctx) ctx.fillStyle = "#14142B";
  cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push([x, y, (x / cols + y / rows) / 2 + Math.random() * 0.22]);
    }
  }
  cells.sort((a, b) => a[2] - b[2]);
}

function run(ms: number, fill: boolean) {
  return new Promise<void>((resolve) => {
    const n = cells.length;
    const t0 = performance.now();
    let done = 0;
    const step = (t: number) => {
      const target = Math.min(n, Math.ceil(((t - t0) / ms) * n));
      for (; done < target; done++) {
        const [x, y] = cells[done];
        if (fill) ctx?.fillRect(x, y, 1, 1);
        else ctx?.clearRect(x, y, 1, 1);
      }
      if (done < n) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

export const wipe = {
  async cover(ms: number) {
    setup();
    el?.classList.add("is-on");
    await run(ms, true);
  },
  /** بنفس ترتيب التغطية: أول بكسل تغطّى أول واحد بينكشف */
  async reveal(ms: number) {
    await run(ms, false);
    el?.classList.remove("is-on");
  },
};

/** بطاقة "Stage 2 / Skills" فوق الـ wipe وهو مغطّي */
export const card = {
  show(id: StageId) {
    const i = STAGES.indexOf(id);
    const no = el?.querySelector("[data-card-no]");
    const name = el?.querySelector("[data-card-name]");
    if (no) no.textContent = i === 0 ? "Back to" : `Stage ${i}`;
    if (name) name.textContent = i === 0 ? "Title screen" : STAGE_NAMES[id];
    el?.classList.add("is-card");
  },
  hide() {
    el?.classList.remove("is-card");
  },
};

export function initWipe() {
  el = document.querySelector<HTMLElement>(".wipe");
  canvas = el?.querySelector("canvas") ?? null;

  return () => {
    el?.classList.remove("is-on", "is-card");
    el = null;
    canvas = null;
    ctx = null;
    cells = [];
  };
}
```

### 6. `src/game/dialogs.ts` ← 2491–2517
المرجع بيربط كل زر بمودال بإيده (`#menu-btn`، `[data-project]`). هون آلية وحدة: أي عنصر عليه `data-dialog="<id>"` بيفتح الـ `<dialog>` اللي هاد الـ id تبعه. بتخدم قائمة الـ pause هلق ومودالات المشاريع بالمرحلة 09.
```ts
import { play } from "./sound";

export function initDialogs() {
  const controller = new AbortController();

  document.addEventListener(
    "click",
    (e) => {
      if (!(e.target instanceof Element)) return;

      const opener = e.target.closest<HTMLElement>("[data-dialog]");
      if (opener) {
        const dialog = document.getElementById(opener.dataset.dialog ?? "");
        if (dialog instanceof HTMLDialogElement && !dialog.open) {
          play("select");
          dialog.showModal();
          // المودال بيفتح من أوله حتى لو تسكّر قبل وهو بنص الـ scroll
          dialog.querySelector(".modal-body")?.scrollTo(0, 0);
        }
        return;
      }

      // الضغط عالـ backdrop: الـ target هو الـ <dialog> نفسه (المحتوى جوّا .win اللي مغطّي كل مساحته)
      const dialog = e.target.closest("dialog");
      if (dialog && (e.target === dialog || e.target.closest("[data-close]"))) dialog.close();
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
```
> رجوع الـ focus للزر اللي فتح المودال: المتصفح بيعملها لحاله مع `showModal()`، فما في داعي لـ `modalReturn` تبع المرجع.

### 7. `src/game/router.ts` ← 2251–2361 و2599–2610
```ts
import { hero } from "./hero";
import { play } from "./sound";
import { stageStore } from "./stage-store";
import { isStageId, STAGE_NAMES, STAGES, stageFromHash, type StageId } from "./stages";
import { reducedMotion, wait } from "./util";
import { card, wipe } from "./wipe";

export type RouterOptions = {
  siteName: string;
  homeTitle: string;
  /** تنقّل لصفحة تانية بدون reload (router.push تبع Next). بينستعمل من صفحة الـ 404 بس */
  navigate: (href: string) => void;
};

let current: StageId = "home";
let busy = false;
/** آخر طلب وصل والانتقال شغّال. واحد بس: الكبسات السريعة ما بتتراكم */
let queued: { id: StageId; push: boolean } | null = null;
let titleFor: (id: StageId) => string = () => document.title;

function render(id: StageId) {
  document.documentElement.dataset.stage = id; // الـ CSS بيبيّن المرحلة والـ props تبعها
  current = id;
  stageStore.set(id); // HudNav وGroundBar وPauseMenu
  document.title = titleFor(id);
  window.scrollTo(0, 0);
}

function focusStage(id: StageId) {
  document.querySelector<HTMLElement>(`#${id} [data-stage-title]`)?.focus({ preventScroll: true });
}

function announce(id: StageId) {
  const announcer = document.querySelector("[data-announcer]");
  const i = STAGES.indexOf(id);
  if (announcer) announcer.textContent = i === 0 ? "Title screen" : `Stage ${i}: ${STAGE_NAMES[id]}`;
}

export async function go(id: StageId, { push = true }: { push?: boolean } = {}) {
  if (busy) {
    queued = { id, push };
    return;
  }
  if (id === current) {
    focusStage(id);
    return;
  }
  busy = true;

  // مودال مفتوح فوق مرحلة عم تتبدّل (Back مثلاً) بيضل فوق مرحلة غلط
  document.querySelectorAll<HTMLDialogElement>("dialog[open]").forEach((d) => d.close());
  if (push) {
    // home بدون hash. الـ state null متل v1: Next بيلف pushState وبيحط حالته جوّا الـ entry
    history.pushState(null, "", id === "home" ? location.pathname + location.search : `#${id}`);
  }
  play("warp");

  if (reducedMotion()) {
    render(id);
    hero.place();
  } else {
    hero.runOff();
    await wait(160);
    await wipe.cover(300);
    render(id); // التبديل والشاشة مغطّاية
    card.show(id);
    hero.toStart();
    await wait(560);
    card.hide();
    await wipe.reveal(300);
    void hero.runIn();
  }

  focusStage(id);
  announce(id);
  busy = false;

  if (queued) {
    const next = queued;
    queued = null;
    void go(next.id, { push: next.push });
  }
}

export function initRouter({ siteName, homeTitle, navigate }: RouterOptions) {
  const controller = new AbortController();
  const { signal } = controller;
  const timers: number[] = [];
  // صفحة الـ 404 ما فيها مراحل: روابط المراحل بتودّي عالرئيسية، والباقي (أسهم، popstate) ما بيتسجّل
  const onHome = document.getElementById("home") !== null;

  // كل رابط لمرحلة: <a href="#about">، وين ما كان بالصفحة
  document.addEventListener(
    "click",
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const link =
        e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!link) return;
      const id = (link.getAttribute("href") ?? "").slice(1);

      if (id === "main") {
        // الـ skip link: الـ focus لعنوان المرحلة الظاهرة، مش لأول الـ main
        e.preventDefault();
        if (onHome) focusStage(current);
        else document.getElementById("main")?.focus();
        return;
      }
      if (!isStageId(id)) return;

      e.preventDefault();
      if (!onHome) {
        // الرئيسية بتفتح عالمرحلة المطلوبة، وGameRoot بيعيد تشغيل المحرك لما يتغيّر الـ pathname
        navigate(`/#${id}`);
        return;
      }
      const dialog = link.closest("dialog");
      if (dialog?.open) dialog.close();
      const start = link.classList.contains("btn-start");
      play(start ? "start" : "select");
      if (start && !reducedMotion()) hero.jump();
      void go(id);
    },
    { signal },
  );

  if (!onHome) {
    hero.place(); // صفحة الـ 404: الشخصية واقفة مكانها، بدون دخول
    return () => controller.abort();
  }

  titleFor = (id) => (id === "home" ? homeTitle : `${STAGE_NAMES[id]} | ${siteName}`);

  // Back/Forward، أو حدا عدّل الـ hash بإيده. الاتنين بيوصلوا مع بعض بالـ Back: التاني بينحط بالـ queue
  // وبيلاقي المرحلة نفسها، فما بيعمل شي
  const fromUrl = () => void go(stageFromHash(location.hash), { push: false });
  window.addEventListener("popstate", fromUrl, { signal });
  window.addEventListener("hashchange", fromUrl, { signal });

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (document.querySelector("dialog[open]")) return;
      // الأسهم جوّا حقل كتابة بتحرّك المؤشر، مش المرحلة
      if (
        e.target instanceof Element &&
        e.target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }
      const i = STAGES.indexOf(current);
      if (e.key === "ArrowRight" && i < STAGES.length - 1) {
        e.preventDefault();
        void go(STAGES[i + 1]);
      }
      if (e.key === "ArrowLeft" && i > 0) {
        e.preventDefault();
        void go(STAGES[i - 1]);
      }
    },
    { signal },
  );

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!busy && !hero.isMoving()) hero.place();
      }, 120);
    },
    { signal },
  );

  // START
  const previousRestoration = history.scrollRestoration;
  history.scrollRestoration = "manual"; // كل مرحلة بتبلّش من فوق
  const first = stageFromHash(location.hash);
  render(first);
  if (reducedMotion()) {
    hero.place();
  } else {
    hero.toStart();
    // بشاشة البداية بيستنى حروف الاسم تنزل أول
    timers.push(window.setTimeout(() => void hero.runIn(700), first === "home" ? 900 : 250));
  }
  timers.push(
    window.setTimeout(() => document.documentElement.removeAttribute("data-intro"), 2600),
  );

  return () => {
    controller.abort();
    timers.forEach((t) => window.clearTimeout(t));
    window.clearTimeout(resizeTimer);
    history.scrollRestoration = previousRestoration;
    busy = false;
    queued = null;
  };
}
```

**شو تغيّر عن المرجع وليش:**

| المرجع | هون | السبب |
|--------|-----|-------|
| `history.replaceState({ stage }, …)` بأول تحميل | انشال | الـ popstate بيقرأ الـ hash مش الـ state، وNext بيدير `history.state` لحاله |
| `pushState({ stage: id }, …)` | `pushState(null, …)` | نفس السبب، ونفس اللي كان يعمله `SectionLink` بـ v1 |
| `document.title` فيه الاسم hard-coded | `titleFor` من `siteName` و`homeTitle` (props) | الـ client ما بيستورد `site.ts` |
| `$$('[data-stage-link]')` لتحديث الـ `aria-current` | `stageStore.set(id)` | React بيحدّث الـ HUD والـ pause والـ ground bar |
| - | تسكير أي `dialog[open]` بأول `go()` | مودالات المشاريع (المرحلة 09) |
| - | `onHome` و`navigate` | صفحة الـ 404 بتشارك نفس الـ layout: روابط المراحل فيها بتروح للرئيسية بـ `router.push` (الـ lint تبع Next بيمنع `location.assign` لروابط داخلية) |

### 8. `src/game/engine.ts`
```ts
import { initDialogs } from "./dialogs";
import { initHero } from "./hero";
import { initRouter, type RouterOptions } from "./router";
import { initWipe } from "./wipe";

export type EngineOptions = RouterOptions;

/** بيشغّل كل أجزاء المحرك وبيرجّع cleanup واحد. الترتيب مهم: الـ router بيحرّك الشخصية بأول عرض */
export function initEngine(options: EngineOptions) {
  const cleanups = [initHero(), initWipe(), initDialogs(), initRouter(options)];
  return () => cleanups.forEach((cleanup) => cleanup());
}
```
> المرحلة 08 بتضيف `initPops()`، والمرحلة 11 بتضيف `initGems()`.

### 9. `src/components/game/game-root.tsx` (النسخة النهائية)
```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

import { reapplyBoot } from "@/game/boot";
import { initEngine } from "@/game/engine";
import { applyTime, timeStore } from "@/game/time";

/** siteName وhomeTitle من الـ layout (Server): الـ client ما بيستورد @/content/site */
type GameRootProps = { siteName: string; homeTitle: string };

/** نقطة الوصل الوحيدة بين React والمحرك. ما بيرسم شي */
export function GameRoot({ siteName, homeTitle }: GameRootProps) {
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    reapplyBoot();
    // الـ meta theme-color من السيرفر دايماً لون النهار
    applyTime(timeStore.get());
  }, []);

  // pathname بالـ deps: الرجوع من صفحة الـ 404 للرئيسية (بدون reload) بيعيد تشغيل المحرك على المراحل
  useEffect(
    () => initEngine({ siteName, homeTitle, navigate: (href) => router.push(href) }),
    [pathname, router, siteName, homeTitle],
  );

  return null;
}
```

### 10. `src/components/game/sound-toggle.tsx`
```tsx
"use client";

import { PixelIcon } from "@/components/pixel/pixel-icon";
import { soundStore, toggleSound } from "@/game/sound";
import { useStore } from "@/game/store";

type SoundToggleProps = {
  className: string;
  /** نص الزر (بقائمة الـ pause). بدونه الزر أيقونة بس، وبياخد aria-label */
  children?: React.ReactNode;
};

export function SoundToggle({ className, children }: SoundToggleProps) {
  const on = useStore(soundStore, false);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label={children ? undefined : "Sound effects"}
      onClick={toggleSound}
    >
      <PixelIcon name={on ? "sound-on" : "sound-off"} />
      {children}
    </button>
  );
}
```

**وبـ `time-toggle.tsx`:** ضيف صوت التبديل (المرجع، السطر 2151):
```tsx
import { play } from "@/game/sound";
// ...
      onClick={() => {
        toggleTime();
        play("toggle");
      }}
```

**وبـ `hud.tsx`:** حط الزر مكان التعليق، قبل `<TimeToggle>`:
```tsx
<SoundToggle className={btn({ variant: "ghost", size: "icon" }, "sound-btn")} />
```
(`sound-btn`: الـ CSS بيخفيه تحت 720px. بيضل موجود بقائمة الـ pause.)

### 11. `src/components/layout/overlays.tsx`
```tsx
/**
 * عناصر فوق الصفحة بيتحكم فيها المحرك مباشرة (classes وtextContent): الـ wipe وبطاقة المرحلة،
 * الـ toast، والـ announcer لقارئ الشاشة. Server Component: ما بينعاد رسمه، فتعديلات المحرك بتضل.
 */
export function Overlays() {
  return (
    <>
      <div className="wipe" aria-hidden="true">
        <canvas />
        <div className="stage-card">
          <div className="hero-sprite card-hero" data-state="run" />
          <p className="card-no" data-card-no>
            Stage 1
          </p>
          <p className="card-name" data-card-name>
            About
          </p>
        </div>
      </div>

      <div className="toast" role="status" aria-live="polite" />
      <p className="sr-only" aria-live="polite" data-announcer />
    </>
  );
}
```

### 12. `src/components/game/pause-menu.tsx`
```tsx
"use client";

import { SoundToggle } from "@/components/game/sound-toggle";
import { TimeToggle } from "@/components/game/time-toggle";
import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { stageStore } from "@/game/stage-store";
import { GEM_IDS, STAGE_NAMES, STAGES, type StageId } from "@/game/stages";
import { useStore } from "@/game/store";
import type { PixelIconName } from "@/pixel/sprites/icons";

const ICON: Record<StageId, PixelIconName> = {
  home: "home",
  about: "profile",
  skills: "code",
  experience: "briefcase",
  projects: "grid",
  contact: "mail",
};

/** قائمة التنقل تحت 1240px (لما الـ nav بيختفي من الـ HUD). بتنفتح بزر Menu (data-dialog="pause-menu") */
export function PauseMenu() {
  const current = useStore(stageStore, "home");
  const small = btn({ variant: "ghost", size: "small" });

  return (
    <dialog
      id="pause-menu"
      className="modal"
      aria-labelledby="pause-title"
      style={{ width: "min(100% - 24px, 420px)" }}
    >
      <div className="win pause-win">
        <h2 id="pause-title" className="pause-title">
          {labels.pause.title}
        </h2>
        <p className="pause-sub">{labels.pause.sub}</p>
        <p className="pause-gems">
          <span className="gem-ico" aria-hidden="true" />
          <span>
            {/* ثابت لهلق. المرحلة 11 بتبدّل الـ 0 بـ <GemCounter /> */}
            <span>0/{GEM_IDS.length}</span> {labels.pause.gems}
          </span>
        </p>

        <nav aria-label="Stages (menu)">
          <ul className="pause-list">
            {STAGES.map((id, i) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={current === id ? "page" : undefined}>
                  <PixelIcon name={ICON[id]} />
                  {i === 0 ? "Title screen" : `${i}. ${STAGE_NAMES[id]}`}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pause-tools">
          <SoundToggle className={small}>Sound</SoundToggle>
          <TimeToggle className={small}>Night</TimeToggle>
        </div>
        <button type="button" className={btn({}, "pause-resume")} data-close>
          <PixelIcon name="play" />
          {labels.pause.resume}
        </button>
      </div>
    </dialog>
  );
}
```

### 13. `src/components/stages/stage.tsx`
```tsx
import { site } from "@/content/site";
import { STAGE_NAMES, STAGES, type StageId } from "@/game/stages";

type StageProps = { id: Exclude<StageId, "home">; children: React.ReactNode };

/**
 * إطار المرحلة: "Stage N" + العنوان + السطر اللي تحته. شاشة البداية إلها شكلها الخاص (title-screen.tsx).
 * tabIndex -1 وdata-stage-title عالعنوان: الـ router بيحط الـ focus عليه بعد كل انتقال.
 * h2 مش h1 متل المرجع: الـ h1 الوحيد بالصفحة هو الاسم بشاشة البداية.
 */
export function Stage({ id, children }: StageProps) {
  return (
    <section id={id} className="stage" aria-labelledby={`${id}-title`}>
      <div className="stage-inner">
        <header className="stage-head">
          <p className="stage-no">Stage {STAGES.indexOf(id)}</p>
          <h2 id={`${id}-title`} className="stage-title" tabIndex={-1} data-stage-title>
            {STAGE_NAMES[id]}
          </h2>
          <p className="stage-sub">{site.stageSubs[id]}</p>
          {/* المرحلة 11 بتضيف زر الجوهرة هون */}
        </header>
        {children}
      </div>
    </section>
  );
}
```

### 14. `src/app/layout.tsx`
كمّل الـ `<body>`:
```tsx
        <GroundBar name={site.name} year={new Date().getFullYear()} />
        <Overlays />
        <PauseMenu />
        <GameRoot siteName={site.name} homeTitle={defaultTitle} />
      </body>
```

### 15. `src/app/page.tsx` (مراحل مؤقتة لتجربة التنقل)
```tsx
export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />

      {/* مؤقت: بيتبدّل بـ <TitleScreen /> بالمرحلة 07 */}
      <section id="home" className="stage" aria-labelledby="home-title">
        <div className="stage-inner">
          <h1 id="home-title" className="stage-title" tabIndex={-1} data-stage-title>
            {site.name}
          </h1>
          <p style={{ marginTop: 24 }}>
            <a className="btn btn-start" href="#about">
              Press start
            </a>
          </p>
        </div>
      </section>

      {/* مؤقت: كل مرحلة بتتبدّل بمكوّنها بالمراحل 07 لـ 10 */}
      {GEM_IDS.map((id) => (
        <Stage key={id} id={id}>
          <div className="win">
            <p>{STAGE_NAMES[id]} content comes in a later phase.</p>
          </div>
        </Stage>
      ))}
    </>
  );
}
```
مع الـ imports: `Stage` من `@/components/stages/stage`، و`GEM_IDS` و`STAGE_NAMES` من `@/game/stages`.
> `GEM_IDS` هي نفسها ids المراحل الخمسة بدون `home`، وبالنوع الصح لـ `Stage`.

## الملفات
`src/styles/pixel/{stages,overlays}.css`، `src/game/{util,sound,hero,wipe,dialogs,router,engine}.ts`، `src/components/game/{game-root,sound-toggle,time-toggle,pause-menu}.tsx`، `src/components/layout/{overlays,hud}.tsx`، `src/components/stages/stage.tsx`، `src/app/{layout,page}.tsx`

## Definition of Done
**الانتقال (قارن التوقيت مع المرجع جنب بعض):**
- [ ] كبسة عـ "Skills" بالـ HUD: الشخصية بتركض وبتطلع من اليمين ← الـ wipe بيغطي من فوق-يسار ← بطاقة "Stage 2 / Skills" مع الشخصية عم تركض ← الكشف ← الشخصية بتفوت من اليسار وبتوقف.
- [ ] الرابط بيصير `/#skills`، والـ title "Skills | Mohammad Shaquqa"، و"Skills" بالـ HUD دهبي، والـ ground bar "About" و"Experience".
- [ ] العالم بيتبدّل والشاشة مغطّاية (الـ skyline بـ Experience، صندوق البريد بـ Contact).
- [ ] الرجوع لـ Title (كبسة عالاسم بالـ HUD): البطاقة "Back to / Title screen"، والرابط بيرجع `/` بدون hash.

**كل طرق التنقل:**
- [ ] الأسهم يمين/يسار. وما بتشتغل والـ focus جوّا input، ولا والـ pause مفتوح.
- [ ] Back وForward بالمتصفح: المرحلة بتتبدّل مع الانتقال، و**بدون reload** (تاب الـ Network: ما في request للـ document).
- [ ] فتح `/#projects` مباشرة: بتفتح على Projects فوراً، والشخصية بتفوت بعد ربع ثانية.
- [ ] 4 كبسات سريعة ورا بعض على روابط مختلفة: بيخلص الانتقال الأول وبعدين بيروح عآخر وحدة بس.
- [ ] كبسة عرابط المرحلة الحالية: ما بيصير انتقال.

**الـ focus وقارئ الشاشة:**
- [ ] بعد كل انتقال `document.activeElement` هو عنوان المرحلة (`h2`)، والـ Tab اللي بعده بيروح لأول عنصر بالمرحلة.
- [ ] الـ `[data-announcer]` بيصير نصه "Stage 2: Skills".
- [ ] Tab من أول الصفحة ← "Skip to content" ← Enter: الـ focus عند عنوان المرحلة الظاهرة.

**الشخصية والصوت:**
- [ ] كبسة عالشخصية: بتقفز. وبتقدر تقفز وهي عم تركض.
- [ ] "Press start": الشخصية بتقفز وبعدها الانتقال.
- [ ] الصوت مطفي بالأول. زر الصوت ← بيصير دهبي وبتسمع نغمة، وبعدها كل انتقال إله صوت. Refresh ← بيضل مفعّل.
- [ ] تغيير حجم النافذة: الشخصية بترجع لمكانها (6% من العرض).

**قائمة الـ pause (على 1024px):**
- [ ] زر Menu بيفتحها، والخلفية بتغمق. الـ focus جوّاها وما بيطلع بالـ Tab.
- [ ] Esc، زر Resume، والضغط برّاها: التلاتة بيسكّروها، والـ focus بيرجع لزر Menu.
- [ ] اختيار مرحلة: بتتسكّر وبيصير الانتقال. المرحلة الحالية دهبية.
- [ ] زرّين Sound وNight شغالين ومتزامنين مع أزرار الـ HUD.

**Reduced motion (DevTools ← Rendering):**
- [ ] التبديل فوري بدون wipe ولا ركض، والـ focus والـ title والـ announcer متل ما هم.

**عام:**
- [ ] بالـ dev: كبسة وحدة = انتقال واحد (الـ cleanup شغّال مع الـ Strict Mode).
- [ ] ما في hydration warnings، و`npm run lint && npm run build && npm run sprites:check` ناجحين.
