import { labels } from "@/content/labels";

import { confetti, toast } from "./effects";
import { KEYS, readJson, writeJson } from "./persist";
import { play } from "./sound";
import { GEM_IDS, type GemId } from "./stages";
import { createStore } from "./store";

const isGemId = (value: unknown): value is GemId => (GEM_IDS as readonly unknown[]).includes(value);

/** نفس فلترة الـ boot script: بس الـ ids المعروفة، وبترتيب المراحل */
function initialGems(): readonly GemId[] {
  if (typeof window === "undefined") return [];
  const saved = readJson<unknown>(KEYS.gems, []);
  return Array.isArray(saved) ? GEM_IDS.filter((id) => saved.includes(id)) : [];
}

/** مصفوفة جديدة مع كل تغيير (مش Set بيتعدّل بمكانه): useSyncExternalStore بيقارن بالـ reference */
export const gemsStore = createStore<readonly GemId[]>(initialGems());

function collect(button: HTMLElement) {
  const id = button.dataset.gem;
  if (!isGemId(id) || gemsStore.get().includes(id)) return;

  const gems = [...gemsStore.get(), id];
  gemsStore.set(gems); // العدّاد بيزيد فوراً
  writeJson(KEYS.gems, gems);
  play("gem");

  const rect = button.getBoundingClientRect();
  confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);

  // الزر رح يختفي: الـ focus بيروح لعنوان المرحلة بدل ما يضيع عالـ body
  const heading = document.querySelector<HTMLElement>(`#${id} [data-stage-title]`);
  const hadFocus = document.activeElement === button;
  button.classList.add("is-collected"); // حركة gem-get: بتطير لفوق وبتختفي (0.5s)
  setTimeout(() => {
    button.classList.remove("is-collected");
    document.documentElement.dataset.gems = gems.join(" "); // الـ CSS بيخبّيها من هلق وطالع
    if (document.activeElement === document.body) heading?.focus({ preventScroll: true });
  }, 500);
  if (hadFocus) heading?.focus({ preventScroll: true });

  if (gems.length === GEM_IDS.length) {
    setTimeout(() => {
      toast(labels.gems.all);
      play("success");
      confetti(window.innerWidth / 2, window.innerHeight / 3, 48);
    }, 450);
  } else {
    toast(`Gem ${gems.length} of ${GEM_IDS.length} found`);
  }
}

export function initGems() {
  const controller = new AbortController();

  document.addEventListener(
    "click",
    (e) => {
      const button = e.target instanceof Element ? e.target.closest<HTMLElement>(".gem") : null;
      if (button) collect(button);
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
