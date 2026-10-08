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
