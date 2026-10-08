import { KEYS } from "./persist";
import { GEM_IDS, STAGES } from "./stages";

/**
 * بيحط حالة الصفحة عالـ <html> قبل أول paint: data-js، data-stage (من الـ hash)، data-time، data-gems، data-intro.
 *
 * ⚠️ self-contained: الـ function بتتحوّل لنص بـ toString() وبتتنفّذ inline بالـ <head>، فممنوع تستعمل جوّاها
 * أي import أو متغيّر من برّاها. كل شي بيلزمها بيوصلها كـ argument.
 */
export function boot(
  stages: readonly string[],
  gemIds: readonly string[],
  timeKey: string,
  gemsKey: string,
  intro: boolean,
) {
  const root = document.documentElement;
  root.setAttribute("data-js", "");

  let hash = location.hash.slice(1);
  try {
    hash = decodeURIComponent(hash);
  } catch {
    /* hash مش صالح ← home */
  }
  const stage = stages.includes(hash) ? hash : "home";
  root.setAttribute("data-stage", stage);

  let time: string | null = null;
  try {
    time = localStorage.getItem(timeKey);
  } catch {
    /* storage blocked */
  }
  if (time !== "day" && time !== "night") {
    time = matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
  }
  root.setAttribute("data-time", time);

  let saved: unknown = [];
  try {
    saved = JSON.parse(localStorage.getItem(gemsKey) ?? "[]");
  } catch {
    /* storage blocked أو JSON خربان */
  }
  const list: unknown[] = Array.isArray(saved) ? saved : [];
  root.setAttribute("data-gems", gemIds.filter((id) => list.includes(id)).join(" "));

  // حركة الحروف بشاشة البداية: بس عند فتح الصفحة على home، وبدون reduced motion
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (intro && stage === "home" && !reduce) root.setAttribute("data-intro", "");
}

const ARGS = [STAGES, GEM_IDS, KEYS.time, KEYS.gems] as const;

/** نص الـ <script> بالـ layout */
export const bootScript = `(${boot.toString()})(${[...ARGS, true].map((a) => JSON.stringify(a)).join(",")})`;

/**
 * بالـ dev، الـ Strict Mode بيعمل remount وبيرجّع <html> للـ attributes اللي React بيعرفها بس، فبيمسح
 * اللي حطها السكربت. GameRoot بينادي هي بـ useLayoutEffect ليرجّعها. بالـ production ما بتغيّر شي.
 * الـ intro بترجع بس إذا الصفحة لسا عم تفتح (أول 2.6 ثانية، مدة الحركة).
 */
export function reapplyBoot() {
  boot(...ARGS, performance.now() < 2600);
}
