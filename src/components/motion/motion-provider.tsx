"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

/**
 * LazyMotion + `m.*` بيخفف الـ bundle، و`strict` بيطلّع خطأ إذا حدا استعمل `motion.*` بالغلط.
 * reducedMotion="user": مع `prefers-reduced-motion` الـ transforms بتوقف وبيضل بس الـ opacity.
 * domAnimation بيكفي: ما في layout animations (الـ nav indicator بالـ CSS، لأن domMax كان بيزيد ~13.7KB).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
