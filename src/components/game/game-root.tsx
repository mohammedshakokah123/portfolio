"use client";

import { useLayoutEffect } from "react";

import { reapplyBoot } from "@/game/boot";
import { applyTime, timeStore } from "@/game/time";

/** نقطة الوصل بين React والمحرك. هلق بيرجّع attributes الـ <html> وبيزامن لون المتصفح، والمرحلة 06 بتضيف تشغيل المحرك */
export function GameRoot() {
  useLayoutEffect(() => {
    reapplyBoot();
    // الـ meta theme-color من السيرفر دايماً لون النهار
    applyTime(timeStore.get());
  }, []);

  return null;
}
