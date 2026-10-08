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
