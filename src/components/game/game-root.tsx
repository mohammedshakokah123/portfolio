"use client";

import { useLayoutEffect } from "react";

import { reapplyBoot } from "@/game/boot";

/** نقطة الوصل بين React والمحرك. هلق بس بيرجّع attributes الـ <html>، والمرحلة 06 بتضيف تشغيل المحرك */
export function GameRoot() {
  useLayoutEffect(() => {
    reapplyBoot();
  }, []);

  return null;
}
