"use client";

import { gemsStore } from "@/game/gems";
import { GEM_IDS, type GemId } from "@/game/stages";
import { useStore } from "@/game/store";

/** برّا المكوّن: الـ server snapshot لازم يكون نفس الـ reference كل مرة (store.ts) */
const NONE: readonly GemId[] = [];

/**
 * "2/5". السيرفر بيرسم 0/5، وبعد الـ hydration بيصير الرقم المحفوظ.
 * نص واحد (template string): `{a}/{b}` بيطلع 3 قطع نص وبيكسر الـ kerning بخط Pixelify (قائمة الـ pause).
 */
export function GemCounter() {
  const gems = useStore(gemsStore, NONE);

  return <span>{`${gems.length}/${GEM_IDS.length}`}</span>;
}
