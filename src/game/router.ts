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
  if (announcer)
    announcer.textContent = i === 0 ? "Title screen" : `Stage ${i}: ${STAGE_NAMES[id]}`;
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
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
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

  // إضافة عن المرجع: React بيعمل hydration للـ <title> بعد ما المحرك يشتغل، وبيرجّعه لعنوان الصفحة
  // الافتراضي. بدون هالمراقبة، فتح /#projects مباشرة بيضل عنوانه عنوان الرئيسية
  const titleObserver = new MutationObserver(() => {
    const wanted = titleFor(current);
    if (document.title !== wanted) document.title = wanted;
  });
  titleObserver.observe(document.head, { childList: true, subtree: true, characterData: true });

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
    titleObserver.disconnect();
    timers.forEach((t) => window.clearTimeout(t));
    window.clearTimeout(resizeTimer);
    history.scrollRestoration = previousRestoration;
    busy = false;
    queued = null;
  };
}
